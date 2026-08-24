// -----------------------------------------------------------------------------
// QUAND L'APP S'EFFACE — les routes qui prennent l'écran entier.
//
// Le bandeau du haut (niveau, série, pièces, gemmes, réglages) et la barre
// d'onglets du bas sont montés par `app/layout.tsx` sur TOUTE l'app. Pendant un
// quiz, ils sont trois fois de trop :
//
//   1. Ils DISTRAIENT au pire moment. Une question demande l'attention entière ;
//      un compteur de pièces et une jauge de niveau à trois centimètres de
//      l'énoncé la reprennent. C'est le parti pris de Duolingo, et il est juste :
//      pendant l'exercice, l'app disparaît, il ne reste que l'exercice.
//
//   2. Ils MENTENT pendant la session. Le niveau, l'XP et la série affichés
//      datent du chargement de la page : ils ne bougent pas d'une réponse à
//      l'autre alors que c'est précisément ce que l'élève est en train de
//      gagner. Un compteur figé sur un écran où l'on marque des points est pire
//      qu'un compteur absent.
//
//   3. La barre du bas VOLE LA PLACE DU POUCE. Les réponses doivent tomber là
//      où la main tient le téléphone ; une barre d'onglets de 64 px les repousse
//      vers le haut de l'écran, et propose au passage cinq façons de quitter le
//      quiz par accident.
//
// Pur et testable — le layout ne fait que lire ce verdict.
// -----------------------------------------------------------------------------

/**
 * Les routes qui s'ouvrent en plein écran, chrome de l'app masqué.
 *
 * Une constante plutôt qu'une condition dans le layout : les sessions du carnet
 * et les jeux de salon la rejoindront, et il vaut mieux une ligne à ajouter
 * qu'un enchevêtrement de `if` à démêler là-haut.
 *
 * ⚠️ LA RÈGLE COMMUNE : un préfixe se termine par une barre, et le chemin doit
 * être STRICTEMENT plus long. C'est ce qui distingue une SESSION (`/test/<id>`,
 * `/reviser/francais/dictee/<slug>`) de la LISTE qui la contient (`/test`,
 * `/reviser/francais/dictee`) — la liste est une page de navigation, lui
 * retirer sa barre d'onglets enfermerait l'élève.
 */
const PREFIXES_PLEIN_ECRAN = [
  // La session de quiz.
  '/test/',
  // Une DICTÉE — présentation et session. Elles portent leur propre héros
  // sombre et leur propre bouton en bas d'écran : gardées dans le gabarit de
  // l'app, elles héritaient de ses marges (pt-16, pb-24) par-dessus leur
  // `min-h-svh`, ce qui poussait le bouton « Commencer » SOUS la barre
  // d'onglets — invisible et inatteignable.
  //
  // ⚠️ La LISTE (`/reviser/francais/dictee`, sans slug) n'en fait pas partie :
  // c'est une page de navigation, elle garde sa barre d'onglets. C'est le
  // contrôle de longueur ci-dessous qui fait la différence.
  '/reviser/francais/dictee/',
] as const

/**
 * Cette route masque-t-elle le bandeau du haut et la barre d'onglets ?
 *
 * `pathname` vient de l'en-tête `x-pathname` posé par `proxy.ts` — même
 * mécanique que `shouldShowSplash`. Absent ou vide, on garde le chrome : mieux
 * vaut une barre en trop qu'un élève enfermé sans navigation.
 */
export function estPleinEcran(pathname: string): boolean {
  const p = typeof pathname === 'string' ? pathname : ''
  if (p.length === 0) return false
  // Une éventuelle chaîne de requête n'appartient pas au chemin.
  const chemin = p.split('?')[0]
  return PREFIXES_PLEIN_ECRAN.some(
    (prefixe) =>
      // `startsWith(prefixe)` suffit — les préfixes portent déjà leur barre
      // finale, ce qui empêche « /tests-blancs » de passer pour « /test/ ».
      chemin.startsWith(prefixe) && chemin.length > prefixe.length,
  )
}
