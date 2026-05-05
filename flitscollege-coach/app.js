'use strict';

const data = window.FLITS_DATA;
const state = {
  index: Number(localStorage.getItem('flits_index') || 0),
  caseVariant: localStorage.getItem('flits_case_variant') || 'apply',
  done: JSON.parse(localStorage.getItem('flits_done') || '{}'),
  mastery: JSON.parse(localStorage.getItem('flits_mastery') || '{}'),
  attempts: JSON.parse(localStorage.getItem('flits_attempts') || '{}'),
  weaknesses: JSON.parse(localStorage.getItem('flits_weaknesses') || '{}'),
  session: JSON.parse(localStorage.getItem('flits_session') || '{"active":false,"mode":"ten","step":0,"queue":[]}'),
  immersion: localStorage.getItem('flits_immersion') === 'true',
  micro: null,
};

const list = document.getElementById('flits-list');
const select = document.getElementById('flits-select');
const answerInput = document.getElementById('answer-input');
const feedbackCard = document.getElementById('feedback-card');
const speechNote = document.getElementById('speech-note');
const coachInput = document.getElementById('coach-input');
const coachAnswer = document.getElementById('coach-answer');
const caseVariantSelect = document.getElementById('case-variant-select');
const sessionMode = document.getElementById('session-mode');
const sessionCommand = document.getElementById('session-command');
const sessionMemory = document.getElementById('session-memory');
const sessionNote = document.getElementById('session-note');
const immersionToggle = document.getElementById('immersion-toggle');
const modelDetails = document.getElementById('model-details');
const microPanel = document.getElementById('micro-panel');
const microInput = document.getElementById('micro-input');
const microFeedback = document.getElementById('micro-feedback');
const microNote = document.getElementById('micro-note');

let answerRecognition = null;
let answerRecording = false;
let questionRecognition = null;
let questionRecording = false;
let microRecognition = null;
let microRecording = false;

boot();

function boot() {
  migrateDoneToMastery();
  renderOptions();
  bindEvents();
  renderLesson();
  renderProgress();
  renderSession();
}

function bindEvents() {
  select.addEventListener('change', () => {
    state.index = Number(select.value);
    saveIndex();
    renderLesson();
  });

  document.getElementById('prev-flits').addEventListener('click', () => moveLesson(-1));
  document.getElementById('next-flits').addEventListener('click', () => moveLesson(1));
  document.getElementById('check-answer').addEventListener('click', checkAnswer);
  document.getElementById('clear-answer').addEventListener('click', () => {
    answerInput.value = '';
    feedbackCard.innerHTML = '<p class="flits-note">Nog geen antwoord nagekeken.</p>';
    speechNote.textContent = '';
  });
  document.getElementById('record-answer').addEventListener('click', toggleAnswerRecording);
  document.getElementById('mark-done').addEventListener('click', () => {
    const lesson = currentLesson();
    const mastery = masteryFor(lesson);
    lesson.checks.forEach(check => {
      mastery[masteryKey(check)] = true;
    });
    state.done[lesson.id] = true;
    saveMastery();
    saveDone();
    renderProgress();
    renderMastery();
    renderLessonList();
  });
  document.getElementById('ask-coach').addEventListener('click', answerCoachQuestion);
  document.getElementById('record-question').addEventListener('click', toggleQuestionRecording);
  sessionMode.addEventListener('change', () => {
    state.session.mode = sessionMode.value;
    saveSession();
    renderSession();
  });
  document.getElementById('start-session').addEventListener('click', startSession);
  document.getElementById('session-next').addEventListener('click', nextSessionStep);
  document.getElementById('session-boss').addEventListener('click', startBossFight);
  immersionToggle.addEventListener('change', () => {
    state.immersion = immersionToggle.checked;
    localStorage.setItem('flits_immersion', String(state.immersion));
    renderImmersion();
  });
  caseVariantSelect.addEventListener('change', () => {
    state.caseVariant = caseVariantSelect.value;
    localStorage.setItem('flits_case_variant', state.caseVariant);
    renderCaseCoach();
    renderPracticePrompts();
  });
  document.getElementById('coach-start-case').addEventListener('click', startCaseTraining);
  document.getElementById('coach-train-gap').addEventListener('click', trainWeakestPoint);
  document.getElementById('check-micro').addEventListener('click', checkMicroAnswer);
  document.getElementById('record-micro').addEventListener('click', toggleMicroRecording);
  document.getElementById('close-micro').addEventListener('click', closeMicroPanel);
  coachInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') answerCoachQuestion();
  });
}

function renderOptions() {
  select.innerHTML = data.lessons.map((lesson, index) => `<option value="${index}">${lesson.title}</option>`).join('');
  renderLessonList();
}

function renderLessonList() {
  list.innerHTML = data.lessons.map((lesson, index) => {
    const active = index === state.index ? ' is-active' : '';
    const done = lessonIsMastered(lesson) ? ' is-done' : '';
    return `
      <button class="flits-list-item${active}${done}" type="button" data-index="${index}">
        <span>${index + 1}</span>
        <strong>${escapeHtml(lesson.title.replace(/^\d+\.\s*/, ''))}</strong>
        <small>${escapeHtml(lesson.domain)}</small>
      </button>
    `;
  }).join('');

  list.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      state.index = Number(button.dataset.index);
      saveIndex();
      renderLesson();
    });
  });
}

function renderLesson() {
  const lesson = currentLesson();
  select.value = String(state.index);
  document.getElementById('flits-meta').textContent = `${state.index + 1} van ${data.lessons.length} · ${lesson.domain}`;
  document.getElementById('flits-title').textContent = lesson.title;
  document.getElementById('flits-summary').textContent = lesson.summary;
  document.getElementById('flits-tags').innerHTML = lesson.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
  document.getElementById('snap-card').textContent = lesson.snap;
  document.getElementById('memory-list').innerHTML = lesson.memory.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  renderPracticePrompts();
  document.getElementById('model-answer').textContent = lesson.model;
  answerInput.value = '';
  feedbackCard.innerHTML = '<p class="flits-note">Nog geen antwoord nagekeken.</p>';
  speechNote.textContent = '';
  closeMicroPanel();
  renderCaseCoach();
  renderMastery();
  renderLessonList();
  renderImmersion();
  renderSession();
}

function renderCaseCoach() {
  const lesson = currentLesson();
  const variants = caseVariantsFor(lesson);
  const selected = currentCaseVariant(lesson);
  const missing = missingChecksFor(lesson);
  const anchors = (missing.length ? missing : lesson.checks).slice(0, 3);
  caseVariantSelect.innerHTML = variants.map(variant => `
    <option value="${variant.id}">${variant.label}</option>
  `).join('');
  caseVariantSelect.value = selected.id;
  document.getElementById('coach-case-question').textContent = selected.question;
  document.getElementById('coach-anchors').innerHTML = anchors.map(check => `
    <span>${escapeHtml(explainTerm(check))}</span>
  `).join('');
  document.getElementById('coach-speaking-task').textContent =
    `Zeg in ${selected.seconds} seconden: ${selected.speakingTask} Gebruik het stramien: begrip, casusbewijs, vervolgstap.`;
}

function renderPracticePrompts() {
  const lesson = currentLesson();
  const selected = currentCaseVariant(lesson);
  document.getElementById('case-question').textContent = selected.question;
  document.getElementById('oral-prompt').textContent = selected.speakingTask;
}

function renderProgress() {
  const total = data.lessons.reduce((sum, lesson) => sum + lesson.checks.length, 0);
  const mastered = data.lessons.reduce((sum, lesson) => {
    if (state.done[lesson.id]) return sum + lesson.checks.length;
    const mastery = state.mastery[lesson.id] || {};
    return sum + lesson.checks.filter(check => mastery[masteryKey(check)]).length;
  }, 0);
  const doneCount = data.lessons.filter(lesson => lessonIsMastered(lesson)).length;
  const ready = total ? Math.round((mastered / total) * 100) : 0;
  document.getElementById('flits-ready').textContent = `${ready}%`;
  document.getElementById('flits-hint').textContent = ready >= 80
    ? 'Sterk. Herhaal alleen wat nog openstaat hardop.'
    : `${mastered}/${total} onderwerpen beheerst · ${doneCount}/${data.lessons.length} flitscolleges rond.`;
}

function renderSession() {
  sessionMode.value = state.session.mode || 'ten';
  immersionToggle.checked = state.immersion;
  const weakest = weakestPattern();
  sessionMemory.textContent = weakest
    ? `Let op je vaste valkuil: ${weakest.label}. Die komt vandaag bewust terug.`
    : 'Nog geen persoonlijke valkuil gevonden. De coach leert van je feedback.';

  if (!state.session.active) {
    sessionCommand.textContent = 'Kies 10 min, 20 min of toetsstress en start. Daarna krijg je steeds één opdracht.';
    sessionNote.textContent = state.immersion
      ? 'Dompelstand staat aan: eerst zelf proberen, model later.'
      : 'Slimme herhaling staat klaar: rood komt terug, groen verdwijnt.';
    return;
  }

  const lesson = currentLesson();
  const selected = currentCaseVariant(lesson);
  const commands = sessionCommands(lesson, selected);
  sessionCommand.textContent = commands[state.session.step % commands.length];
  sessionNote.textContent = `Sessie actief · ${modeLabelForSession(state.session.mode)} · stap ${state.session.step + 1}.`;
}

function sessionCommands(lesson, selected) {
  const gap = missingChecksFor(lesson)[0] || lesson.checks[0];
  const probe = teacherProbeFor(lesson, selected);
  return [
    `Lees de snapkaart 20 seconden. Sluit hem mentaal af en zeg: “De kern is...”`,
    `Train nu ${selected.label.toLowerCase()}: ${selected.question}`,
    `Stop. Bewijs minimaal één casusdetail en één vervolgstap. Gebruik: ${explainTerm(gap)}`,
    `Docent vraagt door: ${probe}`,
    `Spreek je antwoord opnieuw in. Korter, klinischer, met één “daarom”.`
  ];
}

function teacherProbeFor(lesson, selected) {
  const clean = normalize(`${lesson.domain} ${lesson.title} ${selected.question}`);
  if (clean.includes('behandeling')) return 'Waarom kies je deze methode en wat ziet school morgen anders?';
  if (clean.includes('diagnostiek') || clean.includes('test')) return 'Waarom is één score onvoldoende voor je conclusie?';
  if (clean.includes('fonet') || clean.includes('fonolog') || clean.includes('spraak')) return 'Hoe weet je of dit fonetisch, fonologisch of planning is?';
  if (clean.includes('pragmat')) return 'Waar zie je dit terug in echte interactie, niet alleen in een test?';
  if (clean.includes('meertal')) return 'Waarom is lage Nederlandse score nog geen TOS-bewijs?';
  if (clean.includes('omft') || clean.includes('tand') || clean.includes('mond')) return 'Welke structuur- of functiefactor onderhoudt het probleem?';
  return 'Wat betekent dit concreet voor onderzoek, behandeling of klascontext?';
}

function modeLabelForSession(mode) {
  if (mode === 'stress') return 'toetsstress';
  if (mode === 'twenty') return '20 min verdiepen';
  return '10 min kern';
}

function startSession() {
  state.session = {
    active: true,
    mode: sessionMode.value,
    step: 0,
    queue: buildSessionQueue(sessionMode.value),
  };
  if (state.session.mode === 'stress') {
    state.immersion = true;
    localStorage.setItem('flits_immersion', 'true');
  }
  saveSession();
  goToSessionLesson();
  renderSession();
  renderImmersion();
  sessionCommand.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function buildSessionQueue(mode) {
  const open = data.lessons
    .map((lesson, index) => ({ lesson, index, missing: missingChecksFor(lesson).length }))
    .filter(item => item.missing > 0)
    .sort((a, b) => b.missing - a.missing)
    .map(item => item.index);
  const base = open.length ? open : data.lessons.map((_, index) => index);
  const size = mode === 'twenty' ? 8 : mode === 'stress' ? 6 : 4;
  return base.slice(0, size);
}

function nextSessionStep() {
  if (!state.session.active) {
    startSession();
    return;
  }

  state.session.step += 1;
  const commandCount = sessionCommands(currentLesson(), currentCaseVariant()).length;
  if (state.session.step % commandCount === 0) {
    rotateSessionQueue();
    goToSessionLesson();
  }
  saveSession();
  renderSession();
  const activeCommand = state.session.step % commandCount;
  if (activeCommand === 1 || activeCommand === 4) startCaseTraining();
  sessionCommand.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function rotateSessionQueue() {
  if (!state.session.queue.length) state.session.queue = buildSessionQueue(state.session.mode);
  const [current, ...rest] = state.session.queue;
  const followUp = nextRedFollowUp();
  state.session.queue = followUp !== null ? [...rest.slice(0, 2), followUp, ...rest.slice(2), current].filter(uniqueIndex) : [...rest, current];
}

function uniqueIndex(value, index, array) {
  return array.indexOf(value) === index;
}

function goToSessionLesson() {
  if (!state.session.queue.length) state.session.queue = buildSessionQueue(state.session.mode);
  state.index = state.session.queue[0] ?? state.index;
  saveIndex();
  renderLesson();
}

function nextRedFollowUp() {
  const entries = Object.entries(state.attempts)
    .filter(([, attempt]) => attempt.score < 4)
    .sort((a, b) => b[1].time - a[1].time);
  if (!entries.length) return null;
  const [lessonId] = entries[0];
  const index = data.lessons.findIndex(lesson => lesson.id === lessonId);
  return index >= 0 ? index : null;
}

function startBossFight() {
  const lesson = currentLesson();
  const domainLessons = data.lessons
    .filter(item => item.domain === lesson.domain)
    .slice(0, 3);
  const anchors = domainLessons.flatMap(item => item.checks.slice(0, 2)).slice(0, 5);
  state.caseVariant = 'defend';
  localStorage.setItem('flits_case_variant', state.caseVariant);
  renderCaseCoach();
  renderPracticePrompts();
  answerInput.value = '';
  answerInput.focus();
  answerInput.placeholder = `Eindbaas ${lesson.domain}: verbind ${anchors.slice(0, 3).join(', ')} aan één casus.`;
  speechNote.textContent = `Thema-eindbaas: verdedig ${lesson.domain} met deze ankers: ${anchors.join(' · ')}.`;
}

function renderImmersion() {
  const key = attemptKey();
  const attempts = state.attempts[key]?.tries || 0;
  modelDetails.hidden = state.immersion && attempts < 2;
}

function attemptKey(lesson = currentLesson(), variant = currentCaseVariant(lesson)) {
  return `${lesson.id}:${variant.id}`;
}

function weakestPattern() {
  const entries = Object.entries(state.weaknesses).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return null;
  const labels = {
    casus: 'je vergeet casusbewijs',
    vervolg: 'je noemt nog geen vervolgstap',
    vaktaal: 'je antwoord mist vaktaal',
    volledigheid: 'je stopt te vroeg'
  };
  return { id: entries[0][0], label: labels[entries[0][0]] || entries[0][0] };
}

function migrateDoneToMastery() {
  let changed = false;
  data.lessons.forEach(lesson => {
    if (!state.done[lesson.id]) return;
    const mastery = masteryFor(lesson);
    lesson.checks.forEach(check => {
      const key = masteryKey(check);
      if (!mastery[key]) {
        mastery[key] = true;
        changed = true;
      }
    });
  });
  if (changed) saveMastery();
}

function renderMastery() {
  const lesson = currentLesson();
  const mastery = masteryFor(lesson);
  const mastered = lesson.checks.filter(check => mastery[masteryKey(check)]);
  const missing = lesson.checks.filter(check => !mastery[masteryKey(check)]);

  document.getElementById('mastery-checklist').innerHTML = lesson.checks.map(check => {
    const key = masteryKey(check);
    const checked = mastery[key] ? ' checked' : '';
    return `
      <label class="flits-mastery-item">
        <input type="checkbox" data-key="${escapeHtml(key)}"${checked} />
        <span>${escapeHtml(check)}</span>
      </label>
    `;
  }).join('');

  document.querySelectorAll('#mastery-checklist input').forEach(input => {
    input.addEventListener('change', () => {
      mastery[input.dataset.key] = input.checked;
      if (!input.checked) state.done[lesson.id] = false;
      if (lesson.checks.every(check => mastery[masteryKey(check)])) state.done[lesson.id] = true;
      saveMastery();
      saveDone();
      renderMastery();
      renderProgress();
      renderLessonList();
      renderCaseCoach();
    });
  });

  const trainList = document.getElementById('train-list');
  if (!missing.length) {
    trainList.innerHTML = `
      <article class="flits-train-item is-complete">
        <strong>Alles staat groen</strong>
        <p>Mooi. Test jezelf nu met de casusvraag en zeg de mondelinge drill zonder modelantwoord.</p>
      </article>
    `;
    return;
  }

  trainList.innerHTML = missing.map(check => `
    <article class="flits-train-item">
      <strong>${escapeHtml(check)}</strong>
      <p>${escapeHtml(explainTerm(check))}</p>
      <div class="flits-mini-actions">
        <button type="button" data-topic="${escapeHtml(check)}" data-mode="controleer">Controleer</button>
        <button type="button" data-topic="${escapeHtml(check)}" data-mode="toetszin">Toetszin</button>
        <button type="button" data-topic="${escapeHtml(check)}" data-mode="casus">Casus</button>
      </div>
    </article>
  `).join('');

  trainList.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => openMicroPanel(button.dataset.topic, button.dataset.mode));
  });

  if (mastered.length && missing.length) {
    trainList.insertAdjacentHTML('afterbegin', `<p class="flits-note">Al beheerst: ${mastered.length}. Nog open: ${missing.length}. Lekker klein houden.</p>`);
  }
}

function missingChecksFor(lesson) {
  const mastery = masteryFor(lesson);
  return lesson.checks.filter(check => !mastery[masteryKey(check)]);
}

function caseVariantsFor(lesson) {
  const [first, second, third] = lesson.checks;
  return [
    {
      id: 'recognize',
      label: '1. Herkennen',
      seconds: 30,
      question: `Welke kernbegrippen uit ${lesson.title} herken je in deze situatie: ${lesson.caseQuestion}`,
      speakingTask: `Benoem het probleem en gebruik minimaal ${first} en ${second || lesson.domain}.`
    },
    {
      id: 'apply',
      label: '2. Toepassen',
      seconds: 45,
      question: lesson.caseQuestion,
      speakingTask: lesson.oralPrompt
    },
    {
      id: 'defend',
      label: '3. ZG-verdedigen',
      seconds: 60,
      question: `Verdedig je klinische redenering bij deze casus: ${lesson.caseQuestion} Wat betekent dit voor diagnostiek of behandeling, en welke vervolgstap kies je?`,
      speakingTask: `Geef een ZG-antwoord met ${first}, ${second || 'casusbewijs'}, ${third || 'vervolgstap'} en één concrete consequentie voor onderzoek, behandeling of school.`
    }
  ];
}

function currentCaseVariant(lesson = currentLesson()) {
  const variants = caseVariantsFor(lesson);
  return variants.find(variant => variant.id === state.caseVariant) || variants[1];
}

function startCaseTraining() {
  const lesson = currentLesson();
  const selected = currentCaseVariant(lesson);
  answerInput.focus();
  answerInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  answerInput.placeholder = `Start met: “In deze ${selected.label.toLowerCase()} betekent ${lesson.checks[0]} dat...”`;
  speechNote.textContent = `Casustraining gestart: spreek of typ nu ${selected.seconds} seconden. Daarna klik je op Feedback.`;
}

function trainWeakestPoint() {
  const lesson = currentLesson();
  const [firstMissing] = missingChecksFor(lesson);
  openMicroPanel(firstMissing || lesson.checks[0], 'casus');
  microPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function moveLesson(delta) {
  state.index = (state.index + delta + data.lessons.length) % data.lessons.length;
  saveIndex();
  renderLesson();
}

function checkAnswer() {
  const text = answerInput.value.trim();
  if (!text) {
    speechNote.textContent = 'Typ of spreek eerst je antwoord in.';
    return;
  }

  const lesson = currentLesson();
  const clean = normalize(text);
  const hits = lesson.checks.filter(check => clean.includes(normalize(check)));
  const hasCase = ['kind', 'casus', 'score', 'observatie', 'ouders', 'school', 'klas', 'onderzoek', 'behandeling'].some(word => clean.includes(word));
  const hasNextStep = ['daarom', 'vervolg', 'onderzoek', 'behandel', 'doel', 'advies', 'school', 'ouders', 'methode'].some(word => clean.includes(word));
  const score = Math.min(4, hits.length + (hasCase ? 1 : 0) + (hasNextStep ? 1 : 0));
  const missing = lesson.checks.filter(check => !hits.includes(check)).slice(0, 3);
  const explainedHits = hits.map(explainTerm);
  updateAttempt(score, missing, hasCase, hasNextStep, text);

  feedbackCard.innerHTML = `
    <div class="flits-feedback-head">
      <h3>${score >= 4 ? '4/4 · toetswaardig' : score === 3 ? '3/4 · bijna ZG' : 'Nog aanvullen'}</h3>
      <strong>${score}/4</strong>
    </div>
    ${coachScanHtml({
      good: explainedHits,
      missing: [
        ...missing.map(explainTerm),
        ...(!hasCase ? ['casuskoppeling: kind, onderzoek, behandeling of schoolcontext'] : []),
        ...(!hasNextStep ? ['vervolgstap: wat onderzoek, behandel of adviseer je nu?'] : [])
      ],
      vague: score >= 4 ? [] : [interruptText(missing, hasCase, hasNextStep)]
    })}
    ${block('Sterk', explainedHits.length ? `Je noemt al: ${explainedHits.join(' ')}` : 'Je antwoord heeft nog te weinig herkenbare vaktaal. Noem eerst het probleem en één voorbeeld uit de casus.')}
    ${block('Coach onderbreekt', interruptText(missing, hasCase, hasNextStep))}
    ${block('Feedback', feedbackText(score, missing, hasCase, hasNextStep))}
    ${score === 3 ? block('Van 3/4 naar 4/4', upgradeText(missing, hasCase, hasNextStep)) : ''}
    ${score < 4 ? redRetryHtml() : ''}
  `;
  bindRedRetry(feedbackCard, answerInput, speechNote);
  renderSession();
  renderImmersion();
}

function updateAttempt(score, missing, hasCase, hasNextStep, text) {
  const key = attemptKey();
  const previous = state.attempts[key] || { tries: 0, score: 0 };
  state.attempts[key] = {
    tries: previous.tries + 1,
    score: Math.max(previous.score || 0, score),
    lastScore: score,
    time: Date.now(),
  };
  if (missing.length) bumpWeakness('vaktaal');
  if (!hasCase) bumpWeakness('casus');
  if (!hasNextStep) bumpWeakness('vervolg');
  if (text.split(/\s+/).filter(Boolean).length < 35) bumpWeakness('volledigheid');
  localStorage.setItem('flits_attempts', JSON.stringify(state.attempts));
  localStorage.setItem('flits_weaknesses', JSON.stringify(state.weaknesses));
}

function bumpWeakness(key) {
  state.weaknesses[key] = (state.weaknesses[key] || 0) + 1;
}

function interruptText(missing, hasCase, hasNextStep) {
  if (!hasCase) return 'Stop. Dit is nog los van een kind. Voeg nu één casusbewijs toe.';
  if (missing.length) return `Stop. Je mist nog dit anker: ${explainTerm(missing[0])}`;
  if (!hasNextStep) return 'Stop. Je beschrijft al, maar kiest nog geen vervolgstap. Voeg “daarom...” toe.';
  return 'Goed. Nu dezelfde inhoud korter en hardop, alsof de docent doorvraagt.';
}

function feedbackText(score, missing, hasCase, hasNextStep) {
  if (score >= 4) return 'Inhoudelijk klaar. Oefen dit nu hardop in maximaal 60 seconden.';
  const parts = [];
  if (missing.length) {
    parts.push(`Voeg concreet toe: ${missing.map(explainTerm).join(' ')}`);
  }
  if (!hasCase) {
    parts.push('Maak het minder los: zeg over welk kind of welke situatie je het hebt. Bijvoorbeeld: “Dit kind zegt /t/ voor /k/ in de klas, daardoor is hij minder verstaanbaar.”');
  }
  if (!hasNextStep) {
    parts.push('Sluit af met een vervolgstap: daarom onderzoek ik, behandel ik, adviseer ik of betrek ik school/ouders.');
  }
  return parts.join(' ');
}

function upgradeText(missing, hasCase, hasNextStep) {
  if (!hasCase) return 'Voeg één concrete casuszin toe: “Bij dit kind zie ik dit doordat...” en check opnieuw.';
  if (missing.length) return `Voeg dit ene punt toe: ${explainTerm(missing[0])} Check daarna opnieuw.`;
  if (!hasNextStep) return 'Voeg één “daarom”-zin toe met onderzoek, behandeling of advies.';
  return 'Zeg het nu korter en casusgerichter; dan is het 4/4.';
}

function openMicroPanel(topic, mode) {
  const lesson = currentLesson();
  state.micro = { topic, mode };
  microPanel.hidden = false;
  microInput.value = '';
  microFeedback.innerHTML = '';
  microNote.textContent = '';
  document.getElementById('micro-mode').textContent = modeLabel(mode);
  document.getElementById('micro-title').textContent = topic;
  document.getElementById('micro-prompt').textContent = microPrompt(lesson, topic, mode);
  microInput.focus();
}

function closeMicroPanel() {
  if (microRecording && microRecognition) microRecognition.stop();
  state.micro = null;
  microPanel.hidden = true;
  microInput.value = '';
  microFeedback.innerHTML = '';
  microNote.textContent = '';
}

function microPrompt(lesson, topic, mode) {
  if (mode === 'toetszin') {
    return `Maak één toetszin: “${topic} betekent..., bij dit kind zie ik..., daarom doe ik...”`;
  }
  if (mode === 'casus') {
    return `Pas ${topic} toe op deze casusvraag: ${currentCaseVariant(lesson).question}`;
  }
  return `Leg ${topic} in maximaal 20 seconden uit. Noem wat het is en wat je ermee doet bij een kind.`;
}

function modeLabel(mode) {
  if (mode === 'toetszin') return 'Toetszin';
  if (mode === 'casus') return 'Casus';
  return 'Controleer';
}

function checkMicroAnswer() {
  const text = microInput.value.trim();
  if (!state.micro || !text) {
    microNote.textContent = 'Typ of spreek eerst je korte uitleg in.';
    return;
  }

  const lesson = currentLesson();
  const { topic } = state.micro;
  const clean = normalize(text);
  const topicClean = normalize(topic);
  const mainWords = topicClean.split(/\s+/).filter(word => word.length > 3);
  const hasTopic = clean.includes(topicClean) || mainWords.some(word => clean.includes(word));
  const hasExplanation = /\b(betekent|is|omdat|zodat|daardoor|verschil)\b/.test(clean) || clean.includes('gaat over') || text.length > 80;
  const hasApplication = ['kind', 'casus', 'onderzoek', 'behandeling', 'school', 'klas', 'ouders', 'doel', 'test'].some(word => clean.includes(word));
  const score = [hasTopic, hasExplanation, hasApplication].filter(Boolean).length;
  const missing = [];

  if (!hasTopic) missing.push(`noem het begrip zelf: ${explainTerm(topic)}`);
  if (!hasExplanation) missing.push('leg kort uit wat het betekent');
  if (!hasApplication) missing.push('koppel het aan een kind, casus, onderzoek of behandeling');

  if (score >= 3) {
    const mastery = masteryFor(lesson);
    mastery[masteryKey(topic)] = true;
    if (lesson.checks.every(check => mastery[masteryKey(check)])) state.done[lesson.id] = true;
    saveMastery();
    saveDone();
    renderMastery();
    renderProgress();
    renderLessonList();
    renderCaseCoach();
    renderSession();
  }

  microFeedback.innerHTML = `
    <div class="flits-feedback-head">
      <h3>${score >= 3 ? '3/3 · beheerst' : score === 2 ? '2/3 · bijna' : 'Nog scherper'}</h3>
      <strong>${score}/3</strong>
    </div>
    ${coachScanHtml({
      good: [
        ...(hasTopic ? [`begrip genoemd: ${explainTerm(topic)}`] : []),
        ...(hasExplanation ? ['uitleg gegeven'] : []),
        ...(hasApplication ? ['toegepast op kind/casus/onderzoek/behandeling'] : [])
      ],
      missing,
      vague: score >= 3 ? [] : ['Hou het kort, maar maak het klinisch toepasbaar.']
    })}
    ${block('Goed', hasTopic ? `Je raakt het onderwerp: ${explainTerm(topic)}` : 'Je probeert het kort te houden. Nu nog het begrip expliciet noemen.')}
    ${score < 3 ? block('Mist nog', missing.join(' · ')) : block('Coach', 'Ik heb dit onderwerp gemarkeerd als beheerst. Zeg het nu nog één keer hardop zonder te lezen.')}
    ${score < 3 ? block('Maak ZG door', `Gebruik dit stramien: “${explainTerm(topic)} Bij deze casus betekent dit dat... Daarom kies/onderzoek/oefen ik...”`) : ''}
  `;
}

function toggleMicroRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    microNote.textContent = 'Spraakherkenning werkt niet in deze browser. Typ je uitleg of gebruik Chrome/Edge.';
    return;
  }

  const button = document.getElementById('record-micro');
  if (!microRecognition) {
    microRecognition = new SpeechRecognition();
    microRecognition.lang = 'nl-NL';
    microRecognition.interimResults = true;
    microRecognition.continuous = false;
    microRecognition.onresult = event => {
      microInput.value = Array.from(event.results).map(result => result[0].transcript).join(' ');
    };
    microRecognition.onend = () => {
      microRecording = false;
      button.textContent = 'Spreek in';
      if (microInput.value.trim()) checkMicroAnswer();
    };
    microRecognition.onerror = event => {
      microRecording = false;
      button.textContent = 'Spreek in';
      microNote.textContent = recognitionErrorMessage(event.error, 'Spreek in');
    };
  }

  if (microRecording) {
    microRecognition.stop();
    return;
  }
  if (answerRecording && answerRecognition) answerRecognition.stop();
  if (questionRecording && questionRecognition) questionRecognition.stop();
  microRecording = true;
  button.textContent = 'Stop';
  microNote.textContent = 'Ik luister. Leg het uit alsof je docent tegenover je zit.';
  try {
    microRecognition.start();
  } catch {
    microRecording = false;
    button.textContent = 'Spreek in';
    microNote.textContent = 'De opname kon niet starten. Klik nog één keer op Spreek in of typ je uitleg.';
  }
}

function explainTerm(term) {
  const explanations = {
    contrast: 'contrast (welk klankverschil betekenis maakt, bijvoorbeeld /k/ tegenover /t/).',
    stimulabiliteit: 'stimulabiliteit (of het kind de klank met hulp al kan maken; dat bepaalt of oefenen haalbaar is).',
    'minimale paren': 'minimale paren (twee woorden die alleen door één klank verschillen, zoals koe-toe, zodat het kind het betekenisverschil hoort).',
    fonetisch: 'fonetisch (motorisch maken van de klank).',
    fonologisch: 'fonologisch (het klanksysteem; het kind gebruikt het klankverschil nog niet goed).',
    taal: 'taal (betekenis, woorden, zinnen en gebruik).',
    spraak: 'spraak (hoe taal hoorbaar wordt uitgesproken).',
    inhoud: 'inhoud (wat het kind bedoelt of welke woorden/betekenissen het gebruikt).',
    vorm: 'vorm (hoe het kind woorden en zinnen bouwt).',
    gebruik: 'gebruik (hoe het kind taal inzet in gesprek of spel).',
    morfosyntaxis: 'morfosyntaxis (woordvolgorde, werkwoordsvorm en zinsbouw).',
    pragmatiek: 'pragmatiek (beurtwisseling, oog voor de luisteraar en passend reageren).',
    leeftijd: 'leeftijd (waarom dit op deze leeftijd normaal of juist zorgelijk is).',
    fase: 'ontwikkelingsfase (waar het kind zit in de taalontwikkeling).',
    ontwikkeling: 'ontwikkeling (wat je verwacht op deze leeftijd vergeleken met wat het kind doet).',
    begrip: 'taalbegrip (wat het kind begrijpt, niet alleen wat het zegt).',
    productie: 'taalproductie (wat het kind zelf kan zeggen of uitspreken).',
    gehoor: 'gehoor (het kind moet taal en klanken goed kunnen horen om ze te leren).',
    cognitie: 'cognitie (of het kind de taak kan begrijpen en leren).',
    motoriek: 'motoriek (of bewegen/plannen van mond of lichaam invloed heeft).',
    omgeving: 'omgeving (thuis, school, taalaanbod of interactie).',
    taalaanbod: 'taalaanbod (hoeveel en welke kwaliteit taal het kind hoort).',
    levelt: 'Model van Levelt (waar het misgaat: idee, taalvorm, klankkeuze of uitspraak).',
    formulator: 'formulator (kiezen/ordenen van woorden of klanken).',
    articulator: 'articulator (motorische uitvoering van de klank).',
    planning: 'planning/programmering (het plannen van spraakbewegingen, vooral bij wisselende fouten).',
    consistentie: 'consistentie (of hetzelfde woord steeds hetzelfde of wisselend fout gaat).',
    hulpvraag: 'hulpvraag (wat kind, ouders of school willen verbeteren).',
    gegevens: 'gegevens (welke test, observatie of anamnese je gebruikt).',
    interpretatie: 'interpretatie (wat het gegeven betekent, niet alleen wat je hebt gezien).',
    conclusie: 'logopedische conclusie (de kernverklaring uit de gegevens).',
    doel: 'doel (welk concreet gedrag je wilt bereiken).',
    evaluatie: 'evaluatie (wanneer en hoe je controleert of het beter gaat).',
    normscore: 'normscore (hoe het kind scoort vergeleken met leeftijdsgenoten).',
    betrouwbaarheidsinterval: 'betrouwbaarheidsinterval (de bandbreedte rond een score; geen exact vast getal).',
    validiteit: 'validiteit (of de test echt meet wat je wilt weten).',
    observatie: 'observatie (wat je bij het kind zag naast de testscore).',
    context: 'context (de situatie waarin het kind functioneert, zoals klas of thuis).',
    schlichting: 'Schlichting (volgens protocol afnemen en scoren).',
    standaardisatie: 'standaardisatie (iedereen op dezelfde manier testen voor betrouwbare vergelijking).',
    neutraal: 'neutrale aanbieding (geen nadruk of hulpende intonatie geven).',
    startpunt: 'startpunt (waar je begint op basis van leeftijd).',
    afbreekregel: 'afbreekregel (wanneer je stopt volgens het protocol).',
    betrouwbaarheid: 'betrouwbaarheid (of je de uitkomst kunt vertrouwen).',
    meertalig: 'meertaligheid (beide talen en taalaanbod meenemen).',
    nt2: 'NT2 (Nederlands als tweede taal; lage Nederlandse score is niet automatisch TOS).',
    tos: 'TOS (hardnekkige taalproblemen die functioneren belemmeren).',
    thuistaal: 'thuistaal (hoe het kind in de taal thuis functioneert).',
    aanbod: 'taalaanbod (hoeveel taalinput het kind krijgt).',
    leerbaarheid: 'leerbaarheid (of het kind groeit wanneer je hulp of aanbod geeft).',
    hardnekkig: 'hardnekkigheid (het probleem blijft bestaan ondanks passend aanbod).',
    functioneren: 'functioneren (meedoen thuis of op school).',
    differentiaal: 'differentiaaldiagnostiek (andere verklaringen meewegen of uitsluiten).',
    semantiek: 'semantiek (woordbetekenis en woordenschat).',
    woordenschat: 'woordenschat (welke woorden het kind begrijpt of gebruikt).',
    receptief: 'receptief (wat het kind begrijpt of aanwijst).',
    productief: 'productief (wat het kind zelf zegt).',
    netwerk: 'semantisch netwerk (woorden koppelen aan categorie, betekenis en gebruik).',
    woordvinding: 'woordvinding (moeite om het juiste woord op te halen).',
    woordvolgorde: 'woordvolgorde (de volgorde van woorden in de zin).',
    werkwoord: 'werkwoordsvorm (of het werkwoord klopt, bijvoorbeeld loopt/liep).',
    zinsbouw: 'zinsbouw (hoe de zin is opgebouwd).',
    scaffolding: 'scaffolding (tijdelijke hulp geven en die later afbouwen).',
    recasting: 'recasting (de zin van het kind correct herhalen en uitbreiden).',
    narratief: 'narratief (verhaalopbouw: begin, midden, einde).',
    beurtwisseling: 'beurtwisseling (om de beurt praten of reageren).',
    'fronting': 'fronting (een achterklank wordt voorin gemaakt, bijvoorbeeld /k/ wordt /t/).',
    'stopping': 'stopping (een wrijfklank wordt een plofklank, bijvoorbeeld /s/ wordt /t/).',
    clusterreductie: 'clusterreductie (een medeklinkergroep wordt vereenvoudigd, bijvoorbeeld “stoel” wordt “toel”).',
    verstaanbaarheid: 'verstaanbaarheid (hoe goed anderen het kind begrijpen).',
    vod: 'VOD (moeite met plannen/programmeren van spraakbewegingen).',
    zoekgedrag: 'zoekgedrag (zichtbaar zoeken naar de juiste mondbeweging).',
    motorisch: 'motorisch (bewegen of uitvoeren).',
    sequentie: 'sequentie (de volgorde van klanken of lettergrepen).',
    lt: 'LT-doel (langetermijndoel op meedoen of dagelijks functioneren).',
    kt: 'KT-doel (kort, meetbaar oefendoel).',
    smart: 'SMART (wie, wat, hoeveel, waar en wanneer).',
    methode: 'methode (welke aanpak je kiest en waarom die past bij het probleem).',
    participatie: 'participatie (hoe het kind beter mee kan doen thuis of in de klas).',
    generalisatie: 'generalisatie (de vaardigheid buiten therapie gebruiken).',
    icf: 'ICF (brug van functie naar activiteit en participatie).',
    ouders: 'ouders (wat ouders thuis concreet doen).',
    school: 'school (wat de leerkracht in de klas concreet doet).',
    samenwerking: 'samenwerking (met wie je afstemt en waarom).',
    prognose: 'prognose (wat je verwacht en welke factoren helpen of remmen).',
    richtlijn: 'richtlijn (professionele aanbeveling: zo onderbouw je je keuzes volgens de beroepsstandaard).',
    behandelplan: 'behandelplan (doelen, methode, vorm, frequentie, samenwerking en evaluatie samen).',
    omft: 'OMFT (behandeling van mondgewoonten en spierbalans).',
    structuuronderzoek: 'structuuronderzoek (wat je ziet aan lippen, tong, gehemelte, kaak en gebit).',
    functieonderzoek: 'functieonderzoek (wat mond, tong en lippen doen bij rust, slikken, ademen en spreken).',
    rustpositie: 'rustpositie (waar tong, lippen en kaak zijn als het kind niet spreekt of slikt).',
    lipsluiting: 'lipsluiting (of de lippen in rust goed sluiten).',
    tandheelkunde: 'tandheelkunde (gebit, kaakstand en wisseling die logopedie kunnen beïnvloeden).',
    occlusie: 'occlusie (hoe boven- en ondergebit op elkaar sluiten).',
    wisselgebit: 'wisselgebit (fase waarin melktanden wisselen; dit kan articulatie tijdelijk beïnvloeden).',
    'open beet': 'open beet (voortanden sluiten niet; dit kan spraak beïnvloeden).',
    tong: 'tongpositie (waar de tong ligt in rust, slikken of spreken).',
    slikken: 'slikpatroon (of slikken de mondfunctie beïnvloedt).',
    mondgewoonte: 'mondgewoonte (duimen, mondademen of tongpersen die eerst aangepakt moet worden).',
    orthodontist: 'orthodontist (samenwerking bij gebit/kaakstand).',
    plagiaat: 'plagiaat (tekst of idee overnemen zonder eigen verwerking en bron).',
    apa: 'APA (vaste manier van bronverwijzen in tekst en literatuurlijst).',
    bronvermelding: 'bronvermelding (laten zien waar je informatie vandaan komt).',
    parafraseren: 'parafraseren (in eigen woorden uitleggen met bron erbij).',
    toepassing: 'toepassing (wat de theorie betekent voor dit kind, deze casus of deze behandeling).',
    casus: 'casus (het concrete kind of de concrete situatie waarop je je uitleg toepast).'
  };
  return explanations[normalize(term)] || `${term} (leg dit uit met één voorbeeld uit het kind).`;
}

function answerCoachQuestion() {
  const question = coachInput.value.trim();
  if (!question) {
    coachAnswer.innerHTML = '<p>Stel eerst je vraag. Bijvoorbeeld: “hoe koppel ik dit aan een casus?”</p>';
    return;
  }

  const lesson = currentLesson();
  const clean = normalize(question);
  let title = 'Coachadvies';
  let body = `Bij dit flitscollege moet je vooral dit kunnen: ${lesson.snap}`;
  let action = `Actie: beantwoord de casusvraag met minimaal twee kernwoorden: ${lesson.checks.slice(0, 2).join(' en ')}.`;

  if (clean.includes('casus') || clean.includes('toepas')) {
    const selected = currentCaseVariant(lesson);
    title = 'Koppel aan casus';
    body = `Gebruik deze casusvariant: ${selected.question} Je brug is: begrip -> casusbewijs -> gevolg voor onderzoek of behandeling. Het eerste anker is ${explainTerm(lesson.checks[0])}`;
    action = 'Actie: klik op “Start casustraining” en begin met: “In deze casus betekent dit dat...”.';
  } else if (clean.includes('mondeling') || clean.includes('zeg')) {
    title = 'Mondelinge formulering';
    body = `${lesson.oralPrompt} Zeg niet alles uit de snapkaart na; bewijs drie punten met een casusvoorbeeld.`;
    action = `Actie: gebruik deze drie ankers: ${lesson.checks.slice(0, 3).map(explainTerm).join(' ')}`;
  } else if (clean.includes('leren') || clean.includes('onthoud')) {
    title = 'Wat moet je onthouden?';
    body = lesson.memory.slice(0, 3).join(' · ');
    action = 'Actie: schrijf deze drie punten uit je hoofd op en maak daarna de casusvraag.';
  } else if (clean.includes('zg') || clean.includes('10') || clean.includes('toets')) {
    title = 'Naar ZG';
    body = 'Een ZG-antwoord is niet langer, maar klinischer: je noemt het begrip, bewijst het met de casus en kiest één vervolgactie.';
    action = `Actie: maak één zin met ${explainTerm(lesson.checks[0])} + casusbewijs + “daarom onderzoek/behandel ik...”.`;
  }

  coachAnswer.innerHTML = `
    <strong>${escapeHtml(title)}</strong>
    <p>${escapeHtml(body)}</p>
    <span>${escapeHtml(action)}</span>
  `;
}

function toggleAnswerRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    speechNote.textContent = 'Spraakherkenning werkt niet in deze browser. Typ je antwoord of gebruik Chrome/Edge.';
    return;
  }

  const button = document.getElementById('record-answer');
  if (!answerRecognition) {
    answerRecognition = new SpeechRecognition();
    answerRecognition.lang = 'nl-NL';
    answerRecognition.interimResults = true;
    answerRecognition.continuous = true;
    answerRecognition.onresult = event => {
      answerInput.value = Array.from(event.results).map(result => result[0].transcript).join(' ');
    };
    answerRecognition.onend = () => {
      answerRecording = false;
      button.textContent = 'Neem op';
    };
    answerRecognition.onerror = event => {
      answerRecording = false;
      button.textContent = 'Neem op';
      speechNote.textContent = recognitionErrorMessage(event.error, 'Neem op');
    };
  }

  if (answerRecording) {
    answerRecognition.stop();
    return;
  }
  if (questionRecording && questionRecognition) questionRecognition.stop();
  answerRecording = true;
  button.textContent = 'Stop';
  speechNote.textContent = 'Opname loopt. Geef je antwoord alsof je in de toets zit.';
  try {
    answerRecognition.start();
  } catch {
    answerRecording = false;
    button.textContent = 'Neem op';
    speechNote.textContent = 'De opname kon niet starten. Klik nog één keer op Neem op of typ je antwoord.';
  }
}

function toggleQuestionRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    coachAnswer.innerHTML = '<p>Spraakherkenning werkt niet in deze browser. Typ je vraag of gebruik Chrome/Edge.</p>';
    return;
  }

  const button = document.getElementById('record-question');
  if (!questionRecognition) {
    questionRecognition = new SpeechRecognition();
    questionRecognition.lang = 'nl-NL';
    questionRecognition.interimResults = true;
    questionRecognition.continuous = false;
    questionRecognition.onresult = event => {
      coachInput.value = Array.from(event.results).map(result => result[0].transcript).join(' ');
    };
    questionRecognition.onend = () => {
      questionRecording = false;
      button.textContent = 'Spreek in';
      if (coachInput.value.trim()) answerCoachQuestion();
    };
    questionRecognition.onerror = event => {
      questionRecording = false;
      button.textContent = 'Spreek in';
      coachAnswer.innerHTML = `<p>${recognitionErrorMessage(event.error, 'Spreek in')}</p>`;
    };
  }

  if (questionRecording) {
    questionRecognition.stop();
    return;
  }
  if (answerRecording && answerRecognition) answerRecognition.stop();
  questionRecording = true;
  button.textContent = 'Stop';
  coachAnswer.innerHTML = '<p>Ik luister. Stel je vraag kort.</p>';
  try {
    questionRecognition.start();
  } catch {
    questionRecording = false;
    button.textContent = 'Spreek in';
    coachAnswer.innerHTML = '<p>De opname kon niet starten. Klik nog één keer op Spreek in of typ je vraag.</p>';
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

function currentLesson() {
  return data.lessons[state.index] || data.lessons[0];
}

function masteryFor(lesson) {
  if (!state.mastery[lesson.id]) state.mastery[lesson.id] = {};
  return state.mastery[lesson.id];
}

function masteryKey(value) {
  return normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function lessonIsMastered(lesson) {
  const mastery = state.mastery[lesson.id] || {};
  return lesson.checks.every(check => mastery[masteryKey(check)]) || Boolean(state.done[lesson.id]);
}

function saveIndex() {
  localStorage.setItem('flits_index', String(state.index));
}

function saveDone() {
  localStorage.setItem('flits_done', JSON.stringify(state.done));
}

function saveMastery() {
  localStorage.setItem('flits_mastery', JSON.stringify(state.mastery));
}

function saveSession() {
  localStorage.setItem('flits_session', JSON.stringify(state.session));
}

function block(label, text) {
  return `
    <article>
      <strong>${escapeHtml(label)}</strong>
      <p>${escapeHtml(text)}</p>
    </article>
  `;
}

function redRetryHtml() {
  return `
    <article class="red-retry-card">
      <strong>Rood naar groen</strong>
      <p>Laat staan wat goed was. Voeg alleen de rode punten toe en check opnieuw.</p>
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
        ${group('is-good', 'Groen · benoemd', good, 'Nog niets overtuigend benoemd.')}
        ${group('is-missing', 'Rood · mist nog', missing, 'Geen harde gaten meer.')}
        ${group('is-vague', 'Geel · maak scherper', vague, 'Nu vooral korter en vloeiender oefenen.')}
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
