import express from "express";
import session from "express-session";
import { gamesRouter } from "./routers/games-router.js";

// setup express
const app = express();
app.use(session({
  secret: "banana cat and shark",
  resave: false,
  saveUninitialized: false
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

function sendHome(req, res) {
  res.render("pages/games", { user: {loggedin: true, userid: 10} });
}


// start the server on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});