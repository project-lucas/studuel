// Le registre des banques de questions des jeux de salon : id du jeu → builder
// de pool. Vit dans lib/ (pur, sans dépendance serveur) pour que la page
// /defi/jeux/[jeu] ne fasse qu'orchestrer, et surtout pour que la cohérence
// « tout jeu implémenté a bien un builder » soit TESTABLE (pools.test.ts).
import type { ModeQuestion } from '@/lib/defi-modes'
import { buildCapitalesPool } from '@/lib/jeux/capitales'
import { buildOrthographePool } from '@/lib/jeux/orthographe'
import { buildConjugaisonPool } from '@/lib/jeux/conjugaison-eclair'
import { buildChasseFautePool } from '@/lib/jeux/chasse-faute'
import { buildCalculMentalPool } from '@/lib/jeux/calcul-mental'
import { buildSuiteLogiquePool } from '@/lib/jeux/suite-logique'
import { buildTraductionFlashPool } from '@/lib/jeux/traduction-flash'
import { buildFauxAmisPool } from '@/lib/jeux/faux-amis'
import { buildTraduccionFlashPool } from '@/lib/jeux/traduccion-flash'
import { buildFalsosAmigosPool } from '@/lib/jeux/falsos-amigos'
import { buildClasseMoiCaPool } from '@/lib/jeux/classe-moi-ca'
import { buildChasseElementsPool } from '@/lib/jeux/chasse-elements'
import { buildBonneUnitePool } from '@/lib/jeux/bonne-unite'

// Chaque id doit être marqué `implemented: true` dans le catalogue ET présent
// ici. La divergence est bloquée par pools.test.ts (aucun jeu jouable sans
// banque, aucune banque orpheline).
export const POOL_BUILDERS: Record<string, (seed: string) => ModeQuestion[]> = {
  capitales: (seed) => buildCapitalesPool(seed),
  orthographe: (seed) => buildOrthographePool(seed),
  'conjugaison-eclair': (seed) => buildConjugaisonPool(seed),
  'chasse-faute': (seed) => buildChasseFautePool(seed),
  'calcul-mental': (seed) => buildCalculMentalPool(seed),
  'suite-logique': (seed) => buildSuiteLogiquePool(seed),
  'traduction-flash': (seed) => buildTraductionFlashPool(seed),
  'faux-amis': (seed) => buildFauxAmisPool(seed),
  'traduccion-flash': (seed) => buildTraduccionFlashPool(seed),
  'falsos-amigos': (seed) => buildFalsosAmigosPool(seed),
  'classe-moi-ca': (seed) => buildClasseMoiCaPool(seed),
  'chasse-elements': (seed) => buildChasseElementsPool(seed),
  'bonne-unite': (seed) => buildBonneUnitePool(seed),
}

// Le pool d'un jeu par id, ou null si aucune banque n'est enregistrée.
export function buildSalonPool(id: string, seed: string): ModeQuestion[] | null {
  const builder = POOL_BUILDERS[id]
  return builder ? builder(seed) : null
}
