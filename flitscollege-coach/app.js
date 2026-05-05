'use strict';

const data = window.FLITS_DATA;
const state = {
  index: Number(localStorage.getItem('flits_index') || 0),
  done: JSON.parse(localStorage.getItem('flits_done') || '{}'),
  mastery: JSON.parse(localStorage.getItem('flits_mastery') || '{}'),
  micro: null,
};

const list = document.getElementById('flits-list');
const select = document.getElementById('flits-select');
const answerInput = document.getElementById('answer-input');
const feedbackCard = document.getElementById('feedback-card');
const speechNote = document.getElementById('speech-note');
const coachInput = document.getElementById('coach-input');
const coachAnswer = document.getElementById('coach-answer');
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
  document.getElementById('case-question').textContent = lesson.caseQuestion;
  document.getElementById('oral-prompt').textContent = lesson.oralPrompt;
  document.getElementById('model-answer').textContent = lesson.model;
  answerInput.value = '';
  feedbackCard.innerHTML = '<p class="flits-note">Nog geen antwoord nagekeken.</p>';
  speechNote.textContent = '';
  closeMicroPanel();
  renderMastery();
  renderLessonList();
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
  const explainedHits = hits.map(explainTerm);

  feedbackCard.innerHTML = `
    <div class="flits-feedback-head">
      <h3>${score >= 4 ? '4/4 · toetswaardig' : score === 3 ? '3/4 · bijna ZG' : 'Nog aanvullen'}</h3>
      <strong>${score}/4</strong>
    </div>
    ${coachScanHtml({
      good: explainedHits,
      missing: [...missing.map(explainTerm), ...(!hasCase ? ['casuskoppeling: kind, onderzoek, behandeling of schoolcontext'] : [])],
      vague: score >= 4 ? [] : ['Maak één toetszin: begrip -> casusbewijs -> vervolgstap.']
    })}
    ${block('Sterk', explainedHits.length ? `Je noemt al: ${explainedHits.join(' ')}` : 'Je antwoord heeft nog te weinig herkenbare vaktaal. Noem eerst het probleem en één voorbeeld uit de casus.')}
    ${block('Feedback', feedbackText(score, missing, hasCase))}
    ${score === 3 ? block('Van 3/4 naar 4/4', upgradeText(missing, hasCase)) : ''}
  `;
}

function feedbackText(score, missing, hasCase) {
  if (score >= 4) return 'Inhoudelijk klaar. Oefen dit nu hardop in maximaal 60 seconden.';
  const parts = [];
  if (missing.length) {
    parts.push(`Voeg concreet toe: ${missing.map(explainTerm).join(' ')}`);
  }
  if (!hasCase) {
    parts.push('Maak het minder los: zeg over welk kind of welke situatie je het hebt. Bijvoorbeeld: “Dit kind zegt /t/ voor /k/ in de klas, daardoor is hij minder verstaanbaar.”');
  }
  return parts.join(' ');
}

function upgradeText(missing, hasCase) {
  if (!hasCase) return 'Voeg één concrete casuszin toe: “Bij dit kind zie ik dit doordat...” en check opnieuw.';
  if (missing.length) return `Voeg dit ene punt toe: ${explainTerm(missing[0])} Check daarna opnieuw.`;
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
    return `Pas ${topic} toe op deze casusvraag: ${lesson.caseQuestion}`;
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
  microRecognition.start();
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

function block(label, text) {
  return `
    <article>
      <strong>${escapeHtml(label)}</strong>
      <p>${escapeHtml(text)}</p>
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
