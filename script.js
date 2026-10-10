(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const body = document.body;
  const loader = $(".loader");
  const progress = $(".scroll-progress");
  const menuBtn = $(".menu-button");
  const mobileMenu = $(".mobile-menu");

  /* ------------------------------
     Loader
  ------------------------------ */
  let count = 0;
  const countEl = $(".loader__count");
  const countTimer = setInterval(() => {
    count += Math.ceil((100 - count) * 0.16);
    if (count >= 100) {
      count = 100;
      clearInterval(countTimer);
      countEl.textContent = "100";
      setTimeout(() => loader.classList.add("is-done"), 250);
    } else {
      countEl.textContent = String(count).padStart(2, "0");
    }
  }, 35);

  window.addEventListener("load", () => {
    setTimeout(() => {
      count = 100;
      countEl.textContent = "100";
      loader.classList.add("is-done");
    }, 350);
  });

  /* ------------------------------
     Mobile menu
  ------------------------------ */
  const setMenu = (open) => {
    menuBtn.setAttribute("aria-expanded", String(open));
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    body.classList.toggle("is-locked", open);
  };

  menuBtn.addEventListener("click", () => {
    setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
  });

  $$(".mobile-menu a").forEach(link => link.addEventListener("click", () => setMenu(false)));

  /* ------------------------------
     Reveal observer
  ------------------------------ */
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13, rootMargin: "0px 0px -40px 0px" });

  $$(".reveal").forEach(el => revealObserver.observe(el));

  /* ------------------------------
     Scroll progress + small effects
  ------------------------------ */
  let lastScrollY = scrollY;
  let ticking = false;

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = max > 0 ? `${(scrollY / max) * 100}%` : "0%";

    const direction = scrollY > lastScrollY ? 1 : -1;
    document.documentElement.style.setProperty("--scroll-y", `${scrollY}px`);
    document.documentElement.style.setProperty("--scroll-direction", direction);
    lastScrollY = scrollY;
    ticking = false;
  };

  addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* ------------------------------
     Gentle parallax for conceptual words
  ------------------------------ */
  const conceptWords = $$(".concept-word[data-speed]");
  const parallax = () => {
    conceptWords.forEach(word => {
      const rect = word.getBoundingClientRect();
      const center = innerHeight / 2;
      const delta = (rect.top + rect.height / 2 - center);
      const speed = parseFloat(word.dataset.speed || "0.05");
      word.style.transform = `translate3d(${delta * speed}px,0,0)`;
    });
  };
  addEventListener("scroll", parallax, { passive: true });
  addEventListener("resize", parallax, { passive: true });
  parallax();

  /* ------------------------------
     Magnetic buttons
  ------------------------------ */
  if (window.matchMedia("(pointer:fine)").matches) {
    $$(".magnetic").forEach(el => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate3d(${x * 0.09}px, ${y * 0.09}px, 0)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ------------------------------
     Project hover tilt
  ------------------------------ */
  if (window.matchMedia("(pointer:fine)").matches) {
    $$(".project-visual").forEach(visual => {
      visual.addEventListener("mousemove", (e) => {
        const r = visual.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        visual.style.transform = `perspective(1000px) rotateX(${y * -2.2}deg) rotateY(${x * 2.2}deg)`;
      });
      visual.addEventListener("mouseleave", () => {
        visual.style.transform = "";
      });
    });
  }

  /* ------------------------------
     Case modal
  ------------------------------ */
  const modal = $(".case-modal");
  const modalTitle = $(".case-modal__title");
  const modalIntro = $(".case-modal__intro");
  const modalVisual = $(".case-modal__visual");
  const modalSegment = $(".case-modal__segment");
  const modalConcept = $(".case-modal__concept");
  const modalDirection = $(".case-modal__direction");

  const cases = {
    "lumen": {
      title: "Lumen",
      intro: "Lumen é um estudo de identidade visual para uma marca conceitual ligada ao bem-estar, ao cuidado e à qualidade de vida. O nome remete à luz; por isso, a proposta busca traduzir clareza, acolhimento e confiança em uma linguagem visual leve e organizada. A identidade procura transmitir a sensação de uma marca acessível, cuidadosa e segura.",
      tone: "lumen", segment: "Bem-estar e qualidade de vida", concept: "Luz, clareza e acolhimento", direction: "Leve, limpa e confiável", image: "Lumen.png"
    },
    "vyron": {
      title: "Vyron",
      intro: "Vyron é um conceito de identidade para uma marca esportiva. A direção visual foi pensada para comunicar energia, velocidade e performance, com uma presença firme e dinâmica. O objetivo conceitual é conectar a marca a movimento, disciplina e superação — valores associados a quem treina, compete e busca evoluir.",
      tone: "vyron", segment: "Esporte e performance", concept: "Movimento, energia e superação", direction: "Forte, dinâmica e contemporânea", image: "Vyron.png"
    },
    "brownie": {
      title: "Le Brownie",
      intro: "Le Brownie é uma identidade voltada ao universo dos brownies e da confeitaria. A comunicação de uma marca desse segmento precisa despertar desejo, valorizar o produto e passar uma sensação de cuidado artesanal. A leitura conceitual deste projeto explora uma personalidade acolhedora e marcante, buscando aproximar a marca de quem procura um doce especial. A descrição interpreta a proposta visual do projeto, sem afirmar detalhes comerciais não apresentados.",
      tone: "brownie", segment: "Brownies e confeitaria", concept: "Desejo, sabor e cuidado", direction: "Acolhedora, apetitosa e memorável", image: "Le Brownie.png"
    },
    "vans": {
      title: "Vans",
      intro: "Este projeto é um estudo vetorial da identidade visual da Vans, marca associada ao skate, à música e à cultura urbana. O estudo observa como uma assinatura visual direta e de alto contraste transmite personalidade, reconhecimento e atitude em diferentes aplicações. Trata-se de um exercício de análise e vetor, não de uma identidade oficial nem de um trabalho encomendado pela marca.",
      tone: "vans", segment: "Skate e cultura urbana", concept: "Autenticidade e atitude", direction: "Direta, contrastante e reconhecível", image: "vans vetor.png"
    }
  };

  const openModal = (key) => {
    const data = cases[key];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalIntro.textContent = data.intro;
    modalSegment.textContent = data.segment;
    modalConcept.textContent = data.concept;
    modalDirection.textContent = data.direction;
    modalVisual.className = "case-modal__visual";
    modalVisual.classList.add(`case-modal__visual--${data.tone}`);
    modalVisual.replaceChildren();
    const caseImage = document.createElement("img");
    caseImage.src = data.image;
    caseImage.alt = `Identidade visual / estudo de ${data.title}`;
    caseImage.onerror = () => {
      caseImage.remove();
      const fallback = document.createElement("span");
      fallback.className = "modal-word";
      fallback.textContent = data.title.toUpperCase();
      modalVisual.appendChild(fallback);
    };
    modalVisual.appendChild(caseImage);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("is-locked");
    history.replaceState(null, "", `#case-${key}`);
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    body.classList.remove("is-locked");
    if (location.hash.startsWith("#case-")) history.replaceState(null, "", location.pathname + location.search);
  };

  $$(".project[data-project] .project-link").forEach(link => {
    link.addEventListener("click", e => {
      const project = link.closest(".project").dataset.project;
      if (!cases[project]) return;
      e.preventDefault();
      openModal(project);
    });
  });

  $(".case-modal__close").addEventListener("click", closeModal);
  $(".case-modal__backdrop").addEventListener("click", closeModal);
  addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  /* ------------------------------
     Footer year
  ------------------------------ */
  $("#year").textContent = new Date().getFullYear();

})();
