import showToast from "/js/toast.js";

document.addEventListener("DOMContentLoaded", () => {
  // Existing functions
  function handleSidebarDashboard() {
    const sidebarDashboard = document.querySelector("#sidebarDashboard");
    const open = document.querySelector(".bi-list");
    const close = document.querySelector(".bi-x-lg");
    const content = document.querySelector("#content");

    open.addEventListener("click", () => {
      sidebarDashboard.classList.add("active");
      content.classList.add("blur");

      open.style.display = "none";
      close.style.display = "flex";
    });

    close.addEventListener("click", () => {
      sidebarDashboard.classList.remove("active");
      content.classList.remove("blur");
      close.style.display = "none";
      open.style.display = "flex";
    });
  }

  console.log("DOM fully loaded ✅");
  function currentDoctorSidebar() {
    const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );

    console.log("doctors", doctors);
    console.log("loggedInUser", loggedInUser);

    if (!loggedInUser || loggedInUser.role !== "doctor") {
      alert("Unauthorized access!");
      window.location.href = "/auth/login.html";
      return;
    }

    const currentDoctor = doctors.find((u) => u.email === loggedInUser.email);
    if (!currentDoctor) {
      console.error("Doctor not found in users list!");
      return;
    }

    const { name, image, specialty } = currentDoctor;
    console.log("JS loaded ✅", image);

    document.querySelectorAll("#drImage").forEach((img) => {
      img.src = image || "/assets/images/default-user.webp";
    });

    // Update name and specialty
    const drName = document.getElementById("drName");
    const drSpecialty = document.getElementById("drSpecialty");

    if (drName) drName.textContent = name;
    if (drSpecialty) drSpecialty.textContent = specialty;
  }

  currentDoctorSidebar();

  function currentDoctorProfile() {
    let doctors = JSON.parse(localStorage.getItem("doctors")) || [];
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );

    if (!loggedInUser || loggedInUser.role !== "doctor") {
      showToast("Unauthorized access!", "error");
      window.location.href = "/auth/login.html";
      return;
    }

    let currentDoctor = doctors.find((u) => u.email === loggedInUser.email);
    if (!currentDoctor) {
      console.error("Doctor not found in users list!");
      return;
    }

    console.log("JS loaded ✅");
    console.log("Current doctor:", currentDoctor);

    const readImg = document.getElementById("display-img");
    const readName = document.getElementById("name");
    const readRole = document.getElementById("role");
    const readAbout = document.getElementById("about");
    const readExperience = document.getElementById("experience");
    const readFee = document.getElementById("fee");
    const readAddress = document.getElementById("address");
    const readGender = document.getElementById("gender");
    const readAge = document.getElementById("age");
    const readSpecialty = document.getElementById("specialty");

    const profileForm = document.getElementById("edit-form");
    const editForm = document.getElementById("edit-form");
    const profilePreviewImage = document.getElementById("edit-img");
    const editUploadImg = document.getElementById("edit-upload-img");
    const profileName = document.getElementById("edit-name");
    const profilePassword = document.getElementById("edit-password");
    const profileSpecialty = document.getElementById("edit-specialty");
    const profileAbout = document.getElementById("edit-about");
    const profileExperience = document.getElementById("edit-experience");
    const profileFee = document.getElementById("edit-fee");
    const profileAddress = document.getElementById("edit-address");
    const genderRadios = document.querySelectorAll("input[name='gender']");
    const profileAge = document.getElementById("edit-age");
    const editBtn = document.getElementById("edit-btn");

    function fillProfileFields() {
      const defaultImg = "/assets/images/default-user.webp";

      readImg.src = currentDoctor.image || defaultImg;
      readName.textContent = currentDoctor.name;
      readRole.textContent = currentDoctor.role;
      readAbout.textContent = currentDoctor.bio;
      readExperience.textContent = `${currentDoctor.experience}+ years of experience`;
      readFee.textContent = `$${currentDoctor.fees}`;
      readAddress.textContent = currentDoctor.location || "enter your address";
      readGender.textContent = currentDoctor.gender || "enter your gender";
      readAge.textContent = currentDoctor.age || "enter your age";
      readSpecialty.textContent = currentDoctor.specialty;

      profilePreviewImage.src = currentDoctor.image || defaultImg;
      editUploadImg.value = "";

      profileName.value = currentDoctor.name;
      profilePassword.value = currentDoctor.password || "";
      profileSpecialty.value = currentDoctor.specialty;
      profileAbout.value = currentDoctor.bio;
      profileExperience.value = currentDoctor.experience;
      profileFee.value = currentDoctor.fees;
      profileAddress.value = currentDoctor.location || "";
      profileAge.value = currentDoctor.age || "";

      genderRadios.forEach((radio) => {
        radio.checked = currentDoctor.gender === radio.value;
      });
    }

    editBtn.addEventListener("click", () => {
      profileForm.classList.toggle("hidden");
      document.querySelector(".profile-container").classList.toggle("hidden");
    });

    editUploadImg.addEventListener("change", async () => {
      const file = editUploadImg.files[0];
      if (file && file.size > 1 * 1024 * 1024) {
        showToast("Image too large. Max size: 1MB.", "warning");
        editUploadImg.value = "";
        return;
      }
      if (file) {
        const base64Image = await resizeImage(file);
        profilePreviewImage.src = base64Image;
      }
    });

    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const updatedDoctor = {
        ...currentDoctor,
        name: profileName.value,
        password: profilePassword.value,
        specialty: profileSpecialty.value,
        bio: profileAbout.value,
        experience: profileExperience.value,
        fees: profileFee.value,
        location: profileAddress.value,
        gender: document.querySelector("input[name='gender']:checked").value,
        age: profileAge.value,
        image: profilePreviewImage.src,
      };

      const hasChanged = Object.keys(updatedDoctor).some(
        (key) => updatedDoctor[key] !== currentDoctor[key]
      );

      if (!hasChanged) {
        showToast("No changes made to update", "warning");
        fillProfileFields();
        profileForm.classList.toggle("hidden");
        document.querySelector(".profile-container").classList.toggle("hidden");
        return;
      }

      try {
        const index = doctors.findIndex((u) => u.email === currentDoctor.email);
        if (index !== -1) {
          doctors[index] = updatedDoctor;
          localStorage.setItem("doctors", JSON.stringify(doctors));
          currentDoctor = updatedDoctor;
          fillProfileFields();
          profileForm.classList.toggle("hidden");
          document
            .querySelector(".profile-container")
            .classList.toggle("hidden");
          showToast("Profile updated successfully", "success");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        showToast("Failed to update profile", "error");
      }
    });

    fillProfileFields();
  }

  currentDoctorProfile();

  // ✅ Image to base64 converter (no resizing for simplicity)
  function resizeImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result); // base64 string
      reader.readAsDataURL(file);
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

  ///

    const totalPatientsElement = document.querySelector("#totalPatients");
    const doctorEarningsElement = document.querySelector("#doctorEarnings");
    const totalAppointmentsElement =
      document.querySelector("#totalAppointments");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const appt = JSON.parse(localStorage.getItem("appointments")) || [];

    const loggedInDoctorR = JSON.parse(localStorage.getItem("loggedInUser"));
    const doctorId = loggedInDoctorR?.id || 1745685131185;

    const totalPatients = users.filter(
      (user) => user.role === "patient"
    ).length;
    const totalAppointments = appt.length;
    const doctorEarnings = calculateDoctorEarnings(appt, doctorId);

    totalPatientsElement.textContent =
      totalPatients > 0 ? `${totalPatients}+` : "No Patients Registered Yet";
    doctorEarningsElement.textContent =
      doctorEarnings > 0 ? `$${doctorEarnings}` : "No Earnings Yet";
    totalAppointmentsElement.textContent =
      totalAppointments > 0
        ? `${totalAppointments}+`
        : "No Appointments Booked Yet";

    function calculateDoctorEarnings(appointments, doctorId) {
      let earnings = 0;

      appointments.forEach((appointment) => {
        if (
          appointment.status === "completed" &&
          Number(appointment.doctorId) === Number(doctorId)
        ) {
          earnings += parseFloat(appointment.fees || 0);
        }
      });

      return earnings.toFixed(2);
    }

  //

  const links = Array.from(document.querySelectorAll("ul li a"));
  const sections = Array.from(document.querySelectorAll(".section"));

  const showSection = (targetId) => {
    sections.forEach((section) =>
      section.classList.toggle("active", section.id === targetId)
    );
  };

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.dataset.target;

      showSection(targetId);
      links.forEach((link) => link.classList.remove("active"));
      link.classList.add("active");
    });
  });

  const appointmentsContainer = document.querySelector(".booking-table tbody");
  const appointmentFilter = document.getElementById("appointmentFilter");

  const loggedInDoctor = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInDoctor || loggedInDoctor.role !== "doctor") {
    alert("Unauthorized access!");
    window.location.href = "/auth/login.html";
    return;
  }

  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  function filterAppointments(status) {
    const filteredAppointments = appointments.filter(
      (appt) => appt.doctorId === loggedInDoctor.id
    );
    if (status !== "all") {
      return filteredAppointments.filter((appt) => appt.status === status);
    }
    return filteredAppointments;
  }

  function renderAppointments(filteredAppointments) {
    appointmentsContainer.innerHTML = "";

    if (filteredAppointments.length === 0) {
      const noDataRow = document.createElement("tr");
      noDataRow.innerHTML = `<td class="noAppt" colspan="6">No appointments found</td>`;
      appointmentsContainer.appendChild(noDataRow);
      return;
    }

    filteredAppointments.forEach((appt) => {
      const row = document.createElement("tr");

      let actionBtns = "";

      if (appt.status === "pending") {
        actionBtns = `<div class="action-btn">
      <button class="btn-complete" data-id="${appt.id}"> Complete</button>
      <button class="btn-cancel" data-id="${appt.id}">Cancel</button>
      </div>
      `;
      } else if (appt.status === "completed") {
        actionBtns = `
        <button class="btn-complete" disabled ">Completed</button>
      `;
      } else if (appt.status === "cancelled") {
        actionBtns = `
        <button class="btn-cancel" disabled ">Cancelled</button>
      `;
      }

      row.innerHTML = `
      <td>${appt.patientName}</td>
      <td>Cash</td>
      <td>${appt.slot}</td>
      <td>$${appt.fees}</td>
      <td><span class="status ${appt.status}">${appt.status}</span></td>
      <td class="action-center">
        ${actionBtns}
      </td>
    `;

      appointmentsContainer.appendChild(row);
    });

    document.querySelectorAll(".btn-complete").forEach((btn) => {
      btn.addEventListener("click", () =>
        updateAppointmentStatus(btn.dataset.id, "completed")
      );
    });

    document.querySelectorAll(".btn-cancel").forEach((btn) => {
      btn.addEventListener("click", () =>
        updateAppointmentStatus(btn.dataset.id, "cancelled")
      );
    });
  }

  function updateAppointmentStatus(id, newStatus) {
    const index = appointments.findIndex((appt) => appt.id == id);
    if (index !== -1) {
      appointments[index].status = newStatus;
      localStorage.setItem("appointments", JSON.stringify(appointments));
      showToast(`Appointment ${newStatus}`, "success"); // show toast
      renderAppointments(filterAppointments(appointmentFilter.value)); // re-render
    }
  }

  appointmentFilter.addEventListener("change", (e) => {
    const status = e.target.value;
    renderAppointments(filterAppointments(status));
  });

  renderAppointments(filterAppointments("all"));

  // renderDoctorAppointments();
  handleSidebarDashboard();
});
