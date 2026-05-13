'use strict';

const STORAGE_KEY = 'schlichting_private_data_v1';
const SCORE_KEY = 'schlichting_private_scores_v1';
const PREP_KEY = 'schlichting_private_prep_v1';

const NOTEBOOK_PROMPT = `Je bent bronextractor voor mijn privé Schlichting-toetstrainer. Gebruik uitsluitend de geüploade Schlichting-handleiding, scans, scoreformulieren en toetsinformatie. Werk exact waar exacte afname-instructies nodig zijn. Geef bij elke regel een bronverwijzing, paginanummer of scanverwijzing.

Maak output als geldige JSON volgens schema schlichting-v1. Gebruik dubbele aanhalingstekens en geen Markdown rondom de JSON.

Verplichte hoofdstructuur:
{
  "schema": "schlichting-v1",
  "title": "...",
  "sourceNote": "...",
  "taalbegrip": {
    "rules": {
      "ageRange": "...",
      "setup": ["..."],
      "startRules": [
        {
          "minMonths": 24,
          "maxMonths": 35,
          "label": "...",
          "startItem": 1,
          "returnRule": "...",
          "stopRule": "..."
        }
      ],
      "returnRule": "...",
      "stopRule": "..."
    },
    "sections": [
      {
        "id": "...",
        "title": "...",
        "goal": "...",
        "instruction": "...",
        "source": "..."
      }
    ],
    "items": [
      {
        "id": "TB-1",
        "number": 1,
        "section": "...",
        "script": "exacte testleiderzin",
        "material": "...",
        "correct": "...",
        "incorrect": "...",
        "scoring": "...",
        "repeat": "...",
        "forbiddenHelp": "...",
        "pitfalls": ["..."],
        "source": "..."
      }
    ]
  },
  "zinsontwikkeling": {
    "rules": {
      "setup": ["..."],
      "startRules": [
        {
          "minMonths": 36,
          "maxMonths": 84,
          "label": "...",
          "startItem": 1,
          "returnRule": "...",
          "stopRule": "..."
        }
      ],
      "stopRule": "..."
    },
    "items": [
      {
        "id": "ZO-1",
        "number": 1,
        "script": "exacte stimuluszin",
        "target": "morfosyntactisch criterium",
        "correctExamples": ["..."],
        "incorrectExamples": ["..."],
        "scoring": "...",
        "repeat": "...",
        "intonation": "...",
        "pitfalls": ["..."],
        "source": "..."
      }
    ]
  },
  "rubric": {
    "criteria": [
      {
        "id": "...",
        "title": "...",
        "description": "...",
        "source": "..."
      }
    ]
  },
  "zgScripts": [
    {
      "id": "...",
      "title": "...",
      "coach": "...",
      "script": "...",
      "source": "..."
    }
  ]
}

Deel 1: Schlichting Taalbegrip
Verzamel leeftijdsbereik, startregels, terugkeerregels, afbreekregels, testsituatie, materiaal, zichtbaarheid, houding testleider, neutraliteit, secties, exacte itemzinnen, correcte responsen, foutresponsen, scoring, toegestane herhaling, verboden hulp, valkuilen en toetsverantwoording.

Deel 2: Schlichting Taalproductie-3 Zinsontwikkeling
Verzamel algemene instructie, oefenitems, exacte stimuluszinnen, doelconstructies, morfosyntactische criteria, correcte/incorrecte voorbeelden, scoring, herhaling, intonatie/prosodie, valkuilen, onderscheid met articulatie/fonologie en toetsverantwoording.

Deel 3: ZG-checklist
Maak criteria voor neutraal aanbieden, exact formuleren, juist starten, juist afbreken, juist scoren, impulsief kindgedrag begrenzen, eigen fout herkennen, betrouwbaarheid/validiteit benoemen.

Deel 4: Onduidelijkheden
Noem niets in de JSON dat je niet uit de bron kunt halen. Zet twijfel in sourceNote of in het relevante source-veld. Verzin niets.`;

const DEFAULT_PREP = [
  {
    id: 'situatie',
    title: '1. Testsituatie',
    body: 'Noem opstelling, zichtbaarheid van materiaal, neutrale houding en waarom dat de respons zuiver houdt.',
    starter: 'Ik zet de testsituatie rustig neer en laat alleen noodzakelijk materiaal zichtbaar zijn...'
  },
  {
    id: 'start',
    title: '2. Startpunt',
    body: 'Bereken leeftijd, kies startitem, benoem terugkeerregel en bewaak afbreekregel.',
    starter: 'Op basis van de kalenderleeftijd start ik bij...'
  },
  {
    id: 'begrip',
    title: '3. Taalbegrip',
    body: 'Oefen exacte itemzin, neutrale intonatie, geen extra hulp, direct scoren.',
    starter: 'Bij Taalbegrip bied ik de zin exact en neutraal aan...'
  },
  {
    id: 'zins',
    title: '4. Zinsontwikkeling',
    body: 'Oefen stimuluszin, doelconstructie, morfosyntaxis versus articulatie.',
    starter: 'Bij Zinsontwikkeling beoordeel ik de doelconstructie...'
  },
  {
    id: 'score',
    title: '5. Scoring',
    body: 'Koppel respons aan criterium. Noem wat je doet bij twijfel of impulsief reageren.',
    starter: 'Ik scoreer dit als... omdat...'
  },
  {
    id: 'fout',
    title: '6. Eigen fout',
    body: 'Benoem concreet je fout, mogelijke invloed en conclusie voor betrouwbaarheid/validiteit.',
    starter: 'Ik merk dat ik hier afweek van de instructie...'
  }
];

const SCALE = [
  { value: 0, label: 'O' },
  { value: 1, label: 'BV' },
  { value: 2, label: 'V' },
  { value: 3, label: 'G' },
  { value: 4, label: 'ZG' }
];

const state = {
  view: 'import',
  data: readData(),
  scores: readJson(SCORE_KEY, []),
  prep: readJson(PREP_KEY, {}),
  itemIndex: {
    taalbegrip: 0,
    zinsontwikkeling: 0
  },
  simPart: 'setup',
  secondsLeft: 15 * 60,
  timer: null
};

const els = {
  status: document.getElementById('data-status'),
  importText: document.getElementById('import-text'),
  validation: document.getElementById('validation-panel'),
  prompt: document.getElementById('notebook-prompt'),
  prepGrid: document.getElementById('prep-grid'),
  timerDisplay: document.getElementById('timer-display'),
  timerToggle: document.getElementById('timer-toggle'),
  birthDate: document.getElementById('birth-date'),
  testDate: document.getElementById('test-date'),
  wizardResult: document.getElementById('wizard-result'),
  taalbegrip: document.getElementById('taalbegrip-cockpit'),
  zinsontwikkeling: document.getElementById('zinsontwikkeling-cockpit'),
  scriptList: document.getElementById('script-list'),
  simPart: document.getElementById('simulation-part'),
  simCard: document.getElementById('simulation-card'),
  simScore: document.getElementById('simulation-score'),
  dashboard: document.getElementById('dashboard')
};

boot();

function boot() {
  els.prompt.textContent = NOTEBOOK_PROMPT;
  if (state.data) {
    els.importText.value = JSON.stringify(state.data, null, 2);
  }
  bindEvents();
  renderAll();
}

function bindEvents() {
  document.querySelectorAll('.sch-tab').forEach(tab => {
    tab.addEventListener('click', () => showView(tab.dataset.view));
  });

  document.getElementById('load-example').addEventListener('click', () => {
    els.importText.value = JSON.stringify(window.SCHLICHTING_EXAMPLE_DATA, null, 2);
    importData();
  });

  document.getElementById('import-data').addEventListener('click', importData);
  document.getElementById('export-data').addEventListener('click', exportData);
  document.getElementById('clear-data').addEventListener('click', clearData);
  document.getElementById('copy-prompt').addEventListener('click', copyPrompt);
  document.getElementById('privacy-check').addEventListener('click', privacyCheck);
  document.getElementById('calculate-age').addEventListener('click', renderWizard);
  els.timerToggle.addEventListener('click', toggleTimer);

  document.querySelectorAll('[data-next]').forEach(button => {
    button.addEventListener('click', () => moveItem(button.dataset.next, 1));
  });
  document.querySelectorAll('[data-prev]').forEach(button => {
    button.addEventListener('click', () => moveItem(button.dataset.prev, -1));
  });

  els.simPart.addEventListener('change', () => {
    state.simPart = els.simPart.value;
    renderSimulation();
  });
}

function renderAll() {
  renderStatus();
  renderValidation();
  renderPrep();
  renderTimer();
  renderCockpit('taalbegrip');
  renderCockpit('zinsontwikkeling');
  renderScripts();
  renderSimulation();
  renderDashboard();
}

function showView(view) {
  state.view = view;
  document.querySelectorAll('.sch-tab').forEach(tab => {
    tab.classList.toggle('is-active', tab.dataset.view === view);
  });
  document.querySelectorAll('.sch-view').forEach(section => {
    section.classList.toggle('is-active', section.id === `view-${view}`);
  });
}

function renderStatus() {
  const data = state.data;
  const begripCount = data?.taalbegrip?.items?.length || 0;
  const zinsCount = data?.zinsontwikkeling?.items?.length || 0;
  const source = data?.sourceNote || 'Nog geen privédata geïmporteerd.';
  els.status.innerHTML = `
    <div>
      <span>Privédata</span>
      <strong>${data ? 'Actief' : 'Leeg'}</strong>
    </div>
    <span>${escapeHtml(begripCount)} Taalbegrip-items · ${escapeHtml(zinsCount)} Zinsontwikkeling-items</span>
    <span>${escapeHtml(source)}</span>
  `;
}

function importData() {
  try {
    const parsed = JSON.parse(els.importText.value);
    const validation = validateData(parsed);
    if (validation.errors.length) {
      els.validation.innerHTML = validationHtml(validation);
      return;
    }
    state.data = parsed;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    els.validation.innerHTML = validationHtml(validation);
    renderAll();
  } catch (error) {
    els.validation.innerHTML = `<div class="sch-alert"><strong>JSON lukt nog niet.</strong><br>${escapeHtml(error.message)}</div>`;
  }
}

function exportData() {
  if (!state.data) {
    els.validation.innerHTML = '<div class="sch-warn"><strong>Nog niets te exporteren.</strong><br>Importeer eerst je privédata.</div>';
    return;
  }
  const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'schlichting-privedata-backup.json';
  link.click();
  URL.revokeObjectURL(url);
}

function clearData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SCORE_KEY);
  localStorage.removeItem(PREP_KEY);
  state.data = null;
  state.scores = [];
  state.prep = {};
  els.importText.value = '';
  els.validation.innerHTML = '<div class="sch-ok"><strong>Privédata gewist.</strong><br>Import, prepnotities en scores zijn uit deze browser verwijderd.</div>';
  renderAll();
}

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(NOTEBOOK_PROMPT);
    els.validation.innerHTML = '<div class="sch-ok"><strong>Prompt gekopieerd.</strong><br>Plak deze in NotebookLM bij je Schlichting-bronnen.</div>';
  } catch {
    els.validation.innerHTML = '<div class="sch-warn"><strong>Kopiëren lukte niet automatisch.</strong><br>Selecteer de prompt hieronder handmatig.</div>';
  }
}

function privacyCheck() {
  const message = [
    'Privacycheck:',
    '1. Officiële Schlichting-items staan niet in de repo.',
    '2. Importdata staat alleen in localStorage van deze browser.',
    '3. Wis privédata verwijdert de lokale import.',
    '4. Gebruik geen gedeelde computer zonder daarna te wissen.'
  ].join('\n');
  window.alert(message);
}

function validateData(data) {
  const errors = [];
  const warnings = [];
  if (!data || typeof data !== 'object') errors.push('De import moet een JSON-object zijn.');
  if (data?.schema !== 'schlichting-v1') errors.push('schema moet exact "schlichting-v1" zijn.');
  if (!Array.isArray(data?.taalbegrip?.items)) errors.push('taalbegrip.items ontbreekt of is geen lijst.');
  if (!Array.isArray(data?.zinsontwikkeling?.items)) errors.push('zinsontwikkeling.items ontbreekt of is geen lijst.');
  if (!Array.isArray(data?.rubric?.criteria)) warnings.push('rubric.criteria ontbreekt; scorecoach wordt minder precies.');
  if (!Array.isArray(data?.zgScripts)) warnings.push('zgScripts ontbreekt; scriptcoach wordt minder bruikbaar.');

  validateItems(data?.taalbegrip?.items || [], 'Taalbegrip', ['number', 'script', 'scoring', 'source'], warnings);
  validateItems(data?.zinsontwikkeling?.items || [], 'Zinsontwikkeling', ['number', 'script', 'scoring', 'source'], warnings);

  return { errors, warnings };
}

function validateItems(items, label, fields, warnings) {
  const numbers = new Set();
  items.forEach((item, index) => {
    fields.forEach(field => {
      if (!item[field]) warnings.push(`${label} item ${index + 1}: ${field} ontbreekt.`);
    });
    if (item.number && numbers.has(item.number)) warnings.push(`${label}: itemnummer ${item.number} komt dubbel voor.`);
    if (item.number) numbers.add(item.number);
  });
}

function renderValidation() {
  if (!state.data) {
    els.validation.innerHTML = '<div class="sch-warn"><strong>Importeer je privé Schlichting-data.</strong><br>Zonder import toont deze tool alleen de prompt en fictieve testdata.</div>';
    return;
  }
  els.validation.innerHTML = validationHtml(validateData(state.data));
}

function validationHtml(validation) {
  if (validation.errors.length) {
    return `
      <div class="sch-alert"><strong>Import gestopt.</strong><br>${validation.errors.map(escapeHtml).join('<br>')}</div>
      ${validation.warnings.length ? `<div class="sch-warn"><strong>Waarschuwingen</strong><br>${validation.warnings.map(escapeHtml).join('<br>')}</div>` : ''}
    `;
  }
  if (validation.warnings.length) {
    return `<div class="sch-warn"><strong>Import kan, maar check dit nog.</strong><br>${validation.warnings.map(escapeHtml).join('<br>')}</div>`;
  }
  return '<div class="sch-ok"><strong>Import compleet.</strong><br>Schema klopt globaal en de cockpit kan ermee trainen.</div>';
}

function renderPrep() {
  els.prepGrid.innerHTML = DEFAULT_PREP.map(item => `
    <article class="sch-prep-item">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.body)}</p>
      <textarea data-prep="${escapeHtml(item.id)}" placeholder="${escapeHtml(item.starter)}">${escapeHtml(state.prep[item.id] || '')}</textarea>
    </article>
  `).join('');

  els.prepGrid.querySelectorAll('[data-prep]').forEach(area => {
    area.addEventListener('input', () => {
      state.prep[area.dataset.prep] = area.value;
      localStorage.setItem(PREP_KEY, JSON.stringify(state.prep));
    });
  });
}

function toggleTimer() {
  if (state.timer) {
    clearInterval(state.timer);
    state.timer = null;
    els.timerToggle.textContent = 'Start';
    return;
  }
  els.timerToggle.textContent = 'Pauze';
  state.timer = setInterval(() => {
    state.secondsLeft = Math.max(0, state.secondsLeft - 1);
    renderTimer();
    if (state.secondsLeft === 0) toggleTimer();
  }, 1000);
}

function renderTimer() {
  const minutes = String(Math.floor(state.secondsLeft / 60)).padStart(2, '0');
  const seconds = String(state.secondsLeft % 60).padStart(2, '0');
  els.timerDisplay.textContent = `${minutes}:${seconds}`;
}

function renderWizard() {
  const birth = els.birthDate.valueAsDate;
  const test = els.testDate.valueAsDate || new Date();
  if (!birth) {
    els.wizardResult.innerHTML = '<div class="sch-warn">Vul eerst een geboortedatum in.</div>';
    return;
  }
  const age = calculateAge(birth, test);
  const months = age.years * 12 + age.months;
  const begripRule = findStartRule(state.data?.taalbegrip?.rules?.startRules, months);
  const zinsRule = findStartRule(state.data?.zinsontwikkeling?.rules?.startRules, months);
  els.wizardResult.innerHTML = `
    <h3>Leeftijd: ${age.years};${String(age.months).padStart(2, '0')} jaar (${months} maanden)</h3>
    <div class="sch-cockpit-grid">
      ${startRuleHtml('Taalbegrip', begripRule)}
      ${startRuleHtml('Zinsontwikkeling', zinsRule)}
    </div>
  `;
}

function calculateAge(birth, test) {
  let years = test.getFullYear() - birth.getFullYear();
  let months = test.getMonth() - birth.getMonth();
  if (test.getDate() < birth.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months };
}

function findStartRule(rules = [], months) {
  return rules.find(rule => months >= Number(rule.minMonths) && months <= Number(rule.maxMonths)) || null;
}

function startRuleHtml(label, rule) {
  if (!rule) {
    return `<article class="sch-mini"><strong>${escapeHtml(label)}</strong><p>Geen passende startregel gevonden in je import.</p></article>`;
  }
  return `
    <article class="sch-mini">
      <strong>${escapeHtml(label)} · ${escapeHtml(rule.label || 'startregel')}</strong>
      <p>Startitem: ${escapeHtml(rule.startItem ?? 'onbekend')}</p>
      <p>Terugkeer: ${escapeHtml(rule.returnRule || 'niet ingevuld')}</p>
      <p>Afbreken: ${escapeHtml(rule.stopRule || 'niet ingevuld')}</p>
    </article>
  `;
}

function renderCockpit(type) {
  const target = els[type];
  const items = getItems(type);
  if (!state.data || !items.length) {
    target.innerHTML = emptyStateHtml(type);
    return;
  }
  const index = clamp(state.itemIndex[type], 0, items.length - 1);
  state.itemIndex[type] = index;
  const item = items[index];
  const isTaalbegrip = type === 'taalbegrip';
  const title = isTaalbegrip ? `Item ${item.number}` : `Zinsontwikkeling ${item.number}`;
  const secondaryFacts = isTaalbegrip
    ? [
        ['Materiaal', item.material],
        ['Correct', item.correct],
        ['Fout', item.incorrect],
        ['Herhalen', item.repeat],
        ['Verboden hulp', item.forbiddenHelp]
      ]
    : [
        ['Doelconstructie', item.target],
        ['Correcte voorbeelden', listText(item.correctExamples)],
        ['Incorrecte voorbeelden', listText(item.incorrectExamples)],
        ['Herhalen', item.repeat],
        ['Intonatie', item.intonation]
      ];

  target.innerHTML = `
    <div class="sch-cockpit-grid">
      <article class="sch-item-card">
        <p class="sch-label">${escapeHtml(index + 1)} van ${escapeHtml(items.length)}</p>
        <h3>${escapeHtml(title)}</h3>
        <div class="sch-script-line">${escapeHtml(item.script || 'Geen script in import.')}</div>
        <div class="sch-facts">
          ${factHtml('Scoring', item.scoring)}
          ${factHtml('Bron', item.source)}
        </div>
        ${scoreButtons(`${type}:${item.number}`, `${type} item ${item.number}`)}
      </article>
      <aside class="sch-item-card">
        <p class="sch-label">Waar je op let</p>
        <div class="sch-facts">
          ${secondaryFacts.map(([key, value]) => factHtml(key, value)).join('')}
          ${factHtml('Valkuilen', listText(item.pitfalls))}
        </div>
      </aside>
    </div>
  `;
  bindScoreButtons();
}

function getItems(type) {
  return type === 'taalbegrip'
    ? state.data?.taalbegrip?.items || []
    : state.data?.zinsontwikkeling?.items || [];
}

function moveItem(type, delta) {
  const items = getItems(type);
  if (!items.length) return;
  state.itemIndex[type] = clamp(state.itemIndex[type] + delta, 0, items.length - 1);
  renderCockpit(type);
}

function emptyStateHtml(type) {
  return `
    <div class="sch-warn">
      <strong>${type === 'taalbegrip' ? 'Taalbegrip' : 'Zinsontwikkeling'} is nog leeg.</strong><br>
      Importeer eerst je privédata of laad fictieve testdata om de cockpit te proberen.
    </div>
  `;
}

function renderScripts() {
  const scripts = state.data?.zgScripts || [];
  if (!scripts.length) {
    els.scriptList.innerHTML = '<div class="sch-warn">Geen ZG-scripts in je import. Voeg zgScripts toe of laad de fictieve testdata.</div>';
    return;
  }
  els.scriptList.innerHTML = scripts.map(script => `
    <article class="sch-script">
      <p class="sch-label">${escapeHtml(script.source || 'bron ontbreekt')}</p>
      <strong>${escapeHtml(script.title || 'Script')}</strong>
      <p>${escapeHtml(script.coach || '')}</p>
      <textarea>${escapeHtml(script.script || '')}</textarea>
    </article>
  `).join('');
}

function renderSimulation() {
  const prompt = simulationPrompt(state.simPart);
  els.simCard.innerHTML = `
    <p class="sch-label">${escapeHtml(prompt.label)}</p>
    <h3>${escapeHtml(prompt.title)}</h3>
    <p>${escapeHtml(prompt.body)}</p>
    <p class="sch-score-note">${escapeHtml(prompt.hint)}</p>
  `;
  els.simScore.innerHTML = scoreButtons(`sim:${state.simPart}:${Date.now()}`, prompt.title);
  bindScoreButtons();
}

function simulationPrompt(part) {
  const begrip = randomFrom(getItems('taalbegrip'));
  const zins = randomFrom(getItems('zinsontwikkeling'));
  const prompts = {
    setup: {
      label: 'Testsituatie',
      title: 'Leg in 30 seconden je afname-opstelling uit.',
      body: 'Noem materiaal, positie, neutraliteit en waarom je geen respons stuurt.',
      hint: 'ZG = concreet handelen + reden + validiteit.'
    },
    taalbegrip: {
      label: 'Taalbegrip',
      title: begrip ? `Neem item ${begrip.number} kaal af.` : 'Neem een Taalbegrip-item kaal af.',
      body: begrip ? 'Zeg de zin uit je hoofd, scoreer en verantwoord.' : 'Importeer items om echte itemnummers te oefenen.',
      hint: 'ZG = exact, neutraal, geen hulp, scorecriterium paraat.'
    },
    zinsontwikkeling: {
      label: 'Zinsontwikkeling',
      title: zins ? `Neem item ${zins.number} kaal af.` : 'Neem een Zinsontwikkeling-item kaal af.',
      body: zins ? 'Bied stimuluszin exact aan en benoem het morfosyntactische criterium.' : 'Importeer items om echte stimuluszinnen te oefenen.',
      hint: 'ZG = stimuluszin + doelconstructie + scoring los van articulatie.'
    },
    scoring: {
      label: 'Scoring',
      title: 'Verdedig een twijfelrespons.',
      body: 'Leg uit waarom je 0 of 1 geeft en wat je noteert als observatie.',
      hint: 'ZG = respons aan handleidingscriterium koppelen.'
    },
    error: {
      label: 'Foutverantwoording',
      title: 'Je gaf per ongeluk hulp. Wat zeg je?',
      body: 'Benoem de fout, invloed op respons en betrouwbaarheid/validiteit.',
      hint: 'ZG = eerlijk, concreet, professioneel besluit.'
    }
  };
  return prompts[part] || prompts.setup;
}

function scoreButtons(id, label) {
  return `
    <div class="sch-score-row" data-score-id="${escapeHtml(id)}" data-score-label="${escapeHtml(label)}">
      ${SCALE.map(score => `<button type="button" data-score-value="${score.value}">(${score.value}) ${score.label}</button>`).join('')}
    </div>
  `;
}

function bindScoreButtons() {
  document.querySelectorAll('.sch-score-row [data-score-value]').forEach(button => {
    if (button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';
    button.addEventListener('click', () => {
      const row = button.closest('.sch-score-row');
      row.querySelectorAll('button').forEach(item => item.classList.remove('is-active'));
      button.classList.add('is-active');
      const entry = {
        id: row.dataset.scoreId,
        label: row.dataset.scoreLabel,
        value: Number(button.dataset.scoreValue),
        text: SCALE.find(item => item.value === Number(button.dataset.scoreValue))?.label || '',
        at: new Date().toISOString()
      };
      state.scores.unshift(entry);
      state.scores = state.scores.slice(0, 80);
      localStorage.setItem(SCORE_KEY, JSON.stringify(state.scores));
      renderDashboard();
    });
  });
}

function renderDashboard() {
  const values = state.scores.map(item => item.value);
  const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  const lowest = values.length ? Math.min(...values) : '-';
  const highest = values.length ? Math.max(...values) : '-';
  const last = state.scores[0];
  els.dashboard.innerHTML = `
    <div class="sch-dashboard-grid">
      ${statHtml('Pogingen', state.scores.length)}
      ${statHtml('Gemiddeld', values.length ? average.toFixed(1) : '-')}
      ${statHtml('Laagste', lowest)}
      ${statHtml('Hoogste', highest)}
    </div>
    <div class="sch-history">
      ${last ? `<article><strong>Laatste poging: ${escapeHtml(last.label)}</strong><br>${escapeHtml(last.value)} / 4 · ${escapeHtml(last.text)}</article>` : '<article>Nog geen scores. Doe een simulatie of score een cockpit-item.</article>'}
      ${state.scores.slice(1, 8).map(item => `<article>${escapeHtml(item.label)} · ${escapeHtml(item.value)} / 4 · ${escapeHtml(item.text)}</article>`).join('')}
    </div>
  `;
}

function statHtml(label, value) {
  return `<article class="sch-dashboard-stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`;
}

function factHtml(label, value) {
  return `<dl><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || 'Niet ingevuld')}</dd></dl>`;
}

function listText(value) {
  if (Array.isArray(value)) return value.join(' · ');
  return value || '';
}

function readData() {
  return readJson(STORAGE_KEY, null);
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function randomFrom(items) {
  if (!items?.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
