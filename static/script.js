document.addEventListener("DOMContentLoaded", function () {

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("previewImage");

const predictBtn = document.getElementById("predictBtn");
const treatmentBtn = document.getElementById("treatmentBtn");

const diseaseName = document.getElementById("diseaseName");
const confidence = document.getElementById("confidence");
const statusBox = document.getElementById("status");

const loading = document.getElementById("loading");
const treatmentBox = document.getElementById("treatmentBox");

const uploadBtn = document.getElementById("uploadBtn");

let selectedFile = null;
let predictedDisease = "";


/* IMAGE PREVIEW */

imageInput.addEventListener("change", function(){

    selectedFile = imageInput.files[0];

    if(!selectedFile) return;

    const reader = new FileReader();

    reader.onload = function(e){
        preview.src = e.target.result;
        preview.style.display = "block";
    };

    reader.readAsDataURL(selectedFile);

});


/* PREDICT DISEASE */

predictBtn.addEventListener("click", async function(){

    if(!selectedFile){
        alert("Upload image first");
        return;
    }

    loading.innerText = "processing...";

    const formData = new FormData();
    formData.append("image", selectedFile);

    const response = await fetch("/predict",{
        method:"POST",
        body:formData
    });

    const data = await response.json();

    loading.innerText = "";

    predictedDisease = data.prediction;

    diseaseName.innerText = data.prediction;
    confidence.innerText = data.confidence + "%";
    statusBox.innerText = data.status;

});


/* ASK AGENT */

treatmentBtn.addEventListener("click", async function(){

    if(!predictedDisease){
        alert("Run prediction first");
        return;
    }

    treatmentBox.innerText = "Getting treatment...";

    const response = await fetch("/treatment",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            disease: predictedDisease
        })
    });

    const data = await response.json();

    treatmentBox.innerText = data.treatment;

});

uploadBtn.addEventListener("click", function(){
    imageInput.click();
});

});