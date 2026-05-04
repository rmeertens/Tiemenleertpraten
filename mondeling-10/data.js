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
  therapyMachine: {
    routes: [
      {
        id: 'fonologie',
        title: 'Fonologische stoornis',
        problem: 'Het kind heeft een klanksysteemprobleem: contrasten zijn onvoldoende georganiseerd.',
        lt: 'Het kind is in klas- en thuissituaties beter verstaanbaar en kan actief deelnemen aan gesprek en spel.',
        kt: 'Het kind onderscheidt en produceert het gekozen fonologische contrast in 80-90% van gestructureerde woord- of zinscontexten.',
        method: 'Minimale paren, Metaphon of Hodson & Paden bij meerdere processen.',
        why: 'Ik kies een contrastieve of cyclische aanpak omdat het probleem in het fonologische systeem zit, niet alleen in losse klankmotoriek.',
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
        why: 'Ik kies functionele interactietraining omdat het probleem zichtbaar wordt in communicatie met anderen, niet alleen in losse taalvorm.',
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
        duration: 'Evaluatie op groei en leerbaarheid, niet alleen op eentalige normscore.',
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
      ['Scaffolding/recasting', 'morfosyntaxis of TOS', 'te vaag zonder concreet doelstructuur', 'Ik kies recasting en scaffolding om doelstructuren net boven huidig niveau uit te lokken.'],
      ['Woordenschatinterventie', 'semantische zwakte', 'niet beperken tot nazeggen', 'Ik kies rijke woordopslag: vorm, betekenis, categorie en gebruik worden gekoppeld.'],
      ['Narratieve interventie', 'verhaalopbouw en samenhang', 'niet starten zonder visuele structuur bij zwak begrip', 'Ik kies verhaalstructuur omdat narratie syntax, semantiek en pragmatiek integreert.'],
      ['Hanen/ouderbegeleiding', 'jonge kinderen en generalisatie via ouders', 'niet passend als ouders overbelast zijn zonder aanpassing', 'Ik kies oudercoaching omdat dagelijkse interactie de meeste oefenkansen geeft.'],
      ['Ondersteunde communicatie/NmG', 'beperkte spraak of verstandelijke beperking', 'niet stoppen zodra eerste woorden komen', 'Ik kies multimodaal omdat functionele communicatie belangrijker is dan alleen spreken.']
    ],
    scripts: [
      ['Fonologisch defect met frustratie', 'Ik kies een spelenderwijze contrastieve aanpak omdat de verstaanbaarheid wordt beperkt door een fonologisch systeemprobleem. Door met minimale paren of Metaphon te werken, koppel ik functieniveau aan participatie in de klas.'],
      ['TOS met beperkt lexicon', 'Ik kies taalstimulering en woordenschatinterventie omdat het kind meer rijke woordrepresentaties nodig heeft. Ik combineer directe behandeling met ouders en school zodat de woorden in dagelijkse context terugkomen.'],
      ['VOD', 'Ik kies een motorisch-planningsgerichte aanpak met veel herhaling en multisensorische cues. Bij VOD is niet alleen het contrast, maar vooral de planning van klanksequenties kwetsbaar.'],
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
    prognosis: 'De prognose is voorzichtig maar functioneel positief. Door TIQ 62, VOD-kenmerken en zwakke morfosyntaxis verwacht ik geen snelle normalisatie, maar wel betekenisvolle groei in verstaanbaarheid, korte functionele uitingen en participatie als behandeling intensief, klein-stappig en school/thuis-geborgd is.',
    questions: [
      ['Waarom niet alleen minimale paren?', 'Omdat Wietze naast fonologische processen ook VOD-kenmerken heeft; alleen contrasttherapie pakt de motorische planning onvoldoende aan.'],
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
      'ZG-zin: “Ik kies geen losse klanktraining, maar een ICF-gestuurd plan waarin spraakmotoriek, fonologie en morfosyntaxis direct gekoppeld zijn aan Wietze’s participatie in de klas.”'
    ]
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
