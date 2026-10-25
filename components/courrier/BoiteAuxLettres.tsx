'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MailOpen } from 'lucide-react'
import PoseMarcel from '@/components/marcel/PoseMarcel'
import { origineUnique, useRecompenses } from '@/components/recompenses/RecompensesProvider'
import EnTetePage from '@/components/reviser/EnTetePage'
import { Button } from '@/components/ui/button'
import {
  ONGLETS,
  annoncesNonVues,
  marquerLue,
  marquerRecuperee,
  nonLus,
  nonLusParOnglet,
  parOnglet,
  resumeGains,
  sousTitreBoite,
  totalARecuperer,
  toutMarquerLu,
  toutMarquerRecupere,
  type Lettre,
  type OngletCourrier,
} from '@/lib/courrier'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import CarteLettre, { type GestesLettre } from './CarteLettre'
import { PORTE_SERVEUR, type PorteCourrier } from './porte'
import { poserNonLusCourrier } from './store'

/** Le socle doré de « Tout récupérer » — la même recette que « Récupérer ». */
const BOUTON_OR =
  'bg-highlight text-foreground font-extrabold hover:bg-highlight/90 [--btn-edge:color-mix(in_oklab,var(--highlight),black_28%)]'

/**
 * LA BOÎTE AUX LETTRES (25/10/2026, cadrage « le jeu vivant » § G).
 *
 * L'en-tête de Réviser (« Courrier », « 2 non lues · 1 cadeau à récupérer »),
 * quatre onglets en pilules (Tout · Marcel · Amis · Coach, le compte des
 * non-lus sur chacun), une `.carte` par lettre, et en bas « Tout lire et
 * récupérer ». L'ORDRE EST FIXÉ À L'ARRIVÉE (les cadeaux et défis en tête,
 * puis les non-lues) : une lettre qu'on vient de lire ne saute pas plus bas
 * sous le doigt.
 *
 * Le serveur seul décide des gains : « Récupérer » demande, et fait voler ce
 * que la réponse dit avoir VERSÉ (`celebrer`, en vague, depuis le bouton). Le
 * compte du bouton flottant suit chaque geste (magasin `store`).
 */
export default function BoiteAuxLettres({
  lettres: initiales,
  disponible,
  porte = PORTE_SERVEUR,
}: {
  lettres: Lettre[]
  /** Faux tant que la migration 602 n'est pas en base. */
  disponible: boolean
  porte?: PorteCourrier
}) {
  const router = useRouter()
  const { celebrer } = useRecompenses()
  const [lettres, setLettres] = useState(initiales)
  const [onglet, setOnglet] = useState<OngletCourrier>('tout')
  const [ouverte, setOuverte] = useState<string | null>(null)
  const [enCours, setEnCours] = useState<string | null>(null)

  // Le badge du bouton flottant dit ce que la boîte dit.
  useEffect(() => {
    poserNonLusCourrier(nonLus(lettres))
  }, [lettres])

  const comptes = nonLusParOnglet(lettres)
  const visibles = parOnglet(lettres, onglet)
  const total = totalARecuperer(lettres)
  const resteALire = comptes.tout > 0

  const gestes: GestesLettre = {
    onOuvrir: (l) => {
      sfx.tap()
      setOuverte((o) => (o === l.id ? null : l.id))
      if (!l.lue && l.source !== 'defi') {
        setLettres((liste) => marquerLue(liste, l.id))
        void porte.lire(l.id, l.source)
      }
    },
    onRecuperer: (l, bouton) => {
      if (enCours) return
      sfx.tap()
      setEnCours(l.id)
      void porte
        .encaisser(l.id)
        .then((r) => {
          if (r.ok || r.raison === 'deja') {
            setLettres((liste) => marquerRecuperee(liste, l.id))
            if (r.gains.length > 0) celebrer(r.gains, origineUnique(bouton, r.gains), { vague: true })
            return
          }
          toast(r.raison === 'expiree' ? 'Ce cadeau a expiré.' : 'Impossible de récupérer ce cadeau pour l’instant.', 'error')
        })
        .finally(() => setEnCours(null))
    },
    onRelever: (l) => {
      if (enCours || !l.lien) return
      sfx.tap()
      setEnCours(l.id)
      const lien = l.lien
      void porte
        .relever(l.id)
        .then((r) => {
          if (!r.ok) {
            toast('Ce défi n’est plus ouvert.', 'error')
            return
          }
          router.push(lien)
        })
        .finally(() => setEnCours(null))
    },
    onSuivreLien: (l) => {
      if (!l.lien) return
      sfx.open()
      if (!l.lue && l.source !== 'defi') {
        setLettres((liste) => marquerLue(liste, l.id))
        void porte.lire(l.id, l.source)
      }
      router.push(l.lien)
    },
  }

  const toutRecuperer = (bouton: HTMLElement) => {
    if (enCours) return
    sfx.tap()
    setEnCours('tout')
    const annonces = annoncesNonVues(lettres)
    const demande = total ? porte.toutRecuperer(annonces) : porte.toutLire(annonces).then((ok) => ({ ok, gains: [] as const }))
    void demande
      .then((r) => {
        if (!r.ok) {
          toast('Impossible pour l’instant. Réessaie dans un moment.', 'error')
          return
        }
        setLettres((liste) => toutMarquerRecupere(toutMarquerLu(liste)))
        if (r.gains.length > 0) celebrer(r.gains, origineUnique(bouton, r.gains), { vague: true })
      })
      .finally(() => setEnCours(null))
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <EnTetePage retour={{ fallback: '/reviser' }} titre="Courrier" sousTitre={disponible ? sousTitreBoite(lettres) : undefined} enLigne />

      {!disponible ? (
        <EtatVide titre="La boîte n’est pas encore ouverte" texte="Tes lettres arriveront ici très bientôt." pose="lit" />
      ) : (
        <>
          {/* L'ancre du mini-tour « Le courrier » (601) sur la page même : le bouton flottant, qui la porte ailleurs, est caché ici. */}
          <div role="tablist" aria-label="Expéditeurs" data-tour="courrier" className="grid grid-cols-4 gap-1.5">
            {ONGLETS.map((o) => {
              const actif = o.id === onglet
              const n = comptes[o.id]
              return (
                <button
                  key={o.id}
                  type="button"
                  role="tab"
                  aria-selected={actif}
                  onClick={() => {
                    if (actif) return
                    sfx.tap()
                    setOnglet(o.id)
                  }}
                  className={cn(
                    'font-heading inline-flex h-10 min-w-0 items-center justify-center gap-1 rounded-full px-1.5 text-sm font-extrabold transition-colors',
                    actif ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground/80 ring-1 ring-primary/15 hover:bg-secondary',
                  )}
                >
                  {o.libelle}
                  {n > 0 ? (
                    <span
                      className={cn(
                        'grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] leading-none tabular-nums',
                        actif ? 'bg-card text-primary' : 'bg-destructive text-white',
                      )}
                    >
                      {n}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>

          {visibles.length === 0 ? (
            <EtatVide
              titre={onglet === 'tout' ? 'Ta boîte est vide' : 'Rien ici pour l’instant'}
              texte={
                onglet === 'amis'
                  ? 'Les défis de tes amis arriveront ici.'
                  : onglet === 'coach'
                    ? 'Les mots de ton coach arriveront ici.'
                    : 'Les mots de Marcel, les défis de tes amis et les nouvelles de ton coach arriveront ici.'
              }
              pose="salut"
            />
          ) : (
            <ul className="flex flex-col gap-3" aria-label="Lettres">
              {visibles.map((l) => (
                <li key={l.id}>
                  <CarteLettre lettre={l} ouverte={ouverte === l.id} enCours={enCours === l.id || enCours === 'tout'} gestes={gestes} />
                </li>
              ))}
            </ul>
          )}

          {resteALire ? (
            <Button
              type="button"
              size="xl"
              className={cn('mt-1 w-full', total ? BOUTON_OR : '')}
              variant={total ? 'default' : 'secondary'}
              disabled={enCours !== null}
              onClick={(e) => toutRecuperer(e.currentTarget)}
            >
              <MailOpen aria-hidden="true" />
              {total ? `Tout lire et récupérer · ${resumeGains(total)}` : 'Tout marquer comme lu'}
            </Button>
          ) : null}
        </>
      )}
    </div>
  )
}

function EtatVide({ titre, texte, pose }: { titre: string; texte: string; pose: 'salut' | 'lit' }) {
  return (
    <div className="carte flex items-center gap-4 p-4">
      <span className="relative block size-20 shrink-0 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
        <PoseMarcel pose={pose} hauteur={160} className="absolute top-1 left-1/2 max-w-none -translate-x-1/2 select-none" />
      </span>
      <div className="min-w-0">
        <p className="font-heading text-lg leading-tight font-extrabold">{titre}</p>
        <p className="mt-1 text-sm font-medium text-muted-foreground">{texte}</p>
      </div>
    </div>
  )
}
