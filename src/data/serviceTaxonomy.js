// Single source of truth for the service category tree.
// Used by the admin upload chips, the public sidebar, and CSV validation.

export const CATEGORIES = [
  { id: "hiv",  label: "HIV Prevention", subs: [
    { id: "oral", label: "Oral PrEP" },
    { id: "pep",  label: "PEP" },
    { id: "inj",  label: "Injectable PrEP" },
  ]},
  { id: "clin", label: "Clinics & Hospitals", subs: [] },
  { id: "svs",  label: "Sexual Violence Support", subs: [] },
  { id: "edu",  label: "Educational Institutions", subs: [] },
  { id: "supp", label: "Get Support", subs: [
    { id: "kids",  label: "For kids" },
    { id: "youth", label: "For young people" },
    { id: "dis",   label: "For differently abled people" },
    { id: "faith", label: "From faith-based organisations" },
    { id: "plhiv", label: "For people living with HIV" },
    { id: "home",  label: "Home-based care" },
  ]},
  { id: "fp", label: "Family Planning", subs: [
    { id: "contra", label: "Contraception" },
    { id: "ec",     label: "Emergency contraception" },
  ]},
];

export const VALID_SERVICES = new Set(
  CATEGORIES.flatMap(c => [c.id, ...c.subs.map(s => s.id)])
);

export const PARENT_OF = Object.fromEntries(
  CATEGORIES.flatMap(c => c.subs.map(s => [s.id, c.id]))
);

export const LABEL_OF = Object.fromEntries(
  CATEGORIES.flatMap(c => [[c.id, c.label], ...c.subs.map(s => [s.id, s.label])])
);
