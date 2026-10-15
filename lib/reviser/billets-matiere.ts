// -----------------------------------------------------------------------------
// LES BILLETS DE LA PORTE « JEUX » QUI NE SONT PAS DES JEUX DE SALON
// (12/10/2026, Lucas : « il faut que la dictée soit présentée comme un mode de
// jeu avec sa bannière comme les autres, c'est un mode important » ; « le bloc
// boss doit aussi avoir sa bannière comme les modes de jeu »).
//
// La dictée vivait dans une carte blanche à pictogramme, le gardien dans une
// carte ou un bouton violet : deux formats de plus à côté des billets des jeux.
// Ils prennent le MÊME billet (components/defi/ModeTicket) : la dictée en rose
// (la teinte du français), le gardien en violet (la teinte du mode Boss de
// l'arène), son visage au talon.
//
// Pur et testé : le composant ne fait que poser ces billets.
// -----------------------------------------------------------------------------

import { SCENE_DICTEE, TALON_DICTEE, type ModeTicket } from '@/lib/defi/modes-catalog'
import type { Boss } from '@/lib/bosses'
import { peutAffronter, type GardienVue } from '@/lib/reviser/gardien'
import { subjectVignette } from '@/lib/subject-style'

export const LIEN_DICTEE = '/reviser/francais/dictee'

/** La dictée du français : un billet rose, la vignette du dossier en corps. */
export function billetDictee(): ModeTicket {
  return {
    id: 'francais:dictee',
    teinte: 'rose',
    name: 'La dictée',
    tagline: 'Écoute, écris, et vois tes fautes expliquées une par une',
    emoji: '✍️',
    // Le casque : « écoute » — le talon de la série du 13/10/2026.
    image: TALON_DICTEE,
    // La scène : Marcel en nage sur sa dictée (14/10/2026, Lucas : « une
    // illustration cohérente pour la dictée, drôle, avec Marcel qui a des
    // difficultés ») — la vignette du dossier n'est plus que le repli.
    scene: SCENE_DICTEE,
    vignette: subjectVignette('francais'),
    href: LIEN_DICTEE,
    chip: 'Écoute · écris · corrige',
  }
}

export type BilletGardien = {
  billet: ModeTicket
  /** Le gardien se laisse affronter : le billet ouvre le combat. */
  ouvert: boolean
}

/**
 * Le gardien de la matière : « Affronter Grammatork » quand il est sorti (ou
 * que la traque est illisible), « Grammatork rôde » avec sa jauge sinon. Le
 * billet dit la vérité sur l'état du monde, comme la carte qu'il remplace.
 */
export function billetGardien(
  subject: { slug: string; name: string },
  boss: Boss,
  gardien: GardienVue,
): BilletGardien {
  const ouvert = gardien.etat === 'absent' || peutAffronter(gardien)
  const debusque = gardien.etat === 'debusque'
  const repos = gardien.etat === 'indisponible'
  return {
    ouvert,
    billet: {
      id: `${subject.slug}:gardien`,
      teinte: 'violet',
      name: ouvert
        ? `Affronter ${boss.name}`
        : repos
          ? `${boss.name} se repose`
          : `${boss.name} rôde`,
      tagline: ouvert
        ? debusque
          ? `Il disparaît dans ${gardien.detail}`
          : `${boss.epithet} · le gardien de ${subject.name}`
        : gardien.phrase,
      emoji: boss.emoji,
      image: boss.image ?? null,
      // Le corps du billet est la SCÈNE du boss (13/10/2026, Lucas : « il faut
      // que tu utilises les boss en mode scène ») — la même bannière 16:9 que
      // sur le mode Boss de l'arène ; la vignette du dossier n'est que le repli
      // d'un boss sans scène.
      scene: boss.scene ?? null,
      vignette: subjectVignette(subject.slug),
      // PAS SON JOUR (576) : un ruban le dit par-dessus la scène, le billet
      // s'éteint — on ne traque un gardien que le jour où il sort.
      ...(repos ? { badge: 'Indisponible aujourd’hui', badgeTon: 'muet' as const, eteint: true } : {}),
      // Un billet sans lien : c'est le composant qui ouvre le combat (onClick).
      href: null,
      chip: ouvert
        ? debusque
          ? `Disparaît dans ${gardien.detail}`
          : boss.epithet
        // Le pourcentage SEUL (14/10/2026, Lucas : « trop de texte, laisse que le
        // pourcentage ») : la phrase de la traque reste dans l'aria-label du billet.
        // Pas son jour : « Revient mardi » (la rareté, 576).
        : repos
          ? gardien.detail
          : `${gardien.percent} %`,
    },
  }
}
