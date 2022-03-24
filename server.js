import express from "express";
import sqlite3 from "sqlite3";

const app = express(); // setup express

// connect to the db
let db = new sqlite3.Database("./game_lib.db", (err) => {
  if (err) return console.error(err.message);
  console.log("Connected to database");
});

// setting up the view engine
app.set("view engine", "pug");

// log out the requests
app.use("/", (req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use(express.static("public"));


// GET routes
app.get("/games", gamesQuery, sendGames);
app.get("/home", sendHomepage);


function sendGames(req, res) {
  console.log(req.name);
  res.sendStatus(200);
}

function gamesQuery(req, res, next) {
  req.name = "";
  if ("name" in req.query)
    req.name = decodeURIComponent(req.query.name);
  next();
}

function sendHomepage(req, res) {
  res.render("pages/homepage", { user: {loggedin: true, userid: 10} });
}



// start the server on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});