'use strict';

const data = window.ORAL_10_DATA;
const state = {
  activeView: 'diagnostics',
  diagnosticPrompt: data.diagnostics.prompts[0],
  therapyPrompt: data.therapy.prompts[0],
  simCase: data.cases[0],
  examCase: data.examCoach.cases[0],
  examMode: 'prep',
  scores: JSON.parse(localStorage.getItem('oral10_scores') || '{"diagnostics":0,"therapy":0}'),
  criteriaScores: JSON.parse(localStorage.getItem('oral10_criteria_scores') || '{"diagnostics":{},"therapy":{}}'),
  examScores: JSON.parse(localStorage.getItem('oral10_exam_scores') || '{}'),
  examScripts: JSON.parse(localStorage.getItem('oral10_exam_scripts') || '{}'),
};

const timerEl = document.getElementById('oral-timer');
const timerToggle = document.getElementById('timer-toggle');
const diagnosticPrompt = document.getElementById('diagnostic-prompt');
const therapyPrompt = document.getElementById('therapy-prompt');
const diagnosticChecks = document.getElementById('diagnostic-checks');
const therapyChecks = document.getElementById('therapy-checks');
const therapyRouteSelect = document.getElementById('therapy-route-select');
const therapyRouteDetail = document.getElementById('therapy-route-detail');
const therapyGoals = document.getElementById('therapy-goals');
const therapyMethods = document.getElementById('therapy-methods');
const therapyScript = document.getElementById('therapy-script');
const therapyDrill = document.getElementById('therapy-drill');
const therapyCollab = document.getElementById('therapy-collab');
const therapyRedflags = document.getElementById('therapy-redflags');
const wietzePrep = document.getElementById('wietze-prep');
const guideGrid = document.getElementById('guide-grid');
const oralDrill = document.getElementById('oral-drill');
const redFlags = document.getElementById('red-flags');
const simTitle = document.getElementById('sim-title');
const simCase = document.getElementById('sim-case');
const prepTools = document.getElementById('prep-tools');
const oralAnswer = document.getElementById('oral-answer');
const oralNote = document.getElementById('oral-note');
const feedback = document.getElementById('oral-feedback');
const feedbackHeading = document.getElementById('feedback-heading');
const feedbackPoints = document.getElementById('feedback-points');
const feedbackBody = document.getElementById('feedback-body');
const feedbackModel = document.getElementById('feedback-model');
const oralBars = document.getElementById('oral-bars');
const oralPlan = document.getElementById('oral-plan');
const examCaseSelect = document.getElementById('exam-case-select');
const examStatus = document.getElementById('exam-status');
const examCasePanel = document.getElementById('exam-case-panel');
const examPrepPanel = document.getElementById('exam-prep-panel');
const examScriptSteps = document.getElementById('exam-script-steps');
const examHistory = document.getElementById('exam-history');

let secondsLeft = 15 * 60;
let timerId = null;
let recognition = null;
let recording = false;
let activeDrill = data.drills[0];
let activeTherapyRoute = data.therapyMachine.routes[0];
let activeTherapyScript = data.therapyMachine.scripts[0];
let activeTherapyDrill = data.therapyMachine.drills[0];
let activeWietzeQuestion = data.wietzePrep.questions[0];

boot();

function boot() {
  renderPrompts();
  renderChecks();
  renderTherapyMachine();
  renderWietzePrep();
  renderGuide();
  renderDrill();
  renderRedFlags();
  renderSimulation();
  renderExamCoach();
  renderPrepTools();
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

  therapyRouteSelect.addEventListener('change', () => {
    activeTherapyRoute = data.therapyMachine.routes.find(route => route.id === therapyRouteSelect.value) || data.therapyMachine.routes[0];
    renderTherapyRoute();
  });

  examCaseSelect.addEventListener('change', () => {
    state.examCase = data.examCoach.cases.find(item => item.id === examCaseSelect.value) || data.examCoach.cases[0];
    state.examMode = 'prep';
    renderExamCoach();
  });

  document.querySelectorAll('[data-record]').forEach(btn => {
    btn.addEventListener('click', () => toggleRecording(`${btn.dataset.record}-prompt`));
  });

  document.getElementById('draw-card').addEventListener('click', () => {
    state.simCase = randomItem(data.cases);
    renderSimulation();
    renderPrepTools();
  });

  document.getElementById('exam-start-prep').addEventListener('click', () => {
    state.examMode = 'prep';
    secondsLeft = 15 * 60;
    renderTimer();
    renderExamCoach();
  });

  document.getElementById('exam-start-clean').addEventListener('click', () => {
    state.examMode = 'clean';
    secondsLeft = 15 * 60;
    renderTimer();
    renderExamCoach();
  });

  document.getElementById('exam-save-script').addEventListener('click', saveExamScript);
  document.getElementById('exam-reset').addEventListener('click', resetExamScores);

  document.getElementById('new-drill').addEventListener('click', () => {
    activeDrill = randomItem(data.drills);
    renderDrill();
  });

  document.getElementById('new-therapy-script').addEventListener('click', () => {
    activeTherapyScript = randomItem(data.therapyMachine.scripts);
    renderTherapyScript();
  });

  document.getElementById('new-therapy-drill').addEventListener('click', () => {
    activeTherapyDrill = randomItem(data.therapyMachine.drills);
    renderTherapyDrill();
  });

  document.getElementById('wietze-question').addEventListener('click', () => {
    activeWietzeQuestion = randomItem(data.wietzePrep.questions);
    renderWietzePrep();
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
  bindCriterionScores();
}

function renderTherapyMachine() {
  therapyRouteSelect.innerHTML = data.therapyMachine.routes.map(route => `
    <option value="${route.id}">${escapeHtml(route.title)}</option>
  `).join('');
  renderTherapyRoute();
  renderTherapyGoals();
  renderTherapyMethods();
  renderTherapyScript();
  renderTherapyDrill();
  renderTherapyCollab();
  therapyRedflags.innerHTML = data.therapyMachine.redFlags.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function renderTherapyRoute() {
  therapyRouteSelect.value = activeTherapyRoute.id;
  therapyRouteDetail.innerHTML = `
    <div class="oral-route-main">
      <h4>${escapeHtml(activeTherapyRoute.title)}</h4>
      <p>${escapeHtml(activeTherapyRoute.problem)}</p>
    </div>
    <div class="oral-route-grid">
      ${routeFact('LT-doel', activeTherapyRoute.lt)}
      ${routeFact('KT-doel', activeTherapyRoute.kt)}
      ${routeFact('Methode', activeTherapyRoute.method)}
      ${routeFact('Waarom', activeTherapyRoute.why)}
      ${routeFact('Vorm', activeTherapyRoute.form)}
      ${routeFact('Duur', activeTherapyRoute.duration)}
      ${routeFact('Samenwerking', activeTherapyRoute.collaboration)}
      ${routeFact('Prognose', activeTherapyRoute.prognosis)}
    </div>
  `;
}

function renderTherapyGoals() {
  therapyGoals.innerHTML = data.therapyMachine.goals.map(([domain, weak, strong]) => `
    <article>
      <strong>${escapeHtml(domain)}</strong>
      <span>${escapeHtml(weak)}</span>
      <p>${escapeHtml(strong)}</p>
    </article>
  `).join('');
}

function renderTherapyMethods() {
  therapyMethods.innerHTML = data.therapyMachine.methods.map(([method, indication, pitfall, script]) => `
    <article>
      <strong>${escapeHtml(method)}</strong>
      <span><b>Indicatie:</b> ${escapeHtml(indication)}</span>
      <span><b>Valkuil:</b> ${escapeHtml(pitfall)}</span>
      <p>${escapeHtml(script)}</p>
    </article>
  `).join('');
}

function renderTherapyScript() {
  const [scenario, script] = activeTherapyScript;
  therapyScript.innerHTML = `
    <strong>${escapeHtml(scenario)}</strong>
    <p>${escapeHtml(script)}</p>
    <span>Criterium 15 en 17</span>
  `;
}

function renderTherapyDrill() {
  const [question, answer, criterion] = activeTherapyDrill;
  therapyDrill.innerHTML = `
    <strong>${escapeHtml(question)}</strong>
    <p>${escapeHtml(answer)}</p>
    <span>${escapeHtml(criterion)}</span>
  `;
}

function renderTherapyCollab() {
  therapyCollab.innerHTML = `
    <div class="oral-collab-list">
      ${data.therapyMachine.collaboration.map(([discipline, ask, agree, why]) => `
        <article>
          <strong>${escapeHtml(discipline)}</strong>
          <span><b>Weten:</b> ${escapeHtml(ask)}</span>
          <span><b>Afspreken:</b> ${escapeHtml(agree)}</span>
          <p>${escapeHtml(why)}</p>
        </article>
      `).join('')}
    </div>
    <div class="oral-prognosis-list">
      ${data.therapyMachine.prognosis.map(([profile, text]) => `
        <p><strong>${escapeHtml(profile)}:</strong> ${escapeHtml(text)}</p>
      `).join('')}
    </div>
  `;
}

function renderWietzePrep() {
  const w = data.wietzePrep;
  const [question, answer] = activeWietzeQuestion;
  wietzePrep.innerHTML = `
    ${wietzeBlock('30 seconden pitch', `<p>${escapeHtml(w.pitch)}</p>`)}
    ${wietzeBlock('Differentiaal redeneren', listHtml(w.differential))}
    ${wietzeBlock('ICF-brug', factListHtml(w.icf))}
    ${wietzeBlock('12-weken plan', factListHtml(w.plan))}
    ${wietzeBlock('LT/KT-doelen', factListHtml(w.goals))}
    ${wietzeBlock('Methodekeuze', factListHtml(w.methods))}
    ${wietzeBlock('ZG-scripts', listHtml(w.scripts))}
    ${wietzeBlock('Samenwerking', factListHtml(w.collaboration))}
    ${wietzeBlock('Prognose', `<p>${escapeHtml(w.prognosis)}</p>`)}
    ${wietzeBlock('Docentvraag', `<strong>${escapeHtml(question)}</strong><p>${escapeHtml(answer)}</p>`)}
    ${wietzeBlock('ZG-spiekkaart', listHtml(w.cheat))}
  `;
}

function wietzeBlock(title, body) {
  return `<article><h4>${escapeHtml(title)}</h4>${body}</article>`;
}

function listHtml(items) {
  return `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function factListHtml(items) {
  return `<div>${items.map(([label, text]) => `
    <p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(text)}</p>
  `).join('')}</div>`;
}

function routeFact(label, value) {
  return `<div><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></div>`;
}

function renderGuide() {
  const startCard = `
    <article>
      <h4>Startpunten Taalbegrip</h4>
      <ul>
        ${data.startRules.map(([age, start, returnRule]) => `<li><strong>${escapeHtml(age)}:</strong> ${escapeHtml(start)}; ${escapeHtml(returnRule)}</li>`).join('')}
      </ul>
      <p><strong>Valkuil:</strong> startkeuze noemen zonder kalenderleeftijd te verantwoorden.</p>
    </article>
  `;
  guideGrid.innerHTML = data.guideCards.map(card => `
    <article>
      <h4>${escapeHtml(card.title)}</h4>
      <ul>
        ${card.must.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
      <p><strong>Valkuil:</strong> ${escapeHtml(card.pitfall)}</p>
    </article>
  `).join('') + startCard;
}

function renderDrill() {
  const [question, answer, criterion] = activeDrill;
  oralDrill.innerHTML = `
    <strong>${escapeHtml(question)}</strong>
    <p>${escapeHtml(answer)}</p>
    <span>${escapeHtml(criterion)}</span>
  `;
}

function renderRedFlags() {
  redFlags.innerHTML = data.redFlags.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function checksHtml(group, criteria) {
  const offset = group === 'therapy' ? 10 : 0;
  return criteria.map(([id, label], index) => {
    const number = offset + index + 1;
    const critical = isCritical(group, number);
    const saved = state.criteriaScores[group]?.[id] ?? 0;
    return `
    <label class="${critical ? 'is-critical' : ''}">
      <span>${number}. ${escapeHtml(label)} ${critical ? '<b>Kritisch · minimaal V</b>' : ''}</span>
      <select data-group="${group}" data-criterion="${id}" data-number="${number}" aria-label="Score criterium ${number}">
        ${data.scoreScale.map(([value, code, labelText]) => `
          <option value="${value}" ${Number(saved) === value ? 'selected' : ''}>(${value}) ${code} · ${escapeHtml(labelText)}</option>
        `).join('')}
      </select>
    </label>
  `;
  }).join('');
}

function bindCriterionScores() {
  document.querySelectorAll('.oral-checks select').forEach(select => {
    select.addEventListener('change', () => {
      const group = select.dataset.group;
      const id = select.dataset.criterion;
      if (!state.criteriaScores[group]) state.criteriaScores[group] = {};
      state.criteriaScores[group][id] = Number(select.value);
      saveCriteriaScores();
    });
  });
}

function renderSimulation() {
  simTitle.textContent = state.simCase.title;
  simCase.innerHTML = `
    <div><strong>Casusprikkel</strong><span>${escapeHtml(state.simCase.context)}</span></div>
    <div><strong>Jij moet</strong><span>${escapeHtml(state.simCase.task)}</span></div>
  `;
}

function renderExamCoach() {
  const active = state.examCase;
  examCaseSelect.innerHTML = data.examCoach.cases.map(item => `
    <option value="${item.id}" ${item.id === active.id ? 'selected' : ''}>${escapeHtml(item.title)}</option>
  `).join('');

  const caseScores = examCaseScores(active.id);
  const values = Object.values(caseScores);
  const best = values.length ? Math.max(...values) : 0;
  const low = values.length ? Math.min(...values) : 0;
  const total = active.steps.reduce((sum, step) => sum + Number(caseScores[criterionNumber(step)] || 0), 0);
  const grade = gradeFor(total);
  const modeLabel = state.examMode === 'clean' ? 'Kale toets: steun staat uit' : 'Prepmodus: intensieve coaching staat aan';

  examStatus.innerHTML = `
    <div>
      <strong>${escapeHtml(modeLabel)}</strong>
      <span>${total}/40 · ${formatGrade(grade)} · laagste ${scoreBadge(low)} · hoogste ${scoreBadge(best)}</span>
    </div>
    <meter min="0" max="40" value="${total}">${total}/40</meter>
  `;

  examCasePanel.innerHTML = `
    <div>
      <strong>Toetsbeschrijving</strong>
      <p>${escapeHtml(data.examCoach.intro)}</p>
    </div>
    <div>
      <strong>Casus</strong>
      <p>${escapeHtml(active.profile)}</p>
    </div>
    <div>
      <strong>Valkuil</strong>
      <p>${escapeHtml(active.trap)}</p>
    </div>
    <div>
      <strong>Wat moet je raken?</strong>
      <p>${active.focus.map(item => escapeHtml(item)).join(' · ')}</p>
    </div>
    <div>
      <strong>Toetsflow</strong>
      <p>${data.examCoach.toetsFlow.map(item => escapeHtml(item)).join(' · ')}</p>
    </div>
  `;

  examPrepPanel.hidden = state.examMode === 'clean';
  examPrepPanel.innerHTML = state.examMode === 'clean' ? '' : examPrepHtml(active);
  examScriptSteps.innerHTML = active.steps.map(step => examStepHtml(active, step, caseScores)).join('');
  bindExamStepEvents();
  renderExamHistory();
}

function examPrepHtml(active) {
  return `
    <section class="oral-prep-timeline">
      ${[
        ['0-3 min', 'Lees de casus en zeg hardop de diagnosehypothese plus participatieprobleem.'],
        ['3-6 min', 'Schrijf LT en KT. LT is functioneren; KT is meetbaar gedrag in behandelperiode.'],
        ['6-10 min', 'Kies methode en therapievorm. Dit zijn kritische punten: altijd “omdat” zeggen.'],
        ['10-13 min', 'Vul duur/frequentie, samenwerking en prognose aan. Maak rollen concreet.'],
        ['13-15 min', 'Spreek je volledige script één keer zonder te lezen. Kort, klinisch, zeker.']
      ].map(([time, text]) => `
        <article>
          <strong>${escapeHtml(time)}</strong>
          <span>${escapeHtml(text)}</span>
        </article>
      `).join('')}
    </section>
    <section class="oral-zg-script">
      <h4>ZG-script in één adem</h4>
      <p>${escapeHtml(examModelScript(active))}</p>
    </section>
  `;
}

function examStepHtml(active, step, caseScores) {
  const [title, coach, script] = step;
  const number = criterionNumber(step);
  const savedScript = state.examScripts[scriptKey(active.id, number)] || script;
  const savedScore = caseScores[number];
  const current = savedScore === undefined ? null : Number(savedScore);
  const visibleScore = current ?? autoScoreExamStep(active, number, savedScript);
  const clean = state.examMode === 'clean';
  return `
    <article class="oral-exam-step" data-exam-step="${number}">
      <div class="oral-exam-step__head">
        <div>
          <span>${escapeHtml(title)}</span>
          <strong>${escapeHtml(clean ? 'Toetsantwoord zonder steun' : coach)}</strong>
        </div>
        <em>${scoreBadge(visibleScore)}</em>
      </div>
      ${clean ? '' : `<p>${escapeHtml(coach)}</p>`}
      ${clean ? '<p class="oral-clean-note">Spreek dit onderdeel uit je hoofd. Vul na afloop alleen je kernzin in en score hem.</p>' : `<label>Jouw ZG-zin<textarea rows="3" data-exam-script="${number}">${escapeHtml(savedScript)}</textarea></label>`}
      ${clean ? `<textarea rows="3" data-exam-script="${number}" placeholder="Typ na je mondeling kort wat je zei bij criterium ${number}."></textarea>` : ''}
      <div class="oral-score-buttons" role="group" aria-label="Score criterium ${number}">
        ${data.scoreScale.map(([value, code]) => `
          <button type="button" class="${value === current ? 'is-active' : ''}" data-exam-score="${number}" data-value="${value}">(${value}) ${code}</button>
        `).join('')}
      </div>
      <div class="oral-step-feedback" data-exam-feedback="${number}">${examCriterionFeedback(active, step, current)}</div>
    </article>
  `;
}

function renderPrepTools() {
  const tools = modeForCurrentCase('') === 'therapy' ? data.therapyPrepTools : data.prepTools;
  prepTools.innerHTML = `
    <h4>Start je voorbereiding hier</h4>
    <div>
      ${tools.map(tool => `
        <a href="${tool.href}">
          <strong>${escapeHtml(tool.title)}</strong>
          <span>${escapeHtml(tool.text)}</span>
        </a>
      `).join('')}
    </div>
  `;
}

function scoreChecklist(group) {
  const selects = [...document.querySelectorAll(`select[data-group="${group}"]`)];
  const points = selects.reduce((sum, select) => sum + Number(select.value), 0);
  if (!state.criteriaScores[group]) state.criteriaScores[group] = {};
  selects.forEach(select => {
    state.criteriaScores[group][select.dataset.criterion] = Number(select.value);
  });
  state.scores[group] = points;
  saveCriteriaScores();
  saveScores();
  renderDashboard();
  showView('dashboard');
}

function bindExamStepEvents() {
  examScriptSteps.querySelectorAll('[data-exam-script]').forEach(input => {
    input.addEventListener('input', () => {
      const number = input.dataset.examScript;
      state.examScripts[scriptKey(state.examCase.id, number)] = input.value;
      saveExamScripts();
      const feedbackBox = examScriptSteps.querySelector(`[data-exam-feedback="${number}"]`);
      if (feedbackBox) feedbackBox.innerHTML = examLiveFeedback(state.examCase, number, input.value);
    });
  });

  examScriptSteps.querySelectorAll('[data-exam-score]').forEach(button => {
    button.addEventListener('click', () => {
      const number = button.dataset.examScore;
      const value = Number(button.dataset.value);
      saveExamScore(state.examCase.id, number, value);
      renderExamCoach();
    });
  });
}

function saveExamScript() {
  state.examCase.steps.forEach(step => {
    const number = criterionNumber(step);
    const input = examScriptSteps.querySelector(`[data-exam-script="${number}"]`);
    if (input) state.examScripts[scriptKey(state.examCase.id, number)] = input.value;
  });
  saveExamScripts();
  examStatus.querySelector('strong').textContent = 'Script bewaard. Nu kaal oefenen.';
}

function resetExamScores() {
  delete state.examScores[state.examCase.id];
  saveExamScores();
  renderExamCoach();
}

function saveExamScore(caseId, number, value) {
  if (!state.examScores[caseId]) state.examScores[caseId] = {};
  state.examScores[caseId][number] = value;
  state.criteriaScores.therapy = state.criteriaScores.therapy || {};
  const criterion = data.therapy.criteria[number - 11];
  if (criterion) state.criteriaScores.therapy[criterion[0]] = Math.max(Number(state.criteriaScores.therapy[criterion[0]] || 0), value);
  state.scores.therapy = Math.max(state.scores.therapy || 0, examTotal(caseId));
  saveExamScores();
  saveCriteriaScores();
  saveScores();
  renderDashboard();
}

function examCaseScores(caseId) {
  return state.examScores[caseId] || {};
}

function examTotal(caseId) {
  const active = data.examCoach.cases.find(item => item.id === caseId) || state.examCase;
  const scores = examCaseScores(caseId);
  return active.steps.reduce((sum, step) => sum + Number(scores[criterionNumber(step)] || 0), 0);
}

function criterionNumber(step) {
  return Number(step[0].split('.')[0]);
}

function scriptKey(caseId, number) {
  return `${caseId}:${number}`;
}

function examModelScript(active) {
  return active.steps.map(step => step[2]).join(' ');
}

function autoScoreExamStep(active, number, text) {
  const step = active.steps.find(item => criterionNumber(item) === Number(number));
  if (!step) return 0;
  const clean = normalize(text);
  const keywords = step[3] || [];
  const hits = keywords.filter(word => clean.includes(normalize(word))).length;
  const hasReason = ['omdat', 'daarom', 'past', 'passend', 'waardoor'].some(word => clean.includes(word));
  const hasMeasure = /\b(80|8 van de 10|8\/10|wekelijks|dagelijks|8 tot 12|8-12|evalu)/.test(clean);

  let score = 0;
  if (hits >= 1) score = 1;
  if (hits >= 2) score = 2;
  if (hits >= 3 && (hasReason || ![15, 17].includes(Number(number)))) score = 3;
  if (hits >= Math.min(4, keywords.length) && (hasReason || ![15, 17].includes(Number(number))) && (hasMeasure || ![13, 18].includes(Number(number)))) score = 4;
  if ([15, 17].includes(Number(number)) && !hasReason) score = Math.min(score, 2);
  return score;
}

function examCriterionFeedback(active, step, current) {
  const number = criterionNumber(step);
  const text = state.examScripts[scriptKey(active.id, number)] || step[2];
  return examLiveFeedback(active, number, text, current);
}

function examLiveFeedback(active, number, text, manualScore = null) {
  const step = active.steps.find(item => criterionNumber(item) === Number(number));
  if (!step) return '';
  const auto = autoScoreExamStep(active, number, text);
  const score = manualScore ?? auto;
  const clean = normalize(text);
  const keywords = step[3] || [];
  const missing = keywords.filter(word => !clean.includes(normalize(word)));
  const critical = [15, 17].includes(Number(number));
  const reasonMissing = critical && !['omdat', 'daarom', 'past', 'passend', 'waardoor'].some(word => clean.includes(word));
  const next = reasonMissing
    ? 'Voeg “omdat...” toe. Dit is kritisch: zonder verantwoording blijft dit maximaal (2) V.'
    : missing.length
      ? `Voeg nog toe: ${missing.slice(0, 3).join(', ')}.`
      : 'Toetsklaar. Spreek nu zonder lezen, met rustige volgorde.';
  return `
    <strong>${scoreBadge(score)} · ${score >= 4 ? 'ZG-proof' : 'nog niet dichtgetimmerd'}</strong>
    <p>${escapeHtml(next)}</p>
  `;
}

function renderExamHistory() {
  const rows = data.examCoach.cases.map(item => {
    const total = examTotal(item.id);
    const values = Object.values(examCaseScores(item.id));
    const low = values.length ? Math.min(...values) : 0;
    const high = values.length ? Math.max(...values) : 0;
    return { item, total, low, high, grade: gradeFor(total) };
  });
  const best = rows.reduce((winner, row) => row.total > winner.total ? row : winner, rows[0]);
  const weakest = rows.reduce((loser, row) => row.total < loser.total ? row : loser, rows[0]);
  examHistory.innerHTML = `
    <div class="oral-history-head">
      <span>Beste casus: ${escapeHtml(best.item.title)} · ${best.total}/40</span>
      <span>Laagste casus: ${escapeHtml(weakest.item.title)} · ${weakest.total}/40</span>
    </div>
    <div class="oral-history-grid">
      ${rows.map(row => `
        <button type="button" data-history-case="${row.item.id}" class="${row.item.id === state.examCase.id ? 'is-active' : ''}">
          <strong>${escapeHtml(row.item.title)}</strong>
          <span>${row.total}/40 · ${formatGrade(row.grade)} · laag ${scoreBadge(row.low)} · hoog ${scoreBadge(row.high)}</span>
        </button>
      `).join('')}
    </div>
  `;
  examHistory.querySelectorAll('[data-history-case]').forEach(button => {
    button.addEventListener('click', () => {
      state.examCase = data.examCoach.cases.find(item => item.id === button.dataset.historyCase) || state.examCase;
      renderExamCoach();
    });
  });
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
    'handleiding', 'fout', 'betrouwbaar', 'testsituatie', 'tempo', 'prosodie',
    'morfosyntaxis', 'terugkeerregel', 'respons', 'taalbegrip', 'zinsontwikkeling',
    'lt', 'kt', 'frequentie', 'evaluatie', 'ouders', 'leerkracht', 'icf',
    'participatie', 'generalisatie', 'fonologisch', 'fonetisch', 'vod', 'tos',
    'scaffolding', 'recasting', 'metaphon', 'minimale paren', 'wietze',
    'tiq', 'visuele steun', 'jaarhandelingsplan', 'therapievorm', 'vorm',
    'meertaligheid', 'thuistaal', 'blootstelling', 'nt2', 'school'
  ];
  const hits = rubricWords.filter(word => clean.includes(word));
  const structure = ['omdat', 'dus', 'daarom', 'passend', 'concreet'].filter(word => clean.includes(word));
  let points = Math.min(4, Math.round((hits.length + structure.length) / 4));
  const mode = modeForCurrentCase(clean);
  const targetWords = targetWordsForMode(mode);
  const targetHits = targetWords.filter(word => hits.includes(word));
  const targetMissing = targetWords.filter(word => !hits.includes(word));
  const hasCritical = criticalEvidence(mode, clean, structure);
  const scoreCaps = [];

  if (hits.length === 0) {
    points = 0;
    scoreCaps.push('Score blijft op (0) O: er staat nog geen herkenbare vaktaal of criteriumbewijs in je antwoord.');
  } else if (hits.length < 2 && points > 1) {
    points = 1;
    scoreCaps.push('Scoreplafond (1) BV: je noemt te weinig rubricwoorden om een voldoende te dragen.');
  }

  if (!hasCritical && points > 2) {
    points = 2;
    scoreCaps.push(criticalCapLine(mode));
  }

  if (structure.length === 0 && points > 2) {
    points = 2;
    scoreCaps.push('Scoreplafond (2) V: je noemt termen, maar je redeneert nog niet hardop met omdat, daarom, passend of concreet.');
  }

  if (targetMissing.length >= 4 && points > 2) {
    points = 2;
    scoreCaps.push(`Scoreplafond (2) V: te veel kerncriteria ontbreken (${targetMissing.slice(0, 4).join(', ')}).`);
  }

  if (points === 2 && scoreCaps.length === 0) {
    scoreCaps.push('Dit is (2) V: de basis is herkenbaar, maar voor (3) G moet je explicieter koppelen aan criterium, casusbewijs en verantwoording.');
  }

  state.scores[mode] = Math.max(state.scores[mode], points * 10);
  saveScores();

  feedback.hidden = false;
  feedbackHeading.textContent = labelFor(points);
  feedbackPoints.textContent = scoreBadge(points);
  feedbackBody.innerHTML = `
    ${coachScanHtml({
      good: [...targetHits, ...structure.map(word => `structuurwoord: ${word}`)],
      missing: [...targetMissing, ...scoreCaps],
      vague: hasCritical ? [] : [criticalVagueLine(mode)]
    })}
    ${block('Sterk', hits.length ? `Je gebruikt toetswoorden: ${hits.slice(0, 6).join(', ')}.` : 'Je start. Voeg nu vaktaal toe.')}
    ${block('Waarom deze score', scoreReason(points, scoreCaps))}
    ${block('Mist', missingLine(targetMissing, scoreCaps))}
    ${block('Kost punten', criticalFeedback(mode, hasCritical, points, scoreCaps))}
    ${block('Volgende poging', nextAttemptLine(points, mode, targetMissing, scoreCaps))}
    ${points < 4 ? redRetryHtml() : ''}
  `;
  bindRedRetry(feedbackBody, oralAnswer, oralNote);
  feedbackModel.textContent = state.simCase.model || (mode === 'therapy' ? data.therapy.model : data.diagnostics.model);
  renderDashboard();
  feedback.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function modeForCurrentCase(clean = '') {
  if (state.simCase.mode) return state.simCase.mode;
  if (clean.includes('therapie') || clean.includes('doel') || clean.includes('methode')) return 'therapy';
  return 'diagnostics';
}

function missingLine(targetMissing, scoreCaps = []) {
  if (scoreCaps.length) return scoreCaps[0];
  return targetMissing.length ? `Voeg expliciet toe: ${targetMissing.slice(0, 4).join(', ')}.` : 'Geen harde gaten meer; maak je formulering strakker en toetsgerichter.';
}

function targetWordsForMode(mode) {
  if (state.simCase.targetWords) return state.simCase.targetWords;
  return mode === 'therapy'
    ? ['lt', 'kt', 'methode', 'therapievorm', 'samenwerking', 'prognose']
    : ['testsituatie', 'neutraal', 'intonatie', 'score', 'afbreekregel', 'fout'];
}

function criticalEvidence(mode, clean, structure) {
  if (mode === 'therapy') {
    const hasMethod = [
      'methode', 'metaphon', 'minimale paren', 'hodson', 'prompt',
      'scaffolding', 'recasting', 'motorisch', 'fonologisch',
      'oudercoaching', 'interventie', 'taalsteun', 'visuele steun'
    ].some(word => clean.includes(word));
    const hasForm = [
      'therapievorm', 'vorm', 'individueel', 'groep', 'direct',
      'indirect', 'ouders', 'school', 'leerkracht', 'thuis'
    ].some(word => clean.includes(word));
    return hasMethod && hasForm && structure.length > 0;
  }

  const hasFault = ['fout', 'zelfcorrectie', 'verspreking', 'risico', 'verantwoord'].some(word => clean.includes(word));
  const hasValidity = ['betrouwbaar', 'betrouwbaarheid', 'validiteit', 'standaardisatie', 'beinvloed'].some(word => clean.includes(word));
  return hasFault && hasValidity;
}

function renderDashboard() {
  const diagnostic = state.scores.diagnostics || 0;
  const therapy = state.scores.therapy || 0;
  const diagnosticGrade = gradeFor(diagnostic);
  const therapyGrade = gradeFor(therapy);
  const diagnosticCritical = criticalOk('diagnostics');
  const therapyCritical = criticalOk('therapy');
  const total = diagnostic >= 20 && therapy >= 20 && diagnosticCritical.ok && therapyCritical.ok
    ? ((diagnosticGrade + therapyGrade) / 2).toFixed(1)
    : 'onvoldoende';

  oralBars.innerHTML = [
    ['Diagnostiek', diagnostic, diagnosticGrade, diagnosticCritical],
    ['Therapie', therapy, therapyGrade, therapyCritical],
    ['Eindbeeld', Math.min(40, Math.round((diagnostic + therapy) / 2)), total, { ok: diagnosticCritical.ok && therapyCritical.ok, message: data.criticalNote }]
  ].map(([label, points, grade, critical]) => `
    <div class="oral-bar">
      <div><strong>${label}</strong><span>${points}/40 · ${formatGrade(grade)}</span></div>
      <meter min="0" max="40" value="${points}">${points}/40</meter>
      <p>${escapeHtml(critical.ok ? 'Kritische criteria op minimaal V.' : critical.message)}</p>
    </div>
  `).join('');

  oralPlan.innerHTML = planFor(diagnostic, therapy, diagnosticCritical, therapyCritical).map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function planFor(diagnostic, therapy, diagnosticCritical, therapyCritical) {
  if (!diagnosticCritical.ok) {
    return ['Eerst criterium 10: benoem je eigen fout, versprekingen of zelfcorrectie en verantwoord invloed op validiteit/betrouwbaarheid.', 'Oefen één zin: “Ik merkte dat..., daardoor..., daarom beoordeel ik dit item als...”.', 'Pas daarna opnieuw je diagnostiekscore invullen.'];
  }
  if (!therapyCritical.ok) {
    return ['Eerst criterium 15 en 17: motiveer methode én therapievorm minimaal op V-niveau.', 'Oefen: “Ik kies deze methode omdat... Deze therapievorm past omdat...”.', 'Koppel beide keuzes expliciet aan beginsituatie, doelen en generalisatie.'];
  }
  if (diagnostic >= 36 && therapy >= 36) {
    return ['Vandaag: volledige simulatie zonder spiekkaart.', 'Morgen: alleen fouten verantwoorden en prognose oefenen.', 'Laatste check: 30 minuten in tweetal op echt toetsritme.'];
  }
  if (diagnostic < therapy) {
    return ['Vandaag: Taalbegrip-3 neutrale toon en Zinsontwikkeling-intonatie hardop oefenen.', 'Daarna: leeftijd berekenen, startsectie kiezen en afbreekregels zonder aarzeling reproduceren.', 'Eindig met criterium 10: benoem één fout en verantwoord de invloed.'];
  }
  return ['Vandaag: LT-doel en KT-doel voor drie casussen formuleren.', 'Daarna: methode, therapievorm en duur steeds verantwoorden.', 'Eindig met samenwerking en prognose in maximaal 60 seconden.'];
}

function gradeFor(points) {
  const match = data.scoreTable.find(([max]) => points <= max);
  return match ? match[1] : 10.0;
}

function formatGrade(value) {
  return typeof value === 'number' ? value.toFixed(1) : value;
}

function scoreCode(points) {
  const row = data.scoreScale.find(([value]) => value === points);
  return row ? row[1] : 'O';
}

function scoreBadge(points) {
  return `(${points}) ${scoreCode(points)}`;
}

function isCritical(group, number) {
  return (data.criticalCriteria[group] || []).includes(number);
}

function criticalOk(group) {
  const scores = state.criteriaScores[group] || {};
  const criteria = group === 'therapy' ? data.therapy.criteria : data.diagnostics.criteria;
  const offset = group === 'therapy' ? 10 : 0;
  const missing = criteria
    .map(([id], index) => ({ id, number: offset + index + 1, score: Number(scores[id] || 0) }))
    .filter(item => isCritical(group, item.number) && item.score < 2);
  return {
    ok: missing.length === 0,
    message: missing.length
      ? `Kritisch criterium ${missing.map(item => item.number).join(', ')} staat onder V. Zet deze minimaal op (2) V.`
      : 'Kritische criteria op minimaal V.'
  };
}

function criticalCapLine(mode) {
  return mode === 'therapy'
    ? 'Scoreplafond (2) V: criterium 15/17 ontbreekt of is te vaag. Motiveer methode én therapievorm vanuit beginsituatie, doelen en generalisatie.'
    : 'Scoreplafond (2) V: criterium 10 ontbreekt of is te vaag. Benoem eigen handelen, fout/zelfcorrectie en invloed op betrouwbaarheid of validiteit.';
}

function criticalVagueLine(mode) {
  return mode === 'therapy'
    ? 'criterium 15/17: methode en therapievorm zijn nog niet toetsveilig verantwoord'
    : 'criterium 10: fout/zelfcorrectie en betrouwbaarheid/validiteit zijn nog niet toetsveilig verantwoord';
}

function scoreReason(points, scoreCaps) {
  if (scoreCaps.length) return scoreCaps.join(' ');
  if (points >= 4) return 'Je antwoord bevat kerncriteria, redeneerwoorden en voldoende casuskoppeling voor (4) ZG.';
  if (points === 3) return 'Je antwoord is goed, maar mist nog één scherpe koppeling of één volledig uitgewerkte verantwoording voor (4) ZG.';
  if (points === 1) return 'Je antwoord raakt het onderwerp, maar bevat nog te weinig toetsbewijs voor een voldoende.';
  return 'Je antwoord is nog niet beoordelbaar op rubricniveau.';
}

function nextAttemptLine(points, mode, targetMissing, scoreCaps) {
  if (scoreCaps.length) {
    return mode === 'therapy'
      ? 'Zeg opnieuw: beginsituatie -> LT/KT -> methode omdat... -> therapievorm omdat... -> transfer/prognose.'
      : 'Zeg opnieuw: wat deed ik -> wat ging fout of was risicovol -> invloed op respons -> betrouwbaarheid/validiteit.';
  }
  if (targetMissing.length) return `Herhaal in 45 seconden en verwerk: ${targetMissing.slice(0, 3).join(', ')}.`;
  return points >= 3 ? 'Herhaal in 45 seconden. Voeg één foutverantwoording of één therapiekeuze toe.' : 'Zeg: kernzin -> criterium -> casusbewijs -> verantwoording.';
}

function criticalFeedback(mode, hasCritical, points, scoreCaps = []) {
  if (scoreCaps.length) return scoreCaps.join(' ');
  if (hasCritical && points >= 3) {
    return 'Let nog op casusbewijs, maar het kritische criterium is herkenbaar aanwezig.';
  }
  if (mode === 'therapy') {
    return 'Criterium 15 en 17 tellen zwaar: motiveer methode én therapievorm vanuit beginsituatie, doelen en generalisatie.';
  }
  return 'Criterium 10 telt zwaar: benoem je eigen handelen, fout/zelfcorrectie en de invloed op betrouwbaarheid of validiteit.';
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
    recognition.onerror = event => {
      recording = false;
      oralNote.textContent = recognitionErrorMessage(event.error, 'Neem op');
    };
  }
  if (recording) {
    recognition.stop();
    return;
  }
  recording = true;
  showView('simulation');
  oralNote.textContent = target === 'main' ? 'Opname loopt.' : 'Opname loopt. Je antwoord komt in de simulatiebox.';
  try {
    recognition.start();
  } catch {
    recording = false;
    oralNote.textContent = 'De opname kon niet starten. Klik nog één keer op Neem op of typ je antwoord.';
  }
}

function recognitionErrorMessage(error, actionLabel = 'Neem op') {
  const messages = {
    'not-allowed': 'Microfoon niet toegestaan. Geef microfoontoegang in de browser of typ je antwoord.',
    'audio-capture': 'Geen microfoon gevonden. Controleer je microfoon of typ je antwoord.',
    network: 'Spraakherkenning krijgt geen verbinding. Typ je antwoord of probeer Chrome/Edge.',
    'no-speech': `Ik hoorde geen spraak. Klik opnieuw op ${actionLabel} en spreek iets dichter bij de microfoon.`,
    aborted: 'Opname gestopt.'
  };
  return messages[error] || 'Opname werkt hier niet goed. Typ je antwoord of probeer Chrome/Edge.';
}

function saveScores() {
  localStorage.setItem('oral10_scores', JSON.stringify(state.scores));
}

function saveCriteriaScores() {
  localStorage.setItem('oral10_criteria_scores', JSON.stringify(state.criteriaScores));
}

function saveExamScores() {
  localStorage.setItem('oral10_exam_scores', JSON.stringify(state.examScores));
}

function saveExamScripts() {
  localStorage.setItem('oral10_exam_scripts', JSON.stringify(state.examScripts));
}

function block(title, body) {
  return `<article><h4>${escapeHtml(title)}</h4><p>${escapeHtml(body)}</p></article>`;
}

function redRetryHtml() {
  return `
    <article class="red-retry-card">
      <strong>Rood naar groen</strong>
      <p>Laat je kernzin staan. Voeg alleen het ontbrekende criteriumwoord of de verantwoording toe en check opnieuw.</p>
      <button class="btn btn--primary" type="button" data-red-retry>Probeer opnieuw met rood</button>
    </article>
  `;
}

function bindRedRetry(container, input, note) {
  const button = container.querySelector('[data-red-retry]');
  if (!button) return;
  button.addEventListener('click', () => {
    input.focus();
    note.textContent = 'Nieuwe poging: voeg alleen de rode punten toe.';
  });
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
        ${group('is-good', 'Groen · benoemd', good, 'Nog niets uit de kernlijst benoemd.')}
        ${group('is-missing', 'Rood · mist nog', missing, 'Geen harde gaten meer.')}
        ${group('is-vague', 'Geel · kritiek punt', vague, 'Kritische criteria lijken geborgd.')}
      </div>
    </article>
  `;
}

function labelFor(points) {
  if (points >= 4) return '(4) ZG · zeer goed';
  if (points === 3) return '(3) G · goed';
  if (points === 2) return '(2) V · voldoende';
  if (points === 1) return '(1) BV · bijna voldoende';
  return '(0) O · onvoldoende';
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
