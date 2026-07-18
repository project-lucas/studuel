// Classe-moi ça — la banque du salon SVT.
// Un animal s'affiche : à quelle classe appartient-il ? Les leurres sont les
// autres classes (mammifère, oiseau, reptile, amphibien, poisson, insecte).
// Le sel du jeu : les pièges (le dauphin est un mammifère, pas un poisson ;
// le manchot est un oiseau…). Générateur déterministe.
import { seededRng, type ModeQuestion } from '@/lib/defi-modes'
import { pickDistinct, shuffleWith } from '@/lib/jeux/shuffle'

export type AnimalClass =
  | 'Mammifère'
  | 'Oiseau'
  | 'Reptile'
  | 'Amphibien'
  | 'Poisson'
  | 'Insecte'

const CLASSES: AnimalClass[] = [
  'Mammifère',
  'Oiseau',
  'Reptile',
  'Amphibien',
  'Poisson',
  'Insecte',
]

export type Critter = {
  id: string
  name: string
  emoji: string
  klass: AnimalClass
  tip: string
}

export const CRITTERS: Critter[] = [
  { id: 'dauphin', name: 'dauphin', emoji: '🐬', klass: 'Mammifère', tip: 'Le dauphin allaite ses petits : c’est un mammifère marin, pas un poisson.' },
  { id: 'chauve-souris', name: 'chauve-souris', emoji: '🦇', klass: 'Mammifère', tip: 'Elle vole, mais elle allaite : c’est le seul mammifère volant.' },
  { id: 'baleine', name: 'baleine', emoji: '🐋', klass: 'Mammifère', tip: 'La baleine respire à l’air libre et allaite : un mammifère.' },
  { id: 'kangourou', name: 'kangourou', emoji: '🦘', klass: 'Mammifère', tip: 'Le kangourou porte son petit dans sa poche : un mammifère marsupial.' },
  { id: 'chien', name: 'chien', emoji: '🐕', klass: 'Mammifère', tip: 'Poils et allaitement : un mammifère.' },
  { id: 'crocodile', name: 'crocodile', emoji: '🐊', klass: 'Reptile', tip: 'Peau à écailles, œufs à coquille : un reptile.' },
  { id: 'serpent', name: 'serpent', emoji: '🐍', klass: 'Reptile', tip: 'Écailles et sang froid : un reptile.' },
  { id: 'tortue', name: 'tortue', emoji: '🐢', klass: 'Reptile', tip: 'Malgré sa carapace, la tortue est un reptile.' },
  { id: 'lezard', name: 'lézard', emoji: '🦎', klass: 'Reptile', tip: 'Écailles et pattes courtes : un reptile.' },
  { id: 'grenouille', name: 'grenouille', emoji: '🐸', klass: 'Amphibien', tip: 'Têtard dans l’eau, adulte à l’air : un amphibien.' },
  { id: 'salamandre', name: 'salamandre', emoji: '🦎', klass: 'Amphibien', tip: 'Peau nue et humide : la salamandre est un amphibien, pas un lézard.' },
  { id: 'requin', name: 'requin', emoji: '🦈', klass: 'Poisson', tip: 'Branchies et nageoires : le requin est un poisson (cartilagineux).' },
  { id: 'saumon', name: 'saumon', emoji: '🐟', klass: 'Poisson', tip: 'Branchies et écailles : un poisson.' },
  { id: 'hippocampe', name: 'hippocampe', emoji: '🐠', klass: 'Poisson', tip: 'Malgré sa forme étrange, l’hippocampe est un poisson.' },
  { id: 'aigle', name: 'aigle', emoji: '🦅', klass: 'Oiseau', tip: 'Plumes, bec, œufs : un oiseau.' },
  { id: 'manchot', name: 'manchot', emoji: '🐧', klass: 'Oiseau', tip: 'Il nage mais il a des plumes et pond des œufs : un oiseau.' },
  { id: 'autruche', name: 'autruche', emoji: '🦤', klass: 'Oiseau', tip: 'Elle ne vole pas, mais plumes et bec : un oiseau.' },
  { id: 'pigeon', name: 'pigeon', emoji: '🕊️', klass: 'Oiseau', tip: 'Plumes et bec : un oiseau.' },
  { id: 'abeille', name: 'abeille', emoji: '🐝', klass: 'Insecte', tip: 'Six pattes et trois parties du corps : un insecte.' },
  { id: 'fourmi', name: 'fourmi', emoji: '🐜', klass: 'Insecte', tip: 'Six pattes : un insecte.' },
  { id: 'coccinelle', name: 'coccinelle', emoji: '🐞', klass: 'Insecte', tip: 'Six pattes et des ailes sous les élytres : un insecte.' },
  { id: 'papillon', name: 'papillon', emoji: '🦋', klass: 'Insecte', tip: 'Chenille puis six pattes : un insecte.' },
]

export function buildClasseMoiCaPool(seed: string, count = 30): ModeQuestion[] {
  const rng = seededRng(`classe-moi-ca:${seed}`)
  const pool = shuffleWith(rng, CRITTERS).slice(0, Math.min(count, CRITTERS.length))
  return pool.map((c) => {
    const decoys = pickDistinct(
      rng,
      CLASSES.filter((k) => k !== c.klass),
      3,
    )
    const options = shuffleWith(rng, [c.klass, ...decoys])
    return {
      id: `jx-svt-${c.id}`,
      prompt: `À quelle classe appartient ${c.emoji} le/la ${c.name} ?`,
      options,
      correctIndex: options.indexOf(c.klass),
      explanation: c.tip,
      subject: 'SVT',
    }
  })
}
