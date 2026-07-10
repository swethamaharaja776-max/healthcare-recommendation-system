let chart;


window.onload=function(){


let ctx=document
.getElementById("probabilityChart")
.getContext("2d");


chart=new Chart(ctx,{

type:"bar",

data:{

labels:["Disease Probability"],

datasets:[{

label:"Confidence %",

data:[0]

}]

},

options:{

scales:{

y:{
beginAtZero:true,
max:100
}

}

}

});


}





async function analyzeHealth(){


let symptom=document
.getElementById("symptom")
.value;



if(symptom==""){
alert("Enter symptoms");
return;
}



try{


let response=await fetch(
"http://localhost:8080/api/analyze",
{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

symptom:symptom

})


});



let data=await response.json();



document.getElementById("disease")
.innerHTML=data.disease;


document.getElementById("confidence")
.innerHTML=data.confidence+"%";


document.getElementById("risk")
.innerHTML=data.risk;



document.getElementById("recommend")
.innerHTML=data.recommendation;



chart.data.datasets[0].data=[
Number(data.confidence)
];


chart.update();



}

catch(error){

console.log(error);

alert(
"Spring Boot server not running"
);

}


}
