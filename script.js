function getRecommendation() {

    const symptom = document.getElementById("symptom").value.toLowerCase().trim();
    let result = "";

    if (symptom.includes("fever")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Viral Fever<br><br>
        <b>Recommendation:</b><br>
        ✓ Drink plenty of water.<br>
        ✓ Take adequate rest.<br>
        ✓ Eat healthy food.<br><br>
        <b>Risk Level:</b> Medium<br><br>
        <b>Doctor Advice:</b><br>
        Consult a doctor if fever lasts more than 2 days.
        `;

    } else if (symptom.includes("cold")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Common Cold<br><br>
        <b>Recommendation:</b><br>
        ✓ Drink warm water.<br>
        ✓ Take adequate rest.<br>
        ✓ Eat vitamin C rich foods.<br><br>
        <b>Risk Level:</b> Low<br><br>
        <b>Doctor Advice:</b><br>
        Consult a doctor if symptoms persist.
        `;

    } else if (symptom.includes("cough")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Cough<br><br>
        <b>Recommendation:</b><br>
        ✓ Drink warm fluids.<br>
        ✓ Avoid cold drinks.<br>
        ✓ Take adequate rest.<br><br>
        <b>Risk Level:</b> Low<br><br>
        <b>Doctor Advice:</b><br>
        Consult a doctor if cough lasts more than one week.
        `;

    } else if (symptom.includes("headache")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Headache<br><br>
        <b>Recommendation:</b><br>
        ✓ Stay hydrated.<br>
        ✓ Get proper sleep.<br>
        ✓ Avoid stress.<br><br>
        <b>Risk Level:</b> Low<br><br>
        <b>Doctor Advice:</b><br>
        Consult a doctor if headache is severe.
        `;

    } else if (symptom.includes("stomach pain")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Gastric Problem<br><br>
        <b>Recommendation:</b><br>
        ✓ Eat light food.<br>
        ✓ Drink enough water.<br>
        ✓ Avoid spicy food.<br><br>
        <b>Risk Level:</b> Medium<br><br>
        <b>Doctor Advice:</b><br>
        Consult a doctor if pain continues.
        `;

    } else if (symptom.includes("vomiting")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Food Poisoning<br><br>
        <b>Recommendation:</b><br>
        ✓ Drink ORS.<br>
        ✓ Stay hydrated.<br>
        ✓ Eat light meals.<br><br>
        <b>Risk Level:</b> Medium<br><br>
        <b>Doctor Advice:</b><br>
        Visit a doctor if vomiting continues.
        `;

    } else if (symptom.includes("diarrhea")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Diarrhea<br><br>
        <b>Recommendation:</b><br>
        ✓ Drink ORS.<br>
        ✓ Drink plenty of water.<br>
        ✓ Eat bland foods.<br><br>
        <b>Risk Level:</b> Medium<br><br>
        <b>Doctor Advice:</b><br>
        Consult a doctor if dehydration occurs.
        `;

    } else if (symptom.includes("sore throat")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Throat Infection<br><br>
        <b>Recommendation:</b><br>
        ✓ Gargle with warm salt water.<br>
        ✓ Drink warm fluids.<br>
        ✓ Take proper rest.<br><br>
        <b>Risk Level:</b> Low<br><br>
        <b>Doctor Advice:</b><br>
        Visit a doctor if symptoms worsen.
        `;

    } else if (symptom.includes("body pain")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Muscle Pain<br><br>
        <b>Recommendation:</b><br>
        ✓ Take adequate rest.<br>
        ✓ Stay hydrated.<br>
        ✓ Gentle stretching.<br><br>
        <b>Risk Level:</b> Low<br><br>
        <b>Doctor Advice:</b><br>
        Consult a doctor if pain persists.
        `;

    } else if (symptom.includes("fatigue")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Fatigue<br><br>
        <b>Recommendation:</b><br>
        ✓ Sleep 7–8 hours.<br>
        ✓ Eat healthy food.<br>
        ✓ Drink enough water.<br><br>
        <b>Risk Level:</b> Low<br><br>
        <b>Doctor Advice:</b><br>
        Consult a doctor if fatigue continues.
        `;
            else if (symptom.includes("asthma")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Asthma<br><br>
        <b>Recommendation:</b><br>
        ✓ Use prescribed inhaler.<br>
        ✓ Avoid dust and smoke.<br>
        ✓ Practice breathing exercises.<br><br>
        <b>Risk Level:</b> Medium<br><br>
        <b>Doctor Advice:</b><br>
        Consult a doctor if breathing difficulty increases.
        `;

    } else if (symptom.includes("diabetes")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Diabetes<br><br>
        <b>Recommendation:</b><br>
        ✓ Monitor blood sugar regularly.<br>
        ✓ Eat a balanced diet.<br>
        ✓ Exercise daily.<br><br>
        <b>Risk Level:</b> Medium<br><br>
        <b>Doctor Advice:</b><br>
        Visit your doctor for regular check-ups.
        `;

    } else if (symptom.includes("hypertension")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> High Blood Pressure<br><br>
        <b>Recommendation:</b><br>
        ✓ Reduce salt intake.<br>
        ✓ Exercise regularly.<br>
        ✓ Manage stress.<br><br>
        <b>Risk Level:</b> Medium<br><br>
        <b>Doctor Advice:</b><br>
        Monitor BP regularly and consult a doctor.
        `;

    } else if (symptom.includes("allergy")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Allergy<br><br>
        <b>Recommendation:</b><br>
        ✓ Avoid allergens.<br>
        ✓ Keep surroundings clean.<br>
        ✓ Drink enough water.<br><br>
        <b>Risk Level:</b> Low<br><br>
        <b>Doctor Advice:</b><br>
        Visit a doctor if symptoms worsen.
        `;

    } else if (symptom.includes("skin rash")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Skin Rash<br><br>
        <b>Recommendation:</b><br>
        ✓ Keep the skin clean.<br>
        ✓ Avoid scratching.<br>
        ✓ Use doctor-recommended cream.<br><br>
        <b>Risk Level:</b> Low<br><br>
        <b>Doctor Advice:</b><br>
        Consult a dermatologist if it spreads.
        `;

    } else if (symptom.includes("malaria")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Malaria<br><br>
        <b>Recommendation:</b><br>
        ✓ Drink plenty of fluids.<br>
        ✓ Take prescribed medicines.<br>
        ✓ Get adequate rest.<br><br>
        <b>Risk Level:</b> High<br><br>
        <b>Doctor Advice:</b><br>
        Seek medical attention immediately.
        `;

    } else if (symptom.includes("dengue")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Dengue<br><br>
        <b>Recommendation:</b><br>
        ✓ Drink lots of fluids.<br>
        ✓ Take complete rest.<br>
        ✓ Monitor platelet count.<br><br>
        <b>Risk Level:</b> High<br><br>
        <b>Doctor Advice:</b><br>
        Visit a hospital immediately if symptoms worsen.
        `;

    } else if (symptom.includes("typhoid")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Typhoid<br><br>
        <b>Recommendation:</b><br>
        ✓ Eat soft foods.<br>
        ✓ Drink clean water.<br>
        ✓ Complete prescribed antibiotics.<br><br>
        <b>Risk Level:</b> Medium<br><br>
        <b>Doctor Advice:</b><br>
        Follow your doctor's instructions carefully.
        `;

    } else if (symptom.includes("covid")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> COVID-19<br><br>
        <b>Recommendation:</b><br>
        ✓ Isolate yourself.<br>
        ✓ Wear a mask.<br>
        ✓ Drink plenty of fluids.<br><br>
        <b>Risk Level:</b> High<br><br>
        <b>Doctor Advice:</b><br>
        Seek medical care if breathing becomes difficult.
        `;

    } else if (symptom.includes("chest pain")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Chest Pain<br><br>
        <b>Recommendation:</b><br>
        ✓ Stop physical activity.<br>
        ✓ Stay calm.<br>
        ✓ Seek immediate medical attention.<br><br>
        <b>Risk Level:</b> High<br><br>
        <b>Doctor Advice:</b><br>
        Go to the nearest hospital immediately.
        `;

    } else if (symptom.includes("ear pain")) {
        result = `
        <h3>Patient Health Report</h3>
        <b>Possible Disease:</b> Ear Infection<br><br>
        <b>Recommendation:</b><br>
        ✓ Keep the ear dry.<br>
        ✓ Avoid inserting objects into the ear.<br>
        ✓ Consult an ENT specialist.<br><br>
        <b>Risk Level:</b> Low<br><br>
        <b>Doctor Advice:</b><br>
        Visit an ENT doctor if pain persists.
        `;
            else if (symptom.includes("migraine")) {
        result = `
        <h3>Patient Health Report</h3>

        <b>Possible Disease:</b> Migraine<br><br>

        <b>Recommendation:</b><br>
        ✓ Rest in a quiet and dark room.<br>
        ✓ Drink enough water.<br>
        ✓ Avoid stress and loud noise.<br><br>

        <b>Risk Level:</b> Medium<br><br>

        <b>Doctor Advice:</b><br>
        Consult a neurologist if migraines occur frequently.
        `;

    } else if (symptom.includes("anemia")) {
        result = `
        <h3>Patient Health Report</h3>

        <b>Possible Disease:</b> Anemia<br><br>

        <b>Recommendation:</b><br>
        ✓ Eat iron-rich foods.<br>
        ✓ Include green leafy vegetables.<br>
        ✓ Follow doctor's advice.<br><br>

        <b>Risk Level:</b> Medium<br><br>

        <b>Doctor Advice:</b><br>
        Get a blood test and consult a doctor.
        `;

    } else if (symptom.includes("constipation")) {
        result = `
        <h3>Patient Health Report</h3>

        <b>Possible Disease:</b> Constipation<br><br>

        <b>Recommendation:</b><br>
        ✓ Eat fiber-rich foods.<br>
        ✓ Drink plenty of water.<br>
        ✓ Exercise regularly.<br><br>

        <b>Risk Level:</b> Low<br><br>

        <b>Doctor Advice:</b><br>
        Consult a doctor if constipation lasts for several days.
        `;

    } else {
        result = `
        <h3>Patient Health Report</h3>

        <b>No matching disease found.</b><br><br>

        <b>Recommendation:</b><br>
        ✓ Please enter a valid symptom.<br>
        ✓ If symptoms are severe, consult a healthcare professional.<br>
        `;
    }

    document.getElementById("result").innerHTML = result;
}
        
