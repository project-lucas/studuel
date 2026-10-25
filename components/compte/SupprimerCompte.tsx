'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { supprimerCompte } from '@/app/compte/suppression-actions'
import { MOT_SUPPRESSION, motConfirme } from '@/lib/suppression-compte'

/**
 * « Supprimer mon compte » (25/10/2026, migration 596) — en bas de Mon compte,
 * fermé par défaut : un lien discret, puis ce qui sera effacé et le mot à
 * écrire. Après la suppression, la page est RECHARGÉE (pas une navigation
 * client) : les onglets gardés vivants tiennent encore le compte effacé.
 */
export default function SupprimerCompte({ abonne }: { abonne: boolean }) {
  const [ouvert, setOuvert] = useState(false)
  const [mot, setMot] = useState('')
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, startTransition] = useTransition()

  if (!ouvert) {
    return (
      <div className="mx-auto mt-6 w-full max-w-md px-2 text-center">
        <button
          type="button"
          onClick={() => setOuvert(true)}
          className="inline-block py-2 text-sm font-bold text-muted-foreground underline underline-offset-4"
        >
          Supprimer mon compte
        </button>
      </div>
    )
  }

  return (
    <section aria-label="Supprimer mon compte" className="carte mx-auto mt-6 w-full max-w-md p-4">
      <h2 className="titre-section flex items-center gap-2 text-destructive">
        <Trash2 className="size-5" aria-hidden="true" />
        Supprimer mon compte
      </h2>
      <p className="mt-2 text-sm">
        C’est définitif : ton profil, ta progression, ton XP, tes gemmes, tes séries, tes amis et
        tes achats sont effacés, et ne peuvent pas être récupérés.
      </p>
      {abonne ? (
        <p className="mt-2 text-sm font-bold">
          Ton Studuel+ s’arrête avec le compte, sans remboursement de la période en cours.
        </p>
      ) : null}
      <p className="mt-2 text-xs font-semibold text-muted-foreground">
        Les messages échangés avec un coach restent visibles dans le fil, sans ton nom.{' '}
        <Link href="/confidentialite" className="underline underline-offset-4">
          En savoir plus
        </Link>
      </p>
      <form
        className="mt-3 flex flex-col gap-2"
        action={(fd) =>
          startTransition(async () => {
            const r = await supprimerCompte(fd)
            if (r.ok) window.location.replace('/supprimer-mon-compte?fait=1')
            else setErreur(r.erreur)
          })
        }
      >
        <label htmlFor="confirmation-suppression" className="text-sm font-semibold">
          Pour confirmer, écris <strong>{MOT_SUPPRESSION}</strong>
        </label>
        <input
          id="confirmation-suppression"
          name="confirmation"
          value={mot}
          onChange={(e) => {
            setMot(e.target.value)
            setErreur(null)
          }}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          className="h-11 rounded-xl border bg-background px-3 text-base font-extrabold tracking-wider uppercase outline-none focus:border-destructive"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!motConfirme(mot) || enCours}
            className="font-heading h-11 flex-1 rounded-full bg-(--destructive) px-4 text-sm font-extrabold text-white disabled:opacity-50"
          >
            {enCours ? 'Suppression…' : 'Supprimer définitivement'}
          </button>
          <button
            type="button"
            onClick={() => {
              setOuvert(false)
              setMot('')
              setErreur(null)
            }}
            className="h-11 px-3 text-sm font-bold text-muted-foreground"
          >
            Annuler
          </button>
        </div>
        {erreur ? <p className="text-sm font-bold text-(--destructive)" role="alert">{erreur}</p> : null}
      </form>
    </section>
  )
}
