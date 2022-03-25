function init() {
  document.getElementById("search").addEventListener("keyup", event => {
    if (event.code === 13) search();
  });
}

function search() {
  let searchText = document.getElementById("search").textContent;

  fetch(`/games?name=${encodeURIComponent(searchText.trim())}`)
    .then(res => {
      if (!res.ok) throw new Error("Something went wrong...");
      refreshList(res.json());
    })
    .catch(err => {
      console.error("Error retrieving games");
    });
}

function refreshList(games) {
  let gamesList = document.getElementById("gameslist");
  gamesList.innerHTML = "";
  games.forEach(game => {
    gamesList.appendChild(gameLink(game));
  });
}

function gameLink(game) {
  let link = document.createElement("a");
  let innerDiv = document.createElement("div");
  link.className = "gameLink";
  innerDiv.className = "gameLinkDiv";

  link.href = `/games/${game.game_id}`; // link to the game
  innerDiv.textContent = game.name; // set the text to the name of the game

  link.appendChild(innerDiv);
  return link;
}