'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StandingLine from '@/components/StandingLine'
import GardienBadge from '@/components/reviser/GardienBadge'
import SubjectHeader from '@/components/reviser/SubjectHeader'
import SubjectStickyBar from '@/components/reviser/SubjectStickyBar'
import ModeTabs from '@/components/reviser/ModeTabs'
import ChapterList from '@/components/reviser/ChapterList'
import TrainingPanel from '@/components/reviser/TrainingPanel'
import CarteDictee from '@/components/francais/dictee/CarteDictee'
import ExamBanner from '@/components/reviser/ExamBanner'
import AnnalesPanel from '@/components/reviser/AnnalesPanel'
import MarcelFab from '@/components/reviser/MarcelFab'
import {
  chapterUnit,
  disciplineLabel,
  disciplinesOf,
  modesFor,
  tabId,
  type SubjectTemplateData,
} from '@/lib/subject-template'
import { examYearFor } from '@/lib/annales'
import { hrefEncyclopedie } from '@/lib/encyclopedie/matieres'
import { afficheEcusson, gardienVue } from '@/lib/reviser/gardien'

// Template GÉNÉRIQUE de page matière : valable pour toutes les matières, tout
// vient de Supabase (via le vue-modèle sérialisable calculé côté serveur).
// Header + trois onglets + vues, FAB IA. Seule interactivité : les onglets.
export default function SubjectTemplate({
  data,
  initialMode,
}: {
  data: SubjectTemplateData
  // Onglet ouvert à l'arrivée (`?onglet=boss` depuis la feuille Modes de jeu),
  // sous forme d'identifiant (« jeu », « programme:geographie »).
  initialMode?: string
}) {
  // Les onglets dépendent de la CLASSE (« Annales » n'existe que les années à
  // examen) ET de la matière : celle qui réunit deux disciplines — histoire-géo
  // — remplace « Programme » par « Histoire » et « Géographie ».
  const router = useRouter()
  const disciplines = disciplinesOf(data.chapters)
  const modes = modesFor(data.gradeLevel, disciplines, data.subject.slug)
  const [tab, setTab] = useState<string>(initialMode ?? tabId(modes[0]))

  // L'ENCYCLOPÉDIE N'EST PAS UN PANNEAU DE CETTE PAGE, c'est un rayon à part —
  // et l'onglet y conduit au lieu de changer d'état. Deux raisons : une fiche
  // doit avoir SON adresse (on partage « Jeanne d'Arc », on ne partage pas
  // « le dossier d'histoire, quatrième onglet »), et le corpus fait des
  // centaines de kilo-octets que le bundle du dossier n'a pas à porter.
  const changerOnglet = (id: string) => {
    if (id === 'encyclopedie') {
      router.push(hrefEncyclopedie(data.subject.slug))
      return
    }
    setTab(id)
  }
  // Un identifiant inconnu (onglet disparu, lien ancien) retombe sur le premier.
  const active = modes.find((m) => tabId(m) === tab) ?? modes[0]
  const mode = active.key
  const exam = examYearFor(data.gradeLevel)

  // L'onglet d'une discipline ne montre QUE ses chapitres — et ne compte que
  // les siens : un header qui annoncerait les 53 fiches du dossier au-dessus de
  // la liste de géographie mentirait sur ce qu'il chapeaute. Le CTA
  // « Reprendre » est recalculé pour la même raison : celui du dossier entier
  // désignerait souvent un chapitre invisible dans l'onglet ouvert.
  const chapters = active.discipline
    ? data.chapters.filter((c) => c.discipline === active.discipline)
    : data.chapters
  const progress = active.discipline
    ? (data.progressByDiscipline[active.discipline] ?? data.progress)
    : data.progress
  // Le drapeau de la dernière session ne se montre que si sa fiche est dans
  // l'onglet ouvert (une discipline n'affiche que ses chapitres).
  const resume =
    data.resume && chapters.some((c) => c.id === data.resume?.chapterId)
      ? data.resume
      : null
  // Une matière rangée sous les chapitres du programme compte ses lignes en
  // FICHES : le mot « chapitre » y désigne les en-têtes de la liste.
  const unit = chapterUnit(chapters)

  // LE GARDIEN. Un seul modèle de vue, lu par l'écusson du header, par celui de
  // la barre collante, par la bulle de l'onglet et par le billet : quatre
  // lectures indépendantes de la même jauge finiraient par se contredire.
  const gardien = gardienVue(data.gardien)
  // Le dossier de français — le seul à porter les dictées. On teste le SLUG et
  // non le nom affiché : celui-ci change avec la classe (« Français », « Français
  // 1re »), le slug non.
  const estFrancais = data.subject.slug === 'francais'
  const ongletJeu = modes.find((m) => m.key === 'jeu')
  const jeuId = ongletJeu ? tabId(ongletJeu) : null
  // Taper l'écusson mène là où le gardien se combat, quel que soit l'onglet ouvert.
  const versLeGardien = () => {
    if (jeuId) setTab(jeuId)
  }
  // `tone="light"` : l'en-tête est posé sur le mur crème depuis le 23/09/2026,
  // plus sur un bandeau sombre — une silhouette blanche y disparaîtrait.
  const ecusson = afficheEcusson(gardien) ? (
    <GardienBadge vue={gardien} tone="light" onSelect={versLeGardien} />
  ) : null

  return (
    // Plus de marges négatives ni de bandeau plein écran : l'en-tête est celui
    // de toutes les pages de Réviser, sur le mur crème de l'app (audit du
    // 23/09/2026), dans les marges de lecture du gabarit.
    <div>
      <SubjectHeader
        subject={data.subject}
        grade={data.grade}
        progress={progress}
        unit={unit}
        discipline={
          active.discipline ? disciplineLabel(active.discipline) : null
        }
        gardien={ecusson}
        standing={
          data.standing ? (
            <StandingLine
              standing={data.standing}
              grade={data.gradeLevel}
              className="mt-0.5"
            />
          ) : null
        }
      >
        <ModeTabs
          modes={modes}
          active={tabId(active)}
          onChange={changerOnglet}
          bulle={
            gardien.bulle && jeuId ? { tab: jeuId, label: gardien.bulle } : null
          }
        />
      </SubjectHeader>

      <SubjectStickyBar
        name={data.subject.name}
        progress={progress}
        gardien={
          afficheEcusson(gardien) ? (
            <GardienBadge
              vue={gardien}
              size="sm"
              tone="light"
              onSelect={versLeGardien}
            />
          ) : null
        }
      />

      {/* Panneau de contenu, posé directement sur le mur quadrillé — plus de
          feuille opaque qui le couvrait (audit du 23/09/2026). Le `key` rejoue
          la petite animation d'entrée à chaque changement d'onglet — la seule
          animation de la page. */}
      <div>
        <div key={tabId(active)} className="pop-in mt-5">
          {mode === 'programme' ? (
            <>
              {/* PLUS DE BANDEAU « n notions à revoir » NI DE CARTE « On commence
                  par ça » (Lucas, 17/09/2026 : « supprime ces blocs ») : la
                  liste s'ouvre directement, et la fiche de la dernière session
                  porte un drapeau (ChapterItem). */}
              {/* L'examen blanc n'apparaît ici que si l'onglet Annales n'existe
                  pas (année sans examen) — sinon c'est là-bas qu'il vit, et le
                  répéter ferait deux portes pour la même épreuve. Sans Annales,
                  il ne prend la tête que lorsqu'il a du sens (`examBannerOnTop`),
                  et attend en pied de liste le reste du temps. */}
              {!exam && data.examOnTop ? (
                <ExamBanner subject={data.subject} />
              ) : null}
              <ChapterList
                chapters={chapters}
                resume={resume}
                subjectSlug={data.subject.slug}
                subjectName={
                  active.discipline
                    ? disciplineLabel(active.discipline)
                    : data.subject.name
                }
                grade={data.grade}
              />
              {!exam && !data.examOnTop ? (
                <div className="mt-6">
                  <ExamBanner subject={data.subject} />
                </div>
              ) : null}
            </>
          ) : mode === 'annales' && exam ? (
            <AnnalesPanel
              subject={data.subject}
              exam={exam}
              papers={data.papers}
            />
          ) : (
            // L'onglet « Mode de jeu » porte DEUX familles, dans cet ordre :
            // le gardien de la matière (le rendez-vous), puis les jeux de
            // l'arène (on joue tout de suite). Rien dessous : la liste des
            // chapitres et de leurs formats y redisait le Programme.
            <div className="flex flex-col gap-3">
              {/* LES DICTÉES — français seulement. Une dictée d'histoire-géo
                  n'existe pas, et une carte grisée « bientôt » dans les autres
                  dossiers serait une porte qui ne s'ouvre pas : le projet a
                  déjà refusé ça ailleurs (menu de création du carnet). */}
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

      {/* Marcel, avec la matière sous le bras : c'est lui qui génère fiches,
          exercices et flashcards sur mesure — l'ancienne baguette « IA,
          bientôt » promettait exactement cela sans jamais le faire. */}
      <MarcelFab matiere={data.subject.slug} />
    </div>
  )
}
