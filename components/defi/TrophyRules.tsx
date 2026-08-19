'use client'

import { Info } from 'lucide-react'
import { MATCH_RANGE } from '@/lib/defi/matchmaking'
import { CHAPTER_COMPLETE_SCORE } from '@/lib/subject-unlock'
import {
  SUBJECT_DIVISION_SPAN,
  SUBJECT_DIVISIONS_PER_TIER,
} from '@/lib/subject-rank'
import {
  BAND_SPAN,
  SEASON_KEEP_FLOOR,
  TROPHY_BANDS,
  trophyBand,
} from '@/lib/trophy-road'

/**
 * LA RÈGLE DU JEU, écrite en clair.
 *
 * Le barème existait depuis la migration 238, mais il n'était affiché nulle
 * part : l'élève voyait « +10 » sur une tuile et « +2 » sur une autre sans
 * jamais apprendre pourquoi, et un système qu'on ne comprend pas ne pousse
 * personne — il ressemble à de la chance. Tout ce qui est écrit ici est LU dans
 * les constantes qui font tourner le jeu (`lib/trophy-road`, `lib/subject-rank`,
 * `lib/subject-unlock`, `lib/defi/matchmaking`) : le texte ne peut pas se
 * désaccorder du code, puisqu'il est le code.
 */
export default function TrophyRules({
  /** Compteur du jeu que lancera COMBAT — sert à marquer « tu es ici ». */
  currentTrophies,
  /** Le nom de ce jeu, pour nommer la bande courante. */
  currentGame,
}: {
  currentTrophies?: number
  currentGame?: string
}) {
  const here =
    currentTrophies === undefined ? null : trophyBand(currentTrophies)

  return (
    <section
      aria-labelledby="trophy-rules-title"
      className="rounded-2xl border border-white/10 bg-white/5 p-3"
    >
      <h3
        id="trophy-rules-title"
        className="font-heading mb-2 flex items-center gap-2 text-sm font-extrabold text-white"
      >
        <Info className="size-4 shrink-0 text-highlight" strokeWidth={2.6} aria-hidden="true" />
        Comment on gagne des trophées
      </h3>

      <ol className="mb-3 list-inside list-decimal space-y-1.5 text-[0.72rem] leading-snug text-white/70 marker:font-bold marker:text-highlight">
        <li>
          Chaque <strong className="font-bold text-white">jeu</strong> a son
          compteur. Le total d’une matière est la somme de ses jeux, et ton rang
          de matière n’est qu’une lecture de ce total.
        </li>
        <li>
          Le gain ne dépend <strong className="font-bold text-white">pas</strong>{' '}
          de l’adversaire, seulement de ton compteur sur ce jeu-là. Il est donc
          annoncé <em>avant</em> la partie : c’est le « +N » sur la tuile.
        </li>
        <li>
          Plus un jeu est monté, moins il rapporte. Un jeu jamais touché vaut{' '}
          <strong className="font-bold text-highlight">+{TROPHY_BANDS[0].win}</strong>{' '}
          et ne coûte rien — c’est là que se gagnent les trophées.
        </li>
      </ol>

      {/* Le barème, tel quel. Neuf lignes valent mieux qu'une phrase qui
          résumerait : l'élève doit pouvoir repérer SA ligne. */}
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full border-collapse text-[0.7rem]">
          <caption className="sr-only">
            Trophées gagnés et perdus selon le compteur du jeu, par tranche de{' '}
            {BAND_SPAN}
          </caption>
          <thead>
            <tr className="bg-white/10 text-[0.6rem] tracking-wide text-white/60 uppercase">
              <th scope="col" className="px-2 py-1 text-left font-extrabold">
                Compteur du jeu
              </th>
              <th scope="col" className="px-2 py-1 text-right font-extrabold">
                Victoire
              </th>
              <th scope="col" className="px-2 py-1 text-right font-extrabold">
                Défaite
              </th>
            </tr>
          </thead>
          <tbody>
            {TROPHY_BANDS.map((band) => {
              const isHere = here !== null && band.floor === here.floor
              return (
                <tr
                  key={band.floor}
                  className={`border-t border-white/8 ${
                    isHere ? 'bg-highlight/15 text-white' : 'text-white/65'
                  }`}
                >
                  <th
                    scope="row"
                    className="px-2 py-1 text-left font-mono font-bold tabular-nums"
                  >
                    {band.ceiling === null
                      ? `${band.floor} et +`
                      : `${band.floor} – ${band.ceiling - 1}`}
                    {isHere ? (
                      <span className="font-heading ml-1.5 rounded-full bg-highlight px-1.5 py-px text-[0.55rem] font-extrabold text-foreground">
                        {currentGame ? `toi · ${currentGame}` : 'toi'}
                      </span>
                    ) : null}
                  </th>
                  <td className="px-2 py-1 text-right font-mono font-extrabold text-highlight tabular-nums">
                    +{band.win}
                  </td>
                  <td className="px-2 py-1 text-right font-mono font-bold tabular-nums">
                    {band.loss === 0 ? '—' : `−${band.loss}`}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h4 className="font-heading mt-3 mb-1.5 text-[0.7rem] font-extrabold tracking-wide text-white/80 uppercase">
        Les conditions
      </h4>
      <ul className="space-y-1.5 text-[0.72rem] leading-snug text-white/70">
        <li>
          <strong className="font-bold text-white">Ouvrir le duel classé</strong>{' '}
          d’une matière : réussir le quiz d’un de ses chapitres à{' '}
          {Math.round(CHAPTER_COMPLETE_SCORE * 100)} % au moins une fois. Une
          matière ouverte ne se referme jamais.
        </li>
        <li>
          <strong className="font-bold text-white">L’adversaire</strong> est
          apparié sur tes trophées de cette matière (±{MATCH_RANGE} au départ),
          jamais sur un niveau général. La fourchette s’élargit s’il n’y a
          personne.
        </li>
        <li>
          <strong className="font-bold text-white">Ton rang de matière</strong> :{' '}
          {SUBJECT_DIVISION_SPAN} trophées font une division,{' '}
          {SUBJECT_DIVISIONS_PER_TIER} divisions font un palier (III → II → I).
        </li>
        <li>
          <strong className="font-bold text-white">Fin de saison</strong> :
          au-dessus de {SEASON_KEEP_FLOOR} trophées sur un jeu, tu gardes{' '}
          {SEASON_KEEP_FLOOR} plus la moitié du reste. En dessous, rien ne bouge.
        </li>
      </ul>
    </section>
  )
}
