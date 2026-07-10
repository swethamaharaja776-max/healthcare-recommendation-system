let probChart, trendChart;

// Initialize Charts
document.addEventListener('DOMContentLoaded', () => {
    probChart = new Chart(document.getElementById('probabilityChart'), {
        type: 'bar',
        data: { labels: ['Confidence'], datasets: [{ label: 'Percentage', data: [0], backgroundColor: '#1565c0' }] }
    });
    trendChart = new Chart(document.getElementById('trendChart'), {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Score', data: [], borderColor: '#00897b' }] }
    });
});

async function analyzeHealth() {
    // 1. Get Values
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const symptom = document.getElementById('symptom').value;

    // 2. Update Report Section
    document.getElementById('rname').innerText = name || "--";
    document.getElementById('rage').innerText = age || "--";
    document.getElementById('rdate').innerText = new Date().toLocaleString();

    // 3. Call API
    const response = await fetch('http://localhost:8080/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptom: symptom })
    });
    const data = await response.json();

    // 4. Update Dashboard
    document.getElementById('disease').innerText = data.disease;
    document.getElementById('risk').innerText = data.risk;
    document.getElementById('confidence').innerText = data.confidence + "%";
    document.getElementById('recommend').innerText = data.recommendation;

    // 5. Update Charts
    probChart.data.datasets[0].data = [parseInt(data.confidence)];
    probChart.update();
}
