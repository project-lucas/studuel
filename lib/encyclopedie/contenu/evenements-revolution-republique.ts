// -----------------------------------------------------------------------------
// RÉVOLUTION — LA RÉPUBLIQUE. Le cœur du gros morceau : la monarchie tombe
// (10 août 1792), l'armée de la Révolution tient (Valmy), la République est
// proclamée, le roi est jugé et exécuté, la guerre civile s'allume en Vendée,
// le gouvernement d'exception s'installe, l'esclavage est aboli, et Thermidor
// arrête tout.
//
// NI LÉGENDE DORÉE, NI LÉGENDE NOIRE — les mécanismes, datés et chiffrés
// (docs/encyclopedie.md, § 3). Les six cents Suisses des Tuileries et les
// treize cents morts de Septembre sont dits ; les dix-sept mille condamnations
// de la Terreur aussi, avec le contexte qui les explique et qui ne les excuse
// pas ; les cent soixante-dix mille morts de Vendée sont donnés pour ce qu'ils
// sont — une ESTIMATION d'historien, sur laquelle la recherche discute encore.
// L'exécution de Louis XVI est racontée sur le ton grave qu'elle demande.
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_REVOLUTION_REPUBLIQUE: Evenement[] = [
  {
    id: 'journee-du-10-aout-1792',
    volet: 'evenements',
    nom: 'La journée du 10 août 1792',
    date: '10 août 1792',
    tri: 1792,
    periode: 'revolution',
    emoji: '⚔️',
    lieu: 'Paris, palais des Tuileries',
    accroche:
      'Paris prend les Tuileries, les Suisses meurent à leur poste, et huit siècles de monarchie s’arrêtent en une matinée.',
    citations: [
      {
        texte:
          'Livrer la ville de Paris à une exécution militaire et à une subversion totale.',
        qui: 'Le duc de Brunswick',
        contexte:
          'Manifeste signé à Coblence le 25 juillet 1792 par le chef des armées austro-prussiennes, connu à Paris le 1ᵉʳ août.',
        sens:
          'Menacer Paris de destruction pour protéger le roi a eu l’effet exactement inverse : le texte a convaincu les Parisiens que Louis XVI était de mèche avec l’envahisseur.',
      },
      {
        texte:
          'Sire, Votre Majesté n’a pas cinq minutes à perdre ; il n’y a de sûreté pour elle que dans l’Assemblée nationale.',
        qui: 'Roederer, procureur-syndic du département de Paris',
        contexte:
          'Aux Tuileries, vers 8 heures du matin le 10 août 1792, pour convaincre le roi de quitter le palais.',
      },
      {
        texte:
          'Le Roi ordonne aux Suisses de déposer à l’instant leurs armes et de se retirer dans leurs casernes.',
        qui: 'Louis XVI',
        contexte:
          'Billet écrit depuis la loge où la famille royale s’est réfugiée à l’Assemblée, alors que le combat fait rage aux Tuileries.',
        sens:
          'L’ordre arrive trop tard et scelle le sort de la garde suisse : sortis en colonnes, désarmés, les soldats sont massacrés dans le jardin et dans les rues.',
      },
      {
        texte:
          'Pour les vaincre, il nous faut de l’audace, encore de l’audace, toujours de l’audace, et la France est sauvée.',
        qui: 'Danton',
        contexte:
          'À l’Assemblée législative, le 2 septembre 1792, à l’annonce de la chute de Verdun.',
      },
    ],
    reperes: [
      'La fuite de Varennes (juin 1791) a détruit la confiance : le roi est rentré prisonnier de son peuple.',
      'La guerre est déclarée le 20 avril 1792 ; en juillet, l’Assemblée proclame « la patrie en danger ».',
      'Le manifeste de Brunswick menace Paris de destruction si la famille royale est touchée.',
      'Dans la nuit du 9 au 10 août, une Commune insurrectionnelle prend l’Hôtel de Ville.',
      'Environ 600 des 900 Suisses de la garde sont tués ; 376 assaillants tombent aussi.',
      'Le roi est suspendu, enfermé au Temple le 13 août : la monarchie capétienne s’achève.',
    ],
    causes: [
      'La fuite de Varennes en juin 1791 : la nation découvre que le roi cherchait à quitter la France pour revenir soutenu par les armées étrangères.',
      'Le veto opposé par Louis XVI aux décrets contre les prêtres réfractaires et au camp de 20 000 fédérés sous Paris : on le surnomme « Monsieur Veto ».',
      'La guerre déclarée le 20 avril 1792 et les défaites du printemps, qui font soupçonner une trahison au sommet.',
      'Le manifeste de Brunswick, connu à Paris le 1ᵉʳ août, qui menace la capitale d’une « exécution militaire ».',
      'L’arrivée des fédérés de Marseille et de Brest, troupes de province décidées à en finir avec le palais.',
      'L’échec de la journée du 20 juin 1792, où la foule avait envahi les Tuileries sans rien obtenir : la prochaine fois sera armée.',
      'La formation, dans la nuit du 9 au 10 août, d’une Commune insurrectionnelle qui prend l’Hôtel de Ville et le commandement de la garde nationale.',
    ],
    recit: [
      {
        titre: 'Un roi qu’on ne croit plus',
        texte:
          'Depuis **Varennes**, juin 1791, plus personne n’ignore que le roi a tenté de fuir. La Constitution de 1791 le maintient pourtant sur le trône, avec un **droit de veto** dont il se sert deux fois en 1792 : contre la déportation des prêtres réfractaires, contre le camp de vingt mille **fédérés** aux portes de Paris. Le 20 avril, l’Assemblée déclare la guerre au roi de Bohême et de Hongrie — l’empereur d’Autriche, frère de Marie-Antoinette. Les premières semaines sont désastreuses : régiments qui débandent, officiers nobles qui passent à l’ennemi. Le 20 juin, la foule envahit les Tuileries et coiffe le roi d’un bonnet rouge ; il boit à la nation, ne cède rien, et la journée se termine sans résultat. Le 11 juillet, l’Assemblée proclame **« la patrie est en danger »** : tous les hommes valides sont appelés, les mairies s’ouvrent aux engagements. Le 30 juillet, cinq cents Marseillais entrent dans Paris en chantant le *Chant de guerre pour l’armée du Rhin*, écrit trois mois plus tôt à Strasbourg par Rouget de Lisle. Paris le baptise **La Marseillaise**.',
      },
      {
        titre: 'Le manifeste qui met le feu',
        texte:
          'Le **25 juillet 1792**, le duc de **Brunswick**, chef des armées austro-prussiennes, signe à Coblence un manifeste rédigé par des émigrés français. Il annonce que si la famille royale subit « la moindre violence », Paris sera livré à « une exécution militaire et à une subversion totale ». Le texte parvient dans la capitale le 1ᵉʳ août. L’intention était d’effrayer ; l’effet est inverse. Le manifeste prouve aux Parisiens ce qu’ils soupçonnaient : l’ennemi avance pour rétablir le roi, donc le roi est du côté de l’ennemi. Quarante-sept des quarante-huit **sections** de Paris réclament la déchéance. L’Assemblée temporise. Les sections fixent alors un ultimatum au 9 août à minuit, et se préparent à agir seules.',
      },
      {
        titre: 'Quatre heures aux Tuileries',
        texte:
          'Dans la nuit du 9 au 10, les commissaires des sections s’installent à l’Hôtel de Ville et forment une **Commune insurrectionnelle** ; le commandant de la garde nationale, Mandat, est convoqué et abattu. Au petit matin, fédérés marseillais et bataillons des faubourgs marchent sur le palais. Les Tuileries sont défendues par environ **900 Suisses**, quelques gentilshommes et une garde nationale qui bascule presque aussitôt. Vers 8 heures, le procureur **Roederer** convainc le roi de se réfugier avec sa famille à l’Assemblée, à deux cents mètres de là. Le combat commence sans lui, vers 10 heures : les Suisses tirent, dégagent la cour, puis reçoivent du roi l’ordre écrit de déposer les armes. Ils sortent en colonne et sont massacrés — dans le jardin, sur les quais, jusque dans les rues voisines. **Environ 600** d’entre eux meurent ce jour-là. Côté assaillants, les listes d’indemnités recensent **376 tués**, en majorité des artisans des faubourgs et des fédérés du Midi.',
      },
      {
        titre: 'La monarchie tombe, la peur reste',
        texte:
          'Le soir même, l’Assemblée **suspend** le roi et convoque une **Convention nationale** élue au suffrage universel masculin. Le 13 août, la famille royale entre à la prison du **Temple**. Le 17, un tribunal extraordinaire est créé pour juger les « crimes du 10 août ». Mais la guerre continue : Longwy tombe le 23 août, **Verdun le 2 septembre**, et la route de Paris paraît ouverte. Ce jour-là commencent les **massacres de Septembre** : du 2 au 6, des bandes armées forcent les prisons de la capitale et exécutent les détenus après des simulacres de jugement — prêtres réfractaires, aristocrates, mais aussi prisonniers de droit commun, femmes, adolescents. Environ **1 300 personnes** sont tuées, soit près de la moitié des détenus parisiens ; la princesse de Lamballe est massacrée le 3. Aucune autorité n’arrête le mouvement ; la Commune le couvre, l’Assemblée détourne les yeux. C’est la face la plus sombre de l’été 1792, et elle pèsera sur toute la suite : les massacres deviendront l’argument de tous les adversaires de la Révolution, et un souvenir gênant pour ses partisans.',
      },
    ],
    consequences: [
      'Le roi est suspendu le 10 août, puis enfermé au Temple le 13 : la monarchie constitutionnelle de 1791 est morte.',
      'Une Convention nationale est convoquée, élue au suffrage universel masculin — une première en Europe.',
      'Danton devient ministre de la Justice ; la Commune insurrectionnelle de Paris tient la capitale.',
      'Les massacres de Septembre (2-6 septembre 1792) font environ 1 300 morts dans les prisons parisiennes.',
      'Les biens des émigrés sont mis en vente et la déportation des prêtres réfractaires est décrétée le 26 août.',
      'Huit siècles de monarchie capétienne s’achèvent : la royauté sera formellement abolie le 21 septembre 1792.',
    ],
    chiffres: [
      { valeur: '600', quoi: 'Suisses tués sur les 900 qui défendaient le palais' },
      { valeur: '376', quoi: 'assaillants tués, selon les listes d’indemnités' },
      { valeur: '1 300', quoi: 'morts dans les massacres de Septembre' },
      { valeur: '8 siècles', quoi: 'de monarchie capétienne, depuis 987' },
    ],
    chrono: [
      { date: '20 avril 1792', fait: 'La France déclare la guerre à l’Autriche.' },
      { date: '20 juin 1792', fait: 'La foule envahit les Tuileries sans obtenir la déchéance.' },
      { date: '11 juillet 1792', fait: 'L’Assemblée proclame « la patrie est en danger ».' },
      { date: '30 juillet 1792', fait: 'Les fédérés marseillais entrent dans Paris en chantant.' },
      { date: '1ᵉʳ août 1792', fait: 'Le manifeste de Brunswick est connu à Paris.' },
      { date: 'nuit du 9 au 10 août', fait: 'La Commune insurrectionnelle prend l’Hôtel de Ville.' },
      { date: '10 août 1792', fait: 'Assaut des Tuileries ; le roi est suspendu.' },
      { date: '13 août 1792', fait: 'La famille royale est enfermée au Temple.' },
      { date: '2-6 septembre 1792', fait: 'Massacres dans les prisons de Paris.' },
      { date: '21 septembre 1792', fait: 'La Convention abolit la royauté.' },
    ],
    leSaisTu:
      'Les Suisses tombés aux Tuileries ont leur monument, et il est en Suisse : le **Lion de Lucerne**, taillé en 1821 dans une paroi de rocher, un fauve mourant une patte posée sur un bouclier fleurdelisé. Mark Twain l’a appelé « le morceau de pierre le plus triste et le plus émouvant du monde ».',
    aRetenir: [
      'Le 10 août 1792, les sections parisiennes et les fédérés prennent le palais des Tuileries.',
      'Le manifeste de Brunswick du 25 juillet 1792 a précipité l’insurrection en menaçant Paris.',
      'Environ 600 gardes suisses sont tués ; le roi est suspendu puis emprisonné au Temple le 13 août.',
      'Les massacres de Septembre (2-6 septembre 1792) font environ 1 300 morts dans les prisons de Paris.',
      'La journée ouvre la voie à la Convention et à l’abolition de la royauté, le 21 septembre 1792.',
    ],
    mots: [
      {
        mot: 'Fédérés',
        sens: 'Gardes nationaux venus de province à Paris ; ceux de Marseille ont donné son nom à La Marseillaise.',
      },
      {
        mot: 'Commune insurrectionnelle',
        sens: 'Municipalité révolutionnaire de Paris installée par les sections dans la nuit du 9 au 10 août 1792.',
      },
      {
        mot: 'Suspension',
        sens: 'Retrait provisoire de ses pouvoirs au roi, décidé le 10 août en attendant que la Convention décide de son sort.',
      },
      {
        mot: 'Section',
        sens: 'Quartier de Paris doté d’une assemblée de citoyens ; il y en avait quarante-huit en 1792.',
      },
    ],
    lies: [
      'fuite-de-varennes',
      'louis-xvi',
      'danton',
      'proclamation-de-la-republique',
      'bataille-de-valmy',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      '10 août',
      'Tuileries',
      'gardes suisses',
      'Brunswick',
      'fédérés',
      'Marseillaise',
      'Commune insurrectionnelle',
      'massacres de Septembre',
      'Temple',
      'chute de la monarchie',
    ],
  },
  {
    id: 'bataille-de-valmy',
    volet: 'evenements',
    nom: 'La canonnade de Valmy',
    date: '20 septembre 1792',
    tri: 1792,
    periode: 'revolution',
    emoji: '🥁',
    lieu: 'Valmy, plaine de Champagne',
    accroche:
      'Une canonnade de trois heures dans la boue champenoise : l’armée de la Révolution ne recule pas, et l’Europe comprend que tout a changé.',
    citations: [
      {
        texte: 'Vive la Nation !',
        qui: 'Kellermann et ses soldats',
        contexte:
          'Sur le plateau de Valmy, le 20 septembre 1792 : le général lève son chapeau à la pointe de son épée, vingt mille voix reprennent le cri.',
        sens:
          'Les armées d’Ancien Régime criaient « Vive le Roi ». Le mot d’ordre change de maître : ce n’est plus pour un homme qu’on se bat, c’est pour un pays.',
      },
      {
        texte:
          'De ce lieu et de ce jour date une ère nouvelle dans l’histoire du monde, et vous pourrez dire : j’y étais.',
        qui: 'Goethe',
        contexte:
          'Le soir du 20 septembre 1792, au bivouac prussien, aux officiers abattus qui lui demandaient ce qu’il pensait de la journée.',
        sens:
          'L’écrivain accompagnait le duc de Saxe-Weimar. Il a compris avant les généraux qu’une armée de citoyens venait de tenir devant la meilleure infanterie d’Europe.',
      },
      {
        texte: 'Nous ne nous battrons pas ici.',
        qui: 'Le duc de Brunswick',
        contexte:
          'Après trois heures de canonnade, en renonçant à lancer l’infanterie prussienne à l’assaut du plateau.',
      },
    ],
    reperes: [
      'Longwy tombe le 23 août, Verdun le 2 septembre : la route de Paris paraît ouverte aux Prussiens.',
      'Kellermann et Dumouriez font leur jonction et barrent la route, en arrière de l’ennemi.',
      'Le 20 septembre, le brouillard se lève vers midi : c’est un duel d’artillerie, pas un choc d’infanterie.',
      'Environ 20 000 coups de canon tirés pour 300 morts français et 184 prussiens.',
      'Brunswick renonce à l’assaut et se retire le 30 septembre : la France est dégagée.',
      'Le lendemain de la bataille, la Convention abolit la royauté.',
    ],
    causes: [
      'L’invasion austro-prussienne lancée en août 1792 pour rétablir Louis XVI dans ses pouvoirs.',
      'La chute de Longwy (23 août) puis de Verdun (2 septembre) : la dernière place forte avant Paris est tombée.',
      'La perte des défilés de l’Argonne, en particulier celui de la Croix-aux-Bois le 12 septembre, qui oblige Dumouriez à se replier vers Sainte-Menehould.',
      'La jonction, le 19 septembre, de l’armée de Dumouriez et de celle de Kellermann venue de Metz.',
      'L’artillerie française du système Gribeauval, la meilleure d’Europe, dont les officiers techniciens ne sont pas partis à l’émigration.',
      'Une armée prussienne épuisée par trois semaines de pluie, de boue, de dysenterie et de ravitaillement défaillant.',
    ],
    recit: [
      {
        titre: 'La route de Paris',
        texte:
          'Le 19 août 1792, les Prussiens de **Brunswick** franchissent la frontière avec environ quatre-vingt mille hommes, accompagnés d’émigrés français et de contingents autrichiens. Ils comptent sur une promenade militaire : les meilleurs régiments français ont perdu leurs officiers nobles, les volontaires de 1791 n’ont jamais vu le feu, et l’on parle à Coblence d’être à Paris avant l’automne. **Longwy** capitule le 23 août, **Verdun** le 2 septembre. La nouvelle déclenche à Paris la panique qui débouche sur les massacres des prisons. Entre l’ennemi et la capitale, il n’y a plus que la forêt d’**Argonne**, où **Dumouriez** tient les défilés comme on tient des portes. Le 12 septembre, celui de la Croix-aux-Bois est enlevé ; l’armée française doit reculer en désordre. Dumouriez fait alors une manœuvre inattendue : au lieu de se replier sur Paris, il glisse vers le sud et se place **derrière** les Prussiens, entre eux et leurs magasins. Le 19 septembre, **Kellermann** le rejoint avec l’armée de Metz.',
      },
      {
        titre: 'Trois heures de canons dans le brouillard',
        texte:
          'Le **20 septembre au matin**, un brouillard épais couvre la plaine. Kellermann a pris position sur un plateau à peine bombé, autour d’un **moulin à vent**, avec environ trente-six mille hommes ; Brunswick en aligne trente-quatre mille. Vers midi, la brume se lève et les deux artilleries s’ouvrent le feu. Ce n’est pas une bataille au sens des manuels : presque aucun corps à corps, pas de charge décisive, un **duel de canons** qui durera trois heures et consommera près de **vingt mille boulets**. Les pièces françaises, du système **Gribeauval**, tirent plus vite et plus juste. Un caisson de munitions explose près du moulin ; les rangs français vacillent. Kellermann lève alors son chapeau à la pointe de son épée et crie **« Vive la Nation ! »** ; le cri court d’un bataillon à l’autre. Brunswick met son infanterie en marche, la regarde avancer sous la mitraille, et l’arrête à mi-pente.',
      },
      {
        titre: 'Ce qu’une armée de citoyens vient de prouver',
        texte:
          'Les pertes sont dérisoires pour l’époque : environ **300 morts français** et **184 prussiens**. Militairement, Valmy n’est qu’un engagement indécis. Politiquement, c’est un séisme. Ce que Brunswick attendait — la débandade d’une armée sans noblesse — ne s’est pas produit : les volontaires ont tenu sous le feu, épaule contre épaule avec les régiments de ligne. Le vieux calcul des cours d’Europe, selon lequel un peuple sans officiers de naissance ne peut pas faire la guerre, s’effondre en un après-midi. **Goethe**, présent au bivouac prussien dans la suite du duc de Saxe-Weimar, le dit le soir même à des officiers qui ne comprennent pas encore. Les Prussiens, malades, sans vivres, entament leur retraite le **30 septembre** et repassent la frontière en octobre.',
      },
      {
        titre: 'Le lendemain : la République',
        texte:
          'La nouvelle arrive à Paris alors que la **Convention nationale**, élue en septembre, vient de se réunir pour la première fois — le 20 septembre également. Le **21**, elle abolit la royauté ; le **22**, elle date ses actes de l’**an I de la République**. Les deux événements ne sont pas liés par un décret, mais ils le sont dans les esprits : la République naît le surlendemain d’une victoire, et elle est d’emblée une République en armes. Six semaines plus tard, Dumouriez bat les Autrichiens à **Jemmapes** (6 novembre) et entre en Belgique ; la Savoie et Nice sont occupées. La guerre défensive est devenue offensive. Dumouriez, lui, passera à l’ennemi en avril 1793 — la Révolution dévorera plusieurs de ses vainqueurs.',
      },
    ],
    consequences: [
      'Les Prussiens renoncent à marcher sur Paris et repassent la frontière en octobre 1792.',
      'La Convention, réunie le 20 septembre, abolit la royauté le 21 et proclame l’an I de la République le 22.',
      'La preuve est faite qu’une armée de citoyens peut tenir devant les professionnels des monarchies.',
      'La guerre devient offensive : Jemmapes le 6 novembre 1792, la Belgique, la Savoie et Nice occupées.',
      'Kellermann sera fait duc de Valmy par Napoléon ; Dumouriez, lui, trahira en avril 1793.',
      'La phrase de Goethe devient la formule par laquelle l’Europe a daté sa propre entrée dans un autre siècle.',
    ],
    chiffres: [
      { valeur: '36 000', quoi: 'Français sur le plateau, face à 34 000 Prussiens' },
      { valeur: '20 000', quoi: 'coups de canon tirés dans la journée' },
      { valeur: '300', quoi: 'morts français — 184 du côté prussien' },
      { valeur: '1 jour', quoi: 'entre Valmy et l’abolition de la royauté' },
    ],
    chrono: [
      { date: '19 août 1792', fait: 'Les Prussiens de Brunswick franchissent la frontière.' },
      { date: '23 août 1792', fait: 'Longwy capitule.' },
      { date: '2 septembre 1792', fait: 'Verdun tombe : la route de Paris paraît ouverte.' },
      { date: '12 septembre 1792', fait: 'Perte du défilé de la Croix-aux-Bois, en Argonne.' },
      { date: '19 septembre 1792', fait: 'Jonction de Kellermann et de Dumouriez.' },
      { date: '20 septembre 1792', fait: 'Canonnade de Valmy ; les Prussiens n’attaquent pas.' },
      { date: '21-22 septembre 1792', fait: 'Abolition de la royauté, an I de la République.' },
      { date: '30 septembre 1792', fait: 'Début de la retraite prussienne.' },
      { date: '6 novembre 1792', fait: 'Victoire de Jemmapes : la guerre devient offensive.' },
    ],
    leSaisTu:
      'Kellermann a vécu trente ans de plus, est devenu maréchal d’Empire et **duc de Valmy**. Mort en 1820, il a demandé par testament que son cœur soit enterré sur le plateau, au milieu de ses canonniers. Il y est : sous un monument, à côté du moulin, à cinq cents mètres de l’endroit où il avait levé son chapeau.',
    aRetenir: [
      'Le 20 septembre 1792, Kellermann et Dumouriez arrêtent l’invasion prussienne à Valmy.',
      'C’est une canonnade — environ 20 000 boulets — et non un assaut : 300 morts français, 184 prussiens.',
      'Kellermann lance le cri « Vive la Nation ! », qui remplace le « Vive le Roi » des armées d’Ancien Régime.',
      'Goethe, témoin au bivouac prussien, y voit le soir même le début d’une ère nouvelle.',
      'Le lendemain, 21 septembre 1792, la Convention abolit la royauté.',
    ],
    mots: [
      {
        mot: 'Canonnade',
        sens: 'Échange prolongé de tirs d’artillerie, sans que l’infanterie en vienne au contact.',
      },
      {
        mot: 'Système Gribeauval',
        sens: 'Réforme de l’artillerie française (1765) : canons plus légers, pièces interchangeables, tir plus rapide.',
      },
      {
        mot: 'Volontaires',
        sens: 'Citoyens engagés en 1791-1792, mêlés aux régiments de ligne pour former les armées de la Révolution.',
      },
    ],
    lies: [
      'journee-du-10-aout-1792',
      'proclamation-de-la-republique',
      'lazare-carnot',
      'execution-de-louis-xvi',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Valmy',
      'Kellermann',
      'Dumouriez',
      'Brunswick',
      'Goethe',
      'canonnade',
      'Argonne',
      'Vive la Nation',
      'moulin',
    ],
  },
  {
    id: 'proclamation-de-la-republique',
    volet: 'evenements',
    nom: 'La proclamation de la République',
    date: '21-22 septembre 1792',
    tri: 1792,
    periode: 'revolution',
    emoji: '📣',
    lieu: 'Paris, salle du Manège',
    accroche:
      'Le 21 septembre 1792, la Convention abolit la royauté en une phrase ; le lendemain, la France date ses actes de l’an I de la République.',
    citations: [
      {
        texte: 'La Convention nationale décrète que la royauté est abolie en France.',
        qui: 'La Convention nationale',
        contexte:
          'Décret voté par acclamation, sans une voix contre, à la séance du 21 septembre 1792 — la première séance utile de l’assemblée.',
        sens:
          'Une seule phrase met fin à huit siècles de monarchie capétienne. Le mot « République » n’y figure pas encore : il viendra le lendemain.',
      },
      {
        texte:
          'Il est une chose que vous ne pouvez ajourner à demain, que vous ne pouvez différer d’un seul instant : c’est l’abolition de la royauté.',
        qui: 'Collot d’Herbois',
        contexte: 'À la tribune de la Convention, séance du 21 septembre 1792.',
      },
      {
        texte:
          'Les rois sont dans l’ordre moral ce que les monstres sont dans l’ordre physique.',
        qui: 'L’abbé Grégoire',
        contexte:
          'Dans le même débat du 21 septembre 1792, pour couper court à l’idée d’un long rapport préalable.',
        sens:
          'Un prêtre catholique, député et évêque constitutionnel, demande l’abolition de la royauté : la République de 1792 n’est pas seulement l’affaire des incroyants.',
      },
      {
        texte: 'La République française est une et indivisible.',
        qui: 'La Convention nationale',
        contexte:
          'Décret du 25 septembre 1792, adopté pour couper court à l’accusation de vouloir fédéraliser la France.',
        sens:
          'La formule est entrée dans toutes les constitutions françaises depuis : l’unité du territoire et de la loi est posée en même temps que la République.',
      },
    ],
    reperes: [
      'La Convention est élue en septembre 1792 au suffrage universel masculin, à deux degrés : 749 députés.',
      'Elle se réunit pour la première fois le 20 septembre 1792, jour de Valmy.',
      'Le 21 septembre, elle abolit la royauté par acclamation, sans un seul vote contraire.',
      'Le 22 septembre, elle décide que les actes publics seront datés de « l’an premier de la République ».',
      'Le 25 septembre, elle décrète la République « une et indivisible ».',
      'Le mot « république » n’avait plus désigné la France depuis… jamais : c’est une première.',
    ],
    causes: [
      'La journée du 10 août 1792, qui a suspendu le roi et rendu impossible le retour à la monarchie de 1791.',
      'L’échec de la Constitution de 1791 : un roi doté d’un veto et soupçonné de trahison bloquait toute décision.',
      'La fuite de Varennes, qui avait démontré que le roi ne se considérait pas comme lié par cette Constitution.',
      'La guerre contre les rois d’Europe : garder un roi, c’était garder l’allié possible de l’envahisseur.',
      'L’élection d’une Convention au suffrage universel masculin, chargée précisément de donner une nouvelle constitution.',
      'La victoire de Valmy, la veille, qui ôte toute raison d’attendre.',
    ],
    recit: [
      {
        titre: 'Une assemblée élue par tous les hommes',
        texte:
          'Après le 10 août, l’Assemblée législative a décrété sa propre fin et convoqué une **Convention nationale**. Pour la première fois, les élections se font au **suffrage universel masculin** : plus de distinction entre « citoyens actifs » payant le cens et « citoyens passifs ». Environ sept millions d’hommes sont appelés, mais le scrutin se tient à deux degrés, dans des assemblées primaires publiques, en pleine crise et au lendemain des massacres de Septembre : la participation dépasse à peine **10 %**. Sont élus **749 députés**, dont beaucoup d’anciens de la Législative et de la Constituante. Trois courants s’y dessinent aussitôt : les **Girondins**, qui siègent à droite, les **Montagnards** sur les gradins hauts, et au milieu la **Plaine**, majorité mobile qui fera pencher toutes les décisions importantes jusqu’en 1795.',
      },
      {
        titre: 'Une phrase, un soir',
        texte:
          'La Convention se réunit le **20 septembre 1792**, dans la salle du **Manège**, aux Tuileries. Sa première séance de travail a lieu le lendemain. Elle commence par confirmer les lois en vigueur et la propriété — puis **Collot d’Herbois** monte à la tribune : une chose ne peut attendre, dit-il, l’abolition de la royauté. Quelqu’un demande un rapport préalable ; l’**abbé Grégoire**, évêque constitutionnel de Blois, réplique qu’on n’a pas besoin d’un rapport pour dire ce que tout le monde sait. Le décret est voté **par acclamation**, debout, sans qu’une seule voix s’élève contre : *« La Convention nationale décrète que la royauté est abolie en France. »* Dix-sept mots. À Paris, les crieurs le publient le lendemain sous les applaudissements ; dans les campagnes, on ôte les fleurs de lys des façades et l’on efface le mot « royal » des enseignes.',
      },
      {
        titre: 'L’an I',
        texte:
          'Le décret du 21 n’emploie pas le mot **République** : il supprime la royauté, il ne nomme pas le régime qui la remplace. C’est le **22 septembre** que la Convention décide que les actes publics porteront désormais la mention **« l’an premier de la République française »**. Le 25, sur la pression des Montagnards qui accusent les Girondins de vouloir démembrer le pays, elle ajoute la formule qui ne l’a plus quittée : la République est **« une et indivisible »**. Un an plus tard, le 5 octobre 1793, la Convention adopte un **calendrier républicain** dont l’ère commence précisément le 22 septembre 1792. Les mois y portent des noms de saisons — vendémiaire, brumaire, thermidor — et les jours des noms de plantes et d’outils. Il servira jusqu’au 1ᵉʳ janvier 1806.',
      },
      {
        titre: 'Ce que la République engage',
        texte:
          'Abolir la royauté ne règle rien : cela ouvre deux questions immédiates. La première est **le sort de Louis Capet** — un ancien roi vivant, dans une prison, au milieu d’une guerre contre les rois ; son procès s’ouvrira en décembre. La seconde est **quelle république** : Girondins et Montagnards s’accordent sur le régime et s’affrontent sur tout le reste, le rôle de Paris, la guerre, le contrôle des prix, jusqu’à l’élimination des Girondins le 2 juin 1793. La Constitution de l’an I, votée en juin 1793 et acceptée par référendum, ne sera jamais appliquée. La République de 1792 dure douze ans et meurt avec le sacre de Napoléon ; mais la **date** reste : chaque régime républicain français, jusqu’à la Cinquième, se rattache à ces deux journées de septembre.',
      },
    ],
    consequences: [
      'La France n’a plus de roi pour la première fois depuis Hugues Capet (987) : l’ancien souverain devient « Louis Capet ».',
      'Les actes publics sont datés de l’an I ; le calendrier républicain de 1793 fera partir l’ère au 22 septembre 1792.',
      'Le procès du roi devient inévitable : il s’ouvre le 11 décembre 1792 devant la Convention.',
      'La République est décrétée « une et indivisible » le 25 septembre 1792 — formule reprise depuis par toutes les constitutions.',
      'L’affrontement entre Girondins et Montagnards structure la Convention jusqu’au 2 juin 1793.',
      'Le 21 septembre devient la date de naissance de la forme républicaine française, revendiquée par les quatre républiques suivantes.',
    ],
    chiffres: [
      { valeur: '749', quoi: 'députés élus à la Convention nationale' },
      { valeur: '805 ans', quoi: 'de monarchie capétienne, depuis 987' },
      { valeur: '10 %', quoi: 'de participation aux élections de septembre 1792' },
      { valeur: '17 mots', quoi: 'dans le décret qui abolit la royauté' },
    ],
    chrono: [
      { date: '10 août 1792', fait: 'Chute de la monarchie ; le roi est suspendu.' },
      { date: '11 août 1792', fait: 'Convocation d’une Convention au suffrage universel masculin.' },
      { date: '20 septembre 1792', fait: 'Valmy ; première réunion de la Convention.' },
      { date: '21 septembre 1792', fait: 'La royauté est abolie par acclamation.' },
      { date: '22 septembre 1792', fait: 'Les actes sont datés de l’an I de la République.' },
      { date: '25 septembre 1792', fait: 'La République est déclarée une et indivisible.' },
      { date: '21 janvier 1793', fait: 'Exécution de Louis XVI.' },
      { date: '5 octobre 1793', fait: 'Calendrier républicain : l’ère part du 22 septembre 1792.' },
    ],
    leSaisTu:
      'Le hasard a bien fait les choses : le 22 septembre 1792 était le jour de l’**équinoxe d’automne**, celui où le soleil partage exactement le jour et la nuit. Quand la Convention a cherché, un an plus tard, où faire commencer son calendrier, le mathématicien Gilbert Romme a fait valoir l’argument — l’an I commençait le jour de l’égalité.',
    aRetenir: [
      'La Convention nationale, élue au suffrage universel masculin, se réunit le 20 septembre 1792.',
      'Le 21 septembre 1792, elle abolit la royauté par acclamation et sans une voix contre.',
      'Le 22 septembre 1792, les actes publics sont datés de l’an I de la République française.',
      'Le 25 septembre, la République est proclamée « une et indivisible ».',
      'Le calendrier républicain de 1793 fait partir son ère du 22 septembre 1792.',
    ],
    mots: [
      {
        mot: 'Convention nationale',
        sens: 'Assemblée élue en 1792 pour donner une constitution à la France ; elle gouverne jusqu’en 1795.',
      },
      {
        mot: 'Suffrage universel masculin',
        sens: 'Droit de vote reconnu à tous les hommes majeurs, sans condition de fortune — les femmes en restent exclues.',
      },
      {
        mot: 'An I',
        sens: 'Première année de l’ère républicaine, qui commence le 22 septembre 1792.',
      },
      {
        mot: 'La Plaine',
        sens: 'Les députés modérés assis au centre de la salle, majorité qui arbitre entre Girondins et Montagnards.',
      },
    ],
    lies: [
      'bataille-de-valmy',
      'journee-du-10-aout-1792',
      'execution-de-louis-xvi',
      'abbe-gregoire',
      'danton',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'République',
      'Convention',
      '21 septembre 1792',
      'an I',
      'Collot d’Herbois',
      'Grégoire',
      'calendrier républicain',
      'suffrage universel',
      'Girondins',
      'Montagnards',
    ],
  },
  {
    id: 'execution-de-louis-xvi',
    volet: 'evenements',
    nom: 'L’exécution de Louis XVI',
    date: '21 janvier 1793',
    tri: 1793,
    periode: 'revolution',
    emoji: '⚰️',
    lieu: 'Paris, place de la Révolution',
    accroche:
      'Un roi jugé par ses sujets, condamné à 387 voix contre 334, et guillotiné à dix heures vingt-deux sur la place de la Révolution.',
    citations: [
      {
        texte:
          'Je meurs innocent de tous les crimes qu’on m’impute. Je pardonne aux auteurs de ma mort et je prie Dieu que le sang que vous allez répandre ne retombe jamais sur la France.',
        qui: 'Louis XVI',
        contexte:
          'Sur l’échafaud de la place de la Révolution, le 21 janvier 1793 au matin ; les tambours couvrent la fin de la phrase.',
      },
      {
        texte: 'On ne peut point régner innocemment.',
        qui: 'Saint-Just',
        contexte:
          'Premier grand discours à la Convention, le 13 novembre 1792, pour demander que le roi soit jugé sans procès en forme.',
        sens:
          'Pour Saint-Just, il n’y a rien à examiner : être roi est en soi le crime. C’est la thèse la plus dure du débat, et elle ne l’emportera pas — la Convention votera un procès.',
      },
      {
        texte:
          'Les rois coalisés nous menacent : nous leur jetons, comme gant de bataille, la tête d’un roi.',
        qui: 'Danton',
        contexte:
          'À la Convention, en janvier 1793, contre ceux qui redoutaient la réaction des monarchies européennes.',
      },
      {
        texte: 'Fils de saint Louis, montez au ciel !',
        qui: 'L’abbé Edgeworth de Firmont',
        contexte:
          'Phrase rapportée au pied de l’échafaud par la tradition. Le prêtre, interrogé plus tard, a répondu qu’il n’en gardait aucun souvenir.',
        sens:
          'Elle est peut-être née dans les journaux du lendemain. On la cite depuis deux siècles ; on ne peut pas prouver qu’elle ait été prononcée.',
        incertaine: true,
      },
    ],
    reperes: [
      'Le 20 novembre 1792, l’armoire de fer des Tuileries livre la correspondance secrète du roi.',
      'Le procès s’ouvre le 11 décembre 1792 : l’accusé est appelé « Louis Capet ».',
      'Ses défenseurs sont Malesherbes, Tronchet et Raymond de Sèze, qui plaide le 26 décembre.',
      'La culpabilité est votée le 15 janvier par 691 voix sur 721, aucune contre.',
      'La mort l’emporte le 17 janvier par 387 voix contre 334 ; le sursis est rejeté le 19.',
      'L’exécution a lieu le 21 janvier 1793 à 10 h 22, place de la Révolution.',
    ],
    causes: [
      'La fuite de Varennes en juin 1791 : la preuve, aux yeux de l’Assemblée, que le roi avait cherché à revenir soutenu par les armées étrangères.',
      'La chute de la monarchie le 10 août 1792, puis l’abolition de la royauté le 21 septembre : Louis n’est plus roi, donc il n’est plus inviolable.',
      'La découverte, le 20 novembre 1792, de l’armoire de fer des Tuileries : correspondance avec les cours étrangères et paiements à des hommes politiques.',
      'La guerre : tant que l’ancien roi vit, il reste le drapeau des émigrés et des puissances coalisées.',
      'La rivalité entre Girondins et Montagnards, où chacun redoute de passer pour l’ami du tyran.',
      'Le refus de la Convention de renvoyer la décision au peuple, écarté le 15 janvier par 424 voix contre 283.',
    ],
    recit: [
      {
        titre: 'Peut-on juger un roi ?',
        texte:
          'La question divise la Convention pendant trois mois. La **Constitution de 1791** déclarait la personne du roi « inviolable et sacrée » : elle ne prévoyait que la déchéance. Les uns répondent que la royauté ayant été abolie, il ne reste qu’un citoyen, **Louis Capet**, justiciable comme un autre. **Saint-Just**, le 13 novembre 1792, va plus loin : il ne faut pas juger, il faut frapper, car « on ne peut point régner innocemment ». **Robespierre** dit de même : Louis doit mourir parce que la patrie doit vivre. À l’inverse, plusieurs Girondins plaident le renvoi au peuple, et le député **Lanjuinais** rappelle qu’une assemblée qui accuse, juge et condamne réunit trois pouvoirs dans les mêmes mains. Le **3 décembre**, la Convention décide de juger elle-même. Ce qui pèse dans la balance, plus que tous les discours, ce sont les papiers trouvés le 20 novembre dans l’**armoire de fer** : un coffre mural des Tuileries, indiqué par le serrurier Gamain, contenant des lettres qui établissent des contacts avec l’étranger et des versements à des hommes publics.',
      },
      {
        titre: 'Le procès',
        texte:
          'Le **11 décembre 1792**, Louis comparaît devant les 749 députés. Il répond posément, nie avoir donné l’ordre de tirer le 10 août, conteste l’authenticité de plusieurs pièces. Il obtient des défenseurs : le vieux **Malesherbes**, ancien ministre, qui s’est proposé lui-même, le juriste **Tronchet**, et **Raymond de Sèze**, qui plaide le **26 décembre** pendant trois heures. Sa défense tient en deux points : l’inviolabilité garantie par la Constitution, et le fait qu’une assemblée politique ne peut être un tribunal impartial. Il termine par une phrase que la salle écoute en silence : « Je cherche parmi vous des juges, et je n’y vois que des accusateurs. » Les débats reprennent, interminables, jusqu’aux appels nominaux de la mi-janvier.',
      },
      {
        titre: 'Quatre questions, une voix d’écart',
        texte:
          'Du **15 au 19 janvier 1793**, la Convention vote quatre fois, à la tribune, chaque député venant motiver son vote devant la France. Première question, la culpabilité : **691 oui sur 721**, aucun non. Deuxième, le renvoi de la décision au peuple : **rejeté**, 424 contre 283. Troisième, la peine : l’appel nominal dure vingt-quatre heures d’affilée, dans une salle pleine où l’on apporte des rafraîchissements aux tribunes. La mort l’emporte par **387 voix contre 334** qui se prononcent pour la détention, le bannissement ou la mort avec sursis. Parmi les votants pour la mort, **Philippe d’Orléans, cousin du roi**, devenu « Philippe Égalité » — il sera guillotiné neuf mois plus tard. Quatrième question, le 19 : le sursis est refusé, 380 contre 310. La condamnation est prononcée dans la nuit.',
      },
      {
        titre: 'Le 21 janvier au matin',
        texte:
          'Le 20 au soir, Louis fait ses adieux à sa famille au **Temple** : deux heures, portes fermées, puis il refuse de les revoir au matin pour leur épargner une seconde séparation. Il passe la nuit avec l’**abbé Edgeworth de Firmont**, prêtre irlandais réfractaire qu’il a demandé et que la Commune a laissé venir. Le 21, à 8 heures, la voiture quitte le Temple ; il faut près de deux heures pour traverser Paris entre deux haies de gardes nationaux, tambours battants, boutiques fermées. Place de la Révolution — aujourd’hui place de la Concorde —, il monte seul les marches, écarte ceux qui veulent lui lier les mains, puis accepte. Il parle d’une voix forte : *« Je meurs innocent de tous les crimes qu’on m’impute… »* Le général **Santerre** fait battre les tambours. Il est **10 h 22**. Le roi a **38 ans**. Le silence de la place, rapporté par plusieurs témoins, dure quelques secondes avant les premiers cris.',
      },
      {
        titre: 'Ce que la mort d’un roi déclenche',
        texte:
          'L’Europe entière prend le deuil et arme. Le **1ᵉʳ février 1793**, la Convention déclare la guerre à l’Angleterre et aux Provinces-Unies, puis à l’Espagne le 7 mars : c’est la **première coalition**, la France contre presque tout le continent. Pour y faire face, la Convention décrète le **24 février** la levée de **300 000 hommes** — décision qui met l’Ouest en insurrection trois semaines plus tard. Elle crée le **Tribunal révolutionnaire** le 10 mars et le **Comité de salut public** le 6 avril. Le régicide soude les 387 députés qui l’ont voté : aucun retour en arrière n’est plus possible pour eux, et la Restauration les bannira en 1816. **Marie-Antoinette** est jugée et exécutée le **16 octobre 1793** ; leur fils, Louis-Charles, meurt au Temple en juin 1795, à dix ans. Sur l’emplacement du cimetière où le corps du roi fut jeté, Louis XVIII fera bâtir la **chapelle expiatoire**, rue d’Anjou, qu’on visite toujours.',
      },
    ],
    consequences: [
      'Le 1ᵉʳ février 1793, la France déclare la guerre à l’Angleterre et aux Provinces-Unies : c’est la première coalition.',
      'La levée de 300 000 hommes (24 février 1793) provoque en mars l’insurrection de Vendée.',
      'La Convention se dote d’instruments d’exception : Tribunal révolutionnaire (10 mars), Comité de salut public (6 avril).',
      'Les 387 députés régicides sont liés à la République par leur vote ; ils seront bannis par la loi de 1816.',
      'Marie-Antoinette est jugée et exécutée le 16 octobre 1793 ; le dauphin meurt au Temple en juin 1795.',
      'Le 21 janvier devient, pour les monarchies européennes, la date fondatrice de leur hostilité à la Révolution.',
    ],
    chiffres: [
      { valeur: '387', quoi: 'voix pour la mort, contre 334 pour une autre peine' },
      { valeur: '721', quoi: 'députés votants lors de l’appel nominal' },
      { valeur: '10 h 22', quoi: 'l’heure de l’exécution, le 21 janvier 1793' },
      { valeur: '38 ans', quoi: 'l’âge de Louis XVI' },
    ],
    chrono: [
      { date: '20 novembre 1792', fait: 'Découverte de l’armoire de fer aux Tuileries.' },
      { date: '3 décembre 1792', fait: 'La Convention décide de juger le roi elle-même.' },
      { date: '11 décembre 1792', fait: 'Première comparution de « Louis Capet ».' },
      { date: '26 décembre 1792', fait: 'Plaidoirie de Raymond de Sèze.' },
      { date: '15 janvier 1793', fait: 'Culpabilité votée par 691 voix sur 721.' },
      { date: '17 janvier 1793', fait: 'La mort l’emporte par 387 voix contre 334.' },
      { date: '19 janvier 1793', fait: 'Le sursis est rejeté, 380 contre 310.' },
      { date: '21 janvier 1793', fait: 'Exécution place de la Révolution, à 10 h 22.' },
      { date: '1ᵉʳ février 1793', fait: 'Guerre déclarée à l’Angleterre : première coalition.' },
      { date: '16 octobre 1793', fait: 'Exécution de Marie-Antoinette.' },
    ],
    leSaisTu:
      'Le plus âgé des défenseurs du roi s’est présenté tout seul. **Malesherbes**, 71 ans, ancien ministre et protecteur de l’*Encyclopédie*, écrit à la Convention : il a été deux fois appelé au conseil de son maître « dans le temps où cette fonction était ambitionnée de tout le monde », il lui doit le même service maintenant qu’elle est dangereuse. Il sera guillotiné en avril 1794, avec sa fille et ses petits-enfants.',
    aRetenir: [
      'Le procès de Louis XVI s’ouvre le 11 décembre 1792 devant la Convention, qui juge elle-même.',
      'La découverte de l’armoire de fer, le 20 novembre 1792, apporte les preuves de contacts avec l’étranger.',
      'Le 17 janvier 1793, la mort est votée par 387 voix contre 334 ; le sursis est rejeté le 19.',
      'Louis XVI est exécuté le 21 janvier 1793 à 10 h 22, place de la Révolution, à 38 ans.',
      'L’exécution entraîne la première coalition, la levée de 300 000 hommes et l’insurrection vendéenne.',
    ],
    mots: [
      {
        mot: 'Régicide',
        sens: 'Meurtre d’un roi ; sous la Restauration, nom donné aux députés ayant voté la mort de Louis XVI.',
      },
      {
        mot: 'Appel nominal',
        sens: 'Vote où chaque député vient dire son choix à la tribune, à voix haute et sous son nom.',
      },
      {
        mot: 'Armoire de fer',
        sens: 'Coffre mural des Tuileries découvert le 20 novembre 1792, contenant la correspondance secrète du roi.',
      },
      {
        mot: 'Inviolabilité',
        sens: 'Protection juridique de la Constitution de 1791 qui rendait la personne du roi non jugeable.',
      },
    ],
    lies: [
      'louis-xvi',
      'marie-antoinette',
      'fuite-de-varennes',
      'guerre-de-vendee',
      'la-terreur',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Louis XVI',
      '21 janvier 1793',
      'procès du roi',
      'Louis Capet',
      'armoire de fer',
      'Malesherbes',
      'de Sèze',
      'régicide',
      'place de la Concorde',
      'guillotine',
    ],
  },
  {
    id: 'guerre-de-vendee',
    volet: 'evenements',
    nom: 'La guerre de Vendée',
    date: 'mars 1793 – 1796',
    tri: 1793,
    fin: 1796,
    periode: 'revolution',
    emoji: '⛪',
    lieu: 'Bocage vendéen, Mauges, Bas-Poitou, pays de Retz',
    accroche:
      'Une levée de 300 000 hommes met l’Ouest debout : quatre ans de guerre civile, une armée catholique et royale, et une région saignée à blanc.',
    citations: [
      {
        texte: 'Grâce aux prisonniers !',
        qui: 'Bonchamps',
        contexte:
          'Mourant à Saint-Florent-le-Vieil, le 18 octobre 1793, alors que l’armée vendéenne s’apprête à fusiller cinq mille républicains captifs. L’ordre est obéi.',
        sens:
          'Un chef vendéen blessé à mort arrache la vie de cinq mille ennemis. C’est le geste que la région a retenu de toute la guerre.',
      },
      {
        texte:
          'La Vendée, et encore la Vendée, voilà le chancre politique qui dévore le cœur de la République française.',
        qui: 'Barère',
        contexte:
          'Rapport au nom du Comité de salut public, à la Convention, le 1ᵉʳ août 1793, pour justifier des mesures de destruction.',
        sens:
          'Le même jour, la Convention décrète que les repaires des rebelles seront détruits et les récoltes enlevées : la répression devient une politique votée.',
      },
      {
        texte: 'Si j’avance, suivez-moi ; si je recule, tuez-moi ; si je meurs, vengez-moi.',
        qui: 'Henri de La Rochejaquelein',
        contexte:
          'Aux paysans des Aubiers, avril 1793, selon les Mémoires de la marquise de La Rochejaquelein, rédigés vingt ans plus tard.',
        sens:
          'La phrase est célèbre et la source est tardive : on la cite parce qu’elle dit vrai de la guerre, pas parce qu’on a la preuve qu’elle fut prononcée.',
        incertaine: true,
      },
    ],
    reperes: [
      'La Constitution civile du clergé (1790) a privé l’Ouest de ses curés : la plupart refusent le serment.',
      'La levée de 300 000 hommes, décrétée le 24 février 1793, déclenche le soulèvement le 11 mars.',
      'Les insurgés se donnent des chefs paysans et nobles et s’appellent « armée catholique et royale ».',
      'Après Cholet (17 octobre 1793), la Virée de Galerne jette des dizaines de milliers de gens sur les routes.',
      'Les colonnes infernales de Turreau ravagent le bocage de janvier à mai 1794.',
      'Jean-Clément Martin estime les morts à environ 170 000 pour la région insurgée.',
    ],
    causes: [
      'La Constitution civile du clergé (12 juillet 1790) et le serment exigé des prêtres : dans l’Ouest, la grande majorité refuse et le paysan perd le curé qu’il connaît.',
      'La vente des biens nationaux, rachetés par la bourgeoisie des bourgs et non par les paysans, qui n’y gagnent rien.',
      'L’éloignement entre des bourgs « patriotes », commerçants et lettrés, et des campagnes d’habitat dispersé restées fidèles à leur paroisse.',
      'L’exécution de Louis XVI le 21 janvier 1793, reçue dans la région comme un sacrilège.',
      'La levée de 300 000 hommes du 24 février 1793 : un tirage au sort des célibataires, dont sont dispensés les fonctionnaires et les acquéreurs de biens nationaux — c’est l’étincelle.',
      'La présence sur place d’une noblesse rurale non émigrée, que les insurgés vont chercher pour commander.',
    ],
    recit: [
      {
        titre: 'Le tirage au sort de trop',
        texte:
          'Le **24 février 1793**, pour tenir tête à l’Europe coalisée, la Convention décrète une levée de **300 000 hommes**. Chaque commune doit fournir son contingent ; à défaut de volontaires, on tire au sort parmi les célibataires de 18 à 40 ans. Mais la loi dispense les fonctionnaires, les gardes nationaux en service et, dans la pratique, les acheteurs de biens nationaux — c’est-à-dire les notables des bourgs. Les paysans du bocage voient partir leurs fils pour défendre un régime qui leur a pris leur curé et qui laisse chez eux ceux qui ont profité de la Révolution. Le **11 mars 1793**, les tirages tournent à l’émeute à **Saint-Florent-le-Vieil**, à Machecoul, à Tiffauges, puis dans cent paroisses à la fois. À Machecoul, les insurgés massacrent plusieurs centaines de « patriotes » dans les jours qui suivent. La guerre de Vendée commence par un refus de conscription et devient en trois semaines un soulèvement général.',
      },
      {
        titre: 'L’armée catholique et royale',
        texte:
          'Les paysans vont chercher leurs chefs : le voiturier **Cathelineau**, le garde-chasse **Stofflet**, puis des nobles restés sur leurs terres — **Charette**, **d’Elbée**, **Bonchamps**, **La Rochejaquelein**, **Lescure**. L’ensemble prend le nom d’**armée catholique et royale** ; les hommes portent le **Sacré-Cœur** de tissu sur la poitrine et la cocarde blanche. Ce n’est pas une armée au sens ordinaire : on se rassemble au son du tocsin, on se bat une journée, on rentre faire la moisson. Leur tactique, la « chouannerie », épouse le bocage — haies, chemins creux, embuscades — et déroute des troupes habituées aux plaines. Le printemps et l’été 1793 leur appartiennent : **Fontenay**, **Saumur** en juin, **Angers**. Mais ils échouent devant **Nantes** le 29 juin, où Cathelineau est mortellement blessé, et ils ne prennent jamais de port : les secours anglais espérés ne viendront pas.',
      },
      {
        titre: 'Cholet, la Loire, Savenay',
        texte:
          'La Convention envoie l’armée de Mayence, libérée par la capitulation de la place. Le **17 octobre 1793**, la Grande Armée vendéenne est écrasée à **Cholet** ; d’Elbée et Bonchamps sont mortellement blessés. C’est alors qu’à **Saint-Florent-le-Vieil**, Bonchamps agonisant fait grâce aux **cinq mille prisonniers républicains** que ses hommes allaient fusiller. Puis commence la **Virée de Galerne** : entre soixante et cent mille personnes — combattants, femmes, enfants, vieillards — passent la Loire et marchent vers la Normandie dans l’espoir d’un débarquement anglais. Granville leur résiste. Le retour est une déroute : **Le Mans**, les 12 et 13 décembre, où la poursuite tourne à la tuerie dans les rues ; **Savenay**, le 23 décembre, où la colonne est anéantie. Des milliers de prisonniers sont fusillés dans les semaines suivantes.',
      },
      {
        titre: 'Les colonnes infernales et les noyades',
        texte:
          'La victoire ne suffit pas : il s’agit désormais d’empêcher toute reprise. De **janvier à mai 1794**, le général **Turreau** lance douze **colonnes infernales** qui traversent le bocage en brûlant fermes, moulins, récoltes et en tuant sans distinguer les combattants du reste. À **Nantes**, le représentant en mission **Carrier** fait exécuter les prisonniers entassés par milliers dans des entrepôts : fusillades collectives et **noyades** dans la Loire, sur des bateaux à sabords, de novembre 1793 à février 1794 ; les estimations vont de **1 800 à 4 800 victimes**. Ces méthodes sont dénoncées dès l’époque : Carrier est rappelé en février 1794, jugé et guillotiné le 16 décembre 1794 ; Turreau est destitué en mai 1794. La pacification viendra d’un autre général, **Hoche**, par la négociation, les garanties religieuses et le désarmement méthodique : paix de **La Jaunaye** en février 1795, échec du débarquement royaliste de **Quiberon** en juillet 1795, exécution de Stofflet puis de **Charette** au printemps 1796.',
      },
      {
        titre: 'Compter les morts, et le dire comme on le sait',
        texte:
          'Combien de morts ? La question est étudiée depuis deux siècles et n’a pas de réponse au millier près : les registres d’état civil de la région sont lacunaires pour ces années-là, et les combattants républicains sont eux aussi à compter. L’estimation la plus utilisée aujourd’hui est celle de l’historien **Jean-Clément Martin** : environ **170 000 morts** parmi la population de la région insurgée, soit près d’un cinquième de ses habitants, auxquels s’ajoutent les pertes de l’armée républicaine. D’autres travaux avancent des chiffres différents, et la **qualification** juridique de la répression fait l’objet d’un débat qui n’est pas tranché entre historiens. Ce qui n’est pas discuté : l’ampleur des destructions, la durée de la guerre, et le fait que le bocage a mis une génération à s’en relever. La Vendée a aussi laissé une mémoire vivante — croix, chapelles, noms de chefs sur les monuments — et, pendant tout le XIXᵉ siècle, un ancrage royaliste et catholique qui distingue l’Ouest du reste du pays.',
      },
    ],
    consequences: [
      'Une guerre civile de quatre ans, qui rebondit en 1799, 1815 et 1832 : l’Ouest reste une région à part dans la politique française.',
      'Environ 170 000 morts dans la région insurgée selon l’estimation de Jean-Clément Martin, soit près d’un habitant sur cinq.',
      'La Vendée devient l’un des moteurs de la Terreur : elle justifie le Tribunal révolutionnaire, le Comité de salut public et la loi des suspects.',
      'Les colonnes infernales de Turreau (janvier-mai 1794) et les noyades de Nantes ordonnées par Carrier, qui sera guillotiné le 16 décembre 1794.',
      'Hoche pacifie par la négociation et les garanties religieuses : paix de La Jaunaye (1795), exécution de Charette (mars 1796).',
      'Un débat d’historiens toujours ouvert sur le nombre des victimes et sur la qualification de la répression.',
    ],
    chiffres: [
      { valeur: '300 000', quoi: 'hommes : la levée du 24 février 1793' },
      { valeur: '170 000', quoi: 'morts estimés par l’historien Jean-Clément Martin' },
      { valeur: '5 000', quoi: 'prisonniers républicains graciés par Bonchamps' },
      { valeur: '12', quoi: 'colonnes infernales lancées par Turreau en 1794' },
    ],
    chrono: [
      { date: '12 juillet 1790', fait: 'Constitution civile du clergé ; l’Ouest refuse le serment.' },
      { date: '21 janvier 1793', fait: 'Exécution de Louis XVI.' },
      { date: '24 février 1793', fait: 'Décret de la levée de 300 000 hommes.' },
      { date: '11 mars 1793', fait: 'Soulèvement de Saint-Florent-le-Vieil et de Machecoul.' },
      { date: 'juin 1793', fait: 'Prise de Saumur ; échec devant Nantes le 29.' },
      { date: '1ᵉʳ août 1793', fait: 'La Convention décrète la destruction de la Vendée.' },
      { date: '17-18 octobre 1793', fait: 'Défaite de Cholet ; Bonchamps gracie 5 000 prisonniers.' },
      { date: '23 décembre 1793', fait: 'Anéantissement de l’armée vendéenne à Savenay.' },
      { date: 'janvier-mai 1794', fait: 'Colonnes infernales de Turreau dans le bocage.' },
      { date: '17 février 1795', fait: 'Paix de La Jaunaye.' },
      { date: '29 mars 1796', fait: 'Charette est fusillé à Nantes : la guerre s’éteint.' },
    ],
    leSaisTu:
      'Le tombeau de **Bonchamps**, dans l’église de Saint-Florent-le-Vieil, a été sculpté en 1825 par **David d’Angers** : le général mourant s’y redresse, le bras tendu, pour dire « Grâce aux prisonniers ». Le sculpteur avait une raison personnelle de le représenter ainsi — son propre père était l’un des cinq mille hommes épargnés ce jour-là.',
    aRetenir: [
      'La levée de 300 000 hommes du 24 février 1793 déclenche le soulèvement vendéen le 11 mars.',
      'La Constitution civile du clergé et le départ des curés réfractaires en sont la cause profonde.',
      'Les insurgés forment l’armée catholique et royale, menée par Cathelineau, Charette, Bonchamps, La Rochejaquelein.',
      'Après la défaite de Cholet (17 octobre 1793), la Virée de Galerne s’achève à Savenay le 23 décembre.',
      'Les colonnes infernales de Turreau et les noyades de Nantes marquent la répression de 1794.',
      'Jean-Clément Martin estime à environ 170 000 le nombre de morts dans la région insurgée.',
    ],
    mots: [
      {
        mot: 'Armée catholique et royale',
        sens: 'Nom que se donnent les insurgés de l’Ouest, qui portent le Sacré-Cœur et la cocarde blanche.',
      },
      {
        mot: 'Prêtre réfractaire',
        sens: 'Prêtre ayant refusé le serment à la Constitution civile du clergé de 1790.',
      },
      {
        mot: 'Colonnes infernales',
        sens: 'Douze colonnes lancées par le général Turreau en 1794 pour brûler et vider le bocage.',
      },
      {
        mot: 'Virée de Galerne',
        sens: 'Marche de l’armée vendéenne au nord de la Loire, d’octobre à décembre 1793, achevée à Savenay.',
      },
      {
        mot: 'Chouan',
        sens: 'Insurgé royaliste de Bretagne et du Maine, pratiquant la guérilla ; mouvement voisin de la Vendée.',
      },
    ],
    lies: ['execution-de-louis-xvi', 'la-terreur', 'chute-de-robespierre', 'robespierre'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Vendée',
      'Charette',
      'Cathelineau',
      'Bonchamps',
      'La Rochejaquelein',
      'colonnes infernales',
      'Turreau',
      'noyades de Nantes',
      'Carrier',
      'guerre civile',
      'bocage',
      'chouans',
    ],
  },
  {
    id: 'la-terreur',
    volet: 'evenements',
    nom: 'La Terreur',
    date: 'septembre 1793 – juillet 1794',
    tri: 1793,
    fin: 1794,
    periode: 'revolution',
    emoji: '🗡️',
    lieu: 'Paris et la France entière',
    accroche:
      'Un gouvernement d’exception pour sauver une République assiégée : environ 17 000 condamnations à mort prononcées en onze mois.',
    citations: [
      {
        texte:
          'La terreur n’est autre chose que la justice prompte, sévère, inflexible ; elle est donc une émanation de la vertu.',
        qui: 'Robespierre',
        contexte:
          'Rapport sur les principes de morale politique, à la Convention, le 5 février 1794 (17 pluviôse an II).',
        sens:
          'La phrase justifie l’exception par la morale : frapper vite et sans recours serait une forme de justice. C’est la théorie du régime, dite par son principal orateur.',
      },
      {
        texte: 'Le gouvernement de la France est révolutionnaire jusqu’à la paix.',
        qui: 'Saint-Just',
        contexte:
          'Rapport du 10 octobre 1793 adopté par la Convention : la Constitution de 1793, pourtant votée et ratifiée, est suspendue.',
        sens:
          'Un régime d’exception assumé et daté : tant que dure la guerre, il n’y a plus de constitution, seulement des comités qui gouvernent.',
      },
      {
        texte: 'Ô Liberté, que de crimes on commet en ton nom !',
        qui: 'Madame Roland',
        contexte:
          'Au pied de l’échafaud, le 8 novembre 1793, devant la statue de la Liberté dressée sur la place — phrase rapportée par un compagnon de captivité.',
        sens:
          'Elle est trop belle pour être sûre, et trop juste pour être oubliée : on la cite en disant d’où elle vient.',
        incertaine: true,
      },
      {
        texte: 'Tu montreras ma tête au peuple : elle en vaut bien la peine.',
        qui: 'Danton',
        contexte: 'Au bourreau Sanson, le 5 avril 1794, sur la charrette qui le mène à l’échafaud.',
        sens:
          'Celui qui avait lancé la Terreur en fut l’une des victimes : la machine s’est retournée contre ceux qui l’avaient montée.',
      },
    ],
    reperes: [
      'Le 5 septembre 1793, les sans-culottes envahissent la Convention : la Terreur est mise « à l’ordre du jour ».',
      'La loi des suspects du 17 septembre 1793 permet d’arrêter quiconque n’a pas prouvé son civisme.',
      'Le Comité de salut public, douze membres, gouverne réellement le pays à partir de l’automne 1793.',
      'La loi de prairial (10 juin 1794) supprime défenseurs et témoins : acquittement ou mort.',
      'Environ 17 000 condamnations à mort sont prononcées, et des dizaines de milliers meurent en détention.',
      'Le contexte : la guerre sur toutes les frontières, la Vendée, les révoltes fédéralistes et la famine.',
    ],
    causes: [
      'La guerre contre presque toute l’Europe : Angleterre, Autriche, Prusse, Espagne, Provinces-Unies et Piémont sont coalisées au printemps 1793.',
      'La trahison du général Dumouriez, vainqueur de Valmy et de Jemmapes, qui passe à l’ennemi en avril 1793.',
      'La guerre civile de Vendée et les révoltes « fédéralistes » de Lyon, Marseille, Bordeaux et Caen à l’été 1793.',
      'La livraison de Toulon et de la flotte française aux Anglais, le 27 août 1793.',
      'La famine, l’effondrement de l’assignat et la pression des sans-culottes pour taxer les prix et frapper les accapareurs.',
      'L’assassinat de Marat le 13 juillet 1793, qui donne un martyr et durcit la Convention.',
      'La conviction, chez les Montagnards, qu’un gouvernement d’exception est la seule façon de sauver la République — la Constitution de 1793 est votée, ratifiée… puis rangée dans une arche de bois.',
    ],
    recit: [
      {
        titre: 'L’été où tout tombe en même temps',
        texte:
          'Au printemps 1793, la République perd sur tous les tableaux. Les armées reculent en Belgique et sur le Rhin ; **Dumouriez**, le vainqueur de Valmy, passe à l’ennemi en avril. L’**Ouest** est en guerre civile depuis mars. Après l’élimination des Girondins le 2 juin, une soixantaine de départements se soulèvent contre Paris : c’est la révolte **fédéraliste**, avec Lyon, Marseille, Bordeaux et Caen. Le 13 juillet, **Marat** est poignardé dans sa baignoire. Le 27 août, Toulon livre aux Anglais le premier port militaire du pays et la moitié de la flotte. À l’intérieur, l’assignat perd les trois quarts de sa valeur et le pain manque. C’est dans cette situation — et non dans un débat d’idées — que la Convention bascule.',
      },
      {
        titre: 'Les instruments : comités, suspects, tribunal',
        texte:
          'Trois outils font le régime. Le **Comité de salut public**, créé le 6 avril 1793, douze membres renouvelables chaque mois, où entrent **Robespierre** le 27 juillet, **Saint-Just**, **Couthon**, mais aussi **Carnot** qui organise les armées : à l’automne, il gouverne réellement, et le Comité de sûreté générale tient la police. Le **Tribunal révolutionnaire**, créé le 10 mars 1793, réorganisé en quatre sections le 5 septembre, juge sans appel ni pourvoi. Enfin la **loi des suspects** du **17 septembre 1793**, qui définit le suspect avec une largeur redoutable : ceux qui « n’ont pas constamment manifesté leur attachement à la Révolution », les ci-devant nobles, les parents d’émigrés, ceux à qui un comité de surveillance a refusé un certificat de civisme. Le 10 octobre, sur rapport de Saint-Just, la Convention déclare le gouvernement **« révolutionnaire jusqu’à la paix »** : la Constitution de 1793, pourtant approuvée par référendum, est suspendue avant d’avoir servi.',
      },
      {
        titre: 'Ce que la Terreur produit',
        texte:
          'Elle produit d’abord des résultats militaires. La **levée en masse** du 23 août 1793 met sur pied quatorze armées et près de huit cent mille hommes ; les réquisitions, le maximum des prix, la mobilisation des savants pour la poudre et les canons fonctionnent. Fin 1793, Toulon est reprise, Lyon soumise, la Vendée battue ; le **26 juin 1794**, Fleurus ouvre de nouveau la Belgique. Elle produit aussi des morts. Aux tribunaux d’exception, environ **17 000 condamnations à mort** sont prononcées dans toute la France — les travaux de l’historien Donald Greer en comptent 16 594 —, auxquelles s’ajoutent les exécutions sommaires des commissions militaires à Lyon, Nantes ou en Vendée, et des **dizaines de milliers de morts en détention** : on estime à plus de 300 000 le nombre de personnes emprisonnées comme suspectes. Le total des victimes est généralement situé entre 35 000 et 40 000. Un sur dix seulement est noble ou prêtre : la majorité des condamnés sont des paysans et des artisans, et la moitié des exécutions se concentrent dans les régions de guerre civile.',
      },
      {
        titre: 'La Grande Terreur, quand la peur change de camp',
        texte:
          'L’hiver et le printemps 1794 voient la Révolution dévorer ses propres chefs : les **hébertistes**, porte-parole des sans-culottes, sont guillotinés le 24 mars ; les **dantonistes**, partisans d’un relâchement, le 5 avril. Puis vient la **loi de prairial** (**10 juin 1794**), rédigée par Couthon : plus de défenseur, plus d’interrogatoire préalable, plus de témoins ; le jury statue par « conviction morale » et ne peut prononcer que l’acquittement ou la mort. En **47 jours**, le Tribunal de Paris condamne environ **1 400 personnes** — davantage qu’en quatorze mois. Or la victoire de Fleurus a ôté à l’exception sa justification, et chaque député sait désormais qu’il peut être le suivant. Le **9 thermidor** (27 juillet 1794), la Convention se retourne. La loi de prairial est abrogée le 1ᵉʳ août, les prisons se vident, le Tribunal est supprimé en mai 1795.',
      },
      {
        titre: 'Expliquer n’est pas excuser',
        texte:
          'Les deux phrases doivent être dites ensemble, et c’est exactement ce que demande l’histoire. **Expliquer** : sans la guerre étrangère, la guerre civile, la trahison de généraux et la faim, la Convention n’aurait pas suspendu le droit ; le gouvernement révolutionnaire a sauvé la République sur le terrain, et une partie de ses mesures — réquisitions, écoles, levée en masse — n’ont rien de criminel. **Ne pas excuser** : la loi des suspects punit l’intention et non l’acte, la loi de prairial supprime la défense, et un régime qui juge sans preuve tue nécessairement des innocents — Lavoisier, le chimiste, est guillotiné le 8 mai 1794, et Malesherbes, le défenseur du roi, en avril. La Terreur n’est pas un accident de la Révolution, elle en est un moment ; elle n’est pas non plus toute la Révolution, qui a aussi produit la Déclaration des droits, l’état civil, l’égalité devant la loi et l’abolition de l’esclavage. Un élève qui sait tenir les deux bouts a compris la période.',
      },
    ],
    consequences: [
      'Environ 17 000 condamnations à mort prononcées et des dizaines de milliers de morts en détention ou sans jugement.',
      'La République est sauvée militairement : quatorze armées, levée en masse, reprise de Toulon et de Lyon, victoire de Fleurus le 26 juin 1794.',
      'La loi de prairial (10 juin 1794) ouvre la Grande Terreur : environ 1 400 exécutions à Paris en 47 jours.',
      'La Révolution élimine ses propres chefs : hébertistes le 24 mars 1794, dantonistes le 5 avril.',
      'Le 9 thermidor (27 juillet 1794) met fin au gouvernement révolutionnaire ; la loi de prairial est abrogée le 1ᵉʳ août.',
      'Le mot passe dans le vocabulaire politique du monde entier : « terrorisme » apparaît en français en 1794.',
    ],
    chiffres: [
      { valeur: '17 000', quoi: 'condamnations à mort prononcées par les tribunaux' },
      { valeur: '300 000', quoi: 'personnes au moins emprisonnées comme « suspectes »' },
      { valeur: '1 400', quoi: 'exécutions à Paris pendant la Grande Terreur' },
      { valeur: '47 jours', quoi: 'de loi de prairial, du 10 juin au 27 juillet 1794' },
    ],
    chrono: [
      { date: '10 mars 1793', fait: 'Création du Tribunal révolutionnaire.' },
      { date: '6 avril 1793', fait: 'Création du Comité de salut public.' },
      { date: '13 juillet 1793', fait: 'Assassinat de Marat par Charlotte Corday.' },
      { date: '23 août 1793', fait: 'Levée en masse : tous les Français sont réquisitionnés.' },
      { date: '5 septembre 1793', fait: 'La Terreur est mise « à l’ordre du jour ».' },
      { date: '17 septembre 1793', fait: 'Loi des suspects.' },
      { date: '10 octobre 1793', fait: 'Gouvernement révolutionnaire jusqu’à la paix.' },
      { date: '16 octobre 1793', fait: 'Exécution de Marie-Antoinette.' },
      { date: '5 avril 1794', fait: 'Exécution de Danton et des dantonistes.' },
      { date: '10 juin 1794', fait: 'Loi de prairial : plus de défenseurs ni de témoins.' },
      { date: '26 juin 1794', fait: 'Victoire de Fleurus : la frontière est dégagée.' },
      { date: '27 juillet 1794', fait: '9 thermidor : chute de Robespierre.' },
    ],
    leSaisTu:
      'L’accusateur public du Tribunal révolutionnaire, **Fouquier-Tinville**, a été jugé à son tour et guillotiné le 7 mai 1795. Devant ses juges, il aurait résumé sa défense d’une phrase restée célèbre : « Je ne suis que la hache. Punit-on une hache ? » Le tribunal a répondu que si.',
    aRetenir: [
      'La Terreur est un gouvernement d’exception installé de septembre 1793 à juillet 1794.',
      'La loi des suspects du 17 septembre 1793 permet d’arrêter sur simple soupçon de tiédeur.',
      'Le Comité de salut public et le Tribunal révolutionnaire en sont les deux instruments.',
      'Environ 17 000 condamnations à mort sont prononcées ; des dizaines de milliers meurent en prison.',
      'Elle s’explique par la guerre, la Vendée et la famine — ce qui ne l’excuse pas.',
      'Elle prend fin le 9 thermidor an II (27 juillet 1794) avec la chute de Robespierre.',
    ],
    mots: [
      {
        mot: 'Suspect',
        sens: 'Selon la loi du 17 septembre 1793, toute personne qui n’a pas prouvé son attachement constant à la Révolution.',
      },
      {
        mot: 'Comité de salut public',
        sens: 'Comité de douze membres créé le 6 avril 1793, qui gouverne réellement la France jusqu’en juillet 1794.',
      },
      {
        mot: 'Gouvernement révolutionnaire',
        sens: 'Régime d’exception décrété le 10 octobre 1793 : la Constitution est suspendue jusqu’à la paix.',
      },
      {
        mot: 'Loi de prairial',
        sens: 'Loi du 10 juin 1794 supprimant défenseurs et témoins : le jury ne peut qu’acquitter ou condamner à mort.',
      },
      {
        mot: 'Sans-culotte',
        sens: 'Artisan ou boutiquier parisien portant le pantalon et non la culotte : la force populaire de la Révolution.',
      },
    ],
    lies: ['robespierre', 'danton', 'marat', 'chute-de-robespierre', 'guerre-de-vendee'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Terreur',
      'Comité de salut public',
      'loi des suspects',
      'Tribunal révolutionnaire',
      'prairial',
      'Robespierre',
      'Saint-Just',
      'guillotine',
      'Fouquier-Tinville',
      'an II',
    ],
  },
  {
    id: 'abolition-de-l-esclavage-1794',
    volet: 'evenements',
    nom: 'La première abolition de l’esclavage',
    date: '4 février 1794',
    tri: 1794,
    periode: 'revolution',
    emoji: '🕊️',
    lieu: 'Paris et les colonies françaises',
    accroche:
      'Le 16 pluviôse an II, la Convention abolit l’esclavage dans toutes les colonies — et Bonaparte le rétablit huit ans plus tard.',
    citations: [
      {
        texte:
          'L’esclavage des Nègres dans toutes les colonies est aboli ; en conséquence, tous les hommes, sans distinction de couleur, domiciliés dans les colonies, sont citoyens français.',
        qui: 'La Convention nationale',
        contexte:
          'Décret du 16 pluviôse an II (4 février 1794), voté par acclamation et sans discussion, après une demande de ne pas souiller la séance par un débat.',
        sens:
          'La France est le premier État européen à abolir l’esclavage dans ses colonies. Le décret ne se contente pas de libérer : il fait des affranchis des citoyens.',
      },
      {
        texte:
          'Jusqu’ici nous n’avons décrété la liberté qu’en égoïstes et pour nous seuls. Aujourd’hui, nous proclamons à la face de l’univers la liberté générale.',
        qui: 'Danton',
        contexte: 'À la Convention, le 4 février 1794, au lendemain du vote du décret.',
      },
      {
        texte:
          'Vous étiez hommes, vous êtes citoyens ; réintégrés dans la plénitude de vos droits, vous participerez désormais à la souveraineté du peuple.',
        qui: 'L’abbé Grégoire',
        contexte:
          'Lettre aux citoyens de couleur et nègres libres de Saint-Domingue, 1791, après le décret donnant des droits politiques aux libres de couleur.',
      },
      {
        texte:
          'En me renversant, on n’a abattu que le tronc de l’arbre de la liberté des Noirs ; il repoussera par les racines, parce qu’elles sont profondes et nombreuses.',
        qui: 'Toussaint Louverture',
        contexte:
          'En montant à bord du vaisseau qui l’emmène prisonnier en France, à Saint-Domingue, en juin 1802.',
        sens:
          'Il meurt au fort de Joux en 1803 ; Haïti devient indépendante le 1ᵉʳ janvier 1804. La phrase s’est vérifiée en dix-huit mois.',
      },
    ],
    reperes: [
      'En 1789, environ 700 000 personnes sont esclaves dans les colonies françaises, dont les deux tiers à Saint-Domingue.',
      'Les esclaves de Saint-Domingue se soulèvent dans la nuit du 22 au 23 août 1791.',
      'Le commissaire Sonthonax proclame la liberté générale au Cap le 29 août 1793, avant tout décret de Paris.',
      'Trois députés de Saint-Domingue — Belley, Mills et Dufay — sont reçus à la Convention le 3 février 1794.',
      'Le décret du 4 février 1794 est voté par acclamation, sans un mot de débat.',
      'Bonaparte rétablit l’esclavage par la loi du 20 mai 1802 : il faudra recommencer en 1848.',
    ],
    causes: [
      'La contradiction ouverte entre la Déclaration des droits de l’homme de 1789 — « les hommes naissent et demeurent libres et égaux en droits » — et le Code noir de 1685, toujours en vigueur.',
      'Le travail de la Société des amis des Noirs, fondée en 1788 par Brissot, où militent Condorcet, La Fayette et l’abbé Grégoire.',
      'Les décrets arrachés pour les libres de couleur : 15 mai 1791, puis 4 avril 1792, qui leur reconnaît l’égalité politique.',
      'La révolte des esclaves de Saint-Domingue à partir du 22 août 1791 : la colonie la plus riche du monde échappe à la France.',
      'La guerre coloniale : Anglais et Espagnols débarquent à Saint-Domingue en 1793 ; libérer les esclaves, c’est se donner une armée sur place.',
      'L’émancipation déjà proclamée par les commissaires civils Sonthonax et Polverel en août-octobre 1793, que Paris doit ratifier ou désavouer.',
      'L’arrivée à Paris, le 3 février 1794, des trois députés élus par Saint-Domingue.',
    ],
    recit: [
      {
        titre: 'Ce que la Révolution ne voulait pas voir',
        texte:
          'En 1789, la France est la deuxième puissance négrière d’Europe. **Saint-Domingue**, l’actuelle Haïti, fournit à elle seule près de la moitié du sucre et du café consommés dans le monde ; **près de 500 000 esclaves** y travaillent, sur un total d’environ **700 000** dans l’ensemble des colonies françaises. La Déclaration des droits de l’homme d’août 1789 ne dit pas un mot des colonies : les députés des ports — Bordeaux, Nantes, La Rochelle — et le lobby des planteurs, le club Massiac, obtiennent que le régime colonial soit mis à part. La **Société des amis des Noirs**, fondée en 1788, réclame d’abord l’abolition de la **traite** plutôt que celle de l’esclavage, et obtient péniblement des droits pour les **libres de couleur** : mai 1791, puis avril 1792. Le supplice du mulâtre **Vincent Ogé**, roué vif en février 1791 pour avoir réclamé l’application de la loi, montre ce que valent ces textes face aux colons.',
      },
      {
        titre: 'Saint-Domingue prend les devants',
        texte:
          'Dans la nuit du **22 au 23 août 1791**, les esclaves du nord de Saint-Domingue se soulèvent : les plantations de la plaine du Cap brûlent sur des lieues. La révolte, d’abord menée par **Boukman**, ne sera jamais écrasée. En 1793, la guerre européenne atteint l’île : les Anglais débarquent, les Espagnols de Santo Domingo arment les insurgés. Les commissaires civils envoyés par Paris, **Sonthonax** et **Polverel**, n’ont plus d’armée fiable. Le **29 août 1793**, Sonthonax proclame au Cap la **liberté générale** dans la province du Nord — sans y être autorisé —, Polverel fait de même à l’Ouest et au Sud en septembre et octobre. La décision est d’abord militaire : elle transforme des révoltés en soldats de la République. **Toussaint Louverture**, qui combattait alors pour l’Espagne, rallie la France en mai 1794 et devient le meilleur général de l’île.',
      },
      {
        titre: 'Seize pluviôse : dix minutes de séance',
        texte:
          'Pour faire ratifier leur décision, les commissaires envoient à Paris trois députés élus par Saint-Domingue. Ils arrivent en pleine Terreur, sont d’abord emprisonnés, puis admis à la Convention le **3 février 1794** : **Jean-Baptiste Belley**, né au Sénégal, vendu enfant, qui a racheté sa liberté ; **Jean-Baptiste Mills**, libre de couleur ; **Louis-Pierre Dufay**, blanc. Dufay lit le lendemain un long rapport. La salle se lève. Un député demande qu’on ne souille pas la séance par une discussion : le décret est voté **par acclamation**, en quelques minutes, sans débat ni appel nominal. *« L’esclavage des Nègres dans toutes les colonies est aboli. »* Le soir, Paris illumine ; les trois députés sont embrassés au fauteuil du président. C’est la **première abolition** décidée par un État européen — et elle va bien au-delà de l’affranchissement : elle fait des anciens esclaves des **citoyens français** de plein droit.',
      },
      {
        titre: 'Appliqué ici, jamais là',
        texte:
          'Le décret n’a pas la même force partout. Il est appliqué à **Saint-Domingue**, où Toussaint Louverture gouverne bientôt l’île entière et lui donne une constitution en 1801 ; en **Guadeloupe**, où Victor Hugues le proclame en 1794 après avoir repris l’île aux Anglais ; en **Guyane**. Il ne l’est **jamais à la Martinique**, occupée par les Anglais de 1794 à 1802, ni à **l’île de France** et à **la Réunion**, où les colons chassent en 1796 les commissaires venus l’annoncer. Et la liberté proclamée s’accompagne partout d’un **travail forcé** sur les habitations : on ne peut pas quitter la plantation, on est payé en part de récolte. Beaucoup d’anciens esclaves y voient un autre nom pour la même chose.',
      },
      {
        titre: 'Huit ans plus tard, tout est défait',
        texte:
          'Devenu Premier consul, **Bonaparte** cède aux planteurs, aux ports et à sa propre famille créole. La loi du **20 mai 1802** (30 floréal an X) maintient l’esclavage là où il n’avait pas été aboli et le **rétablit** en Guadeloupe et en Guyane ; la traite reprend. En Guadeloupe, le colonel **Delgrès** et ses hommes se font sauter à **Matouba** le 28 mai 1802 plutôt que de redevenir esclaves. À Saint-Domingue, l’expédition du général **Leclerc** arrête Toussaint Louverture par traîtrise ; déporté, il meurt de froid et de faim au **fort de Joux**, dans le Jura, le 7 avril 1803. Mais l’armée française, minée par la fièvre jaune, est battue à Vertières ; **Haïti** proclame son indépendance le **1ᵉʳ janvier 1804** : c’est la seule révolte d’esclaves de l’histoire à avoir fondé un État. En France, il faudra attendre le décret du **27 avril 1848**, préparé par **Victor Schœlcher**, pour que l’abolition soit définitive. Cinquante-quatre ans perdus.',
      },
    ],
    consequences: [
      'La France est le premier État européen à abolir l’esclavage dans ses colonies, et elle fait des affranchis des citoyens.',
      'Toussaint Louverture rallie la République en mai 1794, devient gouverneur de Saint-Domingue et lui donne une constitution en 1801.',
      'Le décret est appliqué à Saint-Domingue, en Guadeloupe et en Guyane, jamais à la Martinique ni aux Mascareignes.',
      'Bonaparte rétablit l’esclavage par la loi du 20 mai 1802 ; Delgrès se fait sauter à Matouba, Toussaint meurt au fort de Joux en 1803.',
      'Haïti proclame son indépendance le 1ᵉʳ janvier 1804 : la seule révolte d’esclaves de l’histoire à fonder un État.',
      'Il faut attendre le décret du 27 avril 1848, obtenu par Victor Schœlcher, pour l’abolition définitive.',
    ],
    chiffres: [
      { valeur: '700 000', quoi: 'esclaves dans les colonies françaises en 1789' },
      { valeur: '3', quoi: 'députés de Saint-Domingue reçus à la Convention' },
      { valeur: '8 ans', quoi: 'entre l’abolition de 1794 et son rétablissement en 1802' },
      { valeur: '54 ans', quoi: 'avant l’abolition définitive du 27 avril 1848' },
    ],
    chrono: [
      { date: '1685', fait: 'Le Code noir règle le statut des esclaves des colonies.' },
      { date: '1788', fait: 'Fondation de la Société des amis des Noirs.' },
      { date: '22-23 août 1791', fait: 'Soulèvement des esclaves du nord de Saint-Domingue.' },
      { date: '29 août 1793', fait: 'Sonthonax proclame la liberté générale au Cap.' },
      { date: '3 février 1794', fait: 'Belley, Mills et Dufay sont reçus à la Convention.' },
      { date: '4 février 1794', fait: '16 pluviôse an II : l’esclavage est aboli.' },
      { date: 'mai 1794', fait: 'Toussaint Louverture rallie la République.' },
      { date: '20 mai 1802', fait: 'Bonaparte rétablit l’esclavage ; Delgrès meurt à Matouba.' },
      { date: '7 avril 1803', fait: 'Mort de Toussaint Louverture au fort de Joux.' },
      { date: '1ᵉʳ janvier 1804', fait: 'Indépendance d’Haïti.' },
      { date: '27 avril 1848', fait: 'Abolition définitive, préparée par Victor Schœlcher.' },
    ],
    leSaisTu:
      '**Jean-Baptiste Belley** est né sur l’île de Gorée, vendu enfant à Saint-Domingue, et il a racheté sa propre liberté avec ses économies d’artisan. En 1794, il devient le premier député noir à siéger dans une assemblée française. Le peintre Girodet l’a portraituré en 1797, en habit de représentant du peuple, accoudé au buste de l’abbé Raynal.',
    aRetenir: [
      'Le 4 février 1794 (16 pluviôse an II), la Convention abolit l’esclavage dans toutes les colonies.',
      'Le décret fait des anciens esclaves des citoyens français : c’est la première abolition en Europe.',
      'Il ratifie la liberté générale déjà proclamée à Saint-Domingue par Sonthonax le 29 août 1793.',
      'Trois députés de Saint-Domingue, dont l’ancien esclave Jean-Baptiste Belley, siègent à la Convention.',
      'Bonaparte rétablit l’esclavage le 20 mai 1802 ; l’abolition définitive date du 27 avril 1848.',
    ],
    mots: [
      {
        mot: 'Code noir',
        sens: 'Ensemble d’ordonnances de 1685 fixant le statut des esclaves dans les colonies françaises.',
      },
      {
        mot: 'Traite',
        sens: 'Commerce des êtres humains déportés d’Afrique vers les colonies d’Amérique.',
      },
      {
        mot: 'Libres de couleur',
        sens: 'Personnes noires ou métisses non esclaves, souvent propriétaires, privées de droits politiques avant 1792.',
      },
      {
        mot: 'Commissaire civil',
        sens: 'Envoyé du gouvernement chargé de faire appliquer la loi dans une colonie, avec de larges pouvoirs.',
      },
      {
        mot: 'Pluviôse',
        sens: 'Cinquième mois du calendrier républicain, de fin janvier à fin février : le mois des pluies.',
      },
    ],
    lies: [
      'abbe-gregoire',
      'toussaint-louverture',
      'declaration-des-droits-de-l-homme',
      'traite-atlantique-et-code-noir',
      'abolition-de-l-esclavage-1848',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'esclavage',
      'abolition',
      '16 pluviôse',
      'Saint-Domingue',
      'Toussaint Louverture',
      'Belley',
      'Grégoire',
      'Sonthonax',
      'Code noir',
      'Haïti',
      'Delgrès',
      'Schœlcher',
    ],
  },
  {
    id: 'chute-de-robespierre',
    volet: 'evenements',
    nom: 'Le 9 thermidor',
    date: '27 juillet 1794 — 9 thermidor an II',
    tri: 1794,
    periode: 'revolution',
    emoji: '🪓',
    lieu: 'Paris, Convention et Hôtel de Ville',
    accroche:
      'La Convention refuse la parole à Robespierre : vingt-quatre heures plus tard, il monte à l’échafaud sans avoir été jugé.',
    citations: [
      {
        texte: 'Pour la dernière fois, président des assassins, je te demande la parole.',
        qui: 'Robespierre',
        contexte:
          'À la Convention, le 9 thermidor an II, alors que le président Collot d’Herbois agite la sonnette pour couvrir sa voix.',
        sens:
          'L’homme qui gouvernait la France par la parole vient d’en être privé. Tout se joue là : la séance ne lui sera plus rendue.',
      },
      {
        texte: 'C’est le sang de Danton qui t’étouffe !',
        qui: 'Le député Garnier de l’Aube',
        contexte:
          'Lancé à Robespierre dont la voix s’éteint à la tribune, le 9 thermidor — réplique rapportée par des témoins de la séance.',
        sens:
          'Danton avait été guillotiné quatre mois plus tôt. La phrase dit que la Convention se venge autant qu’elle se défend.',
        incertaine: true,
      },
      {
        texte: 'Je suis fait pour combattre le crime, non pour le gouverner.',
        qui: 'Robespierre',
        contexte:
          'Dans son discours du 8 thermidor (26 juillet 1794), la veille, où il dénonce des traîtres sans les nommer.',
        sens:
          'En refusant de donner des noms, il fait de chaque député un suspect possible. Le discours qui devait le sauver a fait la coalition contre lui.',
      },
      {
        texte: 'La Révolution est glacée.',
        qui: 'Saint-Just',
        contexte:
          'Dans ses notes personnelles, au printemps 1794, sur un mouvement qui n’avance plus et se retourne contre lui-même.',
      },
    ],
    reperes: [
      'La victoire de Fleurus, le 26 juin 1794, ôte au gouvernement d’exception sa justification.',
      'La loi de prairial (10 juin) fait craindre à chaque député d’être le prochain sur la liste.',
      'Le 8 thermidor, Robespierre dénonce un complot sans citer de noms : tout le monde se croit visé.',
      'Le 9 thermidor, Saint-Just est interrompu, Robespierre ne peut pas parler, l’arrestation est votée.',
      'La Commune les délivre ; la Convention les met hors la loi et fait donner la troupe de Barras.',
      'À 2 heures du matin, à l’Hôtel de Ville, Robespierre a la mâchoire fracassée par un coup de pistolet.',
    ],
    causes: [
      'La victoire de Fleurus le 26 juin 1794 : l’ennemi repoussé hors des frontières, un gouvernement d’exception n’a plus d’excuse.',
      'La loi de prairial du 10 juin 1794, présentée sans consultation préalable, qui supprime la défense des accusés et effraie la Convention elle-même.',
      'La division du Comité de salut public : Carnot, Billaud-Varenne et Collot d’Herbois contre Robespierre, Saint-Just et Couthon.',
      'Le conflit ouvert avec le Comité de sûreté générale, qui tient la police et se sent dépossédé.',
      'Les représentants en mission rappelés et menacés — Tallien, Fouché, Fréron, Barras — qui n’ont plus rien à perdre.',
      'L’absence prolongée de Robespierre des séances du Comité, plus d’un mois, qui le laisse isoler.',
      'Le discours du 8 thermidor, où il annonce des traîtres sans les nommer : chaque député se croit sur la liste et vote contre lui.',
    ],
    recit: [
      {
        titre: 'Le printemps où tout se retourne',
        texte:
          'Au début de l’été 1794, Robespierre est au sommet et il est seul. La fête de l’**Être suprême**, le 8 juin, qu’il préside en habit bleu et bouquet à la main, lui vaut d’être accusé de vouloir se faire pontife. Deux jours plus tard, la **loi de prairial** supprime les défenseurs devant le Tribunal révolutionnaire, sans que la Convention en ait été prévenue ; les députés comprennent qu’ils peuvent y passer comme les autres et obtiennent à grand-peine que leur propre arrestation reste soumise à un vote. Le **26 juin**, **Fleurus** ouvre la Belgique : l’invasion est écartée, la raison d’être du gouvernement révolutionnaire s’évanouit. Robespierre, malade et découragé, cesse de paraître au Comité de salut public pendant plus de quatre semaines. Pendant ce temps, ceux qu’il a menacés — **Tallien**, **Fouché**, rappelé de Lyon, **Fréron**, **Barras** — se comptent et se parlent.',
      },
      {
        titre: 'Le discours qui fait la coalition',
        texte:
          'Le **8 thermidor** (26 juillet 1794), Robespierre revient à la tribune pour un long discours. Il dénonce une « conjuration » dans les comités, annonce une nouvelle épuration… et refuse de donner des noms. « Je suis fait pour combattre le crime, non pour le gouverner », dit-il. L’Assemblée vote d’abord l’impression du discours, puis se ravise et la rapporte. Le soir, aux **Jacobins**, il relit son texte sous les acclamations, et Billaud-Varenne et Collot d’Herbois sont chassés de la salle. Ils courent au Comité. La nuit du 8 au 9 thermidor se passe en conciliabules : les modérés de la **Plaine**, ceux-là mêmes que Robespierre aurait pu rallier, s’entendent avec les terroristes menacés. Un discours sans noms vient de fabriquer une majorité contre son auteur.',
      },
      {
        titre: 'Neuf thermidor : une séance de quatre heures',
        texte:
          'Le **9 thermidor** au matin, **Saint-Just** monte à la tribune pour lire un rapport favorable à Robespierre. Il n’en dit que quelques lignes : **Tallien** l’interrompt, brandit un poignard, Billaud-Varenne l’accable. Robespierre s’élance, veut parler ; le président **Collot d’Herbois** agite la sonnette et donne la parole à tous sauf à lui. Sa voix se brise. Un député lui lance que c’est le sang de Danton qui l’étouffe. Il jette alors à la salle la phrase que l’histoire a retenue : *« Pour la dernière fois, président des assassins, je te demande la parole. »* Un obscur député demande le décret d’arrestation ; il est voté d’enthousiasme contre **Robespierre**, son frère **Augustin**, **Saint-Just**, **Couthon** et **Le Bas**. Les cinq sont emmenés — mais aucune prison n’ose les recevoir, et la **Commune de Paris**, qui leur est acquise, les fait conduire à l’**Hôtel de Ville**.',
      },
      {
        titre: 'La nuit du 9 au 10',
        texte:
          'À l’Hôtel de Ville, tout est encore possible : la Commune a des canons, le commandant **Hanriot** a la garde nationale. Mais on attend. Robespierre, qui a passé sa vie à défendre la légalité, refuse longtemps d’appeler à l’insurrection contre la Convention ; on lui met une plume dans la main pour signer un appel aux sections, il trace deux lettres — **« Ro »** — et s’arrête. Pendant ce temps, la Convention les déclare **hors la loi** : plus besoin de les juger, il suffira de constater leur identité. **Barras** rassemble des troupes ; les sections hésitent, puis se retirent sous la pluie. Vers 2 heures du matin, les hommes de Bourdon entrent dans la salle. **Le Bas** se tue d’un coup de pistolet ; **Augustin Robespierre** saute par une fenêtre ; **Couthon**, paralysé, est trouvé au bas d’un escalier ; **Robespierre** a la **mâchoire fracassée** par un coup de feu — le sien, ou celui du gendarme Merda : les témoignages divergent depuis deux siècles.',
      },
      {
        titre: 'Le 10 thermidor, et après',
        texte:
          'On l’étend une partie de la nuit sur une table de l’antichambre du Comité de salut public, la tête entourée d’un bandage, sous les insultes. Comme les condamnés sont **hors la loi**, le Tribunal révolutionnaire n’a qu’à vérifier leur identité : aucun procès, aucune défense, aucune parole. Le soir du **10 thermidor** (28 juillet 1794), **vingt-deux** hommes sont guillotinés place de la Révolution. Le bourreau arrache le bandage avant de coucher Robespierre sur la planche ; il crie. Il a **36 ans**. Le lendemain, **71 membres de la Commune** de Paris sont exécutés à leur tour : la plus grande fournée de toute la Révolution. Puis la machine s’arrête d’elle-même : la loi de prairial est abrogée le 1ᵉʳ août, les prisons se vident, le club des **Jacobins** ferme le 12 novembre 1794. La **réaction thermidorienne** installe les hommes d’affaires et les modérés, avec sa Terreur blanche dans le Midi, et conduit au **Directoire** en octobre 1795. Un général de vingt-quatre ans, ami du frère Robespierre, est brièvement arrêté puis relâché ces jours-là : il s’appelle **Bonaparte**.',
      },
    ],
    consequences: [
      'Vingt-deux exécutions sans jugement le 10 thermidor, puis 71 membres de la Commune le lendemain : environ 106 morts en trois jours.',
      'La Terreur prend fin : la loi de prairial est abrogée le 1ᵉʳ août 1794, les prisons se vident, le Tribunal révolutionnaire est supprimé en mai 1795.',
      'Le club des Jacobins est fermé le 12 novembre 1794 ; la Terreur blanche frappe les anciens jacobins dans le Midi.',
      'La réaction thermidorienne porte au pouvoir les modérés, les fournisseurs aux armées et les spéculateurs : l’argent remplace la vertu.',
      'La Constitution de l’an III installe le Directoire le 26 octobre 1795, régime instable qui finira au 18 brumaire.',
      'Le mot « thermidorien » désigne depuis celui qui met fin à une révolution au nom de l’ordre.',
    ],
    chiffres: [
      { valeur: '22', quoi: 'exécutés sans jugement le 10 thermidor' },
      { valeur: '106', quoi: 'condamnés en trois jours, du 10 au 12 thermidor' },
      { valeur: '36 ans', quoi: 'l’âge de Robespierre' },
      { valeur: '2 h du matin', quoi: 'l’assaut de l’Hôtel de Ville' },
    ],
    chrono: [
      { date: '8 juin 1794', fait: 'Fête de l’Être suprême, présidée par Robespierre.' },
      { date: '10 juin 1794', fait: 'Loi de prairial : la Convention prend peur.' },
      { date: '26 juin 1794', fait: 'Victoire de Fleurus : l’invasion est écartée.' },
      { date: '26 juillet 1794', fait: '8 thermidor : discours contre des traîtres sans nom.' },
      { date: '27 juillet 1794', fait: '9 thermidor : arrestation votée à la Convention.' },
      { date: 'nuit du 9 au 10', fait: 'Hôtel de Ville ; mise hors la loi ; assaut de Barras.' },
      { date: '28 juillet 1794', fait: '10 thermidor : 22 exécutions sans jugement.' },
      { date: '29 juillet 1794', fait: '71 membres de la Commune de Paris guillotinés.' },
      { date: '1ᵉʳ août 1794', fait: 'Abrogation de la loi de prairial.' },
      { date: '12 novembre 1794', fait: 'Fermeture du club des Jacobins.' },
      { date: '26 octobre 1795', fait: 'Installation du Directoire.' },
    ],
    leSaisTu:
      'La feuille que Robespierre n’a pas signée existe encore. C’est l’appel aux sections préparé à l’Hôtel de Ville dans la nuit du 9 au 10 thermidor : la signature s’arrête sur deux lettres, **« Ro »**, et le papier porte une tache de sang. Il est conservé aux Archives nationales, à Paris.',
    aRetenir: [
      'Le 9 thermidor an II (27 juillet 1794), la Convention refuse la parole à Robespierre et vote son arrestation.',
      'Le discours du 8 thermidor, dénonçant des traîtres sans les nommer, a ligué contre lui toute l’assemblée.',
      'La victoire de Fleurus (26 juin 1794) avait ôté sa justification au gouvernement d’exception.',
      'Mis hors la loi, Robespierre est exécuté sans jugement le 10 thermidor avec vingt et un autres.',
      'La chute ouvre la réaction thermidorienne, puis le Directoire en octobre 1795.',
    ],
    mots: [
      {
        mot: 'Thermidor',
        sens: 'Onzième mois du calendrier républicain, de fin juillet à fin août : le mois de la chaleur.',
      },
      {
        mot: 'Hors la loi',
        sens: 'Mise au ban permettant de faire exécuter un condamné après simple vérification de son identité, sans procès.',
      },
      {
        mot: 'Réaction thermidorienne',
        sens: 'Période qui suit le 9 thermidor : fin de la Terreur, retour des modérés, poussée des spéculateurs.',
      },
      {
        mot: 'Comité de sûreté générale',
        sens: 'Comité chargé de la police et des arrestations, rival du Comité de salut public.',
      },
    ],
    lies: ['robespierre', 'la-terreur', 'danton', 'coup-d-etat-du-18-brumaire', 'lazare-carnot'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      '9 thermidor',
      'Robespierre',
      'Saint-Just',
      'Tallien',
      'Barras',
      'Hôtel de Ville',
      'hors la loi',
      'réaction thermidorienne',
      'Directoire',
      'Fleurus',
    ],
  },
]
