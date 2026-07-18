//====================================
// DASHBOARD GURU
//====================================

const WEB_APP = "https://script.google.com/macros/s/AKfycbxohdVdv5pcQsqU0pEIusy7eLqrnuNOhLZdJCymWKc02i4Ta8vTt9iARpsJ-kCaJnuf/exec";

const tbody = document.getElementById("tbody");
const cari = document.getElementById("cari");

loadData();

setInterval(loadData,10000);

cari.addEventListener("keyup",function(){

    loadData(cari.value);

});

function loadData(keyword=""){

    fetch(WEB_APP+"?action=dashboard")

    .then(r=>r.json())

    .then(data=>{

        tampilkan(data,keyword);

    });

}

function tampilkan(data,keyword){

    tbody.innerHTML="";

    let hadir=0;
    let sakit=0;
    let izin=0;
    let belum=0;

    let total=data.length;

    data.forEach(function(s){

        if(keyword!=""){

            if(
                !s.nama.toLowerCase()
                .includes(keyword.toLowerCase())
            ){

                return;

            }

        }

        switch(s.status){

            case "HADIR":
                hadir++;
                break;

            case "SAKIT":
                sakit++;
                break;

            case "IZIN":
                izin++;
                break;

            default:
                belum++;

        }

        let warna="status-belum";

        if(s.status=="HADIR") warna="status-hadir";
        if(s.status=="SAKIT") warna="status-sakit";
        if(s.status=="IZIN") warna="status-izin";

        tbody.innerHTML+=`

        <tr>

        <td>${s.id}</td>

        <td>${s.nama}</td>

        <td>${s.kelas}</td>

        <td class="${warna}">
            ${s.status}
        </td>

        <td>

        ${
        s.status=="BELUM ABSEN"

        ?

        `
        <button
        class="btn-warning"
        onclick="ubahStatus('${s.id}','SAKIT')">
        Sakit
        </button>

        <button
        class="btn-primary"
        onclick="ubahStatus('${s.id}','IZIN')">
        Izin
        </button>
        `

        :

        "-"
        }

        </td>

        </tr>

        `;

    });

    document.getElementById("totalSiswa").innerHTML=total;
    document.getElementById("hadir").innerHTML=hadir;
    document.getElementById("sakit").innerHTML=sakit;
    document.getElementById("izin").innerHTML=izin;
    document.getElementById("belum").innerHTML=belum;

}

function ubahStatus(id,status){

    if(!confirm("Yakin memberi status "+status+"?"))
    return;

    fetch(
    WEB_APP+
    "?action=status&id="+
    id+
    "&status="+
    status
    )

    .then(r=>r.json())

    .then(res=>{

        alert(res.message);

        loadData();

    });

}
