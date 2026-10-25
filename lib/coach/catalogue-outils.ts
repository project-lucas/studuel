// -----------------------------------------------------------------------------
// LE CATALOGUE DES OUTILS DE MARCEL — l'onglet « Outils » du bureau (16/10/2026).
//
// Lucas : « dans Outils, on peut proposer énormément de fonctionnalités — scan
// mon cours, résume mon cours, corrige ma copie… — que les freemium voient le
// côté outil et soient super contents du nombre de fonctionnalités », puis,
// après un essai à huit : « je préfère quand on mettait beaucoup d'outils à
// disposition, une succession de blocs carrés avec quelques mots ». Le même
// catalogue est montré à TOUT LE MONDE : ouvert pour Studuel+, couronné pour le
// gratuit.
//
// Vingt-quatre outils, rangés par ce que l'élève veut FAIRE (Comprendre,
// Réviser, S'entraîner, Corriger), six par famille. Un outil mène :
//   • soit à un MODE du champ (lib/coach/outils) — il arme la consigne, et la
//     demande coûte UN CAFÉ, comme une question (lib/coach/credits) ;
//   • soit à une PAGE qui existe déjà (la méthode, l'oral, le contrôle blanc,
//     la file « À revoir », le mode examen) — elle est OFFERTE.
// Chaque outil a SON dessin dans la famille de la barre d'onglets
// (scripts/marcel-illustrations.mjs) ; six reprennent celui de leur support
// dans Réviser.
//
// LE COÛT EN CAFÉ (25/10/2026, Lucas : « corrige le coût en café de chaque
// outil ») : il est écrit au bas de chaque bloc — « 1 » et la dosette pour un
// mode, « Offert » pour une page — et la tête des outils dit le solde et le
// barème (« Il te reste 174 cafés · une demande = 1 café »). Un seul barème :
// `coach_ask_allowed` ne connaît pas de coût par outil ; des outils à plusieurs
// cafés demanderaient une migration. Les `mots` de chaque outil ne s'affichent
// plus (Lucas : « retire le sous-texte gris ») : ils restent la description
// lue par les lecteurs d'écran.
//
// Logique PURE et testée (catalogue-outils.test.ts).
// -----------------------------------------------------------------------------

import { COUT_QUESTION, motCafes } from './credits'
import type { ModeCle } from './outils'

export type FamilleOutil = 'comprendre' | 'reviser' | 'entrainer' | 'corriger'

export type CibleOutil = { type: 'mode'; mode: ModeCle } | { type: 'page'; href: string }

export type Outil = {
  id: string
  label: string
  /** Quelques mots qui disent ce qu'on obtient — lus par les lecteurs d'écran, plus affichés. */
  mots: string
  famille: FamilleOutil
  cible: CibleOutil
  /** Le dessin de l'outil (public/). */
  image: string
}

export const FAMILLES: { id: FamilleOutil; label: string }[] = [
  { id: 'comprendre', label: 'Comprendre' },
  { id: 'reviser', label: 'Réviser' },
  { id: 'entrainer', label: 'S’entraîner' },
  { id: 'corriger', label: 'Corriger' },
]

const mode = (m: ModeCle): CibleOutil => ({ type: 'mode', mode: m })
const page = (href: string): CibleOutil => ({ type: 'page', href })
const dessin = (id: string) => `/images/marcel/outils/${id}.webp`
const support = (id: string) => `/images/supports/${id}.webp`

export const OUTILS: Outil[] = [
  // Comprendre
  { id: 'explique', label: 'Explique-moi', mots: 'Une notion, simplement', famille: 'comprendre', cible: mode('explique'), image: dessin('explique') },
  { id: 'scan', label: 'Scan mon cours', mots: 'Une photo, une fiche', famille: 'comprendre', cible: mode('fiche'), image: dessin('scan') },
  { id: 'resume', label: 'Résume mon cours', mots: 'L’essentiel en 10 lignes', famille: 'comprendre', cible: mode('resume'), image: dessin('resume') },
  { id: 'schema', label: 'Explique ce schéma', mots: 'Un document lu avec toi', famille: 'comprendre', cible: mode('schema'), image: dessin('schema') },
  { id: 'traduis', label: 'Traduis-moi', mots: 'Mot à mot, compris', famille: 'comprendre', cible: mode('traduis'), image: dessin('traduis') },
  { id: 'definition', label: 'Le mot juste', mots: 'Une définition à recopier', famille: 'comprendre', cible: mode('definition'), image: dessin('definition') },
  // Réviser
  { id: 'fiche', label: 'Fais-moi une fiche', mots: 'Ton chapitre en une page', famille: 'reviser', cible: mode('fiche'), image: support('carte') },
  { id: 'flashcards', label: 'Mes flashcards', mots: 'Des cartes à réviser', famille: 'reviser', cible: mode('flashcards'), image: dessin('flashcards') },
  { id: 'carte', label: 'Carte mentale', mots: 'Ton chapitre en branches', famille: 'reviser', cible: mode('carte'), image: dessin('carte') },
  { id: 'plan', label: 'Plan de contrôle', mots: 'Jour par jour', famille: 'reviser', cible: mode('plan'), image: dessin('plan') },
  { id: 'planning', label: 'Ma semaine', mots: 'Tes soirées organisées', famille: 'reviser', cible: mode('planning'), image: dessin('planning') },
  { id: 'erreurs', label: 'Mes erreurs', mots: 'Ce que tu as raté', famille: 'reviser', cible: page('/reviser/revoir'), image: support('erreurs') },
  // S'entraîner
  { id: 'interroge', label: 'Interroge-moi', mots: 'Une question à la fois', famille: 'entrainer', cible: mode('interroge'), image: support('quiz') },
  { id: 'exos', label: 'Exos sur mesure', mots: 'Du facile au difficile', famille: 'entrainer', cible: mode('exos'), image: support('exercice') },
  { id: 'controle', label: 'Contrôle blanc', mots: 'Un vrai sujet, noté', famille: 'entrainer', cible: page('/marcel?vue=entrainement'), image: support('cahier') },
  { id: 'examen', label: 'Mode examen', mots: 'Brevet ou bac', famille: 'entrainer', cible: page('/marcel?onglet=examen'), image: dessin('examen') },
  { id: 'oral', label: 'Oral blanc', mots: 'Présente, je t’écoute', famille: 'entrainer', cible: page('/marcel?vue=oral'), image: dessin('oral') },
  { id: 'methode', label: 'La méthode', mots: 'Comment travailler', famille: 'entrainer', cible: page('/marcel?vue=methode'), image: support('programme') },
  // Corriger
  { id: 'copie', label: 'Corrige ma copie', mots: 'Une photo, relue', famille: 'corriger', cible: mode('copie'), image: dessin('copie') },
  { id: 'calcul', label: 'Mon calcul', mots: 'Où ça déraille', famille: 'corriger', cible: mode('calcul'), image: dessin('calcul') },
  { id: 'redaction', label: 'Ma rédaction', mots: 'Idées, plan, langue', famille: 'corriger', cible: mode('redaction'), image: dessin('redaction') },
  { id: 'langue', label: 'Mes langues', mots: 'Tes phrases corrigées', famille: 'corriger', cible: mode('langue'), image: dessin('langue') },
  { id: 'exercice', label: 'Je bloque', mots: 'La méthode, pas la réponse', famille: 'corriger', cible: mode('exercice'), image: dessin('bloque') },
  { id: 'expose', label: 'Mon exposé', mots: 'Ton plan d’oral relu', famille: 'corriger', cible: mode('expose'), image: dessin('expose') },
]

export function outilsDe(famille: FamilleOutil): Outil[] {
  return OUTILS.filter((o) => o.famille === famille)
}

/** Ce qu'un outil coûte : des cafés (un mode du champ) ou rien (une page). */
export type CoutOutil = { type: 'cafes'; cafes: number } | { type: 'offert' }

export function coutOutil(outil: Pick<Outil, 'cible'>): CoutOutil {
  return outil.cible.type === 'page' ? { type: 'offert' } : { type: 'cafes', cafes: COUT_QUESTION }
}

/** « 1 café » ou « Offert » — ce que lit un lecteur d'écran au bas du bloc. */
export function libelleCoutOutil(outil: Pick<Outil, 'cible'>): string {
  const cout = coutOutil(outil)
  return cout.type === 'offert' ? 'Offert' : motCafes(cout.cafes)
}
