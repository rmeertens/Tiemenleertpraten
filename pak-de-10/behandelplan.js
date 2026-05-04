'use strict';

const fields = Array.from(document.querySelectorAll('#writer-fields textarea'));
const writerScore = document.getElementById('writer-score');
const writerHint = document.getElementById('writer-hint');
const writerNote = document.getElementById('writer-note');
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
  const filled = fields.filter(field => field.value.trim().split(/\s+/).length >= 12).length;
  const score = Math.round((filled / fields.length) * 100);
  writerScore.textContent = `${score}%`;
  writerHint.textContent = score >= 90
    ? 'Sterk stramien. Oefen nu hardop in 90 seconden.'
    : 'Vul ieder kopje met casusbewijs en een toetswaardige redenering.';
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
  }

  if (writerRecording) {
    writerRecognition.stop();
    return;
  }

  writerRecording = true;
  button.textContent = 'Stop dicteren';
  writerNote.textContent = 'Dicteren loopt. Je tekst komt in het tekstvak waar je het laatst in klikte.';
  writerRecognition.start();
}
