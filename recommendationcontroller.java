/* ==========================================================
   AI MedAssist Pro - Backend Servlet (v2)
   ----------------------------------------------------------
   Handles:
     POST /api/login            -> check username/password
     POST /api/savePatient      -> insert one patient record
     GET  /api/patientHistory   -> return recent records as JSON
                                    (used by trend graphs + history timeline)

   Requirements:
     - javax.servlet-api (or jakarta.servlet-api on newer
       Tomcat/Jakarta EE servers - adjust imports accordingly)
     - mysql-connector-j on the classpath
     - A MySQL database reachable with the credentials below

   SQL schema (run once):
   ----------------------------------------------------------
   CREATE DATABASE IF NOT EXISTS medassist;
   USE medassist;

   CREATE TABLE IF NOT EXISTS patient_history (
     id             INT AUTO_INCREMENT PRIMARY KEY,
     name           VARCHAR(100),
     age            VARCHAR(10),
     gender         VARCHAR(20),
     bp             VARCHAR(20),
     sugar          DOUBLE,
     heart_rate     DOUBLE,
     temperature    DOUBLE,
     spo2           DOUBLE,
     symptoms       VARCHAR(500),
     disease        VARCHAR(150),
     health_score   INT,
     risk_level     VARCHAR(20),
     confidence     INT,
     recorded_at    DATETIME,
     created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE IF NOT EXISTS users (
     id             INT AUTO_INCREMENT PRIMARY KEY,
     username       VARCHAR(50) UNIQUE NOT NULL,
     password       VARCHAR(100) NOT NULL   -- demo only: plain text.
                                             -- Use a hashed password (e.g. BCrypt) in production.
   );

   -- Demo login used by the frontend's fallback: admin / medassist123
   INSERT INTO users (username, password) VALUES ('admin', 'medassist123');
   ----------------------------------------------------------

   Deployment note: these servlets use @WebServlet annotations,
   which work out of the box on Tomcat 8.5+/9/10 without editing web.xml.
   ========================================================== */

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@WebServlet(name = "PatientServlet", urlPatterns = {"/api/savePatient", "/api/patientHistory"})
public class PatientServlet extends HttpServlet {

    private static final String DB_URL  = "jdbc:mysql://localhost:3306/medassist?useSSL=false&serverTimezone=UTC";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "your_password_here";

    @Override
    public void init() throws ServletException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new ServletException("MySQL JDBC driver not found on classpath", e);
        }
    }

    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
    }

    // -------------------------------------------------------
    // POST /api/savePatient
    // -------------------------------------------------------
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        Map<String, String> data = parseFlatJson(readBody(req));

        String sql = "INSERT INTO patient_history " +
                "(name, age, gender, bp, sugar, heart_rate, temperature, spo2, symptoms, " +
                "disease, health_score, risk_level, confidence, recorded_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, data.getOrDefault("name", ""));
            ps.setString(2, data.getOrDefault("age", ""));
            ps.setString(3, data.getOrDefault("gender", ""));
            ps.setString(4, data.getOrDefault("bp", ""));
            ps.setDouble(5, parseDoubleSafe(data.get("sugar")));
            ps.setDouble(6, parseDoubleSafe(data.get("heartRate")));
            ps.setDouble(7, parseDoubleSafe(data.get("temperature")));
            ps.setDouble(8, parseDoubleSafe(data.get("spo2")));
            ps.setString(9, data.getOrDefault("symptoms", ""));
            ps.setString(10, data.getOrDefault("disease", ""));
            ps.setInt(11, (int) parseDoubleSafe(data.get("healthScore")));
            ps.setString(12, data.getOrDefault("riskLevel", ""));
            ps.setInt(13, (int) parseDoubleSafe(data.get("confidence")));
            ps.setString(14, data.getOrDefault("timestamp", "").replace("T", " ").replace("Z", ""));

            ps.executeUpdate();

            resp.setStatus(HttpServletResponse.SC_OK);
            try (PrintWriter out = resp.getWriter()) { out.write("{\"status\":\"saved\"}"); }
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            try (PrintWriter out = resp.getWriter()) {
                out.write("{\"status\":\"error\",\"message\":\"" + escapeJson(e.getMessage()) + "\"}");
            }
        }
    }

    // -------------------------------------------------------
    // GET /api/patientHistory  -> last 20 records, chronological order
    // Includes vitals + symptoms so the frontend can render the
    // Vital Signs Trend Graph and Medical History Timeline.
    // -------------------------------------------------------
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        String sql = "SELECT name, health_score, risk_level, disease, heart_rate, temperature, " +
                "spo2, symptoms, recorded_at FROM patient_history ORDER BY id DESC LIMIT 20";

        StringBuilder json = new StringBuilder("[");
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            java.util.List<String> rows = new java.util.ArrayList<>();
            while (rs.next()) {
                String row = String.format(
                    "{\"name\":\"%s\",\"healthScore\":%d,\"riskLevel\":\"%s\",\"disease\":\"%s\"," +
                    "\"heartRate\":%s,\"temperature\":%s,\"spo2\":%s,\"symptoms\":\"%s\",\"recordedAt\":\"%s\"}",
                    escapeJson(rs.getString("name")),
                    rs.getInt("health_score"),
                    escapeJson(rs.getString("risk_level")),
                    escapeJson(rs.getString("disease")),
                    rs.getDouble("heart_rate"),
                    rs.getDouble("temperature"),
                    rs.getDouble("spo2"),
                    escapeJson(rs.getString("symptoms")),
                    rs.getString("recorded_at")
                );
                rows.add(row);
            }
            java.util.Collections.reverse(rows);
            boolean first = true;
            for (String row : rows) {
                if (!first) json.append(",");
                json.append(row);
                first = false;
            }
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            json = new StringBuilder("{\"status\":\"error\",\"message\":\"" + escapeJson(e.getMessage()) + "\"}");
        }
        json.append("]");

        try (PrintWriter out = resp.getWriter()) { out.write(json.toString()); }
    }

    // ---------------- Shared helpers ----------------
    private String readBody(HttpServletRequest req) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);
        }
        return sb.toString();
    }

    private Map<String, String> parseFlatJson(String json) {
        Map<String, String> map = new HashMap<>();
        if (json == null || json.isEmpty()) return map;
        Pattern pattern = Pattern.compile("\"(\\w+)\"\\s*:\\s*(\"(?:[^\"\\\\]|\\\\.)*\"|[-0-9.]+)");
        Matcher matcher = pattern.matcher(json);
        while (matcher.find()) {
            String key = matcher.group(1);
            String value = matcher.group(2);
            if (value.startsWith("\"") && value.endsWith("\"")) {
                value = value.substring(1, value.length() - 1).replace("\\\"", "\"");
            }
            map.put(key, value);
        }
        return map;
    }

    private double parseDoubleSafe(String s) {
        if (s == null || s.isEmpty()) return 0.0;
        try { return Double.parseDouble(s); } catch (NumberFormatException e) { return 0.0; }
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}


/* ==========================================================
   LoginServlet - handles POST /api/login
   Kept in this same file (package-private class) so the project
   still ships as a single PatientServlet.java file alongside
   index.html and script.js, as requested.
   ========================================================== */
@WebServlet(name = "LoginServlet", urlPatterns = {"/api/login"})
class LoginServlet extends HttpServlet {

    private static final String DB_URL  = "jdbc:mysql://localhost:3306/medassist?useSSL=false&serverTimezone=UTC";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "your_password_here";

    @Override
    public void init() throws ServletException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new ServletException("MySQL JDBC driver not found on classpath", e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);
        }

        Map<String, String> data = parseFlatJson(sb.toString());
        String username = data.getOrDefault("username", "");
        String password = data.getOrDefault("password", "");

        String sql = "SELECT id FROM users WHERE username = ? AND password = ?";
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, username);
            ps.setString(2, password);
            try (ResultSet rs = ps.executeQuery()) {
                boolean found = rs.next();
                try (PrintWriter out = resp.getWriter()) {
                    out.write(found ? "{\"status\":\"ok\"}" : "{\"status\":\"fail\"}");
                }
            }
        } catch (SQLException e) {
            // DB not reachable/configured - let the frontend fall back to its
            // own demo credential check rather than hard-failing the login.
            resp.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            try (PrintWriter out = resp.getWriter()) {
                out.write("{\"status\":\"error\",\"message\":\"" + e.getMessage().replace("\"", "'") + "\"}");
            }
        }
    }

    private Map<String, String> parseFlatJson(String json) {
        Map<String, String> map = new HashMap<>();
        if (json == null || json.isEmpty()) return map;
        Pattern pattern = Pattern.compile("\"(\\w+)\"\\s*:\\s*(\"(?:[^\"\\\\]|\\\\.)*\"|[-0-9.]+)");
        Matcher matcher = pattern.matcher(json);
        while (matcher.find()) {
            String key = matcher.group(1);
            String value = matcher.group(2);
            if (value.startsWith("\"") && value.endsWith("\"")) {
                value = value.substring(1, value.length() - 1).replace("\\\"", "\"");
            }
            map.put(key, value);
        }
        return map;
    }
}
