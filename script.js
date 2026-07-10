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

    let symptoms = document
    .getElementById("symptoms")
    .value
    .toLowerCase();


    // Validation

    if(name === "" || age === "" || symptoms === ""){

        alert("Please fill Patient Name, Age and Symptoms");
        return;
    }



    // Patient Report

    document.getElementById("rname").innerHTML = name;
    document.getElementById("rage").innerHTML = age;
    document.getElementById("rgender").innerHTML = gender;

    document.getElementById("date").innerHTML =
    new Date().toLocaleString();



    // BMI

    if(height > 0 && weight > 0){

        let bmi =
        (weight / ((height/100)*(height/100))).toFixed(2);

        document.getElementById("bmi").innerHTML = bmi;

    }



    let disease = "Healthy";
    let risk = "Low Risk";

    let recommendation =
    "Maintain healthy lifestyle and regular health checkup.";


    let fever = 10;
    let cold = 10;
    let respiratory = 10;



    // AI Symptom Prediction


    if(symptoms.includes("fever")){

        disease = "Viral Fever";
        risk = "Medium Risk";

        fever = 85;

        recommendation =
        "Drink plenty of water, take adequate rest and monitor temperature.";

    }


    if(symptoms.includes("cold")){

        disease = "Common Cold";
        risk = "Medium Risk";

        cold = 80;

        recommendation =
        "Drink warm fluids and take proper rest.";

    }


    if(symptoms.includes("cough")){

        disease = "Respiratory Infection";
        risk = "Medium Risk";

        respiratory = 75;

        recommendation =
        "Avoid cold foods and consult doctor if cough continues.";

    }


    if(symptoms.includes("headache")){

        disease = "Headache";

        recommendation =
        "Take rest and stay hydrated.";

    }


    if(symptoms.includes("stomach pain")){

        disease = "Digestive Problem";
        risk = "Medium Risk";

        recommendation =
        "Eat light food and drink enough water.";

    }


    if(symptoms.includes("vomiting")){

        disease = "Gastric Infection";
        risk = "Medium Risk";

        recommendation =
        "Drink ORS and maintain hydration.";

    }


    if(symptoms.includes("diarrhea")){

        disease = "Food Infection";
        risk = "Medium Risk";

        recommendation =
        "Drink fluids and avoid oily foods.";

    }



    // Health Parameter Check


    if(temp > 38){

        risk = "High Risk";
        fever = 90;

    }


    if(sugar > 140){

        risk = "Medium Risk";

    }


    if(bp.includes("140")){

        risk = "High Risk";

    }



    // Display Result


    document.getElementById("risk").innerHTML = risk;

    document.getElementById("disease").innerHTML = disease;


    document.getElementById("recommendation").innerHTML =
    "✔ " + recommendation;



    // Graph

    document.getElementById("feverBar").style.width =
    fever + "%";


    document.getElementById("coldBar").style.width =
    cold + "%";


    document.getElementById("respBar").style.width =
    respiratory + "%";

}
