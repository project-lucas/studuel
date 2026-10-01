// Anglais 5e / 4e (fiches communes) — QUESTIONS EN PLUS, lot 02 : quatre
// questions de plus par quiz, sur des notions du cours que les huit questions
// existantes ne testaient pas encore. Niveau 5e (le plus jeune des deux).

export default {
  slug: 'anglais',
  titreMigration: 'QUESTIONS EN PLUS — ANGLAIS 5e-4e (lot 02)',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveaux: ["5e","4e"], titre: "Phrase simple et phrase complexe",
      questions: [
        ['Quelle phrase est correcte ?', ['I speak well English.', 'I well speak English.', 'I speak English well.', 'I speak English good.'], 2, 'L’adverbe ne se glisse jamais entre le verbe et son complément d’objet : il vient après l’objet, I speak English well.'],
        ['Dans « I think he is right », quel mot a été omis ?', ['which', 'that', 'who', 'what'], 1, 'He is right est une subordonnée complétive, introduite par that. L’anglais omet très souvent ce that : I think (that) he is right.'],
        ['Quelle conjonction introduit une condition ?', ['because', 'while', 'so that', 'unless'], 3, 'Unless (« à moins que, sauf si ») introduit une condition, comme if. Because introduit la cause, while le temps et so that le but.'],
        ['Dans « She was tired, so she went to bed », quel procédé relie les deux propositions ?', ['La coordination', 'La subordination de cause', 'La subordination relative', 'La subordination de but'], 0, 'So relie deux propositions de même rang, qui pourraient chacune tenir seule : c’est la coordination. Ne le confonds pas avec so that, qui introduit un but.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les pronoms personnels",
      questions: [
        ['This bag isn’t mine. Is it ___?', ['your', 'yours', 'you', 'yourself'], 1, 'Le pronom possessif remplace tout le groupe (your bag) et s’emploie seul : yours. Your est l’adjectif possessif, toujours suivi d’un nom.'],
        ['I can’t find my keys. Can you help ___?', ['I', 'my', 'mine', 'me'], 3, 'Après un verbe ou une préposition, on emploie le pronom complément : me, him, her, us, them. I ne s’emploie que comme sujet.'],
        ['Comment dit-on « Je l’ai fait moi-même » ?', ['I did it by me.', 'I did myself it.', 'I did it myself.', 'I did it to me.'], 2, 'Le pronom réfléchi sert aussi à insister : I did it myself, placé en fin de phrase.'],
        ['Dans « He hurt himself », à quoi sert « himself » ?', ['À dire que l’action revient sur le sujet', 'À dire qu’il était tout seul', 'À éviter de répéter un nom', 'À marquer la possession'], 0, 'Il s’est fait mal à lui-même : l’action revient sur le sujet, d’où le réfléchi. « Tout seul » se dirait by himself.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les pronoms relatifs",
      questions: [
        ['This is the town ___ I was born.', ['which', 'who', 'where', 'whose'], 2, 'L’antécédent est un lieu (the town) : le relatif est where, « où ».'],
        ['I will never forget the day ___ we met.', ['when', 'where', 'who', 'whose'], 0, 'Après un antécédent de temps (the day, the year), le relatif est when.'],
        ['Quel pronom relatif peut remplacer who ou which dans une relative déterminative ?', ['who', 'which', 'whose', 'that'], 3, 'That convient aux personnes comme aux choses, mais seulement dans une relative déterminative, sans virgules : the man that…, the book that…'],
        ['Quelle est la forme soutenue de « the girl who I spoke to » ?', ['the girl to who I spoke', 'the girl to whom I spoke', 'the girl whom to I spoke', 'the girl to that I spoke'], 1, 'Dans la langue soutenue, la préposition remonte devant le relatif, qui devient whom. En anglais courant, elle reste à la fin de la relative.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "La phrase interrogative",
      questions: [
        ['Quelle question est correcte ?', ['Do you are ready?', 'Are you ready?', 'Are ready you?', 'Does you be ready?'], 1, 'Avec be, on n’ajoute pas do : be passe simplement devant le sujet. Do ne sert qu’aux temps simples des autres verbes.'],
        ['Quel mot interrogatif demande « à qui » ?', ['who', 'which', 'whose', 'what'], 2, 'Whose interroge sur le possesseur : Whose bag is this? — It’s Kate’s. Who demande seulement « qui ».'],
        ['Dans « Who did you see? », quelle est la fonction de « who » ?', ['Sujet du verbe see', 'Auxiliaire de la question', 'Mot de liaison', 'Complément du verbe see'], 3, 'C’est you qui voit : who est complément, donc on introduit did et on inverse. Quand who est sujet (Who broke the window?), pas de do.'],
        ['___ is your sister? — She is twelve.', ['How old', 'How long', 'How far', 'How much'], 0, 'How old interroge sur l’âge. How long demande une durée, how far une distance, how much une quantité ou un prix.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les question tags",
      questions: [
        ['You can swim, ___?', ['can you', 'can’t you', 'don’t you', 'aren’t you'], 1, 'Can est déjà un auxiliaire : le tag le reprend, à la forme négative puisque la phrase est affirmative.'],
        ['Close the door, ___?', ['do you', 'don’t you', 'shall we', 'will you'], 3, 'Après un impératif, le tag est will you? : il adoucit l’ordre, comme « tu veux bien ? ».'],
        ['Somebody called, ___?', ['didn’t they', 'didn’t he', 'did they', 'didn’t it'], 0, 'Avec un sujet indéfini (somebody, nobody, everyone), le tag reprend le pronom they ; la phrase est affirmative, le tag est donc négatif.'],
        ['Que signifie une intonation montante sur le tag ?', ['Qu’on est sûr et qu’on attend l’accord', 'Qu’on donne un ordre poli', 'Qu’on doute vraiment : c’est une vraie question', 'Qu’on est très surpris'], 2, 'Intonation montante : on doute et on pose une vraie question. Intonation descendante : on est sûr et on cherche seulement l’accord.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "La phrase exclamative",
      questions: [
        ['Quelle phrase est correcte ?', ['What a terrible weather!', 'How terrible weather!', 'What terrible weather!', 'What terrible a weather!'], 2, 'Weather est indénombrable : après what, pas d’article. What a / an ne s’emploie que devant un nom singulier dénombrable.'],
        ['Que signifie « How come? » ?', ['Comment es-tu venu ?', 'Viens vite ici !', 'Quelle belle arrivée !', 'Comment ça se fait ?'], 3, 'How come? est une exclamation toute faite qui marque la surprise : « Comment ça se fait ? ». Elle ne parle pas de venir.'],
        ['They are ___ nice people!', ['so', 'such', 'such a', 'how'], 1, 'Devant un adjectif suivi d’un nom pluriel ou indénombrable, on emploie such sans article : such nice people. So se met devant un adjectif seul.'],
        ['Quelle exclamation sert à féliciter quelqu’un ?', ['Well done!', 'No way!', 'What a shame!', 'How come?'], 0, 'Well done! signifie « Bravo ! ». No way! veut dire « Pas question ! » et What a shame! « Quel dommage ! ».'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "La voix passive",
      questions: [
        ['Quel est le passif de « They built this bridge in 1990 » ?', ['This bridge is built in 1990.', 'This bridge was built in 1990.', 'This bridge has built in 1990.', 'This bridge was build in 1990.'], 1, 'Be se met au même temps que le verbe actif : built est au prétérit, donc was built, suivi du participe passé.'],
        ['Quel est le passif de « They will finish the work » ?', ['The work will finished.', 'The work will be finish.', 'The work is finished.', 'The work will be finished.'], 3, 'Au futur, be garde will devant lui : will be + participe passé (finished).'],
        ['Quel est le passif de « People speak English here » ?', ['English is speaking here.', 'English speaks here.', 'English is spoken here.', 'English has speak here.'], 2, 'Speak est au présent simple, donc be se met au présent : is spoken. Is speaking (be + -ING) serait une forme progressive, pas un passif.'],
        ['Quelle phrase est à la voix passive ?', ['The letters are sent every day.', 'The postman sends the letters.', 'The postman is sending letters.', 'The letters have arrived.'], 0, 'Are sent = be + participe passé : le sujet (the letters) subit l’action. Is sending est un présent en BE + -ING actif, have arrived un present perfect actif.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Le comparatif",
      questions: [
        ['Quel est le comparatif de « big » ?', ['bigger than', 'biger than', 'more big than', 'more bigger than'], 0, 'Big est un adjectif court qui double sa consonne finale devant -er : bigger than.'],
        ['Quel est le comparatif de « happy » ?', ['more happy than', 'happyer than', 'happier than', 'more happier than'], 2, 'Happy a deux syllabes mais finit en -y : il se comporte comme un adjectif court, et le y devient i devant -er.'],
        ['Comment traduit-on « Ce livre est moins cher que l’autre » ?', ['This book is more cheap than the other.', 'This book is less expensiver than the other.', 'This book is fewer expensive than the other.', 'This book is less expensive than the other.'], 3, 'L’infériorité se forme avec less + adjectif + than, sans -er. Fewer se place devant un nom dénombrable, jamais devant un adjectif.'],
        ['The more you practise, ___ you get.', ['better', 'the better', 'the best', 'more better'], 1, 'La structure « plus… plus… » répète the + comparatif dans les deux parties : The more…, the better…'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Le superlatif",
      questions: [
        ['Quel est le superlatif de « bad » ?', ['the baddest', 'the worse', 'the most bad', 'the worst'], 3, 'Bad est irrégulier : bad, worse (comparatif), the worst (superlatif).'],
        ['It was the coldest day ___ the year.', ['in', 'of', 'at', 'from'], 1, 'Devant un ensemble ou une période (the year, the three), le superlatif est suivi de of ; in introduit un lieu ou un groupe (in the class).'],
        ['Comment dit-on « le moins cher » ?', ['the least expensive', 'the lesser expensive', 'the most cheap', 'the fewest expensive'], 0, 'Le superlatif d’infériorité se forme avec the least + adjectif, quelle que soit la longueur de l’adjectif.'],
        ['Quel est le superlatif de « big » ?', ['the bigest', 'the most big', 'the biggest', 'the more big'], 2, 'Big double sa consonne finale devant -est, comme devant -er : bigger, the biggest.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Exprimer l’habitude",
      questions: [
        ['Comment demande-t-on « Habitais-tu ici avant ? » ?', ['Did you used to live here?', 'Did you use to live here?', 'Were you use to live here?', 'Do you used to live here?'], 1, 'Comme à la négation, used to perd son -d après did : Did you use to live here?'],
        ['Quelle phrase est correcte ?', ['She always is late.', 'She is late always.', 'Always she is late.', 'She is always late.'], 3, 'Un adverbe de fréquence se place après be (ou après l’auxiliaire), mais avant le verbe lexical : She is always late, She always plays.'],
        ['Que signifie « I am used to getting up early » ?', ['Je me levais tôt autrefois', 'Je vais bientôt me lever tôt', 'J’ai l’habitude de me lever tôt', 'Je dois me lever tôt'], 2, 'Be used to + -ING signifie « être habitué à, avoir l’habitude de ». « Je me levais tôt autrefois » se dirait I used to get up early.'],
        ['Comment dit-on « Chaque été, nous allions à la plage » ?', ['Every summer, we would go to the beach.', 'Every summer, we would went to the beach.', 'Every summer, we were used to go to the beach.', 'Every summer, we would going to the beach.'], 0, 'Would + base verbale décrit une action répétée dans le passé, comme l’imparfait « nous allions ». Used to go conviendrait aussi.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Exprimer le but",
      questions: [
        ['Quelle réponse à « Why did you call? » est correcte ?', ['For ask you something.', 'To ask you something.', 'For asking you something.', 'So that ask you something.'], 1, 'Pour répondre à why par un but, on commence souvent par to + base verbale : To ask you something. For + verbe est l’erreur classique.'],
        ['Quelle expression a le même sens que « in order to », dans le même registre formel ?', ['so as to', 'so that', 'for', 'such as'], 0, 'So as to et in order to expriment le but dans un registre formel, suivis de la base verbale. So that introduit une proposition complète, avec son propre sujet.'],
        ['She saved money so that her son ___ study abroad.', ['can', 'to', 'could', 'for'], 2, 'So that est suivi d’une proposition complète, souvent avec un modal ; ici le récit est au passé (saved), d’où could.'],
        ['Que signifie « I went to the shop for bread » ?', ['Je suis allé au magasin grâce au pain', 'Je suis allé au magasin à cause du pain', 'Je suis allé au magasin avec du pain', 'Je suis allé au magasin chercher du pain'], 3, 'For + nom indique ce qu’on va chercher. Devant un verbe, il faudrait to : I went to the shop to buy bread.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Exprimer la durée",
      questions: [
        ['Comment traduit-on « Ça fait deux ans que je ne l’ai pas vu » ?', ['It’s two years ago I saw him.', 'It’s been two years for I saw him.', 'It’s been two years since I saw him.', 'It has two years since I saw him.'], 2, 'La tournure it’s been + durée + since + prétérit mesure le temps écoulé depuis un moment du passé.'],
        ['It rained a lot ___ the holidays.', ['since', 'during', 'ago', 'while'], 1, 'During (« pendant ») se place devant un nom : during the holidays. Devant une durée chiffrée, on emploie for : for two hours.'],
        ['Quelle phrase dit que Tom ne travaille plus là-bas ?', ['Tom worked there for two years.', 'Tom has worked there for two years.', 'Tom has worked there since two years.', 'Tom works there since two years.'], 0, 'For s’emploie à tous les temps : au prétérit (worked), la période est finie ; au present perfect (has worked), elle dure encore.'],
        ['Quel groupe peut suivre « since » ?', ['two hours', 'a long time', 'ages', 'this morning'], 3, 'Since se construit avec un point de départ (this morning, Monday, 2020). Two hours, a long time et ages sont des durées : elles prennent for.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Le discours indirect",
      questions: [
        ['« I can’t come tonight. » → She said she ___ come that night.', ['can’t', 'couldn’t', 'won’t', 'didn’t'], 1, 'Après un verbe introducteur au passé (said), can recule en could, comme will devient would.'],
        ['Que devient « tomorrow » au discours indirect ?', ['the day before', 'yesterday', 'that day', 'the next day'], 3, 'Les repères s’adaptent au moment du récit : tomorrow devient the next day, yesterday the day before, today that day.'],
        ['Comment rapporte-t-on « Don’t be late. » ?', ['She told me not to be late.', 'She told me don’t be late.', 'She told me to not late.', 'She said me not to be late.'], 0, 'Un ordre négatif se rapporte avec tell + complément + not to + base verbale. Say ne prend pas de complément de personne.'],
        ['Comment rapporte-t-on « I lost my keys » ?', ['He said he lost my keys.', 'He said I had lost my keys.', 'He said he had lost his keys.', 'He said he has lost his keys.'], 2, 'Les pronoms et les possessifs s’adaptent au nouveau locuteur (I → he, my → his), et le prétérit recule en past perfect.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les noms",
      questions: [
        ['Quel est le pluriel de « watch » ?', ['watchs', 'watches', 'watchies', 'watchen'], 1, 'Après -s, -sh, -ch ou -x, le pluriel se forme en -es : watches, boxes.'],
        ['Quel est le pluriel de « mouse » ?', ['mouses', 'mices', 'mouse', 'mice'], 3, 'Mouse fait partie des pluriels irréguliers : mice, sans -s, comme man → men ou foot → feet.'],
        ['Comment écrit-on « les livres des élèves » ?', ['the students’ books', 'the student’s books', 'the students’s books', 'the books’ students'], 0, 'Quand le possesseur est un pluriel en -s, on ajoute seulement l’apostrophe : the students’ books. The student’s books = les livres d’un seul élève.'],
        ['Quel est le pluriel de « key » ?', ['kies', 'keyes', 'keys', 'keies'], 2, 'Le y ne devient -ies qu’après une consonne (city → cities). Après une voyelle, comme dans key ou boy, on ajoute simplement -s.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les articles définis et les articles indéfinis",
      questions: [
        ['I saw a dog in the park. ___ dog was very big.', ['A', 'The', 'An', 'Some'], 1, 'Au premier emploi, le chien n’est pas identifié : a dog. Une fois mentionné, il est connu : the dog.'],
        ['Quelle phrase est correcte ?', ['I have the breakfast at seven.', 'I have a breakfast at seven.', 'I have the breakfast at the seven.', 'I have breakfast at seven.'], 3, 'Les repas s’emploient sans article en anglais : have breakfast, for lunch. Le français dit « le petit déjeuner », l’anglais rien.'],
        ['Pourquoi dit-on « the sun » ?', ['Parce que le soleil est unique', 'Parce que sun commence par une consonne', 'Parce que sun est un nom pluriel', 'Parce que sun est un nom propre'], 0, 'Un objet unique est toujours identifié : il prend the, comme the moon.'],
        ['Comment traduit-on « Il apprend l’anglais » ?', ['He learns the English.', 'He learns an English.', 'He learns English.', 'He learns the english.'], 2, 'Les langues, comme les pays et les villes, s’emploient sans article, avec une majuscule : English, France, Paris.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les adjectifs démonstratifs",
      questions: [
        ['Qu’entend-on de différent entre « this » et « these » ?', ['La consonne du début', 'La longueur de la voyelle', 'Le s final, qui est muet', 'L’accent tonique du mot'], 1, 'This se prononce avec un [ɪ] court, these avec un [iː] long : c’est la seule différence audible entre le singulier et le pluriel.'],
        ['Look at ___ birds up there in the sky!', ['this', 'these', 'that', 'those'], 3, 'Les oiseaux sont loin (up there) et ils sont plusieurs : pluriel + éloigné = those.'],
        ['Dans « That was strange! », que reprend « that » ?', ['Un fait qui vient de se passer', 'Un objet que l’on tient', 'Une personne toute proche', 'Un moment qui va arriver'], 0, 'That renvoie au passé ou à ce qui s’éloigne : ici, ce qui vient d’arriver. This renvoie plutôt au présent ou au futur proche.'],
        ['En anglais, le démonstratif change selon que le nom est masculin ou féminin.', ['Vrai', 'Faux'], 1, 'Les démonstratifs ne varient qu’en nombre et en distance : this boy et this girl, these boys et these girls.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Exprimer la possession",
      questions: [
        ['___ bag is this? — It’s Kate’s.', ['Who', 'Whose', 'Whom', 'Who’s'], 1, 'Whose interroge sur le possesseur : « À qui est ce sac ? ». Who’s est la contraction de who is.'],
        ['Comment traduit-on « le journal d’aujourd’hui » ?', ['the newspaper of today', 'today newspaper', 'today’s newspaper', 'the today’s newspaper'], 2, 'Le génitif en ’s s’emploie aussi avec les expressions de temps : today’s newspaper, a week’s holiday.'],
        ['This isn’t my pen. It’s ___.', ['her', 'her’s', 'she’s', 'hers'], 3, 'Le pronom possessif remplace tout le groupe (her pen) : hers, sans apostrophe et sans nom derrière.'],
        ['The Smiths love ___ new house.', ['their', 'theirs', 'them', 'they'], 0, 'Devant un nom, on emploie l’adjectif possessif : their house. Theirs est le pronom, employé seul : The house is theirs.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Exprimer une quantité",
      questions: [
        ['There is ___ milk in the fridge. We must buy some.', ['no', 'any', 'many', 'a few'], 0, 'No signifie « pas de » et équivaut à not any : There is no milk = There isn’t any milk.'],
        ['Quelle phrase est correcte ?', ['She doesn’t run enough fast.', 'She doesn’t run enough of fast.', 'She doesn’t enough run fast.', 'She doesn’t run fast enough.'], 3, 'Enough se place après un adjectif ou un adverbe (fast enough), mais devant un nom (enough money).'],
        ['There are too ___ people in this room.', ['much', 'many', 'lot', 'little'], 1, 'People est un pluriel dénombrable : « trop de » se dit too many. Too much s’emploie avec un indénombrable.'],
        ['___ student has a locker at school.', ['All', 'Both', 'Every', 'Many'], 2, 'Every est suivi d’un nom singulier : every student, et le verbe est au singulier (has). All, both et many demandent un pluriel.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les adjectifs qualificatifs",
      questions: [
        ['Que signifie « The dog was frightened » ?', ['Le chien faisait peur', 'Le chien était surprenant', 'Le chien avait peur', 'Le chien était fatigant'], 2, 'La terminaison -ed décrit ce que ressent le sujet : frightened = effrayé. Un chien qui fait peur serait frightening.'],
        ['The trip was long and ___. I need to sleep!', ['tired', 'tiring', 'tire', 'tiredly'], 1, 'Le voyage provoque la fatigue : tiring (fatigant). Tired (fatigué) décrit ce que ressent une personne : I am tired.'],
        ['Que désigne « the young » ?', ['Le jeune homme', 'La jeunesse d’une personne', 'Le plus jeune de la famille', 'Les jeunes, en général'], 3, 'Précédé de the, certains adjectifs désignent tout un groupe de personnes : the young = les jeunes, avec un verbe au pluriel.'],
        ['Quel groupe respecte l’ordre des adjectifs ?', ['an old French wooden table', 'a French old wooden table', 'a wooden old French table', 'an old wooden French table'], 0, 'L’ordre va de l’âge (old) à l’origine (French) puis à la matière (wooden), juste avant le nom.'],
      ],
    },
    {
      niveaux: ["5e","4e"], titre: "Les verbes lexicaux et les auxiliaires",
      questions: [
        ['Quelle phrase est correcte ?', ['She cans swim.', 'She can swims.', 'She can swim.', 'She does can swim.'], 2, 'Les modaux sont invariables : pas de -s à la 3e personne, et le verbe qui suit reste à la base verbale.'],
        ['Quelle est la forme négative de « He plays tennis » ?', ['He doesn’t play tennis.', 'He doesn’t plays tennis.', 'He not plays tennis.', 'He plays not tennis.'], 0, 'Au présent simple, la négation passe par does + not ; le -s est porté par l’auxiliaire, et play revient à la base verbale.'],
        ['Comment pose-t-on la question à partir de « She is French » ?', ['Does she be French?', 'Is she French?', 'Does she is French?', 'Is French she?'], 1, 'Même quand il est le verbe principal, be garde ses pouvoirs d’auxiliaire : il passe lui-même devant le sujet, sans do.'],
        ['Lequel de ces verbes est un verbe lexical ?', ['can', 'must', 'should', 'think'], 3, 'Un verbe lexical porte le sens de l’action (think, work, eat). Can, must et should sont des modaux, qui construisent la phrase.'],
      ],
    },
  ],
}
