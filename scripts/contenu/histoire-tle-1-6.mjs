// Histoire — Terminale : LES CHAPITRES 1 À 6, ceux qui manquaient (20 fiches).
//
// CE QU'IL MANQUAIT. La migration 227 avait posé les chapitres 7 à 11 du
// programme (13 fiches, positions 26 à 38) en RÉSERVANT les positions 6 à 25 aux
// chapitres 1 à 6, dont les captures n'avaient pas encore été transmises. Un
// élève de Terminale ouvrait donc son histoire sur 1989 : la crise de 1929, les
// régimes totalitaires, la Seconde Guerre mondiale, la guerre froide, la
// décolonisation et la France de la IVe République n'existaient nulle part —
// sauf sous la forme de trois fiches génériques héritées du premier jeu de
// données (« Démocraties fragiles et totalitarismes », « La Seconde Guerre
// mondiale », « La Guerre froide »).
//
// CE MODULE COMPLÈTE LE PROGRAMME. 20 fiches, rangées sous les 6 chapitres
// manquants, aux positions 6 à 25 — exactement la place réservée. Avec les 13
// fiches de la 227, l'histoire de Terminale compte enfin ses 11 chapitres.
//
// IL RANGE AUSSI TOUT LE RESTE (voir `menage`). Les 13 fiches de la 227 et les
// 20 fiches de géographie de la 229 n'avaient aucun chapitre en base : sans
// elles, la page matière afficherait 6 chapitres neufs PLUS un fourre-tout
// « Autres chapitres » de 33 lignes. Deux UPDATE leur posent le leur — les
// intitulés viennent du même programme que les captures.
//
// LES 5 CHAPITRES HÉRITÉS PARTENT, et cette fois c'est une nécessité technique
// autant qu'un choix : la fiche « La Seconde Guerre mondiale » de ce module
// porte le MÊME TITRE que l'un d'eux, et `chapters` a un UNIQUE(subject_id,
// level, title) — sans le ménage, l'insertion serait ignorée (ON CONFLICT DO
// NOTHING) et sa leçon tomberait sur une clé étrangère absente, migration
// arrêtée à mi-parcours. Deux d'entre eux (« Mers et océans dans la
// mondialisation », « L'Union européenne dans la mondialisation ») sont par
// ailleurs les DOUBLONS connus des chapitres 1 et 3 de géographie, signalés dans
// l'en-tête de `geographie-tle.mjs` et laissés en place depuis.
//
// ⚠️ Le slug reste `histoire-geo`. Comme `histoire-geo-tle.mjs` (227),
// `geographie-tle.mjs` (229) et `histoire-geo-1re.mjs` (245), ce module se
// génère par `--modules` : `--slugs histoire-geo` fusionnerait les quatre et
// réécrirait des migrations déjà exécutées.

export default {
  slug: 'histoire-geo',
  nom: 'Histoire-Géographie',

  titreMigration: 'HISTOIRE Tle — LES CHAPITRES 1 À 6 (1929 → 1969)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs Tle histoire-geo,
19/08/2026) : l'histoire de Terminale commençait à « L'influence de la chute de
l'URSS sur l'Europe ». Les six premiers chapitres du programme — la crise de
1929, les régimes totalitaires, la Seconde Guerre mondiale, le nouvel ordre
bipolaire, la guerre froide et la décolonisation, la France de la IVe et de la
Ve République — n'avaient jamais été écrits : la 227 leur avait réservé les
positions 6 à 25 en attendant. Un élève qui révisait le nazisme, Vichy, la
Shoah, la crise de Cuba ou la guerre d'Algérie ne trouvait que trois fiches
génériques héritées du premier jeu de données.
Cette migration installe les 20 fiches manquantes à la place réservée, range
sous leurs chapitres les 13 fiches d'histoire de la 227 et les 20 fiches de
géographie de la 229, et retire les 5 fiches génériques que ce découpage
recouvre — dont les deux doublons de géographie connus depuis la 229.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses fiches sous leurs chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS, comme dans les migrations 243,
244 et 245 : la 234 elle-même n'a jamais été exécutée. Sans cette reprise, la
migration échouerait sur "column chapters.theme does not exist" APRÈS avoir
supprimé les 5 chapitres hérités — une matière amputée.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
et ne l'a rendu que colonne par colonne ; une colonne ajoutée après elle n'hérite
d'aucun droit.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités du premier jeu de données partent. Trois sont des
fiches de synthèse que les 20 neuves recouvrent entièrement ("Démocraties
fragiles et totalitarismes" -> chapitres 1 et 2, "La Seconde Guerre mondiale" ->
chapitre 3, "La Guerre froide" -> chapitre 5) ; les deux autres ("Mers et océans
dans la mondialisation", "L'Union europeenne dans la mondialisation") sont les
DOUBLONS connus des chapitres 1 et 3 de geographie, signales par la 229 et
laisses en place faute d'une migration dediee. La voici.
Le depart de "La Seconde Guerre mondiale" n'est pas negociable : une fiche de ce
module porte le meme titre, et chapters a un UNIQUE(subject_id, level, title).
LA GARDE "theme IS NULL" EST LE POINT DELICAT. Le menage tourne AVANT les
insertions a chaque rejeu. Borner par le titre seul suffirait pour quatre des
cinq lignes, mais pas pour "La Seconde Guerre mondiale" : au second passage, le
DELETE viserait la fiche NEUVE, qui porte le meme titre. Les chapitres herites,
eux, n'ont jamais eu d'axe (ils sont anterieurs a la 234) tandis que les fiches
de ce module en portent un des l'INSERT : "theme IS NULL" les separe, et rend le
rejeu inoffensif.
L'ordre compte : la file "A revoir" d'abord (review_items.item_id n'a PAS de cle
etrangere), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins mais toujours tirables par le moteur de questions), puis
les chapitres, dont les lecons partent en cascade.`,
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
   AND c.level = 'Tle'
   AND c.theme IS NULL
   AND c.title IN ('Démocraties fragiles et totalitarismes',
                   'La Seconde Guerre mondiale',
                   'La Guerre froide',
                   'Mers et océans dans la mondialisation',
                   'L''Union européenne dans la mondialisation');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = 'Tle'
   AND c.theme IS NULL
   AND c.title IN ('Démocraties fragiles et totalitarismes',
                   'La Seconde Guerre mondiale',
                   'La Guerre froide',
                   'Mers et océans dans la mondialisation',
                   'L''Union européenne dans la mondialisation');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = 'Tle'
   AND c.theme IS NULL
   AND c.title IN ('Démocraties fragiles et totalitarismes',
                   'La Seconde Guerre mondiale',
                   'La Guerre froide',
                   'Mers et océans dans la mondialisation',
                   'L''Union européenne dans la mondialisation');`,
    },
    {
      raison: `Les 13 fiches d'histoire de la 227 (chapitres 7 a 11) recoivent leur chapitre
de programme. Elles sont en base depuis le 05/08/2026, posees AVANT que la
colonne theme n'existe : sans cet UPDATE, elles tomberaient dans un fourre-tout
"Autres chapitres" sous les 6 chapitres neufs. Les intitules viennent du meme
programme que les 20 fiches de ce module.
UPDATE et non INSERT : ces chapitres existent deja, et un INSERT gardé par ON
CONFLICT DO NOTHING ne met jamais a jour une ligne existante. Garde par
IS DISTINCT FROM, donc rejouable sans ecriture inutile.`,
      sql: `UPDATE public.chapters c
   SET theme = v.theme
  FROM (VALUES
    ('L’influence de la chute de l’URSS sur l’Europe', 'La modification des grands équilibres économiques et politiques'),
    ('Le Proche-Orient au cœur de la nouvelle géopolitique mondiale', 'La modification des grands équilibres économiques et politiques'),
    ('La montée de la puissance économique chinoise de 1978 à 2001', 'La modification des grands équilibres économiques et politiques'),
    ('1989, une année de bouleversement géopolitique et économique', 'La modification des grands équilibres économiques et politiques'),
    ('La crise économique et politique en France (1974-1988)', 'Un tournant social, politique et culturel, la France de 1974 à 1988'),
    ('Les mutations sociales et culturelles de la société française', 'Un tournant social, politique et culturel, la France de 1974 à 1988'),
    ('Les États-Unis, gendarmes du monde', 'Nouveaux rapports de puissance et enjeux mondiaux'),
    ('Les efforts de coopération internationale depuis 1990', 'Nouveaux rapports de puissance et enjeux mondiaux'),
    ('Un monde multipolaire (2001 - ) : de nouveaux types de conflits', 'Nouveaux rapports de puissance et enjeux mondiaux'),
    ('La création d’une Europe ouverte et d’un marché commun (1957-1993)', 'La construction européenne entre élargissement, approfondissement et remise en question'),
    ('Le projet européen remis en question : les crises de la coopération européenne', 'La construction européenne entre élargissement, approfondissement et remise en question'),
    ('Le renforcement de la Ve République : décentralisation territoriale et fonctionnelle', 'La République française'),
    ('L’évolution de la Ve République : défense des principes fondateurs et émergence de nouveaux droits', 'La République française')
  ) AS v(title, theme), public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = 'Tle'
   AND c.title = v.title
   AND c.theme IS DISTINCT FROM v.theme;`,
    },
    {
      raison: `Les 20 fiches de GEOGRAPHIE de la 229 recoivent elles aussi leur chapitre.
L'histoire et la geographie partagent le meme dossier : ranger l'une en laissant
l'autre a plat afficherait 11 chapitres suivis d'un fourre-tout de 20 lignes.
Les quatre intitules sont ceux des quatre chapitres du programme de geographie
de Terminale, tels que les porte deja l'en-tete de scripts/contenu/geographie-tle.mjs.`,
      sql: `UPDATE public.chapters c
   SET theme = v.theme
  FROM (VALUES
    ('Mers et océans : vecteurs essentiels de la mondialisation', 'Mers et océans au cœur de la mondialisation'),
    ('Des enjeux géostratégiques qui se déplacent vers les mers et les océans', 'Mers et océans au cœur de la mondialisation'),
    ('Le détroit de Malacca et le golfe arabo-persique : des points de passage au cœur de la mondialisation', 'Mers et océans au cœur de la mondialisation'),
    ('Mers et océans en devenir', 'Mers et océans au cœur de la mondialisation'),
    ('La France : une puissance maritime ?', 'Mers et océans au cœur de la mondialisation'),
    ('Des territoires inégalement intégrés dans la mondialisation', 'Dynamiques territoriales, coopérations et tensions dans la mondialisation'),
    ('La hiérarchie des centres de décision mondiaux', 'Dynamiques territoriales, coopérations et tensions dans la mondialisation'),
    ('La France : un rayonnement international différencié et une inégale attractivité dans la mondialisation', 'Dynamiques territoriales, coopérations et tensions dans la mondialisation'),
    ('Coopérations économiques et tentatives de régulation', 'Dynamiques territoriales, coopérations et tensions dans la mondialisation'),
    ('La mondialisation et ses limites', 'Dynamiques territoriales, coopérations et tensions dans la mondialisation'),
    ('La Russie et l’Asie du Sud-Est : entre inégale intégration dans la mondialisation, coopérations et tensions', 'Dynamiques territoriales, coopérations et tensions dans la mondialisation'),
    ('L’Union européenne : la puissance dans la diversité', 'L’Union européenne dans la mondialisation'),
    ('Des défis à relever qui fragilisent l’UE', 'L’Union européenne dans la mondialisation'),
    ('L’Union européenne : entre inégalités territoriales et concurrence mondiale', 'L’Union européenne dans la mondialisation'),
    ('Les transports, outils d’ouverture, de cohésion et de compétitivité de l’UE', 'L’Union européenne dans la mondialisation'),
    ('La France et ses territoires transfrontaliers', 'L’Union européenne dans la mondialisation'),
    ('Les lignes de force du territoire français', 'La France et ses régions dans l’Union européenne et dans la mondialisation'),
    ('Les recompositions territoriales en France', 'La France et ses régions dans l’Union européenne et dans la mondialisation'),
    ('L’intégration de la France en Europe et dans le monde', 'La France et ses régions dans l’Union européenne et dans la mondialisation'),
    ('La région Occitanie, entre attractivité, concurrence et inégalité', 'La France et ses régions dans l’Union européenne et dans la mondialisation')
  ) AS v(title, theme), public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = 'Tle'
   AND c.title = v.title
   AND c.theme IS DISTINCT FROM v.theme;`,
    },
  ],

  blocs: [
    {
      niveaux: ['Tle'],
      // 1→5 : les chapitres hérités, supprimés par le ménage ci-dessus.
      // 6→25 : ce bloc, la place que la 227 lui avait réservée.
      // 26→38 : la 227 (chapitres 7 à 11). 39→58 : la 229 (géographie).
      positionDepart: 6,
      chapitres: [
        // ===================================================================
        // Chapitre 1 — L'impact de la crise de 1929
        // ===================================================================
        {
          titre: 'Les caractéristiques du capitalisme des années 1920',
          axe: 'L’impact de la crise de 1929 : déséquilibres économiques et sociaux',
          lecon: {
            titre: 'Les Roaring Twenties, et ce qu’elles cachent',
            cours: `Les années 1920 américaines sont celles de la prospérité, de la consommation de masse et de la spéculation. Elles portent aussi, dès le départ, les déséquilibres qui feront la crise.

## Une économie de la production de masse
Le **taylorisme** et le **fordisme** (chaîne de montage, standardisation, hauts salaires chez Ford) font chuter les coûts. L’automobile, l’électroménager et la radio se diffusent, soutenus par la **publicité** et surtout par le **crédit à la consommation** : on achète à tempérament ce qu’on ne peut pas payer comptant.

## Les États-Unis, créanciers du monde
Sortis renforcés de la Grande Guerre, ils prêtent à l’Europe et financent le plan **Dawes** (1924), qui permet à l’Allemagne de payer ses réparations, donc aux Alliés de rembourser Washington. Toute l’économie mondiale dépend de ce circuit de capitaux américains.

> Une prospérité financée à crédit tient tant que la confiance tient : c’est ce fil-là qui casse en 1929.

## Les déséquilibres
Les salaires progressent moins vite que la productivité : la consommation ne suit pas la production. L’agriculture est en surproduction et en crise dès le début de la décennie. Surtout, la **spéculation boursière** s’emballe : on achète des actions à crédit (achat sur marge), en pariant sur une hausse continue.

## Une prospérité inégale
Ouvriers agricoles, Noirs du Sud, immigrés récents restent à l’écart. Derrière l’image des « années folles », une partie des Américains ne connaît jamais la prospérité.`,
          },
          questions: [
            ['Qu’est-ce que le fordisme ?', ['Une organisation à la chaîne avec standardisation et hauts salaires', 'Un système bancaire', 'Une politique fiscale', 'Un mouvement syndical'], 0, 'Henry Ford paie mieux ses ouvriers pour qu’ils achètent ses voitures.'],
            ['Quel mécanisme soutient la consommation américaine des années 1920 ?', ['Le crédit à la consommation', 'La hausse des salaires agricoles', 'La baisse des impôts sur les ménages modestes', 'Les allocations publiques'], 0, 'On achète à tempérament, ce qui gonfle l’endettement des ménages.'],
            ['Qu’est-ce que l’achat sur marge en Bourse ?', ['Acheter des actions en empruntant la majeure partie de la somme', 'Acheter des actions au comptant', 'Vendre à découvert', 'Acheter des obligations d’État'], 0, 'Toute baisse oblige alors à vendre en catastrophe pour rembourser.'],
            ['Que permet le plan Dawes de 1924 ?', ['De financer les réparations allemandes par des prêts américains', 'D’annuler les dettes de guerre', 'De créer la Banque mondiale', 'De dévaluer le dollar'], 0, 'Il met toute l’Europe sous dépendance des capitaux américains.'],
            ['Le secteur agricole américain profite pleinement de la prospérité des années 1920.', ['Vrai', 'Faux'], 1, 'Il est en surproduction et en crise dès le début de la décennie.'],
            ['Pourquoi la consommation ne suit-elle pas la production ?', ['Les salaires progressent moins vite que la productivité', 'La population diminue', 'Les prix augmentent trop vite', 'Les usines ferment'], 0, 'Le décalage nourrit la surproduction.'],
            ['Quel pays devient le principal créancier du monde après 1918 ?', ['Les États-Unis', 'Le Royaume-Uni', 'La France', 'L’Allemagne'], 0, 'Ils prêtent à l’Europe pour financer sa reconstruction.'],
            ['Quelle invention diffuse la publicité de masse dans les foyers américains ?', ['La radio', 'La télévision', 'Le téléphone', 'Le cinéma parlant seul'], 0, 'Elle entre dans des millions de foyers au cours de la décennie.'],
          ],
        },
        {
          titre: 'La crise de 1929 : de la crise financière américaine à la crise économique mondiale',
          axe: 'L’impact de la crise de 1929 : déséquilibres économiques et sociaux',
          lecon: {
            titre: 'Du krach de Wall Street à la Grande Dépression',
            cours: `Une crise boursière new-yorkaise devient, en trois ans, la plus grave crise économique du siècle — et elle devient mondiale parce que le monde vit du crédit américain.

## Le krach
Le **jeudi noir** (24 octobre 1929) puis le mardi 29 voient s’effondrer les cours de Wall Street. Les achats sur marge obligent à vendre pour rembourser : la baisse s’auto-entretient. L’indice perd près de 90 % de sa valeur entre 1929 et 1932.

## L’enchaînement
Les banques, engagées en Bourse et incapables de récupérer leurs prêts, font faillite par milliers (**panique bancaire** : chacun veut retirer ses dépôts). Le crédit se ferme, les entreprises licencient, la consommation s’effondre, d’autres entreprises ferment : c’est la **spirale déflationniste**.

> Une crise devient mondiale quand ceux qui prêtaient au monde rapatrient leur argent : c’est ce que font les banques américaines dès 1929.

## La contagion mondiale
Retrait des capitaux américains d’Europe, faillite de la banque autrichienne **Creditanstalt** (1931), chute du commerce international, montée du **protectionnisme** (tarif Hawley-Smoot, 1930), dévaluations en chaîne, abandon de l’étalon-or. L’Allemagne, la plus dépendante des prêts américains, est la plus violemment touchée.

## Le coût humain
Environ 12 à 15 millions de chômeurs aux États-Unis (un quart de la population active), 6 millions en Allemagne en 1932. Faim, expulsions, bidonvilles (« Hoovervilles »), exode des fermiers du Dust Bowl. La crise nourrit partout la contestation des régimes en place.`,
          },
          questions: [
            ['Quelle date marque le début du krach de Wall Street ?', ['Le 24 octobre 1929', 'Le 3 septembre 1929', 'Le 11 novembre 1929', 'Le 1er janvier 1930'], 0, 'Le « jeudi noir », suivi du mardi 29 octobre.'],
            ['Pourquoi l’achat sur marge aggrave-t-il la chute ?', ['Les investisseurs doivent vendre pour rembourser leurs emprunts', 'Il fait monter les prix', 'Il bloque les échanges', 'Il protège les petits porteurs'], 0, 'La baisse déclenche des ventes forcées, qui font encore baisser les cours.'],
            ['Qu’est-ce qu’une panique bancaire ?', ['Une ruée des déposants pour retirer leur argent', 'Une fermeture décidée par l’État', 'Une fusion de banques', 'Une hausse des taux'], 0, 'Aucune banque ne peut rembourser tous ses déposants en même temps.'],
            ['Quelle banque européenne fait faillite en 1931 ?', ['La Creditanstalt', 'La Deutsche Bank', 'La Barings', 'Le Crédit lyonnais'], 0, 'Sa chute propage la crise à toute l’Europe centrale.'],
            ['Quelle est la réaction commerciale des États en 1930 ?', ['Le protectionnisme, avec le tarif Hawley-Smoot', 'La libéralisation des échanges', 'La création d’une monnaie commune', 'La suppression des douanes'], 0, 'Le commerce mondial s’effondre de plus de moitié.'],
            ['Quel pays européen est le plus violemment touché ?', ['L’Allemagne', 'Le Portugal', 'La Suède', 'L’Italie'], 0, 'Elle dépendait entièrement des prêts américains : 6 millions de chômeurs en 1932.'],
            ['Que sont les Hoovervilles ?', ['Des bidonvilles de chômeurs américains', 'Des cités ouvrières modèles', 'Des camps de travail', 'Des quartiers résidentiels'], 0, 'Le nom vise le président Hoover, jugé responsable.'],
            ['La crise de 1929 est restée limitée aux États-Unis.', ['Vrai', 'Faux'], 1, 'Le retrait des capitaux américains la propage au monde entier.'],
          ],
        },
        {
          titre: 'Les politiques des États face à la crise mondiale',
          axe: 'L’impact de la crise de 1929 : déséquilibres économiques et sociaux',
          lecon: {
            titre: 'Trois réponses : le New Deal, le Front populaire, l’économie de guerre',
            cours: `Partout, la crise oblige l’État à intervenir dans l’économie. Mais les réponses diffèrent — et certaines conduisent à la démocratie sociale, d’autres à la dictature.

## Le New Deal américain
Élu en 1932, **Franklin D. Roosevelt** rompt avec le libéralisme classique. Réforme bancaire (Glass-Steagall), dévaluation du dollar, grands travaux (**TVA**, Works Progress Administration), soutien aux prix agricoles, reconnaissance des syndicats (Wagner Act, 1935), **Social Security Act** (1935). L’État devient un acteur économique permanent — c’est l’esprit des théories de **Keynes**.

## Le Front populaire français
La crise arrive plus tard en France mais dure. En 1936, la coalition SFIO-radicaux-communistes gagne les élections ; les grèves avec occupation d’usines débouchent sur les **accords Matignon** : hausse des salaires, **congés payés** (deux semaines), **semaine de 40 heures**, conventions collectives. La relance échoue en partie (dévaluation, fuite des capitaux), mais les acquis sociaux restent.

> Face à la même crise, les démocraties élargissent les droits, les dictatures suppriment les libertés : c’est la comparaison que le chapitre demande de tenir.

## L’Allemagne nazie et l’économie de guerre
Hitler résorbe le chômage par les grands travaux, l’**autarcie** et surtout le **réarmement** massif. Le plan de quatre ans (1936) prépare ouvertement la guerre : l’économie est mise au service de la conquête.

## Le bilan
Partout, l’État régule davantage. Mais la crise a affaibli les démocraties libérales et fourni aux régimes autoritaires leur meilleur argument.`,
          },
          questions: [
            ['Qui lance le New Deal aux États-Unis ?', ['Franklin D. Roosevelt', 'Herbert Hoover', 'Harry Truman', 'Woodrow Wilson'], 0, 'Élu en 1932, il entre en fonction en mars 1933.'],
            ['Quelle loi de 1935 crée une première protection sociale américaine ?', ['Le Social Security Act', 'Le Wagner Act', 'Le Glass-Steagall Act', 'Le National Recovery Act'], 0, 'Retraites et assurance chômage naissent alors.'],
            ['Quel économiste théorise l’intervention de l’État pour relancer la demande ?', ['John Maynard Keynes', 'Adam Smith', 'Milton Friedman', 'Karl Marx'], 0, 'Sa Théorie générale paraît en 1936.'],
            ['Quels acquis sociaux le Front populaire obtient-il en 1936 ?', ['Congés payés et semaine de 40 heures', 'La retraite à 60 ans', 'La Sécurité sociale', 'Le SMIC'], 0, 'Les accords Matignon suivent des grèves avec occupation d’usines.'],
            ['Comment l’Allemagne nazie résorbe-t-elle le chômage ?', ['Par les grands travaux et surtout le réarmement', 'Par la baisse des impôts', 'Par l’émigration', 'Par la réduction du temps de travail'], 0, 'Le plan de quatre ans de 1936 prépare la guerre.'],
            ['Le New Deal marque la fin du libéralisme classique aux États-Unis.', ['Vrai', 'Faux'], 0, 'L’État devient un acteur permanent de la régulation économique.'],
            ['Qu’est-ce que l’autarcie ?', ['Une économie qui cherche à se suffire à elle-même', 'Une économie de marché ouverte', 'Un système de troc', 'Une union douanière'], 0, 'Elle est recherchée par l’Allemagne et l’Italie des années 1930.'],
            ['Quel grand aménagement symbolise les travaux publics du New Deal ?', ['La Tennessee Valley Authority', 'Le canal de Panama', 'Le barrage d’Assouan', 'L’Empire State Building'], 0, 'Barrages, électrification et emplois dans une région pauvre.'],
          ],
        },
        // ===================================================================
        // Chapitre 2 — Les régimes totalitaires
        // ===================================================================
        {
          titre: 'Le modèle nazi : en Allemagne, Hitler et la montée du nazisme',
          axe: 'Les régimes totalitaires',
          lecon: {
            titre: 'D’un parti marginal à un État raciste',
            cours: `En quatorze ans, un petit parti d’extrême droite devient le maître absolu de l’Allemagne. La crise lui donne son public, la légalité lui donne le pouvoir, la terreur le lui conserve.

## La République de Weimar fragilisée
Née de la défaite, la République de Weimar traîne l’humiliation de Versailles, l’hyperinflation de 1923, et surtout la crise de 1929 : 6 millions de chômeurs en 1932. Le **NSDAP** passe de 2,6 % des voix en 1928 à 37 % en juillet 1932.

## L’accession au pouvoir
Hitler est nommé **chancelier le 30 janvier 1933** — légalement, par le président Hindenburg. L’incendie du Reichstag (février) sert de prétexte à la suspension des libertés ; les **pleins pouvoirs** (mars 1933) achèvent le processus. Partis et syndicats sont interdits, la « nuit des Longs Couteaux » (1934) élimine les rivaux internes, et à la mort d’Hindenburg, Hitler devient **Reichsführer**.

> Le nazisme n’a pas pris le pouvoir par un coup d’État : il l’a reçu, puis a détruit de l’intérieur les règles qui le lui avaient donné.

## L’encadrement de la société
Parti unique, **Gestapo** et SS, camps de concentration dès 1933 (Dachau), **propagande** de Goebbels, embrigadement de la jeunesse (Jeunesses hitlériennes), culture et sport mis au service du régime (**Jeux de Berlin**, 1936).

## L’idéologie raciste
La « race aryenne », l’**espace vital** (Lebensraum), l’antisémitisme d’État : les **lois de Nuremberg** (1935) excluent les Juifs de la citoyenneté, la **Nuit de Cristal** (novembre 1938) marque le passage à la violence de masse.`,
          },
          questions: [
            ['Quand Hitler devient-il chancelier ?', ['Le 30 janvier 1933', 'En novembre 1923', 'En août 1934', 'En septembre 1939'], 0, 'Il est nommé légalement par le président Hindenburg.'],
            ['Quel événement sert de prétexte à la suspension des libertés en 1933 ?', ['L’incendie du Reichstag', 'La nuit de Cristal', 'Le putsch de Munich', 'La nuit des Longs Couteaux'], 0, 'Le décret qui suit supprime les libertés fondamentales.'],
            ['Que prévoient les lois de Nuremberg de 1935 ?', ['L’exclusion des Juifs de la citoyenneté allemande', 'La création des camps', 'Le réarmement', 'L’annexion de l’Autriche'], 0, 'Elles inscrivent le racisme dans le droit.'],
            ['Qu’est-ce que le Lebensraum ?', ['L’espace vital que le régime veut conquérir à l’Est', 'Un programme de logement', 'Une organisation de jeunesse', 'Une police politique'], 0, 'Il justifie l’expansion territoriale à venir.'],
            ['Que se passe-t-il lors de la Nuit de Cristal en novembre 1938 ?', ['Un pogrom organisé contre les Juifs allemands', 'Un coup d’État manqué', 'L’élimination des chefs SA', 'L’annexion des Sudètes'], 0, 'Synagogues incendiées, magasins pillés, arrestations massives.'],
            ['Le premier camp de concentration nazi ouvre en 1933.', ['Vrai', 'Faux'], 0, 'Dachau ouvre dès mars 1933 pour les opposants politiques.'],
            ['Quel événement sportif sert de vitrine au régime en 1936 ?', ['Les Jeux olympiques de Berlin', 'La Coupe du monde de football', 'Le Tour d’Allemagne', 'Les Jeux d’hiver de Munich'], 0, 'La propagande y met en scène une Allemagne pacifique et puissante.'],
            ['Qui dirige la propagande du régime nazi ?', ['Joseph Goebbels', 'Heinrich Himmler', 'Hermann Göring', 'Rudolf Hess'], 0, 'Il contrôle presse, radio, cinéma et culture.'],
          ],
        },
        {
          titre: 'Le fascisme italien : un modèle spécifique',
          axe: 'Les régimes totalitaires',
          lecon: {
            titre: 'Le premier des totalitarismes, et le moins abouti',
            cours: `Le fascisme italien précède le nazisme de plus de dix ans et lui sert de modèle. Mais il ne parvient jamais à contrôler la société aussi complètement.

## La prise du pouvoir
L’Italie sort de la Grande Guerre frustrée (la « **victoire mutilée** »), agitée par les grèves du « biennio rosso ». **Mussolini** fonde les Faisceaux de combat en 1919 ; ses **chemises noires** attaquent socialistes et syndicats. La **marche sur Rome** (octobre 1922) conduit le roi Victor-Emmanuel III à le nommer chef du gouvernement.

## La construction de la dictature
Loi électorale sur mesure (1923), assassinat du député **Matteotti** (1924), lois « fascistissimes » (1925-1926) : parti unique, presse contrôlée, police politique (**OVRA**), tribunal spécial. Mussolini devient le **Duce**.

> Le fascisme invente le vocabulaire et la mise en scène du totalitarisme ; le nazisme en poussera la logique jusqu’au crime de masse.

## L’encadrement et les limites
Embrigadement de la jeunesse (Balilla), loisirs organisés (Dopolavoro), culte du chef, corporatisme économique. Mais deux pouvoirs subsistent : la **monarchie**, qui reste en place et destituera Mussolini en 1943, et l’**Église**, avec laquelle il signe les **accords du Latran** (1929).

## L’expansion et l’alignement
Conquête de l’Éthiopie (1935-1936), intervention en Espagne, lois raciales de 1938 imitées de l’Allemagne, puis Axe Rome-Berlin et pacte d’Acier (1939) : l’Italie fasciste finit satellite du Reich.`,
          },
          questions: [
            ['Quel épisode porte Mussolini au pouvoir en 1922 ?', ['La marche sur Rome', 'Le putsch de Munich', 'La révolution d’Octobre', 'Le coup d’État du 2 décembre'], 0, 'Le roi le nomme chef du gouvernement plutôt que de résister.'],
            ['Comment appelle-t-on les milices fascistes ?', ['Les chemises noires', 'Les SA', 'Les Balilla', 'Les carabiniers'], 0, 'Elles pratiquent la violence contre socialistes et syndicalistes.'],
            ['Quel assassinat marque un tournant en 1924 ?', ['Celui du député Matteotti', 'Celui du roi', 'Celui du pape', 'Celui de Gramsci'], 0, 'Il ouvre la voie aux lois « fascistissimes » de 1925-1926.'],
            ['Que sont les accords du Latran de 1929 ?', ['Un accord entre l’État italien et le Vatican', 'Un traité avec l’Allemagne', 'Une alliance avec l’Espagne', 'Un accord commercial'], 0, 'Ils règlent la question romaine et rallient une partie des catholiques.'],
            ['Quelle institution le fascisme n’a-t-il jamais supprimée ?', ['La monarchie', 'Le parlement', 'Les syndicats libres', 'La presse d’opposition'], 0, 'Le roi destituera d’ailleurs Mussolini en juillet 1943.'],
            ['Quel pays l’Italie fasciste conquiert-elle en 1935-1936 ?', ['L’Éthiopie', 'L’Albanie seule', 'La Libye', 'La Grèce'], 0, 'La SDN sanctionne mollement : son impuissance est démontrée.'],
            ['L’Italie fasciste adopte des lois raciales en 1938.', ['Vrai', 'Faux'], 0, 'Elles imitent les lois de Nuremberg et marquent l’alignement sur Berlin.'],
            ['Comment appelle-t-on Mussolini dans le régime ?', ['Le Duce', 'Le Führer', 'Le Caudillo', 'Le Petit Père des peuples'], 0, 'Le culte du chef est au cœur de la propagande fasciste.'],
          ],
        },
        {
          titre: 'La mise en place du système socialiste soviétique en URSS de Lénine à Staline',
          axe: 'Les régimes totalitaires',
          lecon: {
            titre: 'De la révolution au pouvoir absolu',
            cours: `L’URSS est le premier État à se dire socialiste. En vingt ans, la révolution de 1917 devient un système de parti unique, d’économie planifiée et de terreur d’État.

## Lénine et la révolution
Février 1917 renverse le tsar ; **octobre 1917** porte les **bolcheviks** au pouvoir. Suivent la guerre civile (1918-1921), le **communisme de guerre**, la Tcheka, puis la **NEP** (1921), retour partiel au marché pour relancer la production. L’URSS est fondée en 1922.

## Staline et la « révolution par en haut »
À la mort de Lénine (1924), **Staline** écarte ses rivaux, dont Trotski. À partir de 1928-1929 : **collectivisation** forcée des terres (kolkhozes, sovkhozes), liquidation des **koulaks**, **plans quinquennaux** et industrialisation à marche forcée. La famine qui en résulte, notamment en Ukraine (**Holodomor**, 1932-1933), fait des millions de morts.

> Ce régime ne se contente pas d’obéissance : il exige l’adhésion, et transforme la société tout entière au nom de l’avenir.

## La terreur
**Grandes purges** de 1936-1938, procès de Moscou, NKVD, **Goulag** : des centaines de milliers d’exécutions et des millions de déportés. L’armée, le parti et l’administration sont décapités à la veille de la guerre.

## L’encadrement des esprits
Culte de la personnalité, réalisme socialiste, Komsomols, réécriture de l’histoire et des photographies. La société est mobilisée en permanence par le parti unique.`,
          },
          questions: [
            ['Quelle révolution porte les bolcheviks au pouvoir ?', ['Celle d’octobre 1917', 'Celle de février 1917', 'Celle de 1905', 'Celle de 1922'], 0, 'Février renverse le tsar, octobre porte Lénine au pouvoir.'],
            ['Qu’est-ce que la NEP ?', ['Un retour partiel au marché décidé en 1921', 'Un plan d’industrialisation', 'Une police politique', 'Une réforme agraire collectiviste'], 0, 'Elle relance la production après le communisme de guerre.'],
            ['Qu’est-ce que la collectivisation des terres ?', ['Le regroupement forcé des paysans en fermes collectives', 'La distribution de terres aux paysans', 'La privatisation des terres', 'La mise en jachère des terres'], 0, 'Kolkhozes et sovkhozes remplacent l’exploitation individuelle.'],
            ['Qui sont les koulaks ?', ['Les paysans considérés comme aisés, liquidés comme classe', 'Les ouvriers d’élite', 'Les cadres du parti', 'Les soldats de l’Armée rouge'], 0, 'Leur « liquidation » accompagne la collectivisation.'],
            ['Qu’est-ce que le Holodomor ?', ['La grande famine d’Ukraine de 1932-1933', 'Une purge du parti', 'Un plan quinquennal', 'Un camp du Goulag'], 0, 'Elle fait plusieurs millions de morts.'],
            ['Qu’est-ce que le Goulag ?', ['Le système des camps de travail soviétiques', 'La police secrète', 'Le parlement soviétique', 'Le plan économique'], 0, 'Des millions de personnes y sont déportées.'],
            ['Les grandes purges frappent aussi les cadres du parti et de l’armée.', ['Vrai', 'Faux'], 0, 'Les procès de Moscou (1936-1938) décapitent l’appareil d’État.'],
            ['Qu’est-ce que le réalisme socialiste ?', ['La doctrine artistique officielle du régime', 'Une théorie économique', 'Un courant philosophique libéral', 'Une méthode agricole'], 0, 'L’art doit servir la construction du socialisme.'],
          ],
        },
        {
          titre: 'Les caractéristiques des régimes totalitaires européens',
          axe: 'Les régimes totalitaires',
          lecon: {
            titre: 'Ce qu’ils ont en commun, ce qui les sépare',
            cours: `Nazisme, fascisme et stalinisme sont trois régimes différents. Le concept de **totalitarisme** sert à décrire ce qu’ils partagent — sans effacer ce qui les oppose.

## Les traits communs
Un **parti unique** fusionné avec l’État ; un **chef** objet d’un culte ; une **idéologie officielle** qui prétend expliquer le monde entier ; une **propagande** de masse et le contrôle de l’information ; une **police politique** et la terreur ; l’**embrigadement** de la jeunesse et des loisirs ; la volonté de créer un **homme nouveau** et une économie dirigée par l’État.

> Un régime autoritaire exige l’obéissance ; un régime totalitaire exige l’adhésion, et prétend transformer l’individu lui-même.

## Les différences
L’idéologie nazie est **raciale** et vise l’extermination ; l’idéologie soviétique est **de classe** et se dit universaliste ; le fascisme italien est **nationaliste** et reste bridé par la monarchie et l’Église. Les buts diffèrent : conquête d’un espace vital, révolution mondiale, restauration de la grandeur romaine.

## Les usages du concept
Forgé dans les années 1920-1930, popularisé par Hannah Arendt (1951), le mot **totalitarisme** a été critiqué : il rapproche des régimes que tout n’unit pas, et a servi d’argument politique pendant la guerre froide. Il reste utile pour comparer, à condition de ne pas confondre.

## Les démocraties face à eux
Divisées, affaiblies par la crise, elles pratiquent l’**apaisement** (accords de Munich, 1938) avant de comprendre que les régimes totalitaires ne se satisfont d’aucune concession.`,
          },
          questions: [
            ['Quel trait est commun aux trois régimes totalitaires ?', ['Le parti unique fusionné avec l’État', 'L’idéologie raciale', 'La monarchie maintenue', 'L’économie de marché'], 0, 'Avec le culte du chef, la propagande et la police politique.'],
            ['Qu’est-ce qui distingue l’idéologie nazie de l’idéologie soviétique ?', ['Elle est raciale, quand l’autre est fondée sur la classe', 'Elle est religieuse', 'Elle est libérale', 'Elle est régionaliste'], 0, 'Cette différence conduit à des politiques de destruction distinctes.'],
            ['Quelle philosophe popularise le concept de totalitarisme en 1951 ?', ['Hannah Arendt', 'Simone Weil', 'Raymond Aron seul', 'Karl Popper'], 0, 'Les Origines du totalitarisme est publié cette année-là.'],
            ['Qu’est-ce que l’homme nouveau ?', ['L’individu que le régime prétend façonner par l’idéologie', 'Un slogan publicitaire', 'Un programme scolaire', 'Un type d’ouvrier qualifié'], 0, 'Il justifie l’embrigadement dès l’enfance.'],
            ['Quel régime totalitaire conserve la monarchie et l’Église comme pouvoirs distincts ?', ['Le fascisme italien', 'Le nazisme', 'Le stalinisme', 'Aucun'], 0, 'C’est l’une des raisons pour lesquelles il est jugé moins abouti.'],
            ['Qu’est-ce que la politique d’apaisement ?', ['Les concessions des démocraties face aux exigences d’Hitler', 'Une politique sociale', 'Un plan de désarmement soviétique', 'Un accord commercial'], 0, 'Les accords de Munich de 1938 en sont le symbole.'],
            ['Un régime autoritaire et un régime totalitaire, c’est la même chose.', ['Vrai', 'Faux'], 1, 'Le second veut transformer l’individu, pas seulement le faire obéir.'],
            ['Pourquoi le concept de totalitarisme a-t-il été critiqué ?', ['Parce qu’il rapproche des régimes très différents et a servi d’arme politique', 'Parce qu’il est trop récent', 'Parce qu’il ne concerne que l’Italie', 'Parce qu’il est purement juridique'], 0, 'Il reste un outil de comparaison, pas une identité.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 — La Seconde Guerre mondiale
        // ===================================================================
        {
          titre: 'La Seconde Guerre mondiale',
          axe: 'La Seconde Guerre mondiale',
          lecon: {
            titre: 'Six ans, deux basculements, une guerre d’anéantissement',
            cours: `De 1939 à 1945, la guerre change d’échelle et de nature : elle devient mondiale, industrielle et idéologique — une guerre visant à anéantir l’adversaire, y compris ses civils.

## Les victoires de l’Axe (1939-1942)
Après le **pacte germano-soviétique** (août 1939), l’invasion de la Pologne (1er septembre) déclenche la guerre. La **Blitzkrieg** écrase la Pologne, le Danemark, la Norvège, les Pays-Bas, la Belgique et la France (juin 1940). Restent la bataille d’Angleterre (1940), puis l’invasion de l’URSS (**Barbarossa**, juin 1941) et l’attaque japonaise de **Pearl Harbor** (décembre 1941), qui fait entrer les États-Unis.

## Le tournant (1942-1943)
**Stalingrad** (février 1943), **El-Alamein**, **Midway** : sur les trois théâtres, l’Axe est arrêté. La supériorité industrielle alliée devient décisive — les États-Unis produisent plus d’armes à eux seuls que toutes les puissances de l’Axe réunies.

> Cette guerre se gagne autant dans les usines que sur le front : c’est la définition même d’une guerre totale.

## La victoire alliée (1943-1945)
Débarquements en Sicile (1943), en **Normandie** (6 juin 1944) et en Provence, offensives soviétiques à l’Est, capitulation allemande le **8 mai 1945**. Dans le Pacifique, les bombardements atomiques d’**Hiroshima et Nagasaki** (août 1945) précèdent la capitulation japonaise du 2 septembre.

## Un bilan sans précédent
50 à 60 millions de morts, dont une majorité de **civils** ; villes détruites, économies ruinées, populations déplacées. Le crime de masse y a pris une place centrale.`,
          },
          questions: [
            ['Quel pacte précède l’invasion de la Pologne ?', ['Le pacte germano-soviétique d’août 1939', 'Le pacte d’Acier', 'Les accords de Munich', 'Le pacte anti-Komintern'], 0, 'Il partage secrètement l’Europe orientale entre Berlin et Moscou.'],
            ['Qu’est-ce que la Blitzkrieg ?', ['Une guerre éclair combinant chars et aviation', 'Une guerre de tranchées', 'Un blocus naval', 'Un bombardement stratégique'], 0, 'Elle explique l’effondrement rapide de la France en 1940.'],
            ['Quelle attaque fait entrer les États-Unis dans la guerre ?', ['Pearl Harbor, en décembre 1941', 'L’invasion de la Pologne', 'La bataille d’Angleterre', 'Le débarquement de Normandie'], 0, 'Le Japon attaque la base américaine du Pacifique le 7 décembre 1941.'],
            ['Quelle bataille marque le tournant sur le front de l’Est ?', ['Stalingrad', 'Koursk seule', 'Moscou', 'Leningrad'], 0, 'La VIe armée allemande capitule en février 1943.'],
            ['Quand a lieu le débarquement de Normandie ?', ['Le 6 juin 1944', 'Le 8 mai 1945', 'Le 2 septembre 1945', 'Le 11 novembre 1942'], 0, 'Il ouvre le second front à l’Ouest réclamé par Staline.'],
            ['La majorité des morts de la Seconde Guerre mondiale sont des civils.', ['Vrai', 'Faux'], 0, 'Bombardements, famines, massacres et génocides en font une guerre contre les populations.'],
            ['Quelles villes japonaises subissent un bombardement atomique en août 1945 ?', ['Hiroshima et Nagasaki', 'Tokyo et Osaka', 'Kyoto et Kobe', 'Nagoya et Yokohama'], 0, 'La capitulation japonaise est signée le 2 septembre 1945.'],
            ['Quel avantage devient décisif pour les Alliés ?', ['Leur supériorité industrielle', 'Leur supériorité numérique en 1940', 'La neutralité de l’URSS', 'La faiblesse technologique allemande'], 0, 'La production américaine dépasse à elle seule celle de l’Axe.'],
          ],
        },
        {
          titre: 'La France défaite et occupée',
          axe: 'La Seconde Guerre mondiale',
          lecon: {
            titre: 'Vichy, l’Occupation, la Résistance',
            cours: `En six semaines, la France s’effondre. Pendant quatre ans, deux France s’opposent : celle qui collabore et celle qui résiste.

## La défaite et la fin de la République
Offensive allemande le 10 mai 1940, percée de Sedan, exode de millions de civils, armistice du **22 juin 1940**. Le 10 juillet, l’Assemblée vote les pleins pouvoirs à **Pétain** : l’État français remplace la République.

## Le régime de Vichy
« Travail, Famille, Patrie » : régime autoritaire, culte du chef, dissolution des syndicats et des partis, **Révolution nationale**, propagande. Il pratique la **collaboration** d’État (entrevue de **Montoire**, octobre 1940), livre des travailleurs (**STO**, 1943), crée la **Milice** (1943) et prend de sa propre initiative des mesures antisémites — **statut des Juifs** dès octobre 1940, **rafle du Vél d’Hiv** (juillet 1942) exécutée par la police française.

> Vichy n’a pas seulement subi l’occupant : il a devancé certaines de ses demandes. C’est ce que la France a mis cinquante ans à reconnaître officiellement (discours de Jacques Chirac, 1995).

## La Résistance
**Appel du 18 juin 1940** de **de Gaulle** depuis Londres ; réseaux et mouvements en métropole ; **Jean Moulin** unifie la Résistance intérieure et crée le **CNR** (mai 1943), dont le programme prépare l’après-guerre. Les FFI participent aux combats de 1944.

## La Libération
Débarquements de juin et août 1944, insurrections, libération de Paris (août 1944). Le **GPRF** rétablit la République, épure, nationalise et accorde le **droit de vote aux femmes** (ordonnance d’avril 1944).`,
          },
          questions: [
            ['Quand l’armistice est-il signé entre la France et l’Allemagne ?', ['Le 22 juin 1940', 'Le 10 mai 1940', 'Le 3 septembre 1939', 'Le 11 novembre 1942'], 0, 'Il ouvre quatre années d’occupation.'],
            ['Quelle est la devise du régime de Vichy ?', ['Travail, Famille, Patrie', 'Liberté, Égalité, Fraternité', 'Ordre et Progrès', 'Un peuple, un Reich, un chef'], 0, 'Elle remplace la devise républicaine.'],
            ['Que marque l’entrevue de Montoire d’octobre 1940 ?', ['L’engagement de Vichy dans la collaboration d’État', 'La fin de l’Occupation', 'La création de la Milice', 'Le début de la Résistance'], 0, 'Pétain y rencontre Hitler et parle de collaboration.'],
            ['Qu’est-ce que le STO ?', ['Le service du travail obligatoire en Allemagne', 'Un service militaire', 'Un statut des travailleurs étrangers', 'Une organisation de résistance'], 0, 'Instauré en 1943, il pousse de nombreux jeunes vers les maquis.'],
            ['Qui unifie la Résistance intérieure et crée le CNR ?', ['Jean Moulin', 'Pierre Brossolette', 'Jean Cavaillès', 'Henri Frenay'], 0, 'Le Conseil national de la Résistance se réunit en mai 1943.'],
            ['Le statut des Juifs d’octobre 1940 a été pris à la demande de l’Allemagne.', ['Vrai', 'Faux'], 1, 'Vichy le prend de sa propre initiative : c’est un antisémitisme d’État français.'],
            ['Quelle rafle de juillet 1942 est exécutée par la police française ?', ['La rafle du Vél d’Hiv', 'La rafle de Marseille', 'La rafle du Marais', 'La rafle de Drancy'], 0, 'Plus de 13 000 personnes arrêtées, dont plus de 4 000 enfants.'],
            ['Quelle avancée politique majeure le GPRF accorde-t-il en 1944 ?', ['Le droit de vote aux femmes', 'La Sécurité sociale', 'Les congés payés', 'La retraite par répartition'], 0, 'Elles voteront pour la première fois en avril 1945.'],
          ],
        },
        {
          titre: 'L’Europe et le monde face aux crimes de la Seconde Guerre mondiale',
          axe: 'La Seconde Guerre mondiale',
          lecon: {
            titre: 'Le génocide, et l’invention d’une justice internationale',
            cours: `La Seconde Guerre mondiale n’est pas seulement plus meurtrière que la précédente : elle est marquée par un projet d’extermination, qui oblige ensuite le monde à inventer un droit nouveau.

## La Shoah
Le génocide des Juifs d’Europe fait environ **6 millions de morts**. Il se déroule en deux temps : les fusillades de masse des **Einsatzgruppen** à partir de 1941 (Babi Yar), puis la mise à mort industrielle dans les **centres d’extermination** (Chelmno, Belzec, Sobibor, Treblinka, **Auschwitz-Birkenau**), planifiée à la conférence de **Wannsee** (janvier 1942). Ghettos, déportations, travail forcé et sélection en sont les rouages.

## Les autres crimes
Génocide des **Tsiganes** (Porajmos), assassinat des handicapés (programme T4), massacres de prisonniers soviétiques, représailles contre les civils (Oradour-sur-Glane), massacres japonais en Asie, expérimentations médicales.

> Ce ne sont pas des dommages de guerre : ce sont des crimes planifiés, avec une administration, un budget et des horaires.

## Juger
Le procès de **Nuremberg** (1945-1946) juge les principaux dirigeants nazis et forge deux notions nouvelles : **crime contre l’humanité** et **crime contre la paix**. Le procès de Tokyo suit pour le Japon. Le principe est posé : l’obéissance à un ordre ne dédouane pas.

## Prévenir et se souvenir
Convention de l’ONU sur le **génocide** (1948), Déclaration universelle des droits de l’homme (1948), **imprescriptibilité** des crimes contre l’humanité en France (1964). Mémoire, témoignages, musées et procès tardifs (Barbie, Touvier, Papon) prolongent ce travail jusqu’à aujourd’hui.`,
          },
          questions: [
            ['Combien de Juifs européens sont assassinés pendant la Shoah ?', ['Environ 6 millions', 'Environ 1 million', 'Environ 3 millions', 'Environ 10 millions'], 0, 'Soit environ les deux tiers des Juifs d’Europe.'],
            ['Que sont les Einsatzgruppen ?', ['Des unités mobiles chargées des fusillades de masse à l’Est', 'Des camps de travail', 'Des tribunaux militaires', 'Des unités de propagande'], 0, 'Ils opèrent à partir de l’invasion de l’URSS en 1941.'],
            ['Qu’est-ce que la conférence de Wannsee de janvier 1942 ?', ['Une réunion d’organisation de la « solution finale »', 'Une conférence de paix', 'Un sommet allié', 'Une conférence économique'], 0, 'Elle coordonne administrativement l’extermination.'],
            ['Quel est le plus grand centre de mise à mort nazi ?', ['Auschwitz-Birkenau', 'Dachau', 'Buchenwald', 'Bergen-Belsen'], 0, 'Il combine camp de concentration, de travail et d’extermination.'],
            ['Quelle notion juridique naît au procès de Nuremberg ?', ['Le crime contre l’humanité', 'Le crime de guerre', 'La légitime défense', 'Le droit d’asile'], 0, 'Avec le crime contre la paix : deux catégories nouvelles.'],
            ['L’obéissance à un ordre supérieur est reconnue comme excuse à Nuremberg.', ['Vrai', 'Faux'], 1, 'Le tribunal établit au contraire la responsabilité individuelle.'],
            ['Quelle convention de l’ONU définit le génocide ?', ['La convention de 1948', 'La convention de Genève de 1949', 'La charte de 1945', 'Le pacte de 1966'], 0, 'Elle engage les États à prévenir et punir le crime de génocide.'],
            ['Depuis quand les crimes contre l’humanité sont-ils imprescriptibles en France ?', ['1964', '1945', '1990', '2001'], 0, 'C’est ce qui a permis les procès Barbie, Touvier et Papon.'],
          ],
        },
        // ===================================================================
        // Chapitre 4 — La fin de la guerre et le nouvel ordre bipolaire
        // ===================================================================
        {
          titre: 'Le bilan de la Seconde Guerre mondiale : le règlement du conflit et ses conséquences',
          axe: 'La fin de la Seconde Guerre mondiale et les débuts d’un nouvel ordre mondial bipolaire',
          lecon: {
            titre: 'Un monde à reconstruire, et à réorganiser',
            cours: `En 1945, l’Europe est ruinée et le centre du monde s’est déplacé. Les vainqueurs organisent la paix — et se divisent presque aussitôt.

## Un bilan humain et matériel écrasant
50 à 60 millions de morts, dont environ 26 millions pour la seule URSS. Villes détruites (Varsovie, Dresde, Hiroshima), infrastructures anéanties, production effondrée, millions de **personnes déplacées** et de réfugiés.

## Les conférences du règlement
**Yalta** (février 1945) : principe d’élections libres en Europe libérée et zones d’occupation. **Potsdam** (juillet-août 1945) : dénazification, démilitarisation, découpage de l’Allemagne et de Berlin en quatre zones, déplacements de frontières à l’Est. Les désaccords entre Alliés y sont déjà visibles.

> Les vainqueurs s’entendent sur la défaite de l’Allemagne, pas sur ce qu’il faut mettre à la place : la guerre froide naît de ce vide.

## Les institutions nouvelles
L’**ONU** (charte de San Francisco, juin 1945) avec son Conseil de sécurité et ses cinq membres permanents dotés du **droit de veto** ; les accords de **Bretton Woods** (1944) qui créent le **FMI** et la Banque mondiale et fondent le système monétaire sur le dollar ; le **GATT** (1947) pour libéraliser les échanges.

## Deux Grands
Les États-Unis détiennent la moitié de la production mondiale et l’arme atomique ; l’URSS, exsangue mais victorieuse, contrôle l’Europe orientale et jouit d’un immense prestige. L’Europe, elle, est réduite au rang d’enjeu.`,
          },
          questions: [
            ['Quel pays subit le plus lourd bilan humain de la guerre ?', ['L’URSS, avec environ 26 millions de morts', 'L’Allemagne', 'La Chine', 'La Pologne'], 0, 'Le front de l’Est est le plus meurtrier du conflit.'],
            ['Que décide la conférence de Yalta en février 1945 ?', ['Des zones d’occupation et le principe d’élections libres', 'La création de l’OTAN', 'Le plan Marshall', 'La partition de la Corée'], 0, 'Les désaccords sur son application nourriront la guerre froide.'],
            ['En combien de zones l’Allemagne est-elle divisée à Potsdam ?', ['Quatre', 'Deux', 'Trois', 'Cinq'], 0, 'Berlin, en zone soviétique, est elle aussi divisée en quatre.'],
            ['Quelle organisation naît en juin 1945 ?', ['L’ONU', 'La SDN', 'L’OTAN', 'Le pacte de Varsovie'], 0, 'Sa charte est signée à San Francisco.'],
            ['Quel privilège ont les cinq membres permanents du Conseil de sécurité ?', ['Le droit de veto', 'Un double vote', 'La présidence à vie', 'Le contrôle du budget'], 0, 'Il paralysera souvent l’ONU pendant la guerre froide.'],
            ['Que créent les accords de Bretton Woods ?', ['Le FMI et la Banque mondiale, avec un système fondé sur le dollar', 'L’ONU', 'Le GATT seul', 'La CECA'], 0, 'Le dollar devient la monnaie de référence mondiale.'],
            ['En 1945, les États-Unis détiennent l’arme atomique et environ la moitié de la production mondiale.', ['Vrai', 'Faux'], 0, 'Le centre de gravité économique et militaire a basculé outre-Atlantique.'],
            ['Quel est le sort de l’Europe en 1945 ?', ['Ruinée, elle devient un enjeu entre les deux Grands', 'Elle reste la première puissance mondiale', 'Elle s’unifie immédiatement', 'Elle se retire des affaires du monde'], 0, 'Sa reconstruction dépendra largement de l’aide américaine.'],
          ],
        },
        {
          titre: 'La naissance d’un nouvel ordre mondial bipolaire après la Seconde Guerre mondiale',
          axe: 'La fin de la Seconde Guerre mondiale et les débuts d’un nouvel ordre mondial bipolaire',
          lecon: {
            titre: 'Deux modèles, deux blocs',
            cours: `Entre 1945 et 1949, les alliés d’hier deviennent adversaires. Le monde s’organise autour de deux modèles qui prétendent chacun valoir pour toute l’humanité.

## Deux modèles opposés
Le modèle **américain** : démocratie libérale, pluralisme, économie de marché, société de consommation, liberté d’entreprendre. Le modèle **soviétique** : parti unique, planification, collectivisation, égalité proclamée, dictature du prolétariat. Chacun se présente comme la seule voie du progrès.

## La rupture (1947)
La **doctrine Truman** (mars 1947) promet le *containment* — endiguer l’expansion communiste. Le **plan Marshall** (juin 1947) offre une aide massive à la reconstruction européenne ; l’URSS la refuse et l’interdit à ses satellites. En réponse, la **doctrine Jdanov** dénonce l’impérialisme américain et le **Kominform** est créé.

> 1947 est l’année où l’on cesse de discuter : chacun organise son camp, en Europe comme ailleurs.

## Les blocs se structurent
À l’Ouest : **OTAN** (1949), aide économique, bases militaires. À l’Est : démocraties populaires imposées par les « coups de Prague » et autres, **CAEM** (1949), **pacte de Varsovie** (1955). L’Europe est coupée par ce que Churchill appelle dès 1946 le **rideau de fer**.

## Le premier affrontement
Le **blocus de Berlin** (juin 1948 - mai 1949) et le pont aérien allié aboutissent à la naissance de deux États allemands, la **RFA** et la **RDA**, en 1949. La même année, l’URSS obtient l’arme atomique et la Chine devient communiste.`,
          },
          questions: [
            ['Qu’est-ce que la doctrine Truman ?', ['La politique d’endiguement du communisme', 'Un plan d’aide économique', 'Une alliance militaire', 'Un programme nucléaire'], 0, 'Énoncée en mars 1947, elle fonde le containment.'],
            ['Qu’est-ce que le plan Marshall ?', ['Une aide américaine à la reconstruction européenne', 'Un plan militaire', 'Un traité de paix', 'Une réforme monétaire allemande'], 0, 'L’URSS le refuse et l’interdit à ses satellites.'],
            ['Quelle doctrine soviétique répond à celle de Truman ?', ['La doctrine Jdanov', 'La doctrine Brejnev', 'La doctrine Khrouchtchev', 'La doctrine Gorbatchev'], 0, 'Elle divise le monde en deux camps irréconciliables.'],
            ['Quelle expression désigne la coupure de l’Europe ?', ['Le rideau de fer', 'Le mur de l’Atlantique', 'La ligne Curzon', 'Le limes'], 0, 'Churchill l’emploie dans son discours de Fulton, en 1946.'],
            ['Quelle alliance militaire occidentale naît en 1949 ?', ['L’OTAN', 'Le pacte de Varsovie', 'Le CAEM', 'La CECA'], 0, 'Le pacte de Varsovie lui répondra en 1955.'],
            ['Quelle crise aboutit à la création de deux États allemands ?', ['Le blocus de Berlin de 1948-1949', 'La crise de Cuba', 'La crise de Suez', 'La guerre de Corée'], 0, 'La RFA et la RDA naissent en 1949.'],
            ['L’URSS obtient l’arme atomique en 1949.', ['Vrai', 'Faux'], 0, 'La même année que la victoire communiste en Chine : l’équilibre bascule.'],
            ['Comment appelle-t-on les régimes communistes installés en Europe de l’Est ?', ['Les démocraties populaires', 'Les républiques fédérées', 'Les protectorats soviétiques', 'Les États satellites neutres'], 0, 'Elles sont mises en place entre 1945 et 1948, souvent par la force.'],
          ],
        },
        // ===================================================================
        // Chapitre 5 — Bipolarisation et émergence du tiers-monde
        // ===================================================================
        {
          titre: '1945-1949 : Un monde bipolaire',
          axe: 'Une nouvelle donne géopolitique : bipolarisation et émergence du tiers-monde',
          lecon: {
            titre: 'Quatre ans pour couper le monde en deux',
            cours: `Entre la fin de la guerre et 1949, l’alliance des vainqueurs se défait et deux camps se referment. Tout se joue en Europe, mais rien n’y reste.

## De l’alliance à la méfiance
Dès Potsdam, les Alliés s’opposent sur l’Allemagne, la Pologne et les élections en Europe orientale. Staline installe des régimes communistes à mesure que l’Armée rouge occupe le terrain ; Washington y voit une expansion à endiguer.

## Les étapes de la rupture
1946 : discours du **rideau de fer** à Fulton. 1947 : doctrine Truman, plan Marshall, doctrine Jdanov, création du **Kominform**. 1948 : **coup de Prague** en Tchécoslovaquie, rupture avec la Yougoslavie de **Tito**, blocus de Berlin. 1949 : OTAN, CAEM, naissance de la RFA et de la RDA, bombe atomique soviétique, victoire de **Mao** en Chine.

> En 1949, il n’y a plus d’espace neutre en Europe : chaque pays appartient à un camp, et le monde entier va être sommé de choisir.

## Deux camps, deux organisations
Le bloc de l’Ouest s’organise autour de l’aide économique, de l’OTAN et des bases américaines ; le bloc de l’Est autour du parti unique, du CAEM et de la présence de l’Armée rouge. Les partis communistes occidentaux, très puissants en France et en Italie, sont écartés des gouvernements en 1947.

## Une bipolarité mondiale
Cette division ne reste pas européenne : Corée, Indochine, Proche-Orient, Amérique latine deviennent des terrains d’affrontement indirect. La rivalité prend toutes les formes — militaire, économique, idéologique, sportive, spatiale.`,
          },
          questions: [
            ['Où Churchill prononce-t-il son discours sur le rideau de fer ?', ['À Fulton, en 1946', 'À Yalta', 'À Potsdam', 'À Londres'], 0, 'Il constate la coupure de l’Europe avant même la rupture officielle.'],
            ['Qu’est-ce que le coup de Prague de 1948 ?', ['La prise du pouvoir par les communistes en Tchécoslovaquie', 'Une révolte anticommuniste', 'Un putsch militaire', 'Une conférence internationale'], 0, 'Dernier pays d’Europe centrale à basculer, il choque l’opinion occidentale.'],
            ['Quel dirigeant communiste rompt avec Moscou en 1948 ?', ['Tito, en Yougoslavie', 'Gomulka, en Pologne', 'Nagy, en Hongrie', 'Dubcek, en Tchécoslovaquie'], 0, 'La Yougoslavie suivra une voie non alignée.'],
            ['Que se passe-t-il en Chine en 1949 ?', ['Les communistes de Mao prennent le pouvoir', 'La Chine entre à l’ONU', 'La guerre civile commence', 'Le Japon se retire'], 0, 'La République populaire est proclamée le 1er octobre 1949.'],
            ['Qu’est-ce que le Kominform ?', ['Un bureau de coordination des partis communistes créé en 1947', 'Une alliance militaire', 'Une organisation économique', 'Un journal soviétique'], 0, 'Il assure l’alignement des partis frères sur Moscou.'],
            ['Les partis communistes sont écartés des gouvernements français et italien en 1947.', ['Vrai', 'Faux'], 0, 'La rupture des blocs se joue aussi à l’intérieur des démocraties occidentales.'],
            ['Qu’est-ce que le CAEM ?', ['L’organisation économique du bloc de l’Est', 'Une alliance militaire occidentale', 'Une agence de l’ONU', 'Un accord commercial mondial'], 0, 'Créé en 1949, il répond au plan Marshall.'],
            ['La bipolarité reste-t-elle limitée à l’Europe ?', ['Non, elle s’étend à l’Asie, au Proche-Orient et à l’Amérique latine', 'Oui, jusqu’en 1970', 'Oui, jusqu’à la chute du Mur', 'Oui, sauf en Afrique'], 0, 'Les affrontements indirects se déplacent hors d’Europe.'],
          ],
        },
        {
          titre: 'La guerre froide : affrontements et crises politiques dans un monde bipolaire',
          axe: 'Une nouvelle donne géopolitique : bipolarisation et émergence du tiers-monde',
          lecon: {
            titre: 'Quarante ans de paix armée',
            cours: `La guerre froide est un affrontement permanent entre deux superpuissances qui ne se combattent jamais directement : l’arme nucléaire rend la guerre totale impossible, et pousse à la guerre par procuration.

## Les grandes crises
**Berlin** (blocus 1948-1949, construction du **Mur** en 1961), **Corée** (1950-1953), **Cuba** (octobre 1962, le point le plus dangereux), **Vietnam** (1964-1975), **Afghanistan** (1979-1989). Chaque crise oppose les deux camps sans affrontement direct entre leurs armées.

## L’équilibre de la terreur
La possession réciproque de l’arme nucléaire aboutit à la **destruction mutuelle assurée** : attaquer, c’est mourir. D’où la course aux armements, la dissuasion, mais aussi les premiers accords de limitation (SALT, 1972) et le « téléphone rouge » après Cuba.

> Le nucléaire ne supprime pas la guerre : il la déplace vers les périphéries, les propagandes et l’espace.

## Les phases
Guerre froide « chaude » (1947-1953), **coexistence pacifique** après la mort de Staline, tensions renouvelées (Mur, Cuba), **Détente** (1963-1975, Helsinki 1975), « guerre fraîche » (1979-1985), puis la fin sous **Gorbatchev** (glasnost, perestroïka), la chute du Mur (1989) et la disparition de l’URSS (1991).

## Une guerre totale par d’autres moyens
Course à l’espace (Spoutnik 1957, Apollo 11 en 1969), espionnage, propagande, cinéma, sport, aide au développement : tout devient terrain de rivalité.`,
          },
          questions: [
            ['Pourquoi les deux superpuissances ne s’affrontent-elles jamais directement ?', ['À cause de l’équilibre de la terreur nucléaire', 'À cause d’un traité de non-agression', 'À cause de l’ONU', 'Par manque de moyens'], 0, 'La destruction mutuelle assurée rend la guerre directe suicidaire.'],
            ['Quelle crise de 1962 amène le monde au bord de la guerre nucléaire ?', ['La crise de Cuba', 'La crise de Suez', 'La crise de Berlin', 'La crise du Golfe'], 0, 'Les missiles soviétiques à Cuba provoquent un bras de fer de treize jours.'],
            ['Quand le mur de Berlin est-il construit ?', ['En 1961', 'En 1948', 'En 1953', 'En 1968'], 0, 'Il stoppe l’hémorragie de population vers l’Ouest.'],
            ['Qu’est-ce que la coexistence pacifique ?', ['Une rivalité maintenue mais sans guerre directe, après la mort de Staline', 'Une alliance entre les deux blocs', 'Un désarmement complet', 'La neutralité de l’Europe'], 0, 'Khrouchtchev en fait la doctrine officielle.'],
            ['Que signent les deux Grands en 1972 ?', ['Les accords SALT de limitation des armements', 'Le traité de Rome', 'Le pacte de Varsovie', 'Les accords d’Helsinki'], 0, 'La Détente s’accompagne de traités de contrôle des arsenaux.'],
            ['Quel satellite marque le début de la course à l’espace en 1957 ?', ['Spoutnik', 'Apollo', 'Explorer', 'Vostok'], 0, 'Le succès soviétique inquiète profondément les États-Unis.'],
            ['La guerre de Corée oppose directement les armées américaine et soviétique.', ['Vrai', 'Faux'], 1, 'L’URSS soutient sans engager ses troupes officiellement : c’est une guerre par procuration.'],
            ['Quel dirigeant soviétique engage la glasnost et la perestroïka ?', ['Mikhaïl Gorbatchev', 'Léonid Brejnev', 'Iouri Andropov', 'Nikita Khrouchtchev'], 0, 'Ses réformes précipitent la fin du bloc de l’Est.'],
          ],
        },
        {
          titre: 'Le Proche et le Moyen-Orient pendant la guerre froide : un enjeu stratégique pour les deux superpuissances',
          axe: 'Une nouvelle donne géopolitique : bipolarisation et émergence du tiers-monde',
          lecon: {
            titre: 'Le pétrole, Israël, et deux protecteurs rivaux',
            cours: `Région charnière entre trois continents, riche en pétrole et traversée par le conflit israélo-arabe, le Proche et le Moyen-Orient devient un terrain majeur de la guerre froide.

## Un enjeu à trois dimensions
**Stratégique** : détroits, canal de **Suez**, routes aériennes. **Énergétique** : les deux tiers des réserves mondiales de pétrole. **Politique** : décolonisation, nationalismes arabes, création d’**Israël** (1948).

## Les conflits israélo-arabes
Guerre de 1948-1949 après le plan de partage de l’ONU, crise de **Suez** (1956) après la nationalisation du canal par **Nasser**, guerre des **Six Jours** (1967) et occupation de nouveaux territoires, guerre du **Kippour** (1973) suivie du premier **choc pétrolier**, accords de **Camp David** (1978-1979) entre l’Égypte et Israël.

> Chaque conflit local est doublé d’un affrontement indirect : Washington soutient un camp, Moscou l’autre, et le pétrole sert d’arme.

## Les alignements
Les États-Unis s’appuient sur l’**Arabie saoudite**, l’Iran du chah jusqu’en 1979, puis Israël et l’Égypte après Camp David. L’URSS soutient l’Égypte de Nasser, la Syrie, l’Irak, le Yémen du Sud. Le **non-alignement** est tenté par plusieurs États arabes.

## Les ruptures des années 1970-1980
Choc pétrolier de 1973 et pouvoir de l’**OPEP**, **révolution iranienne** de 1979 qui installe une république islamique hostile aux deux Grands, guerre Iran-Irak (1980-1988), intervention soviétique en Afghanistan.`,
          },
          questions: [
            ['Quelle part des réserves mondiales de pétrole se trouve dans la région ?', ['Environ les deux tiers', 'Environ un dixième', 'Environ un tiers', 'La quasi-totalité'], 0, 'C’est ce qui en fait un enjeu stratégique majeur.'],
            ['Quand l’État d’Israël est-il créé ?', ['En 1948', 'En 1945', 'En 1956', 'En 1967'], 0, 'Après le plan de partage de l’ONU de novembre 1947.'],
            ['Qu’est-ce que la crise de Suez de 1956 ?', ['Une crise déclenchée par la nationalisation du canal par Nasser', 'Une guerre entre l’Irak et l’Iran', 'Un coup d’État en Égypte', 'Une crise pétrolière mondiale'], 0, 'Franco-britanniques et Israéliens interviennent, puis reculent sous pression américaine et soviétique.'],
            ['Quelle guerre de 1967 modifie durablement la carte de la région ?', ['La guerre des Six Jours', 'La guerre du Kippour', 'La guerre du Liban', 'La guerre du Golfe'], 0, 'Israël occupe le Sinaï, Gaza, la Cisjordanie et le Golan.'],
            ['Quel événement déclenche le premier choc pétrolier ?', ['La guerre du Kippour de 1973', 'La révolution iranienne', 'La crise de Suez', 'La guerre Iran-Irak'], 0, 'Les pays arabes de l’OPEP utilisent le pétrole comme arme.'],
            ['Quels accords sont signés entre l’Égypte et Israël en 1978-1979 ?', ['Les accords de Camp David', 'Les accords d’Oslo', 'Les accords de Genève', 'Les accords de Madrid'], 0, 'L’Égypte devient alors un allié des États-Unis.'],
            ['La révolution iranienne de 1979 installe un régime allié des États-Unis.', ['Vrai', 'Faux'], 1, 'La République islamique est hostile aux deux superpuissances.'],
            ['Quelle organisation donne aux pays producteurs un pouvoir sur les prix ?', ['L’OPEP', 'Le FMI', 'L’AIEA', 'La Ligue arabe'], 0, 'Créée en 1960, elle s’impose lors du choc de 1973.'],
          ],
        },
        {
          titre: 'Indépendance et nouveaux États pendant la guerre froide',
          axe: 'Une nouvelle donne géopolitique : bipolarisation et émergence du tiers-monde',
          lecon: {
            titre: 'La décolonisation et la naissance du tiers-monde',
            cours: `En trente ans, les empires coloniaux disparaissent et des dizaines d’États nouveaux apparaissent. Ils cherchent une place entre les deux blocs.

## Les causes
Affaiblissement des métropoles par la guerre, participation des colonisés au conflit, montée des mouvements nationalistes formés à l’école coloniale, principes de la charte de l’ONU, hostilité de principe des deux superpuissances à l’ordre colonial.

## Deux voies
L’indépendance **négociée** : Inde et Pakistan (1947, mais partition sanglante), Afrique britannique et française (1957-1962, dont l’essentiel en 1960, « l’année de l’Afrique »). L’indépendance **arrachée par la guerre** : Indochine (1946-1954, **Diên Biên Phu**), **Algérie** (1954-1962, accords d’Évian), Angola et Mozambique (1975).

> Les nouveaux États obtiennent la souveraineté politique bien avant l’indépendance économique : c’est tout le problème du développement.

## Le tiers-monde
Le mot est forgé par Alfred Sauvy en 1952. La conférence de **Bandung** (1955) réunit 29 pays d’Asie et d’Afrique ; le mouvement des **non-alignés** naît à Belgrade (1961) autour de Nehru, Nasser, Tito et Soekarno. Le Nouvel ordre économique international est réclamé à l’ONU dans les années 1970.

## Les difficultés
Frontières héritées de la colonisation, guerres civiles, dépendance aux matières premières, dette, régimes autoritaires, ingérences des deux Grands (Congo, Angola, Amérique centrale). Le tiers-monde se différencie vite : certains États émergent, d’autres s’enfoncent.`,
          },
          questions: [
            ['Quand l’Inde et le Pakistan deviennent-ils indépendants ?', ['En 1947', 'En 1954', 'En 1960', 'En 1962'], 0, 'La partition provoque des déplacements massifs et des centaines de milliers de morts.'],
            ['Quelle bataille précipite la fin de la guerre d’Indochine ?', ['Diên Biên Phu, en 1954', 'La bataille d’Alger', 'La bataille de Suez', 'La bataille de Bizerte'], 0, 'Les accords de Genève suivent en juillet 1954.'],
            ['Quels accords mettent fin à la guerre d’Algérie ?', ['Les accords d’Évian, en 1962', 'Les accords de Genève', 'Les accords de Camp David', 'Les accords de Bandung'], 0, 'Huit ans de guerre s’achèvent après un référendum.'],
            ['Quelle conférence de 1955 réunit des pays d’Asie et d’Afrique ?', ['La conférence de Bandung', 'La conférence de Belgrade', 'La conférence de Yalta', 'La conférence de San Francisco'], 0, 'Elle condamne le colonialisme et affirme une voie propre.'],
            ['Qu’est-ce que le mouvement des non-alignés ?', ['Un regroupement d’États refusant de choisir entre les deux blocs', 'Une alliance militaire du Sud', 'Une organisation économique', 'Un syndicat de producteurs de pétrole'], 0, 'Fondé à Belgrade en 1961 autour de Nehru, Nasser et Tito.'],
            ['Quelle année est appelée « l’année de l’Afrique » ?', ['1960', '1955', '1947', '1975'], 0, 'Dix-sept États africains y accèdent à l’indépendance.'],
            ['Qui forge le terme « tiers-monde » ?', ['Alfred Sauvy, en 1952', 'Frantz Fanon', 'Jawaharlal Nehru', 'Léopold Sédar Senghor'], 0, 'Par analogie avec le tiers état de 1789.'],
            ['Les nouveaux États obtiennent en même temps souveraineté politique et indépendance économique.', ['Vrai', 'Faux'], 1, 'La dépendance aux matières premières et à l’aide extérieure persiste.'],
          ],
        },
        {
          titre: 'L’ère maoïste : retrouver la puissance par la révolution (1949-1976)',
          axe: 'Une nouvelle donne géopolitique : bipolarisation et émergence du tiers-monde',
          lecon: {
            titre: 'Une troisième voie, payée très cher',
            cours: `De 1949 à 1976, **Mao Zedong** cherche à faire de la Chine une grande puissance par la révolution permanente. Le pays gagne son indépendance et sa place internationale ; sa population en paie le prix.

## La construction du régime
Proclamation de la **République populaire** le 1er octobre 1949. Réforme agraire, élimination des « ennemis de classe », parti unique, alignement initial sur l’URSS (traité de 1950) et modèle des plans quinquennaux.

## Le Grand Bond en avant (1958-1962)
Collectivisation totale en **communes populaires**, industrialisation improvisée (« hauts fourneaux de jardin »), objectifs délirants. Résultat : une **famine** qui fait entre 20 et 40 millions de morts, la plus meurtrière du XXe siècle. Mao recule momentanément.

> Une utopie appliquée sans contradiction possible : c’est ce qui transforme une erreur économique en catastrophe démographique.

## La Révolution culturelle (1966-1976)
Pour reprendre la main, Mao lance la jeunesse (**gardes rouges**) contre le parti, l’école et la culture. Persécutions, humiliations publiques, envoi des « intellectuels » à la campagne, destruction du patrimoine. Le pays est paralysé, la production s’effondre.

## La rupture des alliances
Rupture avec Moscou (1960-1963), bombe atomique chinoise (1964), rapprochement spectaculaire avec Washington : entrée à l’**ONU** en 1971 (au Conseil de sécurité) et visite de **Nixon** à Pékin en 1972. La Chine s’affirme comme une troisième force et un modèle pour une partie du tiers-monde.`,
          },
          questions: [
            ['Quand la République populaire de Chine est-elle proclamée ?', ['Le 1er octobre 1949', 'En 1945', 'En 1958', 'En 1966'], 0, 'Après la victoire des communistes sur les nationalistes de Tchang Kaï-chek.'],
            ['Qu’est-ce que le Grand Bond en avant ?', ['Un plan de collectivisation et d’industrialisation lancé en 1958', 'Une réforme scolaire', 'Une campagne militaire', 'Un plan de libéralisation économique'], 0, 'Il provoque une famine de 20 à 40 millions de morts.'],
            ['Que sont les communes populaires ?', ['De vastes unités collectives regroupant terres, travail et vie quotidienne', 'Des conseils municipaux', 'Des coopératives volontaires', 'Des unités militaires'], 0, 'Elles suppriment toute exploitation individuelle.'],
            ['Qui Mao lance-t-il contre le parti pendant la Révolution culturelle ?', ['Les gardes rouges, issus de la jeunesse', 'L’Armée populaire seule', 'Les paysans', 'Les cadres du parti'], 0, 'L’objectif est de reprendre le contrôle après l’échec du Grand Bond.'],
            ['Quand la Chine obtient-elle l’arme atomique ?', ['En 1964', 'En 1949', 'En 1972', 'En 1976'], 0, 'Après la rupture avec l’URSS, elle assure seule sa dissuasion.'],
            ['La Chine populaire entre à l’ONU en 1971.', ['Vrai', 'Faux'], 0, 'Elle y prend le siège permanent au Conseil de sécurité, jusque-là occupé par Taïwan.'],
            ['Quel président américain se rend à Pékin en 1972 ?', ['Richard Nixon', 'John Kennedy', 'Jimmy Carter', 'Lyndon Johnson'], 0, 'Le rapprochement sino-américain bouscule la bipolarité.'],
            ['Quelle rupture majeure intervient au début des années 1960 ?', ['La rupture entre la Chine et l’URSS', 'La rupture avec les États-Unis', 'La rupture avec l’Inde seule', 'La rupture avec le Vietnam'], 0, 'Le camp communiste cesse d’être un bloc unique.'],
          ],
        },
        {
          titre: '1968 : la remise en question des modèles',
          axe: 'Une nouvelle donne géopolitique : bipolarisation et émergence du tiers-monde',
          lecon: {
            titre: 'Une contestation mondiale, à l’Ouest comme à l’Est',
            cours: `1968 est une année de contestation planétaire : partout, une génération née après la guerre conteste l’autorité, la société de consommation et l’ordre des blocs.

## À l’Ouest
**Mai 68** en France : révolte étudiante, puis la plus grande grève de l’histoire du pays (près de 9 millions de grévistes), accords de Grenelle, dissolution et large victoire gaulliste aux élections. Aux **États-Unis** : mouvement des droits civiques (assassinat de **Martin Luther King** en avril 1968), opposition à la **guerre du Vietnam**, contestation des campus. En Allemagne, en Italie, au Japon, au Mexique : mêmes mobilisations, parfois durement réprimées (Tlatelolco).

## À l’Est
Le **Printemps de Prague** tente « un socialisme à visage humain » avec **Dubcek** ; il est écrasé par les chars du pacte de Varsovie en août 1968. La **doctrine Brejnev** de « souveraineté limitée » justifie l’intervention. En Pologne aussi, la contestation étudiante est réprimée.

> À l’Ouest, on conteste un modèle en pouvant le dire ; à l’Est, la même contestation est écrasée par les chars : 1968 révèle la différence entre les deux systèmes autant que leur crise commune.

## Les causes communes
Explosion démographique de l’après-guerre, massification scolaire, prospérité qui rend l’autorité traditionnelle insupportable, télévision qui fait circuler les images d’un pays à l’autre.

## Les héritages
Libéralisation des mœurs, droits des femmes, écologie naissante, transformation des rapports d’autorité — mais aussi, à l’Est, la démonstration que le système ne se réformera pas de l’intérieur.`,
          },
          questions: [
            ['Combien de grévistes compte le mouvement de mai 1968 en France ?', ['Près de 9 millions', 'Environ 1 million', 'Environ 3 millions', 'Environ 15 millions'], 0, 'C’est la plus grande grève de l’histoire française.'],
            ['Quel dirigeant tchécoslovaque incarne le Printemps de Prague ?', ['Alexander Dubcek', 'Vaclav Havel', 'Imre Nagy', 'Lech Walesa'], 0, 'Il promeut « un socialisme à visage humain ».'],
            ['Comment le Printemps de Prague se termine-t-il ?', ['Par l’intervention des chars du pacte de Varsovie en août 1968', 'Par des élections libres', 'Par un compromis avec Moscou', 'Par la chute du régime'], 0, 'La doctrine Brejnev justifie l’intervention.'],
            ['Qu’est-ce que la doctrine Brejnev ?', ['La souveraineté limitée des pays socialistes', 'La coexistence pacifique', 'La détente', 'L’endiguement'], 0, 'Moscou s’autorise à intervenir chez ses satellites.'],
            ['Quel dirigeant américain des droits civiques est assassiné en 1968 ?', ['Martin Luther King', 'Malcolm X', 'Rosa Parks', 'John Kennedy'], 0, 'Son assassinat déclenche des émeutes dans de nombreuses villes.'],
            ['Quelle guerre nourrit la contestation étudiante américaine ?', ['La guerre du Vietnam', 'La guerre de Corée', 'La guerre du Golfe', 'La guerre d’Algérie'], 0, 'La conscription et les images télévisées mobilisent les campus.'],
            ['Les contestations de 1968 touchent uniquement les pays occidentaux.', ['Vrai', 'Faux'], 1, 'Prague, Varsovie et Mexico connaissent aussi leurs mouvements.'],
            ['Quel facteur commun explique ces mobilisations ?', ['Une génération nombreuse, plus scolarisée, née dans la prospérité', 'La crise économique', 'La guerre nucléaire', 'La décolonisation achevée'], 0, 'Le baby-boom arrive à l’âge adulte.'],
          ],
        },
        // ===================================================================
        // Chapitre 6 — La France : une nouvelle place dans le monde
        // ===================================================================
        {
          titre: 'La IVe République : entre décolonisation et construction européenne',
          axe: 'La France : une nouvelle place dans le monde',
          lecon: {
            titre: 'Un régime qui reconstruit, et qui trébuche sur l’empire',
            cours: `De 1946 à 1958, la IVe République reconstruit le pays et engage la France dans l’Europe. Elle échoue sur la décolonisation, qui l’emporte.

## Un régime instable
Constitution de 1946 : le pouvoir appartient à l’Assemblée, le président ne gouverne pas. Résultat : 24 gouvernements en douze ans, des coalitions fragiles, une opinion lassée. Le régime est cependant capable de grandes réformes.

## La reconstruction et les Trente Glorieuses
Nationalisations (EDF, Renault, banques), **Sécurité sociale** (1945), plan Monnet, aide Marshall, croissance forte, plein-emploi, hausse du niveau de vie, baby-boom et exode rural.

> La IVe République a construit l’État social et l’Europe : elle est morte de l’empire.

## La construction européenne
**CECA** (1951) proposée par Robert Schuman et Jean Monnet, échec de la CED (1954), puis **traité de Rome** (1957) créant la **CEE** : la réconciliation franco-allemande devient le moteur de l’Europe.

## La décolonisation qui emporte le régime
Guerre d’Indochine (1946-1954) achevée à Diên Biên Phu ; indépendance de la Tunisie et du Maroc (1956) ; surtout la **guerre d’Algérie**, commencée en 1954, avec torture, appelés du contingent et société divisée. La crise du **13 mai 1958** à Alger provoque le retour de **de Gaulle** et la fin du régime.`,
          },
          questions: [
            ['Quelle est la principale faiblesse institutionnelle de la IVe République ?', ['L’instabilité gouvernementale due à la prééminence de l’Assemblée', 'Un président trop puissant', 'L’absence de partis', 'Le suffrage censitaire'], 0, '24 gouvernements se succèdent en douze ans.'],
            ['Quelle protection sociale majeure est créée en 1945 ?', ['La Sécurité sociale', 'Les congés payés', 'Le SMIC', 'L’assurance chômage'], 0, 'Elle applique le programme du Conseil national de la Résistance.'],
            ['Quelle communauté européenne naît en 1951 ?', ['La CECA', 'La CEE', 'L’UE', 'L’AELE'], 0, 'Le charbon et l’acier, nerfs de la guerre, sont mis en commun.'],
            ['Quel traité crée la CEE en 1957 ?', ['Le traité de Rome', 'Le traité de Paris', 'Le traité de Maastricht', 'Le traité de Bruxelles'], 0, 'Six pays fondent un marché commun.'],
            ['Quelle défaite met fin à la guerre d’Indochine ?', ['Diên Biên Phu', 'Sedan', 'Suez', 'Alger'], 0, 'Elle conduit aux accords de Genève de 1954.'],
            ['Quel événement provoque la chute de la IVe République ?', ['La crise du 13 mai 1958 à Alger', 'La crise de Suez', 'Mai 68', 'Le référendum de 1962'], 0, 'De Gaulle revient au pouvoir et fait adopter une nouvelle constitution.'],
            ['La IVe République est le régime de la reconstruction et des Trente Glorieuses.', ['Vrai', 'Faux'], 0, 'Croissance forte, plein-emploi et modernisation caractérisent la période.'],
            ['Quel pays devient le partenaire clé de la France dans la construction européenne ?', ['L’Allemagne de l’Ouest', 'Le Royaume-Uni', 'L’Espagne', 'La Suède'], 0, 'La réconciliation franco-allemande est le moteur du projet.'],
          ],
        },
        {
          titre: 'La Ve République de De Gaulle',
          axe: 'La France : une nouvelle place dans le monde',
          lecon: {
            titre: 'Un exécutif fort et une politique d’indépendance',
            cours: `Fondée en 1958, la Ve République donne à la France des institutions stables et une politique étrangère d’indépendance. Elle s’achève, pour de Gaulle, en 1969.

## De nouvelles institutions
Constitution du **4 octobre 1958** : un président chef de l’exécutif, qui nomme le Premier ministre, peut dissoudre l’Assemblée et recourir au **référendum**. La révision de **1962**, adoptée par référendum, instaure l’**élection du président au suffrage universel direct** — la clé de voûte du régime.

## La fin de la guerre d’Algérie
Autodétermination annoncée en 1959, putsch des généraux et attentats de l’**OAS**, **accords d’Évian** (mars 1962), indépendance approuvée par référendum, rapatriement de près d’un million de pieds-noirs et drame des **harkis**.

> Rappelé pour garder l’Algérie française, de Gaulle en organise l’indépendance : c’est ce qui lui permet de tourner la France vers d’autres ambitions.

## L’indépendance nationale
Force de frappe **nucléaire** (premier essai en 1960), retrait du commandement intégré de l’**OTAN** (1966), reconnaissance de la Chine populaire (1964), discours de Phnom Penh contre la guerre du Vietnam, double veto à l’entrée du Royaume-Uni dans la CEE, coopération avec l’Allemagne (**traité de l’Élysée**, 1963).

## La fin
Modernisation, plein-emploi et croissance n’empêchent pas la crise de **mai 1968**. Le référendum perdu d’avril 1969 entraîne le départ immédiat du général.`,
          },
          questions: [
            ['Quelle révision de 1962 modifie durablement la Ve République ?', ['L’élection du président au suffrage universel direct', 'Le quinquennat', 'La création du Conseil constitutionnel', 'La décentralisation'], 0, 'Adoptée par référendum, elle donne au président une légitimité populaire directe.'],
            ['Quels accords mettent fin à la guerre d’Algérie ?', ['Les accords d’Évian de mars 1962', 'Les accords de Genève', 'Les accords de Grenelle', 'Les accords de l’Élysée'], 0, 'L’indépendance est ensuite approuvée par référendum.'],
            ['Qu’est-ce que l’OAS ?', ['Une organisation clandestine opposée à l’indépendance algérienne', 'Un parti gaulliste', 'Un mouvement syndical', 'Une agence de l’ONU'], 0, 'Elle mène attentats et tentative de putsch.'],
            ['Quelle décision militaire de 1966 marque l’indépendance française ?', ['Le retrait du commandement intégré de l’OTAN', 'L’entrée dans le pacte de Varsovie', 'La création de l’armée européenne', 'La fin du service militaire'], 0, 'La France garde l’alliance mais refuse la subordination.'],
            ['Quel traité de 1963 scelle la réconciliation franco-allemande ?', ['Le traité de l’Élysée', 'Le traité de Rome', 'Le traité de Paris', 'Le traité de Bruxelles'], 0, 'Signé par de Gaulle et Adenauer.'],
            ['De Gaulle s’oppose à l’entrée du Royaume-Uni dans la CEE.', ['Vrai', 'Faux'], 0, 'Il y met son veto à deux reprises, en 1963 et 1967.'],
            ['Quand la France procède-t-elle à son premier essai nucléaire ?', ['En 1960', 'En 1958', 'En 1966', 'En 1968'], 0, 'La force de frappe fonde la doctrine d’indépendance.'],
            ['Quel événement conduit au départ de De Gaulle en 1969 ?', ['L’échec de son référendum d’avril 1969', 'Mai 68 directement', 'Une motion de censure', 'La défaite aux législatives'], 0, 'Il quitte le pouvoir dès le lendemain du résultat.'],
          ],
        },
      ],
    },
  ],
}
