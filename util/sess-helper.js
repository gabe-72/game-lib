import { addUser, findGamesByUser, findUserByName } from "./db-helper.js";

export function signup(req, res) {
  addUser(req.body.username, req.body.email, req.body.password, (err, rows) => {
    if (err) return res.status(400).send("Username/email has already been taken");
    req.session.userid = rows[0].user_id;
    req.session.games = [];
    res.redirect("/");
  });
}

export function login(req, res) {
  findUserByName(req.body.username, (err, rows) => {
    if (err) return res.sendStatus(500);

    if (rows.length === 0 || req.body.password !== rows[0].password)
      return res.sendStatus(400);

    const user = rows[0];
    req.session.userid = user.user_id;

    // find the games that the user owns
    findGamesByUser(req.session.userid, (err, rows) => {
      if (err) return res.sendStatus(500);

      // store the list of game ids 
      req.session.games = rows.map(game => game.game_id);
      res.redirect("/");
    });
  });
}

export function logout(req, res) {
  req.session = null;
  res.redirect("/");
}