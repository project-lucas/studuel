export default {
  slug: 'latin',
  titreMigration: 'QUESTIONS EN PLUS — LATIN 5e',
  motif: `Deux questions de plus par quiz : dix suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: "5e", titre: "Premiers pas : les déclinaisons",
      questions: [
        ['Quel est l’accusatif pluriel de « rosa » ?', ['rosae', 'rosis', 'rosas', 'rosarum'], 2, 'À l’accusatif pluriel, la 1re déclinaison prend -as : « rosas ». « rosarum » est le génitif pluriel, « rosis » le datif et l’ablatif.'],
        ['Comment obtient-on le radical de « rosa, rosae » ?', ['En retirant -ae du génitif', 'En ajoutant -ae au nominatif', 'En retirant la première lettre', 'En ajoutant -is à l’ablatif'], 0, 'On enlève la terminaison -ae du génitif singulier : il reste « ros- », auquel on ajoute les terminaisons du tableau.'],
      ],
    },
    {
      niveau: "5e", titre: "La vie quotidienne à Rome",
      questions: [
        ['Comment appelle-t-on les grands immeubles où s’entasse le peuple ?', ['Les domus', 'Les insulae', 'Les thermes', 'Les tablina'], 1, 'Les riches habitent une domus, le peuple s’entasse dans des insulae, de grands immeubles collectifs.'],
        ['Comment s’appelle la sauce de poisson appréciée des Romains ?', ['La cena', 'La stola', 'Le compluvium', 'Le garum'], 3, 'Le garum est une sauce de poisson très utilisée en cuisine romaine. La cena est le repas du soir, et la stola un vêtement féminin.'],
      ],
    },
    {
      niveau: "5e", titre: "La fondation de Rome",
      questions: [
        ['Sur quel fleuve les jumeaux sont-ils abandonnés dans un panier ?', ['Sur le Nil', 'Sur le Rhône', 'Sur le Tibre', 'Sur le Rhin'], 2, 'Selon la légende, Romulus et Remus sont abandonnés sur le Tibre, le fleuve de Rome, où une louve les recueille.'],
        ['Comment les archéologues expliquent-ils la naissance de Rome ?', ['Par le regroupement de villages sur des collines', 'Par la décision d’un roi en une seule journée', 'Par une invasion venue de Grèce', 'Par la construction d’un grand temple'], 0, 'Rome est née peu à peu du rapprochement de villages installés sur des collines au bord du Tibre : la légende de 753 av. J.-C. est un mythe.'],
      ],
    },
  ],
}
