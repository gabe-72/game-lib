import express from "express";
import * as fs from "fs";

const app = express();

// setting up the view engine
app.use("view engine", "pug");

// log out the requests
app.use("/", (req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use(express.static("public"));
app.use(express.static("initDatabase/assets"));

// start the server on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});