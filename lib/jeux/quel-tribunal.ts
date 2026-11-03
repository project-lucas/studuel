// Quel tribunal ? — le premier jeu du SUPÉRIEUR (03/11/2026), salon
// « Institutions juridictionnelles » de la L1 droit (lib/superieur/cursus.ts).
//
// Lucas : « il faudra également créer les modes de jeu ». Le geste de
// l'étudiant de L1 qu'on veut automatiser : devant une affaire, nommer TOUT DE
// SUITE la juridiction compétente — l'ordre (judiciaire ou administratif), la
// nature (civil, pénal, social, commercial), le degré (première instance,
// appel, cassation). C'est la question de cours qui revient à chaque partiel.
//
// Une affaire s'affiche, quatre juridictions : une seule est compétente. Les
// trois LEURRES sont écrits à la main pour chaque affaire, jamais tirés au
// hasard : un tirage pourrait servir une autre juridiction AUSSI compétente
// (le tribunal judiciaire et son juge des contentieux de la protection, par
// exemple) et faire perdre un étudiant qui a raison.
//
// La banque est GRADUÉE comme celle de Qui a composé ? : la première instance
// évidente d'abord, puis les voies de recours et le pénal fin, puis les cours
// suprêmes et européennes. Le droit au 03/11/2026 : tribunal judiciaire depuis
// le 1er janvier 2020, cour criminelle départementale généralisée le 1er
// janvier 2023. À relire à chaque réforme de l'organisation judiciaire.
import { seededRng, type ModeQuestion } from '@/lib/defi-modes'
import { DEFAULT_PALIER } from '@/lib/jeux/paliers'
import { shuffleWith } from '@/lib/jeux/shuffle'

/** Le nom de la matière, tel que la 606 l'écrit en base et que le salon l'attend. */
export const MATIERE_QUEL_TRIBUNAL = 'Institutions juridictionnelles'

export type Affaire = {
  id: string
  /** La situation, racontée comme un justiciable la raconterait. */
  situation: string
  /** La juridiction compétente. */
  reponse: string
  /** Trois juridictions plausibles et FAUSSES pour cette affaire. */
  leurres: readonly [string, string, string]
  /** Premier palier où l'affaire est tirée (1 = dès le départ, 3 = confirmé, 4 = expert). */
  from: 1 | 3 | 4
  /** Pourquoi : la règle de compétence, en une phrase. */
  tip: string
}

const TJ = 'Le tribunal judiciaire'
const JCP = 'Le juge des contentieux de la protection'
const JAF = 'Le juge aux affaires familiales'
const CPH = 'Le conseil de prud’hommes'
const TCOM = 'Le tribunal de commerce'
const TPOL = 'Le tribunal de police'
const TCORR = 'Le tribunal correctionnel'
const ASSISES = 'La cour d’assises'
const CCD = 'La cour criminelle départementale'
const TPE = 'Le tribunal pour enfants'
const TA = 'Le tribunal administratif'
const CAA = 'La cour administrative d’appel'
const CA = 'La cour d’appel'
const CE = 'Le Conseil d’État'
const CASS = 'La Cour de cassation'
const CC = 'Le Conseil constitutionnel'
const TC = 'Le Tribunal des conflits'
const CEDH = 'La Cour européenne des droits de l’homme'
const CJUE = 'La Cour de justice de l’Union européenne'

export const AFFAIRES: readonly Affaire[] = [
  // --- Dès le départ : la première instance, chaque juge à sa place ---------
  { id: 'licenciement', situation: 'Une salariée conteste son licenciement pour faute grave.', reponse: CPH, leurres: [TCOM, TA, TJ], from: 1, tip: 'Le conseil de prud’hommes juge les litiges individuels nés du contrat de travail, entre un salarié et son employeur.' },
  { id: 'heures-sup', situation: 'Un serveur réclame à son patron trois mois d’heures supplémentaires impayées.', reponse: CPH, leurres: [TCOM, TPOL, TA], from: 1, tip: 'Un salaire impayé est un litige du contrat de travail : prud’hommes, quel que soit le montant.' },
  { id: 'divorce', situation: 'Deux époux veulent divorcer et ne s’entendent pas sur la garde des enfants.', reponse: JAF, leurres: [JCP, TPE, CPH], from: 1, tip: 'Le juge aux affaires familiales, au tribunal judiciaire, tranche le divorce, l’autorité parentale et la résidence des enfants.' },
  { id: 'pension', situation: 'Un père cesse de verser la pension alimentaire fixée pour son fils ; la mère veut la faire réviser.', reponse: JAF, leurres: [JCP, TPE, TA], from: 1, tip: 'Fixer ou réviser une pension alimentaire relève du juge aux affaires familiales.' },
  { id: 'commercants', situation: 'Deux sociétés commerciales se disputent une livraison de marchandises jamais payée.', reponse: TCOM, leurres: [CPH, TA, TPOL], from: 1, tip: 'Le tribunal de commerce, composé de juges commerçants élus, juge les litiges entre commerçants et entre sociétés commerciales.' },
  { id: 'redressement', situation: 'Une société qui tient un magasin de vêtements, en cessation des paiements, demande l’ouverture d’un redressement judiciaire.', reponse: TCOM, leurres: [CPH, TA, TCORR], from: 1, tip: 'Les procédures collectives d’un commerçant (sauvegarde, redressement, liquidation) relèvent du tribunal de commerce.' },
  { id: 'vol', situation: 'Un majeur est poursuivi pour le vol d’un scooter.', reponse: TCORR, leurres: [TPOL, ASSISES, TA], from: 1, tip: 'Le vol simple est un délit : il est jugé par le tribunal correctionnel.' },
  { id: 'alcool', situation: 'Un automobiliste est arrêté avec 1 g d’alcool par litre de sang.', reponse: TCORR, leurres: [TPOL, ASSISES, TA], from: 1, tip: 'À partir de 0,8 g/L de sang, la conduite sous l’empire d’un état alcoolique est un délit : tribunal correctionnel.' },
  { id: 'tapage', situation: 'Un voisin est poursuivi pour tapage nocturne.', reponse: TPOL, leurres: [TCORR, ASSISES, TA], from: 1, tip: 'Le tapage nocturne est une contravention : les contraventions sont jugées par le tribunal de police.' },
  { id: 'meurtre', situation: 'Un homme est accusé de meurtre.', reponse: ASSISES, leurres: [TCORR, CCD, TPOL], from: 1, tip: 'Le meurtre, puni de trente ans de réclusion criminelle, est jugé par la cour d’assises, avec un jury populaire.' },
  { id: 'permis-construire', situation: 'Le maire refuse un permis de construire ; le propriétaire veut faire annuler ce refus.', reponse: TA, leurres: [TJ, CE, CCD], from: 1, tip: 'Une décision d’une autorité administrative se conteste devant le juge administratif, en premier lieu le tribunal administratif.' },
  { id: 'titre-sejour', situation: 'Un étudiant étranger conteste le refus de titre de séjour pris par le préfet.', reponse: TA, leurres: [TJ, CE, CC], from: 1, tip: 'L’arrêté du préfet est un acte administratif : recours devant le tribunal administratif.' },
  { id: 'voisin-dette', situation: 'Ton voisin refuse de te rembourser les 3 000 € que tu lui as prêtés.', reponse: TJ, leurres: [TCOM, TA, CPH], from: 1, tip: 'Un litige civil entre particuliers relève du tribunal judiciaire, la juridiction civile de droit commun.' },
  { id: 'vice-cache', situation: 'Un particulier réclame 40 000 € à son ancien vendeur pour un vice caché de la maison achetée.', reponse: TJ, leurres: [TCOM, TA, CPH], from: 1, tip: 'Un litige civil entre particuliers au-delà de 10 000 € relève du tribunal judiciaire, avec avocat obligatoire.' },

  // --- Confirmé : les juges spécialisés et les voies de recours -------------
  { id: 'expulsion', situation: 'Un propriétaire demande l’expulsion de son locataire qui ne paie plus son loyer.', reponse: JCP, leurres: [JAF, TCOM, TA], from: 3, tip: 'Le bail d’habitation et l’expulsion relèvent du juge des contentieux de la protection, au tribunal judiciaire.' },
  { id: 'credit-conso', situation: 'Une banque poursuit un client qui ne rembourse plus son crédit à la consommation.', reponse: JCP, leurres: [TCOM, JAF, TA], from: 3, tip: 'Le crédit à la consommation est un contentieux de la protection : il est confié au juge des contentieux de la protection.' },
  { id: 'tutelle', situation: 'Une famille demande la mise sous tutelle de sa grand-mère, qui ne peut plus gérer ses affaires.', reponse: JCP, leurres: [JAF, TPE, TA], from: 3, tip: 'Depuis 2020, le juge des contentieux de la protection est le juge des tutelles des majeurs.' },
  { id: 'mineur-delit', situation: 'Un adolescent de 15 ans est poursuivi pour avoir volé et revendu des téléphones.', reponse: TPE, leurres: [TCORR, JAF, ASSISES], from: 3, tip: 'Un mineur auteur d’un délit est jugé par le juge des enfants ou le tribunal pour enfants, jamais par le tribunal correctionnel.' },
  { id: 'appel-tj', situation: 'Le perdant d’un procès devant le tribunal judiciaire veut être rejugé en fait et en droit.', reponse: CA, leurres: [CASS, CE, CAA], from: 3, tip: 'L’appel d’un jugement civil de première instance est porté devant la cour d’appel, qui rejuge toute l’affaire.' },
  { id: 'appel-prudhommes', situation: 'Un employeur condamné par le conseil de prud’hommes fait appel.', reponse: CA, leurres: [CASS, CAA, CE], from: 3, tip: 'L’appel d’un jugement prud’homal va à la chambre sociale de la cour d’appel.' },
  { id: 'appel-ta', situation: 'Une commune perd devant le tribunal administratif et fait appel.', reponse: CAA, leurres: [CA, CASS, CC], from: 3, tip: 'L’appel d’un jugement du tribunal administratif se porte devant la cour administrative d’appel.' },
  { id: 'pourvoi-civil', situation: 'Après un arrêt de cour d’appel, une partie estime que les juges ont mal appliqué la loi.', reponse: CASS, leurres: [CE, CC, CEDH], from: 3, tip: 'Le pourvoi en cassation contre une décision judiciaire rendue en dernier ressort : la Cour de cassation juge le droit, pas les faits.' },
  { id: 'pourvoi-admin', situation: 'Une société conteste en droit l’arrêt d’une cour administrative d’appel.', reponse: CE, leurres: [CASS, CC, TC], from: 3, tip: 'Le Conseil d’État est le juge de cassation de l’ordre administratif.' },
  { id: 'decret', situation: 'Une association veut faire annuler un décret du Premier ministre.', reponse: CE, leurres: [TA, CC, CASS], from: 3, tip: 'Le recours contre un décret se porte directement devant le Conseil d’État, en premier et dernier ressort.' },
  { id: 'escroquerie', situation: 'Un faux conseiller bancaire est poursuivi pour avoir escroqué des retraités.', reponse: TCORR, leurres: [TPOL, ASSISES, TCOM], from: 3, tip: 'L’escroquerie est un délit, puni jusqu’à cinq ans d’emprisonnement : tribunal correctionnel.' },

  // --- Expert : les cours suprêmes, les conflits, l'Europe -----------------
  { id: 'crime-15-ans', situation: 'Un majeur non récidiviste est accusé d’un crime puni de quinze ans de réclusion criminelle.', reponse: CCD, leurres: [ASSISES, TCORR, TPE], from: 4, tip: 'Depuis le 1er janvier 2023, la cour criminelle départementale, cinq magistrats sans jury, juge les crimes punis de 15 ou 20 ans commis par des majeurs hors récidive.' },
  { id: 'appel-assises', situation: 'Un accusé condamné par une cour d’assises fait appel de l’arrêt.', reponse: 'Une autre cour d’assises', leurres: [CA, CASS, CCD], from: 4, tip: 'Depuis la loi du 15 juin 2000, l’appel d’un arrêt d’assises est jugé par une autre cour d’assises, désignée par la Cour de cassation, avec un jury plus nombreux.' },
  { id: 'qpc', situation: 'Une question prioritaire de constitutionnalité est transmise par la Cour de cassation.', reponse: CC, leurres: [CE, CEDH, TC], from: 4, tip: 'Depuis 2010, le Conseil constitutionnel juge les QPC que lui renvoient le Conseil d’État ou la Cour de cassation.' },
  { id: 'loi-avant', situation: 'Soixante députés contestent une loi votée, avant sa promulgation.', reponse: CC, leurres: [CE, CASS, CEDH], from: 4, tip: 'Le contrôle a priori des lois, saisi par soixante députés ou soixante sénateurs depuis 1974, appartient au Conseil constitutionnel.' },
  { id: 'elections-legislatives', situation: 'Un candidat battu conteste l’élection d’un député dans sa circonscription.', reponse: CC, leurres: [TA, CE, TJ], from: 4, tip: 'Le contentieux des élections législatives appartient au Conseil constitutionnel (article 59 de la Constitution).' },
  { id: 'conflit', situation: 'Le juge judiciaire et le juge administratif se déclarent tous deux compétents pour la même affaire.', reponse: TC, leurres: [CC, CE, CASS], from: 4, tip: 'Le Tribunal des conflits, rétabli par la loi du 24 mai 1872, répartit les affaires entre l’ordre judiciaire et l’ordre administratif.' },
  { id: 'cedh', situation: 'Après avoir épuisé tous les recours en France, un détenu se plaint de traitements inhumains.', reponse: CEDH, leurres: [CJUE, CC, CASS], from: 4, tip: 'La Cour européenne des droits de l’homme, à Strasbourg, juge le respect de la Convention une fois les voies de recours internes épuisées.' },
  { id: 'prejudicielle', situation: 'Un juge français hésite sur le sens d’une directive européenne et pose une question préjudicielle.', reponse: CJUE, leurres: [CEDH, CC, CE], from: 4, tip: 'Le renvoi préjudiciel sur l’interprétation du droit de l’Union se pose à la Cour de justice de l’Union européenne, à Luxembourg.' },
]

export const TRIBUNAL_TIER_BRIEF: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'La première instance : chaque juge à sa place',
  2: 'La première instance : chaque juge à sa place',
  3: 'Les juges spécialisés et les voies de recours',
  4: 'Les cours suprêmes, les conflits et l’Europe',
  5: 'Les cours suprêmes, les conflits et l’Europe',
}

/** Les affaires tirables à ce palier. */
export function affairesDuPalier(tier: number): Affaire[] {
  const level = Math.min(5, Math.max(1, Math.round(tier))) || DEFAULT_PALIER
  return AFFAIRES.filter((a) => a.from <= level)
}

export function buildQuelTribunalPool(
  seed: string,
  count = 30,
  tier: number = DEFAULT_PALIER,
): ModeQuestion[] {
  const rng = seededRng(`quel-tribunal:${seed}:${tier}`)
  const stock = affairesDuPalier(tier)
  const ordre: Affaire[] = []
  while (ordre.length < count) ordre.push(...shuffleWith(rng, stock))
  return ordre.slice(0, count).map((affaire, i) => {
    const options = shuffleWith(rng, [affaire.reponse, ...affaire.leurres])
    return {
      id: `jx-droit-${affaire.id}-${i}`,
      prompt: affaire.situation,
      options,
      correctIndex: options.indexOf(affaire.reponse),
      explanation: affaire.tip,
      subject: MATIERE_QUEL_TRIBUNAL,
    }
  })
}
