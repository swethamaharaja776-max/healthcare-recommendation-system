// Global chart variables
let probabilityChart, trendChart;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
});

function initCharts() {
    const ctxProb = document.getElementById('probabilityChart').getContext('2d');
    const ctxTrend = document.getElementById('trendChart').getContext('2d');

    probabilityChart = new Chart(ctxProb, {
        type: 'bar',
        data: { labels: ['Disease'], datasets: [{ label: 'Confidence (%)', data: [0], backgroundColor: '#1565c0' }] }
    });

    trendChart = new Chart(ctxTrend, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Health Score', data: [], borderColor: '#00897b', fill: false }] }
    });
}

async function analyzeHealth() {
    // 1. Update Patient Report Section
    document.getElementById('rname').innerText = document.getElementById('name').value || "--";
    document.getElementById('rage').innerText = document.getElementById('age').value || "--";
    document.getElementById('rgender').innerText = document.getElementById('gender').value || "--";
    document.getElementById('rdate').innerText = new Date().toLocaleString();

    // 2. Fetch data from Spring Boot
    const symptom = document.getElementById('symptom').value;
    const response = await fetch('http://localhost:8080/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptom: symptom })
    });
    const data = await response.json();

    // 3. Update Dashboard
    document.getElementById('disease').innerText = data.disease;
    document.getElementById('recommend').innerText = data.recommendation;
    document.getElementById('risk').innerText = data.risk;
    document.getElementById('confidence').innerText = data.confidence;
    document.getElementById('score').innerText = "85/100"; // Example score

    // 4. Update Probability Chart
    const confVal = parseInt(data.confidence) || 0;
    probabilityChart.data.labels = [data.disease];
    probabilityChart.data.datasets[0].data = [confVal];
    probabilityChart.update();

    // 5. Update Trend Chart
    trendChart.data.labels.push(new Date().toLocaleTimeString());
    trendChart.data.datasets[0].data.push(85); 
    trendChart.update();
}

// AI Chat function
function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    if (chatInput.value.trim() === "") return;

    // Add user message
    messages.innerHTML += `<div class="chat-msg-user">${chatInput.value}</div>`;
    
    // Auto-reply logic
    setTimeout(() => {
        messages.innerHTML += `<div class="chat-msg-bot">I am an AI assistant. Based on your inputs, please consult a doctor for accurate diagnosis.</div>`;
        messages.scrollTop = messages.scrollHeight;
    }, 500);

    chatInput.value = "";
}

function toggleChat() {
    const msg = document.getElementById('chatMessages');
    const input = document.getElementById('chatInputRow');
    const isVisible = msg.style.display === 'block';
    msg.style.display = isVisible ? 'none' : 'block';
    input.style.display = isVisible ? 'none' : 'flex';
}
