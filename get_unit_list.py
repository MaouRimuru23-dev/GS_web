import requests
from bs4 import BeautifulSoup
import json
import re
from urllib.parse import urljoin
import os

BASE_URL = "https://altema.jp/grandsummoners/unitlist"
BASE_HOST = "https://altema.jp"
ICON_BASE = "https://img.altema.jp/grandsummoners/unit/icon/{}.jpg"
CACHE_FILE = "data/units.json"
ICON_LOCAL_DIR = os.path.join("static", "images", "units", "icons")
os.makedirs(ICON_LOCAL_DIR, exist_ok=True)

os.makedirs("data", exist_ok=True)



HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

def get_unit_list():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    res = requests.get(BASE_URL, headers=HEADERS, timeout=30)
    res.raise_for_status()

    soup = BeautifulSoup(res.text, "html.parser")

    units = {}

    rows = soup.select("tr[data-obj]")

    for row in rows:
        data_obj = row.get("data-obj")
        if not data_obj:
            continue

        # unit_id real (icono)
        m = re.search(r'"unit_id":(\d+)', data_obj)
        if not m:
            continue

        unit_id = int(m.group(1))
        icon_url = ICON_BASE.format(unit_id)
        local_icon_path = os.path.join(ICON_LOCAL_DIR, f"{unit_id}.jpg")
        local_icon_web = f"/static/images/units/icons/{unit_id}.jpg"

        if not os.path.exists(local_icon_path):
            try:
                r = requests.get(icon_url, headers=HEADERS, timeout=20)
                if r.status_code == 200:
                    with open(local_icon_path, "wb") as f:
                        f.write(r.content)
            except Exception:
                pass
            

        a = row.select_one("td a[href^='/grandsummoners/unit/']")
        if not a:
            continue

        href = a.get("href")
        page_id_match = re.search(r"/unit/(\d+)", href)
        if not page_id_match:
            continue

        unit_page_id = int(page_id_match.group(1))

        name = a.get_text(strip=True)

        # extraer datos del data-obj
        zokusei = None
        rea = None
        syuzoku = None

        z = re.search(r'"zokusei":(\d+)', data_obj)
        r = re.search(r'"rea":(\d+)', data_obj)
        s = re.search(r'"syuzoku":(\d+)', data_obj)

        if z:
            zokusei = int(z.group(1))
        if r:
            rea = int(r.group(1))
        if s:
            syuzoku = int(s.group(1))


        units[unit_page_id] = {
    "id": unit_page_id,
    "unit_id": unit_id,
    "nombre_jp": name,
    "elemento": zokusei,
    "rareza": rea,
    "raza": syuzoku,

    "imagen_local": local_icon_web,   # ✅ LOCAL
    "imagen": icon_url,               # fallback remoto

    "url": urljoin(BASE_HOST, href)
}

    

    data = list(units.values())

    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return data



if __name__ == "__main__":
    data = get_unit_list()
    print("Total unidades:", len(data))
    print(json.dumps(data[:5], ensure_ascii=False, indent=2))

    with open("units.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

