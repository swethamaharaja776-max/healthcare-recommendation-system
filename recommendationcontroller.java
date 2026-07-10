package com.example.healthcare;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class HealthcareController {


    @PostMapping("/recommend")
    public Map<String, Object> getRecommendation(
            @RequestBody PatientData patient) {


        String symptoms =
                patient.getSymptoms().toLowerCase();


        String disease = "Healthy";
        String risk = "Low Risk";

        String recommendation =
                "Maintain healthy lifestyle and regular health checkup.";


        int feverProbability = 10;
        int coldProbability = 10;
        int respiratoryProbability = 10;



        // Symptom Analysis


        if(symptoms.contains("fever")){

            disease = "Viral Fever";
            risk = "Medium Risk";

            feverProbability = 85;

            recommendation =
            "Drink plenty of water, take adequate rest and monitor temperature.";

        }


        if(symptoms.contains("cold")){

            disease = "Common Cold";
            risk = "Medium Risk";

            coldProbability = 80;

            recommendation =
            "Drink warm fluids and take proper rest.";

        }


        if(symptoms.contains("cough")){

            disease = "Respiratory Infection";
            risk = "Medium Risk";

            respiratoryProbability = 75;

            recommendation =
            "Avoid cold foods and consult doctor if symptoms continue.";

        }


        if(symptoms.contains("headache")){

            disease = "Headache";

            recommendation =
            "Take rest, stay hydrated and reduce stress.";

        }


        if(symptoms.contains("stomach pain")){

            disease = "Digestive Problem";
            risk = "Medium Risk";

            recommendation =
            "Eat light food and drink enough water.";

        }


        if(symptoms.contains("vomiting")){

            disease = "Gastric Infection";
            risk = "Medium Risk";

            recommendation =
            "Drink ORS and maintain hydration.";

        }


        if(symptoms.contains("diarrhea")){

            disease = "Food Infection";
            risk = "Medium Risk";

            recommendation =
            "Drink fluids and avoid oily foods.";

        }


        if(symptoms.contains("sore throat")){

            disease = "Throat Infection";
            risk = "Medium Risk";

            recommendation =
            "Drink warm water and take proper care.";

        }


        if(symptoms.contains("body pain")){

            disease = "Body Pain";

            risk = "Medium Risk";

            recommendation =
            "Take adequate rest and monitor symptoms.";

        }



        if(symptoms.contains("fatigue")){

            disease = "Fatigue";

            recommendation =
            "Take proper sleep and maintain nutrition.";

        }



        // Health Parameter Analysis


        if(patient.getTemperature() > 38){

            risk = "High Risk";
            feverProbability = 90;

        }


        if(patient.getSugar() > 140){

            risk = "Medium Risk";

        }



        Map<String,Object> response =
                new HashMap<>();


        response.put("patientName",
                patient.getName());

        response.put("disease",
                disease);

        response.put("risk",
                risk);

        response.put("recommendation",
                recommendation);


        response.put("feverProbability",
                feverProbability);

        response.put("coldProbability",
                coldProbability);

        response.put("respiratoryProbability",
                respiratoryProbability);


        return response;

    }

}
