'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, NotebookPen, Settings, Shirt, Users } from 'lucide-react'
import AvatarRang from '@/components/AvatarRang'
import FlammeAnimee from '@/components/FlammeAnimee'
import RankBadge from '@/components/defi/RankBadge'
import { Button } from '@/components/ui/button'
import TropheeIcone from '@/components/ui/TropheeIcone'
import XpIcon from '@/components/ui/XpIcon'
import type { AvatarAffiche } from '@/lib/avatar-affiche'
import { compteCourt } from '@/lib/compte-court'
import { ligneRang, type BarreNiveau } from '@/lib/joueur'
import type { BlasonLigue } from '@/lib/ligue-place'
import { PORTRAIT_FACE_CROP } from '@/lib/portraits'
import { cadreDeRang, divisionDepuisRomain } from '@/lib/rang-visuel'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import s from './PageJoueur.module.css'

// -----------------------------------------------------------------------------
// LA PAGE DU JOUEUR (25/10/2026, chantier « le jeu vivant »). C'est l'écran
// qu'ouvre l'avatar du bandeau du haut — Lucas : « vois ce que tu peux faire
// pour que l'on ait un meilleur rendu lorsque l'on clique sur l'avatar en haut
// à gauche », « mettre l'icône des Paramètres dans cet espace ».
//
// Plein écran, sur le mur crème de l'app : en haut le retour et les Paramètres
// (→ /compte) ; au centre LE HÉROS EN PIED (lib/portraits : portraitPiedSrc),
// qui flotte dans un halo violet devant l'anneau de son rang de ligue, sur son
// socle d'ombre — ou, sans personnage en pied (personnage historique, avatar
// dessiné par Marcel, avatar composé, image manquante), le buste dans l'anneau
// (components/AvatarRang) ; puis le nom en Baloo 2, « Niveau 7 · Argent II »
// avec le blason de la division, la barre d'XP jusqu'au niveau suivant ;
// quatre chiffres en cartes (série, trophées, XP de la semaine, amis) ; trois
// portes : le vestiaire, le carnet, le courrier.
//
// Les données viennent du serveur (app/joueur/page.tsx, une seule vague) ; ce
// composant ne fait que dessiner. Le bandeau est masqué ici
// (lib/top-hud-routes) : la page le redit en grand.
// -----------------------------------------------------------------------------

export type JoueurData = {
  /** Le pseudo de jeu, ou le prénom. */
  nom: string
  /** « 3e », ou null. */
  classe: string | null
  /** Le personnage en pied ; null → le buste dans l'anneau. */
  pied: string | null
  /** Le buste, déjà résolu côté serveur (lib/avatar-affiche). */
  buste: AvatarAffiche
  /** Le rang de ligue ; null → un anneau blanc. */
  rang: BlasonLigue | null
  barre: BarreNiveau
  /** Jours d'affilée. */
  serie: number
  trophees: number
  /** XP gagnée depuis lundi ; null si inconnue (la tuile écrit « — »). */
  xpSemaine: number | null
  /** Amis acceptés ; null si inconnu. */
  nbAmis: number | null
}

export default function PageJoueur({ data }: { data: JoueurData }) {
  const router = useRouter()
  // L'image en pied a manqué : on retombe sur le buste, sans image cassée.
  const [piedCasse, setPiedCasse] = useState(false)
  const { barre, rang } = data
  const division = rang ? divisionDepuisRomain(rang.roman) : null
  const heroEnPied = data.pied !== null && !piedCasse

  // Retour : d'où l'on vient (n'importe quel onglet, par le bandeau) ; sans
  // historique (adresse tapée), Réviser.
  const retour = () => {
    sfx.back()
    if (window.history.length > 1) router.back()
    else router.push('/reviser')
  }

  const photo = data.buste.visage ? (
    // eslint-disable-next-line @next/next/no-img-element -- portrait servi tel quel, cadré sur le visage
    <img src={data.buste.src} alt="" draggable={false} className="absolute max-w-none object-contain" style={PORTRAIT_FACE_CROP} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element -- avatar composé (data-URI) ou dessiné
    <img src={data.buste.src} alt="" draggable={false} />
  )

  return (
    // `tab-bg` : la page est FIXE au-dessus de la barre d'onglets ; sans fond
    // propre, la barre transparaîtrait au bas de l'écran. Le même mur crème
    // quadrillé que le layout, repeint ici, opaque.
    <div role="region" aria-label="Ma page de joueur" className={cn('tab-bg', s.page)}>
      {/* --- Retour · Paramètres ------------------------------------------ */}
      <div className={s.barreHaut}>
        <button type="button" onClick={retour} aria-label="Retour" className={s.rond}>
          <ArrowLeft className="size-5" strokeWidth={2.6} aria-hidden="true" />
        </button>
        <Link href="/compte" aria-label="Paramètres" title="Paramètres" onClick={() => sfx.tap()} className={s.rond}>
          <Settings className="size-5" strokeWidth={2.4} aria-hidden="true" />
        </Link>
      </div>

      {/* --- Le héros ------------------------------------------------------ */}
      <div className={s.scene}>
        <span aria-hidden="true" className={s.halo} />
        {heroEnPied && rang ? (
          // eslint-disable-next-line @next/next/no-img-element -- anneau de rang servi tel quel (192 px)
          <img src={cadreDeRang(rang.tier.id, division)} alt="" draggable={false} className={s.anneau} />
        ) : null}
        <span aria-hidden="true" className={s.socle} />
        {heroEnPied ? (
          // eslint-disable-next-line @next/next/no-img-element -- personnage détouré servi tel quel
          <img
            src={data.pied ?? undefined}
            alt={`${data.nom}, en pied`}
            width={200}
            height={600}
            draggable={false}
            className={s.heros}
            onError={() => setPiedCasse(true)}
          />
        ) : (
          <div className={s.busteFlotte}>
            <AvatarRang className="w-full" photo={photo} rang={rang ? { id: rang.tier.id, division } : null} />
          </div>
        )}
      </div>

      {/* --- Nom, rang, barre d'XP ----------------------------------------- */}
      <div className={cn(s.identite, s.monte)}>
        {data.classe ? <span className={s.classe}>{data.classe}</span> : null}
        <h1 className={s.nom}>{data.nom}</h1>
        <p className={s.rangLigne}>
          {rang ? <RankBadge rank={rang} size={30} hideDivision /> : null}
          <span>{ligneRang(barre.level, rang?.label ?? null)}</span>
        </p>
        <div
          className={s.barre}
          role="progressbar"
          aria-label={`Progression vers le niveau ${barre.level + 1}`}
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
          Encore {barre.reste.toLocaleString('fr-FR')} XP pour le niveau {barre.level + 1}
        </p>
      </div>

      {/* --- Les quatre chiffres -------------------------------------------- */}
      <ul className={cn(s.rangee, s.monte)} aria-label="Mes chiffres">
        <Tuile
          icone={<FlammeAnimee serie={data.serie} eteinte={data.serie === 0} className="size-8" />}
          valeur={data.serie}
          libelle={data.serie === 1 ? 'jour' : 'jours'}
          titre="Série"
        />
        <Tuile icone={<TropheeIcone className="size-8" />} valeur={data.trophees} libelle="trophées" titre="Trophées" />
        <Tuile icone={<XpIcon className="size-7" />} valeur={data.xpSemaine} libelle="XP · sem." titre="XP de la semaine" />
        <Tuile
          icone={
            <span className={s.amisIcone}>
              <Users className="size-4" strokeWidth={2.6} aria-hidden="true" />
            </span>
          }
          valeur={data.nbAmis}
          libelle={data.nbAmis === 1 ? 'ami' : 'amis'}
          titre="Amis"
        />
      </ul>

      {/* --- Les portes ------------------------------------------------------ */}
      <div className={cn(s.actions, s.monte)}>
        <Button asChild size="xl" className="w-full">
          <Link href="/moi/avatar">
            <Shirt aria-hidden="true" />
            Changer d’avatar
          </Link>
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button asChild variant="secondary" size="lg">
            <Link href="/moi">
              <NotebookPen aria-hidden="true" />
              Mon carnet
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/courrier">
              <Mail aria-hidden="true" />
              Courrier
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

/** Une carte-chiffre : l'icône, le nombre en Baloo 2, le libellé. « — » si inconnu. */
function Tuile({ icone, valeur, libelle, titre }: { icone: ReactNode; valeur: number | null; libelle: string; titre: string }) {
  return (
    <li className={cn('carte', s.tuile)} aria-label={`${titre} : ${valeur === null ? 'inconnu' : valeur}`}>
      <span className={s.tuileIcone}>{icone}</span>
      <span className={s.tuileValeur}>{valeur === null ? '—' : compteCourt(valeur)}</span>
      <span className={s.tuileLibelle}>{libelle}</span>
    </li>
  )
}
