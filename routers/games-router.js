import express from "express";
import { findGameById, findGamesByName } from "../db-helper.js";

// setup the router
let gamesRouter = express.Router();

// GET routes
gamesRouter.get("/", parseQuery, queryGames, sendGames);
gamesRouter.get("/:game_id", sendGame);

// check if game_id is valid and query the db for it
gamesRouter.param("game_id", function(req, res, next, id) {
  findGameById(id, (row) => {
    res.game = row;
    next();
  });
});

function parseQuery(req, res, next) {
  req.name = "%";
  if ("name" in req.query)
    req.name = `%${decodeURIComponent(req.query.name)}%`;
  next();
}

function queryGames(req, res, next) {
  findGamesByName(req.name, (rows) => {
    res.games = { games: rows };
    next();
  });
}

function sendGames(req, res) {
  res.format({
    "application/json": function() { res.json(res.games) },
    "text/html": function() { res.render("pages/games", { user: { loggedin: false }}) }
  });
}

function sendGame(req, res) {
  res.format({
    "application/json": function() { res.json(res.game); },
    "text/html": function() { res.render("pages/game", { game: res.game }) }
  });
}

export { gamesRouter };