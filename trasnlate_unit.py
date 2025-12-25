# translate_unit.py

def translate_unit(unit):
    """
    Recibe el JSON completo de una unidad (JP)
    Devuelve el mismo JSON con campos ES añadidos
    """
    translated = dict(unit)

    # ===== Nombre =====
    translated["name_es"] = unit.get("nombre_jp")

    # ===== Skills =====
    translated["skills_es"] = []
    for s in unit.get("skills", []):
        translated["skills_es"].append({
            "type": s.get("type"),
            "name_jp": s.get("raw_title"),
            "description_jp": s.get("descripcion"),
            # placeholder por ahora
            "description_es": s.get("descripcion")
        })

    # ===== Passives =====
    translated["passives_es"] = []
    for p in unit.get("passives", []):
        translated["passives_es"].append({
            "name_jp": p.get("name"),
            "description_jp": p.get("descripcion"),
            # placeholder por ahora
            "description_es": p.get("descripcion")
        })

    return translated
