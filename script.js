// AI MedAssist Pro

function analyzeHealth() {

    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let gender = document.getElementById("gender").value;

    let height = parseFloat(document.getElementById("height").value);
    let weight = parseFloat(document.getElementById("weight").value);

    let symptom = document.getElementById("symptom").value.toLowerCase();

    // BMI
    if (height > 0 && weight > 0) {
        let bmi = weight / ((height / 100) * (height / 100));
        document.getElementById("bmi").value = bmi.toFixed(1);
    }

    let disease = "Healthy";
    let recommendation = "Maintain a healthy lifestyle.";
    let risk = "Low";
    let score = 95;
    let confidence = "96%";

    // Fever
    if (symptom.includes("fever")) {
        disease = "Viral Fever";
        recommendation = "Drink plenty of water, take proper rest and consult a doctor if fever continues.";
        risk = "Moderate";
        score = 80;
        confidence = "90%";
    }

    // Cold
    else if (symptom.includes("cold")) {
        disease = "Common Cold";
        recommendation = "Drink warm water and take adequate rest.";
        risk = "Low";
        score = 88;
        confidence = "89%";
    }

    // Cough
    else if (symptom.includes("cough")) {
        disease = "Respiratory Infection";
        recommendation = "Drink warm fluids and consult a doctor if cough persists.";
        risk = "Moderate";
        score = 78;
        confidence = "87%";
    }

    // Headache
    else if (symptom.includes("headache")) {
        disease = "Migraine / Stress";
        recommendation = "Take enough sleep, drink more water and reduce stress.";
        risk = "Low";
        score = 84;
        confidence = "88%";
    }

    // Stomach Pain
    else if (symptom.includes("stomach")) {
        disease = "Gastric Problem";
        recommendation = "Eat light food, drink plenty of water and avoid oily foods.";
        risk = "Moderate";
        score = 76;
        confidence = "86%";
    }

    // Vomiting
    else if (symptom.includes("vomiting")) {
        disease = "Food Poisoning";
        recommendation = "Drink ORS, stay hydrated and consult a doctor if vomiting continues.";
        risk = "High";
        score = 65;
        confidence = "92%";
    }

    // Diarrhea
    else if (symptom.includes("diarrhea")) {
        disease = "Stomach Infection";
        recommendation = "Drink ORS, avoid spicy foods and stay hydrated.";
        risk = "High";
        score = 68;
        confidence = "91%";
    }

    // Body Pain
    else if (symptom.includes("body pain")) {
        disease = "Body Pain";
        recommendation = "Take proper rest and drink plenty of fluids.";
        risk = "Low";
        score = 85;
        confidence = "88%";
    }

    // Fatigue
    else if (symptom.includes("fatigue")) {
        disease = "Weakness";
        recommendation = "Eat nutritious food, sleep well and drink enough water.";
        risk = "Low";
        score = 87;
        confidence = "89%";
    }

    // Sore Throat
    else if (symptom.includes("sore throat")) {
        disease = "Throat Infection";
        recommendation = "Drink warm water and avoid cold drinks.";
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

    // Patient Report
    document.getElementById("rname").innerHTML = name;
    document.getElementById("rage").innerHTML = age;
    document.getElementById("rgender").innerHTML = gender;
    document.getElementById("rdate").innerHTML =
        new Date().toLocaleString();
}
    
