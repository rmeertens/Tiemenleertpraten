'use strict';

const data = window.ACCENT_DATA;
const state = {
  criterion: data.criteria[0],
  rhythm: data.rhythms[0],
  simulation: data.simulations[0],
  scores: JSON.parse(localStorage.getItem('accent_scores') || '{}'),
};

const views = document.querySelectorAll('.accent-view');
const tabs = document.querySelectorAll('.accent-tab');
const criterionSelect = document.getElementById('criterion-select');
const rhythmSelect = document.getElementById('rhythm-select');
const simulationSelect = document.getElementById('simulation-select');
const simulationAnswer = document.getElementById('simulation-answer');
const simulationFeedback = document.getElementById('simulation-feedback');
const speechNote = document.getElementById('speech-note');
const accentCoachInput = document.getElementById('accent-coach-input');
const accentCoachAnswer = document.getElementById('accent-coach-answer');

let recognition = null;
let recording = false;
let coachRecognition = null;
let coachRecording = false;

boot();

function boot() {
  renderOptions();
  bindEvents();
  renderAll();
}

function bindEvents() {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => showView(tab.dataset.view));
  });

  criterionSelect.addEventListener('change', () => {
    state.criterion = data.criteria.find(item => item.id === criterionSelect.value);
    renderCriterion();
  });

  rhythmSelect.addEventListener('change', () => {
    state.rhythm = data.rhythms.find(item => item.id === rhythmSelect.value);
    renderRhythm();
  });

  simulationSelect.addEventListener('change', () => {
    state.simulation = data.simulations[Number(simulationSelect.value)] || data.simulations[0];
    renderSimulation();
  });

  document.getElementById('mark-criterion').addEventListener('click', () => {
    state.scores[`criterion:${state.criterion.id}`] = 4;
    saveScores();
    renderEvidence();
  });

  document.getElementById('mark-rhythm').addEventListener('click', () => {
    state.scores[`rhythm:${state.rhythm.id}`] = 4;
    saveScores();
    renderEvidence();
  });

  document.getElementById('next-simulation').addEventListener('click', () => {
    const currentIndex = simulationIndex();
    state.simulation = data.simulations[(currentIndex + 1) % data.simulations.length];
    renderSimulation();
  });

  document.getElementById('check-simulation').addEventListener('click', checkSimulation);
  document.getElementById('clear-simulation').addEventListener('click', () => {
    simulationAnswer.value = '';
    speechNote.textContent = '';
  });
  document.getElementById('record-simulation').addEventListener('click', toggleRecording);
  document.getElementById('ask-accent-coach').addEventListener('click', answerAccentCoachQuestion);
  document.getElementById('record-accent-question').addEventListener('click', toggleCoachQuestionRecording);
  accentCoachInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') answerAccentCoachQuestion();
  });
}

function renderOptions() {
  criterionSelect.innerHTML = data.criteria.map(item => `<option value="${item.id}">${item.title}</option>`).join('');
  rhythmSelect.innerHTML = data.rhythms.map(item => `<option value="${item.id}">${item.title}</option>`).join('');
  simulationSelect.innerHTML = data.simulations.map((item, index) => `<option value="${index}">${index + 1}. ${item[0]}</option>`).join('');
}

function renderAll() {
  renderRoute();
  renderSource();
  renderCriterion();
  renderRhythm();
  renderSimulation();
  renderHomework();
  renderEvidence();
}

function renderSource() {
  document.getElementById('theory-list').innerHTML = data.theory.map(([label, text]) => block(label, text)).join('');
  document.getElementById('checklist-list').innerHTML = data.checklists.map(([label, text]) => block(label, text)).join('');
  document.getElementById('text-examples').innerHTML = data.textExamples.map(([label, text]) => block(label, text)).join('');
}

function renderRoute() {
  document.getElementById('case-profile').innerHTML = data.caseProfile.map(([label, text]) => block(label, text)).join('');
  document.getElementById('daily-route').innerHTML = data.route.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  document.getElementById('power-lines').innerHTML = data.powerLines.map(line => `<p>${escapeHtml(line)}</p>`).join('');
}

function renderCriterion() {
  criterionSelect.value = state.criterion.id;
  document.getElementById('criterion-title').textContent = state.criterion.title;
  document.getElementById('criterion-detail').innerHTML = `
    ${block('Moet toetsbaar zijn', state.criterion.must.join(' '))}
    ${block('10-zin', state.criterion.model)}
  `;
  document.getElementById('criterion-fix').innerHTML = state.criterion.fix.map(item => block('Fix', item)).join('');
}

function renderRhythm() {
  rhythmSelect.value = state.rhythm.id;
  document.getElementById('rhythm-title').textContent = state.rhythm.title;
  document.getElementById('rhythm-detail').innerHTML = state.rhythm.detail.map(([label, text]) => block(label, text)).join('');
  document.getElementById('rhythm-errors').innerHTML = state.rhythm.errors.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function renderSimulation() {
  simulationSelect.value = String(simulationIndex());
  document.getElementById('simulation-title').textContent = state.simulation[0];
  document.getElementById('simulation-prompt').textContent = state.simulation[1];
  const profile = simulationProfile(state.simulation[0]);
  document.getElementById('simulation-focus').innerHTML = profile.focus.map(item => `<span>${escapeHtml(item)}</span>`).join('');
  document.getElementById('simulation-coach').innerHTML = simulationCoachHtml(profile);
  simulationFeedback.innerHTML = '<p class="accent-note">Nog geen simulatie nagekeken.</p>';
  simulationAnswer.value = '';
  speechNote.textContent = '';
}

function renderHomework() {
  document.getElementById('homework-card').innerHTML = data.homework.map(([label, text]) => block(label, text)).join('');
  document.getElementById('feedback-trainer').innerHTML = data.feedbackExamples.map(([weakLabel, weak, strongLabel, strong]) => `
    <article>
      <strong>${escapeHtml(weakLabel)}</strong>
      <span>${escapeHtml(weak)}</span>
      <strong>${escapeHtml(strongLabel)}</strong>
      <p>${escapeHtml(strong)}</p>
    </article>
  `).join('');
}

function checkSimulation() {
  const answer = simulationAnswer.value.trim();
  if (!answer) {
    speechNote.textContent = 'Schrijf of spreek eerst je therapeuttekst in.';
    return;
  }

  const result = scoreAnswer(answer);
  state.scores[`simulation:${state.simulation[0]}`] = Math.max(state.scores[`simulation:${state.simulation[0]}`] || 0, result.score);
  saveScores();
  simulationFeedback.innerHTML = `
    <div class="accent-feedback-head">
      <h3>${escapeHtml(result.label)}</h3>
      <strong>${result.score}/4</strong>
    </div>
    ${result.scan}
    ${block('Wat is sterk', result.good)}
    ${block('Wat kost punten', result.missing)}
    ${result.score === 3 ? zgCoachBlock(result) : ''}
    ${block('Volgende poging', result.next)}
    ${result.score < 4 ? redRetryHtml() : ''}
  `;
  bindRedRetry(simulationFeedback, simulationAnswer, speechNote);
  renderEvidence();
}

function scoreAnswer(answer) {
  const clean = normalize(answer);
  const profile = simulationProfile(state.simulation[0]);
  const passed = profile.checks.filter(check => hasAny(clean, check.words));
  const missing = profile.checks.filter(check => !hasAny(clean, check.words));
  const warnings = profile.warnings.filter(warning => warning.test(clean));
  const wordCount = answer.split(/\s+/).filter(Boolean).length;

  let score = scoreFromRatio(passed.length / profile.checks.length);
  if (warnings.length) score = Math.min(score, 2);

  return {
    score,
    label: labelForScore(score),
    good: passed.length ? `Je raakt: ${passed.map(check => check.label).join(', ')}.` : 'Je antwoord is nog te algemeen voor deze simulatie.',
    missing: score >= 4 && !warnings.length ? 'Geen grote inhoudelijke gaten; train nu vooral timing, cliënttaal en nagesprek.' : missingForSimulation(missing, warnings, wordCount, profile.minimumWords),
    scan: coachScanHtml({
      good: passed.map(check => check.label),
      missing: missing.slice(0, 6).map(check => check.missing),
      vague: warnings.map(warning => warning.message)
    }),
    zgSteps: zgStepsForSimulation(profile, missing, warnings, score),
    next: score >= 4 ? profile.nextStrong : profile.next
  };
}

function zgCoachBlock(result) {
  const title = 'Van score 3/4 naar 4/4';
  const intro = 'Voeg dit kort toe en check opnieuw:';

  return `
    <article class="accent-zg-coach">
      <strong>${title}</strong>
      <p>${intro}</p>
      <ul>
        ${result.zgSteps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}
      </ul>
    </article>
  `;
}

function simulationCoachHtml(profile) {
  const flow = profile.flow || [
    ['1. Kader', 'Zeg kort waarom deze stap Bernard helpt.'],
    ['2. Nacheck', 'Vraag wat hij merkte in keel, adem, kaak of druk.'],
    ['3. Bijsturen', 'Kies één cue en laat direct opnieuw proberen.']
  ];

  return `
    <section aria-label="Coachroute voor de simulatie">
      <div class="accent-coach-route">
        ${flow.map(([label, text]) => `
          <article>
            <strong>${escapeHtml(label)}</strong>
            <span>${escapeHtml(text)}</span>
          </article>
        `).join('')}
      </div>
      <p><strong>Therapeutformule:</strong> ik hoorde/merkte... wat voelde u... volgende poging letten we op... nog één keer.</p>
      <p><strong>Let op:</strong> deze simulatie beoordeelt je therapeutische taal. In de live toets moeten je houding, ritme en beweging natuurlijk ook kloppen.</p>
    </section>
  `;
}

function scoreFromRatio(ratio) {
  if (ratio >= 0.75) return 4;
  if (ratio >= 0.5) return 3;
  if (ratio >= 0.25) return 2;
  return 1;
}

function labelForScore(score) {
  if (score >= 4) return 'Score 4/4 · ZG-klaar';
  if (score === 3) return 'Score 3/4 · voldoende';
  if (score === 2) return 'Score 2/4 · nog niet toetsvast';
  return 'Score 1/4 · te vaag';
}

function missingForSimulation(missing, warnings, wordCount, minimumWords) {
  const parts = [];
  warnings.forEach(warning => parts.push(warning.message));
  if (wordCount < minimumWords && missing.length) parts.push('Kort is prima, maar er mist nog een toetsstap.');
  if (missing.length) parts.push(`Nog toevoegen: ${missing.slice(0, 3).map(check => check.missing).join('; ')}.`);
  return parts.length ? parts.join(' ') : 'Geen grote inhoudelijke gaten; train nu vooral timing, cliënttaal en nagesprek.';
}

function zgStepsForSimulation(profile, missing, warnings, score) {
  if (warnings.length) return warnings.map(warning => warning.fix).slice(0, 3);
  const steps = missing.map(check => check.zg || check.missing);
  if (!steps.length) steps.push(profile.upgrade);
  return unique(steps).filter(Boolean).slice(0, 2);
}

function simulationProfile(title) {
  const profiles = {
    'Voorbespreking Largo': {
      focus: ['Geen huiswerk hier', 'Doel in cliënttaal', 'Wat Bernard gaat ervaren', 'Kort + non-directief'],
      flow: [
        ['1. Waarom', 'Koppel Largo aan minder stemdruk bij drukkerij en koor.'],
        ['2. Wat doen we', 'Zeg dat jij voordoet en Bernard meedoet op /f/ of hoorbare uitademing.'],
        ['3. Na afloop', 'Kondig aan dat je vraagt wat hij voelt in keel, adem en gemak.']
      ],
      minimumWords: 35,
      checks: [
        check('Bernard-context', ['bernard', 'drukkerij', 'koor', 'zwelling', 'stemvermoeid'], 'koppel aan Bernard', 'Noem Bernard zijn werk/koor en waarom minder druk nodig is.'),
        check('Cliënttaal doel', ['minder belast', 'draagkracht', 'minder druk', 'economisch', 'stem beter samenwerken'], 'zeg het doel in gewone taal', 'Maak het simpel: minder drukken, toch draagkracht.'),
        check('Largo-kader', ['largo', '3/4', 'drie kwart', 'rustig ritme', 'rustige oefening'], 'benoem dat je Largo/rustig ritme start', 'Zeg kort dat dit het rustige Largo-ritme is.'),
        check('Voordoen/imiteren', ['ik doe', 'doe mij', 'meedoen', 'imiteren', 'voordoen'], 'vertel dat jij voordoet en Bernard imiteert', 'Laat zien dat je non-directief werkt: voordoen en laten meedoen.'),
        check('Wat hij moet voelen', ['voelen', 'merken', 'keel', 'gemak', 'adem', 'druk'], 'zeg waar Bernard op mag letten', 'Laat Bernard letten op keelgemak, adem en minder druk.'),
        check('Eerste klank', ['/f', 'f-klank', 'stemloos', 'uitademing hoorbaar'], 'start met /f/ of stemloze uitademing', 'Start met /f/ zodat adem en stem eerst veilig koppelen.'),
        check('Nagesprek aankondigen', ['daarna vraag', 'na afloop', 'bespreken', 'wat u merkt'], 'kondig korte reflectie na het ritme aan', 'Zeg dat je na afloop vraagt wat hij voelde.')
      ],
      warnings: [],
      upgrade: 'Hou het bij cliënttaal: waarom, wat doen we, waar let u op, daarna kort nabespreken.',
      next: 'Korter en praktischer: doelzin, voordoen, /f/ starten, na afloop laten voelen/verwoorden.',
      nextStrong: 'Herhaal de voorbespreking in 30 seconden zonder theoriecollege.'
    },
    'Nagesprek na vastlopen': {
      focus: ['Observatie verbaal maken', 'Bernard laten reflecteren', 'Eén cue kiezen', 'Opnieuw proberen'],
      flow: [
        ['1. Benoem kort', 'Zeg wat je merkte zonder te oordelen: het bleef nog wat vast.'],
        ['2. Laat Bernard voelen', 'Vraag waar hij spanning, druk of gemak merkte.'],
        ['3. Eén cue', 'Kies één bijsturing en laat hem meteen opnieuw proberen.']
      ],
      minimumWords: 30,
      checks: [
        check('Observatie benoemen', ['stijf', 'vast', 'op slot', 'weinig meeging', 'spanning'], 'benoem kort wat je zag/hoorde', 'Zeg kort: ik zag dat het nog wat vast bleef.'),
        check('Reflectievraag', ['wat merkte', 'hoe voelde', 'keel', 'adem', 'spanning', 'gemak'], 'vraag Bernard wat hij merkte', 'Laat Bernard zelf benoemen waar spanning of gemak zat.'),
        check('Eén nagesprek-cue', ['volgende', 'cue', 'losser', 'minder duwen', 'zachter', 'rustiger'], 'kies één cue voor de volgende poging', 'Kies één focus, niet vier tegelijk.'),
        check('Nieuwe poging', ['opnieuw', 'nog een keer', 'volgende poging', 'probeer', 'meedoen'], 'laat direct opnieuw proberen', 'Feedback is pas behandeling als er opnieuw geoefend wordt.')
      ],
      warnings: [],
      upgrade: 'Maak het toetsbaar: observatie, reflectievraag, één cue, opnieuw proberen.',
      next: 'Voeg vooral het nagesprek toe: wat merkte Bernard en welke cue volgt daaruit?',
      nextStrong: 'Train dit als nagesprek: niet opnieuw de oefening uitleggen, maar therapeutisch bijsturen.'
    },
    'Feedback na harde afsluiting': {
      focus: ['Specifiek compliment', 'Harde offset corrigeren', 'Zachte afsluiting', 'Nieuwe poging'],
      flow: [
        ['1. Compliment', 'Benoem één concreet sterk punt dat je hoorde.'],
        ['2. Correctie', 'Noem de harde afsluiting en maak er zachte uitdoving van.'],
        ['3. Direct doen', 'Laat Bernard dezelfde klank meteen opnieuw proberen.']
      ],
      minimumWords: 30,
      checks: [
        check('Concreet compliment', ['goed', 'sterk', 'mooi', 'rustiger', 'beter'], 'geef één concreet compliment', 'Benoem specifiek wat beter klonk, bijvoorbeeld rustiger tempo of zachtere inzet.'),
        check('Harde offset', ['offset', 'afsluiting', 'tik', 'hard', 'dichtzetten', 'uitdoven'], 'benoem harde afsluiting/offset', 'Zeg dat het einde zachter moet uitdoven.'),
        check('Waarom', ['druk', 'keel', 'stemband', 'zwelling', 'minder belast'], 'koppel feedback aan minder stemdruk', 'Leg kort uit dat dit de keel minder laat dichtzetten.'),
        check('Nieuwe poging', ['opnieuw', 'nog een keer', 'volgende poging', 'probeer'], 'laat direct opnieuw proberen', 'Feedback is pas toetswaardig als je daarna opnieuw laat oefenen.')
      ],
      warnings: [],
      upgrade: 'Maak de feedback in één formule: concreet sterk punt, één correctie, waarom, opnieuw.',
      next: 'Voeg harde offset en direct opnieuw proberen toe.',
      nextStrong: 'Oefen met één zin feedback: kort, streng en direct uitvoerbaar.'
    },
    'Voorbespreking Allegro': fourFourProfile({
      focus: ['4/4, geen Largo', '1/8 opmaat', '5 accenten', 'Zelfcheck na afloop'],
      flow: [
        ['1. 4/4 kaderen', 'Zeg expliciet: Allegro is 4/4, dynamisch maar niet gehaast.'],
        ['2. Patroon', 'Noem korte inademing/opmaat en vijf accenten.'],
        ['3. Nacheck', 'Kondig aan dat je na afloop tempo, keel en druk checkt.']
      ],
      checks: [
        check('Allegro/4-4', ['allegro', '4/4', 'vierkwarts', 'galop'], 'noem Allegro als 4/4', 'Zeg expliciet: dit is Allegro in 4/4, niet Largo.'),
        check('Opmaat', ['opmaat', '1/8', 'achtste', 'korte inademing'], 'benoem 1/8 opmaat/inademing', 'Zeg: kort in, dan inzet.'),
        check('Accentpatroon', ['vijf', '5', 'zes', '6', 'accent'], 'benoem opmaat plus accenten', 'Gebruik: één onbeklemtoonde opmaat + vijf accenten.'),
        check('Tempo bewaken', ['niet jachtig', 'rustig', 'tempo laag', 'niet te snel'], 'voorkom jachtig tempo', 'Zeg dat het dynamisch is, maar niet gehaast.'),
        check('Klank/stem', ['zacht', 'kaak', 'borstregister', 'stem', 'open klinker'], 'bewaak stemkwaliteit en kaak', 'Ook snel blijft de stem licht, ruim en zonder drukken.'),
        check('Zelfcheck na afloop', ['na afloop', 'daarna vraag', 'voelde', 'jachtig', 'druk', 'keel'], 'kondig de nacheck aan', 'Zeg dat je na afloop checkt of het jachtig werd of druk gaf.')
      ],
      upgrade: 'Zeg hardop: “Allegro is 4/4: kort in, opmaat, vijf accenten; na afloop checken we of het licht bleef.”',
      next: 'Je zit nog te veel in Largo. Noem 4/4, opmaat, vijf accenten en nacheck.',
      nextStrong: 'Herhaal met metronoomgevoel: langzaam Allegro, niet versnellen.'
    }),
    'Nagesprek Allegro': {
      focus: ['Tempo evalueren', 'Druk/keel checken', 'Stem licht houden', 'Eén vervolgcue'],
      flow: [
        ['1. Tempo', 'Vraag of Allegro jachtig werd of nog rustig bleef.'],
        ['2. Keel/druk', 'Vraag of hij ging persen of druk voelde.'],
        ['3. Volgende poging', 'Geef één cue: rustiger, lichter of zachter uitdoven.']
      ],
      minimumWords: 30,
      checks: [
        check('Tempo/jachtigheid', ['jachtig', 'tempo', 'te snel', 'rustiger'], 'vraag naar tempo/jachtigheid', 'Check of Bernard ging jagen.'),
        check('Druk/keel', ['druk', 'keel', 'duwen', 'persen', 'minder belast'], 'vraag naar druk in keel/stem', 'Vraag of hij druk of keelspanning merkte.'),
        check('Stemkwaliteit', ['licht', 'zacht', 'helder', 'kaak', 'open'], 'benoem stemkwaliteit', 'Koppel aan licht/ruim blijven in plaats van persen.'),
        check('Vervolgcue', ['volgende', 'opnieuw', 'cue', 'rustiger', 'zachter'], 'geef één concrete vervolgcue', 'Laat hem opnieuw proberen met één focus.')
      ],
      warnings: [],
      upgrade: 'Maak het nagesprek concreet: tempo, keel/druk, stemkwaliteit, één cue, opnieuw.',
      next: 'Vraag niet alleen hoe het ging; vraag door op tempo en keelspanning.',
      nextStrong: 'Oefen dit als 20 seconden nagesprek na Allegro.'
    },
    'Voorbespreking Andante': fourFourProfile({
      focus: ['4/4, geen Largo', '1/8 adem + 1/8 inzet', '3 gelijke accenten', 'Nacheck buikwand'],
      flow: [
        ['1. 4/4 kaderen', 'Zeg expliciet: Andante is 4/4, geen Largo.'],
        ['2. Patroon', 'Noem 1/8 inademing, 1/8 zachte inzet en drie accenten.'],
        ['3. Nacheck', 'Kondig aan dat je adem, inzet en loslaten van de buikwand checkt.']
      ],
      checks: [
        check('Andante/4-4', ['andante', '4/4', 'vierkwarts'], 'noem Andante als 4/4', 'Zeg expliciet: Andante is 4/4, niet Largo.'),
        check('1/8 adem', ['1/8', 'achtste', 'korte inademing', 'opmaat'], 'benoem 1/8 inademing/opmaat', 'Start met korte adem, niet drie tellen in.'),
        check('Onbeklemtoonde inzet', ['onbeklemtoond', 'inzet', 'opmaat'], 'benoem onbeklemtoonde inzet', 'Na de 1/8 adem komt de onbeklemtoonde inzet.'),
        check('Drie accenten', ['drie accenten', '3 accenten', 'drie gelijke', 'drie beklemtoonde', 'even sterk'], 'benoem drie gelijke accenten', 'Daarna volgen drie even sterke accenten.'),
        check('Buikwand', ['buikwand', 'terugveren', 'recoil', 'loslaten'], 'check directe buikwandrecoil', 'Bewaak dat de buikwand direct terugveert na de klank.'),
        check('Nacheck aankondigen', ['na afloop', 'daarna vraag', 'voelde', 'buik', 'adem'], 'kondig nagesprek aan', 'Zeg dat je na afloop checkt of de adem kort en vrij bleef.')
      ],
      upgrade: 'Zeg hardop: “Andante is 4/4: 1/8 in, 1/8 zachte inzet, drie accenten; daarna checken we buikwandrecoil.”',
      next: 'Maak het echt Andante: geen drie tellen, maar 1/8 adem, 1/8 inzet en drie accenten.',
      nextStrong: 'Oefen Andante met alleen /f/ en daarna /v/, zonder uitlegdrang.'
    }),
    'Nagesprek Andante': {
      focus: ['Korte adem checken', 'Zachte inzet', 'Drie accenten', 'Vervolgcue'],
      flow: [
        ['1. Adem', 'Vraag of de inademing kort en vrij bleef.'],
        ['2. Inzet/accenten', 'Check zachte inzet en drie gelijke accenten.'],
        ['3. Eén cue', 'Kies één vervolgcue en laat dezelfde reeks opnieuw doen.']
      ],
      minimumWords: 30,
      checks: [
        check('Korte adem', ['korte inademing', '1/8', 'adem', 'opmaat'], 'vraag naar korte inademing', 'Check of hij niet te groot inademde.'),
        check('Zachte inzet', ['zachte inzet', 'onbeklemtoond', 'geen tik', 'rustig'], 'vraag naar zachte inzet', 'Bewaak dat de inzet niet hard wordt.'),
        check('Drie accenten', ['drie', 'accent', 'even sterk'], 'bespreek de drie accenten', 'Check of de accenten gelijkmatig bleven.'),
        check('Vervolgcue', ['volgende', 'opnieuw', 'cue', 'buikwand', 'loslaten'], 'geef één cue voor opnieuw', 'Kies één vervolgcue, bijvoorbeeld buikwand loslaten.')
      ],
      warnings: [],
      upgrade: 'Maak het nagesprek concreet: adem, inzet, drie accenten, cue, opnieuw.',
      next: 'Voeg nacheck toe: wat voelde Bernard bij adem/inzet/accenten?',
      nextStrong: 'Oefen dit als korte evaluatie na Andante.'
    },
    'Tekstniveau nagesprek': {
      focus: ['Accentgroepen', 'Klinkerspraak', 'Natuurlijke zin', 'Weinig uitleg'],
      flow: [
        ['1. Luisteren', 'Laat accenten in logische eenheden eerst horen.'],
        ['2. Klinkerspraak', 'Laat Bernard klinkerspraak imiteren voordat de hele zin komt.'],
        ['3. Overbrengen', 'Laat de zin natuurlijk zeggen en bespreek één verbeterpunt.']
      ],
      minimumWords: 35,
      checks: [
        check('Accentgroepen', ['accentgroep', 'logische eenheid', 'accenten', 'beluisteren'], 'start met accentgroepen beluisteren', 'Laat Bernard eerst luisteren naar de accenten.'),
        check('Klinkerspraak', ['klinkerspraak', 'klinkers', 'zonder woorden'], 'gebruik klinkerspraak vóór tekst', 'Doe de zin eerst voor in klinkerspraak.'),
        check('Natuurlijke zin', ['natuurlijk', 'echte zin', 'overbrengen', 'spontane spraak'], 'ga daarna naar natuurlijke zin', 'Laat daarna dezelfde zin natuurlijk spreken.'),
        check('Gedachte/oogcontact', ['gedachteconcentratie', 'oogcontact', 'luisteraar'], 'bewaak gedachteconcentratie en oogcontact', 'Eerst denken, oogcontact, inademing, spreken.'),
        check('Nabespreken', ['wat merkte', 'hoe voelde', 'natuurlijk', 'verbeterpunt', 'volgende'], 'bespreek na en geef één verbeterpunt', 'Sluit af met één concrete cue voor de volgende zin.')
      ],
      warnings: [],
      upgrade: 'Maak één korte voorbeeldzin concreet en laat exact horen hoe je van klinkerspraak naar zin gaat.',
      next: 'Noem accentgroepen, klinkerspraak en natuurlijke zin in die volgorde.',
      nextStrong: 'Pak “we gaan naar huis” en voer de drie stappen hardop uit.'
    },
    'Nagesprek na Largo': {
      focus: ['Open vraag', 'Doorvragen', 'Antwoord gebruiken', 'Niet zelf invullen'],
      flow: [
        ['1. Open vraag', 'Begin met: wat merkte u?'],
        ['2. Doorvragen', 'Vraag door op keel, adem, kaak, gemak of druk.'],
        ['3. Antwoord benutten', 'Maak zijn antwoord de basis van je volgende cue.']
      ],
      minimumWords: 25,
      checks: [
        check('Open vraag', ['wat merkte', 'hoe ging', 'hoe voelde', 'wat voelde'], 'start met open vraag', 'Vraag wat Bernard zelf merkte.'),
        check('Doorvragen keel/adem', ['keel', 'adem', 'kaak', 'spanning', 'gemak'], 'vraag door op keel, adem, kaak of spanning', 'Eén vraag is te weinig; vraag gericht door.'),
        check('Gebruik antwoord', ['daarom', 'dan', 'volgende', 'cue', 'opnieuw'], 'gebruik zijn antwoord voor je volgende cue', 'Laat zien dat reflectie je behandeling stuurt.')
      ],
      warnings: [],
      upgrade: 'Maak het therapeutisch: vraag, luister, kies één cue, probeer opnieuw.',
      next: 'Voeg doorvragen en een vervolgcue toe.',
      nextStrong: 'Train dit met iemand die expres vaag antwoordt.'
    },
    'Huiswerk afsluiten': {
      focus: ['Materiaal', '3x 5 minuten', 'Aandachtspunten', 'Transfer'],
      flow: [
        ['1. Materiaal', 'Noem exact wat Bernard meekrijgt.'],
        ['2. Dosering', 'Maak het klein en haalbaar: 3x per dag 5 minuten.'],
        ['3. Zelfcheck', 'Geef vragen waarmee hij thuis druk en zachte afsluiting bewaakt.']
      ],
      minimumWords: 35,
      checks: [
        check('Materiaal', ['audio', 'trommel', 'kaart', 'tekst', 'opname'], 'noem concreet materiaal', 'Zeg wat Bernard meekrijgt.'),
        check('Frequentie/duur', ['3x', 'drie keer', '5 minuten', 'vijf minuten', '10 minuten', 'tien minuten'], 'noem frequentie en duur', 'Maak het meetbaar: 3x per dag 5 minuten.'),
        check('Aandachtspunten', ['kaak', 'zacht', 'offset', 'knie', 'pols', 'spiegel'], 'geef specifieke aandachtspunten', 'Noem maximaal drie punten: bijvoorbeeld kaak, zachte afsluiting en losse beweging.'),
        check('Transfer', ['drukkerij', 'koor', 'zingen', 'werk'], 'koppel aan drukkerij/koor', 'Leg uit waar hij het buiten de therapie gaat gebruiken.'),
        check('Zelfcheck', ['voel', 'merkte', 'keel', 'duw', 'zelfcheck'], 'geef zelfcheckvraag', 'Laat Bernard thuis controleren of hij niet duwt.')
      ],
      warnings: [],
      upgrade: 'Zeg het als afsluitinstructie aan Bernard, niet als losse notitie over huiswerk.',
      next: 'Maak huiswerk concreet: materiaal, 3x5 minuten, drie aandachtspunten, transfer.',
      nextStrong: 'Oefen de afsluiting in 25 seconden.'
    },
    'Weerstand na ritme': {
      focus: ['Erkennen', 'Non-directief', 'Koppelen aan zang/werk', 'Kort laten ervaren'],
      flow: [
        ['1. Erkennen', 'Maak weerstand normaal: het mag vreemd voelen.'],
        ['2. Hulpvraag', 'Koppel aan zijn wens: zingen en werken zonder druk.'],
        ['3. Ervaren', 'Vraag om één korte poging in plaats van overtuigen met theorie.']
      ],
      minimumWords: 35,
      checks: [
        check('Erkennen', ['begrijp', 'logisch', 'raar', 'snap', 'voorstellen'], 'erken zijn weerstand', 'Begin niet verdedigend; erken dat het vreemd kan voelen.'),
        check('Motiveren via hulpvraag', ['zingen', 'koor', 'drukkerij', 'draagkracht', 'truc'], 'koppel aan zijn doel', 'Verbind de oefening aan weer kunnen zingen/werken zonder druk.'),
        check('Non-directief', ['probeer', 'ervaren', 'doet mee', 'ik doe voor', 'meedoen'], 'nodig uit om te ervaren', 'Laat hem het verschil voelen in plaats van overtuigen met theorie.'),
        check('Kort houden', ['kort', 'even', 'één keer', 'daarna'], 'maak de drempel laag', 'Vraag om één korte poging.')
      ],
      warnings: [],
      upgrade: 'Vervang uitleg door ervaring: erken, doel koppelen, één korte poging laten voelen.',
      next: 'Reageer minder theoretisch en meer motiverend.',
      nextStrong: 'Speel dit met een kritische cliënt en blijf rustig/non-directief.'
    }
  };

  return profiles[title] || {
    focus: ['Doel', 'Uitvoering', 'Feedback'],
    minimumWords: 30,
    checks: [
      check('Concreet handelen', ['ik doe', 'ik laat', 'ik vraag', 'ik geef'], 'zeg wat jij doet'),
      check('Cliëntactie', ['bernard', 'u doet', 'u voelt', 'probeer'], 'zeg wat Bernard doet'),
      check('Volgende stap', ['opnieuw', 'volgende', 'feedback'], 'noem de volgende stap')
    ],
    warnings: [],
    upgrade: 'Maak het concreet: therapeutzin, cliëntactie, observatie en vervolg.',
    next: 'Vul aan wat je precies zegt en doet.',
    nextStrong: 'Herhaal zonder tekst.'
  };
}

function fourFourProfile(profile) {
  return {
    minimumWords: 35,
    warnings: [
      {
        test: clean => hasAny(clean, ['3/4', 'drie kwart', 'largo', 'voor-achter', 'voor achter', '3 tellen', 'drie tellen']),
        message: 'Let op: je beschrijft nu 3/4/Largo. De docent vraagt hier 4/4.',
        fix: profile.upgrade
      }
    ],
    ...profile
  };
}

function check(label, words, missing, zg = missing) {
  return { label, words, missing, zg };
}

function hasAny(clean, words) {
  return words.some(word => clean.includes(normalize(word)));
}

function unique(items) {
  return [...new Set(items)];
}

function answerAccentCoachQuestion() {
  const question = accentCoachInput.value.trim();
  if (!question) {
    accentCoachAnswer.innerHTML = '<p>Stel eerst je vraag. Bijvoorbeeld: “hoe leg ik Largo uit?” of “wat zeg ik bij huiswerk?”</p>';
    return;
  }

  const answer = buildAccentCoachAnswer(question);
  accentCoachAnswer.innerHTML = `
    <strong>${escapeHtml(answer.title)}</strong>
    <p>${escapeHtml(answer.body)}</p>
    <span>${escapeHtml(answer.action)}</span>
  `;
  if (answer.view) showView(answer.view);
}

function buildAccentCoachAnswer(question) {
  const clean = normalize(question);

  if ((hasAny(clean, ['andante', 'allegro', 'ritme 2']) && hasAny(clean, ['3/4', 'drie kwart', 'largo', 'voor-achter', 'drie tellen'])) || (hasAny(clean, ['4/4', 'vierkwarts']) && hasAny(clean, ['ritme', 'andante', 'allegro']))) {
    return {
      title: 'Van Largo-denken naar 4/4',
      body: 'Schrap de Largo-taal: geen 3 tellen, geen voor-achterbeweging. Zeg bij Andante: 1/8 inademing, 1/8 onbeklemtoonde inzet, drie accenten, draaiing en onderarm. Zeg bij Allegro: opmaat, vijf accenten, verende knieën en losse pols.',
      action: 'Actie: open Simulatie en oefen Andante of Allegro met alleen deze 4/4-zin.',
      view: 'simulatie'
    };
  }
  if (hasAny(clean, ['3/4', '3 van 4', 'voldoende']) && hasAny(clean, ['4/4', '4 van 4', 'zg', 'score', 'punten'])) {
    return {
      title: 'Van 3/4-score naar 4/4-score',
      body: 'Voeg niet méér theorie toe. Voeg één toetsbaar therapeutisch bewijs toe: concrete Bernard-koppeling, nacheck, cliëntreflectie of direct opnieuw proberen. De simulatiefeedback kiest er maximaal drie.',
      action: 'Actie: plak je antwoord in Simulatie en kijk alleen naar het blok “Van score 3/4 naar 4/4”.',
      view: 'simulatie'
    };
  }
  if (matches(clean, ['largo', 'ritme 1', '3/4', 'drie kwart'])) {
    return {
      title: 'Largo: kader kort, check daarna',
      body: 'Zeg vóór het ritme kort: “We starten rustig; adem en stem gaan samenwerken zodat u minder hoeft te drukken.” Na het ritme vraag je wat hij merkte in keel, adem, kaak en gemak.',
      action: 'Actie: open Simulatie en oefen “Voorbespreking Largo” plus “Nagesprek na Largo”.',
      view: 'simulatie'
    };
  }
  if (matches(clean, ['andante', 'ritme 2', '1/8', 'achtste'])) {
    return {
      title: 'Andante: rust en buikwandrecoil bewaken',
      body: 'De kern is 1/8 inademing, 1/8 onbeklemtoonde inzet en daarna drie gelijke accenten. Laat Bernard de buikwand direct laten terugveren; als dat niet lukt, is de adem-stemkoppeling nog niet veilig.',
      action: 'Actie: kies Andante bij Ritmes en spreek hardop de uitleg in cliënttaal uit.',
      view: 'ritmes'
    };
  }
  if (matches(clean, ['allegro', 'galop', 'snel', 'jachtig'])) {
    return {
      title: 'Allegro: dynamisch, maar niet jagen',
      body: 'Allegro is sneller, maar mag nooit hectisch worden. Zeg vóór het ritme: 4/4, korte inademing/opmaat, vijf accenten. Na afloop check je tempo, keel/druk en of de stem licht bleef.',
      action: 'Actie: oefen de Allegro-simulatie en let op je korte voorbespreking plus nacheck.',
      view: 'simulatie'
    };
  }
  if (matches(clean, ['tekst', 'tekstniveau', 'klinkerspraak', 'zin', 'zinnen'])) {
    return {
      title: 'Tekstniveau: eerst accentgroepen, dan natuurlijk spreken',
      body: 'Laat de cliënt eerst luisteren naar de accenten, daarna klinkerspraak imiteren en pas daarna de zin natuurlijk overbrengen. Leg weinig uit; de toets wil zien dat je oefent, voordoet en bewaakt.',
      action: 'Actie: open Bron en pak een korte zin zoals “we gaan naar huis”; doe hem eerst in klinkerspraak.',
      view: 'bron'
    };
  }
  if (matches(clean, ['harde offset', 'offset', 'afsluiting', 'tik', 'glottis', 'glottisslag'])) {
    return {
      title: 'Harde offset kost punten',
      body: 'Je moet horen en benoemen dat de klank zacht uitdooft. Zeg tegen Bernard: “Laat het einde wegsmelten, alsof u de keel niet dichtzet.” Daarna laat je direct opnieuw proberen.',
      action: 'Actie: ga naar Simulatie en oefen “Feedback na harde afsluiting”.',
      view: 'simulatie'
    };
  }
  if (matches(clean, ['kaak', 'kaakdaling', 'mond', 'articulatie'])) {
    return {
      title: 'Kaakdaling: maak er een nacheck van',
      body: 'In de simulatie kan de tool je kaakcue niet zien. Scoor daarom verbaal: “Ik wil bij de volgende poging één ding aanpassen: de kaak iets ruimer laten vallen bij /o/.” Daarna laat je opnieuw proberen.',
      action: 'Actie: oefen “Feedback na harde afsluiting” en voeg één kaakcue toe.',
      view: 'simulatie'
    };
  }
  if (matches(clean, ['huiswerk', 'thuis', 'oefenen', 'meegeven', 'transfer'])) {
    return {
      title: 'Huiswerk moet concreet zijn',
      body: 'Noem materiaal, frequentie, duur, aandachtspunten en transfer. Dus niet “oefen dit thuis”, maar: audio/trommel, 3x per dag 5 minuten, spiegel, zachte inzet/offset, kaakruimte en toepassing bij drukkerij/koor.',
      action: 'Actie: open Huiswerk en spreek de afsluiting alsof Bernard nu vertrekt.',
      view: 'huiswerk'
    };
  }
  if (matches(clean, ['feedback', 'compliment', 'verbeterpunt', 'cue'])) {
    return {
      title: 'Feedback = compliment + correctie + nieuwe poging',
      body: 'Een 10-feedback is specifiek: wat ging goed, wat moet anders en waarom helpt dat Bernard? Sluit altijd af met opnieuw proberen. Algemeen prijzen levert weinig punten op.',
      action: 'Actie: ga naar Huiswerk en train “van compliment naar verbetercue”.',
      view: 'huiswerk'
    };
  }
  if (matches(clean, ['doel', 'werkwijze', 'uitleg', 'clienttaal', 'cliënttaal', 'waarom'])) {
    return {
      title: 'Doel uitleggen in gewone taal',
      body: 'Koppel alles aan Bernard: drukkerij, koor, zwelling, vermoeidheid. Vermijd vaktaal zonder vertaling. De kernzin is: minder drukken, adem en stem beter laten samenwerken, draagkracht behouden.',
      action: 'Actie: open Criteria 1 en oefen je uitleg in 30 seconden.',
      view: 'criteria'
    };
  }
  if (matches(clean, ['zelfreflectie', 'doorvragen', 'voelde', 'merkte', 'keel'])) {
    return {
      title: 'Laat Bernard zelf voelen en verwoorden',
      body: 'Vraag niet alleen “hoe ging het?”, maar vraag door op keel, adem, kaak, gemak en spanning. Gebruik zijn antwoord voor je volgende cue; dat maakt je therapeutisch handelen toetsbaar.',
      action: 'Actie: open Simulatie en oefen “Nagesprek na Largo”.',
      view: 'simulatie'
    };
  }
  if (matches(clean, ['bernard', 'bernhard', 'casus', 'drukkerij', 'koor', 'zwelling', 'roken', 'kuchen'])) {
    return {
      title: 'Casus Bernard: behandel niet de oefening, behandel de belasting',
      body: 'Zijn probleem is hyperfunctionele stemgeving onder hoge belasting: lawaai in de drukkerij, zingen, kuchen/roken/drinken en zwelling. Elke keuze moet leiden naar economischer stemgebruik met draagkracht.',
      action: 'Actie: open Route en zeg de casuskern in 20 seconden hardop.',
      view: 'route'
    };
  }
  return {
    title: 'Maak de vraag toetsgericht',
    body: 'Vraag naar één onderdeel: Largo, Andante, Allegro, tekstniveau, feedback, huiswerk, kaak, offset, cliënttaal of Bernard. Dan kan de coach je direct naar de juiste oefening sturen.',
    action: 'Actie: start bij Simulatie en laat je antwoord streng nakijken.',
    view: 'simulatie'
  };
}

function matches(clean, words) {
  return words.some(word => clean.includes(normalize(word)));
}

function toggleCoachQuestionRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    accentCoachAnswer.innerHTML = '<p>Spraakherkenning werkt niet in deze browser. Typ je vraag of gebruik Chrome/Edge.</p>';
    return;
  }

  const button = document.getElementById('record-accent-question');
  if (!coachRecognition) {
    coachRecognition = new SpeechRecognition();
    coachRecognition.lang = 'nl-NL';
    coachRecognition.interimResults = true;
    coachRecognition.continuous = false;
    coachRecognition.onresult = event => {
      accentCoachInput.value = Array.from(event.results).map(result => result[0].transcript).join(' ');
    };
    coachRecognition.onend = () => {
      coachRecording = false;
      button.textContent = 'Spreek in';
      if (accentCoachInput.value.trim()) answerAccentCoachQuestion();
    };
    coachRecognition.onerror = event => {
      coachRecording = false;
      button.textContent = 'Spreek in';
      accentCoachAnswer.innerHTML = `<p>${recognitionErrorMessage(event.error, 'Spreek in')}</p>`;
    };
  }

  if (coachRecording) {
    coachRecognition.stop();
    return;
  }

  if (recording && recognition) recognition.stop();
  coachRecording = true;
  button.textContent = 'Stop';
  accentCoachAnswer.innerHTML = '<p>Ik luister. Stel je vraag kort, bijvoorbeeld: “wat doe ik bij harde offset?”</p>';
  try {
    coachRecognition.start();
  } catch {
    coachRecording = false;
    button.textContent = 'Spreek in';
    accentCoachAnswer.innerHTML = '<p>De opname kon niet starten. Klik nog één keer op Spreek in of typ je vraag.</p>';
  }
}

function renderEvidence() {
  const maxItems = data.criteria.length + data.rhythms.length + data.simulations.length;
  const total = Object.values(state.scores).reduce((sum, value) => sum + value, 0);
  const ready = Math.round((total / (maxItems * 4)) * 100);
  document.getElementById('accent-ready').textContent = `${ready}%`;
  document.getElementById('accent-hint').textContent = ready >= 80 ? 'Sterk. Train nu zonder spiekposter.' : 'Train vooral cliënttaal, nagesprek en specifieke feedback.';

  const groups = [
    ['Criteria', data.criteria.map(item => state.scores[`criterion:${item.id}`] || 0)],
    ['Ritmes', data.rhythms.map(item => state.scores[`rhythm:${item.id}`] || 0)],
    ['Simulaties', data.simulations.map(item => state.scores[`simulation:${item[0]}`] || 0)]
  ];
  document.getElementById('score-bars').innerHTML = groups.map(([label, values]) => {
    const value = Math.round((values.reduce((sum, item) => sum + item, 0) / (values.length * 4)) * 100);
    return `
      <div class="accent-bar">
        <div><strong>${label}</strong><span>${value}%</span></div>
        <meter min="0" max="100" value="${value}">${value}%</meter>
      </div>
    `;
  }).join('');
  document.getElementById('final-checklist').innerHTML = data.finalChecklist.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function toggleRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    speechNote.textContent = 'Spraakherkenning werkt niet in deze browser. Typ je antwoord of gebruik Chrome/Edge.';
    return;
  }
  const button = document.getElementById('record-simulation');
  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'nl-NL';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = event => {
      simulationAnswer.value = Array.from(event.results).map(result => result[0].transcript).join(' ');
    };
    recognition.onend = () => {
      recording = false;
      button.textContent = 'Neem op';
    };
    recognition.onerror = event => {
      recording = false;
      button.textContent = 'Neem op';
      speechNote.textContent = recognitionErrorMessage(event.error);
    };
  }
  if (recording) {
    recognition.stop();
    return;
  }
  if (coachRecording && coachRecognition) coachRecognition.stop();
  recording = true;
  button.textContent = 'Stop';
  speechNote.textContent = 'Opname loopt. Spreek je voor- of nagesprek alsof Bernard voor je staat.';
  try {
    recognition.start();
  } catch {
    recording = false;
    button.textContent = 'Neem op';
    speechNote.textContent = 'De opname kon niet starten. Klik nog één keer of typ je antwoord in het tekstvak.';
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

function showView(name) {
  views.forEach(view => view.classList.toggle('is-active', view.id === `view-${name}`));
  tabs.forEach(tab => tab.classList.toggle('is-active', tab.dataset.view === name));
}

function saveScores() {
  localStorage.setItem('accent_scores', JSON.stringify(state.scores));
}

function simulationIndex() {
  return Math.max(0, data.simulations.findIndex(item => item[0] === state.simulation[0]));
}

function block(label, text) {
  return `
    <article>
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(text)}</span>
    </article>
  `;
}

function redRetryHtml() {
  return `
    <article class="red-retry-card">
      <strong>Rood naar groen</strong>
      <p>Laat je goede therapeutzin staan. Voeg alleen de ontbrekende nacheck, cue of Bernard-koppeling toe.</p>
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
        ${group('is-good', 'Groen · gezegd', good, 'Nog niets toetsbaar genoemd.')}
        ${group('is-missing', 'Rood · mist nog', missing, 'Geen harde gaten meer.')}
        ${group('is-vague', 'Geel · let op', vague, 'Nu vooral cliënttaal, timing en nagesprek trainen.')}
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
