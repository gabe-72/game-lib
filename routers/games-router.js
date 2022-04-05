import express from "express";
import { findGameById, findGames, getGenres, getStores } from "../util/db-helper.js";

// setup the router
let gamesRouter = express.Router();

// GET routes
gamesRouter.get("/", parseQuery, queryGames, sendGames);
gamesRouter.get("/genres", sendGenres);
gamesRouter.get("/stores", sendStores);
gamesRouter.get("/:game_id", sendGame);

// check if game_id is valid and query the db for it
gamesRouter.param("game_id", function(req, res, next, id) {
  findGameById(id, (err, rows) => {
    res.game = null;
    if (!err)
      res.game = rows[0];
    next();
  });
});

function parseQuery(req, res, next) {
  req.query.name = `%${req.query.name}%`;
  next();
}

function queryGames(req, res, next) {
  findGames(req.query.name, req.query.genre_id, req.query.store_id, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.sendStatus(500);
    }
    res.games = { games: rows };
    next();
  });
}

function sendGames(req, res) {
  res.format({
    "application/json": function() { res.json(res.games) },
    "text/html": function() { res.render("pages/games", { session: req.session }) }
  });
}

function sendGame(req, res) {
  res.format({
    "application/json": function() { res.json(res.game); },
    "text/html": function() { res.render("pages/game", { game: res.game, session: req.session }) }
  });
}

function sendGenres(req, res) {
  getGenres((err, rows) => {
    if (err) {
      console.error(err.message);
      res.sendStatus(500);
      return;
    }
    res.json(rows);
  });
}

function sendStores(req, res) {
  getStores((err, rows) => {
    if (err) {
      console.error(err.message);
      res.sendStatus(500);
      return;
    }
    res.json(rows);
  });
}

export { gamesRouter };