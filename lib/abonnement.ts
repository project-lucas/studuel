// Abonnements — logique pure de la « caisse v0 » (migration 221), testée.
//
// LE CONTEXTE : aucun prestataire de paiement n'est branché, et
// `profiles.subscription_tier` n'était écrit par aucune ligne de code. Cliquer
// « Choisir cette offre » n'enregistrait RIEN — pas même l'intention. Cette
// v0 enregistre l'intention côté élève et laisse un admin accorder réellement
// l'abonnement, avec une échéance et une trace.
//
// Ici : uniquement ce qui se raisonne sans base — validation du contact,
// bornes de durée, lecture d'une échéance. Le reste vit dans la migration
// (`grant_subscription`, `expire_subscriptions`), côté serveur, où c'est
// vérifiable.

export type PlanPayant = 'tier1' | 'tier2' | 'tier3'
export const PLANS_PAYANTS: readonly PlanPayant[] = ['tier1', 'tier2', 'tier3']

export function estPlanPayant(valeur: string): valeur is PlanPayant {
  return (PLANS_PAYANTS as readonly string[]).includes(valeur)
}

// Un contact est FACULTATIF : un élève qui montre son envie compte aussi, et
// exiger l'email d'un parent avant même de savoir s'il est intéressé fait
// fuir. Mais s'il est fourni, il doit être exploitable — sinon on croit avoir
// un moyen de rappeler alors qu'on n'a rien.
export type ContactVerifie =
  | { ok: true; valeur: string | null }
  | { ok: false; raison: string }

const MAX_CONTACT = 160
const MAX_NOTE = 500

export function verifierContact(brut: string | null | undefined): ContactVerifie {
  const valeur = (brut ?? '').trim()
  if (valeur === '') return { ok: true, valeur: null }
  if (valeur.length > MAX_CONTACT) {
    return { ok: false, raison: 'Ce contact est trop long.' }
  }

  const estEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valeur)
  // Téléphone : on tolère espaces, points, tirets et l'indicatif international,
  // puis on compte les CHIFFRES — un numéro français en compte 10 (9 avec +33).
  const chiffres = valeur.replace(/\D/g, '')
  const estTelephone = /^\+?[\d\s.\-()]{9,}$/.test(valeur) && chiffres.length >= 9

  if (!estEmail && !estTelephone) {
    return { ok: false, raison: 'Indique un email ou un numéro de téléphone.' }
  }
  return { ok: true, valeur }
}

export function verifierNote(brut: string | null | undefined): string | null {
  const valeur = (brut ?? '').trim()
  if (valeur === '') return null
  return valeur.slice(0, MAX_NOTE)
}

// Durée d'un octroi. Bornée des DEUX côtés, et la borne haute compte autant :
// « 999 mois » est la façon la plus courante de transformer un abonnement en
// cadeau à vie sans s'en apercevoir. 0 = révocation.
export const MOIS_MAX = 36

export function verifierMois(brut: unknown): number | null {
  const n = Number(brut)
  if (!Number.isInteger(n) || n < 0 || n > MOIS_MAX) return null
  return n
}

// Un abonnement est actif si son échéance est dans le futur — ou s'il n'en a
// pas (offert, compte interne). `null` d'échéance ≠ expiré.
export function estActif(
  expiresAt: string | null | undefined,
  maintenant: Date = new Date(),
): boolean {
  if (!expiresAt) return true
  const date = new Date(expiresAt)
  if (Number.isNaN(date.getTime())) return false
  return date.getTime() > maintenant.getTime()
}

// Jours restants (arrondi au jour supérieur : « il reste 1 jour » tant qu'il
// reste quelque chose). null = pas d'échéance. 0 = expiré.
export function joursRestants(
  expiresAt: string | null | undefined,
  maintenant: Date = new Date(),
): number | null {
  if (!expiresAt) return null
  const date = new Date(expiresAt)
  if (Number.isNaN(date.getTime())) return 0
  const ms = date.getTime() - maintenant.getTime()
  return ms <= 0 ? 0 : Math.ceil(ms / 86_400_000)
}

// Libellé court d'une échéance, pour l'écran admin comme pour l'élève.
export function libelleEcheance(
  expiresAt: string | null | undefined,
  maintenant: Date = new Date(),
): string {
  const jours = joursRestants(expiresAt, maintenant)
  if (jours === null) return 'sans échéance'
  if (jours === 0) return 'expiré'
  if (jours === 1) return 'expire demain'
  if (jours <= 31) return `expire dans ${jours} jours`
  const mois = Math.round(jours / 30)
  return `expire dans ~${mois} mois`
}
