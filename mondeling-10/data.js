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
      ['taalproductie-intonatie', 'Taalproductie stimuluszin met juiste intonatie aanbieden'],
      ['taalproductie-items', 'Taalproductie-items juist aanbieden'],
      ['taalproductie-score', 'Taalproductie scoren volgens handleiding'],
      ['startsectie', 'Juiste startsectie bij de casus benoemen'],
      ['afbreekregel', 'Juiste afbreekregels benoemen'],
      ['zelfverantwoording', 'Eigen handelen en eventuele fouten professioneel verantwoorden']
    ],
    prompts: [
      'Demonstreer hoe je de testsituatie klaarzet en leg daarna uit waarom dit professioneel is.',
      'Bied een Taalbegrip-item aan zonder prosodische hints. Benoem daarna wat je juist níet mag doen.',
      'Leg uit welke sectie je kiest bij een casusleeftijd en wat je doet als het startitem fout gaat.',
      'Je verspreekt je tijdens een Taalproductie-item. Wat zeg je achteraf tegen de beoordelaar?',
      'Noem hardop de afbreekregel en verantwoord waarom je wel of niet doorgaat.'
    ],
    model: 'Ik creëer eerst een rustige, voorspelbare testsituatie met het materiaal correct geplaatst en zonder hulp van derden. Bij Taalbegrip gebruik ik een neutrale toon, bij Taalproductie juist natuurlijke intonatie. Ik benoem startsectie, eventuele terugkeer- of afbreekregel en scoor volgens de handleiding. Als ik een fout maak, benoem ik die concreet en verantwoord ik of dit de respons beïnvloed kan hebben.'
  },
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
      title: 'Taalproductie Zinsontwikkeling',
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
