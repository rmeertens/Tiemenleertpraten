const modules = {
  icf: {
    label: "ICF-Brug",
    template: [
      ["Functie", "Welke stoornis of taalcomponent is aangedaan?"],
      ["Activiteit", "Wat kan het kind daardoor minder goed doen?"],
      ["Participatie", "Waar merkt het kind dit in klas, thuis of spel?"],
      ["Omgeving", "Wie of wat helpt of belemmert?"],
      ["Doel", "Welk concreet doel volgt hier logisch uit?"]
    ],
    checks: [
      ["score", ["score", "-2", "sd", "q", "bi", "betrouwbaarheidsinterval"], "Noem de score of score-onzekerheid."],
      ["functie", ["functie", "morfosyntaxis", "fonologie", "semantiek", "pragmatiek", "taalbegrip", "taalproductie"], "Benoem het aangedane taalgebied als functie."],
      ["activiteit", ["activiteit", "zinnen", "instructie", "vertellen", "begrijpen", "formuleren"], "Vertaal de functie naar wat het kind moet doen."],
      ["participatie", ["participatie", "kring", "klas", "school", "vriend", "spel", "meedoen"], "Maak duidelijk waar meedoen vastloopt."],
      ["omgeving", ["omgeving", "ouders", "leerkracht", "visueel", "herhaling", "school"], "Noem minstens één omgevingsfactor."],
      ["doel", ["doel", "lt", "kt", "smart"], "Laat zien welk behandel- of begeleidingsdoel eruit volgt."]
    ],
    scenarios: [
      {
        title: "Zinsproductie onder grens",
        facts: [
          ["Score", "Zinsproductie Q 69, BI 64-76"],
          ["Taalgebied", "Morfosyntaxis"],
          ["Dagelijks", "Kind geeft korte antwoorden en haakt af in kringgesprekken"],
          ["Context", "Leerkracht gebruikt veel mondelinge instructie zonder visuele steun"]
        ],
        example: "De score op zinsproductie ligt rond -2 SD en het BI blijft in de zorgzone. Functie: morfosyntaxis, vooral langere zinnen formuleren. Activiteit: het kind kan een gebeurtenis minder goed in volledige zinnen vertellen. Participatie: daardoor doet het minder mee in de kring en wordt het minder begrepen door klasgenoten. Omgeving: de leerkracht kan visuele steun en herhaling bieden. KT-doel: het kind formuleert met visuele steun een 5-woordzin bij een kringplaat."
      },
      {
        title: "Taalbegrip en instructies",
        facts: [
          ["Score", "Taalbegrip Q 74, BI 68-82"],
          ["Taalgebied", "Receptieve taal / syntaxis"],
          ["Dagelijks", "Kind mist stappen in klassikale opdrachten"],
          ["Context", "Ouders herkennen thuis moeite met meerstapsopdrachten"]
        ],
        example: "De taalbegripscore is laag en het BI raakt de klinische zone. Functie: receptieve taal, vooral syntactisch begrip van meerstapsinstructies. Activiteit: instructies met twee of drie stappen uitvoeren lukt minder. Participatie: in de klas start het kind later of doet het iets anders dan de groep. Omgeving: leerkracht en ouders kunnen korte instructies, visuele stappen en checkvragen gebruiken. KT-doel: het kind voert met pictosteun een tweestapsinstructie correct uit."
      }
    ]
  },
  levelt: {
    label: "Levelt Lab",
    template: [
      ["Locus", "Waar in het model gaat het primair mis?"],
      ["Bewijs", "Welk casussignaal ondersteunt dat?"],
      ["Onderscheid", "Waarom is het niet een aangrenzende module?"],
      ["Gevolg", "Wat betekent dit voor diagnostiek of behandeling?"],
      ["Klinische zin", "Formuleer één toetswaardige conclusie."]
    ],
    checks: [
      ["locus", ["conceptualiseerder", "formulator", "lexicon", "fonologische codering", "fonetisch plan", "articulator", "auditieve waarneming", "spraakverstaan", "monitoring"], "Benoem expliciet de plek in het model."],
      ["bewijs", ["omdat", "blijkt", "signaal", "observatie", "voorbeeld"], "Onderbouw je keuze met een casussignaal."],
      ["onderscheid", ["niet", "maar", "fonologisch", "fonetisch", "motorisch", "begrip", "productie"], "Laat zien dat je verwarring met een andere module voorkomt."],
      ["diagnostiek", ["diagnostiek", "onderzoek", "testen", "analyse", "drie-positie", "spraakmotorisch"], "Vertaal Levelt naar vervolgonderzoek."],
      ["therapie", ["therapie", "behandeling", "doel", "methode", "perceptie", "productie"], "Vertaal Levelt naar behandeling of doelkeuze."]
    ],
    scenarios: [
      {
        title: "koek wordt toek",
        facts: [
          ["Fout", "Kind zegt consequent 'toek' voor 'koek'"],
          ["Klank", "/k/ wordt /t/"],
          ["Gedrag", "Geen zoekend spreken; nazeggen lukt wisselend per woordpositie"],
          ["Vraag", "Waar plaats je dit in Levelt?"]
        ],
        example: "Ik plaats dit primair in de formulator, specifieker de fonologische codering, omdat het kind het contrast velair-alveolair niet stabiel inzet: /k/ wordt /t/. Het lijkt niet primair een articulatorisch/fonetisch probleem, omdat er geen duidelijk motorisch onvermogen of zoekend spreken beschreven is. Diagnostiek: ik wil een fonologische analyse en drie-positie-onderzoek doen. Therapie: eerst perceptie van het contrast en daarna productie met minimale paren."
      },
      {
        title: "woord wel kennen, niet vinden",
        facts: [
          ["Fout", "Kind omschrijft: 'dat ding om mee te knippen'"],
          ["Begrip", "Wijst de schaar direct aan als jij het woord zegt"],
          ["Productie", "Veel pauzes en omwegen bij benoemen"],
          ["Vraag", "Waar plaats je dit in Levelt?"]
        ],
        example: "Ik plaats dit bij het lexicon/lemma-lexeemtoegang binnen de formulator, omdat het begrip aanwezig is maar de woordvorm niet snel beschikbaar komt. Het is niet primair taalbegrip, want het kind wijst de schaar goed aan. Diagnostiek: ik onderzoek woordvinding, semantische netwerken en benoemsnelheid. Therapie: woordvindstrategieën, semantische cueing en oefenen met categorie, functie en klankvorm."
      },
      {
        title: "begrijpt opdracht niet",
        facts: [
          ["Fout", "Kind voert 'leg de pop onder de stoel' verkeerd uit"],
          ["Gehoor", "Gehooronderzoek voldoende"],
          ["Productie", "Spontane zinnen zijn kort maar verstaanbaar"],
          ["Vraag", "Waar plaats je dit in Levelt?"]
        ],
        example: "Ik plaats dit aan de begripskant, in het systeem voor spraakverstaan en de interpretatie via de formulator/lexicon, omdat het kind de auditief aangeboden zin niet juist begrijpt terwijl gehoor voldoende is. Het is dus niet primair auditieve waarneming. Diagnostiek: taalbegrip testen, vooral voorzetsels en zinsbegrip. Therapie: receptieve taal en begrip van ruimtelijke relaties oefenen met visuele steun."
      },
      {
        title: "de /r/ lukt motorisch niet",
        facts: [
          ["Fout", "Kind weet dat het 'rood' is, maar produceert een vervormde /r/"],
          ["Consistentie", "De /r/ klinkt in alle posities vervormd"],
          ["Nazeggen", "Ook bij nazeggen geen correcte /r/"],
          ["Vraag", "Waar plaats je dit in Levelt?"]
        ],
        example: "Ik plaats dit primair bij de articulator/fonetische uitvoering, omdat de klank consistent vervormd is en ook bij nazeggen niet lukt. Het is niet vooral fonologische codering, want het doelcontrast lijkt bekend. Diagnostiek: spraakmotorisch en articulatorisch onderzoek, eventueel mondmotoriek/structuur observeren. Therapie: fonetische articulatietraining, opbouw van klank naar woord en generalisatie."
      }
    ]
  },
  mdo: {
    label: "MDO-Kruisverhoor",
    template: [
      ["Standpunt", "Wat adviseer je?"],
      ["Onderbouwing", "Welke test- en observatiegegevens dragen dit?"],
      ["Nuance", "Wat betekent het BI of de onzekerheid?"],
      ["Uitleg", "Wat betekent dit concreet voor school/thuis?"],
      ["Vervolg", "Wat is je professionele advies?"]
    ],
    checks: [
      ["advies", ["advies", "ik adviseer", "vervolg", "behandeling", "diagnostiek"], "Formuleer een duidelijk advies."],
      ["testleer", ["bi", "betrouwbaarheidsinterval", "normscore", "ruwe score", "sd"], "Gebruik testleer, niet alleen losse cijfers."],
      ["observatie", ["observatie", "dagelijks", "ouders", "leerkracht", "klas"], "Koppel testgegevens aan dagelijks functioneren."],
      ["differentiaal", ["differentiaal", "tos", "nt2", "ass", "iq", "gehoor"], "Verdedig waarom jouw verklaring het best past."],
      ["professioneel", ["voorzichtig", "op basis van", "ik kan", "ik zou", "multidisciplinair"], "Klink professioneel en genuanceerd."]
    ],
    scenarios: [
      {
        title: "Kritische psycholoog",
        facts: [
          ["Vraag", "Waarom noem je dit TOS en geen lage intelligentie?"],
          ["Gegeven", "Non-verbaal functioneren gemiddeld; taalproductie duidelijk zwak"],
          ["Spanning", "De psycholoog vindt de testscore alleen niet genoeg"],
          ["Doel", "Verdedig je diagnose professioneel"]
        ],
        example: "Mijn advies is om TOS als meest waarschijnlijke verklaring te onderzoeken/behandelen, omdat de taalproductie duidelijk zwak is terwijl het non-verbale functioneren gemiddeld is. Ik baseer dit niet alleen op de normscore, maar ook op het betrouwbaarheidsinterval, observatie en dagelijks functioneren volgens ouders en leerkracht. Differentiaaldiagnostisch past een algemene verstandelijke beperking minder goed, maar gehoor, meertaligheid en sociaal-emotionele factoren moeten wel meegewogen blijven. Ik adviseer gerichte taalbehandeling en evaluatie van groei, met multidisciplinair overleg als vooruitgang uitblijft."
      },
      {
        title: "Manager Trudy",
        facts: [
          ["Vraag", "Waarom behandelen als het BI de grens overlapt?"],
          ["Gegeven", "Score laag-gemiddeld, maar communicatieve redzaamheid is duidelijk beperkt"],
          ["Spanning", "Er is druk om kort en doelmatig te adviseren"],
          ["Doel", "Zet cijfers om naar professioneel advies"]
        ],
        example: "Ik adviseer behandeling ondanks de overlappende BI-grens, omdat de testscore onzekerheid laat zien maar het dagelijks functioneren duidelijk beperkt is. Het BI betekent dat ik voorzichtig ben met harde labels, niet dat er geen hulpvraag is. Observaties van ouders en leerkracht laten zien dat communicatie in de klas vastloopt. Mijn professionele advies is een kort behandeltraject met concrete doelen, evaluatie na 8 tot 10 weken en bij onvoldoende groei opschalen naar multidisciplinaire diagnostiek."
      }
    ]
  },
  reflector: {
    label: "Criterium 10-Reflector",
    template: [
      ["Fout", "Wat ging er precies mis?"],
      ["Impact", "Wat betekent dit voor standaardisatie/validiteit?"],
      ["Herstel", "Wat doe je nu professioneel?"],
      ["Reflectie", "Hoe voorkom je dit straks?"]
    ],
    checks: [
      ["fout", ["fout", "ik merkte", "ik heb", "verspreking", "intonatie", "tempo", "aanwijzing"], "Benoem de fout concreet en proactief."],
      ["standaardisatie", ["standaardisatie", "gestandaardiseerd", "afname"], "Koppel de fout aan de afnameprocedure."],
      ["validiteit", ["validiteit", "valide", "betrouwbaar", "interpretatie"], "Duid de impact op score/interpretatie."],
      ["herstel", ["noteer", "documenteer", "herstel", "opnieuw", "weeg", "meeneem"], "Zeg wat je professioneel doet."],
      ["preventie", ["voorkom", "volgende", "tempo", "rustig", "neutraal"], "Laat zien hoe je je handelen bijstuurt."]
    ],
    scenarios: [
      {
        title: "Hulpende intonatie",
        facts: [
          ["Situatie", "Je legt onbewust nadruk op het juiste antwoorddeel"],
          ["Risico", "Het kind krijgt extra cueing"],
          ["Toetscriterium", "Criterium 10: eigen handelen verantwoorden"],
          ["Opdracht", "Benoem fout, impact en herstel"]
        ],
        example: "Ik merkte dat ik het item met hulpende intonatie aanbood. Daardoor is de standaardisatie van dit item verstoord en kan de validiteit van de score op dit item lager zijn. Ik noteer deze afname-afwijking, neem het mee in mijn interpretatie en voorkom dit bij volgende items door rustiger en neutraler aan te bieden."
      },
      {
        title: "Te snel tempo",
        facts: [
          ["Situatie", "Je biedt een stimuluszin te snel aan"],
          ["Risico", "Het kind krijgt minder verwerkingstijd"],
          ["Toetscriterium", "Rustig spreektempo en professioneel handelen"],
          ["Opdracht", "Reageer alsof de beoordelaar meekijkt"]
        ],
        example: "Ik merk dat mijn tempo bij deze stimuluszin te hoog was. Dat wijkt af van de gestandaardiseerde afname en kan invloed hebben op de validiteit, omdat het kind minder verwerkingstijd kreeg. Ik documenteer dit, weeg dit item voorzichtig in de interpretatie en bied de volgende items bewust rustig en neutraal aan."
      }
    ]
  }
};

const moduleButtons = Array.from(document.querySelectorAll("[data-module]"));
const moduleLabel = document.getElementById("moduleLabel");
const scenarioTitle = document.getElementById("scenarioTitle");
const scenarioFacts = document.getElementById("scenarioFacts");
const template = document.getElementById("template");
const answer = document.getElementById("answer");
const feedback = document.getElementById("feedback");

let activeModule = "icf";
let activeScenario = 0;

function clean(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function render() {
  const current = modules[activeModule];
  const scenario = current.scenarios[activeScenario];
  moduleLabel.textContent = current.label;
  scenarioTitle.textContent = scenario.title;
  scenarioFacts.innerHTML = scenario.facts.map(([label, value]) => `
    <div class="zg-fact"><strong>${label}</strong><span>${value}</span></div>
  `).join("");
  template.innerHTML = current.template.map(([label, text]) => `
    <p><strong>${label}:</strong> ${text}</p>
  `).join("");
  answer.value = "";
  feedback.hidden = true;
}

function checkAnswer() {
  const current = modules[activeModule];
  const text = clean(answer.value);
  const scored = current.checks.map(([label, words, tip]) => {
    const hit = words.some((word) => text.includes(word));
    return { label, hit, tip };
  });
  const total = scored.filter((item) => item.hit).length;
  const max = scored.length;
  const title = total === max ? "ZG-materiaal" : total >= max - 1 ? "Bijna ZG" : "Nog scherper maken";
  const body = total === max
    ? "Je antwoord bevat de kerncomponenten. Oefen dit nu hardop, kort en professioneel."
    : "Vul de ontbrekende brug aan. Een 10-antwoord is expliciet, niet alleen inhoudelijk juist.";
  feedback.innerHTML = `
    <h2>${title}: ${total}/${max}</h2>
    <p>${body}</p>
    ${scored.map((item) => `
      <article class="zg-check ${item.hit ? "is-hit" : "is-miss"}">
        <span>${item.hit ? "✓" : "!"}</span>
        <div>
          <h3>${item.label}</h3>
          <p>${item.hit ? "Aanwezig." : item.tip}</p>
        </div>
      </article>
    `).join("")}
  `;
  feedback.hidden = false;
}

moduleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeModule = button.dataset.module;
    activeScenario = 0;
    moduleButtons.forEach((item) => item.setAttribute("aria-selected", String(item === button)));
    render();
  });
});

document.getElementById("newScenario").addEventListener("click", () => {
  activeScenario = (activeScenario + 1) % modules[activeModule].scenarios.length;
  render();
});

document.getElementById("showExample").addEventListener("click", () => {
  answer.value = modules[activeModule].scenarios[activeScenario].example;
  feedback.hidden = true;
});

document.getElementById("clearAnswer").addEventListener("click", () => {
  answer.value = "";
  feedback.hidden = true;
});

document.getElementById("checkAnswer").addEventListener("click", checkAnswer);

render();
