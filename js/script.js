// ========================================
// DOM ELEMENTS
// ========================================

const body = document.body;

const header = document.querySelector(".header");

const hero = document.querySelector(".hero");

const navbar = document.querySelector(".navbar");

const menuToggle = document.querySelector(".menu-toggle");

const navLinks = document.querySelectorAll(".nav-links a");

const sections = document.querySelectorAll("section");

const counters = document.querySelectorAll(".counter");

const statsSection = document.querySelector(".stats");

// ========================================
// MOBILE MENU
// ========================================

const toggleMenu = () => {

    navbar.classList.toggle("active");

    body.classList.toggle("menu-open");

};

menuToggle?.addEventListener("click", toggleMenu);

// Keyboard accessibility

menuToggle?.addEventListener("keydown", (e) => {

    if (e.key === "Enter" || e.key === " ") {

        e.preventDefault();

        toggleMenu();

    }

});

// Close menu on link click

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navbar.classList.remove("active");

        body.classList.remove("menu-open");

    });

});

// Close menu outside click

document.addEventListener("click", (e) => {

    const clickedInsideMenu =
        navbar.contains(e.target);

    const clickedToggle =
        menuToggle.contains(e.target);

    if (
        !clickedInsideMenu &&
        !clickedToggle &&
        navbar.classList.contains("active")
    ) {

        navbar.classList.remove("active");

        body.classList.remove("menu-open");

    }

});

// ========================================
// REVEAL ANIMATIONS
// ========================================

const revealElements = document.querySelectorAll(`
    .section-title,
    .service-card,
    .feature-card,
    .portfolio-card,
    .map-card,
    .cta-section,
    .footer-column
`);

revealElements.forEach(element => {

    if (element.classList.contains("service-card")) {

        element.classList.add("reveal");

    }

    else if (element.classList.contains("feature-card")) {

        element.classList.add("reveal-left");

    }

    else if (element.classList.contains("portfolio-card")) {

        element.classList.add("reveal-zoom");

    }

    else {

        element.classList.add("reveal");

    }

});

const revealObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("active");

                revealObserver.unobserve(entry.target);

            }

        });

    },

    {
        threshold: 0.15
    }

);

revealElements.forEach(element => {

    revealObserver.observe(element);

});

// ========================================
// COUNTER ANIMATION
// ========================================

let counterStarted = false;

const startCounter = () => {

    if (counterStarted) return;

    counterStarted = true;

    counters.forEach(counter => {

        const target =
            parseInt(counter.dataset.target);

        let current = 0;

        const increment =
            target / 80;

        const updateCounter = () => {

            current += increment;

            if (current < target) {

                counter.textContent =
                    `${Math.ceil(current)}+`;

                requestAnimationFrame(updateCounter);

            } else {

                counter.textContent =
                    `${target}+`;

            }

        };

        updateCounter();

    });

};

const counterObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                startCounter();

            }

        });

    },

    {
        threshold: 0.3
    }

);

if (statsSection) {

    counterObserver.observe(statsSection);

}

// ========================================
// ACTIVE NAVIGATION
// ========================================

const updateActiveNav = () => {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.scrollY >=
            sectionTop - sectionHeight / 3
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

};

// ========================================
// SCROLL EFFECTS
// ========================================

let ticking = false;

const handleScroll = () => {

    const scrollY = window.scrollY;

    // Header effect

    header.classList.toggle(
        "scrolled",
        scrollY > 80
    );

    // Active nav

    updateActiveNav();

    ticking = false;

};

window.addEventListener(

    "scroll",

    () => {

        if (!ticking) {

            requestAnimationFrame(() => {

                handleScroll();

            });

            ticking = true;

        }

    },

    {
        passive: true
    }

);

// ========================================
// INITIAL LOAD
// ========================================

window.addEventListener("load", () => {

    handleScroll();

});

document.addEventListener("DOMContentLoaded", () => {

    const track = document.querySelector(".gallery-track");
    const slides = document.querySelectorAll(".gallery-item");

    const nextBtn = document.querySelector(".gallery-next");
    const prevBtn = document.querySelector(".gallery-prev");
    const dotsContainer = document.querySelector(".gallery-dots");

    let current = 0;
    let autoSlide;

    slides.forEach((_, index) => {

        const dot = document.createElement("div");

        dot.classList.add("gallery-dot");

        if(index === 0){
            dot.classList.add("active");
        }

        dot.addEventListener("click", () => {
            goToSlide(index);
        });

        dotsContainer.appendChild(dot);

    });

    const dots = document.querySelectorAll(".gallery-dot");

    function updateDots() {

        dots.forEach(dot =>
            dot.classList.remove("active")
        );

        dots[current].classList.add("active");
    }

    function goToSlide(index) {

        current = index;

        track.style.transform =
            `translateX(-${current * 100}%)`;

        updateDots();
    }

    function nextSlide() {

        current++;

        if(current >= slides.length){
            current = 0;
        }

        goToSlide(current);
    }

    function prevSlide() {

        current--;

        if(current < 0){
            current = slides.length - 1;
        }

        goToSlide(current);
    }

    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    function startSlider() {
        autoSlide = setInterval(nextSlide, 4000);
    }

    function stopSlider() {
        clearInterval(autoSlide);
    }

    startSlider();

    document.querySelector(".gallery-slider")
        .addEventListener("mouseenter", stopSlider);

    document.querySelector(".gallery-slider")
        .addEventListener("mouseleave", startSlider);

});

// ========================================
// FAQ ACCORDION
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {

        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!question || !answer) return;

        // Open first FAQ
        if (item.classList.contains("active")) {

            answer.style.maxHeight =
                answer.scrollHeight + "px";

        }

        question.addEventListener("click", () => {

            const isActive =
                item.classList.contains("active");


            // Close all other FAQs

            faqItems.forEach(otherItem => {

                if (otherItem !== item) {

                    otherItem.classList.remove("active");

                    const otherAnswer =
                        otherItem.querySelector(".faq-answer");

                    if (otherAnswer) {

                        otherAnswer.style.maxHeight = null;

                    }

                }

            });


            // Toggle current FAQ

            if (isActive) {

                item.classList.remove("active");

                answer.style.maxHeight = null;

            } else {

                item.classList.add("active");

                answer.style.maxHeight =
                    answer.scrollHeight + "px";

            }

        });

    });

});