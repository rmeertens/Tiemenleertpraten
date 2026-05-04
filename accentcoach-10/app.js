'use strict';

const data = window.ACCENT_DATA;
const state = {
  criterion: data.criteria[0],
  rhythm: data.rhythms[0],
  simulation: data.simulations[0],
  scores: JSON.parse(localStorage.getItem('accent_scores') || '{}'),
};

const views = document.querySelectorAll('.accent-view');
const tabs = document.querySelectorAll('.accent-tab');
const criterionSelect = document.getElementById('criterion-select');
const rhythmSelect = document.getElementById('rhythm-select');
const simulationAnswer = document.getElementById('simulation-answer');
const simulationFeedback = document.getElementById('simulation-feedback');
const speechNote = document.getElementById('speech-note');
const accentCoachInput = document.getElementById('accent-coach-input');
const accentCoachAnswer = document.getElementById('accent-coach-answer');

let recognition = null;
let recording = false;
let coachRecognition = null;
let coachRecording = false;

boot();

function boot() {
  renderOptions();
  bindEvents();
  renderAll();
}

function bindEvents() {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => showView(tab.dataset.view));
  });

  criterionSelect.addEventListener('change', () => {
    state.criterion = data.criteria.find(item => item.id === criterionSelect.value);
    renderCriterion();
  });

  rhythmSelect.addEventListener('change', () => {
    state.rhythm = data.rhythms.find(item => item.id === rhythmSelect.value);
    renderRhythm();
  });

  document.getElementById('mark-criterion').addEventListener('click', () => {
    state.scores[`criterion:${state.criterion.id}`] = 4;
    saveScores();
    renderEvidence();
  });

  document.getElementById('mark-rhythm').addEventListener('click', () => {
    state.scores[`rhythm:${state.rhythm.id}`] = 4;
    saveScores();
    renderEvidence();
  });

  document.getElementById('new-simulation').addEventListener('click', () => {
    state.simulation = randomItem(data.simulations);
    renderSimulation();
  });

  document.getElementById('check-simulation').addEventListener('click', checkSimulation);
  document.getElementById('clear-simulation').addEventListener('click', () => {
    simulationAnswer.value = '';
    speechNote.textContent = '';
  });
  document.getElementById('record-simulation').addEventListener('click', toggleRecording);
  document.getElementById('ask-accent-coach').addEventListener('click', answerAccentCoachQuestion);
  document.getElementById('record-accent-question').addEventListener('click', toggleCoachQuestionRecording);
  accentCoachInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') answerAccentCoachQuestion();
  });
}

function renderOptions() {
  criterionSelect.innerHTML = data.criteria.map(item => `<option value="${item.id}">${item.title}</option>`).join('');
  rhythmSelect.innerHTML = data.rhythms.map(item => `<option value="${item.id}">${item.title}</option>`).join('');
}

function renderAll() {
  renderRoute();
  renderSource();
  renderCriterion();
  renderRhythm();
  renderSimulation();
  renderHomework();
  renderEvidence();
}

function renderSource() {
  document.getElementById('theory-list').innerHTML = data.theory.map(([label, text]) => block(label, text)).join('');
  document.getElementById('checklist-list').innerHTML = data.checklists.map(([label, text]) => block(label, text)).join('');
  document.getElementById('text-examples').innerHTML = data.textExamples.map(([label, text]) => block(label, text)).join('');
}

function renderRoute() {
  document.getElementById('case-profile').innerHTML = data.caseProfile.map(([label, text]) => block(label, text)).join('');
  document.getElementById('daily-route').innerHTML = data.route.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  document.getElementById('power-lines').innerHTML = data.powerLines.map(line => `<p>${escapeHtml(line)}</p>`).join('');
}

function renderCriterion() {
  criterionSelect.value = state.criterion.id;
  document.getElementById('criterion-title').textContent = state.criterion.title;
  document.getElementById('criterion-detail').innerHTML = `
    ${block('Moet zichtbaar zijn', state.criterion.must.join(' '))}
    ${block('10-zin', state.criterion.model)}
  `;
  document.getElementById('criterion-fix').innerHTML = state.criterion.fix.map(item => block('Fix', item)).join('');
}

function renderRhythm() {
  rhythmSelect.value = state.rhythm.id;
  document.getElementById('rhythm-title').textContent = state.rhythm.title;
  document.getElementById('rhythm-detail').innerHTML = state.rhythm.detail.map(([label, text]) => block(label, text)).join('');
  document.getElementById('rhythm-errors').innerHTML = state.rhythm.errors.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function renderSimulation() {
  document.getElementById('simulation-title').textContent = state.simulation[0];
  document.getElementById('simulation-prompt').textContent = state.simulation[1];
  simulationFeedback.innerHTML = '<p class="accent-note">Nog geen simulatie nagekeken.</p>';
}

function renderHomework() {
  document.getElementById('homework-card').innerHTML = data.homework.map(([label, text]) => block(label, text)).join('');
  document.getElementById('feedback-trainer').innerHTML = data.feedbackExamples.map(([weakLabel, weak, strongLabel, strong]) => `
    <article>
      <strong>${escapeHtml(weakLabel)}</strong>
      <span>${escapeHtml(weak)}</span>
      <strong>${escapeHtml(strongLabel)}</strong>
      <p>${escapeHtml(strong)}</p>
    </article>
  `).join('');
}

function checkSimulation() {
  const answer = simulationAnswer.value.trim();
  if (!answer) {
    speechNote.textContent = 'Schrijf of spreek eerst je therapeuttekst in.';
    return;
  }

  const result = scoreAnswer(answer);
  state.scores[`simulation:${state.simulation[0]}`] = Math.max(state.scores[`simulation:${state.simulation[0]}`] || 0, result.score);
  saveScores();
  simulationFeedback.innerHTML = `
    <div class="accent-feedback-head">
      <h3>${escapeHtml(result.label)}</h3>
      <strong>${result.score}/4</strong>
    </div>
    ${block('Wat is sterk', result.good)}
    ${block('Wat kost punten', result.missing)}
    ${block('Volgende poging', result.next)}
  `;
  renderEvidence();
}

function scoreAnswer(answer) {
  const clean = normalize(answer);
  const hits = [
    ['doel', ['doel', 'minder belast', 'draagkracht', 'drukkerij', 'koor']],
    ['uitvoering', ['adem', 'stem', 'ritme', 'beweging', 'knie', 'kaak']],
    ['accentmethode', ['largo', 'allegro', 'andante', 'opmaat', 'zachte', 'offset', 'borstregister', 'vielluft']],
    ['client', ['wat merkte', 'hoe voelde', 'waar voelde', 'zelf', 'oogcontact']],
    ['feedback', ['let op', 'volgende', 'verbeter', 'compliment']],
    ['huiswerk', ['thuis', 'spiegel', 'audio', 'trommel', '3x', '10 minuten']],
    ['boekproof', ['onbeklemtoond', 'beklemtoond', 'buikwand', 'gedachteconcentratie', 'klinkerspraak']]
  ].filter(([, words]) => words.some(word => clean.includes(normalize(word))));
  const lengthPoint = answer.split(/\s+/).length >= 55 ? 1 : 0;
  const score = Math.min(4, Math.max(1, Math.round((hits.length + lengthPoint) / 1.8)));

  return {
    score,
    label: score >= 4 ? 'Toetswaardig sterk' : score >= 3 ? 'Voldoende, nog scherper' : 'Nog te vaag',
    good: hits.length ? `Je raakt deze toetsdelen: ${hits.map(([label]) => label).join(', ')}.` : 'Je tekst heeft nog te weinig herkenbare toetsdelen.',
    missing: missingFor(clean),
    next: score >= 4 ? 'Herhaal nu zonder tekst en met zichtbare beweging.' : 'Maak je antwoord concreter: wat zeg je, wat doe je, wat ziet Bernard, wat krijgt hij mee?'
  };
}

function missingFor(clean) {
  const missing = [];
  if (!clean.includes('kaak')) missing.push('kaakdaling');
  if (!clean.includes('zacht')) missing.push('zachte inzet/offset');
  if (!clean.includes('oogcontact')) missing.push('oogcontact');
  if (!clean.includes('buik')) missing.push('buikwand/recoil');
  if (!clean.includes('huiswerk') && !clean.includes('thuis')) missing.push('huiswerk');
  if (!clean.includes('wat merkte') && !clean.includes('hoe voelde')) missing.push('doorvragen bij cliënt');
  if (!clean.includes('knie') && !clean.includes('beweging')) missing.push('zichtbare beweging/non-verbaal');
  return missing.length ? `Voeg toe: ${missing.join(', ')}.` : 'Geen grote gaten; let nu vooral op timing en demonstratiekwaliteit.';
}

function answerAccentCoachQuestion() {
  const question = accentCoachInput.value.trim();
  if (!question) {
    accentCoachAnswer.innerHTML = '<p>Stel eerst je vraag. Bijvoorbeeld: “hoe leg ik Largo uit?” of “wat zeg ik bij huiswerk?”</p>';
    return;
  }

  const answer = buildAccentCoachAnswer(question);
  accentCoachAnswer.innerHTML = `
    <strong>${escapeHtml(answer.title)}</strong>
    <p>${escapeHtml(answer.body)}</p>
    <span>${escapeHtml(answer.action)}</span>
  `;
  if (answer.view) showView(answer.view);
}

function buildAccentCoachAnswer(question) {
  const clean = normalize(question);

  if (matches(clean, ['largo', 'ritme 1', '3/4', 'drie kwart'])) {
    return {
      title: 'Largo: eerst beweging, dan klank',
      body: 'Zeg kort: “We starten rustig. U beweegt mee: naar voren ademt u in, naar achteren laat u de klank op de uitademing meegaan.” Bewaak weke inzet, geen pauze, tweede en derde accent sterker en zachte afsluiting.',
      action: 'Actie: open Ritmes en oefen 5 minuten Largo met /f/ -> /v/ -> /oe/ zonder spiekposter.',
      view: 'ritmes'
    };
  }
  if (matches(clean, ['andante', 'ritme 2', '1/8', 'achtste'])) {
    return {
      title: 'Andante: rust en buikwandrecoil bewaken',
      body: 'De kern is 1/8 inademing, 1/8 onbeklemtoonde inzet en daarna drie gelijke accenten. Laat Bernard de buikwand direct laten terugveren; als dat niet lukt, is de adem-stemkoppeling nog niet veilig.',
      action: 'Actie: kies Andante bij Ritmes en spreek hardop de uitleg in cliënttaal uit.',
      view: 'ritmes'
    };
  }
  if (matches(clean, ['allegro', 'galop', 'snel', 'jachtig'])) {
    return {
      title: 'Allegro: dynamisch, maar niet jagen',
      body: 'Allegro is sneller, maar mag nooit hectisch worden. Denk aan verende knieën, gebogen armen, losse pols en een korte diepe inademing. Als Bernard gaat persen, verlaag je direct het tempo.',
      action: 'Actie: oefen de Allegro-simulatie en let alleen op tempo, opmaat en polsbeweging.',
      view: 'simulatie'
    };
  }
  if (matches(clean, ['tekst', 'tekstniveau', 'klinkerspraak', 'zin', 'zinnen'])) {
    return {
      title: 'Tekstniveau: eerst accentgroepen, dan natuurlijk spreken',
      body: 'Laat de cliënt eerst luisteren naar de accenten, daarna klinkerspraak imiteren en pas daarna de zin natuurlijk overbrengen. Leg weinig uit; de toets wil zien dat je oefent, voordoet en bewaakt.',
      action: 'Actie: open Bron en pak een korte zin zoals “we gaan naar huis”; doe hem eerst in klinkerspraak.',
      view: 'bron'
    };
  }
  if (matches(clean, ['harde offset', 'offset', 'afsluiting', 'tik', 'glottis', 'glottisslag'])) {
    return {
      title: 'Harde offset kost punten',
      body: 'Je moet horen en benoemen dat de klank zacht uitdooft. Zeg tegen Bernard: “Laat het einde wegsmelten, alsof u de keel niet dichtzet.” Daarna laat je direct opnieuw proberen.',
      action: 'Actie: ga naar Simulatie en oefen de prompt “Feedback na poging”.',
      view: 'simulatie'
    };
  }
  if (matches(clean, ['kaak', 'kaakdaling', 'mond', 'articulatie'])) {
    return {
      title: 'Kaakdaling moet zichtbaar zijn',
      body: 'De docent wil een ruime, ontspannen articulatie zien. Geef een korte non-verbale cue: demonstreer zelf een lossere kaak en laat Bernard imiteren, zonder lange uitleg.',
      action: 'Actie: oefen 5 minuten met /oe/ naar /o/ en benoem één specifieke verbetercue.',
      view: 'ritmes'
    };
  }
  if (matches(clean, ['huiswerk', 'thuis', 'oefenen', 'meegeven', 'transfer'])) {
    return {
      title: 'Huiswerk moet concreet zijn',
      body: 'Noem materiaal, frequentie, duur, aandachtspunten en transfer. Dus niet “oefen dit thuis”, maar: audio/trommel, 3x per dag 10 minuten, spiegel, zachte inzet/offset, kaakruimte en toepassing bij drukkerij/koor.',
      action: 'Actie: open Huiswerk en spreek de afsluiting alsof Bernard nu vertrekt.',
      view: 'huiswerk'
    };
  }
  if (matches(clean, ['feedback', 'compliment', 'verbeterpunt', 'cue'])) {
    return {
      title: 'Feedback = compliment + correctie + nieuwe poging',
      body: 'Een 10-feedback is specifiek: wat ging goed, wat moet anders en waarom helpt dat Bernard? Sluit altijd af met opnieuw proberen. Algemeen prijzen levert weinig punten op.',
      action: 'Actie: ga naar Huiswerk en train “van compliment naar verbetercue”.',
      view: 'huiswerk'
    };
  }
  if (matches(clean, ['doel', 'werkwijze', 'uitleg', 'clienttaal', 'cliënttaal', 'waarom'])) {
    return {
      title: 'Doel uitleggen in gewone taal',
      body: 'Koppel alles aan Bernard: drukkerij, koor, zwelling, vermoeidheid. Vermijd vaktaal zonder vertaling. De kernzin is: minder drukken, adem en stem beter laten samenwerken, draagkracht behouden.',
      action: 'Actie: open Criteria 1 en oefen je uitleg in 30 seconden.',
      view: 'criteria'
    };
  }
  if (matches(clean, ['zelfreflectie', 'doorvragen', 'voelde', 'merkte', 'keel'])) {
    return {
      title: 'Laat Bernard zelf voelen en verwoorden',
      body: 'Vraag niet alleen “hoe ging het?”, maar vraag door op keel, adem, kaak, gemak en spanning. Gebruik zijn antwoord voor je volgende cue; dat maakt je therapeutisch handelen zichtbaar.',
      action: 'Actie: open Simulatie en oefen de prompt “Zelfreflectie”.',
      view: 'simulatie'
    };
  }
  if (matches(clean, ['bernard', 'bernhard', 'casus', 'drukkerij', 'koor', 'zwelling', 'roken', 'kuchen'])) {
    return {
      title: 'Casus Bernard: behandel niet de oefening, behandel de belasting',
      body: 'Zijn probleem is hyperfunctionele stemgeving onder hoge belasting: lawaai in de drukkerij, zingen, kuchen/roken/drinken en zwelling. Elke keuze moet leiden naar economischer stemgebruik met draagkracht.',
      action: 'Actie: open Route en zeg de casuskern in 20 seconden hardop.',
      view: 'route'
    };
  }
  return {
    title: 'Maak de vraag toetsgericht',
    body: 'Vraag naar één onderdeel: Largo, Andante, Allegro, tekstniveau, feedback, huiswerk, kaak, offset, cliënttaal of Bernard. Dan kan de coach je direct naar de juiste oefening sturen.',
    action: 'Actie: start bij Simulatie en laat je antwoord streng nakijken.',
    view: 'simulatie'
  };
}

function matches(clean, words) {
  return words.some(word => clean.includes(normalize(word)));
}

function toggleCoachQuestionRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    accentCoachAnswer.innerHTML = '<p>Spraakherkenning werkt niet in deze browser. Typ je vraag of gebruik Chrome/Edge.</p>';
    return;
  }

  const button = document.getElementById('record-accent-question');
  if (!coachRecognition) {
    coachRecognition = new SpeechRecognition();
    coachRecognition.lang = 'nl-NL';
    coachRecognition.interimResults = true;
    coachRecognition.continuous = false;
    coachRecognition.onresult = event => {
      accentCoachInput.value = Array.from(event.results).map(result => result[0].transcript).join(' ');
    };
    coachRecognition.onend = () => {
      coachRecording = false;
      button.textContent = 'Spreek in';
      if (accentCoachInput.value.trim()) answerAccentCoachQuestion();
    };
  }

  if (coachRecording) {
    coachRecognition.stop();
    return;
  }

  if (recording && recognition) recognition.stop();
  coachRecording = true;
  button.textContent = 'Stop';
  accentCoachAnswer.innerHTML = '<p>Ik luister. Stel je vraag kort, bijvoorbeeld: “wat doe ik bij harde offset?”</p>';
  coachRecognition.start();
}

function renderEvidence() {
  const maxItems = data.criteria.length + data.rhythms.length + data.simulations.length;
  const total = Object.values(state.scores).reduce((sum, value) => sum + value, 0);
  const ready = Math.round((total / (maxItems * 4)) * 100);
  document.getElementById('accent-ready').textContent = `${ready}%`;
  document.getElementById('accent-hint').textContent = ready >= 80 ? 'Sterk. Train nu zonder spiekposter.' : 'Train vooral uitvoering en specifieke feedback.';

  const groups = [
    ['Criteria', data.criteria.map(item => state.scores[`criterion:${item.id}`] || 0)],
    ['Ritmes', data.rhythms.map(item => state.scores[`rhythm:${item.id}`] || 0)],
    ['Simulaties', data.simulations.map(item => state.scores[`simulation:${item[0]}`] || 0)]
  ];
  document.getElementById('score-bars').innerHTML = groups.map(([label, values]) => {
    const value = Math.round((values.reduce((sum, item) => sum + item, 0) / (values.length * 4)) * 100);
    return `
      <div class="accent-bar">
        <div><strong>${label}</strong><span>${value}%</span></div>
        <meter min="0" max="100" value="${value}">${value}%</meter>
      </div>
    `;
  }).join('');
  document.getElementById('final-checklist').innerHTML = data.finalChecklist.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function toggleRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    speechNote.textContent = 'Spraakherkenning werkt niet in deze browser. Typ je antwoord of gebruik Chrome/Edge.';
    return;
  }
  const button = document.getElementById('record-simulation');
  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'nl-NL';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = event => {
      simulationAnswer.value = Array.from(event.results).map(result => result[0].transcript).join(' ');
    };
    recognition.onend = () => {
      recording = false;
      button.textContent = 'Neem op';
    };
  }
  if (recording) {
    recognition.stop();
    return;
  }
  if (coachRecording && coachRecognition) coachRecognition.stop();
  recording = true;
  button.textContent = 'Stop';
  speechNote.textContent = 'Opname loopt. Spreek alsof Bernard voor je staat.';
  recognition.start();
}

function showView(name) {
  views.forEach(view => view.classList.toggle('is-active', view.id === `view-${name}`));
  tabs.forEach(tab => tab.classList.toggle('is-active', tab.dataset.view === name));
}

function saveScores() {
  localStorage.setItem('accent_scores', JSON.stringify(state.scores));
}

function block(label, text) {
  return `
    <article>
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(text)}</span>
    </article>
  `;
}

function normalize(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}
