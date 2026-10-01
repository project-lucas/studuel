export default {
  slug: 'musique',
  titreMigration: 'QUESTIONS EN PLUS — MUSIQUE 6e',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: "6e", titre: "Les paramètres du son",
      questions: [
        ['Dans quelle unité mesure-t-on la fréquence d’un son ?', ['Le décibel', 'Le hertz', 'Le mètre', 'La seconde'], 1, 'La fréquence se mesure en hertz (Hz) : plus elle est élevée, plus le son est aigu.'],
        ['Une blanche dure quelle fraction d’une ronde ?', ['Le quart', 'Le double', 'Le tiers', 'La moitié'], 3, 'Chaque figure de note vaut la moitié de la précédente : ronde, blanche, noire, croche.'],
        ['Que signifie la nuance « piano » ?', ['Doux', 'Fort', 'Très fort', 'Moyennement fort'], 0, 'Piano indique une intensité douce ; forte indique un son fort.'],
        ['D’où vient le timbre d’un instrument ?', ['De la durée des notes', 'De la fréquence jouée', 'Des harmoniques qu’il produit', 'Du volume choisi'], 2, 'Le timbre vient des harmoniques produites par l’instrument : c’est ce qui distingue une flûte d’un violon sur la même note.'],
      ],
    },
    {
      niveau: "6e", titre: "La voix et les familles d’instruments",
      questions: [
        ['Lequel de ces instruments est une percussion déterminée ?', ['La caisse claire', 'Les cymbales', 'Le xylophone', 'Le triangle'], 2, 'Le xylophone produit des hauteurs précises ; caisse claire, cymbales et triangle n’ont pas de hauteur définie.'],
        ['Quelle est la voix d’homme la plus grave ?', ['Le ténor', 'Le baryton', 'L’alto', 'La basse'], 3, 'Les voix d’hommes, de la plus aiguë à la plus grave, sont le ténor, le baryton et la basse.'],
        ['Lequel de ces instruments appartient à la famille des cuivres ?', ['Le trombone', 'Le hautbois', 'La clarinette', 'Le basson'], 0, 'Chez les cuivres (trompette, cor, trombone, tuba), le son naît de la vibration des lèvres.'],
        ['La guitare est un instrument à cordes frottées.', ['Vrai', 'Faux'], 1, 'La guitare est à cordes pincées, comme la harpe ; les cordes frottées utilisent un archet.'],
      ],
    },
    {
      niveau: "6e", titre: "Rythme, pulsation et tempo",
      questions: [
        ['Quelle indication de tempo signifie « très rapide » ?', ['Largo', 'Adagio', 'Andante', 'Presto'], 3, 'Presto est l’indication de tempo la plus rapide ; largo est la plus lente.'],
        ['À combien de temps la marche est-elle le plus souvent mesurée ?', ['3 temps', '2 temps', '4 temps', '6 temps'], 1, 'La mesure à 2 temps correspond à la marche ; à 3 temps, c’est la valse.'],
        ['Comment appelle-t-on l’organisation des durées posée par-dessus la pulsation ?', ['Le rythme', 'Le tempo', 'La mesure', 'La nuance'], 0, 'Le rythme dessine une figure de notes longues et courtes sur la pulsation, qui est le battement régulier.'],
        ['Que signifie l’indication « adagio » ?', ['Vif', 'Très rapide', 'Lent', 'Très lent'], 2, 'Adagio désigne un tempo lent, plus rapide que largo et plus lent qu’andante.'],
      ],
    },
  ],
}
