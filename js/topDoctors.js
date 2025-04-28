const doctorFilterConfig = {
  minExperience: 7,
  showOnlyAvailable: true,
};

const FetchTopDoctors = () => {
  try {
    showLoading();

    const doctorsFromLocal = JSON.parse(localStorage.getItem("doctors") || "[]");

    const filterDoctors = doctorsFromLocal.filter((doc) => {
      const experienceYears = parseInt(doc.experience) || 0;
      const isAvailable = !!doc.isAvailable;

      return (
        experienceYears >= doctorFilterConfig.minExperience &&
        (isAvailable || !doctorFilterConfig.showOnlyAvailable)
      );
    });

    if (filterDoctors.length === 0) {
      showError("No top related doctors found 😢");
      return;
    }

    const doctorCards = filterDoctors.map((doctor) => {
      return `
        <div class="doctor-card">
          <div class="doctor-card-img">
            <img src="${
              doctor.image || "../assets/images/dr.ahmed-.png"
            }" alt="${doctor.name}" />
            <div class="doctor-info">
              <h3>${doctor.name} <span>${doctor.specialty}</span></h3>
              <div class="badges">
                <p><i class="fa-solid fa-location-dot"></i> ${
                  doctor.location || "Unknown"
                }</p>
                <span class="exp"><i class="fa-solid fa-briefcase"></i> ${
                  doctor.experience
                } yrs</span>
              </div>
            </div>
            <div class="call-action">
              <a href="/pages/doctorDetails.html?id=${doctor.id}">Book Now</a>
            </div>
          </div>
        </div>
      `;
    });

    document.querySelector("#doctorCards").innerHTML = doctorCards.join("");
  } catch (error) {
    showError("Couldn't load Top Related Doctors. Please try again later.");
    console.error("Top Doctor Load Error:", error);
  }
};

const showLoading = () => {
  document.querySelector("#doctorCards").innerHTML = `
    <div class="loading">Loading top doctors...</div>
  `;
};

const showError = (msg) => {
  document.querySelector("#doctorCards").innerHTML = `
    <div class="error">${msg}</div>
  `;
};



const Init =  () => {
   FetchTopDoctors();
};

document.addEventListener("DOMContentLoaded", Init);
