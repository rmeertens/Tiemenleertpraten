'use strict';

window.ACCENT_DATA = {
  caseProfile: [
    ['Cliënt', 'Bernard, 34 jaar, drukkerijmedewerker en actief shantykoorzanger.'],
    ['Diagnose/context', 'Lichte zwelling op de linker stemplooi, gering stemvolume en kwaliteitsvermindering gedurende de dag.'],
    ['Belasting', 'Achtergrondruis in de drukkerij en hoge stemvraag in het koor lokken hyperfunctioneel stemgebruik uit.'],
    ['Hulpvraag', 'Minder belastend stemgebruik zonder verlies van draagkracht.'],
    ['Waarom Accentmethode', 'De methode koppelt adem, fonatie, articulatie, ritme en beweging zodat Bernard economischer stemgeeft met draagkracht.']
  ],
  route: [
    'Start met doel en werkwijze in cliënttaal: minder belasting, meer efficiënte adem-stemkoppeling.',
    'Demonstreer de gevraagde oefening: Largo zelf kiezen, daarna Andante, Allegro of tekst als de docent die kiest.',
    'Laat Bernard imiteren en geef korte non-verbale cues: beweging, adem, kaak, inzet en afsluiting.',
    'Vraag door: wat voelde je, waar zat spanning, wat ging makkelijker?',
    'Geef één concreet compliment, één verbetercue en laat direct opnieuw proberen.',
    'Geef huiswerk alleen bij de afronding: materiaal, frequentie, aandachtspunten en transfer naar drukkerij/koor.'
  ],
  powerLines: [
    'We oefenen economisch stemgebruik: je stem mag draagkracht krijgen zonder extra druk op je stemplooien.',
    'Laat de beweging het ritme dragen; je hoeft de stem niet te duwen.',
    'Ik wil dat je thuis niet zomaar herhaalt, maar gericht let op zachte inzet, zachte afsluiting, kaakruimte en passieve adem.'
  ],
  theory: [
    ['Kern van de methode', 'De Accentmethode is een globale/totale methode. Adem, fonatie, articulatie en gedachteconcentratie worden samen getraind, niet als losse trucjes.'],
    ['Therapeutische houding', 'De methode is non-directief: nodig Bernard uit om mee te doen, demonstreer het juiste klankaanbod en corrigeer vooral via voorbeeld, oogcontact, ritme en beweging.'],
    ['Doel', 'Ondoelmatige reflexen in stemgeving vervangen door functionele reflexcoördinatie: een storingsvrijer spraakverloop met efficiënte adem-stemkoppeling.'],
    ['Fysiologie', 'De methode steunt op de myo-elastisch-aerodynamische larynxtheorie: subglottische druk en musculaire stemplooisluiting moeten optimaal samenwerken.'],
    ['Borstregister en Vielluftstimme', 'Aanvankelijk wordt gevoileerd/überhaucht geoefend in borstregister. Het glijdende oppervlak van de stemplooien komt in beweging; dit geeft een masserend effect en kan weefselverbetering ondersteunen.'],
    ['Waarom ritme', 'De afwisseling van meer-minder-meer spanning in ritme traint snelle aanspanning en ontspanning. Zo ontstaat elasticiteit in adem-, stem- en bewegingspatronen.'],
    ['Belangrijk voor Bernard', 'Zijn hyperfunctionele dysfonie, drukkerijruis, koorbelasting, kuchen/roken/drinken en zwelling vragen om minder glottale druk en meer efficiënte draagkracht.']
  ],
  criteria: [
    {
      id: 'doel',
      title: '1. Doel en werkwijze uitleggen',
      must: ['Doel koppelen aan Bernard: drukkerij, koor, zwelling, stemvermoeidheid.', 'Werkwijze kort: adem, stem, ritme en beweging samenwerken.', 'Cliënttaal gebruiken, niet te technisch.'],
      fix: ['Noem Largo als rustig beginritme.', 'Leg uit dat het om minder belasting én behoud van draagkracht gaat.'],
      model: 'We gaan werken aan een manier van stemgeven waarbij adem en stem beter samenwerken. Daardoor hoeft u minder te drukken, maar blijft uw stem wel draagkracht houden voor de drukkerij en het koor.'
    },
    {
      id: 'uitleg',
      title: '2. Oefening correct uitleggen',
      must: ['Vooraf zeggen wat Bernard gaat doen.', 'Tijdens de uitvoering kort cueën.', 'Na afloop checken wat hij voelde.'],
      fix: ['Niet alleen “doe mij maar na”; benoem inademing, beweging, uitademing en klank.'],
      model: 'Ik doe het eerst voor. U beweegt met mij mee: inademen in de voorbereidende beweging, daarna laat u de klank rustig meegaan op de uitademing.'
    },
    {
      id: 'clienttaal',
      title: '3. Taalgebruik aanpassen',
      must: ['Korte zinnen.', 'Beeldende woorden: soepel, verend, loslaten, niet duwen.', 'Alleen vaktaal als je het meteen vertaalt.'],
      fix: ['Vervang “subglottische druk” door “minder druk onder de stem”.'],
      model: 'Denk aan een soepele, dragende stem. Niet harder persen, maar de lucht en beweging laten helpen.'
    },
    {
      id: 'ritmes',
      title: '4. Ritmes en beweging correct demonstreren',
      must: ['Tempo klopt.', 'Beweging is zichtbaar en niet statisch.', 'Ongeaccentueerd en geaccentueerd zijn hoorbaar verschillend.', 'Opbouw volgen en geronde klanken niet overslaan.'],
      fix: ['Knieën los; niet op slot.', 'Allegro niet te snel.', 'Geronde klinkers /oe/ en /o/ expliciet meenemen.'],
      model: 'Ik laat eerst het ritme in mijn lichaam zien en pas daarna komt de klank erbij. Zo draagt de beweging de stem.'
    },
    {
      id: 'ritme1',
      title: '5. Ritme 1 / tekstniveau demonstreren',
      must: ['Heldere stemkwaliteit.', 'Vaste maar zachte inzet.', 'Ontspannen borststem/registermenging.', 'Ruime ontspannen articulatie.', 'Juiste adem-stemcoördinatie.', 'Oogcontact en non-verbale ondersteuning.'],
      fix: ['Meer ontspannen borstregister.', 'Geen harde offset aan einde vocaal.', 'Kaakdaling groter.'],
      model: 'Bij Largo houd ik de stem rustig, warm en gedragen. De klank dooft zacht uit, zonder tik aan het einde.'
    },
    {
      id: 'ritme2',
      title: '6. Ritme 2 / tekstniveau demonstreren',
      must: ['Allegro/andante ritme correct.', 'Adem-stemcoördinatie blijft behouden bij sneller tempo.', 'Beweging blijft verend.', 'Articulatie blijft ruim.'],
      fix: ['Tempo niet jachtig.', 'Opmaat/rust niet overslaan.', 'Non-verbale cue zichtbaar maken.'],
      model: 'Ook in het snellere ritme blijft de beweging leidend. Ik houd de stem licht en verend, zonder te gaan jagen.'
    },
    {
      id: 'nonverbaal',
      title: '7. Non-verbale instructies',
      must: ['Handen/armen/knieën voordoen.', 'Kaakdaling aanwijzen zonder veel woorden.', 'Tempo met lichaam bewaken.', 'Oogcontact gebruiken.'],
      fix: ['Vorige keer was non-verbaal nauwelijks zichtbaar: maak cues bewust groot genoeg.'],
      model: 'Ik wijs niet alleen verbaal bij, maar laat met mijn handen en beweging zien waar het tempo, de kaakruimte en de ontspanning zitten.'
    },
    {
      id: 'zelfreflectie',
      title: '8. Cliënt zelf laten verwoorden',
      must: ['Open vraag stellen.', 'Doorvragen op gevoel, adem, spanning, stem, gemak.', 'Antwoord gebruiken voor volgende cue.'],
      fix: ['Niet stoppen na “hoe ging het?” Vraag door.'],
      model: 'Wat merkte u aan uw keel, adem en kaak? Waar voelde het makkelijker, en waar moest u nog werken?'
    },
    {
      id: 'feedback',
      title: '9. Specifieke feedback',
      must: ['Eén concreet compliment.', 'Eén verbeterpunt.', 'Eén volgende poging met cue.', 'Feedback koppelen aan doel.'],
      fix: ['Niet alleen “goed gedaan”; zeg waar hij op moet letten en waarom.'],
      model: 'Uw tempo bleef nu rustiger, dat helpt om minder druk te zetten. Let bij de volgende keer op het zacht laten uitdoven van de klinker.'
    },
    {
      id: 'huiswerk',
      title: '10. Huiswerk en aandachtspunten',
      must: ['Concreet materiaal meegeven.', 'Frequentie en duur noemen.', 'Aandachtspunten samenvatten.', 'Transfer naar drukkerij/koor benoemen.'],
      fix: ['Noem wat hij meekrijgt: audio/trommel/kaart/tekst.', 'Maak aandachtspunten specifiek: kaak, zachte offset, spiegel, ritme.'],
      model: 'U oefent thuis drie keer per dag vijf minuten met de audio of trommel, voor de spiegel. Let vooral op losse knieën, ruime kaak, zachte inzet en zachte afsluiting.'
    }
  ],
  rhythms: [
    {
      id: 'largo',
      title: 'Ritme 1: Largo',
      detail: [
        ['Doel', 'Adem-beweging-stemkoppeling in 3/4 maat om het glijdende oppervlak van de stembanden volledig te laten bewegen: massage-effect.'],
        ['Houding', 'Therapeut en cliënt staan tegenover elkaar in spiegelbeeld. Voet naar voren, handen eerst vastpakken, daarna loslaten als het loopt.'],
        ['Beweging', 'Rustige voor-achterwaartse beweging. Naar voren = inademing; naar achteren = uitademing/fonatie. Eventueel hele-armbeweging: voor arm omhoog/voor, achter arm omlaag/achter.'],
        ['Ritme', '3 tellen inademen en 3 tellen stemgeving zonder pauze. Eerste accent onbeklemtoond, tweede en derde beklemtoond; rustig en gelijkmatig.'],
        ['Klankopbouw', 'Stemloos /f/ /s/ /sj/ → stemhebbend /v/ /z/ /zj/ → geronde /u/ of /o/ → klankcombinaties → variaties → klinkerspraak/dramatische uitroepen.'],
        ['Observatie', 'Adembeweging achter=uit/voor=in, stem synchroon met inzet beweging, weke steminzet, borstregister, losse kaak, oogcontact, gedachteconcentratie.'],
        ['Let op', 'Geen pauze tussen in- en uitademing. Geen glottisslag of harde offset. Geronde klinkers niet overslaan. Armbeweging stoppen als die niet ondersteunt.']
      ],
      errors: ['Knieën op slot', 'Beweging te statisch', 'Geronde klanken overslaan', 'Harde vocaalafsluiting', 'Te weinig borstregister', 'Kaakdaling matig']
    },
    {
      id: 'andante',
      title: 'Ritme 2-optie: Andante',
      detail: [
        ['Doel', 'Juiste coördinatie tussen ademhaling, beweging en fonatie in 4/4 maat.'],
        ['Ritme', 'Inademing duurt 1/8 tel, onbeklemtoonde inzet ook 1/8 tel, daarna drie beklemtoonde even sterke klanken.'],
        ['Buikwand', 'Direct terugveren/ontspannen van de buikwand na uitademing is essentieel; vaak apart oefenen. Gebruik de 1/8 rust voor snelle inademing.'],
        ['Beweging', 'Kleine spreidstand. Draaiende beweging om de lichaamsas: links/rechts. Onderarmbeweging vanuit losse elleboog ondersteunt de accenten.'],
        ['Klankopbouw', 'Eerst spiranten/fricatieven, daarna stemhebbend, vervolgens vocalen, gevarieerde vocalen en intonaties. Daarna korte zinnen in klinkerspraak.'],
        ['Observatie', 'Soepele beweging, borstregister, losse kaakbeweging, oogcontact, gedachteconcentratie, juiste 4/4 maat, rust eventueel met vingerknip markeren.'],
        ['Let op', 'Ga pas naar Andante als Largo goed beheerst wordt. Te grote buikbewegingen geven spanning en leiden af.']
      ],
      errors: ['Te snel worden', 'Accent forceren', 'Beweging vergeten', 'Adem los van stem', 'Articulatie verstrakt']
    },
    {
      id: 'allegro',
      title: 'Ritme 2-optie: Allegro',
      detail: [
        ['Doel', 'Coördinatie van adem, beweging en fonatie in 4/4 maat; dynamischer dan Andante.'],
        ['Ritme', 'Allegro is verdubbeling van Andante: opmaat van 1/8 en vijf gelijkmatige beklemtoonde accenten. Houd het tempo laag genoeg.'],
        ['Beweging', 'Juiste houding tegenover elkaar, licht verende kniebeweging, gebogen armen, schuddende handbeweging los vanuit de pols.'],
        ['Klankopbouw', 'Luisteren naar tempo, beurtwisseling: /ff/ /ss/ /sj/ → /vv/ /zz/ /zj/ → open klinkers → variatie binnen reeks → intonatievariatie.'],
        ['Observatie', 'Buikbeweging tijdens inademing en accenten, loslaten van buikwand na uitademing, borstregister, kaakbeweging, oogcontact en gedachteconcentratie.'],
        ['Let op', 'Voorkom jachtigheid. Geef aan dat de inademing kort en diep is. Trommel kan ondersteunen.']
      ],
      errors: ['Tempo te vlot', 'Opmaat overslaan', 'Spreken op reserve', 'Onvoldoende accentverschil', 'Polsbeweging niet zichtbaar']
    },
    {
      id: 'tekst',
      title: 'Tekstniveau',
      detail: [
        ['Doel', 'Integratie van Accentmethode naar tekst en spontane spraak, na Allegro.'],
        ['Werkwijze', 'Verdeel tekst in logische informatie-eenheden. Laat accenten beluisteren, dan klinkerspraak imiteren, daarna natuurlijke zin met behoud van accenten.'],
        ['Accenttypen', 'Tempo I/Largo: isolerend en affect aanduidend. Tempo II/Andante: selecterend en aanduidend. Tempo III/Allegro: groeperend.'],
        ['Beweging', 'Largo = hele arm, Andante = onderarm, Allegro = handbeweging.'],
        ['Observatie', 'Ontspannen aangezichtsspieren, losse kaak, loslaten buikwand, intonatie, spreektempo, ritme, pauzes, oogcontact en gedachteconcentratie.'],
        ['Let op', 'Niet veel uitleggen en praten; vooral oefenen. Eerst denken, dan oogcontact, dan inademing, dan spreken.']
      ],
      errors: ['Te snel naar tekst', 'Ritme verliezen', 'Articulatie kleiner maken', 'Adem-stem loskoppelen', 'Alle aandacht naar tekstinhoud']
    }
  ],
  checklists: [
    ['Largo observatielijst', 'Spiegelbeeld tegenover cliënt, handen pakken, voor-achterwaarts leiden, hand op buik ter controle, handen loslaten, non-verbaal laten doorgaan, juiste klankvolgorde, synchroon stem/beweging, geen pauze, eerste accent onbeklemtoond en tweede/derde beklemtoond, weke inzet, losse kaak, oogcontact, gedachteconcentratie, eventueel trommel en hele-armbeweging.'],
    ['Andante observatielijst', 'Juiste uitgangshouding, tegenover cliënt, buikwandbeweging auditief/visueel/tactiel laten waarnemen, draaiing om lichaamsas, beurtwisseling met /ff ss/, /vv zz zj/, vocalen en gevarieerde vocalen, intonatie, onderarmbeweging, 1/8 rust voor inademing, borstregister, direct ontspannen buikwand, losse kaak, oogcontact, gedachteconcentratie.'],
    ['Allegro observatielijst', 'Juiste houding, luisteren naar tempo, verende kniebeweging, armhouding, hoorbare uitademing op /ff ss sj/, /vv zz zj/ en open klinkers, variatie in klank/intonatie, buikwand loslaten, kaakbeweging, schuddende handbeweging, korte diepe inademing, oogcontact, gedachteconcentratie, eventueel trommel of voorvoetvering.'],
    ['Tekst observatielijst', 'Juiste houding, accenten beluisteren, geaccentueerde klinkers voordoen, oefenzin imiteren, accenten via klinkerspraak, natuurlijke zin met accenten, gedachteconcentratie naar luisteraar, oogcontact, loslaten buikwand, losse kaak, intonatie, spreektempo, ritme, pauzes en geschikte oefenteksten.'],
    ['Trommelen', 'Gebruik trommel alleen ondersteunend. Largo in 3/4, Andante in 4/4 met 1/8 rust eventueel vingerknip, Allegro in 4/4 met sneller accentpatroon. Trommel mag ritme dragen, maar mag jou niet afleiden van cliënt en stem.']
  ],
  textExamples: [
    ['Andante zinnen', 'we gaan naar huis; ik ben niet bang; de deur is rood; de zon is warm; een mooie naam; ik zie de zon; neem mij maar mee; de maan is geel; we zingen samen mooi.'],
    ['Korte affectzinnen', 'kom! weg! ga! wat nu? doe dat! laat dat! hou op!'],
    ['Teksten', 'Onnozele Hans, De duivel en de priester, De belofte. Gebruik eerst klinkerspraak en laat daarna de zin natuurlijk overbrengen.']
  ],
  simulations: [
    ['Start Largo', 'Leg Bernard in cliënttaal doel en werkwijze uit en start Largo met /f/.'],
    ['Corrigeer beweging', 'Bernard staat op slot en beweegt nauwelijks vanuit de knieën. Geef non-verbale en verbale cue.'],
    ['Zelfreflectie', 'Vraag Bernard hoe het ging en vraag daarna door op adem, keel, kaak en gemak.'],
    ['Feedback na poging', 'Bernard doet Largo redelijk, maar sluit de vocaal hard af. Geef specifieke feedback en laat opnieuw proberen.'],
    ['Weerstand Bernard', 'Bernard zegt: “Ik wilde een truc om weer te zingen, waarom moet ik zo raar bewegen?” Reageer non-directief en motiverend.'],
    ['Andante gekozen door docent', 'De docent kiest Andante. Demonstreer 1/8 inademing, onbeklemtoonde inzet, drie accenten, draaiing en onderarmbeweging.'],
    ['Allegro gekozen door docent', 'De docent kiest Allegro. Leg kort uit, demonstreer opmaat en voorkom jachtig tempo.'],
    ['Tekstniveau', 'De docent kiest tekstniveau. Leg uit hoe je ritme, klinkerspraak en ontspannen articulatie bewaakt.'],
    ['Huiswerk afsluiten', 'Geef concreet huiswerk inclusief materiaal, frequentie, aandachtspunten en transfer naar drukkerij/koor.']
  ],
  homework: [
    ['Materiaal', 'Audio-opname of ritmische gids/trommel, korte huiswerkkaart en eventueel tekstmateriaal.'],
    ['Frequentie', '3x per dag 5 minuten, liever kort en precies dan lang en slordig. In jouw toets oefen je per onderdeel ook compact: ongeveer 5 minuten.'],
    ['Aandachtspunten', 'Losse knieën/polsen, ruime kaak, zachte inzet, zachte offset, adem en stem samen.'],
    ['Zelfcheck', 'Voel ik buikrecoil? Duw ik in mijn keel? Dooft de klank zacht uit? Blijft de kaak los?'],
    ['Transfer', 'Voor drukkerij: eerst ademruimte en draagkracht zonder persen. Voor koor: niet compenseren met keeldruk.']
  ],
  feedbackExamples: [
    ['Te algemeen', 'Dat ging goed.', 'Specifiek', 'Uw tempo bleef rustiger; daardoor hoorde ik minder druk op de stem. Let nu nog op zachte afsluiting.'],
    ['Te aardig', 'Voor een eerste keer heel goed.', 'Specifiek', 'De beweging kwam goed op gang. Bij de volgende poging wil ik dat u de kaak iets meer laat vallen bij /o/.'],
    ['Te vaag', 'Let op ontspanning.', 'Specifiek', 'Laat uw knieën los en laat de klank vanzelf uitdoven; dan hoeft de keel het einde niet dicht te zetten.']
  ],
  finalChecklist: [
    'Ik kan doel en werkwijze in 30 seconden in cliënttaal uitleggen.',
    'Ik kan kort uitleggen dat de Accentmethode een globale, non-directieve methode is.',
    'Ik demonstreer Largo met losse knieën, duidelijke beweging, zachte inzet en zachte offset.',
    'Ik kan Andante, Allegro en tekstniveau zonder spiekposter starten en weet welke beweging erbij hoort.',
    'Ik bewaak onbeklemtoond/beklemtoond, buikwand, borstregister, kaak en oogcontact.',
    'Ik vergeet geronde klanken niet.',
    'Ik geef zichtbare non-verbale cues.',
    'Ik vraag door na cliëntreflectie.',
    'Ik geef feedback: concreet compliment + concreet verbeterpunt + volgende poging.',
    'Ik geef huiswerk met materiaal, frequentie, aandachtspunten en transfer.'
  ]
};
