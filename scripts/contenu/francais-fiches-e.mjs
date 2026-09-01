// Français — PREMIÈRE : le rayon « Fiches de lecture » (5/5).
//
// SUITE DE `francais-fiches-d.mjs`. Même format court, même rayon « fiches »,
// mêmes titres portant l'auteur (ce qui évite la collision avec les fiches du
// rayon Programme, `chapters` étant UNIQUE(subject_id, level, title)).
//
// LES POSITIONS REPRENNENT À 152 : les modules A à D occupent 100 à 307. L'ordre
// alphabétique de la maquette est ainsi celui de la page, qui trie par
// `position`.
//
// AUCUN MÉNAGE ICI : il est joué par la 259, à exécuter AVANT.

export default {
  slug: 'francais',
  nom: 'Français',

  titreMigration: 'FRANÇAIS 1re — FICHES DE LECTURE (5/5) : Mémoires d’outre-tombe → Zazie dans le métro',

  motif: `CINQUIÈME ET DERNIÈRE TRANCHE DES FICHES DE LECTURE (voir la 261 pour le détail du
rayon et de son format). Cinquante-deux œuvres, des Mémoires d’outre-tombe à Zazie dans le métro.

Les positions reprennent à 308, derrière les 208 fiches des 261 à 264 : l'ordre
alphabétique de la maquette est celui de la page, qui trie par position.

⚠️ ORDRE D'EXÉCUTION : la 259 D'ABORD (colonnes theme et discipline, ménage
des composites). Cette migration n'écrit que des fiches neuves.`,

  blocs: [
    {
      niveaux: ['1re'],
      rayon: 'fiches',
      axe: 'Fiches de lecture',
      positionDepart: 308,
      chapitres: [
        {
          titre: 'Mémoires d’outre-tombe, François-René de Chateaubriand',
          lecon: {
            titre: 'Chateaubriand, 1849 — parler depuis l’au-delà',
            cours: `## L’œuvre
**Quarante-deux livres**, écrits sur **plus de trente ans** et publiés **après sa mort**, en **1849-1850**.

> D’où le titre : **l’auteur s’adresse au lecteur depuis sa tombe**. Il y raconte sa vie — mais surtout **son siècle**, qu’il a **traversé tout entier**.

## Les grandes parties
| Période | Ce qu’elle contient |
| L’**enfance** en Bretagne | Le château de **Combourg**, le **père taciturne**, la sœur **Lucile** |
| **1791** | Le voyage en **Amérique** |
| L’émigration | La **misère à Londres** |
| Le retour | Le succès du *Génie du christianisme*, l’ambassade — et la **rupture avec Napoléon** |
| La **Restauration** | La politique, l’ambassade à Rome |
| La fin | La **vieillesse** et le sentiment de **survivre à son monde** |

## À retenir
Chef-d’œuvre de la **prose française**.

| Ce que Chateaubriand invente | Comment |
| Une **écriture du temps** | Il **superpose les époques** — « Je me trouve **entre deux siècles** comme au **confluent de deux fleuves** » |
| Un « **je** » double | À la fois **intime et historique** |
| Un **double** fascinant | **Napoléon** y occupe des livres entiers — **fasciné et détesté** |

> Il **revient sur les lieux** et **compare ce qu’il fut à ce qu’il est** : c’est le procédé qui donne au livre sa profondeur.

> « J’ai rencontré la fin d’un vieux monde et le commencement d’un monde nouveau. »`,
          },
          questions: [
            ['Pourquoi le titre parle-t-il d’« outre-tombe » ?', ['L’œuvre devait paraître après la mort de l’auteur', 'Elle raconte des visions surnaturelles', 'Elle est écrite dans un cimetière', 'Elle s’adresse aux morts'], 0, 'Publiée en 1849-1850, elle s’adresse au lecteur depuis la tombe.'],
            ['Où se déroule l’enfance racontée dans les premiers livres ?', ['Au château de Combourg, en Bretagne', 'À Paris', 'En Normandie', 'En Amérique'], 0, 'Avec un père taciturne et la sœur Lucile.'],
            ['Quel voyage marque sa jeunesse ?', ['Un voyage en Amérique, en 1791', 'Un voyage en Russie', 'Un tour d’Italie', 'Un séjour en Égypte'], 0, 'Il en tirera Atala et René.'],
            ['Quelle figure occupe des livres entiers de l’œuvre ?', ['Napoléon', 'Louis XVI', 'Robespierre', 'Talleyrand'], 0, 'Un double fascinant et détesté.'],
            ['Quelle est la particularité de l’écriture du temps chez Chateaubriand ?', ['Il superpose les époques et se compare à lui-même', 'Il suit un ordre strictement chronologique', 'Il refuse toute date', 'Il écrit au présent uniquement'], 0, '« Je me trouve entre deux siècles comme au confluent de deux fleuves. »'],
            ['L’œuvre a été publiée du vivant de l’auteur.', ['Vrai', 'Faux'], 1, 'Elle paraît en 1849-1850, après sa mort.'],
          ],
        },
        {
          titre: 'Mémoires de guerre, Tome III : Le Salut, 1944-1946, Charles de Gaulle',
          lecon: {
            titre: 'De Gaulle, 1959 — la Libération racontée par celui qui l’a menée',
            cours: `## L’œuvre
**Troisième et dernier tome** des *Mémoires de guerre* — après *L’Appel* et *L’Unité* —, publié en **1959** : **l’année où de Gaulle devient président de la Ve République**.

| Période couverte | **Août 1944 – janvier 1946** |
| L’événement | Ce qu’il engage |
| La **libération de Paris** | Le rétablissement de l’**État** |
| L’**épuration** | La justice d’après-guerre |
| La place de la France | Dans la **victoire alliée** |
| Les réformes | Le **vote des femmes**, les **nationalisations**, la **Sécurité sociale** |
| La fin | La **démission de janvier 1946**, **face aux partis** |

## L’écriture
| Trait | Son effet |
| Une prose **classique**, travaillée, **volontairement solennelle** | Phrases **amples**, rythme **ternaire** |
| Des images empruntées à l’**histoire** et à la **géographie** | La France comme personne |
| Il parle de lui **à la troisième personne** — « **de Gaulle** » | **L’homme devient un personnage** ; le récit, une **épopée nationale** |

La première phrase de *L’Appel* est célèbre : « **Toute ma vie, je me suis fait une certaine idée de la France.** »

## À retenir
> Ce n’est **pas seulement un document historique** : c’est une **œuvre littéraire revendiquée**, où l’auteur **construit sa propre légende**.

**À lire comme un texte, avec ses procédés** — c’est ainsi qu’il figure dans les manuels.

> « La France ne peut être la France sans la grandeur. »`,
          },
          questions: [
            ['Quelle période ce tome couvre-t-il ?', ['Août 1944 – janvier 1946', '1940-1942', '1958-1962', '1939-1940'], 0, 'De la libération de Paris à sa démission.'],
            ['Quel événement clôt le volume ?', ['La démission de de Gaulle en janvier 1946', 'La victoire de mai 1945', 'Le retour au pouvoir en 1958', 'Le vote de la Constitution'], 0, 'Il quitte le pouvoir face au régime des partis.'],
            ['Quelle particularité stylistique frappe le lecteur ?', ['De Gaulle parle de lui à la troisième personne', 'Il écrit en vers', 'Il refuse toute date', 'Il emploie un style familier'], 0, 'L’homme devient personnage, le récit devient épopée.'],
            ['Quelle est la phrase la plus célèbre des Mémoires ?', ['« Toute ma vie, je me suis fait une certaine idée de la France »', '« La France a perdu une bataille »', '« Je vous ai compris »', '« Vive le Québec libre »'], 0, 'Elle ouvre le premier tome, L’Appel.'],
            ['Quelles réformes de cette période sont évoquées ?', ['Vote des femmes, nationalisations, Sécurité sociale', 'La décentralisation', 'La réforme du franc', 'L’indépendance de l’Algérie'], 0, 'Le programme du Conseil national de la Résistance est mis en œuvre.'],
            ['Ces Mémoires sont un simple document sans ambition littéraire.', ['Vrai', 'Faux'], 1, 'L’ambition littéraire y est revendiquée, et le style très travaillé.'],
          ],
        },
        {
          titre: 'Mes forêts, Hélène Dorion',
          lecon: {
            titre: 'Dorion, 2021 — la forêt comme miroir intime',
            cours: `## Le recueil
Publié en **2021** par la poétesse **québécoise** **Hélène Dorion** : **première autrice vivante** inscrite au programme du bac de français.

| Section | Son motif |
| « L’écorce incertaine » | La forêt comme corps |
| « Une chute de galets » | La fragilité, la perte |
| « Mes forêts sont de longues traînées de temps » | Le temps, la filiation |
| « Le bruissement du temps » | L’écoute, l’apaisement |

> Des **citations en exergue** — Rilke, Char, des scientifiques — **ouvrent les sections**.

## Ce qui s’y joue
La forêt **n’est pas un décor** : elle est un **double du sujet**.

| Le mot de l’arbre | Ce qu’il dit de l’humain |
| Les **racines**, les **cernes**, l’**écorce** | L’origine, le temps, la blessure |
| Tomber et repousser | La perte et le recommencement |

> Le **possessif du titre** le dit : *mes* forêts.

S’y mêlent le **deuil du père**, l’**enfance**, le **corps qui vieillit** — et une conscience **écologique** vécue **comme une appartenance au vivant**, **non comme un discours**.

## L’écriture
| Procédé | Son effet |
| **Vers libres**, ponctuation **quasi absente** | Le sens reste ouvert |
| Poèmes **courts**, **blancs typographiques** nombreux | **Le silence fait partie du texte** |
| Les **anaphores** — « mes forêts sont… » | Une pulsation d’**incantation** |

> Langue **simple et concrète** : **la densité vient des images, non du vocabulaire**.

> Parcours associé au bac : « la poésie, la nature, l’intime ».`,
          },
          questions: [
            ['De quelle nationalité est Hélène Dorion ?', ['Québécoise', 'Française', 'Belge', 'Suisse'], 0, 'Elle est la première autrice vivante au programme du bac de français.'],
            ['Combien de sections compose le recueil ?', ['Quatre', 'Deux', 'Six', 'Douze'], 0, 'Précédées d’un poème liminaire et ouvertes par des exergues.'],
            ['Que signifie le possessif du titre ?', ['La forêt est un paysage intérieur autant qu’extérieur', 'La poétesse possède une forêt', 'Ce sont des forêts imaginaires', 'Le titre est ironique'], 0, 'L’arbre sert à dire une vie humaine.'],
            ['Quelle forme prennent les poèmes ?', ['Vers libres, presque sans ponctuation, avec beaucoup de blancs', 'Sonnets', 'Alexandrins rimés', 'Poèmes en prose'], 0, 'Le silence fait partie du texte.'],
            ['Comment la dimension écologique s’exprime-t-elle ?', ['Comme une appartenance vécue au vivant, non comme un discours', 'Par un manifeste militant', 'Par des données scientifiques', 'Elle est absente'], 0, 'Quand la forêt brûle, c’est nous que la perte atteint.'],
            ['Quel deuil traverse le recueil ?', ['Celui du père', 'Celui d’un enfant', 'Celui d’un ami', 'Aucun'], 0, 'Il nourrit notamment la deuxième section.'],
          ],
        },
        {
          titre: 'Métamorphoses, Ovide',
          lecon: {
            titre: 'Ovide, an 8 — le grand réservoir des mythes',
            cours: `## L’œuvre
| Fait | Le détail |
| La forme | **Quinze livres** en hexamètres, environ **douze mille vers** |
| La date | Achevés vers **l’an 8** — **juste avant l’exil d’Ovide** à Tomes, sur la mer Noire, **décidé par Auguste** |
| Le sujet | L’**histoire du monde**, du **chaos** à l’**apothéose de César** |
| Le fil | **Deux cent cinquante récits de transformations** |

Des dieux, des hommes et des nymphes **changés en arbres, en animaux, en sources, en constellations**.

## Les récits les plus célèbres
| Récit | La métamorphose |
| **Daphné** | Changée en **laurier** pour échapper à Apollon |
| **Narcisse** | Amoureux de son reflet, changé en **fleur** |
| **Écho** | **Réduite à une voix** |
| **Pygmalion** | Sa **statue s’anime** |
| **Orphée** et Eurydice | La descente aux Enfers |
| **Icare** | Les **ailes de cire** |
| **Philémon et Baucis** | Les deux **arbres** entrelacés |
| **Arachné** | Changée en **araignée** |
| Deucalion | Le **déluge** |

## À retenir
> Ovide est **la source où l’Europe a puisé ses mythes pendant deux mille ans** : **Dante**, **Ronsard**, **Shakespeare**, **La Fontaine**, les peintres de la Renaissance — et **Freud**, pour Narcisse.

| Sa manière | Le détail |
| Des **transitions habiles** | Les récits **s’enchaînent** |
| Le mélange du **sublime** et du **badin** | Le ton varie sans cesse |
| Sa thèse | **La transformation est la loi même du monde** |

> « Mon dessein est de dire les formes changées en corps nouveaux. »`,
          },
          questions: [
            ['Quel est le sujet annoncé du poème ?', ['Les formes changées en corps nouveaux', 'La fondation de Rome', 'La guerre de Troie', 'Les travaux des champs'], 0, 'La transformation est la loi du monde selon Ovide.'],
            ['Combien de récits le poème contient-il environ ?', ['Deux cent cinquante', 'Vingt', 'Mille', 'Cinquante'], 0, 'Répartis en quinze livres et douze mille vers.'],
            ['En quoi Daphné est-elle transformée ?', ['En laurier', 'En fleur', 'En source', 'En araignée'], 0, 'Pour échapper à la poursuite d’Apollon.'],
            ['Qui tombe amoureux de son propre reflet ?', ['Narcisse', 'Pygmalion', 'Orphée', 'Icare'], 0, 'Il est changé en fleur ; Écho, elle, est réduite à une voix.'],
            ['Quel événement suit de peu l’achèvement du poème ?', ['L’exil d’Ovide à Tomes, décidé par Auguste', 'La mort de César', 'L’incendie de Rome', 'La conquête de la Gaule'], 0, 'Les raisons de cet exil restent débattues.'],
            ['Le poème n’a eu qu’une influence limitée sur la littérature européenne.', ['Vrai', 'Faux'], 1, 'C’est le grand réservoir de mythes de toute la culture occidentale.'],
          ],
        },
        {
          titre: 'Micromégas, Voltaire',
          lecon: {
            titre: 'Voltaire, 1752 — voir la Terre de très haut',
            cours: `## L’histoire
| Personnage | Sa taille |
| **Micromégas**, habitant d’une planète de **Sirius** | **Huit lieues** de haut ; il vit **plusieurs centaines de siècles** |
| Son compagnon **saturnien** | « Seulement » **mille toises** — secrétaire de l’Académie |
| Les humains | Des « **atomes intelligents** » |

| Étape | Ce qui se passe |
| Le bannissement | Micromégas est chassé de sa planète **pour un livre jugé hérétique** |
| Le voyage | Il explore le système solaire avec le Saturnien |
| Sur **Terre** | Ils la croient **déserte** — puis découvrent, **à la loupe**, un navire d’explorateurs revenant du **cercle polaire** |
| L’étonnement | Ces atomes **savent mesurer les astres** |
| La déception | Dès qu’on leur demande **ce qu’est l’âme**, ils **se disputent** |
| L’horreur | Ils **s’entretuent par centaines de milliers** pour **quelques arpents de boue** |
| Le cadeau | Micromégas leur laisse un **livre censé contenir la fin de toutes choses** |

> **Le livre est entièrement blanc.**

## À retenir
**Conte philosophique** fondé sur le changement d’**échelle**.

> Le procédé **rend visibles l’orgueil et la petitesse humaines** — sans un mot de sermon.

| Cible | Ce qu’il célèbre |
| La **métaphysique bavarde**, la **guerre**, l’**anthropocentrisme** | La **science expérimentale** : **Newton**, **Locke** |

> L’un des **premiers récits de science-fiction philosophique**.`,
          },
          questions: [
            ['D’où vient Micromégas ?', ['D’une planète de l’étoile Sirius', 'De Saturne', 'De la Lune', 'De Mars'], 0, 'Il mesure huit lieues et vit des centaines de siècles.'],
            ['Pourquoi a-t-il été banni de sa planète ?', ['Pour un livre jugé hérétique', 'Pour un crime', 'Pour désobéissance militaire', 'Il est parti volontairement'], 0, 'La satire de l’intolérance commence dès la première page.'],
            ['Comment les géants découvrent-ils les humains ?', ['À la loupe, sur un navire revenant du cercle polaire', 'Par un télescope', 'Par des signaux lumineux', 'Ils ne les découvrent pas'], 0, 'Ils croyaient d’abord la Terre déserte.'],
            ['Qu’est-ce qui étonne Micromégas chez les humains ?', ['Ils savent mesurer les astres, mais se disputent sur l’âme', 'Ils sont pacifiques', 'Ils vivent très longtemps', 'Ils ignorent tout de la science'], 0, 'Le savoir et la bêtise y cohabitent.'],
            ['Que contient le livre offert par Micromégas ?', ['Rien : il est entièrement blanc', 'La formule de l’immortalité', 'Un traité d’astronomie', 'Une carte du système solaire'], 0, 'La chute est un chef-d’œuvre d’ironie.'],
            ['Le conte repose sur le changement d’échelle.', ['Vrai', 'Faux'], 0, 'Le procédé rend visibles l’orgueil et la petitesse humaines.'],
          ],
        },
        {
          titre: 'Nadja, André Breton',
          lecon: {
            titre: 'Breton, 1928 — « Qui suis-je ? »',
            cours: `## L’œuvre
Récit en **trois parties**, illustré de **photographies** — rues, objets, personnes — **qui remplacent les descriptions**.

> Il s’ouvre sur une question : « **Qui suis-je ?** »

| Partie | Ce qu’elle contient |
| La première | Des faits « **de hasard objectif** » : rencontres et **coïncidences troublantes** |
| La deuxième | La rencontre, en **octobre 1926**, avec **Nadja** — « **parce qu’en russe c’est le commencement du mot espérance** » |
| La troisième | L’éloge de la **beauté convulsive** et une **adresse à une autre femme** |

| Nadja | Ce qu’elle fait |
| Pendant **dix jours** | Ils **errent dans Paris** |
| Elle | **Voit des signes partout**, dessine, **prophétise** |
| Puis | Elle **sombre** : **internée**, elle **disparaît du récit** |

## À retenir
| Ce que le livre refuse | Ce qu’il met à la place |
| Le **roman** | Pas d’intrigue construite |
| Les **descriptions** | Les **photographies** |
| L’**invention** | Un narrateur **qui refuse d’inventer** |

L’un des textes **majeurs du surréalisme** : le **hasard**, la **ville** et la **folie** y deviennent des **voies d’accès au réel**.

> Il pose aussi un **problème moral**, souvent discuté : **Breton s’éloigne quand Nadja est internée**.

> « La beauté sera convulsive ou ne sera pas. »`,
          },
          questions: [
            ['Par quelle question le livre s’ouvre-t-il ?', ['« Qui suis-je ? »', '« Où vais-je ? »', '« Qu’est-ce que le surréalisme ? »', '« Que puis-je savoir ? »'], 0, 'Le livre est une enquête sur l’identité du narrateur.'],
            ['Que remplacent les photographies dans le livre ?', ['Les descriptions', 'Les dialogues', 'Les chapitres', 'Les notes de bas de page'], 0, 'Breton refuse la description romanesque.'],
            ['Que signifie le prénom Nadja ?', ['Le commencement du mot « espérance » en russe', 'Étoile', 'Nuit', 'Liberté'], 0, 'C’est elle qui donne cette explication.'],
            ['Que devient Nadja à la fin ?', ['Elle est internée et disparaît du récit', 'Elle épouse Breton', 'Elle quitte Paris', 'Elle devient peintre'], 0, 'L’attitude de Breton à ce moment est souvent discutée.'],
            ['Quelle formule clôt le livre ?', ['« La beauté sera convulsive ou ne sera pas »', '« L’imagination reprend ses droits »', '« Changer la vie »', '« Je est un autre »'], 0, 'Elle est devenue un slogan du surréalisme.'],
            ['Nadja est un roman classique avec intrigue construite.', ['Vrai', 'Faux'], 1, 'Le livre refuse le roman : ni intrigue construite, ni descriptions, ni invention revendiquée.'],
          ],
        },
        {
          titre: 'Nana, Émile Zola',
          lecon: {
            titre: 'Zola, 1880 — la « mouche d’or »',
            cours: `## L’histoire
**Nana**, fille de **Gervaise** et de **Coupeau** (*L’Assommoir*), débute au théâtre des **Variétés** dans *La Blonde Vénus*.

> Elle **chante faux**, **ne sait pas jouer** — mais **paraît presque nue** : elle **triomphe**.

| Sa victime | Ce qu’elle en fait |
| Le comte **Muffat**, chambellan de l’Empereur | Il **se traîne à ses pieds** |
| Le banquier **Steiner** | Ruiné |
| Le jeune **Georges Hugon** | Il **se suicide** |
| **Vandeuvres** | Il **se brûle dans son écurie** après avoir **triché aux courses** |

| Le sommet | La fin |
| La journée du **Grand Prix de Paris**, où une pouliche nommée **Nana** gagne | Nana disparaît, revient **défigurée par la petite vérole**, et **meurt seule** dans une chambre du Grand Hôtel |

> Sous les fenêtres, la foule crie « **À Berlin !** » : la **guerre de 1870** commence.

## À retenir
**Neuvième volume** des *Rougon-Macquart*.

> Zola en fait une **allégorie** : la « **mouche d’or** », **née du ruisseau**, **monte et pourrit tout ce qu’elle touche** — c’est-à-dire **une société qui court elle-même à sa perte**.

Grandes **scènes collectives** — le théâtre, les courses, les soupers — et **fin symbolique d’une brutalité rare**.

> « Ce qu’elle avait sur la face, c’était la pourriture d’un empire. »`,
          },
          questions: [
            ['Qui est Nana ?', ['La fille de Gervaise et Coupeau, devenue actrice puis courtisane', 'Une aristocrate déclassée', 'Une ouvrière du textile', 'Une chanteuse de rue'], 0, 'Elle débute dans La Blonde Vénus, aux Variétés.'],
            ['Pourquoi triomphe-t-elle au théâtre ?', ['Elle paraît presque nue, bien qu’elle chante faux', 'Elle a un immense talent d’actrice', 'Elle est protégée par l’Empereur', 'Elle a écrit la pièce'], 0, 'Le succès repose sur le désir, non sur l’art.'],
            ['Quel personnage se traîne aux pieds de Nana ?', ['Le comte Muffat, chambellan de l’Empereur', 'Le banquier Steiner seul', 'Vandeuvres', 'Fauchery'], 0, 'Sa déchéance est le fil rouge du roman.'],
            ['Quelle scène constitue le sommet du roman ?', ['La journée du Grand Prix de Paris', 'La première au théâtre', 'Le souper chez Nana', 'L’enterrement final'], 0, 'Une pouliche nommée Nana y gagne la course.'],
            ['Comment Nana meurt-elle ?', ['Défigurée par la petite vérole, seule dans un hôtel', 'Assassinée', 'Ruinée en prison', 'De vieillesse'], 0, 'Sous les fenêtres, la foule crie « À Berlin ! ».'],
            ['Le roman fait de Nana une allégorie de la société du Second Empire.', ['Vrai', 'Faux'], 0, 'La « mouche d’or » née du ruisseau pourrit tout ce qu’elle touche.'],
          ],
        },
        {
          titre: 'Notre-Dame de Paris, Victor Hugo',
          lecon: {
            titre: 'Hugo, 1831 — la cathédrale comme personnage',
            cours: `## L’histoire
**Paris, 1482.**

| Personnage | Qui il est |
| **Quasimodo** | Sonneur **bossu, sourd et difforme**, recueilli enfant par l’archidiacre |
| **Claude Frollo** | L’archidiacre, **dévoré par un désir qu’il juge criminel** |
| **Esmeralda** | Jeune **bohémienne** qui danse sur le parvis avec sa chèvre **Djali** |
| **Phœbus** | Le capitaine qu’elle aime |

| Étape | Ce qui se passe |
| L’enlèvement | Frollo la **fait enlever** |
| Le crime | Il **poignarde Phœbus** et **laisse Esmeralda être accusée** |
| Le sauvetage | Condamnée, elle est **enlevée in extremis par Quasimodo**, qui la met à l’abri dans la cathédrale — **asile inviolable** |
| L’assaut | La **Cour des miracles** vient l’en délivrer : **massacre** |
| La fin | Frollo **livre Esmeralda au bourreau** ; Quasimodo le **précipite du haut des tours** — puis va **mourir près du corps** au gibet de Montfaucon |

## À retenir
Roman **historique et politique** : Hugo l’écrit **pour défendre le patrimoine médiéval menacé de démolition**.

| Le chapitre « **Ceci tuera cela** » | Ce qu’il énonce |
| Le **livre imprimé** a **remplacé la cathédrale** | Comme **livre du peuple** |

> La cathédrale y est **un personnage à part entière** — et **le roman a sauvé Notre-Dame**, **restaurée après son succès**.

> « Ceci tuera cela. »`,
          },
          questions: [
            ['En quelle année se déroule l’action ?', ['1482', '1789', '1348', '1572'], 0, 'Paris à la fin du Moyen Âge.'],
            ['Qui est Claude Frollo ?', ['L’archidiacre qui a recueilli Quasimodo et désire Esmeralda', 'Le capitaine des archers', 'Le roi des truands', 'Le père d’Esmeralda'], 0, 'Son désir refoulé déclenche toute la tragédie.'],
            ['Où Quasimodo met-il Esmeralda à l’abri ?', ['Dans la cathédrale, lieu d’asile inviolable', 'Dans la Cour des miracles', 'Au Louvre', 'Chez Gringoire'], 0, 'La Cour des miracles viendra l’en « délivrer », provoquant un massacre.'],
            ['Que signifie « Ceci tuera cela » ?', ['Le livre imprimé remplace la cathédrale comme livre du peuple', 'La foule tuera le roi', 'Le fer tuera la pierre', 'La science tuera la foi'], 0, 'C’est le chapitre théorique du roman.'],
            ['Quel effet le roman a-t-il eu sur le monument ?', ['Son succès a conduit à la restauration de Notre-Dame', 'Il a accéléré sa démolition', 'Il n’a eu aucun effet', 'Il a fait fermer la cathédrale'], 0, 'Hugo militait pour la sauvegarde du patrimoine médiéval.'],
            ['Le roman se termine par le mariage d’Esmeralda et Phœbus.', ['Vrai', 'Faux'], 1, 'Esmeralda est pendue ; Quasimodo va mourir près de son corps.'],
          ],
        },
        {
          titre: 'Odyssée, Homère',
          lecon: {
            titre: 'Homère, VIIIe siècle av. J.-C. — dix ans pour rentrer',
            cours: `## Le récit
**Vingt-quatre chants.** Dix ans après la chute de Troie, **Ulysse** n’est toujours pas rentré à **Ithaque**.

| À Ithaque | La situation |
| **Télémaque** | Il **grandit** sans son père |
| **Pénélope** | **Assiégée par des prétendants** qui **pillent le palais** |
| **Athéna** | Elle obtient des dieux **le retour d’Ulysse** |

## Les trois fils du poème
| Fil | Ce qu’il contient |
| La **Télémachie** | Le fils **part chercher des nouvelles** de son père |
| Les **récits d’Ulysse** chez les Phéaciens | Le Cyclope **Polyphème**, **Circé**, les **Sirènes**, **Charybde et Scylla**, la **descente aux Enfers**, **Calypso** |
| Le **retour** | Déguisé en **mendiant** |

| L’étape du retour | Ce qui s’y joue |
| La reconnaissance | Par son **chien Argos** et par sa **nourrice** |
| L’épreuve de l’**arc** | Lui seul peut le bander |
| Le **massacre des prétendants** | La reprise du palais |
| L’ultime épreuve | **Pénélope** l’éprouve par le **secret du lit taillé dans un olivier** |

## À retenir
Le grand poème du **retour** — *nostos* —, de la **ruse** — Ulysse est « **aux mille tours** » — et de la **reconnaissance**.

> Sa construction est **étonnamment moderne** : **récit non linéaire**, **narrateur second**, **ellipses**.

Il a nourri **Joyce** (*Ulysse*), **Giono**, **Le Clézio** et d’innombrables réécritures.

> « Je suis Ulysse, fils de Laërte. »`,
          },
          questions: [
            ['Combien de temps Ulysse met-il à rentrer après la guerre ?', ['Dix ans', 'Deux ans', 'Vingt ans', 'Un an'], 0, 'La guerre elle-même avait duré dix ans.'],
            ['Qui assiège Pénélope à Ithaque ?', ['Les prétendants qui pillent le palais', 'Les Troyens', 'Les Phéaciens', 'Les hommes de Circé'], 0, 'Elle les tient en échec par la ruse de la toile.'],
            ['Où Ulysse raconte-t-il ses aventures ?', ['Chez les Phéaciens', 'À Ithaque', 'Chez Circé', 'Aux Enfers'], 0, 'Le récit est enchâssé : Ulysse est narrateur second.'],
            ['Quelle épreuve permet à Ulysse de se faire reconnaître ?', ['L’épreuve de l’arc', 'Une course de chars', 'Un combat naval', 'Une énigme'], 0, 'Seul lui peut bander l’arc et traverser les douze haches.'],
            ['Comment Pénélope éprouve-t-elle Ulysse ?', ['Par le secret du lit taillé dans un olivier', 'Par une question sur Troie', 'Par une cicatrice', 'Par un anneau'], 0, 'La cicatrice, elle, sert à la nourrice Euryclée.'],
            ['Le récit suit un ordre strictement chronologique.', ['Vrai', 'Faux'], 1, 'Il alterne trois fils et pratique le récit enchâssé : une construction très moderne.'],
          ],
        },
        {
          titre: 'Œdipe roi, Sophocle',
          lecon: {
            titre: 'Sophocle, vers 429 av. J.-C. — l’enquête qui se retourne',
            cours: `## L’histoire
**Thèbes** est frappée par la **peste**. L’oracle exige que l’on **chasse le meurtrier de l’ancien roi Laïos**.

| Étape de l’enquête | Ce qui se passe |
| Œdipe la mène **avec énergie** | Il est roi depuis qu’il a **vaincu le Sphinx** et **épousé Jocaste**, veuve de Laïos |
| Le devin **Tirésias** | Contraint de parler, il **l’accuse** |
| La réaction d’Œdipe | Il **crie au complot de Créon** |
| Les témoignages | Un **messager de Corinthe**, un **vieux berger** |
| La révélation | Il est le **fils** de Laïos et de Jocaste : il a **tué son père à un carrefour** et **épousé sa mère** |

> Il a accompli **exactement l’oracle que ses parents avaient voulu déjouer en l’abandonnant**.

| La fin | Ce qui arrive |
| **Jocaste** | Elle **se pend** |
| **Œdipe** | Il **se crève les yeux** avec les **agrafes de sa robe** — et part **en exil** |

## À retenir
Le **modèle de la tragédie** selon **Aristote**.

| Élément | Ce qu’il fait |
| Une **action une** | Rien ne se disperse |
| La **péripétie** — le renversement | — |
| L’**anagnorisis** — la reconnaissance | **Elles coïncident** |

> C’est aussi une **enquête policière avant la lettre** : **le juge découvre qu’il est le coupable**.

**Freud** en tirera le « complexe d’Œdipe » ; le mythe a été repris par **Corneille**, **Voltaire**, **Gide**, **Cocteau** et **Pasolini**.

> « Ô lumière, que je te voie pour la dernière fois. »`,
          },
          questions: [
            ['Pourquoi Œdipe mène-t-il l’enquête ?', ['L’oracle exige que l’on chasse le meurtrier de Laïos pour arrêter la peste', 'Il veut prouver son innocence', 'Créon l’y oblige', 'Jocaste le lui demande'], 0, 'Il ignore qu’il enquête sur lui-même.'],
            ['Qui accuse Œdipe le premier ?', ['Le devin Tirésias', 'Créon', 'Jocaste', 'Le berger'], 0, 'Œdipe crie alors au complot.'],
            ['Qu’a fait Œdipe sans le savoir ?', ['Il a tué son père et épousé sa mère', 'Il a trahi Thèbes', 'Il a offensé les dieux', 'Il a volé le trône'], 0, 'L’oracle s’accomplit malgré tout ce qui fut tenté pour l’éviter.'],
            ['Comment se termine la pièce ?', ['Jocaste se pend, Œdipe se crève les yeux et part en exil', 'Œdipe est acquitté', 'La peste cesse sans autre conséquence', 'Créon est condamné'], 0, 'Il se punit lui-même de n’avoir pas vu.'],
            ['Quels termes d’Aristote la pièce illustre-t-elle ?', ['Péripétie et reconnaissance', 'Unité de ton et bienséance', 'Catharsis et chœur seulement', 'Prologue et épilogue'], 0, 'Le renversement et la reconnaissance y coïncident.'],
            ['La pièce est construite comme une enquête.', ['Vrai', 'Faux'], 0, 'Le juge y découvre qu’il est le coupable : c’est un modèle du genre.'],
          ],
        },
        {
          titre: 'On ne badine pas avec l’amour, Alfred de Musset',
          lecon: {
            titre: 'Musset, 1834 — le jeu qui tue',
            cours: `## L’histoire
**Proverbe** en **trois actes**.

| Étape | Ce qui se passe |
| Le projet | **Perdican**, revenu docteur, doit épouser sa cousine **Camille**, sortie du couvent : le **baron** l’a décidé |
| Le refus | Camille est **effrayée par les confidences amères des religieuses** sur l’**infidélité des hommes** |
| La riposte | Blessé, Perdican courtise **Rosette**, jeune paysanne **sœur de lait** de Camille |
| Le piège | Camille **cache Rosette** pour lui **faire entendre les aveux** de Perdican |
| Le retournement | Les orgueils s’affrontent ; au moment de l’aveu, **un cri** : **Rosette est morte** |

> « **Elle est morte. Adieu, Perdican !** »

## À retenir
| Autour des jeunes gens | Ce qu’elle forme |
| Une galerie **grotesque** : le baron, **maître Blazius**, **maître Bridaine**, **dame Pluche** | Un **contrepoint comique** |

> Le **mélange des registres** — comique, lyrique, tragique — est la marque du **drame romantique**.

La pièce, **écrite pour la lecture**, est devenue **l’une des plus jouées du répertoire**.

> « On est souvent trompé en amour, souvent blessé et souvent malheureux ; mais on aime. »`,
          },
          questions: [
            ['Quel genre Musset revendique-t-il pour cette pièce ?', ['Le proverbe', 'La tragédie', 'La farce', 'Le vaudeville'], 0, 'Publiée dans Un spectacle dans un fauteuil, elle était destinée à la lecture.'],
            ['Pourquoi Camille refuse-t-elle Perdican ?', ['Les religieuses lui ont fait craindre l’infidélité des hommes', 'Elle en aime un autre', 'Son père s’y oppose', 'Elle veut voyager'], 0, 'Son refus vient d’une peur apprise.'],
            ['Qui est Rosette ?', ['Une paysanne, sœur de lait de Camille', 'La sœur de Perdican', 'Une religieuse', 'La fille du baron'], 0, 'Elle est la seule à ne pas jouer — et la seule qui meurt.'],
            ['Quel piège Camille tend-elle ?', ['Elle cache Rosette pour lui faire entendre les aveux de Perdican', 'Elle écrit une fausse lettre', 'Elle fait venir un prêtre', 'Elle feint de partir'], 0, 'Le stratagème se retourne contre elle.'],
            ['Par quels mots la pièce se termine-t-elle ?', ['« Elle est morte. Adieu, Perdican ! »', '« Adieu, Camille »', '« Nous serons heureux »', '« Il est trop tard »'], 0, 'L’amour est reconnu au moment où il devient impossible.'],
            ['La pièce mêle comique, lyrique et tragique.', ['Vrai', 'Faux'], 0, 'C’est la marque du drame romantique.'],
          ],
        },
        {
          titre: 'On purge bébé, Georges Feydeau',
          lecon: {
            titre: 'Feydeau, 1910 — la scène de ménage devient un acte',
            cours: `## La pièce
**Un acte**, une **matinée**, un **salon**.

| Personnage | Ce qu’il veut |
| **Follavoine**, industriel en porcelaine | Décrocher un **énorme marché** : des **pots de chambre incassables** pour l’armée |
| **Chouilloux**, fonctionnaire | Il en décide |
| **Julie**, sa femme, **en peignoir et en pantoufles** | Que leur fils **Toto** prenne sa **purge** |

| L’engrenage | Ce qui se passe |
| La négociation d’affaires | **Constamment interrompue** par la **guerre domestique** |
| Julie | Elle **insulte Chouilloux** et évoque **devant lui** les **infidélités supposées de sa femme** |
| La catastrophe | Elle finit par **faire boire la purge… au fonctionnaire lui-même**, par méprise |
| La fin | **Le marché est perdu.** Toto, lui, **avale finalement le remède** |

## À retenir
Pièce **tardive** de Feydeau, de la série *Du mariage au divorce*.

| Ce qu’il abandonne | Ce qu’il adopte |
| Les **portes** et les **hôtels** | La **scène de ménage en huis clos** |

| Le comique naît de… | Le détail |
| Le **décalage** | Le **sublime des affaires écrasé par la trivialité d’un pot de chambre** |
| Un dialogue d’une **brutalité conjugale** | Que **Ionesco admirera** |

> La pièce est un **modèle de construction en un acte**.

> Le vaudeville y devient comédie de mœurs, presque cruelle.`,
          },
          questions: [
            ['Quel marché Follavoine espère-t-il obtenir ?', ['Des pots de chambre incassables pour l’armée', 'Des porcelaines de luxe', 'Un contrat de vaisselle d’État', 'Une commande municipale'], 0, 'Le sujet trivial écrase le sérieux des affaires.'],
            ['Qu’est-ce qui interrompt constamment la négociation ?', ['La querelle domestique autour de la purge de Toto', 'Un incendie', 'L’arrivée de créanciers', 'Une panne de courant'], 0, 'Julie entre en peignoir et en pantoufles.'],
            ['Qui finit par boire la purge ?', ['Chouilloux, le fonctionnaire, par méprise', 'Toto seulement', 'Follavoine', 'Personne'], 0, 'Le marché est perdu du même coup.'],
            ['À quelle série la pièce appartient-elle ?', ['Du mariage au divorce', 'Les Fiancés de Loches', 'Le Théâtre en liberté', 'Les Farces de province'], 0, 'Feydeau y quitte le vaudeville d’hôtel pour le huis clos conjugal.'],
            ['D’où naît le comique de la pièce ?', ['Du décalage entre le sérieux des affaires et la trivialité domestique', 'De déguisements', 'De quiproquos d’identité', 'De jeux de mots savants'], 0, 'Le dialogue conjugal y est d’une brutalité admirée par Ionesco.'],
            ['La pièce comporte plusieurs actes et de nombreux décors.', ['Vrai', 'Faux'], 1, 'Un seul acte, un seul salon, une matinée.'],
          ],
        },
        {
          titre: 'Pantagruel, François Rabelais',
          lecon: {
            titre: 'Rabelais, 1532 — le premier livre du cycle',
            cours: `## L’œuvre
Publié en **1532** sous le pseudonyme d’**Alcofribas Nasier**.

> *Pantagruel* **précède** *Gargantua* (1534) **dans l’ordre de publication** — bien qu’il raconte la vie du **fils**.

Le livre **parodie** les **romans de chevalerie** et les **almanachs populaires**.

## Le récit
| Épisode | Ce qu’il apporte |
| La **naissance** de Pantagruel | Pendant une **sécheresse** |
| Les **études** dans les universités de France | Il y rencontre l’**écolier limousin**, qui parle un **français latinisé ridicule** |
| La **lettre de Gargantua** à son fils | Le **manifeste de l’éducation humaniste** |
| La rencontre de **Panurge** | Compagnon **rusé, menteur et lâche** : il raconte comment il a **échappé aux Turcs** |
| Le procès de **Baisecul et Humevesne** | Jugé sur des **plaidoiries incompréhensibles** |
| La guerre contre les **Dipsodes** | La victoire sur le géant **Loup-Garou** |

## À retenir
> **Tout Rabelais est déjà là** : **gigantisme**, **listes vertigineuses**, obscénité, **latin de cuisine**, **parodie savante**.

| Sous le rire | Le texte |
| Le programme **humaniste** | La **lettre de Gargantua** — l’un des textes **les plus cités du XVIe siècle** |

Le livre fut **condamné par la Sorbonne**.

> « Science sans conscience n’est que ruine de l’âme. »`,
          },
          questions: [
            ['Quel livre du cycle a été publié en premier ?', ['Pantagruel, en 1532', 'Gargantua', 'Le Tiers Livre', 'Le Quart Livre'], 0, 'Gargantua, qui raconte le père, paraît deux ans plus tard.'],
            ['Qui est Panurge ?', ['Le compagnon rusé, menteur et lâche de Pantagruel', 'Le précepteur du géant', 'Un roi ennemi', 'Le frère de Gargantua'], 0, 'Il deviendra le personnage central du Tiers Livre.'],
            ['Quel texte contient le programme humaniste ?', ['La lettre de Gargantua à son fils', 'Le prologue', 'Le procès de Baisecul', 'Le chapitre des Dipsodes'], 0, '« Science sans conscience n’est que ruine de l’âme. »'],
            ['Que ridiculise l’épisode de l’écolier limousin ?', ['Un français latinisé et prétentieux', 'L’accent provincial', 'Les mauvaises universités', 'L’ignorance du peuple'], 0, 'Rabelais défend une langue vivante contre le jargon.'],
            ['Contre qui Pantagruel fait-il la guerre ?', ['Les Dipsodes et le géant Loup-Garou', 'Les Anglais', 'Picrochole', 'Les Turcs'], 0, 'La parodie épique y est constante.'],
            ['Le livre fut approuvé par les autorités religieuses.', ['Vrai', 'Faux'], 1, 'Il fut condamné par la Sorbonne, comme la plupart des livres de Rabelais.'],
          ],
        },
        {
          titre: 'Pierre et Jean, Guy de Maupassant',
          lecon: {
            titre: 'Maupassant, 1888 — un héritage qui révèle tout',
            cours: `## L’histoire
Au **Havre**, la famille **Roland** apprend qu’un ami de la famille, **Maréchal**, a **légué toute sa fortune au fils cadet, Jean** — et **rien à l’aîné, Pierre**.

> **Le père ne s’étonne de rien.**

| Étape | Ce qui se passe |
| L’enquête intérieure | **Pierre**, médecin sans clientèle, **jaloux et lucide**, se demande : **pourquoi ce legs à un seul ?** |
| Les indices | Un **portrait disparu**, des **dates**, une **phrase de servante** |
| La certitude | **Jean est le fils de Maréchal** — **leur mère a trompé son père** |
| L’aveu | Il le fait comprendre à sa mère, **qui avoue à Jean** |
| La fin | Devenu **insupportable à tous**, Pierre s’embarque comme **médecin de bord** — **la famille le regarde partir, soulagée** |

## À retenir
Roman **court**, d’une **construction parfaite** : **tout se joue dans le regard et le soupçon**, **sans événement extérieur**.

> La **préface**, célèbre, expose la théorie de Maupassant : « Le Réalisme, s’il est un artiste, cherchera **non pas à nous montrer la photographie banale de la vie**, mais à nous en donner **la vision plus complète, plus saisissante que la réalité même**. »

Et sa formule la plus citée : « **faire vrai consiste à donner l’illusion complète du vrai** ».

> « Il en avait assez de cette maison. »`,
          },
          questions: [
            ['Quel événement déclenche l’intrigue ?', ['Un héritage laissé au seul fils cadet', 'Un naufrage', 'La mort du père', 'Un mariage annoncé'], 0, 'Maréchal lègue toute sa fortune à Jean.'],
            ['Que découvre Pierre par déduction ?', ['Que Jean est le fils de Maréchal', 'Que son père est ruiné', 'Que Jean est adopté', 'Que Maréchal était son oncle'], 0, 'Un portrait disparu et des dates suffisent.'],
            ['Comment Pierre agit-il après sa découverte ?', ['Il la fait comprendre à sa mère, puis s’embarque comme médecin de bord', 'Il porte plainte', 'Il tue Jean en duel', 'Il se tait définitivement'], 0, 'Sa famille le regarde partir avec soulagement.'],
            ['Quelle est la particularité de la construction du roman ?', ['Tout se joue dans le regard et le soupçon, sans événement extérieur', 'Il alterne plusieurs narrateurs', 'Il est écrit en lettres', 'Il couvre trente ans'], 0, 'C’est un modèle de roman court.'],
            ['Que contient la préface du roman ?', ['La théorie de Maupassant sur le roman et l’illusion du vrai', 'Une dédicace à Flaubert', 'Un résumé de l’intrigue', 'Une réponse à la critique'], 0, '« Faire vrai consiste à donner l’illusion complète du vrai. »'],
            ['Le père Roland comprend la situation en même temps que Pierre.', ['Vrai', 'Faux'], 1, 'Il ne s’étonne de rien : son aveuglement est un ressort du roman.'],
          ],
        },
        {
          titre: 'Poèmes antiques, Charles Leconte de Lisle',
          lecon: {
            titre: 'Leconte de Lisle, 1852 — le premier manifeste parnassien',
            cours: `## Le recueil
Publié en **1852**, il impose **Leconte de Lisle** comme **chef de file** de ce qu’on appellera le **Parnasse**.

| La préface | Ce qu’elle condamne, ce qu’elle réclame |
| Elle **condamne** | Le **lyrisme personnel** des romantiques, « l’**étalage des plaies du cœur** » |
| Elle **réclame** | Une poésie **impersonnelle**, **savante**, tournée vers l’**Antiquité** et les **mythes** |

## Le contenu
| Source | Les poèmes |
| La **Grèce** | « Hélène », « Niobé », « Khirôn » |
| Les hymnes **védiques** et la mythologie **indienne** | « Bhagavat », « La Vision de Brahma » |
| Son île natale, **La Réunion** | Des poèmes **créoles** |

> Leconte de Lisle est l’un des **premiers en France** à puiser dans les **textes sanskrits**, traduits au début du siècle.

## À retenir
Le Parnasse tient en **trois mots**.

| Mot d’ordre | Ce qu’il implique |
| **Impersonnalité** | Le « je » s’efface |
| **Érudition** | Le savoir nourrit le poème |
| **Culte de la forme** | La poésie comme **sculpture** |

Recueils suivants : *Poèmes barbares* (**1862**), *Poèmes tragiques* (**1884**).

> Cette **rigueur**, longtemps admirée, sera **contestée par les symbolistes**, qui lui reprocheront sa **froideur**.

> « Le siècle est industriel, vous devez être utile… Je n’ai rien à répondre. »`,
          },
          questions: [
            ['Quel mouvement ce recueil inaugure-t-il ?', ['Le Parnasse', 'Le symbolisme', 'Le romantisme', 'Le naturalisme'], 0, 'Leconte de Lisle en devient le chef de file.'],
            ['Que condamne la préface ?', ['Le lyrisme personnel et « l’étalage des plaies du cœur »', 'La poésie savante', 'L’Antiquité', 'La rime riche'], 0, 'Elle réclame une poésie impersonnelle.'],
            ['Quelles sources d’inspiration le recueil mobilise-t-il ?', ['La Grèce antique et la mythologie indienne', 'Le Moyen Âge chrétien', 'La Renaissance italienne', 'Le folklore breton'], 0, 'Leconte de Lisle puise dans les textes sanskrits récemment traduits.'],
            ['De quelle île l’auteur est-il originaire ?', ['La Réunion', 'La Martinique', 'La Corse', 'Madagascar'], 0, 'Des poèmes créoles s’y rattachent.'],
            ['Quels sont les trois principes du Parnasse ?', ['Impersonnalité, érudition, culte de la forme', 'Sincérité, spontanéité, engagement', 'Rêve, hasard, inconscient', 'Observation, document, hérédité'], 0, 'La poésie doit être un art objectif, comme la sculpture.'],
            ['Le Parnasse a été prolongé sans contestation par les symbolistes.', ['Vrai', 'Faux'], 1, 'Ils lui reprocheront précisément sa froideur et son impersonnalité.'],
          ],
        },
        {
          titre: 'Poèmes saturniens, Paul Verlaine',
          lecon: {
            titre: 'Verlaine, 1866 — le premier recueil, entre Parnasse et musique',
            cours: `## Le recueil
**Premier livre** de **Verlaine**, publié à **vingt-deux ans**, **à compte d’auteur**.

> Le titre vient de **Saturne**, **planète des mélancoliques** : les « **saturniens** » sont **nés sous une mauvaise étoile**.

| Section | Ce qu’elle porte |
| *Melancholia* | Le cœur |
| *Eaux-fortes* | Les tableaux |
| *Paysages tristes* | Le crépuscule |
| *Caprices* | Les pièces brèves |

Le tout **encadré d’un prologue et d’un épilogue encore très parnassiens**.

## Les poèmes
| Poème | Son vers célèbre |
| « **Mon rêve familier** » | « Je fais souvent ce rêve étrange et pénétrant / D’une femme inconnue, **et que j’aime, et qui m’aime** » |
| « **Chanson d’automne** » | « Les sanglots longs / Des violons / De l’automne » |
| « Soleils couchants », « Nevermore », « Femme et chatte » | La tonalité du recueil |

## Ce qui s’invente
| Procédé | Son effet |
| Les **vers impairs** | Le déséquilibre voulu |
| Les **rythmes brisés**, les **répétitions** | La **musicalité avant tout** |
| Les **sonorités douces**, les **sujets flous** | Il cherche moins à **décrire** qu’à **suggérer un état** |

> Ce qu’il théorisera plus tard dans « Art poétique » : « **De la musique avant toute chose, / Et pour cela préfère l’Impair.** »

Il ouvre ainsi la voie au **symbolisme** — **tout en gardant l’héritage parnassien** de son époque.

> « Les sanglots longs des violons de l’automne / Blessent mon cœur d’une langueur monotone. »`,
          },
          questions: [
            ['D’où vient le titre du recueil ?', ['De Saturne, planète des mélancoliques', 'D’un poème de Baudelaire', 'D’un lieu-dit', 'D’un mot inventé'], 0, 'Les « saturniens » sont nés sous une mauvaise étoile.'],
            ['Quel poème commence par « Les sanglots longs des violons » ?', ['Chanson d’automne', 'Mon rêve familier', 'Nevermore', 'Soleils couchants'], 0, 'Il est devenu l’un des poèmes les plus connus de la langue.'],
            ['Quelle qualité Verlaine privilégie-t-il ?', ['La musicalité', 'L’érudition', 'La précision descriptive', 'L’engagement'], 0, '« De la musique avant toute chose », dira son Art poétique.'],
            ['Quel type de vers Verlaine affectionne-t-il ?', ['Le vers impair', 'L’alexandrin exclusivement', 'Le vers libre', 'Le décasyllabe seul'], 0, 'Il brise ainsi le rythme attendu.'],
            ['Quel mouvement ce recueil annonce-t-il ?', ['Le symbolisme', 'Le naturalisme', 'Le surréalisme', 'Le classicisme'], 0, 'Suggérer plutôt que décrire.'],
            ['Verlaine avait plus de quarante ans lors de cette publication.', ['Vrai', 'Faux'], 1, 'Il avait vingt-deux ans, et publiait à compte d’auteur.'],
          ],
        },
        {
          titre: 'Poésies, Stéphane Mallarmé',
          lecon: {
            titre: 'Mallarmé — la poésie portée à l’absolu',
            cours: `## L’œuvre
Un ensemble **mince** — quelques dizaines de poèmes, rassemblés en **1887**, puis dans l’édition **posthume de 1899** — **qui a pourtant changé la poésie française**.

| Poème | Ce qu’on en retient |
| « **Brise marine** » | « La chair est triste, hélas ! **et j’ai lu tous les livres** » |
| « **L’Azur** » | L’idéal qui écrase |
| « **Le vierge, le vivace et le bel aujourd’hui** » | Le **sonnet du cygne prisonnier de la glace** |
| « Le Tombeau d’Edgar Poe », « Apparition », « Sainte » | Les pièces majeures |
| *L’Après-midi d’un faune* | L’églogue qui inspirera **Debussy** |

## La poétique
> « **Peindre non la chose, mais l’effet qu’elle produit.** »

| Principe | Sa conséquence |
| Le poème **suggère** au lieu de décrire | Le **mot compte moins pour ce qu’il désigne que pour ce qu’il fait résonner** |
| D’où | La **syntaxe déplacée**, les **ellipses**, les **inversions** — la **difficulté assumée** |

| L’ambition | Ce qu’elle a produit |
| Un **Livre** absolu qui contiendrait **tout** | Il **n’écrira jamais que des fragments** |
| Le *Coup de dés* (**1897**) | Il **éclate le texte sur la page** et **invente la mise en page comme moyen poétique** |

## À retenir
Chef de file du **symbolisme**, il tient ses « **mardis** » **rue de Rome** — où passent **Valéry**, **Gide**, **Claudel**, **Verlaine**.

> Son influence sur **toute la poésie du XXe siècle** est **immense**.

> « Un coup de dés jamais n’abolira le hasard. »`,
          },
          questions: [
            ['Quelle est la formule qui résume la poétique de Mallarmé ?', ['« Peindre non la chose, mais l’effet qu’elle produit »', '« De la musique avant toute chose »', '« Il faut être absolument moderne »', '« La beauté sera convulsive »'], 0, 'Le poème suggère au lieu de décrire.'],
            ['Quel poème commence par « La chair est triste, hélas ! » ?', ['Brise marine', 'L’Azur', 'Apparition', 'Sainte'], 0, '« … et j’ai lu tous les livres. »'],
            ['Quelle œuvre musicale s’inspire de son églogue ?', ['Le Prélude à l’après-midi d’un faune de Debussy', 'Le Sacre du printemps', 'Pelléas et Mélisande', 'La Mer'], 0, 'Créé en 1894.'],
            ['Qu’est-ce que le « Livre » chez Mallarmé ?', ['Un ouvrage absolu qui contiendrait tout, jamais réalisé', 'Son unique recueil publié', 'Un journal intime', 'Un traité de poétique'], 0, 'Il n’en a laissé que des notes et des fragments.'],
            ['Quelle innovation apporte Un coup de dés ?', ['La mise en page devient un moyen poétique', 'La suppression des rimes', 'L’usage du vers libre', 'L’écriture automatique'], 0, 'Le texte y éclate sur la double page.'],
            ['Mallarmé a laissé une œuvre poétique très abondante.', ['Vrai', 'Faux'], 1, 'Son œuvre est mince, et son influence immense.'],
          ],
        },
        {
          titre: 'Polyeucte, Pierre Corneille',
          lecon: {
            titre: 'Corneille, 1643 — la tragédie chrétienne',
            cours: `## L’histoire
En **Arménie**, sous l’empereur **Décie**.

| Personnage | Sa position |
| **Polyeucte** | Seigneur arménien, **récemment marié à Pauline** |
| **Pauline** | Fille du gouverneur **Félix** |
| **Néarque** | L’ami qui conseille le **baptême secret** |
| **Sévère** | Le chevalier que Pauline avait aimé à Rome, **cru mort** — il **reparaît victorieux**, favori de l’empereur |

| Étape | Ce qui se passe |
| Le baptême | Polyeucte se fait **baptiser en secret** |
| La fidélité | Pauline **reste fidèle à son mari par devoir** |
| L’éclat | Exalté par sa conversion, il va **briser les idoles en plein sacrifice public** |
| Le refus | Condamné, il **refuse d’abjurer** — et **cède même sa femme à Sévère** |
| La fin | Sa mort **convertit Pauline**, puis **Félix** ; **Sévère**, magnanime, **promet de protéger les chrétiens** |

## À retenir
La grande **tragédie chrétienne** du théâtre français.

> Corneille y **transpose son héroïsme habituel** — le choix qui grandit — **dans l’ordre de la grâce** : **Polyeucte ne renonce pas à Pauline par indifférence, mais parce qu’il a trouvé plus grand**.

La pièce pose la question, **très discutée au XVIIe siècle**, du rapport entre la **volonté** et la **grâce divine**.

> « Je vous aime, beaucoup moins que mon Dieu, mais bien plus que moi-même. »`,
          },
          questions: [
            ['Que fait Polyeucte après son baptême ?', ['Il brise les idoles en plein sacrifice public', 'Il fuit la ville', 'Il convertit Pauline', 'Il renonce à son titre'], 0, 'Le geste le condamne à mort.'],
            ['Qui est Sévère ?', ['Le chevalier romain que Pauline avait aimé et croyait mort', 'Le père de Pauline', 'L’ami chrétien de Polyeucte', 'L’empereur'], 0, 'Il reparaît victorieux et favori de l’empereur.'],
            ['Que fait Polyeucte de son épouse avant de mourir ?', ['Il la cède à Sévère', 'Il l’emmène avec lui', 'Il la répudie par colère', 'Il lui demande d’abjurer'], 0, 'Le geste, très commenté, marque le renoncement au monde.'],
            ['Quel effet produit son martyre ?', ['La conversion de Pauline puis de Félix', 'Une révolte populaire', 'La fin des persécutions dans tout l’Empire', 'Rien du tout'], 0, 'Sévère promet de protéger les chrétiens.'],
            ['Quel débat théologique la pièce touche-t-elle ?', ['Le rapport entre la volonté humaine et la grâce divine', 'La querelle des images', 'Le célibat des prêtres', 'La prédestination calviniste seule'], 0, 'Question très vive dans la France du XVIIe siècle.'],
            ['Polyeucte quitte Pauline par indifférence.', ['Vrai', 'Faux'], 1, '« Je vous aime… mais bien plus que moi-même » : il a trouvé plus grand, non moins.'],
          ],
        },
        {
          titre: 'Pour un oui ou pour un non, Nathalie Sarraute',
          lecon: {
            titre: 'Sarraute, 1982 — une amitié détruite par un ton',
            cours: `## La pièce
Deux personnages **sans nom** : **H1** et **H2**.

| Étape | Ce qui se passe |
| La question | H1 vient demander à H2 **pourquoi il ne le voit plus** |
| La réponse | Elle **tarde** — puis vient, **dérisoire** : un jour, H1 lui a dit « **C’est bien… ça** » |
| Le détail | Avec une **suspension** dans la voix, un accent de **condescendance** |
| Le travail de la pièce | **Faire exister ce presque-rien** : rejouer la scène, la **contester**, appeler des **témoins imaginaires** |
| Le fond | On invoque la vie « **réussie** » de l’un et la vie « **ratée** » de l’autre |
| La fin | **La rupture est consommée sans qu’aucun fait ne l’explique** |

## Les tropismes
Sarraute appelle **tropismes** — mot emprunté à la **biologie** — les **mouvements intérieurs infimes** — attraction, recul, méfiance — **qui précèdent la parole** et **que la conversation polie recouvre**.

> Son théâtre **les fait remonter** : **sous la banalité des mots, une lutte réelle**.

## À retenir
| Ce qu’il n’y a pas | Ce qu’il y a |
| Ni **intrigue**, ni **décor**, ni **psychologie classique** | Une **pression qui monte** |

Le texte avance par **reprises**, **répétitions**, phrases **inachevées**, points de suspension.

> **Ce sont les silences qui portent le sens.** La pièce démontre la **violence du langage ordinaire** : **une intonation suffit à classer quelqu’un**.

> « C’est bien… ça. »`,
          },
          questions: [
            ['Combien de personnages principaux la pièce compte-t-elle ?', ['Deux, H1 et H2', 'Trois', 'Quatre', 'Un seul'], 0, 'Des voisins interviennent brièvement.'],
            ['Quelle phrase déclenche la rupture ?', ['« C’est bien… ça »', '« Tu as changé »', '« Je ne t’aime plus »', '« Tu as réussi »'], 0, 'Ce n’est pas la phrase, c’est la suspension et le ton.'],
            ['Qu’appelle-t-on tropismes chez Sarraute ?', ['Les mouvements intérieurs infimes qui précèdent la parole', 'Les didascalies', 'Les répliques brèves', 'Les silences notés'], 0, 'Le mot vient de la biologie.'],
            ['Quelle blessure la dispute révèle-t-elle ?', ['La condescendance et l’écart social', 'Une trahison amoureuse', 'Un conflit d’héritage', 'Un mensonge ancien'], 0, 'La vie « réussie » de l’un contre la vie « ratée » de l’autre.'],
            ['Qu’est-ce qui porte le sens dans le texte ?', ['Les silences et les phrases inachevées', 'Les longues tirades', 'Les didascalies détaillées', 'Le décor'], 0, 'Le comédien y travaille le souffle autant que la parole.'],
            ['La pièce se termine par une réconciliation.', ['Vrai', 'Faux'], 1, 'La rupture est consommée, sans qu’aucun fait ne l’explique.'],
          ],
        },
        {
          titre: 'Préface de Cromwell, Victor Hugo',
          lecon: {
            titre: 'Hugo, 1827 — le manifeste du drame romantique',
            cours: `## Le texte
Préface d’une pièce **injouable** — *Cromwell*, **plus de six mille vers**.

> Elle est devenue le **manifeste** de la génération romantique — **bien plus lue que la pièce qu’elle précède**.

## Les trois âges de la poésie
| Âge | Son genre |
| Les **temps primitifs** | L’**ode** — le lyrique |
| L’**Antiquité** | L’**épopée** |
| Les **temps modernes**, avec le christianisme | Le **drame** |

## Le sublime et le grotesque
Le christianisme a révélé la **dualité** de l’homme : **corps et âme**, **bête et ange**.

| Ce que l’art moderne doit unir | Ce que le grotesque n’est pas |
| Le **sublime** et le **grotesque** | Le **laid gratuit** |

> Le grotesque est **ce qui, par contraste, fait ressortir le beau** : **Quasimodo**, **Falstaff**, **Triboulet**.

## Ce qu’il faut abolir
| Règle abolie | Nuance |
| Les unités de **temps** et de **lieu** | Hugo **conserve l’unité d’action** |
| La **séparation des genres** | — |
| La **hiérarchie des styles** | L’interdiction du **mot propre** tombe |

> « **Tout ce qui est dans la nature est dans l’art.** »

## À retenir
Le texte **prépare** *Hernani* (**1830**) et sa **bataille**.

> Il ne fonde pas seulement une **esthétique théâtrale** : il **justifie tout le romantisme français**, **jusque dans le roman** — *Notre-Dame de Paris*, *Les Misérables*.

> « Le drame est la poésie complète. »`,
          },
          questions: [
            ['Que préface ce texte ?', ['Cromwell, une pièce de plus de six mille vers, injouable', 'Hernani', 'Ruy Blas', 'Les Contemplations'], 0, 'La préface est bien plus lue que la pièce.'],
            ['Quels sont les trois âges de la poésie selon Hugo ?', ['L’ode, l’épopée, le drame', 'La tragédie, la comédie, la farce', 'Le classique, le baroque, le moderne', 'L’épique, le lyrique, le didactique'], 0, 'Le drame correspond aux temps modernes et au christianisme.'],
            ['Que doit unir l’art moderne ?', ['Le sublime et le grotesque', 'Le vrai et le beau', 'Le rire et les larmes seulement', 'Le vers et la prose'], 0, 'Le grotesque fait ressortir le beau par contraste.'],
            ['Quelles règles Hugo veut-il abolir ?', ['Les unités de temps et de lieu, la séparation des genres', 'L’unité d’action', 'L’usage du vers', 'La division en actes'], 0, 'Il conserve en revanche l’unité d’action.'],
            ['Quelle pièce le manifeste prépare-t-il ?', ['Hernani, créée en 1830', 'Lorenzaccio', 'Ruy Blas', 'Les Burgraves'], 0, 'Et la bataille qui l’accompagne.'],
            ['La préface ne concerne que le théâtre.', ['Vrai', 'Faux'], 1, 'Elle justifie tout le romantisme français, roman compris.'],
          ],
        },
        {
          titre: 'Premières poésies, Alfred de Musset',
          lecon: {
            titre: 'Musset, 1829-1835 — l’enfant terrible du romantisme',
            cours: `## Le recueil
Il regroupe les poèmes de jeunesse de Musset, de **1829 à 1835**.

| Œuvre | Le détail |
| Les *Contes d’Espagne et d’Italie* | Publiés à **dix-neuf ans** |
| *Namouna*, *Rolla*, *La Coupe et les Lèvres* | Les grands poèmes narratifs |
| « **Ballade à la lune** » | La comparaison de la lune à **un point sur un i** **fit scandale et rire** |

## Le ton
Musset est romantique — **et insolent**.

| Ce qu’il fait | Son effet |
| Il **joue avec les codes** du mouvement | Le romantisme **se regarde** |
| Il multiplie les **digressions** et **s’adresse au lecteur** | La complicité |
| Il **mêle passion et ironie** | Rien n’est jamais tout à fait sérieux |

> Il refuse aussi bien la **solennité de Hugo** que le **militantisme littéraire** : « Je hais comme la mort l’état de plagiaire ; / **Mon verre n’est pas grand, mais je bois dans mon verre.** »

## À retenir
Les *Premières poésies* **précèdent** les grandes *Nuits* (**1835-1837**), écrites **après la rupture avec George Sand** — **où le lyrisme devient grave**.

> Elles montrent un poète **très jeune**, **virtuose**, qui **prend le romantisme au sérieux tout en s’en moquant**. Position **rare** — et qui explique sa **popularité durable auprès des lycéens**.

> « Mon verre n’est pas grand, mais je bois dans mon verre. »`,
          },
          questions: [
            ['À quel âge Musset publie-t-il ses premiers poèmes ?', ['Dix-neuf ans', 'Trente ans', 'Vingt-cinq ans', 'Quinze ans'], 0, 'Les Contes d’Espagne et d’Italie paraissent en 1829.'],
            ['Quel poème fit scandale par sa comparaison de la lune ?', ['Ballade à la lune', 'Rolla', 'Namouna', 'La Nuit de mai'], 0, 'La lune y est comparée au point sur un i.'],
            ['Quelle attitude Musset adopte-t-il face au romantisme ?', ['Il le prend au sérieux tout en s’en moquant', 'Il le rejette totalement', 'Il le défend sans nuance', 'Il l’ignore'], 0, 'Digressions, adresses au lecteur, ironie mêlée à la passion.'],
            ['Quelle formule résume son refus de l’imitation ?', ['« Mon verre n’est pas grand, mais je bois dans mon verre »', '« Je mis un bonnet rouge au vieux dictionnaire »', '« Il faut être absolument moderne »', '« Ô temps, suspends ton vol »'], 0, 'Elle est devenue proverbiale.'],
            ['Quelle œuvre suit ces Premières poésies ?', ['Les Nuits, écrites après la rupture avec George Sand', 'Les Contemplations', 'Les Fleurs du mal', 'Les Destinées'], 0, 'Le lyrisme y devient grave.'],
            ['Musset partage la solennité de Hugo.', ['Vrai', 'Faux'], 1, 'Il s’en démarque nettement, par l’ironie et la légèreté affichée.'],
          ],
        },
        {
          titre: 'Racine et Shakespeare, Stendhal',
          lecon: {
            titre: 'Stendhal, 1823-1825 — le premier manifeste romantique français',
            cours: `## Le texte
**Deux brochures polémiques**, publiées en **1823** et **1825** — **avant même** la *Préface de Cromwell*.

> Stendhal y prend parti dans la querelle entre **classiques** et **romantiques**, à un moment où une **troupe anglaise jouant Shakespeare à Paris était huée**.

## La thèse
Le **romanticisme** — Stendhal écrit ainsi — n’est **ni une école ni une doctrine**.

> C’est « l’art de présenter aux peuples les œuvres littéraires qui, **dans l’état actuel de leurs habitudes et de leurs croyances**, sont susceptibles de leur donner **le plus de plaisir possible** ».

| Le **romanticisme** | Le **classicisme** |
| Le plaisir des **contemporains** | Le plaisir qui plaisait à leurs **arrière-grands-pères** |

> Autrement dit : **Racine était romantique en son temps** — **le suivre aujourd’hui à la lettre, c’est être classique**.

## Les conséquences pratiques
| Recommandation | Le détail |
| Abandonner les **unités** | Elles n’ajoutent rien au plaisir |
| Écrire les tragédies **en prose** | Le vers éloigne |
| Prendre les sujets dans l’**histoire nationale récente** | Le spectateur s’y reconnaît |
| **Imiter Shakespeare** | **Plutôt que le copier** |

## À retenir
Un texte **vif, drôle, argumentatif**, qui pose le principe de la **relativité historique du goût** — **idée neuve et décisive**.

> Il **annonce toute la bataille romantique** et **éclaire la poétique des romans de Stendhal**.

> « Le romanticisme est l’art de présenter aux peuples ce qui, aujourd’hui, peut leur plaire. »`,
          },
          questions: [
            ['Quand ces brochures ont-elles été publiées ?', ['En 1823 et 1825, avant la Préface de Cromwell', 'En 1830', 'En 1840', 'En 1810'], 0, 'Stendhal devance donc Hugo.'],
            ['Comment Stendhal définit-il le romantisme ?', ['L’art de donner aux contemporains le plus de plaisir possible', 'Une école littéraire allemande', 'Le culte du Moyen Âge', 'Le refus de toute règle'], 0, 'Le classicisme donne le plaisir des arrière-grands-pères.'],
            ['Quelle conséquence en tire-t-il pour Racine ?', ['Racine était romantique en son temps', 'Racine doit être imité à la lettre', 'Racine est illisible', 'Racine était classique par nature'], 0, 'La relativité du goût est le cœur de sa thèse.'],
            ['Quelles réformes propose-t-il pour la tragédie ?', ['Abandonner les unités, écrire en prose, prendre des sujets nationaux', 'Revenir au grec', 'Supprimer les actes', 'Écrire pour la lecture seule'], 0, 'Il propose d’imiter Shakespeare sans le copier.'],
            ['Quel événement parisien nourrit la polémique ?', ['Une troupe anglaise jouant Shakespeare, huée par le public', 'La création d’Hernani', 'La censure d’une pièce de Hugo', 'La mort de Talma'], 0, 'La querelle était donc très concrète.'],
            ['Le texte défend l’idée d’un beau éternel et universel.', ['Vrai', 'Faux'], 1, 'Il pose au contraire la relativité historique du goût.'],
          ],
        },
        {
          titre: 'Réflexions ou sentences et maximes morales, François de la Rochefoucauld',
          lecon: {
            titre: 'La Rochefoucauld, 1665 — l’amour-propre démasqué',
            cours: `## L’œuvre
Environ **cinq cents maximes**, publiées en **1665** et **retravaillées jusqu’en 1678**.

| La forme | Son origine |
| **Brève, ciselée**, souvent construite sur une **antithèse** ou une **chute** | Les **jeux de salon** de **Madame de Sablé**, où l’on s’exerçait à formuler des sentences |

## La thèse
Derrière **chaque vertu apparente** se cache l’**amour-propre** : l’amour de soi, la **vanité** ou l’**intérêt**.

> « **Nos vertus ne sont, le plus souvent, que des vices déguisés.** »

| La vertu apparente | Ce qu’elle cache |
| La **générosité** | L’envie d’**être admiré** |
| La **clémence** | La **peur** |
| La **fidélité** | La **paresse** ou l’**habitude** |

> Même la vertu la plus haute est suspecte : « L’**amour-propre** est le plus grand de tous les **flatteurs**. »

## À retenir
La Rochefoucauld est un **moraliste** au sens classique : **il ne prêche pas, il observe et démonte**.

| Sa position | Ce qu’elle explique |
| Ancien **frondeur**, **blessé**, **écarté du pouvoir** | Il écrit du point de vue d’un homme **qui a vu la cour de près** |

> Son **pessimisme**, souvent rapproché du **jansénisme**, a nourri **Nietzsche** et **Freud**.

> « Nous avons tous assez de force pour supporter les maux d’autrui. »`,
          },
          questions: [
            ['Combien de maximes le recueil contient-il environ ?', ['Cinq cents', 'Cinquante', 'Deux mille', 'Cent'], 0, 'Retravaillées de 1665 à 1678.'],
            ['Quelle est la thèse centrale du livre ?', ['Nos vertus ne sont souvent que des vices déguisés', 'La vertu est naturelle à l’homme', 'La raison gouverne les passions', 'Le bonheur est accessible à tous'], 0, 'L’amour-propre se cache derrière chaque conduite.'],
            ['Où est née la pratique de la maxime chez La Rochefoucauld ?', ['Dans les jeux de salon de Madame de Sablé', 'À l’Académie française', 'À la cour du roi', 'Dans un monastère'], 0, 'On s’y exerçait à formuler des sentences.'],
            ['Quelle est la forme typique d’une maxime ?', ['Brève, souvent construite sur une antithèse ou une chute', 'Longue et démonstrative', 'Dialoguée', 'Versifiée'], 0, 'La concision est la condition de l’effet.'],
            ['À quel courant religieux son pessimisme est-il rapproché ?', ['Le jansénisme', 'Le protestantisme', 'Le quiétisme', 'Le gallicanisme'], 0, 'La grâce y manque, et l’homme est livré à son amour-propre.'],
            ['La Rochefoucauld prêche une morale édifiante.', ['Vrai', 'Faux'], 1, 'Il observe et démonte, sans prêcher : c’est un moraliste, non un moralisateur.'],
          ],
        },
        {
          titre: 'Rhétorique, Aristote',
          lecon: {
            titre: 'Aristote, IVe siècle av. J.-C. — la théorie de la persuasion',
            cours: `## L’œuvre
**Trois livres**, où **Aristote** définit la rhétorique comme « la **faculté de découvrir, pour chaque question, ce qui est propre à persuader** ».

> Ce n’est **ni un art du mensonge ni un simple ornement** : c’est une **technique**, **neutre en soi**, dont l’usage peut être **bon ou mauvais**.

## Les trois moyens de persuasion
| Moyen | Ce qu’il engage |
| L’**ethos** | Le **caractère que l’orateur donne à voir de lui-même** : honnêteté, compétence, bienveillance |
| Le **pathos** | Les **émotions** qu’il suscite : crainte, pitié, colère |
| Le **logos** | Le **raisonnement** : l’**enthymème** — syllogisme abrégé — et l’**exemple** |

## Les trois genres oratoires
| Genre | Ce qu’il fait | Son temps |
| **Judiciaire** | Accuser ou défendre | Le **passé** |
| **Délibératif** | Conseiller | L’**avenir** |
| **Épidictique** | Louer ou blâmer | Le **présent** |

## Les cinq parties du travail de l’orateur
**Invention** · **Disposition** · **Élocution** · **Mémoire** · **Action**

## À retenir
> Le vocabulaire d’Aristote **structure encore aujourd’hui** l’analyse des textes argumentatifs, en français comme en philosophie.

Dès qu’on demande « **quels sont les procédés de persuasion ?** », **c’est à cette grille que l’on répond**.

> Persuader n’est pas prouver : c’est rendre une thèse acceptable pour un auditoire donné.`,
          },
          questions: [
            ['Comment Aristote définit-il la rhétorique ?', ['La faculté de découvrir ce qui est propre à persuader', 'L’art de mentir avec élégance', 'La science du beau langage', 'L’étude des figures de style'], 0, 'C’est une technique neutre, dont l’usage peut être bon ou mauvais.'],
            ['Quels sont les trois moyens de persuasion ?', ['Ethos, pathos, logos', 'Invention, disposition, élocution', 'Judiciaire, délibératif, épidictique', 'Thèse, antithèse, synthèse'], 0, 'Le caractère, les émotions et le raisonnement.'],
            ['Qu’est-ce que l’ethos ?', ['L’image que l’orateur donne de lui-même', 'L’émotion suscitée', 'Le raisonnement employé', 'Le style de la période'], 0, 'Honnêteté, compétence, bienveillance.'],
            ['Quel genre oratoire porte sur l’avenir ?', ['Le délibératif', 'Le judiciaire', 'L’épidictique', 'Le narratif'], 0, 'Il s’agit de conseiller ou de déconseiller.'],
            ['Qu’est-ce qu’un enthymème ?', ['Un syllogisme abrégé, dont une prémisse est sous-entendue', 'Une figure de style', 'Un exemple historique', 'Une conclusion sans preuve'], 0, 'C’est la forme courante du raisonnement dans le discours.'],
            ['Ce vocabulaire est encore utilisé pour analyser les textes argumentatifs.', ['Vrai', 'Faux'], 0, 'Ethos, pathos et logos structurent toujours l’étude de l’argumentation.'],
          ],
        },
        {
          titre: 'Rhinocéros, Eugène Ionesco',
          lecon: {
            titre: 'Ionesco, 1959 — tout le monde devient rhinocéros',
            cours: `## La pièce
**Trois actes.** Dans une petite ville de province, un **rhinocéros** traverse la place un dimanche. **Puis un deuxième.** Puis on découvre que **les habitants se métamorphosent eux-mêmes**.

| Le prétexte invoqué | Par qui |
| La **logique** | Le **Logicien** |
| La **mode**, l’**adaptation** | Les habitants |
| Le **courage**, la « **force de la nature** » | Ceux qui cèdent |

| Personnage | Ce qu’il devient |
| **Jean**, l’ami raisonneur | Il **se transforme sous les yeux du spectateur**, dans une scène célèbre où il **défend peu à peu la rhinocérite** |
| **Daisy**, la fiancée | Elle **finit par céder** |
| **Bérenger** | Employé **médiocre, buveur, mal habillé** : il **résiste** — **non par héroïsme, mais parce qu’il ne peut pas** |

> Resté seul, il **tente un instant de se transformer**, **échoue** — et conclut : « **Je ne capitule pas !** »

## À retenir
**Allégorie** des **totalitarismes**.

> Ionesco, qui a vu la **montée du fascisme roumain** dans les années 1930, montre comment une idéologie devient **contagieuse par conformisme** — et comment **le langage se déforme avant les corps**.

| Le héros | Ce qui le sauve |
| Un **antihéros** | **Sa faiblesse même** |

> « Je suis le dernier homme, je le resterai jusqu’au bout ! »`,
          },
          questions: [
            ['Que devient la population de la ville ?', ['Elle se métamorphose en rhinocéros', 'Elle fuit la ville', 'Elle se révolte', 'Elle tombe malade'], 0, 'Chacun trouve une bonne raison de se transformer.'],
            ['Quel personnage se transforme sous les yeux du spectateur ?', ['Jean', 'Daisy', 'Bérenger', 'Le Logicien'], 0, 'Il défend peu à peu la rhinocérite au cours de la scène.'],
            ['Pourquoi Bérenger résiste-t-il ?', ['Parce qu’il ne peut pas se transformer, non par héroïsme', 'Par courage politique', 'Par conviction religieuse', 'Parce qu’il est protégé'], 0, 'Sa faiblesse même le sauve.'],
            ['Que devient Daisy ?', ['Elle cède et se transforme à son tour', 'Elle reste avec Bérenger', 'Elle quitte la ville', 'Elle disparaît sans explication'], 0, 'Bérenger reste seul.'],
            ['De quoi la pièce est-elle l’allégorie ?', ['Des totalitarismes et du conformisme idéologique', 'De l’épidémie', 'De la guerre coloniale', 'De la crise économique'], 0, 'Ionesco avait vu la montée du fascisme roumain.'],
            ['Bérenger finit par se transformer.', ['Vrai', 'Faux'], 1, 'Il essaie, échoue, et conclut : « Je ne capitule pas ! »'],
          ],
        },
        {
          titre: 'Romances sans paroles, Paul Verlaine',
          lecon: {
            titre: 'Verlaine, 1874 — la musique sans le sens',
            cours: `## Le recueil
Écrit pendant l’**errance avec Rimbaud** — Belgique, Angleterre —, publié en **1874**.

> Verlaine était alors **emprisonné à Mons**, **pour avoir tiré sur son compagnon**.

Le titre est emprunté à **Mendelssohn** : des **mélodies sans texte**.

| Section | Ses poèmes |
| « **Ariettes oubliées** » | « **Il pleure dans mon cœur / Comme il pleut sur la ville** », « C’est l’extase langoureuse » |
| « **Paysages belges** » | Les paysages **vus d’un train** |
| « Birds in the night » | L’amour et la rupture |
| « **Aquarelles** » | « Green », « Spleen », « Streets » |

## L’art poétique en acte
| Procédé | Son effet |
| Les **vers impairs** — cinq, sept, neuf, onze syllabes | Le déséquilibre |
| Les **rimes atténuées**, les **répétitions** | La fluidité |
| Les **sonorités liquides**, les **paysages flous** | **Le sens s’efface au profit de la sensation et du rythme** |

> Ce qu’il théorisera la même année dans « Art poétique » : « **De la musique avant toute chose** », « **Prends l’éloquence et tords-lui son cou** ».

## À retenir
Le recueil **le plus moderne** de Verlaine et l’un des **sommets du symbolisme naissant**.

> Il montre qu’un **poème peut se passer d’anecdote et de message**. **Debussy** et **Fauré** y puiseront abondamment.

> « Il pleure dans mon cœur comme il pleut sur la ville. »`,
          },
          questions: [
            ['Dans quelles circonstances le recueil paraît-il ?', ['Pendant l’emprisonnement de Verlaine à Mons', 'À son retour à Paris', 'Après la mort de Rimbaud', 'Avant sa rencontre avec Rimbaud'], 0, 'Il avait tiré sur Rimbaud à Bruxelles.'],
            ['D’où vient le titre du recueil ?', ['De mélodies sans texte de Mendelssohn', 'D’un poème de Baudelaire', 'D’une chanson populaire', 'D’un roman anglais'], 0, 'Il annonce une poésie où le sens s’efface devant la musique.'],
            ['Quel vers célèbre ouvre l’une des Ariettes ?', ['« Il pleure dans mon cœur comme il pleut sur la ville »', '« Les sanglots longs des violons »', '« Le ciel est par-dessus le toit »', '« Je fais souvent ce rêve étrange »'], 0, 'La pluie et les larmes s’y confondent.'],
            ['Quel type de vers Verlaine emploie-t-il ?', ['Des vers impairs', 'Uniquement l’alexandrin', 'Le vers libre', 'Le décasyllabe classique'], 0, 'Cinq, sept, neuf ou onze syllabes : le rythme se déséquilibre.'],
            ['Que réalise le recueil ?', ['Un poème peut se passer d’anecdote et de message', 'Une poésie engagée', 'Un retour au Parnasse', 'Une satire sociale'], 0, 'C’est l’un des sommets du symbolisme naissant.'],
            ['Ce recueil a été mis en musique par des compositeurs.', ['Vrai', 'Faux'], 0, 'Debussy et Fauré y ont puisé abondamment.'],
          ],
        },
        {
          titre: 'Roméo et Juliette, William Shakespeare',
          lecon: {
            titre: 'Shakespeare, vers 1595 — cinq jours, deux familles',
            cours: `## L’histoire
À **Vérone**, les **Montaigu** et les **Capulet** **se haïssent depuis des générations**.

| Étape | Ce qui se passe |
| Le bal | **Roméo**, Montaigu, s’introduit **masqué** chez les Capulet et **tombe amoureux de Juliette**, **quatorze ans** |
| Le mariage | **Secret**, dès le lendemain, grâce à **frère Laurent**, qui **espère réconcilier les familles** |
| Le sang | Roméo tue **Tybalt**, cousin de Juliette, **qui venait de tuer son ami Mercutio** : il est **banni** |
| Le stratagème | Pour éviter un mariage forcé avec **Pâris**, Juliette **boit un philtre** qui la fait **passer pour morte** |
| Le hasard | **La lettre expliquant le stratagème n’arrive pas** |
| La fin | Roméo, la croyant morte, **s’empoisonne près d’elle** ; **elle se réveille et se poignarde** |

Les deux familles **se réconcilient sur leurs tombeaux**.

## À retenir
Tragédie de la **jeunesse** et de la **hâte** : **tout se joue en cinq jours**.

| Ce que Shakespeare mêle | Le détail |
| Les **registres** | Les **obscénités** de la nourrice et de Mercutio voisinent avec le **lyrisme des amants** |
| Les **scènes archétypales** | Le **balcon**, l’**aube et l’alouette** |
| Le **hasard** | La lettre non remise **devient l’instrument du destin** |

> « Ce n’était pas l’alouette, c’était le rossignol. »`,
          },
          questions: [
            ['En combien de temps se déroule l’action ?', ['Environ cinq jours', 'Un an', 'Trois mois', 'Une journée'], 0, 'La hâte est un élément essentiel de la tragédie.'],
            ['Qui marie secrètement les deux amants ?', ['Frère Laurent', 'La nourrice', 'Le prince de Vérone', 'Le père Capulet'], 0, 'Il espère réconcilier les familles.'],
            ['Pourquoi Roméo est-il banni ?', ['Il a tué Tybalt, qui venait de tuer Mercutio', 'Il a enlevé Juliette', 'Il a insulté le prince', 'Il a refusé un duel'], 0, 'La vengeance enclenche la catastrophe.'],
            ['Qu’est-ce qui empêche le stratagème de réussir ?', ['La lettre explicative n’arrive pas à Roméo', 'Juliette se réveille trop tôt', 'Frère Laurent trahit', 'Pâris découvre tout'], 0, 'Le hasard devient l’instrument du destin.'],
            ['Que se passe-t-il après la mort des amants ?', ['Les deux familles se réconcilient', 'La guerre reprend', 'Le prince exile les Capulet', 'Rien ne change'], 0, 'La réconciliation se paie de leur mort.'],
            ['La pièce ne mélange pas les registres.', ['Vrai', 'Faux'], 1, 'Les obscénités de Mercutio et de la nourrice voisinent avec le lyrisme des amants.'],
          ],
        },
        {
          titre: 'Ruy Blas, Victor Hugo',
          lecon: {
            titre: 'Hugo, 1838 — « ver de terre amoureux d’une étoile »',
            cours: `## L’histoire
**Espagne, fin du XVIIe siècle.**

| Personnage | Sa position |
| **Don Salluste** | Grand d’Espagne **chassé de la cour par la reine** : il organise **une vengeance** |
| **Ruy Blas** | Son **valet** — il **aime secrètement la reine** |
| Le stratagème | Le faire passer pour son cousin **don César de Bazan**, noble **disparu** |

| Étape | Ce qui se passe |
| L’ascension | Devenu courtisan, puis **Premier ministre** |
| Le grand discours | Acte III, **contre les ministres qui pillent l’Espagne** — « **Bon appétit, messieurs !** » |
| Le succès | Il **gouverne bien** et **se fait aimer de la reine** |
| Le piège | Salluste **attire la reine dans un guet-apens pour la déshonorer** |
| La fin | Démasqué, Ruy Blas **tue Salluste**, **avoue à la reine qu’il n’est qu’un laquais**, **boit le poison** — et **meurt en obtenant son pardon** |

## À retenir
Le **drame romantique** dans sa forme **la plus achevée**.

| Élément | Le détail |
| Le mélange du **sublime** et du **grotesque** | Le **vrai don César**, bandit truculent, **occupe tout l’acte IV** |
| Les **alexandrins disloqués** | La forme suit le drame |
| Le **sujet politique** | Le cœur de la pièce |

> Hugo l’a résumé : **le peuple, incarné par un valet de génie, est capable de gouverner mieux que la noblesse** — **mais la société le lui interdit**.

> « Ver de terre amoureux d’une étoile. »`,
          },
          questions: [
            ['Qui est Ruy Blas ?', ['Un valet qui se fait passer pour un noble', 'Un grand d’Espagne exilé', 'Un ministre corrompu', 'Le frère de la reine'], 0, 'Don Salluste l’utilise comme instrument de vengeance.'],
            ['Quel poste Ruy Blas finit-il par occuper ?', ['Premier ministre', 'Capitaine des gardes', 'Ambassadeur', 'Gouverneur de province'], 0, 'Et il gouverne mieux que les nobles.'],
            ['Quel discours célèbre prononce-t-il à l’acte III ?', ['« Bon appétit, messieurs ! », contre les ministres qui pillent l’Espagne', 'Un éloge de la reine', 'Une déclaration de guerre', 'Un plaidoyer pour son maître'], 0, 'C’est le sommet politique de la pièce.'],
            ['Quel personnage assure le registre grotesque ?', ['Le vrai don César de Bazan, bandit truculent', 'La reine', 'Don Salluste', 'Le page'], 0, 'Il occupe presque tout l’acte IV.'],
            ['Comment la pièce se termine-t-elle ?', ['Ruy Blas tue Salluste, avoue tout et s’empoisonne', 'Il épouse la reine', 'Il est exilé', 'Salluste triomphe'], 0, 'Il obtient le pardon de la reine avant de mourir.'],
            ['La pièce n’a aucune portée politique.', ['Vrai', 'Faux'], 1, 'Hugo y montre un homme du peuple capable de gouverner, et une société qui le lui interdit.'],
          ],
        },
        {
          titre: 'Sagesse, Paul Verlaine',
          lecon: {
            titre: 'Verlaine, 1881 — la conversion en prison',
            cours: `## Le recueil
Écrit en grande partie à la **prison de Mons**, où Verlaine purge **deux ans** pour avoir **tiré sur Rimbaud** — et où il **se convertit au catholicisme**.

> Publié en **1881**, il **déroute** les lecteurs qui attendaient le poète des *Fêtes galantes*.

| Partie | Ce qu’elle porte |
| La première | Le **repentir** et la **lutte intérieure** |
| La deuxième | Le fameux **dialogue avec le Christ** — « Mon Dieu m’a dit : Mon fils, il faut m’aimer » |
| La troisième | La **foi** et l’**humilité** |
| La quatrième | Quelques-uns de ses **plus beaux textes**, écrits **depuis la cellule** |

| Poème de la cellule | Son vers |
| « **Le ciel est, par-dessus le toit** » | « Si bleu, si calme » |
| « Un grand sommeil noir » | La torpeur |
| « Le son du cor s’afflige vers les bois » | La mélancolie |

## À retenir
| Ce que la conversion **ne change pas** | Ce qu’elle **change** |
| La **manière** : même **simplicité**, même **musicalité**, mêmes **vers impairs**, même **refus de l’éloquence** | Le **sujet** : la **faute**, le **pardon**, l’**humilité** |

> Le recueil a fait de Verlaine, pour une part de son public, un **poète chrétien** — **alors même que sa vie continuait de contredire ses vœux**.

C’est le début du « **pauvre Lelian** » : **alcoolique et misérable**, **adulé par les jeunes symbolistes**.

> « Qu’as-tu fait, ô toi que voilà, / De ta jeunesse ? »`,
          },
          questions: [
            ['Où Verlaine a-t-il écrit une grande partie du recueil ?', ['En prison, à Mons', 'À Londres', 'Dans les Ardennes', 'À Paris'], 0, 'Il y purgeait deux ans pour avoir tiré sur Rimbaud.'],
            ['Quel événement personnel marque ce recueil ?', ['Sa conversion au catholicisme', 'Son mariage', 'La mort de son fils', 'Son élection'], 0, 'Le repentir et la foi en deviennent les sujets.'],
            ['Quel poème commence par « Le ciel est, par-dessus le toit » ?', ['Un poème écrit en prison', 'Un poème de jeunesse', 'Un poème d’amour', 'Un poème politique'], 0, 'Il se termine sur « Qu’as-tu fait de ta jeunesse ? ».'],
            ['La conversion change-t-elle la manière de Verlaine ?', ['Non : même simplicité, même musicalité, mêmes vers impairs', 'Oui, il adopte l’alexandrin classique', 'Oui, il devient obscur', 'Oui, il écrit en prose'], 0, 'Seul le sujet change.'],
            ['Comment Verlaine se désignera-t-il plus tard ?', ['« Pauvre Lelian », anagramme de son nom', '« Le poète maudit »', '« Le prince des poètes »', '« L’enfant perdu »'], 0, 'Il s’ajoute lui-même à ses Poètes maudits.'],
            ['Le recueil a été bien accueilli par les lecteurs des Fêtes galantes.', ['Vrai', 'Faux'], 1, 'Il les a déroutés : on n’attendait pas de Verlaine un livre de foi.'],
          ],
        },
        {
          titre: 'Sept manifestes Dada, Tristan Tzara',
          lecon: {
            titre: 'Tzara, 1924 — l’art contre l’art',
            cours: `## Le mouvement
**Dada** naît à **Zurich** en **1916**, au **Cabaret Voltaire**, autour de **Tristan Tzara**, **Hugo Ball**, **Hans Arp**.

> Dans une **ville neutre**, **au milieu d’une guerre européenne qui vide de sens les valeurs au nom desquelles on massacre**.

| Le nom | Ce qu’il signifie |
| Trouvé **au hasard dans un dictionnaire** | **Rien** — **c’est un programme** |

## Le recueil
Les *Sept manifestes Dada* réunissent en **1924** les textes de Tzara, dont le fameux *Manifeste Dada 1918*.

| Ce qui est refusé |
| L’**art** |
| La **logique** |
| La **morale** et le **bon goût** |
| La **psychologie** |
| Le **sens** lui-même — « **Dada ne signifie rien** » |

> Le célèbre mode d’emploi : « **Pour faire un poème dadaïste**, prenez un journal, prenez des ciseaux, **découpez chaque mot**, mettez-les dans un sac, **agitez doucement**, sortez-les l’un après l’autre. »

## À retenir
Dada est une **table rase**, **pas une école** : **provocation**, **spectacles chaotiques**, tracts, **insultes au public**.

| Sa fin | Sa descendance |
| Il **se dissout** dans les années 1920 | Il **ouvre directement sur le surréalisme** — **Breton**, d’abord dadaïste, **rompra avec Tzara** |
| — | Et, plus loin, sur **tout l’art contemporain** |

> « Dada ne signifie rien. »`,
          },
          questions: [
            ['Où et quand Dada est-il né ?', ['À Zurich, en 1916, au Cabaret Voltaire', 'À Paris, en 1920', 'À Berlin, en 1918', 'À New York, en 1914'], 0, 'Dans une ville neutre, en pleine guerre européenne.'],
            ['Que signifie le mot « dada » ?', ['Rien : il a été trouvé au hasard dans un dictionnaire', 'Cheval, en langage enfantin, symbole du mouvement', 'Un cri de guerre roumain', 'Une abréviation d’un manifeste'], 0, 'L’absence de sens est un programme.'],
            ['Quelle recette Tzara donne-t-il pour écrire un poème ?', ['Découper un article de journal et tirer les mots au hasard', 'Écrire sous la dictée d’un rêve', 'Imiter les poètes anciens', 'Composer en vers réguliers'], 0, 'Le hasard remplace l’intention.'],
            ['Que refuse Dada ?', ['L’art, la logique, la morale, le bon goût et le sens', 'La guerre uniquement', 'La peinture figurative', 'Le théâtre'], 0, 'C’est une table rase, pas une école.'],
            ['Quel mouvement succède à Dada ?', ['Le surréalisme', 'Le futurisme', 'Le cubisme', 'L’expressionnisme'], 0, 'Breton, d’abord dadaïste, rompra avec Tzara.'],
            ['Dada proposait un programme esthétique précis.', ['Vrai', 'Faux'], 1, 'Il refusait précisément tout programme : c’était une destruction, non une doctrine.'],
          ],
        },
        {
          titre: 'Si le grain ne meurt, André Gide',
          lecon: {
            titre: 'Gide, 1926 — l’autobiographie sans arrangement',
            cours: `## L’œuvre
Autobiographie couvrant **l’enfance et la jeunesse** de Gide, **jusqu’à ses fiançailles** avec sa cousine **Madeleine**, en **1895**.

> Le titre vient de l’Évangile de Jean : « **Si le grain ne meurt… il ne porte pas de fruit** » — **il faut mourir à soi-même pour naître**.

## Le contenu
| Période | Ce qu’elle contient |
| L’enfance **protestante** | **Austère et surveillée** ; le **père mort tôt** ; les interdits, la **culpabilité**, l’extrême **solitude** |
| La découverte | Les **livres** et la **musique** |
| Les voyages en **Afrique du Nord**, 1893 et 1895 | La **tuberculose**, la **guérison**, la découverte du **désir** et de son **homosexualité** |
| À **Alger** | La rencontre d’**Oscar Wilde** et de **Lord Alfred Douglas** |
| La fin | La **mort de sa mère** et les **fiançailles** |

## À retenir
Publié d’abord **confidentiellement**, puis en librairie en **1926**.

> Le livre a fait **scandale** : Gide y **avoue publiquement son homosexualité**, à une époque où cela relevait **au mieux du silence**. **Geste rarissime**, qu’il **assume par exigence de vérité**.

| Ce que le livre fait aussi | Le détail |
| Il **doute de son propre exercice** | **Gide sait que se raconter, c’est composer** |

> « Je ne suis qu’un petit garçon qui s’amuse, doublé d’un pasteur protestant qui l’ennuie. »`,
          },
          questions: [
            ['D’où vient le titre du livre ?', ['De l’Évangile de Jean : « Si le grain ne meurt… »', 'D’un poème de Baudelaire', 'D’un proverbe normand', 'D’une lettre de Madeleine'], 0, 'Il faut mourir à soi-même pour porter du fruit.'],
            ['Jusqu’à quand le récit va-t-il ?', ['Jusqu’à ses fiançailles, en 1895', 'Jusqu’à sa mort', 'Jusqu’en 1914', 'Jusqu’au prix Nobel'], 0, 'Enfance et jeunesse seulement.'],
            ['Quelle rencontre célèbre le livre raconte-t-il ?', ['Celle d’Oscar Wilde à Alger', 'Celle de Proust à Paris', 'Celle de Valéry à Montpellier', 'Celle de Claudel à Rome'], 0, 'Wilde était accompagné de Lord Alfred Douglas.'],
            ['Pourquoi le livre a-t-il fait scandale ?', ['Gide y avoue publiquement son homosexualité', 'Il attaque la République', 'Il révèle des secrets d’État', 'Il critique l’Église catholique'], 0, 'Un geste rarissime pour l’époque.'],
            ['Quel milieu familial le livre décrit-il ?', ['Un milieu protestant austère et surveillé', 'Une famille catholique nombreuse', 'Un milieu ouvrier', 'Une famille d’artistes'], 0, 'Interdits, culpabilité et solitude.'],
            ['Gide présente son autobiographie comme un exercice sans difficulté.', ['Vrai', 'Faux'], 1, 'Il doute de l’exercice : se raconter, c’est composer.'],
          ],
        },
        {
          titre: 'Sido, Colette',
          lecon: {
            titre: 'Colette, 1930 — le portrait d’un monde par sa mère',
            cours: `## L’œuvre
Un **récit de mémoire** en **trois parties**, écrit à **cinquante-sept ans**, **longtemps après la mort de sa mère**.

| Partie | Qui elle porte | Ce qu’on en retient |
| **Sido** | **Sidonie Landoy**, la mère | Elle guette les orages, **sauve les chenilles**, connaît chaque plante — et **refuse de quitter son jardin même pour voir sa fille** |
| **Le Capitaine** | Le père, ancien militaire **amputé** | **Poète sans œuvre** : à sa mort, on découvre que ses **volumes reliés sont blancs**, sauf la **dédicace à sa femme** |
| **Les Sauvages** | Les frères et la sœur | **Silencieux et indépendants** |

## À retenir
Parcours associé au bac : **la célébration du monde**.

| Célébrer, chez Colette | L’exemple |
| C’est **nommer précisément** | Pas « une fleur » mais un **souci**, une **pivoine** |
| — | Pas « le printemps » mais l’**odeur exacte de la pluie sur la poussière chaude** |

> Le livre s’écrit **du côté de la perte** — mère morte, enfance enfuie, maison vendue — **et c’est de là que vient sa lumière**.

> **Sido** est moins un **personnage** qu’une **manière de regarder** — **dont naît le style de sa fille**.

> « Je ne suis pas de celles qui abandonnent leur jardin. »`,
          },
          questions: [
            ['Quelles sont les trois parties de l’œuvre ?', ['Sido, Le Capitaine, Les Sauvages', 'La Mère, Le Jardin, Le Village', 'L’Enfance, Paris, Le Retour', 'Printemps, Été, Hiver'], 0, 'Trois portraits, sans récit continu.'],
            ['Que découvre-t-on à la mort du Capitaine ?', ['Ses volumes reliés sont vierges', 'Il avait une seconde famille', 'Il était ruiné', 'Il avait publié sous un pseudonyme'], 0, 'Seule la dédicace à sa femme est écrite.'],
            ['Comment s’exprime la célébration chez Colette ?', ['Par la précision des noms et des sensations', 'Par l’exaltation lyrique', 'Par l’abstraction', 'Par le silence'], 0, 'Pas « une fleur », mais un souci ou une pivoine.'],
            ['Depuis quelle position le livre est-il écrit ?', ['Depuis la perte : mère morte, enfance enfuie, maison vendue', 'Depuis le bonheur présent', 'Depuis l’enfance elle-même', 'Depuis l’exil'], 0, 'C’est de là que vient la lumière du texte.'],
            ['Qu’est Sido, au-delà du personnage ?', ['Une manière de regarder, dont naît le style de Colette', 'Une figure allégorique de la France', 'Un personnage inventé', 'La narratrice du livre'], 0, 'Le style hérite du regard maternel.'],
            ['Sido est une autobiographie chronologique complète.', ['Vrai', 'Faux'], 1, 'C’est un récit de mémoire en trois portraits.'],
          ],
        },
        {
          titre: 'Sonnets pour Hélène, Pierre de Ronsard',
          lecon: {
            titre: 'Ronsard, 1578 — le poète vieillissant',
            cours: `## Le recueil
**Deux livres de sonnets**, publiés en **1578**, adressés à **Hélène de Surgères**, jeune **dame d’honneur de Catherine de Médicis**.

> Ronsard a alors **cinquante-quatre ans**. **Le décalage d’âge est constamment présent** — et donne au cycle sa tonalité si particulière : **galanterie**, **mélancolie**, **revendication du pouvoir du poème**.

## Le sonnet le plus célèbre
« **Quand vous serez bien vieille, au soir, à la chandelle** »

| Ce que le poète imagine | Le détail |
| Hélène **devenue vieille** | **Filant près du feu** |
| Sa réaction | Elle **s’émerveille qu’un poète l’ait chantée** |
| Son sentiment | Elle **regrette de l’avoir dédaigné** |

> La chute est un *carpe diem* : « Vivez, si m’en croyez, n’attendez à demain : / **Cueillez dès aujourd’hui les roses de la vie.** »

## À retenir
> Ce n’est **pas seulement un poème d’amour** : c’est une **affirmation du pouvoir de la poésie**, **seule capable de conserver une beauté que le temps détruit**.

| Le prénom d’**Hélène** | Ce qu’il permet |
| Tout un **jeu** | Avec l’**Hélène de Troie** de l’Antiquité |

> Ronsard y atteint une **simplicité de langue** qu’il **n’avait pas dans ses premiers recueils pétrarquistes**.

> « Cueillez dès aujourd’hui les roses de la vie. »`,
          },
          questions: [
            ['Qui est Hélène de Surgères ?', ['Une jeune dame d’honneur de Catherine de Médicis', 'La femme de Ronsard', 'Une paysanne d’Anjou', 'Une reine'], 0, 'Ronsard a cinquante-quatre ans lorsqu’il lui adresse ces sonnets.'],
            ['Que raconte « Quand vous serez bien vieille » ?', ['Le poète imagine Hélène vieillie, regrettant de l’avoir dédaigné', 'Un adieu définitif', 'Un souvenir de jeunesse', 'Une déclaration au roi'], 0, 'Elle file près du feu et s’émerveille d’avoir été chantée.'],
            ['Quelle est la chute du sonnet ?', ['« Cueillez dès aujourd’hui les roses de la vie »', '« Ô temps, suspends ton vol »', '« Mignonne, allons voir si la rose »', '« La vie est brève »'], 0, 'Un carpe diem devenu proverbial.'],
            ['Quel pouvoir le poème revendique-t-il ?', ['Celui de conserver une beauté que le temps détruit', 'Celui de faire la guerre', 'Celui de convertir', 'Celui de gouverner'], 0, 'La poésie est la seule immortalité disponible.'],
            ['Quel jeu le prénom d’Hélène permet-il ?', ['Un rapprochement avec Hélène de Troie', 'Un jeu de mots sur la lumière', 'Une allusion religieuse', 'Un acrostiche'], 0, 'Ronsard l’exploite tout au long du recueil.'],
            ['Le recueil est écrit par un poète jeune et débutant.', ['Vrai', 'Faux'], 1, 'Ronsard est en fin de carrière : le décalage d’âge est au cœur du cycle.'],
          ],
        },
        {
          titre: 'Supplément au voyage de Bougainville, Denis Diderot',
          lecon: {
            titre: 'Diderot, 1796 — Tahiti comme miroir critique',
            cours: `## L’œuvre
Écrit en **1772**, après la lecture du **récit de voyage de Bougainville** — publié seulement en **1796**.

| La forme | Le détail |
| Un **dialogue en cinq parties** | Entre deux interlocuteurs, **A** et **B** |
| Ce qu’il encadre | **Deux morceaux célèbres** |

| Morceau | Ce qu’il fait |
| Les **Adieux du vieillard** tahitien | Il **maudit les Européens venus corrompre son peuple** |
| L’**Entretien de l’aumônier et d’Orou** | Un Tahitien **démonte, argument par argument, la morale sexuelle chrétienne** |

## Les thèses
| Thèse | La formule |
| La **colonisation est une prédation** | « **Ce pays est à toi ! Et pourquoi ? Parce que tu y as mis le pied ?** » |
| Nos **mœurs** ne sont pas naturelles mais **conventionnelles** | Le mariage indissoluble, la propriété, la pudeur, le **péché** sont des **institutions**, **pas des vérités** |
| Mais **pas de retour à l’état de nature** | La conclusion invite à **suivre les lois de son pays** — **tout en sachant qu’elles sont arbitraires** |

## À retenir
Un texte des Lumières **à son point le plus radical**, où l’**altérité** sert à **révéler la contingence de nos institutions**.

> **Tahiti y est largement idéalisé** : c’est un **outil critique**, **non une ethnographie**.

> « Il était innocent et heureux avant votre arrivée. »`,
          },
          questions: [
            ['De quel texte ce Supplément est-il le prolongement ?', ['Le récit de voyage de Bougainville', 'L’Encyclopédie', 'Les Lettres persanes', 'Le Voyage en Italie'], 0, 'Diderot y ajoute un dialogue critique.'],
            ['Quels sont les deux morceaux les plus célèbres ?', ['Les Adieux du vieillard et l’Entretien de l’aumônier et d’Orou', 'La préface et l’épilogue', 'Deux lettres à Sophie Volland', 'Deux articles de dictionnaire'], 0, 'Le premier dénonce la colonisation, le second la morale sexuelle.'],
            ['Que dénonce le vieillard tahitien ?', ['La prédation coloniale : « Ce pays est à toi ! Et pourquoi ? »', 'La religion des Tahitiens', 'Le commerce maritime', 'Les maladies apportées seulement'], 0, 'La légitimité de la conquête est démontée en quelques phrases.'],
            ['Que montre l’entretien avec Orou ?', ['Nos mœurs sont conventionnelles, non naturelles', 'La supériorité de la morale chrétienne', 'L’égalité des religions', 'La nécessité du célibat'], 0, 'Mariage, propriété et péché sont des institutions.'],
            ['Que conclut Diderot ?', ['Suivre les lois de son pays tout en sachant qu’elles sont arbitraires', 'Retourner à l’état de nature', 'Coloniser autrement', 'Abolir toute loi'], 0, 'La lucidité n’implique pas la révolte.'],
            ['Le Tahiti du texte est une description ethnographique fidèle.', ['Vrai', 'Faux'], 1, 'C’est un outil critique largement idéalisé.'],
          ],
        },
        {
          titre: 'Terre des hommes, Antoine de Saint-Exupéry',
          lecon: {
            titre: 'Saint-Exupéry, 1939 — le métier et la fraternité',
            cours: `## L’œuvre
Un récit fait de **souvenirs** et de **méditations** — **non un roman**.

| Épisode | Ce qu’il raconte |
| Les débuts de l’**Aéropostale** | Toulouse, l’Espagne, l’Afrique ; le **vol de nuit** |
| **Guillaumet** | Perdu **cinq jours dans les Andes** après un crash : il **marche pour que sa famille puisse toucher l’assurance** — « **ce que j’ai fait, aucune bête ne l’aurait fait** » |
| **Mermoz** | **Disparu en mer** |
| L’accident de **Libye**, 1935 | Saint-Exupéry lui-même : l’**errance** et le **sauvetage par un Bédouin** |
| L’**Espagne en guerre** | Et une réflexion sur l’homme |

## Le propos
| Idée | Ce qu’elle dit |
| Le **métier** donne un sens | L’avion **n’est pas une machine à voler** : c’est un **outil qui révèle la terre et les hommes** |
| La **responsabilité** | Elle **définit l’adulte** |
| Le **lien entre camarades** | Il **vaut mieux que tout discours** |

> La dernière page, sur un **enfant d’émigrés endormi dans un train** — « **Mozart assassiné** » — est l’une des **plus citées** de la littérature française.

## À retenir
**Grand Prix du roman de l’Académie française** en **1939**. Saint-Exupéry **disparaîtra en mission en 1944**.

> Le livre **annonce** *Le Petit Prince* (1943) : **même attention aux liens, à la responsabilité, à ce qui est invisible**.

> « Être homme, c’est précisément être responsable. »`,
          },
          questions: [
            ['De quelle compagnie aérienne le livre raconte-t-il les débuts ?', ['L’Aéropostale', 'Air France', 'La Lufthansa', 'La compagnie Latécoère du Pacifique'], 0, 'Toulouse, l’Espagne, l’Afrique, puis l’Amérique du Sud.'],
            ['Quel exploit de Guillaumet le livre raconte-t-il ?', ['Sa marche de cinq jours dans les Andes après un crash', 'Un vol transatlantique record', 'Un sauvetage en mer', 'Une traversée du Sahara en voiture'], 0, '« Ce que j’ai fait, aucune bête ne l’aurait fait. »'],
            ['Quel accident personnel Saint-Exupéry raconte-t-il ?', ['Son crash dans le désert de Libye, en 1935', 'Un amerrissage en Méditerranée', 'Une panne au-dessus des Andes', 'Un accident à l’atterrissage à Toulouse'], 0, 'Il est sauvé par un Bédouin après plusieurs jours d’errance.'],
            ['Quelle formule résume la morale du livre ?', ['« Être homme, c’est précisément être responsable »', '« On ne voit bien qu’avec le cœur »', '« L’essentiel est invisible »', '« Il faut cultiver son jardin »'], 0, 'Le métier et le lien entre camarades donnent le sens.'],
            ['Quelle image clôt le livre ?', ['Un enfant d’émigrés endormi dans un train, « Mozart assassiné »', 'Un avion au décollage', 'Le désert au lever du jour', 'Un portrait de Mermoz'], 0, 'C’est l’une des pages les plus citées de l’auteur.'],
            ['Terre des hommes est un roman d’aventures fictif.', ['Vrai', 'Faux'], 1, 'C’est un récit de souvenirs et de méditations, non une fiction.'],
          ],
        },
        {
          titre: 'Thérèse Desqueyroux, François Mauriac',
          lecon: {
            titre: 'Mauriac, 1927 — une femme qui a voulu tuer son mari',
            cours: `## L’histoire
Le roman s’ouvre **à la sortie du palais de justice** : un **non-lieu** vient d’être prononcé en faveur de **Thérèse Desqueyroux**, accusée d’avoir **tenté d’empoisonner son mari Bernard**.

> **La famille a menti pour éviter le scandale.**

| Étape | Ce qui se passe |
| Le retour | Sur le chemin d’**Argelouse**, au milieu des **landes** et des **pins**, Thérèse **prépare la confession qu’elle voudrait faire** |
| Le récit remonte | Le **mariage arrangé**, l’**ennui**, l’**étouffement**, l’amitié avec **Anne** |
| Le geste | La lente montée d’un acte **sans mobile clair** : elle a **laissé Bernard augmenter ses doses d’arsenic**, puis **falsifié une ordonnance** |
| La punition | **Séquestrée** dans sa chambre, elle **se laisse dépérir** |
| La fin | Pour **sauver les apparences** après le mariage d’Anne, Bernard la conduit à **Paris** et **l’y abandonne** — **ce qui est, pour elle, la liberté** |

## À retenir
Roman **catholique sans démonstration**.

> **Mauriac laisse Thérèse sans explication ni rédemption** — **et c’est ce qui trouble**.

| Ce qui est peint | Le détail |
| La **bourgeoisie provinciale** | Le **patrimoine**, les **pins**, le **nom**, la **messe** |
| L’**étouffement** | **D’une femme qui pense** |

**Prix Nobel** en **1952**.

> « Je ne sais pas ce que j’ai voulu. »`,
          },
          questions: [
            ['Comment le roman s’ouvre-t-il ?', ['À la sortie du palais de justice, après un non-lieu', 'Le jour du mariage', 'Pendant l’empoisonnement', 'À Paris'], 0, 'La famille a menti pour éviter le scandale.'],
            ['De quoi Thérèse est-elle accusée ?', ['D’avoir tenté d’empoisonner son mari à l’arsenic', 'D’avoir incendié la maison', 'D’adultère', 'De vol'], 0, 'Elle a laissé Bernard augmenter ses doses, puis falsifié une ordonnance.'],
            ['Où se déroule l’essentiel du roman ?', ['À Argelouse, dans les landes de pins', 'À Bordeaux', 'À Paris', 'En Bretagne'], 0, 'Le paysage étouffant fait partie du drame.'],
            ['Que devient Thérèse après son retour ?', ['Elle est séquestrée dans sa chambre', 'Elle est jugée à nouveau', 'Elle s’enfuit aussitôt', 'Elle est pardonnée'], 0, 'Bernard sauve les apparences jusqu’au mariage d’Anne.'],
            ['Comment le roman se termine-t-il ?', ['Bernard l’abandonne à Paris, ce qui est pour elle la liberté', 'Elle meurt', 'Elle retourne à Argelouse', 'Elle est emprisonnée'], 0, 'La fin est ouverte et ambiguë.'],
            ['Mauriac donne une explication claire du geste de Thérèse.', ['Vrai', 'Faux'], 1, '« Je ne sais pas ce que j’ai voulu » : l’absence de mobile est le cœur du roman.'],
          ],
        },
        {
          titre: 'Thérèse Raquin, Émile Zola',
          lecon: {
            titre: 'Zola, 1867 — un crime et deux tempéraments',
            cours: `## L’histoire
**Thérèse**, élevée par sa tante **Madame Raquin**, est mariée à son cousin **Camille**, **chétif et médiocre**, et vit dans une **mercerie sombre** du **passage du Pont-Neuf**.

| Étape | Ce qui se passe |
| L’arrivée de **Laurent**, ami de Camille | Elle déclenche une **passion violente** |
| Le crime | Les amants **noient Camille** lors d’une promenade en barque à **Saint-Ouen** — **maquillée en accident** |
| L’attente, puis le mariage | Et la découverte : **ils ne peuvent plus se toucher** — **le noyé est entre eux** |
| La descente | **Insomnies**, **hallucinations**, haine, coups |
| **Madame Raquin** | **Frappée de paralysie**, elle **comprend tout** et **assiste, muette**, à leur destruction |
| La fin | Ils **s’empoisonnent ensemble sous son regard** |

## À retenir
Roman de **jeunesse** — Zola a **vingt-sept ans** —, **scandale immédiat** : un critique parla de « **littérature putride** ».

> La **préface** de la seconde édition est un **manifeste** : « J’ai choisi des personnages **souverainement dominés par leurs nerfs et leur sang**… j’ai simplement fait sur **deux corps vivants** le travail analytique que les chirurgiens font sur des **cadavres**. »

| Ce que sont les personnages | Ce qu’ils ne sont pas |
| Des **tempéraments** | Des **caractères** |

> C’est l’**acte de naissance du naturalisme**.

> « Le remords, chez eux, fut purement physique. »`,
          },
          questions: [
            ['Où vit Thérèse au début du roman ?', ['Dans une mercerie sombre du passage du Pont-Neuf', 'Dans une ferme du Midi', 'À Saint-Ouen', 'Dans un hôtel particulier'], 0, 'Le décor étouffant prépare le drame.'],
            ['Comment les amants tuent-ils Camille ?', ['Ils le noient lors d’une promenade en barque', 'Ils l’empoisonnent', 'Ils le poussent d’un toit', 'Ils l’étranglent'], 0, 'Le crime est maquillé en accident.'],
            ['Que se passe-t-il après leur mariage ?', ['Ils ne peuvent plus se toucher, hantés par le noyé', 'Ils sont arrêtés', 'Ils s’enfuient à l’étranger', 'Ils vivent heureux'], 0, 'Insomnies, hallucinations, haine et coups.'],
            ['Quel est le rôle de Madame Raquin à la fin ?', ['Paralysée, elle comprend tout et assiste muette à leur destruction', 'Elle les dénonce à la police', 'Elle les protège', 'Elle meurt avant le crime'], 0, 'Son regard devient un châtiment.'],
            ['Que dit la préface de la seconde édition ?', ['Les personnages sont des tempéraments, étudiés comme sur des cadavres', 'Le roman est une fiction morale', 'L’auteur regrette le scandale', 'Le crime doit être puni par la loi'], 0, 'C’est l’acte de naissance du naturalisme.'],
            ['Le remords des personnages est présenté comme moral.', ['Vrai', 'Faux'], 1, 'Zola insiste : « Le remords, chez eux, fut purement physique. »'],
          ],
        },
        {
          titre: 'Tobie des Marais, Sylvie Germain',
          lecon: {
            titre: 'Germain, 1998 — un texte biblique transposé dans le Marais poitevin',
            cours: `## L’histoire
Le roman **transpose le Livre de Tobie** — texte de l’**Ancien Testament** — dans le **Marais poitevin contemporain**.

| Personnage | Sa situation |
| **Tobie Guélène** | Il grandit auprès de son père |
| **Théodore**, le père | **Veuf inconsolable** depuis l’**assassinat** de sa femme **Deborah**, dans des circonstances **obscures** |
| Ce qu’il devient | Il **perd la vue et la raison** |
| **Raphaël** | Le **compagnon mystérieux** du voyage |
| **Sara** | Marquée par une **malédiction** : **plusieurs de ses fiancés sont morts** |

| Étape | Ce qui se passe |
| Le départ | Tobie est envoyé **récupérer une dette lointaine** |
| Le voyage | Avec **Raphaël** et **un chien** |
| Le rôle de l’ange | Il **guide**, **protège**, **guérit** |
| Le retour | Il **rend la vue au père** |

## À retenir
Sylvie Germain écrit une **réécriture qui n’explique jamais le surnaturel** : **Raphaël est un compagnon comme un autre** — **la lecture reste ouverte**.

| Trait d’écriture | Ses thèmes constants |
| **Poétique**, très sensible aux **eaux**, aux **brumes**, aux **arbres** du marais | Le **mal**, la **mémoire**, la **parole perdue** |
| — | La **présence obscure du sacré dans le monde ordinaire** |

> Le sacré n’y est pas au-dessus du monde, il est dedans, à peine visible.`,
          },
          questions: [
            ['De quel texte le roman est-il la réécriture ?', ['Le Livre de Tobie, dans l’Ancien Testament', 'L’Odyssée', 'Le Livre de Job', 'Les Évangiles'], 0, 'Il en transpose l’intrigue dans le Marais poitevin.'],
            ['Où se déroule le roman ?', ['Dans le Marais poitevin contemporain', 'En Palestine antique', 'En Bretagne', 'À Paris'], 0, 'Les eaux et les brumes du marais nourrissent l’écriture.'],
            ['Qui accompagne Tobie dans son voyage ?', ['Raphaël, un compagnon mystérieux, et un chien', 'Son père Théodore', 'Sara', 'Un prêtre'], 0, 'La figure de l’ange n’est jamais expliquée.'],
            ['Qu’est-il arrivé à la mère de Tobie ?', ['Elle a été assassinée dans des circonstances obscures', 'Elle est morte en couches', 'Elle a quitté la famille', 'Elle est malade'], 0, 'Le père en devient inconsolable, puis aveugle.'],
            ['Comment le roman traite-t-il le surnaturel ?', ['Sans jamais l’expliquer : la lecture reste ouverte', 'Il le nie', 'Il le démontre', 'Il le tourne en dérision'], 0, 'Le sacré est présent dans le monde ordinaire, à peine visible.'],
            ['Le mal et la mémoire sont des thèmes constants chez Sylvie Germain.', ['Vrai', 'Faux'], 0, 'Ils traversent toute son œuvre, avec la question de la parole perdue.'],
          ],
        },
        {
          titre: 'Tous les matins du monde, Pascal Quignard',
          lecon: {
            titre: 'Quignard, 1991 — la musique contre le monde',
            cours: `## L’histoire
France, **XVIIe siècle**.

| Personnage | Sa position |
| **Monsieur de Sainte Colombe** | Joueur de **viole de gambe** : il **perd sa femme** et se retire dans une **cabane au fond de son jardin** |
| Ce qu’il y fait | Il **joue seul, des heures durant, pour la morte** — **qui lui apparaît parfois** |
| Ce qu’il refuse | La **cour de Louis XIV** et l’**argent** |
| **Marin Marais** | Jeune, **ambitieux et doué** : il vient demander à devenir son élève |

| Étape | Ce qui se passe |
| Le rejet | Sainte Colombe le juge **trop soucieux de plaire** et **finit par le chasser** |
| La réussite | Marais devient **musicien du roi**, **célèbre et riche** |
| Le retour | Bien plus tard, il **revient écouter en secret** le vieux maître |
| La fin | Une **dernière leçon**, **la nuit, dans la cabane** — **sur la mort et sur ce que cherche la musique** |

## À retenir
Roman **bref**, en **chapitres très courts**, écrit dans une **langue sèche et rythmée, sans effets**.

| Sujet | Ce qu’il oppose |
| Le **deuil**, le **silence** | L’art comme **moyen d’atteindre les morts** |
| La musique **de cour** — le succès | La musique **vraie** |

Le film d’**Alain Corneau** (1991), avec la musique de **Jordi Savall**, a fait connaître le livre au monde entier.

> « La musique est simplement là pour parler de ce dont la parole ne peut parler. »`,
          },
          questions: [
            ['De quel instrument joue Monsieur de Sainte Colombe ?', ['La viole de gambe', 'Le clavecin', 'Le violon', 'Le luth'], 0, 'Il joue seul, dans une cabane au fond de son jardin.'],
            ['Pourquoi Sainte Colombe s’est-il retiré du monde ?', ['Il est inconsolable de la mort de sa femme', 'Il a été chassé de la cour', 'Il est ruiné', 'Il est malade'], 0, 'Elle lui apparaît parfois quand il joue.'],
            ['Pourquoi refuse-t-il Marin Marais comme élève ?', ['Il le juge trop soucieux de plaire', 'Il est trop âgé', 'Il ne sait pas jouer', 'Il n’a pas d’argent'], 0, 'Marais deviendra pourtant musicien du roi.'],
            ['Que se passe-t-il à la fin du roman ?', ['Une dernière leçon nocturne, sur la mort et sur la musique', 'Sainte Colombe entre à la cour', 'Marais renonce à la musique', 'Ils se brouillent définitivement'], 0, 'Marais revient écouter en secret le vieux maître.'],
            ['Quelle opposition structure le livre ?', ['La musique de cour et la musique vraie', 'La ville et la campagne', 'La foi et la raison', 'La jeunesse et la vieillesse seulement'], 0, 'Le succès contre la recherche du silence.'],
            ['Le livre est écrit dans une langue abondante et ornée.', ['Vrai', 'Faux'], 1, 'Langue sèche, rythmée, chapitres très courts, sans effets.'],
          ],
        },
        {
          titre: 'Traité sur la tolérance, Voltaire',
          lecon: {
            titre: 'Voltaire, 1763 — l’affaire Calas',
            cours: `## Le contexte : l’affaire Calas
| Étape | Ce qui se passe |
| **Toulouse, 1761** | **Marc-Antoine Calas** est retrouvé **pendu** chez son père |
| La rumeur | La famille est **protestante** : on accuse le père, **Jean Calas**, d’avoir **tué son fils pour l’empêcher de se convertir** |
| Le jugement | **Sans preuve**, **sur la seule clameur publique** |
| **Mars 1762** | Jean Calas est **roué vif** et **exécuté** |
| La campagne de Voltaire | **Trois ans** : mémoires, lettres, **réseau d’influence** |
| **1765** | Le jugement est **cassé** et Calas **réhabilité** |

> **Première grande victoire de l’opinion publique en France.**

## Le livre
Publié en **1763**, il part du cas Calas — **puis élargit**.

| Ce qu’il examine | Ce qu’il démontre |
| L’**histoire des persécutions** | L’intolérance **n’a aucun fondement** |
| L’examen des **textes** | **Ni dans la raison, ni dans le droit, ni même dans l’Évangile** |

> Il s’achève sur la célèbre **Prière à Dieu** : « Fais que les **petites différences** entre les vêtements qui couvrent nos débiles corps… **ne soient pas des signaux de haine et de persécution**. »

## À retenir
Le texte **fondateur** du combat pour la **tolérance** et pour la **justice**.

> Et un **modèle d’engagement** : Voltaire y **invente le rôle de l’intellectuel** qui **prend une cause particulière pour en faire une question universelle**.

> « Écrasons l’infâme. » (formule de sa correspondance, devenue son mot d’ordre)`,
          },
          questions: [
            ['Quelle affaire judiciaire a déclenché le Traité ?', ['L’affaire Calas, à Toulouse', 'L’affaire du chevalier de La Barre', 'L’affaire Sirven', 'L’affaire du collier'], 0, 'Jean Calas fut roué vif en 1762, sans preuve.'],
            ['De quoi Jean Calas était-il accusé ?', ['D’avoir tué son fils pour l’empêcher de se convertir au catholicisme', 'De vol', 'D’hérésie', 'De complot contre le roi'], 0, 'La rumeur publique a suffi à le condamner.'],
            ['Quel fut le résultat de la campagne de Voltaire ?', ['Le jugement fut cassé en 1765 et Calas réhabilité', 'Rien ne changea', 'Voltaire fut emprisonné', 'La famille dut s’exiler définitivement'], 0, 'Première grande victoire de l’opinion publique en France.'],
            ['Sur quel texte le Traité s’achève-t-il ?', ['La Prière à Dieu', 'Une lettre au roi', 'Un poème', 'Un dialogue'], 0, 'Elle demande que les différences ne soient pas des signaux de haine.'],
            ['Que démontre le livre au-delà du cas particulier ?', ['Que l’intolérance n’a de fondement ni dans la raison, ni dans le droit, ni dans l’Évangile', 'Que la justice royale est parfaite', 'Que la religion doit être supprimée', 'Que Toulouse est fanatique'], 0, 'Le cas devient une question universelle.'],
            ['Voltaire réclame la suppression de toute religion.', ['Vrai', 'Faux'], 1, 'Il réclame la tolérance, pas l’athéisme d’État.'],
          ],
        },
        {
          titre: 'Tristan et Iseult',
          lecon: {
            titre: 'XIIe siècle — le philtre et la faute',
            cours: `## L’œuvre
Il n’existe **pas UN Tristan**, mais des **versions fragmentaires** du **XIIe siècle**.

| Version | Sa langue |
| **Béroul** et **Thomas d’Angleterre** | Français |
| **Gottfried de Strasbourg** | Allemand |
| Le *Lai du chèvrefeuille* de **Marie de France** | Français |

> Le texte qu’on lit aujourd’hui est le plus souvent la **reconstitution de Joseph Bédier** (**1900**).

## L’histoire
| Étape | Ce qui se passe |
| La mission | **Tristan**, neveu du roi **Marc** de Cornouailles, va chercher en Irlande **Iseult la Blonde**, **promise à son oncle** |
| Le **philtre** | Sur le bateau, **ils le boivent par erreur** — il était destiné aux futurs époux |
| La conséquence | Ils s’aiment d’un amour **qu’ils n’ont pas choisi** et **qu’ils ne peuvent pas quitter** |
| La fuite | Ruses, **serments ambigus**, la forêt du **Morrois** |
| La séparation | Tristan épouse **Iseult aux Blanches Mains** |
| La mort | Blessé, il attend la **voile blanche** qui annoncerait la venue d’Iseult ; **sa femme, jalouse, lui dit qu’elle est noire** |

> Il meurt ; **Iseult arrive et meurt sur son corps**. Sur leurs tombes pousse une **ronce que l’on coupe en vain**.

## À retenir
> Le **philtre** rend l’amour **irrésistible** — **et innocent**. C’est **ce qui distingue Tristan des amants coupables**.

Le récit fonde le **mythe occidental de la passion contre la loi** — **Denis de Rougemont**, *L’Amour et l’Occident*.

> « Ni vous sans moi, ni moi sans vous. »`,
          },
          questions: [
            ['Sous quelle forme le récit nous est-il parvenu ?', ['En versions fragmentaires du XIIe siècle, reconstituées ensuite', 'En un roman unique et complet', 'Uniquement par la tradition orale', 'Par une chanson de geste'], 0, 'Béroul, Thomas et Marie de France ; reconstitution de Bédier en 1900.'],
            ['Quel objet déclenche la passion ?', ['Un philtre bu par erreur sur le bateau', 'Un anneau magique', 'Une épée', 'Une lettre'], 0, 'Il était destiné au roi Marc et à Iseult.'],
            ['Quel est le rôle du philtre dans le sens du récit ?', ['Il rend l’amour irrésistible et donc innocent', 'Il punit les amants', 'Il révèle un amour déjà existant', 'Il n’a aucun effet'], 0, 'C’est ce qui distingue Tristan des amants coupables.'],
            ['Qui est Iseult aux Blanches Mains ?', ['La femme que Tristan épouse loin d’Iseult la Blonde', 'La sœur d’Iseult', 'La mère de Tristan', 'La reine d’Irlande'], 0, 'C’est elle qui ment sur la couleur de la voile.'],
            ['Comment meurent les amants ?', ['Tristan meurt en croyant Iseult absente, elle meurt sur son corps', 'Ils sont exécutés', 'Ils se noient', 'Ils meurent de vieillesse'], 0, 'Une ronce pousse sur leurs tombes.'],
            ['Le récit fonde le mythe de la passion contre la loi.', ['Vrai', 'Faux'], 0, 'Denis de Rougemont en a fait la matrice de l’amour occidental.'],
          ],
        },
        {
          titre: 'Tropismes, Nathalie Sarraute',
          lecon: {
            titre: 'Sarraute, 1939 — vingt-quatre textes qui inventent une méthode',
            cours: `## L’œuvre
**Premier livre** de **Nathalie Sarraute**, publié en **1939** et **passé totalement inaperçu**.

> **Réédité en 1957**, il devient un **texte de référence du Nouveau Roman**.

| La forme | Le détail |
| **Vingt-quatre textes brefs** | **Sans intrigue** ni personnages nommés : « **ils** », « **elle** », « **on** » |

## Les tropismes
Le mot vient de la **biologie** : **mouvements élémentaires d’un organisme vers une source de lumière ou de chaleur**.

| Ce que Sarraute y transporte | Le détail |
| Les **mouvements intérieurs infimes** | Attirance, recul, **humiliation**, méfiance |
| Leur temps | Ils se produisent **en un instant**, **sous la conversation** |
| Leur problème | **Les mots courants ne les saisissent pas** |

Chaque texte **isole un de ces mouvements** : une visite, une conversation de salon, une mère et son fils, une vitrine.

## L’écriture
| Procédé | Son effet |
| Phrases **longues**, **comparaisons développées** | Dire l’**impalpable** |
| Des **images concrètes** | Les tropismes décrits comme des **bêtes**, des **liquides**, des **insectes** |

> Il n’y a **pas d’histoire** : **le lecteur suit un tremblement**.

## À retenir
Sarraute a construit **toute son œuvre** — romans, essais (*L’Ère du soupçon*, 1956), théâtre (*Pour un oui ou pour un non*) — **sur cette découverte initiale**.

> « Ces mouvements… glissent très rapidement aux limites de notre conscience. »`,
          },
          questions: [
            ['En quelle année Tropismes a-t-il paru ?', ['1939, dans l’indifférence générale', '1957', '1926', '1968'], 0, 'La réédition de 1957 lui donnera son statut.'],
            ['Que désigne le mot « tropisme » ?', ['Un mouvement intérieur infime, sous la conversation', 'Une figure de style', 'Un type de personnage', 'Une structure narrative'], 0, 'Le mot est emprunté à la biologie.'],
            ['Que contient le livre ?', ['Vingt-quatre textes brefs sans intrigue ni personnages nommés', 'Un roman continu', 'Des poèmes', 'Un essai théorique'], 0, '« Ils », « elle », « on » remplacent les noms.'],
            ['Comment Sarraute rend-elle sensible l’impalpable ?', ['Par des images concrètes : bêtes, liquides, insectes', 'Par des définitions abstraites', 'Par des dialogues explicites', 'Par des notes de bas de page'], 0, 'La comparaison développée est son outil principal.'],
            ['À quel mouvement le livre est-il rattaché ?', ['Le Nouveau Roman', 'Le surréalisme', 'L’existentialisme', 'Le naturalisme'], 0, 'Après sa réédition, il devient un texte de référence.'],
            ['Sarraute a abandonné cette notion dans la suite de son œuvre.', ['Vrai', 'Faux'], 1, 'Toute son œuvre, romans, essais et théâtre, en découle.'],
          ],
        },
        {
          titre: 'Un Balcon en forêt, Julien Gracq',
          lecon: {
            titre: 'Gracq, 1958 — la drôle de guerre dans les Ardennes',
            cours: `## L’histoire
**Automne 1939.** L’aspirant **Grange** est affecté dans les **Ardennes**, à la tête d’une « **maison forte** » — un **blockhaus perdu dans la forêt**, avec **trois hommes**.

| Période | Ce qui s’y passe |
| La **drôle de guerre** | **Rien.** Patrouilles inutiles, attentes, promenades |
| La rencontre | **Mona**, jeune veuve du village : une liaison **hors du temps** |
| L’atmosphère | La forêt, la **neige**, le **silence** installent un **rêve éveillé** |
| **Mai 1940** | L’**offensive allemande balaie tout en quelques heures** |
| La fin | Les blindés passent, la maison forte est **encerclée**, les hommes **s’égaillent** ; blessé, **Grange revient à la maison vide**, **se couche**, et **ferme les yeux** |

## À retenir
Le grand roman de l’**attente** et du **désastre**.

| L’auteur | Ce que sa formation apporte |
| **Gracq**, **professeur d’histoire** et **géographe** | Une prose d’une **extraordinaire précision sensorielle** — **la forêt y est le vrai personnage** |

> Il avait **refusé le prix Goncourt** en **1951** pour *Le Rivage des Syrtes*, **après un pamphlet contre le milieu littéraire** — *La Littérature à l’estomac*.

> « Il lui semblait que la guerre était une longue rêverie que l’on faisait les yeux ouverts. »`,
          },
          questions: [
            ['Où et quand se déroule le roman ?', ['Dans les Ardennes, de l’automne 1939 à mai 1940', 'En Alsace, en 1914', 'En Normandie, en 1944', 'Dans les Alpes, en 1940'], 0, 'C’est la période dite de la drôle de guerre.'],
            ['Quelle est la mission de l’aspirant Grange ?', ['Commander une « maison forte » perdue dans la forêt', 'Diriger un régiment', 'Assurer la liaison radio', 'Former des recrues'], 0, 'Trois hommes seulement sont sous ses ordres.'],
            ['Qui est Mona ?', ['Une jeune veuve du village, avec qui Grange vit une liaison', 'Une infirmière militaire', 'La sœur d’un soldat', 'Une réfugiée belge'], 0, 'La liaison se déroule dans un temps suspendu.'],
            ['Que se passe-t-il en mai 1940 ?', ['L’offensive allemande balaie tout en quelques heures', 'La guerre s’arrête', 'Grange est muté', 'La maison forte résiste'], 0, 'La longue attente s’achève en désastre immédiat.'],
            ['Quel élément fonctionne comme un personnage du roman ?', ['La forêt', 'Le blockhaus seul', 'Le fleuve', 'Le village'], 0, 'Gracq était géographe de formation.'],
            ['Gracq a accepté le prix Goncourt en 1951.', ['Vrai', 'Faux'], 1, 'Il l’a refusé, après avoir publié un pamphlet contre le milieu littéraire.'],
          ],
        },
        {
          titre: 'Un Barrage contre le Pacifique, Marguerite Duras',
          lecon: {
            titre: 'Duras, 1950 — la concession incultivable',
            cours: `## L’histoire
**Indochine française**, années **1930**.

| Personnage | Sa situation |
| La **mère** | Veuve, institutrice : elle a placé **toutes ses économies** dans une **concession** achetée à l’administration coloniale |
| Le piège | **Corrompue**, celle-ci lui a vendu une terre **régulièrement envahie par la mer** |
| Sa réponse | Elle fait construire des **barrages de rondins** avec les paysans — **le Pacifique les emporte** |
| **Joseph**, vingt ans | Chasseur et **désœuvré** |
| **Suzanne**, dix-sept ans | La fille |
| **Monsieur Jo** | Riche héritier **laid et timide**, qui **convoite Suzanne** |

> La mère espère un **mariage** et un **diamant**. La bague sera **vendue**, l’argent **dilapidé**, **la mère mourra** — et **les deux enfants partiront**.

## À retenir
Roman largement **autobiographique** : Duras a **vécu cette enfance** — et y **reviendra** dans *L’Amant* (1984), sous une autre forme.

| Ce qu’il dénonce | Le détail |
| La **corruption coloniale** | La vente d’une terre incultivable |
| La **misère des paysans indochinois** | Autour de la concession |

> Le livre a **failli obtenir le Goncourt** en **1950**.

Écriture **encore classique** — mais **déjà tendue par la répétition et le ressassement**.

> « Elle avait cru qu’on pouvait faire quelque chose contre le Pacifique. »`,
          },
          questions: [
            ['Qu’a acheté la mère à l’administration coloniale ?', ['Une concession régulièrement envahie par la mer', 'Une plantation d’hévéas prospère', 'Une maison à Saigon', 'Un bateau'], 0, 'L’administration corrompue lui a vendu une terre incultivable.'],
            ['Que construit-elle avec les paysans ?', ['Des barrages de rondins contre le Pacifique', 'Une école', 'Une digue en béton', 'Un canal d’irrigation'], 0, 'La mer les emporte.'],
            ['Qui est Monsieur Jo ?', ['Un riche héritier laid et timide qui convoite Suzanne', 'Un fonctionnaire colonial', 'Le frère aîné', 'Un planteur français ami de la famille'], 0, 'La mère espère un mariage et obtient un diamant.'],
            ['Quel lien ce roman entretient-il avec L’Amant ?', ['Il raconte la même enfance sous une autre forme', 'Il en est la suite', 'Il n’a aucun rapport', 'Il en est une réécriture par un autre auteur'], 0, 'Duras reviendra sur cette matière en 1984.'],
            ['Que dénonce le roman ?', ['La corruption coloniale et la misère des paysans indochinois', 'La guerre d’Indochine', 'La politique française en Algérie', 'L’exode rural en France'], 0, 'Il a failli obtenir le Goncourt en 1950.'],
            ['L’écriture est déjà celle, très fragmentée, de L’Amant.', ['Vrai', 'Faux'], 1, 'Elle est encore classique, mais tendue par la répétition.'],
          ],
        },
        {
          titre: 'Une Saison en Enfer, Arthur Rimbaud',
          lecon: {
            titre: 'Rimbaud, 1873 — le seul livre qu’il ait publié lui-même',
            cours: `## L’œuvre
Écrit à **dix-huit ans**, **après la rupture violente avec Verlaine** — les **coups de feu de Bruxelles** —, et publié **à compte d’auteur** à Bruxelles en **1873**.

> C’est le **seul livre** que Rimbaud ait **lui-même mené à la publication**. Il **n’en retirera presque aucun exemplaire de l’imprimeur**.

## Le livre
**Neuf sections en prose.**

| Section | Ce qu’elle contient |
| « **Mauvais sang** » | L’origine, la race, la révolte |
| « **Nuit de l’enfer** » | La crise |
| « **Délires I : Vierge folle, l’Époux infernal** » | La vie commune avec **Verlaine**, **du point de vue de l’autre** |
| « **Délires II : Alchimie du verbe** » | Il **raconte et juge sa propre entreprise poétique** |
| « **Adieu** » | La sortie |

> « Je m’habituai à l’**hallucination simple**… puis j’expliquai mes **sophismes magiques** avec l’**hallucination des mots**. »

## À retenir
C’est un **bilan** — **et une rupture**.

| Ce qu’il fait | La formule |
| Il **récapitule son projet de voyant** et **en montre l’échec** | — |
| Il déclare | « **Il faut être absolument moderne.** » |
| Il conclut | « et il me sera loisible de **posséder la vérité dans une âme et un corps** » |

> Après quoi **il cessera d’écrire** : départs, Chypre, l’**Abyssinie**, le **commerce des armes** — et la mort à **trente-sept ans**.

> « Il faut être absolument moderne. »`,
          },
          questions: [
            ['Quelle particularité éditoriale ce livre présente-t-il ?', ['C’est le seul que Rimbaud ait publié lui-même', 'Il a été publié par Verlaine', 'Il est posthume', 'Il a paru en revue seulement'], 0, 'À compte d’auteur, à Bruxelles, en 1873.'],
            ['Quel épisode biographique précède l’écriture ?', ['La rupture violente avec Verlaine à Bruxelles', 'Son départ pour l’Abyssinie', 'La Commune de Paris', 'Son entrée au lycée'], 0, 'Verlaine avait tiré sur lui.'],
            ['Que fait Rimbaud dans « Alchimie du verbe » ?', ['Il raconte et juge sa propre entreprise poétique', 'Il décrit un voyage', 'Il attaque ses contemporains', 'Il traduit un texte latin'], 0, 'C’est un bilan critique de son projet de voyant.'],
            ['Quelle formule célèbre le livre contient-il ?', ['« Il faut être absolument moderne »', '« Je est un autre »', '« La beauté sera convulsive »', '« Changer la vie »'], 0, 'Elle figure dans la section « Adieu ».'],
            ['Que fait Rimbaud après ce livre ?', ['Il cesse peu à peu d’écrire et part à l’étranger', 'Il publie dix recueils', 'Il devient critique', 'Il enseigne à Paris'], 0, 'Chypre, l’Abyssinie, le commerce ; il meurt à trente-sept ans.'],
            ['« Délires I » raconte la vie commune avec Verlaine du point de vue de Rimbaud.', ['Vrai', 'Faux'], 1, 'C’est la « Vierge folle » — l’autre — qui parle de « l’Époux infernal ».'],
          ],
        },
        {
          titre: 'Une Vie, Guy de Maupassant',
          lecon: {
            titre: 'Maupassant, 1883 — « l’humble vérité »',
            cours: `## L’histoire
| Étape | Ce qui se passe |
| Le départ | **Jeanne**, fille du baron Le Perthuis des Vauds, sort du couvent **pleine de rêves** et s’installe au château des **Peuples**, en Normandie |
| Le mariage | **Julien de Lamare** : **séduisant et avare**, il la **déçoit dès le voyage de noces** |
| Les trahisons | Il la trompe avec la femme de chambre **Rosalie**, puis avec la comtesse **Gilberte de Fourville** |
| La vengeance | Le mari trompé **pousse dans un ravin la cabane où sont les amants** |
| Le report | Jeanne met tout son amour sur son fils **Paul** — **qui la ruine méthodiquement depuis Paris** |
| La fin | Vieillie et **dépossédée**, elle recueille **l’enfant de Paul** ; **Rosalie**, revenue la servir, **prononce la phrase qui clôt le roman** |

## À retenir
**Premier roman** de Maupassant, sous-titré par lui « **l’humble vérité** ».

> Roman du **désenchantement** : **rien d’extraordinaire n’arrive** — **la vie se contente d’user une femme qui n’a rien fait de mal**.

| Influence | La comparaison |
| **Flaubert**, son maître | On a souvent rapproché **Jeanne d’Emma Bovary** |
| La différence | **Jeanne ne se révolte jamais** |

> « La vie, voyez-vous, ça n’est jamais si bon ni si mauvais qu’on croit. »`,
          },
          questions: [
            ['Comment Maupassant sous-titre-t-il son roman ?', ['« L’humble vérité »', '« Mœurs de province »', '« Chronique de 1880 »', '« Scènes normandes »'], 0, 'Le programme réaliste est annoncé dès le titre.'],
            ['Qui est Julien de Lamare ?', ['Le mari séduisant et avare de Jeanne', 'Son père', 'Son fils', 'Le curé du village'], 0, 'Il la déçoit dès le voyage de noces.'],
            ['Comment meurt Julien ?', ['Le mari trompé pousse la cabane des amants dans un ravin', 'D’une maladie', 'En duel', 'Noyé'], 0, 'La scène est l’un des rares événements violents du roman.'],
            ['Que fait le fils Paul ?', ['Il ruine méthodiquement sa mère depuis Paris', 'Il devient officier', 'Il soigne sa mère', 'Il meurt jeune'], 0, 'Jeanne lui avait reporté tout son amour.'],
            ['Quelle est la phrase qui clôt le roman ?', ['« La vie, voyez-vous, ça n’est jamais si bon ni si mauvais qu’on croit »', '« Tout est perdu »', '« Il faut recommencer »', '« Ainsi va le monde »'], 0, 'Elle est prononcée par Rosalie.'],
            ['Jeanne finit par se révolter contre son sort.', ['Vrai', 'Faux'], 1, 'C’est ce qui la distingue d’Emma Bovary : elle subit sans jamais se révolter.'],
          ],
        },
        {
          titre: 'Vendredi ou les Limbes du Pacifique, Michel Tournier',
          lecon: {
            titre: 'Tournier, 1967 — Robinson retourné',
            cours: `## L’histoire
Réécriture du *Robinson Crusoé* de **Defoe**. Naufragé sur l’île de **Speranza**.

| Étape | Ce que fait Robinson |
| La première | Il **reconstitue la civilisation** : **cadastre**, **code pénal**, **calendrier**, culture du blé, **comptabilité** |
| Le résultat | **Une colonie pour lui tout seul** |
| L’arrivée de **Vendredi** | Il le traite d’abord en **esclave** et en **élève** |
| L’**explosion** | Provoquée par Vendredi, **qui fume en cachette dans la grotte aux poudres** : **tout l’ordre construit est détruit** |
| La conversion | Robinson se laisse **convertir par Vendredi** à une autre existence : **jeu, danse, contemplation, adhésion au soleil et à l’île** |
| La fin | Un navire anglais aborde : **Robinson refuse de partir** — **c’est Vendredi qui s’embarque** |

> Un **jeune mousse fugueur** reste avec Robinson, qui le nomme **Jeudi**.

## À retenir
Le renversement est **complet**.

| Chez **Defoe** | Ici |
| Le **civilisé instruit le sauvage** | Le « **sauvage** » **libère le civilisé** |

Roman **philosophique** — **Tournier était philosophe de formation** —, nourri d’**ethnologie** et de **mythes solaires**.

> Une version **pour la jeunesse**, *Vendredi ou la Vie sauvage* (**1971**), est **encore plus lue que l’original**.

> « L’autre est la pièce maîtresse de notre univers. »`,
          },
          questions: [
            ['De quel roman ce livre est-il la réécriture ?', ['Robinson Crusoé de Defoe', 'L’Île mystérieuse de Verne', 'Sa Majesté des Mouches', 'Le Voyage de Gulliver'], 0, 'Tournier en inverse le sens.'],
            ['Que fait Robinson au début de son séjour ?', ['Il reconstitue la civilisation : cadastre, code, calendrier', 'Il tente de construire un radeau', 'Il vit nu et sans règles', 'Il cherche Vendredi'], 0, 'Une colonie administrée pour lui seul.'],
            ['Qu’est-ce qui détruit cet ordre ?', ['Une explosion provoquée par Vendredi dans la grotte aux poudres', 'Un cyclone', 'Un tremblement de terre', 'Un incendie de forêt'], 0, 'Elle libère Robinson de son propre système.'],
            ['Quel est le renversement central du roman ?', ['Le « sauvage » libère le civilisé', 'Le civilisé convertit le sauvage', 'Les deux hommes s’entretuent', 'Robinson rentre en Angleterre'], 0, 'C’est l’inverse exact du roman de Defoe.'],
            ['Que fait Robinson quand un navire aborde ?', ['Il refuse de partir ; c’est Vendredi qui s’embarque', 'Il part aussitôt', 'Il cache Vendredi', 'Il attaque l’équipage'], 0, 'Un jeune mousse reste avec lui : il le nomme Jeudi.'],
            ['Il existe une version pour la jeunesse de ce roman.', ['Vrai', 'Faux'], 0, 'Vendredi ou la Vie sauvage, publiée en 1971, encore plus lue que l’original.'],
          ],
        },
        {
          titre: 'Vol de nuit, Antoine de Saint-Exupéry',
          lecon: {
            titre: 'Saint-Exupéry, 1931 — le prix du courrier',
            cours: `## L’histoire
Amérique du Sud, aux débuts de l’**Aéropostale**. **Trois courriers de nuit** convergent vers **Buenos Aires** : Patagonie, Chili, Paraguay.

| Personnage | Sa position |
| **Rivière**, directeur d’exploitation | **Dur, exigeant, refusant toute excuse** — parce qu’il sait que **la régularité de la ligne dépend d’une discipline sans faille** |
| Sa conviction | **Cette régularité seule justifiera les vies risquées** |
| **Fabien**, pilote du courrier de Patagonie | Pris dans un **cyclone** |

| La nuit de Fabien | Ce qui se passe |
| Il **monte au-dessus des nuages** | Dans un **ciel magnifique et sans issue** |
| Jusqu’à | La **panne sèche** |
| Au sol | **Sa femme téléphone, attend** |
| À l’aube | **Rivière fait partir le courrier d’Europe** : **la ligne continue** |

## À retenir
**Prix Femina 1931**, **préface d’André Gide**.

> Roman de l’**action** et du **devoir** : **Rivière n’est pas cruel** — il **assume la question tragique** de savoir **ce qui vaut d’être payé d’une vie**.

| Le style | Le détail |
| Il mêle le **récit technique** et une prose **presque mystique** | Les nuages, les étoiles, la nuit |

Saint-Exupéry écrivait **d’expérience** : **il était pilote de ligne**.

> « Nous demandons d’être éternels, et nous ne le sommes pas. »`,
          },
          questions: [
            ['Où se déroule le roman ?', ['En Amérique du Sud, aux débuts de l’Aéropostale', 'En Afrique du Nord', 'En France', 'Aux États-Unis'], 0, 'Trois courriers de nuit convergent vers Buenos Aires.'],
            ['Qui est Rivière ?', ['Le directeur d’exploitation, exigeant et inflexible', 'Un pilote', 'Un mécanicien', 'Le mari de la femme qui attend'], 0, 'Sa dureté a pour but la régularité de la ligne.'],
            ['Qu’arrive-t-il à Fabien ?', ['Il est pris dans un cyclone et disparaît', 'Il atterrit en catastrophe', 'Il abandonne son poste', 'Il est sauvé au dernier moment'], 0, 'Il monte au-dessus des nuages jusqu’à la panne sèche.'],
            ['Que fait Rivière à l’aube ?', ['Il fait partir le courrier d’Europe', 'Il démissionne', 'Il organise les recherches', 'Il annonce la nouvelle à la presse'], 0, 'La ligne continue : c’est la réponse du roman.'],
            ['Quel prix le roman a-t-il obtenu ?', ['Le prix Femina 1931', 'Le Goncourt', 'Le Renaudot', 'Le grand prix de l’Académie'], 0, 'Avec une préface d’André Gide.'],
            ['Saint-Exupéry écrivait sans connaître le métier de pilote.', ['Vrai', 'Faux'], 1, 'Il était pilote de ligne : le livre naît de son expérience.'],
          ],
        },
        {
          titre: 'Voyage au bout de la nuit, Louis-Ferdinand Céline',
          lecon: {
            titre: 'Céline, 1932 — la langue parlée entre en littérature',
            cours: `## L’histoire
| Étape | Ce que Bardamu y découvre |
| **1914** | Il s’engage **sur un coup de tête** — et découvre l’**horreur absurde de la guerre** |
| L’**Afrique** coloniale | Chaleur, fièvre, **exploitation** |
| Les **États-Unis** | **Ford à Détroit**, le **travail à la chaîne**, New York |
| **Rancy** | Il exerce la médecine dans la **banlieue misérable** |

> Partout le suit **Robinson**, **double sombre et fascinant** — **assassiné par sa fiancée Madelon**.

## Ce qui a changé la littérature
| Ce que Céline fait entrer dans le roman | Où |
| Le français **parlé**, l’**argot** | **Non pas dans les dialogues seulement** |
| Les **ellipses**, le rythme **haché**, les **points de suspension**, la syntaxe **orale** | Mais dans la **narration elle-même** |

> C’est une **révolution comparable à celle de Rabelais**.

## À retenir
**Prix Renaudot 1932** — il **rate le Goncourt de peu**.

> **Pessimisme radical** : la guerre, le colonialisme, l’usine, la misère sont **les visages d’un même mensonge**.

| À savoir | Le détail |
| À partir de **1937** | Céline publie des **pamphlets antisémites d’une violence extrême** |
| Aujourd’hui | Ils font l’objet d’une **condamnation unanime** et **rendent son cas indissociable de cette question** |

> L’œuvre romanesque **se lit sans jamais l’ignorer**.

> « Voyager, c’est bien utile, ça fait travailler l’imagination. »`,
          },
          questions: [
            ['Quelles étapes le voyage de Bardamu comporte-t-il ?', ['La guerre, l’Afrique coloniale, les États-Unis, la banlieue parisienne', 'L’Espagne, l’Italie, la Grèce', 'La Russie et la Chine', 'Uniquement Paris'], 0, 'Chaque étape révèle un visage du même mensonge.'],
            ['Quelle révolution le roman apporte-t-il ?', ['La langue parlée entre dans la narration elle-même', 'Le retour au récit classique', 'La suppression des dialogues', 'L’usage du présent de narration'], 0, 'Argot, ellipses, rythme haché, points de suspension.'],
            ['Qui est Robinson ?', ['Le double sombre qui suit Bardamu partout', 'Son frère', 'Son médecin', 'Un officier'], 0, 'Il finit assassiné par sa fiancée Madelon.'],
            ['Quel prix le roman a-t-il obtenu ?', ['Le prix Renaudot 1932', 'Le Goncourt', 'Le Femina', 'Aucun'], 0, 'Il rate le Goncourt de peu.'],
            ['Que faut-il savoir de l’auteur ?', ['Il a publié à partir de 1937 des pamphlets antisémites d’une extrême violence', 'Il a été résistant', 'Il a cessé d’écrire après 1932', 'Il a émigré aux États-Unis'], 0, 'Sa condamnation est aujourd’hui unanime, et son cas indissociable de cette question.'],
            ['La langue parlée n’apparaît que dans les dialogues du roman.', ['Vrai', 'Faux'], 1, 'Elle envahit la narration : c’est précisément ce qui fait la rupture.'],
          ],
        },
        {
          titre: 'Voyage au centre de la Terre, Jules Verne',
          lecon: {
            titre: 'Verne, 1864 — descendre par un volcan',
            cours: `## L’histoire
| Étape | Ce qui se passe |
| La découverte | À Hambourg, le professeur **Otto Lidenbrock** trouve dans un manuscrit islandais un **cryptogramme** signé de l’alchimiste **Arne Saknussemm** |
| Le message | Il indique un **passage vers le centre de la Terre** par le cratère du volcan **Sneffels**, en **Islande** |
| Le déchiffrement | Son neveu **Axel**, le narrateur, le **déchiffre** — **et le regrette aussitôt** |
| La descente | Avec le guide islandais **Hans** : galeries, **soif**, **égarement** |

| Ce qu’ils découvrent | Le détail |
| Un immense **océan souterrain** | Éclairé d’une **lumière électrique** |
| Une **forêt de champignons géants** | Et des ossements |
| Un **combat entre monstres marins préhistoriques** | Et la vision d’un **berger géant** |

> Une **éruption les remonte** finalement à la surface — **par le Stromboli**, en Italie.

## À retenir
L’un des premiers **Voyages extraordinaires**.

| Ce que Verne met en scène | La formule d’Hetzel |
| Les sciences de son temps : **géologie**, **paléontologie**, **minéralogie** | **Instruire en amusant** |

| Le trio | Son rôle |
| Le **savant impatient** | Lidenbrock |
| Le **neveu peureux** | Axel |
| Le **guide impassible** | Hans |

> Le motif de la **descente** a nourri **toute la science-fiction et le cinéma**.

> « Descends dans le cratère du Yocul de Sneffels… audacieux voyageur, et tu parviendras au centre de la Terre. »`,
          },
          questions: [
            ['Comment le voyage est-il décidé ?', ['Un cryptogramme trouvé dans un vieux livre islandais', 'Une carte achetée à Hambourg', 'Un rêve du professeur', 'Une lettre anonyme'], 0, 'Il est signé de l’alchimiste Arne Saknussemm.'],
            ['Par où les explorateurs descendent-ils ?', ['Le cratère du Sneffels, en Islande', 'Une mine allemande', 'Le Vésuve', 'Une grotte des Alpes'], 0, 'Ils ressortiront par le Stromboli.'],
            ['Qui est Hans ?', ['Le guide islandais, impassible et efficace', 'Le neveu du professeur', 'Un savant rival', 'Un marin norvégien'], 0, 'Le trio associe le savant, le peureux et le guide.'],
            ['Que découvrent-ils au plus profond ?', ['Un océan souterrain avec des monstres préhistoriques', 'Une cité perdue', 'Un gisement d’or', 'Rien : ils rebroussent chemin'], 0, 'Verne y met en scène la paléontologie de son temps.'],
            ['Comment remontent-ils à la surface ?', ['Portés par une éruption volcanique', 'Par le même chemin', 'Par un puits de mine', 'Par un tunnel marin'], 0, 'Ils émergent au Stromboli, en Italie.'],
            ['Le roman ne contient aucun contenu scientifique.', ['Vrai', 'Faux'], 1, 'Géologie, minéralogie et paléontologie y tiennent une grande place : instruire en amusant.'],
          ],
        },
        {
          titre: 'Zadig ou la Destinée, Voltaire',
          lecon: {
            titre: 'Voltaire, 1747 — la providence en question',
            cours: `## L’histoire
**Zadig**, jeune Babylonien **sage, riche et vertueux**, subit une **succession d’injustices** : trahisons amoureuses, procès absurdes, jalousies de cour.

| Épisode | Ce qu’il montre |
| Le **chien et le cheval** | Il les **décrit sans les avoir vus**, d’après leurs **traces** — et est **aussitôt accusé de vol** |
| Sa portée | Page fameuse, souvent citée comme un **ancêtre du raisonnement policier** |

> **Sa sagacité lui vaut d’abord des ennuis.**

| Étape | Ce qui se passe |
| L’ascension | Il devient **premier ministre** et aime la reine **Astarté** |
| La chute | Il doit **fuir**, est **réduit en esclavage** |
| Le retour | Il **arbitre des querelles religieuses**, **retrouve le trône et la reine** |
| L’ermite **Jesrad** | Ange déguisé : il commet **sous ses yeux des actes apparemment monstrueux** |
| Son explication | **Chaque mal engendre un bien dans l’ordre général** |

## À retenir
**Conte philosophique** sur la **providence** et le **mal**.

| Où en est Voltaire | Ce qui suivra |
| Encore **proche de l’optimisme de Leibniz** | Il le **démolira douze ans plus tard** dans *Candide* — **après le tremblement de terre de Lisbonne** |

Ironie, **rythme rapide**, satire de la **justice**, des **courtisans** et des **querelles religieuses**.

> « Il n’y a point de mal dont il ne naisse un bien. »`,
          },
          questions: [
            ['Que vaut à Zadig sa fameuse description du chien et du cheval ?', ['Une accusation de vol', 'Une récompense royale', 'Un poste de juge', 'L’exil immédiat'], 0, 'La page est souvent citée comme un ancêtre du raisonnement policier.'],
            ['Qui est Jesrad ?', ['Un ermite qui se révèle être un ange', 'Le roi de Babylone', 'Un juge corrompu', 'Le rival de Zadig'], 0, 'Il explique que chaque mal engendre un bien.'],
            ['Quelle question philosophique le conte pose-t-il ?', ['Celle de la providence et de l’existence du mal', 'Celle de la liberté politique', 'Celle de la propriété', 'Celle de l’éducation'], 0, 'Voltaire y est encore proche de l’optimisme leibnizien.'],
            ['Quel conte viendra contredire cette position ?', ['Candide, en 1759', 'L’Ingénu', 'Micromégas', 'Le Taureau blanc'], 0, 'Après le tremblement de terre de Lisbonne.'],
            ['Que vise la satire de Zadig ?', ['La justice, les courtisans et les querelles religieuses', 'Le commerce', 'L’armée', 'La médecine'], 0, 'Babylone est un décor transparent pour la France.'],
            ['Zadig finit ruiné et exilé.', ['Vrai', 'Faux'], 1, 'Il retrouve le trône et la reine Astarté à la fin du conte.'],
          ],
        },
        {
          titre: 'Zazie dans le métro, Raymond Queneau',
          lecon: {
            titre: 'Queneau, 1959 — « Doukipudonktan »',
            cours: `## L’histoire
**Zazie**, gamine de province **délurée et insolente**, débarque à Paris pour **deux jours** chez son oncle **Gabriel**, **danseur de charme** dans un cabaret.

| Son unique désir | L’obstacle |
| Prendre le **métro** | **Le métro est en grève** |

| Personnage ou épisode | Le détail |
| La **veuve Mouaque** | La compagne de route |
| Le perroquet **Laverdure** | Il répète : « **Tu causes, tu causes, c’est tout ce que tu sais faire** » |
| **Trouscaillon** | Il **change sans cesse d’identité et de fonction** |
| La brasserie | Une **bagarre générale** |
| Le fiacre | Une virée dans Paris |

> À la fin, **endormie**, Zazie est ramenée à sa mère. À la question « qu’est-ce que tu as fait ? », elle répond : « **J’ai vieilli.** »

## À retenir
Le livre est célèbre par sa **langue**.

| Ce que Queneau fait | L’exemple |
| Il **écrit le français parlé** en le **transcrivant phonétiquement** | Le premier mot du roman : « **Doukipudonktan** » — « D’où qu’ils puent donc tant ? » |

Membre fondateur de l’**Oulipo**, il y mêle **jeux de mots**, **parodies**, **ruptures de registre** et **clins d’œil littéraires**.

> Adapté au cinéma par **Louis Malle** en **1960**.

> « Doukipudonktan. »`,
          },
          questions: [
            ['Que veut absolument faire Zazie à Paris ?', ['Prendre le métro', 'Voir la tour Eiffel', 'Rencontrer son père', 'Aller au cinéma'], 0, 'Le métro est justement en grève.'],
            ['Quel est le premier mot du roman ?', ['« Doukipudonktan »', '« Zazie »', '« Paris »', '« Alors »'], 0, 'Transcription phonétique de « D’où qu’ils puent donc tant ? ».'],
            ['Quel est le métier de l’oncle Gabriel ?', ['Danseur de charme dans un cabaret', 'Chauffeur de taxi', 'Professeur', 'Cuisinier'], 0, 'Il héberge Zazie pendant deux jours.'],
            ['Que répète le perroquet Laverdure ?', ['« Tu causes, tu causes, c’est tout ce que tu sais faire »', '« Doukipudonktan »', '« Zazie, Zazie »', '« Le métro, le métro »'], 0, 'Le leitmotiv ponctue tout le roman.'],
            ['Que répond Zazie à la fin, sur ce qu’elle a fait ?', ['« J’ai vieilli »', '« J’ai pris le métro »', '« Rien du tout »', '« Je me suis amusée »'], 0, 'La chute est célèbre.'],
            ['Queneau était membre fondateur de l’Oulipo.', ['Vrai', 'Faux'], 0, 'L’Ouvroir de littérature potentielle, fondé en 1960 avec François Le Lionnais.'],
          ],
        },
      ],
    },
  ],
}
