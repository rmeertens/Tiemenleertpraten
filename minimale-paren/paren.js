// Minimale paren voor module 4 logopedie, Hanze Groningen.
// Elk paar verschilt in precies één kenmerk: stem, plaats of manier.

export const PAREN = [
  // ── Stemcontrast ──────────────────────────────────────────────
  { kenmerk: "stem", contrast: ["p","b"], a: { woord: "pak",  ipa: "pɑk"   }, b: { woord: "bak",  ipa: "bɑk"   } },
  { kenmerk: "stem", contrast: ["p","b"], a: { woord: "peer", ipa: "peːr"  }, b: { woord: "beer", ipa: "beːr"  } },
  { kenmerk: "stem", contrast: ["p","b"], a: { woord: "poot", ipa: "poːt"  }, b: { woord: "boot", ipa: "boːt"  } },
  { kenmerk: "stem", contrast: ["t","d"], a: { woord: "tak",  ipa: "tɑk"   }, b: { woord: "dak",  ipa: "dɑk"   } },
  { kenmerk: "stem", contrast: ["t","d"], a: { woord: "tas",  ipa: "tɑs"   }, b: { woord: "das",  ipa: "dɑs"   } },
  { kenmerk: "stem", contrast: ["t","d"], a: { woord: "tuin", ipa: "tœyn"  }, b: { woord: "duin", ipa: "dœyn"  } },
  { kenmerk: "stem", contrast: ["f","v"], a: { woord: "fier", ipa: "fiːr"  }, b: { woord: "vier", ipa: "viːr"  } },
  { kenmerk: "stem", contrast: ["f","v"], a: { woord: "fase", ipa: "faːzə" }, b: { woord: "vase", ipa: "vaːzə" } },
  { kenmerk: "stem", contrast: ["s","z"], a: { woord: "sein", ipa: "sɛin"  }, b: { woord: "zijn", ipa: "zɛin"  } },

  // ── Plaatscontrast ────────────────────────────────────────────
  { kenmerk: "plaats", contrast: ["p","t"], a: { woord: "pak",  ipa: "pɑk"  }, b: { woord: "tak",  ipa: "tɑk"  } },
  { kenmerk: "plaats", contrast: ["p","t"], a: { woord: "pas",  ipa: "pɑs"  }, b: { woord: "tas",  ipa: "tɑs"  } },
  { kenmerk: "plaats", contrast: ["t","k"], a: { woord: "top",  ipa: "tɔp"  }, b: { woord: "kop",  ipa: "kɔp"  } },
  { kenmerk: "plaats", contrast: ["p","k"], a: { woord: "pal",  ipa: "pɑl"  }, b: { woord: "kal",  ipa: "kɑl"  } },
  { kenmerk: "plaats", contrast: ["m","n"], a: { woord: "mat",  ipa: "mɑt"  }, b: { woord: "nat",  ipa: "nɑt"  } },
  { kenmerk: "plaats", contrast: ["m","n"], a: { woord: "moot", ipa: "moːt" }, b: { woord: "noot", ipa: "noːt" } },
  { kenmerk: "plaats", contrast: ["b","d"], a: { woord: "bok",  ipa: "bɔk"  }, b: { woord: "dok",  ipa: "dɔk"  } },

  // ── Maniercontrast ────────────────────────────────────────────
  { kenmerk: "manier", contrast: ["b","m"], a: { woord: "beer", ipa: "beːr" }, b: { woord: "meer", ipa: "meːr" } },
  { kenmerk: "manier", contrast: ["b","m"], a: { woord: "bol",  ipa: "bɔl"  }, b: { woord: "mol",  ipa: "mɔl"  } },
  { kenmerk: "manier", contrast: ["b","m"], a: { woord: "baar", ipa: "baːr" }, b: { woord: "maar", ipa: "maːr" } },
  { kenmerk: "manier", contrast: ["d","z"], a: { woord: "dak",  ipa: "dɑk"  }, b: { woord: "zak",  ipa: "zɑk"  } },
  { kenmerk: "manier", contrast: ["d","z"], a: { woord: "dal",  ipa: "dɑl"  }, b: { woord: "zal",  ipa: "zɑl"  } },
  { kenmerk: "manier", contrast: ["d","n"], a: { woord: "dat",  ipa: "dɑt"  }, b: { woord: "nat",  ipa: "nɑt"  } },
  { kenmerk: "manier", contrast: ["t","s"], a: { woord: "top",  ipa: "tɔp"  }, b: { woord: "sop",  ipa: "sɔp"  } },
];
