let probChart, trendChart;

document.addEventListener('DOMContentLoaded', () => {
    // Canvas context-ai vanga '2d' nu kooda serthu koodunga
    const probCtx = document.getElementById('probabilityChart').getContext('2d');
    const trendCtx = document.getElementById('trendChart').getContext('2d');

    probChart = new Chart(probCtx, {
        type: 'bar',
        data: { 
            labels: ['Diagnosis'], 
            datasets: [{ label: 'Confidence (%)', data: [0], backgroundColor: '#1565c0' }] 
        },
        options: { responsive: true }
    });

    trendChart = new Chart(trendCtx, {
        type: 'line',
        data: { 
            labels: [], 
            datasets: [{ label: 'Trend', data: [], borderColor: '#00897b', fill: false }] 
        },
        options: { responsive: true }
    });
});

async function analyzeHealth() {
    const symp = document.getElementById('symptom').value;
    if (!symp) { alert("Please enter a symptom!"); return; }

    try {
        const response = await fetch('http://localhost:8080/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptom: symp })
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        // Update UI
        document.getElementById('disease').innerText = data.disease;
        document.getElementById('confidence').innerText = data.confidence + "%";
        document.getElementById('recommend').innerText = data.recommendation;

        // Update Bar Chart
        probChart.data.labels = [data.disease];
        probChart.data.datasets[0].data = [parseInt(data.confidence)];
        probChart.update();
        
        // Update Line Chart
        trendChart.data.labels.push(new Date().toLocaleTimeString());
        trendChart.data.datasets[0].data.push(parseInt(data.confidence));
        trendChart.update();
        
    } catch (e) {
        console.error("Error details:", e);
        alert("Failed to connect! Check if Spring Boot is running on 8080.");
    }
}
