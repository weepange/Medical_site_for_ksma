document.addEventListener("DOMContentLoaded", () => {
  const hasFinePointer =
    window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  const scrollRows = document.querySelectorAll(".team-row, .reviews-row");

  if (hasFinePointer) {
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
  }

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
  if (heroPhoto && hasFinePointer) {
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
  const bookingModalClose = document.querySelector("#booking-modal .modal-close");
  const bookingDropdown = document.getElementById("booking-dropdown");
  const bookingDropdownTrigger = document.getElementById("booking-dropdown-trigger");
  const bookingDropdownLabel = document.getElementById("booking-dropdown-label");
  const bookingOptions = Array.from(document.querySelectorAll(".booking-option"));
  const bookingService = document.getElementById("booking-service");
  const bookingPrice = document.getElementById("booking-price");
  const bookingPriceHidden = document.getElementById("booking-price-hidden");
  const bookingName = document.getElementById("booking-name");
  const bookingPhone = document.getElementById("booking-phone");
  const bookingDate = document.getElementById("booking-date");
  const bookingNameError = document.getElementById("booking-name-error");
  const bookingPhoneError = document.getElementById("booking-phone-error");
  const bookingDateError = document.getElementById("booking-date-error");
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

  const closeBookingModal = () => {
    if (bookingModalClose && typeof bookingModalClose.click === "function") {
      bookingModalClose.click();
      return;
    }
    if (window.location.hash === "#booking-modal") {
      window.location.hash = "#services";
    }
  };

  const clearFieldError = (input, errorNode) => {
    if (input) input.classList.remove("is-invalid");
    if (errorNode) errorNode.textContent = "";
  };

  const setFieldError = (input, errorNode, message) => {
    if (input) input.classList.add("is-invalid");
    if (errorNode) errorNode.textContent = message;
  };

  const formatPhone = (rawValue) => {
    let digits = (rawValue || "").replace(/\D/g, "");
    if (digits.startsWith("8")) {
      digits = `7${digits.slice(1)}`;
    } else if (digits.length > 0 && !digits.startsWith("7")) {
      digits = `7${digits}`;
    }
    digits = digits.slice(0, 11);

    let formatted = "+7";
    if (digits.length > 1) {
      formatted += ` (${digits.slice(1, 4)}`;
    }
    if (digits.length >= 4) {
      formatted += ")";
    }
    if (digits.length > 4) {
      formatted += ` ${digits.slice(4, 7)}`;
    }
    if (digits.length > 7) {
      formatted += `-${digits.slice(7, 9)}`;
    }
    if (digits.length > 9) {
      formatted += `-${digits.slice(9, 11)}`;
    }
    return formatted;
  };

  const validateName = () => {
    if (!bookingName) return true;
    const value = bookingName.value.trim().replace(/\s+/g, " ");
    bookingName.value = value;
    clearFieldError(bookingName, bookingNameError);

    if (!value) {
      setFieldError(bookingName, bookingNameError, "Введите ФИО.");
      return false;
    }

    if (!/^[A-Za-zА-Яа-яЁё\-\s]+$/.test(value)) {
      setFieldError(
        bookingName,
        bookingNameError,
        "ФИО может содержать только буквы, пробел и дефис."
      );
      return false;
    }

    const parts = value.split(" ").filter(Boolean);
    if (parts.length < 2) {
      setFieldError(
        bookingName,
        bookingNameError,
        "Укажите минимум фамилию и имя."
      );
      return false;
    }

    if (parts.some((part) => part.length < 2)) {
      setFieldError(
        bookingName,
        bookingNameError,
        "Слишком короткое ФИО. Проверьте ввод."
      );
      return false;
    }

    return true;
  };

  const validatePhone = () => {
    if (!bookingPhone) return true;
    bookingPhone.value = formatPhone(bookingPhone.value);
    clearFieldError(bookingPhone, bookingPhoneError);

    const digits = bookingPhone.value.replace(/\D/g, "");
    if (digits.length !== 11 || !digits.startsWith("7")) {
      setFieldError(
        bookingPhone,
        bookingPhoneError,
        "Введите корректный номер в формате +7 (XXX) XXX-XX-XX."
      );
      return false;
    }

    return true;
  };

  const setBookingDateDefaults = () => {
    if (!bookingDate) return;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const isoToday = `${year}-${month}-${day}`;
    bookingDate.min = isoToday;
    if (!bookingDate.value) {
      bookingDate.value = isoToday;
    }
  };

  const validateDate = () => {
    if (!bookingDate) return true;
    clearFieldError(bookingDate, bookingDateError);

    if (!bookingDate.value) {
      setFieldError(bookingDate, bookingDateError, "Выберите дату записи.");
      return false;
    }

    const selected = new Date(`${bookingDate.value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected < today) {
      setFieldError(
        bookingDate,
        bookingDateError,
        "Дата не может быть раньше сегодняшней."
      );
      return false;
    }

    return true;
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
    setBookingDateDefaults();
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
      setBookingDateDefaults();
    });
  });

  if (bookingName) {
    bookingName.addEventListener("input", () => {
      if (bookingName.classList.contains("is-invalid")) {
        validateName();
      }
    });
    bookingName.addEventListener("blur", validateName);
  }

  if (bookingPhone) {
    bookingPhone.addEventListener("input", () => {
      bookingPhone.value = formatPhone(bookingPhone.value);
      if (bookingPhone.classList.contains("is-invalid")) {
        validatePhone();
      }
    });
    bookingPhone.addEventListener("blur", validatePhone);
  }

  if (bookingDate) {
    bookingDate.addEventListener("change", () => {
      validateDate();
    });
    bookingDate.addEventListener("blur", validateDate);
    setBookingDateDefaults();
  }

  if (bookingForm && bookingFeedback) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const isNameValid = validateName();
      const isPhoneValid = validatePhone();
      const isDateValid = validateDate();

      if (!isNameValid || !isPhoneValid || !isDateValid) {
        bookingFeedback.textContent =
          "Проверьте корректность ФИО, телефона и даты записи.";
        bookingFeedback.style.color = "#cb6666";
        return;
      }

      bookingFeedback.textContent =
        "Заявка принята. Мы свяжемся с вами в ближайшее время.";
      bookingFeedback.style.color = "#5b5b5b";
      bookingForm.reset();
      clearFieldError(bookingName, bookingNameError);
      clearFieldError(bookingPhone, bookingPhoneError);
      clearFieldError(bookingDate, bookingDateError);
      setBookingSelection("Естественные роды", "от 110 000 ₽");
      setBookingDateDefaults();

      if (bookingDropdown) {
        bookingDropdown.classList.remove("is-open");
      }
      if (bookingDropdownTrigger) {
        bookingDropdownTrigger.setAttribute("aria-expanded", "false");
      }
      closeBookingModal();
    });
  }
});
