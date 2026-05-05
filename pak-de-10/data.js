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
    },
    {
      id: 'behandeling',
      title: 'Behandeling criteria 11-20',
      domain: 'ZG-coach',
      tags: ['LT-doel', 'KT-doel', 'methode', 'vorm', 'duur', 'samenwerking', 'prognose'],
      snap: 'Een 10-waardig behandelantwoord is geen methode noemen, maar klinisch regisseren: diagnose -> ICF -> LT-doel -> KT-doel -> methode -> vorm/frequentie -> samenwerking -> prognose.',
      memory: ['hoofdprobleem en behandelprioriteit bepalen', 'LT-doel op participatie formuleren', 'KT-doel SMART op functieniveau formuleren', 'methode kiezen met indicatie en contra-indicatie', 'vorm, frequentie en evaluatie noemen', 'ouders/school/MDO koppelen aan transfer', 'prognose voorzichtig en onderbouwd formuleren'],
      checks: ['behandeling', 'LT', 'KT', 'SMART', 'methode', 'therapievorm', 'frequentie', 'evaluatie', 'samenwerking', 'prognose', 'participatie'],
      model: 'Mijn behandelplan start bij de participatiebeperking en werkt terug naar haalbare functiedoelen. Ik formuleer een LT-doel op meedoen, een SMART KT-doel op spraak of taal, kies een methode die past bij het probleemmechanisme, benoem vorm/frequentie/evaluatie en borg transfer via ouders, school en MDO. De prognose is concreet, voorzichtig en gekoppeld aan leerbaarheid.'
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
    'Formuleer een advies dat logisch volgt uit diagnose en ICF.',
    'Verdedig behandeling: LT-doel, KT-doel, methode, vorm, duur, samenwerking en prognose.'
  ],
  treatmentMachine: {
    routes: [
      {
        id: 'fonologie',
        title: 'Fonologische stoornis',
        problem: 'Het kind heeft een klanksysteemprobleem: klankcontrasten zijn onvoldoende georganiseerd.',
        lt: 'Het kind is in klas- en thuissituaties beter verstaanbaar en neemt actiever deel aan gesprek en spel.',
        kt: 'Het kind onderscheidt en produceert het gekozen contrast in 80-90% van gestructureerde woord- of zinscontexten.',
        method: 'Minimale paren, Metaphon of Hodson & Paden bij meerdere processen.',
        why: 'Kies contrastief of cyclisch werken omdat het probleem in het fonologische systeem zit, niet alleen in losse klankmotoriek.',
        form: 'Direct individueel, gecombineerd met ouder- en leerkrachtinstructie.',
        duration: 'Wekelijks of intensiever bij ernstige onverstaanbaarheid; evaluatie na 8-12 sessies.',
        prognosis: 'Gunstig bij goede auditieve verwerking, stimulabiliteit en consequente oefening.'
      },
      {
        id: 'vod',
        title: 'Verbale ontwikkelingsdyspraxie',
        problem: 'Het kind heeft moeite met planning en programmering van spraakbewegingen; fouten zijn vaak wisselend en zoekend.',
        lt: 'Het kind produceert verstaanbare woorden en korte uitingen in dagelijkse situaties.',
        kt: 'Het kind programmeert gekozen klank- of syllabesequenties accuraat met multisensorische cues.',
        method: 'Motorisch-planningsgerichte aanpak met veel herhaling, ritme, visuele en tactiel-kinesthetische cueing.',
        why: 'VOD vraagt om herhaald inslijpen van motorische sequenties, niet om alleen klankcontrastbewustzijn.',
        form: 'Individueel en intensief, met kort dagelijks thuisprogramma.',
        duration: 'Langduriger traject; hogere frequentie en regelmatige evaluatie op generalisatie.',
        prognosis: 'Voorzichtig: vooruitgang is mogelijk, maar automatisatie kost veel tijd.'
      },
      {
        id: 'morfosyntax',
        title: 'Taalproductie / morfosyntaxis',
        problem: 'Het kind gebruikt korte of grammaticaal zwakke zinnen, laat functiewoorden weg of past vervoegingen onvoldoende toe.',
        lt: 'Het kind formuleert begrijpelijke, grammaticaal rijkere uitingen in spel, klas en gesprek.',
        kt: 'Het kind produceert de gekozen zinsstructuur in 8 van de 10 uitingen binnen gestructureerde interactie.',
        method: 'Modeling, recasting, expansie en scaffolding binnen de zone van naaste ontwikkeling.',
        why: 'Het kind oefent net boven het huidige taalniveau met steun die je geleidelijk afbouwt.',
        form: 'Directe therapie plus ouder- en leerkrachtcoaching in natuurlijke routines.',
        duration: 'Evaluatie na 8-12 weken op spontane taal en klascontext.',
        prognosis: 'Afhankelijk van ernst, leerbaarheid, cognitie en taalaanbod.'
      },
      {
        id: 'semantiek',
        title: 'Woordenschat / semantiek',
        problem: 'Het kind heeft een kleine actieve of passieve woordenschat en slaat woorden onvoldoende rijk op.',
        lt: 'Het kind gebruikt relevante school- en thuistaalwoorden functioneel in uitleg, spel en gesprek.',
        kt: 'Het kind leert en gebruikt wekelijks een beperkte set themawoorden met vorm, betekenis, categorie en context.',
        method: 'Semantische netwerken, herhaald aanbod, expliciete woordleerstrategie en functionele toepassing.',
        why: 'Losse woordherhaling is te zwak; vorm, betekenis en gebruik moeten gekoppeld worden.',
        form: 'Directe instructie met klassikale en thuissituatie-transfer.',
        duration: 'Cyclisch per thema; evaluatie op begrip, actieve productie en generalisatie.',
        prognosis: 'Gunstiger bij veel kwalitatieve input; voorzichtiger bij brede TOS of beperkte leerbaarheid.'
      },
      {
        id: 'pragmatiek',
        title: 'Pragmatiek / narratief',
        problem: 'Het kind heeft moeite met beurtwisseling, perspectief nemen, gesprekssamenhang of verhaalstructuur.',
        lt: 'Het kind neemt begrijpelijk en passend deel aan gesprekken en spel met leeftijdsgenoten.',
        kt: 'Het kind gebruikt in een gestructureerde taak begin-midden-einde, beurtgedrag of contextinformatie volgens het gekozen doel.',
        method: 'Narratieve interventie, scripts, visuele ondersteuning, rollenspel en naturalistische pragmatiektherapie.',
        why: 'Het probleem wordt zichtbaar in communicatie met anderen; daarom moet therapie functioneel en contextgericht zijn.',
        form: 'Individueel starten, daarna groep of klassituatie voor generalisatie.',
        duration: 'Evaluatie na 8-10 weken op gesprek, spel of verhaal in natuurlijke context.',
        prognosis: 'Afhankelijk van sociaal-cognitieve ontwikkeling, voorspelbaarheid en omgevingssteun.'
      },
      {
        id: 'meertalig',
        title: 'Meertaligheid / NT2 / TOS',
        problem: 'Er is uitval in het Nederlands en mogelijk ook in de thuistaal; differentiaaldiagnose is cruciaal.',
        lt: 'Het kind communiceert functioneler in relevante talen en contexten en kan beter onderwijs volgen.',
        kt: 'Het kind breidt gekozen taalstructuren of woordenschat uit met ondersteuning in Nederlands en waar mogelijk thuistaal.',
        method: 'Taalgerichte interventie met thuistaalbetrokkenheid, visuele steun en schoolgerichte strategieen.',
        why: 'Lage Nederlandse scores alleen bewijzen geen TOS; uitval in beide talen en leerbaarheid sturen je keuze.',
        form: 'Direct en indirect, met ouders/tolk en school.',
        duration: 'Evaluatie op groei en leerbaarheid, niet alleen op eentalige normscore.',
        prognosis: 'Positiever bij rijk taalaanbod en groei; voorzichtiger bij uitval in beide talen.'
      },
      {
        id: 'cluster3',
        title: 'Syndroom / verstandelijke beperking / ASS',
        problem: 'Communicatieontwikkeling is verweven met cognitie, prikkelverwerking, gedrag en onderwijscontext.',
        lt: 'Het kind communiceert functioneler in dagelijkse routines en participeert beter thuis en op school.',
        kt: 'Het kind gebruikt gekozen woorden, gebaren, pictogrammen of zinsvormen in een afgebakende routine.',
        method: 'Totale communicatie, ondersteunde communicatie, Hanen-principes, routines en sterke visuele ondersteuning.',
        why: 'Spreken is niet de enige route naar participatie; communicatie moet haalbaar zijn binnen het ontwikkelingsniveau.',
        form: 'Indirect en contextgericht, naast korte directe sessies waar belastbaarheid dat toelaat.',
        duration: 'Kleine stappen, korte cycli, evaluatie op functionele communicatie.',
        prognosis: 'Voorzichtig maar betekenisvol: winst zit in functionaliteit, zelfstandigheid en minder frustratie.'
      }
    ],
    skillCoach: {
      workflow: [
        ['Stap 1: probleemmechanisme', 'Schrijf niet meteen een doel. Bepaal eerst: is het probleem fonologisch, fonetisch, spraakmotorisch, taalstructureel, semantisch, pragmatisch of contextueel? Noteer het bewijs uit de casus.'],
        ['Stap 2: ICF-brug', 'Vertaal functiestoornis naar activiteit en participatie. Vraag: wat lukt het kind daardoor thuis, in de klas of in contact met anderen niet goed?'],
        ['Stap 3: LT-doel', 'Formuleer eerst participatie: wie doet wat, in welke dagelijkse context, met welke steun, binnen welke termijn?'],
        ['Stap 4: KT-doel', 'Maak daarna een klein meetbaar bouwblok: gedrag + materiaal/context + criterium + cue-niveau + termijn.'],
        ['Stap 5: methodebewijs', 'Kies de methode pas nadat je hebt bewezen dat het mechanisme erbij past. Noem ook waarom een andere methode minder logisch is.'],
        ['Stap 6: transferplan', 'Bepaal wie buiten de therapiekamer moet meedoen: ouders, leerkracht, IB, audiologie, fysio/ergo of psycholoog. Maak hun taak concreet.'],
        ['Stap 7: evaluatie en prognose', 'Leg vast wanneer je meet, wat je meet op functieniveau en participatieniveau, en wat de prognose gunstig of voorzichtig maakt.']
      ],
      lookup: [
        ['Handboek TOS', 'Zoek op: TOS kenmerken, interventie, ouderbegeleiding, leerkrachtbegeleiding, morfosyntaxis, woordenschat, pragmatiek, generalisatie, prognose. Noteer per onderwerp de beste pagina.'],
        ['ICF-handreiking', 'Zoek op: functies, activiteiten, participatie, externe factoren, persoonlijke factoren. Gebruik dit om LT-doelen niet te stoornisgericht te maken.'],
        ['Casusdocument', 'Zoek bewijs: leeftijd, hulpvraag, testscore, observatie, dagelijks functioneren, schoolcontext, ouders, ontbrekende gegevens. Zonder casusbewijs geen ZG.'],
        ['Beoordelingsformulier', 'Zoek criteria 11 t/m 20. Vertaal elk criterium naar een checklistvraag: heb ik doel, methode, vorm, duur, samenwerking en prognose verdedigd?'],
        ['Schlichting/diagnostiekinfo', 'Alleen gebruiken voor wat het testresultaat betekent. Behandeling volgt daarna uit interpretatie, ICF en hulpvraag.']
      ],
      goalTemplate: [
        'ICF-niveau: functie / activiteit / participatie',
        'Gedrag: wat doet het kind observeerbaar?',
        'Context: therapie, thuis, klas, kring, spel, gesprek',
        'Norm: percentage, aantal keren of mate van hulp',
        'Steun: zonder cue, met visuele cue, met model, met ouder/leerkracht',
        'Termijn: binnen hoeveel weken of maanden',
        'Waarom: welke participatiebeperking wordt kleiner?'
      ],
      methodQuestions: [
        'Past de methode bij het probleemmechanisme of alleen bij het symptoom?',
        'Welke casusgegevens bewijzen dat deze methode nodig is?',
        'Welke cognitieve, motorische of sociaal-emotionele factor maakt aanpassing nodig?',
        'Hoe bouw je hulp af zodat het kind zelfstandiger wordt?',
        'Waar vindt generalisatie plaats en wie bewaakt dat?'
      ]
    },
    sourceIndex: {
      sources: [
        ['Ontwikkelingspsychologie deel 2: De baby', 'Handboek', 'Fysieke, motorische, cognitieve groei; hersenplasticiteit en informatieverwerking.', 'Diagnostiek en behandelverantwoording', 'H5 fysieke groei, H6 cognitie/informatieverwerking'],
        ['Ontwikkelingspsychologie deel 3: Peuter/kleuter', 'Handboek', 'Taalontwikkeling, TOS, Piaget, Vygotsky, ZPD, scaffolding en omgeving.', 'Diagnostiek en behandeling', 'H9 taal, 9.2.4 TOS, onderwijs/opvang, modeling'],
        ['Mondmotoriek & OMFT', 'Samenvatting', 'Anatomie, articulatie, occlusie en afwijkende mondgewoonten.', 'Alleen gebruiken als casusgegevens dit ondersteunen', 'Open beet, afwijkende gewoonten, myofunctionele voorwaarden'],
        ['ICF-handreiking', 'Model/handreiking', 'Functies, activiteiten, participatie, externe en persoonlijke factoren.', 'Doelen, advies, samenwerking en prognose', 'Gebruik als brug van stoornis naar functioneren']
      ],
      themes: [
        ['TOS', 'taalontwikkelingsstoornis', 'Neurocognitieve stoornis waarbij taalverwerking minder goed verloopt.', 'D/B', 'Differentieren tussen TOS, taalachterstand en SES-effect.', 'D3 p. 292'],
        ['Scaffolding', 'steunsteiger', 'Tijdelijke ondersteuning bij een taak net boven het eigen niveau.', 'B', 'Onderbouwen hoe je hulp doseert en afbouwt.', 'D3 p. 286'],
        ['ZPD', 'zone van naaste ontwikkeling', 'Niveau waarop een kind met hulp een taak kan volbrengen.', 'B', 'Instapniveau en moeilijkheidsgraad van doelen bepalen.', 'D3 p. 285'],
        ['Morfosyntaxis', 'grammatica, syntaxis', 'Regels voor woordvormen, woordcombinaties en zinsbouw.', 'D/B', 'Grammaticale fouten analyseren en zinsdoelen formuleren.', 'D3 p. 288-289'],
        ['Pragmatiek', 'sociaal taalgebruik', 'Taal gebruiken in interactie en sociale context.', 'D/B', 'Communicatieve redzaamheid en participatie beoordelen.', 'D3 p. 290'],
        ['Informatieverwerking', 'coderen, opslaan, ophalen', 'Hoe informatie wordt verwerkt, opgeslagen en teruggehaald.', 'D/B', 'Trage reacties, instructieproblemen en belasting verklaren.', 'D2 p. 187, D3 p. 281'],
        ['Fast mapping', 'snelle woord-betekenis koppeling', 'Nieuwe woorden snel aan betekenis koppelen.', 'D/B', 'Woordenschatverwerving en woordenschatinterventie onderbouwen.', 'D3 p. 288'],
        ['Centratie', 'Piaget', 'Focussen op een aspect tegelijk.', 'D/B', 'Complexe instructies vereenvoudigen en visueel maken.', 'D3 p. 276'],
        ['Modeling', 'sociaal leren, voorbeeldtaal', 'Correct taalmodel aanbieden zonder expliciete correctie.', 'B', 'Indirecte stimulatie en frustratiearme behandeling verdedigen.', 'D3 p. 325'],
        ['Geleide participatie', 'guided participation', 'Leren door deelname met steun van een competenter persoon.', 'B', 'Ouders en leerkracht als behandelpartners onderbouwen.', 'D3 p. 284']
      ],
      oralLinks: [
        ['Ik pas scaffolding toe binnen de ZPD.', 'Vygotsky/ZPD/scaffolding', 'D3 p. 285-286', 'Door steun af te stemmen op wat het kind met hulp kan, verlaag ik cognitieve belasting en bouw ik autonomie stapsgewijs op.'],
        ['De taalproblemen wijzen op TOS.', 'Neurocognitieve taalverwerking', 'D3 p. 292', 'Hardnekkige morfosyntactische en semantische problemen ondanks aanbod vragen om specifieke logopedische interventie.'],
        ['Ik ben voorzichtig bij meertaligheid.', 'SES, taalaanbod, blootstelling', 'D3 p. 290-291', 'Een lage Nederlandse score kan door blootstelling komen; ik weeg thuistaal, leerbaarheid en context voordat ik TOS concludeer.'],
        ['Ik betrek ouders en leerkracht.', 'Geleide participatie en modeling', 'D3 p. 284, 325', 'Generalisatie ontstaat niet alleen in de behandelkamer; de omgeving moet dezelfde steun en taalmodellen bieden.'],
        ['Ik formuleer LT-doelen op participatie.', 'ICF', 'ICF-handreiking', 'Het einddoel is niet een losse klank of zinsvorm, maar beter functioneren thuis, op school en in interactie.'],
        ['Ik hak instructies op en visualiseer.', 'Informatieverwerking', 'D2 p. 187', 'Bij beperkte codering of opslag maak ik input kleiner en zichtbaarder zodat het kind de taak kan verwerken.'],
        ['Ik gebruik modeling in plaats van directe correctie.', 'Modeling/sociaal leren', 'D3 p. 325', 'Zo krijgt het kind correcte taalvormen aangeboden zonder faaldruk, waardoor oefenen functioneler en veiliger wordt.'],
        ['Ik noem OMFT alleen als het past bij de casus.', 'Mondmotoriek/occlusie', 'OMFT summary', 'Afwijkende mondgewoonten kunnen articulatievoorwaarden beinvloeden, maar mogen niet zonder casusbewijs als verklaring worden gepresenteerd.']
      ],
      wietze: [
        ['Beperkte informatieverwerking', 'coderen, opslaan, ophalen', 'D2 p. 187', 'Instructies opknippen, visualiseren en herhalen.', 'Wietze heeft minder auditieve belasting nodig zodat de boodschap beter verwerkt wordt.'],
        ['Zwakke zinsbouw', 'morfosyntaxis', 'D3 p. 288-289', 'Een zinsstructuur per keer met modeling en visuele steun.', 'Ik train niet vaag taal, maar een observeerbare zinsstructuur binnen zijn ZPD.'],
        ['Terugtrekken in de klas', 'pragmatiek/participatie', 'D3 p. 290 + ICF', 'Doelen koppelen aan hulpvragen, kringmomenten en succeservaringen.', 'De behandeling is pas zinvol als Wietze beter kan meedoen in de klas.'],
        ['Vermoeden TOS-profiel', 'neurocognitieve taalverwerking', 'D3 p. 292', 'Langdurige, specifieke ondersteuning en voorzichtig positieve prognose.', 'Ik verwacht functionele groei, geen snelle normalisatie.'],
        ['School en ouders nodig', 'geleide participatie/modeling', 'D3 p. 284, 325', 'Leerkracht en ouders gebruiken dezelfde cues en voorbeeldzinnen.', 'Transfer is een behandelvoorwaarde, niet een extraatje.'],
        ['Mondmotoriek/OMFT-vraag', 'anatomie en mondgewoonten', 'OMFT summary', 'Alleen navragen of observeren als casus daar aanleiding toe geeft.', 'Ik presenteer open beet of duimzuigen niet als feit zonder casusbewijs.']
      ],
      toplists: [
        ['Diagnostiek', 'D2 p. 158', 'Normen en gemiddelden', 'Gebruik scores nooit blind; koppel normscore aan observatie en context.'],
        ['Diagnostiek', 'D2 p. 187', 'Informatieverwerking', 'Verklaar instructieproblemen via codering, opslag en ophalen.'],
        ['Diagnostiek', 'D3 p. 288-289', 'Morfosyntaxis en Wugs', 'Onderbouw grammaticale analyse en regeltoepassing.'],
        ['Diagnostiek', 'D3 p. 290-292', 'Pragmatiek, SES, TOS', 'Differentieer sociale communicatie, blootstelling en neurocognitieve TOS.'],
        ['Behandeling', 'D2 p. 148/173', 'Plasticiteit', 'Verdedig vroege en intensieve stimulatie in gevoelige perioden.'],
        ['Behandeling', 'D3 p. 284-286', 'Geleide participatie, ZPD, scaffolding', 'Verdedig hulp doseren en afbouwen.'],
        ['Behandeling', 'D3 p. 293-295', 'VVE, opvang, voorlezen', 'Onderbouw school- en ouderadvies.'],
        ['Behandeling', 'D3 p. 325', 'Modeling', 'Verdedig indirecte taalstimulering boven directe correctie.'],
        ['Wietze', 'D2 p. 187 + D3 p. 288-292', 'Informatieverwerking, morfosyntaxis, TOS', 'Gebruik deze pagina’s voor de kern van Wietze’s behandelredenering.'],
        ['Mondeling', 'ICF-handreiking', 'Participatie', 'Breng ieder antwoord terug naar functioneren en omgeving.']
      ]
    },
    goals: [
      ['Verstaanbaarheid', 'Zwak: het kind is beter verstaanbaar.', 'ZG: het kind is aan het einde van de behandelperiode in 80-85% van bekende klassituaties verstaanbaar voor vertrouwde gesprekspartners.'],
      ['Fonologisch contrast', 'Zwak: het kind kan /s/ en /t/.', 'ZG: het kind onderscheidt en produceert het contrast /s/-/t/ in 8 van de 10 minimale paren op woordniveau.'],
      ['Morfosyntaxis', 'Zwak: het kind maakt langere zinnen.', 'ZG: het kind produceert in 8 van de 10 uitingen een vierwoordzin met correcte woordvolgorde binnen gestructureerd spel.'],
      ['Taalbegrip', 'Zwak: het kind begrijpt instructies.', 'ZG: het kind voert tweestapsinstructies in de klas in 4 van de 5 situaties uit met visuele steun.'],
      ['Woordenschat', 'Zwak: het kind leert nieuwe woorden.', 'ZG: het kind gebruikt vijf themawoorden actief in spel en kringactiviteit binnen twee weken.'],
      ['Ondersteunde communicatie', 'Zwak: het kind gebruikt gebaren.', 'ZG: het kind gebruikt in drie dagelijkse routines een gebaar of pictogram om een behoefte of keuze duidelijk te maken.']
    ],
    methods: [
      ['Minimale paren', 'Indicatie: fonologisch contrastprobleem.', 'Niet kiezen bij puur motorisch onvermogen.', 'Script: ik kies minimale paren omdat betekenisverschil laat ervaren dat klankcontrast functioneel is.'],
      ['Hodson & Paden', 'Indicatie: ernstige onverstaanbaarheid met meerdere processen.', 'Minder passend bij een enkel fonetisch probleem.', 'Script: ik kies cyclisch werken omdat meerdere processen tegelijk de verstaanbaarheid beperken.'],
      ['Motorische articulatie', 'Indicatie: fonetische klankvorming.', 'Niet als hoofdroute bij systeemfout.', 'Script: ik kies motorisch werken omdat de productiebeweging zelf onvoldoende lukt.'],
      ['PROMPT/DTTC-principes', 'Indicatie: VOD of motorische planning.', 'Niet inzetten als het probleem uitsluitend fonologisch is.', 'Script: ik kies multisensorische cueing omdat planning en sequenties centraal staan.'],
      ['Scaffolding/recasting', 'Indicatie: morfosyntaxis of TOS.', 'Te vaag zonder concrete doelstructuur.', 'Script: ik kies recasting en scaffolding om doelstructuren net boven huidig niveau uit te lokken.'],
      ['Ondersteunde communicatie/NmG', 'Indicatie: beperkte spraak of verstandelijke beperking.', 'Niet stoppen zodra eerste woorden komen.', 'Script: ik kies multimodaal omdat functionele communicatie belangrijker is dan alleen spreken.']
    ],
    scripts: [
      ['Fonologische route', 'Ik kies een spelenderwijze contrastieve aanpak omdat de verstaanbaarheid wordt beperkt door een fonologisch systeemprobleem. Door minimale paren, Metaphon of Hodson & Paden te koppelen aan klaswoorden verbind ik functieniveau aan participatie.'],
      ['VOD-route', 'Ik kies een motorisch-planningsgerichte aanpak met veel herhaling en multisensorische cues. Bij VOD is niet alleen het contrast kwetsbaar, maar vooral de planning van klanksequenties.'],
      ['TOS/morfosyntaxis', 'Ik kies scaffolding en recasting binnen de zone van naaste ontwikkeling. Het KT-doel richt zich op een concrete zinsstructuur en het LT-doel op begrijpelijker communiceren in de klas.'],
      ['Meertalige route', 'Ik behandel voorzichtig en verzamel informatie over beide talen. Als de uitval in beide talen zichtbaar is, past dat meer bij TOS dan bij alleen blootstellingsachterstand.'],
      ['Cluster 3 / ondersteunde communicatie', 'Ik kies ondersteunde communicatie en korte functionele routines. De behandeling moet aansluiten bij belastbaarheid en ontwikkelingsniveau, met ouders en school als vaste partners.']
    ],
    collaboration: [
      ['Ouders', 'Draagkracht, hulpvraag en oefenkansen; dagelijkse korte routines voor generalisatie.'],
      ['Leerkracht/IB', 'Functioneren in de groep; visuele steun, recasting en doelwoorden in de klas.'],
      ['Psycholoog/orthopedagoog', 'Cognitie, ASS, aandacht en sociaal-emotionele factoren; voorkom overvraging.'],
      ['Audioloog/KNO', 'Gehoorstatus en middenoorproblematiek; auditieve toegang is randvoorwaarde.'],
      ['Fysio/ergo', 'Motoriek, prikkelverwerking en planning; relevant bij VOD of bredere motorische problemen.'],
      ['Ambulant begeleider', 'Onderwijsbehoefte en clusterondersteuning; doelen opnemen in handelingsplan.']
    ],
    prognosis: [
      ['Fonologie', 'Gunstig bij goede auditieve verwerking, stimulabiliteit en consequente generalisatie.'],
      ['VOD', 'Voorzichtig; motorisch leren vraagt hoge intensiteit, veel herhaling en langdurige monitoring.'],
      ['TOS', 'Langdurige ondersteuning is waarschijnlijk; doelen richten op functioneren en compensatie naast groei.'],
      ['Meertaligheid', 'Positief als er leerbaarheid en rijk taalaanbod is; voorzichtig bij uitval in beide talen.'],
      ['Syndroom/verstandelijke beperking', 'Voorzichtig maar betekenisvol: winst zit in communicatie, participatie en minder frustratie.']
    ],
    redFlags: [
      'Een methode noemen zonder diagnosekoppeling.',
      'LT-doel en KT-doel als los zand formuleren.',
      'Een doel niet meetbaar of niet observeerbaar maken.',
      'Alleen kindgerichte therapie noemen terwijl generalisatie via ouders of school nodig is.',
      'Geen duur, frequentie of evaluatiemoment noemen.',
      'Samenwerking of prognose vergeten.',
      'Fonologisch, fonetisch en VOD door elkaar halen.',
      'Zeggen "taal stimuleren" zonder concreet behandelmechanisme.'
    ],
    drills: [
      ['Waarom kies je 2x per week?', 'Bij ernstige of hardnekkige problemen is intensiteit nodig voor inslijpen, herhaling en generalisatie.', 'Criterium 18'],
      ['Wat is het verschil tussen fonetisch en fonologisch werken?', 'Fonetisch is motorische uitvoering; fonologisch is organisatie van betekenisvolle klankcontrasten.', 'Criterium 14/15'],
      ['Wanneer kies je oudercoaching?', 'Als dagelijkse interactie en generalisatie de grootste hefboom zijn, vooral bij jonge kinderen.', 'Criterium 16/17/19'],
      ['Hoe formuleer je prognose bij VOD?', 'Voorzichtig: vooruitgang kan, maar automatisatie vraagt intensiteit en tijd.', 'Criterium 20'],
      ['Hoe behandel je meertalige uitval?', 'Ik weeg beide talen en leerbaarheid; lage Nederlandse scores alleen zijn onvoldoende bewijs voor TOS.', 'Criterium 11/19'],
      ['Wanneer zet je ondersteunde communicatie in?', 'Als spreken nog onvoldoende functioneel is en het kind toch communicatief moet kunnen participeren.', 'Criterium 11/16']
    ]
  },
  caseTraining: {
    wietze: {
      title: 'Eerst Wietze snappen, dan pas scoren',
      intro: 'Deze laag trekt de les- en flitskennis door één casus heen. De volgorde is bewust: signalen herkennen, diagnostisch ordenen, ICF-brug maken en daarna pas behandelkeuzes verdedigen.',
      lenses: [
        {
          source: 'Flitscollege spraak/fonologie',
          title: 'Niet elke uitspraakfout is hetzelfde probleem',
          core: 'Bij Wietze zie je fonologische processen, maar ook wisselende fouten en zoekgedrag. Dat maakt VOD/planning belangrijk in je redenering.',
          action: 'Zeg nooit alleen “fonologisch probleem”. Benoem eerst het verschil tussen klanksysteem en spraakmotorische planning.'
        },
        {
          source: 'Lesstof Levelt',
          title: 'Lokaliseer waar het misgaat',
          core: 'Wietze kan vastlopen in formuleren van taal én in uitvoeren/programmeren van spraak. Dat betekent dat één methode niet alles oplost.',
          action: 'Gebruik Levelt als denkroute: idee/boodschap, taalvorm, klankkeuze en motorische uitvoering apart wegen.'
        },
        {
          source: 'Taalvorm / morfosyntaxis',
          title: 'Zinsbouw is behandelbaar, maar klein',
          core: 'Zijn zinnen en morfologie zijn zwak. Door TIQ 62 moet je één concrete structuur tegelijk behandelen, met visuele steun.',
          action: 'Formuleer geen vaag doel zoals “langere zinnen”, maar kies één observeerbare structuur, bijvoorbeeld SVO.'
        },
        {
          source: 'TOS / informatieverwerking',
          title: 'Beperkte verwerking bepaalt je tempo',
          core: 'Wietze heeft minder ruimte voor lange uitleg, meerdere doelen tegelijk en abstracte reflectie. Overvraging maakt therapie minder effectief.',
          action: 'Onderbouw korte instructies, veel herhaling, visuele cues en kleine stappen vanuit informatieverwerking en leerbaarheid.'
        },
        {
          source: 'ICF en participatie',
          title: 'Het eindpunt is meedoen in de klas',
          core: 'De kern is niet een losse klank netjes maken, maar verstaanbaar en veilig kunnen deelnemen aan dagelijkse klassituaties.',
          action: 'Elke diagnostische en behandelzin eindigt bij activiteit/participatie: wat kan Wietze daardoor beter doen?'
        }
      ],
      diagnostics: [
        {
          anchor: 'Stap 1 · kernprobleem',
          title: 'Maak één klinische kernzin',
          task: 'Vat Wietze samen zonder lijstjesdrang: leeftijd, cognitie, spraak, taal en participatie in één redenering.',
          line: 'Wietze is 7;0 jaar met lage cognitieve belastbaarheid, zwakke verstaanbaarheid, VOD-kenmerken en zwakke morfosyntaxis, waardoor hij in de klas communicatief vastloopt.',
          check: 'De docent wil horen dat je spraak, taal, cognitie en participatie verbindt. Alleen symptomen opsommen is te vlak.'
        },
        {
          anchor: 'Stap 2 · differentiaal',
          title: 'VOD, fonologie en taal apart wegen',
          task: 'Leg uit waarom Wietze niet puur fonologisch benaderd mag worden.',
          line: 'De fonologische processen verklaren een deel van de onverstaanbaarheid, maar wisselende fouten en zoekgedrag maken spraakmotorische planning/VOD een noodzakelijke differentiaal.',
          check: 'Noem contrast/stimulabiliteit waar passend, maar zeg ook waarom alleen minimale paren te smal kan zijn.'
        },
        {
          anchor: 'Stap 3 · testleer',
          title: 'Interpreteer scores voorzichtig',
          task: 'Gebruik scores als bewijs, maar koppel ze aan observatie en dagelijks functioneren.',
          line: 'Door zijn TIQ 62 interpreteer ik taal- en spraakscores in samenhang met belastbaarheid, observatie en schoolfunctioneren; ik trek geen conclusie uit één score alleen.',
          check: 'Dit voorkomt dat je te hard diagnosticeert of zijn leerbaarheid overschat.'
        },
        {
          anchor: 'Stap 4 · MDO',
          title: 'Vraag precies wat je nog mist',
          task: 'Bedenk welke informatie van school, ouders en andere disciplines je behandelplan verandert.',
          line: 'In het MDO wil ik weten welke klassituaties communicatief mislukken, welke visuele steun al werkt en of er bredere motorische/planningsproblemen zichtbaar zijn.',
          check: 'Een sterke MDO-vraag is niet algemeen, maar verandert je doel, methode of vorm.'
        },
        {
          anchor: 'Stap 5 · ICF',
          title: 'Maak de brug naar functioneren',
          task: 'Vertaal functiestoornissen naar activiteit en participatie.',
          line: 'Op functieniveau zie ik spraakplanning, fonologie en morfosyntaxis; op activiteitenniveau moeite met verstaanbare uitingen; op participatieniveau terugtrekken in de klas.',
          check: 'ICF is hier geen invultabel, maar de reden waarom behandeling naar schooltransfer moet.'
        }
      ],
      treatment: [
        {
          anchor: 'Stap 1 · prioriteit',
          title: 'Kies functionele communicatie als hoofddoel',
          task: 'Begin behandeling niet bij de mooiste klank, maar bij de grootste participatiewinst.',
          line: 'Mijn behandelprioriteit is functionele verstaanbaarheid en communicatieve veiligheid in de klas; spraak- en taaldoelen zijn bouwstenen daarvoor.',
          check: 'Dit voorkomt losse functietraining zonder transfer.'
        },
        {
          anchor: 'Stap 2 · LT-doel',
          title: 'Formuleer LT op participatie',
          task: 'Maak een doel dat gaat over meedoen, niet over een losse klank.',
          line: 'Binnen 6 maanden neemt Wietze met visuele steun actief deel aan dagelijkse klassituaties en gebruikt hij een herstelstrategie wanneer hij niet begrepen wordt.',
          check: 'Goed LT-doel: wie, gedrag, context, steun, termijn en participatiewinst.'
        },
        {
          anchor: 'Stap 3 · KT-doelen',
          title: 'Maak kleine bouwstenen',
          task: 'Koppel spraakmotoriek, fonologie en morfosyntaxis aan haalbare microdoelen.',
          line: 'KT spraak: functionele CVC-woorden met cueing; KT taal: één SVO-structuur met visuele zinssteun; KT participatie: hulp vragen met pictogram of vaste zin.',
          check: 'Door zijn beperkte verwerking kies je één focus per oefening en bouw je cues pas af bij succes.'
        },
        {
          anchor: 'Stap 4 · methode',
          title: 'Combineer methode, maar doseer scherp',
          task: 'Verdedig waarom motorisch-planningsgericht werken de basis is en taalsteun parallel nodig blijft.',
          line: 'Ik kies motorisch-planningsgericht oefenen met veel herhaling en multisensorische cues, aangevuld met concrete fonologische contrasten en scaffolding voor één zinsstructuur.',
          check: 'Zeg ook wat je níet doet: geen abstracte Metaphon-uitleg zonder aanpassing, geen alle-klanken-tegelijk aanpak.'
        },
        {
          anchor: 'Stap 5 · vorm en transfer',
          title: 'Maak school onderdeel van therapie',
          task: 'Leg vast wie buiten de logopediekamer hetzelfde doel ondersteunt.',
          line: 'Ik combineer individuele korte sessies met leerkracht- en oudercoaching, zodat dezelfde woorden, zinssteun en herstelstrategie terugkomen in klas en thuis.',
          check: 'Transfer is bij Wietze geen bonus maar behandelvoorwaarde.'
        },
        {
          anchor: 'Stap 6 · prognose',
          title: 'Wees hoopvol én eerlijk',
          task: 'Formuleer geen wonderprognose; koppel verwachting aan leerbaarheid, TIQ en intensiteit.',
          line: 'De prognose is voorzichtig maar functioneel positief: ik verwacht geen snelle normalisatie, wel groei in verstaanbaarheid, korte uitingen en klasparticipatie bij intensieve, visueel ondersteunde behandeling.',
          check: 'Een ZG-prognose noemt gunstige en belemmerende factoren.'
        }
      ],
      drills: [
        {
          mode: 'Mondeling 30 sec',
          question: 'Waarom is Wietze geen puur fonologisch behandelkind?',
          assignment: 'Zeg eerst je eigen antwoord. Gebruik verplicht: wisselende fouten, zoekgedrag, planning, contrast.',
          answer: 'Omdat de fonologische processen maar een deel verklaren. Wisselende substituties en zoekgedrag wijzen op spraakmotorische planning/VOD, waardoor alleen contrasttherapie zoals minimale paren te smal is.'
        },
        {
          mode: 'Diagnostiek',
          question: 'Welke MDO-vraag stel je als eerste?',
          assignment: 'Maak één vraag aan school of ouders die je behandelplan concreet verandert.',
          answer: 'Ik vraag school in welke klassituaties Wietze communicatief vastloopt en welke visuele steun helpt, omdat dit bepaalt welke participatiedoelen en transferafspraken nodig zijn.'
        },
        {
          mode: 'ICF',
          question: 'Maak de ICF-brug in één adem.',
          assignment: 'Zeg functie, activiteit, participatie en omgeving zonder uit te waaieren.',
          answer: 'Functie: spraakplanning, fonologie en morfosyntaxis zijn kwetsbaar. Activiteit: Wietze formuleert en spreekt moeilijk verstaanbaar. Participatie: hij trekt zich terug in de klas. Omgeving: leerkracht en ouders moeten visuele steun en herstelstrategie borgen.'
        },
        {
          mode: 'Behandeling',
          question: 'Verdedig je methodekeuze.',
          assignment: 'Noem methode, waarom passend, en waarom een andere route minder logisch is.',
          answer: 'Ik kies motorisch-planningsgericht oefenen met veel herhaling en cues, omdat VOD-kenmerken de uitvoering beperken. Alleen minimale paren is onvoldoende, omdat dat vooral het klanksysteem traint en niet de motorische sequentieplanning.'
        },
        {
          mode: 'Prognose',
          question: 'Wat is een realistische prognose?',
          assignment: 'Wees concreet: geen vage “zal verbeteren”, maar functie en participatie.',
          answer: 'Voorzichtig maar functioneel positief: door TIQ 62 en VOD verwacht ik geen snelle normalisatie, maar wel betere verstaanbaarheid, korte functionele uitingen en meer deelname in de klas als behandeling intensief en contextgeborgd is.'
        }
      ]
    }
  },
  caseTreatment: {
    wietze: {
      route: 'vod',
      title: 'Wietze: ZG-behandelverdediging',
      pitch: 'Wietze is 7;0 jaar met TIQ 62, zwakke verstaanbaarheid, VOD-kenmerken, fonologische processen en zeer zwakke morfosyntaxis. De prioriteit is functionele communicatie in de klas: spraakmotorische planning en verstaanbaarheid verbeteren, terwijl zinsbouw en woordenschat klein, visueel en contextgebonden worden aangeboden.',
      priorities: ['functionele verstaanbaarheid', 'communicatieve veiligheid', 'een zinsstructuur per keer', 'transfer naar klas en thuis', 'afstemming logopedisch werkplan en handelingsplan'],
      goals: ['LT: Wietze neemt binnen 6 maanden met visuele steun actief deel aan dagelijkse klassituaties.', 'KT spraak: gekozen functionele CVC-woorden met afbouwende visuele/tactiele cue in 80% van de pogingen.', 'KT taal: een vaste SVO-structuur bij actiekaarten met visuele zinssteun en maximaal een verbale cue.'],
      methods: ['motorisch-planningsgericht oefenen met korte herhalingen', 'cyclische/contrastieve fonologie concreet en visueel', 'scaffolding en recasting voor morfosyntaxis', 'leerkrachtcoaching voor transfer'],
      scripts: ['Ik behandel Wietze niet als een puur fonologisch kind, omdat wisselende fouten en zoekgedrag wijzen op VOD-kenmerken.', 'Ik kies korte, frequente en visueel ondersteunde oefening, omdat TIQ 62 beperkte belastbaarheid en trage automatisering betekent.', 'Ik train niet alle klanken tegelijk, maar functionele woorden uit de klas zodat spraakdoelen direct bijdragen aan participatie.'],
      warning: 'Mondgewoonten, open beet of OMFT alleen noemen als observatie of casus dit bevestigt; niet als vast Wietze-feit presenteren.',
      prognosis: 'Voorzichtig maar functioneel positief: geen snelle normalisatie, wel groei in verstaanbaarheid, korte functionele uitingen en participatie bij intensieve, klein-stappige en school/thuis-geborgde behandeling.'
    },
    aaron: {
      route: 'pragmatiek',
      title: 'Aaron: structuur, verstaanbaarheid en ASS-context',
      pitch: 'Bij Aaron combineer je verstaanbaarheid en fonologisch bewustzijn met voorspelbare communicatie en visuele steun. Zijn ASS-context betekent dat generalisatie via vaste routines en schoolstrategie essentieel is.',
      priorities: ['fonologisch bewustzijn', 'verstaanbaarheid', 'visuele ondersteuning', 'voorspelbaarheid', 'schoolstrategie'],
      goals: ['LT: Aaron vertelt begrijpelijker in bekende routines met visuele steun.', 'KT: hij gebruikt doelklanken of verhaalstappen in 8 van de 10 gestructureerde pogingen.'],
      methods: ['fonologische contrasten of cyclisch werken', 'narratieve scripts', 'visuele planning', 'leerkrachtcoaching'],
      scripts: ['Ik kies geen losse klanktraining, maar een voorspelbare aanpak waarin verstaanbaarheid, verhaalopbouw en ASS-structuur samenkomen.'],
      warning: 'Verklaar spraakproblemen niet alleen mondmotorisch; koppel altijd aan fonologie, taal en prikkelverwerking.',
      prognosis: 'Redelijk gunstig bij consequente routines, visuele steun en transfer naar school.'
    },
    erik: {
      route: 'morfosyntax',
      title: 'Erik: TOS-profiel met gehoor als randvoorwaarde',
      pitch: 'Bij Erik moet behandeling taalproductie, verstaanbaarheid en auditieve randvoorwaarden combineren. Geleidingsverlies maakt audiologische afstemming een voorwaarde voor betrouwbaar behandelen.',
      priorities: ['gehoorstatus checken', 'morfosyntaxis', 'fonologie', 'cluster-2 onderbouwing', 'faalervaring voorkomen'],
      goals: ['LT: Erik communiceert met langere, begrijpelijke uitingen in klas en thuis.', 'KT: hij produceert een gekozen tweewoord- of driewoordstructuur in 8 van de 10 spelmomenten.'],
      methods: ['scaffolding en recasting', 'woordenschat in routines', 'fonologische behandeling waar passend', 'audiologie/KNO afstemming'],
      scripts: ['Ik behandel niet door alsof gehoor bijzaak is; stabiele auditieve input is een randvoorwaarde voor taal en fonologie.'],
      warning: 'Onderschat gehoorverlies niet en interpreteer scores altijd samen met taalontwikkelingsniveau.',
      prognosis: 'Voorzichtig positief als gehoor, intensiteit en schoolondersteuning goed geborgd zijn.'
    },
    isa: {
      route: 'cluster3',
      title: 'Isa: totale communicatie en functionele winst',
      pitch: 'Bij Isa is spreken belangrijk, maar functionele communicatie is leidend. Gebaren, pictogrammen en routines zijn geen noodoplossing maar de brug naar participatie.',
      priorities: ['totale communicatie', 'voorzichtige testinterpretatie', 'gebaren/NmG', 'minder frustratie', 'cluster 3 context'],
      goals: ['LT: Isa maakt behoeften duidelijker in dagelijkse routines.', 'KT: ze gebruikt een woord, gebaar of pictogram in drie vaste routines.'],
      methods: ['ondersteunde communicatie', 'Hanen-principes', 'korte directe oefening', 'ouder- en leerkrachtcoaching'],
      scripts: ['Ik kies multimodaal omdat communicatie meer is dan spreken; participatie en minder frustratie zijn hier de kernuitkomst.'],
      warning: 'Stop gebaren niet zodra spraak opkomt; ondersteunende communicatie blijft taalontwikkeling dragen.',
      prognosis: 'Voorzichtig maar betekenisvol: winst zit in zelfstandigheid, begrijpelijkheid en participatie.'
    },
    tarik: {
      route: 'meertalig',
      title: 'Tarik: meertaligheid, leerbaarheid en schoolkeuze',
      pitch: 'Bij Tarik is de behandelvraag niet alleen Nederlands verbeteren. Je moet thuistaal, leerbaarheid, auditieve vaardigheden en schoolcontext wegen voordat je TOS of schoolkeuze verdedigt.',
      priorities: ['thuistaalinformatie', 'leerbaarheid', 'Nederlandse normscore voorzichtig gebruiken', 'auditieve vaardigheden', 'ouder- en schoolvragen'],
      goals: ['LT: Tarik volgt onderwijs beter met taalsteun in relevante contexten.', 'KT: hij leert en gebruikt themawoorden of zinsstructuren met visuele steun en transfer naar de klas.'],
      methods: ['meertalige anamnese', 'woordenschat in schoolthema’s', 'visuele steun', 'ouder/school/tolk betrekken'],
      scripts: ['Ik baseer behandeling niet op Nederlandse normscore alleen; groei, leerbaarheid en thuistaalinformatie bepalen de klinische route.'],
      warning: 'Verwar NT2, beperkte blootstelling en TOS niet te snel.',
      prognosis: 'Positiever bij rijk taalaanbod en aantoonbare leerbaarheid; voorzichtiger bij uitval in beide talen.'
    }
  }
};
