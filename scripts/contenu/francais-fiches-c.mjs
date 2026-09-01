// Français — PREMIÈRE : le rayon « Fiches de lecture » (3/5).
//
// SUITE DE `francais-fiches-b.mjs`. Même format court, même rayon « fiches »,
// mêmes titres portant l'auteur (ce qui évite la collision avec les fiches du
// rayon Programme, `chapters` étant UNIQUE(subject_id, level, title)).
//
// LES POSITIONS REPRENNENT À 152 : les modules A et B occupent 100 à 203. L'ordre
// alphabétique de la maquette est ainsi celui de la page, qui trie par
// `position`.
//
// AUCUN MÉNAGE ICI : il est joué par la 259, à exécuter AVANT.

export default {
  slug: 'francais',
  nom: 'Français',

  titreMigration: 'FRANÇAIS 1re — FICHES DE LECTURE (3/5) : La Ferme des animaux → Le Tartuffe',

  motif: `TROISIÈME TRANCHE DES FICHES DE LECTURE (voir la 261 pour le détail du
rayon et de son format). Cinquante-deux œuvres, de La Ferme des animaux au Tartuffe.

Les positions reprennent à 204, derrière les 104 fiches des 261 et 262 : l'ordre
alphabétique de la maquette est celui de la page, qui trie par position.

⚠️ ORDRE D'EXÉCUTION : la 259 D'ABORD (colonnes theme et discipline, ménage
des composites). Cette migration n'écrit que des fiches neuves.`,

  blocs: [
    {
      niveaux: ['1re'],
      rayon: 'fiches',
      axe: 'Fiches de lecture',
      positionDepart: 204,
      chapitres: [
        {
          titre: 'La Ferme des animaux, George Orwell',
          lecon: {
            titre: 'Orwell, 1945 — la révolution confisquée',
            cours: `## L’histoire
Les animaux de la ferme du **Manoir**, menés par les **cochons**, chassent le fermier ivrogne **Jones** et fondent la **Ferme des animaux**, régie par **sept commandements**.

> Le dernier : « **Tous les animaux sont égaux.** »

| Personnage | Son rôle |
| **Sage l’Ancien** | Le vieux sage : il **donne l’élan** |
| **Boule de Neige** | Orateur et **bâtisseur** — il sera **expulsé** |
| **Napoléon** | Il élève **secrètement des chiens** et prend le pouvoir |
| **Brille-Babil** | La **propagande** |
| **Malabar**, le cheval | Travailleur infatigable — « je vais **travailler plus dur** » — **vendu à l’équarrisseur** |

| L’engrenage | Ce qui se passe |
| Les commandements sont **réécrits nuitamment** | Jusqu’au dernier : « Tous les animaux sont égaux, **mais certains sont plus égaux que d’autres** » |
| La fin | Les cochons **marchent sur deux pattes** et **dînent avec les fermiers** : **on ne les distingue plus** |

## À retenir
**Apologue politique** publié en **1945**, **transparent**.

| L’allégorie | Ce qu’elle vise |
| La **révolution russe** | Lénine, **Trotski**, **Staline** |
| Les **procès** et la **propagande** | Brille-Babil |
| La **réécriture de l’histoire** | Les commandements repeints |

> Orwell, **socialiste**, vise le **totalitarisme** — **non la révolte elle-même**. La forme **animalière** rend la démonstration **implacable**.

> « Tous les animaux sont égaux, mais certains sont plus égaux que d’autres. »`,
          },
          questions: [
            ['Que font les animaux au début du récit ?', ['Ils chassent le fermier et fondent leur propre ferme', 'Ils fuient dans la forêt', 'Ils obéissent à un nouveau maître', 'Ils construisent un moulin'], 0, 'Sept commandements sont peints sur le mur de la grange.'],
            ['Quels deux cochons se disputent le pouvoir ?', ['Boule de Neige et Napoléon', 'Malabar et Douce', 'Sage l’Ancien et Brille-Babil', 'Jones et Napoléon'], 0, 'Napoléon élève secrètement des chiens pour expulser son rival.'],
            ['Que devient Malabar, le cheval ?', ['Il est vendu à l’équarrisseur', 'Il devient chef de ferme', 'Il s’enfuit', 'Il est libéré'], 0, 'Le travailleur dévoué est sacrifié par le régime qu’il a servi.'],
            ['Comment le dernier commandement est-il réécrit ?', ['« Tous les animaux sont égaux, mais certains sont plus égaux que d’autres »', '« Le travail rend libre »', '« Quatre pattes, oui ; deux pattes, non »', '« Napoléon a toujours raison »'], 0, 'La réécriture nocturne des lois est le cœur de la satire.'],
            ['Quel événement historique l’apologue transpose-t-il ?', ['La révolution russe et sa confiscation par Staline', 'La Révolution française', 'La guerre d’Espagne', 'La révolution industrielle'], 0, 'Orwell, socialiste, vise le totalitarisme, non la révolte.'],
            ['À la fin, les cochons restent distincts des hommes.', ['Vrai', 'Faux'], 1, 'Les animaux regardent par la fenêtre et ne peuvent plus les distinguer.'],
          ],
        },
        {
          titre: 'La Guerre de Troie n’aura pas lieu, Jean Giraudoux',
          lecon: {
            titre: 'Giraudoux, 1935 — tout faire pour éviter la guerre',
            cours: `## L’histoire
Deux actes.

| Camp | Qui | Ce qu’il veut |
| Pour la **paix** | **Hector**, rentré victorieux | Fermer les portes de la guerre : il obtient qu’on **rende Hélène** |
| — | **Andromaque**, enceinte | Elle supplie |
| — | **Ulysse**, ambassadeur grec | Il **accepte de repartir avec Hélène** |
| Pour la **guerre** | Le vieux **Priam**, le poète **Demokos**, les vieillards | Pour la **beauté d’Hélène** et pour la **gloire** |
| Le destin | **Cassandre** | Elle **annonce** |

| Le basculement | Ce qui se passe |
| Alors qu’ils ont **réussi** | L’ivrogne **Ajax gifle Hector** |
| **Demokos** crie au **viol d’Hélène** | Hector **le tue** |
| Mourant, Demokos **accuse Ajax** | La foule **se soulève** |
| La fin | **Les portes de la guerre s’ouvrent** |

## À retenir
Créée en **1935**, entre **Hitler au pouvoir** et **Munich**.

> La pièce dit l’angoisse d’une génération : **la guerre arrive par les mots, la vanité et le hasard — non par nécessité**.

Le dialogue **Hector-Ulysse** est un **sommet du théâtre politique français**. Le titre est **ironique** : **le spectateur sait dès le départ que la guerre aura lieu**.

> « Le privilège des grands, c’est de voir les catastrophes d’une terrasse. »`,
          },
          questions: [
            ['Que veut Hector au début de la pièce ?', ['Empêcher la guerre en rendant Hélène', 'Venger l’enlèvement d’Hélène', 'Prendre le pouvoir à Troie', 'Partir en exil'], 0, 'Il veut fermer les portes de la guerre.'],
            ['Qui pousse à la guerre dans Troie ?', ['Demokos, les vieillards et une partie de la cour', 'Andromaque', 'Ulysse', 'Cassandre'], 0, 'Ils invoquent la beauté d’Hélène et la gloire.'],
            ['Que se passe-t-il entre Hector et Ulysse ?', ['Ils s’accordent lucidement pour éviter la guerre', 'Ils se battent en duel', 'Ils rompent les négociations', 'Ulysse refuse de parler'], 0, 'Leur dialogue est un sommet du théâtre politique français.'],
            ['Quel incident déclenche finalement la guerre ?', ['Le meurtre de Demokos, faussement imputé à Ajax', 'La fuite d’Hélène', 'Un oracle de Cassandre', 'L’arrivée de l’armée grecque'], 0, 'La guerre arrive par les mots, la vanité et le hasard.'],
            ['En quelle année la pièce a-t-elle été créée ?', ['1935', '1914', '1945', '1925'], 0, 'Entre l’arrivée d’Hitler au pouvoir et Munich.'],
            ['Le titre annonce sincèrement que la guerre sera évitée.', ['Vrai', 'Faux'], 1, 'Il est ironique : le spectateur connaît d’avance l’issue.'],
          ],
        },
        {
          titre: 'La jalousie du Barbouillé, Molière',
          lecon: {
            titre: 'Molière, vers 1660 — la farce à l’état pur',
            cours: `## La pièce
Une **farce en un acte**, en prose — **parmi les plus anciennes** de Molière. Le texte nous est parvenu par une **copie tardive**.

| Étape | Ce qui se passe |
| La plainte | **Le Barbouillé**, mari **jaloux et grossier**, se plaint de sa femme **Angélique**, qui sort |
| La consultation | Un **docteur pédant** parle sans fin et **ne répond jamais à la question** |
| Le piège | Le soir, il **l’enferme dehors** |
| Le retournement | Elle **feint de se tuer** ; il sort pour voir ; **elle rentre et l’enferme à son tour** |
| L’accusation | Elle le dénonce devant son père **Gorgibus** : il **courrait la nuit** |
| La fin | Une **réconciliation forcée** |

## À retenir
> On y reconnaît l’**ossature** de *George Dandin* (1668), que Molière tirera de cette farce.

| Type de comique | Où il opère |
| De **gestes** | Les portes, les coups |
| De **répétition** | Le docteur qui ne s’arrête pas |
| De **caractère** | Le **docteur pédant**, un type que Molière **reprendra sans cesse** |

> La **farce**, héritée du **Moyen Âge** et de la *commedia dell’arte*, est le **socle de tout son théâtre** — et **il ne l’a jamais reniée**, même devenu l’auteur du roi.

> Le renversement de situation — l’enfermeur enfermé — est le ressort de toute la pièce.`,
          },
          questions: [
            ['À quel genre appartient cette pièce ?', ['La farce en un acte', 'La comédie de caractère en cinq actes', 'La comédie-ballet', 'La tragi-comédie'], 0, 'Héritée du Moyen Âge et de la commedia dell’arte.'],
            ['Quel ressort comique organise la pièce ?', ['Le renversement : l’enfermeur se retrouve enfermé', 'Un quiproquo sur les noms', 'Un déguisement', 'Une lettre interceptée'], 0, 'Angélique feint de se tuer pour faire sortir son mari.'],
            ['Quel personnage type Molière introduit-il ici ?', ['Le docteur pédant qui parle sans répondre', 'Le valet rusé', 'Le père avare', 'Le militaire fanfaron'], 0, 'Il le reprendra dans plusieurs pièces.'],
            ['Quelle pièce ultérieure reprend cette intrigue ?', ['George Dandin', 'Le Misanthrope', 'Tartuffe', 'L’Avare'], 0, 'Molière en fera une comédie en trois actes en 1668.'],
            ['Comment la pièce se termine-t-elle ?', ['Par une réconciliation forcée devant Gorgibus', 'Par un divorce', 'Par la mort d’Angélique', 'Par la fuite du Barbouillé'], 0, 'La farce ne cherche pas la vraisemblance du dénouement.'],
            ['Molière a renié la farce une fois devenu auteur du roi.', ['Vrai', 'Faux'], 1, 'Elle reste le socle de tout son théâtre, jusqu’aux grandes comédies.'],
          ],
        },
        {
          titre: 'La Joie de vivre, Émile Zola',
          lecon: {
            titre: 'Zola, 1884 — la bonté à l’épreuve',
            cours: `## L’histoire
**Pauline Quenu**, orpheline de **dix ans**, riche de **cent cinquante mille francs**, est recueillie par ses cousins **Chanteau** à **Bonneville**, village **battu par la mer** en Normandie.

| Personnage | Ce qu’il est |
| L’**oncle Chanteau** | Rongé par la **goutte** |
| La **tante** | **Avide** |
| Le cousin **Lazare** | **Velléitaire**, **hanté par la peur de la mort** : il **commence tout et n’achève rien** |

| L’engrenage | Ce qui se passe |
| La famille **dépense la fortune** de Pauline | Elle **donne sans compter** |
| Elle aime Lazare | Elle **finance ses projets ratés** |
| Il en épouse une autre, **Louise** | Elle **sauve leur enfant à la naissance** et **l’élève** |
| Autour | La mer **démolit le village**, la bonne meurt, la servante **se pend** |

## À retenir
Titre **ironique** — le roman est l’un des plus **sombres** de Zola.

> Et pourtant **pas seulement** : **Pauline incarne une joie de vivre têtue**, faite de **don** et d’**acceptation** — opposée au **pessimisme** de Lazare, lecteur de **Schopenhauer**.

**Douzième volume** des *Rougon-Macquart*, écrit **après la mort de la mère de Zola**.

> « À quoi bon ? » demande Lazare ; « pour les autres », répond la vie de Pauline.`,
          },
          questions: [
            ['Qui est Pauline Quenu ?', ['Une orpheline riche, recueillie par ses cousins', 'La servante de la maison', 'La fille des Chanteau', 'Une voisine du village'], 0, 'Sa fortune sera peu à peu dépensée par la famille.'],
            ['De quoi Lazare est-il hanté ?', ['La peur de la mort', 'La ruine', 'La mer', 'La religion'], 0, 'Lecteur de Schopenhauer, il incarne le pessimisme.'],
            ['Comment Pauline réagit-elle au mariage de Lazare avec Louise ?', ['Elle sacrifie son bonheur et sauve leur enfant à la naissance', 'Elle quitte la maison', 'Elle réclame son argent', 'Elle se venge'], 0, 'Le don est sa manière d’exister.'],
            ['Le titre du roman est-il ironique ?', ['Oui, et pas seulement : Pauline incarne une joie têtue', 'Non, le roman est joyeux', 'Oui, uniquement ironique', 'Il n’a pas de rapport avec le contenu'], 0, 'Le don et l’acceptation s’opposent au pessimisme de Lazare.'],
            ['Où se déroule le roman ?', ['À Bonneville, village normand battu par la mer', 'À Paris', 'Dans le Nord minier', 'En Provence'], 0, 'La mer démolit peu à peu le village.'],
            ['Le roman appartient aux Rougon-Macquart.', ['Vrai', 'Faux'], 0, 'C’est le douzième volume du cycle.'],
          ],
        },
        {
          titre: 'La Leçon, Eugène Ionesco',
          lecon: {
            titre: 'Ionesco, 1951 — quand le savoir devient une arme',
            cours: `## La pièce
Un acte. Une **élève** de dix-huit ans, **gaie et confiante**, vient prendre un cours particulier chez un vieux **professeur timide**, pour préparer le « **doctorat total** ».

| Étape | Ce qui se passe |
| L’**arithmétique** | Elle sait **additionner** — mais **ne sait pas soustraire** |
| La **philologie** | Le professeur se lance dans un **discours délirant** sur les langues « **néo-espagnoles** » |
| Le renversement | Il **s’échauffe, s’autorise, devient autoritaire** |
| L’élève | Prise d’un **mal de dents** de plus en plus violent, elle **s’affaiblit et se tait** |
| La fin | Il la **poignarde** — **quarantième meurtre de la journée** |

> La **bonne**, Marie, gronde, nettoie, lui **passe un brassard** — et **fait entrer l’élève suivante**.

## À retenir
Pièce du **théâtre de l’absurde**, créée en **1951**, jouée **sans interruption depuis 1957** au Théâtre de la Huchette, avec *La Cantatrice chauve*.

> Ionesco y montre le **langage comme pouvoir** : **celui qui parle domine, celui qui écoute s’efface — puis meurt**.

| La lecture politique | Ce qui l’appuie |
| Évidente | Ionesco la souligne par le **brassard** |

Mais la pièce est **d’abord une mécanique comique implacable**.

> « L’arithmétique mène à la philologie, et la philologie mène au crime. »`,
          },
          questions: [
            ['Que vient faire l’élève chez le professeur ?', ['Préparer le « doctorat total »', 'Passer un examen', 'Demander du travail', 'Rendre un livre'], 0, 'Elle sait additionner mais ne sait pas soustraire.'],
            ['Comment le rapport de force évolue-t-il ?', ['Le professeur devient autoritaire, l’élève s’affaiblit et se tait', 'L’élève prend le pouvoir', 'Rien ne change', 'La bonne intervient dès le début'], 0, 'Celui qui parle domine : c’est la thèse de la pièce.'],
            ['De quoi souffre l’élève à mesure que la leçon avance ?', ['D’un mal de dents de plus en plus violent', 'De maux de tête', 'De fièvre', 'De somnolence'], 0, 'Le symptôme accompagne son effacement.'],
            ['Comment la leçon se termine-t-elle ?', ['Le professeur poignarde l’élève', 'L’élève s’enfuit', 'La leçon reprend le lendemain', 'La bonne renvoie l’élève'], 0, 'C’est le quarantième meurtre de la journée.'],
            ['Que fait la bonne à la fin ?', ['Elle gronde, nettoie, lui passe un brassard et fait entrer l’élève suivante', 'Elle appelle la police', 'Elle s’enfuit', 'Elle console le professeur seulement'], 0, 'Le brassard donne la lecture politique de la pièce.'],
            ['La pièce dénonce le langage comme instrument de pouvoir.', ['Vrai', 'Faux'], 0, 'C’est même son sujet central, sous une mécanique comique implacable.'],
          ],
        },
        {
          titre: 'La Machine infernale, Jean Cocteau',
          lecon: {
            titre: 'Cocteau, 1934 — le mythe d’Œdipe remonté comme un piège',
            cours: `## La pièce
Quatre actes qui reprennent le mythe d’**Œdipe**. Un **prologue**, dit par une **Voix**, **annonce d’emblée toute l’histoire**.

> « Une des plus **parfaites machines** construites par les dieux infernaux pour l’**anéantissement mathématique** d’un mortel. »

| Acte | Ce qui s’y passe |
| **I** | Sur les remparts de Thèbes, des soldats voient le **fantôme de Laïos**, qui veut avertir Jocaste et **n’y parvient pas** |
| **II** | Le **Sphinx** est une **jeune fille lasse**, aidée d’**Anubis** — elle **donne la réponse** à Œdipe, **par amour** |
| **III** | La nuit de noces : Œdipe et **Jocaste**, **épuisés, s’endorment**, tandis que les **indices s’accumulent** |
| **IV** | **Dix-sept ans plus tard** : la peste, la révélation, le **suicide de Jocaste**, Œdipe **s’aveuglant**, **Antigone** le guidant hors de la ville |

## À retenir
| Ce que Cocteau change | Ce qu’il garde |
| Le **ton** : familier, drôle, **insolent** | L’**issue**, à la lettre |

> **C’est le décalage qui produit l’émotion.**

> La pièce montre que le **tragique n’est pas dans la surprise**, mais dans le **mécanisme que rien n’enraye**.

> « Regarde, spectateur, remontée à bloc… une des plus parfaites machines construites par les dieux infernaux. »`,
          },
          questions: [
            ['Que désigne la « machine infernale » du titre ?', ['Le piège monté par les dieux pour anéantir Œdipe', 'Une arme de guerre', 'Le Sphinx', 'La ville de Thèbes'], 0, 'Le prologue le dit : elle est « remontée à bloc ».'],
            ['Que fait le fantôme de Laïos à l’acte I ?', ['Il tente en vain d’avertir Jocaste', 'Il maudit Œdipe', 'Il révèle l’énigme', 'Il apparaît à Créon'], 0, 'Son échec souligne l’inutilité des avertissements.'],
            ['Comment Cocteau transforme-t-il l’épisode du Sphinx ?', ['Le Sphinx est une jeune fille lasse qui donne la réponse par amour', 'Œdipe tue le Sphinx sans parler', 'Le Sphinx est un dieu masculin', 'L’épisode est supprimé'], 0, 'La victoire d’Œdipe n’en est pas une.'],
            ['Quel intervalle sépare l’acte III de l’acte IV ?', ['Dix-sept ans', 'Une nuit', 'Trois jours', 'Cinquante ans'], 0, 'La peste éclate, et la vérité remonte.'],
            ['Quel effet produit le ton familier employé par Cocteau ?', ['Le décalage avec l’issue tragique intensifie l’émotion', 'Il rend la pièce comique de bout en bout', 'Il annule le tragique', 'Il rend le mythe méconnaissable'], 0, 'Le tragique tient au mécanisme, pas à la surprise.'],
            ['Le prologue cache l’issue de l’histoire au spectateur.', ['Vrai', 'Faux'], 1, 'Il l’annonce d’emblée : tout le monde sait, sauf Œdipe.'],
          ],
        },
        {
          titre: 'La Mare au diable, George Sand',
          lecon: {
            titre: 'Sand, 1846 — un roman champêtre du Berry',
            cours: `## L’histoire
**Germain**, laboureur de **vingt-huit ans**, **veuf** avec trois enfants, part **sur ordre de son beau-père** demander en mariage une veuve d’un village voisin.

| Qui l’accompagne | Pourquoi |
| Son fils **Petit-Pierre** | Il **s’est caché dans les affaires** |
| **Marie**, seize ans | Elle va **se placer comme bergère** |

| Étape | Ce qui se passe |
| La nuit | Elle les surprend près de la **mare au diable** : **brouillard**, feu de bois, peurs, **veillée** |
| Le lendemain | Germain trouve la veuve **entourée de prétendants** et **repart** |
| Marie | Elle **fuit un maître qui la harcèle** |
| La fin | De retour au village, Germain **comprend qu’il aime Marie** — elle finit par **accepter** |

## À retenir
Le **premier** des **romans champêtres** de George Sand, avec *La Petite Fadette* et *François le Champi*.

| Ce qu’elle défend | Contre quoi |
| Une littérature qui montre la **dignité et l’intelligence des paysans** | Le **pittoresque** et la **condescendance** |

Le roman contient un long **appendice ethnographique** sur les **noces de campagne** dans le **Berry**. Écriture **claire**, sensible au paysage, **sans misérabilisme**.

> Sand écrit contre « l’art pour l’art » : elle veut une littérature **utile et fraternelle**.`,
          },
          questions: [
            ['Pourquoi Germain part-il en voyage ?', ['Demander en mariage une veuve d’un village voisin', 'Vendre ses bœufs', 'Chercher du travail', 'Fuir son beau-père'], 0, 'Il emmène malgré lui son fils et la jeune Marie.'],
            ['Que se passe-t-il près de la mare au diable ?', ['Le brouillard les égare et ils passent la nuit dehors', 'Un accident mortel', 'Une rencontre avec des brigands', 'Un mariage clandestin'], 0, 'La veillée rapproche Germain et Marie.'],
            ['Que découvre Germain chez la veuve ?', ['Elle est entourée de prétendants qu’elle fait attendre', 'Elle est déjà mariée', 'Elle est très pauvre', 'Elle refuse de le recevoir'], 0, 'Le voyage échoue — et réussit autrement.'],
            ['À quel genre le roman appartient-il ?', ['Le roman champêtre', 'Le roman historique', 'Le roman épistolaire', 'Le roman gothique'], 0, 'Avec La Petite Fadette et François le Champi.'],
            ['Que défend George Sand dans ces romans ?', ['La dignité et l’intelligence des paysans', 'Le retour à la nature sauvage', 'La supériorité de la ville', 'L’art pour l’art'], 0, 'Elle veut une littérature utile et fraternelle.'],
            ['Le roman contient un appendice sur les coutumes du Berry.', ['Vrai', 'Faux'], 0, 'Un long texte sur les noces de campagne y est joint.'],
          ],
        },
        {
          titre: 'La Marmite, Plaute',
          lecon: {
            titre: 'Plaute, IIe siècle av. J.-C. — l’ancêtre de L’Avare',
            cours: `## L’histoire
*Aulularia*. **Euclion**, vieil Athénien **pauvre**, a trouvé chez lui une **marmite pleine d’or**, cachée par son grand-père.

| Ce qu’il fait | Ce que ça produit |
| Il la **déplace sans cesse** | La terreur qu’on la lui prenne |
| Il **soupçonne tout le monde**, **fouille ses esclaves** | Il se rend **odieux** |

| L’intrigue | Ce qui se passe |
| Sa fille **Phédria** est **enceinte** du jeune **Lyconide** | Elle doit épouser le vieux **Mégadore**, **qui la prend sans dot** |
| L’**esclave de Lyconide** vole la marmite | Euclion **croit devenir fou** |
| La fin du texte est **perdue** | Les résumés antiques indiquent qu’il **retrouve son or**, le **donne en dot** et **se libère de son obsession** |

## À retenir
Comédie **latine**, elle-même adaptée de **modèles grecs** — et **source directe** de *L’Avare* de **Molière** (1668).

| Chez Plaute | Chez Molière |
| La **marmite** | La **cassette** |
| **Euclion** | **Harpagon** |
| La découverte du vol | Le fameux « **Au voleur !** » |

Comique de **caractère** et de **répétition**, adresses au public, et des **types** — le vieil avare, le jeune amoureux, l’esclave rusé — **qui traverseront tout le théâtre occidental**.

> Molière n’a pas copié Plaute : il a fait un **personnage** là où il y avait un **type**.`,
          },
          questions: [
            ['Que trouve Euclion chez lui ?', ['Une marmite pleine d’or cachée par son grand-père', 'Un testament', 'Un trésor de guerre', 'Une lettre secrète'], 0, 'La peur du vol organise toute la pièce.'],
            ['Quelle pièce française s’inspire directement de cette comédie ?', ['L’Avare de Molière', 'Le Misanthrope', 'Turcaret de Lesage', 'Le Légataire universel'], 0, 'La marmite y devient la cassette d’Harpagon.'],
            ['Qui vole la marmite ?', ['L’esclave de Lyconide', 'Mégadore', 'Phédria', 'Un voisin'], 0, 'Euclion croit alors devenir fou.'],
            ['Que sait-on de la fin de la pièce ?', ['Le texte est perdu ; les résumés antiques indiquent qu’Euclion donne l’or en dot', 'Euclion meurt', 'La marmite n’est jamais retrouvée', 'La fin est parfaitement conservée'], 0, 'Seuls des arguments anciens permettent de la reconstituer.'],
            ['Quels types comiques la pièce met-elle en place ?', ['Le vieil avare, le jeune amoureux, l’esclave rusé', 'Le roi, la reine et le bouffon', 'Le soldat, le prêtre et le marchand', 'Le savant et l’ignorant'], 0, 'Ils traverseront tout le théâtre occidental.'],
            ['Plaute écrivait en grec.', ['Vrai', 'Faux'], 1, 'Il écrivait en latin, en adaptant des modèles grecs.'],
          ],
        },
        {
          titre: 'La Métamorphose, Franz Kafka',
          lecon: {
            titre: 'Kafka, 1915 — « un monstrueux insecte »',
            cours: `## L’histoire
« En se réveillant un matin après des rêves agités, **Gregor Samsa** se retrouva, dans son lit, métamorphosé en un **monstrueux insecte**. »

> **Aucune explication ne sera donnée.**

| Étape | Ce qui se passe |
| La première réaction | Gregor, **voyageur de commerce** qui entretenait seul ses parents et sa sœur, **se soucie de son train et de son chef de bureau** |
| L’enfermement | Après l’effroi, la famille **l’enferme dans sa chambre** |
| Sa sœur **Grete** | Elle le nourrit — **puis se lasse** |
| Le père | Il le blesse d’un jet de **pomme** **qui pourrit dans son dos** |
| Le renversement | Devenus **travailleurs**, les parents et la sœur prennent des **locataires** |
| Le scandale | Attiré par le **violon** de Grete, Gregor **se montre** |
| La sentence | **Grete** déclare qu’il faut « **s’en débarrasser** » |
| La fin | Gregor **meurt** ; la famille, **soulagée**, part en promenade **au soleil** et remarque que **Grete est devenue une belle jeune fille** |

## À retenir
Récit de **1915**, l’un des textes **fondateurs** de la littérature moderne.

> Le fantastique y est **posé, non expliqué** — et **tout le reste est décrit avec une précision administrative**.

| Lecture possible | Ce qu’elle voit |
| La **famille** | Une **machine à broyer** |
| Le **travail** | Aliénant |
| La **maladie** | L’exclusion de celui qui **ne « sert » plus** |

Le style est **neutre**, **presque comique** par endroits.

> « Ce n’était pas un rêve. »`,
          },
          questions: [
            ['Par quel événement le récit commence-t-il ?', ['Gregor se réveille métamorphosé en insecte', 'Gregor perd son emploi', 'Gregor tombe malade', 'Gregor rentre d’un long voyage'], 0, 'Aucune explication ne sera jamais donnée.'],
            ['Quelle est la première préoccupation de Gregor ?', ['Manquer son train et son travail', 'Sa santé', 'La réaction de sa sœur', 'Trouver un remède'], 0, 'Le fantastique est posé, le reste est décrit avec une précision administrative.'],
            ['Qui s’occupe d’abord de Gregor ?', ['Sa sœur Grete', 'Sa mère', 'Son père', 'La femme de ménage'], 0, 'Elle finit par se lasser et par réclamer qu’on s’en débarrasse.'],
            ['Que fait le père à Gregor ?', ['Il le blesse d’un jet de pomme qui pourrit dans son dos', 'Il le chasse de la maison', 'Il le vend à un cirque', 'Il le soigne'], 0, 'La blessure ne guérira pas.'],
            ['Comment la famille réagit-elle à la mort de Gregor ?', ['Elle est soulagée et part en promenade au soleil', 'Elle est accablée de douleur', 'Elle quitte la ville', 'Elle refuse d’y croire'], 0, 'La dernière page est d’une cruauté tranquille.'],
            ['Le récit explique la cause de la métamorphose.', ['Vrai', 'Faux'], 1, 'Elle est posée comme un fait : c’est ce qui fait la force du texte.'],
          ],
        },
        {
          titre: 'La Modification, Michel Butor',
          lecon: {
            titre: 'Butor, 1957 — un roman écrit à « vous »',
            cours: `## L’histoire
**Léon Delmont**, directeur d’une firme de machines à écrire, prend le train **Paris-Rome** — **en troisième classe, pour ne pas être reconnu**.

| Son projet initial | Ce qu’il va annoncer |
| À sa maîtresse **Cécile** | Il lui a **trouvé un emploi à Paris** — et **il quitte sa femme Henriette** |

| Pendant les **vingt et une heures** | Ce qui se mêle |
| Souvenirs, rêveries | Les visites passées de **Rome** |
| Les paysages | Les voyageurs du compartiment |

| La **modification** | Ce qu’il comprend |
| Peu à peu | **Cécile n’existe pour lui que liée à Rome** |
| Donc | Il **détruirait tout** en l’installant à Paris |
| À l’arrivée | Il a **renoncé** — et décide d’**écrire un livre** sur cette expérience |

## À retenir
**Prix Renaudot 1957**, l’œuvre la plus célèbre du **Nouveau Roman**.

| Sa particularité formelle | Son effet |
| Tout le récit est à la **deuxième personne du pluriel** — « **vous** » | Le lecteur est **installé à la place du personnage** ; le récit devient un **interrogatoire intérieur** |

| Unité | Ce qu’elle donne |
| De **lieu** | Un compartiment |
| De **temps** | Un trajet |
| L’**événement** | Il n’est qu’un **changement d’avis** |

> « Vous avez mis le pied gauche sur la rainure de cuivre… »`,
          },
          questions: [
            ['Quelle est la particularité formelle du roman ?', ['Il est écrit à la deuxième personne du pluriel', 'Il n’a pas de ponctuation', 'Il est écrit en vers', 'Il alterne cinq narrateurs'], 0, 'Le « vous » installe le lecteur à la place du personnage.'],
            ['Où se déroule l’action ?', ['Dans un train Paris-Rome, pendant vingt et une heures', 'Dans un bureau parisien', 'À Rome, en une journée', 'Sur un paquebot'], 0, 'Unité de lieu et de temps, comme au théâtre classique.'],
            ['Quel est le projet initial de Léon Delmont ?', ['Annoncer à sa maîtresse qu’il quitte sa femme pour elle', 'Vendre son entreprise', 'Fuir ses créanciers', 'Visiter Rome en touriste'], 0, 'Il lui a trouvé un emploi à Paris.'],
            ['Qu’est-ce qui se « modifie » au cours du trajet ?', ['Sa décision : il renonce à quitter sa femme', 'Son itinéraire', 'Son métier', 'Son identité'], 0, 'Il comprend que Cécile n’existe pour lui que liée à Rome.'],
            ['À quel mouvement le roman appartient-il ?', ['Le Nouveau Roman', 'Le surréalisme', 'L’existentialisme', 'Le naturalisme'], 0, 'Il en est l’œuvre la plus célèbre auprès du grand public.'],
            ['Le roman comporte de nombreuses péripéties extérieures.', ['Vrai', 'Faux'], 1, 'L’unique événement est un changement d’avis.'],
          ],
        },
        {
          titre: 'La Peau de chagrin, Honoré de Balzac',
          lecon: {
            titre: 'Balzac, 1831 — chaque désir coûte un morceau de vie',
            cours: `## L’histoire
| Partie | Ce qui s’y passe |
| **Le Talisman** | **Raphaël de Valentin**, ruiné, perd sa dernière pièce au jeu et va se noyer ; un **antiquaire** lui offre une **peau d’onagre** qui exauce tous les vœux — **mais rétrécit à chaque souhait**, et **la vie de son possesseur avec elle** |
| **La Femme sans cœur** | Récit **rétrospectif** : la jeunesse studieuse et pauvre, l’amour pour la comtesse **Fœdora**, **incapable d’aimer**, et la ruine |
| **L’Agonie** | Riche et **condamné**, il tente de **ne plus rien désirer** ; savants et médecins **échouent** à étirer la peau ; il **meurt en désirant Pauline**, qui l’aime depuis toujours |

## À retenir
Le roman qui **ouvre les Études philosophiques** de *La Comédie humaine*.

| Verbe | Son effet, selon l’antiquaire |
| **VOULOIR** | Il **brûle** |
| **POUVOIR** | Il **détruit** |
| **SAVOIR** | Il **conserve** |

> Le fantastique — la peau — est installé dans un **Paris minutieusement décrit** : c’est le **réalisme fantastique**.

> Le roman dit l’**énergie d’une époque** — **1830**, spéculation, arrivisme — **qui se consume elle-même**.

> « Vouloir nous brûle et Pouvoir nous détruit. »`,
          },
          questions: [
            ['Que se passe-t-il à chaque vœu exaucé ?', ['La peau rétrécit et la vie de Raphaël raccourcit', 'La peau change de couleur', 'Raphaël vieillit d’un an', 'La peau se réchauffe'], 0, 'Vouloir, c’est vivre ; vivre, c’est se consumer.'],
            ['Quels verbes usent la vie selon l’antiquaire ?', ['Vouloir et Pouvoir', 'Aimer et Croire', 'Savoir et Comprendre', 'Créer et Détruire'], 0, 'Seul SAVOIR conserve, dit-il.'],
            ['Qui est Fœdora ?', ['La comtesse incapable d’aimer, « la femme sans cœur »', 'La mère de Raphaël', 'Une servante', 'La femme de l’antiquaire'], 0, 'Elle incarne la société parisienne, séduisante et vide.'],
            ['Comment Raphaël meurt-il ?', ['En désirant Pauline, qui l’aime', 'D’une maladie ordinaire', 'Noyé dans la Seine', 'Tué en duel'], 0, 'Il n’a pas pu s’empêcher de désirer.'],
            ['À quel ensemble de La Comédie humaine appartient le roman ?', ['Les Études philosophiques', 'Les Scènes de la vie parisienne', 'Les Études analytiques', 'Les Scènes de la vie privée'], 0, 'Il expose une idée : la pensée et le désir usent la vie.'],
            ['Le fantastique du roman se déroule dans un décor irréel.', ['Vrai', 'Faux'], 1, 'Le Paris de 1830 y est décrit avec une précision documentaire.'],
          ],
        },
        {
          titre: 'La Peste, Albert Camus',
          lecon: {
            titre: 'Camus, 1947 — la ville fermée, et ceux qui soignent',
            cours: `## L’histoire
À **Oran**, dans les années **1940**, des **rats meurent par milliers**, puis les hommes. Les autorités **tardent** — puis **ferment la ville**.

| Personnage | Ce qu’il choisit |
| Le docteur **Bernard Rieux** | Il **soigne sans relâche** |
| Le journaliste **Rambert** | D’abord obsédé par l’idée de **rejoindre la femme qu’il aime**, il **choisit de rester** |
| **Tarrou** | Il organise les **formations sanitaires volontaires** |
| Le père **Paneloux** | Il prêche la peste comme un **châtiment** — puis, **après la mort atroce d’un enfant**, **change de discours** et meurt |
| **Grand**, employé modeste | Il écrit **sans fin la première phrase** d’un roman |
| **Cottard** | Il **profite du fléau** |

> La peste recule, la ville rouvre. **Le narrateur se révèle être Rieux** : il a écrit cette chronique pour « dire simplement ce qu’on apprend au milieu des fléaux ».

## À retenir
Roman de **1947**, cycle de la **révolte**, avec *L’Homme révolté*.

| Lecture | Ce qu’elle voit |
| **Allégorique** | Le **nazisme** et l’**Occupation** |
| **Morale** | Le mal, la **solidarité**, l’**action sans espoir métaphysique** |

« Il y a dans les hommes **plus de choses à admirer que de choses à mépriser**. »

> La **dernière page** avertit que le bacille « **ne meurt ni ne disparaît jamais** ».

> « Il ne s’agit pas d’héroïsme. Il s’agit d’honnêteté. »`,
          },
          questions: [
            ['Dans quelle ville se déroule le roman ?', ['Oran', 'Alger', 'Marseille', 'Constantine'], 0, 'La ville est fermée quand l’épidémie est reconnue.'],
            ['Qui est le narrateur, révélé à la fin ?', ['Le docteur Rieux', 'Tarrou', 'Grand', 'Rambert'], 0, 'Il a écrit une chronique de l’épidémie.'],
            ['Que décide Rambert ?', ['Rester pour lutter, au lieu de rejoindre la femme qu’il aime', 'Fuir la ville', 'Écrire un article accusateur', 'Se cacher chez Cottard'], 0, 'Son évolution est l’un des fils moraux du roman.'],
            ['Qu’est-ce qui fait changer le discours du père Paneloux ?', ['La mort atroce d’un enfant', 'La fermeture des églises', 'La guérison de Rieux', 'Le départ de Rambert'], 0, 'Le châtiment divin ne peut plus expliquer l’innocent qui souffre.'],
            ['Quel avertissement clôt le roman ?', ['Le bacille de la peste ne meurt ni ne disparaît jamais', 'La ville sera détruite', 'Rieux quitte Oran', 'Cottard sera jugé'], 0, 'La vigilance vaut pour tous les fléaux, y compris politiques.'],
            ['Le roman célèbre l’héroïsme exceptionnel.', ['Vrai', 'Faux'], 1, '« Il ne s’agit pas d’héroïsme, il s’agit d’honnêteté » : Camus valorise le travail obstiné.'],
          ],
        },
        {
          titre: 'La Petite Fadette, George Sand',
          lecon: {
            titre: 'Sand, 1849 — la sorcière était une jeune fille',
            cours: `## L’histoire
Les jumeaux **Landry** et **Sylvinet** Barbeau sont **inséparables**. Leur père les **sépare** en plaçant Landry dans une ferme voisine — ce qui rend **Sylvinet malade de jalousie**.

| Personnage | Ce qu’elle est |
| **Fanchon Fadet**, dite la **petite Fadette** | Adolescente **pauvre**, mal habillée, **moqueuse**, élevée par une **grand-mère guérisseuse** |
| Ce que le village en fait | Une **sorcière** |

| Étape | Ce qui se passe |
| L’aide | Elle **aide Landry** ; il découvre son **intelligence** et sa **bonté** |
| La transformation | Elle apprend à se tenir, **hérite d’un magot inattendu** |
| La guérison | Elle **soigne Sylvinet** de sa jalousie maladive |
| La fin | Elle **épouse Landry** |

## À retenir
**Deuxième** grand **roman champêtre** de George Sand, écrit **après l’échec de la révolution de 1848**.

> Elle y cherche, dit-elle, à **parler d’autre chose que de politique** — tout en **défendant les mêmes valeurs**.

| Thème | Ce qu’il porte |
| Le **regard des autres** | **Il fabrique les sorcières** |
| L’**éducation** | Elle transforme |
| La **jalousie fraternelle** | Sylvinet |
| La **dignité paysanne** | Le fil de toute l’œuvre |

Langue **simple**, dialogues teintés de **parler berrichon**.

> On n’est laid et méchant que dans les yeux du village.`,
          },
          questions: [
            ['Qui sont Landry et Sylvinet ?', ['Deux frères jumeaux inséparables', 'Deux cousins rivaux', 'Les frères de Fadette', 'Deux fermiers voisins'], 0, 'Leur séparation rend Sylvinet malade de jalousie.'],
            ['Pourquoi le village prend-il Fadette pour une sorcière ?', ['Elle est pauvre, moqueuse et élevée par une grand-mère guérisseuse', 'Elle jette réellement des sorts', 'Elle vient d’un autre pays', 'Elle refuse d’aller à l’église'], 0, 'Le regard des autres fabrique la sorcière.'],
            ['Que fait Fadette pour Sylvinet ?', ['Elle le soigne de sa jalousie maladive', 'Elle l’épouse', 'Elle le dénonce', 'Elle l’éloigne du village'], 0, 'Sa connaissance des plantes et des âmes le sauve.'],
            ['Quel événement personnel change la situation de Fadette ?', ['Un héritage inattendu', 'Un mariage arrangé', 'Un départ pour la ville', 'La mort de Landry'], 0, 'Elle acquiert aussi les manières que le village exigeait.'],
            ['Dans quel contexte George Sand écrit-elle ce roman ?', ['Après l’échec de la révolution de 1848', 'Pendant la Restauration', 'Sous le Second Empire finissant', 'Avant 1830'], 0, 'Elle veut parler d’autre chose que de politique, sans renier ses valeurs.'],
            ['Le roman appartient aux romans champêtres de Sand.', ['Vrai', 'Faux'], 0, 'Avec La Mare au diable et François le Champi.'],
          ],
        },
        {
          titre: 'La Porte étroite, André Gide',
          lecon: {
            titre: 'Gide, 1909 — le renoncement comme piège',
            cours: `## L’histoire
**Jérôme** aime sa cousine **Alissa** depuis l’enfance. **Elle l’aime aussi.**

| Ce qui la retient | Le détail |
| L’**inconduite de sa mère** | Une peur du bonheur des sens |
| Une **piété exigeante** | « Efforcez-vous d’entrer par la **porte étroite** », dit l’Évangile |
| Sa conviction | Leur **bonheur terrestre les détournerait de Dieu** |

| Étape | Ce qu’elle fait |
| Le report | Elle **recule le mariage** |
| L’effacement | Elle prétend que sa sœur **Juliette** aime Jérôme |
| Le sacrifice | Elle **se laisse enlaidir**, écrit des lettres **de plus en plus hautes**, puis **rompt** |
| La fin | Elle **meurt seule** dans une maison de santé |

> Son **journal**, découvert **après sa mort**, révèle qu’elle l’a **aimé jusqu’au bout** — et **qu’elle a souffert de son propre sacrifice**.

## À retenir
Publié en **1909**, ce **récit** est le **pendant exact** de *L’Immoraliste*.

| Dans *L’Immoraliste* | Ici |
| L’**abandon de toute morale** détruit | C’est l’**excès de vertu** |

> Gide, formé dans une famille **protestante rigoriste**, met en cause une religion qui fait du **renoncement une valeur en soi**.

**Construction remarquable** : le récit de Jérôme, **puis le journal d’Alissa** — **qui retourne toute la lecture**.

> « Il n’y a pas de plus grande douleur que d’avoir été heureux. »`,
          },
          questions: [
            ['Pourquoi Alissa refuse-t-elle d’épouser Jérôme ?', ['Elle croit que leur bonheur les détournerait de Dieu', 'Elle en aime un autre', 'Sa famille s’y oppose', 'Elle est malade'], 0, 'La « porte étroite » de l’Évangile lui sert de justification.'],
            ['Que révèle le journal d’Alissa ?', ['Qu’elle l’a aimé jusqu’au bout et a souffert de son sacrifice', 'Qu’elle ne l’a jamais aimé', 'Qu’elle aimait Juliette', 'Qu’elle projetait de fuir'], 0, 'Sa découverte retourne toute la lecture du récit.'],
            ['Quel récit de Gide forme le pendant de celui-ci ?', ['L’Immoraliste', 'Les Faux-Monnayeurs', 'Les Caves du Vatican', 'Isabelle'], 0, 'L’un montre l’excès de liberté, l’autre l’excès de vertu.'],
            ['Comment Alissa meurt-elle ?', ['Seule, dans une maison de santé', 'Au couvent', 'Chez elle, entourée des siens', 'En voyage'], 0, 'Le sacrifice ne mène à aucune consolation.'],
            ['Que met Gide en cause dans ce récit ?', ['Une religion qui fait du renoncement une valeur en soi', 'La foi en général', 'Le mariage bourgeois', 'L’éducation des filles seulement'], 0, 'Il écrit depuis l’intérieur du protestantisme rigoriste où il a grandi.'],
            ['Le récit est raconté uniquement par Jérôme.', ['Vrai', 'Faux'], 1, 'Le journal d’Alissa vient en contrepoint et corrige tout ce qui précède.'],
          ],
        },
        {
          titre: 'La Princesse de Clèves, Madame de Lafayette',
          lecon: {
            titre: 'Madame de Lafayette, 1678 — l’aveu et le refus',
            cours: `## L’histoire
À la cour d’**Henri II**, en **1558**.

| Étape | Ce qui se passe |
| Le mariage | **Mademoiselle de Chartres**, seize ans, épouse **sans amour** le **prince de Clèves**, qui l’adore |
| La rencontre | Le **duc de Nemours** : coup de foudre **réciproque et silencieux** |
| L’avertissement | Sa **mère** la met en garde — puis meurt |
| L’**aveu** | Pour se protéger, elle **avoue à son mari** qu’elle aime un autre homme, **sans le nommer**, et demande à quitter la cour |
| Le témoin | **Nemours, caché, entend tout** |
| La mort | Le prince de Clèves **meurt de jalousie et de chagrin** |
| Le **refus** | Libre, elle **refuse d’épouser Nemours** : le **devoir envers le mort**, et la **certitude que cette passion ne durerait pas** |

Elle se retire, et **meurt jeune**.

> La scène de l’aveu est **sans précédent dans le roman français**.

## À retenir
**Premier grand roman d’analyse** : **l’action extérieure compte moins que les mouvements intérieurs**. Publié **anonymement**.

> La **cour** y est un **système d’observation et de calcul**, où **la sincérité est presque impossible**.

> Le **refus final** — orgueil ? sagesse ? liberté ? — est l’un des **sujets de dissertation les plus fréquents**.

> « Il faut se retirer de la cour pour y voir clair. »`,
          },
          questions: [
            ['Quelle scène rend le roman célèbre ?', ['L’aveu de la princesse à son mari', 'Le duel de Nemours', 'Le bal du Louvre', 'La mort du roi'], 0, 'Nemours, caché, entend tout : le procédé est audacieux.'],
            ['Comment le roman a-t-il été publié ?', ['Anonymement, en 1678', 'Sous le nom de La Rochefoucauld', 'À titre posthume', 'En feuilleton'], 0, 'L’anonymat protégeait une femme de lettres.'],
            ['De quoi meurt le prince de Clèves ?', ['De jalousie et de chagrin', 'D’une blessure de tournoi', 'D’une épidémie', 'Assassiné'], 0, 'Il croit sa femme coupable.'],
            ['Que fait la princesse une fois veuve ?', ['Elle refuse d’épouser Nemours et se retire', 'Elle l’épouse aussitôt', 'Elle part à l’étranger', 'Elle entre immédiatement au couvent'], 0, 'Devoir envers le mort et défiance envers la durée de la passion.'],
            ['Qu’est-ce qui fait la nouveauté du roman ?', ['L’analyse des mouvements intérieurs plutôt que l’action', 'Le récit à la première personne', 'Le mélange des genres', 'La longueur des descriptions'], 0, 'D’où l’expression « roman d’analyse ».'],
            ['La cour est présentée comme un lieu de sincérité.', ['Vrai', 'Faux'], 1, 'C’est un système d’observation et de calcul où la sincérité est presque impossible.'],
          ],
        },
        {
          titre: 'La Princesse de Montpensier, Madame de La Fayette',
          lecon: {
            titre: 'Madame de La Fayette, 1662 — le premier récit d’une œuvre',
            cours: `## L’histoire
Pendant les **guerres de religion**.

| Personnage | Sa position |
| **Mademoiselle de Mézières** | Amoureuse du **duc de Guise**, **mariée par sa famille** au **prince de Montpensier** |
| Le **comte de Chabannes** | Homme d’honneur plus âgé, à qui le mari la **confie** pendant qu’il guerroie |
| Ce qu’il devient | Il **tombe amoureux d’elle** — et devient pourtant son **confident loyal** |

| Étape | Ce qui se passe |
| Le retour de Guise | **La passion renaît** |
| La nuit | Le prince **surprend Guise** dans la chambre de sa femme |
| Le sacrifice | **Chabannes**, pour la sauver, **se laisse prendre pour l’amant** |
| Sa fin | Chassé, il est **tué au cours de la Saint-Barthélemy** |
| La fin | **Guise épouse une autre femme par ambition** ; la princesse, **abandonnée de tous**, **meurt de chagrin** |

## À retenir
Publiée **anonymement** en **1662**, cette **nouvelle historique** **annonce** *La Princesse de Clèves*.

| Point commun | Le détail |
| Le **cadre** | La cour |
| Le **conflit** | Passion contre devoir |
| L’**issue** | Funeste |

> **Chabannes**, dont le **dévouement absolu n’est jamais récompensé**, est l’une des grandes créations de l’autrice.

Adaptée au cinéma par **Bertrand Tavernier** (2010).

> La passion, chez Madame de La Fayette, ne se paie jamais autrement que par la mort ou le renoncement.`,
          },
          questions: [
            ['Dans quel contexte historique se déroule le récit ?', ['Les guerres de religion', 'La Fronde', 'Le règne de Louis XIV', 'La Révolution'], 0, 'La Saint-Barthélemy intervient dans le dénouement.'],
            ['Qui est le comte de Chabannes ?', ['Le confident loyal de la princesse, secrètement amoureux d’elle', 'Le frère du duc de Guise', 'Le père de la princesse', 'Un prêtre'], 0, 'Il se sacrifiera pour la sauver.'],
            ['Que fait Chabannes quand le prince surprend Guise ?', ['Il se laisse prendre pour l’amant', 'Il dénonce Guise', 'Il s’enfuit', 'Il défie le prince en duel'], 0, 'Chassé, il sera tué pendant la Saint-Barthélemy.'],
            ['Que devient le duc de Guise ?', ['Il épouse une autre femme par ambition', 'Il meurt en duel', 'Il enlève la princesse', 'Il entre dans les ordres'], 0, 'La princesse est abandonnée de tous.'],
            ['Quel roman ultérieur cette nouvelle annonce-t-elle ?', ['La Princesse de Clèves', 'Manon Lescaut', 'Les Liaisons dangereuses', 'La Nouvelle Héloïse'], 0, 'Même cadre de cour, même conflit, même issue.'],
            ['La nouvelle a été publiée sous le nom de son autrice.', ['Vrai', 'Faux'], 1, 'Elle paraît anonymement en 1662.'],
          ],
        },
        {
          titre: 'La Puce à l’oreille, Georges Feydeau',
          lecon: {
            titre: 'Feydeau, 1907 — le vaudeville comme horlogerie',
            cours: `## L’histoire
**Raymonde Chandebise** soupçonne son mari **Victor-Emmanuel** d’infidélité — une **paire de bretelles** renvoyée d’un hôtel louche lui a mis « **la puce à l’oreille** ».

| Étape | Ce qui se passe |
| Le piège | Elle lui fait écrire par son amie **Lucienne** une **lettre anonyme de rendez-vous** à l’hôtel du **Minet-Galant** |
| La méprise | Chandebise, croyant à une erreur, **envoie à sa place son ami Tournel** |

| À l’hôtel | Qui s’y croise |
| **Homenidès** | Le mari espagnol **jaloux** de Lucienne |
| **Camille** | Le neveu **qui parle sans consonnes** |
| Le docteur **Finache**, le patron **Feraillon** | Le personnel |
| **Poche** | Le garçon d’hôtel **ivrogne**, **sosie parfait** de Chandebise |

> Les portes claquent, un **lit tournant** fait disparaître les amants, **tout le monde se prend pour un autre**.

Au dernier acte, tout se dénoue chez les Chandebise et **le malentendu s’efface**.

## À retenir
Le **vaudeville** porté à sa **perfection mécanique** : trois actes — **exposition**, **machine infernale**, **retour à l’ordre**.

> Feydeau construit ses pièces comme des **horlogeries** : **chaque objet, chaque défaut de langage, chaque porte a une fonction**.

Le **sosie** et le **quiproquo d’identité** en font l’une de ses pièces **les plus jouées**.

> « Le vaudeville, c’est de la géométrie. »`,
          },
          questions: [
            ['Qu’est-ce qui met « la puce à l’oreille » de Raymonde ?', ['Une paire de bretelles renvoyée d’un hôtel', 'Une lettre anonyme reçue', 'Un parfum inconnu', 'Un témoin'], 0, 'Elle organise alors un faux rendez-vous pour confondre son mari.'],
            ['Qui va au rendez-vous à la place de Chandebise ?', ['Son ami Tournel', 'Son neveu Camille', 'Le docteur Finache', 'Homenidès'], 0, 'Chandebise croit à une méprise et lui cède la place.'],
            ['Qui est Poche ?', ['Le garçon d’hôtel ivrogne, sosie parfait de Chandebise', 'Le patron de l’hôtel', 'Un policier', 'Le valet des Chandebise'], 0, 'Le sosie est le moteur des quiproquos.'],
            ['Quelle particularité a le neveu Camille ?', ['Il parle sans consonnes', 'Il est sourd', 'Il ne parle qu’espagnol', 'Il bégaie'], 0, 'Chaque défaut a une fonction dans la mécanique comique.'],
            ['Comment se caractérise la construction de Feydeau ?', ['Une horlogerie où chaque objet et chaque détail sert', 'Une improvisation libre', 'Une succession de tableaux sans lien', 'Une intrigue psychologique'], 0, 'Trois actes : exposition, machine infernale, retour à l’ordre.'],
            ['Le vaudeville se termine généralement par un bouleversement définitif de l’ordre.', ['Vrai', 'Faux'], 1, 'Il revient toujours à l’ordre initial, le malentendu effacé.'],
          ],
        },
        {
          titre: 'La rage de l’expression, Francis Ponge',
          lecon: {
            titre: 'Ponge, 1952 — le poème montré en chantier',
            cours: `## L’œuvre
**Sept ensembles** écrits entre **1938 et 1944**, publiés en **1952**.

« Berges de la Loire », « Le Carnet du bois de pins », « La Mounine », « L’Œillet », « La Guêpe », « Le Mimosa », « Notes prises pour un oiseau ».

> Ce ne sont **pas des poèmes finis** mais des **journaux d’écriture** : **datés, raturés, contradictoires**.

## Le projet
Décrire des objets **modestes** — un pin, un œillet, une guêpe — **sans les humaniser ni les symboliser**.

| Ce que la chose n’est pas | Ce qu’elle est |
| Un **miroir des sentiments** | Un **défi posé au langage** |

> Le langage **échoue et recommence**. D’où la « **rage** » : l’**acharnement à reprendre**.

## L’écriture
| Outil | Son usage |
| Le **dictionnaire** ouvert — le **Littré** | L’étymologie comme matière |
| Les **définitions successives** | **Aucune n’est la bonne** |
| Les **néologismes** | Quand la langue manque |
| La **note brute** et la **phrase travaillée** | Alternées |

> Le « je » y est celui d’un **ouvrier au travail** — **non d’un cœur qui s’épanche**.

## À retenir
> L’œuvre **déplace l’idée de poème** : le poème devient un **processus**, non un **résultat** — et **le lecteur est placé dans l’atelier**.

C’est aussi une **leçon de modestie** : **nommer exactement une guêpe est plus difficile que chanter ses états d’âme**.

> Le poème est ici le compte rendu de sa propre fabrication.`,
          },
          questions: [
            ['Que publie Ponge dans cette œuvre ?', ['Ses brouillons et ses reprises, datés', 'Des poèmes achevés', 'Un traité de poétique', 'Des souvenirs d’enfance'], 0, 'Le poème devient un processus, non un résultat.'],
            ['Quels objets Ponge choisit-il ?', ['Des objets modestes : pin, œillet, guêpe, mimosa', 'Des monuments', 'Des paysages grandioses', 'Des figures mythologiques'], 0, 'Le minuscule est une prise de position contre le lyrisme du grandiose.'],
            ['Que refuse Ponge dans sa description ?', ['Humaniser les choses et en faire le miroir de ses sentiments', 'Les nommer précisément', 'Consulter le dictionnaire', 'Les observer'], 0, 'C’est le contraire du paysage romantique.'],
            ['Que désigne la « rage » du titre ?', ['L’acharnement à reprendre un texte qui échoue', 'La colère politique', 'La violence de la nature', 'La haine du lecteur'], 0, 'L’échec est intégré à l’œuvre : il en est le sujet.'],
            ['Quel outil accompagne son écriture ?', ['Le dictionnaire, notamment le Littré', 'Le carnet de voyage', 'L’appareil photo', 'Le traité de versification'], 0, 'Étymologies et définitions successives sont des matériaux du poème.'],
            ['Ponge publie ici des textes définitifs et polis.', ['Vrai', 'Faux'], 1, 'Ce sont des carnets de travail, avec ratures, dates et contradictions.'],
          ],
        },
        {
          titre: 'La Reine Margot, Alexandre Dumas',
          lecon: {
            titre: 'Dumas, 1845 — la Saint-Barthélemy en roman',
            cours: `## L’histoire
**Août 1572.**

| Étape | Ce qui se passe |
| Le mariage | **Marguerite de Valois**, dite **Margot**, catholique, épouse **Henri de Navarre**, protestant |
| Six jours plus tard | Le **massacre de la Saint-Barthélemy**, ordonné par **Catherine de Médicis** et **Charles IX** |
| La nuit du massacre | Margot **sauve La Mole**, jeune gentilhomme protestant blessé — **dont elle devient la maîtresse** |
| Le second couple | La duchesse de **Nevers** aime **Coconnas**, l’ami de La Mole |
| Le poison | Le fameux **livre empoisonné** destiné à Henri — **et qui tue Charles IX** |
| La fin | Fuite manquée, **exécution de La Mole et Coconnas** — **Margot emporte la tête de son amant** |

## À retenir
Roman historique de **1845**, écrit avec **Auguste Maquet**.

| La méthode de Dumas | Sa formule |
| Personnages **réels**, événements **attestés**, ressorts **romanesques ajoutés** | « **Violer l’Histoire, à condition de lui faire de beaux enfants** » |

> Le livre a fixé, **plus que les manuels**, l’image populaire de la **Saint-Barthélemy** et de **Catherine de Médicis**.

Adapté au cinéma par **Patrice Chéreau** (1994).

> « Il n’y a pas de plus grand ennemi qu’un frère. »`,
          },
          questions: [
            ['Quel événement historique le roman raconte-t-il ?', ['Le massacre de la Saint-Barthélemy, en 1572', 'La Fronde', 'La Ligue et l’assassinat d’Henri III', 'La révocation de l’édit de Nantes'], 0, 'Il suit de six jours le mariage de Margot et d’Henri de Navarre.'],
            ['Qui est La Mole ?', ['Un gentilhomme protestant sauvé et aimé par Margot', 'Le frère du roi', 'Un capitaine des gardes catholique', 'Le médecin de Catherine'], 0, 'Il sera exécuté avec son ami Coconnas.'],
            ['Quel poison célèbre intervient dans l’intrigue ?', ['Un livre empoisonné destiné à Henri de Navarre', 'Une bague', 'Un vin de messe', 'Un gant'], 0, 'C’est Charles IX qui en meurt : ressort romanesque typique de Dumas.'],
            ['Avec qui Dumas a-t-il écrit ce roman ?', ['Auguste Maquet', 'Gérard de Nerval', 'Eugène Sue', 'Paul Meurice'], 0, 'Maquet a collaboré à la plupart des grands romans de Dumas.'],
            ['Quelle est la méthode revendiquée par Dumas ?', ['Violer l’Histoire à condition de lui faire de beaux enfants', 'Respecter scrupuleusement les sources', 'Écrire sans documentation', 'Réécrire les chroniques mot à mot'], 0, 'Personnages réels, événements attestés, ressorts romanesques ajoutés.'],
            ['Margot emporte la tête de son amant après l’exécution.', ['Vrai', 'Faux'], 0, 'La scène, reprise de la légende, a marqué les lecteurs.'],
          ],
        },
        {
          titre: 'La Symphonie pastorale, André Gide',
          lecon: {
            titre: 'Gide, 1919 — l’aveuglement du pasteur',
            cours: `## L’histoire
Un **pasteur** suisse recueille **Gertrude**, jeune **orpheline aveugle**, sauvage et muette, et entreprend de l’**éduquer**. Il tient un **journal** de cette éducation.

| Ce qu’il fait | Ce qu’il ne voit pas |
| Il lui apprend à **parler** | Qu’**il l’aime** |
| Il la mène au **concert** — la *Symphonie pastorale* de Beethoven | Que son fils **Jacques** l’aime aussi |
| Il lui décrit un monde **harmonieux**, **dont il retire soigneusement le mal et le péché** | Qu’il **éloigne Jacques**, lequel **se convertira au catholicisme** |

| Le retournement | Ce qui arrive |
| Une **opération** rend la vue à Gertrude | Elle découvre le **visage réel** du pasteur |
| Elle comprend | Qu’elle **aimait Jacques** — et mesure la **souffrance de la femme du pasteur** |
| La fin | Elle **se jette dans la rivière** et meurt **après avoir tout dit** |

## À retenir
Un **récit en deux cahiers**, publié en **1919**.

> Le titre est **ironique** : **c’est le pasteur, non l’aveugle, qui ne voyait rien**.

| Ce que Gide attaque | Comment |
| Une lecture **complaisante** de l’Évangile | Le pasteur **cite saint Paul contre son fils** |
| La **confusion** entre charité et désir | Il **se justifie par l’Écriture** |

**Structure implacable** : le journal, écrit par un **narrateur de bonne foi**, **se retourne contre lui**.

> « Le péché, c’est ce qui obscurcit l’âme. »`,
          },
          questions: [
            ['Qui est Gertrude ?', ['Une jeune orpheline aveugle recueillie par le pasteur', 'La fille du pasteur', 'Une musicienne de passage', 'La femme de Jacques'], 0, 'Le pasteur entreprend son éducation et tient un journal.'],
            ['Quelle forme prend le récit ?', ['Le journal du pasteur, en deux cahiers', 'Un récit à la troisième personne', 'Des lettres échangées', 'Un dialogue'], 0, 'Le journal se retourne progressivement contre son auteur.'],
            ['Que cache le pasteur dans sa description du monde ?', ['Le mal et le péché', 'Sa fortune', 'L’existence de son fils', 'La musique'], 0, 'Il fabrique pour Gertrude un monde harmonieux et faux.'],
            ['Que découvre Gertrude après l’opération ?', ['Qu’elle aimait Jacques et qu’elle a fait souffrir toute une famille', 'Que le pasteur l’a trompée financièrement', 'Qu’elle est riche', 'Qu’elle n’aime personne'], 0, 'Elle se jette alors dans la rivière.'],
            ['Pourquoi le titre est-il ironique ?', ['C’est le pasteur, non l’aveugle, qui ne voit rien', 'Il n’y a pas de musique dans le récit', 'La symphonie n’est jamais écoutée', 'Il n’y a pas de pasteur'], 0, 'Gide vise une lecture complaisante de l’Évangile.'],
            ['Le pasteur reconnaît d’emblée son amour pour Gertrude.', ['Vrai', 'Faux'], 1, 'Il le nie et le déguise en charité : c’est le cœur du récit.'],
          ],
        },
        {
          titre: 'La Vie devant soi, Émile Ajar',
          lecon: {
            titre: 'Ajar (Romain Gary), 1975 — Momo et Madame Rosa',
            cours: `## L’histoire
À **Belleville**.

| Personnage | Qui il est |
| **Momo** | Petit garçon **arabe** d’une dizaine d’années |
| **Madame Rosa** | Ancienne prostituée **juive**, **rescapée d’Auschwitz** : elle garde les enfants de prostituées, **au sixième étage sans ascenseur** |
| Le docteur **Katz** | Le médecin |
| **Monsieur Hamil** | Il vieillit et **récite Victor Hugo** |
| **Madame Lola** | Ancien **boxeur sénégalais** devenu travesti |

| La fin | Ce qui se passe |
| Madame Rosa **s’affaiblit**, perd la tête | Elle redoute l’hôpital et « l’**acharnement thérapeutique** » |
| Momo l’aide à descendre au **sous-sol**, dans son « **trou juif** » | Il **reste auprès d’elle jusqu’à sa mort** |
| Puis | **Trois semaines encore**, avec du **parfum**, **avant qu’on ne les trouve** |

## À retenir
**Prix Goncourt 1975** sous le pseudonyme d’**Émile Ajar**.

> **Romain Gary**, qui l’avait déjà obtenu en **1956** pour *Les Racines du ciel*, devint ainsi le **seul écrivain deux fois goncourisé** — supercherie **révélée après son suicide, en 1980**.

| Ce qui porte le roman | Le détail |
| La **voix** de Momo | **Français fautif**, mots déformés, **humour et gravité mêlés** |

Thèmes : la **vieillesse**, la **dignité**, l’**amour hors des liens du sang**, la mémoire de la **Shoah**, l’**immigration**.

> « On peut pas vivre sans quelqu’un à aimer. »`,
          },
          questions: [
            ['Qui est Madame Rosa ?', ['Une ancienne prostituée juive rescapée d’Auschwitz, qui garde des enfants', 'La mère de Momo', 'Une infirmière', 'La concierge de l’immeuble'], 0, 'Elle vit au sixième étage sans ascenseur, à Belleville.'],
            ['Quelle est la particularité de la narration ?', ['Elle est portée par la voix de Momo, en français fautif', 'Elle est écrite à la troisième personne', 'Elle alterne plusieurs narrateurs', 'Elle est écrite en vers'], 0, 'Mots déformés, humour et gravité mêlés.'],
            ['Que redoute Madame Rosa à la fin de sa vie ?', ['L’hôpital et l’acharnement thérapeutique', 'La police', 'La solitude seulement', 'De perdre son argent'], 0, 'Momo l’aide à descendre dans son « trou juif ».'],
            ['Quel prix le roman a-t-il obtenu ?', ['Le prix Goncourt 1975', 'Le Renaudot', 'Le prix Femina', 'Le Médicis'], 0, 'Sous le pseudonyme d’Émile Ajar.'],
            ['Quelle supercherie littéraire est liée à ce livre ?', ['Émile Ajar était Romain Gary, déjà goncourisé en 1956', 'Le roman avait été écrit par un autre auteur', 'Le manuscrit était un plagiat', 'Le prix a été retiré'], 0, 'La vérité fut révélée après son suicide, en 1980.'],
            ['Le roman se déroule dans un quartier bourgeois de Paris.', ['Vrai', 'Faux'], 1, 'Il se déroule à Belleville, dans le Paris populaire et immigré des années 1970.'],
          ],
        },
        {
          titre: 'Le Barbier de Séville, Beaumarchais',
          lecon: {
            titre: 'Beaumarchais, 1775 — Figaro entre en scène',
            cours: `## L’histoire
Comédie en **quatre actes et en prose**.

| Personnage | Sa position |
| Le **comte Almaviva** | Amoureux de **Rosine**, il la suit à Séville |
| Le **docteur Bartholo** | Son **tuteur** : il veut l’**épouser pour sa dot** et **la surveille jour et nuit** |
| **Bazile** | Le maître de musique — l’homme de la fameuse **tirade sur la calomnie** |
| **Figaro** | Ancien valet du comte, devenu **barbier** et « **factotum de la ville** » |

| Le stratagème de Figaro | Le détail |
| Un **déguisement** | Le comte en **soldat ivre** |
| Un second | En **maître de musique remplaçant** |
| Une **lettre** qui circule | Le nœud |
| Un **notaire** qui arrive de nuit | Le mariage est signé **sous le nez de Bartholo** |

## À retenir
Première pièce de la **trilogie**, avec *Le Mariage de Figaro* et *La Mère coupable*.

> Figaro y est encore l’**adjuvant brillant du maître** — **pas encore le protagoniste politique** qu’il deviendra en **1784**.

Rythme d’**opéra**, **virtuosité verbale**, comique d’**intrigue**. **Rossini** en a tiré son opéra de **1816**.

> « Je me presse de rire de tout, de peur d’être obligé d’en pleurer. »`,
          },
          questions: [
            ['Qui empêche le mariage du comte et de Rosine ?', ['Le docteur Bartholo, son tuteur, qui veut l’épouser', 'Le père de Rosine', 'Bazile seul', 'Figaro'], 0, 'Il la surveille jour et nuit pour garder sa dot.'],
            ['Quel est le métier de Figaro dans cette pièce ?', ['Barbier et « factotum de la ville »', 'Valet du comte', 'Notaire', 'Maître de musique'], 0, 'Il deviendra valet du comte dans Le Mariage de Figaro.'],
            ['Quelle tirade célèbre Bazile prononce-t-il ?', ['La tirade de la calomnie', 'La tirade des nez', 'Le monologue du valet', 'L’éloge du mariage'], 0, 'Elle décrit la rumeur qui enfle jusqu’au fracas.'],
            ['Comment le comte s’introduit-il chez Bartholo ?', ['Déguisé en soldat ivre, puis en maître de musique remplaçant', 'Par une échelle de corde', 'En achetant la maison', 'En se faisant passer pour un notaire'], 0, 'Les déguisements successifs organisent l’intrigue.'],
            ['À quelle trilogie la pièce appartient-elle ?', ['La trilogie de Figaro', 'La trilogie marseillaise', 'La trilogie des Rougon', 'Aucune'], 0, 'Avec Le Mariage de Figaro et La Mère coupable.'],
            ['Figaro est déjà le protagoniste politique de cette pièce.', ['Vrai', 'Faux'], 1, 'Il est encore l’adjuvant brillant du maître : ce sera Le Mariage de Figaro, en 1784.'],
          ],
        },
        {
          titre: 'Le Château des Carpathes, Jules Verne',
          lecon: {
            titre: 'Verne, 1892 — le fantastique expliqué par la technique',
            cours: `## L’histoire
En **Transylvanie**, les villageois de **Werst** redoutent le **château abandonné** du baron **Rodolphe de Gortz**.

| Le signe inquiétant | Ce qu’on en dit |
| Des **fumées**, des **voix**, une **cloche** | Le château est hanté |
| Une apparition | On y aurait vu **La Stilla**, cantatrice célèbre **morte sur scène cinq ans plus tôt** |

| Étape | Ce qui se passe |
| Le jeune comte **Franz de Télek** | Il avait **aimé La Stilla** : il **monte au château** |
| Ce qu’il éprouve | Il **entend sa voix**, **croit la voir apparaître** |
| La vérité | Gortz, **amoureux fou** de la cantatrice, avait fait **enregistrer sa voix sur des phonographes** et **projette son image** par un jeu de **miroirs** |
| La fin | Le château **saute** ; Franz sombre dans la **folie** avant de guérir |

## À retenir
Roman **tardif** de Verne (**1892**), où le **fantastique** est **mis en place puis démonté par la technique**.

> **Phonographe** et **projection optique** — inventions **récentes** — **produisent le surnaturel**.

| Ce que le livre annonce | Pourquoi |
| Le **cinéma** | Quelques années **avant les frères Lumière** |
| Une réflexion sur l’**image** | Elle **survit à la personne** |

> « Cette histoire n’est pas fantastique, elle n’est que romanesque. »`,
          },
          questions: [
            ['Où se déroule le roman ?', ['En Transylvanie, autour d’un château abandonné', 'En Écosse', 'Dans les Alpes', 'En Bohême'], 0, 'Les villageois de Werst redoutent le lieu.'],
            ['Qui est La Stilla ?', ['Une cantatrice célèbre, morte sur scène cinq ans plus tôt', 'La fille du baron', 'Une paysanne du village', 'Une servante du château'], 0, 'Franz de Télek l’avait aimée.'],
            ['Comment s’explique l’apparition de La Stilla ?', ['Un enregistrement phonographique et une projection par miroirs', 'Un fantôme réel', 'Une hallucination collective', 'Une sœur jumelle'], 0, 'Le fantastique est démonté par la technique.'],
            ['Quelle invention le roman préfigure-t-il ?', ['Le cinéma', 'La télévision par satellite', 'Le téléphone', 'La radio'], 0, 'Quelques années avant les frères Lumière.'],
            ['Que devient Franz après la découverte ?', ['Il sombre dans la folie avant de guérir', 'Il épouse La Stilla', 'Il meurt dans l’explosion', 'Il devient le maître du château'], 0, 'Le château saute à la fin du roman.'],
            ['Le roman conclut à l’existence réelle du surnaturel.', ['Vrai', 'Faux'], 1, 'Verne fait exactement l’inverse : « cette histoire n’est pas fantastique ».'],
          ],
        },
        {
          titre: 'Le Cid, Pierre Corneille',
          lecon: {
            titre: 'Corneille, 1637 — l’honneur contre l’amour',
            cours: `## L’histoire
**Rodrigue** et **Chimène** s’aiment et vont être mariés.

| Étape | Ce qui se passe |
| L’affront | Le père de Chimène, **don Gomès**, **gifle** le père de Rodrigue, **don Diègue**, **trop vieux pour se venger** |
| Le dilemme | Don Diègue demande à son fils de **laver l’affront** — d’où les célèbres **stances**, monologue de délibération |
| L’acte | Rodrigue **tue le père de Chimène** en duel |
| Le devoir de Chimène | Elle **réclame au roi la mort de Rodrigue** — **tout en l’aimant toujours** |
| La gloire | Rodrigue **repousse une invasion maure** et revient en héros, surnommé **le Cid** par ses ennemis |
| La fin | Le roi **ruse** pour éprouver Chimène, ordonne un **duel judiciaire** contre don Sanche, puis **diffère le mariage d’un an** |

> **La fin est ouverte.**

## À retenir
La pièce qui a déclenché la **querelle du Cid** (**1637**).

| Le reproche de l’Académie | Le détail |
| Les **unités** | Trop de temps, trop de lieux |
| La **bienséance** | **Chimène épousant le meurtrier de son père** |

> Corneille y invente le **héros cornélien** : **celui qui se grandit en choisissant le devoir — sans cesser d’aimer**.

> « Va, cours, vole, et nous venge. »`,
          },
          questions: [
            ['Pourquoi Rodrigue tue-t-il le père de Chimène ?', ['Pour laver l’affront fait à son propre père', 'Par jalousie', 'Sur ordre du roi', 'Par accident'], 0, 'Don Diègue est trop vieux pour se venger lui-même.'],
            ['Comment appelle-t-on le monologue de délibération de Rodrigue ?', ['Les stances', 'Le récit de Théramène', 'La tirade des nez', 'L’imprécation'], 0, 'Il y pèse l’honneur contre l’amour.'],
            ['Que fait Chimène après la mort de son père ?', ['Elle réclame la mort de Rodrigue tout en l’aimant', 'Elle pardonne aussitôt', 'Elle entre au couvent', 'Elle fuit la cour'], 0, 'Le devoir et l’amour la déchirent également.'],
            ['Comment Rodrigue devient-il « le Cid » ?', ['En repoussant une invasion maure', 'En gagnant un tournoi', 'Par une décision du roi', 'Par héritage'], 0, 'Ce sont ses ennemis qui lui donnent ce nom.'],
            ['Que reprochait l’Académie française à la pièce ?', ['D’enfreindre les unités et la bienséance', 'D’être écrite en prose', 'De manquer d’action', 'D’être trop courte'], 0, 'C’est la querelle du Cid, en 1637.'],
            ['La pièce se termine par le mariage immédiat de Rodrigue et Chimène.', ['Vrai', 'Faux'], 1, 'Le roi le diffère d’un an : la fin reste ouverte.'],
          ],
        },
        {
          titre: 'Le Colonel Chabert, Honoré de Balzac',
          lecon: {
            titre: 'Balzac, 1832 — le mort qui revient',
            cours: `## L’histoire
Un homme **misérable** se présente à l’étude de l’avoué **Derville**.

| Ce qu’il affirme | Le détail |
| Il est le **colonel Chabert** | Héros d’**Eylau**, **déclaré mort en 1807** |
| Il s’est **extrait d’une fosse commune** | Où on l’avait enterré |
| Sa femme, remariée au **comte Ferraud** | A **hérité de sa fortune** — et **refuse de le reconnaître** |

| Étape | Ce qui se passe |
| La procédure | **Derville**, convaincu, l’engage |
| La manœuvre | La comtesse **attendrit** Chabert, l’**attire à la campagne**, lui fait presque **signer un désistement** |
| La découverte | Il comprend **qu’elle le méprise** |
| Le **renoncement** | Écœuré, il renonce **à sa fortune, à son nom, à son identité** |
| L’épilogue | Des années plus tard, Derville le retrouve à l’**hospice de Bicêtre**, où il **se fait appeler par un numéro** |

## À retenir
Un **récit bref et féroce** des *Scènes de la vie privée*.

| Ce qui broie Chabert | Le détail |
| La **justice** | Une machine |
| L’**argent** et le **mariage** | Une comptabilité |
| L’**histoire** | Un héros de l’Empire, **devenu inutile sous la Restauration** |

> **Derville**, l’homme de loi **honnête**, a la fonction du **témoin lucide**.

> « J’ai été enterré sous des morts ; mais maintenant je suis enterré sous des vivants. »`,
          },
          questions: [
            ['Qui est le colonel Chabert ?', ['Un héros d’Eylau déclaré mort, revenu réclamer son identité', 'Un notaire ruiné', 'Un officier de la Restauration', 'Un aventurier imposteur'], 0, 'Il s’est extrait d’une fosse commune.'],
            ['Pourquoi sa femme refuse-t-elle de le reconnaître ?', ['Elle s’est remariée et a hérité de sa fortune', 'Elle ne le reconnaît pas physiquement', 'Elle est menacée', 'Elle est partie à l’étranger'], 0, 'Elle est devenue comtesse Ferraud.'],
            ['Quel personnage aide Chabert ?', ['L’avoué Derville', 'Le comte Ferraud', 'Le notaire Roguin', 'Le juge de paix'], 0, 'Il est le témoin lucide du récit.'],
            ['Que décide finalement Chabert ?', ['Il renonce à sa fortune, à son nom et à son identité', 'Il gagne son procès', 'Il tue sa femme', 'Il part à l’étranger avec Derville'], 0, 'Le dégoût l’emporte sur l’intérêt.'],
            ['Où Derville le retrouve-t-il des années plus tard ?', ['À l’hospice de Bicêtre, désigné par un numéro', 'Sur un champ de bataille', 'Dans une prison', 'Dans une ferme de province'], 0, 'La perte d’identité y est achevée.'],
            ['Le roman montre la justice comme une protection efficace des innocents.', ['Vrai', 'Faux'], 1, 'Il la montre comme une machine où l’argent et le temps décident.'],
          ],
        },
        {
          titre: 'Le Comte de Monte-Cristo, Alexandre Dumas',
          lecon: {
            titre: 'Dumas, 1844 — la vengeance méthodique',
            cours: `## L’histoire
| Étape | Ce qui se passe |
| Le bonheur | **Edmond Dantès**, jeune marin, va être **capitaine** et épouser **Mercédès** |
| La dénonciation | Par **jalousie** — **Danglars**, **Fernand** — et par **calcul** — le procureur **Villefort** |
| La prison | **Quatorze ans** au **château d’If**, **sans jugement** |
| Le maître | L’abbé **Faria** l’instruit, lui **révèle le complot** et lui lègue le secret d’un **trésor** dans l’île de **Monte-Cristo** |
| L’évasion | Il prend **la place du mort** dans un sac **jeté à la mer** |
| La vengeance | Sous plusieurs identités — dont le **comte de Monte-Cristo** — il détruit **méthodiquement** ses ennemis : ruine, déshonneur, folie, suicide |
| Le doute | La vengeance **atteint aussi des innocents** : il **s’en trouble** — et **part**, avec **Haydée** |

## À retenir
Roman-feuilleton de **1844**, écrit avec **Auguste Maquet** : l’un des **plus lus au monde**.

| Sa structure | Ses trois temps |
| Implacable | **Bonheur**, **injustice**, **vengeance** |

> Il pose une **question morale sérieuse** — **jusqu’où la vengeance est-elle juste ?** — **sous les habits du roman populaire**.

> « Attendre et espérer. »`,
          },
          questions: [
            ['Pourquoi Edmond Dantès est-il emprisonné ?', ['Il est dénoncé par jalousie et par calcul politique', 'Pour vol', 'Pour désertion', 'Par erreur d’identité'], 0, 'Danglars, Fernand et Villefort y ont chacun leur part.'],
            ['Combien de temps reste-t-il au château d’If ?', ['Quatorze ans', 'Deux ans', 'Trente ans', 'Cinq ans'], 0, 'L’abbé Faria l’y instruit et lui révèle le complot.'],
            ['Comment Dantès s’évade-t-il ?', ['En prenant la place du mort dans un sac jeté à la mer', 'En creusant un tunnel jusqu’à la côte', 'En soudoyant un gardien', 'Lors d’un transfert'], 0, 'L’évasion est l’un des morceaux les plus célèbres du roman.'],
            ['Que trouve-t-il sur l’île de Monte-Cristo ?', ['Un trésor légué par l’abbé Faria', 'Un navire', 'Des documents compromettants', 'Une famille amie'], 0, 'Il en tire son identité de comte.'],
            ['Quelle question morale le roman pose-t-il ?', ['Jusqu’où la vengeance est-elle juste ?', 'Faut-il pardonner à l’État ?', 'La richesse rend-elle heureux ?', 'La justice existe-t-elle en mer ?'], 0, 'La vengeance atteint des innocents, et Dantès s’en trouble.'],
            ['Dumas a écrit ce roman seul.', ['Vrai', 'Faux'], 1, 'Il l’a écrit avec Auguste Maquet, comme la plupart de ses grands romans.'],
          ],
        },
        {
          titre: 'Le Dernier Jour d’un condamné, Victor Hugo',
          lecon: {
            titre: 'Hugo, 1829 — un plaidoyer déguisé en journal',
            cours: `## L’œuvre
Récit à la **première personne** : un homme condamné à mort écrit pendant les **six semaines**, puis les **dernières heures**, qui précèdent son exécution.

> On ne saura **ni son nom, ni son crime**. Hugo l’a voulu ainsi : **pour que le lecteur ne puisse pas se rassurer en jugeant le personnage**.

| Étape du récit | Ce qu’elle montre |
| **Bicêtre** | L’attente |
| Le **ferrement des forçats** | La foule et le spectacle |
| Le transfert à la **Conciergerie** | Le compte à rebours |
| La visite de sa **fille de trois ans** | Elle **ne le reconnaît plus** |
| La **toilette du condamné**, la charrette | La mécanique |
| La **place de Grève** | La fin |

> Le récit s’arrête **net** : « **QUATRE HEURES.** »

## À retenir
Un **plaidoyer contre la peine de mort**, publié **anonymement** en **1829** — Hugo ne le revendiquera que dans la préface de **1832**.

| L’argument | Sa nature |
| Il n’est **pas juridique** | Il est **expérimental** |
| Il fait **éprouver** au lecteur | **Minute par minute**, l’attente de l’échafaud |

Hugo poursuivra ce combat toute sa vie — *Claude Gueux*, discours de 1848. La peine de mort sera abolie en France en **1981**.

> « Condamné à mort ! Voilà cinq semaines que j’habite avec cette pensée. »`,
          },
          questions: [
            ['Que sait-on du narrateur ?', ['Ni son nom, ni son crime', 'Son nom seulement', 'Son crime seulement', 'Tout son passé'], 0, 'Hugo l’a voulu ainsi pour empêcher le lecteur de se rassurer.'],
            ['Quelle est la forme du récit ?', ['Un journal à la première personne, en chapitres brefs', 'Un plaidoyer d’avocat', 'Un dialogue en prison', 'Un poème'], 0, 'Quarante-neuf chapitres, jusqu’aux dernières minutes.'],
            ['Quelle scène bouleverse le condamné avant l’exécution ?', ['La visite de sa fille, qui ne le reconnaît plus', 'La lecture du verdict', 'La confession au prêtre', 'La rencontre d’un autre condamné'], 0, 'Elle ôte au personnage son dernier lien au monde.'],
            ['Par quels mots le récit s’achève-t-il ?', ['« QUATRE HEURES »', '« Adieu »', '« C’est fini »', '« Je meurs innocent »'], 0, 'Le texte s’arrête net, au moment de l’exécution.'],
            ['Quel est le but de l’œuvre ?', ['Plaider contre la peine de mort en la faisant éprouver', 'Raconter un fait divers', 'Défendre un innocent réel', 'Décrire les prisons de Paris'], 0, 'L’argument est expérimental plus que juridique.'],
            ['La peine de mort a été abolie en France peu après la publication.', ['Vrai', 'Faux'], 1, 'Il faudra attendre 1981 : Hugo a mené ce combat toute sa vie.'],
          ],
        },
        {
          titre: 'Le Dindon, Georges Feydeau',
          lecon: {
            titre: 'Feydeau, 1896 — trois actes, personne d’innocent',
            cours: `## L’histoire
| Étape | Ce qui se passe |
| Le départ | **Pontagnac** poursuit dans la rue **Lucienne Vatelin** **jusque chez elle** — et découvre qu’elle est **la femme de son ami** |
| Le serment | Vexée, Lucienne jure à son mari une **fidélité conditionnelle** : elle ne cédera à Pontagnac **que si son mari la trompe** |
| L’ironie | Or **Vatelin est justement relancé** par une ancienne maîtresse anglaise, **Maggy Soldignac**, qui débarque à Paris |
| Le rendez-vous | À l’hôtel **Ultimus** |

| À l’hôtel | Ce qui s’y croise |
| Maris, femmes, amants | Un **commissaire** |
| Une **sonnerie électrique** | Un **lit à ressorts** |

| Le dénouement | Ce qui reste |
| Tout rentre dans l’ordre | **Personne n’a réussi à tromper personne** |
| **Pontagnac**, découvert par sa propre femme | Se retrouve « **le dindon** » de la farce |

## À retenir
Un des **vaudevilles les plus parfaits** de Feydeau : **mécanique implacable**, portes, quiproquos, **objets qui déclenchent des catastrophes**.

> Le titre dit la morale : **celui qui manœuvre le plus est celui qui perd**.

Satire féroce du **mariage bourgeois**, où l’**adultère est moins un désir qu’une convention sociale**.

> Chez Feydeau, la vertu est presque toujours un accident de calendrier.`,
          },
          questions: [
            ['Que découvre Pontagnac en suivant une femme dans la rue ?', ['Qu’elle est la femme de son ami Vatelin', 'Qu’elle est mariée à un policier', 'Qu’elle est sa cousine', 'Qu’elle est une actrice célèbre'], 0, 'La situation initiale enclenche toute la mécanique.'],
            ['Quelle promesse Lucienne fait-elle ?', ['Ne céder à Pontagnac que si son mari la trompe', 'Ne jamais revoir Pontagnac', 'Quitter Paris', 'Divorcer immédiatement'], 0, 'Le vaudeville transforme aussitôt la condition en piège.'],
            ['Où se déroule l’acte central ?', ['À l’hôtel Ultimus', 'Chez les Vatelin', 'Au théâtre', 'Dans un restaurant'], 0, 'Portes, sonnerie électrique et lit à ressorts y font le reste.'],
            ['Qui est « le dindon » de la farce ?', ['Pontagnac, découvert par sa propre femme', 'Vatelin', 'Maggy', 'Le commissaire'], 0, 'Celui qui manœuvre le plus est celui qui perd.'],
            ['Que dénonce la pièce sous le rire ?', ['Le mariage bourgeois et l’adultère devenu convention', 'La corruption politique', 'La misère ouvrière', 'La justice de classe'], 0, 'Personne n’y agit vraiment par désir.'],
            ['La pièce se termine par plusieurs adultères accomplis.', ['Vrai', 'Faux'], 1, 'Personne n’a réussi à tromper personne : l’ordre revient intact.'],
          ],
        },
        {
          titre: 'Le Grand Meaulnes, Alain Fournier',
          lecon: {
            titre: 'Alain-Fournier, 1913 — le domaine qu’on ne retrouve pas',
            cours: `## L’histoire
**François Seurel**, fils d’instituteur en **Sologne**, raconte l’arrivée dans son école d’**Augustin Meaulnes**, dit **le grand Meaulnes**.

| Étape | Ce qui se passe |
| La disparition | Meaulnes disparaît **trois jours** et revient **transformé** |
| Ce qu’il a trouvé | En **se perdant** : un **domaine mystérieux**, une **fête étrange**, et **Yvonne de Galais**, dont il tombe amoureux |
| L’obstacle | **Impossible de retrouver le chemin** |
| La recherche | Des années ; la rencontre de **Frantz de Galais**, le frère **fantasque** dont les fiançailles avaient échoué ; une **promesse imprudente** |
| Les retrouvailles | Il épouse **Yvonne** — puis **repart immédiatement** pour tenir sa promesse |
| La fin | Yvonne **meurt en donnant naissance à une fille** ; Meaulnes revient enfin, et **repart avec l’enfant** |

## À retenir
Roman **unique** d’**Alain-Fournier**, publié en **1913** — l’auteur est **tué au front en 1914**, à **vingt-sept ans**.

| Ce que le livre tient ensemble | Le détail |
| Le **réalisme rural** | L’école, la Sologne, les saisons |
| Une atmosphère de **conte** | La fête, le domaine, la disparition |

> Thème central : l’**adolescence**, l’**absolu entrevu une fois** — et l’**impossibilité d’y revenir**.

L’un des romans français **les plus lus** du XXe siècle.

> « Il eût mieux valu ne jamais retrouver le domaine. »`,
          },
          questions: [
            ['Qui raconte l’histoire ?', ['François Seurel, le camarade de Meaulnes', 'Meaulnes lui-même', 'Yvonne de Galais', 'Un narrateur omniscient'], 0, 'Fils d’instituteur, il observe et rapporte.'],
            ['Que découvre Meaulnes pendant sa disparition ?', ['Un domaine mystérieux où se déroule une fête étrange', 'Une ville abandonnée', 'Un cirque ambulant', 'Une famille de bohémiens'], 0, 'Il y rencontre Yvonne de Galais.'],
            ['Quel est le drame du roman ?', ['Meaulnes ne parvient pas à retrouver le chemin du domaine', 'Yvonne refuse de le revoir', 'François le trahit', 'Le domaine n’a jamais existé'], 0, 'L’absolu entrevu une fois devient introuvable.'],
            ['Pourquoi Meaulnes repart-il aussitôt après son mariage ?', ['Pour tenir une promesse faite à Frantz de Galais', 'Parce qu’il n’aime plus Yvonne', 'Pour chercher du travail', 'Parce qu’il est appelé à l’armée'], 0, 'La promesse imprudente détruit son bonheur.'],
            ['Quel est le destin de l’auteur ?', ['Il est tué au front en 1914, à vingt-sept ans', 'Il a écrit dix romans', 'Il est mort de maladie en 1950', 'Il a cessé d’écrire après ce livre'], 0, 'Le Grand Meaulnes est son unique roman.'],
            ['Le roman est un pur conte, sans ancrage réaliste.', ['Vrai', 'Faux'], 1, 'L’école, la Sologne et les saisons y sont peintes avec précision.'],
          ],
        },
        {
          titre: 'Le Guépard, Giuseppe Tomasi di Lampedusa',
          lecon: {
            titre: 'Lampedusa, 1958 — « il faut que tout change… »',
            cours: `## L’histoire
**Sicile, 1860.** Garibaldi débarque ; l’unité italienne se fait.

| Personnage | Sa position |
| **Don Fabrizio Salina**, prince sicilien | **Lucide et fatigué**, il observe **la fin de son monde** |
| Son neveu **Tancredi** | Il rejoint les **garibaldiens**, puis l’**armée royale** |
| **Angelica** | Fille du maire parvenu **Don Calogero Sedàra** : Tancredi l’épouse |
| La fortune neuve | Elle **remplace** celle de la noblesse ruinée |

| Étape | Ce qui se passe |
| Le refus | Le prince **refuse un siège de sénateur**, expliquant que **les Siciliens ne veulent pas changer** |
| Le **bal** | Somptueux, à Palerme |
| La mort du prince | **1883** |
| L’épilogue, **1910** | Ses filles vieillies, une chapelle **pleine de fausses reliques**, un **chien empaillé jeté à la poubelle** |

## À retenir
Roman **posthume** (**1958**), **refusé de son vivant**, **prix Strega**, immense succès mondial ; film de **Visconti** (1963).

> Il donne la formule la plus citée sur le conservatisme politique : « **Il faut que tout change pour que rien ne change.** »

Méditation sur la **mort**, le **temps** et la **Sicile** ; ton d’**ironie mélancolique**.

> « Se vogliamo che tutto rimanga come è, bisogna che tutto cambi. »`,
          },
          questions: [
            ['Quel moment historique le roman décrit-il ?', ['Le Risorgimento : le débarquement de Garibaldi en Sicile, en 1860', 'La Première Guerre mondiale', 'Le fascisme', 'Les guerres napoléoniennes'], 0, 'L’unité italienne se fait sous les yeux du prince Salina.'],
            ['Quelle est la formule la plus célèbre du roman ?', ['« Il faut que tout change pour que rien ne change »', '« Rien ne se perd, rien ne se crée »', '« Après moi, le déluge »', '« La fin justifie les moyens »'], 0, 'Elle est prononcée par Tancredi.'],
            ['Qui épouse Tancredi ?', ['Angelica, fille du maire parvenu', 'Concetta, la fille du prince', 'Une aristocrate napolitaine', 'Personne'], 0, 'La fortune neuve remplace la noblesse ruinée.'],
            ['Que refuse le prince Salina ?', ['Un siège de sénateur du nouveau royaume', 'Le mariage de Tancredi', 'De quitter la Sicile', 'De recevoir Sedàra'], 0, 'Il explique que les Siciliens ne veulent pas changer.'],
            ['Quand le roman a-t-il été publié ?', ['En 1958, après la mort de son auteur', 'En 1930', 'En 1945', 'En 1963'], 0, 'Il avait été refusé du vivant de Lampedusa.'],
            ['Le roman a été adapté au cinéma par Visconti.', ['Vrai', 'Faux'], 0, 'En 1963, avec Burt Lancaster, Alain Delon et Claudia Cardinale.'],
          ],
        },
        {
          titre: 'Le Horla, Guy de Maupassant',
          lecon: {
            titre: 'Maupassant, 1887 — le journal d’un homme qui se perd',
            cours: `## L’histoire
Version définitive publiée en **1887**, sous forme de **journal intime**.

| Étape | Ce qui se passe |
| Le geste anodin | Le narrateur **salue un trois-mâts brésilien** qui passe — il en fera plus tard **l’origine de son mal** |
| L’angoisse | Inexplicable ; il se sent **oppressé la nuit** |
| Les indices | Sa **carafe se vide**, une **rose se coupe seule**, une **page se tourne sans main** |
| Le nom | Il appelle cet être invisible le **Horla** |
| Les explications | Un séjour à Paris, une séance d’**hypnotisme**, un article sur une **épidémie de folie au Brésil** |
| La conclusion | **Une espèce nouvelle vient remplacer l’homme** |
| L’acte | Il **enferme le Horla dans sa maison** et y **met le feu** — **brûlant ses domestiques** |
| La chute | L’être **a survécu** : « il va donc falloir **que je me tue, moi** » |

## À retenir
Chef-d’œuvre du **fantastique**.

> **Rien ne permet de trancher entre la folie et le surnaturel** — et c’est **cette hésitation**, disait **Todorov**, **qui définit le genre**.

| Le procédé | Son effet |
| La forme du **journal** | Elle rend la **contamination progressive** |

Maupassant lui-même **mourra fou**, syphilitique, **six ans plus tard**.

> « Il est venu, celui que redoutaient les premières terreurs des peuples naïfs. »`,
          },
          questions: [
            ['Quelle est la forme du récit ?', ['Un journal intime', 'Une lettre', 'Un récit à la troisième personne', 'Un dialogue avec un médecin'], 0, 'Elle rend sensible la contamination progressive.'],
            ['Quels signes inquiètent le narrateur ?', ['Sa carafe se vide, une rose se coupe seule, une page se tourne', 'Des bruits dans le grenier', 'Des lettres anonymes', 'Des apparitions lumineuses'], 0, 'Les faits sont minuscules et invérifiables.'],
            ['Comment nomme-t-il l’être invisible ?', ['Le Horla', 'Le Double', 'L’Ombre', 'Le Veilleur'], 0, 'Le nom lui-même est une invention du narrateur.'],
            ['Que fait-il pour s’en débarrasser ?', ['Il met le feu à sa maison, tuant ses domestiques', 'Il déménage', 'Il consulte un exorciste', 'Il fuit au Brésil'], 0, 'Puis il comprend que l’être a survécu.'],
            ['Qu’est-ce qui définit le fantastique dans ce texte ?', ['L’hésitation entre folie et surnaturel', 'La présence certaine d’un monstre', 'L’explication scientifique finale', 'Le décor médiéval'], 0, 'Todorov en a fait la définition même du genre.'],
            ['Le récit tranche clairement en faveur du surnaturel.', ['Vrai', 'Faux'], 1, 'Rien ne permet de décider : c’est ce qui fait sa force.'],
          ],
        },
        {
          titre: 'Le Hussard sur le toit, Jean Giono',
          lecon: {
            titre: 'Giono, 1951 — traverser le choléra',
            cours: `## L’histoire
**1832**, en Provence. **Angelo Pardi**, jeune colonel de hussards piémontais, **carbonaro en fuite**, traverse une région ravagée par le **choléra**.

| Ce qu’il découvre | Le détail |
| Villages morts, cadavres, corbeaux | La panique, les **quarantaines** |
| La **barbarie des vivants** | **Plus que celle de la maladie** |

| Étape | Ce qui se passe |
| L’accusation | Poursuivi comme **empoisonneur de fontaines** |
| Le refuge | Il se réfugie sur les **toits de Manosque**, d’où il **observe la ville** |
| La rencontre | **Pauline de Théus**, qui cherche son mari : ils voyagent ensemble, **s’aident, se protègent — sans se toucher** |
| Le sommet | Pauline contracte le choléra ; il la **sauve en la frictionnant toute une nuit** |
| La fin | Il la **ramène chez elle** et **repart pour l’Italie** |

## À retenir
Le plus célèbre roman du « **second Giono** », d’après-guerre : **moins lyrique, plus romanesque**, influencé par **Stendhal**.

| Genre | Ce qu’il apporte |
| Roman d’**épidémie** | Le tableau collectif |
| Roman d’**aventures** | Le mouvement |

> Il tient par un héros de la **générosité** : **Angelo agit toujours bien, sans calcul** — ce qui fait de lui **un personnage rare**.

La **retenue amoureuse** entre Angelo et Pauline est l’un des **sommets** du livre. Adapté au cinéma par **Rappeneau** (1995).

> Le choléra y révèle les hommes, il ne les change pas.`,
          },
          questions: [
            ['Quelle épidémie traverse le roman ?', ['Le choléra de 1832', 'La peste noire', 'La grippe espagnole', 'La variole'], 0, 'Le roman se déroule en Provence.'],
            ['Qui est Angelo Pardi ?', ['Un jeune colonel de hussards piémontais, carbonaro en fuite', 'Un médecin français', 'Un prêtre italien', 'Un marchand de Manosque'], 0, 'Il est poursuivi comme empoisonneur de fontaines.'],
            ['Pourquoi se réfugie-t-il sur les toits ?', ['Pour échapper à la foule qui l’accuse', 'Pour observer les étoiles', 'Pour soigner les malades', 'Pour attendre Pauline'], 0, 'D’où le titre du roman.'],
            ['Comment sauve-t-il Pauline ?', ['En la frictionnant toute une nuit', 'En lui donnant un remède', 'En appelant un médecin', 'En la conduisant à l’hôpital'], 0, 'La scène est l’un des sommets du livre.'],
            ['Quelle qualité définit le héros ?', ['Une générosité sans calcul', 'La ruse', 'L’ambition', 'La cruauté froide'], 0, 'Angelo agit toujours bien, ce qui en fait un personnage rare.'],
            ['La relation entre Angelo et Pauline devient une liaison amoureuse.', ['Vrai', 'Faux'], 1, 'La retenue est totale : il la ramène chez elle et repart.'],
          ],
        },
        {
          titre: 'Le Jeu de l’amour et du hasard, Marivaux',
          lecon: {
            titre: 'Marivaux, 1730 — deux couples, deux déguisements',
            cours: `## L’histoire
Comédie en **trois actes et en prose**.

| Personnage | Son déguisement |
| **Silvia** | Elle échange son rôle avec sa suivante **Lisette**, **pour observer librement** le prétendant |
| **Dorante** | Il a eu **exactement la même idée** : il arrive **en valet**, sous le nom de **Bourguignon** |
| **Arlequin**, son valet | Il **se fait passer pour lui** |
| **Orgon** et **Mario** | Le père et le frère **connaissent les deux stratagèmes** — et **laissent faire** |

| Le résultat | Ce qu’il produit |
| Le **vrai maître** et la **vraie maîtresse** s’aiment **sous des habits de domestiques** | Ce qui les **scandalise** et les **bouleverse** |
| **Dorante avoue le premier** | — |
| **Silvia prolonge le jeu** | Jusqu’à obtenir **qu’il la demande en mariage en la croyant servante** — puis elle se démasque |

## À retenir
La comédie **la plus jouée** de Marivaux.

| Le déguisement sert d’**épreuve** | La question |
| — | **Peut-on aimer par-delà la condition sociale ?** |

> La réponse est **nuancée** : **Arlequin et Lisette se reconnaissent aussi comme domestiques** — et **l’ordre social n’est finalement pas renversé**.

Langue du **marivaudage** : **dire et retarder l’aveu**.

> « Je vois clair dans mon cœur. »`,
          },
          questions: [
            ['Pourquoi Silvia échange-t-elle son rôle avec Lisette ?', ['Pour observer librement le prétendant qu’on lui destine', 'Pour fuir son père', 'Pour se moquer de Dorante', 'Pour aider Lisette à se marier'], 0, 'Dorante a exactement la même idée de son côté.'],
            ['Sous quel nom Dorante se présente-t-il ?', ['Bourguignon', 'Arlequin', 'Mario', 'Frontin'], 0, 'Son valet Arlequin se fait passer pour lui.'],
            ['Qui connaît les deux stratagèmes ?', ['Orgon et Mario', 'Personne', 'Lisette seule', 'Arlequin seul'], 0, 'Ils laissent faire, et observent avec amusement.'],
            ['Quelle épreuve Silvia impose-t-elle à Dorante ?', ['Qu’il la demande en mariage en la croyant servante', 'Qu’il renonce à sa fortune', 'Qu’il se batte en duel', 'Qu’il quitte la maison'], 0, 'Elle prolonge le jeu après l’aveu de Dorante.'],
            ['Que se passe-t-il pour Arlequin et Lisette ?', ['Ils se découvrent domestiques tous les deux et s’en accommodent', 'Ils se séparent', 'Ils épousent leurs maîtres', 'Ils quittent la maison'], 0, 'L’ordre social n’est finalement pas renversé.'],
            ['Le déguisement sert d’épreuve pour l’amour dans cette pièce.', ['Vrai', 'Faux'], 0, 'Peut-on aimer par-delà la condition sociale ? La réponse est nuancée.'],
          ],
        },
        {
          titre: 'Le Lys dans la vallée, Honoré de Balzac',
          lecon: {
            titre: 'Balzac, 1836 — l’amour retenu, jusqu’à la mort',
            cours: `## L’histoire
| Étape | Ce qui se passe |
| Le premier geste | **Félix de Vandenesse**, jeune homme **mal aimé de sa mère**, rencontre à un bal **Henriette de Mortsauf** et, dans un élan, **lui embrasse les épaules** |
| Le décor | Il la retrouve en **Touraine**, à **Clochegourde** : mariée à un comte **malade, aigri et tyrannique**, mère de **deux enfants fragiles** |
| L’amour | **Jamais consommé** : promenades, lettres, dévouement, **souffrance** |
| La règle | Henriette impose la **vertu** et le **renoncement** — **tout en vivant de cette passion** |
| La rupture | À Paris, Félix devient l’amant de **lady Dudley**, Anglaise **sensuelle** |
| La fin | Henriette l’apprend, **se laisse mourir de faim et de chagrin**, et lui laisse une **lettre bouleversante** avouant ce qu’elle a **réprimé** |

## À retenir
Roman **lyrique et cruel**, écrit **en réponse** au *Volupté* de **Sainte-Beuve**.

| L’image centrale | Ce qu’elle porte |
| La **vallée de l’Indre** | Décrite **comme un corps** |
| Henriette | Une **fleur** — le « **lys** » |

> Balzac y montre la **vertu comme une souffrance** et le **renoncement comme une forme de destruction**.

La **longue lettre finale** d’Henriette est l’une des **grandes pages** de la littérature française.

> « Vous avez été mon seul plaisir, et vous m’avez tuée. »`,
          },
          questions: [
            ['Où se déroule l’essentiel du roman ?', ['En Touraine, à Clochegourde, dans la vallée de l’Indre', 'À Paris', 'En Bretagne', 'En Angleterre'], 0, 'La vallée y est décrite comme un corps.'],
            ['Quelle est la nature de la relation entre Félix et Henriette ?', ['Un amour intense mais jamais consommé', 'Une liaison secrète', 'Un mariage arrangé', 'Une amitié sans trouble'], 0, 'Henriette impose la vertu tout en vivant de cette passion.'],
            ['Qui est lady Dudley ?', ['Une Anglaise sensuelle dont Félix devient l’amant à Paris', 'La sœur d’Henriette', 'La mère de Félix', 'Une amie de Clochegourde'], 0, 'Henriette l’apprend et se laisse mourir.'],
            ['Comment meurt Henriette ?', ['De faim et de chagrin', 'D’une maladie contagieuse', 'En couches', 'Assassinée'], 0, 'Elle laisse une lettre où elle avoue tout ce qu’elle avait réprimé.'],
            ['À quel livre le roman répond-il ?', ['Volupté de Sainte-Beuve', 'Adolphe de Constant', 'René de Chateaubriand', 'Les Confessions de Rousseau'], 0, 'Balzac voulait montrer qu’il pouvait traiter ce sujet mieux que lui.'],
            ['Le roman présente le renoncement comme une réussite morale sereine.', ['Vrai', 'Faux'], 1, 'Il le montre comme une souffrance et une forme de destruction.'],
          ],
        },
        {
          titre: 'Le Malade imaginaire, Molière',
          lecon: {
            titre: 'Molière, 1673 — la dernière pièce',
            cours: `## L’histoire
Comédie-ballet en **trois actes**.

| Étape | Ce qui se passe |
| Le projet | **Argan**, obsédé par sa santé et par ses lavements, veut marier sa fille **Angélique** au médecin ridicule **Thomas Diafoirus** — **pour avoir un médecin dans la famille** |
| L’obstacle | Elle aime **Cléante** |
| Le premier stratagème | **Toinette** se déguise en **médecin de passage** et **contredit Purgon** |
| Le second | **Argan feint d’être mort** |
| L’épreuve de vérité | Sa seconde femme **Béline se réjouit** ; **Angélique pleure** |
| Le dénouement | Il accepte le mariage **à condition que Cléante devienne médecin** — d’où la **cérémonie burlesque** en **faux latin**, où **c’est Argan lui-même qu’on reçoit médecin** |

## À retenir
Créée en **1673**. Molière, **malade**, **joue Argan** — et **meurt le soir de la quatrième représentation**.

| Ce que la pièce vise | Le détail |
| La **médecine comme pouvoir** | Le **jargon**, l’**autorité**, le **latin** |
| Le **théâtre** | **On ne guérit Argan qu’en jouant** |

> C’est le point central : **jouer un rôle est le moyen d’accéder à la vérité**.

> « Dignus, dignus est intrare in nostro docto corpore. »`,
          },
          questions: [
            ['Que veut Argan pour sa fille ?', ['Un mari médecin, Thomas Diafoirus', 'Un mariage riche', 'Un couvent', 'Un mariage avec Cléante'], 0, 'Il veut un médecin dans la famille pour lui seul.'],
            ['Quel stratagème démasque Béline ?', ['Argan fait semblant d’être mort', 'Toinette lit ses lettres', 'Béralde la piège au notaire', 'Angélique la dénonce'], 0, 'Elle se réjouit devant le corps, tandis qu’Angélique pleure.'],
            ['Comment la pièce se termine-t-elle ?', ['Par une cérémonie burlesque où Argan est reçu médecin', 'Par la guérison d’Argan', 'Par la mort d’Argan', 'Par le départ de Toinette'], 0, 'En faux latin, avec chants et danses.'],
            ['Qu’est-il arrivé à Molière lors des représentations ?', ['Pris de malaise à la quatrième, il meurt le soir même', 'Il a été arrêté', 'Il a refusé de jouer', 'Il a été blessé sur scène'], 0, 'Il jouait le rôle d’Argan.'],
            ['Que vise la satire de la pièce ?', ['La médecine comme pouvoir : jargon, autorité, latin', 'Les malades imaginaires seulement', 'Le mariage arrangé uniquement', 'La religion'], 0, 'Béralde formule la critique : la nature guérit, les médecins font des cérémonies.'],
            ['Le théâtre est présenté comme un moyen d’atteindre la vérité.', ['Vrai', 'Faux'], 0, 'On ne guérit Argan qu’en jouant : déguisement, fausse mort, cérémonie.'],
          ],
        },
        {
          titre: 'Le Mariage de Figaro, Beaumarchais',
          lecon: {
            titre: 'Beaumarchais, 1784 — la folle journée',
            cours: `## L’histoire
Comédie en **cinq actes**, créée en **1784** après **trois ans d’interdiction**.

| Étape | Ce qui se passe |
| Le mariage | **Figaro** doit épouser **Suzanne** |
| L’obstacle | Le **comte Almaviva** veut faire valoir sur elle un droit **qu’il a pourtant aboli** |
| La riposte | Figaro, Suzanne et la **comtesse** déjouent ses manœuvres : billets truqués, rendez-vous piégé, **déguisements dans le jardin** |
| Le contretemps | Le page **Chérubin**, amoureux de **toutes** les femmes |
| Le procès burlesque | **Marceline** découvre que Figaro est **son fils** |
| Le dénouement | Le soir, dans l’obscurité, le comte **courtise sa propre femme** déguisée en Suzanne ; démasqué, **il demande pardon** |

## À retenir
> Le **valet devient protagoniste** : il a **le titre**, **l’initiative** — et le fameux **monologue de l’acte V**.

Il y reproche au comte de s’être « **donné la peine de naître, et rien de plus** ».

| Cible | Le moyen |
| Les **privilèges** | Le monologue |
| La **censure** | Figaro l’a subie comme auteur |
| La **justice vénale** | L’acte III |
| Le sort fait aux **femmes** | La **tirade de Marceline** |

**Cinq ans avant 1789.** Louis XVI : « il faudrait détruire la Bastille pour que la représentation de cette pièce ne fût pas une inconséquence dangereuse ».

> « Parce que vous êtes un grand seigneur, vous vous croyez un grand génie ! »`,
          },
          questions: [
            ['Que veut le comte Almaviva ?', ['Faire valoir sur Suzanne un droit qu’il avait aboli', 'Marier Figaro à Marceline', 'Chasser Chérubin', 'Vendre le château'], 0, 'Toute la journée se passe à déjouer ses manœuvres.'],
            ['Que révèle le procès burlesque ?', ['Marceline est la mère de Figaro', 'Suzanne est noble', 'Le comte est ruiné', 'Chérubin est le fils du comte'], 0, 'La créancière devient mère : coup de théâtre classique.'],
            ['Que contient le monologue de l’acte V ?', ['Le bilan d’une vie et la dénonciation du privilège de naissance', 'Une déclaration d’amour', 'Un plan d’évasion', 'Un éloge du comte'], 0, 'C’est le plus long monologue du théâtre français classique.'],
            ['Qui organise le piège final du jardin ?', ['Suzanne et la comtesse', 'Figaro seul', 'Chérubin', 'Marceline'], 0, 'Le renversement est aussi féminin.'],
            ['Pourquoi la pièce a-t-elle été interdite trois ans ?', ['Pour sa charge contre les privilèges et l’ordre social', 'Pour obscénité seulement', 'Parce que Beaumarchais était en prison', 'Faute de théâtre disponible'], 0, 'Louis XVI en avait mesuré la portée.'],
            ['Figaro cesse d’être valet à la fin de la pièce.', ['Vrai', 'Faux'], 1, 'Il se marie mais reste au service du comte : l’égalité est gagnée dans le rire.'],
          ],
        },
        {
          titre: 'Le médecin volant, Molière',
          lecon: {
            titre: 'Molière, vers 1659 — une farce de jeunesse',
            cours: `## La pièce
**Farce en un acte**, en prose — **parmi les toutes premières** de Molière, jouée par sa troupe **avant l’installation à Paris**.

| Étape | Ce qui se passe |
| L’obstacle | **Gorgibus** veut marier sa fille **Lucile** à Villebrequin ; elle aime **Valère** |
| La ruse | Pour gagner du temps, elle **feint d’être malade** |
| Le déguisement | Le valet **Sganarelle** se fait passer pour **médecin** — avec un **aplomb délirant** et un **jargon savant** inventé |
| La complication | Il doit se faire passer pour **deux personnes à la fois** : le médecin **et lui-même** |
| Le titre | D’où les **sauts par la fenêtre** et la course d’une pièce à l’autre |

## À retenir
> **Tout Molière est déjà là en germe.**

| Élément | Ce qu’il deviendra |
| Le **valet metteur en scène** | Scapin, Toinette, Dubois |
| Le **père obstiné** | Gorgibus, Orgon, Harpagon |
| Le **médecin charlatan** | Diafoirus, Purgon |
| Le comique de **gestes** | Hérité de la *commedia dell’arte* italienne, **longtemps côtoyée** |

On retrouvera ce canevas dans *Le Médecin malgré lui* (**1666**), en **trois actes** et **infiniment plus riche**.

> Le rire de Molière commence par le corps, avant de devenir satire.`,
          },
          questions: [
            ['Quel genre de pièce est Le Médecin volant ?', ['Une farce en un acte', 'Une comédie de mœurs', 'Une tragi-comédie', 'Une comédie-ballet'], 0, 'C’est l’une des toutes premières pièces de Molière.'],
            ['Pourquoi Sganarelle se déguise-t-il en médecin ?', ['Pour couvrir la fausse maladie de Lucile', 'Pour soigner Gorgibus', 'Pour gagner de l’argent', 'Pour se venger de Valère'], 0, 'Il invente un jargon savant avec un aplomb délirant.'],
            ['D’où vient le titre de la pièce ?', ['Sganarelle doit passer par la fenêtre pour jouer deux rôles à la fois', 'Le médecin voyage en carrosse', 'Un remède fait voler le malade', 'Le médecin s’enfuit à cheval'], 0, 'Le comique est d’abord physique.'],
            ['Quelle tradition théâtrale inspire cette farce ?', ['La commedia dell’arte italienne', 'La tragédie grecque', 'Le drame liturgique médiéval', 'Le théâtre espagnol'], 0, 'Molière a longtemps partagé la salle avec les Italiens.'],
            ['Quelle pièce ultérieure reprend ce canevas ?', ['Le Médecin malgré lui', 'Le Malade imaginaire', 'L’Amour médecin', 'Monsieur de Pourceaugnac'], 0, 'En 1666, en trois actes et bien plus riche.'],
            ['Cette farce annonce déjà des types que Molière reprendra.', ['Vrai', 'Faux'], 0, 'Le valet metteur en scène, le père obstiné et le médecin charlatan y sont déjà.'],
          ],
        },
        {
          titre: 'Le Meilleur des mondes, Aldous Huxley',
          lecon: {
            titre: 'Huxley, 1932 — une dictature du bonheur',
            cours: `## Le monde décrit
En l’an **632 après Ford**, l’humanité est **produite en flacons**.

| Le dispositif | Ce qu’il fait |
| Les **castes** | Cinq, des **Alphas** aux **Epsilons** — chacune **programmée pour aimer sa condition** |
| La **famille** | Supprimée : les mots « mère » et « père » sont **obscènes** |
| La **vieillesse**, la **religion** | Abolies |
| Le **soma** | Une drogue **sans effets secondaires** |
| La **consommation** et la **sexualité libre** | Les autres piliers de la stabilité |

| L’intrigue | Ce qui se passe |
| **Bernard Marx** et **Lenina** | Ils ramènent d’une **réserve** **John le Sauvage**, élevé hors du système, **nourri de Shakespeare** |
| John | Fasciné puis **horrifié**, il réclame **le droit d’être malheureux** |
| **Mustapha Menier**, l’administrateur | Il lui explique **posément** que **le bonheur a un prix** |
| La fin | Devenu **curiosité médiatique**, John **se pend** |

## À retenir
La grande **contre-utopie**, avec *1984* — **mais inverse**.

| **Orwell** | **Huxley** |
| Une dictature par la **terreur** | Une dictature par le **plaisir** |

> Le roman anticipe la **manipulation génétique**, le **divertissement de masse** et les **psychotropes**. Le titre est une **citation ironique** de *La Tempête* de Shakespeare.

> « Vous réclamez le droit d’être malheureux ? — Je le réclame. »`,
          },
          questions: [
            ['Comment naissent les humains dans ce monde ?', ['Produits en flacons et conditionnés en cinq castes', 'Par familles traditionnelles', 'Par clonage volontaire d’adultes', 'Ils sont importés des réserves'], 0, 'Des Alphas aux Epsilons, chacun est programmé pour aimer sa condition.'],
            ['Qu’est-ce que le soma ?', ['Une drogue du bonheur sans effets secondaires', 'Un aliment de synthèse', 'Un examen d’aptitude', 'Un moyen de transport'], 0, 'Il éteint toute insatisfaction, donc toute révolte.'],
            ['Qui est John le Sauvage ?', ['Un homme élevé hors du système, nourri de Shakespeare', 'Un Alpha rebelle', 'Un administrateur mondial', 'Un embryon raté'], 0, 'Il réclame le droit d’être malheureux.'],
            ['En quoi ce roman diffère-t-il de 1984 ?', ['La dictature s’y impose par le plaisir, non par la terreur', 'Il se déroule au XIXe siècle', 'Il n’y a pas d’État', 'La technologie y est absente'], 0, 'Les deux romans sont complémentaires.'],
            ['D’où vient le titre du roman ?', ['D’une réplique de La Tempête de Shakespeare', 'D’un poème de Milton', 'De la Bible', 'D’un slogan publicitaire'], 0, 'La citation est ironique.'],
            ['Le roman se termine par la révolte victorieuse de John.', ['Vrai', 'Faux'], 1, 'Devenu curiosité médiatique, il se pend.'],
          ],
        },
        {
          titre: 'Le Menteur, Pierre Corneille',
          lecon: {
            titre: 'Corneille, 1644 — mentir avec génie',
            cours: `## L’histoire
Comédie en **cinq actes et en vers**, adaptée de *La Verdad sospechosa* de l’Espagnol **Alarcón**.

| Étape | Ce que Dorante invente |
| L’arrivée | Venu de Poitiers, **décidé à se faire remarquer** |
| Aux Tuileries | Un **passé de guerrier** revenu d’Allemagne, devant **Clarice** et **Lucrèce** |
| Face au mariage arrangé par **Géronte** | Un **mariage secret complet** à Poitiers |

> Son valet **Cliton** **n’en revient pas** — il sert de relais au spectateur.

| L’erreur qui gouverne tout | Sa conséquence |
| Il croit que celle qu’il aime s’appelle **Lucrèce** — **alors que c’est Clarice** | Un **duel** avec **Alcippe**, et un tourbillon de méprises |

Démasqué par son père, il **retombe sur ses pieds** : il **épouse la vraie Lucrèce**.

## À retenir
> Le mensonge y est un **art** : **Dorante improvise, ne se répète jamais** — et **le spectateur admire autant qu’il rit**.

| Type de comique | Où il opère |
| De **situation** | Le quiproquo des noms |
| De **caractère** | Le menteur pris à son piège |
| De **mots** | Les tirades d’invention |

> Le dénouement laisse le menteur **ni puni ni corrigé** : cela a longtemps **gêné les commentateurs** — et **rend la pièce très moderne**.

> « Il ment comme il respire, et il respire en vers. »`,
          },
          questions: [
            ['D’où vient Dorante au début de la pièce ?', ['De Poitiers', 'De Lyon', 'De Bordeaux', 'De Madrid'], 0, 'Il abandonne le droit pour se faire homme du monde à Paris.'],
            ['Quel premier mensonge invente-t-il ?', ['Un passé de guerrier revenu d’Allemagne', 'Une fortune héritée', 'Un titre de noblesse', 'Une carrière de poète'], 0, 'Tous les autres mensonges en découlent.'],
            ['Sur quel quiproquo repose l’intrigue ?', ['Une confusion entre les noms de Clarice et de Lucrèce', 'Un échange de lettres', 'Un déguisement', 'Une fausse mort'], 0, 'Elle manque de le faire tuer en duel.'],
            ['Quel est le rôle de Cliton ?', ['Valet lucide, il commente les mensonges de son maître', 'Rival amoureux', 'Père de Clarice', 'Ami d’enfance de Lucrèce'], 0, 'Il sert de relais au spectateur.'],
            ['De quelle pièce Corneille s’inspire-t-il ?', ['La Verdad sospechosa d’Alarcón', 'La Vie est un songe de Calderón', 'La Célestine', 'Le Trompeur de Séville'], 0, 'Il l’adapte librement au cadre parisien.'],
            ['Le menteur est puni au dénouement.', ['Vrai', 'Faux'], 1, 'Il épouse la femme qu’il aime : ni puni ni corrigé.'],
          ],
        },
        {
          titre: 'Le Misanthrope, Molière',
          lecon: {
            titre: 'Molière, 1666 — dire la vérité, et se rendre impossible',
            cours: `## L’histoire
Comédie en **cinq actes et en vers**.

| Personnage | Sa position |
| **Alceste** | Il **refuse les compromis** de la vie mondaine : flatteries, sourires, **mensonges polis** |
| **Philinte**, son ami | Partisan de la **mesure** |
| **Oronte** | Alceste **critique son sonnet** — ce qui lui vaut un **procès** |
| **Célimène** | Jeune **veuve brillante**, coquette : elle tient salon et **croque tous les absents** en portraits féroces |

| Le dénouement | Ce qui se passe |
| Ses **lettres à plusieurs prétendants** sont rendues publiques | Elle est **démasquée** |
| Alceste lui propose de le suivre **au désert** | Elle **refuse** : **elle a vingt ans** |
| La fin | **Alceste part seul** |

## À retenir
Comédie **grave**, presque **sans rire franc** : on peut la lire comme une **tragédie de l’intransigeance**.

| Personnage | Ce qui le rend juste — et faux |
| **Alceste** | Il a **raison sur le fond** et **tort dans la vie** |
| **Philinte** | Il a la **sagesse** — mais elle **ressemble à de la complaisance** |

> **Molière ne tranche pas.** C’est ce qui a fait de cette pièce, **longtemps moins jouée**, **l’une des plus commentées**.

> « Je veux qu’on soit sincère, et qu’en homme d’honneur, on ne lâche aucun mot qui ne parte du cœur. »`,
          },
          questions: [
            ['Que refuse Alceste ?', ['Les flatteries et les compromis de la vie mondaine', 'Le mariage', 'La justice royale', 'La poésie'], 0, 'Il exige la sincérité absolue en toute circonstance.'],
            ['Qui incarne la mesure face à Alceste ?', ['Philinte', 'Oronte', 'Acaste', 'Du Bois'], 0, 'Sa sagesse ressemble parfois à de la complaisance.'],
            ['Pourquoi Alceste se retrouve-t-il en procès ?', ['Il a critiqué durement le sonnet d’Oronte', 'Il a insulté le roi', 'Il a refusé de payer une dette', 'Il a frappé un rival'], 0, 'La sincérité a un coût social immédiat.'],
            ['Qui est Célimène ?', ['Une jeune veuve brillante et coquette qui tient salon', 'La sœur d’Alceste', 'Une prude retirée', 'Une servante'], 0, 'Elle croque tous les absents en portraits féroces.'],
            ['Que propose Alceste à Célimène à la fin ?', ['Le suivre au désert, loin du monde', 'L’épouser à la cour', 'Renoncer à son procès', 'Fuir à l’étranger avec Philinte'], 0, 'Elle refuse : elle a vingt ans. Alceste part seul.'],
            ['Molière donne clairement raison à Alceste.', ['Vrai', 'Faux'], 1, 'Il a raison sur le fond et tort dans la vie : la pièce ne tranche pas.'],
          ],
        },
        {
          titre: 'Le Neveu de Rameau, Denis Diderot',
          lecon: {
            titre: 'Diderot, 1805 — un dialogue explosif publié après tout le monde',
            cours: `## L’œuvre
Un **dialogue**, rencontré au **café de la Régence**.

| Interlocuteur | Qui il est |
| **MOI** | Un philosophe, **proche de Diderot** |
| **LUI** | **Jean-François Rameau**, **neveu réel** du compositeur |

| Ce qu’est le neveu | Le détail |
| Un **parasite génial** | Musicien **raté**, **pique-assiette** dans les maisons riches |
| Un **acteur** | Il **mime**, chante, **joue tous les rôles** |
| Un **cynique lucide** | Il **se vante de sa bassesse** |
| Sa thèse | Pour survivre, il faut prendre la « **pantomime des gueux** » : **la posture qui convient au maître qu’on sert** |

> Le philosophe le **contredit**, s’indigne — **mais rit et l’écoute jusqu’au bout**.

## À retenir
Écrit et remanié entre **1761 et 1774**, **jamais publié du vivant** de Diderot.

> Le texte paraît d’abord **en allemand**, traduit par **Goethe** (**1805**) — **avant de revenir au français**.

| Ce que l’œuvre est à la fois | Le détail |
| Une **satire sociale** | Les maisons riches, les protecteurs |
| Un **dialogue philosophique** | Le génie, la morale, l’éducation |
| Une réflexion sur la **musique** | La querelle des Bouffons |

> **Hegel** puis **Freud** y ont vu un texte majeur sur la **conscience divisée**.

> « Il n’y a dans tout un royaume qu’un homme qui marche, c’est le souverain : tout le reste prend des positions. »`,
          },
          questions: [
            ['Quelle est la forme de l’œuvre ?', ['Un dialogue entre MOI et LUI', 'Un roman à la première personne', 'Un traité de musique', 'Un recueil de lettres'], 0, 'La rencontre a lieu au café de la Régence.'],
            ['Qui est « LUI » ?', ['Jean-François Rameau, neveu du compositeur, parasite génial', 'Diderot lui-même', 'Un noble anonyme', 'Un valet de comédie'], 0, 'Musicien raté et pique-assiette, il mime et joue tous les rôles.'],
            ['Que désigne la « pantomime des gueux » ?', ['Les postures qu’il faut prendre pour survivre auprès des puissants', 'Une danse populaire', 'Un opéra italien', 'Un jeu d’enfants'], 0, '« Il n’y a qu’un homme qui marche, c’est le souverain. »'],
            ['Comment le texte a-t-il été publié ?', ['D’abord en allemand, traduit par Goethe, en 1805', 'Du vivant de Diderot, en 1762', 'En feuilleton au XIXe siècle', 'Jamais publié intégralement'], 0, 'Le manuscrit français ne sera retrouvé que bien plus tard.'],
            ['Quels penseurs ont commenté ce texte ?', ['Hegel et Freud', 'Kant et Descartes', 'Voltaire et Rousseau seulement', 'Marx et Comte'], 0, 'Ils y voient un texte majeur sur la conscience divisée.'],
            ['Le philosophe réfute et fait taire le neveu.', ['Vrai', 'Faux'], 1, 'Il le contredit, s’indigne — et l’écoute jusqu’au bout, fasciné.'],
          ],
        },
        {
          titre: 'Le Parti pris des choses, Francis Ponge',
          lecon: {
            titre: 'Ponge, 1942 — trente-deux objets, trente-deux poèmes',
            cours: `## Le recueil
**Trente-deux textes brefs** en **prose**, publiés en **1942**.

« La Pluie », « Le Cageot », « La Bougie », « La Cigarette », « L’Orange », « L’Huître », « Le Pain », « Le Cycle des saisons », « **Le Galet** » — ce dernier, **plus long**, servant de **manifeste**.

## Le programme
Prendre le **parti des choses** **contre les habitudes du langage**.

| Ce que le poème refuse | Ce qu’il vise |
| Le **lyrisme** | La **description exacte** |
| Le **symbole** | L’objet **pour lui-même** |
| Le « **je** » sentimental | Une **définition-description** |

Ponge a parlé de « **définition-description-objet littéraire** ».

| Son outillage | Son usage |
| Le **dictionnaire** | L’étymologie |
| Les **sonorités** et les **doubles sens** | Le travail du mot |

> « L’huître, de la **grosseur d’un galet moyen**, est d’une apparence plus rugueuse, d’une couleur moins unie, brillamment blanchâtre. »

## À retenir
Le recueil **fonde une poétique** qui a marqué tout le XXe siècle : le **poème-objet**, l’attention au **minuscule**, la **méfiance envers l’effusion**.

> Ponge n’est pas anti-lyrique **par sécheresse** mais **par exigence** : il veut **rendre justice à ce qui n’a pas de voix**.

> « Le parti pris des choses égale compte tenu des mots. »`,
          },
          questions: [
            ['Combien de textes le recueil comporte-t-il ?', ['Trente-deux', 'Douze', 'Cent', 'Sept'], 0, 'Tous en prose, la plupart très brefs.'],
            ['Quels objets Ponge décrit-il ?', ['Des objets banals : le cageot, l’huître, le pain, la bougie', 'Des monuments célèbres', 'Des paysages de montagne', 'Des animaux exotiques'], 0, 'Le minuscule est un choix poétique.'],
            ['Quel texte fait office de manifeste ?', ['Le Galet', 'La Pluie', 'L’Orange', 'La Cigarette'], 0, 'Plus long, il expose la démarche.'],
            ['Comment Ponge nomme-t-il son objectif d’écriture ?', ['La définition-description-objet littéraire', 'Le poème en prose lyrique', 'L’écriture automatique', 'Le vers libre descriptif'], 0, 'Le poème est un objet fabriqué, non un épanchement.'],
            ['Quel outil accompagne son travail ?', ['Le dictionnaire et l’étymologie', 'Le carnet de voyage', 'La photographie', 'La musique'], 0, 'Les doubles sens et les sonorités sont des matériaux.'],
            ['Ponge refuse le lyrisme par sécheresse de cœur.', ['Vrai', 'Faux'], 1, 'Il le refuse par exigence : rendre justice à ce qui n’a pas de voix.'],
          ],
        },
        {
          titre: 'Le paysan parvenu, Marivaux',
          lecon: {
            titre: 'Marivaux, 1734-1735 — monter par les femmes',
            cours: `## L’histoire
**Roman-mémoires inachevé.** **Jacob**, fils de fermier venu vendre du vin à Paris, est **beau, vif et sans scrupules excessifs**.

| Femme | Ce qu’elle lui apporte |
| **Geneviève**, servante entretenue par son maître | Elle lui **propose un arrangement** |
| **Mademoiselle Habert**, dévote plus âgée | Il l’**épouse** — elle a de l’argent |
| **Madame de Ferval** et **Madame de Fécour** | Elles le **protègent**, séduites par sa jeunesse |

> Chaque étape le **rapproche du monde qu’il visait** — jusqu’à une **charge** et un **nom de noblesse** : « **Monsieur de La Vallée** ». Puis **le récit s’interrompt**.

## À retenir
Le **pendant masculin** de *La Vie de Marianne*, du même Marivaux.

| Ce que le roman est | Le détail |
| Un roman de l’**ascension sociale** | Par la **séduction** |
| Un récit à la **première personne** | Par un narrateur **âgé**, qui **juge avec ironie le jeune homme qu’il fut** |
| Un tableau | La société de la **Régence**, avec une acuité que **Balzac saluera** |

> Le livre **annonce Bel-Ami et Julien Sorel** — **mais sans tragédie** : la **comédie sociale y reste souriante**.

> « Il n’y a rien de tel que d’être aimable pour aller vite. »`,
          },
          questions: [
            ['Qui est Jacob ?', ['Un fils de fermier monté à Paris, beau et débrouillard', 'Un noble ruiné', 'Un marchand vénitien', 'Un valet de comédie'], 0, 'Il vend d’abord du vin pour son maître.'],
            ['Comment Jacob s’élève-t-il socialement ?', ['Par la séduction et des mariages ou protections féminines', 'Par le commerce', 'Par les armes', 'Par l’étude'], 0, 'Chaque femme rencontrée le rapproche du monde qu’il vise.'],
            ['Quel nom prend-il en s’élevant ?', ['Monsieur de La Vallée', 'Monsieur de Valville', 'Monsieur Dorante', 'Monsieur de Climal'], 0, 'Le changement de nom accompagne le changement de condition.'],
            ['Quelle est la particularité du récit ?', ['Un narrateur âgé juge avec ironie le jeune homme qu’il fut', 'Un narrateur omniscient', 'Une succession de lettres', 'Un dialogue continu'], 0, 'C’est un roman-mémoires, resté inachevé.'],
            ['Quel roman de Marivaux forme le pendant féminin ?', ['La Vie de Marianne', 'Les Fausses Confidences', 'L’Île des esclaves', 'La Double Inconstance'], 0, 'Même époque, même ambition sociale, autre point de vue.'],
            ['Le roman se termine par la chute du héros.', ['Vrai', 'Faux'], 1, 'Il est inachevé, et la comédie sociale y reste souriante.'],
          ],
        },
        {
          titre: 'Le Père Goriot, Honoré de Balzac',
          lecon: {
            titre: 'Balzac, 1835 — la pension Vauquer et la conquête de Paris',
            cours: `## L’histoire
Dans la misérable **pension Vauquer**, à Paris.

| Personnage | Ce qu’il est |
| **Eugène de Rastignac** | Étudiant en droit **pauvre et ambitieux** |
| Le **père Goriot** | Ancien **vermicellier**, **ruiné par ses deux filles** — **Anastasie de Restaud** et **Delphine de Nucingen** — qu’il aime **jusqu’à l’aveuglement** et qui **ne viennent que pour de l’argent** |
| **Vautrin** | **Forçat évadé** sous un faux nom |

| Le pacte de Vautrin | Ce qu’il propose |
| À Rastignac | **Épouser une héritière** — **dont il fera tuer le frère** |
| Son issue | Vautrin est **démasqué et arrêté** |

| La fin | Ce qui se passe |
| **Goriot meurt** seul, ruiné | **Aucune de ses filles ne vient** |
| **Rastignac l’enterre presque seul** | Puis, du haut du **Père-Lachaise**, il **regarde Paris** et lance son défi |

## À retenir
Roman **clé** de *La Comédie humaine* : **c’est ici que Balzac invente le retour des personnages**.

| Destin | Ce qu’il incarne |
| **Goriot** | La **paternité dévorée** |
| **Vautrin** | Le **crime lucide** |
| **Rastignac** | L’**ambition qui s’initie** |

Peinture de l’**argent comme unique loi** et du **Paris de 1819 comme champ de bataille**.

> « À nous deux maintenant ! »`,
          },
          questions: [
            ['Où se déroule une grande partie du roman ?', ['À la pension Vauquer', 'Au Palais-Royal', 'Dans un hôtel du faubourg Saint-Germain', 'À la Sorbonne'], 0, 'La pension réunit tous les milieux sociaux du roman.'],
            ['Qui est le père Goriot ?', ['Un ancien vermicellier ruiné par ses deux filles', 'Un usurier', 'Un ancien officier', 'Le propriétaire de la pension'], 0, 'Anastasie et Delphine ne viennent que pour de l’argent.'],
            ['Quel pacte Vautrin propose-t-il à Rastignac ?', ['Épouser une héritière dont il ferait tuer le frère', 'Voler la pension Vauquer', 'Le faire entrer dans la police', 'Financer ses études'], 0, 'Vautrin est un forçat évadé sous un faux nom.'],
            ['Comment meurt le père Goriot ?', ['Seul et ruiné, sans qu’aucune de ses filles vienne', 'Assassiné par Vautrin', 'Riche et entouré', 'Dans un accident'], 0, 'Rastignac l’enterre presque seul.'],
            ['Quelle phrase clôt le roman ?', ['« À nous deux maintenant ! »', '« Adieu, Paris »', '« Tout est perdu »', '« Je reviendrai »'], 0, 'Rastignac lance son défi du haut du Père-Lachaise.'],
            ['C’est dans ce roman que Balzac invente le retour des personnages.', ['Vrai', 'Faux'], 0, 'Rastignac, Vautrin et Nucingen reparaîtront dans toute La Comédie humaine.'],
          ],
        },
        {
          titre: 'Le Petit Malade, Georges Courteline',
          lecon: {
            titre: 'Courteline — la saynète en quelques répliques',
            cours: `## La pièce
Une **saynète minuscule**, de quelques pages, **tout entière dans un quiproquo médical**.

| Étape | Ce qui se passe |
| L’urgence | Une mère **affolée** fait venir un **médecin** pour son petit garçon |
| La description | Des symptômes **terrifiants** — le praticien **s’inquiète** |
| La révélation | L’enfant est simplement **tombé de la fenêtre** |
| La chute | **Chute dont il a l’habitude** et **dont il se relève sans mal** |
| La fin | Le médecin, **furieux d’avoir couru pour rien**, repart |

## À retenir
**Courteline** (1858-1929) est le maître de la **forme brève comique**.

| Ses œuvres | Le genre |
| Saynètes, **sketches** | Le format court |
| *Messieurs les ronds-de-cuir*, *Le Train de 8 h 47*, *Boubouroche* | Les récits et pièces |

| Ses personnages | Ses sujets |
| Employés, militaires, ménages, juges | La **bêtise administrative**, l’**absurdité des règlements**, l’**aveuglement conjugal** |

> Sa **langue parlée**, ses dialogues d’une **efficacité redoutable** et son sens du **décalage** **annoncent le théâtre de l’absurde**.

> Le comique de Courteline naît toujours d’un écart entre le sérieux du ton et la petitesse de la chose.`,
          },
          questions: [
            ['Quelle est la forme de ce texte ?', ['Une saynète très brève', 'Une comédie en cinq actes', 'Un roman court', 'Un monologue'], 0, 'Courteline est le maître de la forme brève comique.'],
            ['Sur quoi repose le comique de la pièce ?', ['Un quiproquo médical résolu par une explication dérisoire', 'Un déguisement', 'Un jeu de mots répété', 'Une méprise sur les noms'], 0, 'L’écart entre le sérieux du ton et la petitesse de la chose.'],
            ['Quels milieux Courteline peint-il habituellement ?', ['Employés, militaires, ménages et tribunaux', 'La haute aristocratie', 'Les milieux artistiques', 'Le monde paysan'], 0, 'Messieurs les ronds-de-cuir en est le meilleur exemple.'],
            ['Quelle qualité caractérise ses dialogues ?', ['Une langue parlée d’une efficacité redoutable', 'Un style précieux', 'Des tirades en vers', 'Un vocabulaire savant'], 0, 'Elle annonce, par le décalage, le théâtre de l’absurde.'],
            ['À quelle époque Courteline écrit-il ?', ['À la fin du XIXe et au début du XXe siècle', 'Au XVIIe siècle', 'Sous la Révolution', 'Après 1945'], 0, 'Il vit de 1858 à 1929.'],
            ['Les pièces de Courteline sont de longues comédies de mœurs.', ['Vrai', 'Faux'], 1, 'Ce sont pour la plupart des saynètes et des pièces en un ou deux actes.'],
          ],
        },
        {
          titre: 'Le Procès, Franz Kafka',
          lecon: {
            titre: 'Kafka, 1925 — accusé sans savoir de quoi',
            cours: `## L’histoire
« On avait sûrement calomnié **Joseph K.**, car **sans avoir rien fait de mal**, il fut **arrêté un matin**. »

| Le paradoxe | Le détail |
| Il est arrêté **chez lui** | **Sans être emprisonné** : il **continue sa vie**, tout en étant « **en procès** » |
| L’accusation | **Il ne saura jamais de quoi il est accusé** |

| Ce qu’il découvre | Ce que ça révèle |
| Une justice **tentaculaire** | Installée dans des **greniers**, des couloirs, des arrière-cours |
| Un **avocat** | **Impuissant** |
| Un **peintre** | On n’obtient **jamais l’acquittement** — seulement des **ajournements** |
| Un **aumônier** | Il raconte la parabole « **Devant la Loi** » : un homme **attend toute sa vie** devant une porte **qui n’était ouverte que pour lui** |

> Un an après son arrestation, deux hommes emmènent K. dans une carrière et le tuent « **comme un chien** ».

## À retenir
Roman **inachevé**, publié en **1925** par **Max Brod** — **contre la volonté de Kafka**, qui avait demandé qu’on **brûle ses manuscrits**.

> Le mot « **kafkaïen** » vient de là : une **bureaucratie absurde, invisible**, dont la logique échappe — et **à laquelle on finit par consentir**.

Lectures possibles : la **culpabilité**, le **judaïsme**, l’**Empire austro-hongrois**, le **totalitarisme à venir**.

> « Comme un chien ! dit-il, c’était comme si la honte dût lui survivre. »`,
          },
          questions: [
            ['De quoi Joseph K. est-il accusé ?', ['On ne le lui dira jamais', 'De détournement de fonds', 'De meurtre', 'De trahison'], 0, 'L’absence d’accusation est le cœur du roman.'],
            ['Que se passe-t-il après son arrestation ?', ['Il reste libre et continue son travail tout en étant « en procès »', 'Il est emprisonné', 'Il fuit à l’étranger', 'Il est jugé aussitôt'], 0, 'La justice s’installe dans sa vie sans jamais l’enfermer.'],
            ['Que raconte la parabole « Devant la Loi » ?', ['Un homme attend toute sa vie devant une porte ouverte pour lui seul', 'Un juge corrompu', 'Un innocent gracié', 'Un procès public'], 0, 'L’aumônier la lui raconte dans la cathédrale.'],
            ['Comment le roman se termine-t-il ?', ['Deux hommes emmènent K. dans une carrière et le tuent', 'K. est acquitté', 'Le procès est annulé', 'K. s’enfuit'], 0, '« Comme un chien ! » sont ses derniers mots.'],
            ['Comment le roman a-t-il été publié ?', ['Par Max Brod, en 1925, contre la volonté de Kafka', 'Par Kafka lui-même en 1914', 'En feuilleton dans un journal', 'Il n’a jamais été publié intégralement'], 0, 'Kafka avait demandé que ses manuscrits soient brûlés.'],
            ['Le roman est achevé.', ['Vrai', 'Faux'], 1, 'Il est inachevé : l’ordre des chapitres reste discuté.'],
          ],
        },
        {
          titre: 'Le Roi des Aulnes, Michel Tournier',
          lecon: {
            titre: 'Tournier, 1970 — le mythe de l’ogre',
            cours: `## L’histoire
**Abel Tiffauges**, garagiste parisien, **géant maladroit et solitaire**, tient un journal — les « **Écrits sinistres** » — où il se persuade que **le monde lui envoie des signes**.

| Étape | Ce qui se passe |
| L’échappée | Accusé **à tort** d’un crime, il **échappe au procès** grâce à la **déclaration de guerre** |
| La captivité | Prisonnier en **Prusse-Orientale** |
| Rominten | **Garde-chasse** chez **Göring** |
| **Kaltenborn** | Il devient **rabatteur d’enfants** pour la **napola**, école d’élite nazie : il parcourt les campagnes pour « **recruter** » des garçons — **et se sent enfin à sa place** |
| La fin | Dans l’effondrement du Reich, il **porte sur ses épaules Éphraïm**, enfant juif rescapé d’**Auschwitz**, et **s’enfonce dans le marais** |

## À retenir
**Prix Goncourt 1970**, **à l’unanimité**.

| Notion | Ce qu’elle recouvre |
| La **phorie** | Le fait de **porter** |
| Le mythe du **Roi des Aulnes** | La ballade de **Goethe** : un père porte son enfant **qu’un roi surnaturel vient prendre** |

> L’ambivalence est le sujet : **porter, c’est aimer — et c’est capturer**. Le nazisme y est décrit comme une **ogresse dévoreuse d’enfants**.

Livre **difficile**, souvent **discuté** pour son **ambiguïté même**.

> « Tiffauges portait Éphraïm comme on porte un enfant… et comme on porte une croix. »`,
          },
          questions: [
            ['Qui est Abel Tiffauges ?', ['Un garagiste solitaire persuadé que le monde lui envoie des signes', 'Un officier allemand', 'Un instituteur breton', 'Un médecin militaire'], 0, 'Il tient un journal intitulé « Écrits sinistres ».'],
            ['Que devient-il en Prusse-Orientale ?', ['Rabatteur d’enfants pour une école d’élite nazie', 'Interprète', 'Ouvrier agricole', 'Soldat de la Wehrmacht'], 0, 'Il parcourt les campagnes pour y recruter des garçons.'],
            ['Quel mythe donne son titre au roman ?', ['La ballade du Roi des Aulnes de Goethe', 'Le mythe d’Œdipe', 'La légende de saint Christophe seule', 'Le mythe de Prométhée'], 0, 'Un père y porte son enfant qu’un roi surnaturel vient prendre.'],
            ['Qu’est-ce que la « phorie » chez Tournier ?', ['Le fait de porter, à la fois amour et capture', 'La fuite en avant', 'La chasse au gros gibier', 'L’écriture d’un journal'], 0, 'C’est l’ambivalence centrale du livre.'],
            ['Comment le roman se termine-t-il ?', ['Tiffauges porte un enfant juif rescapé et s’enfonce dans le marais', 'Il est fusillé', 'Il retourne en France', 'Il devient directeur de l’école'], 0, 'La fin renverse le sens de toute sa trajectoire.'],
            ['Le roman a obtenu le prix Goncourt.', ['Vrai', 'Faux'], 0, 'En 1970, et à l’unanimité du jury.'],
          ],
        },
        {
          titre: 'Le Roi se meurt, Eugène Ionesco',
          lecon: {
            titre: 'Ionesco, 1962 — apprendre à mourir en une heure trente',
            cours: `## La pièce
**Bérenger Ier**, roi d’un royaume **qui se fissure et rétrécit**, apprend **au début de la pièce** qu’il va mourir **à la fin du spectacle**.

| Personnage | Son rôle |
| **Marguerite**, la première reine | **Lucide et sévère** : elle l’aide à **se détacher** |
| **Marie**, la seconde | **Jeune et aimante** : elle le **retient dans l’illusion** |
| Le **médecin**, le **garde**, la servante **Juliette** | Le monde qui s’efface |

| Ce que fait le roi | Ce qu’il révèle |
| Il **refuse**, se **révolte** | Il **ordonne à son corps d’obéir** |
| Il demande **qu’on lui apprenne à mourir** | Personne ne sait |
| Il s’accroche aux **gestes ordinaires** | **Porter une casserole**, **ressentir le froid** |

| La fin | Ce qui se passe |
| Le royaume **se réduit à mesure** | Marguerite le **guide pas à pas** |
| Tout disparaît | **Le roi s’efface sur son trône** |

## À retenir
La pièce **la plus grave** d’Ionesco, écrite **après une maladie**.

> Ce n’est plus l’absurde du **langage**, mais l’**absurde de la mort** : **on meurt sans avoir appris**.

| Le dispositif | Son effet |
| Une **horloge** | **La durée de la pièce est celle de l’agonie** |

Le rire y **persiste** — **grinçant**.

> « Tu vas mourir dans une heure et demie, tu vas mourir à la fin du spectacle. »`,
          },
          questions: [
            ['Que dit-on au roi dès le début de la pièce ?', ['Qu’il mourra à la fin du spectacle', 'Qu’il a perdu la guerre', 'Qu’il doit abdiquer', 'Qu’il est guéri'], 0, 'La durée de la pièce est celle de l’agonie.'],
            ['Quel rôle joue la reine Marguerite ?', ['Elle l’aide lucidement à se détacher', 'Elle lui promet la guérison', 'Elle complote contre lui', 'Elle refuse de lui parler'], 0, 'Marie, la seconde reine, le retient au contraire dans l’illusion.'],
            ['Que devient le royaume au fil de la pièce ?', ['Il se fissure et rétrécit', 'Il s’étend', 'Il est envahi', 'Il reste inchangé'], 0, 'Le décor accompagne la disparition du roi.'],
            ['Que demande le roi ?', ['Qu’on lui apprenne à mourir', 'Qu’on le sauve par la médecine', 'Qu’on lui rende son armée', 'Qu’on rappelle Marie'], 0, 'C’est le sujet même de la pièce : on meurt sans avoir appris.'],
            ['Comment la pièce se termine-t-elle ?', ['Marguerite le guide pas à pas, tout disparaît, le roi s’efface', 'Le roi guérit', 'Le roi abdique et part', 'Le rideau tombe sur une révolte'], 0, 'La disparition est progressive et méthodique.'],
            ['La pièce abandonne tout comique.', ['Vrai', 'Faux'], 1, 'Le rire persiste, grinçant, jusque dans l’agonie.'],
          ],
        },
        {
          titre: 'Le Roman de la momie, Théophile Gautier',
          lecon: {
            titre: 'Gautier, 1858 — l’Égypte ressuscitée par l’érudition',
            cours: `## L’histoire
| Cadre | Ce qui s’y passe |
| Le **prologue moderne** | Un jeune **lord anglais** et le savant allemand **Rumphius** découvrent dans la **Vallée des Rois** une tombe intacte : la **momie d’une jeune femme** et un **papyrus** |
| Le roman | Il **est** la traduction de ce papyrus |

| Personnage | Qui il aime |
| **Tahoser**, fille du grand prêtre | **Poëri**, un Hébreu |
| **Poëri** | **Ra’hel**, une femme de son peuple |
| Le **pharaon** | **Tahoser** — qu’il **élève au rang de reine** |

| La fin | Ce qui se passe |
| Les **plaies d’Égypte**, la **fuite des Hébreux** | La poursuite, la **mer Rouge**, l’**engloutissement de l’armée** |
| **Tahoser meurt** | Elle reçoit le **tombeau préparé pour le pharaon** |

## À retenir
Roman **archéologique** : Gautier s’est appuyé sur les travaux des **égyptologues de son temps**.

> L’**exactitude des descriptions** — la couleur, les objets, les rites — **fait partie du projet**.

| Le « culte de la forme » | Ce qu’il implique |
| Gautier, tenant de l’**art pour l’art** | La **beauté visuelle prime sur la psychologie** |

> Le roman a nourri toute l’égyptomanie du XIXe siècle finissant.`,
          },
          questions: [
            ['Comment le récit antique est-il introduit ?', ['Par la découverte d’une tombe et d’un papyrus traduit', 'Par un rêve', 'Par une lettre retrouvée', 'Sans cadre : le récit commence directement'], 0, 'Un lord anglais et le savant Rumphius font la découverte.'],
            ['Qui est Tahoser ?', ['La fille d’un grand prêtre, aimée du pharaon', 'Une esclave hébraïque', 'La sœur de Moïse', 'Une reine étrangère'], 0, 'Elle aime Poëri, qui en aime une autre.'],
            ['Quel épisode biblique traverse le roman ?', ['Les plaies d’Égypte et la fuite des Hébreux', 'Le déluge', 'La construction de la tour de Babel', 'Le règne de Salomon'], 0, 'L’armée du pharaon est engloutie dans la mer Rouge.'],
            ['Sur quoi Gautier appuie-t-il ses descriptions ?', ['Les travaux des égyptologues de son temps', 'Son propre voyage en Égypte', 'La Bible seule', 'Son imagination pure'], 0, 'L’exactitude archéologique fait partie du projet.'],
            ['À quelle doctrine esthétique Gautier se rattache-t-il ?', ['L’art pour l’art', 'Le naturalisme', 'Le réalisme social', 'Le symbolisme'], 0, 'La beauté visuelle y prime sur la psychologie.'],
            ['Le roman est écrit à la première personne par la momie.', ['Vrai', 'Faux'], 1, 'Le récit antique est présenté comme la traduction d’un papyrus.'],
          ],
        },
        {
          titre: 'Le Roman inachevé, Louis Aragon',
          lecon: {
            titre: 'Aragon, 1956 — une autobiographie en vers',
            cours: `## Le recueil
Publié en **1956**, présenté par Aragon comme une **autobiographie en vers**.

| Épisode | Ce qu’il porte |
| L’**enfance** et le **secret de sa naissance** | Élevé **en croyant que sa mère était sa sœur** |
| La **guerre de 1914** | Le premier effondrement |
| Le **surréalisme** | Et la **rupture avec Breton** |
| Les voyages, l’**URSS** | L’engagement |
| **Elsa Triolet** | L’amour |
| La **vieillesse qui commence** | Le point d’où l’on écrit |

> Le titre dit qu’**une vie ne se referme pas**.

## La forme
| Choix | Ce qu’il vise |
| L’alternance des mètres | Alexandrins, vers de **quatorze syllabes**, octosyllabes |
| Le **retour de la rime** | **Que les modernes avaient abandonnée** |
| Refrains, jeux d’**enjambements** | La musique |

> Aragon l’a théorisé dans *Les Yeux d’Elsa* : la rime est **ce qui reste quand la mémoire flanche** — l’instrument d’une poésie **populaire et chantable**.

Beaucoup de ces poèmes ont été **mis en musique** : **Ferré**, **Ferrat**, **Brassens**.

## À retenir
L’un des grands recueils de l’après-guerre.

| Ce qu’il fait tenir ensemble | Le détail |
| Le **lyrisme amoureux** | Elsa |
| L’**engagement** communiste **et ses doutes** | Après **1956** et le rapport Khrouchtchev |
| Une réflexion sur le **temps** | Le fil du recueil |

« **Strophes pour se souvenir** », sur le groupe **Manouchian**, y côtoie des poèmes d’amour.

> « Que serais-je sans toi qui vins à ma rencontre… »`,
          },
          questions: [
            ['Comment Aragon présente-t-il ce recueil ?', ['Comme une autobiographie en vers', 'Comme un roman', 'Comme un essai politique', 'Comme un journal de guerre'], 0, 'Le titre indique qu’une vie ne se referme pas.'],
            ['Quel secret de naissance le recueil évoque-t-il ?', ['Aragon a été élevé en croyant que sa mère était sa sœur', 'Il était orphelin', 'Il ignorait sa nationalité', 'Il avait un frère jumeau'], 0, 'La révélation a marqué toute son œuvre.'],
            ['Quelle particularité formelle Aragon revendique-t-il ?', ['Le retour de la rime, que les modernes avaient abandonnée', 'La suppression de la ponctuation', 'Le vers libre exclusif', 'Le poème en prose'], 0, 'La rime est selon lui l’instrument d’une poésie populaire et chantable.'],
            ['Quel poème du recueil évoque le groupe Manouchian ?', ['Strophes pour se souvenir', 'Le Conscrit des cent villages', 'Les Yeux d’Elsa', 'La Rose et le Réséda'], 0, 'Il a été mis en musique par Léo Ferré.'],
            ['Quel événement politique traverse le recueil ?', ['Les doutes de 1956, après le rapport Khrouchtchev', 'La guerre d’Algérie seule', 'Mai 68', 'La Libération'], 0, 'L’engagement communiste y côtoie l’inquiétude.'],
            ['Les poèmes d’Aragon ont été largement mis en musique.', ['Vrai', 'Faux'], 0, 'Ferré, Ferrat et Brassens en ont fait des chansons connues de tous.'],
          ],
        },
        {
          titre: 'Le Rouge et le Noir, Stendhal',
          lecon: {
            titre: 'Stendhal, 1830 — chronique de 1830',
            cours: `## L’histoire
| Étape | Ce qui se passe |
| L’origine | **Julien Sorel**, fils d’un charpentier de **Verrières**, **nourri du souvenir de Napoléon** |
| Verrières | Précepteur chez **M. de Rênal**, il séduit sa femme — **autant par orgueil de classe que par amour** |
| Besançon | L’affaire découverte, il entre au **séminaire** |
| Paris | Secrétaire du **marquis de La Mole** ; **Mathilde** s’éprend de lui et, **enceinte**, obtient pour lui un **titre** et un **régiment** |
| La ruine | Une **lettre** de Madame de Rênal, **dictée par son confesseur** |
| L’acte | Julien retourne à Verrières et **tire sur elle pendant la messe** |
| Le procès | Elle **survit** ; lui **refuse de se défendre** et **accuse la société** de condamner en lui **un paysan qui a voulu s’élever** |
| La fin | **Guillotiné**, enterré par **Mathilde** ; **Madame de Rênal meurt trois jours après** |

## À retenir
Sous-titre : « **Chronique de 1830** ».

| Couleur | Ce qu’elle désigne |
| Le **rouge** | L’**armée** — **fermée depuis Napoléon** |
| Le **noir** | L’**Église** — **seule voie d’ascension sous la Restauration** |

| Marque de Stendhal | Son effet |
| L’**ironie du narrateur** | Il dit souvent le contraire de ce qu’il montre |
| Le **discours indirect libre** | La pensée entre dans le récit |
| La **focalisation serrée** | On suit les **calculs** du héros |

> Sa définition célèbre : « **Un roman est un miroir que l’on promène le long d’un chemin.** »

> « À vingt ans, l’idée d’aller à Paris ! »`,
          },
          questions: [
            ['Que symbolisent le rouge et le noir ?', ['L’armée et l’Église, deux voies d’ascension', 'Le sang et la mort', 'La révolution et la royauté', 'L’amour et la haine'], 0, 'Julien serait officier sous Napoléon ; il sera séminariste.'],
            ['Quelle est l’origine sociale de Julien ?', ['Fils d’un charpentier de Verrières', 'Fils d’un notaire', 'Orphelin recueilli par l’Église', 'Fils d’un officier de l’Empire'], 0, 'Son orgueil de classe explique ses conduites.'],
            ['Qu’est-ce qui ruine sa réussite parisienne ?', ['Une lettre de Madame de Rênal, dictée par son confesseur', 'Un duel', 'Une dette de jeu', 'Une dénonciation de Mathilde'], 0, 'Elle le dénonce comme séducteur ambitieux.'],
            ['Où Julien tire-t-il sur Madame de Rênal ?', ['Dans l’église de Verrières, pendant la messe', 'Chez les La Mole', 'Dans le jardin de Vergy', 'Au séminaire'], 0, 'Le lieu donne au geste sa portée de scandale.'],
            ['Que fait Julien à son procès ?', ['Il accuse la société de le condamner comme paysan sorti de sa classe', 'Il plaide la folie', 'Il nie les faits', 'Il implore la clémence'], 0, 'C’est le sommet politique du roman.'],
            ['Le roman est sous-titré « Chronique de 1830 ».', ['Vrai', 'Faux'], 0, 'Il paraît l’année même de la révolution de Juillet.'],
          ],
        },
        {
          titre: 'Le Tartuffe, Molière',
          lecon: {
            titre: 'Molière, 1664-1669 — cinq ans de bataille contre les dévots',
            cours: `## L’histoire
| Étape | Ce qui se passe |
| L’aveuglement | **Orgon**, riche bourgeois, a recueilli **Tartuffe**, **faux dévot** à la **piété ostentatoire** |
| Les dons | Il lui promet sa fille **Mariane** — qui aime **Valère** —, le fait **son héritier** et lui confie une **cassette compromettante** |
| Les lucides | La servante **Dorine**, le fils **Damis**, le beau-frère **Cléante**, la femme **Elmire** |
| Les aveugles | **Orgon** et sa mère **Madame Pernelle** |
| Le **piège** | Elmire cache Orgon **sous une table** et **laisse Tartuffe la courtiser** |
| Le retournement | Orgon, **enfin détrompé**, le chasse — **mais trop tard** : Tartuffe **possède la donation et la cassette** et **fait expulser la famille** |
| Le dénouement | Un **exempt** du roi intervient **in extremis** : **le prince a démasqué l’imposteur** |

## À retenir
| Date | Le sort de la pièce |
| **1664** | **Interdite** |
| 1667 | Remaniée — **encore interdite** |
| **1669** | **Autorisée** |

> La « **cabale des dévots** » y a vu une **attaque contre la religion** — quand Molière visait l’**hypocrisie religieuse**.

Le **dénouement par le roi** est un **hommage obligé** — et **fragile**.

> Le personnage-titre **n’entre qu’au troisième acte** : il a d’abord été **construit par les paroles des autres**. C’est l’un des coups de génie de la construction.

> « Couvrez ce sein que je ne saurais voir. »`,
          },
          questions: [
            ['Qui est Tartuffe ?', ['Un faux dévot recueilli par Orgon', 'Le confesseur de la famille', 'Le frère d’Elmire', 'Un notaire'], 0, 'Sa piété ostentatoire aveugle Orgon.'],
            ['Comment Elmire démasque-t-elle Tartuffe ?', ['En cachant Orgon sous une table pendant qu’il la courtise', 'En lisant ses lettres', 'En le dénonçant au roi', 'En le faisant suivre'], 0, 'La scène est l’une des plus célèbres du théâtre français.'],
            ['Qu’a imprudemment donné Orgon à Tartuffe ?', ['Une donation de ses biens et une cassette compromettante', 'Sa maison de campagne seulement', 'Une charge de notaire', 'Son titre de noblesse'], 0, 'C’est ce qui permet à Tartuffe de faire expulser la famille.'],
            ['Comment la pièce se dénoue-t-elle ?', ['Un exempt du roi arrête Tartuffe', 'Orgon tue Tartuffe', 'Tartuffe s’enfuit de lui-même', 'La famille quitte Paris'], 0, 'Un hommage obligé au prince, et une fin fragile.'],
            ['Combien de temps la pièce est-elle restée interdite ?', ['Cinq ans, de 1664 à 1669', 'Un an', 'Dix ans', 'Elle n’a jamais été interdite'], 0, 'La cabale des dévots y voyait une attaque contre la religion.'],
            ['Tartuffe apparaît dès la première scène.', ['Vrai', 'Faux'], 1, 'Il n’entre qu’au troisième acte, après avoir été construit par les paroles des autres.'],
          ],
        },
      ],
    },
  ],
}
