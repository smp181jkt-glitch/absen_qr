//====================================
// DASHBOARD GURU VERSI 2
//====================================

const WEB_APP = "https://script.google.com/macros/s/AKfycbxohdVdv5pcQsqU0pEIusy7eLqrnuNOhLZdJCymWKc02i4Ta8vTt9iARpsJ-kCaJnuf/exec";


const tbody = document.getElementById("tbody");
const cari = document.getElementById("cari");
const tanggal = document.getElementById("tanggal");

let dataSiswa = [];


// LOAD AWAL

loadData();


// REFRESH OTOMATIS 10 DETIK

setInterval(function(){

    loadData();

},10000);


// PENCARIAN

cari.addEventListener("keyup",function(){

    tampilkan();

});


// FILTER TANGGAL

tanggal.addEventListener("change",function(){

    loadData();

});



//====================================
// AMBIL DATA DASHBOARD
//====================================

function loadData(){

fetch(WEB_APP+"?action=dashboard")

.then(response=>response.json())

.then(data=>{

    dataSiswa=data;

    tampilkan();

})

.catch(error=>{

console.log(error);

});

}



//====================================
// TAMPILKAN DATA
//====================================

function tampilkan(){

tbody.innerHTML="";


let hadir=0;
let sakit=0;
let izin=0;
let belum=0;


let keyword=cari.value.toLowerCase();



dataSiswa.forEach(function(s){


if(keyword!=""){

if(!s.nama.toLowerCase().includes(keyword)){

return;

}

}



if(s.status=="HADIR")
hadir++;

else if(s.status=="SAKIT")
sakit++;

else if(s.status=="IZIN")
izin++;

else
belum++;




let warna="status-belum";


if(s.status=="HADIR")
warna="status-hadir";


if(s.status=="SAKIT")
warna="status-sakit";


if(s.status=="IZIN")
warna="status-izin";



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
SAKIT
</button>


<button 
class="btn-primary"
onclick="ubahStatus('${s.id}','IZIN')">
IZIN
</button>
`

:

"-"

}


</td>


</tr>

`;

});



document.getElementById("totalSiswa").innerHTML=dataSiswa.length;

document.getElementById("hadir").innerHTML=hadir;

document.getElementById("sakit").innerHTML=sakit;

document.getElementById("izin").innerHTML=izin;

document.getElementById("belum").innerHTML=belum;


}



//====================================
// UBAH STATUS
//====================================

function ubahStatus(id,status){


if(!confirm(
"Ubah status menjadi "+status+"?"
))
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



//====================================
// EXPORT CSV
//====================================

function exportCSV(){


let csv="ID,NAMA,KELAS,STATUS\n";


dataSiswa.forEach(function(s){


csv+=

s.id+","+
s.nama+","+
s.kelas+","+
s.status+
"\n";


});



let blob=new Blob(
[csv],
{
type:"text/csv"
}
);



let url=URL.createObjectURL(blob);


let a=document.createElement("a");


a.href=url;


a.download="rekap_absensi.csv";


a.click();


}
