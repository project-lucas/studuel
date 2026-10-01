// Français — PREMIÈRE : les trois œuvres du roman et du récit au programme du
// bac 2027 (programme national d'œuvres pour l'année scolaire 2026-2027, note
// de service du 4 juillet 2025, BO n° 30 du 24 juillet 2025).
//
// L'objet d'étude « Le roman et le récit du Moyen Âge au XXIe siècle » est le
// seul renouvelé cette année : Manon Lescaut, La Peau de chagrin et Sido sortent
// du programme (rangées sous « Anciens programmes » par un autre module), et
// trois œuvres entrent, chacune avec son parcours associé (voie générale) :
//   · Chrétien de Troyes, Le Chevalier de la charrette — « Le roman et
//     l'invention de l'amour » ;
//   · Émile Zola, Pot-Bouille — « Dévoiler les rouages de la société » ;
//   · Simone Schwarz-Bart, Pluie et vent sur Télumée Miracle — « Tisser les
//     mémoires, habiter le monde ».
// La voie technologique a deux différences (Chrétien de Troyes : « Héroïsme et
// amour » ; Zola : Thérèse Raquin, « Anatomie des passions ») : les fiches le
// signalent, sans écrire Thérèse Raquin ici.
//
// Même gabarit que francais-1re.mjs : une fiche principale (titre nu de
// l'œuvre : contexte, résumé, structure, personnages) puis une « Partie 2 »
// (le parcours, les extraits à connaître pour l'oral, la dissertation,
// l'entretien). Pluie et vent est sous droits : aucune citation longue, les
// passages sont résumés et situés.

export default {
  slug: 'francais',
  nom: 'Français',

  titreMigration: 'FRANÇAIS 1re — LES ŒUVRES DU ROMAN AU PROGRAMME DU BAC 2027',

  motif: `Le programme national d'œuvres de l'année 2026-2027 (note de service du
4 juillet 2025, BO n° 30 du 24 juillet 2025) renouvelle l'objet d'étude « Le
roman et le récit du Moyen Âge au XXIe siècle ». Trois œuvres entrent au
programme : Le Chevalier de la charrette (Chrétien de Troyes), Pot-Bouille
(Zola) et Pluie et vent sur Télumée Miracle (Simone Schwarz-Bart). Aucune
n'avait de fiche dans le rayon Programme de la Première.

Cette migration ajoute six fiches — pour chaque œuvre, la fiche principale et
sa « Partie 2 » —, rangées sous le chapitre du programme « Le roman et le
récit du Moyen Âge au XXIe siècle », avec douze questions chacune. Elle ne
retire rien.`,

  blocs: [
    {
      niveaux: ['1re'],
      rayon: 'programme',
      positionDepart: 520,
      chapitres: [
        // ===================================================================
        // Chrétien de Troyes, Le Chevalier de la charrette
        // ===================================================================
        {
          titre: 'Le Chevalier de la charrette',
          axe: 'Le roman et le récit du Moyen Âge au XXIe siècle',
          lecon: {
            titre: 'Chrétien de Troyes, vers 1180 — le chevalier qui monte dans la charrette',
            cours: `Parcours associé : **le roman et l’invention de l’amour** (en voie technologique : **« Héroïsme et amour »**). *Le Chevalier de la charrette*, aussi appelé *Lancelot*, est écrit par **Chrétien de Troyes** entre **1177 et 1181** environ : l’un des tout premiers romans de la littérature française.

## Situer l’œuvre
| Repère | Ce qu’il faut savoir |
| L’**auteur** | Clerc lettré de Champagne, le plus grand romancier du XIIe siècle : *Érec et Énide*, *Cligès*, *Yvain*, *Perceval* |
| La **commande** | **Marie de Champagne**, fille d’Aliénor d’Aquitaine, lui fournit la **matière** (l’histoire) et le **sen** (le sens) ; lui y met son travail, dit le prologue |
| La **forme** | Environ **7 000 octosyllabes** à **rimes plates**, destinés à être **lus à voix haute** |
| Le mot « **roman** » | Il désigne d’abord un récit écrit en **langue romane** — le français — et non en latin |
| La **fin** | Chrétien laisse l’achèvement à un autre clerc, **Godefroi de Leigni**, qui l’annonce dans les derniers vers |

> Le roman arthurien mêle la **matière de Bretagne** (le roi Arthur, la Table ronde, le merveilleux celte) à l’idéal **courtois** des cours du XIIe siècle.

## L’intrigue, par étapes
| Étape | Ce qui arrive |
| L’**enlèvement** | **Méléagant**, fils du roi Bademagu, défie la cour d’Arthur et emmène la reine **Guenièvre** au royaume de **Gorre**, d’où nul ne revient |
| La **charrette** | Un chevalier sans nom, qui a perdu son cheval, rencontre un **nain** menant une charrette d’infamie, réservée aux condamnés. Il **hésite l’espace de deux pas**, puis y monte pour avoir des nouvelles de la reine |
| Les **épreuves** | Le lit périlleux, le gué défendu, le **peigne** où restent des cheveux de la reine, la dalle du **cimetière** qu’il est seul à soulever |
| Le **Pont de l’Épée** | Une lame tranchante au-dessus d’une eau noire : il la traverse **mains et pieds nus**, et s’y blesse ; **Gauvain**, lui, a choisi le Pont sous l’eau |
| Le **nom** | Pendant le combat contre Méléagant, une jeune fille demande son nom à la reine : c’est **Lancelot du Lac**, révélé **au milieu du roman** |
| L’**accueil glacé** | Guenièvre le reçoit froidement. Elle lui reproche plus tard ses **deux pas d’hésitation** |
| La **nuit d’amour** | Réconciliés, ils se retrouvent la nuit ; Lancelot **arrache les barreaux** de la fenêtre et se blesse : le sang sur les draps fait accuser le sénéchal **Keu** |
| Le **tournoi** | La reine lui fait dire de combattre **« au pire »** : il obéit et se couvre de honte ; puis **« au mieux »** : il triomphe |
| La **fin** | Emmuré dans une tour par Méléagant, Lancelot est délivré par la **sœur** de celui-ci ; il revient à la cour et **tue Méléagant** en combat singulier |

## Les personnages
| Personnage | Ce qu’il est |
| **Lancelot** | Le meilleur des chevaliers, entièrement **soumis à sa dame** ; il se reconnaît à ses actes avant de se reconnaître à son nom |
| **Guenièvre** | La reine, épouse d’Arthur : la **dame** qui ordonne, éprouve, récompense |
| **Méléagant** | Le traître orgueilleux, sans loyauté : le **contre-modèle** du chevalier |
| **Bademagu** | Son père, roi sage et **loyal**, qui protège la reine |
| **Gauvain** | Le neveu d’Arthur, parfait chevalier… qui **n’est pas amoureux** : il échoue là où Lancelot réussit |
| **Keu** | Le sénéchal vantard, vaincu dès le début |

> L’ordre du récit est un **chemin d’initiation** : plus Lancelot s’humilie par amour, plus il devient **invincible**.`,
          },
          questions: [
            ['Qui a commandé Le Chevalier de la charrette à Chrétien de Troyes ?', ['Aliénor d’Aquitaine', 'Le roi Arthur', 'Marie de Champagne', 'Philippe Auguste'], 2, 'Fille d’Aliénor d’Aquitaine, elle lui a fourni, dit le prologue, la matière et le sens du récit.'],
            ['En quel vers le roman est-il écrit ?', ['En alexandrins à rimes croisées', 'En octosyllabes à rimes plates', 'En décasyllabes', 'En prose rythmée'], 1, 'L’octosyllabe à rimes plates est le vers du récit au XIIe siècle, fait pour être lu à voix haute.'],
            ['Que signifie d’abord le mot « roman » au Moyen Âge ?', ['Un récit d’amour', 'Un récit en prose', 'Un récit écrit en langue romane plutôt qu’en latin', 'Un récit inventé'], 2, 'Le genre a pris le nom de la langue : « mettre en roman », c’est traduire en français.'],
            ['Pourquoi monter dans la charrette est-il une honte ?', ['Elle transporte les condamnés et les criminels', 'Elle appartient à Méléagant', 'Elle est réservée aux femmes', 'Elle mène au royaume des morts'], 0, 'Un chevalier qui y monte perd son honneur aux yeux de tous : Lancelot le sacrifie pour la reine.'],
            ['Que reproche Guenièvre à Lancelot ?', ['D’avoir tué Méléagant trop tôt', 'D’avoir hésité l’espace de deux pas avant de monter dans la charrette', 'D’avoir laissé Gauvain passer le premier', 'D’avoir caché son nom'], 1, 'Deux pas d’hésitation suffisent : l’amour courtois exige une obéissance sans calcul.'],
            ['Où Méléagant emmène-t-il la reine ?', ['À Camelot', 'En Bretagne', 'Au royaume de Logres', 'Au royaume de Gorre, d’où nul ne revient'], 3, 'Logres est le royaume d’Arthur ; Gorre est la terre de Bademagu, où les captifs sont retenus.'],
            ['Comment Lancelot franchit-il l’eau qui protège Gorre ?', ['Par le Pont sous l’eau', 'À la nage', 'Par le Pont de l’Épée, mains et pieds nus', 'Sur une barque enchantée'], 2, 'Il s’y blesse cruellement ; c’est Gauvain qui choisit le Pont sous l’eau, et il échoue.'],
            ['À quel moment le nom de Lancelot est-il révélé ?', ['Dès le premier vers', 'Au milieu du roman, pendant son combat contre Méléagant', 'Dans le dernier vers', 'Jamais'], 1, 'Une jeune fille le demande à la reine : le héros existe d’abord par ses actes.'],
            ['Que demande la reine à Lancelot lors du tournoi ?', ['De combattre au pire, puis au mieux', 'De se retirer', 'De tuer Keu', 'De combattre sans armure'], 0, 'Il obéit aux deux ordres : sa soumission à la dame vaut plus que sa gloire.'],
            ['Qui achève le roman laissé par Chrétien de Troyes ?', ['Marie de France', 'Robert de Boron', 'Béroul', 'Godefroi de Leigni'], 3, 'Il le dit lui-même à la fin : il a écrit la dernière partie avec l’accord de Chrétien.'],
            ['Gauvain réussit toutes les épreuves du roman aussi bien que Lancelot.', ['Vrai', 'Faux'], 1, 'Parfait chevalier mais pas amoureux, il échoue : l’amour est la force qui fait réussir Lancelot.'],
            ['Qui délivre Lancelot de la tour où Méléagant l’a emmuré ?', ['Guenièvre', 'Gauvain', 'La sœur de Méléagant', 'Le roi Arthur'], 2, 'Il avait exaucé une de ses demandes : elle lui rend ce service, la générosité appelle la générosité.'],
          ],
        },
        {
          titre: 'Le Chevalier de la charrette - Partie 2',
          axe: 'Le roman et le récit du Moyen Âge au XXIe siècle',
          lecon: {
            titre: 'Chrétien de Troyes — quand l’amour devient le sujet du roman',
            cours: `Cette seconde partie prend l’œuvre par son **parcours** : **le roman et l’invention de l’amour**. Le mot « invention » a deux sens, et les deux comptent : l’amour **trouve** ses règles, et le roman **découvre** qu’il peut en faire son sujet.

## La fin’amor, un code
Les troubadours du Midi ont chanté la **fin’amor**, l’amour « raffiné » ; Chrétien le transporte dans le **récit**.

| Règle courtoise | Dans le roman |
| La dame est **supérieure** à l’amant | Guenièvre est **reine**, Lancelot la **sert** comme un vassal son seigneur |
| L’amour passe par des **épreuves** | La charrette, le Pont de l’Épée, le tournoi |
| L’amour doit rester **secret** | La nuit d’amour est cachée ; le sang trahit, mais c’est Keu qu’on accuse |
| L’amour **ennoblit** | Il rend Lancelot **meilleur chevalier** que tous |
| L’amour est souvent **adultère** | La reine est l’épouse d’Arthur |

> Le paradoxe est voulu : un amour **hors du mariage**, que la morale condamne, devient la **source de toutes les vertus** chevaleresques.

## Raison contre Amour
Au moment de la charrette, le narrateur met en scène un **débat intérieur** : **Raison** conseille de ne pas monter, **Amour** l’ordonne. Amour gagne, mais après **deux pas**.

> C’est l’un des premiers moments où un roman montre ce qui se passe **dans une conscience** : le conflit entre l’honneur social et le désir.

## Les passages à connaître pour l’oral
1. **Le prologue** : Chrétien écrit pour Marie de Champagne, qui lui a donné la matière et le sens.
2. **La charrette** : l’hésitation, la montée, les moqueries des passants.
3. **Le peigne** : Lancelot trouve des cheveux de la reine, manque de s’évanouir et les garde **contre sa poitrine** comme des reliques — l’amour devient une **religion**.
4. **Le Pont de l’Épée** : la souffrance acceptée, la foi dans l’amour qui guérit.
5. **Le combat sous la fenêtre** : Lancelot se bat en **regardant la reine** et tourne le dos à son adversaire ; le nom est révélé.
6. **La nuit d’amour** : les barreaux arrachés, les mains blessées, la scène décrite avec **pudeur**.
7. **Le tournoi « au pire »** : le héros accepte le ridicule — le passage le plus troublant pour un lecteur d’aujourd’hui.

## Un narrateur qui intervient
Le conteur **commente**, annonce, s’adresse à son public, s’excuse parfois de ne pas tout dire. Le récit est fait pour une **lecture à voix haute** devant une cour.

## Les axes de dissertation
| Question | Ce que l’œuvre permet de répondre |
| L’amour rend-il **meilleur** ou **esclave** ? | Les deux : Lancelot gagne la prouesse en perdant sa liberté |
| Le roman **célèbre**-t-il l’amour ou en montre-t-il les **excès** ? | La soumission au tournoi peut se lire comme un sommet ou comme une limite, parfois avec **humour** |
| Qu’est-ce qu’un **héros** de roman ? | Un personnage qui **apprend**, qui doute, qui a une **intériorité** — non plus seulement un guerrier d’épopée |
| Pourquoi « **invention** » de l’amour ? | Parce que ces règles — service, attente, épreuve, secret — nourrissent le roman sentimental **jusqu’à aujourd’hui** |

## Pistes pour l’entretien
Tu peux rapprocher Lancelot de **Tristan**, des romans d’amour plus récents, ou d’une série et d’un film où l’amour impose des épreuves. Sois prêt à dire **ce qui te semble étranger** dans cet amour, et ce qui te parle encore.

> L’œuvre invente un couple qui ne peut **ni se montrer ni se séparer** : c’est le schéma de bien des histoires d’amour depuis.`,
          },
          questions: [
            ['Comment appelle-t-on l’amour raffiné chanté par les troubadours ?', ['L’amour platonique', 'La fin’amor', 'Le coup de foudre', 'L’amour filial'], 1, 'Chrétien de Troyes transporte dans le récit ce code né dans la poésie lyrique du Midi.'],
            ['Dans l’amour courtois, quelle est la position de la dame ?', ['Égale à l’amant', 'Soumise à l’amant', 'Supérieure à l’amant, qui la sert', 'Absente du récit'], 2, 'Le lien amoureux reproduit le lien féodal : l’amant est le vassal de sa dame.'],
            ['Quelles deux figures s’opposent au moment de la charrette ?', ['Raison et Amour', 'Honte et Gloire', 'Dieu et le Diable', 'Guenièvre et Arthur'], 0, 'Ce débat intérieur montre une conscience partagée : c’est une nouveauté du roman.'],
            ['Que fait Lancelot des cheveux trouvés sur le peigne ?', ['Il les rend à la reine', 'Il les garde contre sa poitrine comme des reliques', 'Il les brûle', 'Il les montre à Gauvain'], 1, 'L’amour prend la forme d’un culte religieux : l’objet de la dame est sacré.'],
            ['Que fait Lancelot pendant son combat sous la fenêtre de la reine ?', ['Il ferme les yeux', 'Il se bat en la regardant, jusqu’à tourner le dos à son adversaire', 'Il abandonne le combat', 'Il appelle Gauvain à l’aide'], 1, 'La vue de la dame lui donne sa force : l’amour est littéralement ce qui le fait combattre.'],
            ['Quel caractère de l’amour de Lancelot et Guenièvre la morale de l’époque condamne-t-elle ?', ['Il est adultère : Guenièvre est l’épouse d’Arthur', 'Il est trop bref', 'Il est public', 'Il unit deux paysans'], 0, 'Le paradoxe courtois : un amour interdit devient la source des vertus chevaleresques.'],
            ['Pourquoi le secret est-il une règle de l’amour courtois ?', ['Pour protéger l’honneur de la dame', 'Parce que l’amant a honte', 'Parce que le roi l’ordonne', 'Pour rendre le récit plus court'], 0, 'La nuit d’amour reste cachée : même trahie par le sang, elle fait accuser Keu, pas Lancelot.'],
            ['Quel est le parcours associé à l’œuvre en voie générale ?', ['Héroïsme et amour', 'Personnages en marge, plaisirs du romanesque', 'Le roman et l’invention de l’amour', 'Les jeux du cœur et de la parole'], 2, '« Héroïsme et amour » est l’intitulé de la voie technologique.'],
            ['Le narrateur du roman reste invisible et ne commente jamais son récit.', ['Vrai', 'Faux'], 1, 'Le conteur intervient, annonce et s’adresse à son public : le texte est fait pour être lu à voix haute.'],
            ['Quel épisode peut surprendre un lecteur moderne par la soumission du héros ?', ['Le Pont de l’Épée', 'Le tournoi où il combat « au pire » sur ordre de la reine', 'L’enlèvement de la reine', 'Le prologue'], 1, 'Il accepte le ridicule public : sommet de l’amour courtois, ou limite qu’on peut lire avec humour.'],
            ['Qu’apporte le roman de Chrétien au personnage de chevalier ?', ['Une intériorité : il doute, hésite, souffre', 'Une force surhumaine', 'Une généalogie divine', 'Un langage épique répétitif'], 0, 'Le héros de roman se distingue du héros d’épopée : on entre dans sa conscience.'],
            ['Quel lien unit l’amour et la prouesse dans le roman ?', ['L’amour affaiblit le chevalier', 'L’amour rend Lancelot meilleur chevalier que tous', 'Ils n’ont aucun rapport', 'La prouesse remplace l’amour'], 1, 'C’est une loi courtoise : l’amour ennoblit et donne la force de vaincre.'],
          ],
        },
        // ===================================================================
        // Émile Zola, Pot-Bouille
        // ===================================================================
        {
          titre: 'Pot-Bouille',
          axe: 'Le roman et le récit du Moyen Âge au XXIe siècle',
          lecon: {
            titre: 'Zola, 1882 — un immeuble bourgeois vu de l’escalier de service',
            cours: `Parcours associé : **dévoiler les rouages de la société**. *Pot-Bouille* paraît en **1882** : c’est le **dixième volume** des *Rougon-Macquart*, l’« histoire naturelle et sociale d’une famille sous le Second Empire » qu’**Émile Zola** écrit en vingt romans.

## Situer l’œuvre
| Repère | Ce qu’il faut savoir |
| L’**auteur** | Zola (1840-1902), chef de file du **naturalisme** ; il a théorisé le **roman expérimental** (1880) |
| Le **cycle** | Chaque roman explore un **milieu** : la mine, les Halles, le grand magasin… Ici, la **bourgeoisie** |
| Le **titre** | « Pot-bouille », c’est la cuisine ordinaire du ménage, le quotidien du foyer : Zola montre **l’envers** de la vie domestique |
| Le **lieu** | Un immeuble neuf de la **rue de Choiseul**, à Paris, avec ses étages, ses locataires et ses domestiques |
| La **suite** | Le héros, **Octave Mouret**, deviendra le patron d’*Au Bonheur des Dames* (1883) |

## L’intrigue
| Étape | Ce qui arrive |
| L’**arrivée** | Octave Mouret, **vingt-deux ans**, arrive de Plassans, loue une chambre dans l’immeuble et entre comme commis chez **Mme Hédouin**, qui tient le magasin *Au Bonheur des Dames* |
| Les **conquêtes** | Ambitieux, il veut réussir **par les femmes** : il échoue auprès de Valérie et de Mme Hédouin, séduit **Marie Pichon**, sa voisine |
| Le **marché au mariage** | **Mme Josserand** veut à tout prix marier ses filles ; **Berthe** épouse **Auguste Vabre** |
| L’**adultère** | Berthe devient la maîtresse d’Octave ; le mari les surprend : **scandale**, menace de duel, étouffé |
| L’**héritage** | À la mort du vieux Vabre, propriétaire, la famille se déchire pour sa fortune — qui se révèle bien moindre que prévu |
| Le **drame caché** | **Adèle**, la bonne des Josserand, accouche seule dans sa chambre sous les toits, et abandonne l’enfant |
| La **fin** | Octave épouse Mme Hédouin, devenue veuve ; l’immeuble retrouve sa **façade** respectable, comme si rien ne s’était passé |

## Les personnages
| Personnage | Ce qu’il représente |
| **Octave Mouret** | L’ambitieux méthodique, qui calcule ses conquêtes comme des affaires |
| **Mme Josserand** | La mère qui **chasse le mari** pour ses filles, faute de fortune |
| **M. Josserand** | Le père honnête, qui s’épuise la nuit à des travaux de copie pour tenir le rang |
| **Berthe** | Élevée pour se vendre au mariage, elle ne sait rien faire d’autre que paraître |
| **Duveyrier** | Magistrat austère en public, entretenant une maîtresse |
| **Campardon** | L’architecte, qui vit entre sa femme et sa cousine Gasparine, sa maîtresse |
| **M. Gourd** | Le concierge, **gardien de la respectabilité** : il surveille tout, ne voit rien de ce qui compte |
| **L’abbé Mauduit** | Il sait tout et couvre tout, pour préserver les apparences |
| Les **bonnes** | Adèle, Lisa, Julie : elles savent tout des maîtres |

> Le personnage principal n’est pas Octave : c’est **l’immeuble**. Zola le décrit comme un organisme, étage par étage.`,
          },
          questions: [
            ['À quel cycle romanesque Pot-Bouille appartient-il ?', ['La Comédie humaine', 'Les Rougon-Macquart', 'Les Thibault', 'À la recherche du temps perdu'], 1, 'C’en est le dixième volume : Zola y explore le milieu de la bourgeoisie parisienne.'],
            ['En quelle année paraît Pot-Bouille ?', ['1857', '1871', '1882', '1898'], 2, 'L’année suivante paraît Au Bonheur des Dames, qui prolonge l’histoire d’Octave Mouret.'],
            ['Que désigne l’expression « pot-bouille » ?', ['Un plat de fête', 'La cuisine ordinaire du ménage, le quotidien du foyer', 'Une marmite de sorcière', 'Un café populaire'], 1, 'Le titre annonce l’envers de la vie domestique bourgeoise.'],
            ['Où se déroule l’essentiel du roman ?', ['Dans un immeuble bourgeois de la rue de Choiseul', 'Dans une mine du Nord', 'Aux Halles', 'Dans un village de Provence'], 0, 'Un immeuble neuf, avec ses étages de locataires et ses chambres de bonnes sous les toits.'],
            ['Comment Octave Mouret compte-t-il réussir à Paris ?', ['Par l’héritage', 'Par la politique', 'Par les femmes', 'Par la littérature'], 2, 'Il calcule ses conquêtes comme des affaires : c’est ce qui fait de lui un personnage d’ambitieux.'],
            ['Quelle obsession anime Mme Josserand ?', ['Devenir propriétaire', 'Marier ses filles à tout prix', 'Entrer dans la noblesse', 'Faire carrière au théâtre'], 1, 'Faute de dot, elle traque les maris : le mariage est présenté comme un marché.'],
            ['Qui Berthe Josserand épouse-t-elle ?', ['Octave Mouret', 'Duveyrier', 'Campardon', 'Auguste Vabre'], 3, 'Elle deviendra ensuite la maîtresse d’Octave, d’où le scandale.'],
            ['Quel drame vit Adèle, la bonne des Josserand ?', ['Elle est chassée pour vol', 'Elle accouche seule dans sa chambre et abandonne l’enfant', 'Elle épouse un locataire', 'Elle hérite du vieux Vabre'], 1, 'Le drame se joue sous les toits, sans que les maîtres veuillent rien savoir.'],
            ['Quel rôle joue le concierge, M. Gourd ?', ['Il dénonce tous les scandales', 'Il veille sur la respectabilité de la maison', 'Il est l’amant de Berthe', 'Il possède l’immeuble'], 1, 'Il surveille les apparences et ferme les yeux sur l’essentiel.'],
            ['Octave Mouret est le seul véritable héros du roman.', ['Vrai', 'Faux'], 1, 'Le vrai personnage principal est l’immeuble, décrit comme un organisme vivant.'],
            ['Qui Octave épouse-t-il à la fin du roman ?', ['Berthe', 'Marie Pichon', 'Mme Hédouin', 'Hortense Josserand'], 2, 'Veuve, elle lui ouvre le chemin du grand magasin : Au Bonheur des Dames commence là.'],
            ['Quel mouvement littéraire Zola a-t-il fondé ?', ['Le romantisme', 'Le naturalisme', 'Le symbolisme', 'Le surréalisme'], 1, 'Il prolonge le réalisme en voulant observer la société avec la méthode des sciences.'],
          ],
        },
        {
          titre: 'Pot-Bouille - Partie 2',
          axe: 'Le roman et le récit du Moyen Âge au XXIe siècle',
          lecon: {
            titre: 'Zola — la façade et l’escalier de service',
            cours: `Cette seconde partie prend l’œuvre par son **parcours** : **dévoiler les rouages de la société**. Dévoiler, c’est **lever un voile** ; les rouages, ce sont les **mécanismes cachés** qui font tourner une machine. Zola fait les deux.

## L’immeuble comme machine
| Ce qu’on montre | Ce qu’on cache |
| Le **grand escalier** : faux marbre, tapis, chauffage, silence | L’**escalier de service** et la **cour intérieure** |
| Les **salons** et leurs réceptions | Les chambres, les dettes, les maîtresses |
| La **façade** d’une maison « honnête » | La vie réelle des locataires |

> Le roman fonctionne comme une **coupe** d’immeuble : on voit tous les étages à la fois, et on comprend que le décor n’est là que pour **cacher**.

## Les rouages
1. **L’argent** : on se marie pour une dot, on se déchire pour un héritage, on vit au-dessus de ses moyens pour **paraître**.
2. **Le mariage** : un **marché** où les filles sont éduquées pour plaire, non pour vivre.
3. **L’adultère** : il est partout, et il est **toléré** tant qu’il ne se voit pas.
4. **La religion** : l’abbé Mauduit connaît les fautes et aide à **sauver les apparences**.
5. **La domination sociale** : les bonnes, logées sous les toits, travaillent, souffrent et **savent tout**.

## Les passages à connaître pour l’oral
1. **L’arrivée d’Octave** : la visite de l’immeuble, l’escalier majestueux, la **façade** morale de la maison.
2. **Le salon Josserand** : la chasse au mari, les manœuvres de la mère, la fille poussée en avant.
3. **La cour des bonnes** : par les fenêtres des cuisines, les domestiques **crient les secrets** des maîtres — le vrai chœur du roman.
4. **Le mariage de Berthe** : la cérémonie masque les calculs.
5. **L’accouchement d’Adèle** : la scène la plus crue, **seule** dans sa chambre, pendant que la maison dort.
6. **La fin** : tout recommence ; les bonnes concluent que toutes les maisons se valent.

## Le regard naturaliste
| Procédé | Son effet |
| La **focalisation** variable, souvent par les yeux d’Octave | Le lecteur découvre l’immeuble comme un **nouveau venu** |
| Le **discours indirect libre** | On entend les pensées des personnages **sans commentaire** du narrateur |
| L’**ironie** | Le contraste entre les grands mots (morale, honneur, famille) et les actes |
| La **satire** | Elle vire parfois à la **farce** : on rit, puis on est gêné d’avoir ri |

## Les axes de dissertation
| Question | Ce que l’œuvre permet de répondre |
| Le roman peut-il **dévoiler** la société ? | Oui, par l’observation minutieuse d’un **milieu** et de ses lois |
| Le romancier **juge**-t-il ? | Il prétend observer ; mais le **montage** des scènes et l’ironie sont déjà un jugement |
| Pourquoi choisir un **lieu clos** ? | Il concentre la société dans un espace, comme un **laboratoire** |
| Le rire affaiblit-il la critique ? | Il la rend **plus cruelle** : le ridicule détruit les apparences |

## Pistes pour l’entretien
Le roman fit **scandale** : on accusa Zola de salir la bourgeoisie. Tu peux discuter ce reproche, rapprocher l’immeuble de *Pot-Bouille* d’autres récits en lieu clos, ou d’une série qui montre l’envers d’un milieu.`,
          },
          questions: [
            ['Que signifie « dévoiler les rouages de la société » ?', ['Rendre visibles les mécanismes cachés qui la font fonctionner', 'Décrire les machines industrielles', 'Raconter l’histoire d’une révolution', 'Faire l’éloge de la bourgeoisie'], 0, 'Dévoiler, c’est lever le voile ; les rouages sont l’argent, le mariage, les apparences.'],
            ['Qu’oppose le roman au grand escalier de l’immeuble ?', ['Le jardin', 'L’escalier de service et la cour intérieure', 'La rue', 'La cave'], 1, 'D’un côté la façade respectable, de l’autre la vie réelle et les secrets.'],
            ['Que font les bonnes dans la cour intérieure ?', ['Elles chantent des cantiques', 'Elles crient les secrets des maîtres d’une fenêtre à l’autre', 'Elles se taisent', 'Elles préparent une grève'], 1, 'Elles forment le chœur du roman : ce sont elles qui savent tout.'],
            ['Comment le mariage est-il présenté dans Pot-Bouille ?', ['Comme un marché où l’argent décide', 'Comme l’accomplissement d’un amour', 'Comme un sacrement respecté', 'Comme une fête populaire'], 0, 'Dots, calculs, filles éduquées pour plaire : Zola en montre les rouages économiques.'],
            ['Quel rôle joue l’abbé Mauduit ?', ['Il dénonce les fautes en chaire', 'Il quitte l’immeuble', 'Il aide à sauver les apparences', 'Il marie Octave'], 2, 'La religion devient un rouage de la respectabilité.'],
            ['Quel procédé fait entendre les pensées des personnages sans commentaire du narrateur ?', ['L’apostrophe', 'Le discours indirect libre', 'La prolepse', 'Le monologue théâtral'], 1, 'Il laisse les personnages se trahir eux-mêmes : c’est une arme de l’ironie naturaliste.'],
            ['Pourquoi Zola choisit-il un lieu clos comme un immeuble ?', ['Pour réduire le nombre de personnages', 'Pour concentrer la société comme dans un laboratoire', 'Pour éviter les descriptions', 'Pour respecter l’unité de lieu du théâtre'], 1, 'L’immeuble est un échantillon de la bourgeoisie, observé étage par étage.'],
            ['Le rire affaiblit toujours la critique sociale dans le roman.', ['Vrai', 'Faux'], 1, 'Le ridicule détruit les apparences : la satire rend la critique plus cruelle.'],
            ['Par les yeux de quel personnage découvre-t-on souvent l’immeuble ?', ['Octave Mouret', 'M. Gourd', 'Berthe', 'L’abbé Mauduit'], 0, 'Nouveau venu, il découvre la maison comme le lecteur.'],
            ['Quelle scène est la plus crue du roman ?', ['Le mariage de Berthe', 'L’accouchement d’Adèle, seule dans sa chambre', 'La mort du vieux Vabre', 'L’arrivée d’Octave'], 1, 'La maison dort pendant qu’une bonne accouche seule : l’envers exact de la façade.'],
            ['Comment le roman fut-il reçu à sa parution ?', ['Il passa inaperçu', 'Il fut accusé de salir la bourgeoisie', 'Il reçut le prix Goncourt', 'Il fut interdit et saisi'], 1, 'Le scandale prouve que le dévoilement touchait juste.'],
            ['Que suggère la fin du roman ?', ['Que tout va changer', 'Que la maison retrouve sa façade et que tout recommence', 'Que les bonnes prennent le pouvoir', 'Qu’Octave quitte Paris'], 1, 'Les bonnes concluent que toutes les maisons se valent : les rouages continuent de tourner.'],
          ],
        },
        // ===================================================================
        // Simone Schwarz-Bart, Pluie et vent sur Télumée Miracle
        // ===================================================================
        {
          titre: 'Pluie et vent sur Télumée Miracle',
          axe: 'Le roman et le récit du Moyen Âge au XXIe siècle',
          lecon: {
            titre: 'Simone Schwarz-Bart, 1972 — une vie de femme en Guadeloupe',
            cours: `Parcours associé : **tisser les mémoires, habiter le monde**. *Pluie et vent sur Télumée Miracle* paraît en **1972**. C’est le roman d’une femme de Guadeloupe qui raconte sa vie, et celle des femmes de sa lignée, un siècle après l’**abolition de l’esclavage** (1848).

## Situer l’œuvre
| Repère | Ce qu’il faut savoir |
| L’**autrice** | **Simone Schwarz-Bart** (1938-2023), romancière guadeloupéenne ; elle a aussi écrit avec son mari, André Schwarz-Bart |
| Le **lieu** | La Guadeloupe rurale : les mornes, les champs de **canne à sucre**, des villages comme **Fond-Zombi** |
| L’**époque** | La première moitié du XXe siècle : la pauvreté des descendants d’esclaves, le travail dans les plantations des **Blancs créoles** |
| La **langue** | Un français nourri du **créole** : ses proverbes, ses images, le rythme du **conte** |
| Le **titre** | La pluie et le vent, ce sont les **épreuves** ; « Miracle », le surnom que Télumée reçoit au terme de sa vie |

## Deux parties
| Partie | Ce qu’elle raconte |
| **« Présentation des miens »** | La **lignée** : l’aïeule Minerve, affranchie ; sa fille **Toussine**, que l’on appellera **Reine Sans Nom** ; puis **Victoire**, la mère de Télumée |
| **« Histoire de ma vie »** | La vie de **Télumée** elle-même, de l’enfance à la vieillesse |

> La narratrice est **âgée** : elle raconte **depuis son jardin**, au soir de sa vie. C’est un récit **rétrospectif** à la première personne.

## L’histoire de Télumée
| Étape | Ce qui arrive |
| L’**enfance** | Sa mère la confie à sa grand-mère, **Reine Sans Nom**, qui l’élève à Fond-Zombi et lui apprend à tenir debout dans le malheur |
| Le **savoir** | **Man Cia**, l’amie de sa grand-mère, femme de savoir et de mystère, lui transmet les secrets des plantes et des esprits |
| La **condition servile** | Jeune fille, Télumée est **servante** chez une famille de Blancs créoles, les **Desaragne**, qui la méprisent |
| **Elie** | Premier amour, vie heureuse ; puis Elie, sans travail, sombre dans l’amertume et la **violence**, et la chasse |
| La **chute** | Télumée s’effondre ; elle se relève |
| **Amboise** | Un homme doux et sage, avec qui elle vit ; il **meurt** lors d’une grève des travailleurs de la canne |
| La **fin** | Elle élève une enfant, **Sonore**, qui finit par partir ; elle pardonne à un homme qui lui voulait du mal ; on l’appelle alors **Télumée Miracle** |

## Les personnages
| Personnage | Ce qu’il est |
| **Télumée** | La narratrice : une femme qui tombe et **se relève**, et qui choisit la bonté |
| **Reine Sans Nom** | La grand-mère : la force, la dignité, la transmission |
| **Man Cia** | La guérisseuse, le lien avec le monde invisible |
| **Elie** | L’amour qui se défait sous le poids de la misère |
| **Amboise** | L’homme qui a compris le monde et qui meurt pour la dignité des travailleurs |

> Le livre tient dans une lignée de **femmes debout** : chacune transmet à la suivante l’art de **ne pas se laisser détruire**.`,
          },
          questions: [
            ['En quelle année paraît Pluie et vent sur Télumée Miracle ?', ['1948', '1972', '1998', '1962'], 1, 'Le roman paraît plus d’un siècle après l’abolition de l’esclavage dans les colonies françaises (1848).'],
            ['Dans quelle île se déroule le roman ?', ['La Martinique', 'Haïti', 'La Guadeloupe', 'La Réunion'], 2, 'Simone Schwarz-Bart est guadeloupéenne ; le roman se déroule dans la Guadeloupe rurale.'],
            ['Qui raconte l’histoire ?', ['Un narrateur omniscient', 'Télumée elle-même, âgée, au soir de sa vie', 'Reine Sans Nom', 'Elie'], 1, 'C’est un récit rétrospectif à la première personne, dit depuis son jardin.'],
            ['Quel est le titre de la première partie ?', ['« Présentation des miens »', '« Histoire de ma vie »', '« L’Enfance »', '« Les Mornes »'], 0, 'Avant de parler d’elle, Télumée présente la lignée de femmes dont elle vient.'],
            ['Qui élève Télumée pendant son enfance ?', ['Sa mère Victoire', 'Man Cia', 'Madame Desaragne', 'Sa grand-mère, Reine Sans Nom'], 3, 'Elle lui apprend à rester debout dans le malheur : c’est la grande figure de transmission.'],
            ['Qui est Man Cia ?', ['Une servante des Desaragne', 'Une femme de savoir et de mystère, amie de Reine Sans Nom', 'La fille de Télumée', 'La rivale de Télumée'], 1, 'Elle transmet à Télumée les secrets des plantes et des esprits.'],
            ['Chez qui Télumée travaille-t-elle comme servante ?', ['Chez les Desaragne, une famille de Blancs créoles', 'Chez Amboise', 'Chez un médecin de la ville', 'Chez Man Cia'], 0, 'Leur mépris montre que la hiérarchie de l’esclavage survit après son abolition.'],
            ['Que devient Elie, le premier amour de Télumée ?', ['Il part en France', 'Il devient riche', 'Il sombre dans l’amertume et la violence', 'Il meurt pendant une grève'], 2, 'Sans travail, écrasé par la misère, il se retourne contre celle qu’il aimait.'],
            ['Comment meurt Amboise ?', ['De vieillesse', 'Lors d’une grève des travailleurs de la canne', 'En mer', 'D’une maladie tropicale'], 1, 'Il meurt pour la dignité des travailleurs, dans le monde des plantations.'],
            ['Que désignent la pluie et le vent du titre ?', ['Les saisons de la canne', 'Les épreuves traversées', 'Les voyages de Télumée', 'Des personnages du roman'], 1, 'Face à elles, Télumée ne plie pas : d’où le surnom de Miracle.'],
            ['Pourquoi appelle-t-on Télumée « Miracle » à la fin ?', ['Parce qu’elle a guéri un enfant', 'Parce qu’elle a fait fortune', 'Parce qu’elle a pardonné et est restée debout après toutes ses épreuves', 'Parce qu’elle a quitté l’île'], 2, 'Le miracle n’a rien de surnaturel : c’est une vie qui ne s’est pas laissé détruire.'],
            ['La langue du roman ignore totalement le créole.', ['Vrai', 'Faux'], 1, 'Le français du roman est nourri de proverbes, d’images et de rythmes créoles.'],
          ],
        },
        {
          titre: 'Pluie et vent sur Télumée Miracle - Partie 2',
          axe: 'Le roman et le récit du Moyen Âge au XXIe siècle',
          lecon: {
            titre: 'Schwarz-Bart — une lignée de femmes debout',
            cours: `Cette seconde partie prend l’œuvre par son **parcours** : **tisser les mémoires, habiter le monde**. Deux verbes, deux gestes : **tisser**, c’est relier des fils — les vies, les générations, les récits ; **habiter**, c’est trouver sa place dans un monde qui ne vous a pas été donné.

## Tisser les mémoires
| Mémoire | Comment elle passe |
| La mémoire de l’**esclavage** | Minerve, l’aïeule, a connu l’**affranchissement** ; la hiérarchie coloniale survit chez les Desaragne |
| La mémoire **familiale** | La lignée des femmes Lougandor, racontée avant la vie de Télumée |
| La mémoire **orale** | Les **contes**, les proverbes, les chants que Reine Sans Nom transmet le soir |
| La mémoire **du corps** | Les gestes du travail, des soins, des plantes |

> Le roman fait ce qu’il raconte : il **tisse**. La première partie, consacrée à la lignée, montre que Télumée n’existe pas seule — elle est la **somme** des femmes qui l’ont précédée.

## Habiter le monde
1. **Un lieu** : le jardin, la case, le morne. Télumée apprend à regarder la nature comme un **refuge** et une force.
2. **Une dignité** : face au mépris des maîtres, Reine Sans Nom lui apprend qu’on peut être pauvre sans être **abaissé**.
3. **Une manière d’être** : **tenir debout**, dans la joie comme dans le malheur. Le roman répète cette image de la femme **droite**, que le vent ne couche pas.
4. **Un pardon** : à la fin, Télumée accompagne jusqu’à la mort un homme qui lui voulait du mal. Habiter le monde, c’est refuser que la haine l’emporte.

## Les passages à connaître pour l’oral
1. **L’ouverture** : la narratrice affirme que le pays dépend du cœur de l’homme ; elle se présente et annonce qu’elle va dire les siens.
2. **L’histoire de Toussine** : après la mort de sa fille dans un incendie, elle s’enferme dans le désespoir, puis **se relève** ; on la nomme alors **Reine Sans Nom**.
3. **Les veillées** : Reine Sans Nom raconte des contes à l’enfant — la parole comme **héritage**.
4. **Chez les Desaragne** : les paroles blessantes de la maîtresse sur les Noirs ; la réponse intérieure de Télumée, qui **garde sa dignité**.
5. **Le bonheur avec Elie**, puis sa **violence** : le basculement d’un amour sous l’effet de la misère.
6. **La mort d’Amboise** : la lutte collective des travailleurs.
7. **La fin**, dans le jardin : la vieille femme qui a traversé la pluie et le vent.

## Une écriture de la voix
| Procédé | Son effet |
| La **première personne** rétrospective | La sagesse de l’âge éclaire l’enfance |
| Les **proverbes** et images créoles | Le récit garde la saveur de la **parole** |
| Le **merveilleux** (Man Cia, les esprits) | Il appartient au monde des personnages, sans être expliqué |
| Les **phrases amples et rythmées** | Le roman se lit comme un **chant** |

## Les axes de dissertation
| Question | Ce que l’œuvre permet de répondre |
| Le roman peut-il **transmettre une mémoire collective** ? | Oui, par une **vie singulière** qui porte celles des autres |
| La souffrance détruit-elle l’individu ? | Télumée tombe et se relève : la **résilience** est le sujet du livre |
| Pourquoi faire parler une **femme âgée** ? | Sa voix unit l’expérience, la mémoire et le **pardon** |
| Qu’apporte la **langue** au récit ? | Elle fait entendre un monde, le créole dans le français |

## Pistes pour l’entretien
Tu peux rapprocher Télumée d’autres **voix de femmes** (Colette, Annie Ernaux, Maryse Condé), des récits sur la mémoire de l’esclavage, ou de ce que ta propre famille transmet. Pense aussi à dire **ce qu’on apprend** en lisant une vie si éloignée — et si proche.

> Le roman ne pleure pas : il **célèbre** une force. C’est ce qui distingue Télumée d’une simple victime.`,
          },
          questions: [
            ['Quel est le parcours associé à l’œuvre ?', ['Dévoiler les rouages de la société', 'La célébration du monde', 'Le roman et l’invention de l’amour', 'Tisser les mémoires, habiter le monde'], 3, 'Deux gestes : relier les générations et trouver sa place dans le monde.'],
            ['Pourquoi le roman commence-t-il par la lignée des femmes ?', ['Pour retarder l’action', 'Pour montrer que Télumée est la somme des femmes qui l’ont précédée', 'Pour faire un arbre généalogique complet', 'Parce que Télumée est absente du livre'], 1, 'Le récit tisse les vies avant de raconter la sienne.'],
            ['Pourquoi Toussine est-elle appelée Reine Sans Nom ?', ['Parce qu’elle s’est relevée d’un malheur si grand qu’aucun nom ne suffisait', 'Parce qu’elle a perdu son nom au mariage', 'Parce qu’elle était reine d’Afrique', 'Parce qu’elle refusait de parler'], 0, 'Après la mort de sa fille dans un incendie, elle revient à la vie : le surnom dit une grandeur.'],
            ['Quel rôle jouent les contes racontés par Reine Sans Nom ?', ['Ils distraient seulement l’enfant', 'Ils transmettent une mémoire orale et une manière de vivre', 'Ils annoncent la mort d’Elie', 'Ils sont traduits du français'], 1, 'La parole est un héritage : on apprend à vivre en écoutant.'],
            ['Quelle image revient pour dire la force des femmes du roman ?', ['L’oiseau qui s’envole', 'La femme qui tient debout, que le vent ne couche pas', 'Le fleuve en crue', 'La reine sur son trône'], 1, 'Tenir debout, dans la joie comme dans le malheur : c’est la leçon de Reine Sans Nom.'],
            ['Comment Télumée répond-elle au mépris des Desaragne ?', ['Par la violence', 'En quittant l’île', 'En se soumettant entièrement', 'En gardant sa dignité intérieure'], 3, 'On peut être pauvre sans être abaissé : c’est ce que sa grand-mère lui a transmis.'],
            ['Quel geste final vaut à Télumée son surnom ?', ['Elle retrouve Elie', 'Elle devient propriétaire', 'Elle accompagne jusqu’à la mort un homme qui lui voulait du mal', 'Elle écrit ses mémoires'], 2, 'Le pardon est une façon d’habiter le monde sans laisser la haine l’emporter.'],
            ['Quel est l’effet de la narration à la première personne rétrospective ?', ['La sagesse de l’âge éclaire le récit de l’enfance', 'Le lecteur ignore la fin', 'Le récit devient impersonnel', 'Elle supprime toute émotion'], 0, 'La vieille femme relit sa vie : le récit est à la fois témoignage et méditation.'],
            ['Comment le merveilleux est-il traité dans le roman ?', ['Il est expliqué scientifiquement', 'Il est tourné en ridicule', 'Il appartient au monde des personnages, sans être expliqué', 'Il est absent'], 2, 'Man Cia et les esprits font partie du réel des personnages.'],
            ['Le roman présente Télumée comme une simple victime de la misère.', ['Vrai', 'Faux'], 1, 'Elle subit, mais se relève : le livre célèbre une force, il ne s’apitoie pas.'],
            ['Qu’illustre la mort d’Amboise ?', ['Une querelle amoureuse', 'La lutte collective des travailleurs de la canne pour leur dignité', 'Un accident de mer', 'Une vengeance de Man Cia'], 1, 'L’histoire individuelle rejoint l’histoire sociale des plantations.'],
            ['Que signifie « habiter le monde » dans ce parcours ?', ['Voyager beaucoup', 'Trouver sa place et sa dignité dans un monde qui ne vous a pas été donné', 'Posséder une maison', 'Quitter son pays natal'], 1, 'Télumée habite son jardin, son île et sa vie en refusant d’être détruite.'],
          ],
        },
      ],
    },
  ],
}
