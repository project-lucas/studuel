// Espagnol 2de → Tle — QUESTIONS EN PLUS : quatre questions de plus par quiz.
//
// Les trois niveaux du lycée portent les mêmes fiches (titres vérifiés dans les
// extractions de 2de, 1re et Tle) : chaque chapitre est écrit une fois pour les
// trois. Les questions diffèrent de celles ajoutées en 3e sur les mêmes fiches,
// pour qu’un élève qui monte de classe en trouve de nouvelles.

const N = ['2de', '1re', 'Tle']

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
  slug: 'espagnol',
  titreMigration: 'QUESTIONS EN PLUS — ESPAGNOL 2de → Tle',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveaux: N,
      titre: 'Les questions',
      questions: [
        ['Quelle phrase est correctement écrite ?', ['¿Cómo te llamas?', 'Cómo te llamas?', '¿Como te llamas?', '¿Cómo te llamas¿'], 0, 'Deux signes, ¿ à l’ouverture et ? à la fermeture, et l’accent obligatoire sur le mot interrogatif.'],
        ['Quel est le pluriel de l’interrogatif « quién » ?', ['quienes', 'quiénes', 'quiénos', 'quién'], 1, 'Quién a un pluriel, quiénes, qui garde l’accent. Sans accent, quienes est un relatif.'],
        ['Comment traduire « Combien de sœurs as-tu ? »', ['¿Cuántos hermanas tienes?', '¿Cuánto hermanas tienes?', '¿Cuántas hermanas tienes?', '¿Cuantas hermanas tienes?'], 2, 'Cuánto s’accorde avec le nom qu’il accompagne (hermanas : féminin pluriel) et porte un accent.'],
        ['Dans « La razón por que lo hizo », « por que » est…', ['un mot interrogatif', 'une conjonction de cause', 'un nom masculin', 'une préposition suivie d’un relatif'], 3, 'Por que, en deux mots sans accent, est la forme rare : préposition + relatif, « pour laquelle ».'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les temps du passé',
      questions: [
        trou('Ayer ___ al cine con mis amigos.', ['he ido', 'fui', 'iré', 'voy'], 1, 'Ayer coupe le fait du présent : on emploie l’indefinido. « Ayer he ido » est la faute classique du francophone.'),
        ['Quel marqueur appelle plutôt l’imperfecto ?', ['ayer', 'en 1998', 'mientras', 'hoy'], 2, 'Mientras introduit une action en cours, qui dure : c’est le terrain de l’imperfecto.'],
        ['Quelle est la 3e personne du singulier de l’indefinido de « comer » ?', ['comía', 'comé', 'comó', 'comió'], 3, 'Les verbes en -er et -ir font -ió à la 3e personne de l’indefinido : comió. Comía est l’imperfecto.'],
        ['Quelle est la terminaison de l’imperfecto des verbes en -er à « nosotros » ?', ['-íamos', '-imos', '-emos', '-ábamos'], 0, 'Comíamos, vivíamos : -íamos, avec accent. -ábamos est réservé aux verbes en -ar.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Ser, estar et les tournures essentielles',
      questions: [
        trou('Mi madre ___ profesora.', ['es', 'está', 'hay', 'tiene'], 0, 'La profession définit la personne : on emploie ser.'),
        ['Pourquoi dit-on « El hielo es frío » mais « La sopa está fría » ?', ['Les deux phrases sont fautives', 'La glace est froide par nature, la soupe a refroidi', 'Hielo est masculin, sopa féminin', 'Ser s’emploie au masculin, estar au féminin'], 1, 'Ser dit ce qu’est la chose, estar le résultat d’un changement : la soupe n’est pas froide par nature.'],
        ['Que veut dire « Juan está malo » ?', ['Juan est méchant', 'Juan est mauvais élève', 'Juan est malade', 'Juan est en retard'], 2, 'Ser malo : être méchant. Estar malo : être malade.'],
        ['Comment dit-on « il y a trois jours » (temps écoulé) ?', ['Hay tres días', 'Está tres días', 'Son tres días', 'Hace tres días'], 3, 'Le temps écoulé se dit avec hace : hace tres días. Hay pose l’existence d’une chose.'],
      ],
    },
    {
      niveaux: N,
      titre: 'La négation',
      questions: [
        trou('No me gusta ___ el té ni el café.', ['ni', 'o', 'no', 'nada'], 0, 'Ni… ni correspond au français « ni… ni » : no me gusta ni el té ni el café.'),
        ['Comment traduire « Je ne te le dis pas » ?', ['Te no lo digo', 'No te lo digo', 'Te lo no digo', 'No digo te lo'], 1, 'Rien ne s’intercale entre no et le verbe, sauf les pronoms compléments : No te lo digo.'],
        ['Quel mot négatif signifie « personne » ?', ['nada', 'ninguno', 'nadie', 'nunca'], 2, 'Nadie signifie « personne », nada « rien », ninguno « aucun », nunca « jamais ».'],
        ['Que signifie « aún no » ?', ['Déjà', 'Ne… plus', 'Jamais', 'Pas encore'], 3, 'Aún no, comme todavía no, signifie « pas encore ». Ne pas le confondre avec ya no (ne… plus).'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le monde hispanique aujourd’hui',
      questions: [
        ['Au Mexique, quel mot désigne couramment la voiture (« coche » en Espagne) ?', ['carro', 'camión', 'tren', 'platicar'], 0, 'Le lexique mexicain dit carro pour coche, et platicar pour hablar : ce sont des normes régionales, pas des fautes.'],
        ['Qui a dirigé la dictature chilienne de 1973 à 1990 ?', ['Franco', 'Pinochet', 'Perón', 'Batista'], 1, 'Augusto Pinochet a dirigé le Chili de 1973 à 1990. Franco a gouverné l’Espagne de 1939 à 1975.'],
        ['Qu’est-ce que le « seseo » ?', ['L’emploi de vos à la place de tú', 'La chute du s final', 'La prononciation de z et c comme un s', 'L’emploi de usted entre amis'], 2, 'Le seseo, courant en Andalousie et dans toute l’Amérique, prononce z et c comme un s.'],
        ['Comment appelle-t-on le passage de l’Espagne à la démocratie, entre 1975 et 1978 ?', ['la Reconquista', 'la movida', 'la guerra civil', 'la transición'], 3, 'La transición suit la mort de Franco (1975) et aboutit à la Constitution de 1978.'],
      ],
    },
    {
      niveaux: N,
      titre: 'La proposition subordonnée relative',
      questions: [
        ['« No conozco a nadie que sepa ruso. » Que devient la phrase si l’on connaît quelqu’un ?', ['Conozco a alguien que sabe ruso', 'Conozco a alguien que sepa ruso', 'Conozco a nadie que sabe ruso', 'Conozco alguien quien sepa ruso'], 0, 'L’antécédent n’est plus nié mais réel : la relative repasse à l’indicatif (sabe).'],
        ['Que signifie « Las que llegaron tarde no entraron » ?', ['Elles sont arrivées tard et sont entrées', 'Celles qui sont arrivées en retard ne sont pas entrées', 'Ce qui est arrivé tard n’est pas entré', 'Elles ne sont pas arrivées à l’heure'], 1, 'Las que reprend un antécédent implicite féminin pluriel : « celles qui ».'],
        ['Dans « El chico del que hablo », pourquoi la préposition « de » est-elle devant le relatif ?', ['Parce que chico est masculin', 'Pour faire une contraction obligatoire', 'Parce que l’espagnol ne rejette jamais la préposition à la fin', 'Parce que la relative est explicative'], 2, 'Hablar de : la préposition précède toujours le relatif. « El chico que hablo de » est impossible.'],
        ['Comment traduire « la raison pour laquelle » ?', ['la razón que por', 'la razón para cual', 'la razón que', 'la razón por la que'], 3, 'La préposition passe devant le relatif, qui prend l’article : por la que.'],
      ],
    },
    {
      niveaux: N,
      titre: 'La proposition subordonnée complétive',
      questions: [
        trou('Me molesta que ___ tan tarde.', ['llegues', 'llegas', 'llegar', 'llegarás'], 0, 'Un verbe de sentiment (molestar) commande le subjonctif dans la complétive.'),
        trou('Espero que me ___ pronto.', ['llamas', 'llames', 'llamar', 'llamarás'], 1, 'Esperar que exprime un souhait : la complétive passe au subjonctif.'),
        trou('No es verdad que ___ tanto en Sevilla.', ['llueve', 'lloverá', 'llueva', 'llovía'], 2, 'Nier une certitude fait basculer au subjonctif : es verdad que llueve, mais no es verdad que llueva.'),
        ['Quel verbe principal introduit une complétive à l’indicatif ?', ['Querer', 'Dudar', 'Esperar', 'Ver'], 3, 'Ver est un verbe de perception : Veo que está cansado. Volonté, doute et souhait appellent le subjonctif.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Genre et nombre',
      questions: [
        ['Lequel de ces noms est féminin ?', ['costumbre', 'viaje', 'amor', 'clima'], 0, 'Les noms en -umbre sont féminins : la costumbre. Viaje (-aje), amor (-or) et clima (-ma grec) sont masculins.'],
        ['Comment dit-on « l’analyse » ?', ['la análisis', 'el análisis', 'la analisa', 'el analisis'], 1, 'Análisis est masculin en espagnol, contrairement au français : el análisis.'],
        ['Comment dit-on « le nez » ?', ['el nariz', 'el naso', 'la nariz', 'la narice'], 2, 'Nariz est féminin : la nariz. C’est un des pièges à apprendre avec son article.'],
        ['Quel article accompagne « paisaje » ?', ['la', 'las', 'los', 'el'], 3, 'Les noms en -aje sont masculins : el paisaje, el viaje, el garaje.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les articles',
      questions: [
        trou('No entiendo ___ dices.', ['lo que', 'el que', 'que', 'lo cual'], 0, 'Lo que signifie « ce que » : No entiendo lo que dices.'),
        ['Pourquoi écrit-on « Voy a El Escorial » sans contraction ?', ['Parce que Escorial est féminin', 'Parce que l’article fait partie du nom propre', 'Parce que la contraction est facultative', 'Parce que ir est un verbe de mouvement'], 1, 'La contraction a + el ne se fait pas quand l’article appartient à un nom propre.'],
        ['Que signifie « lo mejor » ?', ['Le meilleur élève', 'Il vaut mieux', 'Le mieux, ce qu’il y a de mieux', 'Les meilleurs'], 2, 'Lo devant un adjectif en fait une idée abstraite : lo mejor, ce qu’il y a de mieux.'],
        ['Dans « el águila », le nom devient-il masculin ?', ['Oui, il devient masculin', 'Oui, mais seulement au pluriel', 'Il devient neutre', 'Non, il reste féminin : el águila blanca'], 3, 'L’article el n’est qu’une question de son, devant un a- tonique : l’adjectif reste au féminin, et le pluriel est las águilas.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les démonstratifs',
      questions: [
        ['Dans « Este es mío », que est « este » ?', ['Un pronom démonstratif', 'Un adjectif démonstratif', 'Un article', 'Un neutre'], 0, 'Employé seul, sans nom derrière lui, este est un pronom. Depuis 2010, il ne prend plus d’accent.'],
        ['Quel est le féminin pluriel de « aquel » ?', ['aquelas', 'aquellas', 'aquellos', 'aquelles'], 1, 'La troisième série fait aquel, aquella, aquellos, aquellas.'],
        ['Que signifie « ni esto ni aquello » ?', ['Ceci et cela', 'Ici et là-bas', 'Ni l’un ni l’autre', 'Ni maintenant ni jamais'], 2, 'Ni esto ni aquello, avec deux neutres : ni l’un ni l’autre.'],
        ['Quel adverbe de lieu correspond à « aquel » ?', ['aquí', 'ahí', 'acá', 'allí'], 3, 'Aquel désigne ce qui est loin de nous deux : il va avec allí.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les adjectifs',
      questions: [
        ['Comment dit-on « la langue espagnole » ?', ['la lengua española', 'la española lengua', 'la lengua español', 'el lengua española'], 0, 'L’adjectif de nationalité se place après le nom et forme un féminin : la lengua española.'],
        ['Comment dit-on « une question facile » ?', ['una pregunta fácila', 'una pregunta fácil', 'una pregunta facila', 'una fácila pregunta'], 1, 'Un adjectif terminé par une consonne (hors nationalité, -or, -ón, -ín) est invariable en genre : fácil.'],
        ['Pourquoi dit-on « la blanca nieve », avec l’adjectif devant ?', ['C’est une faute tolérée', 'Parce que nieve est féminin', 'La blancheur est une qualité attendue de la neige : l’adjectif ne classe pas', 'Parce que les couleurs se placent toujours devant'], 2, 'Devant le nom, l’adjectif exprime une qualité attendue ou le regard de celui qui parle ; il ne sert pas à distinguer une neige d’une autre.'],
        ['Comment dit-on « une maison blanche » ?', ['una blanca casa', 'una casa blanco', 'un casa blanca', 'una casa blanca'], 3, 'Une couleur qui classe se place après le nom et s’accorde : una casa blanca.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les pronoms personnels sujets',
      questions: [
        ['Quel est le pronom « nous » quand le groupe n’est composé que de filles ?', ['nosotras', 'nosotros', 'nosotres', 'nos'], 0, 'Nosotros et vosotros ont un féminin : nosotras, vosotras.'],
        ['Comment demander poliment à plusieurs personnes : « Vous voulez du café ? »', ['¿Ustedes queréis café?', '¿Ustedes quieren café?', '¿Vosotros quieren café?', '¿Ustedes quiere café?'], 1, 'Ustedes se conjugue à la 3e personne du pluriel : quieren.'],
        ['Pourquoi exprime-t-on le pronom dans « Yo hablaba y él escuchaba » ?', ['Par politesse', 'Parce que hablar est irrégulier', 'Pour lever une ambiguïté : hablaba vaut pour yo, él, ella ou usted', 'Parce que le pronom est obligatoire à l’imparfait'], 2, 'À l’imparfait, la 1re et la 3e personne sont identiques : le pronom lève l’ambiguïté.'],
        ['Comment « usted » s’abrège-t-il à l’écrit ?', ['Ust.', 'Us.', 'U.', 'Ud.'], 3, 'Usted s’abrège Ud. (ou Vd.), ustedes Uds.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les pronoms personnels compléments',
      questions: [
        ['Comment dit-on « Je vais le lui donner » avec les pronoms soudés ?', ['Voy a dárselo', 'Voy a dárlelo', 'Voy a dárloselo', 'Voy a darselo'], 0, 'Le devient se devant lo, les pronoms se soudent à l’infinitif, et l’accent garde la syllabe tonique : dárselo.'],
        trou('A mis amigos ___ escribo cada semana.', ['los', 'les', 'las', 'se'], 1, 'Escribir a alguien : mis amigos est complément indirect pluriel, repris par les (redoublement du COI).'),
        ['Que signifie « La veo » ?', ['Je lui parle', 'Je le vois', 'Je la vois', 'Je vois ça'], 2, 'La est le COD féminin de 3e personne : je la vois.'],
        ['Quel pronom complément correspond à « vosotros » ?', ['vos', 'les', 'nos', 'os'], 3, 'À la 2e personne du pluriel, COD et COI sont identiques : os (Os veo, os hablo).'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les possessifs',
      questions: [
        ['Comment dit-on « Ces clés sont à moi » ?', ['Estas llaves son mías', 'Estas llaves son mis', 'Estas llaves son míos', 'Estas llaves son mío'], 0, 'Comme attribut, on emploie la forme tonique, accordée avec la chose possédée : mías.'],
        ['Comment dit-on « votre voiture » en vouvoyant une personne, sans ambiguïté ?', ['vuestro coche', 'el coche de usted', 'tu coche', 'el coche de vosotros'], 1, 'Su coche peut vouloir dire son, leur ou votre : el coche de usted lève le doute. Vuestro correspond à vosotros.'],
        ['Comment dit-on « C’est le tien » (en parlant d’un livre) ?', ['Es el tu', 'Es tuyo el', 'Es el tuyo', 'Es el tuya'], 2, 'Avec l’article, la forme tonique devient pronom : el tuyo.'],
        ['Comment dit-on « deux amies à elle » ?', ['dos suyas amigas', 'dos amigas sus', 'dos sus amigas', 'dos amigas suyas'], 3, 'La forme tonique se place après le nom et s’accorde avec lui : dos amigas suyas.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les pronoms relatifs',
      questions: [
        ['Comment dit-on « la maison où je suis né » ?', ['la casa donde nací', 'la casa dónde nací', 'la casa cuya nací', 'la casa que nací'], 0, 'Donde, relatif de lieu, s’écrit sans accent. Dónde accentué est interrogatif.'],
        ['Pour marquer le genre et le nombre du relatif après une préposition, on emploie…', ['que seul', 'el que, la que, los que, las que', 'cuyo', 'lo que'], 1, 'Après une préposition, que prend l’article : la casa en la que vivo, los amigos con los que salgo.'],
        ['Quel relatif traduit le « dont » de possession ?', ['del que', 'donde', 'cuyo', 'de quien'], 2, 'Cuyo exprime la possession : el escritor cuya novela leí, l’écrivain dont j’ai lu le roman.'],
        ['Quel est le relatif le plus fréquent en espagnol ?', ['quien', 'el cual', 'cuyo', 'que'], 3, 'Que, invariable, reprend les personnes comme les choses : c’est le cas général.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les indéfinis',
      questions: [
        trou('Tengo ___ para ti: un regalo.', ['algo', 'alguien', 'alguno', 'nada'], 0, 'Algo désigne une chose (quelque chose), alguien une personne.'),
        ['Que signifie « cada uno » ?', ['Chaque jour', 'Chacun', 'Quelqu’un', 'Aucun'], 1, 'Cada uno (cada una) signifie « chacun » : cada uno lo sabe.'],
        ['Que signifie « varios » ?', ['Aucun', 'Quelques rares', 'Plusieurs', 'Tous'], 2, 'Varios, varias : plusieurs. Il s’accorde avec le nom.'],
        ['Que signifie « demasiado » ?', ['Assez', 'Beaucoup', 'Peu', 'Trop'], 3, 'Demasiado signifie « trop » ; bastante, « assez ».'],
      ],
    },
    {
      niveaux: N,
      titre: 'La comparaison',
      questions: [
        ['Comment traduire « Elle est plus grande que moi » ?', ['Es más alta que yo', 'Es más alta que mí', 'Es más alta de yo', 'Es más alta como yo'], 0, 'Supériorité : más… que. Après que, on garde le pronom sujet yo.'],
        ['Que signifie « No tengo más de diez euros » ?', ['Je n’ai que dix euros', 'Je n’ai pas plus de dix euros', 'J’ai plus de dix euros', 'Je n’ai jamais dix euros'], 1, 'No… más de fixe un plafond ; no… más que voudrait dire « seulement ». C’est le piège de la fiche.'],
        ['Comment dit-on « mon petit frère » (le cadet) ?', ['mi hermano más pequeño que', 'mi hermano peor', 'mi hermano menor', 'mi hermano mínimo'], 2, 'Menor (comme mayor) sert surtout pour l’âge : mi hermano menor.'],
        ['Comment dit-on « de moins en moins » ?', ['más y menos', 'menos y menos', 'cada menos', 'cada vez menos'], 3, 'Le comparatif progressif se construit avec cada vez : cada vez más, cada vez menos.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le superlatif',
      questions: [
        ['Selon la norme, quel est le superlatif en -ísimo de « bueno » ?', ['bonísimo', 'buenoísimo', 'bonisimo', 'bonéssimo'], 0, 'La norme réduit la diphtongue : bonísimo. Buenísimo, très courant, est admis.'],
        ['Quel est le superlatif savant de « grande » ?', ['mayor', 'máximo', 'óptimo', 'supremo'], 1, 'Grande a pour superlatif savant máximo ; mayor est son comparatif, supremo celui de alto.'],
        ['Comment traduire « la moins chère de la boutique » ?', ['la más menos cara de la tienda', 'la menos cara en la tienda', 'la menos cara de la tienda', 'la mínima cara de la tienda'], 2, 'Le superlatif relatif se construit avec menos (ou más) et de, jamais en.'],
        ['À quoi sert « extremadamente » devant un adjectif ?', ['À comparer deux éléments', 'À former un comparatif', 'À marquer l’infériorité', 'À renforcer l’adjectif, comme muy'], 3, 'Sumamente et extremadamente portent la qualité très haut, sans comparer : extremadamente difícil.'],
      ],
    },
    {
      niveaux: N,
      titre: 'L’apocope',
      questions: [
        trou('Mañana hace ___ tiempo.', ['mal', 'malo', 'mala', 'males'], 0, 'Devant un nom masculin singulier, malo perd son -o : mal tiempo.'),
        ['Comment dit-on « cent mille » ?', ['ciento mil', 'cien mil', 'cientos mil', 'cienmil'], 1, 'Ciento devient cien devant un nom, mais aussi devant mil et millones : cien mil.'],
        ['Comment dit-on « saint Jean » ?', ['santo Juan', 'sant Juan', 'san Juan', 'santa Juan'], 2, 'Santo devient san devant un prénom masculin (sauf devant To- et Do-).'],
        ['Devant un adjectif, « tanto » devient…', ['tant', 'tanto', 'tantos', 'tan'], 3, 'Tanto s’apocope en tan devant un adjectif ou un adverbe : tan alto, tan rápido.'],
      ],
    },
    {
      niveaux: N,
      titre: 'L’auxiliaire haber',
      questions: [
        ['Quel est le présent de « haber » à « nosotros » ?', ['hemos', 'habemos', 'hamos', 'habimos'], 0, 'He, has, ha, hemos, habéis, han : hemos comido.'],
        ['Comment dit-on « il y aura une fête » ?', ['Hay una fiesta', 'Habrá una fiesta', 'Habrán una fiesta', 'Estará una fiesta'], 1, 'Au futur, hay devient habrá, toujours au singulier.'],
        ['Comment dit-on « il y a eu des changements » ?', ['Han habido cambios', 'Hay habido cambios', 'Ha habido cambios', 'Ha hay cambios'], 2, 'La forme impersonnelle reste au singulier, même devant un pluriel : ha habido cambios.'],
        ['Comment dit-on « Si j’avais su… » ?', ['Si había sabido…', 'Si habría sabido…', 'Si haya sabido…', 'Si hubiera sabido…'], 3, 'Le subjonctif plus-que-parfait se forme avec hubiera (ou hubiese) + participe.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les verbes pronominaux',
      questions: [
        ['Quel est le gérondif de « levantarse » ?', ['levantándose', 'se levantando', 'levantandose', 'levantándase'], 0, 'Au gérondif, le pronom se soude derrière le verbe, avec un accent écrit : levantándose.'],
        ['Que signifie « darse cuenta de » ?', ['Se donner du mal', 'Se rendre compte de', 'Rendre des comptes', 'Se donner rendez-vous'], 1, 'Darse cuenta de est un pronominal lexical : le pronom fait partie de l’expression.'],
        ['Laquelle de ces phrases est INCORRECTE ?', ['Me voy a levantar', 'Voy a levantarme', 'Voy me a levantar', 'Mañana voy a levantarme temprano'], 2, 'Avec un semi-auxiliaire, le pronom va devant le tout (me voy a levantar) ou soudé à l’infinitif (voy a levantarme), jamais entre les deux.'],
        ['Comment dit-on « nous nous lavons » ?', ['se lavamos', 'nos lavemos', 'os lavamos', 'nos lavamos'], 3, 'Le pronom réfléchi s’accorde avec le sujet : nosotros nos lavamos.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les verbes à diphtongue',
      questions: [
        trou('¿A qué hora ___ la clase?', ['empieza', 'empeza', 'empiza', 'empiece'], 0, 'Empezar diphtongue e en ie sous l’accent : empieza.'),
        ['Quelle est la 1re personne du présent de « querer » ?', ['quero', 'quiero', 'quiro', 'querio'], 1, 'Querer diphtongue e en ie : quiero, quieres… queremos.'],
        ['Quelle est la 3e personne du singulier du présent de « dormir » ?', ['dorme', 'durme', 'duerme', 'duerma'], 2, 'Dormir diphtongue o en ue au présent : duerme. Duerma est le subjonctif.'],
        ['Quel est le subjonctif présent de « poder » à « ellos » ?', ['podan', 'pueden', 'pudan', 'puedan'], 3, 'Au subjonctif, la diphtongue suit la même botte : puedan (mais podamos).'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les verbes à affaiblissement',
      questions: [
        ['Quelle est la 3e personne du pluriel du présent de « reír » ?', ['ríen', 'rien', 'reen', 'reín'], 0, 'Reír garde l’accent écrit sur le i : río, ríes, ríe, reímos, reís, ríen.'],
        ['Quelle est la 3e personne du pluriel du passé simple de « dormir » ?', ['dormieron', 'durmieron', 'duermieron', 'durmeron'], 1, 'Dormir est mixte : il s’affaiblit aux 3es personnes du passé simple (durmió, durmieron).'],
        ['Quelle est la 1re personne du présent de « repetir » ?', ['repeto', 'repieto', 'repito', 'repita'], 2, 'Repetir s’affaiblit e en i sous l’accent : repito.'],
        ['Quel est le gérondif de « preferir » ?', ['preferiendo', 'prefieriendo', 'preferendo', 'prefiriendo'], 3, 'Les verbes mixtes s’affaiblissent au gérondif : prefiriendo, sintiendo, durmiendo.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Ser et estar',
      questions: [
        trou('Hoy ___ lunes.', ['es', 'está', 'hay', 'son'], 0, 'La date se dit avec ser : Hoy es lunes.'),
        ['Que signifie « ser vivo » ?', ['Être en vie', 'Être vif d’esprit', 'Être pressé', 'Être en bonne santé'], 1, 'Ser vivo : être vif d’esprit. Estar vivo : être en vie.'],
        ['Que signifie « estar de pie » ?', ['Être à pied', 'Être de passage', 'Être debout', 'Être d’accord'], 2, 'Estar de pie est une expression figée : être debout.'],
        trou('Este regalo ___ para ti.', ['está', 'hay', 'tiene', 'es'], 3, 'La destination s’exprime avec ser : Es para ti.'),
      ],
    },
    {
      niveaux: N,
      titre: 'Le gérondif',
      questions: [
        trou('¿Qué estás ___?', ['haciendo', 'hacendo', 'hiciendo', 'hecho'], 0, 'Estar + gérondif, la forme progressive : ¿Qué estás haciendo?'),
        ['Quel est le gérondif de « venir » ?', ['veniendo', 'viniendo', 'vieniendo', 'vinendo'], 1, 'Venir fait partie des gérondifs irréguliers : viniendo.'],
        ['Quel est le gérondif de « oír » ?', ['oiendo', 'oíendo', 'oyendo', 'oindo'], 2, 'Après une voyelle, -iendo devient -yendo : oyendo, leyendo, cayendo.'],
        ['Que signifie « Viene diciendo lo mismo desde hace años » ?', ['Il vient dire la même chose', 'Il a dit la même chose une fois', 'Il dira la même chose', 'Il répète la même chose depuis des années'], 3, 'Venir + gérondif exprime une évolution venue du passé et qui se poursuit.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le participe passé',
      questions: [
        ['Quel est le participe passé de « abrir » ?', ['abierto', 'abrido', 'abrierto', 'abiertado'], 0, 'Abrir a un participe irrégulier : abierto (comme cubrir, cubierto).'],
        ['Quel est le participe passé de « ver » ?', ['vido', 'visto', 'veído', 'vito'], 1, 'Ver a un participe irrégulier : visto.'],
        ['Comment dit-on « un chien détaché » ?', ['un perro soltado', 'un perro soltido', 'un perro suelto', 'un perro suelta'], 2, 'Soltar a deux participes : soltado pour les temps composés, suelto comme adjectif.'],
        ['Quel est le participe passé de « resolver » ?', ['resolvido', 'resolto', 'resolvado', 'resuelto'], 3, 'Resolver fait resuelto, sur le modèle de volver, vuelto.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les verbes du type « gustar »',
      questions: [
        ['« No me gusta el café. » Comment répondre « moi non plus » ?', ['A mí tampoco', 'A mí también', 'A mí sí', 'Yo tampoco gusto'], 0, 'Après une négation, l’accord se dit a mí tampoco ; a mí sí marquerait le désaccord.'],
        trou('Me ___ mucho las matemáticas.', ['interesa', 'interesan', 'intereso', 'interesas'], 1, 'Interesar se construit comme gustar : il s’accorde avec las matemáticas, sujet pluriel.'),
        ['Que signifie « No me importa » ?', ['Je n’importe rien', 'Je ne l’apporte pas', 'Ça ne m’importe pas, ça m’est égal', 'Il ne m’aime pas'], 2, 'Importar se construit comme gustar : la chose importe à quelqu’un.'],
        ['Que signifie « ¿Te apetece un café? » ?', ['Tu as fait un café ?', 'Tu paies un café ?', 'Tu veux préparer un café ?', 'Ça te dit, un café ?'], 3, 'Apetecer se construit comme gustar : un café te fait envie.'],
      ],
    },
    {
      niveaux: N,
      titre: 'L’obligation',
      questions: [
        trou('Yo ___ que trabajar el sábado.', ['tengo', 'hay', 'debo', 'hago'], 0, 'Tener que + infinitif : l’obligation personnelle. Hay que n’a pas de sujet, et deber se construit sans que.'),
        ['Quelle est la forme de « hay que » au futur ?', ['habrán que', 'habrá que', 'hayrá que', 'tendrá que'], 1, 'Hay que reste invariable et ne change que de temps : habrá que estudiar.'],
        ['Comment dit-on « il faut étudier » avec « hacer falta » ?', ['Hace falta de estudiar', 'Hace falta que estudiar', 'Hace falta estudiar', 'Hacen falta estudiar'], 2, 'Hacer falta se construit avec l’infinitif (hace falta estudiar) ou avec que + subjonctif.'],
        ['Comment dit-on « Tu dois respecter tes parents » (devoir moral) ?', ['Hay que respetar tus padres', 'Debes de respetar a tus padres', 'Tienes respetar a tus padres', 'Debes respetar a tus padres'], 3, 'Deber + infinitif exprime le devoir moral. Deber de exprimerait une probabilité.'],
      ],
    },
    {
      niveaux: N,
      titre: 'L’habitude',
      questions: [
        trou('De pequeño, ___ ir a la playa en verano.', ['solía', 'solí', 'suelo', 'soleré'], 0, 'Pour une habitude passée, soler se met à l’imparfait : solía. Il ne s’emploie jamais au passé simple ni au futur.'),
        ['Que signifie « a veces » ?', ['À la fois', 'Parfois', 'Souvent', 'Toujours'], 1, 'A veces : parfois. A menudo : souvent.'],
        ['Que signifie « por lo general » ?', ['En particulier', 'Pour toujours', 'D’ordinaire', 'À la fin'], 2, 'Por lo general, normalmente, generalmente : d’ordinaire.'],
        ['Que signifie « casi nunca » ?', ['Presque toujours', 'Jamais plus', 'Pas encore', 'Presque jamais'], 3, 'Casi nunca : presque jamais.'],
      ],
    },
    {
      niveaux: N,
      titre: 'La probabilité',
      questions: [
        ['Laquelle de ces tournures exprime la certitude, et non le doute ?', ['sin duda', 'tal vez', 'acaso', 'a lo mejor'], 0, 'Sin duda affirme ; tal vez, acaso et a lo mejor expriment un doute.'],
        ['« ¿Dónde está Juan? — Estará en casa. » Que signifie la réponse ?', ['Il sera à la maison plus tard', 'Il doit être à la maison', 'Il était à la maison', 'Il faut qu’il soit à la maison'], 1, 'Le futur exprime une supposition sur le présent : il doit être à la maison. C’est le contresens le plus fréquent en version.'],
        ['Que signifie « acaso » dans « Acaso tenga razón » ?', ['Certainement', 'Au cas où', 'Peut-être', 'Jamais'], 2, 'Acaso est un adverbe de doute, comme quizás et tal vez.'],
        trou('Es probable que ya ___ salido.', ['ha', 'habrá', 'había', 'haya'], 3, 'Es probable que commande le subjonctif ; pour un fait accompli, subjonctif passé : haya salido.'),
      ],
    },
    {
      niveaux: N,
      titre: 'Le conseil',
      questions: [
        ['Comment dit-on « Si j’étais toi… » ?', ['Si yo fuera tú…', 'Si yo era tú…', 'Si yo sería tú…', 'Si yo sea tú…'], 0, 'Si + imparfait du subjonctif, puis le conditionnel : Si yo fuera tú, iría al médico.'],
        ['Quel est l’impératif de « poner » à « tú » ?', ['pone', 'pon', 'ponga', 'pongo'], 1, 'Poner a un impératif irrégulier à tú : pon.'],
        ['Quel est l’impératif de « ser » à « tú » ?', ['se', 'es', 'sé', 'sea'], 2, 'L’impératif de ser à tú est sé, avec un accent qui le distingue du pronom se : ¡Sé bueno!'],
        ['Que signifie « Ojalá apruebes » ?', ['Si seulement tu avais réussi', 'Tu as réussi', 'Tu vas réussir, c’est sûr', 'Pourvu que tu réussisses'], 3, 'Ojalá + subjonctif présent exprime un souhait possible.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le présent de l’indicatif',
      questions: [
        ['Dans « En 1492, Colón llega a América », quel est l’emploi du présent ?', ['Un présent historique : un fait passé raconté au présent', 'Un futur proche', 'Une habitude', 'Une faute : il faut un passé'], 0, 'Le présent historique rend un fait passé plus vivant, comme en français.'],
        ['Quelle est la 1re personne du présent de « traer » ?', ['trao', 'traigo', 'trajo', 'traego'], 1, 'Traer a un yo irrégulier : traigo. Trajo est le passé simple.'],
        ['Quelle est la 1re personne du présent de « dar » ?', ['do', 'dao', 'doy', 'dé'], 2, 'Dar fait doy à la première personne, comme estar (estoy) ou ir (voy).'],
        ['Quelle est la 2e personne du pluriel du présent de « ser » ?', ['sóis', 'eréis', 'seis', 'sois'], 3, 'Soy, eres, es, somos, sois, son : sois, sans accent.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le subjonctif présent',
      questions: [
        ['Quel est le subjonctif présent de « dar » à la 1re personne ?', ['dé', 'de', 'da', 'doy'], 0, 'Dé porte un accent qui le distingue de la préposition de.'],
        ['Quel est le subjonctif présent de « hacer » à « nosotros » ?', ['hacemos', 'hagamos', 'hacamos', 'hagemos'], 1, 'On part de hago : l’irrégularité de yo se propage à tout le subjonctif (haga… hagamos).'],
        trou('Iremos a la playa a menos que ___.', ['llueve', 'lloverá', 'llueva', 'llover'], 2, 'A menos que est toujours suivi du subjonctif.'),
        ['Quel est le subjonctif présent de « estar » à « tú » ?', ['estas', 'estás', 'estes', 'estés'], 3, 'Estar est irrégulier au subjonctif, avec accent : esté, estés, esté… Estás est l’indicatif.'],
      ],
    },
    {
      niveaux: N,
      titre: 'L’imparfait',
      questions: [
        trou('Cuando ___ niños, jugábamos en la calle.', ['éramos', 'fuimos', 'estuvimos', 'seremos'], 0, 'Le décor et l’habitude passés se disent à l’imparfait : éramos.'),
        ['Quel est l’imparfait de « ser » à « nosotros » ?', ['erámos', 'éramos', 'eramos', 'seíamos'], 1, 'Ser est irrégulier à l’imparfait, et nosotros porte l’accent sur la première syllabe : éramos.'],
        ['Quel est l’imparfait de « tener » à la 1re personne ?', ['tuve', 'tenaba', 'tenía', 'tenguía'], 2, 'Tener est régulier à l’imparfait : tenía. Tuve est le passé simple.'],
        ['Quel emploi de l’imparfait illustre « Hacía frío y la calle estaba desierta » ?', ['Une action ponctuelle', 'La politesse', 'Un futur', 'La description, le décor'], 3, 'L’imparfait décrit, sans début ni fin : il plante le décor du récit.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le passé composé',
      questions: [
        ['Que signifie « Este año ha llovido poco » ?', ['Cette année, il a peu plu', 'L’an dernier, il a peu plu', 'Cette année, il pleuvra peu', 'Cette année, il pleut beaucoup'], 0, 'La période n’est pas achevée (este año) : le pretérito perfecto la rattache au présent.'],
        trou('Ya he ___ los deberes.', ['hacido', 'hecho', 'hizo', 'hacho'], 1, 'Hacer a un participe irrégulier : hecho.'),
        trou('Mis padres ___ salido.', ['has', 'hemos', 'han', 'ha'], 2, 'Haber s’accorde avec le sujet (mis padres : ellos) : han salido. Le participe, lui, reste invariable.'),
        ['Où, en Espagne, le passé simple remplace-t-il couramment le passé composé ?', ['En Andalousie', 'En Catalogne', 'À Madrid', 'En Galice et dans les Asturies'], 3, 'Dans le nord-ouest (Galice, Asturies), comme en Amérique latine, on dit volontiers Hoy comí paella.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le passé simple',
      questions: [
        ['Quelle est la 1re personne du passé simple de « hablar » ?', ['hablé', 'hable', 'hablí', 'hablo'], 0, 'L’accent est distinctif : hablé (passé simple), hable (subjonctif), hablo (présent).'],
        ['Quel est le passé simple de « venir » à la 1re personne ?', ['viní', 'vine', 'vené', 'viné'], 1, 'Venir a un prétérit fort, radical vin-, sans accent : vine.'],
        ['Quelle est la 3e personne du pluriel du passé simple de « estar » ?', ['estaron', 'estuvaron', 'estuvieron', 'estuvieran'], 2, 'Estar a un prétérit fort, radical estuv- : estuvieron. Estuvieran est l’imparfait du subjonctif.'],
        ['Quel est le passé simple de « poder » à la 3e personne du singulier ?', ['podió', 'pudió', 'puedó', 'pudo'], 3, 'Les prétérits forts prennent -o à la 3e personne, sans accent : pudo.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le futur',
      questions: [
        ['Quel est le futur de « poder » à la 1re personne ?', ['podré', 'poderé', 'puedré', 'podería'], 0, 'Le e de l’infinitif tombe : poder donne podré.'],
        ['Quel est le futur de « querer » à la 1re personne ?', ['quereré', 'querré', 'quiré', 'quierré'], 1, 'Querer perd le e de l’infinitif : querré, avec deux r.'],
        ['Quel est le futur de « venir » à la 1re personne ?', ['veniré', 'venré', 'vendré', 'vingré'], 2, 'Un d remplace la voyelle : venir donne vendré, comme tener donne tendré.'],
        ['Que signifie « No matarás » ?', ['Tu ne tueras peut-être pas', 'Tu n’as pas tué', 'Tu ne tuerais pas', 'Tu ne tueras point : un commandement'], 3, 'Le futur peut exprimer un ordre atténué, comme dans les commandements.'],
      ],
    },
  ],
}
