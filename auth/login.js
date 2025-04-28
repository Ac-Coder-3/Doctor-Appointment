import redirectIfAlreadyLoggedIn from "/auth/redirectIfAlreadyLoggedIn.js";
import showToast from "/js/toast.js";

redirectIfAlreadyLoggedIn();

document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showToast("Email and password are required", "error");
    return;
  }

  const users = [
    ...(JSON.parse(localStorage.getItem("users")) || []),
    ...(JSON.parse(localStorage.getItem("doctors")) || []),
  ];

  const user = users.find((user) => user.email === email);

  if (!user) {
    showToast("No account found with this email", "error");
    return;
  }

  const hashedPassword = CryptoJS.SHA256(password).toString();
  if (hashedPassword !== user.password) {
    showToast("Incorrect password", "error");
    return;
  }

  const loggedInUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.image || "/assets/images/default-user.webp",
  };

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

  showToast("Login successful", "success");

  const roleRoutes = {
    admin: "/pages/AdminDashboard.html",
    doctor: "/pages/DoctorDashboard.html",
    patient: "/pages/PatientDashboard.html",
  };

  setTimeout(() => {
    window.location.href = roleRoutes[user.role] || "/index.html";
  }, 500);
});
