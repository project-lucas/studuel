// -----------------------------------------------------------------------------
// LES ÉLÈVES-HÉROS DE L'ACADÉMIE (31/10/2026)
//
// Le virage du 29/10 : l'élève n'a plus un avatar en sweat violet, il INCARNE
// un héros, et ce héros se choisit DANS SA SCÈNE (un perso, un lieu, une
// saison, une humeur). Quinze héros retenus par Lucas, un par un, les 30 et
// 31/10 : six filles, neuf garçons (« un garçon doit être fier de son perso »).
//
// Chaque héros est servi en deux images, fabriquées par
// `scripts/heros-eleves.mjs` depuis assets-sources/heros/eleves/retenus/ :
//   · la SCÈNE (9:16), à l'écran de choix et en décor de la page du joueur ;
//   · le VISAGE (carré), l'avatar partout ailleurs, via lib/portraits.
//
// Les clés vont en base (`profiles.avatar.portrait`) : une clé ne se renomme
// JAMAIS. Ce module n'importe rien : lib/portraits le lit côté client, avant
// tout compte.
// -----------------------------------------------------------------------------

export type GenreHeros = 'garcons' | 'filles'

export type HerosEleve = {
  /** La clé enregistrée sur le profil. Figée. */
  readonly cle: string
  readonly genre: GenreHeros
  /** Le peuple du héros, accordé (« Gobeline », « Naine »). */
  readonly peuple: string
  /** Son surnom, ce qu'on lit en grand sous la scène. */
  readonly titre: string
  /** Une ligne, l'humeur de la scène. */
  readonly devise: string
  /**
   * SON CARACTÈRE (01/11/2026, Lucas : « chaque perso symbolise des qualités ou
   * des défauts — solitaire, joyeux, rêveur, détaché, observateur… — l'élève
   * doit se dire "ce perso me ressemble moralement" ») : deux qualités, un
   * travers assumé (un défaut qu'on avoue en souriant, jamais une insulte) et
   * une phrase à la deuxième personne, celle qui fait dire « c'est moi ».
   * Accordés au genre du héros.
   */
  readonly qualites: readonly [string, string]
  readonly travers: string
  readonly cestToi: string
}

export const HEROS_ELEVES = [
  // --- Garçons ---------------------------------------------------------------
  { cle: 'elfe-rodeur', genre: 'garcons', peuple: 'Elfe sylvain', titre: 'Le Rôdeur des neiges', devise: 'Il lit les traces comme d’autres lisent un livre.',
    qualites: ['Solitaire', 'Observateur'], travers: 'Peu bavard', cestToi: 'Tu remarques ce que personne ne voit, et tu avances à ton rythme.' },
  { cle: 'demi-elfe-mage', genre: 'garcons', peuple: 'Demi-elfe', titre: 'Le Mage de feu', devise: 'Le golem a reculé. Lui, non.',
    qualites: ['Courageux', 'Fonceur'], travers: 'Impatient', cestToi: 'Tu ne recules devant rien, quitte à foncer avant de réfléchir.' },
  { cle: 'nain-forge', genre: 'garcons', peuple: 'Nain', titre: 'Le Forgeron de runes', devise: 'Chaque coup de marteau grave une rune.',
    qualites: ['Travailleur', 'Perfectionniste'], travers: 'Têtu', cestToi: 'Tu recommences jusqu’à ce que ce soit parfait.' },
  { cle: 'demi-elfe-orage', genre: 'garcons', peuple: 'Demi-elfe', titre: 'L’Appel de l’orage', devise: 'Il attrape la foudre à mains nues.',
    qualites: ['Audacieux', 'Passionné'], travers: 'Imprévisible', cestToi: 'Tu vis tout à fond, comme un orage.' },
  { cle: 'elfe-ombre', genre: 'garcons', peuple: 'Elfe de l’ombre', titre: 'Le Guetteur de minuit', devise: 'La lune pour seule complice.',
    qualites: ['Discret', 'Mystérieux'], travers: 'Couche-tard', cestToi: 'Tu gardes tes secrets, et tu es plus vif la nuit que le matin.' },
  { cle: 'elfe-harpon', genre: 'garcons', peuple: 'Elfe des glaces', titre: 'Le Harponneur', devise: 'Patient comme la banquise.',
    qualites: ['Patient', 'Calme'], travers: 'Détaché', cestToi: 'Rien ne te presse : tu attends le bon moment.' },
  { cle: 'troll-pont', genre: 'garcons', peuple: 'Troll', titre: 'Le Veilleur du pont', devise: 'Il sculpte la nuit au coin du feu.',
    qualites: ['Doux', 'Créatif'], travers: 'Rêveur', cestToi: 'Sous tes airs costauds, tu as un cœur d’artiste.' },
  { cle: 'orc-classe', genre: 'garcons', peuple: 'Orc', titre: 'Le Caïd du fond', devise: 'Les pieds sur la table, la réponse en tête.',
    qualites: ['Sûr de lui', 'Malin'], travers: 'Un peu frimeur', cestToi: 'Tu as l’air de ne rien écouter, mais tu as toujours la réponse.' },
  { cle: 'orc-chien', genre: 'garcons', peuple: 'Orc', titre: 'Le Coureur des bois', devise: 'Lui et son chien, personne ne les rattrape.',
    qualites: ['Joyeux', 'Loyal'], travers: 'Infatigable', cestToi: 'Un ami, pour toi, c’est pour la vie.' },
  // --- Filles ----------------------------------------------------------------
  { cle: 'gobeline-mur', genre: 'filles', peuple: 'Gobeline', titre: 'L’Ombre des toits', devise: 'Aucun mur ne lui résiste.',
    qualites: ['Agile', 'Espiègle'], travers: 'Casse-cou', cestToi: '« Interdit » ? Pour toi, c’est une invitation.' },
  { cle: 'naine-poney', genre: 'filles', peuple: 'Naine', titre: 'La Cavalière des crêtes', devise: 'Pas de pente trop raide pour son poney.',
    qualites: ['Déterminée', 'Courageuse'], travers: 'Têtue', cestToi: 'Quand tu as décidé quelque chose, personne ne t’arrête.' },
  { cle: 'elfe-cerf-volant', genre: 'filles', peuple: 'Elfe', titre: 'La Vigie des cimes', devise: 'Toujours plus haut que tout le monde.',
    qualites: ['Rêveuse', 'Libre'], travers: 'Tête en l’air', cestToi: 'Ta tête est souvent dans les nuages, et tu adores ça.' },
  { cle: 'humaine-luth', genre: 'filles', peuple: 'Humaine', titre: 'La Barde de la cour', devise: 'Elle met l’académie entière en musique.',
    qualites: ['Joyeuse', 'Sociable'], travers: 'Bavarde', cestToi: 'Là où tu passes, ça rit et ça chante.' },
  { cle: 'gobeline-lectrice', genre: 'filles', peuple: 'Gobeline', titre: 'La Rêveuse du saule', devise: 'Un livre, une branche, et le monde s’efface.',
    qualites: ['Curieuse', 'Calme'], travers: 'Dans sa bulle', cestToi: 'Un bon livre, et tu oublies tout le reste.' },
  { cle: 'elfe-course', genre: 'filles', peuple: 'Elfe', titre: 'La Fusée', devise: 'Première sur la ligne, à chaque fois.',
    qualites: ['Compétitrice', 'Énergique'], travers: 'Impatiente', cestToi: 'Tu veux toujours être la première, partout.' },
] as const satisfies readonly HerosEleve[]

export type HerosKey = (typeof HEROS_ELEVES)[number]['cle']

export const HEROS_KEYS: readonly HerosKey[] = HEROS_ELEVES.map((h) => h.cle)

export function isHerosKey(value: unknown): value is HerosKey {
  return typeof value === 'string' && (HEROS_KEYS as readonly string[]).includes(value)
}

export function herosEleve(cle: HerosKey): HerosEleve {
  // La liste est fermée et `cle` en vient : la recherche aboutit toujours.
  return HEROS_ELEVES.find((h) => h.cle === cle) as HerosEleve
}

export function herosParGenre(genre: GenreHeros): readonly HerosEleve[] {
  return HEROS_ELEVES.filter((h) => h.genre === genre)
}

/** La scène du héros (9:16, 720 px de large). */
export function herosSceneSrc(cle: HerosKey): string {
  return `/images/heros/eleves/${cle}.webp`
}

/** Le visage du héros (carré 384 px) : son avatar partout dans l'app. */
export function herosVisageSrc(cle: HerosKey): string {
  return `/images/heros/eleves/${cle}-visage.webp`
}
