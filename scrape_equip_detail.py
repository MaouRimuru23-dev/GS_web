# scrape_equip_detail.py
# ===============================
# Grand Summoners (Altema) — Equip Detail Scraper
# Fuente: https://altema.jp/grandsummoners/sobi_list  (mismo HTML con tabs)
#
# Salida:
# - data/equip_details/<equip_id>.json
#
# Devuelve:
# {
#   id, nombre, type_label, rareza_text, stats{hp,atk,def}, obtencion,
#   skill{descripcion, ct}, passivas[], imagen_local, imagen, url
# }
# ===============================

import os
import re
import json
import html
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://altema.jp/grandsummoners/sobi_list"
BASE_HOST = "https://altema.jp"
DETAIL_URL_FMT = "https://altema.jp/grandsummoners/sobi/{}"
ICON_REMOTE_FMT = "https://img.altema.jp/grandsummoners/sobi/icon/{}.jpg"


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}


def _parse_stats(text: str) -> dict:
    """
    Ej: 'HP+250、攻撃+125、防御+125'
    """
    stats = {"hp": 0, "atk": 0, "def": 0}
    if not text:
        return stats

    m = re.search(r"HP\+(\d+)", text)
    if m:
        stats["hp"] = int(m.group(1))

    m = re.search(r"攻撃\+(\d+)", text)
    if m:
        stats["atk"] = int(m.group(1))

    m = re.search(r"防御\+(\d+)", text)
    if m:
        stats["def"] = int(m.group(1))

    return stats

def _parse_ct_seconds(text: str):
    """
    Ej: '40秒' -> 40
    """
    if not text:
        return None
    m = re.search(r"(\d+)\s*秒", text)
    return int(m.group(1)) if m else None

def scrape_equip_detail(equip_id: int, force_refresh: bool = False):
    res = requests.get(BASE_URL, headers=HEADERS, timeout=30)
    res.raise_for_status()
    soup = BeautifulSoup(res.text, "html.parser")

    # localizar el tbody del equip
    target = None
    for tb in soup.select("tbody[data-obj]"):
        raw = tb.get("data-obj")
        if not raw:
            continue
        try:
            obj = json.loads(html.unescape(raw))
        except Exception:
            continue
        if obj.get("id") == equip_id:
            target = tb
            data_obj = obj
            break

    if not target:
        raise ValueError(f"No se encontró el equip id={equip_id} en sobi_list")

    nombre = data_obj.get("name") or None

    # tipo visible (援護, etc.)
    type_label = None
    type_span = target.select_one(".sobi-type-frame")
    if type_span:
        type_label = type_span.get_text(strip=True) or None

    # icono remoto (del HTML o fallback por ID)
    icon_url = ICON_REMOTE_FMT.format(equip_id)
    img_tag = target.select_one("img")
    if img_tag:
        src = img_tag.get("data-lazy-src") or img_tag.get("src")
        if src and "altema.jp" in src:
            icon_url = src

    # Resultado base
    data = {
        "id": equip_id,
        "nombre": nombre,
        "type_label": type_label,
        "rareza_text": None,
        "stats": {"hp": 0, "atk": 0, "def": 0},
        "obtencion": None,
        "skill": {
            "descripcion": None,
            "ct": None
        },
        "passivas": [],
        "imagen": icon_url,
        "url": DETAIL_URL_FMT.format(equip_id)
    }

    # Leer filas por tabs
    for tr in target.select("tr"):
        classes = tr.get("class", [])
        th = tr.find("th")
        td = tr.find("td")

        if not th or not td:
            continue

        key = th.get_text(strip=True)
        val = td.get_text(" ", strip=True)  # junta líneas en espacios

        # TAB KIHON
        if "tab_kihon" in classes:
            if key == "レア度":
                data["rareza_text"] = val  # '★5'
            elif key == "ステータス":
                data["stats"] = _parse_stats(val)
            elif key == "入手方法":
                data["obtencion"] = val

        # TAB SKILL
        elif "tab_skill" in classes:
            if key == "スキル":
                data["skill"]["descripcion"] = val
            elif key == "CT":
                data["skill"]["ct"] = _parse_ct_seconds(val)

        # TAB ABILITY
        elif "tab_ability" in classes:
            if key == "アビリティ":
                # '-' -> vacío; si hay texto, lo dejamos como lista
                if val and val != "-":
                    # a veces vienen varias en una sola celda separadas por saltos o '／'
                    parts = re.split(r"\s*／\s*|\s*\n\s*", val)
                    parts = [p.strip() for p in parts if p.strip() and p.strip() != "-"]
                    data["passivas"] = parts
    return data


if __name__ == "__main__":
    # Prueba rápida
    test_id = 14105
    d = scrape_equip_detail(test_id, force_refresh=True)
    print(json.dumps(d, ensure_ascii=False, indent=2))
