import fetch from "node-fetch";
import * as fs from "fs";
import sqlite3 from "sqlite3";

const SAMPLE_AMT = 15;
const APPIDS_PATH = "./initDatabase/assets/steamAppDetails.json";
const REQ_URL = "https://store.steampowered.com/api/appdetails?appids=";

// get the appdetails
const appdetails = getAppDetails();

// connect to the database
let db = new sqlite3.Database("./game_lib.db", (err) => {
  if (err) return console.error(err.message);
  console.log("Connected to database");
});

// TODO: insert into db

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