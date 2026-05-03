# Tiemen Leert Praten

Tools voor logopediestudenten — minder ruis, meer kapstok.

Gehost als statische site op GitHub Pages: <https://tiemenleertpraten.meertens.dev>.

## Tools

- **Pak de 10** (`/pak-de-10/`) — toetsmachine voor kindcasuïstiek: casusroute, criteria-engine, kennischeck, oefenvragen, strenge feedback, mondeling trainen en toetsklaar-score.
- **Mondeling 10** (`/mondeling-10/`) — rubrictrainer voor het performance assessment Spraak-Taal: Schlichting-afname, foutverantwoording en therapiegesprek.
- **IPA Studio** (`/ipa-studio/`) — IPA-trainer voor module 4 (Spraak-Taal 2), eerstejaars deeltijd logopedie Hanze Groningen. Twee modi:
  - **De Kaart** — klikbaar IPA-rooster met audio en de drie kenmerken (plaats / manier / stem).
  - **Drie Knoppen** — drillmodus met Leitner-spaced-repetition.
- **Spraak Splitter** (`/spraak-splitter/`) — deelt woorden en korte zinnen op in lettergrepen, klankgroepen, clusters en oefenstappen.
- **Studiecoach** (`/studiecoach/`) — AI-coach voor Schlichting Taalbegrip-3 en Zinsontwikkeling met eigen Anthropic API-sleutel.

## Lokaal draaien

Geen build-step. Serveer de root-map met een statische server (modules vereisen HTTP, niet `file://`):

```sh
python3 -m http.server 8000
```

Open dan <http://localhost:8000>.

## Audio toevoegen

Zie [`ipa-studio/audio/README.md`](ipa-studio/audio/README.md) voor de inspreeklijst.

## Studiemateriaal

Boekscans, college­transcripties en NotebookLM-rapporten **niet** in deze repo committen — staat al in `.gitignore` onder `materials/` en `*.pdf`.
