export type Cell =
  | string
  | { type: "label"; text: string; w?: number };

export type PositionedMatrix = {
  type: "matrix";
  x: number;      // colonne de départ
  y: number;      // ligne de départ
  columns: Cell[][]; // colonnes verticales, haut → bas
};

export type PositionedLabel = {
  type: "label";
  x: number;
  y: number;
  w: number;      // largeur en cases
  text: string;   // décoratif (non cliquable)
};

export type PlanItem = PositionedMatrix | PositionedLabel;

// Utilitaire : ["A1", "A2", ..., "A26"]
const seq = (prefix: string, from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${from + i}`);

// =============================== PLAN ===============================
export const PLAN_ITEMS: PlanItem[] = [
  // --- BUVETTE (collée en haut, de J à G) ---------------------------
  { type: "label", x: 7, y: 2, w: 6, text: "BUVETTE" },

  // --- Accès riverains + K2/K1 (ligne d’axe visuelle) ---------------
  { type: "label",  x: 2, y: 18, w: 2, text: "Escalier" },
  { type: "matrix", x: 4, y: 18, columns: [[ "K2" ]] },
  { type: "matrix", x: 5, y: 18, columns: [[ "K1" ]] },

  // --- Haut du plan -------------------------------------------------
  // J/I alignés verticalement avec H/G (y=9)
  { type: "matrix", x: 7,  y: 5, columns: [seq("J", 1, 12)] },
  { type: "matrix", x: 8,  y: 5, columns: [seq("I", 1, 12)] },

  // H/G (inchangés en x, y=9)
  { type: "matrix", x: 11, y: 5, columns: [seq("H", 1, 13)] },
  { type: "matrix", x: 12, y: 5, columns: [seq("G", 1, 13)] },

  // F : F1 en face de G7 -> y=15
  { type: "matrix", x: 15, y: 11, columns: [seq("F", 1, 14)] },
  { type: "matrix", x: 15, y: 26, columns: [seq("F", 15, 17)] },
  { type: "matrix", x: 15, y: 35, columns: [seq("F", 18, 22)] },

  // STATUE non cliquable entre F14 et F15 (avec F démarrant à y=15 => F14 à y=28)
  { type: "label",  x: 15, y: 25, w: 2, text: "STATUE" },

  // --- Bas du plan (2 cases d’écart sous la “ligne haut”) ----------
  { type: "matrix", x: 3,  y: 20, columns: [seq("A", 1, 25)] }, // colonne A

  // B/C alignés sous J/I
  { type: "matrix", x: 7,  y: 20, columns: [seq("B", 1, 25)] },
  { type: "matrix", x: 8,  y: 20, columns: [seq("C", 1, 25)] },

  // D/E alignés sous H/G
  { type: "matrix", x: 11, y: 20, columns: [seq("D", 1, 25)] },
  { type: "matrix", x: 12, y: 20, columns: [seq("E", 1, 25)] },

  // (F18 spécial : on l’ajustera après si besoin d’un alignement précis vs E16)
  // { type: "matrix", x: 21, y: 32, columns: [[ "F18" ]] },
];
// ===================================================================
