'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import BandeauSection from '@/components/boutique/BandeauSection'
import CarteMagasin, { EcrinMagasin, type IllustrationMagasin } from '@/components/boutique/CarteMagasin'
import Feuille from '@/components/boutique/Feuille'
import FormulaireDemandeCarte from '@/components/boutique/FormulaireDemandeCarte'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import PoseMarcel from '@/components/marcel/PoseMarcel'
import { demanderRechargeMarcel } from '@/app/tresor/recharges-actions'
import { libelleEuros } from '@/lib/capsules'
import { motCafes } from '@/lib/coach/credits'
import { enPeriodeExamens, prixParCafe, rechargesDansLOrdre, type ObjetCafe, type Recharge } from '@/lib/coach/recharges'
import { sfx } from '@/lib/sounds'
import tasse from '@/public/images/marcel/cafe/tasse.webp'
import grandeTasse from '@/public/images/marcel/cafe/grande-tasse.webp'
import thermos from '@/public/images/marcel/cafe/thermos.webp'

/**
 * LE CAFÉ DE MARCEL (25/10/2026, Lucas : « les recharges de Marcel deviennent
 * le café (dosette, grosse tasse…), c'est plus marrant de recharger Marcel
 * avec du café qu'avec des capsules éclair ») — ex-« Recharger Marcel » du
 * 15/10/2026. Trois cartes au gabarit des packs de gemmes (CarteMagasin, le
 * magasin de Clash Royale) : Dosette · Grande tasse · Thermos, le nombre de
 * cafés en étiquette, l'objet dessiné posé dans l'écrin avec son ombre, le
 * prix en bas ; en période d'examens, le Thermos passe en tête. Marcel, sa
 * tasse à la main (pose `cafe`), présente le rayon.
 *
 * Un café se paie en EUROS (jamais en gemmes : la marge de l'IA ne se paie
 * pas avec une monnaie gratuite), sur le même circuit qu'un pack : une
 * demande, un parent paie, les cafés arrivent — et Marcel se réveille.
 *
 * LES ILLUSTRATIONS : les objets détourés de public/images/marcel/cafe/ (en
 * import statique, URL à empreinte de contenu). `largeur` : la boîte de
 * l'image en % de l'écrin — la tasse est large, le thermos est haut.
 */
const ILLUSTRATIONS: Record<ObjetCafe, IllustrationMagasin> = {
  tasse: { image: tasse, largeur: 78 },
  'grande-tasse': { image: grandeTasse, largeur: 76 },
  thermos: { image: thermos, largeur: 66 },
}

/** La teinte des cartes : celle de Marcel depuis le 15/10 (une teinte par article). */
const TEINTE = 'turquoise'

/** Aucun café ouvert — une CONSTANTE : `useFermeAuMasquage` la veut stable. */
const FERME: { id: string | null; open: boolean } = { id: null, open: false }

export default function RayonRecharges({ connecte, aujourdhuiIso }: { connecte: boolean; aujourdhuiIso: string }) {
  const [choix, setChoix] = useState(FERME)
  useFermeAuMasquage(setChoix, FERME)
  const date = new Date(aujourdhuiIso)
  const recharges = rechargesDansLOrdre(date)
  const recharge = recharges.find((r) => r.id === choix.id) ?? null

  return (
    <section id="recharges" aria-labelledby="recharges-titre" className="flex scroll-mt-20 flex-col gap-4">
      <BandeauSection id="recharges-titre" variante="ruban">
        Le café de Marcel
      </BandeauSection>

      {/* Marcel, sa tasse à la main, dit à quoi sert le café. */}
      <div className="mx-auto -mt-1 flex w-full max-w-[26rem] items-end gap-2 px-3">
        <PoseMarcel pose="cafe" hauteur={84} className="shrink-0 object-contain drop-shadow-[0_8px_8px_rgba(36,48,79,.25)]" />
        <p className="bg-card relative mb-2 min-w-0 flex-1 rounded-2xl px-3 py-2 text-[12.5px] leading-snug font-bold shadow-[var(--carte-ombre)] before:absolute before:bottom-4 before:-left-[7px] before:border-y-[7px] before:border-r-[8px] before:border-y-transparent before:border-r-[var(--card)] before:content-['']">
          {enPeriodeExamens(date)
            ? 'C’est la période des examens : avec un thermos, je reste éveillé tant que tu as besoin de moi.'
            : 'Quand mes cafés du mois sont bus, je dors. Offre-moi un café : je me réveille tout de suite, et il ne s’efface pas.'}
        </p>
      </div>

      <ul className="mx-auto grid w-full max-w-[26rem] grid-cols-3 gap-1.5">
        {recharges.map((r) => (
          <li key={r.id} className="flex">
            <CarteMagasin
              titre={r.titre}
              etiquette={`+${r.credits}`}
              teinte={TEINTE}
              illustration={ILLUSTRATIONS[r.objet]}
              bas={libelleEuros(r.prixEuros)}
              ariaLabel={`${r.titre} : ${motCafes(r.credits)} pour Marcel, ${libelleEuros(r.prixEuros)}`}
              onClick={() => {
                sfx.tap()
                setChoix({ id: r.id, open: true })
              }}
            />
          </li>
        ))}
      </ul>

      {recharge ? (
        <FeuilleRecharge
          key={recharge.id}
          open={choix.open}
          recharge={recharge}
          connecte={connecte}
          onClose={() => setChoix((c) => ({ ...c, open: false }))}
        />
      ) : null}
    </section>
  )
}

function FeuilleRecharge({
  open,
  recharge,
  connecte,
  onClose,
}: {
  open: boolean
  recharge: Recharge
  connecte: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [contact, setContact] = useState('')
  const [enCours, demarrer] = useTransition()
  const [erreur, setErreur] = useState<string | null>(null)
  const [envoyee, setEnvoyee] = useState(false)

  const envoyer = () => {
    setErreur(null)
    demarrer(async () => {
      const r = await demanderRechargeMarcel(recharge.id, contact)
      if (!r.ok) {
        setErreur(r.message)
        return
      }
      sfx.correct()
      setEnvoyee(true)
    })
  }

  return (
    <Feuille open={open} onClose={onClose} label={recharge.titre}>
      <div className="mx-auto mt-6 w-40">
        <EcrinMagasin etiquette={`+${recharge.credits}`} teinte={TEINTE} illustration={ILLUSTRATIONS[recharge.objet]} className="w-full" />
      </div>
      <h2 className="font-heading mt-3 text-center text-2xl font-extrabold">{recharge.titre}</h2>
      <p className="text-muted-foreground mt-1 text-center text-sm font-bold">
        {recharge.accroche} · {motCafes(recharge.credits)} pour Marcel
      </p>
      <p className="text-muted-foreground mt-0.5 text-center text-xs font-semibold">
        {libelleEuros(recharge.prixEuros)}, soit {prixParCafe(recharge)}
      </p>

      <div className="mt-5 flex flex-col gap-2">
        {envoyee ? (
          <div role="status" aria-live="polite" className="bg-secondary text-secondary-foreground flex items-end gap-2 rounded-2xl px-3 py-2.5">
            <PoseMarcel pose="cafe" hauteur={56} className="shrink-0 object-contain" />
            <p className="text-sm font-semibold">
              C’est noté ! On recontacte ton parent pour le paiement, et je me réveille dès qu’il est confirmé.
            </p>
          </div>
        ) : !connecte ? (
          <Button size="lg" className="w-full rounded-full font-bold" onClick={() => router.push('/login')}>
            Connecte-toi pour offrir un café à Marcel
          </Button>
        ) : (
          <FormulaireDemandeCarte
            id={`recharge-${recharge.id}`}
            intro={`Un parent paie ${libelleEuros(recharge.prixEuros)} par carte, et les ${motCafes(recharge.credits)} arrivent dès que le paiement est confirmé. Ils ne s’effacent pas à la fin du mois.`}
            contact={contact}
            onContact={setContact}
            enCours={enCours}
            onEnvoyer={envoyer}
          />
        )}
        {erreur ? (
          <p role="alert" className="text-destructive text-center text-sm font-semibold">
            {erreur}
          </p>
        ) : null}
      </div>
    </Feuille>
  )
}
