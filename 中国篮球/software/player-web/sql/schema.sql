-- SQLite schema for Player Web App
PRAGMA foreign_keys = ON;

BEGIN;

CREATE TABLE IF NOT EXISTS player (
  player_id     INTEGER PRIMARY KEY AUTOINCREMENT,
  national_id   TEXT    NOT NULL,
  player_type   TEXT    NOT NULL,
  age           INTEGER,
  ethnicity     TEXT,
  birthplace    TEXT,
  organization  TEXT,
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CONSTRAINT uq_player_national_id UNIQUE (national_id)
);

CREATE INDEX IF NOT EXISTS idx_player_type ON player(player_type);
CREATE INDEX IF NOT EXISTS idx_player_org ON player(organization);

CREATE TABLE IF NOT EXISTS player_profile (
  player_id      INTEGER PRIMARY KEY,
  height_cm      REAL,
  weight_kg      REAL,
  shoe_size      TEXT,
  clothing_size  TEXT,
  CONSTRAINT fk_profile_player
    FOREIGN KEY (player_id) REFERENCES player(player_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS player_family (
  player_id       INTEGER PRIMARY KEY,
  father_name     TEXT,
  mother_name     TEXT,
  marital_status  TEXT,
  CONSTRAINT fk_family_player
    FOREIGN KEY (player_id) REFERENCES player(player_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS spouse (
  spouse_id           INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id           INTEGER NOT NULL,
  spouse_name         TEXT    NOT NULL,
  spouse_nationality  TEXT,
  start_date          TEXT,
  end_date            TEXT,
  is_current          INTEGER NOT NULL DEFAULT 1 CHECK (is_current IN (0,1)),
  CONSTRAINT fk_spouse_player
    FOREIGN KEY (player_id) REFERENCES player(player_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_spouse_player ON spouse(player_id);
CREATE INDEX IF NOT EXISTS idx_spouse_player_current ON spouse(player_id, is_current);
CREATE UNIQUE INDEX IF NOT EXISTS uq_spouse_one_current_per_player
  ON spouse(player_id)
  WHERE is_current = 1;

CREATE TABLE IF NOT EXISTS child (
  child_id    INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id   INTEGER NOT NULL,
  child_name  TEXT    NOT NULL,
  child_age   INTEGER,
  CONSTRAINT fk_child_player
    FOREIGN KEY (player_id) REFERENCES player(player_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_child_player ON child(player_id);

CREATE TABLE IF NOT EXISTS passport (
  passport_id  INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id    INTEGER NOT NULL,
  passport_no  TEXT    NOT NULL,
  valid_until  TEXT,
  is_current   INTEGER NOT NULL DEFAULT 1 CHECK (is_current IN (0,1)),
  CONSTRAINT fk_passport_player
    FOREIGN KEY (player_id) REFERENCES player(player_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_passport_player ON passport(player_id);
CREATE INDEX IF NOT EXISTS idx_passport_no ON passport(passport_no);
CREATE INDEX IF NOT EXISTS idx_passport_player_current ON passport(player_id, is_current);
CREATE UNIQUE INDEX IF NOT EXISTS uq_passport_one_current_per_player
  ON passport(player_id)
  WHERE is_current = 1;

CREATE TABLE IF NOT EXISTS match_schedule (
  match_id     INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id    INTEGER NOT NULL,
  title        TEXT    NOT NULL,
  start_time   TEXT,
  end_time     TEXT,
  location     TEXT,
  notes        TEXT,
  CONSTRAINT fk_match_player
    FOREIGN KEY (player_id) REFERENCES player(player_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_match_player ON match_schedule(player_id);
CREATE INDEX IF NOT EXISTS idx_match_player_start ON match_schedule(player_id, start_time);

COMMIT;

