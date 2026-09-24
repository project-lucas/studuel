'use client'

import { useId, useState, useTransition } from 'react'
import { ChevronDown, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import type { GradeLevel } from '@/lib/types'
import { GRADE_CYCLES, GRADE_PUCE_LABELS, GRADE_SHORT_LABELS, isGradeLevel } from '@/lib/grades'
import { saveGradeLevel } from '@/app/moi/actions'

/**
 * LA CLASSE, SUR LA LIGNE DU TITRE DE RÉVISER — à côté de « Mon carnet ».
 *
 * Changer de classe vivait UNIQUEMENT dans l'onglet Moi (`GradeSelector`), une
 * carte au milieu du profil. Or c'est ici, sur l'écran du programme, qu'on
 * s'aperçoit qu'on est dans la mauvaise année : un élève de 4e qui voit les
 * chapitres de 3e n'a aucune raison d'aller chercher un réglage dans son
 * profil. La puce dit la classe en cours (« 3e ») et, d'un tap, ouvre le
 * sélecteur du système.
 *
 * C'est un `<select>` NATIF, rendu invisible PAR-DESSUS la puce : la puce est
 * le dessin, le select est la commande. On garde ainsi tout ce que le
 * navigateur donne gratuitement (grande roue sur téléphone, groupes Primaire /
 * Collège / Lycée, clavier, lecteur d'écran) sans réécrire un menu.
 *
 * Même contrat que `GradeSelector` : sauvegarde immédiate, affichage optimiste,
 * réalignement sur le serveur si l'écriture a échoué (l'action ne lève pas).
 */
export default function ClasseChip({
  current,
  court = false,
}: {
  current: GradeLevel | null
  /** Libellé court (bandeau du téléphone) : « Tˡᵉ » au lieu de « Terminale ». */
  court?: boolean
}) {
  const [selected, setSelected] = useState<GradeLevel | null>(current)
  const [syncedCurrent, setSyncedCurrent] = useState(current)
  const [pending, startTransition] = useTransition()
  const selectId = useId()

  // Le serveur reste la source de vérité : après `revalidatePath`, `current`
  // arrive frais. S'il n'a pas changé (échec silencieux), on rend la puce à la
  // classe réellement enregistrée. Ajustement d'état pendant le rendu, comme
  // dans GradeSelector (pas d'effet, pas de rendu en cascade).
  if (current !== syncedCurrent) {
    setSyncedCurrent(current)
    setSelected(current)
  }

  function choose(value: string) {
    if (!isGradeLevel(value) || value === selected || pending) return
    sfx.tap()
    setSelected(value)
    startTransition(async () => {
      await saveGradeLevel(value)
    })
  }

  const label = selected ? (court ? GRADE_PUCE_LABELS : GRADE_SHORT_LABELS)[selected] : '—'

  return (
    <span className="relative shrink-0">
      {/* La PUCE : même robe que « Mon carnet » (blanc, filet noir à 5 %, icône
          violette, texte à l'encre) — deux commandes sœurs sur une même ligne
          doivent se ressembler. */}
      <span
        aria-hidden="true"
        className={cn(
          'font-heading flex min-h-11 items-center gap-1.5 rounded-full bg-white pr-3 pl-3 text-sm font-extrabold text-foreground shadow-sm ring-1 ring-black/5 transition',
          pending ? 'opacity-60' : null,
        )}
      >
        <GraduationCap
          className="size-4.5 text-primary"
          strokeWidth={2.4}
        />
        {label}
        {/* Dans le bandeau (court), pas de chevron : la puce y partage sa
            bande avec l'écusson, et le tap ouvre le menu sans lui. */}
        {court ? null : (
          <ChevronDown className="-mr-0.5 size-3.5 text-muted-foreground" strokeWidth={2.6} />
        )}
      </span>
      <select
        id={selectId}
        value={selected ?? ''}
        disabled={pending}
        onChange={(e) => choose(e.target.value)}
        aria-label={`Ma classe : ${selected ? GRADE_SHORT_LABELS[selected] : 'non choisie'}. Changer de classe`}
        // Invisible mais ENTIER par-dessus la puce : c'est lui qui reçoit le
        // tap et le focus. L'anneau de focus se dessine sur la puce via
        // `peer` pour rester visible au clavier.
        className="peer absolute inset-0 cursor-pointer opacity-0 focus-visible:outline-none"
      >
        {selected === null ? (
          <option value="" disabled>
            Choisis ta classe
          </option>
        ) : null}
        {GRADE_CYCLES.map((cycle) => (
          <optgroup key={cycle.id} label={cycle.label}>
            {cycle.grades.map((grade) => (
              <option key={grade} value={grade}>
                {GRADE_SHORT_LABELS[grade]}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full ring-primary peer-focus-visible:ring-2"
      />
    </span>
  )
}
