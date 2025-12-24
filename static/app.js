// ===============================
// CONFIGURACIÓN
// ===============================

const container = document.getElementById("unit-container");

const ELEMENT_COLORS = {
  1: "#c0392b", // Fire
  2: "#2980b9", // Water
  3: "#27ae60", // Earth
  4: "#f1c40f", // Light
  5: "#8e44ad"  // Dark
};
const RAREZA_ES = {
  "覚醒～超覚醒": "Awakening ~ Ascended",
  "★5～覚醒": "★5 ~ Awakening",
  "★5～夢幻": "★5 ~ Dream Awakening"
};
const ELEMENT_ES = {
  "火": "Fuego",
  "水": "Agua",
  "樹": "Tierra",
  "光": "Luz",
  "闇": "Oscuridad"
};
const RAZAS_ES = {
  "神族": "Dios",
  "人族": "Humano",
  "精霊族": "Espíritu",
  "魔族": "Demonio",
  "獣族": "Bestia",
  "竜族": "Dragón"
};
const ROLES_ES = {
  "サポーター": "Soporte",
  "アタッカー": "Atacante",
  "物理アタッカー": "Atacante",
  "魔法アタッカー": "Atacante",
  "サブアタッカー": "Sub DPS",
  "ディフェンダー": "Defensor",
  "ヒーラー": "Sanador"
};
function t(map, value) {
  return map[value] || value;
}
const JP_TERMS = {
  "物理ダメージ": "daño físico ",
  "魔法ダメージ": "daño mágico ",
  "UP": "aumenta ",
  "DOWN": "reduce ",
  "秒間": "segundos ",
  "味方全体": "todos los aliados ",
  "自身": "el usuario ",
  "(重複なし)":"(No Stackea) ",
  "(重複あり)": "(Stackea) ",
  "奥義ゲージ":"Barra de Arts ",
  "超奥義":"Super Arts ",
  "真奥義":"True Arts ",
  "奥義": "Arts ",
  "スキル":"Skill ",
  "ブレイク":"BREAK ",
  "光属性":"Elemeto Luz ",
  "火属性":"Elemeto Fuego ",
  "水属性":"Elemeto Agua ",
  "樹属性":"Elemeto Tierra ",
  "闇属性":"Elemeto Oscuridad ",
  "の": "de ",
  "マギアドライブ":"Magia Drive ",
  "ロード・オブ・フェザー": "Lord of Feathers ",
  "中": "dentro ",
  "ダメージ":"Daño ",
  "クエスト開始時": "Al inicio de la quest ",
  "クエスト":"Quest ",
  "アンリミテッド":"Magia Unlimited ",
  "神装解放":"Divine Liberation ",
  "バレット": "Phantom Bullet",
  "大奥義":"Mega Arts ",
"大スキル":"Mega Skill ",
"カイガン": "Third Eye",
"シンカイガン": "True Third Eye",
};
const SKILL_SECTIONS = {
  super_arts: "SUPER ARTS",
  true_arts: "TRUE ARTS",
  arts: "ARTS",
  skill: "SKILL",
  bullet: "PHANTOM BULLET",
  divine: "DESPERTAR DIVINO",
  grand: "MEGA ARTS",
  special: "MEGA SKILL",
  link: "CROSS ARTS"
};

const NOMBRES_ES = {
  "フェン": "Fen",
  "ロイ": "Roy",
  "ミラ": "Mira",
  // ...
};

function nombreES(nombreJP) {
  return NOMBRES_ES[nombreJP] || null;
}

function translateText(text) {
  let result = text;
  Object.keys(JP_TERMS).forEach(jp => {
    result = result.replaceAll(jp, JP_TERMS[jp]);
  });
  return result;
}

// ===============================
// ESTADO GLOBAL
// ===============================

let units = [];
let currentElement = "all";
let currentRare = "all";
let searchText = "";
let cardFace = 0; // 0=front, 1=skills, 2=passives
let imgIndex = 0;
let currentImages = [];
let suppressFlip = false;
let currentRace = "all";



const loading = document.getElementById("loading");

// ===============================
// FETCH INICIAL
// ===============================

const skeleton = document.getElementById("skeleton-container");


fetch("/api/units")
  .then(res => {
    if (!res.ok) throw new Error("API error " + res.status);
    return res.json();
  })
  .then(data => {
    units = data;

    skeleton.classList.add("hidden");   // 👈 ocultar skeleton
    container.classList.remove("hidden");

    applyFilters();
  })
  .catch(err => {
    console.error("Error cargando unidades:", err);
  });



// ===============================
// FILTROS
// ===============================
function applyFilters() {
  const filtered = units.filter(u => {

    // =====================
    // ELEMENTO
    // =====================
    if (currentElement !== "all" && u.elemento !== Number(currentElement)) {
      return false;
    }

    // =====================
    // RAREZA
    // =====================
    if (currentRare !== "all" && u.rareza !== Number(currentRare)) {
      return false;
    }

    // =====================
    // RAZA (JP → ES)
    // =====================

if (currentRace !== "all" && u.raza !== Number(currentRace)) {
  return false;
}


    // =====================
    // BÚSQUEDA
    // =====================
    if (searchText) {
      const jp = (u.nombre_jp || "").toLowerCase();
      const es = (nombreES(u.nombre_jp) || "").toLowerCase();
      if (!jp.includes(searchText) && !es.includes(searchText)) {
        return false;
      }
    }

    return true;
  });

  renderUnits(filtered);
}


// ===============================
// RENDER
// ===============================

function renderUnits(list) {
  container.innerHTML = "";

  list.forEach(unit => {
    const card = document.createElement("div");
    card.className = "card";

    const color = ELEMENT_COLORS[unit.elemento] || "#2c3e50";
    card.style.borderColor = color;
    card.style.boxShadow = `0 0 12px ${color}`;

    const imgSrc = unit.imagen_local || unit.imagen_externa;

    card.innerHTML = `
      <img src="${imgSrc}" alt="${unit.nombre_jp}" width="60" height="60">
      <div class="name">${unit.nombre_jp}</div>
    `;


    card.addEventListener("click", () => {
  openUnitCard(unit.id);
});

    container.appendChild(card);
  });
}

// ===============================
// FICHA INDIVIDUAL (BASEBALL CARD)
// ===============================

function openUnitCard(unitId) {
  fetch(`/api/unit/${unitId}`)
    .then(res => res.json())
    .then(data => {
      renderBaseballCard(data);
    })
    .catch(err => console.error("Error cargando ficha:", err));
}

function renderBaseballCard(data) {
  const modal = document.getElementById("unit-modal");
  const front = document.getElementById("card-front");
  const back  = document.getElementById("card-back");
  const card = document.getElementById("unit-card");
  const cardInner = card.querySelector(".card-inner");

  imgIndex = 0;
  currentImages = data.imagenes_grandes || [data.imagen_grande];

front.innerHTML = `
  <div class="front-image">
    <img id="stand-img" src="${currentImages[0]}" alt="${data.nombre}">
    ${currentImages.length > 1 ? `
      <button class="img-nav left" id="img-prev">◀</button>
      <button class="img-nav right" id="img-next">▶</button>
    ` : ""}
  </div>

  <div class="front-info">

    <!-- NOMBRE -->
    <h2 class="unit-name">${data.nombre}</h2>

    <!-- META -->
    <div class="unit-meta">
      <span class="badge rating">${data.rating}</span>
      <span class="badge rol">${t(ROLES_ES, data.rol)}</span>
      <span class="badge rareza">${t(RAREZA_ES,data.rareza)}</span>
    </div>

    <!-- STATS -->
    <div class="stats">
      <div class="stat hp">
        <span class="label">HP</span>
        <span class="value">${data.stats.lvmax.hp}</span>
      </div>
      <div class="stat atk">
        <span class="label">ATK</span>
        <span class="value">${data.stats.lvmax.atk}</span>
      </div>
      <div class="stat def">
        <span class="label">DEF</span>
        <span class="value">${data.stats.lvmax.def}</span>
      </div>
    </div>

    <!-- INFO SECUNDARIA -->
    <div class="unit-tags">
      <span>${data.elemento}</span>
      <span>${t(ELEMENT_ES, data.elemento)}</span>
      <span>${t(RAZAS_ES, data.raza)}</span>
    </div>

    <!-- EQUIPOS -->
    <div class="equipos">
      <h4>Equipos</h4>

      <div class="equipos-row">
        <strong>Inicial</strong>
        ${data.equipos.inicial.map(e =>
  `<span class="slot ${getSlotClass(e.tipo)}">${e.tipo}★${e.estrellas}</span>`
).join("")}

      </div>

      <div class="equipos-row">
        <strong>Máximo</strong>
        ${data.equipos.maximo.map(e =>
  `<span class="slot ${getSlotClass(e.tipo)}">${e.tipo}★${e.estrellas}</span>`
).join("")}

      </div>
    </div>

  </div>
`;

if (currentImages.length > 1) {
  const img = document.getElementById("stand-img");

 document.getElementById("img-prev").addEventListener("pointerdown", (e) => {
  suppressFlip = true;
  e.stopPropagation();
});

document.getElementById("img-prev").addEventListener("click", (e) => {
  imgIndex = (imgIndex - 1 + currentImages.length) % currentImages.length;
  img.src = currentImages[imgIndex];
});

document.getElementById("img-next").addEventListener("pointerdown", (e) => {
  suppressFlip = true;
  e.stopPropagation();
});

document.getElementById("img-next").addEventListener("click", (e) => {
  imgIndex = (imgIndex + 1) % currentImages.length;
  img.src = currentImages[imgIndex];
});

}
function renderAllSkills(skills) {
  const grupos = agruparSkills(skills);
  let html = "";

  for (const sistema in SKILL_SECTIONS) {
    if (!grupos[sistema]) continue;

    html += `
      <div class="skill-group ${sistema}">
        <h3 class="skill-title ${sistema}">
          ${SKILL_SECTIONS[sistema]}
        </h3>
    `;

    grupos[sistema].forEach(skill => {
      html += `
        <div class="skill-item">
          <strong>${skill.raw_title}</strong>
          <p>${translateText(skill.descripcion)}</p>
        </div>
      `;
    });

    html += `</div>`;
  }

  return html;
}


function agruparSkills(skills) {
  const grupos = {};
  for (const s of skills) {
    if (!grupos[s.sistema]) grupos[s.sistema] = [];
    grupos[s.sistema].push(s);
  }
  return grupos;
}


  back.innerHTML = `
    <h3>Skills</h3>
    ${data.skills.map(s => `
      <p><strong>${s.raw_title}</strong><br>${s.descripcion}</p>
    `).join("")}

    <h3>Passivas</h3>
    ${data.passivas.map(p => `
      <p><strong>${p.nombre}</strong><br>${p.descripcion}</p>
    `).join("")}
  `;

  modal.classList.remove("hidden");
  card.classList.remove("flipped");
// botón cerrar
const closeBtn = document.getElementById("close-modal");
closeBtn.onclick = (e) => {
  e.stopPropagation();
  modal.classList.add("hidden");
  cardFace = 0;
  card.classList.remove("flipped");
};



// evitar que el click en la card cierre el modal
cardInner.addEventListener("pointerup", (e) => {
  if (suppressFlip) {
    suppressFlip = false; // reset inmediato
    return;
  }

  if (e.target.closest(".close-btn")) return;

  e.stopPropagation();

  cardFace = (cardFace + 1) % 3;
  card.classList.toggle("flipped", cardFace !== 0);

  if (cardFace === 1) {
    back.innerHTML = `
      <div class="skills-view">
        ${renderAllSkills(data.skills)}
      </div>
    `;
  } else if (cardFace === 2) {
    back.innerHTML = `
      <div class="passives-view">
        ${renderPassivas(data.passivas)}
      </div>
    `;
  }
});



function getSlotClass(tipo) {
  if (tipo.includes("物")) return "atk";     // 物攻
  if (tipo.includes("魔")) return "mag";     // 魔攻
  if (tipo.includes("防")) return "def";     // 防御
  if (tipo.includes("援")) return "sup";     // 援護
  if (tipo.includes("回")) return "heal";    // 回復
  return "";
}

}
function renderSkills(skills) {
  const groups = {};

  skills.forEach(s => {
    if (!groups[s.sistema]) groups[s.sistema] = [];
    groups[s.sistema].push(s);
  });

  const ORDER = ["super_arts", "true_arts", "arts", "skill", "other"];
  const TITLES = {
    super_arts: "SUPER ARTS",
    true_arts: "TRUE ARTS",
    arts: "ARTS",
    skill: "SKILL",
    other: "OTHER"
  };

  return ORDER.filter(type => groups[type]).map(type => `
    <div class="skill-group ${type}">
      <h3>${TITLES[type]}</h3>
      ${groups[type].map(s => `
        <div class="skill-item">
          <strong>${s.raw_title}</strong>
          <p>${translateText(s.descripcion)}</p>
        </div>
      `).join("")}
    </div>
  `).join("");
}


function renderPassivas(passivas) {
  if (!passivas || passivas.length === 0) {
    return `<p class="empty">No hay pasivas registradas.</p>`;
  }

  return `
    <div class="passives-view">
      ${passivas.map(p => `
        <div class="passive-item">
          <strong>${p.nombre}</strong>
          <p>${translateText(p.descripcion)}</p>
        </div>
      `).join("")}
    </div>
  `;
}




// ===============================
// EVENTOS
// ===============================

// Elementos
document.querySelectorAll("[data-element]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentElement = btn.dataset.element;
    setActive("[data-element]", currentElement);
    applyFilters();
  });
});

// Rareza
document.querySelectorAll("[data-rare]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentRare = btn.dataset.rare;
    setActive("[data-rare]", currentRare);
    applyFilters();
  });
});
document.querySelectorAll("[data-race]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentRace = btn.dataset.race === "all"
      ? "all"
      : Number(btn.dataset.race);

    setActive("[data-race]", btn.dataset.race);
    applyFilters();
  });
});



// Buscador
const normalize = s => (s || "").toLowerCase();

document.getElementById("search").addEventListener("input", e => {
  searchText = normalize(e.target.value);
  applyFilters();
});
document.getElementById("toggle-filters").onclick = () => {
  document.getElementById("filters").classList.toggle("hidden");
};

// ===============================
// UX UTILITIES
// ===============================

function setActive(selector, value) {
  document.querySelectorAll(selector).forEach(btn => {
    btn.classList.remove("active");
    for (const key in btn.dataset) {
      if (btn.dataset[key] === value) btn.classList.add("active");
    }
  });
}

