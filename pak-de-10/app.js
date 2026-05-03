'use strict';

const data = window.PAK_DE_10_DATA;
const state = {
  exam: data.exams[0],
  case: data.cases[0],
  criterion: data.criteria[0],
  question: data.questions[0],
  answerMode: 'written',
  scores: JSON.parse(localStorage.getItem('pak10_scores') || '{}'),
  sources: JSON.parse(localStorage.getItem('pak10_sources') || '[]'),
};

const panels = document.querySelectorAll('.ten-panel');
const stepBtns = document.querySelectorAll('.ten-step');
const examList = document.getElementById('exam-list');
const caseList = document.getElementById('case-list');
const routeTitle = document.getElementById('route-title');
const routeSummary = document.getElementById('route-summary');
const routeList = document.getElementById('route-list');
const snapTitle = document.getElementById('snap-title');
const snapCopy = document.getElementById('snap-copy');
const snapTags = document.getElementById('snap-tags');
const memoryList = document.getElementById('memory-list');
const caseTitle = document.getElementById('case-title');
const caseFacts = document.getElementById('case-facts');
const caseWarning = document.getElementById('case-warning');
const criterionSelect = document.getElementById('criterion-select');
const questionTitle = document.getElementById('question-title');
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackScore = document.getElementById('feedback-score');
const feedbackGrid = document.getElementById('feedback-grid');
const modelAnswer = document.getElementById('model-answer');
const readyScore = document.getElementById('ready-score');
const readyHint = document.getElementById('ready-hint');
const dashboardBars = document.getElementById('dashboard-bars');
const repeatPlan = document.getElementById('repeat-plan');
const speechNote = document.getElementById('speech-note');
const sourceForm = document.getElementById('source-form');
const sourceList = document.getElementById('source-list');

let recognition = null;
let recording = false;

boot();

function boot() {
  renderChoices();
  renderCriterionOptions();
  bindEvents();
  renderAll();
}

function bindEvents() {
  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => showPanel(btn.dataset.panel));
  });

  criterionSelect.addEventListener('change', () => {
    state.criterion = data.criteria.find(item => item.id === criterionSelect.value);
    state.question = questionForCriterion();
    renderAll();
  });

  document.getElementById('new-question').addEventListener('click', () => {
    state.question = randomItem(data.questions);
    renderPractice();
  });

  document.getElementById('check-answer').addEventListener('click', checkAnswer);
  document.getElementById('clear-answer').addEventListener('click', () => {
    answerInput.value = '';
    speechNote.textContent = '';
  });
  document.getElementById('record-answer').addEventListener('click', toggleRecording);

  document.querySelectorAll('[data-answer-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.answerMode = btn.dataset.answerMode;
      document.querySelectorAll('[data-answer-mode]').forEach(item => item.setAttribute('aria-selected', String(item === btn)));
      speechNote.textContent = state.answerMode === 'oral'
        ? 'Mondelinge modus: mik op kernzin, onderbouwing, ICF en advies binnen 60 seconden.'
        : '';
    });
  });

  sourceForm.addEventListener('submit', event => {
    event.preventDefault();
    addSource();
  });
}

function renderChoices() {
  examList.innerHTML = data.exams.map(item => choiceButton(item, state.exam.id, 'exam')).join('');
  caseList.innerHTML = data.cases.map(item => choiceButton(item, state.case.id, 'case')).join('');

  examList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      state.exam = data.exams.find(item => item.id === btn.dataset.id);
      renderAll();
    });
  });

  caseList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      state.case = data.cases.find(item => item.id === btn.dataset.id);
      renderAll();
    });
  });
}

function choiceButton(item, activeId, type) {
  const subtitle = type === 'exam' ? item.summary : item.setting;
  return `
    <button class="ten-choice ${item.id === activeId ? 'is-selected' : ''}" type="button" data-id="${item.id}">
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(subtitle)}</span>
    </button>
  `;
}

function renderCriterionOptions() {
  criterionSelect.innerHTML = data.criteria.map(item => `
    <option value="${item.id}">${item.title}</option>
  `).join('');
}

function renderAll() {
  renderChoices();
  renderStart();
  renderKnowledge();
  renderPractice();
  renderDashboard();
}

function renderStart() {
  routeTitle.textContent = state.exam.title;
  routeSummary.textContent = state.exam.summary;
  routeList.innerHTML = state.exam.route.map((item, index) => `
    <li><span>${index + 1}</span>${escapeHtml(item)}</li>
  `).join('');
}

function renderKnowledge() {
  snapTitle.textContent = state.criterion.title;
  snapCopy.textContent = state.criterion.snap;
  snapTags.innerHTML = [...state.criterion.tags, state.criterion.domain, state.case.source].map(tag => `
    <span>${escapeHtml(tag)}</span>
  `).join('');
  memoryList.innerHTML = state.criterion.memory.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function renderPractice() {
  criterionSelect.value = state.criterion.id;
  caseTitle.textContent = state.case.title;
  caseFacts.innerHTML = state.case.facts.map(([label, text]) => `
    <div><strong>${escapeHtml(label)}</strong><span>${escapeHtml(text)}</span></div>
  `).join('');
  caseWarning.textContent = `Valkuil: ${state.case.risks[0]}. Focus vandaag: ${state.case.focus.join(', ')}.`;
  questionTitle.textContent = state.criterion.title;
  questionText.textContent = state.question;
}

function checkAnswer() {
  const answer = answerInput.value.trim();
  if (!answer) {
    speechNote.textContent = 'Schrijf of spreek eerst een antwoord in.';
    return;
  }

  const result = scoreAnswer(answer);
  const key = `${state.case.id}:${state.criterion.id}`;
  state.scores[key] = Math.max(state.scores[key] || 0, result.score);
  localStorage.setItem('pak10_scores', JSON.stringify(state.scores));

  feedbackTitle.textContent = result.label;
  feedbackScore.textContent = `${result.score}/5`;
  feedbackGrid.innerHTML = `
    ${feedbackBlock('Wat is goed', result.good)}
    ${feedbackBlock('Wat mist', result.missing)}
    ${feedbackBlock('Wat kost punten', result.cost)}
    ${feedbackBlock('Volgende oefening', result.next)}
  `;
  modelAnswer.textContent = buildModelAnswer();
  renderDashboard();
  showPanel('feedback');
}

function scoreAnswer(answer) {
  const clean = normalize(answer);
  const criterionHits = state.criterion.checks.filter(check => clean.includes(normalize(check)));
  const caseHits = [...state.case.focus, ...state.case.risks].filter(check => clean.includes(normalize(check.split(' ')[0])));
  const structureHits = ['omdat', 'daarom', 'functie', 'activiteit', 'participatie', 'advies', 'conclusie'].filter(word => clean.includes(word));
  const lengthPoint = answer.split(/\s+/).length >= 45 ? 1 : 0;
  const raw = criterionHits.length + Math.min(2, caseHits.length) + Math.min(2, structureHits.length) + lengthPoint;
  const score = Math.min(5, Math.max(0, Math.round(raw / 3)));
  const missingChecks = state.criterion.checks.filter(check => !criterionHits.includes(check)).slice(0, 4);

  return {
    score,
    label: labelFor(score),
    good: criterionHits.length
      ? `Je gebruikt herkenbare toetswoorden: ${criterionHits.slice(0, 5).join(', ')}.`
      : 'Je antwoord heeft nog te weinig herkenbare vaktaal.',
    missing: missingChecks.length
      ? `Voeg dit toe: ${missingChecks.join(', ')}.`
      : 'De kernwoorden zijn aanwezig. Maak nu je redenering compacter.',
    cost: score >= 4
      ? 'Puntenverlies zit nu vooral in formulering, volgorde of bewijs uit de casus.'
      : 'Dit kost punten: te beschrijvend, te weinig interpretatie en onvoldoende koppeling aan criterium.',
    next: nextPractice(score),
  };
}

function buildModelAnswer() {
  return `${state.criterion.model} Bij ${state.case.title} let ik extra op ${state.case.focus.join(', ')}. De conclusie moet steeds terug naar functioneren: wat betekent dit voor leren, communiceren en meedoen?`;
}

function labelFor(score) {
  if (score >= 5) return 'Toetsklaar 10-niveau';
  if (score === 4) return 'Zeer goed, nog strakker formuleren';
  if (score === 3) return 'Voldoende, maar nog geen 10';
  if (score === 2) return 'Basis aanwezig';
  if (score === 1) return 'Te vaag voor de toets';
  return 'Onvoldoende bewijs';
}

function nextPractice(score) {
  if (score >= 5) return 'Herhaal morgen mondeling met een andere casus.';
  if (score >= 3) return 'Herschrijf je antwoord met expliciete ICF-brug en één MDO-vraag.';
  return 'Ga terug naar de snapkaart en maak eerst een antwoord in drie zinnen: kern, bewijs, advies.';
}

function renderDashboard() {
  const groups = [
    ['Kennis', ['logodiagnostiek', 'diagnose']],
    ['Toepassing', ['logodiagnostiek', 'mdo', 'advies']],
    ['Vaktaal', ['diagnose', 'icf']],
    ['Mondeling', ['mdo', 'advies']],
    ['Toetsklaar', data.criteria.map(item => item.id)]
  ];

  const values = groups.map(([label, ids]) => {
    const relevant = data.cases.flatMap(item => ids.map(id => state.scores[`${item.id}:${id}`] || 0));
    const average = relevant.length ? Math.round((sum(relevant) / (relevant.length * 5)) * 100) : 0;
    return [label, average];
  });

  const ready = values.at(-1)[1];
  readyScore.textContent = `${ready}%`;
  readyHint.textContent = ready >= 80 ? 'Je bewijs is sterk. Train nu snelheid en formulering.' : 'Je mist nog bewijs per casus en criterium.';

  dashboardBars.innerHTML = values.map(([label, value]) => `
    <div class="ten-bar">
      <div><strong>${label}</strong><span>${value}%</span></div>
      <meter min="0" max="100" value="${value}">${value}%</meter>
    </div>
  `).join('');

  repeatPlan.innerHTML = buildRepeatPlan(ready).map(item => `<li>${escapeHtml(item)}</li>`).join('');
  renderSources();
}

function buildRepeatPlan(ready) {
  if (ready >= 80) {
    return ['Vandaag: één willekeurige casus hardop in 60 seconden.', 'Morgen: alleen de zwakste score opnieuw.', 'Over 7 dagen: volledige eindcheck zonder voorbeeldantwoord.'];
  }
  return ['Vandaag: leer één snapkaart en beantwoord één casusvraag.', 'Morgen: verbeter hetzelfde antwoord tot minimaal 4/5.', 'Over 3 dagen: doe dezelfde casus mondeling.', 'Over 7 dagen: wissel naar een andere casus en herhaal.'];
}

function addSource() {
  const title = document.getElementById('source-title').value.trim();
  const outcome = document.getElementById('source-outcome').value.trim();
  const text = document.getElementById('source-text').value.trim();
  if (!title || !text) return;

  const source = {
    id: Date.now(),
    title,
    outcome: outcome || 'nog taggen',
    tags: inferTags(`${title} ${outcome} ${text}`),
    created: new Date().toLocaleDateString('nl-NL'),
  };

  state.sources.unshift(source);
  localStorage.setItem('pak10_sources', JSON.stringify(state.sources.slice(0, 12)));
  sourceForm.reset();
  renderSources();
}

function renderSources() {
  sourceList.innerHTML = state.sources.length
    ? state.sources.map(source => `
      <article>
        <strong>${escapeHtml(source.title)}</strong>
        <span>${escapeHtml(source.outcome)} · ${escapeHtml(source.created)}</span>
        <div>${source.tags.map(tag => `<em>${escapeHtml(tag)}</em>`).join('')}</div>
      </article>
    `).join('')
    : '<p class="ten-note">Nog geen eigen bronnen toegevoegd.</p>';
}

function inferTags(text) {
  const clean = normalize(text);
  const tags = [];
  if (clean.includes('icf')) tags.push('ICF');
  if (clean.includes('spraak') || clean.includes('fonolog')) tags.push('spraak');
  if (clean.includes('taal') || clean.includes('morfosyntax')) tags.push('taal');
  if (clean.includes('score') || clean.includes('test')) tags.push('diagnostiek');
  if (clean.includes('advies') || clean.includes('school')) tags.push('advies');
  return tags.length ? tags : ['bron', 'must know'];
}

function toggleRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    speechNote.textContent = 'Spraakherkenning werkt niet in deze browser. Typ je antwoord of gebruik Chrome/Edge.';
    return;
  }

  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'nl-NL';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = event => {
      const text = Array.from(event.results).map(result => result[0].transcript).join(' ');
      answerInput.value = text;
    };
    recognition.onend = () => {
      recording = false;
      document.getElementById('record-answer').textContent = 'Neem op';
    };
  }

  if (recording) {
    recognition.stop();
    return;
  }

  recording = true;
  document.getElementById('record-answer').textContent = 'Stop';
  speechNote.textContent = 'Opname loopt. Leg het uit alsof je in het MDO zit.';
  recognition.start();
}

function showPanel(name) {
  panels.forEach(panel => panel.classList.toggle('is-active', panel.id === `panel-${name}`));
  stepBtns.forEach(btn => btn.classList.toggle('is-active', btn.dataset.panel === name));
}

function questionForCriterion() {
  const byCriterion = {
    logodiagnostiek: 'Welke logopedische onderzoeken zijn gedaan en hoe interpreteer je de scores?',
    mdo: 'Welke MDO-informatie verandert je diagnose of advies, en welke vraag stel je nog?',
    diagnose: 'Formuleer een diagnose en sluit minstens één alternatief uit.',
    icf: 'Maak de ICF-brug voor deze casus in vier stappen.',
    advies: 'Geef een advies met argumentatie voor ouders, school en logopedie.',
  };
  return byCriterion[state.criterion.id] || randomItem(data.questions);
}

function feedbackBlock(title, body) {
  return `
    <article>
      <h4>${escapeHtml(title)}</h4>
      <p>${escapeHtml(body)}</p>
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

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}
