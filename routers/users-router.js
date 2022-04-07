import express from "express";
import { findGamesByUser, findUserById } from "../util/db-helper.js";

let router = express.Router();

// GET routes
router.get("/:userid", authUser, queryUserGames, sendUser);

router.param("userid", function(req, res, next, id) {
  findUserById(id, (err, rows) => {
    if (err)
      return res.sendStatus(500);
    if (rows.length === 0)
      return res.sendStatus(400);

    res.user = {
      userid: rows[0].user_id,
      username: rows[0].username,
      email: rows[0].email
    };
    next();
  });
});

function authUser(req, res, next) {
  if (res.user.userid !== req.session.userid)
    return res.sendStatus(401);
  next();
}

function queryUserGames(req, res, next) {
  findGamesByUser(res.user.userid, (err, rows) => {
    if (err) return res.sendStatus(500);

    res.games = rows;
    next();
  });
}

function sendUser(req, res) {
  res.render("pages/user", {
    session: req.session,
    user: res.user,
    games: res.games
  });
}

export { router as usersRouter };