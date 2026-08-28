(function () {
  const nav = document.getElementById("nav");
  const menu = document.getElementById("menu-mobile");
  const toggle = document.querySelector(".nav__toggle");
  const promoSlot = document.getElementById("promo-slot");
  const film = document.getElementById("film");
  const join = document.getElementById("join");
  const joinForm = document.getElementById("join-form");
  const filmChat = document.getElementById("film-chat");

  function setPromoHeight() {
    const h = promoSlot.hidden ? 0 : promoSlot.getBoundingClientRect().height;
    document.documentElement.style.setProperty("--promo-h", `${h}px`);
  }

  function renderPromo() {
    const cfg = window.REDOBRAI_PROMO;
    if (!cfg || !cfg.enabled) {
      promoSlot.hidden = true;
      setPromoHeight();
      return;
    }

    const isModal = cfg.variant === "modal";
    promoSlot.hidden = false;
    promoSlot.innerHTML = isModal
      ? `<div class="promo-modal">
           <div class="promo-modal__card">
             <div>
               <p class="eyebrow">${escapeHtml(cfg.kicker || "Destaque")}</p>
               <h2>${escapeHtml(cfg.title)}</h2>
               <p>${escapeHtml(cfg.description || "")}</p>
             </div>
             <a class="btn btn--primary" href="${escapeAttr(cfg.ctaHref || "#")}">${escapeHtml(cfg.ctaLabel || "Saiba mais")}</a>
           </div>
         </div>`
      : `<div class="promo-banner">
           <span class="kicker">${escapeHtml(cfg.kicker || "")}</span>
           <strong>${escapeHtml(cfg.title)}</strong>
           ${cfg.ctaHref ? ` <a href="${escapeAttr(cfg.ctaHref)}">${escapeHtml(cfg.ctaLabel || "Saiba mais")}</a>` : ""}
         </div>`;

    setPromoHeight();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, "&#39;");
  }

  function openMenu() {
    nav.classList.add("is-open");
    menu.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fechar menu");
    document.body.classList.add("is-locked");
  }

  function closeMenu() {
    nav.classList.remove("is-open");
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("is-locked");
  }

  toggle.addEventListener("click", () => {
    if (menu.hidden) openMenu();
    else closeMenu();
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  function openOverlay(node) {
    closeMenu();
    node.hidden = false;
    document.body.classList.add("is-locked");
    const closeBtn = node.querySelector("[data-close]");
    if (closeBtn) closeBtn.focus();
  }

  function closeOverlay(node) {
    node.hidden = true;
    if (film.hidden && join.hidden) document.body.classList.remove("is-locked");
  }

  document.querySelectorAll("[data-open-join]").forEach((btn) => {
    btn.addEventListener("click", () => openOverlay(join));
  });

  document.querySelectorAll("[data-open-film]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openOverlay(film);
      playFilm();
    });
  });

  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => closeOverlay(btn.closest(".overlay")));
  });

  [film, join].forEach((node) => {
    node.addEventListener("click", (event) => {
      if (event.target === node) closeOverlay(node);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!film.hidden) closeOverlay(film);
    if (!join.hidden) closeOverlay(join);
    if (!menu.hidden) closeMenu();
  });

  const filmLines = [
    { who: "in", text: "Olá, Maria. Sou a Ana, da Redobrai." },
    { who: "in", text: "A fatura de junho ainda está em aberto. Posso te ajudar hoje?" },
    { who: "out", text: "Esse mês ficou apertado." },
    { who: "in", text: "Entendo. Consigo um acordo em 3x, sem juros." },
    { who: "out", text: "Fechado. Pode enviar o boleto." },
    { who: "in", text: "Enviado. Qualquer coisa, estou aqui." }
  ];

  let filmTimer;

  function playFilm() {
    filmChat.innerHTML = "";
    clearTimeout(filmTimer);
    filmLines.forEach((line, index) => {
      filmTimer = setTimeout(() => {
        const bubble = document.createElement("div");
        bubble.className = `bubble bubble--${line.who}`;
        bubble.textContent = line.text;
        filmChat.appendChild(bubble);
        filmChat.scrollTop = filmChat.scrollHeight;
      }, 700 + index * 1100);
    });
  }

  joinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(joinForm);
    const body = [
      `Nome: ${data.get("nome")}`,
      `E-mail: ${data.get("email")}`,
      `Empresa: ${data.get("empresa") || "—"}`,
      `Interesse: ${data.get("interesse")}`,
      "",
      data.get("mensagem")
    ].join("\n");

    const mailto = `mailto:contato@redobrai.com?subject=${encodeURIComponent(
      "Quero ser Redobrai"
    )}&body=${encodeURIComponent(body)}`;

    join.classList.add("is-sent");
    join.querySelector(".join__success").hidden = false;
    window.location.href = mailto;
  });

  window.addEventListener("resize", setPromoHeight);
  renderPromo();
})();
