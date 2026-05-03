'use strict';

const input = document.getElementById('splitter-input');
const form = document.getElementById('splitter-form');
const results = document.getElementById('splitter-results');
const clearBtn = document.getElementById('clear-btn');
const modeBtns = document.querySelectorAll('[data-mode]');
const exampleBtns = document.querySelectorAll('[data-example]');
const template = document.getElementById('word-template');

const SOUND_GROUPS = [
  'aai', 'ooi', 'oei', 'eeuw', 'ieuw',
  'sch', 'ng', 'nk', 'ch',
  'oe', 'eu', 'ui', 'ij', 'ei', 'ou', 'au', 'ie',
  'aa', 'ee', 'oo', 'uu',
];
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);
const VOWEL_GROUPS = new Set(['a', 'e', 'i', 'o', 'u', 'y', 'aa', 'ee', 'oo', 'uu', 'oe', 'eu', 'ui', 'ij', 'ei', 'ou', 'au', 'ie', 'aai', 'ooi', 'oei', 'eeuw', 'ieuw']);

let currentMode = 'full';

form.addEventListener('submit', event => {
  event.preventDefault();
  render();
});

input.addEventListener('input', () => {
  if (input.value.trim()) render();
  else renderEmpty();
});

clearBtn.addEventListener('click', () => {
  input.value = '';
  renderEmpty();
  input.focus();
});

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentMode = btn.dataset.mode;
    modeBtns.forEach(item => item.setAttribute('aria-selected', String(item === btn)));
    document.body.dataset.splitMode = currentMode;
  });
});

exampleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    input.value = btn.dataset.example;
    render();
    input.focus();
  });
});

renderEmpty();

function render() {
  const words = tokenize(input.value);
  results.innerHTML = '';

  if (!words.length) {
    renderEmpty();
    return;
  }

  words.map(analyzeWord).forEach(analysis => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector('h3').textContent = analysis.word;
    node.querySelector('[data-slot="syllables"]').append(...makePills(analysis.syllables, 'syllable'));
    node.querySelector('[data-slot="sounds"]').append(...makePills(analysis.sounds, 'sound'));
    node.querySelector('[data-slot="vowels"]').textContent = analysis.vowels.length ? analysis.vowels.join(', ') : 'geen';
    node.querySelector('[data-slot="clusters"]').textContent = analysis.clusters.length ? analysis.clusters.join(', ') : 'geen opvallende clusters';
    node.querySelector('[data-slot="steps"]').textContent = buildPracticeSteps(analysis);
    node.querySelector('.split-speak').addEventListener('click', () => speak(analysis.word));
    results.appendChild(node);
  });
}

function renderEmpty() {
  results.innerHTML = `
    <article class="split-empty">
      <h2>Begin met een woord of zin.</h2>
      <p>Kies een voorbeeld of typ zelf iets. De analyse blijft lokaal in je browser.</p>
    </article>
  `;
}

function tokenize(raw) {
  return raw
    .toLowerCase()
    .replace(/[^\p{L}\s'-]/gu, ' ')
    .split(/\s+/)
    .map(word => word.replace(/^[-']+|[-']+$/g, ''))
    .filter(Boolean)
    .slice(0, 18);
}

function analyzeWord(word) {
  const sounds = splitSounds(word);
  return {
    word,
    sounds,
    syllables: splitSyllables(word),
    vowels: sounds.filter(sound => VOWEL_GROUPS.has(sound) || [...sound].some(char => VOWELS.has(char))),
    clusters: findClusters(sounds),
  };
}

function splitSounds(word) {
  const clean = word.normalize('NFC');
  const sounds = [];
  let index = 0;

  while (index < clean.length) {
    const match = SOUND_GROUPS.find(group => clean.startsWith(group, index));
    if (match) {
      sounds.push(match);
      index += match.length;
    } else {
      sounds.push(clean[index]);
      index += 1;
    }
  }

  return sounds;
}

function splitSyllables(word) {
  const sounds = splitSounds(word);
  if (sounds.length <= 3) return [word];

  const vowelIndexes = sounds
    .map((sound, index) => isVowelSound(sound) ? index : -1)
    .filter(index => index >= 0);

  if (vowelIndexes.length <= 1) return [word];

  const boundaries = [];

  for (let i = 0; i < vowelIndexes.length - 1; i++) {
    const leftVowel = vowelIndexes[i];
    const rightVowel = vowelIndexes[i + 1];
    const consonantsBetween = rightVowel - leftVowel - 1;

    if (consonantsBetween <= 0) {
      boundaries.push(leftVowel + 1);
    } else if (consonantsBetween === 1) {
      boundaries.push(leftVowel + 1);
    } else {
      boundaries.push(rightVowel - 1);
    }
  }

  const syllables = [];
  let start = 0;

  boundaries.forEach(boundary => {
    syllables.push(sounds.slice(start, boundary).join(''));
    start = boundary;
  });

  syllables.push(sounds.slice(start).join(''));
  return syllables.filter(Boolean);
}

function findClusters(sounds) {
  const clusters = [];
  let current = [];

  sounds.forEach(sound => {
    if (isVowelSound(sound)) {
      if (current.length > 1) clusters.push(current.join(''));
      current = [];
    } else {
      current.push(sound);
    }
  });

  if (current.length > 1) clusters.push(current.join(''));
  return [...new Set(clusters)];
}

function isVowelSound(sound) {
  return VOWEL_GROUPS.has(sound) || (sound.length === 1 && VOWELS.has(sound));
}

function makePills(items, type) {
  return items.map(item => {
    const pill = document.createElement('span');
    pill.className = `split-pill split-pill--${type}`;
    pill.textContent = item;
    return pill;
  });
}

function buildPracticeSteps(analysis) {
  const core = analysis.syllables.join(' → ');
  if (analysis.clusters.length) {
    return `${analysis.clusters[0]} los oefenen, daarna ${core}, daarna het hele woord.`;
  }
  if (analysis.syllables.length > 1) {
    return `${core}, daarna tempo rustig opvoeren.`;
  }
  return `${analysis.sounds.join(' + ')}, daarna samenvoegen tot ${analysis.word}.`;
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'nl-NL';
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}
