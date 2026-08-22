// Anglais — Terminale : LA GRAMMAIRE (24 fiches).
//
// ⚠️ CE FICHIER A GÉNÉRÉ LA MIGRATION 226, DÉJÀ EXÉCUTÉE : le régénérer doit
// produire le SQL du dépôt à l'octet près, donc ni `positionDepart` ni les
// titres ne se retouchent ici. L'état de la matière est désormais celui que
// pose la migration 243, écrite à la main par-dessus (voir plus bas).
//
// Ce module s'ajoutait à l'époque aux 4 chapitres thématiques posés par la
// migration 008 (« Faire société : unité et pluralité », « Environnements en
// mutation », « Art et débats d'idées », « Innovations et responsabilité »),
// donnés pour « les axes du programme de LV ». Vérification faite au BO, aucun
// des quatre n'est au programme de terminale — deux appartiennent à la
// spécialité « Anglais, monde contemporain ». La migration 243 les SUPPRIME et
// ramène ces 24 fiches aux positions 1 à 24 : le `positionDepart: 5` ci-dessous
// n'est donc plus l'état de la base, seulement celui que la 226 a écrit.
//
// Découpage repris tel quel du programme fourni : 4 chapitres (groupe nominal,
// groupe verbal, les temps, la phrase) éclatés en leurs 24 fiches. Ce sont ces
// quatre chapitres que la 243 réinscrit dans `chapters.theme`, pour que la page
// matière les range au lieu d'aligner les 24 fiches à plat.
//
// Règle du dépôt : les énoncés interrogent l'anglais EN FRANÇAIS, comme partout
// ailleurs dans l'app. Les exemples, eux, sont en anglais.
//
// ⚠️ Le slug reste `anglais` (la matière existe depuis 008) ; le fichier
// s'appelle `anglais-tle.mjs` pour dire ce qu'il couvre.

export default {
  slug: 'anglais',
  nom: 'Anglais',

  titreMigration: 'LA GRAMMAIRE ANGLAISE (Tle)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-contenu.mjs, 05/08/2026) : l'anglais
de Terminale n'avait que ses 4 axes thématiques — aucune fiche de langue.
Un élève qui bloquait sur le present perfect, les modaux ou le discours
indirect ne trouvait rien à réviser : l'app parlait des thèmes du bac sans
jamais donner l'outil pour les traiter.
Cette migration AJOUTE les 24 fiches de grammaire du programme (groupe
nominal, groupe verbal, temps, phrase) DERRIÈRE les 4 axes, qui restent en
place : rien n'est supprimé.`,

  blocs: [
    {
      niveaux: ['Tle'],
      // Les 4 axes thématiques occupent déjà les positions 1 à 4.
      positionDepart: 5,
      chapitres: [
        // ============================ Chapitre 1 — Le groupe nominal ======
        {
          titre: 'Les déterminants',
          lecon: {
            titre: 'A, an, the — et l’article zéro',
            cours: `Le choix du déterminant se joue sur une seule question : de quoi parle-t-on exactement ?

## L'article indéfini a / an
Il ne s'emploie qu'au **singulier dénombrable**, pour un élément non identifié : *a book*, *an hour*. La forme dépend du **son**, pas de la lettre : *an hour* (h muet), *a university* (son /j/), *an MP* (em-pi).

## L'article défini the
Il désigne ce qui est déjà identifié — par le contexte, par une relative, ou parce qu'il est unique : *the sun*, *the book I bought*. Il s'emploie aussi devant les superlatifs (*the best*) et les noms de pays au pluriel ou composés (*the United States*, *the Netherlands*).

## L'article zéro
Pas d'article devant un **indénombrable** ou un **pluriel** pris au sens général : *Water is essential*, *Dogs are loyal*, *I like music*. C'est l'erreur la plus fréquente au bac : *the life is hard* au lieu de *life is hard*.

## Les autres déterminants
**This / these** (proche), **that / those** (éloigné). Le **génitif** marque la possession : *Peter's car*, *the students' bags* (pluriel en -s → apostrophe seule). Les possessifs (*my, your, his, her, its, our, their*) s'accordent avec le **possesseur**, jamais avec l'objet : *his sister*, *her brother*.`,
          },
          questions: [
            ['Pourquoi écrit-on « an hour » et non « a hour » ?', ['Parce que le h ne se prononce pas', 'Parce que « hour » est un nom abstrait', 'Parce que le mot commence par une consonne écrite', 'Parce que c’est une exception sans règle'], 0, 'Le choix a/an dépend du SON initial, pas de la lettre.'],
            ['On écrit « a university » et non « an university ».', ['Vrai', 'Faux'], 0, 'Le mot commence par le son /j/ (« you »), donc « a ».'],
            ['Comment traduit-on « La vie est dure » ?', ['Life is hard', 'The life is hard', 'A life is hard', 'The life is the hard'], 0, 'Un nom pris au sens général ne prend pas d’article en anglais.'],
            ['« The » s’emploie devant les noms de pays au pluriel comme *the Netherlands*.', ['Vrai', 'Faux'], 0, 'De même *the United States*, *the Philippines*.'],
            ['Le génitif de « les sacs des étudiants » s’écrit…', ['the students’ bags', 'the students’s bags', 'the student’s bags', 'the bags of students'], 0, 'Un pluriel déjà en -s ne prend que l’apostrophe.'],
            ['Dans « his sister », le possessif s’accorde avec…', ['Le possesseur', 'L’objet possédé', 'Le verbe', 'Le sujet de la phrase suivante'], 0, 'C’est un frère ou une sœur DE LUI : *his*, quel que soit le genre de « sister ».'],
            ['« These » désigne ce qui est éloigné dans l’espace ou le temps.', ['Vrai', 'Faux'], 1, '*These* est proche ; *those* est éloigné.'],
            ['Devant un superlatif, on emploie…', ['the', 'a', 'an', 'aucun article'], 0, '*She is the best student in the class.*'],
          ],
        },
        {
          titre: 'Exprimer une quantité',
          lecon: {
            titre: 'Dénombrable ou indénombrable, tout part de là',
            cours: `Avant de choisir un quantifieur, il faut trancher : le nom est-il **dénombrable** (*a book, two books*) ou **indénombrable** (*information, advice, money, furniture*) ?

## Beaucoup, peu
**Many** + dénombrable pluriel, **much** + indénombrable : *many books*, *much money*. **A lot of / lots of** fonctionne avec les deux, et s'impose à l'affirmative courante.
**Few / a few** + dénombrable, **little / a little** + indénombrable. Attention au sens : *a few* = « quelques » (positif), *few* = « peu, trop peu » (négatif). Même écart entre *a little* et *little*.

## Some et any
**Some** à l'affirmative et dans les offres ou demandes (*Would you like some tea?*), **any** à la négative et à l'interrogative (*Have you got any money?*). *Any* signifie aussi « n'importe lequel » à l'affirmative : *Any student can apply*.

## Les indénombrables piégeux
*Information*, *advice*, *news*, *furniture*, *luggage*, *homework*, *progress* ne prennent **jamais de -s** et se comptent par un intermédiaire : *a piece of advice*, *two pieces of information*. *News* est singulier : *The news is good*.

## Assez, trop
**Enough** se place APRÈS l'adjectif (*old enough*) mais AVANT le nom (*enough time*). **Too** + adjectif (*too expensive*), **too much / too many** + nom.`,
          },
          questions: [
            ['Quel quantifieur s’emploie avec un indénombrable ?', ['much', 'many', 'a few', 'several'], 0, '*Much money*, mais *many books*.'],
            ['« A few friends » signifie « très peu d’amis, presque aucun ».', ['Vrai', 'Faux'], 1, '*A few* est positif (« quelques ») ; c’est *few* qui est négatif.'],
            ['Comment traduit-on « un conseil » ?', ['A piece of advice', 'An advice', 'A advice', 'One advice'], 0, '*Advice* est indénombrable : il passe par *a piece of*.'],
            ['Dans une question, on emploie normalement…', ['any', 'some', 'much of', 'a lot'], 0, '*Have you got any money?* — *some* reste possible pour une offre.'],
            ['« The news is good » est correct.', ['Vrai', 'Faux'], 0, '*News* est un indénombrable singulier malgré son -s.'],
            ['Où se place « enough » avec un adjectif ?', ['Après l’adjectif : old enough', 'Avant l’adjectif : enough old', 'En fin de phrase uniquement', 'Avant le verbe'], 0, 'Mais devant un nom il précède : *enough time*.'],
            ['« Too much homework » est correct.', ['Vrai', 'Faux'], 0, '*Homework* est indénombrable, donc *much* et pas *many*.'],
            ['« Any student can apply » signifie…', ['N’importe quel étudiant peut postuler', 'Aucun étudiant ne peut postuler', 'Quelques étudiants postulent', 'Tous les étudiants ont postulé'], 0, 'À l’affirmative, *any* prend le sens de « n’importe lequel ».'],
          ],
        },
        {
          titre: 'Les adjectifs qualificatifs',
          lecon: {
            titre: 'Invariables, antéposés, et dans le bon ordre',
            cours: `L'adjectif anglais obéit à trois règles simples, et à une quatrième que peu d'élèves connaissent.

## Invariable et antéposé
Il ne prend **jamais de -s** et se place **avant** le nom : *tall buildings*, *a red car*. Après un verbe d'état (*be, seem, look, feel, become*), il reste attribut : *She looks tired*.

## L'ordre des adjectifs
Quand plusieurs se suivent, l'ordre est fixe : **opinion – taille – âge – forme – couleur – origine – matière – but**. *A beautiful little old round black French wooden box*. Personne n'en aligne autant, mais l'ordre opinion → matière s'entend immédiatement s'il est violé.

## -ed ou -ing
C'est le piège classique. L'adjectif en **-ed** décrit ce qu'on RESSENT (*I am bored*, je m'ennuie) ; celui en **-ing** décrit ce qui PROVOQUE (*the film is boring*, le film est ennuyeux). Dire *I am boring*, c'est se déclarer ennuyeux.

## L'adjectif substantivé
*The + adjectif* désigne un groupe entier : *the poor* (les pauvres), *the unemployed* (les chômeurs), *the British* (les Britanniques). Le verbe se met alors au **pluriel** : *The rich are getting richer*.`,
          },
          questions: [
            ['Comment traduit-on « de grands bâtiments » ?', ['Tall buildings', 'Talls buildings', 'Buildings tall', 'Tall buildingses'], 0, 'L’adjectif est invariable et se place avant le nom.'],
            ['« I am boring » signifie…', ['Je suis ennuyeux', 'Je m’ennuie', 'Je suis fatigué', 'Je suis pressé'], 0, 'Pour « je m’ennuie », il faut *I am bored*.'],
            ['L’adjectif en -ing décrit ce qui provoque l’émotion.', ['Vrai', 'Faux'], 0, '*Interesting* provoque, *interested* ressent.'],
            ['Quel est l’ordre correct ?', ['A big red Italian car', 'A red big Italian car', 'An Italian red big car', 'A red Italian big car'], 0, 'Taille, puis couleur, puis origine.'],
            ['Après « seem », l’adjectif reste attribut du sujet.', ['Vrai', 'Faux'], 0, '*She seems happy* — comme après *be*, *look*, *feel*.'],
            ['« The unemployed » désigne…', ['Les chômeurs, comme groupe', 'Un chômeur', 'Le chômage', 'Le licenciement'], 0, '*The* + adjectif désigne l’ensemble d’un groupe.'],
            ['« The rich is getting richer » est correct.', ['Vrai', 'Faux'], 1, 'L’adjectif substantivé est pluriel : *the rich ARE getting richer*.'],
            ['Un adjectif anglais s’accorde en nombre avec le nom.', ['Vrai', 'Faux'], 1, 'Il est toujours invariable, quelle que soit sa place.'],
          ],
        },
        // ============================ Chapitre 2 — Le groupe verbal =======
        {
          titre: 'Les verbes lexicaux et les auxiliaires',
          lecon: {
            titre: 'Be, have, do — trois rôles à ne pas confondre',
            cours: `Un même mot peut être **auxiliaire** (il aide à construire un temps ou une forme) ou **lexical** (il porte lui-même un sens). Tout le système de la phrase anglaise en dépend.

## BE
Auxiliaire, il construit la forme en -ING (*She is working*) et le **passif** (*The house was built*). Lexical, il signifie « être » : *She is a doctor*. C'est aussi lui qui sert dans certaines expressions d'âge, de faim ou de température, là où le français emploie « avoir » : *I am cold*, *He is 17*.

## HAVE
Auxiliaire, il forme les temps composés : *I have finished*. Lexical, il signifie « avoir, posséder » : *I have a car*. Dans *have breakfast*, *have a shower*, il ne signifie plus posséder mais « prendre ».

## DO
Auxiliaire, il porte la négation et l'interrogation aux temps simples : *Do you like it?*, *I don't know*. Il sert aussi à **insister** : *I DO like it* (« si, j'aime bien »). Lexical, il signifie « faire » : *I do my homework*.

## La règle de l'auxiliaire
Seul l'auxiliaire porte la négation, l'interrogation, la reprise (*So do I*) et les question tags (*You like it, don't you?*). S'il n'y en a pas dans la phrase, l'anglais en **fabrique un** avec *do* — d'où l'impossibilité de dire *Like you tea?*.`,
          },
          questions: [
            ['Dans « The house was built in 1920 », « was » est…', ['Un auxiliaire du passif', 'Un verbe lexical signifiant « être »', 'Un modal', 'Un auxiliaire du present perfect'], 0, '*Be* + participe passé = voix passive.'],
            ['Comment traduit-on « J’ai froid » ?', ['I am cold', 'I have cold', 'I have got cold', 'It makes me cold'], 0, 'L’anglais emploie *be* là où le français emploie « avoir ».'],
            ['« Like you tea? » est une question correcte.', ['Vrai', 'Faux'], 1, 'Sans auxiliaire, il faut en fabriquer un : *Do you like tea?*'],
            ['Dans « I DO like it », l’auxiliaire sert à…', ['Insister', 'Poser une question', 'Nier', 'Former un passé'], 0, 'C’est l’emphase, souvent pour contredire.'],
            ['Dans « I have a car », « have » est un verbe lexical.', ['Vrai', 'Faux'], 0, 'Il signifie « posséder » et n’aide aucun autre verbe.'],
            ['Quel élément porte la négation dans une phrase anglaise ?', ['L’auxiliaire', 'Le verbe lexical', 'Le sujet', 'Le complément'], 0, '*I do not know*, *she has not finished*.'],
            ['« Have breakfast » signifie « posséder un petit-déjeuner ».', ['Vrai', 'Faux'], 1, 'Ici *have* signifie « prendre ».'],
            ['Dans un question tag, on reprend…', ['L’auxiliaire de la phrase', 'Le verbe lexical', 'Le sujet seul', 'Un mot interrogatif'], 0, '*You like it, don’t you?* — l’auxiliaire est fabriqué si besoin.'],
          ],
        },
        {
          titre: 'Les auxiliaires modaux',
          lecon: {
            titre: 'Le point de vue de celui qui parle',
            cours: `Un modal n'ajoute pas une information sur le monde : il dit ce que le **locuteur** pense de ce qu'il énonce — capacité, obligation, probabilité, conseil.

## La forme, d'abord
Un modal ne prend **jamais de -s** à la 3e personne, est suivi de la **base verbale sans TO** (*He can swim*), et se combine directement avec *not* (*cannot, mustn't*). Deux modaux ne se suivent jamais : pour « il pourra », on dit *he will be able to*.

## Les valeurs principales
**Can / could** : capacité, permission, possibilité. **May / might** : possibilité incertaine (*It might rain*), permission plus formelle. **Must** : obligation forte venue du locuteur, ou déduction quasi certaine (*He must be tired*). **Have to** : obligation venue des circonstances extérieures. **Should / ought to** : conseil. **Will / would** : volonté, prédiction, habitude passée.

## Le double sens de MUST
*You must go* peut être un ordre (**radical**) ou une déduction (**épistémique**) : *He must be exhausted*, « il doit être épuisé ». C'est le contexte qui tranche. Attention à la négation : *mustn't* = interdiction ; *don't have to* = absence d'obligation. Les deux ne disent pas du tout la même chose.

## Le modal + have + participe passé
C'est le regard porté sur le **passé** : *He must have missed the train* (déduction), *She should have called* (reproche), *They might have forgotten* (hypothèse).`,
          },
          questions: [
            ['Quelle forme suit un modal ?', ['La base verbale sans TO', 'L’infinitif avec TO', 'Le participe présent', 'Le prétérit'], 0, '*He can swim*, jamais *he can to swim*.'],
            ['« He cans swim » est correct.', ['Vrai', 'Faux'], 1, 'Un modal ne prend jamais de -s à la 3e personne.'],
            ['« You mustn’t go » signifie…', ['Tu ne dois pas y aller : c’est interdit', 'Tu n’es pas obligé d’y aller', 'Tu devrais y aller', 'Tu pourras y aller'], 0, 'L’absence d’obligation, c’est *you don’t have to go*.'],
            ['« He must be tired » exprime ici…', ['Une déduction', 'Une obligation', 'Une permission', 'Une capacité passée'], 0, 'C’est la valeur épistémique de *must*.'],
            ['« He will can come » est une forme correcte.', ['Vrai', 'Faux'], 1, 'Deux modaux ne se suivent pas : *he will be able to come*.'],
            ['« She should have called » exprime…', ['Un reproche sur le passé', 'Une obligation future', 'Une capacité', 'Une permission'], 0, 'Modal + *have* + participe passé porte un regard sur le passé.'],
            ['Quelle différence entre « must » et « have to » ?', ['Must vient du locuteur, have to des circonstances', 'Must est toujours passé', 'Have to est un modal', 'Aucune différence'], 0, 'D’où *I must stop smoking* (ma décision) vs *I have to work late* (on m’y oblige).'],
            ['« It might rain » exprime une possibilité incertaine.', ['Vrai', 'Faux'], 0, '*May* et *might* marquent l’éventualité.'],
          ],
        },
        {
          titre: 'Les verbes à particule et les verbes prépositionnels',
          lecon: {
            titre: 'Give up, look after — la particule change tout',
            cours: `Ces verbes forment l'essentiel de l'anglais courant, et c'est presque toujours la **particule** qui porte le sens.

## Le verbe à particule (phrasal verb)
Verbe + particule adverbiale : *give up*, *turn on*, *put off*. Le sens devient idiomatique — *give up* ne veut pas dire « donner en haut » mais « abandonner ». Quand il est **transitif séparable**, le complément peut s'intercaler : *turn the light on* ou *turn on the light*. Mais un pronom se place **obligatoirement au milieu** : *turn it on*, jamais *turn on it*.

## Le verbe prépositionnel
Verbe + préposition inséparable : *look after* (s'occuper de), *look for* (chercher), *depend on*, *listen to*. Le complément vient toujours APRÈS la préposition, même s'il est pronom : *look after him*.

## La même base, des sens opposés
*Look* est l'exemple à retenir : *look at* (regarder), *look for* (chercher), *look after* (s'occuper de), *look up* (chercher dans un dictionnaire), *look forward to* (attendre avec impatience). Changer la particule, c'est changer le verbe.

## Le piège de la fin de phrase
Contrairement au français, la préposition anglaise peut **rester en fin de phrase** : *Who are you waiting for?*, *This is the book I told you about*.`,
          },
          questions: [
            ['Que signifie « give up » ?', ['Abandonner', 'Donner', 'Se lever', 'Rendre visite'], 0, 'La particule change complètement le sens du verbe.'],
            ['« Turn on it » est correct pour « allume-la ».', ['Vrai', 'Faux'], 1, 'Un pronom s’intercale obligatoirement : *turn it on*.'],
            ['Que signifie « look after » ?', ['S’occuper de', 'Chercher', 'Regarder', 'Ressembler à'], 0, '*Look for* = chercher, *look at* = regarder.'],
            ['Dans un verbe prépositionnel, le complément peut s’intercaler.', ['Vrai', 'Faux'], 1, 'La préposition est inséparable : *listen to the radio*.'],
            ['« I look forward to hearing from you » se termine par un gérondif parce que…', ['« to » y est une préposition, pas la marque de l’infinitif', 'C’est une exception', 'Le verbe est irrégulier', 'La phrase est au passif'], 0, 'Après une préposition, l’anglais met toujours la forme en -ING.'],
            ['« Who are you waiting for? » est une phrase correcte.', ['Vrai', 'Faux'], 0, 'La préposition peut rester en fin de phrase, contrairement au français.'],
            ['Que signifie « put off » ?', ['Reporter', 'Poser', 'Éteindre le feu', 'Se déshabiller'], 0, '*The meeting was put off until Monday.*'],
            ['« Look up a word » signifie…', ['Chercher un mot dans un dictionnaire', 'Lever les yeux vers un mot', 'Épeler un mot', 'Souligner un mot'], 0, 'Encore une particule qui refait le sens du verbe.'],
          ],
        },
        {
          titre: 'Infinitif et gérondif',
          lecon: {
            titre: 'To do ou doing : le verbe choisit',
            cours: `Quand un verbe est suivi d'un autre verbe, l'anglais impose une forme : à l'infinitif, au gérondif, ou parfois aux deux avec un changement de sens.

## Après une préposition : toujours -ING
Sans exception : *before leaving*, *instead of waiting*, *good at singing*, *interested in learning*. Le piège vient de *to* : dans *look forward to*, *be used to*, *object to*, *to* est une **préposition** — d'où *I look forward to seeing you*.

## Les verbes suivis de -ING
*Enjoy, avoid, finish, mind, suggest, practise, keep, give up, can't stand, deny* : *I enjoy reading*, *He avoided answering*.

## Les verbes suivis de l'infinitif
*Want, decide, hope, promise, refuse, agree, manage, offer, seem, afford* : *She decided to leave*, *They refused to sign*.

## Les deux, avec deux sens
- *Remember to do* (penser à faire) / *remember doing* (se souvenir d'avoir fait).
- *Stop to do* (s'arrêter POUR faire) / *stop doing* (arrêter de faire).
- *Try to do* (s'efforcer) / *try doing* (essayer pour voir).
- *Mean to do* (avoir l'intention) / *mean doing* (impliquer).
La différence est réelle : *I stopped smoking* et *I stopped to smoke* disent le contraire l'un de l'autre.`,
          },
          questions: [
            ['Quelle forme suit une préposition ?', ['La forme en -ING', 'L’infinitif avec TO', 'La base verbale', 'Le participe passé'], 0, '*Before leaving*, *good at singing*.'],
            ['« I look forward to see you » est correct.', ['Vrai', 'Faux'], 1, 'Ici *to* est une préposition : *to seeing you*.'],
            ['Quel verbe est suivi de -ING ?', ['enjoy', 'decide', 'want', 'promise'], 0, '*I enjoy reading* ; les trois autres appellent l’infinitif.'],
            ['« I stopped smoking » signifie…', ['J’ai arrêté de fumer', 'Je me suis arrêté pour fumer', 'J’ai commencé à fumer', 'Je fume encore'], 0, '*I stopped to smoke* signifierait l’inverse.'],
            ['« Remember doing something » renvoie au souvenir d’une action déjà faite.', ['Vrai', 'Faux'], 0, '*Remember to do* signifie au contraire « penser à faire ».'],
            ['Après « avoid », on emploie…', ['-ING', 'to + base verbale', 'la base verbale seule', 'un participe passé'], 0, '*He avoided answering the question.*'],
            ['« She decided leaving » est correct.', ['Vrai', 'Faux'], 1, '*Decide* appelle l’infinitif : *decided to leave*.'],
            ['« Try doing » signifie…', ['Essayer pour voir ce que ça donne', 'S’efforcer difficilement', 'Refuser de faire', 'Réussir à faire'], 0, '*Try to do*, lui, marque l’effort.'],
          ],
        },
        {
          titre: 'Les adverbes',
          lecon: {
            titre: 'Comment, quand, à quel point',
            cours: `L'adverbe modifie un verbe, un adjectif, un autre adverbe ou la phrase entière — et sa **place** est plus contrainte qu'en français.

## La formation
La plupart se forment en ajoutant **-ly** à l'adjectif : *quick → quickly*, *happy → happily*, *terrible → terribly*. Certains sont identiques à l'adjectif : *fast, hard, late, early*. Attention aux faux amis : *hardly* ne signifie pas « durement » mais « à peine » ; *lately* signifie « récemment ».

## La place
Les adverbes de **fréquence** (*always, often, usually, never, rarely*) se placent AVANT le verbe lexical mais APRÈS *be* et les auxiliaires : *She often works late*, *She is often late*, *I have never seen it*.
Les adverbes de **manière** se placent en général après le verbe ou après le complément : *He speaks English fluently* — et surtout jamais entre le verbe et son COD : pas de *He speaks fluently English*.

## Le degré
*Very* + adjectif simple (*very good*), mais *much / far* + comparatif (*much better*, jamais *very better*). *Too* = « trop », *enough* = « assez ».

## L'adverbe de phrase
Placé en tête, il commente tout l'énoncé : *Unfortunately, they lost*, *Obviously, he was lying*.`,
          },
          questions: [
            ['Que signifie « hardly » ?', ['À peine', 'Durement', 'Difficilement', 'Fortement'], 0, 'Faux ami classique : *I could hardly hear him.*'],
            ['Où se place « often » dans « She works late » ?', ['Avant le verbe : She often works late', 'En fin de phrase obligatoirement', 'Entre le verbe et son complément', 'Avant le sujet'], 0, 'Les adverbes de fréquence précèdent le verbe lexical.'],
            ['« She is often late » : l’adverbe se place après « be ».', ['Vrai', 'Faux'], 0, 'Avec *be* et les auxiliaires, l’adverbe passe derrière.'],
            ['« He speaks fluently English » est correct.', ['Vrai', 'Faux'], 1, 'On ne sépare jamais le verbe de son COD : *He speaks English fluently.*'],
            ['Quel est l’adverbe formé sur « happy » ?', ['happily', 'happyly', 'happly', 'happier'], 0, 'Le -y final devient -i devant -ly.'],
            ['Comment dit-on « bien meilleur » ?', ['Much better', 'Very better', 'Very best', 'More better'], 0, '*Very* ne se combine pas avec un comparatif.'],
            ['« Fast » a la même forme comme adjectif et comme adverbe.', ['Vrai', 'Faux'], 0, 'Comme *hard*, *late*, *early*.'],
            ['« Lately » signifie…', ['Récemment', 'Tardivement', 'Lentement', 'Plus tard'], 0, 'Pour « en retard », c’est *late*.'],
          ],
        },
        // ============================ Chapitre 3 — Les temps ==============
        {
          titre: 'Le présent simple et le présent en BE + -ING',
          lecon: {
            titre: 'Ce qui est vrai en général, ce qui se passe maintenant',
            cours: `L'anglais n'a pas un présent mais deux, et le choix n'est pas une nuance de style : il change le sens.

## Le présent simple
Base verbale, avec **-s à la 3e personne du singulier** (*he works*). Il énonce ce qui est **général, permanent, habituel** ou considéré comme vrai : *Water boils at 100°C*, *She lives in Leeds*, *I get up at seven*. Il s'emploie aussi pour les goûts, les états et les vérités durables.

## Le présent en BE + -ING
*Be* conjugué + verbe en -ING. Il décrit une action **en cours au moment où l'on parle**, ou une situation temporaire : *She is working right now*, *I'm staying with my aunt this month*. Avec *always*, il ajoute une nuance d'agacement : *He is always complaining*.

## Les verbes qui refusent -ING
Les verbes d'état ne se mettent normalement pas en -ING : *know, believe, understand, want, need, like, hate, own, belong, seem*. On dit *I know*, jamais *I am knowing*. Certains changent de sens : *I think it's good* (opinion) / *I'm thinking about it* (activité mentale en cours).

## Le futur déguisé
Le présent en -ING sert au **futur programmé** : *We're leaving tomorrow*. Et après *when, as soon as, until, if*, l'anglais emploie le **présent** là où le français met le futur : *When he arrives, I'll call you*.`,
          },
          questions: [
            ['Quel temps pour « L’eau bout à 100 °C » ?', ['Le présent simple', 'Le présent en BE + -ING', 'Le prétérit', 'Le present perfect'], 0, 'Une vérité générale appelle le présent simple.'],
            ['« I am knowing the answer » est correct.', ['Vrai', 'Faux'], 1, '*Know* est un verbe d’état : *I know the answer.*'],
            ['« She is working right now » décrit…', ['Une action en cours', 'Une habitude', 'Un fait permanent', 'Un projet abandonné'], 0, 'C’est la valeur première de BE + -ING.'],
            ['« He is always complaining » ajoute une nuance…', ['D’agacement', 'De politesse', 'De doute', 'De regret'], 0, '*Always* + -ING marque l’exaspération.'],
            ['Comment traduit-on « Quand il arrivera, je t’appellerai » ?', ['When he arrives, I’ll call you', 'When he will arrive, I’ll call you', 'When he arrive, I call you', 'When he is arriving, I call you'], 0, 'Après *when*, l’anglais emploie le présent, jamais *will*.'],
            ['« We’re leaving tomorrow » exprime un futur programmé.', ['Vrai', 'Faux'], 0, 'BE + -ING sert couramment au futur planifié.'],
            ['À la 3e personne du singulier, le présent simple prend…', ['-s', '-ing', '-ed', 'aucune marque'], 0, '*He works*, *she goes*.'],
            ['« I’m thinking about it » et « I think it’s good » ont le même sens.', ['Vrai', 'Faux'], 1, 'Le premier décrit une activité en cours, le second une opinion.'],
          ],
        },
        {
          titre: 'Le prétérit simple et le prétérit BE + -ING',
          lecon: {
            titre: 'Le passé coupé du présent',
            cours: `Le prétérit est LE temps du récit anglais : il situe un fait dans un passé **révolu**, sans lien avec le moment présent.

## La forme
Verbes réguliers : base + **-ed** (*worked*, *played*, *studied*). Verbes irréguliers : à connaître par cœur (*go → went*, *see → saw*, *take → took*). À la négative et à l'interrogative, *did* porte la marque du passé et le verbe revient à la base : *I didn't go*, *Did you see?* — jamais *I didn't went*.

## Ses emplois
Un fait daté ou situé dans un passé terminé : *I saw him yesterday*, *She was born in 2007*, *World War II ended in 1945*. Il accompagne les repères du passé : *yesterday, last week, in 2010, two years ago, when I was a child*.

## Le prétérit en BE + -ING
*Was / were* + -ING décrit une action **en train de se dérouler** dans le passé, souvent interrompue par une autre : *I was watching TV when the phone rang*. C'est l'équivalent de notre imparfait de description, tandis que le prétérit simple correspond au passé simple ou au passé composé du récit.

## L'erreur à ne pas faire
Un fait daté ne se met JAMAIS au present perfect : *I have seen him yesterday* est faux. Dès qu'un repère de temps passé est présent, c'est le prétérit.`,
          },
          questions: [
            ['Comment se forme le prétérit d’un verbe régulier ?', ['Base + -ed', 'Base + -ing', 'have + participe passé', 'was + base'], 0, '*Work → worked*, *play → played*.'],
            ['« I didn’t went » est correct.', ['Vrai', 'Faux'], 1, '*Did* porte déjà le passé : *I didn’t go.*'],
            ['Quel temps pour « I saw him yesterday » ?', ['Le prétérit', 'Le present perfect', 'Le past perfect', 'Le présent simple'], 0, 'Un repère de temps passé impose le prétérit.'],
            ['« I have seen him yesterday » est correct.', ['Vrai', 'Faux'], 1, 'Le present perfect refuse tout repère de passé daté.'],
            ['Dans « I was watching TV when the phone rang », le prétérit en BE + -ING décrit…', ['L’action en cours, interrompue', 'L’action brève qui interrompt', 'Une habitude passée', 'Un futur dans le passé'], 0, 'C’est l’arrière-plan ; *rang* est l’événement.'],
            ['Le prétérit établit un lien avec le moment présent.', ['Vrai', 'Faux'], 1, 'Il coupe au contraire du présent : c’est ce qui le distingue du present perfect.'],
            ['Quel est le prétérit de « take » ?', ['took', 'taked', 'taken', 'takes'], 0, 'Verbe irrégulier : *take – took – taken*.'],
            ['« When I was a child » appelle le prétérit.', ['Vrai', 'Faux'], 0, 'C’est un repère de passé révolu.'],
          ],
        },
        {
          titre: 'Le present perfect et le present perfect BE + -ING',
          lecon: {
            titre: 'Le passé qui compte encore aujourd’hui',
            cours: `C'est le temps le plus mal traduit par les francophones, parce qu'il ressemble à notre passé composé sans en avoir le sens.

## La forme
*Have / has* + **participe passé** : *I have finished*, *She has gone*.

## Le bilan au présent
Le present perfect ne raconte pas le passé : il fait le **bilan, maintenant**, d'un fait passé. *I have lost my keys* signifie « je n'ai plus mes clés » — le résultat est ce qui compte. D'où son incompatibilité totale avec un repère de passé daté.

## Ses marqueurs
*Ever, never, already, yet, just, so far, recently* : *Have you ever been to London?*, *I haven't finished yet*.
Avec **since** (point de départ) et **for** (durée), il exprime ce qui a commencé dans le passé et **dure encore** : *I have lived here since 2019 / for six years*. Le français dit « je vis ici depuis… » au présent : c'est le piège numéro un.

## Le present perfect en BE + -ING
*Have been* + -ING insiste sur la **durée** de l'activité et sur ses traces : *I've been waiting for two hours* (et j'attends encore), *You've been crying* (j'en vois les traces). Le present perfect simple, lui, insiste sur le **résultat achevé** : *I've written three letters* (elles sont écrites).`,
          },
          questions: [
            ['Comment se forme le present perfect ?', ['have/has + participe passé', 'had + participe passé', 'be + -ing', 'did + base verbale'], 0, '*I have finished*, *she has gone*.'],
            ['Comment traduit-on « Je vis ici depuis 2019 » ?', ['I have lived here since 2019', 'I live here since 2019', 'I am living here since 2019', 'I lived here since 2019'], 0, 'Une situation commencée dans le passé et toujours vraie appelle le present perfect.'],
            ['« Since » introduit une durée, « for » un point de départ.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : *since 2019* (point de départ), *for six years* (durée).'],
            ['« I have lost my keys » insiste sur…', ['Le résultat présent : je ne les ai plus', 'Le moment exact de la perte', 'Une habitude', 'Un projet'], 0, 'Le present perfect fait le bilan au présent.'],
            ['Quel marqueur va avec le present perfect ?', ['already', 'yesterday', 'last week', 'in 2010'], 0, 'Les repères datés imposent au contraire le prétérit.'],
            ['« I’ve been waiting for two hours » suggère que l’attente est terminée.', ['Vrai', 'Faux'], 1, 'La forme en -ING insiste sur la durée en cours.'],
            ['« Have you ever been to London? » interroge sur…', ['Une expérience de vie, sans date', 'Un voyage précis daté', 'Un projet futur', 'Une habitude actuelle'], 0, '*Ever* est un marqueur typique du bilan d’expérience.'],
            ['« I have finished yesterday » est correct.', ['Vrai', 'Faux'], 1, 'Un repère daté est incompatible avec le present perfect.'],
          ],
        },
        {
          titre: 'Le past perfect et le past perfect BE + -ING',
          lecon: {
            titre: 'Le passé avant le passé',
            cours: `Quand un récit au passé doit revenir sur un fait **antérieur**, l'anglais change de temps : c'est le rôle du past perfect.

## La forme
*Had* + **participe passé**, quelle que soit la personne : *I had finished*, *they had gone*. La forme contractée *'d* se confond à l'oral avec *would* : c'est le participe passé qui tranche (*he'd gone* vs *he'd go*).

## L'emploi
Il marque l'antériorité par rapport à un autre fait passé : *When I arrived, the train had already left* — le départ précède l'arrivée. Sans lui, l'ordre des événements devient ambigu. Il correspond souvent au plus-que-parfait français.

## Avec les conjonctions
*After, once, as soon as, when, by the time* appellent volontiers le past perfect pour la première action : *After she had read the letter, she burnt it*.

## Le past perfect en BE + -ING
*Had been* + -ING insiste sur la durée de l'action antérieure : *He was exhausted: he had been driving for ten hours*. On le retrouve aussi dans l'irréel du passé (*If I had known…*) et dans le discours indirect, où le present perfect et le prétérit deviennent tous deux past perfect : *« I have finished » → He said he had finished*.`,
          },
          questions: [
            ['Comment se forme le past perfect ?', ['had + participe passé', 'have + participe passé', 'was + -ing', 'did + participe passé'], 0, 'La forme est la même à toutes les personnes.'],
            ['Dans « When I arrived, the train had already left », quel fait est le plus ancien ?', ['Le départ du train', 'Mon arrivée', 'Les deux sont simultanés', 'On ne peut pas le savoir'], 0, 'Le past perfect marque l’antériorité.'],
            ['Le past perfect correspond souvent au plus-que-parfait français.', ['Vrai', 'Faux'], 0, '*Il avait fini* → *he had finished*.'],
            ['Au discours indirect, un prétérit devient…', ['Un past perfect', 'Un present perfect', 'Un présent', 'Un futur'], 0, 'Comme le present perfect : les deux remontent à *had* + participe passé.'],
            ['« He had been driving for ten hours » insiste sur…', ['La durée de l’action antérieure', 'Le résultat achevé', 'Une habitude présente', 'Un projet'], 0, '*Had been* + -ING met la durée en avant.'],
            ['Le past perfect s’emploie aussi dans l’irréel du passé après « if ».', ['Vrai', 'Faux'], 0, '*If I had known, I would have come.*'],
            ['« After she read the letter, she burnt it » est ambigu sans past perfect.', ['Vrai', 'Faux'], 0, 'Le past perfect rend l’ordre des faits explicite.'],
            ['Dans « he’d gone », la contraction ’d correspond à…', ['had', 'would', 'did', 'should'], 0, 'Le participe passé qui suit le prouve.'],
          ],
        },
        {
          titre: 'Exprimer le futur et le conditionnel',
          lecon: {
            titre: 'Will, be going to, et l’irréel',
            cours: `L'anglais n'a pas de temps futur : il a des **façons** de parler de l'avenir, et chacune dit autre chose.

## Les quatre formes de l'avenir
**Will** : prédiction, décision prise au moment de parler, promesse (*I'll help you*).
**Be going to** : intention déjà formée, ou prédiction fondée sur un indice visible (*Look at those clouds — it's going to rain*).
**Présent en -ING** : programme fixé, avec une date (*We're flying to Dublin on Monday*).
**Présent simple** : horaires officiels (*The train leaves at 6*).

## Le futur dans la subordonnée
Après *when, as soon as, until, before, after, if*, on emploie le **présent**, jamais *will* : *I'll call you when I get home*.

## Le conditionnel
Il se rend par **would** + base verbale : *I would go*. Les trois structures à maîtriser :
- **Type 1**, possible : *If it rains, I will stay home*.
- **Type 2**, irréel du présent : *If I had money, I would travel* (prétérit dans la subordonnée, *would* dans la principale). À la 1re et 3e personne, *were* est la forme soignée : *If I were you…*
- **Type 3**, irréel du passé : *If I had known, I would have come*.

## Jamais deux « would »
*If I would have money* est une faute lourde : la subordonnée en *if* ne prend ni *will* ni *would*.`,
          },
          questions: [
            ['« Look at those clouds — it’s going to rain » exprime…', ['Une prédiction fondée sur un indice visible', 'Une décision prise à l’instant', 'Un horaire officiel', 'Une promesse'], 0, '*Be going to* s’appuie sur le présent visible.'],
            ['Comment traduit-on « Je t’appellerai quand je rentrerai » ?', ['I’ll call you when I get home', 'I’ll call you when I will get home', 'I call you when I get home', 'I would call you when I get home'], 0, 'Après *when*, on emploie le présent.'],
            ['« The train leaves at 6 » convient pour un horaire officiel.', ['Vrai', 'Faux'], 0, 'Le présent simple s’emploie pour les programmes fixés institutionnellement.'],
            ['Dans une hypothèse de type 2, la subordonnée est au…', ['Prétérit', 'Présent', 'Present perfect', 'Conditionnel'], 0, '*If I had money, I would travel.*'],
            ['« If I would have money » est correct.', ['Vrai', 'Faux'], 1, 'La subordonnée en *if* ne prend jamais *will* ni *would*.'],
            ['« If I had known, I would have come » relève du…', ['Type 3, irréel du passé', 'Type 1, hypothèse possible', 'Type 2, irréel du présent', 'Futur programmé'], 0, 'Past perfect + *would have* + participe passé.'],
            ['« If I were you » est la forme soignée de l’irréel.', ['Vrai', 'Faux'], 0, '*Were* s’emploie à toutes les personnes dans cette structure.'],
            ['« Will » convient le mieux pour…', ['Une décision prise au moment où l’on parle', 'Un projet arrêté depuis longtemps', 'Un horaire de train', 'Une intention déjà formée'], 0, '*I’ll help you* — décision immédiate.'],
          ],
        },
        // ============================ Chapitre 4 — La phrase ==============
        {
          titre: 'Les questions',
          lecon: {
            titre: 'L’auxiliaire d’abord',
            cours: `Toute question anglaise repose sur un **auxiliaire placé devant le sujet**. S'il n'y en a pas, on en fabrique un avec *do*.

## L'ordre des mots
(Mot interrogatif) + **auxiliaire** + sujet + verbe : *Where does she live?*, *Have you finished?*, *Can he swim?*. Le verbe lexical reste à la base : *Where does she lives?* est une faute.

## Les mots interrogatifs
*Who* (qui), *what* (quoi), *which* (lequel, dans un choix limité), *where*, *when*, *why*, *how*. Les composés : *how long* (durée), *how far* (distance), *how often* (fréquence), *how much / how many* (quantité), *what … like* (« comment est… ») — à ne pas confondre avec *how is he?* qui interroge sur la santé ou l'humeur.

## La question sur le sujet
Quand le mot interrogatif EST le sujet, on n'ajoute pas d'auxiliaire : *Who broke the window?* et non *Who did break…*. Comparer avec *Who did you see?* (là, *who* est complément).

## Les question tags
Reprise brève, de polarité inversée : affirmative → tag négatif (*You're French, aren't you?*), négative → tag affirmatif (*He can't swim, can he?*). On y reprend l'auxiliaire de la phrase, ou *do* s'il n'y en a pas.`,
          },
          questions: [
            ['Quel est l’ordre correct ?', ['Where does she live?', 'Where she lives?', 'Where does she lives?', 'Where lives she?'], 0, 'Auxiliaire + sujet + base verbale.'],
            ['« Who did break the window? » est correct.', ['Vrai', 'Faux'], 1, 'Quand *who* est sujet, pas d’auxiliaire : *Who broke the window?*'],
            ['« How long » interroge sur…', ['La durée', 'La distance', 'La fréquence', 'La taille'], 0, '*How far* porte sur la distance, *how often* sur la fréquence.'],
            ['« What is she like? » demande…', ['Comment elle est (caractère, description)', 'Ce qu’elle aime', 'Comment elle va', 'Ce qu’elle fait'], 0, '*How is she?* porterait sur sa santé ou son humeur.'],
            ['Le tag de « You’re French » est…', ['aren’t you?', 'are you?', 'don’t you?', 'isn’t it?'], 0, 'La polarité s’inverse et l’auxiliaire se reprend.'],
            ['Dans une question, le verbe lexical reste à la base verbale.', ['Vrai', 'Faux'], 0, '*Does she live*, jamais *does she lives*.'],
            ['« Which » s’emploie plutôt quand…', ['Le choix est limité à un ensemble connu', 'On ignore tout de l’ensemble', 'On interroge sur une personne', 'On interroge sur un lieu'], 0, '*Which of these two do you prefer?*'],
            ['Le tag de « He can’t swim » est « can he? ».', ['Vrai', 'Faux'], 0, 'Phrase négative → tag affirmatif.'],
          ],
        },
        {
          titre: 'La phrase exclamative',
          lecon: {
            titre: 'What a…! How…!',
            cours: `L'exclamation anglaise se construit sur deux mots seulement, mais leur syntaxe est stricte — et l'ordre des mots n'y est pas celui d'une question.

## WHAT + groupe nominal
*What* introduit un NOM. Au singulier dénombrable, il faut l'article : **What a** beautiful day! Au pluriel ou avec un indénombrable, pas d'article : *What lovely flowers!*, *What terrible weather!*

## HOW + adjectif ou adverbe
*How* introduit un ADJECTIF ou un ADVERBE, jamais un nom : *How strange!*, *How beautifully she sings!* On peut développer : *How kind of you to come!*

## L'ordre des mots
Sujet et verbe restent dans l'ordre normal, contrairement à la question : *What a mess this is!* (et non *is this*). Le verbe est d'ailleurs souvent sous-entendu : *What a pity!*

## Les autres tournures
*So* + adjectif (*It's so cold!*), *such* + groupe nominal (*It's such a mess!*) — même partage que *how* / *what*. Et l'exclamation négative rhétorique : *Isn't it beautiful!*`,
          },
          questions: [
            ['Comment traduit-on « Quelle belle journée ! » ?', ['What a beautiful day!', 'How a beautiful day!', 'What beautiful day!', 'How beautiful day!'], 0, '*What* + nom, avec l’article au singulier dénombrable.'],
            ['« What terrible weather! » est correct sans article.', ['Vrai', 'Faux'], 0, '*Weather* est indénombrable : pas de *a*.'],
            ['« How » introduit…', ['Un adjectif ou un adverbe', 'Un nom', 'Un verbe conjugué', 'Un sujet'], 0, '*How strange!*, *How beautifully she sings!*'],
            ['Dans une exclamative, on inverse sujet et verbe comme dans une question.', ['Vrai', 'Faux'], 1, 'L’ordre reste normal : *What a mess this is!*'],
            ['Quelle forme est correcte ?', ['It’s such a mess', 'It’s so a mess', 'It’s such mess', 'It’s so mess'], 0, '*Such* + groupe nominal, *so* + adjectif.'],
            ['« How kind of you to come! » est une exclamation correcte.', ['Vrai', 'Faux'], 0, '*How* + adjectif, complété par un infinitif.'],
            ['« What lovely flowers! » ne prend pas d’article parce que…', ['Le nom est au pluriel', 'Le nom est abstrait', 'L’adjectif commence par une consonne', 'C’est une exception'], 0, '*A / an* n’existe qu’au singulier.'],
            ['« It’s so cold! » exprime une exclamation.', ['Vrai', 'Faux'], 0, '*So* + adjectif est la tournure courante à l’oral.'],
          ],
        },
        {
          titre: 'Le comparatif et le superlatif',
          lecon: {
            titre: 'Plus, moins, autant — et le plus',
            cours: `La règle dépend de la **longueur de l'adjectif**, comptée en syllabes.

## Les adjectifs courts (1 syllabe, ou 2 en -y)
Comparatif : **-er + than** (*taller than*, *happier than*). Superlatif : **the … -est** (*the tallest*, *the happiest*). Attention au doublement de la consonne finale : *big → bigger → the biggest*.

## Les adjectifs longs (2 syllabes et plus)
Comparatif : **more … than** (*more expensive than*). Superlatif : **the most …** (*the most expensive*).

## Les irréguliers
*good → better → the best* ; *bad → worse → the worst* ; *far → farther/further → the farthest/furthest* ; *little → less → the least* ; *much/many → more → the most*.

## Les autres comparaisons
Égalité : **as … as** (*as tall as*) ; inégalité : *not as … as* ou *less … than*. Progression : *more and more expensive*, *bigger and bigger*. Proportion : **the more … the more** (*The more I read, the more I understand*).

## Les fautes fréquentes
Jamais de double marque : *more taller* est faux. *Very* ne se combine pas avec un comparatif : on dit *much better*, jamais *very better*. Et le superlatif prend toujours **the**.`,
          },
          questions: [
            ['Quel est le comparatif de « expensive » ?', ['more expensive than', 'expensiver than', 'the most expensive', 'as expensive'], 0, 'Adjectif long : *more … than*.'],
            ['« More taller » est correct.', ['Vrai', 'Faux'], 1, 'Une seule marque de comparatif à la fois.'],
            ['Quel est le superlatif de « good » ?', ['the best', 'the goodest', 'the better', 'the most good'], 0, 'Irrégulier : *good – better – the best*.'],
            ['« Big » fait son comparatif en…', ['bigger', 'biger', 'more big', 'biggest'], 0, 'La consonne finale double après une voyelle courte.'],
            ['« As tall as » exprime l’égalité.', ['Vrai', 'Faux'], 0, 'Et *not as tall as* l’infériorité.'],
            ['Comment traduit-on « Plus je lis, plus je comprends » ?', ['The more I read, the more I understand', 'More I read, more I understand', 'The most I read, the most I understand', 'More and more I read'], 0, 'Structure *the more … the more*.'],
            ['Le superlatif s’emploie sans article.', ['Vrai', 'Faux'], 1, 'Il prend toujours *the* : *the tallest building*.'],
            ['Quel est le comparatif de « bad » ?', ['worse', 'badder', 'more bad', 'worst'], 0, '*Bad – worse – the worst*.'],
          ],
        },
        {
          titre: 'Les subordonnées',
          lecon: {
            titre: 'Relatives, complétives, circonstancielles',
            cours: `Une subordonnée dépend d'une proposition principale. Trois familles à distinguer, chacune avec ses pièges.

## Les relatives
Elles complètent un nom. **Who** (personne), **which** (chose), **that** (les deux, à l'oral surtout), **whose** (dont, possession), **where / when**.
La distinction essentielle : la relative **déterminative** identifie le nom et ne prend PAS de virgule (*The man who called is my uncle*) ; la relative **appositive** ajoute une information et s'encadre de virgules, avec *who* ou *which* mais jamais *that* (*My uncle, who lives in York, called*).
Le pronom relatif **complément** peut s'effacer : *The book (that) I read*.

## Les complétives
Introduites par **that**, souvent omis : *I think (that) he's right*. Après *say*, *tell*, *know*, *hope*, *believe*. Attention : *tell* exige un complément de personne (*tell me*), pas *say*.

## Les circonstancielles
Temps (*when, while, as soon as, until*), cause (*because, since, as*), but (*so that, in order that*), condition (*if, unless*), concession (*although, even though*). Rappel qui vaut double au bac : après les conjonctions de temps et *if*, l'anglais met le **présent** pour parler de l'avenir.`,
          },
          questions: [
            ['Quel relatif exprime la possession ?', ['whose', 'which', 'who', 'whom'], 0, '*The student whose bag was stolen.*'],
            ['Une relative appositive peut être introduite par « that ».', ['Vrai', 'Faux'], 1, 'Entre virgules, on emploie *who* ou *which*, jamais *that*.'],
            ['« The book I read yesterday » est correct sans relatif.', ['Vrai', 'Faux'], 0, 'Le relatif complément peut s’effacer.'],
            ['Dans « The man who called is my uncle », la relative…', ['Identifie de quel homme on parle', 'Ajoute une information accessoire', 'Exprime une cause', 'Exprime une condition'], 0, 'Relative déterminative : pas de virgule.'],
            ['Quel verbe exige un complément de personne ?', ['tell', 'say', 'think', 'hope'], 0, '*Tell me*, mais *say to me*.'],
            ['« Although » introduit…', ['Une concession', 'Une cause', 'Un but', 'Une condition'], 0, '*Although it was raining, we went out.*'],
            ['Après « until », on emploie le futur avec « will ».', ['Vrai', 'Faux'], 1, 'Comme après *when* et *if* : présent obligatoire.'],
            ['« So that » introduit…', ['Un but', 'Une conséquence datée', 'Une comparaison', 'Une opposition'], 0, '*He left early so that he could catch the train.*'],
          ],
        },
        {
          titre: 'Exprimer la temporalité et la durée',
          lecon: {
            titre: 'For, since, ago, during — chacun son rôle',
            cours: `Ces quatre mots se traduisent souvent par « depuis » ou « pendant » en français, ce qui explique l'ampleur des dégâts. Chacun a pourtant un emploi précis.

## FOR — une durée
Combien de temps : *for two hours*, *for six years*. Avec le present perfect, la durée court encore : *I've lived here for six years*.

## SINCE — un point de départ
Depuis quand : *since 2019*, *since Monday*, *since I was a child*. Il appelle presque toujours le **present perfect**.

## AGO — un point dans le passé
Compté à rebours depuis maintenant, il se place APRÈS la durée et exige le **prétérit** : *two years ago*, *I met her three days ago*.

## DURING et WHILE
*During* + **nom** (*during the meeting*) ; *while* + **proposition** (*while we were talking*). Les confondre est l'erreur la plus visible.

## Les autres repères
*By* = « d'ici, au plus tard » (*by Friday*) ; *until / till* = « jusqu'à » (*until Friday*) ; *in* + durée = « dans » (*in two weeks*) ; *within* = « d'ici moins de ». Et *It's been ages since…* pour la durée écoulée.`,
          },
          questions: [
            ['Lequel introduit un point de départ ?', ['since', 'for', 'ago', 'during'], 0, '*Since 2019*, *since Monday*.'],
            ['« I have lived here since six years » est correct.', ['Vrai', 'Faux'], 1, 'Une durée appelle *for* : *for six years*.'],
            ['« Ago » s’emploie avec…', ['Le prétérit', 'Le present perfect', 'Le présent', 'Le past perfect'], 0, '*I met her three days ago.*'],
            ['Quelle forme est correcte ?', ['During the meeting', 'During we were talking', 'While the meeting', 'While of the meeting'], 0, '*During* + nom, *while* + proposition.'],
            ['« By Friday » signifie « jusqu’à vendredi ».', ['Vrai', 'Faux'], 1, 'Cela signifie « d’ici vendredi, au plus tard » ; « jusqu’à » se dit *until*.'],
            ['« In two weeks » signifie…', ['Dans deux semaines', 'Il y a deux semaines', 'Pendant deux semaines', 'Depuis deux semaines'], 0, 'Pour « pendant », il faudrait *for*.'],
            ['« Since » va le plus souvent avec le present perfect.', ['Vrai', 'Faux'], 0, 'Il relie un point du passé au présent.'],
            ['Comment traduit-on « pendant la réunion » ?', ['During the meeting', 'While the meeting', 'For the meeting', 'Since the meeting'], 0, 'Un nom appelle *during*.'],
          ],
        },
        {
          titre: 'Exprimer la cause et le but',
          lecon: {
            titre: 'Because, since, so that, in order to',
            cours: `Répondre à « pourquoi ? », c'est soit remonter à la **cause**, soit avancer vers le **but**. L'anglais ne les construit pas de la même façon.

## La cause
**Because** + proposition (*because it was raining*) : c'est la cause neutre, la plus courante.
**Since / as** + proposition, quand la cause est déjà connue et placée souvent en tête : *As it was late, we left*.
**Because of / due to / owing to** + **nom** : *because of the rain*. La faute classique est *because of it was raining* — après *because of*, il faut un groupe nominal.
**Thanks to** pour une cause positive, *for* + -ING pour justifier (*He was fined for driving too fast*).

## Le but
**To + base verbale**, la forme la plus simple : *I came to help you*.
**In order to / so as to**, plus formel : *in order to avoid delays*. Au négatif : *so as not to be late*.
**So that + proposition** quand le sujet change : *He spoke slowly so that everyone could understand*. Le modal (*can, could, would*) y est presque toujours présent.

## Le piège du « pour »
Le français « pour » couvre les deux ; l'anglais tranche : *for* + nom (*for my sister*), *to* + verbe (*to help*). *For to help* n'existe pas.`,
          },
          questions: [
            ['Quelle forme est correcte ?', ['Because of the rain', 'Because of it was raining', 'Because the rain', 'Due to it rained'], 0, '*Because of* est suivi d’un groupe nominal.'],
            ['« I came for help you » est correct.', ['Vrai', 'Faux'], 1, 'Le but devant un verbe se dit *to help*, jamais *for to*.'],
            ['« So that » s’emploie surtout quand…', ['Le sujet du but est différent', 'Le sujet est le même', 'La cause est connue', 'On exprime une conséquence datée'], 0, '*He spoke slowly so that everyone could understand.*'],
            ['« As it was late, we left » exprime une cause.', ['Vrai', 'Faux'], 0, '*As* et *since* introduisent une cause souvent déjà connue.'],
            ['Comment dit-on « afin de ne pas être en retard » ?', ['So as not to be late', 'So as to not be late', 'For not being late', 'To not be late'], 0, 'La négation se place devant *to* dans cette structure.'],
            ['« Thanks to » introduit une cause négative.', ['Vrai', 'Faux'], 1, 'Il s’emploie pour une cause positive ; sinon *because of*, *owing to*.'],
            ['Après « because », on attend…', ['Une proposition avec sujet et verbe', 'Un groupe nominal', 'Un infinitif', 'Un gérondif'], 0, '*Because it was raining.*'],
            ['« In order to » est plus formel que « to » seul.', ['Vrai', 'Faux'], 0, 'Même sens, registre plus soutenu.'],
          ],
        },
        {
          titre: 'Exprimer la condition, la concession et l’opposition',
          lecon: {
            titre: 'If, unless, although, whereas',
            cours: `Trois relations proches à l'oreille, trois constructions à ne pas mélanger.

## La condition
**If** + présent → *will* (type 1) ; *if* + prétérit → *would* (type 2, irréel du présent) ; *if* + past perfect → *would have* (type 3, irréel du passé).
**Unless** = « à moins que, sauf si » : il contient déjà la négation, donc *unless you hurry* signifie « si tu ne te dépêches pas ». Ne jamais écrire *unless you don't*.
Autres : *as long as*, *provided that*, *in case* (au cas où, suivi du présent).

## La concession
Reconnaître un obstacle sans changer d'avis. **Although / even though / though** + proposition : *Although he was tired, he kept working*. **Despite / in spite of** + **nom ou -ING** : *despite the rain*, *in spite of being tired*. La faute la plus fréquente : *despite he was tired*.

## L'opposition
Elle met deux choses en regard, sans obstacle. **Whereas / while** : *He likes tea, whereas she prefers coffee*. **But**, **on the other hand**, **however** (avec un point-virgule ou en tête de phrase) : *However, the results are encouraging*.

## Le repère qui sauve
Conjonction (*although*, *whereas*) → proposition complète. Préposition (*despite*, *in spite of*) → nom ou -ING.`,
          },
          questions: [
            ['« Unless you hurry » signifie…', ['Si tu ne te dépêches pas', 'Si tu te dépêches', 'Bien que tu te dépêches', 'Pendant que tu te dépêches'], 0, '*Unless* contient déjà la négation.'],
            ['« Despite he was tired » est correct.', ['Vrai', 'Faux'], 1, '*Despite* est une préposition : *despite being tired* ou *although he was tired*.'],
            ['Quelle structure suit « in spite of » ?', ['Un nom ou un -ING', 'Une proposition complète', 'Un infinitif', 'Un modal'], 0, 'Comme *despite*.'],
            ['« Whereas » exprime…', ['Une opposition entre deux faits', 'Une condition', 'Une cause', 'Un but'], 0, '*He likes tea, whereas she prefers coffee.*'],
            ['« If I had money, I would travel » relève de l’irréel du présent.', ['Vrai', 'Faux'], 0, 'Type 2 : prétérit dans la subordonnée, *would* dans la principale.'],
            ['« Although » introduit une proposition complète.', ['Vrai', 'Faux'], 0, 'Avec sujet et verbe conjugué.'],
            ['« In case it rains » signifie…', ['Au cas où il pleuvrait', 'S’il pleut, alors', 'Bien qu’il pleuve', 'Puisqu’il pleut'], 0, 'La précaution prise par avance.'],
            ['« However » s’emploie pour…', ['Marquer une opposition entre deux phrases', 'Introduire une condition', 'Exprimer un but', 'Introduire une cause'], 0, 'Souvent en tête de phrase, suivi d’une virgule.'],
          ],
        },
        {
          titre: 'Exprimer l’habitude',
          lecon: {
            titre: 'Used to, would, be used to',
            cours: `Trois formes que le français réunit sous « avoir l'habitude » — et dont deux n'ont rien à voir l'une avec l'autre.

## USED TO + base verbale
Une habitude ou un état **passés et révolus**, qui n'ont plus cours : *I used to smoke* (je fumais autrefois, plus maintenant). Il implique toujours un contraste avec le présent. Négation et question : *I didn't use to…*, *Did you use to…?* (sans -d).

## WOULD + base verbale
Une habitude passée **répétée**, dans un récit ou un souvenir : *Every summer, we would go to the seaside*. Attention : *would* ne s'emploie que pour des ACTIONS répétées, jamais pour un état. *I would live in York* ne se dit pas ; il faut *I used to live in York*.

## BE USED TO + -ING
Rien à voir : ici *used* est un adjectif et *to* une préposition. Cela signifie « être habitué à », au présent comme au passé : *I'm used to getting up early*. La variante *get used to* marque l'apprentissage de l'habitude : *You'll get used to it*.

## L'habitude présente
Elle se rend simplement par le **présent simple** avec un adverbe de fréquence : *I usually walk to school*, *She often works late*.`,
          },
          questions: [
            ['« I used to smoke » signifie…', ['Je fumais autrefois, mais plus maintenant', 'J’ai l’habitude de fumer', 'Je me suis habitué à fumer', 'Je vais fumer'], 0, '*Used to* implique toujours une rupture avec le présent.'],
            ['« I’m used to getting up early » signifie…', ['J’ai l’habitude de me lever tôt', 'Je me levais tôt autrefois', 'Je vais me lever tôt', 'Je déteste me lever tôt'], 0, 'Ici *to* est une préposition, d’où le -ING.'],
            ['« I would live in York » est correct pour une habitude passée.', ['Vrai', 'Faux'], 1, '*Would* ne s’emploie pas pour un état : *I used to live in York*.'],
            ['La négation de « used to » est…', ['I didn’t use to', 'I didn’t used to', 'I usen’t to', 'I not used to'], 0, '*Did* porte le passé, donc *use* sans -d.'],
            ['« Every summer, we would go to the seaside » évoque une habitude passée répétée.', ['Vrai', 'Faux'], 0, 'Valeur fréquentative de *would* dans un récit.'],
            ['« Get used to » signifie…', ['S’habituer progressivement', 'Avoir toujours été habitué', 'Perdre une habitude', 'Refuser une habitude'], 0, '*You’ll get used to it.*'],
            ['L’habitude au présent se rend par…', ['Le présent simple + adverbe de fréquence', 'used to + base verbale', 'would + base verbale', 'be + -ing'], 0, '*I usually walk to school.*'],
            ['Après « be used to », on emploie la base verbale.', ['Vrai', 'Faux'], 1, 'On emploie la forme en -ING : *used to getting up*.'],
          ],
        },
        {
          titre: 'Faire faire quelque chose à quelqu’un',
          lecon: {
            titre: 'Make, have, get, let — la causation',
            cours: `Le français dit « faire faire » ; l'anglais choisit un verbe selon le **degré de contrainte**, et la construction change avec lui.

## MAKE + complément + base verbale
La contrainte : *She made me wait* (elle m'a fait attendre). Pas de *to*. Mais au **passif**, le *to* revient : *I was made to wait*.

## HAVE + complément + base verbale
On fait faire par quelqu'un dont c'est le rôle, sans contrainte : *I had the mechanic check the brakes*.

## GET + complément + TO + base verbale
On obtient, on persuade : *I got him to help me*. C'est le seul des quatre qui prend *to*.

## LET + complément + base verbale
La permission : *Let me explain*, *They let him go*. Au passif, on lui préfère *allow* : *He was allowed to go*.

## HAVE / GET something DONE
Structure essentielle : faire faire une chose **par un tiers**, l'important étant le résultat. *I had my hair cut* (je me suis fait couper les cheveux), *She got her car repaired*. La différence avec *I cut my hair* est totale : là, c'est moi qui coupe.`,
          },
          questions: [
            ['Quelle construction suit « make » à l’actif ?', ['make + complément + base verbale', 'make + complément + to + base verbale', 'make + -ing', 'make + participe passé'], 0, '*She made me wait.*'],
            ['« I was made to wait » est correct.', ['Vrai', 'Faux'], 0, 'Au passif, *make* retrouve le *to*.'],
            ['Lequel se construit avec « to » ?', ['get', 'make', 'have', 'let'], 0, '*I got him to help me.*'],
            ['« I had my hair cut » signifie…', ['Je me suis fait couper les cheveux', 'J’ai coupé mes cheveux moi-même', 'J’avais les cheveux coupés courts', 'Je voulais couper mes cheveux'], 0, 'La structure *have something done* désigne l’action d’un tiers.'],
            ['« Let » exprime la permission.', ['Vrai', 'Faux'], 0, '*Let me explain*, *they let him go*.'],
            ['Au passif, on remplace « let » par…', ['allow', 'make', 'have', 'get'], 0, '*He was allowed to go.*'],
            ['« She got her car repaired » signifie qu’elle a réparé la voiture elle-même.', ['Vrai', 'Faux'], 1, 'Elle l’a fait réparer : structure *get something done*.'],
            ['« I had the mechanic check the brakes » implique…', ['Une demande à quelqu’un dont c’est le métier', 'Une contrainte violente', 'Une permission accordée', 'Une interdiction'], 0, '*Have* + complément + base verbale, sans contrainte.'],
          ],
        },
        {
          titre: 'La voix passive',
          lecon: {
            titre: 'Be + participe passé',
            cours: `Le passif se forme avec **be** conjugué + **participe passé**. C'est *be* qui porte le temps : *is made*, *was made*, *has been made*, *will be made*, *is being made*.

## Pourquoi passiver
Parce que l'agent est inconnu, évident, ou sans intérêt : *My bike was stolen*. Parce qu'on veut mettre en avant le résultat plutôt que l'auteur. C'est pourquoi l'anglais l'emploie **beaucoup plus** que le français, notamment dans la presse et les textes scientifiques.

## L'agent
Introduit par **by**, il n'est exprimé que s'il apporte quelque chose : *The novel was written by Orwell*. Dans la majorité des passifs, il est simplement absent.

## Le double passif
Un verbe à deux compléments peut passiver les deux, et l'anglais préfère commencer par la personne : *They gave John a prize* → *John was given a prize* (plus naturel que *A prize was given to John*). Cette tournure n'a aucun équivalent direct en français, d'où sa difficulté.

## Les tournures impersonnelles
*It is said that…*, *He is said to be…*, *It is believed that…* : la presse en est pleine. *He is said to have left the country* = « il aurait quitté le pays ».`,
          },
          questions: [
            ['Comment se forme le passif ?', ['be + participe passé', 'have + participe passé', 'be + -ing', 'do + base verbale'], 0, '*The house was built in 1920.*'],
            ['Dans un passif, qu’est-ce qui porte le temps ?', ['L’auxiliaire be', 'Le participe passé', 'Le complément d’agent', 'Le sujet'], 0, '*Is made*, *was made*, *will be made*.'],
            ['Le complément d’agent est introduit par « by ».', ['Vrai', 'Faux'], 0, 'Et il est le plus souvent omis.'],
            ['« They gave John a prize » donne au passif, plus naturellement…', ['John was given a prize', 'A prize was given John', 'John gave was a prize', 'A prize gave John'], 0, 'L’anglais passive volontiers la personne.'],
            ['« He is said to have left the country » signifie…', ['Il aurait quitté le pays', 'Il a dit qu’il partait', 'On lui a dit de partir', 'Il doit quitter le pays'], 0, 'Tournure impersonnelle fréquente dans la presse.'],
            ['L’anglais emploie le passif moins souvent que le français.', ['Vrai', 'Faux'], 1, 'Il l’emploie beaucoup plus, surtout à l’écrit informatif.'],
            ['« My bike was stolen » n’exprime pas l’agent parce que…', ['Il est inconnu', 'Il est interdit de l’exprimer', 'Le verbe le refuse', 'La phrase est au présent'], 0, 'C’est le cas le plus courant du passif.'],
            ['« The house is being built » est un passif en cours.', ['Vrai', 'Faux'], 0, '*Be* + *being* + participe passé.'],
          ],
        },
        {
          titre: 'Le discours indirect',
          lecon: {
            titre: 'Rapporter des paroles',
            cours: `Rapporter, ce n'est pas citer : la phrase change de repères, donc de temps, de pronoms et de circonstanciels.

## Le recul des temps
Si le verbe introducteur est au passé, tout recule d'un cran :
présent → prétérit ; prétérit et present perfect → **past perfect** ; *will* → *would* ; *can* → *could* ; *must* → *had to*.
*« I am tired » → He said he was tired*. *« I have finished » → She said she had finished*.

## Les autres changements
Pronoms et possessifs s'ajustent au nouveau locuteur. Les repères de temps et de lieu se déplacent : *now → then*, *today → that day*, *yesterday → the day before*, *tomorrow → the next day*, *here → there*, *this → that*.

## Say ou tell
*Say* n'a pas de complément de personne (*He said that…*) ; *tell* en exige un (*He told me that…*). *He said me* est une faute lourde.

## Questions et ordres
La question indirecte perd l'inversion et l'auxiliaire *do* : *« Where does she live? » → He asked where she lived*. Sans mot interrogatif, on introduit par **if / whether** : *He asked if I was ready*.
L'ordre se rend par un infinitif : *« Sit down! » → He told me to sit down* ; au négatif : *He told me not to move*.`,
          },
          questions: [
            ['Au discours indirect passé, un présent devient…', ['Un prétérit', 'Un present perfect', 'Un past perfect', 'Un conditionnel'], 0, '*« I am tired » → He said he was tired.*'],
            ['« I have finished » devient au discours indirect…', ['He said he had finished', 'He said he has finished', 'He said he finished', 'He said he would finish'], 0, 'Le present perfect recule en past perfect.'],
            ['« He said me that… » est correct.', ['Vrai', 'Faux'], 1, '*Say* n’admet pas de complément de personne : *he told me*.'],
            ['Dans une question indirecte, on garde l’inversion sujet-auxiliaire.', ['Vrai', 'Faux'], 1, '*He asked where she lived*, sans *did* ni inversion.'],
            ['Sans mot interrogatif, la question indirecte s’introduit par…', ['if ou whether', 'that', 'what', 'so'], 0, '*He asked if I was ready.*'],
            ['« Tomorrow » devient au discours indirect passé…', ['the next day', 'that day', 'the day before', 'now'], 0, 'Les repères se déplacent avec le point de vue.'],
            ['Un ordre rapporté se rend par un infinitif.', ['Vrai', 'Faux'], 0, '*He told me to sit down*, *he told me not to move*.'],
            ['« Must » devient au discours indirect passé…', ['had to', 'musted', 'would must', 'could'], 0, '*Must* n’a pas de forme passée propre.'],
          ],
        },
      ],
    },
  ],
}
