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
  "orange haunglongbing citrus greening": {
    cause: "Huanglongbing is a bacterial disease spread by Asian citrus psyllids and infected propagation material.",
    prevention: "Use certified clean planting stock, monitor psyllids closely, and keep trees as healthy as possible.",
    treatment:
      "There is no cure; control psyllid vectors, remove confirmed severely infected trees where advised, and support tree health with strong irrigation and nutrition management."
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
    treatment:
      "Increase ventilation, prune for better air movement, remove infected leaves, and rotate labeled fungicides if leaf mold keeps spreading."
  },
  "tomato septoria leaf spot": {
    cause: "Tomato septoria survives on infected debris and spreads by rain splash and work in wet foliage.",
    prevention: "Remove lower leaves, mulch soil, rotate crops, and avoid overhead watering.",
    treatment:
      "Prune off infected lower foliage, keep leaves dry, and use labeled fungicides such as copper or chlorothalonil early in disease development."
  },
  "tomato spider mites two-spotted spider mite": {
    cause: "Two-spotted spider mites multiply quickly in hot, dry, dusty conditions and on water-stressed plants.",
    prevention: "Reduce dust, maintain even irrigation, and inspect the undersides of leaves regularly.",
    treatment:
      "Spray leaf undersides with water, use insecticidal soap or horticultural oil with full coverage, and shift to a labeled miticide if populations remain high."
  },
  "tomato target spot": {
    cause: "Tomato target spot is a fungal disease that intensifies with warm temperatures, long leaf wetness, and dense canopies.",
    prevention: "Widen spacing, prune lower growth, avoid over-fertilizing with nitrogen, and reduce overhead irrigation.",
    treatment:
      "Remove diseased lower leaves, improve canopy airflow, and use labeled fungicides on a regular schedule when weather favors target spot."
  },
  "tomato tomato yellow leaf curl virus": {
    cause: "TYLCV is a viral disease spread by whiteflies and infected plant material.",
    prevention: "Manage whiteflies early, use resistant varieties where available, and do not bring suspect transplants into the garden.",
    treatment:
      "There is no cure; bag and remove infected plants carefully to trap whiteflies, destroy them away from the garden, and focus on aggressive whitefly control."
  },
  "tomato tomato mosaic virus": {
    cause: "Tomato mosaic virus spreads by contaminated hands, tools, clothing, seed, and infected plant material.",
    prevention: "Disinfect tools often, avoid tobacco contact around plants, and remove suspect plants quickly.",
    treatment:
      "There is no curative treatment; remove infected plants promptly, disinfect hands and tools between plants, and use clean seed or resistant varieties next cycle."
  },
  "apple scab": {
    cause: "Fungal infection favored by prolonged moisture and cool, humid weather.",
    prevention: "Improve air circulation, prune dense canopy, and avoid overhead irrigation.",
    treatment:
      "Remove infected leaves, improve airflow, and apply a suitable fungicide program in wet periods."
  },
  "black rot": {
    cause: "Fungal pathogen spread through infected plant debris and wet foliage.",
    prevention: "Sanitize pruners, remove infected debris, and maintain proper spacing.",
    treatment:
      "Prune affected plant parts early, sanitize tools, and apply preventive fungicide where recommended."
  },
  "cedar apple rust": {
    cause: "Fungal disease cycling between apple hosts and nearby cedar or juniper hosts.",
    prevention: "Reduce alternate hosts nearby and monitor during spring infection periods.",
    treatment:
      "Remove alternate hosts where possible and apply preventive sprays during high-risk periods."
  },
  "powdery mildew": {
    cause: "Fungal spores thrive in humid environments with poor airflow.",
    prevention: "Keep canopy open, avoid overcrowding, and monitor early signs on leaves.",
    treatment:
      "Increase airflow, avoid overcrowding, and apply labeled sulfur or neem-based treatment as appropriate."
  },
  "cercospora leaf spot gray leaf spot": {
    cause: "Leaf fungal pathogens spread by rain splash and infected residue.",
    prevention: "Practice crop rotation, residue management, and use resistant varieties.",
    treatment:
      "Reduce leaf wetness, rotate crops, and use resistant varieties plus fungicide support if needed."
  },
  "common rust": {
    cause: "Airborne rust spores infect leaves under humid and moderate temperature conditions.",
    prevention: "Use tolerant varieties and monitor fields early for pustule development.",
    treatment:
      "Monitor spread and apply crop-safe fungicide when infection pressure is high and crop stage justifies it."
  },
  "northern leaf blight": {
    cause: "Fungal infection survives in crop residue and spreads in humid weather.",
    prevention: "Rotate crops, manage infected residue, and plant resistant hybrids.",
    treatment:
      "Use resistant hybrids, rotate crops, and apply fungicide early when lesions first appear."
  },
  "esca black measles": {
    cause: "Complex grapevine trunk disease associated with wood-infecting fungi.",
    prevention: "Protect pruning cuts, avoid trunk wounds, and maintain vine vigor.",
    treatment:
      "Prune infected wood during dry periods, protect pruning wounds, and improve vine stress management."
  },
  "leaf blight isariopsis leaf spot": {
    cause: "Fungal blight develops rapidly under warm, wet, and low-airflow conditions.",
    prevention: "Reduce canopy humidity and remove infected leaves from the field.",
    treatment:
      "Improve canopy airflow and moisture control, remove infected material, and follow local fungicide guidance."
  },
  "haunglongbing citrus greening": {
    cause: "Bacterial disease transmitted by Asian citrus psyllid insects.",
    prevention: "Control psyllid population and use certified disease-free planting material.",
    treatment:
      "Control psyllid vectors, remove severely infected trees, and follow integrated citrus greening management."
  },
  "huanglongbing citrus greening": {
    cause: "Bacterial disease transmitted by Asian citrus psyllid insects.",
    prevention: "Control psyllid population and use certified disease-free planting material.",
    treatment:
      "Control psyllid vectors, remove severely infected trees, and follow integrated citrus greening management."
  },
  "bacterial spot": {
    cause: "Bacterial infection spread by splashing water, tools, and infected seed or seedlings.",
    prevention: "Avoid overhead irrigation and start with clean seed or healthy transplants.",
    treatment:
      "Use disease-free seed or transplants, avoid overhead irrigation, and apply copper-based sprays where advised."
  },
  "early blight": {
    cause: "Fungal infection encouraged by warm temperatures and leaf wetness.",
    prevention: "Mulch soil, rotate crops, and avoid frequent leaf wetting.",
    treatment:
      "Remove lower infected leaves, rotate crops, mulch soil splash zones, and use fungicide preventively."
  },
  "late blight": {
    cause: "Aggressive oomycete disease spreading quickly in cool and moist conditions.",
    prevention: "Use clean seed stock, avoid water splash, and scout frequently in humid weather.",
    treatment:
      "Act quickly by removing infected plants, avoid leaf wetness, and apply approved blight fungicides immediately."
  },
  "leaf mold": {
    cause: "Fungal growth in high humidity and poorly ventilated crop canopy.",
    prevention: "Improve ventilation, reduce humidity, and prune dense foliage.",
    treatment:
      "Ventilate growing areas, reduce humidity, prune dense foliage, and apply targeted fungicide if needed."
  },
  "septoria leaf spot": {
    cause: "Fungal pathogen survives in debris and spreads via water splash.",
    prevention: "Remove infected lower leaves and avoid wetting foliage during irrigation.",
    treatment:
      "Remove infected leaves, avoid overhead watering, and apply protective fungicide during humid conditions."
  },
  "spider mites two-spotted spider mite": {
    cause: "Mite infestation worsens in hot, dry conditions and stressed plants.",
    prevention: "Maintain plant vigor, inspect undersides of leaves, and manage dust and drought stress.",
    treatment:
      "Increase humidity where possible, rinse undersides of leaves, and use miticides or insecticidal soap if required."
  },
  "target spot": {
    cause: "Fungal disease promoted by warm temperatures and extended leaf wetness.",
    prevention: "Provide wider spacing, improve drainage, and reduce splash irrigation.",
    treatment:
      "Improve airflow, reduce prolonged moisture, remove diseased debris, and use crop-specific fungicide support."
  },
  "tomato yellow leaf curl virus": {
    cause: "Viral disease spread by whiteflies from infected plants.",
    prevention: "Use whitefly management, reflective mulch, and resistant varieties.",
    treatment:
      "Control whiteflies aggressively, remove infected plants, and use resistant varieties for future cycles."
  },
  "tomato mosaic virus": {
    cause: "Viral infection transmitted by contaminated tools, hands, and plant material.",
    prevention: "Disinfect tools, avoid handling plants after tobacco exposure, and remove infected plants early.",
    treatment:
      "Remove infected plants, disinfect hands and tools, and avoid handling plants after tobacco exposure."
  },
  "leaf scorch": {
    cause: "Heat, moisture stress, nutrient imbalance, or secondary pathogen pressure.",
    prevention: "Keep irrigation and nutrient supply balanced and avoid severe plant stress.",
    treatment:
      "Maintain balanced irrigation and nutrition, remove badly affected leaves, and monitor stress conditions closely."
  }
};

const defaultUnhealthyGuidance = {
  cause: "Likely disease pressure from pathogen exposure, plant stress, or unfavorable field conditions.",
  prevention: "Use clean planting material, improve airflow, avoid prolonged leaf wetness, and monitor crops regularly.",
  treatment:
    "Plant appears diseased. Isolate if necessary, monitor progression, and consult local agronomy guidance for targeted treatment."
};

let selectedFile = null;

function setStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = "status-message";
  if (type) {
    statusMessage.classList.add(type);
  }
}

function normalizeText(rawValue) {
  if (typeof rawValue !== "string") {
    return "Unknown";
  }

  return rawValue
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeLookupKey(rawValue) {
  if (typeof rawValue !== "string") {
    return "";
  }

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
      prevention:
        "Continue routine crop hygiene, balanced nutrition, and periodic scouting to keep plants healthy.",
      treatment: `${plantDisplay} is healthy. Continue regular irrigation, nutrition, and routine monitoring.`
    };
  }

  const diseaseInfo =
    diseaseGuidance[fullLabelLookup] ||
    diseaseGuidance[stateLookup] ||
    defaultUnhealthyGuidance;
  return {
    displayLabel: hasClassSeparator ? `${plantDisplay} - ${stateDisplay}` : stateDisplay,
    cause: diseaseInfo.cause,
    prevention: diseaseInfo.prevention,
    treatment: diseaseInfo.treatment
  };
}

function updatePreview(file) {
  if (!file) {
    previewImage.removeAttribute("src");
    previewImage.style.display = "none";
    previewPlaceholder.hidden = false;
    return;
  }

  const imageUrl = URL.createObjectURL(file);
  previewImage.src = imageUrl;
  previewImage.style.display = "block";
  previewPlaceholder.hidden = true;
}

function updateResult(data) {
  const rawPrediction = data.prediction || data.disease || data.class || "Unknown";
  const parsedResult = parsePredictionLabel(rawPrediction);

  diseaseName.textContent = parsedResult.displayLabel;
  causeText.textContent = parsedResult.cause;
  preventionText.textContent = parsedResult.prevention;
  treatmentText.textContent = parsedResult.treatment;
}

function resetUI() {
  selectedFile = null;
  imageInput.value = "";
  updatePreview(null);
  setStatus("");
  diseaseName.textContent = "Awaiting image upload";
  causeText.textContent =
    "Upload an image and run a prediction to view probable cause.";
  preventionText.textContent =
    "Upload an image and run a prediction to view prevention guidance.";
  treatmentText.textContent =
    "Upload an image and run a prediction to receive treatment guidance.";
  loadingState.hidden = true;
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
  if (!file || !file.type.startsWith("image/")) {
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

  loadingState.hidden = false;
  predictButton.disabled = true;
  setStatus("Sending image to detection API...");

  try {
    const response = await fetch("/predict", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const result = await response.json();
    updateResult(result);
    setStatus("Prediction completed successfully.", "success");
    document.getElementById("result").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    setStatus(
      "Prediction failed. Make sure the backend API is running at http://127.0.0.1:5000/predict.",
      "error"
    );
    console.error("Prediction error:", error);
  } finally {
    loadingState.hidden = true;
    predictButton.disabled = false;
  }
}

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
  const file = event.dataTransfer.files[0];
  handleFileSelection(file);
});

imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  handleFileSelection(file);
});

predictButton.addEventListener("click", predictDisease);
resetButton.addEventListener("click", resetUI);
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
  {
    threshold: 0.14
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

resetUI();
setActiveInsightTab("cause");
