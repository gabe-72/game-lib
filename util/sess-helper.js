import { addUser } from "./db-helper.js";

export function register(req, res) {
  addUser(req.body.username, req.body.email, req.body.password, (statusCode) => {
    res.sendStatus(statusCode);
  });
}

export function login(req, res) {

}

export function logout(req, res) {
  if (req.session)
    req.session.destroy();
  res.sendStatus(200);
}