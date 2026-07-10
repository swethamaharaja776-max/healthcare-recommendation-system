let probChart;

// சார்ட் உருவாக்க
document.addEventListener('DOMContentLoaded', () => {
    probChart = new Chart(document.getElementById('probabilityChart').getContext('2d'), {
        type: 'bar',
        data: { labels: ['Diagnosis'], datasets: [{ label: 'Confidence (%)', data: [0], backgroundColor: '#1565c0' }] }
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
        
        if (!response.ok) throw new Error("Server error");
        const data = await response.json();

        // UI-ஐ அப்டேட் செய்ய
        document.getElementById('disease').innerText = data.disease;
        document.getElementById('confidence').innerText = data.confidence + "%";
        document.getElementById('recommend').innerText = data.recommendation;

        // சார்ட்டை அப்டேட் செய்ய
        probChart.data.datasets[0].data = [parseInt(data.confidence)];
        probChart.update();
        
    } catch (e) {
        alert("Failed! Spring Boot சர்வர் '8080' போர்ட்டில் ரன் ஆகிறதா எனப் பார்க்கவும்.");
    }
}
