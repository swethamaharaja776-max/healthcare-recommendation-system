import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class Controller {

    @PostMapping("/recommend")
    public Map<String, String> recommend(@RequestBody Map<String, String> patient) {

        String symptom = patient.getOrDefault("symptom", "").toLowerCase();

        String disease = "General Checkup";
        String recommendation = "Maintain a healthy lifestyle and consult a doctor if symptoms continue.";
        String risk = "Low";
        String probability = "30%";

        if (symptom.contains("fever")) {
            disease = "Viral Fever";
            recommendation = "Drink plenty of water, take adequate rest and consult a doctor if fever continues.";
            risk = "Medium";
            probability = "85%";
        } 
        else if (symptom.contains("cold")) {
            disease = "Common Cold";
            recommendation = "Drink warm water, take proper rest and eat healthy food.";
            risk = "Low";
            probability = "75%";
        } 
        else if (symptom.contains("cough")) {
            disease = "Respiratory Infection";
            recommendation = "Drink warm fluids, avoid cold drinks and consult a doctor if cough persists.";
            risk = "Medium";
            probability = "80%";
        } 
        else if (symptom.contains("headache")) {
            disease = "Migraine / Stress";
            recommendation = "Drink enough water, take proper rest and avoid stress.";
            risk = "Low";
            probability = "70%";
        } 
        else if (symptom.contains("stomach pain")) {
            disease = "Gastric Problem";
            recommendation = "Eat light food, drink enough water and consult a doctor if pain continues.";
            risk = "Medium";
            probability = "78%";
        } 
        else if (symptom.contains("vomiting")) {
            disease = "Vomiting";
            recommendation = "Drink ORS, stay hydrated and visit a doctor if symptoms continue.";
            risk = "Medium";
            probability = "82%";
        } 
        else if (symptom.contains("diabetes")) {
            disease = "Diabetes";
            recommendation = "Monitor blood sugar, exercise regularly and follow your doctor's advice.";
            risk = "High";
            probability = "90%";
        } 
        else if (symptom.contains("asthma")) {
            disease = "Asthma";
            recommendation = "Avoid dust and smoke, use the prescribed inhaler and consult your doctor regularly.";
            risk = "High";
            probability = "88%";
        } 
        else if (symptom.contains("dengue")) {
            disease = "Dengue";
            recommendation = "Drink plenty of fluids, take complete rest and visit a hospital immediately.";
            risk = "High";
            probability = "95%";
        } 
        else if (symptom.contains("malaria")) {
            disease = "Malaria";
            recommendation = "Take prescribed medicine, drink plenty of water and consult a doctor immediately.";
            risk = "High";
            probability = "92%";
        }

        Map<String, String> response = new HashMap<>();
        response.put("disease", disease);
        response.put("recommendation", recommendation);
        response.put("risk", risk);
        response.put("probability", probability);

        return response;
    }
}
