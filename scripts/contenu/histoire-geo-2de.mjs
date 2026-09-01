// Histoire-Géographie — Seconde : LE PROGRAMME COMPLET (40 fiches).
//
// CE QUE REMPLACE CE MODULE. La 2de n'avait que CINQ chapitres, hérités du tout
// premier jeu de données (migration 008, contenu rempli par la 124) : « La
// Méditerranée antique », « La Méditerranée médiévale », « L'ouverture
// atlantique (XVe-XVIe) », « Sociétés et environnements », « Des mobilités
// généralisées ». Cinq titres pour un programme qui en compte TREIZE — neuf
// d'histoire et quatre de géographie — et aucune trace de la Renaissance, des
// réformes religieuses, de la monarchie absolue, du modèle britannique, des
// Lumières, de la société d'ordres, du vieillissement, du tourisme mondial ni
// de l'Afrique australe.
//
// LE DÉCOUPAGE. Les 13 chapitres du programme, éclatés en leurs 40 fiches.
// Chaque fiche est un chapitre en base ; le CHAPITRE du programme est porté par
// `axe` (colonne `chapters.theme`), qui fait grouper la page matière — cf.
// docs/template-matiere.md. L'histoire occupe les positions 1 à 24, la
// géographie 25 à 40.
//
// LES DEUX ONGLETS. `rayon` (colonne `chapters.discipline`, migration 247)
// range chaque fiche dans « histoire » ou « geographie » : la page matière en
// fait deux onglets, comme en 1re et en Tle. Sans lui, 40 fiches s'empileraient
// dans une seule liste et l'élève devrait descendre toute l'histoire pour
// atteindre la géographie. Ici le rayon est écrit par le module lui-même
// (le générateur sait le faire depuis le français de 1re) : pas besoin d'une
// migration séparée comme la 247 l'avait fait pour la 1re et la Tle.
//
// LES CINQ ANCIENS PARTENT (voir `menage`). Quatre d'entre eux deviennent des
// CHAPITRES du programme (« La Méditerranée antique… », « La Méditerranée
// médiévale… », « L'ouverture atlantique… », « Sociétés et environnements… ») :
// les laisser en base ferait deux objets du même nom à deux places différentes,
// un en-tête de section et une ligne dans la liste. Le ménage est borné à leurs
// cinq titres exacts et au seul niveau 2de — rejoué, il ne trouve plus rien et
// ne touche jamais les 40 fiches neuves.
//
// ⚠️ Le slug reste `histoire-geo` (la matière existe depuis 008). Comme
// `histoire-geo-1re.mjs`, `histoire-geo-tle.mjs` et `geographie-tle.mjs`, ce
// module se génère par `--modules histoire-geo-2de` : `--slugs histoire-geo`
// fusionnerait les cinq et réécrirait quatre migrations déjà exécutées.

export default {
  slug: 'histoire-geo',
  nom: 'Histoire-Géographie',

  titreMigration: 'HISTOIRE-GÉOGRAPHIE 2de — LE PROGRAMME COMPLET (40 fiches)',

  motif: `CONSTAT : la Seconde n'avait que CINQ chapitres d'histoire-géo, hérités
du premier jeu de données de l'app, avec deux leçons génériques chacun. Le
programme officiel en compte TREIZE — neuf d'histoire (des grandes périodes à
la société d'ordres du XVIIIe siècle) et quatre de géographie (environnement,
population, mobilités, Afrique australe) — soit 40 fiches. Un élève de 2de qui
révisait la Renaissance, les réformes religieuses, la monarchie absolue, le
modèle britannique, les Lumières, le vieillissement de la population ou
l'Afrique australe ne trouvait RIEN. Cette migration installe les 40 fiches,
rangées sous leurs 13 chapitres et réparties en deux onglets (Histoire,
Géographie), et retire les 5 fiches génériques que ce découpage recouvre.`,

  menage: [
    {
      raison: `Les colonnes chapters.theme (migration 234) et chapters.discipline
(migration 247) conditionnent tout ce qui suit : ce module range ses 40 fiches
sous 13 chapitres et deux rayons, et l'INSERT écrit les deux colonnes. Elles
sont REPRISES ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir
que la 234 et la 247 soient passées en production — sans cette reprise, la
migration échouerait sur "column chapters.theme does not exist", les 5 anciens
chapitres déjà supprimés et les 40 neufs pas encore posés : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;

ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS discipline TEXT;
GRANT SELECT (discipline) ON public.chapters TO anon;
GRANT SELECT (discipline) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités partent. Quatre d'entre eux deviennent des
CHAPITRES du programme ("La Méditerranée antique", "La Méditerranée médiévale",
"L'ouverture atlantique", "Sociétés et environnements") : les garder en base
ferait deux objets du même nom à deux places différentes, un en-tête de section
et une ligne dans la liste. Le cinquième ("Des mobilités généralisées") est une
fiche de synthèse que les quatre fiches du chapitre 3 de géographie recouvrent
entièrement.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins à leur chapitre, mais toujours tirables par le moteur de
questions), puis les chapitres, dont les leçons partent en cascade.
Les trois DELETE sont bornés aux CINQ TITRES EXACTS et au seul niveau 2de. Sans
cette borne, un rejeu après coup effacerait les quiz des 40 fiches neuves — le
ménage tourne avant les insertions à CHAQUE passage.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '2de'
   AND c.title IN ('La Méditerranée antique',
                   'La Méditerranée médiévale',
                   'L''ouverture atlantique (XVe-XVIe)',
                   'Sociétés et environnements',
                   'Des mobilités généralisées');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '2de'
   AND c.title IN ('La Méditerranée antique',
                   'La Méditerranée médiévale',
                   'L''ouverture atlantique (XVe-XVIe)',
                   'Sociétés et environnements',
                   'Des mobilités généralisées');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '2de'
   AND c.title IN ('La Méditerranée antique',
                   'La Méditerranée médiévale',
                   'L''ouverture atlantique (XVe-XVIe)',
                   'Sociétés et environnements',
                   'Des mobilités généralisées');`,
    },
  ],

  blocs: [
    {
      niveaux: ['2de'],
      chapitres: [
        // ===================================================================
        // HISTOIRE — Chapitre 1 : L’histoire et son organisation
        // ===================================================================
        {
          titre: 'Les grandes périodes de l’histoire',
          axe: 'L’histoire et son organisation',
          rayon: 'histoire',
          lecon: {
            titre: 'Découper le temps pour pouvoir le penser',
            cours: `L'histoire ne se contente pas de raconter : elle découpe le temps. Les périodes ne sont pas données par le passé, elles sont construites par les historiens.

## Cinq grandes périodes
| La période | Elle commence | Elle finit |
| **Préhistoire** | Les premiers hommes | L'invention de l'écriture, vers 3300 av. J.-C. |
| **Antiquité** | L'écriture | La chute de l'Empire romain d'Occident, en **476** |
| **Moyen Âge** | 476 | **1492**, l'arrivée de Colomb en Amérique |
| **Époque moderne** | 1492 | **1789**, la Révolution française |
| **Époque contemporaine** | 1789 | Elle n'est pas close |

## Des bornes discutables, et discutées
| La question | Ce qu'elle soulève |
| Pourquoi **476** plutôt que 410 ou 622 ? | Le choix d'un événement pour marquer une rupture |
| Pourquoi l'**Europe** donnerait-elle ses dates au monde ? | Ce découpage est né en Europe au XIXe siècle |
| Convient-il à la Chine, à l'Afrique, aux Amériques ? | Il y éclaire mal les évolutions propres |

> Une période n'est pas un fait : c'est un **outil**. On la juge à ce qu'elle permet de comprendre, pas à sa vérité.

## Les mots du temps
| Le mot | Sa durée | Un exemple |
| **Siècle** | Cent ans | Le XVIIIe siècle va de **1701 à 1800** |
| **Millénaire** | Mille ans | — |
| **av. J.-C.** et **apr. J.-C.** | On compte à rebours, puis en avant | Repère chrétien choisi au VIe siècle, devenu conventionnel |

## Sources et traces
| Le type de source | Des exemples |
| **Écrite** | Lois, lettres, journaux |
| **Matérielle** | Fouilles, monuments |
| **Orale** | Témoignages |
| **Iconographique** | Images, peintures |

> L'historien les **critique** avant de les croire : qui parle, quand, pour qui, pourquoi ?`,
          },
          questions: [
            ['Quel événement marque traditionnellement le passage de la Préhistoire à l’Antiquité ?', ['L’invention de l’écriture', 'La découverte du feu', 'La naissance de l’agriculture', 'La fondation de Rome'], 0, 'Vers 3300 av. J.-C. en Mésopotamie : le passé devient lisible autrement que par les objets.'],
            ['Quelle date clôt habituellement le Moyen Âge en France ?', ['1492', '476', '1789', '1918'], 0, 'L’arrivée de Colomb en Amérique ; certains manuels retiennent 1453, la prise de Constantinople.'],
            ['L’époque contemporaine commence en 1789.', ['Vrai', 'Faux'], 0, 'La Révolution française sert de borne — un choix européen, et assumé comme tel.'],
            ['À quelles années correspond le XVIIIe siècle ?', ['1701-1800', '1700-1799', '1800-1899', '1750-1850'], 0, 'Un siècle commence à l’année 1 : il n’y a pas d’année zéro.'],
            ['Le découpage en cinq périodes vaut-il pour toutes les régions du monde ?', ['Non, il est né en Europe et éclaire surtout son histoire', 'Oui, il est universel', 'Oui, il est fixé par l’ONU', 'Non, il ne vaut que pour la France'], 0, 'Appliqué à la Chine ou à l’Afrique, il masque plus qu’il ne montre.'],
            ['Qu’appelle-t-on une source en histoire ?', ['Une trace du passé sur laquelle l’historien travaille', 'Un manuel scolaire', 'Une hypothèse d’historien', 'Un musée'], 0, 'Écrite, matérielle, orale ou iconographique — encore faut-il la critiquer.'],
            ['Que signifie critiquer une source ?', ['Se demander qui parle, quand, pour qui et pourquoi', 'La rejeter comme fausse', 'La résumer', 'La traduire'], 0, 'La critique ne détruit pas la source : elle en fixe la portée.'],
            ['La chute de l’Empire romain d’Occident date de 476.', ['Vrai', 'Faux'], 0, 'Déposition de Romulus Augustule — une borne commode, longtemps préparée.'],
          ],
        },

        // ===================================================================
        // HISTOIRE — Chapitre 2 : La Méditerranée antique
        // ===================================================================
        {
          titre: 'Athènes : la mise en place d’un contexte favorable à la naissance de la démocratie',
          axe: 'La Méditerranée antique : les empreintes grecques et romaines',
          rayon: 'histoire',
          lecon: {
            titre: 'De l’aristocratie à la cité des citoyens',
            cours: `La démocratie athénienne n'est pas tombée du ciel : elle est le produit d'un siècle et demi de crises et de réformes.

## La cité grecque
Le monde grec archaïque est fait de **cités** : un centre urbain, un territoire, des institutions propres.

| L'élément | Ce qu'il est |
| L'**acropole** | La ville haute, celle des dieux |
| L'**agora** | La place publique |
| La **chôra** | La campagne alentour |

## Les réformes qui préparent le terrain
| La date | Le réformateur | Ce qu'il fait |
| **621** av. J.-C. | **Dracon** | Il fait **écrire les lois** : elles cessent d'être le secret des nobles |
| **594** | **Solon** | Il abolit l'esclavage pour dettes et classe les citoyens selon leur **richesse**, non leur naissance |
| **561-527** | **Pisistrate**, tyran | Il affaiblit l'aristocratie foncière et développe les fêtes civiques |

> Chaque réforme retire un peu de pouvoir à la naissance pour en donner à la loi.

## Clisthène, 508-507 av. J.-C.
| La mesure | Son effet |
| Le redécoupage en **dèmes** groupés en **dix tribus** artificielles, mêlant côte, ville et intérieur | Les fidélités locales et familiales sont brisées |
| La création de la **Boulè** des 500, tirée au sort | Le conseil échappe aux grandes familles |
| L'**ostracisme** | Exiler dix ans un citoyen jugé menaçant |

## Ce que la démocratie n'est pas
| Le groupe | Sa situation |
| Les **citoyens** | Hommes, adultes, nés de parents athéniens — loi de Périclès, **451** |
| Les **femmes** | Exclues |
| Les **métèques** | Étrangers libres, exclus |
| Les **esclaves** | Exclus |

> Les exclus forment la grande majorité de la population.`,
          },
          questions: [
            ['Qu’est-ce qu’une cité grecque ?', ['Un État indépendant fait d’une ville et de son territoire', 'Une capitale de royaume', 'Un simple port de commerce', 'Une colonie romaine'], 0, 'Athènes, Sparte, Corinthe : des centaines de cités, chacune avec ses lois.'],
            ['Quelle réforme de Solon sauve la petite paysannerie ?', ['L’abolition de l’esclavage pour dettes', 'Le partage général des terres', 'La création de la Boulè', 'L’ostracisme'], 0, 'En 594, l’endettement ne peut plus réduire un Athénien en esclavage.'],
            ['Que fait Clisthène en 508-507 av. J.-C. ?', ['Il redécoupe la cité en dèmes et dix tribus mêlant les régions', 'Il écrit les premières lois', 'Il instaure la tyrannie', 'Il crée la ligue de Délos'], 0, 'Le brassage géographique brise les clientèles aristocratiques.'],
            ['Qu’est-ce que l’ostracisme ?', ['L’exil de dix ans d’un citoyen jugé dangereux pour la cité', 'Une amende infligée aux riches', 'Une taxe sur le commerce', 'Une charge religieuse'], 0, 'Le nom est gravé sur un tesson, l’ostrakon, d’où le mot.'],
            ['Les femmes athéniennes étaient citoyennes de plein droit.', ['Vrai', 'Faux'], 1, 'Elles transmettent la citoyenneté mais ne votent ni ne siègent.'],
            ['Qui sont les métèques ?', ['Des étrangers libres installés à Athènes, non citoyens', 'Des esclaves affranchis', 'Des citoyens pauvres', 'Des soldats étrangers'], 0, 'Ils paient un impôt spécifique et participent à l’économie sans voter.'],
            ['Quel tyran affaiblit l’aristocratie foncière au VIe siècle av. J.-C. ?', ['Pisistrate', 'Dracon', 'Périclès', 'Thémistocle'], 0, 'Sa tyrannie (561-527) prépare paradoxalement la démocratie.'],
            ['Que change Dracon en 621 av. J.-C. ?', ['Il fait mettre les lois par écrit', 'Il abolit la dette', 'Il crée le tirage au sort', 'Il fonde la marine'], 0, 'Une loi écrite est une loi opposable : elle échappe au monopole des nobles.'],
          ],
        },
        {
          titre: 'Ve siècle av. J.-C. : Athènes, une démocratie au centre d’un empire maritime',
          axe: 'La Méditerranée antique : les empreintes grecques et romaines',
          rayon: 'histoire',
          lecon: {
            titre: 'Le siècle de Périclès, et son revers',
            cours: `Au Ve siècle, Athènes invente un régime où le peuple décide — et, dans le même mouvement, domine ses alliés. Démocratie à l'intérieur, empire à l'extérieur.

## Les guerres médiques
| La bataille | Sa date | Ce qu'elle décide |
| **Marathon** | 490 | La première victoire terrestre sur les Perses |
| **Salamine** | 480 | La victoire **navale** décisive |
| **Platées** | 479 | La fin de l'invasion |

> Salamine doit tout aux rameurs, citoyens pauvres : les **thètes** deviennent indispensables à la cité, donc écoutés dans l'assemblée.

## Les institutions
| L'institution | Sa composition | Son rôle |
| **Ecclésia** | Tous les citoyens, sur la **Pnyx**, une quarantaine de fois par an | Voter les lois, la guerre, la paix |
| **Boulè** des 500 | Tirée au sort | Préparer les séances |
| **Héliée** | Jurés tirés au sort | Juger |
| Les dix **stratèges** | **Élus** | Commander ; Périclès l'est quinze fois de suite |

> **Isonomie** et **isègoria** : égalité devant la loi, égal droit à la parole. Le tirage au sort suppose que n'importe quel citoyen est capable de gouverner.

## Le misthos
Périclès instaure une **indemnité** pour les magistrats et les juges.

> Un artisan peut siéger sans perdre sa journée : l'égalité politique cesse d'être théorique.

## L'empire
| L'étape | Sa date | Ce qui se passe |
| La **ligue de Délos** est fondée | 478 | Pour défendre les Grecs contre les Perses |
| Le trésor est transféré à Athènes | 454 | La ligue devient un instrument de domination |
| Le **phoros**, tribut des alliés | — | Il finance le **Parthénon** |
| La **guerre du Péloponnèse** | 431-404 | La rivalité avec Sparte emporte la puissance athénienne |

Les cités qui se révoltent sont écrasées.`,
          },
          questions: [
            ['Quelle bataille navale de 480 av. J.-C. sauve la Grèce des Perses ?', ['Salamine', 'Marathon', 'Platées', 'Actium'], 0, 'Elle donne un rôle décisif aux rameurs, les citoyens les plus pauvres.'],
            ['Où se réunit l’Ecclésia ?', ['Sur la colline de la Pnyx', 'Sur l’Acropole', 'Dans le Parthénon', 'Au port du Pirée'], 0, 'Une quarantaine de réunions par an, ouvertes à tous les citoyens.'],
            ['Comment sont désignés les 500 membres de la Boulè ?', ['Par tirage au sort', 'Par élection censitaire', 'Par hérédité', 'Par les stratèges'], 0, 'Le tirage au sort suppose que tout citoyen peut gouverner.'],
            ['Quelle magistrature est élue et non tirée au sort ?', ['Les stratèges', 'Les héliastes', 'Les bouleutes', 'Les archontes'], 0, 'Commander une armée exige une compétence : Périclès est stratège quinze fois.'],
            ['Qu’est-ce que le misthos ?', ['Une indemnité versée aux citoyens exerçant une charge', 'Un impôt sur les métèques', 'Le tribut des alliés', 'Une amende judiciaire'], 0, 'Sans elle, seuls les riches auraient eu le temps de gouverner.'],
            ['En quoi la ligue de Délos se transforme-t-elle ?', ['En empire maritime au profit d’Athènes', 'En alliance avec Sparte', 'En confédération égalitaire', 'En ligue commerciale perse'], 0, 'Trésor transféré en 454, tribut détourné vers les grands travaux.'],
            ['Le tribut versé par les alliés s’appelle le phoros.', ['Vrai', 'Faux'], 0, 'Il finance notamment la reconstruction de l’Acropole.'],
            ['Quel conflit oppose Athènes à Sparte de 431 à 404 av. J.-C. ?', ['La guerre du Péloponnèse', 'Les guerres médiques', 'La guerre de Troie', 'La guerre sociale'], 0, 'La défaite met fin à l’hégémonie athénienne.'],
          ],
        },
        {
          titre: 'De la constitution de l’Empire romain à son apogée',
          axe: 'La Méditerranée antique : les empreintes grecques et romaines',
          rayon: 'histoire',
          lecon: {
            titre: 'Une cité devenue monde',
            cours: `Rome commence comme une cité du Latium et finit maîtresse de la Méditerranée, qu'elle appelle *Mare Nostrum*. Sa réussite tient moins aux armes qu'à sa manière d'intégrer les vaincus.

## De la République à l'Empire
| La période | Ses institutions ou son événement |
| La **République**, 509-27 av. J.-C. | Le Sénat, les magistratures, les comices |
| Les conquêtes | Guerres puniques contre Carthage : elles enrichissent et déchirent |
| Les guerres civiles | Dictature de César, assassiné en 44 |
| **27 av. J.-C.** | Octave reçoit le nom d'**Auguste** et concentre les pouvoirs : c'est le **Principat** |

## La paix romaine
| Le repère | Sa valeur |
| La durée | De 27 av. J.-C. au IIe siècle |
| L'extension maximale | Sous **Trajan** (98-117), de la Bretagne à l'Euphrate |
| La population | Environ **60 millions** d'habitants |

> Rome ne détruit pas les peuples conquis : elle en fait des Romains, à son rythme et à ses conditions.

## Romanisation et citoyenneté
| Le vecteur | Sa forme |
| La **ville** | Plan régulier, forum, thermes, amphithéâtre, aqueducs |
| Les **routes** | Elles relient l'Empire |
| La **langue** | Le latin |
| Le **culte impérial** | Il unit les provinces |
| Les **élites locales** | Elles y gagnent des droits, et diffusent le modèle |

| L'étape de la citoyenneté | Sa date |
| Extension progressive aux provinciaux | Ier-IIe siècles |
| L'**édit de Caracalla** | **212** : elle est accordée à presque tous les hommes libres |

## Les limites
Le système repose sur l'**esclavage**, sur l'armée des **limes** et sur une fiscalité lourde.

> Au IIIe siècle, invasions, usurpations et crise monétaire ébranlent l'édifice.`,
          },
          questions: [
            ['En quelle année Octave devient-il Auguste ?', ['27 av. J.-C.', '44 av. J.-C.', '212 apr. J.-C.', '476 apr. J.-C.'], 0, 'Le Principat conserve les apparences de la République.'],
            ['Comment les Romains appelaient-ils la Méditerranée ?', ['Mare Nostrum', 'Pax Romana', 'Limes', 'Imperium'], 0, 'Notre mer : la Méditerranée est devenue un lac romain.'],
            ['Sous quel empereur l’Empire atteint-il son extension maximale ?', ['Trajan', 'Auguste', 'Constantin', 'Néron'], 0, 'Entre 98 et 117, de la Bretagne à la Mésopotamie.'],
            ['Qu’accorde l’édit de Caracalla en 212 ?', ['La citoyenneté romaine à presque tous les hommes libres de l’Empire', 'La liberté de culte aux chrétiens', 'L’affranchissement des esclaves', 'L’exemption d’impôt aux provinces'], 0, 'L’aboutissement d’une longue extension de la citoyenneté.'],
            ['Qu’appelle-t-on le limes ?', ['La frontière fortifiée de l’Empire', 'Le forum d’une ville romaine', 'Le tribut des provinces', 'Le conseil de l’empereur'], 0, 'Mur d’Hadrien, fortins du Rhin et du Danube.'],
            ['La romanisation passe surtout par les campagnes.', ['Vrai', 'Faux'], 1, 'Elle passe d’abord par les villes et par les élites locales.'],
            ['Contre quelle cité Rome mène-t-elle les guerres puniques ?', ['Carthage', 'Athènes', 'Alexandrie', 'Syracuse'], 0, 'Trois guerres, de 264 à 146 av. J.-C., et la destruction de Carthage.'],
            ['Qu’est-ce que la paix romaine ?', ['Une longue période de paix et de prospérité dans les provinces', 'Un traité avec les Perses', 'La fin de l’esclavage', 'Un culte impérial'], 0, 'Elle dure du règne d’Auguste au IIe siècle.'],
          ],
        },
        {
          titre: 'Constantin : la reconstruction d’un empire méditerranéen sur des bases chrétiennes au IVe siècle',
          axe: 'La Méditerranée antique : les empreintes grecques et romaines',
          rayon: 'histoire',
          lecon: {
            titre: 'Un empereur, une capitale, une religion',
            cours: `Après la crise du IIIe siècle, l'Empire se refonde. Constantin lui donne trois choses neuves : un pouvoir absolu, une capitale à l'Est, une religion soutenue.

## Sortir de la crise
| L'étape | Sa date | Ce qu'elle apporte |
| La crise | IIIe siècle | Invasions, empereurs éphémères, effondrement monétaire |
| **Dioclétien** | 284-305 | La **tétrarchie** — quatre empereurs — et une administration renforcée |
| Le **pont Milvius** | 312 | Constantin l'emporte |
| Le règne seul | À partir de **324** | Le système tétrarchique n'a pas survécu à son auteur |

## L'édit de Milan
| La date | **313** |
| Ce qu'il accorde | La **liberté de culte** à tous, chrétiens compris |
| Ce qu'il ne fait pas | Faire du christianisme la religion officielle |
| Qui le fera | **Théodose**, vers 380-392 |

Constantin finance les églises, exempte le clergé et arbitre les querelles.

> Le christianisme passe en une génération de religion **poursuivie** à religion **protégée** par l'État.

## Nicée, 325
Constantin convoque le **concile de Nicée** pour trancher la querelle arienne sur la nature du Christ.

> Un empereur qui réunit les évêques : l'Église et l'État se lient durablement.

## Constantinople
| L'atout du site | Ce qu'il apporte |
| Une position entre **Europe et Asie** | Le contrôle des détroits |
| La proximité des **frontières menacées** | La réaction rapide |
| La proximité des riches provinces d'**Orient** | Les ressources |

| La date | L'étape |
| **330** | Fondation de Constantinople sur le site de Byzance |
| **395** | Le partage de l'Empire ; elle devient la capitale d'un empire d'Orient qui durera mille ans |`,
          },
          questions: [
            ['Qu’accorde l’édit de Milan en 313 ?', ['La liberté de culte, notamment aux chrétiens', 'Le statut de religion officielle au christianisme', 'La citoyenneté à tous les habitants', 'L’exil des païens'], 0, 'Tolérance d’abord ; l’officialisation viendra avec Théodose.'],
            ['Qui fait du christianisme la religion officielle de l’Empire ?', ['Théodose, vers 380-392', 'Constantin en 313', 'Dioclétien en 303', 'Justinien en 529'], 0, 'L’édit de Thessalonique, puis l’interdiction des cultes païens.'],
            ['Quelle bataille donne le pouvoir à Constantin en 312 ?', ['Le pont Milvius', 'Andrinople', 'Actium', 'Zama'], 0, 'La tradition chrétienne y place le signe du Chrisme.'],
            ['Que décide le concile de Nicée en 325 ?', ['Il tranche la querelle sur la nature du Christ', 'Il fonde Constantinople', 'Il divise l’Empire en deux', 'Il abolit l’esclavage'], 0, 'L’arianisme est condamné : l’empereur arbitre le dogme.'],
            ['En quelle année Constantinople est-elle fondée ?', ['330', '313', '395', '476'], 0, 'Sur le site de l’ancienne Byzance, entre Europe et Asie.'],
            ['Le partage définitif de l’Empire entre Orient et Occident date de 395.', ['Vrai', 'Faux'], 0, 'À la mort de Théodose, entre ses deux fils.'],
            ['Qu’est-ce que la tétrarchie ?', ['Le gouvernement de l’Empire par quatre empereurs', 'Un impôt en quatre parts', 'Une assemblée d’évêques', 'Une réforme monétaire'], 0, 'Instituée par Dioclétien, elle ne lui survit pas.'],
            ['Pourquoi le site de Constantinople est-il si bien choisi ?', ['Il est entre Europe et Asie, près des frontières et des provinces riches d’Orient', 'Il est au centre de l’Italie', 'Il est à l’écart des routes commerciales', 'Il est en Afrique du Nord'], 0, 'Un choix stratégique autant que symbolique.'],
          ],
        },
        // ===================================================================
        // HISTOIRE — Chapitre 3 : La Méditerranée médiévale
        // ===================================================================
        {
          titre: 'La Méditerranée, un espace de rencontres et de conflits au Moyen Âge',
          axe: 'La Méditerranée médiévale : espace d’échanges et de conflits à la croisée de trois civilisations',
          rayon: 'histoire',
          lecon: {
            titre: 'Trois civilisations autour d’une même mer',
            cours: `Au Moyen Âge, la Méditerranée n'appartient plus à personne. Trois ensembles s'y font face, se combattent — et ne cessent jamais de se parler.

## Trois mondes, trois centres
| L'ensemble | Son centre | Son organisation |
| La **chrétienté latine** | Rome | Un Occident féodal, morcelé en seigneuries |
| L'**Empire byzantin** | **Constantinople** | Un empire chrétien d'Orient, héritier de Rome |
| L'**Islam** | **Bagdad**, **Le Caire**, **Cordoue** | Un monde riche, urbain et savant |

> Chacun se pense au centre du monde.

## Les croisades
| La date | L'événement |
| **1095** | À Clermont, le pape **Urbain II** appelle à délivrer Jérusalem |
| **1099** | La première croisade prend la ville et fonde les **États latins d'Orient** |
| **1187** | **Saladin** reprend Jérusalem |
| **1204** | La quatrième croisade pille **Constantinople** — des chrétiens contre des chrétiens |
| **1291** | La chute d'**Acre** met fin à la présence latine |

> La croisade est une guerre sainte, mais aussi une entreprise de seigneurs sans terre, de marchands et de villes italiennes qui y gagnent des comptoirs.

## Les autres fronts
| Le front | Les étapes |
| L'Espagne, la **Reconquista** | Tolède (1085), Las Navas de Tolosa (1212), Grenade (**1492**) |
| La **Sicile** | Les Normands prennent le pouvoir sur une île arabe |

## Vivre ensemble malgré tout
| Le lieu | Ce qui s'y passe |
| La Sicile normande | Chrétiens, musulmans et juifs cohabitent, commercent, se traduisent |
| L'Espagne des trois religions | Même chose, sous domination changeante |
| Les États latins | Les Francs vivent au contact des populations locales |

La **dhimma** protège les non-musulmans en terre d'Islam, moyennant un impôt et un statut inférieur.`,
          },
          questions: [
            ['Quelles sont les trois civilisations qui se partagent la Méditerranée médiévale ?', ['Chrétienté latine, Empire byzantin, monde musulman', 'Rome, Carthage, Athènes', 'Francs, Vikings, Slaves', 'Empire ottoman, Venise, Espagne'], 0, 'Trois ensembles qui se combattent et échangent en permanence.'],
            ['Qui appelle à la première croisade en 1095 ?', ['Le pape Urbain II', 'Saint Louis', 'Saladin', 'L’empereur byzantin Basile II'], 0, 'Au concile de Clermont, devant une foule de barons et de clercs.'],
            ['En quelle année les croisés prennent-ils Jérusalem ?', ['1099', '1095', '1187', '1291'], 0, 'La ville est prise au terme d’un siège et d’un massacre.'],
            ['Qui reprend Jérusalem aux Latins en 1187 ?', ['Saladin', 'Baybars', 'Mehmed II', 'Averroès'], 0, 'Après la bataille de Hattin ; la troisième croisade échoue à la reprendre.'],
            ['Que se passe-t-il lors de la quatrième croisade en 1204 ?', ['Les croisés pillent Constantinople, cité chrétienne', 'Ils reprennent Jérusalem', 'Ils conquièrent l’Égypte', 'Ils échouent en Espagne'], 0, 'Le détournement vénitien creuse durablement le fossé entre Latins et Grecs.'],
            ['La Reconquista s’achève en 1492 avec la prise de Grenade.', ['Vrai', 'Faux'], 0, 'Le dernier royaume musulman de la péninsule Ibérique disparaît.'],
            ['Qu’est-ce que la dhimma ?', ['Le statut protégé mais inférieur des juifs et chrétiens en terre d’Islam', 'Une taxe sur les croisés', 'Un traité de paix', 'Un ordre militaire'], 0, 'Protection contre paiement d’un impôt, la jizya.'],
            ['Quelle ville marque en 1291 la fin des États latins d’Orient ?', ['Acre', 'Antioche', 'Édesse', 'Tripoli'], 0, 'Sa chute achève deux siècles de présence latine en Terre sainte.'],
          ],
        },
        {
          titre: 'La Méditerranée, un espace d’échanges entre les civilisations',
          axe: 'La Méditerranée médiévale : espace d’échanges et de conflits à la croisée de trois civilisations',
          rayon: 'histoire',
          lecon: {
            titre: 'Marchandises, mots et savoirs traversent la mer',
            cours: `Pendant que l'on se bat, on commerce, on traduit et on copie. La Méditerranée médiévale est un espace de circulation avant d'être une frontière.

## Les routes du commerce
| La cité italienne | Son dispositif |
| **Venise**, **Gênes**, **Pise** | Des comptoirs, les **fondouks**, dans tous les ports d'Orient et d'Afrique du Nord |

| Ce qu'elles achètent | Ce qu'elles vendent |
| Épices, soie, alun, sucre, esclaves | Draps, métaux, bois, armes |

Les caravanes relient ces ports à l'Asie et au Sahara.

## Les outils du marchand
| L'innovation | Ce qu'elle permet |
| La **lettre de change** | Payer sans transporter d'or |
| La **comptabilité en partie double** | Suivre exactement les comptes |
| L'**assurance maritime** | Répartir le risque du naufrage |
| La **commende** | Associer un bailleur de fonds et un voyageur |
| Les **chiffres dits arabes** | Venus de l'Inde par le monde musulman, ils simplifient le calcul |

> Un port méditerranéen au XIIIe siècle, c'est un lieu où l'on parle quatre langues et où l'on change six monnaies.

## Le transfert des savoirs
| Le savant | Son domaine |
| **Avicenne** | La médecine |
| **Averroès** | Le commentaire d'Aristote |
| **Al-Khwarizmi** | L'algèbre |

| L'atelier de traduction | Ce qu'il transmet |
| **Tolède** | De l'arabe vers le latin |
| **Palerme**, Salerne | Textes grecs et arabes |

L'Occident y redécouvre Aristote, Galien et Ptolémée.

## Des techniques et des mots
| Ce qui voyage | Des exemples |
| Les **techniques** | Papier, boussole, astrolabe, gouvernail d'étambot |
| Les **cultures** | Coton, sucre de canne, agrumes |
| Les **mots** | Amiral, arsenal, douane, tarif, magasin, alcool, algèbre — tous venus de l'arabe |`,
          },
          questions: [
            ['Quelles cités italiennes dominent le grand commerce méditerranéen ?', ['Venise, Gênes et Pise', 'Rome, Naples et Milan', 'Florence, Sienne et Vérone', 'Palerme, Bari et Amalfi'], 0, 'Leurs flottes et leurs comptoirs quadrillent la mer.'],
            ['Qu’est-ce qu’un fondouk ?', ['Un comptoir marchand avec entrepôt et logement dans un port étranger', 'Un navire de commerce', 'Une taxe portuaire', 'Un contrat d’association'], 0, 'Les marchands latins y vivent sous leur propre droit.'],
            ['Quelle technique financière permet de payer sans transporter d’or ?', ['La lettre de change', 'La commende', 'La dîme', 'Le tarif'], 0, 'Elle limite le risque de vol sur les routes.'],
            ['Quelle ville espagnole devient un grand atelier de traduction de l’arabe au latin ?', ['Tolède', 'Grenade', 'Séville', 'Barcelone'], 0, 'Reconquise en 1085, elle garde ses bibliothèques et ses savants.'],
            ['Quel savant persan est l’auteur d’un Canon de la médecine étudié en Europe ?', ['Avicenne', 'Averroès', 'al-Khwarizmi', 'Al-Idrisi'], 0, 'Son ouvrage sert de manuel dans les universités latines pendant des siècles.'],
            ['Averroès est surtout connu comme commentateur d’Aristote.', ['Vrai', 'Faux'], 0, 'Ses commentaires relancent la philosophie en Occident.'],
            ['D’où viennent les chiffres dits arabes ?', ['De l’Inde, transmis par le monde musulman', 'De Grèce', 'De Rome', 'De Chine'], 0, 'Avec eux vient le zéro, qui change tout le calcul.'],
            ['Lequel de ces mots français vient de l’arabe ?', ['Amiral', 'Navire', 'Voile', 'Port'], 0, 'Comme arsenal, douane, tarif, magasin ou algèbre.'],
          ],
        },

        // ===================================================================
        // HISTOIRE — Chapitre 4 : L’ouverture atlantique
        // ===================================================================
        {
          titre: 'L’élargissement du monde au XVe siècle',
          axe: 'L’ouverture atlantique : les conséquences de la découverte du « Nouveau Monde »',
          rayon: 'histoire',
          lecon: {
            titre: 'Pourquoi les Européens prennent la mer',
            cours: `À la fin du XVe siècle, des marins européens franchissent des distances qu'aucun d'eux n'avait tentées. Ce n'est pas un hasard.

## Les motifs
| Le motif | Son contenu |
| L'**or** et les **épices** | La route de la soie est contrôlée par les Ottomans depuis la prise de **Constantinople en 1453** |
| L'**évangélisation** | Porter la foi chrétienne au-delà de l'Europe |
| La **curiosité savante** | Nourrie par l'humanisme et la redécouverte de Ptolémée |
| La **rivalité** | Entre le **Portugal** et la **Castille** |

## Les moyens
| L'outil | Ce qu'il apporte |
| La **caravelle** | Légère, elle peut remonter au vent |
| La **boussole** | La direction, même sans étoiles |
| L'**astrolabe** | La latitude |
| Le **portulan** | Les côtes et les caps |

> On ne découvre pas un monde par accident : on l'atteint parce qu'un État paie, qu'une technique existe et qu'un profit est espéré.

## Les voyages
| La date | Le navigateur | L'exploit |
| **1487** | **Bartolomeu Dias** | Il passe le cap de Bonne-Espérance |
| **12 octobre 1492** | **Christophe Colomb**, pour la Castille | Il touche les Antilles, croyant avoir rejoint l'Asie |
| **1498** | **Vasco de Gama** | Il atteint l'Inde |
| **1519-1522** | **Magellan**, puis Elcano | Le premier tour du monde |

## Le partage
| Le traité | Sa date | Ce qu'il décide |
| **Tordesillas** | 1494 | Une ligne dans l'Atlantique : l'ouest à la Castille, l'est au Portugal — d'où le **Brésil portugais** |

> Deux États s'attribuent des terres qu'ils n'ont pas vues et des peuples qu'ils ne connaissent pas.`,
          },
          questions: [
            ['Quel événement de 1453 rend plus difficile la route terrestre vers l’Asie ?', ['La prise de Constantinople par les Ottomans', 'La chute de Grenade', 'La peste noire', 'La guerre de Cent Ans'], 0, 'Le commerce des épices passe désormais par des intermédiaires ottomans.'],
            ['Quel navire permet les grandes explorations portugaises ?', ['La caravelle', 'La galère', 'Le drakkar', 'Le galion'], 0, 'Légère et gréée pour remonter au vent.'],
            ['Qui franchit le cap de Bonne-Espérance en 1487 ?', ['Bartolomeu Dias', 'Vasco de Gama', 'Christophe Colomb', 'Magellan'], 0, 'La route maritime vers l’Inde devient envisageable.'],
            ['Qui atteint l’Inde par la mer en 1498 ?', ['Vasco de Gama', 'Cabral', 'Colomb', 'Amerigo Vespucci'], 0, 'Il ouvre la route des épices au profit du Portugal.'],
            ['Que croit avoir atteint Colomb en octobre 1492 ?', ['Les Indes, c’est-à-dire l’Asie', 'Un continent inconnu', 'L’Afrique australe', 'Le Groenland'], 0, 'D’où le nom d’Indiens donné aux habitants.'],
            ['Le traité de Tordesillas de 1494 partage le monde entre Portugal et Castille.', ['Vrai', 'Faux'], 0, 'Une ligne dans l’Atlantique : le Brésil tombe côté portugais.'],
            ['Quelle expédition réalise le premier tour du monde ?', ['Celle de Magellan, achevée par Elcano en 1522', 'Celle de Colomb en 1493', 'Celle de Dias en 1488', 'Celle de Cabral en 1500'], 0, 'Partie avec cinq navires, elle revient avec un seul.'],
            ['Quel instrument permet de mesurer la hauteur des astres pour estimer la latitude ?', ['L’astrolabe', 'Le portulan', 'La boussole', 'Le sextant électronique'], 0, 'Avec la boussole et les cartes, il rend la haute mer praticable.'],
          ],
        },
        {
          titre: 'La traite atlantique du XVIe au XIXe siècle : le cœur d’un nouveau circuit économique mondial',
          axe: 'L’ouverture atlantique : les conséquences de la découverte du « Nouveau Monde »',
          rayon: 'histoire',
          lecon: {
            titre: 'Le commerce triangulaire et ses victimes',
            cours: `L'exploitation des Amériques exige une main-d'œuvre que la conquête a détruite. L'Europe la prend en Afrique : c'est la traite atlantique, plus grande déportation de l'histoire.

## Le circuit triangulaire
| L'étape | Le trajet | La cargaison |
| 1 | Nantes, Liverpool ou Bordeaux vers l'**Afrique** | De la **pacotille** : tissus, armes, alcool, verroterie |
| 2 | L'Afrique vers les **Amériques** — le **passage du milieu** | Des **captifs** |
| 3 | Les Amériques vers l'**Europe** | Sucre, café, coton, indigo, tabac |

Trois côtés, trois profits.

## L'ampleur
| Le chiffre | Sa valeur |
| Africains **embarqués** du XVIe au XIXe siècle | Environ **12,5 millions** |
| Africains **débarqués vivants** | Environ **10,7 millions** |
| Le siècle le plus meurtrier | Le **XVIIIe** |
| Les principaux transporteurs | Portugais et Brésiliens, devant Britanniques et Français |

> Le sucre que l'on boit à Paris est produit par des hommes qui ne sont pas payés, sur une terre qui n'est pas la leur, à des milliers de kilomètres de leur naissance.

## La plantation
Aux Antilles et au Brésil, l'**économie de plantation** organise le travail forcé sous la contrainte.

| Le **Code noir** (1685) | Ce qu'il prévoit |
| Le statut de l'esclave | Un **bien meuble** |
| Les châtiments | Autorisés |
| L'affranchissement | Encadré |

## Résistances et abolitions
| La forme de résistance | Son contenu |
| Le **marronnage** | La fuite et les communautés d'évadés |
| Les **révoltes** | Armées, réprimées |
| Le **sabotage** | Quotidien |

| La date | L'étape |
| **1791-1804** | La révolution de Saint-Domingue donne naissance à **Haïti** |
| **1794** | Première abolition française |
| **1802** | Bonaparte rétablit l'esclavage |
| **1848** | Abolition définitive |`,
          },
          questions: [
            ['Quelles sont les trois étapes du commerce triangulaire ?', ['Europe vers Afrique, Afrique vers Amérique, Amérique vers Europe', 'Europe vers Asie, Asie vers Afrique, Afrique vers Europe', 'Afrique vers Europe, Europe vers Amérique, Amérique vers Asie', 'Amérique vers Afrique, Afrique vers Asie, Asie vers Europe'], 0, 'Pacotille, captifs, denrées coloniales : trois profits sur un seul voyage.'],
            ['Combien d’Africains ont été déportés par la traite atlantique ?', ['Environ 12,5 millions d’embarqués', 'Environ 500 000', 'Environ 2 millions', 'Environ 50 millions'], 0, 'Dont environ 10,7 millions ont survécu à la traversée.'],
            ['Comment appelle-t-on la traversée de l’Atlantique par les navires négriers ?', ['Le passage du milieu', 'La route des épices', 'Le grand cabotage', 'La ligne du Sud'], 0, 'Entassement, épidémies, mortalité massive.'],
            ['Que définit le Code noir de 1685 ?', ['Le statut des esclaves dans les colonies françaises', 'Les droits des marins', 'Le monopole du commerce', 'Les tarifs douaniers'], 0, 'Il fait de l’esclave un bien meuble tout en affichant un vernis religieux.'],
            ['Quelle colonie devient indépendante sous le nom de Haïti en 1804 ?', ['Saint-Domingue', 'La Martinique', 'La Guadeloupe', 'La Jamaïque'], 0, 'Première république née d’une révolte d’esclaves victorieuse.'],
            ['La France a aboli l’esclavage une seule fois.', ['Vrai', 'Faux'], 1, 'Aboli en 1794, rétabli en 1802, aboli définitivement en 1848.'],
            ['Quelles denrées les plantations coloniales envoient-elles vers l’Europe ?', ['Sucre, café, coton, indigo et tabac', 'Blé, seigle et vin', 'Épices et soie', 'Or et argent uniquement'], 0, 'Des produits qui transforment la consommation européenne.'],
            ['Quel port français s’enrichit particulièrement par la traite au XVIIIe siècle ?', ['Nantes', 'Marseille', 'Strasbourg', 'Lyon'], 0, 'Avec Bordeaux et La Rochelle, il arme des centaines d’expéditions.'],
          ],
        },
        {
          titre: 'Les conséquences des grandes découvertes',
          axe: 'L’ouverture atlantique : les conséquences de la découverte du « Nouveau Monde »',
          rayon: 'histoire',
          lecon: {
            titre: 'Un choc des mondes, très inégal',
            cours: `L'ouverture atlantique n'est pas une rencontre : c'est une conquête. Elle transforme l'Amérique, enrichit l'Europe et rebat les cartes de l'économie mondiale.

## L'effondrement des empires amérindiens
| Le conquistador | L'empire abattu | La date |
| **Cortés** | Les **Aztèques** | 1519-1521 |
| **Pizarro** | Les **Incas** | 1532-1533 |

| Le facteur | Son poids |
| Les **armes à feu** et les chevaux | Réel, mais limité |
| Les **alliances** avec des peuples soumis | Décisif militairement |
| Les **microbes** — variole, rougeole, typhus | **Le plus meurtrier** : des populations sans immunité |

> La population indigène chute de 80 à 90 % en un siècle, selon les estimations.

## L'échange colombien
| D'Amérique vers l'Europe | D'Europe vers l'Amérique |
| Maïs, pomme de terre, tomate | Blé, canne à sucre |
| Cacao, tabac, haricot, piment | Bœufs, chevaux, moutons |

> La pomme de terre a nourri l'Europe du XIXe siècle ; le cheval a refait la vie des plaines nord-américaines. Aucun de ces effets n'a été voulu.

## L'argent et les prix
| Le fait | Sa conséquence |
| Les mines de **Potosí** et de Zacatecas | Elles inondent l'Europe de métal précieux |
| La **révolution des prix** | Une longue hausse qui appauvrit les rentiers et favorise les marchands |
| La dette espagnole | L'Espagne s'endette **malgré** son or |

## Un débat moral
| La date | L'événement |
| Dès **1511** | Des religieux protestent contre le traitement des Indiens |
| **1550-1551** | La **controverse de Valladolid** oppose **Las Casas**, défenseur des Amérindiens, à **Sepúlveda**, qui justifie la conquête |

> Le débat ne met pas fin à l'exploitation, mais il pose une question neuve : l'humanité de l'autre.`,
          },
          questions: [
            ['Qui conquiert l’Empire aztèque entre 1519 et 1521 ?', ['Hernán Cortés', 'Francisco Pizarro', 'Christophe Colomb', 'Vasco de Gama'], 0, 'Avec quelques centaines d’hommes et de nombreux alliés indigènes.'],
            ['Quelle est la principale cause de l’effondrement démographique amérindien ?', ['Les maladies importées, comme la variole', 'La famine organisée', 'Les migrations vers le nord', 'La guerre entre peuples indigènes'], 0, 'Des populations sans immunité face à des microbes venus d’Europe.'],
            ['Quelle plante venue d’Amérique transforme l’alimentation européenne ?', ['La pomme de terre', 'Le blé', 'Le riz', 'L’olivier'], 0, 'Avec le maïs, la tomate, le cacao et le haricot.'],
            ['Que désigne la révolution des prix au XVIe siècle ?', ['Une longue hausse des prix liée à l’afflux d’argent américain', 'Une chute des prix agricoles', 'Une réforme fiscale espagnole', 'Un krach bancaire à Anvers'], 0, 'Elle avantage les marchands et ruine les revenus fixes.'],
            ['Quelle mine d’argent symbolise la richesse coloniale espagnole ?', ['Potosí', 'Ouro Preto', 'Zacatecas seul', 'Cerro Verde'], 0, 'Dans l’actuelle Bolivie, exploitée au prix d’un travail forcé.'],
            ['La controverse de Valladolid oppose Las Casas à Sepúlveda.', ['Vrai', 'Faux'], 0, 'Sur la légitimité de la conquête et l’humanité des Amérindiens.'],
            ['Qui conquiert l’Empire inca en 1532-1533 ?', ['Francisco Pizarro', 'Hernán Cortés', 'Diego Velázquez', 'Pedro Álvares Cabral'], 0, 'La capture d’Atahualpa décapite l’empire.'],
            ['Qu’appelle-t-on l’échange colombien ?', ['La circulation d’espèces animales et végétales entre les continents', 'Le traité de Tordesillas', 'Le commerce triangulaire', 'La révolution des prix'], 0, 'Un bouleversement écologique mondial, largement involontaire.'],
          ],
        },

        // ===================================================================
        // HISTOIRE — Chapitre 5 : Renaissance, Humanisme et réformes
        // ===================================================================
        {
          titre: 'Renaissance et Humanisme : les mutations de l’Europe',
          axe: 'Renaissance, Humanisme et réformes religieuses : les mutations de l’Europe',
          rayon: 'histoire',
          lecon: {
            titre: 'L’homme au centre, le livre pour le dire',
            cours: `Entre le XIVe et le XVIe siècle, une manière neuve de penser gagne l'Europe. Elle remet l'homme au centre, relit les Anciens, et se répand grâce à une machine.

## L'humanisme
| L'humaniste | Son œuvre ou son apport |
| **Pétrarque** | Il inaugure le mouvement en Italie |
| **Érasme** | Un Nouveau Testament en grec |
| **Thomas More** | *L'Utopie* |
| **Rabelais**, **Montaigne** | Ils écrivent en français |

Les humanistes relisent les textes grecs et latins **dans leur langue d'origine**, et font confiance à la raison et à l'éducation. Ils forment une république des lettres qui correspond d'un bout à l'autre du continent.

## L'imprimerie
| Le fait | Sa portée |
| **Gutenberg**, vers **1450**, à Mayence | Les caractères mobiles métalliques |
| En cinquante ans | Des millions de volumes circulent |
| Le prix d'un livre | Divisé par dix |
| La vitesse d'une idée | Des semaines, non des années |

> Sans l'imprimerie, la Réforme serait restée une querelle d'université allemande.

## La Renaissance artistique
| L'innovation | Ce qu'elle change |
| La redécouverte de l'**Antiquité** | Modèles, proportions, sujets |
| La **perspective linéaire** | Un espace cohérent et mesurable |
| L'étude de l'**anatomie** | Des corps justes |
| La **signature** | L'artiste sort de l'anonymat |

Florence, Rome et Venise donnent le ton avec **Brunelleschi**, **Michel-Ange**, **Raphaël**, **Botticelli**. Le **mécénat** des Médicis, des papes et des princes finance l'essentiel.

## Le passage en France
| La date | L'étape |
| 1494-1559 | Les **guerres d'Italie** font découvrir aux Français les palais italiens |
| — | **François Ier** attire Léonard de Vinci et bâtit Chambord |
| **1530** | Fondation du **Collège de France** |
| **1539** | L'ordonnance de **Villers-Cotterêts** impose le français dans les actes officiels |`,
          },
          questions: [
            ['Qu’est-ce que l’humanisme ?', ['Un courant qui place l’homme au centre et relit les textes antiques', 'Une doctrine religieuse protestante', 'Un système politique italien', 'Une école de peinture flamande'], 0, 'Confiance dans la raison, l’éducation et la langue des Anciens.'],
            ['Qui met au point l’imprimerie à caractères mobiles vers 1450 ?', ['Gutenberg', 'Érasme', 'Copernic', 'Brunelleschi'], 0, 'À Mayence : des millions de volumes en cinquante ans.'],
            ['Quel humaniste néerlandais publie un Nouveau Testament en grec ?', ['Érasme', 'Thomas More', 'Montaigne', 'Machiavel'], 0, 'Revenir au texte original est un geste humaniste par excellence.'],
            ['Quelle invention picturale donne la profondeur à un tableau de la Renaissance ?', ['La perspective linéaire', 'Le sfumato seul', 'La fresque', 'La gravure sur bois'], 0, 'Un espace construit géométriquement, avec un point de fuite.'],
            ['Qu’est-ce que le mécénat ?', ['Le financement des artistes par des princes, des papes ou des banquiers', 'Un impôt sur les œuvres d’art', 'Une corporation de peintres', 'Un contrat d’apprentissage'], 0, 'Les Médicis à Florence en sont le modèle.'],
            ['L’ordonnance de Villers-Cotterêts impose le français dans les actes officiels en 1539.', ['Vrai', 'Faux'], 0, 'Signée par François Ier : le latin recule dans l’administration.'],
            ['Quelle institution François Ier fonde-t-il en 1530 ?', ['Le Collège de France', 'La Sorbonne', 'L’Académie française', 'L’Institut de France'], 0, 'Pour enseigner le grec, l’hébreu et les mathématiques hors du contrôle de la Sorbonne.'],
            ['Quel événement fait découvrir aux Français l’art italien ?', ['Les guerres d’Italie', 'La croisade contre les Albigeois', 'La guerre de Cent Ans', 'La Ligue de Cambrai'], 0, 'De 1494 à 1559, les rois y ramènent artistes et modèles.'],
          ],
        },
        {
          titre: 'Les réformes religieuses',
          axe: 'Renaissance, Humanisme et réformes religieuses : les mutations de l’Europe',
          rayon: 'histoire',
          lecon: {
            titre: 'La chrétienté occidentale se brise',
            cours: `Au XVIe siècle, l'unité religieuse de l'Occident vole en éclats. Ce n'est pas seulement une querelle de théologiens : c'est une affaire d'États, de guerres et de frontières encore visibles.

## Les causes
| La critique | Ce qu'elle vise |
| Le train de vie du haut clergé | Le luxe et le cumul des bénéfices |
| L'ignorance des curés | La faiblesse de la formation |
| Les **indulgences** | Des remises de peine vendues pour financer Saint-Pierre de Rome |
| L'**humanisme** | Il exige le retour aux textes, et fournit les outils de la critique |

## Les trois protestantismes
| Le réformateur | Le lieu et la date | Le courant né |
| **Luther** | Allemagne, **1517** | Le **luthéranisme** |
| **Calvin** | Genève, *Institution de la religion chrétienne*, **1536** | Le **calvinisme** |
| **Henri VIII** | Angleterre, Acte de suprématie, **1534** | L'**anglicanisme** |

Tous récusent l'autorité du pape. Luther et Calvin réduisent les sacrements à deux, refusent le culte des saints et affirment le salut par la foi.

> Une même Bible, lue dans la langue de chacun, et voilà l'unité de la chrétienté impossible à maintenir par la seule autorité.

## La réponse catholique
| L'instrument | Ce qu'il fait |
| Le **concile de Trente** (1545-1563) | Il réaffirme les dogmes contestés, condamne les abus, impose des **séminaires** |
| L'**art baroque** | Il relance la foi par l'émotion |
| Les **jésuites**, fondés en 1540 | Ils enseignent et évangélisent |
| L'**Inquisition** et l'**Index** | Ils encadrent la pensée |

## Les guerres
| Le lieu | L'événement | Sa date |
| L'Empire | La paix d'**Augsbourg** : le prince choisit la religion de ses sujets | 1555 |
| La France | Les **guerres de Religion** | 1562-1598 |
| Paris | La **Saint-Barthélemy** | 1572 |
| La France | L'**édit de Nantes** : liberté de conscience et places de sûreté aux protestants | 1598 |`,
          },
          questions: [
            ['Quelle pratique de l’Église déclenche la protestation de Luther ?', ['La vente des indulgences', 'Le célibat des prêtres', 'La messe en latin', 'Le jeûne du carême'], 0, 'Elle finance la basilique Saint-Pierre et scandalise les fidèles allemands.'],
            ['Qui fonde la réforme calviniste et où ?', ['Calvin, à Genève', 'Luther, à Wittenberg', 'Zwingli, à Zurich', 'Knox, à Édimbourg'], 0, 'Son Institution de la religion chrétienne paraît en 1536.'],
            ['Pourquoi Henri VIII rompt-il avec Rome en 1534 ?', ['Pour obtenir son divorce et prendre la tête de l’Église d’Angleterre', 'Par adhésion au luthéranisme', 'Pour supprimer la messe', 'Sous la pression du Parlement écossais'], 0, 'L’Acte de suprématie fait du roi le chef de l’Église anglicane.'],
            ['Que fait le concile de Trente entre 1545 et 1563 ?', ['Il réaffirme les dogmes catholiques et corrige les abus', 'Il réconcilie catholiques et protestants', 'Il abolit le culte des saints', 'Il crée l’Église anglicane'], 0, 'Séminaires, catéchisme, discipline du clergé : la Réforme catholique.'],
            ['Quel ordre religieux, fondé en 1540, se consacre à l’enseignement et à la mission ?', ['Les jésuites', 'Les bénédictins', 'Les franciscains', 'Les dominicains'], 0, 'Fondé par Ignace de Loyola, il devient le bras éducatif de Rome.'],
            ['La paix d’Augsbourg de 1555 laisse chaque prince choisir la religion de ses sujets.', ['Vrai', 'Faux'], 0, 'La formule consacre la division religieuse de l’Empire.'],
            ['Quel massacre marque les guerres de Religion françaises en 1572 ?', ['La Saint-Barthélemy', 'La journée des Barricades', 'Le sac de Rome', 'La défenestration de Prague'], 0, 'Des milliers de protestants tués à Paris et en province.'],
            ['Qu’accorde l’édit de Nantes en 1598 ?', ['La liberté de conscience et des places de sûreté aux protestants', 'L’égalité totale des cultes', 'La suppression du catholicisme d’État', 'L’expulsion des jésuites'], 0, 'Signé par Henri IV, il sera révoqué en 1685.'],
          ],
        },
        {
          titre: 'Martin Luther et le protestantisme',
          axe: 'Renaissance, Humanisme et réformes religieuses : les mutations de l’Europe',
          rayon: 'histoire',
          lecon: {
            titre: 'Un moine, 95 thèses, une Europe coupée en deux',
            cours: `Martin Luther (1483-1546) ne voulait pas fonder une Église. Il voulait réformer la sienne. En vingt ans, son geste redessine la carte religieuse de l'Europe.

## Le geste de 1517
Moine augustin et professeur à **Wittenberg**, Luther rédige ses **95 thèses** contre les indulgences.

> Imprimées et traduites, elles circulent en quelques semaines dans tout l'Empire : c'est le premier scandale de l'ère de l'imprimé.

## La doctrine
| Le principe | Son contenu |
| La **foi seule** | Le salut ne s'achète ni ne se mérite par les œuvres |
| L'**Écriture seule** | La Bible fait autorité, non la tradition |
| Le **sacerdoce universel** | Tout croyant est prêtre |

| Ce qui subsiste | Ce qui est rejeté |
| Deux sacrements : baptême et eucharistie | Le culte des saints, le purgatoire |
| — | Le célibat des prêtres, l'autorité du pape |

> Traduire la Bible en allemand, c'est décider que chacun peut lire par lui-même — et donc juger par lui-même.

## La rupture
| La date | L'événement |
| **1520** | Excommunié par une bulle, Luther **brûle** le document |
| **1521** | Convoqué à la **diète de Worms** devant Charles Quint, il refuse de se rétracter |
| Après Worms | Mis au ban de l'Empire, il est caché à la **Wartburg**, où il traduit le Nouveau Testament |

## Les conséquences
| Le fait | Son ressort |
| Des princes allemands adoptent la Réforme | Par conviction, souvent aussi pour saisir les **biens d'Église** |
| La **guerre des paysans**, 1524-1525 | Écrasée avec l'appui de Luther, qui refuse la révolution sociale |
| La **paix d'Augsbourg**, 1555 | Elle fige le partage : Nord luthérien, Sud catholique |`,
          },
          questions: [
            ['En quelle année Luther rédige-t-il ses 95 thèses ?', ['1517', '1521', '1534', '1555'], 0, 'Contre les indulgences, à Wittenberg.'],
            ['Quel principe résume la doctrine luthérienne du salut ?', ['Le salut par la foi seule', 'Le salut par les œuvres', 'Le salut par les indulgences', 'Le salut par les sacrements'], 0, 'Avec l’Écriture seule et le sacerdoce universel.'],
            ['Devant qui Luther refuse-t-il de se rétracter en 1521 ?', ['Charles Quint, à la diète de Worms', 'Le pape Léon X, à Rome', 'François Ier, à Paris', 'Le concile de Trente'], 0, 'Il est ensuite mis au ban de l’Empire.'],
            ['Que traduit Luther pendant sa retraite à la Wartburg ?', ['Le Nouveau Testament en allemand', 'Le Coran en latin', 'La Somme théologique', 'Les Évangiles en français'], 0, 'Une traduction qui fixe durablement la langue allemande écrite.'],
            ['Combien de sacrements le luthéranisme conserve-t-il ?', ['Deux', 'Sept', 'Trois', 'Aucun'], 0, 'Le baptême et l’eucharistie, les seuls fondés sur l’Écriture selon Luther.'],
            ['Luther soutient la révolte des paysans de 1524-1525.', ['Vrai', 'Faux'], 1, 'Il appelle au contraire les princes à l’écraser.'],
            ['Pourquoi certains princes allemands adoptent-ils la Réforme ?', ['Par conviction, mais aussi pour saisir les biens de l’Église', 'Pour obéir au pape', 'Pour rejoindre l’Empire ottoman', 'Pour éviter la guerre avec la France'], 0, 'La sécularisation des biens ecclésiastiques est un gain considérable.'],
            ['Quelle est la conséquence religieuse durable de la paix d’Augsbourg ?', ['Le nord de l’Allemagne devient luthérien, le sud reste catholique', 'L’Allemagne devient entièrement protestante', 'Le calvinisme devient religion d’Empire', 'Le pape reprend le contrôle de l’Empire'], 0, 'Une frontière confessionnelle encore lisible aujourd’hui.'],
          ],
        },
        {
          titre: 'Léonard de Vinci, symbole de l’humanisme',
          axe: 'Renaissance, Humanisme et réformes religieuses : les mutations de l’Europe',
          rayon: 'histoire',
          lecon: {
            titre: 'Peindre, disséquer, calculer : un seul mouvement',
            cours: `Léonard de Vinci (1452-1519) tient dans une seule vie ce que l'humanisme espère : un homme qui observe le monde et refuse de séparer l'art de la science.

## L'atelier florentin
Né près de Vinci, fils illégitime d'un notaire, il entre vers 1467 dans l'atelier de **Verrocchio** à Florence.

> On y apprend la peinture, la sculpture, la mécanique, la fonte, la scénographie : l'artiste de la Renaissance est d'abord un **technicien**.

## Le peintre
| L'œuvre | Sa date | Son lieu |
| La **Cène** | 1495-1498 | Milan |
| La **Joconde** | Vers 1503-1519 | — |
| La Vierge aux rochers | — | — |

| L'innovation | Ce qu'elle produit |
| Le **sfumato** | Un fondu qui supprime les contours nets |
| La composition **géométrique** | Une architecture invisible du tableau |

Il peint peu et laisse beaucoup d'œuvres inachevées.

## Le savant
| Le domaine étudié | Ce qu'il en tire |
| L'**anatomie** | Une trentaine de dissections ; le fœtus dans l'utérus |
| Le **vol des oiseaux** | Des projets de machine volante |
| L'eau et la **lumière** | Tourbillons, ombres, reflets |
| La **mécanique** | Char d'assaut, pont mobile, scaphandre |

> Ses carnets comptent des milliers de pages, écrites en miroir. Rien n'y est décoratif — et presque rien n'a été construit.

## Le service des princes
| Le protecteur | Le lieu |
| **Ludovic Sforza** | Milan |
| César Borgia | Les Romagnes |
| La République de Florence | Florence |
| **François Ier** | Le **Clos Lucé**, à Amboise, où il meurt en **1519** |

> L'artiste devient un personnage que les princes se disputent : c'est nouveau.`,
          },
          questions: [
            ['Dans l’atelier de quel maître florentin Léonard se forme-t-il ?', ['Verrocchio', 'Botticelli', 'Michel-Ange', 'Raphaël'], 0, 'On y apprenait autant la mécanique que la peinture.'],
            ['Quelle technique picturale Léonard perfectionne-t-il ?', ['Le sfumato', 'Le pointillisme', 'La fresque sèche', 'Le clair-obscur ténébriste'], 0, 'Un fondu qui adoucit les contours et les passages de lumière.'],
            ['Où se trouve la Cène peinte par Léonard ?', ['À Milan', 'À Florence', 'À Rome', 'À Amboise'], 0, 'Dans le réfectoire de Santa Maria delle Grazie.'],
            ['Que contiennent les carnets de Léonard ?', ['Des dessins scientifiques, techniques et anatomiques', 'Uniquement des esquisses de tableaux', 'Sa correspondance diplomatique', 'Des poèmes en latin'], 0, 'Écrits en miroir, ils mêlent art et science sans les séparer.'],
            ['Quel roi de France invite Léonard en 1516 ?', ['François Ier', 'Louis XII', 'Henri II', 'Charles VIII'], 0, 'Il l’installe au Clos Lucé, près du château d’Amboise.'],
            ['Léonard a réalisé la plupart des machines qu’il a dessinées.', ['Vrai', 'Faux'], 1, 'Ce sont des projets, rarement construits de son vivant.'],
            ['Pourquoi Léonard incarne-t-il l’idéal humaniste ?', ['Il unit l’art, la technique et la science dans une même curiosité', 'Il a traduit la Bible', 'Il a fondé une université', 'Il a dirigé un État'], 0, 'L’homme universel, capable dans tous les domaines.'],
            ['En quelle année Léonard meurt-il ?', ['1519', '1492', '1547', '1503'], 0, 'À Amboise, au service du roi de France.'],
          ],
        },
        // ===================================================================
        // HISTOIRE — Chapitre 6 : L’affirmation de l’État dans le royaume de France
        // ===================================================================
        {
          titre: 'La naissance de la monarchie absolue en France',
          axe: 'L’affirmation de l’État dans le royaume de France',
          rayon: 'histoire',
          lecon: {
            titre: 'Un roi, une loi, une administration',
            cours: `Entre la fin des guerres de Religion et le règne personnel de Louis XIV, l'État français se construit : il centralise, il taxe, il surveille — et il se met en scène.

## Ce qu'absolu veut dire
| Le pouvoir du roi | Ce qui le borne |
| Il tient son pouvoir de **Dieu** — le droit divin | Les **lois fondamentales** du royaume |
| Il fait la loi | Les **coutumes** des provinces |
| Il rend la justice en dernier ressort | Les **privilèges** des corps et des villes |
| Il lève l'impôt et décide de la guerre | — |

> Absolu ne veut pas dire arbitraire.

## Les artisans
| Le personnage | Ce qu'il fait |
| **Henri IV** | Il rétablit la paix civile — édit de Nantes, 1598 — et les finances avec **Sully** |
| **Richelieu**, sous Louis XIII | Il abat les places fortes protestantes, crée les **intendants**, soumet les Grands |
| **Mazarin** | Il poursuit malgré la **Fronde** (1648-1653), révolte des parlements et des princes |

> La Fronde apprend à Louis XIV deux choses : ne jamais laisser Paris décider, et ne jamais gouverner par un ministre principal.

## Le règne personnel
| L'année | **1661**, à la mort de Mazarin : Louis XIV gouverne seul |
| Les **états généraux** | Il ne les réunit plus |
| Les **parlements** | Tenus en lisière |
| Son appui | Des conseils spécialisés et des ministres issus de la bourgeoisie, comme **Colbert** |

## Le décor du pouvoir
| L'instrument | Ce qu'il produit |
| **Versailles**, où la cour s'installe en **1682** | La noblesse est mise sous les yeux du roi |
| L'**étiquette** | Une hiérarchie visible à chaque geste |
| Le symbole **solaire**, les portraits | Une image qui circule dans toute l'Europe |
| L'**Académie** et les fêtes | Le prestige culturel au service du règne |

> Gouverner, c'est aussi être vu.`,
          },
          questions: [
            ['D’où le roi absolu tient-il son pouvoir selon la doctrine du temps ?', ['De Dieu', 'Du peuple', 'Des états généraux', 'Du Parlement de Paris'], 0, 'C’est la monarchie de droit divin.'],
            ['Le pouvoir absolu signifie-t-il un pouvoir sans aucune limite ?', ['Non : lois fondamentales, coutumes et privilèges le bornent', 'Oui, le roi peut tout', 'Oui, sauf en matière religieuse', 'Non, il est limité par une constitution écrite'], 0, 'Absolu ne veut pas dire arbitraire.'],
            ['Quel ministre de Louis XIII crée les intendants ?', ['Richelieu', 'Sully', 'Colbert', 'Mazarin'], 0, 'Des agents révocables envoyés dans les provinces au nom du roi.'],
            ['Qu’est-ce que la Fronde ?', ['Une révolte des parlements et des princes entre 1648 et 1653', 'Une guerre contre l’Espagne', 'Une révolte paysanne bretonne', 'Un complot protestant'], 0, 'Elle marque durablement le jeune Louis XIV.'],
            ['En quelle année Louis XIV commence-t-il son règne personnel ?', ['1661', '1643', '1682', '1685'], 0, 'À la mort de Mazarin, il décide de gouverner sans principal ministre.'],
            ['Louis XIV réunit régulièrement les états généraux.', ['Vrai', 'Faux'], 1, 'Ils ne sont plus convoqués de 1614 à 1789.'],
            ['En quelle année la cour s’installe-t-elle à Versailles ?', ['1682', '1661', '1715', '1670'], 0, 'La noblesse y vit sous le regard permanent du roi.'],
            ['À quoi sert l’étiquette de la cour ?', ['À hiérarchiser la noblesse et à la tenir sous le contrôle du roi', 'À réduire les dépenses de la cour', 'À former les officiers', 'À organiser la justice'], 0, 'Un lever du roi est un acte politique.'],
          ],
        },
        {
          titre: 'La monarchie française et l’économie',
          axe: 'L’affirmation de l’État dans le royaume de France',
          rayon: 'histoire',
          lecon: {
            titre: 'Colbert, ou l’État marchand',
            cours: `Un État qui veut une grande armée a besoin d'argent. Sous Louis XIV, Colbert fait de l'économie un instrument de puissance : c'est le colbertisme.

## L'idée mercantiliste
| Le postulat | La conséquence |
| La richesse du monde est **fixe** | Ce qu'un royaume gagne, un autre le perd |
| Il faut **vendre plus qu'on n'achète** | Pour attirer l'or et l'argent |
| La balance commerciale | Devient une affaire d'État |

## Les moyens de Colbert
Contrôleur général des finances de **1665 à 1683**.

| Le moyen | Son contenu |
| Les **manufactures royales** | Gobelins pour la tapisserie, Saint-Gobain pour les glaces, Villeneuvette pour le drap |
| Les **règlements** de fabrication | Très stricts, pour garantir la qualité et donc l'export |
| Les **tarifs douaniers** | Relevés en 1664 et 1667 |
| La **marine** | Développée, avec ses arsenaux |
| Les **compagnies de commerce** | Indes orientales, Indes occidentales, Levant |

> Faire venir la richesse chez soi et empêcher qu'elle en sorte : toute la politique tient dans cette phrase.

## Aménager le royaume
| L'aménagement | Son objet |
| Routes et ports | Faire circuler les marchandises |
| Les arsenaux de **Rochefort** et de **Toulon** | Construire la flotte |
| Le **canal du Midi**, achevé par Riquet en 1681 | Relier l'Atlantique à la Méditerranée |
| Le **Code noir** (1685) | Organiser le travail servile dans les colonies qui alimentent ce commerce |

## Les limites
| La limite | Son effet |
| Les **guerres** de Louis XIV | Elles engloutissent les recettes |
| La **fiscalité** | La **taille** pèse sur les paysans et épargne nobles et clergé |
| La **révocation de l'édit de Nantes** (1685) | Des dizaines de milliers de protestants — souvent artisans et négociants — partent vers l'Angleterre, la Hollande et la Prusse |`,
          },
          questions: [
            ['Quel principe fonde le mercantilisme ?', ['Vendre à l’étranger plus qu’on ne lui achète pour attirer les métaux précieux', 'Supprimer les droits de douane', 'Laisser faire le marché', 'Interdire le commerce extérieur'], 0, 'La richesse mondiale y est vue comme une somme fixe.'],
            ['Quelle fonction Colbert occupe-t-il auprès de Louis XIV ?', ['Contrôleur général des finances', 'Chancelier de France', 'Connétable', 'Archevêque de Paris'], 0, 'De 1665 à 1683, il tient aussi la marine et les manufactures.'],
            ['Qu’est-ce qu’une manufacture royale ?', ['Un établissement de production privilégié et contrôlé par l’État', 'Un marché hebdomadaire', 'Un entrepôt portuaire', 'Une corporation d’artisans'], 0, 'Gobelins, Saint-Gobain : qualité imposée, débouchés garantis.'],
            ['Quel grand ouvrage reliant l’Atlantique à la Méditerranée est achevé en 1681 ?', ['Le canal du Midi', 'Le canal de Bourgogne', 'Le canal Saint-Martin', 'Le canal de Briare'], 0, 'Conçu par Pierre-Paul Riquet.'],
            ['Quelle mesure de 1685 prive le royaume de nombreux artisans et négociants ?', ['La révocation de l’édit de Nantes', 'La création de la taille', 'La fermeture des ports', 'L’édit de Villers-Cotterêts'], 0, 'Les protestants émigrent vers l’Angleterre, la Hollande et la Prusse.'],
            ['La taille était payée par la noblesse et le clergé.', ['Vrai', 'Faux'], 1, 'Ils en sont exemptés : le poids retombe sur les paysans.'],
            ['Pourquoi Colbert relève-t-il les tarifs douaniers en 1664 et 1667 ?', ['Pour protéger la production française de la concurrence étrangère', 'Pour financer Versailles', 'Pour plaire aux marchands hollandais', 'Pour réduire le prix du pain'], 0, 'Le protectionnisme est le bras armé du mercantilisme.'],
            ['Qu’est-ce qui ruine finalement les efforts financiers de Colbert ?', ['Le coût des guerres de Louis XIV', 'La chute du commerce colonial', 'Une révolte des manufactures', 'La disparition du canal du Midi'], 0, 'Les dépenses militaires absorbent l’essentiel des recettes.'],
          ],
        },
        {
          titre: 'La construction et les limites de la monarchie absolue face à la noblesse',
          axe: 'L’affirmation de l’État dans le royaume de France',
          rayon: 'histoire',
          lecon: {
            titre: 'Domestiquer les Grands sans les détruire',
            cours: `La monarchie absolue n'écrase pas la noblesse : elle négocie avec elle, l'achète, la met en scène — et bute sur des privilèges qu'elle ne peut pas supprimer.

## Deux noblesses
| La noblesse | Son origine | Son prestige |
| D'**épée** | Ancienne | Le service militaire |
| De **robe** | Plus récente | Les offices de justice et de finance, souvent achetés |

> Les deux se disputent la préséance, ce dont le roi tire parti.

## Les instruments du roi
| L'instrument | Ce qu'il produit |
| La **cour** | Elle attache les Grands par les pensions, les charges, l'honneur d'approcher le roi |
| Les **intendants** | Choisis hors de la noblesse d'épée, ils administrent les provinces |
| La **vénalité des offices** | Elle enrichit le Trésor — mais crée des propriétaires de charges difficiles à révoquer |
| Les **gouverneurs** | Ils perdent l'essentiel de leur pouvoir réel |

> Un noble ruiné à Versailles est moins dangereux qu'un noble puissant dans sa province.

## Les résistances
| L'acteur | Son arme | La riposte royale |
| Les **parlements**, cours de justice | Le **droit de remontrance**, qui retarde et critique | Le **lit de justice**, qui impose l'enregistrement |

Sous Louis XV et Louis XVI, ces conflits deviennent une véritable opposition politique.

## Les limites structurelles
La monarchie ne peut pas toucher aux **privilèges fiscaux** sans provoquer une crise.

| Le réformateur | Le sort de sa réforme |
| Machault d'Arnouville | Échec |
| **Turgot** | Échec |
| **Necker** | Échec |
| **Calonne** | Échec |

> Faute de pouvoir réformer l'impôt, Louis XVI convoque les **états généraux** en 1789 — et l'absolutisme y meurt.`,
          },
          questions: [
            ['Quelles sont les deux grandes composantes de la noblesse d’Ancien Régime ?', ['La noblesse d’épée et la noblesse de robe', 'La noblesse de cour et la noblesse d’Église', 'Les ducs et les barons', 'Les seigneurs et les vassaux'], 0, 'L’une vient du service militaire, l’autre des offices.'],
            ['Qu’est-ce que la vénalité des offices ?', ['La possibilité d’acheter une charge publique', 'L’impôt payé par les nobles', 'Le droit de rendre la justice', 'La vente des terres seigneuriales'], 0, 'Elle remplit les caisses mais rend les titulaires difficiles à révoquer.'],
            ['Qu’est-ce que le droit de remontrance ?', ['Le droit des parlements de critiquer un édit avant de l’enregistrer', 'Le droit du roi de casser un jugement', 'Le droit des paysans de pétitionner', 'Le droit d’appel devant le roi'], 0, 'Il devient au XVIIIe siècle une arme d’opposition politique.'],
            ['Comment le roi impose-t-il l’enregistrement d’un édit refusé ?', ['Par un lit de justice', 'Par une lettre de cachet', 'Par un édit de grâce', 'Par un concordat'], 0, 'Le roi vient siéger en personne au parlement.'],
            ['Pourquoi les intendants ne sont-ils pas choisis dans la haute noblesse d’épée ?', ['Pour qu’ils dépendent entièrement du roi et soient révocables', 'Parce qu’ils sont élus', 'Parce que la noblesse refuse ces charges', 'Parce qu’ils doivent être étrangers'], 0, 'Un agent sans base locale ne peut pas se rendre indépendant.'],
            ['La monarchie a réussi à supprimer les privilèges fiscaux de la noblesse.', ['Vrai', 'Faux'], 1, 'Toutes les tentatives échouent : c’est l’une des causes de 1789.'],
            ['À quoi sert la cour de Versailles dans la politique royale ?', ['À tenir la noblesse par les pensions, les charges et l’étiquette', 'À former les intendants', 'À loger les parlementaires', 'À réunir les états généraux'], 0, 'Une noblesse domestiquée coûte cher mais ne conspire plus.'],
            ['Quel événement de 1789 marque l’échec des réformes fiscales de la monarchie ?', ['La convocation des états généraux', 'La Fronde', 'La révocation de l’édit de Nantes', 'La journée des Dupes'], 0, 'Faute de pouvoir réformer seul, le roi doit convoquer le royaume.'],
          ],
        },

        // ===================================================================
        // HISTOIRE — Chapitre 7 : Le modèle britannique et son influence
        // ===================================================================
        {
          titre: 'La monarchie parlementaire anglaise : un modèle à l’opposé de la monarchie française',
          axe: 'Le modèle britannique et son influence',
          rayon: 'histoire',
          lecon: {
            titre: 'Le roi sous la loi',
            cours: `Pendant que la France concentre le pouvoir dans les mains du roi, l'Angleterre le partage. Deux révolutions y installent un régime où le souverain règne avec le Parlement.

## Une tradition ancienne
| Le texte ou l'institution | Ce qu'il pose |
| La **Grande Charte**, 1215 | Pas d'impôt sans l'accord des barons |
| Le **Parlement**, à deux chambres — Communes et Lords | Il tient le **consentement à l'impôt** : c'est son arme décisive |

## La première révolution
| L'étape | Ce qui se passe |
| Charles Ier gouverne **onze ans sans Parlement** | Il lève des taxes contestées |
| La guerre civile | **Cromwell** l'emporte |
| **1649** | Charles Ier est jugé et **exécuté** — l'Europe en est stupéfaite |
| La république, puis la dictature de Cromwell | Elles déçoivent |
| **1660** | La monarchie est restaurée |

> Un roi peut être jugé. Cette idée, née à Londres en 1649, met un siècle et demi à traverser la Manche.

## La Glorieuse Révolution
| L'année | **1688** : le Parlement écarte Jacques II, catholique et autoritaire, et appelle **Guillaume d'Orange** |

Le **Bill of Rights** de **1689** fixe les règles :

| La règle | Son contenu |
| Impôt et armée permanente | Impossibles **sans le Parlement** |
| Élections | Libres |
| Parole des parlementaires | Libre |
| Pétition | Un droit |

## Le régime au XVIIIe siècle
| L'élément | Son fonctionnement |
| Les **ministres** | Choisis par le roi, mais ils doivent avoir la confiance des Communes |
| Le **cabinet** et le Premier ministre | Ils apparaissent avec **Walpole** |
| L'**habeas corpus** (1679) | Il protège de la détention arbitraire |
| Le **suffrage** | Très restreint et inégal |

> Le principe est posé : le pouvoir est limité par la loi.`,
          },
          questions: [
            ['Que garantit la Grande Charte de 1215 ?', ['Que le roi ne lève pas d’impôt sans l’accord de ses barons', 'La liberté de la presse', 'Le suffrage universel', 'La séparation des pouvoirs'], 0, 'Le consentement à l’impôt est l’arme du Parlement.'],
            ['Quel roi anglais est exécuté en 1649 ?', ['Charles Ier', 'Jacques II', 'Charles II', 'Guillaume III'], 0, 'Jugé par ses propres sujets, ce qui stupéfie l’Europe.'],
            ['Qui dirige l’Angleterre après l’exécution de Charles Ier ?', ['Oliver Cromwell', 'Guillaume d’Orange', 'Robert Walpole', 'Jacques II'], 0, 'République puis protectorat, qui déçoit et prépare la Restauration.'],
            ['Que se passe-t-il lors de la Glorieuse Révolution de 1688 ?', ['Le Parlement écarte Jacques II et appelle Guillaume d’Orange', 'Le roi dissout le Parlement', 'Cromwell prend le pouvoir', 'L’Écosse fait sécession'], 0, 'Une révolution presque sans effusion de sang.'],
            ['Que fixe le Bill of Rights de 1689 ?', ['Les limites du pouvoir royal face au Parlement', 'Le droit de vote pour tous', 'La liberté religieuse totale', 'L’abolition de la monarchie'], 0, 'Ni impôt ni armée permanente sans le Parlement.'],
            ['L’habeas corpus protège contre la détention arbitraire.', ['Vrai', 'Faux'], 0, 'Voté en 1679, il oblige à présenter tout détenu à un juge.'],
            ['De quelles chambres le Parlement britannique est-il composé ?', ['Les Communes et les Lords', 'Le Sénat et l’Assemblée', 'Les états généraux', 'Le Conseil privé et la Chambre étoilée'], 0, 'Deux chambres, aux recrutements très différents.'],
            ['Le suffrage britannique du XVIIIe siècle est-il universel ?', ['Non, il est très restreint et inégalement réparti', 'Oui, pour tous les hommes', 'Oui, pour tous les adultes', 'Non, il n’existe pas d’élections'], 0, 'Bourgs pourris et cens élevé : le principe précède l’égalité.'],
          ],
        },
        {
          titre: 'Le modèle britannique, un exemple pour les philosophes des Lumières',
          axe: 'Le modèle britannique et son influence',
          rayon: 'histoire',
          lecon: {
            titre: 'Ce que Voltaire et Montesquieu vont chercher à Londres',
            cours: `Au XVIIIe siècle, l'Angleterre devient pour les philosophes français un argument : la preuve qu'un pouvoir limité est possible, et qu'il ne ruine ni l'ordre ni la prospérité.

## Voltaire
Exilé en Angleterre de 1726 à 1728, il publie les *Lettres philosophiques* en **1734**.

| Ce qu'il admire | Ce qu'il vise en creux |
| La **tolérance religieuse** | L'intolérance française |
| La **liberté de commerce** | Les entraves du royaume |
| La considération pour savants et négociants | Le mépris nobiliaire |
| Un roi qui ne peut « faire de mal » | L'absolutisme |

> Le livre est condamné et brûlé en France : la comparaison est vécue comme une attaque.

## Montesquieu
Dans *De l'esprit des lois* (**1748**), il tire de l'exemple anglais l'idée de **séparation des pouvoirs**.

| Le pouvoir | Sa fonction |
| **Législatif** | Faire la loi |
| **Exécutif** | L'appliquer |
| **Judiciaire** | La dire dans les litiges |

Pour que « le pouvoir arrête le pouvoir », ils doivent être distincts.

> Sa lecture est en partie idéalisée — le cabinet britannique mêle en réalité exécutif et législatif — mais elle devient une matrice politique.

## Locke, en amont
Dans son *Traité du gouvernement civil* (1690), **John Locke** pose les fondations :

| Le principe | Sa conséquence |
| Les hommes ont des **droits naturels** | L'État ne les crée pas, il les protège |
| Le gouvernement naît d'un **contrat** | Il peut être **renversé** s'il les viole |

Le droit de résistance entre dans la pensée politique.

## La diffusion
Salons, cafés, académies, correspondances, et l'**Encyclopédie** de Diderot et d'Alembert (1751-1772) répandent ces idées malgré la censure.

> Ce que les Lumières empruntent à Londres, ce n'est pas une constitution : c'est une preuve qu'une alternative existe.`,
          },
          questions: [
            ['Quel ouvrage Voltaire publie-t-il en 1734 après son séjour anglais ?', ['Les Lettres philosophiques', 'Candide', 'Le Contrat social', 'De l’esprit des lois'], 0, 'Un éloge de l’Angleterre qui vaut critique de la France.'],
            ['Quelle idée Montesquieu tire-t-il de l’exemple britannique ?', ['La séparation des pouvoirs', 'Le suffrage universel', 'La souveraineté populaire', 'L’abolition de la monarchie'], 0, 'Pour que le pouvoir arrête le pouvoir.'],
            ['En quelle année paraît De l’esprit des lois ?', ['1748', '1734', '1690', '1762'], 0, 'Fruit de vingt ans de travail et d’un voyage en Angleterre.'],
            ['Quel philosophe anglais fonde le pouvoir sur un contrat et admet le droit de résistance ?', ['John Locke', 'Thomas Hobbes', 'David Hume', 'Adam Smith'], 0, 'Traité du gouvernement civil, 1690.'],
            ['La lecture montesquienne du régime anglais est-elle exacte ?', ['Elle est en partie idéalisée : le cabinet mêle exécutif et législatif', 'Elle est parfaitement fidèle', 'Elle décrit la France', 'Elle porte sur la Hollande'], 0, 'Le modèle vaut moins comme description que comme programme.'],
            ['L’Encyclopédie de Diderot et d’Alembert paraît au XVIIIe siècle.', ['Vrai', 'Faux'], 0, 'De 1751 à 1772, malgré interdictions et suspensions.'],
            ['Qu’admire surtout Voltaire dans la société anglaise ?', ['La tolérance religieuse et la liberté de commerce', 'La puissance de l’armée', 'La cour royale', 'Le système des corporations'], 0, 'Il oppose la Bourse de Londres au fanatisme continental.'],
            ['Par quels lieux les idées des Lumières circulent-elles ?', ['Salons, cafés, académies et correspondances', 'Uniquement les universités', 'Les tribunaux', 'Les couvents'], 0, 'Une sociabilité nouvelle, en marge des institutions officielles.'],
          ],
        },
        {
          titre: 'Les relations entre l’Angleterre et ses colonies américaines',
          axe: 'Le modèle britannique et son influence',
          rayon: 'histoire',
          lecon: {
            titre: 'Pas de taxation sans représentation',
            cours: `Les treize colonies britanniques d'Amérique se révoltent au nom des libertés anglaises elles-mêmes. Elles réclament ce que le Bill of Rights promettait.

## Treize colonies
| Le trait | Son contenu |
| Leur fondation | Entre **1607 et 1732** |
| Leur économie | Commerce, agriculture, et au Sud la **plantation esclavagiste** |
| Leurs institutions | Des **assemblées élues**, une presse active |
| Leur sentiment | Une population qui se sent **anglaise** |

## La rupture fiscale
La guerre de Sept Ans (1756-1763) a coûté cher à Londres, qui décide de faire payer les colonies.

| La taxe | Sa date |
| **Sugar Act** | 1764 |
| **Stamp Act** | 1765 |
| **Townshend Acts** | 1767 |
| Taxe sur le **thé** | 1773 |

Or les colons n'ont aucun député à Westminster. Leur mot d'ordre : *no taxation without representation*.

> On ne demande pas l'indépendance en 1765 : on demande à être traité comme un sujet britannique. Le refus fabrique la nation américaine.

## L'escalade
| La date | L'événement |
| **1773** | La **Boston Tea Party**, puis les lois coercitives |
| **1774** | Premier Congrès continental |
| **1775** | Premiers combats à Lexington |
| **4 juillet 1776** | La **Déclaration d'indépendance**, rédigée par Jefferson : tous les hommes sont créés égaux et dotés de droits inaliénables |

## L'indépendance et son modèle
| La date | L'étape |
| **1781** | La victoire de **Yorktown**, avec l'appui de la **France** — La Fayette, Rochambeau, la flotte de Grasse |
| **1783** | Le traité de Versailles-Paris reconnaît les États-Unis |
| **1787** | La **Constitution** : régime fédéral, présidentiel, fondé sur la séparation des pouvoirs |

> C'est le premier grand régime écrit inspiré des Lumières. L'esclavage, lui, n'est pas aboli.`,
          },
          questions: [
            ['Quel slogan résume la revendication des colons américains ?', ['Pas de taxation sans représentation', 'Liberté, égalité, fraternité', 'Le roi et la loi', 'Vive la république'], 0, 'Ils réclament d’abord les droits des sujets britanniques.'],
            ['Quelle guerre pousse Londres à taxer davantage ses colonies ?', ['La guerre de Sept Ans', 'La guerre de Succession d’Espagne', 'La guerre de Crimée', 'La guerre de Cent Ans'], 0, 'Achevée en 1763, elle laisse une dette considérable.'],
            ['Quel événement de 1773 symbolise la révolte contre la taxe sur le thé ?', ['La Boston Tea Party', 'La bataille de Lexington', 'Le Stamp Act', 'Le siège de Yorktown'], 0, 'Des caisses de thé jetées à la mer dans le port de Boston.'],
            ['Quand est proclamée la Déclaration d’indépendance ?', ['Le 4 juillet 1776', 'Le 14 juillet 1789', 'Le 19 octobre 1781', 'Le 3 septembre 1783'], 0, 'Rédigée principalement par Thomas Jefferson.'],
            ['Quelle bataille décide de la guerre d’Indépendance en 1781 ?', ['Yorktown', 'Saratoga', 'Bunker Hill', 'Trenton'], 0, 'Avec le concours décisif de l’armée et de la flotte françaises.'],
            ['La Constitution américaine de 1787 abolit l’esclavage.', ['Vrai', 'Faux'], 1, 'Elle le laisse subsister, et le compte même dans la représentation.'],
            ['Quel principe hérité de Montesquieu structure la Constitution de 1787 ?', ['La séparation des pouvoirs', 'Le suffrage censitaire', 'La monarchie constitutionnelle', 'Le droit divin'], 0, 'Un exécutif présidentiel, un Congrès, une Cour suprême.'],
            ['Quel pays européen soutient militairement les insurgés américains ?', ['La France', 'La Prusse', 'L’Autriche', 'La Russie'], 0, 'Une revanche sur la guerre de Sept Ans, très coûteuse pour ses finances.'],
          ],
        },

        // ===================================================================
        // HISTOIRE — Chapitre 8 : Les Lumières et le développement des sciences
        // ===================================================================
        {
          titre: 'L’essor d’un nouvel esprit scientifique et technique aux XVIIe et XVIIIe siècles',
          axe: 'Les Lumières et le développement des sciences',
          rayon: 'histoire',
          lecon: {
            titre: 'Observer, mesurer, démontrer',
            cours: `Entre Galilée et Lavoisier, la science change de méthode et de statut. Elle cesse de commenter les Anciens pour interroger la nature.

## La révolution scientifique
| Le savant | Sa découverte | Sa date |
| **Copernic** | Le Soleil au centre | 1543 |
| **Kepler** | Des orbites **elliptiques** | Début du XVIIe |
| **Galilée** | Les satellites de Jupiter, les phases de Vénus — condamné en **1633** | 1610-1633 |
| **Newton** | La **gravitation universelle**, qui unifie ciel et Terre | *Principia*, 1687 |

## Une méthode
| Le philosophe | Sa démarche |
| **Bacon** | L'**induction** à partir de l'expérience |
| **Descartes** | Le **doute méthodique** et la déduction |

Ensemble : hypothèse, **expérience reproductible**, formulation mathématique.

| L'instrument | Ce qu'il révèle |
| Le **microscope** | L'infiniment petit |
| Le **télescope** | Le ciel |
| Le **baromètre**, le **thermomètre** | Pression et température, mesurées |
| La **pompe à vide** | Le vide, longtemps jugé impossible |

> La nature n'est plus un livre à commenter : c'est un problème à résoudre, et la langue de la solution est mathématique.

## Les institutions
| L'institution | Sa date | Son rôle |
| La **Royal Society** de Londres | 1660 | Organiser la recherche |
| L'**Académie royale des sciences** de Paris | 1666 | Publier des mémoires, arbitrer les querelles |
| Les **journaux savants** | XVIIe-XVIIIe | Un espace de discussion européen |

## Les Lumières et l'utilité
| Le savant | Son apport |
| **Buffon** | L'*Histoire naturelle* |
| **Linné** | La classification des espèces |
| **Lavoisier** | La chimie moderne, et la **conservation de la matière** |
| **Jenner** | La vaccination antivariolique, 1796 |

L'**Encyclopédie** consacre des milliers de planches aux métiers : le savoir doit servir.`,
          },
          questions: [
            ['Qui place le Soleil au centre du système en 1543 ?', ['Copernic', 'Galilée', 'Kepler', 'Newton'], 0, 'Son livre paraît l’année de sa mort.'],
            ['Pourquoi Galilée est-il condamné en 1633 ?', ['Pour avoir défendu l’héliocentrisme', 'Pour avoir inventé le télescope', 'Pour avoir critiqué le roi d’Espagne', 'Pour ses travaux d’anatomie'], 0, 'La science entre en conflit avec l’autorité religieuse.'],
            ['Quelle loi Newton énonce-t-il dans les Principia de 1687 ?', ['La gravitation universelle', 'La conservation de la matière', 'La circulation du sang', 'La loi des gaz parfaits'], 0, 'Une même loi pour la pomme et pour la Lune.'],
            ['Quel savant français fonde la chimie moderne à la fin du XVIIIe siècle ?', ['Lavoisier', 'Buffon', 'Linné', 'Jenner'], 0, 'Rien ne se perd, rien ne se crée : la matière se conserve.'],
            ['Quelle institution scientifique est fondée à Paris en 1666 ?', ['L’Académie royale des sciences', 'La Royal Society', 'Le Collège de France', 'L’Institut Pasteur'], 0, 'Six ans après la Royal Society de Londres.'],
            ['Edward Jenner met au point la vaccination contre la variole en 1796.', ['Vrai', 'Faux'], 0, 'À partir de la vaccine contractée par les vachères.'],
            ['Quel instrument révèle au XVIIe siècle un monde invisible à l’œil nu ?', ['Le microscope', 'Le sextant', 'La boussole', 'L’astrolabe'], 0, 'Comme le télescope pour le ciel, il fournit des faits nouveaux.'],
            ['Quel philosophe formule le doute méthodique ?', ['Descartes', 'Bacon', 'Locke', 'Hume'], 0, 'Le Discours de la méthode, 1637.'],
          ],
        },
        {
          titre: 'Les évolutions économiques et techniques aux origines de la révolution industrielle',
          axe: 'Les Lumières et le développement des sciences',
          rayon: 'histoire',
          lecon: {
            titre: 'Pourquoi l’Angleterre, et pourquoi le XVIIIe siècle',
            cours: `La révolution industrielle ne commence pas avec une machine, mais avec un ensemble de conditions réunies dans l'Angleterre du XVIIIe siècle.

## La révolution agricole
| L'innovation | Son effet |
| Les **enclosures** | Des parcelles regroupées et closes, exploitables autrement |
| L'assolement **sans jachère** | La terre produit chaque année |
| Prairies artificielles, sélection du bétail | Plus de fumure, plus de viande |
| Herse et charrue améliorées | Un travail plus rapide |

> Moins de bras suffisent à nourrir plus de monde ; les autres partent en ville. La **transition démographique** commence, la mortalité reculant avant la natalité.

## Le charbon et la machine
| L'étape | Sa date | Son apport |
| Le **coke** de Darby | 1709 | Une fonte de qualité et bon marché |
| La machine de Newcomen | 1712 | Épuiser l'eau des mines |
| La machine de **James Watt** | 1769 | Une vapeur assez efficace pour tout faire tourner |

> Une énergie qui ne dépend plus du vent, de l'eau ni du muscle : la production peut se concentrer où l'on veut, et tourner toute l'année.

## Le textile et la fabrique
| La machine | Ce qu'elle accélère |
| La **navette volante** | Le tissage |
| La **spinning jenny** | La filature, plusieurs fils à la fois |
| La **water frame**, la **mule-jenny** | Un fil régulier, en grande quantité |

Le travail quitte la maison pour la **fabrique**, où l'on impose horaires, surveillance et division des tâches.

## Le cadre favorable
| L'atout | Ce qu'il apporte |
| L'**empire colonial** | Débouchés et matières premières |
| La **marine marchande** | Le transport |
| Banques et **Bourse de Londres** | Le capital |
| Les **brevets** | Ils protègent l'inventeur |
| Canaux et routes | La circulation intérieure |
| Une aristocratie qui **investit** dans les mines | Elle finance au lieu de thésauriser |

Le **libéralisme** d'**Adam Smith** — *Recherches sur la nature et les causes de la richesse des nations*, 1776 — en donne la théorie.`,
          },
          questions: [
            ['Que sont les enclosures ?', ['La clôture et le regroupement des terres pour une agriculture plus productive', 'Des ateliers textiles', 'Des taxes sur le blé', 'Des mines de charbon à ciel ouvert'], 0, 'Elles augmentent les rendements et libèrent des bras pour la ville.'],
            ['Qui perfectionne la machine à vapeur en 1769 ?', ['James Watt', 'Thomas Newcomen', 'Abraham Darby', 'Richard Arkwright'], 0, 'Le condenseur séparé fait chuter la consommation de charbon.'],
            ['Quel combustible remplace le bois dans la sidérurgie anglaise ?', ['Le coke tiré du charbon', 'La tourbe', 'Le pétrole', 'Le gaz naturel'], 0, 'Abraham Darby l’utilise dès 1709.'],
            ['Quelle industrie est la première transformée par la mécanisation ?', ['Le textile, notamment le coton', 'La construction navale', 'La chimie', 'L’imprimerie'], 0, 'Navette volante, spinning jenny, mule-jenny.'],
            ['Qu’appelle-t-on la transition démographique ?', ['Le passage d’une forte mortalité à une mortalité basse, la natalité restant élevée un temps', 'L’exode rural', 'La hausse de l’émigration', 'Le vieillissement de la population'], 0, 'Elle provoque une forte croissance de la population.'],
            ['Adam Smith publie La Richesse des nations en 1776.', ['Vrai', 'Faux'], 0, 'La théorie libérale accompagne la révolution industrielle.'],
            ['Quel dispositif juridique encourage l’invention en Angleterre ?', ['Le brevet', 'La corporation', 'Le monopole royal', 'La commende'], 0, 'Il garantit à l’inventeur le profit de son idée.'],
            ['Qu’est-ce qui change dans l’organisation du travail avec la fabrique ?', ['Horaires imposés, surveillance et division des tâches', 'Le travail à domicile se généralise', 'Les corporations reprennent le contrôle', 'Le travail devient saisonnier'], 0, 'La discipline d’usine est une nouveauté sociale majeure.'],
          ],
        },

        // ===================================================================
        // HISTOIRE — Chapitre 9 : Tensions, mutations et crispations
        // ===================================================================
        {
          titre: 'Le monde rural',
          axe: 'Tensions, mutations et crispations de la société d’ordres',
          rayon: 'histoire',
          lecon: {
            titre: 'Quatre Français sur cinq vivent de la terre',
            cours: `À la veille de la Révolution, la France est un pays de paysans. Comprendre 1789 suppose de comprendre ce que vivent ces quatre Français sur cinq.

## La société d'ordres
| L'ordre | Son effectif approximatif | Son statut |
| Le **clergé** | 130 000 | **Privilégié** |
| La **noblesse** | 350 000 | **Privilégiée** |
| Le **tiers état** | Plus de 97 % de la population | Il paie |

Les privilèges : exemptions fiscales, justice propre, honneurs réservés.

## Ce que paie un paysan
| Le bénéficiaire | Le prélèvement |
| Le **roi** | La **taille**, la **capitation**, la **gabelle** sur le sel |
| L'**Église** | La **dîme** |
| Le **seigneur** | Le **cens**, les **banalités** — four, moulin, pressoir —, les corvées, les droits de mutation |

S'y ajoutent les **droits féodaux** que certains seigneurs font revivre au XVIIIe siècle : la **réaction seigneuriale**, particulièrement mal supportée.

> Ce que le paysan reproche au seigneur, ce n'est pas seulement de prendre : c'est de prendre sans rien rendre.

## Des campagnes inégales
| La région | Son système |
| Le **Bassin parisien** | Grandes fermes céréalières, gros fermiers |
| Le **Sud-Ouest** | Le métayage |
| L'**Ouest** | Les bocages |
| La **montagne** | La petite propriété |

Les progrès agricoles restent limités, et la subsistance dépend encore de la récolte de l'année.

## La crise et la peur
| La date | L'événement |
| **1788** | Mauvaises récoltes, hiver rigoureux |
| Printemps **1789** | Flambée du prix du pain, émeutes frumentaires |
| Juillet-août **1789** | La **Grande Peur** parcourt les campagnes ; les paysans brûlent les **terriers**, registres des droits seigneuriaux |
| Nuit du **4 août 1789** | L'abolition des privilèges |`,
          },
          questions: [
            ['Quelle part de la population française forme le tiers état ?', ['Plus de 97 %', 'Environ 60 %', 'Environ 80 %', 'Environ 50 %'], 0, 'Clergé et noblesse réunis dépassent à peine 2 %.'],
            ['Quel impôt le paysan verse-t-il à l’Église ?', ['La dîme', 'La taille', 'La gabelle', 'Le cens'], 0, 'Prélevée en nature sur la récolte.'],
            ['Que sont les banalités seigneuriales ?', ['L’obligation payante d’utiliser le four, le moulin ou le pressoir du seigneur', 'Des amendes judiciaires', 'Un impôt royal sur le sel', 'Des corvées routières d’État'], 0, 'Un monopole seigneurial très mal supporté.'],
            ['Qu’appelle-t-on la réaction seigneuriale au XVIIIe siècle ?', ['La remise en vigueur de droits féodaux tombés en désuétude', 'Une révolte des seigneurs contre le roi', 'La vente des terres nobles', 'La suppression des corvées'], 0, 'Elle nourrit la colère paysanne à la veille de 1789.'],
            ['Qu’est-ce que la Grande Peur de l’été 1789 ?', ['Une vague de panique et de révolte dans les campagnes', 'Une épidémie de peste', 'Une famine urbaine', 'Une invasion étrangère'], 0, 'Les paysans s’en prennent aux châteaux et aux terriers.'],
            ['La nuit du 4 août 1789 abolit les privilèges.', ['Vrai', 'Faux'], 0, 'Droits féodaux et privilèges fiscaux tombent en une nuit.'],
            ['Qu’est-ce qu’un terrier seigneurial ?', ['Le registre des droits et redevances dus au seigneur', 'Une réserve de grain', 'Un tribunal de village', 'Une parcelle communale'], 0, 'Le brûler, c’est effacer la preuve de la dette.'],
            ['Quel événement climatique et agricole aggrave la crise de 1789 ?', ['Les mauvaises récoltes de 1788 et un hiver rigoureux', 'Une sécheresse en 1785', 'Des inondations en 1790', 'Une invasion de criquets'], 0, 'Le prix du pain flambe au printemps 1789.'],
          ],
        },
        {
          titre: 'Le monde urbain',
          axe: 'Tensions, mutations et crispations de la société d’ordres',
          rayon: 'histoire',
          lecon: {
            titre: 'La ville où se fabrique l’opinion',
            cours: `Les villes du XVIIIe siècle rassemblent moins d'un Français sur cinq, mais c'est là que se concentrent la richesse, l'information et la contestation.

## Une France peu urbaine
| Le repère | Sa valeur |
| La part de citadins | Environ **20 %** |
| Paris | Près de 600 000 habitants |
| Lyon, Marseille, Bordeaux, Nantes | Plus de 50 000 chacune |

Les ports de la façade atlantique s'enrichissent du commerce colonial et de la traite.

## Une bourgeoisie qui monte
| Ce qu'elle possède | Ce qui lui manque |
| La fortune et les compétences | Le **statut** : elle reste juridiquement dans le tiers état |

Négociants, armateurs, manufacturiers, avocats, médecins, officiers. Elle achète des offices, parfois la noblesse, et supporte de plus en plus mal des privilèges qu'elle juge injustifiés.

> Une société où le mérite s'arrête à la naissance finit par produire des gens qui veulent changer la règle.

## Le peuple des villes
| Le groupe | Sa condition |
| Compagnons, ouvriers | Le salaire dépend du **prix du pain**, qui absorbe parfois la moitié du revenu |
| Domestiques, portefaix, petits métiers | Une vie précaire |
| Mendiants et malades | La ville les concentre, et la police du roi les surveille |

## L'opinion publique
| Le lieu | Ce qui s'y forme |
| Cafés et **salons** | La discussion des idées des Lumières |
| Loges maçonniques, académies de province | Des réseaux de sociabilité lettrée |
| Cabinets de lecture, journaux, libelles clandestins | La circulation de la critique |

> En 1789, ce sont les villes qui rédigent les cahiers de doléances les plus politiques — et qui, à Paris, prennent la **Bastille** le 14 juillet.`,
          },
          questions: [
            ['Quelle part des Français vit en ville au XVIIIe siècle ?', ['Environ 20 %', 'Environ 50 %', 'Environ 5 %', 'Environ 70 %'], 0, 'La France reste massivement rurale.'],
            ['Quels ports français s’enrichissent du commerce colonial ?', ['Bordeaux, Nantes et La Rochelle', 'Strasbourg et Lille', 'Lyon et Grenoble', 'Reims et Dijon'], 0, 'La façade atlantique profite du sucre et de la traite.'],
            ['À quel ordre appartient juridiquement la bourgeoisie ?', ['Au tiers état', 'À la noblesse', 'Au clergé', 'À un quatrième ordre'], 0, 'Riche mais sans privilège : d’où sa frustration politique.'],
            ['Quelle dépense pèse le plus lourd dans le budget du peuple urbain ?', ['Le pain', 'Le logement', 'Le vêtement', 'Le chauffage'], 0, 'Il peut absorber la moitié d’un salaire en année de disette.'],
            ['Où se forme l’opinion publique au XVIIIe siècle ?', ['Dans les cafés, salons, loges et cabinets de lecture', 'Dans les églises uniquement', 'À la cour de Versailles', 'Dans les corporations'], 0, 'Une sociabilité neuve, hors du contrôle royal.'],
            ['Paris compte environ 600 000 habitants à la veille de la Révolution.', ['Vrai', 'Faux'], 0, 'De loin la plus grande ville du royaume.'],
            ['Que sont les cahiers de doléances ?', ['Les demandes rédigées par les paroisses et les corps en vue des états généraux', 'Les registres fiscaux du roi', 'Les comptes des corporations', 'Les listes de mendiants'], 0, 'Ceux des villes sont souvent les plus politiques.'],
            ['Quel événement parisien du 14 juillet 1789 symbolise l’entrée du peuple urbain en politique ?', ['La prise de la Bastille', 'La fête de la Fédération', 'La journée des Tuiles', 'La marche sur Versailles'], 0, 'Une forteresse presque vide, mais un symbole du pouvoir arbitraire.'],
          ],
        },
        // ===================================================================
        // GÉOGRAPHIE — Chapitre 1 : Sociétés et environnements
        // ===================================================================
        {
          titre: 'Les sociétés face aux risques',
          axe: 'Sociétés et environnements : des équilibres fragiles',
          rayon: 'geographie',
          lecon: {
            titre: 'Un risque, c’est un aléa qui rencontre des hommes',
            cours: `Un séisme au milieu du Pacifique n'est pas un risque : c'est un phénomène. Le risque naît de la rencontre entre un aléa et une société qui peut être atteinte.

## Le vocabulaire
| Le mot | Sa définition |
| L'**aléa** | L'événement possible : séisme, cyclone, crue, accident industriel |
| La **vulnérabilité** | La fragilité des populations et des biens exposés |
| Le **risque** | Le croisement des deux |
| La **catastrophe** | Le risque **réalisé** |
| La **résilience** | La capacité d'un territoire à se relever |

## Des risques de plusieurs types
| Le type | Ses exemples |
| **Naturels** | Telluriques, climatiques, hydrologiques |
| **Technologiques** | Industrie, nucléaire, transport de matières dangereuses |
| **Sanitaires** | Épidémies, pollutions |
| **Hybrides** | Un aléa naturel déclenche un accident technologique : Fukushima, 2011 |

> À magnitude égale, un séisme tue quelques dizaines de personnes au Japon et des dizaines de milliers en Haïti. La différence n'est pas géologique : elle est **sociale**.

## Une exposition croissante
| Le phénomène | Son effet |
| Littoralisation, urbanisation, métropolisation | Les hommes s'installent là où l'aléa est fort : deltas, côtes cycloniques, versants instables |
| Les pays du **Sud** | L'essentiel des **victimes** |
| Les pays du **Nord** | L'essentiel des **dégâts matériels** |

## Prévenir et gérer
| L'action | Son contenu |
| La **prévision** | Surveillance sismique, alerte cyclonique |
| La **prévention** | Normes parasismiques, plans de prévention des risques, zones inconstructibles, éducation |
| La **gestion de crise** | Secours, évacuation, information |
| La **reconstruction** | Elle achève le cycle — et peut réduire, ou reproduire, la vulnérabilité |

En France, les PPR et le système d'indemnisation des catastrophes naturelles encadrent l'aménagement.`,
          },
          questions: [
            ['Comment définit-on un risque en géographie ?', ['Le croisement d’un aléa et d’une société vulnérable', 'Un phénomène naturel violent', 'Une catastrophe déjà survenue', 'Une zone inconstructible'], 0, 'Sans population exposée, il n’y a pas de risque.'],
            ['Qu’est-ce que la vulnérabilité ?', ['La fragilité des populations et des biens face à un aléa', 'La violence d’un séisme', 'La fréquence d’un cyclone', 'La capacité à se reconstruire'], 0, 'Elle dépend du bâti, des revenus, de l’organisation des secours.'],
            ['Qu’appelle-t-on la résilience d’un territoire ?', ['Sa capacité à se relever après une catastrophe', 'Sa richesse par habitant', 'Sa densité de population', 'Son taux d’urbanisation'], 0, 'Elle se prépare avant la crise, pas seulement après.'],
            ['Pourquoi un séisme de même magnitude est-il plus meurtrier en Haïti qu’au Japon ?', ['La vulnérabilité y est bien plus forte', 'L’aléa y est plus intense', 'Le sol y est plus fragile', 'La population y est plus dense'], 0, 'Normes de construction, alerte et secours font la différence.'],
            ['Que s’est-il passé à Fukushima en 2011 ?', ['Un aléa naturel a déclenché un accident technologique', 'Une explosion industrielle isolée', 'Une pandémie', 'Une rupture de barrage'], 0, 'Séisme, tsunami puis accident nucléaire : un risque hybride.'],
            ['Les pays du Sud concentrent l’essentiel des victimes des catastrophes.', ['Vrai', 'Faux'], 0, 'Les pays du Nord concentrent en revanche l’essentiel des dégâts matériels.'],
            ['Que fait un plan de prévention des risques en France ?', ['Il réglemente ou interdit la construction dans les zones exposées', 'Il indemnise les sinistrés', 'Il organise les secours', 'Il finance la reconstruction'], 0, 'C’est un outil d’aménagement, annexé au document d’urbanisme.'],
            ['Quelle différence entre prévision et prévention ?', ['Prévoir, c’est annoncer l’aléa ; prévenir, c’est réduire la vulnérabilité', 'Ce sont deux synonymes', 'Prévoir concerne l’industrie, prévenir la nature', 'Prévenir, c’est indemniser'], 0, 'L’une est scientifique, l’autre politique et technique.'],
          ],
        },
        {
          titre: 'Le changement climatique et ses effets sur un territoire densément peuplé',
          axe: 'Sociétés et environnements : des équilibres fragiles',
          rayon: 'geographie',
          lecon: {
            titre: 'Les deltas asiatiques en première ligne',
            cours: `Le changement climatique frappe partout, mais pas également. Les deltas densément peuplés d'Asie cumulent forte exposition, forte densité et faibles moyens.

## Le mécanisme
| La cause | Ses conséquences |
| La concentration de gaz à effet de serre — dioxyde de carbone, méthane | Le réchauffement de l'atmosphère |
| La dilatation de l'eau et la fonte des glaces | La **hausse du niveau marin** |
| Une atmosphère plus chaude | Cyclones plus intenses, moussons plus irrégulières |
| L'avancée de l'eau salée | **Salinisation** des nappes et des sols |

## Le cas du delta du Gange-Brahmapoutre
| Le repère | Sa valeur |
| La population du **Bangladesh** | Environ **170 millions** |
| La superficie | Moins de la moitié de la France |
| L'altitude | En grande partie sous **10 mètres** |
| L'effet d'une élévation d'un mètre | Une part importante des terres cultivées menacée, et des millions de personnes |

> Ici, quelques centimètres d'eau ne sont pas une statistique : ce sont des rizières perdues, des puits salés, des villages déplacés.

## Les effets en chaîne
| L'effet | Sa suite |
| Inondations plus fréquentes, cyclones du golfe du Bengale | Destructions et déplacements |
| Érosion des côtes, recul des mangroves des **Sundarbans** | Perte de la protection naturelle |
| Salinisation | Les rizières cèdent la place à l'aquaculture de crevettes |
| Migrations climatiques | Elles gonflent **Dacca**, l'une des villes les plus denses du monde |

## Répondre
| L'échelle | Les mesures |
| **Adaptation** locale | Digues, abris anticycloniques, alerte précoce, riz tolérant au sel, maisons sur pilotis, mangroves replantées |
| **Atténuation** mondiale | Réduire les émissions : accord de **Paris** (2015), rapports du **GIEC** |

> Le Bangladesh émet très peu et subit beaucoup : c'est toute la question de la **justice climatique**.`,
          },
          questions: [
            ['Pourquoi les deltas asiatiques sont-ils très exposés au changement climatique ?', ['Faible altitude, très forte densité et moyens limités', 'Sols volcaniques instables', 'Absence de cours d’eau', 'Climat désertique'], 0, 'Exposition et vulnérabilité s’y additionnent.'],
            ['Combien d’habitants compte environ le Bangladesh ?', ['Environ 170 millions', 'Environ 40 millions', 'Environ 600 millions', 'Environ 90 millions'], 0, 'Sur un territoire plus petit que la moitié de la France.'],
            ['Quel phénomène ruine les rizières côtières du delta ?', ['La salinisation des sols et des nappes', 'La désertification', 'Le gel hivernal', 'L’acidification des pluies'], 0, 'Elle pousse certains paysans vers l’aquaculture de crevettes.'],
            ['Quelle forêt littorale protège naturellement le delta du Gange ?', ['La mangrove des Sundarbans', 'La forêt de teck', 'La taïga', 'La forêt de mousson du Deccan'], 0, 'Elle amortit les vagues de tempête et fixe les sédiments.'],
            ['Qu’est-ce que l’adaptation, en matière de climat ?', ['Réduire les effets subis, par des digues, des abris ou des cultures adaptées', 'Réduire les émissions de gaz à effet de serre', 'Interdire les énergies fossiles', 'Déplacer les populations'], 0, 'L’atténuation agit sur la cause, l’adaptation sur les conséquences.'],
            ['L’accord de Paris sur le climat date de 2015.', ['Vrai', 'Faux'], 0, 'Il vise à contenir le réchauffement bien en dessous de 2 degrés.'],
            ['Que désigne le GIEC ?', ['Le groupe d’experts qui fait la synthèse des connaissances sur le climat', 'Une agence de l’ONU pour les migrations', 'Un fonds d’aide aux pays pauvres', 'Un traité commercial'], 0, 'Ses rapports servent de base aux négociations internationales.'],
            ['Pourquoi parle-t-on d’injustice climatique à propos du Bangladesh ?', ['Il émet très peu de gaz à effet de serre et subit fortement les effets', 'Il refuse les accords internationaux', 'Il est le premier émetteur d’Asie', 'Il ne reçoit aucune aide'], 0, 'Responsabilité faible, vulnérabilité maximale.'],
          ],
        },
        {
          titre: 'Des ressources majeures sous pression : l’exemple de la forêt amazonienne',
          axe: 'Sociétés et environnements : des équilibres fragiles',
          rayon: 'geographie',
          lecon: {
            titre: 'Exploiter ou préserver le plus grand massif du monde',
            cours: `L'Amazonie est à la fois une réserve de biodiversité mondiale et une ressource convoitée. Le conflit d'usage y est frontal.

## Ce que représente l'Amazonie
| Le repère | Sa valeur |
| La superficie | Environ **5,5 millions de km²**, sur neuf pays |
| La part brésilienne | **60 %** |
| La biodiversité | Une part majeure de la biodiversité terrestre |
| Le **carbone** stocké | Considérable |
| L'**évapotranspiration** | Elle alimente les pluies d'une bonne partie du continent |

## Les pressions
| La pression | Son poids |
| L'**élevage bovin** | **Première** cause de déforestation |
| La culture du **soja** | Deuxième front |
| L'exploitation forestière | Légale et illégale |
| L'**orpaillage** | Il pollue au mercure |
| Les barrages, comme **Belo Monte** | Ils noient des vallées |
| Les **routes**, à commencer par la Transamazonienne | Elles ouvrent la forêt |

La déforestation cumulée dépasse **17 %** du massif.

> Une forêt ne recule pas d'un coup : elle recule le long des routes, en arêtes de poisson, ferme après ferme.

## Les acteurs et leurs conflits
| L'acteur | Son intérêt |
| Grands propriétaires, agro-industrie | Valoriser la terre |
| Colons pauvres venus du Nordeste | Survivre |
| Orpailleurs, firmes minières | Extraire |
| **Peuples autochtones** | Des terres reconnues, mais mal protégées |
| ONG, État fédéral | Préserver et arbitrer |

> Les assassinats de militants, comme celui de Chico Mendes en 1988, disent la violence du conflit.

## Vers un développement durable
| L'outil | Ce qu'il fait |
| Aires protégées et **terres indigènes** | Elles soustraient des surfaces à l'exploitation |
| La **surveillance satellitaire** | Elle rend la déforestation visible en temps quasi réel |
| Le **moratoire sur le soja**, la certification du bois | Ils agissent par la demande |
| Agroforesterie, écotourisme, produits de la forêt | Ils valorisent la forêt debout |

> Les résultats varient au gré des politiques fédérales : la déforestation a fortement reculé dans les années 2000, remonté ensuite, puis reculé de nouveau.`,
          },
          questions: [
            ['Quelle est la superficie approximative de la forêt amazonienne ?', ['Environ 5,5 millions de km²', 'Environ 1 million de km²', 'Environ 12 millions de km²', 'Environ 500 000 km²'], 0, 'Répartie sur neuf pays, dont 60 % au Brésil.'],
            ['Quelle est la première cause de déforestation en Amazonie ?', ['L’élevage bovin extensif', 'L’exploitation du bois précieux', 'L’urbanisation', 'Les barrages'], 0, 'Le pâturage suit presque toujours la coupe.'],
            ['Quelle culture progresse fortement aux marges de la forêt ?', ['Le soja', 'Le blé', 'Le riz irrigué', 'La vigne'], 0, 'Destinée surtout à l’alimentation animale et à l’exportation.'],
            ['Quel rôle climatique majeur joue l’Amazonie ?', ['Elle stocke du carbone et alimente les pluies par évapotranspiration', 'Elle refroidit les océans', 'Elle produit l’essentiel de l’oxygène terrestre', 'Elle bloque les cyclones'], 0, 'Sa disparition modifierait le régime des pluies du continent.'],
            ['Qu’est-ce qu’un conflit d’usage ?', ['Une opposition entre acteurs qui veulent utiliser autrement un même espace', 'Un litige entre deux États', 'Un désaccord sur les frontières', 'Une grève des exploitants'], 0, 'Éleveurs, autochtones, orpailleurs et ONG sur le même territoire.'],
            ['Les terres des peuples autochtones sont reconnues au Brésil.', ['Vrai', 'Faux'], 0, 'Reconnues par la Constitution de 1988, mais souvent mal protégées sur le terrain.'],
            ['Quel outil permet de mesurer la déforestation en temps quasi réel ?', ['La surveillance satellitaire', 'Les recensements agricoles', 'Les enquêtes de terrain', 'Les registres fonciers'], 0, 'Le Brésil dispose d’un des meilleurs systèmes au monde.'],
            ['Qu’est-ce que l’agroforesterie ?', ['Associer cultures et arbres sur une même parcelle', 'Couper la forêt en bandes régulières', 'Replanter une seule essence', 'Interdire toute activité agricole'], 0, 'Une des voies d’un développement moins destructeur.'],
          ],
        },
        {
          titre: 'L’Arctique : un espace fragile et attractif',
          axe: 'Sociétés et environnements : des équilibres fragiles',
          rayon: 'geographie',
          lecon: {
            titre: 'La fonte ouvre une nouvelle frontière',
            cours: `L'Arctique se réchauffe deux à quatre fois plus vite que le reste de la planète. Ce qui menace son milieu le rend, paradoxalement, plus accessible et plus convoité.

## Un milieu extrême et vulnérable
| L'élément | Sa fragilité |
| La **banquise** | Sa surface d'été a perdu une large part depuis 1979 |
| Le **pergélisol** | Son dégel déstabilise routes et bâtiments, et libère du **méthane** |
| La **toundra** | Des écosystèmes simples, lents à se régénérer |

> Le méthane libéré accélère le réchauffement : c'est une boucle qui s'auto-entretient.

## Des ressources convoitées
| La ressource | Ce qu'elle représente |
| **Pétrole et gaz** | Une part significative des réserves mondiales non découvertes |
| **Minerais** et terres rares | Un sous-sol encore peu exploité |
| La **pêche** | Des zones qui remontent vers le nord avec les eaux plus chaudes |

## Les routes maritimes
| La route | Son tracé | Son gain |
| La **route maritime du Nord** | Le long des côtes russes | Environ un **tiers** de moins que par Suez, entre Europe et Asie orientale |
| Le **passage du Nord-Ouest** | Le long du Canada | Il s'ouvre également |

> Leur usage reste saisonnier, et coûteux en assurance et en brise-glaces.

## Les acteurs et les règles
| L'acteur | Sa position |
| Les **huit États riverains** — Russie, Canada, États-Unis, Danemark via le Groenland, Norvège, Islande, Suède, Finlande | Ils coopèrent au sein du **Conseil de l'Arctique** |
| Les peuples autochtones, dont les **Inuits** | Ils y sont représentés |
| La **Chine** | Elle se déclare « État proche de l'Arctique » |

Les revendications sur les fonds marins s'arbitrent selon la convention de **Montego Bay** et la règle du plateau continental.

> Ce que la fonte ouvre, ce ne sont pas seulement des routes : c'est un espace où les frontières restent à négocier.`,
          },
          questions: [
            ['À quelle vitesse l’Arctique se réchauffe-t-il par rapport à la moyenne mondiale ?', ['Deux à quatre fois plus vite', 'À la même vitesse', 'Deux fois moins vite', 'Dix fois plus vite'], 0, 'On parle d’amplification arctique.'],
            ['Qu’est-ce que le pergélisol ?', ['Un sol gelé en permanence', 'La banquise d’été', 'Un glacier de montagne', 'Une zone de toundra humide'], 0, 'Son dégel déstabilise le bâti et libère du méthane.'],
            ['Quelle route maritime longe les côtes russes ?', ['La route maritime du Nord', 'Le passage du Nord-Ouest', 'La route de Suez', 'Le passage de Drake'], 0, 'Elle raccourcit d’environ un tiers le trajet Europe-Asie orientale.'],
            ['Quelles ressources du sous-sol arctique sont convoitées ?', ['Hydrocarbures et minerais', 'Uniquement le charbon', 'Uniquement l’eau douce', 'Le sel et le soufre'], 0, 'Avec des zones de pêche qui migrent vers le nord.'],
            ['Combien d’États riverains siègent au Conseil de l’Arctique ?', ['Huit', 'Cinq', 'Douze', 'Trois'], 0, 'Russie, Canada, États-Unis, Danemark, Norvège, Islande, Suède, Finlande.'],
            ['Les peuples autochtones sont représentés au Conseil de l’Arctique.', ['Vrai', 'Faux'], 0, 'Les Inuits notamment y ont un statut de participant permanent.'],
            ['Pourquoi la navigation arctique reste-t-elle limitée ?', ['Saisonnalité, coût des assurances et besoin de brise-glaces', 'Interdiction internationale', 'Absence totale de ports', 'Profondeur insuffisante partout'], 0, 'L’ouverture est réelle mais encore contraignante.'],
            ['Quel pays non riverain se présente comme un État proche de l’Arctique ?', ['La Chine', 'Le Brésil', 'L’Inde', 'L’Australie'], 0, 'Elle investit dans les routes polaires et les ressources.'],
          ],
        },
        {
          titre: 'Les espaces métropolitains et ultramarins français : valorisation et protection',
          axe: 'Sociétés et environnements : des équilibres fragiles',
          rayon: 'geographie',
          lecon: {
            titre: 'Une France de tous les milieux, et de tous les risques',
            cours: `Grâce à ses outre-mer, la France est présente sur tous les océans et abrite une biodiversité exceptionnelle. Cette richesse est aussi une responsabilité.

## Une géographie exceptionnelle
| Le repère | Sa valeur |
| La **zone économique exclusive** française | La **deuxième** du monde, environ 10,2 millions de km² |
| La part due aux outre-mer | Plus de **96 %** |
| Les milieux remarquables | Récifs de Nouvelle-Calédonie et de Polynésie, forêt guyanaise, Terres australes et antarctiques |

## Valoriser
| Le territoire | Ses ressources mises en valeur |
| Les **outre-mer** | Pêche, tourisme balnéaire et de nature, spatial à **Kourou**, nickel calédonien, banane et canne, énergies renouvelables insulaires |
| La **métropole** | Littoraux et montagnes, les espaces les plus valorisés — donc les plus pressés par l'urbanisation |

> Un littoral attire parce qu'il est beau ; il se dégrade parce qu'il attire. Toute la politique de protection tient dans ce cercle.

## Les pressions
| La pression | Où elle s'exerce |
| Artificialisation des sols, étalement urbain | Partout, surtout sur les littoraux |
| Érosion côtière, submersion | Les côtes basses |
| **Chlordécone** | Les Antilles |
| **Orpaillage illégal** | La Guyane |
| Blanchissement des **coraux** | Le Pacifique et l'océan Indien |

Les risques y sont majeurs : cyclones, séismes, volcanisme, submersion.

## Protéger
| L'outil | Son objet |
| **Parcs nationaux** et parcs naturels marins | Des espaces classés |
| Le **Conservatoire du littoral** | L'achat foncier pour soustraire au marché |
| Le réseau **Natura 2000** | La protection à l'échelle européenne |
| Les lois **Littoral** et **Montagne** | L'encadrement de l'urbanisme |
| La gestion intégrée des zones côtières | La coordination des usages |

> La protection réussit quand elle est aussi un projet économique local.`,
          },
          questions: [
            ['Quel rang mondial occupe la zone économique exclusive française ?', ['Le deuxième', 'Le premier', 'Le cinquième', 'Le dixième'], 0, 'Environ 10,2 millions de km², grâce aux outre-mer.'],
            ['Quelle part de la ZEE française provient des outre-mer ?', ['Plus de 96 %', 'Environ 50 %', 'Environ 20 %', 'Environ 75 %'], 0, 'La métropole n’en fournit qu’une petite fraction.'],
            ['Quel équipement stratégique la Guyane accueille-t-elle ?', ['Le centre spatial de Kourou', 'Un port méthanier', 'Une centrale nucléaire', 'Un hub aéroportuaire mondial'], 0, 'La proximité de l’équateur y est un avantage décisif.'],
            ['Quelle pollution durable touche les sols antillais ?', ['Le chlordécone', 'Les marées noires', 'Les pluies acides', 'Les nitrates'], 0, 'Un pesticide utilisé dans les bananeraies, très persistant.'],
            ['Qu’est-ce que le Conservatoire du littoral ?', ['Un établissement public qui achète des espaces côtiers pour les protéger', 'Une agence de tourisme', 'Un service de secours en mer', 'Un label de qualité des plages'], 0, 'Acheter la terre est la protection la plus sûre.'],
            ['Natura 2000 est un réseau européen d’espaces protégés.', ['Vrai', 'Faux'], 0, 'Il vise à concilier biodiversité et activités humaines.'],
            ['Quel phénomène menace particulièrement les récifs coralliens français ?', ['Le blanchissement lié au réchauffement des eaux', 'Le gel hivernal', 'La salinisation', 'L’ensablement'], 0, 'Nouvelle-Calédonie et Polynésie sont en première ligne.'],
            ['Pourquoi la protection doit-elle associer les habitants ?', ['Parce qu’une protection sans projet économique local est mal acceptée', 'Parce que la loi l’impose seulement outre-mer', 'Parce que l’État n’a pas les moyens', 'Parce que les parcs sont privés'], 0, 'Protection et développement doivent aller ensemble.'],
          ],
        },

        // ===================================================================
        // GÉOGRAPHIE — Chapitre 2 : Territoires et population
        // ===================================================================
        {
          titre: 'Des trajectoires démographiques différenciées : les défis du nombre et du vieillissement',
          axe: 'Territoires et population : un défi pour le développement',
          rayon: 'geographie',
          lecon: {
            titre: 'Huit milliards d’humains, deux problèmes opposés',
            cours: `La population mondiale approche 8 milliards d'habitants, mais elle ne croît pas partout au même rythme. Certains pays doivent scolariser une jeunesse nombreuse ; d'autres financer une vieillesse qui s'allonge.

## La transition démographique
| Le régime | La natalité | La mortalité | La population |
| **Ancien** | Forte | Forte | Stable |
| **Transition** | Encore forte | Elle **chute d'abord** | Elle explose |
| **Moderne** | Basse | Basse | Stable, voire en déclin |

L'écart entre les deux courbes s'appelle l'**accroissement naturel**.

## Des situations très contrastées
| La région | Sa situation | Ses traits |
| L'**Afrique subsaharienne** | En pleine transition | Fécondité élevée, population très jeune, croissance rapide |
| L'**Europe**, le **Japon**, la **Corée du Sud** | Post-transitionnelle | Fécondité sous le seuil de renouvellement (2,1 enfants par femme), vieillissement, parfois déclin |

> Une pyramide des âges se lit comme une biographie collective : chaque creux est une guerre, une crise ou une politique.

## Les défis de la jeunesse
| L'étape | Le besoin |
| Nourrir | Sécurité alimentaire |
| Scolariser | Écoles et enseignants |
| Soigner | Système de santé |
| **Employer** | Des millions d'arrivées annuelles sur le marché du travail |

| L'issue | Sa condition |
| Le **dividende démographique** | Une jeunesse bien formée et employée |
| Chômage, informalité, migrations | Un accompagnement insuffisant |

## Les défis du vieillissement
| Le problème | La réponse possible |
| Financement des retraites et de la santé | Allonger la vie active |
| Dépendance | Développer les métiers du grand âge |
| Pénurie de main-d'œuvre | Immigration, automatisation |
| Désertification de territoires | Politiques d'attractivité |`,
          },
          questions: [
            ['Quelles sont les phases du modèle de transition démographique ?', ['Régime ancien, transition, régime moderne', 'Croissance, crise, décroissance', 'Natalité, migration, mortalité', 'Rural, urbain, métropolitain'], 0, 'La mortalité chute avant la natalité : la population explose entre les deux.'],
            ['Quel est le seuil de renouvellement des générations ?', ['Environ 2,1 enfants par femme', '1,5 enfant par femme', '3 enfants par femme', '2,5 enfants par femme'], 0, 'En dessous, la population décline à long terme sans migrations.'],
            ['Quelle région du monde connaît la croissance démographique la plus rapide ?', ['L’Afrique subsaharienne', 'L’Europe de l’Est', 'L’Asie orientale', 'L’Amérique du Nord'], 0, 'Fécondité encore élevée et population très jeune.'],
            ['Qu’appelle-t-on le dividende démographique ?', ['Le gain économique possible quand les actifs sont nombreux face aux inactifs', 'Une aide versée aux familles nombreuses', 'La baisse de la mortalité infantile', 'Le solde migratoire positif'], 0, 'Encore faut-il éduquer et employer cette jeunesse.'],
            ['Que traduit un creux dans une pyramide des âges ?', ['Un événement passé : guerre, crise ou politique démographique', 'Une erreur de recensement', 'Une vague d’émigration récente', 'Une hausse de la mortalité actuelle'], 0, 'La pyramide garde la mémoire des chocs.'],
            ['Le vieillissement pèse sur le financement des retraites et de la santé.', ['Vrai', 'Faux'], 0, 'Moins d’actifs pour davantage de retraités.'],
            ['Quelle réponse au vieillissement consiste à faire venir des travailleurs étrangers ?', ['L’immigration', 'La politique nataliste', 'L’allongement de la vie active', 'L’automatisation'], 0, 'Une réponse rapide, mais politiquement discutée.'],
            ['Quel indicateur mesure le nombre moyen d’enfants par femme ?', ['L’indice de fécondité', 'Le taux de natalité', 'Le solde naturel', 'L’espérance de vie'], 0, 'Il ne doit pas être confondu avec le taux de natalité pour mille habitants.'],
          ],
        },
        {
          titre: 'Développement et inégalités : étude comparative Brésil/Inde',
          axe: 'Territoires et population : un défi pour le développement',
          rayon: 'geographie',
          lecon: {
            titre: 'Deux géants émergents, deux inégalités',
            cours: `Le Brésil et l'Inde sont deux puissances émergentes du G20. Tous deux ont fait reculer la pauvreté ; tous deux restent profondément inégalitaires, mais pas de la même façon.

## Mesurer le développement
| L'indicateur | Ce qu'il mesure | Sa limite |
| Le **PIB par habitant** | La richesse produite | Il ne dit rien du **partage** |
| L'**IDH** | Revenu, espérance de vie, éducation | Il ne dit rien des écarts internes |
| L'indice de **Gini** | L'inégalité des revenus | Il ignore le niveau absolu |
| L'IDH **ajusté aux inégalités** | Le premier corrigé par le second | — |

## Deux géants comparés
| Le critère | **Brésil** | **Inde** |
| Population | Environ 215 millions | Plus de **1,4 milliard**, le plus peuplé du monde |
| Urbanisation | Plus de **85 %** | Encore majoritairement rurale |
| Moteur économique | Agriculture exportatrice puissante | Services et **numérique**, faible industrialisation de masse |
| Nature des inégalités | **Sociales et spatiales** : favelas contre quartiers fermés, Sudeste riche contre **Nordeste** pauvre | Revenus, mais aussi **castes**, **genre**, région : Kerala avancé, Bihar en retard |
| Héritage pesant | L'esclavage et la question foncière | Le système des castes |

> Au Brésil, l'inégalité se voit d'un mur à l'autre d'une même ville ; en Inde, elle se lit aussi dans la naissance.

Les programmes de transferts sociaux ont fait reculer la pauvreté brésilienne dans les années 2000.

## Points communs
| Le trait partagé | Sa manifestation |
| Une croissance forte mais **irrégulière** | Des cycles d'emballement et de crise |
| Des mégapoles à **bidonvilles** | Rio, São Paulo, Bombay, Delhi |
| Un secteur **informel** énorme | Sans protection ni cotisation |
| Une dépendance aux ressources et aux exportations | Vulnérabilité aux cours mondiaux |
| Une forte **pression environnementale** | Déforestation, pollution de l'air et de l'eau |

> Le développement y avance, l'écart y demeure.`,
          },
          questions: [
            ['Que mesure l’indice de développement humain ?', ['Le revenu, la santé et l’éducation', 'La seule richesse par habitant', 'L’inégalité des revenus', 'La croissance du PIB'], 0, 'Un développement ne se réduit pas à un chiffre de production.'],
            ['Que mesure l’indice de Gini ?', ['L’inégalité de la répartition des revenus', 'Le niveau d’instruction', 'La pauvreté absolue', 'L’espérance de vie'], 0, 'Plus il est proche de 1, plus l’inégalité est forte.'],
            ['Quel contraste régional structure les inégalités brésiliennes ?', ['Un Sudeste riche face à un Nordeste pauvre', 'Un Nord industriel face à un Sud agricole', 'Une côte pauvre face à un intérieur riche', 'Un Ouest urbain face à un Est rural'], 0, 'Auquel s’ajoutent les inégalités à l’intérieur des villes.'],
            ['Quel pays est aujourd’hui le plus peuplé du monde ?', ['L’Inde', 'La Chine', 'Les États-Unis', 'Le Brésil'], 0, 'Plus de 1,4 milliard d’habitants.'],
            ['Quelle inégalité spécifique marque encore la société indienne ?', ['Les castes', 'Le servage', 'La ségrégation légale', 'Le régime seigneurial'], 0, 'Officiellement abolies, elles pèsent toujours socialement.'],
            ['Le Brésil est très urbanisé, avec plus de 85 % de citadins.', ['Vrai', 'Faux'], 0, 'L’Inde, elle, reste majoritairement rurale.'],
            ['Qu’est-ce que le secteur informel ?', ['Les activités non déclarées, sans protection sociale ni fiscalité', 'Le secteur public', 'Les entreprises étrangères', 'Le commerce de gros'], 0, 'Il occupe une part énorme des actifs dans les deux pays.'],
            ['Quel État indien est souvent cité pour son avance sociale ?', ['Le Kerala', 'Le Bihar', 'L’Uttar Pradesh', 'Le Rajasthan'], 0, 'Alphabétisation et santé y sont bien supérieures à la moyenne.'],
          ],
        },
        {
          titre: 'Enjeux et défis du vieillissement de la population : l’exemple du Japon',
          axe: 'Territoires et population : un défi pour le développement',
          rayon: 'geographie',
          lecon: {
            titre: 'Le pays le plus âgé du monde',
            cours: `Le Japon est le laboratoire mondial du vieillissement : ce que d'autres pays anticipent, il le vit déjà.

## Les chiffres
| Le repère | Sa valeur |
| La population | Environ **124 millions**, en **baisse** depuis 2010 |
| Les 65 ans et plus | Près de **29 %** |
| L'espérance de vie | Plus de **84 ans** |
| L'indice de fécondité | Environ **1,3** enfant par femme |

## Les causes
| Le facteur | Son effet |
| Alimentation et système de santé | Une espérance de vie exceptionnelle |
| Coût du **logement** et de l'éducation | Un frein direct à la natalité |
| Difficulté à concilier travail et famille | Des maternités reportées |
| Précarité de l'emploi des jeunes | Un recul de l'âge au mariage |
| Une **immigration** longtemps très faible | Aucun apport compensatoire |

> Une société peut réussir sa santé publique et échouer à faire naître : le Japon montre que les deux ne vont pas de soi ensemble.

## Les conséquences
| La conséquence | Sa forme |
| Pénurie de main-d'œuvre | Dans les soins, la logistique, le bâtiment |
| Poids des retraites et de la **dépendance** | Une charge budgétaire croissante |
| Fermeture d'écoles | Faute d'élèves |
| **Villages fantômes** | Dans les campagnes et les préfectures périphériques |
| Concentration dans la mégalopole de **Tokyo** | Le reste du pays se vide |
| Rétraction du marché intérieur | Moins de consommateurs |

## Les réponses
| La réponse | Son état |
| **Robotique** et automatisation | Développées, notamment dans les soins |
| Emploi des **seniors** | Souvent au-delà de 70 ans |
| Travail des femmes | Encouragé |
| Ouverture aux travailleurs étrangers | **Prudente** |
| Politiques familiales, crèches, aides à la garde | En place |
| Revitalisation rurale | Engagée |

> Aucune n'a inversé la tendance à ce jour.`,
          },
          questions: [
            ['Quelle part de la population japonaise a 65 ans ou plus ?', ['Près de 29 %', 'Environ 12 %', 'Environ 45 %', 'Environ 20 %'], 0, 'La plus forte proportion au monde.'],
            ['Depuis quand la population japonaise diminue-t-elle ?', ['Depuis 2010 environ', 'Depuis 1990', 'Depuis 2020', 'Elle ne diminue pas'], 0, 'Décès plus nombreux que naissances, immigration faible.'],
            ['Quel est approximativement l’indice de fécondité japonais ?', ['Environ 1,3 enfant par femme', 'Environ 2,1', 'Environ 0,5', 'Environ 1,9'], 0, 'Très en dessous du seuil de renouvellement.'],
            ['Quelle cause explique la faible fécondité japonaise ?', ['Le coût du logement et la difficulté de concilier travail et famille', 'Une politique de l’enfant unique', 'Un manque de personnel médical', 'Une émigration massive des jeunes'], 0, 'S’y ajoutent la précarité des jeunes et le recul de l’âge au mariage.'],
            ['Quelle conséquence territoriale le vieillissement produit-il ?', ['Des villages abandonnés et une concentration à Tokyo', 'Un exode des villes vers les campagnes', 'Un rééquilibrage entre régions', 'Une croissance des villes moyennes'], 0, 'Les périphéries se vident, la mégalopole se renforce.'],
            ['Le Japon a massivement recours à l’immigration pour compenser le vieillissement.', ['Vrai', 'Faux'], 1, 'L’ouverture reste prudente et récente.'],
            ['Quelle solution technique le Japon développe-t-il face au manque de main-d’œuvre ?', ['La robotique et l’automatisation', 'La délocalisation de la santé', 'La réduction du temps de travail', 'La fermeture des services publics'], 0, 'Notamment dans les soins aux personnes âgées et la logistique.'],
            ['Quelle est approximativement l’espérance de vie au Japon ?', ['Plus de 84 ans', 'Environ 70 ans', 'Environ 78 ans', 'Environ 90 ans'], 0, 'L’une des plus élevées du monde.'],
          ],
        },
        {
          titre: 'Dynamiques démographiques et inégalités socio-économiques en France',
          axe: 'Territoires et population : un défi pour le développement',
          rayon: 'geographie',
          lecon: {
            titre: 'Une population qui vieillit, un territoire qui se recompose',
            cours: `La France compte environ 68 millions d'habitants. Sa population croît encore, mais lentement — et surtout elle se redistribue.

## Le mouvement d'ensemble
| L'indicateur | Son évolution |
| La **fécondité** | Longtemps la plus élevée d'Europe, descendue autour de **1,6** enfant par femme |
| L'**accroissement naturel** | Il se réduit fortement |
| Le **solde migratoire** | Il devient le principal moteur de la croissance |
| Les plus de 65 ans | Plus de **21 %**, et en hausse |

## Les dynamiques territoriales
| Le territoire | Sa dynamique |
| **Littoraux atlantique et méditerranéen**, **Sud-Ouest** | Gains de population |
| Les grandes **métropoles** et leurs couronnes | Gains |
| La **diagonale des faibles densités**, du Nord-Est au Massif central | Pertes |
| Les anciennes régions industrielles | Pertes |

La **périurbanisation** étale les villes bien au-delà de leurs limites administratives.

> On ne quitte pas seulement une région parce qu'elle est pauvre : on la quitte parce qu'on n'y voit pas d'avenir professionnel.

## Les inégalités
| L'inégalité | Sa forme |
| De **revenus** | Entre métropoles et territoires en déprise, et entre quartiers d'une même ville |
| De **logement** | Cherté dans les zones tendues |
| De **santé** | Les **déserts médicaux** |
| **Scolaires** | Un poids fort de l'origine sociale |
| Dans les **outre-mer** | Chômage élevé, jeunesse nombreuse, coût de la vie |

## Les politiques
| Le dispositif | Son objet |
| Politique de la ville, **quartiers prioritaires** | Les quartiers en difficulté |
| **Zones de revitalisation rurale** | Les campagnes en déprise |
| **Maisons France Services** | L'accès aux services publics |
| **Action cœur de ville**, **Petites villes de demain** | Les villes moyennes |
| Aménagement numérique, transports du quotidien | Le désenclavement |

Objectif affiché : la **cohésion des territoires**.`,
          },
          questions: [
            ['Combien d’habitants compte environ la France ?', ['Environ 68 millions', 'Environ 55 millions', 'Environ 80 millions', 'Environ 62 millions'], 0, 'Outre-mer compris.'],
            ['Quel est approximativement l’indice de fécondité français aujourd’hui ?', ['Environ 1,6 enfant par femme', 'Environ 2,1', 'Environ 1,2', 'Environ 2,5'], 0, 'En baisse, mais encore parmi les plus élevés d’Europe.'],
            ['Quel moteur assure désormais l’essentiel de la croissance démographique française ?', ['Le solde migratoire', 'L’accroissement naturel', 'L’allongement de la vie', 'Le retour des expatriés'], 0, 'L’excédent des naissances sur les décès s’est fortement réduit.'],
            ['Qu’appelle-t-on la diagonale des faibles densités ?', ['Une bande peu peuplée allant du Nord-Est au Massif central et au Sud-Ouest', 'La façade méditerranéenne', 'La vallée de la Seine', 'Le littoral atlantique'], 0, 'Elle perd des habitants depuis longtemps.'],
            ['Quelles régions gagnent le plus d’habitants ?', ['Les littoraux atlantique et méditerranéen et les grandes métropoles', 'Le Nord-Est industriel', 'Le Massif central', 'La Champagne'], 0, 'Attractivité du soleil, de la mer et de l’emploi métropolitain.'],
            ['Un désert médical désigne un territoire où l’accès aux soins est difficile.', ['Vrai', 'Faux'], 0, 'Faible densité de médecins et délais d’attente élevés.'],
            ['Qu’est-ce que la périurbanisation ?', ['L’extension de l’habitat et des activités au-delà des limites de la ville', 'Le retour au centre-ville', 'La densification des quartiers anciens', 'La création de villes nouvelles'], 0, 'Elle allonge les déplacements domicile-travail.'],
            ['Quelle difficulté particulière cumulent les outre-mer ?', ['Chômage élevé, jeunesse nombreuse et coût de la vie important', 'Vieillissement et déclin démographique partout', 'Absence de services publics', 'Densité très faible'], 0, 'Mayotte et la Guyane s’en distinguent par leur croissance très forte.'],
          ],
        },
        // ===================================================================
        // GÉOGRAPHIE — Chapitre 3 : Des mobilités humaines généralisées
        // ===================================================================
        {
          titre: 'Enjeux et défis des migrations internationales',
          axe: 'Des mobilités humaines généralisées',
          rayon: 'geographie',
          lecon: {
            titre: 'Qui part, d’où, vers où, et pourquoi',
            cours: `Environ 281 millions de personnes vivent hors de leur pays de naissance, soit un peu plus de 3 % de l'humanité. La migration internationale est donc minoritaire — et pourtant décisive.

## Les mots
| Le terme | Sa définition |
| **Migrant** | Une personne qui change de pays de résidence |
| **Réfugié** | Il fuit des persécutions ; statut défini par la convention de **Genève**, 1951 |
| **Demandeur d'asile** | Il attend la décision |
| **Déplacé interne** | Il reste dans son pays |
| **Diaspora** | Une population dispersée qui garde des liens avec son territoire d'origine |

## Les causes
| Le type de migration | Ses moteurs |
| **Économique** | Écarts de revenus, emploi, études |
| **Contrainte** | Guerres, persécutions, catastrophes, dégradation de l'environnement |

> Les deux se mêlent souvent. Et la migration coûte cher : ce ne sont pas les plus pauvres qui partent le plus loin.

> Un migrant sur deux se déplace à l'intérieur de sa propre région du monde : les flux **Sud-Sud** sont plus nombreux que les flux Sud-Nord.

## Les effets
| Pour qui | L'apport | Le coût |
| Le pays de **départ** | Des **remises** massives, parfois supérieures à l'aide publique au développement | La fuite des cerveaux |
| Le pays d'**arrivée** | Main-d'œuvre, rajeunissement, cotisations | Des débats politiques sur l'intégration |
| Le **migrant** | Une mobilité sociale possible | Discrimination et précarité fréquentes |

## Les routes et les frontières
| La route | Sa dangerosité |
| Méditerranée centrale | La plus meurtrière |
| Balkans, Manche | Des passages surveillés |
| Frontière Mexique-États-Unis | Désert et murs |
| Golfe d'Aden | Traversées et détentions |

> Les États durcissent les contrôles — **Frontex**, murs, clôtures — ce qui allonge et renchérit les trajets sans les supprimer.`,
          },
          questions: [
            ['Combien de personnes vivent hors de leur pays de naissance ?', ['Environ 281 millions', 'Environ 1 milliard', 'Environ 50 millions', 'Environ 700 millions'], 0, 'Un peu plus de 3 % de la population mondiale.'],
            ['Quel texte international définit le statut de réfugié ?', ['La convention de Genève de 1951', 'La charte de l’ONU de 1945', 'Les accords de Schengen', 'La convention de Montego Bay'], 0, 'Elle protège ceux qui fuient des persécutions.'],
            ['Quelle différence entre un réfugié et un déplacé interne ?', ['Le déplacé interne n’a pas franchi de frontière internationale', 'Le déplacé interne est un migrant économique', 'Le réfugié est toujours temporaire', 'Il n’y a aucune différence'], 0, 'Le droit international les traite différemment.'],
            ['Les migrations Sud-Sud sont-elles plus nombreuses que les migrations Sud-Nord ?', ['Oui, la majorité des migrants restent dans leur région du monde', 'Non, l’essentiel va vers le Nord', 'Elles sont négligeables', 'Elles n’existent qu’en Afrique'], 0, 'L’image d’un flux unique vers le Nord est trompeuse.'],
            ['Que sont les remises migratoires ?', ['L’argent envoyé par les migrants à leur famille restée au pays', 'Les aides versées par l’État d’accueil', 'Les frais payés aux passeurs', 'Les visas accordés chaque année'], 0, 'Elles dépassent parfois l’aide publique au développement.'],
            ['Ce sont les plus pauvres qui migrent le plus loin.', ['Vrai', 'Faux'], 1, 'Migrer coûte cher : les plus démunis se déplacent surtout à proximité.'],
            ['Qu’est-ce que Frontex ?', ['L’agence européenne de garde-frontières et de garde-côtes', 'Un programme d’accueil des réfugiés', 'Un fonds d’aide au développement', 'Une ONG de sauvetage en mer'], 0, 'Elle coordonne la surveillance des frontières extérieures de l’Union.'],
            ['Qu’appelle-t-on la fuite des cerveaux ?', ['Le départ des personnes les plus qualifiées d’un pays', 'Le retour des diplômés au pays', 'La formation des étudiants étrangers', 'Le recrutement local des ingénieurs'], 0, 'Une perte pour le pays de départ, qui a financé leur formation.'],
          ],
        },
        {
          titre: 'Les mobilités touristiques à l’échelle mondiale : étude comparative entre les USA et Dubaï',
          axe: 'Des mobilités humaines généralisées',
          rayon: 'geographie',
          lecon: {
            titre: 'Deux manières de fabriquer une destination',
            cours: `Le tourisme international est la première mobilité de la planète : plus d'un milliard d'arrivées par an avant la pandémie.

## Le tourisme, une industrie
| Le repère | Sa valeur |
| La définition | Au moins **une nuitée** hors de son environnement habituel |
| Son poids | Environ un **dixième** du PIB mondial, effets indirects compris |
| Sa concentration | Europe, Amérique du Nord et Asie orientale captent l'essentiel des arrivées |

## Deux modèles opposés
| Le critère | **États-Unis** | **Dubaï** |
| L'ancienneté | Un espace touristique **ancien** | Trente ans de construction |
| La ressource | Des atouts **existants** : nature et patrimoine | Une destination **créée de toutes pièces** |
| Les sites | New York, Yellowstone, Grand Canyon, Orlando, Floride, Californie, Las Vegas | Burj Khalifa, îles artificielles, centres commerciaux climatisés, hôtellerie de luxe |
| Le tourisme intérieur | **Massif** | Faible |
| Le levier de transport | Des hubs aéroportuaires mondiaux | Le hub d'**Emirates**, au carrefour Europe-Asie-Afrique |
| L'objectif | Une activité parmi d'autres | La **diversification** hors de la rente pétrolière, et l'image |

> Les États-Unis mettent en tourisme ce qu'ils ont ; Dubaï met en tourisme ce qu'il construit.

## Ce que le tourisme fait aux territoires
| L'apport | Le coût |
| Emplois et devises | Le **surtourisme** dans les sites les plus fréquentés |
| Rénovation du patrimoine | Hausse des prix immobiliers, éviction des habitants |
| Aménagements | Artificialisation des littoraux |
| — | Forte consommation d'eau et d'énergie : dessalement et climatisation à Dubaï, fréquentation des parcs aux États-Unis |

> La main-d'œuvre immigrée, très nombreuse dans le Golfe, travaille souvent dans des conditions dénoncées par les ONG.`,
          },
          questions: [
            ['Qu’est-ce qui distingue un touriste d’un simple excursionniste ?', ['Le touriste passe au moins une nuit hors de son environnement habituel', 'Le touriste voyage à l’étranger', 'Le touriste paie un hébergement', 'Le touriste voyage en avion'], 0, 'La nuitée est le critère retenu par les statistiques internationales.'],
            ['Quelles régions captent l’essentiel des arrivées touristiques mondiales ?', ['Europe, Amérique du Nord et Asie orientale', 'Afrique et Amérique du Sud', 'Océanie et Asie centrale', 'Moyen-Orient uniquement'], 0, 'Le tourisme mondial est très concentré.'],
            ['Sur quoi repose l’attractivité touristique des États-Unis ?', ['Des ressources naturelles et patrimoniales existantes, très diversifiées', 'Des équipements entièrement artificiels', 'La seule clientèle étrangère', 'Le tourisme religieux'], 0, 'Parcs nationaux, métropoles, littoraux, parcs à thèmes.'],
            ['Comment Dubaï est-elle devenue une destination majeure ?', ['En créant de toutes pièces des équipements spectaculaires', 'En protégeant un patrimoine ancien', 'En développant l’écotourisme désertique', 'En misant sur le tourisme de montagne'], 0, 'Tours, îles artificielles, malls, hôtellerie de luxe.'],
            ['Quel rôle joue la compagnie Emirates pour Dubaï ?', ['Elle fait de la ville un hub aérien entre Europe, Asie et Afrique', 'Elle finance les parcs naturels', 'Elle gère les hôtels de l’émirat', 'Elle exporte le pétrole'], 0, 'La position de carrefour est au cœur de la stratégie.'],
            ['Le tourisme représente environ un dixième du PIB mondial en comptant ses effets indirects.', ['Vrai', 'Faux'], 0, 'Transport, hébergement, restauration, loisirs et leurs fournisseurs.'],
            ['Qu’est-ce que le surtourisme ?', ['Une fréquentation excessive qui dégrade le lieu et la vie des habitants', 'Un tourisme haut de gamme', 'Le tourisme hors saison', 'Le tourisme d’affaires'], 0, 'Venise, Barcelone ou certains parcs nationaux en sont des exemples.'],
            ['Quelle contrainte environnementale pèse particulièrement sur Dubaï ?', ['La consommation d’eau dessalée et d’énergie pour la climatisation', 'Le manque de terrains constructibles', 'Le froid hivernal', 'La pollution des rivières'], 0, 'Un modèle très coûteux en énergie.'],
          ],
        },
        {
          titre: 'La mer Méditerranée : un bassin migratoire',
          axe: 'Des mobilités humaines généralisées',
          rayon: 'geographie',
          lecon: {
            titre: 'Une frontière entre deux mondes inégaux',
            cours: `La Méditerranée met en contact des pays dont les revenus par habitant varient dans un rapport de un à dix. Interface ancienne d'échanges, elle est aussi l'une des frontières les plus meurtrières du monde.

## Une interface de contrastes
| La rive | Ses traits |
| **Nord** — l'Union européenne | Population vieillissante, revenus élevés, stabilité |
| **Sud et Est** | Populations jeunes, chômage élevé, pays parfois déstabilisés : Syrie, Libye, Sahel |

L'écart démographique et économique alimente les mobilités.

## Trois routes
| La route | Son tracé |
| **Occidentale** | Maroc vers l'Espagne, et les Canaries |
| **Centrale** | Libye et Tunisie vers l'Italie et Malte |
| **Orientale** | Turquie vers la Grèce, puis les Balkans |

> Les itinéraires se déplacent selon les contrôles : fermer une route, c'est en ouvrir une autre, souvent plus dangereuse.

> Depuis 2014, plus de **30 000 disparitions** ont été recensées en Méditerranée.

## Les acteurs
| L'acteur | Son rôle |
| Migrants et réfugiés | Ceux qui traversent |
| **Passeurs** | Ils organisent, et exploitent |
| Garde-côtes des deux rives, **Frontex** | Ils contrôlent |
| **ONG de sauvetage** | Elles secourent, et sont parfois entravées |
| États côtiers | Ils négocient les débarquements |
| Union européenne | Elle finance des accords avec la Turquie ou la Libye |

Les pays du Sud sont à la fois pays de **départ**, de **transit** et, de plus en plus, d'**accueil**.

## Pas seulement des migrations
| L'autre usage | Sa réalité |
| Le **tourisme** | La première destination touristique du monde |
| Le **commerce** | Suez, Gibraltar, ports de Tanger Med, Algésiras, Le Pirée |
| Les **coopérations culturelles** | Universités, festivals, échanges |

> Le même bassin porte des mobilités choisies et des mobilités contraintes.`,
          },
          questions: [
            ['Qu’est-ce qu’une interface en géographie ?', ['Une zone de contact entre deux espaces différents, lieu d’échanges', 'Une frontière fermée', 'Un espace vide entre deux pays', 'Une zone économique exclusive'], 0, 'La Méditerranée en est un exemple classique.'],
            ['Quelles sont les trois grandes routes migratoires méditerranéennes ?', ['Occidentale, centrale et orientale', 'Nord, Sud et Est', 'Atlantique, Adriatique et Égéenne', 'Maritime, terrestre et aérienne'], 0, 'Elles se déplacent au gré des contrôles.'],
            ['Que se passe-t-il lorsqu’une route migratoire est fermée par les contrôles ?', ['Les flux se reportent sur une autre route, souvent plus dangereuse', 'Les départs cessent', 'Les migrants rentrent chez eux', 'Les passeurs disparaissent'], 0, 'Le durcissement allonge et renchérit les trajets.'],
            ['Combien de disparitions ont été recensées en Méditerranée depuis 2014 ?', ['Plus de 30 000', 'Environ 2 000', 'Environ 500', 'Environ 100 000'], 0, 'La frontière la plus meurtrière du monde.'],
            ['Quel écart alimente les mobilités entre les deux rives ?', ['Un écart démographique et économique important', 'Un écart de superficie', 'Un écart climatique', 'Un écart linguistique'], 0, 'Nord vieillissant et riche, Sud jeune et au chômage élevé.'],
            ['Les pays du Sud méditerranéen ne sont que des pays de départ.', ['Vrai', 'Faux'], 1, 'Ils sont aussi des pays de transit et, de plus en plus, d’accueil.'],
            ['Quel grand port marocain s’est imposé comme hub de conteneurs ?', ['Tanger Med', 'Agadir', 'Casablanca uniquement', 'Nador'], 0, 'Face à Algésiras, au débouché du détroit de Gibraltar.'],
            ['La Méditerranée est la première région touristique mondiale.', ['Vrai', 'Faux'], 0, 'Le même bassin porte mobilités choisies et mobilités contraintes.'],
          ],
        },
        {
          titre: 'La France : mobilités, transports et enjeux d’aménagement',
          axe: 'Des mobilités humaines généralisées',
          rayon: 'geographie',
          lecon: {
            titre: 'Se déplacer tous les jours, et aménager pour cela',
            cours: `En France, l'essentiel des mobilités n'est pas touristique : c'est le déplacement quotidien qui structure l'aménagement du territoire.

## Des mobilités quotidiennes massives
| Le motif | Son poids |
| Domicile-travail | Le premier |
| Domicile-études | Quotidien, contraint |
| Achats et loisirs | En hausse avec la périurbanisation |

> La périurbanisation a allongé les distances : de nombreux actifs travaillent hors de leur commune, et la **voiture** domine, faute d'alternative dans les espaces peu denses.

Les **navetteurs** franciliens font partie des trajets domicile-travail les plus longs d'Europe.

## Un réseau en étoile
| Le trait | Sa conséquence |
| Un réseau **radial**, centré sur Paris | Autoroutes, LGV et réseau ferré convergent vers la capitale |
| Le **TGV** | Lyon à deux heures, Marseille à trois |
| Les liaisons **transversales** | Lentes, de province à province |

> Une ligne à grande vitesse ne relie pas seulement deux villes : elle décide aussi de celles qu'elle ne dessert pas.

## Les inégalités d'accès
| Le territoire | Son offre |
| Les **métropoles** | Métros, tramways, RER, vélos en libre-service |
| Les espaces ruraux et périurbains | Souvent une seule route |

On parle de **vulnérabilité à la mobilité** pour les ménages contraints à de longs trajets en voiture, très sensibles au prix des carburants — un ressort des mouvements sociaux récents.

## Aménager autrement
| Le levier | Son objet |
| Transports en commun structurants, **RER métropolitains** | Les déplacements de masse |
| Covoiturage, plans **vélo** | Les courtes distances |
| Réouverture de **petites lignes** | Le désenclavement ferroviaire |
| **Télétravail** | Moins de trajets |
| Réduction de l'artificialisation | Des distances plus courtes à terme |

> La loi d'orientation des mobilités de 2019 place la priorité sur les **transports du quotidien** plutôt que sur les grands projets.`,
          },
          questions: [
            ['Quelle mobilité représente l’essentiel des déplacements des Français ?', ['Les déplacements quotidiens, notamment domicile-travail', 'Les voyages touristiques', 'Les migrations internationales', 'Les déplacements professionnels longue distance'], 0, 'Ce sont eux qui structurent l’aménagement.'],
            ['Comment qualifie-t-on l’organisation du réseau de transport français ?', ['Radiale, centrée sur Paris', 'Maillée et polycentrique', 'Littorale', 'Transversale'], 0, 'Un héritage ancien, renforcé par les LGV.'],
            ['Quel effet pervers la grande vitesse ferroviaire produit-elle ?', ['Elle met à l’écart les territoires non desservis', 'Elle sature les autoroutes', 'Elle augmente le trafic aérien intérieur', 'Elle vide les métropoles'], 0, 'La desserte crée un avantage, l’absence de desserte un handicap.'],
            ['Qu’est-ce qu’un navetteur ?', ['Une personne qui fait quotidiennement le trajet domicile-travail entre deux communes', 'Un marin de commerce', 'Un touriste régulier', 'Un travailleur saisonnier'], 0, 'Les navettes franciliennes sont parmi les plus longues d’Europe.'],
            ['Pourquoi la voiture domine-t-elle dans les espaces peu denses ?', ['Faute d’alternatives en transports collectifs', 'Parce qu’elle y est moins chère à l’achat', 'Parce que les routes y sont gratuites', 'Parce que les distances y sont courtes'], 0, 'D’où la vulnérabilité au prix des carburants.'],
            ['La loi d’orientation des mobilités de 2019 privilégie les transports du quotidien.', ['Vrai', 'Faux'], 0, 'Plutôt que les grands projets d’infrastructure.'],
            ['Qu’appelle-t-on la vulnérabilité à la mobilité ?', ['La fragilité des ménages contraints à de longs trajets en voiture', 'L’insécurité routière', 'L’absence de permis de conduire', 'La congestion urbaine'], 0, 'Une hausse des carburants pèse aussitôt sur leur budget.'],
            ['Quelle solution permet de réduire les déplacements sans nouvelle infrastructure ?', ['Le télétravail', 'La construction d’autoroutes', 'L’extension des parkings', 'L’augmentation du parc automobile'], 0, 'Avec le covoiturage et l’aménagement numérique.'],
          ],
        },

        // ===================================================================
        // GÉOGRAPHIE — Chapitre 4 : L’Afrique australe
        // ===================================================================
        {
          titre: 'L’aménagement et la valorisation des milieux d’Afrique australe',
          axe: 'L’Afrique australe : un espace en profonde mutation',
          rayon: 'geographie',
          lecon: {
            titre: 'Des milieux contrastés, une eau qui commande tout',
            cours: `L'Afrique australe réunit une dizaine d'États au sud du continent. Ses milieux sont variés, et presque partout la ressource limitante est l'eau.

## Des milieux très différents
| Le milieu | Sa localisation |
| Les déserts du **Namib** et du **Kalahari** | L'ouest |
| Les savanes du **veld** | L'intérieur |
| Les hauts plateaux tempérés | L'Afrique du Sud intérieure |
| La façade **méditerranéenne** | Autour du Cap |
| La zone tropicale humide et le delta de l'**Okavango** | Le nord |

> Les précipitations décroissent d'est en ouest, la variabilité interannuelle est forte, et les sécheresses sont récurrentes.

## Valoriser les milieux
| L'activité | Où et quoi |
| Les **mines** | Or, platine, chrome, charbon en Afrique du Sud ; diamants au Botswana ; cuivre en Zambie ; uranium en Namibie |
| L'agriculture **commerciale** | Vignobles du Cap, agrumes, canne, élevage extensif |
| L'agriculture **vivrière** | Fragile, dépendante des pluies |
| Le **tourisme** | Safaris du Kruger, du Chobe, d'Etosha, de l'Okavango ; littoraux |
| La **pêche** | Les côtes atlantiques poissonneuses du courant de **Benguela** |

> Ici, aménager, c'est d'abord transporter l'eau : barrages, transferts entre bassins, dessalement, irrigation. Le reste en dépend.

## Les grands aménagements
| L'aménagement | Son rôle |
| Barrages et transferts, dont le **Lesotho Highlands Water Project** | Alimenter le Gauteng en eau |
| Les **corridors de transport** | Relier les mines de l'intérieur aux ports : Durban, Richards Bay, Walvis Bay, Maputo, Beira |
| Les centrales électriques | En majorité au **charbon** en Afrique du Sud, avec de fortes coupures |

## Les fragilités
| La fragilité | Son illustration |
| Les **sécheresses** | La crise du Cap en 2018, et son compte à rebours vers le « jour zéro » |
| L'érosion des sols | Une agriculture fragilisée |
| Le **braconnage** | Rhinocéros, éléphants |
| Les pollutions minières | Eaux acides, métaux lourds |
| La dépendance au **charbon** | Une vulnérabilité au changement climatique |

> Les aires protégées, très étendues, entrent parfois en conflit avec les besoins des populations riveraines.`,
          },
          questions: [
            ['Quelle ressource limite le plus l’aménagement en Afrique australe ?', ['L’eau', 'Le bois', 'Le charbon', 'Le sable'], 0, 'Sécheresses récurrentes et forte variabilité des pluies.'],
            ['Quel désert borde la côte atlantique de la Namibie ?', ['Le Namib', 'Le Kalahari', 'Le Sahara', 'Le Karoo'], 0, 'Un désert côtier, l’un des plus anciens du monde.'],
            ['Quelle production minière fait la richesse du Botswana ?', ['Le diamant', 'Le pétrole', 'Le cuivre', 'La bauxite'], 0, 'Une rente bien gérée, qui a financé écoles et infrastructures.'],
            ['Quel delta intérieur célèbre attire le tourisme de nature ?', ['L’Okavango', 'Le delta du Zambèze', 'Le delta de l’Orange', 'Le delta du Limpopo'], 0, 'Un delta qui n’atteint pas la mer, au Botswana.'],
            ['De quelle énergie l’Afrique du Sud dépend-elle massivement ?', ['Le charbon', 'L’hydraulique', 'Le nucléaire', 'L’éolien'], 0, 'D’où de fortes émissions et des coupures fréquentes.'],
            ['La ville du Cap a connu en 2018 une crise majeure de l’eau.', ['Vrai', 'Faux'], 0, 'Le compte à rebours vers le jour zéro a marqué les esprits.'],
            ['À quoi servent les corridors de transport de la région ?', ['À relier les mines de l’intérieur aux ports', 'À protéger la faune', 'À irriguer les terres', 'À relier les capitales entre elles'], 0, 'Durban, Walvis Bay, Maputo, Beira sont les débouchés.'],
            ['Pourquoi les aires protégées créent-elles parfois des conflits ?', ['Elles limitent l’accès des populations riveraines aux ressources', 'Elles coûtent trop cher à l’État', 'Elles attirent trop peu de touristes', 'Elles sont mal délimitées juridiquement'], 0, 'Conservation et besoins locaux doivent être conciliés.'],
          ],
        },
        {
          titre: 'Les défis de la transition et du développement pour les pays d’Afrique australe inégalement développés',
          axe: 'L’Afrique australe : un espace en profonde mutation',
          rayon: 'geographie',
          lecon: {
            titre: 'Une région à plusieurs vitesses',
            cours: `L'Afrique australe concentre à la fois le pays le plus industrialisé du continent et quelques-uns des plus pauvres. C'est une région d'écarts.

## Des niveaux de développement très inégaux
| Le pays | Sa position |
| L'**Afrique du Sud** | Une large part du PIB régional : industrie, mines, finance, services |
| Le **Botswana**, la **Namibie** | Un revenu par habitant intermédiaire |
| Le **Mozambique**, le **Malawi**, le **Zimbabwe** | Parmi les pays les plus pauvres du monde |

Les IDH s'échelonnent en conséquence.

## L'héritage sud-africain
| La période | Ce qu'elle a produit |
| L'**apartheid**, 1948-1991 | Une ségrégation légale : séparation des populations, inégalité d'accès à la terre, à l'école, à l'emploi |
| Depuis **1994** et l'élection de **Nelson Mandela** | La démocratie, mais un pays qui reste parmi les plus inégalitaires du monde |

**Townships** face aux quartiers fermés, chômage élevé, question foncière non résolue.

> Une ségrégation peut être abolie en un jour ; sa géographie, elle, met des générations à s'effacer.

## Les défis communs
| Le défi | Son contenu |
| Le **chômage des jeunes** | Massif |
| L'économie **informelle** | Sans protection ni cotisation |
| La dépendance aux **matières premières** | Donc aux cours mondiaux |
| L'**endettement** et la corruption | Une marge de manœuvre réduite |
| L'épidémie de **VIH** | Elle a lourdement pesé sur l'espérance de vie |
| Les réseaux d'**électricité** et d'**eau** | Insuffisants |

## Les leviers
| Le levier | Son apport |
| L'intégration régionale par la **SADC** | Un marché élargi |
| La zone de libre-échange continentale africaine | Des débouchés |
| Les investissements chinois et européens | Des infrastructures |
| La transition vers le **solaire** et l'**éolien** | Une électricité moins dépendante du charbon |
| Industrialisation, formation, gouvernance | La valeur ajoutée locale |

> Le Botswana est souvent cité comme exemple de rente minière bien administrée.`,
          },
          questions: [
            ['Quel pays domine économiquement l’Afrique australe ?', ['L’Afrique du Sud', 'Le Mozambique', 'La Zambie', 'Le Malawi'], 0, 'Industrie, mines, finance et services y sont concentrés.'],
            ['Qu’était l’apartheid ?', ['Un régime de ségrégation légale des populations en Afrique du Sud', 'Un système de partage des terres', 'Une politique migratoire', 'Un accord commercial régional'], 0, 'En vigueur de 1948 à 1991.'],
            ['Qui devient président de l’Afrique du Sud en 1994 ?', ['Nelson Mandela', 'Desmond Tutu', 'Thabo Mbeki', 'Frederik de Klerk'], 0, 'Première élection au suffrage universel non racial.'],
            ['Qu’est-ce qu’un township ?', ['Un quartier périphérique pauvre, hérité de la ségrégation', 'Un centre-ville d’affaires', 'Une réserve naturelle', 'Une zone industrielle'], 0, 'Soweto en est l’exemple le plus connu.'],
            ['Quelle organisation régionale regroupe les États d’Afrique australe ?', ['La SADC', 'La CEDEAO', 'L’UEMOA', 'Le COMESA seul'], 0, 'Communauté de développement d’Afrique australe.'],
            ['L’Afrique du Sud est aujourd’hui un pays très égalitaire.', ['Vrai', 'Faux'], 1, 'Elle reste l’un des pays les plus inégalitaires du monde.'],
            ['Quel problème sanitaire a lourdement pesé sur l’espérance de vie régionale ?', ['L’épidémie de VIH', 'Le paludisme uniquement', 'Le choléra', 'La tuberculose seule'], 0, 'Elle a fait reculer l’espérance de vie pendant des années.'],
            ['Quel pays est souvent cité comme exemple de rente minière bien gérée ?', ['Le Botswana', 'Le Zimbabwe', 'L’Angola', 'La Zambie'], 0, 'Les revenus du diamant y ont financé écoles et infrastructures.'],
          ],
        },
        {
          titre: 'Des territoires d’Afrique australe transformés par les mobilités',
          axe: 'L’Afrique australe : un espace en profonde mutation',
          rayon: 'geographie',
          lecon: {
            titre: 'Migrations de travail, villes qui gonflent, touristes qui passent',
            cours: `En Afrique australe, les mobilités ont bâti les villes minières, vidé des campagnes et fait vivre des familles entières par les transferts d'argent.

## Un héritage minier
| Le fait | Sa portée |
| Les mines d'or et de diamants du **Witwatersrand**, depuis la fin du XIXe siècle | Elles attirent une main-d'œuvre du Lesotho, du Mozambique, du Malawi, du Zimbabwe |
| Le système de **travail migrant** et des compounds | Il organise cette circulation |

> Cette circulation ancienne explique encore la géographie du peuplement.

## L'Afrique du Sud, pôle d'attraction
| Le fait | Son effet |
| Elle attire migrants économiques et demandeurs d'asile, surtout du **Zimbabwe** et du **Mozambique** | **Johannesburg** est la métropole régionale |
| Les migrants alimentent le secteur informel et les services | Une économie qui dépend d'eux |
| Les violences **xénophobes**, en 2008 et 2015 | La tension sociale de la concurrence pour l'emploi |

> Un pays peut être en même temps la terre promise d'une région et un territoire où l'on redoute celui qui arrive.

## Urbanisation rapide
| La ville | Sa croissance |
| Johannesburg, Le Cap, Durban | Les pôles sud-africains |
| Luanda, Maputo, Lusaka | Les capitales voisines |

L'urbanisation se fait souvent par des **quartiers informels**, faute de logements abordables, avec des difficultés d'accès à l'eau, à l'électricité et aux transports. Les campagnes, elles, se vident de leurs actifs.

## Les autres mobilités
| La mobilité | Ce qu'elle apporte |
| Le **tourisme** international | Il fait vivre des régions entières autour des parcs et du littoral |
| Les mobilités **étudiantes** | Vers les universités sud-africaines |
| Les **diasporas** | Des **remises**, ressource essentielle pour le Lesotho ou le Zimbabwe |
| Le commerce transfrontalier informel | Très féminin, le long des corridors |`,
          },
          questions: [
            ['Quelle activité a organisé les premières grandes migrations de travail dans la région ?', ['L’exploitation minière', 'Le tourisme', 'La pêche industrielle', 'La culture du coton'], 0, 'Les mines du Witwatersrand recrutaient dans toute la région.'],
            ['Quel pays est aujourd’hui le principal pôle d’attraction migratoire régional ?', ['L’Afrique du Sud', 'La Zambie', 'La Namibie', 'Le Malawi'], 0, 'Surtout depuis le Zimbabwe et le Mozambique.'],
            ['Quelle métropole concentre l’essentiel de cette attraction ?', ['Johannesburg', 'Windhoek', 'Gaborone', 'Lusaka'], 0, 'Née de la mine, devenue la capitale économique régionale.'],
            ['Qu’ont révélé les violences de 2008 et 2015 en Afrique du Sud ?', ['Des tensions xénophobes liées à la concurrence pour l’emploi', 'Un conflit frontalier', 'Une crise sanitaire', 'Une révolte étudiante'], 0, 'La pauvreté et le chômage nourrissent le rejet des migrants.'],
            ['Comment se fait principalement l’urbanisation dans la région ?', ['Par des quartiers informels, faute de logements abordables', 'Par des villes nouvelles planifiées', 'Par la densification des centres anciens', 'Par des lotissements pavillonnaires'], 0, 'Avec des difficultés d’accès à l’eau et à l’électricité.'],
            ['Les remises envoyées par les diasporas sont essentielles pour le Lesotho.', ['Vrai', 'Faux'], 0, 'Comme pour le Zimbabwe : elles font vivre de nombreux ménages.'],
            ['Quelle mobilité fait vivre les régions proches des parcs nationaux ?', ['Le tourisme international', 'La migration de travail', 'Les mobilités étudiantes', 'Le commerce transfrontalier'], 0, 'Safaris, hébergement, guides et emplois indirects.'],
            ['Quelle activité transfrontalière informelle est largement exercée par des femmes ?', ['Le petit commerce le long des corridors', 'L’extraction minière', 'Le transport routier', 'La pêche hauturière'], 0, 'Une économie de la frontière peu visible dans les statistiques.'],
          ],
        },
      ],
    },
  ],
}
