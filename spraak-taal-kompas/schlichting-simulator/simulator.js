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

const ageCases = [
  { birth: "2019-11-18", test: "2025-03-07" },
  { birth: "2020-02-29", test: "2025-02-28" },
  { birth: "2018-06-14", test: "2024-11-03" },
  { birth: "2021-09-25", test: "2026-04-10" },
  { birth: "2019-01-31", test: "2024-03-01" },
];

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
const birthDate = document.querySelector("#birthDate");
const testDate = document.querySelector("#testDate");
const ageYears = document.querySelector("#ageYears");
const ageMonths = document.querySelector("#ageMonths");
const ageDays = document.querySelector("#ageDays");
const startChoice = document.querySelector("#startChoice");
const checkAge = document.querySelector("#checkAge");
const newAgeCase = document.querySelector("#newAgeCase");
const ageOutput = document.querySelector("#ageOutput");

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

function parseDateInput(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function daysInPreviousMonth(year, monthIndex) {
  return new Date(year, monthIndex, 0).getDate();
}

function calculateAge(birth, test) {
  let years = test.getFullYear() - birth.getFullYear();
  let months = test.getMonth() - birth.getMonth();
  let days = test.getDate() - birth.getDate();
  const steps = [
    `Jaren: ${test.getFullYear()} - ${birth.getFullYear()} = ${years}.`,
    `Maanden: ${test.getMonth() + 1} - ${birth.getMonth() + 1} = ${months}.`,
    `Dagen: ${test.getDate()} - ${birth.getDate()} = ${days}.`,
  ];

  if (days < 0) {
    months -= 1;
    const borrowedDays = daysInPreviousMonth(test.getFullYear(), test.getMonth());
    days += borrowedDays;
    steps.push(`Dagen negatief? Leen 1 maand: +${borrowedDays} dagen, maanden -1.`);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
    steps.push("Maanden negatief? Leen 1 jaar: maanden +12, jaren -1.");
  }

  steps.push(`Leeftijd = ${years};${months};${days}. Spreek dit hardop uit als ${years} jaar, ${months} maanden en ${days} dagen.`);
  return { years, months, days, steps };
}

function startBand(age) {
  const totalMonths = age.years * 12 + age.months;
  if (totalMonths < 54) return "jong";
  if (totalMonths < 72) return "midden";
  return "oud";
}

function startBandLabel(value) {
  return {
    jong: "jonge startsectie",
    midden: "midden startsectie",
    oud: "oudere startsectie",
  }[value];
}

function renderAgeFeedback() {
  const birth = parseDateInput(birthDate.value);
  const test = parseDateInput(testDate.value);
  if (!birth || !test || test < birth) {
    ageOutput.innerHTML = `<div class="age-result age-result--warn"><strong>Check je datums.</strong><br>Vul een geboortedatum en latere testdatum in.</div>`;
    return;
  }

  const age = calculateAge(birth, test);
  const userYears = Number(ageYears.value);
  const userMonths = Number(ageMonths.value);
  const userDays = Number(ageDays.value);
  const ageCorrect = userYears === age.years && userMonths === age.months && userDays === age.days;
  const expectedBand = startBand(age);
  const chosenBand = startChoice.value;
  const startCorrect = chosenBand === expectedBand;
  const ageClass = ageCorrect ? "age-result--good" : "age-result--warn";
  const startClass = startCorrect ? "age-result--good" : "age-result--warn";

  ageOutput.innerHTML = `
    <div class="age-result ${ageClass}">
      <strong>${ageCorrect ? "Leeftijd klopt." : "Leeftijd nog niet helemaal."}</strong><br>
      Correct is: <strong>${age.years};${age.months};${age.days}</strong>.
      <ol class="age-steps">${age.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
    </div>
    <div class="age-result ${startClass}">
      <strong>${startCorrect ? "Startkeuze past bij deze oefenregel." : "Startkeuze bijstellen."}</strong><br>
      Voor deze oefentrainer hoort hierbij: <strong>${startBandLabel(expectedBand)}</strong>.
      In de echte afname controleer je altijd de officiële handleiding/casusregel.
    </div>
    <div class="age-result age-result--warn">
      <strong>Snelste tentamenstrategie</strong><br>
      Schrijf testdatum boven geboortedatum. Trek dagen, maanden, jaren af. Is dagen negatief:
      leen één maand. Is maanden negatief: leen één jaar. Zeg daarna direct:
      “Het kind is ${age.years} jaar en ${age.months} maanden; start daarom bij ... volgens de handleiding.”
    </div>
  `;
}

function loadNewAgeCase() {
  const item = ageCases[Math.floor(Math.random() * ageCases.length)];
  birthDate.value = item.birth;
  testDate.value = item.test;
  ageYears.value = "";
  ageMonths.value = "";
  ageDays.value = "";
  startChoice.value = "";
  ageOutput.innerHTML = "";
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

checkAge.addEventListener("click", renderAgeFeedback);
newAgeCase.addEventListener("click", loadNewAgeCase);

fillScenarioOptions();
renderScenario();
setupSpeechRecognition();
loadNewAgeCase();
