'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import StandingLine from '@/components/StandingLine'
import GardienBadge from '@/components/reviser/GardienBadge'
import BanniereMatiere from '@/components/reviser/BanniereMatiere'
import PortesMatiere, { type PorteVue } from '@/components/reviser/PortesMatiere'
import SegmentRayons from '@/components/reviser/SegmentRayons'
import SubjectStickyBar from '@/components/reviser/SubjectStickyBar'
import Sommaire from '@/components/reviser/Sommaire'
import CahierMatiere from '@/components/reviser/CahierMatiere'
import { prechargerCahier } from '@/components/reviser/useCahierMatiere'
import TrainingPanel from '@/components/reviser/TrainingPanel'
import CarteDictee from '@/components/francais/dictee/CarteDictee'
import ExamBanner from '@/components/reviser/ExamBanner'
import AnnalesPanel from '@/components/reviser/AnnalesPanel'
import {
  chapterUnit,
  disciplineLabel,
  disciplinesOf,
  modesFor,
  porteDe,
  portesDe,
  rayonsDe,
  tabId,
  type ClePorte,
  type SubjectTemplateData,
} from '@/lib/subject-template'
import { examYearFor } from '@/lib/annales'
import { salonSubjectFor, subjectGameTickets } from '@/lib/defi/modes-catalog'
import { hrefEncyclopedie } from '@/lib/encyclopedie/matieres'
import { afficheEcusson, gardienVue } from '@/lib/reviser/gardien'
import { jaugeDesFiches, repriseDuProgramme } from '@/lib/reviser/programme'

/** Écrit un paramètre de l'adresse sans empiler d'entrée d'historique. */
function ecrireParametre(nom: string, valeur: string | null) {
  const url = new URL(window.location.href)
  if (valeur === null) url.searchParams.delete(nom)
  else url.searchParams.set(nom, valeur)
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}`)
}

const pluriel = (n: number, mot: string) => `${n} ${mot}${n > 1 ? 's' : ''}`

// Template GÉNÉRIQUE de page matière : valable pour toutes les matières et
// toutes les classes, tout vient de Supabase (via le vue-modèle sérialisable
// calculé côté serveur).
//
// DEPUIS LE 05/10/2026 (maquettes d'assets-sources/maquettes/matiere*.html,
// choisies par Lucas) :
//
//   · LA BANNIÈRE à la teinte de la matière — son nom, sa barre d'or, le
//     gardien, Marcel, et « Commencer / Reprendre » qui mène droit au cours ;
//   · LE RAIL DE PORTES — Cours · Exercices · Jeux · Annales, au lieu de six
//     pilules à plat ; le cahier d'exercices de la matière y a sa porte ;
//   · LE SOMMAIRE derrière la porte Cours, avec ses rayons en segment.
//
// L'état des portes et des rayons vit ici ; l'adresse le suit (`?onglet=`,
// `?theme=`, écrits sans empiler d'historique) : revenir d'un cours rouvre la
// porte, le rayon et le thème quittés.
export default function SubjectTemplate({
  data,
  initialMode,
  carnet = null,
}: {
  data: SubjectTemplateData
  // Onglet ouvert à l'arrivée (`?onglet=exercices`, `?onglet=programme:geographie`),
  // sous forme d'identifiant.
  initialMode?: string
  /** « Tes cours » du carnet rattachés à la matière, posés dans la porte Cours. */
  carnet?: ReactNode
}) {
  const router = useRouter()
  const { slug } = data.subject
  // Les onglets dépendent de la CLASSE (« Annales » n'existe que les années à
  // examen) ET de la matière (ses rayons, son cahier, son encyclopédie).
  const modes = useMemo(
    () => modesFor(data.gradeLevel, disciplinesOf(data.chapters), slug, Boolean(data.cahier)),
    [data.gradeLevel, data.chapters, slug, data.cahier],
  )
  const portes = portesDe(modes)
  const rayons = rayonsDe(modes)
  const [tab, setTab] = useState<string>(initialMode ?? tabId(modes[0]))
  // Un identifiant inconnu (onglet disparu, lien ancien) retombe sur le premier.
  const active = modes.find((m) => tabId(m) === tab) ?? modes[0]
  const porte = porteDe(active.key)

  // LE RAYON DE LA PORTE COURS : celui qu'on regarde, ou le dernier regardé
  // quand une autre porte est ouverte — la bannière compte SES fiches, et
  // revenir à Cours le rouvre.
  const premierRayon = modes.find((m) => m.key === 'programme') ?? modes[0]
  const [dernierRayon, setDernierRayon] = useState<string>(
    active.key === 'programme' ? tabId(active) : tabId(premierRayon),
  )
  const rayon = modes.find((m) => tabId(m) === dernierRayon) ?? premierRayon

  const changerOnglet = (id: string) => {
    // L'ENCYCLOPÉDIE N'EST PAS UN PANNEAU DE CETTE PAGE, c'est un rayon qui a
    // ses propres adresses (une fiche se partage) et son propre corpus (des
    // centaines de kilo-octets que ce dossier n'a pas à porter) : on y va.
    if (id === 'encyclopedie') {
      router.push(hrefEncyclopedie(slug))
      return
    }
    setTab(id)
    if (id.startsWith('programme')) setDernierRayon(id)
    ecrireParametre('onglet', id === tabId(modes[0]) ? null : id)
  }
  const ouvrirPorte = (cle: ClePorte) => {
    changerOnglet(cle === 'programme' ? tabId(rayon) : cle)
  }

  // Le rayon ne montre QUE ses chapitres — et ne compte que les siens : une
  // bannière qui annoncerait les 300 fiches du dossier au-dessus de la liste de
  // grammaire mentirait sur ce qu'elle chapeaute. La fiche à reprendre est
  // recalculée pour la même raison.
  const chapters = useMemo(
    () =>
      rayon.discipline
        ? data.chapters.filter((c) => c.discipline === rayon.discipline)
        : data.chapters,
    [data.chapters, rayon.discipline],
  )
  const progress = rayon.discipline
    ? (data.progressByDiscipline[rayon.discipline] ?? data.progress)
    : data.progress
  // Le repère de la dernière session ne vaut que si sa fiche est dans le rayon.
  const resume =
    data.resume && chapters.some((c) => c.id === data.resume?.chapterId) ? data.resume : null
  const reprise = useMemo(() => repriseDuProgramme(chapters, resume), [chapters, resume])
  // Une matière rangée sous les chapitres du programme compte ses lignes en
  // FICHES : le mot « chapitre » y désigne les thèmes.
  const unit = chapterUnit(chapters)
  // La barre suit la courbe d'encouragement (« elle doit se remplir même si
  // l'élève a fait un chapitre ») ; le compte écrit dessus reste exact.
  const jauge = jaugeDesFiches(chapters)
  const nomDuRayon = rayon.discipline ? disciplineLabel(rayon.discipline) : null
  const exam = examYearFor(data.gradeLevel)

  // LE GARDIEN. Un seul modèle de vue, lu par l'écusson de la bannière, par
  // celui de la barre collante, par la bulle de la porte et par le billet :
  // quatre lectures indépendantes de la même jauge finiraient par se contredire.
  const gardien = gardienVue(data.gardien)
  const aEcusson = afficheEcusson(gardien)
  // Le dossier de français — le seul à porter les dictées. On teste le SLUG et
  // non le nom affiché : celui-ci change avec la classe, le slug non.
  const estFrancais = slug === 'francais'
  // Toucher l'écusson mène là où le gardien se combat.
  const versLeGardien = () => changerOnglet('jeu')

  const jeux = (() => {
    const salon = salonSubjectFor(data.subject)
    return salon ? subjectGameTickets(salon, { premium: data.premium ?? false }).length : 0
  })()
  const comptes: Record<ClePorte, string | null> = {
    programme: pluriel(progress.total, unit),
    exercices: data.cahier ? pluriel(data.cahier.total, 'exercice') : null,
    jeu:
      [jeux > 0 ? `${jeux} jeu${jeux > 1 ? 'x' : ''}` : null, gardien.boss ? '1 boss' : null]
        .filter(Boolean)
        .join(' · ') || 'Défis',
    annales: exam ? exam.short : null,
  }
  const portesVues: PorteVue[] = portes.map((p) => ({
    ...p,
    compte: comptes[p.key],
    // L'exercice est de l'offre Studuel+ : la couronne nomme l'offre.
    couronne: p.key === 'exercices' && !data.premium,
    bulle: p.key === 'jeu' ? gardien.bulle : null,
  }))

  return (
    <div>
      <BanniereMatiere
        subject={data.subject}
        grade={data.grade}
        rayon={nomDuRayon}
        unit={unit}
        progress={progress}
        jauge={jauge}
        reprise={reprise}
        gardien={
          aEcusson ? (
            <GardienBadge vue={gardien} size="sm" tone="light" onSelect={versLeGardien} />
          ) : null
        }
        standing={
          data.standing ? (
            <StandingLine standing={data.standing} grade={data.gradeLevel} className="mt-0.5" />
          ) : null
        }
      />

      <PortesMatiere
        portes={portesVues}
        active={porte}
        onChange={ouvrirPorte}
        // Le doigt se pose sur « Exercices » : le cahier part se lire tout de
        // suite, une centaine de millisecondes avant le clic.
        onIntention={(cle) => {
          if (cle === 'exercices') prechargerCahier(slug)
        }}
      />

      <SubjectStickyBar
        name={data.subject.name}
        slug={slug}
        progress={progress}
        jauge={jauge}
        gardien={
          aEcusson ? (
            <GardienBadge vue={gardien} size="sm" tone="light" onSelect={versLeGardien} />
          ) : null
        }
      />

      {/* Le contenu de la porte ouverte, posé sur le mur quadrillé. Le `key`
          rejoue la petite animation d'entrée à chaque changement — la seule
          animation de la page. */}
      <div key={porte === 'programme' ? tabId(rayon) : porte} className="pop-in">
        {porte === 'programme' ? (
          <>
            {/* L'examen blanc n'apparaît ici que si la porte Annales n'existe
                pas (année sans examen) — sinon c'est là-bas qu'il vit. Il ne
                prend la tête que lorsqu'il a du sens (`examBannerOnTop`), et
                attend en pied de liste le reste du temps. */}
            {!exam && data.examOnTop ? (
              <div className="mt-3.5">
                <ExamBanner subject={data.subject} />
              </div>
            ) : null}
            <Sommaire
              chapters={chapters}
              resume={resume}
              subjectSlug={slug}
              subjectName={nomDuRayon ?? data.subject.name}
              grade={data.grade}
              rayons={
                rayons.length > 0 ? (
                  <SegmentRayons rayons={rayons} actif={tabId(rayon)} onChange={changerOnglet} />
                ) : null
              }
              themeOuvert={data.themeOuvert ?? null}
              onTheme={(cle) => ecrireParametre('theme', cle)}
              avant={carnet ? <div className="mt-3 empty:hidden">{carnet}</div> : null}
            />
            {!exam && !data.examOnTop ? (
              <div className="mt-6">
                <ExamBanner subject={data.subject} />
              </div>
            ) : null}
          </>
        ) : porte === 'exercices' && data.cahier ? (
          <div className="mt-4">
            <CahierMatiere
              matiere={slug}
              nom={data.subject.name}
              total={data.cahier.total}
              premium={data.premium ?? false}
            />
          </div>
        ) : porte === 'annales' && exam ? (
          <div className="mt-4">
            <AnnalesPanel
              subject={data.subject}
              exam={exam}
              papers={data.papers}
              annales={data.annalesCorrigees}
            />
          </div>
        ) : (
          // La porte « Jeux » porte DEUX familles, dans cet ordre : le gardien
          // de la matière (le rendez-vous), puis les jeux de l'arène (on joue
          // tout de suite).
          <div className="mt-4 flex flex-col gap-3">
            {/* LES DICTÉES — français seulement. Une carte grisée « bientôt »
                dans les autres dossiers serait une porte qui ne s'ouvre pas. */}
            {estFrancais ? <CarteDictee /> : null}
            <TrainingPanel
              subject={data.subject}
              bossPool={data.bossPool}
              gardien={gardien}
              premium={data.premium ?? false}
            />
          </div>
        )}
      </div>
    </div>
  )
}
