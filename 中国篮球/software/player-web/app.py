from __future__ import annotations

import sqlite3
from pathlib import Path
from typing import Any

from flask import Flask, flash, redirect, render_template, request, url_for


APP_ROOT = Path(__file__).resolve().parent
DB_PATH = APP_ROOT / "data" / "player.db"
SCHEMA_PATH = APP_ROOT / "sql" / "schema.sql"


def create_app() -> Flask:
    app = Flask(__name__)
    app.secret_key = "dev-secret-key-change-me"  # for flash messages only

    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    init_db()

    @app.get("/")
    def index():
        return redirect(url_for("players_list"))

    @app.get("/players")
    def players_list():
        q = (request.args.get("q") or "").strip()
        with get_conn() as conn:
            if q:
                rows = conn.execute(
                    """
                    SELECT player_id, national_id, player_type, organization, ethnicity, birthplace, age
                    FROM player
                    WHERE national_id LIKE ? OR player_type LIKE ? OR organization LIKE ?
                    ORDER BY player_id DESC
                    """,
                    (f"%{q}%", f"%{q}%", f"%{q}%"),
                ).fetchall()
            else:
                rows = conn.execute(
                    """
                    SELECT player_id, national_id, player_type, organization, ethnicity, birthplace, age
                    FROM player
                    ORDER BY player_id DESC
                    """
                ).fetchall()
        return render_template("players_list.html", players=rows, q=q)

    @app.route("/players/new", methods=["GET", "POST"])
    def players_new():
        if request.method == "POST":
            form = _player_form_from_request()
            try:
                with get_conn() as conn:
                    cur = conn.execute(
                        """
                        INSERT INTO player(national_id, player_type, age, ethnicity, birthplace, organization)
                        VALUES (?, ?, ?, ?, ?, ?)
                        """,
                        (
                            form["national_id"],
                            form["player_type"],
                            form["age"],
                            form["ethnicity"],
                            form["birthplace"],
                            form["organization"],
                        ),
                    )
                    player_id = cur.lastrowid
                    conn.execute("INSERT OR IGNORE INTO player_profile(player_id) VALUES (?)", (player_id,))
                    conn.execute("INSERT OR IGNORE INTO player_family(player_id) VALUES (?)", (player_id,))
                    conn.commit()
                flash("已创建球员。", "success")
                return redirect(url_for("player_detail", player_id=player_id))
            except sqlite3.IntegrityError as e:
                flash(f"保存失败：{e}", "error")
                return render_template("player_form.html", mode="new", player=form)
        return render_template("player_form.html", mode="new", player={})

    @app.route("/players/<int:player_id>/edit", methods=["GET", "POST"])
    def players_edit(player_id: int):
        with get_conn() as conn:
            player = conn.execute("SELECT * FROM player WHERE player_id = ?", (player_id,)).fetchone()
            if not player:
                flash("球员不存在。", "error")
                return redirect(url_for("players_list"))

        if request.method == "POST":
            form = _player_form_from_request()
            try:
                with get_conn() as conn:
                    conn.execute(
                        """
                        UPDATE player
                        SET national_id = ?,
                            player_type = ?,
                            age = ?,
                            ethnicity = ?,
                            birthplace = ?,
                            organization = ?,
                            updated_at = (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
                        WHERE player_id = ?
                        """,
                        (
                            form["national_id"],
                            form["player_type"],
                            form["age"],
                            form["ethnicity"],
                            form["birthplace"],
                            form["organization"],
                            player_id,
                        ),
                    )
                    conn.commit()
                flash("已保存修改。", "success")
                return redirect(url_for("player_detail", player_id=player_id))
            except sqlite3.IntegrityError as e:
                flash(f"保存失败：{e}", "error")
                return render_template("player_form.html", mode="edit", player_id=player_id, player=form)

        return render_template("player_form.html", mode="edit", player_id=player_id, player=dict(player))

    @app.post("/players/<int:player_id>/delete")
    def players_delete(player_id: int):
        with get_conn() as conn:
            conn.execute("DELETE FROM player WHERE player_id = ?", (player_id,))
            conn.commit()
        flash("已删除球员。", "success")
        return redirect(url_for("players_list"))

    @app.get("/players/<int:player_id>")
    def player_detail(player_id: int):
        with get_conn() as conn:
            player = conn.execute("SELECT * FROM player WHERE player_id = ?", (player_id,)).fetchone()
            if not player:
                flash("球员不存在。", "error")
                return redirect(url_for("players_list"))

            profile = conn.execute(
                "SELECT * FROM player_profile WHERE player_id = ?", (player_id,)
            ).fetchone()
            family = conn.execute("SELECT * FROM player_family WHERE player_id = ?", (player_id,)).fetchone()
            spouses = conn.execute(
                "SELECT * FROM spouse WHERE player_id = ? ORDER BY is_current DESC, spouse_id DESC",
                (player_id,),
            ).fetchall()
            children = conn.execute(
                "SELECT * FROM child WHERE player_id = ? ORDER BY child_id DESC", (player_id,)
            ).fetchall()
            passports = conn.execute(
                "SELECT * FROM passport WHERE player_id = ? ORDER BY is_current DESC, passport_id DESC",
                (player_id,),
            ).fetchall()
            matches = conn.execute(
                "SELECT * FROM match_schedule WHERE player_id = ? ORDER BY start_time DESC, match_id DESC",
                (player_id,),
            ).fetchall()

        return render_template(
            "player_detail.html",
            player=player,
            profile=profile,
            family=family,
            spouses=spouses,
            children=children,
            passports=passports,
            matches=matches,
        )

    @app.post("/players/<int:player_id>/profile")
    def profile_update(player_id: int):
        height_cm = _to_float_or_none(request.form.get("height_cm"))
        weight_kg = _to_float_or_none(request.form.get("weight_kg"))
        shoe_size = (request.form.get("shoe_size") or "").strip() or None
        clothing_size = (request.form.get("clothing_size") or "").strip() or None
        with get_conn() as conn:
            conn.execute("INSERT OR IGNORE INTO player_profile(player_id) VALUES (?)", (player_id,))
            conn.execute(
                """
                UPDATE player_profile
                SET height_cm = ?, weight_kg = ?, shoe_size = ?, clothing_size = ?
                WHERE player_id = ?
                """,
                (height_cm, weight_kg, shoe_size, clothing_size, player_id),
            )
            conn.commit()
        flash("已保存身体数据。", "success")
        return redirect(url_for("player_detail", player_id=player_id))

    @app.post("/players/<int:player_id>/family")
    def family_update(player_id: int):
        father_name = (request.form.get("father_name") or "").strip() or None
        mother_name = (request.form.get("mother_name") or "").strip() or None
        marital_status = (request.form.get("marital_status") or "").strip() or None
        with get_conn() as conn:
            conn.execute("INSERT OR IGNORE INTO player_family(player_id) VALUES (?)", (player_id,))
            conn.execute(
                """
                UPDATE player_family
                SET father_name = ?, mother_name = ?, marital_status = ?
                WHERE player_id = ?
                """,
                (father_name, mother_name, marital_status, player_id),
            )
            conn.commit()
        flash("已保存家庭信息。", "success")
        return redirect(url_for("player_detail", player_id=player_id))

    @app.post("/players/<int:player_id>/children/add")
    def child_add(player_id: int):
        child_name = (request.form.get("child_name") or "").strip()
        child_age = _to_int_or_none(request.form.get("child_age"))
        if not child_name:
            flash("孩子姓名不能为空。", "error")
            return redirect(url_for("player_detail", player_id=player_id))
        with get_conn() as conn:
            conn.execute(
                "INSERT INTO child(player_id, child_name, child_age) VALUES (?, ?, ?)",
                (player_id, child_name, child_age),
            )
            conn.commit()
        flash("已添加孩子。", "success")
        return redirect(url_for("player_detail", player_id=player_id))

    @app.post("/children/<int:child_id>/delete")
    def child_delete(child_id: int):
        player_id = int(request.form.get("player_id") or "0")
        with get_conn() as conn:
            conn.execute("DELETE FROM child WHERE child_id = ?", (child_id,))
            conn.commit()
        flash("已删除孩子记录。", "success")
        return redirect(url_for("player_detail", player_id=player_id))

    @app.post("/players/<int:player_id>/spouses/add")
    def spouse_add(player_id: int):
        spouse_name = (request.form.get("spouse_name") or "").strip()
        spouse_nationality = (request.form.get("spouse_nationality") or "").strip() or None
        is_current = 1 if (request.form.get("is_current") == "1") else 0
        if not spouse_name:
            flash("配偶姓名不能为空。", "error")
            return redirect(url_for("player_detail", player_id=player_id))
        with get_conn() as conn:
            if is_current:
                conn.execute("UPDATE spouse SET is_current = 0 WHERE player_id = ?", (player_id,))
            conn.execute(
                """
                INSERT INTO spouse(player_id, spouse_name, spouse_nationality, is_current)
                VALUES (?, ?, ?, ?)
                """,
                (player_id, spouse_name, spouse_nationality, is_current),
            )
            conn.commit()
        flash("已添加配偶记录。", "success")
        return redirect(url_for("player_detail", player_id=player_id))

    @app.post("/spouses/<int:spouse_id>/delete")
    def spouse_delete(spouse_id: int):
        player_id = int(request.form.get("player_id") or "0")
        with get_conn() as conn:
            conn.execute("DELETE FROM spouse WHERE spouse_id = ?", (spouse_id,))
            conn.commit()
        flash("已删除配偶记录。", "success")
        return redirect(url_for("player_detail", player_id=player_id))

    @app.post("/players/<int:player_id>/passports/add")
    def passport_add(player_id: int):
        passport_no = (request.form.get("passport_no") or "").strip()
        valid_until = (request.form.get("valid_until") or "").strip() or None
        is_current = 1 if (request.form.get("is_current") == "1") else 0
        if not passport_no:
            flash("护照号不能为空。", "error")
            return redirect(url_for("player_detail", player_id=player_id))
        try:
            with get_conn() as conn:
                if is_current:
                    conn.execute("UPDATE passport SET is_current = 0 WHERE player_id = ?", (player_id,))
                conn.execute(
                    """
                    INSERT INTO passport(player_id, passport_no, valid_until, is_current)
                    VALUES (?, ?, ?, ?)
                    """,
                    (player_id, passport_no, valid_until, is_current),
                )
                conn.commit()
            flash("已添加护照。", "success")
        except sqlite3.IntegrityError as e:
            flash(f"添加护照失败：{e}", "error")
        return redirect(url_for("player_detail", player_id=player_id))

    @app.post("/passports/<int:passport_id>/delete")
    def passport_delete(passport_id: int):
        player_id = int(request.form.get("player_id") or "0")
        with get_conn() as conn:
            conn.execute("DELETE FROM passport WHERE passport_id = ?", (passport_id,))
            conn.commit()
        flash("已删除护照记录。", "success")
        return redirect(url_for("player_detail", player_id=player_id))

    @app.post("/players/<int:player_id>/matches/add")
    def match_add(player_id: int):
        title = (request.form.get("title") or "").strip()
        start_time = (request.form.get("start_time") or "").strip() or None
        end_time = (request.form.get("end_time") or "").strip() or None
        location = (request.form.get("location") or "").strip() or None
        notes = (request.form.get("notes") or "").strip() or None
        if not title:
            flash("比赛标题不能为空。", "error")
            return redirect(url_for("player_detail", player_id=player_id))
        with get_conn() as conn:
            conn.execute(
                """
                INSERT INTO match_schedule(player_id, title, start_time, end_time, location, notes)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (player_id, title, start_time, end_time, location, notes),
            )
            conn.commit()
        flash("已添加比赛日程。", "success")
        return redirect(url_for("player_detail", player_id=player_id))

    @app.post("/matches/<int:match_id>/delete")
    def match_delete(match_id: int):
        player_id = int(request.form.get("player_id") or "0")
        with get_conn() as conn:
            conn.execute("DELETE FROM match_schedule WHERE match_id = ?", (match_id,))
            conn.commit()
        flash("已删除比赛日程。", "success")
        return redirect(url_for("player_detail", player_id=player_id))

    return app


def init_db() -> None:
    schema_sql = SCHEMA_PATH.read_text(encoding="utf-8")
    with get_conn() as conn:
        conn.executescript(schema_sql)


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def _player_form_from_request() -> dict[str, Any]:
    national_id = (request.form.get("national_id") or "").strip()
    player_type = (request.form.get("player_type") or "").strip()
    if not national_id or not player_type:
        raise sqlite3.IntegrityError("national_id 和 player_type 为必填项")
    return {
        "national_id": national_id,
        "player_type": player_type,
        "age": _to_int_or_none(request.form.get("age")),
        "ethnicity": (request.form.get("ethnicity") or "").strip() or None,
        "birthplace": (request.form.get("birthplace") or "").strip() or None,
        "organization": (request.form.get("organization") or "").strip() or None,
    }


def _to_int_or_none(v: str | None) -> int | None:
    s = (v or "").strip()
    if not s:
        return None
    try:
        return int(s)
    except ValueError:
        return None


def _to_float_or_none(v: str | None) -> float | None:
    s = (v or "").strip()
    if not s:
        return None
    try:
        return float(s)
    except ValueError:
        return None


if __name__ == "__main__":
    app = create_app()
    app.run(host="127.0.0.1", port=5000, debug=True)

