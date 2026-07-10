function getRecommendation() {

    let name = document.getElementById("name").value.trim();
    let age = document.getElementById("age").value.trim();
    let gender = document.getElementById("gender").value;
    let height = document.getElementById("height").value.trim();
    let weight = document.getElementById("weight").value.trim();
    let bp = document.getElementById("bp").value.trim();
    let sugar = document.getElementById("sugar").value.trim();
    let heartRate = document.getElementById("heartRate").value.trim();
    let temperature = document.getElementById("temperature").value.trim();
    let symptom = document.getElementById("symptom").value.trim().toLowerCase();

    if (name === "" || age === "" || height === "" || weight === "" || symptom === "") {
        alert("Please fill all required fields");
        return;
    }

    document.getElementById("report").style.display = "block";

    document.getElementById("patientName").innerHTML = name;
    document.getElementById("patientAge").innerHTML = age;
    document.getElementById("patientGender").innerHTML = gender;

    let h = height / 100;
    let bmi = (weight / (h * h)).toFixed(1);
    document.getElementById("bmi").innerHTML = bmi;

    let score = 100;

    if (temperature > 37.5) score -= 10;
    if (sugar > 140) score -= 10;
    if (heartRate > 100) score -= 10;

    document.getElementById("score").innerHTML = score + "/100";

    let disease = "General Checkup";
    let recommendation = "Maintain a healthy lifestyle.";
    let risk = "Low";
    let probability = 30;
        if (symptom.includes("fever")) {
        disease = "Viral Fever";
        recommendation = "✓ Drink plenty of water.<br>✓ Take adequate rest.<br>✓ Consult a doctor if fever continues.";
        risk = "Medium";
        probability = 85;
    }
    else if (symptom.includes("cold")) {
        disease = "Common Cold";
        recommendation = "✓ Drink warm water.<br>✓ Take proper rest.<br>✓ Eat healthy food.";
        risk = "Low";
        probability = 75;
    }
    else if (symptom.includes("cough")) {
        disease = "Respiratory Infection";
        recommendation = "✓ Drink warm fluids.<br>✓ Avoid cold drinks.<br>✓ Consult a doctor if cough persists.";
        risk = "Medium";
        probability = 80;
    }
    else if (symptom.includes("headache")) {
        disease = "Headache";
        recommendation = "✓ Drink enough water.<br>✓ Take proper rest.<br>✓ Avoid stress.";
        risk = "Low";
        probability = 70;
    }
    else if (symptom.includes("stomach pain")) {
        disease = "Stomach Pain";
        recommendation = "✓ Eat light food.<br>✓ Drink enough water.<br>✓ Consult a doctor if pain continues.";
        risk = "Medium";
        probability = 78;
    }
    else if (symptom.includes("vomiting")) {
        disease = "Vomiting";
        recommendation = "✓ Drink ORS.<br>✓ Stay hydrated.<br>✓ Visit a doctor if symptoms continue.";
        risk = "Medium";
        probability = 82;
    }
    else if (symptom.includes("diabetes")) {
        disease = "Diabetes";
        recommendation = "✓ Monitor blood sugar.<br>✓ Exercise daily.<br>✓ Follow your doctor's advice.";
        risk = "High";
        probability = 90;
    }
    else if (symptom.includes("asthma")) {
        disease = "Asthma";
        recommendation = "✓ Avoid dust and smoke.<br>✓ Use prescribed inhaler.<br>✓ Consult a doctor regularly.";
        risk = "High";
        probability = 88;
    }
    else if (symptom.includes("dengue")) {
        disease = "Dengue";
        recommendation = "✓ Drink plenty of fluids.<br>✓ Take complete rest.<br>✓ Visit a hospital immediately.";
        risk = "High";
        probability = 95;
    }
    else if (symptom.includes("malaria")) {
        disease = "Malaria";
        recommendation = "✓ Take prescribed medicine.<br>✓ Drink plenty of water.<br>✓ Consult a doctor immediately.";
        risk = "High";
        probability = 92;
    }

    document.getElementById("disease").innerHTML = disease;
    document.getElementById("risk").innerHTML = risk;
    document.getElementById("result").innerHTML = recommendation;

    let graph = document.getElementById("graph");
    graph.style.width = probability + "%";
    graph.innerHTML = probability + "%";
}
