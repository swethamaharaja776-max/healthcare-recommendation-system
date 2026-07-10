let probChart, trendChart;

document.addEventListener('DOMContentLoaded', () => {
    probChart = new Chart(document.getElementById('probabilityChart').getContext('2d'), {
        type: 'bar',
        data: { labels: ['Confidence'], datasets: [{ label: 'Percentage', data: [0], backgroundColor: '#1565c0' }] }
    });
    trendChart = new Chart(document.getElementById('trendChart').getContext('2d'), {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Trend', data: [], borderColor: '#00897b', fill: false }] }
    });
});

async function analyzeHealth() {
    const symp = document.getElementById('symptom').value;
    
    try {
        const response = await fetch('http://localhost:8080/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptom: symp })
        });

        if (!response.ok) throw new Error('Backend error');
        const data = await response.json();

        // UI Updates
        document.getElementById('disease').innerText = data.disease;
        document.getElementById('confidence').innerText = data.confidence + "%";
        document.getElementById('recommend').innerText = data.recommendation;

        // Chart Updates
        probChart.data.datasets[0].data = [parseInt(data.confidence)];
        probChart.update();
        
        trendChart.data.labels.push(new Date().toLocaleTimeString());
        trendChart.data.datasets[0].data.push(parseInt(data.confidence));
        trendChart.update();
        
    } catch (e) {
        console.error(e);
        alert("Failed to analyze! Check if Spring Boot is running on port 8080.");
    }
}
