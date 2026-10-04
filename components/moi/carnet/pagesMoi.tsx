import Link from 'next/link'
import BadgeIcone from '@/components/BadgeIcone'
import PortraitJoueur from '@/components/amis/PortraitJoueur'
import BadgesVitrine from '@/components/moi/BadgesVitrine'
import Classement from '@/components/moi/Classement'
import ClassementAmis from '@/components/moi/ClassementAmis'
import CouronneArt from '@/components/moi/CouronneArt'
import Palmares from '@/components/moi/Palmares'
import RythmeBarres from '@/components/moi/RythmeBarres'
import TrajectoryCard from '@/components/moi/TrajectoryCard'
import Vitrine from '@/components/moi/Vitrine'
import type { DoublePage } from '@/components/moi/carnet/Carnet'
import { AnneauCrayon, Doodle, Eclats, Filet, Souligne, type NomDoodle } from '@/components/moi/carnet/Croquis'
import EntreeMoyenne from '@/components/moi/carnet/EntreeMoyenne'
import Ouvrir from '@/components/moi/carnet/Ouvrir'
import PageIdentite, { type IdentiteMoi } from '@/components/moi/carnet/PageIdentite'
import type { EcranMoiProps } from '@/components/moi/EcranMoi'
import { cadreClassement, invitationClassement, titreClassement } from '@/lib/moi/classement'
import {
  challengerDe,
  classerAmisPar,
  couronneDe,
  libelleValeur,
  phraseDuClassement,
  type AmiRange,
  type Mesure,
} from '@/lib/moi/classement-amis'
import { anneauRecord, libellesRecord } from '@/lib/moi/record'
import { formatDuree } from '@/lib/moi/temps'
import { etatVitrine, libelleBanniere } from '@/lib/moi/vitrine'
import { epreuve, formatScore } from '@/lib/palmares/epreuves'
import { cn } from '@/lib/utils'
import styles from '@/components/moi/carnet/Pages.module.css'

// -----------------------------------------------------------------------------
// LES PAGES DU CARNET DE MOI (04/10/2026) — cinq doubles pages, chacune répond
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
    { gauche: <ProgresGauche {...p} />, droite: <ProgresDroite {...p} /> },
    { gauche: <AmisPage {...p} mesure="temps" />, droite: <AmisPage {...p} mesure="trophees" /> },
    { gauche: <CollectionGauche {...p} />, droite: <CollectionDroite {...p} /> },
    { gauche: <PalmaresGauche {...p} />, droite: <PalmaresDroite {...p} /> },
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

function GardeDroite({ serie, trophees, identite, record }: EcranMoiProps & { identite: NonNullable<EcranMoiProps['identite']> }) {
  const mots = libellesRecord(record)
  const { fait, surplus } = anneauRecord(record)
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
      <div className={styles.semaine} role="group" aria-label={`${mots.valeur} de travail cette semaine`}>
        <AnneauCrayon part={fait + surplus} className={cn(styles.anneau, record.etat === 'battu' && styles.anneauOr)}>
          <span className={styles.anneauTexte}>
            <span className={styles.anneauChiffre}>{mots.valeur}</span>
            <span className={styles.anneauLegende}>cette semaine</span>
          </span>
        </AnneauCrayon>
      </div>
      <Folio n={2} />
    </div>
  )
}

// --- Progrès -------------------------------------------------------------------

const JOURS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const

function ProgresGauche({ record, rythme, travail }: EcranMoiProps) {
  const mots = libellesRecord(record)
  const { fait, surplus } = anneauRecord(record)
  const maxJour = Math.max(1, ...record.jours.map((j) => j.secondes))
  const contenu = (
    <>
      <TitrePage teinte="jaune">Ma semaine</TitrePage>
      <AnneauCrayon part={fait + surplus} className={cn(styles.grandAnneau, record.etat === 'battu' && styles.anneauOr)}>
        <span className={styles.anneauTexte}>
          <span className={styles.grandAnneauChiffre}>{mots.valeur}</span>
          <span className={styles.anneauLegende}>de travail</span>
        </span>
      </AnneauCrayon>
      <p className={styles.cible}>
        <span className={styles.etiquette}>{mots.sourcil}</span>
        <span className={styles.cibleValeur}>{mots.cible}</span>
      </p>
      <p className={cn(styles.note, mots.ton === 'battu' && styles.noteOr)}>{mots.pastille}</p>
      <div className={styles.jours} aria-hidden="true">
        {record.jours.map((j, i) => (
          <span key={i} className={styles.jour} data-aujourdhui={j.aujourdhui || undefined} data-avenir={j.aVenir || undefined}>
            <span className={styles.jourBarre}>
              <span style={{ height: `${Math.round((j.secondes / maxJour) * 100)}%` }} />
            </span>
            <span className={styles.jourLettre}>{JOURS[i]}</span>
          </span>
        ))}
      </div>
    </>
  )
  return (
    <>
      {rythme ? (
        <Ouvrir
          label={`${mots.valeur} de travail cette semaine. ${mots.sourcil} : ${mots.cible}. ${mots.pastille}. Voir mon rythme.`}
          titre="Ton rythme"
          className={styles.pagePleine}
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
          {contenu}
        </Ouvrir>
      ) : (
        <div className={styles.pagePleine}>{contenu}</div>
      )}
      <Folio n={3} />
    </>
  )
}

function ProgresDroite({ classement, notes, travail, trajectoire }: EcranMoiProps) {
  const cadre = cadreClassement('travail', classement.grade)
  const place = titreClassement(classement.mesures.travail, cadre)
  return (
    <div className={styles.colonne}>
      <Ouvrir
        label={
          place
            ? `Ma place : ${place.grand} ${place.petit}. Voir le classement.`
            : `Ma place : ${invitationClassement('travail').titre} Voir le classement.`
        }
        titre="Ton classement"
        className={styles.bloc}
        detail={<Classement mesures={classement.mesures} grade={classement.grade} initiale={classement.initiale} />}
      >
        <span className={styles.etiquette}>
          <Doodle nom="courbe" className={styles.etiquetteDoodle} />
          Ma place
        </span>
        {place ? (
          <>
            <span className={styles.chiffre}>{place.grand}</span>
            <span className={styles.petit}>{place.petit}</span>
          </>
        ) : (
          <span className={styles.petit}>{invitationClassement('travail').titre}</span>
        )}
      </Ouvrir>
      <Filet className={styles.filet} />
      <EntreeMoyenne bilan={notes.bilan} terms={notes.terms} disabled={notes.indisponible} />
      <Filet className={styles.filet} />
      <div className={styles.bloc}>
        <span className={styles.etiquette}>
          <Doodle nom="chrono" className={styles.etiquetteDoodle} />
          Depuis le début
        </span>
        <span className={styles.chiffre}>{formatDuree(travail.total)}</span>
        <span className={styles.petit}>de travail · {travail.titre}</span>
      </div>
      {trajectoire ? (
        <>
          <Filet className={styles.filet} />
          <Ouvrir
            label="Ma trajectoire jusqu'au bac. Voir le détail."
            titre="Ta trajectoire"
            className={styles.lien}
            detail={<TrajectoryCard trajectory={trajectoire.trajectory} needsMigration={trajectoire.needsMigration} />}
          >
            Ma trajectoire bac ›
          </Ouvrir>
        </>
      ) : null}
      <Folio n={4} />
    </div>
  )
}

// --- Amis ----------------------------------------------------------------------

/** Les lignes à montrer sur une page : les premiers, et moi toujours. */
function lignesVisibles(classes: readonly AmiRange[], max: number): AmiRange[] {
  if (classes.length <= max) return [...classes]
  const tete = classes.slice(0, max)
  if (tete.some((j) => j.moi)) return tete
  const moi = classes.find((j) => j.moi)
  return moi ? [...classes.slice(0, max - 1), moi] : tete
}

function AmisPage({ amis, mesure }: EcranMoiProps & { mesure: Mesure }) {
  const gauche = mesure === 'temps'
  const classes = classerAmisPar(amis.joueurs, mesure)
  const seul = classes.length <= 1
  const couronne = couronneDe(classes, mesure)
  const challenger = challengerDe(amis.joueurs)

  if (seul) {
    return gauche ? (
      <>
        <div className={styles.pagePleine}>
          <TitrePage teinte="rose">Mes amis</TitrePage>
          <Doodle nom="amis" className={styles.grandDoodle} />
          <p className={styles.note}>Ton carnet d’amis est encore vide.</p>
          <p className={styles.petitCentre}>Chaque ami ajouté monte ton multiplicateur d’XP de +0,1.</p>
        </div>
        <Folio n={5} />
      </>
    ) : (
      <>
        <div className={styles.pagePleine}>
          <TitrePage>Défie-les</TitrePage>
          <Doodle nom="epees" className={styles.grandDoodle} />
          <p className={styles.petitCentre}>Compare ton travail et tes trophées, semaine après semaine.</p>
          <Link href="/amis" className={styles.boutonEncre}>
            Ajouter un ami
          </Link>
        </div>
        <Folio n={6} />
      </>
    )
  }

  const lignes = lignesVisibles(classes, 6)
  return (
    <>
      <Ouvrir
        label={`${gauche ? 'Toi et tes amis au temps de travail de la semaine' : 'Toi et tes amis aux trophées'}. ${phraseDuClassement(classes, mesure)} Voir le détail.`}
        titre="Toi et tes amis"
        className={styles.pagePleine}
        detail={<ClassementAmis joueurs={amis.joueurs} complet={amis.complet} monAvatar={amis.monAvatar} />}
      >
        <TitrePage teinte={gauche ? 'rose' : undefined}>{gauche ? 'Cette semaine' : 'Aux trophées'}</TitrePage>
        <span className={styles.sousTitre}>{gauche ? 'au temps de travail' : 'depuis le début'}</span>
        <ol className={styles.liste}>
          {lignes.map((j) => (
            <li key={j.id} className={styles.ami} data-moi={j.moi || undefined}>
              <span className={styles.amiRang}>
                {couronne === j.id ? <Doodle nom="couronne" className={styles.amiCouronne} /> : j.rang}
              </span>
              <span className={styles.amiPortrait}>
                <PortraitJoueur id={j.id} portrait={j.portrait} avatar={j.moi ? amis.monAvatar : null} className="size-full" />
              </span>
              <span className={styles.amiNom}>
                {j.moi ? 'Toi' : j.nom}
                {!gauche && challenger === j.id ? <Doodle nom="epees" className={styles.amiEpees} /> : null}
              </span>
              <span className={styles.amiValeur}>{libelleValeur(j, mesure)}</span>
            </li>
          ))}
        </ol>
        <p className={styles.postit}>{phraseDuClassement(classes, mesure)}</p>
      </Ouvrir>
      <Folio n={gauche ? 5 : 6} />
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
  const gagnes = tous.filter((b) => b.earned)
  const vitrine = etatVitrine(badges.gagnes, couronnes.bilan.gagnees)
  // Autant de cases que de badges à gagner (douze au plus) : une case vide est une promesse.
  const cases = Array.from({ length: Math.min(CASES_BADGES, Math.max(badges.total, gagnes.length)) }, (_, i) => gagnes[i] ?? null)
  return (
    <>
      <Ouvrir
        label={`Mes badges : ${badges.gagnes} sur ${badges.total}. Voir la collection.`}
        titre="Mes badges"
        className={styles.pagePleine}
        detail={<BadgesVitrine badges={tous} enAvant={identite?.data.equippedBadgeIds ?? []} />}
      >
        <TitrePage>Mes badges</TitrePage>
        <span className={styles.sousTitre}>
          {badges.gagnes}/{badges.total} collés
        </span>
        <ul className={styles.autocollants}>
          {cases.map((b, i) =>
            b ? (
              <li key={b.id} className={styles.autocollant} title={b.title} style={{ rotate: `${((i * 37) % 13) - 6}deg` }}>
                <BadgeIcone slug={b.slug} icon={b.icon} tailleImage="size-full" />
              </li>
            ) : (
              <li key={`vide-${i}`} className={styles.caseVide} aria-hidden="true">
                ?
              </li>
            ),
          )}
        </ul>
        <p className={styles.postit}>
          Bannière {libelleBanniere(vitrine.palier.nom)}
          {vitrine.suivant ? ` · ${vitrine.manque} pt${vitrine.manque > 1 ? 's' : ''} pour l’${vitrine.suivant.nom.toLowerCase()}` : ''}
        </p>
      </Ouvrir>
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
      <Folio n={9} />
    </>
  )
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
                {l.weekRank ? (
                  <span className={styles.recordRang}>
                    {l.weekRank === 1 ? '1er' : `${l.weekRank}e`} de la semaine
                  </span>
                ) : null}
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
      <Folio n={10} />
    </>
  )
}
