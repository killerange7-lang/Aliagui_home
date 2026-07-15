const cartItems = [];

const body = document.body;
const siteHeader = document.querySelector(".site-header");
const overlay = document.querySelector(".overlay");
const menuToggle = document.querySelector(".menu-toggle");
const menuDrawer = document.querySelector(".menu-drawer");
const searchDrawer = document.querySelector(".search-drawer");
const cartDrawer = document.querySelector(".cart-drawer");
const drawers = [menuDrawer, searchDrawer, cartDrawer].filter(Boolean);
const searchAction = document.querySelector(".search-action");
const cartAction = document.querySelector(".cart-action");
const cartList = document.querySelector(".cart-drawer .cart-list");
const contactForm = document.querySelector(".contact-form-panel");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let ticking = false;

function formatPrice(value) {
  return `${value.toLocaleString("fr-FR").replace(/\s/g, " ")} FCFA`;
}

function formatCartPrice(item) {
  if (Number.isFinite(item.price)) return formatPrice(item.price);
  return item.priceLabel || "Prix sur demande";
}

function updateCart() {
  const label = cartAction?.querySelector("span");
  const badge = cartAction?.querySelector(".cart-badge");
  if (label) label.textContent = `Panier (${cartItems.length})`;
  if (badge) {
    badge.textContent = cartItems.length;
    badge.hidden = cartItems.length === 0;
  }
  if (!cartList) return;

  cartList.innerHTML = cartItems.map((item) => `
    <li><span>${item.name}</span><strong>${formatCartPrice(item)}</strong></li>
  `).join("");
}

function updateHeaderState() {
  if (!siteHeader) return;
  siteHeader.classList.toggle("is-scrolled", (window.scrollY || window.pageYOffset) > 12);
  ticking = false;
}

function requestHeaderUpdate() {
  if (ticking) return;
  window.requestAnimationFrame(updateHeaderState);
  ticking = true;
}

function showOverlay() {
  if (!overlay) return;
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add("is-open"));
  body.classList.add("modal-lock");
}

function closeAll() {
  drawers.forEach((drawer) => drawer.classList.remove("is-open"));
  if (overlay) overlay.classList.remove("is-open");
  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
  }
  body.classList.remove("modal-lock");

  window.setTimeout(() => {
    if (overlay && !overlay.classList.contains("is-open")) overlay.hidden = true;
    drawers.forEach((drawer) => {
      if (!drawer.classList.contains("is-open")) drawer.hidden = true;
    });
  }, reduceMotion ? 0 : 240);
}

function openDrawer(drawer) {
  if (!drawer) return;
  drawers.forEach((item) => {
    item.classList.remove("is-open");
    item.hidden = true;
  });

  drawer.hidden = false;
  showOverlay();
  requestAnimationFrame(() => drawer.classList.add("is-open"));

  const menuIsOpen = drawer === menuDrawer;
  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", menuIsOpen ? "true" : "false");
    menuToggle.setAttribute("aria-label", menuIsOpen ? "Fermer le menu" : "Ouvrir le menu");
  }

  if (drawer === searchDrawer) {
    window.setTimeout(() => searchDrawer.querySelector("input")?.focus(), reduceMotion ? 0 : 160);
  }
}

function toggleMenu() {
  if (!menuDrawer) return;
  if (menuDrawer.classList.contains("is-open")) closeAll();
  else openDrawer(menuDrawer);
}

function setupRevealAnimations() {
  if (reduceMotion) return;
  const targets = document.querySelectorAll([
    ".visual-hero",
    ".tabs",
    ".product",
    ".product-card",
    ".craft-banner",
    ".origin-section",
    ".values-section .value",
    ".commitment-banner",
    ".showroom-intro",
    ".visit-section",
    ".contact-banner",
    ".contact-hero-section",
    ".contact-form-panel",
    ".contact-card",
    ".mini-footer"
  ].join(","));

  targets.forEach((target) => target.classList.add("reveal-target"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.16 });

  targets.forEach((target) => observer.observe(target));
}

function setupCollectionCatalog() {
  const grid = document.querySelector("#collection-product-grid");
  if (!grid) return;

  const typeButtons = Array.from(document.querySelectorAll("[data-type-filter]"));
  const collectionButtons = Array.from(document.querySelectorAll("[data-collection-filter]"));
  const collectionSelect = document.querySelector("#collection-select");
  const searchInput = document.querySelector("#collection-search");
  const resetButton = document.querySelector(".reset-catalog");
  const countLabel = document.querySelector("#catalog-count");
  const pageStatus = document.querySelector("#catalog-page-status");
  const emptyState = document.querySelector("#collection-empty");
  const pageNumbers = document.querySelector("#collection-page-numbers");
  const prevButton = document.querySelector(".catalog-pagination .prev-page");
  const nextButton = document.querySelector(".catalog-pagination .next-page");
  const productsPerPage = 6;

  const products = [
    {
      id: "nanan-new-01",
      name: "Nanan",
      collection: "nanan",
      badge: "Nanan",
      image: "assets/new_/nanan.jpeg",
      price: 190000,
      tone: "cool"
    },
    {
      id: "teranga-new-01",
      name: "Teranga",
      collection: "teranga",
      badge: "Teranga",
      image: "assets/new_/teranga.jpeg",
      price: 205000
    },
    {
      id: "kairo-new-01",
      name: "Kairo",
      collection: "kairo",
      badge: "Kairo",
      image: "assets/new_/kairo.jpeg",
      price: 195000
    },
    {
      id: "essentiels-new-01",
      name: "Essentiels",
      collection: "essentiels",
      badge: "Essentiels",
      image: "assets/new_/essentiels.jpeg",
      price: 180000
    },
    {
      id: "nanan-01",
      name: "Parure Soleil Abstrait",
      collection: "nanan",
      badge: "Abstrait",
      material: "Coton percale, motif pagne abstrait, 2 places",
      image: "assets/col/WhatsApp Image 2026-07-08 at 10.43.07 (1).jpeg",
      price: 185000,
      tone: "cool"
    },
    {
      id: "teranga-01",
      name: "Parure Epure Verte",
      collection: "teranga",
      badge: "Geometrique",
      material: "Satin de coton, motif geometrique, 3 places",
      image: "assets/col/WhatsApp Image 2026-07-08 at 10.43.08.jpeg",
      price: 210000
    },
    {
      id: "kairo-01",
      name: "Parure Bogolan Miel",
      collection: "kairo",
      badge: "Bogolan",
      material: "Coton bio, motif bogolan, 2 places",
      image: "assets/col/WhatsApp Image 2026-07-08 at 10.43.07.jpeg",
      price: 170000
    },
    {
      id: "essentiels-01",
      name: "Parure Terre Nomade",
      collection: "essentiels",
      badge: "Terre cuite",
      material: "Lin lave, motif terre cuite, 4 places",
      image: "assets/col/WhatsApp Image 2026-07-08 at 10.43.07 (2).jpeg",
      price: 230000
    },
    {
      id: "adingra-01",
      name: "Adingra",
      collection: "adingra",
      badge: "Adingra",
      image: "assets/adingra/WhatsApp Image 2026-07-09 at 12.04.13.jpeg",
      price: 210000
    },
    {
      id: "antique-01",
      name: "Antique",
      collection: "antique",
      badge: "Antique",
      image: "assets/antique/WhatsApp Image 2026-07-09 at 12.04.13 (1).jpeg",
      price: 225000
    },
    {
      id: "antique-02",
      name: "Antique",
      collection: "antique",
      badge: "Antique",
      image: "assets/antique/WhatsApp Image 2026-07-09 at 12.04.13.jpeg",
      price: 215000
    },
    {
      id: "antique-03",
      name: "Antique",
      collection: "antique",
      badge: "Antique",
      image: "assets/antique/WhatsApp Image 2026-07-09 at 12.04.14 (1).jpeg",
      price: 235000
    },
    {
      id: "antique-04",
      name: "Antique",
      collection: "antique",
      badge: "Antique",
      image: "assets/antique/WhatsApp Image 2026-07-09 at 12.04.14 (2).jpeg",
      price: 205000
    },
    {
      id: "antique-05",
      name: "Antique",
      collection: "antique",
      badge: "Antique",
      image: "assets/antique/WhatsApp Image 2026-07-09 at 12.04.14.jpeg",
      price: 245000
    },
    {
      id: "antique-06",
      name: "Antique",
      collection: "antique",
      badge: "Antique",
      image: "assets/antique/WhatsApp Image 2026-07-09 at 12.04.15 (1).jpeg",
      price: 198000
    },
    {
      id: "antique-07",
      name: "Antique",
      collection: "antique",
      badge: "Antique",
      image: "assets/antique/WhatsApp Image 2026-07-09 at 12.04.15 (2).jpeg",
      price: 232000
    },
    {
      id: "antique-08",
      name: "Antique",
      collection: "antique",
      badge: "Antique",
      image: "assets/antique/WhatsApp Image 2026-07-09 at 12.04.15.jpeg",
      price: 220000
    },
    {
      id: "flora-01",
      name: "Flora",
      collection: "flora",
      badge: "Flora",
      image: "assets/flora/WhatsApp Image 2026-07-09 at 12.04.12 (1).jpeg",
      price: 178000,
      tone: "cool"
    },
    {
      id: "flora-02",
      name: "Flora",
      collection: "flora",
      badge: "Flora",
      image: "assets/flora/WhatsApp Image 2026-07-09 at 12.04.12.jpeg",
      price: 188000,
      tone: "cool"
    },
    {
      id: "terreivoire-01",
      name: "Terre Ivoire",
      collection: "terreivoire",
      badge: "Terre Ivoire",
      image: "assets/terreivoire/WhatsApp Image 2026-07-09 at 12.04.12.jpeg",
      price: 230000
    }
  ];

  let activeType = "all";
  let activeCollection = "all";
  let currentPage = 1;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    })[character]);
  }

  function collectionLabel(value) {
    if (value === "terreivoire") return "Terre Ivoire";
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
  }

  function formatProductPrice(product) {
    if (Number.isFinite(product.price)) return formatPrice(product.price);
    return product.priceLabel || "Prix sur demande";
  }

  function productText(product) {
    return [
      product.name,
      product.material,
      product.type,
      product.collection,
      collectionLabel(product.collection)
    ].filter(Boolean).join(" ").toLowerCase();
  }

  function filteredProducts() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    return products.filter((product) => {
      const typeMatch = activeType === "all" || product.type === activeType;
      const collectionMatch = activeCollection === "all" || product.collection === activeCollection;
      const queryMatch = query === "" || productText(product).includes(query);
      return typeMatch && collectionMatch && queryMatch;
    });
  }

  function updateActiveButtons(buttons, activeValue, dataKey) {
    buttons.forEach((button) => {
      const isActive = button.dataset[dataKey] === activeValue;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function renderPagination(totalPages) {
    if (!pageNumbers || !prevButton || !nextButton) return;
    pageNumbers.innerHTML = "";
    for (let page = 1; page <= totalPages; page += 1) {
      const button = document.createElement("button");
      button.className = `page-number${page === currentPage ? " is-active" : ""}`;
      button.type = "button";
      button.textContent = page;
      button.setAttribute("aria-label", `Page ${page}`);
      if (page === currentPage) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => {
        currentPage = page;
        renderCatalog();
      });
      pageNumbers.appendChild(button);
    }
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
  }

  function renderCatalog() {
    const results = filteredProducts();
    const totalPages = Math.max(1, Math.ceil(results.length / productsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * productsPerPage;
    const visibleProducts = results.slice(start, start + productsPerPage);

    grid.innerHTML = visibleProducts.map((product) => {
      const label = collectionLabel(product.collection);
      const material = product.material ? `<p>${escapeHtml(product.material)}</p>` : "";
      return `
        <article class="product-card" data-product-id="${escapeHtml(product.id)}">
          <div class="product-visual ${product.tone === "cool" ? "cool" : ""}">
            <img class="product-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
            <span class="product-badge">${escapeHtml(product.badge)}</span>
          </div>
          <div class="product-copy">
            <p class="product-meta">${escapeHtml(label)}</p>
            <h3>${escapeHtml(product.name)}</h3>
            ${material}
            <p class="price">${escapeHtml(formatProductPrice(product))}</p>
          </div>
          <button class="product-add" type="button" data-add-product="${escapeHtml(product.id)}">Ajouter au panier</button>
        </article>
      `;
    }).join("");

    if (emptyState) emptyState.hidden = results.length !== 0;
    if (countLabel) countLabel.textContent = `${results.length} creation${results.length > 1 ? "s" : ""}`;
    if (pageStatus) pageStatus.textContent = `Page ${currentPage} sur ${totalPages}`;
    renderPagination(totalPages);
    updateActiveButtons(typeButtons, activeType, "typeFilter");
    updateActiveButtons(collectionButtons, activeCollection, "collectionFilter");
    if (collectionSelect) collectionSelect.value = activeCollection;
  }

  typeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeType = button.dataset.typeFilter || "all";
      currentPage = 1;
      renderCatalog();
    });
  });

  collectionSelect?.addEventListener("change", () => {
    activeCollection = collectionSelect.value || "all";
    currentPage = 1;
    renderCatalog();
  });

  collectionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCollection = button.dataset.collectionFilter || "all";
      currentPage = 1;
      renderCatalog();
    });
  });

  searchInput?.addEventListener("input", () => {
    currentPage = 1;
    renderCatalog();
  });

  resetButton?.addEventListener("click", () => {
    activeType = "all";
    activeCollection = "all";
    currentPage = 1;
    if (searchInput) searchInput.value = "";
    renderCatalog();
  });

  prevButton?.addEventListener("click", () => {
    currentPage = Math.max(1, currentPage - 1);
    renderCatalog();
  });

  nextButton?.addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(filteredProducts().length / productsPerPage));
    currentPage = Math.min(totalPages, currentPage + 1);
    renderCatalog();
  });

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add-product]");
    if (!button) return;
    const product = products.find((item) => item.id === button.dataset.addProduct);
    if (!product) return;
    cartItems.push({ name: product.name, price: product.price, priceLabel: formatProductPrice(product) });
    updateCart();
    button.textContent = "Ajoute";
    window.setTimeout(() => {
      button.textContent = "Ajouter au panier";
    }, 1300);
  });

  renderCatalog();
}

menuToggle?.addEventListener("click", toggleMenu);
searchAction?.addEventListener("click", () => openDrawer(searchDrawer));
cartAction?.addEventListener("click", () => openDrawer(cartDrawer));
overlay?.addEventListener("click", closeAll);

document.querySelectorAll(".drawer-close").forEach((button) => {
  button.addEventListener("click", closeAll);
});

document.querySelectorAll(".menu-drawer a").forEach((link) => {
  link.addEventListener("click", closeAll);
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = contactForm.querySelector(".form-message");
  if (!message) return;
  message.textContent = "Message enregistre. Notre equipe vous recontactera rapidement.";
  message.classList.add("is-visible");
  contactForm.reset();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAll();
});

window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
window.addEventListener("resize", requestHeaderUpdate);

setupCollectionCatalog();
updateCart();
updateHeaderState();
setupRevealAnimations();
