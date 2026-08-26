// Le garde-fou des policies RLS : détecter un appel d'auth « nu » dans un
// CREATE POLICY, avant qu'il n'atteigne la base.
//
// POURQUOI CE MODULE EXISTE. Écrite nue dans une policy, `auth.uid()` est
// traitée par Postgres comme un filtre dépendant de la ligne : il la RÉÉVALUE
// pour chaque ligne examinée, et le planificateur ne peut plus se servir de
// l'index sur `user_id`, faute de constante à comparer. Enveloppée en
// `(SELECT auth.uid())`, elle devient un InitPlan : évaluée UNE fois avant le
// parcours, elle redonne l'index. La valeur rendue est identique — c'est le
// PLANIFICATEUR qui change d'avis, pas la logique.
//
// L'écart ne coûte rien sur mille lignes et devient mortel sur `test_sessions`,
// qui prendra ~3 M de lignes PAR JOUR à cent mille élèves.
//
// La migration 208 avait réparé l'existant, mais sans rien installer de
// permanent : tout ce qui a été écrit après elle est reparti nu — 102 policies
// nues contre 13 enveloppées au 26/08/2026. La 320 pose le mécanisme côté base
// (un event trigger, et un rattrapage appelable si les droits manquent) ; ce
// module-ci pose le garde-fou côté DÉPÔT. Les deux sont utiles et ne se
// remplacent pas : la base répare ce qui existe, le test empêche d'écrire la
// faute une fois de plus.
//
// CE QU'IL NE FAUT SURTOUT PAS SIGNALER : `auth.uid()` dans un CORPS DE
// FONCTION (`v_user UUID := auth.uid();`). Là, l'appel est déjà évalué une
// seule fois, dans une variable — c'est la forme optimale, et la signaler
// ferait de ce garde-fou une machine à faux positifs qu'on finirait par
// désactiver. Seules les policies sont examinées.

/** Les appels d'auth concernés : tous STABLE et sans argument. */
export const AUTH_FNS = ['uid', 'jwt', 'role', 'email'] as const

/** `(SELECT auth.uid())` — la forme voulue, avec ou sans alias ni espaces. */
const ENVELOPPEE = /\(\s*select\s+auth\.(?:uid|jwt|role|email)\s*\(\s*\)(?:\s+as\s+\w+)?\s*\)/gi

/** `auth.uid()` — la forme à proscrire dans une policy. */
const NUE = /auth\.(?:uid|jwt|role|email)\s*\(\s*\)/i

/**
 * Les instructions `CREATE POLICY`, une par entrée.
 *
 * Découpage au point-virgule : une expression de policy n'en contient pas
 * (elle n'a ni bloc ni instruction imbriquée), et les rares apostrophes qu'on
 * y trouve encadrent des littéraux courts. C'est volontairement plus simple
 * qu'un analyseur SQL — ce garde-fou doit rester lisible par quiconque le voit
 * échouer, sinon il sera contourné plutôt que compris.
 */
const INSTRUCTION_POLICY = /create\s+policy\b[\s\S]*?;/gi

export type PolicyNue = {
  /** Nom de la policy, tel qu'écrit. */
  nom: string
  /** Table visée, sans le schéma. */
  table: string
  /** L'appel fautif, pour que le message d'erreur montre quoi corriger. */
  extrait: string
}

/**
 * Les policies d'un fichier SQL qui appellent l'auth sans l'envelopper.
 *
 * Une instruction est jugée SUR CE QU'IL RESTE une fois toutes les formes
 * correctes retirées : c'est le même raisonnement que la migration 208, qui
 * déballe avant de réemballer. Une policy qui mélangerait les deux formes —
 * `(SELECT auth.uid())` ici, `auth.uid()` là — est donc bien signalée, alors
 * qu'une simple recherche de `(SELECT auth.` l'aurait crue propre.
 */
export function policiesNonEnveloppees(sql: string): PolicyNue[] {
  const nues: PolicyNue[] = []

  for (const instruction of sql.match(INSTRUCTION_POLICY) ?? []) {
    const reste = instruction.replace(ENVELOPPEE, '')
    const faute = reste.match(NUE)
    if (!faute) continue

    nues.push({
      nom: nomDeLaPolicy(instruction),
      table: tableDeLaPolicy(instruction),
      extrait: faute[0],
    })
  }

  return nues
}

function nomDeLaPolicy(instruction: string): string {
  // Le nom peut être un identifiant nu ou une chaîne entre guillemets doubles
  // (« exam_papers lisibles par les comptes connectés » en est un).
  const m = instruction.match(/create\s+policy\s+(?:if\s+not\s+exists\s+)?("[^"]+"|[\w]+)/i)
  return m ? m[1].replace(/"/g, '') : '(nom illisible)'
}

function tableDeLaPolicy(instruction: string): string {
  const m = instruction.match(/\bon\s+(?:public\.)?("[^"]+"|[\w]+)/i)
  return m ? m[1].replace(/"/g, '') : '(table illisible)'
}

// -----------------------------------------------------------------------------
// LE PIÈGE DU REVOKE — découvert le 26/08/2026, en production.
//
// La migration 320 crée trois fonctions d'exploitation qui exécutent du DDL en
// SECURITY DEFINER, et croyait les fermer avec :
//
//     REVOKE ALL ON FUNCTION public.optimiser_une_policy(OID) FROM PUBLIC;
//
// Ça ne suffit pas. Supabase accorde `EXECUTE` sur les fonctions du schéma
// `public` aux rôles `anon` et `authenticated` par des GRANT EXPLICITES (ses
// `ALTER DEFAULT PRIVILEGES`), et `REVOKE … FROM PUBLIC` ne retire que le
// privilège du pseudo-rôle PUBLIC — il ne touche pas à un GRANT nommé.
//
// Résultat mesuré après exécution : un appel ANONYME à la fonction répondait
// HTTP 200. Le pire des deux mondes, puisque la ligne de REVOKE donnait
// l'illusion que la question était traitée.
//
// D'où ce garde-fou. Il ne juge pas s'il FAUT révoquer — c'est une décision de
// conception. Il vérifie seulement qu'un REVOKE écrit avec l'intention de
// fermer une fonction ferme bien les trois rôles, et pas un seul.
// -----------------------------------------------------------------------------

/** Les rôles que Supabase expose à l'API REST. */
export const ROLES_API = ['anon', 'authenticated'] as const

const INSTRUCTION_REVOKE = /revoke\s+[\s\S]*?on\s+function[\s\S]*?;/gi

export type RevokeIncomplet = {
  /** La fonction visée, telle qu'écrite. */
  fonction: string
  /** Les rôles API que ce REVOKE oublie. */
  manquants: string[]
}

/**
 * Les `REVOKE … ON FUNCTION` qui ne ferment que PUBLIC.
 *
 * Un REVOKE qui ne cite AUCUN des trois (ni PUBLIC ni les rôles API) n'est pas
 * signalé : il vise un rôle nommé pour une raison qui le regarde. On ne
 * signale que le cas précis du piège — PUBLIC seul, sans `anon` ni
 * `authenticated`.
 */
export function revokesIncomplets(sql: string): RevokeIncomplet[] {
  const incomplets: RevokeIncomplet[] = []

  // Les COMMENTAIRES sont retirés d'abord, et ce n'est pas un détail : la
  // migration 324 cite en exemple la ligne fautive qu'elle répare. Un
  // détecteur qui lit les commentaires signale la documentation de la faute
  // comme étant la faute — et rend impossible d'expliquer un piège sans le
  // déclencher.
  for (const instruction of sansCommentaires(sql).match(INSTRUCTION_REVOKE) ?? []) {
    const cible = instruction.slice(instruction.toLowerCase().lastIndexOf('from'))
    // Les frontieres de mot comptent : sans elles, le `public.` du nom
    // qualifie de la fonction ferait croire que le role PUBLIC est vise.
    if (!/\bpublic\b/i.test(cible)) continue

    const manquants = ROLES_API.filter(
      // String.raw, parce que `\b` dans un litteral JS ordinaire est le
      // caractere d'EFFACEMENT, pas une frontiere de mot. Ecrit sans lui, ce
      // garde-fou cherchait des caracteres de controle et ne trouvait jamais
      // rien : il aurait passe au vert sur la faute qu'il existe pour attraper.
      (role) => !new RegExp(String.raw`\b${role}\b`, 'i').test(cible),
    )
    if (manquants.length === 0) continue

    const nom = instruction.match(/on\s+function\s+(?:public\.)?([\w]+)/i)
    incomplets.push({
      fonction: nom ? nom[1] : '(fonction illisible)',
      manquants,
    })
  }

  return incomplets
}

/**
 * Retire les commentaires SQL — lignes `--` et blocs. Sans quoi un fichier qui
 * DOCUMENTE une faute (« voici ce qu'il ne faut pas écrire ») serait signalé
 * comme la commettant.
 */
function sansCommentaires(sql: string): string {
  return sql.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/--[^\n]*/g, ' ')
}
