// ===============================
// AI MedAssist Pro - script.js (Part 1)
// ===============================

// Auto Generate Patient ID
document.getElementById("pid").value =
"PID" + Math.floor(Math.random() * 100000);

// Current Date & Time
let now = new Date();
document.getElementById("date").value =
now.toLocaleString();

// Analyze Health
function analyzeHealth() {

    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let gender = document.getElementById("gender").value;

    let height = parseFloat(document.getElementById("height").value);
    let weight = parseFloat(document.getElementById("weight").value);

    let symptom =
        document.getElementById("symptom").value.toLowerCase();

    // BMI Calculation
    let bmi = 0;

    if (height > 0 && weight > 0) {

        bmi = weight / ((height / 100) * (height / 100));

        document.getElementById("bmi").value =
            bmi.toFixed(1);

    }

    // Default Values
    let disease = "Healthy";
    let recommendation = "Maintain a healthy lifestyle.";
    let risk = "Low";
    let score = 95;
    let confidence = "96%";

    // Fever
    if (symptom.includes("fever")) {

        disease = "Viral Fever";
        recommendation =
        "Drink plenty of water, take rest and consult a doctor if fever continues.";

        risk = "Moderate";
        score = 80;
        confidence = "90%";

    }

    // Cold
    if (symptom.includes("cold")) {

        disease = "Common Cold";
        recommendation =
        "Drink warm water and take adequate rest.";

        risk = "Low";
        score = 88;
        confidence = "89%";

    }

    // Cough
    if (symptom.includes("cough")) {

        disease = "Respiratory Infection";
        recommendation =
        "Use warm fluids and consult a doctor if cough persists.";

        risk = "Moderate";
        score = 78;
        confidence = "87%";
            // Stomach Pain
    if (symptom.includes("stomach")) {

        disease = "Gastric Problem";
        recommendation =
        "Eat light food, drink plenty of water and avoid oily foods.";

        risk = "Moderate";
        score = 76;
        confidence = "86%";

    }

    // Vomiting
    if (symptom.includes("vomiting")) {

        disease = "Food Poisoning";
        recommendation =
        "Drink ORS, stay hydrated and consult a doctor if vomiting continues.";

        risk = "High";
        score = 65;
        confidence = "92%";

    }

    // Diarrhea
    if (symptom.includes("diarrhea")) {

        disease = "Stomach Infection";
        recommendation =
        "Drink ORS, avoid spicy foods and stay hydrated.";

        risk = "High";
        score = 68;
        confidence = "91%";

    }

    // Body Pain
    if (symptom.includes("body pain")) {

        disease = "Body Pain";
        recommendation =
        "Take proper rest and drink plenty of fluids.";

        risk = "Low";
        score = 85;
        confidence = "88%";

    }

    // Fatigue
    if (symptom.includes("fatigue")) {

        disease = "Weakness";
        recommendation =
        "Eat nutritious food, sleep well and drink enough water.";

        risk = "Low";
        score = 87;
        confidence = "89%";

    }

    // Sore Throat
    if (symptom.includes("sore throat")) {

        disease = "Throat Infection";
        recommendation =
        "Drink warm water and avoid cold drinks.";

        risk = "Moderate";
        score = 79;
        confidence = "87%";

    }

    // Display Results
    document.getElementById("score").innerHTML = score + "/100";
    document.getElementById("risk").innerHTML = risk;
    document.getElementById("confidence").innerHTML = confidence;
    document.getElementById("disease").innerHTML = disease;
    document.getElementById("recommend").innerHTML = recommendation;

    // Progress Bar
    document.getElementById("bar").style.width = score + "%";

    // Patient Report
    document.getElementById("rname").innerHTML = name;
    document.getElementById("rage").innerHTML = age;
    document.getElementById("rgender").innerHTML = gender;
    document.getElementById("rdate").innerHTML =
        new Date().toLocaleString();

    }
    
        

    }

    // Headache
    if (symptom.includes("headache")) {

        disease = "Migraine / Stress";
        recommendation =
        "Take enough sleep and drink more water.";

        risk = "Low";
        score = 84;
        confidence = "88%";

        

    }
