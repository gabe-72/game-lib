DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS stores;
DROP TABLE IF EXISTS sold_in;
DROP TABLE IF EXISTS genre_of;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS owns;

CREATE TABLE games(
  game_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  developer TEXT NOT NULL,
  publisher TEXT NOT NULL
);

CREATE TABLE stores(
  store_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL, -- store name
  developer TEXT NOT NULL -- developer name
);

CREATE TABLE sold_in(
  game_id INTEGER,
  store_id INTEGER,
  price TEXT NOT NULL,
  FOREIGN KEY(game_id) REFERENCES games(game_id),
  FOREIGN KEY(store_id) REFERENCES stores(store_id),
  PRIMARY KEY(game_id, store_id)
);

CREATE TABLE genres(
  genre_id INTEGER PRIMARY KEY,
  genre TEXT UNIQUE NOT NULL -- genre name
);

CREATE TABLE genre_of(
  game_id INTEGER,
  genre_id INTEGER,
  FOREIGN KEY(game_id) REFERENCES games(game_id),
  FOREIGN KEY(genre_id) REFERENCES genres(genre_id),
  PRIMARY KEY(game_id, genre_id)
);

CREATE TABLE users(
  user_id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE owns(
  user_id INTEGER,
  game_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  FOREIGN KEY(game_id) REFERENCES games(game_id),
  PRIMARY KEY(user_id, game_id)
);

INSERT INTO stores (name, developer) VALUES ("Steam", "Valve");
INSERT INTO stores (name, developer) VALUES ("Epic Games Store", "Epic Games");
INSERT INTO stores (name, developer) VALUES ("GOG.com", "CD Projekt");