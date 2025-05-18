document.addEventListener('DOMContentLoaded', () => {
  // --- Preloader functionality ---
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    });
  }

  // --- Show elements animation ---
  class AppearAnimation {
    constructor(options = {}) {
      this.threshold = options.threshold || 0.1;
      this.observer = new IntersectionObserver(this.handleIntersection, {
        threshold: this.threshold,
      });
    }

    handleIntersection = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          element.classList.add('appeared');
          observer.unobserve(element);
        }
      });
    };

    observeElements(selector) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.classList.remove('appeared');
        this.observer.observe(element);
      });
    }
  }

  const appearAnimator = new AppearAnimation({ threshold: 0.3 });
  appearAnimator.observeElements(
    '.fade-in, .slide-up, .slide-left, .slide-right, .zoom-in, .zoom-out, .rotate-in, .fade-down, .blur-in',
  );

  // --- Burger menu functionality ---
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  let isBurgerMenuOpen = false;
  const scrollToTopBtn = document.querySelector('.scroller');

  const preventScrollBurger = event => {
    if (isBurgerMenuOpen) {
      event.preventDefault();
    }
  };

  if (burger && nav) {
    const toggleBurgerMenu = () => {
      burger.classList.toggle('active');
      nav.classList.toggle('active');

      if (window.scrollY > 600) {
        scrollToTopBtn.classList.toggle('show');
      }
      isBurgerMenuOpen = !isBurgerMenuOpen;

      if (isBurgerMenuOpen) {
        document.addEventListener('wheel', preventScrollBurger, { passive: false });
        document.addEventListener('touchmove', preventScrollBurger, { passive: false });
        document.documentElement.classList.add('burger-scroll-prevented');
      } else {
        document.removeEventListener('wheel', preventScrollBurger, { passive: false });
        document.removeEventListener('touchmove', preventScrollBurger, {
          passive: false,
        });
        document.documentElement.classList.remove('burger-scroll-prevented');
      }
    };

    burger.addEventListener('click', toggleBurgerMenu);

    // Закриття по кліку на посилання або кнопку в навігації (коли вона активна)
    nav.querySelectorAll('.nav__link, .nav__button').forEach(item => {
      item.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
          toggleBurgerMenu();
        }
      });
    });

    // Закриття по кліку поза межами меню
    document.addEventListener('click', event => {
      const isClickInsideNav = nav.contains(event.target);
      const isClickOnBurger = burger.contains(event.target);

      // Закриваємо меню, якщо клікнули за межами навігації ТА не на бургер-іконці + коли відкрите меню
      if (!isClickInsideNav && !isClickOnBurger && nav.classList.contains('active')) {
        toggleBurgerMenu();
      }
    });
  }

  // --- Modal functionality ---
  const modals = document.querySelectorAll('.modal');
  const modalOpenButtons = document.querySelectorAll('[data-modal-open]');
  const modalCloseButtons = document.querySelectorAll('[data-modal-close]');

  let currentlyOpenModalId = null;
  let openModalCount = 0;

  const preventScroll = event => {
    if (openModalCount > 0) {
      event.preventDefault();
    }
  };

  const toggleModal = (modalId, show = true, skipBodyClass = false) => {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.warn(`Modal window with ID "${modalId}" not found.`);
      return;
    }

    if (show) {
      // Закриваємо попередню модалку
      if (currentlyOpenModalId && currentlyOpenModalId !== modalId) {
        toggleModal(currentlyOpenModalId, false, true);
      }

      if (openModalCount === 0) {
        document.addEventListener('wheel', preventScroll, { passive: false });
        document.addEventListener('touchmove', preventScroll, { passive: false });
        document.documentElement.classList.add('scroll-prevented');
      }
      openModalCount++;

      modal.classList.add('show');
      modal.hidden = false;
      modal.classList.remove('is-hiding');
      modal.setAttribute('aria-hidden', 'false');

      modal.querySelector('input')?.focus();
      currentlyOpenModalId = modalId;
    } else {
      modal.classList.add('is-hiding');
      modal.setAttribute('aria-hidden', 'true');
      modal.classList.remove('show');

      setTimeout(() => {
        modal.hidden = true;
        openModalCount--;
        if (openModalCount === 0) {
          document.removeEventListener('wheel', preventScroll, { passive: false });
          document.removeEventListener('touchmove', preventScroll, { passive: false });
          document.documentElement.classList.remove('scroll-prevented');
        }
        if (currentlyOpenModalId === modalId) {
          currentlyOpenModalId = null;
        }
      }, 300);
    }
  };

  // Open modal windows
  modalOpenButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-modal-open');
      toggleModal(modalId, true);
    });
  });

  // Close modal windows by button
  modalCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal) {
        toggleModal(modal.id, false);
      }
    });
  });

  // Close modal windows on Escape keydown
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && currentlyOpenModalId) {
      toggleModal(currentlyOpenModalId, false);
    }
  });

  // Close modal windows on click outside the modal
  modals.forEach(modal => {
    modal.addEventListener('mousedown', event => {
      if (event.target === modal) {
        toggleModal(modal.id, false);
      }
    });
  });

  // --- Image Modal ---
  const imageModal = document.querySelector('.image-modal');
  const imageModalContent = document.querySelector('.image-modal__content');
  const imageModalClose = document.querySelector('.image-modal__close');
  const imageBricks = document.querySelectorAll('.gallery__brick');
  const imagePreventScroll = event => {
    if (imageBricks) {
      event.preventDefault();
    }
  };

  function openModal(src) {
    imageModalContent.src = src;
    imageModal.classList.add('image-modal--visible');
    document.addEventListener('wheel', imagePreventScroll, { passive: false });
    document.addEventListener('touchmove', imagePreventScroll, { passive: false });
  }

  function closeModal() {
    imageModal.classList.remove('image-modal--visible');
    document.removeEventListener('wheel', imagePreventScroll, { passive: false });
    document.removeEventListener('touchmove', imagePreventScroll, { passive: false });
    setTimeout(() => {
      imageModalContent.src = '';
    }, 300);
  }

  if (imageBricks && imageModal && imageModalContent && imageModalClose) {
    imageBricks.forEach(brick => {
      brick.addEventListener('click', () => {
        const img = brick.querySelector('img');
        if (img?.src) openModal(img.src);
      });
    });

    imageModalClose.addEventListener('click', closeModal);

    imageModal.addEventListener('click', event => {
      if (event.target === imageModal) closeModal();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // --- Form validation ---
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    const submitButton = form.querySelector('.js-submit');
    const inputs = form.querySelectorAll(
      'input[type="text"], input[type="tel"], textarea, input[type="checkbox"][required]',
    );
    let formSubmitted = false;

    const validateField = (input, showErrors = formSubmitted) => {
      let isFieldValid = true;
      let errorMessage = '';

      if (
        input.hasAttribute('required') &&
        !input.value.trim() &&
        input.type !== 'checkbox'
      ) {
        errorMessage = 'Будь ласка, заповніть це поле.';
        isFieldValid = false;
      } else if (input.type === 'text' && input.id.includes('name')) {
        const nameValue = input.value.trim();
        const minNameLength = 2;
        const maxNameLength = 50;
        const nameRegex = /^[a-zA-Zа-яА-ЯіїєІЇЄґҐ\s\'\-]+$/;
        if (nameValue && !nameRegex.test(nameValue)) {
          errorMessage = "Ім'я може містити лише літери, пробіли, апостроф та дефіс.";
          isFieldValid = false;
        } else if (
          nameValue &&
          (nameValue.length < minNameLength || nameValue.length > maxNameLength)
        ) {
          errorMessage = `Ім'я повинно містити від ${minNameLength} до ${maxNameLength} символів.`;
          isFieldValid = false;
        }
      } else if (input.type === 'tel') {
        const phoneValue = input.value.trim();
        const digitsOnly = phoneValue.replace(/\D/g, '');
        if (digitsOnly.length !== 9) {
          errorMessage = 'Будь ласка, введіть 9 цифр номера телефону.';
          isFieldValid = false;
        }
      } else if (input.tagName === 'TEXTAREA' && input.id === 'message') {
        const messageValue = input.value.trim();
        const minMessageLength = 10;
        if (!messageValue) {
          errorMessage = 'Будь ласка, введіть повідомлення.';
          isFieldValid = false;
        } else if (messageValue.length < minMessageLength) {
          errorMessage = `Повідомлення повинно містити щонайменше ${minMessageLength} символів.`;
          isFieldValid = false;
        }
      } else if (
        input.type === 'checkbox' &&
        input.hasAttribute('required') &&
        !input.checked
      ) {
        isFieldValid = false;
      }

      if (!isFieldValid && showErrors) {
        showErrorMessage(input, errorMessage);
        input.classList.add('form__input--error');
      } else {
        hideErrorMessage(input);
        input.classList.remove('form__input--error');
      }

      return isFieldValid;
    };

    const updateSubmitButtonState = formElement => {
      const hasErrors = formElement.querySelectorAll('.form__input--error').length > 0;
      formElement.querySelector('.js-submit').disabled = formSubmitted && hasErrors;
    };

    inputs.forEach(input => {
      input.addEventListener('input', () => {
        validateField(input);
        updateSubmitButtonState(form);
      });
      input.addEventListener('blur', () => {
        validateField(input, formSubmitted);
        updateSubmitButtonState(form);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      formSubmitted = true;
      let isFormValid = true;
      inputs.forEach(input => {
        if (!validateField(input, true)) {
          isFormValid = false;
        }
      });

      if (!isFormValid) {
        submitButton.disabled = true;
        const firstInvalidInput = form.querySelector('.form__input--error');
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        console.log('Form not submitted due to validation errors.');
      } else {
        const formData = {};
        inputs.forEach(input => {
          formData[input.name || input.id] =
            input.type === 'checkbox' ? input.checked : input.value;
        });

        // Add +380 prefix to phone number
        const phoneInput = form.querySelector(
          'input[type="tel"][id*="phone"], input[type="tel"][name*="phone"]',
        );
        if (
          phoneInput &&
          formData[phoneInput.name || phoneInput.id] &&
          !formData[phoneInput.name || phoneInput.id].startsWith('+380')
        ) {
          formData[phoneInput.name || phoneInput.id] =
            '+380' + formData[phoneInput.name || phoneInput.id];
        }

        console.log('Form data for submission:', formData);

        // Тут можна додати AJAX-запит для надсилання даних на сервер

        // Clear the form after successful submission
        form.reset();
        const originalButtonTextElement =
          submitButton.querySelector('.form__button-text');
        const successTextElement = submitButton.querySelector('.form__button-success');
        const checkIcon = submitButton.querySelector('.form__button-check');
        const successTextTyping = submitButton.querySelector(
          '.form__button-success-text',
        );

        // Show "success" effect
        submitButton.disabled = true;
        originalButtonTextElement.classList.add('hidden');
        successTextElement.hidden = false;
        submitButton.classList.add('form__button--success');

        // Reset checkmark and text animations
        checkIcon.style.animation = 'none';
        successTextTyping.style.animation = 'none';
        checkIcon.offsetHeight;
        successTextTyping.offsetHeight;
        checkIcon.style.animation = null;
        successTextTyping.style.animation = null;

        const resetSubmitButton = () => {
          successTextElement.hidden = true;
          originalButtonTextElement.classList.remove('hidden');
          submitButton.classList.remove('form__button--success');
          submitButton.disabled = false;
        };

        // Revert after a delay
        setTimeout(() => {
          if (form.classList.contains('form--in-modal')) {
            const modalElement = form.closest('.modal');
            if (modalElement && modalElement.id) {
              toggleModal(modalElement.id, false);
              setTimeout(resetSubmitButton, 200);
            } else {
              console.warn(
                'Форма з класом "form--in-modal" не знайдено в модальному вікні з правильним ідентифікатором.',
              );
              resetSubmitButton();
            }
          } else {
            resetSubmitButton();
          }
        }, 3000);

        // Reset validation state
        formSubmitted = false;
        inputs.forEach(input => {
          input.classList.remove('form__input--error');
          const errorMessageElement = document.querySelector(`[data-for="${input.id}"]`);
          if (errorMessageElement) {
            errorMessageElement.style.display = 'none';
            errorMessageElement.textContent = '';
          }
        });
        console.log('Форму успішно надіслано та очищено.');
      }
    });
  });

  function showErrorMessage(inputElement, message) {
    const errorMessageElement = document.querySelector(`[data-for="${inputElement.id}"]`);
    if (errorMessageElement) {
      errorMessageElement.textContent = message;
      errorMessageElement.style.display = 'block';
    }
  }

  function hideErrorMessage(inputElement) {
    const errorMessageElement = document.querySelector(`[data-for="${inputElement.id}"]`);
    if (errorMessageElement) {
      errorMessageElement.style.display = 'none';
      errorMessageElement.textContent = '';
    }
  }

  // --- Phone input prefix functionality ---
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  const phonePrefixClass = 'form__phone-prefix'; // Class for the prefix element

  phoneInputs.forEach(phoneInput => {
    const phonePrefix = phoneInput.previousElementSibling;

    if (phonePrefix && phonePrefix.classList.contains(phonePrefixClass)) {
      phoneInput.addEventListener('focus', function () {
        phonePrefix.style.opacity = '1';
        phoneInput.classList.add('has-value');
      });

      phoneInput.addEventListener('blur', function () {
        if (!phoneInput.value.trim()) {
          phonePrefix.style.opacity = '0';
          phoneInput.classList.remove('has-value');
        }
      });

      phoneInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');

        if (phoneInput.value.trim()) {
          phoneInput.classList.add('has-value');
          phonePrefix.style.opacity = '1';
        } else {
          phoneInput.classList.remove('has-value');
          // Keep prefix visible if input is focused, even if empty
          if (!phoneInput.matches(':focus')) {
            phonePrefix.style.opacity = '0';
          }
        }
      });

      // Підтримка вставки тільки номера телефону
      phoneInput.addEventListener('paste', function (event) {
        event.preventDefault();

        const pastedText = (event.clipboardData || window.clipboardData).getData('text');
        let processedText = pastedText;

        if (processedText.startsWith('+380')) {
          processedText = processedText.substring(4);
        }

        processedText = processedText.replace(/\D+/g, '');
        processedText = processedText.slice(0, 9);
        this.value = processedText;
        this.dispatchEvent(new Event('input'));
      });
    }
  });

  // --- Scroll to top button functionality and blur header ---
  const header = document.querySelector('.header');
  if (scrollToTopBtn) {
    // Check if the element exists on the page
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        scrollToTopBtn.classList.add('show');
        header.classList.add('blur');
      } else {
        scrollToTopBtn.classList.remove('show');
        header.classList.remove('blur');
      }
    });

    scrollToTopBtn.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // --- FAQ accordion functionality ---
  const faqQuestions = document.querySelectorAll('.js-faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      question.classList.toggle('active');
      const answer = question.nextElementSibling;
      answer.classList.toggle('open');
    });
  });

  // --- Gallery slider functionality ---
  const galleryContainer = document.querySelector('.gallery__container');
  const bricks = document.querySelectorAll('.gallery__brick');
  const prevBtn = document.querySelector('.gallery__btn--prev');
  const nextBtn = document.querySelector('.gallery__btn--next');
  const pagination = document.querySelector('.gallery__pagination');
  const wrapper = document.querySelector('.gallery__wrapper');
  const galleryControls = document.querySelector('.gallery__controls');

  let currentIndex = 0;
  let autoScrollInterval;
  let isInteracting = false;
  let interactionTimeout;

  function getSlidesPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function updateSlideWidths() {
    const slidesPerView = getSlidesPerView();
    const gap = 20; // такий самий як у CSS
    const containerWidth = wrapper.offsetWidth;
    const slideWidth = (containerWidth - gap * (slidesPerView - 1)) / slidesPerView;

    bricks.forEach(slide => {
      slide.style.width = `${slideWidth}px`;
    });
  }

  function updateSliderPosition() {
    const slideWidth = bricks[0].offsetWidth;
    galleryContainer.style.transform = `translateX(-${
      currentIndex * (slideWidth + 20)
    }px)`;
    updatePagination();
  }

  function updatePagination() {
    const totalPages = Math.ceil(bricks.length / getSlidesPerView());
    pagination.innerHTML = '';

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('div');
      dot.classList.add('gallery__pagination-dot');
      if (i === currentIndex) dot.classList.add('gallery__pagination-dot--active');
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSliderPosition();
      });
      pagination.appendChild(dot);
    }
  }

  function goToNextSlide() {
    const maxIndex = Math.ceil(bricks.length / getSlidesPerView()) - 1;
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    updateSliderPosition();
  }

  function goToPrevSlide() {
    const maxIndex = Math.ceil(bricks.length / getSlidesPerView()) - 1;
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    updateSliderPosition();
  }

  prevBtn.addEventListener('click', goToPrevSlide);
  nextBtn.addEventListener('click', goToNextSlide);

  window.addEventListener('resize', () => {
    updateSlideWidths();
    updateSliderPosition();
  });

  // Автопрокрутка при видимості в viewport
  function startAutoScroll() {
    if (!autoScrollInterval) {
      autoScrollInterval = setInterval(() => {
        if (!isInteracting) goToNextSlide();
      }, 5000);
    }
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
  }

  function handleInteractionStart() {
    isInteracting = true;
    clearTimeout(interactionTimeout);
  }

  function handleInteractionEnd() {
    interactionTimeout = setTimeout(() => {
      isInteracting = false;
    }, 3000); // резервне скидання через 3 секунди
  }

  // Використовуємо лише pointer events
  [wrapper, galleryControls].forEach(el => {
    el.addEventListener('pointerenter', handleInteractionStart);
    el.addEventListener('pointerleave', handleInteractionEnd);
    el.addEventListener('pointerdown', handleInteractionStart);
    el.addEventListener('pointerup', handleInteractionEnd);
  });

  // Спостерігач видимості
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAutoScroll();
        } else {
          stopAutoScroll();
        }
      });
    },
    { threshold: 0.5 },
  );

  observer.observe(wrapper);

  let touchStartX = 0;
  wrapper.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  });
  wrapper.addEventListener('touchend', e => {
    const diffX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) goToPrevSlide();
      else goToNextSlide();
    }
  });

  // Ініціалізація
  updateSlideWidths();
  updatePagination();
  updateSliderPosition();
});
