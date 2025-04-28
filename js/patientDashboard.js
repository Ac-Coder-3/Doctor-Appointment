import showToast from "/js/toast.js";
import { displayUserInfo } from "../auth/currerUserData.js";
document.addEventListener("DOMContentLoaded", () => {
  initDashboard();
});

function initDashboard() {
  handleSidebarToggle();
  displayUserInfo();
  // handleLogout();
  setupTabs();
  loadProfile();
  loadAppointments();
}

function handleSidebarToggle() {
  const sidebar = document.querySelector("#sidebarDashboard");
  const openBtn = document.querySelector(".bi-list");
  const closeBtn = document.querySelector(".bi-x-lg");
  const content = document.querySelector("#content");

  openBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    content.classList.add("blur");
    openBtn.style.display = "none";
    closeBtn.style.display = "flex";
  });

  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
    content.classList.remove("blur");
    closeBtn.style.display = "none";
    openBtn.style.display = "flex";
  });
}

document.querySelectorAll("#logout").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("loggedInUser");
      showToast("LogOut successfully", "success");

      setTimeout(() => {
        window.location.href = "/auth/login.html";
      }, 200);
    }
  });
});

function setupTabs() {
  const links = document.querySelectorAll("a[data-target]");
  const sections = document.querySelectorAll(".section");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.dataset.target;

      sections.forEach((section) =>
        section.classList.toggle("active", section.id === targetId)
      );

      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

function loadProfile() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser || loggedInUser.role !== "patient") {
    alert("Unauthorized access!");
    window.location.href = "/auth/login.html";
    return;
  }

  let user = users.find((u) => u.email === loggedInUser.email);
  if (!user) return;

  const profileContainer = document.querySelector(".profile-container");

  const displayImg = document.getElementById("display-img");
  const displayName = document.getElementById("display-name");
  const displayRole = document.getElementById("display-role");
  const displayEmail = document.getElementById("display-email");
  const displayGender = document.getElementById("display-gender");
  const displayAge = document.getElementById("display-age");
  const editBtn = document.getElementById("edit-btn");

  const editForm = document.getElementById("profile-form");
  const previewImg = document.getElementById("preview-img");
  const editImgInput = document.getElementById("upload-img");
  const editName = document.getElementById("profile-name");
  const editPassword = document.getElementById("profile-password");
  const editAge = document.getElementById("profile-age");
  const genderRadios = document.querySelectorAll("input[name='gender']");

  const defaultImg = "/assets/images/default-user.webp";

  function fillProfile(currentUser) {
    displayImg.src = currentUser.image || defaultImg;
    displayName.textContent = currentUser.name;
    displayRole.textContent = currentUser.role;
    displayEmail.textContent = currentUser.email;
    displayGender.textContent = currentUser.gender || "enter your gender";
    displayAge.textContent = currentUser.age || "enter your age";

    previewImg.src = currentUser.image || defaultImg;
    editName.value = currentUser.name;
    editPassword.value = "";
    editAge.value = currentUser.age || "";

    genderRadios.forEach((radio) => {
      radio.checked = currentUser.gender === radio.value;
    });
  }

  editBtn.addEventListener("click", () => {
    profileContainer.classList.add("hidden");
    editForm.classList.remove("hidden");
  });

  editImgInput.addEventListener("change", async () => {
    const file = editImgInput.files[0];
    if (file && file.size > 1 * 1024 * 1024) {
      showToast("Image too large. Max size: 1MB.", "warning");
      editImgInput.value = "";
      return;
    }
    if (file) {
      previewImg.src = await resizeImage(file);
    }
  });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newName = editName.value.trim();
    const newPassword = editPassword.value.trim();
    const newAge = editAge.value.trim();
    const selectedGenderRadio = Array.from(genderRadios).find((r) => r.checked);
    const newGender = selectedGenderRadio
      ? selectedGenderRadio.value
      : user.gender;
    const newImage =
      editImgInput.files.length > 0
        ? await resizeImage(editImgInput.files[0])
        : user.image;

    const hasChanges =
      newName !== user.name ||
      (newPassword && sha256(newPassword) !== user.password) ||
      (newAge && newAge !== user.age) ||
      (newGender && newGender !== user.gender) ||
      editImgInput.files.length > 0;

    if (!hasChanges) {
      showToast("No changes made.", "warning");
      fillProfile(user);
      profileContainer.classList.remove("hidden");
      editForm.classList.add("hidden");
      return;
    }

    user.name = newName;
    if (newPassword) {
      user.password = sha256(newPassword);
    }
    user.age = newAge;
    user.gender = newGender;
    if (editImgInput.files.length > 0) {
      user.image = newImage;
    }

    users = users.map((u) => (u.email === user.email ? user : u));
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    fillProfile(user);
    profileContainer.classList.remove("hidden");
    editForm.classList.add("hidden");

    showToast("Profile updated successfully", "success");
  });

  fillProfile(user);
}

function resizeImage(file, maxSize = 1000) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const img = new Image();

    reader.onload = (e) => (img.src = e.target.result);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };

    reader.readAsDataURL(file);
  });
}

// loadProfile();

function loadAppointments() {
  const container = document.querySelector("#doctorCards");
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user?.email) {
    showError("User not found.");
    return;
  }

  showLoading();

  try {
    const allAppointments =
      JSON.parse(localStorage.getItem("appointments")) || [];
    const myAppointments = allAppointments.filter(
      (appt) => appt.patientEmail === user.email
    );
    console.log(allAppointments);
    if (!myAppointments.length) {
      return showNoBookings();
    }

    const html = myAppointments
      .map((appt) => {
        const isCancelled = appt.status === "cancelled";
        return `
        <div class="doctor-card ${isCancelled ? "cancelled-bg" : ""}">
          <div class="doctor-card-img">
            <img src="${appt.doctorImage}" alt="${appt.doctorName}" />
            <div class="doctor-info">
              <h3>${appt.doctorName} <span>${appt.specialty}</span></h3>
              <div class="badges">
                <h3>
                  <span class="${isCancelled ? "cancelled" : "pending"}">
                    ${appt.status}
                  </span>
                  <div class="appointment-actions">
            <button
              class="cancel-btn"
              data-id="${appt.id}"
              ${
                isCancelled
                  ? "disabled style='cursor: not-allowed; opacity: 0.5'"
                  : ""
              }
            >
              Cancel
            </button>
          </div>
                </h3>
                <span class="slot">🕓 ${appt.slot}</span>
              </div>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    container.innerHTML = html;
    document.querySelectorAll(".cancel-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (confirm("Are you sure you want to cancel this appointment?")) {
          cancelAppointment(id);
        }
      })
    );
  } catch (err) {
    console.error(err);
    showError("Failed to load your appointments.");
  }

  function cancelAppointment(id) {
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    const updated = appointments.map((appt) => {
      if (appt.id == id) {
        return { ...appt, status: "cancelled" };
      }
      return appt;
    });

    localStorage.setItem("appointments", JSON.stringify(updated));
    showToast("Appointment cancelled successfully", "success");
    loadAppointments();
  }

  function showLoading() {
    container.innerHTML = `<div class="loading">Loading appointments...</div>`;
  }

  function showNoBookings() {
    container.innerHTML = `<div class="no-bookings">No bookings yet.</div>`;
  }

  function showError(msg) {
    container.innerHTML = `<div class="error">${msg}</div>`;
  }
}
