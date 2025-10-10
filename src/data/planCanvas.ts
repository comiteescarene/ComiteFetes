// src/data/planCanvas.ts
// Affichage "plan exact" : chaque bloc est positionné en coordonnées de grille (x,y)
// 1 case = une "place" en largeur et en hauteur (mais tu peux changer la taille visuelle dans le composant)

export type Cell =
  | string
  | { type: "label"; text: string; w?: number } // label horizontal
  ;

export type PositionedMatrix = {
  type: "matrix";
  title?: string;
  x: number; // colonne de départ (1 = le plus à gauche)
  y: number; // ligne de départ (1 = le plus haut)
  columns: Cell[][]; // colonnes verticales (chaque colonne contient des "Cell" en haut->bas)
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

// ====== PLAN INITIAL (ajuste X/Y/W facilement pour coller exactement à ton dessin) ======
export const PLAN_ITEMS: PlanItem[] = [
  // --- Buvette (bandeau central haut) ---
  { type: "label", x: 13, y: 5, w: 12, text: "BUVETTE" },

  // --- Bloc J / I (2 colonnes) ---  ⬅️ décalé à droite pour libérer K1/K2
  {
    type: "matrix",
    title: "Bloc J / I",
    x: 12, y: 9,                         // <- AVANT x:10 ; maintenant x:12
    columns: [seq("J", 1, 12), seq("I", 1, 12)],
  },

  // --- Bloc H / G (2 colonnes) ---
  {
    type: "matrix",
    title: "Bloc H / G",
    x: 20, y: 9,                         // <- un peu plus à droite pour aérer
    columns: [seq("H", 1, 13), seq("G", 1, 13)],
  },

  // --- Colonne F à droite ---
  {
    type: "matrix",
    title: "F",
    x: 27, y: 9,                         // <- à droite du bloc H/G
    columns: [seq("F", 1, 17)],
  },

  // --- Accès riverains + K2/K1 (K1/K2 = vraies cases) ---
  { type: "label",  x: 2,  y: 18, w: 8, text: "accès riverains" },
  { type: "matrix", x: 11, y: 18, columns: [[ "K2" ]] },  // K2 = 1 case
  { type: "matrix", x: 13, y: 18, columns: [[ "K1" ]] },  // K1 = 1 case

  // --- Colonne A à gauche ---
  {
    type: "matrix",
    title: "A",
    x: 2, y: 22,
    columns: [seq("A", 1, 26)],
  },

  // --- Bloc B / C (2 colonnes) ---
  {
    type: "matrix",
    title: "Bloc B / C",
    x: 13, y: 23,
    columns: [seq("B", 1, 26), seq("C", 1, 26)],
  },

  // --- Bloc D / E (2 colonnes) ---
  {
    type: "matrix",
    title: "Bloc D / E",
    x: 22, y: 23,
    columns: [seq("D", 1, 26), seq("E", 1, 26)],
  },

  // --- "Homme de Fer" (bandeau sous F) ---
  { type: "label", x: 27, y: 31, w: 7, text: "HOMME DE FER" },
  //                         ^  ^      ^
  //   décale de +1/-1 si besoin :  x→droite/gauche, y→bas/haut, w=largeur

  // --- Petit bloc R tout en bas à droite ---
  {
    type: "matrix",
    title: "R",
    x: 29, y: 40,
    columns: [seq("R", 1, 7)],
  },
];
