// IPA-inventaris zoals gehanteerd in module 4 (Spraak-Taal 2),
// eerstejaars deeltijd logopedie Hanze Groningen.
// Bron: NotebookLM-rapport prompt 2, gebaseerd op cursusmateriaal.

export const PLAATSEN = [
  "bilabiaal",
  "labiodentaal",
  "alveolair",
  "palato-alveolair",
  "palataal",
  "velair",
  "uvulair",
  "glottaal",
];

export const MANIEREN = [
  "explosief",
  "fricatief",
  "nasaal",
  "lateraal",
  "triller",
  "halfvocaal",
];

export const STEM = ["stemhebbend", "stemloos"];

// audio: bestandsnaam in /audio/. Wordt later door Tiemen ingesproken.
export const CONSONANTEN = [
  { ipa: "p",  voorbeeld: "pap",     plaats: "bilabiaal",        manier: "explosief",  stem: false, audio: "con-p.mp3" },
  { ipa: "b",  voorbeeld: "beer",    plaats: "bilabiaal",        manier: "explosief",  stem: true,  audio: "con-b.mp3" },
  { ipa: "m",  voorbeeld: "mama",    plaats: "bilabiaal",        manier: "nasaal",     stem: true,  audio: "con-m.mp3" },
  { ipa: "f",  voorbeeld: "fiets",   plaats: "labiodentaal",     manier: "fricatief",  stem: false, audio: "con-f.mp3" },
  { ipa: "v",  voorbeeld: "varken",  plaats: "labiodentaal",     manier: "fricatief",  stem: true,  audio: "con-v.mp3" },
  { ipa: "t",  voorbeeld: "tak",     plaats: "alveolair",        manier: "explosief",  stem: false, audio: "con-t.mp3" },
  { ipa: "d",  voorbeeld: "dak",     plaats: "alveolair",        manier: "explosief",  stem: true,  audio: "con-d.mp3" },
  { ipa: "n",  voorbeeld: "neus",    plaats: "alveolair",        manier: "nasaal",     stem: true,  audio: "con-n.mp3" },
  { ipa: "s",  voorbeeld: "sok",     plaats: "alveolair",        manier: "fricatief",  stem: false, audio: "con-s.mp3" },
  { ipa: "z",  voorbeeld: "zon",     plaats: "alveolair",        manier: "fricatief",  stem: true,  audio: "con-z.mp3" },
  { ipa: "l",  voorbeeld: "lepel",   plaats: "alveolair",        manier: "lateraal",   stem: true,  audio: "con-l.mp3" },
  { ipa: "r",  voorbeeld: "rood",    plaats: "alveolair",        manier: "triller",    stem: true,  audio: "con-r.mp3" },
  { ipa: "ʃ",  voorbeeld: "sjaal",   plaats: "palato-alveolair", manier: "fricatief",  stem: false, audio: "con-sh.mp3" },
  { ipa: "ʒ",  voorbeeld: "garage",  plaats: "palato-alveolair", manier: "fricatief",  stem: true,  audio: "con-zh.mp3" },
  { ipa: "j",  voorbeeld: "jas",     plaats: "palataal",         manier: "halfvocaal", stem: true,  audio: "con-j.mp3" },
  { ipa: "k",  voorbeeld: "koek",    plaats: "velair",           manier: "explosief",  stem: false, audio: "con-k.mp3" },
  { ipa: "g",  voorbeeld: "goal",    plaats: "velair",           manier: "explosief",  stem: true,  audio: "con-g.mp3" },
  { ipa: "ŋ",  voorbeeld: "slang",   plaats: "velair",           manier: "nasaal",     stem: true,  audio: "con-ng.mp3" },
  { ipa: "x",  voorbeeld: "lach",    plaats: "velair",           manier: "fricatief",  stem: false, audio: "con-x.mp3" },
  { ipa: "ɣ",  voorbeeld: "regen",   plaats: "velair",           manier: "fricatief",  stem: true,  audio: "con-gamma.mp3" },
  { ipa: "h",  voorbeeld: "huis",    plaats: "glottaal",         manier: "fricatief",  stem: false, audio: "con-h.mp3" },
  { ipa: "w",  voorbeeld: "wolk",    plaats: "labiodentaal",     manier: "halfvocaal", stem: true,  audio: "con-w.mp3" },
];

// Voor klinkers vatten we plaats/manier/stem op als tongpositie/mondopening/lipronding,
// maar tonen we ze in dezelfde drie-knoppen-structuur zodat de student één framework leert.
export const KLINKER_TONG = ["voor", "midden", "achter"];
export const KLINKER_OPENING = ["gesloten", "half-gesloten", "half-open", "open"];
export const KLINKER_ROND = ["gerond", "ongerond"];

export const KLINKERS = [
  { ipa: "a",  voorbeeld: "maan",  tong: "achter", opening: "open",          rond: false, audio: "kli-a.mp3" },
  { ipa: "ɑ",  voorbeeld: "man",   tong: "achter", opening: "half-open",     rond: false, audio: "kli-aa.mp3" },
  { ipa: "i",  voorbeeld: "mier",  tong: "voor",   opening: "gesloten",      rond: false, audio: "kli-i.mp3" },
  { ipa: "e",  voorbeeld: "been",  tong: "voor",   opening: "half-gesloten", rond: false, audio: "kli-e.mp3" },
  { ipa: "ɛ",  voorbeeld: "bel",   tong: "voor",   opening: "half-open",     rond: false, audio: "kli-eh.mp3" },
  { ipa: "y",  voorbeeld: "muur",  tong: "voor",   opening: "gesloten",      rond: true,  audio: "kli-y.mp3" },
  { ipa: "ø",  voorbeeld: "neus",  tong: "voor",   opening: "half-gesloten", rond: true,  audio: "kli-eu.mp3" },
  { ipa: "u",  voorbeeld: "voet",  tong: "achter", opening: "gesloten",      rond: true,  audio: "kli-u.mp3" },
  { ipa: "o",  voorbeeld: "boom",  tong: "achter", opening: "half-gesloten", rond: true,  audio: "kli-o.mp3" },
  { ipa: "ə",  voorbeeld: "de",    tong: "midden", opening: "half-open",     rond: false, audio: "kli-schwa.mp3" },
];

export const DIFTONGEN = [
  { ipa: "ɛi", voorbeeld: "ijs",   audio: "dif-ei.mp3" },
  { ipa: "œy", voorbeeld: "huis",  audio: "dif-ui.mp3" },
  { ipa: "ɑu", voorbeeld: "blauw", audio: "dif-au.mp3" },
];
