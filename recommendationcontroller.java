package com.healthcare.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins = "*") // Crucial: Allows your HTML to call this API
@RequestMapping("/api")
public class HealthcareController {

    @PostMapping("/analyze")
    public Map<String, String> analyze(@RequestBody Map<String, String> request) {
        String symptom = request.getOrDefault("symptom", "").toLowerCase();
        Map<String, String> response = new HashMap<>();

        // Logic
        if (symptom.contains("fever")) {
            response.put("disease", "Viral Fever");
            response.put("recommendation", "Take rest and drink plenty of water.");
            response.put("risk", "Moderate");
            response.put("confidence", "90");
        } else {
            response.put("disease", "Healthy");
            response.put("recommendation", "Keep maintaining a healthy lifestyle.");
            response.put("risk", "Low");
            response.put("confidence", "98");
        }
        return response;
    }
}
