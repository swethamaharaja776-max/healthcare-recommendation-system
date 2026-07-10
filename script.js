function getRecommendation() {

    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let gender = document.getElementById("gender").value;
    let height = document.getElementById("height").value;
    let weight = document.getElementById("weight").value;
    let bp = document.getElementById("bp").value;
    let sugar = document.getElementById("sugar").value;
    let heartRate = document.getElementById("heartRate").value;
    let temperature = document.getElementById("temperature").value;
    let symptom = document.getElementById("symptom").value.toLowerCase();

    if(name=="" || age=="" || height=="" || weight=="" || symptom==""){
        alert("Please fill all required fields");
        return;
    }

    // Show Report
    document.getElementById("report").style.display="block";

    // Patient Details
    document.getElementById("patientName").innerHTML=name;
    document.getElementById("patientAge").innerHTML=age;
    document.getElementById("patientGender").innerHTML=gender;

    // BMI
    let h = height / 100;
    let bmi = (weight / (h*h)).toFixed(1);
    document.getElementById("bmi").innerHTML=bmi;

    // Health Score
    let score = 100;

    if(sugar > 140) score -= 10;
    if(temperature > 37.5) score -= 10;
    if(heartRate > 100) score -= 10;

    document.getElementById("score").innerHTML=score+"/100";

    // Disease Prediction
    let disease="General Checkup";
    let recommendation="Stay Healthy.";
    let risk="Low";
    let probability=30;

    if(symptom.includes("fever")){
        disease="Viral Fever";
        recommendation="Drink plenty of water, take rest and consult a doctor if fever continues.";
        risk="Medium";
        probability=85;
    }

    if(symptom.includes("cold")){
        disease="Common Cold";
        recommendation="Drink warm water and take adequate rest.";
        risk="Low";
        probability=75;
    }

    if(symptom.includes("cough")){
        disease="Respiratory Infection";
        recommendation="Drink warm fluids and consult a doctor if cough persists.";
        risk="Medium";
        probability=80;
    }

    if(symptom.includes("headache")){
        disease="Migraine / Stress";
        recommendation="Take proper rest and stay hydrated.";
        risk="Low";
        probability=70;
    }

    if(symptom.includes("stomach")){
        disease="Gastric Problem";
        recommendation="Eat light food and drink enough water.";
        risk="Medium";
        probability=78;
    }

    document.getElementById("disease").innerHTML=disease;
    document.getElementById("risk").innerHTML=risk;
    document.getElementById("result").innerHTML=recommendation;

    // Graph
    let graph=document.getElementById("graph");
    graph.style.width=probability+"%";
    graph.innerHTML=probability+"%";
}
