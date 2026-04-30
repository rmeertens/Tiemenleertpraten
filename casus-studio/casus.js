const cases = [
  {
    title: "Noor, 4;8 jaar",
    facts: [
      ["Hulpvraag", "Ouders verstaan Noor slecht; leerkracht ziet weinig initiatief in de kring."],
      ["Observatie", "Noor spreekt graag, maar vereenvoudigt veel woorden en vermijdt langere zinnen."],
      ["Testbeeld", "Taalbegrip gemiddeld-laag; taalproductie onder gemiddeld. BI overlapt de grenszone."],
      ["Context", "Nederlandstalig gezin; gehoor recent voldoende bevonden."]
    ],
    sample: "koek → toek, gans → dans, ik wil de trein → ik wil de tein",
    example: {
      signals: "Leeftijd: Noor is 4;8 jaar, dus de spraak zou grotendeels verstaanbaar moeten zijn. Hulpvraag: ouders verstaan haar slecht. Observatie: fronting-achtige vervangingen, clusterreductie en vermijding van langere zinnen. Functioneren: impact in de kring en thuis.",
      diagnosis: "Differentiaaldiagnose: mijn voorlopige conclusie is een fonologische spraakontwikkelingsstoornis met mogelijke TOS/taalproductiezwakte. NT2 past niet bij deze casus. Fonetisch lijkt minder waarschijnlijk omdat klanken niet altijd motorisch onmogelijk lijken; VOD check ik bij inconsistente fouten en zoekend spreken.",
      scores: "Ik rapporteer niet alleen de puntscore, maar ook het betrouwbaarheidsinterval. Omdat het BI rond de grenszone ligt, combineer ik de normscore met observatie, verstaanbaarheid en participatie. Begrip en productie worden apart benoemd.",
      icf: "Functie: fonologische contrasten en zinsproductie zijn zwak. Activiteit: Noor kan woorden en zinnen minder duidelijk produceren. Participatie: meedoen in kringgesprek lukt minder. Omgeving: ouders en leerkracht hebben strategieen nodig.",
      therapy: "LT-doel: Noor is in dagelijkse situaties beter verstaanbaar en durft in de kring te spreken. KT-doel: Noor onderscheidt en produceert velair-alveolair contrast in minimale paren op woordniveau. Methode: fonologische aanpak met minimale paren/Metaphon, eerst perceptie dan productie. Therapievorm: direct met ouderinstructie. Duur: wekelijks, evaluatie na 8-10 weken. Samenwerking met leerkracht en ouders. Prognose voorzichtig gunstig door goed gehoor en motivatie."
    }
  },
  {
    title: "Yusuf, 6;2 jaar",
    facts: [
      ["Hulpvraag", "School twijfelt tussen NT2-problematiek en TOS."],
      ["Talen", "Thuis Turks en Nederlands; Nederlands vanaf peuterspeelzaal."],
      ["Testbeeld", "Nederlandse woordenschat laag; zinsbegrip wisselend. Ouders herkennen ook moeite in de thuistaal."],
      ["Context", "Communicatief sterk, maar raakt gefrustreerd bij instructies."]
    ],
    sample: "Vertelt korte verhalen met weinig verbanden; begrijpt lange klassikale instructies vaak niet.",
    example: {
      signals: "Leeftijd: Yusuf is 6;2 jaar. Hulpvraag: school twijfelt tussen NT2 en TOS. Observatie: problemen in instructiebegrip, woordenschat en narratieve samenhang. Functioneren: hij raakt gefrustreerd bij instructies. Belangrijk signaal is dat ouders ook in de thuistaal moeite herkennen.",
      diagnosis: "Ik maak differentiaaldiagnostiek tussen blootstellingsachterstand/NT2 en TOS. Alleen lage Nederlandse scores zijn onvoldoende voor TOS. Omdat er signalen in beide talen zijn, is TOS mogelijk; ik wil thuistaalanamnese, L1-informatie, gehoor en eventueel multidisciplinaire gegevens meenemen.",
      scores: "Normscores op Nederlandstalige tests interpreteer ik voorzichtig en noteer ik met beperkingen. Ik gebruik ruwe scores, observatie, procesdiagnostiek en BI. Ik vergelijk begrip en productie en kijk naar groei over tijd.",
      icf: "Functie: taalbegrip, woordenschat en verhaalopbouw zijn kwetsbaar. Activiteit: instructies volgen en verhalen navertellen kosten moeite. Participatie: Yusuf mist informatie in de klas. Omgeving: visuele steun, herhaling en thuistaalbetrokkenheid zijn nodig.",
      therapy: "LT-doel: Yusuf volgt klassikale instructies en vertelt begrijpelijker over gebeurtenissen. KT-doel: Yusuf vertelt met steun een verhaal met begin-midden-einde en gebruikt verbindingswoorden. Methode: taalstimulerende/narratieve therapie met scaffolding. Therapievorm: direct en indirect via ouders in de thuistaal. Duur: wekelijks met evaluatie na 10 weken. Samenwerking met leerkracht, ouders en eventueel audiologisch centrum. Prognose afhankelijk van groei en hardnekkigheid."
    }
  },
  {
    title: "Mila, 5;6 jaar",
    facts: [
      ["Hulpvraag", "Mila praat veel, maar gesprekken lopen vaak vast."],
      ["Observatie", "Ze wisselt abrupt van onderwerp en houdt weinig rekening met voorkennis."],
      ["Testbeeld", "Woordenschat en zinsbouw gemiddeld; ouders en leerkracht melden dagelijks communicatieproblemen."],
      ["Context", "Geen gehoorprobleem bekend; sociaal-emotionele ontwikkeling vraagt extra observatie."]
    ],
    sample: "Vertelt enthousiast, maar zonder context: 'En toen deed zij dat en toen was het daar!'",
    example: {
      signals: "Leeftijd: Mila is 5;6 jaar. Hulpvraag: gesprekken lopen vast. Observatie: abrupt wisselen van onderwerp, beperkte presuppositie en zwakke narratieve samenhang. Functioneren: ouders en leerkracht zien dagelijks communicatieproblemen.",
      diagnosis: "Differentiaaldiagnose: ik denk aan pragmatische taalproblematiek. TOS kan meespelen, maar structurele taalscores zijn gemiddeld. NT2 is niet de hoofdverklaring in deze casus. Omdat traditionele taaltests gemiddeld zijn, kijk ik naar ASS, sociaal-emotionele factoren, aandacht en bredere ontwikkeling.",
      scores: "Ik combineer testresultaten met ouder- en leerkrachtinformatie. De gemiddelde score krijgt betekenis naast observatie. Ik benoem dat testkwaliteit en BI belangrijk zijn, maar dat pragmatiek vooral contextueel onderzocht moet worden.",
      icf: "Functie: pragmatiek, presuppositie en narratieve organisatie. Activiteit: een begrijpelijk gesprek voeren is lastig. Participatie: contact met klasgenoten en kringgesprekken verlopen moeizaam. Omgeving: gesprekspartners moeten leren ondersteunen zonder over te nemen.",
      therapy: "LT-doel: Mila voert begrijpelijkere gesprekken met leeftijdsgenoten. KT-doel: Mila introduceert een onderwerp met voldoende context en houdt dit drie beurten vast. Methode: naturalistische pragmatiektherapie. Therapievorm: kindgericht met ouder/leerkrachtcoaching. Duur: wekelijks met evaluatie na 10 weken. Samenwerking met school en zo nodig psycholoog/orthopedagoog. Prognose redelijk als omgeving actief meedoet."
    }
  }
];

const rubric = [
  {
    title: "Signalen en beginsituatie",
    field: "signals",
    checks: ["leeftijd", "hulpvraag", "observatie", "functioneren"],
    tip: "Noem leeftijd, hulpvraag, observaties en dagelijks functioneren."
  },
  {
    title: "Differentiaaldiagnose",
    field: "diagnosis",
    checks: ["differentiaal", "tos", "nt2", "fonologisch", "fonetisch", "vod", "ass"],
    tip: "Weeg minstens twee verklaringen en benoem waarom iets wel of niet past."
  },
  {
    title: "Testinterpretatie",
    field: "scores",
    checks: ["normscore", "betrouwbaarheidsinterval", "bi", "begrip", "productie", "observatie"],
    tip: "Een 10-antwoord noemt score plus BI en koppelt dit aan observatie."
  },
  {
    title: "ICF-brug",
    field: "icf",
    checks: ["functie", "activiteit", "participatie", "omgeving"],
    tip: "Maak expliciet hoe een stoornis doorwerkt naar meedoen."
  },
  {
    title: "Behandelplan",
    field: "therapy",
    checks: ["lt", "kt", "doel", "methode", "therapievorm", "duur", "samenwerking", "prognose"],
    tip: "Koppel LT-doel, KT-doel, methode, vorm, duur, samenwerking en prognose aan de beginsituatie."
  }
];

const caseSelect = document.getElementById("caseSelect");
const caseTitle = document.getElementById("caseTitle");
const caseFacts = document.getElementById("caseFacts");
const caseSample = document.getElementById("caseSample");
const answerForm = document.getElementById("answerForm");
const results = document.getElementById("results");
const scoreLabel = document.getElementById("scoreLabel");
const scoreHint = document.getElementById("scoreHint");
const timer = document.getElementById("timer");
const timerToggle = document.getElementById("timerToggle");

let activeCase = 0;
let secondsLeft = 15 * 60;
let timerId = null;

function normalise(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function renderCase(index) {
  const current = cases[index];
  caseTitle.textContent = current.title;
  caseFacts.innerHTML = current.facts.map(([label, text]) => `
    <div class="case-fact">
      <strong>${label}</strong>
      <span>${text}</span>
    </div>
  `).join("");
  caseSample.textContent = current.sample;
  results.hidden = true;
  scoreLabel.textContent = "Nog niet nagekeken";
  scoreHint.textContent = "Vul je antwoord in en controleer op ZG-componenten.";
}

function updateTimer() {
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  timer.textContent = `${minutes}:${seconds}`;
}

function scoreField(text, checks) {
  const clean = normalise(text);
  const hits = checks.filter((check) => clean.includes(check));
  return {
    hits,
    points: Math.min(4, Math.round((hits.length / checks.length) * 4))
  };
}

function labelForScore(total) {
  if (total >= 18) return ["ZG-route", "Je antwoord bevat bijna alle 10-componenten. Maak het nu mondeling vloeiend."];
  if (total >= 14) return ["Goed", "Sterke basis. Vul de ontbrekende rubricpunten gericht aan."];
  if (total >= 10) return ["Voldoende in opbouw", "Je ziet de casus, maar mist nog klinische koppelingen."];
  return ["Nog trainen", "Ga terug naar Kompas en Regelcheck voor de ontbrekende denklijn."];
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const scored = rubric.map((item) => {
    const value = document.getElementById(item.field).value;
    return { ...item, ...scoreField(value, item.checks) };
  });
  const total = scored.reduce((sum, item) => sum + item.points, 0);
  const [label, hint] = labelForScore(total);
  scoreLabel.textContent = `${label} · ${total}/20`;
  scoreHint.textContent = hint;

  results.innerHTML = `
    <div class="rubric-summary">
      <h2>${label}: ${total}/20</h2>
      <p>${hint}</p>
    </div>
    ${scored.map((item) => `
      <article class="rubric-item ${item.points >= 3 ? "is-strong" : "is-missing"}">
        <span class="rubric-item__score">${item.points}</span>
        <div>
          <h3>${item.title}</h3>
          <p>${item.points >= 3 ? "Sterk aanwezig." : item.tip}</p>
          <p>Gevonden: ${item.hits.length ? item.hits.join(", ") : "nog niets herkenbaar"}</p>
        </div>
      </article>
    `).join("")}
  `;
  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("fillExample").addEventListener("click", () => {
  const example = cases[activeCase].example;
  Object.entries(example).forEach(([field, value]) => {
    document.getElementById(field).value = value;
  });
});

document.getElementById("clearAnswers").addEventListener("click", () => {
  answerForm.reset();
  results.hidden = true;
  scoreLabel.textContent = "Nog niet nagekeken";
  scoreHint.textContent = "Vul je antwoord in en controleer op ZG-componenten.";
});

timerToggle.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    timerToggle.textContent = "Start timer";
    return;
  }
  timerToggle.textContent = "Pauze";
  timerId = setInterval(() => {
    secondsLeft = Math.max(0, secondsLeft - 1);
    updateTimer();
    if (secondsLeft === 0) {
      clearInterval(timerId);
      timerId = null;
      timerToggle.textContent = "Opnieuw";
    }
  }, 1000);
});

caseSelect.addEventListener("change", () => {
  activeCase = Number(caseSelect.value);
  answerForm.reset();
  renderCase(activeCase);
});

cases.forEach((item, index) => {
  const option = document.createElement("option");
  option.value = index;
  option.textContent = item.title;
  caseSelect.append(option);
});

renderCase(activeCase);
updateTimer();
