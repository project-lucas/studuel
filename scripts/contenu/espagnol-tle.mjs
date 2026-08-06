// Espagnol TERMINALE — les 34 fiches du programme officiel, dans l'ordre des
// 4 chapitres : « La phrase » (4), « Le groupe nominal » (12), « Le groupe
// verbal » (12), « Les temps » (6).
//
// POURQUOI UN SECOND MODULE plutôt qu'un ajout dans `espagnol-lycee.mjs` :
// celui-ci part dans la migration 220, DÉJÀ EXÉCUTÉE, qui ne doit plus jamais
// être régénérée. Deux fichiers, même slug `espagnol` — d'où la génération par
// `--modules` et non par `--slugs` (cf. le README).
//
// PÉRIMÈTRE : la TERMINALE SEULE. Le programme transmis est celui de l'année du
// bac, et c'est là qu'il s'applique. La 2de et la 1re gardent donc les 3 fiches
// posées par la 220 — le ménage ci-dessous est borné à `level = 'Tle'`, sans
// quoi il les viderait aux deux tiers sans rien mettre à la place.
//
// Conséquence de taille : 34 fiches sur UN niveau font ~140 Ko de SQL, donc une
// seule migration. (Sur les trois niveaux du lycée, 102 chapitres auraient fait
// ~400 Ko — au-delà de ce que l'éditeur du dashboard avale d'un coup, et il
// aurait fallu couper en deux.)
//
// Convention de la maison : la langue s'interroge EN FRANÇAIS, comme le reste
// de l'app. L'espagnol est cité en exemple, jamais en énoncé.

export default {
  slug: 'espagnol',
  nom: 'Espagnol',

  titreMigration: 'ESPAGNOL Tle — LE PROGRAMME OFFICIEL',

  motif: `CONSTAT MESURÉ (sonde en lecture seule sur la base, 05/08/2026) :
l'espagnol du lycée n'avait que 3 chapitres, identiques en 2de, 1re et Tle,
taillés dans un découpage maison (« Les temps du passé », « Ser, estar et les
tournures essentielles », « Le monde hispanique aujourd'hui »). Un élève de
Terminale qui révisait la négation, l'enclise des pronoms, cuyo, l'apocope, le
subjonctif ou la concordance ne trouvait RIEN — alors que ce sont exactement
les points sur lesquels une copie se perd. Cette migration installe les 34
fiches du programme officiel, dans l'ordre de ses 4 chapitres (la phrase, le
groupe nominal, le groupe verbal, les temps), et retire les 2 fiches de
synthèse que ce découpage recouvre entièrement.

PÉRIMÈTRE : la TERMINALE SEULE — c'est le programme de l'année du bac. La 2de
et la 1re conservent telles quelles les 3 fiches de la 220 : le ménage est
borné au niveau Tle, sans quoi il les viderait aux deux tiers sans rien
mettre à la place. La fiche « Le monde hispanique aujourd'hui » est CONSERVÉE
côté Terminale aussi — elle porte les axes culturels du bac, qu'aucune fiche de
grammaire ne remplace — mais renvoyée en fin de liste.`,

  // ON NE SUPPRIME PAS PAR TITRE DE CHAPITRE mais par titre de LEÇON : c'est le
  // repère le plus sûr. Les deux chapitres visés, et eux seuls, portent les
  // leçons posées par 220 (« Pretérito, imperfecto, perfecto » et « Deux verbes
  // "être", et tout change ») — vérifié en base le 05/08/2026. Aucune fiche
  // neuve n'en porte : rejouer la migration ne supprime plus rien.
  //
  // Le filtre `level = 'Tle'` fait DEUX choses à la fois : il protège la 5e, la
  // 4e et la 3e (qui ont leur propre programme, 12 chapitres hérités de
  // 002/008), et il protège la 2de et la 1re, qui gardent les 3 fiches de la
  // 220 puisque rien ne vient les remplacer à ces niveaux.
  //
  // ⚠️ Si quelqu'un recolle un jour la migration 220, les deux chapitres
  // reviennent. C'est le prix de l'idempotence : 220 ne peut pas être modifiée.
  menage: [
    {
      raison: `La file « À revoir » d'abord : review_items.item_id n'a PAS de clé
étrangère (il pointe soit une question, soit une carte). Rien ne casse si on
l'oublie — le lecteur écarte déjà un contenu disparu — mais le compteur
« X à revoir » continuerait de compter des questions qui n'existent plus.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'espagnol'
   AND c.level = 'Tle'
   AND l.title IN ('Pretérito, imperfecto, perfecto',
                   'Deux verbes « être », et tout change');`,
    },
    {
      raison: `Les quiz ensuite : quizzes.lesson_id est ON DELETE SET NULL, donc
supprimer le chapitre laisserait derrière lui des quiz orphelins, rattachés à
aucune leçon mais toujours servis par le moteur de révision.`,
      sql: `DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'espagnol'
   AND c.level = 'Tle'
   AND l.title IN ('Pretérito, imperfecto, perfecto',
                   'Deux verbes « être », et tout change');`,
    },
    {
      raison: `Puis les chapitres : leçons, fiches de révision, supports, progression
et chapitres cochés partent en cascade (toutes les clés étrangères vers
chapters et lessons sont ON DELETE CASCADE).`,
      sql: `DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'espagnol'
   AND c.level = 'Tle'
   AND EXISTS (
     SELECT 1 FROM public.lessons l
      WHERE l.chapter_id = c.id
        AND l.title IN ('Pretérito, imperfecto, perfecto',
                        'Deux verbes « être », et tout change')
   );`,
    },
    {
      raison: `Enfin la fiche culturelle SURVIVANTE passe en fin de liste, en
Terminale seulement. Elle reste utile (les axes du bac ne sont pas de la
grammaire), mais elle occupe la position 3, en plein milieu des 34 fiches
neuves. Un INSERT ne peut pas renuméroter une ligne déjà en base : c'est un
UPDATE, ici, ou rien. Idempotent (rejouer réécrit la même valeur). En 2de et en
1re, elle ne bouge pas — rien ne vient s'intercaler devant elle.`,
      sql: `UPDATE public.chapters c
   SET position = 90
  FROM public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'espagnol'
   AND c.level = 'Tle'
   AND c.title = 'Le monde hispanique aujourd’hui';`,
    },
  ],

  blocs: [
    {
      niveaux: ['Tle'],
      chapitres: [
        // ---- Chapitre 1 du programme : La phrase -----------------------------
        {
          titre: 'Les questions',
          lecon: {
            titre: 'Interroger en espagnol',
            cours: `L'espagnol pose ses questions autrement que le français : pas d'inversion obligatoire, pas de « est-ce que », mais deux signes et des accents qui ne sont jamais facultatifs.

## Les deux points d'interrogation
Toute question s'ouvre par **¿** et se ferme par **?** : *¿Cómo te llamas?* Le signe ouvrant ne se met pas forcément en début de phrase, mais au début de la **partie interrogée** : *Si no vienes, ¿qué hago?* L'oublier est une faute comptée.

## L'interrogation totale
Celle à laquelle on répond par oui ou non. Aucun outil particulier : l'ordre des mots peut rester celui de la phrase déclarative, seule l'intonation (et les signes à l'écrit) change. *¿Tú hablas español?* ou *¿Hablas español?* On peut aussi placer le sujet après le verbe : *¿Viene Juan mañana?*

## Les mots interrogatifs
Ils portent **tous** un accent écrit : *qué, quién, quiénes, cuál, cuáles, cómo, cuándo, dónde, adónde, cuánto, cuánta, cuántos, cuántas, por qué*. Cet accent est ce qui distingue le mot interrogatif du relatif : *¿Dónde vives?* contre *La casa donde vivo*.

## Qué ou cuál
- **qué** demande la nature, la définition : *¿Qué es esto?*, *¿Qué libro quieres?*
- **cuál/cuáles** demande un **choix** dans un ensemble : *¿Cuál prefieres?*, *¿Cuál es tu color favorito?*

> Devant un nom, l'espagnol préfère presque toujours *qué* : on dit *¿Qué día es hoy?*, pas *¿Cuál día?*

## Les quatre « porque »
- **por qué** (deux mots, accent) : la question — *¿Por qué lloras?*
- **porque** (un mot, sans accent) : la réponse — *Porque estoy triste.*
- **el porqué** (nom masculin) : la raison — *No entiendo el porqué.*
- **por que** : rare, préposition + relatif.

## L'interrogation indirecte
Elle garde l'accent du mot interrogatif, mais perd les signes ¿ ? : *No sé **dónde** está*, *Pregunta **cuánto** cuesta*. C'est l'erreur classique : l'accent reste, même sans point d'interrogation.`,
          },
          questions: [
            ['Comment s’écrit une question en espagnol ?', ['Avec un ¿ à l’ouverture et un ? à la fermeture', 'Avec un seul ? final', 'Avec un ¿ seulement', 'Avec « est-ce que » puis un ?'], 0, 'Le ¿ se place au début de la partie interrogée, pas forcément de la phrase.'],
            ['Les mots interrogatifs espagnols portent tous un accent écrit.', ['Vrai', 'Faux'], 0, 'C’est lui qui distingue *dónde* (interrogatif) de *donde* (relatif).'],
            ['Que demande « cuál » plutôt que « qué » ?', ['Un choix dans un ensemble', 'Une définition', 'Une cause', 'Une quantité'], 0, '*¿Cuál prefieres?* suppose plusieurs possibilités déjà connues.'],
            ['Comment traduire « Pourquoi pleures-tu ? » ?', ['¿Por qué lloras?', '¿Porque lloras?', '¿Porqué lloras?', '¿Por que lloras?'], 0, 'En deux mots et avec l’accent : c’est la question, pas la réponse.'],
            ['« El porqué » est un nom masculin qui signifie « la raison ».', ['Vrai', 'Faux'], 0, '*No entiendo el porqué de su decisión.*'],
            ['Dans « No sé dónde está », l’accent sur « dónde »…', ['Se maintient malgré l’absence de point d’interrogation', 'Disparaît', 'Devient facultatif', 'Se déplace'], 0, 'C’est une interrogation indirecte : l’accent reste, les signes ¿ ? partent.'],
            ['L’espagnol exige l’inversion du sujet dans toute question.', ['Vrai', 'Faux'], 1, '*¿Tú hablas español?* est parfaitement correct : l’intonation suffit.'],
            ['Devant un nom, l’espagnol préfère…', ['Qué (¿Qué día es hoy?)', 'Cuál (¿Cuál día es hoy?)', 'Quién', 'Cuánto'], 0, '*¿Cuál día?* est un calque du français à éviter.'],
          ],
        },
        {
          titre: 'La négation',
          lecon: {
            titre: 'No, et la double négation',
            cours: `La négation espagnole est plus simple que la française — un seul mot au lieu de « ne… pas » — mais elle a une règle que le français ne connaît pas : la **double négation** est obligatoire.

## Le no
Il se place **juste devant le verbe**, et rien ne s'intercale sauf les pronoms compléments : *No hablo español*, *No **te lo** digo.*

## La double négation
Quand un mot négatif (*nada, nadie, nunca, jamás, ninguno, tampoco, ni*) suit le verbe, le **no est obligatoire** devant lui : *No veo **nada***, *No viene **nadie***, *No lo hago **nunca***.

> Deux négations ne s'annulent pas en espagnol : elles se renforcent. C'est le contraire de la logique mathématique — et c'est la règle.

## Le mot négatif avant le verbe
S'il passe devant, le *no* **disparaît** : *Nadie viene*, *Nunca lo hago*, *Tampoco me gusta*. Les deux tournures sont correctes et équivalentes : *No viene nadie* = *Nadie viene*.

## Les mots à connaître
- *nada* (rien), *nadie* (personne), *ninguno/a* (aucun — apocopé en *ningún* devant un masculin singulier)
- *nunca / jamás* (jamais), *tampoco* (non plus), *ni… ni* (ni… ni)
- *ya no* (ne… plus), *todavía no / aún no* (pas encore)

## Sino ou pero
Après une négation, pour **rectifier**, on emploie *sino* et non *pero* : *No es francés **sino** español*. Devant un verbe conjugué : *sino que* — *No canta **sino que** grita*. On garde *pero* quand il s'agit d'opposer sans rectifier : *No es rico **pero** es feliz.*`,
          },
          questions: [
            ['Où se place « no » dans la phrase ?', ['Juste devant le verbe', 'À la fin de la phrase', 'Après le verbe', 'Devant le sujet'], 0, 'Seuls les pronoms compléments peuvent s’intercaler : *No te lo digo.*'],
            ['Comment traduire « je ne vois rien » ?', ['No veo nada', 'Veo nada', 'No veo', 'Nada veo no'], 0, 'La double négation est obligatoire quand le mot négatif suit le verbe.'],
            ['« Nadie viene » est incorrect : il manque le « no ».', ['Vrai', 'Faux'], 1, 'Quand le mot négatif précède le verbe, le *no* disparaît.'],
            ['Que signifie « tampoco » ?', ['Non plus', 'Encore', 'Déjà', 'Jamais'], 0, '*A mí tampoco me gusta* : à moi non plus.'],
            ['Comment dit-on « ne… plus » ?', ['Ya no', 'Todavía no', 'Nunca', 'Ni'], 0, '*Ya no fumo* : je ne fume plus. *Todavía no* signifie « pas encore ».'],
            ['Après une négation, pour rectifier, on emploie…', ['Sino', 'Pero', 'Porque', 'Aunque'], 0, '*No es francés sino español.* *Pero* oppose sans rectifier.'],
            ['« Ninguno » s’apocope en « ningún » devant un masculin singulier.', ['Vrai', 'Faux'], 0, '*Ningún libro*, mais *ninguna casa* et *ninguno de ellos*.'],
            ['Devant un verbe conjugué, « sino » devient…', ['Sino que', 'Sino de', 'Sino a', 'Sino el'], 0, '*No canta sino que grita.*'],
          ],
        },
        {
          titre: 'La proposition subordonnée relative',
          lecon: {
            titre: 'Deux relatives, deux virgules, deux modes',
            cours: `Une relative complète un nom. En espagnol, ce qui compte n'est pas seulement le pronom choisi mais **le type de relative** — car il commande la ponctuation et parfois le mode du verbe.

## La relative déterminative
Elle **restreint** le sens de l'antécédent : sans elle, la phrase ne désigne plus la même chose. Elle s'écrit **sans virgule** : *Los alumnos **que estudian** aprueban* (seuls ceux-là).

## La relative explicative
Elle **ajoute** une information dont on pourrait se passer. Elle est **encadrée de virgules** : *Los alumnos, **que estudian**, aprueban* (tous les élèves, et au passage ils travaillent). Changer la virgule change le sens de la phrase : ce n'est pas un détail typographique.

> Après une virgule, *quien/quienes* est possible pour une personne : *Mi hermano, **quien** vive en Madrid, es médico.* Dans une déterminative, on emploie *que*.

## Le mode dans la relative
Voilà le point que le français ne prépare pas. Si l'antécédent est **connu, réel**, le verbe est à l'**indicatif** ; s'il est **indéfini, hypothétique, encore à trouver**, il passe au **subjonctif** :
- *Busco a la secretaria que **habla** inglés* (elle existe, je la connais)
- *Busco una secretaria que **hable** inglés* (n'importe laquelle, si elle existe)

Même chose après une négation : *No conozco a nadie que **sepa** ruso.*

## La préposition ne se déplace pas
L'espagnol ne rejette jamais la préposition à la fin : elle précède toujours le relatif. *La casa **en la que** vivo*, jamais « la casa que vivo en ».

## L'antécédent implicite
Sans antécédent exprimé, on emploie *el que, la que, los que, las que, quien* : *El que quiera, que venga* (celui qui veut). Pour renvoyer à une idée entière, on emploie *lo que* : *Llegó tarde, **lo que** me molestó.*`,
          },
          questions: [
            ['Quelle relative s’écrit entre virgules ?', ['L’explicative', 'La déterminative', 'Les deux', 'Aucune'], 0, 'L’explicative ajoute une information supprimable.'],
            ['« Busco una secretaria que hable inglés » emploie le subjonctif parce que…', ['L’antécédent est indéfini : elle reste à trouver', 'L’antécédent est connu', 'La relative est explicative', 'Le verbe est irrégulier'], 0, 'Avec un antécédent réel, l’indicatif : *que habla inglés*.'],
            ['La virgule d’une relative ne change pas le sens de la phrase.', ['Vrai', 'Faux'], 1, '*Los alumnos que estudian* ne désigne pas les mêmes élèves que *los alumnos, que estudian*.'],
            ['Comment traduire « la maison dans laquelle je vis » ?', ['La casa en la que vivo', 'La casa que vivo en', 'La casa vivo en que', 'La casa en vivo que'], 0, 'La préposition précède toujours le relatif en espagnol.'],
            ['Après « No conozco a nadie que… », le verbe est…', ['Au subjonctif', 'À l’indicatif', 'À l’infinitif', 'Au gérondif'], 0, 'La négation rend l’antécédent inexistant, donc indéfini.'],
            ['Pour renvoyer à une idée entière, on emploie…', ['Lo que', 'El que', 'Quien', 'Cuyo'], 0, '*Llegó tarde, lo que me molestó.*'],
            ['Dans une relative déterminative, on emploie normalement « que ».', ['Vrai', 'Faux'], 0, '*Quien* est réservé aux explicatives et aux emplois avec préposition.'],
            ['« El que quiera, que venga » se traduit par…', ['Que celui qui veut vienne', 'Ce qu’il veut, qu’il vienne', 'Celui qu’il veut vient', 'Il veut qu’il vienne'], 0, 'Relatif sans antécédent exprimé, suivi du subjonctif.'],
          ],
        },
        {
          titre: 'La proposition subordonnée complétive',
          lecon: {
            titre: 'Que + indicatif ou que + subjonctif',
            cours: `La complétive est la subordonnée introduite par *que* qui complète le verbe principal. Tout se joue sur une seule question : **indicatif ou subjonctif ?**

## L'indicatif : ce qui est présenté comme un fait
Après les verbes de **déclaration**, de **perception**, d'**opinion** et de **certitude** à la forme affirmative : *Digo que **viene***, *Veo que **está** cansado*, *Creo que **tiene** razón*, *Es verdad que **llueve**.*

## Le subjonctif : ce qui est voulu, senti, mis en doute
- **volonté, ordre, souhait** : *Quiero que **vengas***, *Te pido que **esperes***, *Ojalá **llueva*** ;
- **sentiment** : *Me alegro de que **estés** aquí*, *Siento que **te vayas*** ;
- **doute, négation d'une certitude** : *Dudo que **sea** verdad*, *No creo que **venga*** ;
- **jugement impersonnel** : *Es necesario que **estudies***, *Es posible que **llegue** tarde.*

> La bascule la plus rentable au bac : *creo que viene* (indicatif) mais *no creo que **venga*** (subjonctif). Nier la certitude fait changer de mode.

## L'infinitif quand le sujet ne change pas
Si les deux verbes ont le **même sujet**, l'espagnol emploie l'infinitif, sans *que* : *Quiero **venir*** (je veux venir) contre *Quiero que **vengas*** (je veux que tu viennes). Le français dit « je veux venir » aussi : c'est l'un des rares points où les deux langues s'accordent.

## Le que ne se supprime pas
Là où le français peut l'alléger, l'espagnol garde *que* : *Espero **que** me llames.*

## Le décalage au passé
Quand le verbe principal est au passé, le subjonctif présent devient **imparfait du subjonctif** : *Quiero que vengas* → *Quería que **vinieras** (ou **vinieses**)*. Les deux formes, en *-ra* et en *-se*, sont équivalentes.`,
          },
          questions: [
            ['Après « Quiero que… », le verbe est…', ['Au subjonctif', 'À l’indicatif', 'À l’infinitif', 'Au conditionnel'], 0, 'La volonté commande le subjonctif : *Quiero que vengas.*'],
            ['« Creo que viene » et « No creo que venga » emploient le même mode.', ['Vrai', 'Faux'], 1, 'Nier la certitude fait passer l’indicatif au subjonctif.'],
            ['Comment dit-on « je veux venir » (même sujet) ?', ['Quiero venir', 'Quiero que venga', 'Quiero que vengo', 'Quiero de venir'], 0, 'Même sujet : infinitif, sans *que*.'],
            ['Après « Es necesario que… », on emploie…', ['Le subjonctif', 'L’indicatif', 'Le gérondif', 'Le participe'], 0, 'Le jugement impersonnel commande le subjonctif : *que estudies*.'],
            ['« Ojalá » est toujours suivi du subjonctif.', ['Vrai', 'Faux'], 0, '*Ojalá llueva* : c’est l’expression du souhait par excellence.'],
            ['Quand le verbe principal est au passé, le subjonctif présent devient…', ['L’imparfait du subjonctif', 'Le passé simple', 'Le conditionnel', 'Le futur'], 0, '*Quería que vinieras* — les formes en -ra et en -se sont équivalentes.'],
            ['Après « Dudo que… », on emploie l’indicatif.', ['Vrai', 'Faux'], 1, 'Le doute appelle le subjonctif : *Dudo que sea verdad.*'],
            ['Le « que » de la complétive peut être supprimé en espagnol.', ['Vrai', 'Faux'], 1, 'Il se maintient toujours : *Espero que me llames.*'],
          ],
        },

        // ---- Chapitre 2 du programme : Le groupe nominal ---------------------
        {
          titre: 'Genre et nombre',
          lecon: {
            titre: 'Le genre des noms et la formation du pluriel',
            cours: `Le genre espagnol ne recopie pas le genre français : *la sangre* est féminin, *el color* masculin, et se fier au français coûte cher à l'écrit comme à l'oral.

## Les repères de genre
- **masculins** : noms en *-o* (*el libro*), en *-or* (*el amor*), *-aje* (*el viaje*), *-ma* d'origine grecque (*el problema, el tema, el idioma, el sistema, el clima*) ;
- **féminins** : noms en *-a* (*la casa*), et surtout les suffixes *-ción, -sión, -dad, -tad, -tud, -umbre, -ez* (*la canción, la ciudad, la libertad, la juventud, la costumbre, la vejez*).

## Les pièges du francophone
*La sangre* (le sang), *la leche* (le lait), *la sal* (le sel), *la nariz* (le nez), *la miel*, *la costumbre* ; et à l'inverse *el color*, *el árbol*, *el viaje*, *el análisis*, *el minuto*, *el puente*. Aucune règle : il faut les apprendre avec leur article.

## Le féminin des noms de personnes
*-o* → *-a* (*el niño / la niña*) ; les noms en *-or*, *-ón*, *-és* ajoutent un *-a* (*profesor / profesora*, *francés / francesa*). Certains sont invariables et seul l'article change : *el/la estudiante*, *el/la periodista*, *el/la artista*.

## Le pluriel
- voyelle non accentuée + **-s** : *casa → casas* ;
- consonne ou voyelle accentuée + **-es** : *papel → papeles*, *rubí → rubíes* ;
- *-z* → **-ces** : *lápiz → lápices*, *vez → veces* ;
- mots en *-s* non accentués sur la dernière syllabe : **invariables** — *el lunes / los lunes*, *la crisis / las crisis*.

> L'accent écrit suit la prononciation, pas l'orthographe : *el examen → los **exámenes*** (l'accent apparaît), *la canción → las **canciones*** (il disparaît).`,
          },
          questions: [
            ['Quel est le genre de « la sangre » ?', ['Féminin', 'Masculin', 'Neutre', 'Les deux'], 0, 'Piège classique : le français dit « le sang ».'],
            ['Les noms en « -ción » et « -dad » sont féminins.', ['Vrai', 'Faux'], 0, '*La canción*, *la ciudad*, *la libertad*.'],
            ['Quel est le genre de « el problema » ?', ['Masculin, malgré le -a final', 'Féminin', 'Variable', 'Neutre'], 0, 'Comme *el tema*, *el idioma*, *el sistema* : origine grecque.'],
            ['Quel est le pluriel de « lápiz » ?', ['Lápices', 'Lápizs', 'Lápizes', 'Lápiz'], 0, 'Le -z devient -c devant -es.'],
            ['« El lunes » au pluriel devient « los lunes ».', ['Vrai', 'Faux'], 0, 'Les mots en -s non accentués sur la dernière syllabe sont invariables.'],
            ['Quel est le pluriel de « el examen » ?', ['Los exámenes', 'Los examenes', 'Los exámens', 'Los examen'], 0, 'L’accent écrit apparaît pour conserver la même syllabe tonique.'],
            ['« El color » est masculin en espagnol.', ['Vrai', 'Faux'], 0, 'Alors que le français hésite : la couleur est féminine.'],
            ['Comment se forme le pluriel après une consonne ?', ['On ajoute -es', 'On ajoute -s', 'On ne change rien', 'On double la consonne'], 0, '*Papel → papeles*, *ciudad → ciudades*.'],
          ],
        },
        {
          titre: 'Les articles',
          lecon: {
            titre: 'El, un, lo : trois séries, dont une que le français n’a pas',
            cours: `L'espagnol a un article de plus que le français : le **neutre** *lo*. Et son article défini réserve une surprise devant certains noms féminins.

## Les formes
- **défini** : *el, la, los, las*
- **indéfini** : *un, una, unos, unas* — au pluriel, *unos/unas* signifie « quelques » : *unos amigos.*

## Les contractions
Deux, et deux seulement : **a + el = al**, **de + el = del**. *Voy **al** cine*, *La casa **del** profesor*. Elles ne se font pas devant un nom propre : *Voy a El Escorial.*

## El devant un féminin
Un nom féminin **singulier** qui commence par un *a-* ou *ha-* **tonique** prend *el* : *el agua, el águila, el hambre, el aula, el alma*. Le nom reste féminin — *el agua **fría*** — et le pluriel reprend *las* : *las aguas*. Avec *una*, on emploie *un* pour la même raison : *un águila.*

> Attention : *la avenida*, *la harina* — l'accent tonique n'y est pas sur le *a*, donc la règle ne s'applique pas.

## Le neutre lo
Il ne précède jamais un nom, mais un **adjectif**, un **adverbe** ou un relatif, pour désigner une qualité abstraite :
- *lo importante* (ce qui est important), *lo mejor* (le mieux), *lo difícil* ;
- *lo que* (ce que) : *No entiendo **lo que** dices* ;
- *lo + adjectif + que* pour l'intensité : *No sabes **lo cansado que** estoy.*

## Quand l'article disparaît
Devant un nom de **profession, nationalité ou religion** attribut : *Es **profesor***, *Soy **española***. On le remet s'il y a un qualificatif : *Es **un** profesor excelente.* Autre cas : *otro* ne prend jamais d'article indéfini — *otro día*, jamais « un otro día ».`,
          },
          questions: [
            ['Quelles sont les deux contractions de l’espagnol ?', ['Al et del', 'Al, del et col', 'Del seulement', 'Al, del, pel'], 0, '*a + el = al*, *de + el = del*.'],
            ['Pourquoi dit-on « el agua » ?', ['Le nom féminin commence par un a- tonique', 'Le nom est masculin', 'C’est une exception isolée', 'L’article est neutre'], 0, 'Le mot reste féminin : *el agua fría*, *las aguas*.'],
            ['« El agua » devient « los aguas » au pluriel.', ['Vrai', 'Faux'], 1, 'Le pluriel reprend l’article féminin : *las aguas*.'],
            ['Que précède l’article neutre « lo » ?', ['Un adjectif, un adverbe ou un relatif', 'Un nom masculin', 'Un nom féminin', 'Un verbe'], 0, '*Lo importante*, *lo mejor*, *lo que dices*.'],
            ['Comment dit-on « je suis professeur » ?', ['Soy profesor', 'Soy un profesor', 'Estoy profesor', 'Soy el profesor'], 0, 'Pas d’article devant une profession attribut, sauf si elle est qualifiée.'],
            ['« Unos amigos » signifie « quelques amis ».', ['Vrai', 'Faux'], 0, 'Le pluriel de l’indéfini exprime l’approximation.'],
            ['Comment traduire « un autre jour » ?', ['Otro día', 'Un otro día', 'El otro día', 'Uno otro día'], 0, '*Otro* ne prend jamais l’article indéfini.'],
            ['« La avenida » ne prend pas « el » parce que…', ['L’accent tonique ne tombe pas sur le a initial', 'Le mot est masculin', 'Le mot est pluriel', 'Le mot est étranger'], 0, 'La règle ne vaut que pour un a- ou ha- TONIQUE.'],
          ],
        },
        {
          titre: 'Les démonstratifs',
          lecon: {
            titre: 'Este, ese, aquel : trois distances',
            cours: `Là où le français n'a qu'un démonstratif (*ce… -ci / -là*), l'espagnol en a **trois**, calés sur trois distances — dans l'espace, dans le temps, ou dans le discours.

## Les trois séries
- **près de moi** : *este, esta, estos, estas* — l'adverbe qui va avec est *aquí* ;
- **près de toi** : *ese, esa, esos, esas* — *ahí* ;
- **loin de nous deux** : *aquel, aquella, aquellos, aquellas* — *allí*.

Une seule irrégularité à retenir : le masculin singulier de la troisième série est *aquel*, sans *-o*.

## La distance n'est pas seulement spatiale
- **temps** : *este año* (cette année-ci), *ese año* (cette année-là, proche), *aquellos tiempos* (ces temps lointains) ;
- **discours** : *este* renvoie à ce qu'on vient de dire ou à ce qui suit, *aquel* à ce qui est le plus éloigné dans le texte.

## Adjectif ou pronom, même forme
*Este libro es mío* (adjectif) / *Este es mío* (pronom). Depuis la réforme de la RAE (2010), le pronom **ne prend plus d'accent écrit** : on écrit *este*, *ese*, *aquel*, comme l'adjectif. Beaucoup de manuels anciens écrivent encore *éste* — ce n'est plus la norme, mais ce n'est pas compté faux.

## Les neutres
*esto, eso, aquello* : **invariables**, **sans accent**, et jamais suivis d'un nom. Ils renvoient à une chose non identifiée ou à une **idée entière** :
- *¿Qué es **esto**?* (qu'est-ce que c'est ?)
- ***Eso** no es verdad.* (ça, ce n'est pas vrai)
- *Todo **aquello** me pareció extraño.*

> Une phrase entière ne se reprend jamais par *este* ou *ese*, toujours par un neutre : *No vino, y **eso** me molestó.*

## Deux tournures utiles
*en aquel entonces* (à cette époque-là), *ni esto ni aquello* (ni l'un ni l'autre).`,
          },
          questions: [
            ['Combien l’espagnol a-t-il de séries de démonstratifs ?', ['Trois : este, ese, aquel', 'Deux : este et ese', 'Une seule', 'Quatre'], 0, 'Elles correspondent à *aquí*, *ahí*, *allí*.'],
            ['Quel démonstratif désigne ce qui est près de l’interlocuteur ?', ['Ese', 'Este', 'Aquel', 'Esto'], 0, '*Ese libro que tienes en la mano.*'],
            ['Les démonstratifs neutres « esto, eso, aquello » sont invariables.', ['Vrai', 'Faux'], 0, 'Et ils ne sont jamais suivis d’un nom.'],
            ['Comment reprendre une phrase entière ?', ['Par un neutre : eso', 'Par ese', 'Par esta', 'Par aquellos'], 0, '*No vino, y eso me molestó.*'],
            ['Depuis 2010, le pronom démonstratif porte un accent écrit.', ['Vrai', 'Faux'], 1, 'La RAE l’a supprimé : on écrit *este* pronom comme *este* adjectif.'],
            ['« Aquellos tiempos » évoque…', ['Une époque lointaine', 'L’instant présent', 'Le futur proche', 'La semaine dernière'], 0, '*Aquel* marque la plus grande distance, y compris temporelle.'],
            ['Comment traduire « qu’est-ce que c’est ? » ?', ['¿Qué es esto?', '¿Qué es este?', '¿Qué es ésta?', '¿Qué es aquel?'], 0, 'La chose n’étant pas identifiée, on emploie le neutre.'],
            ['« Esta » et « estas » sont les formes féminines de « este ».', ['Vrai', 'Faux'], 0, 'Masculin : *este / estos* ; féminin : *esta / estas*.'],
          ],
        },
        {
          titre: 'Les adjectifs',
          lecon: {
            titre: 'Accord, place, et le sens qui change de place',
            cours: `L'adjectif espagnol s'accorde comme en français, mais sa **place** obéit à une logique que le français ne connaît pas — et qui peut changer le sens du mot.

## L'accord
En genre et en nombre avec le nom. Deux familles :
- adjectifs en **-o** : quatre formes — *alto, alta, altos, altas* ;
- adjectifs en **-e** ou en **consonne** : invariables en genre — *un chico inteligente / una chica inteligente*, *un examen fácil / una prueba fácil*.

**Exceptions** : les adjectifs de nationalité et ceux en *-or, -ón, -ín* forment un féminin — *español/española*, *inglés/inglesa*, *trabajador/trabajadora*, *hablador/habladora*.

## Avec plusieurs noms
Si l'un des noms est masculin, l'adjectif se met au **masculin pluriel** : *un chico y una chica **simpáticos***.

## La place : après le nom par défaut
C'est la position normale, celle qui **classe**, qui distingue objectivement : *un coche **rojo***, *la lengua **española***, *un problema **difícil***. Les adjectifs de couleur, de forme, de nationalité, de religion y restent toujours.

## Devant le nom : le regard de celui qui parle
Placé avant, l'adjectif exprime une appréciation, une qualité **connue ou attendue**, un effet de style : *la **blanca** nieve*, *un **buen** amigo*, *mi **querida** madre*.

> Ce n'est pas une nuance décorative : certains adjectifs **changent de sens** selon la place.

## Les changements de sens à connaître
- *un **gran** hombre* (un grand homme) / *un hombre **grande*** (un homme de grande taille)
- *un **pobre** hombre* (un homme à plaindre) / *un hombre **pobre*** (sans argent)
- *un **viejo** amigo* (un ami de longue date) / *un amigo **viejo*** (un ami âgé)
- *diferentes libros* (plusieurs) / *libros diferentes* (dissemblables)
- *un **cierto** encanto* (un certain) / *un hecho **cierto*** (avéré)

## L'apocope
Certains adjectifs perdent leur finale devant le nom : *bueno → **buen** día*, *malo → **mal** tiempo*, *grande → **gran** casa*. C'est l'objet d'une fiche à part.`,
          },
          questions: [
            ['Où se place l’adjectif espagnol par défaut ?', ['Après le nom', 'Avant le nom', 'En fin de phrase', 'Avant le verbe'], 0, 'C’est la position qui classe objectivement : *un coche rojo*.'],
            ['« Un gran hombre » et « un hombre grande » ont le même sens.', ['Vrai', 'Faux'], 1, 'Le premier est un grand homme, le second un homme de grande taille.'],
            ['Quel adjectif a quatre formes ?', ['Alto (alto, alta, altos, altas)', 'Inteligente', 'Fácil', 'Verde'], 0, 'Les adjectifs en -e ou en consonne sont invariables en genre.'],
            ['« Un chico y una chica simpáticos » est correct.', ['Vrai', 'Faux'], 0, 'Avec des noms de genres différents, l’adjectif se met au masculin pluriel.'],
            ['Que signifie « un pobre hombre » ?', ['Un homme à plaindre', 'Un homme sans argent', 'Un homme humble', 'Un homme malade'], 0, 'Placé après, *un hombre pobre* désigne la pauvreté matérielle.'],
            ['Les adjectifs de nationalité forment un féminin.', ['Vrai', 'Faux'], 0, '*Español/española*, *inglés/inglesa*, même s’ils finissent par une consonne.'],
            ['« Un viejo amigo » signifie…', ['Un ami de longue date', 'Un ami âgé', 'Un ancien ami fâché', 'Un ami d’enfance uniquement'], 0, 'La place avant le nom porte l’appréciation, pas l’âge.'],
            ['Un adjectif placé avant le nom exprime souvent une appréciation.', ['Vrai', 'Faux'], 0, '*La blanca nieve*, *un buen amigo* : le regard de celui qui parle.'],
          ],
        },
        {
          titre: 'Les pronoms personnels sujets',
          lecon: {
            titre: 'Yo, tú, usted : et pourquoi on les omet',
            cours: `L'espagnol exprime rarement le pronom sujet : la terminaison du verbe suffit à identifier la personne. L'employer sans raison sonne lourd, voire insistant.

## Les formes
*yo, tú, él / ella / usted, nosotros / nosotras, vosotros / vosotras, ellos / ellas / ustedes.*

## Pourquoi on les omet
*Hablo* dit déjà « je parle » : ajouter *yo* n'apporte rien. On n'exprime le pronom que pour :
- **insister** : ***Yo** no lo he dicho* (moi, je ne l'ai pas dit) ;
- **opposer** : ***Tú** trabajas y **él** duerme* ;
- **lever une ambiguïté** : à la 3e personne, *hablaba* peut être *yo*, *él*, *ella* ou *usted*.

## Le vouvoiement
*Usted* (abrégé *Ud.*) et *ustedes* (*Uds.*) sont les formes de politesse — mais ils se conjuguent à la **3e personne** : *¿Usted **habla** español?*, *¿Ustedes **quieren** café?* C'est l'erreur la plus fréquente du francophone, qui les traite comme un « vous » de 2e personne.

> *Usted* vient de *vuestra merced* (« votre grâce ») : d'où la 3e personne, comme un « Monsieur souhaite-t-il… ? ».

## Les variantes du monde hispanophone
- En **Amérique latine**, *vosotros* n'existe pas : le pluriel familier est *ustedes*, même entre amis.
- En **Argentine, Uruguay, Paraguay, Amérique centrale**, *tú* cède la place à ***vos*** (le *voseo*), avec ses propres formes verbales : *vos **tenés***, *vos **sos***, *vos **hablás***. Ce n'est pas une faute mais une norme régionale.

## Après une préposition
Le pronom sujet change de forme : *mí, ti*, puis *él, ella, usted, nosotros, vosotros, ellos*. *Para **mí***, *sin **ti***. Deux soudures irrégulières : ***conmigo***, ***contigo***. Après *entre, según, excepto, salvo, incluso*, on garde en revanche *yo* et *tú* : *entre **tú** y **yo***, *según **tú***.`,
          },
          questions: [
            ['Pourquoi l’espagnol omet-il souvent le pronom sujet ?', ['La terminaison du verbe identifie déjà la personne', 'C’est un usage familier', 'Pour aller plus vite', 'Le pronom n’existe pas'], 0, 'On l’exprime pour insister, opposer ou lever une ambiguïté.'],
            ['« Usted » se conjugue à la deuxième personne.', ['Vrai', 'Faux'], 1, 'À la troisième : *¿Usted habla español?* — il vient de *vuestra merced*.'],
            ['Quel pronom remplace « vosotros » en Amérique latine ?', ['Ustedes', 'Vos', 'Tú', 'Nosotros'], 0, '*Vosotros* n’y est pas employé, même entre amis.'],
            ['Le « voseo » consiste à employer…', ['Vos à la place de tú', 'Usted à la place de tú', 'Vosotros à la place d’ustedes', 'Nos à la place de nosotros'], 0, '*Vos tenés*, *vos sos* : norme d’Argentine, d’Uruguay, du Paraguay.'],
            ['Comment traduire « pour moi » ?', ['Para mí', 'Para yo', 'Por yo', 'Para me'], 0, 'Après préposition, *yo* devient *mí* et *tú* devient *ti*.'],
            ['« Conmigo » et « contigo » sont des formes soudées irrégulières.', ['Vrai', 'Faux'], 0, 'On ne dit jamais « con mí » ni « con ti ».'],
            ['Après « entre » et « según », quel pronom emploie-t-on ?', ['Tú et yo', 'Ti et mí', 'Te et me', 'Usted seulement'], 0, '*Entre tú y yo*, *según tú* : ces prépositions font exception.'],
            ['« Yo no lo he dicho » exprime une insistance.', ['Vrai', 'Faux'], 0, 'Sans le *yo*, la phrase serait neutre : le pronom souligne le contraste.'],
          ],
        },
        {
          titre: 'Les pronoms personnels compléments',
          lecon: {
            titre: 'Enclise, ordre, et le « se » qui remplace « le »',
            cours: `C'est le point de grammaire qui distingue le plus nettement une copie sûre d'une copie approximative : le placement des pronoms compléments.

## Les deux séries
- **COD** : *me, te, **lo / la**, nos, os, **los / las***
- **COI** : *me, te, **le**, nos, os, **les***

Elles ne diffèrent qu'à la 3e personne. *La veo* (je la vois, COD) / *Le hablo* (je lui parle, COI).

## La place : proclise ou enclise
- Devant un **verbe conjugué**, le pronom se place **avant**, séparé : *Te lo digo*, *No me lo dijo.*
- Avec un **infinitif**, un **gérondif** ou un **impératif affirmatif**, il se **soude derrière** le verbe : *dár**melo***, *diciéndo**telo***, *dá**melo***. C'est l'**enclise**, et elle est obligatoire.
- Avec l'impératif **négatif**, retour devant : *No me lo des.*
- Avec un verbe conjugué + infinitif ou gérondif, les deux placements sont admis : *Te lo voy a decir* = *Voy a decír**telo***.

> L'enclise ajoute souvent un accent écrit, pour garder la syllabe tonique d'origine : *da* → *dámelo*, *decir* → *decírtelo*.

## L'ordre : COI avant COD
Toujours, et sans exception : *Me lo da* (il me le donne), *Te la doy.*

## Le « le » qui devient « se »
Quand *le* ou *les* rencontre *lo, la, los, las*, il se change en ***se*** : *le lo doy* est impossible → ***Se** lo doy* (je le lui donne). Pure question d'euphonie, mais faute lourde si on l'ignore.

## Le redoublement
L'espagnol répète très souvent le COI par un pronom, même quand le complément est exprimé : ***Le** doy el libro **a Juan***, ***A mí me** gusta. Loin d'être une lourdeur, c'est la norme.

## Le leísmo
En Castille, *le* s'emploie couramment comme COD pour une personne masculine : *Le vi* pour *Lo vi*. La RAE le tolère à ce seul cas ; ailleurs, on s'en tient à *lo*.`,
          },
          questions: [
            ['Dans quel ordre se placent les pronoms compléments ?', ['COI puis COD', 'COD puis COI', 'Selon la longueur du mot', 'Indifféremment'], 0, '*Me lo da*, *te la doy* : le COI passe toujours devant.'],
            ['Que devient « le » devant « lo » ?', ['Se', 'Lo', 'La', 'Les'], 0, '*Se lo doy* : « le lo doy » n’existe pas.'],
            ['Avec un impératif affirmatif, le pronom se soude derrière le verbe.', ['Vrai', 'Faux'], 0, '*Dámelo*, *dímelo* — et l’accent écrit apparaît.'],
            ['Où se place le pronom avec un impératif négatif ?', ['Devant le verbe', 'Soudé derrière', 'Après le sujet', 'En fin de phrase'], 0, '*No me lo des* : l’enclise ne vaut que pour l’affirmatif.'],
            ['« Voy a decírtelo » et « Te lo voy a decir » sont tous deux corrects.', ['Vrai', 'Faux'], 0, 'Avec un verbe conjugué + infinitif, les deux placements sont admis.'],
            ['Quel pronom COD correspond à « la » (féminin) ?', ['La', 'Le', 'Se', 'Ella'], 0, '*La veo* : je la vois. *Le hablo* serait un COI.'],
            ['Le redoublement du COI est une lourdeur à éviter.', ['Vrai', 'Faux'], 1, 'C’est la norme : *Le doy el libro a Juan*, *A mí me gusta*.'],
            ['L’accent écrit sur « dámelo » sert à…', ['Conserver la syllabe tonique du verbe d’origine', 'Marquer l’impératif', 'Distinguer le COD du COI', 'Signaler un pluriel'], 0, 'L’enclise allonge le mot : sans accent, la prononciation changerait.'],
          ],
        },
        {
          titre: 'Les possessifs',
          lecon: {
            titre: 'Mi, mío, el mío : trois emplois',
            cours: `L'espagnol distingue deux séries de possessifs — l'une **avant** le nom, l'autre **après** — là où le français n'en a qu'une.

## Les formes atones (devant le nom)
*mi(s), tu(s), su(s), nuestro/a(s), vuestro/a(s), su(s).*

Elles s'accordent avec **ce qui est possédé**, pas avec le possesseur : *mis libros* (mes livres), *nuestra casa*. Seuls *nuestro* et *vuestro* varient en genre.

## Les formes toniques (après le nom, ou seules)
*mío/a(s), tuyo/a(s), suyo/a(s), nuestro/a(s), vuestro/a(s), suyo/a(s).*

Trois emplois :
- après le nom, pour insister : *un amigo **mío*** (un ami à moi), *Dios **mío*** ;
- comme attribut : *Este libro es **mío*** ;
- avec l'article, comme pronom : *El **mío** es más grande.*

## Le problème de « su »
*Su* peut signifier son, sa, leur, **votre** (de *usted*) : quatre possesseurs pour une seule forme. Quand le contexte ne suffit pas, on lève l'ambiguïté avec *de* + pronom : *su casa* → *la casa **de él***, *la casa **de usted***.

## Le corps et les vêtements : pas de possessif
C'est la différence la plus visible avec le français. Quand la possession est évidente, l'espagnol emploie **l'article défini** :
- *Me lavo **las** manos* (je me lave les mains)
- *Le duele **la** cabeza* (il a mal à la tête)
- *Se quitó **el** abrigo* (il enleva son manteau)

> Dire *mis manos* pour « mes mains » n'est pas faux mais sonne étrange : le pronom réfléchi porte déjà l'information.

## Le vocatif
Après un nom en apostrophe, le possessif tonique suit : *¡Hijo **mío**!*, *¡Madre **mía**!*`,
          },
          questions: [
            ['Avec quoi le possessif espagnol s’accorde-t-il ?', ['Avec ce qui est possédé', 'Avec le possesseur', 'Avec le verbe', 'Avec l’article'], 0, '*Mis libros* : le -s vient des livres, pas de moi.'],
            ['Comment traduire « je me lave les mains » ?', ['Me lavo las manos', 'Me lavo mis manos', 'Lavo mis manos', 'Me lavo mías manos'], 0, 'Corps et vêtements prennent l’article défini, pas le possessif.'],
            ['« Su » peut signifier son, sa, leur ou votre.', ['Vrai', 'Faux'], 0, 'D’où le recours à *de él*, *de usted* pour lever l’ambiguïté.'],
            ['Comment dit-on « un ami à moi » ?', ['Un amigo mío', 'Un mi amigo', 'Un amigo de mí', 'Mi un amigo'], 0, 'La forme tonique se place après le nom.'],
            ['Quelles formes atones varient en genre ?', ['Nuestro et vuestro', 'Mi et tu', 'Su seulement', 'Toutes'], 0, '*Nuestra casa*, *vuestros libros* — mais *mi* et *tu* restent invariables.'],
            ['« El mío » est un pronom possessif.', ['Vrai', 'Faux'], 0, 'Article + forme tonique : *El mío es más grande.*'],
            ['Comment traduire « il a mal à la tête » ?', ['Le duele la cabeza', 'Le duele su cabeza', 'Duele su cabeza', 'Tiene mal su cabeza'], 0, 'Le pronom *le* porte déjà l’information de possession.'],
            ['Au vocatif, on dit « ¡Hijo mío! ».', ['Vrai', 'Faux'], 0, 'La forme tonique suit le nom en apostrophe : *¡Madre mía!*'],
          ],
        },
        {
          titre: 'Les pronoms relatifs',
          lecon: {
            titre: 'Que, quien, el que, cuyo',
            cours: `Un seul pronom relatif couvre l'essentiel — *que* — mais les autres se placent exactement là où une copie se distingue.

## Que
Le plus fréquent, invariable, pour les **personnes comme les choses**, sujet ou complément : *El libro **que** leo*, *La chica **que** vino.* Après une préposition courte, on lui adjoint l'article : *el libro **del que** te hablé*, *la casa **en la que** vivo.*

## Quien / quienes
**Personnes uniquement**, et jamais en relative déterminative sans préposition. On l'emploie :
- après préposition : *la persona **con quien** hablo* ;
- en relative explicative : *Mi hermano, **quien** vive en Madrid, es médico* ;
- sans antécédent : *Quien mucho abarca, poco aprieta.*

## El que, la que, los que, las que
Ils marquent le **genre et le nombre**, donc ils lèvent les ambiguïtés : *La hermana de Juan, **la que** vive en Sevilla…* Sans antécédent, ils signifient « celui/celle qui » : *Los que quieran, que vengan.*

## El cual, la cual, los cuales, las cuales
Même valeur, **registre plus soutenu**, surtout après une préposition longue : *la razón **por la cual** te llamo*, *el motivo **sin el cual*** …

## Cuyo : le « dont » possessif
*cuyo, cuya, cuyos, cuyas* traduisent « dont » quand il exprime la **possession**, et s'accordent avec **ce qui est possédé**, pas avec le possesseur :
- *El escritor **cuya** novela leí* (l'écrivain dont j'ai lu le roman)
- *La casa **cuyos** muros son blancos.*

> *Cuyo* n'est jamais suivi d'un article : « cuyo el libro » n'existe pas. Et il ne s'emploie pas en question : « ¿Cuyo es? » est incorrect, on dit *¿De quién es?*

## Lo que, lo cual
Pour reprendre une **idée entière**, jamais un nom : *Llegó tarde, **lo que** (ou **lo cual**) me molestó.*

## Donde, cuando, como
Relatifs d'espace, de temps et de manière, sans accent : *el pueblo **donde** nací*, *el día **cuando** llegaste*, *la manera **como** lo hizo.*`,
          },
          questions: [
            ['Avec quoi « cuyo » s’accorde-t-il ?', ['Avec ce qui est possédé', 'Avec le possesseur', 'Avec le verbe', 'Il est invariable'], 0, '*El escritor cuya novela leí* : *cuya* s’accorde avec *novela*.'],
            ['« Cuyo » peut être suivi d’un article.', ['Vrai', 'Faux'], 1, '« Cuyo el libro » n’existe pas : *cuyo libro* directement.'],
            ['Quel relatif s’emploie uniquement pour des personnes ?', ['Quien', 'Que', 'Cuyo', 'Donde'], 0, '*La persona con quien hablo.*'],
            ['Comment traduire « la maison dans laquelle je vis » ?', ['La casa en la que vivo', 'La casa que vivo', 'La casa cuya vivo', 'La casa quien vivo'], 0, 'Après préposition, *que* prend l’article.'],
            ['Pour reprendre une idée entière, on emploie « lo que » ou « lo cual ».', ['Vrai', 'Faux'], 0, '*Llegó tarde, lo que me molestó.*'],
            ['« Los que quieran, que vengan » signifie…', ['Que ceux qui veulent viennent', 'Ceux-là veulent venir', 'Ils veulent qu’ils viennent', 'Que veulent-ils venir'], 0, '*El que / los que* sans antécédent = celui qui / ceux qui.'],
            ['Comment demander « à qui est-ce ? »', ['¿De quién es?', '¿Cuyo es?', '¿Que es de?', '¿Quien es de?'], 0, '*Cuyo* ne s’emploie jamais dans une question.'],
            ['« El cual » appartient à un registre plus soutenu que « que ».', ['Vrai', 'Faux'], 0, 'Surtout après une préposition longue : *la razón por la cual*.'],
          ],
        },
        {
          titre: 'Les indéfinis',
          lecon: {
            titre: 'Alguien, nada, cualquiera, cada',
            cours: `Les indéfinis désignent sans identifier. Ils vont par paires — un positif, un négatif — et quelques-uns réservent des surprises.

## Les personnes : alguien / nadie
Invariables, toujours singuliers : *¿Hay **alguien**?* — *No hay **nadie**.* Avec un COD personne, la préposition *a* est obligatoire : *No veo **a nadie**.*

## Les choses : algo / nada
Invariables également : *¿Quieres **algo**?* — *No quiero **nada**.* Employés avec un adjectif, ils prennent *de* : *algo **de** interesante*… ou plus couramment *algo interesante*.

## Alguno / ninguno
Ceux-là s'accordent et s'**apocopent** devant un masculin singulier : *algún libro*, *ningún problema* ; mais *alguna casa*, *ninguna duda*, et *alguno de ellos* quand ils sont pronoms.

> Placé **après** le nom, *alguno* prend un sens négatif renforcé : *No tengo duda **alguna*** = je n'ai aucun doute.

*Ninguno* s'emploie presque toujours au singulier : *ningún amigo vino*, pas « ningunos ».

## Cada
Invariable, jamais de pluriel : *cada día*, *cada dos horas*. « Chacun » se dit *cada uno / cada una*. Ne pas confondre avec *todos los días* (tous les jours), qui insiste sur l'ensemble quand *cada día* détaille.

## Cualquiera
« N'importe lequel ». Il s'apocope en ***cualquier*** devant un nom, masculin **ou** féminin : *cualquier día*, *cualquier mujer*. Sans nom, il garde son *-a* : *Cualquiera puede hacerlo.* Pluriel rare : *cualesquiera*.

## Todo
S'accorde : *todo el día, toda la noche, todos los alumnos*. Attention, il exige l'article : *todos **los** días*, jamais « todos días ».

## Les autres à connaître
*otro* (autre — sans article indéfini : *otro día*), *varios* (plusieurs), *mucho / poco* (accordés), *demasiado* (trop), *bastante*, *los demás* (les autres, le reste), *mismo* (même), *tal* (tel), *ambos* (tous les deux).`,
          },
          questions: [
            ['Comment traduire « je ne vois personne » ?', ['No veo a nadie', 'No veo nadie', 'Veo a nadie', 'No veo alguien'], 0, 'Double négation, et le *a* devant un COD de personne.'],
            ['« Cualquiera » s’apocope en « cualquier » devant un nom.', ['Vrai', 'Faux'], 0, 'Masculin comme féminin : *cualquier día*, *cualquier mujer*.'],
            ['« Cada » peut-il se mettre au pluriel ?', ['Non, il est invariable', 'Oui : cadas', 'Oui au féminin seulement', 'Oui devant un nombre'], 0, '*Cada día*, *cada dos horas* ; « chacun » se dit *cada uno*.'],
            ['Placé après le nom, « alguno » prend un sens…', ['Négatif renforcé', 'Positif renforcé', 'Interrogatif', 'Neutre'], 0, '*No tengo duda alguna* = aucun doute.'],
            ['« Todos días » est correct.', ['Vrai', 'Faux'], 1, '*Todo* exige l’article : *todos los días*.'],
            ['Que signifie « los demás » ?', ['Les autres, le reste', 'Les mêmes', 'Trop nombreux', 'Chacun'], 0, '*Los demás alumnos se fueron.*'],
            ['« Alguien » et « nadie » sont invariables et toujours singuliers.', ['Vrai', 'Faux'], 0, 'Ils ne s’accordent ni en genre ni en nombre.'],
            ['Comment dit-on « un autre livre » ?', ['Otro libro', 'Un otro libro', 'El otro libro', 'Otro el libro'], 0, '*Otro* ne prend jamais l’article indéfini.'],
          ],
        },
        {
          titre: 'La comparaison',
          lecon: {
            titre: 'Más que, tan como, tanto como',
            cours: `Trois structures suffisent — mais le choix entre *tan* et *tanto*, et entre *que* et *de*, se joue à chaque phrase.

## La supériorité et l'infériorité
**más… que** / **menos… que** : *Es **más alto que** yo*, *Tengo **menos dinero que** tú.* La structure vaut pour les adjectifs, les adverbes et les noms.

## L'égalité : tan ou tanto
- **tan + adjectif ou adverbe + como** : *Es **tan** alto **como** tú*, *Corre **tan** rápido **como** yo.*
- **tanto/a/os/as + nom + como** : *Tengo **tantos** libros **como** tú*, *Bebe **tanta** agua **como** yo.*
- **verbe + tanto como** : *Trabaja **tanto como** yo.*

> Retenir la règle en une ligne : *tan* devant un mot **qualifiant**, *tanto* devant un mot **comptable** ou après un verbe.

## Que ou de devant un nombre
Devant une **quantité chiffrée**, on emploie *de* et non *que* : *Tengo **más de** veinte libros*, *Cuesta **menos de** diez euros.*

Exception à connaître : dans une phrase **négative**, *más que* signifie « seulement » — *No tengo **más que** diez euros* (je n'ai que dix euros), à distinguer de *No tengo **más de** diez euros* (pas plus de dix).

## Les comparatifs irréguliers
- *bueno → **mejor*** (meilleur), *malo → **peor*** (pire)
- *grande → **mayor***, *pequeño → **menor*** (surtout pour l'âge et l'abstrait : *mi hermano mayor*)
- *bien → **mejor***, *mal → **peor***

Ils ne s'emploient jamais avec *más* : « más mejor » est une faute.

## Le second terme est une proposition
On emploie alors *de lo que*, *del que*, *de la que* selon le cas : *Es **más** difícil **de lo que** parece*, *Tiene **más** dinero **del que** dice.*

## Le comparatif progressif
*cada vez más / cada vez menos* : *Hace **cada vez más** calor.*`,
          },
          questions: [
            ['Comment traduire « aussi grand que toi » ?', ['Tan alto como tú', 'Tanto alto como tú', 'Más alto como tú', 'Tan alto que tú'], 0, '*Tan* devant un adjectif, *como* comme second terme.'],
            ['Comment traduire « autant de livres que toi » ?', ['Tantos libros como tú', 'Tan libros como tú', 'Tanto libros como tú', 'Más libros como tú'], 0, '*Tanto* devant un nom, et il s’accorde : *tantos libros*.'],
            ['Devant un nombre, on emploie « de » et non « que ».', ['Vrai', 'Faux'], 0, '*Más de veinte libros*, *menos de diez euros*.'],
            ['Que signifie « No tengo más que diez euros » ?', ['Je n’ai que dix euros', 'Je n’ai pas plus de dix euros', 'J’ai plus de dix euros', 'J’ai environ dix euros'], 0, 'En phrase négative, *más que* signifie « seulement ».'],
            ['« Más mejor » est correct en espagnol.', ['Vrai', 'Faux'], 1, 'Les comparatifs irréguliers ne se combinent jamais avec *más*.'],
            ['Quel est le comparatif de « malo » ?', ['Peor', 'Más malo', 'Menor', 'Mal'], 0, 'Comme *bueno → mejor*, *grande → mayor*, *pequeño → menor*.'],
            ['Comment traduire « plus difficile qu’il n’y paraît » ?', ['Más difícil de lo que parece', 'Más difícil que parece', 'Más difícil como parece', 'Tan difícil que parece'], 0, 'Quand le second terme est une proposition : *de lo que*.'],
            ['« Trabaja tanto como yo » est correct.', ['Vrai', 'Faux'], 0, 'Après un verbe, on emploie *tanto como*, invariable.'],
          ],
        },
        {
          titre: 'Le superlatif',
          lecon: {
            titre: 'El más… de, et le suffixe -ísimo',
            cours: `Deux superlatifs, et deux pièges : la préposition du superlatif relatif, et l'orthographe du suffixe absolu.

## Le superlatif relatif
Il compare à l'intérieur d'un ensemble : **el / la / los / las + (nom) + más ou menos + de**.

*Es **el** alumno **más** inteligente **de** la clase.* — *Es **la** ciudad **menos** cara **del** país.*

> Le piège : le complément se construit avec ***de***, jamais avec *en*. Le français dit « le plus grand **du** monde », l'espagnol aussi : *el más grande **del** mundo*.

Quand le nom est déjà exprimé avant, l'article ne se répète pas : *Mi hermano es **el más** alto.*

## Le superlatif absolu
Il n'y a pas de comparaison : la qualité est portée au maximum. Deux moyens :
- **muy + adjectif** : *muy guapo* ;
- le suffixe **-ísimo/a/os/as** : *guap**ísimo***, *rapid**ísimo***, *much**ísimo***.

Les deux ne se cumulent jamais : « muy guapísimo » est une faute.

## Les changements orthographiques de -ísimo
La finale disparaît, et la consonne s'ajuste pour garder le son :
- *c → qu* : *rico → riqu**ísimo***, *blanco → blanqu**ísimo*** ;
- *g → gu* : *largo → largu**ísimo*** ;
- *z → c* : *feliz → felic**ísimo*** ;
- diphtongue conservée ou non selon l'usage : *bueno → bon**ísimo*** (norme) ou *buen**ísimo*** (courant, admis) ; *fuerte → fort**ísimo***.

## Les superlatifs irréguliers savants
*bueno → **óptimo***, *malo → **pésimo***, *grande → **máximo***, *pequeño → **mínimo***, *alto → **supremo***. Registre soutenu : à reconnaître à la lecture, à employer avec parcimonie.

## Renforcer autrement
*sumamente, extremadamente, super-, requete-* : *un examen **super** difícil* (familier).`,
          },
          questions: [
            ['Comment traduire « le plus grand du monde » ?', ['El más grande del mundo', 'El más grande en el mundo', 'El mucho grande del mundo', 'El más grande que el mundo'], 0, 'Le complément du superlatif relatif se construit avec *de*.'],
            ['« Muy guapísimo » est une tournure correcte.', ['Vrai', 'Faux'], 1, 'On emploie *muy* OU le suffixe -ísimo, jamais les deux.'],
            ['Quel est le superlatif absolu de « rico » ?', ['Riquísimo', 'Ricísimo', 'Rikísimo', 'Ricoísimo'], 0, 'Le c devient qu pour conserver le son [k].'],
            ['Quel est le superlatif absolu de « feliz » ?', ['Felicísimo', 'Felizísimo', 'Felisísimo', 'Felizmo'], 0, 'Le z devient c devant le i.'],
            ['« Óptimo » est le superlatif savant de « bueno ».', ['Vrai', 'Faux'], 0, 'Comme *pésimo* pour *malo*, *máximo* pour *grande*.'],
            ['Que devient le « g » de « largo » au superlatif ?', ['Il devient gu : larguísimo', 'Il disparaît', 'Il devient j', 'Il double'], 0, 'Pour conserver le son [g] devant le i.'],
            ['Le superlatif relatif compare à l’intérieur d’un ensemble.', ['Vrai', 'Faux'], 0, '*El alumno más inteligente de la clase* : l’ensemble est la classe.'],
            ['Comment dit-on « énormément » avec un suffixe ?', ['Muchísimo', 'Muy mucho', 'Mucho muy', 'Máximo'], 0, '*Mucho* prend lui aussi le suffixe -ísimo.'],
          ],
        },
        {
          titre: 'L’apocope',
          lecon: {
            titre: 'Les mots qui perdent leur fin',
            cours: `L'apocope est la chute de la finale d'un mot devant un autre. L'espagnol en fait un usage réglé : ce n'est pas un relâchement, c'est une obligation.

## Devant un nom masculin singulier
Ces mots perdent leur *-o* final :
- *uno → **un** libro*
- *alguno → **algún** día*, *ninguno → **ningún** problema*
- *bueno → **buen** amigo*, *malo → **mal** tiempo*
- *primero → **primer** piso*, *tercero → **tercer** año*
- *postrero → **postrer** día* (rare)

Devant un féminin, rien ne change : *una casa*, *buena idea*, *primera vez*.

> Attention : l'apocope ne joue que si l'adjectif est **immédiatement** devant le nom. *Un **buen** amigo*, mais *un amigo **bueno***, et *el **primero** de la clase* (sans nom derrière).

## Grande → gran
Devant un nom singulier, **masculin ou féminin** : *un **gran** hombre*, *una **gran** mujer*. Au pluriel, la forme entière revient : *grandes hombres*. Et le sens change avec la place : *gran* devant = important ; *grande* derrière = de grande taille.

## Ciento → cien
Devant un **nom** ou devant *mil* et *millones* : *cien euros*, *cien mil*, *cien millones*. Mais on garde *ciento* quand il est suivi d'un autre nombre ou employé seul : *ciento veinte*, *el ciento por ciento*.

## Santo → san
Devant un prénom masculin : *san Juan*, *san Pedro*. **Sauf** devant *To-* et *Do-* : *Santo Tomás*, *Santo Domingo*, *Santo Tomé*. Au féminin, jamais d'apocope : *santa Teresa*.

## Cualquiera → cualquier
Devant tout nom, masculin ou féminin : *cualquier día*, *cualquier mujer*.

## Tanto → tan, cuanto → cuán
Devant un adjectif ou un adverbe : *tan alto*, *tan rápido*, *¡**cuán** hermoso!* (littéraire). Devant un nom, la forme pleine reste : *tanto dinero*.

## Recientemente → recién
Devant un participe : *recién nacido*, *recién llegado*, *recién casados*.`,
          },
          questions: [
            ['Quelle est la forme apocopée de « bueno » devant un nom masculin ?', ['Buen', 'Bue', 'Buenó', 'Bon'], 0, '*Un buen amigo*, mais *un amigo bueno* garde la forme pleine.'],
            ['« Grande » s’apocope devant un nom féminin singulier.', ['Vrai', 'Faux'], 0, '*Una gran mujer* : c’est le seul adjectif à s’apocoper aux deux genres.'],
            ['Comment dit-on « cent euros » ?', ['Cien euros', 'Ciento euros', 'Cientos euros', 'Cien de euros'], 0, '*Ciento* s’apocope devant un nom, et devant *mil* et *millones*.'],
            ['Quelle est la forme correcte : « santo Domingo » ou « Santo Domingo » ?', ['Santo Domingo : pas d’apocope devant To- et Do-', 'San Domingo', 'Sant Domingo', 'Sa Domingo'], 0, 'Même exception pour *Santo Tomás* et *Santo Tomé*.'],
            ['« Tercero » devient « tercer » devant un nom masculin singulier.', ['Vrai', 'Faux'], 0, '*El tercer año*, comme *el primer piso*.'],
            ['Quelle est la forme apocopée de « cualquiera » ?', ['Cualquier, aux deux genres', 'Cualqui', 'Cualquiero', 'Il ne s’apocope pas'], 0, '*Cualquier día*, *cualquier mujer*.'],
            ['« Recién » s’emploie devant un participe.', ['Vrai', 'Faux'], 0, '*Recién nacido*, *recién llegado*, *recién casados*.'],
            ['« Ciento veinte » garde la forme pleine parce que…', ['Ciento est suivi d’un autre nombre', 'Ciento est féminin', 'Le nombre est pair', 'Il s’agit d’un pluriel'], 0, 'L’apocope ne joue que devant un nom, *mil* ou *millones*.'],
          ],
        },
        // ---- Chapitre 3 du programme : Le groupe verbal ----------------------
        {
          titre: 'L’auxiliaire haber',
          lecon: {
            titre: 'Haber, l’auxiliaire unique',
            cours: `L'espagnol n'a qu'un seul auxiliaire de temps composé : *haber*. Là où le français hésite entre « être » et « avoir », l'espagnol ne choisit jamais.

## Le présent de haber
*he, has, ha, hemos, habéis, han.* Suivi du participe passé, il forme le **pretérito perfecto** : *He comido*, *Han llegado.*

## Le participe ne s'accorde jamais
C'est la conséquence directe de l'auxiliaire unique : *La carta que he **escrito*** (jamais « escrita »), *Ellas han **venido***, *Nos hemos **lavado***. Aucun accord, dans aucun cas, avec *haber*.

## Rien ne s'intercale
Entre l'auxiliaire et le participe, on ne place ni pronom, ni adverbe, ni négation : *No lo he visto **nunca*** — jamais « he nunca visto », jamais « he lo visto ». Le bloc *haber + participe* est soudé.

## Hay : la forme impersonnelle
*Hay* signifie « il y a », et il est **invariable** : *Hay un libro*, *Hay dos libros.* Aux autres temps : *había* (il y avait), *hubo* (il y eut), *habrá* (il y aura), *habría*, *ha habido*. Toujours au singulier, même devant un pluriel : *Había muchos alumnos.*

> Ne pas confondre *hay* (existence) et *está* (localisation d'une chose déjà connue) : *Hay un banco en la plaza* / *El banco **está** en la plaza.*

## Les autres temps composés
- **plus-que-parfait** : *había + participe* — *Había salido cuando llegué* ;
- **futur antérieur** : *habré + participe* — *A las ocho ya habré terminado* ;
- **conditionnel passé** : *habría + participe* ;
- **subjonctif** : *haya + participe* (*Espero que haya llegado*), *hubiera / hubiese + participe.*

## Haber que et haber de
*Hay que + infinitif* exprime l'obligation impersonnelle : *Hay que estudiar* (il faut étudier). *Haber de + infinitif* exprime une obligation atténuée ou une prévision, d'un registre plus littéraire : *He de irme.*`,
          },
          questions: [
            ['Combien l’espagnol a-t-il d’auxiliaires de temps composés ?', ['Un seul : haber', 'Deux : haber et ser', 'Deux : haber et tener', 'Trois'], 0, 'Contrairement au français, aucune hésitation entre « être » et « avoir ».'],
            ['Le participe passé s’accorde avec « haber ».', ['Vrai', 'Faux'], 1, 'Jamais : *la carta que he escrito*, *ellas han venido*.'],
            ['Comment traduire « il y a deux livres » ?', ['Hay dos libros', 'Han dos libros', 'Hays dos libros', 'Están dos libros'], 0, '*Hay* est invariable, même devant un pluriel.'],
            ['Peut-on placer un adverbe entre l’auxiliaire et le participe ?', ['Non, le bloc est soudé', 'Oui, toujours', 'Oui, si c’est une négation', 'Oui, à l’écrit seulement'], 0, '*No lo he visto nunca*, jamais « he nunca visto ».'],
            ['« Había » est la forme passée de « hay ».', ['Vrai', 'Faux'], 0, 'Et elle reste au singulier : *Había muchos alumnos.*'],
            ['Que signifie « Hay que estudiar » ?', ['Il faut étudier', 'J’ai étudié', 'Il y a des études', 'Il faut que j’étudie'], 0, 'Obligation impersonnelle, sans sujet exprimé.'],
            ['Comment forme-t-on le plus-que-parfait ?', ['Había + participe passé', 'Hubo + participe passé', 'Era + participe passé', 'Estaba + participe passé'], 0, '*Había salido cuando llegué.*'],
            ['« Hay un banco en la plaza » et « El banco está en la plaza » disent la même chose.', ['Vrai', 'Faux'], 1, '*Hay* pose l’existence, *estar* localise une chose déjà connue.'],
          ],
        },
        {
          titre: 'Les verbes pronominaux',
          lecon: {
            titre: 'Se, et ses cinq valeurs',
            cours: `Le pronom réfléchi espagnol se comporte comme en français — sauf qu'il se **soude** au verbe dans trois cas, et qu'il couvre des emplois que le français rend autrement.

## Les formes
*me, te, se, nos, os, se.* Ils s'accordent avec le sujet : *yo **me** lavo, tú **te** lavas, él **se** lava.*

## La place
Devant le verbe conjugué (*Me levanto a las siete*), mais **soudé** derrière l'infinitif, le gérondif et l'impératif affirmatif : *levantar**se***, *levantándo**se***, *¡levánta**te**!* Avec un semi-auxiliaire, les deux placements sont admis : *Me voy a levantar* = *Voy a levantar**me**.*

## Les cinq valeurs
- **réfléchie** : l'action revient sur le sujet — *Se lava* (il se lave lui-même) ;
- **réciproque** : plusieurs sujets agissent l'un sur l'autre — *Se escriben* (ils s'écrivent) ;
- **lexicale** : le pronom fait partie du verbe — *quejarse* (se plaindre), *arrepentirse*, *atreverse*, *darse cuenta de* ;
- **passive** (*se* pasiva) : *Se venden pisos* (des appartements sont à vendre) — le verbe s'accorde avec le sujet ;
- **impersonnelle** : *Se dice que…* (on dit que), *Aquí se come bien* — verbe toujours au **singulier**.

> *Se venden pisos* (passive : accord) contre *Se habla de política* (impersonnelle : singulier). C'est le même *se*, deux constructions.

## Le pronominal qui change le sens
- *ir* (aller) / *irse* (partir) — *Me voy* = je m'en vais
- *dormir* (dormir) / *dormirse* (s'endormir)
- *quedar* (rester, convenir) / *quedarse* (rester sur place)
- *acordar* (décider) / *acordarse de* (se souvenir de)
- *poner* (mettre) / *ponerse* (se mettre, devenir)

## Le pronominal d'intensité
Sans valeur réfléchie, il ajoute une nuance d'appropriation : *Se comió toda la tarta* (il s'est enfilé toute la tarte), *Se bebió un litro.*`,
          },
          questions: [
            ['Où se place le pronom réfléchi avec un infinitif ?', ['Soudé derrière : levantarse', 'Devant l’infinitif', 'En fin de phrase', 'Devant le sujet'], 0, 'Même chose au gérondif et à l’impératif affirmatif.'],
            ['Dans « Se venden pisos », le verbe s’accorde avec « pisos ».', ['Vrai', 'Faux'], 0, 'C’est un *se* passif : le sujet grammatical est *pisos*.'],
            ['Que signifie « Me voy » ?', ['Je m’en vais', 'Je vais bien', 'Je me vois', 'Je viens'], 0, '*Ir* signifie aller, *irse* partir : le pronom change le sens.'],
            ['Dans un « se » impersonnel, le verbe est…', ['Toujours au singulier', 'Toujours au pluriel', 'Accordé au complément', 'À l’infinitif'], 0, '*Se dice que…*, *Aquí se come bien.*'],
            ['« Quejarse » et « atreverse » sont des verbes essentiellement pronominaux.', ['Vrai', 'Faux'], 0, 'Le pronom fait partie du verbe : il n’a pas de valeur réfléchie.'],
            ['Que signifie « Se escriben » ?', ['Ils s’écrivent l’un à l’autre', 'Ils s’écrivent eux-mêmes', 'On les écrit', 'Ils sont écrits'], 0, 'Valeur réciproque : plusieurs sujets agissent l’un sur l’autre.'],
            ['« Dormirse » signifie « s’endormir ».', ['Vrai', 'Faux'], 0, 'Alors que *dormir* signifie simplement dormir.'],
            ['Dans « Se comió toda la tarta », le pronom exprime…', ['Une nuance d’appropriation', 'Une réciprocité', 'Une passive', 'Une obligation'], 0, 'Le pronominal d’intensité, sans valeur réfléchie.'],
          ],
        },
        {
          titre: 'Les verbes à diphtongue',
          lecon: {
            titre: 'E → ie, o → ue : l’accent tonique commande',
            cours: `Une famille entière de verbes espagnols change de voyelle au présent. Ce n'est pas une irrégularité capricieuse : c'est **l'accent tonique** qui la déclenche.

## La règle
Quand l'accent tonique tombe sur la voyelle du radical, celle-ci **diphtongue** :
- **e → ie** : *pensar → **pie**nso*
- **o → ue** : *poder → **pue**do*
- **u → ue** : un seul verbe, *jugar → **jue**go*

Quand l'accent se déplace sur la terminaison, la voyelle **revient à sa forme simple**.

## La conjugaison en botte
*Pensar* au présent : *p**ie**nso, p**ie**nsas, p**ie**nsa, pensamos, pensáis, p**ie**nsan.* Les quatre formes qui diphtonguent dessinent une botte autour des deux formes de *nosotros* et *vosotros*, qui restent régulières. Cette botte est le meilleur moyen mnémotechnique du chapitre.

> Toute la difficulté tient là : *nosotros* et *vosotros* portent l'accent sur la terminaison, donc jamais de diphtongue.

## Où la diphtongue apparaît
Au **présent de l'indicatif**, au **présent du subjonctif** (*piense, pienses, piense, pensemos, penséis, piensen* — même botte) et à l'**impératif** (*¡piensa!*). Nulle part ailleurs : *pensé*, *pensaba*, *pensaré* sont réguliers.

## Les verbes à connaître
- **e → ie** : *pensar, empezar, cerrar, despertar, sentar, querer, entender, perder, encender, preferir, sentir, mentir, divertirse* ;
- **o → ue** : *poder, contar, encontrar, recordar, acostarse, volar, soñar, volver, mover, doler, morir, dormir* ;
- **u → ue** : *jugar.*

## Un cas à part
*Oler* (sentir une odeur) prend un **h** à l'écrit quand il diphtongue : *huelo, hueles, huele… olemos, oléis, huelen.*

## Ne pas confondre
Un verbe à diphtongue n'est pas un verbe à affaiblissement (*pedir → pido*), où le *e* devient *i*. Les deux se ressemblent à l'oreille, pas dans la règle.`,
          },
          questions: [
            ['Qu’est-ce qui déclenche la diphtongue ?', ['L’accent tonique sur la voyelle du radical', 'La terminaison en -ar', 'Le pluriel', 'La négation'], 0, 'Quand l’accent passe sur la terminaison, la voyelle redevient simple.'],
            ['Quelles personnes ne diphtonguent jamais ?', ['Nosotros et vosotros', 'Yo et tú', 'Él et ellos', 'Tú et vosotros'], 0, 'Elles portent l’accent sur la terminaison : d’où la conjugaison « en botte ».'],
            ['Quelle est la première personne de « poder » au présent ?', ['Puedo', 'Podo', 'Puedo/podo', 'Puedes'], 0, 'La diphtongue o → ue apparaît sous l’accent.'],
            ['« Jugar » est le seul verbe à diphtonguer u → ue.', ['Vrai', 'Faux'], 0, '*Juego, juegas, juega… jugamos, jugáis, juegan.*'],
            ['La diphtongue apparaît aussi au passé simple.', ['Vrai', 'Faux'], 1, 'Seulement au présent de l’indicatif, au subjonctif présent et à l’impératif.'],
            ['Quelle est la forme de « pensar » à la première personne du pluriel ?', ['Pensamos', 'Piensamos', 'Pensemos', 'Piensemos'], 0, 'L’accent tombe sur la terminaison : pas de diphtongue.'],
            ['Que devient « oler » quand il diphtongue ?', ['Huelo, avec un h', 'Uelo', 'Ólo', 'Oigo'], 0, 'Un h purement orthographique s’ajoute devant le ue initial.'],
            ['« Pedir → pido » est un verbe à diphtongue.', ['Vrai', 'Faux'], 1, 'C’est un verbe à affaiblissement : le e devient i, il ne diphtongue pas.'],
          ],
        },
        {
          titre: 'Les verbes à affaiblissement',
          lecon: {
            titre: 'E → i : la famille de pedir',
            cours: `Deuxième famille d'irréguliers du radical : ceux où le *e* ne diphtongue pas mais **s'affaiblit** en *i*. Ils sont tous du troisième groupe, en *-ir*.

## La règle
Sous l'accent tonique, le *e* du radical devient *i* : *pedir → **pi**do, **pi**des, **pi**de, pedimos, pedís, **pi**den.* Même botte que pour la diphtongue : *nosotros* et *vosotros* restent réguliers.

## Ils sont tous en -ir
C'est le repère le plus économique : aucun verbe en *-ar* ou en *-er* ne s'affaiblit. *Pedir, servir, repetir, seguir, conseguir, elegir, corregir, medir, vestir(se), reír, sonreír, despedirse, impedir, competir.*

## Où l'affaiblissement se produit
Plus largement que la diphtongue :
- **présent de l'indicatif** : *pido* ;
- **présent du subjonctif**, à **toutes** les personnes cette fois : *pida, pidas, pida, **pidamos**, **pidáis**, pidan* ;
- **3es personnes du passé simple** : *pidió, pidieron* (mais *pedí, pediste…*) ;
- **imparfait du subjonctif**, dérivé du passé simple : *pidiera, pidiese* ;
- **gérondif** : *p**i**diendo*, *s**i**rviendo*, *d**i**ciendo.*

> Le repère qui sauve : dès que la terminaison contient un *ie* ou un *ió*, l'affaiblissement s'applique. *Pidió*, jamais « pedió ».

## Les verbes mixtes
Quelques verbes en *-ir* diphtonguent au présent **et** s'affaiblissent ailleurs : *sentir* (*siento*, mais *sintió*, *sintiendo*), *preferir* (*prefiero*, *prefirió*), *dormir* (*duermo*, mais *durmió*, *durmiendo*), *morir* (*muero*, *murió*, *muriendo*).

## Les petits pièges orthographiques
- *seguir* perd son *u* devant *o* et *a* : *sigo*, *siga* ;
- *elegir* et *corregir* changent le *g* en *j* : *elijo*, *corrijo* ;
- *reír* garde son accent : *río, ríes, ríe, reímos, reís, ríen* ; gérondif *riendo.*`,
          },
          questions: [
            ['À quel groupe appartiennent tous les verbes à affaiblissement ?', ['Aux verbes en -ir', 'Aux verbes en -ar', 'Aux verbes en -er', 'À tous les groupes'], 0, '*Pedir, servir, repetir, seguir…* — aucun -ar ni -er.'],
            ['Quelle est la troisième personne du passé simple de « pedir » ?', ['Pidió', 'Pedió', 'Pidó', 'Pediró'], 0, 'Dès que la terminaison contient un ió ou un ie, le e s’affaiblit.'],
            ['Au subjonctif présent, l’affaiblissement touche toutes les personnes.', ['Vrai', 'Faux'], 0, '*Pida, pidas, pida, pidamos, pidáis, pidan* — y compris nosotros et vosotros.'],
            ['Quel est le gérondif de « decir » ?', ['Diciendo', 'Deciendo', 'Diciento', 'Dicendo'], 0, 'Le gérondif des verbes en -ir irréguliers porte l’affaiblissement.'],
            ['« Dormir » est un verbe mixte : diphtongue au présent, affaiblissement ailleurs.', ['Vrai', 'Faux'], 0, '*Duermo* au présent, mais *durmió* et *durmiendo*.'],
            ['Quelle est la première personne du présent de « seguir » ?', ['Sigo', 'Siguo', 'Sego', 'Seguo'], 0, 'Le u disparaît devant o et a, sinon il se prononcerait.'],
            ['Que devient le « g » de « elegir » devant un o ?', ['Il devient j : elijo', 'Il devient gu', 'Il disparaît', 'Il double'], 0, 'Pour conserver le son [x] : *elijo*, *corrijo*.'],
            ['« Pedimos » porte l’affaiblissement.', ['Vrai', 'Faux'], 1, 'Comme *pedís*, il garde le e : l’accent tombe sur la terminaison.'],
          ],
        },
        {
          titre: 'Ser et estar',
          lecon: {
            titre: 'Deux verbes « être », et tout se joue là',
            cours: `C'est l'erreur la plus visible d'un francophone en espagnol, parce qu'elle tombe à chaque phrase. La différence n'est pas « permanent contre passager » — c'est plus fin que ça.

## Ser : ce qui définit
Il dit **ce que la chose est**, l'identité, la classe à laquelle elle appartient :
- identité, origine, nationalité, profession, religion : *Soy español*, *Es profesora* ;
- caractéristique inhérente : *El hielo **es** frío*, *Es alto*, *Es simpático* ;
- matière, possession, destination : *Es de madera*, *El libro **es** de Juan*, *Es para ti* ;
- heure, date, prix, quantité : *Son las tres*, *Hoy **es** lunes*, *Son diez euros* ;
- voix passive d'action : *La casa **fue** construida en 1920.*

## Estar : ce qui se constate
Il dit **dans quel état la chose se trouve** à un moment donné :
- localisation d'une chose ou d'une personne : *Madrid **está** en España* ;
- état, humeur, santé : *Estoy cansado*, *Está enfermo*, *Está contenta* ;
- résultat d'un changement : *La sopa **está** fría* (elle a refroidi) ;
- forme progressive : *Estoy **estudiando*** ;
- avec un participe, l'état résultant : *La puerta **está** cerrada.*

> Le raccourci qui marche presque toujours : *ser* répond à « qu'est-ce que c'est ? », *estar* à « comment est-ce, en ce moment ? »

## Les adjectifs qui changent de sens
Ce ne sont pas des nuances, ce sont des mots différents :
- *ser listo* (malin) / *estar listo* (prêt)
- *ser aburrido* (ennuyeux) / *estar aburrido* (s'ennuyer)
- *ser rico* (riche) / *estar rico* (délicieux)
- *ser bueno* (bon, gentil) / *estar bueno* (bon au goût, en bonne santé)
- *ser malo* (méchant) / *estar malo* (malade)
- *ser vivo* (vif d'esprit) / *estar vivo* (en vie)
- *ser verde* (de couleur verte) / *estar verde* (pas mûr)

## Les expressions figées avec estar
*estar de acuerdo, estar de vacaciones, estar de pie, estar a punto de, estar por, estar de moda.*

## Le piège de la localisation
Un **événement** se situe avec *ser*, pas avec *estar* : *La fiesta **es** en mi casa* (elle a lieu chez moi), alors que *Mi casa **está** en el centro.*`,
          },
          questions: [
            ['Quel verbe employer pour la localisation d’une chose ?', ['Estar', 'Ser', 'Haber', 'Tener'], 0, '*Madrid está en España* — mais un événement se situe avec *ser*.'],
            ['« Ser listo » et « estar listo » ont le même sens.', ['Vrai', 'Faux'], 1, '« Être malin » contre « être prêt » : deux mots différents.'],
            ['Comment dit-on l’heure en espagnol ?', ['Son las tres', 'Están las tres', 'Hay las tres', 'Tienen las tres'], 0, 'Heure, date, prix : toujours *ser*.'],
            ['Que signifie « estar malo » ?', ['Être malade', 'Être méchant', 'Être mauvais', 'Être en colère'], 0, '*Ser malo* signifie être méchant.'],
            ['« La fiesta es en mi casa » est correct.', ['Vrai', 'Faux'], 0, 'Un événement se situe avec *ser*, à la différence d’un lieu ou d’un objet.'],
            ['Quel verbe entre dans la forme progressive ?', ['Estar (estoy estudiando)', 'Ser', 'Haber', 'Ir'], 0, '*Estar* + gérondif exprime l’action en cours.'],
            ['« La sopa está fría » décrit un état constaté.', ['Vrai', 'Faux'], 0, 'La soupe a refroidi ; *el hielo es frío* énonce une propriété.'],
            ['Comment dit-on « je suis d’accord » ?', ['Estoy de acuerdo', 'Soy de acuerdo', 'Tengo de acuerdo', 'Hay de acuerdo'], 0, 'Expression figée avec *estar*, comme *estar de vacaciones*.'],
          ],
        },
        {
          titre: 'Le gérondif',
          lecon: {
            titre: 'Estar + gérondif, et les tournures de durée',
            cours: `Le gérondif espagnol correspond à « en train de » plus qu'au gérondif français : il dit l'action **en cours**, dans son déroulement.

## La formation
- verbes en *-ar* → **-ando** : *hablar → hablando* ;
- verbes en *-er* et *-ir* → **-iendo** : *comer → comiendo*, *vivir → viviendo*.

**Irréguliers** : *decir → diciendo*, *pedir → pidiendo*, *dormir → durmiendo*, *morir → muriendo*, *poder → pudiendo*, *venir → viniendo*, *ir → yendo*, *leer → leyendo*, *oír → oyendo*, *caer → cayendo*, *construir → construyendo*.

> Le *-iendo* devient *-yendo* après une voyelle : *leyendo*, *oyendo*, *cayendo*, *yendo*.

## Estar + gérondif
La forme progressive, beaucoup plus employée qu'en français : *Estoy **comiendo*** (je suis en train de manger), *Estaba **lloviendo***, *¿Qué **estás haciendo**?*

## Les autres périphrases
- *seguir / continuar + gérondif* : la continuation — *Sigue **lloviendo*** (il pleut toujours) ;
- *llevar + durée + gérondif* : la durée écoulée — *Llevo dos años **estudiando** español* (j'étudie l'espagnol depuis deux ans) ;
- *ir + gérondif* : la progression lente — *Va **mejorando*** (il va en s'améliorant) ;
- *venir + gérondif* : une évolution qui vient du passé — *Viene **diciendo** lo mismo desde hace años* ;
- *acabar + gérondif* : le point d'aboutissement — *Acabó **aceptando***.

## Le gérondif seul
Il exprime la manière ou la simultanéité : *Salió **corriendo***, ***Estudiando**, se aprende.*

## Ce que le gérondif ne peut pas faire
- Il **ne qualifie pas un nom** : « una caja conteniendo libros » est un calque du français. On dit *una caja **que contiene** libros.*
- Il n'exprime pas la **postériorité** : on ne dit pas « Se cayó rompiéndose el brazo » pour dire qu'il s'est cassé le bras en tombant après.
- Après une préposition, l'espagnol emploie l'**infinitif**, pas le gérondif : *antes de **salir***, *sin **decir** nada*, *al **entrar***.

## Al + infinitif
C'est la tournure qui traduit « en + participe présent » quand il y a simultanéité : ***Al entrar**, vi a Juan* (en entrant, j'ai vu Juan).`,
          },
          questions: [
            ['Quelle est la terminaison du gérondif des verbes en -ar ?', ['-ando', '-iendo', '-yendo', '-ado'], 0, '*Hablar → hablando* ; les -er et -ir font *-iendo*.'],
            ['Quel est le gérondif de « leer » ?', ['Leyendo', 'Leiendo', 'Leendo', 'Leído'], 0, 'Le -iendo devient -yendo après une voyelle.'],
            ['« Una caja conteniendo libros » est correct en espagnol.', ['Vrai', 'Faux'], 1, 'Le gérondif ne qualifie pas un nom : *una caja que contiene libros*.'],
            ['Que signifie « Llevo dos años estudiando español » ?', ['J’étudie l’espagnol depuis deux ans', 'J’ai étudié deux ans', 'J’emporte deux ans d’espagnol', 'Je vais étudier deux ans'], 0, '*Llevar* + durée + gérondif exprime la durée écoulée.'],
            ['Après une préposition, on emploie l’infinitif et non le gérondif.', ['Vrai', 'Faux'], 0, '*Antes de salir*, *sin decir nada*, *al entrar*.'],
            ['Comment traduire « en entrant, j’ai vu Juan » ?', ['Al entrar, vi a Juan', 'Entrando, vi a Juan', 'En entrando, vi a Juan', 'Para entrar, vi a Juan'], 0, '*Al* + infinitif exprime la simultanéité.'],
            ['« Sigue lloviendo » signifie « il pleut toujours ».', ['Vrai', 'Faux'], 0, '*Seguir* + gérondif exprime la continuation.'],
            ['Quel est le gérondif de « dormir » ?', ['Durmiendo', 'Dormiendo', 'Duermiendo', 'Durmendo'], 0, 'L’affaiblissement o → u apparaît au gérondif des verbes en -ir.'],
          ],
        },
        {
          titre: 'Le participe passé',
          lecon: {
            titre: 'Accord ou pas : la question qui tranche',
            cours: `Le participe passé espagnol a une règle simple, à condition de savoir avec quoi il est employé.

## La formation
- verbes en *-ar* → **-ado** : *hablar → hablado* ;
- verbes en *-er* et *-ir* → **-ido** : *comer → comido*, *vivir → vivido.*

**Irréguliers à connaître** : *abrir → abierto*, *cubrir → cubierto*, *decir → dicho*, *escribir → escrito*, *hacer → hecho*, *morir → muerto*, *poner → puesto*, *romper → roto*, *ver → visto*, *volver → vuelto*, *resolver → resuelto*, *satisfacer → satisfecho*.

## La règle d'accord, en une ligne
- avec ***haber*** : **jamais** d'accord — *Ellas han **llegado***, *Las cartas que he **escrito***.
- avec ***ser*** ou ***estar*** : accord avec le sujet — *La puerta está **cerrada***, *Las casas fueron **construidas***.
- comme **adjectif** : accord avec le nom — *una carta **escrita** a mano.*

> C'est la seule règle du chapitre, mais elle se joue à chaque phrase : ce qui suit *haber* est figé, tout le reste s'accorde.

## Ser + participe ou estar + participe
- *ser* + participe = la **passive d'action**, on assiste au fait : *La casa **fue** construida en 1920* ;
- *estar* + participe = l'**état résultant**, le fait est accompli : *La casa **está** construida.*

L'espagnol emploie d'ailleurs la passive avec *ser* beaucoup moins que le français : il lui préfère la tournure *se* (*Se construyó la casa en 1920*) ou la troisième personne du pluriel (*Construyeron la casa*).

## Les participes doubles
Quelques verbes ont **deux** participes : un régulier pour les temps composés, un irrégulier employé comme adjectif.
- *freír* : *he freído* / *patatas **fritas***
- *imprimir* : *he imprimido* / *un texto **impreso***
- *soltar* : *he soltado* / *un perro **suelto***
- *despertar* : *he despertado* / *está **despierto***`,
          },
          questions: [
            ['Le participe employé avec « haber » s’accorde-t-il ?', ['Jamais', 'Toujours', 'Seulement au féminin', 'Seulement au pluriel'], 0, '*Ellas han llegado*, *las cartas que he escrito*.'],
            ['Quel est le participe passé de « escribir » ?', ['Escrito', 'Escribido', 'Escribado', 'Escripto'], 0, 'Comme *abrir → abierto*, *hacer → hecho*, *ver → visto*.'],
            ['« La puerta está cerrada » comporte un accord.', ['Vrai', 'Faux'], 0, 'Avec *estar*, le participe s’accorde avec le sujet.'],
            ['Quelle différence entre « fue construida » et « está construida » ?', ['La première décrit l’action, la seconde l’état résultant', 'Aucune', 'La première est un futur', 'La seconde est un passé simple'], 0, '*Ser* + participe = passive d’action ; *estar* + participe = état.'],
            ['Quel est le participe passé de « volver » ?', ['Vuelto', 'Volvido', 'Volvido/vuelto', 'Voltado'], 0, 'Comme *resolver → resuelto*, *poner → puesto*.'],
            ['L’espagnol emploie la passive avec « ser » plus souvent que le français.', ['Vrai', 'Faux'], 1, 'Il lui préfère la tournure *se* ou la 3e personne du pluriel.'],
            ['Quel participe emploie-t-on comme adjectif avec « freír » ?', ['Frito (patatas fritas)', 'Freído', 'Freito', 'Fritado'], 0, 'Participe double : *he freído* aux temps composés, *frito* comme adjectif.'],
            ['Quel est le participe passé de « satisfacer » ?', ['Satisfecho', 'Satisfacido', 'Satisfaído', 'Satisfacto'], 0, 'Formé sur *hacer → hecho*.'],
          ],
        },
        {
          titre: 'Les verbes du type « gustar »',
          lecon: {
            titre: 'La construction inversée',
            cours: `*Me gusta el cine* ne veut pas dire « je aime le cinéma » mais « le cinéma me plaît ». Toute la construction se lit à l'envers du français — et si on ne l'a pas comprise, on se trompe à chaque phrase.

## Qui est le sujet ?
Ce n'est pas la personne, c'est la **chose qui plaît**. La personne est un **complément d'objet indirect**, exprimé par *me, te, le, nos, os, les.*

- *Me gusta **el cine***. → sujet : *el cine*, singulier → verbe au singulier.
- *Me gusta**n** **las películas***. → sujet pluriel → verbe au pluriel.

> D'où l'erreur à ne plus faire : « me gusta las películas ». Le verbe s'accorde avec ce qui plaît, jamais avec celui à qui ça plaît.

## Avec un infinitif
Un ou plusieurs infinitifs comptent pour un singulier : *Me gusta **leer***, *Me gusta **leer y escribir**.*

## Le renforcement par « a »
Pour insister ou lever une ambiguïté (*le* peut être *él*, *ella* ou *usted*), on ajoute *a* + pronom tonique : ***A mí me** gusta*, ***A él le** gusta*, ***A Juan le** gusta.* Le pronom complément reste obligatoire, même quand le nom est exprimé.

## Les verbes de la même famille
*encantar* (adorer), *interesar*, *importar*, *molestar*, *doler*, *apetecer*, *hacer falta*, *faltar*, *quedar*, *parecer*, *bastar*, *tocar*, *sobrar*, *convenir*, *costar*.

- *Me **duele** la cabeza* (j'ai mal à la tête)
- *Me **encantan** los perros*
- *No me **importa***
- *Nos **hacen falta** dos sillas*
- *Me **queda** poco dinero*

## Répondre et enchaîner
- accord : *A mí también* (moi aussi, après une affirmation), *A mí tampoco* (moi non plus, après une négation) ;
- désaccord : *A mí sí* (moi si), *A mí no* (moi non).

## Le degré
*Me gusta mucho / muchísimo*, *No me gusta nada*, *Me gusta más el cine que el teatro.* On ne dit pas « me gusta muy ».`,
          },
          questions: [
            ['Dans « Me gustan las películas », quel est le sujet ?', ['Las películas', 'Me', 'Yo', 'Gustan'], 0, 'Le verbe s’accorde avec ce qui plaît, pas avec la personne.'],
            ['Comment traduire « j’aime lire et écrire » ?', ['Me gusta leer y escribir', 'Me gustan leer y escribir', 'Yo gusto leer y escribir', 'Me gusto leer y escribir'], 0, 'Un ou plusieurs infinitifs comptent pour un singulier.'],
            ['« A mí me gusta » est une redondance à éviter.', ['Vrai', 'Faux'], 1, 'C’est la norme : le *a mí* renforce, le pronom *me* reste obligatoire.'],
            ['Comment traduire « j’ai mal à la tête » ?', ['Me duele la cabeza', 'Duelo la cabeza', 'Tengo dolor la cabeza', 'Me duelo la cabeza'], 0, '*Doler* se construit comme *gustar*.'],
            ['Que répondre à « Me gusta el cine » pour dire « moi aussi » ?', ['A mí también', 'A mí tampoco', 'A mí sí', 'Yo también gusto'], 0, '*Tampoco* servirait à répondre à une phrase négative.'],
            ['« Me encantan los perros » est correct.', ['Vrai', 'Faux'], 0, '*Encantar* fonctionne comme *gustar* : accord avec *los perros*.'],
            ['Comment renforcer « le gusta » pour préciser qu’il s’agit de Juan ?', ['A Juan le gusta', 'Juan le gusta', 'Le gusta Juan', 'A Juan gusta'], 0, 'Le pronom *le* se maintient même quand le nom est exprimé.'],
            ['On peut dire « me gusta muy ».', ['Vrai', 'Faux'], 1, 'On dit *me gusta mucho* : *muy* ne modifie jamais un verbe.'],
          ],
        },
        {
          titre: 'L’obligation',
          lecon: {
            titre: 'Tener que, hay que, deber',
            cours: `L'espagnol distingue nettement l'obligation qui s'adresse à **quelqu'un** de celle qui vaut **pour tout le monde**. Choisir la mauvaise, c'est changer le sens de la phrase.

## L'obligation personnelle : tener que
La plus fréquente, la plus forte : ***tener que* + infinitif**. Elle a un sujet, donc elle vise quelqu'un.
*Tengo que estudiar* (je dois étudier), *Tienes que venir*, *Tuvimos que salir.*

## L'obligation impersonnelle : hay que
***Hay que* + infinitif** : personne n'est visé, la règle vaut pour tous. Le verbe reste **invariable** : *Hay que estudiar para aprobar* (il faut étudier). Aux autres temps : *había que*, *habrá que*, *hubo que*.

> C'est la distinction à tenir : *Tengo que trabajar* (moi, je dois) contre *Hay que trabajar* (il faut travailler, en général).

## L'obligation morale : deber
***Deber* + infinitif** exprime le devoir, l'obligation morale, le conseil pressant : *Debes respetar a tus padres*, *No debes fumar.*

Attention à ne pas confondre avec ***deber de* + infinitif***, qui exprime la **probabilité** : *Debe de estar enfermo* (il doit être malade — je suppose). La langue courante les mélange, l'examen non.

## Les autres tournures
- *haber de + infinitif* : obligation atténuée, registre soutenu ou littéraire — *He de irme* ;
- *ser necesario / ser preciso / ser obligatorio que + subjonctif* : *Es necesario que **vengas*** ;
- *hacer falta + infinitif ou que + subjonctif* : *Hace falta **estudiar***, *Hace falta que **estudies*** ;
- l'**impératif** pour l'ordre direct : *¡Estudia!*, *¡No salgas!*

## L'obligation au passé
*Tenía que estudiar* (je devais, c'était prévu) contre *Tuve que estudiar* (j'ai dû, et je l'ai fait). L'imparfait laisse ouvert, le passé simple conclut.`,
          },
          questions: [
            ['Quelle tournure exprime une obligation personnelle ?', ['Tener que + infinitif', 'Hay que + infinitif', 'Soler + infinitif', 'Acabar de + infinitif'], 0, '*Tengo que estudiar* : l’obligation vise quelqu’un.'],
            ['« Hay que » est invariable.', ['Vrai', 'Faux'], 0, 'L’obligation est impersonnelle : aucun sujet, donc aucune variation en personne.'],
            ['Que signifie « Debe de estar enfermo » ?', ['Il doit être malade (supposition)', 'Il doit rester malade', 'Il faut qu’il soit malade', 'Il a dû tomber malade'], 0, '*Deber de* exprime la probabilité, *deber* seul l’obligation morale.'],
            ['Comment traduire « il faut étudier » (en général) ?', ['Hay que estudiar', 'Tengo que estudiar', 'Debo estudiar', 'Es estudiar'], 0, 'L’obligation impersonnelle passe par *hay que*.'],
            ['Après « Es necesario que », le verbe est au subjonctif.', ['Vrai', 'Faux'], 0, '*Es necesario que vengas* : le jugement impersonnel commande le subjonctif.'],
            ['Quelle nuance sépare « tenía que estudiar » et « tuve que estudiar » ?', ['L’imparfait laisse ouvert, le passé simple conclut', 'Aucune', 'Le premier est un futur', 'Le second est impersonnel'], 0, '*Tuve que* dit que l’obligation a été suivie d’effet.'],
            ['« Haber de + infinitif » appartient à un registre soutenu.', ['Vrai', 'Faux'], 0, '*He de irme* : obligation atténuée, plus littéraire que *tengo que*.'],
            ['Comment exprimer un ordre direct ?', ['Par l’impératif : ¡Estudia!', 'Par le gérondif', 'Par l’infinitif seul', 'Par le futur'], 0, 'Et à la forme négative, l’impératif emprunte au subjonctif : *¡No salgas!*'],
          ],
        },
        {
          titre: 'L’habitude',
          lecon: {
            titre: 'Soler, et les tournures de répétition',
            cours: `L'espagnol possède un verbe que le français n'a pas : *soler*, qui dit à lui seul « avoir l'habitude de ». C'est la tournure la plus économique — et la plus valorisée dans une copie.

## Soler + infinitif
*Suelo levantarme temprano* (j'ai l'habitude de me lever tôt). C'est un verbe à **diphtongue** (*o → ue*) : *suelo, sueles, suele, solemos, soléis, suelen.*

Il ne s'emploie qu'au **présent** et à l'**imparfait** : *Solía ir al cine todos los domingos* (j'allais au cinéma tous les dimanches). Jamais au passé simple ni au futur — l'habitude n'est pas un événement.

> Une phrase avec *soler* remplace toute une périphrase française : *suele llover* = « il a l'habitude de pleuvoir », « il pleut d'ordinaire ».

## Acostumbrar a + infinitif
Même sens, registre plus soutenu : *Acostumbra a llegar tarde.* La forme pronominale change de sens : *acostumbrarse a* = **s'habituer à** — *Me he acostumbrado al frío.*

## Tener la costumbre de
Plus lourd mais toujours correct : *Tiene la costumbre de leer antes de dormir.*

## L'imparfait suffit souvent
Sans aucune périphrase, l'imparfait dit déjà l'habitude passée : *Cuando era pequeño, **jugaba** al fútbol.* C'est même son emploi principal.

## Les marqueurs de fréquence
*siempre* (toujours), *a menudo / a veces* (souvent / parfois), *de vez en cuando* (de temps en temps), *cada día / todos los días*, *normalmente, generalmente, por lo general*, *casi nunca*, *nunca.*

Attention à la nuance : *cada día* détaille jour après jour, *todos los días* embrasse l'ensemble.

## Volver a + infinitif
Pour la répétition d'une action ponctuelle, l'espagnol n'a pas de préfixe « re- » productif : il emploie *volver a*. *Volví a llamarlo* (je l'ai rappelé), *No vuelvas a hacerlo* (ne recommence pas).

## Seguir + gérondif
Pour l'action qui continue : *Sigo estudiando español.*`,
          },
          questions: [
            ['Que signifie « Suelo levantarme temprano » ?', ['J’ai l’habitude de me lever tôt', 'Je me lève seul', 'Je viens de me lever', 'Je dois me lever tôt'], 0, '*Soler* + infinitif exprime l’habitude à lui seul.'],
            ['À quels temps « soler » s’emploie-t-il ?', ['Au présent et à l’imparfait', 'À tous les temps', 'Au passé simple seulement', 'Au futur seulement'], 0, 'L’habitude n’est pas un événement daté : ni passé simple, ni futur.'],
            ['« Soler » est un verbe à diphtongue.', ['Vrai', 'Faux'], 0, '*Suelo, sueles, suele… solemos, soléis, suelen.*'],
            ['Comment traduire « je l’ai rappelé » (une seconde fois) ?', ['Volví a llamarlo', 'Rellamé', 'Llamé otra vez lo', 'Vuelvo llamarlo'], 0, '*Volver a* + infinitif remplace le préfixe « re- » du français.'],
            ['« Acostumbrarse a » signifie « avoir l’habitude de ».', ['Vrai', 'Faux'], 1, 'La forme pronominale signifie « s’habituer à ».'],
            ['Quel temps exprime seul l’habitude passée ?', ['L’imparfait', 'Le passé simple', 'Le futur', 'Le conditionnel'], 0, '*Cuando era pequeño, jugaba al fútbol.*'],
            ['« De vez en cuando » signifie…', ['De temps en temps', 'Toujours', 'Jamais', 'Chaque fois'], 0, 'Entre *a menudo* (souvent) et *casi nunca* (presque jamais).'],
            ['« Seguir + gérondif » exprime la continuation d’une action.', ['Vrai', 'Faux'], 0, '*Sigo estudiando español* : je continue d’étudier l’espagnol.'],
          ],
        },
        {
          titre: 'La probabilité',
          lecon: {
            titre: 'Le futur et le conditionnel de supposition',
            cours: `L'espagnol dispose d'un moyen d'exprimer la supposition que le français ne connaît pas : il conjugue le verbe au **futur** ou au **conditionnel** pour parler du présent ou du passé.

## Le futur de probabilité
Un futur qui ne parle pas de l'avenir mais du **présent** supposé :
- *¿Qué hora es? — **Serán** las tres.* (il doit être trois heures)
- ***Estará** enfermo.* (il doit être malade, en ce moment)
- *¿Dónde está Juan? — **Estará** en casa.*

## Le conditionnel de probabilité
Le même mécanisme, décalé d'un cran : il suppose sur le **passé**.
- ***Serían** las tres cuando llegó.* (il devait être trois heures)
- ***Tendría** veinte años entonces.* (il devait avoir vingt ans)

> La règle est mécanique : futur → supposition sur le présent ; conditionnel → supposition sur le passé. Le futur antérieur (*habrá salido*) et le conditionnel passé (*habría salido*) supposent, eux, sur un fait accompli.

## Deber de + infinitif
La tournure explicite : ***Debe de** estar enfermo* (il doit être malade). À ne pas confondre avec *deber* seul, qui exprime l'obligation : *Debe estudiar* (il doit étudier).

## Les adverbes de doute
*quizá(s), tal vez, acaso, posiblemente, probablemente* : ils se construisent avec l'**indicatif** si la probabilité est forte, avec le **subjonctif** si elle est faible.
- *Quizás **viene** mañana* (je le crois assez)
- *Quizás **venga** mañana* (je n'en sais rien)

***A lo mejor***, en revanche, est toujours suivi de l'**indicatif** : *A lo mejor **viene**.* C'est le piège classique.

## Puede que + subjonctif
*Puede que **llueva*** (il se peut qu'il pleuve) : toujours au subjonctif, sans exception.

## Les autres marques
*seguramente, sin duda, a lo mejor, es probable que + subjonctif, parecer que + indicatif* (*Parece que va a llover*).`,
          },
          questions: [
            ['Que signifie « Serán las tres » ?', ['Il doit être trois heures', 'Il sera trois heures', 'Il était trois heures', 'Il faut qu’il soit trois heures'], 0, 'Le futur de probabilité suppose sur le PRÉSENT.'],
            ['Le conditionnel de probabilité porte sur…', ['Le passé', 'Le présent', 'Le futur', 'L’avenir proche'], 0, '*Serían las tres cuando llegó* : il devait être trois heures.'],
            ['« Puede que » est suivi du subjonctif.', ['Vrai', 'Faux'], 0, '*Puede que llueva* — sans exception.'],
            ['Quel mode suit « a lo mejor » ?', ['L’indicatif', 'Le subjonctif', 'L’infinitif', 'Le gérondif'], 0, 'C’est le piège : à la différence de *quizás*, *a lo mejor* garde l’indicatif.'],
            ['« Debe estudiar » et « Debe de estudiar » ont le même sens.', ['Vrai', 'Faux'], 1, 'Le premier exprime l’obligation, le second la supposition.'],
            ['« Quizás venga » plutôt que « quizás viene » signale…', ['Une probabilité plus faible', 'Une certitude', 'Un ordre', 'Un futur proche'], 0, 'Le subjonctif marque la réserve, l’indicatif l’assurance.'],
            ['« Habrá salido » suppose sur un fait accompli.', ['Vrai', 'Faux'], 0, 'Le futur antérieur de probabilité : il a dû sortir.'],
            ['Comment traduire « il devait avoir vingt ans » ?', ['Tendría veinte años', 'Tendrá veinte años', 'Tuvo veinte años', 'Tenía que tener veinte años'], 0, 'Conditionnel de probabilité, pour supposer sur le passé.'],
          ],
        },
        {
          titre: 'Le conseil',
          lecon: {
            titre: 'Conseiller, suggérer, ordonner',
            cours: `Conseiller, c'est doser : entre l'ordre brut et la suggestion polie, l'espagnol offre une échelle complète.

## L'impératif : l'ordre direct
- **affirmatif** : formes propres à *tú* et *vosotros* — *habla, come, vive* / *hablad, comed, vivid* ; les autres personnes empruntent au subjonctif — *hable (usted), hablemos, hablen.*
- **irréguliers de tú** : *decir → di*, *hacer → haz*, *ir → ve*, *poner → pon*, *salir → sal*, *ser → sé*, *tener → ten*, *venir → ven.*
- **négatif** : toujours au **subjonctif** — *no hables, no comas, no salgáis.*

> L'impératif affirmatif soude les pronoms (*dímelo*), le négatif les place devant (*no me lo digas*).

## Le conseil atténué
- ***deberías* + infinitif** : *Deberías descansar* (tu devrais te reposer) — le conditionnel adoucit ;
- ***podrías* + infinitif** : *Podrías llamarle* ;
- ***¿por qué no…?*** : *¿Por qué no vas al médico?* ;
- ***¿y si…?* + indicatif** : *¿Y si salimos esta noche?*

## Le conseil par le subjonctif
Après un verbe de conseil ou de volonté, la subordonnée passe au subjonctif : *Te aconsejo que **vayas** al médico*, *Te recomiendo que **descanses***, *Te sugiero que lo **pienses***.

Si le sujet ne change pas, on emploie l'infinitif : *Te aconsejo **descansar**.*

## L'expression du souhait
*Ojalá + subjonctif* : *Ojalá **apruebes***. Avec l'imparfait du subjonctif, le souhait devient improbable : *Ojalá **pudiera** ayudarte* (si seulement je pouvais).

## Le conseil impersonnel
*Hay que + infinitif* (il faut), *Lo mejor es + infinitif* (le mieux, c'est de), *Es mejor que + subjonctif*, *Conviene + infinitif.*

## Adoucir : les formules de politesse
*¿Te importaría…?*, *¿Podría usted…?*, *Si yo fuera tú…* (si j'étais toi), *Yo que tú…* (à ta place). Ces deux dernières se poursuivent au conditionnel : *Yo que tú, **iría** al médico.*`,
          },
          questions: [
            ['Comment forme-t-on l’impératif négatif ?', ['Avec le subjonctif présent', 'Avec l’impératif affirmatif précédé de no', 'Avec l’infinitif', 'Avec le futur'], 0, '*No hables*, *no comas*, *no salgáis*.'],
            ['Quel est l’impératif de « hacer » à la deuxième personne du singulier ?', ['Haz', 'Hace', 'Haga', 'Haced'], 0, 'Comme *di*, *ve*, *pon*, *sal*, *sé*, *ten*, *ven*.'],
            ['Après « Te aconsejo que », le verbe est au subjonctif.', ['Vrai', 'Faux'], 0, '*Te aconsejo que vayas al médico.*'],
            ['Comment traduire « tu devrais te reposer » ?', ['Deberías descansar', 'Debes descansar', 'Debías descansar', 'Debe de descansar'], 0, 'Le conditionnel atténue l’obligation en conseil.'],
            ['« Ojalá pudiera ayudarte » exprime un souhait réalisable.', ['Vrai', 'Faux'], 1, 'L’imparfait du subjonctif marque au contraire l’improbable.'],
            ['Que signifie « Yo que tú, iría al médico » ?', ['À ta place, j’irais chez le médecin', 'Moi et toi allons chez le médecin', 'Je te vois chez le médecin', 'Je dois aller chez le médecin'], 0, 'La tournure se poursuit au conditionnel.'],
            ['L’impératif affirmatif soude les pronoms au verbe.', ['Vrai', 'Faux'], 0, '*Dímelo* ; au négatif, ils repassent devant : *no me lo digas*.'],
            ['Quel mode suit « ¿Y si… ? » pour suggérer ?', ['L’indicatif', 'Le subjonctif', 'L’impératif', 'Le conditionnel'], 0, '*¿Y si salimos esta noche?*'],
          ],
        },

        // ---- Chapitre 4 du programme : Les temps -----------------------------
        {
          titre: 'Le présent de l’indicatif',
          lecon: {
            titre: 'Trois conjugaisons et les irréguliers qui comptent',
            cours: `Le présent est le temps le plus employé — et celui où se concentrent le plus d'irrégularités. Les connaître, c'est débloquer tous les autres temps qui en dérivent.

## Les trois conjugaisons régulières
- **-ar** (*hablar*) : *hablo, hablas, habla, hablamos, habláis, hablan*
- **-er** (*comer*) : *como, comes, come, comemos, coméis, comen*
- **-ir** (*vivir*) : *vivo, vives, vive, vivimos, vivís, viven*

Les deux dernières ne diffèrent qu'aux formes de *nosotros* et *vosotros*.

## Les irréguliers de la seule première personne
Le reste de la conjugaison est régulier — d'où leur surnom de « verbes à *yo* irrégulier » :
- *hacer → **hago***, *poner → **pongo***, *salir → **salgo***, *valer → **valgo***, *traer → **traigo***, *caer → **caigo*** ;
- *conocer → **conozco***, et tous les verbes en *-cer* et *-cir* (*parecer → parezco*, *conducir → conduzco*) ;
- *ver → **veo***, *saber → **sé***, *dar → **doy***, *caber → **quepo***.

## Les irréguliers du radical
- **diphtongue** *e → ie* : *pensar → pienso* ; *o → ue* : *poder → puedo* ; *u → ue* : *jugar → juego* ;
- **affaiblissement** *e → i* : *pedir → pido.*

Dans les deux cas, *nosotros* et *vosotros* restent réguliers : c'est la conjugaison « en botte ».

## Les cumulards
Certains cumulent les deux irrégularités : *tener → **tengo**, tienes, tiene…* ; *venir → **vengo**, vienes…* ; *decir → **digo**, dices…* ; *oír → **oigo**, oyes, oye…*

## Les totalement irréguliers
*ser* (*soy, eres, es, somos, sois, son*), *ir* (*voy, vas, va, vamos, vais, van*), *haber* (*he, has, ha, hemos, habéis, han*), *estar* (*estoy, estás, está, estamos, estáis, están*).

> *Estar* porte des accents écrits sur cinq formes : ils marquent l'accent tonique sur la terminaison, contrairement à tous les autres verbes.

## Ce que le présent peut dire d'autre
- le **futur proche** : *Mañana **salgo** a las ocho* ;
- le **présent historique** : *En 1492, Colón **llega** a América* ;
- une action commencée dans le passé, avec *desde* ou *hace… que* : *Estudio español **desde hace** dos años.*`,
          },
          questions: [
            ['Quelle est la première personne du présent de « hacer » ?', ['Hago', 'Haco', 'Hazo', 'Hacio'], 0, 'Verbe à *yo* irrégulier : le reste de la conjugaison est régulier.'],
            ['Quelle est la première personne du présent de « conocer » ?', ['Conozco', 'Conoco', 'Conosco', 'Conogo'], 0, 'Comme tous les verbes en -cer et -cir : *parezco*, *conduzco*.'],
            ['« Ser », « ir », « haber » et « estar » sont totalement irréguliers.', ['Vrai', 'Faux'], 0, '*Soy*, *voy*, *he*, *estoy* : aucune ne suit un modèle.'],
            ['Que signifie « Estudio español desde hace dos años » ?', ['J’étudie l’espagnol depuis deux ans', 'J’ai étudié l’espagnol il y a deux ans', 'J’étudierai deux ans', 'J’étudiais depuis deux ans'], 0, 'Le présent couvre l’action commencée dans le passé et qui dure.'],
            ['« Tener » cumule un yo irrégulier et une diphtongue.', ['Vrai', 'Faux'], 0, '*Tengo*, puis *tienes, tiene… tenemos, tenéis, tienen*.'],
            ['Pourquoi « estás » porte-t-il un accent écrit ?', ['L’accent tonique tombe sur la terminaison', 'C’est un pluriel', 'Pour le distinguer de « estas »', 'C’est un subjonctif'], 0, 'Le second motif est vrai aussi, mais la raison première est prosodique.'],
            ['Les verbes en -er et en -ir se conjuguent identiquement au présent, sauf…', ['À nosotros et vosotros', 'À yo et tú', 'À él et ellos', 'Nulle part'], 0, '*Comemos / vivimos*, *coméis / vivís*.'],
            ['Le présent peut exprimer un futur proche.', ['Vrai', 'Faux'], 0, '*Mañana salgo a las ocho.*'],
          ],
        },
        {
          titre: 'Le subjonctif présent',
          lecon: {
            titre: 'La voyelle qui bascule',
            cours: `Le subjonctif espagnol est beaucoup plus vivant que le français : il s'emploie tous les jours, à l'oral comme à l'écrit. Sa formation est en revanche très régulière.

## La formation
On part de la **première personne du présent de l'indicatif**, on retire le *-o*, et on **inverse la voyelle** :
- verbes en **-ar** → terminaisons en **e** : *hablo → **hable, hables, hable, hablemos, habléis, hablen*** ;
- verbes en **-er** et **-ir** → terminaisons en **a** : *como → **coma, comas, coma, comamos, comáis, coman***.

> L'intérêt de partir de *yo* : toutes les irrégularités de la première personne se propagent à tout le subjonctif. *Hago → **haga***, *tengo → **tenga***, *conozco → **conozca***, *digo → **diga***, *salgo → **salga***, *oigo → **oiga***.

## Les six irréguliers
Ceux dont la première personne ne finit pas par *-o* :
*ser → **sea***, *ir → **vaya***, *haber → **haya***, *saber → **sepa***, *dar → **dé***, *estar → **esté***.

## Les verbes du radical
- **diphtongue** : même botte qu'à l'indicatif — *piense, pienses, piense, **pensemos**, **penséis**, piensen* ;
- **affaiblissement** : il touche **toutes** les personnes — *pida, pidas, pida, **pidamos**, **pidáis**, pidan* ;
- les verbes en *-ir* mixtes changent aussi à *nosotros* et *vosotros* : *sentir → sienta, sientas, sienta, **sintamos**, **sintáis**, sientan.*

## Quand l'employer
- **volonté, ordre, souhait** : *Quiero que **vengas***, *Ojalá **llueva*** ;
- **sentiment** : *Me alegro de que **estés** aquí* ;
- **doute et négation d'opinion** : *No creo que **venga*** ;
- **jugement impersonnel** : *Es necesario que **estudies*** ;
- **futur dans une subordonnée de temps** : *Cuando **llegues**, llámame*, *En cuanto **pueda**, te aviso* — c'est le piège majeur du francophone, qui dirait « quand tu arriveras » ;
- **but** : *Te lo digo para que lo **sepas***.
- **impératif négatif** et personnes de politesse : *No **hables***, *¡**Hable** usted!*

## Les conjonctions qui l'exigent toujours
*para que, antes de que, sin que, a menos que, con tal de que, en caso de que.*`,
          },
          questions: [
            ['De quelle forme part-on pour construire le subjonctif présent ?', ['De la première personne du présent de l’indicatif', 'De l’infinitif', 'Du participe passé', 'Du passé simple'], 0, 'On retire le -o et on inverse la voyelle des terminaisons.'],
            ['Quelle voyelle prennent les terminaisons du subjonctif des verbes en -ar ?', ['E (hable, hables…)', 'A', 'I', 'O'], 0, 'Et inversement, les -er et -ir prennent un a : *coma, comas*.'],
            ['Quel est le subjonctif présent de « tener » à la première personne ?', ['Tenga', 'Tena', 'Tienga', 'Tuviera'], 0, 'Il hérite du *yo* irrégulier : *tengo → tenga*.'],
            ['Après « Cuando » suivi d’une valeur de futur, on emploie…', ['Le subjonctif', 'Le futur', 'L’indicatif présent', 'Le conditionnel'], 0, '*Cuando llegues, llámame* — piège majeur du francophone.'],
            ['« Ser », « ir », « haber », « saber », « dar » et « estar » ont un subjonctif irrégulier.', ['Vrai', 'Faux'], 0, '*Sea*, *vaya*, *haya*, *sepa*, *dé*, *esté*.'],
            ['Au subjonctif, l’affaiblissement touche « nosotros » et « vosotros ».', ['Vrai', 'Faux'], 0, '*Pidamos*, *pidáis* — contrairement à la diphtongue.'],
            ['Quelle conjonction est toujours suivie du subjonctif ?', ['Para que', 'Porque', 'Aunque toujours', 'Ya que'], 0, 'Comme *antes de que*, *sin que*, *a menos que*.'],
            ['Quel est le subjonctif présent de « ir » ?', ['Vaya', 'Vaiga', 'Iría', 'Fuera'], 0, 'L’un des six irréguliers dont la 1re personne ne finit pas par -o.'],
          ],
        },
        {
          titre: 'L’imparfait',
          lecon: {
            titre: 'Le temps du décor et de l’habitude',
            cours: `L'imparfait espagnol est le temps le plus régulier de la langue : **trois irréguliers en tout**. Sa difficulté n'est pas la forme, c'est l'emploi.

## La formation
- verbes en **-ar** : *-aba, -abas, -aba, -ábamos, -abais, -aban* — *hablaba* ;
- verbes en **-er** et **-ir** : *-ía, -ías, -ía, -íamos, -íais, -ían* — *comía*, *vivía*.

## Les trois seuls irréguliers
*ser → **era**, eras, era, éramos, erais, eran* ; *ir → **iba**, ibas, iba, íbamos, ibais, iban* ; *ver → **veía**, veías, veía…* (parce qu'il se forme sur l'ancien infinitif *veer*).

> Trois exceptions, pas une de plus : c'est le seul temps espagnol dont on puisse dire cela.

## Ce que l'imparfait fait
- **la description** : il plante le décor, sans début ni fin — *Hacía frío y la calle **estaba** desierta* ;
- **l'habitude passée** : *Cuando era pequeño, **jugaba** al fútbol todos los días* ;
- **l'action en cours** interrompue par une autre : *Llovía cuando **salí*** ;
- **la politesse** : *Quería pedirle un favor* (je voulais vous demander un service).

## L'opposition avec le passé simple
C'est le vrai enjeu du chapitre. Le passé simple **fait avancer** le récit ; l'imparfait **suspend** le temps :
- *Llovía cuando salí de casa* : la pluie était le décor, la sortie est l'événement.
- *Mientras **cenábamos**, **sonó** el teléfono.*

Un même fait peut se dire aux deux temps, et le sens change : *Ayer **llovió*** (il a plu, c'est arrivé) contre *Ayer **llovía*** (il pleuvait, c'était le contexte).

## L'imparfait de politesse et d'hypothèse
Au conditionnel comme à l'imparfait : *¿Qué **quería**?* dans un magasin, ou l'imparfait à valeur de conditionnel dans la langue familière — *Si tuviera dinero, me **compraba** un coche.*

## L'accent écrit
Il se met sur *-íamos*, *-íais* et sur toutes les formes en *-ía*, ainsi que sur *-ábamos* et *éramos*, *íbamos* : il marque la syllabe tonique.`,
          },
          questions: [
            ['Combien de verbes sont irréguliers à l’imparfait ?', ['Trois : ser, ir, ver', 'Aucun', 'Six', 'Dix'], 0, '*Era*, *iba*, *veía* — la seule liste courte de la conjugaison espagnole.'],
            ['Quelle est la terminaison de l’imparfait des verbes en -ar ?', ['-aba', '-ía', '-ió', '-aría'], 0, 'Les -er et -ir font *-ía*.'],
            ['« Cuando era pequeño, jugaba al fútbol » exprime une habitude.', ['Vrai', 'Faux'], 0, 'C’est l’emploi principal de l’imparfait avec la description.'],
            ['Dans « Llovía cuando salí », quel temps fait avancer l’action ?', ['Salí (passé simple)', 'Llovía (imparfait)', 'Les deux', 'Aucun'], 0, 'L’imparfait pose le décor, le passé simple marque l’événement.'],
            ['Quel est l’imparfait de « ver » ?', ['Veía', 'Vía', 'Veaba', 'Vía/vea'], 0, 'Il se forme sur l’ancien infinitif *veer*.'],
            ['« Ayer llovió » et « Ayer llovía » disent exactement la même chose.', ['Vrai', 'Faux'], 1, 'Le premier rapporte un fait, le second décrit un contexte.'],
            ['Que signifie « Quería pedirle un favor » dans une demande polie ?', ['Je voudrais vous demander un service', 'Je voulais et je ne veux plus', 'J’ai demandé un service', 'Je devrai demander un service'], 0, 'L’imparfait de politesse atténue la demande.'],
            ['L’imparfait peut exprimer une action en cours interrompue par une autre.', ['Vrai', 'Faux'], 0, '*Mientras cenábamos, sonó el teléfono.*'],
          ],
        },
        {
          titre: 'Le passé composé',
          lecon: {
            titre: 'El pretérito perfecto : le passé qui touche au présent',
            cours: `Le *pretérito perfecto* ressemble au passé composé français par la forme, mais pas par l'emploi : l'espagnol le réserve à ce qui **touche encore au présent**.

## La formation
*haber* au présent + participe passé : *he, has, ha, hemos, habéis, han* + *hablado, comido, vivido.*

Le participe **ne s'accorde jamais**, et rien ne s'intercale entre l'auxiliaire et lui : *No lo he visto nunca*, jamais « he nunca visto ».

## Quand l'employer
- dans une **période non achevée** : *Hoy **he comido** paella*, *Esta semana **hemos trabajado** mucho*, *Este año **ha llovido** poco* ;
- pour un fait passé dont les **effets durent** : *Me **he roto** la pierna* (et j'ai encore le plâtre) ;
- avec un **bilan de vie** : *Nunca **he estado** en México*, *¿**Has visto** esta película?*

## Les marqueurs qui l'appellent
*hoy, esta mañana, esta semana, este mes, este año, últimamente, ya, todavía no, aún no, nunca, alguna vez, siempre, hace un rato.*

> Le repère le plus sûr : si le marqueur contient *este / esta*, c'est le *pretérito perfecto*. Si c'est *ayer*, *el año pasado*, *en 1990*, c'est le passé simple.

## L'opposition avec le passé simple
- *Hoy **he ido** al cine.* / *Ayer **fui** al cine.*
- *Este año **he viajado** mucho.* / *El año pasado **viajé** mucho.*

Le passé simple coupe le fait du présent ; le passé composé le raccroche.

## La variation géographique
En **Amérique latine** et dans le nord-ouest de l'Espagne (Galice, Asturies), le passé simple absorbe largement le passé composé : *Hoy comí paella* y est parfaitement courant. La norme scolaire française suit l'usage castillan — c'est celui à appliquer en épreuve, mais ce n'est pas une faute là-bas.

## Ya et todavía no
*¿**Ya** has terminado?* (as-tu déjà fini ?) — *No, **todavía no** he terminado.* Ces deux marqueurs appellent presque toujours le passé composé.`,
          },
          questions: [
            ['Comment se forme le pretérito perfecto ?', ['Haber au présent + participe passé', 'Tener + participe passé', 'Ser + participe passé', 'Estar + gérondif'], 0, '*He comido*, *has estudiado*.'],
            ['Quel marqueur appelle le pretérito perfecto ?', ['Hoy', 'Ayer', 'El año pasado', 'En 1990'], 0, 'Comme *esta semana*, *este año*, *ya*, *todavía no*.'],
            ['Le participe passé s’accorde avec le sujet au pretérito perfecto.', ['Vrai', 'Faux'], 1, 'Avec *haber*, jamais d’accord : *ellas han llegado*.'],
            ['« Este año he viajado mucho » est correct.', ['Vrai', 'Faux'], 0, 'La période n’est pas achevée : le passé composé s’impose.'],
            ['Quelle est la différence entre « Hoy he ido al cine » et « Ayer fui al cine » ?', ['Le premier appartient à une période non achevée', 'Aucune', 'Le premier est plus soutenu', 'Le second est un plus-que-parfait'], 0, 'Le passé simple coupe du présent, le passé composé raccroche.'],
            ['En Amérique latine, le passé simple absorbe souvent le passé composé.', ['Vrai', 'Faux'], 0, '*Hoy comí paella* y est courant, sans être une faute.'],
            ['Que peut-on intercaler entre « haber » et le participe ?', ['Rien', 'Un adverbe', 'Une négation', 'Un pronom'], 0, 'Le bloc est soudé : *No lo he visto nunca*.'],
            ['« Nunca he estado en México » est un bilan de vie.', ['Vrai', 'Faux'], 0, 'La période de référence est la vie entière, non achevée.'],
          ],
        },
        {
          titre: 'Le passé simple',
          lecon: {
            titre: 'El pretérito indefinido : le temps du récit',
            cours: `Le passé simple espagnol n'a rien de littéraire : il s'emploie à l'oral, tous les jours. C'est le temps des faits **achevés et coupés du présent**.

## La formation régulière
- verbes en **-ar** : *-é, -aste, -ó, -amos, -asteis, -aron* — *hablé, hablaste, habló…* ;
- verbes en **-er** et **-ir** : *-í, -iste, -ió, -imos, -isteis, -ieron* — *comí, comiste, comió…*

Les accents de la 1re et de la 3e personne du singulier sont **distinctifs** : *hablo* (présent) contre *habló* (passé simple), *hable* (subjonctif) contre *hablé* (passé simple). Les oublier change le temps de la phrase.

## Les prétérits forts
Une famille de verbes très fréquents change de radical **et** de terminaisons : *-e, -iste, -o, -imos, -isteis, -ieron*, **sans accent écrit**.
- *tener → **tuv**e*, *estar → **estuv**e*, *andar → **anduv**e*
- *poder → **pud**e*, *poner → **pus**e*, *saber → **sup**e*, *caber → **cup**e*
- *hacer → **hic**e* (mais *hi**z**o* à la 3e personne)
- *querer → **quis**e*, *venir → **vin**e*, *decir → **dij**e*, *traer → **traj**e*, *conducir → **conduj**e*

> Après un radical en *-j* (*dije*, *traje*, *conduje*), la 3e personne du pluriel perd son *i* : *di**jeron***, *tra**jeron***, jamais « dijieron ».

## Ser et ir : la même forme
*fui, fuiste, fue, fuimos, fuisteis, fueron.* Seul le contexte tranche : *Fui a Madrid* (aller) / *Fui profesor* (être).

## L'affaiblissement aux 3es personnes
Les verbes en *-ir* du type *pedir* et *dormir* changent de voyelle aux deux troisièmes personnes : *pidió, pidieron* ; *durmió, durmieron* ; *sintió, sintieron.*

## Les marqueurs
*ayer, anoche, la semana pasada, el mes pasado, el año pasado, en 1975, hace dos años, entonces, de repente, aquel día.*

## L'emploi dans le récit
C'est lui qui **fait avancer** l'histoire, tandis que l'imparfait décrit : *Era de noche y llovía. De repente, **sonó** el timbre y **abrí** la puerta.*`,
          },
          questions: [
            ['Quelles terminaisons prend le passé simple des verbes en -ar ?', ['-é, -aste, -ó, -amos, -asteis, -aron', '-í, -iste, -ió…', '-aba, -abas…', '-aré, -arás…'], 0, '*Hablé, hablaste, habló, hablamos, hablasteis, hablaron.*'],
            ['« Hablo » et « habló » se distinguent uniquement par l’accent.', ['Vrai', 'Faux'], 0, 'L’un est un présent, l’autre un passé simple : l’accent est distinctif.'],
            ['Quel est le passé simple de « tener » à la première personne ?', ['Tuve', 'Tení', 'Tuvé', 'Tenió'], 0, 'Prétérit fort : radical *tuv-* et terminaisons sans accent.'],
            ['Quelle est la troisième personne du pluriel de « decir » au passé simple ?', ['Dijeron', 'Dijieron', 'Decieron', 'Digieron'], 0, 'Après un radical en -j, le i de la terminaison disparaît.'],
            ['« Ser » et « ir » ont la même forme au passé simple.', ['Vrai', 'Faux'], 0, '*Fui, fuiste, fue…* : seul le contexte permet de trancher.'],
            ['Quel marqueur appelle le passé simple ?', ['Ayer', 'Hoy', 'Esta semana', 'Todavía no'], 0, 'Comme *anoche*, *el año pasado*, *en 1975*.'],
            ['Quelle est la troisième personne de « dormir » au passé simple ?', ['Durmió', 'Dormió', 'Duermió', 'Durmó'], 0, 'Les verbes en -ir portent l’affaiblissement aux deux 3es personnes.'],
            ['Dans un récit, le passé simple fait avancer l’action.', ['Vrai', 'Faux'], 0, 'L’imparfait, lui, décrit le cadre : *Era de noche… De repente, sonó el timbre.*'],
          ],
        },
        {
          titre: 'Le futur',
          lecon: {
            titre: 'Futur simple, futur proche, et le conditionnel qui en dérive',
            cours: `Le futur espagnol se construit sur l'**infinitif entier** — ce qui le rend très régulier, et fait que ses douze irréguliers se retiennent d'un bloc.

## La formation
Infinitif + *-é, -ás, -á, -emos, -éis, -án*, pour les trois conjugaisons :
*hablar**é**, hablar**ás**, hablar**á**, hablar**emos**, hablar**éis**, hablar**án***.

Toutes les formes portent un accent écrit sauf *nosotros*.

## Les douze irréguliers
Ils modifient le radical, jamais les terminaisons. Trois familles :
- **le e de l'infinitif tombe** : *poder → **podr**é*, *querer → **querr**é*, *saber → **sabr**é*, *haber → **habr**é*, *caber → **cabr**é* ;
- **un d remplace la voyelle** : *tener → **tendr**é*, *poner → **pondr**é*, *venir → **vendr**é*, *salir → **saldr**é*, *valer → **valdr**é* ;
- **radical raccourci** : *hacer → **har**é*, *decir → **dir**é*.

> Les composés suivent : *deshacer → desharé*, *mantener → mantendré*, *componer → compondré*.

## Le conditionnel, même radical
Il prend les terminaisons de l'imparfait des verbes en *-er* : *-ía, -ías, -ía, -íamos, -íais, -ían*, sur le **même radical** que le futur. *Hablaría*, *podría*, *tendría*, *haría*, *diría.* Apprendre les irréguliers du futur, c'est apprendre ceux du conditionnel.

## Le futur proche : ir a + infinitif
Beaucoup plus fréquent à l'oral que le futur simple : *Voy a estudiar*, *Vamos a salir.* Il exprime l'intention ou l'imminence.

## Les autres valeurs du futur
- **la probabilité sur le présent** : *Serán las tres* (il doit être trois heures) ;
- **l'ordre atténué** : *No matarás* ;
- **la concession** : *Será muy inteligente, pero no lo parece.*

## Le futur ne s'emploie PAS après « cuando »
C'est le piège le plus coûteux du chapitre. Dans une subordonnée de temps à valeur de futur, l'espagnol met le **subjonctif présent** : *Cuando **llegues**, llámame*, *En cuanto **pueda**, te aviso*, *Mientras **estés** aquí…* Le français dirait « quand tu arriveras ».

## Le futur antérieur
*habré + participe* : *Mañana a las ocho ya **habré terminado**.* Il sert aussi à supposer sur un fait accompli : *Ya **habrá salido*** (il a dû sortir).`,
          },
          questions: [
            ['Sur quoi se construit le futur simple espagnol ?', ['Sur l’infinitif entier', 'Sur le radical du présent', 'Sur le participe passé', 'Sur le passé simple'], 0, '*Hablaré*, *comeré*, *viviré* : mêmes terminaisons pour les trois groupes.'],
            ['Quel est le futur de « tener » à la première personne ?', ['Tendré', 'Teneré', 'Tenré', 'Tendría'], 0, 'Un d remplace la voyelle, comme dans *pondré*, *vendré*, *saldré*.'],
            ['Le conditionnel se forme sur le même radical que le futur.', ['Vrai', 'Faux'], 0, 'Avec les terminaisons de l’imparfait en -ía : *tendría*, *haría*, *diría*.'],
            ['Que met-on après « cuando » avec une valeur de futur ?', ['Le subjonctif présent', 'Le futur simple', 'L’indicatif présent', 'Le conditionnel'], 0, '*Cuando llegues, llámame* — jamais « cuando llegarás ».'],
            ['Quel est le futur de « hacer » ?', ['Haré', 'Haceré', 'Hará', 'Hicé'], 0, 'Radical raccourci, comme *decir → diré*.'],
            ['« Serán las tres » exprime une probabilité sur le présent.', ['Vrai', 'Faux'], 0, 'Le futur de supposition : il doit être trois heures.'],
            ['Quelle forme du futur ne porte pas d’accent écrit ?', ['Nosotros (hablaremos)', 'Yo', 'Tú', 'Ellos'], 0, 'Toutes les autres en portent un : *hablaré, hablarás, hablará, hablaréis, hablarán*.'],
            ['« Ir a + infinitif » exprime l’intention ou l’imminence.', ['Vrai', 'Faux'], 0, '*Voy a estudiar* : le futur proche, très employé à l’oral.'],
          ],
        },
      ],
    },
  ],
}
