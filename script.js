function getRecommendation(){

    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let gender = document.getElementById("gender").value;

    let height = Number(document.getElementById("height").value);
    let weight = Number(document.getElementById("weight").value);

    let bp = document.getElementById("bp").value;
    let sugar = Number(document.getElementById("sugar").value);
    let heart = Number(document.getElementById("heart").value);
    let temp = Number(document.getElementById("temp").value);

    let symptoms =
    document.getElementById("symptoms").value.toLowerCase();



    // Validation

    if(name==="" || age==="" || symptoms===""){
        alert("Please fill Name, Age and Symptoms");
        return;
    }



    // Patient Report

    document.getElementById("rname").innerHTML=name;
    document.getElementById("rage").innerHTML=age;
    document.getElementById("rgender").innerHTML=gender;

    document.getElementById("date").innerHTML =
    new Date().toLocaleString();



    // BMI Calculation

    if(height>0 && weight>0){

        let bmi =
        (weight / ((height/100)*(height/100))).toFixed(2);

        document.getElementById("bmi").innerHTML=bmi;
    }



    // Disease Probability

    let fever=10;
    let cold=10;
    let respiratory=10;

    let disease="Healthy";
    let risk="Low Risk";

    let recommendation =
    "Maintain healthy lifestyle and regular health checkup.";



    // Symptom Analysis


    if(symptoms.includes("fever")){

        disease="Viral Fever";
        fever=85;
        risk="Medium Risk";

        recommendation=
        "Drink plenty of water, take rest and monitor body temperature.";
    }



    if(symptoms.includes("cold")){

        disease="Common Cold";
        cold=80;
        risk="Medium Risk";

        recommendation=
        "Drink warm fluids and get enough rest.";
    }



    if(symptoms.includes("cough")){

        disease="Respiratory Infection";
        respiratory=75;
        risk="Medium Risk";

        recommendation=
        "Avoid cold foods and consult doctor if cough continues.";
    }



    if(symptoms.includes("headache")){

        disease="Headache";
        risk="Low Risk";

        recommendation=
        "Take proper rest and stay hydrated.";
    }



    if(symptoms.includes("stomach pain")){

        disease="Digestive Problem";
        risk="Medium Risk";

        recommendation=
        "Eat light food and drink enough water.";
    }



    if(symptoms.includes("vomiting")){

        disease="Gastric Infection";
        risk="Medium Risk";

        recommendation=
        "Drink ORS and maintain hydration.";
    }



    if(symptoms.includes("diarrhea")){

        disease="Food Infection";
        risk="Medium Risk";

        recommendation=
        "Drink fluids and avoid oily foods.";
    }



    if(symptoms.includes("sore throat")){

        disease="Throat Infection";
        risk="Medium Risk";

        recommendation=
        "Drink warm water and take proper care.";
    }



    if(symptoms.includes("body pain")){

        disease="Body Pain / Fever Related";
        risk="Medium Risk";

        recommendation=
        "Take rest and monitor symptoms.";
    }



    if(symptoms.includes("fatigue")){

        disease="Fatigue";
        risk="Low Risk";

        recommendation=
        "Take adequate sleep and maintain nutrition.";
    }



    // Health Parameter Check


    if(temp>38){

        risk="High Risk";
        fever=90;
    }


    if(sugar>140){

        risk="Medium Risk";
    }


    if(bp.includes("140")){

        risk="High Risk";
    }



    // Display Result


    document.getElementById("risk").innerHTML=risk;

    document.getElementById("disease").innerHTML=disease;

    document.getElementById("recommendation").innerHTML=
    "✔ "+recommendation;



    // Graph Update


    document.getElementById("feverBar").style.width=
    fever+"%";

    document.getElementById("coldBar").style.width=
    cold+"%";

    document.getElementById("respBar").style.width=
    respiratory+"%";


}
