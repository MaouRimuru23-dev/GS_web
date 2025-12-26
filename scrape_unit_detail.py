import requests
from bs4 import BeautifulSoup, NavigableString, Tag
import os
import json


BASE_HOST = "https://altema.jp"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}


def inferir_sistema(title: str) -> str:
    if title.startswith("バレット"):
        return "bullet"
    if title.startswith("神装解放"):
        return "divine"
    if title.startswith("大奥義") or title.startswith("大スキル"):
        return "grand"
    if title.startswith("連携奥義"):
        return "link"
    if title.startswith("特殊スキル"):
        return "special"
    if title.startswith("超奥義"):
        return "super_arts"
    if title.startswith("真奥義"):
        return "true_arts"
    if title.startswith("奥義"):
        return "arts"
    if title.startswith("スキル"):
        return "skill"
    return "other"


def scrape_unit_detail(unit_page_id: int):
    url = f"{BASE_HOST}/grandsummoners/unit/{unit_page_id}"
    res = requests.get(url, headers=HEADERS, timeout=30)
    res.raise_for_status()

    soup = BeautifulSoup(res.text, "html.parser")

    data = {
        "id": unit_page_id,
        "nombre": None,
        "imagen_grande": None,
        "elemento": None,
        "raza": None,
        "stats": {},
        "skills": [],
        "passivas": []
    }

    # ===============================
    # NOMBRE
    # ===============================
    h1 = soup.find("h1")
    if h1:
        data["nombre"] = (
            h1.get_text(strip=True)
            .replace("【グラサマ】", "")
            .split("の")[0]
        )
    # ===============================
    # METADATOS (rating / rol / rareza / CV)
    # ===============================
    data["rating"] = None
    data["rol"] = None
    data["rareza"] = None
    data["cv"] = None

    tables = soup.select("table.all-center")
    if tables:
        meta_table = tables[0]
        rows = meta_table.find_all("tr")

        if len(rows) >= 4:
            # fila 2: rating / rol / rareza
            tds = rows[1].find_all("td")
            if len(tds) >= 3:
                data["rating"] = tds[0].get_text(strip=True)
                data["rol"] = tds[1].get_text(strip=True)
                data["rareza"] = tds[2].get_text(strip=True)

            # fila 4: elemento / raza / CV
            tds = rows[3].find_all("td")
            if len(tds) >= 3:
                data["elemento"] = tds[0].get_text(strip=True)
                data["raza"] = tds[1].get_text(strip=True)
                data["cv"] = tds[2].get_text(strip=True)

    # ===============================
    # IMÁGENES GRANDES (stand)
    # ===============================
    data["imagenes_grandes"] = []

    slider = soup.select_one(".illustSliderWrap")

    if slider:
        for img in slider.select("img"):
            src = img.get("data-lazy-src") or img.get("src")

            data["imagenes_grandes"].append(src)
    


    # ===============================
    # INFO BÁSICA (elemento / raza)
    # ===============================
    hyoka = soup.find("h2", id="hyoka")
    if hyoka:
        table = hyoka.find_next("table")
        if table:
            rows = table.find_all("tr")
            if len(rows) >= 4:
                tds = rows[3].find_all("td")
                if len(tds) >= 2:
                    data["elemento"] = tds[0].get_text(strip=True)
                    data["raza"] = tds[1].get_text(strip=True)

    # ===============================
    # SKILLS — MODELO DEFINITIVO
    # ===============================
    orden = 0

    for h3 in soup.find_all("h3"):
        title = h3.get_text(strip=True)

        sistema = inferir_sistema(title)
        if sistema == "other":
            continue  # ignoramos basura

        desc_parts = []

        for elem in h3.next_elements:
            if isinstance(elem, Tag) and elem.name in ["h3", "h2"]:
                break

            if isinstance(elem, NavigableString):
                text = elem.strip()
                if text:
                    desc_parts.append(text)

        descripcion = "\n".join(desc_parts).strip()
        if not descripcion:
            continue

        orden += 1
        data["skills"].append({
            "raw_title": title,
            "sistema": sistema,
            "descripcion": descripcion,
            "orden": orden
        })


    # ===============================
    # PASSIVAS (ability)
    # ===============================
    ability_anchor = soup.find("h2", id="ability")
    if ability_anchor:
        table = ability_anchor.find_next("table")
        if table:
            rows = table.find_all("tr")[1:]
            for row in rows:
                tds = row.find_all("td")
                if len(tds) == 2:
                    name = tds[0].get_text(strip=True)
                    effect = tds[1].get_text(strip=True)
                    data["passivas"].append({
                        "nombre": name,
                        "descripcion": effect
                    })

    # ===============================
    # STATS COMPLETOS (LVMAX + BONUS)
    # ===============================
    data["stats"] = {
        "lvmax": {},
        "bonus": {}
    }

    status_anchor = soup.find("h2", id="status")
    if status_anchor:
        table = status_anchor.find_next("table")
        if table:
            rows = table.find_all("tr")
            for row in rows:
                th = row.find("th")
                tds = row.find_all("td")
                if not th or len(tds) < 3:
                    continue

                label = th.get_text(strip=True)

                if "LVMAX" in label:
                    data["stats"]["lvmax"] = {
                        "hp": tds[0].get_text(strip=True),
                        "atk": tds[1].get_text(strip=True),
                        "def": tds[2].get_text(strip=True)
                    }

                elif "タス" in label:
                    data["stats"]["bonus"] = {
                        "hp": tds[0].get_text(strip=True),
                        "atk": tds[1].get_text(strip=True),
                        "def": tds[2].get_text(strip=True)
                    }

    # ===============================
    # SLOTS DE EQUIPO (装備枠)
    # ===============================
    data["equipos"] = {
        "inicial": [],
        "maximo": []
    }

    equip_table = None
    for table in soup.select("table.all-center"):
        headers = table.find_all("th")
        if any("装備枠" in th.get_text() for th in headers):
            equip_table = table
            break

    if equip_table:
        rows = equip_table.find_all("tr")

        def parse_slot_text(text):
            if "★" in text:
                tipo, estrellas = text.split("★")
                return {
                    "tipo": tipo.strip(),
                    "estrellas": int(estrellas.strip())
                }
            return None

        for row in rows:
            th = row.find("th")
            if not th:
                continue

            label = th.get_text(strip=True)
            tds = row.find_all("td")

            if "初期" in label:
                for td in tds:
                    slot = parse_slot_text(td.get_text(strip=True))
                    if slot:
                        data["equipos"]["inicial"].append(slot)

            elif "最大" in label:
                for td in tds:
                    for span in td.find_all("span"):
                        slot = parse_slot_text(span.get_text(strip=True))
                        if slot:
                            data["equipos"]["maximo"].append(slot)

        return data


# ===============================
# PRUEBA DIRECTA
# ===============================
if __name__ == "__main__":
    import json
    test_id = 403  # cambia aquí
    result = scrape_unit_detail(test_id)
    print(json.dumps(result, ensure_ascii=False, indent=2))
