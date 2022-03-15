DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS stores;
DROP TABLE IF EXISTS sold_in;
DROP TABLE IF EXISTS genre_of;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS friends_with;

CREATE TABLE games(
  game_id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  developer TEXT NOT NULL,
  publisher TEXT NOT NULL
);

CREATE TABLE genres(
  genre_id TEXT PRIMARY KEY NOT NULL,
  genre TEXT NOT NULL, -- genre name
);

CREATE TABLE stores(
  store_id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL, -- store name
  developer TEXT NOT NULL, -- developer name
);

INSERT INTO stores (name, developer) VALUES ("Steam", "Valve");
INSERT INTO stores (name, developer) VALUES ("Epic Games Store", "Epic Games")