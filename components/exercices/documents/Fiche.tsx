import type { ReactNode } from 'react'
import type { DocFiche, LigneFiche } from '@/lib/exercices/types'
import { cn } from '@/lib/utils'
import { couleur, couleurClaire, etatCible, Inline, type ZonesDoc } from '../commun'
import s from '../manuel.module.css'

/**
 * LE DOCUMENT « AUTHENTIQUE » — ce qu'on trouve dans la vraie vie et que les
 * manuels reproduisent : un ticket de caisse, un menu, une affiche, une
 * étiquette nutritionnelle, un carton d'invitation, un panneau, une recette,
 * une grille d'horaires, une carte postale. Chaque modèle a SON dessin : c'est
 * ce qui fait qu'on « lit un document » et pas une liste de plus.
 */
export function Fiche({ doc, zones }: { doc: DocFiche; zones?: ZonesDoc }) {
  const ligne = (l: LigneFiche, i: number, rendu: (l: Exclude<LigneFiche, { separateur: true }>) => ReactNode) => {
    if ('separateur' in l) return <hr key={i} className="my-1.5 border-dashed border-current opacity-30" />
    const etat = etatCible(l.id, zones)
    const touche = zones?.actif && l.id
    return (
      <div
        key={i}
        className={cn(
          'px-1',
          touche && s.ligneTouchable,
          etat === 'choisie' && s.ligneChoisie,
          etat === 'juste' && s.ligneJuste,
          etat === 'fausse' && s.ligneFausse,
        )}
        {...(touche
          ? {
              role: 'button',
              tabIndex: 0,
              'aria-pressed': zones.choisies.has(l.id as string),
              onClick: () => zones.basculer(l.id as string),
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  zones.basculer(l.id as string)
                }
              },
            }
          : {})}
      >
        {rendu(l)}
      </div>
    )
  }

  const valeurADroite = (l: Exclude<LigneFiche, { separateur: true }>, pointilles = false) => (
    <div className={cn('flex items-baseline justify-between gap-2 py-0.5', l.gras && 'font-extrabold')}>
      <span>
        <Inline texte={l.texte} />
      </span>
      {pointilles && l.valeur ? <span className={s.pointilles} aria-hidden="true" /> : null}
      {l.valeur ? <span className="shrink-0 tabular-nums">{l.valeur}</span> : null}
    </div>
  )

  switch (doc.modele) {
    case 'ticket':
      return (
        <div className={s.ticket}>
          <p className="text-center text-[0.95rem] font-bold tracking-widest uppercase">
            {doc.emoji ? `${doc.emoji} ` : ''}
            {doc.entete}
          </p>
          {doc.sousTitre ? <p className="text-center opacity-70">{doc.sousTitre}</p> : null}
          <hr className="my-2 border-dashed border-current opacity-40" />
          {doc.lignes.map((l, i) => ligne(l, i, (x) => valeurADroite(x)))}
          {doc.pied ? (
            <>
              <hr className="my-2 border-dashed border-current opacity-40" />
              <p className="text-center opacity-70">{doc.pied}</p>
            </>
          ) : null}
        </div>
      )
    case 'menu':
      return (
        <div className={s.menu}>
          <p className="text-center text-xl font-bold italic" style={{ color: couleur(doc.teinte, 'brun') }}>
            {doc.emoji ? `${doc.emoji} ` : ''}
            {doc.entete}
          </p>
          {doc.sousTitre ? <p className="mb-2 text-center text-sm italic opacity-70">{doc.sousTitre}</p> : null}
          <div className="text-[0.92rem]">{doc.lignes.map((l, i) => ligne(l, i, (x) => valeurADroite(x, true)))}</div>
          {doc.pied ? <p className="mt-2 text-center text-xs italic opacity-70">{doc.pied}</p> : null}
        </div>
      )
    case 'etiquette':
      return (
        <div className={s.etiquetteNutri}>
          <p className="text-[1.05rem] font-black">{doc.entete}</p>
          {doc.sousTitre ? <p className="text-xs">{doc.sousTitre}</p> : null}
          <div className="mt-1 border-t-8 border-[#1d1d1d] pt-1">
            {doc.lignes.map((l, i) =>
              ligne(l, i, (x) => (
                <div className={cn('flex justify-between gap-2 border-b border-[#1d1d1d]/40 py-0.5', x.gras && 'font-black')}>
                  <span>
                    <Inline texte={x.texte} />
                  </span>
                  <span className="tabular-nums">{x.valeur}</span>
                </div>
              )),
            )}
          </div>
          {doc.pied ? <p className="mt-1 text-[0.68rem]">{doc.pied}</p> : null}
        </div>
      )
    case 'affiche':
    case 'invitation':
      return (
        <div className={s.affiche}>
          <div
            className="px-4 py-4 text-center text-white"
            style={{ background: `linear-gradient(160deg, ${couleur(doc.teinte, 'violet')}, color-mix(in oklch, ${couleur(doc.teinte, 'violet')}, black 22%))` }}
          >
            {doc.emoji ? <div className="text-4xl leading-none" aria-hidden="true">{doc.emoji}</div> : null}
            <p className="font-heading mt-1 text-2xl leading-tight font-extrabold text-balance">{doc.entete}</p>
            {doc.sousTitre ? <p className="mt-0.5 text-sm font-semibold opacity-90">{doc.sousTitre}</p> : null}
          </div>
          <div className={cn('px-4 py-3 text-[0.9rem]', doc.modele === 'invitation' && 'text-center')}>
            {doc.lignes.map((l, i) =>
              ligne(l, i, (x) => (
                <p className={cn('py-0.5', x.gras && 'font-extrabold')}>
                  <Inline texte={x.texte} />
                  {x.valeur ? <span className="font-extrabold"> {x.valeur}</span> : null}
                </p>
              )),
            )}
          </div>
          {doc.pied ? (
            <p className="border-t border-dashed px-4 py-2 text-center text-xs font-bold" style={{ color: couleur(doc.teinte, 'violet') }}>
              {doc.pied}
            </p>
          ) : null}
        </div>
      )
    case 'panneau':
      return (
        <div
          className="mx-auto max-w-xs rounded-2xl p-1.5"
          style={{ background: couleur(doc.teinte, 'bleu') }}
        >
          <div className="rounded-xl border-2 border-white/80 px-4 py-3 text-white">
            <p className="font-heading text-center text-xl leading-tight font-extrabold">
              {doc.emoji ? `${doc.emoji} ` : ''}
              {doc.entete}
            </p>
            {doc.sousTitre ? <p className="text-center text-sm font-semibold opacity-90">{doc.sousTitre}</p> : null}
            <div className="mt-2 text-[0.9rem] font-semibold">{doc.lignes.map((l, i) => ligne(l, i, (x) => valeurADroite(x)))}</div>
            {doc.pied ? <p className="mt-2 text-center text-xs opacity-85">{doc.pied}</p> : null}
          </div>
        </div>
      )
    case 'recette':
      return (
        <div className="mx-auto max-w-sm rounded-xl bg-white p-4 shadow-[inset_0_0_0_1.5px_var(--papier-trait)]" style={{ backgroundImage: 'repeating-linear-gradient(transparent 0 1.55rem, color-mix(in oklch, var(--t-bleu), white 82%) 1.55rem 1.6rem)' }}>
          <p className="font-heading text-lg font-extrabold" style={{ color: couleur(doc.teinte, 'corail') }}>
            {doc.emoji ? `${doc.emoji} ` : ''}
            {doc.entete}
          </p>
          {doc.sousTitre ? <p className="text-sm font-semibold opacity-70">{doc.sousTitre}</p> : null}
          <div className="mt-1 text-[0.92rem] leading-[1.6rem]">{doc.lignes.map((l, i) => ligne(l, i, (x) => valeurADroite(x)))}</div>
          {doc.pied ? <p className="mt-1 text-xs italic opacity-70">{doc.pied}</p> : null}
        </div>
      )
    case 'horaires':
      return (
        <div className={cn(s.horaires, 'mx-auto max-w-sm overflow-hidden rounded-xl shadow-lg')}>
          <p className="flex items-center gap-2 bg-black/25 px-3 py-2 text-sm font-extrabold tracking-wide text-white uppercase">
            {doc.emoji ? <span aria-hidden="true">{doc.emoji}</span> : null}
            {doc.entete}
            {doc.sousTitre ? <span className="ml-auto text-xs font-semibold normal-case opacity-80">{doc.sousTitre}</span> : null}
          </p>
          <div className="px-3 py-2 font-mono text-[0.85rem]">{doc.lignes.map((l, i) => ligne(l, i, (x) => valeurADroite(x)))}</div>
          {doc.pied ? <p className="px-3 pb-2 text-xs text-white/70">{doc.pied}</p> : null}
        </div>
      )
    case 'carte-postale':
      return (
        <div className={cn(s.cartePostale, 'mx-auto grid max-w-md grid-cols-[1fr_auto] gap-3 rounded-md p-4 font-[Georgia,serif] shadow-md')}>
          <div className="text-[0.92rem] italic">
            <p className="mb-1 font-bold not-italic">{doc.entete}</p>
            {doc.lignes.map((l, i) =>
              ligne(l, i, (x) => (
                <p className="py-0.5">
                  <Inline texte={x.texte} />
                </p>
              )),
            )}
            {doc.pied ? <p className="mt-1 text-right">{doc.pied}</p> : null}
          </div>
          <div
            className="flex size-14 items-center justify-center rounded-sm border-2 border-dashed text-2xl"
            style={{ borderColor: couleur(doc.teinte, 'corail'), background: couleurClaire(doc.teinte, 'corail', 85) }}
            aria-hidden="true"
          >
            {doc.emoji ?? '✉️'}
          </div>
        </div>
      )
  }
}
