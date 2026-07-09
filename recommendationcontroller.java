function getRecommendation() {
    const symptom = document.getElementById("symptom").value.toLowerCase().trim();
    let result = "";

    if (symptom.includes("fever")) {
        result = "Disease: Viral Fever<br>Recommendation: Drink plenty of water, take rest, and use Paracetamol if prescribed.";
    } else if (symptom.includes("cold")) {
        result = "Disease: Common Cold<br>Recommendation: Drink warm water and take adequate rest.";
    } else if (symptom.includes("cough")) {
        result = "Disease: Cough<br>Recommendation: Drink warm fluids and consult a doctor if cough persists.";
    } else if (symptom.includes("headache")) {
        result = "Disease: Headache<br>Recommendation: Stay hydrated and take sufficient rest.";
    } else if (symptom.includes("stomach pain")) {
        result = "Disease: Gastric Problem<br>Recommendation: Eat light food and drink enough water.";
    } else if (symptom.includes("vomiting")) {
        result = "Disease: Food Poisoning<br>Recommendation: Drink ORS and stay hydrated.";
    } else if (symptom.includes("diarrhea")) {
        result = "Disease: Diarrhea<br>Recommendation: Drink ORS and consult a doctor if severe.";
    } else if (symptom.includes("sore throat")) {
        result = "Disease: Throat Infection<br>Recommendation: Gargle with warm salt water.";
    } else if (symptom.includes("body pain")) {
        result = "Disease: Muscle Pain<br>Recommendation: Take proper rest and stay hydrated.";
    } else if (symptom.includes("fatigue")) {
        result = "Disease: Fatigue<br>Recommendation: Sleep well and eat a balanced diet.";
    } else if (symptom.includes("diabetes")) {
        result = "Disease: Diabetes<br>Recommendation: Monitor blood sugar and consult a doctor.";
    } else if (symptom.includes("hypertension")) {
        result = "Disease: High Blood Pressure<br>Recommendation: Reduce salt intake and exercise regularly.";
    } else if (symptom.includes("asthma")) {
        result = "Disease: Asthma<br>Recommendation: Use your inhaler as prescribed and avoid triggers.";
    } else if (symptom.includes("allergy")) {
        result = "Disease: Allergy<br>Recommendation: Avoid allergens and consult a doctor if symptoms worsen.";
    } else if (symptom.includes("skin rash")) {
        result = "Disease: Skin Allergy<br>Recommendation: Keep the area clean and consult a dermatologist.";
    } else {
        result = "No matching disease found. Please consult a healthcare professional.";
    }

    document.getElementById("result").innerHTML = result;
}
