
let map;
let marker;
let lat = 0;
let lng = 0;
let gpsMode = false;
let ringtone;

window.onload = function () {

    ringtone = document.getElementById("ringtone");

    map = L.map('map').setView([20, 78], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'OpenStreetMap'
    }).addTo(map);

    map.on('click', function (e) {

        gpsMode = false;

        lat = e.latlng.lat;
        lng = e.latlng.lng;

        document.getElementById("coords").innerText =
            "Selected: " + lat.toFixed(4) + ", " + lng.toFixed(4);

        if (marker) map.removeLayer(marker);

        marker = L.marker([lat, lng]).addTo(map);

        checkRisk();
    });
};


// ---------------- GPS ----------------
function startGPS() {

    gpsMode = true;

    navigator.geolocation.getCurrentPosition(function (pos) {

        lat = pos.coords.latitude;
        lng = pos.coords.longitude;

        document.getElementById("coords").innerText =
            "Live: " + lat.toFixed(4) + ", " + lng.toFixed(4);

        map.setView([lat, lng], 15);

        if (marker) map.removeLayer(marker);

        marker = L.marker([lat, lng]).addTo(map);

        checkRisk();

    }, function (err) {
        alert("Enable location permission");
    });
}


// ---------------- RISK ----------------
function checkRisk() {

    let speed = Math.random();
    let dir = Math.floor(Math.random() * 5);

    fetch(`/risk?lat=${lat}&lng=${lng}&speed=${speed}&dir=${dir}`)
    .then(res => res.json())
    .then(data => {

        document.getElementById("score").innerText = data.score;
        document.getElementById("status").innerText = data.status;

        let statusEl = document.getElementById("status");
        statusEl.className = "";

        if (data.status === "SAFE") statusEl.classList.add("safe");
        else if (data.status === "CAUTION") statusEl.classList.add("caution");
        else statusEl.classList.add("danger", "pulse");

        let list = document.getElementById("reasons");
        list.innerHTML = "";

        data.reasons.forEach(r => {
            let li = document.createElement("li");
            li.innerText = r;
            list.appendChild(li);
        });

        document.getElementById("movement").innerText =
            `Speed: ${speed.toFixed(2)} | Direction changes: ${dir}`;

        if (data.sms_alert) {
            alert("🚨 HIGH RISK ALERT!");
        }
    });
}


// ---------------- SOS ----------------
function sos() {
    fetch("/sos")
    .then(r => r.json())
    .then(d => alert(d.message));
}


// ---------------- FAKE CALL ----------------
function fakeCall() {

    ringtone.currentTime = 0;
    ringtone.play();

    alert("Incoming call...");
}

function endCall() {
    ringtone.pause();
    ringtone.currentTime = 0;
}