// Falsos amigos — la banque du salon Espagnol.
// Un mot espagnol qui RESSEMBLE à un mot français mais a un autre sens. La
// bonne réponse est le vrai sens ; le leurre-vedette est le faux ami (le mot
// français que le mot espagnol évoque à tort), plus deux autres leurres.
import { seededRng, type ModeQuestion } from '@/lib/defi-modes'
import { shuffleWith } from '@/lib/jeux/shuffle'

export type FalseFriend = {
  id: string
  word: string
  real: string
  trap: string
  decoys: [string, string]
  tip: string
}

export const ES_FALSE_FRIENDS: FalseFriend[] = [
  {
    id: 'constipado',
    word: 'constipado',
    real: 'enrhumé',
    trap: 'constipé',
    decoys: ['fatigué', 'contrarié'],
    tip: '« constipado » = enrhumé (qui a un rhume).',
  },
  {
    id: 'embarazada',
    word: 'embarazada',
    real: 'enceinte',
    trap: 'embarrassée',
    decoys: ['fâchée', 'gênante'],
    tip: '« embarazada » = enceinte, pas « embarrassée ».',
  },
  {
    id: 'largo',
    word: 'largo',
    real: 'long',
    trap: 'large',
    decoys: ['lourd', 'lisse'],
    tip: '« largo » = long. Large se dit *ancho*.',
  },
  {
    id: 'carta',
    word: 'carta',
    real: 'lettre',
    trap: 'carte',
    decoys: ['carton', 'cadeau'],
    tip: '« carta » = une lettre (courrier). La carte = *mapa*.',
  },
  {
    id: 'vaso',
    word: 'vaso',
    real: 'verre',
    trap: 'vase',
    decoys: ['bol', 'plateau'],
    tip: '« vaso » = un verre (pour boire). Un vase = *jarrón*.',
  },
  {
    id: 'salir',
    word: 'salir',
    real: 'sortir',
    trap: 'salir',
    decoys: ['saluer', 'sauter'],
    tip: '« salir » = sortir. Salir (rendre sale) = *ensuciar*.',
  },
  {
    id: 'subir',
    word: 'subir',
    real: 'monter',
    trap: 'subir',
    decoys: ['suivre', 'sourire'],
    tip: '« subir » = monter. Subir (endurer) = *sufrir*.',
  },
  {
    id: 'quitar',
    word: 'quitar',
    real: 'enlever',
    trap: 'quitter',
    decoys: ['garder', 'compter'],
    tip: '« quitar » = enlever. Quitter (un lieu) = *dejar*.',
  },
  {
    id: 'nombre',
    word: 'nombre',
    real: 'prénom',
    trap: 'nombre',
    decoys: ['numéro', 'ombre'],
    tip: '« nombre » = le prénom. Un nombre (chiffre) = *número*.',
  },
  {
    id: 'entender',
    word: 'entender',
    real: 'comprendre',
    trap: 'entendre',
    decoys: ['attendre', 'apprendre'],
    tip: '« entender » = comprendre. Entendre = *oír*.',
  },
  {
    id: 'burro',
    word: 'burro',
    real: 'âne',
    trap: 'beurre',
    decoys: ['taureau', 'bureau'],
    tip: '« burro » = un âne. Le beurre = *mantequilla*.',
  },
  {
    id: 'gato',
    word: 'gato',
    real: 'chat',
    trap: 'gâteau',
    decoys: ['gant', 'rat'],
    tip: '« gato » = un chat. Un gâteau = *pastel*.',
  },
  {
    id: 'pie',
    word: 'pie',
    real: 'pied',
    trap: 'tarte',
    decoys: ['pie (oiseau)', 'peau'],
    tip: '« pie » = le pied. La tarte anglaise « pie » n’a rien à voir.',
  },
  {
    id: 'sol',
    word: 'sol',
    real: 'soleil',
    trap: 'sol (le sol)',
    decoys: ['sel', 'seul'],
    tip: '« sol » = le soleil. Le sol (par terre) = *suelo*.',
  },
  {
    id: 'ropa',
    word: 'ropa',
    real: 'vêtements',
    trap: 'robe',
    decoys: ['corde', 'rideau'],
    tip: '« ropa » = les vêtements. Une robe = *vestido*.',
  },
  {
    id: 'debil',
    word: 'débil',
    real: 'faible',
    trap: 'débile',
    decoys: ['dévoué', 'docile'],
    tip: '« débil » = faible. Débile (idiot) = *tonto*.',
  },
  {
    id: 'bizarro',
    word: 'bizarro',
    real: 'courageux',
    trap: 'bizarre',
    decoys: ['blessé', 'bavard'],
    tip: '« bizarro » = courageux, vaillant. Bizarre = *raro*.',
  },
  {
    id: 'equipaje',
    word: 'equipaje',
    real: 'bagages',
    trap: 'équipage',
    decoys: ['équipe', 'équipement'],
    tip: '« equipaje » = les bagages. L’équipage = *tripulación*.',
  },
  {
    id: 'contestar',
    word: 'contestar',
    real: 'répondre',
    trap: 'contester',
    decoys: ['constater', 'consentir'],
    tip: '« contestar » = répondre. Contester = *cuestionar*.',
  },
  {
    id: 'atender',
    word: 'atender',
    real: 's’occuper de',
    trap: 'attendre',
    decoys: ['atteindre', 'entendre'],
    tip: '« atender » = s’occuper de, servir. Attendre = *esperar*.',
  },
  {
    id: 'discutir',
    word: 'discutir',
    real: 'se disputer',
    trap: 'discuter',
    decoys: ['distinguer', 'disparaître'],
    tip: '« discutir » = se disputer. Discuter calmement = *charlar*.',
  },
  {
    id: 'mantel',
    word: 'mantel',
    real: 'nappe',
    trap: 'manteau',
    decoys: ['manche', 'montre'],
    tip: '« mantel » = une nappe. Un manteau = *abrigo*.',
  },
  {
    id: 'cadena',
    word: 'cadena',
    real: 'chaîne',
    trap: 'cadenas',
    decoys: ['cadeau', 'cabane'],
    tip: '« cadena » = une chaîne. Un cadenas = *candado*.',
  },
]

export function buildFalsosAmigosPool(seed: string, count = 30): ModeQuestion[] {
  const rng = seededRng(`falsos-amigos:${seed}`)
  const pool = shuffleWith(rng, ES_FALSE_FRIENDS).slice(
    0,
    Math.min(count, ES_FALSE_FRIENDS.length),
  )
  return pool.map((f) => {
    const options = shuffleWith(rng, [f.real, f.trap, ...f.decoys])
    return {
      id: `jx-fauxes-${f.id}`,
      prompt: `En espagnol, que veut dire « ${f.word} » ?`,
      options,
      correctIndex: options.indexOf(f.real),
      explanation: f.tip,
      subject: 'Espagnol',
    }
  })
}
