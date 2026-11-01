'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Mail, NotebookPen, Users } from 'lucide-react'
import FlammeAnimee from '@/components/FlammeAnimee'
import TropheeIcone from '@/components/ui/TropheeIcone'
import XpIcon from '@/components/ui/XpIcon'
import { compteCourt } from '@/lib/compte-court'
import { FEUILLE_BUREAU, ligneRang, tailleNom, type TailleNom } from '@/lib/joueur'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import type { JoueurData } from './PageJoueur'
import s from './FicheBureau.module.css'

// -----------------------------------------------------------------------------
// LA FEUILLE PUNAISÉE SUR LA FAÇADE DU BUREAU (28/10/2026). Lucas, devant la
// scène du bureau : « incorporer proprement les infos sur la façade du bureau,
// sur la partie en bois » ; les plaques en CSS ne l'ont pas convaincu, ni la
// façade repeinte ; il a choisi, parmi quatre objets peints à part, le
// parchemin aux sceaux, puis l'a voulu « plus Studuel, pas trop détaillé, et
// qu'on ait vraiment l'impression que c'est collé ou accroché à la façade » —
// la feuille punaisée aux quatre coins (`FEUILLE_BUREAU`, lib/joueur).
//
// LE PRINCIPE : la peinture fournit les EMPLACEMENTS VIDES — le ruban, le
// médaillon, la jauge, quatre cases, deux sceaux — et l'écran n'y écrit que
// les mots, les nombres et les icônes de l'app (la flamme, le trophée,
// l'éclair, le blason de rang : la règle « une seule illustration »). Rien de
// dessiné en CSS, pas de cadre ni de plaque : ce qui se lit comme un objet est
// peint, ce qui change est écrit.
//
// Ce qu'elle porte, dans l'ordre de lecture : le nom et la classe sur le
// ruban ; le blason de ligue dans le médaillon (le niveau en or sans rang) ;
// « Niveau 7 · Argent II », la jauge d'XP dans le niveau avec ses nombres, ce
// qu'il reste ; les quatre chiffres (série, trophées, XP de la semaine, amis) ;
// les deux portes (le carnet, le courrier) sur les sceaux — leur cible tactile
// est le sceau, son ruban et son libellé (≥ 44 px).
//
// Posée en % de la peinture du bureau (le calque a la géométrie de la scène,
// comme DecorBureau), elle tient sur les 78 scènes, à toute heure, sur tout
// écran ; dedans, tout est en % de la feuille et en `cqw` (FicheBureau.module.css).
// Sans scène au bureau (avatar sans portrait libre, image manquante), la page
// garde son panneau sombre d'avant : la feuille n'a de sens que sur le meuble.
// -----------------------------------------------------------------------------

const CLASSE_NOM: Record<TailleNom, string> = { grand: s.nomGrand, moyen: s.nomMoyen, petit: s.nomPetit }

export default function FicheBureau({ data }: { data: JoueurData }) {
  const { barre, rang } = data
  // Le blason a manqué : le niveau en or, jamais d'image cassée.
  const [blasonCasse, setBlasonCasse] = useState(false)
  const niveauSuivant = barre.level + 1

  return (
    <section aria-label="Mon profil" className={s.calque}>
      <div className={cn(s.feuille, s.pose)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- la feuille peinte, servie telle quelle */}
        <img src={FEUILLE_BUREAU} alt="" width={1500} height={1008} draggable={false} className={s.papier} />

        {/* --- le ruban : le nom, la classe --------------------------------- */}
        <h1 className={cn(s.nom, CLASSE_NOM[tailleNom(data.nom)])}>
          <span className={s.nomTexte}>{data.nom}</span>
          {data.classe ? <span className={s.classe}>{data.classe}</span> : null}
        </h1>

        {/* --- le médaillon : le blason du rang ------------------------------ */}
        <div aria-hidden="true" className={s.medaillon}>
          {rang && !blasonCasse ? (
            // eslint-disable-next-line @next/next/no-img-element -- blason de rang, servi tel quel
            <img src={rang.tier.image} alt="" draggable={false} className={s.blason} onError={() => setBlasonCasse(true)} />
          ) : (
            <span className={s.niveauSeul}>{barre.level}</span>
          )}
        </div>

        {/* --- le rang, la jauge, le reste ----------------------------------- */}
        <p className={s.rang}>{ligneRang(barre.level, rang?.label ?? null)}</p>
        <div
          className={s.jauge}
          role="progressbar"
          aria-label={`Progression vers le niveau ${niveauSuivant}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={barre.pct}
        >
          <span className={s.remplissage} style={{ width: `${barre.pct}%` }} />
          <span aria-hidden="true" className={s.chiffres}>
            {barre.fait.toLocaleString('fr-FR')} / {barre.pas.toLocaleString('fr-FR')} XP
          </span>
        </div>
        <p className={s.reste}>
          Encore {barre.reste.toLocaleString('fr-FR')} XP pour le niveau {niveauSuivant}
        </p>

        {/* --- les quatre cases ---------------------------------------------- */}
        <ul className={s.cases} aria-label="Mes chiffres">
          <Case
            icone={<FlammeAnimee serie={data.serie} eteinte={data.serie === 0} className={s.ico} />}
            valeur={data.serie}
            libelle={data.serie === 1 ? 'jour' : 'jours'}
            titre="Série"
          />
          <Case icone={<TropheeIcone className={s.ico} />} valeur={data.trophees} libelle="trophées" titre="Trophées" />
          <Case icone={<XpIcon className={s.ico} />} valeur={data.xpSemaine} libelle="XP · sem." titre="XP de la semaine" />
          <Case
            icone={
              <span className={s.amisIcone}>
                <Users strokeWidth={2.8} aria-hidden="true" />
              </span>
            }
            valeur={data.nbAmis}
            libelle={data.nbAmis === 1 ? 'ami' : 'amis'}
            titre="Amis"
          />
        </ul>

        {/* --- les deux sceaux : les portes ---------------------------------- */}
        <Porte href="/moi" libelle="Mon carnet" icone={<NotebookPen aria-hidden="true" />} className={s.porteCarnet} />
        <Porte href="/courrier" libelle="Courrier" icone={<Mail aria-hidden="true" />} className={s.porteCourrier} />
      </div>
    </section>
  )
}

/** Une case de la feuille : l'icône, le nombre en Baloo 2, le libellé. « — » si inconnu. */
function Case({ icone, valeur, libelle, titre }: { icone: ReactNode; valeur: number | null; libelle: string; titre: string }) {
  return (
    <li className={s.case} aria-label={`${titre} : ${valeur === null ? 'inconnu' : valeur}`}>
      <span className={s.caseIcone}>{icone}</span>
      <span className={s.caseValeur}>{valeur === null ? '—' : compteCourt(valeur)}</span>
      <span className={s.caseLibelle}>{libelle}</span>
    </li>
  )
}

/** Une porte sur un sceau : l'icône en crème sur le sceau peint, le libellé sous ses rubans. */
function Porte({ href, libelle, icone, className }: { href: string; libelle: string; icone: ReactNode; className: string }) {
  return (
    <Link href={href} onClick={() => sfx.tap()} className={cn(s.porte, className)}>
      <span className={s.sceau}>{icone}</span>
      <span className={s.porteLibelle}>{libelle}</span>
    </Link>
  )
}
