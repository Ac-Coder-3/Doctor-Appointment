import showToast from "/js/toast.js";

function protectRoute(expectedRole) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userData = localStorage.getItem("loggedInUser");

  if (!isLoggedIn || !userData) {
    showToast("Please login to continue", "error");
    setTimeout(() => {
      window.location.href = "/auth/login.html";
    }, 1600);
    return;
  }

  const user = JSON.parse(userData);

  if (user.role !== expectedRole) {
    showToast("Access Denied", "error");
    setTimeout(() => {
      window.location.href = "/auth/login.html";
    }, 1600);
  }
}

export default protectRoute;
