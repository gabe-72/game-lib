import express from "express";
import session from "express-session";
import { gamesRouter } from "./routers/games-router.js";
import { register, login, logout } from "./util/sess-helper";

// setup express
const app = express();
app.use(session({
  secret: "banana cat and shark",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));
app.set("view engine", "pug");

// log out the requests
app.use("/", (req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use(express.static("public"));
app.use("/games", gamesRouter);

// GET routes
app.get("/", sendHome);
app.get("/register", sendRegister);
app.get("/login", sendLogin);

// POST routes
app.post("/register", register);
app.post("/login", login);
app.post("/logout", logout);


function sendHome(req, res) { res.render("pages/games", { user: {loggedin: true, userid: 10} }); }
function sendRegister(req, res) { res.render("pages/register", { session: req.session }); }
function sendLogin(req, res) { res.render("pages/login", { session: req.session }); }

// start the server on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});