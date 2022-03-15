import express from "express";
const app = express();

// setting up the view engine
app.set("view engine", "pug");

// log out the requests
app.use("/", (req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use(express.static("public"));

// GET routes
app.get("/home", sendHomepage);

function sendHomepage(req, res) {
  res.render("pages/homepage", { user: {loggedin: true, userid: 10} });
}



// start the server on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});