/* ==========================================================
   AI MedAssist Pro - Client Logic
   Rule-based demo prediction engine (NOT a real diagnostic tool)
   ========================================================== */

// Change this to your deployed servlet URL, e.g. "http://localhost:8080/medassist/save"
const BACKEND_SAVE_URL = "/api/savePatient";
const BACKEND_HISTORY_URL = "/api/patientHistory";

let selectedSymptoms = new Set();
let lastResult = null;
let probChartInstance = null;
let trendChartInstance = null;

// in-memory history (session only) - used if backend is unreachable
const sessionHistory = [];

// ---------- Symptom chip toggling ----------
document.querySelectorAll(".symptom-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const s = chip.dataset.symptom;
    if (selectedSymptoms.has(s)) {
      selectedSymptoms.delete(s);
      chip.classList.remove("active");
    } else {
      selectedSymptoms.add(s);
      chip.classList.add("active");
    }
  });
});

// ---------- Rule-based prediction engine ----------
// Each rule: symptoms it looks for, and how strongly it matches
const DISEASE_RULES = [
  {
    name: "Viral Fever",
    symptoms: ["Fever", "Headache", "Body Pain", "Fatigue"],
    baseRisk: "Moderate",
    recommendation: "Drink plenty of water, take proper rest and consult a doctor if fever continues beyond 3 days."
  },
  {
    name: "Common Cold",
    symptoms: ["Cough", "Sore Throat", "Fatigue"],
    baseRisk: "Low",
    recommendation: "Stay hydrated, take warm fluids, and rest. Usually resolves within a week."
  },
  {
    name: "Influenza (Flu)",
    symptoms: ["Fever", "Cough", "Body Pain", "Fatigue", "Headache"],
    baseRisk: "Moderate",
    recommendation: "Rest, stay hydrated, monitor temperature. See a doctor if breathing becomes difficult."
  },
  {
    name: "Migraine",
    symptoms: ["Headache", "Dizziness", "Nausea"],
    baseRisk: "Low",
    recommendation: "Rest in a dark quiet room, stay hydrated. Consult a doctor if headaches are frequent or severe."
  },
  {
    name: "Gastroenteritis",
    symptoms: ["Nausea", "Diarrhea", "Fatigue"],
    baseRisk: "Moderate",
    recommendation: "Maintain fluid and electrolyte intake, eat light food. See a doctor if symptoms persist over 2 days."
  },
  {
    name: "Possible Respiratory Distress",
    symptoms: ["Shortness of Breath", "Chest Pain", "Cough"],
    baseRisk: "High",
    recommendation: "Seek immediate medical attention. Chest pain with breathing difficulty should be evaluated urgently."
  },
  {
    name: "Allergic Reaction",
    symptoms: ["Skin Rash", "Fatigue"],
    baseRisk: "Low",
    recommendation: "Avoid suspected allergens, use antihistamines if prescribed, consult a doctor if rash spreads."
  }
];

function computeHealthScore(v) {
  let score = 100;
  if (v.temp > 37.8) score -= Math.min(20, (v.temp - 37.8) * 8);
  if (v.hr > 100 || v.hr < 55) score -= 10;
  if (v.spo2 < 95) score -= 15;
  if (v.sugar > 140 || v.sugar < 70) score -= 10;
  const bpParts = (v.bp || "").split("/").map(Number);
  if (bpParts.length === 2 && (bpParts[0] > 130 || bpParts[1] > 85)) score -= 10;
  score -= selectedSymptoms.size * 3;
  return Math.max(30, Math.round(score));
}

function riskFromScore(score) {
  if (score >= 80) return "Low";
  if (score >= 55) return "Moderate";
  return "High";
}

function matchDiseases(symptomSet) {
  const results = DISEASE_RULES.map(rule => {
    const overlap = rule.symptoms.filter(s => symptomSet.has(s)).length;
    const probability = symptomSet.size === 0 ? 0 : overlap / rule.symptoms.length;
    return { ...rule, probability };
  }).sort((a, b) => b.probability - a.probability);
  return results;
}

function runAnalysis() {
  const vitals = {
    temp: parseFloat(document.getElementById("p_temp").value) || 37,
    hr: parseFloat(document.getElementById("p_hr").value) || 75,
    spo2: parseFloat(document.getElementById("p_spo2").value) || 98,
    sugar: parseFloat(document.getElementById("p_sugar").value) || 90,
    bp: document.getElementById("p_bp").value || "120/80"
  };

  if (selectedSymptoms.size === 0) {
    alert("Please select at least one symptom before analyzing.");
    return;
  }

  const ranked = matchDiseases(selectedSymptoms);
  const top = ranked[0].probability > 0 ? ranked[0] : {
    name: "Non-specific Illness",
    recommendation: "Monitor symptoms and consult a doctor if they worsen or persist.",
    probability: 0.3
  };

  const healthScore = computeHealthScore(vitals);
  const risk = riskFromScore(healthScore);
  const confidence = Math.round(60 + top.probability * 35);

  lastResult = {
    name: document.getElementById("p_name").value || "Unnamed Patient",
    age: document.getElementById("p_age").value || "-",
    gender: document.getElementById("p_gender").value,
    vitals,
    symptoms: Array.from(selectedSymptoms),
    disease: top.name,
    recommendation: top.recommendation,
    healthScore,
    risk,
    confidence,
    ranked,
    timestamp: new Date()
  };

  renderDashboard(lastResult);
}

function renderDashboard(r) {
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("reportCard").style.display = "block";

  document.getElementById("healthScore").textContent = r.healthScore;
  const riskEl = document.getElementById("riskLevel");
  riskEl.textContent = r.risk;
  riskEl.className = "num " + (r.risk === "Low" ? "risk-low" : r.risk === "Moderate" ? "risk-moderate" : "risk-high");
  document.getElementById("aiConfidence").textContent = r.confidence + "%";

  document.getElementById("predictedDisease").textContent = r.disease;
  document.getElementById("recommendationText").textContent = r.recommendation;

  renderProbChart(r.ranked);
  renderReport(r);

  document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" });
}

function renderProbChart(ranked) {
  const top5 = ranked.slice(0, 5);
  const labels = top5.map(d => d.name);
  const data = top5.map(d => Math.round(d.probability * 100));
  const colors = data.map(v => v >= 60 ? "#ff6b5b" : v >= 30 ? "#f2b84b" : "#29c6b7");

  const ctx = document.getElementById("probChart").getContext("2d");
  if (probChartInstance) probChartInstance.destroy();
  probChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Match Probability (%)", data, backgroundColor: colors, borderRadius: 6 }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { color: "#9fc4bf" }, grid: { color: "#234444" } },
        x: { ticks: { color: "#9fc4bf" }, grid: { display: false } }
      }
    }
  });
}

function renderReport(r) {
  const el = document.getElementById("reportArea");
  el.innerHTML = `
    <b>Name:</b> ${r.name}<br/>
    <b>Age:</b> ${r.age} &nbsp; <b>Gender:</b> ${r.gender}<br/>
    <b>Date:</b> ${r.timestamp.toLocaleString()}<br/>
    <b>Symptoms:</b> ${r.symptoms.join(", ")}<br/>
    <b>Vitals:</b> BP ${r.vitals.bp}, Sugar ${r.vitals.sugar} mg/dL, HR ${r.vitals.hr} bpm,
    Temp ${r.vitals.temp}°C, SpO₂ ${r.vitals.spo2}%<br/>
    <b>Health Score:</b> ${r.healthScore}/100 &nbsp; <b>Risk:</b> ${r.risk}<br/>
    <b>Predicted Condition:</b> ${r.disease} (${r.confidence}% confidence)<br/>
    <b>Recommendation:</b> ${r.recommendation}
  `;
}

// ---------- Buttons ----------
document.getElementById("analyzeBtn").addEventListener("click", runAnalysis);

document.getElementById("resetBtn").addEventListener("click", () => {
  document.querySelectorAll("input").forEach(i => i.value = "");
  selectedSymptoms.clear();
  document.querySelectorAll(".symptom-chip").forEach(c => c.classList.remove("active"));
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("reportCard").style.display = "none";
  lastResult = null;
});

document.getElementById("printBtn").addEventListener("click", () => window.print());

document.getElementById("downloadPdfBtn").addEventListener("click", () => {
  if (!lastResult) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const r = lastResult;
  let y = 20;
  doc.setFontSize(16);
  doc.text("AI MedAssist Pro - Patient Report", 14, y); y += 10;
  doc.setFontSize(11);
  const lines = [
    `Name: ${r.name}`,
    `Age: ${r.age}    Gender: ${r.gender}`,
    `Date: ${r.timestamp.toLocaleString()}`,
    `Symptoms: ${r.symptoms.join(", ")}`,
    `Blood Pressure: ${r.vitals.bp}`,
    `Blood Sugar: ${r.vitals.sugar} mg/dL`,
    `Heart Rate: ${r.vitals.hr} BPM`,
    `Body Temperature: ${r.vitals.temp} °C`,
    `SpO2: ${r.vitals.spo2} %`,
    "",
    `Health Score: ${r.healthScore}/100`,
    `Risk Level: ${r.risk}`,
    `AI Confidence: ${r.confidence}%`,
    `Predicted Condition: ${r.disease}`,
    "",
    "Recommendation:",
    doc.splitTextToSize(r.recommendation, 180),
    "",
    "Disclaimer: Demo rule-based tool, not a real medical diagnosis.",
    "Consult a licensed physician for actual medical concerns."
  ];
  lines.forEach(line => {
    if (Array.isArray(line)) {
      doc.text(line, 14, y);
      y += line.length * 6;
    } else {
      doc.text(String(line), 14, y);
      y += 7;
    }
  });
  doc.save(`${r.name.replace(/\s+/g, "_")}_report.pdf`);
});

document.getElementById("saveHistoryBtn").addEventListener("click", async () => {
  if (!lastResult) return;
  const statusEl = document.getElementById("saveStatus");
  statusEl.textContent = "Saving...";
  const payload = {
    name: lastResult.name,
    age: lastResult.age,
    gender: lastResult.gender,
    bp: lastResult.vitals.bp,
    sugar: lastResult.vitals.sugar,
    heartRate: lastResult.vitals.hr,
    temperature: lastResult.vitals.temp,
    spo2: lastResult.vitals.spo2,
    symptoms: lastResult.symptoms.join(","),
    disease: lastResult.disease,
    healthScore: lastResult.healthScore,
    riskLevel: lastResult.risk,
    confidence: lastResult.confidence,
    timestamp: lastResult.timestamp.toISOString()
  };

  try {
    const res = await fetch(BACKEND_SAVE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Server responded with " + res.status);
    statusEl.textContent = "✅ Saved to MySQL via PatientServlet.";
  } catch (err) {
    // Fall back to session memory so the demo still works without a live backend
    sessionHistory.push(payload);
    statusEl.textContent = "⚠ Backend not reachable, saved to session history only (" + err.message + ").";
  }
  updateTrendGraph();
});

// ---------- Trend graph ----------
async function updateTrendGraph() {
  let history = sessionHistory;
  try {
    const res = await fetch(BACKEND_HISTORY_URL);
    if (res.ok) history = await res.json();
  } catch (e) {
    // use sessionHistory fallback
  }
  if (!history || history.length === 0) return;

  document.getElementById("trendCard").style.display = "block";
  const labels = history.map((h, i) => `#${i + 1}`);
  const scores = history.map(h => h.healthScore);

  const ctx = document.getElementById("trendChart").getContext("2d");
  if (trendChartInstance) trendChartInstance.destroy();
  trendChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Health Score Over Time",
        data: scores,
        borderColor: "#29c6b7",
        backgroundColor: "rgba(41,198,183,0.15)",
        tension: 0.35,
        fill: true,
        pointBackgroundColor: "#29c6b7"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#eaf6f4" } } },
      scales: {
        y: { min: 0, max: 100, ticks: { color: "#9fc4bf" }, grid: { color: "#234444" } },
        x: { ticks: { color: "#9fc4bf" }, grid: { display: false } }
      }
    }
  });
}

// ---------- AI Chat Assistant (simple keyword-based) ----------
const CHAT_RESPONSES = [
  { keys: ["fever"], reply: "For fever: rest, stay hydrated, and monitor temperature every few hours. See a doctor if it stays above 38.5°C for more than 2-3 days." },
  { keys: ["headache", "migraine"], reply: "Try resting in a dark, quiet room and staying hydrated. Frequent or severe headaches should be checked by a doctor." },
  { keys: ["diet", "food", "eat"], reply: "Favor light, easily digestible food (soups, fruits, whole grains) and plenty of fluids while recovering." },
  { keys: ["score", "health score"], reply: "Your Health Score reflects your vitals and symptoms — higher is better. It's a quick indicator, not a diagnosis." },
  { keys: ["risk"], reply: "Risk Level (Low/Moderate/High) estimates how urgently you may need medical attention based on your vitals and symptoms." },
  { keys: ["report", "pdf"], reply: "Click 'Download PDF Report' after analyzing to get a printable summary of your results." },
  { keys: ["doctor", "hospital", "emergency"], reply: "If you have chest pain, severe shortness of breath, or symptoms feel severe, please seek in-person medical care immediately." },
  { keys: ["hi", "hello", "hey"], reply: "Hello! Tell me your symptoms or ask about your report, and I'll do my best to help." }
];

function chatReply(text) {
  const lower = text.toLowerCase();
  const hit = CHAT_RESPONSES.find(r => r.keys.some(k => lower.includes(k)));
  if (hit) return hit.reply;
  return "I'm a simple rule-based assistant for this demo — for anything beyond general guidance, please consult a licensed doctor.";
}

function appendChatMessage(text, who) {
  const log = document.getElementById("chatLog");
  const div = document.createElement("div");
  div.className = "msg " + who;
  div.textContent = text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function sendChat() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;
  appendChatMessage(text, "user");
  input.value = "";
  setTimeout(() => appendChatMessage(chatReply(text), "bot"), 400);
}

document.getElementById("chatSendBtn").addEventListener("click", sendChat);
document.getElementById("chatInput").addEventListener("keydown", e => {
  if (e.key === "Enter") sendChat();
});
