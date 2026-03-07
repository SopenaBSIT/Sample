// Check if user is logged in
window.onload = function(){
  const user = localStorage.getItem("currentUser");
  if(!user){
    window.location.href = "login.html";
    return;
  }
  document.getElementById("welcome").innerText = "Welcome, " + user;
  loadYears();
}

// Logout
function logout(){
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

function createYear(){
  const year = document.getElementById("yearInput").value;
  if(!year) return alert("Enter a year");
  let years = JSON.parse(localStorage.getItem("years")) || [];
  if(years.includes(year)) return alert("Year already exists");
  years.push(year);
  localStorage.setItem("years", JSON.stringify(years));
  loadYears();
}

function loadYears(){
  const list = document.getElementById("yearList");
  list.innerHTML = "";
  let years = JSON.parse(localStorage.getItem("years")) || [];
  years.forEach(year => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${year}
      <button onclick="openYear('${year}')">Open</button>
      <button onclick="deleteYear('${year}')">Delete</button>
    `;
    list.appendChild(li);
  });
}

function openYear(year){
  window.location.href = "table.html?year="+year;
}

function deleteYear(year){
  let years = JSON.parse(localStorage.getItem("years")) || [];
  years = years.filter(y => y !== year);
  localStorage.setItem("years", JSON.stringify(years));
  localStorage.removeItem("table_"+year);
  loadYears();
}