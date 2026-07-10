// Global variables for charts
let probabilityChart, trendChart;

// Initialize Charts on Page Load
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    fetchHistoryData();
});

function initCharts() {
    const ctxProb = document.getElementById('probabilityChart').getContext('2d');
    const ctxTrend = document.getElementById('trendChart').getContext('2d');

    probabilityChart = new Chart(ctxProb, {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'Probability (%)', data: [], backgroundColor: '#1565c0' }] }
    });

    trendChart = new Chart(ctxTrend, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Health Score Trend', data: [], borderColor: '#00897b', fill: false }] }
    });
}

// Fetch data from your Spring Boot Backend
async function fetchHistoryData() {
    try {
        const response = await fetch('http://localhost:8080/api/history');
        const data = await response.json();
        
        // Process data for charts
        const labels = data.map(item => item.recordDate);
        const scores = data.map(item => parseInt(item.score) || 0);

        // Update Trend Graph
        trendChart.data.labels = labels.reverse();
        trendChart.data.datasets[0].data = scores.reverse();
        trendChart.update();
    } catch (error) {
        console.error("Error fetching history:", error);
    }
}

// Call this after analyzeHealth() returns result
function updateProbabilityChart(disease, confidence) {
    probabilityChart.data.labels = [disease];
    probabilityChart.data.datasets[0].data = [parseInt(confidence)];
    probabilityChart.update();
}
