'use strict';

const todayKey = localDateKey(new Date());
const dailyKey = `accelerator_daily_${todayKey}`;
const historyKey = 'accelerator_history';
const powerKey = 'accelerator_power_lines';

const tracks = [
  {
    id: 'mondeling-diagnostiek',
    title: 'Mondeling · Schlichting deel 1',
    href: '/mondeling-10/',
    storage: () => readJson('oral10_scores', {}).diagnostics || 0,
    max: 40,
    red: 'Criterium 10: eigen fout + validiteit/betrouwbaarheid hardop verantwoorden.',
    quick: 'Zeg in 30 seconden wat je doet na een procedurefout.',
    boss: 'Volledige Schlichting-ronde: startpunt, afbreekregel en foutverantwoording.'
  },
  {
    id: 'mondeling-behandeling',
    title: 'Mondeling · Behandeling deel 2',
    href: '/mondeling-10/',
    storage: () => readJson('oral10_scores', {}).therapy || 0,
    max: 40,
    red: 'Criterium 15/17: motiveer methode én therapievorm vanuit beginsituatie.',
    quick: 'Verdedig één KT-doel, methode, vorm en evaluatie in 45 seconden.',
    boss: 'Therapiegesprek: LT/KT, methode, vorm, samenwerking en prognose.'
  },
  {
    id: 'lessen',
    title: 'Lescoach · W1-W9',
    href: '/lessen-coach/',
    storage: () => masteryRatio('lessen_mastery', 'lessen_done'),
    max: 100,
    red: 'Schriftelijk en mondeling gescheiden houden: rubric versus punten/casus.',
    quick: 'Open je zwakste les en maak één schriftelijk casusantwoord.',
    boss: 'Lesboss: één leskern toepassen in mondeling én schriftelijk antwoord.'
  },
  {
    id: 'flits',
    title: 'Flitscollege Coach',
    href: '/flitscollege-coach/',
    storage: () => masteryRatio('flits_mastery', 'flits_done'),
    max: 100,
    red: 'Begrip niet los noemen: altijd kind/casus/gevolg toevoegen.',
    quick: 'Leg één flitsbegrip uit met: begrip -> casus -> daarom.',
    boss: 'Flitsboss: 10 kernbegrippen toepassen op één casus.'
  },
  {
    id: 'accent',
    title: 'Accentcoach 10',
    href: '/accentcoach-10/',
    storage: () => averageObjectScore('accent_scores', 4),
    max: 100,
    red: '4/4-ritmes: Andante/Allegro niet laten terugvallen naar Largo 3/4.',
    quick: 'Oefen één docentkeuze: Andante, Allegro of tekstniveau.',
    boss: 'Accentboss: jij start Largo, docent kiest onverwacht tweede onderdeel.'
  },
  {
    id: 'pak10',
    title: 'Pak de 10',
    href: '/pak-de-10/',
    storage: () => averageObjectScore('pak10_scores', 5),
    max: 100,
    red: 'Casusbewijs expliciet koppelen aan ICF, doel, methode en prognose.',
    quick: 'Maak één antwoord: criterium -> casusbewijs -> advies.',
    boss: 'Pak-de-10 boss: casus verdedigen zonder modelantwoord.'
  },
  {
    id: 'stotter-alfa',
    title: 'Stotter Alfa',
    href: '/stotter-alfa/',
    storage: () => stutterProgress(),
    max: 100,
    red: 'Maak van controle weer communicatie: analyseer één moment met de zeshoek.',
    quick: 'Doe de 12-minuten dagroute en bewaar één log.',
    boss: 'Alfa boss: spreekmoment beschrijven, dam vinden en één mini-exposure kiezen.'
  }
];

const dailyTemplates = [
  ['Snelle winst', 'quick'],
  ['Rood naar groen', 'red'],
  ['Herhaling', 'quick'],
  ['Eindbaas', 'boss']
];

const done = readJson(dailyKey, {});
const dailyFeed = document.getElementById('daily-feed');
const heatmap = document.getElementById('heatmap');
const bossList = document.getElementById('boss-list');
const powerInput = document.getElementById('power-input');
const powerLines = document.getElementById('power-lines');

render();

document.getElementById('reset-daily').addEventListener('click', () => {
  localStorage.removeItem(dailyKey);
  Object.keys(done).forEach(key => delete done[key]);
  render();
});

document.getElementById('save-power').addEventListener('click', savePowerLine);
powerInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') savePowerLine();
});

function render() {
  const ranked = rankedTracks();
  renderDaily(ranked);
  renderHeatmap(ranked);
  renderNext(ranked[0]);
  renderBosses(ranked);
  renderPowerLines();
}

function renderDaily(ranked) {
  const picks = dailyTemplates.map(([label, field], index) => {
    const track = ranked[(index + (field === 'boss' ? 1 : 0)) % ranked.length];
    return { id: `${label}:${track.id}`, label, field, track };
  });
  const complete = picks.filter(item => done[item.id]).length;
  updateHistory(complete === picks.length);
  const streak = streakDays();
  document.getElementById('daily-count').textContent = `${complete}/${picks.length}`;
  document.getElementById('daily-hint').textContent = complete === picks.length
    ? `Dag rond. Reeks: ${streak} dag${streak === 1 ? '' : 'en'}.`
    : `${picks.length - complete} kleine acties open. Reeks: ${streak} dag${streak === 1 ? '' : 'en'}.`;

  dailyFeed.innerHTML = picks.map(item => `
    <article class="accelerator-task ${done[item.id] ? 'is-done' : ''}">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.track.title)}</strong>
      <p>${escapeHtml(item.track[item.field])}</p>
      <div>
        <a class="btn btn--primary" href="${item.track.href}">Oefen</a>
        <button class="btn btn--ghost" type="button" data-done="${escapeHtml(item.id)}">${done[item.id] ? 'Gedaan' : 'Markeer groen'}</button>
      </div>
    </article>
  `).join('');

  dailyFeed.querySelectorAll('[data-done]').forEach(button => {
    button.addEventListener('click', () => {
      done[button.dataset.done] = !done[button.dataset.done];
      localStorage.setItem(dailyKey, JSON.stringify(done));
      render();
    });
  });
}

function renderHeatmap(ranked) {
  heatmap.innerHTML = ranked.map(track => {
    const pct = progress(track);
    const state = pct >= 80 ? 'is-green' : pct >= 50 ? 'is-yellow' : 'is-red';
    return `
      <a class="accelerator-heat ${state}" href="${track.href}">
        <span>${escapeHtml(track.title)}</span>
        <strong>${pct}%</strong>
        <meter min="0" max="100" value="${pct}">${pct}%</meter>
        <small>${escapeHtml(pct >= 80 ? 'toetsklaar houden' : track.red)}</small>
      </a>
    `;
  }).join('');
}

function renderNext(track) {
  document.getElementById('next-title').textContent = track.title;
  document.getElementById('next-body').textContent = track.red;
  document.getElementById('next-link').href = track.href;
}

function renderBosses(ranked) {
  bossList.innerHTML = ranked.map(track => `
    <article class="accelerator-boss">
      <span>${progress(track) >= 70 ? 'Klaar voor boss fight' : 'Eerst rood wegwerken'}</span>
      <strong>${escapeHtml(track.title)}</strong>
      <p>${escapeHtml(track.boss)}</p>
      <a class="btn btn--ghost" href="${track.href}">Start boss</a>
    </article>
  `).join('');
}

function renderPowerLines() {
  const lines = readJson(powerKey, []);
  powerLines.innerHTML = lines.length ? lines.map((line, index) => `
    <article>
      <p>${escapeHtml(line)}</p>
      <button type="button" data-delete="${index}">Verwijder</button>
    </article>
  `).join('') : '<p class="accelerator-empty">Nog geen powerzinnen bewaard.</p>';
  powerLines.querySelectorAll('[data-delete]').forEach(button => {
    button.addEventListener('click', () => {
      const current = readJson(powerKey, []);
      current.splice(Number(button.dataset.delete), 1);
      localStorage.setItem(powerKey, JSON.stringify(current));
      renderPowerLines();
    });
  });
}

function savePowerLine() {
  const value = powerInput.value.trim();
  if (!value) return;
  const lines = readJson(powerKey, []);
  lines.unshift(value);
  localStorage.setItem(powerKey, JSON.stringify(lines.slice(0, 12)));
  powerInput.value = '';
  renderPowerLines();
}

function rankedTracks() {
  return tracks
    .map(track => ({ ...track, pct: progress(track) }))
    .sort((a, b) => a.pct - b.pct);
}

function progress(track) {
  const value = Number(track.storage() || 0);
  return Math.max(0, Math.min(100, Math.round((value / track.max) * 100)));
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
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.round((avg / maxScore) * 100);
}

function stutterProgress() {
  const daily = readJson(`stotter_alfa_daily_${todayKey}`, {});
  const logs = readJson('stotter_alfa_logs', []);
  const dailyScore = Object.values(daily).filter(Boolean).length * 14;
  const logScore = Math.min(30, logs.length * 6);
  return Math.min(100, dailyScore + logScore);
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function updateHistory(isComplete) {
  const history = readJson(historyKey, {});
  if (isComplete) {
    history[todayKey] = true;
  } else {
    delete history[todayKey];
  }
  localStorage.setItem(historyKey, JSON.stringify(history));
}

function streakDays() {
  const history = readJson(historyKey, {});
  let date = new Date();
  let count = 0;
  while (history[localDateKey(date)]) {
    count += 1;
    date.setDate(date.getDate() - 1);
  }
  return count;
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
