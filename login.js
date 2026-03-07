// Ensure at least one admin exists
if(!localStorage.getItem("users")){
    localStorage.setItem("users", JSON.stringify({
        admin: { password: "admin123", status: "approved" }
    }));
}

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if(!username || !password){
        alert("Please enter both username and password.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || {};

    if(users[username] && users[username].password === password){
        if(users[username].status !== "approved"){
            alert("Your account is pending admin approval.");
            return;
        }

        // Save current session
        localStorage.setItem("currentUser", username);

        // Redirect based on user type
        if(username === "admin"){
            window.location.href = "admin.html";
        } else {
            window.location.href = "index.html";
        }
    } else {
        alert("Invalid username or password.");
    }
}