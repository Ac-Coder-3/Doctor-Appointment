import showToast from "/js/toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const doctorId = new URLSearchParams(window.location.search).get("id");
  const allDoctors = JSON.parse(localStorage.getItem("doctors")) || [];
  const doctor = allDoctors.find((d) => d.id == doctorId);

  if (!doctor) {
    showToast("Doctor not found!","warning");
    return;
  }
  console.log(doctor);
  document.getElementById("doctor-image").src = doctor.image;
  document.getElementById("doctor-role").textContent = doctor.role;
  document.getElementById("doctor-name").textContent = doctor.name;
  document.getElementById("doctor-specialty").textContent = doctor.specialty;
  document.getElementById("doctor-about").textContent = doctor.bio;
  document.getElementById(
    "doctor-experience"
  ).textContent = `${doctor.experience}+ years of experience`;
  document.getElementById("price").textContent = `$${doctor.fees}`;

  // const eduList = document.getElementById("doctor-education");
  // eduList.innerHTML = "";
  // doctor.education.forEach((edu) => {
  //   // const li = document.createElement("li");
  //   const educ = document.getElementsByTagName("label");
  //   const inst = document.getElementsByTagName("label");
  //   const education = document.getElementById("education");
  //   const institution = document.getElementById("institution");
  //   educ.textContent = "Degree";
  //   inst.textContent = 'Institution';
  //   education.textContent =`degree ${edu.degree}`;
  //   institution.textContent = `institution ${edu.institution}`;
  //   // li.textContent = `degree ${edu.degree} -institution ${edu.institution} (${edu.year})`;
  //   eduList.appendChild(education , institution);
  // });

  const eduList = document.getElementById("doctor-education");
  eduList.innerHTML = "";

  doctor.education.forEach((edu) => {
    const li = document.createElement("li");

    const educationLabel = document.createElement("label");
    educationLabel.textContent = "Degree: ";

    const education = document.createElement("span");
    education.textContent = edu.degree;

    const institutionLabel = document.createElement("label");
    institutionLabel.textContent = "Institution: ";

    const institution = document.createElement("span");
    institution.textContent = edu.institution;

    const yearLabel = document.createElement("label");
    yearLabel.textContent = "Year: ";

    const year = document.createElement("span");
    year.textContent = edu.year;
    li.appendChild(educationLabel);

    li.appendChild(education);
    // li.appendChild(document.createTextNode(" | "));
    li.appendChild(institutionLabel);
    li.appendChild(institution);
    li.appendChild(yearLabel);
    li.appendChild(year);

    eduList.appendChild(li);
  });
  const timeSlotContainer = document.getElementById("doctor-time-slots");
  const selectSlot = document.getElementById("selected-slot");
  timeSlotContainer.innerHTML = "";
  selectSlot.innerHTML = '<option value="">Select a time</option>';

  doctor.timeSlots.forEach((slot) => {
    const timeText = `${slot.day}: ${slot.start} - ${slot.end}`;
    const div = document.createElement("div");
    div.className = "slot";
    div.textContent = timeText;
    timeSlotContainer.appendChild(div);

    const option = document.createElement("option");
    option.value = timeText;
    option.textContent = timeText;
    selectSlot.appendChild(option);
  });

  document.getElementById("book-appointment").addEventListener("click", () => {
    const selectedTime = selectSlot.value;
    if (!selectedTime) {
      showToast("Please select a time slot!", "warning");
      return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || loggedInUser.role !== "patient") {
      showToast("Only patients can book appointments.", "warning");
      return;
    }

    const patientImage =
      loggedInUser.image || "/assets/images/default-user.webp";

    const appointment = {
      id: Date.now(),
      patientEmail: loggedInUser.email,
      patientName: loggedInUser.name,
      patientImage: patientImage,
      doctorId: doctor.id,
      doctorImage: doctor.image,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      fees: doctor.fees,
      slot: selectedTime,
      date: new Date().toISOString().slice(0, 10),
      status: "pending",
    };

    const existingAppointments =
      JSON.parse(localStorage.getItem("appointments")) || [];

    const alreadyBooked = existingAppointments.some(
      (appt) =>
        appt.doctorId === doctor.id &&
        appt.patientEmail === loggedInUser.email &&
        appt.slot === selectedTime &&
        appt.status !== "cancelled"
    );

    if (alreadyBooked) {
      showToast(
        "You've already booked this time slot with this doctor.",
        "warning"
      );
      return;
    }

    existingAppointments.push(appointment);
    localStorage.setItem("appointments", JSON.stringify(existingAppointments));

    showToast("Appointment booked successfully.", "success");
    setTimeout(() => {
      window.location.href = "/pages/confirmation.html";
    }, 1500);
  });
});
