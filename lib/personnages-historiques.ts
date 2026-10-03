// -----------------------------------------------------------------------------
// LES PERSONNAGES HISTORIQUES — les avatars à débloquer (03-04/10/2026).
//
// Lucas : « les avatars déblocables en tant que personnages historiques
// (Charlemagne, Baudouin IV…) pour inviter à compléter des défis plus durs ».
// Trente-deux blasons, quatre ou cinq par matière, chacun avec sa RARETÉ, qui se
// lit au cadre : argent (Rare), or gravé (Épique), or rayonnant serti de gemmes
// violettes (Légendaire). L'écusson au bas de la poitrine porte l'emblème de la
// matière (épées croisées pour l'histoire, compas et équerre pour les maths…).
//
// Les dessins sont livrés (public/images/profil/personnages/, fabriqués par
// `node scripts/illustrations-lot-1004.mjs` ; lib/assets.test.ts vérifie que
// chacun existe). LE DÉBLOCAGE N'EXISTE PAS ENCORE : aucun défi ne les accorde
// et ils ne sont PAS dans les portraits libres (lib/portraits.ts) — ce
// catalogue attend la règle de déblocage que Lucas choisira.
//
// Pur, sans dépendance : importable par un composant client.
// -----------------------------------------------------------------------------

export type RaretePersonnage = 'rare' | 'epique' | 'legendaire'

export type MatierePersonnage =
  | 'histoire'
  | 'maths'
  | 'francais'
  | 'physique'
  | 'svt'
  | 'philosophie'
  | 'anglais'
  | 'espagnol'
  | 'nsi'

export type PersonnageHistorique = {
  /** `<matière>-<nom>` : aussi le nom du fichier. */
  id: string
  nom: string
  matiere: MatierePersonnage
  rarete: RaretePersonnage
}

export const PERSONNAGES_HISTORIQUES: readonly PersonnageHistorique[] = [
  { id: 'histoire-vercingetorix', nom: 'Vercingétorix', matiere: 'histoire', rarete: 'rare' },
  { id: 'histoire-jeanne-d-arc', nom: 'Jeanne d’Arc', matiere: 'histoire', rarete: 'epique' },
  { id: 'histoire-charlemagne', nom: 'Charlemagne', matiere: 'histoire', rarete: 'legendaire' },
  { id: 'histoire-baudouin-4', nom: 'Baudouin IV', matiere: 'histoire', rarete: 'legendaire' },
  { id: 'histoire-saint-louis', nom: 'Saint Louis', matiere: 'histoire', rarete: 'epique' },
  { id: 'histoire-alienor', nom: 'Aliénor d’Aquitaine', matiere: 'histoire', rarete: 'epique' },
  { id: 'histoire-louis-14', nom: 'Louis XIV', matiere: 'histoire', rarete: 'legendaire' },
  { id: 'histoire-napoleon', nom: 'Napoléon', matiere: 'histoire', rarete: 'legendaire' },
  { id: 'maths-pythagore', nom: 'Pythagore', matiere: 'maths', rarete: 'rare' },
  { id: 'maths-archimede', nom: 'Archimède', matiere: 'maths', rarete: 'epique' },
  { id: 'maths-hypatie', nom: 'Hypatie', matiere: 'maths', rarete: 'epique' },
  { id: 'maths-pascal', nom: 'Blaise Pascal', matiere: 'maths', rarete: 'legendaire' },
  { id: 'francais-la-fontaine', nom: 'Jean de La Fontaine', matiere: 'francais', rarete: 'rare' },
  { id: 'francais-moliere', nom: 'Molière', matiere: 'francais', rarete: 'epique' },
  { id: 'francais-george-sand', nom: 'George Sand', matiere: 'francais', rarete: 'epique' },
  { id: 'francais-victor-hugo', nom: 'Victor Hugo', matiere: 'francais', rarete: 'legendaire' },
  { id: 'physique-galilee', nom: 'Galilée', matiere: 'physique', rarete: 'rare' },
  { id: 'physique-lavoisier', nom: 'Lavoisier', matiere: 'physique', rarete: 'epique' },
  { id: 'physique-newton', nom: 'Isaac Newton', matiere: 'physique', rarete: 'epique' },
  { id: 'physique-marie-curie', nom: 'Marie Curie', matiere: 'physique', rarete: 'legendaire' },
  { id: 'svt-mendel', nom: 'Gregor Mendel', matiere: 'svt', rarete: 'rare' },
  { id: 'svt-darwin', nom: 'Charles Darwin', matiere: 'svt', rarete: 'epique' },
  { id: 'svt-pasteur', nom: 'Louis Pasteur', matiere: 'svt', rarete: 'legendaire' },
  { id: 'philosophie-socrate', nom: 'Socrate', matiere: 'philosophie', rarete: 'rare' },
  { id: 'philosophie-aristote', nom: 'Aristote', matiere: 'philosophie', rarete: 'epique' },
  { id: 'philosophie-descartes', nom: 'Descartes', matiere: 'philosophie', rarete: 'legendaire' },
  { id: 'anglais-shakespeare', nom: 'Shakespeare', matiere: 'anglais', rarete: 'epique' },
  { id: 'anglais-elisabeth-1', nom: 'Élisabeth Ire', matiere: 'anglais', rarete: 'legendaire' },
  { id: 'espagnol-cervantes', nom: 'Cervantès', matiere: 'espagnol', rarete: 'epique' },
  { id: 'espagnol-isabelle', nom: 'Isabelle la Catholique', matiere: 'espagnol', rarete: 'legendaire' },
  { id: 'nsi-ada-lovelace', nom: 'Ada Lovelace', matiere: 'nsi', rarete: 'epique' },
  { id: 'nsi-alan-turing', nom: 'Alan Turing', matiere: 'nsi', rarete: 'legendaire' },
]

/** Le blason d'un personnage. */
export function imagePersonnage(id: string): string {
  return `/images/profil/personnages/${id}.webp`
}
