// IPA Studio — Modus A (De Kaart) + Modus B (Drie Knoppen)
//
// Geen build-step, geen frameworks. Vanilla JS module.
// State (Leitner-box voor SRS) gaat in localStorage onder 'tlp.ipa.v1'.

import {
  CONSONANTEN, KLINKERS, DIFTONGEN,
  PLAATSEN, MANIEREN, STEM,
  KLINKER_TONG, KLINKER_OPENING, KLINKER_ROND,
} from "/ipa-studio/inventory.js";

const AUDIO_BASE = "/ipa-studio/audio/";
const STORAGE_KEY = "tlp.ipa.v1";

// ============ Audio met nette fallback ============

const audioCache = new Map();
const audioMissing = new Set();

function tryPlay(filename) {
  if (!filename || audioMissing.has(filename)) return Promise.resolve(false);
  let a = audioCache.get(filename);
  if (!a) {
    a = new Audio(AUDIO_BASE + filename);
    a.preload = "auto";
    audioCache.set(filename, a);
  }
  a.currentTime = 0;
  return a.play().then(() => true).catch(() => {
    audioMissing.add(filename);
    return false;
  });
}

// ============ Modus-switch ============

const modeButtons = document.querySelectorAll(".mode-btn");
const modusKaart = document.getElementById("modus-kaart");
const modusDrill = document.getElementById("modus-drill");

modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    modeButtons.forEach(b => b.setAttribute("aria-selected", b === btn ? "true" : "false"));
    const mode = btn.dataset.mode;
    modusKaart.hidden = mode !== "kaart";
    modusDrill.hidden = mode !== "drill";
    if (mode === "drill") drillNext();
  });
});

// ============ Modus A — De Kaart ============

const detailSymbol = document.getElementById("detail-symbol");
const detailPlaceholder = document.getElementById("detail-placeholder");
const detailFeatures = document.getElementById("detail-features");
const detailExample = document.getElementById("detail-example");
const playBtn = document.getElementById("play-btn");
const audioMissingNote = document.getElementById("audio-missing-note");

let activePhoneme = null;

function renderKaart() {
  fillGrid("consonanten", CONSONANTEN);
  fillGrid("klinkers",    KLINKERS);
  fillGrid("diftongen",   DIFTONGEN);
}

function fillGrid(key, items) {
  const grid = document.querySelector(`[data-grid="${key}"]`);
  grid.innerHTML = "";
  for (const item of items) {
    const btn = document.createElement("button");
    btn.className = "phoneme";
    btn.type = "button";
    btn.setAttribute("aria-pressed", "false");
    btn.dataset.ipa = item.ipa;
    btn.innerHTML = `
      <span class="phoneme__symbol">${item.ipa}</span>
      <span class="phoneme__example">${item.voorbeeld}</span>
    `;
    btn.addEventListener("click", () => selectPhoneme(item, btn));
    grid.appendChild(btn);
  }
}

async function selectPhoneme(item, btn) {
  document.querySelectorAll(".phoneme").forEach(el =>
    el.setAttribute("aria-pressed", el === btn ? "true" : "false")
  );
  activePhoneme = item;

  detailSymbol.textContent = item.ipa;
  detailPlaceholder.hidden = true;
  detailFeatures.hidden = false;
  detailExample.hidden = false;

  detailFeatures.innerHTML = featuresHtml(item);
  detailExample.textContent = `Voorbeeld: "${item.voorbeeld}"`;

  playBtn.disabled = false;

  const ok = await tryPlay(item.audio);
  audioMissingNote.hidden = ok;
}

function featuresHtml(item) {
  if (item.plaats) {
    return [
      featurePill("Plaats", item.plaats),
      featurePill("Manier", item.manier),
      featurePill("Stem", item.stem ? "stemhebbend" : "stemloos"),
    ].join("");
  }
  if (item.tong) {
    return [
      featurePill("Tong", item.tong),
      featurePill("Mond", item.opening),
      featurePill("Lippen", item.rond ? "gerond" : "ongerond"),
    ].join("");
  }
  return `<span class="phoneme-detail__feature">Tweeklank &mdash; <strong>${item.voorbeeld}</strong></span>`;
}

function featurePill(label, val) {
  return `<span class="phoneme-detail__feature">${label}<strong>${val}</strong></span>`;
}

playBtn.addEventListener("click", async () => {
  if (!activePhoneme) return;
  const ok = await tryPlay(activePhoneme.audio);
  audioMissingNote.hidden = ok;
});

// ============ Modus B — Drie Knoppen drill ============
//
// Leitner: 5 boxen. Goed = box +1, fout = terug naar box 1.
// Trek met kans evenredig aan (6 - box) — lagere boxen vaker.

const ALL_DRILLABLE = [
  ...CONSONANTEN.map(c => ({ kind: "consonant", ...c })),
  ...KLINKERS.map(c    => ({ kind: "klinker",   ...c })),
];

const drillSymbol   = document.getElementById("drill-symbol");
const drillPlay     = document.getElementById("drill-play");
const drillRows     = document.getElementById("drill-rows");
const drillFeedback = document.getElementById("drill-feedback");
const drillCheck    = document.getElementById("drill-check");
const drillNextBtn  = document.getElementById("drill-next");
const drillCorrect  = document.getElementById("drill-correct");
const drillStreak   = document.getElementById("drill-streak");
const drillBoxLabel = document.getElementById("drill-box");

let state = loadState();
let current = null;
let selected = {};
let answered = false;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { boxes: {}, correct: 0, streak: 0 };
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function getBox(ipa) { return state.boxes[ipa] ?? 1; }
function setBox(ipa, n) { state.boxes[ipa] = Math.max(1, Math.min(5, n)); }

function pickItem() {
  const weighted = ALL_DRILLABLE.flatMap(item => {
    const weight = 6 - getBox(item.ipa);
    return Array(weight).fill(item);
  });
  let next = weighted[Math.floor(Math.random() * weighted.length)];
  if (current && next.ipa === current.ipa && weighted.length > 1) {
    next = weighted[(weighted.indexOf(next) + 1) % weighted.length];
  }
  return next;
}

function drillNext() {
  current = pickItem();
  selected = {};
  answered = false;
  drillSymbol.textContent = current.ipa;
  drillFeedback.className = "feedback";
  drillFeedback.textContent = "";
  drillCheck.hidden = false;
  drillCheck.disabled = true;
  drillNextBtn.hidden = true;

  renderKnopRows();
  updateProgress();
  tryPlay(current.audio);
}

function renderKnopRows() {
  drillRows.innerHTML = "";
  if (current.kind === "consonant") {
    drillRows.append(
      knopRow("Plaats", "plaats", PLAATSEN),
      knopRow("Manier", "manier", MANIEREN),
      knopRow("Stem",   "stem",   STEM),
    );
  } else {
    drillRows.append(
      knopRow("Tong",   "tong",    KLINKER_TONG),
      knopRow("Mond",   "opening", KLINKER_OPENING),
      knopRow("Lippen", "rond",    KLINKER_ROND),
    );
  }
}

function knopRow(label, key, options) {
  const row = document.createElement("div");
  row.className = "knop-row";
  row.innerHTML = `<span class="knop-row__label">${label}</span>`;
  const buttons = document.createElement("div");
  buttons.className = "knop-row__buttons";
  for (const opt of options) {
    const b = document.createElement("button");
    b.className = "knop";
    b.type = "button";
    b.textContent = opt;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => {
      if (answered) return;
      selected[key] = opt;
      buttons.querySelectorAll(".knop").forEach(el =>
        el.setAttribute("aria-pressed", el === b ? "true" : "false")
      );
      drillCheck.disabled = !allAnswered();
    });
    buttons.appendChild(b);
  }
  row.appendChild(buttons);
  return row;
}

function allAnswered() {
  if (current.kind === "consonant") {
    return selected.plaats && selected.manier && selected.stem;
  }
  return selected.tong && selected.opening && selected.rond;
}

function checkAnswer() {
  if (answered) return;
  answered = true;
  drillCheck.hidden = true;
  drillNextBtn.hidden = false;

  let correct = true;
  let detail = [];
  if (current.kind === "consonant") {
    const truth = {
      plaats: current.plaats,
      manier: current.manier,
      stem:   current.stem ? "stemhebbend" : "stemloos",
    };
    for (const k of ["plaats", "manier", "stem"]) {
      const ok = selected[k] === truth[k];
      if (!ok) correct = false;
      detail.push(`${labelFor(k)}: ${selected[k]} ${ok ? "✓" : "✗ — was " + truth[k]}`);
    }
  } else {
    const truth = {
      tong:    current.tong,
      opening: current.opening,
      rond:    current.rond ? "gerond" : "ongerond",
    };
    for (const k of ["tong", "opening", "rond"]) {
      const ok = selected[k] === truth[k];
      if (!ok) correct = false;
      detail.push(`${labelFor(k)}: ${selected[k]} ${ok ? "✓" : "✗ — was " + truth[k]}`);
    }
  }

  if (correct) {
    state.correct++;
    state.streak++;
    setBox(current.ipa, getBox(current.ipa) + 1);
    drillFeedback.className = "feedback feedback--good";
    drillFeedback.innerHTML = `<strong>Goed.</strong> /${current.ipa}/ &middot; "${current.voorbeeld}"`;
  } else {
    state.streak = 0;
    setBox(current.ipa, 1);
    drillFeedback.className = "feedback feedback--bad";
    drillFeedback.innerHTML = `<strong>Net niet.</strong> ${detail.join(" &middot; ")}`;
  }
  saveState();
  updateProgress();
}

function labelFor(k) {
  return ({ plaats: "Plaats", manier: "Manier", stem: "Stem",
           tong: "Tong", opening: "Mond", rond: "Lippen" })[k];
}

function updateProgress() {
  drillCorrect.textContent = state.correct;
  drillStreak.textContent  = state.streak;
  if (current) {
    drillBoxLabel.textContent = `${getBox(current.ipa)}/5`;
  }
}

drillCheck.addEventListener("click", checkAnswer);
drillNextBtn.addEventListener("click", drillNext);
drillPlay.addEventListener("click", () => current && tryPlay(current.audio));

// ============ Init ============

renderKaart();
updateProgress();
