// Duel d'orthographe — la banque de questions du salon Français.
// Deux familles : les GRAPHIES (le mot bien écrit contre son sosie fautif)
// et les HOMOPHONES (la phrase à trou : a/à, et/est, ou/où…). Générateur
// déterministe comme les capitales — même graine, même duel.
import { seededRng } from '@/lib/defi-modes'
import type { ModeQuestion } from '@/lib/defi-modes'

// Le mot bien écrit et son sosie fautif — les pièges classiques du collège.
export type SpellingPair = {
  id: string
  right: string
  wrong: string
  tip: string
}

export const SPELLING_PAIRS: SpellingPair[] = [
  { id: 'accueil', right: 'accueil', wrong: 'acceuil', tip: 'C-U-E-I-L : le u passe avant le e après un c.' },
  { id: 'langage', right: 'langage', wrong: 'language', tip: '« Language » est le mot anglais — en français, pas de u.' },
  { id: 'dilemme', right: 'dilemme', wrong: 'dilemne', tip: 'Deux m, pas de n — malgré « indemne ».' },
  { id: 'cauchemar', right: 'cauchemar', wrong: 'cauchemard', tip: 'Pas de d final — mais « cauchemarder » en prend un.' },
  { id: 'connexion', right: 'connexion', wrong: 'connection', tip: 'Avec un x — « connection » est la graphie anglaise.' },
  { id: 'adresse', right: 'adresse', wrong: 'addresse', tip: 'Un seul d en français — deux en anglais (address).' },
  { id: 'apercevoir', right: 'apercevoir', wrong: 'appercevoir', tip: 'Un seul p — contrairement à « apparaître ».' },
  { id: 'courrier', right: 'courrier', wrong: 'courier', tip: 'Deux r, comme « courir »… qui n’en a qu’un. Piège !' },
  { id: 'developpement', right: 'développement', wrong: 'dévelopement', tip: 'Deux p : dé-ve-lop-pe-ment.' },
  { id: 'vraiment', right: 'vraiment', wrong: 'vraiement', tip: 'Pas de e entre « vrai » et « -ment ».' },
  { id: 'nourriture', right: 'nourriture', wrong: 'nouriture', tip: 'Deux r, comme « nourrir ».' },
  { id: 'parmi', right: 'parmi', wrong: 'parmis', tip: 'Jamais de s — contrairement à « parmis » qu’on croit voir partout.' },
  { id: 'malgre', right: 'malgré', wrong: 'malgrés', tip: 'Invariable, jamais de s.' },
  { id: 'hormis', right: 'hormis', wrong: 'hormi', tip: 'Toujours un s final — l’inverse de « parmi ».' },
  { id: 'professeur', right: 'professeur', wrong: 'proffesseur', tip: 'Un seul f, deux s.' },
  { id: 'litterature', right: 'littérature', wrong: 'litérature', tip: 'Deux t, comme « lettre ».' },
  { id: 'personnage', right: 'personnage', wrong: 'personage', tip: 'Deux n, comme « personne ».' },
  { id: 'embarras', right: 'embarras', wrong: 'embaras', tip: 'Deux r — et un s final.' },
  { id: 'galerie', right: 'galerie', wrong: 'gallerie', tip: 'Un seul l — « gallery » est anglais.' },
  { id: 'trafic', right: 'trafic', wrong: 'traffic', tip: 'Un seul f en français.' },
  { id: 'confort', right: 'confort', wrong: 'comfort', tip: 'Avec un n — « comfort » est anglais.' },
  { id: 'exemple', right: 'exemple', wrong: 'example', tip: 'E-X-E : « example » est la graphie anglaise.' },
  { id: 'rythme', right: 'rythme', wrong: 'rytme', tip: 'Un y puis TH : ry-th-me.' },
  { id: 'mariage', right: 'mariage', wrong: 'marriage', tip: 'Un seul r en français.' },
  { id: 'quand-meme', right: 'quand même', wrong: 'comme même', tip: '« Comme même » n’existe pas — c’est « quand même ».' },
  { id: 'bizarre', right: 'bizarre', wrong: 'bizzare', tip: 'Un z, deux r.' },
  { id: 'attraper', right: 'attraper', wrong: 'atrapper', tip: 'Deux t, un p — l’inverse de ce qu’on croit.' },
  { id: 'enveloppe', right: 'enveloppe', wrong: 'envellope', tip: 'Un l, deux p.' },
]

// La phrase à trou : choisir le bon homophone dans le contexte.
export type HomophoneItem = {
  id: string
  sentence: string // contient « ___ »
  options: string[]
  correctIndex: number
  tip: string
}

export const HOMOPHONES: HomophoneItem[] = [
  { id: 'est-et', sentence: 'Il ___ parti hier soir.', options: ['est', 'et'], correctIndex: 0, tip: '« est » = verbe être : « il était parti » fonctionne.' },
  { id: 'et-est', sentence: 'Un stylo ___ une gomme.', options: ['et', 'est'], correctIndex: 0, tip: '« et » = addition : « et puis » fonctionne.' },
  { id: 'a-accent', sentence: 'Je vais ___ la piscine.', options: ['à', 'a'], correctIndex: 0, tip: '« à » = préposition ; « avait » ne fonctionne pas ici.' },
  { id: 'a-verbe', sentence: 'Elle ___ fini ses devoirs.', options: ['a', 'à'], correctIndex: 0, tip: '« a » = verbe avoir : « elle avait fini » fonctionne.' },
  { id: 'ou-accent', sentence: '___ vas-tu après les cours ?', options: ['Où', 'Ou'], correctIndex: 0, tip: '« où » avec accent = le lieu.' },
  { id: 'ou-choix', sentence: 'Fromage ___ dessert ?', options: ['ou', 'où'], correctIndex: 0, tip: '« ou » = choix : « ou bien » fonctionne.' },
  { id: 'ses', sentence: 'Marie appelle ___ amis avant de sortir.', options: ['ses', 'ces', 's’est'], correctIndex: 0, tip: '« ses » = les siens : les amis de Marie.' },
  { id: 'ces', sentence: 'Regarde ___ nuages, là-bas !', options: ['ces', 'ses', 'c’est'], correctIndex: 0, tip: '« ces » = démonstratif : on les montre.' },
  { id: 'ce', sentence: '___ matin, on a contrôle de maths.', options: ['Ce', 'Se'], correctIndex: 0, tip: '« ce » = démonstratif devant un nom.' },
  { id: 'se', sentence: 'Ils ___ retrouvent au parc.', options: ['se', 'ce'], correctIndex: 0, tip: '« se » = pronom devant un verbe : « ils SE retrouvent ».' },
  { id: 'sont', sentence: 'Ils ___ arrivés en avance.', options: ['sont', 'son'], correctIndex: 0, tip: '« sont » = verbe être : « ils étaient arrivés » fonctionne.' },
  { id: 'son', sentence: 'Il a oublié ___ cahier chez lui.', options: ['son', 'sont'], correctIndex: 0, tip: '« son » = le sien : « son cahier ».' },
  { id: 'ont', sentence: 'Elles ___ gagné le tournoi.', options: ['ont', 'on'], correctIndex: 0, tip: '« ont » = verbe avoir : « elles avaient gagné » fonctionne.' },
  { id: 'on', sentence: '___ dit que tu chantes très bien.', options: ['On', 'Ont'], correctIndex: 0, tip: '« on » = quelqu’un : « il dit que » fonctionne.' },
  { id: 'la', sentence: '___ voiture rouge est garée devant.', options: ['La', 'Là'], correctIndex: 0, tip: '« la » = article devant un nom.' },
  { id: 'la-accent', sentence: 'Pose ton sac ___, près de la porte.', options: ['là', 'la'], correctIndex: 0, tip: '« là » avec accent = le lieu.' },
  { id: 'leur', sentence: 'Je ___ rends leurs copies demain.', options: ['leur', 'leurs'], correctIndex: 0, tip: 'Devant un verbe, « leur » est invariable.' },
  { id: 'leurs', sentence: 'Elles enfilent ___ manteaux.', options: ['leurs', 'leur'], correctIndex: 0, tip: 'Plusieurs manteaux → « leurs » s’accorde.' },
  { id: 'tous', sentence: '___ les élèves sont dans la cour.', options: ['Tous', 'Tout'], correctIndex: 0, tip: '« tous les élèves » : pluriel → tous.' },
  { id: 'tout', sentence: '___ le monde est prêt ?', options: ['Tout', 'Tous'], correctIndex: 0, tip: '« tout le monde » : singulier → tout.' },
  { id: 'peut', sentence: 'Il ___ venir ce soir s’il veut.', options: ['peut', 'peu'], correctIndex: 0, tip: '« peut » = verbe pouvoir : « il pouvait venir » fonctionne.' },
  { id: 'peu', sentence: 'Encore un ___ de patience !', options: ['peu', 'peut'], correctIndex: 0, tip: '« un peu » = une petite quantité.' },
  { id: 'quelle', sentence: '___ heure est-il ?', options: ['Quelle', 'Quel', 'Qu’elle'], correctIndex: 0, tip: '« heure » est féminin singulier → quelle.' },
  { id: 'quels', sentence: '___ sont tes films préférés ?', options: ['Quels', 'Quelles', 'Quel'], correctIndex: 0, tip: '« films » est masculin pluriel → quels.' },
  { id: 'cest', sentence: '___ une très bonne idée.', options: ['C’est', 'S’est', 'Ses'], correctIndex: 0, tip: '« c’est » = cela est.' },
  { id: 'sest', sentence: 'Il ___ trompé de salle.', options: ['s’est', 'c’est'], correctIndex: 0, tip: '« s’est » + participe : « il s’est trompé ».' },
  { id: 'sans', sentence: 'Un chocolat chaud ___ sucre, s’il vous plaît.', options: ['sans', 's’en'], correctIndex: 0, tip: '« sans » = absence de.' },
  { id: 'sen', sentence: 'Il ___ va déjà ? La fête commence à peine !', options: ['s’en', 'sans'], correctIndex: 0, tip: '« s’en aller » : il s’en va, tu t’en vas…' },
  { id: 'pret', sentence: 'Le champion est ___ à entrer dans l’arène.', options: ['prêt', 'près'], correctIndex: 0, tip: '« prêt à » = préparé ; « près de » = à côté.' },
  { id: 'pres', sentence: 'Assieds-toi ___ de moi.', options: ['près', 'prêt'], correctIndex: 0, tip: '« près de » = à côté de.' },
  { id: 'plus-tot', sentence: 'Lève-toi ___ que d’habitude demain.', options: ['plus tôt', 'plutôt'], correctIndex: 0, tip: '« plus tôt » = contraire de plus tard.' },
  { id: 'plutot', sentence: 'Je préfère ___ le bus que le métro.', options: ['plutôt', 'plus tôt'], correctIndex: 0, tip: '« plutôt » = de préférence.' },
]

function shuffleWith<T>(rng: () => number, arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Le pool d'un duel : graphies et homophones mélangés, options permutées par
// la graine (le sosie fautif n'est jamais toujours en deuxième position).
export function buildOrthographePool(seed: string, count = 30): ModeQuestion[] {
  const rng = seededRng(`orthographe:${seed}`)

  const fromPairs: ModeQuestion[] = SPELLING_PAIRS.map((p) => {
    const options = shuffleWith(rng, [p.right, p.wrong])
    return {
      id: `jx-ort-${p.id}`,
      prompt: 'Quelle est la bonne orthographe ?',
      options,
      correctIndex: options.indexOf(p.right),
      explanation: p.tip,
      subject: 'Français',
    }
  })

  const fromHomophones: ModeQuestion[] = HOMOPHONES.map((h) => {
    const options = shuffleWith(rng, h.options)
    return {
      id: `jx-ort-${h.id}`,
      prompt: h.sentence.replace('___', '……'),
      options,
      correctIndex: options.indexOf(h.options[h.correctIndex]),
      explanation: h.tip,
      subject: 'Français',
    }
  })

  return shuffleWith(rng, [...fromPairs, ...fromHomophones]).slice(0, count)
}
