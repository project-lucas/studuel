import CarteStudueLPlus from '@/components/boutique/CarteStudueLPlus'
import Marche from '@/components/boutique/Marche'
import RayonsCapsules from '@/components/boutique/RayonsCapsules'
import PourTonProfil from '@/components/boutique/PourTonProfil'
import RayonGemmes from '@/components/boutique/RayonGemmes'
import MarqueurBoutiqueVue from '@/components/boutique/MarqueurBoutiqueVue'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { getUserTier } from '@/lib/subscription'
import { fetchGems } from '@/lib/gems-access'
import { lireCatalogueCapsules, lireMesAchats } from '@/lib/capsules-server'
import { lireBoosts, lireObjetsProfil } from '@/lib/boutique/boosts-server'
import { AUCUN_BOOST, OFFRES } from '@/lib/boutique/offres'
import { isPremiumTier } from '@/lib/gems'
import { cleSemaineVitrine } from '@/lib/boutique/vue'
import { PACKS_GEMMES } from '@/lib/boutique/packs-gemmes'


/**
 * LA BOUTIQUE, UNE SEULE PAGE (refonte du 18/09/2026, Lucas). Dans l'ordre :
 *   1. Studuel+ en tête — une grande carte, ses avantages, le bouton ;
 *   2. le MARCHÉ (ex-« Boost », ex-« offres du moment ») — des consommables
 *      utiles et pas chers, toujours en vente : boost XP et trophées ×2 (2 h),
 *      et un bloc « Fiche de révision » qui envoie choisir sa matière ;
 *   3. les CAPSULES, au centre et sur plus de la moitié de la page — des
 *      mini-formations rangées par thème, débloquées en gemmes (ou par carte
 *      pour les plus chères), lues ensuite dans le carnet ;
 *   4. les GEMMES — trois packs sur une rangée, au gabarit des cartes du
 *      magasin de Clash Royale, demandés par un parent (migration 369) ;
 *   5. pour ton profil — une seule rangée de six objets.
 *
 * Chaque catégorie s'ouvre sur SON titre, à la manière du magasin de Clash
 * Royale : plaque dorée, parchemin, rubans (components/boutique/BandeauSection).
 *
 * UN LONG CATALOGUE QUI DÉFILE SANS LATENCE : tout est rendu d'un coup (pas de
 * `content-visibility`, qui laisse des blancs au défilement rapide), les
 * images sont chargées d'emblée, et rien de fixe à l'écran ne floute ce qui
 * passe dessous — la barre d'onglets reste affichée, immobile.
 *
 * Tout se paie en GEMMES, sauf Studuel+ et les gemmes elles-mêmes (en euros,
 * par un parent). Les écus, le coffre du jour, les compagnons et la
 * collection ont quitté la Boutique. Chaque lecture est tolérante : tant
 * qu'une migration dort (366 capsules, 368 boosts et objets, 369 packs, 370
 * boost trophées), sa
 * section se tait ou répond « bientôt » au lieu de casser la page.
 */
/**
 * L'ONGLET BOUTIQUE, construit dès l'ouverture de l'app et gardé vivant,
 * comme les écrans de Clash Royale : il est rendu par la mise en page racine
 * (`app/layout.tsx`, via `components/OngletsVivants`), jamais par une page —
 * `app/tresor/page.tsx` ne porte que le titre. Voir `lib/nav-tabs`
 * (`ongletVivant`) et `docs/latence.md`.
 */
export default async function OngletBoutique() {
  const [supabase, user] = await Promise.all([createClient(), getCurrentUser()])
  const maintenant = new Date()

  const [tier, gemmes, catalogue, achats, boosts, objets] = await Promise.all([
    getUserTier(),
    user ? fetchGems(supabase, user.id) : Promise.resolve(0),
    lireCatalogueCapsules(supabase),
    user ? lireMesAchats(supabase, user.id) : Promise.resolve([]),
    user ? lireBoosts(supabase, user.id) : Promise.resolve(AUCUN_BOOST),
    user ? lireObjetsProfil(supabase, user.id) : Promise.resolve([]),
  ])

  return (
    <div className="flex flex-col gap-9 pb-10">
      {user ? <MarqueurBoutiqueVue semaine={cleSemaineVitrine(maintenant)} /> : null}

      <CarteStudueLPlus tier={tier} />

      <Marche
        offres={OFFRES}
        boosts={boosts}
        gemmes={gemmes}
        maintenantIso={maintenant.toISOString()}
        connecte={user !== null}
        premium={isPremiumTier(tier)}
      />

      <RayonsCapsules capsules={catalogue} achats={achats} gemmes={gemmes} connecte={user !== null} />

      <RayonGemmes packs={PACKS_GEMMES} connecte={user !== null} />

      <PourTonProfil objets={objets} gemmes={gemmes} connecte={user !== null} />
    </div>
  )
}
