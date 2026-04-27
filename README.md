# Tiemen Leert Praten

Tools voor logopediestudenten — minder ruis, meer kapstok.

Gehost als statische site op GitHub Pages: <https://tiemenleertpraten.meertens.dev>.

## Tools

- **IPA Studio** (`/ipa-studio/`) — IPA-trainer voor module 4 (Spraak-Taal 2), eerstejaars deeltijd logopedie Hanze Groningen. Twee modi:
  - **De Kaart** — klikbaar IPA-rooster met audio en de drie kenmerken (plaats / manier / stem).
  - **Drie Knoppen** — drillmodus met Leitner-spaced-repetition.

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
