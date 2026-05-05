'use strict';

const data = window.LESSEN_DATA;
const state = {
  index: Number(localStorage.getItem('lessen_index') || 0),
  mode: localStorage.getItem('lessen_mode') || 'oral',
  done: JSON.parse(localStorage.getItem('lessen_done') || '{}'),
  mastery: JSON.parse(localStorage.getItem('lessen_mastery') || '{}'),
  drillStats: JSON.parse(localStorage.getItem('lessen_drill_stats') || '{}'),
  drill: null,
  micro: null,
};

const list = document.getElementById('lesson-list');
const select = document.getElementById('lesson-select');
const answerInput = document.getElementById('answer-input');
const feedbackCard = document.getElementById('feedback-card');
const speechNote = document.getElementById('speech-note');
const coachInput = document.getElementById('coach-input');
const coachAnswer = document.getElementById('coach-answer');
const microPanel = document.getElementById('micro-panel');
const microInput = document.getElementById('micro-input');
const microFeedback = document.getElementById('micro-feedback');
const microNote = document.getElementById('micro-note');
const drillBox = document.getElementById('drill-box');

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
  renderDrillBox();
}

function bindEvents() {
  select.addEventListener('change', () => {
    state.index = Number(select.value);
    saveIndex();
    renderLesson();
  });

  document.getElementById('prev-lesson').addEventListener('click', () => moveLesson(-1));
  document.getElementById('next-lesson').addEventListener('click', () => moveLesson(1));
  document.getElementById('check-answer').addEventListener('click', checkAnswer);
  document.getElementById('clear-answer').addEventListener('click', () => {
    answerInput.value = '';
    feedbackCard.innerHTML = '<p class="flits-note">Nog geen antwoord nagekeken.</p>';
    speechNote.textContent = '';
  });
  document.getElementById('record-answer').addEventListener('click', toggleAnswerRecording);
  document.getElementById('mark-done').addEventListener('click', markCurrentLessonDone);
  document.getElementById('ask-coach').addEventListener('click', answerCoachQuestion);
  document.getElementById('record-question').addEventListener('click', toggleQuestionRecording);
  document.getElementById('check-micro').addEventListener('click', checkMicroAnswer);
  document.getElementById('record-micro').addEventListener('click', toggleMicroRecording);
  document.getElementById('close-micro').addEventListener('click', closeMicroPanel);
  document.getElementById('start-drill').addEventListener('click', startSmartDrill);
  document.getElementById('reset-drill').addEventListener('click', resetDrill);

  document.querySelectorAll('.lesson-mode-tab').forEach(button => {
    button.addEventListener('click', () => setMode(button.dataset.mode));
  });

  coachInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') answerCoachQuestion();
  });
}

function renderOptions() {
  select.innerHTML = data.lessons.map((lesson, index) => `<option value="${index}">${escapeHtml(lesson.title)}</option>`).join('');
  renderLessonList();
}

function renderLessonList() {
  list.innerHTML = data.lessons.map((lesson, index) => {
    const active = index === state.index ? ' is-active' : '';
    const done = lessonIsMastered(lesson) ? ' is-done' : '';
    return `
      <button class="flits-list-item${active}${done}" type="button" data-index="${index}">
        <span>${index + 1}</span>
        <strong>${escapeHtml(lesson.title)}</strong>
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
  document.getElementById('lesson-meta').textContent = `${lesson.date} · ${state.index + 1} van ${data.lessons.length} · ${lesson.domain}`;
  document.getElementById('lesson-title').textContent = lesson.title;
  document.getElementById('lesson-summary').textContent = lesson.summary;
  document.getElementById('lesson-tags').innerHTML = lesson.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
  document.getElementById('lesson-criteria').textContent = lesson.criteria;
  document.getElementById('lesson-written-focus').textContent = lesson.writtenFocus;
  document.getElementById('lesson-pitfall').textContent = lesson.pitfall;
  document.getElementById('lesson-zg').textContent = lesson.zg;
  document.getElementById('core-card').textContent = lesson.core;
  document.getElementById('anchor-list').innerHTML = lesson.anchors.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  answerInput.value = '';
  feedbackCard.innerHTML = '<p class="flits-note">Nog geen antwoord nagekeken.</p>';
  speechNote.textContent = '';
  closeMicroPanel();
  renderMode();
  renderMastery();
  renderLessonList();
}

function renderMode() {
  document.querySelectorAll('.lesson-mode-tab').forEach(button => {
    button.classList.toggle('is-active', button.dataset.mode === state.mode);
  });
  const lesson = currentLesson();
  const isOral = state.mode === 'oral';
  document.getElementById('mode-prompt').textContent = isOral ? lesson.oralPrompt : lesson.writtenPrompt;
  document.getElementById('model-summary').textContent = isOral
    ? 'Toon ZG-mondeling antwoord'
    : 'Toon puntenscorend schriftelijk antwoord';
  document.getElementById('model-answer').textContent = isOral ? lesson.oralModel : lesson.writtenModel;
}

function renderProgress() {
  const total = data.lessons.reduce((sum, lesson) => sum + lesson.checks.length, 0);
  const mastered = data.lessons.reduce((sum, lesson) => {
    if (state.done[lesson.id]) return sum + lesson.checks.length;
    const mastery = state.mastery[lesson.id] || {};
    return sum + lesson.checks.filter(check => mastery[topicKey(check)]).length;
  }, 0);
  const doneCount = data.lessons.filter(lesson => lessonIsMastered(lesson)).length;
  const ready = total ? Math.round((mastered / total) * 100) : 0;
  document.getElementById('lesson-ready').textContent = `${ready}%`;
  document.getElementById('lesson-hint').textContent = ready >= 80
    ? 'Sterk. Zet nu slimme drill aan voor toetsdruk.'
    : `${mastered}/${total} onderwerpen beheerst · ${doneCount}/${data.lessons.length} lessen rond.`;
}

function renderMastery() {
  const lesson = currentLesson();
  const mastery = masteryFor(lesson);
  const mastered = lesson.checks.filter(check => mastery[topicKey(check)]);
  const missing = lesson.checks.filter(check => !mastery[topicKey(check)]);

  document.getElementById('mastery-checklist').innerHTML = lesson.checks.map(check => {
    const key = topicKey(check);
    const checked = mastery[key] ? ' checked' : '';
    return `
      <label class="flits-mastery-item">
        <input type="checkbox" data-key="${escapeHtml(key)}"${checked} />
        <span>${escapeHtml(check.title)}</span>
      </label>
    `;
  }).join('');

  document.querySelectorAll('#mastery-checklist input').forEach(input => {
    input.addEventListener('change', () => {
      mastery[input.dataset.key] = input.checked;
      if (!input.checked) state.done[lesson.id] = false;
      if (lesson.checks.every(check => mastery[topicKey(check)])) state.done[lesson.id] = true;
      saveMastery();
      saveDone();
      renderMastery();
      renderProgress();
      renderLessonList();
    });
  });

  const trainList = document.getElementById('train-list');
  if (!missing.length) {
    trainList.innerHTML = `
      <article class="flits-train-item is-complete">
        <strong>Alles staat groen</strong>
        <p>Mooi. Train nu apart: mondeling op rubric 0-4 en schriftelijk als punten/casusantwoord. Start daarna slimme drill.</p>
      </article>
    `;
    return;
  }

  trainList.innerHTML = missing.map(check => `
    <article class="flits-train-item">
      <strong>${escapeHtml(check.title)}</strong>
      <p>${escapeHtml(check.hint)}</p>
      <div class="flits-mini-actions">
        <button type="button" data-topic="${escapeHtml(topicKey(check))}" data-mode="controleer">Controleer</button>
        <button type="button" data-topic="${escapeHtml(topicKey(check))}" data-mode="mondeling">Mondeling</button>
        <button type="button" data-topic="${escapeHtml(topicKey(check))}" data-mode="schriftelijk">Schriftelijk</button>
      </div>
    </article>
  `).join('');

  trainList.querySelectorAll('button').forEach(button => {
    const topic = lesson.checks.find(check => topicKey(check) === button.dataset.topic);
    button.addEventListener('click', () => openMicroPanel(topic, button.dataset.mode));
  });

  if (mastered.length && missing.length) {
    trainList.insertAdjacentHTML('afterbegin', `<p class="flits-note">Al beheerst: ${mastered.length}. Nog open: ${missing.length}. Dit is je snelste route.</p>`);
  }
}

function setMode(mode) {
  state.mode = mode;
  localStorage.setItem('lessen_mode', mode);
  answerInput.value = '';
  feedbackCard.innerHTML = '<p class="flits-note">Nog geen antwoord nagekeken.</p>';
  renderMode();
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
  const result = scoreText(text, lesson.checks, state.mode);
  if (result.score >= 4) {
    const mastery = masteryFor(lesson);
    result.hits.forEach(check => {
      mastery[topicKey(check)] = true;
    });
    if (lesson.checks.every(check => mastery[topicKey(check)])) state.done[lesson.id] = true;
    saveMastery();
    saveDone();
    renderMastery();
    renderProgress();
    renderLessonList();
  }

  feedbackCard.innerHTML = feedbackHtml(result, state.mode, lesson);
  bindRedRetry(feedbackCard, answerInput, speechNote);
}

function scoreText(text, topics, mode) {
  const clean = normalize(text);
  const hits = topics.filter(topic => topic.terms.some(term => clean.includes(normalize(term))));
  const hasApplication = ['kind', 'casus', 'ouder', 'ouders', 'pm', 'school', 'klas', 'mdo', 'behandeling', 'onderzoek', 'test'].some(word => clean.includes(word));
  const hasConsequence = ['daarom', 'dus', 'waardoor', 'betekent', 'conclusie', 'advies', 'vervolg', 'kies', 'onderzoek', 'behandel'].some(word => clean.includes(word));
  const hasOralOrder = ['ik', 'eerst', 'daarna', 'vervolgens', 'omdat', 'ik zou', 'ik check', 'ik onderzoek', 'ik adviseer'].some(word => clean.includes(word));
  const hasWrittenDefinition = ['is', 'betekent', 'houdt in', 'wordt bedoeld'].some(word => clean.includes(word));
  const hasWrittenStructure = ['ten eerste', 'daarnaast', 'omdat', 'concluderend', 'bijvoorbeeld', 'verschil', 'daarentegen', 'terwijl'].some(word => clean.includes(word));
  const hasModeQuality = mode === 'written'
    ? (hasWrittenDefinition && (hasWrittenStructure || hasConsequence))
    : (hasOralOrder && hasConsequence);
  const score = Math.min(4, (hits.length ? 1 : 0) + (hits.length >= 2 ? 1 : 0) + (hasApplication ? 1 : 0) + (hasModeQuality ? 1 : 0));
  const missing = topics.filter(topic => !hits.includes(topic)).slice(0, 3);
  return {
    score,
    hits,
    missing,
    hasApplication,
    hasConsequence,
    hasModeQuality,
    hasOralOrder,
    hasWrittenDefinition,
    hasWrittenStructure
  };
}

function feedbackHtml(result, mode, lesson) {
  const isOral = mode === 'oral';
  const title = feedbackTitle(result.score, mode);
  const scoreLabel = isOral ? `${result.score}/4` : `oefencheck ${result.score}/4`;
  const strong = result.hits.length
    ? `Je gebruikt al: ${result.hits.map(topic => explainTopic(topic)).join(' ')}`
    : 'Je antwoord heeft nog te weinig herkenbare vaktaal. Begin met één kernbegrip uit de les.';
  const feedback = buildFeedback(result, mode);
  const pointsLoss = buildPointsLoss(result, mode, lesson);
  const zg = buildZgTip(result, mode, lesson);
  const upgrade = isOral
    ? 'Maak het mondeling sterker met: “Ik zie..., dat betekent..., daarom onderzoek/adviseer ik...”'
    : 'Maak het schriftelijk sterker met: definitie + vergelijking + casustoepassing + conclusie.';
  const lossLabel = isOral ? 'Criteriumverlies' : 'Puntenverlies';
  const excellenceLabel = isOral ? 'ZG-signaal' : 'Puntensignaal';
  const upgradeLabel = isOral ? 'Van G naar ZG' : 'Naar meer punten';

  return `
    <div class="flits-feedback-head">
      <h3>${title}</h3>
      <strong>${scoreLabel}</strong>
    </div>
    ${coachScanHtml(coachScanForResult(result, mode))}
    ${block('Sterk', strong)}
    ${block('Feedback', result.score >= 4 ? 'Inhoudelijk klaar. Oefen nu korter en zonder lezen.' : feedback)}
    ${block(lossLabel, result.score >= 4 ? 'Geen groot verlies zichtbaar. Let alleen op bondigheid.' : pointsLoss)}
    ${block(excellenceLabel, result.score >= 4 ? lesson.zg : zg)}
    ${result.score === 3 ? block(upgradeLabel, upgrade) : ''}
    ${result.score < 4 ? redRetryHtml() : ''}
  `;
}

function feedbackTitle(score, mode) {
  if (mode === 'oral') {
    const labels = ['0/4 · O', '1/4 · BV', '2/4 · V', '3/4 · G', '4/4 · ZG'];
    return labels[score] || 'Nog aanvullen';
  }
  if (score >= 4) return 'Schriftelijk · volledig casusantwoord';
  if (score === 3) return 'Schriftelijk · bijna volledig';
  if (score === 2) return 'Schriftelijk · basis staat';
  return 'Schriftelijk · nog te weinig punten';
}

function coachScanForResult(result, mode) {
  const good = [
    ...result.hits.map(topic => topic.title),
    ...(result.hasApplication ? ['casus/context toegepast'] : []),
    ...(result.hasConsequence ? ['conclusie of vervolgstap genoemd'] : []),
    ...(mode === 'oral' && result.hasOralOrder ? ['mondelinge handelingsvolgorde'] : []),
    ...(mode === 'written' && result.hasWrittenDefinition ? ['schriftelijke definitie'] : []),
    ...(mode === 'written' && result.hasWrittenStructure ? ['schriftelijke structuur/vergelijking'] : [])
  ];
  const missing = [
    ...result.missing.map(topic => topic.title),
    ...(!result.hasApplication ? ['casusbewijs of context'] : []),
    ...(!result.hasConsequence ? ['conclusie/advies/vervolgstap'] : []),
    ...(mode === 'oral' && !result.hasOralOrder ? ['hardop volgorde: eerst, daarna, daarom'] : []),
    ...(mode === 'written' && !result.hasWrittenDefinition ? ['heldere definitie'] : [])
  ];
  const vague = mode === 'oral'
    ? ['Zeg het als handelen van jou als logopedist, niet als losse theorie.']
    : ['Schrijf in puntenvolgorde: definitie -> casusbewijs -> conclusie.'];
  return { good, missing, vague: result.score >= 4 ? [] : vague };
}

function buildFeedback(result, mode) {
  const feedback = [];
  if (result.missing.length) feedback.push(`Voeg toe: ${result.missing.map(topic => explainTopic(topic)).join(' ')}`);
  if (!result.hasApplication) feedback.push('Maak het casusvast: kind, ouder, PM-er, test, klas of MDO noemen.');
  if (mode === 'oral' && !result.hasModeQuality) feedback.push('Zeg je handelingsvolgorde hardop: eerst check ik..., daarna..., daarom...');
  if (mode === 'written' && !result.hasModeQuality) feedback.push('Maak het schrijfbaar: definitie + toepassing + conclusie/advies.');
  if (!result.hasConsequence) feedback.push(mode === 'oral' ? 'Zeg wat je ermee doet.' : 'Sluit af met een puntscorende conclusie.');
  return feedback.join(' ');
}

function buildPointsLoss(result, mode, lesson) {
  const losses = [];
  if (!result.hits.length) losses.push('Geen herkenbare lesbegrippen: docent kan je kennis niet beoordelen.');
  if (result.missing.length) losses.push(`Mist toetsanker: ${result.missing[0].title}.`);
  if (!result.hasApplication) losses.push('Blijft losse theorie zonder casusbewijs.');
  if (mode === 'oral' && !result.hasModeQuality) losses.push('Mondeling klinkt niet handelend/professioneel genoeg.');
  if (mode === 'written' && !result.hasWrittenDefinition) losses.push('Schriftelijk ontbreekt een heldere definitie.');
  if (mode === 'written' && !result.hasConsequence) losses.push('Schriftelijk ontbreekt conclusie of advies.');
  if (!losses.length) losses.push(lesson.pitfall);
  return losses.join(' ');
}

function buildZgTip(result, mode, lesson) {
  if (result.missing.length) {
    return `Pak dit ene ontbrekende anker: ${result.missing[0].title}. ${lesson.zg}`;
  }
  if (!result.hasApplication) return `Voeg één concrete casuszin toe. ${lesson.zg}`;
  if (mode === 'oral') return `Maak het actief: “Ik zie..., ik weeg..., ik kies...”. ${lesson.zg}`;
  return `Maak het puntscorend: definitie, tegenstelling, toepassing, conclusie. ${lesson.zg}`;
}

function openMicroPanel(topic, mode) {
  const lesson = currentLesson();
  state.micro = { lessonId: lesson.id, topicKey: topicKey(topic), mode };
  microPanel.hidden = false;
  microInput.value = '';
  microFeedback.innerHTML = '';
  microNote.textContent = '';
  document.getElementById('micro-mode').textContent = modeLabel(mode);
  document.getElementById('micro-title').textContent = topic.title;
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
  if (mode === 'mondeling') {
    return `Zeg in 30 seconden: wat is ${topic.title}, wat zie je in een casus en wat doe je daarna?`;
  }
  if (mode === 'schriftelijk') {
    return `Schrijf 3 zinnen: definitie van ${topic.title}, toepassing op een casus en conclusie/advies. Vermijd losse opsomming.`;
  }
  return `Leg ${topic.title} kort uit. Noem wat het is, waarom het toetsrelevant is en wat je ermee doet.`;
}

function modeLabel(mode) {
  if (mode === 'mondeling') return 'Mondeling';
  if (mode === 'schriftelijk') return 'Schriftelijk';
  return 'Controleer';
}

function checkMicroAnswer() {
  const text = microInput.value.trim();
  if (!state.micro || !text) {
    microNote.textContent = 'Typ of spreek eerst je korte uitleg in.';
    return;
  }

  const lesson = data.lessons.find(item => item.id === state.micro.lessonId) || currentLesson();
  const topic = lesson.checks.find(check => topicKey(check) === state.micro.topicKey);
  if (!topic) return;

  const result = scoreText(text, [topic], state.micro.mode === 'schriftelijk' ? 'written' : 'oral');
  const clean = normalize(text);
  const hasTopic = topic.terms.some(term => clean.includes(normalize(term))) || clean.includes(normalize(topic.title));
  const hasApplication = result.hasApplication;
  const hasExplanation = /\b(betekent|is|omdat|zodat|daardoor|verschil|gaat over)\b/.test(clean) || text.length > 90;
  const hasAction = ['daarom', 'advies', 'onderzoek', 'behandeling', 'ik kies', 'ik check', 'ik verwijs', 'conclusie'].some(word => clean.includes(word));
  const score = Math.min(3, [hasTopic, hasExplanation, hasApplication, hasAction].filter(Boolean).length);
  const missing = [];
  if (!hasTopic) missing.push(`noem het begrip zelf: ${explainTopic(topic)}`);
  if (!hasExplanation) missing.push('leg kort uit wat het betekent');
  if (!hasApplication) missing.push('koppel aan kind, casus, toets, test of behandeling');
  if (!hasAction) missing.push('zeg welke keuze, check of conclusie eruit volgt');

  if (score >= 3) {
    markTopicMastered(lesson, topic);
  }
  if (state.drill && state.drill.topicKey === topicKey(topic)) {
    updateDrillStats(lesson, topic, score);
  }

  microFeedback.innerHTML = `
    <div class="flits-feedback-head">
      <h3>${microScoreTitle(score, state.micro.mode)}</h3>
      <strong>${state.micro.mode === 'schriftelijk' ? `check ${score}/3` : `${score}/3`}</strong>
    </div>
    ${coachScanHtml({
      good: [
        ...(hasTopic ? [`begrip genoemd: ${topic.title}`] : []),
        ...(hasExplanation ? ['uitleg gegeven'] : []),
        ...(hasApplication ? ['casus/context genoemd'] : []),
        ...(hasAction ? ['keuze, check of conclusie genoemd'] : [])
      ],
      missing,
      vague: score >= 3 ? [] : ['Maak van je uitleg één toetszin met gevolg voor handelen.']
    })}
    ${block('Goed', hasTopic ? `Je raakt het onderwerp: ${explainTopic(topic)}` : 'Je probeert het kort te houden. Nu nog het begrip expliciet noemen.')}
    ${score < 3 ? block('Mist nog', missing.join(' · ')) : block('Coach', 'Ik heb dit onderwerp gemarkeerd als beheerst. Herhaal het nu nog één keer zonder te lezen.')}
    ${score < 3 ? block(state.micro.mode === 'mondeling' ? 'Criteriumverlies' : 'Puntenverlies', `Zonder toepassing en vervolgstap blijft dit een losse term. Valkuil bij deze les: ${lesson.pitfall}`) : ''}
    ${score < 3 ? block(state.micro.mode === 'schriftelijk' ? 'Maak punten door' : 'Maak ZG door', `Gebruik: “${topic.title} betekent... In deze casus zie ik... Daarom...”`) : ''}
  `;
}

function microScoreTitle(score, mode) {
  if (score >= 3) {
    if (mode === 'mondeling') return '3/3 · mondeling klaar';
    if (mode === 'schriftelijk') return '3/3 · schriftelijk bruikbaar';
    return '3/3 · beheerst';
  }
  if (score === 2) return mode === 'schriftelijk' ? '2/3 · bijna puntenpakker' : '2/3 · bijna';
  return mode === 'schriftelijk' ? 'Nog concreter schrijven' : 'Nog scherper';
}

function startSmartDrill() {
  const pick = selectSmartTopic();
  if (!pick) return;
  state.index = pick.lessonIndex;
  state.mode = pick.mode === 'schriftelijk' ? 'written' : 'oral';
  state.drill = {
    lessonId: pick.lesson.id,
    topicKey: topicKey(pick.topic),
    topicTitle: pick.topic.title,
    mode: pick.mode,
  };
  saveIndex();
  localStorage.setItem('lessen_mode', state.mode);
  renderLesson();
  openMicroPanel(pick.topic, pick.mode);
  renderDrillBox();
}

function selectSmartTopic() {
  const all = [];
  data.lessons.forEach((lesson, lessonIndex) => {
    const mastery = state.mastery[lesson.id] || {};
    lesson.checks.forEach(topic => {
      const key = topicKey(topic);
      const stat = drillStat(lesson, topic);
      const mastered = mastery[key] || state.done[lesson.id];
      const sameAsLast = state.drill && state.drill.topicKey === key;
      const weight = (stat.count * 5) + (stat.best * 2) + (mastered ? 3 : 0) + (sameAsLast ? 20 : 0);
      all.push({ lesson, lessonIndex, topic, stat, weight });
    });
  });
  if (!all.length) return null;
  all.sort((a, b) => a.weight - b.weight || a.lessonIndex - b.lessonIndex);
  const pool = all.slice(0, Math.min(4, all.length));
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  const mode = chosen.stat.oral <= chosen.stat.written ? 'mondeling' : 'schriftelijk';
  return { ...chosen, mode };
}

function renderDrillBox() {
  if (!state.drill) {
    drillBox.innerHTML = '<p class="flits-note">Nog geen slimme vraag gestart.</p>';
    return;
  }
  drillBox.innerHTML = `
    <article class="flits-train-item">
      <strong>${escapeHtml(state.drill.mode)} · ${escapeHtml(state.drill.topicTitle)}</strong>
      <p>Beantwoord de opengeklapte coachvraag hierboven. Mondeling telt als rubric-training; schriftelijk telt als punten/casus-training. De coach let op vaktaal, toepassing en vervolgstap.</p>
    </article>
  `;
}

function resetDrill() {
  state.drillStats = {};
  state.drill = null;
  saveDrillStats();
  renderDrillBox();
}

function updateDrillStats(lesson, topic, score) {
  const stat = drillStat(lesson, topic);
  stat.count += 1;
  stat.best = Math.max(stat.best, score);
  if (state.micro.mode === 'mondeling') stat.oral += 1;
  if (state.micro.mode === 'schriftelijk') stat.written += 1;
  stat.last = Date.now();
  saveDrillStats();
  renderDrillBox();
}

function drillStat(lesson, topic) {
  const key = `${lesson.id}:${topicKey(topic)}`;
  if (!state.drillStats[key]) state.drillStats[key] = { count: 0, best: 0, oral: 0, written: 0, last: 0 };
  return state.drillStats[key];
}

function markCurrentLessonDone() {
  const lesson = currentLesson();
  const mastery = masteryFor(lesson);
  lesson.checks.forEach(check => {
    mastery[topicKey(check)] = true;
  });
  state.done[lesson.id] = true;
  saveMastery();
  saveDone();
  renderMastery();
  renderProgress();
  renderLessonList();
}

function markTopicMastered(lesson, topic) {
  const mastery = masteryFor(lesson);
  mastery[topicKey(topic)] = true;
  if (lesson.checks.every(check => mastery[topicKey(check)])) state.done[lesson.id] = true;
  saveMastery();
  saveDone();
  renderMastery();
  renderProgress();
  renderLessonList();
}

function answerCoachQuestion() {
  const question = coachInput.value.trim();
  if (!question) {
    coachAnswer.innerHTML = '<p>Stel eerst je vraag. Bijvoorbeeld: “hoe koppel ik W8 aan de toets?”</p>';
    return;
  }

  const lesson = currentLesson();
  const clean = normalize(question);
  let title = 'Coachadvies';
  let body = `Bij ${lesson.title} moet je vooral dit kunnen: ${lesson.core}`;
  let action = `Actie: oefen nu één open onderwerp uit “Nog trainen”.`;

  if (clean.includes('punt') || clean.includes('score') || clean.includes('cijfer')) {
    if (clean.includes('schrift')) {
      title = 'Schriftelijke puntentelling';
      body = 'Schriftelijk is 135 punten totaal, met een voldoende vanaf 74,25 punten. De 15 stellingen leveren samen 25 punten op met gokkanscorrectie; de 5 open casussen leveren samen 110 punten op.';
      action = 'Actie: train open casusantwoorden met definitie, casusbewijs en conclusie. Casus 2 en 4 zijn extra zwaar: 25 punten.';
    } else if (clean.includes('mondeling') || clean.includes('praktijk')) {
      title = 'Mondelinge puntentelling';
      body = 'Mondeling werkt met 0 O, 1 BV, 2 V, 3 G en 4 ZG per criterium. Deel 1 en deel 2 hebben elk 10 criteria en minimaal 20 van de 40 punten nodig.';
      action = 'Actie: score jezelf per criterium en bewaak extra criterium 10, 15 en 17: die moeten minimaal V zijn.';
    } else {
      title = 'Kies eerst de toetsvorm';
      body = 'Gebruik rubric-taal alleen voor mondeling. Gebruik punten/casus-taal voor schriftelijk. Zo houd je voorbereiding en feedback schoon gescheiden.';
      action = 'Actie: kies bovenaan Mondeling · rubric 0-4 of Schriftelijk · punten/casus en oefen daarna pas.';
    }
  } else if (clean.includes('mondeling') || clean.includes('praktijk') || clean.includes('zeg')) {
    title = 'Mondelinge route';
    body = lesson.oralModel;
    action = `Actie: zeg dit in 45 seconden en eindig met: ${lesson.zg}`;
  } else if (clean.includes('schrift') || clean.includes('opschrijven') || clean.includes('toets')) {
    title = 'Schriftelijke route';
    body = lesson.writtenModel;
    action = `Actie: schrijf dit als definitie + toepassing + conclusie. Vermijd: ${lesson.pitfall}`;
  } else if (clean.includes('casus') || clean.includes('toepas')) {
    title = 'Koppel aan casus';
    body = 'Gebruik de brug: observatie -> begrip/model -> gevolg voor activiteit/participatie -> vervolgstap.';
    action = `Actie: begin met “In deze casus betekent ${lesson.checks[0].title} dat...”`;
  } else if (clean.includes('zg') || clean.includes('10')) {
    const isWritten = state.mode === 'written' || clean.includes('schrift');
    title = isWritten ? 'Naar meer schriftelijke punten' : 'Naar ZG';
    body = isWritten
      ? `Een sterk schriftelijk antwoord is puntenscorend: ${lesson.writtenFocus}`
      : `Een ZG-antwoord is niet langer, maar preciezer: ${lesson.zg}`;
    action = isWritten
      ? `Actie: schrijf ${lesson.checks[0].title} als definitie, casusbewijs en conclusie.`
      : `Actie: gebruik ${lesson.checks[0].title}, ${lesson.checks[1]?.title || lesson.domain} en een concrete vervolgstap.`;
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
  stopOtherRecording('answer');
  answerRecording = true;
  button.textContent = 'Stop';
  speechNote.textContent = 'Opname loopt. Antwoord alsof je in de toets zit.';
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
  stopOtherRecording('question');
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
  stopOtherRecording('micro');
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

function stopOtherRecording(except) {
  if (except !== 'answer' && answerRecording && answerRecognition) answerRecognition.stop();
  if (except !== 'question' && questionRecording && questionRecognition) questionRecognition.stop();
  if (except !== 'micro' && microRecording && microRecognition) microRecognition.stop();
}

function migrateDoneToMastery() {
  let changed = false;
  data.lessons.forEach(lesson => {
    if (!state.done[lesson.id]) return;
    const mastery = masteryFor(lesson);
    lesson.checks.forEach(check => {
      const key = topicKey(check);
      if (!mastery[key]) {
        mastery[key] = true;
        changed = true;
      }
    });
  });
  if (changed) saveMastery();
}

function currentLesson() {
  return data.lessons[state.index] || data.lessons[0];
}

function masteryFor(lesson) {
  if (!state.mastery[lesson.id]) state.mastery[lesson.id] = {};
  return state.mastery[lesson.id];
}

function topicKey(topic) {
  return normalize(topic.title).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function lessonIsMastered(lesson) {
  const mastery = state.mastery[lesson.id] || {};
  return lesson.checks.every(check => mastery[topicKey(check)]) || Boolean(state.done[lesson.id]);
}

function explainTopic(topic) {
  return `${topic.title} (${topic.hint})`;
}

function saveIndex() {
  localStorage.setItem('lessen_index', String(state.index));
}

function saveDone() {
  localStorage.setItem('lessen_done', JSON.stringify(state.done));
}

function saveMastery() {
  localStorage.setItem('lessen_mastery', JSON.stringify(state.mastery));
}

function saveDrillStats() {
  localStorage.setItem('lessen_drill_stats', JSON.stringify(state.drillStats));
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
  return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
