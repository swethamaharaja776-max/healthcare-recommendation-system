// 1. Declare global chart variables
let probChart;
let trendChart;

// 2. Initialize Charts when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const ctxProb = document.getElementById('probabilityChart').getContext('2d');
    const ctxTrend = document.getElementById('trendChart').getContext('2d');

    probChart = new Chart(ctxProb, {
        type: 'bar',
        data: {
            labels: ['Diagnosis'],
            datasets: [{ label: 'Confidence (%)', data: [0], backgroundColor: '#1565c0' }]
        }
    });

    trendChart = new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{ label: 'Confidence Trend', data: [], borderColor: '#00897b', fill: false }]
        }
    });
});

// 3. Main Logic
async function analyzeHealth() {
    try {
        // A. UI Updates
        document.getElementById('rname').innerText = document.getElementById('name').value;
        document.getElementById('rage').innerText = document.getElementById('age').value;
        document.getElementById('rgender').innerText = document.getElementById('gender').value;
        document.getElementById('rdate').innerText = new Date().toLocaleString();

        // B. API Call
        const response = await fetch('http://localhost:8080/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptom: document.getElementById('symptom').value })
        });

        if (!response.ok) throw new Error('Server unreachable');
        const data = await response.json();

        // C. Update Dashboard
        document.getElementById('disease').innerText = data.disease;
        document.getElementById('confidence').innerText = data.confidence;
        document.getElementById('recommend').innerText = data.recommendation;

        // D. Update Charts
        const conf = parseInt(data.confidence) || 0;
        
        // Update Bar Chart
        probChart.data.labels = [data.disease];
        probChart.data.datasets[0].data = [conf];
        probChart.update();

        // Update Line Chart
        trendChart.data.labels.push(new Date().toLocaleTimeString());
        trendChart.data.datasets[0].data.push(conf);
        trendChart.update();

    } catch (error) {
        console.error("Error:", error);
        alert("Failed to analyze. Check if Spring Boot is running on 8080!");
    }
}
