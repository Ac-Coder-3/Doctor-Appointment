function redirectIfAlreadyLoggedIn() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userData = localStorage.getItem("loggedInUser");

  if (isLoggedIn && userData) {
    const user = JSON.parse(userData);
    const path = {
      admin: "/pages/AdminDashboard.html",
      doctor: "/pages/DoctorDashboard.html",
      patient: "/pages/PatientDashboard.html",
    };
    window.location.href = path[user.role] || "/index.html";
  }
}

export default redirectIfAlreadyLoggedIn;
