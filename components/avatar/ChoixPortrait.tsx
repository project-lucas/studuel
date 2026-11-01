'use client'

import { useId, useState } from 'react'
import { Check, Mars, Venus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTablist } from '@/components/useTablist'
import { OptionGroup } from '@/components/welcome/OnbBits'
import { herosEleve, herosParGenre, herosSceneSrc, herosVisageSrc, isHerosKey, type HerosKey } from '@/lib/heros/eleves'
import {
  PORTRAITS_PAR_GENRE,
  genreDuPortrait,
  isPortraitClassique,
  portraitPiedSrc,
  portraitSrc,
  type GenrePortrait,
  type PortraitKey,
} from '@/lib/portraits'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import s from './ChoixPortrait.module.css'

// -----------------------------------------------------------------------------
// LE CHOIX DU PORTRAIT (25/10/2026, chantier « le jeu vivant » — Lucas : « un
// gabarit de choix d'avatar propre, clair, masculin d'un côté / féminin de
// l'autre »). UN composant, partagé par l'écran « Ton avatar » de l'onboarding
// et l'onglet Portrait du vestiaire :
//
//   · en haut, le GRAND aperçu du portrait choisi — le personnage EN PIED
//     (lib/portraits : portraitPiedSrc), sur son socle d'ombre, devant le mur
//     crème quadrillé de l'app (`.tab-bg`) ; il entre d'un petit bond à chaque
//     changement ;
//   · au milieu, deux onglets « Garçons » / « Filles » (♂ ♀) — la répartition
//     est dans lib/portraits (PORTRAITS_GARCONS / PORTRAITS_FILLES) ;
//   · dessous, la grille des bustes sur quatre colonnes, le choisi cerné de
//     violet avec sa coche, les autres en plaque blanche ;
//   · en bas, « Confirmer » — SEULEMENT si l'appelant passe `onConfirmer` :
//     l'onboarding garde son bouton de pied (« C'est moi », WelcomeFlow), le
//     vestiaire enregistre au « Confirmer ».
//
// LES HÉROS AU VESTIAIRE (01/11/2026, Lucas : « on doit voir maintenant les
// nouveaux perso ») : dans chaque onglet, les HÉROS d'abord (leur visage ; à
// l'aperçu, leur scène, leur surnom et leur caractère), puis les anciens
// blasons. Un compte d'avant les héros peut ainsi en prendre un.
//
// Le composant ne sait rien du compte : il reçoit le choix et le rend. Un seul
// geste de confirmation, pas de texte sous les vignettes (« un visage se
// reconnaît, il ne se lit pas »).
// -----------------------------------------------------------------------------

const ONGLETS: readonly { id: GenrePortrait; label: string; Icone: typeof Mars }[] = [
  { id: 'garcons', label: 'Garçons', Icone: Mars },
  { id: 'filles', label: 'Filles', Icone: Venus },
]

export default function ChoixPortrait({
  choisi: choisiBrut,
  onChoisir,
  onConfirmer,
  libelleConfirmer = 'Confirmer',
  enCours = false,
  className,
}: {
  /** Le portrait retenu (ou null : rien encore). */
  choisi: PortraitKey | null
  onChoisir: (key: PortraitKey) => void
  /** Rend le bouton « Confirmer » ; absent, l'écran parent porte le sien. */
  onConfirmer?: () => void
  libelleConfirmer?: string
  /** L'enregistrement est en route : le bouton attend. */
  enCours?: boolean
  className?: string
}) {
  const id = useId()
  const choisi = isPortraitClassique(choisiBrut) || isHerosKey(choisiBrut) ? choisiBrut : null
  const herosChoisi = isHerosKey(choisi) ? herosEleve(choisi) : null
  // L'onglet ouvert : celui du portrait déjà choisi, puis au doigt.
  const [genre, setGenre] = useState<GenrePortrait>(() =>
    herosChoisi ? herosChoisi.genre : genreDuPortrait(isPortraitClassique(choisi) ? choisi : null),
  )
  const tabs = useTablist(ONGLETS.length, (i) => setGenre(ONGLETS[i].id))
  const liste = PORTRAITS_PAR_GENRE[genre]
  const heros = herosParGenre(genre)
  const nomGenre = genre === 'garcons' ? 'Garçon' : 'Fille'

  return (
    <div className={className}>
      {/* --- L'aperçu : le personnage en pied sur le mur crème ------------- */}
      <div className={cn('tab-bg', s.scene)} aria-live="polite">
        <span aria-hidden="true" className={s.halo} />
        <span aria-hidden="true" className={s.socle} />
        {herosChoisi ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- scène peinte servie telle quelle */}
            <img key={herosChoisi.cle} src={herosSceneSrc(herosChoisi.cle as HerosKey)} alt="" draggable={false} className={s.sceneHeros} />
            <span aria-hidden="true" className={s.voileHeros} />
            <span className={s.plaqueHeros}>
              <span className={s.peupleHeros}>{herosChoisi.peuple}</span>
              <span className={cn('font-heading font-extrabold', s.nomHeros)}>{herosChoisi.titre}</span>
              <span className={s.traitsHeros}>
                {herosChoisi.qualites.join(' · ')} · <em>{herosChoisi.travers.toLowerCase()}</em>
              </span>
            </span>
          </>
        ) : choisi && isPortraitClassique(choisi) ? (
          // eslint-disable-next-line @next/next/no-img-element -- personnage détouré servi tel quel
          <img
            key={choisi}
            src={portraitPiedSrc(choisi)}
            alt={`Ton personnage : ${nomGenre.toLowerCase()} ${liste.indexOf(choisi) + 1}`}
            width={200}
            height={600}
            draggable={false}
            className={s.heros}
          />
        ) : (
          <span role="img" aria-label="Aucun personnage choisi" className={s.vide}>
            ?
          </span>
        )}
        {herosChoisi ? null : (
          <span aria-hidden="true" className={s.etiquette}>
            {choisi ? 'Ton personnage' : 'Choisis ton personnage'}
          </span>
        )}
      </div>

      {/* --- Garçons / Filles --------------------------------------------- */}
      <div role="tablist" aria-label="Garçons ou filles" className={s.onglets}>
        {ONGLETS.map((o, i) => {
          const actif = o.id === genre
          return (
            <button
              key={o.id}
              type="button"
              role="tab"
              id={`${id}-onglet-${o.id}`}
              aria-selected={actif}
              aria-controls={`${id}-grille`}
              {...tabs.props(i, actif)}
              onClick={() => {
                if (actif) return
                sfx.tap()
                setGenre(o.id)
              }}
              className={cn(s.onglet, actif && s.ongletActif)}
            >
              <o.Icone className="size-5" strokeWidth={2.6} aria-hidden="true" />
              {o.label}
            </button>
          )
        })}
      </div>

      {/* --- La grille des bustes ----------------------------------------- */}
      <div id={`${id}-grille`} role="tabpanel" aria-labelledby={`${id}-onglet-${genre}`}>
        {/* `key={genre}` : la grille se remonte à chaque onglet, et rejoue
            son entrée. OptionGroup porte le `radiogroup` et les flèches. */}
        <div key={genre} className={s.grille}>
          <p className={cn('titre-section', s.rubrique)}>Héros</p>
          <OptionGroup label={`Héros ${genre === 'garcons' ? 'garçons' : 'filles'}`} className="grid grid-cols-4 gap-3 px-1 pt-1">
            {heros.map((h) => {
              const selected = h.cle === choisi
              return (
                <button
                  key={h.cle}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`${h.titre}, ${h.peuple.toLowerCase()}`}
                  onClick={() => {
                    if (selected) return
                    sfx.tap()
                    onChoisir(h.cle as HerosKey)
                  }}
                  className={cn(s.case, selected && s.caseChoisie)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- visage recadré servi tel quel */}
                  <img src={herosVisageSrc(h.cle as HerosKey)} alt="" width={384} height={384} loading="lazy" draggable={false} />
                  {selected ? (
                    <span aria-hidden="true" className={s.coche}>
                      <Check className="size-3.5" strokeWidth={3.5} />
                    </span>
                  ) : null}
                </button>
              )
            })}
          </OptionGroup>
          <p className={cn('titre-section', s.rubrique)}>Blasons</p>
          <OptionGroup label={`Blasons de ${genre === 'garcons' ? 'garçons' : 'filles'}`} className="grid grid-cols-4 gap-3 px-1 pt-1">
            {liste.map((p, i) => {
              const selected = p === choisi
              return (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`${nomGenre} ${i + 1}`}
                  onClick={() => {
                    if (selected) return
                    sfx.tap()
                    onChoisir(p)
                  }}
                  className={cn(s.case, selected && s.caseChoisie)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- buste servi tel quel */}
                  <img src={portraitSrc(p)} alt="" width={384} height={384} loading="lazy" draggable={false} />
                  {selected ? (
                    <span aria-hidden="true" className={s.coche}>
                      <Check className="size-3.5" strokeWidth={3.5} />
                    </span>
                  ) : null}
                </button>
              )
            })}
          </OptionGroup>
        </div>
      </div>

      {/* --- Confirmer ------------------------------------------------------ */}
      {onConfirmer ? (
        <Button
          type="button"
          size="xl"
          className="mt-5 w-full"
          disabled={!choisi || enCours}
          onClick={onConfirmer}
        >
          {enCours ? 'Un instant…' : libelleConfirmer}
        </Button>
      ) : null}
    </div>
  )
}
