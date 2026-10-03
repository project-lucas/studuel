'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { quetesAAnnoncer, type QueteServie } from '@/lib/quests'
import { estChromeMasque } from '@/lib/quiz-chrome'
import { sfx } from '@/lib/sounds'
import s from './BoutonsQuete.module.css'
import FeuilleQuetes from './FeuilleQuetes'
import { ouvrirFeuilleQuetes, relireQuetes, useQuetesDuJour } from './store'

/** La quête vient souvent de se finir sur l'écran qu'on quitte : son
 *  écriture part après la réponse (lib/quests-server.avancerQuetesApres). On
 *  laisse à la base le temps de l'avoir avant de relire. */
const DELAI_RELECTURE_MS = 1500
/** Pas plus d'une relecture toutes les quatre secondes en naviguant. */
const RELECTURE_MIN_MS = 4000
/** Le bandeau reste à l'écran le temps de le lire. */
const DUREE_ANNONCE_MS = 4500
/** Le temps de sa sortie (BoutonsQuete.module.css, `remonte`). */
const DUREE_SORTIE_MS = 350

// --- Les quêtes déjà annoncées : une liste par jour, dans le navigateur ------

const CLE_ANNONCEES = 'studuel-quetes-annoncees'
const abonnesAnnonces = new Set<() => void>()

function lireAnnonceesBrut(): string {
  try {
    return localStorage.getItem(CLE_ANNONCEES) ?? ''
  } catch {
    return ''
  }
}

function annonceesDuJour(brut: string, jour: string): string[] {
  try {
    const v = JSON.parse(brut || 'null') as { jour?: string; ids?: unknown } | null
    return v?.jour === jour && Array.isArray(v.ids) ? v.ids.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

function marquerAnnoncee(jour: string, id: string): void {
  const ids = annonceesDuJour(lireAnnonceesBrut(), jour)
  if (ids.includes(id)) return
  try {
    localStorage.setItem(CLE_ANNONCEES, JSON.stringify({ jour, ids: [...ids, id] }))
  } catch {
    // stockage indisponible : la quête pourra être réannoncée, rien de plus
  }
  for (const f of abonnesAnnonces) f()
}

function abonnerAnnonces(f: () => void): () => void {
  abonnesAnnonces.add(f)
  return () => abonnesAnnonces.delete(f)
}

/**
 * LES QUÊTES DU JOUR, PARTOUT (03/10/2026, Lucas : « on ne veut pas les
 * rater »). Monté une fois dans la mise en page, pour un élève connecté :
 *   · relit les quêtes au lancement, à chaque changement d'écran (au plus
 *     toutes les 4 s) et à chaque retour dans l'app — la pastille du bandeau
 *     (PastilleQuetes), la carte de Réviser et la tuile de l'arène lisent ce
 *     magasin ;
 *   · annonce « Quête accomplie » par un bandeau qui descend, où qu'on soit,
 *     sauf en plein écran (course, quiz) : l'annonce attend la sortie ;
 *   · porte LA feuille des quêtes (FeuilleQuetes).
 * Une quête annoncée ne l'est qu'une fois (mémoire du navigateur, par jour).
 */
export default function QuetesGlobales() {
  const pathname = usePathname() ?? ''
  const etat = useQuetesDuJour()
  const derniere = useRef(0)
  const brut = useSyncExternalStore(abonnerAnnonces, lireAnnonceesBrut, () => '')
  const masque = estChromeMasque(pathname)

  // L'annonce se DÉDUIT : la première quête finie, ni annoncée ni encaissée.
  const annonce: QueteServie | null =
    etat && !masque ? (quetesAAnnoncer(etat, annonceesDuJour(brut, etat.jour))[0] ?? null) : null

  // Relecture : au lancement (tout de suite), puis à chaque changement d'écran.
  useEffect(() => {
    const premiere = derniere.current === 0
    if (!premiere && Date.now() - derniere.current < RELECTURE_MIN_MS) return
    const t = window.setTimeout(
      () => {
        derniere.current = Date.now()
        void relireQuetes()
      },
      premiere ? 0 : DELAI_RELECTURE_MS,
    )
    return () => window.clearTimeout(t)
  }, [pathname])

  useEffect(() => {
    let attente: number | undefined
    const auRetour = () => {
      if (document.visibilityState !== 'visible') return
      window.clearTimeout(attente)
      attente = window.setTimeout(() => void relireQuetes(), 300)
    }
    document.addEventListener('visibilitychange', auRetour)
    return () => {
      window.clearTimeout(attente)
      document.removeEventListener('visibilitychange', auRetour)
    }
  }, [])

  return (
    <>
      {annonce && etat ? (
        <AnnonceQuete key={annonce.id} quete={annonce} onFin={() => marquerAnnoncee(etat.jour, annonce.id)} />
      ) : null}
      <FeuilleQuetes />
    </>
  )
}

/** Le bandeau « Quête accomplie » : il descend, attend, remonte. Un toucher
 *  ouvre la feuille des quêtes. */
function AnnonceQuete({ quete, onFin }: { quete: QueteServie; onFin: () => void }) {
  const [sortie, setSortie] = useState(false)
  const fin = useRef(onFin)
  useEffect(() => {
    fin.current = onFin
  })

  useEffect(() => {
    sfx.complete()
    const t1 = window.setTimeout(() => setSortie(true), DUREE_ANNONCE_MS)
    const t2 = window.setTimeout(() => fin.current(), DUREE_ANNONCE_MS + DUREE_SORTIE_MS)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+3.75rem)] z-[60] flex justify-center px-3">
      <button
        type="button"
        role="status"
        data-sortie={sortie || undefined}
        onClick={() => {
          sfx.tap()
          fin.current()
          ouvrirFeuilleQuetes()
        }}
        className={`${s.annonce} pointer-events-auto flex w-full max-w-md items-center gap-2.5 rounded-2xl bg-card p-2.5 text-left shadow-lg ring-2 ring-highlight/70`}
      >
        <Image
          src="/images/defi/icones/quetes-v3.webp"
          alt=""
          aria-hidden="true"
          width={72}
          height={72}
          className="size-9 shrink-0 object-contain"
        />
        <span className="min-w-0 flex-1">
          <span className="block text-[0.7rem] font-extrabold tracking-wide uppercase">Quête accomplie</span>
          <span className="block truncate text-sm font-bold">{quete.label}</span>
        </span>
        <span className="shrink-0 text-xs font-extrabold text-primary">Encaisser</span>
      </button>
    </div>
  )
}
