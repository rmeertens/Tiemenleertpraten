const scenarios = [
  {
    title: "Taalbegrip: rustige opdracht",
    child: "Noor, 5;1 jaar",
    state: "nieuwsgierig, snel afgeleid door materiaal",
    target: "Bied één korte opdracht neutraal aan, zonder extra uitleg of aanwijzing.",
    expected: "wijs de jongen aan die de bal geeft",
    instruction: "Zeg precies: “Wijs de jongen aan die de bal geeft.” Gebruik een rustig spreektempo en laat je stem niet helpen.",
    watch: ["geen extra woorden zoals kijk goed", "geen bevestigende intonatie", "niet herhalen tenzij de procedure dat toestaat"],
    childGood: "Noor wijst vlot naar één plaatje en kijkt daarna naar jou.",
    childUnsure: "Noor kijkt even naar de plaatjes, wijst aarzelend en vraagt: deze?",
  },
  {
    title: "Taalproductie: stimuluszin",
    child: "Milan, 4;8 jaar",
    state: "praat graag, vult snel zelf aan",
    target: "Bied de stimuluszin vloeiend aan en wacht daarna stil op de productie.",
    expected: "hier is een meisje dat een koekje pakt",
    instruction: "Zeg precies: “Hier is een meisje dat een koekje pakt.” Stop daarna. Geen voorzetje, geen verbetering.",
    watch: ["geen zin alvast afmaken voor het kind", "geen grammaticale correctie tijdens het item", "wel natuurlijke maar neutrale prosodie"],
    childGood: "Milan herhaalt de kern van de zin en maakt er zelf een kinderlijke zin van.",
    childUnsure: "Milan begint enthousiast, maar laat een deel van de zinsstructuur weg.",
  },
  {
    title: "Testsituatie: start en contact",
    child: "Sara, 5;6 jaar",
    state: "voorzichtig, wil eerst weten wat er gebeurt",
    target: "Maak de situatie veilig zonder inhoudelijk te trainen of de test voor te zeggen.",
    expected: "we gaan samen naar plaatjes kijken en ik zeg steeds wat je mag doen",
    instruction: "Zeg een korte, professionele startzin. Bijvoorbeeld: “We gaan samen naar plaatjes kijken en ik zeg steeds wat je mag doen.”",
    watch: ["wel geruststellen", "niet oefenen met testinhoud", "geen belofte dat alles goed is"],
    childGood: "Sara knikt, schuift dichter bij de tafel en kijkt naar het materiaal.",
    childUnsure: "Sara blijft stil, maar kijkt wel naar jou en wacht af.",
  },
  {
    title: "Zelfcorrectie: verspreking herstellen",
    child: "Ilyas, 6;0 jaar",
    state: "alert, merkt foutjes snel op",
    target: "Herstel professioneel na een verspreking en benoem later wat dit betekent voor scoring.",
    expected: "ik herstel dit item volgens de procedure en noteer dat ik me versprak",
    instruction: "Oefen je reflectiezin: “Ik herstel dit item volgens de procedure en noteer dat ik me versprak.”",
    watch: ["fout niet wegmoffelen", "impact op standaardisatie benoemen", "rustig blijven"],
    childGood: "Ilyas wacht rustig tot jij opnieuw structuur geeft.",
    childUnsure: "Ilyas zegt: huh? en kijkt naar het materiaal.",
  },
];

const forbiddenCues = [
  "goed zo",
  "heel goed",
  "kijk goed",
  "denk goed na",
  "deze",
  "nee",
  "bijna",
  "probeer nog eens",
  "ik help",
  "is het",
];

let current = 0;
let recognition = null;
let isRecording = false;

const scenario = document.querySelector("#scenario");
const childName = document.querySelector("#childName");
const childState = document.querySelector("#childState");
const targetText = document.querySelector("#targetText");
const watchList = document.querySelector("#watchList");
const itemTitle = document.querySelector("#itemTitle");
const instructionText = document.querySelector("#instructionText");
const transcript = document.querySelector("#transcript");
const recordBtn = document.querySelector("#recordBtn");
const recordState = document.querySelector("#recordState");
const checkBtn = document.querySelector("#checkBtn");
const childBtn = document.querySelector("#childBtn");
const resetBtn = document.querySelector("#resetBtn");
const nextItem = document.querySelector("#nextItem");
const childResponse = document.querySelector("#childResponse");
const feedbackList = document.querySelector("#feedbackList");

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[“”"'.?!,:;]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenOverlap(a, b) {
  const source = new Set(normalize(a).split(" ").filter(Boolean));
  const target = normalize(b).split(" ").filter(Boolean);
  if (!target.length) return 0;
  return target.filter((word) => source.has(word)).length / target.length;
}

function renderScenario() {
  const item = scenarios[current];
  scenario.value = String(current);
  childName.textContent = item.child;
  childState.textContent = item.state;
  targetText.textContent = item.target;
  itemTitle.textContent = item.title;
  instructionText.textContent = item.instruction;
  watchList.innerHTML = item.watch.map((point) => `<li>${point}</li>`).join("");
  childResponse.hidden = true;
  childResponse.textContent = "";
  feedbackList.innerHTML = "";
}

function fillScenarioOptions() {
  scenario.innerHTML = scenarios
    .map((item, index) => `<option value="${index}">${item.title}</option>`)
    .join("");
}

function feedback(type, title, body) {
  return `<div class="feedback-item feedback-item--${type}"><strong>${title}</strong><br>${body}</div>`;
}

function checkAnswer() {
  const item = scenarios[current];
  const text = transcript.value.trim();
  const clean = normalize(text);
  const overlap = tokenOverlap(clean, item.expected);
  const tooLong = clean.split(" ").filter(Boolean).length > normalize(item.expected).split(" ").length + 7;
  const cues = forbiddenCues.filter((cue) => clean.includes(cue));
  const hasQuestionHelp = /(\?|deze|dit plaatje|welke denk je)/i.test(text);
  const results = [];

  if (!text) {
    feedbackList.innerHTML = feedback("warn", "Nog geen aanbod", "Spreek of typ eerst wat je tegen het kind zou zeggen.");
    return;
  }

  if (overlap >= 0.86) {
    results.push(feedback("good", "Formulering", "Je aanbod ligt dicht bij de beoogde oefenzin. Dit helpt standaardisatie."));
  } else if (overlap >= 0.55) {
    results.push(feedback("warn", "Formulering", "De kern is herkenbaar, maar oefen op exact en kort formuleren. Kleine extra woorden kunnen al sturen."));
  } else {
    results.push(feedback("bad", "Formulering", "De oefenzin wijkt te veel af. Voor een ZG moet de aanbieding bijna automatisch en exact zijn."));
  }

  if (tooLong) {
    results.push(feedback("warn", "Bondigheid", "Je maakt de aanbieding vrij lang. Houd het item kort en voorkom extra uitleg."));
  } else {
    results.push(feedback("good", "Bondigheid", "Je houdt de aanbieding compact. Dat past bij een rustige testafname."));
  }

  if (cues.length || hasQuestionHelp) {
    results.push(feedback("bad", "Neutraliteit", `Let op mogelijke hulp/cue: ${[...new Set(cues)].join(", ") || "vraagvorm of aanwijzing"}. Tijdens scoring blijf je neutraal.`));
  } else {
    results.push(feedback("good", "Neutraliteit", "Ik hoor geen duidelijke hulpende cue. Blijf ook letten op intonatie en gezichtsuitdrukking."));
  }

  results.push(feedback("warn", "10-tip", "Oefen hierna hardop je verantwoording: wat deed je goed, welke fout zou de standaardisatie beïnvloeden, en hoe herstel je dat professioneel?"));
  feedbackList.innerHTML = results.join("");
}

function childReact() {
  const item = scenarios[current];
  const text = transcript.value.trim();
  const overlap = tokenOverlap(text, item.expected);
  const clean = normalize(text);
  const cueFound = forbiddenCues.some((cue) => clean.includes(cue));
  const response = overlap >= 0.7 && !cueFound ? item.childGood : item.childUnsure;

  childResponse.hidden = false;
  childResponse.textContent = response;

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.lang = "nl-NL";
    utterance.rate = 1.05;
    utterance.pitch = 1.25;
    window.speechSynthesis.speak(utterance);
  }
}

function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    recordBtn.disabled = true;
    recordState.textContent = "Spraakherkenning werkt niet in deze browser. Typ je antwoord in het tekstvak.";
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "nl-NL";
  recognition.interimResults = true;
  recognition.continuous = false;

  recognition.onstart = () => {
    isRecording = true;
    recordBtn.classList.add("is-recording");
    recordState.textContent = "Ik luister. Spreek je aanbieding rustig in.";
  };

  recognition.onresult = (event) => {
    const text = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join(" ");
    transcript.value = text;
  };

  recognition.onerror = () => {
    recordState.textContent = "Opname lukte niet. Typ je antwoord of probeer opnieuw.";
  };

  recognition.onend = () => {
    isRecording = false;
    recordBtn.classList.remove("is-recording");
    recordState.textContent = "Klaar. Controleer de transcriptie en vraag feedback.";
  };
}

recordBtn.addEventListener("click", () => {
  if (!recognition) return;
  if (isRecording) {
    recognition.stop();
  } else {
    recognition.start();
  }
});

scenario.addEventListener("change", (event) => {
  current = Number(event.target.value);
  renderScenario();
});

nextItem.addEventListener("click", () => {
  current = (current + 1) % scenarios.length;
  transcript.value = "";
  renderScenario();
});

checkBtn.addEventListener("click", checkAnswer);
childBtn.addEventListener("click", childReact);
resetBtn.addEventListener("click", () => {
  transcript.value = "";
  childResponse.hidden = true;
  feedbackList.innerHTML = "";
  recordState.textContent = recognition ? "Druk om je aanbieding in te spreken." : recordState.textContent;
});

fillScenarioOptions();
renderScenario();
setupSpeechRecognition();
