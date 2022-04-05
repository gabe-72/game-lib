import express from "express";
import cookieSession from "cookie-session";
import { gamesRouter } from "./routers/games-router.js";
import { signup, login, logout } from "./util/sess-helper.js";

// setup express
const app = express();
app.use(cookieSession({
  name: "session",
  keys: ["banana cat", "shark turtle"],
  maxAge: 24 * 60 * 60 * 1000 // 1 day
}));
app.set("view engine", "pug");

// setup the routers
app.use(express.static("public"));
app.use("/games", gamesRouter);

// GET routes
app.get("/", sendHome);
app.get("/signup", sendSignup);
app.get("/login", sendLogin);

// POST routes
app.use(express.json());
app.post("/signup", signup);
app.post("/login", login);
app.post("/logout", logout);


function sendHome(req, res) { res.render("pages/games", { session: req.session }); }
function sendSignup(req, res) { res.render("pages/signup", { session: req.session }); }
function sendLogin(req, res) { res.render("pages/login", { session: req.session }); }

// start the server on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});