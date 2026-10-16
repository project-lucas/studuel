'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import BandeauSection from '@/components/boutique/BandeauSection'
import CarteMagasin, { EcrinMagasin, type IllustrationMagasin } from '@/components/boutique/CarteMagasin'
import Feuille from '@/components/boutique/Feuille'
import FormulaireDemandeCarte from '@/components/boutique/FormulaireDemandeCarte'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import { demanderRechargeMarcel } from '@/app/tresor/recharges-actions'
import { libelleEuros } from '@/lib/capsules'
import { enPeriodeExamens, prixParQuestion, rechargesDansLOrdre, type Recharge } from '@/lib/coach/recharges'
import { sfx } from '@/lib/sounds'
import marcelRecharge from '@/public/images/marcel/poses/recharge.webp'

/**
 * LES RECHARGES DE MARCEL (15/10/2026, Lucas : « comme pour Claude, des
 * recharges de crédit […] super lors des périodes d'examen »). Trois cartes au
 * gabarit des packs de gemmes ; en période d'examens, le Pack examens passe en
 * tête. Une recharge se paie en EUROS (jamais en gemmes : la marge de l'IA ne
 * se paie pas avec une monnaie gratuite), sur le même circuit qu'un pack :
 * une demande, un parent paie, les crédits arrivent.
 *
 * L’ILLUSTRATION : Marcel qui brandit sa batterie (16/10/2026,
 * scripts/marcel-illustrations.mjs).
 */
const ILLUSTRATION: IllustrationMagasin = { image: marcelRecharge, largeur: 96 }

/** Aucune recharge ouverte — une CONSTANTE : `useFermeAuMasquage` la veut stable. */
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
        Recharger Marcel
      </BandeauSection>
      <p className="text-muted-foreground -mt-2 px-4 text-center text-[12.5px] font-semibold text-balance">
        {enPeriodeExamens(date)
          ? 'C’est la période des examens : Marcel reste éveillé tant que tu en as besoin.'
          : 'Marcel dort quand tes crédits du mois sont passés. Une recharge le réveille tout de suite, et ne s’efface pas.'}
      </p>

      <ul className="mx-auto grid w-full max-w-[26rem] grid-cols-3 gap-1.5">
        {recharges.map((r) => (
          <li key={r.id} className="flex">
            <CarteMagasin
              titre={r.titre}
              etiquette={`+${r.credits}`}
              teinte="turquoise"
              illustration={ILLUSTRATION}
              bas={libelleEuros(r.prixEuros)}
              ariaLabel={`${r.titre} : ${r.credits} crédits pour Marcel, ${libelleEuros(r.prixEuros)}`}
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
        <EcrinMagasin etiquette={`+${recharge.credits}`} teinte="turquoise" illustration={ILLUSTRATION} className="w-full" />
      </div>
      <h2 className="font-heading mt-3 text-center text-2xl font-extrabold">{recharge.titre}</h2>
      <p className="text-muted-foreground mt-1 text-center text-sm font-bold">
        {recharge.accroche} · {recharge.credits} questions à Marcel
      </p>
      <p className="text-muted-foreground mt-0.5 text-center text-xs font-semibold">
        {libelleEuros(recharge.prixEuros)}, soit {prixParQuestion(recharge)}
      </p>

      <div className="mt-5 flex flex-col gap-2">
        {envoyee ? (
          <p
            role="status"
            aria-live="polite"
            className="bg-secondary text-secondary-foreground rounded-2xl px-3 py-2.5 text-center text-sm font-semibold"
          >
            C’est noté ! On recontacte ton parent pour le paiement, et Marcel se réveille dès qu’il est confirmé.
          </p>
        ) : !connecte ? (
          <Button size="lg" className="w-full rounded-full font-bold" onClick={() => router.push('/login')}>
            Connecte-toi pour recharger Marcel
          </Button>
        ) : (
          <FormulaireDemandeCarte
            id={`recharge-${recharge.id}`}
            intro={`Un parent paie ${libelleEuros(recharge.prixEuros)} par carte, et les ${recharge.credits} crédits arrivent dès que le paiement est confirmé. Ils ne s’effacent pas à la fin du mois.`}
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
