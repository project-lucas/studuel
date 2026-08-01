// Arts plastiques — 6e → Terminale.
// Cycle 3 (6e), cycle 4 (5e-4e-3e), lycée (2de-1re-Tle, option).

export default {
  slug: 'arts-plastiques',
  nom: 'Arts plastiques',
  blocs: [
    {
      niveaux: ['6e'],
      chapitres: [
        {
          titre: 'La couleur',
          lecon: {
            titre: 'Comprendre et utiliser les couleurs',
            cours: `La couleur n'est pas un décor : c'est un outil de composition.

## Primaires, secondaires, tertiaires
Les couleurs **primaires** en peinture sont le magenta (rouge), le cyan (bleu) et le jaune : on ne peut pas les obtenir par mélange. Les **secondaires** naissent du mélange de deux primaires : vert, orange, violet. Les **tertiaires** mélangent une primaire et une secondaire voisine.

## Les couleurs complémentaires
Elles se font face sur le cercle chromatique : rouge/vert, bleu/orange, jaune/violet. Côte à côte, elles se renforcent mutuellement ; mélangées, elles s'éteignent en gris.

## Chaudes et froides
Rouges, oranges, jaunes sont perçus comme **chauds** et semblent avancer ; bleus et verts comme **froids** et semblent reculer. C'est un moyen simple de créer de la profondeur.

## Valeur et saturation
La **valeur** est le degré de clair ou de sombre ; la **saturation**, l'intensité de la couleur. Une couleur peut être vive et sombre, pâle et lumineuse : les deux notions sont indépendantes.`,
          },
          questions: [
            ['Quelles sont les trois couleurs primaires en peinture ?', ['Magenta, cyan, jaune', 'Rouge, vert, bleu', 'Noir, blanc, gris', 'Orange, violet, vert'], 0, 'On ne peut pas les obtenir en mélangeant d’autres couleurs.'],
            ['Quelle est la complémentaire du bleu ?', ['L’orange', 'Le vert', 'Le violet', 'Le rouge'], 0, 'Elles se font face sur le cercle chromatique.'],
            ['Deux couleurs complémentaires mélangées donnent un gris.', ['Vrai', 'Faux'], 0, 'Elles s’éteignent mutuellement ; côte à côte, au contraire, elles se renforcent.'],
            ['Les couleurs froides semblent…', ['Reculer dans l’image', 'Avancer vers le spectateur', 'Disparaître', 'Vibrer'], 0, 'C’est un moyen simple de suggérer la profondeur.'],
            ['Le vert est une couleur secondaire.', ['Vrai', 'Faux'], 0, 'Il naît du mélange du jaune et du cyan.'],
            ['Que désigne la valeur d’une couleur ?', ['Son degré de clair ou de sombre', 'Son prix', 'Son intensité', 'Sa température'], 0, 'À ne pas confondre avec la saturation.'],
            ['La saturation désigne l’intensité d’une couleur.', ['Vrai', 'Faux'], 0, 'Une couleur peu saturée tire vers le gris.'],
            ['Comment obtient-on du violet ?', ['En mélangeant du magenta et du cyan', 'En mélangeant du jaune et du rouge', 'En mélangeant du vert et du bleu', 'En ajoutant du blanc au rouge'], 0, 'Deux primaires donnent une secondaire.'],
          ],
        },
        {
          titre: 'La représentation de l’espace',
          lecon: {
            titre: 'Donner de la profondeur à une image',
            cours: `Une feuille est plate : représenter l'espace est une **construction**, jamais une évidence.

## Les procédés simples
La **superposition** (ce qui cache est devant), l'**étagement** (ce qui est plus haut sur la feuille est plus loin), la **taille relative** (plus c'est petit, plus c'est loin).

## La perspective linéaire
Inventée à la Renaissance : les lignes parallèles convergent vers un **point de fuite** situé sur la **ligne d'horizon**, à hauteur d'œil. Un point de fuite pour une vue frontale, deux pour une vue d'angle.

## La perspective atmosphérique
Plus un objet est loin, plus il devient pâle, bleuté, flou et peu contrasté. Léonard de Vinci l'utilise dans les arrière-plans de ses tableaux.

## Rompre avec l'espace
Le XXe siècle a délibérément cassé ces règles : le cubisme montre plusieurs points de vue à la fois, l'abstraction abandonne la représentation. Connaître la règle permet d'en jouer.`,
          },
          questions: [
            ['Vers quoi convergent les lignes en perspective linéaire ?', ['Le point de fuite', 'Le centre du tableau', 'Le cadre', 'Le premier plan'], 0, 'Il se situe sur la ligne d’horizon, à hauteur d’œil.'],
            ['La perspective linéaire a été formalisée à la Renaissance.', ['Vrai', 'Faux'], 0, 'Brunelleschi et Alberti en posent les règles au XVe siècle.'],
            ['En perspective atmosphérique, les objets lointains sont…', ['Plus pâles et moins contrastés', 'Plus vifs', 'Plus nets', 'Plus sombres'], 0, 'L’air épaissit et bleuit la vision au loin.'],
            ['La superposition indique que…', ['Ce qui cache est devant', 'Ce qui cache est derrière', 'Les objets sont de même taille', 'L’image est plate'], 0, 'C’est le procédé le plus élémentaire de profondeur.'],
            ['Une vue d’angle nécessite deux points de fuite.', ['Vrai', 'Faux'], 0, 'La vue frontale n’en demande qu’un.'],
            ['Le cubisme…', ['Montre plusieurs points de vue à la fois', 'Perfectionne la perspective', 'Copie la photographie', 'Supprime la couleur'], 0, 'Braque et Picasso brisent le point de vue unique.'],
            ['L’étagement place les éléments lointains plus haut sur la feuille.', ['Vrai', 'Faux'], 0, 'C’est un procédé ancien, très présent avant la Renaissance.'],
            ['La ligne d’horizon correspond…', ['À la hauteur d’œil du spectateur', 'Au bord haut du tableau', 'Au sol', 'Au centre exact de l’image'], 0, 'Elle détermine si l’on regarde de haut ou de bas.'],
          ],
        },
        {
          titre: 'Matières, outils et gestes',
          lecon: {
            titre: 'Faire avec ce qu’on a sous la main',
            cours: `En arts plastiques, le **geste** et le **matériau** font partie de l'œuvre.

## Les gestes
Tracer, frotter, gratter, déchirer, coller, superposer, effacer, tamponner. Chaque geste laisse une trace reconnaissable : une même couleur n'a pas le même effet posée au pinceau, au rouleau ou à l'éponge.

## Les matériaux
Crayon, fusain, encre, gouache, aquarelle, pastel, papiers, tissus, objets récupérés. Le **collage**, inventé au début du XXe siècle, introduit le réel dans l'œuvre.

## Le format et le support
Un même dessin change de sens selon qu'il est minuscule ou monumental, sur papier lisse ou froissé, sur toile ou sur carton. Le support n'est jamais neutre.

## Le hasard maîtrisé
Coulures, empreintes, taches : de nombreux artistes ont fait du hasard un allié — les **frottages** de Max Ernst, le dripping de Jackson Pollock. Provoquer un accident et savoir le garder est un savoir-faire.`,
          },
          questions: [
            ['Le collage introduit…', ['Des éléments du réel dans l’œuvre', 'De la perspective', 'Des couleurs primaires', 'De la symétrie'], 0, 'Il apparaît au début du XXe siècle avec le cubisme.'],
            ['Le support d’une œuvre est un choix neutre.', ['Vrai', 'Faux'], 1, 'Format, texture, matière du support changent le sens de l’image.'],
            ['Quelle technique consiste à laisser couler la peinture ?', ['Le dripping', 'Le frottage', 'Le pochoir', 'Le glacis'], 0, 'Jackson Pollock en a fait sa signature.'],
            ['Le frottage a été développé par…', ['Max Ernst', 'Claude Monet', 'Auguste Rodin', 'Andy Warhol'], 0, 'Il révèle par frottement le relief d’une surface.'],
            ['Une même couleur produit le même effet quel que soit l’outil.', ['Vrai', 'Faux'], 1, 'Pinceau, rouleau, éponge : la trace change tout.'],
            ['Qu’est-ce que le fusain ?', ['Un bâtonnet de charbon de bois pour dessiner', 'Une peinture à l’huile', 'Un papier épais', 'Un vernis'], 0, 'Il permet des noirs profonds et s’estompe facilement.'],
            ['Agrandir un dessin au format monumental change sa perception.', ['Vrai', 'Faux'], 0, 'Le corps du spectateur entre alors en rapport avec l’œuvre.'],
            ['Provoquer un accident et le conserver est…', ['Un savoir-faire artistique', 'Une erreur', 'Interdit', 'Un manque de technique'], 0, 'Le hasard maîtrisé est une démarche assumée.'],
          ],
        },
      ],
    },
    {
      niveaux: ['5e', '4e', '3e'],
      chapitres: [
        {
          titre: 'L’œuvre et son spectateur',
          lecon: {
            titre: 'Où commence et où s’arrête une œuvre ?',
            cours: `Une œuvre n'existe pleinement que regardée.

## Le cadre et le hors-champ
Cadrer, c'est choisir ce qu'on montre — et donc ce qu'on cache. Le **hors-champ** travaille l'imagination du spectateur : ce qu'on ne voit pas peut être plus présent que ce qu'on voit.

## L'échelle et le lieu
Une même forme n'a pas le même effet dans une vitrine, dans un musée ou sur une place publique. L'**in situ** désigne une œuvre conçue pour un lieu précis, indissociable de lui.

## Le spectateur actif
Certaines œuvres exigent que le spectateur se déplace, touche, participe, ou complète mentalement. L'art cinétique joue du mouvement du regardeur ; les installations l'obligent à entrer dedans.

## Le titre
Le titre oriente la lecture. *Sans titre* laisse volontairement libre ; un titre précis ferme ou déplace le sens. C'est un élément de l'œuvre, pas une étiquette.`,
          },
          questions: [
            ['Que désigne le hors-champ ?', ['Ce qui est hors du cadre mais reste présent', 'Le fond de l’image', 'Le cadre en bois', 'Le premier plan'], 0, 'Il travaille l’imagination du spectateur.'],
            ['Une œuvre in situ est conçue pour un lieu précis.', ['Vrai', 'Faux'], 0, 'La déplacer la dénature.'],
            ['Le titre d’une œuvre…', ['Fait partie de l’œuvre et oriente sa lecture', 'Est une simple étiquette', 'Est toujours descriptif', 'Est choisi par le musée'], 0, '*Sans titre* est lui-même un choix.'],
            ['L’art cinétique joue avec…', ['Le mouvement', 'Le silence', 'La photographie', 'L’écriture'], 0, 'Mouvement réel de l’œuvre ou déplacement du spectateur.'],
            ['Cadrer, c’est aussi décider ce qu’on cache.', ['Vrai', 'Faux'], 0, 'Le choix du cadre est un acte de sens.'],
            ['Une installation se caractérise par le fait que…', ['Le spectateur y entre ou la parcourt', 'Elle est toujours peinte', 'Elle tient dans une main', 'Elle est numérique'], 0, 'Elle occupe et transforme un espace.'],
            ['Changer une œuvre de lieu ne change jamais son sens.', ['Vrai', 'Faux'], 1, 'Vitrine, musée, rue : le contexte fait partie de la réception.'],
            ['Une œuvre participative suppose…', ['Une action du spectateur', 'Un guide', 'Un grand format', 'Un cadre doré'], 0, 'Sans son intervention, l’œuvre reste incomplète.'],
          ],
        },
        {
          titre: 'Image, message et publicité',
          lecon: {
            titre: 'Décoder les images qui nous entourent',
            cours: `Nous recevons chaque jour des centaines d'images construites pour agir sur nous.

## Dénotation et connotation
La **dénotation** est ce que l'image montre littéralement. La **connotation** est ce qu'elle suggère : valeurs, émotions, appartenance sociale. Une voiture photographiée sur une route déserte dénote une voiture ; elle connote la liberté.

## Les procédés de l'image publicitaire
Cadrage serré, lumière valorisante, retouche, mise en scène du corps, association d'idées (un produit + un décor + une musique). Le texte (**accroche**) ancre le sens que l'image seule laisserait flottant.

## Détournement et parodie
Depuis les années 1960, de nombreux artistes détournent les codes publicitaires pour les retourner contre eux : c'est le principe du **détournement**, hérité des situationnistes.

## Regard critique
Se demander : qui parle ? à qui ? pour vendre quoi ? que montre-t-on, que cache-t-on ? Ces questions suffisent à transformer un spectateur en lecteur d'images.`,
          },
          questions: [
            ['Que désigne la connotation d’une image ?', ['Ce qu’elle suggère au-delà de ce qu’elle montre', 'Ce qu’elle montre littéralement', 'Son format', 'Son auteur'], 0, 'Valeurs, émotions, associations d’idées.'],
            ['L’accroche d’une publicité sert à ancrer le sens de l’image.', ['Vrai', 'Faux'], 0, 'Sans texte, l’image reste souvent ambiguë.'],
            ['Le détournement consiste à…', ['Réutiliser des codes existants pour les retourner', 'Copier une œuvre', 'Restaurer un tableau', 'Photographier une publicité'], 0, 'La pratique vient notamment des situationnistes.'],
            ['La dénotation, c’est…', ['Ce que l’image montre littéralement', 'Ce qu’elle évoque', 'Sa valeur marchande', 'Son cadre'], 0, 'Le niveau descriptif, avant interprétation.'],
            ['Une image publicitaire est une image neutre.', ['Vrai', 'Faux'], 1, 'Chaque choix (cadrage, lumière, retouche) sert une intention commerciale.'],
            ['Quelle question est la plus utile pour lire une image ?', ['Qui parle, à qui, pour quoi ?', 'Combien coûte-t-elle ?', 'Quelle est sa taille ?', 'Qui l’a imprimée ?'], 0, 'Elle fait apparaître l’intention derrière l’image.'],
            ['La retouche numérique fait partie des procédés publicitaires courants.', ['Vrai', 'Faux'], 0, 'Elle façonne des corps et des objets idéalisés.'],
            ['Une même photo peut changer de sens selon son texte d’accompagnement.', ['Vrai', 'Faux'], 0, 'C’est l’ancrage : le texte fixe l’une des lectures possibles.'],
          ],
        },
        {
          titre: 'Volume, espace et sculpture',
          lecon: {
            titre: 'Travailler en trois dimensions',
            cours: `Passer du plan au volume change tout : l'œuvre a un dos, un poids, une place.

## Les techniques
**Tailler** (retirer de la matière : pierre, bois), **modeler** (ajouter : argile, plâtre), **assembler** (souder, coller, visser), **mouler** (reproduire par empreinte).

## Plein et vide
Un volume se lit autant par ses creux que par ses pleins. Henry Moore perce ses figures ; l'espace traverse la sculpture et devient partie de l'œuvre.

## Socle ou pas de socle
Le socle isole l'œuvre et la désigne comme art. Le supprimer (Brancusi, puis l'art contemporain) fait descendre la sculpture dans notre espace, au même niveau que nous.

## Le ready-made
En 1917, **Marcel Duchamp** présente un urinoir renversé et signé sous le titre *Fontaine*. L'objet n'est pas fabriqué par l'artiste : c'est le **choix** et le **déplacement** qui font l'œuvre. Une bascule dont l'art du XXe siècle ne s'est jamais remis.`,
          },
          questions: [
            ['Quelle technique consiste à retirer de la matière ?', ['La taille', 'Le modelage', 'L’assemblage', 'Le moulage'], 0, 'On taille la pierre ou le bois ; on modèle l’argile.'],
            ['Qui a présenté *Fontaine* en 1917 ?', ['Marcel Duchamp', 'Pablo Picasso', 'Constantin Brancusi', 'Henry Moore'], 0, 'Un urinoir renversé et signé : le premier ready-made exposé.'],
            ['Dans un ready-made, l’artiste fabrique l’objet lui-même.', ['Vrai', 'Faux'], 1, 'C’est le choix et le déplacement de l’objet qui font l’œuvre.'],
            ['Supprimer le socle d’une sculpture…', ['La fait entrer dans notre espace', 'La rend plus fragile', 'La cache', 'La rend abstraite'], 0, 'Elle n’est plus mise à distance comme un objet sacré.'],
            ['Le vide fait partie intégrante d’une sculpture.', ['Vrai', 'Faux'], 0, 'Les creux structurent la lecture autant que les pleins.'],
            ['Le modelage consiste à…', ['Ajouter de la matière', 'Retirer de la matière', 'Souder du métal', 'Peindre un volume'], 0, 'Argile, plâtre, cire : on construit par ajout.'],
            ['Le moulage permet de reproduire une forme par empreinte.', ['Vrai', 'Faux'], 0, 'Il autorise plusieurs exemplaires d’une même sculpture.'],
            ['Une sculpture se regarde…', ['En tournant autour', 'De face uniquement', 'De loin uniquement', 'En photo'], 0, 'Elle a un dos, des angles, une occupation de l’espace.'],
          ],
        },
      ],
    },
    {
      niveaux: ['2de', '1re', 'Tle'],
      chapitres: [
        {
          titre: 'Démarche artistique et projet',
          lecon: {
            titre: 'Conduire un projet plastique',
            cours: `Au lycée, ce qui est évalué n'est pas seulement l'objet produit : c'est la **démarche**.

## Intention et problématique
Tout projet part d'une intention formulable : « je veux rendre visible la disparition », « je veux que le spectateur hésite ». La question posée guide les choix plastiques ; sans elle, la production reste illustrative.

## Le carnet de recherche
Croquis, essais ratés, références, notes : le carnet montre le **cheminement**. Un échec documenté vaut mieux qu'une réussite inexpliquée.

## Les références
Situer son travail par rapport à des artistes n'est pas copier : c'est se positionner. Citer, prolonger, contredire — les trois relations sont légitimes si elles sont conscientes.

## Présenter et défendre
Accrochage, éclairage, ordre de lecture, texte d'intention : la présentation est le dernier acte plastique. Défendre son travail, c'est expliciter les choix, pas justifier les manques.`,
          },
          questions: [
            ['Que montre principalement un carnet de recherche ?', ['Le cheminement, y compris les essais ratés', 'Uniquement les réussites', 'Les notes obtenues', 'La liste du matériel'], 0, 'Un échec documenté vaut mieux qu’une réussite inexpliquée.'],
            ['Citer un artiste dans son projet, c’est copier son travail.', ['Vrai', 'Faux'], 1, 'C’est se positionner : citer, prolonger ou contredire.'],
            ['Une démarche artistique part…', ['D’une intention formulable', 'Du matériel disponible', 'De la note visée', 'Du format imposé'], 0, 'L’intention guide les choix plastiques.'],
            ['L’accrochage fait partie du travail artistique.', ['Vrai', 'Faux'], 0, 'Ordre, hauteur, lumière, espacement : ce sont des choix de sens.'],
            ['Défendre son travail consiste à…', ['Expliciter ses choix', 'Justifier ses manques', 'Comparer avec les autres', 'Décrire la technique seule'], 0, 'On explique pourquoi ces choix-là, pas pourquoi ce n’est pas parfait.'],
            ['Une production sans question posée reste souvent…', ['Illustrative', 'Abstraite', 'Conceptuelle', 'Monumentale'], 0, 'Elle montre sans interroger.'],
            ['Le texte d’intention accompagne utilement une présentation.', ['Vrai', 'Faux'], 0, 'Il donne au spectateur une entrée dans la démarche.'],
            ['Dans un projet, un essai raté est…', ['Une étape utile de la recherche', 'Une perte de temps', 'À cacher', 'Une faute'], 0, 'Il documente les choix écartés et leurs raisons.'],
          ],
        },
        {
          titre: 'Art contemporain : formes et enjeux',
          lecon: {
            titre: 'Comprendre l’art depuis 1960',
            cours: `L'art contemporain déroute souvent parce qu'il a déplacé la question : non plus « est-ce beau ? », mais « qu'est-ce que cela fait ? ».

## Les grands déplacements
De l'objet à l'**idée** (art conceptuel), de l'atelier au **lieu** (in situ, land art), de l'objet au **corps** (performance), de l'unique au **reproductible** (Pop art, sérigraphie).

## Quelques repères
**Andy Warhol** et la reproduction sérielle ; **Christo et Jeanne-Claude** et l'emballage monumental ; **Sophie Calle** et le récit ; **Ai Weiwei** et l'art politique ; le street art passé de l'illégalité au marché.

## Le marché et l'institution
Galeries, foires, biennales, musées : la valeur d'une œuvre contemporaine se construit aussi socialement. Comprendre ce circuit fait partie de la compréhension de l'œuvre.

## Le rôle du regardeur
« C'est le regardeur qui fait le tableau », disait Duchamp. Beaucoup d'œuvres contemporaines n'existent qu'activées par une interprétation, une participation ou un récit.`,
          },
          questions: [
            ['Quelle question l’art contemporain déplace-t-il ?', ['De « est-ce beau ? » à « qu’est-ce que cela fait ? »', 'De « qui l’a fait ? » à « combien ça coûte ? »', 'De « où ? » à « quand ? »', 'Aucune, la question reste la même'], 0, 'Le critère se déplace du goût vers l’effet et le sens.'],
            ['L’art conceptuel privilégie…', ['L’idée sur l’objet', 'La technique sur l’idée', 'La peinture à l’huile', 'Le portrait'], 0, 'L’œuvre peut se réduire à un protocole ou un énoncé.'],
            ['La performance met le corps de l’artiste au centre.', ['Vrai', 'Faux'], 0, 'L’œuvre est l’action, souvent éphémère.'],
            ['Qui est associé à la reproduction sérielle et au Pop art ?', ['Andy Warhol', 'Christo', 'Sophie Calle', 'Ai Weiwei'], 0, 'Sérigraphies de Marilyn, de boîtes de soupe, de dollars.'],
            ['Le land art se pratique en atelier.', ['Vrai', 'Faux'], 1, 'Il travaille directement dans le paysage.'],
            ['Selon Duchamp, qui « fait le tableau » ?', ['Le regardeur', 'Le peintre seul', 'Le musée', 'Le collectionneur'], 0, 'L’interprétation est constitutive de l’œuvre.'],
            ['La valeur d’une œuvre contemporaine se construit aussi socialement.', ['Vrai', 'Faux'], 0, 'Galeries, foires, critiques et musées y participent.'],
            ['Le street art est resté en dehors du marché de l’art.', ['Vrai', 'Faux'], 1, 'Il y est largement entré depuis les années 2000.'],
          ],
        },
        {
          titre: 'Image numérique et création',
          lecon: {
            titre: 'Créer avec les outils numériques',
            cours: `Le numérique n'est pas un simple pinceau supplémentaire : il change le statut de l'image.

## Pixel et vecteur
Une image **matricielle** (bitmap) est une grille de pixels : elle se dégrade en s'agrandissant. Une image **vectorielle** est décrite par des formules : elle s'agrandit sans perte. Photo = matriciel, logo = vectoriel.

## Résolution et formats
La résolution se mesure en pixels (dimensions) et en ppp/dpi pour l'impression. JPEG compresse en perdant de l'information, PNG conserve la transparence, TIFF garde la qualité maximale, SVG est vectoriel.

## Le montage et la retouche
Calques, masques, détourage, fondus : le montage permet des images sans référent réel. D'où une question centrale — que reste-t-il de la valeur de preuve d'une photographie ?

## L'œuvre reproductible
Walter Benjamin l'avait anticipé dès 1935 : la reproduction fait perdre à l'œuvre son « aura », son ici-et-maintenant. Le numérique pousse cette logique à l'extrême — copie parfaite, diffusion instantanée, auteur parfois indéterminé.`,
          },
          questions: [
            ['Quelle image ne se dégrade pas en s’agrandissant ?', ['L’image vectorielle', 'L’image matricielle', 'Le JPEG', 'La photographie'], 0, 'Elle est décrite par des formules, pas par des pixels.'],
            ['Le JPEG est un format de compression avec perte.', ['Vrai', 'Faux'], 0, 'Il allège le fichier en supprimant de l’information.'],
            ['Quel format conserve la transparence ?', ['Le PNG', 'Le JPEG', 'Le BMP', 'Le TIFF'], 0, 'Il gère un canal alpha.'],
            ['Qui a théorisé la perte d’« aura » de l’œuvre reproduite ?', ['Walter Benjamin', 'Marcel Duchamp', 'André Malraux', 'Roland Barthes'], 0, 'Dans son essai de 1935 sur l’œuvre d’art à l’ère de sa reproductibilité technique.'],
            ['Une photographie numérique constitue toujours une preuve fiable.', ['Vrai', 'Faux'], 1, 'Le montage rend possible une image sans référent réel.'],
            ['À quoi servent les calques dans un logiciel d’image ?', ['À superposer et modifier des éléments indépendamment', 'À compresser le fichier', 'À imprimer', 'À changer le format'], 0, 'Ils rendent le montage non destructif.'],
            ['Un logo gagne à être conçu en vectoriel.', ['Vrai', 'Faux'], 0, 'Il doit rester net de la carte de visite à l’affiche.'],
            ['La résolution d’impression se mesure en…', ['ppp (points par pouce)', 'Hz', 'Ko', 'cm'], 0, 'Elle conditionne la finesse du rendu imprimé.'],
          ],
        },
      ],
    },
  ],
}
