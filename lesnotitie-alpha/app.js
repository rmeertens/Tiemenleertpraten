'use strict';

const notesKey = 'lesnotitie_alpha_notes';
const suspectWords = [
  'bsn', 'adres', 'telefoon', 'telefoonnummer', 'mailadres', 'diagnose van', 'medicatie',
  'ziek thuis', 'relatie', 'rood verhaal', 'roddel', 'prive', 'privé', 'achternaam',
  'instagram', 'whatsapp', 'nummer', 'stagebegeleider zei over'
];
const lessonWords = [
  'toets', 'tentamen', 'casus', 'criteria', 'criterium', 'logoped', 'diagnostiek',
  'behandeling', 'spraak', 'taal', 'stem', 'fonetiek', 'fonologie', 'tos', 'icf',
  'methode', 'doel', 'observatie', 'analyse', 'onderzoek', 'client', 'cliënt'
];
const oralSignals = [
  ['Criteriumtaal', ['criterium', 'rubric', 'zg', 'mondeling', 'verantwoorden'], 'Zeg hardop: criterium → casusbewijs → keuze → waarom.'],
  ['Diagnostisch handelen', ['diagnostiek', 'onderzoek', 'test', 'observatie', 'analyse', 'differentiaal'], 'Leg uit wat je ziet, wat je uitsluit en welke vervolgstap logisch is.'],
  ['Behandeling', ['behandeling', 'methode', 'doel', 'interventie', 'evaluatie', 'prognose'], 'Verdedig doel, methode, vorm, frequentie en evaluatie in één klinische lijn.'],
  ['Samenwerking', ['ouders', 'leerkracht', 'school', 'ib', 'mdo', 'samenwerking'], 'Noem wie je betrekt, wat je afspreekt en waarom dat transfer oplevert.'],
  ['Reflectie', ['fout', 'validiteit', 'betrouwbaarheid', 'bijstellen', 'evalueren'], 'Benoem wat mis kan gaan en hoe je professioneel bijstuurt.']
];
const writtenSignals = [
  ['Definitie', ['definitie', 'betekent', 'begrip', 'kenmerk', 'stoornis'], 'Begin met een korte vakdefinitie in eigen woorden.'],
  ['Casusbewijs', ['casus', 'signaal', 'observatie', 'score', 'voorbeeld', 'onderzoek'], 'Schrijf letterlijk welk gegeven uit de casus jouw antwoord bewijst.'],
  ['Verklaring', ['omdat', 'waardoor', 'verklaart', 'oorzaak', 'gevolg', 'daarom'], 'Koppel oorzaak en gevolg expliciet, anders laat je punten liggen.'],
  ['Advies', ['advies', 'aanpak', 'behandel', 'vervolg', 'ouder', 'school'], 'Sluit af met een concrete vervolgstap of handelingsadvies.'],
  ['Nuance', ['meertaligheid', 'ses', 'gehoor', 'comorbiditeit', 'differentiaal'], 'Laat zien dat je alternatieve verklaringen niet platwalst. Keurig menselijk, ook handig voor punten.']
];
const contextTerms = [
  ['icf', 'ICF'],
  ['tos', 'TOS'],
  ['omft', 'OMFT'],
  ['v o d', 'VOD'],
  ['verbale ontwikkelings dyspraxie', 'verbale ontwikkelingsdyspraxie'],
  ['verbale ontwikkelingspraxis', 'verbale ontwikkelingsdyspraxie'],
  ['fonologie', 'fonologie'],
  ['fonologische', 'fonologische'],
  ['fonetiek', 'fonetiek'],
  ['morfos syntaxis', 'morfosyntaxis'],
  ['morfosyntax is', 'morfosyntaxis'],
  ['morfo syntaxis', 'morfosyntaxis'],
  ['semantiek', 'semantiek'],
  ['pragmatiek', 'pragmatiek'],
  ['stimulabiliteit', 'stimulabiliteit'],
  ['stimulatie biliteit', 'stimulabiliteit'],
  ['minimale paren', 'minimale paren'],
  ['contrast therapie', 'contrasttherapie'],
  ['metaphon', 'Metaphon'],
  ['hodson en paden', 'Hodson & Paden'],
  ['hodson paden', 'Hodson & Paden'],
  ['scaffolding', 'scaffolding'],
  ['zone van naaste ontwikkeling', 'Zone van Naaste Ontwikkeling'],
  ['z p d', 'ZPD'],
  ['fast mapping', 'fast mapping'],
  ['joint attention', 'joint attention'],
  ['theory of mind', 'Theory of Mind'],
  ['sally anne', 'Sally-Anne'],
  ['schlichting', 'Schlichting'],
  ['zinsontwikkeling', 'Zinsontwikkeling'],
  ['taalbegrip', 'Taalbegrip'],
  ['ontwikkelings perspectief', 'ontwikkelingsperspectief'],
  ['ontwikkelingsperspectiefplan', 'ontwikkelingsperspectiefplan']
];
const contextConfusions = [
  ['tops', 'TOS'],
  ['tosse', 'TOS'],
  ['tos problematiek', 'TOS-problematiek'],
  ['vod', 'VOD'],
  ['voet', 'VOD'],
  ['f o d', 'VOD'],
  ['fonologische stoornis', 'fonologische stoornis'],
  ['fonologische proces', 'fonologisch proces'],
  ['fone logie', 'fonologie'],
  ['foneetiek', 'fonetiek'],
  ['morfo syntactisch', 'morfosyntactisch'],
  ['pragmatische stoornis', 'pragmatische stoornis'],
  ['stimulatie kwaliteit', 'stimulabiliteit'],
  ['minimale paarden', 'minimale paren'],
  ['minimale parels', 'minimale paren'],
  ['contrastieve therapie', 'contrastieve therapie'],
  ['metafoon', 'Metaphon'],
  ['hodson en paarden', 'Hodson & Paden'],
  ['hossen en paden', 'Hodson & Paden'],
  ['om ft', 'OMFT'],
  ['open beet', 'open beet'],
  ['interdentale sigmatismus', 'interdentaal sigmatisme'],
  ['sigmatisme', 'sigmatisme'],
  ['scaffold ding', 'scaffolding'],
  ['fast met ping', 'fast mapping'],
  ['gezamenlijke aandacht', 'joint attention'],
  ['theorie of mind', 'Theory of Mind'],
  ['sally en', 'Sally-Anne'],
  ['schlichting drie', 'Schlichting-3'],
  ['schlichting 3', 'Schlichting-3'],
  ['taal begrip', 'Taalbegrip'],
  ['zin ontwikkeling', 'Zinsontwikkeling'],
  ['v v e', 'VVE'],
  ['i c f', 'ICF'],
  ['ses', 'SES'],
  ['k n o', 'KNO'],
  ['audioloog', 'audioloog']
];

const fields = {
  title: document.getElementById('lesson-title'),
  date: document.getElementById('lesson-date'),
  theme: document.getElementById('lesson-theme'),
  goal: document.getElementById('lesson-goal'),
  transcript: document.getElementById('transcript'),
  concepts: document.getElementById('core-concepts'),
  anchors: document.getElementById('exam-anchors'),
  application: document.getElementById('case-application'),
  questions: document.getElementById('open-questions')
};

const privacyCheck = document.getElementById('privacy-check');
const noteScore = document.getElementById('note-score');
const noteHint = document.getElementById('note-hint');
const recordButton = document.getElementById('record-toggle');
const recordStatus = document.getElementById('record-status');
const audioButton = document.getElementById('audio-backup-toggle');
const audioStatus = document.getElementById('audio-backup-status');
const audioDownload = document.getElementById('audio-download');
const privacyResults = document.getElementById('privacy-results');
const contextResults = document.getElementById('context-results');
const coachFeedback = document.getElementById('coach-feedback');
const aiPrompt = document.getElementById('ai-prompt');
const copyStatus = document.getElementById('copy-status');
const oralRadar = document.getElementById('oral-radar');
const writtenRadar = document.getElementById('written-radar');
const oralDrill = document.getElementById('oral-drill');
const writtenDrill = document.getElementById('written-drill');

let recognition = null;
let recording = false;
let recordingBase = '';
let sessionFinal = '';
let sessionInterim = '';
let recordingStartedAt = 0;
let checkpointTimer = null;
let mediaRecorder = null;
let audioChunks = [];
let audioStream = null;
let flaggedSentences = [];
let contextSuggestions = [];

boot();

function boot() {
  fields.date.value = localDateKey(new Date());
  bindEvents();
  hydrateDraft();
  updatePrompt();
  updateScore();
}

function bindEvents() {
  document.getElementById('record-toggle').addEventListener('click', toggleRecording);
  document.getElementById('checkpoint-transcript').addEventListener('click', checkpointTranscript);
  document.getElementById('audio-backup-toggle').addEventListener('click', toggleAudioBackup);
  document.getElementById('context-correct').addEventListener('click', buildContextSuggestions);
  document.getElementById('apply-context').addEventListener('click', applyContextSuggestions);
  document.getElementById('scan-transcript').addEventListener('click', scanTranscript);
  document.getElementById('clear-transcript').addEventListener('click', () => {
    fields.transcript.value = '';
    recordingBase = '';
    sessionFinal = '';
    sessionInterim = '';
    flaggedSentences = [];
    privacyResults.innerHTML = '<p class="note-small">Transcript gewist. Minder ruis, letterlijk.</p>';
    persistDraft();
    updatePrompt();
    updateScore();
  });
  document.getElementById('apply-clean').addEventListener('click', applyCleanVersion);
  document.getElementById('build-radar').addEventListener('click', buildExamRadar);
  document.getElementById('check-note').addEventListener('click', checkNote);
  document.getElementById('save-note').addEventListener('click', saveNote);
  document.getElementById('copy-prompt').addEventListener('click', copyPrompt);
  document.getElementById('download-md').addEventListener('click', () => download('md'));
  document.getElementById('download-txt').addEventListener('click', () => download('txt'));
  document.getElementById('download-html').addEventListener('click', () => download('html'));
  document.getElementById('download-docx').addEventListener('click', downloadDocx);
  document.getElementById('print-pdf').addEventListener('click', printPdf);
  privacyCheck.addEventListener('change', () => {
    persistDraft();
    updateScore();
  });

  Object.values(fields).forEach(field => {
    field.addEventListener('input', () => {
      persistDraft();
      updatePrompt();
      updateScore();
    });
  });
}

function buildContextSuggestions() {
  const text = fields.transcript.value.trim();
  if (!text) {
    contextResults.innerHTML = '<p class="note-small">Geen transcriptie om te corrigeren.</p>';
    return;
  }
  contextSuggestions = [...contextConfusions, ...themeBasedSuggestions()]
    .map(([from, to]) => ({ from, to, count: countOccurrences(text, from) }))
    .filter(item => item.count > 0 && normalize(item.from) !== normalize(item.to));

  if (!contextSuggestions.length) {
    contextResults.innerHTML = `
      <article class="note-ok">
        <strong>Geen duidelijke vakterm-missers gevonden</strong>
        <p>Mooi. Lees alsnog even op termen als TOS, ICF, VOD, OMFT en morfosyntaxis.</p>
      </article>
    `;
    return;
  }

  contextResults.innerHTML = contextSuggestions.map((item, index) => `
    <article class="note-context-item">
      <label>
        <input type="checkbox" data-context="${index}" checked />
        <span><strong>${escapeHtml(item.from)}</strong> → <strong>${escapeHtml(item.to)}</strong></span>
      </label>
      <small>${item.count}x gevonden</small>
    </article>
  `).join('');
}

function applyContextSuggestions() {
  if (!contextSuggestions.length) {
    buildContextSuggestions();
    return;
  }
  const selected = Array.from(document.querySelectorAll('[data-context]:checked')).map(input => contextSuggestions[Number(input.dataset.context)]);
  fields.transcript.value = selected.reduce((text, item) => replacePhrase(text, item.from, item.to), fields.transcript.value);
  contextResults.innerHTML = `<p class="note-small">${selected.length} correctie(s) toegepast. Lees de zinnen nog even hardop na.</p>`;
  contextSuggestions = [];
  persistDraft();
  updatePrompt();
  updateScore();
}

function themeBasedSuggestions() {
  const theme = normalize(`${fields.theme.value} ${fields.goal.value}`);
  const suggestions = [];
  contextTerms.forEach(([from, to]) => {
    if (theme.includes(normalize(to)) || theme.includes(normalize(from))) suggestions.push([from, to]);
  });
  return suggestions;
}

async function toggleAudioBackup() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    audioButton.textContent = 'Start audio-backup';
    audioStatus.textContent = 'Audio-backup wordt klaargezet.';
    return;
  }
  if (!privacyCheck.checked) {
    audioStatus.textContent = 'Vink eerst aan dat je actief op AVG en lesrelevantie let.';
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    audioStatus.textContent = 'Audio-backup wordt niet ondersteund in deze browser.';
    return;
  }
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks = [];
    mediaRecorder = new MediaRecorder(audioStream);
    mediaRecorder.ondataavailable = event => {
      if (event.data.size) audioChunks.push(event.data);
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
      const url = URL.createObjectURL(blob);
      audioDownload.href = url;
      audioDownload.download = `${slugify(fields.title.value || 'lesnotitie-alpha')}-audio.webm`;
      audioDownload.hidden = false;
      audioStatus.textContent = 'Audio-backup klaar. Download hem en bewaar hem bewust/privacyveilig.';
      audioStream?.getTracks().forEach(track => track.stop());
      audioStream = null;
    };
    mediaRecorder.start(30000);
    audioDownload.hidden = true;
    audioButton.textContent = 'Stop audio-backup';
    audioStatus.textContent = 'Audio-backup loopt lokaal. Er wordt niets geupload.';
  } catch {
    audioStatus.textContent = 'Audio-backup kon niet starten. Controleer microfoontoegang.';
  }
}

function toggleRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    recordStatus.textContent = 'Spraakherkenning werkt niet in deze browser. Typ of plak de transcriptie.';
    return;
  }
  if (!privacyCheck.checked) {
    recordStatus.textContent = 'Vink eerst aan dat je actief op AVG en lesrelevantie let.';
    return;
  }
  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'nl-NL';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = event => {
      let interim = '';
      for (let index = event.resultIndex; index < event.results.length; index++) {
        const result = event.results[index];
        const transcript = result[0].transcript.trim();
        if (!transcript) continue;
        if (result.isFinal) sessionFinal = joinText(sessionFinal, punctuate(transcript));
        else interim = joinText(interim, transcript);
      }
      sessionInterim = interim;
      renderTranscript();
      persistDraft();
      updatePrompt();
      updateScore();
    };
    recognition.onerror = event => {
      commitSession();
      recording = false;
      stopCheckpointTimer();
      recordButton.textContent = 'Start opname';
      recordStatus.textContent = recognitionErrorMessage(event.error);
    };
    recognition.onend = () => {
      if (!recording) return;
      commitSession();
      try {
        recognition.start();
        recordStatus.textContent = `Opname loopt verder na automatische herstart. ${recordingStatusText()}`;
      } catch {
        recording = false;
        stopCheckpointTimer();
        recordButton.textContent = 'Start opname';
        recordStatus.textContent = 'Opname gestopt. Start opnieuw als je verder wilt.';
      }
    };
  }

  if (recording) {
    recording = false;
    commitSession();
    stopCheckpointTimer();
    recognition.stop();
    recordButton.textContent = 'Start opname';
    recordStatus.textContent = `Opname gestopt. ${wordCount(fields.transcript.value)} woorden vastgelegd. Scan nu op ruis/AVG.`;
    return;
  }

  recording = true;
  recordingBase = fields.transcript.value.trim();
  sessionFinal = '';
  sessionInterim = '';
  recordingStartedAt = Date.now();
  recordButton.textContent = 'Stop opname';
  startCheckpointTimer();
  recordStatus.textContent = `Opname loopt. ${recordingStatusText()} Blijf eindredacteur: klasgenoten horen niet automatisch in je notitie.`;
  try {
    recognition.start();
  } catch {
    recording = false;
    stopCheckpointTimer();
    recordButton.textContent = 'Start opname';
    recordStatus.textContent = 'De opname kon niet starten. Klik nog één keer of typ/plak de tekst.';
  }
}

function checkpointTranscript() {
  commitSession();
  persistDraft();
  updatePrompt();
  updateScore();
  recordStatus.textContent = recording
    ? `Checkpoint bewaard. ${recordingStatusText()}`
    : `Checkpoint bewaard. ${wordCount(fields.transcript.value)} woorden in je transcript.`;
}

function renderTranscript() {
  fields.transcript.value = joinText(recordingBase, sessionFinal, sessionInterim);
}

function commitSession() {
  renderTranscript();
  recordingBase = joinText(recordingBase, sessionFinal, sessionInterim);
  sessionFinal = '';
  sessionInterim = '';
  fields.transcript.value = recordingBase;
}

function startCheckpointTimer() {
  stopCheckpointTimer();
  checkpointTimer = window.setInterval(() => {
    checkpointTranscript();
  }, 30000);
}

function stopCheckpointTimer() {
  if (!checkpointTimer) return;
  window.clearInterval(checkpointTimer);
  checkpointTimer = null;
}

function recordingStatusText() {
  const seconds = Math.max(0, Math.floor((Date.now() - recordingStartedAt) / 1000));
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${rest} · ${wordCount(fields.transcript.value)} woorden · neem bij voorkeur in blokken.`;
}

function joinText(...parts) {
  return parts
    .map(part => String(part || '').trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function punctuate(text) {
  const clean = text.trim();
  if (!clean) return '';
  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
}

function scanTranscript() {
  const sentences = splitSentences(fields.transcript.value);
  if (!sentences.length) {
    privacyResults.innerHTML = '<p class="note-small">Geen transcriptie om te scannen.</p>';
    return;
  }
  flaggedSentences = sentences
    .map((sentence, index) => ({ sentence, index, reasons: reasonsFor(sentence) }))
    .filter(item => item.reasons.length);

  if (!flaggedSentences.length) {
    privacyResults.innerHTML = `
      <article class="note-ok">
        <strong>Geen duidelijke ruis gevonden</strong>
        <p>Blijf alsnog kritisch lezen. De scan is handig, geen geweten met wifi.</p>
      </article>
    `;
    return;
  }

  privacyResults.innerHTML = flaggedSentences.map(item => `
    <article class="note-flag" data-flag="${item.index}">
      <div>
        <strong>${escapeHtml(item.reasons.join(' · '))}</strong>
        <p>${escapeHtml(item.sentence)}</p>
      </div>
      <label>
        <input type="checkbox" data-keep="${item.index}" />
        <span>Toch behouden</span>
      </label>
    </article>
  `).join('');
}

function reasonsFor(sentence) {
  const clean = normalize(sentence);
  const reasons = [];
  if (suspectWords.some(word => clean.includes(normalize(word)))) reasons.push('mogelijk AVG/persoonlijk');
  if (!lessonWords.some(word => clean.includes(normalize(word))) && sentence.split(/\s+/).length > 8) reasons.push('lijkt niet duidelijk lesstof');
  if (/\b(06[-\s]?\d{8}|\S+@\S+\.\S+|\d{4}\s?[A-Z]{2})\b/i.test(sentence)) reasons.push('herleidbare gegevens');
  return reasons;
}

function applyCleanVersion() {
  const sentences = splitSentences(fields.transcript.value);
  if (!sentences.length) return;
  const keep = new Set(Array.from(document.querySelectorAll('[data-keep]:checked')).map(input => Number(input.dataset.keep)));
  const remove = new Set(flaggedSentences.filter(item => !keep.has(item.index)).map(item => item.index));
  fields.transcript.value = sentences.filter((_, index) => !remove.has(index)).join(' ');
  privacyResults.innerHTML = `<p class="note-small">${remove.size} zin(nen) verwijderd. Lees nog één keer na voordat je exporteert.</p>`;
  flaggedSentences = [];
  persistDraft();
  updatePrompt();
  updateScore();
}

function checkNote() {
  const data = collectData();
  const good = [];
  const missing = [];
  const warnings = [];

  if (data.title && data.theme) good.push('leskader staat');
  else missing.push('les/week en hoofdthema');
  if (data.goal) good.push('toetsdoel benoemd');
  else missing.push('toetsdoel: wat moet je hiermee kunnen?');
  if (wordCount(data.transcript) >= 80) good.push('voldoende ruwe lesinput');
  else warnings.push('transcript is kort; prima bij korte les, riskant bij hoofdcollege');
  if (lineCount(data.concepts) >= 3) good.push('kernbegrippen vastgelegd');
  else missing.push('minimaal 3 kernbegrippen met betekenis');
  if (data.anchors) good.push('toetsankers genoteerd');
  else missing.push('toetsankers: mogelijke docentvragen of rubricpunten');
  if (data.application) good.push('toepassing/casus aanwezig');
  else missing.push('toepassing aan kind, cliënt, onderzoek, behandeling of klascontext');
  if (privacyCheck.checked) good.push('AVG-check bewust aangevinkt');
  else missing.push('AVG-check aanvinken en transcript kritisch nalopen');

  const score = scoreNote(data);
  const oral = radarItems(oralSignals, data);
  const written = radarItems(writtenSignals, data);
  coachFeedback.innerHTML = `
    <div class="note-feedback-head">
      <h3>${score >= 85 ? 'Toetsklaar' : score >= 65 ? 'Bijna bruikbaar' : 'Nog te veel transcript'}</h3>
      <strong>${score}%</strong>
    </div>
    ${scanHtml('Groen', good, 'Nog niets stevig genoeg.')}
    ${scanHtml('Rood', missing, 'Geen groot gat.')}
    ${scanHtml('Let op', warnings, 'Geen extra waarschuwing.')}
    <article>
      <h4>Beste leerroute</h4>
      <p>${escapeHtml(learningRouteAdvice(oral, written))}</p>
    </article>
    <article>
      <h4>Volgende actie</h4>
      <p>${escapeHtml(nextAction(missing, warnings))}</p>
    </article>
  `;
  updateScore();
}

function buildExamRadar() {
  const data = collectData();
  const oral = radarItems(oralSignals, data);
  const written = radarItems(writtenSignals, data);
  renderRadarList(oralRadar, oral);
  renderRadarList(writtenRadar, written);
  oralDrill.textContent = oral.length
    ? `Mondelinge drill: leg "${oral[0].title}" in 45 seconden uit met casusbewijs en vervolgstap.`
    : 'Mondelinge drill: kies één kernbegrip en zeg hardop: begrip, casus, consequentie.';
  writtenDrill.textContent = written.length
    ? `Schriftelijke drill: schrijf over "${written[0].title}" vier zinnen: definitie, casusbewijs, verklaring, advies.`
    : 'Schriftelijke drill: maak één puntscorende alinea met definitie, casusbewijs, verklaring en advies.';
  coachFeedback.innerHTML = `
    <article>
      <h4>Toetsradar klaar</h4>
      <p>${escapeHtml(learningRouteAdvice(oral, written))}</p>
    </article>
  `;
}

function radarItems(signalSet, data) {
  const haystack = normalize([
    data.title,
    data.theme,
    data.goal,
    data.transcript,
    data.concepts,
    data.anchors,
    data.application,
    data.questions
  ].join(' '));
  return signalSet
    .map(([title, words, action]) => ({
      title,
      action,
      score: words.filter(word => haystack.includes(normalize(word))).length
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

function renderRadarList(target, items) {
  target.innerHTML = (items.length ? items : [{ title: 'Nog geen sterk signaal', action: 'Vul eerst transcript, toetsdoel en toetsankers aan.' }])
    .map(item => `<li><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.action)}</span></li>`)
    .join('');
}

function learningRouteAdvice(oral, written) {
  const firstOral = oral[0]?.title || 'één kernbegrip';
  const firstWritten = written[0]?.title || 'één casusgegeven';
  return `Gebruik actief ophalen: probeer eerst zonder modelantwoord ${firstOral} hardop te verantwoorden. Schrijf daarna over ${firstWritten} een korte puntscorende alinea. Morgen opnieuw, maar met een andere invalshoek.`;
}

function nextAction(missing, warnings) {
  if (missing.length) return `Werk eerst dit bij: ${missing[0]}. Daarna pas exporteren.`;
  if (warnings.length) return warnings[0];
  return 'Maak nu één oefenvraag van je toetsanker. Kennis zonder toepassing blijft plakken als nat papier.';
}

function saveNote() {
  const notes = readJson(notesKey, []);
  const data = collectData();
  notes.unshift({ ...data, savedAt: new Date().toISOString(), score: scoreNote(data) });
  localStorage.setItem(notesKey, JSON.stringify(notes.slice(0, 20)));
  coachFeedback.innerHTML = `<article><h4>Bewaard</h4><p>Notitie lokaal bewaard. Laatste score: ${scoreNote(data)}%.</p></article>`;
  updateScore();
}

function updatePrompt() {
  const data = collectData();
  aiPrompt.value = `Je bent een strenge maar behulpzame leercoach voor een logopediestudent.

Maak van onderstaande lesnotitie een korte, toetsgerichte samenvatting. Gebruik geen lange algemene samenvatting zonder toepassing.

Lever op:
1. Kern in 5 bullets.
2. Begrippenlijst met vakterm + uitleg in gewone taal tussen haakjes.
3. Apart blok: belangrijk voor de mondelinge toets, met 2 spreekdrills.
4. Apart blok: belangrijk voor de schriftelijke toets, met puntscorende antwoordstructuur.
5. Begrippen die ik moet kunnen toepassen op een casus.
6. Rode vlaggen: wat mag ik niet vergeten?
7. Mini-drill: 3 vragen om dit morgen actief terug te halen.

Let op privacy: negeer persoonlijke of herleidbare informatie die niet nodig is voor de lesstof.

LESKADER
Les/week: ${data.title || '-'}
Datum: ${data.date || '-'}
Hoofdthema: ${data.theme || '-'}
Toetsdoel: ${data.goal || '-'}

KERNBEGRIPPEN
${data.concepts || '-'}

TOETSANKERS
${data.anchors || '-'}

CASUS/TOEPASSING
${data.application || '-'}

OPEN VRAGEN
${data.questions || '-'}

SCHONE TRANSCRIPTIE
${data.transcript || '-'}`;
}

async function copyPrompt() {
  updatePrompt();
  try {
    await navigator.clipboard.writeText(aiPrompt.value);
    copyStatus.textContent = 'Prompt gekopieerd.';
  } catch {
    aiPrompt.select();
    copyStatus.textContent = 'Kopiëren lukte niet automatisch. Selecteer de tekst handmatig.';
  }
}

function download(type) {
  const data = collectData();
  const baseName = slugify(data.title || 'lesnotitie-alpha');
  if (type === 'md') downloadBlob(`${baseName}.md`, markdown(data), 'text/markdown;charset=utf-8');
  if (type === 'txt') downloadBlob(`${baseName}.txt`, plainText(data), 'text/plain;charset=utf-8');
  if (type === 'html') downloadBlob(`${baseName}.html`, htmlDocument(data), 'text/html;charset=utf-8');
}

function downloadDocx() {
  const data = collectData();
  const baseName = slugify(data.title || 'lesnotitie-alpha');
  const zip = buildDocxZip(data);
  downloadBlob(`${baseName}.docx`, zip, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
}

function printPdf() {
  const win = window.open('', '_blank');
  if (!win) {
    copyStatus.textContent = 'Pop-up geblokkeerd. Gebruik HTML-export of sta pop-ups toe.';
    return;
  }
  win.document.write(htmlDocument(collectData(), true));
  win.document.close();
  win.focus();
  win.print();
}

function collectData() {
  return {
    title: fields.title.value.trim(),
    date: fields.date.value,
    theme: fields.theme.value.trim(),
    goal: fields.goal.value.trim(),
    transcript: fields.transcript.value.trim(),
    concepts: fields.concepts.value.trim(),
    anchors: fields.anchors.value.trim(),
    application: fields.application.value.trim(),
    questions: fields.questions.value.trim(),
    privacy: privacyCheck.checked
  };
}

function hydrateDraft() {
  const draft = readJson('lesnotitie_alpha_draft', null);
  if (!draft) return;
  fields.title.value = draft.title || '';
  fields.date.value = draft.date || localDateKey(new Date());
  fields.theme.value = draft.theme || '';
  fields.goal.value = draft.goal || '';
  fields.transcript.value = draft.transcript || '';
  fields.concepts.value = draft.concepts || '';
  fields.anchors.value = draft.anchors || '';
  fields.application.value = draft.application || '';
  fields.questions.value = draft.questions || '';
  privacyCheck.checked = Boolean(draft.privacy);
}

function persistDraft() {
  localStorage.setItem('lesnotitie_alpha_draft', JSON.stringify(collectData()));
}

function updateScore() {
  const score = scoreNote(collectData());
  noteScore.textContent = `${score}%`;
  noteHint.textContent = score >= 85
    ? 'Klaar om te exporteren.'
    : score >= 60
      ? 'Voeg casus/toetsanker toe.'
      : 'Maak eerst leskader en transcript.';
}

function scoreNote(data) {
  let score = 0;
  if (data.title) score += 10;
  if (data.theme) score += 10;
  if (data.goal) score += 15;
  if (wordCount(data.transcript) >= 80) score += 20;
  else if (wordCount(data.transcript) >= 30) score += 10;
  if (lineCount(data.concepts) >= 3) score += 15;
  if (data.anchors) score += 15;
  if (data.application) score += 10;
  if (data.privacy) score += 5;
  return Math.min(100, score);
}

function markdown(data) {
  return `# ${data.title || 'Lesnotitie Alpha'}

Datum: ${data.date || '-'}
Hoofdthema: ${data.theme || '-'}
Toetsdoel: ${data.goal || '-'}

## Kernbegrippen
${data.concepts || '-'}

## Toetsankers
${data.anchors || '-'}

## Casus of toepassing
${data.application || '-'}

## Vragen
${data.questions || '-'}

## Transcriptie
${data.transcript || '-'}`;
}

function plainText(data) {
  return markdown(data).replace(/^#/gm, '').replace(/\n{3,}/g, '\n\n').trim();
}

function htmlDocument(data, print = false) {
  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(data.title || 'Lesnotitie Alpha')}</title>
  <style>
    body{font-family:Arial,sans-serif;line-height:1.55;max-width:820px;margin:40px auto;padding:0 20px;color:#1f2a24}
    h1,h2{line-height:1.15} h2{margin-top:28px;border-top:1px solid #ddd;padding-top:18px}
    pre{white-space:pre-wrap;font-family:inherit;background:#f7f7f2;padding:14px;border:1px solid #ddd}
    ${print ? '@page{margin:18mm}' : ''}
  </style>
</head>
<body>
  <h1>${escapeHtml(data.title || 'Lesnotitie Alpha')}</h1>
  <p><strong>Datum:</strong> ${escapeHtml(data.date || '-')}<br>
  <strong>Hoofdthema:</strong> ${escapeHtml(data.theme || '-')}<br>
  <strong>Toetsdoel:</strong> ${escapeHtml(data.goal || '-')}</p>
  ${htmlSection('Kernbegrippen', data.concepts)}
  ${htmlSection('Toetsankers', data.anchors)}
  ${htmlSection('Casus of toepassing', data.application)}
  ${htmlSection('Vragen', data.questions)}
  ${htmlSection('Transcriptie', data.transcript)}
</body>
</html>`;
}

function htmlSection(title, body) {
  return `<h2>${escapeHtml(title)}</h2><pre>${escapeHtml(body || '-')}</pre>`;
}

function buildDocxZip(data) {
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${docParagraph(data.title || 'Lesnotitie Alpha', true)}
    ${docParagraph(`Datum: ${data.date || '-'}`)}
    ${docParagraph(`Hoofdthema: ${data.theme || '-'}`)}
    ${docParagraph(`Toetsdoel: ${data.goal || '-'}`)}
    ${docHeading('Kernbegrippen')}${docMultiline(data.concepts)}
    ${docHeading('Toetsankers')}${docMultiline(data.anchors)}
    ${docHeading('Casus of toepassing')}${docMultiline(data.application)}
    ${docHeading('Vragen')}${docMultiline(data.questions)}
    ${docHeading('Transcriptie')}${docMultiline(data.transcript)}
    <w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr>
  </w:body>
</w:document>`;
  const files = {
    '[Content_Types].xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`,
    '_rels/.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
    'word/document.xml': documentXml
  };
  return createZip(files);
}

function docHeading(text) {
  return docParagraph(text, true);
}

function docMultiline(text) {
  return splitLines(text || '-').map(line => docParagraph(line)).join('');
}

function docParagraph(text, bold = false) {
  const run = bold ? `<w:rPr><w:b/></w:rPr><w:t>${escapeXml(text)}</w:t>` : `<w:t>${escapeXml(text)}</w:t>`;
  return `<w:p><w:r>${run}</w:r></w:p>`;
}

function createZip(files) {
  const encoder = new TextEncoder();
  const chunks = [];
  const central = [];
  let offset = 0;
  Object.entries(files).forEach(([name, content]) => {
    const nameBytes = encoder.encode(name);
    const data = encoder.encode(content);
    const crc = crc32(data);
    const local = zipHeader(0x04034b50, 20, 20, 0, 0, crc, data.length, data.length, nameBytes.length, 0);
    chunks.push(local, nameBytes, data);
    central.push(zipHeader(0x02014b50, 20, 20, 0, 0, crc, data.length, data.length, nameBytes.length, 0, 0, 0, 0, 0, offset), nameBytes);
    offset += local.length + nameBytes.length + data.length;
  });
  const centralSize = central.reduce((sum, item) => sum + item.length, 0);
  const end = zipEnd(Object.keys(files).length, centralSize, offset);
  return new Blob([...chunks, ...central, end], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}

function zipHeader(signature, versionMade, versionNeeded, flags, method, crc, compressed, size, nameLength, extraLength, commentLength = 0, disk = 0, attrs = 0, external = 0, relativeOffset = 0) {
  const isCentral = signature === 0x02014b50;
  const buffer = new ArrayBuffer(isCentral ? 46 : 30);
  const view = new DataView(buffer);
  let p = 0;
  view.setUint32(p, signature, true); p += 4;
  if (isCentral) { view.setUint16(p, versionMade, true); p += 2; }
  view.setUint16(p, versionNeeded, true); p += 2;
  view.setUint16(p, flags, true); p += 2;
  view.setUint16(p, method, true); p += 2;
  view.setUint16(p, 0, true); p += 2;
  view.setUint16(p, 0, true); p += 2;
  view.setUint32(p, crc, true); p += 4;
  view.setUint32(p, compressed, true); p += 4;
  view.setUint32(p, size, true); p += 4;
  view.setUint16(p, nameLength, true); p += 2;
  view.setUint16(p, extraLength, true); p += 2;
  if (isCentral) {
    view.setUint16(p, commentLength, true); p += 2;
    view.setUint16(p, disk, true); p += 2;
    view.setUint16(p, attrs, true); p += 2;
    view.setUint32(p, external, true); p += 4;
    view.setUint32(p, relativeOffset, true);
  }
  return new Uint8Array(buffer);
}

function zipEnd(count, size, offset) {
  const buffer = new ArrayBuffer(22);
  const view = new DataView(buffer);
  view.setUint32(0, 0x06054b50, true);
  view.setUint16(8, count, true);
  view.setUint16(10, count, true);
  view.setUint32(12, size, true);
  view.setUint32(16, offset, true);
  return new Uint8Array(buffer);
}

function crc32(data) {
  let crc = -1;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ -1) >>> 0;
}

function downloadBlob(filename, content, type) {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function scanHtml(label, items, empty) {
  return `<article><h4>${label}</h4><ul>${(items.length ? items : [empty]).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>`;
}

function splitSentences(text) {
  return text.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/).map(item => item.trim()).filter(Boolean);
}

function splitLines(text) {
  return String(text || '').split(/\n+/).map(line => line.trim()).filter(Boolean);
}

function countOccurrences(text, phrase) {
  const matches = text.match(phraseRegex(phrase));
  return matches ? matches.length : 0;
}

function replacePhrase(text, from, to) {
  return text.replace(phraseRegex(from), match => preserveCase(match, to));
}

function phraseRegex(phrase) {
  const escaped = String(phrase)
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\s+/g, '\\s+');
  return new RegExp(`\\b${escaped}\\b`, 'gi');
}

function preserveCase(original, replacement) {
  if (original.toUpperCase() === original) return replacement.toUpperCase();
  if (original[0] && original[0].toUpperCase() === original[0]) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function lineCount(text) {
  return splitLines(text).length || (text.trim() ? 1 : 0);
}

function wordCount(text) {
  return String(text || '').split(/\s+/).filter(Boolean).length;
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function slugify(value) {
  return normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'lesnotitie-alpha';
}

function normalize(value) {
  return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function recognitionErrorMessage(error) {
  const messages = {
    'not-allowed': 'Microfoon niet toegestaan. Geef microfoontoegang of typ/plak de tekst.',
    'audio-capture': 'Geen microfoon gevonden. Controleer je microfoon.',
    network: 'Spraakherkenning heeft geen verbinding. Typ of plak de transcriptie.',
    'no-speech': 'Ik hoorde geen spraak. Probeer opnieuw of typ mee.',
    aborted: 'Opname gestopt.'
  };
  return messages[error] || 'Opname werkt hier niet goed. Typ of plak de transcriptie.';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeXml(value) {
  return escapeHtml(value);
}
