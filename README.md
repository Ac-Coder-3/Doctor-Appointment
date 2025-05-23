
# 🏥 Doctor Appointment Booking Website

![Home Page](/assets/images/hero-dr-appt.png)


## 📌 Description

This is a modern **Doctor Appointment Booking System** built with **pure JavaScript** and **localStorage**. It supports **three user roles**: **Patient**, **Doctor**, and **Admin**, each with different permissions and responsibilities.

- 🧑‍⚕️ **Patients** can register, log in, and book appointments. Booking is available **only when logged in**.
- 👨‍⚕️ **Doctors** have access to a personal dashboard where they can **view** and **update** appointment statuses (Completed / Cancelled).
- 🧑‍💼 **Admins** have full control of the platform. They can:
  - Add new doctors.
  - View  all appointments.
  - Update pending appointments even before a doctor responds.

> 🔍 **Note:** The entire system runs client-side using **localStorage**, making it fast, simple to set up, and ideal for learning frontend development and role-based logic.

---

## 💻 Code Snippets

### 🔐 Role-Based Login Redirect

```js
if (isLoggedIn && userData) {
  const user = JSON.parse(userData);
  const path = {
    admin: "/pages/AdminDashboard.html",
    doctor: "/pages/DoctorDashboard.html",
    patient: "/pages/PatientDashboard.html",
  };
  window.location.href = path[user.role] || "/index.html";
}
```

### 🗓️ Booking Appointment

```js
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
  showToast("You've already booked this time slot with this doctor.", "warning");
  return;
}

existingAppointments.push(appointment);
localStorage.setItem("appointments", JSON.stringify(existingAppointments));
```

---

## ✨ Features

- 🔑 **Role-Based Authentication** (Patient, Doctor, Admin)
- 📅 **Appointment Booking & Management**
- 👨‍⚕️ **Doctor Detail Page**
- ✅ **Status Updates**: Pending ➡️ Completed / Cancelled
- 🌟 **Patient Dashboard**
- 📂 **Doctor Dashboard**
- 🧑‍💼 **Admin Dashboard**
- 📱 **Responsive Design**
- 💾 **Fully LocalStorage-Based System**




## 🛠️ Technologies Used

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **Font Awesome**
- **Google Fonts**
- **localStorage**
- **Toastify.js**
- **Chart.js**
- **CryptoJS**



## ⚙️ Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Ac-Coder-3/Doctor-Appointment.git
```

2. **Navigate into the project directory:**

```bash
cd Doctor_Appointment
```

3. **Open `index.html` in your browser.**



## 🌐 Website Demo

- 🔗 **Live Demo:** [https://doctor-appointment-steel-three.vercel.app/](https://doctor-appointment-steel-three.vercel.app/)






## 🙏 Acknowledgments

- [Font Awesome](https://fontawesome.com/)
- [Google Fonts](https://fonts.google.com/)
- [Toastify.js](https://www.npmjs.com/package/toastify-js)
- [Chart.js](https://www.chartjs.org/)
- [CryptoJS](https://crypto-js.gitbook.io/docs/)



## 📧 Contact

Got questions or feedback? Reach out:

- 📩 **Email:** [abdullahiac844@gmail.com](mailto:abdullahiac844@gmail.com)
- 💻 **GitHub:** [github.com/Ac-Coder-3](https://github.com/Ac-Coder-3)



## 🧠 Conclusion

```txt
This doctor appointment system simulates real-world logic using only frontend tools. It's ideal for learning JavaScript, working with localStorage, and building clean, role-based UI experiences.

Contributions and feedback are welcome!

Happy Coding! 🎉
```

<h1><strong><h4 style="text-align: center; font-size: 16px;  font-weight: bold; color:#10b981; font-family: 'Courier New', Courier, monospace">Thank you to the Dugsiiye team and especially to our teacher MR HAMOUDA</h4></strong></h1>
