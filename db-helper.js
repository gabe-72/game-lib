import sqlite3 from "sqlite3";

const DB_PATH = "./game_lib.db";

function queryDB(sql, parameters, callback) {
  let db = new sqlite3.Database(DB_PATH);
  db.all(sql, parameters, (err, rows) => {
    if (err) return console.error(err.message);
    callback(rows);
  });
  db.close();
}

function findGameById(game_id, callback) {
  let sql = "SELECT * FROM games WHERE game_id = ?";
  queryDB(sql, [game_id], callback);
}

function findGamesByName(name, callback) {
  let sql = `SELECT *
             FROM games
             WHERE name LIKE ?
             LIMIT 20`;
  queryDB(sql, [name], callback);
}

function getGenres(callback) {
  let sql = `SELECT * FROM genres`;
  queryDB(sql, [], callback);
}

function findGamesByGenre(genre_id, callback) {
  let sql = `SELECT *
             FROM (
               (games)
               NATURAL JOIN
               (SELECT game_id FROM genre_of WHERE genre_id = ?)
             )`;
  queryDB(sql, [genre_id], callback);
}

function getStores(callback) {
  let sql = `SELECT * FROM stores`;
  queryDB(sql, [], callback);
}

function findGamesByStore(store, callback) {
  let sql = `SELECT *
    FROM (
      (games)
      NATURAL JOIN
      (SELECT game_id FROM genre_of WHERE genre_id = ?)
    )`;
  queryDB(sql, [store], callback);
}

export { findGameById, findGamesByName, getGenres, findGamesByGenre, getStores, findGamesByStore };