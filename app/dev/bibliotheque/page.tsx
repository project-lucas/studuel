import { notFound } from 'next/navigation'
import Bibliotheque from '@/components/bibliotheque/Bibliotheque'
import BentoCarnet from '@/components/carnet/BentoCarnet'
import { lireFichesAchetees, lireRayon } from '@/lib/bibliotheque'
import { etagereCarnet, type AchatCapsule, type Capsule } from '@/lib/capsules'
import { normaliserPreferences } from '@/lib/carnet/preferences'
import type { CoursCarnet } from '@/lib/carnet/priorite'

export const dynamic = 'force-dynamic'

// L'APERÇU DE « MA BIBLIOTHÈQUE » — en développement seulement.
//
// La vraie page demande un compte, des dossiers, des capsules achetées et des
// chapitres débloqués. Celle-ci rend le même écran avec des données de
// démonstration (aucune base) :
//
//   /dev/bibliotheque                    tout rempli
//   /dev/bibliotheque?rayon=fiches       un rayon ouvert d'emblée
//   /dev/bibliotheque?vide=1             les invitations des rayons vides
//   /dev/bibliotheque?vide=1&premium=1   un abonné : pas d'invitation à acheter

const AUJOURDHUI = '2026-09-24'

const CAPSULES: Capsule[] = [
  capsule('sommeil', 'bien-etre', 'Le sommeil, ton super-pouvoir', '😴', 'ocean'),
  capsule('pomodoro', 'methode', 'La méthode Pomodoro', '🍅', 'corail'),
  capsule('budget', 'vie-pratique', 'Gérer ton premier budget', '💶', 'menthe'),
  capsule('orientation', 'avenir', 'Choisir ses spécialités', '🧭', 'prune'),
]

const ACHATS: AchatCapsule[] = [
  achat('sommeil', '2026-09-23T18:00:00Z', null, null),
  achat('pomodoro', '2026-09-19T18:00:00Z', '2026-09-19T18:05:00Z', '2026-09-20T10:00:00Z'),
  achat('budget', '2026-09-21T18:00:00Z', '2026-09-21T18:05:00Z', null),
]

const MATIERES = [
  { id: 'm', slug: 'maths', name: 'Maths' },
  { id: 'h', slug: 'histoire-geo', name: 'Histoire-Géo' },
  { id: 's', slug: 'svt', name: 'SVT' },
]

const DEBLOCAGES = [
  deblocage('m', 'Les fonctions affines', 3, 'Fonctions', '2026-09-22'),
  deblocage('m', 'Le théorème de Pythagore', 1, 'Géométrie', '2026-09-10'),
  deblocage('h', 'La Révolution française', 4, 'La Révolution et l’Empire', '2026-09-18'),
  deblocage('s', 'La cellule, unité du vivant', 2, null, '2026-09-15'),
]

const COURS: CoursCarnet[] = [
  cours('1', 'Vocabulaire d’anglais', 24, 6, 'languages', true),
  cours('2', 'Dates d’histoire', 18, 0, 'book-open', false),
  cours('3', 'Formules de physique', 12, 3, 'calculator', false),
]

export default async function ApercuBibliothequePage({
  searchParams,
}: {
  searchParams: Promise<{ rayon?: string; vide?: string; premium?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const q = await searchParams
  const vide = q.vide === '1'
  const cours = vide ? [] : COURS
  return (
    <Bibliotheque
      rayonInitial={lireRayon(q.rayon)}
      capsules={vide ? [] : etagereCarnet(CAPSULES, ACHATS)}
      capsulesDisponibles
      fiches={vide ? [] : lireFichesAchetees(DEBLOCAGES, MATIERES)}
      premium={q.premium === '1'}
      nbDossiers={cours.length}
      dossiers={
        <BentoCarnet
          cours={cours}
          prefs={normaliserPreferences(null)}
          revuesAujourdhui={4}
          aujourdhui={AUJOURDHUI}
        />
      }
    />
  )
}

function capsule(
  id: string,
  theme: Capsule['theme'],
  titre: string,
  emoji: string,
  teinte: Capsule['teinte'],
): Capsule {
  return {
    id,
    theme,
    titre,
    accroche: '',
    emoji,
    teinte,
    prixGemmes: 60,
    prixEuros: null,
    dureeMin: 10,
    auProgramme: [],
    badge: '',
    ordre: 0,
  }
}

function achat(
  capsuleId: string,
  acheteeLe: string,
  ouverteLe: string | null,
  termineeLe: string | null,
): AchatCapsule {
  return { capsuleId, statut: 'active', acheteeLe, ouverteLe, termineeLe }
}

function deblocage(subject: string, title: string, position: number, theme: string | null, le: string) {
  const id = `demo-${subject}-${position}`
  return {
    chapter_id: id,
    created_at: `${le}T10:00:00Z`,
    chapter: { id, title, position, subject_id: subject, theme },
  }
}

function cours(
  id: string,
  title: string,
  questionCount: number,
  dueCount: number,
  icon: string,
  epingle: boolean,
): CoursCarnet {
  return {
    id,
    title,
    description: null,
    icon,
    color: null,
    subjectId: null,
    questionCount,
    dueCount,
    nouvelles: 0,
    crowns: 1,
    examOn: null,
    objectif: null,
    epingle,
    archive: false,
    updatedAt: `${AUJOURDHUI}T08:00:00Z`,
    dernierRevuLe: '2026-09-23',
  }
}
