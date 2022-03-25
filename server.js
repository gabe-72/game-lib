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
app.get("/", sendHome);
app.get("/games", gamesQuery, sendGames);
app.get("/games/:game_id", sendGame);
app.get("/home", sendHomepage);

app.param("game_id", function(req, res, next, id) {
  let sql = "SELECT * FROM games WHERE game_id = ?";
  db.get(sql, [id], (err, row) => {
    if (err) return console.error(err.message);
    req.game = row;
    next();
  });
});

function gamesQuery(req, res, next) {
  req.name = "%";
  if ("name" in req.query)
    req.name = `%${decodeURIComponent(req.query.name)}%`;
  next();
}

function sendGames(req, res) {
  let games = [];
  let sql = `SELECT *
             FROM games
             WHERE name LIKE ?
             LIMIT 20`;

  db.each(sql, [req.name], (err, row) => {
    if (err) return console.error(err.message);
    games.push(row);
  }, (err, rows) => {
    if (err) return console.error(err.message);
    res.json({ "games": games });
  });
}

function sendGame(req, res) {
  res.format({
    "application/json": function() { res.json(req.game); },
    "text/html": function() { res.render("pages/game", { game: game }) }
  });
}

function sendHome(req, res) {
  res.render("pages/games", { user: {loggedin: true, userid: 10} });
}



// start the server on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});