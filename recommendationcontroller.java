package com.healthcare.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins = "*") // இது இல்லை என்றால் இணைப்பை பிரவுசர் தடுக்கும் (CORS Error)
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
        } else {
            response.put("disease", "Normal");
            response.put("recommendation", "Keep healthy.");
            response.put("risk", "Low");
            response.put("confidence", "95");
        }
        return response;
    }
}
