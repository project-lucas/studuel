// Le Musée — la banque du salon ARTS PLASTIQUES (14/10/2026, Lucas : « quel
// mode de jeu pour l'art plastique ? Je pense qu'on doit faire comme l'histoire
// de l'art […] crée via Higgsfield des illustrations pour les illustrer ; bref,
// crée un mode de jeu avec plusieurs paliers de difficulté, mais complet et
// addictif »).
//
// Une ŒUVRE s'affiche — peinte, sculptée, gravée —, et quatre réponses. Le
// geste est celui du visiteur de musée : reconnaître ce qu'on a sous les yeux.
// La correction DATE, SITUE et raconte : on repart en sachant qui, quand, et
// pourquoi l'œuvre est restée.
//
// LA DIFFICULTÉ MONTE PAR LA QUESTION, pas seulement par le stock :
//   · Éveil      — le TITRE est donné : « La Joconde » : qui l'a réalisée ?
//   · Apprenti   — l'image seule : qui a réalisé cette œuvre ?
//   · Confirmé   — qui l'a réalisée, OU comment s'appelle-t-elle ?
//   · Expert     — et aussi : quel mouvement ? quel siècle ?
//   · Maître     — les mêmes, avec des leurres VOISINS (le siècle d'à côté, le
//                  mouvement qui le précède, un peintre de la même époque).
// Et le stock monte avec : les chefs-d'œuvre que tout le monde a vus d'abord,
// puis les grands tableaux d'histoire, puis l'Antiquité, le Moyen Âge et les
// maîtres moins connus.
//
// ⚠️ DOMAINE PUBLIC SEULEMENT. Les illustrations sont des reprises d'œuvres par
// le modèle d'images : on ne retient que des artistes morts depuis plus de
// 70 ans (Matisse et Mondrian compris, Picasso, Dalí ou Magritte exclus) et
// des œuvres anonymes anciennes.
//
// Générateur déterministe (graine), pur et testé (le-musee.test.ts).
import { seededRng, type ModeQuestion } from '@/lib/defi-modes'
import { DEFAULT_PALIER } from '@/lib/jeux/paliers'
import { pickDistinct, shuffleWith } from '@/lib/jeux/shuffle'

/** Les siècles, dans l'ordre : les leurres d'un siècle sont ses voisins. */
export const SIECLES = [
  'Préhistoire',
  'Antiquité',
  'XIe siècle',
  'XIIe siècle',
  'XIIIe siècle',
  'XIVe siècle',
  'XVe siècle',
  'XVIe siècle',
  'XVIIe siècle',
  'XVIIIe siècle',
  'XIXe siècle',
  'XXe siècle',
] as const
export type Siecle = (typeof SIECLES)[number]

/** Les mouvements, dans l'ordre de l'histoire : les leurres « voisins » en sortent. */
export const MOUVEMENTS = [
  'Art préhistorique',
  'Art grec antique',
  'Art roman',
  'Primitifs flamands',
  'Renaissance',
  'Baroque',
  'Âge d’or hollandais',
  'Rococo',
  'Néoclassicisme',
  'Romantisme',
  'Réalisme',
  'Impressionnisme',
  'Pointillisme',
  'Postimpressionnisme',
  'Estampe japonaise',
  'Expressionnisme',
  'Art nouveau',
  'Fauvisme',
  'Abstraction',
] as const
export type Mouvement = (typeof MOUVEMENTS)[number]

export type OeuvreArt = {
  id: string
  /** Le titre, prêt à entrer dans une phrase (« La Joconde »). */
  titre: string
  /** L'artiste ; absent pour une œuvre anonyme (Lascaux, la Vénus de Milo). */
  artiste?: string
  siecle: Siecle
  /** Absent quand le classer serait discutable (Manet, entre réalisme et impressionnisme). */
  mouvement?: Mouvement
  /** Premier palier où l'œuvre est tirée. */
  from: 1 | 3 | 4
  /** Qui, quand, et ce qui fait que l'œuvre est restée. */
  tip: string
}

export const OEUVRES_ART: readonly OeuvreArt[] = [
  // --- Dès le départ : les chefs-d'œuvre que tout le monde a vus -------------
  { id: 'joconde', titre: 'La Joconde', artiste: 'Léonard de Vinci', siecle: 'XVIe siècle', mouvement: 'Renaissance', from: 1, tip: 'Léonard de Vinci, vers 1503 : le sourire le plus célèbre du monde, au Louvre depuis la Révolution.' },
  { id: 'nuit-etoilee', titre: 'La Nuit étoilée', artiste: 'Vincent van Gogh', siecle: 'XIXe siècle', mouvement: 'Postimpressionnisme', from: 1, tip: 'Van Gogh, 1889 : le ciel tourbillonnant vu depuis sa chambre de l’asile de Saint-Rémy-de-Provence.' },
  { id: 'cri', titre: 'Le Cri', artiste: 'Edvard Munch', siecle: 'XIXe siècle', mouvement: 'Expressionnisme', from: 1, tip: 'Munch, 1893 : un cri d’angoisse sur un pont d’Oslo, sous un ciel rouge sang.' },
  { id: 'naissance-venus', titre: 'La Naissance de Vénus', artiste: 'Sandro Botticelli', siecle: 'XVe siècle', mouvement: 'Renaissance', from: 1, tip: 'Botticelli, vers 1485 : la déesse sort de la mer sur une coquille, à Florence.' },
  { id: 'jeune-fille-perle', titre: 'La Jeune Fille à la perle', artiste: 'Johannes Vermeer', siecle: 'XVIIe siècle', mouvement: 'Âge d’or hollandais', from: 1, tip: 'Vermeer, vers 1665 : un regard par-dessus l’épaule, qu’on surnomme « la Joconde du Nord ».' },
  { id: 'grande-vague', titre: 'La Grande Vague de Kanagawa', artiste: 'Hokusai', siecle: 'XIXe siècle', mouvement: 'Estampe japonaise', from: 1, tip: 'Hokusai, vers 1831 : une estampe gravée sur bois — le mont Fuji, minuscule, sous la vague.' },
  { id: 'liberte', titre: 'La Liberté guidant le peuple', artiste: 'Eugène Delacroix', siecle: 'XIXe siècle', mouvement: 'Romantisme', from: 1, tip: 'Delacroix, 1830 : les Trois Glorieuses de juillet, la Liberté en tête sur les barricades de Paris.' },
  { id: 'nympheas', titre: 'Les Nymphéas', artiste: 'Claude Monet', siecle: 'XXe siècle', mouvement: 'Impressionnisme', from: 1, tip: 'Monet, de 1914 à 1926 : l’étang de son jardin de Giverny, peint jusqu’à sa mort ; exposé à l’Orangerie.' },
  { id: 'penseur', titre: 'Le Penseur', artiste: 'Auguste Rodin', siecle: 'XIXe siècle', from: 1, tip: 'Rodin, 1880 : d’abord le poète Dante méditant au-dessus de la Porte de l’Enfer, devenu une sculpture à part.' },
  { id: 'creation-adam', titre: 'La Création d’Adam', artiste: 'Michel-Ange', siecle: 'XVIe siècle', mouvement: 'Renaissance', from: 1, tip: 'Michel-Ange, vers 1512 : deux doigts qui se frôlent, peints sur le plafond de la chapelle Sixtine.' },
  { id: 'baiser-klimt', titre: 'Le Baiser', artiste: 'Gustav Klimt', siecle: 'XXe siècle', mouvement: 'Art nouveau', from: 1, tip: 'Klimt, 1908 : un couple enlacé dans un manteau de feuilles d’or, à Vienne.' },
  { id: 'tournesols', titre: 'Les Tournesols', artiste: 'Vincent van Gogh', siecle: 'XIXe siècle', mouvement: 'Postimpressionnisme', from: 1, tip: 'Van Gogh, 1888 : peints à Arles pour décorer la chambre de son ami Gauguin.' },
  // --- Confirmé : les grands tableaux d'histoire et l'impressionnisme --------
  { id: 'radeau-meduse', titre: 'Le Radeau de La Méduse', artiste: 'Théodore Géricault', siecle: 'XIXe siècle', mouvement: 'Romantisme', from: 3, tip: 'Géricault, 1819 : les naufragés d’une frégate abandonnés en mer — un scandale au Salon.' },
  { id: 'impression-soleil', titre: 'Impression, soleil levant', artiste: 'Claude Monet', siecle: 'XIXe siècle', mouvement: 'Impressionnisme', from: 3, tip: 'Monet, 1872 : le port du Havre au matin ; c’est ce tableau qui a donné son nom à l’impressionnisme.' },
  { id: 'sacre-napoleon', titre: 'Le Sacre de Napoléon', artiste: 'Jacques-Louis David', siecle: 'XIXe siècle', mouvement: 'Néoclassicisme', from: 3, tip: 'David, 1807 : Napoléon couronne Joséphine à Notre-Dame, sur une toile de près de dix mètres.' },
  { id: 'ecole-athenes', titre: 'L’École d’Athènes', artiste: 'Raphaël', siecle: 'XVIe siècle', mouvement: 'Renaissance', from: 3, tip: 'Raphaël, vers 1511 : Platon et Aristote au centre d’une fresque du Vatican, entourés des savants de l’Antiquité.' },
  { id: 'menines', titre: 'Les Ménines', artiste: 'Diego Velázquez', siecle: 'XVIIe siècle', mouvement: 'Baroque', from: 3, tip: 'Velázquez, 1656 : l’infante d’Espagne et ses dames — et le peintre lui-même, qui nous regarde.' },
  { id: 'ronde-nuit', titre: 'La Ronde de nuit', artiste: 'Rembrandt', siecle: 'XVIIe siècle', mouvement: 'Âge d’or hollandais', from: 3, tip: 'Rembrandt, 1642 : une compagnie de la milice d’Amsterdam en marche, la lumière en éclats dans l’ombre.' },
  { id: 'angelus', titre: 'L’Angélus', artiste: 'Jean-François Millet', siecle: 'XIXe siècle', mouvement: 'Réalisme', from: 3, tip: 'Millet, 1859 : deux paysans s’arrêtent de travailler pour prier au son des cloches.' },
  { id: 'classe-danse', titre: 'La Classe de danse', artiste: 'Edgar Degas', siecle: 'XIXe siècle', mouvement: 'Impressionnisme', from: 3, tip: 'Degas, 1874 : les petites danseuses de l’Opéra de Paris, saisies comme sur une photographie.' },
  { id: 'grande-jatte', titre: 'Un dimanche après-midi à l’île de la Grande Jatte', artiste: 'Georges Seurat', siecle: 'XIXe siècle', mouvement: 'Pointillisme', from: 3, tip: 'Seurat, 1886 : des milliers de petits points de couleur pure, posés un à un pendant deux ans.' },
  { id: 'moulin-galette', titre: 'Bal du moulin de la Galette', artiste: 'Auguste Renoir', siecle: 'XIXe siècle', mouvement: 'Impressionnisme', from: 3, tip: 'Renoir, 1876 : un dimanche dansant à Montmartre, la lumière qui tombe à travers les arbres.' },
  { id: 'venus-milo', titre: 'La Vénus de Milo', siecle: 'Antiquité', mouvement: 'Art grec antique', from: 3, tip: 'Grèce antique, vers 100 av. J.-C. : retrouvée en 1820 sur l’île de Milo, déjà sans ses bras.' },
  { id: 'danse-matisse', titre: 'La Danse', artiste: 'Henri Matisse', siecle: 'XXe siècle', mouvement: 'Fauvisme', from: 3, tip: 'Matisse, 1910 : cinq danseurs rouges en ronde, et trois couleurs seulement — le rouge, le bleu, le vert.' },
  { id: 'dejeuner-herbe', titre: 'Le Déjeuner sur l’herbe', artiste: 'Édouard Manet', siecle: 'XIXe siècle', from: 3, tip: 'Manet, 1863 : refusé au Salon, exposé au Salon des refusés — le scandale qui ouvre la peinture moderne.' },
  // --- Expert : l'Antiquité, le Moyen Âge et les maîtres moins connus ---------
  { id: 'lascaux', titre: 'les peintures de Lascaux', siecle: 'Préhistoire', mouvement: 'Art préhistorique', from: 4, tip: 'Préhistoire, il y a environ 18 000 ans : chevaux et taureaux peints dans une grotte de Dordogne, découverte en 1940.' },
  { id: 'samothrace', titre: 'La Victoire de Samothrace', siecle: 'Antiquité', mouvement: 'Art grec antique', from: 4, tip: 'Grèce antique, vers 190 av. J.-C. : une déesse ailée posée sur une proue de navire, en haut d’un escalier du Louvre.' },
  { id: 'bayeux', titre: 'La Tapisserie de Bayeux', siecle: 'XIe siècle', mouvement: 'Art roman', from: 4, tip: 'XIe siècle, vers 1070 : la conquête de l’Angleterre par Guillaume, brodée sur près de 70 mètres de toile.' },
  { id: 'arnolfini', titre: 'Les Époux Arnolfini', artiste: 'Jan van Eyck', siecle: 'XVe siècle', mouvement: 'Primitifs flamands', from: 4, tip: 'Van Eyck, 1434 : un couple de Bruges, et dans le miroir du fond, le peintre lui-même.' },
  { id: 'chasseurs-neige', titre: 'Les Chasseurs dans la neige', artiste: 'Pieter Bruegel l’Ancien', siecle: 'XVIe siècle', mouvement: 'Renaissance', from: 4, tip: 'Bruegel, 1565 : un village flamand en hiver, les chasseurs rentrent bredouilles.' },
  { id: 'mort-vierge', titre: 'La Mort de la Vierge', artiste: 'Le Caravage', siecle: 'XVIIe siècle', mouvement: 'Baroque', from: 4, tip: 'Caravage, vers 1605 : une lumière violente qui sort de l’ombre — le tableau fut refusé par l’église qui l’avait commandé.' },
  { id: 'tricheur', titre: 'Le Tricheur à l’as de carreau', artiste: 'Georges de La Tour', siecle: 'XVIIe siècle', mouvement: 'Baroque', from: 4, tip: 'Georges de La Tour, vers 1635 : un jeune homme se fait plumer aux cartes, et les regards trahissent tout.' },
  { id: 'escarpolette', titre: 'L’Escarpolette', artiste: 'Jean-Honoré Fragonard', siecle: 'XVIIIe siècle', mouvement: 'Rococo', from: 4, tip: 'Fragonard, vers 1767 : une jeune femme sur une balançoire, une chaussure qui s’envole — le rococo léger.' },
  { id: 'serment-horaces', titre: 'Le Serment des Horaces', artiste: 'Jacques-Louis David', siecle: 'XVIIIe siècle', mouvement: 'Néoclassicisme', from: 4, tip: 'David, 1784 : trois frères jurent de défendre Rome — la rigueur antique contre le rococo.' },
  { id: 'voyageur-nuages', titre: 'Le Voyageur contemplant une mer de nuages', artiste: 'Caspar David Friedrich', siecle: 'XIXe siècle', mouvement: 'Romantisme', from: 4, tip: 'Friedrich, vers 1818 : un homme de dos face à l’immensité — l’image même du romantisme allemand.' },
  { id: 'tres-de-mayo', titre: 'Tres de Mayo', artiste: 'Francisco de Goya', siecle: 'XIXe siècle', mouvement: 'Romantisme', from: 4, tip: 'Goya, 1814 : l’exécution d’insurgés madrilènes par les soldats de Napoléon, la nuit du 3 mai 1808.' },
  { id: 'sainte-victoire', titre: 'La Montagne Sainte-Victoire', artiste: 'Paul Cézanne', siecle: 'XXe siècle', mouvement: 'Postimpressionnisme', from: 4, tip: 'Cézanne, vers 1904 : la montagne de sa Provence, peinte des dizaines de fois en formes simples.' },
  { id: 'composition-8', titre: 'Composition VIII', artiste: 'Vassily Kandinsky', siecle: 'XXe siècle', mouvement: 'Abstraction', from: 4, tip: 'Kandinsky, 1923 : cercles, lignes et triangles — la peinture qui ne représente plus rien, comme une musique.' },
  { id: 'mondrian', titre: 'Composition en rouge, bleu et jaune', artiste: 'Piet Mondrian', siecle: 'XXe siècle', mouvement: 'Abstraction', from: 4, tip: 'Mondrian, 1930 : des lignes noires et trois couleurs primaires, rien d’autre.' },
]

/** L'illustration d'une œuvre (scripts/oeuvres-musee.mjs). */
export function imageOeuvre(id: string): string {
  return `/images/jeux/musee/${id}.webp`
}

export const MUSEE_TIER_BRIEF: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'Les chefs-d’œuvre, titre donné : trouve l’artiste',
  2: 'Les chefs-d’œuvre, l’image seule : qui l’a réalisée ?',
  3: 'Les grands tableaux d’histoire : l’artiste ou le titre',
  4: 'De Lascaux à l’abstraction : artiste, titre, mouvement, siècle',
  5: 'Tout le musée, avec des pièges voisins',
}

type Sorte = 'artiste-titre' | 'artiste' | 'titre' | 'mouvement' | 'siecle'

/** Les sortes de questions de chaque palier. */
const SORTES: Record<1 | 2 | 3 | 4 | 5, readonly Sorte[]> = {
  1: ['artiste-titre'],
  2: ['artiste'],
  3: ['artiste', 'titre'],
  4: ['artiste', 'titre', 'mouvement', 'siecle'],
  5: ['artiste', 'titre', 'mouvement', 'siecle'],
}

function niveau(tier: number): 1 | 2 | 3 | 4 | 5 {
  return (Math.min(5, Math.max(1, Math.round(tier))) || DEFAULT_PALIER) as 1 | 2 | 3 | 4 | 5
}

/** Les œuvres tirables à ce palier (aux paliers 1 et 2, il faut un artiste à nommer). */
export function oeuvresDuPalier(tier: number): OeuvreArt[] {
  const level = niveau(tier)
  return OEUVRES_ART.filter((o) => o.from <= level && (level >= 3 || o.artiste))
}

/** Ce qu'on peut demander sur cette œuvre à ce palier. */
export function sortesPossibles(o: OeuvreArt, tier: number): Sorte[] {
  return SORTES[niveau(tier)].filter((s) => {
    if (s === 'artiste' || s === 'artiste-titre') return Boolean(o.artiste)
    if (s === 'mouvement') return Boolean(o.mouvement)
    return true
  })
}

/**
 * Trois leurres pris dans une liste ORDONNÉE (siècles, mouvements) : au palier
 * Maître, les plus proches voisins de la bonne réponse ; avant, au hasard
 * parmi les six plus proches — assez loin pour se raisonner.
 */
function leurresVoisins(rng: () => number, liste: readonly string[], bonne: string, serres: boolean): string[] {
  const i = liste.indexOf(bonne)
  const autres = liste
    .map((v, k) => ({ v, d: Math.abs(k - i) }))
    .filter((x) => x.v !== bonne)
    .sort((a, b) => a.d - b.d)
    .map((x) => x.v)
  return serres ? autres.slice(0, 3) : pickDistinct(rng, autres.slice(0, 6), 3)
}

const ARTISTES: readonly string[] = [...new Set(OEUVRES_ART.flatMap((o) => (o.artiste ? [o.artiste] : [])))]

/** Trois artistes leurres ; au palier Maître, ceux du même siècle d'abord. */
function leurresArtistes(rng: () => number, o: OeuvreArt, serres: boolean): string[] {
  const autres = ARTISTES.filter((a) => a !== o.artiste)
  if (!serres) return pickDistinct(rng, autres, 3)
  const memeSiecle = new Set(
    OEUVRES_ART.filter((x) => x.siecle === o.siecle && x.artiste && x.artiste !== o.artiste).map((x) => x.artiste!),
  )
  const proches = shuffleWith(rng, [...memeSiecle])
  const reste = shuffleWith(
    rng,
    autres.filter((a) => !memeSiecle.has(a)),
  )
  return [...proches, ...reste].slice(0, 3)
}

function leurresTitres(rng: () => number, o: OeuvreArt, stock: readonly OeuvreArt[]): string[] {
  return pickDistinct(
    rng,
    stock.filter((x) => x.id !== o.id).map((x) => x.titre),
    3,
  )
}

/** « la Joconde » → « La Joconde » : un titre qui ouvre la réponse prend sa majuscule. */
function capitale(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function buildMuseePool(seed: string, count = 30, tier: number = DEFAULT_PALIER): ModeQuestion[] {
  const level = niveau(tier)
  const rng = seededRng(`le-musee:${seed}:${level}`)
  const stock = oeuvresDuPalier(level)
  const ordre: OeuvreArt[] = []
  while (ordre.length < count) ordre.push(...shuffleWith(rng, stock))
  const serres = level === 5

  return ordre.slice(0, count).map((o, i) => {
    const sortes = sortesPossibles(o, level)
    const sorte = sortes[Math.floor(rng() * sortes.length)]
    let prompt: string
    let bonne: string
    let leurres: string[]
    if (sorte === 'artiste-titre') {
      prompt = `« ${capitale(o.titre)} » : qui l’a réalisée ?`
      bonne = o.artiste!
      leurres = leurresArtistes(rng, o, false)
    } else if (sorte === 'artiste') {
      prompt = 'Qui a réalisé cette œuvre ?'
      bonne = o.artiste!
      leurres = leurresArtistes(rng, o, serres)
    } else if (sorte === 'titre') {
      prompt = 'Comment s’appelle cette œuvre ?'
      bonne = capitale(o.titre)
      leurres = leurresTitres(rng, o, OEUVRES_ART).map(capitale)
    } else if (sorte === 'mouvement') {
      prompt = 'À quel mouvement appartient cette œuvre ?'
      bonne = o.mouvement!
      leurres = leurresVoisins(rng, MOUVEMENTS, o.mouvement!, serres)
    } else {
      prompt = 'De quand date cette œuvre ?'
      bonne = o.siecle
      leurres = leurresVoisins(rng, SIECLES, o.siecle, serres)
    }
    const options = shuffleWith(rng, [bonne, ...leurres])
    return {
      id: `jx-musee-${o.id}-${i}`,
      prompt,
      options,
      correctIndex: options.indexOf(bonne),
      explanation: `${capitale(o.titre)} — ${o.tip}`,
      subject: 'Arts plastiques',
      image: imageOeuvre(o.id),
      imageAlt: sorte === 'artiste-titre' ? capitale(o.titre) : 'Une œuvre d’art à reconnaître',
    }
  })
}
