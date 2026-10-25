// LES PAGES LÉGALES (25/10/2026) — l'identité de l'éditeur et des
// prestataires, en UN endroit : CGU, confidentialité, mentions légales et la
// page de suppression de compte la lisent toutes ici.
//
// Une valeur qui commence par `A_COMPLETER` s'affiche en surligné jaune sur
// les pages : elle attend une décision ou une information de Lucas. Aucune
// page légale ne doit partir en production avec une de ces valeurs.

export const A_COMPLETER = 'À compléter'

export function aCompleter(valeur: string): boolean {
  return valeur.startsWith(A_COMPLETER)
}

export const EDITEUR = {
  marque: 'Studuel',
  raisonSociale: `${A_COMPLETER} : nom de la société (ou nom et prénom de l’entrepreneur individuel)`,
  forme: `${A_COMPLETER} : forme juridique et capital (SAS au capital de … €, EI…)`,
  siret: `${A_COMPLETER} : SIRET`,
  adresse: `${A_COMPLETER} : adresse du siège`,
  directeurPublication: `${A_COMPLETER} : directeur de la publication`,
  email: 'contact@studuel.app',
  site: 'studuel.app',
  mediateur: `${A_COMPLETER} : médiateur de la consommation (nom et site)`,
} as const

/** La date de la dernière mise à jour des pages légales, affichée en tête. */
export const MISE_A_JOUR_LEGALE = '25 octobre 2026'

export type Prestataire = {
  nom: string
  role: string
  lieu: string
  donnees: string
}

/**
 * Les sous-traitants qui reçoivent des données des élèves. Toute nouvelle
 * intégration (un modèle d'IA, un service d'e-mail, une mesure d'audience)
 * s'ajoute ICI avant d'être mise en production.
 */
export const PRESTATAIRES: readonly Prestataire[] = [
  {
    nom: 'Vercel Inc.',
    role: 'hébergement de l’application',
    lieu: 'serveurs à Paris ; société aux États-Unis',
    donnees: 'toutes les requêtes, le temps de les traiter',
  },
  {
    nom: 'Supabase Inc.',
    role: 'base de données, connexion au compte, fichiers',
    lieu: 'serveurs à Francfort (Allemagne) ; société aux États-Unis',
    donnees: 'le compte et toutes les données de l’app',
  },
  {
    nom: 'Cloudflare Inc.',
    role: 'le stockage des fiches de révision en PDF',
    lieu: 'serveurs en Europe de l’Ouest ; société aux États-Unis',
    donnees: 'l’adresse IP, le temps de télécharger une fiche offerte depuis le site ; rien depuis l’app (c’est notre serveur qui lit le fichier)',
  },
  {
    nom: 'DeepSeek',
    role: 'Marcel, l’assistant de révision (réponses et corrections)',
    lieu: 'Chine',
    donnees: 'les questions posées à Marcel, les fichiers texte joints et le contexte scolaire utile (classe, matières), sans nom ni e-mail',
  },
  {
    nom: 'OpenAI',
    role: 'la lecture des photos de cahier jointes à Marcel',
    lieu: 'États-Unis',
    donnees: 'la photo jointe, sans nom ni e-mail',
  },
  {
    nom: 'Google (Gemini)',
    role: 'le dessin de l’avatar',
    lieu: 'États-Unis',
    donnees: 'la description choisie pour l’avatar, sans photo ni nom',
  },
  {
    nom: 'Anthropic (Claude)',
    role: 'l’assistant de la console des coachs',
    lieu: 'États-Unis',
    donnees: 'des données de suivi pseudonymisées, sans nom d’élève',
  },
  {
    nom: 'Services de notification (Google, Apple, Mozilla)',
    role: 'l’envoi des notifications, si tu les as activées',
    lieu: 'États-Unis',
    donnees: 'une adresse technique de notification et le texte du rappel',
  },
]

export const HEBERGEUR = {
  nom: 'Vercel Inc.',
  adresse: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
  site: 'vercel.com',
} as const
