// Ce qu'il se passe quand un élève tape « Acheter » — et surtout, ce qu'on lui
// en dit.
//
// POURQUOI CE MODULE EXISTE. La boutique n'avait AUCUN retour d'achat. Le code
// de `TresorHome` disait, en tout et pour tout :
//
//     const res = await buyShopItem(item.id)
//     if (res?.bought) { setBalance(res.coins); markOwned(item.id) }
//
// … et rien d'autre. Un achat refusé par le serveur — solde réellement
// insuffisant, article déjà possédé dans un autre onglet, RPC en panne —
// ne produisait donc STRICTEMENT rien à l'écran : l'élève tapait, le bouton
// se relevait, le nombre ne bougeait pas. Le seul modèle mental disponible
// dans cette situation est « l'app est cassée » ou « on m'a pris mes pièces ».
// C'est exactement le mode de panne que le projet a déjà éliminé côté parents
// (le bouton « Délier », cf. `UnlinkChildButton`).
//
// Le serveur ne renvoie qu'un booléen et le SOLDE VRAI (`{bought, coins}`) :
// il ne dit pas POURQUOI il a refusé. On le déduit ici, et c'est précisément
// pour ça que cette déduction est une fonction pure et testée plutôt que trois
// conditions noyées dans un composant.
//
// Logique pure, testable sans base : voir tresor-achat.test.ts.

export type AchatIssue =
  /** Débité, l'article est à lui. */
  | 'achete'
  /** Il l'avait déjà (autre onglet, ou double tap). Ce n'est PAS une erreur. */
  | 'deja'
  /** Le solde réel du serveur ne couvre pas le prix. */
  | 'trop-cher'
  /** La session a expiré — rien à voir avec la bourse. */
  | 'deconnecte'
  /** Refus inexpliqué : RPC en panne. */
  | 'panne'

export type Reponse = {
  /** Ce que la Server Action a répondu. */
  bought: boolean
  /** Le solde APRÈS l'opération, tel que le serveur le connaît. */
  coins: number
  /** Pourquoi le serveur a refusé, quand il le sait (`buyShopItem`). */
  raison?: 'anonyme' | 'article-inconnu' | 'panne'
}

/**
 * Pourquoi l'achat s'est terminé comme ça.
 *
 * L'ordre des tests n'est pas indifférent :
 *
 *  1. `bought` d'abord — un achat réussi n'a pas à être interprété.
 *  2. Une session expirée ensuite, et AVANT le solde : le serveur répond alors
 *     « 0 pièce » faute de savoir à qui il parle, et comparer ce zéro au prix
 *     annoncerait « il te manque 120 pièces » à un élève qui les a. Le renvoyer
 *     compter sa bourse quand il faut le reconnecter est une impasse.
 *  3. « déjà possédé », parce que c'est le seul refus que le CLIENT connaît de
 *     source sûre (il a l'article dans son état local), et le seul qui ne soit
 *     pas un problème.
 *  4. Le solde ensuite : le serveur vient de nous donner le VRAI nombre de
 *     pièces. S'il ne couvre pas le prix, le refus est expliqué — et cela
 *     arrive normalement quand deux onglets dépensent la même bourse.
 *  5. Faute de mieux : panne. On préfère dire « on ne sait pas » plutôt que
 *     d'accuser l'élève d'être fauché alors qu'il ne l'est pas.
 */
export function issueAchat(params: {
  reponse: Reponse | null
  prix: number
  possedeDeja: boolean
}): AchatIssue {
  const { reponse, prix, possedeDeja } = params
  if (!reponse) return 'panne'
  if (reponse.bought) return 'achete'
  if (reponse.raison === 'anonyme') return 'deconnecte'
  if (possedeDeja) return 'deja'
  if (reponse.raison === 'panne' || reponse.raison === 'article-inconnu') {
    return 'panne'
  }
  if (Number.isFinite(reponse.coins) && reponse.coins < prix) return 'trop-cher'
  return 'panne'
}

export type MessageAchat = { texte: string; ton: 'success' | 'error' }

/**
 * La phrase à afficher. Elle nomme l'ARTICLE : « Acheté ! » tout seul, dans une
 * boutique où l'on tape vite et où les rayons défilent, ne dit pas lequel.
 *
 * Un refus dit toujours ce qu'il faut faire ensuite — un message d'erreur qui
 * ne laisse aucune suite est une impasse, et sur un écran de jeu une impasse
 * se lit comme une punition.
 */
export function messageAchat(
  issue: AchatIssue,
  nomArticle: string,
  manque = 0,
): MessageAchat {
  switch (issue) {
    case 'achete':
      return { texte: `${nomArticle} est à toi !`, ton: 'success' }
    case 'deja':
      return { texte: `Tu as déjà ${nomArticle}.`, ton: 'success' }
    case 'trop-cher':
      return {
        texte:
          manque > 0
            ? `Il te manque ${manque} ${manque > 1 ? 'pièces' : 'pièce'} pour ${nomArticle}.`
            : `Pas assez de pièces pour ${nomArticle}.`,
        ton: 'error',
      }
    case 'deconnecte':
      return {
        texte: 'Ta session a expiré — reconnecte-toi pour acheter.',
        ton: 'error',
      }
    case 'panne':
      return {
        texte: 'L’achat n’a pas abouti. Réessaie dans un instant.',
        ton: 'error',
      }
  }
}

/**
 * Combien il manque pour s'offrir un article. 0 = il peut se le payer.
 *
 * Un solde absent ou aberrant (NaN d'un bigint PostgREST mal lu) compte pour
 * zéro pièce : mieux vaut afficher « il te manque 120 » que de laisser croire
 * qu'un article est à portée alors que le serveur refusera.
 */
export function coinsManquants(coins: number, prix: number): number {
  const solde = Number.isFinite(coins) ? Math.max(0, coins) : 0
  return Math.max(0, Math.ceil(prix - solde))
}

/**
 * Le prochain article accessible : celui que l'élève peut s'offrir MAINTENANT
 * et qui coûte le plus cher (il a économisé, autant qu'il le sache), et à
 * défaut le moins cher de tous ceux qu'il vise encore.
 *
 * POURQUOI. Une boutique où tout est gris n'apprend rien : l'élève ne sait ni
 * ce qui est à sa portée, ni ce qu'il vise. Les articles possédés sont exclus —
 * proposer d'économiser pour quelque chose qu'on a déjà est le degré zéro du
 * conseil.
 */
export function prochainArticle<T extends { price: number; owned?: boolean }>(
  articles: readonly T[],
  coins: number,
): { article: T; accessible: boolean } | null {
  const restants = articles.filter((a) => !a.owned)
  if (restants.length === 0) return null

  const accessibles = restants.filter((a) => coins >= a.price)
  if (accessibles.length > 0) {
    return {
      article: accessibles.reduce((a, b) => (b.price > a.price ? b : a)),
      accessible: true,
    }
  }
  return {
    article: restants.reduce((a, b) => (b.price < a.price ? b : a)),
    accessible: false,
  }
}
