// -----------------------------------------------------------------------------
// CE QUE PÈSE CHAQUE MATIÈRE À L'ÉPREUVE.
//
// `lib/exams.ts` dit QUELLES matières sont à l'examen. Ce module dit COMBIEN
// chacune y compte — et c'est ce chiffre qui transforme le diagramme de /moi
// d'une statistique en un verdict. « Tu as fait 4 h de maths » n'apprend rien ;
// « tu donnes 40 % de ton temps à une matière qui pèse 33 % de ton brevet » se
// lit en une seconde.
//
// ⚠️ CES BARÈMES CHANGENT AUX RÉFORMES. Ils sont réunis ICI, dans un seul
// fichier, précisément pour qu'une réforme se règle en un endroit et non en
// quinze. Chaque table porte la session à laquelle elle correspond : les
// revérifier au Bulletin officiel avant chaque rentrée, et corriger la date.
//
// LES POIDS SONT DES PARTS, PAS DES POINTS. On les écrit en points bruts (c'est
// ainsi qu'ils sont publiés et donc vérifiables), et `weightsForGrade` les
// normalise. Deux matières à 100 points sur un total de 300 valent chacune un
// tiers, quelle que soit l'échelle choisie par le ministère l'année suivante.
// -----------------------------------------------------------------------------

/** Points bruts d'une matière à son épreuve, par slug de `subjects`. */
export type ExamPoints = Record<string, number>

/**
 * BREVET (3e) — épreuves ÉCRITES, session 2025.
 *
 * Français 100 · Maths 100 · Histoire-Géo-EMC 50 · Sciences 50.
 *
 * Deux partis pris, assumés et à connaître avant de corriger ce tableau :
 *
 *   · L'épreuve de SCIENCES vaut 50 points pour DEUX disciplines tirées au sort
 *     parmi SVT, physique-chimie et technologie. On les compte 25 chacune :
 *     l'élève ne sait pas d'avance laquelle tombera, et lui afficher 50 sur une
 *     matière puis 0 sur l'autre l'enverrait réviser la mauvaise.
 *
 *   · L'ORAL (100 points) et le CONTRÔLE CONTINU (400 points) sont EXCLUS. Ils
 *     ne se révisent pas par matière dans l'app — les intégrer diluerait chaque
 *     part sans rien apprendre à personne. Le diagramme compare donc des parts
 *     d'ÉCRIT, et son libellé doit le dire.
 */
const BREVET: ExamPoints = {
  francais: 100,
  maths: 100,
  'histoire-geo': 50,
  svt: 25,
  'physique-chimie': 25,
}

/**
 * BAC DE FRANÇAIS (1re) — épreuve anticipée, écrit 5 + oral 5.
 *
 * ⚠️ UNE SEULE MATIÈRE, DONC AUCUNE COMPARAISON POSSIBLE. Le français y pèse
 * 100 % du bloc par construction : opposer sa part de temps à son poids
 * reviendrait à dire à tout élève de 1re qu'il ne travaille pas assez le
 * français, quoi qu'il fasse. `weightsForGrade` renvoie donc bien ce poids,
 * mais `lib/effort.ts` détecte le cas « une seule matière à l'épreuve » et
 * bascule sur un autre discours (cf. `EffortDiagram.regime`).
 */
const BAC_FRANCAIS: ExamPoints = { francais: 10 }

/**
 * BAC GÉNÉRAL (Tle) — coefficients des ÉPREUVES FINALES (60 % du bac).
 *
 * Spécialité 1 : 16 · Spécialité 2 : 16 · Grand oral : 10 · Philosophie : 8.
 * (Le français, coefficient 10, s'est joué en 1re : il n'est plus à réviser.)
 *
 * LES SPÉCIALITÉS NE SONT PAS CONNUES ICI — elles dépendent de l'élève. Le
 * coefficient 16 est donc posé sur la CATÉGORIE `specialite` du catalogue par
 * `weightsForGrade`, qui reçoit les matières du profil.
 *
 * ⚠️ ET SURTOUT : en terminale, AUCUNE MATIÈRE NE PÈSE ZÉRO. Le contrôle
 * continu vaut 40 % du bac et il est fait exactement des matières du second
 * bloc — histoire-géo, langues, enseignement scientifique, EPS, EMC, plus la
 * spécialité abandonnée en 1re. Elles reçoivent donc un poids résiduel plutôt
 * que rien, et le bloc du bas ne s'appelle jamais « secondaire ».
 */
const BAC_PHILO = 8
const BAC_GRAND_ORAL = 10
const BAC_SPECIALITE = 16
/** Poids résiduel d'une matière de contrôle continu, en points de la même échelle. */
const CONTROLE_CONTINU = 4

/** Matière du catalogue, réduite à ce dont ce module a besoin. */
export type WeighedSubject = { slug: string; category?: string | null }

/**
 * Le poids de chaque matière pour ce niveau, en points bruts.
 *
 * Renvoie une table VIDE quand le niveau n'a pas d'épreuve (6e → 4e, 2de) : le
 * diagramme se replie alors sur un seul bloc trié par effort, sans repères. Une
 * table vide est un cas normal, pas une panne.
 */
export function weightsForGrade(
  grade: string,
  subjects: WeighedSubject[] = [],
): ExamPoints {
  if (grade === '3e') return { ...BREVET }
  if (grade === '1re' || grade === '1re techno') return { ...BAC_FRANCAIS }

  if (grade === 'Terminale' || grade === 'Tle' || grade === 'Tle techno') {
    const points: ExamPoints = {
      philosophie: BAC_PHILO,
      'grand-oral': BAC_GRAND_ORAL,
    }
    for (const s of subjects) {
      if (s.slug in points) continue
      points[s.slug] =
        s.category === 'specialite' ? BAC_SPECIALITE : CONTROLE_CONTINU
    }
    return points
  }

  return {}
}

/**
 * Ce niveau a-t-il une épreuve dont les poids se comparent ?
 *
 * Faux quand il n'y a aucune épreuve, ET quand il n'y en a qu'UNE seule — le
 * cas du bac de français en 1re, où la comparaison est vide de sens.
 */
export function weightsAreComparable(points: ExamPoints): boolean {
  return Object.keys(points).length > 1
}
