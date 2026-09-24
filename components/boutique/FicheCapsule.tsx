'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, CreditCard, FileText, ListChecks, Medal, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Feuille from '@/components/boutique/Feuille'
import FormulaireDemandeCarte from '@/components/boutique/FormulaireDemandeCarte'
import PrixGemmes from '@/components/boutique/PrixGemmes'
import CouvertureCapsule from '@/components/capsules/CouvertureCapsule'
import { acheterCapsule, demanderCapsuleCarte } from '@/app/tresor/capsules-actions'
import {
  THEMES_CAPSULES,
  etatCapsule,
  libelleEuros,
  type AchatCapsule,
  type Capsule,
} from '@/lib/capsules'
import { sfx } from '@/lib/sounds'

const DEDANS = [
  { icone: BookOpen, label: 'Un cours' },
  { icone: FileText, label: 'Une fiche récap' },
  { icone: ListChecks, label: 'Un quiz' },
  { icone: Wrench, label: 'Un outil' },
] as const

type Phase = 'fiche' | 'carte' | 'achetee' | 'demandee'

/**
 * La fiche produit d'une capsule : ce qu'on y apprend, ce qu'il y a dedans, le
 * badge à gagner, puis l'achat. En gemmes quand le solde suffit ; sinon, si la
 * capsule a un prix carte, le raccourci « Payer par carte » passe devant —
 * c'est lui que les capsules chères doivent donner envie de prendre.
 *
 * LA CARTE, HONNÊTEMENT. L'app n'encaisse pas encore d'euros : le bouton
 * enregistre une demande (contact d'un parent facultatif), et la capsule
 * arrive dans le carnet dès que le paiement est confirmé. L'écran le dit.
 */
export default function FicheCapsule({
  open,
  capsule,
  achat,
  gemmes,
  connecte,
  onClose,
}: {
  open: boolean
  capsule: Capsule
  achat: AchatCapsule | null
  gemmes: number
  connecte: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('fiche')
  const [erreur, setErreur] = useState<string | null>(null)
  const [contact, setContact] = useState('')
  const [enCours, demarrer] = useTransition()
  const etat = etatCapsule(capsule, achat, gemmes)
  const theme = THEMES_CAPSULES.find((t) => t.id === capsule.theme)
  const lienCarnet = `/carnet/capsules/${capsule.id}`

  const acheter = () => {
    setErreur(null)
    demarrer(async () => {
      const r = await acheterCapsule(capsule.id)
      if (!r.ok) {
        setErreur(r.message)
        return
      }
      sfx.correct()
      setPhase('achetee')
      router.refresh()
    })
  }

  const demander = () => {
    setErreur(null)
    demarrer(async () => {
      const r = await demanderCapsuleCarte(capsule.id, contact)
      if (!r.ok) {
        setErreur(r.message)
        return
      }
      sfx.correct()
      setPhase('demandee')
      router.refresh()
    })
  }

  return (
    <Feuille open={open} onClose={onClose} label={capsule.titre}>
      <CouvertureCapsule capsule={capsule} taille="affiche" />

      <p className="surtitre mt-4 text-primary">
        {theme?.label ?? 'Capsule'} · {capsule.dureeMin} min
      </p>
      <h2 className="font-heading text-2xl leading-tight font-extrabold text-balance">
        {capsule.titre}
      </h2>
      {capsule.accroche ? (
        <p className="mt-1 text-sm text-muted-foreground">{capsule.accroche}</p>
      ) : null}

      {capsule.auProgramme.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2">
          {capsule.auProgramme.map((ligne) => (
            <li key={ligne} className="flex items-start gap-2 text-sm font-semibold">
              <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
              {ligne}
            </li>
          ))}
        </ul>
      ) : null}

      <ul aria-label="Dans la capsule" className="mt-4 grid grid-cols-2 gap-2">
        {DEDANS.map(({ icone: Icone, label }) => (
          <li
            key={label}
            className="flex items-center gap-2 rounded-2xl bg-card px-3 py-2 text-xs font-bold ring-1 ring-border"
          >
            <Icone className="size-4 shrink-0 text-primary" strokeWidth={2.4} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>

      <p className="mt-3 flex items-center gap-2 rounded-2xl bg-accent px-3 py-2 text-xs font-bold text-accent-foreground">
        <Medal className="size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
        Réussis le quiz : le badge « {capsule.badge} » rejoint ton profil.
      </p>

      <div className="mt-5 flex flex-col gap-2">
        {!connecte ? (
          <Button size="lg" className="w-full rounded-full font-bold" onClick={() => router.push('/login')}>
            Connecte-toi pour la débloquer
          </Button>
        ) : phase === 'achetee' || etat.kind === 'possedee' ? (
          <Rangee titre={phase === 'achetee' ? 'C’est rangé dans ta bibliothèque !' : null}>
            <Button
              size="lg"
              className="w-full rounded-full font-bold"
              onClick={() => {
                sfx.tap()
                router.push(lienCarnet)
              }}
            >
              {phase === 'achetee' ? 'Ouvrir maintenant' : 'Ouvrir dans ma bibliothèque'}
            </Button>
          </Rangee>
        ) : phase === 'demandee' ? (
          <Message>
            C’est noté ! On recontacte ton parent pour le paiement par carte, et la capsule arrive
            dans ta bibliothèque dès qu’il est confirmé.
          </Message>
        ) : phase === 'carte' && capsule.prixEuros !== null ? (
          <FormulaireDemandeCarte
            id={`capsule-${capsule.id}`}
            intro={`Un parent paie ${libelleEuros(capsule.prixEuros)} par carte, et la capsule arrive dans ta bibliothèque dès que le paiement est confirmé.`}
            contact={contact}
            onContact={setContact}
            enCours={enCours}
            onEnvoyer={demander}
            onAnnuler={() => setPhase('fiche')}
            annulerLabel="Revenir aux gemmes"
          />
        ) : (
          <>
            {etat.kind === 'en-attente' ? (
              <Message>
                Paiement par carte demandé : on revient vers toi. Tu peux aussi la débloquer en
                gemmes dès que tu en as assez.
              </Message>
            ) : null}

            <Button
              size="lg"
              className="w-full rounded-full font-bold"
              disabled={enCours || etat.kind === 'trop-chere' || (etat.kind === 'en-attente' && etat.manque > 0)}
              onClick={acheter}
            >
              {enCours ? (
                'Un instant…'
              ) : capsule.prixGemmes === 0 ? (
                'Offerte : l’ajouter à ma bibliothèque'
              ) : (
                <>
                  Débloquer pour <PrixGemmes montant={capsule.prixGemmes} className="text-base" />
                </>
              )}
            </Button>

            {etat.kind === 'trop-chere' || (etat.kind === 'en-attente' && etat.manque > 0) ? (
              <p className="text-center text-xs font-bold text-muted-foreground">
                Il te manque <PrixGemmes montant={etat.manque} className="text-xs" iconeClassName="size-3.5" />
                . Gagne-les en jouant : duels, couronnes, séries.
              </p>
            ) : null}

            {capsule.prixEuros !== null && etat.kind !== 'en-attente' ? (
              <Button
                size="lg"
                variant={etat.kind === 'trop-chere' ? 'default' : 'secondary'}
                shine={etat.kind === 'trop-chere'}
                className="w-full rounded-full font-bold"
                onClick={() => {
                  sfx.tap()
                  setPhase('carte')
                }}
              >
                <CreditCard className="size-4" aria-hidden="true" />
                Payer par carte · {libelleEuros(capsule.prixEuros)}
              </Button>
            ) : null}
          </>
        )}

        {erreur ? (
          <p role="alert" className="text-center text-sm font-semibold text-destructive">
            {erreur}
          </p>
        ) : null}
      </div>
    </Feuille>
  )
}

function Rangee({ titre, children }: { titre: string | null; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      {titre ? (
        <p role="status" className="font-heading text-center text-lg font-extrabold text-primary">
          {titre}
        </p>
      ) : null}
      {children}
    </div>
  )
}

function Message({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="status"
      aria-live="polite"
      className="rounded-2xl bg-secondary px-3 py-2.5 text-center text-sm font-semibold text-secondary-foreground"
    >
      {children}
    </p>
  )
}
