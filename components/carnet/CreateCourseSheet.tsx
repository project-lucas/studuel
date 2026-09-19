'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { MAX_TITLE_LEN } from '@/lib/carnet-cours'
import { trouverDoublon } from '@/lib/carnet/matiere'
import type { CoursCarnet } from '@/lib/carnet/priorite'
import { createCourse } from '@/app/carnet/cours/actions'
import BottomSheet from '@/components/carnet/BottomSheet'

/**
 * La feuille « Nouveau dossier », ouverte par le + flottant (CarnetFab) et par
 * le bloc de suggestion d'un carnet vide. UN NOM, ET C'EST TOUT (10/09/2026,
 * Lucas : « comme Wooflash, il clique sur plus, lui donne un nom et c'est
 * tout ») : le dossier s'ouvre aussitôt, et c'est dedans qu'on choisit
 * comment le remplir (une question, l'IA, un PDF). La question « C'est pour
 * quelle matière ? » et les deux portes « Cours vide / Questions écrites par
 * l'IA » ont quitté la feuille le même jour ; l'icône et la couleur se
 * règlent depuis le dossier.
 *
 * Le GARDE-FOU reste : un dossier du même nom existe déjà — la feuille
 * propose de l'OUVRIR au lieu d'en créer un deuxième.
 */
export default function CreateCourseSheet({
  open,
  onClose,
  cours = [],
}: {
  open: boolean
  onClose: () => void
  /** Les dossiers existants, pour repérer un doublon. */
  cours?: CoursCarnet[]
}) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [pending, startTransition] = useTransition()
  const [failed, setFailed] = useState(false)

  const doublon = useMemo(() => trouverDoublon(cours, name, null), [cours, name])
  const ready = name.trim().length > 0 && doublon === null

  const fermer = () => {
    onClose()
    setName('')
    setFailed(false)
  }

  const creer = () => {
    if (pending || !ready) return
    sfx.tap()
    setFailed(false)
    startTransition(async () => {
      const res = await createCourse(name.trim())
      if (res.ok && res.id) {
        fermer()
        router.push(`/carnet/cours/${res.id}`)
      } else {
        setFailed(true)
      }
    })
  }

  return (
    <BottomSheet open={open} onClose={fermer} title="Nouveau dossier">
      <form
        className="flex flex-col gap-2.5"
        onSubmit={(e) => {
          e.preventDefault()
          creer()
        }}
      >
        <label className="flex flex-col gap-1.5">
          <span className="px-1 text-xs font-bold text-muted-foreground">Le nom de ton dossier</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={MAX_TITLE_LEN}
            autoFocus
            placeholder="Anglais — verbes irréguliers"
            aria-label="Nom du dossier"
            className="min-h-12 rounded-2xl border border-black/10 bg-white px-4 text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/40"
          />
        </label>

        {/* Le garde-fou : ce dossier existe déjà — on l'ouvre, on n'en crée pas un deuxième. */}
        {doublon ? (
          <Link
            href={`/carnet/cours/${doublon.id}`}
            onClick={() => {
              sfx.tap()
              fermer()
            }}
            className="flex items-center gap-3 rounded-2xl bg-highlight/25 px-4 py-3 text-left ring-1 ring-highlight/50 transition active:translate-y-px"
          >
            <span className="min-w-0 flex-1">
              <span className="font-heading block text-sm font-extrabold text-foreground">
                Tu as déjà un dossier « {doublon.title} »{doublon.archive ? ', archivé' : ''}
              </span>
              <span className="block text-xs text-muted-foreground">Ouvre-le plutôt que d’en créer un deuxième.</span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-foreground" strokeWidth={2.6} aria-hidden="true" />
          </Link>
        ) : null}

        <button
          type="submit"
          disabled={pending || !ready}
          className="font-heading flex min-h-12 cursor-pointer items-center justify-center rounded-2xl bg-primary px-4 text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px disabled:opacity-50"
        >
          {pending ? 'Création…' : 'Créer'}
        </button>

        {failed ? (
          <p role="alert" className="rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
            La création a échoué. Réessaie dans un instant.
          </p>
        ) : null}
      </form>
    </BottomSheet>
  )
}
