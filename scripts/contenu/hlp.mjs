// HLP — Humanités, littérature et philosophie (spécialité 1re et Tle).
// Programme officiel : 1re — « Les pouvoirs de la parole » et « Les
// représentations du monde » ; Tle — « La recherche de soi » et « L'Humanité
// en question ».

export default {
  slug: 'hlp',
  nom: 'HLP',
  blocs: [
    {
      niveaux: ['1re'],
      chapitres: [
        {
          titre: 'Les pouvoirs de la parole',
          lecon: {
            titre: 'Convaincre, persuader, manipuler',
            cours: `La parole n'est pas seulement un moyen d'exprimer une pensée : elle agit sur autrui.

## Les trois moyens de la rhétorique
Aristote distingue le **logos** (l'argument, la raison), l'**ethos** (l'image que l'orateur donne de lui) et le **pathos** (l'émotion suscitée). Un discours efficace mobilise les trois — et c'est précisément pourquoi il peut être suspect.

## Convaincre ou persuader
**Convaincre** s'adresse à la raison par la démonstration ; **persuader** s'adresse à la sensibilité. Pascal soulignait que l'homme se laisse mener autant par l'imagination et l'habitude que par la preuve.

## La méfiance philosophique
Platon oppose le **philosophe**, qui cherche la vérité, au **sophiste**, qui enseigne à avoir raison. Dans le *Gorgias*, la rhétorique est comparée à la cuisine : elle flatte au lieu de soigner. La question traverse toute l'histoire : une parole efficace est-elle une parole vraie ?

## L'éloquence en actes
Discours politiques, plaidoiries, sermons, tribunes, publicité, réseaux sociaux : chaque époque a ses formes. Analyser un discours, c'est repérer sa structure, ses figures (métaphore, anaphore, gradation, question rhétorique) et l'effet visé.`,
          },
          questions: [
            ['Que désigne l’ethos dans la rhétorique aristotélicienne ?', ['L’image que l’orateur donne de lui-même', 'L’argument rationnel', 'L’émotion du public', 'Le style du discours'], 0, 'Logos, ethos, pathos forment les trois leviers.'],
            ['Convaincre s’adresse à la raison, persuader à la sensibilité.', ['Vrai', 'Faux'], 0, 'La distinction est classique depuis la rhétorique antique.'],
            ['Dans le *Gorgias*, Platon compare la rhétorique à…', ['La cuisine, qui flatte au lieu de soigner', 'La médecine', 'La géométrie', 'La musique'], 0, 'Elle procure du plaisir sans procurer le bien.'],
            ['Le sophiste, selon Platon, cherche avant tout…', ['À avoir raison', 'À dire le vrai', 'À se taire', 'À enseigner la géométrie'], 0, 'D’où l’opposition avec le philosophe.'],
            ['L’anaphore consiste à répéter un mot en début de phrases successives.', ['Vrai', 'Faux'], 0, 'C’est une figure d’insistance très utilisée en éloquence politique.'],
            ['Le pathos désigne…', ['L’émotion suscitée chez l’auditoire', 'La logique du raisonnement', 'L’autorité de l’orateur', 'Le lieu du discours'], 0, 'Il peut servir la vérité comme la manipulation.'],
            ['Une parole efficace est nécessairement une parole vraie.', ['Vrai', 'Faux'], 1, 'C’est précisément le problème que pose la rhétorique.'],
            ['Selon Pascal, l’homme est mené uniquement par la raison.', ['Vrai', 'Faux'], 1, 'Il insiste au contraire sur le rôle de l’imagination et de la coutume.'],
          ],
        },
        {
          titre: 'Les représentations du monde',
          lecon: {
            titre: 'Découvrir, décrire, inventer le monde',
            cours: `À partir de la Renaissance, le monde cesse d'être un livre déjà écrit : il devient un objet à explorer.

## La découverte et le choc de l'autre
Les grandes découvertes confrontent l'Europe à des sociétés inconnues. **Montaigne**, dans « Des cannibales » (*Essais*, 1580), retourne le regard : « chacun appelle barbarie ce qui n'est pas de son usage ». C'est l'acte de naissance du **relativisme culturel**.

## La science et le regard neuf
Copernic, Galilée, Descartes : le monde devient mesurable. La nature n'est plus un texte symbolique à déchiffrer mais un ensemble de lois. Descartes veut rendre l'homme « comme maître et possesseur de la nature ».

## L'utopie
Thomas More invente le mot en 1516 : *ou-topos*, le lieu de nulle part. L'utopie décrit une société parfaite pour mieux critiquer la sienne. La **dystopie** (Orwell, Huxley) en est le versant sombre au XXe siècle.

## Le regard sur soi par le détour
Montesquieu (*Lettres persanes*, 1721), Voltaire, Diderot utilisent le regard étranger pour dénaturaliser les évidences françaises. Décrire le monde, c'est toujours aussi se décrire.`,
          },
          questions: [
            ['Qui écrit « chacun appelle barbarie ce qui n’est pas de son usage » ?', ['Montaigne', 'Montesquieu', 'Voltaire', 'Rousseau'], 0, 'Dans le chapitre « Des cannibales » des *Essais*.'],
            ['Qui a inventé le mot « utopie » ?', ['Thomas More', 'Platon', 'Rabelais', 'Orwell'], 0, 'En 1516, à partir du grec : le lieu de nulle part.'],
            ['Une dystopie décrit une société idéale.', ['Vrai', 'Faux'], 1, 'C’est le contraire : une société cauchemardesque, souvent née d’une utopie.'],
            ['Dans les *Lettres persanes*, Montesquieu utilise…', ['Le regard étranger pour critiquer la société française', 'Un récit de voyage authentique', 'Un traité scientifique', 'Une tragédie'], 0, 'Le détour rend visible ce qui passait pour naturel.'],
            ['Descartes veut rendre l’homme « comme maître et possesseur de la nature ».', ['Vrai', 'Faux'], 0, 'Formule du *Discours de la méthode* (1637).'],
            ['Le relativisme culturel consiste à…', ['Juger une culture selon ses propres critères', 'Classer les cultures', 'Refuser toute culture', 'Imposer une culture'], 0, 'Il naît du choc des grandes découvertes.'],
            ['La révolution scientifique fait de la nature un ensemble de lois mesurables.', ['Vrai', 'Faux'], 0, 'Elle cesse d’être un texte symbolique à déchiffrer.'],
            ['*1984* d’Orwell relève…', ['De la dystopie', 'De l’utopie', 'De l’essai', 'De l’autobiographie'], 0, 'Publié en 1949, il décrit un totalitarisme achevé.'],
          ],
        },
        {
          titre: 'Lire, analyser, écrire',
          lecon: {
            titre: 'Les deux exercices de la spécialité',
            cours: `L'épreuve de HLP repose sur deux exercices complémentaires, à ne surtout pas confondre.

## L'interprétation littéraire
Elle part **du texte**. On repère la situation d'énonciation, le mouvement du texte, les procédés (lexique, syntaxe, images, rythme) et on montre comment la forme **produit** le sens. Une interprétation ne raconte pas le texte : elle explique ce qu'il fait au lecteur, et par quels moyens.

## L'essai philosophique
Il part **d'une question**. On problématise (pourquoi la réponse évidente ne suffit-elle pas ?), on argumente en plusieurs étapes, on convoque des exemples précis et des références. Un essai n'est pas une opinion : c'est un raisonnement qui accepte l'objection.

## Le geste commun
Les deux exercices exigent la même chose : ne jamais rester au niveau de l'affirmation générale. « L'auteur critique la société » ne vaut rien sans le mot du texte qui le montre.

## La méthode de travail
Lire crayon en main, noter les mots qui résistent, formuler une question plutôt qu'un thème, construire un plan qui **progresse** au lieu de juxtaposer. Une bonne copie se reconnaît à ce que la troisième partie ne pouvait pas être écrite avant la première.`,
          },
          questions: [
            ['L’interprétation littéraire part…', ['Du texte lui-même', 'D’une question générale', 'D’une opinion personnelle', 'D’une biographie'], 0, 'C’est l’exercice ancré dans les procédés du texte.'],
            ['Un essai philosophique est une opinion personnelle argumentée librement.', ['Vrai', 'Faux'], 1, 'C’est un raisonnement problématisé, qui affronte les objections.'],
            ['Problématiser consiste à…', ['Montrer pourquoi la réponse évidente ne suffit pas', 'Poser un thème', 'Résumer le cours', 'Donner un exemple'], 0, 'Sans tension, il n’y a pas de problème philosophique.'],
            ['Une interprétation littéraire doit montrer comment la forme produit le sens.', ['Vrai', 'Faux'], 0, 'Sinon, elle se réduit à une paraphrase.'],
            ['Que doit accompagner l’affirmation « l’auteur critique la société » ?', ['Un élément précis du texte qui le montre', 'Une citation d’un autre auteur', 'Une date', 'Un résumé de l’œuvre'], 0, 'Sans preuve textuelle, l’affirmation reste creuse.'],
            ['Un bon plan juxtapose des parties indépendantes.', ['Vrai', 'Faux'], 1, 'Il doit progresser : la dernière partie dépend des précédentes.'],
            ['Paraphraser un texte, c’est…', ['Le redire autrement sans l’expliquer', 'L’analyser', 'Le critiquer', 'Le citer'], 0, 'C’est le défaut le plus fréquent en interprétation.'],
            ['Formuler une question vaut mieux que poser un thème.', ['Vrai', 'Faux'], 0, 'Une question oriente le raisonnement ; un thème ne dit rien.'],
          ],
        },
      ],
    },
    {
      niveaux: ['Tle'],
      chapitres: [
        {
          titre: 'La recherche de soi',
          lecon: {
            titre: 'Éducation, sensibilité, métamorphoses du moi',
            cours: `Le moi n'est pas un donné : il se forme, se raconte et se transforme.

## L'éducation et la formation
Rousseau (*Émile*, 1762) veut une éducation qui suive la nature de l'enfant plutôt que les conventions. Le roman d'apprentissage met en scène cette formation : le héros se construit en se heurtant au monde.

## La connaissance de soi
« Connais-toi toi-même » : la maxime delphique reprise par Socrate. Mais l'introspection est-elle fiable ? **Freud** montre que le moi n'est « pas maître dans sa propre maison » : l'inconscient agit en nous sans nous.

## L'écriture de soi
Les *Confessions* de saint Augustin, puis celles de **Rousseau**, inaugurent l'autobiographie moderne. Se raconter, c'est aussi se construire : le récit sélectionne, ordonne, justifie. D'où la question — l'autobiographie dit-elle le moi ou le fabrique-t-elle ?

## Le moi et les autres
On ne se découvre pas seul. Hegel montre que la conscience de soi passe par la **reconnaissance** d'autrui ; Sartre, que le regard de l'autre me fige en objet. Le moi est un rapport, pas une substance.`,
          },
          questions: [
            ['Qui écrit *Émile ou De l’éducation* ?', ['Rousseau', 'Montaigne', 'Voltaire', 'Diderot'], 0, 'Publié en 1762.'],
            ['Selon Freud, le moi n’est pas « maître dans sa propre maison ».', ['Vrai', 'Faux'], 0, 'L’inconscient agit sans que la conscience le sache.'],
            ['« Connais-toi toi-même » est une maxime…', ['Inscrite au temple de Delphes et reprise par Socrate', 'De Descartes', 'De Freud', 'De Rousseau'], 0, 'Elle ouvre la tradition de l’examen de soi.'],
            ['L’autobiographie restitue fidèlement le moi tel qu’il est.', ['Vrai', 'Faux'], 1, 'Le récit sélectionne et ordonne : il construit autant qu’il restitue.'],
            ['Qui a inauguré l’écriture de soi avec les *Confessions* au IVe siècle ?', ['Saint Augustin', 'Rousseau', 'Montaigne', 'Pascal'], 0, 'Rousseau reprendra le titre au XVIIIe siècle.'],
            ['Selon Hegel, la conscience de soi passe par la reconnaissance d’autrui.', ['Vrai', 'Faux'], 0, 'La dialectique du maître et de l’esclave en est l’expression.'],
            ['Pour Sartre, le regard d’autrui…', ['Me fige en objet', 'Me libère toujours', 'M’est indifférent', 'Me révèle ma nature'], 0, 'D’où la formule « l’enfer, c’est les autres ».'],
            ['Le roman d’apprentissage met en scène la formation d’un personnage.', ['Vrai', 'Faux'], 0, 'Le héros se construit en se heurtant au monde.'],
          ],
        },
        {
          titre: 'L’Humanité en question',
          lecon: {
            titre: 'Nature, technique et limites de l’humain',
            cours: `Ce que nous appelons « l'humain » a une histoire — et peut-être une fin.

## Nature et culture
Y a-t-il une nature humaine ? Lévi-Strauss propose un critère : est **naturel** ce qui est universel, **culturel** ce qui varie selon les sociétés. La prohibition de l'inceste, à la fois universelle et réglée, brouille précisément la frontière.

## L'humanisme et ses procès
L'humanisme place l'homme au centre. Le XXe siècle en fait le procès : la Shoah montre que la culture et la technique n'empêchent pas la barbarie. **Levi**, **Arendt** interrogent la « banalité du mal » — le crime commis par des hommes ordinaires, dans un système obéissant.

## La technique
De Prométhée aux biotechnologies, la technique augmente le pouvoir de l'homme sur lui-même. **Hans Jonas** formule un principe responsabilité : agir de telle sorte que les effets de l'action soient compatibles avec la permanence d'une vie humaine authentique.

## Le transhumanisme
Augmenter l'humain (génétique, prothèses, intelligence artificielle) pose une question que la philosophie n'esquive plus : ce qui définit l'humain est-il sa perfectibilité ou sa **finitude** ?`,
          },
          questions: [
            ['Quel critère Lévi-Strauss propose-t-il pour distinguer nature et culture ?', ['L’universel relève de la nature, le variable de la culture', 'L’ancien contre le moderne', 'Le corps contre l’esprit', 'L’individu contre le groupe'], 0, 'La prohibition de l’inceste met ce critère en difficulté.'],
            ['Hannah Arendt a analysé la « banalité du mal ».', ['Vrai', 'Faux'], 0, 'À propos du procès Eichmann, en 1961.'],
            ['Qui formule le « principe responsabilité » face à la technique ?', ['Hans Jonas', 'Karl Marx', 'Michel Foucault', 'Jean-Paul Sartre'], 0, 'Il l’oriente vers les générations futures.'],
            ['La culture garantit contre la barbarie.', ['Vrai', 'Faux'], 1, 'Le XXe siècle a montré le contraire, ce qui met l’humanisme en procès.'],
            ['Le transhumanisme interroge…', ['La possibilité d’augmenter techniquement l’humain', 'Le retour à la nature', 'La fin des sciences', 'L’origine des espèces'], 0, 'Génétique, prothèses, IA : la finitude devient un problème technique.'],
            ['Primo Levi a témoigné de l’expérience concentrationnaire.', ['Vrai', 'Faux'], 0, 'Notamment dans *Si c’est un homme*.'],
            ['La prohibition de l’inceste est intéressante parce qu’elle est…', ['À la fois universelle et culturellement réglée', 'Purement biologique', 'Récente', 'Propre à l’Occident'], 0, 'Elle se tient exactement à la charnière nature/culture.'],
            ['L’humanisme place l’homme au centre de la réflexion.', ['Vrai', 'Faux'], 0, 'C’est ce geste que le XXe siècle interroge.'],
          ],
        },
        {
          titre: 'Méthode de l’épreuve',
          lecon: {
            titre: 'Réussir interprétation et essai au bac',
            cours: `L'épreuve de terminale dure 4 heures et comporte deux exercices notés sur 10 chacun, à partir d'un même texte.

## L'interprétation littéraire
Une question porte sur le texte. On répond en **construisant** : une thèse claire, deux ou trois mouvements, des citations courtes et exactes, et à chaque fois l'articulation entre le procédé relevé et l'effet produit.

## L'essai philosophique
Une question, liée au thème du texte mais plus large. Structure attendue : problématisation, développement en parties argumentées, exemples choisis (littéraires, historiques, scientifiques, personnels s'ils sont précis), conclusion qui répond vraiment.

## Les erreurs qui coûtent le plus
Paraphraser au lieu d'analyser. Réciter un cours sans répondre à la question posée. Accumuler des références sans les faire travailler. Annoncer un plan qu'on ne suit pas.

## La gestion du temps
Environ 2 heures par exercice, dont 20 minutes de préparation à chaque fois. Relire 10 minutes à la fin : les fautes de syntaxe et les citations approximatives pèsent lourd sur une copie qui, sur le fond, se tenait.`,
          },
          questions: [
            ['Combien de temps dure l’épreuve de HLP en terminale ?', ['4 heures', '2 heures', '3 heures', '5 heures'], 0, 'Deux exercices notés sur 10 chacun.'],
            ['Les deux exercices portent sur un même texte.', ['Vrai', 'Faux'], 0, 'L’essai élargit la question soulevée par le texte.'],
            ['Quelle est l’erreur la plus fréquente en interprétation littéraire ?', ['La paraphrase', 'L’excès de citations', 'Le plan en trois parties', 'L’introduction trop courte'], 0, 'Redire le texte n’est pas l’analyser.'],
            ['Réciter le cours sans répondre à la question est valorisé.', ['Vrai', 'Faux'], 1, 'C’est le hors-sujet le plus courant, et le plus sanctionné.'],
            ['Un exemple personnel est acceptable dans l’essai…', ['S’il est précis et sert l’argument', 'Jamais', 'Toujours', 'Seulement en conclusion'], 0, 'C’est sa précision qui le rend recevable.'],
            ['Combien de temps consacrer environ à chaque exercice ?', ['2 heures', '1 heure', '3 heures', '30 minutes'], 0, 'Dont une vingtaine de minutes de préparation.'],
            ['Une citation doit être courte et exacte.', ['Vrai', 'Faux'], 0, 'Une citation approximative décrédibilise toute l’analyse.'],
            ['La conclusion d’un essai doit…', ['Répondre effectivement à la question posée', 'Ouvrir sur un autre sujet', 'Résumer le texte', 'Citer un nouvel auteur'], 0, 'Une conclusion qui esquive annule le bénéfice du développement.'],
          ],
        },
      ],
    },
  ],
}
