import { showToast } from "./toast.js";

export const logOut = () => {
  const logoutBtn = document.querySelector("#logout");
  console.log("logout", logoutBtn);

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      const confirmLogout = window.confirm("Are you sure you want to log out?");

      if (confirmLogout) {
        localStorage.removeItem("loggedInUser");
        showToast("You have been logged out.", "warning");

        setTimeout(() => {
          window.location.href = "/auth/login.html";
        }, 1500);
      }
    });
  }
};
