function init() {
  document.getElementById("addToLib").addEventListener("click", addToLib);
}

function addToLib() {
  console.log("yes")
  fetch(window.location.href, {
    method: "PUT",
    body: JSON.stringify({ toAdd: true })
  })
  .then((res) => {
    console.log(document.cookie)
    if (res.ok) {
      let btn = document.getElementById("addToLib");
      btn.textContent = "Already in Library";
      btn.disabled = true;
    }
  });
}