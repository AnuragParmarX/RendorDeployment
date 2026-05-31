const imageInput = document.getElementById("imageInput");
const dropZone = document.getElementById("dropZone");
const previewImage = document.getElementById("previewImage");
const previewPlaceholder = document.getElementById("previewPlaceholder");
const predictButton = document.getElementById("predictButton");
const resetButton = document.getElementById("resetButton");
const loadingState = document.getElementById("loadingState");
const statusMessage = document.getElementById("statusMessage");
const diseaseName = document.getElementById("diseaseName");
const causeText = document.getElementById("causeText");
const preventionText = document.getElementById("preventionText");
const treatmentText = document.getElementById("treatmentText");
const insightTabButtons = document.querySelectorAll(".insight-tab-btn");
const insightPanels = document.querySelectorAll(".insight-panel");

const diseaseGuidance = {
  "apple apple scab": {
    cause: "Apple scab is a fungal disease favored by cool, wet weather and infected fallen leaves.",
    prevention: "Prune for airflow, remove fallen leaves, and avoid overhead irrigation during long wet periods.",
    treatment:
      "Rake and discard infected leaves, prune crowded growth, and use labeled fungicides such as captan or sulfur during scab-prone weather."
  },
  "apple black rot": {
    cause: "Apple black rot survives in dead wood, mummified fruit, and cankers, then spreads during wet weather.",
    prevention: "Remove mummified fruit, prune out cankers, sanitize pruners, and keep the orchard floor clean.",
    treatment:
      "Prune out infected twigs and cankers, remove mummified fruit, and maintain a fungicide program that includes materials labeled for apple black rot."
  },
  "apple cedar apple rust": {
    cause: "This rust fungus alternates between apple and cedar or juniper hosts and infects during spring moisture.",
    prevention: "Keep nearby cedar or juniper hosts away when possible and monitor apples during spring infection periods.",
    treatment:
      "Remove nearby galls on cedar or juniper where practical, improve airflow, and apply preventive fungicides at the start of spring infection periods."
  },
  "cherry including sour powdery mildew": {
    cause: "Cherry powdery mildew is a fungal disease favored by humid canopy conditions and susceptible young tissue.",
    prevention: "Prune to open the canopy, manage root suckers, and maintain a preventive spray schedule in susceptible plantings.",
    treatment:
      "Remove heavily infected shoots, improve airflow, and apply protectant fungicides on time because existing mildew is hard to eradicate once established."
  },
  "corn maize cercospora leaf spot gray leaf spot": {
    cause: "Gray leaf spot survives in corn residue and spreads in warm, humid weather with extended leaf wetness.",
    prevention: "Use resistant hybrids, rotate crops, and reduce infected residue where pressure is high.",
    treatment:
      "Choose resistant hybrids, rotate away from corn when possible, and apply a labeled foliar fungicide if disease develops early and pressure is high."
  },
  "corn maize common rust": {
    cause: "Common rust is caused by airborne spores that infect corn during cool, wet, and humid conditions.",
    prevention: "Use tolerant hybrids and scout fields early, especially during cool weather with long dew periods.",
    treatment:
      "Most cases stay mild, but severe early infections should be managed with resistant hybrids and a labeled fungicide if the crop is still at a responsive stage."
  },
  "corn maize northern leaf blight": {
    cause: "Northern leaf blight overwinters in corn residue and spreads in moderate temperatures with persistent moisture.",
    prevention: "Rotate crops, manage residue, and plant resistant hybrids in fields with a disease history.",
    treatment:
      "Use resistant hybrids, rotate crops, and apply a labeled foliar fungicide early when lesions appear before major yield-forming stages."
  },
  "grape black rot": {
    cause: "Grape black rot survives in infected berries, canes, and tendrils, then infects foliage and clusters in wet weather.",
    prevention: "Prune out diseased canes, remove mummified berries, and keep vines open for faster drying.",
    treatment:
      "Remove mummified fruit and infected canes during pruning, protect clusters with timely fungicide sprays, and avoid allowing dense, wet canopies."
  },
  "grape esca black measles": {
    cause: "Esca is a grapevine trunk disease complex caused by wood-infecting fungi that weaken older vines.",
    prevention: "Protect pruning wounds, avoid unnecessary trunk injury, and maintain vine vigor to reduce stress.",
    treatment:
      "There is no reliable curative spray; prune out affected wood during dry weather, protect fresh pruning wounds, and remove severely declining vines when needed."
  },
  "grape leaf blight isariopsis leaf spot": {
    cause: "This grape leaf blight is a fungal disease that builds up in warm, wet conditions, especially in poorly protected vineyards.",
    prevention: "Keep the canopy open, remove infected leaves, and maintain regular vineyard sanitation and spray coverage.",
    treatment:
      "Improve canopy airflow, remove infected foliage where practical, and follow a labeled grape fungicide program to protect new growth."
  },
  "orange huanglongbing citrus greening": {
    cause: "Huanglongbing is a bacterial disease spread by Asian citrus psyllids and infected propagation material.",
    prevention: "Use certified clean planting stock, monitor psyllids closely, and keep trees as healthy as possible.",
    treatment:
      "There is no cure; control psyllid vectors, remove confirmed severely infected trees where advised, and support tree health with strong irrigation and nutrition management."
  },
  "peach bacterial spot": {
    cause: "Peach bacterial spot is favored by warm, wet, windy conditions and infections on young leaves and fruit.",
    prevention: "Choose less susceptible cultivars, reduce tree stress, and avoid practices that increase leaf wetness or abrasion.",
    treatment:
      "Use labeled bactericides such as low-rate copper or oxytetracycline where allowed, start sprays at the recommended cover period, and avoid excessive copper injury."
  },
  "pepper bell bacterial spot": {
    cause: "Pepper bacterial spot spreads through infected seed, transplants, splashing water, and field work in wet foliage.",
    prevention: "Use resistant varieties, clean seed or transplants, and avoid working plants when leaves are wet.",
    treatment:
      "Rogue badly infected plants, reduce overhead irrigation, and use labeled copper-based bactericides or other local recommendations as part of an integrated program."
  },
  "potato early blight": {
    cause: "Potato early blight is caused by Alternaria fungi that survive in debris and spread during warm, humid weather.",
    prevention: "Rotate crops, reduce leaf wetness, and remove infected plant residue after harvest.",
    treatment:
      "Remove badly infected foliage, rotate crops, reduce splash from soil, and apply labeled protectant fungicides if disease pressure continues."
  },
  "potato late blight": {
    cause: "Potato late blight is a fast-moving water mold disease favored by cool, wet conditions.",
    prevention: "Plant clean seed tubers, destroy volunteer potatoes and cull piles, and scout often during humid weather.",
    treatment:
      "Act immediately by removing infected plants or foliage, keep leaves dry, and apply approved late blight fungicides without delay."
  },
  "squash powdery mildew": {
    cause: "Squash powdery mildew is a fungal disease that spreads quickly on dense foliage in humid conditions.",
    prevention: "Space plants well, avoid excessive canopy density, and monitor older leaves early in the season.",
    treatment:
      "Remove badly affected leaves, improve airflow, and apply labeled sulfur, potassium bicarbonate, neem, or other cucurbit fungicides early."
  },
  "strawberry leaf scorch": {
    cause: "Strawberry leaf scorch is a fungal leaf disease that builds up on older plantings during warm weather and leaf wetness.",
    prevention: "Use clean transplants, renovate or replant older beds, and avoid prolonged leaf wetness.",
    treatment:
      "Remove infected debris, keep beds well spaced and dry, and use labeled strawberry fungicides before bloom where leaf diseases are a recurring problem."
  },
  "tomato bacterial spot": {
    cause: "Tomato bacterial spot spreads through infected seed, transplants, splashing water, and contact with wet foliage.",
    prevention: "Start with disease-free transplants, avoid overhead irrigation, and do not work plants while wet.",
    treatment:
      "Remove heavily infected leaves, limit splash irrigation, and use labeled copper-based bactericides with a protectant program as advised locally."
  },
  "tomato early blight": {
    cause: "Tomato early blight is a fungal disease that begins on lower foliage and intensifies with warm weather and leaf wetness.",
    prevention: "Mulch soil, stake plants, rotate crops, and prune lower leaves to reduce soil splash.",
    treatment:
      "Remove infected lower leaves early, keep foliage dry, improve airflow, and use labeled fungicides such as chlorothalonil or mancozeb when needed."
  },
  "tomato late blight": {
    cause: "Tomato late blight is a destructive water mold disease that spreads rapidly during cool, wet conditions.",
    prevention: "Use healthy transplants, avoid prolonged leaf wetness, and inspect plants frequently during favorable weather.",
    treatment:
      "Remove infected plants or leaves immediately, bag and discard diseased material, and begin approved late blight fungicide applications at once."
  },
    "tomato leaf mold": {
    cause: "Tomato leaf mold develops mainly in high humidity or greenhouse-like conditions with poor airflow.",
    prevention: "Ventilate growing areas, prune excess growth, and avoid letting humidity stay above disease-friendly levels.",
    treatment: "Increase ventilation, prune for better air movement, remove infected leaves, and rotate labeled fungicides if leaf mold keeps spreading."
  }
}; 

const defaultUnhealthyGuidance = {
    cause: "Likely disease pressure from pathogen exposure, plant stress, or unfavorable field conditions.",
    prevention: "Use clean planting material, improve airflow, avoid prolonged leaf wetness, and monitor crops regularly.",
    treatment: "Plant appears diseased. Isolate if necessary, monitor progression, and consult local agronomy guidance for targeted treatment."
};




let selectedFile = null;

function setStatus(message, type = "") {
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.className = "status-message";
  if (type) {
    statusMessage.classList.add(type);
  }
}

function normalizeText(rawValue) {
  if (typeof rawValue !== "string") return "Unknown";
  return rawValue
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeLookupKey(rawValue) {
  if (typeof rawValue !== "string") return "";
  return rawValue
    .replace(/_/g, " ")
    .replace(/[(),]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function parsePredictionLabel(rawLabel) {
  if (typeof rawLabel !== "string" || !rawLabel.trim()) {
    return {
      displayLabel: "Unknown",
      cause: defaultUnhealthyGuidance.cause,
      prevention: defaultUnhealthyGuidance.prevention,
      treatment: defaultUnhealthyGuidance.treatment
    };
  }

  const raw = rawLabel.trim();
  const hasClassSeparator = raw.includes("___");
  const [plantRaw, stateRaw] = hasClassSeparator ? raw.split("___") : ["", raw];

  const plantDisplay = plantRaw ? normalizeText(plantRaw) : "Plant";
  const stateDisplay = normalizeText(stateRaw);

  const fullLabelLookup = normalizeLookupKey(raw);
  const stateLookup = normalizeLookupKey(stateRaw);
  const isHealthy = stateLookup.includes("healthy");

  if (isHealthy) {
    return {
      displayLabel: hasClassSeparator ? `${plantDisplay} - Healthy` : stateDisplay,
      cause: `No active disease detected in ${plantDisplay}.`,
      prevention: "Continue routine crop hygiene, balanced nutrition, and periodic scouting to keep plants healthy.",
      treatment: `${plantDisplay} is healthy. Continue regular irrigation, nutrition, and routine monitoring.`
    };
  }

  const diseaseInfo = diseaseGuidance[fullLabelLookup] || diseaseGuidance[stateLookup] || defaultUnhealthyGuidance;

  return {
    displayLabel: hasClassSeparator ? `${plantDisplay} - ${stateDisplay}` : stateDisplay,
    cause: diseaseInfo.cause,
    prevention: diseaseInfo.prevention,
    treatment: diseaseInfo.treatment
  };
}

function updatePreview(file) {
  if (!previewImage || !previewPlaceholder) return;
  
  if (!file) {
    previewImage.removeAttribute("src");
    previewImage.style.display = "none";
    previewPlaceholder.style.display = "flex"; // Restores visibility on reset
    return;
  }

  const imageUrl = URL.createObjectURL(file);
  previewImage.src = imageUrl;
  previewImage.style.display = "block";
  previewPlaceholder.style.display = "none"; // Hides text cleanly upon upload
}

function updateResult(data) {
  const rawPrediction = data.prediction || data.disease || data.class || "Unknown";
  const parsedResult = parsePredictionLabel(rawPrediction);

  if (diseaseName) diseaseName.textContent = parsedResult.displayLabel;
  if (causeText) causeText.textContent = parsedResult.cause;
  if (preventionText) preventionText.textContent = parsedResult.prevention;
  if (treatmentText) treatmentText.textContent = parsedResult.treatment;
}

function resetUI() {
  selectedFile = null;
  if (imageInput) imageInput.value = "";
  updatePreview(null);
  setStatus("");

  if (diseaseName) diseaseName.textContent = "Awaiting image upload";
  if (causeText) causeText.textContent = "Upload an image and run a prediction to view probable cause.";
  if (preventionText) preventionText.textContent = "Upload an image and run a prediction to view prevention guidance.";
  if (treatmentText) treatmentText.textContent = "Upload an image and run a prediction to receive treatment guidance.";
  if (loadingState) loadingState.hidden = true;
}

function setActiveInsightTab(tabName) {
  insightTabButtons.forEach((button) => {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  insightPanels.forEach((panel) => {
    const isActive = panel.id === `panel-${tabName}`;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

function handleFileSelection(file) {
  // FIXED: Now safely reads file properties because we explicitly pass the first file index below
  if (!file || !file.type || !file.type.startsWith("image/")) {
    setStatus("Please select a valid image file.", "error");
    return;
  }

  selectedFile = file;
  updatePreview(file);
  setStatus(`Selected: ${file.name}`, "success");
}

async function predictDisease() {
  if (!selectedFile) {
    setStatus("Please upload an image before predicting.", "error");
    return;
  }

  const formData = new FormData();
  formData.append("image", selectedFile);

  if (loadingState) loadingState.hidden = false;
  if (predictButton) predictButton.disabled = true;
  setStatus("Sending image to detection API...");

  try {
    const response = await fetch("/predict", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const result = await response.json();
    updateResult(result);
    setStatus("Prediction completed successfully.", "success");

    const resultSection = document.getElementById("result");
    if (resultSection) {
      resultSection.scrollIntoView({ behavior: "smooth" });
    }
  } catch (error) {
    setStatus(`Prediction failed: ${error.message}`, "error");
    console.error("Prediction error:", error);
  } finally {
    if (loadingState) loadingState.hidden = true;
    if (predictButton) predictButton.disabled = false;
  }
}

// Attach event listeners safely
if (dropZone) {
  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add("is-dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.remove("is-dragover");
    });
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    // FIXED: Added [0] index to pull the raw file out of the dataTransfer array collection
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      handleFileSelection(event.dataTransfer.files[0]);
    }
  });
}

if (imageInput) {
  imageInput.addEventListener("change", (event) => {
    // FIXED: Added [0] index to pull the raw file out of the target files array collection
    if (event.target && event.target.files.length > 0) {
      handleFileSelection(event.target.files[0]);
    }
  });
}

if (predictButton) predictButton.addEventListener("click", predictDisease);
if (resetButton) resetButton.addEventListener("click", resetUI);

insightTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveInsightTab(button.dataset.tab);
  });
});

const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

// Run layout initialization safely
resetUI();
setActiveInsightTab("cause");
