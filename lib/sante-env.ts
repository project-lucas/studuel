// Santé de la CONFIGURATION : les variables d'environnement manquantes, et ce
// qu'elles éteignent.
//
// POURQUOI CE MODULE EXISTE, à côté de `lib/sante.ts`. Le projet a deux façons
// de laisser une fonctionnalité dans le noir, et jusqu'ici il n'en surveillait
// qu'une :
//
//   · une MIGRATION jamais exécutée  → `lib/sante.ts`, /admin/sante
//   · une VARIABLE jamais posée      → rien du tout
//
// Le second cas n'est pas théorique. Au 26/08/2026, TOUT le push est écrit et
// testé — `app/api/push/subscribe`, `app/api/push/send`, `lib/notifications`,
// le service worker, le cron GitHub Actions — et rien ne peut partir : il
// manque trois variables. Pendant ce temps, l'élève lit « Les rappels push
// arrivent très bientôt » depuis le mois de juillet. Une promesse qui ne se
// tient pas se renouvelle à chaque visite.
//
// C'est exactement le mode de panne que `lib/sante.ts` existe pour tuer :
// l'ÉCHEC SILENCIEUX. Le code tolère l'absence de sa configuration — il le
// doit, sinon un déploiement incomplet casserait l'app — donc personne ne voit
// rien.
//
// ⚠️ ON NE LIT QUE LA PRÉSENCE, JAMAIS LA VALEUR. Ce module reçoit un ensemble
// de NOMS de variables présentes, et n'a aucun moyen d'accéder à leur contenu.
// Une clé privée VAPID ou un secret de cron n'a rien à faire dans un écran
// d'admin, ni dans un log, ni dans un rendu React qui pourrait être capturé.
//
// Logique pure, testable sans environnement : voir sante-env.test.ts.

export type PorteeVar =
  /** Lue par le serveur (fonctions Vercel, routes API). */
  | 'serveur'
  /** Compilée dans le bundle client — donc PUBLIQUE par construction. */
  | 'client'
  /** Posée sur le dépôt GitHub, pas sur Vercel (secrets d'Actions). */
  | 'github'

export type VarSante = {
  nom: string
  portee: PorteeVar
  /** La fonctionnalité qu'elle allume. */
  feature: string
  /** Ce que l'utilisateur voit TANT QU'ELLE MANQUE. */
  siAbsente: string
  /**
   * Vrai quand l'absence n'éteint rien : la variable a un repli acceptable.
   * Elle est alors signalée en information, pas en panne.
   */
  facultative?: boolean
}

/**
 * Les variables dont l'absence éteint quelque chose de visible.
 *
 * Volontairement COURTE : on n'y met pas les variables sans lesquelles l'app ne
 * démarre pas (l'URL et la clé Supabase) — leur absence se voit tout de suite,
 * elles n'ont pas besoin d'une surveillance. Ce catalogue est fait pour les
 * variables dont l'absence est SILENCIEUSE.
 */
export const VARS_SANTE: readonly VarSante[] = [
  {
    nom: 'NEXT_PUBLIC_VAPID_PUBLIC_KEY',
    portee: 'client',
    feature: 'Notifications push — l’abonnement du navigateur',
    siAbsente:
      'L’élève lit « Les rappels push arrivent très bientôt » et le bouton d’activation n’apparaît jamais (`NotificationsOptIn` passe en état `unconfigured`). Aucune erreur, aucun log : la promesse se renouvelle simplement à chaque visite.',
  },
  {
    nom: 'VAPID_PUBLIC_KEY',
    portee: 'serveur',
    feature: 'Notifications push — la signature des envois',
    siAbsente:
      '`app/api/push/send` refuse d’envoyer. Même si un élève était abonné, aucune notification ne partirait — ni rappel du soir, ni relance de série.',
  },
  {
    nom: 'VAPID_PRIVATE_KEY',
    portee: 'serveur',
    feature: 'Notifications push — la signature des envois (clé privée)',
    siAbsente:
      'Identique à la clé publique : sans la paire complète, `app/api/push/send` ne signe rien et n’envoie rien.',
  },
  {
    nom: 'CRON_SECRET',
    portee: 'serveur',
    feature: 'Rappels planifiés — l’authentification du cron',
    siAbsente:
      'La route d’envoi refuse l’appel du cron (401). Les trois créneaux du workflow GitHub Actions (matin, soir, lundi) échouent en silence côté serveur — et le workflow, lui, sait le dire : il vérifie son propre secret avant d’appeler.',
  },
  {
    nom: 'VAPID_SUBJECT',
    portee: 'serveur',
    feature: 'Notifications push — l’adresse de contact du protocole',
    siAbsente:
      'Repli sur `mailto:contact@studuel.app`. Rien ne casse ; à poser le jour où l’adresse de contact change.',
    facultative: true,
  },
]

export type VerdictVar = 'posee' | 'manquante' | 'manquante-facultative'

/**
 * L'état de chaque variable, à partir des seuls NOMS présents.
 *
 * Une variable présente mais VIDE compte comme manquante : `process.env.X = ''`
 * est le piège classique d'un panneau de configuration où l'on a créé la ligne
 * sans coller la valeur, et il se lit « posée » à toute vérification naïve.
 * L'appelant doit donc ne transmettre que les noms dont la valeur est non vide.
 */
export function verdictsEnv(
  presentes: ReadonlySet<string>,
  vars: readonly VarSante[] = VARS_SANTE,
): Map<string, VerdictVar> {
  const out = new Map<string, VerdictVar>()
  for (const v of vars) {
    if (presentes.has(v.nom)) out.set(v.nom, 'posee')
    else out.set(v.nom, v.facultative ? 'manquante-facultative' : 'manquante')
  }
  return out
}

/** Celles qui éteignent vraiment quelque chose. */
export function varsManquantes(
  verdicts: ReadonlyMap<string, VerdictVar>,
  vars: readonly VarSante[] = VARS_SANTE,
): VarSante[] {
  return vars.filter((v) => verdicts.get(v.nom) === 'manquante')
}

/**
 * Les fonctionnalités entièrement éteintes — celles dont TOUTES les variables
 * manquent.
 *
 * La nuance vaut d'être faite : une paire VAPID à moitié posée est un état
 * PIRE qu'une paire absente, parce qu'elle donne l'impression que la
 * configuration a été faite. Le nombre de variables manquantes par
 * fonctionnalité est donc rendu tel quel, sans être résumé en un booléen.
 */
export function resumeParPortee(
  verdicts: ReadonlyMap<string, VerdictVar>,
  vars: readonly VarSante[] = VARS_SANTE,
): { portee: PorteeVar; posees: number; manquantes: number }[] {
  const portees: PorteeVar[] = ['client', 'serveur', 'github']
  return portees
    .map((portee) => {
      const dedans = vars.filter((v) => v.portee === portee)
      return {
        portee,
        posees: dedans.filter((v) => verdicts.get(v.nom) === 'posee').length,
        manquantes: dedans.filter((v) => verdicts.get(v.nom) === 'manquante')
          .length,
      }
    })
    .filter((r) => r.posees + r.manquantes > 0)
}
