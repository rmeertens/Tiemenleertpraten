'use strict';

const progressTracks = [
  {
    id: 'lessen',
    title: 'Collegecoach',
    href: '/lessen-coach/',
    score: () => masteryRatio('lessen_mastery', 'lessen_done')
  },
  {
    id: 'pak10',
    title: 'Pak de 10',
    href: '/pak-de-10/',
    score: () => averageObjectScore('pak10_scores', 5)
  },
  {
    id: 'mondeling',
    title: 'Mondeling 10',
    href: '/mondeling-10/',
    score: () => {
      const scores = readJson('oral10_scores', { diagnostics: 0, therapy: 0 });
      return Math.round(((Number(scores.diagnostics || 0) + Number(scores.therapy || 0)) / 80) * 100);
    }
  },
  {
    id: 'flits',
    title: 'Flitscollege Coach',
    href: '/flitscollege-coach/',
    score: () => masteryRatio('flits_mastery', 'flits_done')
  },
  {
    id: 'regelcheck',
    title: 'Regelcheck',
    href: '/regelcheck/',
    score: () => Number(localStorage.getItem('regelcheck_progress') || 0)
  },
  {
    id: 'ipa',
    title: 'IPA Studio',
    href: '/ipa-studio/',
    score: () => drillProgress('tlp.ipa.v1', 4)
  },
  {
    id: 'paren',
    title: 'Minimale Paren',
    href: '/minimale-paren/',
    score: () => drillProgress('tlp.mp.v1', 4)
  }
];

renderSpraakTaalProgress();

function renderSpraakTaalProgress() {
  const scored = progressTracks.map(track => ({ ...track, pct: clampPercent(track.score()) }));
  const average = scored.length
    ? Math.round(scored.reduce((sum, track) => sum + track.pct, 0) / scored.length)
    : 0;
  const lowest = [...scored].sort((a, b) => a.pct - b.pct)[0];
  const green = scored.filter(track => track.pct >= 80).length;

  setText('domain-progress-label', `${average}%`);
  const meter = document.getElementById('domain-progress-meter');
  if (meter) meter.value = average;

  setText('lowest-progress-title', lowest ? lowest.title : 'Collegecoach');
  setText('lowest-progress-hint', lowest ? progressHint(lowest.pct) : 'Begin bij de kleinste balk.');
  setText('green-progress-count', `${green} van ${scored.length}`);

  const next = document.getElementById('next-progress-link');
  if (next && lowest) {
    next.href = lowest.href;
    next.textContent = `Open ${lowest.title} →`;
  }

  scored.forEach(updateCard);
}

function updateCard(track) {
  const card = document.querySelector(`[data-progress-card="${track.id}"]`);
  if (!card) return;
  card.dataset.progressState = track.pct >= 80 ? 'green' : track.pct >= 50 ? 'yellow' : 'red';
  const bar = card.querySelector('.tool__progress i');
  const label = card.querySelector('.tool__progress em');
  if (bar) bar.style.width = `${track.pct}%`;
  if (label) label.textContent = `${track.pct}%`;
}

function masteryRatio(masteryKeyName, doneKeyName) {
  const mastery = readJson(masteryKeyName, {});
  const doneMap = readJson(doneKeyName, {});
  const mastered = Object.values(mastery).reduce((sum, item) => {
    if (!item || typeof item !== 'object') return sum;
    return sum + Object.values(item).filter(Boolean).length;
  }, 0);
  const doneCount = Object.values(doneMap).filter(Boolean).length;
  return Math.min(100, mastered * 3 + doneCount * 8);
}

function averageObjectScore(key, maxScore) {
  const values = Object.values(readJson(key, {})).map(Number).filter(value => !Number.isNaN(value));
  if (!values.length) return 0;
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.round((average / maxScore) * 100);
}

function drillProgress(key, multiplier) {
  const state = readJson(key, { correct: 0, boxes: {} });
  const correctScore = Number(state.correct || 0) * multiplier;
  const boxScore = Object.values(state.boxes || {}).reduce((sum, value) => sum + Math.max(0, Number(value || 1) - 1), 0);
  return Math.min(100, correctScore + boxScore);
}

function progressHint(pct) {
  if (pct >= 80) return 'Groen houden met korte herhaling.';
  if (pct >= 50) return 'Bijna groen: maak één toetsantwoord.';
  return 'Rood: start hier met één kleine oefening.';
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
