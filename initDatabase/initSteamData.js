import fetch from "node-fetch";
import * as fs from "fs";
import sqlite3 from "sqlite3";

const SAMPLE_AMT = 30;
const APPIDS_PATH = "./initDatabase/assets/steamAppDetails.json";
const REQ_URL = "https://store.steampowered.com/api/appdetails?appids=";

// get the appdetails
console.log("Getting appdetails...");
const appdetails = await getAppDetails();

// connect to the database
let db = new sqlite3.Database("./game_lib.db", (err) => {
  if (err) return console.error(err.message);
  console.log("Connected to database");
});

// inserting into database
db.serialize(function() {
  db.run("DELETE FROM games");
  let stmtgames = db.prepare("INSERT OR REPLACE INTO games (name, description, developer, publisher) VALUES (?, ?, ?, ?)");
  for (let i = 0; i < appdetails.length; ++i) {
    let game = appdetails[i];
    stmtgames.run([game.name, game.detailed_description, game.developers.join(","), game.publishers.join(",")]);
  }
  stmtgames.finalize();
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
    // request for the data
    let res = await fetch(REQ_URL + appids[i]);
    res = await res.json();

    // check if success
    res = res[appids[i]];
    if (res.success === true) {
      appdetails.push(res.data);
    }
  }

  return appdetails;
} 