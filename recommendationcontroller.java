package com.healthcare.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins = "*") // Crucial for frontend communication
@RequestMapping("/api")
public class HealthcareController {

    @PostMapping("/analyze")
    public Map<String, String> analyze(@RequestBody Map<String, String> request) {
        String symptom = request.getOrDefault("symptom", "").toLowerCase();
        Map<String, String> response = new HashMap<>();

        if (symptom.contains("fever")) {
            response.put("disease", "Viral Fever");
            response.put("recommendation", "Take rest and drink plenty of water.");
            response.put("risk", "Moderate");
            response.put("confidence", "90");
        } else if (symptom.contains("cough")) {
            response.put("disease", "Respiratory Infection");
            response.put("recommendation", "Drink warm fluids and consult a doctor.");
            response.put("risk", "Moderate");
            response.put("confidence", "87");
        } else {
            response.put("disease", "General Condition");
            response.put("recommendation", "Monitor your health and stay hydrated.");
            response.put("risk", "Low");
            response.put("confidence", "95");
        }
        return response;
    }
}
