// Qui a composé ? — la banque du salon MUSIQUE (14/10/2026, Lucas : « un mode
// qui a composé »).
// Une œuvre s'affiche : qui l'a composée ? Quatre compositeurs, un seul est le
// bon. Les œuvres sont celles qu'on a dans l'oreille — Boléro, Carmen, les
// Quatre Saisons, Star Wars — et la correction DATE et SITUE chaque œuvre :
// on repart en sachant qui, quand, et pourquoi c'est resté.
//
// « Chaque mode commence doucement » : la banque est GRADUÉE — les tubes
// absolus d'abord, puis l'opéra et le ballet, puis le baroque et la musique de
// film moins connue. Générateur déterministe.
import { seededRng, type ModeQuestion } from '@/lib/defi-modes'
import { DEFAULT_PALIER } from '@/lib/jeux/paliers'
import { pickDistinct, shuffleWith } from '@/lib/jeux/shuffle'

export type Oeuvre = {
  id: string
  titre: string
  compositeur: string
  /** Premier palier où l'œuvre est tirée (1 = dès le départ, 3 = confirmé, 4 = expert). */
  from: 1 | 3 | 4
  /** Qui, quand, et ce qui fait que l'œuvre est restée. */
  tip: string
}

export const OEUVRES: readonly Oeuvre[] = [
  // --- Dès le départ : ce que tout le monde a dans l'oreille --------------
  { id: 'symphonie-5', titre: 'la Symphonie n° 5', compositeur: 'Beethoven', from: 1, tip: 'Beethoven, 1808 : les quatre notes « du destin qui frappe à la porte », écrites alors qu’il devenait sourd.' },
  { id: 'quatre-saisons', titre: 'Les Quatre Saisons', compositeur: 'Vivaldi', from: 1, tip: 'Vivaldi, 1725 : quatre concertos pour violon, un par saison, à Venise.' },
  { id: 'bolero', titre: 'le Boléro', compositeur: 'Ravel', from: 1, tip: 'Ravel, 1928 : un seul thème répété en crescendo pendant un quart d’heure — l’œuvre française la plus jouée au monde.' },
  { id: 'carmen', titre: 'Carmen', compositeur: 'Bizet', from: 1, tip: 'Bizet, 1875 : l’opéra de « L’amour est enfant de Bohême » — un échec à la création, un triomphe depuis.' },
  { id: 'flute-enchantee', titre: 'La Flûte enchantée', compositeur: 'Mozart', from: 1, tip: 'Mozart, 1791 : son dernier opéra, avec l’air de la Reine de la Nuit, l’année de sa mort.' },
  { id: 'casse-noisette', titre: 'Casse-Noisette', compositeur: 'Tchaïkovski', from: 1, tip: 'Tchaïkovski, 1892 : le ballet de Noël, avec la Danse de la fée Dragée.' },
  { id: 'clair-de-lune', titre: 'Clair de lune', compositeur: 'Debussy', from: 1, tip: 'Debussy, 1905 : la pièce pour piano la plus douce de l’impressionnisme.' },
  { id: 'gymnopedies', titre: 'les Gymnopédies', compositeur: 'Satie', from: 1, tip: 'Satie, 1888 : trois pièces lentes pour piano, d’un original qui vivait à Montmartre.' },
  { id: 'star-wars', titre: 'la musique de Star Wars', compositeur: 'John Williams', from: 1, tip: 'John Williams, 1977 : la fanfare d’ouverture a ressuscité l’orchestre symphonique au cinéma.' },
  { id: 'interstellar', titre: 'la musique d’Interstellar', compositeur: 'Hans Zimmer', from: 1, tip: 'Hans Zimmer, 2014 : un orgue d’église au cœur d’un film de science-fiction.' },
  { id: 'chihiro', titre: 'la musique du Voyage de Chihiro', compositeur: 'Joe Hisaishi', from: 1, tip: 'Joe Hisaishi, 2001 : le compositeur de presque tous les films de Miyazaki.' },
  { id: 'orphee-aux-enfers', titre: 'Orphée aux enfers', compositeur: 'Offenbach', from: 1, tip: 'Offenbach, 1858 : son « galop infernal » est devenu le french cancan.' },
  { id: 'danube-bleu', titre: 'Le Beau Danube bleu', compositeur: 'Johann Strauss', from: 1, tip: 'Johann Strauss fils, 1866 : la valse de Vienne, celle du Nouvel An.' },
  { id: 'hymne-a-la-joie', titre: 'l’Hymne à la joie', compositeur: 'Beethoven', from: 1, tip: 'Beethoven, 1824 : le final chanté de la 9e symphonie, devenu l’hymne européen.' },
  // --- Confirmé : l'opéra, le ballet, les grands tubes classiques -----------
  { id: 'toccata', titre: 'la Toccata et fugue en ré mineur', compositeur: 'Bach', from: 3, tip: 'Bach, vers 1705 : l’orgue le plus célèbre du monde, celui des films de vampires.' },
  { id: 'carnaval-animaux', titre: 'Le Carnaval des animaux', compositeur: 'Saint-Saëns', from: 3, tip: 'Saint-Saëns, 1886 : une blague musicale (le Cygne, les Fossiles) qu’il a interdit de publier de son vivant.' },
  { id: 'traviata', titre: 'La Traviata', compositeur: 'Verdi', from: 3, tip: 'Verdi, 1853 : l’opéra du « Brindisi », le toast le plus chanté de l’opéra.' },
  { id: 'walkyries', titre: 'La Chevauchée des Walkyries', compositeur: 'Wagner', from: 3, tip: 'Wagner, 1856 : les cuivres de l’Anneau du Nibelung, et des hélicoptères dans Apocalypse Now.' },
  { id: 'pierre-et-le-loup', titre: 'Pierre et le Loup', compositeur: 'Prokofiev', from: 3, tip: 'Prokofiev, 1936 : un conte où chaque personnage est un instrument — le loup, ce sont les cors.' },
  { id: 'lac-des-cygnes', titre: 'Le Lac des cygnes', compositeur: 'Tchaïkovski', from: 3, tip: 'Tchaïkovski, 1877 : le ballet des ballets, et son thème au hautbois.' },
  { id: 'rhapsody-in-blue', titre: 'Rhapsody in Blue', compositeur: 'Gershwin', from: 3, tip: 'Gershwin, 1924 : le jazz entre dans la salle de concert, sur un glissando de clarinette.' },
  { id: 'bon-brute-truand', titre: 'la musique du Bon, la Brute et le Truand', compositeur: 'Ennio Morricone', from: 3, tip: 'Ennio Morricone, 1966 : le hurlement de coyote qui ouvre le western le plus célèbre.' },
  { id: 'amelie', titre: 'la musique d’Amélie Poulain', compositeur: 'Yann Tiersen', from: 3, tip: 'Yann Tiersen, 2001 : accordéon et piano-jouet, le Paris de Montmartre.' },
  { id: 'symphonie-fantastique', titre: 'la Symphonie fantastique', compositeur: 'Berlioz', from: 3, tip: 'Berlioz, 1830 : la première symphonie à raconter une histoire — un artiste qui rêve son propre enterrement.' },
  { id: 'requiem-faure', titre: 'le Requiem', compositeur: 'Fauré', from: 3, tip: 'Fauré, 1888 : une messe des morts apaisée, « une berceuse de la mort », disait-il.' },
  { id: 'nocturnes', titre: 'les Nocturnes', compositeur: 'Chopin', from: 3, tip: 'Chopin, années 1830 : vingt et une pièces pour piano, la nuit en musique, à Paris.' },
  // --- Expert : le baroque, le romantisme tardif, le XXe siècle ---------------
  { id: 'sacre-du-printemps', titre: 'Le Sacre du printemps', compositeur: 'Stravinsky', from: 4, tip: 'Stravinsky, 1913 : la création provoqua une émeute dans la salle, à Paris.' },
  { id: 'messie', titre: 'Le Messie', compositeur: 'Haendel', from: 4, tip: 'Haendel, 1741 : l’oratorio de l’« Alléluia », pour lequel le public se lève encore.' },
  { id: 'nouveau-monde', titre: 'la Symphonie du Nouveau Monde', compositeur: 'Dvořák', from: 4, tip: 'Dvořák, 1893 : écrite à New York par un Tchèque fasciné par les chants américains.' },
  { id: 'peer-gynt', titre: 'Peer Gynt', compositeur: 'Grieg', from: 4, tip: 'Grieg, 1875 : « Au matin » et « Dans l’antre du roi de la montagne », la Norvège en musique.' },
  { id: 'planetes', titre: 'Les Planètes', compositeur: 'Holst', from: 4, tip: 'Holst, 1916 : sept planètes, sept caractères — « Mars » a inspiré toute la musique de film.' },
  { id: 'barbier-seville', titre: 'Le Barbier de Séville', compositeur: 'Rossini', from: 4, tip: 'Rossini, 1816 : « Figaro-ci, Figaro-là », l’air du barbier, écrit en trois semaines.' },
  { id: 'tosca', titre: 'Tosca', compositeur: 'Puccini', from: 4, tip: 'Puccini, 1900 : le drame romain d’une cantatrice, créé à Rome.' },
  { id: 'truite', titre: 'La Truite', compositeur: 'Schubert', from: 4, tip: 'Schubert, 1819 : un lied devenu quintette, le plus joyeux du romantisme.' },
  { id: 'danses-hongroises', titre: 'les Danses hongroises', compositeur: 'Brahms', from: 4, tip: 'Brahms, 1869 : vingt et une danses sur des airs tziganes, ses plus grands succès.' },
  { id: 'surprise', titre: 'la Symphonie « La Surprise »', compositeur: 'Haydn', from: 4, tip: 'Haydn, 1791 : un accord fortissimo au milieu d’un mouvement lent, pour réveiller le public.' },
  { id: 'turcs', titre: 'la Marche pour la cérémonie des Turcs', compositeur: 'Lully', from: 4, tip: 'Lully, 1670 : le compositeur de Louis XIV, pour Le Bourgeois gentilhomme de Molière.' },
  { id: 'indes-galantes', titre: 'Les Indes galantes', compositeur: 'Rameau', from: 4, tip: 'Rameau, 1735 : l’opéra-ballet baroque dont la « Danse des sauvages » est devenue un tube.' },
  { id: 'parapluies', titre: 'la musique des Parapluies de Cherbourg', compositeur: 'Michel Legrand', from: 4, tip: 'Michel Legrand, 1964 : un film entièrement chanté, Palme d’or à Cannes.' },
]

export const COMPOSE_TIER_BRIEF: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'Les tubes absolus, de Vivaldi à Star Wars',
  2: 'Les tubes absolus, de Vivaldi à Star Wars',
  3: 'L’opéra, le ballet et les grands classiques',
  4: 'Du baroque au XXe siècle, jusqu’aux œuvres rares',
  5: 'Du baroque au XXe siècle, jusqu’aux œuvres rares',
}

/** Les œuvres tirables à ce palier. */
export function oeuvresForTier(tier: number): Oeuvre[] {
  const level = Math.min(5, Math.max(1, Math.round(tier))) || DEFAULT_PALIER
  return OEUVRES.filter((o) => o.from <= level)
}

/** Tous les compositeurs du catalogue, une fois chacun — les leurres. */
const COMPOSITEURS: readonly string[] = [...new Set(OEUVRES.map((o) => o.compositeur))]

export function buildQuiAComposePool(
  seed: string,
  count = 30,
  tier: number = DEFAULT_PALIER,
): ModeQuestion[] {
  const rng = seededRng(`qui-a-compose:${seed}:${tier}`)
  const stock = oeuvresForTier(tier)
  const ordre: Oeuvre[] = []
  while (ordre.length < count) ordre.push(...shuffleWith(rng, stock))
  return ordre.slice(0, count).map((oeuvre, i) => {
    const decoys = pickDistinct(
      rng,
      COMPOSITEURS.filter((c) => c !== oeuvre.compositeur),
      3,
    )
    const options = shuffleWith(rng, [oeuvre.compositeur, ...decoys])
    return {
      id: `jx-musique-${oeuvre.id}-${i}`,
      prompt: `Qui a composé ${oeuvre.titre} ?`,
      options,
      correctIndex: options.indexOf(oeuvre.compositeur),
      explanation: oeuvre.tip,
      subject: 'Musique',
    }
  })
}
