'use client'

import { useState } from 'react'
import { Ear, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  CRITERES,
  CRITERES_VIDES,
  epreuveOf,
  type CritereId,
  type Criteres,
} from '@/lib/coach/oral'
import { refuserEcoute, repondreEcoute } from '@/app/marcel/oral-actions'

// « Quelqu'un veut te faire écouter son oral » — le barreau 4 de l'échelle,
// côté auditeur (doctrine COACH-PROF §4).
//
// C'est le seul usage social vraiment NEUF du produit : jusqu'ici, l'onglet
// Amis ne proposait que de se comparer (classements, trophées, ligue). Ici, un
// ami te demande dix minutes de ton attention, et ce que tu lui rends a une
// valeur réelle — c'est exactement ce que font les élèves qui réussissent leur
// oral, et aucune app ne le propose.
//
// L'auditeur ne note pas non plus : il coche les mêmes trois cases que celui
// qui parle s'est cochées à lui-même. Le commentaire est facultatif et court —
// « c'était bien » n'aide personne, mais on ne va pas exiger une dissertation.

export type DemandeEcoute = {
  id: string
  sujet: string
  epreuve: string
  nom: string | null
}

function UneDemande({ demande }: { demande: DemandeEcoute }) {
  const [ouvert, setOuvert] = useState(false)
  const [criteres, setCriteres] = useState<Criteres>(CRITERES_VIDES)
  const [commentaire, setCommentaire] = useState('')
  const [etat, setEtat] = useState<'attente' | 'envoi' | 'fait' | 'refuse'>(
    'attente',
  )
  const [erreur, setErreur] = useState<string | null>(null)

  const nom = demande.nom ?? 'Un ami'
  const epreuve = epreuveOf(demande.epreuve)

  if (etat === 'fait' || etat === 'refuse') {
    return (
      <li className="bg-card rounded-2xl px-4 py-3 text-sm shadow-sm">
        <p role="status" className="font-semibold">
          {etat === 'fait'
            ? `Retour envoyé à ${nom}. Ça compte pour son échelle de l’oral.`
            : `Tu as décliné la demande de ${nom}.`}
        </p>
      </li>
    )
  }

  const repondre = async () => {
    setEtat('envoi')
    setErreur(null)
    const r = await repondreEcoute(demande.id, criteres, commentaire)
    if (r.statut === 'ok') {
      sfx.complete()
      setEtat('fait')
      return
    }
    setEtat('attente')
    setErreur(
      r.statut === 'deja'
        ? 'Cette écoute a déjà reçu un retour.'
        : r.statut === 'indisponible'
          ? 'Fonction pas encore ouverte côté serveur (migration 222).'
          : 'Envoi impossible pour l’instant.',
    )
  }

  const decliner = async () => {
    const r = await refuserEcoute(demande.id)
    if (r.statut === 'ok') setEtat('refuse')
  }

  return (
    <li className="bg-card rounded-2xl px-4 py-3 shadow-sm">
      <p className="text-sm">
        <span className="font-extrabold">{nom}</span> veut te faire écouter son
        oral.
      </p>
      <p className="text-muted-foreground mt-0.5 text-xs">
        {demande.sujet} · {epreuve.nom}
      </p>

      {!ouvert ? (
        <div className="mt-2 flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              sfx.tap()
              setOuvert(true)
            }}
          >
            <Ear className="size-3.5" aria-hidden="true" /> Je l’écoute
          </Button>
          <Button size="sm" variant="ghost" onClick={() => void decliner()}>
            <X className="size-3.5" aria-hidden="true" /> Pas maintenant
          </Button>
        </div>
      ) : (
        <div className="mt-3">
          <p className="text-[13px] font-extrabold">
            Écoute-le, puis coche ce qui est vrai
          </p>
          <div className="mt-1.5 flex flex-col gap-1.5">
            {CRITERES.map((c) => (
              <label key={c.id} className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={criteres[c.id]}
                  onChange={(e) =>
                    setCriteres((prev) => ({
                      ...prev,
                      [c.id as CritereId]: e.target.checked,
                    }))
                  }
                  className="mt-0.5 size-4"
                />
                <span>
                  <span className="font-bold">{c.label}</span>
                  <span className="text-muted-foreground block text-xs">
                    {c.aide}
                  </span>
                </span>
              </label>
            ))}
          </div>

          <label htmlFor={`com-${demande.id}`} className="sr-only">
            Un mot pour {nom}
          </label>
          <input
            id={`com-${demande.id}`}
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Un conseil en une phrase (facultatif)"
            maxLength={280}
            className="mt-2 h-10 w-full rounded-xl border bg-white px-3 text-sm"
          />

          <div className="mt-2 flex gap-2">
            <Button
              size="sm"
              disabled={etat === 'envoi'}
              onClick={() => void repondre()}
            >
              <Check className="size-3.5" aria-hidden="true" />
              {etat === 'envoi' ? 'Envoi…' : 'Envoyer mon retour'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setOuvert(false)}>
              Annuler
            </Button>
          </div>

          {erreur ? (
            <p role="alert" className="text-destructive mt-1.5 text-xs font-semibold">
              {erreur}
            </p>
          ) : null}
        </div>
      )}
    </li>
  )
}

export default function OralListenCard({
  demandes,
  className,
}: {
  demandes: DemandeEcoute[]
  className?: string
}) {
  // Aucune demande = aucune carte. Une section « personne ne t'a rien demandé »
  // serait un reproche déguisé, et elle occuperait la place utile.
  if (demandes.length === 0) return null

  return (
    <section className={cn('px-4', className)}>
      <h2 className="font-heading mx-0.5 mb-1.5 flex items-center gap-1.5 text-[15px] font-extrabold">
        <Ear className="text-primary size-4" aria-hidden="true" />
        On te demande d’écouter
      </h2>
      <ul className="flex flex-col gap-2">
        {demandes.map((d) => (
          <UneDemande key={d.id} demande={d} />
        ))}
      </ul>
    </section>
  )
}
