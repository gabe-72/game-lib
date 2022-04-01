import sqlite3 from "sqlite3";

const DB_PATH = "../game_lib.db";

function queryDB(sql, parameters, callback) {
  let db = new sqlite3.Database(DB_PATH);
  db.all(sql, parameters, (err, rows) => {
    if (err) return console.error(err.message);
    callback(rows);
  });
  db.close();
}

export function findGameById(game_id, callback) {
  let sql = "SELECT * FROM games WHERE game_id = ?";
  queryDB(sql, [game_id], callback);
}

export function findGamesByName(name, callback) {
  let sql = `SELECT *
             FROM games
             WHERE name LIKE ?
             LIMIT 20`;
  queryDB(sql, [name], callback);
}

export function getGenres(callback) {
  let sql = `SELECT * FROM genres`;
  queryDB(sql, [], callback);
}

export function findGamesByGenre(genre_id, callback) {
  let sql = `SELECT *
             FROM (
               (games)
               NATURAL JOIN
               (SELECT game_id FROM genre_of WHERE genre_id = ?)
             )`;
  queryDB(sql, [genre_id], callback);
}

export function getStores(callback) {
  let sql = `SELECT * FROM stores`;
  queryDB(sql, [], callback);
}

export function findGamesByStore(store, callback) {
  let sql = `SELECT *
    FROM (
      (games)
      NATURAL JOIN
      (SELECT game_id FROM genre_of WHERE genre_id = ?)
    )`;
  queryDB(sql, [store], callback);
}

export function findUserByUsername(username, callback) {
  let sql = `SELECT *
    FROM users
    WHERE username = ?`;
  queryDB(sql, [username], callback);
}

export function findUserByEmail(email, callback) {
  let sql = `SELECT *
    FROM users
    WHERE email = ?`;
  queryDB(sql, [email], callback);
}

export function addUser(username, email, password, callback) { // check if there are any dupes
  let statusCode = 200;
  let db = new sqlite3.Database(DB_PATH);
  db.run(`INSERT INTO users (username, email, password) VALUES (${username}, ${email}, ${password})`, function(err) {
    if (err) statusCode = 400;
    callback(statusCode);
  });
  db.close();
}