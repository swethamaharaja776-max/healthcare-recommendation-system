function getRecommendation() {

    const symptom = document.getElementById("symptom").value.toLowerCase();
    let result = "";

    if (symptom.includes("fever")) {
        result = "Disease: Viral Fever <br> Recommendation: Drink plenty of water and take rest.";
    } else if (symptom.includes("cold")) {
        result = "Disease: Common Cold <br> Recommendation: Drink warm water.";
    } else if (symptom.includes("cough")) {
        result = "Disease: Cough <br> Recommendation: Drink warm fluids.";
    } else if (symptom.includes("headache")) {
        result = "Disease: Headache <br> Recommendation: Take rest and stay hydrated.";
    } else if (symptom.includes("stomach pain")) {
        result = "Disease: Gastric Problem <br> Recommendation: Eat light food.";
    } else if (symptom.includes("vomiting")) {
        result = "Disease: Food Poisoning <br> Recommendation: Drink ORS.";
    } else if (symptom.includes("diarrhea")) {
        result = "Disease: Diarrhea <br> Recommendation: Stay hydrated.";
    } else if (symptom.includes("sore throat")) {
        result = "Disease: Throat Infection <br> Recommendation: Gargle with warm salt water.";
    } else if (symptom.includes("body pain")) {
        result = "Disease: Muscle Pain <br> Recommendation: Take rest.";
    } else if (symptom.includes("fatigue")) {
        result = "Disease: Fatigue <br> Recommendation: Sleep well.";
    } else if (symptom.includes("asthma")) {
        result = "Disease: Asthma <br> Recommendation: Consult a doctor.";
    } else if (symptom.includes("diabetes")) {
        result = "Disease: Diabetes <br> Recommendation: Check blood sugar regularly.";
    } else if (symptom.includes("hypertension")) {
        result = "Disease: High Blood Pressure <br> Recommendation: Reduce salt intake.";
    } else if (symptom.includes("allergy")) {
        result = "Disease: Allergy <br> Recommendation: Avoid allergens.";
    } else if (symptom.includes("skin rash")) {
        result = "Disease: Skin Allergy <br> Recommendation: Keep the affected area clean.";
    } else {
        result = "No matching disease found. Please consult a healthcare professional.";
    }

    document.getElementById("result").innerHTML = result;
}
