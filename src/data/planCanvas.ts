// src/data/planCanvas.ts
export type Cell =
  | string
  | { type: "label"; text: string; w?: number };

export type PositionedMatrix = {
  type: "matrix";
  title?: string;
  x: number; // colonne (1 = le plus à gauche)
  y: number; // ligne (1 = le plus haut)
  columns: Cell[][]; // colonnes verticales haut→bas
};

export type PositionedLabel = {
  type: "label";
  x: number;
  y: number;
  w: number; // largeur en cases
  text: string;
};

export type PlanItem = PositionedMatrix | PositionedLabel;

const seq = (prefix: string, from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${from + i}`);

// ===== PLAN VALIDÉ =====
export const PLAN_ITEMS: PlanItem[] = [
  // BU VETTE (bandeau)
  { type: "label", x: 13, y: 5, w: 12, text: "BUVETTE" },

  // Bloc J / I (2 colonnes)
  { type: "matrix", title: "Bloc J / I", x: 12, y: 9, columns: [seq("J",1,12), seq("I",1,12)] },

  // Bloc H / G (2 colonnes)
  { type: "matrix", title: "Bloc H / G", x: 20, y: 9, columns: [seq("H",1,13), seq("G",1,13)] },

  // Colonne F
  { type: "matrix", title: "F", x: 27, y: 9, columns: [seq("F",1,17)] },

  // Accès riverains + K2 / K1 (K1/K2 = vraies cases)
  { type: "label",  x: 2,  y: 18, w: 8, text: "accès riverains" },
  { type: "matrix", x: 11, y: 18, columns: [[ "K2" ]] },
  { type: "matrix", x: 13, y: 18, columns: [[ "K1" ]] },

  // Colonne A
  { type: "matrix", title: "A", x: 2, y: 22, columns: [seq("A",1,26)] },

  // Bloc B / C (2 colonnes)
  { type: "matrix", title: "Bloc B / C", x: 13, y: 23, columns: [seq("B",1,26), seq("C",1,26)] },

  // Bloc D / E (2 colonnes)
  { type: "matrix", title: "Bloc D / E", x: 22, y: 23, columns: [seq("D",1,26), seq("E",1,26)] },

  // Bandeau "HOMME DE FER"
  { type: "label", x: 27, y: 31, w: 7, text: "HOMME DE FER" },

  // Bloc R
  { type: "matrix", title: "R", x: 29, y: 40, columns: [seq("R",1,7)] },
];
