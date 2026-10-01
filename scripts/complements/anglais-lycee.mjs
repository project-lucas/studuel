const N = ['2de', '1re', 'Tle']

export default {
  slug: 'anglais',
  titreMigration: 'QUESTIONS EN PLUS — ANGLAIS 2de → Tle',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveaux: N,
      titre: 'Les déterminants',
      questions: [
        ['Quel mot complète la phrase ? *I have ___ idea.*', ['a', 'an', 'the', 'some'], 1, '*Idea* commence par un son voyelle : on écrit *an*. C’est le son prononcé qui décide, pas la lettre.'],
        ['Quel mot complète la phrase ? *She is ___ dentist.*', ['Ø (rien)', 'the', 'a', 'an'], 2, 'L’anglais met *a / an* devant un métier : *She is a dentist*, là où le français dit « elle est dentiste ».'],
        ['Quel mot complète la phrase ? *The dog wagged ___ tail.*', ['it’s', 'it is', 'its’', 'its'], 3, '*Its* (possessif) ne prend jamais d’apostrophe ; *it’s* est la contraction de *it is*.'],
        ['Comment traduit-on « les jouets des enfants » ?', ['the children’s toys', 'the childrens’ toys', 'the childs’ toys', 'the children toys'], 0, '*Children* est un pluriel irrégulier, sans -s : on ajoute donc ’s, comme pour un singulier.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Exprimer une quantité',
      questions: [
        ['Quel mot complète la phrase ? *There are too ___ people here.*', ['much', 'many', 'lots', 'enough'], 1, '*People* est un dénombrable pluriel : *too many people*. *Too much* se réserve aux indénombrables.'],
        ['Quel mot complète la phrase ? *Would you like ___ tea?*', ['any', 'many', 'some', 'few'], 2, 'Dans une offre ou une demande polie, on emploie *some*, même dans une question.'],
        ['Quelle phrase est correcte ?', ['I need some informations', 'I need an information', 'I need a information', 'I need some information'], 3, '*Information* est indénombrable en anglais : jamais de -s ni de *a*. Pour en compter une, on dit *a piece of information*.'],
        ['Quel mot complète la phrase ? *She has ___ time to relax: she is always busy.*', ['little', 'few', 'a few', 'many'], 0, '*Time* est indénombrable, et le sens est négatif (« peu, presque pas ») : *little*. *Few* et *a few* vont avec les dénombrables.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les adjectifs qualificatifs',
      questions: [
        ['Quel groupe complète la phrase ? *She lives in a ___ house.*', ['big beautiful old', 'beautiful big old', 'old beautiful big', 'beautiful old big'], 1, 'L’ordre est fixe : opinion (*beautiful*), puis taille (*big*), puis âge (*old*).'],
        ['Quel groupe complète la phrase ? *They bought a ___ table.*', ['wooden old', 'round wooden old', 'old wooden', 'wooden round'], 2, 'L’âge (*old*) vient avant la matière (*wooden*), qui se place toujours tout près du nom.'],
        ['Quel mot complète la phrase ? *She looks ___.*', ['tiredly', 'to tired', 'tireds', 'tired'], 3, 'Après un verbe d’état comme *look*, *seem* ou *feel*, on met un adjectif attribut, pas un adverbe.'],
        ['Comment traduit-on « Les Britanniques boivent beaucoup de thé » ?', ['The British drink a lot of tea', 'The Britishs drink a lot of tea', 'The British drinks a lot of tea', 'British drinks a lot of tea'], 0, '*The* + adjectif désigne tout le groupe : l’adjectif reste invariable, mais le verbe se met au pluriel.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les verbes lexicaux et les auxiliaires',
      questions: [
        ['Comment traduit-on « Tu as raison » ?', ['You have reason', 'You have right', 'You are right', 'You do right'], 2, 'Là où le français dit « avoir raison », l’anglais emploie *be* : *You are right*.'],
        ['Quel mot complète la phrase ? *I ___ have breakfast this morning.*', ['didn’t', 'hadn’t', 'haven’t', 'wasn’t'], 0, 'Dans *have breakfast*, *have* est un verbe lexical (« prendre ») : au prétérit négatif, il faut l’auxiliaire *did*.'],
        ['Dans « She is working », quel est le rôle de *is* ?', ['Un verbe lexical signifiant « être »', 'Un modal', 'Un auxiliaire du passif', 'Un auxiliaire de la forme en -ING'], 3, '*Be* sert ici d’auxiliaire pour construire la forme *be* + -ING ; il ne signifie plus « être ».'],
        ['« J’aime le thé. — Moi aussi. » Comment dit-on « moi aussi » ?', ['So am I', 'So do I', 'So like I', 'Me too do'], 1, 'La reprise se fait avec l’auxiliaire de la phrase ; *I like* n’en a pas, on fabrique donc *do* : *So do I*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les auxiliaires modaux',
      questions: [
        ['Que signifie « You don’t have to come » ?', ['Tu ne dois pas venir : c’est interdit', 'Tu n’es pas obligé de venir', 'Tu ne peux pas venir', 'Tu ne viendras pas'], 1, '*Don’t have to* marque l’absence d’obligation ; l’interdiction se dit *mustn’t*.'],
        ['Quel mot complète la phrase ? *He can’t ___ seen us: we were hidden.*', ['has', 'had', 'having', 'have'], 3, 'Modal + *have* + participe passé : *can’t have seen* est une déduction négative sur le passé. Après un modal, *have* reste à la base.'],
        ['Quel mot complète la phrase ? *You look tired: you ___ rest.*', ['must to', 'ought', 'should', 'can to'], 2, '*Should* exprime le conseil et se construit sans *to*. *Ought* demande *to* : *you ought to rest*.'],
        ['Dans « He would spend hours there », *would* exprime…', ['Une habitude passée', 'Un conseil', 'Une obligation', 'Une déduction'], 0, '*Would* + base verbale peut raconter une habitude passée répétée : « il passait des heures là-bas ».'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les verbes à particule et les verbes prépositionnels',
      questions: [
        ['Quel verbe complète la phrase ? *The police are ___ the robbery.*', ['looking after', 'looking up', 'looking into', 'looking at'], 2, '*Look into* signifie « enquêter sur » : changer la particule, c’est changer le verbe.'],
        ['Quel verbe complète la phrase ? *I’m ___ my keys. Have you seen them?*', ['looking for', 'looking at', 'looking after', 'looking into'], 0, '*Look for* signifie « chercher » ; *look at* veut seulement dire « regarder ».'],
        ['Quel mot complète la phrase ? *This is the book I told you ___.*', ['of', 'about', 'on', 'from'], 1, 'On dit *tell someone about something*, et la préposition peut rester en fin de phrase, ce qui est naturel en anglais.'],
        ['Quelle phrase est correcte ?', ['Listen me!', 'Listen at me!', 'Listen for me!', 'Listen to me!'], 3, '*Listen to* est un verbe prépositionnel : la préposition *to* est obligatoire devant le complément.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Infinitif et gérondif',
      questions: [
        ['Quel verbe complète la phrase ? *She refused ___ the letter.*', ['signing', 'to sign', 'sign', 'signed'], 1, '*Refuse* fait partie des verbes suivis de l’infinitif avec *to*, comme *want*, *decide* ou *promise*.'],
        ['Quel verbe complète la phrase ? *Remember ___ the door when you leave!*', ['locking', 'lock', 'to lock', 'locked'], 2, '*Remember* + infinitif = penser à faire quelque chose ; *remember* + -ING = se souvenir de l’avoir fait.'],
        ['Quel verbe complète la phrase ? *I’m interested in ___ Spanish.*', ['learn', 'to learn', 'learned', 'learning'], 3, 'Après une préposition (ici *in*), le verbe se met toujours en -ING.'],
        ['Quel verbe complète la phrase ? *Would you mind ___ the window?*', ['opening', 'to open', 'open', 'opened'], 0, '*Mind* se construit avec le gérondif, comme *enjoy*, *avoid* ou *suggest*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les adverbes',
      questions: [
        ['Quel mot complète la phrase ? *I’m ___ sorry.*', ['terribly', 'terriblely', 'terrible', 'terribley'], 0, 'Pour un adjectif en -le, le e final tombe avant -ly : *terrible* → *terribly*.'],
        ['Comment traduit-on « Malheureusement, ils ont perdu » ?', ['Unfortunate, they lost.', 'Unfortunately, they lost.', 'They unfortunate lost.', 'Unfortunately, they losed.'], 1, 'L’adverbe de phrase se place en tête et se détache par une virgule ; *lose* est irrégulier : *lost*.'],
        ['Quel mot complète la phrase ? *The glass is ___ empty.*', ['nearby', 'closely', 'nearly', 'next'], 2, '*Nearly* est un faux ami : il ne veut pas dire « de près » mais « presque ».'],
        ['Quelle phrase est correcte ?', ['I have seen never this film', 'I have seen this film never', 'Never I have seen this film', 'I have never seen this film'], 3, 'Un adverbe de fréquence se place après l’auxiliaire et avant le verbe lexical : *I have never seen*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le présent simple et le présent en BE + -ING',
      questions: [
        ['Quel verbe complète la phrase ? *Listen! The baby ___.*', ['cries', 'is crying', 'cry', 'crying'], 1, '*Listen!* montre que l’action se déroule en ce moment : présent en *be* + -ING.'],
        ['Quel verbe complète la phrase ? *She ___ to the gym every day.*', ['is going', 'go', 'goes', 'going'], 2, '*Every day* marque une habitude : présent simple, avec le -s de la 3e personne.'],
        ['Dans « I’m having lunch », que signifie *have* ?', ['Posséder', 'Devoir', 'Avoir faim', 'Prendre (un repas)'], 3, '*Have* au sens de « posséder » refuse -ING ; au sens de « prendre » (un repas, une douche), il l’accepte.'],
        ['Quel verbe complète la phrase ? *This book ___ to my brother.*', ['belongs', 'is belonging', 'belong', 'are belonging'], 0, '*Belong* est un verbe d’état (possession) : il ne se met pas en -ING.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le prétérit simple et le prétérit BE + -ING',
      questions: [
        ['Quel mot complète la phrase ? *___ you see the match last night?*', ['Do', 'Have', 'Did', 'Was'], 2, 'À l’interrogatif, le prétérit se forme avec *did* + sujet + base verbale ; *last night* date le fait.'],
        ['Quel est le prétérit de *study* ?', ['studyed', 'studied', 'studed', 'studyied'], 1, 'Après une consonne, le y final devient i devant -ed : *study* → *studied*.'],
        ['Quel mot complète la phrase ? *She ___ born in 2007.*', ['is', 'has been', 'were', 'was'], 3, 'Une naissance datée est un fait passé révolu : prétérit, *she was born*.'],
        ['Quel mot complète la phrase ? *She ___ come to school yesterday.*', ['didn’t', 'doesn’t', 'hasn’t', 'wasn’t'], 0, 'Au prétérit négatif, *did not* porte le passé et le verbe revient à la base : *she didn’t come*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le present perfect et le present perfect BE + -ING',
      questions: [
        ['Quel mot complète la phrase ? *I haven’t finished ___.*', ['already', 'yet', 'since', 'ago'], 1, '*Yet* s’emploie en fin de phrase négative ou interrogative : « pas encore ».'],
        ['Quel mot complète la phrase ? *He has ___ arrived: he’s taking off his coat.*', ['yet', 'ago', 'just', 'since'], 2, '*Just* se place entre *have* et le participe : l’action vient tout juste d’avoir lieu.'],
        ['Comment traduit-on « Je vis ici depuis 2019 » ?', ['I live here since 2019', 'I am living here since 2019', 'I lived here since 2019', 'I have lived here since 2019'], 3, 'Ce qui a commencé dans le passé et dure encore se met au present perfect, là où le français emploie le présent.'],
        ['« I’ve written three letters » met l’accent sur…', ['Le résultat achevé', 'La durée de l’action', 'Une habitude', 'Un projet'], 0, 'Le present perfect simple souligne le résultat : les lettres sont écrites. La forme en -ING soulignerait la durée.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le past perfect et le past perfect BE + -ING',
      questions: [
        ['Dans « He’d gone », que remplace *’d* ?', ['would', 'had', 'did', 'could'], 1, 'Après *’d*, un participe passé (*gone*) signale *had* ; une base verbale (*he’d go*) signalerait *would*.'],
        ['« She has lost her keys », rapporté au passé : *She said she ___ her keys.*', ['has lost', 'lost', 'had lost', 'would lose'], 2, 'Au discours indirect passé, le present perfect recule d’un cran et devient past perfect.'],
        ['Quel groupe complète la phrase ? *Once he ___ his homework, he went out.*', ['has finished', 'finishes', 'will finish', 'had finished'], 3, 'Après *once*, *after* ou *as soon as*, le past perfect marque la première des deux actions passées.'],
        ['Le past perfect se forme avec *had* à toutes les personnes.', ['Vrai', 'Faux'], 0, '*Had* + participe passé ne varie pas : *I had finished*, *she had finished*, *they had finished*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Exprimer le futur et le conditionnel',
      questions: [
        ['Quel groupe complète la phrase ? *We ___ to Dublin on Monday: the tickets are booked.*', ['fly', 'are flying', 'would fly', 'flown'], 1, 'Un programme déjà fixé, avec une date, se dit au présent en *be* + -ING.'],
        ['Quel mot complète la phrase ? *If it rains, I ___ stay home.*', ['would', 'had', 'will', 'am'], 2, 'Type 1, le possible : *if* + présent dans la subordonnée, *will* dans la principale.'],
        ['Quel mot complète la phrase ? *If I had money, I ___ travel.*', ['will', 'had', 'did', 'would'], 3, 'Type 2, l’irréel du présent : *if* + prétérit, puis *would* + base verbale dans la principale.'],
        ['Quel groupe complète la phrase ? *I decided yesterday: I’m ___ visit my grandmother next week.*', ['going to', 'will', 'going', 'go to'], 0, '*Be going to* exprime une intention déjà formée avant le moment où l’on parle.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les questions',
      questions: [
        ['« How often » interroge sur…', ['La durée', 'La distance', 'La fréquence', 'La quantité'], 2, '*How often* demande « combien de fois » ; la durée se dit *how long*, la distance *how far*.'],
        ['Quel est le tag de « She likes it, … » ?', ['isn’t she?', 'doesn’t she?', 'does she?', 'likes she?'], 1, 'La phrase n’a pas d’auxiliaire : le tag le fabrique avec *do*, à la polarité inverse : *doesn’t she?*'],
        ['Quel mot complète la phrase ? *Who ___ you see at the party?*', ['was', 'have', 'does', 'did'], 3, 'Ici *who* est complément (tu as vu qui ?) : l’auxiliaire *did* est obligatoire. Il disparaîtrait si *who* était sujet.'],
        ['Quel mot complète la phrase ? *How ___ is it to the station?*', ['far', 'long', 'often', 'many'], 0, '*How far* interroge sur la distance : « à quelle distance est la gare ? »'],
      ],
    },
    {
      niveaux: N,
      titre: 'La phrase exclamative',
      questions: [
        ['Quel mot complète la phrase ? *___ beautifully she sings!*', ['What', 'How', 'Such', 'So much'], 1, '*How* introduit un adjectif ou un adverbe (*beautifully*) ; *what* introduit un nom.'],
        ['Quel mot complète la phrase ? *What ___ idea!*', ['a', 'Ø (rien)', 'an', 'the'], 2, 'Après *what*, un singulier dénombrable prend l’article, et *idea* commence par un son voyelle : *What an idea!*'],
        ['Quel mot complète la phrase ? *It’s ___ a lovely day!*', ['so', 'how', 'what', 'such'], 3, '*Such* se place devant un groupe nominal (*a lovely day*), comme *what* ; *so* va devant un adjectif seul.'],
        ['Comment traduit-on « Que c’est beau ! », en négation rhétorique ?', ['Isn’t it beautiful!', 'It isn’t beautiful!', 'What beautiful it is!', 'How it is beautiful!'], 0, 'La négation rhétorique *Isn’t it beautiful!* est une exclamation déguisée : elle ne nie rien.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le comparatif et le superlatif',
      questions: [
        ['Quel est le comparatif de *happy* ?', ['more happy', 'happier', 'happyer', 'most happy'], 1, 'Un adjectif de deux syllabes en -y est court : -er, et le y devient i.'],
        ['Quel est le superlatif de *hot* ?', ['the hotest', 'the most hot', 'the hottest', 'hotter'], 2, 'Adjectif court terminé par consonne-voyelle-consonne : on double la consonne finale, *the hottest*.'],
        ['Quel groupe complète la phrase ? *It’s getting ___.*', ['more and more cold', 'cold and colder', 'the colder', 'colder and colder'], 3, 'La progression d’un adjectif court se dit en redoublant le comparatif : *colder and colder*.'],
        ['Quel est l’un des comparatifs de *far* ?', ['further', 'farer', 'more far', 'farest'], 0, '*Far* est irrégulier : *farther* ou *further*, puis *the farthest* ou *the furthest*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les subordonnées',
      questions: [
        ['Quel mot complète la phrase ? *This is the house ___ I was born.*', ['which', 'where', 'who', 'whose'], 1, 'Pour reprendre un lieu, le relatif est *where* : « la maison où je suis né ».'],
        ['Quel mot complète la phrase ? *I won’t go ___ you come with me.*', ['unless', 'although', 'so that', 'whose'], 0, '*Unless* introduit une condition (« à moins que, sauf si ») : je n’irai pas sauf si tu viens.'],
        ['Quelle phrase est correcte ?', ['The man lives next door is a doctor', 'The man which lives next door is a doctor', 'The man who lives next door is a doctor', 'The man whose lives next door is a doctor'], 2, 'Le relatif sujet ne s’efface jamais, et pour une personne on emploie *who* (ou *that*).'],
        ['Quel mot peut introduire la complétive ? *I think ___ he’s right.*', ['which', 'what', 'whose', 'that'], 3, 'La complétive s’introduit par *that*, souvent omis : *I think (that) he’s right*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Exprimer la temporalité et la durée',
      questions: [
        ['Comment traduit-on « il y a deux ans » ?', ['ago two years', 'two years ago', 'since two years', 'for two years ago'], 1, '*Ago* se place après la durée, jamais devant, et appelle le prétérit.'],
        ['Quel mot complète la phrase ? *I’ve known her ___ ten years.*', ['since', 'ago', 'for', 'during'], 2, 'Dix ans est une durée : *for*. *Since* introduirait un point de départ (*since 2015*).'],
        ['Quel mot complète la phrase ? *The shop is open ___ 8 p.m.*', ['by', 'since', 'during', 'until'], 3, '*Until* signifie « jusqu’à » ; *by* voudrait dire « au plus tard, d’ici ».'],
        ['Quel mot complète la phrase ? *You’ll receive it ___ a week.*', ['within', 'since', 'ago', 'during'], 0, '*Within* signifie « d’ici moins de » : tu le recevras en moins d’une semaine.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Exprimer la cause et le but',
      questions: [
        ['Quel groupe complète la phrase ? *He was fined ___ too fast.*', ['to drive', 'for driving', 'because driving', 'for drive'], 1, '*For* + -ING donne la justification d’une sanction : il a eu une amende pour excès de vitesse.'],
        ['Quel mot complète la phrase ? *This present is ___ my sister.*', ['to', 'so that', 'for', 'in order to'], 2, 'Le français « pour » suivi d’un nom se dit *for* ; suivi d’un verbe, il se dit *to*.'],
        ['Quel mot complète la phrase ? *He spoke slowly so that everyone ___ understand.*', ['can to', 'to', 'for', 'could'], 3, 'Après *so that*, on trouve presque toujours un modal ; au passé, *could*.'],
        ['Quel groupe complète la phrase ? *The flight was cancelled ___ the storm.*', ['due to', 'because', 'since', 'so that'], 0, '*Due to* est suivi d’un nom ; *because* et *since* demandent une proposition avec sujet et verbe.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Exprimer la condition, la concession et l’opposition',
      questions: [
        ['Quel mot complète la phrase ? *___ the rain, we went out.*', ['Although', 'Despite', 'Even though', 'Whereas'], 1, '*The rain* est un nom : il faut une préposition, *despite*. *Although* et *even though* demandent une proposition.'],
        ['Quel groupe complète la phrase ? *___ he was tired, he kept working.*', ['Despite', 'In spite of', 'Even though', 'Because of'], 2, '*He was tired* est une proposition complète : seule la conjonction *even though* peut l’introduire.'],
        ['Quel groupe complète la phrase ? *You can borrow my bike ___ you bring it back tonight.*', ['despite', 'whereas', 'although', 'as long as'], 3, '*As long as* pose une condition : « du moment que, à condition que ».'],
        ['Quelle phrase contient une faute ?', ['Unless you don’t hurry, you’ll miss the bus', 'Unless you hurry, you’ll miss the bus', 'If you don’t hurry, you’ll miss the bus', 'Although it was late, we stayed'], 0, '*Unless* contient déjà la négation : *unless you don’t* ferait une double négation et dirait le contraire.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Exprimer l’habitude',
      questions: [
        ['Comment demande-t-on « Tu jouais au foot, autrefois ? »', ['Did you used to play football?', 'Used you play football?', 'Did you use to play football?', 'Were you used to play football?'], 2, 'À l’interrogatif, *used to* perd son -d après *did* : *Did you use to…?*'],
        ['Quel mot complète la phrase ? *Don’t worry, you’ll ___ used to it.*', ['get', 'have', 'do', 'make'], 0, '*Get used to* marque l’apprentissage d’une habitude : « tu t’y feras ».'],
        ['Quel groupe complète la phrase ? *When I was a child, I ___ have long hair.*', ['would', 'used to', 'was used to', 'use to'], 1, 'Avoir les cheveux longs est un état, pas une action répétée : seul *used to* convient, *would* le refuse.'],
        ['Comment traduit-on « Je suis habitué au froid » ?', ['I used to the cold', 'I use to the cold', 'I would the cold', 'I’m used to the cold'], 3, '*Be used to* se construit avec un nom ou un -ING, car *to* y est une préposition.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Faire faire quelque chose à quelqu’un',
      questions: [
        ['Quel verbe complète la phrase ? *Let me ___.*', ['explain', 'to explain', 'explaining', 'explained'], 0, '*Let* exprime la permission et se construit avec la base verbale, sans *to*.'],
        ['Quel verbe complète la phrase ? *We are having our kitchen ___.*', ['paint', 'painted', 'painting', 'to paint'], 1, '*Have something done* : on fait faire la chose par un tiers, et le verbe est au participe passé.'],
        ['Quel groupe complète la phrase ? *He was allowed ___ home early.*', ['go', 'going', 'to go', 'went'], 2, '*Let* n’a pas de passif : on le remplace par *be allowed to* + base verbale.'],
        ['Quel verbe complète la phrase ? *The teacher ___ us rewrite the essay: we had no choice.*', ['let', 'got', 'allowed', 'made'], 3, '*Make* + base verbale exprime la contrainte ; *got* et *allowed* demanderaient *to*, et *let* dirait une permission.'],
      ],
    },
    {
      niveaux: N,
      titre: 'La voix passive',
      questions: [
        ['Quel groupe complète la phrase ? *The decision ___ made.* (present perfect)', ['is been', 'has been', 'has being', 'have be'], 1, 'Au present perfect, le passif se forme avec *has / have been* + participe passé.'],
        ['Quel groupe complète la phrase ? *The results ___ next week.*', ['will published', 'will be publish', 'will be published', 'are publishing'], 2, 'Au futur, *be* porte le temps (*will be*) et le participe passé ne bouge pas.'],
        ['Comment traduit-on « On dit que… » ?', ['It says that…', 'One is said that…', 'It is saying that…', 'It is said that…'], 3, 'La tournure impersonnelle passive *It is said that…* rend le « on dit que » français.'],
        ['Quel groupe complète la phrase ? *English ___ all over the world.*', ['is spoken', 'is speaking', 'speaks', 'is spoke'], 0, 'Passif au présent : *is* + participe passé *spoken*. Le français dirait « on parle anglais partout ».'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le discours indirect',
      questions: [
        ['« Don’t move! » devient : *He told me ___.*', ['to don’t move', 'not to move', 'don’t to move', 'not moving'], 1, 'Un ordre négatif se rapporte avec *not to* + base verbale.'],
        ['« I will call you » devient : *She said she ___ call me.*', ['will', 'had', 'would', 'shall'], 2, 'Au discours indirect passé, *will* recule d’un cran et devient *would*.'],
        ['« Yesterday » devient au discours indirect passé…', ['the next day', 'that day', 'then', 'the day before'], 3, 'Les repères de temps se déplacent : *yesterday* devient *the day before*, *tomorrow* devient *the next day*.'],
        ['« I saw my brother » devient : *He said he ___ his brother.*', ['had seen', 'has seen', 'sees', 'would see'], 0, 'Le prétérit recule en past perfect, et le possessif s’ajuste au nouveau locuteur (*my* → *his*).'],
      ],
    },
  ],
}
