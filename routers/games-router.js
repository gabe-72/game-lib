import express from "express";
import { addGameToUser, findGameById, findGames, getGenres, getStores } from "../util/db-helper.js";

// setup the router
let router = express.Router();

// GET routes
router.get("/", parseQuery, queryGames, sendGames);
router.get("/genres", sendGenres);
router.get("/stores", sendStores);
router.get("/:gameid", sendGame);

// PUT routes
router.put("/:gameid", updateUserGames);

// check if gameid is valid and query the db for it
router.param("gameid", function(req, res, next, id) {
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
  findGames(req.query.name, req.query.genreid, req.query.storeid, (err, rows) => {
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

function updateUserGames(req, res) {
  if (req.session.games.includes(res.game.game_id))
    return res.sendStatus(200);
  addGameToUser(res.game.game_id, req.session.userid, (err) => {
    if (!err)
      req.session.games.push(res.game.game_id);
    res.sendStatus(200);
  });
}

export { router as gamesRouter };