'use strict';

window.ORAL_10_DATA = {
  scoreScale: [
    [0, 'O', 'onvoldoende'],
    [1, 'BV', 'bijna voldoende'],
    [2, 'V', 'voldoende'],
    [3, 'G', 'goed'],
    [4, 'ZG', 'zeer goed']
  ],
  criticalCriteria: {
    diagnostics: [10],
    therapy: [15, 17]
  },
  criticalNote: 'Voor een voldoende moet ieder onderdeel minimaal 20 punten hebben én de kritische criteria 10, 15 en 17 moeten minimaal V (2) zijn.',
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
      href: '/mondeling-10/',
      text: 'Gebruik de opdrachten in Deel 1 om leeftijd, startkeuze en hardop onderbouwen te trainen.'
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
      title: '4. Examenmodus',
      href: '/mondeling-10/',
      text: 'Gebruik Examenmodus om je afname en foutverantwoording zonder hulp te testen.'
    }
  ],
  therapyPrepTools: [
    {
      title: '1. Casus en ICF',
      href: '/pak-de-10/',
      text: 'Gebruik Pak de 10 om diagnose, ICF, hulpvraag en participatieprobleem scherp te krijgen.'
    },
    {
      title: '2. LT- en KT-doel',
      href: '/pak-de-10/',
      text: 'Werk van participatie naar functie: LT-doel is redzaamheid, KT-doel is meetbare behandelstap.'
    },
    {
      title: '3. Methode en therapievorm',
      href: '/mondeling-10/',
      text: 'Gebruik Deel 2 Behandeling om methode, vorm, duur/frequentie en evaluatie toetsgericht te formuleren.'
    },
    {
      title: '4. Zware criteria check',
      href: '/lessen-coach/',
      text: 'Gebruik Collegecoach om criterium 15 en 17 te checken: methodekeuze en therapievorm moeten expliciet verantwoord zijn.'
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
    'Recht tegenover het kind zitten; kies de hoekopstelling.',
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
  therapyMachine: {
    routes: [
      {
        id: 'fonologie',
        title: 'Fonologische stoornis',
        problem: 'Het kind heeft een klanksysteemprobleem: contrasten zijn onvoldoende georganiseerd.',
        lt: 'Het kind is in klas- en thuissituaties beter verstaanbaar en kan actief deelnemen aan gesprek en spel.',
        kt: 'Het kind onderscheidt en produceert het gekozen fonologische contrast in 80-90% van gestructureerde woord- of zinscontexten.',
        method: 'Minimale paren, Metaphon of Hodson & Paden bij meerdere processen.',
        why: 'Ik kies een contrastieve of cyclische aanpak: het probleem zit in het fonologische systeem en vraagt om contrastleren.',
        form: 'Directe individuele therapie, gecombineerd met ouder- en leerkrachtinstructie voor generalisatie.',
        duration: 'Wekelijks of intensiever bij ernstige onverstaanbaarheid; evaluatie na 8-12 sessies.',
        collaboration: 'Ouders en leerkracht oefenen auditieve discriminatie, recasting en functionele transfer.',
        prognosis: 'Gunstig bij goede auditieve verwerking, motivatie en consequente oefening.'
      },
      {
        id: 'fonetisch',
        title: 'Fonetisch / articulatorisch',
        problem: 'Het kind kan een klank motorisch onvoldoende correct vormen of automatiseert een afwijkende articulatie.',
        lt: 'Het kind gebruikt de doelklank verstaanbaar en functioneel in spontane communicatie.',
        kt: 'Het kind produceert de doelklank correct op klank-, woord- en zinsniveau met afbouwende cues.',
        method: 'Motorische articulatiebehandeling; bij myofunctionele oorzaak eerst OMFT of gewoonte-afbouw.',
        why: 'Ik kies motorisch werken omdat de klankproductie zelf centraal staat; bij structurele of myofunctionele factoren moet eerst de randvoorwaarde kloppen.',
        form: 'Individueel, veel korte herhalingen en thuiscontrole.',
        duration: 'Wekelijks met dagelijkse korte oefenmomenten; evaluatie op automatisatie en generalisatie.',
        collaboration: 'Ouders, tandarts/orthodontist of preverbaal logopedist bij mondgewoonten of occlusie.',
        prognosis: 'Afhankelijk van therapietrouw, stimulabiliteit en anatomische randvoorwaarden.'
      },
      {
        id: 'vod',
        title: 'Verbale ontwikkelingsdyspraxie',
        problem: 'Het kind heeft moeite met planning en programmering van spraakbewegingen; fouten zijn vaak wisselend en zoekend.',
        lt: 'Het kind produceert verstaanbare woorden en korte uitingen in dagelijkse situaties.',
        kt: 'Het kind programmeert gekozen klank- of syllabesequenties accuraat met multisensorische cues.',
        method: 'Motorisch-planningsgerichte aanpak met veel herhaling, ritme, visuele en tactiel-kinesthetische cueing; PROMPT-principes waar passend.',
        why: 'Ik kies intensieve motorische oefening omdat VOD vraagt om herhaald inslijpen van motorische sequenties, niet om alleen contrastbewustzijn.',
        form: 'Individueel en intensief, met kort dagelijks thuisprogramma.',
        duration: 'Langduriger traject; bij voorkeur hogere frequentie en regelmatige evaluatie.',
        collaboration: 'Ouders voor korte oefenmomenten, school voor functionele woorden, eventueel ergotherapie/fysiotherapie bij bredere motoriek.',
        prognosis: 'Voorzichtig: vooruitgang is mogelijk, maar generalisatie en automatisatie kosten veel tijd.'
      },
      {
        id: 'morfosyntax',
        title: 'Taalproductie / morfosyntaxis',
        problem: 'Het kind gebruikt korte of grammaticaal zwakke zinnen, laat functiewoorden weg of past vervoegingen onvoldoende toe.',
        lt: 'Het kind formuleert begrijpelijke, grammaticaal rijkere uitingen in spel, klas en gesprek.',
        kt: 'Het kind produceert de gekozen zinsstructuur in 8 van de 10 uitingen binnen gestructureerde interactie.',
        method: 'Morfosyntactische interventie met modeling, recasting, expansie, contrast en scaffolding binnen de zone van naaste ontwikkeling.',
        why: 'Ik kies scaffolding en recasting omdat het kind net boven het huidige taalniveau moet oefenen met steun die ik geleidelijk afbouw.',
        form: 'Directe therapie plus ouder- en leerkrachtcoaching in natuurlijke routines.',
        duration: 'Evaluatie na 8-12 weken op gebruik in spontane taal en klascontext.',
        collaboration: 'Ouders en leerkracht bieden herhaald model, expansies en visuele steun.',
        prognosis: 'Afhankelijk van ernst, leerbaarheid, cognitie en taalaanbod in de omgeving.'
      },
      {
        id: 'semantiek',
        title: 'Woordenschat / semantiek',
        problem: 'Het kind heeft een kleine actieve of passieve woordenschat en slaat woorden onvoldoende rijk op.',
        lt: 'Het kind gebruikt relevante school- en thuistaalwoorden functioneel in uitleg, spel en gesprek.',
        kt: 'Het kind leert en gebruikt wekelijks een beperkte set themawoorden met vorm, betekenis, categorie en context.',
        method: 'Woordenschatinterventie met semantische netwerken, herhaald aanbod, expliciete woordleerstrategie en functionele toepassing.',
        why: 'Ik kies rijke woordopslag omdat losse woordherhaling onvoldoende is; vorm, betekenis en gebruik moeten gekoppeld worden.',
        form: 'Combinatie van directe instructie en klassikale/thuissituatie transfer.',
        duration: 'Cyclisch werken per thema; evaluatie op begrip, actieve productie en generalisatie.',
        collaboration: 'Leerkracht en ouders gebruiken dezelfde woorden in routines en themaactiviteiten.',
        prognosis: 'Gunstiger bij veel kwalitatieve input; voorzichtiger bij brede TOS of beperkte leerbaarheid.'
      },
      {
        id: 'pragmatiek',
        title: 'Pragmatiek / narratief',
        problem: 'Het kind heeft moeite met beurtwisseling, perspectief nemen, gesprekssamenhang of verhaalstructuur.',
        lt: 'Het kind neemt begrijpelijk en passend deel aan gesprekken en spel met leeftijdsgenoten.',
        kt: 'Het kind gebruikt in een gestructureerde taak begin-midden-einde, beurtgedrag of contextinformatie volgens het gekozen doel.',
        method: 'Narratieve interventie, scripts, visuele ondersteuning, rollenspel en naturalistische pragmatiektherapie.',
        why: 'Ik kies functionele interactietraining omdat het probleem vooral zichtbaar wordt in communicatie met anderen.',
        form: 'Individueel starten, daarna groep of klassituatie voor generalisatie.',
        duration: 'Evaluatie na 8-10 weken op gesprek, spel of verhaal in natuurlijke context.',
        collaboration: 'Ouders, leerkracht en eventueel psycholoog/orthopedagoog bij ASS of sociaal-emotionele factoren.',
        prognosis: 'Afhankelijk van sociaal-cognitieve ontwikkeling, omgevingssteun en generalisatie.'
      },
      {
        id: 'meertalig',
        title: 'Meertaligheid / NT2 / TOS',
        problem: 'Er is uitval in het Nederlands en mogelijk ook in de thuistaal; differentiaaldiagnose is cruciaal.',
        lt: 'Het kind kan in relevante talen en contexten functioneler communiceren en onderwijs volgen.',
        kt: 'Het kind breidt gekozen taalstructuren of woordenschat uit met ondersteuning in Nederlands en waar mogelijk thuistaal.',
        method: 'Taalgerichte interventie met zorgvuldige taaldiagnostiek, thuistaalbetrokkenheid, visuele steun en schoolgerichte strategieen.',
        why: 'Ik kies voorzichtig behandelen omdat lage Nederlandse scores alleen geen TOS bewijzen; uitval in beide talen en leerbaarheid sturen mijn keuze.',
        form: 'Direct en indirect, met ouders/tolk en school.',
        duration: 'Evaluatie op groei, leerbaarheid en normscore in de juiste taalcontext.',
        collaboration: 'Ouders, leerkracht, tolk/NT2-expertise en eventueel audiologisch centrum.',
        prognosis: 'Positiever bij rijk taalaanbod en groei; voorzichtiger bij uitval in beide talen.'
      },
      {
        id: 'cluster3',
        title: 'Syndroom / verstandelijke beperking / ASS',
        problem: 'Communicatieontwikkeling is verweven met cognitie, prikkelverwerking, gedrag en onderwijscontext.',
        lt: 'Het kind communiceert functioneler in dagelijkse routines en participeert beter thuis en op school.',
        kt: 'Het kind gebruikt gekozen woorden, gebaren, pictogrammen of zinsvormen in een afgebakende routine.',
        method: 'Totale communicatie, ondersteunde communicatie, Hanen-principes, routinematig oefenen en sterke visuele ondersteuning.',
        why: 'Ik kies multimodaal en functioneel omdat spreken niet de enige route naar participatie is; communicatie moet haalbaar zijn binnen het ontwikkelingsniveau.',
        form: 'Indirect en contextgericht, naast directe korte sessies waar belastbaarheid dat toelaat.',
        duration: 'Kleine stappen, korte cycli, evaluatie op functionele communicatie.',
        collaboration: 'Ouders, leerkracht, psycholoog/orthopedagoog, ergotherapie/fysiotherapie en eventueel cluster 3-team.',
        prognosis: 'Voorzichtig maar betekenisvol: winst zit vaak in functionaliteit, zelfstandigheid en minder frustratie.'
      }
    ],
    goals: [
      ['Verstaanbaarheid', 'Het kind is beter verstaanbaar.', 'Het kind is aan het einde van de behandelperiode in 80-85% van bekende klassituaties verstaanbaar voor vertrouwde gesprekspartners.'],
      ['Fonologisch contrast', 'Het kind kan /s/ en /t/.', 'Het kind onderscheidt en produceert het contrast /s/-/t/ in 8 van de 10 minimale paren op woordniveau.'],
      ['Articulatie', 'De klank lukt beter.', 'Het kind produceert de doelklank correct op woordniveau met maximaal een verbale cue in 80% van de pogingen.'],
      ['Morfosyntaxis', 'Het kind maakt langere zinnen.', 'Het kind produceert in 8 van de 10 uitingen een vierwoordzin met correcte woordvolgorde binnen gestructureerd spel.'],
      ['Taalbegrip', 'Het kind begrijpt instructies.', 'Het kind voert tweestapsinstructies in de klas in 4 van de 5 situaties uit met visuele steun.'],
      ['Woordenschat', 'Het kind leert nieuwe woorden.', 'Het kind gebruikt vijf themawoorden actief in spel en kringactiviteit binnen twee weken.'],
      ['Narratief', 'Het kind vertelt beter.', 'Het kind vertelt bij een vierstapsplaat een verhaal met begin, midden, einde en minimaal twee verbindingswoorden.'],
      ['Pragmatiek', 'Het kind speelt leuk samen.', 'Het kind houdt in een coöperatief spel drie beurten beurtwisseling vast met visuele ondersteuning.'],
      ['Ondersteunde communicatie', 'Het kind gebruikt gebaren.', 'Het kind gebruikt in drie dagelijkse routines een gebaar of pictogram om een behoefte of keuze duidelijk te maken.']
    ],
    methods: [
      ['Minimale paren', 'fonologisch contrastprobleem', 'niet kiezen bij puur motorisch onvermogen', 'Ik kies minimale paren omdat betekenisverschil het kind laat ervaren dat klankcontrast functioneel is.'],
      ['Metaphon', 'fonologische processen met metalinguistisch bewustzijn', 'te abstract bij zeer jong of beperkt leerbaar kind', 'Ik kies Metaphon omdat het kind de onderliggende klankcategorieen moet leren onderscheiden.'],
      ['Hodson & Paden', 'ernstige onverstaanbaarheid met meerdere processen', 'minder passend bij een enkel fonetisch probleem', 'Ik kies cyclisch werken omdat meerdere processen tegelijk de verstaanbaarheid beperken.'],
      ['Motorische articulatie', 'fonetische klankvorming', 'niet als hoofdroute bij systeemfout', 'Ik kies motorisch werken omdat de productiebeweging zelf onvoldoende lukt.'],
      ['PROMPT-principes', 'VOD of motorische planning', 'niet inzetten als het probleem uitsluitend fonologisch is', 'Ik kies multisensorische cueing omdat planning en sequenties centraal staan.'],
      ['Scaffolding/recasting', 'morfosyntaxis of TOS', 'maak de doelstructuur concreet', 'Ik kies recasting en scaffolding om doelstructuren net boven huidig niveau uit te lokken.'],
      ['Woordenschatinterventie', 'semantische zwakte', 'niet beperken tot nazeggen', 'Ik kies rijke woordopslag: vorm, betekenis, categorie en gebruik worden gekoppeld.'],
      ['Narratieve interventie', 'verhaalopbouw en samenhang', 'niet starten zonder visuele structuur bij zwak begrip', 'Ik kies verhaalstructuur omdat narratie syntax, semantiek en pragmatiek integreert.'],
      ['Hanen/ouderbegeleiding', 'jonge kinderen en generalisatie via ouders', 'niet passend als ouders overbelast zijn zonder aanpassing', 'Ik kies oudercoaching omdat dagelijkse interactie de meeste oefenkansen geeft.'],
      ['Ondersteunde communicatie/NmG', 'beperkte spraak of verstandelijke beperking', 'niet stoppen zodra eerste woorden komen', 'Ik kies multimodaal omdat functionele communicatie belangrijker is dan alleen spreken.']
    ],
    scripts: [
      ['Fonologisch defect met frustratie', 'Ik kies een spelenderwijze contrastieve aanpak omdat de verstaanbaarheid wordt beperkt door een fonologisch systeemprobleem. Door met minimale paren of Metaphon te werken, koppel ik functieniveau aan participatie in de klas.'],
      ['TOS met beperkt lexicon', 'Ik kies taalstimulering en woordenschatinterventie omdat het kind meer rijke woordrepresentaties nodig heeft. Ik combineer directe behandeling met ouders en school zodat de woorden in dagelijkse context terugkomen.'],
      ['VOD', 'Ik kies een motorisch-planningsgerichte aanpak met veel herhaling en multisensorische cues. Bij VOD is vooral de planning van klanksequenties kwetsbaar.'],
      ['Meertalig met TOS-vraag', 'Ik behandel voorzichtig en verzamel informatie over beide talen. Als de uitval in beide talen zichtbaar is, past dat meer bij TOS dan bij alleen blootstellingsachterstand.'],
      ['Pragmatiek/ASS', 'Ik kies functionele pragmatiek- en scripttraining omdat het probleem vooral zichtbaar is in interactie. Ouders, leerkracht en eventueel psycholoog zijn nodig voor generalisatie.'],
      ['Morfosyntaxis', 'Ik kies scaffolding en recasting binnen de zone van naaste ontwikkeling. Het KT-doel richt zich op een concrete zinsstructuur en het LT-doel op begrijpelijker communiceren.'],
      ['Down/cluster 3', 'Ik kies ondersteunde communicatie en korte functionele routines. De behandeling moet aansluiten bij belastbaarheid en ontwikkelingsniveau, met ouders en school als vaste partners.'],
      ['Gehoorproblematiek', 'Ik stem eerst af met audiologie of KNO, omdat stabiele auditieve input een randvoorwaarde is voor taal- en fonologische ontwikkeling. Therapie zonder deze check is kwetsbaar.']
    ],
    collaboration: [
      ['Ouders', 'draagkracht, hulpvraag en oefenkansen', 'dagelijkse korte routines en feedback', 'Ouders zijn nodig voor generalisatie, omdat de meeste taalinput buiten de behandelkamer plaatsvindt.'],
      ['Leerkracht/IB', 'functioneren in groep en schoolse impact', 'visuele steun, recasting en doelwoorden in de klas', 'De leerkracht maakt transfer naar participatie mogelijk.'],
      ['Psycholoog/orthopedagoog', 'cognitie, ASS, aandacht en sociaal-emotionele factoren', 'doelen afstemmen op leerbaarheid en gedrag', 'Zo voorkom ik overvraging en kies ik haalbare therapievormen.'],
      ['Audioloog/KNO', 'gehoorstatus en middenoorproblematiek', 'medische/audiologische follow-up', 'Auditieve toegang is een randvoorwaarde voor taal- en spraakontwikkeling.'],
      ['Fysio/ergo', 'motoriek, prikkelverwerking en planning', 'afstemming bij VOD of brede motorische problemen', 'Motorische planning kan de spraaktherapie beinvloeden.'],
      ['Ambulant begeleider', 'onderwijsbehoefte en clusterondersteuning', 'logopedische doelen opnemen in handelingsplan', 'Zo worden behandeling en onderwijscontext een geheel.']
    ],
    prognosis: [
      ['Fonologische stoornis', 'Gunstig bij goede auditieve verwerking, stimulabiliteit en consequente generalisatie.'],
      ['VOD', 'Voorzichtig; motorisch leren vraagt hoge intensiteit, veel herhaling en langdurige monitoring.'],
      ['TOS', 'Langdurige ondersteuning is waarschijnlijk; doelen richten op functioneren en compensatie naast groei.'],
      ['Meertaligheid', 'Positief als er leerbaarheid en rijk taalaanbod is; voorzichtig bij uitval in beide talen.'],
      ['Syndroom/verstandelijke beperking', 'Voorzichtig maar functioneel betekenisvol: winst zit in communicatie, participatie en minder frustratie.'],
      ['ASS/pragmatiek', 'Afhankelijk van sociaal-cognitieve ontwikkeling, voorspelbaarheid en omgevingssteun.'],
      ['Gehoorproblematiek', 'Afhankelijk van snelle medische/audiologische stabilisatie en toegang tot auditieve input.']
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
      ['Waarom is narratie een belangrijk doel?', 'Narratie integreert woordenschat, zinsbouw, pragmatiek en schoolse participatie.', 'Criterium 12/14'],
      ['Wanneer zet je ondersteunde communicatie in?', 'Als spreken nog onvoldoende functioneel is en het kind toch communicatief moet kunnen participeren.', 'Criterium 11/16'],
      ['Wanneer schaal je af?', 'Als het doel functioneel en spontaan in meerdere contexten wordt toegepast of als een plateau om consultatie vraagt.', 'Criterium 18/20']
    ]
  },
  examCoach: {
    intro: 'De mondelinge toets heeft 15 minuten voorbereiding per tweetal, daarna 20 minuten diagnostiek en 10 minuten therapiegesprek. Deel b vraagt om conclusie, advies en behandelkeuzes vanuit Methodisch Handelen. Elk onderdeel telt 40 punten; criteria 10, 15 en 17 moeten minimaal (2) V zijn.',
    toetsFlow: [
      '15 minuten: toetscasus lezen, Schlichting-start klaarzetten en taakverdeling bepalen.',
      '20 minuten: live afname Taalbegrip en Taalproductie/Zinsontwikkeling, inclusief foutverantwoording.',
      '10 minuten: therapiegesprek over logopedisch beeld, doelen, methode, therapievorm, duur, samenwerking en prognose.',
      'Cesuur: diagnostiek minimaal 20/40, therapie minimaal 20/40 en kritische criteria minimaal (2) V.'
    ],
    cases: [
      {
        id: 'zmlk-down',
        title: '1. Cluster 3 / syndroomprofiel',
        source: 'Aangeleverde casus 1',
        profile: 'Jong kind in cluster-3 onderwijs met syndroomprofiel, trage ontwikkeling, zeer beperkte verstaanbaarheid, 1-woorduitingen, veel gebaren en frustratie bij niet begrepen worden.',
        trap: 'Niet inzetten op alleen spraaknormalisatie. De kern is functionele communicatie, ondersteunde communicatie, ouders/school en kleine haalbare routines.',
        focus: ['functionele communicatie', 'NmG/ondersteunde communicatie', 'verstaanbaarheid', 'mondmotorische randvoorwaarden', 'ouders en leerkracht', 'voorzichtige prognose'],
        steps: [
          ['11. Vervolgstap', 'Begin bij communicatiebehoefte, frustratie en onderwijscontext.', 'Ik kies als vervolgstap een functioneel communicatieplan, omdat het kind graag communiceert maar met spraak alleen onvoldoende begrepen wordt.', ['vervolgstap', 'functioneel', 'communicatie', 'spraak']],
          ['12. LT-doel', 'LT is participatie en minder frustratie, niet perfecte uitspraak.', 'Mijn LT-doel is dat het kind in klas en thuis met spraak, gebaren of ondersteunend materiaal duidelijker kan communiceren en minder frustratie ervaart.', ['lt', 'klas', 'thuis', 'gebaren', 'frustratie']],
          ['13. KT-doel', 'Maak het klein: routine, woord/gebaar/pictogram, meetbaar.', 'Mijn KT-doel is dat het kind binnen een vaste routine vijf functionele woorden of gebaren gebruikt om een wens of keuze duidelijk te maken.', ['kt', 'routine', 'vijf', 'woorden', 'gebaren']],
          ['14. Methode past', 'Kies multimodaal en ontwikkelingsgericht.', 'Ik kies Hanen-principes, Nederlands met Gebaren en ondersteunde communicatie, omdat de communicatieve voorwaarden aanwezig zijn maar expressie beperkt blijft.', ['methode', 'hanen', 'gebaren', 'ondersteunde communicatie']],
          ['15. Methode verantwoorden', 'Kritisch: leg uit waarom multimodaal beter past dan alleen articulatie.', 'Deze methode past omdat het kind nu direct communicatiesucces nodig heeft en taal/spraakontwikkeling via dagelijkse interactie en herhaling wordt ondersteund.', ['omdat', 'communicatiesucces', 'interactie', 'herhaling']],
          ['16. Therapievorm past', 'Combineer korte directe momenten met indirecte begeleiding.', 'De therapievorm is kort direct oefenen met het kind, gecombineerd met ouder- en leerkrachtcoaching.', ['therapievorm', 'direct', 'ouders', 'leerkracht']],
          ['17. Therapievorm verantwoorden', 'Kritisch: de omgeving moet dezelfde signalen gebruiken.', 'Deze vorm past omdat communicatie vooral lukt als ouders en school dezelfde gebaren, pictogrammen en routines gebruiken.', ['omdat', 'ouders', 'school', 'gebaren', 'routines']],
          ['18. Duur/frequentie', 'Langdurig, kleine cycli, regelmatig evalueren.', 'Ik werk in kleine cycli van 8 tot 12 weken met wekelijkse afstemming en evaluatie op functioneel gebruik.', ['duur', 'frequentie', '8', '12', 'evaluatie']],
          ['19. Samenwerking', 'Noem preverbaal/mondmotorisch en onderwijs.', 'Ik werk samen met ouders, leerkracht, schoolteam en zo nodig preverbaal logopedist of arts bij mondgedrag en gehoor/verkoudheden.', ['samenwerking', 'ouders', 'leerkracht', 'preverbaal', 'gehoor']],
          ['20. Prognose', 'Voorzichtig, maar functioneel hoopvol.', 'De prognose is voorzichtig maar betekenisvol: snelle normalisatie verwacht ik niet, wel groei in communicatie, verstaanbaarheid en minder frustratie.', ['prognose', 'voorzichtig', 'communicatie', 'verstaanbaarheid']]
        ]
      },
      {
        id: 'meertalig-school',
        title: '2. Meertaligheid / leerachterstand',
        source: 'Aangeleverde casus 2',
        profile: 'Schoolgaand kind met Turks-Nederlandse taalcontext, kleine woordenschat, korte zinnen, matige verstaanbaarheid, leerachterstand, gedragsfrustratie en vraag regulier/SBO/cluster-2.',
        trap: 'Geen harde TOS- of schooladviesconclusie op Nederlandse scores alleen. Weeg thuistaal, blootstelling, leerbaarheid, cognitie en aandacht.',
        focus: ['meertaligheid', 'thuistaal', 'TOS-vraag', 'schooladvies', 'woordenschat/morfosyntaxis', 'ouders-school-tolk'],
        steps: [
          ['11. Vervolgstap', 'Start met differentiaaldiagnostiek en schoolfunctioneren.', 'Mijn vervolgstap is aanvullend beeld vormen van beide talen, leerbaarheid, aandacht en schools functioneren voordat ik behandel- of schooladvies hard maak.', ['vervolgstap', 'beide talen', 'leerbaarheid', 'school']],
          ['12. LT-doel', 'LT gaat over schoolse participatie.', 'Mijn LT-doel is dat het kind in de klas taal beter begrijpt en gebruikt, zodat hij onderwijs kan volgen en sociaal beter mee kan doen.', ['lt', 'klas', 'onderwijs', 'sociaal']],
          ['13. KT-doel', 'Kies woordenschat of zinsbouw meetbaar.', 'Mijn KT-doel is dat het kind themawoorden en korte doelzinnen uit de klas actief gebruikt in 8 van de 10 oefenmomenten met visuele steun.', ['kt', 'themawoorden', 'zinnen', '8 van de 10']],
          ['14. Methode past', 'Taalgerichte interventie met rijke woordopslag.', 'Ik kies woordenschat- en taalstructuurinterventie met rijke semantische opslag, modeling en visuele ondersteuning.', ['methode', 'woordenschat', 'modeling', 'visuele ondersteuning']],
          ['15. Methode verantwoorden', 'Kritisch: koppel aan meertaligheid en leerbaarheid.', 'Deze methode past omdat losse Nederlandse woordtraining onvoldoende is; het kind moet woorden en structuren functioneel leren gebruiken in schoolcontext en waar mogelijk gekoppeld aan de thuistaal.', ['omdat', 'nederlands', 'thuistaal', 'schoolcontext']],
          ['16. Therapievorm past', 'Direct plus indirect via school en ouders.', 'De therapievorm is directe taaltherapie gecombineerd met coaching van leerkracht en ouders, eventueel met tolk of NT2-expertise.', ['therapievorm', 'direct', 'ouders', 'leerkracht', 'tolk']],
          ['17. Therapievorm verantwoorden', 'Kritisch: generalisatie en interpretatie vragen omgeving.', 'Deze vorm past omdat taalontwikkeling, gedrag en leerachterstand alleen goed te duiden zijn met informatie uit thuis en school.', ['omdat', 'thuis', 'school', 'leerachterstand']],
          ['18. Duur/frequentie', 'Evalueer groei en transfer.', 'Ik plan een behandelcyclus van 8 tot 12 weken en evalueer groei in woordenschat, zinsbouw, verstaanbaarheid en klasdeelname.', ['duur', 'frequentie', '8', '12', 'groei']],
          ['19. Samenwerking', 'Schoolkeuze vraagt multidisciplinair.', 'Ik werk samen met ouders, leerkracht, IB/orthopedagoog, tolk/NT2-deskundige en zo nodig cluster-2/SBO-adviespartners.', ['samenwerking', 'ouders', 'leerkracht', 'orthopedagoog', 'nt2']],
          ['20. Prognose', 'Voorwaarden benoemen.', 'De prognose is voorzichtig positief bij rijk taalaanbod en duidelijke structuur, maar voorzichtiger door beneden gemiddelde cognitie, aandacht en uitval in beide talen.', ['prognose', 'voorzichtig', 'cognitie', 'aandacht']]
        ]
      },
      {
        id: 'spraaktaal-gehoor',
        title: '3. Spraak-taal / gehoorcomponent',
        source: 'Aangeleverde casus 3',
        profile: 'Jong kind met ernstige taalproductieproblemen, telegramstijl, fonologische/onregelmatige spraakproblemen, faalangst bij verbale taken en geleidingsverlies/mogelijke perceptieve component.',
        trap: 'Niet alleen taaltherapie kiezen zonder gehoorstatus mee te nemen. Auditieve toegang is randvoorwaarde voor taal en spraak.',
        focus: ['TOS-profiel', 'morfosyntaxis', 'spraak/fonologie', 'gehoor', 'faalangst', 'cluster-2 advies'],
        steps: [
          ['11. Vervolgstap', 'Start met randvoorwaarde gehoor en breed taal-spraakbeeld.', 'Mijn vervolgstap is behandeling combineren met audiologische follow-up, omdat gehoorverlies de taal- en spraakontwikkeling kan blijven beïnvloeden.', ['vervolgstap', 'gehoor', 'taal', 'spraak']],
          ['12. LT-doel', 'LT is verstaanbaar en begrijpelijk participeren.', 'Mijn LT-doel is dat het kind zich in gezin en onderwijs begrijpelijker uit met langere zinnen en beter verstaanbare spraak.', ['lt', 'gezin', 'onderwijs', 'zinnen', 'spraak']],
          ['13. KT-doel', 'Meetbare morfosyntaxis plus spraakdoel.', 'Mijn KT-doel is dat het kind met visuele steun een gekozen zinsstructuur in 8 van de 10 uitingen gebruikt en één gekozen spraakpatroon gericht oefent.', ['kt', 'zinsstructuur', '8 van de 10', 'spraakpatroon']],
          ['14. Methode past', 'Taalproductie en fonologie combineren.', 'Ik kies scaffolding/recasting voor morfosyntaxis en een fonologische aanpak voor spraakpatronen, afgestemd op auditieve mogelijkheden.', ['methode', 'scaffolding', 'recasting', 'fonologisch']],
          ['15. Methode verantwoorden', 'Kritisch: waarom deze combinatie?', 'Deze combinatie past omdat het kind zowel grammaticale taalvormen als spraakcontrasten nodig heeft, maar auditieve input eerst voldoende toegankelijk moet zijn.', ['omdat', 'grammaticale', 'spraakcontrasten', 'auditieve input']],
          ['16. Therapievorm past', 'Direct, veilig en omgevingsgericht.', 'De therapievorm is individuele directe therapie met veel succeservaring, plus ouder- en schoolcoaching.', ['therapievorm', 'individueel', 'ouders', 'school']],
          ['17. Therapievorm verantwoorden', 'Kritisch: faalangst en transfer.', 'Deze vorm past omdat het kind onzeker is bij verbale opdrachten en veilige directe oefening nodig heeft, terwijl transfer via ouders en school geborgd wordt.', ['omdat', 'onzeker', 'veilig', 'transfer']],
          ['18. Duur/frequentie', 'Langdurig en monitoren.', 'Ik kies wekelijkse therapie met evaluatie na 8 tot 12 weken en tussentijdse check van gehoorstatus en communicatieve groei.', ['duur', 'frequentie', 'wekelijks', '8', '12']],
          ['19. Samenwerking', 'Audiologie/KNO móet genoemd.', 'Ik werk samen met ouders, leerkracht, audioloog/KNO en eventueel cluster-2-team om taal, spraak en gehoor op elkaar af te stemmen.', ['samenwerking', 'ouders', 'leerkracht', 'audioloog', 'kno']],
          ['20. Prognose', 'Voorzichtig door gehoor en ernst.', 'De prognose is voorzichtig positief als gehoor stabiel wordt en de behandeling intensief en schoolgericht wordt volgehouden.', ['prognose', 'voorzichtig', 'gehoor', 'schoolgericht']]
        ]
      },
      {
        id: 'ass-fonologie',
        title: '4. ASS / fonologisch bewustzijn',
        source: 'Aangeleverde casus 4',
        profile: 'Kind met ASS-kenmerken en kwetsbare gezondheid, zwakke verstaanbaarheid, restfonologische processen, zwak fonologisch bewustzijn, woordvindproblemen en behoefte aan voorspelbaarheid/picto’s.',
        trap: 'Niet alleen klanken oefenen. Je moet structuur, voorspelbaarheid, fonologische opslag en verhaal/woordvindsteun meenemen.',
        focus: ['ASS-structuur', 'fonologisch bewustzijn', 'verstaanbaarheid', 'woordopslag', 'visuele steun', 'MDO'],
        steps: [
          ['11. Vervolgstap', 'Koppel spraak aan voorspelbare leerstrategie.', 'Mijn vervolgstap is een gestructureerd spraak-taalplan met vaste strategieën, omdat verstaanbaarheid en fonologische opslag beide kwetsbaar zijn.', ['vervolgstap', 'gestructureerd', 'verstaanbaarheid', 'fonologische opslag']],
          ['12. LT-doel', 'LT: begrijpelijk vertellen met steun.', 'Mijn LT-doel is dat het kind in de klas begrijpelijker vertelt en deelneemt met vaste visuele steun en herstelstrategieën.', ['lt', 'klas', 'vertelt', 'visuele steun']],
          ['13. KT-doel', 'Meetbaar op klank/woord en verhaal.', 'Mijn KT-doel is dat het kind gekozen doelwoorden fonologisch correcter opslaat en gebruikt in 8 van de 10 oefenmomenten met picto-ondersteuning.', ['kt', 'doelwoorden', '8 van de 10', 'picto']],
          ['14. Methode past', 'Kies fonologische opslag plus contrasten.', 'Ik kies een combinatie van fonologische bewustzijnstraining, contrastief oefenen en woordenschatopslag met visuele ondersteuning.', ['methode', 'fonologisch bewustzijn', 'contrastief', 'visuele ondersteuning']],
          ['15. Methode verantwoorden', 'Kritisch: waarom niet alleen articulatie?', 'Deze methode past omdat het probleem niet alleen in uitspraak zit, maar ook in klankbewustzijn, woordopslag en oproepen uit het lexicon.', ['omdat', 'uitspraak', 'klankbewustzijn', 'lexicon']],
          ['16. Therapievorm past', 'Structuur en voorspelbaarheid.', 'De therapievorm is directe individuele therapie in vaste stappen, met indirecte afstemming met leerkracht en ouders.', ['therapievorm', 'individueel', 'vaste stappen', 'ouders']],
          ['17. Therapievorm verantwoorden', 'Kritisch: ASS vraagt voorspelbaarheid.', 'Deze vorm past omdat het kind behoefte heeft aan voorspelbaarheid, systematische instructie en transfer via picto’s in de groep.', ['omdat', 'voorspelbaarheid', 'systematisch', 'picto']],
          ['18. Duur/frequentie', 'Regelmatige korte cycli.', 'Ik plan wekelijkse behandeling in cycli van 8 tot 12 weken met evaluatie van verstaanbaarheid, woordopslag en klasgebruik.', ['duur', 'frequentie', 'wekelijks', '8', '12']],
          ['19. Samenwerking', 'MDO uit casus concreet maken.', 'Ik werk samen met ouders, leerkracht, psycholoog/orthopedagoog en fysiotherapie om communicatie, gedrag, motoriek en structuur af te stemmen.', ['samenwerking', 'ouders', 'leerkracht', 'psycholoog', 'fysiotherapie']],
          ['20. Prognose', 'Gunstig op groei, voorzichtig op generalisatie.', 'De prognose is voorzichtig positief: groei is haalbaar met structuur en herhaling, maar generalisatie blijft kwetsbaar door ASS-profiel en fonologische zwakte.', ['prognose', 'voorzichtig', 'structuur', 'generalisatie']]
        ]
      },
      {
        id: 'vod-cognitie',
        title: '5. VOD / cognitieve beperking',
        source: 'Aangeleverde casus 5',
        profile: 'Schoolgaand kind met cognitieve beperking, zeer zwakke verstaanbaarheid, VOD-kenmerken, fonologische processen, kleine woordenschat, zwakke morfosyntaxis en beperkte klasparticipatie.',
        trap: 'Niet puur fonologisch of puur taal behandelen. De casus vraagt geïntegreerd werken: spraakmotoriek, fonologie, taal en participatie.',
        focus: ['VOD', 'fonologische processen', 'morfosyntaxis', 'cognitieve belastbaarheid', 'schooltransfer', 'handelingsplan'],
        steps: [
          ['11. Vervolgstap', 'Start geïntegreerd en ICF-gericht.', 'Mijn vervolgstap is een geïntegreerd behandelplan voor spraakmotoriek, fonologie en taal, gekoppeld aan participatie in de klas.', ['vervolgstap', 'spraakmotoriek', 'fonologie', 'klas']],
          ['12. LT-doel', 'LT: functionele klascommunicatie.', 'Mijn LT-doel is dat het kind met ondersteuning actief deelneemt aan klasroutines en beter verstaanbare korte uitingen gebruikt.', ['lt', 'klasroutines', 'verstaanbare', 'uitingen']],
          ['13. KT-doel', 'Kies één motorisch/fonologisch en één taalstap.', 'Mijn KT-doel is dat het kind gekozen functionele woorden of korte zinnen met doelklanken in 80% van de oefenpogingen produceert met visuele cueing.', ['kt', 'functionele woorden', '80', 'visuele cueing']],
          ['14. Methode past', 'Combineer motorisch-planning, cyclisch en scaffolding.', 'Ik kies motorisch-planningsgericht oefenen, cyclische fonologische stimulatie en scaffolding/recasting voor één zinsstructuur per keer.', ['methode', 'motorisch', 'cyclisch', 'scaffolding']],
          ['15. Methode verantwoorden', 'Kritisch: waarom deze combinatie?', 'Deze combinatie past omdat er kenmerken zijn van VOD, fonologische processen en zwakke morfosyntaxis, terwijl de cognitieve belastbaarheid beperkt is.', ['omdat', 'vod', 'fonologische processen', 'morfosyntaxis']],
          ['16. Therapievorm past', 'Kort, direct, intensief plus omgeving.', 'De therapievorm is individuele directe therapie met korte herhalingen, aangevuld met ouder- en leerkrachtcoaching.', ['therapievorm', 'individueel', 'direct', 'ouders', 'leerkracht']],
          ['17. Therapievorm verantwoorden', 'Kritisch: generalisatie naar handelingsplan.', 'Deze vorm past omdat automatisatie veel herhaling vraagt en transfer naar klas alleen lukt als logopedisch werkplan en jaarhandelingsplan worden afgestemd.', ['omdat', 'automatisatie', 'klas', 'handelingsplan']],
          ['18. Duur/frequentie', 'Langduriger, kleine evaluatiecycli.', 'Ik plan een langduriger traject met wekelijkse of hogere frequentie waar haalbaar en evaluatie na 8 tot 12 weken.', ['duur', 'frequentie', 'wekelijks', '8', '12']],
          ['19. Samenwerking', 'Ouders, leerkracht en IB móeten erin.', 'Ik werk samen met ouders, leerkracht en IB/orthopedagoog om doelen, klaswoorden en het jaarhandelingsplan op elkaar af te stemmen.', ['samenwerking', 'ouders', 'leerkracht', 'orthopedagoog', 'handelingsplan']],
          ['20. Prognose', 'Functioneel positief, geen snelle normalisatie.', 'De prognose is voorzichtig en functioneel positief: verstaanbaarheid en participatie kunnen groeien, maar automatisatie en generalisatie kosten veel tijd.', ['prognose', 'voorzichtig', 'participatie', 'automatisatie']]
        ]
      }
    ]
  },
  wietzePrep: {
    pitch: 'Wietze is 7;0 jaar met een vertraagde spraak-taalontwikkeling, TIQ 62, zwakke verstaanbaarheid, VOD-kenmerken, fonologische processen en zeer zwakke morfosyntaxis. Mijn behandelprioriteit is functionele communicatie in de klas: spraakmotorische planning en verstaanbaarheid verbeteren, terwijl ik zinsbouw en woordenschat klein, visueel en contextgebonden aanbied. Omdat hij zich terugtrekt als de lessen te talig worden, moet het logopedisch werkplan direct gekoppeld worden aan ouders, leerkracht en jaarhandelingsplan.',
    differential: [
      'Fonologisch: fronting, stopping, devoicing en vervanging van initiale klanken door /t/ wijzen op een systeemcomponent.',
      'VOD: wisselende substituties, omissies, clusterreductie en hardop zoeken naar klanken wijzen op planning/programmering.',
      'Taal/TOS-profiel: woordenschat blijft klein en zinsbouw/morfologie zijn erg zwak.',
      'Cognitie: TIQ 62 betekent beperkte belastbaarheid, trage automatisering en behoefte aan visuele steun.',
      'Valkuil: alleen minimale paren kiezen mist de motorische planning; alleen articulatie/VOD missen de fonologische en morfosyntactische component.'
    ],
    icf: [
      ['Functies', 'fonologische organisatie, spraakmotorische planning, zinsbouw/morfologie, woordenschat, informatieverwerking'],
      ['Activiteiten', 'verstaanbare woorden en korte zinnen produceren, hulpvragen stellen, korte boodschap vertellen'],
      ['Participatie', 'meedoen in de klas, kringmomenten, contact met leerkracht en klasgenoten'],
      ['Externe factoren', 'ouders, leerkracht, visuele ondersteuning, afstemming jaarhandelingsplan en logopedisch werkplan'],
      ['Persoonlijke factoren', 'wil graag helpen/doen, maar trekt zich terug bij overvraging of onbegrip']
    ],
    plan: [
      ['Week 1-4', 'communicatieve veiligheid, kernwoorden voor klas, motorische cueing op haalbare woordstructuren, visuele zinssteun'],
      ['Week 5-8', 'fonologische patronen cyclisch stimuleren, een zinsstructuur per sessie, transferwoorden uit de klas'],
      ['Week 9-12', 'generalisatie naar kring/hulpvraag, leerkrachtcoaching, evaluatie verstaanbaarheid en participatie']
    ],
    goals: [
      ['LT', 'Wietze neemt binnen 6 maanden met visuele steun actief deel aan minimaal drie dagelijkse klassituaties, waarbij hij herstelstrategieen gebruikt als hij niet begrepen wordt.'],
      ['KT spraakmotoriek', 'Wietze produceert binnen 8 weken gekozen functionele CVC-woorden met bilabiale of alveolaire doelklanken in 80% van de pogingen met afbouwende visuele/tactiele cue.'],
      ['KT fonologie', 'Wietze onderscheidt en produceert binnen 10 weken een gekozen contrast, bijvoorbeeld /t/-/k/ of stemhebbend-stemloos, in 8 van de 10 betekenisvolle woorden.'],
      ['KT morfosyntaxis', 'Wietze produceert binnen 8 weken een vaste SVO-structuur bij 10 actiekaarten met visuele zinssteun en maximaal een verbale cue.'],
      ['KT participatie', 'Wietze gebruikt binnen 6 weken in de klas een pictogram of vaste zin om hulp te vragen of een beurt te nemen, minimaal drie keer per week volgens leerkrachtregistratie.']
    ],
    methods: [
      ['Motorisch-planningsgericht', 'voor VOD-kenmerken: veel korte herhalingen, ritme, visuele/tactiele cueing, foutarm leren'],
      ['Hodson & Paden / cyclisch', 'voor meerdere hardnekkige fonologische processen zonder alles tegelijk te eisen'],
      ['Minimale paren / Metaphon light', 'alleen concreet en visueel, omdat abstract metalinguistisch redeneren belastend is bij TIQ 62'],
      ['Scaffolding / recasting', 'voor een zinsstructuur per sessie; steun langzaam afbouwen'],
      ['Woordenschat in klascontext', 'nieuwe woorden uit schoolthema’s rijk opslaan en direct functioneel gebruiken'],
      ['Ouder- en leerkrachtcoaching', 'noodzakelijk voor generalisatie buiten de behandelkamer']
    ],
    scripts: [
      'Ik behandel Wietze niet als een puur fonologisch kind, omdat de wisselende fouten en het zoekgedrag wijzen op VOD-kenmerken. Daarom combineer ik motorisch-planningsgericht oefenen met concrete fonologische contrasten.',
      'Ik kies voor korte, frequente en visueel ondersteunde oefening, omdat Wietze door zijn TIQ 62 beperkt belastbaar is en automatisering meer herhaling vraagt.',
      'Ik train niet alle klanken tegelijk. Ik kies functionele woorden uit de klas, zodat de spraakdoelen direct bijdragen aan participatie.',
      'Voor zinsbouw werk ik met een zinsstructuur per sessie, omdat meerdere structuren tegelijk de cognitieve belasting te hoog maken.',
      'De leerkracht is onderdeel van de therapie, omdat Wietze juist in de klas vastloopt en transfer zonder omgevingssteun te kwetsbaar is.'
    ],
    collaboration: [
      ['Ouders', 'dagelijks korte oefening met vaste woorden/zinnen; navragen wat thuis haalbaar is'],
      ['Leerkracht', 'visuele steun in kring/instructie, succesmomenten plannen, registreren of Wietze initiatief neemt'],
      ['IB/orthopedagoog', 'logopedisch werkplan koppelen aan jaarhandelingsplan en cognitieve belastbaarheid bewaken'],
      ['Audiologie/KNO', 'recente gehoorstatus controleren als auditieve verwerking of discriminatie twijfelachtig is'],
      ['Fysio/ergo', 'alleen betrekken bij bredere motorische planning, prikkelverwerking of belastbaarheid'],
      ['MDO-check', 'mondgewoonten/anatomie alleen meenemen als observatie of casus dit bevestigt; niet als vast Wietze-feit presenteren']
    ],
    prognosis: 'De prognose is voorzichtig en functioneel positief. Door TIQ 62, VOD-kenmerken en zwakke morfosyntaxis verwacht ik betekenisvolle groei in verstaanbaarheid, korte functionele uitingen en participatie bij intensieve, klein-stappige behandeling met school- en thuisborging.',
    questions: [
      ['Waarom is minimale paren onvoldoende?', 'Wietze heeft naast fonologische processen ook VOD-kenmerken. De motorische planning vraagt extra, herhaalde sturing.'],
      ['Waarom niet eerst alleen de /g/?', 'Omdat de prioriteit functionele verstaanbaarheid en klasparticipatie is; ik kies doelen op functionele last, stimulabiliteit en haalbaarheid.'],
      ['Hoe voorkom je overbelasting?', 'Een doel per sessie, visuele steun, korte herhalingen, foutarm leren en transfer in kleine routines.'],
      ['Waarom is de klas zo belangrijk?', 'Daar ligt de participatiebeperking: hij kan lessen niet volgen en trekt zich terug. Zonder klastransfer blijft therapie kamergebon­den.'],
      ['Wat doe je als ouders weinig oefenen?', 'Ik analyseer de barriere en maak oefenen kleiner: vaste routines, 3 minuten per dag, concrete woorden en visuele instructie.'],
      ['Hoe meet je vooruitgang?', 'Ik combineer woord-/zinsniveau met participatie: verstaanbaarheid, gekozen contrast, SVO-structuur en leerkrachtobservatie van initiatief.'],
      ['Wat is realistische prognose?', 'Geen snelle normalisatie, wel functionele communicatiegroei bij intensieve, visueel ondersteunde en contextgebonden behandeling.'],
      ['Hoe stem je af met het handelingsplan?', 'Ik vertaal logopedische doelen naar klasroutines en laat IB/leerkracht dezelfde doelen opnemen in het jaarhandelingsplan.']
    ],
    cheat: [
      'Kern: TOS/profiel + VOD-kenmerken + TIQ 62 + participatieprobleem in klas.',
      'Prioriteit: functionele verstaanbaarheid, communicatieve veiligheid, een zinsstructuur per keer, transfer.',
      'Methode: motorisch-planningsgericht + cyclische/contrastieve fonologie + scaffolding/recasting.',
      'Vorm: individueel direct, kort en intensief; indirect via ouders/leerkracht.',
      'Duur: 8-12 weken eerste cyclus, evalueren op functie én participatie.',
      'ZG-zin: “Ik kies een ICF-gestuurd plan waarin spraakmotoriek, fonologie en morfosyntaxis direct gekoppeld zijn aan Wietze’s participatie in de klas.”'
    ]
  },
  cases: [
    {
      title: 'Taalbegrip-afname',
      mode: 'diagnostics',
      context: 'Kind reageert impulsief en kijkt naar de testleider voor bevestiging.',
      task: 'Demonstreer neutraal aanbieden, professioneel begrenzen en achteraf verantwoorden.',
      model: 'Ik zet de testsituatie rustig en voorspelbaar neer, met alleen het noodzakelijke materiaal zichtbaar. Ik bied Taalbegrip-3 vanaf de juiste sectie neutraal aan, zonder nadruk, blikrichting of extra hulp. Als het kind impulsief reageert, begrens ik professioneel zonder de respons inhoudelijk te sturen. Achteraf benoem ik of mijn handelen de validiteit of betrouwbaarheid van de respons heeft beïnvloed.'
    },
    {
      title: 'Taalproductie-3: Zinsontwikkeling',
      mode: 'diagnostics',
      context: 'Je merkt dat je bijna vragende intonatie gebruikt bij een stimuluszin.',
      task: 'Leg uit wat het risico is, herstel professioneel en benoem de invloed op betrouwbaarheid.',
      model: 'Bij Zinsontwikkeling bied ik de stimuluszin exact en met passende natuurlijke intonatie aan. Een bijna vragende intonatie kan de respons sturen en daarmee de standaardisatie bedreigen. Ik benoem die fout concreet, herstel volgens de handleiding waar mogelijk en verantwoord of de respons nog betrouwbaar te interpreteren is.'
    },
    {
      title: 'Therapie bij fonologische problematiek',
      mode: 'therapy',
      context: 'Kind is slecht verstaanbaar, maakt fronting en clusterreductie en durft minder te spreken in de klas.',
      task: 'Geef LT-doel, KT-doel, methode, therapievorm, samenwerking en prognose.',
      targetWords: ['lt', 'kt', 'methode', 'therapievorm', 'samenwerking', 'prognose'],
      model: 'Mijn LT-doel is dat het kind binnen de klas functioneel verstaanbaar deelneemt aan kring- en speelmomenten, zodat het weer spreekinitiatief durft te nemen. Mijn KT-doel is dat het kind het gekozen contrast, bijvoorbeeld /k/ tegenover /t/ bij fronting of clusters in doelwoorden, in 80% van de gestructureerde oefensituaties correct toepast. Ik kies voor een fonologische methode zoals minimale paren, Metaphon of Hodson & Paden, omdat fronting en clusterreductie wijzen op een klanksysteemprobleem. De therapievorm is directe individuele behandeling, aangevuld met ouder- en leerkrachtcoaching voor recasting, auditieve discriminatie en transfer in de klas. De prognose is gunstig tot voorzichtig positief, afhankelijk van ernst, stimulabiliteit, auditieve verwerking en consequente generalisatie.'
    },
    {
      title: 'Therapie bij taalproductiezwakte',
      mode: 'therapy',
      context: 'Kind gebruikt korte zinnen, laat functiewoorden weg en heeft visuele steun nodig.',
      task: 'Verdedig behandelkeuze en maak het advies concreet voor ouders en leerkracht.',
      targetWords: ['lt', 'kt', 'methode', 'therapievorm', 'samenwerking', 'prognose'],
      model: 'Ik richt de behandeling op functionele taalproductie: langere, grammaticaal completere uitingen in dagelijkse situaties. Het KT-doel is bijvoorbeeld dat het kind met visuele zinssteun S-V-O-zinnen produceert in 8 van 10 oefenmomenten. Ik kies scaffolding, modeling en recasting, omdat het kind steun nodig heeft binnen de zone van naaste ontwikkeling. Ouders en leerkracht krijgen concrete routines om functiewoorden en zinsuitbreiding uit te lokken. De prognose is afhankelijk van leerbaarheid, taalbegrip, cognitieve belastbaarheid en toepassing buiten de behandelkamer.'
    },
    {
      title: 'Meertalige casus',
      mode: 'therapy',
      context: 'Nederlandse scores zijn laag, thuistaalinformatie is nog onvolledig en school vraagt om advies.',
      task: 'Leg uit welke vervolgstap je kiest en waarom je voorzichtig bent met norminterpretatie.',
      targetWords: ['meertaligheid', 'thuistaal', 'blootstelling', 'tos', 'ouders', 'school'],
      model: 'Ik trek nog geen harde conclusie op basis van alleen lage Nederlandse scores. Eerst verzamel ik informatie over de thuistaal, taalblootstelling, ontwikkelingsverloop en functioneren in beide talen. Als de problemen in beide talen zichtbaar zijn, wordt TOS waarschijnlijker; als vooral het Nederlands achterblijft, kan beperkte blootstelling meespelen. Ik adviseer school om taalsteun en visuele ondersteuning te bieden en betrek ouders om de thuistaalontwikkeling goed in beeld te krijgen.'
    }
  ],
  scoreTable: [
    [5, 1.0], [7, 1.5], [9, 2.0], [10, 2.5], [12, 3.0], [14, 3.5],
    [16, 4.0], [17, 4.5], [19, 5.0], [21, 5.5], [23, 6.0], [25, 6.5],
    [27, 7.0], [30, 7.5], [33, 8.0], [35, 8.5], [37, 9.0], [39, 9.5], [40, 10.0]
  ]
};
