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
            cours: `L’espagnol pose ses questions autrement que le français : pas d’inversion obligatoire, pas de « est-ce que » — mais deux signes et des accents qui ne sont **jamais** facultatifs.

## Les deux points d’interrogation
Toute question s’ouvre par **¿ et se ferme par ?** : *¿Cómo te llamas?*

> Le signe ouvrant ne se met pas forcément en début de phrase, mais au début de la **partie interrogée** : *Si no vienes, ¿qué hago?* L’oublier est une faute comptée.

## L’interrogation totale
Celle à laquelle on répond par oui ou non. Aucun outil particulier : seule l’intonation change.

| Ordre des mots | Exemple |
| Comme une déclarative | *¿Tú hablas español?* |
| Sans pronom sujet | *¿Hablas español?* |
| Sujet après le verbe | *¿Viene Juan mañana?* |

## Les mots interrogatifs
Ils portent **tous** un accent écrit : *qué, quién, quiénes, cuál, cuáles, cómo, cuándo, dónde, adónde, cuánto, cuánta, cuántos, cuántas, por qué*.

| Avec accent | Sans accent |
| *¿Dónde vives?* — interrogatif | *La casa donde vivo* — relatif |
| *¿Qué quieres?* | *El libro que leo* |

L’accent est **ce qui distingue** l’interrogatif du relatif : ce n’est pas un ornement.

## Qué ou cuál
| Mot | Ce qu’il demande | Exemple |
| **qué** | La nature, la définition | *¿Qué es esto?* · *¿Qué libro quieres?* |
| **cuál / cuáles** | Un **choix** dans un ensemble | *¿Cuál prefieres?* · *¿Cuál es tu color favorito?* |

> Devant un **nom**, l’espagnol préfère presque toujours *qué* : on dit *¿Qué día es hoy?*, pas *¿Cuál día?*

## Les quatre « porque »
| Forme | Nature | Exemple |
| **por qué** | La question | *¿Por qué lloras?* |
| **porque** | La réponse | *Porque estoy triste.* |
| **el porqué** | Un nom masculin : la raison | *No entiendo el porqué.* |
| **por que** | Préposition + relatif, rare | *La razón por que lo hizo.* |

## L’interrogation indirecte
Elle garde l’**accent** du mot interrogatif, mais perd les signes ¿ ? : *No sé dónde está*, *Pregunta cuánto cuesta*.

C’est l’erreur classique : l’accent reste, **même sans point d’interrogation**.`,
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
            cours: `La négation espagnole est plus simple que la française — un seul mot au lieu de « ne… pas ». Mais elle a une règle que le français ne connaît pas : la **double négation** est obligatoire.

## Le no
Il se place **juste devant le verbe**, et rien ne s’intercale sauf les pronoms compléments : *No hablo español*, *No te lo digo*.

## La double négation
Quand un mot négatif suit le verbe, le *no* est **obligatoire** devant lui.

| Faux | Juste |
| *Veo nada* | *No veo nada* |
| *Viene nadie* | *No viene nadie* |
| *Lo hago nunca* | *No lo hago nunca* |

> Deux négations ne s’annulent pas en espagnol : elles se **renforcent**. C’est le contraire de la logique mathématique — et c’est la règle.

## Le mot négatif avant le verbe
S’il passe devant, le *no* **disparaît**. Les deux tournures sont correctes et équivalentes.

| Avec *no* | Sans *no* |
| *No viene nadie* | *Nadie viene* |
| *No lo hago nunca* | *Nunca lo hago* |
| *No me gusta tampoco* | *Tampoco me gusta* |

## Les mots à connaître
| Mot | Sens | Remarque |
| *nada* | Rien | |
| *nadie* | Personne | |
| *ninguno / a* | Aucun | Apocopé en *ningún* devant un masculin singulier |
| *nunca / jamás* | Jamais | *jamás* est plus emphatique |
| *tampoco* | Non plus | |
| *ni… ni* | Ni… ni | |
| *ya no* | Ne… plus | |
| *todavía no / aún no* | Pas encore | |

## Sino ou pero
| Mot | Ce qu’il fait | Exemple |
| **sino** | **Rectifie** après une négation | *No es francés sino español* |
| **sino que** | Idem, devant un verbe conjugué | *No canta sino que grita* |
| **pero** | **Oppose** sans rectifier | *No es rico pero es feliz* |`,
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
            cours: `Une relative complète un nom. En espagnol, ce qui compte n’est pas seulement le **pronom choisi, mais le type de relative — car il commande la ponctuation et parfois le mode** du verbe.

## Les deux relatives
| | **Déterminative** | **Explicative** |
| Ce qu’elle fait | Elle **restreint** l’antécédent | Elle **ajoute** une information |
| Virgules | Aucune | Encadrée de virgules |
| Pronom | *que* | *que*, ou *quien* pour une personne |
| Exemple | *Los alumnos que estudian aprueban* — seuls ceux-là | *Los alumnos, que estudian, aprueban* — tous |

> Changer la virgule change **le sens de la phrase**. Ce n’est pas un détail typographique : c’est une information.

## Le mode dans la relative
Voilà le point que le français ne prépare pas.

| L’antécédent est… | Le verbe est à… | Exemple |
| Connu, réel | L’**indicatif** | *Busco a la secretaria que habla inglés* — je la connais |
| Indéfini, encore à trouver | Le **subjonctif** | *Busco una secretaria que hable inglés* — n’importe laquelle |
| Nié | Le **subjonctif** | *No conozco a nadie que sepa ruso* |

## La préposition ne se déplace pas
L’espagnol ne rejette **jamais** la préposition à la fin : elle précède toujours le relatif.

| Faux | Juste |
| *La casa que vivo en* | *La casa en la que vivo* |
| *El chico que hablo de* | *El chico del que hablo* |

## L’antécédent implicite
| Forme | Ce qu’elle reprend | Exemple |
| *el que, la que, los que, las que* | Une personne ou une chose | *El que quiera, que venga* |
| *quien* | Une personne | *Quien mucho abarca, poco aprieta* |
| **lo que** | Une **idée entière** | *Llegó tarde, lo que me molestó* |

Une phrase entière ne se reprend jamais par *el que* : toujours par le neutre *lo que*.`,
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
            cours: `La complétive est la subordonnée introduite par *que* qui complète le verbe principal. Tout s’y joue sur une seule question : **indicatif ou subjonctif ?**

## La règle en un tableau
| Le verbe principal exprime… | Mode | Exemples |
| Une **déclaration** | Indicatif | *Digo que viene* |
| Une **perception** | Indicatif | *Veo que está cansado* |
| Une **opinion** affirmée | Indicatif | *Creo que tiene razón* |
| Une **certitude** | Indicatif | *Es verdad que llueve* |
| Une **volonté**, un ordre, un souhait | **Subjonctif** | *Quiero que vengas* · *Ojalá llueva* |
| Un **sentiment** | **Subjonctif** | *Me alegro de que estés aquí* |
| Un **doute, une certitude niée** | **Subjonctif** | *Dudo que sea verdad* · *No creo que venga* |
| Un **jugement impersonnel** | **Subjonctif** | *Es necesario que estudies* |

> La bascule la plus rentable au bac : *creo que viene* (indicatif) mais *no creo que venga* (subjonctif). **Nier la certitude fait changer de mode** — le verbe n’a pas changé, sa polarité si.

## L’infinitif quand le sujet ne change pas
| Sujet | Construction | Exemple |
| **Le même** | Infinitif, sans *que* | *Quiero venir* |
| **Différent** | *que* + subjonctif | *Quiero que vengas* |

C’est l’un des rares points où le français fait exactement pareil.

## Le que ne se supprime pas
Là où le français peut l’alléger, l’espagnol garde toujours *que* : *Espero que me llames*.

## Le décalage au passé
Quand le verbe principal passe au passé, le subjonctif présent devient **imparfait du subjonctif**.

| Au présent | Au passé |
| *Quiero que vengas* | *Quería que vinieras* (ou *vinieses*) |
| *Es necesario que estudies* | *Era necesario que estudiaras* |

Les deux formes, en *-ra* et en *-se*, sont **équivalentes**.`,
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
            cours: `Le genre espagnol ne recopie pas le genre français : *la sangre* est féminin, *el color* masculin. Se fier au français coûte cher, à l’écrit comme à l’oral.

## Les repères de genre
| Genre | Terminaisons | Exemples |
| **Masculin** | -o | *el libro* |
| Masculin | -or, -aje | *el amor*, *el viaje* |
| Masculin | **-ma** d’origine grecque | *el problema, el tema, el idioma, el sistema, el clima* |
| **Féminin** | -a | *la casa* |
| Féminin | -ción, -sión | *la canción* |
| Féminin | -dad, -tad, -tud | *la ciudad, la libertad, la juventud* |
| Féminin | -umbre, -ez | *la costumbre, la vejez* |

## Les pièges du francophone
| Féminin en espagnol, masculin en français | Masculin en espagnol, féminin en français |
| *la sangre* (le sang) | *el color* (la couleur) |
| *la leche* (le lait) | *el árbol* (l’arbre) |
| *la sal* (le sel) | *el viaje* (le voyage) |
| *la nariz* (le nez) | *el análisis* (l’analyse) |
| *la miel*, *la costumbre* | *el minuto*, *el puente* |

Aucune règle ne les couvre : il faut les apprendre **avec leur article**.

## Le féminin des noms de personnes
| Cas | Règle | Exemple |
| Nom en -o | -o devient -a | *el niño / la niña* |
| Nom en -or, -ón, -és | On ajoute -a | *profesor / profesora*, *francés / francesa* |
| Invariables | Seul l’article change | *el / la estudiante*, *el / la periodista*, *el / la artista* |

## Le pluriel
| Le mot se termine par… | On ajoute | Exemple |
| Une voyelle non accentuée | **-s** | *casa → casas* |
| Une consonne ou une voyelle accentuée | **-es** | *papel → papeles*, *rubí → rubíes* |
| **-z** | **-ces** | *lápiz → lápices*, *vez → veces* |
| **-s** non accentué sur la dernière syllabe | Rien : invariable | *el lunes / los lunes*, *la crisis / las crisis* |

> L’accent écrit suit la **prononciation**, pas l’orthographe : *el examen → los exámenes* — l’accent apparaît ; *la canción → las canciones* — il disparaît.`,
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
            cours: `L’espagnol a un article de **plus que le français : le neutre** *lo*. Et son article défini réserve une surprise devant certains noms féminins.

## Les formes
| Type | Masculin | Féminin |
| **Défini** singulier | *el* | *la* |
| Défini pluriel | *los* | *las* |
| **Indéfini** singulier | *un* | *una* |
| Indéfini pluriel | *unos* | *unas* |

Au pluriel, *unos / unas* signifie « quelques » : *unos amigos*.

## Les contractions
Deux, et deux seulement.

| Contraction | Exemple | L’exception |
| a + el = **al** | *Voy al cine* | Pas devant un nom propre : *Voy a El Escorial* |
| de + el = **del** | *La casa del profesor* | Idem |

## El devant un féminin
Un nom **féminin singulier** commençant par un *a-* ou *ha-* tonique prend *el* — et *un*, pas *una*.

| Avec *el / un* | Le nom reste féminin | Au pluriel |
| *el agua* | *el agua fría* | *las aguas* |
| *el águila*, *un águila* | *el águila blanca* | *las águilas* |
| *el hambre*, *el aula*, *el alma* | | *las aulas* |

> Le test est l’**accent tonique**, pas la lettre : *la avenida*, *la harina* — l’accent n’y est pas sur le *a*, donc la règle ne s’applique pas.

## Le neutre lo
Il ne précède **jamais** un nom, mais un adjectif, un adverbe ou un relatif.

| Structure | Ce qu’elle exprime | Exemple |
| *lo* + adjectif | Une qualité abstraite | *lo importante*, *lo mejor*, *lo difícil* |
| *lo que* | « Ce que » | *No entiendo lo que dices* |
| *lo* + adjectif + *que* | L’intensité | *No sabes lo cansado que estoy* |

## Quand l’article disparaît
| Cas | Sans article | Avec article |
| Profession, nationalité, religion en attribut | *Es profesor* | *Es un profesor excelente* |
| Devant *otro* | *otro día* | Jamais « un otro día » |`,
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
            cours: `Là où le français n’a qu’un démonstratif — *ce… -ci / -là* —, l’espagnol en a **trois**, calés sur trois distances : dans l’espace, dans le temps, ou dans le discours.

## Les trois séries
| Distance | Masculin sing. | Féminin sing. | Pluriels | Adverbe |
| **Près de moi** | *este* | *esta* | *estos, estas* | *aquí* |
| **Près de toi** | *ese* | *esa* | *esos, esas* | *ahí* |
| **Loin de nous deux** | *aquel* | *aquella* | *aquellos, aquellas* | *allí* |

Une seule irrégularité à retenir : le masculin singulier de la troisième série est *aquel*, **sans -o**.

## La distance n’est pas seulement spatiale
| Domaine | *este* | *ese* | *aquel* |
| Espace | Ici | Là, près de toi | Là-bas |
| Temps | *este año* | *ese año* | *aquellos tiempos* |
| Discours | Ce qu’on vient de dire | Ce dont on parlait | Le plus éloigné dans le texte |

## Adjectif ou pronom, même forme
*Este libro es mío* (adjectif) · *Este es mío* (pronom).

> Depuis la réforme de la RAE (2010), le pronom **ne prend plus d’accent écrit** : on écrit *este*, *ese*, *aquel*, comme l’adjectif. Beaucoup de manuels anciens écrivent encore *éste* — ce n’est plus la norme, mais ce n’est pas compté faux.

## Les neutres
| Neutre | Ce qu’il reprend |
| *esto* | Une chose non identifiée, proche |
| *eso* | Une idée, ce qui vient d’être dit |
| *aquello* | Un souvenir, du lointain |

Ils sont **invariables, sans accent, et jamais suivis d’un nom**.

*¿Qué es esto?* · *Eso no es verdad.* · *Todo aquello me pareció extraño.*

> Une **phrase entière** ne se reprend jamais par *este* ou *ese*, toujours par un neutre : *No vino, y eso me molestó.*

## Deux tournures utiles
*en aquel entonces* (à cette époque-là) · *ni esto ni aquello* (ni l’un ni l’autre).`,
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
            cours: `L’adjectif espagnol s’accorde comme en français, mais sa **place obéit à une logique que le français ne connaît pas — et qui peut changer le sens** du mot.

## L’accord
| Type d’adjectif | Formes | Exemple |
| En **-o** | Quatre | *alto, alta, altos, altas* |
| En **-e** ou consonne | Invariable en genre | *un chico inteligente / una chica inteligente* |
| Nationalité, ou en -or, -ón, -ín | Il forme un féminin | *español / española*, *trabajador / trabajadora* |

Avec **plusieurs noms dont l’un est masculin : accord au masculin pluriel** — *un chico y una chica simpáticos*.

## La place
| Position | Ce qu’elle exprime | Exemples |
| **Après** le nom (par défaut) | Elle **classe**, elle distingue objectivement | *un coche rojo*, *la lengua española*, *un problema difícil* |
| **Avant** le nom | Le regard de celui qui parle : appréciation, qualité attendue | *la blanca nieve*, *un buen amigo*, *mi querida madre* |

Les adjectifs de couleur, de forme, de nationalité et de religion restent **toujours** après le nom.

## Les changements de sens
> Ce n’est pas une nuance décorative : certains adjectifs **changent de sens** selon leur place. C’est le point le plus rentable de la fiche.

| Devant le nom | Après le nom |
| *un gran hombre* — un grand homme | *un hombre grande* — de grande taille |
| *un pobre hombre* — à plaindre | *un hombre pobre* — sans argent |
| *un viejo amigo* — de longue date | *un amigo viejo* — âgé |
| *diferentes libros* — plusieurs | *libros diferentes* — dissemblables |
| *un cierto encanto* — un certain | *un hecho cierto* — avéré |

## L’apocope
Certains adjectifs perdent leur finale devant le nom : *bueno → buen día*, *malo → mal tiempo*, *grande → gran casa*.`,
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
            cours: `L’espagnol exprime **rarement** le pronom sujet : la terminaison du verbe suffit à identifier la personne. L’employer sans raison sonne lourd, voire insistant.

## Les formes
*yo, tú, él / ella / usted, nosotros / nosotras, vosotros / vosotras, ellos / ellas / ustedes.*

## Pourquoi on les omet
*Hablo* dit déjà « je parle ». On n’exprime le pronom que dans trois cas.

| Raison | Exemple |
| **Insister** | *Yo no lo he dicho* — moi, je ne l’ai pas dit |
| **Opposer** | *Tú trabajas y él duerme* |
| **Lever une ambiguïté** | *hablaba* peut être *yo*, *él*, *ella* ou *usted* |

## Le vouvoiement
| Forme | Nombre | Personne du verbe |
| *usted* (Ud.) | Singulier | **3e** : *¿Usted habla español?* |
| *ustedes* (Uds.) | Pluriel | **3e** : *¿Ustedes quieren café?* |

> C’est l’erreur la plus fréquente du francophone, qui les traite comme un « vous » de 2e personne. *Usted* vient de *vuestra merced* — « votre grâce » : d’où la 3e personne, comme un « Monsieur souhaite-t-il… ? ».

## Les variantes du monde hispanophone
| Zone | Ce qui change |
| **Amérique latine** | *vosotros* n’existe pas : le pluriel familier est *ustedes*, même entre amis |
| **Argentine, Uruguay, Paraguay, Amérique centrale** | Le *voseo* : *vos* remplace *tú*, avec ses formes propres — *vos tenés*, *vos sos*, *vos hablás* |

Ce ne sont pas des fautes, mais des **normes régionales**.

## Après une préposition
| Préposition | Forme du pronom | Exemple |
| Cas général | *mí, ti*, puis *él, ella…* | *Para mí*, *sin ti* |
| Avec *con* | Soudure irrégulière | *conmigo*, *contigo* |
| *entre, según, excepto, salvo, incluso* | On garde *yo* et *tú* | *entre tú y yo*, *según tú* |`,
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
            cours: `C’est le point de grammaire qui distingue le plus nettement une copie sûre d’une copie approximative : le **placement** des pronoms compléments.

## Les deux séries
| Personne | COD | COI |
| 1re sing. | *me* | *me* |
| 2e sing. | *te* | *te* |
| **3e sing.** | *lo / la* | *le* |
| 1re plur. | *nos* | *nos* |
| 2e plur. | *os* | *os* |
| **3e plur.** | *los / las* | *les* |

Elles ne diffèrent **qu’à la 3e personne** : *La veo* (je la vois, COD) contre *Le hablo* (je lui parle, COI).

## La place : proclise ou enclise
| Le verbe est… | Le pronom se place… | Exemple |
| Conjugué | **Devant**, séparé | *Te lo digo* · *No me lo dijo* |
| À l’**infinitif** | Soudé derrière | *dármelo* |
| Au **gérondif** | Soudé derrière | *diciéndotelo* |
| À l’impératif **affirmatif** | Soudé derrière | *dámelo* |
| À l’impératif **négatif** | Devant | *No me lo des* |
| Conjugué + infinitif | Les deux sont admis | *Te lo voy a decir* = *Voy a decírtelo* |

> L’enclise ajoute souvent un **accent écrit**, pour garder la syllabe tonique d’origine : *da* devient *dámelo*, *decir* devient *decírtelo*.

## L’ordre : COI avant COD
Toujours, et sans exception : *Me lo da* (il me le donne), *Te la doy*.

## Le « le » qui devient « se »
Quand *le* ou *les* rencontre *lo, la, los, las*, il se change en **se**.

| Impossible | Correct |
| *le lo doy* | *Se lo doy* — je le lui donne |
| *les las digo* | *Se las digo* |

Pure question d’euphonie — mais faute lourde si on l’ignore.

## Le redoublement
L’espagnol **répète** très souvent le COI par un pronom, même quand le complément est exprimé : *Le doy el libro a Juan*, *A mí me gusta*. Loin d’être une lourdeur, c’est la norme.

## Le leísmo
En Castille, *le* s’emploie couramment comme COD pour une **personne masculine** : *Le vi* pour *Lo vi*. La RAE le tolère à ce seul cas ; ailleurs, on s’en tient à *lo*.`,
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
            cours: `L’espagnol distingue **deux séries** de possessifs — l’une avant le nom, l’autre après — là où le français n’en a qu’une.

## Les deux séries
| | Atones (devant le nom) | Toniques (après, ou seuls) |
| 1re sing. | *mi(s)* | *mío / a(s)* |
| 2e sing. | *tu(s)* | *tuyo / a(s)* |
| 3e sing. | *su(s)* | *suyo / a(s)* |
| 1re plur. | *nuestro / a(s)* | *nuestro / a(s)* |
| 2e plur. | *vuestro / a(s)* | *vuestro / a(s)* |
| 3e plur. | *su(s)* | *suyo / a(s)* |

Elles s’accordent avec **ce qui est possédé**, pas avec le possesseur : *mis libros*, *nuestra casa*. Seuls *nuestro* et *vuestro* varient en genre.

## Les trois emplois de la forme tonique
| Emploi | Exemple |
| Après le nom, pour insister | *un amigo mío* — un ami à moi |
| Comme attribut | *Este libro es mío* |
| Avec l’article, comme pronom | *El mío es más grande* |

## Le problème de « su »
*Su* peut signifier **son, sa, leur, votre** (de *usted*) : quatre possesseurs pour une seule forme.

| Ambigu | Levé par *de* |
| *su casa* | *la casa de él* · *la casa de ella* · *la casa de usted* |

## Le corps et les vêtements : pas de possessif
C’est la différence la plus visible avec le français. Quand la possession est évidente, l’espagnol emploie **l’article défini**.

| En français | En espagnol |
| Je me lave **les** mains | *Me lavo las manos* |
| Il a mal à **la** tête | *Le duele la cabeza* |
| Il enleva **son** manteau | *Se quitó el abrigo* |

> Dire *mis manos* pour « mes mains » n’est pas faux, mais sonne étrange : le pronom réfléchi porte **déjà** l’information de possession.

## Le vocatif
Après un nom en apostrophe, le possessif tonique suit : *¡Hijo mío!*, *¡Madre mía!*`,
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
            cours: `Un seul pronom relatif couvre l’essentiel — *que* — mais les autres se placent exactement là où une copie se distingue.

## Le tableau des relatifs
| Pronom | Ce qu’il reprend | Quand l’employer |
| **que** | Personnes et choses | Le cas général, sujet ou complément |
| **quien / quienes** | **Personnes seulement** | Après préposition, ou en relative explicative |
| **el que, la que, los que, las que** | Tout | Quand il faut marquer le genre et le nombre |
| **el cual, la cual…** | Tout | Registre soutenu, après préposition longue |
| **cuyo / a / os / as** | Un possesseur | Le « dont » de possession |
| **lo que, lo cual** | Une **idée entière** | Jamais un nom |
| **donde, cuando, como** | Lieu, temps, manière | Sans accent |

## Que
Invariable, le plus fréquent : *El libro que leo*, *La chica que vino*. Après une préposition, on lui adjoint l’article : *el libro del que te hablé*, *la casa en la que vivo*.

## Quien
Jamais en relative déterminative sans préposition. Trois emplois : après préposition (*la persona con quien hablo*), en relative explicative (*Mi hermano, quien vive en Madrid, es médico*), sans antécédent (*Quien mucho abarca, poco aprieta*).

## Cuyo : le « dont » possessif
Il s’accorde avec **ce qui est possédé**, jamais avec le possesseur.

| Exemple | Ce qui commande l’accord |
| *El escritor cuya novela leí* | *novela*, féminin |
| *La casa cuyos muros son blancos* | *muros*, masculin pluriel |

> Deux règles absolues : *cuyo* n’est **jamais** suivi d’un article — « cuyo el libro » n’existe pas ; et il ne s’emploie **jamais** en question — on dit *¿De quién es?*, pas « ¿Cuyo es? ».

## Lo que, lo cual
Pour reprendre une **idée entière** : *Llegó tarde, lo que me molestó*. Reprendre une phrase par *el que* est une faute.`,
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
            cours: `Les indéfinis désignent sans identifier. Ils vont par **paires** — un positif, un négatif — et quelques-uns réservent des surprises.

## Les paires
| Ce qu’ils désignent | Positif | Négatif | Variable ? |
| Une personne | *alguien* | *nadie* | Invariables, toujours singuliers |
| Une chose | *algo* | *nada* | Invariables |
| Un élément d’un ensemble | *alguno* | *ninguno* | Accordés et **apocopés** |

Avec un COD personne, la préposition *a* est obligatoire : *No veo a nadie*.

## Alguno et ninguno
| Position | Forme | Exemple |
| Devant un masculin singulier | Apocopée | *algún libro*, *ningún problema* |
| Devant un féminin | Complète | *alguna casa*, *ninguna duda* |
| Comme pronom | Complète | *alguno de ellos* |

> Placé **après** le nom, *alguno* prend un sens **négatif renforcé** : *No tengo duda alguna* = je n’ai aucun doute. La place inverse le sens.

*Ninguno* s’emploie presque toujours au singulier : *ningún amigo vino*, jamais « ningunos ».

## Cada et cualquiera
| Mot | Sa règle | Exemple |
| **cada** | Invariable, jamais de pluriel | *cada día*, *cada dos horas* |
| *cada uno / una* | « Chacun » | *cada uno lo sabe* |
| **cualquiera** | Apocopé en *cualquier* devant un nom, masculin **ou** féminin | *cualquier día*, *cualquier mujer* |
| *cualquiera* seul | Garde le -a | *Cualquiera puede hacerlo* |

*Cada día* détaille, *todos los días* insiste sur l’ensemble : ce n’est pas la même chose.

## Todo
S’accorde, et **exige l’article** : *todo el día*, *toda la noche*, *todos los alumnos*. « Todos días » est une faute.

## Les autres à connaître
*otro* (autre — sans article indéfini : *otro día*), *varios*, *mucho / poco* (accordés), *demasiado*, *bastante*, *los demás* (les autres, le reste), *mismo*, *tal*, *ambos* (tous les deux).`,
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

## Les trois comparatifs
| Relation | Structure | Exemple |
| **Supériorité** | *más… que* | *Es más alto que yo* |
| **Infériorité** | *menos… que* | *Tengo menos dinero que tú* |
| **Égalité** — adjectif ou adverbe | *tan… como* | *Es tan alto como tú* |
| **Égalité** — nom | *tanto / a / os / as… como* | *Tengo tantos libros como tú* |
| **Égalité** — verbe | *tanto como* | *Trabaja tanto como yo* |

> La règle en une ligne : **tan** devant un mot qui **qualifie**, **tanto** devant un mot qui se **compte** — ou après un verbe.

## Que ou de devant un nombre
| Structure | Sens | Exemple |
| *más de* + chiffre | Plus de | *Tengo más de veinte libros* |
| *no… más que* + chiffre | **Seulement** | *No tengo más que diez euros* — je n’ai que dix euros |
| *no… más de* + chiffre | Pas plus de | *No tengo más de diez euros* |

Les deux dernières lignes ne disent pas du tout la même chose : c’est le piège de la fiche.

## Les comparatifs irréguliers
| Adjectif ou adverbe | Comparatif |
| *bueno*, *bien* | *mejor* |
| *malo*, *mal* | *peor* |
| *grande* | *mayor* |
| *pequeño* | *menor* |

*Mayor* et *menor* servent surtout pour l’âge et l’abstrait : *mi hermano mayor*. Et ils ne s’emploient **jamais** avec *más* : « más mejor » est une faute.

## Le second terme est une proposition
On emploie alors *de lo que*, *del que*, *de la que* : *Es más difícil de lo que parece*, *Tiene más dinero del que dice*.

## Le comparatif progressif
*cada vez más / cada vez menos* : *Hace cada vez más calor*.`,
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
            cours: `Deux superlatifs, et deux pièges : la **préposition** du superlatif relatif, et l’**orthographe** du suffixe absolu.

## Les deux superlatifs
| | Relatif | Absolu |
| Ce qu’il fait | Il compare dans un ensemble | Il porte la qualité au maximum, sans comparer |
| Sa structure | *el / la / los / las* + *más* ou *menos* + **de** | *muy* + adjectif, ou le suffixe **-ísimo** |
| Exemple | *Es el alumno más inteligente de la clase* | *muy guapo*, *guapísimo* |

> Le piège du relatif : le complément se construit avec *de*, **jamais** avec *en*. Le français dit « le plus grand **du** monde », l’espagnol aussi : *el más grande del mundo*.

Quand le nom est déjà exprimé avant, l’article ne se répète pas : *Mi hermano es el más alto*.

Et les deux formes de l’absolu ne se cumulent jamais : « muy guapísimo » est une faute.

## Les changements orthographiques de -ísimo
La finale disparaît, et la consonne s’ajuste pour garder le **son**.

| Changement | Exemple |
| c devient qu | *rico* devient *riquísimo* · *blanco* devient *blanquísimo* |
| g devient gu | *largo* devient *larguísimo* |
| z devient c | *feliz* devient *felicísimo* |
| Diphtongue réduite | *bueno* devient *bonísimo* (norme) ou *buenísimo* (courant, admis) |
| Diphtongue réduite | *fuerte* devient *fortísimo* |

## Les superlatifs irréguliers savants
| Adjectif | Superlatif savant |
| *bueno* | *óptimo* |
| *malo* | *pésimo* |
| *grande* | *máximo* |
| *pequeño* | *mínimo* |
| *alto* | *supremo* |

Registre soutenu : à **reconnaître** à la lecture, à employer avec parcimonie.

## Renforcer autrement
*sumamente*, *extremadamente*, et les préfixes familiers *super-*, *requete-* : *un examen super difícil*.`,
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
            cours: `L’apocope est la chute de la finale d’un mot devant un autre. L’espagnol en fait un usage **réglé** : ce n’est pas un relâchement, c’est une obligation.

## Devant un nom masculin singulier
| Forme pleine | Apocopée | Exemple |
| *uno* | *un* | *un libro* |
| *alguno* | *algún* | *algún día* |
| *ninguno* | *ningún* | *ningún problema* |
| *bueno* | *buen* | *buen amigo* |
| *malo* | *mal* | *mal tiempo* |
| *primero* | *primer* | *primer piso* |
| *tercero* | *tercer* | *tercer año* |

Devant un **féminin**, rien ne change : *una casa*, *buena idea*, *primera vez*.

> L’apocope ne joue que si l’adjectif est **immédiatement** devant le nom : *un buen amigo*, mais *un amigo bueno* — et *el primero de la clase*, sans nom derrière.

## Les apocopes particulières
| Mot | Devient | Devant quoi | Exemple |
| *grande* | **gran** | Un nom singulier, masculin **ou** féminin | *un gran hombre*, *una gran mujer* |
| *ciento* | **cien** | Un nom, ou *mil* et *millones* | *cien euros*, *cien mil* |
| *santo* | **san** | Un prénom masculin | *san Juan*, *san Pedro* |
| *cualquiera* | **cualquier** | Tout nom | *cualquier día*, *cualquier mujer* |
| *tanto* | **tan** | Un adjectif ou un adverbe | *tan alto*, *tan rápido* |
| *recientemente* | **recién** | Un participe | *recién nacido*, *recién casados* |

## Les exceptions à retenir
| Règle | L’exception |
| *grande* devient *gran* | Au **pluriel**, la forme entière revient : *grandes hombres* |
| *ciento* devient *cien* | On garde *ciento* devant un autre nombre : *ciento veinte* |
| *santo* devient *san* | **Sauf** devant To- et Do- : *Santo Tomás*, *Santo Domingo* |
| *santo* devient *san* | Jamais au féminin : *santa Teresa* |

Et le sens change avec la place : *gran* devant = important ; *grande* derrière = de grande taille.`,
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
            cours: `L’espagnol n’a qu’**un seul** auxiliaire de temps composé : *haber*. Là où le français hésite entre « être » et « avoir », l’espagnol ne choisit jamais.

## Le présent de haber
*he, has, ha, hemos, habéis, han.* Suivi du participe passé, il forme le **pretérito perfecto** : *He comido*, *Han llegado*.

## Les deux conséquences de l’auxiliaire unique
| Conséquence | Ce qu’elle interdit | Exemple |
| Le participe **ne s’accorde jamais** | Aucun accord, dans aucun cas | *La carta que he escrito* — jamais « escrita » |
| Le bloc est **soudé** | Ni pronom, ni adverbe, ni négation entre les deux | *No lo he visto nunca* — jamais « he nunca visto » |

## Hay : la forme impersonnelle
*Hay* signifie « il y a », et il est **invariable** — même devant un pluriel.

| Temps | Forme | Exemple |
| Présent | *hay* | *Hay dos libros* |
| Imparfait | *había* | *Había muchos alumnos* |
| Passé simple | *hubo* | *Hubo un accidente* |
| Futur | *habrá* | *Habrá una fiesta* |
| Passé composé | *ha habido* | *Ha habido cambios* |

> Ne pas confondre *hay* et *está* : *hay* pose l’**existence** d’une chose non encore identifiée, *está* donne la **localisation** d’une chose déjà connue. *Hay un banco en la plaza* / *El banco está en la plaza*.

## Les autres temps composés
| Temps | Formation | Exemple |
| Plus-que-parfait | *había* + participe | *Había salido cuando llegué* |
| Futur antérieur | *habré* + participe | *A las ocho ya habré terminado* |
| Conditionnel passé | *habría* + participe | *Habría venido* |
| Subjonctif passé | *haya* + participe | *Espero que haya llegado* |
| Subjonctif plus-que-parfait | *hubiera / hubiese* + participe | *Si hubiera sabido…* |

## Haber que et haber de
| Structure | Ce qu’elle exprime | Exemple |
| *hay que* + infinitif | Une obligation **impersonnelle** | *Hay que estudiar* — il faut étudier |
| *haber de* + infinitif | Une obligation atténuée, littéraire | *He de irme* |`,
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
            cours: `Le pronom réfléchi espagnol se comporte comme en français — sauf qu’il se **soude** au verbe dans trois cas, et qu’il couvre des emplois que le français rend autrement.

## Les formes et la place
*me, te, se, nos, os, se.* Ils s’accordent avec le sujet : *yo me lavo, tú te lavas, él se lava*.

| Le verbe est… | Le pronom se place… | Exemple |
| Conjugué | **Devant** | *Me levanto a las siete* |
| À l’infinitif | Soudé derrière | *levantarse* |
| Au gérondif | Soudé derrière | *levantándose* |
| À l’impératif affirmatif | Soudé derrière | *¡levántate!* |
| Avec un semi-auxiliaire | Les deux sont admis | *Me voy a levantar* = *Voy a levantarme* |

## Les cinq valeurs de « se »
| Valeur | Ce qu’elle dit | Exemple |
| **Réfléchie** | L’action revient sur le sujet | *Se lava* — il se lave lui-même |
| **Réciproque** | Plusieurs sujets agissent l’un sur l’autre | *Se escriben* — ils s’écrivent |
| **Lexicale** | Le pronom fait partie du verbe | *quejarse*, *arrepentirse*, *atreverse*, *darse cuenta de* |
| **Passive** | Le verbe **s’accorde** avec le sujet | *Se venden pisos* — des appartements à vendre |
| **Impersonnelle** | Le verbe reste au **singulier** | *Se dice que…*, *Aquí se come bien* |

> Les deux dernières se ressemblent et ne se conjuguent pas pareil : *Se venden pisos* (passive, accord au pluriel) contre *Se habla de política* (impersonnelle, singulier). C’est le même *se*, deux constructions.

## Le pronominal qui change le sens
| Sans pronom | Avec pronom |
| *ir* — aller | *irse* — partir : *Me voy* |
| *dormir* — dormir | *dormirse* — s’endormir |
| *quedar* — convenir | *quedarse* — rester sur place |
| *acordar* — décider | *acordarse de* — se souvenir |
| *poner* — mettre | *ponerse* — se mettre, devenir |

## Le pronominal d’intensité
Sans aucune valeur réfléchie, il ajoute une nuance d’appropriation : *Se comió toda la tarta* (il s’est enfilé toute la tarte), *Se bebió un litro*.`,
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
            cours: `Une famille entière de verbes espagnols change de voyelle au présent. Ce n’est pas une irrégularité capricieuse : c’est **l’accent tonique** qui la déclenche.

## La règle
Quand l’accent tonique tombe sur la voyelle du radical, celle-ci **diphtongue**. Quand il se déplace sur la terminaison, elle revient à sa forme simple.

| Changement | Exemple |
| e devient **ie** | *pensar* devient *pienso* |
| o devient **ue** | *poder* devient *puedo* |
| u devient **ue** | *jugar* devient *juego* — un seul verbe |

## La conjugaison en botte
| Personne | Forme | Diphtongue ? |
| yo | *pienso* | Oui |
| tú | *piensas* | Oui |
| él / ella | *piensa* | Oui |
| **nosotros** | *pensamos* | **Non** |
| **vosotros** | *pensáis* | **Non** |
| ellos / ellas | *piensan* | Oui |

> Les quatre formes qui diphtonguent dessinent une **botte** autour de *nosotros* et *vosotros* — les deux seules personnes où l’accent tombe sur la terminaison. C’est le meilleur moyen mnémotechnique du chapitre, et il explique la règle au lieu de la faire réciter.

## Où la diphtongue apparaît
| Temps | Diphtongue ? | Exemple |
| Présent de l’indicatif | Oui | *pienso* |
| Présent du subjonctif | Oui, même botte | *piense… pensemos… piensen* |
| Impératif | Oui | *¡piensa!* |
| Passé simple, imparfait, futur | **Non** | *pensé*, *pensaba*, *pensaré* |

## Les verbes à connaître
| Changement | Verbes |
| e devient ie | *pensar, empezar, cerrar, despertar, sentar, querer, entender, perder, encender, preferir, sentir, mentir, divertirse* |
| o devient ue | *poder, contar, encontrar, recordar, acostarse, volar, soñar, volver, mover, doler, morir, dormir* |
| u devient ue | *jugar* |

## Un cas à part
*Oler* (sentir une odeur) prend un **h** à l’écrit quand il diphtongue : *huelo, hueles, huele… olemos, oléis, huelen*.

## Ne pas confondre
Un verbe à **diphtongue** n’est pas un verbe à **affaiblissement** (*pedir* devient *pido*), où le e devient i. Les deux se ressemblent à l’oreille, pas dans la règle.`,
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
            cours: `Deuxième famille d’irréguliers du radical : ceux où le *e* ne diphtongue pas mais **s’affaiblit** en *i*. Ils sont **tous** du troisième groupe, en *-ir*.

## La règle
Sous l’accent tonique, le *e* du radical devient *i* — avec la même botte que la diphtongue.

| Personne | Forme | Affaiblissement ? |
| yo | *pido* | Oui |
| tú | *pides* | Oui |
| él / ella | *pide* | Oui |
| **nosotros** | *pedimos* | **Non** |
| **vosotros** | *pedís* | **Non** |
| ellos / ellas | *piden* | Oui |

## Ils sont tous en -ir
C’est le repère le plus économique : **aucun** verbe en *-ar* ou en *-er* ne s’affaiblit.

*Pedir, servir, repetir, seguir, conseguir, elegir, corregir, medir, vestirse, reír, sonreír, despedirse, impedir, competir.*

## Où l’affaiblissement se produit
Plus largement que la diphtongue.

| Temps | Où | Exemple |
| Présent de l’indicatif | Dans la botte | *pido* |
| Présent du subjonctif | À **toutes** les personnes | *pida, pidas, pida, pidamos, pidáis, pidan* |
| Passé simple | Aux **3es personnes** seulement | *pidió, pidieron* — mais *pedí, pediste* |
| Imparfait du subjonctif | Partout, dérivé du passé simple | *pidiera, pidiese* |
| Gérondif | Toujours | *pidiendo*, *sirviendo*, *diciendo* |

> Le repère qui sauve : dès que la **terminaison** contient un *ie* ou un *ió*, l’affaiblissement s’applique. *Pidió*, jamais « pedió ».

## Les verbes mixtes
Quelques verbes en *-ir* diphtonguent au présent **et** s’affaiblissent ailleurs.

| Verbe | Au présent | Au passé simple et au gérondif |
| *sentir* | *siento* | *sintió*, *sintiendo* |
| *preferir* | *prefiero* | *prefirió*, *prefiriendo* |
| *dormir* | *duermo* | *durmió*, *durmiendo* |
| *morir* | *muero* | *murió*, *muriendo* |

## Les petits pièges orthographiques
| Verbe | Le changement |
| *seguir* | Perd son u devant o et a : *sigo*, *siga* |
| *elegir*, *corregir* | Le g devient j : *elijo*, *corrijo* |
| *reír* | Garde l’accent : *río, ríes, ríe, reímos, reís, ríen* ; gérondif *riendo* |`,
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
            cours: `C’est l’erreur la plus visible d’un francophone en espagnol, parce qu’elle tombe à **chaque phrase**. Et la différence n’est pas « permanent contre passager » — c’est plus fin que ça.

## Ser ou estar ?
| | **Ser** — ce qui définit | **Estar** — ce qui se constate |
| La question à laquelle il répond | Qu’est-ce que c’est ? | Comment est-ce, en ce moment ? |
| Identité, origine, profession | *Soy español*, *Es profesora* | |
| Caractéristique inhérente | *El hielo es frío*, *Es alto* | |
| Matière, possession, destination | *Es de madera*, *Es para ti* | |
| Heure, date, prix | *Son las tres*, *Hoy es lunes* | |
| Localisation | | *Madrid está en España* |
| État, humeur, santé | | *Estoy cansado*, *Está enfermo* |
| Résultat d’un changement | | *La sopa está fría* — elle a refroidi |
| Forme progressive | | *Estoy estudiando* |

> Le raccourci qui marche presque toujours : *ser* répond à « **qu’est-ce que c’est ?** », *estar* à « **comment est-ce, maintenant ?** »

## Les adjectifs qui changent de sens
Ce ne sont pas des nuances : ce sont des mots différents.

| Avec *ser* | Avec *estar* |
| *ser listo* — malin | *estar listo* — prêt |
| *ser aburrido* — ennuyeux | *estar aburrido* — s’ennuyer |
| *ser rico* — riche | *estar rico* — délicieux |
| *ser bueno* — bon, gentil | *estar bueno* — bon au goût, en forme |
| *ser malo* — méchant | *estar malo* — malade |
| *ser vivo* — vif d’esprit | *estar vivo* — en vie |
| *ser verde* — de couleur verte | *estar verde* — pas mûr |

## Le piège de la localisation
| Ce qu’on situe | Le verbe | Exemple |
| Un **lieu**, une chose | *estar* | *Mi casa está en el centro* |
| Un **événement** | *ser* | *La fiesta es en mi casa* — elle a lieu chez moi |

C’est le seul cas où *ser* localise : parce qu’un événement n’est pas quelque part, il **a lieu** quelque part.

## Les expressions figées avec estar
*estar de acuerdo*, *estar de vacaciones*, *estar de pie*, *estar a punto de*, *estar por*, *estar de moda*.`,
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
            cours: `Le gérondif espagnol correspond à « **en train de** » plus qu’au gérondif français : il dit l’action **en cours**, dans son déroulement.

## La formation
| Infinitif en… | Gérondif en… | Exemple |
| -ar | **-ando** | *hablar* devient *hablando* |
| -er, -ir | **-iendo** | *comer* devient *comiendo* |

| Irrégulier | Gérondif |
| *decir* | *diciendo* |
| *pedir* | *pidiendo* |
| *dormir* | *durmiendo* |
| *morir* | *muriendo* |
| *poder* | *pudiendo* |
| *venir* | *viniendo* |
| *ir* | *yendo* |

> Le *-iendo* devient **-yendo** après une voyelle : *leyendo*, *oyendo*, *cayendo*, *construyendo*, *yendo*.

## Estar + gérondif
La forme progressive, **beaucoup plus employée** qu’en français : *Estoy comiendo* (je suis en train de manger), *Estaba lloviendo*, *¿Qué estás haciendo?*

## Les autres périphrases
| Périphrase | Ce qu’elle exprime | Exemple |
| *seguir / continuar* + gérondif | La continuation | *Sigue lloviendo* — il pleut toujours |
| *llevar* + durée + gérondif | La durée écoulée | *Llevo dos años estudiando español* |
| *ir* + gérondif | La progression lente | *Va mejorando* |
| *venir* + gérondif | Une évolution venue du passé | *Viene diciendo lo mismo desde hace años* |
| *acabar* + gérondif | Le point d’aboutissement | *Acabó aceptando* |

La périphrase *llevar* est la plus rentable : elle rend le « depuis » français sans passer par une subordonnée.

## Ce que le gérondif ne peut pas faire
| L’emploi interdit | Pourquoi | Ce qu’il faut dire |
| Qualifier un **nom** | C’est un calque du français | *una caja que contiene libros*, jamais « conteniendo » |
| Exprimer la **postériorité** | Le gérondif dit le simultané | Deux propositions, ou *y* + verbe conjugué |

## Le gérondif seul
Il exprime la manière ou la simultanéité : *Salió corriendo*, *Estudiando, se aprende*.`,
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
            cours: `Le participe passé espagnol a une règle simple, à condition de savoir **avec quoi** il est employé.

## La formation
| Infinitif en… | Participe en… | Exemple |
| -ar | **-ado** | *hablar* devient *hablado* |
| -er, -ir | **-ido** | *comer* devient *comido* |

| Irrégulier | Participe | Irrégulier | Participe |
| *abrir* | *abierto* | *poner* | *puesto* |
| *cubrir* | *cubierto* | *romper* | *roto* |
| *decir* | *dicho* | *ver* | *visto* |
| *escribir* | *escrito* | *volver* | *vuelto* |
| *hacer* | *hecho* | *resolver* | *resuelto* |
| *morir* | *muerto* | *satisfacer* | *satisfecho* |

## La règle d’accord, en une ligne
| Employé avec… | Accord ? | Exemple |
| *haber* | **Jamais** | *Ellas han llegado* · *Las cartas que he escrito* |
| *ser* ou *estar* | Avec le **sujet** | *La puerta está cerrada* · *Las casas fueron construidas* |
| Comme **adjectif** | Avec le **nom** | *una carta escrita a mano* |

> C’est la seule règle du chapitre, mais elle se joue à chaque phrase : ce qui suit *haber* est **figé**, tout le reste s’accorde.

## Ser + participe ou estar + participe
| Construction | Ce qu’elle exprime | Exemple |
| *ser* + participe | La **passive d’action** : on assiste au fait | *La casa fue construida en 1920* |
| *estar* + participe | L’**état résultant** : le fait est accompli | *La casa está construida* |

L’espagnol emploie d’ailleurs la passive avec *ser* **beaucoup moins** que le français : il lui préfère la tournure en *se* (*Se construyó la casa en 1920*) ou la troisième personne du pluriel (*Construyeron la casa*).

## Les participes doubles
Quelques verbes ont **deux** participes : un régulier pour les temps composés, un irrégulier employé comme adjectif.

| Verbe | Temps composé | Adjectif |
| *freír* | *he freído* | *patatas fritas* |
| *imprimir* | *he imprimido* | *un texto impreso* |
| *soltar* | *he soltado* | *un perro suelto* |
| *despertar* | *he despertado* | *está despierto* |`,
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
            cours: `*Me gusta el cine* ne veut pas dire « je aime le cinéma » mais « **le cinéma me plaît** ». Toute la construction se lit à l’envers du français — et si on ne l’a pas comprise, on se trompe à chaque phrase.

## Qui est le sujet ?
Ce n’est pas la personne : c’est **la chose qui plaît**. La personne est un complément d’objet indirect — *me, te, le, nos, os, les*.

| Phrase | Le sujet | L’accord du verbe |
| *Me gusta el cine* | *el cine*, singulier | Singulier |
| *Me gustan las películas* | *las películas*, pluriel | **Pluriel** |
| *Me gusta leer* | Un infinitif | Singulier |
| *Me gusta leer y escribir* | Deux infinitifs | **Singulier quand même** |

> D’où l’erreur à ne plus faire : « me gusta las películas ». Le verbe s’accorde avec **ce qui plaît**, jamais avec celui à qui ça plaît.

## Le renforcement par « a »
*Le* peut renvoyer à *él*, *ella* ou *usted*. Pour insister ou lever l’ambiguïté, on ajoute *a* + pronom tonique — et le pronom complément **reste obligatoire**, même quand le nom est exprimé.

*A mí me gusta* · *A él le gusta* · *A Juan le gusta*

## Les verbes de la même famille
| Verbe | Sens | Exemple |
| *encantar* | Adorer | *Me encantan los perros* |
| *doler* | Avoir mal | *Me duele la cabeza* |
| *importar* | Importer | *No me importa* |
| *hacer falta* | Manquer, être nécessaire | *Nos hacen falta dos sillas* |
| *quedar* | Rester | *Me queda poco dinero* |
| *interesar*, *molestar*, *apetecer*, *faltar*, *parecer*, *bastar*, *tocar*, *sobrar*, *convenir*, *costar* | Même construction | |

## Répondre et enchaîner
| Après une… | Accord | Désaccord |
| Affirmation | *A mí también* | *A mí no* |
| Négation | *A mí tampoco* | *A mí sí* |

## Le degré
*Me gusta mucho / muchísimo*, *No me gusta nada*, *Me gusta más el cine que el teatro*. On ne dit **jamais** « me gusta muy ».`,
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
            cours: `L’espagnol distingue nettement l’obligation qui s’adresse à **quelqu’un** de celle qui vaut **pour tout le monde**. Choisir la mauvaise, c’est changer le sens de la phrase.

## Les trois obligations
| Structure | Ce qu’elle exprime | Sujet ? | Exemple |
| *tener que* + infinitif | L’obligation personnelle, la plus forte | Oui | *Tengo que estudiar* |
| *hay que* + infinitif | L’obligation impersonnelle, valable pour tous | **Non** | *Hay que estudiar para aprobar* |
| *deber* + infinitif | Le devoir moral, le conseil pressant | Oui | *Debes respetar a tus padres* |

> C’est la distinction à tenir : *Tengo que trabajar* (moi, je dois) contre *Hay que trabajar* (il faut travailler, en général). Le français dit « il faut » dans les deux cas — l’espagnol non.

*Hay que* reste **invariable** ; aux autres temps : *había que*, *habrá que*, *hubo que*.

## Deber ou deber de
| Structure | Ce qu’elle exprime | Exemple |
| *deber* + infinitif | L’**obligation** | *Debes estudiar* — tu dois étudier |
| *deber de* + infinitif | La **probabilité** | *Debe de estar enfermo* — il doit être malade, je suppose |

La langue courante les mélange. L’examen, non.

## Les autres tournures
| Tournure | Registre | Exemple |
| *haber de* + infinitif | Soutenu, littéraire | *He de irme* |
| *ser necesario / preciso que* + subjonctif | Neutre | *Es necesario que vengas* |
| *hacer falta* + infinitif ou *que* + subjonctif | Courant | *Hace falta estudiar* · *Hace falta que estudies* |
| L’**impératif** | L’ordre direct | *¡Estudia!* · *¡No salgas!* |

## L’obligation au passé
| Temps | Ce qu’il dit | Exemple |
| Imparfait | L’obligation existait — on ne sait pas si elle a été suivie | *Tenía que estudiar* |
| Passé simple | L’obligation a été **exécutée** | *Tuve que estudiar* |

L’imparfait laisse ouvert, le passé simple conclut.`,
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
            cours: `L’espagnol possède un verbe que le français n’a pas : *soler*, qui dit à lui seul « avoir l’habitude de ». C’est la tournure la plus **économique** — et la plus valorisée dans une copie.

## Soler + infinitif
*Suelo levantarme temprano* — j’ai l’habitude de me lever tôt.

C’est un verbe à **diphtongue** (o devient ue) : *suelo, sueles, suele, solemos, soléis, suelen*.

| Temps | Employé ? | Exemple |
| Présent | Oui | *Suele llover en otoño* |
| Imparfait | Oui | *Solía ir al cine todos los domingos* |
| Passé simple, futur | **Jamais** | L’habitude n’est pas un événement |

> Une seule phrase avec *soler* remplace toute une périphrase française : *suele llover* = « il a l’habitude de pleuvoir », « il pleut d’ordinaire ».

## Les autres tournures
| Tournure | Sens | Registre |
| *acostumbrar a* + infinitif | Avoir l’habitude de | Soutenu |
| *acostumbrarse a* | **S’habituer à** — sens différent | Courant |
| *tener la costumbre de* | Avoir l’habitude de | Lourd mais correct |
| L’**imparfait** seul | L’habitude passée | Le plus fréquent : *Cuando era pequeño, jugaba al fútbol* |

## Les marqueurs de fréquence
| Marqueur | Sens |
| *siempre* | Toujours |
| *a menudo* | Souvent |
| *a veces* | Parfois |
| *de vez en cuando* | De temps en temps |
| *normalmente, generalmente, por lo general* | D’ordinaire |
| *casi nunca*, *nunca* | Presque jamais, jamais |

Attention à la nuance : *cada día* détaille jour après jour, *todos los días* embrasse l’ensemble.

## Répéter et continuer
| Structure | Ce qu’elle exprime | Exemple |
| *volver a* + infinitif | Refaire une action ponctuelle | *Volví a llamarlo* — je l’ai rappelé |
| *seguir* + gérondif | L’action qui continue | *Sigo estudiando español* |

L’espagnol n’a pas de préfixe « re- » productif comme le français : *volver a* en tient lieu, systématiquement.`,
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
            cours: `L’espagnol dispose d’un moyen d’exprimer la supposition que le français ne connaît pas : il conjugue le verbe au **futur** ou au **conditionnel** pour parler du **présent** ou du **passé**.

## La règle, mécanique
| Le temps employé | Sur quoi il suppose | Exemple |
| **Futur** | Le **présent** | *¿Qué hora es? — Serán las tres* — il doit être trois heures |
| **Conditionnel** | Le **passé** | *Serían las tres cuando llegó* — il devait être trois heures |
| Futur antérieur | Un fait accompli, vu du présent | *Habrá salido* — il a dû sortir |
| Conditionnel passé | Un fait accompli, vu du passé | *Habría salido* — il avait dû sortir |

*Estará enfermo* ne veut pas dire « il sera malade » mais « **il doit être** malade, en ce moment ». C’est le contresens le plus fréquent en version.

## Deber de + infinitif
La tournure explicite, à ne pas confondre avec *deber* seul.

| Structure | Ce qu’elle exprime | Exemple |
| *deber* + infinitif | L’**obligation** | *Debe estudiar* — il doit étudier |
| *deber de* + infinitif | La **probabilité** | *Debe de estar enfermo* — il doit être malade |

## Les adverbes de doute
*quizá(s), tal vez, acaso, posiblemente, probablemente* se construisent avec l’un ou l’autre mode, **selon la force du doute**.

| Mode | Ce qu’il dit | Exemple |
| **Indicatif** | La probabilité est forte | *Quizás viene mañana* — je le crois assez |
| **Subjonctif** | La probabilité est faible | *Quizás venga mañana* — je n’en sais rien |

> Deux exceptions absolues, et ce sont les pièges classiques : *a lo mejor* est **toujours** suivi de l’indicatif (*A lo mejor viene*), et *puede que* **toujours** du subjonctif (*Puede que llueva*).

## Les autres marques
*seguramente*, *sin duda*, *es probable que* + subjonctif, *parecer que* + indicatif (*Parece que va a llover*).`,
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
            cours: `Conseiller, c’est doser. Entre l’ordre brut et la suggestion polie, l’espagnol offre une échelle complète — et le bac valorise celui qui sait en changer de barreau.

## L’échelle, du plus direct au plus poli
| Registre | Structure | Exemple |
| L’**ordre** | Impératif | *¡Estudia!* |
| Le conseil ferme | *deberías* + infinitif | *Deberías descansar* |
| La suggestion | *podrías* + infinitif | *Podrías llamarle* |
| La question | *¿por qué no…?* | *¿Por qué no vas al médico?* |
| L’invitation | *¿y si…?* + indicatif | *¿Y si salimos esta noche?* |
| La politesse | *¿Te importaría…?*, *¿Podría usted…?* | |

## L’impératif
| Personne | Affirmatif | Négatif |
| *tú* | *habla, come, vive* | *no hables, no comas* |
| *vosotros* | *hablad, comed, vivid* | *no habléis, no comáis* |
| *usted*, *nosotros*, *ustedes* | Emprunté au **subjonctif** | Idem |

| Irrégulier de *tú* | Forme |
| *decir* | *di* |
| *hacer* | *haz* |
| *ir* | *ve* |
| *poner* | *pon* |
| *salir* | *sal* |
| *ser* | *sé* |
| *tener* | *ten* |
| *venir* | *ven* |

> Le négatif passe **toujours** au subjonctif. Et la place des pronoms bascule avec lui : l’affirmatif les soude (*dímelo*), le négatif les place devant (*no me lo digas*).

## Le conseil par le subjonctif
Après un verbe de conseil ou de volonté, la subordonnée passe au subjonctif : *Te aconsejo que vayas al médico*, *Te recomiendo que descanses*, *Te sugiero que lo pienses*.

Si le sujet ne change pas, on emploie l’infinitif : *Te aconsejo descansar*.

## Le souhait
| Structure | Ce qu’elle dit | Exemple |
| *ojalá* + subjonctif présent | Un souhait possible | *Ojalá apruebes* |
| *ojalá* + imparfait du subjonctif | Un souhait **improbable** | *Ojalá pudiera ayudarte* — si seulement je pouvais |

## À la place de l’autre
*Si yo fuera tú…* et *Yo que tú…* se poursuivent au **conditionnel** : *Yo que tú, iría al médico*.`,
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
            cours: `Le présent est le temps le plus employé — et celui où se concentrent le plus d’irrégularités. Les connaître, c’est débloquer **tous** les temps qui en dérivent, à commencer par le subjonctif.

## Les trois conjugaisons régulières
| Personne | -ar (*hablar*) | -er (*comer*) | -ir (*vivir*) |
| yo | *hablo* | *como* | *vivo* |
| tú | *hablas* | *comes* | *vives* |
| él / ella | *habla* | *come* | *vive* |
| nosotros | *hablamos* | *comemos* | *vivimos* |
| vosotros | *habláis* | *coméis* | *vivís* |
| ellos | *hablan* | *comen* | *viven* |

Les deux dernières colonnes ne diffèrent qu’à *nosotros* et *vosotros*.

## Les irréguliers de la seule première personne
Le reste de la conjugaison est régulier — d’où leur surnom de verbes « à *yo* irrégulier ».

| Verbe | 1re personne | Verbe | 1re personne |
| *hacer* | *hago* | *conocer* | *conozco* |
| *poner* | *pongo* | *conducir* | *conduzco* |
| *salir* | *salgo* | *ver* | *veo* |
| *traer* | *traigo* | *saber* | *sé* |
| *caer* | *caigo* | *dar* | *doy* |
| *valer* | *valgo* | *caber* | *quepo* |

Tous les verbes en *-cer* et *-cir* suivent *conocer*.

## Les irréguliers du radical
| Type | Changement | Exemple |
| **Diphtongue** | e devient ie | *pensar* devient *pienso* |
| Diphtongue | o devient ue | *poder* devient *puedo* |
| Diphtongue | u devient ue | *jugar* devient *juego* |
| **Affaiblissement** | e devient i | *pedir* devient *pido* |

Dans les deux cas, *nosotros* et *vosotros* restent **réguliers** : c’est la conjugaison « en botte ».

## Les cumulards et les totalement irréguliers
| Verbe | Conjugaison |
| *tener* | *tengo, tienes, tiene, tenemos, tenéis, tienen* |
| *venir* | *vengo, vienes, viene, venimos, venís, vienen* |
| *decir* | *digo, dices, dice, decimos, decís, dicen* |
| *ser* | *soy, eres, es, somos, sois, son* |
| *ir* | *voy, vas, va, vamos, vais, van* |
| *haber* | *he, has, ha, hemos, habéis, han* |
| *estar* | *estoy, estás, está, estamos, estáis, están* |

> *Estar* porte un **accent écrit** sur cinq de ses six formes : il marque l’accent tonique sur la terminaison, contrairement à tous les autres verbes. L’oublier est une faute d’orthographe, pas de conjugaison.

## Ce que le présent peut dire d’autre
| Emploi | Exemple |
| Le **futur proche** | *Mañana salgo a las ocho* |
| Le **présent historique** | *En 1492, Colón llega a América* |
| Une action commencée dans le passé | *Estudio español desde hace dos años* |`,
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
            cours: `Le subjonctif espagnol est beaucoup plus vivant que le français : il s’emploie tous les jours, à l’oral comme à l’écrit. Sa formation est en revanche très régulière.

## La formation
On part de la **première personne du présent de l’indicatif**, on retire le *-o*, et on **inverse la voyelle**.

| Infinitif en… | Terminaisons | Exemple |
| **-ar** | en **e** | *hablo* devient *hable, hables, hable, hablemos, habléis, hablen* |
| **-er, -ir** | en **a** | *como* devient *coma, comas, coma, comamos, comáis, coman* |

> L’intérêt de partir de *yo* : **toutes** les irrégularités de la première personne se propagent à tout le subjonctif. *Hago* donne *haga*, *tengo* donne *tenga*, *conozco* donne *conozca*, *salgo* donne *salga*.

## Les six irréguliers
Ce sont ceux dont la première personne ne finit pas par *-o*.

| Verbe | Subjonctif |
| *ser* | *sea* |
| *ir* | *vaya* |
| *haber* | *haya* |
| *saber* | *sepa* |
| *dar* | *dé* |
| *estar* | *esté* |

## Les verbes du radical
| Type | Où le changement porte | Exemple |
| **Diphtongue** | Même botte qu’à l’indicatif | *piense… pensemos, penséis… piensen* |
| **Affaiblissement** | **Toutes** les personnes | *pida, pidas, pida, pidamos, pidáis, pidan* |
| Verbes en -ir mixtes | Aussi à *nosotros* et *vosotros* | *sienta… sintamos, sintáis… sientan* |

## Quand l’employer
| Le déclencheur | Exemple |
| Volonté, ordre, souhait | *Quiero que vengas* · *Ojalá llueva* |
| Sentiment | *Me alegro de que estés aquí* |
| Doute, négation d’opinion | *No creo que venga* |
| Jugement impersonnel | *Es necesario que estudies* |
| **Futur dans une subordonnée de temps** | *Cuando llegues, llámame* · *En cuanto pueda, te aviso* |
| But | *Te lo digo para que lo sepas* |
| Impératif négatif et politesse | *No hables* · *¡Hable usted!* |

> La ligne en gras est **le piège majeur du francophone** : le français dit « quand tu **arriveras** », l’espagnol met le subjonctif présent. Écrire *cuando llegarás* est une faute lourde.

## Les conjonctions qui l’exigent toujours
*para que*, *antes de que*, *sin que*, *a menos que*, *con tal de que*, *en caso de que*.`,
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
            cours: `L’imparfait espagnol est le temps le plus **régulier** de la langue : trois irréguliers en tout. Sa difficulté n’est pas la forme, c’est l’emploi.

## La formation
| Infinitif en… | Terminaisons | Exemple |
| -ar | *-aba, -abas, -aba, -ábamos, -abais, -aban* | *hablaba* |
| -er, -ir | *-ía, -ías, -ía, -íamos, -íais, -ían* | *comía*, *vivía* |

## Les trois seuls irréguliers
| Verbe | Imparfait | Pourquoi |
| *ser* | *era, eras, era, éramos, erais, eran* | Forme héritée du latin |
| *ir* | *iba, ibas, iba, íbamos, ibais, iban* | Idem |
| *ver* | *veía, veías, veía…* | Il se forme sur l’ancien infinitif *veer* |

> Trois exceptions, pas une de plus : c’est le **seul** temps espagnol dont on puisse dire cela.

## Ce que l’imparfait fait
| Emploi | Exemple |
| La **description** : ni début ni fin | *Hacía frío y la calle estaba desierta* |
| L’**habitude** passée | *Cuando era pequeño, jugaba al fútbol* |
| L’action **en cours**, interrompue | *Llovía cuando salí* |
| La **politesse** | *Quería pedirle un favor* |

## L’opposition avec le passé simple
C’est le vrai enjeu du chapitre.

| | Imparfait | Passé simple |
| Ce qu’il fait | Il **suspend** le temps | Il **fait avancer** le récit |
| Ce qu’il donne | Le décor | L’événement |
| Exemple | *Llovía* | *cuando salí de casa* |

Un même fait peut se dire aux deux temps, et le sens change : *Ayer llovió* (il a plu, c’est arrivé) contre *Ayer llovía* (il pleuvait, c’était le contexte).

## L’accent écrit
Il se met sur toutes les formes en *-ía*, ainsi que sur *-ábamos*, *éramos* et *íbamos* : il marque la **syllabe tonique**, et son oubli est une faute d’orthographe.`,
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
            cours: `Le *pretérito perfecto* ressemble au passé composé français par la **forme**, mais pas par l’**emploi** : l’espagnol le réserve à ce qui touche encore au présent.

## La formation
*haber* au présent — *he, has, ha, hemos, habéis, han* — suivi du participe passé.

Le participe **ne s’accorde jamais**, et rien ne s’intercale entre l’auxiliaire et lui : *No lo he visto nunca*, jamais « he nunca visto ».

## Quand l’employer
| Cas | Exemple |
| Une **période non achevée** | *Hoy he comido paella* · *Este año ha llovido poco* |
| Un fait dont les **effets durent** | *Me he roto la pierna* — et j’ai encore le plâtre |
| Un **bilan de vie** | *Nunca he estado en México* · *¿Has visto esta película?* |

## Le repère qui tranche
| Le marqueur | Le temps à employer |
| *hoy, esta semana, este mes, este año* | **Pretérito perfecto** |
| *últimamente, ya, todavía no, aún no, nunca, alguna vez* | Pretérito perfecto |
| *ayer, anoche, el año pasado, en 1990* | **Passé simple** |

> Le raccourci : si le marqueur contient *este* ou *esta*, c’est le passé composé. Si c’est *ayer* ou une date, c’est le passé simple. Il tient dans les deux tiers des cas d’examen.

## L’opposition, en deux paires
| Passé composé | Passé simple |
| *Hoy he ido al cine* | *Ayer fui al cine* |
| *Este año he viajado mucho* | *El año pasado viajé mucho* |

Le passé simple **coupe** le fait du présent ; le passé composé l’y **raccroche**.

## La variation géographique
En **Amérique latine** et dans le nord-ouest de l’Espagne (Galice, Asturies), le passé simple absorbe largement le passé composé : *Hoy comí paella* y est parfaitement courant.

La norme scolaire française suit l’usage **castillan** — c’est celui à appliquer en épreuve, mais ce n’est pas une faute là-bas.`,
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
            cours: `Le passé simple espagnol n’a **rien de littéraire** : il s’emploie à l’oral, tous les jours. C’est le temps des faits achevés et coupés du présent.

## La formation régulière
| Infinitif en… | Terminaisons | Exemple |
| -ar | *-é, -aste, -ó, -amos, -asteis, -aron* | *hablé, hablaste, habló* |
| -er, -ir | *-í, -iste, -ió, -imos, -isteis, -ieron* | *comí, comiste, comió* |

> Les accents de la 1re et de la 3e personne du singulier sont **distinctifs**, pas décoratifs.

| Sans accent | Avec accent |
| *hablo* — présent | *habló* — passé simple |
| *hable* — subjonctif | *hablé* — passé simple |

Les oublier ne fait pas une faute d’orthographe : cela **change le temps** de la phrase.

## Les prétérits forts
Une famille de verbes très fréquents change de radical **et** de terminaisons : *-e, -iste, -o, -imos, -isteis, -ieron*, **sans aucun accent écrit**.

| Verbe | Radical | Verbe | Radical |
| *tener* | *tuv-* | *querer* | *quis-* |
| *estar* | *estuv-* | *venir* | *vin-* |
| *andar* | *anduv-* | *decir* | *dij-* |
| *poder* | *pud-* | *traer* | *traj-* |
| *poner* | *pus-* | *conducir* | *conduj-* |
| *saber* | *sup-* | *hacer* | *hic-*, mais *hizo* |

> Après un radical en **-j**, la 3e personne du pluriel **perd son i** : *dijeron*, *trajeron*, *condujeron* — jamais « dijieron ».

## Ser et ir : la même forme
*fui, fuiste, fue, fuimos, fuisteis, fueron.* Seul le contexte tranche : *Fui a Madrid* (aller) contre *Fui profesor* (être).

## L’affaiblissement aux 3es personnes
Les verbes en *-ir* du type *pedir* et *dormir* changent de voyelle aux deux troisièmes personnes seulement : *pidió, pidieron* ; *durmió, durmieron* ; *sintió, sintieron*.

## Les marqueurs
*ayer, anoche, la semana pasada, el año pasado, en 1975, hace dos años, entonces, de repente, aquel día.*

## L’emploi dans le récit
C’est lui qui **fait avancer** l’histoire, tandis que l’imparfait décrit : *Era de noche y llovía. De repente, sonó el timbre y abrí la puerta.*`,
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
            cours: `Le futur espagnol se construit sur l’**infinitif entier** — ce qui le rend très régulier, et fait que ses douze irréguliers se retiennent d’un bloc.

## La formation
Infinitif + *-é, -ás, -á, -emos, -éis, -án*, pour les trois conjugaisons :

*hablaré, hablarás, hablará, hablaremos, hablaréis, hablarán.*

Toutes les formes portent un **accent écrit**, sauf *nosotros*.

## Les douze irréguliers
Ils modifient le **radical**, jamais les terminaisons. Trois familles, et rien d’autre à retenir.

| Famille | Ce qui se passe | Verbes |
| Le **e** de l’infinitif tombe | *pod-er* devient *podr-* | *poder, querer, saber, haber, caber* |
| Un **d** remplace la voyelle | *ten-er* devient *tendr-* | *tener, poner, venir, salir, valer* |
| Le radical est **raccourci** | *hac-er* devient *har-* | *hacer, decir* |

| Verbe | Futur | Verbe | Futur |
| *poder* | *podré* | *tener* | *tendré* |
| *querer* | *querré* | *poner* | *pondré* |
| *saber* | *sabré* | *venir* | *vendré* |
| *haber* | *habré* | *salir* | *saldré* |
| *caber* | *cabré* | *valer* | *valdré* |
| *hacer* | *haré* | *decir* | *diré* |

> Les composés suivent leur base : *deshacer* donne *desharé*, *mantener* donne *mantendré*, *componer* donne *compondré*. Douze verbes appris, cinquante formes acquises.

## Le conditionnel, même radical
Il prend les terminaisons de l’imparfait des verbes en *-er* — *-ía, -ías, -ía, -íamos, -íais, -ían* — sur le **même radical** que le futur : *hablaría*, *podría*, *tendría*, *haría*, *diría*.

Apprendre les irréguliers du futur, c’est donc apprendre ceux du conditionnel.

## Les emplois
| Forme | Ce qu’elle exprime | Exemple |
| Futur simple | L’avenir, la prédiction | *Mañana lloverá* |
| *ir a* + infinitif | L’intention, l’imminence — bien plus fréquent à l’oral | *Voy a estudiar* |
| Futur de **probabilité** | Une supposition sur le **présent** | *Serán las tres* |
| Futur d’ordre atténué | Un commandement | *No matarás* |
| Futur de concession | Une réserve | *Será muy inteligente, pero no lo parece* |
| Futur antérieur | Un fait accompli à venir, ou une supposition | *Ya habré terminado* · *Ya habrá salido* |

## Le futur ne s’emploie PAS après « cuando »
> C’est le piège le plus coûteux du chapitre. Dans une subordonnée de temps à valeur de futur, l’espagnol met le **subjonctif présent** : *Cuando llegues, llámame* · *En cuanto pueda, te aviso* · *Mientras estés aquí…*

Le français dirait « quand tu **arriveras** ». Écrire *cuando llegarás* est une faute lourde, et elle se voit à la première ligne d’une copie.`,
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
