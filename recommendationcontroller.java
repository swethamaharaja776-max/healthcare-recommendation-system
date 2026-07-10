package com.healthcare.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins = "*") 
@RequestMapping("/api")
public class HealthcareController {

    @PostMapping("/analyze")
    public Map<String, String> analyze(@RequestBody Map<String, String> request) {
        String symptom = request.getOrDefault("symptom", "").toLowerCase();
        Map<String, String> response = new HashMap<>();

        if (symptom.contains("fever")) {
            response.put("disease", "Viral Fever");
            response.put("recommendation", "Drink plenty of water and take rest.");
            response.put("risk", "Moderate");
            response.put("confidence", "90");
        } else {
            response.put("disease", "Healthy");
            response.put("recommendation", "Stay healthy!");
            response.put("risk", "Low");
            response.put("confidence", "98");
        }
        return response;
    }
}
