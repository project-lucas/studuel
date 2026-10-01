export default {
  slug: 'arts-plastiques',
  titreMigration: 'QUESTIONS EN PLUS — ARTS PLASTIQUES 6e',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: "6e", titre: "La couleur",
      questions: [
        ['Comment obtient-on une couleur tertiaire ?', ['Deux primaires mélangées', 'Du noir ajouté à une primaire', 'Une primaire et une secondaire voisine', 'Deux secondaires opposées'], 2, 'Une couleur tertiaire naît du mélange d’une primaire et d’une secondaire voisine sur le cercle chromatique.'],
        ['Quelle est la complémentaire du jaune ?', ['Le vert', 'Le violet', 'L’orange', 'Le bleu'], 1, 'Jaune et violet se font face sur le cercle chromatique : ce sont des couleurs complémentaires.'],
        ['Que se passe-t-il quand on place deux couleurs complémentaires côte à côte ?', ['Elles se renforcent', 'Elles donnent un gris', 'Elles disparaissent', 'Elles deviennent tertiaires'], 0, 'Côte à côte, elles se renforcent et paraissent plus vives ; mélangées, elles s’éteignent en gris.'],
        ['Une couleur peut être à la fois vive et sombre.', ['Vrai', 'Faux'], 0, 'Valeur (clair ou sombre) et saturation (intensité) sont indépendantes : un rouge profond est vif et sombre.'],
      ],
    },
    {
      niveau: "6e", titre: "La représentation de l’espace",
      questions: [
        ['Combien de points de fuite faut-il pour une vue frontale ?', ['Deux', 'Aucun', 'Trois', 'Un'], 3, 'Une vue frontale n’a qu’un point de fuite ; la vue d’angle en demande deux.'],
        ['Dans le procédé de la taille relative, un objet qui paraît plus petit est…', ['Plus proche', 'Plus lointain', 'Plus sombre', 'Au premier plan'], 1, 'Plus un objet est petit dans l’image, plus on comprend qu’il est loin.'],
        ['Quel artiste utilise la perspective atmosphérique dans les arrière-plans de ses tableaux ?', ['Pablo Picasso', 'Jackson Pollock', 'Max Ernst', 'Léonard de Vinci'], 3, 'Léonard de Vinci pâlit et bleuit les lointains pour créer de la profondeur.'],
        ['Sur quelle ligne se situe le point de fuite ?', ['La ligne d’horizon', 'Le bord du cadre', 'La ligne du sol', 'La diagonale'], 0, 'Le point de fuite se place sur la ligne d’horizon, à hauteur des yeux du spectateur.'],
      ],
    },
    {
      niveau: "6e", titre: "Matières, outils et gestes",
      questions: [
        ['Parmi ces matériaux, lequel est une matière rapportée ?', ['La gouache', 'Le fusain', 'L’aquarelle', 'Un morceau de tissu'], 3, 'Les matières rapportées (papiers, tissus, objets récupérés) sont ajoutées à l’œuvre.'],
        ['Quel artiste est associé au dripping ?', ['Max Ernst', 'Jackson Pollock', 'Claude Monet', 'Auguste Rodin'], 1, 'Jackson Pollock laisse couler et goutter la peinture sur la toile.'],
        ['Le hasard en art est de la négligence.', ['Vrai', 'Faux'], 1, 'Le hasard maîtrisé est une décision : l’artiste provoque l’accident puis choisit de le garder.'],
        ['Quelle famille regroupe le crayon, le fusain et l’encre ?', ['Les traçants', 'Les peintures', 'Les supports', 'Les matières rapportées'], 0, 'Crayon, fusain et encre laissent un trait : ce sont des traçants.'],
      ],
    },
  ],
}
