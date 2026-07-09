function getRecommendation() {

    const symptom = document.getElementById("symptom").value.toLowerCase().trim();
    let result = "";

    if (symptom.includes("fever")) {
        result = `<h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Viral Fever<br><br>
        <b>Recommendation:</b><br>
        ✓ Drink plenty of water.<br>
        ✓ Take adequate rest.<br>
        ✓ Eat healthy food.<br><br>
        <b>Risk Level:</b> Medium<br><br>
        <b>Doctor Advice:</b><br>
        Consult a doctor if the fever lasts more than 2 days.`;

    } else if (symptom.includes("cold")) {
        result = "<b>Disease:</b> Common Cold<br><b>Recommendation:</b> Drink warm water and take rest.";

    } else if (symptom.includes("cough")) {
        result = "<b>Disease:</b> Cough<br><b>Recommendation:</b> Drink warm fluids and avoid cold drinks.";

    } else if (symptom.includes("headache")) {
        result = "<b>Disease:</b> Headache<br><b>Recommendation:</b> Take rest and stay hydrated.";

    } else if (symptom.includes("stomach pain")) {
        result = "<b>Disease:</b> Gastric Problem<br><b>Recommendation:</b> Eat light food.";

    } else if (symptom.includes("vomiting")) {
        result = "<b>Disease:</b> Food Poisoning<br><b>Recommendation:</b> Drink ORS and stay hydrated.";

    } else if (symptom.includes("diarrhea")) {
        result = "<b>Disease:</b> Diarrhea<br><b>Recommendation:</b> Drink ORS and consult a doctor.";

    } else if (symptom.includes("sore throat")) {
        result = "<b>Disease:</b> Throat Infection<br><b>Recommendation:</b> Gargle with warm salt water.";

    } else if (symptom.includes("body pain")) {
        result = "<b>Disease:</b> Muscle Pain<br><b>Recommendation:</b> Take proper rest.";

    } else if (symptom.includes("fatigue")) {
        result = "<b>Disease:</b> Fatigue<br><b>Recommendation:</b> Sleep well and eat healthy food.";

    } else if (symptom.includes("asthma")) {
        result = "<b>Disease:</b> Asthma<br><b>Recommendation:</b> Use prescribed inhaler and consult a doctor.";

    } else if (symptom.includes("diabetes")) {
        result = "<b>Disease:</b> Diabetes<br><b>Recommendation:</b> Monitor blood sugar regularly.";

    } else if (symptom.includes("hypertension")) {
        result = "<b>Disease:</b> High Blood Pressure<br><b>Recommendation:</b> Reduce salt intake.";

    } else if (symptom.includes("allergy")) {
        result = "<b>Disease:</b> Allergy<br><b>Recommendation:</b> Avoid allergens.";

    } else if (symptom.includes("skin rash")) {
        result = "<b>Disease:</b> Skin Rash<br><b>Recommendation:</b> Keep skin clean and consult a dermatologist.";

    } else if (symptom.includes("malaria")) {
        result = "<b>Disease:</b> Malaria<br><b>Recommendation:</b> Consult a doctor immediately.";

    } else if (symptom.includes("dengue")) {
        result = "<b>Disease:</b> Dengue<br><b>Recommendation:</b> Drink plenty of fluids and seek medical care.";

    } else if (symptom.includes("typhoid")) {
        result = "<b>Disease:</b> Typhoid<br><b>Recommendation:</b> Take prescribed antibiotics and rest.";

    } else if (symptom.includes("covid")) {
        result = "<b>Disease:</b> COVID-19<br><b>Recommendation:</b> Isolate and consult a doctor.";

    } else if (symptom.includes("chest pain")) {
        result = "<b>Disease:</b> Chest Pain<br><b>Recommendation:</b> Seek immediate medical attention.";

    } else if (symptom.includes("ear pain")) {
        result = "<b>Disease:</b> Ear Infection<br><b>Recommendation:</b> Consult an ENT specialist.";

    } else {
        result = "<b>No matching disease found.</b><br>Please consult a healthcare professional.";
    }

    document.getElementById("result").innerHTML = result;
    }
