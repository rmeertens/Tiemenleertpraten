'use strict';

const fields = Array.from(document.querySelectorAll('#writer-fields textarea'));
const writerScore = document.getElementById('writer-score');
const writerHint = document.getElementById('writer-hint');
const writerNote = document.getElementById('writer-note');
const writerScan = document.getElementById('writer-scan');
const storageKey = 'pak10_behandelplan_concept';

let activeField = fields[0];
let writerRecognition = null;
let writerRecording = false;

restoreConcept();
updateScore();

fields.forEach(field => {
  field.addEventListener('focus', () => {
    activeField = field;
  });
  field.addEventListener('input', () => {
    saveConcept();
    updateScore();
  });
});

document.getElementById('writer-check').addEventListener('click', updateScore);
document.getElementById('writer-speak').addEventListener('click', toggleWriterSpeech);
document.getElementById('writer-clear').addEventListener('click', () => {
  fields.forEach(field => {
    field.value = '';
  });
  saveConcept();
  updateScore();
  writerNote.textContent = 'Concept gewist.';
});

function updateScore() {
  const completeFields = fields.filter(field => field.value.trim().split(/\s+/).length >= 12);
  const filled = completeFields.length;
  const score = Math.round((filled / fields.length) * 100);
  writerScore.textContent = `${score}%`;
  writerHint.textContent = score >= 90
    ? 'Sterk stramien. Oefen nu hardop in 90 seconden.'
    : 'Vul ieder kopje met casusbewijs en een toetswaardige redenering.';
  renderWriterScan(completeFields);
}

function renderWriterScan(completeFields) {
  const completeSet = new Set(completeFields);
  const labelForField = field => field.closest('article')?.querySelector('.ten-card__label')?.textContent.trim() || 'Kopje';
  const good = completeFields.map(labelForField);
  const missing = fields.filter(field => !completeSet.has(field)).map(labelForField);
  writerScan.hidden = false;
  writerScan.innerHTML = `
    <strong>Coachscan behandelplan</strong>
    <div class="coach-scan__grid">
      ${writerScanGroup('is-good', 'Groen · voldoende gevuld', good, 'Nog geen kopjes toetsklaar gevuld.')}
      ${writerScanGroup('is-missing', 'Rood · vul nog aan', missing, 'Alle kopjes zijn minimaal gevuld.')}
      ${writerScanGroup('is-vague', 'Geel · maak scherper', scoreSharpeners(missing.length), 'Nu hardop oefenen en inkorten.')}
    </div>
  `;
}

function writerScanGroup(className, label, items, emptyText) {
  return `
    <div class="coach-scan__group ${className}">
      <span>${label}</span>
      <ul>${(items.length ? items : [emptyText]).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </div>
  `;
}

function scoreSharpeners(missingCount) {
  if (missingCount > 3) return ['Eerst compleet maken; nog niet polijsten.'];
  if (missingCount > 0) return ['Vul de rode kopjes met casusbewijs + conclusie.'];
  return ['Zet elk kopje om naar één spreekzin voor je mondeling.'];
}

function saveConcept() {
  localStorage.setItem(storageKey, JSON.stringify(fields.map(field => field.value)));
}

function restoreConcept() {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  fields.forEach((field, index) => {
    field.value = saved[index] || '';
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toggleWriterSpeech() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    writerNote.textContent = 'Spraakherkenning werkt niet in deze browser. Typ je tekst of gebruik Chrome/Edge.';
    return;
  }

  const button = document.getElementById('writer-speak');
  if (!writerRecognition) {
    writerRecognition = new SpeechRecognition();
    writerRecognition.lang = 'nl-NL';
    writerRecognition.interimResults = true;
    writerRecognition.continuous = true;
    writerRecognition.onresult = event => {
      const text = Array.from(event.results).map(result => result[0].transcript).join(' ');
      activeField.value = `${activeField.value.trim()} ${text}`.trim();
      saveConcept();
      updateScore();
    };
    writerRecognition.onend = () => {
      writerRecording = false;
      button.textContent = 'Dicteer in actief vak';
    };
    writerRecognition.onerror = event => {
      writerRecording = false;
      button.textContent = 'Dicteer in actief vak';
      writerNote.textContent = recognitionErrorMessage(event.error, 'Dicteer in actief vak');
    };
  }

  if (writerRecording) {
    writerRecognition.stop();
    return;
  }

  writerRecording = true;
  button.textContent = 'Stop dicteren';
  writerNote.textContent = 'Dicteren loopt. Je tekst komt in het tekstvak waar je het laatst in klikte.';
  try {
    writerRecognition.start();
  } catch {
    writerRecording = false;
    button.textContent = 'Dicteer in actief vak';
    writerNote.textContent = 'De opname kon niet starten. Klik nog één keer op dicteren of typ je tekst.';
  }
}

function recognitionErrorMessage(error, actionLabel = 'Dicteer in actief vak') {
  const messages = {
    'not-allowed': 'Microfoon niet toegestaan. Geef microfoontoegang in de browser of typ je tekst.',
    'audio-capture': 'Geen microfoon gevonden. Controleer je microfoon of typ je tekst.',
    network: 'Spraakherkenning krijgt geen verbinding. Typ je tekst of probeer Chrome/Edge.',
    'no-speech': `Ik hoorde geen spraak. Klik opnieuw op ${actionLabel} en spreek iets dichter bij de microfoon.`,
    aborted: 'Opname gestopt.'
  };
  return messages[error] || 'Opname werkt hier niet goed. Typ je tekst of probeer Chrome/Edge.';
}
