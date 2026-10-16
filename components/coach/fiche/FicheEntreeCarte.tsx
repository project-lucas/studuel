'use client'

import { useState, useTransition } from 'react'
import { ClipboardCheck, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { enregistrerFicheEntreeAction } from '@/app/coach/eleves/actions'
import { lireNote, MATIERES_FICHE, remplissageFiche, type FicheEntree } from '@/lib/coach/suivi'

/**
 * LE POINT DE DÉPART D'UN ÉLÈVE (Lucas : « les informations de départ ») : sans
 * lui, impossible de mesurer une progression. Lecture compacte, et un
 * formulaire complet au crayon. Visible du coach et de l'admin seulement.
 */
export default function FicheEntreeCarte({ eleveId, fiche }: { eleveId: string; fiche: FicheEntree }) {
  const [edition, setEdition] = useState(remplissageFiche(fiche) === 0)
  const [f, setF] = useState<FicheEntree>(fiche)
  const [notes, setNotes] = useState<{ matiere: string; note: string }[]>(
    Object.entries(fiche.moyennes).map(([matiere, n]) => ({ matiere, note: String(n).replace('.', ',') })),
  )
  const [mg, setMg] = useState(fiche.moyenneGenerale === null ? '' : String(fiche.moyenneGenerale).replace('.', ','))
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, demarrer] = useTransition()
  const part = Math.round(remplissageFiche(f) * 100)

  const enregistrer = () => {
    const moyennes: Record<string, number> = {}
    for (const n of notes) {
      const v = lireNote(n.note)
      if (n.matiere.trim() && v !== null) moyennes[n.matiere.trim()] = v
    }
    const suivante = { ...f, moyennes, moyenneGenerale: lireNote(mg) }
    setErreur(null)
    demarrer(async () => {
      const r = await enregistrerFicheEntreeAction(eleveId, suivante)
      if (!r.ok) return setErreur(r.erreur)
      setF(suivante)
      setEdition(false)
    })
  }

  const champ = (cle: keyof FicheEntree, libelle: string, max: number, lignes = 1, aide?: string) => (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-extrabold tracking-wide text-muted-foreground uppercase">{libelle}</span>
      {lignes > 1 ? (
        <textarea value={String(f[cle] ?? '')} onChange={(e) => setF((x) => ({ ...x, [cle]: e.target.value }))} maxLength={max} rows={lignes} placeholder={aide} className="rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
      ) : (
        <input value={String(f[cle] ?? '')} onChange={(e) => setF((x) => ({ ...x, [cle]: e.target.value }))} maxLength={max} placeholder={aide} className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary" />
      )}
    </label>
  )

  return (
    <section className="carte p-5" aria-labelledby="fiche-entree">
      <div className="flex items-center gap-2">
        <ClipboardCheck className="size-5 text-primary" aria-hidden="true" />
        <h2 id="fiche-entree" className="titre-section flex-1">Point de départ</h2>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-primary tabular-nums">{part} %</span>
        {!edition ? (
          <button type="button" onClick={() => setEdition(true)} className="grid size-9 place-items-center rounded-full hover:bg-secondary" aria-label="Modifier le point de départ">
            <Pencil className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {!edition ? (
        <dl className="mt-3 grid gap-2.5 text-sm">
          <Ligne libelle="Établissement" valeur={f.etablissement} />
          <Ligne libelle="Objectif" valeur={f.objectif} />
          <Ligne libelle="Filière visée" valeur={f.filiere} />
          {Object.keys(f.moyennes).length || f.moyenneGenerale !== null ? (
            <div>
              <dt className="text-xs font-extrabold tracking-wide text-muted-foreground uppercase">Moyennes de départ</dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {f.moyenneGenerale !== null ? <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">Générale {String(f.moyenneGenerale).replace('.', ',')}</span> : null}
                {Object.entries(f.moyennes).map(([m, n]) => (
                  <span key={m} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold">
                    {m} {String(n).replace('.', ',')}
                  </span>
                ))}
              </dd>
            </div>
          ) : null}
          <Ligne libelle="Contraintes" valeur={f.contraintes} />
          <Ligne libelle="Points forts" valeur={f.pointsForts} />
          <Ligne libelle="Points faibles" valeur={f.pointsFaibles} />
          <Ligne libelle="Contact parent" valeur={f.contactParent} />
          <Ligne libelle="Remarques" valeur={f.remarques} />
          {f.majLe ? <p className="text-xs font-semibold text-muted-foreground">Mis à jour le {new Date(f.majLe).toLocaleDateString('fr-FR')}</p> : null}
        </dl>
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          {champ('etablissement', 'Établissement', 120, 1, 'Collège Jean Moulin')}
          {champ('objectif', 'Objectif', 300, 2, 'Brevet avec mention bien, passer en 2de générale…')}
          {champ('filiere', 'Filière visée', 120, 1, 'Bac général, STAPS, BTS…')}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-extrabold tracking-wide text-muted-foreground uppercase">Moyennes de départ (sur 20)</span>
            <label className="flex items-center gap-2 text-sm font-bold">
              Générale
              <input value={mg} onChange={(e) => setMg(e.target.value)} inputMode="decimal" placeholder="12,5" className="h-9 w-20 rounded-lg border bg-background px-2 text-sm" />
            </label>
            {notes.map((n, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  list="matieres-fiche"
                  value={n.matiere}
                  onChange={(e) => setNotes((x) => x.map((y, j) => (j === i ? { ...y, matiere: e.target.value } : y)))}
                  placeholder="Matière"
                  className="h-9 flex-1 rounded-lg border bg-background px-2 text-sm"
                />
                <input
                  value={n.note}
                  onChange={(e) => setNotes((x) => x.map((y, j) => (j === i ? { ...y, note: e.target.value } : y)))}
                  inputMode="decimal"
                  placeholder="11"
                  className="h-9 w-20 rounded-lg border bg-background px-2 text-sm"
                  aria-label="Moyenne"
                />
                <button type="button" onClick={() => setNotes((x) => x.filter((_, j) => j !== i))} className="text-muted-foreground" aria-label="Retirer">
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
            ))}
            <datalist id="matieres-fiche">
              {MATIERES_FICHE.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            {notes.length < 20 ? (
              <button type="button" onClick={() => setNotes((x) => [...x, { matiere: '', note: '' }])} className="inline-flex items-center gap-1 self-start text-xs font-bold text-primary">
                <Plus className="size-3.5" aria-hidden="true" /> une matière
              </button>
            ) : null}
          </div>
          {champ('contraintes', 'Contraintes', 600, 2, 'Entraînements lun/mer/ven 18 h, internat…')}
          {champ('pointsForts', 'Points forts', 600, 2)}
          {champ('pointsFaibles', 'Points faibles', 600, 2)}
          {champ('contactParent', 'Contact parent', 160, 1, 'Mme Martin · 06 …')}
          {champ('remarques', 'Remarques', 2000, 3)}
          {erreur ? <p className="text-sm font-bold text-(--destructive)">{erreur}</p> : null}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEdition(false)} className="h-10 rounded-full px-4 text-sm font-bold">
              Annuler
            </button>
            <button type="button" onClick={enregistrer} disabled={enCours} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-50">
              {enCours ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

function Ligne({ libelle, valeur }: { libelle: string; valeur: string }) {
  if (!valeur.trim()) return null
  return (
    <div>
      <dt className="text-xs font-extrabold tracking-wide text-muted-foreground uppercase">{libelle}</dt>
      <dd className="mt-0.5 whitespace-pre-wrap">{valeur}</dd>
    </div>
  )
}
