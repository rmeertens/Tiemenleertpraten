// Minimale Paren — drill-logica
// Leitner 5-box SRS, identiek schema als IPA Studio.
// Audio via Web Speech API (nl-NL) — geen audiobestanden nodig.

import { PAREN as RAW } from "/minimale-paren/paren.js";

const PAREN = RAW.map((p, i) => ({ ...p, id: `mp${i}` }));
const STORAGE_KEY = "tlp.mp.v1";

// ── TTS ──────────────────────────────────────────────────────────

// Chrome pauses speechSynthesis after ~15 s of silence; this keeps
// the stream alive so audio works even after a long thinking pause.
if (window.speechSynthesis) {
  setInterval(() => {
    if (window.speechSynthesis.speaking) return;
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
  }, 10_000);
}

function speak(text) {
  if (!window.speechSynthesis) return;
  // Resume first in case Chrome silently paused the stream
  window.speechSynthesis.resume();
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "nl-NL";
  utt.rate = 0.85;
  window.speechSynthesis.speak(utt);
}

// ── State ─────────────────────────────────────────────────────────

let state = loadState();
let filter = "alle";
let current = null;   // { pair, target: "a" | "b" }
let answered = false;

function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch {}
  return { boxes: {}, correct: 0, streak: 0 };
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}
function getBox(id) { return state.boxes[id] ?? 1; }
function setBox(id, n) { state.boxes[id] = Math.max(1, Math.min(5, n)); }

// ── Pair picking ──────────────────────────────────────────────────

function pool() {
  return filter === "alle" ? PAREN : PAREN.filter(p => p.kenmerk === filter);
}

function pickPair() {
  const items = pool();
  const weighted = items.flatMap(p => Array(6 - getBox(p.id)).fill(p));
  const src = weighted.length ? weighted : items;
  let next = src[Math.floor(Math.random() * src.length)];
  if (current && next.id === current.pair.id && src.length > 1) {
    next = src.find(p => p.id !== current.pair.id) ?? next;
  }
  return next;
}

// ── DOM ───────────────────────────────────────────────────────────

const elCorrect = document.getElementById("mp-correct");
const elStreak  = document.getElementById("mp-streak");
const elBox     = document.getElementById("mp-box");
const elPlay    = document.getElementById("mp-play");
const elBtnA    = document.getElementById("mp-btn-a");
const elBtnB    = document.getElementById("mp-btn-b");
const elFeedback= document.getElementById("mp-feedback");
const elNext    = document.getElementById("mp-next");
const elHint    = document.getElementById("mp-hint");
const elNoTTS   = document.getElementById("mp-no-tts");

// ── Filter ────────────────────────────────────────────────────────

document.querySelectorAll(".mode-btn[data-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mode-btn[data-filter]").forEach(b =>
      b.setAttribute("aria-selected", b === btn ? "true" : "false")
    );
    filter = btn.dataset.filter;
    drillNext();
  });
});

// ── Drill ─────────────────────────────────────────────────────────

function drillNext() {
  answered = false;
  const pair = pickPair();
  const target = Math.random() < 0.5 ? "a" : "b";
  current = { pair, target };

  setWord(elBtnA, pair.a.woord, null);
  setWord(elBtnB, pair.b.woord, null);
  elBtnA.disabled = false;
  elBtnB.disabled = false;
  elBtnA.className = "paar-btn";
  elBtnB.className = "paar-btn";

  elFeedback.className = "feedback";
  elFeedback.textContent = "";
  elNext.hidden = true;
  elHint.hidden = true;

  updateProgress();
  speak(pair[target].woord);
}

function setWord(btn, woord, ipa) {
  btn.querySelector(".paar-btn__woord").textContent = woord;
  const ipaEl = btn.querySelector(".paar-btn__ipa");
  if (ipa) {
    ipaEl.textContent = `/${ipa}/`;
    ipaEl.hidden = false;
  } else {
    ipaEl.textContent = "";
    ipaEl.hidden = true;
  }
}

function handleAnswer(choice) {
  if (answered) return;
  answered = true;

  elBtnA.disabled = true;
  elBtnB.disabled = true;

  const { pair, target } = current;
  const correct = choice === target;

  if (correct) {
    state.correct++;
    state.streak++;
    setBox(pair.id, getBox(pair.id) + 1);
  } else {
    state.streak = 0;
    setBox(pair.id, 1);
  }
  saveState();
  updateProgress();

  // Reveal IPA on both buttons
  setWord(elBtnA, pair.a.woord, pair.a.ipa);
  setWord(elBtnB, pair.b.woord, pair.b.ipa);

  const chosenBtn  = choice === "a" ? elBtnA : elBtnB;
  const correctBtn = target === "a"  ? elBtnA : elBtnB;

  if (correct) {
    chosenBtn.classList.add("paar-btn--goed");
    elFeedback.className = "feedback feedback--good";
    elFeedback.innerHTML = `<strong>Goed.</strong> /${pair[target].ipa}/ — "${pair[target].woord}"`;
  } else {
    chosenBtn.classList.add("paar-btn--fout");
    correctBtn.classList.add("paar-btn--gemist");
    elFeedback.className = "feedback feedback--bad";
    elFeedback.innerHTML = `<strong>Net niet.</strong> Het was /${pair[target].ipa}/ — "${pair[target].woord}"`;
  }

  const labels = { stem: "Stem", plaats: "Plaats", manier: "Manier" };
  elHint.textContent = `${labels[pair.kenmerk]}: /${pair.contrast[0]}/ ↔ /${pair.contrast[1]}/`;
  elHint.hidden = false;
  elNext.hidden = false;
}

elBtnA.addEventListener("click", () => handleAnswer("a"));
elBtnB.addEventListener("click", () => handleAnswer("b"));
elPlay.addEventListener("click", () => current && speak(current.pair[current.target].woord));
elNext.addEventListener("click", drillNext);

function updateProgress() {
  elCorrect.textContent = state.correct;
  elStreak.textContent  = state.streak;
  if (current) elBox.textContent = `${getBox(current.pair.id)}/5`;
}

// ── TTS check ────────────────────────────────────────────────────

if (!window.speechSynthesis) {
  elNoTTS.hidden = false;
}

// ── Init ──────────────────────────────────────────────────────────

drillNext();
