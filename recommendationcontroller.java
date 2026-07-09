package com.example.healthcare.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class RecommendationController {

    @GetMapping("/recommend")
    public String recommend(@RequestParam String symptom) {

        symptom = symptom.toLowerCase();

        if (symptom.contains("fever")) {
            return "Possible Condition: Viral Fever\nRecommendation: Drink plenty of fluids, take rest, and consult a doctor if fever continues.";
        }

        if (symptom.contains("cough")) {
            return "Possible Condition: Common Cold\nRecommendation: Drink warm water, avoid cold foods, and take proper rest.";
        }

        if (symptom.contains("headache")) {
            return "Possible Condition: Stress or Migraine\nRecommendation: Stay hydrated, rest well, and avoid excessive screen time.";
        }

        if (symptom.contains("stomach pain")) {
            return "Possible Condition: Indigestion\nRecommendation: Eat light food, drink water, and consult a doctor if pain persists.";
        }

        return "No matching condition found. Please consult a healthcare professional.";
    }
}
