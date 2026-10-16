import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import FicheEleve from '@/components/coach/FicheEleve'
import RetirerEleve from '@/components/coach/RetirerEleve'
import ActionsEleve from '@/components/coach/fiche/ActionsEleve'
import ActiviteCarte from '@/components/coach/fiche/ActiviteCarte'
import AssistantCarte from '@/components/coach/fiche/AssistantCarte'
import FicheEntreeCarte from '@/components/coach/fiche/FicheEntreeCarte'
import NotesCarte from '@/components/coach/fiche/NotesCarte'
import ObjectifCarte from '@/components/coach/fiche/ObjectifCarte'
import { statutEleve } from '@/lib/coach/statut'
import { aujourdhuiUtc, lireFiche, lireTableau } from '@/lib/coach/server'
import { lireDetail, lireFicheEntree, lireNotes } from '@/lib/coach/suivi-server'

export const dynamic = 'force-dynamic'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * LA FICHE D'UN ÉLÈVE, pensée pour l'ordinateur (16/10/2026) : en tête le
 * bilan (statut, chiffres, semaines, matières, contrôles) et les portes de
 * conversation ; dessous trois colonnes — le point de départ et les notes
 * privées · l'activité · l'objectif de la semaine et l'assistant IA.
 * Les blocs du suivi (591) s'effacent sans la migration.
 */
export default async function FicheElevePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!UUID.test(id)) notFound()

  const [fiche, lignes, detail, entree, notes] = await Promise.all([lireFiche(id), lireTableau(), lireDetail(id), lireFicheEntree(id), lireNotes(id)])
  const ligne = lignes?.find((l) => l.eleveId === id) ?? null
  if (!fiche || !ligne) notFound()

  const aujourdhui = aujourdhuiUtc()
  const verdict = statutEleve(ligne, aujourdhui)
  const parentLie = (detail?.parents.length ?? 0) > 0

  return (
    <div className="flex flex-col gap-4 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/coach" className="inline-flex w-fit items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Tableau
        </Link>
        <ActionsEleve eleveId={id} prenom={ligne.prenom} parentLie={parentLie} />
      </div>

      <FicheEleve fiche={fiche} ligne={ligne} verdict={verdict} aujourdhui={aujourdhui} />

      {detail ? (
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="flex flex-col gap-4">
            {entree ? <FicheEntreeCarte eleveId={id} fiche={entree} /> : null}
            {notes ? <NotesCarte eleveId={id} notes={notes} /> : null}
          </div>
          <div className="flex flex-col gap-4">
            <ActiviteCarte semaines={detail.semaines} jours={detail.jours} recent={detail.recent} />
          </div>
          <div className="flex flex-col gap-4">
            <ObjectifCarte eleveId={id} objectif={detail.objectif} avancee={detail.avancee} />
            <AssistantCarte eleveId={id} prenom={ligne.prenom} parentLie={parentLie} />
            {detail.parents.length ? (
              <p className="carte p-4 text-sm">
                <span className="font-extrabold">Parent{detail.parents.length > 1 ? 's' : ''} lié{detail.parents.length > 1 ? 's' : ''} : </span>
                {detail.parents.map((p) => p.prenom).join(', ')}
              </p>
            ) : (
              <p className="carte p-4 text-sm text-muted-foreground">
                Aucun parent lié dans l’app. Le parent peut se lier avec le code de l’onglet Amis de l’élève.
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="carte p-4 text-sm text-muted-foreground">
          Le point de départ, les notes, l’objectif et l’assistant arrivent avec la migration <code>591_coach_suivi.sql</code>.
        </p>
      )}

      <RetirerEleve groupeId={ligne.groupeId} eleveId={ligne.eleveId} prenom={ligne.prenom} groupe={ligne.groupe} />
    </div>
  )
}
