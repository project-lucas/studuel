'use client'

import { useOptimistic, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Camera, Check, Crown, Dices, ListOrdered, Mic, Plus, Quote, SpellCheck, Target, Trash2 } from 'lucide-react'
import Feuille from '@/components/boutique/Feuille'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { DOSSIER, ETAPES, estPrete, etatDossier, type Etape, type Piece } from '@/lib/examen/dossier-oral'
import type { IdExamen } from '@/lib/examen/parcours'
import type { Specialite } from '@/lib/examen/onglet'
import { reduireImage } from '@/lib/coach/piece-jointe'
import { ajouterPiece, cocherEtape, lireDescriptif, modifierPiece, retirerPiece } from '@/app/examen/actions'
import OralBlanc from './OralBlanc'

const ICONES: Record<Etape['icone'], typeof BookOpen> = {
  'book-open': BookOpen,
  'spell-check': SpellCheck,
  mic: Mic,
  target: Target,
  'list-ordered': ListOrdered,
  quote: Quote,
}

const VISIBLES = 5

/**
 * « ET L’ORAL ? » — LE DOSSIER D’ORAL (maquettes 2, 4 et 6) : ce que l’élève
 * présentera, pièce par pièce, avec ses étapes à cocher d’un toucher.
 *   3e  son projet · 1re sa liste de textes (recopiée, ou lue en photo par
 *   Marcel) · Tle ses deux questions du Grand oral.
 * Puis l’ORAL BLANC, tiré au sort comme le jour J. Réservé à Studuel+ ;
 * le gratuit voit ce que c’est, couronné.
 */
export default function DossierOral({
  examen,
  pieces,
  disponible,
  ouvert,
  specialites,
  oralBlanc,
  ouvrirOralBlanc,
  fermerOralBlanc,
}: {
  examen: IdExamen
  pieces: Piece[]
  disponible: boolean
  ouvert: boolean
  specialites: Specialite[]
  /** Le tirage de l’oral blanc en cours, `null` s’il est fermé. */
  oralBlanc: number | null
  ouvrirOralBlanc: () => void
  fermerOralBlanc: () => void
}) {
  const d = DOSSIER[examen]
  const etapes = ETAPES[d.genre]
  const [vues, setVues] = useState(pieces)
  const [optimistes, cocher] = useOptimistic(vues, (liste, maj: { id: string; etape: string; fait: boolean }) =>
    liste.map((p) => (p.id === maj.id ? { ...p, etapes: { ...p.etapes, [maj.etape]: maj.fait } } : p)),
  )
  const [, demarrer] = useTransition()
  const [editee, setEditee] = useState<Piece | 'nouvelle' | null>(null)
  const [tout, setTout] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [lecture, setLecture] = useState(false)
  const fichier = useRef<HTMLInputElement>(null)

  // Le serveur rafraîchit la page après chaque écriture : on suit SA liste
  // dès qu’elle change (le motif « prop précédente » de React).
  const [precedentes, setPrecedentes] = useState(pieces)
  if (pieces !== precedentes) {
    setPrecedentes(pieces)
    setVues(pieces)
  }

  const etat = etatDossier(examen, optimistes)
  const liste = tout ? optimistes : optimistes.slice(0, VISIBLES)

  const basculer = (p: Piece, etape: string) => {
    if (!ouvert) return
    sfx.tap()
    const fait = !p.etapes[etape]
    demarrer(async () => {
      cocher({ id: p.id, etape, fait })
      const r = await cocherEtape(p.id, etape, fait)
      if (r.ok) setVues((l) => l.map((x) => (x.id === p.id ? { ...x, etapes: { ...x.etapes, [etape]: fait } } : x)))
      else setMessage('Je n’ai pas pu cocher cette étape. Vérifie ta connexion et réessaie.')
    })
  }

  const lirePhoto = async (f: File | undefined) => {
    if (!f) return
    setLecture(true)
    setMessage('Je lis ton descriptif…')
    try {
      const url = await reduireImage(f)
      const r = await lireDescriptif(url)
      setMessage(r.ok ? `${r.ajoutes ?? 0} texte${(r.ajoutes ?? 0) > 1 ? 's' : ''} ajouté${(r.ajoutes ?? 0) > 1 ? 's' : ''} à ta liste.` : (r.erreur ?? 'Je n’ai pas pu lire la photo.'))
    } catch {
      setMessage('Je n’ai pas pu lire la photo.')
    } finally {
      setLecture(false)
      if (fichier.current) fichier.current.value = ''
    }
  }

  const titreCompte =
    d.genre === 'texte'
      ? optimistes.length > 0
        ? `${etat.pretes} / ${optimistes.length} prêt${etat.pretes > 1 ? 's' : ''}`
        : null
      : `${etat.pretes} / ${d.max} prête${etat.pretes > 1 ? 's' : ''}`

  return (
    <section
      id="dossier-oral"
      aria-labelledby="examen-dossier"
      className="rounded-carte shadow-carte scroll-mt-4 p-3.5 ring-2 ring-[color-mix(in_oklch,var(--primary),white_82%)]"
      style={{ backgroundImage: 'linear-gradient(170deg, var(--card) 60%, var(--secondary))' }}
    >
      <div className="flex items-center gap-2">
        <Image src="/images/marcel/outils/oral.webp" alt="" width={28} height={28} unoptimized className="size-7 shrink-0" />
        <h2 id="examen-dossier" className="font-heading min-w-0 flex-1 text-[17px] leading-tight font-extrabold">
          {d.titre}
        </h2>
        {ouvert && disponible && titreCompte ? (
          <span className={cn('shrink-0 text-[12px] font-extrabold', etat.pretes > 0 ? 'text-success' : 'text-muted-foreground')}>{titreCompte}</span>
        ) : null}
      </div>

      {!ouvert ? (
        <>
          <p className="text-muted-foreground mt-1.5 text-[12.5px] leading-snug font-semibold">{d.vide}</p>
          <Button asChild size="lg" className="mt-2.5 w-full">
            <Link href="/plus">
              <Crown aria-hidden="true" />
              Mon dossier d’oral avec Studuel+
            </Link>
          </Button>
        </>
      ) : !disponible ? (
        <p className="text-muted-foreground mt-1.5 text-[12.5px] leading-snug font-semibold">
          Ton dossier d’oral ouvre très bientôt : reviens dans quelques jours.
        </p>
      ) : optimistes.length === 0 ? (
        <>
          <p className="text-muted-foreground mt-1.5 text-[12.5px] leading-snug font-semibold">{d.vide}</p>
          <div className={cn('mt-2.5 grid gap-1.5', d.genre === 'texte' ? 'grid-cols-2' : 'grid-cols-1')}>
            {d.genre === 'texte' ? (
              <Button type="button" variant="outline" size="lg" disabled={lecture} onClick={() => fichier.current?.click()}>
                <Camera aria-hidden="true" />
                Ma liste en photo
              </Button>
            ) : null}
            <Button type="button" size="lg" onClick={() => setEditee('nouvelle')}>
              <Plus aria-hidden="true" />
              {d.ajouter}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10.5px] font-bold" aria-hidden="true">
            {etapes.map((e) => {
              const I = ICONES[e.icone]
              return (
                <span key={e.id} className="inline-flex items-center gap-1">
                  <I className="size-3" strokeWidth={2.6} />
                  {e.court}
                </span>
              )
            })}
          </div>
          <ol className="mt-1">
            {liste.map((p, i) => (
              <li key={p.id} className="border-secondary flex items-center gap-2 border-t-[1.5px] py-1.5">
                <button
                  type="button"
                  onClick={() => setEditee(p)}
                  className="flex min-h-11 min-w-0 flex-1 items-center gap-2 text-left active:opacity-80"
                >
                  <span className="font-heading w-5 shrink-0 text-[13px] font-extrabold text-[color-mix(in_oklch,var(--primary),white_45%)]">
                    {estPrete(p) ? <Check aria-label="Prêt" className="text-success size-4" strokeWidth={3.2} /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] leading-tight font-bold">{p.titre}</span>
                    {p.detail ? <span className="text-muted-foreground block truncate text-[11px] font-semibold">{p.detail}</span> : null}
                  </span>
                </button>
                <span className="-mr-1.5 flex shrink-0">
                  {etapes.map((e) => {
                    const fait = p.etapes[e.id]
                    const I = ICONES[e.icone]
                    return (
                      <button
                        key={e.id}
                        type="button"
                        aria-pressed={fait}
                        aria-label={`${e.label} — ${p.titre}`}
                        onClick={() => basculer(p, e.id)}
                        // 44 px de cible, une case de 32 px dessinée dedans.
                        className="group grid size-11 place-items-center"
                      >
                        <span
                          className={cn(
                            'grid size-8 place-items-center rounded-[9px] transition group-active:scale-90',
                            fait ? 'bg-success text-white' : 'bg-secondary text-[color-mix(in_oklch,var(--primary),white_40%)]',
                          )}
                        >
                          {fait ? <Check aria-hidden="true" className="size-4" strokeWidth={3.2} /> : <I aria-hidden="true" className="size-3.5" strokeWidth={2.6} />}
                        </span>
                      </button>
                    )
                  })}
                </span>
              </li>
            ))}
          </ol>
          {optimistes.length > VISIBLES ? (
            <button type="button" onClick={() => setTout((t) => !t)} className="text-primary min-h-10 w-full text-center text-[12.5px] font-extrabold">
              {tout ? 'Replier la liste' : `+ ${optimistes.length - VISIBLES} texte${optimistes.length - VISIBLES > 1 ? 's' : ''} · voir toute la liste`}
            </button>
          ) : null}

          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {d.genre === 'texte' ? (
              <Button type="button" variant="outline" size="lg" disabled={lecture} onClick={() => fichier.current?.click()}>
                <Camera aria-hidden="true" />
                {lecture ? 'Je lis…' : 'Photo'}
              </Button>
            ) : optimistes.length < d.max ? (
              <Button type="button" variant="outline" size="lg" onClick={() => setEditee('nouvelle')}>
                <Plus aria-hidden="true" />
                {d.genre === 'question' ? 'Question 2' : d.ajouter}
              </Button>
            ) : null}
            <Button
              type="button"
              size="lg"
              className={cn(!(d.genre === 'texte' || optimistes.length < d.max) && 'col-span-2')}
              onClick={() => {
                sfx.tap()
                ouvrirOralBlanc()
              }}
            >
              <Dices aria-hidden="true" />
              {d.genre === 'question' ? 'Grand oral blanc' : 'Oral blanc'}
            </Button>
          </div>
          {d.genre === 'texte' && optimistes.length < d.max ? (
            <button type="button" onClick={() => setEditee('nouvelle')} className="text-primary mt-1 min-h-10 w-full text-center text-[12.5px] font-extrabold">
              + Ajouter un texte à la main
            </button>
          ) : null}
        </>
      )}

      {message ? (
        <p role="status" className="bg-secondary text-primary mt-2 rounded-xl px-3 py-2 text-[12px] font-bold">
          {message}
        </p>
      ) : null}

      <input
        ref={fichier}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => void lirePhoto(e.target.files?.[0])}
      />

      <FeuillePiece
        piece={editee}
        genre={d.genre}
        specialites={specialites}
        onClose={() => setEditee(null)}
        onMessage={setMessage}
      />
      <OralBlanc examen={examen} pieces={optimistes} tirage={oralBlanc} onClose={fermerOralBlanc} />
    </section>
  )
}

/** Écrire ou réécrire une pièce, ou la retirer. */
function FeuillePiece({
  piece,
  genre,
  specialites,
  onClose,
  onMessage,
}: {
  piece: Piece | 'nouvelle' | null
  genre: Piece['genre']
  specialites: Specialite[]
  onClose: () => void
  onMessage: (m: string | null) => void
}) {
  const existante = piece && piece !== 'nouvelle' ? piece : null
  const [enCours, demarrer] = useTransition()
  const [erreur, setErreur] = useState<string | null>(null)

  const libelles =
    genre === 'texte'
      ? { titre: 'Le texte', exTitre: '« Demain, dès l’aube »', detail: 'Auteur et œuvre', exDetail: 'Hugo, Les Contemplations' }
      : genre === 'question'
        ? { titre: 'Ta question', exTitre: 'Les réseaux sociaux rendent-ils moins libres ?', detail: 'Ce que tu veux y montrer', exDetail: 'Facultatif' }
        : { titre: 'Ton projet', exTitre: 'Le voyage à Berlin, mémoire de la guerre froide', detail: 'Le cadre', exDetail: 'EPI, parcours avenir, artistique…' }

  const envoyer = (form: FormData) => {
    setErreur(null)
    demarrer(async () => {
      const titre = form.get('titre')
      const detail = form.get('detail')
      const matiere = form.get('matiere')
      const r = existante ? await modifierPiece(existante.id, titre, detail, matiere) : await ajouterPiece(genre, titre, detail, matiere)
      if (!r.ok) {
        setErreur(r.erreur ?? 'Ça n’a pas marché. Réessaie.')
        return
      }
      onMessage(null)
      onClose()
    })
  }

  return (
    <Feuille open={piece !== null} onClose={onClose} label={existante ? 'Modifier' : 'Ajouter'}>
      {piece !== null ? (
        <form action={envoyer} className="space-y-3 pt-1" key={existante?.id ?? 'nouvelle'}>
          <h2 className="font-heading pr-12 text-[21px] leading-tight font-extrabold">{existante ? 'Modifier' : libelles.titre}</h2>
          <label className="block">
            <span className="text-[12.5px] font-extrabold">{libelles.titre}</span>
            <input
              name="titre"
              required
              maxLength={200}
              defaultValue={existante?.titre ?? ''}
              placeholder={libelles.exTitre}
              className="bg-secondary/60 focus-visible:ring-primary mt-1 block min-h-12 w-full rounded-xl px-3 text-[15px] font-semibold outline-none focus-visible:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-[12.5px] font-extrabold">{libelles.detail}</span>
            <input
              name="detail"
              maxLength={200}
              defaultValue={existante?.detail ?? ''}
              placeholder={libelles.exDetail}
              className="bg-secondary/60 focus-visible:ring-primary mt-1 block min-h-12 w-full rounded-xl px-3 text-[15px] font-semibold outline-none focus-visible:ring-2"
            />
          </label>
          {genre === 'question' && specialites.length > 0 ? (
            <label className="block">
              <span className="text-[12.5px] font-extrabold">La spécialité</span>
              <select
                name="matiere"
                defaultValue={existante?.matiere ?? specialites[0]?.slug}
                className="bg-secondary/60 focus-visible:ring-primary mt-1 block min-h-12 w-full rounded-xl px-3 text-[15px] font-semibold outline-none focus-visible:ring-2"
              >
                {specialites.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.nom}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <input type="hidden" name="matiere" value={genre === 'texte' ? 'francais' : ''} />
          )}
          {erreur ? (
            <p role="alert" className="text-destructive text-[12.5px] font-bold">
              {erreur}
            </p>
          ) : null}
          <Button type="submit" size="xl" className="w-full" disabled={enCours}>
            {enCours ? 'J’enregistre…' : existante ? 'Enregistrer' : 'Ajouter'}
          </Button>
          {existante ? (
            <Button
              type="button"
              variant="ghost"
              className="text-muted-foreground w-full"
              disabled={enCours}
              onClick={() =>
                demarrer(async () => {
                  const r = await retirerPiece(existante.id)
                  if (r.ok) onClose()
                  else setErreur('Je n’ai pas pu la retirer.')
                })
              }
            >
              <Trash2 aria-hidden="true" />
              Retirer de mon dossier
            </Button>
          ) : null}
        </form>
      ) : null}
    </Feuille>
  )
}
