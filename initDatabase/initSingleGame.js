import fetch from "node-fetch";
import sqlite3 from "sqlite3";

// get game
let game = await getSteamGame(process.argv[2]);
let stores = process.argv[3];

// connect to db
let db = new sqlite3.Database("./game_lib.db");
console.log("Connected to db");

let sql = `INSERT OR REPLACE INTO games (name, developer, publisher, description) VALUES (?, ?, ?, ?)`;
let getId = `SELECT game_id FROM games WHERE name LIKE ?`;


db.serialize(function() {

  let gameid;

  db.run('DELETE FROM games WHERE name LIKE ?', [game.name]);
  db.run('DELETE FROM sold_in WHERE game_id IS NULL');
  db.run('DELETE FROM genre_of WHERE game_id IS NULL');

  // insert and get id
  db.run(sql, [game.name, game.developers.join(", "), game.publishers.join(", "), game.detailed_description]);
  db.get(getId, [game.name], (err, row) => {
    if (err) return console.error(err.message);
    if (!row) return console.log("game id not found, terminating...");

    gameid = row.game_id;

    let stmt_sold_in = db.prepare("INSERT INTO sold_in (game_id, store_id, price) VALUES (?, ?, ?)");
    let stmt_genre_of = db.prepare("INSERT INTO genre_of (game_id, genre_id) VALUES (?, ?)");
    let stmt_genres = db.prepare("INSERT OR IGNORE INTO genres (genre_id, genre) VALUES (?, ?)");

    // inserting into genres and genre_of tables
    if ("genres" in game) {
      for (let i = 0; i < game.genres.length; ++i) {
        let genre = game.genres[i];
        stmt_genres.run([genre.id, genre.description]);
        stmt_genre_of.run([gameid, genre.id]);
      }
    }

    // adding to sold_in
    let price = "TBA"
    if (game.is_free) // check if game is free
      price = "Free"
    else if ("price_overview" in game) // check if the price has been set
      price = game.price_overview.final_formatted

    for (let i = 1; i <= stores; ++i)
      stmt_sold_in.run([gameid, i, price]);

    stmt_genre_of.finalize();
    stmt_genres.finalize();
    stmt_sold_in.finalize();

    db.close();
    console.log("db closed");
  });
});


async function getSteamGame(appid) {
  let res = await fetch("https://store.steampowered.com/api/appdetails?appids="+appid).then(res => res.json());
  
  let game = res[appid].data;
  if (!game.developers)
    game.developers = [''];

  return game;
}