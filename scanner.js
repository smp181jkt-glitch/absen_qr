//========================================
// SCANNER QR
//========================================

// GANTI DENGAN URL WEB APP ANDA
const WEB_APP = "https://script.google.com/macros/s/AKfycbzj_N0hygDN6BuNIooCQvD-s8tjWEoRvT3d3t0rzOirXONDVypso65y_eP42J5Tr1cf/exec";

let html5QrCode = null;
let scanning = false;

const btnMulai = document.getElementById("btnMulai");
const btnLanjut = document.getElementById("btnLanjut");
const hasil = document.getElementById("hasil");

btnMulai.onclick = mulaiScan;
btnLanjut.onclick = mulaiScan;

async function mulaiScan() {

    if (scanning) return;

    hasil.innerHTML = "Membuka kamera...";

    btnMulai.style.display = "none";
    btnLanjut.style.display = "none";

    html5QrCode = new Html5Qrcode("reader");

    try {

        scanning = true;

        await html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: 250
            },
            scanBerhasil
        );

    } catch (e) {

        hasil.innerHTML = "❌ Kamera tidak dapat dibuka";
        btnMulai.style.display = "inline-block";
        scanning = false;

    }

}

async function scanBerhasil(decodedText) {

    if (!scanning) return;

    scanning = false;

    try {
        await html5QrCode.stop();
        await html5QrCode.clear();
    } catch (e) {}

    document.getElementById("reader").innerHTML = "";

    hasil.innerHTML = "Memproses absensi...";

    fetch(WEB_APP + "?action=scan&id=" + encodeURIComponent(decodedText))
        .then(r => r.json())
        .then(data => {

            if (data.success) {

                hasil.innerHTML =
                    "✅ <br><br>" +
                    "<b>" + data.nama + "</b><br>" +
                    data.kelas + "<br><br>" +
                    data.message;

            } else {

                hasil.innerHTML =
                    "❌ <br><br>" +
                    data.message;

            }

            btnLanjut.style.display = "inline-block";

        })
        .catch(err => {

            hasil.innerHTML =
                "❌ Server tidak dapat dihubungi";

            btnLanjut.style.display = "inline-block";

        });

}
