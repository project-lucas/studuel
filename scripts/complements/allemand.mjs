const N = ['3e', '2de', '1re', 'Tle']

export default {
  slug: 'allemand',
  titreMigration: 'QUESTIONS EN PLUS — ALLEMAND 3e → Tle',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveaux: N,
      titre: 'La ponctuation',
      questions: [
        ['Quelle phrase est correctement ponctuée ?', ['Er ist arm aber glücklich.', 'Er ist, arm aber glücklich.', 'Er ist arm; aber glücklich.', 'Er ist arm, aber glücklich.'], 3, 'Devant *aber*, *sondern* et *denn*, la virgule est obligatoire en allemand.'],
        ['Quel signe complète la phrase ? *Er sagt___ „Ich komme morgen.“*', [':', ',', ';', '—'], 0, 'L’allemand annonce le discours direct par les deux-points, là où le français met souvent une virgule.'],
        ['Quel mot complète la phrase ? *Beim ___ spricht man nicht.*', ['essen', 'essend', 'Essen', 'gegessen'], 2, 'Un infinitif employé comme nom (« le fait de manger ») devient un nom neutre et prend la majuscule : *das Essen*.'],
        ['En Suisse, on écrit *Straße* avec un ß.', ['Vrai', 'Faux'], 1, 'Le ß n’existe pas en Suisse : on y écrit toujours *ss*, *Strasse*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'La syntaxe de la phrase déclarative',
      questions: [
        ['Comment traduire « Hier, j’ai vu un film » ?', ['Ich habe gestern gesehen einen Film', 'Gestern ich habe einen Film gesehen', 'Ich habe gestern einen Film gesehen', 'Ich gestern habe einen Film gesehen'], 2, 'L’auxiliaire est en deuxième position et le participe ferme la phrase : c’est la parenthèse verbale.'],
        ['Quelle phrase respecte l’ordre TeKaMoLo ?', ['Ich fahre mit dem Zug morgen nach München', 'Ich fahre morgen mit dem Zug nach München', 'Ich fahre nach München morgen mit dem Zug', 'Ich fahre morgen nach München mit dem Zug'], 1, 'Temps (*morgen*), puis manière (*mit dem Zug*), puis lieu (*nach München*).'],
        ['Quel mot complète la phrase ? *Ich muss heute Abend ___.*', ['arbeiten', 'arbeite', 'gearbeitet', 'zu arbeiten'], 0, 'Après un modal, l’infinitif sans *zu* part à la fin de la phrase.'],
        ['Comment traduire « Je range ma chambre » (*aufräumen*) ?', ['Ich aufräume mein Zimmer', 'Ich räume auf mein Zimmer', 'Ich mein Zimmer aufräume', 'Ich räume mein Zimmer auf'], 3, 'Le verbe conjugué est en deuxième position et le préverbe séparable *auf* ferme la phrase.'],
      ],
    },
    {
      niveaux: N,
      titre: 'La phrase interrogative',
      questions: [
        ['Quel mot complète la question « D’où viens-tu ? » : *___ kommst du?*', ['Wo', 'Wohin', 'Woher', 'Wann'], 2, '*Woher* demande l’origine ; *wo* le lieu où l’on est, *wohin* la destination.'],
        ['Comment demander « Avec qui parles-tu ? »', ['Womit sprichst du?', 'Mit wem sprichst du?', 'Mit wen sprichst du?', 'Mit was sprichst du?'], 1, 'Pour une personne, on garde la préposition + *wer* décliné (*mit* + datif : *wem*). *Womit* ne vaut que pour une chose.'],
        ['Quel mot complète la phrase ? *___ Buch möchtest du, das rote oder das blaue?*', ['Welches', 'Welcher', 'Was für', 'Wer'], 0, '*Welcher / welche / welches* demande « lequel » dans un choix ; il s’accorde avec le nom neutre *Buch*.'],
        ['Quel mot complète la phrase ? *___ hilfst du?* (*helfen* régit le datif)', ['Wer', 'Wen', 'Wessen', 'Wem'], 3, '*Wer* se décline : *wen* à l’accusatif, *wem* au datif, *wessen* au génitif.'],
      ],
    },
    {
      niveaux: N,
      titre: 'La négation dans la phrase (nicht / kein)',
      questions: [
        ['Quel mot complète la phrase ? *Ich trinke ___ Kaffee.*', ['keinen', 'nicht', 'kein', 'keine'], 0, 'Un nom sans article se nie par *kein*, décliné comme *ein* : *Kaffee* est masculin et COD, d’où *keinen*.'],
        ['Comment traduire « Je ne vais pas au cinéma » ?', ['Ich gehe ins Kino nicht', 'Ich gehe nicht ins Kino', 'Ich nicht gehe ins Kino', 'Ich gehe kein Kino'], 1, 'Devant un complément de lieu directionnel, *nicht* se place avant : *nicht ins Kino*.'],
        ['Comment traduire « Personne ne vient » ?', ['Nichts kommt', 'Nie kommt', 'Niemand kommt', 'Keiner nicht kommt'], 2, '*Niemand* signifie « personne » ; *nichts* veut dire « rien » et *nie* « jamais ».'],
        ['Quel mot complète la phrase ? *Er ist nicht reich, ___ glücklich.*', ['sondern', 'denn', 'oder', 'aber'], 3, 'Ici on n’oppose pas en rectifiant (il n’est pas riche, mais il est heureux quand même) : c’est *aber*. *Sondern* remplacerait l’élément nié.'],
      ],
    },
    {
      niveaux: N,
      titre: 'La phrase subordonnée',
      questions: [
        ['Quel mot complète la phrase ? *Ich bleibe zu Hause, weil ich krank ___.*', ['sein', 'bin', 'ist', 'war ich'], 1, 'Après *weil*, le verbe conjugué part à la fin et s’accorde avec *ich* : *bin*.'],
        ['Quel mot complète la phrase ? *___ ich Zeit habe, besuche ich dich.*', ['Wenn', 'Als', 'Wann', 'Ob'], 0, '*Wenn* exprime la condition (« si ») ; *als* ne vaut que pour un fait unique du passé, *wann* que dans une question.'],
        ['Quel mot complète la phrase ? *Ich weiß, ___ du recht hast.*', ['das', 'denn', 'wann', 'dass'], 3, '*Dass* (« que ») introduit une subordonnée et envoie le verbe à la fin ; *das* avec un seul s est un article ou un pronom.'],
        ['Quel mot complète la phrase ? *___ ich schlafen gehe, putze ich mir die Zähne.*', ['Nachdem', 'Obwohl', 'Bevor', 'Damit'], 2, '*Bevor* signifie « avant que » : on se brosse les dents avant d’aller dormir.'],
      ],
    },
    {
      niveaux: N,
      titre: 'La phrase subordonnée relative',
      questions: [
        ['Quel mot complète la phrase ? *Der Mann, ___ ich helfe, ist alt.*', ['den', 'der', 'dem', 'dessen'], 2, 'Masculin comme *Mann*, et au datif parce que *helfen* régit le datif : *dem*.'],
        ['Quel mot complète la phrase ? *Die Frau, ___ dort steht, ist meine Lehrerin.*', ['die', 'der', 'den', 'deren'], 0, 'Féminin comme *Frau*, et sujet de la relative, donc au nominatif : *die*.'],
        ['Quel mot complète la phrase ? *Das Buch, ___ ich gekauft habe, ist teuer.*', ['der', 'den', 'dem', 'das'], 3, 'Neutre comme *Buch*, et COD de *kaufen*, donc à l’accusatif : *das*.'],
        ['Quel mot complète la phrase ? *Er kam zu spät, ___ mich geärgert hat.*', ['das', 'was', 'dass', 'der'], 1, 'Quand le relatif reprend toute une phrase (le fait qu’il soit en retard), on emploie *was*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'La phrase à la voix passive',
      questions: [
        ['Quel mot complète le passif au prétérit ? *Das Haus ___ gebaut.*', ['wird', 'wurde', 'war geworden', 'hat'], 1, 'Le prétérit du passif se forme avec *wurde* + participe II.'],
        ['Quel mot complète la phrase ? *Die Stadt wurde ___ ein Erdbeben zerstört.*', ['von', 'mit', 'durch', 'für'], 2, 'Un moyen ou une cause non humaine s’introduit par *durch* + accusatif ; *von* + datif se réserve aux personnes et forces agissantes.'],
        ['Comment mettre « Man baut ein Haus » au passif ?', ['Ein Haus ist bauen', 'Ein Haus wird bauen', 'Ein Haus hat gebaut', 'Ein Haus wird gebaut'], 3, 'Passif d’action au présent : *wird* + participe II. Le COD de la phrase active devient sujet.'],
        ['Quel mot complète le passif au futur ? *Das Haus wird gebaut ___.*', ['werden', 'worden', 'geworden', 'wird'], 0, 'Au futur du passif, *wird* + participe II + *werden* à l’infinitif.'],
      ],
    },
    {
      niveaux: N,
      titre: 'La proposition infinitive',
      questions: [
        ['Quel mot complète la phrase ? *Ich höre ihn ___.*', ['kommen', 'zu kommen', 'kommt', 'gekommen'], 0, '*Sehen*, *hören* et *lassen* refusent *zu* : l’infinitif se construit directement.'],
        ['Un groupe infinitif peut avoir son propre sujet.', ['Vrai', 'Faux'], 1, 'Un groupe infinitif n’a jamais de sujet propre : s’il en faut un, on passe à une subordonnée en *dass*.'],
        ['Quel groupe complète la phrase ? *Hast du Lust, ins Kino ___?*', ['gehen', 'gehst', 'zu gehen', 'gegangen'], 2, '*Lust haben* appelle un infinitif avec *zu*, comme *Zeit haben* ou *versuchen*.'],
        ['Quel mot complète la phrase ? *Er spielt, statt ___ arbeiten.*', ['um', 'ohne', 'damit', 'zu'], 3, '*(An)statt… zu* exprime la substitution : il joue au lieu de travailler.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les déterminants définis et indéfinis sujets',
      questions: [
        ['Quel article pour *Montag* ?', ['der', 'die', 'das', 'den'], 0, 'Les jours, les mois et les saisons sont masculins : *der Montag*.'],
        ['Comment traduire « Je vais en Allemagne » ?', ['Ich fahre nach dem Deutschland', 'Ich fahre nach Deutschland', 'Ich fahre in das Deutschland', 'Ich fahre zu Deutschland'], 1, 'La plupart des noms de pays s’emploient sans article : *nach Deutschland*.'],
        ['Comment traduire « Je bois de l’eau » ?', ['Ich trinke das Wasser', 'Ich trinke ein Wasser', 'Ich trinke Wasser', 'Ich trinke von Wasser'], 2, 'Un nom de matière pris en quantité indéterminée n’a pas d’article, là où le français dit « de l’ ».'],
        ['Quel article pour *Essen* (le repas, infinitif substantivé) ?', ['der', 'die', 'den', 'das'], 3, 'Tout infinitif employé comme nom est neutre : *das Essen*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les déterminants et leurs déclinaisons',
      questions: [
        ['Quel mot complète la phrase ? *Ich sehe ___ Hund.*', ['ein', 'einen', 'einem', 'eines'], 1, '*Hund* est masculin et COD : l’accusatif masculin de *ein* est *einen*.'],
        ['Quel mot complète la phrase ? *Ich schreibe ___ Bruder einen Brief.*', ['mein', 'meinen', 'meinem', 'meines'], 2, '*Bruder* est ici COI, donc au datif masculin : *meinem*. Les possessifs se déclinent comme *ein*.'],
        ['Quel mot complète la phrase ? *Das ist das Auto ___ Vaters.*', ['der', 'dem', 'den', 'des'], 3, 'Complément du nom : génitif masculin *des*, et le nom prend -s : *des Vaters*.'],
        ['Quel mot complète la phrase ? *Ich gebe ___ Kind ein Geschenk.*', ['jedem', 'jeden', 'jeder', 'jedes'], 0, '*Jeder* prend les terminaisons de l’article défini ; au datif neutre, *dem* donne *jedem*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les pronoms personnels',
      questions: [
        ['Quel pronom complète « Je te le donne » : *Ich gebe es ___.*', ['dich', 'du', 'dir', 'dein'], 2, 'Le COI se met au datif : *dir*. Et avec deux pronoms, l’accusatif *es* passe devant.'],
        ['Quel pronom complète « Il nous rend visite » : *Er besucht ___.*', ['uns', 'wir', 'unser', 'euch'], 0, '*Wir* devient *uns* à l’accusatif comme au datif.'],
        ['Quel pronom complète la question polie « Comment allez-vous ? » : *Wie geht es ___?*', ['Sie', 'Ihnen', 'ihnen', 'Ihr'], 1, 'Le *Sie* de politesse fait *Ihnen* au datif, toujours avec une majuscule.'],
        ['Quel pronom complète « Je leur donne le livre » : *Ich gebe ___ das Buch.*', ['sie', 'ihr', 'Ihnen', 'ihnen'], 3, 'Le datif de *sie* (ils) est *ihnen*, sans majuscule ; *Ihnen* avec majuscule serait le vouvoiement.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les pronoms démonstratifs',
      questions: [
        ['« Sie hat das gleiche Kleid » signifie qu’elle a…', ['Une robe semblable, un autre exemplaire', 'Exactement la même robe, un seul objet', 'Changé de robe', 'Prêté sa robe'], 0, '*Der gleiche* désigne deux objets semblables ; *derselbe* désignerait un seul et même objet.'],
        ['Quel mot complète la phrase ? *Ich nehme ___ Buch hier.*', ['diesen', 'dieses', 'diese', 'diesem'], 1, '*Dieser* se décline comme l’article défini : neutre accusatif *das* donne *dieses*.'],
        ['— *Kennst du Anna?* — *Ja, ___ kenne ich gut!*', ['der', 'den', 'die', 'das'], 2, 'À l’oral, *der, die, das* accentué sert de démonstratif ; ici il reprend *Anna*, féminin accusatif : *die*.'],
        ['Quel mot complète la phrase ? *Ich spreche mit ___ Mann.*', ['dieser', 'diesen', 'dieses', 'diesem'], 3, '*Mit* régit le datif, et *dieser* prend la terminaison de *dem* : *diesem Mann*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le pluriel des noms',
      questions: [
        ['Quel est le pluriel de *der Sohn* ?', ['die Söhne', 'die Sohnen', 'die Sohns', 'die Söhner'], 0, 'Beaucoup de masculins font leur pluriel en -e, souvent avec inflexion : *die Söhne*.'],
        ['Quel est le pluriel de *der Tag* ?', ['die Tags', 'die Tage', 'die Tagen', 'die Täger'], 1, 'Schéma en -e, ici sans inflexion : *die Tage*.'],
        ['Quel est le pluriel de *das Kind* ?', ['die Kinds', 'die Kinde', 'die Kinder', 'die Kindern'], 2, 'Neutre en -er : *die Kinder*. La forme *Kindern* n’apparaît qu’au datif pluriel.'],
        ['Comment traduire « J’ai des lunettes » ?', ['Ich habe Brillen', 'Ich habe ein Brille', 'Ich habe eine Brillen', 'Ich habe eine Brille'], 3, '*Brille* est un singulier là où le français met un pluriel : *eine Brille*, « des lunettes ».'],
      ],
    },
    {
      niveaux: N,
      titre: 'L’adjectif attribut',
      questions: [
        ['Quel mot complète la phrase ? *Sie scheint ___.*', ['müde', 'müden', 'müdem', 'müdes'], 0, 'Après *scheinen* (paraître), l’adjectif est attribut : il reste à sa forme nue.'],
        ['Quel mot complète la phrase ? *Das Wetter bleibt ___.*', ['schönes', 'schön', 'schöne', 'schönem'], 1, 'Après *bleiben*, comme après *sein* et *werden*, l’attribut ne se décline jamais.'],
        ['Quel mot complète la phrase ? *Ein ___ Mann ist gekommen.*', ['alt', 'alte', 'alter', 'alten'], 2, 'Placé devant le nom, l’adjectif est épithète et se décline : *ein alter Mann*.'],
        ['Comment traduire « Il chante bien » ?', ['Er singt schöne', 'Er singt schönlich', 'Er singt schönes', 'Er singt schön'], 3, 'L’allemand n’a pas de terminaison d’adverbe : le même mot sert d’adjectif et d’adverbe.'],
      ],
    },
    {
      niveaux: N,
      titre: 'L’adjectif épithète et ses déclinaisons',
      questions: [
        ['Quel mot complète la phrase ? *Das ist eine ___ Frau.*', ['alte', 'alter', 'alten', 'altes'], 0, '*Eine* marque déjà le féminin nominatif : l’adjectif prend la terminaison faible -e.'],
        ['Quel mot complète la phrase ? *Ich sehe den ___ Mann.*', ['alte', 'alten', 'alter', 'altes'], 1, 'Après *den*, qui porte la marque de l’accusatif, l’adjectif prend -en.'],
        ['Quel mot complète la phrase ? *Ich trinke ___ Kaffee.*', ['kalte', 'kalter', 'kalten', 'kaltem'], 2, 'Sans déterminant, l’adjectif porte lui-même la marque du cas : accusatif masculin, comme *den*, donc *kalten*.'],
        ['Quel mot complète la phrase ? *Das ist ein ___ Zimmer.* (*dunkel*)', ['dunkeles', 'dunkels', 'dunkel', 'dunkles'], 3, '*Dunkel* perd son e devant une terminaison, et *ein* ne marquant pas le neutre, l’adjectif prend -es : *dunkles*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'L’adjectif possessif',
      questions: [
        ['Frau Müller, ist das ___ Tasche ? (vouvoiement)', ['Ihre', 'ihre', 'deine', 'seine'], 0, 'Le possessif de politesse *Ihr* prend toujours la majuscule ; *ihre* en minuscule voudrait dire « son » (à elle) ou « leur ».'],
        ['Quel mot complète « Nous rendons visite à nos grands-parents » : *Wir besuchen ___ Großeltern.*', ['unser', 'unsere', 'unserem', 'uns'], 1, 'Pluriel à l’accusatif : *unsere*. *Unser* garde son e devant la terminaison.'],
        ['Quel mot complète « Les enfants et leur maison » : *Die Kinder und ___ Haus*', ['sein', 'ihre', 'ihr', 'ihrer'], 2, 'Le possesseur est pluriel (« leur ») : radical *ihr-* ; *Haus* est neutre nominatif, donc pas de terminaison.'],
        ['Quel mot complète la phrase ? *Ich kenne ___ Vater.*', ['dein', 'deinem', 'deiner', 'deinen'], 3, '*Vater* est masculin et COD : accusatif *deinen*, comme *einen*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le génitif saxon',
      questions: [
        ['Quel mot complète la phrase ? *___ des Regens gehen wir spazieren.*', ['Trotz', 'Mit', 'Für', 'Ohne'], 0, '*Trotz* (malgré) régit le génitif : *trotz des Regens*.'],
        ['Comment dit-on à l’oral « la voiture de mon père » ?', ['das Auto von meinen Vater', 'das Auto von meinem Vater', 'das Auto von mein Vater', 'von das Auto meinem Vater'], 1, 'À l’oral, *von* + datif remplace volontiers le génitif : *von meinem Vater*.'],
        ['Quel mot complète la phrase ? *Das Haus ___ Frau ist groß.*', ['des', 'dem', 'der', 'die'], 2, 'Au génitif féminin, l’article est *der* et le nom ne prend aucune marque.'],
        ['Quel mot complète la phrase ? *Wegen ___ Wetters bleiben wir hier.*', ['der', 'dem', 'das', 'des'], 3, '*Wegen* régit le génitif ; au neutre, *des Wetters*, avec le -s du nom.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le comparatif',
      questions: [
        ['Comment dit-on « Paul n’est pas aussi grand que Peter » ?', ['Paul ist nicht so groß wie Peter', 'Paul ist nicht so groß als Peter', 'Paul ist weniger groß wie Peter', 'Paul ist nicht größer wie Peter'], 0, 'L’infériorité se dit *nicht so… wie* ; *als* ne vient qu’après un comparatif en -er.'],
        ['Quel est le comparatif de *alt* ?', ['alter', 'älter', 'mehr alt', 'ältest'], 1, 'Beaucoup d’adjectifs courts prennent l’Umlaut au comparatif : *alt → älter*.'],
        ['Quel mot complète la phrase ? *Je mehr ich lerne, ___ besser verstehe ich.*', ['als', 'wie', 'desto', 'so'], 2, '*Je… desto* (ou *umso*) signifie « plus… plus ».'],
        ['Comment traduire « J’ai plus de temps » ?', ['Ich habe Zeit mehr', 'Ich habe meiste Zeit', 'Ich habe besser Zeit', 'Ich habe mehr Zeit'], 3, '*Mehr* traduit « plus » de quantité devant un nom ; il ne sert jamais à former le comparatif d’un adjectif.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le superlatif',
      questions: [
        ['Quel mot complète la phrase ? *Ich gehe mit dem ___ Freund ins Kino.*', ['besten', 'beste', 'bester', 'am besten'], 0, 'Devant un nom, le superlatif se décline comme un adjectif : après *dem*, terminaison -en.'],
        ['Quel est le superlatif de *viel* ?', ['am vielsten', 'am meisten', 'am mehrsten', 'am meistens'], 1, '*Viel* est irrégulier : *mehr*, puis *am meisten*.'],
        ['Quel est le superlatif de *groß* ?', ['am großesten', 'am größesten', 'am größten', 'am großten'], 2, '*Groß* fait exception à la règle du e de liaison : *am größten*, sans e.'],
        ['Quel est le superlatif de *nah* ?', ['am nahsten', 'am nähesten', 'am nachsten', 'am nächsten'], 3, '*Nah* est irrégulier : *näher*, puis *am nächsten*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les prépositions suivies de l’accusatif',
      questions: [
        ['Comment traduire « Sans moi ! » ?', ['Ohne mich!', 'Ohne mir!', 'Ohne ich!', 'Ohne meiner!'], 0, '*Ohne* régit l’accusatif : le pronom *ich* devient *mich*.'],
        ['Quel mot complète la phrase ? *Wir gehen durch ___ Park.*', ['dem', 'den', 'der', 'des'], 1, '*Durch* régit toujours l’accusatif : *der Park* devient *den Park*.'],
        ['Quel mot complète la phrase ? *Wir sitzen um ___ Tisch.*', ['dem', 'der', 'den', 'des'], 2, '*Um* (autour de) régit l’accusatif : *um den Tisch*.'],
        ['Comment traduire « Je suis contre cette idée » ?', ['Ich bin gegen dieser Idee', 'Ich bin gegen diesen Idee', 'Ich bin für diese Idee', 'Ich bin gegen diese Idee'], 3, '*Gegen* (contre) régit l’accusatif ; au féminin, *diese* ne change pas.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les prépositions suivies du datif',
      questions: [
        ['Comment traduire « Je vais à Vienne » ?', ['Ich fahre nach Wien', 'Ich fahre zu Wien', 'Ich fahre in Wien', 'Ich fahre bei Wien'], 0, 'Devant une ville ou un pays sans article, la destination se dit *nach*.'],
        ['Quel mot complète la phrase ? *Ich fahre mit ___ Bus.*', ['den', 'dem', 'der', 'das'], 1, '*Mit* régit toujours le datif : *der Bus* devient *dem Bus*.'],
        ['Quel mot complète la phrase ? *Ich wohne bei ___ Eltern.*', ['meine', 'meinem', 'meinen', 'meiner'], 2, '*Bei* régit le datif ; au pluriel, le possessif fait *meinen*.'],
        ['Quel mot complète la phrase ? *Der Tisch ist ___ Holz.*', ['nach', 'mit', 'bei', 'aus'], 3, '*Aus* indique aussi la matière : *aus Holz*, « en bois ».'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les prépositions mixtes',
      questions: [
        ['Quel mot complète la phrase ? *Die Katze sitzt ___ dem Stuhl.* (sous)', ['unter', 'über', 'zwischen', 'hinter'], 0, '*Unter* signifie « sous » ; *über* « au-dessus de », *hinter* « derrière ».'],
        ['Quel mot complète la phrase ? *Ich lege das Buch auf ___ Tisch.*', ['dem', 'den', 'der', 'des'], 1, '*Legen* est une action qui déplace l’objet (*wohin?*) : accusatif, *den Tisch*.'],
        ['Quel mot complète la phrase ? *Das Bild hängt an ___ Wand.*', ['die', 'den', 'der', 'dem'], 2, 'Le tableau est accroché, il ne bouge pas (*wo?*) : datif ; *die Wand* devient *der Wand*.'],
        ['*Ich stelle die Flasche auf den Tisch.* Ensuite : *Die Flasche ___ auf dem Tisch.*', ['stellt', 'legt', 'setzt', 'steht'], 3, '*Stellen* (poser debout, accusatif) a pour pendant d’état *stehen* (être debout, datif).'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les conjonctions de coordination',
      questions: [
        ['Quel mot complète la phrase ? *Das Hotel ist ___ teuer, aber sehr schön.*', ['zwar', 'weder', 'sowohl', 'entweder'], 0, '*Zwar… aber* signifie « certes… mais » : l’outil idéal pour concéder.'],
        ['Quel mot complète la phrase ? *Er spricht nicht nur Deutsch, ___ auch Englisch.*', ['aber', 'sondern', 'denn', 'oder'], 1, '*Nicht nur… sondern auch* signifie « non seulement… mais aussi ».'],
        ['Comment dit-on « aussi bien… que » ?', ['entweder… oder', 'weder… noch', 'sowohl… als auch', 'zwar… aber'], 2, '*Sowohl… als auch* réunit deux éléments : *sowohl Tee als auch Kaffee*.'],
        ['Quelle phrase contient une faute ?', ['Ich habe weder Zeit noch Geld.', 'Er ist arm, aber glücklich.', 'Das ist nicht mein Buch, sondern deins.', 'Ich habe nicht weder Zeit noch Geld.'], 3, 'Avec *weder… noch*, la phrase est déjà négative : on n’ajoute pas *nicht*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les compléments de lieu (locatif / directionnel)',
      questions: [
        ['Quel mot complète la phrase ? *Ich komme gerade ___ der Arbeit.*', ['von', 'aus', 'nach', 'zu'], 0, 'Le point de départ se dit *von* + datif : *von der Arbeit*.'],
        ['Comment traduire « Je vais à la mer » ?', ['Ich fahre am Meer', 'Ich fahre ans Meer', 'Ich fahre nach dem Meer', 'Ich fahre in Meer'], 1, 'Pour aller vers un bord, on emploie *an* + accusatif : *ans Meer* (*an das*).'],
        ['Comment traduire « Je suis chez le médecin » ?', ['Ich bin zum Arzt', 'Ich bin nach dem Arzt', 'Ich bin beim Arzt', 'Ich bin ans Arzt'], 2, 'Sans mouvement, « chez » se dit *bei* : *beim Arzt*. *Zum Arzt* marquerait qu’on y va.'],
        ['Comment traduire « Il vit à l’étranger » ?', ['Er lebt ins Ausland', 'Er lebt nach Ausland', 'Er lebt am Ausland', 'Er lebt im Ausland'], 3, 'Paire figée : *ins Ausland* (y aller) et *im Ausland* (y être). *Leben* ne marque aucun déplacement.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les compléments de temps',
      questions: [
        ['Comment dit-on « du lundi au vendredi » ?', ['von Montag bis Freitag', 'um Montag bis Freitag', 'seit Montag bis Freitag', 'am Montag bis Freitag'], 0, '*Von… bis* signifie « de… à » pour une période.'],
        ['Quel mot complète la phrase ? *___ der Nacht schlafe ich.*', ['Am', 'In', 'Um', 'Im'], 1, 'Exception à connaître : on dit *in der Nacht*, alors qu’on dit *am Abend*.'],
        ['Comment dit-on « dans une heure » ?', ['vor einer Stunde', 'seit einer Stunde', 'in einer Stunde', 'um einer Stunde'], 2, '*In* + datif situe dans l’avenir ; *vor* + datif signifie « il y a ».'],
        ['Quel mot complète la phrase ? *Ich war ___ Woche in Wien.*', ['letzten', 'letzter', 'letztes', 'letzte'], 3, 'Une date entière se met à l’accusatif sans préposition ; *Woche* est féminin : *letzte Woche*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les auxiliaires',
      questions: [
        ['Quel mot complète la phrase ? *Was ___ passiert?*', ['ist', 'hat', 'haben', 'sind'], 0, '*Passieren* fait partie des verbes à part qui forment leur parfait avec *sein*.'],
        ['Quel est le participe passé de *sein* ?', ['gesein', 'gewesen', 'gewest', 'geseint'], 1, 'Les trois formes de *sein* : *ist*, *war*, *gewesen*.'],
        ['Quel mot complète la phrase ? *Wir ___ um sieben Uhr aufgestanden.*', ['haben', 'werden', 'sind', 'hatten'], 2, '*Aufstehen* est un changement d’état : parfait avec *sein*.'],
        ['Quel mot complète la phrase ? *Du ___ immer größer.* (*werden*)', ['werdest', 'wirdst', 'wird', 'wirst'], 3, '*Werden* se conjugue *ich werde, du wirst, er wird* ; ici il signifie « devenir ».'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les verbes faibles et les verbes forts',
      questions: [
        ['Quel est le prétérit de *machen* ?', ['machte', 'muchte', 'machtete', 'gemacht'], 0, '*Machen* est faible : le radical ne change pas et le prétérit prend -te.'],
        ['Quel est le participe II de *nehmen* ?', ['genehmt', 'genommen', 'genahmen', 'genimmt'], 1, 'Verbe fort : *nehmen → nahm → genommen*, avec changement de voyelle et -en.'],
        ['Quel mot complète la phrase ? *Du ___ ein Buch.* (*lesen*)', ['lest', 'lesst', 'liest', 'läst'], 2, '*Lesen* change e en ie aux 2e et 3e personnes du singulier, et le -st perd son s après le s du radical : *du liest*.'],
        ['Quel est le participe II de *denken* ?', ['gedenkt', 'gedenken', 'gedankt', 'gedacht'], 3, '*Denken* est un verbe mixte, comme *bringen* : radical modifié et terminaison faible, *dachte → gedacht*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les verbes de modalité',
      questions: [
        ['Quel mot complète la phrase ? *Was ___ du machen?* (*wollen*)', ['willst', 'wollst', 'will', 'wollt'], 0, 'Au singulier, *wollen* change de voyelle : *ich will, du willst, er will*.'],
        ['Comment traduire « Tu n’as pas le droit de fumer ici » ?', ['Du musst hier nicht rauchen', 'Du darfst hier nicht rauchen', 'Du sollst hier rauchen', 'Du kannst hier rauchen nicht'], 1, 'L’interdiction se dit *nicht dürfen* ; *nicht müssen* signifie seulement « ne pas être obligé ».'],
        ['Quel est le prétérit de *dürfen* ?', ['dürfte', 'darfte', 'durfte', 'gedurft'], 2, 'Le prétérit des modaux se forme sans inflexion : *durfte*. *Dürfte* est le subjonctif II.'],
        ['Quel mot complète la phrase ? *…, weil ich heute arbeiten ___.*', ['musst', 'müssen', 'muss ich', 'muss'], 3, 'En subordonnée, le modal conjugué part à la toute fin, après l’infinitif.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les verbes à préverbe séparable',
      questions: [
        ['Que signifie *mitkommen* ?', ['Accompagner, venir avec', 'Recevoir', 'Périr', 'Arriver'], 0, 'Le préverbe change le sens : *kommen* venir, *mitkommen* accompagner, *bekommen* recevoir, *umkommen* périr.'],
        ['Comment traduire « Je t’appelle demain » (*anrufen*) ?', ['Ich anrufe dich morgen', 'Ich rufe dich morgen an', 'Ich rufe an dich morgen', 'Ich rufe dich an morgen'], 1, 'Dans une principale, le préverbe séparable *an* ferme la phrase.'],
        ['Lequel de ces verbes est inséparable ?', ['abfahren', 'einkaufen', 'verkaufen', 'mitnehmen'], 2, '*Ver-* fait partie des préverbes inséparables, avec *be-, ge-, er-, zer-, ent-, emp-, miss-*.'],
        ['Quel est le participe II de *übersetzen* (traduire) ?', ['übergesetzt', 'geübersetzt', 'übersetzen', 'übersetzt'], 3, 'Au sens figuré de « traduire », *über-* est inséparable : pas de *ge-*, donc *übersetzt*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Les verbes pronominaux',
      questions: [
        ['Comment traduire « Il est en retard » ?', ['Er verspätet sich', 'Er verspätet', 'Er ist sich verspätet', 'Er sich verspätet'], 0, '*Sich verspäten* est pronominal en allemand alors que le français dit « être en retard ».'],
        ['Quel mot complète la phrase ? *Ich interessiere mich ___ Musik.*', ['an', 'für', 'auf', 'über'], 1, 'On dit *sich interessieren für* + accusatif.'],
        ['Quel mot complète la phrase ? *Erinnerst du dich ___ ihn?*', ['für', 'über', 'an', 'auf'], 2, 'On dit *sich erinnern an* + accusatif : se souvenir de.'],
        ['Quel mot complète « Je me réjouis de ton cadeau (reçu) » : *Ich freue mich ___ dein Geschenk.*', ['auf', 'für', 'an', 'über'], 3, '*Sich freuen über* : se réjouir de ce qui est arrivé ; *sich freuen auf* : de ce qui vient.'],
      ],
    },
    {
      niveaux: N,
      titre: 'L’indicatif présent',
      questions: [
        ['Quel mot complète la phrase ? *Er ___ fern.* (*fernsehen*)', ['seht', 'sieht', 'siehst', 'säht'], 1, '*Sehen* change e en ie à la 3e personne : *er sieht*. Le préverbe *fern* part à la fin.'],
        ['Quel mot complète la phrase ? *Ihr ___ das Buch gut.* (*finden*)', ['findt', 'finden', 'findet', 'findest'], 2, 'Radical en -d : on intercale un e devant la terminaison -t, *ihr findet*.'],
        ['Quel mot complète la phrase ? *Du ___ schnell.* (*laufen*)', ['laufst', 'läuft', 'laufest', 'läufst'], 3, '*Laufen* change au en äu aux 2e et 3e personnes du singulier : *du läufst*.'],
        ['Quel mot complète la phrase ? *Er ___ gut Deutsch.* (*sprechen*)', ['spricht', 'sprecht', 'sprichst', 'sprechet'], 0, '*Sprechen* change e en i : *du sprichst, er spricht*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le prétérit',
      questions: [
        ['Quel mot complète la phrase ? *Du ___ gestern sehr müde.* (*sein*)', ['warst', 'wart', 'warest', 'bist'], 0, 'Prétérit de *sein* : *ich war, du warst, er war*. C’est la forme que tout le monde emploie, même à l’oral.'],
        ['Quel est le prétérit de *kommen* ?', ['kommte', 'kam', 'kamm', 'gekommen'], 1, '*Kommen* est fort : *kam*, sans terminaison aux 1re et 3e personnes.'],
        ['Quel est le prétérit de *denken* ?', ['denkte', 'dankte', 'dachte', 'gedacht'], 2, '*Denken* est mixte : radical modifié et terminaison faible, *dachte*.'],
        ['Quel mot complète la phrase ? *Nachdem ich gegessen ___, ging ich schlafen.*', ['habe', 'hat', 'war', 'hatte'], 3, 'Le plus-que-parfait (prétérit de *haben* + participe) marque l’action antérieure après *nachdem*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le parfait',
      questions: [
        ['Quel mot complète la phrase ? *Ich ___ zu Hause geblieben.*', ['bin', 'habe', 'hat', 'werde'], 0, '*Bleiben* forme son parfait avec *sein*, bien qu’il n’exprime aucun mouvement.'],
        ['Quel est le participe II de *lernen* ?', ['gelernen', 'gelernt', 'lernt', 'gelerntet'], 1, 'Verbe faible : *ge-* + radical + *-t*.'],
        ['Quel est le participe II de *erzählen* ?', ['geerzählt', 'erzahlt', 'erzählt', 'geerzählen'], 2, 'Avec un préverbe inséparable comme *er-*, le participe ne prend pas de *ge-*.'],
        ['Quel mot complète la phrase ? *Wir ___ uns gestern in der Stadt begegnet.*', ['haben', 'hatten', 'werden', 'sind'], 3, '*Begegnen* (rencontrer par hasard) fait partie des verbes qui forment leur parfait avec *sein*.'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le futur',
      questions: [
        ['Quel mot complète la phrase ? *Ich werde morgen nach Berlin ___.*', ['fahren', 'fahre', 'gefahren', 'zu fahren'], 0, 'Futur I : *werden* conjugué + infinitif sans *zu*, à la fin de la phrase.'],
        ['Quel mot complète la phrase ? *Ihr ___ es sehen.*', ['werden', 'werdet', 'wird', 'wirdet'], 1, '*Werden* à la 2e personne du pluriel : *ihr werdet*.'],
        ['Que signifie « Er wird es vergessen haben » ?', ['Il l’oubliera demain', 'Il veut l’oublier', 'Il a dû l’oublier', 'Il l’oublie toujours'], 2, 'Le Futur II peut exprimer une supposition sur le passé : « il a dû l’oublier ».'],
        ['Dans « Er wird kommen », *werden* exprime…', ['Le devenir', 'Le passif', 'Une obligation', 'Le futur'], 3, 'C’est ce qui suit qui tranche : un infinitif, donc le futur. Un participe II ferait un passif, un nom un « devenir ».'],
      ],
    },
    {
      niveaux: N,
      titre: 'L’impératif',
      questions: [
        ['Comment dit-on « Soyez calme ! » (vouvoiement) ?', ['Seien Sie ruhig!', 'Sind Sie ruhig!', 'Seid Sie ruhig!', 'Sei Sie ruhig!'], 0, '*Sein* est à part : *Sei ruhig!* (du), *Seid ruhig!* (ihr), *Seien Sie ruhig!* (Sie).'],
        ['Quel est l’impératif de *arbeiten* pour *du* ?', ['Arbeit!', 'Arbeite!', 'Arbeitest!', 'Arbeitet du!'], 1, 'Après un radical en -t, le -e final est obligatoire à l’impératif : *Arbeite!*'],
        ['Quel est l’impératif de *lesen* pour *du* ?', ['Les!', 'Lese!', 'Lies!', 'Liest!'], 2, 'L’alternance e → ie se garde à l’impératif du *du* : *Lies!*, comme *Sieh!*'],
        ['Comment dit-on « Allons-y ! » ?', ['Gehen uns!', 'Wir gehen!', 'Geht wir!', 'Gehen wir!'], 3, 'Pour *wir*, l’impératif se forme avec l’infinitif suivi du pronom : *Gehen wir!*'],
      ],
    },
    {
      niveaux: N,
      titre: 'Le subjonctif II présent',
      questions: [
        ['Dans « Er sagte, er sei krank », *sei* est…', ['Un subjonctif I, du discours indirect', 'Un impératif', 'Un subjonctif II', 'Un présent de l’indicatif'], 0, 'Le subjonctif I sert au discours indirect, surtout dans la presse ; il suffit de savoir le reconnaître.'],
        ['Quelle est la forme de subjonctif II de *wissen* ?', ['wusste', 'wüsste', 'wisste', 'weißte'], 1, 'Formé sur le prétérit *wusste*, avec inflexion : *wüsste*.'],
        ['Quel mot complète la phrase ? *Wenn ich reich ___, würde ich reisen.*', ['war', 'bin', 'wäre', 'würde'], 2, 'L’irréel se dit au subjonctif II dans la subordonnée en *wenn* : *wäre* pour *sein*.'],
        ['Que signifie « Ich würde gern nach Berlin fahren » ?', ['Je suis allé à Berlin', 'J’irai à Berlin', 'Je dois aller à Berlin', 'J’aimerais bien aller à Berlin'], 3, '*Würde* + infinitif est la forme par défaut du subjonctif II ; avec *gern*, il exprime un souhait.'],
      ],
    },
  ],
}
