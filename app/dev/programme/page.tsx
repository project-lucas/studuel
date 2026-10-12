import { notFound } from 'next/navigation'
import ApercuDossier from './ApercuDossier'
import { bossForSubject } from '@/lib/bosses'
import { construireCahierMatiere } from '@/lib/exercices/cahier-matiere'
import { xpRestantFiche } from '@/lib/reviser/programme'
import { suiteDeFiche } from '@/lib/reviser/suite'
import {
  chapterStatus,
  crowns,
  disciplinesOf,
  modeFromParam,
  modesFor,
  subjectProgress,
  type ChapterRow,
  type SubjectProgress,
  type SubjectTemplateData,
} from '@/lib/subject-template'

export const dynamic = 'force-dynamic'

// L'APERÇU DU DOSSIER DE MATIÈRE — en développement seulement.
//
// Le vrai gabarit (`SubjectTemplate` : la bannière, le rail de portes, le
// sommaire, le cahier), sans compte, sur des programmes de démonstration. Les
// supports d'une fiche dépliée ne se chargent pas (ils demandent un élève
// connecté) ; le cahier d'exercices, lui, est déposé d'avance.
//
//   /dev/programme                     maths 3e, un élève en route
//   /dev/programme?etat=neuf           rien de fait : la bannière dit « Commencer »
//   /dev/programme?etat=fini           tout est terminé
//   /dev/programme?controle=1          un contrôle annoncé (Thalès, en maths)
//   /dev/programme?theme=Espace et géométrie    un thème ouvert à l'arrivée
//   /dev/programme?matiere=francais    français 1re : quatre rayons
//   /dev/programme?matiere=histoire-geo  deux disciplines et l'encyclopédie
//   /dev/programme?matiere=philosophie   une liste à plat, sans numéros
//   /dev/programme?matiere=svt         (physique-chimie, enseignement-scientifique)
//   /dev/programme?onglet=exercices    une porte ouverte (jeu, annales, programme:fiches)
//   /dev/programme?premium=1           un abonné Studuel+ (plus de couronne)
//   /dev/programme?gardien=1           le gardien de la matière rôde (son écusson)
//   /dev/programme?gardien=sorti       il est sorti : la bulle sur la porte Jeux
//   /dev/programme?place=1             la place de l'élève (« Top 10 % des 3e »)

type Ligne = { theme: string | null; titre: string; avancement: number; rayon?: string }

const l = (theme: string | null, titre: string, avancement = 0, rayon?: string): Ligne => ({
  theme,
  titre,
  avancement,
  rayon,
})

const MATHS: Ligne[] = [
  l('Nombres et calculs', 'Puissances d’un nombre et écriture scientifique', 1),
  l('Nombres et calculs', 'Nombres premiers et fractions irréductibles', 1),
  l('Nombres et calculs', 'Calcul littéral et équation', 1),
  l('Organisation et gestion de données – Fonctions', 'Caractéristiques d’une série statistique', 0.9),
  l('Organisation et gestion de données – Fonctions', 'Les probabilités', 0.85),
  l('Organisation et gestion de données – Fonctions', 'Comprendre et utiliser la notion de fonction', 1),
  l('Organisation et gestion de données – Fonctions', 'Fonction linéaire et proportionnalité', 0.45),
  l('Organisation et gestion de données – Fonctions', 'Les fonctions affines'),
  l('Espace et géométrie', 'Sphère et boule'),
  l('Espace et géométrie', 'Sections planes de solides'),
  l('Espace et géométrie', 'L’homothétie'),
  l('Espace et géométrie', 'Utiliser le théorème de Thalès'),
  l('Espace et géométrie', 'Trigonométrie dans un triangle rectangle'),
  l('Espace et géométrie', 'Triangles semblables'),
  l('Algorithmique et programmation', 'Écrire et tester un programme'),
  l('Grandeurs et mesures', 'Grandeurs composées'),
  l('Grandeurs et mesures', 'Aires et volumes'),
  l('Grandeurs et mesures', 'Effets d’un agrandissement'),
  l('Réussir le brevet', 'La méthode de l’épreuve'),
]

/** Le français de 1re : quatre rayons, le cas le plus chargé. */
const FRANCAIS: Ligne[] = [
  l('La poésie du XIXe au XXIe siècle', 'Rimbaud, Cahier de Douai', 0.9, 'programme'),
  l('La poésie du XIXe au XXIe siècle', 'Ponge, La rage de l’expression', 0.3, 'programme'),
  l('La poésie du XIXe au XXIe siècle', 'Dorion, Mes forêts', 0, 'programme'),
  l('La poésie du XIXe au XXIe siècle', 'Lire et commenter un poème', 0, 'programme'),
  l('La littérature d’idées du XVIe au XVIIIe siècle', 'Rabelais, Gargantua', 0, 'programme'),
  l('La littérature d’idées du XVIe au XVIIIe siècle', 'La Bruyère, Les Caractères', 0, 'programme'),
  l('La littérature d’idées du XVIe au XVIIIe siècle', 'Olympe de Gouges, Déclaration des droits de la femme et de la citoyenne', 0, 'programme'),
  l('Le roman et le récit du Moyen Âge au XXIe siècle', 'Prévost, Manon Lescaut', 0, 'programme'),
  l('Le roman et le récit du Moyen Âge au XXIe siècle', 'Balzac, La Peau de chagrin', 0, 'programme'),
  l('Le roman et le récit du Moyen Âge au XXIe siècle', 'Colette, Sido', 0, 'programme'),
  l('Le théâtre du XVIIe au XXIe siècle', 'Corneille, Le Menteur', 0, 'programme'),
  l('Le théâtre du XVIIe au XXIe siècle', 'Musset, On ne badine pas avec l’amour', 0, 'programme'),
  l('Le théâtre du XVIIe au XXIe siècle', 'Sarraute, Pour un oui ou pour un non', 0, 'programme'),
  ...['Antigone, Jean Anouilh', 'Candide, Voltaire', 'Le Cid, Pierre Corneille', 'Les Fleurs du mal, Charles Baudelaire', 'L’Étranger, Albert Camus', 'Germinal, Émile Zola', 'Le Horla, Guy de Maupassant', 'Phèdre, Jean Racine', 'Le Rouge et le Noir, Stendhal', 'Zazie dans le métro, Raymond Queneau'].map(
    (titre) => l('Fiches de lecture', titre, 0, 'fiches'),
  ),
  l('La phrase', 'Les propositions subordonnées', 0, 'grammaire'),
  l('La phrase', 'L’interrogation', 0, 'grammaire'),
  l('Le verbe', 'La négation', 0, 'grammaire'),
  l('Le verbe', 'Les valeurs des temps', 0, 'grammaire'),
  l('Œuvres des sessions passées', 'Molière, Le Malade imaginaire', 0, 'anciens'),
  l('Œuvres des sessions passées', 'Hugo, Les Contemplations', 0, 'anciens'),
]

const HISTOIRE_GEO: Ligne[] = [
  l('L’Europe, un théâtre majeur des guerres totales (1914-1945)', 'Civils et militaires dans la Première Guerre mondiale', 1, 'histoire'),
  l('L’Europe, un théâtre majeur des guerres totales (1914-1945)', 'Démocraties fragilisées et expériences totalitaires', 0.5, 'histoire'),
  l('L’Europe, un théâtre majeur des guerres totales (1914-1945)', 'La Deuxième Guerre mondiale, une guerre d’anéantissement', 0, 'histoire'),
  l('Le monde depuis 1945', 'Indépendances et construction de nouveaux États', 0, 'histoire'),
  l('Le monde depuis 1945', 'Un monde bipolaire au temps de la guerre froide', 0, 'histoire'),
  l('Dynamiques territoriales de la France contemporaine', 'Les aires urbaines', 0, 'geographie'),
  l('Dynamiques territoriales de la France contemporaine', 'Les espaces productifs et leurs évolutions', 0, 'geographie'),
  l('Pourquoi et comment aménager le territoire ?', 'Aménager pour répondre aux inégalités', 0, 'geographie'),
]

/** Une liste à plat, sans thème ni numéro : les notions n'ont pas d'ordre. */
const PHILOSOPHIE: Ligne[] = ['La conscience', 'L’inconscient', 'Le bonheur', 'Le devoir', 'La liberté', 'La justice', 'L’État', 'La vérité', 'La raison', 'Le langage', 'L’art', 'Le travail', 'La technique', 'La nature', 'La religion', 'Le temps', 'La science'].map(
  (titre, i) => l(null, titre, i === 0 ? 1 : i === 1 ? 0.4 : 0),
)

const deuxParTheme = (themes: string[]): Ligne[] =>
  themes.flatMap((theme, i) => [
    l(theme, 'Première fiche', i === 0 ? 1 : i === 1 ? 0.5 : 0),
    l(theme, 'Deuxième fiche', i === 0 ? 1 : 0),
  ])

const DOSSIERS: Record<string, { nom: string; color: string; classe: string; lignes: Ligne[] }> = {
  maths: { nom: 'Maths', color: 'blue', classe: '3e', lignes: MATHS },
  francais: { nom: 'Français', color: 'red', classe: '1re', lignes: FRANCAIS },
  'histoire-geo': { nom: 'Histoire-Géo', color: 'orange', classe: '3e', lignes: HISTOIRE_GEO },
  philosophie: { nom: 'Philosophie', color: 'purple', classe: 'Tle', lignes: PHILOSOPHIE },
  svt: {
    nom: 'SVT',
    color: 'green',
    classe: '3e',
    lignes: deuxParTheme([
      'La dynamique interne de la Terre',
      'Le climat et la météorologie',
      'Diversité et stabilité génétique des êtres vivants',
      'Alimentation et digestion',
      'Système nerveux et comportement responsable',
    ]),
  },
  'physique-chimie': {
    nom: 'Physique-Chimie',
    color: 'teal',
    classe: '3e',
    lignes: deuxParTheme([
      'L’organisation de la matière dans l’Univers',
      'Les transformations chimiques',
      'Mouvements et interactions',
      'L’énergie : conversion et transferts',
    ]),
  },
  'enseignement-scientifique': {
    nom: 'Enseignement scientifique',
    color: 'indigo',
    classe: '1re',
    lignes: deuxParTheme(['Une longue histoire de la matière', 'Le Soleil, notre source d’énergie']),
  },
}

export default async function ApercuProgramme({
  searchParams,
}: {
  searchParams: Promise<{
    etat?: string
    controle?: string
    matiere?: string
    onglet?: string
    theme?: string
    premium?: string
    gardien?: string
    place?: string
  }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { etat, controle, matiere, onglet, theme, premium, gardien, place } = await searchParams
  const slug = matiere && DOSSIERS[matiere] ? matiere : 'maths'
  const dossier = DOSSIERS[slug]

  const chapters: ChapterRow[] = dossier.lignes.map((ligne, i) => {
    const value = etat === 'neuf' ? 0 : etat === 'fini' ? 1 : ligne.avancement
    const id = `fiche-${i}`
    return {
      id,
      position: i + 1,
      title: ligne.titre,
      status: chapterStatus(value),
      value,
      crowns: crowns(value),
      href: `/reviser/${slug}/${id}`,
      examHint:
        controle === '1' && (ligne.titre.includes('Thalès') || ligne.titre.includes('Musset'))
          ? { label: 'Contrôle dans 3 jours', proximity: 'soon' }
          : null,
      minutes: 6 + (i % 4),
      theme: ligne.theme,
      discipline: ligne.rayon ?? null,
      aQuiz: true,
      quizTeste: value > 0,
      xpRestant: xpRestantFiche({ leconsALire: value > 0 ? 0 : 1, couronnes: crowns(value) }),
      suite: suiteDeFiche({
        subjectSlug: slug,
        chapterId: id,
        lecons: [{ id: 'lecon', lue: value > 0, quizId: `quiz-${i}`, meilleur: value > 0 ? value : null }],
        terminee: chapterStatus(value) === 'complete',
      }),
    }
  })

  const disciplines = disciplinesOf(chapters)
  const progressByDiscipline: Record<string, SubjectProgress> = {}
  for (const discipline of disciplines) {
    progressByDiscipline[discipline] = subjectProgress(
      chapters.filter((c) => c.discipline === discipline).map((c) => c.value),
    )
  }

  // Le cahier de démonstration : trois exercices par fiche, les deux premiers
  // de la première fiche réussis.
  const cahier = construireCahierMatiere({
    matiere: slug,
    chapitres: chapters.map((c) => ({ id: c.id, titre: c.title, theme: c.theme })),
    exercices: chapters.flatMap((c) =>
      ([1, 2, 3] as const).map((position) => ({
        id: `${c.id}-${position}`,
        chapitreId: c.id,
        position,
        etoiles: position,
        titre: `${c.title} — exercice ${position}`,
      })),
    ),
    reussis: new Set(etat === 'neuf' ? [] : ['fiche-0-1', 'fiche-0-2']),
  })

  const enCours = chapters.find((c) => c.status === 'en_cours')
  const data: SubjectTemplateData = {
    subject: { slug, name: dossier.nom, color: dossier.color },
    premium: premium === '1',
    grade: dossier.classe,
    gradeLevel: dossier.classe,
    standing: place === '1' ? { kind: 'pourcentage', side: 'top', value: 10, raw: 0.08 } : null,
    progress: subjectProgress(chapters.map((c) => c.value)),
    progressByDiscipline,
    resume: enCours ? { chapterId: enCours.id, label: 'Dernière session' } : null,
    examOnTop: false,
    weakCount: 0,
    chapters,
    bossPool: [],
    gardien: gardien
      ? {
          boss: bossForSubject(slug),
          subject: dossier.nom,
          subjectSlug: slug,
          status: gardien === 'sorti' ? 'debusque' : 'traque',
          points: 60,
          ratio: gardien === 'sorti' ? 1 : 0.6,
          percent: gardien === 'sorti' ? 100 : 60,
          rank: 1,
          attempts: 0,
          enChasse: true,
          backOn: null,
          remainingMs: gardien === 'sorti' ? 43 * 60_000 : 0,
          endsAt: null,
          hint: '10 cartes de plus',
          xp: 30,
        }
      : null,
    papers: [],
    annalesCorrigees: [],
    cahier: { total: cahier.total },
    themeOuvert: theme ?? null,
  }

  return (
    <ApercuDossier
      data={data}
      initialMode={modeFromParam(onglet, modesFor(dossier.classe, disciplines, slug, true))}
      cahier={cahier}
    />
  )
}
