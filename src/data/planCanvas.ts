// src/data/planCanvas.ts
export type Cell =
  | string
  | { type: "label"; text: string; w?: number };

export type PositionedMatrix = {
  type: "matrix";
  x: number;      // colonne (1 = gauche)
  y: number;      // ligne (1 = haut)
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

const seq = (prefix: string, from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${from + i}`);

// ===== PLAN (validé UX) =====
export const PLAN_ITEMS: PlanItem[] = [
  // BUVETTE collée en haut (de J à G)
  { type: "label", x: 7, y: 2, w: 6, text: "BUVETTE" },

  // Accès riverains + K2 / K1 (2 cases) au-dessus de A
  { type: "label",  x: 2, y: 18, w: 2, text: "accès riverains" },
  { type: "matrix", x: 4, y: 18, columns: [[ "K2" ]] },
  { type: "matrix", x: 5, y: 18, columns: [[ "K1" ]] },

  // Haut du plan (alignés)
  { type: "matrix", x: 7,  y: 5, columns: [seq("J", 1, 12)] },
  { type: "matrix", x: 8,  y: 5, columns: [seq("I", 1, 12)] },
  { type: "matrix", x: 11, y: 5, columns: [seq("H", 1, 13)] },
  { type: "matrix", x: 12, y: 5, columns: [seq("G", 1, 13)] },

  // F en trois segments + STATUE non cliquable entre F14 et F15
  { type: "matrix", x: 15, y: 11, columns: [seq("F", 1, 14)] },
  { type: "label",  x: 16, y: 25, w: 1, text: "STATUE" }, // visuel entre F14 et F15
  { type: "matrix", x: 15, y: 26, columns: [seq("F", 15, 17)] },
  { type: "matrix", x: 15, y: 35, columns: [seq("F", 18, 22)] },

  // Bas du plan
  { type: "matrix", x: 3,  y: 20, columns: [seq("A", 1, 25)] },
  { type: "matrix", x: 7,  y: 20, columns: [seq("B", 1, 25)] },
  { type: "matrix", x: 8,  y: 20, columns: [seq("C", 1, 25)] },
  { type: "matrix", x: 11, y: 20, columns: [seq("D", 1, 25)] },
  { type: "matrix", x: 12, y: 20, columns: [seq("E", 1, 25)] },
];
