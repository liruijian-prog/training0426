from __future__ import annotations

import os
import sqlite3
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Optional


def _default_project_root() -> Path:
    # This file: PLAYER/src/player/db/database.py -> project root is 4 parents up
    return Path(__file__).resolve().parents[3]


@dataclass(frozen=True)
class DatabaseConfig:
    db_path: Path
    schema_path: Path


class DatabaseManager:
    """
    SQLite connection + initialization manager.

    Responsibilities:
    - Create/connect to a SQLite database file
    - Enable FK constraints for each connection (SQLite default is OFF)
    - Execute schema SQL (DDL) to create tables/indexes
    - Provide connections on demand
    """

    def __init__(self, config: DatabaseConfig):
        self._config = config

    @staticmethod
    def from_default_paths(
        project_root: Optional[Path] = None,
        db_relpath: str = os.path.join("data", "player.db"),
        schema_relpath: str = os.path.join("sql", "schema.sql"),
    ) -> "DatabaseManager":
        root = project_root or _default_project_root()
        return DatabaseManager(
            DatabaseConfig(
                db_path=(root / db_relpath),
                schema_path=(root / schema_relpath),
            )
        )

    def get_connection(self) -> sqlite3.Connection:
        self._config.db_path.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(self._config.db_path)
        conn.row_factory = sqlite3.Row
        # MUST be enabled per-connection in SQLite.
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn

    def initialize(self) -> None:
        sql = self._read_schema_sql()
        with self.get_connection() as conn:
            conn.executescript(sql)

    def _read_schema_sql(self) -> str:
        if not self._config.schema_path.exists():
            raise FileNotFoundError(f"Schema SQL not found: {self._config.schema_path}")
        return self._config.schema_path.read_text(encoding="utf-8")

    def execute(self, statements: Iterable[str]) -> None:
        """
        Convenience method for executing a list of SQL statements.
        Prefer parameterized queries for DML in real code.
        """
        with self.get_connection() as conn:
            for stmt in statements:
                conn.execute(stmt)
            conn.commit()


def init_db(
    project_root: Optional[Path] = None,
    db_relpath: str = os.path.join("data", "player.db"),
    schema_relpath: str = os.path.join("sql", "schema.sql"),
) -> DatabaseManager:
    """
    One-call helper:
    - Creates DB file if missing
    - Runs schema SQL idempotently
    - Returns a ready DatabaseManager
    """
    mgr = DatabaseManager.from_default_paths(
        project_root=project_root,
        db_relpath=db_relpath,
        schema_relpath=schema_relpath,
    )
    mgr.initialize()
    return mgr


if __name__ == "__main__":
    mgr = init_db()
    with mgr.get_connection() as conn:
        row = conn.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;").fetchall()
    print("Initialized tables:", [r["name"] for r in row])

