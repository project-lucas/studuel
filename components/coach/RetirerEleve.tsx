'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { retirerEleve } from '@/app/coach/actions'

/** « Retirer du groupe » — en deux temps, sans boîte de dialogue du navigateur. */
export default function RetirerEleve({
  groupeId,
  eleveId,
  prenom,
  groupe,
}: {
  groupeId: string
  eleveId: string
  prenom: string
  groupe: string
}) {
  const router = useRouter()
  const [confirme, setConfirme] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, startTransition] = useTransition()

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {confirme ? (
        <>
          <span className="font-semibold text-muted-foreground">
            Retirer {prenom} du groupe {groupe} ? Il garde son compte et son app.
          </span>
          <button
            type="button"
            disabled={enCours}
            onClick={() =>
              startTransition(async () => {
                const r = await retirerEleve(groupeId, eleveId)
                if (!r.ok) setErreur(r.erreur)
                else router.push('/coach')
              })
            }
            className="h-9 rounded-full bg-(--destructive) px-3 font-extrabold text-white disabled:opacity-50"
          >
            Oui, retirer
          </button>
          <button type="button" onClick={() => setConfirme(false)} className="h-9 px-2 font-bold text-muted-foreground">
            Non
          </button>
        </>
      ) : (
        <button type="button" onClick={() => setConfirme(true)} className="h-9 rounded-full px-3 font-bold text-muted-foreground hover:bg-secondary">
          Retirer du groupe
        </button>
      )}
      {erreur ? <span className="font-bold text-(--destructive)" role="alert">{erreur}</span> : null}
    </div>
  )
}
