import fetch from "node-fetch";
import * as fs from "fs";
import sqlite3 from "sqlite3";

const SAMPLE_AMT = 500;
const APPIDS_PATH = "./initDatabase/assets/steamAppDetails.json";
const REQ_URL = "https://store.steampowered.com/api/appdetails?appids=";

// get the appdetails
console.log("Getting appdetails");
const appdetails = await getAppDetails();

// connect to the database
let db = new sqlite3.Database("./game_lib.db", (err) => {
  if (err) return console.error(err.message);
  console.log("Connected to database");
});

// inserting into database
db.serialize(function() {
  // clear exisiting data
  db.run("DELETE FROM sold_in");
  db.run("DELETE FROM genre_of");
  db.run("DELETE FROM games");
  db.run("DELETE FROM genres");

  // prepare the insert statements
  let stmt_games = db.prepare("INSERT INTO games (game_id, name, description, developer, publisher) VALUES (?, ?, ?, ?, ?)");
  let stmt_sold_in = db.prepare("INSERT INTO sold_in (game_id, store_id, price) VALUES (?, ?, ?)");
  let stmt_genre_of = db.prepare("INSERT INTO genre_of (game_id, genre_id) VALUES (?, ?)");
  let stmt_genres = db.prepare("INSERT OR IGNORE INTO genres (genre_id, genre) VALUES (?, ?)");

  for (let i = 0; i < appdetails.length; ++i) {
    let game = appdetails[i];
    // adding to games
    stmt_games.run([i+1, game.name, game.detailed_description, game.developers.join(","), game.publishers.join(",")]);

    // adding to sold_in
    if (game.is_free) // check if game is free
      stmt_sold_in.run([i+1, 1, "Free"]);
    else if ("price_overview" in game) // check if the price has been set
      stmt_sold_in.run([i+1, 1, game.price_overview.final_formatted]);
    else // game has not released yet
      stmt_sold_in.run([i+1, 1, "TBA"]);
    
    // inserting into genres and genre_of tables
    if ("genres" in game) {
      for (let j = 0; j < game.genres.length; ++j) {
        let genre = game.genres[j];
        stmt_genres.run([genre.id, genre.description]);
        stmt_genre_of.run([i+1, genre.id]);
      }
    }
  }
  stmt_games.finalize();
  stmt_sold_in.finalize();
  stmt_genre_of.finalize();
  stmt_genres.finalize();
});

// closing the connection
db.close((err) => {
  if (err) return console.error(err.message);
  console.log("Successfully closed the database connection");
});


function getAppIds() {
  const rawAppids = JSON.parse(fs.readFileSync(APPIDS_PATH)); // read the appids from file
  return rawAppids.applist.apps.map(data => data.appid); // return only the appids
}

async function getAppDetails() {
  const appids = getAppIds(); // get the appids
  let appdetails = [];

  // make a fetch request for a sample amount of appids
  for (let i = 0; i < SAMPLE_AMT; ++i) {
    appdetails.push(fetch(REQ_URL + appids[i]).then(res => res.json()));
  }

  await Promise.allSettled(appdetails)
    .then((rawappdetails) => {
      appdetails = []; // reset this list
      for (let i = 0; i < rawappdetails.length; ++i) {
        if (!rawappdetails[i].value) continue;
        let app = (rawappdetails[i].value)[appids[i]]; // the response data of a single app detail

        // if the response was successful
        if (app.success) {
          if (!app.data.developers) // in case the developer field is empty
            app.data.developers = [''];
          appdetails.push(app.data);
        }
      }
    });

    return appdetails;
} 