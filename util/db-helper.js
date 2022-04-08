import sqlite3 from "sqlite3";

const DB_PATH = "./game_lib.db";
const MAX_AMT = 40;

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
 * @param {Number} gameid - game id to search for
 * @param {function(err, rows)} callback
 */
export function findGameById(gameid, callback) {
  let sql = "SELECT * FROM games WHERE game_id = ?";
  queryDB(sql, [gameid], callback);
}

/**
 * Queries the db for a game that matches the given conditions
 * 
 * @param {string} name - name of the game
 * @param {Number} genreid - genre id to search
 * @param {Number} storeid - store id to serach
 * @param {function(err, rows)} callback
 */
export function findGames(name, genreid, storeid, callback) {
  let sql = `SELECT *
    FROM (
      (games)
      NATURAL JOIN (
        SELECT game_id FROM genre_of WHERE $genreid = -1 OR genre_id = $genreid
        INTERSECT
        SELECT game_id FROM sold_in WHERE $storeid = -1 OR store_id = $storeid
      )
    )
    WHERE name LIKE $name
    LIMIT ${MAX_AMT}`;

  let parameters = {
    $name: name,
    $genreid: Number.parseInt(genreid),
    $storeid: Number.parseInt(storeid)
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

export function findUserById(userid, callback) {
  let sql = "SELECT * FROM users WHERE user_id = ?";
  queryDB(sql, [userid], callback);
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
export function addUser(username, email, password, callback) {
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

/**
 * Queries for the games that the user owns
 * 
 * @param {Number} userid - id of the user
 * @param {function(err, rows)} callback
 */
export function findGamesByUser(userid, callback) {
  let sql = `SELECT *
    FROM (
      (games)
      NATURAL JOIN
      (SELECT game_id FROM owns WHERE user_id = $userid)
    )`;
  queryDB(sql, { $userid: userid }, callback);
}

/**
 * Adds a game to a user
 * 
 * @param {Number} gameid - id of the game
 * @param {Number} userid - id of the user
 * @param {function(err)} callback
 */
export function addGameToUser(gameid, userid, callback) {
  let db = new sqlite3.Database(DB_PATH);
  let sql = `INSERT INTO owns (game_id, user_id) VALUES ($gameid, $userid)`;
  db.run(sql, { $gameid: gameid, $userid: userid }, callback);
  db.close();
}