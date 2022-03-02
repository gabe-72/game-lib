import fetch from "node-fetch";
import * as fs from "fs";
import sqlite3 from "sqlite3";
let db = new sqlite3.Database("./game_lib.db", sqlite3.OPEN_CREATE, (err) => {
  if (err) return console.error(err.message);
  console.log("Successfully connected to database");
});

// how many apps to get
const SAMPLE_AMT = 100;

// read the appids from file
const raw_appids = JSON.parse(fs.readFileSync("./initDatabase/assets/steamAppDetails.json"));
const appids = raw_appids.applist.apps.map(data => data.appid); // extract only the appids
console.log(appids.length);

// make request to the steam storefront for appdetails
for (let i = 0; i < SAMPLE_AMT; ++i) {
  fetch("https://store.steampowered.com/api/appdetails?appids="+appids[i])
    .then((res) => res.json())
    .then((res) => {
      if (res[appids[i]].success === true) {

      }
    })
    .catch(() => {/* do nothing */});
}

db.close((err) => {
  if (err) return console.error(err.message);
  console.log("Successfully closed the database connection");
});