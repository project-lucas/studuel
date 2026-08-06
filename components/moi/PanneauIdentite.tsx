'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { EquipmentArt } from '@/components/avatar/vestiaire-assets'
import type { WorkLevel } from '@/lib/work-level'

// LE PANNEAU — le point d'entrée du regard, et le seul de l'écran.
//
// Ce qu'il remplace : une carte violette, puis trois tuiles blanches, puis
// quatre cartes blanches — toutes de même taille, de même rayon, de même ombre.
// Un écran où rien n'est plus important que le reste n'a pas de hiérarchie, il
// a une liste. Le haut de l'onglet devient donc une SURFACE pleine largeur qui
// porte l'identité et les trois preuves ensemble : qui je suis et ce que j'ai
// fait ne sont pas deux sujets, c'est le même.
//
// LES PREUVES NE SONT PLUS DES TUILES. « 12 » au-dessus de « jours de série »
// dans une boîte, trois fois de suite, c'est le gabarit de tableau de bord que
// tout le monde reconnaît et que personne ne lit. Ici chaque preuve est une
// PHRASE dont le chiffre est le mot fort, posée sur une étagère de verre, et
// séparée de sa voisine par un filet — pas par une bordure de carte.

function Preuve({
  valeur,
  unite,
  legende,
  tendance,
}: {
  valeur: ReactNode
  unite?: string
  legende: string
  tendance?: string | null
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center px-1 text-center">
      <p className="font-heading flex items-baseline gap-0.5 leading-none font-extrabold whitespace-nowrap text-white">
        <span className="text-[26px] tabular-nums">{valeur}</span>
        {unite ? <span className="text-sm text-white/80">{unite}</span> : null}
      </p>
      <p className="mt-1 text-[11px] leading-tight font-bold text-white/85">
        {legende}
      </p>
      {/* Absente plutôt qu'inventée : « stable » sans point de comparaison
          serait un mensonge, et une ligne vide vaut mieux qu'une fausse. */}
      {tendance ? (
        <p className="mt-0.5 text-[10px] leading-tight font-bold text-white/75">
          {tendance}
        </p>
      ) : null}
    </div>
  )
}

function Filet() {
  return <span aria-hidden="true" className="moi-filet w-px self-stretch" />
}

export default function PanneauIdentite({
  titre,
  sousTitre,
  name,
  gradeLabel,
  avatarUri,
  equipment,
  level,
  standing = null,
  serie,
  record,
  temps,
  tempsTendance,
  moyenne,
  moyenneTendance,
  saisieMoyenne,
}: {
  /** Le nom de l'onglet : il vit DANS le panneau, pas au-dessus. */
  titre: string
  sousTitre: string
  name: string
  gradeLabel: string | null
  avatarUri: string
  /** Slug de l'accessoire porté (vestiaire), '' si aucun. */
  equipment: string
  level: WorkLevel
  /** « Tu travailles plus que 96 % des 3e », rendu par le serveur. */
  standing?: ReactNode
  serie: number
  /** Meilleure série jamais tenue, dite seulement si elle dépasse. */
  record: number
  /** Temps de travail cumulé, déjà formaté (« 27 h »). */
  temps: string
  tempsTendance: string | null
  /** Moyenne du dernier trimestre renseigné (« 13,4 »), ou null. */
  moyenne: string | null
  moyenneTendance: string | null
  /** Le bouton de saisie, rendu à la place du chiffre quand il manque. */
  saisieMoyenne: ReactNode
}) {
  const pct = Math.round(level.progress * 100)

  return (
    <section
      aria-label="Mon profil"
      // Pleine largeur : le panneau sort des marges de la page (-mx) et rejoint
      // les bords de l'écran. C'est le seul bloc de l'onglet qui le fait, avec
      // la bande « matière du moment » — deux ruptures, pas dix.
      className="moi-panneau relative -mx-4 -mt-2 overflow-hidden rounded-b-[2rem] px-4 pt-3 pb-4 text-white md:-mx-8 md:rounded-b-[2.5rem] md:px-8"
    >
      <span
        aria-hidden="true"
        className="moi-blob absolute -top-14 -left-10 h-36 w-36 rounded-full blur-xl"
      />

      <div className="relative">
        <h1 className="font-heading text-2xl leading-tight font-bold">{titre}</h1>
        <p className="mt-0.5 text-sm text-white/85">{sousTitre}</p>
      </div>

      <div className="relative mt-4 flex max-w-lg items-center gap-4">
        {/* Tap sur l'avatar (ou le crayon) : entrée dans le vestiaire. */}
        <Link
          href="/moi/avatar"
          onClick={() => sfx.tap()}
          aria-label="Personnaliser mon avatar"
          className="group relative block size-24 shrink-0 cursor-pointer transition-transform active:scale-[0.97]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUri}
            alt=""
            className="size-24 rounded-full ring-4 ring-white/25 drop-shadow-lg"
          />
          {equipment ? (
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 block size-[34%] drop-shadow-md"
            >
              <EquipmentArt slug={equipment} />
            </span>
          ) : null}
          <span className="absolute -right-1 bottom-0 flex size-8 items-center justify-center rounded-full bg-white text-primary shadow-md transition-transform group-hover:scale-110">
            <Pencil className="size-3.5" strokeWidth={2.6} aria-hidden="true" />
          </span>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="font-heading truncate text-[22px] leading-tight font-extrabold">
              {name}
            </p>
            {gradeLabel ? (
              <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-extrabold text-white ring-1 ring-white/25">
                {gradeLabel}
              </span>
            ) : null}
          </div>

          {/* Le rang de travail : le seul chiffre d'identité de l'écran, et il
              ne redescend jamais. */}
          <p className="mt-1.5 text-[11px] font-extrabold tracking-wide text-white/90 uppercase">
            {level.title} · niveau {level.level}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <span
              aria-hidden="true"
              className="block h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-white/20"
            >
              <span
                className="block h-full rounded-full bg-highlight"
                style={{ width: `${pct}%` }}
              />
            </span>
            <span
              className="font-mono text-[11px] leading-none font-extrabold text-white/90 tabular-nums"
              aria-label={`${pct} % vers le niveau suivant`}
            >
              {pct}%
            </span>
          </div>
          {level.nextHours !== null ? (
            <p className="mt-1 text-[11px] font-semibold text-white/80">
              {level.nextHours} h de travail pour le rang suivant
            </p>
          ) : null}
        </div>
      </div>

      {standing ? <div className="relative mt-3">{standing}</div> : null}

      {/* L'étagère des trois preuves. */}
      <div
        className={cn(
          'moi-etagere relative mt-4 flex items-stretch rounded-2xl px-1 py-3',
        )}
      >
        <Preuve
          valeur={serie}
          legende={serie === 1 ? 'jour de série' : 'jours de série'}
          tendance={record > serie ? `record ${record} j` : null}
        />
        <Filet />
        <Preuve
          valeur={temps}
          legende="de travail"
          tendance={tempsTendance}
        />
        <Filet />
        <Preuve
          valeur={moyenne ?? saisieMoyenne}
          unite={moyenne ? '/20' : undefined}
          legende={moyenne ? 'de moyenne' : 'tes notes'}
          tendance={moyenneTendance}
        />
      </div>
    </section>
  )
}
