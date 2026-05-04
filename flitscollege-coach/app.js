'use strict';

const data = window.FLITS_DATA;
const state = {
  index: Number(localStorage.getItem('flits_index') || 0),
  done: JSON.parse(localStorage.getItem('flits_done') || '{}'),
};

const list = document.getElementById('flits-list');
const select = document.getElementById('flits-select');
const answerInput = document.getElementById('answer-input');
const feedbackCard = document.getElementById('feedback-card');
const speechNote = document.getElementById('speech-note');
const coachInput = document.getElementById('coach-input');
const coachAnswer = document.getElementById('coach-answer');

let answerRecognition = null;
let answerRecording = false;
let questionRecognition = null;
let questionRecording = false;

boot();

function boot() {
  renderOptions();
  bindEvents();
  renderLesson();
  renderProgress();
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
    state.done[lesson.id] = true;
    saveDone();
    renderProgress();
    renderLessonList();
  });
  document.getElementById('ask-coach').addEventListener('click', answerCoachQuestion);
  document.getElementById('record-question').addEventListener('click', toggleQuestionRecording);
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
    const done = state.done[lesson.id] ? ' is-done' : '';
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
  document.getElementById('case-question').textContent = lesson.caseQuestion;
  document.getElementById('oral-prompt').textContent = lesson.oralPrompt;
  document.getElementById('model-answer').textContent = lesson.model;
  answerInput.value = '';
  feedbackCard.innerHTML = '<p class="flits-note">Nog geen antwoord nagekeken.</p>';
  speechNote.textContent = '';
  renderLessonList();
}

function renderProgress() {
  const doneCount = data.lessons.filter(lesson => state.done[lesson.id]).length;
  const ready = Math.round((doneCount / data.lessons.length) * 100);
  document.getElementById('flits-ready').textContent = `${ready}%`;
  document.getElementById('flits-hint').textContent = ready >= 80
    ? 'Sterk. Herhaal nu alleen de zwakke flitsen hardop.'
    : `${doneCount}/${data.lessons.length} flitscolleges beheerst.`;
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
  const score = Math.min(4, hits.length + (hasCase ? 1 : 0));
  const missing = lesson.checks.filter(check => !hits.includes(check)).slice(0, 3);

  feedbackCard.innerHTML = `
    <div class="flits-feedback-head">
      <h3>${score >= 4 ? '4/4 · toetswaardig' : score === 3 ? '3/4 · bijna ZG' : 'Nog aanvullen'}</h3>
      <strong>${score}/4</strong>
    </div>
    ${block('Sterk', hits.length ? `Je gebruikt kernwoorden: ${hits.join(', ')}.` : 'Je antwoord heeft nog weinig herkenbare vaktaal.')}
    ${block('Feedback', feedbackText(score, missing, hasCase))}
    ${score === 3 ? block('Van 3/4 naar 4/4', `Voeg één casuskoppeling of dit kernwoord toe: ${missing[0] || 'participatie'}. Check daarna opnieuw.`) : ''}
  `;
}

function feedbackText(score, missing, hasCase) {
  if (score >= 4) return 'Inhoudelijk klaar. Oefen dit nu hardop in maximaal 60 seconden.';
  const parts = [];
  if (missing.length) parts.push(`Mis nog: ${missing.join(', ')}.`);
  if (!hasCase) parts.push('Koppel je uitleg aan een kind, casus, onderzoek of klascontext.');
  return parts.join(' ');
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
    title = 'Koppel aan casus';
    body = `Gebruik de brug: observatie -> taalniveau/probleem -> gevolg voor activiteit/participatie. Bij ${lesson.title} is het belangrijkste kernwoord: ${lesson.checks[0]}.`;
    action = 'Actie: begin je antwoord met “In deze casus betekent dit dat...”.';
  } else if (clean.includes('mondeling') || clean.includes('zeg')) {
    title = 'Mondelinge formulering';
    body = lesson.model;
    action = 'Actie: zeg dit nu in 30 seconden zonder te lezen.';
  } else if (clean.includes('leren') || clean.includes('onthoud')) {
    title = 'Wat moet je onthouden?';
    body = lesson.memory.slice(0, 3).join(' · ');
    action = 'Actie: schrijf deze drie punten uit je hoofd op en maak daarna de casusvraag.';
  } else if (clean.includes('zg') || clean.includes('10') || clean.includes('toets')) {
    title = 'Naar ZG';
    body = 'Een ZG-antwoord noemt niet alleen het begrip, maar past het toe op een kind en zegt wat dit betekent voor diagnostiek of behandeling.';
    action = `Actie: gebruik ${lesson.checks[0]}, ${lesson.checks[1] || lesson.domain} en een casusgevolg in één antwoord.`;
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
  }

  if (answerRecording) {
    answerRecognition.stop();
    return;
  }
  if (questionRecording && questionRecognition) questionRecognition.stop();
  answerRecording = true;
  button.textContent = 'Stop';
  speechNote.textContent = 'Opname loopt. Geef je antwoord alsof je in de toets zit.';
  answerRecognition.start();
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
  }

  if (questionRecording) {
    questionRecognition.stop();
    return;
  }
  if (answerRecording && answerRecognition) answerRecognition.stop();
  questionRecording = true;
  button.textContent = 'Stop';
  coachAnswer.innerHTML = '<p>Ik luister. Stel je vraag kort.</p>';
  questionRecognition.start();
}

function currentLesson() {
  return data.lessons[state.index] || data.lessons[0];
}

function saveIndex() {
  localStorage.setItem('flits_index', String(state.index));
}

function saveDone() {
  localStorage.setItem('flits_done', JSON.stringify(state.done));
}

function block(label, text) {
  return `
    <article>
      <strong>${escapeHtml(label)}</strong>
      <p>${escapeHtml(text)}</p>
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
