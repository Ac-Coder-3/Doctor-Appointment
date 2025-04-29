import showToast from "./toast.js";
import { displayUserInfo } from "../auth/currerUserData.js";
console.log("Home script loaded");

function handleMobileNav() {
  const mobileNav = document.querySelector("#mobileNav");
  const open = document.querySelector(".bi-list");
  const close = document.querySelector(".bi-x-lg");
  const header = document.querySelector("header");
  const content = document.querySelector("#content");

  open.addEventListener("click", () => {
    mobileNav.classList.add("active");
    content.classList.add("blur");
    header.style.cssText = `width:100%; height: 100%; box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px; transition: 0.5s ease-in-out;`;
    open.style.display = "none";
    close.style.display = "flex";
  });

  close.addEventListener("click", () => {
    mobileNav.classList.remove("active");
    content.classList.remove("blur");
    header.style.height = "72px";
    close.style.display = "none";
    open.style.display = "flex";
  });
}

function setActiveNav() {
  const links = document.querySelectorAll(".nav-link");
  const currentPath = window.location.pathname;

  links.forEach((link) => {
    const linkPath = link.getAttribute("href");
    if (currentPath === linkPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

const animateElementsOnScroll = () => {
  const elements = document.querySelectorAll(".slide-in-bottom");

  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      element.classList.add("in-view");
    } else {
      element.classList.remove("in-view");
    }
  });
};

window.addEventListener("scroll", animateElementsOnScroll);

animateElementsOnScroll();

function initFAQs() {
  const faqs = [
    {
      question: "Is the doctor available today?",
      answer:
        "Availability depends on the doctor. You can check real-time slots on each doctor's profile before booking.",
    },
    {
      question: "How do I cancel or change my appointment?",
      answer:
        "Log into your account, go to 'My Appointments', and you'll see options to reschedule or cancel.",
    },
    {
      question: "Do I need to bring anything for my appointment?",
      answer:
        "Yes, bring any previous prescriptions, test results, or reports related to your condition.",
    },
    {
      question: "How much does a consultation cost?",
      answer:
        "Prices vary by doctor. You’ll see the consultation fee before confirming your booking.",
    },
    {
      question: "What happens after I book an appointment?",
      answer:
        "You’ll get a confirmation instantly and a reminder closer to your appointment time. Just show up or join online!",
    },
  ];

  const faqWrapper = document.getElementById("faqWrapper");
  if (!faqWrapper) return;
  faqs.forEach((faq) => {
    const faqItem = document.createElement("div");
    faqItem.classList.add("faq-item");

    faqItem.innerHTML = `
      <div class="faq-question">
        <span>${faq.question}</span>
        <i class="faq-icon fa-solid fa-plus"></i>
      </div>
      <div class="faq-answer">
        <p>${faq.answer}</p>
      </div>
    `;

    const question = faqItem.querySelector(".faq-question");
    const answer = faqItem.querySelector(".faq-answer");
    const icon = faqItem.querySelector(".faq-icon");

    question.addEventListener("click", () => {
      const isActive = faqItem.classList.contains("active");

      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("active");
        item.querySelector(".faq-answer").style.maxHeight = null;
        item.querySelector(".faq-icon").className = "faq-icon fa-solid fa-plus";
      });

      if (!isActive) {
        faqItem.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
        icon.className = "faq-icon fa-solid fa-minus";
      }
    });

    faqWrapper.appendChild(faqItem);
  });
}
function initServices() {
  const services = [
    {
      icon: "fa-child",
      title: "Pediatrics",
      description: "Comprehensive care for infants, children, and adolescents.",
    },
    {
      icon: "fa-heart-pulse",
      title: "Cardiology",
      description: "Heart health services including diagnosis and treatment.",
    },
    {
      icon: "fa-bone",
      title: "Orthopedic",
      description: "Bone, joint, and muscle care to keep you moving freely.",
    },
    {
      icon: "fa-female",
      title: "Gynecology",
      description:
        "Women's health services including routine checkups and care.",
    },
    {
      icon: "fa-eye",
      title: "Ophthalmology",
      description:
        "Eye examinations and treatments for various vision problems.",
    },
    {
      icon: "fa-stethoscope",
      title: "General Medicine",
      description:
        "Diagnosis and treatment for a wide range of health concerns.",
    },
  ];

  const serviceWeProvide = document.querySelector(".serviceWeProvide");
  if (!serviceWeProvide) return;
  console.log(serviceWeProvide);
  services.forEach((service) => {
    const card = document.createElement("div");
    card.className = "service-card active";
    card.innerHTML = `
      <i class="fa-solid ${service.icon} service-icon"></i>
      <h3 class="service-title">${service.title}</h3>
      <p class="service-description">${service.description}</p>
    `;
    serviceWeProvide.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const authLinks = document.querySelector("#auth-links");
  const userInfo = document.querySelector("#user-info");
  const userImg = document.querySelector("#user-img");
  const logoutBtn = document.querySelector("#logout-btn");

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  console.log(loggedInUser);

  if (loggedInUser && loggedInUser.role === "patient") {
    if (authLinks) authLinks.style.display = "none";
    if (userInfo) userInfo.style.display = "flex";
    if (userImg)
      userImg.src = loggedInUser.image || "/assets/images/default-user.webp";

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        const confirmLogout = window.confirm(
          "Are you sure you want to log out?"
        );

        if (confirmLogout) {
          localStorage.removeItem("loggedInUser");

          showToast("You have been logged out.", "warning");

          setTimeout(() => {
            window.location.href = "/auth/login.html";
          }, 1500);
        }
      });
    }
  }
});



function handleLogout() {
  document.getElementById("logout-btn").addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("loggedInUser");
      showToast("Logged out successfully", "success");
      setTimeout(() => (window.location.href = "/auth/login.html"), 1600);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  handleMobileNav();
  displayUserInfo();
handleLogout();
  setActiveNav();
  initServices();
  initFAQs();
});
