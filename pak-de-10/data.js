'use strict';

window.PAK_DE_10_DATA = {
  exams: [
    {
      id: 'diagnostiek',
      title: 'Algemene opdracht diagnostiek',
      summary: 'Werk toe naar onderzoeksverslag, ICF-model, conclusie, diagnose, schoolkeuze en advies.',
      route: ['Casus doorgronden', 'Logopedische diagnostiek interpreteren', 'Multidisciplinaire gegevens wegen', 'ICF invullen', 'Diagnose onderbouwen', 'Conclusie en advies formuleren', 'MDO-verdediging oefenen']
    },
    {
      id: 'mdo',
      title: 'MDO mondeling',
      summary: 'Train om in 60 seconden helder te zeggen wat er speelt, wat je nog mist en wat je adviseert.',
      route: ['Kernprobleem in 1 zin', 'Scores betekenis geven', 'Valkuilen benoemen', 'Vragen aan disciplines', 'Schoolkeuze beargumenteren', 'Advies kort verdedigen']
    },
    {
      id: 'verslag',
      title: 'Onderzoeksverslag',
      summary: 'Schrijf niet beschrijvend, maar methodisch: gegeven -> interpretatie -> consequentie -> keuze.',
      route: ['Hulpvraag', 'Onderzoeksgegevens', 'Interpretatie', 'ICF', 'Diagnose', 'Conclusie', 'Advies']
    }
  ],
  criteria: [
    {
      id: 'logodiagnostiek',
      title: 'Diagnostiek logopedie',
      domain: 'Toepassing',
      tags: ['tests', 'scores', 'spraak', 'taal', 'valkuilen'],
      snap: 'Je beschrijft welk logopedisch onderzoek is gedaan, wat de scores betekenen en welke spraak-taalprofielen daaruit volgen.',
      memory: ['onderzoeken en scores noemen', 'ruwe score niet verwarren met interpretatie', 'begrip, productie, auditief en spraak apart wegen', 'valkuilen per doelgroep benoemen', 'aanvullend onderzoek onderbouwen'],
      checks: ['onderzoek', 'score', 'interpretatie', 'spraak', 'taal', 'valkuil', 'aanvullend', 'onderbouwing'],
      model: 'Logopedisch zie ik een combinatie van zwakke verstaanbaarheid en kwetsbare taalontwikkeling. Ik noem per domein welk onderzoek is gedaan, interpreteer de score voorzichtig en koppel dit aan observaties. Daarna benoem ik welke testinformatie ontbreekt en waarom aanvullend onderzoek nodig is.'
    },
    {
      id: 'mdo',
      title: 'Diagnostiek multidisciplinair',
      domain: 'Klinisch redeneren',
      tags: ['psychologie', 'school', 'ouders', 'gehoor', 'ontbreekt'],
      snap: 'Je gebruikt gegevens van school, ouders, psychologie, audiologie en medische informatie om je logopedische conclusie sterker of voorzichtiger te maken.',
      memory: ['andere disciplines interpreteren', 'ontbrekende gegevens expliciet maken', 'gerichte MDO-vragen formuleren', 'gehoor en cognitie meewegen', 'schoolcontext verbinden aan participatie'],
      checks: ['psycholoog', 'school', 'ouders', 'gehoor', 'audiologisch', 'ontbreekt', 'vraag', 'waarom'],
      model: 'In het MDO wil ik de logopedische gegevens verbinden met schoolfunctioneren, ouderervaring, gehoor en cognitief niveau. Ik benoem welke informatie ontbreekt, stel een gerichte vraag per discipline en leg uit hoe het antwoord mijn diagnose of advies kan veranderen.'
    },
    {
      id: 'diagnose',
      title: 'Diagnose en conclusie',
      domain: 'Vaktaal',
      tags: ['diagnose', 'differentiaal', 'TOS', 'VOD', 'fonologisch'],
      snap: 'Een diagnose is geen labelplakkerij: je onderbouwt welke verklaring het best past en welke alternatieven je hebt uitgesloten of nog moet onderzoeken.',
      memory: ['diagnose onderbouwen met casusgegevens', 'differentiaaldiagnostiek noemen', 'normale ontwikkeling koppelen aan afwijkend beeld', 'logopedische conclusie formuleren', 'schoolkeuze beargumenteren'],
      checks: ['diagnose', 'onderbouw', 'differentiaal', 'normale ontwikkeling', 'afwijkend', 'conclusie', 'schoolkeuze'],
      model: 'Mijn voorlopige logopedische conclusie is dat het profiel past bij een hardnekkige spraak-taalontwikkelingsproblematiek. Ik onderbouw dit met leeftijd, testgegevens, observaties en dagelijks functioneren. Ik benoem differentiaaldiagnoses en maak duidelijk welke gegevens nog nodig zijn voor zekerheid.'
    },
    {
      id: 'icf',
      title: 'ICF-model',
      domain: 'Structuur',
      tags: ['functie', 'activiteit', 'participatie', 'omgeving', 'persoonlijk'],
      snap: 'ICF dwingt je om van stoornis naar functioneren te redeneren: wat is er in functies, wat merkt het kind in activiteiten, en waar raakt dit participatie?',
      memory: ['functies en anatomie scheiden van activiteiten', 'participatie concreet maken', 'externe factoren benoemen', 'persoonlijke factoren voorzichtig formuleren', 'ICF gebruiken als brug naar advies'],
      checks: ['functie', 'activiteit', 'participatie', 'omgeving', 'persoonlijk', 'factor', 'advies', 'brug'],
      model: 'In ICF-termen beschrijf ik functies zoals fonologie, taalbegrip of mondmotoriek. Daarna vertaal ik dat naar activiteiten zoals verstaanbaar vertellen of instructies volgen, en naar participatie zoals meedoen in de klas. Omgevingsfactoren bepalen vervolgens welk advies haalbaar is.'
    },
    {
      id: 'advies',
      title: 'Advies en interventie',
      domain: 'Toetswaardig formuleren',
      tags: ['advies', 'doelen', 'school', 'ouders', 'interventie'],
      snap: 'Een sterk advies volgt logisch uit je diagnose: wat moet er gebeuren, door wie, in welke context en waarom juist dit?',
      memory: ['advies koppelen aan diagnose', 'schoolkeuze argumenteren', 'ouder- en leerkrachtadvies geven', 'doelen concreet formuleren', 'samenwerking benoemen'],
      checks: ['advies', 'diagnose', 'school', 'ouders', 'leerkracht', 'doel', 'interventie', 'argument'],
      model: 'Mijn advies volgt uit de combinatie van stoornis, activiteit en participatie. Ik adviseer gerichte logopedische behandeling, afstemming met school en ouders, en een schoolsetting die past bij de ondersteuningsbehoefte. Ik onderbouw dit met de casusgegevens.'
    }
  ],
  cases: [
    {
      id: 'wietze',
      title: 'Wietze, 7;0 jaar',
      setting: 'vertraagde spraak-taalontwikkeling met cognitieve beperking',
      source: 'Casus Wietze',
      facts: [
        ['Kern', 'Slechte verstaanbaarheid, zwakke zinsbouw/morfologie en kleine woordenschat.'],
        ['Spraak', 'Wisselende substituties en omissies, clusterreductie, devoicing en kenmerken passend bij VOD.'],
        ['Taal', 'Korte zinnen met visuele steun lukken beter; één zinsstructuur tegelijk oefenen.'],
        ['MDO', 'Kan de lessen moeilijk volgen en trekt zich terug; TIQ rond 62.']
      ],
      risks: ['VOD verwarren met puur fonologisch probleem', 'cognitieve beperking onvoldoende meewegen', 'logopedisch plan niet koppelen aan handelingsplan'],
      focus: ['VOD versus fonologisch', 'ICF: verstaanbaarheid -> klasparticipatie', 'afstemming jaarhandelingsplan en logopedisch werkplan']
    },
    {
      id: 'aaron',
      title: 'Aaron, 5;09 jaar',
      setting: 'ASS-kenmerken door microdeletie, zwakke verstaanbaarheid',
      source: 'Casus Aaron',
      facts: [
        ['Kern', 'Vrolijk kind dat wil vertellen, maar vaak moeilijk verstaanbaar is.'],
        ['Spraak', 'Devoicing, finale clusterreductie en klinkerverkleuring zijn nog aanwezig.'],
        ['Taal', 'Zwak fonologisch bewustzijn, woordvindproblemen en verhalen vertellen lukt vooral met visuele steun.'],
        ['MDO', 'Heeft voorspelbaarheid, vaste strategieën en picto-ondersteuning nodig; TIQ rond 85.']
      ],
      risks: ['alleen mondmotorisch verklaren', 'fonologisch bewustzijn vergeten', 'ASS-structuurbehoefte los zien van communicatie'],
      focus: ['fonologisch bewustzijn', 'verstaanbaarheid', 'visuele ondersteuning', 'schoolstrategie']
    },
    {
      id: 'erik',
      title: 'Erik, 4;1 jaar',
      setting: 'spraak-taalachterstand, gehoorproblematiek en cluster-2 vraag',
      source: 'Casus Erik',
      facts: [
        ['Kern', 'Taal kwam laat op gang; weinig vooruitgang na therapie; ouders zoeken hulp.'],
        ['Taal', 'Taalbegrip en zinsontwikkeling zwak; spontane taal rond 2;0-2;6 met telegramstijl.'],
        ['Spraak', 'Clusterreductie, syllabereductie, laterale /s/ en inconsequente substituties.'],
        ['MDO', 'SON-R rond 95, geen duidelijke sociaal-emotionele problematiek, wel geleidingsverlies rond 30 dB.']
      ],
      risks: ['gehoorverlies onderschatten', 'faalangst als onwil zien', 'scores zonder taalontwikkelingsniveau interpreteren'],
      focus: ['TOS-profiel', 'auditieve randvoorwaarden', 'cluster-2 onderbouwing', 'morfosyntaxis']
    },
    {
      id: 'isa',
      title: 'Isa, 4;3 jaar',
      setting: 'syndroom van Down, cluster 3, beginnende communicatie',
      source: 'Casus Isa',
      facts: [
        ['Kern', 'Communicatief sterk en sociaal, maar taal en verstaanbaarheid zijn zeer beperkt.'],
        ['Taal', 'Vooral 1-woordzinnen, veel gebaren, begrijpt meer dan zij kan zeggen.'],
        ['Spraak', 'Sterke vereenvoudiging met onder andere reduplicatie, h-satie, fronting, stopping en clusterreductie.'],
        ['MDO', 'Taakgerichtheid is beperkt; scores voorzichtig interpreteren; leerkrachten gebruiken nog weinig ondersteunende gebaren.']
      ],
      risks: ['testscore te hard interpreteren', 'gebaren niet als communicatie meenemen', 'verstaanbaarheid los zien van frustratie'],
      focus: ['totale communicatie', 'voorzichtige testinterpretatie', 'ondersteunde communicatie', 'cluster 3 context']
    },
    {
      id: 'tarik',
      title: 'Tarik, 8;5 jaar',
      setting: 'meertaligheid, leerachterstand en schoolkeuzevraag',
      source: 'Casus Tarik',
      facts: [
        ['Kern', 'Turks-Nederlandse leerling met kleine woordenschat, korte zinnen, matige verstaanbaarheid en leerachterstand.'],
        ['Taal', 'Scores op Nederlandse normen staan tussen haakjes en moeten voorzichtig worden geïnterpreteerd.'],
        ['Spraak', 'Problemen met onder andere /r/, /g/ en /l/; auditieve discriminatie lijkt kwetsbaar.'],
        ['MDO', 'SON-IQ rond 85 en aandacht/concentratieproblemen; vraag is regulier, SBO of cluster 2.']
      ],
      risks: ['NT2 en TOS te snel verwarren', 'thuistaalgegevens overslaan', 'Nederlandse normscore absoluut gebruiken'],
      focus: ['meertalige diagnostiek', 'schoolkeuze', 'auditieve vaardigheden', 'ouder- en schoolvragen']
    }
  ],
  questions: [
    'Geef in 60 seconden de kern van deze casus: wat is het hoofdprobleem en waarom?',
    'Welke logopedische onderzoeken zijn gedaan en wat betekenen de uitkomsten voor je conclusie?',
    'Welke valkuilen moet je bij deze doelgroep expliciet benoemen?',
    'Welke aanvullende test of observatie wil je nog doen en waarom?',
    'Welke MDO-vraag stel je aan school, ouders, psychologie of audiologie?',
    'Formuleer een logopedische conclusie in toetswaardige taal.',
    'Vul de ICF-brug: functie -> activiteit -> participatie -> omgeving.',
    'Beargumenteer schoolkeuze of ondersteuningsbehoefte.',
    'Formuleer een advies dat logisch volgt uit diagnose en ICF.'
  ]
};
