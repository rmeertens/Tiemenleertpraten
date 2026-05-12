const redFlags = [
  { pattern: /sucralose|acesulfaam|aspartaam|sacharine|steviolglycosiden/i, type: "Zoetstof", weight: 2, reason: "zoetstof houdt het product zoet zonder dat het simpel eten wordt." },
  { pattern: /glucose-fructosestroop|fructosestroop|dextrose|maltodextrine|invertsuiker|karamelstroop|rijststroop|agavesiroop/i, type: "Verborgen suiker", weight: 2, reason: "suiker zit verstopt onder een technische naam." },
  { pattern: /gemodificeerd zetmeel|gehydrolyseerd zetmeel|tarwezetmeel|maiszetmeel|aardappelzetmeel/i, type: "Geraffineerd zetmeel", weight: 1, reason: "zetmeel vult en bindt, maar zegt weinig over voedingskwaliteit." },
  { pattern: /emulgator|lecithine|mono- en diglyceriden|polysorbaat|E471|E472/i, type: "Emulgator", weight: 2, reason: "emulgatoren bouwen mondgevoel dat thuis bijna niemand nodig heeft." },
  { pattern: /kleurstof|kleurstoffen|karamelkleurstof|E150|E160|E120/i, type: "Kleurstof", weight: 1, reason: "kleur maakt het product aantrekkelijker dan de basis verdient." },
  { pattern: /aroma|natuurlijk aroma|rookaroma|smaakstof/i, type: "Aroma", weight: 1, reason: "aroma stuurt smaak zonder echte ingredienten toe te voegen." },
  { pattern: /eiwit-isolaat|proteine-isolaat|melkeiwit|soja-eiwit|erwteneiwit|wei-eiwit/i, type: "Isolaat", weight: 1, reason: "losse eiwitten zijn vaak een marketingmotor." },
  { pattern: /xanthaangom|guargom|carrageen|cellulosegom|verdikkingsmiddel|pectine/i, type: "Gom of verdikker", weight: 1, reason: "verdikkers maken textuur zonder normale keukenlogica." },
  { pattern: /conserveermiddel|kaliumsorbaat|natriumbenzoaat|sorbaten|benzoaten|E202|E211/i, type: "Conserveermiddel", weight: 1, reason: "lange houdbaarheid is hier belangrijker dan versheid." }
];

const claimTraps = [
  { pattern: /natuurlijk/i, label: "Natuurlijk", hidden: "Kan alsnog aroma, siroop of zetmeel bevatten." },
  { pattern: /fit|fitness|active/i, label: "Fit", hidden: "Kan vooral een sportjas over suiker en isolaten zijn." },
  { pattern: /0%|nul procent|zero/i, label: "0%", hidden: "Vaak vervangen door zoetstof, verdikker of aroma." },
  { pattern: /rijk aan|bron van/i, label: "Rijk aan", hidden: "Een plusclaim kan een lange ingredientenlijst maskeren." },
  { pattern: /zonder toegevoegd/i, label: "Zonder toegevoegd", hidden: "Check fruitconcentraat, stroop en zoetstoffen alsnog." },
  { pattern: /proteine|protein|eiwit/i, label: "Proteine", hidden: "Meer eiwit betekent niet automatisch minder bewerking." }
];

const swapRules = [
  "Kies een variant met maximaal vijf herkenbare ingredienten.",
  "Laat de claim voor wat hij is en vergelijk alleen de ingredientenlijst.",
  "Kies de basisversie en voeg zelf fruit, noten, kruiden of yoghurt toe.",
  "Vervang snacklogica door keukenlogica: graan, zuivel, peulvrucht, groente of fruit.",
  "Als je drie technische functies ziet, kies dan een simpeler product naast hetzelfde schap."
];

const demoProducts = [
  {
    name: "Ochtendknal Crunch",
    category: "ontbijtgranen",
    claim: "rijk aan vezels",
    ingredients: "volkoren tarwe 48%, suiker, glucose-fructosestroop, tarwezetmeel, cacaopoeder, aroma, emulgator lecithine, zout, kleurstof E150",
    swap: "Kies havermout of muesli zonder siroop en voeg zelf cacao, banaan of noten toe."
  },
  {
    name: "Pure Start Havervlokken",
    category: "ontbijtgranen",
    claim: "zonder poespas",
    ingredients: "volkoren havervlokken",
    swap: "Sterk: bouw smaak zelf met fruit, kaneel of noten."
  },
  {
    name: "Power Bite Reep",
    category: "proteïnereep",
    claim: "proteine",
    ingredients: "melkeiwit, glucose-fructosestroop, palmvet, cacaomassa, soja-eiwit, aroma, emulgator E471, sucralose, zout",
    swap: "Neem yoghurt met noten of een boterham met pindakaas als je echt verzadiging zoekt."
  },
  {
    name: "Zero Splash",
    category: "frisdrank",
    claim: "0% suiker",
    ingredients: "koolzuurhoudend water, voedingszuur citroenzuur, aroma, kleurstof E150, aspartaam, acesulfaam-K, conserveermiddel natriumbenzoaat",
    swap: "Kies bruiswater met citroen of munt als dorst de echte vraag is."
  },
  {
    name: "Kom-Snel Tomatensoep",
    category: "soep",
    claim: "natuurlijk",
    ingredients: "water, tomatenpuree 18%, gemodificeerd maiszetmeel, suiker, zout, aroma, gistextract, conserveermiddel kaliumsorbaat",
    swap: "Zoek soep met tomaat, water, ui, olie, kruiden en weinig meer."
  },
  {
    name: "Rustig Volkoren",
    category: "brood",
    claim: "volkoren",
    ingredients: "volkoren tarwemeel, water, gist, zout",
    swap: "Dit is de richting: korte lijst, herkenbare basis."
  },
  {
    name: "Romige 0% Vanille",
    category: "yoghurt",
    claim: "0% vet",
    ingredients: "magere yoghurt, water, melkeiwit, gemodificeerd zetmeel, aroma, sucralose, kleurstof E160, verdikkingsmiddel pectine",
    swap: "Kies yoghurt met melk en fermenten; voeg zelf fruit of vanille toe."
  },
  {
    name: "Plant Burger Deluxe",
    category: "vleesvervanger",
    claim: "plant based",
    ingredients: "water, soja-eiwit, kokosvet, tarwezetmeel, aroma, methylcellulose, kleurstof E150, zout, conserveermiddel",
    swap: "Vergelijk met linzen, bonen, tofu of tempeh als basis."
  },
  {
    name: "Sweet Fire Saus",
    category: "saus",
    claim: "natuurlijk aroma",
    ingredients: "water, suiker, azijn, tomatenpuree, gemodificeerd zetmeel, zout, aroma, xanthaangom, conserveermiddel E202",
    swap: "Kies saus waarin tomaat, azijn, kruiden en olie de hoofdrol spelen."
  },
  {
    name: "Zoute Kraakkussens",
    category: "snack",
    claim: "oven baked",
    ingredients: "aardappelzetmeel, zonnebloemolie, maltodextrine, zout, aroma, smaakversterker, kleurstof E160",
    swap: "Neem iets met een herkenbare basis: popcorn, noten of brood met beleg."
  }
];

const claimQuestions = [
  { claim: "0% vet", answer: "Zoetstof of verdikker", options: ["Zoetstof of verdikker", "Altijd meer vezels", "Geen bewerking"] },
  { claim: "Rijk aan vezels", answer: "Lange lijst met suiker of aroma", options: ["Lange lijst met suiker of aroma", "Altijd volkoren", "Minder zout gegarandeerd"] },
  { claim: "Proteine", answer: "Isolaten en zoetmakers", options: ["Isolaten en zoetmakers", "Meer groente", "Kortere lijst"] },
  { claim: "Natuurlijk", answer: "Aroma of siroop", options: ["Aroma of siroop", "Geen additieven", "Altijd onbewerkt"] },
  { claim: "Zonder toegevoegde suiker", answer: "Sapconcentraat of zoetstof", options: ["Sapconcentraat of zoetstof", "Geen zoete smaak", "Altijd betere keuze"] }
];

const initialStats = { labels: 0, traps: 0, streak: 0, best: 0 };
let stats = loadStats();
let currentDuel = [];
let currentClaim = null;
let bossRounds = [];
let bossIndex = 0;
let bossScore = 0;

const $ = (selector) => document.querySelector(selector);

function loadStats() {
  try {
    return { ...initialStats, ...JSON.parse(localStorage.getItem("biteStats")) };
  } catch {
    return { ...initialStats };
  }
}

function saveStats() {
  localStorage.setItem("biteStats", JSON.stringify(stats));
  renderStats();
}

function renderStats() {
  $("#labels-checked").textContent = stats.labels;
  $("#traps-spotted").textContent = stats.traps;
  $("#best-streak").textContent = stats.best;
}

function normalize(text) {
  return (text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function analyzeProduct(name, ingredients) {
  const fullText = `${name || ""} ${ingredients || ""}`;
  const normalized = normalize(fullText);
  const ingredientParts = ingredients.split(",").map((item) => item.trim()).filter(Boolean);
  const foundFlags = redFlags
    .filter((flag) => flag.pattern.test(normalized))
    .map((flag) => ({ ...flag }));
  const foundClaims = claimTraps
    .filter((claim) => claim.pattern.test(normalized))
    .map((claim) => claim);
  const longList = ingredientParts.length >= 9;
  const score = foundFlags.reduce((sum, flag) => sum + flag.weight, 0) + foundClaims.length + (longList ? 2 : 0);
  const level = score >= 6 ? "Trap bite" : score >= 3 ? "Watch bite" : "Clean bite";
  const reasons = [];

  if (longList) {
    reasons.push({ title: "Lange lijst", body: `${ingredientParts.length} ingredienten. Dat is vaak een signaal dat textuur, smaak en houdbaarheid zijn ontworpen.` });
  }

  foundFlags.slice(0, 5).forEach((flag) => {
    reasons.push({ title: flag.type, body: flag.reason });
  });

  foundClaims.slice(0, 2).forEach((claim) => {
    reasons.push({ title: `Claim: ${claim.label}`, body: claim.hidden });
  });

  if (!reasons.length && ingredientParts.length) {
    reasons.push({ title: "Korte basis", body: "Weinig technische signalen. Check nog steeds portie, zout en context, maar dit etiket is rustig." });
  }

  if (!ingredientParts.length) {
    reasons.push({ title: "Geen etiket", body: "Plak minstens drie ingredienten om streng te kunnen scoren." });
  }

  return {
    level,
    score,
    reasons: reasons.slice(0, 3),
    traps: foundFlags.length + foundClaims.length + (longList ? 1 : 0),
    swap: chooseSwap(name, foundFlags, foundClaims),
    challenge: buildChallenge(foundFlags, foundClaims, longList)
  };
}

function chooseSwap(name, foundFlags, foundClaims) {
  const demo = demoProducts.find((product) => product.name === name);
  if (demo) return demo.swap;
  if (foundClaims.some((claim) => claim.label === "0%")) return "Kies yoghurt of drank met een korte basislijst en voeg smaak zelf toe.";
  if (foundFlags.some((flag) => flag.type === "Verborgen suiker")) return "Zoek een variant zonder siroopnamen in de eerste vijf ingredienten.";
  if (foundFlags.some((flag) => flag.type === "Emulgator")) return "Kies de basisversie: minder romig op papier, meestal eerlijker op het etiket.";
  return swapRules[Math.floor(Math.random() * swapRules.length)];
}

function buildChallenge(foundFlags, foundClaims, longList) {
  if (foundFlags[0]) return `Vind in 30 seconden de ${foundFlags[0].type.toLowerCase()} en zeg waarom die erin zit.`;
  if (foundClaims[0]) return `Pak de claim "${foundClaims[0].label}" en bewijs met het etiket of hij afleidt.`;
  if (longList) return "Streep alles aan wat je thuis niet als los ingredient zou gebruiken.";
  return "Leg in een zin uit waarom dit etiket rustig is, zonder het product heilig te verklaren.";
}

function renderAnalysis(result) {
  $("#score-label").textContent = result.level;
  $("#score-value").textContent = result.score;
  $("#result-title").textContent = result.level;
  $("#result-summary").textContent = result.level === "Trap bite"
    ? "Veel ontworpen signalen. Niet panieken, wel scherper kiezen."
    : result.level === "Watch bite"
      ? "Niet rampzalig, maar het etiket probeert te sturen. Lees door de claim heen."
      : "Rustig etiket. De basis is herkenbaar, maar context blijft tellen.";
  $("#reason-list").innerHTML = result.reasons.map((reason) => `
    <article>
      <strong>${escapeHtml(reason.title)}</strong>
      <p>${escapeHtml(reason.body)}</p>
    </article>
  `).join("");
  $("#swap-text").textContent = result.swap;
  $("#challenge-text").textContent = result.challenge;
}

function analyzeCurrentInput() {
  const name = $("#product-name").value.trim();
  const ingredients = $("#ingredient-input").value.trim();
  const result = analyzeProduct(name, ingredients);
  renderAnalysis(result);

  if (ingredients.split(",").filter(Boolean).length >= 3) {
    stats.labels += 1;
    stats.traps += result.traps;
    stats.streak = result.traps > 0 ? stats.streak + 1 : 0;
    stats.best = Math.max(stats.best, stats.streak);
    saveStats();
  }
}

function renderDemos() {
  $("#demo-products").innerHTML = demoProducts.map((product, index) => `
    <button type="button" data-demo="${index}">
      <strong>${escapeHtml(product.name)}</strong>
      <span>${escapeHtml(product.category)} · ${escapeHtml(product.claim)}</span>
    </button>
  `).join("");
}

function pickDemo(index) {
  const product = demoProducts[index];
  $("#product-name").value = `${product.name} · ${product.claim}`;
  $("#ingredient-input").value = product.ingredients;
  analyzeCurrentInput();
}

function productScore(product) {
  return analyzeProduct(`${product.name} ${product.claim}`, product.ingredients).score;
}

function newDuel() {
  const shuffled = [...demoProducts].sort(() => Math.random() - 0.5);
  currentDuel = [shuffled[0], shuffled.find((product) => productScore(product) !== productScore(shuffled[0])) || shuffled[1]];
  $("#duel-options").innerHTML = currentDuel.map((product, index) => `
    <button type="button" data-duel="${index}">
      <span>${index === 0 ? "Links" : "Rechts"}</span>
      <strong>${escapeHtml(product.name)}</strong>
      <small>${escapeHtml(product.ingredients)}</small>
    </button>
  `).join("");
  $("#duel-feedback").textContent = "Kies links of rechts. De strengste reden wint.";
}

function chooseDuel(index) {
  const scores = currentDuel.map(productScore);
  const bestIndex = scores[0] <= scores[1] ? 0 : 1;
  const chosen = Number(index);
  const best = currentDuel[bestIndex];
  const result = analyzeProduct(`${best.name} ${best.claim}`, best.ingredients);
  const correct = chosen === bestIndex;
  updateQuizStats(correct, result.traps);
  $("#duel-feedback").textContent = correct
    ? `Goed. ${best.name} wint: ${result.reasons[0]?.body || "korter en herkenbaarder."}`
    : `Streng zijn. ${best.name} is beter: ${result.reasons[0]?.body || "het etiket is rustiger."}`;
}

function newClaim() {
  currentClaim = claimQuestions[Math.floor(Math.random() * claimQuestions.length)];
  $("#claim-text").textContent = currentClaim.claim;
  $("#claim-options").innerHTML = currentClaim.options.map((option) => `
    <button type="button" data-claim="${escapeHtml(option)}">${escapeHtml(option)}</button>
  `).join("");
  $("#claim-feedback").textContent = "Kies de valkuil achter de claim.";
}

function chooseClaim(answer) {
  const correct = answer === currentClaim.answer;
  updateQuizStats(correct, correct ? 1 : 0);
  $("#claim-feedback").textContent = correct
    ? "Raak. Een claim is pas nuttig als de ingredientenlijst hem ondersteunt."
    : `Niet scherp genoeg. Achter "${currentClaim.claim}" kan vooral dit zitten: ${currentClaim.answer}.`;
}

function updateQuizStats(correct, traps) {
  stats.labels += 1;
  stats.traps += traps;
  stats.streak = correct ? stats.streak + 1 : 0;
  stats.best = Math.max(stats.best, stats.streak);
  saveStats();
}

function startBoss() {
  bossRounds = [];
  const pool = [...demoProducts].sort(() => Math.random() - 0.5);
  for (let i = 0; i < 5; i += 1) {
    const first = pool[i * 2 % pool.length];
    const second = pool[(i * 2 + 1) % pool.length];
    bossRounds.push([first, second]);
  }
  bossIndex = 0;
  bossScore = 0;
  renderBossRound();
}

function renderBossRound() {
  const round = bossRounds[bossIndex];
  if (!round) {
    const percent = Math.round((bossScore / 5) * 100);
    $("#boss-stage").innerHTML = `
      <div class="bite-boss-score">
        <span>Etiketklaar</span>
        <strong>${percent}%</strong>
        <p>${percent >= 80 ? "Je leest door claims heen." : "Nog trainen: kies minder op voorkant, meer op ingredienten."}</p>
      </div>
    `;
    return;
  }

  $("#boss-stage").innerHTML = `
    <p class="bite-note">Ronde ${bossIndex + 1} van 5. Kies het rustigste etiket.</p>
    <div class="bite-duel">
      ${round.map((product, index) => `
        <button type="button" data-boss="${index}">
          <span>${escapeHtml(product.claim)}</span>
          <strong>${escapeHtml(product.name)}</strong>
          <small>${escapeHtml(product.ingredients)}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function chooseBoss(index) {
  const round = bossRounds[bossIndex];
  const scores = round.map(productScore);
  const bestIndex = scores[0] <= scores[1] ? 0 : 1;
  const correct = Number(index) === bestIndex;
  const best = round[bestIndex];
  const analysis = analyzeProduct(`${best.name} ${best.claim}`, best.ingredients);
  if (correct) bossScore += 1;
  updateQuizStats(correct, analysis.traps);
  bossIndex += 1;
  renderBossRound();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("click", (event) => {
  const demo = event.target.closest("[data-demo]");
  if (demo) pickDemo(Number(demo.dataset.demo));

  const duel = event.target.closest("[data-duel]");
  if (duel) chooseDuel(duel.dataset.duel);

  const claim = event.target.closest("[data-claim]");
  if (claim) chooseClaim(claim.dataset.claim);

  const boss = event.target.closest("[data-boss]");
  if (boss) chooseBoss(boss.dataset.boss);
});

$("#analyze-label").addEventListener("click", analyzeCurrentInput);
$("#clear-label").addEventListener("click", () => {
  $("#product-name").value = "";
  $("#ingredient-input").value = "";
  renderAnalysis(analyzeProduct("", ""));
});
$("#new-duel").addEventListener("click", newDuel);
$("#new-claim").addEventListener("click", newClaim);
$("#start-boss").addEventListener("click", startBoss);

renderStats();
renderDemos();
newDuel();
newClaim();
renderAnalysis(analyzeProduct("", ""));
