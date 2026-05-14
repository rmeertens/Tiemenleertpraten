'use strict';

const STORAGE_KEY = 'schlichting_private_data_v1';
const SCORE_KEY = 'schlichting_private_scores_v1';
const TRAINING_KEY = 'schlichting_private_training_v1';
const PREP_KEY = 'schlichting_private_prep_v1';
const AUDIO_TIMES_KEY = 'schlichting_private_audio_times_v1';
const SCORE_FORM_PENCIL_KEY = 'schlichting_scoreformulier_potlood_v1';
const SCORE_FORM_DOCK_KEY = 'schlichting_scoreformulier_dock_v1';
const SOURCE_IMAGE_DB = 'schlichting_private_source_images_v1';
const SOURCE_IMAGE_STORE = 'images';
const AUDIO_FILE_STORE = 'audioFiles';
const SCORE_FORM_PAGE_STORE = 'scoreFormPages';

const SOURCE_IMAGE_KINDS = [
  { id: 'handleiding', label: 'Afnamehandleiding' },
  { id: 'testmap', label: 'Testmap' }
];

const PRIVATE_SECTION_DEFAULTS = [
  { id: 'handleiding', title: 'Afnamehandleiding', field: 'handleidingText', sourceField: 'handleidingSource', open: true },
  { id: 'testmap', title: 'Testmap', field: 'testmapText', sourceField: 'testmapSource', open: false }
];

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
        "privateSections": [
          {
            "title": "Testmap",
            "body": "privétekst of scantranscriptie",
            "source": "testmapblad ..."
          },
          {
            "title": "Afnamehandleiding",
            "body": "privétekst of eigen controlepunten",
            "source": "handleiding p. ..."
          }
        ],
        "audioCheck": {
          "audioFile": "ZO1-10.mp3",
          "spokenStimulus": "wat je hoort in de opname",
          "estimatedStart": "0:00",
          "estimatedEnd": "0:10",
          "intonationNotes": ["waar let je auditief op"]
        },
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
Verzamel algemene instructie, oefenitems, exacte stimuluszinnen, materiaal per item, handelingen per item, doelconstructies, morfosyntactische criteria, correcte/incorrecte voorbeelden, toegestane variaties, scoringdetails, herhaling, intonatie/prosodie, valkuilen, onderscheid met articulatie/fonologie en toetsverantwoording. Als je audiobronnen of transcripties hebt: voeg per item audioCheck toe met bestandsnaam, hoorbare stimulus, globale start/eindtijd en intonatiepunten. Markeer tijden als schatting wanneer ze niet uit een echte tijdlijn komen.

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
  training: readJson(TRAINING_KEY, { sessions: [], current: null }),
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
    currentItem: null,
    saved: readJson(AUDIO_TIMES_KEY, {})
  },
  sourceImages: {},
  scoreForm: {
    pages: [],
    page: 1,
    mode: 'pencil',
    strokes: readJson(SCORE_FORM_PENCIL_KEY, {}),
    dock: {
      open: readJson(SCORE_FORM_DOCK_KEY, { open: false, width: 520, collapsed: false }).open || false,
      width: readJson(SCORE_FORM_DOCK_KEY, { open: false, width: 520, collapsed: false }).width || 520,
      collapsed: readJson(SCORE_FORM_DOCK_KEY, { open: false, width: 520, collapsed: false }).collapsed || false
    }
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
  audioPlayer: document.getElementById('audio-player'),
  audioFab: document.getElementById('audio-fab'),
  audioFabTitle: document.getElementById('audio-fab-title'),
  audioFabTime: document.getElementById('audio-fab-time'),
  scoreFormPaper: document.getElementById('scoreform-paper'),
  scoreFormDock: document.getElementById('scoreform-dock'),
  scoreFormFab: document.getElementById('scoreform-fab'),
  scoreFormResizer: document.getElementById('scoreform-resizer')
};

boot();

function boot() {
  els.prompt.textContent = NOTEBOOK_PROMPT;
  if (state.data) {
    els.importText.value = JSON.stringify(state.data, null, 2);
  }
  bindEvents();
  renderAll();
  loadSourceImages().then(() => {
    renderCockpit('zinsontwikkeling');
  }).catch(() => {
    state.sourceImages = {};
  });
  loadStoredAudioFiles().catch(() => {
    renderAudioImport();
    renderAudioPanel();
  });
  loadScoreFormPages().then(() => {
    renderScoreFormPaper();
  }).catch(() => {
    state.scoreForm.pages = [];
    renderScoreFormPaper();
  });
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
  els.audioFab?.addEventListener('click', () => {
    const itemNumber = currentZinsItemNumber();
    if (itemNumber) playAudioSegment(itemNumber);
  });
  document.getElementById('open-scoreform-dock')?.addEventListener('click', () => setScoreFormDock({ open: true, collapsed: false }));
  document.getElementById('scoreform-fab')?.addEventListener('click', () => setScoreFormDock({ open: true, collapsed: false }));
  document.getElementById('close-scoreform-dock')?.addEventListener('click', () => setScoreFormDock({ open: false }));
  document.getElementById('collapse-scoreform-dock')?.addEventListener('click', () => setScoreFormDock({ collapsed: !state.scoreForm.dock.collapsed, open: true }));
  els.scoreFormResizer?.addEventListener('pointerdown', startScoreFormResize);
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
  renderAudioFab();
  renderScoreFormDock();
  renderScoreFormPaper();
  renderSimulation();
  renderDashboard();
}

function showView(view) {
  if (view === 'scoreform') {
    setScoreFormDock({ open: true, collapsed: false });
  }
  state.view = view;
  document.querySelectorAll('.sch-tab').forEach(tab => {
    tab.classList.toggle('is-active', tab.dataset.view === view);
  });
  document.querySelectorAll('.sch-view').forEach(section => {
    section.classList.toggle('is-active', section.id === `view-${view}`);
  });
  renderAudioFab();
}

function persistScoreFormDock() {
  localStorage.setItem(SCORE_FORM_DOCK_KEY, JSON.stringify(state.scoreForm.dock));
}

function setScoreFormDock(patch) {
  state.scoreForm.dock = { ...state.scoreForm.dock, ...patch };
  persistScoreFormDock();
  renderScoreFormDock();
  renderScoreFormPaper();
}

function renderScoreFormDock() {
  if (!els.scoreFormDock) return;
  const width = Math.min(Math.max(Number(state.scoreForm.dock.width) || 520, 360), Math.min(window.innerWidth - 32, 980));
  const open = Boolean(state.scoreForm.dock.open);
  const collapsed = Boolean(state.scoreForm.dock.collapsed);
  const reservedWidth = open ? (collapsed ? 52 : width) : 0;
  state.scoreForm.dock.width = width;
  els.scoreFormDock.style.setProperty('--scoreform-width', `${width}px`);
  document.body.style.setProperty('--scoreform-space', `${reservedWidth}px`);
  document.body.classList.toggle('sch-scoreform-split', open);
  document.body.classList.toggle('sch-scoreform-split-collapsed', open && collapsed);
  els.scoreFormDock.classList.toggle('is-open', open);
  els.scoreFormDock.classList.toggle('is-collapsed', collapsed);
  els.scoreFormDock.setAttribute('aria-hidden', String(!open));
  els.scoreFormFab?.classList.toggle('is-hidden', Boolean(open && !collapsed));
  document.getElementById('collapse-scoreform-dock')?.replaceChildren(document.createTextNode(state.scoreForm.dock.collapsed ? 'Uitklappen' : 'Inklappen'));
  renderAudioFab();
}

function startScoreFormResize(event) {
  event.preventDefault();
  const startX = event.clientX;
  const startWidth = state.scoreForm.dock.width;
  const resize = moveEvent => {
    const nextWidth = Math.min(Math.max(startWidth + (startX - moveEvent.clientX), 360), Math.min(window.innerWidth - 32, 980));
    state.scoreForm.dock.width = nextWidth;
    renderScoreFormDock();
  };
  const stop = () => {
    persistScoreFormDock();
    renderScoreFormPaper();
    window.removeEventListener('pointermove', resize);
    window.removeEventListener('pointerup', stop);
  };
  window.addEventListener('pointermove', resize);
  window.addEventListener('pointerup', stop);
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

async function importData() {
  try {
    let parsed = parseImportText(els.importText.value);
    const importedAudioTimes = parsed._privateAudioTimes || parsed.privateAudioTimes || null;
    const importedSourceImages = parsed._privateSourceImages || parsed.privateSourceImages || null;
    const importedScoreFormPages = parsed._privateScoreFormPages || parsed.privateScoreFormPages || null;
    const importedScoreFormStrokes = parsed._privateScoreFormStrokes || parsed.privateScoreFormStrokes || null;
    const importedTraining = parsed._privateTraining || parsed.privateTraining || null;
    delete parsed._privateAudioTimes;
    delete parsed.privateAudioTimes;
    delete parsed._privateSourceImages;
    delete parsed.privateSourceImages;
    delete parsed._privateScoreFormPages;
    delete parsed.privateScoreFormPages;
    delete parsed._privateScoreFormStrokes;
    delete parsed.privateScoreFormStrokes;
    delete parsed._privateTraining;
    delete parsed.privateTraining;
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
    if (importedAudioTimes && typeof importedAudioTimes === 'object') {
      state.audio.saved = importedAudioTimes;
      localStorage.setItem(AUDIO_TIMES_KEY, JSON.stringify(importedAudioTimes));
    }
    if (Array.isArray(importedSourceImages)) {
      await restoreSourceImages(importedSourceImages);
    }
    if (Array.isArray(importedScoreFormPages)) {
      await restoreScoreFormPages(importedScoreFormPages);
    }
    if (importedScoreFormStrokes && typeof importedScoreFormStrokes === 'object') {
      state.scoreForm.strokes = importedScoreFormStrokes;
      localStorage.setItem(SCORE_FORM_PENCIL_KEY, JSON.stringify(importedScoreFormStrokes));
    }
    if (importedTraining && typeof importedTraining === 'object') {
      state.training = {
        sessions: Array.isArray(importedTraining.sessions) ? importedTraining.sessions : [],
        current: importedTraining.current && typeof importedTraining.current === 'object' ? importedTraining.current : null
      };
      saveTraining();
    }
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
    const privateHtmlItems = parsePrivateHtmlTestmap(trimmed);
    if (privateHtmlItems.length) return mergePartialImports([{ items: privateHtmlItems }]);
    const scoreFormHtmlItems = parsePrivateHtmlScoreForm(trimmed);
    if (scoreFormHtmlItems.length) return mergePartialImports([{ items: scoreFormHtmlItems }]);
    const objects = parseJsonObjects(trimmed);
    if (objects.length > 1) return mergePartialImports(objects);
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    }
    const privateMarkdownItems = parsePrivateMarkdownSections(trimmed);
    if (privateMarkdownItems.length) return mergePartialImports([{ items: privateMarkdownItems }]);
    const taalbegripChapter = parseTaalbegripChapterMarkdown(trimmed);
    if (taalbegripChapter.length) return mergePartialImports([{ taalbegrip: { sections: taalbegripChapter } }]);
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
        try {
          objects.push(JSON.parse(text.slice(start, index + 1)));
        } catch {
          // CSS and HTML snippets can also contain braces; skip those.
        }
        start = -1;
      }
    }
  }
  return objects;
}

function parseTaalbegripChapterMarkdown(text) {
  if (!/#\s*Hoofdstuk\s*5/i.test(text) && !/##\s*5\.\d+\s+Sectie/i.test(text)) return [];
  const blocks = splitMarkdownByHeading(text, /^##\s+(5\.\d+)\s+(.+)$/m);
  return blocks
    .map(block => {
      const match = block.heading.match(/^##\s+(5\.\d+)\s+(.+)$/i);
      if (!match) return null;
      const sectionLetter = (match[2].match(/Sectie\s+([A-G])/i)?.[1] || '').toUpperCase();
      return {
        id: sectionLetter ? `sectie-${sectionLetter.toLowerCase()}` : match[1],
        number: match[1],
        title: match[2].trim(),
        section: sectionLetter,
        itemRange: taalbegripSectionRange(sectionLetter),
        body: block.body.trim(),
        source: 'Hoofdstuk 5 privé-import'
      };
    })
    .filter(Boolean);
}

function splitMarkdownByHeading(text, headingPattern) {
  const matches = [...text.matchAll(new RegExp(headingPattern.source, 'gmi'))];
  return matches.map((match, index) => {
    const next = matches[index + 1];
    const start = match.index || 0;
    const end = next?.index ?? text.length;
    const block = text.slice(start, end).trim();
    const lines = block.split('\n');
    return {
      heading: lines[0].trim(),
      body: lines.slice(1).join('\n').trim()
    };
  });
}

function taalbegripSectionRange(sectionLetter) {
  const ranges = {
    A: [1, 12],
    B: [13, 33],
    C: [34, 41],
    D: [42, 49],
    E: [50, 55],
    F: [56, 63],
    G: [64, 71]
  };
  return ranges[sectionLetter] || null;
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
    if (Array.isArray(part.taalbegrip?.sections)) {
      merged.taalbegrip.sections = mergeSectionsById(merged.taalbegrip.sections, part.taalbegrip.sections);
    }
    if (Array.isArray(part.taalbegrip?.items)) {
      merged.taalbegrip.items = mergeItemsByNumber(merged.taalbegrip.items, part.taalbegrip.items);
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
      sections: incoming.taalbegrip?.sections?.length
        ? mergeSectionsById(current.taalbegrip?.sections || [], incoming.taalbegrip.sections)
        : (current.taalbegrip?.sections || []),
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

function mergeSectionsById(baseSections = [], newSections = []) {
  const byId = new Map();
  baseSections.forEach(section => byId.set(section.id || section.title, { ...section }));
  newSections.forEach(section => {
    const id = section.id || section.title;
    byId.set(id, { ...(byId.get(id) || {}), ...section });
  });
  return [...byId.values()];
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

function parsePrivateHtmlTestmap(text) {
  if (!/<div\s+class=["']item-card["']/i.test(text)) return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const cards = [...doc.querySelectorAll('.item-card')];
  return cards.map((card, index) => {
    const numberText = textFrom(card.querySelector('.item-num'));
    const number = parseItemNumber(numberText) || index + 1;
    const headerParts = [...card.querySelectorAll('.item-header > span')].map(textFrom).filter(Boolean);
    const title = headerParts.find(part => part !== numberText && !part.toLowerCase().startsWith('doelstructuur:')) || `Item ${number}`;
    const target = textFrom(card.querySelector('.doelstructuur')).replace(/^doelstructuur:\s*/i, '');
    const material = textFrom(card.querySelector('.materiaal'));
    const subitems = [...card.querySelectorAll('.subitem')].map(subitem => ({
      label: textFrom(subitem.querySelector('.sublabel')),
      spontaan: textFrom(subitem.querySelector('.spontaan-tag')),
      instructions: [...subitem.querySelectorAll('.instructie')].map(textFrom).filter(Boolean),
      scripts: [...subitem.querySelectorAll('.zeg')].map(textFrom).filter(Boolean),
      optional: [...subitem.querySelectorAll('.optioneel')].map(textFrom).filter(Boolean),
      target: textFrom(subitem.querySelector('.doelwoord-tag')).replace(/^✓\s*doelwoord:\s*/i, '')
    }));
    return {
      id: `ZO-${number}`,
      number,
      target,
      material,
      testmapText: testmapMarkdownFromHtmlItem({ number, title, target, material, subitems }),
      testmapSource: 'Lokale HTML-testmap import'
    };
  }).filter(item => item.number >= 1 && item.number <= 36);
}

function testmapMarkdownFromHtmlItem(item) {
  const lines = [
    `## Item ${item.number}`,
    `**${item.title}**`
  ];
  if (item.target) lines.push('', `**Doelstructuur**`, item.target);
  if (item.material) lines.push('', `**Materiaal / afname**`, item.material);
  item.subitems.forEach(subitem => {
    lines.push('', `### ${subitem.label || 'Onderdeel'}`);
    if (subitem.spontaan) lines.push(`- ${subitem.spontaan}`);
    subitem.instructions.forEach(value => lines.push(`- _${value}_`));
    subitem.scripts.forEach(value => lines.push(`- **Zeg:** ${value}`));
    subitem.optional.forEach(value => lines.push(`- _Optioneel:_ ${value}`));
    if (subitem.target) lines.push(`- **Doelwoord:** ${subitem.target}`);
  });
  return lines.join('\n');
}

function parsePrivateHtmlScoreForm(text) {
  if (!/Scoreformulier\s+Zinsontwikkeling/i.test(text) || !/\bconst\s+items\s*=\s*\[/i.test(text)) return [];
  const source = extractJavaScriptArraySource(text, 'items');
  if (!source) return [];
  try {
    return parseScoreFormItemsArray(source)
      .map(item => ({
        id: `ZO-${item.n}`,
        number: item.n,
        scoreformulierText: scoreFormMarkdownFromHtmlItem(item),
        scoreformulierSource: 'Lokale HTML-scoreformulier import'
      }))
      .filter(item => item.number >= 1 && item.number <= 36);
  } catch {
    return [];
  }
}

function extractJavaScriptArraySource(text, variableName) {
  const startMatch = new RegExp(`\\bconst\\s+${variableName}\\s*=\\s*\\[`, 'i').exec(text);
  if (!startMatch) return '';
  const start = startMatch.index + startMatch[0].lastIndexOf('[');
  let depth = 0;
  let inString = false;
  let quote = '';
  let escaped = false;
  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        inString = false;
      }
      continue;
    }
    if (char === '\'' || char === '"' || char === '`') {
      inString = true;
      quote = char;
      continue;
    }
    if (char === '[') depth += 1;
    if (char === ']') {
      depth -= 1;
      if (depth === 0) return text.slice(start, index + 1);
    }
  }
  return '';
}

function parseScoreFormItemsArray(source) {
  const normalized = source
    .replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":')
    .replace(/'/g, '"');
  return JSON.parse(normalized);
}

function scoreFormMarkdownFromHtmlItem(item) {
  const lines = [
    `## Item ${item.n}`,
    `**${item.t || `ZO-${item.n}`}**`
  ];
  (item.parts || []).forEach(part => {
    const [title, good = [], bad = []] = part;
    lines.push('', `### ${title}`);
    if (good.length) {
      lines.push('', '**G**');
      good.forEach(option => lines.push(`- ${option}`));
    }
    if (bad.length) {
      lines.push('', '**F**');
      bad.forEach(option => lines.push(`- ${option}`));
    }
  });
  return lines.join('\n');
}

function parseItemNumber(value) {
  const text = String(value || '').trim().toUpperCase();
  if (/^\d+$/.test(text)) return Number(text);
  const roman = { I: 1, V: 5, X: 10, L: 50 };
  let total = 0;
  for (let index = 0; index < text.length; index += 1) {
    const current = roman[text[index]] || 0;
    const next = roman[text[index + 1]] || 0;
    total += current < next ? -current : current;
  }
  return total || 0;
}

function textFrom(node) {
  return node?.textContent?.replace(/\s+/g, ' ').trim() || '';
}

function parsePrivateMarkdownSections(text) {
  if (!/^##\s+Item\s+\d{1,2}\b/im.test(text)) return [];
  const normalized = text.replace(/\r/g, '\n').trim();
  const matches = [...normalized.matchAll(/^##\s+Item\s+(\d{1,2})\b.*$/gim)];
  if (!matches.length) return [];
  return matches.map((match, index) => {
    const number = Number(match[1]);
    const start = match.index;
    const end = matches[index + 1]?.index ?? normalized.length;
    const block = cleanupText(normalized.slice(start, end));
    return {
      id: `ZO-${number}`,
      number,
      handleidingText: block,
      handleidingSource: 'Afnamehandleiding Taalproductie-3, hoofdstuk 6.3.5'
    };
  }).filter(item => item.number >= 1 && item.number <= 36 && hasUsefulText(item.handleidingText));
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
  return `${error.message}. Tip: plak geldige JSON, een compleet \`\`\`json-blok, HTML met item-card blokken of Markdown met kopjes zoals "## Item 1".`;
}

async function exportData() {
  if (!state.data) {
    els.validation.innerHTML = '<div class="sch-warn"><strong>Nog niets te exporteren.</strong><br>Importeer eerst je privédata.</div>';
    return;
  }
  syncAllAudioSegmentsIntoData();
  const privateSourceImages = await serializeSourceImages();
  const privateScoreFormPages = await serializeScoreFormPages();
  const payload = {
    ...state.data,
    _privateAudioTimes: state.audio.saved,
    _privateSourceImages: privateSourceImages,
    _privateScoreFormPages: privateScoreFormPages,
    _privateScoreFormStrokes: state.scoreForm.strokes,
    _privateTraining: state.training,
    _exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'schlichting-privedata-backup.json';
  link.click();
  URL.revokeObjectURL(url);
}

async function clearData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SCORE_KEY);
  localStorage.removeItem(TRAINING_KEY);
  localStorage.removeItem(PREP_KEY);
  localStorage.removeItem(AUDIO_TIMES_KEY);
  localStorage.removeItem(SCORE_FORM_PENCIL_KEY);
  localStorage.removeItem(SCORE_FORM_DOCK_KEY);
  await clearSourceImageRecords();
  await clearAudioFileRecords();
  await clearScoreFormPageRecords();
  Object.values(state.sourceImages).forEach(record => {
    if (record.url) URL.revokeObjectURL(record.url);
  });
  Object.values(state.audio.groups).forEach(group => {
    if (group.url) URL.revokeObjectURL(group.url);
  });
  state.data = null;
  state.scores = [];
  state.training = { sessions: [], current: null };
  state.prep = {};
  state.sourceImages = {};
  state.audio.groups = {};
  state.audio.segments = {};
  state.audio.saved = {};
  Object.values(state.scoreForm.pages).forEach(record => {
    if (record.url) URL.revokeObjectURL(record.url);
  });
  state.scoreForm.pages = [];
  state.scoreForm.strokes = {};
  els.importText.value = '';
  els.validation.innerHTML = '<div class="sch-ok"><strong>Privédata gewist.</strong><br>Import, audio, bronfoto’s, prepnotities en scores zijn uit deze browser verwijderd.</div>';
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
    '3. Bronfoto’s staan alleen in IndexedDB van deze browser.',
    '4. Mp3’s staan alleen in IndexedDB van deze browser en worden niet online gezet.',
    '5. Scoreformulierpagina’s en potloodmarkeringen staan alleen lokaal in deze browser.',
    '6. Exporteer back-up kan bronfoto’s en scoreformulierpagina’s bevatten; deel dat bestand niet.',
    '7. Wis privédata verwijdert de lokale import.',
    '8. Gebruik geen gedeelde computer zonder daarna te wissen.'
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
  validateZinsontwikkelingCoverage(data?.zinsontwikkeling?.items || [], warnings);

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

function validateZinsontwikkelingCoverage(items, warnings) {
  if (!items.length) return;
  if (items.length < 36) warnings.push(`Zinsontwikkeling: ${items.length}/36 items aanwezig. Voor volledige afname moeten ZO-1 t/m ZO-36 gevuld zijn.`);
  const byNumber = new Set(items.map(item => Number(item.number)));
  for (let number = 1; number <= 36; number += 1) {
    if (!byNumber.has(number)) warnings.push(`Zinsontwikkeling: ZO-${number} ontbreekt.`);
  }
  items.forEach(item => {
    const label = `ZO-${item.number}`;
    if (!hasUsefulText(item.script)) warnings.push(`${label}: exacte stimuluszin/script ontbreekt.`);
    if (!hasUsefulText(item.material)) warnings.push(`${label}: materiaal ontbreekt of is niet expliciet.`);
    if (!hasUsefulList(item.instructionSteps)) warnings.push(`${label}: volledige afnamestappen ontbreken.`);
    if (!hasUsefulText(item.repeat)) warnings.push(`${label}: herhaalregel ontbreekt.`);
    if (!hasUsefulText(item.target)) warnings.push(`${label}: doelstructuur ontbreekt.`);
    if (!hasUsefulList(item.scoringDetails) && !hasUsefulText(item.scoring)) warnings.push(`${label}: specifieke scoringdetails ontbreken.`);
    if (!hasUsefulList(item.allowedVariations) && Number(item.number) >= 5) warnings.push(`${label}: toegestane variaties zijn nog niet ingevuld.`);
    if (!hasUsefulList(item.pitfalls)) warnings.push(`${label}: toetsvalkuilen ontbreken.`);
    if (item.audioCheck && !audioCheckRange(item)) warnings.push(`${label}: audioCheck heeft geen bruikbare start/eindtijd.`);
    if (item.audioCheck && !hasUsefulText(item.audioCheck.spokenStimulus)) warnings.push(`${label}: audioCheck mist een hoorbare stimulus.`);
    if (containsUnresolvedMarker(item)) warnings.push(`${label}: bevat nog BRONCONTROLE NODIG of bron_onduidelijk.`);
    if (item.privateSections && !Array.isArray(item.privateSections)) warnings.push(`${label}: privateSections moet een lijst zijn.`);
  });
}

function hasUsefulText(value) {
  const text = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return Boolean(text) && text !== 'bron_onduidelijk' && text !== 'broncontrole nodig';
}

function hasUsefulList(value) {
  return Array.isArray(value) && value.some(item => hasUsefulText(item));
}

function containsUnresolvedMarker(value) {
  if (typeof value === 'string') {
    const text = value.toLowerCase();
    return text.includes('broncontrole nodig') || text.includes('bron_onduidelijk');
  }
  if (Array.isArray(value)) return value.some(item => containsUnresolvedMarker(item));
  if (value && typeof value === 'object') return Object.values(value).some(item => containsUnresolvedMarker(item));
  return false;
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
    target.innerHTML = type === 'taalbegrip' && state.data?.taalbegrip?.sections?.length
      ? taalbegripSectionsOverviewHtml()
      : emptyStateHtml(type);
    return;
  }
  const index = clamp(state.itemIndex[type], 0, items.length - 1);
  state.itemIndex[type] = index;
  const item = items[index];
  if (type === 'zinsontwikkeling' && state.view === 'zinsontwikkeling') {
    markZinsTrainingItem(item.number, items.length);
  }
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
  const detailFacts = secondaryFacts.filter(([key]) => !['Materiaal', 'Herhalen'].includes(key));
  const factsHtml = `
    <div class="sch-facts sch-facts--compact">
      ${factHtml('Scoring', scoreText(item))}
      ${factHtml('Bron', item.source)}
      ${detailFacts.map(([key, value]) => factHtml(key, value)).join('')}
      ${factHtml('Valkuilen', listText(item.pitfalls))}
    </div>
  `;

  target.innerHTML = `
    ${type === 'zinsontwikkeling' ? trainingProgressHtml(items.length) : ''}
    <article class="sch-item-card sch-item-card--wide">
      <div class="sch-item-headline">
        <div>
          <p class="sch-label">${escapeHtml(index + 1)} van ${escapeHtml(items.length)}</p>
          <h3>${escapeHtml(title)}</h3>
        </div>
        <div class="sch-item-headline-facts">
          ${factHtml('Materiaal', item.material)}
          ${factHtml('Herhalen', item.repeat)}
        </div>
      </div>
      ${type === 'zinsontwikkeling' ? privateSectionsHtml(item, 'ZO') : ''}
      ${type === 'taalbegrip' ? taalbegripPrivateSectionsHtml(item) : ''}
      <div class="sch-script-line">${escapeHtml(displayScript(item))}</div>
      ${factsHtml}
      ${type === 'zinsontwikkeling' ? materialChecklistHtml(item) : ''}
      ${type === 'zinsontwikkeling' ? rawSourceHtml(item) : ''}
      ${type === 'zinsontwikkeling' ? audioCheckHtml(item) : ''}
      ${scoreButtons(`${type}:${item.number}`, `${type} item ${item.number}`)}
    </article>
  `;
  bindScoreButtons();
  bindAudioButtons();
  bindMaterialChecks();
  bindSourceImageControls();
  bindTrainingControls();
  renderAudioFab();
}

function displayScript(item) {
  if (hasUsefulText(privateSectionText(item, 'handleiding'))) {
    return 'Volledige afname staat hierboven in Afnamehandleiding. Gebruik die als leidend script.';
  }
  if (hasUsefulText(privateSectionText(item, 'testmap')) || hasUsefulText(item.rawBlock)) {
    return 'Korte cue uit import verborgen om verwarring te voorkomen. Gebruik de bronkaart hierboven.';
  }
  return item.fullScript || item.completeScript || item.script || 'Geen script in import.';
}

function taalbegripPrivateSectionsHtml(item) {
  const section = taalbegripSectionForItem(item.number);
  if (!section) return '';
  return privateSectionsHtml({
    ...item,
    handleidingText: section.body,
    handleidingSource: section.title,
    testmapText: item.testmapText || '',
    testmapSource: item.testmapSource || ''
  }, 'TB');
}

function taalbegripSectionForItem(itemNumber) {
  const number = Number(itemNumber);
  return (state.data?.taalbegrip?.sections || []).find(section => {
    const [start, end] = section.itemRange || [];
    return start && end && number >= start && number <= end;
  }) || null;
}

function taalbegripSectionsOverviewHtml() {
  const sections = state.data?.taalbegrip?.sections || [];
  return `
    <article class="sch-item-card sch-item-card--wide">
      <div class="sch-item-headline">
        <div>
          <p class="sch-label">Taalbegrip</p>
          <h3>Afnamehandleiding geïmporteerd</h3>
        </div>
        <div class="sch-item-headline-facts">
          ${factHtml('Secties', sections.length)}
          ${factHtml('Volgende stap', 'Importeer of plak de itemlijst/scoreformulierdata')}
        </div>
      </div>
      <div class="sch-private-sections">
        ${sections.map((section, index) => `
          <details class="sch-private-section ${index === 0 ? 'sch-private-section--handleiding' : ''}" ${index === 0 ? 'open' : ''}>
            <summary>
              <span>${escapeHtml(section.title)}</span>
              ${section.itemRange ? `<small>items ${escapeHtml(section.itemRange[0])}-${escapeHtml(section.itemRange[1])}</small>` : ''}
            </summary>
            <div class="sch-private-section-body">${formatPrivateText(section.body)}</div>
          </details>
        `).join('')}
      </div>
    </article>
  `;
}

function trainingProgressHtml(totalItems) {
  const current = ensureTrainingCurrent(totalItems, false);
  const latest = latestCompletedTrainingSession(totalItems);
  const completedToday = !current && latest?.date === localDateKey();
  const visitedCount = completedToday ? totalItems : current?.visited?.length || 0;
  const percent = totalItems ? Math.round((visitedCount / totalItems) * 100) : 0;
  const elapsed = completedToday
    ? latest.durationMs
    : current?.startedAt
      ? Math.max(0, Date.now() - new Date(current.startedAt).getTime())
      : 0;
  const streak = trainingStreak(state.training.sessions);
  const statusText = completedToday
    ? `ronde klaar · streak ${streak} dag${streak === 1 ? '' : 'en'} · ${formatDuration(elapsed)}`
    : `${percent}% doorlopen · streak ${streak} dag${streak === 1 ? '' : 'en'} · ${formatDuration(elapsed)} bezig`;
  return `
    <article class="sch-training-strip">
      <div>
        <p class="sch-label">Dagelijkse ronde</p>
        <strong>${escapeHtml(visitedCount)} / ${escapeHtml(totalItems)} items</strong>
        <span>${escapeHtml(statusText)}</span>
      </div>
      <div class="sch-training-bar" aria-label="Voortgang Zinsontwikkeling">
        <span style="width:${escapeHtml(percent)}%"></span>
      </div>
      <div class="sch-actions">
        <button class="btn btn--ghost" type="button" data-training-reset>Nieuwe ronde</button>
        <button class="btn btn--primary" type="button" data-view-score>Bekijk progressie</button>
      </div>
    </article>
  `;
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

function privateSectionsHtml(item, domain = 'ZO') {
  const sections = normalizePrivateSections(item);
  return `
    <div class="sch-private-sections">
      ${sections.map(section => `
        <details class="sch-private-section sch-private-section--${escapeHtml(section.id)}" ${section.open ? 'open' : ''}>
          <summary>
            <span>${escapeHtml(section.title || 'Privé tekst')}</span>
            ${section.source ? `<small>${escapeHtml(section.source)}</small>` : ''}
          </summary>
          ${sourceImageInlineHtml(item.number, section.id, domain)}
          <div class="sch-private-section-body">
            ${hasUsefulText(section.body)
              ? formatPrivateText(section.body)
              : `<span class="sch-empty-note">Nog leeg. Vul in je privé-JSON <code>${escapeHtml(section.field || 'privateSections')}</code> voor dit item.</span>`}
          </div>
        </details>
      `).join('')}
    </div>
  `;
}

function normalizePrivateSections(item) {
  const explicit = Array.isArray(item.privateSections) ? item.privateSections : [];
  const byTitle = new Map();
  explicit.forEach(section => {
    if (section?.title) byTitle.set(section.title.toLowerCase(), section);
    if (section?.id) byTitle.set(section.id.toLowerCase(), section);
  });
  return PRIVATE_SECTION_DEFAULTS.map(defaultSection => {
    const explicitSection = byTitle.get(defaultSection.title.toLowerCase()) || byTitle.get(defaultSection.id);
    return {
      ...defaultSection,
      ...(explicitSection || {}),
      title: explicitSection?.title || defaultSection.title,
      body: explicitSection?.body || item[defaultSection.field] || fallbackPrivateText(item, defaultSection.id),
      source: explicitSection?.source || item[defaultSection.sourceField] || ''
    };
  });
}

function privateSectionText(item, sectionId) {
  const explicit = Array.isArray(item.privateSections)
    ? item.privateSections.find(section => {
        const title = String(section?.title || '').toLowerCase();
        const id = String(section?.id || '').toLowerCase();
        return id === sectionId || title === sectionId || (sectionId === 'handleiding' && title.includes('handleiding'));
      })
    : null;
  if (hasUsefulText(explicit?.body)) return explicit.body;
  return fallbackPrivateText(item, sectionId);
}

function fallbackPrivateText(item, sectionId) {
  if (sectionId === 'handleiding') return item.handleidingText || item.manualText || '';
  if (sectionId === 'testmap') return item.testmapText || '';
  return '';
}

function formatPrivateText(value) {
  const lines = String(value || '').replace(/\r/g, '').split('\n');
  const html = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line || line === '---') {
      index += 1;
      continue;
    }

    if (/^\|.*\|$/.test(line)) {
      const tableLines = [];
      while (index < lines.length && /^\|.*\|$/.test(lines[index].trim())) {
        tableLines.push(lines[index].trim());
        index += 1;
      }
      html.push(markdownTableHtml(tableLines));
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const level = Math.min(4, heading[1].length + 2);
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^\*\*.+\*\*$/.test(line)) {
      html.push(`<h4>${inlineMarkdown(line.replace(/^\*\*|\*\*$/g, ''))}</h4>`);
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ''));
        index += 1;
      }
      html.push(`<ul>${items.map(item => `<li>${inlineMarkdown(item)}</li>`).join('')}</ul>`);
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      lines[index].trim() !== '---' &&
      !/^(#{1,4})\s+/.test(lines[index].trim()) &&
      !/^\*\*.+\*\*$/.test(lines[index].trim()) &&
      !/^[-*]\s+/.test(lines[index].trim()) &&
      !/^\|.*\|$/.test(lines[index].trim())
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    html.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
  }

  return html.join('');
}

function markdownTableHtml(lines) {
  const rows = lines
    .filter(line => !/^\|\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?$/.test(line))
    .map(line => line.replace(/^\||\|$/g, '').split('|').map(cell => cell.trim()));
  if (!rows.length) return '';
  const [head, ...body] = rows;
  return `
    <div class="sch-private-table-wrap">
      <table class="sch-private-table">
        <thead><tr>${head.map(cell => `<th>${inlineMarkdown(cell)}</th>`).join('')}</tr></thead>
        <tbody>${body.map(row => `<tr>${row.map(cell => `<td>${inlineMarkdown(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>
  `;
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replaceAll('&lt;br&gt;', '<br>')
    .replaceAll('&lt;br/&gt;', '<br>')
    .replaceAll('&lt;br /&gt;', '<br>')
    .replace(/&lt;u&gt;([\s\S]*?)&lt;\/u&gt;/g, '<u>$1</u>')
    .replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function sourceImageInlineHtml(itemNumber, kindId, domain = 'ZO') {
  const kind = SOURCE_IMAGE_KINDS.find(candidate => candidate.id === kindId);
  if (!kind) return '';
  return `<div class="sch-source-image-inline">${sourceImageSlotHtml(itemNumber, kind, domain)}</div>`;
}

function sourceImageSlotHtml(itemNumber, kind, domain = 'ZO') {
  const record = state.sourceImages[sourceImageId(itemNumber, kind.id, domain)];
  return `
    <article class="sch-source-image-slot">
      <strong>${escapeHtml(kind.label)}</strong>
      ${record ? `
        <a href="${escapeHtml(record.url)}" target="_blank" rel="noopener" class="sch-source-image-thumb" aria-label="${escapeHtml(kind.label)} ZO ${escapeHtml(itemNumber)} groot openen">
          <img src="${escapeHtml(record.url)}" alt="${escapeHtml(kind.label)} ZO ${escapeHtml(itemNumber)}" />
        </a>
        <span class="sch-audio-mini">${escapeHtml(record.fileName || 'bronfoto')}</span>
        <button class="btn btn--ghost" type="button" data-source-image-delete="${escapeHtml(kind.id)}" data-source-image-item="${escapeHtml(itemNumber)}" data-source-image-domain="${escapeHtml(domain)}">Verwijder</button>
      ` : '<div class="sch-source-image-empty">Nog geen foto</div>'}
      <label class="sch-source-image-upload">
        <span>${record ? 'Vervang foto' : 'Upload foto'}</span>
        <input type="file" accept="image/png,image/jpeg,image/webp" data-source-image-upload="${escapeHtml(kind.id)}" data-source-image-item="${escapeHtml(itemNumber)}" data-source-image-domain="${escapeHtml(domain)}" />
      </label>
    </article>
  `;
}

function audioCheckHtml(item) {
  const check = item.audioCheck;
  if (!check || typeof check !== 'object') return '';
  const range = audioCheckRange(item);
  const timing = range ? `${formatSeconds(range.start)} - ${formatSeconds(range.end)}` : 'Geen bruikbare tijd in import';
  return `
    <div class="sch-audio-check">
      <p class="sch-label">Audiocheck uit import</p>
      <div class="sch-facts">
        ${factHtml('Bestand', check.audioFile)}
        ${factHtml('Hoorbare stimulus', check.spokenStimulus)}
        ${factHtml('Tijd uit import', timing)}
        ${factHtml('Let op', listText(check.intonationNotes))}
      </div>
      <p class="sch-score-note">Gebruik dit als controlekaart. NotebookLM-tijden zijn pas betrouwbaar nadat je ze met de echte mp3 hebt nabeluisterd.</p>
    </div>
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

function bindSourceImageControls() {
  document.querySelectorAll('[data-source-image-upload]').forEach(input => {
    if (input.dataset.bound === 'true') return;
    input.dataset.bound = 'true';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;
      saveSourceImage(Number(input.dataset.sourceImageItem), input.dataset.sourceImageUpload, file, input.dataset.sourceImageDomain || 'ZO');
    });
  });
  document.querySelectorAll('[data-source-image-delete]').forEach(button => {
    if (button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';
    button.addEventListener('click', () => {
      deleteSourceImage(Number(button.dataset.sourceImageItem), button.dataset.sourceImageDelete, button.dataset.sourceImageDomain || 'ZO');
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

function ensureTrainingCurrent(totalItems, create = true) {
  state.training.sessions = Array.isArray(state.training.sessions) ? state.training.sessions : [];
  const current = state.training.current;
  if (current && !current.completedAt) {
    current.totalItems = totalItems;
    current.visited = Array.isArray(current.visited) ? current.visited : [];
    return current;
  }
  if (!create) return current && !current.completedAt ? current : null;
  state.training.current = {
    id: `zo-${Date.now()}`,
    type: 'zinsontwikkeling',
    startedAt: new Date().toISOString(),
    totalItems,
    visited: []
  };
  saveTraining();
  return state.training.current;
}

function markZinsTrainingItem(itemNumber, totalItems) {
  const current = ensureTrainingCurrent(totalItems, true);
  const number = Number(itemNumber);
  if (!current.visited.includes(number)) {
    current.visited.push(number);
    current.visited.sort((a, b) => a - b);
    current.lastItemAt = new Date().toISOString();
    if (current.visited.length >= totalItems) completeZinsTrainingRound(current);
    saveTraining();
  }
}

function completeZinsTrainingRound(current) {
  if (current.completedAt) return;
  const now = new Date();
  const started = new Date(current.startedAt);
  const durationMs = Math.max(0, now.getTime() - started.getTime());
  const session = {
    id: current.id,
    type: 'zinsontwikkeling',
    date: localDateKey(now),
    startedAt: current.startedAt,
    completedAt: now.toISOString(),
    durationMs,
    minutes: Math.max(1, Math.round(durationMs / 60000)),
    totalItems: current.totalItems,
    visited: [...current.visited]
  };
  const existing = new Set(state.training.sessions.map(item => item.id));
  if (!existing.has(session.id)) state.training.sessions.unshift(session);
  state.training.sessions = state.training.sessions.slice(0, 120);
  state.training.current = null;
}

function resetTrainingRound() {
  state.training.current = null;
  saveTraining();
  renderCockpit('zinsontwikkeling');
  renderDashboard();
}

function saveTraining() {
  localStorage.setItem(TRAINING_KEY, JSON.stringify(state.training));
}

function bindTrainingControls() {
  document.querySelectorAll('[data-training-reset]').forEach(button => {
    if (button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';
    button.addEventListener('click', resetTrainingRound);
  });
  document.querySelectorAll('[data-view-score]').forEach(button => {
    if (button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';
    button.addEventListener('click', () => showView('dashboard'));
  });
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(dateKey, days) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + days);
  return localDateKey(date);
}

function uniqueSessionDates(sessions = []) {
  return [...new Set(sessions.map(item => item.date).filter(Boolean))].sort().reverse();
}

function latestCompletedTrainingSession(totalItems) {
  const sessions = Array.isArray(state.training.sessions) ? state.training.sessions : [];
  return sessions.find(session => session.type === 'zinsontwikkeling' && (!totalItems || session.totalItems === totalItems)) || null;
}

function trainingStreak(sessions = []) {
  const dates = new Set(uniqueSessionDates(sessions));
  let cursor = localDateKey();
  if (!dates.has(cursor) && dates.has(addDays(cursor, -1))) cursor = addDays(cursor, -1);
  let streak = 0;
  while (dates.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function formatMinutes(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) return '-';
  return `${Math.round(minutes)} min`;
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

async function importAudioGroup(group, file, options = {}) {
  const shouldPersist = options.persist !== false;
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new AudioContext();
  const decoded = await audioContext.decodeAudioData(arrayBuffer.slice(0));
  await audioContext.close();
  const objectUrl = URL.createObjectURL(file);
  if (shouldPersist) {
    await putAudioFileRecord({
      id: group.id,
      groupId: group.id,
      fileName: file.name,
      type: file.type || 'audio/mpeg',
      size: file.size,
      updatedAt: new Date().toISOString(),
      blob: file
    });
  }
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
    method: options.method || (useSaved ? 'bewaarde grenzen' : 'grootste pauzes'),
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
  els.audioPanel.querySelectorAll('[data-audio-json]').forEach(button => {
    button.addEventListener('click', () => applyImportedAudioTimes(button.dataset.audioJson));
  });
  els.audioPanel.querySelectorAll('[data-audio-time]').forEach(input => {
    input.addEventListener('change', () => updateAudioTime(input));
  });
}

function groupControlHtml(group) {
  const loaded = state.audio.groups[group.id];
  if (!loaded) return '';
  const imported = importedAudioSegmentsForGroup(group);
  const hasJsonTimes = imported.length === group.expected;
  const lastJsonEnd = imported.length ? Math.max(...imported.map(segment => segment.end)) : 0;
  return `
    <div class="sch-audio-group-control">
      <strong>${escapeHtml(group.label)}</strong>
      <button class="btn btn--ghost" type="button" data-audio-json="${escapeHtml(group.id)}" ${hasJsonTimes ? '' : 'disabled'}>Gebruik JSON-schattingen</button>
      <button class="btn btn--ghost" type="button" data-audio-autosplit="${escapeHtml(group.id)}">Detecteer opnieuw</button>
      <button class="btn btn--ghost" type="button" data-audio-equal="${escapeHtml(group.id)}">Evenredig verdelen</button>
      <span class="sch-audio-mini">${escapeHtml(loaded.method)} · JSON ${escapeHtml(imported.length)}/${escapeHtml(group.expected)}${hasJsonTimes ? ` · laatste JSON-einde ${escapeHtml(formatSeconds(lastJsonEnd))} op mp3 ${escapeHtml(formatSeconds(loaded.duration))}` : ''} · correcties worden lokaal bewaard</span>
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

function currentZinsItemNumber() {
  const items = getItems('zinsontwikkeling');
  if (!items.length) return null;
  const index = clamp(state.itemIndex.zinsontwikkeling, 0, items.length - 1);
  return Number(items[index]?.number) || null;
}

function renderAudioFab() {
  if (!els.audioFab) return;
  const itemNumber = currentZinsItemNumber();
  const segment = itemNumber ? state.audio.segments[itemNumber] : null;
  const show = state.view === 'zinsontwikkeling' && Boolean(segment);
  els.audioFab.hidden = !show;
  els.audioFab.classList.toggle('is-playing', Boolean(show && state.audio.currentItem === itemNumber && !els.audioPlayer.paused));
  if (!show) return;
  els.audioFabTitle.textContent = `ZO ${itemNumber}`;
  els.audioFabTime.textContent = `${formatSeconds(segment.start)} - ${formatSeconds(segment.end)}`;
}

function renderScoreFormPaper() {
  if (!els.scoreFormPaper) return;
  const pages = state.scoreForm.pages.sort((a, b) => Number(a.pageNumber) - Number(b.pageNumber));
  const active = pages.find(record => Number(record.pageNumber) === Number(state.scoreForm.page)) || pages[0];
  if (active) state.scoreForm.page = Number(active.pageNumber);
  els.scoreFormPaper.innerHTML = `
    <div class="sch-paper-tool">
      <div class="sch-paper-toolbar">
        <label class="sch-paper-upload">
          <span>${pages.length ? 'Vervang pagina’s' : 'Upload pagina’s'}</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" multiple data-scoreform-upload />
        </label>
        <button class="btn btn--ghost ${state.scoreForm.mode === 'pencil' ? 'is-active' : ''}" type="button" data-scoreform-mode="pencil">Potlood</button>
        <button class="btn btn--ghost ${state.scoreForm.mode === 'eraser' ? 'is-active' : ''}" type="button" data-scoreform-mode="eraser">Gum</button>
        <button class="btn btn--ghost" type="button" data-scoreform-undo ${active ? '' : 'disabled'}>Ongedaan</button>
        <button class="btn btn--ghost" type="button" data-scoreform-clear-page ${active ? '' : 'disabled'}>Wis pagina</button>
        <button class="btn btn--ghost" type="button" data-scoreform-clear-all ${pages.length ? '' : 'disabled'}>Wis alles</button>
        <button class="btn btn--primary" type="button" data-scoreform-export-page ${active ? '' : 'disabled'}>Exporteer pagina</button>
        <label class="sch-paper-size">
          <span>Dikte</span>
          <input type="range" min="2" max="18" value="${escapeHtml(state.scoreForm.size || 5)}" data-scoreform-size />
        </label>
        <span class="sch-audio-mini">${escapeHtml(pages.length)} pagina${pages.length === 1 ? '' : "'s"} lokaal opgeslagen</span>
      </div>
      ${pages.length ? `
        <div class="sch-paper-pages">
          ${pages.map(record => `<button class="btn btn--ghost ${Number(record.pageNumber) === Number(state.scoreForm.page) ? 'is-active' : ''}" type="button" data-scoreform-page="${escapeHtml(record.pageNumber)}">${escapeHtml(record.pageNumber)}</button>`).join('')}
        </div>
        <div class="sch-paper-desk">
          <div class="sch-paper-sheet">
            <img src="${escapeHtml(active.url)}" alt="Scoreformulier pagina ${escapeHtml(active.pageNumber)}" data-scoreform-image />
            <canvas data-scoreform-canvas></canvas>
          </div>
        </div>
        <p class="sch-score-note">Gebruik dit als digitaal potlood. De scanpagina’s en markeringen blijven lokaal in deze browser; ze worden niet meegecommit.</p>
      ` : `
        <div class="sch-audio-drop">
          <strong>Nog geen scoreformulierpagina’s.</strong>
          <p>Selecteer lokale PNG/JPG/WebP-pagina’s, bijvoorbeeld pagina 01 t/m 07. De tool sorteert op bestandsnaam en bewaart ze lokaal in deze browser.</p>
        </div>
      `}
    </div>
  `;
  bindScoreFormPaper();
}

function bindScoreFormPaper() {
  const root = els.scoreFormPaper;
  root.querySelector('[data-scoreform-upload]')?.addEventListener('change', event => importScoreFormPages(event.target.files));
  root.querySelectorAll('[data-scoreform-mode]').forEach(button => {
    button.addEventListener('click', () => {
      state.scoreForm.mode = button.dataset.scoreformMode;
      renderScoreFormPaper();
    });
  });
  root.querySelector('[data-scoreform-size]')?.addEventListener('input', event => {
    state.scoreForm.size = Number(event.target.value);
  });
  root.querySelectorAll('[data-scoreform-page]').forEach(button => {
    button.addEventListener('click', () => {
      state.scoreForm.page = Number(button.dataset.scoreformPage);
      renderScoreFormPaper();
    });
  });
  root.querySelector('[data-scoreform-undo]')?.addEventListener('click', undoScoreFormStroke);
  root.querySelector('[data-scoreform-clear-page]')?.addEventListener('click', clearScoreFormPage);
  root.querySelector('[data-scoreform-clear-all]')?.addEventListener('click', clearScoreFormTool);
  root.querySelector('[data-scoreform-export-page]')?.addEventListener('click', exportScoreFormPage);
  const image = root.querySelector('[data-scoreform-image]');
  const canvas = root.querySelector('[data-scoreform-canvas]');
  if (image && canvas) {
    const setup = () => setupScoreFormCanvas(image, canvas);
    if (image.complete) setup();
    image.addEventListener('load', setup, { once: true });
    window.addEventListener('resize', setup, { once: true });
  }
}

async function importScoreFormPages(fileList) {
  const files = [...(fileList || [])]
    .filter(file => file.type.startsWith('image/'))
    .sort((a, b) => a.name.localeCompare(b.name, 'nl', { numeric: true }));
  if (!files.length) {
    window.alert('Kies PNG/JPG/WebP-afbeeldingen van je scoreformulier.');
    return;
  }
  await clearScoreFormPageRecords();
  state.scoreForm.pages.forEach(record => {
    if (record.url) URL.revokeObjectURL(record.url);
  });
  state.scoreForm.pages = [];
  state.scoreForm.strokes = {};
  localStorage.removeItem(SCORE_FORM_PENCIL_KEY);
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const record = {
      id: `scoreform-page-${index + 1}`,
      pageNumber: index + 1,
      fileName: file.name,
      type: file.type,
      size: file.size,
      updatedAt: new Date().toISOString(),
      blob: file
    };
    await putScoreFormPageRecord(record);
    state.scoreForm.pages.push({ ...record, url: URL.createObjectURL(file) });
  }
  state.scoreForm.page = 1;
  renderScoreFormPaper();
}

function scoreFormPageKey() {
  return `page_${state.scoreForm.page}`;
}

function setupScoreFormCanvas(image, canvas) {
  const rect = image.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const ratio = window.devicePixelRatio || 1;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  const context = canvas.getContext('2d');
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  redrawScoreFormCanvas(canvas);
  canvas.onpointerdown = event => startScoreFormStroke(event, canvas);
  canvas.onpointermove = event => moveScoreFormStroke(event, canvas);
  canvas.onpointerup = event => endScoreFormStroke(event, canvas);
  canvas.onpointercancel = event => endScoreFormStroke(event, canvas);
}

function scoreFormPoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / rect.width,
    y: (event.clientY - rect.top) / rect.height
  };
}

function startScoreFormStroke(event, canvas) {
  event.preventDefault();
  canvas.setPointerCapture(event.pointerId);
  state.scoreForm.activeStroke = {
    mode: state.scoreForm.mode || 'pencil',
    size: Number(state.scoreForm.size || 5),
    points: [scoreFormPoint(event, canvas)]
  };
}

function moveScoreFormStroke(event, canvas) {
  if (!state.scoreForm.activeStroke) return;
  event.preventDefault();
  state.scoreForm.activeStroke.points.push(scoreFormPoint(event, canvas));
  redrawScoreFormCanvas(canvas, state.scoreForm.activeStroke);
}

function endScoreFormStroke(event, canvas) {
  if (!state.scoreForm.activeStroke) return;
  event.preventDefault();
  const stroke = state.scoreForm.activeStroke;
  state.scoreForm.activeStroke = null;
  if (stroke.points.length > 1) {
    const key = scoreFormPageKey();
    state.scoreForm.strokes[key] = state.scoreForm.strokes[key] || [];
    state.scoreForm.strokes[key].push(stroke);
    localStorage.setItem(SCORE_FORM_PENCIL_KEY, JSON.stringify(state.scoreForm.strokes));
  }
  redrawScoreFormCanvas(canvas);
}

function redrawScoreFormCanvas(canvas, extraStroke = null) {
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  const strokes = [...(state.scoreForm.strokes[scoreFormPageKey()] || [])];
  if (extraStroke) strokes.push(extraStroke);
  strokes.forEach(stroke => drawScoreFormStroke(canvas, stroke));
}

function drawScoreFormStroke(canvas, stroke) {
  const context = canvas.getContext('2d');
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (!stroke.points?.length) return;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.lineWidth = stroke.size || 5;
  if (stroke.mode === 'eraser') {
    context.globalCompositeOperation = 'destination-out';
    context.strokeStyle = 'rgba(0,0,0,1)';
  } else {
    context.globalCompositeOperation = 'source-over';
    context.strokeStyle = 'rgba(36,59,83,.92)';
  }
  context.beginPath();
  context.moveTo(stroke.points[0].x * width, stroke.points[0].y * height);
  stroke.points.slice(1).forEach(point => context.lineTo(point.x * width, point.y * height));
  context.stroke();
  context.globalCompositeOperation = 'source-over';
}

function undoScoreFormStroke() {
  const key = scoreFormPageKey();
  state.scoreForm.strokes[key] = state.scoreForm.strokes[key] || [];
  state.scoreForm.strokes[key].pop();
  localStorage.setItem(SCORE_FORM_PENCIL_KEY, JSON.stringify(state.scoreForm.strokes));
  renderScoreFormPaper();
}

function clearScoreFormPage() {
  if (!window.confirm(`Markeringen op pagina ${state.scoreForm.page} wissen?`)) return;
  state.scoreForm.strokes[scoreFormPageKey()] = [];
  localStorage.setItem(SCORE_FORM_PENCIL_KEY, JSON.stringify(state.scoreForm.strokes));
  renderScoreFormPaper();
}

async function clearScoreFormTool() {
  if (!window.confirm('Alle scoreformulierpagina’s en potloodmarkeringen uit deze browser wissen?')) return;
  await clearScoreFormPageRecords();
  state.scoreForm.pages.forEach(record => {
    if (record.url) URL.revokeObjectURL(record.url);
  });
  state.scoreForm.pages = [];
  state.scoreForm.strokes = {};
  state.scoreForm.page = 1;
  localStorage.removeItem(SCORE_FORM_PENCIL_KEY);
  renderScoreFormPaper();
}

async function exportScoreFormPage() {
  const root = els.scoreFormPaper;
  const image = root.querySelector('[data-scoreform-image]');
  const canvas = root.querySelector('[data-scoreform-canvas]');
  if (!image || !canvas) return;
  const output = document.createElement('canvas');
  output.width = image.naturalWidth;
  output.height = image.naturalHeight;
  const context = output.getContext('2d');
  context.drawImage(image, 0, 0, output.width, output.height);
  context.drawImage(canvas, 0, 0, output.width, output.height);
  const link = document.createElement('a');
  link.href = output.toDataURL('image/png');
  link.download = `scoreformulier-pagina-${state.scoreForm.page}-met-markeringen.png`;
  link.click();
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
  state.audio.currentItem = itemNumber;
  els.audioPlayer.src = group.url;
  els.audioPlayer.currentTime = Math.max(0, segment.start - padding);
  const stop = () => {
    if (els.audioPlayer.currentTime >= Math.min(group.duration, segment.end + padding)) {
      els.audioPlayer.pause();
      els.audioPlayer.removeEventListener('timeupdate', stop);
      state.audio.activeStop = null;
      state.audio.currentItem = null;
      renderAudioFab();
    }
  };
  state.audio.activeStop = stop;
  els.audioPlayer.addEventListener('timeupdate', stop);
  els.audioPlayer.play().then(renderAudioFab).catch(renderAudioFab);
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

function applyImportedAudioTimes(groupId) {
  const groupDef = AUDIO_GROUPS.find(group => group.id === groupId);
  const group = state.audio.groups[groupId];
  if (!groupDef || !group) return;
  const imported = importedAudioSegmentsForGroup(groupDef);
  if (imported.length !== groupDef.expected) {
    window.alert(`Voor ${groupDef.label} zijn ${imported.length}/${groupDef.expected} JSON-tijden beschikbaar. Vul eerst alle audioCheck-tijden aan.`);
    return;
  }
  const lastJsonEnd = Math.max(...imported.map(segment => segment.end));
  const message = [
    `${groupDef.label}: JSON-tijden toepassen?`,
    '',
    `Dit overschrijft je huidige handmatige audio-grenzen voor ${groupDef.label}.`,
    `Laatste JSON-einde: ${formatSeconds(lastJsonEnd)}. Mp3-duur: ${formatSeconds(group.duration)}.`,
    '',
    'Gebruik dit alleen als je zeker weet dat de JSON-tijden jouw gecorrigeerde timestamps zijn.'
  ].join('\n');
  if (!window.confirm(message)) return;
  const next = imported.map(segment => {
    const start = clamp(roundTime(segment.start), 0, group.duration);
    const end = clamp(roundTime(segment.end), 0, group.duration);
    return {
      item: segment.item,
      groupId,
      start,
      end
    };
  }).filter(segment => segment.end > segment.start);
  if (next.length !== groupDef.expected) {
    window.alert('Een of meer JSON-tijden vallen buiten de mp3 of hebben geen geldige duur. Controleer estimatedStart en estimatedEnd.');
    return;
  }
  group.segments = next;
  group.method = 'JSON-tijden uit import';
  next.forEach(segment => {
    state.audio.segments[segment.item] = segment;
  });
  saveAudioSegments(groupId);
  renderAudioImport();
  renderAudioPanel();
  renderCockpit('zinsontwikkeling');
}

function importedAudioSegmentsForGroup(group) {
  return getItems('zinsontwikkeling')
    .filter(item => Number(item.number) >= group.start && Number(item.number) <= group.end)
    .map(item => {
      const checkGroup = audioGroupIdFromCheck(item);
      if (checkGroup && checkGroup !== group.id) return null;
      const range = audioCheckRange(item);
      if (!range) return null;
      return {
        item: Number(item.number),
        groupId: group.id,
        start: range.start,
        end: range.end
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.item - b.item);
}

function audioGroupIdFromCheck(item) {
  const file = String(item?.audioCheck?.audioFile || '').toLowerCase();
  if (file.includes('zo1-10') || file.includes('zo1_10')) return 'zo1-10';
  if (file.includes('zo11-20') || file.includes('zo11_20')) return 'zo11-20';
  if (file.includes('zo21-36') || file.includes('zo21_36')) return 'zo21-36';
  return audioGroupForItem(Number(item?.number))?.id || '';
}

function audioGroupForItem(itemNumber) {
  return AUDIO_GROUPS.find(group => itemNumber >= group.start && itemNumber <= group.end) || null;
}

function audioCheckRange(item) {
  const check = item?.audioCheck;
  if (!check || typeof check !== 'object') return null;
  const start = parseTimestamp(check.estimatedStart);
  const end = parseTimestamp(check.estimatedEnd);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  return { start: roundTime(start), end: roundTime(end) };
}

function parseTimestamp(value) {
  if (typeof value === 'number') return value;
  const text = String(value || '').trim().replace(',', '.');
  if (!text) return NaN;
  if (/^\d+(?:\.\d+)?$/.test(text)) return Number(text);
  const parts = text.split(':').map(part => Number(part));
  if (parts.some(part => !Number.isFinite(part))) return NaN;
  if (parts.length === 2) return (parts[0] * 60) + parts[1];
  if (parts.length === 3) return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
  return NaN;
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
  syncAudioSegmentsIntoData(groupId);
}

function syncAllAudioSegmentsIntoData() {
  Object.keys(state.audio.groups).forEach(groupId => syncAudioSegmentsIntoData(groupId));
}

function syncAudioSegmentsIntoData(groupId) {
  const group = state.audio.groups[groupId];
  const items = state.data?.zinsontwikkeling?.items;
  if (!group || !Array.isArray(items)) return;
  group.segments.forEach(segment => {
    const item = items.find(candidate => Number(candidate.number) === Number(segment.item));
    if (!item) return;
    item.audioCheck = {
      ...(item.audioCheck || {}),
      audioFile: item.audioCheck?.audioFile || group.fileName || '',
      estimatedStart: formatTimestamp(segment.start),
      estimatedEnd: formatTimestamp(segment.end)
    };
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function formatTimestamp(value) {
  const safe = roundTime(value);
  const minutes = Math.floor(safe / 60);
  const seconds = safe - (minutes * 60);
  const secondsText = seconds < 10 ? `0${seconds.toFixed(2)}` : seconds.toFixed(2);
  return `${minutes}:${secondsText}`;
}

async function loadStoredAudioFiles() {
  const records = await getAllAudioFileRecords();
  for (const record of records) {
    const group = AUDIO_GROUPS.find(item => item.id === record.groupId || item.id === record.id);
    if (!group || !record.blob) continue;
    const file = new File([record.blob], record.fileName || `${group.id}.mp3`, { type: record.type || 'audio/mpeg' });
    await importAudioGroup(group, file, { persist: false, method: 'opgeslagen mp3 + bewaarde grenzen' });
  }
}

async function clearAudio() {
  Object.values(state.audio.groups).forEach(group => {
    if (group.url) URL.revokeObjectURL(group.url);
  });
  els.audioPlayer.pause();
  els.audioPlayer.removeAttribute('src');
  state.audio.groups = {};
  state.audio.segments = {};
  state.audio.saved = {};
  await clearAudioFileRecords();
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
  const sessions = Array.isArray(state.training.sessions) ? state.training.sessions : [];
  const durations = sessions.map(item => item.minutes).filter(value => Number.isFinite(value) && value > 0);
  const lastSession = sessions[0];
  const lastSeven = durations.slice(0, 7);
  const lastSevenAverage = lastSeven.length ? lastSeven.reduce((sum, value) => sum + value, 0) / lastSeven.length : 0;
  const fastest = durations.length ? Math.min(...durations) : 0;
  const streak = trainingStreak(sessions);
  els.dashboard.innerHTML = `
    <div class="sch-dashboard-section">
      <div class="sch-dashboard-section-head">
        <div>
          <p class="sch-label">Dagelijkse ZO-ronde</p>
          <h3>Maak de ketting zichtbaar</h3>
        </div>
        <button class="btn btn--primary" type="button" data-view-zins>Verder trainen</button>
      </div>
      <div class="sch-dashboard-grid">
        ${statHtml('Streak', `${streak} dag${streak === 1 ? '' : 'en'}`)}
        ${statHtml('Rondes', sessions.length)}
        ${statHtml('Laatste tijd', lastSession ? formatMinutes(lastSession.minutes) : '-')}
        ${statHtml('Snelste', fastest ? formatMinutes(fastest) : '-')}
      </div>
      <div class="sch-dashboard-grid sch-dashboard-grid--compact">
        ${statHtml('Gem. laatste 7', lastSevenAverage ? formatMinutes(lastSevenAverage) : '-')}
        ${statHtml('Vandaag', sessions.some(item => item.date === localDateKey()) ? 'klaar' : 'open')}
        ${statHtml('Dekking', lastSession ? `${lastSession.visited?.length || 0}/${lastSession.totalItems || 36}` : '-')}
        ${statHtml('Tempo', trainingTempoLabel(sessions))}
      </div>
      <div class="sch-history sch-training-history">
        ${sessions.length ? sessions.slice(0, 8).map(session => `
          <article>
            <strong>${escapeHtml(formatDateLabel(session.date))}</strong><br>
            ${escapeHtml(formatMinutes(session.minutes))} · ${escapeHtml(session.visited?.length || 0)} / ${escapeHtml(session.totalItems || 36)} items
          </article>
        `).join('') : '<article>Nog geen volledige Zinsontwikkeling-ronde. Doorloop alle ZO-items één keer om je eerste streak-dag te zetten.</article>'}
      </div>
    </div>
    <div class="sch-dashboard-section">
      <div class="sch-dashboard-section-head">
        <div>
          <p class="sch-label">Meetbaar maken</p>
          <h3>Progressie die echt iets zegt</h3>
        </div>
      </div>
      <div class="sch-metric-list">
        ${metricHtml('Dekking', 'Heb je alle ZO-items gezien, niet alleen je favorieten?')}
        ${metricHtml('Rondetijd', 'Wordt de route sneller zonder dat je slordig wordt?')}
        ${metricHtml('Streak', 'Hoeveel dagen achter elkaar hou je het vast?')}
        ${metricHtml('Zelfscore', 'Scoor timing, materiaalregie en scoring steeds 0-4.')}
        ${metricHtml('Foutenreeks', 'Noteer waar je 2 dagen achter elkaar struikelt. Dat zijn je drill-items.')}
        ${metricHtml('Papiercheck', 'Gebruik het potloodformulier om na afloop handmatig je scorecontrole te doen.')}
      </div>
    </div>
    <div class="sch-dashboard-section">
      <div class="sch-dashboard-section-head">
        <div>
          <p class="sch-label">Toetsklaar-score</p>
          <h3>Strenge oefenscores</h3>
        </div>
      </div>
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
    </div>
  `;
  els.dashboard.querySelector('[data-view-zins]')?.addEventListener('click', () => showView('zinsontwikkeling'));
}

function statHtml(label, value) {
  return `<article class="sch-dashboard-stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`;
}

function metricHtml(label, text) {
  return `<article><strong>${escapeHtml(label)}</strong><span>${escapeHtml(text)}</span></article>`;
}

function trainingTempoLabel(sessions) {
  if (!sessions.length) return '-';
  if (sessions.length === 1) return 'basislijn';
  const latest = sessions[0].minutes;
  const previous = sessions[1].minutes;
  if (!Number.isFinite(latest) || !Number.isFinite(previous)) return '-';
  if (latest < previous) return `${previous - latest} min sneller`;
  if (latest > previous) return `${latest - previous} min trager`;
  return 'gelijk';
}

function formatDateLabel(dateKey) {
  if (!dateKey) return 'Onbekende datum';
  const today = localDateKey();
  if (dateKey === today) return 'Vandaag';
  if (dateKey === addDays(today, -1)) return 'Gisteren';
  const [year, month, day] = dateKey.split('-');
  return `${day}-${month}-${year}`;
}

function factHtml(label, value) {
  return `<dl><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || 'Niet ingevuld')}</dd></dl>`;
}

function listText(value) {
  if (Array.isArray(value)) return value.join(' · ');
  return value || '';
}

function scoreText(item) {
  const score = String(item?.scoring || '').trim();
  const details = listText(item?.scoringDetails);
  if (!score || score === '1' || score === '0/1') return details || score;
  return details ? `${score} · ${details}` : score;
}

async function loadSourceImages() {
  const records = await getAllSourceImageRecords();
  Object.values(state.sourceImages).forEach(record => {
    if (record.url) URL.revokeObjectURL(record.url);
  });
  state.sourceImages = {};
  records.forEach(record => {
    state.sourceImages[record.id] = {
      ...record,
      url: URL.createObjectURL(record.blob)
    };
  });
}

async function loadScoreFormPages() {
  const records = await getAllScoreFormPageRecords();
  state.scoreForm.pages.forEach(record => {
    if (record.url) URL.revokeObjectURL(record.url);
  });
  state.scoreForm.pages = records
    .map(record => ({ ...record, url: URL.createObjectURL(record.blob) }))
    .sort((a, b) => Number(a.pageNumber) - Number(b.pageNumber));
  if (!state.scoreForm.pages.some(record => Number(record.pageNumber) === Number(state.scoreForm.page))) {
    state.scoreForm.page = state.scoreForm.pages[0]?.pageNumber || 1;
  }
}

async function saveSourceImage(itemNumber, kind, file, domain = 'ZO') {
  if (!file.type.startsWith('image/')) {
    window.alert('Kies een PNG, JPG of WebP-afbeelding.');
    return;
  }
  const id = sourceImageId(itemNumber, kind, domain);
  const record = {
    id,
    domain,
    itemNumber,
    kind,
    fileName: file.name,
    type: file.type,
    size: file.size,
    updatedAt: new Date().toISOString(),
    blob: file
  };
  await putSourceImageRecord(record);
  const previous = state.sourceImages[id];
  if (previous?.url) URL.revokeObjectURL(previous.url);
  state.sourceImages[id] = {
    ...record,
    url: URL.createObjectURL(file)
  };
  renderCockpit(domain === 'TB' ? 'taalbegrip' : 'zinsontwikkeling');
}

async function deleteSourceImage(itemNumber, kind, domain = 'ZO') {
  const id = sourceImageId(itemNumber, kind, domain);
  await deleteSourceImageRecord(id);
  if (state.sourceImages[id]?.url) URL.revokeObjectURL(state.sourceImages[id].url);
  delete state.sourceImages[id];
  renderCockpit(domain === 'TB' ? 'taalbegrip' : 'zinsontwikkeling');
}

async function serializeSourceImages() {
  const records = await getAllSourceImageRecords();
  return Promise.all(records.map(async record => ({
    id: record.id,
    domain: record.domain || inferSourceImageDomain(record.id),
    itemNumber: record.itemNumber,
    kind: record.kind,
    fileName: record.fileName,
    type: record.type,
    size: record.size,
    updatedAt: record.updatedAt,
    dataUrl: await blobToDataUrl(record.blob)
  })));
}

async function restoreSourceImages(records) {
  await clearSourceImageRecords();
  Object.values(state.sourceImages).forEach(record => {
    if (record.url) URL.revokeObjectURL(record.url);
  });
  state.sourceImages = {};
  for (const record of records) {
    if (!record?.id || !record?.dataUrl) continue;
    const blob = dataUrlToBlob(record.dataUrl);
    const restored = {
      id: record.id,
      domain: record.domain || inferSourceImageDomain(record.id),
      itemNumber: Number(record.itemNumber),
      kind: record.kind,
      fileName: record.fileName || 'bronfoto',
      type: record.type || blob.type || 'image/png',
      size: record.size || blob.size,
      updatedAt: record.updatedAt || new Date().toISOString(),
      blob
    };
    await putSourceImageRecord(restored);
    state.sourceImages[restored.id] = {
      ...restored,
      url: URL.createObjectURL(blob)
    };
  }
}

async function serializeScoreFormPages() {
  const records = await getAllScoreFormPageRecords();
  return Promise.all(records.map(async record => ({
    id: record.id,
    pageNumber: record.pageNumber,
    fileName: record.fileName,
    type: record.type,
    size: record.size,
    updatedAt: record.updatedAt,
    dataUrl: await blobToDataUrl(record.blob)
  })));
}

async function restoreScoreFormPages(records) {
  await clearScoreFormPageRecords();
  state.scoreForm.pages.forEach(record => {
    if (record.url) URL.revokeObjectURL(record.url);
  });
  state.scoreForm.pages = [];
  for (const record of records) {
    if (!record?.id || !record?.dataUrl) continue;
    const blob = dataUrlToBlob(record.dataUrl);
    const restored = {
      id: record.id,
      pageNumber: Number(record.pageNumber),
      fileName: record.fileName || `scoreformulier-pagina-${record.pageNumber}`,
      type: record.type || blob.type || 'image/png',
      size: record.size || blob.size,
      updatedAt: record.updatedAt || new Date().toISOString(),
      blob
    };
    await putScoreFormPageRecord(restored);
    state.scoreForm.pages.push({ ...restored, url: URL.createObjectURL(blob) });
  }
  state.scoreForm.pages.sort((a, b) => Number(a.pageNumber) - Number(b.pageNumber));
  state.scoreForm.page = state.scoreForm.pages[0]?.pageNumber || 1;
}

function sourceImageId(itemNumber, kind, domain = 'ZO') {
  return `${domain}-${itemNumber}:${kind}`;
}

function inferSourceImageDomain(id = '') {
  return String(id).startsWith('TB-') ? 'TB' : 'ZO';
}

function openSourceImageDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(SOURCE_IMAGE_DB, 3);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SOURCE_IMAGE_STORE)) {
        const store = db.createObjectStore(SOURCE_IMAGE_STORE, { keyPath: 'id' });
        store.createIndex('itemNumber', 'itemNumber', { unique: false });
      }
      if (!db.objectStoreNames.contains(AUDIO_FILE_STORE)) {
        db.createObjectStore(AUDIO_FILE_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(SCORE_FORM_PAGE_STORE)) {
        const store = db.createObjectStore(SCORE_FORM_PAGE_STORE, { keyPath: 'id' });
        store.createIndex('pageNumber', 'pageNumber', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAllSourceImageRecords() {
  const db = await openSourceImageDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SOURCE_IMAGE_STORE, 'readonly');
    const request = transaction.objectStore(SOURCE_IMAGE_STORE).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

async function putSourceImageRecord(record) {
  const db = await openSourceImageDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SOURCE_IMAGE_STORE, 'readwrite');
    const request = transaction.objectStore(SOURCE_IMAGE_STORE).put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

async function deleteSourceImageRecord(id) {
  const db = await openSourceImageDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SOURCE_IMAGE_STORE, 'readwrite');
    const request = transaction.objectStore(SOURCE_IMAGE_STORE).delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

async function clearSourceImageRecords() {
  const db = await openSourceImageDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SOURCE_IMAGE_STORE, 'readwrite');
    const request = transaction.objectStore(SOURCE_IMAGE_STORE).clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

async function getAllAudioFileRecords() {
  const db = await openSourceImageDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(AUDIO_FILE_STORE, 'readonly');
    const request = transaction.objectStore(AUDIO_FILE_STORE).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

async function putAudioFileRecord(record) {
  const db = await openSourceImageDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(AUDIO_FILE_STORE, 'readwrite');
    const request = transaction.objectStore(AUDIO_FILE_STORE).put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

async function clearAudioFileRecords() {
  const db = await openSourceImageDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(AUDIO_FILE_STORE, 'readwrite');
    const request = transaction.objectStore(AUDIO_FILE_STORE).clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

async function getAllScoreFormPageRecords() {
  const db = await openSourceImageDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SCORE_FORM_PAGE_STORE, 'readonly');
    const request = transaction.objectStore(SCORE_FORM_PAGE_STORE).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

async function putScoreFormPageRecord(record) {
  const db = await openSourceImageDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SCORE_FORM_PAGE_STORE, 'readwrite');
    const request = transaction.objectStore(SCORE_FORM_PAGE_STORE).put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

async function clearScoreFormPageRecords() {
  const db = await openSourceImageDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SCORE_FORM_PAGE_STORE, 'readwrite');
    const request = transaction.objectStore(SCORE_FORM_PAGE_STORE).clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function dataUrlToBlob(dataUrl) {
  const [header, base64] = String(dataUrl).split(',');
  const mime = header.match(/data:(.*?);base64/)?.[1] || 'application/octet-stream';
  const binary = atob(base64 || '');
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mime });
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

function formatSeconds(value) {
  const safe = Math.max(0, Number(value) || 0);
  const minutes = Math.floor(safe / 60);
  const seconds = Math.round((safe - (minutes * 60)) * 100) / 100;
  const secondsText = seconds < 10 ? `0${seconds}` : String(seconds);
  return `${minutes}:${secondsText}s`;
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
