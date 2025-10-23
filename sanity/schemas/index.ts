// sanity/schemas/index.ts
import home from './types/home'
import post from './types/post'
import infoTile from './types/infoTile'
import marketMap from './types/marketMap'   // ou plan
import reservation from './types/reservation'
import event from './types/events'           // <-- AJOUT

// Ce tableau doit contenir TOUS les types utilisés par le studio
export const schemaTypes = [
  home,
  post,
  infoTile,
  marketMap,     // ou plan
  reservation,
  event,         // <-- AJOUT
]

// (s'il y a un export default, garde-le cohérent également)
export default schemaTypes
