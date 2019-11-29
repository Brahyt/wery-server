ALTER TABLE party
ADD COLUMN user_id INTEGER,
  ADD FOREIGN KEY (user_id) REFERENCES users(user_id);
