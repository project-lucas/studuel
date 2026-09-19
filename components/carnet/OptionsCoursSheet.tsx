'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Archive, ArchiveRestore, ChevronRight, Settings2, Star, Target, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import BottomSheet from '@/components/carnet/BottomSheet'
import CourseLook from '@/components/carnet/CourseLook'
import { archiverCours, definirObjectifCours, epinglerCours } from '@/app/carnet/actions'
import { updateCourse } from '@/app/carnet/cours/actions'
import type { CoursCarnet } from '@/lib/carnet/priorite'

const OBJECTIF_MAX = 120

/**
 * LES OPTIONS D'UN DOSSIER — ce qu'on règle sans ouvrir le cours : son
 * allure (icône, couleur — 10/09/2026, « il faut custom les dossiers »),
 * mettre en favori (l'étoile), poser un objectif, archiver — et SUPPRIMER
 * (10/09/2026, Lucas : « après avoir cliqué sur les ⋯, liberté de supprimer le
 * dossier »), en deux taps : le second confirme, dans la feuille, jamais dans
 * une boîte du navigateur. Les réglages de RÉVISION (plafonds, tolérance,
 * date de contrôle, matière) sont dans le cours lui-même : un lien y mène, on
 * ne les recopie pas ici.
 *
 * Chaque geste est OPTIMISTE via `onChange` (le parent met sa liste à jour
 * tout de suite) ; l'écriture suit, et un échec le dit en toast.
 */
export default function OptionsCoursSheet({
  cours: ouvert,
  onClose,
  onChange,
  onDelete,
}: {
  /** Le dossier ouvert, ou `null` : la feuille se ferme. */
  cours: CoursCarnet | null
  onClose: () => void
  onChange: (id: string, patch: Partial<CoursCarnet>) => void
  /** Supprimer le dossier — le parent retire la carte et écrit en base. */
  onDelete: (id: string) => void
}) {
  // Le DERNIER dossier ouvert reste affiché le temps de l'animation de
  // fermeture : sans lui, la feuille se viderait avant d'être descendue.
  const [dernier, setDernier] = useState(ouvert)
  const [objectif, setObjectif] = useState(ouvert?.objectif ?? '')
  const [confirmer, setConfirmer] = useState(false)
  const [, startTransition] = useTransition()

  // Le champ suit le dossier ouvert — la feuille est réutilisée d'un dossier à
  // l'autre. Ajustement PENDANT le rendu (pas d'effet, donc pas de rendu en
  // cascade), même mécanique que la pastille de classe du bandeau.
  if (ouvert && ouvert.id !== dernier?.id) {
    setDernier(ouvert)
    setObjectif(ouvert.objectif ?? '')
    setConfirmer(false)
  }

  const cours = ouvert ?? dernier
  if (!cours) return null

  const appliquer = (
    patch: Partial<CoursCarnet>,
    ecrire: () => Promise<{ ok: boolean; message?: string }>,
    /** Le toast de confirmation, ou `null` pour un geste qui se voit déjà (l'allure). */
    fait: string | null,
  ) => {
    sfx.tap()
    onChange(cours.id, patch)
    startTransition(async () => {
      const r = await ecrire()
      if (!r.ok) toast(r.message ?? 'Réessaie dans un instant.', 'error')
      else if (fait) toast(fait)
    })
  }

  const objectifTrim = objectif.trim().slice(0, OBJECTIF_MAX)
  const objectifChange = objectifTrim !== (cours.objectif ?? '')

  return (
    <BottomSheet open={ouvert !== null} onClose={onClose} title={cours.title}>
      <div className="flex flex-col gap-3">
        {/* L'allure : la vignette change sous le doigt, dans la liste aussi
            (mise à jour optimiste), et c'est la couleur que le filtre du
            carnet sait trier. */}
        <CourseLook
          icon={cours.icon}
          color={cours.color}
          onPatch={(p) => appliquer(p, () => updateCourse(cours.id, p), null)}
        />

        <div className="border-t border-black/5" aria-hidden="true" />

        <label className="block">
          <span className="flex items-center gap-1.5 px-1 text-xs font-bold text-muted-foreground">
            <Target className="size-3.5" strokeWidth={2.6} aria-hidden="true" />
            Mon objectif pour ce dossier
          </span>
          <div className="mt-1 flex gap-2">
            <input
              value={objectif}
              onChange={(e) => setObjectif(e.target.value.slice(0, OBJECTIF_MAX))}
              placeholder="Partiel du 14 juin, oral blanc, 15/20…"
              className="min-h-11 min-w-0 flex-1 rounded-2xl bg-muted/50 px-3 text-sm font-semibold text-foreground ring-1 ring-black/[0.06] outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              disabled={!objectifChange}
              onClick={() =>
                appliquer(
                  { objectif: objectifTrim || null },
                  () => definirObjectifCours(cours.id, objectifTrim || null),
                  objectifTrim ? 'Objectif posé' : 'Objectif retiré',
                )
              }
              className="btn-chunky shrink-0 rounded-full bg-primary px-4 text-sm font-extrabold text-primary-foreground disabled:opacity-40"
            >
              OK
            </button>
          </div>
        </label>

        <div className="grid grid-cols-2 gap-2">
          {/* La même étoile que sur la carte : favori = en tête de la
              grille, au-dessus du filet. */}
          <button
            type="button"
            aria-pressed={cours.epingle}
            onClick={() =>
              appliquer(
                { epingle: !cours.epingle },
                () => epinglerCours(cours.id, !cours.epingle),
                cours.epingle ? 'Retiré des favoris' : 'Dossier en favori, en tête',
              )
            }
            className={cn(
              'flex items-center gap-2 rounded-2xl px-3 py-3 text-left text-sm font-extrabold transition active:scale-[0.98]',
              cours.epingle ? 'bg-highlight/30 text-foreground' : 'bg-secondary text-foreground',
            )}
          >
            <Star
              className={cn('size-4 shrink-0 text-highlight', cours.epingle && 'fill-current')}
              strokeWidth={2.6}
              aria-hidden="true"
            />
            {cours.epingle ? 'Retirer des favoris' : 'Mettre en favori'}
          </button>
          <button
            type="button"
            onClick={() =>
              appliquer(
                { archive: !cours.archive, epingle: cours.archive ? cours.epingle : false },
                () => archiverCours(cours.id, !cours.archive),
                cours.archive ? 'Dossier ressorti' : 'Dossier rangé dans les archives',
              )
            }
            className="flex items-center gap-2 rounded-2xl bg-secondary px-3 py-3 text-left text-sm font-extrabold text-foreground transition active:scale-[0.98]"
          >
            {cours.archive ? (
              <ArchiveRestore className="size-4 shrink-0 text-primary" strokeWidth={2.6} aria-hidden="true" />
            ) : (
              <Archive className="size-4 shrink-0 text-primary" strokeWidth={2.6} aria-hidden="true" />
            )}
            {cours.archive ? 'Ressortir' : 'Archiver'}
          </button>
        </div>

        <Link
          href={`/carnet/cours/${cours.id}?reglages=1`}
          onClick={() => sfx.tap()}
          className="flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3 text-sm font-extrabold text-foreground transition active:scale-[0.99]"
        >
          <Settings2 className="size-4 text-primary" strokeWidth={2.6} aria-hidden="true" />
          <span className="flex-1">
            Réglages de révision
            <span className="block text-[11px] font-semibold text-muted-foreground">
              Cartes par jour, orthographe, date du contrôle, matière
            </span>
          </span>
          <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
        </Link>

        {/* Supprimer : un lien discret, puis la confirmation à sa place. */}
        {confirmer ? (
          <div className="flex flex-col gap-2 rounded-2xl bg-destructive/10 px-4 py-3 ring-1 ring-destructive/20">
            <p className="font-heading text-sm font-extrabold text-destructive">Supprimer « {cours.title} » ?</p>
            <p className="text-xs font-semibold text-foreground/70">
              {cours.questionCount > 0
                ? `Ses ${cours.questionCount} carte${cours.questionCount > 1 ? 's' : ''} et leur historique partent avec. `
                : ''}
              Il n’y a pas de corbeille. Pour le garder sans l’avoir sous les yeux, archive-le plutôt.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  setConfirmer(false)
                }}
                className="rounded-2xl bg-card px-3 py-2.5 text-sm font-extrabold text-foreground ring-1 ring-black/[0.08] transition active:scale-[0.98]"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  setConfirmer(false)
                  onDelete(cours.id)
                }}
                className="rounded-2xl bg-destructive px-3 py-2.5 text-sm font-extrabold text-destructive-foreground shadow-sm transition active:scale-[0.98]"
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              setConfirmer(true)
            }}
            className="flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-extrabold text-destructive transition active:scale-[0.98]"
          >
            <Trash2 className="size-4" strokeWidth={2.6} aria-hidden="true" />
            Supprimer ce dossier
          </button>
        )}
      </div>
    </BottomSheet>
  )
}
