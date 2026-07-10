package com.healthcare.controller;

import org.springframework.web.bind.annotation.*;
import java.sql.*;
import java.util.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class HealthcareController {

    // ---------- MySQL connection settings ----------
    // Update these 3 values to match your own MySQL setup
    private static final String DB_URL  = "jdbc:mysql://localhost:3306/medassist_db?useSSL=false&serverTimezone=UTC";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "yourpassword";

    // Creates the table automatically the first time the app talks to the DB
    private void ensureTableExists() throws SQLException {
        String sql = "CREATE TABLE IF NOT EXISTS patient_history (" +
                "id INT AUTO_INCREMENT PRIMARY KEY," +
                "name VARCHAR(100)," +
                "age VARCHAR(10)," +
                "gender VARCHAR(20)," +
                "disease VARCHAR(100)," +
                "risk VARCHAR(20)," +
                "score VARCHAR(20)," +
                "confidence VARCHAR(20)," +
                "record_date VARCHAR(50)" +
                ")";
        try (Connection con = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
             Statement st = con.createStatement()) {
            st.execute(sql);
        }
    }

    // ---------- Existing symptom analysis endpoint (optional server-side check) ----------
    @PostMapping("/analyze")
    public Map<String, String> analyze(@RequestBody Map<String, String> request) {

        String symptom = request.getOrDefault("symptom", "").toLowerCase();

        Map<String, String> response = new HashMap<>();

        if (symptom.isBlank()) {
            response.put("disease", "Unknown");
            response.put("recommendation", "Please enter symptoms.");
            response.put("risk", "Unknown");
            response.put("confidence", "0%");
            return response;
        }

        String disease = "Healthy";
        String recommendation = "Maintain a healthy lifestyle.";
        String risk = "Low";
        String confidence = "96%";

        if (symptom.contains("fever")) {
            disease = "Viral Fever";
            recommendation = "Drink plenty of water, take proper rest and consult a doctor if fever continues.";
            risk = "Moderate";
            confidence = "90%";
        } else if (symptom.contains("cold")) {
            disease = "Common Cold";
            recommendation = "Drink warm water and take adequate rest.";
            risk = "Low";
            confidence = "89%";
        } else if (symptom.contains("cough")) {
            disease = "Respiratory Infection";
            recommendation = "Drink warm fluids and consult a doctor if cough persists.";
            risk = "Moderate";
            confidence = "87%";
        } else if (symptom.contains("headache")) {
            disease = "Migraine / Stress";
            recommendation = "Take enough sleep, drink more water and reduce stress.";
            risk = "Low";
            confidence = "88%";
        } else if (symptom.contains("stomach")) {
            disease = "Gastric Problem";
            recommendation = "Eat light food, drink plenty of water and avoid oily foods.";
            risk = "Moderate";
            confidence = "86%";
        } else if (symptom.contains("vomiting")) {
            disease = "Food Poisoning";
            recommendation = "Drink ORS, stay hydrated and consult a doctor if vomiting continues.";
            risk = "High";
            confidence = "92%";
        } else if (symptom.contains("diarrhea")) {
            disease = "Stomach Infection";
            recommendation = "Drink ORS, avoid spicy foods and stay hydrated.";
            risk = "High";
            confidence = "91%";
        } else if (symptom.contains("body pain")) {
            disease = "Body Pain";
            recommendation = "Take proper rest and drink plenty of fluids.";
            risk = "Low";
            confidence = "88%";
        } else if (symptom.contains("fatigue")) {
            disease = "Weakness";
            recommendation = "Eat nutritious food, sleep well and drink enough water.";
            risk = "Low";
            confidence = "89%";
        } else if (symptom.contains("sore throat")) {
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

    // ---------- Save Patient History to MySQL ----------
    @PostMapping("/save-patient")
    public Map<String, String> savePatient(@RequestBody Map<String, String> request) {

        Map<String, String> response = new HashMap<>();

        String sql = "INSERT INTO patient_history (name, age, gender, disease, risk, score, confidence, record_date) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            ensureTableExists();

            try (Connection con = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
                 PreparedStatement ps = con.prepareStatement(sql)) {

                ps.setString(1, request.getOrDefault("name", ""));
                ps.setString(2, request.getOrDefault("age", ""));
                ps.setString(3, request.getOrDefault("gender", ""));
                ps.setString(4, request.getOrDefault("disease", ""));
                ps.setString(5, request.getOrDefault("risk", ""));
                ps.setString(6, request.getOrDefault("score", ""));
                ps.setString(7, request.getOrDefault("confidence", ""));
                ps.setString(8, request.getOrDefault("recordDate", ""));

                ps.executeUpdate();
            }

            response.put("status", "success");
            response.put("message", "Patient record saved.");

        } catch (SQLException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
        }

        return response;
    }

    // ---------- Fetch Patient History (for admin / trend review) ----------
    @GetMapping("/history")
    public List<Map<String, String>> getHistory() {

        List<Map<String, String>> history = new ArrayList<>();
        String sql = "SELECT * FROM patient_history ORDER BY id DESC";

        try {
            ensureTableExists();

            try (Connection con = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
                 Statement st = con.createStatement();
                 ResultSet rs = st.executeQuery(sql)) {

                while (rs.next()) {
                    Map<String, String> row = new HashMap<>();
                    row.put("name", rs.getString("name"));
                    row.put("age", rs.getString("age"));
                    row.put("gender", rs.getString("gender"));
                    row.put("disease", rs.getString("disease"));
                    row.put("risk", rs.getString("risk"));
                    row.put("score", rs.getString("score"));
                    row.put("confidence", rs.getString("confidence"));
                    row.put("recordDate", rs.getString("record_date"));
                    history.add(row);
                }
            }
        } catch (SQLException e) {
            // return empty list on failure; frontend will just show nothing
        }

        return history;
    }
}
