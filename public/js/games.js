function init() {
  document.getElementById("search").addEventListener("keyup", event => {
    if (event.key === "Enter") search();
  });
  document.getElementById("searchBtn").addEventListener("click", search);
  search();
  getGenres();
  getStores();
}

/**
 * Sends a GET request with the search conditions
 * and calls refreshList to refresh the games list displayed
 */
function search() {
  let searchText = document.getElementById("search").value;

  let genreSelect = document.getElementById("genreSelect");
  let genre_id = genreSelect.options[genreSelect.selectedIndex].value;

  let storeSelect = document.getElementById("storeSelect");
  let store_id = storeSelect.options[storeSelect.selectedIndex].value;

  fetch(`/games?name=${encodeURIComponent(searchText.trim())}&genre_id=${genre_id}&store_id=${store_id}`)
  .then(res => res.json())
  .then(res => refreshList(res.games))
  .catch(err => console.error(err.message));
}

/**
 * Requests for the genre list from the server
 */
function getGenres() {
  fetch("/games/genres")
  .then(res => res.json())
  .then(res => refreshGenres(res))
  .catch(err => console.error(err.message));
}

/**
 * Request for the stores list from the server
 */
function getStores() {
  fetch("/games/stores")
  .then(res => res.json())
  .then(res => refreshStores(res))
  .catch(err => console.error(err.message));
}

/**
 * Refreshes the options for the genre select
 * 
 * @param {Object[]} genres - list of genre objects
 */
function refreshGenres(genres) {
  let genreSelect = document.getElementById("genreSelect");
  genres.forEach(genre => {
    let option = new Option(genre.genre, genre.genre_id.toString());
    genreSelect.appendChild(option);
  });
}

/**
 * Refreshes the options for the store select
 * 
 * @param {Object[]} stores - list of store objects
 */
function refreshStores(stores) {
  let storeSelect = document.getElementById("storeSelect");
  stores.forEach(store => {
    let option = new Option(store.name, store.store_id.toString());
    storeSelect.appendChild(option);
  });
}

/**
 * Refreshes the list of games displayed with the supplied list
 * 
 * @param {Object[]} games - list of games
 */
function refreshList(games) {
  let gamesList = document.getElementById("gamesList");
  gamesList.innerHTML = "";
  games.forEach(game => {
    gamesList.appendChild(gameLink(game));
  });
}

/**
 * Creates a link to a game
 * 
 * @param {Object} game - game object to create a link of
 * 
 * @returns {HTMLAnchorElement}
 */
function gameLink(game) {
  let link = document.createElement("a");
  let innerDiv = document.createElement("div");
  innerDiv.className = "gameLinkDiv";

  link.href = `/games/${game.game_id}`; // link to the game
  innerDiv.textContent = game.name; // set the text to the name of the game

  link.appendChild(innerDiv);
  return link;
}
