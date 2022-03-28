function init() {
  document.getElementById("search").addEventListener("keyup", event => {
    if (event.key === "Enter") search();
  });
  search();
}

function search() {
  let searchText = document.getElementById("search").value;

  fetch(`/games?name=${encodeURIComponent(searchText.trim())}`)
    .then(res => res.json())
    .then(res => refreshList(res.games))
    .catch(err => {
      console.error(err.message);
    });
}

function refreshList(games) {
  let gamesList = document.getElementById("gamesList");
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