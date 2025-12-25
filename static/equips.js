// ===============================
// ESTADO GLOBAL
// ===============================

let equips = [];
let currentType = "all";
let currentRare = "all";
let searchText = "";

const container = document.getElementById("equip-container");
const skeleton = document.getElementById("skeleton-container");
const loading = document.getElementById("loading");

// ===============================
// FETCH INICIAL
// ===============================

fetch("/api/equips")
  .then(res => {
    if (!res.ok) throw new Error("API error " + res.status);
    return res.json();
  })
  .then(data => {
    equips = data;

    skeleton.classList.add("hidden");
    loading.classList.add("hidden");
    container.classList.remove("hidden");

    populateTypeFilter();
    applyFilters();
  })
  .catch(err => {
    console.error("Error cargando equips:", err);
  });

// ===============================
// FILTROS
// ===============================

function applyFilters() {
  const filtered = equips.filter(e => {

    // Tipo
    if (currentType !== "all" && e.type_label !== currentType) {
      return false;
    }

    // Rareza
    if (currentRare !== "all" && String(e.rareza) !== currentRare) {
      return false;
    }

    // Búsqueda
    if (searchText) {
      const jp = (e.nombre_jp || "").toLowerCase();
      if (!jp.includes(searchText)) return false;
    }

    return true;
  });

  renderEquips(filtered);
}

// ===============================
// RENDER GRID
// ===============================

function renderEquips(list) {
  container.innerHTML = "";

  list.forEach(e => {
    const card = document.createElement("div");
    card.className = "card";

    const imgSrc = e.imagen_local || e.imagen;

    card.innerHTML = `
      <img src="${imgSrc}" alt="${e.nombre_jp}" width="60" height="60">
      <div class="name">${e.nombre_jp}</div>
      <div class="meta">★${e.rareza} · ${e.type_label || ""}</div>
    `;

    card.addEventListener("click", () => openEquip(e.id));

    container.appendChild(card);
  });
}

// ===============================
// MODAL (BÁSICO)
// ===============================

function openEquip(id) {
  fetch(`/api/equip/${id}`)
    .then(res => res.json())
    .then(data => {
      showModal(data);
    })
    .catch(err => console.error("Error cargando equip:", err));
}

function showModal(data) {
  const modal = document.getElementById("card-modal");
  const content = document.getElementById("modal-content");

  content.innerHTML = `
    <h2>${data.nombre}</h2>
    <img src="${data.imagen_local || data.imagen}">
    <p><b>Tipo:</b> ${data.type_label}</p>
    <p><b>Rareza:</b> ${data.rareza_text}</p>
    <p><b>Stats:</b>
      HP ${data.stats.hp} /
      ATK ${data.stats.atk} /
      DEF ${data.stats.def}
    </p>
    <p><b>Skill:</b> ${data.skill.descripcion || "-"}</p>
    <p><b>CT:</b> ${data.skill.ct ?? "-"}</p>
  `;

  modal.classList.remove("hidden");
}

document.getElementById("close-modal").onclick = () => {
  document.getElementById("card-modal").classList.add("hidden");
};
const modal = document.getElementById("equip-modal");
const card  = document.getElementById("equip-card");

function showEquip(equip) {
  card.innerHTML = `
    <div class="card-front">
      <img src="${equip.imagen_local || equip.imagen}">
      <h2>${equip.nombre}</h2>
      <p>Tipo: ${equip.tipo}</p>
      <p>Rareza: ★${equip.rareza}</p>
      <p>${equip.skill}</p>
      <p>CT: ${equip.ct}</p>
    </div>
  `;

  modal.classList.remove("hidden");
}
cardElement.onclick = () => showEquip(equip);

// ===============================
// FILTROS UI
// ===============================

function populateTypeFilter() {
  const container = document.getElementById("filter-type");
  const types = new Set();

  equips.forEach(e => {
    if (e.type_label) types.add(e.type_label);
  });

  [...types].sort().forEach(t => {
    const btn = document.createElement("button");
    btn.dataset.type = t;
    btn.textContent = t;

    btn.addEventListener("click", () => {
      currentType = t;
      setActive("[data-type]", t);
      applyFilters();
    });

    container.appendChild(btn);
  });
}

// Rareza
document.querySelectorAll("[data-rare]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentRare = btn.dataset.rare;
    setActive("[data-rare]", currentRare);
    applyFilters();
  });
});

// Buscador
document.getElementById("search").addEventListener("input", e => {
  searchText = (e.target.value || "").toLowerCase();
  applyFilters();
});

document.getElementById("toggle-filters").onclick = () => {
  document.getElementById("filters").classList.toggle("hidden");
};

// ===============================
// UTIL
// ===============================

function setActive(selector, value) {
  document.querySelectorAll(selector).forEach(btn => {
    btn.classList.remove("active");
    for (const k in btn.dataset) {
      if (btn.dataset[k] === value) btn.classList.add("active");
    }
  });
}
