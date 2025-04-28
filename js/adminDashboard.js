import showToast from "/js/toast.js";
document.addEventListener("DOMContentLoaded", () => {
  function handleSidebarDashboard() {
    const sidebarDashboard = document.querySelector("#sidebarDashboard");
    const open = document.querySelector(".bi-list");
    const close = document.querySelector(".bi-x-lg");
    const content = document.querySelector("#content");

    console.log("open");
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
      console.log("close");
    });
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

  function currentAdminSidebar() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );

    console.log("users", users);
    console.log("loggedInUser", loggedInUser);

    if (!loggedInUser || loggedInUser.role !== "admin") {
      showToast("Unauthorized access!", "error");
      window.location.href = "/auth/login.html";
      return;
    }

    let currentAdmin = users.find((u) => u.email === loggedInUser.email);
    if (!currentAdmin) {
      console.error("Admin not found in users list!");
      return;
    }

    console.log("JS loaded ✅");

    const { name, image, role } = currentAdmin;

    document.querySelectorAll("#adminImage").forEach((img) => {
      img.src = image || "/assets/images/default-user.webp";
    });

    document.getElementById("adminName").textContent = name;
    document.getElementById("role").textContent = role;

    document.querySelectorAll("#logout").forEach((btn) => {
      btn.style.display = "block";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const confirmLogout = confirm("Are you sure you want to logout?");
        if (confirmLogout) {
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("loggedInUser");
          showToast("LogOut successfully", "success");

          setTimeout(() => {
            window.location.href = "/auth/login.html";
          }, 1600);
        }
      });
    });
  }

  currentAdminSidebar();

  //

  const registeredDoctorsElement = document.querySelector(
    ".card-container .card:nth-child(1) h3"
  );
  const appointmentsElement = document.querySelector(
    ".card-container .card:nth-child(2) h3"
  );
  const patientsElement = document.querySelector(
    ".card-container .card:nth-child(3) h3"
  );

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;
  const totalPatients = users.filter((user) => user.role === "patient").length;

  registeredDoctorsElement.textContent =
    totalDoctors > 0 ? `${totalDoctors}+` : "No Doctors Registered Yet";
  appointmentsElement.textContent =
    totalAppointments > 0
      ? `${totalAppointments}+`
      : "No Appointments Booked Yet";
  patientsElement.textContent =
    totalPatients > 0 ? `${totalPatients}+` : "No Patients Registered Yet";

  function parseLocalDate(dateString) {
    return new Date(dateString + "T00:00:00");
  }

  function createChart(ctxId, config) {
    const ctx = document.getElementById(ctxId);
    if (!ctx) return;
    return new Chart(ctx, config);
  }

  const allAppointments =
    JSON.parse(localStorage.getItem("appointments")) || [];

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const daysMap = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  const appointmentsPerDay = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 6);
  last7Days.setHours(0, 0, 0, 0);

  allAppointments.forEach((appt) => {
    if (!appt.date) return;

    const apptDate = parseLocalDate(appt.date);
    apptDate.setHours(0, 0, 0, 0);

    if (apptDate >= last7Days && apptDate <= today) {
      const dayNumber = apptDate.getDay();
      const dayName = daysMap[dayNumber];
      appointmentsPerDay[dayName]++;
    }
  });

  const appointmentCounts = days.map((day) => appointmentsPerDay[day]);

  if (appointmentCounts.every((count) => count === 0)) {
    createChart("barChart", {
      type: "bar",
      data: {
        labels: days,
        datasets: [
          {
            label: "Appointments",
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: "#e2e8f0",
            borderRadius: 5,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "No Appointments Found",
            font: { size: 18 },
          },
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
          },
        },
        animation: {
          duration: 1000,
          easing: "easeInOutQuart",
        },
      },
    });
  } else {
    createChart("barChart", {
      type: "bar",
      data: {
        labels: days,
        datasets: [
          {
            label: "Appointments",
            data: appointmentCounts,
            backgroundColor: "#3d7aed",
            borderRadius: 5,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Appointments This Week",
            font: { size: 16 },
          },
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
          },
        },
        animation: {
          duration: 1000,
          easing: "easeInOutQuart",
        },
      },
    });
  }

  //

  const links = Array.from(document.querySelectorAll(".sidebar a"));
  const sections = Array.from(document.querySelectorAll(".section"));

  const showSection = (targetId) => {
    sections.forEach((section) =>
      section.classList.toggle("active", section.id === targetId)
    );
    console.log(sections);
  };

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      console.log(link);
      const targetId = link.dataset.target;

      showSection(targetId);
      links.forEach((link) => link.classList.remove("active"));
      link.classList.add("active");
    });
  });

  function loadAdminProfile() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser || loggedInUser.role !== "admin") {
      showToast("Unauthorized access!", "error");
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

    function fillProfile(currentUser) {
      const defaultImg = "/assets/images/default-user.webp";

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
      const selectedGenderRadio = Array.from(genderRadios).find(
        (r) => r.checked
      );
      const newGender = selectedGenderRadio
        ? selectedGenderRadio.value
        : user.gender;
      const isNewImageUploaded = editImgInput.files[0];

      let newImage = user.image;
      if (isNewImageUploaded) {
        newImage = await resizeImage(editImgInput.files[0]);
      }

      const isNameChanged = newName && newName !== user.name;
      const isPasswordChanged = newPassword !== "";
      const isAgeChanged = newAge && Number(newAge) !== Number(user.age);
      const isGenderChanged = selectedGenderRadio && newGender !== user.gender;
      const isImageChanged = isNewImageUploaded;

      const hasChanges =
        isNameChanged ||
        isPasswordChanged ||
        isAgeChanged ||
        isGenderChanged ||
        isImageChanged;

      if (!hasChanges) {
        showToast("No changes made.", "warning");
        profileContainer.classList.remove("hidden");
        editForm.classList.add("hidden");
        return;
      }

      if (isNameChanged) user.name = newName;
      if (isPasswordChanged) user.password = sha256(newPassword);
      if (isAgeChanged) user.age = newAge;
      if (isGenderChanged) user.gender = newGender;
      if (isImageChanged) user.image = newImage;

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

  loadAdminProfile();

  const modal = document.getElementById("addDoctorModal");
  const openBtn = document.getElementById("openModalBtn");
  const closeBtn = document.getElementById("closeModalBtn");

  openBtn.onclick = () => (modal.style.display = "block");
  closeBtn.onclick = () => (modal.style.display = "none");

  const addEducationBtn = document.getElementById("addEducationBtn");
  const educationContainer = document.getElementById("educationContainer");

  addEducationBtn.onclick = () => {
    const div = document.createElement("div");
    div.className = "education-group";
    div.innerHTML = `
    <input type="text" placeholder="Degree" class="edu-degree" />
    <input type="text" placeholder="Institution" class="edu-institution" />
    <input type="text" placeholder="Year" class="edu-year" />
  `;
    educationContainer.appendChild(div);
  };

  const addSlotBtn = document.getElementById("addSlotBtn");
  const timeSlotsContainer = document.getElementById("timeSlotsContainer");

  addSlotBtn.onclick = () => {
    const div = document.createElement("div");
    div.className = "time-slot";
    div.innerHTML = `
    <input type="text" placeholder="Day" class="slot-day" />
    <input type="time" class="slot-start" />
    <input type="time" class="slot-end" />
  `;
    timeSlotsContainer.appendChild(div);
  };

  const saveToLocalStorage = (doctor) => {
    const doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    doctors.push(doctor);
    localStorage.setItem("doctors", JSON.stringify(doctors));
  };

  const addDoctorForm = document.getElementById("addDoctorForm");
  const resetForm = () => addDoctorForm.reset();

  addDoctorForm.onsubmit = (e) => {
    e.preventDefault();

    const imageUrl = addDoctorForm.imageUrl.value.trim();
    const imageFile = addDoctorForm.imageFile.files[0];

    let finalImagePath = "/assets/images/default-doctor.jpg";

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function () {
        finalImagePath = reader.result;
        continueDoctorSave(finalImagePath);
      };
      reader.readAsDataURL(imageFile);
      return;
    }

    if (imageUrl) {
      finalImagePath = imageUrl;
    }

    continueDoctorSave(finalImagePath);
  };

  function continueDoctorSave(image) {
    const rawPassword = addDoctorForm.password.value.trim();

    const doctor = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: addDoctorForm.name.value.trim(),
      email: addDoctorForm.email.value.trim().toLowerCase(),
      password: "",
      specialty: addDoctorForm.specialty.value.trim(),
      fees: addDoctorForm.fees.value.trim(),
      location: addDoctorForm.location.value.trim(),
      role: addDoctorForm.role.value.trim(),
      experience: addDoctorForm.experience.value.trim(),
      image: image,
      bio: addDoctorForm.bio.value.trim(),
      isAvailable: addDoctorForm.isAvailable.value === "true",

      education: Array.from(document.querySelectorAll(".education-group")).map(
        (group) => ({
          degree: group.querySelector(".edu-degree").value.trim(),
          institution: group.querySelector(".edu-institution").value.trim(),
          year: group.querySelector(".edu-year").value.trim(),
        })
      ),
      timeSlots: Array.from(document.querySelectorAll(".time-slot")).map(
        (slot) => ({
          day: slot.querySelector(".slot-day").value.trim(),
          start: slot.querySelector(".slot-start").value.trim(),
          end: slot.querySelector(".slot-end").value.trim(),
        })
      ),
    };

    if (
      !doctor.name ||
      !doctor.email ||
      !rawPassword ||
      !doctor.specialty ||
      !doctor.fees ||
      !doctor.location ||
      !doctor.role ||
      doctor.education.some((e) => !e.degree || !e.institution || !e.year) ||
      doctor.timeSlots.some((s) => !s.day || !s.start || !s.end)
    ) {
      showToast("All fields are required", "error");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(doctor.email)) {
      showToast("Invalid email format", "error");
      return;
    }

    const existingDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    if (existingDoctors.some((d) => d.email === doctor.email)) {
      showToast("This Email is already taken", "error");
      return;
    }

    if (rawPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    const hashedPassword = CryptoJS.SHA256(rawPassword).toString();
    doctor.password = hashedPassword;

    saveToLocalStorage(doctor);
    showToast("Doctor added successfully!", "success");

    resetForm();
    modal.style.display = "none";

    setTimeout(() => {
      window.location.reload();
    }, 800);
  }

  const grid = document.querySelector(".doctor-grid");

  function loadDoctors() {
    const stored = localStorage.getItem("doctors");
    return stored ? JSON.parse(stored) : [];
  }

  function saveDoctors(doctors) {
    localStorage.setItem("doctors", JSON.stringify(doctors));
  }

  function renderDoctors() {
    const doctors = loadDoctors();
    grid.innerHTML = "";

    if (!doctors.length) {
      grid.innerHTML = `<p class="text-gray-500 text-center col-span-full">No doctors found.</p>`;
      return;
    }

    doctors.forEach((doc) => {
      const card = document.createElement("div");
      const isAvailable = doc.isAvailable === true;

      card.className = `doctor-card ${!isAvailable ? "muted-card" : ""}`;
      card.dataset.id = doc.id ?? "";

      card.innerHTML = `
      <img src="${doc.image}" alt="${doc.name}" class="doctor-img" />
      <div class="doctor-info">
        <h3>${doc.name}</h3>
        <p>${doc.specialty}</p>
        <label class="availability-toggle">
          <input
            type="checkbox"
            class="toggle-availability"
            data-id="${doc.id}"
            ${isAvailable ? "checked" : ""}
          />
          <span>Available</span>
        </label>
      </div>
    `;

      grid.appendChild(card);
    });
  }

  grid.addEventListener("change", (e) => {
    if (e.target.classList.contains("toggle-availability")) {
      const id = parseInt(e.target.dataset.id);
      const doctors = loadDoctors();
      const index = doctors.findIndex((doc) => doc.id === id);

      if (index !== -1) {
        doctors[index].isAvailable = e.target.checked;
        saveDoctors(doctors);

        const card = e.target.closest(".doctor-card");
        if (doctors[index].isAvailable) {
          card.classList.remove("muted-card");
        } else {
          card.classList.add("muted-card");
        }
      }
    }
  });
  const tableBody = document.getElementById("appointmentTableBody");
  const filterSelect = document.getElementById("appointmentFilter");
  function renderAppointments(filter = "all") {
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    tableBody.innerHTML = "";

    const filtered =
      filter === "all"
        ? appointments
        : appointments.filter((appt) => appt.status === filter);

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td class="noAppt" clospan="6">No appointments found</td>
        </tr>
      `;
      return;
    }

    filtered.forEach((appt) => {
      const tr = document.createElement("tr");

      let actionBtns = "";

      if (appt.status === "pending") {
        actionBtns = `
          <button class="btn-complete" data-id="${appt.id}">Complete</button>
          <button class="btn-cancel" data-id="${appt.id}">Cancel</button>
        `;
      } else if (appt.status === "completed") {
        actionBtns = `
          <button class="btn-complete" disabled style="opacity: 0.5;">Completed</button>
        `;
      } else if (appt.status === "cancelled") {
        actionBtns = `
          <button class="btn-cancel" disabled style="opacity: 0.5;">Cancelled</button>
        `;
      }

      tr.innerHTML = `
        <td>${appt.patientName}</td>
        <td>Cash</td>
        <td>
          <span>${appt.doctorName} | ${appt.slot}</span>
        </td>
        <td>$${appt.fees}</td>
        <td>
          <span class="status ${appt.status}">${appt.status}</span>
        </td>
        <td class="action-btn">
          ${actionBtns}
        </td>
      `;

      tableBody.appendChild(tr);
    });

    // Attach event listeners
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
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const index = appointments.findIndex((appt) => appt.id == id);

    if (index !== -1) {
      appointments[index].status = newStatus;
      localStorage.setItem("appointments", JSON.stringify(appointments));
      showToast(`Appointment ${newStatus}`, "success");
      renderAppointments(filterSelect.value);
    }
  }

  renderAppointments();

  filterSelect.addEventListener("change", () => {
    renderAppointments(filterSelect.value);
  });

  renderAppointments();

  renderDoctors();
  handleSidebarDashboard();
});
