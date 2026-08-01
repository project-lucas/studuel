// Les fonctions de Marcel : ce qu'il sait faire, et comment on y accède.
//
// Avant, une barre de CINQ filtres en haut de l'onglet partageait l'écran entre
// « Aujourd'hui », « Méthode », « L'oral », « S'entraîner » et « Progrès ». Sur
// un téléphone de 390 px, ça faisait 66 px et 11,5 px de texte par bouton : cinq
// pavés de même forme, distingués par la seule couleur, portant des mots
// abstraits. Lucas, qui a écrit l'app, ne savait pas où cliquer — un élève de
// 3e encore moins.
//
// Le sélecteur est donc remplacé par un HUB : la page EST « aujourd'hui » (le
// point du jour, la séance), et les quatre autres fonctions deviennent des
// tuiles qui disent chacune ce qu'on trouve derrière. Le paramètre d'URL
// (`?vue=`) ne bouge pas : il reste partageable, compatible bouton retour, et
// laisse la page en composant serveur.
//
// Aucune icône ici : ce module reste pur (il est testé sans React). La
// correspondance vue → icône vit dans le composant qui dessine les tuiles.

export type MarcelVue =
  | 'aujourdhui'
  | 'methode'
  | 'oral'
  | 'entrainement'
  | 'progres'

/** Une vue autre que l'accueil : celles qui deviennent des tuiles. */
export type MarcelVueSecondaire = Exclude<MarcelVue, 'aujourdhui'>

export type MarcelEntree = {
  key: MarcelVueSecondaire
  /** Le mot court, aussi utilisé comme titre de la sous-page. */
  label: string
  /** La ligne qui dit ce qu'on trouve derrière — c'est elle qui lève le doute. */
  hint: string
}

// « L'oral » est placé APRÈS « Méthode » et avant « S'entraîner » : c'est un
// entraînement, mais d'une autre nature — on n'y répond pas à des questions, on
// y parle. Le mettre en dernier l'aurait enterré, alors que c'est le seul
// exercice que les élèves ne font jamais seuls et qui décide de trois épreuves
// du bac et du brevet.
export const MARCEL_ENTREES: MarcelEntree[] = [
  {
    key: 'methode',
    label: 'Méthode',
    hint: 'Comment on travaille chaque matière',
  },
  {
    key: 'oral',
    label: 'L’oral',
    hint: 'Répéter à voix haute, sans être noté',
  },
  {
    key: 'entrainement',
    label: 'S’entraîner',
    hint: 'Un contrôle chronométré par matière',
  },
  {
    key: 'progres',
    label: 'Progrès',
    hint: 'Où tu en es du programme',
  },
]

/** Normalise le paramètre d'URL (valeur inconnue → l'accueil). */
export function parseVue(raw: string | undefined): MarcelVue {
  if (raw === 'aujourdhui') return 'aujourdhui'
  return MARCEL_ENTREES.some((e) => e.key === raw) ? (raw as MarcelVue) : 'aujourdhui'
}

/**
 * Le titre affiché en haut d'une sous-page, à côté de la flèche de retour.
 * L'accueil n'en a pas besoin : son contenu se présente tout seul.
 */
export function titreVue(vue: MarcelVue): string | null {
  return MARCEL_ENTREES.find((e) => e.key === vue)?.label ?? null
}

/**
 * Le lien d'une vue. La matière courante suit d'un écran à l'autre — sans ça,
 * ouvrir « Méthode » depuis un point du jour en maths retombait sur la première
 * matière de la liste.
 */
export function vueHref(vue: MarcelVue, matiere?: string | null): string {
  if (vue === 'aujourdhui') return '/marcel'
  const query = new URLSearchParams({ vue })
  if (matiere) query.set('matiere', matiere)
  return `/marcel?${query.toString()}`
}
