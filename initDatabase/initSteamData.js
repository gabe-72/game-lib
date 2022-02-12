import fetch from "node-fetch";

const SAMPLE_AMT = 10000;

fetch("http://localhost:3000/steamAppDetails.json")
  .then(res => res.json())
  .then(res => res.applist.apps.map((data) => data.appid))
  .then(res => {
    for (let i = 0; i < SAMPLE_AMT; ++i) {
      fetch("https://store.steampowered.com/api/appdetails?appids="+res[i])
        .then(res => res.json())
        .then(res => console.log(res));
    }
  });