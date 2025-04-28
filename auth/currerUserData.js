export const displayUserInfo = () => {
  const authLinks = document.querySelector("#auth-links");
  const userInfo = document.querySelector("#user-info");
  //   const userImg = document.querySelector("#profile-img");
  const userName = document.querySelector("#name");
  const userRole = document.querySelector("#userRole");
  const userLink = document.querySelector("#user-link");
  const desktopImg = document.querySelector("#desktop-profile-img");
  const mobileImg = document.querySelector("#mobile-profile-img");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  console.log("Displaying user info...");
  console.log(loggedInUser);

  if (loggedInUser) {
    if (authLinks) authLinks.style.display = "none";
    if (userInfo) userInfo.style.display = "flex";

    // if (userImg)
    //   userImg.src = loggedInUser.image || "/assets/images/default-user.webp";
    if (userName) userName.textContent = loggedInUser.name || "Unknown";
    if (userRole) userRole.textContent = loggedInUser.role || "Unknown";

    const userImage = loggedInUser.image || "/assets/images/default-user.webp";

    if (desktopImg) desktopImg.src = userImage;
    if (mobileImg) mobileImg.src = userImage;

    if (userLink) {
      switch (loggedInUser.role) {
        case "patient":
          userLink.href = "/pages/PatientDashboard.html";
          break;
        case "doctor":
          userLink.href = "/pages/DoctorDashboard.html";
          break;
        case "admin":
          userLink.href = "/admin/dashboard.html";
          break;
        default:
          userLink.href = "/index.html";
      }
    }
  } else {
    if (authLinks) authLinks.style.display = "flex";
    if (userInfo) userInfo.style.display = "none";
  }
};
