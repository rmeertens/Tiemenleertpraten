'use strict';

// ============================================================
// Interne handleidingen – nooit zichtbaar voor de student.
// De AI-coach gebruikt deze alleen als referentiekader en
// citeert er NOOIT letterlijk uit.
// ============================================================

const GUIDES = {
  taalbegrip: `
Schlichting Test voor Taalbegrip-3 — interne afnamerichtlijnen

DOEL
Objectiveren van receptieve taalontwikkeling bij kinderen 2;0–7;0 jaar.
Meetdomeinen: intonatie, woordbetekenis, woordvolgorde, vervoegingen, verbuigingen, functiewoorden.
Eindresultaat: Taalbegripsquotiënt (TBQ); TaalQ = TBQ + Taalproductiescore.

TESTSITUATIE
- Testleider zit RECHT TEGENOVER het kind aan een leeftijdsgeschikte tafel.
- A3-testmap staat TUSSEN testleider en kind.
- Testkoffer en scoreformulier zijn ONZICHTBAAR voor het kind.
- Derden (ouders/leerkrachten) zijn bij voorkeur NIET aanwezig.
- Indien derden toch aanwezig: buiten gezichtslijn kind, geen hulp, niet nadoen.
- Ruimte is vrij van speelgoed of materialen die niet bij de test horen.

VERBALE PRESENTATIE
- Sectie A: uitnodigende intonatie (jonge kinderen betrekken bij de taak).
- Secties B t/m G: NEUTRALE toon verplicht (geen prosodische hints).
- Geen nadruk op kritieke woorden (bijv. voorzetsels, kleurwoorden).
- Rustig, constant tempo; zin als geheel aanbieden.
- Geen pauzes of herhalingen tenzij het protocol dit expliciet toestaat.
- Verschil met Taalproductie-test: daar WEL correcte intonatie; hier NIET.

STARTPUNTEN EN TERUGKEERREGELS
Leeftijd 2;0–2;9   → Sectie A, item 1  (geen terugkeerregel)
Leeftijd 2;10–3;7  → Sectie A, item 9  (terug naar 2;0-instap als item 9 fout)
Leeftijd 3;8–4;2   → Sectie B, item 13 (terug naar 2;10-instap als item 13 fout)
Leeftijd 4;3–5;2   → Sectie B, item 20 (terug naar 3;8-instap als item 20 fout)
Leeftijd vanaf 5;3 → Sectie C, item 34 (terug naar B item 33 als item 34 fout of ≥5 opeenvolgende fouten in C)

SCORING
- Binair: 1 = correct, 0 = incorrect of geen reactie.
- Afbreekregels:
  • Secties A–C, E en G: na 5 OPEENVOLGENDE fouten stoppen.
  • Sectie D (items 42–49): volledig afnemen, tenzij items 38–42 allemaal fout (overgangsregel C→D).
  • Sectie F (items 56–63): volledig afnemen, tenzij items 52–56 allemaal fout (overgangsregel E→F).
- Ruwe scores → TBQ via normtabellen Bijlage II.

PROFESSIONELE REFLECTIE
- Maximaal 2 procedurele missers toegestaan in de kritieke criteria.
- Elke afwijking direct na de afname benoemen.
- Per fout analyseren: heeft dit de respons van het kind beïnvloed?
- Verantwoorden of het TBQ ondanks de afwijking als betrouwbaar beschouwd kan worden.
- Contextuele factoren beschrijven: meertaligheid, concentratie, gedragsproblematiek.
`,

  zinsontwikkeling: `
Test voor Zinsontwikkeling (ZO) — Schlichting Taalproductie-3 — interne afnamerichtlijnen

DOEL
Meten van expressieve morfosyntactische ontwikkeling bij kinderen 2;0–7;0 jaar.
Overgang van imitatie → spontane constructie is de klinische kern van dit instrument.

TESTSITUATIE
- Tafel en stoel aangepast aan de lengte van het kind.
- Materialen die niet in gebruik zijn: buiten gezichtsveld.
- Testmap zo opgesteld: kind ziet platen, testleider ziet instructies en scoringsschema.
- Houding: neutraal maar uitnodigend; geen overdreven knikken of dwingende blik.

INSTAPPUNTEN
- 2;0–3;11 jaar: start item 1 (geen oefenitems).
- 4;0–4;11 jaar: start item 5 + verplicht ook items 2c, 3c en 4c als introductie.
- 5;0 jaar en ouder: start item 10 + verplicht items 8b en 9 als oefen-/instapitems.

VERBALE PRESENTATIE
- Rustig spreektempo, natuurlijke intonatie.
- VERBODEN: over-accentuatie van de morfosyntactische doelstructuur.
- VERBODEN: vragende toon bij een mededeling.

Vier ontlokkingsmechanismen:
1. IMITATIE (items 1, 7, 9, 10, 12, 13, 14, 21, 32, 34)
   → Letterlijk aanbieden zoals voorgeschreven; daarna in stilte wachten.
   → Geen herhaling tenzij het protocol dat toestaat.
2. FUNCTIONELE SITUATIE MET VARIATIE (o.a. items 8, 11, 16–18, 20, 22–27)
   → Handeling synchroon met spraak uitvoeren; taalproductie kind is leidend.
3. AANVULLEN (items 6, 15, 28)
   → Verwachtingsvolle mimiek; pauze precies op het aanvulpunt.
   → GEEN fonologische aanzet (bijv. eerste klank van doelwoord) geven.
4. VRAAG BEANTWOORDEN (item 19)
   → Vraag: "Waarom kan die niet lopen?"
   → NIET zelf "Omdat…" beginnen.

SCORING
- Binair: Goed (1) of Fout (0).
- Items 1–4: specifieke regels voor deel-items (1c, 2c, 3c, 4c) beheersen.
- Dialect-/articulatiefouten: NIET fout scoren (morfosyntaxis staat centraal).
  Voorbeeld: "toel" i.p.v. "stoel" → 1 punt (articulatie, niet morfosyntaxis).
  Maar: "die is van mij" i.p.v. "die heb ik in mijn hand" → 0 punt (vervanging zinsdeel).
- Elke 0-score categoriseren als: Weglating / Vervanging / Invoeging.
- AFBREEKREGEL: na 5 OPEENVOLGENDE 0-scores stoppen (absoluut, geen uitzonderingen).

PROFESSIONELE REFLECTIE
- Maximaal 2 procedurele missers in de criteria 2, 3, 5 of 6.
- Missers herkennen, benoemen en klinisch verantwoorden.
- Uitleggen waarom een verspreking of afwijking de testscore kan hebben beïnvloed.
- Verantwoording = objectiveren van de eigen rol als meetinstrument in de diagnostische keten.
`,
};

// ============================================================
// State
// ============================================================
let apiKey = sessionStorage.getItem('coach_api_key') || '';
let topic = 'taalbegrip';
let history = []; // [{role:'user'|'assistant', content:'...'}]
const MODELS = ['claude-haiku-4-5-20251001', 'claude-3-5-haiku-latest'];

// ============================================================
// DOM refs
// ============================================================
const setupEl    = document.getElementById('setup');
const coachEl    = document.getElementById('coach');
const apiKeyInput = document.getElementById('api-key');
const setupBtn   = document.getElementById('setup-btn');
const setupError = document.getElementById('setup-error');
const chatWindow = document.getElementById('chat-window');
const chatForm   = document.getElementById('chat-form');
const userInput  = document.getElementById('user-input');
const sendBtn    = document.getElementById('send-btn');
const resetBtn   = document.getElementById('reset-btn');
const logoutBtn  = document.getElementById('logout-btn');
const topicBtns  = document.querySelectorAll('[data-topic]');
const promptBtns = document.querySelectorAll('[data-prompt]');

// ============================================================
// Boot
// ============================================================
if (apiKey) {
  showCoach();
} else {
  apiKeyInput.focus();
}

// ============================================================
// Event listeners
// ============================================================
setupBtn.addEventListener('click', handleSetup);
apiKeyInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSetup(); });

topicBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    topic = btn.dataset.topic;
    topicBtns.forEach(b => b.setAttribute('aria-selected', String(b === btn)));
    resetChat();
  });
});

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  submitMessage();
});

userInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    submitMessage();
  }
});

resetBtn.addEventListener('click', resetChat);

promptBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    userInput.value = btn.dataset.prompt;
    userInput.focus();
  });
});

logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('coach_api_key');
  apiKey = '';
  history = [];
  coachEl.hidden = true;
  setupEl.hidden = false;
  apiKeyInput.value = '';
  apiKeyInput.focus();
});

// ============================================================
// Setup handler
// ============================================================
function handleSetup() {
  const val = apiKeyInput.value.trim();
  if (!val) {
    showSetupError('Voer een API-sleutel in.');
    return;
  }
  if (!val.startsWith('sk-ant-')) {
    showSetupError('Een Anthropic-sleutel begint met sk-ant-…');
    return;
  }
  apiKey = val;
  sessionStorage.setItem('coach_api_key', apiKey);
  hideSetupError();
  showCoach();
}

function showSetupError(msg) {
  setupError.textContent = msg;
  setupError.hidden = false;
}

function hideSetupError() {
  setupError.hidden = true;
}

// ============================================================
// Coach UI
// ============================================================
function showCoach() {
  setupEl.hidden = true;
  coachEl.hidden = false;
  resetChat();
  userInput.focus();
}

function resetChat() {
  history = [];
  chatWindow.innerHTML = '';
  appendBotMsg(
    topic === 'taalbegrip'
      ? 'Hoi! Ik ben je studiecoach voor de Taalbegrip-3. Beschrijf een situatie uit je afname of vraag me iets te controleren.'
      : 'Hoi! Ik ben je studiecoach voor de Test voor Zinsontwikkeling. Beschrijf wat je deed of vraag me een specifiek onderdeel te controleren.'
  );
}

// ============================================================
// Message flow
// ============================================================
function submitMessage() {
  const text = userInput.value.trim();
  if (!text || sendBtn.disabled) return;
  userInput.value = '';
  sendMessage(text);
}

async function sendMessage(text) {
  appendUserMsg(text);
  history.push({ role: 'user', content: text });

  setBusy(true);
  const typingEl = appendTyping();

  try {
    const data = await requestCoachReply();

    typingEl.remove();

    const reply = data?.content?.[0]?.text ?? '';
    history.push({ role: 'assistant', content: reply });
    appendBotMsg(reply);

  } catch (err) {
    typingEl.remove();
    appendErrorMsg(err.message || 'Onbekende fout');
    history.pop();
  } finally {
    setBusy(false);
  }
}

async function requestCoachReply() {
  let lastError = null;

  for (const model of MODELS) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: 600,
        system: buildSystemPrompt(),
        messages: history,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg = body?.error?.message || `HTTP ${res.status}`;
      lastError = new Error(readableApiError(msg, res.status));
      if (res.status === 404 || /model/i.test(msg)) continue;
      throw lastError;
    }

    return res.json();
  }

  throw lastError || new Error('De coach kon geen beschikbaar model vinden.');
}

function readableApiError(message, status) {
  if (status === 401) return 'De API-sleutel wordt geweigerd. Controleer of je sleutel klopt.';
  if (status === 429) return 'De API-limiet is bereikt. Wacht even en probeer opnieuw.';
  if (status === 403) return 'De browseraanroep wordt geweigerd. Controleer of direct browsergebruik voor deze sleutel is toegestaan.';
  return message;
}

// ============================================================
// System prompt
// ============================================================
function buildSystemPrompt() {
  const testName = topic === 'taalbegrip'
    ? 'Schlichting Test voor Taalbegrip-3'
    : 'Test voor Zinsontwikkeling (ZO) binnen de Schlichting Taalproductie-3';

  return `Je bent een strikte maar helpende studiecoach voor de ${testName}. \
Je helpt logopediestudenten aan de Hanze Groningen zich voor te bereiden op het mondeling examen.

Je hebt toegang tot een interne testhandleiding (zie hieronder). \
Deze handleiding is VERTROUWELIJK en NOOIT zichtbaar voor de student. \
Je deelt er NOOIT letterlijke tekst uit. Je parafraseert altijd in je eigen woorden.

WAT JE DOET:
1. Controleer of de student de situatie of handeling correct heeft beschreven.
2. Geef maximaal 3 concrete verbeterpunten (direct en beknopt).
3. Benoem in één zin wat al goed gaat.
4. Stel altijd precies 1 reflectievraag aan het eind.

BIJ FOUTEN:
- Wees direct: "Dit klopt niet omdat…"
- Geef meteen een concrete verbetering.

ALS HET GOED IS:
- Bevestig kort en geef 1 kleine aanvullende tip.

VERBODEN:
- Meer dan 200 woorden per antwoord.
- Vaag of vrijblijvend taalgebruik.
- Theorie of regels introduceren die niet in de handleiding staan.
- Letterlijke zinnen uit de handleiding citeren.

Antwoord altijd in het Nederlands.

=== INTERNE TESTHANDLEIDING (VERTROUWELIJK — NIET CITEREN) ===
${GUIDES[topic]}
=== EINDE HANDLEIDING ===`;
}

// ============================================================
// DOM helpers
// ============================================================
function appendUserMsg(text) {
  const div = document.createElement('div');
  div.className = 'coach-msg coach-msg--user';
  const p = document.createElement('p');
  p.textContent = text;
  div.appendChild(p);
  chatWindow.appendChild(div);
  scrollBottom();
}

function appendBotMsg(text) {
  const div = document.createElement('div');
  div.className = 'coach-msg coach-msg--bot';
  renderMarkdown(text, div);
  chatWindow.appendChild(div);
  scrollBottom();
  return div;
}

function appendErrorMsg(msg) {
  const div = document.createElement('div');
  div.className = 'coach-msg coach-msg--error';
  div.textContent = `Fout: ${msg}`;
  chatWindow.appendChild(div);
  scrollBottom();
}

function appendTyping() {
  const div = document.createElement('div');
  div.className = 'coach-msg coach-msg--bot coach-msg--typing';
  div.setAttribute('aria-label', 'Coach typt…');
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.className = 'typing-dot';
    div.appendChild(dot);
  }
  chatWindow.appendChild(div);
  scrollBottom();
  return div;
}

function scrollBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function setBusy(busy) {
  sendBtn.disabled = busy;
  userInput.disabled = busy;
  if (!busy) userInput.focus();
}

// ============================================================
// Minimal safe markdown renderer
// Supports: **bold**, *em*, bullet lists (- / *), numbered lists,
// paragraph breaks. Escapes all HTML before inserting.
// ============================================================
function renderMarkdown(raw, container) {
  const lines = raw.split('\n');
  let listEl = null;
  let listType = null;

  function flushList() {
    if (listEl) {
      container.appendChild(listEl);
      listEl = null;
      listType = null;
    }
  }

  function makeParagraph(text) {
    const p = document.createElement('p');
    p.innerHTML = inlineFormat(text.trim());
    return p;
  }

  lines.forEach(line => {
    const bulletMatch = line.match(/^[\-\*]\s+(.+)/);
    const numberedMatch = line.match(/^\d+\.\s+(.+)/);

    if (bulletMatch || numberedMatch) {
      const content = bulletMatch ? bulletMatch[1] : numberedMatch[1];
      const wantedTag = numberedMatch ? 'ol' : 'ul';
      if (listType !== wantedTag) {
        flushList();
        listEl = document.createElement(wantedTag);
        listType = wantedTag;
      }
      const li = document.createElement('li');
      li.innerHTML = inlineFormat(content.trim());
      listEl.appendChild(li);
    } else {
      flushList();
      const trimmed = line.trim();
      if (trimmed) {
        container.appendChild(makeParagraph(trimmed));
      }
    }
  });

  flushList();
}

function inlineFormat(raw) {
  // Escape HTML entities first, then apply safe inline tags.
  const escaped = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}
