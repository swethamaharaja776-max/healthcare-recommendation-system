package com.healthcare.controller;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class HealthcareController {

    @PostMapping("/analyze")
    public Map<String, String> analyze(@RequestBody Map<String, String> request) {

        String symptom = request.get("symptom").toLowerCase();

        Map<String, String> response = new HashMap<>();

        String disease = "Healthy";
        String recommendation = "Maintain a healthy lifestyle.";
        String risk = "Low";
        String confidence = "96%";

        if (symptom.contains("fever")) {
            disease = "Viral Fever";
            recommendation = "Drink plenty of water, take rest and consult a doctor if fever continues.";
            risk = "Moderate";
            confidence = "90%";
        }

        else if (symptom.contains("cold")) {
            disease = "Common Cold";
            recommendation = "Drink warm water and take adequate rest.";
            risk = "Low";
            confidence = "89%";
        }

        else if (symptom.contains("cough")) {
            disease = "Respiratory Infection";
            recommendation = "Use warm fluids and consult a doctor if cough persists.";
            risk = "Moderate";
            confidence = "87%";
        }

        else if (symptom.contains("headache")) {
            disease = "Migraine / Stress";
            recommendation = "Take enough sleep and drink more water.";
            risk = "Low";
            confidence = "88%";
        }

        else if (symptom.contains("stomach")) {
            disease = "Gastric Problem";
            recommendation = "Eat light food and drink plenty of water.";
            risk = "Moderate";
            confidence = "86%";
        }
                else if (symptom.contains("vomiting")) {
            disease = "Food Poisoning";
            recommendation = "Drink ORS, stay hydrated and consult a doctor if vomiting continues.";
            risk = "High";
            confidence = "92%";
        }

        else if (symptom.contains("diarrhea")) {
            disease = "Stomach Infection";
            recommendation = "Drink ORS, avoid spicy foods and stay hydrated.";
            risk = "High";
            confidence = "91%";
        }

        else if (symptom.contains("body pain")) {
            disease = "Body Pain";
            recommendation = "Take proper rest and drink plenty of fluids.";
            risk = "Low";
            confidence = "88%";
        }

        else if (symptom.contains("fatigue")) {
            disease = "Weakness";
            recommendation = "Eat nutritious food, sleep well and drink enough water.";
            risk = "Low";
            confidence = "89%";
        }

        else if (symptom.contains("sore throat")) {
            disease = "Throat Infection";
            recommendation = "Drink warm water and avoid cold drinks.";
            risk = "Moderate";
            confidence = "87%";
        }

        response.put("disease", disease);
        response.put("recommendation", recommendation);
        response.put("risk", risk);
        response.put("confidence", confidence);

        return response;
    }
}
        
