# scrape_equip_list.py
# ===============================
# Grand Summoners (Altema) — Equip List Scraper
# URL: https://altema.jp/grandsummoners/sobi_list
#
# Salida:
# - data/equips.json                      (lista cacheada)
# - static/images/equips/icons/<id>.jpg   (iconos cacheados)
#
# Uso:
#   python scrape_equip_list.py
#
# En Flask, expón:
#   /api/equips  -> jsonify(get_equip_list())
# ===============================

import os
import re
import json
import html
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

BASE_URL = "https://altema.jp/grandsummoners/sobi_list"
BASE_HOST = "https://altema.jp"
DETAIL_PATH = "/grandsummoners/sobi/{}"
ICON_REMOTE = "https://img.altema.jp/grandsummoners/sobi/icon/{}.jpg"


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

# Opcional: mapa de type_id (data-obj["type"]) a nombre “amigable”
# OJO: este ID puede variar; por eso también guardamos type_label del HTML ("援護", etc.).
TYPE_ID_HINT = {
    1: "arma",
    2: "armadura",
    3: "accesorio",
    4: "magia",
    5: "soporte",  # ejemplo: "援護" suele caer aquí
}

def _download_icon_once(equip_id: int, remote_url: str, local_path: str) -> None:
    if os.path.exists(local_path):
        return
    try:
        r = requests.get(remote_url, headers=HEADERS, timeout=25)
        if r.status_code == 200 and r.content:
            with open(local_path, "wb") as f:
                f.write(r.content)
    except Exception:
        # Silencioso: el frontend usará fallback remoto
        pass

def get_equip_list(force_refresh: bool = False):
    """
    Devuelve lista de equips (JSON) con:
      id, nombre_jp, rareza_num, rareza_text (si aparece), type_id, type_hint, type_label,
      imagen_local, imagen (remota), url
    """

    res = requests.get(BASE_URL, headers=HEADERS, timeout=30)
    res.raise_for_status()

    soup = BeautifulSoup(res.text, "html.parser")

    equips = []
    seen_ids = set()

    # Cada objeto viene en <tbody data-obj="...">
    tbodys = soup.select("tbody[data-obj]")
    for tb in tbodys:
        raw_obj = tb.get("data-obj")
        if not raw_obj:
            continue

        # data-obj viene con &quot; etc.
        try:
            obj = json.loads(html.unescape(raw_obj))
        except Exception:
            continue

        equip_id = obj.get("id")
        name = obj.get("name") or None
        rare_num = obj.get("rea")
        type_id = obj.get("type")
        if not isinstance(equip_id, int):
            continue

        if equip_id in seen_ids:
            continue
        seen_ids.add(equip_id)

        # Label visible del tipo (ej. <span class="sobi-type-frame">援護</span>)
        type_label = None
        type_span = tb.select_one(".sobi-type-frame")
        if type_span:
            type_label = type_span.get_text(strip=True) or None

        # Icono: preferimos la URL “oficial” por ID, pero si el HTML trae otra, la usamos como respaldo
        # (en tu ejemplo: https://img.altema.jp/grandsummoners/sobi/icon/14105.jpg)
        icon_url = ICON_REMOTE.format(equip_id)
        img_tag = tb.select_one("img")
        if img_tag:
            src = img_tag.get("data-lazy-src") or img_tag.get("src")
            if src and "altema.jp" in src:
                icon_url = src

        # URL detalle (si no existe en html, la construimos)
        detail_url = urljoin(BASE_HOST, DETAIL_PATH.format(equip_id))

        # Si viene link en algún <a href="/grandsummoners/sobi/14105"> lo preferimos
        a = tb.select_one("a[href^='/grandsummoners/sobi/']")
        if a and a.get("href"):
            detail_url = urljoin(BASE_HOST, a["href"])

        equips.append({
            "id": equip_id,
            "nombre_jp": name,
            "rareza": rare_num,                # num (del data-obj)
            "type_id": type_id,                # num (del data-obj)
            "type_hint": TYPE_ID_HINT.get(type_id),
            "type_label": type_label,          # texto del HTML (援護, etc.)
            "imagen": icon_url,                # fallback remoto
        })

    # Opcional: ordenar por rareza desc, luego nombre
    def _sort_key(x):
        r = x.get("rareza") or 0
        n = x.get("nombre_jp") or ""
        return (-int(r), n)
    equips.sort(key=_sort_key)

    return equips


if __name__ == "__main__":
    data = get_equip_list(force_refresh=True)
    print("Total equips:", len(data))
    print(json.dumps(data[:5], ensure_ascii=False, indent=2))
