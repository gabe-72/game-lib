import sqlite3 from "sqlite3";

const DB_PATH = "./game_lib.db";

function findGameById(game_id, callback) {
  let db = new sqlite3.Database(DB_PATH);
  let sql = "SELECT * FROM games WHERE game_id = ?";
  db.get(sql, [game_id], (err, row) => {
    if (err) return console.error(err.message);
    callback(row);
  });
  db.close();
}

function findGamesByName(name, callback) {
  let db = new sqlite3.Database(DB_PATH);
  let sql = `SELECT *
             FROM games
             WHERE name LIKE ?
             LIMIT 20`;
  db.all(sql, [name], (err, rows) => {
    if (err) return console.error(err.message);
    callback(rows);
  });
  db.close();
}

export { findGameById, findGamesByName };