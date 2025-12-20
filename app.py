from flask import Flask, jsonify, render_template
from get_unit_list import get_unit_list
from scrape_unit_detail import scrape_unit_detail

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/units")
def units():
    return jsonify(get_unit_list())

@app.route("/api/unit/<int:unit_id>")
def unit_detail(unit_id):
    try:
        data = scrape_unit_detail(unit_id)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
