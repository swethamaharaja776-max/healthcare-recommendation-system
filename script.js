// 1. Initialize Global Chart Variables
let probabilityChart, trendChart;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize empty charts when page loads
    initCharts();
});

function initCharts() {
    const ctxProb = document.getElementById('probabilityChart').getContext('2d');
    const ctxTrend = document.getElementById('trendChart').getContext('2d');

    probabilityChart = new Chart(ctxProb, {
        type: 'bar',
        data: { labels: ['Diagnosis'], datasets: [{ label: 'Confidence (%)', data: [0], backgroundColor: '#1565c0' }] }
    });

    trendChart = new Chart(ctxTrend, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Health Score', data: [], borderColor: '#00897b', fill: true }] }
    });
}

// 2. Main Analysis Function
async function analyzeHealth() {
    // A. Update Patient Report Section
    document.getElementById('rname').innerText = document.getElementById('name').value || "--";
    document.getElementById('rage').innerText = document.getElementById('age').value || "--";
    document.getElementById('rgender').innerText = document.getElementById('gender').value || "--";
    document.getElementById('rdate').innerText = new Date().toLocaleString();

    // B. Call Backend
    const symptomText = document.getElementById('symptom').value;
    try {
        const response = await fetch('http://localhost:8080/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptom: symptomText })
        });
        const data = await response.json();

        // C. Update Dashboard
        document.getElementById('disease').innerText = data.disease;
        document.getElementById('recommend').innerText = data.recommendation;
        document.getElementById('risk').innerText = data.risk;
        document.getElementById('risk').className = `risk-badge risk-${data.risk.toLowerCase()}`;
        document.getElementById('confidence').innerText = data.confidence;

        // D. Update Charts
        updateCharts(data.disease, parseInt(data.confidence));
    } catch (err) {
        alert("Server error! Make sure Spring Boot is running.");
    }
}

function updateCharts(disease, conf) {
    // Update Bar Chart
    probabilityChart.data.labels = [disease];
    probabilityChart.data.datasets[0].data = [conf];
    probabilityChart.update();

    // Update Line Chart (Trend)
    trendChart.data.labels.push(new Date().toLocaleTimeString());
    trendChart.data.datasets[0].data.push(conf);
    trendChart.update();
}

// 3. Chat Assistant Functions
function toggleChat() {
    const msg = document.getElementById('chatMessages');
    const input = document.getElementById('chatInputRow');
    const isVisible = msg.style.display === 'block';
    msg.style.display = isVisible ? 'none' : 'block';
    input.style.display = isVisible ? 'none' : 'flex';
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const msgs = document.getElementById('chatMessages');
    if (!input.value) return;
    
    msgs.innerHTML += `<div class="chat-msg-user">${input.value}</div>`;
    input.value = "";
    
    setTimeout(() => {
        msgs.innerHTML += `<div class="chat-msg-bot">I am your AI assistant. Please consult a doctor for a professional medical diagnosis.</div>`;
        msgs.scrollTop = msgs.scrollHeight;
    }, 500);
}
