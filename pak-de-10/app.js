'use strict';

const data = window.PAK_DE_10_DATA;
const state = {
  exam: data.exams[0],
  case: data.cases[0],
  criterion: data.criteria[0],
  question: data.questions[0],
  answerMode: 'written',
  treatmentRoute: data.treatmentMachine.routes[0],
  treatmentScript: data.treatmentMachine.scripts[0],
  treatmentDrill: data.treatmentMachine.drills[0],
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
const treatmentRouteSelect = document.getElementById('treatment-route-select');
const treatmentRouteDetail = document.getElementById('treatment-route-detail');
const treatmentCaseTitle = document.getElementById('treatment-case-title');
const treatmentCaseCoach = document.getElementById('treatment-case-coach');
const treatmentWorkflow = document.getElementById('treatment-workflow');
const treatmentLookup = document.getElementById('treatment-lookup');
const treatmentSourceIndex = document.getElementById('treatment-source-index');
const treatmentPageToplist = document.getElementById('treatment-page-toplist');
const treatmentGoals = document.getElementById('treatment-goals');
const treatmentMethods = document.getElementById('treatment-methods');
const treatmentScript = document.getElementById('treatment-script');
const treatmentDrill = document.getElementById('treatment-drill');
const treatmentCollab = document.getElementById('treatment-collab');
const treatmentRedflags = document.getElementById('treatment-redflags');
const treatmentQuestionInput = document.getElementById('treatment-question-input');
const treatmentCoachAnswer = document.getElementById('treatment-coach-answer');

let recognition = null;
let recording = false;
let treatmentRecognition = null;
let treatmentRecording = false;

boot();

function boot() {
  renderChoices();
  renderCriterionOptions();
  renderTreatmentOptions();
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

  treatmentRouteSelect.addEventListener('change', () => {
    state.treatmentRoute = data.treatmentMachine.routes.find(item => item.id === treatmentRouteSelect.value);
    renderTreatment();
  });

  document.getElementById('new-treatment-script').addEventListener('click', () => {
    state.treatmentScript = randomItem(data.treatmentMachine.scripts);
    renderTreatment();
  });

  document.getElementById('new-treatment-drill').addEventListener('click', () => {
    state.treatmentDrill = randomItem(data.treatmentMachine.drills);
    renderTreatment();
  });

  document.getElementById('ask-treatment-coach').addEventListener('click', answerTreatmentQuestion);
  document.getElementById('speak-treatment-question').addEventListener('click', toggleTreatmentQuestionRecording);
  treatmentQuestionInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') answerTreatmentQuestion();
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

function renderTreatmentOptions() {
  treatmentRouteSelect.innerHTML = data.treatmentMachine.routes.map(item => `
    <option value="${item.id}">${item.title}</option>
  `).join('');
}

function renderAll() {
  renderChoices();
  renderStart();
  renderKnowledge();
  syncTreatmentRouteWithCase();
  renderTreatment();
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

function syncTreatmentRouteWithCase() {
  const coach = data.caseTreatment[state.case.id];
  if (!coach) return;
  const route = data.treatmentMachine.routes.find(item => item.id === coach.route);
  if (route) state.treatmentRoute = route;
}

function renderTreatment() {
  const route = state.treatmentRoute;
  const coach = data.caseTreatment[state.case.id];
  treatmentRouteSelect.value = route.id;
  treatmentRouteDetail.innerHTML = `
    <article class="ten-treatment-route">
      <h4>${escapeHtml(route.title)}</h4>
      <p>${escapeHtml(route.problem)}</p>
    </article>
    <div class="ten-treatment-facts">
      ${treatmentFact('LT-doel', route.lt)}
      ${treatmentFact('KT-doel', route.kt)}
      ${treatmentFact('Methode', route.method)}
      ${treatmentFact('Waarom', route.why)}
      ${treatmentFact('Vorm', route.form)}
      ${treatmentFact('Duur/evaluatie', route.duration)}
      ${treatmentFact('Prognose', route.prognosis)}
    </div>
    ${sourceAnchor(bestAnchorForRoute(route.id), 'Beste verdieping bij deze route')}
  `;

  treatmentCaseTitle.textContent = coach.title;
  treatmentCaseCoach.innerHTML = `
    <p>${escapeHtml(coach.pitch)}</p>
    ${treatmentMiniList('Zelf uitzoeken', buildCaseResearchTasks(coach))}
    ${treatmentMiniList('Prioriteiten', coach.priorities)}
    ${treatmentMiniList('Doelen', coach.goals)}
    ${treatmentMiniList('Methoden', coach.methods)}
    ${treatmentMiniList('Powerzinnen', coach.scripts)}
    ${sourceAnchor(bestAnchorForCase(coach), 'Beste verdieping bij deze casus')}
    <div class="ten-treatment-warning"><strong>Let op</strong><span>${escapeHtml(coach.warning)}</span></div>
    <div class="ten-treatment-warning is-prognosis"><strong>Prognose</strong><span>${escapeHtml(coach.prognosis)}</span></div>
  `;

  treatmentWorkflow.innerHTML = `
    ${data.treatmentMachine.skillCoach.workflow.map(([title, text]) => `
      <article>
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(text)}</span>
      </article>
    `).join('')}
    <article>
      <strong>Doelformule-check</strong>
      <span>${escapeHtml(data.treatmentMachine.skillCoach.goalTemplate.join(' -> '))}</span>
    </article>
  `;

  treatmentLookup.innerHTML = data.treatmentMachine.skillCoach.lookup.map(([source, task]) => `
    <article>
      <strong>${escapeHtml(source)}</strong>
      <span>${escapeHtml(task)}</span>
    </article>
  `).join('');

  treatmentSourceIndex.innerHTML = renderSourceIndex(coach);
  treatmentPageToplist.innerHTML = renderPageToplist();

  treatmentGoals.innerHTML = data.treatmentMachine.goals.map(([label, weak, strong]) => `
    <article>
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml('Opdracht: maak eerst zelf een LT-doel en KT-doel met gedrag, context, norm, steun en termijn. Vergelijk pas daarna met het voorbeeld.')}</span>
      <span>${escapeHtml(weak)}</span>
      <details class="ten-inline-details">
        <summary>Bekijk ZG-voorbeeld</summary>
        <p>${escapeHtml(strong)}</p>
      </details>
    </article>
  `).join('');

  treatmentMethods.innerHTML = data.treatmentMachine.methods.map(([name, indication, contra, script]) => `
    <article>
      <strong>${escapeHtml(name)}</strong>
      <span>${escapeHtml(data.treatmentMachine.skillCoach.methodQuestions[0])}</span>
      <span>${escapeHtml(indication)}</span>
      <span>${escapeHtml(contra)}</span>
      <details class="ten-inline-details">
        <summary>Bekijk mondelinge formulering</summary>
        <p>${escapeHtml(script)}</p>
      </details>
    </article>
  `).join('');

  treatmentScript.innerHTML = `
    <strong>${escapeHtml(state.treatmentScript[0])}</strong>
    <p>${escapeHtml(state.treatmentScript[1])}</p>
  `;

  treatmentDrill.innerHTML = `
    <strong>${escapeHtml(state.treatmentDrill[0])}</strong>
    <p>${escapeHtml(state.treatmentDrill[1])}</p>
    <span>${escapeHtml(state.treatmentDrill[2])}</span>
  `;

  treatmentCollab.innerHTML = `
    ${data.treatmentMachine.collaboration.map(([role, text]) => `
      <article>
        <strong>${escapeHtml(role)}</strong>
        <span>${escapeHtml(text)}</span>
      </article>
    `).join('')}
    <article>
      <strong>Prognoseformules</strong>
      <span>${escapeHtml(data.treatmentMachine.prognosis.map(([label, text]) => `${label}: ${text}`).join(' '))}</span>
    </article>
  `;

  treatmentRedflags.innerHTML = data.treatmentMachine.redFlags.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function treatmentFact(label, text) {
  return `
    <div>
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(text)}</span>
    </div>
  `;
}

function treatmentMiniList(title, items) {
  return `
    <div>
      <strong>${escapeHtml(title)}</strong>
      <ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </div>
  `;
}

function renderSourceIndex(coach) {
  const index = data.treatmentMachine.sourceIndex;
  const keyThemes = ['TOS', 'Scaffolding', 'Morfosyntaxis', 'Informatieverwerking', 'Modeling'];
  const highlighted = index.themes.filter(([topic]) => keyThemes.includes(topic));
  return `
    <article>
      <strong>Belangrijkste bronankers</strong>
      <span>${highlighted.map(([topic, synonyms, meaning, relevance, use, pages]) => `${topic}: ${pages}. ${use}`).join(' ')}</span>
    </article>
    <details class="ten-treatment-details">
      <summary>Open volledige bronnen-index</summary>
      <div>
        ${index.sources.map(([title, type, theme, use, section]) => `
          <article>
            <strong>${escapeHtml(title)}</strong>
            <span>${escapeHtml(`${type}. ${theme} Toepassing: ${use}. Secties: ${section}.`)}</span>
          </article>
        `).join('')}
        ${index.themes.map(([topic, synonyms, meaning, relevance, use, pages]) => `
          <article id="source-theme-${slugify(topic)}">
            <strong>${escapeHtml(topic)} · ${escapeHtml(pages)}</strong>
            <span>${escapeHtml(`${meaning} Zoekwoorden: ${synonyms}. Toepassing: ${use}.`)}</span>
          </article>
        `).join('')}
        ${index.oralLinks.map(([claim, concept, pages, script]) => `
          <article id="source-claim-${slugify(concept)}">
            <strong>${escapeHtml(pages)} · ${escapeHtml(concept)}</strong>
            <span>${escapeHtml(`${claim} ${script}`)}</span>
          </article>
        `).join('')}
        ${index.wietze.map(([problem, concept, pages, consequence, script]) => `
          <article id="source-wietze-${slugify(problem)}">
            <strong>${escapeHtml(problem)} · ${escapeHtml(pages)}</strong>
            <span>${escapeHtml(`${consequence} ${script}`)}</span>
          </article>
        `).join('')}
      </div>
    </details>
  `;
}

function renderPageToplist() {
  const items = data.treatmentMachine.sourceIndex.toplists;
  const highlighted = items.filter(([area]) => ['Behandeling', 'Wietze', 'Mondeling'].includes(area)).slice(0, 5);
  return `
    ${highlighted.map(([area, page, topic, argument]) => `
      <article>
        <strong>${escapeHtml(area)} · ${escapeHtml(page)}</strong>
        <span>${escapeHtml(topic)}</span>
        <p>${escapeHtml(argument)}</p>
      </article>
    `).join('')}
    <details class="ten-treatment-details">
      <summary>Open volledige pagina-toplijst</summary>
      <div>
        ${items.map(([area, page, topic, argument]) => `
          <article>
            <strong>${escapeHtml(area)} · ${escapeHtml(page)}</strong>
            <span>${escapeHtml(topic)}</span>
            <p>${escapeHtml(argument)}</p>
          </article>
        `).join('')}
      </div>
    </details>
  `;
}

function sourceAnchor(anchor, label) {
  if (!anchor) return '';
  return `
    <a class="ten-source-anchor" href="${escapeHtml(anchor.href)}">
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(anchor.text)}</span>
    </a>
  `;
}

function bestAnchorForRoute(routeId) {
  const anchors = {
    fonologie: ['#treatment-source-index', 'D3 p. 288-289 · check taalvorm en klanksysteem; koppel contrasten aan functioneren.'],
    vod: ['#treatment-source-index', 'D2 p. 187 · gebruik informatieverwerking om cueing, herhaling en beperkte belasting te onderbouwen.'],
    morfosyntax: ['#treatment-source-index', 'D3 p. 288-289 · beste plek voor zinsbouw, grammatica en doelstructuren.'],
    semantiek: ['#treatment-source-index', 'D3 p. 288 · beste plek voor woordleren en fast mapping.'],
    pragmatiek: ['#treatment-source-index', 'D3 p. 290 · beste plek voor sociaal taalgebruik en redzaamheid.'],
    meertalig: ['#treatment-source-index', 'D3 p. 290-291 · beste plek om meertaligheid, SES en blootstelling te nuanceren.'],
    cluster3: ['#treatment-source-index', 'D3 p. 284 en 325 · beste plek voor omgeving, modeling en geleide participatie.']
  };
  const selected = anchors[routeId];
  return selected ? { href: selected[0], text: selected[1] } : null;
}

function bestAnchorForCase(coach) {
  if (coach.title.includes('Wietze')) {
    return { href: '#treatment-source-index', text: 'D2 p. 187 + D3 p. 288-292 · kernanker voor Wietze: informatieverwerking, morfosyntaxis en TOS.' };
  }
  if (coach.title.includes('Erik')) {
    return { href: '#treatment-source-index', text: 'D2 p. 187 · combineer taalprofiel met auditieve randvoorwaarden en belastbaarheid.' };
  }
  if (coach.title.includes('Isa')) {
    return { href: '#treatment-source-index', text: 'D3 p. 284 en 325 · beste anker voor totale communicatie, routines en omgeving.' };
  }
  if (coach.title.includes('Tarik')) {
    return { href: '#treatment-source-index', text: 'D3 p. 290-291 · beste anker voor meertaligheid, blootstelling en voorzichtig diagnosticeren.' };
  }
  return { href: '#treatment-source-index', text: 'D3 p. 290 · beste anker voor communicatie in interactie en schoolcontext.' };
}

function slugify(value) {
  return normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildCaseResearchTasks(coach) {
  return [
    `Zoek in de casus het bewijs voor: ${coach.priorities.slice(0, 3).join(', ')}.`,
    'Markeer welke gegevens functie, activiteit, participatie en omgeving zijn.',
    'Schrijf eerst zelf een LT-doel en KT-doel; gebruik het voorbeeld alleen als controle.',
    'Gebruik maar een bronanker als primaire onderbouwing; kies pas extra bron als je antwoord anders onvoldoende bewijs heeft.',
    'Bedenk welke informatie nog ontbreekt voordat je prognose durft te formuleren.'
  ];
}

function answerTreatmentQuestion() {
  const question = treatmentQuestionInput.value.trim();
  if (!question) {
    treatmentCoachAnswer.innerHTML = '<p>Stel eerst je vraag. Bijvoorbeeld: “waarom ZPD?” of “hoe maak ik een KT-doel?”</p>';
    return;
  }

  const answer = buildCoachAnswer(question);
  treatmentCoachAnswer.innerHTML = `
    <strong>${escapeHtml(answer.title)}</strong>
    <p>${escapeHtml(answer.body)}</p>
    ${sourceAnchor(answer.anchor, 'Eén beste plek om te verdiepen')}
  `;
}

function buildCoachAnswer(question) {
  const clean = normalize(question);
  const coach = data.caseTreatment[state.case.id];
  if (clean.includes('kt') || clean.includes('korte') || clean.includes('doel')) {
    return {
      title: 'Zo bouw je een behandeldoel',
      body: 'Begin niet met de voorbeeldzin. Kies eerst ICF-niveau, observeerbaar gedrag, context, norm, cue-niveau en termijn. Pas daarna vergelijk je met het ZG-voorbeeld in de Doelenwerkplaats.',
      anchor: { href: '#treatment-goals', text: 'Doelenwerkplaats · gebruik de doelformule en klap pas daarna het ZG-voorbeeld open.' }
    };
  }
  if (clean.includes('zpd') || clean.includes('scaffold') || clean.includes('steun')) {
    return {
      title: 'Waarom ZPD/scaffolding?',
      body: 'Omdat je behandelt op het niveau dat het kind met hulp aankan. Je maakt de taak haalbaar, bouwt steun af en voorkomt dat het doel te makkelijk of te moeilijk wordt.',
      anchor: { href: '#treatment-source-index', text: 'D3 p. 285-286 · ZPD en scaffolding zijn het beste bronanker.' }
    };
  }
  if (clean.includes('tos')) {
    return {
      title: 'TOS onderbouwen',
      body: 'Gebruik TOS niet als los label. Benoem hardnekkige taalverwerkingsproblemen, koppel die aan morfosyntaxis/woordenschat/pragmatiek en vertaal dit naar specifieke behandeling.',
      anchor: { href: '#treatment-source-index', text: 'D3 p. 292 · TOS als neurocognitieve taalverwerkingsstoornis.' }
    };
  }
  if (clean.includes('wietze')) {
    return {
      title: 'Wietze kernroute',
      body: 'Voor Wietze ligt de focus op beperkte informatieverwerking, zwakke morfosyntaxis, VOD-kenmerken en participatie in de klas. Kies één primair probleem en bouw daar je doel/methode omheen.',
      anchor: bestAnchorForCase(coach)
    };
  }
  if (clean.includes('methode') || clean.includes('waarom kies')) {
    return {
      title: 'Methode kiezen',
      body: 'Bewijs eerst het probleemmechanisme: fonologisch, fonetisch, VOD, morfosyntaxis, semantiek of pragmatiek. Kies daarna pas de methode en benoem waarom een andere route minder passend is.',
      anchor: { href: '#treatment-methods', text: 'Methodekeuze-trainer · indicatie, contra-indicatie en formulering.' }
    };
  }
  if (clean.includes('bron') || clean.includes('pagina') || clean.includes('waar staat')) {
    return {
      title: 'Bron zoeken zonder verdwalen',
      body: 'Gebruik één primaire bron per antwoord. Voor behandeling meestal D3 p. 284-286 of p. 325; voor Wietze vaak D2 p. 187 plus D3 p. 288-292.',
      anchor: { href: '#treatment-source-index', text: 'Bronnen-index · eerst de uitgelichte ankers, daarna pas volledige index.' }
    };
  }
  return {
    title: 'Coachadvies',
    body: 'Maak je vraag specifieker: vraag naar doel, methode, bron, ZPD, TOS, Wietze, samenwerking of prognose. Voor nu: start bij casusbewijs en kies één bronanker als onderbouwing.',
    anchor: bestAnchorForRoute(state.treatmentRoute.id)
  };
}

function toggleTreatmentQuestionRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    treatmentCoachAnswer.innerHTML = '<p>Spraakherkenning werkt niet in deze browser. Typ je vraag of gebruik Chrome/Edge.</p>';
    return;
  }

  const button = document.getElementById('speak-treatment-question');
  if (!treatmentRecognition) {
    treatmentRecognition = new SpeechRecognition();
    treatmentRecognition.lang = 'nl-NL';
    treatmentRecognition.interimResults = true;
    treatmentRecognition.continuous = false;
    treatmentRecognition.onresult = event => {
      treatmentQuestionInput.value = Array.from(event.results).map(result => result[0].transcript).join(' ');
    };
    treatmentRecognition.onend = () => {
      treatmentRecording = false;
      button.textContent = 'Spreek in';
      if (treatmentQuestionInput.value.trim()) answerTreatmentQuestion();
    };
  }

  if (treatmentRecording) {
    treatmentRecognition.stop();
    return;
  }

  treatmentRecording = true;
  button.textContent = 'Stop';
  treatmentCoachAnswer.innerHTML = '<p>Ik luister. Stel je vraag kort, bijvoorbeeld: “hoe formuleer ik een KT-doel?”</p>';
  treatmentRecognition.start();
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
    ${result.scan}
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
  const structureHits = ['omdat', 'daarom', 'functie', 'activiteit', 'participatie', 'advies', 'conclusie', 'methode', 'prognose', 'evaluatie'].filter(word => clean.includes(word));
  const lengthPoint = answer.split(/\s+/).length >= 45 ? 1 : 0;
  const raw = criterionHits.length + Math.min(2, caseHits.length) + Math.min(2, structureHits.length) + lengthPoint;
  const score = Math.min(5, Math.max(0, Math.round(raw / 3)));
  const missingChecks = state.criterion.checks.filter(check => !criterionHits.includes(check)).slice(0, 4);
  const scanGood = [
    ...criterionHits.slice(0, 6),
    ...caseHits.slice(0, 3).map(item => `casusbewijs: ${item}`),
    ...structureHits.slice(0, 4).map(item => `redeneerwoord: ${item}`)
  ];
  const scanMissing = [
    ...missingChecks,
    ...(!caseHits.length ? ['bewijs uit de casus'] : []),
    ...(!structureHits.includes('conclusie') && !structureHits.includes('advies') ? ['conclusie of advies'] : []),
    ...(!lengthPoint ? ['antwoord iets vollediger maken'] : [])
  ];

  return {
    score,
    label: labelFor(score),
    scan: coachScanHtml({
      good: scanGood,
      missing: scanMissing,
      vague: score >= 4 ? [] : ['Maak de brug expliciet: criterium -> casusbewijs -> gevolg voor functioneren.']
    }),
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
    ['Vaktaal', ['diagnose', 'icf', 'behandeling']],
    ['Mondeling', ['mdo', 'advies', 'behandeling']],
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
    behandeling: 'Verdedig behandeling: LT-doel, KT-doel, methode, vorm, duur, samenwerking en prognose.',
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

function coachScanHtml({ good = [], missing = [], vague = [] }) {
  const group = (className, label, items, emptyText) => `
    <div class="coach-scan__group ${className}">
      <span>${label}</span>
      <ul>${(items.length ? items : [emptyText]).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </div>
  `;
  return `
    <article class="coach-scan">
      <strong>Coachscan na inspreken</strong>
      <div class="coach-scan__grid">
        ${group('is-good', 'Groen · benoemd', good, 'Nog niets overtuigend benoemd.')}
        ${group('is-missing', 'Rood · mist nog', missing, 'Geen harde gaten meer.')}
        ${group('is-vague', 'Geel · maak scherper', vague, 'Nu vooral bondiger en toetsgerichter formuleren.')}
      </div>
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
