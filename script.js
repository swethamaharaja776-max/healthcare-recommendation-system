function getRecommendation() {

    let symptom = document.getElementById("symptom").value.toLowerCase();
    let result = "";

    if (symptom.includes("fever")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Viral Fever<br><br>
        <b>Recommendation:</b><br>
        ✓ Drink plenty of water.<br>
        ✓ Take adequate rest.<br>
        ✓ Consult a doctor if fever continues.<br>
        `;

    } else if (symptom.includes("cold")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Common Cold<br><br>
        <b>Recommendation:</b><br>
        ✓ Drink warm water.<br>
        ✓ Take proper rest.<br>
        ✓ Eat healthy food.<br>
        `;

    } else if (symptom.includes("cough")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Cough<br><br>
        <b>Recommendation:</b><br>
        ✓ Drink warm fluids.<br>
        ✓ Avoid cold drinks.<br>
        ✓ Consult a doctor if it lasts more than a week.<br>
        `;

    } else if (symptom.includes("headache")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Headache<br><br>
        <b>Recommendation:</b><br>
        ✓ Drink enough water.<br>
        ✓ Take proper rest.<br>
        ✓ Avoid stress.<br>
        `;

    } else if (symptom.includes("stomach pain")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Stomach Pain<br><br>
        <b>Recommendation:</b><br>
        ✓ Eat light food.<br>
        ✓ Drink enough water.<br>
        ✓ Consult a doctor if pain continues.<br>
        `;

    } else if (symptom.includes("vomiting")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Vomiting<br><br>
        <b>Recommendation:</b><br>
        ✓ Drink ORS.<br>
        ✓ Stay hydrated.<br>
        ✓ Visit a doctor if symptoms continue.<br>
        `;

    } else if (symptom.includes("diabetes")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Diabetes<br><br>
        <b>Recommendation:</b><br>
        ✓ Monitor blood sugar.<br>
        ✓ Exercise daily.<br>
        ✓ Follow your doctor's advice.<br>
        `;

    } else if (symptom.includes("asthma")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Asthma<br><br>
        <b>Recommendation:</b><br>
        ✓ Avoid dust and smoke.<br>
        ✓ Use prescribed inhaler.<br>
        ✓ Consult a doctor regularly.<br>
        `;

    } else if (symptom.includes("dengue")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Dengue<br><br>
        <b>Recommendation:</b><br>
        ✓ Drink plenty of fluids.<br>
        ✓ Take complete rest.<br>
        ✓ Visit a hospital immediately.<br>
        `;

    } else if (symptom.includes("malaria")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Malaria<br><br>
        <b>Recommendation:</b><br>
        ✓ Take prescribed medicine.<br>
        ✓ Drink plenty of water.<br>
        ✓ Consult a doctor immediately.<br>
        `;

    } else {
        result = `
        <h3>Patient Health Report</h3>
        <b>No matching disease found.</b><br><br>
        Please enter a valid symptom such as:<br>
        fever, cold, cough, headache, stomach pain,
        vomiting, diabetes, asthma, dengue or malaria.
        `;
    }

    document.getElementById("result").innerHTML = result;
}
