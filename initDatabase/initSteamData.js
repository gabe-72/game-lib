import fetch from "node-fetch";
import * as fs from "fs";

const SAMPLE_AMT = 10000;

const raw_appids = JSON.parse(fs.readFileSync("./initDatabase/assets/steamAppDetails.json"));
const appids = raw_appids.applist.apps.map(data => data.appid);

for (let i = 0; i < SAMPLE_AMT; ++i) {
  fetch("https://store.steampowered.com/api/appdetails?appids="+appids[i])
    .then(res => res.json())
    .then(res => console.log(res));
}