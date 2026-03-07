const currentUser = localStorage.getItem("currentUser");
if(currentUser !== "admin"){ alert("Access denied"); window.location.href="login.html"; }

function logout(){ localStorage.removeItem("currentUser"); window.location.href="login.html"; }

function loadUsers(){
  const list = document.getElementById("userList");
  list.innerHTML="";
  const users = JSON.parse(localStorage.getItem("users")) || {};
  for(const username in users){
    if(users[username].status==="pending"){
      const li = document.createElement("li");
      li.innerHTML = `${username} <button onclick="approveUser('${username}')">Approve</button>`;
      list.appendChild(li);
    }
  }
}

function approveUser(username){
  const users = JSON.parse(localStorage.getItem("users")) || {};
  users[username].status = "approved";
  localStorage.setItem("users", JSON.stringify(users));
  loadUsers();
}

window.onload = loadUsers;