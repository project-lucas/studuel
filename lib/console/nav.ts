// -----------------------------------------------------------------------------
// LA CONSOLE — coach et admin dans UN seul outil, pensé pour l'ordinateur
// (16/10/2026, Lucas : « tous les chantiers côté coach et admin doivent être
// d'abord adaptés à la vision sur PC, je bosse toujours sur PC »).
//
// Une barre latérale à sections : le COACHING (pour tout coach, et l'admin qui
// coache aussi), puis l'ADMINISTRATION (l'admin seul). Pur et testé : la barre
// latérale et le tiroir du téléphone lisent la même liste.
// -----------------------------------------------------------------------------

export type IconeConsole =
  | 'tableau'
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

export type LienConsole = {
  href: string
  libelle: string
  icone: IconeConsole
  /** Une phrase pour l'infobulle et le titre de la page. */
  aide: string
}

export type SectionConsole = { titre: string; liens: LienConsole[] }

const COACHING: LienConsole[] = [
  { href: '/coach', libelle: 'Tableau', icone: 'tableau', aide: 'Tous tes élèves, les décrochés en tête.' },
  { href: '/coach/messages', libelle: 'Messages', icone: 'messages', aide: 'Tes fils avec les élèves et les parents.' },
  { href: '/coach/diffusion', libelle: 'Diffusion et sondages', icone: 'diffusion', aide: 'Un message ou un sondage à tout un public.' },
  { href: '/coach/assistant', libelle: 'Assistant IA', icone: 'assistant', aide: 'Le tri du matin et les brouillons, par Claude.' },
  { href: '/coach/groupes', libelle: 'Groupes et codes', icone: 'groupes', aide: 'Tes groupes et leur code d’inscription.' },
]

const ADMIN: LienConsole[] = [
  { href: '/admin/insights', libelle: 'Insights', icone: 'insights', aide: 'Audience, activité, matières, fonctionnalités.' },
  { href: '/admin/usage', libelle: 'Usage des écrans', icone: 'usage', aide: 'Écrans vus, temps passé, recherches sans résultat.' },
  { href: '/admin/contenu', libelle: 'À traiter', icone: 'contenu', aide: 'Questions ratées, quiz difficiles, chapitres muets, erreurs.' },
  { href: '/admin/coachs', libelle: 'Coachs', icone: 'coachs', aide: 'Nommer, retirer, voir la charge de chacun.' },
  { href: '/admin/supervision', libelle: 'Supervision', icone: 'supervision', aide: 'Tous les fils de messagerie et les signalements.' },
  { href: '/admin/retention', libelle: 'Rétention', icone: 'retention', aide: 'Les cohortes d’inscrits et leur retour.' },
  { href: '/admin/erreurs', libelle: 'Erreurs', icone: 'erreurs', aide: 'Les pannes remontées par l’app.' },
  { href: '/admin/sante', libelle: 'Santé', icone: 'sante', aide: 'Les migrations et la configuration.' },
  { href: '/admin/marcel', libelle: 'Coût de Marcel', icone: 'marcel', aide: 'L’usage et le coût de l’IA.' },
  { href: '/admin/abonnements', libelle: 'Abonnements', icone: 'abonnements', aide: 'Les demandes Studuel+ à traiter.' },
  { href: '/admin/parents', libelle: 'Parents', icone: 'parents', aide: 'Les comptes parents.' },
  { href: '/admin', libelle: 'Studio de contenu', icone: 'studio', aide: 'Matières, chapitres, leçons, quiz.' },
]

export function sectionsConsole(roles: { coach: boolean; admin: boolean }): SectionConsole[] {
  const sections: SectionConsole[] = []
  if (roles.coach || roles.admin) sections.push({ titre: 'Coaching', liens: COACHING })
  if (roles.admin) sections.push({ titre: 'Administration', liens: ADMIN })
  return sections
}

/**
 * Le lien actif : le plus long préfixe qui correspond (`/coach/eleves/x` →
 * Tableau, `/admin/matiere/x` → Studio). `/admin` et `/coach` ne valent que
 * pour eux-mêmes et leurs sous-pages qui n'ont pas leur propre lien.
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
