function init() {
  document.getElementById("submit").addEventListener("click", login);
}

function login() {
  let data = getData();
  if (!data) return; // if data is null
  
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then((res) => {
    if (res.status === 400) {
      document.getElementById("error-text").textContent = "Username already taken";
      return;
    }
    if (res.status === 200)
      window.location.href = "/";
  });
}

function getData() {
  let data = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value
  };
  if (data.username === "" || data.password === "") {
    document.getElementById("error-text").textContent = "Fields cannot be empty!";
    return null;
  }
  return data;
}