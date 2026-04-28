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
  { ipa: "p",  voorbeeld: "pap",     plaats: "bilabiaal",        manier: "explosief",  stem: false, audio: "con-p.m4a" },
  { ipa: "b",  voorbeeld: "beer",    plaats: "bilabiaal",        manier: "explosief",  stem: true,  audio: "con-b.m4a" },
  { ipa: "m",  voorbeeld: "mama",    plaats: "bilabiaal",        manier: "nasaal",     stem: true,  audio: "con-m.m4a" },
  { ipa: "f",  voorbeeld: "fiets",   plaats: "labiodentaal",     manier: "fricatief",  stem: false, audio: "con-f.m4a" },
  { ipa: "v",  voorbeeld: "varken",  plaats: "labiodentaal",     manier: "fricatief",  stem: true,  audio: "con-v.m4a" },
  { ipa: "t",  voorbeeld: "tak",     plaats: "alveolair",        manier: "explosief",  stem: false, audio: "con-t.m4a" },
  { ipa: "d",  voorbeeld: "dak",     plaats: "alveolair",        manier: "explosief",  stem: true,  audio: "con-d.m4a" },
  { ipa: "n",  voorbeeld: "neus",    plaats: "alveolair",        manier: "nasaal",     stem: true,  audio: "con-n.m4a" },
  { ipa: "s",  voorbeeld: "sok",     plaats: "alveolair",        manier: "fricatief",  stem: false, audio: "con-s.m4a" },
  { ipa: "z",  voorbeeld: "zon",     plaats: "alveolair",        manier: "fricatief",  stem: true,  audio: "con-z.m4a" },
  { ipa: "l",  voorbeeld: "lepel",   plaats: "alveolair",        manier: "lateraal",   stem: true,  audio: "con-l.m4a" },
  { ipa: "r",  voorbeeld: "rood",    plaats: "alveolair",        manier: "triller",    stem: true,  audio: "con-r.m4a" },
  { ipa: "ʃ",  voorbeeld: "sjaal",   plaats: "palato-alveolair", manier: "fricatief",  stem: false, audio: "con-sh.m4a" },
  { ipa: "ʒ",  voorbeeld: "garage",  plaats: "palato-alveolair", manier: "fricatief",  stem: true,  audio: "con-zh.m4a" },
  { ipa: "j",  voorbeeld: "jas",     plaats: "palataal",         manier: "halfvocaal", stem: true,  audio: "con-j.m4a" },
  { ipa: "k",  voorbeeld: "koek",    plaats: "velair",           manier: "explosief",  stem: false, audio: "con-k.m4a" },
  { ipa: "g",  voorbeeld: "goal",    plaats: "velair",           manier: "explosief",  stem: true,  audio: "con-g.m4a" },
  { ipa: "ŋ",  voorbeeld: "slang",   plaats: "velair",           manier: "nasaal",     stem: true,  audio: "con-ng.m4a" },
  { ipa: "x",  voorbeeld: "lach",    plaats: "velair",           manier: "fricatief",  stem: false, audio: "con-x.m4a" },
  { ipa: "ɣ",  voorbeeld: "regen",   plaats: "velair",           manier: "fricatief",  stem: true,  audio: "con-gamma.m4a" },
  { ipa: "h",  voorbeeld: "huis",    plaats: "glottaal",         manier: "fricatief",  stem: false, audio: "con-h.m4a" },
  { ipa: "w",  voorbeeld: "wolk",    plaats: "labiodentaal",     manier: "halfvocaal", stem: true,  audio: "con-w.m4a" },
];

// Voor klinkers vatten we plaats/manier/stem op als tongpositie/mondopening/lipronding,
// maar tonen we ze in dezelfde drie-knoppen-structuur zodat de student één framework leert.
export const KLINKER_TONG = ["voor", "midden", "achter"];
export const KLINKER_OPENING = ["gesloten", "half-gesloten", "half-open", "open"];
export const KLINKER_ROND = ["gerond", "ongerond"];

export const KLINKERS = [
  { ipa: "a",  voorbeeld: "maan",  tong: "achter", opening: "open",          rond: false, audio: "kli-a.m4a" },
  { ipa: "ɑ",  voorbeeld: "man",   tong: "achter", opening: "half-open",     rond: false, audio: "kli-aa.m4a" },
  { ipa: "i",  voorbeeld: "mier",  tong: "voor",   opening: "gesloten",      rond: false, audio: "kli-i.m4a" },
  { ipa: "e",  voorbeeld: "been",  tong: "voor",   opening: "half-gesloten", rond: false, audio: "kli-e.m4a" },
  { ipa: "ɛ",  voorbeeld: "bel",   tong: "voor",   opening: "half-open",     rond: false, audio: "kli-eh.m4a" },
  { ipa: "y",  voorbeeld: "muur",  tong: "voor",   opening: "gesloten",      rond: true,  audio: "kli-y.m4a" },
  { ipa: "ø",  voorbeeld: "neus",  tong: "voor",   opening: "half-gesloten", rond: true,  audio: "kli-eu.m4a" },
  { ipa: "u",  voorbeeld: "voet",  tong: "achter", opening: "gesloten",      rond: true,  audio: "kli-u.m4a" },
  { ipa: "o",  voorbeeld: "boom",  tong: "achter", opening: "half-gesloten", rond: true,  audio: "kli-o.m4a" },
  { ipa: "ə",  voorbeeld: "de",    tong: "midden", opening: "half-open",     rond: false, audio: "kli-schwa.m4a" },
];

export const DIFTONGEN = [
  { ipa: "ɛi", voorbeeld: "ijs",   audio: "dif-ei.m4a" },
  { ipa: "œy", voorbeeld: "huis",  audio: "dif-ui.m4a" },
  { ipa: "ɑu", voorbeeld: "blauw", audio: "dif-au.m4a" },
];
