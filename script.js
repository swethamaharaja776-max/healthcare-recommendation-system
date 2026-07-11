/* ==========================================================
   AI MedAssist Pro - Client Logic (v2)
   Rule-based demo prediction engine (NOT a real diagnostic tool)
   ========================================================== */

const BACKEND_SAVE_URL = "/api/savePatient";
const BACKEND_HISTORY_URL = "/api/patientHistory";
const BACKEND_LOGIN_URL = "/api/login"; // kept for reference; not used in open demo-login mode

let selectedSymptoms = new Set();
let lastResult = null;
let probChartInstance = null;
let trendChartInstance = null;
let vitalsTrendChartInstance = null;
let avatarDataUrl = null;

// in-memory history (session only) - used if backend is unreachable
const sessionHistory = [];
const reminders = [];

/* ===================== LOGIN ===================== */
// Demo mode: any non-empty username + password is accepted.
// (No real backend check — this is intentionally open for project demo purposes.)
async function attemptLogin(username, password) {
  return username.trim().length > 0 && password.trim().length > 0;
}

document.getElementById("loginBtn").addEventListener("click", async () => {
  const u = document.getElementById("loginUser").value.trim();
  const p = document.getElementById("loginPass").value;
  const errEl = document.getElementById("loginError");
  const ok = await attemptLogin(u, p);
  if (ok) {
    document.getElementById("loginOverlay").style.display = "none";
  } else {
    errEl.textContent = "Please enter both a username and a password.";
  }
});

document.getElementById("guestBtn").addEventListener("click", () => {
  document.getElementById("loginOverlay").style.display = "none";
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  document.getElementById("loginOverlay").style.display = "flex";
  document.getElementById("loginUser").value = "";
  document.getElementById("loginPass").value = "";
  document.getElementById("loginError").textContent = "";
});

/* ===================== DARK / LIGHT MODE ===================== */
document.getElementById("darkModeToggle").addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light");
  document.getElementById("darkModeToggle").textContent = isLight ? "🌙 Dark Mode" : "☀ Light Mode";
});

/* ===================== AVATAR ===================== */
document.getElementById("avatarInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    avatarDataUrl = reader.result;
    document.getElementById("avatarPreview").src = avatarDataUrl;
  };
  reader.readAsDataURL(file);
});

/* ===================== BMI CALCULATOR ===================== */
function calcBMI() {
  const h = parseFloat(document.getElementById("p_height").value);
  const w = parseFloat(document.getElementById("p_weight").value);
  const out = document.getElementById("bmiResult");
  if (!h || !w) {
    out.textContent = "Enter height & weight to calculate BMI.";
    return null;
  }
  const meters = h / 100;
  const bmi = w / (meters * meters);
  let category, color;
  if (bmi < 18.5) { category = "Underweight"; color = "var(--amber)"; }
  else if (bmi < 25) { category = "Normal weight"; color = "var(--green)"; }
  else if (bmi < 30) { category = "Overweight"; color = "var(--amber)"; }
  else { category = "Obese"; color = "var(--coral)"; }
  out.innerHTML = `BMI: <b style="color:${color}">${bmi.toFixed(1)}</b> — ${category}`;
  return { bmi: Math.round(bmi * 10) / 10, category };
}
document.getElementById("p_height").addEventListener("input", calcBMI);
document.getElementById("p_weight").addEventListener("input", calcBMI);

/* ===================== SYMPTOM CHIPS ===================== */
document.querySelectorAll(".symptom-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const s = chip.dataset.symptom;
    if (selectedSymptoms.has(s)) { selectedSymptoms.delete(s); chip.classList.remove("active"); }
    else { selectedSymptoms.add(s); chip.classList.add("active"); }
  });
});

/* ===================== PREDICTION ENGINE ===================== */
const DISEASE_RULES = [
  { name: "Viral Fever", symptoms: ["Fever", "Headache", "Body Pain", "Fatigue"], recommendation: "Drink plenty of water, take proper rest and consult a doctor if fever continues beyond 3 days." },
  { name: "Common Cold", symptoms: ["Cough", "Sore Throat", "Fatigue"], recommendation: "Stay hydrated, take warm fluids, and rest. Usually resolves within a week." },
  { name: "Influenza (Flu)", symptoms: ["Fever", "Cough", "Body Pain", "Fatigue", "Headache"], recommendation: "Rest, stay hydrated, monitor temperature. See a doctor if breathing becomes difficult." },
  { name: "Migraine", symptoms: ["Headache", "Dizziness", "Nausea"], recommendation: "Rest in a dark quiet room, stay hydrated. Consult a doctor if headaches are frequent or severe." },
  { name: "Gastroenteritis", symptoms: ["Nausea", "Diarrhea", "Fatigue"], recommendation: "Maintain fluid and electrolyte intake, eat light food. See a doctor if symptoms persist over 2 days." },
  { name: "Possible Respiratory Distress", symptoms: ["Shortness of Breath", "Chest Pain", "Cough"], recommendation: "Seek immediate medical attention. Chest pain with breathing difficulty should be evaluated urgently." },
  { name: "Allergic Reaction", symptoms: ["Skin Rash", "Fatigue"], recommendation: "Avoid suspected allergens, use antihistamines if prescribed, consult a doctor if rash spreads." }
];

const LAB_TEST_MAP = {
  "Viral Fever": ["Complete Blood Count (CBC)", "Malaria/Dengue rapid test", "CRP"],
  "Common Cold": ["Not usually required", "Throat swab if symptoms persist"],
  "Influenza (Flu)": ["Influenza rapid antigen test", "CBC"],
  "Migraine": ["Usually clinical diagnosis", "MRI/CT if severe or unusual pattern"],
  "Gastroenteritis": ["Stool routine exam", "Electrolyte panel"],
  "Possible Respiratory Distress": ["Chest X-ray", "Pulse oximetry", "ECG", "Troponin (if chest pain)"],
  "Allergic Reaction": ["Allergy panel (IgE)", "Skin prick test"],
  "Non-specific Illness": ["Routine CBC", "Consult physician for tailored tests"]
};

const VITAL_RANGES = {
  temp:  { min: 30, max: 42.5, label: "Body Temperature (°C)" },
  hr:    { min: 30, max: 220,  label: "Heart Rate (BPM)" },
  spo2:  { min: 50, max: 100,  label: "SpO₂ (%)" },
  sugar: { min: 20, max: 600,  label: "Blood Sugar (mg/dL)" }
};

const EXTREME_THRESHOLDS = {
  tempHigh: 40, tempLow: 35, spo2Low: 92, hrHigh: 150, hrLow: 40,
  systolicHigh: 180, diastolicHigh: 120, systolicLow: 90
};

function parseBP(bpString) {
  const parts = (bpString || "").split("/").map(Number);
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
  return { systolic: parts[0], diastolic: parts[1] };
}

function computeHealthScore(v) {
  let score = 100;
  if (v.temp > 37.8) score -= Math.min(20, (v.temp - 37.8) * 8);
  if (v.temp < 36) score -= Math.min(25, (36 - v.temp) * 8);
  if (v.hr > 100 || v.hr < 55) score -= 10;
  if (v.spo2 < 95) score -= 15;
  if (v.sugar > 140 || v.sugar < 70) score -= 10;
  const bp = parseBP(v.bp);
  if (bp && (bp.systolic > 130 || bp.diastolic > 85)) score -= 10;
  score -= selectedSymptoms.size * 3;
  return Math.max(30, Math.round(score));
}

function riskFromScore(score) {
  if (score >= 80) return "Low";
  if (score >= 55) return "Moderate";
  return "High";
}

function validateVitals(vitals) {
  const errors = [];
  for (const key of ["temp", "hr", "spo2", "sugar"]) {
    const range = VITAL_RANGES[key];
    const val = vitals[key];
    if (val < range.min || val > range.max) {
      errors.push(`${range.label} of ${val} looks out of range (expected ${range.min}–${range.max}). Please recheck the value.`);
    }
  }
  return errors;
}

function isExtremeVitals(vitals) {
  const bp = parseBP(vitals.bp);
  const bpExtreme = bp && (
    bp.systolic >= EXTREME_THRESHOLDS.systolicHigh ||
    bp.diastolic >= EXTREME_THRESHOLDS.diastolicHigh ||
    bp.systolic <= EXTREME_THRESHOLDS.systolicLow
  );
  return (
    vitals.temp >= EXTREME_THRESHOLDS.tempHigh ||
    vitals.temp <= EXTREME_THRESHOLDS.tempLow ||
    vitals.spo2 <= EXTREME_THRESHOLDS.spo2Low ||
    vitals.hr >= EXTREME_THRESHOLDS.hrHigh ||
    vitals.hr <= EXTREME_THRESHOLDS.hrLow ||
    bpExtreme
  );
}

function matchDiseases(symptomSet) {
  return DISEASE_RULES.map(rule => {
    const overlap = rule.symptoms.filter(s => symptomSet.has(s)).length;
    const probability = symptomSet.size === 0 ? 0 : overlap / rule.symptoms.length;
    return { ...rule, probability };
  }).sort((a, b) => b.probability - a.probability);
}

function followUpSuggestion(risk) {
  const today = new Date();
  let days;
  if (risk === "High") days = 1;
  else if (risk === "Moderate") days = 3;
  else days = 14;
  const suggested = new Date(today);
  suggested.setDate(today.getDate() + days);
  const urgency = risk === "High" ? "as soon as possible (within 24 hours)" :
                   risk === "Moderate" ? "within the next 3 days if symptoms persist" :
                   "in about 2 weeks for a routine check, sooner if symptoms worsen";
  return `Suggested follow-up: ${urgency}. Target date: ${suggested.toLocaleDateString()}`;
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

  const validationErrors = validateVitals(vitals);
  if (validationErrors.length > 0) {
    alert("Please recheck these values before analyzing:\n\n" + validationErrors.join("\n"));
    return;
  }

  const extreme = isExtremeVitals(vitals);
  const ranked = matchDiseases(selectedSymptoms);
  const top = ranked[0].probability > 0 ? ranked[0] : {
    name: "Non-specific Illness",
    recommendation: "Monitor symptoms and consult a doctor if they worsen or persist.",
    probability: 0.3
  };

  let healthScore = computeHealthScore(vitals);
  let risk = riskFromScore(healthScore);
  let recommendation = top.recommendation;
  let confidence = Math.round(60 + top.probability * 35);

  if (extreme) {
    healthScore = Math.min(healthScore, 40);
    risk = "High";
    confidence = Math.max(confidence, 85);
    recommendation = "⚠ One or more vital signs are in a dangerous range. Seek immediate medical attention rather than relying on this app. " + top.recommendation;
  }

  const bmiInfo = calcBMI();

  lastResult = {
    name: document.getElementById("p_name").value || "Unnamed Patient",
    age: document.getElementById("p_age").value || "-",
    gender: document.getElementById("p_gender").value,
    vitals,
    bmi: bmiInfo,
    symptoms: Array.from(selectedSymptoms),
    disease: top.name,
    recommendation,
    healthScore,
    risk,
    confidence,
    ranked,
    extreme,
    avatar: avatarDataUrl,
    timestamp: new Date()
  };

  renderDashboard(lastResult);
}

function renderDashboard(r) {
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("reportCard").style.display = "block";

  document.getElementById("healthScore").textContent = r.healthScore;
  const riskWrap = document.getElementById("riskLevel");
  riskWrap.className = "num risk-badge " + (r.risk === "Low" ? "risk-low" : r.risk === "Moderate" ? "risk-moderate" : "risk-high");
  document.getElementById("riskText").textContent = r.risk;
  document.getElementById("aiConfidence").textContent = r.confidence + "%";

  document.getElementById("predictedDisease").textContent = r.disease;
  document.getElementById("recommendationText").textContent = r.recommendation;

  document.getElementById("followupText").textContent = followUpSuggestion(r.risk);

  const labList = document.getElementById("labTestList");
  labList.innerHTML = "";
  (LAB_TEST_MAP[r.disease] || LAB_TEST_MAP["Non-specific Illness"]).forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    labList.appendChild(li);
  });

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
    data: { labels, datasets: [{ label: "Match Probability (%)", data, backgroundColor: colors, borderRadius: 6 }] },
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
    <b>BMI:</b> ${r.bmi ? r.bmi.bmi + " (" + r.bmi.category + ")" : "N/A"}<br/>
    <b>Symptoms:</b> ${r.symptoms.join(", ")}<br/>
    <b>Vitals:</b> BP ${r.vitals.bp}, Sugar ${r.vitals.sugar} mg/dL, HR ${r.vitals.hr} bpm,
    Temp ${r.vitals.temp}°C, SpO₂ ${r.vitals.spo2}%<br/>
    <b>Health Score:</b> ${r.healthScore}/100 &nbsp; <b>Risk:</b> ${r.risk}<br/>
    <b>Predicted Condition:</b> ${r.disease} (${r.confidence}% confidence)<br/>
    <b>Recommendation:</b> ${r.recommendation}
  `;
}

/* ===================== BUTTONS ===================== */
document.getElementById("analyzeBtn").addEventListener("click", runAnalysis);

document.getElementById("resetBtn").addEventListener("click", () => {
  document.querySelectorAll("input").forEach(i => i.value = "");
  selectedSymptoms.clear();
  document.querySelectorAll(".symptom-chip").forEach(c => c.classList.remove("active"));
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("reportCard").style.display = "none";
  document.getElementById("bmiResult").textContent = "Enter height & weight to calculate BMI.";
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
    `BMI: ${r.bmi ? r.bmi.bmi + " (" + r.bmi.category + ")" : "N/A"}`,
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
    followUpSuggestion(r.risk),
    "",
    "Disclaimer: Demo rule-based tool, not a real medical diagnosis.",
    "Consult a licensed physician for actual medical concerns."
  ];
  lines.forEach(line => {
    if (Array.isArray(line)) { doc.text(line, 14, y); y += line.length * 6; }
    else { doc.text(String(line), 14, y); y += 7; }
  });
  doc.save(`${r.name.replace(/\s+/g, "_")}_report.pdf`);
});

document.getElementById("saveHistoryBtn").addEventListener("click", async () => {
  if (!lastResult) return;
  const statusEl = document.getElementById("saveStatus");
  statusEl.textContent = "Saving...";
  const payload = {
    name: lastResult.name, age: lastResult.age, gender: lastResult.gender,
    bp: lastResult.vitals.bp, sugar: lastResult.vitals.sugar, heartRate: lastResult.vitals.hr,
    temperature: lastResult.vitals.temp, spo2: lastResult.vitals.spo2,
    symptoms: lastResult.symptoms.join(","), disease: lastResult.disease,
    healthScore: lastResult.healthScore, riskLevel: lastResult.risk, confidence: lastResult.confidence,
    timestamp: lastResult.timestamp.toISOString()
  };

  try {
    const res = await fetch(BACKEND_SAVE_URL, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Server responded with " + res.status);
    statusEl.textContent = "✅ Saved to MySQL via PatientServlet.";
  } catch (err) {
    sessionHistory.push(payload);
    statusEl.textContent = "⚠ Backend not reachable, saved to session history only (" + err.message + ").";
  }
  updateTrendGraph();
  updateVitalsTrendGraph();
  updateHistoryTimeline();
});

/* ===================== TREND GRAPHS ===================== */
async function fetchHistory() {
  try {
    const res = await fetch(BACKEND_HISTORY_URL);
    if (res.ok) return await res.json();
  } catch (e) { /* fall through */ }
  return sessionHistory;
}

async function updateTrendGraph() {
  const history = await fetchHistory();
  if (!history || history.length === 0) return;
  document.getElementById("trendCard").style.display = "block";
  const labels = history.map((h, i) => `#${i + 1}`);
  const scores = history.map(h => h.healthScore);

  const ctx = document.getElementById("trendChart").getContext("2d");
  if (trendChartInstance) trendChartInstance.destroy();
  trendChartInstance = new Chart(ctx, {
    type: "line",
    data: { labels, datasets: [{ label: "Health Score Over Time", data: scores, borderColor: "#29c6b7", backgroundColor: "rgba(41,198,183,0.15)", tension: 0.35, fill: true, pointBackgroundColor: "#29c6b7" }] },
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

async function updateVitalsTrendGraph() {
  const history = await fetchHistory();
  if (!history || history.length === 0) return;
  document.getElementById("vitalsTrendCard").style.display = "block";
  const labels = history.map((h, i) => `#${i + 1}`);

  const ctx = document.getElementById("vitalsTrendChart").getContext("2d");
  if (vitalsTrendChartInstance) vitalsTrendChartInstance.destroy();
  vitalsTrendChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Heart Rate (BPM)", data: history.map(h => h.heartRate), borderColor: "#ff6b5b", tension: 0.3, fill: false },
        { label: "Temperature (°C)", data: history.map(h => h.temperature), borderColor: "#f2b84b", tension: 0.3, fill: false },
        { label: "SpO₂ (%)", data: history.map(h => h.spo2), borderColor: "#29c6b7", tension: 0.3, fill: false }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#eaf6f4" } } },
      scales: {
        y: { ticks: { color: "#9fc4bf" }, grid: { color: "#234444" } },
        x: { ticks: { color: "#9fc4bf" }, grid: { display: false } }
      }
    }
  });
}

async function updateHistoryTimeline() {
  const history = await fetchHistory();
  if (!history || history.length === 0) return;
  document.getElementById("historyCard").style.display = "block";
  const list = document.getElementById("historyTimeline");
  list.innerHTML = "";
  history.slice().reverse().forEach(h => {
    const li = document.createElement("li");
    const when = h.timestamp ? new Date(h.timestamp).toLocaleString() : (h.recordedAt || "");
    li.innerHTML = `<b>${h.name || "Patient"}</b> — ${h.disease || ""} (Score ${h.healthScore ?? "-"}, ${h.riskLevel || h.risk || ""}) <br/><span style="font-size:0.72rem;">${when}</span>`;
    list.appendChild(li);
  });
}

/* ===================== NEARBY HOSPITAL (DEMO) ===================== */
document.getElementById("hospitalBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        window.open(`https://www.google.com/maps/search/hospitals/@${latitude},${longitude},14z`, "_blank");
      },
      () => window.open("https://www.google.com/maps/search/hospitals+near+me", "_blank")
    );
  } else {
    window.open("https://www.google.com/maps/search/hospitals+near+me", "_blank");
  }
});

/* ===================== MEDICINE REMINDER (DEMO) ===================== */
document.getElementById("addReminderBtn").addEventListener("click", () => {
  const name = document.getElementById("medName").value.trim();
  const mins = parseFloat(document.getElementById("medMinutes").value);
  if (!name || !mins || mins <= 0) {
    alert("Enter a medicine name and a positive number of minutes.");
    return;
  }
  const fireAt = new Date(Date.now() + mins * 60000);
  reminders.push({ name, fireAt });
  renderReminders();

  setTimeout(() => {
    if (window.Notification && Notification.permission === "granted") {
      new Notification("Medicine Reminder", { body: `Time to take: ${name}` });
    } else {
      alert(`💊 Reminder: Time to take ${name}`);
    }
  }, mins * 60000);

  if (window.Notification && Notification.permission === "default") {
    Notification.requestPermission();
  }

  document.getElementById("medName").value = "";
  document.getElementById("medMinutes").value = "";
});

function renderReminders() {
  const list = document.getElementById("reminderList");
  list.innerHTML = "";
  reminders.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.name} — at ${r.fireAt.toLocaleTimeString()}`;
    list.appendChild(li);
  });
}

/* ===================== AI CHAT ASSISTANT ===================== */
const CHAT_RESPONSES = [
  { keys: ["fever"], reply: "For fever: rest, stay hydrated, and monitor temperature every few hours. See a doctor if it stays above 38.5°C for more than 2-3 days." },
  { keys: ["headache", "migraine"], reply: "Try resting in a dark, quiet room and staying hydrated. Frequent or severe headaches should be checked by a doctor." },
  { keys: ["diet", "food", "eat"], reply: "Favor light, easily digestible food (soups, fruits, whole grains) and plenty of fluids while recovering." },
  { keys: ["score", "health score"], reply: "Your Health Score reflects your vitals and symptoms — higher is better. It's a quick indicator, not a diagnosis." },
  { keys: ["risk"], reply: "Risk Level (Low/Moderate/High) estimates how urgently you may need medical attention based on your vitals and symptoms." },
  { keys: ["report", "pdf"], reply: "Click 'Download PDF Report' after analyzing to get a printable summary of your results." },
  { keys: ["doctor", "hospital", "emergency", "see a doctor"], reply: "If you have chest pain, severe shortness of breath, or symptoms feel severe, please seek in-person medical care immediately." },
  { keys: ["accurate", "accuracy"], reply: "This is a simple rule-based demo, not a trained medical AI model — treat predictions as a rough guide, not a diagnosis." },
  { keys: ["bmi"], reply: "BMI (Body Mass Index) estimates whether your weight is healthy for your height. It doesn't account for muscle mass or body composition." },
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

function sendChat(customText) {
  const input = document.getElementById("chatInput");
  const text = customText || input.value.trim();
  if (!text) return;
  appendChatMessage(text, "user");
  input.value = "";
  setTimeout(() => appendChatMessage(chatReply(text), "bot"), 400);
}

document.getElementById("chatSendBtn").addEventListener("click", () => sendChat());
document.getElementById("chatInput").addEventListener("keydown", e => { if (e.key === "Enter") sendChat(); });
document.querySelectorAll(".quick-q span").forEach(el => {
  el.addEventListener("click", () => sendChat(el.dataset.q));
});
