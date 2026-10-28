'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, NotebookPen, Settings, Users } from 'lucide-react'
import AvatarRang from '@/components/AvatarRang'
import FlammeAnimee from '@/components/FlammeAnimee'
import RankBadge from '@/components/defi/RankBadge'
import { Button } from '@/components/ui/button'
import TropheeIcone from '@/components/ui/TropheeIcone'
import XpIcon from '@/components/ui/XpIcon'
import type { ArenaPeriod } from '@/lib/arena-background'
import type { AvatarAffiche } from '@/lib/avatar-affiche'
import { compteCourt } from '@/lib/compte-court'
import { ligneRang, type BarreNiveau } from '@/lib/joueur'
import type { BlasonLigue } from '@/lib/ligue-place'
import { PORTRAIT_FACE_CROP, type PortraitKey } from '@/lib/portraits'
import { divisionDepuisRomain } from '@/lib/rang-visuel'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import DecorBureau from './DecorBureau'
import s from './PageJoueur.module.css'

// -----------------------------------------------------------------------------
// LA PAGE DU JOUEUR (25/10/2026, chantier « le jeu vivant »). C'est l'écran
// qu'ouvre l'avatar du bandeau du haut — Lucas : « vois ce que tu peux faire
// pour que l'on ait un meilleur rendu lorsque l'on clique sur l'avatar en haut
// à gauche », « mettre l'icône des Paramètres dans cet espace ».
//
// REVUE LE 26/10/2026 (Lucas : « le personnage bouge de haut en bas, il ne
// semble pas vivant ; le cadre derrière est bof il faut changer le rendu ;
// enlève la possibilité de changer » ; « un fond d'écran derrière l'avatar,
// avec les informations par-dessus comme sur ce rendu d'un jeu » ; puis, le
// même soir : « il faut un autre fond d'écran ici, et le personnage derrière
// le bloc du bas » ; enfin « on revient juste à l'image fixe de plein pied, et
// le fond, on va opter pour la chambre, ambiance Studuel » — le WebP animé du
// personnage, essayé entre les deux (scripts/portrait-anime.mjs), est rangé) :
//   · LE DÉCOR : la chambre de l'élève la nuit (`DECOR_JOUEUR`,
//     public/images/joueur/chambre.webp — peinte pour cette page dans la DA de
//     la cour d'honneur, ce n'est plus la cour elle-même), en plein écran, un
//     voile sombre en bas pour que le panneau se lise ;
//   · LE HÉROS EN PIED (l'image fixe) se tient dessus, sans anneau de rang ni
//     halo, LES PIEDS DERRIÈRE LE PANNEAU (le panneau remonte sur lui jusqu'aux
//     mollets, comme la carte d'un jeu) : il VIT — respire depuis les pieds, se
//     balance, change d'appui —, des étincelles montent autour de lui ;
//   · LE PANNEAU SOMBRE en bas, la recette `carte-sombre` : le nom, la classe,
//     « Niveau 7 · Argent II » avec le blason, la barre d'XP, les quatre
//     chiffres (série, trophées, XP de la semaine, amis), deux portes (le
//     carnet, le courrier). Plus de « Changer d'avatar » : le vestiaire reste
//     dans Moi.
//   · Sans personnage en pied (personnage historique, avatar dessiné par
//     Marcel, avatar composé, image manquante) : le buste dans l'anneau de son
//     rang (components/AvatarRang), posé sur le décor, sur son socle d'ombre.
//
// REVUE LE 27/10/2026 (Lucas : « le fond d'écran est top, j'aime beaucoup, mais
// j'aimerais que l'avatar soit AU BUREAU, assis sur la chaise, en train de
// travailler, qu'on voie surtout la fenêtre avec le château ; une animation
// propre et continue de la lampe, comme la fontaine ; cohérent avec l'accueil
// qui change selon l'heure ») : pour les treize portraits libres, LE DÉCOR
// EST LA SCÈNE PEINTE DE L'ÉLÈVE À SON BUREAU, à l'heure du jour (six plages,
// `bureauDuPortrait` / `decorBureau`, components/joueur/DecorBureau : l'heure,
// le fondu, la lampe qui respire). Le personnage est DANS la peinture : plus
// de héros debout ni d'étincelles, `.scene` ne sert que d'espace pour que le
// panneau tombe sous le bureau. La chambre vide et le héros debout restent le
// repli (avatar sans scène, image manquante).
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
  /** Le portrait assis à son bureau (ses six scènes) ; null → `decor` et le héros d'avant. */
  bureau: PortraitKey | null
  /** La plage du premier rendu, à l'heure de Paris (`periodeInitiale`, lib/joueur). */
  periode: ArenaPeriod
  /** Le décor de repli derrière le héros : la chambre vide la nuit (`DECOR_JOUEUR`, lib/joueur). */
  decor: string
}

/**
 * Les étincelles qui montent autour du héros : position (en % de la scène),
 * retard et durée — des valeurs posées en ligne, l'animation elle-même est
 * littérale dans la feuille de style.
 */
const ETINCELLES: readonly { x: number; y: number; retard: number; duree: number; taille: number }[] = [
  { x: 22, y: 58, retard: 0, duree: 4.6, taille: 7 },
  { x: 74, y: 64, retard: 1.1, duree: 5.2, taille: 6 },
  { x: 30, y: 82, retard: 2.3, duree: 4.2, taille: 5 },
  { x: 80, y: 40, retard: 0.6, duree: 5.6, taille: 8 },
  { x: 16, y: 36, retard: 3.1, duree: 4.9, taille: 5 },
  { x: 66, y: 86, retard: 1.9, duree: 4.4, taille: 6 },
  { x: 50, y: 30, retard: 2.7, duree: 5.8, taille: 5 },
]

export default function PageJoueur({ data }: { data: JoueurData }) {
  const router = useRouter()
  // L'image en pied a manqué : on retombe sur le buste, sans image cassée.
  const [piedCasse, setPiedCasse] = useState(false)
  // La scène au bureau a manqué : la chambre vide et le héros d'avant.
  const [sceneCassee, setSceneCassee] = useState(false)
  const { rang } = data
  const division = rang ? divisionDepuisRomain(rang.roman) : null
  const bureau = sceneCassee ? null : data.bureau
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
    // La page est FIXE au-dessus de la barre d'onglets, avec SON décor : l'élève
    // à son bureau à l'heure du jour (ou la chambre vide), puis un voile qui
    // s'assombrit vers le bas.
    <div role="region" aria-label="Ma page de joueur" className={s.page}>
      {bureau ? (
        <DecorBureau portrait={bureau} initiale={data.periode} onErreur={() => setSceneCassee(true)} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- décor peint, servi tel quel
        <img src={data.decor} alt="" draggable={false} className={s.decor} />
      )}
      <span aria-hidden="true" className={s.voile} />

      <div className={s.colonne}>
        {/* --- Retour · Paramètres ------------------------------------------ */}
        <div className={s.barreHaut}>
          <button type="button" onClick={retour} aria-label="Retour" className={s.rond}>
            <ArrowLeft className="size-5" strokeWidth={2.6} aria-hidden="true" />
          </button>
          <Link href="/compte" aria-label="Paramètres" title="Paramètres" onClick={() => sfx.tap()} className={s.rond}>
            <Settings className="size-5" strokeWidth={2.4} aria-hidden="true" />
          </Link>
        </div>

        {/* --- Le héros, sur le décor, les pieds derrière le panneau — ou, assis
            dans la scène peinte, rien d'autre que l'espace du bureau ---------- */}
        <div className={s.scene}>
          {bureau ? null : (
            <SceneDebout
              data={data}
              heroEnPied={heroEnPied}
              onPiedCasse={() => setPiedCasse(true)}
              photo={photo}
              rang={rang}
              division={division}
            />
          )}
        </div>

        {/* --- Le panneau : identité, barre d'XP, chiffres, portes ------------ */}
        <section aria-label="Mon profil" className={cn(s.panneau, s.monte)}>
          <Panneau data={data} />
        </section>
      </div>
    </div>
  )
}

/** Le héros debout (ou le buste de repli) avec ses étincelles, sur le décor de repli. */
function SceneDebout({
  data,
  heroEnPied,
  onPiedCasse,
  photo,
  rang,
  division,
}: {
  data: JoueurData
  heroEnPied: boolean
  onPiedCasse: () => void
  photo: ReactNode
  rang: BlasonLigue | null
  division: ReturnType<typeof divisionDepuisRomain> | null
}) {
  return (
    <>
      {ETINCELLES.map((e, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={s.etincelle}
          style={{
            left: `${e.x}%`,
            top: `${e.y}%`,
            width: e.taille,
            height: e.taille,
            animationDelay: `${e.retard}s`,
            animationDuration: `${e.duree}s`,
          }}
        />
      ))}
      {heroEnPied ? (
        // eslint-disable-next-line @next/next/no-img-element -- personnage détouré servi tel quel
        <img
          src={data.pied ?? undefined}
          alt={`${data.nom}, en pied`}
          width={200}
          height={600}
          draggable={false}
          className={s.heros}
          onError={onPiedCasse}
        />
      ) : (
        <>
          <span aria-hidden="true" className={s.socle} />
          <div className={s.busteFlotte}>
            <AvatarRang className="w-full" photo={photo} rang={rang ? { id: rang.tier.id, division } : null} />
          </div>
        </>
      )}
    </>
  )
}

/** Le contenu du panneau sombre : la classe, le nom, le rang, la barre d'XP, les chiffres, les portes. */
function Panneau({ data }: { data: JoueurData }) {
  const { barre, rang } = data
  return (
    <>
      {data.classe ? <span className={s.classe}>{data.classe}</span> : null}
      <h1 className={s.nom}>{data.nom}</h1>
      <div className={s.rangLigne}>
        {rang ? <RankBadge rank={rang} size={30} hideDivision /> : null}
        <span>{ligneRang(barre.level, rang?.label ?? null)}</span>
      </div>
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

      <ul className={s.rangee} aria-label="Mes chiffres">
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

      <div className={s.actions}>
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
    </>
  )
}

/** Une tuile-chiffre sur le panneau sombre : l'icône, le nombre en Baloo 2, le libellé. « — » si inconnu. */
function Tuile({ icone, valeur, libelle, titre }: { icone: ReactNode; valeur: number | null; libelle: string; titre: string }) {
  return (
    <li className={s.tuile} aria-label={`${titre} : ${valeur === null ? 'inconnu' : valeur}`}>
      <span className={s.tuileIcone}>{icone}</span>
      <span className={s.tuileValeur}>{valeur === null ? '—' : compteCourt(valeur)}</span>
      <span className={s.tuileLibelle}>{libelle}</span>
    </li>
  )
}
