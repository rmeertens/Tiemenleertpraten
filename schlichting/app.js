'use strict';

const STORAGE_KEY = 'schlichting_private_data_v1';
const SCORE_KEY = 'schlichting_private_scores_v1';
const PREP_KEY = 'schlichting_private_prep_v1';
const AUDIO_TIMES_KEY = 'schlichting_private_audio_times_v1';

const AUDIO_GROUPS = [
  { id: 'zo1-10', label: 'ZO 1-10', start: 1, end: 10, expected: 10 },
  { id: 'zo11-20', label: 'ZO 11-20', start: 11, end: 20, expected: 10 },
  { id: 'zo21-36', label: 'ZO 21-36', start: 21, end: 36, expected: 16 }
];

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
        "material": "benodigd materiaal",
        "instructionSteps": ["handeling 1", "handeling 2"],
        "actionChecklist": ["materiaal correct klaarleggen", "juiste handeling voordoen"],
        "target": "morfosyntactisch criterium",
        "correctExamples": ["..."],
        "incorrectExamples": ["..."],
        "allowedVariations": ["..."],
        "scoringDetails": ["..."],
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
Verzamel algemene instructie, oefenitems, exacte stimuluszinnen, materiaal per item, handelingen per item, doelconstructies, morfosyntactische criteria, correcte/incorrecte voorbeelden, toegestane variaties, scoringdetails, herhaling, intonatie/prosodie, valkuilen, onderscheid met articulatie/fonologie en toetsverantwoording.

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
  timer: null,
  audio: {
    groups: {},
    segments: {},
    activeStop: null,
    saved: readJson(AUDIO_TIMES_KEY, {})
  }
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
  dashboard: document.getElementById('dashboard'),
  audioImport: document.getElementById('audio-import'),
  audioPanel: document.getElementById('audio-panel'),
  audioPlayer: document.getElementById('audio-player')
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
  document.getElementById('clear-audio').addEventListener('click', clearAudio);
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
  renderAudioImport();
  renderAudioPanel();
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
    let parsed = parseImportText(els.importText.value);
    if (parsed.schema !== 'schlichting-v1' && (parsed.rules || parsed.items || parsed.rubric || parsed.zgScripts)) {
      parsed = mergePartialImports([parsed]);
    }
    parsed = mergeSchlichtingData(state.data, parsed);
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
    els.validation.innerHTML = `<div class="sch-alert"><strong>JSON lukt nog niet.</strong><br>${escapeHtml(importErrorHelp(error))}</div>`;
  }
}

function parseImportText(text) {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('Plak eerst de NotebookLM-export.');
  try {
    return JSON.parse(trimmed);
  } catch (firstError) {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) return JSON.parse(fenced[1].trim());
    const objects = parseJsonObjects(trimmed);
    if (objects.length > 1) return mergePartialImports(objects);
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    }
    const rawItems = parseRawZinsontwikkelingText(trimmed);
    if (rawItems.length) return mergePartialImports([{ items: rawItems }]);
    throw firstError;
  }
}

function parseJsonObjects(text) {
  const objects = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === '{') {
      if (depth === 0) start = index;
      depth += 1;
    }
    if (char === '}') {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        objects.push(JSON.parse(text.slice(start, index + 1)));
        start = -1;
      }
    }
  }
  return objects;
}

function mergePartialImports(parts) {
  const merged = {
    schema: 'schlichting-v1',
    title: 'Schlichting Taalproductie-3 - Zinsontwikkeling',
    sourceNote: 'Privé-import op basis van meerdere NotebookLM-blokken. Niet committen of openbaar delen.',
    taalbegrip: {
      rules: {
        ageRange: 'niet ingevuld in deze export',
        setup: [],
        startRules: [],
        returnRule: 'niet ingevuld in deze export',
        stopRule: 'niet ingevuld in deze export'
      },
      sections: [],
      items: []
    },
    zinsontwikkeling: {
      rules: {
        setup: [],
        startRules: [],
        stopRule: '',
        returnRule: '',
        repeatRule: '',
        scoringPrinciples: [],
        pitfalls: [],
        sources: []
      },
      items: []
    },
    rubric: { criteria: [] },
    zgScripts: []
  };

  parts.forEach(part => {
    if (part.schema === 'schlichting-v1') {
      Object.assign(merged, part);
      return;
    }
    if (part.rules) {
      merged.zinsontwikkeling.rules = {
        ...merged.zinsontwikkeling.rules,
        ...part.rules,
        startRules: normalizeStartRules(part.rules.startRules || [])
      };
    }
    if (Array.isArray(part.items)) {
      merged.zinsontwikkeling.items = mergeItemsByNumber(merged.zinsontwikkeling.items, part.items);
    }
    if (Array.isArray(part.zinsontwikkeling?.items)) {
      merged.zinsontwikkeling.items = mergeItemsByNumber(merged.zinsontwikkeling.items, part.zinsontwikkeling.items);
    }
    if (part.rubric) merged.rubric = part.rubric;
    if (Array.isArray(part.zgScripts)) merged.zgScripts = part.zgScripts;
  });

  return merged;
}

function mergeSchlichtingData(current, incoming) {
  if (!current) return incoming;
  const merged = {
    ...current,
    ...incoming,
    taalbegrip: {
      ...(current.taalbegrip || {}),
      ...(incoming.taalbegrip || {}),
      rules: {
        ...(current.taalbegrip?.rules || {}),
        ...(incoming.taalbegrip?.rules || {})
      },
      sections: incoming.taalbegrip?.sections?.length ? incoming.taalbegrip.sections : (current.taalbegrip?.sections || []),
      items: mergeItemsByNumber(current.taalbegrip?.items || [], incoming.taalbegrip?.items || [])
    },
    zinsontwikkeling: {
      ...(current.zinsontwikkeling || {}),
      ...(incoming.zinsontwikkeling || {}),
      rules: {
        ...(current.zinsontwikkeling?.rules || {}),
        ...(incoming.zinsontwikkeling?.rules || {})
      },
      items: mergeItemsByNumber(current.zinsontwikkeling?.items || [], incoming.zinsontwikkeling?.items || [])
    },
    rubric: incoming.rubric?.criteria?.length ? incoming.rubric : (current.rubric || incoming.rubric),
    zgScripts: incoming.zgScripts?.length ? mergeScripts(current.zgScripts || [], incoming.zgScripts) : (current.zgScripts || incoming.zgScripts || [])
  };
  return merged;
}

function mergeItemsByNumber(baseItems = [], newItems = []) {
  const byNumber = new Map();
  baseItems.forEach(item => byNumber.set(Number(item.number), { ...item }));
  newItems.forEach(item => {
    const number = Number(item.number);
    byNumber.set(number, { ...(byNumber.get(number) || {}), ...withoutEmptyImportValues(item) });
  });
  return [...byNumber.values()].sort((a, b) => Number(a.number) - Number(b.number));
}

function withoutEmptyImportValues(item) {
  return Object.fromEntries(Object.entries(item).filter(([key, value]) => {
    if (key === 'id' || key === 'number') return true;
    if (value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return value !== null && value !== undefined;
  }));
}

function mergeScripts(base = [], incoming = []) {
  const byId = new Map();
  base.forEach(item => byId.set(item.id || item.title, item));
  incoming.forEach(item => byId.set(item.id || item.title, { ...(byId.get(item.id || item.title) || {}), ...item }));
  return [...byId.values()];
}

function parseRawZinsontwikkelingText(text) {
  if (!/item\s+\d{1,2}/i.test(text)) return [];
  const normalized = text.replace(/\r/g, '\n').replace(/[ \t]+/g, ' ');
  const matches = [...normalized.matchAll(/(?:^|\n)\s*Item\s+(\d{1,2})\b/gi)];
  if (!matches.length) return [];
  return matches.map((match, index) => {
    const number = Number(match[1]);
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? normalized.length;
    const block = cleanupText(normalized.slice(start, end));
    const target = firstUsefulLines(block, 3);
    const material = extractLooseSection(block, ['MATERIAAL', 'MATERIAAI', 'MATI RIAAL', 'MATRIAAL'], ['HERHALING', 'HERHALEN', 'INSTRUCTIE', 'INTRO', 'SCORING']);
    const repeat = extractLooseSection(block, ['HERHALING', 'HERHALEN', 'HEPHA', 'HIGHAL'], ['INSTRUCTIE', 'INTRO', 'SCORING']);
    const instruction = extractLooseSection(block, ['INSTRUCTIE', 'INSTRUC', 'INTRO', 'INCT'], ['SCORING', 'SKOR', 'Item Goed', 'Fout']);
    const scoring = extractLooseSection(block, ['SCORING', 'SKOR', 'Item Goed'], []);
    return {
      id: `ZO-${number}`,
      number,
      script: '',
      material,
      instructionSteps: splitInstruction(instruction),
      actionChecklist: material ? [`Pak klaar: ${material}`] : [],
      target,
      correctExamples: [],
      incorrectExamples: [],
      allowedVariations: [],
      scoringDetails: splitInstruction(scoring),
      scoring: scoring || 'Zie lokale bronkaart en scoreformulier.',
      repeat,
      intonation: 'Gebruik de intonatie uit de gekoppelde audio-opname.',
      pitfalls: ['Controleer exacte stimuluszin, materiaalhandeling en scoring tegen de bronkaart.'],
      rawBlock: block,
      source: 'Lokale OCR/NotebookLM-import'
    };
  }).filter(item => item.number >= 1 && item.number <= 36);
}

function extractLooseSection(block, starts, stops) {
  const upper = block.toUpperCase();
  const startHits = starts
    .map(label => ({ label, index: upper.indexOf(label.toUpperCase()) }))
    .filter(hit => hit.index >= 0)
    .sort((a, b) => a.index - b.index);
  if (!startHits.length) return '';
  const start = startHits[0].index + startHits[0].label.length;
  const stopHits = stops
    .map(label => upper.indexOf(label.toUpperCase(), start))
    .filter(index => index > start)
    .sort((a, b) => a - b);
  const end = stopHits[0] || block.length;
  return cleanupText(block.slice(start, end));
}

function firstUsefulLines(text, count) {
  return text.split('\n')
    .map(line => line.trim())
    .filter(line => line && !/^(MATERIAAL|HERHALING|INSTRUCTIE|SCORING)$/i.test(line))
    .slice(0, count)
    .join(' · ');
}

function splitInstruction(text) {
  return cleanupText(text)
    .split(/\n+|(?:^|\s)[•*-]\s+/)
    .map(line => line.trim())
    .filter(Boolean)
    .slice(0, 18);
}

function cleanupText(text) {
  return String(text || '')
    .replace(/\u0000/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function normalizeStartRules(rules) {
  return rules.map((rule, index) => {
    if (typeof rule !== 'string') return rule;
    const parsed = {
      minMonths: 0,
      maxMonths: 999,
      label: rule,
      startItem: '',
      returnRule: '',
      stopRule: ''
    };
    if (rule.includes('2;0') && rule.includes('3;11')) {
      parsed.minMonths = 24;
      parsed.maxMonths = 47;
      parsed.startItem = 1;
    } else if (rule.includes('4;0') && rule.includes('4;11')) {
      parsed.minMonths = 48;
      parsed.maxMonths = 59;
      parsed.startItem = 5;
    } else if (rule.includes('5;0')) {
      parsed.minMonths = 60;
      parsed.maxMonths = 999;
      parsed.startItem = 10;
    } else {
      parsed.label = `Regel ${index + 1}: ${rule}`;
    }
    return parsed;
  });
}

function importErrorHelp(error) {
  if (String(error.message).includes('Unexpected end') || String(error.message).includes('Unexpected EOF')) {
    return 'De JSON is niet compleet. Kopieer vanaf de eerste { tot en met de laatste }. Vaak mist onderaan nog een afsluitende } of ].';
  }
  return `${error.message}. Tip: plak alleen geldige JSON of een compleet \`\`\`json-blok uit NotebookLM.`;
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
        ['Materiaal', item.material],
        ['Handelingen', listText(item.instructionSteps)],
        ['Doelconstructie', item.target],
        ['Correcte voorbeelden', listText(item.correctExamples)],
        ['Incorrecte voorbeelden', listText(item.incorrectExamples)],
        ['Toegestane variaties', listText(item.allowedVariations)],
        ['Scoringdetails', listText(item.scoringDetails)],
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
        ${type === 'zinsontwikkeling' ? materialChecklistHtml(item) : ''}
        ${type === 'zinsontwikkeling' ? rawSourceHtml(item) : ''}
        ${type === 'zinsontwikkeling' ? audioForItemHtml(item.number) : ''}
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
  bindAudioButtons();
  bindMaterialChecks();
}

function materialChecklistHtml(item) {
  const checks = [
    item.material ? `Materiaal klaar: ${item.material}` : 'Materiaal uit import controleren',
    'Alleen materiaal voor dit item zichtbaar',
    'Testmap goed tussen testleider en kind',
    'Stimuluszin exact en natuurlijk',
    ...(Array.isArray(item.actionChecklist) ? item.actionChecklist : [])
  ];
  return `
    <div class="sch-material-check">
      <p class="sch-label">Materiaalcheck</p>
      ${checks.map((check, index) => `
        <label>
          <input type="checkbox" data-material-check="${escapeHtml(item.id || item.number)}-${escapeHtml(index)}" />
          <span>${escapeHtml(check)}</span>
        </label>
      `).join('')}
    </div>
  `;
}

function rawSourceHtml(item) {
  if (!item.rawBlock) return '';
  return `
    <details class="sch-source-card">
      <summary>Volledige lokale bronkaart ZO ${escapeHtml(item.number)}</summary>
      <pre>${escapeHtml(item.rawBlock)}</pre>
    </details>
  `;
}

function bindMaterialChecks() {
  document.querySelectorAll('[data-material-check]').forEach(input => {
    const key = `schlichting_material_${input.dataset.materialCheck}`;
    input.checked = localStorage.getItem(key) === 'true';
    input.addEventListener('change', () => {
      localStorage.setItem(key, String(input.checked));
    });
  });
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

function renderAudioImport() {
  els.audioImport.innerHTML = AUDIO_GROUPS.map(group => {
    const loaded = state.audio.groups[group.id];
    return `
      <label class="sch-audio-drop">
        <strong>${escapeHtml(group.label)}</strong>
        <span class="sch-audio-mini">${loaded ? `${loaded.fileName} · ${loaded.segments.length}/${group.expected} segmenten · ${loaded.method}` : 'Kies lokale mp3'}</span>
        <input type="file" accept="audio/*" data-audio-group="${escapeHtml(group.id)}" />
      </label>
    `;
  }).join('');

  els.audioImport.querySelectorAll('[data-audio-group]').forEach(input => {
    input.addEventListener('change', () => {
      const group = AUDIO_GROUPS.find(item => item.id === input.dataset.audioGroup);
      const file = input.files?.[0];
      if (group && file) importAudioGroup(group, file);
    });
  });
}

async function importAudioGroup(group, file) {
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new AudioContext();
  const decoded = await audioContext.decodeAudioData(arrayBuffer.slice(0));
  await audioContext.close();
  const objectUrl = URL.createObjectURL(file);
  if (state.audio.groups[group.id]?.url) URL.revokeObjectURL(state.audio.groups[group.id].url);
  const saved = state.audio.saved[group.id];
  const useSaved = saved?.segments?.length === group.expected && Math.abs(Number(saved.duration) - decoded.duration) < 2;
  const detected = useSaved
    ? saved.segments
    : detectSpeechSegments(decoded, group.expected);
  const segments = detected.map((segment, index) => ({
    item: group.start + index,
    groupId: group.id,
    start: segment.start,
    end: segment.end
  }));
  state.audio.groups[group.id] = {
    fileName: file.name,
    url: objectUrl,
    buffer: decoded,
    duration: decoded.duration,
    method: useSaved ? 'bewaarde grenzen' : 'grootste pauzes',
    segments
  };
  segments.forEach(segment => {
    state.audio.segments[segment.item] = segment;
  });
  saveAudioSegments(group.id);
  renderAudioImport();
  renderAudioPanel();
  renderCockpit('zinsontwikkeling');
}

function detectSpeechSegments(buffer, expected) {
  const samples = buffer.getChannelData(0);
  const sampleRate = buffer.sampleRate;
  const frame = Math.max(1, Math.floor(sampleRate * 0.05));
  const hop = Math.max(1, Math.floor(sampleRate * 0.025));
  const rms = [];
  for (let start = 0; start + frame < samples.length; start += hop) {
    let sum = 0;
    for (let i = start; i < start + frame; i += 1) sum += samples[i] * samples[i];
    rms.push({ time: start / sampleRate, value: Math.sqrt(sum / frame) });
  }
  const values = rms.map(item => item.value).sort((a, b) => a - b);
  const p80 = values[Math.floor(values.length * 0.8)] || 0;
  const max = values[values.length - 1] || 0;
  const threshold = Math.max(0.004, Math.min(0.035, Math.max(p80 * 0.25, max * 0.035)));
  const raw = [];
  let open = null;
  rms.forEach(item => {
    if (item.value >= threshold && open === null) open = item.time;
    if (item.value < threshold && open !== null) {
      raw.push({ start: Math.max(0, open - 0.18), end: item.time + 0.25 });
      open = null;
    }
  });
  if (open !== null) raw.push({ start: Math.max(0, open - 0.18), end: buffer.duration });

  const phrases = raw
    .filter(item => item.end - item.start >= 0.18)
    .reduce((acc, item) => {
      const previous = acc[acc.length - 1];
      if (previous && item.start - previous.end < 0.28) {
        previous.end = item.end;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);

  let regions = segmentByLargestPauses(phrases, expected, buffer.duration);
  regions = fitSegmentCount(regions, expected, buffer.duration);
  return regions.map(item => ({
    start: roundTime(item.start),
    end: roundTime(Math.min(buffer.duration, item.end))
  }));
}

function segmentByLargestPauses(phrases, expected, duration) {
  if (phrases.length <= 1) return equalSegments(expected, duration);
  if (phrases.length <= expected) return phrases;
  const gaps = [];
  for (let index = 0; index < phrases.length - 1; index += 1) {
    gaps.push({
      index,
      gap: phrases[index + 1].start - phrases[index].end
    });
  }
  const boundaryIndexes = new Set(
    gaps
      .sort((a, b) => b.gap - a.gap)
      .slice(0, expected - 1)
      .map(item => item.index)
  );
  const groups = [];
  let current = { start: phrases[0].start, end: phrases[0].end };
  for (let index = 0; index < phrases.length - 1; index += 1) {
    current.end = phrases[index].end;
    if (boundaryIndexes.has(index)) {
      groups.push({ start: Math.max(0, current.start - 0.18), end: Math.min(duration, current.end + 0.28) });
      current = { start: phrases[index + 1].start, end: phrases[index + 1].end };
    }
  }
  current.end = phrases[phrases.length - 1].end;
  groups.push({ start: Math.max(0, current.start - 0.18), end: Math.min(duration, current.end + 0.28) });
  return groups;
}

function fitSegmentCount(regions, expected, duration) {
  let next = [...regions];
  if (!next.length) return equalSegments(expected, duration);
  while (next.length > expected) {
    let bestIndex = 0;
    let bestGap = Infinity;
    for (let i = 0; i < next.length - 1; i += 1) {
      const gap = next[i + 1].start - next[i].end;
      if (gap < bestGap) {
        bestGap = gap;
        bestIndex = i;
      }
    }
    next[bestIndex].end = next[bestIndex + 1].end;
    next.splice(bestIndex + 1, 1);
  }
  while (next.length < expected) {
    let longestIndex = 0;
    next.forEach((item, index) => {
      if (item.end - item.start > next[longestIndex].end - next[longestIndex].start) longestIndex = index;
    });
    const item = next[longestIndex];
    const middle = item.start + ((item.end - item.start) / 2);
    next.splice(longestIndex, 1, { start: item.start, end: middle }, { start: middle, end: item.end });
  }
  return next;
}

function equalSegments(expected, duration) {
  return Array.from({ length: expected }, (_, index) => ({
    start: (duration / expected) * index,
    end: (duration / expected) * (index + 1)
  }));
}

function renderAudioPanel() {
  const all = Object.values(state.audio.groups).flatMap(group => group.segments || []);
  if (!all.length) {
    els.audioPanel.innerHTML = '<div class="sch-warn"><strong>Nog geen audio gekoppeld.</strong><br>Selecteer de drie mp3’s. De tool probeert daarna automatisch ZO1-36 te verdelen op stiltes.</div>';
    return;
  }
  els.audioPanel.innerHTML = `
    <div class="sch-audio-tools">
      ${AUDIO_GROUPS.map(group => groupControlHtml(group)).join('')}
    </div>
    <div class="sch-audio-table">
      ${all.sort((a, b) => a.item - b.item).map(segment => audioRowHtml(segment)).join('')}
    </div>
  `;
  els.audioPanel.querySelectorAll('[data-audio-play]').forEach(button => {
    button.addEventListener('click', () => playAudioSegment(Number(button.dataset.audioPlay)));
  });
  els.audioPanel.querySelectorAll('[data-audio-context]').forEach(button => {
    button.addEventListener('click', () => playAudioSegment(Number(button.dataset.audioContext), 1.25));
  });
  els.audioPanel.querySelectorAll('[data-audio-autosplit]').forEach(button => {
    button.addEventListener('click', () => resplitAudioGroup(button.dataset.audioAutosplit, 'auto'));
  });
  els.audioPanel.querySelectorAll('[data-audio-equal]').forEach(button => {
    button.addEventListener('click', () => resplitAudioGroup(button.dataset.audioEqual, 'equal'));
  });
  els.audioPanel.querySelectorAll('[data-audio-time]').forEach(input => {
    input.addEventListener('change', () => updateAudioTime(input));
  });
}

function groupControlHtml(group) {
  const loaded = state.audio.groups[group.id];
  if (!loaded) return '';
  return `
    <div class="sch-audio-group-control">
      <strong>${escapeHtml(group.label)}</strong>
      <button class="btn btn--ghost" type="button" data-audio-autosplit="${escapeHtml(group.id)}">Detecteer opnieuw</button>
      <button class="btn btn--ghost" type="button" data-audio-equal="${escapeHtml(group.id)}">Evenredig verdelen</button>
      <span class="sch-audio-mini">${escapeHtml(loaded.method)} · correcties worden lokaal bewaard</span>
    </div>
  `;
}

function audioRowHtml(segment) {
  return `
    <div class="sch-audio-row">
      <strong>ZO ${escapeHtml(segment.item)}</strong>
      <span class="sch-audio-mini">${escapeHtml(state.audio.groups[segment.groupId]?.fileName || '')}</span>
      <input type="number" min="0" step="0.05" value="${escapeHtml(segment.start)}" data-audio-time="start" data-audio-item="${escapeHtml(segment.item)}" aria-label="Starttijd ZO ${escapeHtml(segment.item)}" />
      <input type="number" min="0" step="0.05" value="${escapeHtml(segment.end)}" data-audio-time="end" data-audio-item="${escapeHtml(segment.item)}" aria-label="Eindtijd ZO ${escapeHtml(segment.item)}" />
      <button class="btn btn--primary" type="button" data-audio-play="${escapeHtml(segment.item)}">Luister</button>
      <button class="btn btn--ghost" type="button" data-audio-context="${escapeHtml(segment.item)}">Context</button>
    </div>
  `;
}

function audioForItemHtml(itemNumber) {
  const segment = state.audio.segments[itemNumber];
  if (!segment) {
    return '<div class="sch-warn"><strong>Geen audio gekoppeld.</strong><br>Ga naar Audio en selecteer de mp3-bestanden.</div>';
  }
  return `
    <div class="sch-actions">
      <button class="btn btn--primary" type="button" data-audio-play="${escapeHtml(itemNumber)}">Luister naar intonatie ZO ${escapeHtml(itemNumber)}</button>
      <span class="sch-score-note">${escapeHtml(segment.start)}s - ${escapeHtml(segment.end)}s</span>
    </div>
  `;
}

function bindAudioButtons() {
  document.querySelectorAll('[data-audio-play]').forEach(button => {
    if (button.dataset.audioBound === 'true') return;
    button.dataset.audioBound = 'true';
    button.addEventListener('click', () => playAudioSegment(Number(button.dataset.audioPlay)));
  });
}

function playAudioSegment(itemNumber, padding = 0) {
  const segment = state.audio.segments[itemNumber];
  const group = segment ? state.audio.groups[segment.groupId] : null;
  if (!segment || !group) return;
  if (state.audio.activeStop) {
    els.audioPlayer.removeEventListener('timeupdate', state.audio.activeStop);
    state.audio.activeStop = null;
  }
  els.audioPlayer.src = group.url;
  els.audioPlayer.currentTime = Math.max(0, segment.start - padding);
  const stop = () => {
    if (els.audioPlayer.currentTime >= Math.min(group.duration, segment.end + padding)) {
      els.audioPlayer.pause();
      els.audioPlayer.removeEventListener('timeupdate', stop);
      state.audio.activeStop = null;
    }
  };
  state.audio.activeStop = stop;
  els.audioPlayer.addEventListener('timeupdate', stop);
  els.audioPlayer.play();
}

function updateAudioTime(input) {
  const item = Number(input.dataset.audioItem);
  const segment = state.audio.segments[item];
  if (!segment) return;
  segment[input.dataset.audioTime] = roundTime(Number(input.value));
  const group = state.audio.groups[segment.groupId];
  if (group) {
    const match = group.segments.find(itemSegment => itemSegment.item === item);
    if (match) match[input.dataset.audioTime] = segment[input.dataset.audioTime];
    group.method = 'handmatig gecorrigeerd';
    saveAudioSegments(segment.groupId);
    renderAudioImport();
  }
  renderCockpit('zinsontwikkeling');
}

function resplitAudioGroup(groupId, mode) {
  const groupDef = AUDIO_GROUPS.find(group => group.id === groupId);
  const group = state.audio.groups[groupId];
  if (!groupDef || !group?.buffer) return;
  const next = (mode === 'equal' ? equalSegments(groupDef.expected, group.duration) : detectSpeechSegments(group.buffer, groupDef.expected))
    .map((segment, index) => ({
      item: groupDef.start + index,
      groupId,
      start: segment.start,
      end: segment.end
    }));
  group.segments = next;
  group.method = mode === 'equal' ? 'evenredig verdeeld' : 'grootste pauzes';
  next.forEach(segment => {
    state.audio.segments[segment.item] = segment;
  });
  saveAudioSegments(groupId);
  renderAudioImport();
  renderAudioPanel();
  renderCockpit('zinsontwikkeling');
}

function saveAudioSegments(groupId) {
  const group = state.audio.groups[groupId];
  if (!group) return;
  state.audio.saved[groupId] = {
    duration: group.duration,
    segments: group.segments.map(segment => ({
      start: roundTime(segment.start),
      end: roundTime(segment.end)
    }))
  };
  localStorage.setItem(AUDIO_TIMES_KEY, JSON.stringify(state.audio.saved));
}

function clearAudio() {
  Object.values(state.audio.groups).forEach(group => {
    if (group.url) URL.revokeObjectURL(group.url);
  });
  els.audioPlayer.pause();
  els.audioPlayer.removeAttribute('src');
  state.audio.groups = {};
  state.audio.segments = {};
  state.audio.saved = {};
  localStorage.removeItem(AUDIO_TIMES_KEY);
  renderAudioImport();
  renderAudioPanel();
  renderCockpit('zinsontwikkeling');
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

function roundTime(value) {
  return Math.max(0, Math.round(Number(value) * 100) / 100);
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
