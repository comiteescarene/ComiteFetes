// src/data/planLayout.ts
export type Cell =
  | string
  | { type: "label"; text: string }
  | { type: "blocked"; text: string }
  | { type: "spacer" };

export type PlanColumn = Cell[];
export type PlanBlock = { title?: string; columns: PlanColumn[]; minWidth?: number };

// Petit utilitaire pour générer une séquence (ex: seq("B",1,26) => ["B1",...,"B26"])
const seq = (prefix: string, from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${from + i}`);

// ⚠️ C’est ICI que tu mets ton plan : rangées → blocs → colonnes → cellules
export const PLAN_ROWS: PlanBlock[][] = [
  // ===== Rangée HAUTE =====
  [
    {
      title: "Comités",
      columns: [
        [{ type: "blocked", text: "Comité 1" }],
        [{ type: "blocked", text: "Comité 2" }],
        [{ type: "blocked", text: "Comité 3" }],
        [{ type: "blocked", text: "Comité 4" }],
        [{ type: "blocked", text: "Comité 5" }],
      ],
      minWidth: 260,
    },
    {
      title: "BUVETTE",
      columns: [[{ type: "label", text: "BUVETTE" }]],
      minWidth: 380,
    },
    {
      title: "Bloc J / I",
      columns: [
        seq("J", 1, 12), // ⬅️ adapte si J a plus/moins de cases
        seq("I", 1, 12),
      ],
      minWidth: 170,
    },
    {
      title: "Bloc H / G",
      columns: [seq("H", 1, 12), seq("G", 1, 12)],
      minWidth: 170,
    },
    {
      title: "F",
      columns: [seq("F", 1, 17)],
      minWidth: 90,
    },
  ],

  // ===== Rangée CENTRALE =====
  [
    {
      title: "Bloc B / C",
      columns: [seq("B", 1, 26), seq("C", 1, 26)],
      minWidth: 180,
    },
    {
      title: "Bloc D / E",
      columns: [seq("D", 1, 26), seq("E", 1, 26)],
      minWidth: 180,
    },
    // 👉 Ajoute ici un autre bloc central si besoin
  ],

  // ===== Rangée BAS DROITE =====
  [
    {
      title: "HOMME DE FER",
      columns: [[{ type: "blocked", text: "HOMME DE FER" }]],
      minWidth: 160,
    },
    {
      title: "R",
      columns: [seq("R", 1, 10)],
      minWidth: 90,
    },
  ],
];
