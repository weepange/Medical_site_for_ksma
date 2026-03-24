document.addEventListener("DOMContentLoaded", () => {
  const scrollRows = document.querySelectorAll(".team-row, .reviews-row");

  scrollRows.forEach((row) => {
    row.addEventListener(
      "wheel",
      (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        event.preventDefault();
        row.scrollBy({ left: event.deltaY, behavior: "smooth" });
      },
      { passive: false }
    );
  });

  const revealTargets = document.querySelectorAll(
    ".hero, .about, .services .section-head, .services-track, .team .section-head, .team-row, .reviews .section-head, .reviews-row, .footer"
  );

  revealTargets.forEach((node) => node.classList.add("animate-in"));

  const cardGroups = [
    document.querySelectorAll(".service-tile"),
    document.querySelectorAll(".doctor-tile"),
    document.querySelectorAll(".review-square"),
  ];

  cardGroups.forEach((group) => {
    group.forEach((card, index) => {
      card.classList.add("animate-card");
      card.style.setProperty("--card-delay", `${index * 70}ms`);
    });
  });

  const cardTargets = document.querySelectorAll(".animate-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((node) => observer.observe(node));
  cardTargets.forEach((node) => observer.observe(node));

  const heroPhoto = document.querySelector(".hero-photo");
  if (heroPhoto) {
    heroPhoto.addEventListener("mousemove", (event) => {
      const rect = heroPhoto.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
      heroPhoto.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.01)`;
    });

    heroPhoto.addEventListener("mouseleave", () => {
      heroPhoto.style.transform = "translate3d(0, 0, 0) scale(1)";
    });
  }

  const teamRow = document.querySelector(".team-row");
  const teamPrev = document.querySelector('[data-team-nav="prev"]');
  const teamNext = document.querySelector('[data-team-nav="next"]');

  if (teamRow && teamPrev && teamNext) {
    const shift = () => Math.max(220, Math.round(teamRow.clientWidth * 0.55));
    teamPrev.addEventListener("click", () => {
      teamRow.scrollBy({ left: -shift(), behavior: "smooth" });
    });
    teamNext.addEventListener("click", () => {
      teamRow.scrollBy({ left: shift(), behavior: "smooth" });
    });
  }

  const bookingButtons = document.querySelectorAll(".open-booking-btn");
  const bookingForm = document.getElementById("booking-form");
  const bookingDropdown = document.getElementById("booking-dropdown");
  const bookingDropdownTrigger = document.getElementById("booking-dropdown-trigger");
  const bookingDropdownLabel = document.getElementById("booking-dropdown-label");
  const bookingOptions = Array.from(document.querySelectorAll(".booking-option"));
  const bookingService = document.getElementById("booking-service");
  const bookingPrice = document.getElementById("booking-price");
  const bookingPriceHidden = document.getElementById("booking-price-hidden");
  const bookingFeedback = document.getElementById("booking-feedback");

  const setBookingSelection = (service, forcedPrice) => {
    if (!bookingService || !bookingPrice || !bookingDropdownLabel) return;

    let activeOption =
      bookingOptions.find((option) => option.dataset.service === service) ||
      bookingOptions[0];

    bookingOptions.forEach((option) => option.classList.remove("is-selected"));
    if (activeOption) {
      activeOption.classList.add("is-selected");
    }

    const serviceValue = activeOption?.dataset.service || service || "";
    const priceValue = forcedPrice || activeOption?.dataset.price || "";

    bookingService.value = serviceValue;
    bookingDropdownLabel.textContent = serviceValue;
    bookingPrice.textContent = priceValue;
    if (bookingPriceHidden) {
      bookingPriceHidden.value = priceValue;
    }
  };

  if (bookingDropdown && bookingDropdownTrigger) {
    const closeDropdown = () => {
      bookingDropdown.classList.remove("is-open");
      bookingDropdownTrigger.setAttribute("aria-expanded", "false");
    };

    const openDropdown = () => {
      bookingDropdown.classList.add("is-open");
      bookingDropdownTrigger.setAttribute("aria-expanded", "true");
    };

    bookingDropdownTrigger.addEventListener("click", () => {
      if (bookingDropdown.classList.contains("is-open")) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    bookingOptions.forEach((option) => {
      option.addEventListener("click", () => {
        setBookingSelection(option.dataset.service || "", option.dataset.price || "");
        closeDropdown();
      });
    });

    document.addEventListener("click", (event) => {
      if (!bookingDropdown.contains(event.target)) {
        closeDropdown();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    });

    setBookingSelection("Естественные роды", "от 110 000 ₽");
  }

  bookingButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!bookingService || !bookingPrice || !bookingFeedback) return;

      const service = button.getAttribute("data-book-service");
      const price = button.getAttribute("data-book-price");

      if (service) {
        setBookingSelection(service, price || "");
      } else {
        setBookingSelection(bookingService.value, "");
      }

      bookingFeedback.textContent = "";
    });
  });

  if (bookingForm && bookingFeedback) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();
      bookingFeedback.textContent =
        "Заявка принята. Мы свяжемся с вами в ближайшее время.";
      bookingForm.reset();
      setBookingSelection("Естественные роды", "от 110 000 ₽");
    });
  }
});
