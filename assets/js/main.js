/*===============================
=            MAIN JS            =
===============================*/

/*===== MENU SHOW (MOBILE) =====*/
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId);
  const nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show");
      toggle.setAttribute("aria-expanded", nav.classList.contains("show"));
    });
  }
};
showMenu("nav-toggle", "nav-menu");

/*===== ACTIVE LINK + CLOSE MOBILE MENU =====*/
const navLinks = document.querySelectorAll(".nav__link");

function linkAction() {
  navLinks.forEach((n) => n.classList.remove("active"));
  this.classList.add("active");

  const navMenu = document.getElementById("nav-menu");
  navMenu && navMenu.classList.remove("show");

  const toggle = document.getElementById("nav-toggle");
  toggle && toggle.setAttribute("aria-expanded", "false");
}

navLinks.forEach((n) => n.addEventListener("click", linkAction));

/*===== SCROLL REVEAL =====*/
const sr = ScrollReveal({
  origin: "top",
  distance: "80px",
  duration: 1000,
  reset: false,
});

/*SCROLL HOME*/
sr.reveal(".home__title", {});
sr.reveal(".home__description", { delay: 200 });
sr.reveal(".home__download", { delay: 400 });
sr.reveal(".home__social", { delay: 600, interval: 200 });
sr.reveal(".home__img", { delay: 400 });

/*SCROLL FEATURES*/
sr.reveal(".feature__card", { interval: 200 });

/*SCROLL ABOUT*/
sr.reveal(".about__img", {});
sr.reveal(".about__subtitle", { delay: 200 });
sr.reveal(".about__text", { delay: 400 });
sr.reveal(".about__button", { delay: 600 });

/*SCROLL TESTIMONIALS*/
sr.reveal(".testimonial__card", { interval: 200 });

/*SCROLL CONTACT*/
sr.reveal(".contact__input", { interval: 200 });
sr.reveal(".contact__button", { delay: 400 });
sr.reveal(".contact__info-item", { interval: 200 });

/*===== THEME (NO FLASH) =====
  - DEFAULT: DARK
  - Applies theme ASAP on load (before paint if you also add the small <head> script)
  - Keeps html + body in sync
  - Saves:
      selected-theme = "dark" | "light"
      selected-icon  = "sun"  | "moon"
*/
(function initTheme() {
  const themeButton = document.getElementById("iconMS");
  if (!themeButton) return;

  const darkTheme = "dark-theme";
  const iconSun = "assets/img/sun.png";
  const iconMoon = "assets/img/moon.png";

  const root = document.documentElement;

  // Saved values (or null if first visit)
  const selectedTheme = localStorage.getItem("selected-theme"); // "dark" | "light" | null
  const selectedIcon = localStorage.getItem("selected-icon");   // "sun"  | "moon"  | null

  const applyTheme = (isDark) => {
    root.classList.toggle(darkTheme, isDark);
    document.body.classList.toggle(darkTheme, isDark);
  };

  // ✅ DEFAULT: DARK (only go light if explicitly saved)
  const isDark = selectedTheme !== "light";
  applyTheme(isDark);

  // Icon should show what user can switch TO
  // If currently dark -> show sun (tap to go light)
  // If currently light -> show moon (tap to go dark)
  // If you want to respect previously saved icon, keep the next 3 lines.
  if (selectedIcon === "sun") themeButton.src = iconSun;
  else if (selectedIcon === "moon") themeButton.src = iconMoon;
  else themeButton.src = isDark ? iconSun : iconMoon;

  // Toggle theme on click
  themeButton.addEventListener("click", () => {
    const nowDark = !root.classList.contains(darkTheme);
    applyTheme(nowDark);

    themeButton.src = nowDark ? iconSun : iconMoon;

    localStorage.setItem("selected-theme", nowDark ? "dark" : "light");
    localStorage.setItem("selected-icon", nowDark ? "sun" : "moon");
  });
})();

/*===== FORM SUBMISSION =====*/
const form = document.getElementById("my-form");
const formButton = document.getElementById("my-form-button");
const formStatus = document.getElementById("my-form-status");

if (form) {
  async function handleSubmit(event) {
    event.preventDefault();

    if (formButton) {
      formButton.innerHTML = "<span>Sending...</span>";
      formButton.disabled = true;
    }

    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        if (formStatus) formStatus.innerHTML = "Thanks for your message! We'll be in touch soon.";
        form.reset();

        setTimeout(() => {
          if (formStatus) formStatus.innerHTML = "";
        }, 5000);
      } else {
        const json = await response.json().catch(() => null);

        if (formStatus) {
          if (json && json.errors) {
            formStatus.innerHTML = json.errors.map((e) => e.message).join(", ");
          } else {
            formStatus.innerHTML = "Oops! There was a problem submitting your form.";
          }
        }
      }
    } catch (error) {
      if (formStatus) formStatus.innerHTML = "Oops! There was a problem submitting your form.";
    }

    if (formButton) {
      formButton.innerHTML = '<span>Send Message</span><i class="bx bx-send"></i>';
      formButton.disabled = false;
    }
  }

  form.addEventListener("submit", handleSubmit);
}

/*===== SCROLL ACTIVE LINK =====*/
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    const sectionId = current.getAttribute("id");

    const link = document.querySelector(".nav__link[href*=" + sectionId + "]");
    if (!link) return;

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", scrollActive);

/*===== LAZY LOADING IMAGES =====*/
document.addEventListener("DOMContentLoaded", function () {
  const lazyImages = document.querySelectorAll(".screenshot__img");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target;
          if (image.dataset.src) {
            image.src = image.dataset.src;
            image.removeAttribute("data-src");
          }
          imageObserver.unobserve(image);
        }
      });
    });

    lazyImages.forEach((image) => imageObserver.observe(image));
  } else {
    lazyImages.forEach((image) => {
      if (image.dataset.src) {
        image.src = image.dataset.src;
        image.removeAttribute("data-src");
      }
    });
  }
});

/*===== BUBBLE BACKGROUND GENERATION =====*/
document.addEventListener("DOMContentLoaded", function () {
  const bubbleContainer = document.querySelector(".bubble-container");
  if (!bubbleContainer) return;

  const bubbleCount = 30;

  // Clear old bubbles (prevents duplicates if the script runs twice)
  bubbleContainer.innerHTML = "";

  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");

    const size = Math.floor(Math.random() * 60) + 20;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    bubble.style.left = Math.floor(Math.random() * 100) + "%";

    const duration = Math.floor(Math.random() * 6) + 6;
    bubble.style.animationDuration = `${duration}s`;

    bubble.style.animationDelay = Math.random() * 5 + "s";

    bubbleContainer.appendChild(bubble);
  }
});

/*===== SLIDER FUNCTIONALITY (SAFE) =====*/
(function () {
  const sliderWrapper = document.querySelector(".slider-wrapper");
  const sliderTrack = document.querySelector(".slider-track");
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const indicatorsContainer = document.querySelector(".indicators");

  // If slider is not on this page, exit cleanly
  if (!sliderWrapper || !sliderTrack || !slides.length || !prevBtn || !nextBtn || !indicatorsContainer) return;

  const totalSlides = slides.length;
  const groupSize = 3;
  const groupCount = Math.ceil(totalSlides / groupSize);
  let currentGroup = 0;

  function buildIndicators() {
    indicatorsContainer.innerHTML = "";
    for (let i = 0; i < groupCount; i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (i === currentGroup) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentGroup = i;
        updateSlider();
      });
      indicatorsContainer.appendChild(dot);
    }
  }

  function updateSlider() {
    const wrapperWidth = sliderWrapper.clientWidth;
    sliderTrack.style.transform = `translateX(-${currentGroup * wrapperWidth}px)`;

    const dots = indicatorsContainer.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentGroup);
    });
  }

  prevBtn.addEventListener("click", () => {
    currentGroup = currentGroup > 0 ? currentGroup - 1 : groupCount - 1;
    updateSlider();
  });

  nextBtn.addEventListener("click", () => {
    currentGroup = currentGroup < groupCount - 1 ? currentGroup + 1 : 0;
    updateSlider();
  });

  // Auto slide (pause if user prefers reduced motion)
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let autoTimer = null;

  if (!prefersReduced) {
    autoTimer = setInterval(() => nextBtn.click(), 3000);
  }

  window.addEventListener("resize", updateSlider);

  buildIndicators();
  updateSlider();
})();
