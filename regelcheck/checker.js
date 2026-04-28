'use strict';

// ---------------------------------------------------------------------------
// SCENARIO-DATA
// Pas de rubric-inhoud hier aan als de exacte Schlichting-getallen afwijken.
// Elke 'synonyms' is een array van alternatieven. Het criterium is behaald
// als ÉÉN alternatief volledig in de tekst voorkomt (alle woorden aanwezig).
// ---------------------------------------------------------------------------

const SCENARIOS = [
  {
    id: 'instap',
    title: 'Instap',
    prompt: 'Leg de instap-procedure uit. Hoe bepaal je bij welk item je begint?',
    rubric: [
      {
        label: 'Leeftijd als criterium',
        synonyms: ['leeftijd', 'hoe oud', 'geboortedatum', 'leeftijdsgrens', 'leeftijdsgroep'],
        ok: 'Je noemt de leeftijd van het kind als uitgangspunt voor het startpunt.',
        mis: 'Noem dat de leeftijd van het kind bepaalt bij welk item je begint.',
      },
      {
        label: 'Startitem voor jonge kinderen (< 3;0 → item 1)',
        synonyms: ['item 1', 'item één', 'bij 1 beginnen', 'begin bij 1', 'eerste item', 'bij item 1'],
        ok: 'Je noemt item 1 als startpunt voor kinderen jonger dan 3;0.',
        mis: 'Voor kinderen jonger dan 3;0 jaar begin je bij item 1.',
      },
      {
        label: 'Startitem middengroep (3;0–3;11 → item 10)',
        synonyms: ['item 10', 'item tien', 'tiende item', 'bij 10', 'bij tien', 'bij item 10'],
        ok: 'Je noemt item 10 als startpunt voor 3- tot 4-jarigen.',
        mis: 'Voor kinderen van 3;0–3;11 jaar begin je bij item 10.',
      },
      {
        label: 'Startitem oudere kinderen (≥ 4;0 → item 20)',
        synonyms: ['item 20', 'item twintig', 'twintigste item', 'bij 20', 'bij twintig', 'bij item 20'],
        ok: 'Je noemt item 20 als startpunt voor kinderen van 4;0 jaar en ouder.',
        mis: 'Voor kinderen van 4;0 jaar en ouder begin je bij item 20.',
      },
    ],
  },
  {
    id: 'terugkeer',
    title: 'Terugkeer',
    prompt: 'Leg de terugkeer-procedure uit. Wanneer gebruik je hem en hoe voer je hem uit?',
    rubric: [
      {
        label: 'Trigger: eerste items niet allemaal goed',
        synonyms: [
          'eerste 3 niet', 'eerste drie niet', 'niet allemaal goed', 'startitems fout',
          'eerste items fout', 'begint met fouten', 'eerste 3 fout', 'eerste drie fout',
        ],
        ok: 'Je noemt wanneer terugkeer van toepassing is (eerste items niet allemaal goed).',
        mis: 'Beschrijf de trigger: terugkeer gebruik je als de eerste 3 items na je instap niet allemaal goed zijn.',
      },
      {
        label: 'Actie: teruggaan naar eerdere items',
        synonyms: [
          'terug naar', 'ga terug', 'stap terug', 'eerder item', 'lager item',
          'teruggaan', 'terugkeren naar', 'eerder niveau',
        ],
        ok: 'Je beschrijft dat je teruggaat naar eerdere items.',
        mis: 'Beschrijf de actie: je gaat terug naar eerdere (lagere) items.',
      },
      {
        label: 'Eindpunt: basisniveau (3 achter elkaar goed)',
        synonyms: [
          '3 achter elkaar', 'drie achter elkaar', '3 op rij goed', 'drie op rij goed',
          'basisniveau', '3 opeenvolgende', 'drie opeenvolgende', '3 achtereen goed',
        ],
        ok: 'Je noemt het eindpunt: 3 items achter elkaar goed = basisniveau bereikt.',
        mis: 'Noem het eindpunt van de terugkeer: 3 achter elkaar goed = basisniveau.',
      },
    ],
  },
  {
    id: 'afbreek',
    title: 'Afbreek',
    prompt: 'Wanneer stop je met de Schlichting-afname? Leg het afbreekcriterium uit.',
    rubric: [
      {
        label: 'Aantal: 5 fouten',
        synonyms: ['vijf', '5 fout', '5 items', 'vijf items', 'vijf fout', '5 keer'],
        ok: 'Je noemt het getal: 5 foute items.',
        mis: 'Noem het getal: je stopt na 5 foute items.',
      },
      {
        label: 'Aaneengesloten (achter elkaar)',
        synonyms: [
          'achter elkaar', 'opeenvolgend', 'op rij', 'na elkaar',
          'aaneengesloten', 'achtereen', 'zonder onderbreking',
        ],
        ok: 'Je benoemt dat het om aaneengesloten fouten gaat.',
        mis: 'Benadruk dat het 5 achtereenvolgende fouten zijn — niet 5 willekeurige.',
      },
    ],
  },
  {
    id: 'instructie',
    title: 'Instructie',
    prompt: 'Hoe geef je de instructie bij een item? Wat doe je als een kind niet reageert of het item niet begrijpt?',
    rubric: [
      {
        label: 'Model geven (voordoen)',
        synonyms: [
          'model', 'voordoen', 'voorbeeld geven', 'laat zien', 'demonstreer',
          'zeg voor', 'doe voor', 'voorzeggen',
        ],
        ok: 'Je noemt dat je een model geeft (voordoen).',
        mis: 'Beschrijf dat je een model aanbiedt: je doet het item één keer voor.',
      },
      {
        label: 'Maximaal één herhaling',
        synonyms: [
          'één keer', 'eenmalig', 'een keer herhalen', 'maximaal één', 'nog een keer',
          'één herhaling', '1 keer', 'eenmaal',
        ],
        ok: 'Je noemt dat je het model maximaal één keer herhaalt.',
        mis: 'Vermeld dat je het model maximaal eenmaal herhaalt — niet vaker.',
      },
      {
        label: 'Neutraal/aanmoedigend reageren (niet corrigeren)',
        synonyms: [
          'neutraal', 'aanmoedigen', 'niet corrigeren', 'niet verbeteren',
          'goed zo', 'positief', 'niet beoordelen',
        ],
        ok: 'Je noemt dat je neutraal en aanmoedigend reageert zonder te corrigeren.',
        mis: 'Reageer neutraal en aanmoedigend — corrigeer het kind niet tijdens de afname.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// KEYWORD-MATCHING
// ---------------------------------------------------------------------------

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"()\-–]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function textWords(normalizedText) {
  return normalizedText.split(' ');
}

function phraseMatches(words, phrase) {
  const phraseWords = phrase.toLowerCase().trim().split(/\s+/);
  return phraseWords.every(pw => words.includes(pw));
}

function criterionMet(words, synonyms) {
  return synonyms.some(phrase => phraseMatches(words, phrase));
}

function checkRubric(text, rubric) {
  const norm = normalize(text);
  const words = textWords(norm);
  return rubric.map(item => ({
    label: item.label,
    passed: criterionMet(words, item.synonyms),
    ok: item.ok,
    mis: item.mis,
  }));
}

// ---------------------------------------------------------------------------
// SPEECH RECOGNITION
// ---------------------------------------------------------------------------

let recognition = null;
let isRecording = false;

function setupSpeech() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    document.getElementById('rc-no-speech').hidden = false;
    document.getElementById('rc-mic').disabled = true;
    return;
  }

  recognition = new SR();
  recognition.lang = 'nl-NL';
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onresult = (e) => {
    let interim = '';
    let final = '';
    for (let i = 0; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) final += t;
      else interim += t;
    }
    const ta = document.getElementById('rc-transcript');
    ta.value = final || interim;
    ta.dataset.interim = final ? '' : '1';
    updateCheckBtn();
  };

  recognition.onend = () => {
    const ta = document.getElementById('rc-transcript');
    ta.dataset.interim = '';
    setRecording(false);
  };

  recognition.onerror = (e) => {
    setRecording(false);
    if (e.error !== 'no-speech' && e.error !== 'aborted') {
      setMicLabel('Fout: ' + e.error + '. Typ je antwoord.');
    }
  };
}

function toggleRecording() {
  if (!recognition) return;
  if (isRecording) {
    recognition.stop();
    return;
  }
  document.getElementById('rc-transcript').value = '';
  document.getElementById('rc-results').hidden = true;
  updateCheckBtn();
  try {
    recognition.start();
    setRecording(true);
  } catch {
    // recognition already started in another tab
  }
}

function setRecording(active) {
  isRecording = active;
  const btn = document.getElementById('rc-mic');
  btn.classList.toggle('rc-mic-btn--recording', active);
  btn.setAttribute('aria-label', active ? 'Stop opname' : 'Start opname');
  btn.setAttribute('title', active ? 'Stop' : 'Start spreken');
  setMicLabel(active ? 'Luistert… druk opnieuw om te stoppen' : 'Druk om te spreken');
}

function setMicLabel(text) {
  document.getElementById('rc-mic-label').textContent = text;
}

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

let activeId = SCENARIOS[0].id;

function renderTabs() {
  const container = document.getElementById('rc-tabs');
  container.innerHTML = '';
  SCENARIOS.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'mode-btn';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', s.id === activeId ? 'true' : 'false');
    btn.dataset.id = s.id;
    btn.textContent = s.title;
    btn.addEventListener('click', () => selectScenario(s.id));
    container.appendChild(btn);
  });
}

function selectScenario(id) {
  activeId = id;
  renderTabs();
  const s = SCENARIOS.find(x => x.id === id);
  document.getElementById('rc-prompt').textContent = s.prompt;
  resetInput();
}

function resetInput() {
  if (isRecording) recognition?.stop();
  const ta = document.getElementById('rc-transcript');
  ta.value = '';
  ta.dataset.interim = '';
  document.getElementById('rc-results').hidden = true;
  updateCheckBtn();
  setMicLabel('Druk om te spreken');
}

function updateCheckBtn() {
  const val = document.getElementById('rc-transcript').value.trim();
  document.getElementById('rc-check-btn').disabled = val.length < 3;
}

function runCheck() {
  const text = document.getElementById('rc-transcript').value.trim();
  if (!text) return;

  const s = SCENARIOS.find(x => x.id === activeId);
  const results = checkRubric(text, s.rubric);

  const container = document.getElementById('rc-results');
  container.hidden = false;
  container.innerHTML = '';

  let passCount = 0;
  results.forEach(r => {
    if (r.passed) passCount++;
    const div = document.createElement('div');
    div.className = 'rc-item rc-item--' + (r.passed ? 'ok' : 'mis');
    const icon = document.createElement('span');
    icon.className = 'rc-item__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = r.passed ? '✓' : '✗';
    const body = document.createElement('span');
    body.className = 'rc-item__body';
    const strong = document.createElement('strong');
    strong.textContent = r.label;
    const msg = document.createElement('span');
    msg.textContent = ' — ' + (r.passed ? r.ok : r.mis);
    body.appendChild(strong);
    body.appendChild(msg);
    div.appendChild(icon);
    div.appendChild(body);
    container.appendChild(div);
  });

  const score = document.createElement('p');
  score.className = 'rc-score';
  const allGood = passCount === results.length;
  score.innerHTML =
    'Score: <strong>' + passCount + ' / ' + results.length + '</strong>' +
    (allGood ? ' — Alles benoemd! 🎉' : ' — Probeer de gemiste punten erbij te noemen.');
  container.appendChild(score);

  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---------------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------------

function init() {
  setupSpeech();
  renderTabs();
  selectScenario(activeId);

  document.getElementById('rc-mic').addEventListener('click', toggleRecording);
  document.getElementById('rc-transcript').addEventListener('input', updateCheckBtn);
  document.getElementById('rc-check-btn').addEventListener('click', runCheck);
  document.getElementById('rc-wis-btn').addEventListener('click', resetInput);
}

document.addEventListener('DOMContentLoaded', init);
