'use client'

import { useId, useState, useTransition } from 'react'
import { ChevronDown, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { type GradeLevel } from '@/lib/types'
import { GRADE_CYCLES, GRADE_SHORT_LABELS, isGradeLevel } from '@/lib/grades'
import { saveGradeLevel } from '@/app/moi/actions'

// -----------------------------------------------------------------------------
// « Ma classe » : change d'année scolaire (CP → Terminale) depuis l'onglet Moi.
// Le niveau pilote le contenu filtré par niveau (Réviser, Défi, examen blanc).
// Sauvegarde immédiate au choix, mise à jour optimiste + repli si l'action échoue.
//
// POURQUOI UNE LISTE DÉROULANTE, ET PLUS UNE RANGÉE DE PASTILLES.
// Les pastilles marchaient à SEPT classes : une ligne et demie, tout visible,
// un tap. À QUATORZE — le primaire et la voie technologique sont arrivés — la
// rangée devient un pavé de quatre lignes qui pousse le reste de la page vers
// le bas, pour un réglage qu'on touche une fois par an. Le déroulé rend cet
// espace et, surtout, il peut GROUPER : Primaire / Collège / Lycée. Quatorze
// pastilles à plat ne disent rien de la structure ; trois groupes nommés se
// parcourent d'un coup d'œil.
//
// `<select>` natif plutôt qu'un menu maison : sur téléphone il ouvre le
// sélecteur du système (grande cible, molette, saisie au clavier), et il donne
// gratuitement ce qu'un menu maison redemande d'écrire — navigation au clavier,
// annonce du groupe par le lecteur d'écran, fermeture au retour arrière.
// -----------------------------------------------------------------------------
export default function GradeSelector({
  current,
}: {
  current: GradeLevel | null
}) {
  const [selected, setSelected] = useState<GradeLevel | null>(current)
  const [syncedCurrent, setSyncedCurrent] = useState(current)
  const [pending, startTransition] = useTransition()
  const selectId = useId()

  // Le serveur reste la source de vérité : saveGradeLevel revalide la page, qui
  // se re-rend avec un `current` frais. Si l'enregistrement a échoué (RLS, GRANT,
  // contrainte — l'action ne throw pas), `current` reste l'ancien niveau et on
  // réaligne l'affichage optimiste dessus. Sans ça, un échec silencieux
  // laisserait « Ma classe » bloquée sur un niveau jamais enregistré. Pattern
  // React « ajuster l'état pendant le rendu » (pas d'effet → pas de rendu en
  // cascade, et conforme à react-hooks/set-state-in-effect).
  if (current !== syncedCurrent) {
    setSyncedCurrent(current)
    setSelected(current)
  }

  function choose(value: string) {
    // Garde-fou : une valeur hors référentiel (extension de navigateur, option
    // forcée) ne doit pas partir en base. L'action la refuserait de toute façon,
    // mais l'affichage optimiste, lui, aurait déjà changé de classe.
    if (!isGradeLevel(value) || value === selected || pending) return
    sfx.tap()
    setSelected(value) // optimiste ; resynchronisé par l'ajustement ci-dessus
    startTransition(async () => {
      await saveGradeLevel(value)
    })
  }

  return (
    <section
      aria-label="Ma classe"
      className="moi-card rounded-3xl bg-white px-5 py-4"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <GraduationCap className="size-5" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-heading text-base font-bold text-foreground">
            <label htmlFor={selectId}>Ma classe</label>
          </h2>
          <p className="text-xs text-muted-foreground">
            Change d&apos;année pour adapter tout ton contenu.
          </p>
        </div>
      </div>

      <div className="relative mt-3">
        <select
          id={selectId}
          value={selected ?? ''}
          disabled={pending}
          onChange={(e) => choose(e.target.value)}
          className={cn(
            // `appearance-none` retire le chevron du système, remplacé par le
            // nôtre juste en dessous — sinon les deux flèches se superposent.
            'font-heading w-full appearance-none rounded-2xl bg-muted py-3 pr-11 pl-4',
            'text-base font-bold text-foreground transition-colors',
            'focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
            'disabled:opacity-60',
          )}
        >
          {/* Aucune classe enregistrée : sans cette option vide, le déroulé
              afficherait « CP » comme s'il avait été choisi. */}
          {selected === null && (
            <option value="" disabled>
              Choisis ta classe
            </option>
          )}
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
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-4 size-4.5 -translate-y-1/2 text-muted-foreground"
          strokeWidth={2.4}
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
