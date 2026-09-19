'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import BandeauSection from '@/components/boutique/BandeauSection'
import CarteMagasin, {
  EcrinMagasin,
  EnCours,
  type IllustrationMagasin,
  type TeinteMagasin,
} from '@/components/boutique/CarteMagasin'
import Feuille from '@/components/boutique/Feuille'
import PrixGemmes from '@/components/boutique/PrixGemmes'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { acheterOffre } from '@/app/tresor/boutique-actions'
import { MESSAGE_BOOST_DEMAIN } from '@/lib/boutique/achat'
import {
  etatOffre,
  etiquetteOffre,
  type BoostsActifs,
  type EtatOffre,
  type IdOffre,
  type Offre,
} from '@/lib/boutique/offres'
import { GEM_COST_CHAPTER } from '@/lib/gems'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import xpIllustration from '@/public/images/boutique/marche/xp.webp'
import bouclierIllustration from '@/public/images/boutique/marche/bouclier.webp'
import ficheIllustration from '@/public/images/boutique/marche/fiche.webp'

/**
 * La teinte de chaque article du Marché — la couleur de sa carte, son
 * identité (Lucas : « les cadres, les couleurs propres à chaque boost »).
 * L'XP est ambrée dans l'app, la fiche est rose chez Marcel ; le bleu du
 * bouclier rappelle la pervenche des cartes du magasin de Clash Royale.
 */
const TEINTES: Record<IdOffre, TeinteMagasin> = {
  'double-xp-2h': 'ambre',
  'bouclier-trophees': 'bleu',
}

/**
 * Les illustrations du Marché (Higgsfield, 18/09/2026) : des objets détourés,
 * comme les packs de gemmes, fabriqués par scripts/marche-illustrations.mjs —
 * la potion d'XP, le bouclier à la coupe, la fiche surlignée. Un boost sans
 * illustration dessinerait son emoji à la place (ReplisBoost).
 */
const ILLUSTRATIONS: Partial<Record<IdOffre, IllustrationMagasin>> = {
  'double-xp-2h': { image: xpIllustration, largeur: 82 },
  'bouclier-trophees': { image: bouclierIllustration, largeur: 82 },
}

const ILLUSTRATION_FICHE: IllustrationMagasin = { image: ficheIllustration, largeur: 82 }

function ReplisBoost({ offre }: { offre: Offre }) {
  return <span className="grid size-full place-items-center text-[52cqw] leading-none">{offre.emoji}</span>
}

/** Le bas de la carte d'un boost : son prix, ou ce que l'élève en a déjà. */
function BasCarte({ offre, etat }: { offre: Offre; etat: EtatOffre }) {
  if (etat.kind === 'active') return <EnCours texte={etat.reste} lecteur="En cours, encore" />
  if (etat.kind === 'en-reserve') return <EnCours texte="Prêt" lecteur="Bouclier en réserve :" />
  // Celui du jour est parti : on dit QUAND il revient, pas un prix qu'on ne
  // peut pas payer (un Boost XP par jour, migration 373).
  if (etat.kind === 'demain') return <span className="text-[16cqw]">Demain</span>
  return <PrixCarte montant={offre.prixGemmes} />
}

function libelleCarte(offre: Offre, etat: EtatOffre): string {
  if (etat.kind === 'active') return `${offre.titre} : en cours, encore ${etat.reste}`
  if (etat.kind === 'en-reserve') return `${offre.titre} : prêt, il protège ta prochaine défaite`
  if (etat.kind === 'demain') return `${offre.titre} : déjà pris aujourd’hui, de retour demain`
  return `${offre.titre} pour ${offre.prixGemmes} gemmes`
}

/** Le prix d'une carte : le nombre, puis le cristal de nos gemmes. */
function PrixCarte({ montant }: { montant: number }) {
  return (
    <>
      {montant}
      <CristalIcon className="size-[19cqw]" />
    </>
  )
}

/** L'horloge du Marché : repart de l'heure du serveur, avance toutes les 30 s
 *  (le temps qu'il reste à un boost en cours). */
function useMaintenant(depuisIso: string): Date {
  const [maintenant, setMaintenant] = useState(() => new Date(depuisIso))
  useEffect(() => {
    const id = window.setInterval(() => setMaintenant(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])
  return maintenant
}

/**
 * LE MARCHÉ (Lucas, 18/09/2026 — ex-« Boost », ex-« Offres du moment ») : des
 * consommables utiles et pas chers, toujours en vente, présentés EXACTEMENT
 * comme les packs de gemmes (CarteMagasin : nom, écrin, prix), chacun dans sa
 * teinte :
 *   · Boost XP · 2 h (ambre) et Bouclier de trophées (bleu) — des effets RÉELS
 *     en base (migrations 368, 370 et 371), achetés dans une feuille de
 *     confirmation : pas de dépense sur un tap égaré ;
 *   · Fiche de révision (rose) — un LIEN vers le choix de la matière, où
 *     l'élève débloque la fiche qui l'intéresse (30 gemmes, incluse avec
 *     Studuel+).
 */
export default function Marche({
  offres,
  boosts,
  gemmes,
  maintenantIso,
  connecte,
  premium,
}: {
  offres: readonly Offre[]
  boosts: BoostsActifs
  gemmes: number
  maintenantIso: string
  connecte: boolean
  premium: boolean
}) {
  const maintenant = useMaintenant(maintenantIso)
  const [choix, setChoix] = useState<{ id: string | null; open: boolean }>({ id: null, open: false })
  const offre = offres.find((o) => o.id === choix.id) ?? null

  return (
    <section aria-labelledby="marche-titre" className="flex flex-col gap-4">
      <BandeauSection id="marche-titre" variante="plaque">
        Marché
      </BandeauSection>

      {/* Même rangée que les gemmes : trois cartes, 6 px entre elles,
          plafonnée à 26rem sur une colonne large. */}
      <ul className="mx-auto grid w-full max-w-[26rem] grid-cols-3 gap-1.5">
        {offres.map((o) => {
          const etat = etatOffre(o, boosts, gemmes, maintenant)
          return (
            <li key={o.id} className="flex">
              <CarteMagasin
                titre={o.nom}
                etiquette={etiquetteOffre(o)}
                teinte={TEINTES[o.id]}
                illustration={ILLUSTRATIONS[o.id]}
                repli={<ReplisBoost offre={o} />}
                bas={<BasCarte offre={o} etat={etat} />}
                ariaLabel={libelleCarte(o, etat)}
                onClick={() => {
                  sfx.tap()
                  setChoix({ id: o.id, open: true })
                }}
              />
            </li>
          )
        })}
        <li className="flex">
          <CarteMagasin
            titre="Fiche de révision"
            etiquette="À vie"
            teinte="rose"
            illustration={ILLUSTRATION_FICHE}
            bas={premium ? <span className="text-[16cqw]">Incluse</span> : <PrixCarte montant={GEM_COST_CHAPTER} />}
            ariaLabel={
              premium
                ? 'Fiche de révision : incluse avec Studuel+, choisis ta matière'
                : `Fiche de révision : ${GEM_COST_CHAPTER} gemmes, choisis ta matière`
            }
            href="/reviser"
            onClick={() => sfx.tap()}
          />
        </li>
      </ul>

      {offre ? (
        <FeuilleOffre
          key={offre.id}
          open={choix.open}
          offre={offre}
          etat={etatOffre(offre, boosts, gemmes, maintenant)}
          connecte={connecte}
          onClose={() => setChoix((c) => ({ ...c, open: false }))}
        />
      ) : null}
    </section>
  )
}

function FeuilleOffre({
  open,
  offre,
  etat,
  connecte,
  onClose,
}: {
  open: boolean
  offre: Offre
  etat: EtatOffre
  connecte: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [enCours, demarrer] = useTransition()
  const [message, setMessage] = useState<{ ok: boolean; texte: string } | null>(null)

  const acheter = () => {
    setMessage(null)
    demarrer(async () => {
      const r = await acheterOffre(offre.id)
      if (!r.ok) {
        setMessage({ ok: false, texte: r.message })
        return
      }
      sfx.unlock()
      setMessage({ ok: true, texte: 'C’est activé ! Profites-en.' })
      router.refresh()
    })
  }

  return (
    <Feuille open={open} onClose={onClose} label={offre.titre}>
      <div className="mx-auto mt-6 w-40">
        <EcrinMagasin
          etiquette={etiquetteOffre(offre)}
          teinte={TEINTES[offre.id]}
          illustration={ILLUSTRATIONS[offre.id]}
          repli={<ReplisBoost offre={offre} />}
          className="w-full"
        />
      </div>
      <div className="mt-3 flex flex-col items-center gap-1 text-center">
        <h2 className="font-heading text-2xl font-extrabold">{offre.titre}</h2>
        <p className="max-w-xs text-sm font-semibold text-muted-foreground">{offre.description}</p>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {message ? (
          <p
            role={message.ok ? 'status' : 'alert'}
            className={cn(
              'rounded-2xl px-3 py-2.5 text-center text-sm font-bold',
              message.ok ? 'bg-success/12 text-foreground' : 'bg-destructive/10 text-destructive',
            )}
          >
            {message.texte}
          </p>
        ) : null}

        {message?.ok ? (
          <Button size="lg" variant="secondary" className="w-full rounded-full font-bold" onClick={onClose}>
            Continuer
          </Button>
        ) : !connecte ? (
          <Button size="lg" className="w-full rounded-full font-bold" onClick={() => router.push('/login')}>
            Connecte-toi pour en profiter
          </Button>
        ) : etat.kind === 'active' ? (
          <p className="rounded-2xl bg-success/12 px-3 py-2.5 text-center text-sm font-bold">
            Déjà en cours · encore {etat.reste}
          </p>
        ) : etat.kind === 'demain' ? (
          <p className="rounded-2xl bg-muted px-3 py-2.5 text-center text-sm font-bold">
            {MESSAGE_BOOST_DEMAIN}
          </p>
        ) : etat.kind === 'en-reserve' ? (
          <p className="rounded-2xl bg-success/12 px-3 py-2.5 text-center text-sm font-bold">
            Ton bouclier est prêt : il protège ta prochaine défaite.
          </p>
        ) : (
          <>
            <Button
              size="lg"
              className="w-full rounded-full font-bold"
              disabled={enCours || etat.kind === 'trop-chere'}
              onClick={acheter}
            >
              {enCours ? (
                'Un instant…'
              ) : (
                <>
                  Acheter pour <PrixGemmes montant={offre.prixGemmes} className="text-base" />
                </>
              )}
            </Button>
            {etat.kind === 'trop-chere' ? (
              <p className="text-center text-xs font-bold text-muted-foreground">
                Il te manque <PrixGemmes montant={etat.manque} className="text-xs" iconeClassName="size-3.5" />.
              </p>
            ) : null}
          </>
        )}
      </div>
    </Feuille>
  )
}
