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

let recognition = null;
let recording = false;

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
