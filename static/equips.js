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
    if (currentType !== "all" && (e.type_label || "") !== currentType) {
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

    //const imgSrc = e.imagen_local || e.imagen;
    const imgSrc = e.imagen;

    card.innerHTML = `
      <img src="${imgSrc}" alt="${e.nombre_jp}" width="60" height="60">
      <div class="name">${e.nombre_jp}</div>
      <div class="meta">★${e.rareza} · ${e.type_label || ""}</div>
    `;

    card.addEventListener("click", () => openEquip(e.equip_id || e.id));

    container.appendChild(card);
  });
}

// ===============================
// MODAL (BÁSICO)
// ===============================

const equipModal = document.getElementById("equip-modal");
const equipCard  = document.getElementById("equip-card");

function openEquip(id) {
  console.log("CLICK EQUIP ID:", id);
  fetch(`/api/equip/${id}`)
    .then(res => res.json())
    .then(equip => {
      console.log("EQUIP DATA:", equip);

  if (!equip) {
    console.error("Equip no encontrado");
    return;
  }

  equipCard.innerHTML = `
  <img src="${equip.imagen || ""}">

  <h2>${equip.nombre}</h2>

  <p><b>Tipo:</b> ${equip.type_label}</p>
  <p><b>Rareza:</b> ${equip.rareza_text || `★${equip.rareza ?? "-"}`}</p>

  <p><b>HP:</b> ${equip.stats?.hp ?? "-"}</p>
  <p><b>ATK:</b> ${equip.stats?.atk ?? "-"}</p>
  <p><b>DEF:</b> ${equip.stats?.def ?? "-"}</p>

  <p><b>Skill:</b> ${equip.skill?.descripcion ?? "-"}</p>
  <p><b>CT:</b> ${equip.skill?.ct ?? "-"}</p>

  ${
    equip.passivas && equip.passivas.length
      ? `
        <div class="passivas">
          <p><b>Pasivas:</b></p>
          <ul>
            ${equip.passivas.map(p => `<li>${p}</li>`).join("")}
          </ul>
        </div>
      `
      : ""
  }
`;

      equipModal.classList.remove("hidden");
    })
    .catch(err => console.error("Error cargando equip:", err));
}

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
// Botón "Todos" (Tipos)
const typeAllBtn = document.querySelector('#filter-type [data-type="all"]');
if (typeAllBtn) {
  typeAllBtn.addEventListener("click", () => {
    currentType = "all";
    setActive("[data-type]", "all");
    applyFilters();
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
equipModal.addEventListener("click", () => {
  equipModal.classList.add("hidden");
});
return data
