-- Up
CREATE TABLE token (
  id          TEXT      NOT NULL,
  secret      TEXT      NOT NULL,
  user_name   TEXT,
  create_time INTEGER   NOT NULL,
  counter     INTEGER   NOT NULL DEFAULT 0,
  status      INTEGER   NOT NULL DEFAULT 0,
  PRIMARY KEY ("id")
);

-- Down
DROP TABLE token;
