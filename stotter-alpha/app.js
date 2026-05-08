'use strict';

const storageKey = 'stotter_alpha_logs';
const dailyKey = `stotter_alpha_daily_${localDateKey(new Date())}`;
const phaseKey = 'stotter_alpha_phases';
const stageKey = 'stotter_alpha_stage_index';

const dailySteps = [
  ['1 min · Procescommitment', 'Zeg hardop: “Ik train het proces. Ik hoef niets te bewijzen.” Dat is de startknop.'],
  ['3 min · Interne blauwdruk', 'Kies één beeld of herinnering. Laat de gedachte eerst in je hoofd ontstaan, daarna pas geluid.'],
  ['3 min · Stemgenerator', 'Activeer stem als zachte, continue trilling. Focus intern op stem maken, niet extern op hoe het klinkt.'],
  ['3 min · Lettergreepstroom', 'Lees of vertel in rustige pulsen. De klinker draagt de stem; de mond volgt.'],
  ['3 min · Spreekregie', 'Kies één podiumgedrag: ruimte, volume, pauze, oogcontact, emotie of beweging. Overdrijf 10%.'],
  ['3 min · Echte wereld + intentie', 'Doe één kleine spreekactie en beoordeel alleen of je je intentie volgde.']
];

const hexagon = [
  ['Perceptie', ['taak', 'optreden', 'moeilijk', 'moet', 'gevaar', 'beoordeling'], 'Zie je spreken als contact of als prestatie?'],
  ['Overtuiging', ['ik moet', 'altijd', 'nooit', 'eerst adem', 'perfect', 'mag niet', 'gaat mis', 'lastig woord'], 'Welke regel duwt je uit de automatische modus?'],
  ['Gedrag', ['duw', 'pers', 'adem pakken', 'vermijd', 'stop', 'forceer', 'controleer', 'scannen', 'ander woord'], 'Wat doe je om woorden, adem, stem of mond bewust te sturen?'],
  ['Emotie', ['angst', 'schaam', 'boos', 'frustr', 'paniek', 'onzeker', 'hulpeloos'], 'Welke emotie probeert de microfoon te pakken? Brutaal ding.'],
  ['Lichaam', ['keel', 'kaak', 'borst', 'hart', 'rood', 'spanning', 'buik', 'schouder'], 'Waar reageert je lichaam alsof er een tijger staat, terwijl het meestal een zin is?'],
  ['Intentie', ['vloeiend', 'niet stotteren', 'zeggen', 'delen', 'contact', 'uitleggen', 'vragen', 'boodschap'], 'Wil je foutloos klinken of iets overbrengen? Dat verschil is groot.']
];

const processPhases = [
  {
    title: 'Systeemreset',
    core: 'Spraak is een automatisch samenspel van idee, taal, stem en beweging. Controle maakt dat proces traag.',
    train: 'Neem 2 minuten lezen, 2 minuten monoloog en 3 minuten gesprek op. Zoek niet naar “fouten”, maar naar momenten waarop je gaat sturen.',
    watch: 'Woordscannen, extra adem pakken, duwen, mond controleren.',
    statement: 'Ik herken de controlereflex en keer terug naar het proces.'
  },
  {
    title: 'Interne blauwdruk',
    core: 'De gedachte komt eerst. Woorden en mondbewegingen volgen de interne formulering.',
    train: 'Zeg een zin eerst in jezelf met lichte mondbeweging. Voeg daarna pas zachte stem toe.',
    watch: 'Niet vooruit plannen welke klank moeilijk wordt.',
    statement: 'Ik laat mijn interne spraak de route bepalen.'
  },
  {
    title: 'Stemgenerator',
    core: 'Stem is de motor. Richt aandacht op intern stem activeren, niet op extern luisteren naar je klank.',
    train: 'Gebruik rood-oranje-groen: rust, intern klaarzetten, trilling toelaten. Houd de stem zacht en continu.',
    watch: 'Niet persen, niet testen of het “werkt”.',
    statement: 'Ik activeer stem en laat de woorden volgen.'
  },
  {
    title: 'Spraakstroom',
    core: 'Spraak voelt minder dreigend wanneer je hem traint als stroom van lettergreeppulsen.',
    train: 'Maak losse betekenisloze lettergrepen, daarna korte woorden, daarna zinnen. De klinker draagt de trilling.',
    watch: 'Niet elk woord optillen alsof het los over een hek moet.',
    statement: 'Ik spreek in pulsen, niet in obstakels.'
  },
  {
    title: 'Mentale film',
    core: 'Vertellen begint bij beelden, scènes en intentie. De mentale film voedt het automatische systeem.',
    train: 'Kijk naar een foto of voorwerp. Beschrijf kleur, beweging, context en gevoel zonder vooraf zinnen te bouwen.',
    watch: 'Niet zoeken naar perfecte woorden.',
    statement: 'Ik volg het beeld; de taal loopt mee.'
  },
  {
    title: 'Spreekregie',
    core: 'Je hoeft niet vloeiend te zijn om de leiding te nemen over ruimte, stem, pauze, oogcontact, emotie en lichaam.',
    train: 'Doe één challenge uit Spreekregie. Scoor daarna jouw gevoel tegenover wat een luisteraar zag.',
    watch: 'Niet kleiner worden om “normaal” te lijken.',
    statement: 'Ik maak spreken groter, echter en minder verborgen.'
  },
  {
    title: 'Intentie boven uitkomst',
    core: 'Verwachtingen maken je afhankelijk van resultaat. Intenties houden je handelend, ook na een moeilijke poging.',
    train: 'Schrijf na een spreekactie: intentie, actie, uitkomst, les en beloning.',
    watch: 'Niet wachten tot je zeker weet dat het lukt.',
    statement: 'Ik beloon het volgen van mijn intentie.'
  },
  {
    title: 'Echte wereld',
    core: 'Nieuwe spraak wordt pas sterk in gewone situaties en door steun: oefenpartner, groep, feedback, werk, thuis.',
    train: 'Koppel een mini-experiment aan je dag en bewaar daarna bewijs van wat je ondanks spanning deed.',
    watch: 'Alleen trainen en dan hopen dat het vanzelf transfereert.',
    statement: 'Ik maak mijn leven het oefenlaboratorium.'
  }
];

const stageChallenges = [
  {
    title: 'Claim ruimte',
    prompt: 'Vertel 60 seconden en gebruik bewust drie plekken in de kamer. Raak twee objecten aan. Score gaat over ruimte nemen, niet vloeiendheid.',
    low: 'bevroren',
    high: 'ruimteleider',
    next: 'Doe dezelfde tekst opnieuw met één extra stap naar voren.'
  },
  {
    title: 'Spreek sterker',
    prompt: 'Vertel 45 seconden met 2x meer volume dan normaal. Niet schreeuwen; wel hoorbaar durven zijn.',
    low: 'ingehouden',
    high: 'krachtig',
    next: 'Herhaal en varieer één keer zacht-hard-zacht.'
  },
  {
    title: 'Voeg muziek toe',
    prompt: 'Vertel iets simpels alsof je een verhaal voor kinderen levendig maakt. Overdrijf toonhoogte en nadruk.',
    low: 'monotoon',
    high: 'expressief',
    next: 'Kies één zin en geef drie woorden extra kleur.'
  },
  {
    title: 'Pauzeer met regie',
    prompt: 'Vertel 60 seconden en pauzeer na elke paar woorden drie tellen. Blijf kijken tijdens de stilte.',
    low: 'haastig',
    high: 'regisseur',
    next: 'Maak één pauze langer dan comfortabel voelt.'
  },
  {
    title: 'Oogcontactbrug',
    prompt: 'Zeg drie korte boodschappen tegen drie denkbeeldige of echte personen. Eén zin per persoon, echt aankijken.',
    low: 'wegkijken',
    high: 'contact',
    next: 'Herhaal met één zin die je persoonlijker maakt.'
  },
  {
    title: 'Laat gevoel zien',
    prompt: 'Vertel over iets dat je boos, blij of geraakt maakt. Laat 20% meer emotie horen dan je normaal zou doen.',
    low: 'vlak',
    high: 'voelbaar',
    next: 'Noem concreet wat je lichaam deed toen je emotie toeliet.'
  },
  {
    title: 'Vrijwillige hapering',
    prompt: 'Doe drie kleine vrijwillige haperingen in een korte tekst. Blijf rustig, kijk op en ga door met de boodschap.',
    low: 'verstoppen',
    high: 'eigenaar',
    next: 'Maak de hapering bewust iets langer en blijf vriendelijk voor jezelf.'
  },
  {
    title: 'Gebruik je lichaam',
    prompt: 'Leg uit hoe je iets doet en beeld de handelingen uit. Handen, armen en houding mogen meedoen.',
    low: 'vastgezet',
    high: 'bewegend',
    next: 'Maak één gebaar groter dan normaal.'
  },
  {
    title: 'Betrek de luisteraar',
    prompt: 'Stel tijdens je uitleg één vraag aan je luisteraar of laat iemand iets kiezen. Jij houdt de regie.',
    low: 'cocon',
    high: 'interactie',
    next: 'Begin je volgende oefening met een vraag in plaats van een uitleg.'
  },
  {
    title: 'Zet aan tot actie',
    prompt: 'Vraag iemand om één kleine actie: reageren, kiezen, iets proberen of jou feedback geven.',
    low: 'afwachten',
    high: 'activeren',
    next: 'Maak je verzoek concreter: wat moet de ander nu doen?'
  }
];

const drills = [
  {
    title: 'Beeld eerst',
    prompt: 'Kies een voorwerp. Kijk 10 seconden naar kleur, vorm en betekenis. Vertel daarna wat je ziet, zonder zinnen vooraf te maken.',
    target: ['beeld', 'zien', 'betekenis', 'vertel', 'voorwerp'],
    next: 'Maak het kleiner: één beeld, één gedachte, één zin. De woorden hoeven niet eerst door de douane.'
  },
  {
    title: 'Interne blauwdruk',
    prompt: 'Zeg een korte zin eerst in jezelf met lichte mondbeweging, zonder stem. Zeg hem daarna zacht hardop en laat de mond volgen.',
    target: ['intern', 'in mezelf', 'blauwdruk', 'mond volgt', 'zacht'],
    next: 'Let op: je traint niet de perfecte zin. Je traint dat de binnenkant de buitenkant aanstuurt.'
  },
  {
    title: 'Stoplicht stemmotor',
    prompt: 'Doe rood-oranje-groen: eerst rust, dan intern stem klaarzetten, dan trilling toelaten op een zachte klinker en één korte zin.',
    target: ['rood', 'oranje', 'groen', 'stem', 'trilling'],
    next: 'Als je ging luisteren naar hoe je klonk: reset. De focus hoort intern bij stem activeren.'
  },
  {
    title: 'Lettergreepstroom',
    prompt: 'Maak 30 seconden rustige lettergreeppulsen: la-loe-la, ma-me-mo. Voeg daarna één echte zin toe zonder de stroom te breken.',
    target: ['lettergreep', 'stroom', 'puls', 'klinker', 'zin'],
    next: 'De klinker draagt de trilling. De medeklinkers liften mee. Geen spiervergadering in je mond.'
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
    next: 'Kies daarna één zin en zeg hem opnieuw vanuit betekenis, met 10% minder haast.'
  },
  {
    title: 'Buikspreker',
    prompt: 'Vertel 30 seconden met minimale lip- en kaakbeweging. Ontdek dat de stem en de interne zin veel werk al doen.',
    target: ['lip', 'kaak', 'minimale', 'stem', 'intern'],
    next: 'Doel is niet mooi praten. Doel is ervaren dat de mond niet de baas hoeft te zijn.'
  },
  {
    title: 'Schrijven en spreken',
    prompt: 'Vertel over je dag terwijl je tegelijk 1-2-3-4-5 blijft schrijven. De pen blijft gaan; de spraak mag volgen.',
    target: ['schrijf', 'tegelijk', 'cijfers', 'volgen', 'automatisch'],
    next: 'Stopte je met schrijven om te spreken? Dan nam controle het weer over. Prima data. Nog een ronde.'
  },
  {
    title: 'Getuige, geen rechter',
    prompt: 'Vertel over een moeilijk spreekmoment alsof je een sportverslaggever bent: feitelijk, rustig, zonder jezelf af te branden.',
    target: ['feit', 'waarnemen', 'rustig', 'zonder oordeel', 'moment'],
    next: 'Sluit af met één zin: “De volgende keer oefen ik met...”'
  },
  {
    title: 'Echte wereld trigger',
    prompt: 'Kies één trigger vandaag: telefoon, deurklink, koffie, begroeting. Koppel eraan: stem aan, beeld voor woord, boodschap delen.',
    target: ['telefoon', 'trigger', 'begroeting', 'boodschap', 'echte wereld'],
    next: 'Maak het belachelijk klein. Klein gedaan wint van groots bedacht.'
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
const stagePrompt = document.getElementById('stage-prompt');
const stageSelf = document.getElementById('stage-self');
const stageOther = document.getElementById('stage-other');
const stageFeedback = document.getElementById('stage-feedback');
const intentInput = document.getElementById('intent-input');
const intentFeedback = document.getElementById('intent-feedback');
const evidenceInput = document.getElementById('evidence-input');
const evidenceFeedback = document.getElementById('evidence-feedback');
const reportOutput = document.getElementById('report-output');

let currentDrill = drills[0];
let currentStage = stageChallenges[Number(localStorage.getItem(stageKey)) || 0] || stageChallenges[0];
let questionRecognition = null;
let hexRecognition = null;
let drillRecognition = null;
let questionRecording = false;
let hexRecording = false;
let drillRecording = false;

boot();

function boot() {
  renderPhases();
  renderDaily();
  renderStage();
  renderDrill();
  bindEvents();
}

function bindEvents() {
  document.getElementById('ask-coach').addEventListener('click', answerCoach);
  document.getElementById('record-question').addEventListener('click', () => toggleRecording('question'));
  document.getElementById('scan-hex').addEventListener('click', scanHexagon);
  document.getElementById('record-hex').addEventListener('click', () => toggleRecording('hex'));
  document.getElementById('save-hex').addEventListener('click', () => saveLog('moment', hexInput.value));
  document.getElementById('new-stage').addEventListener('click', nextStage);
  document.getElementById('check-stage').addEventListener('click', checkStage);
  document.getElementById('save-stage').addEventListener('click', saveStage);
  stageSelf.addEventListener('input', renderStageValues);
  stageOther.addEventListener('input', renderStageValues);
  document.getElementById('check-intent').addEventListener('click', checkIntent);
  document.getElementById('save-intent').addEventListener('click', () => saveIntent(true));
  document.getElementById('save-evidence').addEventListener('click', saveEvidence);
  document.getElementById('show-evidence').addEventListener('click', showEvidence);
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
  const total = dailySteps.length;
  document.getElementById('alpha-ready').textContent = `${complete}/${total}`;
  document.getElementById('alpha-hint').textContent = complete >= total
    ? 'Dagroute rond. Morgen weer klein beginnen.'
    : `${total - complete} stappen open. Rustig. Geen heldhaftige therapiepose nodig.`;

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

function renderPhases(activeIndex = 0) {
  const done = readJson(phaseKey, {});
  const track = document.getElementById('phase-track');
  const detail = document.getElementById('phase-detail');
  if (!track || !detail) return;
  const phase = processPhases[activeIndex] || processPhases[0];

  track.innerHTML = processPhases.map((item, index) => `
    <button class="stutter-phase-chip ${index === activeIndex ? 'is-active' : ''} ${done[index] ? 'is-done' : ''}" type="button" data-phase="${index}">
      <span>${index + 1}</span>
      ${escapeHtml(item.title)}
    </button>
  `).join('');

  detail.innerHTML = `
    <article>
      <div>
        <p class="stutter-label">Fase ${activeIndex + 1}</p>
        <h4>${escapeHtml(phase.title)}</h4>
      </div>
      <p><strong>Kern:</strong> ${escapeHtml(phase.core)}</p>
      <p><strong>Train:</strong> ${escapeHtml(phase.train)}</p>
      <p><strong>Let op:</strong> ${escapeHtml(phase.watch)}</p>
      <p class="stutter-commitment">${escapeHtml(phase.statement)}</p>
      <button class="btn ${done[activeIndex] ? 'btn--ghost' : 'btn--primary'}" type="button" data-phase-done="${activeIndex}">
        ${done[activeIndex] ? 'Fase geoefend' : 'Markeer als geoefend'}
      </button>
    </article>
  `;

  document.querySelectorAll('[data-phase]').forEach(button => {
    button.addEventListener('click', () => renderPhases(Number(button.dataset.phase)));
  });
  document.querySelector('[data-phase-done]')?.addEventListener('click', button => {
    done[button.currentTarget.dataset.phaseDone] = !done[button.currentTarget.dataset.phaseDone];
    localStorage.setItem(phaseKey, JSON.stringify(done));
    renderPhases(activeIndex);
  });
}

function answerCoach() {
  const question = coachInput.value.trim();
  if (!question) {
    coachAnswer.innerHTML = '<p>Stel eerst een vraag. Stotter Alpha is goed, maar helderziendheid stond niet in het pakket.</p>';
    return;
  }

  const clean = normalize(question);
  let title = 'Coachantwoord';
  let body = 'Begin bij het proces: idee, interne blauwdruk, stem, stroom. Daarna pas beoordelen.';
  let action = 'Actie: zeg één zin opnieuw vanuit het beeld dat je wilt overbrengen.';

  if (matches(clean, ['controle', 'woord', 'mond', 'lip', 'tong', 'klank', 'scannen'])) {
    title = 'Controle is de storing';
    body = 'Normale spraak loopt parallel. Woorden, stem en mondbewegingen tegelijk bewust sturen is te traag en zet het systeem op slot.';
    action = 'Actie: kies één beeld, activeer stem zacht en laat de mond volgen. Niet vooruit keuren.';
  } else if (matches(clean, ['blok', 'vast', 'keel', 'duw', 'pers'])) {
    title = 'Bij blokkeren';
    body = 'Een blokkade groeit wanneer je hem wegduwt. Stop met persen, keer terug naar stem activeren en naar wat je wilt delen.';
    action = 'Actie: rood-oranje-groen: rust, intern klaarzetten, trilling toelaten, dan pas de zin.';
  } else if (matches(clean, ['intern', 'blauwdruk', 'in mijn hoofd', 'gedachte', 'beeld'])) {
    title = 'Interne blauwdruk';
    body = 'De zin begint als gedachte of beeld. De externe spraak is de afdruk daarvan, niet een bouwproject met lippen en tong.';
    action = 'Actie: zeg de zin eerst in jezelf met lichte mondbeweging. Voeg daarna zachte stem toe.';
  } else if (matches(clean, ['stem', 'stemband', 'fonatie', 'gazoo', 'stoplicht', 'trilling'])) {
    title = 'Stemgenerator';
    body = 'Richt je aandacht intern op stem maken. Luisteren naar je eigen klank wordt snel een controlelus.';
    action = 'Actie: train rood-oranje-groen en houd de trilling 10 seconden door terwijl je iets simpels bekijkt.';
  } else if (matches(clean, ['lettergreep', 'rivier', 'stroom', 'puls', 'klinker'])) {
    title = 'Spraak als stroom';
    body = 'De lettergreep is een veilige kleine eenheid. De klinker draagt de stem; medeklinkers liften mee.';
    action = 'Actie: 30 seconden lettergreeppulsen, daarna één zin zonder de stroom te breken.';
  } else if (matches(clean, ['angst', 'schaam', 'paniek', 'bang'])) {
    title = 'Bij spreekangst';
    body = 'Angst trekt je naar feedback: controleren hoe je klinkt. Jouw taak is feedforward: idee, stem, stroom.';
    action = 'Actie: doe een mini-exposure van 20 seconden en scoor alleen: bleef ik bij proces en boodschap?';
  } else if (matches(clean, ['presentatie', 'podium', 'ruimte', 'volume', 'oogcontact', 'pauze', 'publiek'])) {
    title = 'Spreekregie';
    body = 'Publiek reageert vooral op jouw relatie met de ervaring. Neem leiding over ruimte, stem, pauzes, ogen en lichaam.';
    action = 'Actie: doe één Spreekregie-challenge en vergelijk jouw gevoel met wat een luisteraar zag.';
  } else if (matches(clean, ['vrijwillig', 'expres stotteren', 'met opzet', 'hapering'])) {
    title = 'Vrijwillige hapering';
    body = 'Vrijwillig haperen haalt schaamte uit de schaduw. Het doel is eigenaarschap, niet mooi klinken.';
    action = 'Actie: doe drie kleine vrijwillige haperingen en blijf daarna bij oogcontact en boodschap.';
  } else if (matches(clean, ['intentie', 'verwachting', 'verwachtingen', 'belonen', 'motivatie', 'volhouden'])) {
    title = 'Intentie boven verwachting';
    body = 'Verwachtingen maken je afhankelijk van resultaat. Intentie houdt je handelend, ook als de uitkomst rommelig is.';
    action = 'Actie: schrijf intentie, actie, uitkomst, les en beloning in de Intentiecheck.';
  } else if (matches(clean, ['bewijs', 'succes', 'community', 'groep', 'toastmasters', 'oefenpartner', 'alleen'])) {
    title = 'Bewijsbank en steun';
    body = 'Herstel blijft sterker hangen wanneer je positieve ervaringen herhaalt en deelt. Alleen trainen is kwetsbaar.';
    action = 'Actie: bewaar één bewijszin en vraag één mens om simpele feedback.';
  } else if (matches(clean, ['adem', 'lucht', 'inadem'])) {
    title = 'Adem niet als project';
    body = 'Extra adem pakken kan voelen als voorbereiding, maar wordt soms een startsein voor controle. Spraak mag op gewone adem beginnen.';
    action = 'Actie: zeg drie zinnen zonder speciale ademvoorbereiding. Gewoon beginnen. Heel revolutionair, blijkbaar.';
  } else if (matches(clean, ['vermijd', 'ander woord', 'telefoon', 'groep', 'onbekende'])) {
    title = 'Vermijding houdt de dam in stand';
    body = 'Vermijden geeft kort rust en traint lang angst. Kies een mini-situatie waarin je proces belangrijker is dan perfect klinken.';
    action = 'Actie: kies vandaag één echte trigger: groeten, bellen, iets vragen of één woord juist niet vervangen.';
  } else if (matches(clean, ['terugval', 'slechte dag', 'weer mis', 'frustratie'])) {
    title = 'Resetprotocol';
    body = 'Terugval betekent meestal: de oude controlereflex is actief. Dat is informatie, geen vonnis.';
    action = 'Actie: stop, benoem de reflex, activeer stem, kies het beeld en start kleiner opnieuw.';
  } else if (matches(clean, ['oefen', 'training', 'huiswerk', 'snel', '16 minuten'])) {
    title = 'Snel en intensief trainen';
    body = 'Train dagelijks kort en procesgericht. Liever 16 minuten echt dan een uur praten over praten.';
    action = 'Actie: werk de dagroute af en bewaar één log. Morgen dezelfde route, iets echter.';
  } else if (matches(clean, ['rapport', 'voortgang', 'analyse'])) {
    title = 'Voortgang meten';
    body = 'Meet proceskeuze: blauwdruk, stem, stroom, minder vermijding en herstel na controle. Niet alleen haperingen tellen.';
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
  hexNote.textContent = 'Scan klaar. Kies één rood punt, niet alle zes. Focus wint van fanatisme.';
}

function renderStage() {
  if (!stagePrompt) return;
  stagePrompt.textContent = `${currentStage.title}: ${currentStage.prompt}`;
  renderStageValues();
}

function renderStageValues() {
  document.getElementById('stage-self-value').textContent = stageSelf.value;
  document.getElementById('stage-other-value').textContent = stageOther.value;
}

function nextStage() {
  const index = stageChallenges.findIndex(challenge => challenge.title === currentStage.title);
  const nextIndex = (index + 1) % stageChallenges.length;
  currentStage = stageChallenges[nextIndex];
  localStorage.setItem(stageKey, String(nextIndex));
  stageSelf.value = 5;
  stageOther.value = 5;
  stageFeedback.innerHTML = '';
  renderStage();
}

function checkStage() {
  const self = Number(stageSelf.value);
  const other = Number(stageOther.value);
  const gap = self - other;
  const meaning = Math.abs(gap) <= 1
    ? 'Je zelfbeeld en externe feedback liggen dicht bij elkaar. Mooi: dan kun je scherper trainen.'
    : gap > 1
      ? 'Jij ervoer jezelf groter dan anderen je zagen. Dat is klassiek: je interne alarm overdrijft het effect.'
      : 'Anderen zagen meer regie dan jij voelde. Noteer dit als bewijs tegen je oude verwachting.';
  const verdict = other >= 7
    ? 'Je nam zichtbaar ruimte. Herhaal dit in een iets echtere situatie.'
    : other >= 5
      ? 'Prima middengebied. Voeg 10% meer ruimte, stem, pauze of contact toe.'
      : 'Te veilig gespeeld. De challenge moet licht ongemakkelijk worden; anders traint hij weinig.';

  stageFeedback.innerHTML = `
    <div class="stutter-feedback-head">
      <h3>${escapeHtml(currentStage.title)}</h3>
      <strong>${self}/${other}</strong>
    </div>
    ${panel('Perceptieverschil', meaning)}
    ${panel('Coach', verdict)}
    ${panel('Volgende ronde', currentStage.next)}
  `;
}

function saveStage() {
  const self = Number(stageSelf.value);
  const other = Number(stageOther.value);
  const text = `Spreekregie: ${currentStage.title}. Mijn gevoel ${self}/10, anderen zagen ${other}/10. Ik oefende: ${currentStage.prompt}`;
  saveLog('stage', text);
  stageFeedback.innerHTML = `
    ${panel('Bewaard', 'Spreekregie-ervaring opgeslagen in je rapport. Dit is bewijsbank-materiaal.')}
    ${panel('Toepassing', 'Doe deze challenge later buiten de oefenkamer: thuis, studie, werk of telefoon.')}
  `;
}

function checkIntent() {
  const text = intentInput.value.trim();
  if (!text) {
    intentFeedback.innerHTML = '<p class="stutter-note">Schrijf eerst intentie, actie, uitkomst, les en beloning.</p>';
    return;
  }
  const clean = normalize(text);
  const hasIntent = matches(clean, ['intentie', 'bedoeling', 'ik wilde', 'mijn doel']);
  const hasAction = matches(clean, ['ik deed', 'actie', 'gevraagd', 'gebeld', 'gezegd', 'geoefend']);
  const hasOutcome = matches(clean, ['uitkomst', 'resultaat', 'gebeurde', 'ging']);
  const hasLesson = matches(clean, ['leer', 'volgende', 'data', 'merkte', 'ontdekte']);
  const hasReward = matches(clean, ['beloning', 'beloon', 'trots', 'vier', 'ijs', 'pauze']);
  const score = [hasIntent, hasAction, hasOutcome, hasLesson, hasReward].filter(Boolean).length;
  const missing = [
    ...(hasIntent ? [] : ['formuleer je intentie']),
    ...(hasAction ? [] : ['beschrijf je concrete actie']),
    ...(hasOutcome ? [] : ['noem de uitkomst zonder drama']),
    ...(hasLesson ? [] : ['haal er één les uit']),
    ...(hasReward ? [] : ['kies een kleine beloning voor intentie volgen'])
  ];

  intentFeedback.innerHTML = `
    <div class="stutter-feedback-head">
      <h3>${score >= 5 ? 'Intentie gevolgd' : score >= 3 ? 'Bijna compleet' : 'Nog te vaag'}</h3>
      <strong>${score}/5</strong>
    </div>
    ${scanHtml({
      good: [
        ...(hasIntent ? ['intentie benoemd'] : []),
        ...(hasAction ? ['actie beschreven'] : []),
        ...(hasOutcome ? ['uitkomst genoteerd'] : []),
        ...(hasLesson ? ['les gehaald'] : []),
        ...(hasReward ? ['beloning gekozen'] : [])
      ],
      missing,
      vague: score >= 5 ? ['Beoordeel jezelf vandaag op moed en richting, niet op perfect geluid.'] : ['Maak het toetsbaar: wat deed je precies?']
    })}
    ${panel('Coach', score >= 5 ? 'Goed. Bewaar dit. Je bouwt een identiteit die handelt ondanks spanning.' : 'Vul de ontbrekende delen aan en druk daarna op Bewaar intentie.')}
  `;
}

function saveIntent(showMessage = false) {
  const text = intentInput.value.trim();
  if (!text) {
    intentFeedback.innerHTML = '<p class="stutter-note">Nog niets om te bewaren.</p>';
    return false;
  }
  saveLog('intent', text);
  if (showMessage) {
    intentFeedback.innerHTML = `
      ${panel('Intentie bewaard', 'Je hebt de poging niet beoordeeld als winst/verlies, maar als richting. Dat is precies het punt.')}
      ${panel('Vraag voor morgen', 'Welke glazen wand neem jij nog aan als waarheid? Kies daar één mini-experiment bij.')}
    `;
  }
  return true;
}

function saveEvidence() {
  const text = evidenceInput.value.trim();
  if (!text) {
    evidenceFeedback.innerHTML = '<p class="stutter-note">Schrijf eerst één bewijszin. Klein bewijs telt ook.</p>';
    return;
  }
  saveLog('evidence', text);
  evidenceInput.value = '';
  evidenceFeedback.innerHTML = `
    ${panel('Bewijs opgeslagen', 'Dit is materiaal voor je nieuwe zelfbeeld: iemand die blijft communiceren ondanks spanning.')}
    ${panel('Volgende actie', 'Maak het bewijs morgen iets socialer: één luisteraar, één vraag of één feedbackmoment.')}
  `;
}

function showEvidence() {
  const logs = readJson(storageKey, []).filter(log => ['evidence', 'intent', 'stage'].includes(log.type));
  if (!logs.length) {
    evidenceFeedback.innerHTML = '<p class="stutter-note">Nog geen bewijs. Bewaar vandaag één kleine actie.</p>';
    return;
  }
  evidenceFeedback.innerHTML = logs.slice(0, 6).map(log => `
    <article>
      <h4>${escapeHtml(logLabel(log.type))}</h4>
      <p>${escapeHtml(log.text)}</p>
    </article>
  `).join('');
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
  const hasProcess = matches(clean, ['intern', 'stem', 'stroom', 'lettergreep', 'proces', 'trilling', 'automatisch']);
  const hasBody = matches(clean, ['keel', 'kaak', 'adem', 'buik', 'spanning', 'rust', 'lichaam']);
  const hasReflection = matches(clean, ['merkte', 'voelde', 'zag', 'volgende', 'opnieuw', 'minder controle', 'reset']);
  const score = [targetHits.length > 0, hasMeaning, hasProcess, hasBody, hasReflection].filter(Boolean).length;
  const missing = [
    ...(targetHits.length ? [] : ['noem wat je concreet oefende']),
    ...(hasMeaning ? [] : ['koppel aan betekenis/contact']),
    ...(hasProcess ? [] : ['noem het proces: interne spraak, stem, stroom of automatisme']),
    ...(hasBody ? [] : ['noem één lichamelijk signaal']),
    ...(hasReflection ? [] : ['sluit af met wat je volgende keer doet'])
  ];

  drillFeedback.innerHTML = `
    <div class="stutter-feedback-head">
      <h3>${score >= 5 ? 'Alpha-waardig' : score >= 4 ? 'Bijna raak' : 'Maak concreet'}</h3>
      <strong>${score}/5</strong>
    </div>
    ${scanHtml({
      good: [
        ...(targetHits.length ? [`oefenfocus: ${currentDrill.title}`] : []),
        ...(hasMeaning ? ['betekenis/contact genoemd'] : []),
        ...(hasProcess ? ['proces benoemd'] : []),
        ...(hasBody ? ['lichaamssignaal benoemd'] : []),
        ...(hasReflection ? ['reflectie of vervolgstap'] : [])
      ],
      missing,
      vague: score >= 5 ? [] : ['Niet bewijzen dat het goed ging. Beschrijf proces, waarneming en volgende keuze.']
    })}
    ${panel('Coach', score >= 5 ? 'Goed. Herhaal dezelfde oefening nu met 10% meer echte communicatie.' : currentDrill.next)}
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
  const stageLogs = logs.filter(log => log.type === 'stage').length;
  const intentLogs = logs.filter(log => log.type === 'intent').length;
  const evidenceLogs = logs.filter(log => log.type === 'evidence').length;
  const processHits = [
    ['Interne blauwdruk', ['intern', 'blauwdruk', 'beeld', 'gedachte']],
    ['Stemgenerator', ['stem', 'trilling', 'fonatie', 'stoplicht']],
    ['Spraakstroom', ['lettergreep', 'stroom', 'puls', 'klinker']],
    ['Spreekregie', ['ruimte', 'volume', 'pauze', 'oogcontact', 'publiek', 'spreekregie']],
    ['Intentie', ['intentie', 'beloning', 'verwachting', 'actie']],
    ['Transfer', ['telefoon', 'groep', 'onbekende', 'begroeting', 'echte wereld']]
  ].filter(([, words]) => words.some(word => all.includes(normalize(word)))).map(([name]) => name);

  reportOutput.innerHTML = `
    <article>
      <h4>Zeshoek-status</h4>
      <p>Je logs raken vooral: ${escapeHtml(hitNames.join(', ') || 'nog geen duidelijke categorieën')}. Voeg komende week bewust de ontbrekende onderdelen toe.</p>
    </article>
    <article>
      <h4>Processtatus</h4>
      <p>Je traint zichtbaar: ${escapeHtml(processHits.join(', ') || 'nog weinig proceswoorden')}. Zorg dat elke log één route raakt: blauwdruk, stem, stroom, spreekregie, intentie of transfer.</p>
    </article>
    <article>
      <h4>Harrison-laag</h4>
      <p>Spreekregie: ${stageLogs}. Intentiechecks: ${intentLogs}. Bewijsbank: ${evidenceLogs}. Streef komende week naar minimaal één van elk.</p>
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
    <article>
      <h4>Mini-experiment</h4>
      <p>${escapeHtml(recommendExperiment(all))}</p>
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
  if (matches(clean, ['woord scannen', 'scannen', 'moeilijk woord', 'lastig woord'])) return 'woordscannen: je brein probeert vooraf te keuren wat automatisch moet ontstaan';
  if (matches(clean, ['mond', 'lip', 'tong', 'kaak controleren'])) return 'mondmonitoring: de articulatie krijgt de leiding terwijl die juist mag volgen';
  if (matches(clean, ['ik moet', 'perfect', 'mag niet', 'niet stotteren'])) return 'de regel dat spreken pas goed is als het foutloos is';
  if (matches(clean, ['klein maken', 'zacht praten', 'niet opvallen', 'ruimte', 'macht', 'dominant'])) return 'zelfverkleining: je probeert tegelijk zichtbaar en onzichtbaar te zijn';
  if (matches(clean, ['verwachting', 'mislukken', 'resultaat', 'falen'])) return 'verwachtingssturing: de uitkomst krijgt meer macht dan je intentie';
  if (matches(clean, ['eerst adem', 'lucht pakken', 'diep adem'])) return 'de overtuiging dat spreken speciale ademvoorbereiding nodig heeft';
  if (matches(clean, ['duw', 'pers', 'forceer'])) return 'fysiek forceren waardoor de spreekstroom smaller wordt';
  if (matches(clean, ['vermijd', 'niet zeggen', 'ander woord'])) return 'vermijding die op korte termijn rust geeft en op lange termijn de angst voedt';
  if (matches(clean, ['luisteren naar mezelf', 'hoe ik klink', 'beoordelen'])) return 'feedbackcontrole: je luistert naar het resultaat terwijl het proces nog bezig is';
  if (matches(clean, ['beoordeling', 'kijken', 'luisteren', 'raar'])) return 'spreken als optreden';
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
  if (matches(clean, ['ruimte', 'volume', 'pauze', 'oogcontact', 'publiek'])) return 'Doe Spreekregie: kies één challenge en vergelijk jouw gevoel met feedback van een luisteraar.';
  if (matches(clean, ['intentie', 'verwachting', 'beloning'])) return 'Doe Intentiecheck: intentie, actie, uitkomst, les en beloning. Beoordeel niet op perfectie.';
  if (matches(clean, ['bewijs', 'succes', 'trots'])) return 'Vul de Bewijsbank: één zin over wat je deed ondanks spanning.';
  if (matches(clean, ['intern', 'blauwdruk', 'beeld'])) return 'Oefen interne blauwdruk: zin eerst in jezelf, lichte mondbeweging, daarna zachte stem.';
  if (matches(clean, ['stem', 'trilling', 'fonatie'])) return 'Oefen stoplicht stemmotor: rust, intern klaarzetten, trilling toelaten.';
  if (matches(clean, ['lettergreep', 'stroom', 'puls'])) return 'Oefen lettergreepstroom: betekenisloze pulsen, daarna één echte zin.';
  if (matches(clean, ['scannen', 'woord', 'klank', 'letter'])) return 'Oefen mentale film: spreek vanuit voorstelling en betekenis, zonder woordkeuring vooraf.';
  if (matches(clean, ['adem', 'lucht'])) return 'Oefen “gewone start”: drie korte zinnen zonder speciale ademvoorbereiding.';
  if (matches(clean, ['angst', 'schaam'])) return 'Oefen een mini-exposure: 20 seconden echte communicatie met lage inzet.';
  if (matches(clean, ['duw', 'keel', 'pers'])) return 'Oefen zachte doorlopende stemactivatie en laat de zin daaruit ontstaan.';
  if (matches(clean, ['vermijd', 'telefoon', 'groep'])) return 'Oefen echte wereld trigger: één kleine situatie kiezen en achteraf alleen het proces scoren.';
  return 'Oefen de rivierzin: “Wat ik eigenlijk wil zeggen is...” en blijf bij de boodschap.';
}

function recommendExperiment(clean) {
  if (matches(clean, ['telefoon', 'bellen'])) return 'Bel één veilige persoon en open met één zin die je niet vooraf repeteert.';
  if (matches(clean, ['groep', 'publiek', 'presentatie'])) return 'Stel in een groep één vraag en houd daarna twee tellen pauze.';
  if (matches(clean, ['schaam', 'vrijwillig', 'hapering'])) return 'Doe één kleine vrijwillige hapering bij een veilige luisteraar en blijf in oogcontact.';
  if (matches(clean, ['zacht', 'volume', 'klein'])) return 'Zeg vandaag één bestelling, groet of mening 20% sterker dan normaal.';
  if (matches(clean, ['vermijd', 'ander woord'])) return 'Gebruik vandaag één woord dat je normaal zou vervangen. Score alleen: deed ik het?';
  return 'Kies vandaag één gewone situatie en volg je intentie: groeten, vragen, bellen of kort iets delen.';
}

function logLabel(type) {
  return {
    evidence: 'Bewijsbank',
    intent: 'Intentiecheck',
    stage: 'Spreekregie',
    moment: 'Zeshoekmoment',
    freewrite: 'Vrij schrijven'
  }[type] || 'Log';
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
      <strong>Alpha-scan</strong>
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
    config.recognition.onerror = event => {
      config.recording = false;
      config.button.textContent = 'Spreek in';
      setRecordingNote(type, config.note, recognitionErrorMessage(event.error, 'Spreek in'));
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
  try {
    config.recognition.start();
  } catch {
    config.recording = false;
    config.button.textContent = 'Spreek in';
    setRecordingNote(type, config.note, 'De opname kon niet starten. Klik nog één keer op Spreek in of typ je tekst.');
  }
}

function setRecordingNote(type, note, message) {
  if (type === 'question') {
    note.innerHTML = `<p>${escapeHtml(message)}</p>`;
    return;
  }
  note.textContent = message;
}

function recognitionErrorMessage(error, actionLabel = 'Spreek in') {
  const messages = {
    'not-allowed': 'Microfoon niet toegestaan. Geef microfoontoegang in de browser of typ je tekst.',
    'audio-capture': 'Geen microfoon gevonden. Controleer je microfoon of typ je tekst.',
    network: 'Spraakherkenning krijgt geen verbinding. Typ je tekst of probeer Chrome/Edge.',
    'no-speech': `Ik hoorde geen spraak. Klik opnieuw op ${actionLabel} en spreek iets dichter bij de microfoon.`,
    aborted: 'Opname gestopt.'
  };
  return messages[error] || 'Opname werkt hier niet goed. Typ je tekst of probeer Chrome/Edge.';
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
