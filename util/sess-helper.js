import { addUser, findUserByName } from "./db-helper.js";

export function signup(req, res) {
  addUser(req.body.username, req.body.email, req.body.password, (err, rows) => {
    if (err) return res.status(400).send("Username/email has already been taken");
    req.session.userid = rows[0].user_id;
    res.redirect("/");
  });
}

export function login(req, res) {
  findUserByName(req.body.username, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.sendStatus(500);
    }
    if (rows.length === 0)
      return res.status(400).send("Invalid username");
    const user = rows[0];
    if (req.body.password === user.password) {
      req.session.userid = user.user_id;
      res.redirect("/");
    } else {
      res.status(400).send("Invalid username/password");
    }
  });
}

export function logout(req, res) {
  req.session = null;
  res.redirect("/");
}