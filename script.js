function getRecommendation() {
    const symptom = document.getElementById("symptom").value;

    fetch("http://localhost:8080/recommend?symptom=" + encodeURIComponent(symptom))
        .then(response => response.text())
        .then(data => {
            document.getElementById("result").innerHTML = data;
        })
        .catch(error => {
            document.getElementById("result").innerHTML = "Server not running!";
            console.error(error);
        });
}
