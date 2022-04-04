function init() {
  document.getElementById("submit").addEventListener("click", signup);
}

function signup() {
  let data = getData();
  if (!data) return; // if data is null
  
  fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then((res) => {
    let errorElement = document.getElementById("error-text");
    if (res.status === 400) {
      errorElement.textContent = "Username already taken";
      return;
    }
    if (res.status === 200)
      window.location.href = "/";
  });
}

function getData() {
  let data = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };
  if (data.username === "" || data.email === "" || data.password === "") {
    document.getElementById("error-text").textContent = "Fields cannot be empty!";
    return null;
  }
  return data;
}