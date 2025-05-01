let allDoctors = [];

const fetchAllDoctors = () => {
  try {
    const Doctors = JSON.parse(localStorage.getItem("doctors") || "[]");

    if (Doctors.length === 0) {
      document.querySelector(".containerFindDoctors").innerHTML =
        "<p class='no-dr'>No Doctor Added Yet </p>";
      return;
    }

    allDoctors = Doctors.filter((d) => d.isAvailable === true);

    if (allDoctors.length === 0) {
      document.querySelector(".containerFindDoctors").innerHTML =
        "<p>No available doctors right now 😢</p>";
      return;
    }

    displayAllDoctors(allDoctors);
  } catch (err) {
    console.error("Failed to load doctors ", err);
    document.querySelector(".containerFindDoctors").innerHTML =
      "<p>Something went wrong while loading doctors 😞</p>";
  }
};

function displayAllDoctors(findAllDoc) {
  const container = document.querySelector(".containerFindDoctors");
  const findAllDocCard = findAllDoc.map((d) => {
    return `
      <div class="doctor-card">
        <div class="doctor-card-img">
          <img src="${
            d.image || "../assets/dashboardIcons/profile.png>"
          }" alt="${d.name}" />
          <div class="doctor-info">
            <h3>${d.name} <span>${d.specialty}</span></h3>
            <div class="badges">
              <p><i class="fa-solid fa-location-dot"></i> ${
                d.location || "Unknown"
              }</p>
            </div>
          </div>
          <div class="call-action">
            <a href="/pages/doctorDetails.html?id=${
              d.id
            }" class="see-more-btn" data-id="${d.id}">See More</a>
          </div>
        </div>
      </div>`;
  });

  container.innerHTML = findAllDocCard.join("");
}

const doctorsContainer = document.querySelector(".containerFindDoctors");
const searchInput = document.getElementById("inputSearch");

let doctors = JSON.parse(localStorage.getItem("doctors")) || [];

function displayDoctors(filteredDoctors) {
  doctorsContainer.innerHTML = "";
  if (filteredDoctors.length === 0) {
    doctorsContainer.innerHTML = "<p>No doctors found.</p>";
    return;
  }

  filteredDoctors.forEach((doc) => {
    const doctorCard = document.createElement("div");
    doctorCard.className = "doctor-card";
    doctorCard.innerHTML = `
    <div class="doctor-card-img">
    <img src="${doc.image}" alt="Doctor Image" class="doctor-img">
    <div class="doctor-info">
    <h3>${doc.name}
    <span>${doc.specialty}</span></h3>
    <div class="badges"><p><i class="fa-solid fa-location-dot"></i> ${doc.location}</p>
    </div>
    </div>
    <div class="call-action">
    <a href="/pages/doctorDetails.html?id=1745543504496" class="see-more-btn" data-id="1745543504496">See More</a>
    </div>
    </div>
    `;
    doctorsContainer.appendChild(doctorCard);
  });
}

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase().trim();

  const filteredDoctors = doctors.filter((doc) => {
    return (
      doc.name.toLowerCase().includes(searchTerm) ||
      doc.specialty.toLowerCase().includes(searchTerm)
    );
  });

  displayDoctors(filteredDoctors);
});


displayDoctors(doctors);
const initFindDoctors = async () => {
  fetchAllDoctors();
};

initFindDoctors();
