'use strict';

window.SCHLICHTING_EXAMPLE_DATA = {
  schema: 'schlichting-v1',
  title: 'Fictieve voorbeeldset voor importtest',
  sourceNote: 'Deze set bevat verzonnen oefenitems. Vervang dit door je eigen NotebookLM-export.',
  taalbegrip: {
    rules: {
      ageRange: 'Gebruik de leeftijdsrange uit je eigen handleidingexport.',
      setup: [
        'Zet alleen fictief oefenmateriaal klaar.',
        'Bied neutraal aan en voorkom inhoudelijke hulp.',
        'Noteer na elk item direct score en observatie.'
      ],
      startRules: [
        {
          minMonths: 24,
          maxMonths: 35,
          label: 'Fictief startpunt jong',
          startItem: 1,
          returnRule: 'Geen terugkeer in deze fictieve voorbeeldset.',
          stopRule: 'Stop na drie opeenvolgende fictieve fouten.'
        },
        {
          minMonths: 36,
          maxMonths: 84,
          label: 'Fictief startpunt ouder',
          startItem: 3,
          returnRule: 'Bij instapfout terug naar item 1.',
          stopRule: 'Stop na drie opeenvolgende fictieve fouten.'
        }
      ],
      stopRule: 'Gebruik in de echte import de exacte afbreekregel uit de handleiding.',
      returnRule: 'Gebruik in de echte import de exacte terugkeerregel uit de handleiding.'
    },
    sections: [
      {
        id: 'tb-demo',
        title: 'Fictieve begripssectie',
        goal: 'Demonstreren hoe de cockpit werkt.',
        instruction: 'Gebruik hier straks de exacte instructie uit je privé-export.',
        source: 'Fictieve voorbeelddata'
      }
    ],
    items: [
      {
        id: 'TB-1',
        number: 1,
        section: 'tb-demo',
        script: 'Fictieve testleiderzin: wijs het plaatje aan dat hoort bij de zin.',
        material: 'Fictieve plaat A',
        correct: 'Kind kiest het bedoelde plaatje.',
        incorrect: 'Kind kiest een ander plaatje of reageert niet.',
        scoring: '1 bij correcte keuze, 0 bij fout of geen respons.',
        repeat: 'Maximaal eenmalig herhalen zonder nadruk.',
        forbiddenHelp: 'Geen aanwijzen, geen nadruk op kernwoorden, geen bevestigende blik.',
        pitfalls: ['Niet helpen met je intonatie.', 'Niet corrigeren tijdens het item.'],
        source: 'Fictieve voorbeelddata'
      },
      {
        id: 'TB-2',
        number: 2,
        section: 'tb-demo',
        script: 'Fictieve testleiderzin: laat zien welk voorwerp eerst komt.',
        material: 'Fictieve plaat B',
        correct: 'Kind wijst het doelvoorwerp aan.',
        incorrect: 'Kind wijst volgorde of voorwerp fout aan.',
        scoring: '1 bij correcte respons, 0 bij fout.',
        repeat: 'Alleen herhalen volgens de regel in je eigen export.',
        forbiddenHelp: 'Niet voordoen.',
        pitfalls: ['Let op impulsief reageren.', 'Registreer twijfel als observatie.'],
        source: 'Fictieve voorbeelddata'
      },
      {
        id: 'TB-3',
        number: 3,
        section: 'tb-demo',
        script: 'Fictieve testleiderzin: kies het plaatje waar de pop iets doet.',
        material: 'Fictieve plaat C',
        correct: 'Kind kiest de doelhandeling.',
        incorrect: 'Kind kiest afleider.',
        scoring: '1 of 0 volgens fictieve regel.',
        repeat: 'Geen extra uitleg.',
        forbiddenHelp: 'Geen semantische cue.',
        pitfalls: ['Blijf neutraal bij twijfel.', 'Scoor pas na volledige respons.'],
        source: 'Fictieve voorbeelddata'
      }
    ]
  },
  zinsontwikkeling: {
    rules: {
      setup: [
        'Neem alleen het onderdeel Zinsontwikkeling af.',
        'Bied de stimuluszin natuurlijk maar exact aan.',
        'Scoor morfosyntaxis apart van articulatie.'
      ],
      startRules: [
        {
          minMonths: 36,
          maxMonths: 84,
          label: 'Fictieve start zinsontwikkeling',
          startItem: 1,
          returnRule: 'Gebruik echte terugkeerregel uit je import.',
          stopRule: 'Gebruik echte afbreekregel uit je import.'
        }
      ],
      stopRule: 'Gebruik in de echte import de exacte afbreekregel uit de handleiding.'
    },
    items: [
      {
        id: 'ZO-1',
        number: 1,
        script: 'Fictieve stimuluszin: De jongen loopt naar huis.',
        target: 'Fictieve woordvolgorde/doelconstructie.',
        correctExamples: ['De jongen loopt naar huis.'],
        incorrectExamples: ['Jongen huis lopen.'],
        scoring: 'Scoor op de doelconstructie, niet op uitspraak.',
        repeat: 'Herhaal alleen als de handleiding dat toestaat.',
        intonation: 'Natuurlijk, zonder grammaticale cue.',
        pitfalls: ['Niet verbeteren.', 'Niet laten raden wat je bedoelt.'],
        source: 'Fictieve voorbeelddata'
      },
      {
        id: 'ZO-2',
        number: 2,
        script: 'Fictieve stimuluszin: Het meisje heeft de bal gevonden.',
        target: 'Fictieve persoonsvorm/voltooide tijd.',
        correctExamples: ['Het meisje heeft de bal gevonden.'],
        incorrectExamples: ['Meisje bal gevonden.'],
        scoring: 'Gebruik straks de exacte handleidingscriteria.',
        repeat: 'Geen ongeoorloofde cue.',
        intonation: 'Rustig en gelijkmatig.',
        pitfalls: ['Articulatiefout is niet automatisch grammaticale fout.'],
        source: 'Fictieve voorbeelddata'
      }
    ]
  },
  rubric: {
    criteria: [
      {
        id: 'exact',
        title: 'Exact aanbieden',
        description: 'Je zegt de itemtekst exact en zonder extra hulp.',
        source: 'Fictieve toetsrubric'
      },
      {
        id: 'score',
        title: 'Juist scoren',
        description: 'Je koppelt respons aan scorecriterium en verantwoordt twijfel.',
        source: 'Fictieve toetsrubric'
      },
      {
        id: 'validiteit',
        title: 'Validiteit en betrouwbaarheid',
        description: 'Je benoemt wat je eigen handelen deed met de respons.',
        source: 'Fictieve toetsrubric'
      }
    ]
  },
  zgScripts: [
    {
      id: 'setup',
      title: 'Testsituatie openen',
      coach: 'Noem opstelling, materiaal, neutraliteit en waarom dit de respons zuiver houdt.',
      script: 'Ik zet de testsituatie rustig en voorspelbaar neer. Alleen noodzakelijk materiaal is zichtbaar. Ik bied de opdracht neutraal aan, zodat mijn gedrag de respons niet stuurt.',
      source: 'Fictieve toetscoach'
    },
    {
      id: 'error',
      title: 'Eigen fout verantwoorden',
      coach: 'Benoem concreet wat gebeurde, of het respons kon beïnvloeden en wat je met de score doet.',
      script: 'Ik merk dat ik hier afweek van de exacte instructie. Daardoor kan de betrouwbaarheid van deze respons beïnvloed zijn. Ik noteer dit als afnamefout en verantwoord mijn score volgens de handleiding.',
      source: 'Fictieve toetscoach'
    }
  ]
};
