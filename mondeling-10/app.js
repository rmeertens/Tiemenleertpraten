'use strict';

const data = window.ORAL_10_DATA;
const state = {
  activeView: 'diagnostics',
  diagnosticPrompt: data.diagnostics.prompts[0],
  therapyPrompt: data.therapy.prompts[0],
  simCase: data.cases[0],
  scores: JSON.parse(localStorage.getItem('oral10_scores') || '{"diagnostics":0,"therapy":0}'),
};

const timerEl = document.getElementById('oral-timer');
const timerToggle = document.getElementById('timer-toggle');
const diagnosticPrompt = document.getElementById('diagnostic-prompt');
const therapyPrompt = document.getElementById('therapy-prompt');
const diagnosticChecks = document.getElementById('diagnostic-checks');
const therapyChecks = document.getElementById('therapy-checks');
const simTitle = document.getElementById('sim-title');
const simCase = document.getElementById('sim-case');
const oralAnswer = document.getElementById('oral-answer');
const oralNote = document.getElementById('oral-note');
const feedback = document.getElementById('oral-feedback');
const feedbackHeading = document.getElementById('feedback-heading');
const feedbackPoints = document.getElementById('feedback-points');
const feedbackBody = document.getElementById('feedback-body');
const feedbackModel = document.getElementById('feedback-model');
const oralBars = document.getElementById('oral-bars');
const oralPlan = document.getElementById('oral-plan');

let secondsLeft = 15 * 60;
let timerId = null;
let recognition = null;
let recording = false;

boot();

function boot() {
  renderPrompts();
  renderChecks();
  renderSimulation();
  renderDashboard();
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll('.oral-tab').forEach(btn => {
    btn.addEventListener('click', () => showView(btn.dataset.view));
  });

  document.querySelectorAll('[data-new]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.new;
      if (key === 'diagnostics') state.diagnosticPrompt = randomItem(data.diagnostics.prompts);
      if (key === 'therapy') state.therapyPrompt = randomItem(data.therapy.prompts);
      renderPrompts();
    });
  });

  document.querySelectorAll('[data-score]').forEach(btn => {
    btn.addEventListener('click', () => scoreChecklist(btn.dataset.score));
  });

  document.querySelectorAll('[data-record]').forEach(btn => {
    btn.addEventListener('click', () => toggleRecording(`${btn.dataset.record}-prompt`));
  });

  document.getElementById('draw-card').addEventListener('click', () => {
    state.simCase = randomItem(data.cases);
    renderSimulation();
  });

  document.getElementById('strict-feedback').addEventListener('click', strictFeedback);
  document.getElementById('record-main').addEventListener('click', () => toggleRecording('main'));
  document.getElementById('clear-main').addEventListener('click', () => {
    oralAnswer.value = '';
    oralNote.textContent = '';
    feedback.hidden = true;
  });
  timerToggle.addEventListener('click', toggleTimer);
}

function renderPrompts() {
  diagnosticPrompt.innerHTML = promptHtml(state.diagnosticPrompt, data.diagnostics.model);
  therapyPrompt.innerHTML = promptHtml(state.therapyPrompt, data.therapy.model);
}

function promptHtml(prompt, model) {
  return `
    <strong>Opdracht</strong>
    <p>${escapeHtml(prompt)}</p>
    <span>10-anker: ${escapeHtml(model)}</span>
  `;
}

function renderChecks() {
  diagnosticChecks.innerHTML = checksHtml('diagnostics', data.diagnostics.criteria);
  therapyChecks.innerHTML = checksHtml('therapy', data.therapy.criteria);
}

function checksHtml(group, criteria) {
  return criteria.map(([id, label], index) => `
    <label>
      <input type="checkbox" data-group="${group}" data-criterion="${id}" />
      <span>${index + 1}. ${escapeHtml(label)}</span>
    </label>
  `).join('');
}

function renderSimulation() {
  simTitle.textContent = state.simCase.title;
  simCase.innerHTML = `
    <div><strong>Casusprikkel</strong><span>${escapeHtml(state.simCase.context)}</span></div>
    <div><strong>Jij moet</strong><span>${escapeHtml(state.simCase.task)}</span></div>
  `;
}

function scoreChecklist(group) {
  const checked = document.querySelectorAll(`input[data-group="${group}"]:checked`).length;
  const points = checked * 4;
  state.scores[group] = points;
  saveScores();
  renderDashboard();
  showView('dashboard');
}

function strictFeedback() {
  const text = oralAnswer.value.trim();
  if (!text) {
    oralNote.textContent = 'Geef eerst een antwoord. Kort mag, vaag niet.';
    return;
  }

  const clean = normalize(text);
  const rubricWords = [
    'beginsituatie', 'doel', 'methode', 'verantwoord', 'advies', 'samenwerking',
    'prognose', 'score', 'afbreekregel', 'start', 'intonatie', 'neutraal',
    'handleiding', 'fout', 'betrouwbaar'
  ];
  const hits = rubricWords.filter(word => clean.includes(word));
  const structure = ['omdat', 'dus', 'daarom', 'passend', 'concreet'].filter(word => clean.includes(word));
  const points = Math.min(4, Math.round((hits.length + structure.length) / 4));
  const mode = clean.includes('therapie') || clean.includes('doel') || clean.includes('methode') ? 'therapy' : 'diagnostics';
  state.scores[mode] = Math.max(state.scores[mode], points * 10);
  saveScores();

  feedback.hidden = false;
  feedbackHeading.textContent = labelFor(points);
  feedbackPoints.textContent = `${points}/4`;
  feedbackBody.innerHTML = `
    ${block('Goed', hits.length ? `Je gebruikt toetswoorden: ${hits.slice(0, 6).join(', ')}.` : 'Je durft te antwoorden, maar vaktaal ontbreekt nog.')}
    ${block('Mist', missingLine(hits, mode))}
    ${block('Kost punten', points >= 3 ? 'Je kunt nog punten verliezen door volgorde of te weinig casusbewijs.' : 'Te algemeen: de beoordelaar hoort nog geen criteriumbewijs.')}
    ${block('Volgende poging', points >= 3 ? 'Zeg hetzelfde nu in 45 seconden met één foutverantwoording of één therapiekeuze extra.' : 'Gebruik: kernzin -> criterium -> casusbewijs -> verantwoording.')}
  `;
  feedbackModel.textContent = mode === 'therapy' ? data.therapy.model : data.diagnostics.model;
  renderDashboard();
  feedback.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function missingLine(hits, mode) {
  const target = mode === 'therapy'
    ? ['beginsituatie', 'doel', 'methode', 'samenwerking', 'prognose']
    : ['testsituatie', 'neutraal', 'intonatie', 'score', 'afbreekregel', 'fout'];
  const missing = target.filter(word => !hits.includes(word)).slice(0, 4);
  return missing.length ? `Voeg expliciet toe: ${missing.join(', ')}.` : 'De kern zit erin; maak je formulering strakker.';
}

function renderDashboard() {
  const diagnostic = state.scores.diagnostics || 0;
  const therapy = state.scores.therapy || 0;
  const diagnosticGrade = gradeFor(diagnostic);
  const therapyGrade = gradeFor(therapy);
  const total = diagnostic >= 20 && therapy >= 20 ? ((diagnosticGrade + therapyGrade) / 2).toFixed(1) : 'onvoldoende';

  oralBars.innerHTML = [
    ['Diagnostiek', diagnostic, diagnosticGrade],
    ['Therapie', therapy, therapyGrade],
    ['Eindbeeld', Math.min(40, Math.round((diagnostic + therapy) / 2)), total]
  ].map(([label, points, grade]) => `
    <div class="oral-bar">
      <div><strong>${label}</strong><span>${points}/40 · ${grade}</span></div>
      <meter min="0" max="40" value="${points}">${points}/40</meter>
    </div>
  `).join('');

  oralPlan.innerHTML = planFor(diagnostic, therapy).map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function planFor(diagnostic, therapy) {
  if (diagnostic >= 36 && therapy >= 36) {
    return ['Vandaag: volledige simulatie zonder spiekkaart.', 'Morgen: alleen fouten verantwoorden en prognose oefenen.', 'Laatste check: 30 minuten in tweetal op echt toetsritme.'];
  }
  if (diagnostic < therapy) {
    return ['Vandaag: Taalbegrip neutrale toon en Taalproductie intonatie hardop oefenen.', 'Daarna: startsectie en afbreekregels zonder aarzeling reproduceren.', 'Eindig met criterium 10: benoem één fout en verantwoord de invloed.'];
  }
  return ['Vandaag: LT-doel en KT-doel voor drie casussen formuleren.', 'Daarna: methode, therapievorm en duur steeds verantwoorden.', 'Eindig met samenwerking en prognose in maximaal 60 seconden.'];
}

function gradeFor(points) {
  const match = data.scoreTable.find(([max]) => points <= max);
  return match ? match[1].toFixed(1) : '10.0';
}

function showView(view) {
  document.querySelectorAll('.oral-view').forEach(item => item.classList.toggle('is-active', item.id === `view-${view}`));
  document.querySelectorAll('.oral-tab').forEach(item => item.classList.toggle('is-active', item.dataset.view === view));
}

function toggleTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    timerToggle.textContent = 'Verder';
    return;
  }
  timerToggle.textContent = 'Pauze';
  timerId = setInterval(() => {
    secondsLeft = Math.max(0, secondsLeft - 1);
    renderTimer();
    if (secondsLeft === 0) {
      clearInterval(timerId);
      timerId = null;
      timerToggle.textContent = 'Reset';
      secondsLeft = 15 * 60;
    }
  }, 1000);
}

function renderTimer() {
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  timerEl.textContent = `${minutes}:${seconds}`;
}

function toggleRecording(target) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    oralNote.textContent = 'Spraakherkenning werkt niet in deze browser. Chrome of Edge werkt meestal het best.';
    return;
  }
  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'nl-NL';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = event => {
      const transcript = Array.from(event.results).map(result => result[0].transcript).join(' ');
      oralAnswer.value = transcript;
    };
    recognition.onend = () => { recording = false; };
  }
  if (recording) {
    recognition.stop();
    return;
  }
  recording = true;
  showView('simulation');
  oralNote.textContent = target === 'main' ? 'Opname loopt.' : 'Opname loopt. Je antwoord komt in de simulatiebox.';
  recognition.start();
}

function saveScores() {
  localStorage.setItem('oral10_scores', JSON.stringify(state.scores));
}

function block(title, body) {
  return `<article><h4>${escapeHtml(title)}</h4><p>${escapeHtml(body)}</p></article>`;
}

function labelFor(points) {
  if (points >= 4) return 'Zeer goed: richting 10';
  if (points === 3) return 'Goed, nog niet foutloos';
  if (points === 2) return 'Voldoende basis';
  if (points === 1) return 'Bijna voldoende';
  return 'Onvoldoende toetsbewijs';
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
