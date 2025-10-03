// --- TYPES ---
export type Cell =
  | string
  | { type: "label"; text: string }
  | { type: "blocked"; text: string }
  | { type: "spacer" };

export type PlanColumn = Cell[];
export type PlanBlock = {
  title?: string;
  columns: PlanColumn[];
  minWidth?: number;
  offset?: number; // << décalage horizontal en "cellules"
};

// --- PLAN organisé en rangées ---
export const PLAN_ROWS: PlanBlock[][] = [
  // RANGÉE 1 (haut)
  [
    { title: "Comité", offset: 0, columns: [
      [{ type: "blocked", text: "Comité 1" }],
      [{ type: "blocked", text: "Comité 2" }],
      [{ type: "blocked", text: "Comité 3" }],
      [{ type: "blocked", text: "Comité 4" }],
      [{ type: "blocked", text: "Comité 5" }],
    ]},
    { title: "BUVETTE", offset: 6, columns: [[{ type: "label", text: "BUVETTE" }]], minWidth: 6 * 48 },
    { title: "Bloc J / I", offset: 14, columns: [
      ["J1","J2","J3","J4","J5","J6","J7","J8","J9","J10","J11","J12"],
      ["I1","I2","I3","I4","I5","I6","I7","I8","I9","I10","I11","I12"],
    ]},
    { title: "Bloc H / G", offset: 19, columns: [
      ["H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12"],
      ["G1","G2","G3","G4","G5","G6","G7","G8","G9","G10","G11","G12"],
    ]},
    { title: "F", offset: 26, minWidth: 2*48, columns: [
      ["F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","F13","F14","F15","F16","F17"],
    ]},
  ],

  // RANGÉE 2 (centre : B, C, D)
  [
    { title: "Bloc B", offset: 6, columns: [
      ["B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","B14","B15","B16","B17","B18","B19","B20","B21","B22","B23","B24","B25","B26"],
    ]},
    { title: "Bloc C", offset: 13, columns: [
      ["C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11","C12","C13","C14","C15","C16","C17","C18","C19","C20","C21","C22","C23","C24","C25","C26"],
    ]},
    { title: "Bloc D", offset: 20, columns: [
      ["D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","D11","D12","D13","D14","D15","D16","D17","D18","D19","D20","D21","D22","D23","D24","D25","D26"],
    ]},
  ],

  // RANGÉE 3 (droite basse : Homme de Fer + R)
  [
    { title: "HOMME DE FER", offset: 24, columns: [
      [{ type: "blocked", text: "HOMME DE FER" }],
    ]},
    { title: "R", offset: 28, columns: [
      ["R1","R2","R3","R4","R5","R6","R7","R8","R9","R10"],
    ]},
  ],
];
