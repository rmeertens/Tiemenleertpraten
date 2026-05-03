'use strict';

window.ORAL_10_DATA = {
  diagnostics: {
    label: 'Diagnostiek',
    pass: 20,
    criteria: [
      ['testsituatie', 'Passende testsituatie en professioneel handelen'],
      ['taalbegrip-toon', 'Taalbegrip rustig en neutraal aanbieden'],
      ['taalbegrip-items', 'Taalbegrip-items juist aanbieden'],
      ['taalbegrip-score', 'Taalbegrip scoren volgens handleiding'],
      ['zinsontwikkeling-intonatie', 'Taalproductie-3 Zinsontwikkeling stimuluszin met juiste intonatie aanbieden'],
      ['zinsontwikkeling-items', 'Zinsontwikkeling-items juist aanbieden'],
      ['zinsontwikkeling-score', 'Zinsontwikkeling scoren volgens handleiding'],
      ['startsectie', 'Juiste startsectie bij de casus benoemen'],
      ['afbreekregel', 'Juiste afbreekregels benoemen'],
      ['zelfverantwoording', 'Eigen handelen en eventuele fouten professioneel verantwoorden']
    ],
    prompts: [
      'Demonstreer hoe je de testsituatie klaarzet en leg daarna uit waarom dit professioneel is.',
      'Bied een Taalbegrip-item aan zonder prosodische hints. Benoem daarna wat je juist níet mag doen.',
      'Leg uit welke sectie je kiest bij een casusleeftijd en wat je doet als het startitem fout gaat.',
      'Je verspreekt je tijdens een Zinsontwikkeling-item. Wat zeg je achteraf tegen de beoordelaar?',
      'Noem hardop de afbreekregel en verantwoord waarom je wel of niet doorgaat.'
    ],
    model: 'Ik creëer eerst een rustige, voorspelbare testsituatie met het materiaal correct geplaatst en zonder hulp van derden. Bij Taalbegrip-3 gebruik ik een neutrale toon. Bij Taalproductie-3 oefen ik alleen Zinsontwikkeling en bied ik de stimuluszin met passende natuurlijke intonatie aan. Ik benoem startsectie, eventuele terugkeer- of afbreekregel en scoor volgens de handleiding. Als ik een fout maak, benoem ik die concreet en verantwoord ik of dit de respons beïnvloed kan hebben.'
  },
  prepTools: [
    {
      title: '1. Leeftijd en startpunt',
      href: '/spraak-taal-kompas/schlichting-simulator/',
      text: 'Gebruik de Schlichting Simulator als rekentool voor leeftijd, startkeuze en hardop onderbouwen.'
    },
    {
      title: '2. Afbreekregel hardop',
      href: '/regelcheck/',
      text: 'Gebruik Regelcheck om start, stop en verantwoording strak te formuleren.'
    },
    {
      title: '3. Casus en therapie',
      href: '/pak-de-10/',
      text: 'Gebruik Pak de 10 om diagnose, ICF, doelen en advies toetsgericht klaar te zetten.'
    },
    {
      title: '4. Strenge AI-check',
      href: '/studiecoach/',
      text: 'Gebruik Studiecoach voor een laatste kritische check op je Schlichting-afname.'
    }
  ],
  guideCards: [
    {
      title: 'Testsituatie',
      must: ['90-graden hoekopstelling gebruiken', 'tafel en stoel aanpassen aan het kind', 'testkoffer buiten zicht en bereik houden', 'scoreformulier buiten zicht plaatsen', 'derden buiten gezichtslijn en zonder hulp'],
      pitfall: 'Recht tegenover het kind zitten of te veel materiaal op tafel leggen maakt de afname minder gestandaardiseerd.'
    },
    {
      title: 'Taalbegrip-3',
      must: ['Sectie A uitnodigend aanbieden', 'vanaf Sectie B neutraal spreken', 'geen nadruk op voorzetsels of kernwoorden leggen', 'bij geen respons maximaal eenmalig herhalen', 'spontane correcte benoeming in Sectie A kunnen duiden'],
      pitfall: 'Prosodie, blikrichting, wijzen of te veel herhaling kan het taalbegrip kunstmatig helpen.'
    },
    {
      title: 'Zinsontwikkeling',
      must: ['alleen het onderdeel Zinsontwikkeling trainen', 'stimuluszin natuurlijk maar exact aanbieden', 'intonatie laten passen bij het itemtype', 'geen ongeoorloofde fonologische of grammaticale cue geven', 'scoring koppelen aan morfosyntaxis, niet aan articulatie'],
      pitfall: 'Een verspreking of vragende toon kan het doelitem veranderen.'
    },
    {
      title: 'Afbreken en scoren',
      must: ['kalenderleeftijd gebruiken voor instapkeuze', 'terugkeerregel toepassen bij instapfout', 'vijf opeenvolgende fouten als plafondregel paraat hebben', 'secties met volledige afname kunnen uitzonderen', 'score altijd volgens handleiding onderbouwen'],
      pitfall: 'Alleen zeggen wat je deed is onvoldoende; je moet zeggen wat het betekent voor validiteit en betrouwbaarheid.'
    },
    {
      title: 'Criterium 10',
      must: ['eigen fout concreet benoemen', 'maximaal twee kritieke fouten bewaken', 'uitleggen of de respons beïnvloed is', 'conclusie trekken over betrouwbaarheid'],
      pitfall: 'Een fout wegpoetsen klinkt minder professioneel dan hem strak verantwoorden.'
    }
  ],
  startRules: [
    ['2;0-2;9', 'Sectie A item 1', 'geen terugkeer'],
    ['2;10-3;7', 'Sectie A item 9', 'terug naar item 1 bij instapfout'],
    ['3;8-4;2', 'Sectie B item 13', 'terug naar item 9, daarna item 1'],
    ['4;3-5;2', 'Sectie B item 20', 'terug naar item 13, daarna 9 en 1'],
    ['5;3-7;0', 'Sectie C item 34', 'terug naar item 20, daarna 13, 9 en 1']
  ],
  drills: [
    ['Waar zit je ten opzichte van het kind?', 'Hoekopstelling: je behoudt zicht op kind en materiaal zonder een barriere te maken.', 'Criterium 1'],
    ['Hoe klinkt je intonatie in Sectie A van Taalbegrip?', 'Uitnodigend, zodat het jonge kind in de taak komt.', 'Criterium 2'],
    ['Wat verandert vanaf Sectie B?', 'Je toon wordt neutraal en je accentueert geen kernwoorden.', 'Criterium 2'],
    ['Wat doe je bij spontane correcte benoeming in Sectie A?', 'Je kunt dit als correct duiden en voorkomt onnodige herhaling van hetzelfde doel.', 'Criterium 3/4'],
    ['Hoe vaak herhaal je een Taalbegrip-testitem bij geen respons?', 'Maximaal eenmalig, tenzij het protocol anders aangeeft.', 'Criterium 3'],
    ['Waar staat de testkoffer?', 'Buiten zicht en bereik, zodat materiaal geen afleiding of grijpgedrag oproept.', 'Criterium 1'],
    ['Een kind zegt "De poeth loopt" bij Zinsontwikkeling. Score?', 'Goed als de morfosyntactische structuur intact is; articulatie is hier niet het doel.', 'Criterium 7'],
    ['Een kind laat lidwoord of vervoeging weg bij Zinsontwikkeling. Score?', 'Fout wanneer de morfosyntactische structuur van de doelzin wordt aangetast.', 'Criterium 7'],
    ['Wat bepaalt het instappunt?', 'De exacte kalenderleeftijd bepaalt je startsectie of startitem.', 'Criterium 8'],
    ['Wat doe je bij instapfout op hogere leeftijd?', 'Je past trapsgewijs de terugkeerregel toe om het basale niveau te bepalen.', 'Criterium 8/9'],
    ['Wanneer breek je veel Taalbegrip-secties af?', 'Bij vijf opeenvolgende fouten, met aandacht voor secties waarvoor volledige afname of overgangsregels gelden.', 'Criterium 9'],
    ['Mag je naar het antwoordmateriaal wijzen?', 'Nee, dat is non-verbale sturing en bedreigt de validiteit.', 'Criterium 3'],
    ['Hoe bied je een Zinsontwikkeling-stimuluszin aan?', 'Rustig, exact en met passende natuurlijke intonatie.', 'Criterium 5'],
    ['Waarom is criterium 10 belangrijk?', 'Je toont dat je eigen handelen kunt beoordelen en de invloed op betrouwbaarheid kunt verantwoorden.', 'Criterium 10'],
    ['Wat zeg je na een procedurefout?', 'Ik benoem de fout concreet, analyseer mogelijke invloed op respons en trek een conclusie over betrouwbaarheid.', 'Criterium 10']
  ],
  redFlags: [
    'Recht tegenover het kind zitten in plaats van een hoekopstelling.',
    'Starten zonder kalenderleeftijd en startsectie te controleren.',
    'Een instapfout negeren en geen terugkeerregel toepassen.',
    'Taalbegrip sturen met nadruk, blikrichting of wijzen.',
    'Meer materiaal op tafel leggen dan nodig is voor het actuele item.',
    'Articulatiefouten fout rekenen bij Zinsontwikkeling terwijl morfosyntaxis intact is.',
    'Een eigen verspreking of procedurefout niet benoemen in criterium 10.',
    'Alleen beschrijven wat je deed, zonder validiteit of betrouwbaarheid te verantwoorden.'
  ],
  therapy: {
    label: 'Therapie',
    pass: 20,
    criteria: [
      ['vervolgstappen', 'Vervolgstappen passend bij logopedisch beeld uitleggen'],
      ['lt-doel', 'Langetermijndoel passend bij beginsituatie'],
      ['kt-doel', 'Kortetermijndoel passend bij LT-doel en beginsituatie'],
      ['methode-past', 'Methode past bij het LT-doel'],
      ['methode-verantwoording', 'Methodekeuze motiveren'],
      ['vorm-past', 'Therapievorm past bij doelen en beginsituatie'],
      ['vorm-verantwoording', 'Therapievorm motiveren'],
      ['duur', 'Duur/frequentie past bij doelen en beginsituatie'],
      ['samenwerking', 'Samenwerking met andere disciplines beschrijven'],
      ['prognose', 'Prognose geven']
    ],
    prompts: [
      'Formuleer een LT-doel en KT-doel voor een kind met fonologische processen en zwakke verstaanbaarheid.',
      'Verdedig waarom je kiest voor een fonologische methode, oudercoaching of schoolgerichte aanpak.',
      'Leg uit hoe je therapieduur en evaluatiemoment koppelt aan beginsituatie en hulpvraag.',
      'Geef een therapieadvies voor een meertalig kind waarbij TOS versus NT2 nog niet volledig duidelijk is.',
      'Beschrijf samenwerking met ouders, leerkracht en een andere discipline zonder vaag te blijven.'
    ],
    model: 'Mijn vervolgstappen sluiten aan bij het logopedisch beeld: ik kies een concreet LT-doel voor functioneren en een meetbaar KT-doel voor de eerste behandelperiode. De methode, therapievorm en duur verantwoord ik vanuit beginsituatie, leeftijd, belastbaarheid en generalisatie. Ik betrek ouders, school en relevante disciplines en geef een voorzichtige prognose met voorwaarden.'
  },
  cases: [
    {
      title: 'Taalbegrip-afname',
      context: 'Kind reageert impulsief en kijkt naar de testleider voor bevestiging.',
      task: 'Demonstreer neutraal aanbieden, professioneel begrenzen en achteraf verantwoorden.'
    },
    {
      title: 'Taalproductie-3: Zinsontwikkeling',
      context: 'Je merkt dat je bijna vragende intonatie gebruikt bij een stimuluszin.',
      task: 'Leg uit wat het risico is, herstel professioneel en benoem de invloed op betrouwbaarheid.'
    },
    {
      title: 'Therapie bij fonologische problematiek',
      context: 'Kind is slecht verstaanbaar, maakt fronting en clusterreductie en durft minder te spreken in de klas.',
      task: 'Geef LT-doel, KT-doel, methode, therapievorm, samenwerking en prognose.'
    },
    {
      title: 'Therapie bij taalproductiezwakte',
      context: 'Kind gebruikt korte zinnen, laat functiewoorden weg en heeft visuele steun nodig.',
      task: 'Verdedig behandelkeuze en maak het advies concreet voor ouders en leerkracht.'
    },
    {
      title: 'Meertalige casus',
      context: 'Nederlandse scores zijn laag, thuistaalinformatie is nog onvolledig en school vraagt om advies.',
      task: 'Leg uit welke vervolgstap je kiest en waarom je voorzichtig bent met norminterpretatie.'
    }
  ],
  scoreTable: [
    [5, 1.0], [7, 1.5], [9, 2.0], [10, 2.5], [12, 3.0], [14, 3.5],
    [16, 4.0], [17, 4.5], [19, 5.0], [21, 5.5], [23, 6.0], [25, 6.5],
    [27, 7.0], [30, 7.5], [33, 8.0], [35, 8.5], [37, 9.0], [39, 9.5], [40, 10.0]
  ]
};
