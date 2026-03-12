document.addEventListener("DOMContentLoaded", function() {

    const imageInput = document.getElementById("imageInput");
    const preview = document.getElementById("previewImage");
    const predictBtn = document.getElementById("predictBtn");
    const prediction = document.getElementById("prediction");
    const treatmentBtn = document.getElementById("treatmentBtn");
    const treatmentBox = document.getElementById("treatmentBox");
    const loading = document.getElementById("loading") || document.createElement("p");

    let selectedFile = null;
    let predictedDisease = "";

    // Show preview
    imageInput.addEventListener("change", function() {
        selectedFile = imageInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) { preview.src = e.target.result; }
        reader.readAsDataURL(selectedFile);
    });

    // Predict disease
    predictBtn.addEventListener("click", async function() {

        if (!selectedFile) {
            alert("Please upload an image first");
            return;
        }

        // Show loading message
        loading.innerText = "Analyzing image...";

        // Clear previous prediction
        prediction.innerText = "";
        treatmentBox.innerText = "Waiting for prediction...";

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const response = await fetch("/predict", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            // Display result
            prediction.innerText =
            "Prediction: " + data.prediction +
            " | Confidence: " + data.confidence + "%" +
            " | Status: " + data.status;
            predictedDisease = data.prediction;

        } catch (err) {
            console.error(err);
            prediction.innerText = "Error predicting disease.";
        } finally {
            // Hide loading message
            loading.innerText = "";
        }
    });

    // Get treatment
    treatmentBtn.addEventListener("click", async function() {
        if(!predictedDisease){
            alert("Predict disease first!");
            return;
        }

        treatmentBox.innerText = "Getting treatment advice...";

        try {
            const response = await fetch("/treatment", {
                method:"POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({disease: predictedDisease})
            });

            const data = await response.json();
            treatmentBox.innerText = data.treatment;
        } catch(err) {
            console.error(err);
            treatmentBox.innerText = "Error getting treatment.";
        }
    });

});