const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwS3Z8iNtYhVxvDg4NfGJ7vQh68KpClPtCEa31YwBUr4E99D1Prkk8VbVkNDbJ5yHNW/exec";

let html5QrCode = null;

const hasil = document.getElementById("hasil");
const btnScan = document.getElementById("btnScan");
const btnScanLagi = document.getElementById("btnScanLagi");

//========================================
// Tombol Mulai Scan
//========================================

btnScan.onclick = function () {

    btnScan.style.display = "none";
    btnScanLagi.style.display = "none";

    hasil.innerHTML = "<h2 class='info'>Arahkan QR ke kamera...</h2>";

    mulaiScan();

};

//========================================
// Tombol Scan Lagi
//========================================

btnScanLagi.onclick = function () {

    btnScanLagi.style.display = "none";

    hasil.innerHTML = "<h2 class='info'>Arahkan QR ke kamera...</h2>";

    mulaiScan();

};

//========================================

function mulaiScan() {

    html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then(function () {

        html5QrCode.start(

            { facingMode: "environment" },

            {
                fps: 10,
                qrbox: 250
            },

            qrBerhasil

        );

    });

}

//========================================

function qrBerhasil(idSiswa) {

    html5QrCode.stop().then(function () {

        fetch(
            WEB_APP_URL +
            "?action=scan&id=" +
            encodeURIComponent(idSiswa)
        )

        .then(function (res) {

            return res.json();

        })

        .then(function (data) {

            if (data.success) {

                hasil.innerHTML = `
                    <h2 class="success">✅ ${data.message}</h2>
                    <h3>${data.nama}</h3>
                    <p>Kelas ${data.kelas}</p>
                    <p>Jam : ${data.waktu}</p>
                `;

            } else {

                hasil.innerHTML = `
                    <h2 class="error">${data.message}</h2>
                    <h3>${data.nama || ""}</h3>
                `;

            }

            btnScanLagi.style.display = "block";

        })

        .catch(function (err) {

            console.error(err);

            hasil.innerHTML = `
                <h2 class="error">Server tidak dapat dihubungi</h2>
                <p>${err}</p>
            `;

            btnScanLagi.style.display = "block";

        });

    });

}
