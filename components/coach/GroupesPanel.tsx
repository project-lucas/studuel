'use client'

import { useState, useTransition } from 'react'
import { Archive, Copy, RefreshCw, Check, Pencil, Link2 } from 'lucide-react'
import { archiverGroupe, creerGroupe, regenererCode, renommerGroupe } from '@/app/coach/actions'
import { afficherCode } from '@/lib/coach/code'
import type { GroupeCoach } from '@/lib/coach/server'
import { cn } from '@/lib/utils'

const CATEGORIES = ['U11', 'U13', 'U15', 'U17', 'U18', 'U20', 'Seniors', 'Autre']

/**
 * LES GROUPES — chacun avec son CODE en grand (à dicter ou à copier), son
 * effectif, « Régénérer » (l'ancien code meurt aussitôt) et « Archiver »
 * (le code ne marche plus, le groupe sort du tableau, rien n'est effacé).
 */
export default function GroupesPanel({ groupes }: { groupes: GroupeCoach[] }) {
  const actifs = groupes.filter((g) => g.archiveLe === null)
  const archives = groupes.filter((g) => g.archiveLe !== null)
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-3">
        {actifs.length === 0 ? (
          <p className="carte p-6 text-sm font-semibold text-muted-foreground">
            Aucun groupe pour l’instant — crée le premier à droite.
          </p>
        ) : (
          actifs.map((g) => <CarteGroupe key={g.id} groupe={g} />)
        )}
        {archives.length > 0 ? (
          <details className="carte p-4">
            <summary className="cursor-pointer text-sm font-extrabold text-muted-foreground">
              {archives.length} groupe{archives.length > 1 ? 's' : ''} archivé{archives.length > 1 ? 's' : ''}
            </summary>
            <ul className="mt-2 space-y-1 text-sm">
              {archives.map((g) => (
                <li key={g.id} className="flex justify-between text-muted-foreground">
                  <span>{g.nom}{g.categorie ? ` · ${g.categorie}` : ''}</span>
                  <span>archivé le {g.archiveLe}</span>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </div>
      <NouveauGroupe />
    </div>
  )
}

function CarteGroupe({ groupe }: { groupe: GroupeCoach }) {
  const [enCours, startTransition] = useTransition()
  const [copie, setCopie] = useState(false)
  const [lienCopie, setLienCopie] = useState(false)
  const [edition, setEdition] = useState(false)
  const [nom, setNom] = useState(groupe.nom)
  const [categorie, setCategorie] = useState(groupe.categorie ?? '')
  const [erreur, setErreur] = useState<string | null>(null)
  const [confirmeArchive, setConfirmeArchive] = useState(false)

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(groupe.code)
      setCopie(true)
      setTimeout(() => setCopie(false), 1500)
    } catch {
      /* presse-papiers refusé : le code reste lisible à l'écran */
    }
  }

  // LE LIEN D'INVITATION (17/10/2026) : à coller en masse dans un groupe de
  // discussion — il ouvre l'onboarding avec le code déjà posé, et le compte
  // créé rejoint le groupe (et reçoit Studuel+, migration 594).
  const lien = () => `${window.location.origin}/bienvenue?code=${groupe.code}`
  const copierLien = async () => {
    try {
      await navigator.clipboard.writeText(lien())
      setLienCopie(true)
      setTimeout(() => setLienCopie(false), 1500)
    } catch {
      /* presse-papiers refusé : le code reste lisible à l'écran */
    }
  }

  return (
    <article className="carte p-4">
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          {edition ? (
            <form
              className="flex flex-wrap items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                startTransition(async () => {
                  const r = await renommerGroupe(groupe.id, nom, categorie || null)
                  if (!r.ok) setErreur(r.erreur)
                  else setEdition(false)
                })
              }}
            >
              <input value={nom} onChange={(e) => setNom(e.target.value)} aria-label="Nom du groupe" className="h-10 rounded-xl border bg-background px-3 text-sm font-bold" maxLength={60} />
              <select value={categorie} onChange={(e) => setCategorie(e.target.value)} aria-label="Catégorie" className="h-10 rounded-xl border bg-background px-3 text-sm font-bold">
                <option value="">Sans catégorie</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="submit" disabled={enCours} className="font-heading h-10 rounded-full bg-primary px-4 text-sm font-extrabold text-primary-foreground disabled:opacity-50">Enregistrer</button>
              <button type="button" onClick={() => setEdition(false)} className="h-10 px-2 text-sm font-bold text-muted-foreground">Annuler</button>
            </form>
          ) : (
            <h2 className="font-heading flex items-center gap-2 text-xl font-extrabold">
              {groupe.nom}
              {groupe.categorie && groupe.categorie !== groupe.nom ? (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-extrabold text-primary">{groupe.categorie}</span>
              ) : null}
              <button type="button" onClick={() => setEdition(true)} aria-label="Renommer" className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary">
                <Pencil className="size-4" aria-hidden="true" />
              </button>
            </h2>
          )}
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            {groupe.membres} élève{groupe.membres > 1 ? 's' : ''} · créé le {groupe.creeLe}
          </p>
        </div>

        {/* LE CODE, en grand : c'est ce que le coach dicte ou envoie. */}
        <div className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3">
          <span className="font-heading text-2xl font-extrabold tracking-[0.2em] text-primary" aria-label={`Code ${groupe.code}`}>
            {afficherCode(groupe.code)}
          </span>
          <button type="button" onClick={copier} aria-label="Copier le code" className="grid size-9 place-items-center rounded-full bg-card shadow-carte">
            {copie ? <Check className="size-4 text-(--success)" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          onClick={copierLien}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-3 font-extrabold text-primary-foreground"
        >
          {lienCopie ? <Check className="size-4" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}
          {lienCopie ? 'Lien copié' : 'Copier le lien d’invitation'}
        </button>
        <button
          type="button"
          disabled={enCours}
          onClick={() =>
            startTransition(async () => {
              const r = await regenererCode(groupe.id)
              if (!r.ok) setErreur(r.erreur)
            })
          }
          className="inline-flex h-9 items-center gap-1.5 rounded-full border px-3 font-bold hover:bg-secondary disabled:opacity-50"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Nouveau code
        </button>
        {confirmeArchive ? (
          <span className="inline-flex items-center gap-2">
            <span className="font-semibold text-muted-foreground">Archiver {groupe.nom} ? Le code ne marchera plus.</span>
            <button
              type="button"
              disabled={enCours}
              onClick={() =>
                startTransition(async () => {
                  const r = await archiverGroupe(groupe.id)
                  if (!r.ok) setErreur(r.erreur)
                })
              }
              className="h-9 rounded-full bg-(--destructive) px-3 font-extrabold text-white"
            >
              Oui, archiver
            </button>
            <button type="button" onClick={() => setConfirmeArchive(false)} className="h-9 px-2 font-bold text-muted-foreground">Non</button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirmeArchive(true)} className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 font-bold text-muted-foreground hover:bg-secondary">
            <Archive className="size-4" aria-hidden="true" />
            Archiver
          </button>
        )}
        {erreur ? <span className="text-(--destructive) font-bold" role="alert">{erreur}</span> : null}
      </div>
    </article>
  )
}

function NouveauGroupe() {
  const [enCours, startTransition] = useTransition()
  const [erreur, setErreur] = useState<string | null>(null)
  const [cle, setCle] = useState(0)
  return (
    <form
      key={cle}
      className="carte h-fit p-4"
      action={(fd) =>
        startTransition(async () => {
          const r = await creerGroupe(fd)
          if (!r.ok) setErreur(r.erreur)
          else {
            setErreur(null)
            setCle((k) => k + 1)
          }
        })
      }
    >
      <h2 className="titre-section">Nouveau groupe</h2>
      <p className="mt-1 text-sm font-semibold text-muted-foreground">
        Il reçoit un code à huit caractères et un lien d’invitation : les joueurs l’ouvrent (ou saisissent le code sur « J’ai un code »), et reçoivent Studuel+.
      </p>
      <label className="mt-3 block text-xs font-extrabold tracking-wide text-muted-foreground uppercase" htmlFor="nom-groupe">Nom</label>
      <input id="nom-groupe" name="nom" required maxLength={60} placeholder="U15 garçons" className="mt-1 h-11 w-full rounded-xl border bg-background px-3 text-sm font-bold outline-none focus:border-primary" />
      <label className="mt-3 block text-xs font-extrabold tracking-wide text-muted-foreground uppercase" htmlFor="categorie-groupe">Catégorie</label>
      <select id="categorie-groupe" name="categorie" defaultValue="" className="mt-1 h-11 w-full rounded-xl border bg-background px-3 text-sm font-bold">
        <option value="">Sans catégorie</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <button type="submit" disabled={enCours} className={cn('font-heading mt-4 h-11 w-full rounded-full bg-primary text-sm font-extrabold text-primary-foreground shadow-[0_4px_0_#2e1b54]', enCours && 'opacity-60')}>
        Créer le groupe
      </button>
      {erreur ? <p className="mt-2 text-sm font-bold text-(--destructive)" role="alert">{erreur}</p> : null}
    </form>
  )
}
