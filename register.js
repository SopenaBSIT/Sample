// Ensure at least one admin exists
if(!localStorage.getItem("users")){
    localStorage.setItem("users", JSON.stringify({
        admin: { password: "admin123", status: "approved" }
    }));
}

function registerUser() {
    const username = document.getElementById("newUsername").value.trim();
    const password = document.getElementById("newPassword").value.trim();
    const confirm = document.getElementById("confirmPassword").value.trim();

    if(!username || !password || !confirm){
        alert("Please fill in all fields.");
        return;
    }

    if(password !== confirm){
        alert("Passwords do not match.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if(users[username]){
        alert("Username already exists.");
        return;
    }

    // New users start as pending approval
    users[username] = { password: password, status: "pending" };
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! Wait for admin approval.");
    window.location.href = "login.html"; // redirect to login page
}