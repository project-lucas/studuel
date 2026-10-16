'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import {
  aSurveiller,
  compteurs,
  filtrer,
  formaterDerniereActivite,
  formaterDuree,
  PAR_PAGE,
  page as pageDe,
  trier,
  type CleDeTri,
  type LigneJugee,
  type Statut,
} from '@/lib/coach/statut'
import { cn } from '@/lib/utils'
import PastilleStatut, { LIBELLE_STATUT } from './PastilleStatut'
import BarreGroupee from './BarreGroupee'

type Groupe = { id: string; nom: string; categorie: string | null }

/** Le complément du tableau (591) : objectif, non-lus, fiche d'entrée, parent lié. */
export type SuiviClient = {
  objMinutes: number | null
  minutesSemaine: number
  nonLus: number
  ficheEntree: boolean
  parentLie: boolean
}

/**
 * LE TABLEAU DU COACH — par exception : les compteurs, « À surveiller », puis
 * la liste complète (quatre colonnes, tri par statut, filtres, recherche,
 * pages de 50). Tout se calcule ici, sans réseau : la page a déjà tout lu en
 * une fois, et 300 lignes se trient en moins d'une milliseconde.
 */
export default function TableauCoach({
  lignes,
  groupes,
  aujourdhui,
  suivi = {},
}: {
  lignes: LigneJugee[]
  groupes: Groupe[]
  aujourdhui: string
  suivi?: Record<string, SuiviClient>
}) {
  const [selection, setSelection] = useState<Set<string>>(new Set())
  const basculer = (id: string) =>
    setSelection((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  const [groupeId, setGroupeId] = useState<string | null>(null)
  const [classe, setClasse] = useState<string | null>(null)
  const [statut, setStatut] = useState<Statut | null>(null)
  const [nouveauxDuMois, setNouveauxDuMois] = useState(false)
  const [recherche, setRecherche] = useState('')
  const [tri, setTri] = useState<{ cle: CleDeTri; sens: 'asc' | 'desc' }>({ cle: 'statut', sens: 'asc' })
  const [numero, setNumero] = useState(1)

  const classes = useMemo(
    () => [...new Set(lignes.map((l) => l.classe).filter((c): c is string => c !== null))].sort(),
    [lignes],
  )
  const perimetre = useMemo(
    () => filtrer(lignes, { groupeId }, aujourdhui),
    [lignes, groupeId, aujourdhui],
  )
  const totaux = useMemo(() => compteurs(perimetre), [perimetre])
  const surveiller = useMemo(() => aSurveiller(perimetre), [perimetre])
  const filtrees = useMemo(
    () => trier(filtrer(perimetre, { classe, statut, nouveauxDuMois, recherche }, aujourdhui), tri.cle, tri.sens),
    [perimetre, classe, statut, nouveauxDuMois, recherche, tri, aujourdhui],
  )
  const pages = Math.max(1, Math.ceil(filtrees.length / PAR_PAGE))
  const numeroBorne = Math.min(numero, pages)
  const visibles = pageDe(filtrees, numeroBorne)

  const changerTri = (cle: CleDeTri) => {
    setTri((t) => (t.cle === cle ? { cle, sens: t.sens === 'asc' ? 'desc' : 'asc' } : { cle, sens: 'asc' }))
    setNumero(1)
  }
  const filtrerStatut = (s: Statut | null) => {
    setStatut((actuel) => (actuel === s ? null : s))
    setNumero(1)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Le périmètre : tous mes groupes, ou un seul. */}
      {groupes.length > 1 ? (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Groupe">
          <Puce active={groupeId === null} onClick={() => { setGroupeId(null); setNumero(1) }}>
            Tous les groupes · {lignes.length}
          </Puce>
          {groupes.map((g) => (
            <Puce key={g.id} active={groupeId === g.id} onClick={() => { setGroupeId(g.id); setNumero(1) }}>
              {g.nom}
              {g.categorie && g.categorie !== g.nom ? ` · ${g.categorie}` : ''} ·{' '}
              {lignes.filter((l) => l.groupeId === g.id).length}
            </Puce>
          ))}
        </div>
      ) : null}

      {/* LES COMPTEURS — cliquer filtre la liste. */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Compteur libelle="Actifs cette semaine" valeur={totaux.actifs} total={totaux.total} teinte="vert" actif={false} onClick={() => filtrerStatut(null)} />
        <Compteur libelle="En baisse" valeur={totaux.enBaisse} total={totaux.total} teinte="orange" actif={statut === 'orange'} onClick={() => filtrerStatut('orange')} />
        <Compteur libelle="Décrochés" valeur={totaux.decroches} total={totaux.total} teinte="rouge" actif={statut === 'rouge'} onClick={() => filtrerStatut('rouge')} />
        <Compteur libelle="Nouveaux" valeur={totaux.nouveaux} total={totaux.total} teinte="nouveau" actif={statut === 'nouveau'} onClick={() => filtrerStatut('nouveau')} />
      </div>

      {/* À SURVEILLER — les décrochés d'abord, avec la raison en un mot. */}
      {surveiller.length > 0 && statut === null ? (
        <section className="carte p-4" aria-labelledby="a-surveiller">
          <h2 id="a-surveiller" className="titre-section">
            À surveiller
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {surveiller.map((l) => (
              <li key={l.eleveId}>
                <Link
                  href={`/coach/eleves/${l.eleveId}`}
                  className="flex items-center gap-3 rounded-2xl bg-secondary/60 px-3 py-2.5 transition-colors hover:bg-secondary"
                >
                  <PastilleStatut statut={l.statut} />
                  <span className="min-w-0 flex-1">
                    <span className="font-heading block truncate text-sm font-extrabold">{l.prenom}</span>
                    <span className="block truncate text-xs font-semibold text-muted-foreground">
                      {l.raisons[0]}
                      {l.classe ? ` · ${l.classe}` : ''}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* LA LISTE */}
      <section className="carte p-4" aria-labelledby="liste">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="liste" className="titre-section mr-auto">
            {filtrees.length === perimetre.length
              ? `${perimetre.length} élève${perimetre.length > 1 ? 's' : ''}`
              : `${filtrees.length} sur ${perimetre.length}`}
          </h2>
          <label className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={recherche}
              onChange={(e) => { setRecherche(e.target.value); setNumero(1) }}
              placeholder="Un prénom…"
              aria-label="Chercher un élève"
              className="h-10 w-48 rounded-full border bg-background pl-9 pr-3 text-sm font-semibold outline-none focus:border-primary"
            />
          </label>
          {classes.length > 1 ? (
            <select
              value={classe ?? ''}
              onChange={(e) => { setClasse(e.target.value || null); setNumero(1) }}
              aria-label="Classe"
              className="h-10 rounded-full border bg-background px-3 text-sm font-semibold"
            >
              <option value="">Toutes les classes</option>
              {classes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          ) : null}
          <label className="flex h-10 cursor-pointer items-center gap-2 rounded-full border px-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={nouveauxDuMois}
              onChange={(e) => { setNouveauxDuMois(e.target.checked); setNumero(1) }}
              className="accent-primary"
            />
            Arrivés ce mois-ci
          </label>
          {statut ? (
            <button type="button" onClick={() => filtrerStatut(null)} className="h-10 rounded-full bg-secondary px-3 text-sm font-bold text-primary">
              {LIBELLE_STATUT[statut]} ×
            </button>
          ) : null}
        </div>

        <div className="-mx-4 mt-3 overflow-x-auto px-4">
          <table className="w-full min-w-[820px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left text-xs font-extrabold tracking-wide text-muted-foreground uppercase">
                <th scope="col" className="w-8 border-b pb-2">
                  <input
                    type="checkbox"
                    aria-label="Tout sélectionner (cette page)"
                    className="size-4 accent-primary"
                    checked={visibles.length > 0 && visibles.every((l) => selection.has(l.eleveId))}
                    onChange={(e) =>
                      setSelection((s) => {
                        const n = new Set(s)
                        for (const l of visibles) {
                          if (e.target.checked) n.add(l.eleveId)
                          else n.delete(l.eleveId)
                        }
                        return n
                      })
                    }
                  />
                </th>
                <Th cle="statut" tri={tri} onTri={changerTri} className="w-[28%]">Élève</Th>
                <Th cle="derniereActivite" tri={tri} onTri={changerTri}>Dernière activité</Th>
                <Th cle="secondes7" tri={tri} onTri={changerTri}>Temps · 7 j</Th>
                <Th cle="joursActifs7" tri={tri} onTri={changerTri}>Régularité</Th>
                <Th cle="matiereFaible" tri={tri} onTri={changerTri}>Matière la plus faible</Th>
                <th scope="col" className="border-b pb-2">Objectif · semaine</th>
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm font-semibold text-muted-foreground">
                    Personne ne correspond.
                  </td>
                </tr>
              ) : (
                visibles.map((l) => (
                  <tr key={l.eleveId} className={cn('group', selection.has(l.eleveId) && 'bg-secondary/50')}>
                    <Td premiere>
                      <input
                        type="checkbox"
                        aria-label={`Sélectionner ${l.prenom}`}
                        className="size-4 accent-primary"
                        checked={selection.has(l.eleveId)}
                        onChange={() => basculer(l.eleveId)}
                      />
                    </Td>
                    <Td>
                      <Link href={`/coach/eleves/${l.eleveId}`} className="flex items-center gap-3">
                        <PastilleStatut statut={l.statut} />
                        <span className="min-w-0">
                          <span className="font-heading flex items-center gap-1.5 truncate font-extrabold group-hover:text-primary">
                            {l.prenom}
                            {l.pseudo ? <span className="text-xs font-bold text-muted-foreground">@{l.pseudo}</span> : null}
                            {suivi[l.eleveId]?.nonLus ? (
                              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] text-primary-foreground" title="Messages non lus">
                                {suivi[l.eleveId].nonLus}
                              </span>
                            ) : null}
                            {suivi[l.eleveId] && !suivi[l.eleveId].ficheEntree ? (
                              <span className="size-2 rounded-full bg-(--warning)" title="Fiche d’entrée à remplir" />
                            ) : null}
                          </span>
                          <span className="block truncate text-xs font-semibold text-muted-foreground">
                            {[l.classe, l.groupe].filter(Boolean).join(' · ')}
                            {l.raisons[0] ? ` — ${l.raisons[0]}` : ''}
                          </span>
                        </span>
                      </Link>
                    </Td>
                    <Td>
                      <span className={cn('font-bold', l.statut === 'rouge' && 'text-(--destructive)')}>
                        {formaterDerniereActivite(l.derniereActivite, aujourdhui)}
                      </span>
                    </Td>
                    <Td>
                      <span className="font-heading font-extrabold tabular-nums">{formaterDuree(l.secondes7)}</span>
                      {l.secondes4s > 0 ? (
                        <span className="ml-1.5 text-xs font-semibold text-muted-foreground">
                          · moy. {formaterDuree(l.secondes4s / 4)}
                        </span>
                      ) : null}
                    </Td>
                    <Td>
                      <Regularite jours={l.joursActifs7} />
                    </Td>
                    <Td>
                      {l.matiereFaible && l.ratioFaible !== null ? (
                        <span className="font-bold">
                          {l.matiereFaible}
                          <span className={cn('ml-1.5 tabular-nums', l.ratioFaible < 0.5 ? 'text-(--destructive)' : 'text-muted-foreground')}>
                            {Math.round(l.ratioFaible * 100)} %
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </Td>
                    <Td>
                      <ObjectifCellule s={suivi[l.eleveId]} />
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pages > 1 ? (
          <div className="mt-3 flex items-center justify-end gap-2 text-sm font-bold">
            <button
              type="button"
              onClick={() => setNumero((n) => Math.max(1, n - 1))}
              disabled={numeroBorne <= 1}
              aria-label="Page précédente"
              className="grid size-9 place-items-center rounded-full border disabled:opacity-40"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <span className="tabular-nums">
              {numeroBorne} / {pages}
            </span>
            <button
              type="button"
              onClick={() => setNumero((n) => Math.min(pages, n + 1))}
              disabled={numeroBorne >= pages}
              aria-label="Page suivante"
              className="grid size-9 place-items-center rounded-full border disabled:opacity-40"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </section>

      <BarreGroupee
        selection={[...selection]}
        prenoms={Object.fromEntries(lignes.map((l) => [l.eleveId, l.prenom]))}
        sansParent={[...selection].filter((id) => suivi[id] && !suivi[id].parentLie).length}
        onVider={() => setSelection(new Set())}
      />
    </div>
  )
}

/** L'avancée de l'objectif de la semaine (minutes), ou « — » sans objectif. */
function ObjectifCellule({ s }: { s?: SuiviClient }) {
  if (!s || !s.objMinutes) return <span className="text-muted-foreground">—</span>
  const part = Math.min(1, s.minutesSemaine / s.objMinutes)
  return (
    <span className="flex items-center gap-2" title={`${s.minutesSemaine} min sur ${s.objMinutes}`}>
      <span className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
        <span className={cn('block h-full rounded-full', part >= 1 ? 'bg-(--success)' : 'bg-primary')} style={{ width: `${Math.round(part * 100)}%` }} />
      </span>
      <span className="text-xs font-bold tabular-nums">{Math.round(part * 100)} %</span>
    </span>
  )
}

function Puce({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'h-9 rounded-full px-3.5 text-sm font-bold transition-colors',
        active ? 'bg-primary text-primary-foreground' : 'bg-card ring-1 ring-primary/15 hover:bg-secondary',
      )}
    >
      {children}
    </button>
  )
}

const TEINTE_COMPTEUR: Record<Statut, string> = {
  vert: 'text-(--success)',
  orange: 'text-(--warning)',
  rouge: 'text-(--destructive)',
  nouveau: 'text-muted-foreground',
}

function Compteur({
  libelle,
  valeur,
  total,
  teinte,
  actif,
  onClick,
}: {
  libelle: string
  valeur: number
  total: number
  teinte: Statut
  actif: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={cn('carte p-4 text-left transition-shadow', actif && 'ring-2 ring-primary')}
    >
      <span className={cn('font-heading block text-3xl leading-none font-extrabold tabular-nums', TEINTE_COMPTEUR[teinte])}>
        {valeur}
        {total > 0 ? <span className="ml-1 text-base text-muted-foreground">/ {total}</span> : null}
      </span>
      <span className="mt-1.5 block text-xs font-extrabold tracking-wide text-muted-foreground uppercase">
        {libelle}
      </span>
    </button>
  )
}

function Th({
  cle,
  tri,
  onTri,
  className,
  children,
}: {
  cle: CleDeTri
  tri: { cle: CleDeTri; sens: 'asc' | 'desc' }
  onTri: (cle: CleDeTri) => void
  className?: string
  children: React.ReactNode
}) {
  const actif = tri.cle === cle
  return (
    <th scope="col" className={cn('border-b pb-2', className)} aria-sort={actif ? (tri.sens === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button type="button" onClick={() => onTri(cle)} className={cn('inline-flex items-center gap-1 hover:text-foreground', actif && 'text-foreground')}>
        {children}
        {actif ? (
          tri.sens === 'asc' ? <ArrowUp className="size-3.5" aria-hidden="true" /> : <ArrowDown className="size-3.5" aria-hidden="true" />
        ) : null}
      </button>
    </th>
  )
}

function Td({ premiere = false, children }: { premiere?: boolean; children: React.ReactNode }) {
  return <td className={cn('border-b py-2.5 pr-3 align-middle', premiere && 'pl-0')}>{children}</td>
}

/** Sept points, un par jour de la semaine glissante — remplis selon les jours actifs. */
function Regularite({ jours }: { jours: number }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label={`${jours} jour${jours > 1 ? 's' : ''} actif${jours > 1 ? 's' : ''} sur 7`}>
      <span className="inline-flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className={cn('inline-block size-2 rounded-full', i < jours ? 'bg-primary' : 'bg-secondary')} />
        ))}
      </span>
      <span className="font-heading font-extrabold tabular-nums">{jours}/7</span>
    </span>
  )
}
