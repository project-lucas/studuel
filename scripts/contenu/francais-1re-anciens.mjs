// Français — PREMIÈRE : le chapitre « Anciens programmes » du rayon Programme.
//
// SUITE DE `francais-1re.mjs`, et séparée de lui pour une seule raison : les
// 58 fiches réunies produisaient une migration de 339 Ko, au-delà des ~300 Ko
// que l'éditeur SQL de Supabase tient sans devenir poussif — et un script à
// moitié collé est pire qu'un script absent. La coupe suit la seule ligne qui
// ait un sens : les quatre objets d'étude AU PROGRAMME d'un côté (259), les
// œuvres SORTIES du programme de l'autre (260).
//
// Ces trente fiches ne sont pas un fonds d'archive : les œuvres des programmes
// précédents restent au menu des devoirs, des concours blancs, des secondes
// chances et des professeurs qui gardent leur descriptif d'une année sur
// l'autre. Elles portent le chapitre « Anciens programmes », qui les range
// derrière les quatre objets d'étude sans les mêler à eux.
//
// LES POSITIONS COMMENCENT À 19 (`positionDepart`) : les 18 fiches des quatre
// objets d'étude occupent 1 à 18 dans la 259. Repartir de 1 mêlerait les deux
// migrations dans un ordre indéfini — la page matière trie par `position`.
//
// AUCUN MÉNAGE ICI : il est joué par la 259, qui doit donc être exécutée
// AVANT celle-ci. Ce module n'écrit que des fiches neuves.

export default {
  slug: 'francais',
  nom: 'Français',

  titreMigration: 'FRANÇAIS 1re — LES ŒUVRES DES ANCIENS PROGRAMMES',

  motif: `SUITE DE LA 259, et séparée d'elle pour une raison de taille de fichier :
les 58 fiches du français de première produisaient une migration de 339 Ko,
au-delà des ~300 Ko que l'éditeur SQL de Supabase tient sans devenir poussif.
La coupe suit la seule ligne qui ait un sens : les quatre objets d'étude au
programme dans la 259, les œuvres sorties du programme ici.

Ces 30 fiches couvrent les œuvres des programmes précédents — Phèdre, Le
Mariage de Figaro, Oh les beaux jours !, les Essais, les Fables, les Lettres
persanes, La Princesse de Clèves, Le Rouge et le Noir, Mémoires d'Hadrien, Les
Contemplations, Les Fleurs du mal, Alcools, Le Malade imaginaire, Les Fausses
Confidences, Juste la fin du monde, Gargantua, Les Caractères, la Déclaration
des droits de la femme et de la citoyenne — plus deux fiches de notion (le
Nouveau Roman, le langage poétique comme source de modernité). Elles restent
au menu des devoirs, des concours blancs et des descriptifs d'oral.

⚠️ ORDRE D'EXÉCUTION : la 259 D'ABORD. C'est elle qui pose les colonnes
theme et discipline, et qui retire les 5 fiches composites. Cette
migration-ci n'écrit que des fiches neuves, et ses positions démarrent à 19,
derrière les 18 fiches des quatre objets d'étude.`,

  blocs: [
    {
      niveaux: ['1re'],
      rayon: 'programme',
      positionDepart: 19,
      chapitres: [
        // ===================================================================
        // Chapitre 5 — Anciens programmes
        // Les œuvres sorties du programme en cours, qui restent au menu des
        // devoirs, des concours blancs et des secondes chances.
        // ===================================================================
        {
          titre: 'Phèdre',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Racine, 1677 — la passion comme maladie',
            cours: `Tragédie en **cinq actes et en vers**, créée en **1677**. Parcours souvent associé : **passion et tragédie**.

## L’intrigue
**Thésée**, roi d’Athènes, est réputé mort. Son épouse **Phèdre**, fille de Minos et de Pasiphaé, avoue alors à sa nourrice **Œnone** l’amour coupable qu’elle éprouve pour **Hippolyte**, le fils que Thésée a eu d’une Amazone. Hippolyte, lui, aime **Aricie**, princesse d’une famille ennemie. Phèdre déclare sa flamme à Hippolyte, qui la repousse avec horreur.
Thésée reparaît : il n’était pas mort. Œnone, pour sauver sa maîtresse, accuse Hippolyte d’avoir voulu séduire Phèdre. Thésée maudit son fils et appelle sur lui la vengeance de **Neptune**. Un monstre marin surgi des flots tue Hippolyte ; **Théramène** en fait le récit. Phèdre, après avoir avoué la vérité, meurt empoisonnée.

## La fatalité
Phèdre est petite-fille du **Soleil** et fille de Pasiphaé : le sang, les dieux et l’hérédité pèsent sur elle. **Vénus** la persécute — « C’est Vénus tout entière à sa proie attachée ». Racine peint la passion comme une **maladie subie**, non comme un choix : la culpabilité et l’innocence y sont inséparables, ce que la lecture janséniste de la pièce a souligné.

## L’art racinien
Unité de lieu, de temps et d’action ; **bienséance** (la mort d’Hippolyte est racontée, jamais montrée) ; alexandrins d’une simplicité extrême, avec un vocabulaire restreint mais des images fixes (le feu, le sang, le jour, l’ombre). Les grandes scènes sont des **aveux** : à Œnone, à Hippolyte, à Thésée. La pièce avance par la parole qui échappe.`,
          },
          questions: [
            ['De qui Phèdre est-elle amoureuse ?', ['D’Hippolyte, le fils de son époux Thésée', 'De Thésée', 'De Théramène', 'D’Aricie'], 0, 'Cet amour est coupable, et il est le nœud de la tragédie.'],
            ['Qui accuse Hippolyte auprès de Thésée ?', ['Œnone, la nourrice de Phèdre', 'Phèdre elle-même', 'Aricie', 'Théramène'], 0, 'Elle ment pour sauver sa maîtresse : le mensonge déclenche la catastrophe.'],
            ['Comment Hippolyte meurt-il ?', ['Tué par un monstre marin envoyé par Neptune', 'Empoisonné par Phèdre', 'En duel contre Thésée', 'Exilé, il meurt de chagrin'], 0, 'La scène est racontée par Théramène : la bienséance interdit de la montrer.'],
            ['Quelle divinité poursuit Phèdre ?', ['Vénus', 'Junon', 'Diane', 'Minerve'], 0, '« C’est Vénus tout entière à sa proie attachée. »'],
            ['Qui Hippolyte aime-t-il ?', ['Aricie', 'Phèdre', 'Œnone', 'Personne'], 0, 'Elle appartient à une famille ennemie de Thésée : cet amour est lui aussi interdit.'],
            ['En quelle année la pièce est-elle créée ?', ['1677', '1667', '1637', '1694'], 0, 'C’est la dernière tragédie profane de Racine.'],
            ['Racine présente la passion comme un choix libre de Phèdre.', ['Vrai', 'Faux'], 1, 'Elle est une maladie subie, imposée par les dieux et l’hérédité : culpabilité et innocence y sont inséparables.'],
            ['Quelle forme prennent les grandes scènes de la pièce ?', ['Des aveux successifs', 'Des combats', 'Des monologues comiques', 'Des scènes de foule'], 0, 'À Œnone, à Hippolyte, à Thésée : la pièce avance par la parole qui échappe.'],
          ],
        },
        {
          titre: 'Le Mariage de Figaro',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Beaumarchais, 1784 — la folle journée d’un valet',
            cours: `*La Folle Journée ou Le Mariage de Figaro*, comédie en **cinq actes**, créée en **1784** après trois ans d’interdiction par Louis XVI. Parcours souvent associé : **la comédie du valet**.

## L’intrigue
Au château d’Aguas-Frescas, **Figaro**, valet du **comte Almaviva**, doit épouser **Suzanne**, camériste de la comtesse. Mais le comte, lassé de son mariage, veut faire valoir sur Suzanne un « droit du seigneur » qu’il a pourtant aboli. Toute la journée, Figaro, Suzanne et la **comtesse Rosine** déjouent ses manœuvres : billets truqués, rendez-vous piégé, déguisements dans le jardin. S’y ajoutent le page **Chérubin**, amoureux de toutes les femmes du château, et un procès burlesque où **Marceline**, qui réclamait Figaro en mariage, découvre qu’elle est **sa mère**.
Le soir, dans le jardin, le comte courtise sa propre femme déguisée en Suzanne. Démasqué, il demande pardon. Le mariage a lieu.

## Le valet devient maître du jeu
Figaro n’est pas un valet de comédie ordinaire : il **conduit** l’intrigue, raisonne, écrit, argumente. Son **monologue de l’acte V** est un des textes politiques les plus célèbres du siècle : il y reproche au comte de s’être « donné la peine de naître, et rien de plus », et dresse le bilan d’une vie d’homme sans naissance ni protection.

## Un texte politique
Privilèges, censure, justice vénale, condition des femmes (la tirade de Marceline) : la pièce attaque tout l’édifice de l’Ancien Régime, cinq ans avant 1789. Louis XVI l’avait bien vu — « il faudrait détruire la Bastille pour que la représentation de cette pièce ne fût pas une inconséquence dangereuse ».

## Le rythme
Cinq actes, une seule journée, des dizaines de rebondissements : quiproquos, cachettes (le fauteuil, le cabinet, les marronniers), déguisements. Beaumarchais mêle **comique de situation** et **satire**, et donne à chaque personnage une langue propre.`,
          },
          questions: [
            ['Qui Figaro veut-il épouser ?', ['Suzanne, camériste de la comtesse', 'Marceline', 'La comtesse Rosine', 'Fanchette'], 0, 'Le comte veut faire valoir sur elle un droit qu’il avait pourtant aboli.'],
            ['Que découvre-t-on au cours du procès burlesque ?', ['Marceline est la mère de Figaro', 'Figaro est le fils du comte', 'Suzanne est déjà mariée', 'Chérubin est un imposteur'], 0, 'Le coup de théâtre transforme la créancière en mère.'],
            ['Quel reproche Figaro adresse-t-il au comte dans son monologue ?', ['De s’être donné la peine de naître, et rien de plus', 'De ne pas savoir se battre', 'D’avoir ruiné le château', 'De ne pas aimer sa femme'], 0, 'C’est l’un des textes politiques les plus célèbres du XVIIIe siècle.'],
            ['Combien de temps dure l’action de la pièce ?', ['Une seule journée', 'Une semaine', 'Un mois', 'Trois jours'], 0, 'D’où le titre : La Folle Journée.'],
            ['Qui est Chérubin ?', ['Un jeune page amoureux de toutes les femmes du château', 'Le frère de Suzanne', 'Le juge du procès', 'Le jardinier'], 0, 'Son personnage est un ressort comique constant et une provocation pour le comte.'],
            ['En quelle année la pièce est-elle enfin créée ?', ['1784', '1775', '1789', '1762'], 0, 'Après trois ans d’interdiction par Louis XVI.'],
            ['La pièce se contente de faire rire, sans portée politique.', ['Vrai', 'Faux'], 1, 'Privilèges, censure, justice vénale, condition des femmes : elle attaque l’Ancien Régime cinq ans avant 1789.'],
            ['Comment se termine la pièce ?', ['Le comte, démasqué, demande pardon et le mariage a lieu', 'Le comte chasse Figaro', 'Suzanne épouse le comte', 'Figaro quitte le château'], 0, 'La comtesse déguisée en Suzanne a piégé son mari dans le jardin.'],
          ],
        },
        {
          titre: 'Le Mariage de Figaro - Partie 2',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Beaumarchais — ce que dit le valet quand il parle seul',
            cours: `Cette seconde partie prend la pièce par son **parcours** : la comédie du valet. Le type est ancien ; ce que Beaumarchais en fait est neuf.

## Une histoire du valet de théâtre
Chez **Plaute** et **Molière**, le valet est un adjuvant : il sert la ruse du maître ou de l’amoureux (Scapin, Sganarelle, Dubois). Chez **Marivaux**, il commence à parler d’égal à égal, notamment dans *L’Île des esclaves*. Chez Beaumarchais, il **prend la place du protagoniste** : c’est lui qui a le titre, l’initiative, le monologue et la dernière chanson.

## Le monologue de l’acte V
Seul dans le noir, Figaro fait le bilan d’une vie : enfant trouvé, chirurgien, auteur dramatique censuré, journaliste interdit, joueur, banquier ruiné, barbier. Le morceau est unique par sa **longueur** (le plus long monologue du théâtre français classique), par son **ton** — de la colère à la mélancolie — et par son objet : la **naissance**, seule différence entre lui et le comte.

## L’égalité en actes, pas en discours
La pièce ne se contente pas d’affirmer l’égalité, elle la **met en scène** : Suzanne mène le comte par le bout du nez, la comtesse s’allie à sa servante contre son mari, Marceline dénonce le sort réservé aux femmes séduites puis abandonnées. Le renversement est social et il est aussi **féminin** : ce sont les femmes qui organisent le piège final.

## Les procédés du comique
**Quiproquos** en cascade, **cachettes** (le fauteuil de l’acte I, le cabinet de l’acte II, les marronniers de l’acte V), **déguisements**, **apartés**, **jeu sur les objets** (le ruban, l’épingle, le billet). Beaumarchais accélère sans cesse : l’acte V, dans l’obscurité du jardin, est un chef-d’œuvre de mécanique théâtrale.

## Les axes de dissertation
- **Le rire peut-il être une arme politique ?**
- **Le valet est-il vraiment libre à la fin de la pièce ?** Il se marie, mais reste au service du comte.
- **La comédie peut-elle changer la société ?** Beaumarchais l’a cru, et la Révolution a suivi de peu.
- **Qui mène réellement l’intrigue ?** Figaro échoue souvent ; ce sont Suzanne et la comtesse qui gagnent.`,
          },
          questions: [
            ['Quelle est la nouveauté du personnage de Figaro par rapport aux valets de Molière ?', ['Il devient le protagoniste, avec le titre et l’initiative', 'Il est plus comique', 'Il ne parle jamais de sa condition', 'Il est le confident du maître seulement'], 0, 'Chez Molière, le valet sert la ruse d’un autre ; ici, il conduit la pièce.'],
            ['Que raconte Figaro dans son monologue de l’acte V ?', ['Le bilan de sa vie et l’injustice de la naissance', 'Ses projets de mariage', 'La généalogie du comte', 'Un conte pour endormir Suzanne'], 0, 'C’est le plus long monologue du théâtre français classique.'],
            ['Qui organise le piège final dans le jardin ?', ['Suzanne et la comtesse', 'Figaro seul', 'Le comte', 'Chérubin'], 0, 'Le renversement est social et féminin : ce sont les femmes qui gagnent.'],
            ['Quel personnage dénonce le sort fait aux femmes séduites puis abandonnées ?', ['Marceline', 'Suzanne', 'Fanchette', 'La comtesse'], 0, 'Sa tirade est l’un des passages les plus audacieux de la pièce.'],
            ['Quels objets servent de ressorts comiques ?', ['Le ruban, l’épingle et le billet', 'Une épée et un bouclier', 'Un miroir et une bougie', 'Un livre et une clé'], 0, 'Beaumarchais fait tourner des scènes entières autour de menus objets.'],
            ['Quelle pièce de Marivaux annonce ce renversement maître-valet ?', ['L’Île des esclaves', 'Le Jeu de l’amour et du hasard', 'Les Fausses Confidences', 'La Double Inconstance'], 0, 'Marivaux y inverse explicitement les conditions.'],
            ['À la fin de la pièce, Figaro cesse d’être au service du comte.', ['Vrai', 'Faux'], 1, 'Il se marie, mais reste valet : l’égalité est gagnée dans le rire, pas dans les faits.'],
            ['Où se déroule l’acte V ?', ['Dans le jardin, la nuit', 'Dans la chambre de la comtesse', 'Au tribunal', 'Dans l’antichambre du comte'], 0, 'L’obscurité rend possibles les échanges d’identité qui piègent le comte.'],
          ],
        },
        {
          titre: 'Oh, les beaux jours !',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Beckett, 1963 — une femme enterrée qui trouve la journée belle',
            cours: `Pièce en **deux actes** de **Samuel Beckett**, créée en anglais en 1961 (*Happy Days*) et en français en **1963**. Parcours souvent associé : **un théâtre de la condition humaine**.

## Le dispositif
**Winnie**, une femme d’une cinquantaine d’années, est **enterrée jusqu’à la taille** dans un mamelon de terre desséchée, sous une lumière aveuglante. Elle parle presque sans arrêt. Derrière le mamelon, son mari **Willie** rampe, lit son journal, répond par monosyllabes ou ne répond pas.
**Acte II** : Winnie est enterrée **jusqu’au cou**. Elle ne peut plus bouger la tête, ni atteindre son sac. Elle continue de parler.

## Ce qui remplace l’intrigue
Rien n’arrive. La pièce est faite de **rituels** : la sonnerie qui réveille, la prière, la brosse à dents, le peigne, le revolver dans le sac, les citations à moitié oubliées de la littérature anglaise, l’espoir que Willie réponde. Winnie répète : « Encore un jour divin », « Oh, le beau jour que ça aura été ». Cette formule, prononcée depuis la terre qui l’engloutit, est le cœur ironique du texte.

## Comique et tragique
La situation est atroce, le jeu est **comique** : Beckett vient du burlesque, il commande des gestes précis, des ratés, des pauses. C’est le rire qui rend la pièce supportable et, en même temps, la rend plus cruelle. Le spectateur rit d’une femme qui disparaît.

## Ce que la pièce dit
La condition humaine y est réduite à ses données minimales : un corps qui se dégrade, un temps qui n’avance pas, un langage qui tourne à vide et qui pourtant tient debout. Winnie n’est pas une héroïne : elle est **quelqu’un qui continue**. C’est là que la pièce est bouleversante — la parole comme seule preuve d’existence.`,
          },
          questions: [
            ['Dans quelle situation Winnie se trouve-t-elle à l’acte I ?', ['Enterrée jusqu’à la taille dans un mamelon de terre', 'Assise sur un banc', 'Enfermée dans une chambre', 'Debout sur une scène nue'], 0, 'À l’acte II, elle est enterrée jusqu’au cou.'],
            ['Qui est Willie ?', ['Le mari de Winnie, presque muet, qui rampe derrière le mamelon', 'Son fils', 'Un passant', 'Le narrateur de la pièce'], 0, 'Il répond par monosyllabes, quand il répond.'],
            ['Que fait Winnie pendant toute la pièce ?', ['Elle parle presque sans interruption', 'Elle tente de s’échapper', 'Elle dort', 'Elle écrit une lettre'], 0, 'La parole est sa seule preuve d’existence.'],
            ['Quelle phrase Winnie répète-t-elle ?', ['« Oh, le beau jour que ça aura été »', '« Rien à faire »', '« Demain sera meilleur »', '« Je ne peux plus continuer »'], 0, 'Prononcée depuis la terre qui l’engloutit, la formule est le cœur ironique du texte.'],
            ['Quel objet inquiétant se trouve dans le sac de Winnie ?', ['Un revolver', 'Un couteau', 'Une lettre d’adieu', 'Un miroir brisé'], 0, 'Il reste là, jamais utilisé : la menace est permanente et sans effet.'],
            ['Quel registre Beckett mêle-t-il au tragique de la situation ?', ['Le comique, hérité du burlesque', 'Le lyrisme romantique', 'Le registre épique', 'Le registre polémique'], 0, 'Le spectateur rit d’une femme qui disparaît : c’est ce qui rend la pièce plus cruelle encore.'],
            ['La pièce comporte une intrigue avec des rebondissements.', ['Vrai', 'Faux'], 1, 'Rien n’arrive : la pièce est faite de rituels répétés et d’un enlisement.'],
            ['Sous quel titre la pièce a-t-elle d’abord été créée ?', ['Happy Days, en anglais', 'Fin de partie', 'En attendant Godot', 'Not I'], 0, 'Beckett écrivait dans les deux langues et traduisait lui-même ses pièces.'],
          ],
        },
        {
          titre: 'Oh, les beaux jours ! - Partie 2',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Beckett — le théâtre quand il ne reste que la parole',
            cours: `Cette seconde partie travaille le **parcours** : un théâtre de la condition humaine. La pièce est un cas limite — elle enlève au théâtre presque tout ce qui le définissait.

## Ce que Beckett retire
Pas d’**intrigue** : rien ne se noue ni ne se dénoue. Pas de **personnage** au sens psychologique : on ignore le passé de Winnie, sa profession, son histoire. Pas d’**espace** vraisemblable : un mamelon, une lumière crue, un ciel vide. Pas de **temps** : la sonnerie règle un jour qui recommence. Ce qui reste — et c’est le sujet — c’est une **voix** qui refuse de s’arrêter.

## Le corps et le langage
Le mouvement de la pièce est simple et implacable : le **corps** disparaît, le **langage** continue. À l’acte II, Winnie ne peut plus utiliser ses mains, ses objets, ses rituels ; il ne lui reste que la parole et le souvenir. La pièce démontre ainsi que l’humain tient moins à ce qu’il peut faire qu’à ce qu’il peut encore dire — et qu’il tient à cela jusqu’au bout.

## L’optimisme comme héroïsme
« Encore un jour divin. » Winnie s’accroche aux petites choses : une brosse à dents dont l’inscription s’efface, un souvenir de bal, une citation à moitié perdue. Ce n’est ni de la naïveté ni de l’aveuglement : c’est une **stratégie de survie**, et la pièce la traite avec un mélange de tendresse et d’ironie qui interdit de trancher.

## Le rôle des didascalies
Beckett écrit des indications d’une précision extrême : durée exacte des pauses, direction du regard, gestes comptés. Le texte est aussi une **partition de mise en scène**, et il refuse au metteur en scène la liberté d’interpréter — ce qui a valu à l’auteur plusieurs procès célèbres.

## Les axes de dissertation
- **Peut-on faire du théâtre sans action ?** La pièce répond que la parole est l’action.
- **Le rire est-il compatible avec le désespoir ?** Chez Beckett, ils sont indissociables.
- **Winnie est-elle courageuse ou aveugle ?** Le texte ne tranche pas, et c’est ce qui le rend fort.
- **Que reste-t-il de l’humain quand tout est ôté ?** Une voix, une adresse à l’autre, un rituel.`,
          },
          questions: [
            ['Que reste-t-il à Winnie à l’acte II ?', ['La parole et le souvenir', 'Ses objets', 'La possibilité de bouger', 'La compagnie de Willie'], 0, 'Le corps disparaît, le langage continue : c’est le mouvement de la pièce.'],
            ['Que retire Beckett au théâtre traditionnel ?', ['L’intrigue, la psychologie, l’espace vraisemblable et le temps', 'Seulement le décor', 'Uniquement les didascalies', 'Le dialogue'], 0, 'Ce qui reste est une voix qui refuse de s’arrêter.'],
            ['Comment interpréter l’optimisme répété de Winnie ?', ['Comme une stratégie de survie, ni naïve ni aveugle', 'Comme une ironie pure', 'Comme un signe de folie clinique', 'Comme une croyance religieuse'], 0, 'La pièce refuse de trancher, et c’est ce qui la rend forte.'],
            ['Quelle particularité les didascalies de Beckett présentent-elles ?', ['Une précision extrême, jusqu’à la durée des pauses', 'Elles sont absentes', 'Elles sont écrites en vers', 'Elles laissent toute liberté au metteur en scène'], 0, 'Le texte est aussi une partition de mise en scène.'],
            ['Quel objet du quotidien accompagne les rituels de Winnie ?', ['Une brosse à dents dont l’inscription s’efface', 'Un chapelet', 'Une montre arrêtée', 'Un carnet'], 0, 'Le détail minuscule porte le temps qui use tout.'],
            ['Que règle la sonnerie dans la pièce ?', ['Le réveil et le coucher, dans un jour qui recommence', 'Les entrées de Willie', 'Les changements d’acte', 'La fin de la représentation'], 0, 'Elle remplace le temps par une contrainte mécanique.'],
            ['Chez Beckett, le rire et le désespoir s’excluent.', ['Vrai', 'Faux'], 1, 'Ils sont indissociables : c’est le rire qui rend la cruauté supportable, et plus aiguë.'],
            ['Que démontre la pièce sur ce qui définit l’humain ?', ['Il tient à ce qu’il peut encore dire, plus qu’à ce qu’il peut faire', 'Il tient à son travail', 'Il tient à sa mémoire familiale', 'Il tient à sa liberté de mouvement'], 0, 'La voix, l’adresse à l’autre et le rituel sont ce qui subsiste.'],
          ],
        },
        {
          titre: 'Essais',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Montaigne — « Des Cannibales », « Des Coches »',
            cours: `Les *Essais* de **Michel de Montaigne** paraissent à partir de **1580** et sont augmentés jusqu’à sa mort (1592). Le programme retient les chapitres **« Des Cannibales »** (I, 31) et **« Des Coches »** (III, 6), avec le parcours : **notre monde vient d’en trouver un autre**.

## Un genre inventé
« Essai » veut dire **tentative**, pesée, mise à l’épreuve. Montaigne n’écrit pas un traité : il pense en avançant, se contredit, revient, cite, digresse. « Je ne peins pas l’être, je peins le passage. » Le sujet du livre, dit-il dès l’avis au lecteur, c’est **lui-même** — mais un lui-même qui sert d’instrument pour examiner l’homme en général.

## Des Cannibales
Montaigne a rencontré à Rouen des **Tupinambas** du Brésil, amenés en France. Il compare leurs mœurs aux nôtres et renverse le jugement : ils pratiquent l’anthropophagie rituelle sur un ennemi mort, quand les Européens torturent des vivants au nom de la religion. « **Chacun appelle barbarie ce qui n’est pas de son usage.** » Le mot **barbare** cesse de désigner l’autre : il désigne le jugement de celui qui le prononce.

## Des Coches
Le chapitre glisse des dépenses somptuaires des princes à la **conquête du Nouveau Monde**. Montaigne y dénonce sans détour la destruction des civilisations américaines : « tant de villes rasées, tant de nations exterminées ». Il souligne l’écart entre la supériorité technique des conquérants et leur infériorité morale, et regrette que cette rencontre, qui aurait pu être un échange, ait été un massacre.

## L’écriture
Phrase longue, mobile, nourrie de **citations antiques**, d’**anecdotes** et de comparaisons concrètes. L’ironie y est constante mais douce ; le « je » sert à relativiser plutôt qu’à s’exposer. C’est le premier grand texte européen à retourner le regard ethnographique contre l’Europe elle-même.`,
          },
          questions: [
            ['Que signifie le mot « essai » chez Montaigne ?', ['Une tentative, une mise à l’épreuve de la pensée', 'Un traité systématique', 'Une autobiographie complète', 'Un discours de circonstance'], 0, '« Je ne peins pas l’être, je peins le passage. »'],
            ['Quel peuple Montaigne a-t-il rencontré à Rouen ?', ['Des Tupinambas du Brésil', 'Des Aztèques du Mexique', 'Des Incas du Pérou', 'Des Iroquois du Canada'], 0, 'Cette rencontre nourrit directement « Des Cannibales ».'],
            ['Quelle est la thèse célèbre de « Des Cannibales » ?', ['Chacun appelle barbarie ce qui n’est pas de son usage', 'Les cannibales sont des sauvages sans loi', 'La civilisation européenne est un modèle', 'Il faut convertir les peuples nouveaux'], 0, 'Le mot « barbare » désigne le jugement de celui qui le prononce.'],
            ['Que dénonce Montaigne dans « Des Coches » ?', ['La destruction des civilisations du Nouveau Monde par la conquête', 'Le luxe des carrosses seulement', 'La faiblesse militaire de la France', 'Les guerres de religion en Allemagne'], 0, '« Tant de villes rasées, tant de nations exterminées. »'],
            ['Quel écart Montaigne souligne-t-il chez les conquérants ?', ['Une supériorité technique doublée d’une infériorité morale', 'Une supériorité militaire et morale', 'Une infériorité technique', 'Une égalité parfaite avec les Amérindiens'], 0, 'La rencontre aurait pu être un échange ; elle a été un massacre.'],
            ['À partir de quelle année les Essais paraissent-ils ?', ['1580', '1532', '1610', '1550'], 0, 'Montaigne les augmente ensuite jusqu’à sa mort en 1592.'],
            ['Montaigne écrit un traité systématique avec un plan rigoureux.', ['Vrai', 'Faux'], 1, 'Il pense en avançant : digressions, contradictions et reprises font partie de la méthode.'],
            ['Quel usage Montaigne fait-il du « je » ?', ['Il s’examine lui-même pour examiner l’homme en général', 'Il raconte sa carrière politique', 'Il défend sa réputation', 'Il évite d’en parler'], 0, 'Le sujet du livre, dit l’avis au lecteur, c’est lui-même — comme instrument de connaissance.'],
          ],
        },
        {
          titre: 'Essais - Partie 2',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Montaigne — le relativisme et ses limites',
            cours: `Cette seconde partie prend les *Essais* par leur **parcours** : notre monde vient d’en trouver un autre. La formule est de Montaigne lui-même, dans « Des Coches ».

## Le choc de la découverte
En 1492, l’Europe apprend qu’il existe un continent que ni la Bible, ni Aristote, ni Ptolémée n’avaient prévu. Ce fait seul ébranle l’autorité des **Anciens** : si l’on a pu ignorer un monde entier, que vaut le reste de nos certitudes ? Montaigne en tire une **méthode** : le doute, non par scepticisme paresseux, mais comme discipline de la pensée. Sa devise est une question : « **Que sais-je ?** »

## Le relativisme culturel
Montaigne applique le doute aux **coutumes**. Ce que nous appelons nature n’est souvent que l’habitude, et ce que nous appelons barbarie n’est que l’usage d’un autre. Attention cependant : il ne dit pas que tout se vaut. Il juge — il condamne fermement la torture, l’avidité, la cruauté des conquérants. Le relativisme est chez lui un **instrument critique**, pas une démission morale.

## Le mythe du bon sauvage, avant Rousseau
La description des Tupinambas — société sans commerce, sans écriture, sans magistrature, sans propriété — est idéalisée, et Montaigne le sait à demi. Elle sert d’**utopie critique** : elle rend visibles, par contraste, les vices de la société française déchirée par les **guerres de religion**. C’est un miroir tendu à l’Europe, pas une ethnographie.

## L’écriture comme mouvement
Digressions assumées, ajouts d’une édition à l’autre (les fameuses « allongeails »), refus de conclure : la forme dit la thèse. Une pensée honnête est une pensée qui **bouge**.

## Les axes de dissertation
- **La rencontre de l’autre nous apprend-elle davantage sur lui ou sur nous ?**
- **Le relativisme empêche-t-il de juger ?** Chez Montaigne, non : il déplace le tribunal.
- **L’essai est-il un genre argumentatif ?** Oui, mais qui persuade en montrant la pensée au travail.
- **Peut-on écrire sur soi sans vanité ?** L’avis au lecteur pose la question dès la première page.`,
          },
          questions: [
            ['Quelle est la devise de Montaigne ?', ['« Que sais-je ? »', '« Je pense donc je suis »', '« Connais-toi toi-même »', '« Rien de trop »'], 0, 'Le doute y est une discipline de la pensée, non une paresse.'],
            ['Quel événement ébranle l’autorité des Anciens au XVIe siècle ?', ['La découverte d’un continent qu’aucun savoir n’avait prévu', 'L’invention de l’imprimerie', 'La chute de Constantinople', 'La Réforme protestante'], 0, 'Si l’on a pu ignorer un monde entier, que valent nos autres certitudes ?'],
            ['Le relativisme de Montaigne l’empêche-t-il de juger ?', ['Non : il condamne fermement la torture et la cruauté', 'Oui, il refuse tout jugement', 'Oui, il juge toutes les cultures équivalentes', 'Non, mais il ne juge que les peuples lointains'], 0, 'Le relativisme est un instrument critique, pas une démission morale.'],
            ['À quoi sert la description idéalisée des Tupinambas ?', ['À faire voir par contraste les vices de la société française', 'À encourager la colonisation', 'À prouver leur infériorité', 'À écrire un traité d’ethnographie'], 0, 'C’est une utopie critique, un miroir tendu à l’Europe des guerres de religion.'],
            ['Comment nomme-t-on les ajouts successifs de Montaigne à son texte ?', ['Les allongeails', 'Les gloses', 'Les scolies', 'Les apostilles'], 0, 'Le livre grossit d’édition en édition : la forme dit la thèse.'],
            ['Quel contexte français éclaire les Essais ?', ['Les guerres de religion', 'La Fronde', 'La Révolution', 'La guerre de Cent Ans'], 0, 'La violence intérieure du royaume rend la leçon de tolérance urgente.'],
            ['Montaigne conclut chacun de ses chapitres par une thèse ferme.', ['Vrai', 'Faux'], 1, 'Le refus de conclure fait partie de sa méthode : une pensée honnête bouge.'],
            ['Dans quel chapitre se trouve la formule « notre monde vient d’en trouver un autre » ?', ['Des Coches', 'Des Cannibales', 'De l’amitié', 'De l’institution des enfants'], 0, 'Elle ouvre la réflexion sur la conquête du Nouveau Monde.'],
          ],
        },
        {
          titre: 'Fables',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'La Fontaine, livres VII à XI — plaire pour instruire',
            cours: `Le programme retient les **livres VII à XI** des *Fables* de **Jean de La Fontaine**, publiés à partir de **1678** (le premier recueil, livres I à VI, datait de 1668). Parcours souvent associé : **imagination et pensée au XVIIe siècle**.

## Une forme brève et savante
La fable emprunte à **Ésope** et à **Phèdre**, mais La Fontaine en fait un art : **vers libres** — alternance d’alexandrins et d’octosyllabes qui épouse le rythme du récit —, dialogues, changements de ton, chute nette. Le principe est annoncé : « **Une morale nue apporte de l’ennui : le conte fait passer le précepte avec lui.** »

## Ce que contiennent les livres VII à XI
Le second recueil est plus sombre, plus philosophique, souvent adressé à la cour. On y trouve « Les Animaux malades de la peste », « Le Coche et la Mouche », « La Laitière et le Pot au lait », « Le Curé et le Mort », « Le Savetier et le Financier », « Les Deux Pigeons », « Le Paysan du Danube », « Le Songe d’un habitant du Mogol », « Les Obsèques de la Lionne », « Le Chat, la Belette et le petit Lapin », « Le Loup et les Bergers ».

## Une satire de la cour
Le lion est le roi, la cour est un théâtre d’hypocrisie, la justice se règle sur la force. « Selon que vous serez puissant ou misérable, les jugements de cour vous rendront blanc ou noir » (« Les Animaux malades de la peste »). L’apologue permet de dire, sous le masque animal, ce qu’un sujet de Louis XIV ne pouvait dire en son nom.

## La morale
Elle est parfois explicite, en tête ou en fin de fable ; parfois absente, ironique, ou contredite par le récit. Le lecteur doit **conclure lui-même** — c’est la part de liberté que La Fontaine ménage, et l’une des raisons pour lesquelles ses fables ne vieillissent pas.`,
          },
          questions: [
            ['Quels livres des Fables le programme retient-il ?', ['Les livres VII à XI', 'Les livres I à VI', 'Le livre XII seul', 'Tous les livres'], 0, 'Le second recueil, plus sombre et plus philosophique que le premier.'],
            ['Quel principe La Fontaine formule-t-il sur la morale ?', ['« Une morale nue apporte de l’ennui : le conte fait passer le précepte avec lui »', '« Il faut instruire avant de plaire »', '« La fable doit être vraie »', '« Le rire corrige les mœurs »'], 0, 'Plaire est la condition de l’instruction, pas son contraire.'],
            ['Quelle fable contient le vers « Selon que vous serez puissant ou misérable… » ?', ['Les Animaux malades de la peste', 'Le Coche et la Mouche', 'Les Deux Pigeons', 'La Laitière et le Pot au lait'], 0, 'Le plus faible, l’âne, est condamné pour la faute la plus légère.'],
            ['Quelle forme métrique La Fontaine emploie-t-il ?', ['Le vers libre, alternant notamment alexandrins et octosyllabes', 'L’alexandrin exclusivement', 'La prose', 'Le sonnet'], 0, 'Le changement de mètre épouse le rythme du récit et souligne les chutes.'],
            ['À quels auteurs antiques La Fontaine emprunte-t-il ses sujets ?', ['Ésope et Phèdre', 'Homère et Virgile', 'Sénèque et Cicéron', 'Ovide et Horace'], 0, 'Il en transforme la matière par le style et l’humour.'],
            ['Quel animal représente le roi dans les fables de cour ?', ['Le lion', 'Le renard', 'Le loup', 'L’aigle'], 0, 'La cour y est peinte comme un théâtre d’hypocrisie.'],
            ['La morale est toujours explicite dans les Fables.', ['Vrai', 'Faux'], 1, 'Elle est parfois absente, ironique ou contredite par le récit : le lecteur doit conclure.'],
            ['En quelle année paraît le second recueil des Fables ?', ['1678', '1668', '1694', '1660'], 0, 'Le premier recueil, livres I à VI, datait de 1668.'],
          ],
        },
        {
          titre: 'Lettres persanes',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Montesquieu, 1721 — deux Persans à Paris',
            cours: `Roman épistolaire publié anonymement à Amsterdam en **1721** par **Montesquieu**. Parcours souvent associé : **le regard éloigné**.

## Le dispositif
Deux Persans, **Usbek** et **Rica**, quittent Ispahan et voyagent en Europe. Ils écrivent à leurs amis, à leurs eunuques, à leurs femmes restées au sérail — **161 lettres** au total, croisées, écrites par une quinzaine de correspondants. Ils découvrent Paris, la cour de Louis XIV puis la Régence, la mode, la religion, les académies, les cafés, les femmes libres de leurs mouvements.

## Le regard éloigné
Le procédé est simple et redoutable : faire décrire nos usages par quelqu’un qui ne les comprend pas. Le roi devient « un grand magicien » qui fait croire que le papier est de l’argent ; le pape, « un autre magicien » qui fait croire que trois ne font qu’un. Rica raconte l’effet produit quand on apprend qu’il est persan : « **Ah ! ah ! Monsieur est Persan ? C’est une chose bien extraordinaire ! Comment peut-on être Persan ?** »

## Deux voix, deux tons
**Rica** est jeune, gai, moqueur : il fait le portrait satirique de la société française. **Usbek** est grave : il réfléchit sur les lois, la justice, la religion, le despotisme — et c’est lui qui, sans le voir, incarne le despote dans sa propre maison.

## Le sérail, l’autre roman
Pendant que les deux voyageurs philosophent sur la liberté, les femmes d’Usbek se révoltent à Ispahan. La dernière lettre est celle de **Roxane**, qui révèle qu’elle a trahi, qu’elle s’est empoisonnée et qu’elle n’a jamais aimé son maître. La leçon est cinglante : le penseur de la liberté était un tyran chez lui. Le roman fait ainsi tenir ensemble **satire** et **tragédie**.`,
          },
          questions: [
            ['Qui sont Usbek et Rica ?', ['Deux Persans qui voyagent en Europe et écrivent des lettres', 'Deux philosophes français', 'Deux marchands vénitiens', 'Deux frères espagnols'], 0, 'Rica est moqueur, Usbek grave : deux tons pour deux fonctions.'],
            ['Quelle célèbre exclamation Rica rapporte-t-il ?', ['« Comment peut-on être Persan ? »', '« Que sais-je ? »', '« Il faut cultiver notre jardin »', '« Écrasons l’infâme »'], 0, 'L’étranger devient une curiosité : la scène retourne le regard sur les Parisiens.'],
            ['Comment Rica décrit-il le roi de France ?', ['Comme un grand magicien qui fait croire que le papier est de l’argent', 'Comme un tyran sanguinaire', 'Comme un sage philosophe', 'Comme un général invincible'], 0, 'Le pape est décrit comme un autre magicien : la naïveté feinte démasque la croyance.'],
            ['Que révèle la dernière lettre du roman ?', ['Roxane a trahi Usbek, s’est empoisonnée et ne l’a jamais aimé', 'Usbek rentre en Perse', 'Rica se marie à Paris', 'Le sérail est détruit par un incendie'], 0, 'Le penseur de la liberté était un despote chez lui : la leçon est cinglante.'],
            ['Combien de lettres compte le roman ?', ['161', '50', '300', '99'], 0, 'Elles sont écrites par une quinzaine de correspondants différents.'],
            ['En quelle année paraissent les Lettres persanes ?', ['1721', '1748', '1687', '1759'], 0, 'Publication anonyme à Amsterdam, pour échapper à la censure.'],
            ['Le roman se limite à la satire amusante de la société française.', ['Vrai', 'Faux'], 1, 'L’intrigue du sérail lui donne une dimension tragique et politique.'],
            ['Quelle période historique les Persans découvrent-ils à Paris ?', ['La fin du règne de Louis XIV puis la Régence', 'Le règne de Louis XVI', 'La Révolution', 'Le règne de Henri IV'], 0, 'Le contexte explique les pages sur la crise financière et le système de Law.'],
          ],
        },
        {
          titre: 'Lettres persanes - Partie 2',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Montesquieu — la fiction au service de la critique',
            cours: `Cette seconde partie prend l’œuvre par son **parcours** : le regard éloigné. Le procédé est devenu un classique de l’argumentation indirecte ; les *Lettres persanes* en sont le modèle.

## Pourquoi le détour est efficace
Attaquer de front la monarchie, l’Église ou la justice, en 1721, expose à la censure et à la Bastille. Le détour par l’étranger permet trois choses : **échapper à la censure** (l’auteur peut désavouer ses personnages), **dépayser le lecteur** (l’habitude ne protège plus les institutions) et **faire rire** — or ce dont on rit cesse d’être sacré.

## Ce qui est visé
La **monarchie absolue** et la vanité de la cour ; l’**Église**, ses querelles théologiques et son intolérance ; la **justice** ; la **mode** et l’inconstance parisienne ; la **démographie** et l’économie (Usbek s’interroge sur la dépopulation) ; le **fanatisme** religieux, dénoncé dans plusieurs lettres célèbres.

## L’apologue des Troglodytes
Les lettres XI à XIV forment un récit inséré : un peuple égoïste s’autodétruit, une petite communauté vertueuse prospère, puis demande un roi parce que la vertu est trop exigeante. C’est un **conte politique** au cœur du roman : il pose la question qui occupera Montesquieu toute sa vie et donnera *De l’esprit des lois* (1748) — quelles institutions rendent la liberté possible ?

## Le sérail comme laboratoire du despotisme
Le sérail n’est pas un décor exotique : c’est un **modèle réduit** du pouvoir absolu. Surveillance, eunuques, punitions, obéissance obtenue par la peur — et effondrement final. Montesquieu y montre que le despotisme, faute de lois, ne peut se maintenir que par la terreur et finit par s’écrouler.

## Les axes de dissertation
- **Le rire est-il une arme efficace contre le pouvoir ?**
- **La fiction sert-elle mieux la critique que le traité ?** Comparer avec *De l’esprit des lois*.
- **Le regard étranger est-il vraiment neutre ?** Usbek juge, et il est lui-même jugé.
- **Peut-on dénoncer le despotisme et l’exercer ?** La contradiction d’Usbek est la trouvaille du livre.`,
          },
          questions: [
            ['Pourquoi Montesquieu choisit-il la fiction du regard étranger ?', ['Pour échapper à la censure, dépayser le lecteur et faire rire', 'Parce qu’il a voyagé en Perse', 'Pour imiter les contes orientaux à la mode uniquement', 'Pour écrire un traité de géographie'], 0, 'Ce dont on rit cesse d’être sacré : le détour est une stratégie.'],
            ['Que raconte l’apologue des Troglodytes ?', ['Un peuple égoïste s’autodétruit, une communauté vertueuse prospère puis réclame un roi', 'Une guerre entre la Perse et la France', 'La fondation d’Ispahan', 'Le naufrage d’Usbek'], 0, 'C’est un conte politique inséré, qui annonce De l’esprit des lois.'],
            ['Quel ouvrage majeur Montesquieu publiera-t-il en 1748 ?', ['De l’esprit des lois', 'Le Contrat social', 'L’Encyclopédie', 'Le Dictionnaire philosophique'], 0, 'Il y systématise la question des institutions et de la liberté.'],
            ['Que représente le sérail dans l’économie du roman ?', ['Un modèle réduit du pouvoir despotique', 'Un simple décor exotique', 'Une utopie', 'Un souvenir d’enfance d’Usbek'], 0, 'Surveillance, peur, punitions, puis effondrement : le despotisme sans lois ne tient pas.'],
            ['Quelle contradiction rend Usbek passionnant ?', ['Il dénonce le despotisme tout en l’exerçant chez lui', 'Il ment sur son origine', 'Il refuse de rentrer en Perse', 'Il ne croit pas ce qu’il écrit'], 0, 'C’est la trouvaille du livre, et le sujet de dissertation le plus fréquent.'],
            ['Quelles institutions le roman vise-t-il principalement ?', ['La monarchie absolue, l’Église et la justice', 'L’armée et la marine', 'Les universités seules', 'Les corporations de métiers'], 0, 'S’y ajoutent la mode, l’économie et le fanatisme.'],
            ['Le regard de l’étranger est présenté comme parfaitement neutre.', ['Vrai', 'Faux'], 1, 'Usbek juge, se trompe et se contredit : il est lui-même objet du regard critique.'],
            ['Dans quelles lettres se trouve l’apologue des Troglodytes ?', ['Les lettres XI à XIV', 'Les lettres I à III', 'Les dernières lettres', 'La lettre unique de Roxane'], 0, 'Elles forment un récit inséré au début du recueil.'],
          ],
        },
        {
          titre: 'La Princesse de Clèves',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Madame de Lafayette, 1678 — le premier roman d’analyse',
            cours: `Publié **anonymement** en **1678**, le roman de **Marie-Madeleine de Lafayette** est considéré comme le premier grand roman d’analyse française. Parcours souvent associé : **individu, morale et société**.

## Le cadre
La cour de **Henri II**, en **1558-1559**, reconstituée avec une précision d’historienne : bals, tournois, intrigues, mariages politiques. Cette cour n’est pas un décor mais un **système** : on y est observé en permanence, on y calcule, on y ment. Le roman s’ouvre sur une formule qui donne le ton : « La magnificence et la galanterie n’ont jamais paru en France avec tant d’éclat. »

## L’intrigue
**Mademoiselle de Chartres**, seize ans, est présentée à la cour par sa mère, femme d’une rigueur morale absolue. Elle épouse sans amour le **prince de Clèves**, qui l’aime passionnément. Puis elle rencontre le **duc de Nemours** : c’est le coup de foudre, réciproque et silencieux.
Sa mère, mourante, l’avertit du danger. La princesse lutte. Vient la scène inouïe de l’**aveu** : elle avoue à son mari qu’elle aime un autre homme, sans le nommer, et lui demande de la retirer de la cour. Nemours, caché, entend tout. Rongé par la jalousie, le prince de Clèves tombe malade et **meurt**, croyant sa femme coupable.
Libre enfin, la princesse **refuse** d’épouser Nemours : elle invoque son devoir envers le mort et, surtout, la certitude que la passion de Nemours ne durerait pas. Elle se retire entre un couvent et sa maison, et meurt jeune.

## Ce que le roman invente
L’action extérieure compte moins que les **mouvements intérieurs** : hésitations, rougeurs, silences, calculs. Le narrateur entre dans les consciences et **analyse**. Le style est sobre, la phrase claire, le vocabulaire restreint : c’est le classicisme, qui juge que la vérité se dit sans ornement.

## Le refus final
Il a fait scandale dès 1678 et fait toujours débat : orgueil ? sagesse ? peur ? liberté ? Le texte laisse les quatre lectures ouvertes — et c’est ce qui en fait un des sujets de dissertation les plus fréquents du programme.`,
          },
          questions: [
            ['En quelle année et comment le roman paraît-il ?', ['En 1678, de façon anonyme', 'En 1678, signé par son autrice', 'En 1731, anonyme', 'En 1700, signé'], 0, 'L’anonymat protégeait une femme de lettres et alimentait la curiosité.'],
            ['À quelle époque se déroule l’action ?', ['À la cour de Henri II, en 1558-1559', 'Sous Louis XIV', 'Pendant la Fronde', 'Sous François Ier'], 0, 'La reconstitution historique est précise : la cour y fonctionne comme un système de surveillance.'],
            ['Qu’est-ce que la scène de l’aveu ?', ['La princesse avoue à son mari qu’elle aime un autre homme', 'Nemours déclare son amour au roi', 'La mère de la princesse avoue une faute', 'Le prince avoue une infidélité'], 0, 'Nemours, caché, entend tout : c’est le nœud du roman.'],
            ['De quoi meurt le prince de Clèves ?', ['De jalousie et de chagrin', 'Dans un tournoi', 'Assassiné', 'D’une épidémie'], 0, 'Il meurt persuadé que sa femme s’est donnée à Nemours.'],
            ['Que décide la princesse à la fin du roman ?', ['Elle refuse d’épouser Nemours et se retire', 'Elle épouse Nemours', 'Elle entre définitivement au couvent dès la mort de son mari', 'Elle quitte la France'], 0, 'Devoir envers le mort, mais aussi certitude que la passion ne durerait pas.'],
            ['Qu’est-ce qui fait la nouveauté du roman ?', ['L’analyse des mouvements intérieurs plutôt que l’action extérieure', 'Le récit à la première personne', 'Le mélange des genres', 'La longueur des descriptions'], 0, 'C’est pour cela qu’on parle du premier roman d’analyse.'],
            ['Le refus final de la princesse est unanimement interprété comme de la vertu.', ['Vrai', 'Faux'], 1, 'Orgueil, sagesse, peur ou liberté : le texte laisse les lectures ouvertes.'],
            ['Quel personnage met la princesse en garde contre la passion ?', ['Sa mère, Madame de Chartres', 'Le roi', 'La reine dauphine', 'Le vidame de Chartres'], 0, 'Son avertissement, prononcé sur son lit de mort, pèse sur tout le roman.'],
          ],
        },
        {
          titre: 'Le Rouge et le Noir',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Stendhal, 1830 — l’ascension et la chute de Julien Sorel',
            cours: `Sous-titré **« Chronique de 1830 »**, le roman de **Stendhal** paraît la même année que la révolution de Juillet. Parcours souvent associé : **le personnage de roman, esthétiques et valeurs**.

## Le titre
Deux couleurs, deux carrières possibles pour un jeune homme sans naissance : le **rouge** de l’uniforme militaire, ouvert sous l’Empire, et le **noir** de la soutane, seule voie d’ascension sous la Restauration. Julien est né trop tard : il aurait été officier sous Napoléon, il sera séminariste.

## Livre premier — la province
**Julien Sorel**, fils d’un charpentier de **Verrières**, méprisé par son père, nourri de la lecture du *Mémorial de Sainte-Hélène*, devient précepteur des enfants de **M. de Rênal**, le maire. Par ambition autant que par orgueil de classe, il séduit **Madame de Rênal** — et l’aime réellement. L’affaire s’ébruite : il part au **séminaire de Besançon**, où l’abbé **Pirard** le protège dans un milieu d’espionnage et d’hypocrisie.

## Livre second — Paris
Secrétaire du **marquis de La Mole**, Julien découvre l’aristocratie parisienne. **Mathilde de La Mole**, orgueilleuse et romanesque, s’éprend de lui ; leur relation est un duel d’amour-propre. Enceinte, elle obtient de son père un titre et un régiment pour Julien : la réussite est là.
Tout s’effondre par une **lettre** de Madame de Rênal, dictée par son confesseur, qui dénonce Julien comme un séducteur ambitieux. Julien retourne à Verrières et tire sur elle **pendant la messe**.

## Le dénouement
Madame de Rênal survit ; Julien, emprisonné, refuse de se défendre. Devant le jury, il **accuse la société** de condamner en lui un paysan qui a osé sortir de sa classe. Il est guillotiné. Mathilde ensevelit sa tête ; Madame de Rênal meurt **trois jours** après lui.

## Ce que le roman met en place
Le **héros ambitieux** de tout le XIXe siècle, l’ironie stendhalienne, la focalisation interne serrée qui suit les calculs du personnage, et la fameuse définition : « Un roman est un miroir que l’on promène le long d’un chemin. »`,
          },
          questions: [
            ['Que désignent le rouge et le noir du titre ?', ['L’armée et l’Église, les deux voies d’ascension possibles', 'La passion et la mort', 'La révolution et la monarchie', 'Le sang et l’encre'], 0, 'Julien aurait été officier sous Napoléon ; sous la Restauration, il ne reste que la soutane.'],
            ['Quelle est l’origine sociale de Julien Sorel ?', ['Fils d’un charpentier de Verrières', 'Fils d’un notaire de Besançon', 'Orphelin recueilli par l’Église', 'Fils d’un officier de l’Empire'], 0, 'Son origine explique l’orgueil de classe qui gouverne toutes ses conduites.'],
            ['Quel livre nourrit l’imagination de Julien ?', ['Le Mémorial de Sainte-Hélène', 'Les Confessions de Rousseau', 'L’Encyclopédie', 'Les Fables de La Fontaine'], 0, 'Napoléon est son modèle secret, dans une France qui l’a renié.'],
            ['Que provoque la lettre de Madame de Rênal ?', ['La ruine du mariage prévu avec Mathilde et le geste criminel de Julien', 'L’arrestation du marquis', 'Le départ de Julien pour l’armée', 'La conversion de Julien'], 0, 'Dictée par son confesseur, elle dénonce Julien comme un séducteur ambitieux.'],
            ['Où Julien tire-t-il sur Madame de Rênal ?', ['Dans l’église de Verrières, pendant la messe', 'Dans le jardin des Rênal', 'À Paris, chez les La Mole', 'Au séminaire de Besançon'], 0, 'Le lieu et le moment donnent au geste sa portée de scandale.'],
            ['Que fait Julien lors de son procès ?', ['Il accuse la société de le condamner comme paysan sorti de sa classe', 'Il plaide la folie', 'Il nie les faits', 'Il demande la clémence du jury'], 0, 'Il refuse de se défendre : le discours de tribunal est le sommet politique du roman.'],
            ['Mathilde de La Mole et Madame de Rênal aiment Julien de la même façon.', ['Vrai', 'Faux'], 1, 'L’une l’aime par orgueil et romanesque, l’autre par tendresse : le roman oppose deux amours.'],
            ['Quelle définition du roman Stendhal donne-t-il ?', ['« Un miroir que l’on promène le long d’un chemin »', '« Une machine à explorer le temps »', '« Une tranche de vie »', '« Un art de la mémoire »'], 0, 'Elle justifie le sous-titre : Chronique de 1830.'],
          ],
        },
        {
          titre: 'Le Rouge et le Noir - Partie 2',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Stendhal — que vaut un personnage de roman ?',
            cours: `Cette seconde partie prend le roman par son **parcours** : le personnage de roman, esthétiques et valeurs. Deux questions le résument : **comment** un personnage est-il construit, et **quelles valeurs** porte-t-il ?

## Un héros ni bon ni mauvais
Julien ment, calcule, séduit par ambition, trahit, tire sur une femme qu’il aime. Il est aussi courageux, loyal envers Pirard, sincère avec Fouqué, capable d’une grandeur que personne autour de lui n’atteint. Le roman refuse de trancher : il crée un personnage **ambivalent**, dont on épouse le point de vue sans l’approuver. C’est une révolution esthétique.

## L’ironie stendhalienne
Le narrateur commente, s’amuse, prend ses distances, s’adresse au lecteur. Il dit d’un personnage exactement le contraire de ce qu’il montre. Cette **voix ironique** permet la satire : la province vénale de Verrières, l’hypocrisie du séminaire, l’ennui doré du faubourg Saint-Germain.

## Le roman comme chronique politique
1830, c’est la **Restauration** finissante : noblesse revenue, cléricalisme, congrégation, mépris pour les talents sans naissance. Le roman montre une société bloquée où l’**énergie** individuelle n’a plus d’issue légitime. Le crime de Julien n’est pas seulement passionnel : il est le geste d’un homme à qui l’on retire, d’un coup, la place qu’il avait arrachée.

## L’écriture
Phrase sèche, refus du « beau style », rapidité, **discours indirect libre** qui fait entendre la pensée du personnage dans le récit. Stendhal disait lire le Code civil pour se corriger du lyrisme.

## Les axes de dissertation
- **Un personnage de roman doit-il être un modèle ?** Julien prouve que non.
- **Le roman doit-il peindre la société de son temps ?** Le sous-titre y répond, mais le roman excède la chronique.
- **Peut-on s’attacher à un personnage immoral ?** La focalisation interne fait précisément cela.
- **L’ambition est-elle une valeur ?** Le roman la montre comme une énergie que la société gâche.`,
          },
          questions: [
            ['Comment le roman construit-il le personnage de Julien ?', ['Comme un être ambivalent, dont on épouse le point de vue sans l’approuver', 'Comme un héros exemplaire', 'Comme un pur criminel', 'Comme un narrateur ironique'], 0, 'Ce refus de trancher est une révolution esthétique.'],
            ['Quel procédé fait entendre la pensée du personnage à l’intérieur du récit ?', ['Le discours indirect libre', 'L’aparté', 'La didascalie', 'Le monologue intérieur non ponctué'], 0, 'Il permet de suivre les calculs de Julien sans les endosser.'],
            ['Quelle période politique le roman peint-il ?', ['La Restauration finissante, en 1830', 'Le Premier Empire', 'La Révolution de 1789', 'Le Second Empire'], 0, 'Une société bloquée, où l’énergie individuelle n’a plus d’issue légitime.'],
            ['Quel rôle joue l’ironie du narrateur ?', ['Elle permet la satire et la distance critique', 'Elle rend le récit comique', 'Elle masque les intentions de l’auteur', 'Elle ralentit le récit'], 0, 'Le narrateur dit souvent le contraire de ce qu’il montre.'],
            ['Quel modèle stylistique Stendhal revendiquait-il ?', ['Le Code civil, contre le lyrisme', 'La poésie de Lamartine', 'Les sermons de Bossuet', 'Les romans de Walter Scott'], 0, 'D’où la phrase sèche et rapide, sans « beau style ».'],
            ['Que révèle le crime de Julien selon la lecture sociale du roman ?', ['Le geste d’un homme à qui l’on retire la place qu’il avait arrachée', 'Une simple crise de jalousie', 'Un accident', 'Une manœuvre politique'], 0, 'Le procès le dit explicitement : c’est un paysan qu’on condamne.'],
            ['Un personnage de roman doit être moralement exemplaire.', ['Vrai', 'Faux'], 1, 'Julien démontre l’inverse : le roman peut faire aimer un personnage sans l’approuver.'],
            ['Quel personnage incarne l’amour par orgueil et par romanesque ?', ['Mathilde de La Mole', 'Madame de Rênal', 'Élisa', 'Madame Derville'], 0, 'Elle rejoue la légende de Boniface de La Mole en ensevelissant la tête de Julien.'],
          ],
        },
        {
          titre: 'Mémoires d’Hadrien',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Yourcenar, 1951 — un empereur romain écrit à son successeur',
            cours: `Publié en **1951** par **Marguerite Yourcenar**, le livre est un roman qui a la forme d’une **longue lettre** : l’empereur **Hadrien**, malade et proche de la mort, écrit à son petit-fils adoptif **Marc Aurèle**, alors adolescent.

## La forme
Six sections, dont les titres sont latins : *Animula vagula blandula* (« petite âme vagabonde et charmante », premiers mots du poème d’Hadrien mourant), *Varius multiplex multiformis*, *Tellus stabilita*, *Saeculum aureum*, *Disciplina augusta*, *Patientia*. Le récit est **rétrospectif** : Hadrien reprend sa vie, du soldat au prince, de la conquête à la paix, du bonheur au deuil.

## L’histoire
Hadrien (76-138) succède à Trajan, arrête l’expansion militaire, consolide les frontières (le mur en Bretagne), voyage sans relâche dans l’Empire, restaure Athènes, construit la Villa Adriana et le Panthéon. Il aime **Antinoüs**, un jeune Bithynien qui se noie dans le Nil en 130 — mort peut-être volontaire, jamais élucidée. Hadrien le divinise, fonde une ville en son nom, et ne s’en console pas. La fin du livre est celle d’un corps qui lâche et d’un esprit qui refuse de mentir sur ce qu’il a été.

## Le pari du livre
Écrire à la **première personne** la conscience d’un homme mort depuis dix-huit siècles, en s’appuyant sur des sources historiques réelles. Yourcenar a mis presque trente ans à y parvenir. Elle formule sa méthode dans les *Carnets de notes* qui accompagnent le roman : « Un pied dans l’érudition, l’autre dans la magie. »

## Le style
Phrase ample, latine de rythme, aphoristique. Le récit alterne les **grandes fresques** (guerres, voyages, réformes) et les **notations intimes** (le goût de l’eau, la fatigue, le sommeil, les chevaux). Le livre est autant une méditation sur le pouvoir, l’art, le corps et la mort qu’un roman historique.`,
          },
          questions: [
            ['Quelle est la forme du livre ?', ['Une longue lettre d’Hadrien à Marc Aurèle', 'Un journal intime tenu au jour le jour', 'Un dialogue entre deux empereurs', 'Un récit à la troisième personne'], 0, 'Le récit est rétrospectif : un mourant reprend sa vie.'],
            ['Qui est Antinoüs ?', ['Le jeune homme aimé d’Hadrien, noyé dans le Nil', 'Le père adoptif d’Hadrien', 'Le général de ses armées', 'Son médecin'], 0, 'Hadrien le divinise et fonde une ville en son nom ; il ne s’en console pas.'],
            ['Quels sont les premiers mots du livre ?', ['Animula vagula blandula', 'Alea jacta est', 'Ave Caesar', 'Carpe diem'], 0, '« Petite âme vagabonde et charmante » : ce sont les mots du poème d’Hadrien mourant.'],
            ['Quelle politique impériale Hadrien mène-t-il ?', ['Il arrête l’expansion et consolide les frontières', 'Il conquiert la Germanie', 'Il abandonne la Bretagne', 'Il déplace la capitale à Athènes'], 0, 'Le mur de Bretagne en est le symbole le plus visible.'],
            ['En quelle année le roman a-t-il été publié ?', ['1951', '1938', '1968', '1980'], 0, 'Yourcenar y a travaillé pendant près de trente ans.'],
            ['Comment Yourcenar résume-t-elle sa méthode ?', ['« Un pied dans l’érudition, l’autre dans la magie »', '« Le roman est un miroir »', '« Je peins le passage »', '« Écrire, c’est se souvenir »'], 0, 'La formule figure dans les Carnets de notes qui accompagnent le roman.'],
            ['Le livre est une biographie savante sans part de fiction.', ['Vrai', 'Faux'], 1, 'C’est un roman : il reconstruit de l’intérieur une conscience, à partir de sources réelles.'],
            ['À qui Hadrien adresse-t-il son récit ?', ['À Marc Aurèle, son petit-fils adoptif', 'À Trajan', 'Au Sénat de Rome', 'À Antinoüs'], 0, 'L’adresse à un successeur adolescent donne au livre sa tonalité de transmission.'],
          ],
        },
        {
          titre: 'Vision du monde et esthétique du Nouveau Roman',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Une fiche notion : quand le roman se retourne contre lui-même',
            cours: `On appelle **Nouveau Roman** un ensemble d’auteurs publiés dans les années **1950-1970**, la plupart aux **Éditions de Minuit** : **Alain Robbe-Grillet**, **Nathalie Sarraute**, **Michel Butor**, **Claude Simon**, **Robert Pinget**, **Marguerite Duras**. Ce n’est pas une école organisée mais un **air de famille** et un refus commun.

## Ce qui est refusé
- Le **personnage** : plus de nom parfois, plus de portrait, plus de biographie. Sarraute parle d’un « **ère du soupçon** » (1956) : le lecteur ne croit plus au personnage comme à une personne.
- L’**intrigue** : plus de chronologie claire, plus de dénouement. Le récit tourne, répète, se contredit.
- La **psychologie** : les motivations expliquées disparaissent au profit des sensations, des objets, des tropismes.
- L’**auteur omniscient** : personne ne domine plus le récit.

## Ce qui est mis à la place
La **description**, portée à un degré inédit — chez Robbe-Grillet, une tomate, une gomme, une jalousie de fenêtre occupent des pages, décrites géométriquement, sans métaphore ; d’où le nom d’« **école du regard** ». La **répétition** et la **variation** deviennent des principes de composition (Simon, Butor). Le **lecteur** est appelé à faire le travail : reconstituer, hésiter, accepter de ne pas savoir.

## Trois textes à connaître
*L’Ère du soupçon* de Sarraute (**1956**) et *Pour un nouveau roman* de Robbe-Grillet (**1963**) sont les manifestes ; *La Modification* de Butor (**1957**), écrit à la **deuxième personne du pluriel**, en est l’exemple le plus célèbre.

## Ce qu’il faut en retenir pour une dissertation
Le Nouveau Roman ne détruit pas le roman : il déplace la question. Puisque le personnage classique était une **convention**, la montrer comme telle est encore une façon de dire le réel — un réel fait d’objets, de perceptions et d’incertitude, tel que le XXe siècle l’a rendu. C’est une esthétique, et c’est aussi une **vision du monde**.`,
          },
          questions: [
            ['Quelle maison d’édition est associée au Nouveau Roman ?', ['Les Éditions de Minuit', 'Gallimard', 'Le Seuil', 'Flammarion'], 0, 'Jérôme Lindon y publie Robbe-Grillet, Simon, Pinget, Duras.'],
            ['Qui a écrit L’Ère du soupçon ?', ['Nathalie Sarraute', 'Alain Robbe-Grillet', 'Michel Butor', 'Claude Simon'], 0, 'Publié en 1956, l’essai annonce la fin de la croyance au personnage.'],
            ['Quel manifeste Robbe-Grillet publie-t-il en 1963 ?', ['Pour un nouveau roman', 'Le Degré zéro de l’écriture', 'Qu’est-ce que la littérature ?', 'L’Ère du soupçon'], 0, 'Il y théorise le refus du personnage, de l’intrigue et de la métaphore.'],
            ['Pourquoi parle-t-on d’« école du regard » ?', ['Parce que la description des objets remplace la psychologie', 'Parce que les auteurs écrivent sur la peinture', 'Parce que les récits sont vus par un narrateur unique', 'Parce que le cinéma les inspire seul'], 0, 'Chez Robbe-Grillet, un objet est décrit géométriquement, sans métaphore.'],
            ['Quelle particularité présente La Modification de Butor ?', ['Le récit est écrit à la deuxième personne du pluriel', 'Il n’a pas de ponctuation', 'Il est écrit en vers', 'Il ne comporte aucun dialogue'], 0, 'Le « vous » installe le lecteur dans la place du personnage.'],
            ['Que devient le rôle du lecteur dans le Nouveau Roman ?', ['Il doit reconstituer et accepter de ne pas tout savoir', 'Il est guidé pas à pas', 'Il est absent du dispositif', 'Il choisit la fin du récit'], 0, 'Le récit ne conclut pas à sa place.'],
            ['Le Nouveau Roman forme une école organisée avec un chef et un programme commun.', ['Vrai', 'Faux'], 1, 'C’est un air de famille et un ensemble de refus, pas une école constituée.'],
            ['Quelle période correspond au Nouveau Roman ?', ['Les années 1950 à 1970', 'L’entre-deux-guerres', 'Les années 1980-1990', 'La fin du XIXe siècle'], 0, 'Claude Simon recevra le prix Nobel de littérature en 1985.'],
          ],
        },
        {
          titre: 'Les Contemplations',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Hugo, 1856 — les Mémoires d’une âme',
            cours: `Recueil publié en **1856**, pendant l’exil de **Victor Hugo** à Guernesey. Le programme retient les **livres I à IV**. Parcours associé : **les Mémoires d’une âme**.

## L’architecture
Six livres, répartis en deux ensembles séparés par une date : **Autrefois** (livres I-III : *Aurore*, *L’Âme en fleur*, *Les Luttes et les Rêves*) et **Aujourd’hui** (livres IV-VI : *Pauca meae*, *En marche*, *Au bord de l’infini*). Entre les deux, la mort de **Léopoldine**, la fille aînée du poète, noyée à Villequier en **1843** à dix-neuf ans, quelques mois après son mariage.
La préface donne la clé : « Ce livre doit être lu comme on lirait le livre d’un mort. » Et surtout : « **Quand je vous parle de moi, je vous parle de vous.** Ah ! insensé, qui crois que je ne suis pas toi ! »

## Livre I — Aurore
L’enfance, l’école, la nature, la jeunesse littéraire, la bataille romantique. « Réponse à un acte d’accusation » y raconte, sur un ton épique et drôle, la révolution du vocabulaire poétique : « Je mis un bonnet rouge au vieux dictionnaire. »

## Livre II — L’Âme en fleur
L’amour, la sensualité, la nature complice. Poèmes courts, souvent chantants.

## Livre III — Les Luttes et les Rêves
La misère, l’injustice, l’enfance exploitée (« Melancholia » et les enfants à l’usine), la révolte, le doute. Hugo y est déjà le poète social des *Misérables*.

## Livre IV — Pauca meae
Le livre du deuil. « **Demain, dès l’aube…** », « À Villequier », « Elle avait pris ce pli… » : la douleur y passe du récit intime à la question adressée à Dieu. C’est le cœur émotionnel du recueil et le plus souvent étudié à l’oral.

## Ce que veut dire « Mémoires d’une âme »
Le recueil n’est pas une autobiographie de faits mais le **récit d’une vie intérieure** : joie, amour, révolte, deuil, foi. Et Hugo en fait aussitôt un livre **universel** — le « je » y est offert au lecteur comme un miroir.`,
          },
          questions: [
            ['Comment le recueil est-il organisé ?', ['En deux ensembles, Autrefois et Aujourd’hui, séparés par la mort de Léopoldine', 'En quatre saisons', 'Par ordre chronologique de composition', 'En trois parties égales'], 0, 'Six livres au total ; le programme retient les quatre premiers.'],
            ['Qui était Léopoldine ?', ['La fille aînée de Hugo, noyée à Villequier en 1843', 'Sa mère', 'Sa femme', 'Sa sœur'], 0, 'Elle avait dix-neuf ans et venait de se marier.'],
            ['Quelle formule de la préface donne la clé du recueil ?', ['« Quand je vous parle de moi, je vous parle de vous »', '« Je est un autre »', '« Le poète est un phare »', '« Il faut être absolument moderne »'], 0, 'Le « je » lyrique est offert au lecteur comme un miroir.'],
            ['Quel poème célèbre ouvre le deuil de Pauca meae ?', ['« Demain, dès l’aube… »', '« Melancholia »', '« Réponse à un acte d’accusation »', '« Vieille chanson du jeune temps »'], 0, 'Le poème ne dit qu’à la fin qu’il s’agit d’une visite à une tombe.'],
            ['Que raconte « Réponse à un acte d’accusation » ?', ['La révolution romantique du vocabulaire poétique', 'La mort de Léopoldine', 'L’exil à Guernesey', 'Un procès politique'], 0, '« Je mis un bonnet rouge au vieux dictionnaire. »'],
            ['Quel thème domine le livre III, Les Luttes et les Rêves ?', ['La misère et l’injustice sociale', 'L’amour heureux', 'L’enfance à la campagne', 'La foi religieuse'], 0, 'Hugo y est déjà le poète social des Misérables.'],
            ['Les Contemplations sont une autobiographie de faits.', ['Vrai', 'Faux'], 1, 'C’est le récit d’une vie intérieure : « les Mémoires d’une âme ».'],
            ['Où Hugo se trouve-t-il lorsqu’il publie le recueil ?', ['En exil à Guernesey', 'À Paris', 'En Belgique', 'En Italie'], 0, 'L’exil, commencé après le coup d’État de 1851, donne au livre sa position de retrait.'],
          ],
        },
        {
          titre: 'Les Fleurs du mal',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Baudelaire, 1857 — le recueil et son procès',
            cours: `Publié en **1857**, *Les Fleurs du mal* de **Charles Baudelaire** est condamné la même année pour outrage à la morale publique : **six pièces** sont retranchées. Une seconde édition, augmentée et réorganisée, paraît en **1861**. Parcours associé : **alchimie poétique : la boue et l’or**.

## L’architecture
Six sections, qui dessinent un itinéraire :
1. **Spleen et Idéal** — la plus longue : la tension entre l’élévation (l’art, la beauté, l’amour) et l’enlisement (l’ennui, l’angoisse, le temps).
2. **Tableaux parisiens** (ajoutée en 1861) — la ville moderne, ses foules, ses vieillards, ses mendiantes, ses cygnes exilés.
3. **Le Vin** — l’ivresse comme échappatoire.
4. **Fleurs du mal** — la transgression, la volupté, la damnation.
5. **Révolte** — le blasphème.
6. **La Mort** — le dernier voyage, seul espoir : « Au fond de l’Inconnu pour trouver du **nouveau** ! »

## Les poèmes à connaître
« Au lecteur », « L’Albatros », « Correspondances », « La Vie antérieure », « Parfum exotique », « Harmonie du soir », « L’Invitation au voyage », les quatre « Spleen », « Une Charogne », « Le Cygne », « À une passante », « Le Voyage ».

## Deux notions
- Le **spleen** : angoisse sans objet, ennui métaphysique, temps qui écrase. « Quand le ciel bas et lourd pèse comme un couvercle… »
- Les **correspondances** : le monde est « une forêt de symboles » ; les parfums, les couleurs et les sons se répondent. Le poète est celui qui déchiffre ce langage.

## La forme
Baudelaire reste **classique** de facture — sonnets, alexandrins, rimes régulières — et **révolutionnaire** de matière : il fait entrer dans le poème la charogne, la vieillesse, la ville sale, la prostituée. C’est ce contraste qui a fait scandale, et c’est lui qui fonde la modernité poétique.`,
          },
          questions: [
            ['Que se passe-t-il lors de la publication du recueil en 1857 ?', ['Il est condamné et six pièces sont retranchées', 'Il obtient un prix littéraire', 'Il passe inaperçu', 'Il est interdit en totalité'], 0, 'Une seconde édition augmentée paraît en 1861.'],
            ['Quelle section a été ajoutée en 1861 ?', ['Tableaux parisiens', 'Spleen et Idéal', 'La Mort', 'Le Vin'], 0, 'Elle fait entrer la ville moderne dans le recueil.'],
            ['Qu’est-ce que le spleen chez Baudelaire ?', ['Une angoisse sans objet, un ennui métaphysique', 'La nostalgie de l’enfance', 'La colère politique', 'Le désir de voyage'], 0, '« Quand le ciel bas et lourd pèse comme un couvercle… »'],
            ['Que dit le poème « Correspondances » ?', ['La nature est un temple où parfums, couleurs et sons se répondent', 'La ville détruit la beauté', 'Le poète est un albatros', 'La mort est un voyage'], 0, 'Le monde est « une forêt de symboles » que le poète déchiffre.'],
            ['Quel est le dernier vers célèbre du recueil, dans « Le Voyage » ?', ['« Au fond de l’Inconnu pour trouver du nouveau ! »', '« Ô mort, vieux capitaine »', '« Là, tout n’est qu’ordre et beauté »', '« Hypocrite lecteur, mon semblable, mon frère »'], 0, 'La mort y est le dernier moyen d’échapper à l’ennui.'],
            ['Quelle est la particularité formelle du recueil ?', ['Une facture classique au service d’une matière scandaleuse', 'Le vers libre généralisé', 'L’absence de ponctuation', 'La prose exclusive'], 0, 'Sonnets et alexandrins accueillent la charogne, la ville sale, la vieillesse.'],
            ['Les six pièces condamnées ont été réhabilitées du vivant de Baudelaire.', ['Vrai', 'Faux'], 1, 'La condamnation ne sera annulée qu’en 1949.'],
            ['Combien de sections comporte l’édition de 1861 ?', ['Six', 'Quatre', 'Huit', 'Trois'], 0, 'De Spleen et Idéal à La Mort, elles dessinent un itinéraire.'],
          ],
        },
        {
          titre: 'Les Fleurs du mal - Partie 2',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Baudelaire — extraire l’or de la boue',
            cours: `Cette seconde partie prend le recueil par son **parcours** : alchimie poétique, la boue et l’or. La formule vient de Baudelaire lui-même, dans un projet d’épilogue : « **Tu m’as donné ta boue et j’en ai fait de l’or.** »

## Ce que veut dire l’alchimie
L’alchimiste transformait le plomb en or. Le poète fait la même opération sur la **matière du monde** : ce qui est laid, banal, malade ou immoral devient beau **par le travail du langage**. La beauté n’est donc pas dans l’objet, elle est dans la **forme** que le poète lui donne. C’est le renversement décisif de la poésie moderne.

## Le poème matriciel : « Une Charogne »
Un couple découvre en promenade un cadavre d’animal en décomposition, décrit avec une précision insoutenable — et le poème s’achève sur une promesse d’immortalité à la femme aimée : la pourriture attend le corps, mais le poète aura « gardé la forme et l’essence divine » de ses amours décomposées. Le sujet le plus repoussant produit l’un des plus beaux poèmes du recueil : la démonstration est faite.

## La ville comme matière
Dans les *Tableaux parisiens*, la boue est urbaine : travaux, poussière, foules, vieillards, aveugles, mendiantes rousses, cygnes échappés d’une ménagerie. Baudelaire invente le regard du **flâneur**, celui qui trouve la beauté dans le passage — « À une passante » : une inconnue croisée une seconde, aimée, perdue à jamais.

## Le double postulation
« Il y a dans tout homme, à toute heure, deux postulations simultanées, l’une vers Dieu, l’autre vers Satan. » Le recueil ne choisit pas : spleen **et** idéal, boue **et** or, damnation **et** élévation. C’est cette tension, jamais résolue, qui structure le livre.

## Les axes de dissertation
- **La poésie doit-elle chercher le beau sujet ?** Le recueil répond non.
- **Le poète est-il un alchimiste ou un simple observateur ?**
- **La modernité est-elle une esthétique de la laideur ?** Non : une esthétique de la transformation.
- **Le mal est-il un thème ou une méthode ?** Chez Baudelaire, les deux.`,
          },
          questions: [
            ['Quelle formule de Baudelaire résume le parcours ?', ['« Tu m’as donné ta boue et j’en ai fait de l’or »', '« Je est un autre »', '« La poésie doit être faite par tous »', '« Il faut être absolument moderne »'], 0, 'Elle vient d’un projet d’épilogue pour le recueil.'],
            ['Que démontre le poème « Une Charogne » ?', ['Que le sujet le plus repoussant peut produire un très beau poème', 'Que la nature est cruelle', 'Que l’amour est éternel par nature', 'Que la mort est belle'], 0, 'La beauté n’est pas dans l’objet, mais dans la forme que lui donne le langage.'],
            ['Qu’est-ce que le flâneur baudelairien ?', ['Celui qui trouve la beauté dans le passage, au cœur de la ville', 'Un poète retiré à la campagne', 'Un voyageur au long cours', 'Un critique d’art'], 0, '« À une passante » en est l’exemple parfait.'],
            ['Que sont les « deux postulations simultanées » ?', ['L’une vers Dieu, l’autre vers Satan', 'L’amour et la haine', 'La ville et la nature', 'Le passé et l’avenir'], 0, 'Le recueil ne choisit pas : c’est cette tension qui le structure.'],
            ['Dans quelle section se trouvent les poèmes sur la ville moderne ?', ['Tableaux parisiens', 'Le Vin', 'Révolte', 'La Mort'], 0, 'Travaux, foules, vieillards, cygnes exilés : la boue y est urbaine.'],
            ['Où réside la beauté selon l’alchimie baudelairienne ?', ['Dans le travail de la forme, non dans l’objet choisi', 'Dans la noblesse du sujet', 'Dans la sincérité du sentiment', 'Dans la musicalité seule'], 0, 'C’est le renversement décisif de la poésie moderne.'],
            ['La modernité baudelairienne consiste à préférer la laideur à la beauté.', ['Vrai', 'Faux'], 1, 'Elle consiste à transformer : c’est une esthétique de la transformation, pas de la laideur.'],
            ['Quel poème évoque une inconnue croisée une seconde dans la rue ?', ['À une passante', 'Le Cygne', 'L’Albatros', 'Harmonie du soir'], 0, 'L’amour y naît et se perd dans le même instant : c’est la beauté du transitoire.'],
          ],
        },
        {
          titre: 'Alcools',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Apollinaire, 1913 — la tradition et l’invention',
            cours: `Recueil publié en **1913** par **Guillaume Apollinaire**, il rassemble des poèmes écrits sur quinze ans. Parcours associé : **modernité poétique ?** — avec un point d’interrogation, qui est tout le sujet.

## Un geste célèbre
Sur les épreuves, Apollinaire **supprime toute la ponctuation** : « le rythme même et la coupe des vers, voilà la véritable ponctuation ». Le vers devient ambigu, plusieurs lectures deviennent possibles, et le lecteur doit choisir où respirer.

## L’ordre du recueil
Il n’est ni chronologique ni thématique. Le recueil s’ouvre sur « **Zone** », écrit en dernier, et se ferme sur « Vendémiaire ». Entre les deux : « Le Pont Mirabeau », « La Chanson du mal-aimé », « Les Colchiques », « Marie », « Nuit rhénane », « Automne malade », « La Loreley », « Rhénanes ». Le désordre est un choix : il fait entendre des échos plutôt qu’une progression.

## Zone
Le poème inaugural mêle tout : l’aube parisienne, les affiches, les prospectus, la tour Eiffel « bergère », les hangars de Port-Aviation, l’émigration, la religion de l’enfance, les souvenirs de voyage, l’amour perdu. Il commence par « **À la fin tu es las de ce monde ancien** » et finit sur « **Soleil cou coupé** ». Le « je » y devient « tu » : le poète se parle à lui-même.

## Modernité et tradition
Apollinaire fait entrer dans le poème l’**aviation**, la publicité, la ville industrielle, le cinéma naissant — et en même temps il écrit des chansons, des complaintes, des mythes rhénans, des vers d’une régularité parfaite (« Sous le pont Mirabeau coule la Seine »). C’est là toute la question du parcours : la modernité n’est pas la table rase, elle est un **alliage**.

## Le titre
*Alcools* : ce qui enivre, ce qui brûle, ce qui distille. Le recueil est fait de vies et de villes distillées en poèmes courts, et l’ivresse y est aussi bien joie que douleur d’amour.`,
          },
          questions: [
            ['Quelle décision Apollinaire prend-il sur les épreuves du recueil ?', ['Supprimer toute la ponctuation', 'Renoncer aux rimes', 'Classer les poèmes par date', 'Ajouter des illustrations'], 0, '« Le rythme même et la coupe des vers, voilà la véritable ponctuation. »'],
            ['Quel poème ouvre le recueil ?', ['Zone', 'Le Pont Mirabeau', 'Vendémiaire', 'La Chanson du mal-aimé'], 0, 'Il a pourtant été écrit en dernier : l’ordre du recueil est un choix esthétique.'],
            ['Par quel vers commence « Zone » ?', ['« À la fin tu es las de ce monde ancien »', '« Sous le pont Mirabeau coule la Seine »', '« Soleil cou coupé »', '« Vienne la nuit sonne l’heure »'], 0, 'Le poème se clôt sur « Soleil cou coupé ».'],
            ['Quels éléments modernes entrent dans les poèmes ?', ['L’aviation, la publicité, la ville industrielle', 'Les mythes antiques seuls', 'Les paysages campagnards', 'Les batailles napoléoniennes'], 0, 'Ils voisinent avec les chansons, les complaintes et les mythes rhénans.'],
            ['Que signifie le point d’interrogation du parcours « Modernité poétique ? »', ['La modernité d’Apollinaire est un alliage de tradition et d’invention', 'Le recueil n’est pas moderne', 'La modernité est un mot inventé après coup', 'Le recueil refuse toute nouveauté'], 0, 'La modernité n’est pas la table rase : Apollinaire écrit aussi des vers d’une régularité parfaite.'],
            ['En quelle année Alcools paraît-il ?', ['1913', '1900', '1920', '1857'], 0, 'Le recueil rassemble des poèmes écrits sur une quinzaine d’années.'],
            ['L’ordre des poèmes suit leur date de composition.', ['Vrai', 'Faux'], 1, 'Il est délibérément désordonné, pour créer des échos plutôt qu’une progression.'],
            ['Que suggère le titre du recueil ?', ['Ce qui enivre, brûle et distille — des vies et des villes distillées', 'La fête et la boisson uniquement', 'La chimie moderne', 'Les cafés de Montmartre'], 0, 'L’ivresse y est autant joie que douleur d’amour.'],
          ],
        },
        {
          titre: 'Le langage poétique comme source de modernité',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Une fiche notion : ce qui fait qu’un poème est moderne',
            cours: `Cette fiche accompagne l’étude d’*Alcools* et, plus largement, la question du parcours « modernité poétique ? ». « Moderne » n’y désigne pas « récent » : c’est une **manière de traiter le langage**.

## Trois ruptures fondatrices
1. **Baudelaire** (1857) fait entrer dans le poème la ville, la laideur, le transitoire : le beau sujet cesse d’exister.
2. **Rimbaud** (1871) réclame que le poète se fasse « **voyant** » par « un long, immense et raisonné dérèglement de tous les sens », et que la poésie soit « **en avant** ».
3. **Mallarmé** déplace tout du côté du **langage** : « Ce n’est point avec des idées que l’on fait des vers, c’est avec des mots. » Le poème ne transmet plus un message, il crée un objet verbal.

## Ce qui change concrètement
- La **forme** : abandon progressif du vers régulier, poème en prose, vers libre, disparition de la ponctuation, calligrammes.
- Le **sujet** : plus rien n’est indigne du poème, ni un urinoir, ni un prospectus, ni une gare.
- L’**image** : la métaphore cesse de comparer deux choses connues pour rapprocher deux réalités éloignées — ce que les surréalistes systématiseront après 1920.
- Le **lecteur** : il devient actif, il doit choisir un sens là où le poème en propose plusieurs.

## Le risque, et la question du programme
À force de travailler la langue, le poème peut devenir **hermétique** : il perd le lecteur qu’il voulait libérer. La question « modernité poétique ? » invite précisément à peser ce risque — et à observer que les modernes les plus radicaux, Apollinaire compris, ont continué d’écrire des chansons que tout le monde retient par cœur.

> À retenir : est moderne un poème qui prend le **langage** pour sujet autant que pour outil.`,
          },
          questions: [
            ['Que signifie « moderne » appliqué à la poésie ?', ['Une manière de traiter le langage, pas une simple date', 'Un poème écrit après 1900', 'Un poème sans rime', 'Un poème engagé'], 0, 'Le mot désigne une esthétique, pas une chronologie.'],
            ['Quelle formule Rimbaud emploie-t-il pour définir le poète ?', ['Un voyant, par un dérèglement raisonné de tous les sens', 'Un artisan du vers', 'Un prophète du peuple', 'Un peintre du réel'], 0, 'Il demande aussi que la poésie soit « en avant ».'],
            ['Que dit Mallarmé de la fabrication des vers ?', ['« Ce n’est point avec des idées que l’on fait des vers, c’est avec des mots »', '« Le poème est un miroir »', '« Il faut chanter le peuple »', '« La rime est une servitude »'], 0, 'Le poème devient un objet verbal plutôt qu’un message.'],
            ['Quelle rupture Baudelaire introduit-il dès 1857 ?', ['Le beau sujet cesse d’exister : la ville et la laideur entrent dans le poème', 'Le vers libre', 'La suppression de la ponctuation', 'Le poème en prose exclusivement'], 0, 'La beauté se déplace du sujet vers la forme.'],
            ['Comment évolue l’image poétique avec la modernité ?', ['Elle rapproche des réalités éloignées au lieu de comparer deux choses connues', 'Elle disparaît', 'Elle devient strictement descriptive', 'Elle se limite à la métaphore filée'], 0, 'Les surréalistes systématiseront ce rapprochement après 1920.'],
            ['Quel risque la modernité poétique fait-elle courir ?', ['L’hermétisme, qui perd le lecteur', 'La banalité', 'La censure systématique', 'La disparition du vers'], 0, 'C’est ce que le point d’interrogation du parcours invite à peser.'],
            ['Être moderne en poésie signifie forcément abandonner toute forme fixe.', ['Vrai', 'Faux'], 1, 'Apollinaire écrit des chansons régulières que tout le monde retient : la modernité est un alliage.'],
            ['Quel changement la modernité impose-t-elle au lecteur ?', ['Il devient actif et doit choisir un sens parmi plusieurs', 'Il doit connaître la mythologie', 'Il doit lire à voix haute', 'Il doit suivre un ordre imposé'], 0, 'La suppression de la ponctuation, chez Apollinaire, en est l’exemple le plus net.'],
          ],
        },
        {
          titre: 'Le Malade imaginaire',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Molière, 1673 — la dernière pièce, et la plus théâtrale',
            cours: `**Comédie-ballet** en trois actes, créée en **1673**. Molière meurt le soir de la **quatrième représentation**, après avoir joué Argan. Parcours associé : **spectacle et comédie**.

## L’intrigue
**Argan**, riche bourgeois obsédé par sa santé, veut marier sa fille **Angélique** à **Thomas Diafoirus**, fils de médecin, pour avoir un médecin dans la famille. Angélique aime **Cléante**. La servante **Toinette** et le frère d’Argan, **Béralde**, s’allient pour ouvrir les yeux du malade : ils lui font jouer la comédie de sa propre mort. **Béline**, la seconde épouse, se réjouit devant le corps ; Angélique pleure. Argan comprend enfin. La pièce s’achève sur une **cérémonie burlesque** où Argan est reçu médecin en latin de fantaisie : « Dignus, dignus est intrare… »

## Une comédie-ballet
Prologue chanté, trois **intermèdes** dansés, musique de **Marc-Antoine Charpentier** : la pièce est un spectacle total, écrit pour la cour. Le théâtre y est présent à tous les niveaux — Cléante et Angélique se déclarent leur amour dans un **opéra improvisé** devant Argan, Toinette se déguise en médecin de passage, Argan joue le mort. Jouer un rôle est le moyen d’accéder à la vérité.

## La satire de la médecine
Purgon, Diafoirus père et fils, Fleurant : latin creux, saignées, lavements, autorité et jargon. Béralde formule la critique : la nature guérit, les médecins font des cérémonies. Ce n’est pas la médecine comme science qui est visée, mais la **médecine comme pouvoir** — celle qui parle une langue que le patient ne comprend pas.

## Les personnages
**Argan** : égoïste, crédule, tyrannique et terrifié par la mort. **Toinette** : l’intelligence pratique, l’insolence, le moteur de l’action. **Béline** : l’hypocrite intéressée. **Béralde** : la voix de la raison. **Thomas Diafoirus** : le pédant récitant son compliment appris par cœur.`,
          },
          questions: [
            ['De quoi Argan est-il malade ?', ['De rien : il est un malade imaginaire', 'D’une maladie pulmonaire', 'De la peste', 'D’une blessure ancienne'], 0, 'Sa maladie est une obsession, entretenue par les médecins qui en vivent.'],
            ['Pourquoi Argan veut-il marier sa fille à Thomas Diafoirus ?', ['Pour avoir un médecin dans la famille', 'Pour rembourser une dette', 'Parce que Béline l’exige', 'Pour obtenir un titre de noblesse'], 0, 'Angélique, elle, aime Cléante.'],
            ['Quel stratagème permet de démasquer Béline ?', ['Argan fait semblant d’être mort', 'Toinette lit ses lettres', 'Béralde la fait suivre', 'Cléante la dénonce au notaire'], 0, 'Elle se réjouit devant le corps, tandis qu’Angélique pleure.'],
            ['Quel genre de pièce est Le Malade imaginaire ?', ['Une comédie-ballet, avec prologue et intermèdes chantés et dansés', 'Une tragi-comédie', 'Une farce en un acte', 'Un drame bourgeois'], 0, 'La musique est de Marc-Antoine Charpentier.'],
            ['Comment la pièce se termine-t-elle ?', ['Par une cérémonie burlesque où Argan est reçu médecin en faux latin', 'Par la mort d’Argan', 'Par le mariage de Béline', 'Par le départ de Toinette'], 0, '« Dignus, dignus est intrare » : la médecine y est réduite à un rituel.'],
            ['Que reproche Béralde à la médecine de son temps ?', ['De faire des cérémonies là où la nature guérit', 'D’être trop coûteuse seulement', 'De refuser les malades pauvres', 'De ne pas connaître la chirurgie'], 0, 'C’est la médecine comme pouvoir qui est visée, non la science.'],
            ['Molière est mort en scène pendant la première représentation.', ['Vrai', 'Faux'], 1, 'Il est pris de malaise lors de la quatrième représentation et meurt le soir même.'],
            ['Quel personnage se déguise en médecin de passage ?', ['Toinette', 'Béralde', 'Cléante', 'Angélique'], 0, 'Le déguisement est le ressort comique et le moyen d’ouvrir les yeux d’Argan.'],
          ],
        },
        {
          titre: 'Les Fausses Confidences',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Marivaux, 1737 — l’amour fabriqué par un valet',
            cours: `Comédie en **trois actes et en prose**, créée en **1737**. Parcours associé : **théâtre et stratagème**.

## L’intrigue
**Dorante**, jeune homme ruiné, aime en secret **Araminte**, une riche veuve. Son ancien valet **Dubois**, désormais au service d’Araminte, lui obtient la place d’**intendant** et conduit toute l’opération : « Nous sommes convenus de nos faits. »
Dubois révèle « en confidence » à Araminte que Dorante est fou d’amour pour elle depuis qu’il l’a aperçue à l’Opéra. La confidence est vraie, mais elle est **fabriquée** : elle installe l’idée. Suivent le **portrait** d’Araminte trouvé chez Dorante, la fausse lettre, la jalousie de **Marton**, la pression de **Madame Argante** et du **comte Dorimont**, qui veulent marier Araminte à un grand nom.
Araminte se défend, s’interroge, teste Dorante en lui dictant une lettre qui annonce son propre mariage — scène cruelle et magnifique. À la fin, elle avoue. Elle épousera Dorante, sans fortune ni titre.

## Le stratagème
Tout le théâtre de Marivaux tient dans cette question : peut-on **provoquer** un sentiment sans le fabriquer de toutes pièces ? Dubois ne ment presque jamais : il choisit **quand** et **comment** la vérité est dite. L’amour d’Araminte existait peut-être déjà ; le stratagème le rend **visible à elle-même**.

## Le marivaudage
Ce n’est pas du bavardage galant : c’est une **langue de l’aveu retardé**. Les personnages parlent pour ne pas dire, se contredisent, se surveillent. Les répliques sont brèves, les silences décisifs, et chaque mot pèse socialement — car ici l’argent et le rang sont partout : Araminte épouse un homme sans fortune, ce qui est un scandale de comédie.`,
          },
          questions: [
            ['Qui organise le stratagème de la pièce ?', ['Dubois, l’ancien valet de Dorante', 'Marton', 'Madame Argante', 'Le comte Dorimont'], 0, '« Nous sommes convenus de nos faits » : il conduit toute l’opération.'],
            ['Quelle est la situation de Dorante au début de la pièce ?', ['Il est ruiné et devient intendant chez Araminte', 'Il est un riche marchand', 'Il est officier', 'Il est le cousin d’Araminte'], 0, 'Son absence de fortune est l’obstacle central.'],
            ['Quelle « fausse confidence » Dubois fait-il à Araminte ?', ['Que Dorante est fou d’amour pour elle depuis qu’il l’a vue à l’Opéra', 'Que Dorante est riche', 'Que le comte est un escroc', 'Que Marton est amoureuse de Dorante'], 0, 'La confidence est vraie, mais son moment et sa forme sont calculés.'],
            ['Quel objet compromet Dorante ?', ['Un portrait d’Araminte trouvé chez lui', 'Une bague', 'Un contrat de mariage', 'Une lettre de son père'], 0, 'Il sert de preuve matérielle à l’amour que Dubois a annoncé.'],
            ['Que fait Araminte pour éprouver Dorante ?', ['Elle lui dicte une lettre annonçant son propre mariage', 'Elle le congédie', 'Elle le présente à sa mère', 'Elle lui offre de l’argent'], 0, 'La scène est cruelle : elle regarde souffrir celui qu’elle aime déjà.'],
            ['Comment la pièce se termine-t-elle ?', ['Araminte avoue son amour et épousera Dorante malgré son absence de fortune', 'Araminte épouse le comte', 'Dorante quitte la maison', 'Marton épouse Dorante'], 0, 'Un mariage socialement scandaleux, et c’est le sens du dénouement.'],
            ['Le marivaudage désigne un simple bavardage galant sans enjeu.', ['Vrai', 'Faux'], 1, 'C’est une langue de l’aveu retardé, où chaque mot pèse socialement.'],
            ['En quelle année la pièce est-elle créée ?', ['1737', '1730', '1725', '1750'], 0, 'Elle est aujourd’hui l’une des pièces les plus jouées de Marivaux.'],
          ],
        },
        {
          titre: 'Les Fausses Confidences - Partie 2',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Marivaux — le stratagème est-il une manipulation ?',
            cours: `Cette seconde partie prend la pièce par son **parcours** : théâtre et stratagème. La question morale est au centre — et le texte se garde d’y répondre.

## Une machine parfaitement réglée
Dubois n’improvise pas. Chaque acte apporte sa révélation : la confidence initiale, puis le portrait, puis la fausse lettre, puis la scène du jardin. Le rythme est celui d’une **mécanique**, et le spectateur, mis dans la confidence dès la première scène, jouit de voir le piège se refermer — c’est l’**ironie dramatique**.

## Manipuler ou révéler ?
Deux lectures s’affrontent, et toutes deux se défendent :
- **Manipulation** : Araminte est trompée, surveillée, poussée. Dubois exploite sa générosité et sa curiosité ; Dorante accepte de mentir par omission pendant trois actes.
- **Révélation** : rien n’est inventé — Dorante l’aime vraiment, et Araminte l’aime déjà sans se l’avouer. Le stratagème ne crée pas le sentiment, il **lève les obstacles** que la société et l’amour-propre avaient posés.
La pièce donne des arguments aux deux camps : c’est ce qui en fait un excellent sujet de dissertation.

## L’argent, partout
Araminte est riche, Dorante ne l’est pas, Marton espère une dot, Madame Argante veut un titre pour sa fille, le comte apporte un procès en dot. Chez Marivaux, l’amour n’est jamais hors du **système social** : la difficulté n’est pas de s’aimer, c’est de pouvoir le dire quand tout l’ordre social s’y oppose.

## Le valet metteur en scène
Dubois occupe la place de l’**auteur** : il distribue les rôles, choisit les entrées, ménage ses effets, et commente. Le théâtre y parle donc de lui-même — le parcours « théâtre et stratagème » invite précisément à voir dans le stratagème une **image du théâtre**.

## Les axes de dissertation
- **Peut-on faire naître l’amour par la ruse ?**
- **Araminte est-elle victime ou actrice de son propre bonheur ?** Elle mène l’acte III.
- **Le théâtre est-il par nature un art du stratagème ?**
- **La comédie de Marivaux est-elle sociale ou psychologique ?** Elle est les deux, et l’un par l’autre.`,
          },
          questions: [
            ['Quelle position occupe Dubois dans la pièce ?', ['Celle d’un metteur en scène qui distribue les rôles et ménage ses effets', 'Celle d’un simple confident', 'Celle du rival de Dorante', 'Celle du narrateur'], 0, 'Le stratagème devient ainsi une image du théâtre lui-même.'],
            ['Quel argument soutient la lecture du stratagème comme révélation ?', ['Rien n’est inventé : Dorante aime vraiment, et Araminte l’aime déjà', 'Dubois avoue tout dès le début', 'Araminte connaissait le plan', 'Marton organise le dénouement'], 0, 'Le stratagème lève des obstacles plutôt qu’il ne crée un sentiment.'],
            ['Quel argument soutient la lecture du stratagème comme manipulation ?', ['Araminte est trompée et poussée pendant trois actes', 'Dorante ment sur son identité', 'Dubois vole une lettre', 'Le comte est calomnié'], 0, 'La pièce donne des arguments aux deux lectures : c’est sa richesse.'],
            ['Quel rôle joue l’argent dans la pièce ?', ['Il conditionne tous les rapports, jusqu’à l’aveu amoureux', 'Il n’intervient pas', 'Il n’intéresse que Marton', 'Il n’apparaît qu’au dénouement'], 0, 'Chez Marivaux, l’amour n’est jamais hors du système social.'],
            ['Qu’est-ce que l’ironie dramatique dans cette pièce ?', ['Le spectateur connaît le stratagème avant Araminte', 'Les personnages parlent en aparté', 'Le dénouement est inattendu', 'Les valets se moquent des maîtres'], 0, 'Le plaisir vient de voir le piège se refermer.'],
            ['Qui mène l’action au troisième acte ?', ['Araminte elle-même', 'Dubois seul', 'Madame Argante', 'Le comte Dorimont'], 0, 'Elle éprouve Dorante et choisit son moment : elle n’est pas seulement agie.'],
            ['La pièce tranche clairement en faveur de la manipulation.', ['Vrai', 'Faux'], 1, 'Elle laisse les deux lectures ouvertes, ce qui en fait un sujet de dissertation classique.'],
            ['Quel personnage veut marier Araminte au comte Dorimont ?', ['Madame Argante, sa mère', 'Marton', 'Dubois', 'Arlequin'], 0, 'Elle veut un grand nom, ce qui rend le choix final d’Araminte plus fort.'],
          ],
        },
        {
          titre: 'Juste la fin du monde',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Lagarce, 1990 — revenir pour dire, et ne rien dire',
            cours: `Pièce écrite en **1990** par **Jean-Luc Lagarce**, alors atteint du sida, dont il mourra en 1995. Elle est aujourd’hui l’une des pièces contemporaines les plus jouées en France. Parcours associé : **crise personnelle, crise familiale**.

## La situation
**Louis**, trente-quatre ans, revient dans sa famille après **douze ans** d’absence pour annoncer sa mort prochaine. Il le dit au spectateur dès le **prologue** : « Plus tard, l’année d’après — j’allais mourir à mon tour. » Le reste de la pièce est l’histoire d’un aveu qui n’aura pas lieu.

## Les personnages
**La Mère**, qui parle beaucoup et organise le dimanche comme si de rien n’était. **Antoine**, le frère cadet, resté au pays, colérique, blessé, qui reproche à Louis son départ et son silence. **Suzanne**, la sœur, qui ne connaît son frère que par les « petits mots » qu’il envoyait. **Catherine**, la belle-sœur, qui ne l’a jamais vu et qui parle avec une politesse gênée. **Louis**, qui écoute.

## La structure
Un **prologue**, deux parties séparées par un **intermède**, un **épilogue**. Il ne se passe rien : on déjeune, on se dispute, on évoque le passé, quelqu’un propose une promenade en voiture. À la fin, Louis repart **sans avoir rien dit**. L’épilogue raconte, au conditionnel, un cri qu’il n’a jamais poussé.

## La langue
C’est la marque de Lagarce : phrases reprises, corrigées, réajustées en direct — « c’est ce que je voulais dire, ce n’est pas ce que je voulais dire ». La parole avance en **tâtonnant**, se rature, cherche le mot juste et le manque. Cette langue dit exactement le sujet : dans cette famille, on parle sans arrêt **pour ne pas dire** l’essentiel.

## Le titre
« Juste la fin du monde » : la fin du monde, mais « juste » — l’immense catastrophe individuelle réduite à une phrase minimisée, et jamais prononcée.`,
          },
          questions: [
            ['Pourquoi Louis revient-il dans sa famille ?', ['Pour annoncer sa mort prochaine', 'Pour demander de l’argent', 'Pour assister à un mariage', 'Pour vendre la maison'], 0, 'Le prologue l’annonce au spectateur : « J’allais mourir à mon tour. »'],
            ['Depuis combien de temps Louis n’a-t-il pas vu sa famille ?', ['Environ douze ans', 'Deux ans', 'Six mois', 'Vingt-cinq ans'], 0, 'Son absence est le grief principal d’Antoine.'],
            ['Que se passe-t-il à la fin de la pièce ?', ['Louis repart sans avoir rien dit', 'Louis annonce sa mort à sa mère', 'Antoine part avec lui', 'La famille se réconcilie'], 0, 'L’épilogue raconte au conditionnel un cri qu’il n’a jamais poussé.'],
            ['Qui est Catherine ?', ['La belle-sœur de Louis, qu’il n’avait jamais rencontrée', 'La sœur de Louis', 'Sa mère', 'Une amie d’enfance'], 0, 'Sa politesse gênée souligne l’étrangeté de la situation familiale.'],
            ['Quelle est la particularité de la langue de Lagarce ?', ['Les phrases se reprennent et se corrigent en direct', 'Elle est en vers réguliers', 'Elle imite le langage juridique', 'Elle est très argotique'], 0, 'On parle sans arrêt pour ne pas dire l’essentiel : la forme dit le sujet.'],
            ['Comment la pièce est-elle structurée ?', ['Prologue, deux parties séparées par un intermède, épilogue', 'Cinq actes', 'Trois actes et un final chanté', 'Une seule scène continue'], 0, 'Il ne s’y passe presque rien : un déjeuner, des disputes, une promenade proposée.'],
            ['La pièce comporte de nombreux rebondissements et coups de théâtre.', ['Vrai', 'Faux'], 1, 'L’action est intérieure : c’est l’aveu impossible qui tient lieu d’intrigue.'],
            ['Que signifie le titre de la pièce ?', ['Une catastrophe intime réduite à une formule minimisée', 'Une prophétie religieuse', 'La fin d’une époque politique', 'Un titre ironique sans rapport avec l’intrigue'], 0, 'La fin du monde, mais « juste » : et elle ne sera même pas dite.'],
          ],
        },
        {
          titre: 'Juste la fin du monde - Partie 2',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Lagarce — quand la famille empêche de parler',
            cours: `Cette seconde partie prend la pièce par son **parcours** : crise personnelle, crise familiale. Les deux crises n’en font qu’une, et le texte montre comment.

## La crise personnelle
Louis sait qu’il va mourir. Il a préparé son annonce, il l’a répétée — il le dit lui-même. Mais annoncer sa mort, c’est aussi demander quelque chose : de l’attention, du pardon, de l’amour. Or Louis est celui qui est **parti**, celui qui envoie des « petits mots », celui qui n’a jamais rien demandé. Le silence final n’est donc pas un accident : il est le prolongement logique d’une vie tenue à distance.

## La crise familiale
Chacun règle ses comptes dès qu’il ouvre la bouche. **Antoine** reproche à Louis d’avoir été le préféré, celui qui a pu partir, celui qui écrit ; il crie et se déclare « brutal » parce que c’est la place qu’on lui a laissée. **Suzanne** reproche à Louis son absence et son mystère. **La Mère** rejoue le dimanche d’autrefois pour empêcher que le pire arrive. Personne n’écoute vraiment.

## La parole comme obstacle
La pièce est bavarde et le silence y est central. Les monologues coexistent plus qu’ils ne dialoguent ; les phrases se reprennent (« ce que je veux dire, ce que je voulais dire ») sans jamais atteindre leur objet. Chez Lagarce, la langue **échoue en parlant** — et c’est cet échec qui émeut.

## Une tragédie contemporaine
On peut lire la pièce comme une tragédie : un destin connu d’avance (le prologue), une **unité de lieu** (la maison) et de temps (un dimanche), un héros qui ne peut échapper à ce qu’il est. Ce qui manque, c’est le geste : ici, la catastrophe est un **non-événement**.

## Les axes de dissertation
- **La famille est-elle un lieu de parole ou d’empêchement ?**
- **Le théâtre peut-il représenter ce qui ne se dit pas ?** Lagarce répond oui : par la reprise et le silence.
- **Louis est-il lâche ?** Ou protège-t-il les siens ? Le texte refuse de trancher.
- **Peut-on parler de tragédie moderne ?** Destin annoncé, unités respectées, catastrophe intérieure.`,
          },
          questions: [
            ['Pourquoi Louis ne parvient-il pas à parler ?', ['Annoncer sa mort reviendrait à demander quelque chose, ce qu’il n’a jamais fait', 'Sa famille l’en empêche physiquement', 'Il change d’avis dès le prologue', 'Il ne trouve pas le bon moment matériel'], 0, 'Le silence final prolonge une vie tenue à distance.'],
            ['Quel reproche Antoine adresse-t-il à son frère ?', ['D’avoir été le préféré, celui qui a pu partir', 'D’avoir volé de l’argent', 'De ne pas être venu à un enterrement', 'D’avoir menti sur son métier'], 0, 'Il se dit « brutal » parce que c’est la place que la famille lui a laissée.'],
            ['Comment la parole fonctionne-t-elle dans la pièce ?', ['Les monologues coexistent plus qu’ils ne dialoguent', 'Les personnages se répondent avec précision', 'Le dialogue est rapide et efficace', 'Les personnages parlent peu'], 0, 'La langue échoue en parlant, et c’est cet échec qui émeut.'],
            ['En quoi la pièce peut-elle être lue comme une tragédie ?', ['Destin annoncé dès le prologue, unités de lieu et de temps, héros prisonnier de ce qu’il est', 'Elle est écrite en alexandrins', 'Elle met en scène des rois', 'Elle se termine par un meurtre'], 0, 'Ce qui manque, c’est le geste : la catastrophe est un non-événement.'],
            ['Que fait La Mère pendant la visite ?', ['Elle rejoue le dimanche d’autrefois pour empêcher le pire', 'Elle interroge Louis sur sa santé', 'Elle reste silencieuse', 'Elle organise une fête'], 0, 'Son bavardage est une digue contre ce qui menace d’être dit.'],
            ['Quel lien Suzanne entretenait-elle avec son frère ?', ['Elle ne le connaissait que par ses « petits mots »', 'Elle lui rendait visite chaque année', 'Elle vivait avec lui', 'Elle ne savait pas qu’il existait'], 0, 'Ces messages laconiques sont au cœur de son reproche.'],
            ['La pièce tranche : Louis est présenté comme lâche.', ['Vrai', 'Faux'], 1, 'Le texte laisse ouverte l’hypothèse qu’il protège les siens en se taisant.'],
            ['Quelle formule revient constamment dans la bouche des personnages ?', ['« Ce que je veux dire, ce que je voulais dire »', '« Nous verrons demain »', '« Tout va bien »', '« Il faut se parler »'], 0, 'La reprise perpétuelle est la signature stylistique de Lagarce.'],
          ],
        },
        {
          titre: 'Gargantua',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Rabelais, 1534 — un géant, et tout le savoir de son siècle',
            cours: `Publié en **1534** sous le pseudonyme d’**Alcofribas Nasier** (anagramme de François Rabelais), *Gargantua* est le second livre écrit par Rabelais, mais il raconte la vie du **père** de Pantagruel. Parcours associé : **rire et savoir**.

## Le prologue et la « substantifique moelle »
Rabelais compare son livre aux **Silènes** : des boîtes grotesques qui contenaient des drogues précieuses. Il invite le lecteur à faire comme le chien avec l’os : briser la coquille pour en tirer la **substantifique moelle**. Autrement dit : sous la farce, cherchez le sens. Mais il ajoute aussitôt que tout cela n’était peut-être qu’un jeu — l’ambiguïté est constante et volontaire.

## Le récit
- **La naissance** : Gargamelle, après un repas de tripes, accouche par l’**oreille**. L’enfant crie « À boire ! ».
- **Les deux éducations** : d’abord les précepteurs sorbonnards, **Thubal Holoferne** et Jobelin Bridé, qui lui font apprendre par cœur des livres inutiles pendant des dizaines d’années ; puis l’humaniste **Ponocrates**, qui réforme tout — journée réglée, exercice physique, lectures commentées, hygiène, observation directe, apprentissage par le plaisir.
- **La guerre picrocholine** : une querelle de marchands de fouaces déclenche une guerre absurde ; **Picrochole**, roi voisin, se rêve empereur du monde. **Frère Jean des Entommeures**, moine truculent et efficace, défend l’abbaye à coups de bâton de croix.
- **L’abbaye de Thélème** : Gargantua l’offre à Frère Jean. Anti-monastère, mixte, riche, belle, sans horloge ni contrainte, avec une seule règle : « **Fais ce que voudras.** »

## Le rire
Gigantisme, énumérations vertigineuses, listes de jeux, obscénités, latin de cuisine, noms parlants. Le rire est chez Rabelais une **méthode** : il désacralise l’autorité, la scolastique, la guerre de conquête, la religion formaliste — et il rend joyeux le savoir humaniste.`,
          },
          questions: [
            ['Sous quel pseudonyme Rabelais publie-t-il ?', ['Alcofribas Nasier, anagramme de son nom', 'Maître Janotus', 'Ponocrates', 'Frère Jean'], 0, 'La prudence s’imposait face à la Sorbonne.'],
            ['Que désigne la « substantifique moelle » ?', ['Le sens profond caché sous l’apparence comique', 'La recette d’un plat', 'Le contenu des Silènes antiques uniquement', 'Le résumé du livre'], 0, 'Rabelais invite le lecteur à briser l’os pour en tirer le suc — tout en s’en amusant.'],
            ['Comment naît Gargantua ?', ['Par l’oreille de sa mère Gargamelle', 'D’un œuf', 'D’une fontaine', 'Dans une caverne'], 0, 'Il crie aussitôt « À boire ! » : le gigantisme est comique et symbolique.'],
            ['Quel précepteur humaniste réforme l’éducation de Gargantua ?', ['Ponocrates', 'Thubal Holoferne', 'Jobelin Bridé', 'Janotus de Bragmardo'], 0, 'Journée réglée, exercice physique, lectures commentées : c’est le programme humaniste.'],
            ['Quelle est l’origine de la guerre picrocholine ?', ['Une querelle de marchands de fouaces', 'Un mariage rompu', 'Un vol de terres', 'Une insulte religieuse'], 0, 'L’absurdité de la cause souligne l’absurdité de la guerre de conquête.'],
            ['Quelle est la seule règle de l’abbaye de Thélème ?', ['« Fais ce que voudras »', '« Prie et travaille »', '« Silence et jeûne »', '« Obéis à ton abbé »'], 0, 'Anti-monastère mixte, sans horloge ni contrainte, réservé aux gens bien nés et bien instruits.'],
            ['Le rire est chez Rabelais un simple divertissement sans portée.', ['Vrai', 'Faux'], 1, 'C’est une méthode : il désacralise l’autorité, la scolastique et la guerre.'],
            ['Qui est Frère Jean des Entommeures ?', ['Un moine truculent qui défend l’abbaye et reçoit Thélème', 'Un précepteur sorbonnard', 'Le roi voisin de Grandgousier', 'Le père de Gargantua'], 0, 'Il incarne l’action et le bon sens, contre la religion formaliste.'],
          ],
        },
        {
          titre: 'Gargantua - Partie 2',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Rabelais — pourquoi le savoir a besoin du rire',
            cours: `Cette seconde partie prend l’œuvre par son **parcours** : rire et savoir. Le lien entre les deux n’est pas décoratif — c’est la thèse même du livre.

## L’humanisme en actes
Le programme d’éducation de Ponocrates est un **manifeste** : contre l’apprentissage par cœur, l’observation ; contre le mépris du corps, la gymnastique et la natation ; contre le latin scolastique, les langues anciennes lues dans le texte ; contre la répétition, la conversation et le commentaire. C’est le rêve humaniste — l’homme complet, savant et sain, capable de juger par lui-même.

## Ce que vise la satire
- La **Sorbonne** et sa scolastique : Janotus de Bragmardo, venu réclamer les cloches, prononce un discours d’ivrogne bourré de fausse logique.
- La **guerre de conquête** : Picrochole partage le monde avant d’avoir gagné une bataille ; ses conseillers flattent, Grandgousier plaide pour la paix — page rarement égalée sur la responsabilité du prince.
- La **religion formaliste** : les moines qui prient sans agir, opposés à Frère Jean qui agit.
- La **justice** et les procédures, ailleurs dans l’œuvre.

## Le rire comme instrument
Rabelais rit **par le corps** (nourriture, boisson, sexe, excréments) : c’est ce que Bakhtine a appelé le rire **carnavalesque**, celui qui renverse les hiérarchies le temps d’une fête. Ce rire n’est pas une récréation entre deux leçons : il **détruit l’autorité** — on ne discute pas une croyance dont on rit, on s’en libère. Et il rend le savoir désirable au lieu de le rendre respectable.

## Thélème, utopie et limites
« Fais ce que voudras » suppose des gens « bien nés, bien instruits », capables de vouloir le bien. C’est donc une utopie **élitiste** : la liberté y est le fruit de l’éducation, pas un droit. Ce point est le meilleur angle de dissertation sur l’œuvre.

## Les axes de dissertation
- **Le rire empêche-t-il de penser, ou permet-il de penser ?**
- **Peut-on tout dire en riant ?** Rabelais a été censuré ; le rire l’a aussi protégé.
- **Thélème est-elle une utopie enviable ?**
- **Faut-il chercher un sens caché à toute œuvre comique ?** Le prologue pose la question et la laisse ouverte.`,
          },
          questions: [
            ['Que propose le programme d’éducation de Ponocrates ?', ['Observation, exercice physique, lectures commentées, hygiène', 'Apprentissage par cœur et répétition', 'Retraite silencieuse au monastère', 'Formation militaire exclusive'], 0, 'C’est le manifeste humaniste de l’homme complet, savant et sain.'],
            ['Qui vient réclamer les cloches de Notre-Dame dans un discours ridicule ?', ['Janotus de Bragmardo', 'Ponocrates', 'Frère Jean', 'Picrochole'], 0, 'La fausse logique de son discours est une satire de la scolastique.'],
            ['Quelle faute Picrochole commet-il ?', ['Il partage le monde avant d’avoir gagné une bataille', 'Il refuse de faire la guerre', 'Il épouse la fille de Grandgousier', 'Il fuit devant Frère Jean'], 0, 'La scène est une satire de la démesure guerrière et des conseillers flatteurs.'],
            ['Comment nomme-t-on le rire rabelaisien, par le corps et le renversement des hiérarchies ?', ['Le rire carnavalesque', 'Le rire satirique', 'Le rire jaune', 'Le rire élégiaque'], 0, 'La notion a été analysée par Bakhtine.'],
            ['Quelle limite l’utopie de Thélème présente-t-elle ?', ['Elle est réservée à des gens bien nés et bien instruits', 'Elle interdit les femmes', 'Elle impose un horaire strict', 'Elle exclut la lecture'], 0, 'La liberté y est le fruit de l’éducation, pas un droit universel.'],
            ['Quel effet le rire produit-il sur l’autorité selon Rabelais ?', ['Il la désacralise et libère la pensée', 'Il la renforce', 'Il la laisse intacte', 'Il la remplace par une autre'], 0, 'On ne discute pas une croyance dont on rit : on s’en libère.'],
            ['Le rire chez Rabelais est une pause entre deux passages sérieux.', ['Vrai', 'Faux'], 1, 'Il est l’instrument même de la critique et rend le savoir désirable.'],
            ['Quel personnage plaide pour la paix contre la guerre de conquête ?', ['Grandgousier', 'Picrochole', 'Janotus', 'Gargamelle'], 0, 'Sa lettre est l’une des grandes pages politiques du livre.'],
          ],
        },
        {
          titre: 'Les Caractères',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'La Bruyère, 1688 — la société vue comme un théâtre',
            cours: `Publiés en **1688** et augmentés jusqu’en 1696, *Les Caractères ou les Mœurs de ce siècle* de **Jean de La Bruyère** se présentent d’abord comme une traduction de Théophraste, avant de devenir une œuvre autonome. Le programme retient les **livres V à X**. Parcours associé : **la comédie sociale**.

## La forme
Ni traité, ni roman : des **remarques**. Maximes brèves, portraits, dialogues, anecdotes, réflexions d’une page. Le livre se lit dans le désordre et se compose pourtant : chaque remarque éclaire la précédente. La Bruyère revendique le fragment — « Tout est dit, et l’on vient trop tard » — et l’art de la **brièveté frappante**.

## Les livres au programme
**V. De la société et de la conversation** — les fâcheux, les bavards, les vaniteux du langage.
**VI. Des biens de fortune** — l’argent, les partisans, les financiers enrichis. Le portrait de **Giton** (le riche) et de **Phédon** (le pauvre) montre que le corps même dit la condition sociale.
**VII. De la ville** — la bourgeoisie qui singe la cour.
**VIII. De la cour** — le chef-d’œuvre du livre : « L’on s’élève à la cour, mais on n’y monte pas. » La cour est un **pays étranger** aux mœurs codées.
**IX. Des grands** — les puissants, leur mépris, leur inutilité.
**X. Du souverain ou de la république** — le pouvoir, la guerre, et l’image saisissante des paysans « animaux farouches » qui deviennent des hommes quand ils se lèvent.

## La méthode
La Bruyère **montre** au lieu de démontrer : un geste, un vêtement, une manière de parler suffisent à faire un caractère. Il nomme ses figures par des noms grecs (Giton, Phédon, Ménalque) pour se protéger, mais la cour de Louis XIV s’y reconnaissait — des « clés » circulaient pour identifier les modèles.`,
          },
          questions: [
            ['Quelle forme prennent Les Caractères ?', ['Des remarques brèves : maximes, portraits, anecdotes', 'Un traité systématique', 'Un roman à intrigue', 'Un recueil de lettres'], 0, 'Le livre se lit dans le désordre et se compose pourtant.'],
            ['Que montre le portrait de Giton et Phédon ?', ['Que le corps et les manières trahissent la condition sociale', 'Que la richesse rend vertueux', 'Que la pauvreté est un choix', 'Que les nobles sont ridicules'], 0, 'Giton est riche : il tousse, il occupe l’espace. Phédon est pauvre : il s’efface.'],
            ['Quelle formule résume la cour selon La Bruyère ?', ['« L’on s’élève à la cour, mais on n’y monte pas »', '« Tout est dit »', '« Le cœur a ses raisons »', '« Rien de trop »'], 0, 'La cour est un pays étranger avec ses codes et ses langues.'],
            ['Quels livres le programme retient-il ?', ['Les livres V à X', 'Les livres I à IV', 'Le livre XI seul', 'Tous les livres'], 0, 'De « De la société » à « Du souverain ou de la république ».'],
            ['Pourquoi La Bruyère donne-t-il des noms grecs à ses personnages ?', ['Pour se protéger, tout en laissant reconnaître ses modèles', 'Par goût de l’Antiquité seule', 'Pour imiter Homère', 'Parce qu’il traduit des textes grecs'], 0, 'Des « clés » circulaient pour identifier les modèles réels.'],
            ['Quelle phrase ouvre l’œuvre ?', ['« Tout est dit, et l’on vient trop tard »', '« Je chante l’homme »', '« Le monde est un théâtre »', '« Les hommes naissent libres »'], 0, 'Elle justifie le choix du fragment et de la brièveté frappante.'],
            ['La Bruyère démontre ses thèses par des raisonnements suivis.', ['Vrai', 'Faux'], 1, 'Il montre plutôt qu’il ne démontre : un geste ou un vêtement suffisent à faire un caractère.'],
            ['Quelle image saisissante La Bruyère donne-t-il des paysans ?', ['Des « animaux farouches » qui se révèlent hommes en se levant', 'Des enfants heureux', 'Des soldats en puissance', 'Des ombres invisibles'], 0, 'C’est l’une des pages les plus fortes du livre X.'],
          ],
        },
        {
          titre: 'Déclaration des droits de la femme et de la citoyenne',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Olympe de Gouges, 1791 — réécrire la Déclaration pour y mettre les femmes',
            cours: `Publiée en **septembre 1791**, la *Déclaration des droits de la femme et de la citoyenne* d’**Olympe de Gouges** est la réponse directe à la **Déclaration des droits de l’homme et du citoyen** de 1789, dont les femmes étaient absentes. Parcours associé : **écrire et combattre pour l’égalité**.

## La structure
- Une **dédicace** à la reine **Marie-Antoinette**, qu’elle appelle à soutenir la cause des femmes.
- Un **préambule** calqué sur celui de 1789, où les « mères, filles, sœurs, représentantes de la nation » demandent à être constituées en Assemblée.
- **Dix-sept articles**, dans l’ordre exact de la Déclaration de 1789, réécrits pour y inclure les femmes.
- Un **postambule** au ton tout différent : « **Femme, réveille-toi ; le tocsin de la raison se fait entendre dans tout l’univers ; reconnais tes droits.** »
- Un projet de **contrat social entre l’homme et la femme**, qui règle mariage, biens et enfants naturels.

## L’article le plus célèbre
**Article X** : « **La femme a le droit de monter sur l’échafaud ; elle doit avoir également celui de monter à la tribune.** » L’argument est imparable : la loi punit les femmes comme des citoyennes, elle doit donc les représenter comme telles. La phrase est devenue tragiquement prophétique — Olympe de Gouges est **guillotinée le 3 novembre 1793**.

## La stratégie d’écriture
Le **pastiche** est l’arme principale : reprendre mot pour mot le texte fondateur en y ajoutant « et la citoyenne » rend l’oubli visible, sans avoir à le démontrer. Le postambule change de registre — apostrophe, exclamation, ironie, appel direct — parce que la loi ne suffit pas : il faut aussi convaincre les femmes elles-mêmes.

## Qui elle était
Née Marie Gouze à Montauban en 1748, autrice de théâtre, abolitionniste (*L’Esclavage des Noirs*), révolutionnaire modérée, girondine. Sa Déclaration n’a eu aucun effet légal immédiat : les femmes n’obtiendront le droit de vote en France qu’en **1944**.`,
          },
          questions: [
            ['À quel texte la Déclaration d’Olympe de Gouges répond-elle ?', ['À la Déclaration des droits de l’homme et du citoyen de 1789', 'Au Code civil', 'Au Contrat social de Rousseau', 'À la Constitution de 1791 seule'], 0, 'Les femmes en étaient absentes : le pastiche rend cet oubli visible.'],
            ['Combien d’articles compte la Déclaration ?', ['Dix-sept', 'Dix', 'Trente', 'Cinq'], 0, 'Exactement le même nombre que le texte de 1789, dans le même ordre.'],
            ['Que dit l’article X ?', ['La femme a le droit de monter sur l’échafaud, elle doit avoir celui de monter à la tribune', 'Toutes les femmes sont électrices', 'Le mariage est un contrat libre', 'L’instruction est due à toutes'], 0, 'Punie comme citoyenne, la femme doit être représentée comme telle.'],
            ['À qui la dédicace est-elle adressée ?', ['À la reine Marie-Antoinette', 'À l’Assemblée nationale', 'À Robespierre', 'Aux femmes du peuple'], 0, 'Olympe de Gouges espérait un soutien venu du sommet.'],
            ['Quelle phrase ouvre le postambule ?', ['« Femme, réveille-toi ; le tocsin de la raison se fait entendre »', '« Les hommes naissent libres et égaux »', '« Écrasons l’infâme »', '« Liberté, égalité, fraternité »'], 0, 'Le registre change : il s’agit de convaincre les femmes elles-mêmes.'],
            ['Quel sort connut Olympe de Gouges ?', ['Elle fut guillotinée en 1793', 'Elle mourut en exil', 'Elle fut emprisonnée puis libérée', 'Elle vécut jusqu’à l’Empire'], 0, 'L’article X en devient tragiquement prophétique.'],
            ['La Déclaration a obtenu un effet légal immédiat.', ['Vrai', 'Faux'], 1, 'Les femmes n’obtiendront le droit de vote en France qu’en 1944.'],
            ['Quel autre combat Olympe de Gouges a-t-elle mené ?', ['L’abolition de l’esclavage', 'La réforme de l’armée', 'La liberté du commerce', 'La séparation des Églises et de l’État'], 0, 'Sa pièce L’Esclavage des Noirs le montre.'],
          ],
        },
        {
          titre: 'Déclaration des droits de la femme et de la citoyenne - Partie 2',
          axe: 'Anciens programmes',
          lecon: {
            titre: 'Olympe de Gouges — écrire, c’est déjà combattre',
            cours: `Cette seconde partie prend le texte par son **parcours** : écrire et combattre pour l’égalité. La question est celle de l’**efficacité** d’un texte — que peut faire une déclaration sans pouvoir ?

## Le pastiche comme arme
Reprendre la forme du texte adverse est plus efficace que le réfuter. En calquant préambule, articles et numérotation, Olympe de Gouges oblige le lecteur à faire lui-même la comparaison : l’ajout minuscule de « et la citoyenne » rend l’exclusion criante. C’est une **démonstration par la forme** — le fond n’a presque pas besoin d’être plaidé.

## Trois registres, trois publics
- Le registre **juridique** des articles vise les législateurs : il parle leur langue, il est donc irréfutable dans ses termes.
- Le registre **polémique** du postambule vise les femmes : apostrophes, questions, impératifs, ironie mordante contre celles qui se contentent des « avantages » de la séduction.
- Le registre **didactique** du contrat social propose des solutions concrètes : biens communs, reconnaissance des enfants naturels, droit de nommer le père.

## Ce que le texte demande vraiment
L’égalité **politique** (voter, être élue, participer à la loi), l’égalité **civile** (propriété, héritage, mariage), l’égalité **d’expression** (parler en public, publier), et la reconnaissance des femmes comme **sujets de droit** et non comme protégées. C’est un programme complet, et il ne sera réalisé qu’au XXe siècle.

## Les contradictions et les limites
Le texte s’adresse à une reine que la Révolution jugera ; il conserve un vocabulaire de la « nature » et de la « sensibilité » féminine ; il vise d’abord les femmes instruites. Ces tensions ne l’affaiblissent pas comme document : elles le **situent** dans son époque, et un bon devoir les mentionne.

## Les axes de dissertation
- **Un texte peut-il changer la loi ?** Pas directement : il change ce qui peut être dit.
- **La forme du pastiche est-elle plus efficace que l’argumentation directe ?**
- **Faut-il être entendu de son temps pour avoir raison ?** Le texte, ignoré en 1791, est aujourd’hui au programme du bac.
- **L’écriture est-elle un combat ?** Le prix payé par l’autrice répond.`,
          },
          questions: [
            ['Pourquoi le pastiche de la Déclaration de 1789 est-il efficace ?', ['Il rend l’exclusion visible sans avoir à la démontrer', 'Il flatte les législateurs', 'Il simplifie le droit', 'Il évite la censure'], 0, 'C’est une démonstration par la forme : le lecteur fait lui-même la comparaison.'],
            ['À qui s’adresse le postambule ?', ['Aux femmes elles-mêmes', 'Au roi', 'Aux juges', 'Aux étrangers'], 0, 'Apostrophes, impératifs et ironie : il s’agit de les réveiller.'],
            ['Que propose le contrat social entre l’homme et la femme ?', ['Le partage des biens et la reconnaissance des enfants naturels', 'La suppression du mariage', 'Le vote des femmes uniquement', 'L’égalité salariale'], 0, 'C’est la partie la plus concrète et la plus juridique du texte.'],
            ['Quelles égalités le texte réclame-t-il ?', ['Politique, civile et d’expression', 'Seulement politique', 'Seulement économique', 'Seulement dans l’éducation'], 0, 'Un programme complet, réalisé seulement au XXe siècle.'],
            ['Quelle limite peut-on relever dans le texte ?', ['Il s’adresse d’abord aux femmes instruites et garde un vocabulaire de la « nature » féminine', 'Il refuse le droit de vote', 'Il défend l’esclavage', 'Il ignore la question du mariage'], 0, 'Ces tensions situent le texte dans son époque : un bon devoir les mentionne.'],
            ['Quel est l’effet politique immédiat de la Déclaration ?', ['Presque aucun : elle est ignorée en 1791', 'Elle est votée par l’Assemblée', 'Elle inspire la Constitution de 1793', 'Elle obtient le droit de vote'], 0, 'Elle change pourtant ce qui peut être dit — et elle est aujourd’hui au programme.'],
            ['Le registre du texte est uniforme du début à la fin.', ['Vrai', 'Faux'], 1, 'Juridique dans les articles, polémique dans le postambule, didactique dans le contrat social.'],
            ['Que prouve le destin d’Olympe de Gouges quant au parcours ?', ['Qu’écrire pour l’égalité pouvait coûter la vie', 'Que la Révolution soutenait les femmes', 'Que le texte fut aussitôt appliqué', 'Que l’écriture est sans risque'], 0, 'Guillotinée en 1793 : l’écriture fut bien un combat.'],
          ],
        },
      ],
    },
  ],
}
