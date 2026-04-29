const domains = [
  {
    title: "Basis: taal, spraak en ontwikkeling",
    summary: "De kapstok voor alle casussen: modaliteit, taalniveau, begrip versus productie en leeftijdsfasen.",
    concepts: [
      concept("Taal", "Basis", "Taal is een regelsysteem waarmee mensen betekenis delen en ervaringen ordenen. Kijk altijd naar begrip en productie, en naar inhoud, vorm en gebruik.", "Schriftelijk: definities en casusanalyse. Mondeling: taalbeeld kort en helder samenvatten.", "Alleen losse woorden tellen. Een kind kan woordenschat hebben en toch vastlopen in zinsbouw of gebruik.", "Kun je bij een casus drie aanwijzingen noemen voor inhoud, vorm en gebruik?"),
      concept("Spraak", "Basis", "Spraak is het hoorbaar maken van taal via klanken. Fonologie kiest en ordent klanken; fonetiek voert ze motorisch uit.", "Schriftelijk: onderscheid fonetisch/fonologisch. Mondeling: behandelkeuze bij spraakbeeld.", "Uitspraakproblemen direct als motorisch labelen zonder klanksysteem te onderzoeken.", "Leg in één zin uit waarom /k/ soms wel en soms niet lukt bij een fonologisch probleem."),
      concept("Taalniveaus", "Basis", "Fonologie, semantiek, syntaxis, morfologie, pragmatiek en metalinguïstiek vormen samen het taalprofiel. Elk niveau kan receptief en productief bekeken worden.", "Schriftelijk: open casussen vragen vaak om niveau-analyse.", "Een testscore noemen zonder te zeggen welk taalniveau die score vertegenwoordigt.", "Welke twee taalniveaus zijn vooral betrokken bij zinsontwikkeling?"),
      concept("Ontwikkelingsfasen", "Basis", "Van prelinguaal naar vroeglinguaal, differentiatiefase en voltooiing. Begrip loopt meestal vóór productie.", "Schriftelijk: leeftijdspassend of afwijkend beoordelen.", "Een peuter beoordelen met verwachtingen die bij een kleuter horen.", "Noem per fase één typische talige mijlpaal."),
      concept("Voorwaarden", "Basis", "Taal- en spraakontwikkeling vragen gehoor, neurologische rijping, cognitie, motoriek, sociaal-emotionele drive, interactie en rijk taalaanbod.", "Schriftelijk en mondeling: differentiaaldiagnostiek en prognose.", "Alle problemen binnen taal zelf zoeken terwijl gehoor, aanbod of algemene ontwikkeling nog niet zijn gewogen.", "Welke interne en externe factor zou jij als eerste navragen?"),
      concept("Model van Levelt", "10-component", "Gebruik het spraakproductiemodel als klinische landkaart: conceptualiseerder voor intentie/pragmatiek, formulator voor semantiek, syntaxis, morfologie en fonologie, articulator voor motorische uitvoering, en monitoring voor zelfcorrectie.", "Schriftelijk: plaats fouten in het model. Mondeling: verantwoord of een fout eerder fonologisch, fonetisch, semantisch of pragmatisch past.", "Alle fouten op één hoop gooien. Een 10-student zegt waar in de keten het waarschijnlijk misgaat en wat je nog moet onderzoeken.", "Bij 'toek' voor 'koek': welke aanwijzingen heb je nodig om formulator versus articulator te onderscheiden?")
    ]
  },
  {
    title: "Diagnostiek en testleer",
    summary: "Van hulpvraag naar verantwoorde conclusie: instrumentkeuze, normscore, observatie en professioneel handelen.",
    concepts: [
      concept("Methodisch handelen", "Diagnostiek", "Werk cyclisch: hulpvraag verhelderen, gegevens verzamelen, analyseren, concluderen, doelen kiezen, behandelen, evalueren en bijstellen.", "Mondeling therapie: vervolgstappen in behandeltraject uitleggen.", "Een behandelplan geven zonder expliciete conclusie of beginsituatie.", "Kun je diagnose, beginsituatie, doel en methode logisch aan elkaar koppelen?"),
      concept("Schlichting-afname", "Diagnostiek", "Bij taalbegrip en taalproductie telt standaardisatie: rustige situatie, neutrale aanbieding, juiste itemvolgorde, correcte scoring en afbreekregels.", "Mondeling diagnostiek: kern van de performance assessment.", "Te snel spreken, helpen met intonatie of achteraf soepel scoren.", "Wat zeg je als je tijdens de afname een verspreking maakt?"),
      concept("Testkwaliteit", "Diagnostiek", "Gebruik tests kritisch: normering, validiteit, betrouwbaarheid en standaardisatie bepalen hoe sterk je conclusie is.", "Schriftelijk: testleer en instrumenteigenschappen.", "Normscores behandelen alsof ze absoluut zijn, zonder betrouwbaarheidsinterval of context.", "Waarom maakt afwijken van standaardafname de normvergelijking zwakker?"),
      concept("Normscores", "Diagnostiek", "Q-scores, T-scores, percentielen en stanines plaatsen een kind ten opzichte van een normgroep. Bij Q-score is 100 gemiddeld en 15 punten één SD.", "Schriftelijk: score-interpretatie en behandelindicatie.", "Leeftijdsequivalent gebruiken als bewijs voor een stoornis.", "Wat betekent Q70 klinisch ongeveer?"),
      concept("Meertalige diagnostiek", "Diagnostiek", "Onderzoek aanbod en functioneren per taal. Weeg thuistaal, Nederlands, leerbaarheid, gehoor en context om NT2, TOS of combinatie te onderscheiden.", "Schriftelijk: casussen over meertaligheid. Mondeling: multidisciplinair advies.", "Alleen Nederlands testen en lage score automatisch TOS noemen.", "Welke drie vragen stel je in een meertalige anamnese?"),
      concept("Procedurele precisie", "10-component", "Voor een ZG moet je testgedrag zichtbaar strak zijn: rustig tempo, neutrale toon, geen cueende intonatie, exacte itemaanbieding, juist scoren, juiste start- en afbreekregels, en direct reflecteren op afwijkingen.", "Mondeling: dit raakt bijna alle diagnostiekcriteria, vooral afname, scoring en criterium 10. Gebruik een rustig tempo als oefenrichtlijn; volg de officiële handleiding voor de echte norm.", "Denken dat inhoudelijke kennis genoeg is terwijl de uitvoering rommelig is. Eén hulpende intonatie kan de standaardisatie aantasten.", "Kun je na een fout zeggen: wat gebeurde er, raakt dit de validiteit, en wat doe ik professioneel?"),
      concept("Betrouwbaarheidsinterval", "10-component", "Rapporteer testscores niet als losse waarheid. Combineer ruwe score, normscore, percentiel/SD waar relevant, betrouwbaarheidsinterval, observaties en hulpvraag.", "Schriftelijk: testleer en casusinterpretatie. Mondeling: verantwoorden waarom je voorzichtig of juist zeker concludeert.", "Alleen 'WQ 82 dus stoornis' zeggen. Een 10-student nuanceert met meetfout, normgroep en dagelijks functioneren.", "Hoe leg je aan ouders uit dat een score een bandbreedte heeft?")
    ]
  },
  {
    title: "Taalstoornissen en TOS",
    summary: "Herkennen, classificeren en wegen van taalproblemen binnen dagelijks functioneren en ICF.",
    concepts: [
      concept("TOS", "Taalstoornissen", "Bij TOS blijft taal achter, belemmert dit dagelijks functioneren en is spontaan herstel onvoldoende waarschijnlijk, terwijl andere verklaringen zorgvuldig zijn uitgesloten of meegewogen.", "Schriftelijk: inclusie, exclusie, ernst. Mondeling: logopedisch beeld en prognose.", "TOS baseren op één lage testscore.", "Welke informatie heb je nodig naast testuitslagen?"),
      concept("Taalbegrip versus productie", "Taalstoornissen", "Sommige kinderen hebben vooral expressieve problemen; anderen hebben gecombineerd begrip- en productieproblemen. Begripsproblemen maken prognose en therapie vaak zwaarder.", "Mondeling: diagnose en behandelprioriteit onderbouwen.", "Een goed pratend kind overschatten terwijl begrip zwak is.", "Hoe check je begrip zonder alleen ja/nee-vragen te stellen?"),
      concept("Semantiek", "Taalstoornissen", "Semantiek gaat om betekenis, woordenschat, woordrelaties en het mentale lexicon. Let op woordvinding, categoriseren en concreet-abstracte ontwikkeling.", "Schriftelijk: casussen over woordenschat en woordvinding.", "Alleen woorden tellen en kwaliteit van woordgebruik vergeten.", "Noem een receptieve en productieve semantische taak."),
      concept("Morfosyntaxis", "Taalstoornissen", "Morfologie gaat over woordvormen; syntaxis over zinsbouw. Analyseer zinslengte, woordvolgorde, werkwoordvormen, meervoud, verkleiningen en samengestelde zinnen.", "Schriftelijk en mondeling: Schlichting productie, doelen bij zinsontwikkeling.", "Fouten als luiheid zien in plaats van ontwikkelingspatroon of stoornis.", "Maak van 'kind koek eten' een passende modelzin net boven niveau."),
      concept("Pragmatiek", "Taalstoornissen", "Pragmatiek is taalgebruik in context: intentie, beurtwisseling, onderwerp, presuppositie, sociale functie en verhalen vertellen.", "Schriftelijk: discrepantie tussen testscores en dagelijks functioneren.", "Pragmatiek negeren omdat een kind goed scoort op formele taaltests.", "Welke observatie toont dat een kind onvoldoende rekening houdt met de luisteraar?"),
      concept("Differentiaaldiagnostiek TOS", "10-component", "Onderbouw waarom het beeld past bij TOS, NT2/blootstellingsachterstand, verstandelijke beperking, gehoorprobleem, ASS/ADHD-invloed of een combinatie. Kijk naar beide talen, leerbaarheid, hardnekkigheid en dagelijks functioneren.", "Schriftelijk: open casussen. Mondeling: diagnose en advies verdedigen.", "TOS noemen zonder alternatieven actief uit te sluiten of mee te wegen.", "Welke gegevens heb je nodig om blootstellingsachterstand van hardnekkige taalstoornis te onderscheiden?")
    ]
  },
  {
    title: "Spraakdiagnostiek en behandeling",
    summary: "Differentieer oorzaak, kies doelen en bouw van perceptie naar productie en generalisatie.",
    concepts: [
      concept("Fonetisch probleem", "Spraak", "Een motorisch articulatieprobleem: de klank lukt consequent niet of afwijkend, ook bij nazeggen en in verschillende posities.", "Schriftelijk: differentiaaldiagnose. Mondeling: methodekeuze verantwoorden.", "Een fonetische aanpak kiezen terwijl het kind de klank motorisch wel kan maken.", "Welke taak gebruik je om motorische produceerbaarheid te checken?"),
      concept("Fonologisch probleem", "Spraak", "Het klanksysteem is onvoldoende georganiseerd. Fouten zijn vaak patroonmatig of contextgevoelig: processen, ontbrekende contrasten en wisselende realisaties.", "Schriftelijk: processen en feature-analyse.", "Alleen per losse klank behandelen en het contrast niet trainen.", "Welke contrasten onderzoek je bij d/t of k/t-fouten?"),
      concept("VOD en dysartrie", "Spraak", "VOD zit vooral in planning en programmering van spraakbewegingen; dysartrie in neurologische aansturing van de uitvoering.", "Schriftelijk: plaatsing in spraakproductiemodel.", "Zoekende, wisselende fouten verwarren met een gewone articulatiestoornis.", "Welke observatie past meer bij planning dan bij één klankmotorisch probleem?"),
      concept("Vereenvoudigingsprocessen", "Spraak", "Kinderen reduceren spraak via processen zoals clusterreductie, finale consonantdeletie, fronting, stopping of syllabeverlies. Leeftijd en consistentie bepalen ernst.", "Schriftelijk: normale versus afwijkende ontwikkeling.", "Een proces beoordelen zonder leeftijdsnorm of verstaanbaarheid mee te nemen.", "Is fronting op 4 jaar hetzelfde risico als op 2 jaar? Leg uit."),
      concept("Spraaktherapie", "Spraak", "Fonetisch behandel je productie stapsgewijs; fonologisch behandel je contrasten, vaak met perceptie vóór productie. Generalisatie moet gepland worden.", "Mondeling therapie: doel, methode, vorm en duur onderbouwen.", "Mondmotorische oefeningen inzetten voor spraak zonder spraakdoel.", "Formuleer een kortetermijndoel voor clusterreductie."),
      concept("Consistentie-check", "10-component", "Onderzoek of foutpatronen stabiel of wisselend zijn. Veel variatie in herhaalde benoemingen wijst eerder richting inconsistente fonologische stoornis of planning/programmering dan naar een enkel fonetisch probleem.", "Schriftelijk: differentiaaldiagnose spraak. Mondeling: methodekeuze verantwoorden.", "Een kind met wisselende fouten behandelen alsof één klankmotorisch probleem centraal staat.", "Laat je hetzelfde woord drie keer benoemen: wat betekent het als het drie keer anders klinkt?")
    ]
  },
  {
    title: "Therapie en samenwerken",
    summary: "Van beginsituatie naar doel, methode, therapievorm, duur, samenwerking en prognose.",
    concepts: [
      concept("SMART-doelen", "Therapie", "Een sterk doel noemt wie, gedrag, niveau, criterium, context en termijn. Het korte doel moet zichtbaar bijdragen aan het lange doel.", "Mondeling: criteria 12 en 13.", "Doelen als 'woordenschat verbeteren' zonder meetbaar gedrag.", "Maak 'betere zinnen maken' toetsbaar."),
      concept("Methodekeuze", "Therapie", "Kies methode op basis van diagnose: bijvoorbeeld taalstimulering, semantische netwerkopbouw, morfosyntactische interventie, Metaphon/minimale paren of Van Riper.", "Mondeling: criteria 14 en 15.", "Een bekende methode noemen zonder te motiveren waarom juist deze casus daarbij past.", "Welke methode past beter bij fonologisch contrastverlies dan bij distorsie?"),
      concept("Therapievorm", "Therapie", "Direct, indirect, individueel, groep, oudercoaching of schoolgerichte aanpak kies je op grond van leeftijd, aandacht, context, hulpvraag en generalisatie.", "Mondeling: criteria 16 en 17.", "Alleen sessies in de behandelkamer plannen terwijl probleem vooral op school zichtbaar is.", "Wanneer kies je oudercoaching als hoofdroute?"),
      concept("Prognose", "Therapie", "Een prognose weegt ernst, begrip, leeftijd, leerbaarheid, omgeving, motivatie, comorbiditeit, meertaligheid en behandelrespons.", "Mondeling: criterium 20.", "Alleen zeggen 'goed' of 'matig' zonder factoren en evaluatiemoment.", "Noem twee bevorderende en twee belemmerende factoren."),
      concept("Multidisciplinair", "Therapie", "Werk samen met ouders, leerkracht, jeugdarts, KNO, audiologisch centrum, orthodontie, psycholoog/orthopedagoog of cluster-2 wanneer de casus daarom vraagt.", "Mondeling: criterium 19. Schriftelijk: richtlijn en ICF.", "Te lang monodisciplinair doorgaan bij weinig vooruitgang of brede ontwikkelingsvragen.", "Wanneer vraag je een multidisciplinair team om mee te kijken?"),
      concept("ICF-brug", "10-component", "Maak steeds de brug van functie naar activiteit en participatie. Niet alleen 'morfosyntaxis is zwak', maar: daardoor vertelt het kind minder begrijpelijk, haakt af in kringgesprekken en heeft ondersteuning nodig in klasinteractie.", "Mondeling therapie: doelen, therapievorm, samenwerking en prognose. Schriftelijk: interventieplan.", "ICF-termen los noemen zonder concreet dagelijks gevolg.", "Kun je één functieprobleem vertalen naar één activiteit, één participatieprobleem en één omgevingsaanpassing?")
    ]
  },
  {
    title: "Mondgebied, OMFT en preventie",
    summary: "Structuur, functie, afwijkende mondgewoonten en de verbinding met spraak.",
    concepts: [
      concept("Structuuronderzoek", "Mondgebied", "Observeer lippen, tong, tongriem, gebit, kaak, palatum, velum, uvula en neus. Bij structurele verdenking verwijs je medisch.", "Schriftelijk: orofaciale functies en professionele grenzen.", "Zelf medische conclusies trekken over anatomische afwijkingen.", "Welke bevinding laat je beoordelen door KNO, huisarts of orthodontist?"),
      concept("Functieonderzoek", "Mondgebied", "Bekijk rustpositie, slikken, drinken, kauwen, mondmotoriek en spreken. Let op lipsluiting, tongpositie, masseteractiviteit en compensaties.", "Schriftelijk: observatie en behandelindicatie.", "Alleen in actie kijken en rustgewoonten missen.", "Wat zegt tong naar voren bij slikken mogelijk over functie?"),
      concept("Afwijkende mondgewoonten", "Mondgebied", "Zuigen, mondademen, tongpersen, afwijkende lipgewoonten en verkeerde rustpositie kunnen vorm en functie beïnvloeden.", "Schriftelijk: OMFT en preventie.", "Articulatie trainen zonder hardnekkige gewoonte aan te pakken.", "Waarom start OMFT vaak met gewoonteafbouw?"),
      concept("Occlusie", "Mondgebied", "Beoordeel molaarrelatie, open beet, overbeet en krachtbalans tussen tong, lippen en wangen. Tandheelkundige termen helpen precies rapporteren.", "Schriftelijk: tandheelkundige basisbegrippen.", "Open beet en overbeet door elkaar halen.", "Wat is het verschil tussen verticale open beet en sagittale overbeet?"),
      concept("OMFT", "Mondgebied", "OMFT herstelt spierbalans en functies rond de mond: gewoonteafbouw, spiertraining, sliktraining, articulatie en transfer naar dagelijks gedrag.", "Schriftelijk: behandelvolgorde en samenwerking.", "Alleen oefeningen geven zonder motivatie, herhaling en transferplan.", "Welke disciplines kunnen bij OMFT relevant zijn?"),
      concept("Triangle of Forces", "10-component", "Gebitsstand en mondfunctie worden beïnvloed door balans tussen tongdruk van binnenuit en lip-/wangdruk van buitenaf, waaronder m. orbicularis oris en m. buccinator. Verstoring kan bijdragen aan open beet, overbeet of tongpersgedrag.", "Schriftelijk: mondgebied, occlusie en OMFT. Mondeling: samenwerking met orthodontie/tandarts onderbouwen.", "Occlusie alleen als tandprobleem zien en de spierbalans vergeten.", "Welke spier- en tongkrachten kunnen een open beet onderhouden?")
    ]
  }
];

const oralPrompts = [
  "Demonstreer hoe je een Schlichting-item rustig en neutraal aanbiedt. Benoem daarna waarom intonatie verschil maakt.",
  "Leg uit met welke sectie je start bij een gegeven casus en hoe je een afbreekregel verantwoordt.",
  "Je maakte één verspreking tijdens de afname. Formuleer professioneel hoe je dit in je reflectie benoemt.",
  "Formuleer een langetermijndoel en kortetermijndoel bij een kind met zwakke zinsontwikkeling.",
  "Onderbouw een therapievorm waarbij ouders actief worden betrokken. Wanneer is dit sterker dan alleen directe therapie?",
  "Geef een prognose bij een meertalig kind met lage Nederlandse scores maar duidelijke groei na aanbod.",
  "Plaats een spraakfout in het Model van Levelt: wat past bij formulator, wat bij articulator, en welk onderzoek maakt het scherper?",
  "Maak een ICF-brug: koppel één zwakke taalfunctie aan activiteit, participatie en een omgevingsaanpassing.",
  "Verantwoord een testscore met betrouwbaarheidsinterval: wat zeg je wel en wat zeg je niet tegen ouders?",
  "Je mist een afbreekregel. Benoem dit zelf, leg de impact op validiteit uit en formuleer je herstel."
];

const questions = [
  {
    type: "Juist / onjuist",
    question: "Een lage score op een Nederlandstalige taaltest is bij een meertalig kind voldoende om TOS te concluderen.",
    answers: ["Juist", "Onjuist"],
    correct: 1,
    feedback: "Onjuist. Je moet aanbod, thuistaal, leerbaarheid, gehoor en dagelijks functioneren meenemen om NT2, TOS of een combinatie te onderscheiden."
  },
  {
    type: "Juist / onjuist",
    question: "Bij een fonologisch probleem kan een klank soms correct voorkomen en in een andere context fout zijn.",
    answers: ["Juist", "Onjuist"],
    correct: 0,
    feedback: "Juist. Fonologische problemen zijn vaak patroonmatig of contextgevoelig; bij fonetische problemen lukt de realisatie doorgaans consequent niet."
  },
  {
    type: "Casusvraag",
    question: "Een kind van 5;8 scoort gemiddeld op formele taaltests, maar ouders en leerkracht zien weinig beurtwisseling, vreemde onderwerpwissels en onduidelijke verhalen. Wat onderzoek je aanvullend?",
    answers: ["Alleen articulatie", "Pragmatiek in meerdere contexten", "Alleen gehoor", "Geen vervolg nodig"],
    correct: 1,
    feedback: "Pragmatiek. Denk aan observatie, uitlokkingstaken, ouder/leerkrachtinformatie en narratieve vaardigheden."
  },
  {
    type: "Juist / onjuist",
    question: "Leeftijdsequivalenten zijn geschikt om hard te bewijzen hoeveel maanden taalachterstand een kind heeft.",
    answers: ["Juist", "Onjuist"],
    correct: 1,
    feedback: "Onjuist. Gebruik liever standaardscores, SD, percentiel en betrouwbaarheidsinterval; leeftijdsequivalenten zijn snel misleidend."
  },
  {
    type: "Casusvraag",
    question: "Een kind reduceert alle clusters en heeft moeite met klankcontrasten. Welke behandelroute ligt het meest voor de hand?",
    answers: ["Niet-spraak mondmotoriek", "Fonologische contrasttherapie met perceptie en productie", "Alleen voorlezen", "Wachten tot groep 3"],
    correct: 1,
    feedback: "Kies een fonologische aanpak: contrasten opbouwen, auditief onderscheiden, productie oefenen en generaliseren."
  },
  {
    type: "Casusvraag",
    question: "Een kind zegt 'toek' voor 'koek', maar kan /k/ soms wel nazeggen. Welke redenering past het best bij een 10-student?",
    answers: ["Altijd fonetisch behandelen", "Alleen articulatoren inspecteren", "Via Levelt en consistentie onderzoeken of het fonologisch, fonetisch of planning is", "Geen diagnostiek nodig"],
    correct: 2,
    feedback: "Een 10-student lokaliseert het probleem klinisch: formulator, planning/programmering of articulator, en checkt consistentie en produceerbaarheid."
  },
  {
    type: "Juist / onjuist",
    question: "Bij testinterpretatie is één normscore zonder betrouwbaarheidsinterval en observaties genoeg voor een stevige conclusie.",
    answers: ["Juist", "Onjuist"],
    correct: 1,
    feedback: "Onjuist. Combineer score, BI, normgroep, observaties, hulpvraag en dagelijks functioneren."
  },
  {
    type: "Casusvraag",
    question: "Een kind heeft zwakke morfosyntaxis en doet nauwelijks mee in de kring. Welke formulering is het sterkst?",
    answers: ["Het kind heeft een grammaticaal probleem", "We oefenen werkwoorden", "De functiezwakte belemmert begrijpelijk vertellen en participatie in de kring; doelen richten zich op zinbouw in klascontext", "Alleen ouders krijgen huiswerk"],
    correct: 2,
    feedback: "Dit is de ICF-brug: functie → activiteit → participatie → contextgerichte interventie."
  },
  {
    type: "Juist / onjuist",
    question: "Veel variatie in herhaalde benoemingen kan wijzen op een ander behandelspoor dan een consistente fonetische articulatiefout.",
    answers: ["Juist", "Onjuist"],
    correct: 0,
    feedback: "Juist. De consistentie-check helpt differentiëren tussen fonetisch, fonologisch inconsistent en planning/programmering."
  }
];

const cases = [
  {
    title: "Casus A: expressieve taalzwakte",
    age: "4;6 jaar",
    tags: ["productie", "morfosyntaxis", "begrip redelijk"],
    situation: "Het kind begrijpt dagelijkse opdrachten meestal, maar gebruikt korte zinnen, laat werkwoordsvormen weg en vertelt onsamenhangend.",
    steps: [
      "Conclusie: vooral expressieve morfosyntactische achterstand, pragmatiek/narratief meewegen.",
      "Aanvullend: spontane-taalanalyse, productieprofiel, ouder- en leerkrachtinformatie.",
      "Doel: langere grammaticale uitingen in spel en verhaalcontext.",
      "Aanpak: modelleren, uitbreiden, recasten, oudercoaching en schoolsituaties meenemen."
    ]
  },
  {
    title: "Casus B: fonologisch contrastverlies",
    age: "4;0 jaar",
    tags: ["spraak", "verstaanbaarheid", "fonologie"],
    situation: "Het kind laat beginmedeklinkers vaak weg en vervangt achterklanken door voorin gemaakte klanken. Gehoor en motoriek lijken voldoende.",
    steps: [
      "Conclusie: vermoedelijk fonologische achterstand of stoornis; ernst door verstaanbaarheid.",
      "Aanvullend: drie-positie-onderzoek, spontane spraak, feature-analyse, consistentie-check en plaatsing in Levelt.",
      "Doel: herstel van woordstructuur en plaatscontrast met meetbaar criterium.",
      "Aanpak: auditieve discriminatie, minimale paren/Metaphon, productie en generalisatie."
    ]
  },
  {
    title: "Casus C: meertalige diagnostiek",
    age: "6;8 jaar",
    tags: ["meertaligheid", "NT2/TOS", "school"],
    situation: "Het kind hoort thuis Pools en op school Nederlands. Nederlandse woordenschat is laag; ouders melden ook in de thuistaal moeite met verhalen.",
    steps: [
      "Conclusie: TOS niet uitsluiten; lage NL-score kan niet los worden geïnterpreteerd.",
      "Aanvullend: gehoor, meertalige anamnese, L1-informatie, dynamische diagnostiek en differentiaal NT2/TOS.",
      "Doel: taalvaardigheid en schoolse communicatie ondersteunen in beide talen waar mogelijk.",
      "Aanpak: ouders in thuistaal betrekken, visuele steun, scaffolding, schooloverleg."
    ]
  },
  {
    title: "Casus D: pragmatische zorgen",
    age: "5;9 jaar",
    tags: ["pragmatiek", "narratief", "context"],
    situation: "Het kind praat veel, maar sluit slecht aan, geeft te weinig achtergrondinformatie en raakt in conflict tijdens spel.",
    steps: [
      "Conclusie: pragmatische kwetsbaarheid ondanks mogelijk redelijke taalvorm.",
      "Aanvullend: naturalistische observatie, ouder/leerkrachtvragen, narratieve taak.",
      "Doel: beurtwisseling, luisteraaraanpassing en begrijpelijk vertellen.",
      "Aanpak: kindgerichte communicatieve therapie, rollenspel, ouder- en leerkrachtcoaching."
    ]
  }
];

function concept(title, domain, body, exam, pitfall, check) {
  return { title, domain, body, exam, pitfall, check };
}

const grid = document.querySelector("#domainGrid");
const search = document.querySelector("#search");
const dialog = document.querySelector("#conceptDialog");

function renderDomains(filter = "") {
  const query = filter.trim().toLowerCase();
  grid.innerHTML = "";

  domains.forEach((domain) => {
    const concepts = domain.concepts.filter((item) => {
      const haystack = `${item.title} ${item.domain} ${item.body}`.toLowerCase();
      return haystack.includes(query);
    });
    if (query && concepts.length === 0) return;

    const card = document.createElement("article");
    card.className = "domain";
    card.innerHTML = `<h3>${domain.title}</h3><p>${domain.summary}</p><div class="concept-list"></div>`;
    const list = card.querySelector(".concept-list");
    concepts.forEach((item) => {
      const button = document.createElement("button");
      button.className = "concept";
      button.textContent = item.title;
      button.addEventListener("click", () => openConcept(item));
      list.append(button);
    });
    grid.append(card);
  });
}

function openConcept(item) {
  document.querySelector("#dialogDomain").textContent = item.domain;
  document.querySelector("#dialogTitle").textContent = item.title;
  document.querySelector("#dialogBody").textContent = item.body;
  document.querySelector("#dialogExam").textContent = item.exam;
  document.querySelector("#dialogPitfall").textContent = item.pitfall;
  document.querySelector("#dialogCheck").textContent = item.check;
  dialog.showModal();
}

document.querySelector("#closeDialog").addEventListener("click", () => dialog.close());
search.addEventListener("input", (event) => renderDomains(event.target.value));

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-selected", "false");
    });
    document.querySelectorAll(".view").forEach((item) => item.classList.remove("is-visible"));
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");
    document.querySelector(`#${tab.dataset.view}`).classList.add("is-visible");
  });
});

document.querySelector("#startOralDrill").addEventListener("click", () => {
  const drill = document.querySelector("#oralDrill");
  drill.classList.add("is-visible");
  drill.innerHTML = `<h3>10-minutendril</h3><ol>${shuffle(oralPrompts)
    .slice(0, 4)
    .map((prompt) => `<li>${prompt}</li>`)
    .join("")}</ol><p class="feedback">Tip: antwoord steeds in deze volgorde: logopedisch beeld → keuze → onderbouwing → evaluatie.</p>`;
});

document.querySelector("#newQuestion").addEventListener("click", renderQuestion);
document.querySelector("#newCase").addEventListener("click", renderCase);

function renderQuestion() {
  const item = questions[Math.floor(Math.random() * questions.length)];
  const card = document.querySelector("#questionCard");
  card.innerHTML = `<p class="eyebrow">${item.type}</p><h3>${item.question}</h3><div class="answers"></div><div class="feedback" hidden></div>`;
  const answers = card.querySelector(".answers");
  const feedback = card.querySelector(".feedback");
  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = answer;
    button.addEventListener("click", () => {
      card.querySelectorAll(".answer").forEach((option) => {
        option.disabled = true;
      });
      button.classList.add(index === item.correct ? "is-correct" : "is-wrong");
      if (index !== item.correct) {
        answers.children[item.correct].classList.add("is-correct");
      }
      feedback.hidden = false;
      feedback.textContent = item.feedback;
    });
    answers.append(button);
  });
}

function renderCase() {
  const item = cases[Math.floor(Math.random() * cases.length)];
  const card = document.querySelector("#caseCard");
  card.innerHTML = `
    <p class="eyebrow">Oefencasus</p>
    <h3>${item.title}</h3>
    <div class="case-meta"><span class="pill">${item.age}</span>${item.tags.map((tag) => `<span class="pill">${tag}</span>`).join("")}</div>
    <p>${item.situation}</p>
    <div class="case-steps">${item.steps.map((step) => `<div>${step}</div>`).join("")}</div>
    <p class="feedback">Hardop oefenen: geef eerst je conclusie in 20 seconden, daarna je onderzoeksvraag, doel en therapiekeuze.</p>
  `;
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

renderDomains();
renderQuestion();
renderCase();
