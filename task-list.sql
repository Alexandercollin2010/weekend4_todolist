CREATE TABLE tasks (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(200) UNIQUE,
  status BOOLEAN
)
