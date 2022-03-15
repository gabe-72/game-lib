import express from "express";
const app = express();

// setting up the view engine
app.use("view engine", "pug");

// log out the requests
app.use("/", (req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use(express.static("public"));

// start the server on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});