function init() {
  document.getElementById("login-btn").addEventListener("click", openForm);
}

function openForm() {
  let form = document.getElementById("login-form");
  form.classList.add("is-visible");
}

function closeForm() {
  let form = document.getElementById("login-form");
  form.classList.add("is-visible");
}