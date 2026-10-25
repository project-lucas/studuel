// -----------------------------------------------------------------------------
// LA CONSOLE — deux ESPACES bien séparés (16/10/2026, Lucas : « Studuel c'est
// l'app ; Scolaria c'est le coaching scolaire qui utilise l'app Studuel […]
// il faut que ce soit bien plus clair, j'ai du mal à m'y repérer ») :
//
//   SCOLARIA · le coaching   — suivre les élèves, leur parler, organiser les
//                              groupes et les coachs ;
//   STUDUEL · l'app          — piloter l'app : chiffres, contenu, annonces,
//                              business, technique (l'admin seul).
//
// Un sélecteur en haut de la barre latérale passe de l'un à l'autre ; chaque
// espace range ses pages en petites sections. Pur et testé : la barre latérale
// et le tiroir du téléphone lisent la même liste.
// -----------------------------------------------------------------------------

export type IconeConsole =
  | 'eleves'
  | 'messages'
  | 'diffusion'
  | 'assistant'
  | 'groupes'
  | 'insights'
  | 'usage'
  | 'contenu'
  | 'coachs'
  | 'supervision'
  | 'retention'
  | 'erreurs'
  | 'sante'
  | 'marcel'
  | 'abonnements'
  | 'parents'
  | 'studio'
  | 'demandes'
  | 'leads'
  | 'signalementsIa'

export type LienConsole = {
  href: string
  libelle: string
  icone: IconeConsole
  /** Une phrase pour l'infobulle et le sous-titre de la page. */
  aide: string
}

export type SectionConsole = { titre: string; liens: LienConsole[] }

export type EspaceId = 'scolaria' | 'studuel'

export type EspaceConsole = {
  id: EspaceId
  nom: string
  /** Ce que l'espace couvre, en quelques mots. */
  role: string
  /** La page d'arrivée de l'espace. */
  accueil: string
  sections: SectionConsole[]
}

const L = {
  eleves: { href: '/coach', libelle: 'Élèves', icone: 'eleves', aide: 'Tous tes élèves suivis, les décrochés en tête.' },
  messages: { href: '/coach/messages', libelle: 'Messages', icone: 'messages', aide: 'Tes conversations avec les élèves et les parents.' },
  assistant: { href: '/coach/assistant', libelle: 'Assistant IA', icone: 'assistant', aide: 'Le tri du matin : qui contacter aujourd’hui, et quoi lui dire.' },
  groupes: { href: '/coach/groupes', libelle: 'Groupes et codes', icone: 'groupes', aide: 'Tes groupes et le code que les élèves saisissent.' },
  coachs: { href: '/admin/coachs', libelle: 'Coachs', icone: 'coachs', aide: 'Nommer, retirer, voir la charge de chaque coach.' },
  supervision: { href: '/admin/supervision', libelle: 'Supervision', icone: 'supervision', aide: 'Tous les fils de messagerie et les messages signalés.' },
  insights: { href: '/admin/insights', libelle: 'Vue d’ensemble', icone: 'insights', aide: 'Audience, activité, matières, fonctionnalités : l’app en un coup d’œil.' },
  retention: { href: '/admin/retention', libelle: 'Rétention', icone: 'retention', aide: 'Qui revient après l’inscription, cohorte par cohorte.' },
  usage: { href: '/admin/usage', libelle: 'Usage des écrans', icone: 'usage', aide: 'Écrans vus, temps passé, recherches sans résultat.' },
  studio: { href: '/admin', libelle: 'Studio de contenu', icone: 'studio', aide: 'Matières, chapitres, leçons et quiz.' },
  contenu: { href: '/admin/contenu', libelle: 'À corriger', icone: 'contenu', aide: 'Questions ratées par presque tous, quiz difficiles, chapitres jamais ouverts.' },
  diffusion: { href: '/coach/diffusion', libelle: 'Annonces et sondages', icone: 'diffusion', aide: 'Un message ou un sondage à un public : élèves, parents, abonnés…' },
  abonnements: { href: '/admin/abonnements', libelle: 'Abonnements', icone: 'abonnements', aide: 'Les demandes Studuel+ et les abonnés.' },
  marcel: { href: '/admin/marcel', libelle: 'Coût de Marcel', icone: 'marcel', aide: 'L’usage et le coût de l’IA de Marcel.' },
  parents: { href: '/admin/parents', libelle: 'Vidéos parents', icone: 'parents', aide: 'Le programme de vidéos de l’espace parents.' },
  sante: { href: '/admin/sante', libelle: 'Santé', icone: 'sante', aide: 'Les migrations et la configuration.' },
  demandes: { href: '/admin/demandes', libelle: 'Demandes de bilan', icone: 'demandes', aide: 'Les parents qui demandent un bilan sur le site Scolaria.' },
  leads: { href: '/admin/leads', libelle: 'Fiches offertes', icone: 'leads', aide: 'Les visiteurs du site qui demandent leurs 10 fiches, et les inscrits au supérieur.' },
  signalementsIa: { href: '/admin/signalements-ia', libelle: 'Signalements IA', icone: 'signalementsIa', aide: 'Les réponses de Marcel signalées par les élèves.' },
  erreurs: { href: '/admin/erreurs', libelle: 'Erreurs', icone: 'erreurs', aide: 'Les pannes remontées par l’app.' },
} satisfies Record<string, LienConsole>

export function espacesConsole(roles: { coach: boolean; admin: boolean }): EspaceConsole[] {
  const espaces: EspaceConsole[] = []
  if (roles.coach || roles.admin) {
    const organisation: LienConsole[] = roles.admin ? [L.groupes, L.coachs, L.supervision] : [L.groupes]
    espaces.push({
      id: 'scolaria',
      nom: 'Scolaria',
      role: 'Le coaching scolaire',
      accueil: '/coach',
      sections: [
        // Les prospects du site scolaria.fr : l'admin seul (c'est lui qui rappelle).
        ...(roles.admin ? [{ titre: 'Prospects', liens: [L.demandes] }] : []),
        { titre: 'Suivi', liens: [L.eleves, L.messages, L.assistant] },
        // Un coach (non admin) écrit à ses élèves d'ici ; l'admin le fait
        // depuis Studuel › Communication, avec tous les publics.
        ...(roles.admin ? [] : [{ titre: 'Communication', liens: [{ ...L.diffusion, libelle: 'Message à mes élèves', aide: 'Un message ou un sondage à tous tes élèves, ou à un groupe.' }] }]),
        { titre: 'Organisation', liens: organisation },
      ],
    })
  }
  if (roles.admin) {
    espaces.push({
      id: 'studuel',
      nom: 'Studuel',
      role: 'L’application',
      accueil: '/admin/insights',
      sections: [
        { titre: 'Pilotage', liens: [L.insights, L.retention, L.usage] },
        { titre: 'Contenu', liens: [L.studio, L.contenu, L.signalementsIa] },
        { titre: 'Communication', liens: [L.diffusion, L.leads] },
        { titre: 'Business', liens: [L.abonnements, L.marcel, L.parents] },
        { titre: 'Technique', liens: [L.sante, L.erreurs] },
      ],
    })
  }
  return espaces
}

/** Toutes les sections de tous les espaces (pour chercher le lien actif). */
export function sectionsConsole(roles: { coach: boolean; admin: boolean }): SectionConsole[] {
  return espacesConsole(roles).flatMap((e) => e.sections)
}

/**
 * Le lien actif : le plus long préfixe qui correspond (`/coach/eleves/x` →
 * Élèves, `/admin/matiere/x` → Studio).
 */
export function lienActif(pathname: string, sections: readonly SectionConsole[]): string | null {
  const chemin = (pathname.split('?')[0] || '/').replace(/\/+$/, '') || '/'
  let meilleur: string | null = null
  for (const s of sections) {
    for (const l of s.liens) {
      const ok = chemin === l.href || chemin.startsWith(`${l.href}/`)
      if (ok && (meilleur === null || l.href.length > meilleur.length)) meilleur = l.href
    }
  }
  return meilleur
}

/** L'espace de la page ouverte (celui qui contient le lien actif), sinon le premier. */
export function espaceActif(pathname: string, espaces: readonly EspaceConsole[]): EspaceConsole | null {
  const actif = lienActif(pathname, espaces.flatMap((e) => e.sections))
  return espaces.find((e) => e.sections.some((s) => s.liens.some((l) => l.href === actif))) ?? espaces[0] ?? null
}
