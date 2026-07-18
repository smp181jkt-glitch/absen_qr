//====================================
// REKAP BULANAN
//====================================

const WEB_APP = "https://script.google.com/macros/s/AKfycbxohdVdv5pcQsqU0pEIusy7eLqrnuNOhLZdJCymWKc02i4Ta8vTt9iARpsJ-kCaJnuf/exec";


const bulanInput = document.getElementById("bulan");

const tabel = document.getElementById("tabelRekap");


let dataRekap=[];



function loadRekap(){


let bulan = bulanInput.value;


if(bulan==""){

alert("Pilih bulan terlebih dahulu");

return;

}


let pecah = bulan.split("-");


let tahun = pecah[0];

let bln = pecah[1];



fetch(
WEB_APP+
"?action=rekapbulan"+
"&bulan="+bln+
"&tahun="+tahun
)


.then(r=>r.json())


.then(data=>{


olahData(data);


});



}



//====================================
// HITUNG PER SISWA
//====================================


function olahData(data){


let siswa={};



data.forEach(function(d){


let id=d.id;


if(!siswa[id]){


siswa[id]={

id:d.id,

nama:d.nama,

kelas:d.kelas,

hadir:0,

sakit:0,

izin:0

};


}



if(d.status=="HADIR")
siswa[id].hadir++;


if(d.status=="SAKIT")
siswa[id].sakit++;


if(d.status=="IZIN")
siswa[id].izin++;



});



dataRekap=Object.values(siswa);


tampilkan();



}




//====================================
// TAMPILKAN TABEL
//====================================


function tampilkan(){


tabel.innerHTML="";


dataRekap.forEach(function(s){


tabel.innerHTML+=`

<tr>

<td>${s.id}</td>

<td>${s.nama}</td>

<td>${s.kelas}</td>

<td>${s.hadir}</td>

<td>${s.sakit}</td>

<td>${s.izin}</td>


</tr>

`;


});


}



//====================================
// EXPORT CSV
//====================================


function exportRekap(){


let csv=
"ID,NAMA,KELAS,HADIR,SAKIT,IZIN\n";


dataRekap.forEach(function(s){


csv+=

s.id+","+
s.nama+","+
s.kelas+","+
s.hadir+","+
s.sakit+","+
s.izin+
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


a.download="rekap_bulanan.csv";


a.click();



}
