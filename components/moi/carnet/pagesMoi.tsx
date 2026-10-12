import Link from 'next/link'
import PortraitJoueur from '@/components/amis/PortraitJoueur'
import ClassementAmis from '@/components/moi/ClassementAmis'
import CouronneArt from '@/components/moi/CouronneArt'
import Palmares from '@/components/moi/Palmares'
import RythmeBarres from '@/components/moi/RythmeBarres'
import Vitrine from '@/components/moi/Vitrine'
import type { DoublePage } from '@/components/moi/carnet/Carnet'
import { Doodle, Eclats, Filet, Souligne, type NomDoodle } from '@/components/moi/carnet/Croquis'
import BadgesCarnet from '@/components/moi/carnet/BadgesCarnet'
import Ouvrir from '@/components/moi/carnet/Ouvrir'
import PageIdentite, { type IdentiteMoi } from '@/components/moi/carnet/PageIdentite'
import type { EcranMoiProps } from '@/components/moi/EcranMoi'
import { challengerDe } from '@/lib/moi/classement-amis'
import { courseDeLaSemaine, libelleEpreuve, type Course, type LigneCourse } from '@/lib/moi/course-amis'
import { libellesRecord } from '@/lib/moi/record'
import { libelleTop, topPourcent } from '@/lib/defi/classement-arene'
import { formatDuree } from '@/lib/moi/temps'
import { etatVitrine, libelleBanniere } from '@/lib/moi/vitrine'
import { epreuve, formatScore } from '@/lib/palmares/epreuves'
import styles from '@/components/moi/carnet/Pages.module.css'

// -----------------------------------------------------------------------------
// LES PAGES DU CARNET DE MOI (04/10/2026, réordonnées le 05/10/2026 : Progrès a
// cédé sa place au Palmarès, la semaine de travail tient sur la page de garde,
// les amis se mesurent en COURSE) — quatre doubles pages, chacune répond
// à UNE question que l'élève se pose en ouvrant son profil :
//
//   · LA PAGE DE GARDE — « Qui je suis » : la photo, le nom, la classe et le
//     rang ; en face, les quatre chiffres qui me résument (série, trophées,
//     niveau, travail de la semaine). C'est la page qu'on montre à un ami.
//   · PROGRÈS — « Est-ce que j'avance ? » : le record de la semaine à battre
//     et ses sept jours ; en face, ma place dans mon niveau, ma moyenne, le
//     travail depuis le début (et la trajectoire bac quand il y a des notes).
//     C'est la page qui donne envie de faire UNE séance de plus aujourd'hui.
//   · AMIS — « Où j'en suis face aux autres ? » : mes amis classés au travail
//     de la semaine à gauche, aux trophées à droite — la couronne au premier,
//     les épées au challenger, et l'écart à combler écrit en toutes lettres.
//     C'est la page de l'émulation (et le chemin vers « Ajouter un ami »).
//   · COLLECTION — « Qu'est-ce que j'ai gagné ? » : les couronnes de mes
//     matières (le programme maîtrisé) et mes badges collés comme des
//     autocollants, avec le métal de ma bannière. La page de la fierté, et
//     celle qui montre les cases encore vides.
//   · PALMARÈS — « Mes exploits » : mes duels (victoires, record de trophées)
//     et mes meilleurs scores dans les modes et les jeux. La page compétition.
//
// Chaque page montre l'essentiel ; au toucher, le bloc complet d'avant s'ouvre
// dans une feuille (`Ouvrir`) : rien de l'ancien tableau de bord n'est perdu.
// -----------------------------------------------------------------------------

const nombre = (n: number) => Math.round(n).toLocaleString('fr-FR').replace(/ /g, ' ')
const pluriel = (n: number, mot: string) => `${nombre(n)} ${mot}${n > 1 ? 's' : ''}`

/** Le titre d'une page, écrit à la main et souligné, avec la pastille de son intercalaire. */
function TitrePage({ children, teinte, doodle }: { children: string; teinte?: string; doodle?: NomDoodle }) {
  return (
    <div className={styles.titrePage}>
      {teinte ? <span aria-hidden="true" className={styles.pastille} data-teinte={teinte} /> : null}
      <h2 className={styles.titre}>{children}</h2>
      {doodle ? <Doodle nom={doodle} className={styles.titreDoodle} /> : null}
      <Souligne className={styles.titreSouligne} />
    </div>
  )
}

function Folio({ n }: { n: number }) {
  return (
    <span aria-hidden="true" className={styles.folio}>
      — {n} —
    </span>
  )
}

export function pagesDuCarnet(p: EcranMoiProps & { identite: NonNullable<EcranMoiProps['identite']> }): DoublePage[] {
  return [
    { gauche: <GardeGauche data={p.identite.data} abonne={p.identite.abonne} />, droite: <GardeDroite {...p} /> },
    { gauche: <PalmaresGauche {...p} />, droite: <PalmaresDroite {...p} /> },
    { gauche: <CourseGauche {...p} />, droite: <CourseDroite {...p} /> },
    { gauche: <CollectionGauche {...p} />, droite: <CollectionDroite {...p} /> },
  ]
}

// --- La page de garde ----------------------------------------------------------

function GardeGauche({ data, abonne }: { data: IdentiteMoi; abonne: boolean }) {
  return (
    <>
      <PageIdentite data={data} abonne={abonne} />
      <Folio n={1} />
    </>
  )
}

function GardeDroite({ serie, trophees, identite, record, rythme, travail }: EcranMoiProps & { identite: NonNullable<EcranMoiProps['identite']> }) {
  const mots = libellesRecord(record)
  // Le record de la semaine, AU-DESSUS du travail de cette semaine (Lucas,
  // 05/10/2026 : « oublie le cercle, précise simplement le temps de travail de
  // cette semaine, avec au-dessus son record de la semaine »). Battu, le record
  // EST cette semaine.
  const recordAffiche = record.etat === 'battu' || record.etat === 'premier' ? mots.valeur : mots.cible
  const semaine = (
    <>
      <span className={styles.etiquette}>Record de la semaine</span>
      <span className={styles.recordSemaine} data-battu={record.etat === 'battu' || undefined}>
        {recordAffiche}
      </span>
      <span className={styles.etiquette}>Cette semaine</span>
      <span className={styles.chiffre}>{mots.valeur}</span>
      {record.etat !== 'vide' ? (
        <span className={record.etat === 'battu' ? styles.noteOr : styles.petit}>{mots.pastille}</span>
      ) : null}
    </>
  )
  return (
    <div className={styles.chiffres}>
      <div className={styles.chiffreLigne} role="group" aria-label={`Série : ${pluriel(serie.jours, 'jour')}`}>
        <Doodle nom="flamme" className={styles.chiffreDoodle} />
        <span className={styles.chiffreTexte}>
          <span className={styles.chiffre}>{serie.jours}&nbsp;j</span>
          <span className={styles.legende}>Série</span>
        </span>
      </div>
      <Filet className={styles.filet} />
      <div className={styles.chiffreLigne} role="group" aria-label={pluriel(trophees.total, 'trophée')}>
        <Doodle nom="trophee" className={styles.chiffreDoodle} />
        <span className={styles.chiffreTexte}>
          <span className={styles.chiffre}>{nombre(trophees.total)}</span>
          <span className={styles.legende}>Trophées</span>
        </span>
      </div>
      <Filet className={styles.filet} />
      <div className={styles.niveau} role="group" aria-label={`Niveau ${identite.data.level}`}>
        <Eclats className={styles.eclatsNiveau} />
        <span className={styles.bouclier}>
          <Doodle nom="bouclier" className={styles.bouclierDoodle} />
          <span className={styles.bouclierTexte}>
            <span className={styles.bouclierNiv}>Niv.</span>
            <span className={styles.bouclierChiffre}>{identite.data.level}</span>
          </span>
        </span>
        <Eclats className={styles.eclatsNiveau} sens="droite" />
      </div>
      <Filet className={styles.filet} />
      {rythme ? (
        <Ouvrir
          label={`${mots.valeur} de travail cette semaine. Record de la semaine : ${recordAffiche}. Voir mon rythme.`}
          titre="Ton rythme"
          className={styles.semaineTexte}
          detail={
            <>
              <RythmeBarres semaines={rythme.semaines} phrase={rythme.phrase} nu />
              <p className="text-center text-sm font-bold text-muted-foreground">
                <span className="text-foreground">{formatDuree(travail.total)}</span> de travail depuis le début ·{' '}
                {travail.titre}
              </p>
            </>
          }
        >
          {semaine}
        </Ouvrir>
      ) : (
        <div className={styles.semaineTexte}>{semaine}</div>
      )}
      <Folio n={2} />
    </div>
  )
}

// --- La course entre amis ------------------------------------------------------

/** Les lignes à montrer : les premiers, et moi toujours. */
function lignesVisibles(lignes: readonly LigneCourse[], max: number): LigneCourse[] {
  if (lignes.length <= max) return [...lignes]
  const tete = lignes.slice(0, max)
  if (tete.some((j) => j.moi)) return tete
  const moi = lignes.find((j) => j.moi)
  return moi ? [...lignes.slice(0, max - 1), moi] : tete
}

/** Une épreuve de la course : qui mène, ma place, et l'écart à combler. */
function Epreuve({ course, monAvatar }: { course: Course; monAvatar: EcranMoiProps['amis']['monAvatar'] }) {
  const { tete, moi } = course
  return (
    <div className={styles.epreuve}>
      <span className={styles.epreuveTitre}>{course.titre}</span>
      <div className={styles.epreuveLigne}>
        {tete ? (
          <>
            <Doodle nom="couronne" className={styles.epreuveCouronne} />
            <span className={styles.amiPortrait}>
              <PortraitJoueur id={tete.id} portrait={tete.portrait} avatar={tete.moi ? monAvatar : null} className="size-full" />
            </span>
            <span className={styles.amiNom}>{tete.moi ? 'Toi' : tete.nom}</span>
            <span className={styles.amiValeur}>{libelleEpreuve(course.epreuve, tete.valeur)}</span>
          </>
        ) : (
          <span className={styles.petit}>Personne n’a encore marqué</span>
        )}
      </div>
      {moi && moi.rang > 1 ? (
        <span className={styles.epreuveMoi}>
          Toi : {moi.rang}e · {libelleEpreuve(course.epreuve, moi.valeur)}
        </span>
      ) : null}
      {course.phrase ? <span className={styles.epreuvePhrase}>{course.phrase}</span> : null}
    </div>
  )
}

function CourseGauche({ amis }: EcranMoiProps) {
  const courses = courseDeLaSemaine(amis.joueurs)
  if (courses.length === 0) {
    return (
      <>
        <div className={styles.pagePleine}>
          <TitrePage teinte="rose">Mes amis</TitrePage>
          <Doodle nom="amis" className={styles.grandDoodle} />
          <p className={styles.note}>Ton carnet d’amis est encore vide.</p>
          <p className={styles.petitCentre}>Chaque ami ajouté monte ton multiplicateur d’XP de +0,1.</p>
        </div>
        <Folio n={5} />
      </>
    )
  }
  return (
    <>
      <Ouvrir
        label={`La course de la semaine. ${courses.map((c) => `${c.titre} : ${c.phrase}`).join(' ')} Voir le détail.`}
        titre="Toi et tes amis"
        className={styles.pagePleine}
        detail={<ClassementAmis joueurs={amis.joueurs} complet={amis.complet} monAvatar={amis.monAvatar} />}
      >
        <TitrePage teinte="rose">La course</TitrePage>
        <span className={styles.sousTitre}>depuis lundi, qui mène ?</span>
        {courses.map((c) => (
          <Epreuve key={c.epreuve} course={c} monAvatar={amis.monAvatar} />
        ))}
      </Ouvrir>
      <Folio n={5} />
    </>
  )
}

function CourseDroite({ amis }: EcranMoiProps) {
  const courses = courseDeLaSemaine(amis.joueurs)
  // Le classement de la page de droite : l'XP de la semaine (tout le travail),
  // à défaut les trophées gagnés.
  const course = courses.find((c) => c.epreuve === 'xp') ?? courses[0]
  if (!course) {
    return (
      <>
        <div className={styles.pagePleine}>
          <TitrePage>La course</TitrePage>
          <Doodle nom="epees" className={styles.grandDoodle} />
          <p className={styles.petitCentre}>
            Dès ton premier ami, vous vous mesurez chaque semaine : XP, trophées et niveaux gagnés.
          </p>
          <Link href="/amis" className={styles.boutonEncre}>
            Voir mes amis
          </Link>
        </div>
        <Folio n={6} />
      </>
    )
  }
  const challenger = challengerDe(amis.joueurs)
  const lignes = lignesVisibles(course.lignes, 7)
  return (
    <>
      <Ouvrir
        label={`Le classement de la semaine, ${course.titre.toLowerCase()}. ${course.phrase} Voir le détail.`}
        titre="Toi et tes amis"
        className={styles.pagePleine}
        detail={<ClassementAmis joueurs={amis.joueurs} complet={amis.complet} monAvatar={amis.monAvatar} />}
      >
        <TitrePage>Cette semaine</TitrePage>
        <span className={styles.sousTitre}>{course.titre.toLowerCase()}</span>
        <ol className={styles.liste}>
          {lignes.map((j) => (
            <li key={j.id} className={styles.ami} data-moi={j.moi || undefined}>
              <span className={styles.amiRang}>
                {j.rang === 1 && j.valeur > 0 ? <Doodle nom="couronne" className={styles.amiCouronne} /> : j.rang}
              </span>
              <span className={styles.amiPortrait}>
                <PortraitJoueur id={j.id} portrait={j.portrait} avatar={j.moi ? amis.monAvatar : null} className="size-full" />
              </span>
              <span className={styles.amiNom}>
                {j.moi ? 'Toi' : j.nom}
                {challenger === j.id ? <Doodle nom="epees" className={styles.amiEpees} /> : null}
              </span>
              <span className={styles.amiValeur}>{libelleEpreuve(course.epreuve, j.valeur)}</span>
            </li>
          ))}
        </ol>
        <p className={styles.postit}>{course.phrase}</p>
      </Ouvrir>
      <Folio n={6} />
    </>
  )
}

// --- Collection ----------------------------------------------------------------

function CollectionGauche({ couronnes }: EcranMoiProps) {
  const liste = [...couronnes.liste].sort((a, b) => b.ratio - a.ratio)
  const montrees = liste.slice(0, 7)
  return (
    <>
      <Ouvrir
        label={`Mes couronnes : ${pluriel(couronnes.bilan.gagnees, 'couronne')}. Voir le détail.`}
        titre="Mes couronnes"
        className={styles.pagePleine}
        detail={<Vitrine liste={couronnes.liste} bilan={couronnes.bilan} />}
      >
        <TitrePage teinte="vert">Mes couronnes</TitrePage>
        {montrees.length > 0 ? (
          <ul className={styles.liste}>
            {montrees.map((c) => (
              <li key={c.subjectId} className={styles.matiere}>
                <CouronneArt tier={c.tier} className={styles.matiereCouronne} />
                <span className={styles.matiereNom}>{c.subjectName}</span>
                <span className={styles.matiereJauge}>
                  <span style={{ width: `${Math.max(4, Math.round(c.ratio * 100))}%` }} />
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.petitCentre}>Maîtrise un chapitre pour poser ta première couronne.</p>
        )}
        {liste.length > montrees.length ? (
          <span className={styles.petitCentre}>+ {pluriel(liste.length - montrees.length, 'matière')}</span>
        ) : null}
        <p className={styles.postit}>
          {pluriel(couronnes.bilan.gagnees, 'couronne')} sur {pluriel(couronnes.bilan.matieres, 'matière')}
        </p>
      </Ouvrir>
      <Folio n={7} />
    </>
  )
}

const CASES_BADGES = 12

function CollectionDroite({ identite, badges, couronnes }: EcranMoiProps) {
  const tous = identite?.data.badges ?? []
  const vitrine = etatVitrine(badges.gagnes, couronnes.bilan.gagnees)
  return (
    <>
      <div className={styles.pagePleine}>
        <TitrePage>Mes badges</TitrePage>
        <span className={styles.sousTitre}>
          {badges.gagnes}/{badges.total} gagnés · touche-les
        </span>
        <BadgesCarnet badges={tous} max={CASES_BADGES} />
        <p className={styles.postit}>
          Bannière {libelleBanniere(vitrine.palier.nom)}
          {vitrine.suivant ? ` · ${vitrine.manque} pt${vitrine.manque > 1 ? 's' : ''} pour l’${vitrine.suivant.nom.toLowerCase()}` : ''}
        </p>
      </div>
      <Folio n={8} />
    </>
  )
}

// --- Palmarès ------------------------------------------------------------------

function PalmaresGauche({ palmares }: EcranMoiProps) {
  const d = palmares.duels
  const joue = d && d.played > 0
  const taux = joue ? Math.round((d.wins / d.played) * 100) : 0
  return (
    <>
      <Ouvrir
        label={joue ? `Mes duels : ${pluriel(d.wins, 'victoire')} sur ${d.played}. Voir le palmarès.` : 'Mon palmarès. Voir le détail.'}
        titre="Mon palmarès"
        className={styles.pagePleine}
        detail={<Palmares lignes={palmares.lignes} duels={palmares.duels} />}
      >
        <TitrePage teinte="violet">Mes duels</TitrePage>
        <span className={styles.laurier}>
          <Doodle nom="laurier" className={styles.laurierDoodle} />
          <span className={styles.laurierChiffre}>{joue ? d.wins : '—'}</span>
        </span>
        <span className={styles.legendeCentre}>{joue ? `victoire${d.wins > 1 ? 's' : ''} sur ${d.played}` : 'aucun duel encore'}</span>
        {joue ? (
          <>
            <span className={styles.jauge} aria-hidden="true">
              <span style={{ width: `${taux}%` }} />
            </span>
            <span className={styles.petitCentre}>{taux} % de victoires</span>
            <Filet className={styles.filet} />
            <span className={styles.etiquette}>Record de trophées</span>
            <span className={styles.chiffre}>{nombre(d.bestTrophies)}</span>
          </>
        ) : (
          <p className={styles.petitCentre}>Lance un duel dans l’arène : ta première victoire s’écrira ici.</p>
        )}
      </Ouvrir>
      <Folio n={3} />
    </>
  )
}

/**
 * LA PLACE D'UN RECORD, EN POURCENTAGE (Lucas, 05/10/2026 : « 6 000 points
 * serait égal à top 10 % par exemple, car là ce n'est pas parlant »). Le rang
 * de toujours parmi les élèves de mon niveau (`my_mode_palmares`, 352), en
 * bande de 5 arrondie CONTRE l'élève, comme le compte de l'arène.
 */
function RangRecord({ rang, total, semaine }: { rang: number | null; total: number | null; semaine: number | null }) {
  const top = topPourcent(rang, total)
  if (top !== null) {
    return (
      <span className={styles.recordRang}>
        <span className={styles.recordTop} data-elite={top <= 10 || undefined}>
          {libelleTop(top)}
        </span>{' '}
        de ton niveau
      </span>
    )
  }
  if (semaine) {
    return <span className={styles.recordRang}>{semaine === 1 ? '1er' : `${semaine}e`} de la semaine</span>
  }
  return null
}

function PalmaresDroite({ palmares }: EcranMoiProps) {
  const records = [...palmares.lignes].filter((l) => l.best > 0).sort((a, b) => b.plays - a.plays).slice(0, 5)
  return (
    <>
      <Ouvrir
        label={`Mes records : ${pluriel(records.length, 'épreuve')}. Voir le palmarès.`}
        titre="Mon palmarès"
        className={styles.pagePleine}
        detail={<Palmares lignes={palmares.lignes} duels={palmares.duels} />}
      >
        <TitrePage doodle="etoile">Mes records</TitrePage>
        {records.length > 0 ? (
          <ul className={styles.liste}>
            {records.map((l) => (
              <li key={l.mode} className={styles.record}>
                <span className={styles.recordNom}>{epreuve(l.mode).nom}</span>
                <span className={styles.recordScore}>{formatScore(l.mode, l.best)}</span>
                <RangRecord rang={l.allRank} total={l.allTotal} semaine={l.weekRank} />
              </li>
            ))}
          </ul>
        ) : (
          <>
            <Doodle nom="medaille" className={styles.grandDoodle} />
            <p className={styles.petitCentre}>Joue un mode de l’arène ou un jeu : ton premier record s’inscrira ici.</p>
          </>
        )}
      </Ouvrir>
      <Folio n={4} />
    </>
  )
}
