const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwzcrnIXMmX0Z_zBS6Mxp7nguJGP9wbfo1Qe-WiodRndtN8dB102ieHpiDXosLW4rA/exec";

let html5QrCode = null;
let scanning = false;

const hasil = document.getElementById("hasil");
const btnScan = document.getElementById("btnScan");
const btnScanLagi = document.getElementById("btnScanLagi");

//============================
// Tombol Mulai Scan
//============================

btnScan.addEventListener("click", () => {

    btnScan.style.display = "none";
    startScanner();

});

//============================
// Tombol Scan Lagi
//============================

btnScanLagi.addEventListener("click", () => {

    btnScanLagi.style.display = "none";
    hasil.innerHTML = "<h2 class='info'>Arahkan QR ke kamera...</h2>";

    startScanner();

});

//============================
// Mulai Kamera
//============================

function startScanner(){

    html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then(cameras=>{

        if(cameras.length==0){

            hasil.innerHTML="<h2 class='error'>Kamera tidak ditemukan.</h2>";
            btnScan.style.display="block";
            return;

        }

        scanning=true;

        html5QrCode.start(

            { facingMode:"environment" },

            {
                fps:10,
                qrbox:250
            },

            onScanSuccess

        );

    });

}

//============================
// Stop Kamera
//============================

function stopScanner(){

    if(!html5QrCode) return Promise.resolve();

    return html5QrCode.stop().then(()=>{

        html5QrCode.clear();
        scanning=false;

    });

}

//============================
// QR Berhasil Dibaca
//============================

function onScanSuccess(decodedText){

    stopScanner().then(()=>{

        hasil.innerHTML="<h2 class='info'>Memproses...</h2>";

        fetch(
            WEB_APP_URL +
            "?action=scan&id=" +
            encodeURIComponent(decodedText)
        )

        .then(res=>res.json())

        .then(data=>{

            if(data.success){

                hasil.innerHTML=`
                    <h2 class="success">✅ ${data.message}</h2>
                    <p><b>${data.nama}</b></p>
                    <p>Kelas : ${data.kelas}</p>
                    <p>Jam : ${data.waktu}</p>
                `;

            }else{

                hasil.innerHTML=`
                    <h2 class="error">${data.message}</h2>
                    <p>${data.nama || ""}</p>
                `;

            }

            btnScanLagi.style.display="block";

        })

        .catch(()=>{

            hasil.innerHTML="<h2 class='error'>Server tidak dapat dihubungi.</h2>";

            btnScanLagi.style.display="block";

        });

    });

}
