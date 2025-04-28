import redirectIfAlreadyLoggedIn from "/auth/redirectIfAlreadyLoggedIn.js";
import showToast from "/js/toast.js";

redirectIfAlreadyLoggedIn();

document.getElementById("registerForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();
  const role = document.getElementById("role").value;

  if (!name || !email || !password || !confirmPassword || !role) {
    showToast("All fields are required", "error");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showToast("Invalid email format", "error");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match", "error");
    return;
  }

  if (password.length < 6) {
    showToast("Password must be at least 6 characters", "error");
    return;
  }

  if (role !== "patient" && role !== "admin") {
    showToast(
      "Only 'Patient' or 'Admin' roles can register themselves",
      "error"
    );
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some((user) => user.email === email)) {
    showToast("Email is already registered", "error");
    return;
  }

  const hashedPassword = CryptoJS.SHA256(password).toString();

  const newUser = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword,
    role,
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  showToast("Registration successful", "success");
  setTimeout(() => {
    window.location.href = "/auth/login.html";
  }, 500);
});
