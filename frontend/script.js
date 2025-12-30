/* ================= SIGNUP ================= */
async function signup(event) {
  event.preventDefault();

  const formData = new FormData();

  formData.append("username", username.value);
  formData.append("firstname", firstname.value);
  formData.append("lastname", lastname.value);
  formData.append("age", age.value);
  formData.append("email", email.value);
  formData.append("mobile", mobile.value);
  formData.append("address", address.value);
  formData.append("gender", gender.value);
  formData.append("password", password.value);

  const imageInput = document.getElementById("image");
  if (imageInput && imageInput.files.length > 0) {
    formData.append("image", imageInput.files[0]);
  }

  const res = await fetch("/api/auth/signup", {
    method: "POST",
    body: formData
  });

  const result = await res.json();
  alert(result.message);

  if (res.ok) window.location.href = "/login";
}


/* ================= LOGIN ================= */
async function login(event) {
  event.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const msg = document.getElementById("loginMsg");

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const result = await res.json();

  if (!res.ok) {
    msg.innerText = result.message;
    msg.style.color = "red";
    return;
  }

  // ✅ Save login token
  localStorage.setItem("token", result.token || "loggedin");

  window.location.href = "/dashboard";
}


/* ================= LOGOUT ================= */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}


/* ================= DASHBOARD CRUD ================= */

const API = "/api/users";

/* ADD USER */
async function addUser() {
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;

  if (!name || !age) {
    alert("Enter name and age");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, age })
  });

  document.getElementById("name").value = "";
  document.getElementById("age").value = "";

  loadUsers();
}

/* READ USERS */
async function loadUsers() {
  const res = await fetch(API);
  const users = await res.json();

  const ul = document.getElementById("users");
  if (!ul) return; // prevents error on other pages

  ul.innerHTML = "";

  users.forEach(u => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${u.name} (${u.age})
      <button onclick="deleteUser('${u._id}','${u._rev}')">Delete</button>
    `;
    ul.appendChild(li);
  });
}

/* DELETE USER */
async function deleteUser(id, rev) {
  await fetch(`${API}/${id}/${rev}`, { method: "DELETE" });
  loadUsers();
}

/* AUTO LOAD USERS ON DASHBOARD */
if (window.location.pathname === "/dashboard") {
  if (!localStorage.getItem("token")) {
    window.location.href = "/login";
  } else {
    loadUsers();
  }
}
