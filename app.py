from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("home.html")


@app.route("/risk")
def risk():

    lat = float(request.args.get("lat", 0))
    lng = float(request.args.get("lng", 0))
    speed = float(request.args.get("speed", 0))
    direction = int(request.args.get("dir", 0))

    score = 20

    reasons = []

    # TIME BASED
    from datetime import datetime
    hour = datetime.now().hour

    if hour >= 22 or hour <= 5:
        score += 40
        reasons.append("Night time risk")

    # LOCATION SIMULATION
    if lat == 0 and lng == 0:
        score += 30
        reasons.append("Unknown location")

    # MOVEMENT
    if speed < 0.3:
        score += 20
        reasons.append("Low movement detected")

    if direction > 3:
        score += 20
        reasons.append("Abnormal direction changes")

    if score < 40:
        status = "SAFE"
    elif score < 70:
        status = "CAUTION"
    else:
        status = "DANGER"

    return jsonify({
        "score": score,
        "status": status,
        "reasons": reasons,
        "sms_alert": score > 70
    })


@app.route("/sos")
def sos():
    return jsonify({"message": "SOS sent to emergency contacts (demo)"})


if __name__ == "__main__":
    app.run(debug=True)