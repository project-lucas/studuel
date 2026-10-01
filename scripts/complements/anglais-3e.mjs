// Anglais 3e — QUESTIONS EN PLUS : quatre questions de plus par quiz.
//
// Elles portent sur des notions du cours que les huit questions existantes ne
// testaient pas encore (formes, emplois, pièges), au niveau A2-B1 : textes à
// trous, choix de la bonne forme, traduction courte, repérage d’erreur.

// Un texte à trous porte un 5e élément, sa CLÉ D’ORIGINE (cf. seed-contenu) :
// l’énoncé sous lequel la question est semée, pour qu’une reformulation
// ultérieure ne déplace pas son identifiant.
const trou = (texte, options, bonne, explication) => [
  texte,
  options,
  bonne,
  explication,
  `Quel mot complète la phrase ? ${texte.replace('___', '…')}`,
]

export default {
  slug: 'anglais',
  titreMigration: 'QUESTIONS EN PLUS — ANGLAIS 3e',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: '3e',
      titre: 'Les noms',
      questions: [
        ['Quel est le pluriel de « tooth » ?', ['tooths', 'teeth', 'teeths', 'toothes'], 1, '« Tooth » fait partie des pluriels irréguliers, comme foot → feet : on change la voyelle au lieu d’ajouter -s.'],
        trou('There are three ___ in the field.', ['sheep', 'sheeps', 'sheepes', 'sheepies'], 0, '« Sheep », comme fish et deer, est inchangé au pluriel : one sheep, three sheep.'),
        ['Quel est le pluriel de « box » ?', ['boxs', 'boxies', 'boxes', 'boxen'], 2, 'Après -s, -sh, -ch, -x ou -o, le pluriel se forme en -es : boxes, watches, potatoes.'],
        ['Quel est le pluriel de « boy » ?', ['boies', 'boyes', 'boyies', 'boys'], 3, 'Le -y ne devient -ies qu’après une consonne (city → cities) ; après une voyelle, on ajoute simplement -s.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Les articles définis et les articles indéfinis',
      questions: [
        ['Comment traduit-on « Elle parle anglais » ?', ['She speaks English.', 'She speaks the English.', 'She speaks an English.', 'She speaks the english.'], 0, 'Les langues, comme les pays et les villes, s’emploient sans article (et avec une majuscule).'],
        trou('Look at ___ moon tonight!', ['a', 'the', 'an', 'some'], 1, 'Un objet unique prend toujours « the » : the sun, the moon.'),
        ['Quelle phrase est correcte ?', ['We have the lunch at noon.', 'We have a lunch at the noon.', 'We have lunch at noon.', 'We have some lunch at the noon.'], 2, 'Les repas s’emploient sans article : have lunch, for breakfast.'],
        trou('I bought a car last week. ___ car is red.', ['A', 'An', 'Some', 'The'], 3, 'La voiture est déjà mentionnée : on passe de « a » (non identifié) à « the » (connu).'),
      ],
    },
    {
      niveau: '3e',
      titre: 'Les adjectifs démonstratifs',
      questions: [
        ['Quelle est la seule différence audible entre « this » et « these » ?', ['La consonne finale', 'La voyelle : [ɪ] court contre [iː] long', 'L’accent tonique', 'Aucune, ils se prononcent pareil'], 1, 'This se dit avec un [ɪ] bref, these avec un [iː] long : c’est ce qui distingue le singulier du pluriel à l’oral.'],
        trou('I still remember ___ summer we spent in Spain, years ago.', ['this', 'these', 'that', 'those'], 2, 'La distance peut être dans le temps : « that » pour un moment passé et singulier.'),
        ['Dans « I prefer these. », quelle est la nature de « these » ?', ['Un adjectif démonstratif', 'Un pronom démonstratif', 'Un article', 'Un pronom personnel'], 1, 'Employé seul, sans nom derrière lui, le démonstratif est un pronom.'],
        ['Comment présente-t-on sa sœur à quelqu’un ?', ['These is my sister, Kate.', 'Those is my sister, Kate.', 'It’s my sister, Kate, this.', 'This is my sister, Kate.'], 3, 'Pour présenter quelqu’un, l’anglais emploie « This is… », là où le français dit « Voici… » ou « C’est… ».'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Exprimer la possession',
      questions: [
        ['Ce téléphone n’est pas à moi, il est à elle : « It’s not mine, it’s … »', ['hers', 'her', 'her’s', 'she’s'], 0, 'Le pronom possessif de « she » est « hers », sans apostrophe : il remplace « her phone ».'],
        trou('___ bag is this? — It’s Kate’s.', ['Who', 'Whose', 'Which', 'Who’s'], 1, 'La question du possesseur se pose avec « whose ». « Who’s » est la contraction de « who is ».'),
        ['Comment dit-on « le journal d’aujourd’hui » ?', ['the newspaper of today’s', 'the today newspaper', 'today’s newspaper', 'today newspaper’s'], 2, 'Le génitif ’s s’emploie aussi avec les expressions de temps : today’s newspaper, a week’s holiday.'],
        ['Comment dit-on « Cette maison est la nôtre » ?', ['This house is our.', 'This house is our’s.', 'This house is the ours.', 'This house is ours.'], 3, '« Ours » est le pronom possessif : il s’emploie seul, sans article et sans apostrophe.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Exprimer une quantité',
      questions: [
        trou('There is ___ milk in the fridge: we need to buy some.', ['no', 'any', 'a few', 'many'], 0, '« No » équivaut à « not any » dans une phrase affirmative : There is no milk = There isn’t any milk.'),
        trou('How ___ books have you read this year?', ['much', 'many', 'little', 'a little'], 1, '« Books » est dénombrable pluriel : on demande « How many ». « Much » est réservé aux indénombrables.'),
        trou('I don’t have ___ money to buy this phone.', ['too', 'very', 'enough', 'so'], 2, '« Enough » (assez) se place devant le nom : enough money. Devant un adjectif, il passe après : fast enough.'),
        ['Quelle phrase est correcte ?', ['Every students have a book.', 'Every student have a book.', 'Every students has a book.', 'Every student has a book.'], 3, '« Every » est suivi d’un nom singulier, et donc d’un verbe au singulier.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Les adjectifs qualificatifs',
      questions: [
        ['Comment dit-on « Ce film est effrayant » ?', ['This film is frightening.', 'This film is frightened.', 'This film is fright.', 'This film is frightfully.'], 0, 'L’adjectif en -ing décrit ce qui provoque le sentiment ; frightened décrirait la personne qui a peur.'],
        trou('The news was really ___: nobody expected it.', ['surprised', 'surprising', 'surprise', 'surprisingly'], 1, 'La nouvelle provoque la surprise : adjectif en -ing. Ceux qui l’apprennent sont « surprised ».'),
        trou('She looks ___ after the long trip.', ['tiredly', 'tiring', 'tired', 'tire'], 2, 'Après un verbe d’état comme look, on emploie un adjectif ; en -ed, il dit ce que ressent la personne.'),
        ['Comment désigne-t-on « les sans-abri » comme groupe ?', ['the homelesses', 'homeless ones', 'the homeless’s', 'the homeless'], 3, 'Précédé de « the », l’adjectif désigne tout un groupe et reste invariable, avec un verbe au pluriel.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Les verbes lexicaux et les auxiliaires',
      questions: [
        ['Que signifie qu’un modal comme « can » est invariable ?', ['Il ne prend jamais de -s à la 3e personne', 'Il ne se met jamais en question', 'Il ne s’emploie qu’au présent', 'Il s’accorde avec le complément'], 0, 'On dit « she can », jamais « she cans » : les modaux ne changent pas de forme.'],
        ['Quelle est la forme négative de « She has finished » ?', ['She doesn’t have finished.', 'She hasn’t finished.', 'She has finished not.', 'She didn’t finished.'], 1, '« Has » est ici l’auxiliaire du temps composé : « not » se place juste après lui.'],
        ['Lequel de ces verbes est un verbe lexical ?', ['must', 'can', 'believe', 'should'], 2, 'Un verbe lexical porte un sens (believe = croire) ; must, can et should sont des modaux, donc des auxiliaires.'],
        ['Quelle question correspond à « They are working » ?', ['Do they working?', 'Do they are working?', 'They working are?', 'Are they working?'], 3, 'L’auxiliaire « be » passe devant le sujet : pas besoin de « do ».'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Les auxiliaires BE et HAVE',
      questions: [
        ['Comment dit-on « J’ai froid » ?', ['I am cold.', 'I have cold.', 'I have got cold.', 'I do cold.'], 0, 'Comme pour l’âge, l’anglais emploie « be » là où le français dit « avoir » : cold, hungry, thirsty, right, afraid.'],
        ['Que peut valoir la contraction « we’d » ?', ['we did ou we do', 'we had ou we would', 'we have ou we are', 'we were uniquement'], 1, '« ’d » vaut « had » ou « would » : c’est ce qui suit qui tranche.'],
        ['Quel est le prétérit de « have » avec « she » ?', ['has', 'haved', 'had', 'hads'], 2, 'Au prétérit, « have » devient « had » à toutes les personnes.'],
        ['Comment demande-t-on « As-tu pris ton petit déjeuner ? » au prétérit ?', ['Had you breakfast?', 'Did you had breakfast?', 'Have you breakfast?', 'Did you have breakfast?'], 3, 'Dans une expression d’action (have breakfast, have a shower), « have » est lexical : la question se fait avec « do », au prétérit « did ».'],
      ],
    },
    {
      niveau: '3e',
      titre: 'L’auxiliaire DO',
      questions: [
        ['Quelle question est correcte ?', ['Can you swim?', 'Do you can swim?', 'Does you can swim?', 'Are you can swim?'], 0, 'Avec un modal, DO n’apparaît jamais : le modal passe lui-même devant le sujet.'],
        ['Comment insiste-t-on sur « Je te l’ai bien dit ! » ?', ['I did told you!', 'I did tell you!', 'I do told you!', 'I was tell you!'], 1, 'L’insistance se fait avec « did » accentué, suivi de la base verbale : une seule marque du passé.'],
        ['Comment demande-t-on « Qu’est-ce que tu fais dans la vie ? » ?', ['What you do?', 'What do you?', 'What do you do?', 'What are you do?'], 2, 'Quand « do » est lexical (faire), il faut un second « do » auxiliaire pour interroger.'],
        ['Quelle forme négative de DO emploie-t-on au prétérit avec « she » ?', ['doesn’t', 'don’t', 'hadn’t', 'didn’t'], 3, 'Au prétérit, « didn’t » vaut pour toutes les personnes ; doesn’t est réservé au présent.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Expression de la modalité : l’obligation',
      questions: [
        trou('At her school, she ___ wear a uniform: it’s the rule.', ['has to', 'have to', 'must to', 'musts'], 0, 'L’obligation vient d’un règlement extérieur : « have to », qui prend un -s à la 3e personne.'),
        ['Comment dit-on « Je devrai partir tôt demain » ?', ['I will must leave early tomorrow.', 'I will have to leave early tomorrow.', 'I must will leave early tomorrow.', 'I will had to leave early tomorrow.'], 1, '« Must » n’a pas de futur : on emploie « will have to ».'],
        ['Que signifie « You needn’t worry » ?', ['Tu ne dois surtout pas t’inquiéter', 'Tu devrais t’inquiéter', 'Tu n’as pas besoin de t’inquiéter', 'Tu as dû t’inquiéter'], 2, '« Needn’t » a le sens de « don’t have to » : absence d’obligation, pas interdiction.'],
        ['Comment exprime-t-on une interdiction au passé ?', ['mustn’t have', 'didn’t must', 'hadn’t to', 'couldn’t ou wasn’t allowed to'], 3, '« Mustn’t » n’a pas de passé : on dit « I couldn’t go out » ou « I wasn’t allowed to go out ».'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Expression de la modalité : la capacité',
      questions: [
        trou('Ask her tomorrow: she might ___ help you.', ['be able to', 'can', 'could', 'able'], 0, 'Deux modaux ne se suivent jamais : après « might », « can » est remplacé par « be able to ».'),
        ['Comment dit-on « J’ai pu finir » au present perfect ?', ['I have could finish.', 'I have been able to finish.', 'I have can finish.', 'I have able to finish.'], 1, '« Can » n’a pas de participe passé : on passe par « have been able to ».'],
        ['Quelle tournure équivaut à « was able to » pour une réussite ponctuelle ?', ['used to', 'had to', 'managed to', 'ought to'], 2, '« Managed to » dit qu’on est parvenu à faire quelque chose, cette fois-là.'],
        ['Comment s’écrit la négation de « can » en un seul mot ?', ['can not', 'cann’t', 'cantn’t', 'cannot'], 3, 'La forme pleine s’écrit « cannot », en un seul mot ; la contraction est « can’t ».'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Expression de la modalité : la permission',
      questions: [
        ['Que signifie « You can’t park here » ?', ['Tu n’as pas le droit de te garer ici', 'Tu ne sais pas te garer ici', 'Tu n’es pas obligé de te garer ici', 'Tu ne devrais pas te garer ici'], 0, 'Dans le registre de la permission, « can’t » exprime le refus : c’est interdit.'],
        ['Quelle forme refuse une permission dans un registre formel ?', ['You can’t', 'You may not', 'You couldn’t', 'You don’t have to'], 1, '« May not » est la forme formelle du refus, celle des règlements écrits.'],
        ['Comment dit-on « Tu auras le droit de voter à 18 ans » ?', ['You will can vote at 18.', 'You may will vote at 18.', 'You will be allowed to vote at 18.', 'You will allowed to vote at 18.'], 2, '« Can » et « may » n’ont pas de futur : « be allowed to » se conjugue à tous les temps.'],
        ['Quelle demande convient pour entrer dans le bureau du principal ?', ['Must I come in?', 'Do I may come in?', 'Can I to come in?', 'May I come in?'], 3, '« May » est la forme la plus polie et la plus formelle pour demander la permission à un adulte.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Expression de la modalité : donner un conseil',
      questions: [
        trou('If I were you, I ___ apologise.', ['would', 'will', 'should have', 'am'], 0, '« If I were you, I would… » est une façon courante de donner un conseil : « À ta place, je… ».'),
        ['Que signifie « The train should arrive at six » ?', ['Le train doit obligatoirement arriver à six heures', 'Le train devrait normalement arriver à six heures', 'Le train aurait dû arriver à six heures', 'Le train arrive toujours à six heures'], 1, '« Should » exprime aussi ce qui est normal ou attendu, pas seulement un conseil.'],
        ['Quelle phrase exprime une obligation, et non un conseil ?', ['You should rest.', 'You’d better rest.', 'You must rest.', 'Why don’t you rest?'], 2, 'Should (conseil) < had better (pressant) < must (obligation).'],
        ['Quelle est la négation de « You had better hurry » ?', ['You hadn’t better hurry.', 'You’d not better hurry.', 'You didn’t better hurry.', 'You’d better not hurry.'], 3, 'La négation de « had better » se place après « better » : You’d better not be late.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Expression de la modalité : la suggestion',
      questions: [
        ['Quelle phrase compare deux choix avec « would rather » ?', ['I’d rather stay home than go out.', 'I’d rather stay home that go out.', 'I’d rather to stay home than going out.', 'I’d rather staying home than go out.'], 0, '« Would rather » + base verbale, et « than » pour introduire le second choix, lui aussi à la base verbale.'],
        ['Que signifie « Shall I open the window? » ?', ['J’ouvrirai la fenêtre.', 'Veux-tu que j’ouvre la fenêtre ?', 'Dois-je obligatoirement ouvrir la fenêtre ?', 'J’ai ouvert la fenêtre.'], 1, '« Shall I…? » propose de faire quelque chose pour l’autre : c’est une offre, pas un futur.'],
        trou('Why not ___ again?', ['to try', 'trying', 'try', 'tried'], 2, '« Why not » est suivi de la base verbale, comme « Let’s » et « Why don’t we ».'),
        ['Quelle réponse accepte une suggestion ?', ['I’m afraid I can’t.', 'Sorry, I’m busy.', 'I’d rather not.', 'That sounds great!'], 3, '« That sounds great! », « Good idea! » ou « Why not! » acceptent ; les trois autres refusent poliment.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Expression de la modalité : le souhait et le regret',
      questions: [
        ['Quelle formule propose poliment à boire ?', ['Would you like a drink?', 'Do you want drink?', 'Will you like a drink?', 'Would you want to a drink?'], 0, '« Would you like…? » est la forme polie de l’offre, plus douce que « want ».'],
        ['Comment dit-on « Je regrette d’avoir dit ça » ?', ['I regret say that.', 'I regret saying that.', 'I regretted to said that.', 'I regret to saying that.'], 1, 'Pour un regret sur ce qu’on a fait, « regret » est suivi du verbe en -ING.'],
        ['Que signifie « If only I had listened! » ?', ['Si seulement j’écoutais !', 'J’ai bien fait d’écouter !', 'Si seulement j’avais écouté !', 'Si j’écoute, tout ira bien.'], 2, 'Comme « wish », « if only » + past perfect exprime un regret sur le passé, avec plus d’émotion.'],
        ['Quelle est la différence entre « would like » et « wish » ?', ['Aucune, ils sont interchangeables', '« Wish » est plus poli', '« Would like » exprime un regret', '« Would like » dit un souhait ordinaire, « wish » un souhait irréel'], 3, 'On dit « I’d like to travel » pour un souhait réalisable, « I wish I had more time » pour ce qui n’est pas.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Expression de la modalité : la probabilité',
      questions: [
        trou('She ___ be home by now: she left an hour ago.', ['should', 'mustn’t', 'can’t', 'had better'], 0, '« Should » exprime ici une forte probabilité : ce qui est normalement le cas.'),
        ['Que signifie « They can’t have arrived yet » ?', ['Ils n’ont pas le droit d’arriver', 'Ils ne peuvent pas être déjà arrivés', 'Ils sont peut-être arrivés', 'Ils auraient dû arriver'], 1, '« Can’t have » + participe passé exprime une certitude négative sur le passé.'],
        trou('Look at his face: he ___ be very tired.', ['can’t', 'mustn’t', 'must', 'should have'], 2, 'Un indice présent mène à une quasi-certitude : « must » (il doit être fatigué, j’en suis sûr).'),
        ['Que signifie « It’s likely to rain » ?', ['Il ne pleuvra sûrement pas', 'Il aime la pluie', 'Il a plu', 'Il va probablement pleuvoir'], 3, '« Be likely to » exprime la probabilité sans modal.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Faire faire quelque chose à quelqu’un',
      questions: [
        ['Que signifie « The film made me cry » ?', ['Le film m’a fait pleurer', 'J’ai fait un film triste', 'Le film m’a laissé pleurer', 'J’ai fait pleurer le film'], 0, '« Make » + complément + base verbale : ici, provoquer une réaction.'],
        ['Comment dit-on « Je fais réparer mon téléphone », de façon familière ?', ['I get fixed my phone.', 'I get my phone fixed.', 'I get my phone to fix.', 'I make my phone fixing.'], 1, '« Get » + objet + participe passé a le même sens causatif que « have », dans un registre plus familier.'],
        ['Quel verbe traduit « autoriser » dans les tournures de « faire faire » ?', ['make', 'have', 'let', 'get'], 2, '« Let » = laisser, autoriser : She let me borrow her bike.'],
        ['Dans « We had the car repaired », qui a réparé la voiture ?', ['Nous-mêmes', 'Personne', 'La voiture s’est réparée seule', 'Un professionnel, à notre demande'], 3, 'Avec « have » causatif, le sujet ne fait pas l’action : il la commande.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Les verbes à particule et les verbes prépositionnels',
      questions: [
        trou('It’s cold outside: ___ your coat on.', ['put', 'take', 'give', 'turn'], 0, '« Put on » signifie mettre un vêtement ; « take off » signifie l’enlever.'),
        ['Que signifie « look forward to » ?', ['Regarder devant soi', 'Attendre avec impatience', 'S’occuper de', 'Chercher'], 1, '« I look forward to seeing you » : j’ai hâte de te voir.'],
        ['Que signifie « run out of » ?', ['Sortir en courant', 'S’enfuir', 'Être à court de', 'Dépasser'], 2, '« We’ve run out of milk » : nous n’avons plus de lait. Le sens ne se déduit pas des mots.'],
        ['Quelle phrase est correcte ?', ['I’m waiting you.', 'I’m waiting to you.', 'I’m waiting you for.', 'I’m waiting for you.'], 3, '« Wait for » est un verbe prépositionnel : la préposition est obligatoire et précède son complément.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Infinitif et gérondif',
      questions: [
        trou('They promised ___ on time.', ['to be', 'being', 'be', 'been'], 0, '« Promise » fait partie des verbes suivis de TO + verbe, comme want, decide ou hope.'),
        trou('I remember ___ the door: I’m sure it’s closed.', ['to lock', 'locking', 'lock', 'locked'], 1, '« Remember » + -ING : se souvenir d’avoir fait. « Remember to lock » voudrait dire « penser à fermer ».'),
        trou('Would you mind ___ the window?', ['to open', 'open', 'opening', 'opened'], 2, '« Mind » est suivi du verbe en -ING : Would you mind opening… ? (Ça te dérangerait d’ouvrir… ?)'),
        ['Que signifie « Try opening the window » ?', ['Réussis à ouvrir la fenêtre', 'N’ouvre surtout pas la fenêtre', 'Essaie d’ouvrir la fenêtre, même si c’est difficile', 'Essaie en ouvrant la fenêtre, pour voir si ça aide'], 3, '« Try » + -ING : faire un essai pour voir le résultat. « Try to open » : faire un effort pour ouvrir.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Les adverbes',
      questions: [
        trou('This film is ___ interesting.', ['very', 'much', 'enough', 'a lot'], 0, 'Les adverbes de degré (very, quite, too, really) se placent devant l’adjectif.'),
        ['Quel est l’adverbe de « happy » ?', ['happyly', 'happily', 'happilly', 'happly'], 1, 'Pour un adjectif en -y, le y devient i avant -ly : happily.'],
        ['Quel est l’adverbe de « fast » ?', ['fastly', 'fastily', 'fast', 'faster'], 2, '« Fast », comme hard, late et early, a la même forme comme adjectif et comme adverbe.'],
        ['Comment dit-on « Il travaille dur » ?', ['He works hardly.', 'He hardly works.', 'He works hardily.', 'He works hard.'], 3, 'L’adverbe de « hard » est « hard ». « He hardly works » signifierait « il travaille à peine ».'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Le présent simple et le présent en BE + -ING',
      questions: [
        ['Pourquoi dit-on « The train leaves at six » au présent simple ?', ['Parce que c’est un programme fixe', 'Parce que l’action est en cours', 'Parce que c’est un agacement', 'Parce que c’est un souvenir'], 0, 'Le présent simple exprime aussi un horaire ou un programme fixé à l’avance.'],
        trou('Water ___ at 100 °C.', ['is boiling', 'boils', 'boil', 'boiling'], 1, 'Une vérité générale se dit au présent simple, avec le -s de la 3e personne.'),
        ['Quelle est la 3e personne de « watch » au présent simple ?', ['watchs', 'watchies', 'watches', 'watchez'], 2, 'Après -ch, -sh, -x, -ss et -o, la 3e personne prend -es : watches, goes, misses.'],
        trou('I ___ with my aunt this week, while my parents are away.', ['stay', 'stays', 'staying', 'am staying'], 3, 'Une situation temporaire se dit au présent en BE + -ING.'),
      ],
    },
    {
      niveau: '3e',
      titre: 'Le prétérit simple',
      questions: [
        ['Quel est le prétérit de « live » ?', ['lived', 'liveed', 'livd', 'lieved'], 0, 'Quand la base se termine par -e, on n’ajoute que -d : lived.'],
        ['Comment se prononce le -ed de « played » ?', ['[t]', '[d]', '[ɪd]', 'Il est muet'], 1, 'Après un son sonore, -ed se prononce [d] ; après un son sourd, [t] (worked).'],
        ['Comment se prononce la terminaison -ed de « wanted » ?', ['[t]', '[d]', '[ɪd]', 'Elle est muette'], 2, 'Après un t ou un d, -ed forme une syllabe de plus : [ɪd], wanted, needed.'],
        trou('She ___ the door, took her coat and left.', ['opens', 'has opened', 'was opened', 'opened'], 3, 'Une suite d’actions passées se raconte au prétérit simple.'),
      ],
    },
    {
      niveau: '3e',
      titre: 'Le prétérit en BE + -ING',
      questions: [
        ['Dans « I was walking home when it started to rain », quelle action est l’événement ?', ['it started to rain', 'I was walking home', 'Les deux', 'Aucune'], 0, 'Ce qui survient est au prétérit simple ; ce qui encadre (le décor) est en BE + -ING.'],
        trou('What were you doing at eight last night? — I ___ TV.', ['watched', 'was watching', 'have watched', 'am watching'], 1, 'Une action en cours à un moment précis du passé se dit au prétérit en BE + -ING.'),
        ['Quelle est la forme interrogative de « You were working » ?', ['Did you working?', 'Was you working?', 'Were you working?', 'Did you were working?'], 2, 'L’auxiliaire « were » passe devant le sujet, sans « did ».'],
        ['Quelle phrase est correcte ?', ['He was read when I arrived.', 'He were reading when I arrived.', 'He reading when I arrived.', 'He was reading when I arrived.'], 3, 'Was/were + verbe en -ING : « was » avec he, she, it et I.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Le present perfect',
      questions: [
        ['Que signifie « I have never been to Japan » ?', ['Je ne suis jamais allé au Japon', 'Je ne suis pas allé au Japon l’an dernier', 'Je n’irai jamais au Japon', 'Je n’étais pas au Japon'], 0, 'Le present perfect exprime ici une expérience de vie, sans date.'],
        trou('___ you ever eaten sushi?', ['Do', 'Have', 'Has', 'Are'], 1, 'Present perfect : have + participe passé, et l’auxiliaire passe devant le sujet dans la question.'),
        ['Quelle phrase traduit « Elle travaille ici depuis 2020 » ?', ['She works here since 2020.', 'She has worked here for 2020.', 'She has worked here since 2020.', 'She worked here since 2020.'], 2, 'Une action commencée dans le passé et qui continue se dit au present perfect, pas au présent comme en français.'],
        ['Quelle forme est correcte avec « he » ?', ['He have seen', 'He has saw', 'He is seen', 'He has seen'], 3, 'Avec he, she, it, l’auxiliaire est « has », suivi du participe passé (seen, pas saw).'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Le past perfect',
      questions: [
        trou('She was upset because she ___ the test.', ['had failed', 'has failed', 'have failed', 'fails'], 0, 'L’échec est antérieur à la tristesse, elle-même passée : past perfect.'),
        ['Que signifierait « When I arrived, the train left » ?', ['Le train était déjà parti', 'Le train est parti après mon arrivée', 'Le train n’est jamais parti', 'Je suis arrivé en train'], 1, 'Sans past perfect, les deux actions se suivent dans l’ordre : j’arrive, puis le train part.'],
        ['Quelle est la forme négative de « She had left » ?', ['She didn’t had left.', 'She hasn’t left.', 'She hadn’t left.', 'She had not leave.'], 2, 'La négation se place après « had » : hadn’t + participe passé.'],
        trou('After he ___ eaten, he went out.', ['has', 'have', 'was', 'had'], 3, 'Après « after », le past perfect marque l’action la plus ancienne.'),
      ],
    },
    {
      niveau: '3e',
      titre: 'Exprimer le futur',
      questions: [
        ['Laquelle de ces formes suppose le plus de préparation ?', ['BE + -ING (rendez-vous fixé)', 'will', 'be going to', 'Elles se valent'], 0, 'Décision immédiate (will) → intention (going to) → rendez-vous fixé, avec date et lieu (BE + -ING).'],
        ['Quelle est la forme négative de « will » ?', ['willn’t', 'won’t', 'wasn’t', 'don’t will'], 1, 'La forme contractée de « will not » est « won’t ».'],
        ['Quelle phrase exprime une promesse ?', ['I am being there for you.', 'I was going to be there.', 'I will always be there for you.', 'I am there tomorrow.'], 2, '« Will » exprime la promesse et l’offre, en plus de la décision immédiate et de la prédiction.'],
        ['Comment demande-t-on « Viendras-tu ? » ?', ['Do you will come?', 'You come will?', 'Are you will come?', 'Will you come?'], 3, '« Will » est un modal : il passe lui-même devant le sujet, sans « do ».'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Exprimer le conditionnel',
      questions: [
        ['Quelle phrase est correcte ?', ['If I had time, I would help you.', 'If I would have time, I would help you.', 'If I have time, I would help you.', 'If I had time, I will help you.'], 0, 'Type 2 : if + prétérit, would + base verbale. Jamais de « would » après « if ».'],
        ['Que signifie « If I had more time, I would travel » ?', ['J’ai du temps, donc je voyage', 'Je n’ai pas le temps : voyager reste irréel', 'J’avais du temps et j’ai voyagé', 'J’aurai du temps et je voyagerai'], 1, 'Le prétérit après « if » ne parle pas du passé : il marque l’irréel du présent.'],
        ['Dans quel ordre peut-on écrire une phrase conditionnelle ?', ['« If » doit toujours ouvrir la phrase', '« If » doit toujours la terminer', 'La proposition en « if » peut ouvrir ou suivre la principale', '« If » se place au milieu de la principale'], 2, 'Les deux ordres sont possibles ; la virgule n’apparaît que si « if » ouvre la phrase.'],
        trou('I wish I ___ come to your party.', ['can', 'will', 'would can', 'could'], 3, 'Hors de « if », le conditionnel apparaît aussi après « wish » : « could » est le passé de « can ».'),
      ],
    },
    {
      niveau: '3e',
      titre: 'Verbes irréguliers',
      questions: [
        ['Quel verbe suit le modèle « 1 = 3 » (base et participe identiques) ?', ['come', 'take', 'buy', 'go'], 0, 'Come – came – come : la base et le participe passé sont identiques, comme become et run.'],
        trou('I have ___ three glasses of water today.', ['drank', 'drunk', 'drinked', 'drink'], 1, 'Après « have », on emploie le participe passé (3e colonne) : drink – drank – drunk.'),
        ['Quelles sont les trois formes de « go » ?', ['go – went – went', 'go – gone – went', 'go – went – gone', 'go – goed – gone'], 2, 'Go fait partie des verbes à trois formes différentes : go – went – gone.'],
        ['Quel est le prétérit de « think » ?', ['thinked', 'thank', 'taught', 'thought'], 3, 'Think – thought – thought (2 = 3). « Taught » est le prétérit de « teach ».'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Phrase simple et phrase complexe',
      questions: [
        ['Dans « I think he is right », quel mot peut être sous-entendu ?', ['that', 'which', 'who', 'because'], 0, 'La complétive est introduite par « that », souvent omis : I think (that) he is right.'],
        ['Comment traduit-on « Il y a un problème » ?', ['It is a problem.', 'There is a problem.', 'Is a problem.', 'Has a problem.'], 1, 'Le sujet est obligatoire en anglais : « there is » pose l’existence de quelque chose.'],
        ['Quelle conjonction introduit une subordonnée de condition ?', ['until', 'although', 'unless', 'since'], 2, '« If » et « unless » (à moins que) introduisent une condition ; until marque le temps.'],
        ['Quel mot introduit une subordonnée de cause ?', ['until', 'so that', 'but', 'because'], 3, 'Because, since et as introduisent la cause ; so that introduit le but, but coordonne.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Les pronoms personnels',
      questions: [
        ['Comment dit-on « Je l’ai fait moi-même » ?', ['I did it myself.', 'I did it me.', 'I myself did it me.', 'I did it by me.'], 0, 'Le pronom réfléchi sert aussi à insister : I did it myself.'],
        trou('This present is for ___.', ['we', 'us', 'our', 'ours'], 1, 'Après une préposition, on emploie le pronom complément : for us, with them.'),
        trou('He hurt ___ while playing football.', ['him', 'hisself', 'himself', 'he'], 2, 'L’action revient sur le sujet : pronom réfléchi « himself » (jamais « hisself »).'),
        ['Quel est le pronom réfléchi de « you » au pluriel ?', ['yourself', 'yourselfs', 'youselves', 'yourselves'], 3, '« Yourself » s’adresse à une personne, « yourselves » à plusieurs.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Les pronoms relatifs',
      questions: [
        trou('I remember the day ___ we met.', ['when', 'where', 'who', 'whose'], 0, 'Après un antécédent de temps, le relatif est « when ».'),
        trou('This is the town ___ I was born.', ['which', 'where', 'who', 'whose'], 1, 'Après un antécédent de lieu, le relatif est « where ».'),
        ['Comment dit-on « la fille à qui j’ai parlé » en registre soutenu ?', ['the girl whom I spoke', 'the girl to who I spoke to', 'the girl to whom I spoke', 'the girl which I spoke to'], 2, 'En registre soutenu, la préposition remonte devant le relatif, qui devient « whom ».'],
        ['Dans quelle phrase le pronom relatif peut-il être omis ?', ['The man who called me is here.', 'My brother, who lives in London, is here.', 'The dog which bit me ran away.', 'The film that I watched was great.'], 3, '« That » y est complément dans une relative déterminative : on peut dire « the film I watched ».'],
      ],
    },
    {
      niveau: '3e',
      titre: 'La phrase interrogative',
      questions: [
        ['Qu’est-ce qu’une question fermée ?', ['Une question à laquelle on répond par yes ou no', 'Une question qui commence par un mot en wh-', 'Une question sans auxiliaire', 'Une question indirecte'], 0, 'On y répond par yes ou no : il suffit de placer l’auxiliaire devant le sujet.'],
        ['Quelle question interroge sur l’âge ?', ['How many years have you?', 'How old are you?', 'What age you have?', 'How old do you have?'], 1, 'L’âge se demande avec « how old » et le verbe « be ».'],
        ['Quelle question interroge sur une distance ?', ['How long is the station?', 'How often is the station?', 'How far is the station?', 'How much is the station far?'], 2, '« How far » demande une distance ; how long, une durée ; how often, une fréquence.'],
        ['Quelle question est correcte ?', ['What she said?', 'What did she said?', 'What does she said?', 'What did she say?'], 3, 'Mot interrogatif + auxiliaire (did) + sujet + base verbale : une seule marque du passé.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Les question tags',
      questions: [
        trou('Close the door, ___?', ['will you', 'do you', 'don’t you', 'shall we'], 0, 'Après un impératif, le tag est « will you? ».'),
        trou('You can swim, ___?', ['can you', 'can’t you', 'don’t you', 'aren’t you'], 1, 'Le tag reprend l’auxiliaire (can) avec la polarité inverse : phrase affirmative, tag négatif.'),
        trou('Somebody called, ___?', ['didn’t he', 'did somebody', 'didn’t they', 'didn’t it'], 2, 'Après un sujet indéfini (somebody, nobody, everyone), le tag reprend « they ».'),
        ['Que signifie un tag prononcé avec une intonation montante ?', ['On est sûr et on cherche l’accord', 'On donne un ordre', 'On exprime la colère', 'On doute vraiment : c’est une vraie question'], 3, 'Intonation descendante : on cherche l’accord. Montante : on pose une vraie question.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'La phrase exclamative',
      questions: [
        trou('They are ___ nice people!', ['such', 'such a', 'so', 'what'], 0, 'Devant un adjectif + nom pluriel, on emploie « such », sans article.'),
        ['Quelle phrase est correcte ?', ['What a terrible weather!', 'What terrible weather!', 'How terrible weather!', 'Such a terrible weather!'], 1, '« Weather » est indénombrable : « what » sans article.'],
        trou('How ___ he runs!', ['a fast', 'faster than', 'fast', 'such fast'], 2, '« How » est suivi d’un adjectif ou d’un adverbe, puis du sujet et du verbe, sans inversion.'),
        ['Que signifie « How come? » ?', ['Comment viens-tu ?', 'Viens ici !', 'Quand viens-tu ?', 'Comment ça se fait ?'], 3, '« How come? » est une exclamation toute faite qui marque la surprise : « Comment ça se fait ? ».'],
      ],
    },
    {
      niveau: '3e',
      titre: 'La voix passive',
      questions: [
        ['Quel est le passif de « They build houses » ?', ['Houses are built.', 'Houses built.', 'Houses are build.', 'Houses were building.'], 0, 'Au présent, be (are) + participe passé (built), au même temps que l’actif.'],
        ['Quel est le passif de « Shakespeare wrote Hamlet » ?', ['Hamlet wrote by Shakespeare.', 'Hamlet was written by Shakespeare.', 'Hamlet was wrote by Shakespeare.', 'Hamlet is writing by Shakespeare.'], 1, 'Prétérit → was + participe passé (written), et l’auteur est introduit par « by ».'],
        ['Quel est le passif de « They will build a bridge » ?', ['A bridge will built.', 'A bridge will been built.', 'A bridge will be built.', 'A bridge is will built.'], 2, 'Après « will », be reste à la base verbale : will be + participe passé.'],
        ['Dans quels textes la voix passive abonde-t-elle ?', ['Dans les ordres', 'Dans les questions uniquement', 'Dans les dialogues familiers', 'Dans les textes scientifiques et les journaux'], 3, 'Le passif met en avant ce qui a été fait plutôt que son auteur, d’où sa fréquence dans ces textes.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Le comparatif',
      questions: [
        trou('The more you practise, the ___ you get.', ['better', 'good', 'best', 'more good'], 0, 'Structure « plus… plus… » : the + comparatif, the + comparatif. Le comparatif de good est better.'),
        ['Quel est le comparatif de « big » ?', ['biger', 'bigger', 'more big', 'biggest'], 1, 'Voyelle courte + consonne finale : la consonne double devant -er.'],
        ['Quel est le comparatif de « happy » ?', ['happyer', 'more happy than', 'happier', 'happiest'], 2, 'Adjectif de deux syllabes en -y : le y devient i, et on ajoute -er.'],
        ['Comment dit-on « Il n’est pas aussi rapide que toi » ?', ['He is not as fast than you.', 'He is not so fast that you.', 'He is less fast as you.', 'He is not as fast as you.'], 3, 'L’égalité négative se construit avec not as / not so + adjectif + as.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Le superlatif',
      questions: [
        trou('It was the coldest day ___ the year.', ['of', 'in', 'at', 'from'], 0, 'Devant un ensemble ou une période, le superlatif est suivi de « of » ; devant un lieu, de « in ».'),
        ['Quel est le superlatif de « bad » ?', ['the baddest', 'the worst', 'the worse', 'the most bad'], 1, 'Bad – worse – the worst : irrégulier. « Worse » est le comparatif.'],
        ['Quel est le superlatif de « big » ?', ['the bigest', 'the most big', 'the biggest', 'the bigger'], 2, 'Comme au comparatif, la consonne finale double : the biggest.'],
        ['Comment dit-on « le moins cher » ?', ['the less expensive', 'the most cheap', 'the lesser expensive', 'the least expensive'], 3, 'Le superlatif d’infériorité se construit avec « the least » + adjectif.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Exprimer l’habitude',
      questions: [
        trou('Every summer, we ___ go to the beach.', ['would', 'used', 'are used to', 'get used to'], 0, '« Would » + base verbale exprime une action répétée dans le passé.'),
        ['Que signifie « I am used to getting up early » ?', ['J’avais l’habitude de me lever tôt', 'Je suis habitué à me lever tôt', 'Je m’habituerai à me lever tôt', 'Je me levais tôt autrefois'], 1, '« Be used to » + -ING = être habitué à : c’est une habitude acquise, au présent.'],
        ['Quelle question est correcte ?', ['Did you used to live here?', 'Used you live here?', 'Did you use to live here?', 'Do you used to live here?'], 2, 'Après « did », used perd son -d : Did you use to…?'],
        ['Où place-t-on « usually » dans « She plays tennis on Saturdays » ?', ['Usually plays she tennis on Saturdays.', 'She plays usually tennis on Saturdays.', 'She plays tennis usually on Saturdays.', 'She usually plays tennis on Saturdays.'], 3, 'L’adverbe de fréquence se place avant le verbe lexical.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Exprimer le but',
      questions: [
        ['Quel est le sens de « so as to » ?', ['Afin de, en registre formel', 'Pour que, avec un autre sujet', 'Si bien que', 'À cause de'], 0, '« So as to » et « in order to » expriment le but, en registre formel, avec le même sujet.'],
        trou('I’ll speak slowly so that you ___ understand.', ['to', 'can', 'for', 'are'], 1, 'Le but concerne un autre sujet : so that + proposition, souvent avec un modal (can, could).'),
        ['Que signifie « I went to the shop for bread » ?', ['Je suis allé au magasin à cause du pain', 'Je suis allé au magasin avec du pain', 'Je suis allé au magasin chercher du pain', 'Je suis allé au magasin pour faire du pain'], 2, '« For » + nom signifie ici aller chercher quelque chose.'],
        ['Que répond-on à « Why did you call? » ?', ['For ask you something.', 'For asking you something.', 'So ask you something.', 'To ask you something.'], 3, 'La réponse à « why » commence souvent par « To… » + base verbale ; jamais « for » + verbe.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Exprimer la durée',
      questions: [
        trou('I fell asleep ___ the film.', ['during', 'for', 'since', 'ago'], 0, '« During » est suivi d’un nom (the film, the holidays), jamais d’une durée chiffrée.'),
        trou('It’s been two years ___ I saw him.', ['for', 'since', 'ago', 'during'], 1, 'La tournure « it’s been … since » : cela fait deux ans que je ne l’ai pas vu.'),
        ['Quelle question demande un moment précis ?', ['How long have you been here?', 'How long ago you arrive?', 'When did you arrive?', 'Since when you are here?'], 2, '« When » + prétérit demande un moment précis ; « how long » demande une durée.'],
        ['À quelle question répond « for » ?', ['Depuis quand ?', 'Il y a combien ?', 'Quand ?', 'Combien de temps ?'], 3, '« Combien de temps ? » → for. « Depuis quand ? » → since.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Le discours indirect',
      questions: [
        trou('« Don’t be late. » → She told me ___ late.', ['not to be', 'to not being', 'don’t be', 'not be'], 0, 'Un ordre négatif se rapporte avec tell + complément + not to + base verbale.'),
        ['Que devient « tomorrow » au discours indirect ?', ['the day before', 'the next day', 'today', 'then'], 1, 'Les repères de temps s’adaptent : tomorrow → the next day, yesterday → the day before.'],
        ['Que devient « can » au discours indirect, après « he said » ?', ['can', 'would', 'could', 'may'], 2, 'Chaque temps recule d’un cran : can → could, will → would.'],
        ['Tom a dit : « I lost my keys. » Comment le rapporte-t-on ?', ['Tom said I had lost my keys.', 'Tom said he lost my keys.', 'Tom said he has lost his keys.', 'Tom said he had lost his keys.'], 3, 'Le prétérit recule au past perfect, et les pronoms s’adaptent au nouveau locuteur : I → he, my → his.'],
      ],
    },
  ],
}
