from flask import Flask, jsonify, render_template
import os

from get_unit_list import get_unit_list
from scrape_unit_detail import scrape_unit_detail
from trasnlate_unit import translate_unit
from scrape_equip_list import get_equip_list
from scrape_equip_detail import scrape_equip_detail




BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    static_folder=os.path.join(BASE_DIR, "static"),
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_url_path="/static"
)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/units")
def units_page():
    return render_template("units.html")

@app.route("/equips")
def equips_page():
    return render_template("equips.html")


@app.route("/api/units")
def units():
    return jsonify(get_unit_list())

@app.route("/api/unit/<int:unit_id>")
def unit_detail(unit_id):
    try:
        data = scrape_unit_detail(unit_id)
        data = translate_unit(data)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/equips")
def equips():
    return jsonify(get_equip_list())

@app.route("/api/equip/<int:equip_id>")
def equip_detail(equip_id):
    try:
        return jsonify(scrape_equip_detail(equip_id))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
