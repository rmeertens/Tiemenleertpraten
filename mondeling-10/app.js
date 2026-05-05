'use strict';

const data = window.ORAL_10_DATA;
const state = {
  activeView: 'diagnostics',
  diagnosticPrompt: data.diagnostics.prompts[0],
  therapyPrompt: data.therapy.prompts[0],
  simCase: data.cases[0],
  scores: JSON.parse(localStorage.getItem('oral10_scores') || '{"diagnostics":0,"therapy":0}'),
  criteriaScores: JSON.parse(localStorage.getItem('oral10_criteria_scores') || '{"diagnostics":{},"therapy":{}}'),
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

  document.querySelectorAll('[data-record]').forEach(btn => {
    btn.addEventListener('click', () => toggleRecording(`${btn.dataset.record}-prompt`));
  });

  document.getElementById('draw-card').addEventListener('click', () => {
    state.simCase = randomItem(data.cases);
    renderSimulation();
  });

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
          <option value="${value}" ${Number(saved) === value ? 'selected' : ''}>${value} · ${code} · ${escapeHtml(labelText)}</option>
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

function renderPrepTools() {
  prepTools.innerHTML = `
    <h4>Start je voorbereiding hier</h4>
    <div>
      ${data.prepTools.map(tool => `
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
    'tiq', 'visuele steun', 'jaarhandelingsplan'
  ];
  const hits = rubricWords.filter(word => clean.includes(word));
  const structure = ['omdat', 'dus', 'daarom', 'passend', 'concreet'].filter(word => clean.includes(word));
  let points = Math.min(4, Math.round((hits.length + structure.length) / 4));
  const mode = clean.includes('therapie') || clean.includes('doel') || clean.includes('methode') ? 'therapy' : 'diagnostics';
  const hasCritical = mode === 'therapy'
    ? ['methode', 'verantwoord', 'vorm', 'therapievorm', 'waarom'].some(word => clean.includes(word))
    : ['fout', 'zelfcorrectie', 'verantwoord', 'betrouwbaar', 'validiteit'].some(word => clean.includes(word));
  if (!hasCritical && points > 2) points = 2;
  const targetWords = targetWordsForMode(mode);
  const targetHits = targetWords.filter(word => hits.includes(word));
  const targetMissing = targetWords.filter(word => !hits.includes(word));
  state.scores[mode] = Math.max(state.scores[mode], points * 10);
  saveScores();

  feedback.hidden = false;
  feedbackHeading.textContent = labelFor(points);
  feedbackPoints.textContent = `${points}/4 · ${scoreCode(points)}`;
  feedbackBody.innerHTML = `
    ${coachScanHtml({
      good: [...targetHits, ...structure.map(word => `structuurwoord: ${word}`)],
      missing: targetMissing,
      vague: hasCritical ? [] : [mode === 'therapy' ? 'criterium 15/17: motiveer methode en therapievorm' : 'criterium 10: benoem fout en betrouwbaarheid/validiteit']
    })}
    ${block('Goed', hits.length ? `Je gebruikt toetswoorden: ${hits.slice(0, 6).join(', ')}.` : 'Je durft te antwoorden, maar vaktaal ontbreekt nog.')}
    ${block('Mist', missingLine(hits, mode))}
    ${block('Kost punten', criticalFeedback(mode, hasCritical, points))}
    ${block('Volgende poging', points >= 3 ? 'Zeg hetzelfde nu in 45 seconden met één foutverantwoording of één therapiekeuze extra.' : 'Gebruik: kernzin -> criterium -> casusbewijs -> verantwoording.')}
  `;
  feedbackModel.textContent = mode === 'therapy' ? data.therapy.model : data.diagnostics.model;
  renderDashboard();
  feedback.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function missingLine(hits, mode) {
  const missing = targetWordsForMode(mode).filter(word => !hits.includes(word)).slice(0, 4);
  return missing.length ? `Voeg expliciet toe: ${missing.join(', ')}.` : 'De kern zit erin; maak je formulering strakker.';
}

function targetWordsForMode(mode) {
  return mode === 'therapy'
    ? ['beginsituatie', 'doel', 'methode', 'samenwerking', 'prognose']
    : ['testsituatie', 'neutraal', 'intonatie', 'score', 'afbreekregel', 'fout'];
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
      ? `Kritisch criterium ${missing.map(item => item.number).join(', ')} staat onder V. Zet deze minimaal op 2 · V.`
      : 'Kritische criteria op minimaal V.'
  };
}

function criticalFeedback(mode, hasCritical, points) {
  if (hasCritical && points >= 3) {
    return 'Let nog op casusbewijs, maar het kritische criterium is herkenbaar aanwezig.';
  }
  if (mode === 'therapy') {
    return 'Criterium 15 en 17 tellen zwaar: methode én therapievorm moeten niet alleen genoemd, maar gemotiveerd worden vanuit beginsituatie, doelen en generalisatie.';
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

function saveCriteriaScores() {
  localStorage.setItem('oral10_criteria_scores', JSON.stringify(state.criteriaScores));
}

function block(title, body) {
  return `<article><h4>${escapeHtml(title)}</h4><p>${escapeHtml(body)}</p></article>`;
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
  if (points >= 4) return 'ZG · zeer goed';
  if (points === 3) return 'G · goed';
  if (points === 2) return 'V · voldoende';
  if (points === 1) return 'BV · bijna voldoende';
  return 'O · onvoldoende';
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
