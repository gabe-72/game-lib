import sqlite3 from "sqlite3";

const DB_PATH = "./game_lib.db";

/**
 * Queries the db with the provided sql script and parameters
 * 
 * @param {string} sql - sql script to run
 * @param {any} parameters - list/object of the parameters
 * @param {function(err, rows)} callback
 */
function queryDB(sql, parameters, callback) {
  let db = new sqlite3.Database(DB_PATH);
  db.all(sql, parameters, callback);
  db.close();
}

/**
 * Queries the db for a game that matches the id
 * 
 * @param {Number} game_id - game id to search for
 * @param {function(err, rows)} callback
 */
export function findGameById(game_id, callback) {
  let sql = "SELECT * FROM games WHERE game_id = ?";
  queryDB(sql, [game_id], callback);
}

/**
 * Queries the db for a game that matches the given conditions
 * 
 * @param {string} name - name of the game
 * @param {Number} genre_id - genre id to search
 * @param {Number} store_id - store id to serach
 * @param {function(err, rows)} callback
 */
export function findGames(name, genre_id, store_id, callback) {
  let sql = `SELECT *
    FROM (
      (games)
      NATURAL JOIN (
        SELECT game_id FROM genre_of WHERE $genre_id = -1 OR genre_id = $genre_id
        INTERSECT
        SELECT game_id FROM sold_in WHERE $store_id = -1 OR store_id = $store_id
      )
    )
    WHERE name LIKE $name
    LIMIT 40`;

  let parameters = {
    $name: name,
    $genre_id: Number.parseInt(genre_id),
    $store_id: Number.parseInt(store_id)
  };
  queryDB(sql, parameters, callback);
}

/**
 * Retrieves list of all genres
 * 
 * @param {function(err, rows)} callback
 */
export function getGenres(callback) {
  let sql = `SELECT * FROM genres`;
  queryDB(sql, [], callback);
}

/**
 * Retrieves list of all stores
 * 
 * @param {function(err, rows)} callback
 */
export function getStores(callback) {
  let sql = `SELECT * FROM stores`;
  queryDB(sql, [], callback);
}

/**
 * Finds a user by the username
 * 
 * @param {string} username - username to search
 * @param {function(err, rows)} callback
 */
export function findUserByName(username, callback) {
  let sql = `SELECT *
    FROM users
    WHERE username = ?`;
  queryDB(sql, [username], callback);
}

/**
 * Finds a user by the email
 * 
 * @param {string} email - email to search
 * @param {function(err, rows)} callback
 */
export function findUserByEmail(email, callback) {
  let sql = `SELECT *
    FROM users
    WHERE email = ?`;
  queryDB(sql, [email], callback);
}

/**
 * Adds a user to the db (if valid)
 * 
 * @param {string} username - username of the new user
 * @param {string} email - email of the new user
 * @param {string} password - password of the account
 * @param {function(err, rows)} callback
 */
export function addUser(username, email, password, callback) { // check if there are any dupes
  let db = new sqlite3.Database(DB_PATH);
  let sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`
  db.run(sql, [username, email, password], (err) => {
    if (!err) {
      findUserByName(username, callback);
    } else {
      callback(err, null);
    }
  });
  db.close();
}