import { notFound } from 'next/navigation'
import SubjectHeader from '@/components/reviser/SubjectHeader'
import ProgrammeMondes from '@/components/reviser/ProgrammeMondes'
import { jaugeDesFiches, xpRestantFiche } from '@/lib/reviser/programme'
import {
  chapterStatus,
  crowns,
  subjectProgress,
  type ChapterRow,
} from '@/lib/subject-template'

export const dynamic = 'force-dynamic'

// L'APERÇU DU PROGRAMME EN GRILLE — en développement seulement.
//
// La grille des grands thèmes d'une matière, sans compte : les mêmes
// `ProgrammeMondes` et `SubjectHeader` que l'app, sur le programme de maths de
// 3e et des avancements de démonstration. Les supports d'une fiche dépliée ne
// se chargent pas (ils demandent un élève connecté).
//
//   /dev/programme                 un élève en route (un thème fini, un entamé)
//   /dev/programme?etat=neuf       rien de fait : la carte dit « Commencer »
//   /dev/programme?controle=1      un contrôle annoncé sur Thalès
//   /dev/programme?theme=Espace et géométrie    un thème ouvert
//   /dev/programme?matiere=svt     une autre matière (histoire-geo, francais…)

type Ligne = [theme: string, titre: string, avancement: number]

const MATHS: Ligne[] = [
  ['Nombres et calculs', 'Puissances d’un nombre et écriture scientifique', 1],
  ['Nombres et calculs', 'Nombres premiers et fractions irréductibles', 1],
  ['Nombres et calculs', 'Calcul littéral et équation', 1],
  ['Organisation et gestion de données – Fonctions', 'Caractéristiques d’une série statistique', 0.9],
  ['Organisation et gestion de données – Fonctions', 'Les probabilités', 0.85],
  ['Organisation et gestion de données – Fonctions', 'Comprendre et utiliser la notion de fonction', 1],
  ['Organisation et gestion de données – Fonctions', 'Fonction linéaire et proportionnalité', 0.45],
  ['Organisation et gestion de données – Fonctions', 'Les fonctions affines', 0],
  ['Espace et géométrie', 'Sphère et boule', 0],
  ['Espace et géométrie', 'Sections planes de solides', 0],
  ['Espace et géométrie', 'L’homothétie', 0],
  ['Espace et géométrie', 'Utiliser le théorème de Thalès', 0],
  ['Espace et géométrie', 'Trigonométrie dans un triangle rectangle', 0],
  ['Espace et géométrie', 'Triangles semblables', 0],
  ['Algorithmique et programmation', 'Écrire et tester un programme', 0],
  ['Grandeurs et mesures', 'Grandeurs composées', 0],
  ['Grandeurs et mesures', 'Aires et volumes', 0],
  ['Grandeurs et mesures', 'Effets d’un agrandissement', 0],
  ['Réussir le brevet', 'La méthode de l’épreuve', 0],
]

const AUTRES: Record<string, { nom: string; themes: string[] }> = {
  svt: {
    nom: 'SVT',
    themes: [
      'La dynamique interne de la Terre',
      'Le climat et la météorologie',
      'Diversité et stabilité génétique des êtres vivants',
      'Alimentation et digestion',
      'Système nerveux et comportement responsable',
      'Le monde microbien et la santé',
      'La parenté des êtres vivants',
      'L’exploitation des ressources naturelles',
    ],
  },
  'histoire-geo': {
    nom: 'Histoire-Géo',
    themes: [
      'L’Europe, un théâtre majeur des guerres totales (1914-1945)',
      'Le monde depuis 1945',
      'Françaises et Français dans une République repensée',
      'Dynamiques territoriales de la France contemporaine',
      'Pourquoi et comment aménager le territoire ?',
      'La France et l’Union européenne',
    ],
  },
  francais: {
    nom: 'Français',
    themes: [
      'Se chercher, se construire — Se raconter, se représenter',
      'Vivre en société, participer à la société — Dénoncer les travers de la société',
      'Regarder le monde, inventer des mondes — Visions poétiques du monde',
      'Agir sur le monde — Agir dans la cité : individu et pouvoir',
      'Questionnements complémentaires — Progrès et rêves scientifiques',
    ],
  },
  'physique-chimie': {
    nom: 'Physique-Chimie',
    themes: [
      'L’organisation de la matière dans l’Univers',
      'Les transformations chimiques',
      'Mouvements et interactions',
      'L’énergie : conversion et transferts',
      'Les circuits électriques',
      'Les signaux',
    ],
  },
}

export default async function ApercuProgramme({
  searchParams,
}: {
  searchParams: Promise<{ etat?: string; controle?: string; matiere?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { etat, controle, matiere } = await searchParams
  const autre = matiere ? AUTRES[matiere] : undefined
  const slug = autre ? (matiere as string) : 'maths'
  const lignes: Ligne[] = autre
    ? autre.themes.flatMap((theme, i): Ligne[] => [
        [theme, `Première fiche`, i === 0 ? 1 : i === 1 ? 0.5 : 0],
        [theme, `Deuxième fiche`, i === 0 ? 1 : 0],
      ])
    : MATHS

  const chapters: ChapterRow[] = lignes.map(([theme, titre, avancement], i) => {
    const value = etat === 'neuf' ? 0 : avancement
    return {
      id: `fiche-${i}`,
      position: i + 1,
      title: titre,
      status: chapterStatus(value),
      value,
      crowns: crowns(value),
      href: `/reviser/${slug}/fiche-${i}`,
      examHint:
        controle === '1' && titre.includes('Thalès')
          ? { label: 'Contrôle dans 3 jours', proximity: 'soon' }
          : null,
      minutes: 6 + (i % 3),
      theme,
      discipline: null,
      aQuiz: true,
      quizTeste: value > 0,
      xpRestant: xpRestantFiche({ leconsALire: value > 0 ? 0 : 1, couronnes: crowns(value) }),
    }
  })
  const progress = subjectProgress(chapters.map((c) => c.value))

  return (
    <div>
      <SubjectHeader
        subject={{ slug, name: autre?.nom ?? 'Maths', color: '' }}
        grade="3e"
        progress={progress}
        jauge={jaugeDesFiches(chapters)}
        unit="fiche"
      />
      <div className="mt-5">
        <ProgrammeMondes
          chapters={chapters}
          resume={
            etat === 'neuf' ? null : { chapterId: 'fiche-6', label: 'Dernière session' }
          }
          subjectSlug={slug}
          subjectName={autre?.nom ?? 'Maths'}
          grade="3e"
        />
      </div>
    </div>
  )
}
