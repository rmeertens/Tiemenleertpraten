'use strict';

const storageKey = 'stotter_alfa_logs';
const dailyKey = `stotter_alfa_daily_${localDateKey(new Date())}`;

const dailySteps = [
  ['Vrij schrijven', '2 minuten zonder rem. Schrijf wat je denkt voordat je het netjes maakt. Netjes is later, misschien nooit.'],
  ['Lichaam lezen', 'Noem hardop waar spanning zit: keel, kaak, borst, buik, ogen, schouders. Alleen waarnemen. Geen rechtszaak.'],
  ['Beeld voor woord', 'Vertel 60 seconden over een beeld in je hoofd. Kijk naar betekenis, niet naar losse klanken.'],
  ['Mini-exposure', 'Zeg één kleine boodschap tegen iemand of in opname. Doel: communiceren, niet bewijzen dat je vloeiend bent.'],
  ['Reflectie', 'Noteer: waar liet ik controle los, waar nam de controleur het stuur terug?']
];

const hexagon = [
  ['Perceptie', ['taak', 'optreden', 'moeilijk', 'moet', 'gevaar', 'beoordeling'], 'Hoe zie je spreken op dit moment: contact of prestatie?'],
  ['Overtuiging', ['ik moet', 'altijd', 'nooit', 'eerst adem', 'perfect', 'mag niet', 'gaat mis'], 'Welke regel maakt je systeem kleiner dan nodig?'],
  ['Gedrag', ['duw', 'pers', 'adem pakken', 'vermijd', 'stop', 'forceer', 'controleer'], 'Wat doe je fysiek of strategisch om spraak te controleren?'],
  ['Emotie', ['angst', 'schaam', 'boos', 'frustr', 'paniek', 'onzeker', 'hulpeloos'], 'Welke emotie probeert de microfoon te pakken? Brutaal ding.'],
  ['Lichaam', ['keel', 'kaak', 'borst', 'hart', 'rood', 'spanning', 'buik', 'schouder'], 'Waar reageert je lichaam alsof er een tijger staat, terwijl het meestal een zin is?'],
  ['Intentie', ['vloeiend', 'niet stotteren', 'zeggen', 'delen', 'contact', 'uitleggen', 'vragen'], 'Wil je vloeiend lijken, of wil je iets overbrengen? Dat verschil is groot.']
];

const drills = [
  {
    title: 'Beeld eerst',
    prompt: 'Kies een voorwerp in de kamer. Kijk er 10 seconden naar. Vertel daarna wat je ziet, zonder vooraf zinnen te maken.',
    target: ['beeld', 'zien', 'betekenis', 'vertel', 'voorwerp'],
    next: 'Maak het kleiner: één beeld, één gedachte, één zin. De rest hoeft niet mee in de bus.'
  },
  {
    title: 'Rivierzin',
    prompt: 'Begin met: “Wat ik eigenlijk wil zeggen is...” en praat 45 seconden door. Als er een hapering komt: blijf bij de boodschap.',
    target: ['wil zeggen', 'boodschap', 'doorgaan', 'betekenis', 'contact'],
    next: 'Herhaal met iemand in gedachten aan wie je dit echt zou willen vertellen.'
  },
  {
    title: 'Controleur parkeren',
    prompt: 'Zeg drie korte zinnen. Na elke zin benoem je: “controle hoog/middel/laag”. Niet oplossen, alleen registreren.',
    target: ['controle', 'registreren', 'hoog', 'laag', 'waarnemen'],
    next: 'Kies daarna één zin en zeg hem opnieuw met 10% minder haast.'
  },
  {
    title: 'Stem aan, woorden volgen',
    prompt: 'Maak eerst een zachte doorlopende stemklank op “mmm” of “aaa”. Laat daaruit vanzelf een korte zin ontstaan.',
    target: ['stem', 'doorlopend', 'zacht', 'vanzelf', 'zin'],
    next: 'Let op: niet duwen. Je nodigt stem uit; je trekt hem niet aan zijn jas.'
  },
  {
    title: 'Getuige, geen rechter',
    prompt: 'Vertel over een moeilijk spreekmoment alsof je een sportverslaggever bent: feitelijk, rustig, zonder jezelf af te branden.',
    target: ['feit', 'waarnemen', 'rustig', 'zonder oordeel', 'moment'],
    next: 'Sluit af met één zin: “De volgende keer oefen ik met...”'
  }
];

const coachInput = document.getElementById('coach-input');
const coachAnswer = document.getElementById('coach-answer');
const hexInput = document.getElementById('hex-input');
const hexFeedback = document.getElementById('hex-feedback');
const hexNote = document.getElementById('hex-note');
const drillPrompt = document.getElementById('drill-prompt');
const drillInput = document.getElementById('drill-input');
const drillFeedback = document.getElementById('drill-feedback');
const drillNote = document.getElementById('drill-note');
const freewriteInput = document.getElementById('freewrite-input');
const freewriteFeedback = document.getElementById('freewrite-feedback');
const reportOutput = document.getElementById('report-output');

let currentDrill = drills[0];
let questionRecognition = null;
let hexRecognition = null;
let drillRecognition = null;
let questionRecording = false;
let hexRecording = false;
let drillRecording = false;

boot();

function boot() {
  renderDaily();
  renderDrill();
  bindEvents();
}

function bindEvents() {
  document.getElementById('ask-coach').addEventListener('click', answerCoach);
  document.getElementById('record-question').addEventListener('click', () => toggleRecording('question'));
  document.getElementById('scan-hex').addEventListener('click', scanHexagon);
  document.getElementById('record-hex').addEventListener('click', () => toggleRecording('hex'));
  document.getElementById('save-hex').addEventListener('click', () => saveLog('moment', hexInput.value));
  document.getElementById('new-drill').addEventListener('click', nextDrill);
  document.getElementById('check-drill').addEventListener('click', checkDrill);
  document.getElementById('record-drill').addEventListener('click', () => toggleRecording('drill'));
  document.getElementById('save-freewrite').addEventListener('click', saveFreewrite);
  document.getElementById('clear-freewrite').addEventListener('click', () => {
    freewriteInput.value = '';
    freewriteFeedback.innerHTML = '';
  });
  document.getElementById('build-report').addEventListener('click', buildReport);
  document.getElementById('clear-logs').addEventListener('click', clearLogs);
  coachInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') answerCoach();
  });
}

function renderDaily() {
  const done = readJson(dailyKey, {});
  const complete = dailySteps.filter((_, index) => done[index]).length;
  document.getElementById('alfa-ready').textContent = `${complete}/5`;
  document.getElementById('alfa-hint').textContent = complete >= 5
    ? 'Dagroute rond. Morgen weer klein beginnen.'
    : `${5 - complete} stappen open. Rustig. Niet heroisch doen.`;

  document.getElementById('daily-route').innerHTML = dailySteps.map(([title, body], index) => `
    <label class="stutter-step ${done[index] ? 'is-done' : ''}">
      <input type="checkbox" data-step="${index}" ${done[index] ? 'checked' : ''} />
      <span>
        <strong>${escapeHtml(title)}</strong>
        <small>${escapeHtml(body)}</small>
      </span>
    </label>
  `).join('');

  document.querySelectorAll('[data-step]').forEach(input => {
    input.addEventListener('change', () => {
      done[input.dataset.step] = input.checked;
      localStorage.setItem(dailyKey, JSON.stringify(done));
      renderDaily();
    });
  });
}

function answerCoach() {
  const question = coachInput.value.trim();
  if (!question) {
    coachAnswer.innerHTML = '<p>Stel eerst een vraag. Stotter Alfa is goed, maar helderziendheid stond niet in het pakket.</p>';
    return;
  }

  const clean = normalize(question);
  let title = 'Coachantwoord';
  let body = 'Begin bij de boodschap. Spraak loopt meestal beter als je aandacht naar betekenis gaat in plaats van naar losse woorden.';
  let action = 'Actie: zeg één zin opnieuw en richt je op wat je wilt overbrengen, niet op hoe elk woord klinkt.';

  if (matches(clean, ['blok', 'vast', 'keel', 'duw', 'pers'])) {
    title = 'Bij blokkeren';
    body = 'Een blokkade wordt vaak groter wanneer je hem met controle probeert weg te drukken. Merk de spanning op, laat de prestatie-eis zakken en keer terug naar de bedoeling van je zin.';
    action = 'Actie: fluister niet, forceer niet. Denk: “ik deel iets”, adem normaal, start met een zachte stemstroom.';
  } else if (matches(clean, ['angst', 'schaam', 'paniek', 'bang'])) {
    title = 'Bij spreekangst';
    body = 'Angst wil dat spreken een examen wordt. Jij maakt er weer contact van. Klein verschil, groot effect.';
    action = 'Actie: doe een mini-exposure van 20 seconden en beoordeel alleen: bleef ik bij mijn boodschap?';
  } else if (matches(clean, ['adem', 'lucht', 'inadem'])) {
    title = 'Adem niet als project';
    body = 'Extra adem pakken kan voelen als voorbereiding, maar wordt soms een startsein voor controle. Spraak mag op gewone adem beginnen.';
    action = 'Actie: zeg drie zinnen zonder speciale ademvoorbereiding. Gewoon beginnen. Heel revolutionair, blijkbaar.';
  } else if (matches(clean, ['oefen', 'training', 'huiswerk', 'snel'])) {
    title = 'Snel en intensief trainen';
    body = 'Train kort, vaak en echt. Liever vijf kleine spreekmomenten per dag dan één perfecte oefensessie waarin niemand je hoort.';
    action = 'Actie: dagroute afmaken en één log bewaren. Morgen hetzelfde, iets moeilijker.';
  } else if (matches(clean, ['rapport', 'voortgang', 'analyse'])) {
    title = 'Voortgang meten';
    body = 'Meet niet alleen vloeiendheid. Meet ook vermijding, herstel, intentie, lichaamsrust en of je sneller terugkeert naar communicatie.';
    action = 'Actie: bewaar drie logs en maak onderaan een rapport.';
  }

  coachAnswer.innerHTML = `
    <strong>${escapeHtml(title)}</strong>
    <p>${escapeHtml(body)}</p>
    <span>${escapeHtml(action)}</span>
  `;
}

function scanHexagon() {
  const text = hexInput.value.trim();
  if (!text) {
    hexNote.textContent = 'Beschrijf eerst één spreekmoment.';
    return;
  }
  const clean = normalize(text);
  const hits = hexagon.map(([name, words, prompt]) => ({
    name,
    prompt,
    hit: words.some(word => clean.includes(normalize(word)))
  }));
  const green = hits.filter(item => item.hit);
  const red = hits.filter(item => !item.hit);
  const dam = identifyDam(clean);

  hexFeedback.innerHTML = `
    ${scanHtml({
      good: green.map(item => item.name),
      missing: red.map(item => `${item.name}: ${item.prompt}`),
      vague: dam ? [`Mogelijke dam: ${dam}`] : ['Nog geen duidelijke dam. Schrijf concreter: gedachte, lichaam, gedrag, intentie.']
    })}
    ${panel('Kern', dam || 'Je beschrijving laat zien waar de controle ingrijpt. Nu wordt het trainbaar.')}
    ${panel('Volgende oefening', nextActionForHits(green, red))}
  `;
  hexNote.textContent = 'Scan klaar. Kies één rood punt, niet alle zes. We zijn therapeuten, geen circusact.';
}

function checkDrill() {
  const text = drillInput.value.trim();
  if (!text) {
    drillNote.textContent = 'Typ of spreek eerst kort hoe de oefening ging.';
    return;
  }
  const clean = normalize(text);
  const targetHits = currentDrill.target.filter(word => clean.includes(normalize(word)));
  const hasMeaning = matches(clean, ['boodschap', 'betekenis', 'beeld', 'contact', 'vertellen', 'delen']);
  const hasBody = matches(clean, ['keel', 'kaak', 'adem', 'buik', 'spanning', 'rust', 'lichaam']);
  const hasReflection = matches(clean, ['merkte', 'voelde', 'zag', 'volgende', 'opnieuw', 'minder controle']);
  const score = [targetHits.length > 0, hasMeaning, hasBody, hasReflection].filter(Boolean).length;
  const missing = [
    ...(targetHits.length ? [] : ['noem wat je concreet oefende']),
    ...(hasMeaning ? [] : ['koppel aan betekenis/contact']),
    ...(hasBody ? [] : ['noem één lichamelijk signaal']),
    ...(hasReflection ? [] : ['sluit af met wat je volgende keer doet'])
  ];

  drillFeedback.innerHTML = `
    <div class="stutter-feedback-head">
      <h3>${score >= 4 ? 'Alfa-waardig' : score >= 3 ? 'Bijna raak' : 'Nog te vaag'}</h3>
      <strong>${score}/4</strong>
    </div>
    ${scanHtml({
      good: [
        ...(targetHits.length ? [`oefenfocus: ${currentDrill.title}`] : []),
        ...(hasMeaning ? ['betekenis/contact genoemd'] : []),
        ...(hasBody ? ['lichaamssignaal benoemd'] : []),
        ...(hasReflection ? ['reflectie of vervolgstap'] : [])
      ],
      missing,
      vague: score >= 4 ? [] : ['Niet bewijzen dat het goed ging. Beschrijf wat je waarnam en wat je kiest.']
    })}
    ${panel('Coach', score >= 4 ? 'Goed. Herhaal dezelfde oefening nu met 10% meer echte communicatie.' : currentDrill.next)}
  `;
}

function saveFreewrite() {
  const text = freewriteInput.value.trim();
  if (!text) {
    freewriteFeedback.innerHTML = '<p class="stutter-note">Schrijf eerst iets. Desnoods rommel. Rommel is hier data.</p>';
    return;
  }
  saveLog('freewrite', text);
  const words = text.split(/\s+/).filter(Boolean).length;
  freewriteFeedback.innerHTML = `
    ${panel('Bewaard', `${words} woorden. Mooi. Niet teruglezen om jezelf te corrigeren; hooguit om één overtuiging te ontdekken.`)}
    ${panel('Volgende actie', 'Onderstreep mentaal één zin die begint met “ik moet”, “ik mag niet” of “als ik maar”. Dat is voer voor de zeshoekscan.')}
  `;
}

function buildReport() {
  const logs = readJson(storageKey, []);
  if (!logs.length) {
    reportOutput.innerHTML = '<p class="stutter-note">Nog geen logs. Bewaar eerst een spreekmoment of vrije schrijfoefening.</p>';
    return;
  }
  const all = normalize(logs.map(log => log.text).join(' '));
  const hitNames = hexagon
    .filter(([, words]) => words.some(word => all.includes(normalize(word))))
    .map(([name]) => name);
  const dam = identifyDam(all) || 'De belangrijkste dam is nog niet scherp genoeg. Verzamel concretere momenten.';
  const zones = logs.filter(log => matches(normalize(log.text), ['contact', 'boodschap', 'rust', 'vanzelf', 'beeld', 'delen'])).length;

  reportOutput.innerHTML = `
    <article>
      <h4>Zeshoek-status</h4>
      <p>Je logs raken vooral: ${escapeHtml(hitNames.join(', ') || 'nog geen duidelijke categorieen')}. Voeg komende week bewust de ontbrekende onderdelen toe.</p>
    </article>
    <article>
      <h4>Belangrijkste dam</h4>
      <p>${escapeHtml(dam)}</p>
    </article>
    <article>
      <h4>Momenten van stroom</h4>
      <p>${zones ? `${zones} log(s) bevatten signalen van contact, betekenis of minder controle.` : 'Nog weinig signalen van stroom. Dat is geen ramp; het betekent alleen dat de meetlat nu scherper is.'}</p>
    </article>
    <article>
      <h4>Volgende oefening</h4>
      <p>${escapeHtml(recommendExercise(all))}</p>
    </article>
  `;
}

function clearLogs() {
  localStorage.removeItem(storageKey);
  reportOutput.innerHTML = '<p class="stutter-note">Logs gewist.</p>';
}

function saveLog(type, text) {
  const value = text.trim();
  if (!value) return;
  const logs = readJson(storageKey, []);
  logs.unshift({ type, text: value, date: new Date().toISOString() });
  localStorage.setItem(storageKey, JSON.stringify(logs.slice(0, 40)));
  hexNote.textContent = type === 'moment' ? 'Moment bewaard.' : hexNote.textContent;
}

function nextDrill() {
  const index = drills.findIndex(drill => drill.title === currentDrill.title);
  currentDrill = drills[(index + 1) % drills.length];
  drillInput.value = '';
  drillFeedback.innerHTML = '';
  renderDrill();
}

function renderDrill() {
  drillPrompt.textContent = `${currentDrill.title}: ${currentDrill.prompt}`;
}

function identifyDam(clean) {
  if (matches(clean, ['ik moet', 'perfect', 'mag niet', 'niet stotteren'])) return 'de regel dat spreken pas goed is als het foutloos is';
  if (matches(clean, ['eerst adem', 'lucht pakken', 'diep adem'])) return 'de overtuiging dat spreken speciale ademvoorbereiding nodig heeft';
  if (matches(clean, ['duw', 'pers', 'forceer'])) return 'fysiek forceren waardoor de spreekstroom smaller wordt';
  if (matches(clean, ['vermijd', 'niet zeggen', 'ander woord'])) return 'vermijding die op korte termijn rust geeft en op lange termijn de angst voedt';
  if (matches(clean, ['beoordeling', 'kijken', 'luisteren', 'raar'])) return 'spreken als optreden in plaats van contact';
  return '';
}

function nextActionForHits(green, red) {
  if (red.some(item => item.name === 'Intentie')) return 'Zeg dezelfde boodschap opnieuw met als doel: iets delen. Niet: vloeiend klinken.';
  if (red.some(item => item.name === 'Lichaam')) return 'Doe 30 seconden lichaamsscan en zeg daarna pas de zin. Waarnemen eerst.';
  if (red.some(item => item.name === 'Overtuiging')) return 'Schrijf de blokkerende regel letterlijk op en vraag: is dit altijd waar? Spoiler: meestal niet.';
  if (green.length >= 5) return 'Sterk geanalyseerd. Kies nu een mini-exposure buiten de oefenkamer.';
  return 'Maak het moment concreter: wat dacht je, wat deed je lichaam, wat probeerde je te bereiken?';
}

function recommendExercise(clean) {
  if (matches(clean, ['adem', 'lucht'])) return 'Oefen “gewone start”: drie korte zinnen zonder speciale ademvoorbereiding.';
  if (matches(clean, ['woord', 'klank', 'letter'])) return 'Oefen “beeld eerst”: spreek vanuit voorstelling/betekenis in plaats van woordcontrole.';
  if (matches(clean, ['angst', 'schaam'])) return 'Oefen een mini-exposure: 20 seconden echte communicatie met lage inzet.';
  if (matches(clean, ['duw', 'keel', 'pers'])) return 'Oefen zachte doorlopende stemactivatie en laat de zin daaruit ontstaan.';
  return 'Oefen de rivierzin: “Wat ik eigenlijk wil zeggen is...” en blijf bij de boodschap.';
}

function panel(title, body) {
  return `<article><h4>${escapeHtml(title)}</h4><p>${escapeHtml(body)}</p></article>`;
}

function scanHtml({ good = [], missing = [], vague = [] }) {
  const group = (className, label, items, empty) => `
    <div class="coach-scan__group ${className}">
      <span>${label}</span>
      <ul>${(items.length ? items : [empty]).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </div>
  `;
  return `
    <article class="coach-scan">
      <strong>Alfa-scan</strong>
      <div class="coach-scan__grid">
        ${group('is-good', 'Groen · gezien', good, 'Nog niets scherp gezien.')}
        ${group('is-missing', 'Rood · onderzoek dit', missing, 'Geen groot rood punt.')}
        ${group('is-vague', 'Let op', vague, 'Geen extra waarschuwing.')}
      </div>
    </article>
  `;
}

function toggleRecording(type) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    const message = 'Spraakherkenning werkt niet in deze browser. Typ je tekst of gebruik Chrome/Edge.';
    if (type === 'question') coachAnswer.innerHTML = `<p>${message}</p>`;
    if (type === 'hex') hexNote.textContent = message;
    if (type === 'drill') drillNote.textContent = message;
    return;
  }

  const config = {
    question: {
      get recognition() { return questionRecognition; },
      set recognition(value) { questionRecognition = value; },
      get recording() { return questionRecording; },
      set recording(value) { questionRecording = value; },
      button: document.getElementById('record-question'),
      input: coachInput,
      note: coachAnswer,
      onEnd: answerCoach
    },
    hex: {
      get recognition() { return hexRecognition; },
      set recognition(value) { hexRecognition = value; },
      get recording() { return hexRecording; },
      set recording(value) { hexRecording = value; },
      button: document.getElementById('record-hex'),
      input: hexInput,
      note: hexNote,
      onEnd: scanHexagon
    },
    drill: {
      get recognition() { return drillRecognition; },
      set recognition(value) { drillRecognition = value; },
      get recording() { return drillRecording; },
      set recording(value) { drillRecording = value; },
      button: document.getElementById('record-drill'),
      input: drillInput,
      note: drillNote,
      onEnd: checkDrill
    }
  }[type];

  if (!config.recognition) {
    config.recognition = new SpeechRecognition();
    config.recognition.lang = 'nl-NL';
    config.recognition.interimResults = true;
    config.recognition.continuous = type !== 'question';
    config.recognition.onresult = event => {
      config.input.value = Array.from(event.results).map(result => result[0].transcript).join(' ');
    };
    config.recognition.onend = () => {
      config.recording = false;
      config.button.textContent = type === 'question' ? 'Spreek in' : 'Spreek in';
      if (config.input.value.trim()) config.onEnd();
    };
  }

  if (config.recording) {
    config.recognition.stop();
    return;
  }

  stopOtherRecordings(type);
  config.recording = true;
  config.button.textContent = 'Stop';
  if (type === 'question') config.note.innerHTML = '<p>Ik luister. Kort is krachtig, dramatisch mag thuis blijven.</p>';
  if (type === 'hex') config.note.textContent = 'Ik luister. Beschrijf één concreet moment.';
  if (type === 'drill') config.note.textContent = 'Ik luister. Vertel wat je deed en merkte.';
  config.recognition.start();
}

function stopOtherRecordings(activeType) {
  if (activeType !== 'question' && questionRecording && questionRecognition) questionRecognition.stop();
  if (activeType !== 'hex' && hexRecording && hexRecognition) hexRecognition.stop();
  if (activeType !== 'drill' && drillRecording && drillRecognition) drillRecognition.stop();
}

function matches(text, words) {
  return words.some(word => text.includes(normalize(word)));
}

function normalize(value) {
  return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function localDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
