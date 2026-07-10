async function analyzeHealth() {
    // ... unga munne irukura code ...
    
    // Server-kitta irunthu response vanthathukku appuram:
    const data = await response.json();
    
    // UI-la values set pannathukku appuram, charts-ah call pannunga:
    updateCharts(data.disease, data.confidence);
}

// Charts-ah update panna intha function-ah koda add pannunga:
function updateCharts(diseaseName, confidenceValue) {
    // Probability Chart (Bar)
    const probData = {
        labels: [diseaseName],
        datasets: [{
            label: 'Confidence (%)',
            data: [parseInt(confidenceValue)],
            backgroundColor: '#1565c0'
        }]
    };
    
    // Trend Chart (Line) - Ithu unga History-la irunthu eduthu update panna vendum
    // Ippo current analysis-ah mattum display panna:
    const trendData = {
        labels: ['Current Analysis'],
        datasets: [{
            label: 'Health Trend',
            data: [parseInt(confidenceValue)], 
            borderColor: '#00897b',
            fill: false
        }]
    };

    // Chart.js instance iruntha update pannum, illana create pannum
    new Chart(document.getElementById('probabilityChart'), { type: 'bar', data: probData });
    new Chart(document.getElementById('trendChart'), { type: 'line', data: trendData });
}
