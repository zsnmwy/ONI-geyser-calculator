-- Up
CREATE TABLE token (
  key         TEXT      NOT NULL PRIMARY KEY,
  secret      TEXT      NOT NULL,
  user_name   TEXT,
  create_time INTEGER   NOT NULL,
  counter     INTEGER   NOT NULL
);

-- Down
DROP TABLE token;
