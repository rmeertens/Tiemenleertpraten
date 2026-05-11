'use strict';

const searchStopwords = new Set([
  'waar', 'wordt', 'worden', 'iets', 'over', 'gezegd', 'staat', 'staan', 'de', 'het', 'een',
  'in', 'op', 'van', 'voor', 'naar', 'en', 'of', 'bij', 'met', 'wat', 'welke', 'dit', 'dat',
  'er', 'is', 'zijn', 'ik', 'je', 'jij', 'we', 'ons'
]);

const searchSynonyms = {
  morfosyntaxis: ['morfosyntaxis', 'morfologie', 'syntaxis', 'zinsbouw', 'grammatica', 'woordvormen', 'woordvolgorde'],
  morfologisch: ['morfologie', 'morfosyntaxis', 'woordvormen', 'werkwoordsvormen'],
  syntaxis: ['syntaxis', 'zinsbouw', 'morfosyntaxis', 'woordvolgorde'],
  tos: ['tos', 'taalontwikkelingsstoornis', 'spraaktaalstoornis', 's-tos'],
  pragmatiek: ['pragmatiek', 'beurtwisseling', 'perspectief', 'topic', 'narratief', 'taalgebruik'],
  afbreekregel: ['afbreekregel', 'stopregel', 'plafondregel', 'terugkeerregel', 'startpunt'],
  schlichting: ['schlichting', 'taalbegrip', 'zinsontwikkeling', 'testafname'],
  icf: ['icf', 'functie', 'activiteit', 'participatie', 'externe factoren'],
  meertaligheid: ['meertaligheid', 'meertalig', 'thuistaal', 'nt2', 'taalaanbod'],
  fonologie: ['fonologie', 'fonologisch', 'contrast', 'minimale paren', 'klanksysteem'],
  fonetiek: ['fonetiek', 'fonetisch', 'articulatie', 'motorisch', 'klankvorming']
};

const searchDocs = buildSearchDocs();

document.querySelectorAll('[data-site-search]').forEach(section => {
  const input = section.querySelector('[data-site-search-input]');
  const button = section.querySelector('[data-site-search-button]');
  const results = section.querySelector('[data-site-search-results]');
  if (!input || !button || !results) return;

  const run = () => renderSearchResults(input.value, results);
  button.addEventListener('click', run);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') run();
  });
});

function buildSearchDocs() {
  const docs = [];
  const lessons = window.LESSEN_DATA?.lessons || [];
  const flits = window.FLITS_DATA?.lessons || [];

  lessons.forEach(lesson => {
    docs.push({
      type: 'Les',
      source: 'Collegecoach',
      title: lesson.title,
      href: `/lessen-coach/?lesson=${encodeURIComponent(lesson.id)}`,
      text: flatten([
        lesson.title, lesson.date, lesson.domain, lesson.tags, lesson.summary, lesson.core,
        lesson.anchors, lesson.checks, lesson.oralPrompt, lesson.writtenPrompt,
        lesson.oralModel, lesson.writtenModel, lesson.criteria, lesson.writtenFocus,
        lesson.pitfall, lesson.zg, lesson.flits
      ])
    });
  });

  flits.forEach(item => {
    docs.push({
      type: 'Flitscollege',
      source: 'Flitscollege Coach',
      title: item.title,
      href: `/flitscollege-coach/?flits=${encodeURIComponent(item.id)}`,
      text: flatten([
        item.title, item.domain, item.tags, item.summary, item.snap, item.memory,
        item.caseQuestion, item.oralPrompt, item.model, item.checks
      ])
    });
  });

  return docs;
}

function renderSearchResults(query, target) {
  const terms = expandTerms(query);
  if (!terms.length) {
    target.innerHTML = '<p class="flits-note">Typ een begrip of vraag, bijvoorbeeld “morfosyntaxis” of “afbreekregel”.</p>';
    return;
  }

  const results = searchDocs
    .map(doc => ({ ...doc, score: scoreDoc(doc, query, terms) }))
    .filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'nl'))
    .slice(0, 8);

  if (!results.length) {
    target.innerHTML = `
      <p class="flits-note">Ik vind dit nog niet in Collegecoach of de bestaande flitscolleges. Probeer een kernwoord zoals TOS, pragmatiek, fonologie of Schlichting.</p>
    `;
    return;
  }

  target.innerHTML = `
    <p class="flits-note">Gevonden bronnen voor: <strong>${escapeHtml(query.trim())}</strong></p>
    <div class="site-question__result-list">
      ${results.map(doc => resultCard(doc, terms)).join('')}
    </div>
  `;
}

function resultCard(doc, terms) {
  return `
    <article class="site-question__result">
      <span>${escapeHtml(doc.type)} · ${escapeHtml(doc.source)}</span>
      <strong>${escapeHtml(doc.title)}</strong>
      <p>${escapeHtml(snippetFor(doc.text, terms))}</p>
      <a href="${doc.href}">Open bron &rarr;</a>
    </article>
  `;
}

function scoreDoc(doc, query, terms) {
  const haystack = normalize(doc.text);
  const title = normalize(doc.title);
  const compactQuery = normalize(query).trim();
  let score = 0;

  if (compactQuery && haystack.includes(compactQuery)) score += 8;
  terms.forEach(term => {
    if (!term) return;
    if (title.includes(term)) score += 6;
    if (haystack.includes(term)) score += 2;
    score += countOccurrences(haystack, term);
  });

  if (doc.type === 'Les') score += 0.5;
  return score;
}

function expandTerms(query) {
  const base = normalize(query)
    .split(/[^a-z0-9-]+/g)
    .filter(term => term.length > 1 && !searchStopwords.has(term));
  const expanded = new Set(base);

  base.forEach(term => {
    (searchSynonyms[term] || []).forEach(extra => expanded.add(normalize(extra)));
  });

  return [...expanded];
}

function snippetFor(text, terms) {
  const chunks = String(text)
    .split(/(?<=[.!?])\s+|\n+/)
    .map(chunk => chunk.trim())
    .filter(Boolean);
  const hit = chunks.find(chunk => {
    const clean = normalize(chunk);
    return terms.some(term => clean.includes(term));
  });
  return truncate(hit || chunks[0] || text, 220);
}

function flatten(value) {
  if (Array.isArray(value)) return value.map(flatten).join(' ');
  if (value && typeof value === 'object') return Object.values(value).map(flatten).join(' ');
  return value == null ? '' : String(value);
}

function countOccurrences(text, term) {
  if (!term) return 0;
  return text.split(term).length - 1;
}

function truncate(value, max) {
  const text = String(value).replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
}

function normalize(value) {
  return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
