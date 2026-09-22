// -----------------------------------------------------------------------------
// GUERRES MONDIALES — la France : Foch, Clemenceau, Moulin, Aubrac,
// Manouchian, de Gaulle, Pétain, Leclerc.
//
// Huit fiches, deux guerres, une seule question posée huit fois : que fait-on
// quand le pays est par terre ? Le lot est écrit sur le patron de
// `personnages-moyen-age-rois.ts` et tenu par `docs/encyclopedie.md`.
//
// Les bornes de la période s'arrêtent en 1950 : Pétain (mort en 1951) est donc
// trié sur l'année de son PROCÈS, de Gaulle (mort en 1970) sur la libération
// de Paris et Lucie Aubrac (morte en 2007) sur l'évasion de son mari. Le
// libellé `dates` donne, lui, la vraie date de mort.
//
// Sur Vichy et sur Pétain, la consigne du guide s'applique à la lettre : on
// est FACTUEL, daté, chiffré. Ni réhabilitation, ni invective — les actes
// signés et leurs dates suffisent. La fiche de De Gaulle s'arrête en 1946 :
// la Vᵉ République est racontée ailleurs (`naissance-de-la-ve-republique`).
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_GUERRES_FRANCE: Personnage[] = [
  {
    id: 'ferdinand-foch',
    volet: 'personnages',
    nom: 'Ferdinand Foch',
    surnom: 'le maréchal de la victoire',
    dates: '1851 – 1929',
    tri: 1929,
    periode: 'guerres',
    emoji: '🎖️',
    roles: ['Maréchal de France', 'Généralissime des armées alliées', 'Théoricien militaire'],
    origine: 'Tarbes, Hautes-Pyrénées',
    accroche:
      'Nommé chef unique des armées alliées en 1918, il gagne la guerre en huit mois — et prédit que la paix de Versailles ne tiendra que vingt ans.',
    citations: [
      {
        texte: 'Mon centre cède, ma droite recule, situation excellente, j’attaque.',
        contexte: 'Message qu’on lui prête pendant la bataille de la Marne, en septembre 1914.',
        sens:
          'Aucun original n’a jamais été retrouvé dans les archives : la formule résume son tempérament plus qu’elle ne rapporte ses mots.',
        incertaine: true,
      },
      {
        texte: 'Ce n’est pas une paix, c’est un armistice de vingt ans.',
        contexte: 'Sur le traité de Versailles, signé le 28 juin 1919.',
        sens:
          'Il le juge trop dur pour être accepté et trop mou pour empêcher l’Allemagne de recommencer. La guerre reprendra en septembre 1939, vingt ans plus tard.',
      },
      {
        texte: 'De quoi s’agit-il ?',
        contexte: 'Sa question de méthode, répétée à ses élèves de l’École supérieure de guerre.',
        sens:
          'Avant de décider quoi que ce soit, savoir exactement quel est le problème : c’est le premier principe qu’il enseignait.',
      },
    ],
    reperes: [
      'Fils d’un fonctionnaire de Tarbes, il a 19 ans lors de la défaite de 1870 et ne l’oubliera jamais.',
      'Professeur puis directeur de l’École supérieure de guerre : il forme les officiers de 1914.',
      'Septembre 1914 : sa IXᵉ armée tient les marais de Saint-Gond au centre de la bataille de la Marne.',
      '26 mars 1918 : la conférence de Doullens lui confie le commandement unique des armées alliées.',
      '11 novembre 1918 : il reçoit la délégation allemande dans son wagon, à Rethondes.',
      'Maréchal de France en août 1918, puis maréchal britannique et maréchal de Pologne.',
    ],
    recit: [
      {
        titre: 'Le professeur avant le général',
        texte:
          'Né à **Tarbes** en 1851, Ferdinand Foch a dix-neuf ans quand la France perd la guerre de 1870 : mobilisé, il ne voit pas le feu, et l’humiliation ne le quittera pas. Polytechnique, l’artillerie, puis l’**École supérieure de guerre**, où il enseigne de 1895 à 1901 et qu’il dirige de 1908 à 1911. Ses cours, publiés sous les titres *Des principes de la guerre* et *De la conduite de la guerre*, forment toute une génération d’officiers. Il y martèle une méthode plus qu’une doctrine : connaître la situation réelle, vouloir, et frapper au point décisif. Sa question favorite à ses élèves — « De quoi s’agit-il ? » — restera célèbre dans l’armée française.',
      },
      {
        titre: 'Les marais de Saint-Gond, 1914',
        texte:
          'En septembre **1914**, l’armée allemande est à cinquante kilomètres de Paris. Joffre confie à Foch une armée improvisée, la **IXᵉ**, chargée de tenir le centre du dispositif dans les **marais de Saint-Gond**, en Champagne. Pendant cinq jours, la ligne plie sans rompre. C’est de ces journées que date le message le plus cité de la Grande Guerre — « Mon centre cède, ma droite recule, situation excellente, j’attaque » —, dont aucun original n’a jamais été retrouvé. La **bataille de la Marne** sauve Paris et fixe la guerre dans les tranchées pour quatre ans. Foch dirige ensuite le groupe d’armées du Nord, subit l’échec de la **Somme** en 1916, se retrouve écarté, puis revient comme chef d’état-major général en 1917.',
      },
      {
        titre: 'Un seul chef, enfin',
        texte:
          'Le **21 mars 1918**, l’Allemagne, libérée du front russe par la révolution bolchevique, lance une offensive qui enfonce le front britannique et rouvre la guerre de mouvement. Français et Britanniques se renvoient la responsabilité ; chacun veut couvrir sa capitale ou ses ports. Le **26 mars**, à la conférence de **Doullens**, Clemenceau impose ce que les Alliés refusaient depuis quatre ans : un **commandement unique**. Foch le reçoit, avec le titre de généralissime des armées alliées — françaises, britanniques, belges, puis américaines et italiennes. Il arrête les offensives allemandes une à une, garde ses réserves pour le moment juste, et déclenche le **18 juillet** la contre-attaque de **Villers-Cotterêts**. À partir de là, les Alliés ne reculent plus. Le **8 août**, « jour de deuil de l’armée allemande » selon Ludendorff, ouvre les cent jours qui mènent à l’armistice.',
      },
      {
        titre: 'Rethondes, puis l’avertissement',
        texte:
          'Le **8 novembre 1918**, la délégation allemande est reçue dans un **wagon-restaurant** aménagé en bureau, garé dans la clairière de **Rethondes**, en forêt de Compiègne. Foch lit les conditions, refuse de négocier, accorde soixante-douze heures. L’**armistice** est signé le **11 novembre à 5 h 15** et entre en vigueur à **11 heures**. À la conférence de la paix, il réclame la frontière du **Rhin** comme barrière militaire ; les Alliés la refusent. Lisant le **traité de Versailles** signé le 28 juin 1919, il prononce la phrase qui a fait sa postérité : « Ce n’est pas une paix, c’est un armistice de vingt ans. » Il meurt le **20 mars 1929** et repose aux **Invalides**, non loin de Napoléon et de Turenne.',
      },
    ],
    chrono: [
      { date: '1851', fait: 'Naissance à Tarbes, le 2 octobre.' },
      { date: '1908', fait: 'Il prend la direction de l’École supérieure de guerre.' },
      { date: 'septembre 1914', fait: 'Sa IXᵉ armée tient le centre à la bataille de la Marne.' },
      { date: '26 mars 1918', fait: 'Doullens : il reçoit le commandement unique des Alliés.' },
      { date: '18 juillet 1918', fait: 'Contre-offensive de Villers-Cotterêts.' },
      { date: '6 août 1918', fait: 'Élevé à la dignité de maréchal de France.' },
      { date: '11 novembre 1918', fait: 'Armistice signé dans son wagon, à Rethondes.' },
      { date: '28 juin 1919', fait: '« Un armistice de vingt ans » : son verdict sur Versailles.' },
      { date: '20 mars 1929', fait: 'Mort à Paris ; il repose aux Invalides.' },
    ],
    leSaisTu:
      'Le wagon de l’armistice a servi deux fois. Le 22 juin 1940, Hitler le fait sortir du musée où il était exposé et replacer à l’endroit exact de 1918, dans la clairière de Rethondes, pour recevoir la délégation française. Il s’assoit dans le fauteuil de Foch, puis quitte le wagon sans un mot.',
    aRetenir: [
      'Ferdinand Foch dirige l’École supérieure de guerre avant 1914 et forme les officiers de la Grande Guerre.',
      'Il commande la IXᵉ armée au centre de la bataille de la Marne, en septembre 1914.',
      'Le 26 mars 1918, la conférence de Doullens lui confie le commandement unique des armées alliées.',
      'Il reçoit la délégation allemande et signe l’armistice le 11 novembre 1918 à Rethondes.',
      'Devant le traité de Versailles de 1919, il annonce « un armistice de vingt ans ».',
    ],
    mots: [
      {
        mot: 'Généralissime',
        sens: 'Chef unique placé au-dessus de tous les généraux d’une coalition, étrangers compris.',
      },
      {
        mot: 'Armistice',
        sens: 'Arrêt des combats convenu entre deux armées ; ce n’est pas la paix, qui se signe par un traité.',
      },
    ],
    lies: [
      'georges-clemenceau',
      'philippe-petain',
      'bataille-de-la-marne',
      'armistice-du-11-novembre-1918',
      'traite-de-versailles',
    ],
    niveaux: ['3e'],
    programme: 'Civils et militaires dans la Première Guerre mondiale',
    tags: [
      'Foch',
      'maréchal',
      'Marne',
      'Rethondes',
      'armistice',
      'commandement unique',
      'Doullens',
      'Grande Guerre',
      'Versailles',
      '1918',
    ],
  },
  {
    id: 'georges-clemenceau',
    volet: 'personnages',
    nom: 'Georges Clemenceau',
    surnom: 'le Tigre',
    dates: '1841 – 1929',
    tri: 1929,
    periode: 'guerres',
    emoji: '🐅',
    roles: ['Président du Conseil', 'Journaliste', 'Médecin', 'Député radical'],
    origine: 'Mouilleron-en-Pareds, Vendée',
    accroche:
      'Médecin, journaliste, républicain de combat : à 76 ans, il prend le gouvernement en 1917 avec un programme de quatre mots — « Je fais la guerre ».',
    citations: [
      {
        texte: 'Je fais la guerre.',
        contexte:
          'Déclaration de politique générale devant la Chambre des députés, le 20 novembre 1917.',
        sens:
          'Il n’annonce rien d’autre : ni réforme, ni négociation. Toute la vie du pays est désormais ordonnée à la victoire.',
      },
      {
        texte:
          'Politique intérieure ? Je fais la guerre. Politique étrangère ? Je fais la guerre. Toujours, partout, je fais la guerre.',
        contexte:
          'Suite du même discours, devant une Chambre épuisée par trois ans de conflit et par les mutineries.',
      },
      {
        texte: 'J’accuse… !',
        contexte:
          'Le titre qu’il donne, comme directeur de *L’Aurore*, à la lettre d’Émile Zola publiée le 13 janvier 1898.',
        sens:
          'Zola avait intitulé son texte « Lettre à M. Félix Faure ». Clemenceau trouve les deux mots qui feront le tour du monde.',
      },
      {
        texte: 'La guerre ! C’est une chose trop grave pour la confier à des militaires.',
        contexte: 'Formule qu’on lui attribue, sans discours ni écrit qui l’atteste.',
        sens:
          'Elle résume pourtant sa pratique : président du Conseil, il allait lui-même dans les tranchées et tranchait contre ses généraux quand il le jugeait nécessaire.',
        incertaine: true,
      },
    ],
    reperes: [
      'Fils d’un médecin républicain, emprisonné à 21 ans pour un appel à manifester contre l’Empire.',
      'Maire de Montmartre en 1871, il tente en vain d’empêcher les premiers morts de la Commune.',
      'Directeur de L’Aurore, il titre « J’accuse… ! » le texte de Zola, le 13 janvier 1898.',
      'Ministre de l’Intérieur puis président du Conseil de 1906 à 1909 : « le premier flic de France ».',
      'Président du Conseil du 16 novembre 1917 au 20 janvier 1920 : c’est le Père la Victoire.',
      'Négociateur du traité de Versailles, signé le 28 juin 1919 dans la galerie des Glaces.',
    ],
    recit: [
      {
        titre: 'Un républicain de combat',
        texte:
          'Né en **Vendée** en 1841 dans une famille de médecins républicains, Georges Clemenceau est arrêté à vingt et un ans pour avoir affiché un appel à manifester contre **Napoléon III** : soixante-treize jours de prison, sa première école politique. Il part aux **États-Unis**, y enseigne le français, épouse une Américaine, revient médecin. En 1870, la République proclamée le fait **maire de Montmartre** : c’est lui qui, le 18 mars 1871, court entre les soldats et la foule pour tenter d’empêcher l’exécution des généraux Lecomte et Clément-Thomas — le premier sang de la **Commune**. Devenu député radical, il fait tomber tant de ministères en vingt ans qu’on le surnomme le **tombeur de ministères**, puis le **Tigre**.',
      },
      {
        titre: 'Dreyfusard',
        texte:
          'En 1894, le capitaine **Alfred Dreyfus** est condamné pour trahison. Clemenceau, d’abord persuadé de sa culpabilité, change d’avis en découvrant le dossier et devient l’un de ses plus acharnés défenseurs : il écrira près de **six cents articles** sur l’Affaire. Le 13 janvier 1898, **Émile Zola** lui apporte une lettre ouverte au président de la République ; c’est Clemenceau, directeur de *L’Aurore*, qui la titre **« J’accuse… ! »** et la tire à trois cent mille exemplaires. La France se déchire ; Dreyfus est réhabilité en **1906**. La même année, Clemenceau entre au gouvernement — et l’ancien contestataire fait donner la troupe contre les grévistes, ce qui lui vaut d’être appelé « le premier flic de France ». Il n’a jamais séparé la République de l’ordre public.',
      },
      {
        titre: '« Je fais la guerre »',
        texte:
          'Écarté du pouvoir en 1909, Clemenceau passe la **Première Guerre mondiale** à la commission sénatoriale de l’armée et dans son journal *L’Homme enchaîné*, où il harcèle généraux et ministres. À l’automne **1917**, la France est au plus bas : mutineries après l’échec du **Chemin des Dames**, grèves, affaires de trahison, gouvernements qui tombent. Le président **Poincaré**, qui le déteste, l’appelle malgré tout. Le **20 novembre 1917**, devant la Chambre, il expose son programme : « Politique intérieure ? Je fais la guerre. Politique étrangère ? Je fais la guerre. » Il a soixante-seize ans. Il fait juger les défaitistes, se rend chaque semaine dans les tranchées où les soldats l’appellent le **Père la Victoire**, et impose en mars 1918 le **commandement unique** de Foch. Huit mois plus tard, l’Allemagne demande l’armistice.',
      },
      {
        titre: 'Versailles, et la sortie',
        texte:
          'Le **11 novembre 1918**, la Chambre debout l’acclame. Commence alors la partie la plus difficile : la paix. À la conférence de Paris, Clemenceau affronte le président américain **Wilson**, qui veut une paix de principes, et le Britannique **Lloyd George**, qui tient à garder une Allemagne solvable. Lui réclame des garanties : il obtient le retour de l’**Alsace-Lorraine**, les **réparations**, la démilitarisation de la Rhénanie, mais pas la frontière du Rhin que Foch exigeait. Le **traité de Versailles** est signé le 28 juin 1919 dans la **galerie des Glaces**, là même où l’Empire allemand avait été proclamé en 1871. Les uns le trouvent trop dur, les autres trop faible. Battu à l’élection présidentielle de janvier 1920, il se retire, voyage, écrit, et meurt le **24 novembre 1929**.',
      },
    ],
    chrono: [
      { date: '1841', fait: 'Naissance à Mouilleron-en-Pareds, en Vendée.' },
      { date: '1871', fait: 'Maire de Montmartre au premier jour de la Commune de Paris.' },
      { date: '13 janvier 1898', fait: 'Il titre « J’accuse… ! » le texte de Zola dans L’Aurore.' },
      { date: '1906', fait: 'Président du Conseil ; réhabilitation du capitaine Dreyfus.' },
      { date: '16 novembre 1917', fait: 'Rappelé au pouvoir pour gagner la guerre.' },
      { date: '20 novembre 1917', fait: '« Je fais la guerre » devant la Chambre des députés.' },
      { date: '26 mars 1918', fait: 'Il impose le commandement unique de Foch, à Doullens.' },
      { date: '11 novembre 1918', fait: 'Armistice : on l’acclame comme Père la Victoire.' },
      { date: '28 juin 1919', fait: 'Signature du traité de Versailles.' },
      { date: '1929', fait: 'Mort à Paris ; tombe sans nom dans un bois de Vendée.' },
    ],
    leSaisTu:
      'Il a refusé les funérailles nationales et le Panthéon. Sa tombe est un simple tertre dans un bois de Vendée, près de celle de son père, sans croix ni nom : une grille, une stèle de granit et son bâton de marche gravé dans la pierre. Il avait écrit ses volontés dès 1918, en pleine gloire.',
    aRetenir: [
      'Georges Clemenceau, surnommé le Tigre, est président du Conseil de 1906 à 1909, puis de novembre 1917 à janvier 1920.',
      'Directeur de L’Aurore, il titre « J’accuse… ! » la lettre de Zola en faveur de Dreyfus, le 13 janvier 1898.',
      'Le 20 novembre 1917, il résume son programme devant la Chambre : « Je fais la guerre ».',
      'Il impose en mars 1918 le commandement unique des armées alliées, confié à Foch.',
      'Surnommé le Père la Victoire, il négocie et signe le traité de Versailles le 28 juin 1919.',
    ],
    mots: [
      {
        mot: 'Président du Conseil',
        sens: 'Le chef du gouvernement sous la IIIᵉ République ; l’équivalent du Premier ministre d’aujourd’hui.',
      },
      {
        mot: 'Union sacrée',
        sens: 'Le ralliement de tous les partis français au gouvernement de guerre, décidé en août 1914.',
      },
      {
        mot: 'Défaitisme',
        sens: 'L’attitude de ceux qui jugent la guerre perdue et poussent à négocier ; Clemenceau la fait poursuivre en justice.',
      },
    ],
    lies: [
      'ferdinand-foch',
      'philippe-petain',
      'alfred-dreyfus',
      'emile-zola',
      'traite-de-versailles',
    ],
    niveaux: ['3e'],
    programme: 'Civils et militaires dans la Première Guerre mondiale',
    tags: [
      'Clemenceau',
      'le Tigre',
      'Père la Victoire',
      'L’Aurore',
      'J’accuse',
      'Dreyfus',
      'Versailles',
      'IIIᵉ République',
      'Vendée',
      '1917',
    ],
  },
  {
    id: 'jean-moulin',
    volet: 'personnages',
    nom: 'Jean Moulin',
    surnom: 'l’homme qui a unifié la Résistance',
    dates: '1899 – 1943',
    tri: 1943,
    periode: 'guerres',
    emoji: '🧣',
    roles: ['Préfet', 'Délégué du général de Gaulle', 'Président du Conseil national de la Résistance'],
    origine: 'Béziers, Hérault',
    accroche:
      'Plus jeune préfet de France, il refuse de signer un mensonge en 1940, puis rassemble toute la Résistance française sous une seule autorité.',
    citations: [
      {
        texte:
          'Entre ici, Jean Moulin, avec ton terrible cortège… avec ceux qui sont morts dans les caves sans avoir parlé, comme toi.',
        qui: 'André Malraux',
        contexte:
          'Discours du transfert de ses cendres au Panthéon, le 19 décembre 1964, devant le général de Gaulle.',
      },
      {
        texte:
          'M. Moulin a pour mission de réaliser, dans la zone non directement occupée de la Métropole, l’unité d’action de tous les éléments qui résistent à l’ennemi et à ses collaborateurs.',
        qui: 'Charles de Gaulle',
        contexte: 'Ordre de mission signé à Londres, le 5 novembre 1941.',
        sens:
          'Une phrase, et tout le travail des dix-huit mois suivants : faire obéir à un seul chef des mouvements qui n’obéissaient à personne.',
      },
      {
        texte:
          'Il serait fou et criminel de ne pas utiliser, en vue d’actions futures, ces troupes qui piaffent d’impatience.',
        contexte:
          'Rapport remis à Londres en octobre 1941 sur l’état des mouvements de résistance en France.',
        sens:
          'Il plaide pour armer, financer et coordonner des groupes encore dispersés — c’est le programme qu’il exécutera lui-même.',
      },
    ],
    reperes: [
      'Plus jeune préfet de France en 1937, à 38 ans, nommé en Eure-et-Loir.',
      '17 juin 1940 : il refuse de signer un texte accusant des tirailleurs sénégalais et se tranche la gorge.',
      'Révoqué par Vichy en novembre 1940, il gagne Londres en septembre 1941.',
      'Parachuté le 2 janvier 1942 : il devient le délégué de de Gaulle pour la zone sud.',
      '27 mai 1943 : il préside la première réunion du CNR, rue du Four, à Paris.',
      'Arrêté à Caluire le 21 juin 1943, torturé par Klaus Barbie, il meurt sans avoir parlé.',
    ],
    recit: [
      {
        titre: 'Le préfet qui dit non',
        texte:
          '**Jean Moulin** est un haut fonctionnaire de la République : fils d’un professeur radical de Béziers, entré dans les préfectures à vingt et un ans, il est nommé en 1937 **plus jeune préfet de France**, en Eure-et-Loir, à trente-huit ans. En juin 1940, l’armée allemande occupe **Chartres**. Le **17 juin**, des officiers lui présentent un texte accusant des **tirailleurs sénégalais** d’avoir massacré des civils, et exigent sa signature de préfet — elle vaudrait caution française à une falsification. Il refuse ; il est frappé, puis enfermé. Dans la nuit, craignant de céder sous les coups, il se tranche la gorge avec un morceau de verre. On le sauve, et il gardera la cicatrice toute sa vie. Il n’a pas signé. **Vichy** le révoque le 2 novembre 1940.',
      },
      {
        titre: 'Londres, puis le parachutage',
        texte:
          'Révoqué, Moulin parcourt la zone sud et prend contact avec les groupes clandestins qui s’y forment : **Combat** d’Henri Frenay, **Libération-sud** d’Emmanuel d’Astier, **Franc-Tireur**. Il passe par l’Espagne et le Portugal et arrive à **Londres** en septembre 1941. Il y remet à **de Gaulle** un rapport précis : la Résistance existe, elle est courageuse, elle est **divisée**, sans argent, sans armes et sans radio. De Gaulle lui confie alors une mission écrite : réaliser « l’unité d’action de tous les éléments qui résistent ». Dans la nuit du 1ᵉʳ au **2 janvier 1942**, il est parachuté en Provence avec une fausse identité, de l’argent et des instructions. Il a quarante-deux ans, et devant lui des chefs de mouvement qui ne veulent obéir ni à Londres ni les uns aux autres.',
      },
      {
        titre: 'Un seul chef, un seul conseil',
        texte:
          'Pendant dix-huit mois, Moulin — « **Rex** », puis « **Max** » — fait le travail qu’aucun autre ne pouvait faire : il apporte l’argent de Londres, les liaisons radio, la reconnaissance du général de Gaulle, et il exige l’unité en échange. Il obtient en janvier 1943 la fusion des trois grands mouvements de la zone sud dans les **Mouvements unis de la Résistance**, crée l’**Armée secrète** confiée au général Delestraint, un Bureau d’information et de presse, un comité général d’études qui prépare l’après-guerre. Puis il va plus loin : réunir dans un même conseil les mouvements, les **syndicats** et les **partis politiques** d’avant-guerre, communistes compris. Le **27 mai 1943**, au 48 rue du Four à Paris, seize hommes siègent deux heures : c’est la première séance du **Conseil national de la Résistance**, qu’il préside. La France occupée a désormais une représentation unique — et de Gaulle, le droit de parler au nom du pays devant les Alliés.',
      },
      {
        titre: 'Caluire',
        texte:
          'Trois semaines plus tard, tout s’effondre. Le général **Delestraint** est arrêté à Paris le 9 juin 1943. Moulin convoque une réunion pour le remplacer, le **21 juin**, chez le docteur Dugoujon, à **Caluire**, près de Lyon. La Gestapo y fait irruption et arrête huit hommes : trahison, imprudence ou infiltration, l’affaire se discute encore. Conduit à Lyon, Moulin est interrogé et **torturé par Klaus Barbie**, chef de la Gestapo locale. Il ne donne rien : ni son vrai rôle, ni un nom, ni une adresse. Transféré vers l’Allemagne, il meurt dans le train le **8 juillet 1943**, près de Metz. Il avait quarante-quatre ans. Barbie, retrouvé en Bolivie et jugé à Lyon en 1987, sera condamné à la perpétuité pour crimes contre l’humanité.',
      },
      {
        titre: 'Le Panthéon',
        texte:
          'Le **19 décembre 1964**, ses cendres sont transférées au **Panthéon**. **André Malraux**, ministre de la Culture, prononce devant de Gaulle et une France silencieuse le discours le plus connu de la Vᵉ République : « Entre ici, Jean Moulin, avec ton terrible cortège… » Son nom est depuis celui de centaines de collèges et de rues. Ce qu’il a fait tient pourtant en une phrase : il a donné à la Résistance une **autorité unique**, et à la France libérée un programme — celui du CNR, adopté le 15 mars 1944, d’où sortiront la Sécurité sociale et les nationalisations de 1945.',
      },
    ],
    chrono: [
      { date: '1899', fait: 'Naissance à Béziers, le 20 juin.' },
      { date: '1937', fait: 'Plus jeune préfet de France, nommé en Eure-et-Loir.' },
      { date: '17 juin 1940', fait: 'Il refuse de signer et se tranche la gorge, à Chartres.' },
      { date: '2 novembre 1940', fait: 'Vichy le révoque de ses fonctions de préfet.' },
      { date: 'septembre 1941', fait: 'Il rejoint le général de Gaulle à Londres.' },
      { date: '2 janvier 1942', fait: 'Parachuté en Provence comme délégué de la France libre.' },
      { date: '27 mai 1943', fait: 'Première réunion du CNR, rue du Four, à Paris.' },
      { date: '21 juin 1943', fait: 'Arrêté à Caluire par la Gestapo de Klaus Barbie.' },
      { date: '8 juillet 1943', fait: 'Mort dans le train qui le conduit en Allemagne.' },
      { date: '19 décembre 1964', fait: 'Ses cendres entrent au Panthéon.' },
    ],
    leSaisTu:
      'La photographie au chapeau et à l’écharpe est devenue le portrait officiel de la Résistance. On répète qu’il y cache la cicatrice de Chartres : c’est impossible. Le cliché a été pris à Montpellier en 1939, un an avant la nuit où il s’est tranché la gorge. Ce jour-là, il avait simplement froid.',
    aRetenir: [
      'Jean Moulin, préfet d’Eure-et-Loir, refuse en juin 1940 de signer un document allemand et tente de se suicider.',
      'Parachuté en janvier 1942, il est le délégué du général de Gaulle chargé d’unifier la Résistance.',
      'Il préside la première réunion du Conseil national de la Résistance, le 27 mai 1943 à Paris.',
      'Arrêté à Caluire le 21 juin 1943 et torturé par Klaus Barbie, il meurt le 8 juillet sans avoir parlé.',
      'Ses cendres entrent au Panthéon le 19 décembre 1964, sur un discours d’André Malraux.',
    ],
    mots: [
      {
        mot: 'CNR',
        sens: 'Conseil national de la Résistance : l’assemblée clandestine des mouvements, syndicats et partis, créée le 27 mai 1943.',
      },
      {
        mot: 'Délégué général',
        sens: 'Le représentant du général de Gaulle en France occupée, seul habilité à parler et à payer en son nom.',
      },
      {
        mot: 'Gestapo',
        sens: 'La police politique du régime nazi, chargée de traquer opposants, juifs et résistants.',
      },
    ],
    lies: [
      'charles-de-gaulle',
      'lucie-aubrac',
      'la-resistance',
      'regime-de-vichy',
      'appel-du-18-juin-1940',
    ],
    niveaux: ['3e'],
    programme: 'La Seconde Guerre mondiale : la France défaite et occupée',
    tags: [
      'Jean Moulin',
      'CNR',
      'Résistance',
      'Caluire',
      'Barbie',
      'Panthéon',
      'Malraux',
      'Chartres',
      'Max',
      'préfet',
    ],
  },
  {
    id: 'lucie-aubrac',
    volet: 'personnages',
    nom: 'Lucie Aubrac',
    surnom: 'la résistante qui allait chercher son mari',
    dates: '1912 – 2007',
    tri: 1943,
    periode: 'guerres',
    emoji: '🗝️',
    roles: ['Résistante', 'Professeure d’histoire', 'Cofondatrice de Libération-sud'],
    origine: 'Paris, d’une famille de vignerons bourguignons',
    accroche:
      'Professeure d’histoire et résistante, elle monte trois fois l’évasion de son mari des mains des Allemands — la dernière, enceinte de six mois.',
    citations: [
      {
        texte: 'Le verbe résister doit toujours se conjuguer au présent.',
        contexte:
          'Formule qu’elle répétait aux élèves, dans les collèges et les lycées, jusqu’à la fin de sa vie.',
        sens:
          'Elle refusait d’être un souvenir : pour elle, la Résistance n’était pas une leçon d’histoire mais une manière de se tenir aujourd’hui.',
      },
      {
        texte: 'Ils partiront dans l’ivresse.',
        qui: 'Message personnel de Radio Londres',
        contexte:
          'La phrase codée annonçant l’avion qui viendra chercher les Aubrac, en février 1944. Elle en fera le titre de son livre.',
      },
      {
        texte:
          'Nous n’étions pas des héros, nous étions des gens ordinaires qui ont fait, à un moment, un choix.',
        contexte: 'Ce qu’elle répondait aux classes qui la recevaient, pendant cinquante ans.',
        sens:
          'Sa leçon tient dans ce déplacement : la Résistance n’a pas été le fait d’une race d’hommes à part, mais d’une décision que chacun pouvait prendre.',
      },
    ],
    reperes: [
      'Agrégée d’histoire en 1938, elle enseigne au lycée de jeunes filles de Lyon.',
      'Fin 1940, elle fonde avec Raymond et Emmanuel d’Astier le mouvement Libération-sud.',
      'Mars 1943 : première arrestation de Raymond, qu’elle fait libérer en mai.',
      '21 octobre 1943 : elle fait attaquer le camion de la Gestapo et libérer quatorze prisonniers.',
      'Elle est alors enceinte de six mois ; leur fille naît à Londres en février 1944.',
      'Elle siège en 1944 à l’Assemblée consultative provisoire, avant le premier vote des Françaises.',
    ],
    recit: [
      {
        titre: 'Une agrégée d’histoire en 1939',
        texte:
          '**Lucie Bernard** naît en 1912 dans une famille modeste de vignerons bourguignons installés en région parisienne. Boursière, elle monte à Paris, passe l’**agrégation d’histoire** en 1938 — elles sont une poignée de femmes à l’obtenir cette année-là — et obtient un poste à Strasbourg, puis à **Lyon**. Militante antifasciste depuis les Jeunesses communistes, elle épouse en décembre 1939 **Raymond Samuel**, ingénieur des Ponts, juif, rencontré deux ans plus tôt. Fait prisonnier en juin 1940, Raymond s’évade avec l’aide de sa femme. Le couple choisit alors un nom de guerre qu’il gardera toute sa vie : **Aubrac**.',
      },
      {
        titre: 'Libération-sud',
        texte:
          'Fin **1940**, les Aubrac rejoignent **Emmanuel d’Astier de La Vigerie** pour fonder l’un des trois grands mouvements de la **zone sud** : **Libération**. Au début, tout tient à presque rien — un journal clandestin tiré à quelques milliers d’exemplaires, des tracts, de fausses cartes d’identité, des filières de passage. Lucie enseigne toujours au lycée le matin : son métier de professeure est sa meilleure couverture, et ses horaires lui laissent l’après-midi. Elle transporte des messages, tient des « boîtes aux lettres », recrute. En 1943, le mouvement fusionne avec **Combat** et **Franc-Tireur** dans les **Mouvements unis de la Résistance**, sous l’autorité de **Jean Moulin** ; Raymond devient l’un des chefs de l’**Armée secrète**.',
      },
      {
        titre: 'Trois fois, elle va le chercher',
        texte:
          'Le **15 mars 1943**, Raymond est arrêté à Lyon sous une fausse identité. Lucie obtient un rendez-vous avec le procureur en se présentant comme la fiancée d’un homme qui l’a « déshonorée » ; son mari est libéré le 14 mai. Le **21 juin 1943**, il est repris à **Caluire**, dans la rafle où tombe Jean Moulin, et passe aux mains de **Klaus Barbie**. Lucie revient à la charge : elle se présente à la Gestapo comme une jeune femme enceinte d’un prisonnier qu’elle doit épouser avant qu’il ne soit fusillé, et obtient un « mariage in extremis ». Le **21 octobre 1943**, à la sortie de l’entrevue, un **groupe franc** mitraille le camion allemand rue Boileau : Raymond et **treize autres prisonniers** s’échappent. Lucie est **enceinte de six mois**. Traqué, le couple se cache jusqu’en février 1944, où un avion **Lysander** les emmène en Angleterre ; leur fille Catherine naît quelques jours après l’atterrissage.',
      },
      {
        titre: 'Après : ne pas laisser l’histoire se taire',
        texte:
          'À Londres puis à **Alger**, Lucie Aubrac siège à l’**Assemblée consultative provisoire** — l’une des toutes premières femmes à siéger dans une assemblée française, avant même que les Françaises n’obtiennent le droit de vote. Après la guerre, elle reprend son métier et enseigne l’histoire au Maroc, en Italie, puis en France. Et pendant cinquante ans, elle passe ses semaines dans les collèges et les lycées à raconter, classe après classe, ce qu’ont été l’Occupation et le choix de résister. Son livre *Ils partiront dans l’ivresse* (1984), qui reprend le message codé de la BBC annonçant leur avion, est devenu un classique scolaire. Elle meurt en **2007**, à quatre-vingt-quatorze ans, après avoir répété partout la même phrase : « Le verbe résister doit toujours se conjuguer au présent. »',
      },
    ],
    chrono: [
      { date: '1912', fait: 'Naissance à Paris, le 29 juin.' },
      { date: '1938', fait: 'Reçue à l’agrégation d’histoire.' },
      { date: 'décembre 1939', fait: 'Mariage avec Raymond Samuel, futur Raymond Aubrac.' },
      { date: 'fin 1940', fait: 'Fondation du mouvement Libération-sud, à Lyon.' },
      { date: '15 mars 1943', fait: 'Première arrestation de Raymond ; libéré le 14 mai.' },
      { date: '21 juin 1943', fait: 'Raymond est pris à Caluire, avec Jean Moulin.' },
      { date: '21 octobre 1943', fait: 'Attaque du camion allemand rue Boileau : quatorze évadés.' },
      { date: 'février 1944', fait: 'Exfiltration vers Londres ; naissance de leur fille.' },
      { date: '1984', fait: 'Publication de « Ils partiront dans l’ivresse ».' },
      { date: '2007', fait: 'Mort à Issy-les-Moulineaux, le 14 mars.' },
    ],
    leSaisTu:
      'Le titre de son livre est un vrai message de Radio Londres. Chaque soir, la BBC diffusait des phrases absurdes — « Les sanglots longs des violons », « La girafe a un long cou » — que seuls leurs destinataires comprenaient. « Ils partiront dans l’ivresse » annonçait l’avion qui allait venir chercher les Aubrac.',
    aRetenir: [
      'Lucie Aubrac, agrégée d’histoire, fonde fin 1940 avec son mari Raymond le mouvement Libération-sud.',
      'Le 21 octobre 1943, elle organise l’attaque du camion allemand qui libère Raymond et treize autres prisonniers.',
      'Elle est alors enceinte de six mois ; le couple est exfiltré vers Londres en février 1944.',
      'Elle siège à l’Assemblée consultative provisoire, avant même que les Françaises ne votent.',
      'Jusqu’à sa mort en 2007, elle témoigne dans les écoles : « Le verbe résister doit toujours se conjuguer au présent. »',
    ],
    mots: [
      {
        mot: 'Groupe franc',
        sens: 'Petite équipe armée de la Résistance chargée des coups de main : sabotages, attaques, évasions.',
      },
      {
        mot: 'Message personnel',
        sens: 'Phrase codée diffusée par Radio Londres pour prévenir un réseau d’un parachutage, d’un atterrissage ou d’une action.',
      },
      {
        mot: 'Zone sud',
        sens: 'La partie de la France laissée à Vichy jusqu’en novembre 1942, au sud de la ligne de démarcation.',
      },
    ],
    lies: ['jean-moulin', 'charles-de-gaulle', 'la-resistance', 'regime-de-vichy'],
    niveaux: ['3e'],
    programme: 'La Seconde Guerre mondiale : la France défaite et occupée',
    tags: [
      'Lucie Aubrac',
      'Raymond Aubrac',
      'Libération-sud',
      'Lyon',
      'Barbie',
      'évasion',
      'Résistance',
      'agrégée',
      'femmes',
      'Lysander',
    ],
  },
  {
    id: 'missak-manouchian',
    volet: 'personnages',
    nom: 'Missak Manouchian',
    surnom: 'l’homme de l’Affiche rouge',
    dates: '1906 – 1944',
    tri: 1944,
    periode: 'guerres',
    emoji: '🪶',
    roles: ['Résistant', 'Poète', 'Ouvrier tourneur', 'Chef des FTP-MOI de Paris'],
    origine: 'Adiyaman, Empire ottoman',
    accroche:
      'Orphelin du génocide arménien devenu ouvrier et poète à Paris, il commandait le groupe de résistants étrangers que l’Affiche rouge voulait salir.',
    citations: [
      {
        texte:
          'Je meurs sans haine en moi pour le peuple allemand et pour qui que ce soit, chacun aura ce qu’il mérite comme châtiment et comme récompense.',
        contexte:
          'Dernière lettre à sa femme Mélinée, écrite au fort du Mont-Valérien le 21 février 1944, quelques heures avant son exécution.',
      },
      {
        texte: 'Des libérateurs ? La libération par l’armée du crime !',
        qui: 'La propagande allemande',
        contexte:
          'Slogan imprimé au bas de l’Affiche rouge, placardée dans toute la France en février 1944.',
        sens:
          'Dix visages, dix noms étrangers, dix crimes : l’occupant veut montrer que la Résistance n’est pas française. Des passants écriront « morts pour la France » sous les affiches.',
      },
      {
        texte:
          'Vous aviez vos portraits sur les murs de nos villes, noirs de barbe et de nuit, hirsutes, menaçants.',
        qui: 'Louis Aragon',
        contexte:
          'Premiers vers de « Strophes pour se souvenir », 1955, mis en musique par Léo Ferré en 1961.',
      },
      {
        texte:
          'Je souhaite le bonheur à tous ceux qui vont survivre et goûter la douceur de la liberté et de la paix de demain.',
        contexte: 'Même lettre à Mélinée, le 21 février 1944.',
      },
    ],
    reperes: [
      'Orphelin du génocide arménien de 1915 : son père tué, sa mère morte de faim.',
      'Arrivé à Marseille en 1925, il devient ouvrier tourneur aux usines Citroën de Paris.',
      'Poète et directeur de revues arméniennes, il traduit Baudelaire et Hugo en arménien.',
      'Il prend en février 1943 la tête des FTP-MOI de la région parisienne, résistants étrangers.',
      'Son groupe mène une trentaine d’actions, dont l’exécution du général Julius Ritter.',
      'Fusillé au Mont-Valérien le 21 février 1944 avec 21 camarades ; au Panthéon en 2024.',
    ],
    recit: [
      {
        titre: 'Survivre au génocide',
        texte:
          '**Missak Manouchian** naît en 1906 à Adiyaman, dans l’Empire ottoman. En **1915**, le **génocide arménien** emporte sa famille : son père est tué, sa mère meurt de faim peu après. Recueilli avec son frère dans un orphelinat français de **Syrie**, il y apprend la menuiserie, la poésie et la langue française. En **1925**, à dix-neuf ans, il débarque à **Marseille**, gagne Paris et trouve du travail comme **tourneur** aux usines **Citroën** du quai de Javel. Licencié pendant la crise des années 1930, il vit de petits emplois, suit en auditeur libre des cours à la Sorbonne, traduit **Baudelaire** et **Victor Hugo** en arménien, fonde des revues littéraires, et adhère en 1934 au **Parti communiste**. Il est exactement ce que l’occupant appellera plus tard un « métèque » : un étranger qui a choisi la France.',
      },
      {
        titre: 'Les FTP-MOI',
        texte:
          'La guerre le rattrape deux fois : arrêté en juin 1941 comme communiste, relâché, il entre dans la clandestinité. Il rejoint la **MOI** — la Main-d’œuvre immigrée, l’organisation des militants étrangers du Parti communiste — et ses groupes armés, les **FTP-MOI**. Ce sont des Arméniens, des Juifs polonais, hongrois et roumains, des Italiens, des Espagnols républicains : des gens que la France n’avait pas toujours bien accueillis, et qui se battent pour elle. En **février 1943**, Manouchian prend le commandement militaire des FTP-MOI de la région parisienne. Ses détachements — une cinquantaine d’hommes et de femmes, souvent très jeunes — mènent en quelques mois une trentaine d’attaques : déraillements, grenades contre des convois, et le **28 septembre 1943**, l’exécution en pleine rue du **général Julius Ritter**, responsable à Paris du **STO** qui envoyait les ouvriers français travailler en Allemagne.',
      },
      {
        titre: 'L’Affiche rouge',
        texte:
          'La police française des **Brigades spéciales** les file pendant des mois. Manouchian est arrêté le **16 novembre 1943**, livré à la Gestapo, torturé. Vingt-quatre membres du groupe passent devant un tribunal militaire allemand en février 1944. Les Allemands choisissent d’en faire une **arme de propagande** : ils placardent dans toute la France une affiche de papier **rouge sang** portant dix visages, dix noms étrangers, dix crimes, et ce titre — « Des libérateurs ? La libération par l’armée du crime ! ». L’effet obtenu est l’inverse de l’effet attendu : sous les affiches, des passants écrivent « **morts pour la France** » et déposent des fleurs. Le **21 février 1944**, Manouchian et vingt et un de ses camarades sont fusillés au **Mont-Valérien**. La seule femme du groupe, **Olga Bancic**, sera décapitée en Allemagne trois mois plus tard.',
      },
      {
        titre: 'La lettre, le poème, le Panthéon',
        texte:
          'Quelques heures avant de mourir, Manouchian écrit à sa femme **Mélinée** une lettre devenue l’un des textes les plus lus de la Résistance : il lui demande de se remarier, de faire éditer ses écrits, d’aller voir l’Arménie — et il dit mourir « **sans haine en moi pour le peuple allemand** ». En **1955**, **Louis Aragon** en tire un poème, *Strophes pour se souvenir*, que **Léo Ferré** met en musique en 1961 sous le titre *L’Affiche rouge* : la chanson fera connaître le groupe à des générations d’élèves. Le **21 février 2024**, quatre-vingts ans jour pour jour après l’exécution, **Missak et Mélinée Manouchian** entrent au **Panthéon** ; les noms de leurs vingt-deux compagnons sont gravés à l’entrée du caveau. Un étranger fusillé pour la France y rejoint Jean Moulin.',
      },
    ],
    chrono: [
      { date: '1906', fait: 'Naissance à Adiyaman, dans l’Empire ottoman.' },
      { date: '1915', fait: 'Le génocide arménien tue ses parents ; orphelinat en Syrie.' },
      { date: '1925', fait: 'Arrivée en France ; ouvrier tourneur chez Citroën.' },
      { date: '1934', fait: 'Adhésion au Parti communiste et aux comités arméniens.' },
      { date: 'février 1943', fait: 'Il prend la tête des FTP-MOI de la région parisienne.' },
      { date: '28 septembre 1943', fait: 'Son groupe exécute le général Ritter, chargé du STO.' },
      { date: '16 novembre 1943', fait: 'Arrêté par les Brigades spéciales de la police française.' },
      { date: 'février 1944', fait: 'L’Affiche rouge est placardée dans toute la France.' },
      { date: '21 février 1944', fait: 'Fusillé au Mont-Valérien avec 21 camarades.' },
      { date: '21 février 2024', fait: 'Entrée au Panthéon avec Mélinée Manouchian.' },
    ],
    leSaisTu:
      'Sous les Affiches rouges collées dans Paris, des inconnus venaient écrire à la craie « morts pour la France » et déposer des fleurs. La propagande allemande voulait exhiber une « armée du crime » composée d’étrangers : elle a fabriqué le monument de la Résistance étrangère.',
    aRetenir: [
      'Missak Manouchian, rescapé du génocide arménien de 1915, arrive en France en 1925 et y devient ouvrier et poète.',
      'Il commande à partir de février 1943 les FTP-MOI de la région parisienne, groupe de résistants étrangers.',
      'Arrêté en novembre 1943, il est fusillé au Mont-Valérien le 21 février 1944 avec 21 camarades.',
      'L’Affiche rouge, placardée par l’occupant, voulait les présenter comme une « armée du crime » étrangère.',
      'Aragon leur consacre en 1955 « Strophes pour se souvenir » ; le Panthéon les accueille en février 2024.',
    ],
    mots: [
      {
        mot: 'FTP-MOI',
        sens: 'Francs-tireurs et partisans – Main-d’œuvre immigrée : les groupes armés des militants étrangers du Parti communiste.',
      },
      {
        mot: 'STO',
        sens: 'Service du travail obligatoire : à partir de 1943, l’envoi forcé de jeunes Français dans les usines allemandes.',
      },
      {
        mot: 'Génocide',
        sens: 'L’extermination organisée d’un peuple ; celui des Arméniens fait environ 1,2 million de morts à partir de 1915.',
      },
    ],
    lies: ['jean-moulin', 'charles-de-gaulle', 'la-resistance', 'regime-de-vichy'],
    niveaux: ['3e'],
    programme: 'La Seconde Guerre mondiale : la France défaite et occupée',
    tags: [
      'Manouchian',
      'Affiche rouge',
      'FTP-MOI',
      'Arménie',
      'Mont-Valérien',
      'Aragon',
      'Résistance',
      'étrangers',
      'Mélinée',
      'Panthéon',
    ],
  },
  {
    id: 'charles-de-gaulle',
    volet: 'personnages',
    nom: 'Charles de Gaulle',
    surnom: 'le général',
    dates: '1890 – 1970',
    tri: 1944,
    periode: 'guerres',
    emoji: '📻',
    roles: [
      'Général',
      'Chef de la France libre',
      'Chef du Gouvernement provisoire',
      'Président de la République',
    ],
    origine: 'Lille, Nord',
    accroche:
      'Le 18 juin 1940, un général presque inconnu parle à la radio de Londres et refuse la défaite ; quatre ans plus tard, il gouverne la France libérée.',
    citations: [
      {
        texte:
          'Quoi qu’il arrive, la flamme de la résistance française ne doit pas s’éteindre et ne s’éteindra pas.',
        contexte: 'Fin de l’appel lancé sur les ondes de la BBC, à Londres, le 18 juin 1940.',
        sens:
          'Quelques lignes prononcées devant presque personne : très peu de Français l’entendent ce soir-là, mais le texte est imprimé et affiché, et la date devient celle du refus.',
      },
      {
        texte: 'Paris ! Paris outragé ! Paris brisé ! Paris martyrisé ! mais Paris libéré !',
        contexte: 'Discours de l’Hôtel de Ville de Paris, le 25 août 1944, jour de la reddition allemande.',
        sens:
          'La suite dit toute sa politique : Paris libéré « par lui-même, par son peuple, avec le concours des armées de la France ». La France n’a pas été délivrée, elle s’est délivrée.',
      },
      {
        texte: 'La France a perdu une bataille ! Mais la France n’a pas perdu la guerre !',
        contexte: 'Première phrase de l’affiche « À tous les Français », placardée à Londres en août 1940.',
        sens:
          'Beaucoup la croient prononcée le 18 juin : elle vient de l’affiche, imprimée deux mois plus tard.',
      },
      {
        texte: 'Toute ma vie, je me suis fait une certaine idée de la France.',
        contexte: 'Première phrase des « Mémoires de guerre », publiés à partir de 1954.',
      },
    ],
    reperes: [
      'Blessé trois fois et fait prisonnier devant Verdun en 1916, il tente cinq évasions.',
      'Dans « Vers l’armée de métier » (1934), il réclame des divisions blindées ; l’état-major l’ignore.',
      'Sous-secrétaire d’État à la Guerre du 6 au 16 juin 1940, il refuse l’armistice et gagne Londres.',
      '18 juin 1940 : appel à la BBC ; Vichy le condamne à mort par contumace le 2 août.',
      'Il rassemble l’Empire, Alger et la Résistance intérieure derrière la France libre.',
      'Chef du Gouvernement provisoire de 1944 à janvier 1946 : vote des femmes, Sécurité sociale.',
    ],
    recit: [
      {
        titre: 'Un officier qui écrit',
        texte:
          'Né à **Lille** en 1890 dans une famille catholique et patriote, **Charles de Gaulle** entre à **Saint-Cyr** en 1909 et choisit l’infanterie, sous les ordres du colonel **Pétain**. La **Première Guerre mondiale** le marque au fer : blessé trois fois, laissé pour mort devant **Douaumont** le 2 mars **1916**, il passe trente-deux mois en captivité en Allemagne et tente cinq évasions. Entre les deux guerres, il écrit — *Le Fil de l’épée*, *Vers l’armée de métier* (1934), *La France et son armée* — et il dérange. Il soutient que la prochaine guerre sera une guerre de **mouvement**, gagnée par des divisions de **chars** groupées et par l’aviation, et non par une ligne fortifiée. L’état-major, qui mise sur la **ligne Maginot**, le tient pour un théoricien remuant. En Allemagne, **Guderian** lit les mêmes idées et les applique.',
      },
      {
        titre: 'Juin 1940 : le refus',
        texte:
          'Le **10 mai 1940**, l’offensive allemande enfonce le front en six semaines. De Gaulle, colonel à titre provisoire, contre-attaque à **Montcornet** le 17 mai puis à **Abbeville** le 28, avec sa 4ᵉ division cuirassée : deux succès locaux dans une déroute générale. Nommé **général de brigade à titre temporaire**, il est appelé le **6 juin** au gouvernement de **Paul Reynaud** comme **sous-secrétaire d’État à la Guerre**. Pendant dix jours, il fait la navette avec **Londres** pour tenter d’obtenir des avions et de préparer un repli en **Afrique du Nord**. Le **16 juin**, Reynaud démissionne ; le maréchal **Pétain** le remplace pour demander l’**armistice**. De Gaulle, à Bordeaux, décide en quelques heures : le **17 juin** au matin, il embarque dans l’avion du général Spears pour Londres, avec cent mille francs de fonds secrets. Il a quarante-neuf ans, deux étoiles provisoires et aucun mandat.',
      },
      {
        titre: 'L’appel du 18 juin',
        texte:
          'Le **18 juin 1940** à 18 heures, la **BBC** lui ouvre un micro. Le texte tient en quelques minutes : la France a perdu une bataille à cause de la supériorité mécanique de l’ennemi, mais la guerre est **mondiale**, l’Empire est intact, l’industrie américaine décidera, et « la flamme de la résistance française ne doit pas s’éteindre ». Presque personne ne l’entend, et il n’en existe aucun enregistrement — seulement le texte, et une affiche imprimée en août. Vichy le condamne à mort par contumace le **2 août 1940**. Mais autour de lui se forme la **France libre** : une poignée d’hommes au début, la **croix de Lorraine** pour emblème, puis des territoires — le **Tchad** de **Félix Éboué** rallié dès août 1940, le Cameroun, le Congo, l’Océanie. Chaque ralliement lui donne ce qui lui manque le plus : un **territoire**, donc la légitimité d’un État, et non d’un comité d’exilés.',
      },
      {
        titre: 'D’Alger à la reconnaissance',
        texte:
          'La route est rude. **Churchill** le soutient mais s’agace ; **Roosevelt** le tient pour un apprenti dictateur et préfère traiter avec Vichy, puis avec l’amiral **Darlan** et le général **Giraud**. De Gaulle répond par les faits. En 1942, la France libre s’illustre à **Bir Hakeim**, où la brigade de **Koenig** tient seize jours contre Rommel. En 1943, il s’installe à **Alger**, absorbe Giraud et préside le **Comité français de libération nationale**, qui devient en juin 1944 le **Gouvernement provisoire de la République française**. Surtout, il a **Jean Moulin** : l’unification de la Résistance intérieure et la création du **CNR**, le 27 mai 1943, font de lui le chef reconnu d’une France qui se bat chez elle. Quand les Alliés débarquent le **6 juin 1944**, ils comptaient administrer le pays avec leur propre monnaie ; ils trouvent partout des préfets nommés par lui.',
      },
      {
        titre: 'Paris, août 1944',
        texte:
          'Le **25 août 1944**, la **2ᵉ division blindée** de **Leclerc** entre dans un Paris insurgé depuis six jours, et le général von Choltitz capitule. Le soir même, à l’Hôtel de Ville, de Gaulle prononce l’improvisation la plus célèbre de son siècle : « **Paris ! Paris outragé ! Paris brisé ! Paris martyrisé ! mais Paris libéré !** — libéré par lui-même, libéré par son peuple avec le concours des armées de la France. » Le lendemain, il descend les **Champs-Élysées** à pied, au milieu de deux millions de personnes. On lui demande de proclamer la République au balcon : il refuse, parce qu’elle « n’a jamais cessé d’être » et que Vichy n’a jamais été, à ses yeux, qu’une parenthèse nulle et non avenue. Toute sa stratégie tient dans ce refus : la France n’a pas à se refonder, elle n’a jamais capitulé.',
      },
      {
        titre: 'Ce que le Gouvernement provisoire a fait',
        texte:
          'De septembre 1944 à janvier 1946, de Gaulle gouverne une France ruinée. Il désarme les milices, rétablit l’État, fait juger les collaborateurs par une justice légale plutôt que par des règlements de comptes. Et il applique le programme du **CNR** : **droit de vote des femmes** (ordonnance du 21 avril 1944, premier vote en avril 1945), **Sécurité sociale** (ordonnances des 4 et 19 octobre 1945), comités d’entreprise, nationalisation des houillères, d’**Électricité de France**, des grandes banques et de **Renault**, création de l’ENA et du Commissariat à l’énergie atomique. Il obtient pour la France une zone d’occupation en Allemagne et un siège permanent au **Conseil de sécurité** de l’ONU. Puis, en désaccord avec le retour des partis et un régime d’assemblée qu’il juge impuissant, il **démissionne le 20 janvier 1946**. Il reviendra au pouvoir en 1958 et fondera la **Vᵉ République** — c’est une autre histoire, racontée par la fiche « Naissance de la Vᵉ République ».',
      },
    ],
    chrono: [
      { date: '1890', fait: 'Naissance à Lille, le 22 novembre.' },
      { date: '1916', fait: 'Blessé et fait prisonnier devant Verdun ; cinq évasions tentées.' },
      { date: '1934', fait: '« Vers l’armée de métier » : il réclame des divisions blindées.' },
      { date: '17 mai 1940', fait: 'Contre-attaque de Montcornet avec la 4ᵉ division cuirassée.' },
      { date: '6 juin 1940', fait: 'Sous-secrétaire d’État à la Guerre du gouvernement Reynaud.' },
      { date: '18 juin 1940', fait: 'Appel de Londres, sur les ondes de la BBC.' },
      { date: '2 août 1940', fait: 'Condamné à mort par contumace par un tribunal de Vichy.' },
      { date: 'juin 1943', fait: 'Il préside le Comité français de libération nationale, à Alger.' },
      { date: '21 avril 1944', fait: 'Ordonnance d’Alger : les femmes obtiennent le droit de vote.' },
      { date: '25 août 1944', fait: 'Discours de l’Hôtel de Ville : « mais Paris libéré ! ».' },
      { date: 'octobre 1945', fait: 'Ordonnances créant la Sécurité sociale.' },
      { date: '20 janvier 1946', fait: 'Il démissionne du Gouvernement provisoire.' },
    ],
    leSaisTu:
      'L’appel du 18 juin n’a jamais été enregistré. La BBC n’a gardé aucun disque de ce soir-là : ce qu’on entend dans les films et les documentaires est un autre discours, celui du 22 juin, ou une reconstitution. Du 18 juin, il ne reste que le texte, une affiche imprimée en août — et la date.',
    aRetenir: [
      'Charles de Gaulle défend dès 1934 la guerre de mouvement et les divisions blindées, contre la doctrine de la ligne Maginot.',
      'Sous-secrétaire d’État à la Guerre en juin 1940, il refuse l’armistice et lance depuis Londres l’appel du 18 juin.',
      'Chef de la France libre, il s’installe à Alger en 1943 et préside le Gouvernement provisoire à partir de juin 1944.',
      'Le 25 août 1944, il prononce à l’Hôtel de Ville le discours de la libération de Paris.',
      'Son gouvernement accorde le droit de vote aux femmes (1944) et crée la Sécurité sociale (1945) ; il démissionne en janvier 1946.',
    ],
    mots: [
      {
        mot: 'France libre',
        sens: 'L’organisation fondée à Londres par de Gaulle en juin 1940 pour continuer la guerre au nom de la France.',
      },
      {
        mot: 'Gouvernement provisoire',
        sens: 'Le gouvernement qui administre la France de 1944 à 1946, en attendant une nouvelle Constitution.',
      },
      {
        mot: 'Par contumace',
        sens: 'Jugé et condamné en son absence, sans avoir pu se défendre devant le tribunal.',
      },
      {
        mot: 'Croix de Lorraine',
        sens: 'Croix à deux barres, emblème de la France libre, choisie en 1940 face à la croix gammée.',
      },
    ],
    lies: [
      'jean-moulin',
      'marechal-leclerc',
      'appel-du-18-juin-1940',
      'liberation-de-paris',
      'naissance-de-la-ve-republique',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'La Seconde Guerre mondiale : la France défaite et occupée',
    tags: [
      'de Gaulle',
      'appel du 18 juin',
      'France libre',
      'Londres',
      'BBC',
      'croix de Lorraine',
      'Alger',
      'Libération de Paris',
      'GPRF',
      'Résistance',
      'blindés',
      'Vᵉ République',
    ],
  },
  {
    id: 'philippe-petain',
    volet: 'personnages',
    nom: 'Philippe Pétain',
    surnom: 'le vainqueur de Verdun devenu chef de l’État français',
    dates: '1856 – 1951',
    tri: 1945,
    periode: 'guerres',
    emoji: '⚖️',
    roles: ['Maréchal de France', 'Chef de l’État français', 'Ambassadeur à Madrid'],
    origine: 'Cauchy-à-la-Tour, Pas-de-Calais',
    accroche:
      'Vainqueur de Verdun en 1916, chef de l’État français en 1940 : il signe l’armistice, la Révolution nationale et la collaboration, et est jugé en 1945.',
    citations: [
      {
        texte: 'Courage… on les aura !',
        contexte: 'Dernière phrase de son ordre du jour aux armées de Verdun, le 10 avril 1916.',
        sens:
          'La phrase la plus reprise de 1916 : elle clôt un texte qui saluait la résistance des soldats après sept semaines de bombardement.',
      },
      {
        texte: 'Je fais à la France le don de ma personne pour atténuer son malheur.',
        contexte: 'Allocution radiodiffusée du 17 juin 1940, annonçant qu’il demande l’armistice.',
        sens:
          'Il se présente en sauveur qui se sacrifie. Le même texte dit « il faut cesser le combat », avant même que l’Allemagne n’ait répondu.',
      },
      {
        texte:
          'C’est dans l’honneur et pour maintenir l’unité française… que j’entre aujourd’hui dans la voie de la collaboration.',
        contexte: 'Message radiodiffusé du 30 octobre 1940, six jours après la rencontre de Montoire.',
        sens:
          'Le mot « collaboration » est prononcé par le chef de l’État lui-même, et présenté comme un choix, non comme une contrainte subie.',
      },
      {
        texte:
          'La Haute Cour de justice condamne Philippe Pétain à la peine de mort, à l’indignité nationale et à la confiscation de ses biens.',
        qui: 'La Haute Cour de justice',
        contexte: 'Verdict rendu à Paris le 15 août 1945, au terme de trois semaines de procès.',
        sens:
          'La Cour demande que la peine ne soit pas exécutée en raison de son âge ; de Gaulle la commue le jour même en détention à perpétuité.',
      },
    ],
    reperes: [
      'Colonel presque inconnu à 58 ans, il commande à Verdun à partir du 25 février 1916.',
      'Commandant en chef en mai 1917, il rétablit la discipline après les mutineries.',
      'Maréchal de France en 1918 ; ambassadeur à Madrid auprès de Franco en 1939.',
      '16 juin 1940 : président du Conseil, il demande l’armistice, signé le 22 juin.',
      '10 juillet 1940 : l’Assemblée nationale lui remet les pleins pouvoirs par 569 voix contre 80.',
      '15 août 1945 : condamné à mort ; la peine est commuée en détention à perpétuité.',
    ],
    recit: [
      {
        titre: 'Verdun, 1916',
        texte:
          '**Philippe Pétain** a cinquante-huit ans en 1914 et une carrière médiocre : colonel, il devait prendre sa retraite. La guerre le fait monter en grade, et lui vaut une réputation rare — il ménage la vie de ses hommes et croit à la puissance de l’**artillerie** plutôt qu’à l’assaut à la baïonnette. Le **25 février 1916**, on lui confie **Verdun**, où l’armée allemande attaque depuis quatre jours. Il organise la **Voie sacrée**, la route par laquelle des milliers de camions montent chaque jour les hommes et les obus, et instaure le **tour de noria** : les divisions se relaient, quelques jours chacune. Soixante-dix divisions françaises passeront ainsi par Verdun, ce qui fera de la bataille l’expérience commune de presque toute l’armée. Son ordre du jour du **10 avril 1916** se termine par la phrase que le pays répétera : « Courage… on les aura ! » Il devient, pour deux générations, « le vainqueur de Verdun ».',
      },
      {
        titre: 'De 1917 à 1939',
        texte:
          'Après l’échec du **Chemin des Dames** et les **mutineries** de 1917, Pétain est nommé commandant en chef. Il rétablit l’ordre par un double mouvement : des condamnations — une cinquantaine d’exécutions — et des mesures concrètes, permissions régulières, meilleur ordinaire, arrêt des offensives inutiles. Il attend les chars et les Américains. Maréchal de France en **novembre 1918**, il devient la première autorité militaire du pays : vainqueur de la guerre du **Rif** au Maroc en 1925, membre de l’Académie française, inspecteur général de l’armée, ministre de la Guerre en 1934. Sa doctrine est celle du **front continu** et de la fortification : c’est lui qui a le plus soutenu la **ligne Maginot**, et qui juge les Ardennes impénétrables aux blindés. En mars **1939**, la République l’envoie à Madrid comme ambassadeur auprès de **Franco**.',
      },
      {
        titre: 'Juin 1940 : l’armistice et les pleins pouvoirs',
        texte:
          'Rappelé le 18 mai 1940 comme vice-président du Conseil, Pétain juge la guerre perdue et s’oppose à tout repli en **Afrique du Nord**. Le **16 juin**, **Paul Reynaud** démissionne ; le président Lebrun appelle Pétain, qui demande l’armistice le soir même. Le **17 juin**, il l’annonce à la radio : « Il faut cesser le combat », avant même que l’Allemagne n’ait répondu — des unités déposent les armes, et le nombre de prisonniers grossit. L’**armistice** est signé le **22 juin** à Rethondes, dans le wagon de 1918 : la France est coupée en deux, 1,8 million de soldats restent prisonniers, le pays paie des frais d’occupation écrasants. Le **10 juillet 1940**, à **Vichy**, l’Assemblée nationale vote par **569 voix contre 80** la remise des pleins pouvoirs constituants au maréchal. Le lendemain, il se proclame **chef de l’État français** : la République n’est plus nommée, le Parlement est ajourné, la devise devient « Travail, Famille, Patrie ».',
      },
      {
        titre: 'La Révolution nationale et la collaboration',
        texte:
          'Le régime de **Vichy** n’est pas seulement un gouvernement subi : c’est un projet politique, la **Révolution nationale**, qui veut refaire le pays contre la République, les partis, les syndicats et la franc-maçonnerie. Dès le **3 octobre 1940**, sans aucune demande allemande, Vichy publie de sa **propre initiative** le premier **statut des juifs** : il exclut les juifs français de la fonction publique, de l’enseignement, de la presse, de la justice et de l’armée ; un second statut, en juin 1941, aggrave le texte et organise le recensement. Le **24 octobre 1940**, Pétain rencontre **Hitler** à **Montoire** : la **poignée de main** est photographiée et diffusée partout. Six jours plus tard, il annonce à la radio qu’il entre « dans la voie de la **collaboration** ». Suivront la police française prêtée aux rafles — la **rafle du Vél’ d’Hiv** des 16 et 17 juillet 1942, plus de 13 000 personnes arrêtées par des policiers français —, le **STO** en 1943, et la **Milice** de Joseph Darnand, créée en janvier 1943, qui traque résistants et juifs aux côtés de la Gestapo. Sur environ **76 000 juifs déportés** de France, moins de 3 % sont revenus.',
      },
      {
        titre: 'Le procès de 1945',
        texte:
          'Emmené par les Allemands à **Sigmaringen** en août 1944, Pétain rentre volontairement en France en avril 1945 pour être jugé. Son procès s’ouvre le **23 juillet 1945** devant la **Haute Cour de justice**. Il a quatre-vingt-neuf ans, lit une déclaration le premier jour et se tait ensuite. La défense plaide le « bouclier » : il aurait protégé les Français en restant. L’accusation oppose les actes signés — l’armistice, les pleins pouvoirs, les statuts des juifs, Montoire, la Milice. Le **15 août 1945**, il est condamné à **mort**, à l’indignité nationale et à la confiscation de ses biens, la Cour demandant que la peine ne soit pas exécutée en raison de son âge. **De Gaulle** la commue en **détention à perpétuité**. Enfermé au fort de la Pierre-Levée, sur l’**île d’Yeu**, il y meurt le **23 juillet 1951**, à quatre-vingt-quinze ans. Sa dignité de maréchal ne lui a jamais été rendue.',
      },
    ],
    chrono: [
      { date: '1856', fait: 'Naissance à Cauchy-à-la-Tour, dans le Pas-de-Calais.' },
      { date: '25 février 1916', fait: 'Il prend le commandement du secteur de Verdun.' },
      { date: 'mai 1917', fait: 'Commandant en chef ; il met fin aux mutineries.' },
      { date: '1918', fait: 'Élevé à la dignité de maréchal de France.' },
      { date: '16 juin 1940', fait: 'Président du Conseil, il demande l’armistice.' },
      { date: '22 juin 1940', fait: 'Signature de l’armistice à Rethondes.' },
      { date: '10 juillet 1940', fait: 'Les pleins pouvoirs lui sont votés à Vichy.' },
      { date: '3 octobre 1940', fait: 'Premier statut des juifs, à l’initiative de Vichy.' },
      { date: '24 octobre 1940', fait: 'Poignée de main avec Hitler, à Montoire.' },
      { date: '23 juillet 1945', fait: 'Ouverture de son procès devant la Haute Cour.' },
      { date: '15 août 1945', fait: 'Condamné à mort ; peine commuée par de Gaulle.' },
      { date: '23 juillet 1951', fait: 'Mort en détention à l’île d’Yeu.' },
    ],
    leSaisTu:
      'Le 10 juillet 1940, quatre-vingts parlementaires refusent de voter les pleins pouvoirs au maréchal. On les appelle « les quatre-vingts ». Parmi eux, Vincent Auriol et Jules Moch, futurs dirigeants de la IVᵉ République : ce vote restera, après la guerre, une ligne de partage de la vie politique française.',
    aRetenir: [
      'Philippe Pétain commande à Verdun à partir du 25 février 1916 et devient maréchal de France en 1918.',
      'Le 16 juin 1940, il demande l’armistice, signé le 22 juin à Rethondes dans le wagon de 1918.',
      'Le 10 juillet 1940, l’Assemblée nationale réunie à Vichy lui remet les pleins pouvoirs : la IIIᵉ République prend fin.',
      'Vichy prend de sa propre initiative le statut des juifs du 3 octobre 1940 et engage la collaboration à Montoire, le 24 octobre.',
      'Jugé en juillet 1945, il est condamné à mort le 15 août ; de Gaulle commue la peine, il meurt à l’île d’Yeu en 1951.',
    ],
    mots: [
      {
        mot: 'Révolution nationale',
        sens: 'Le projet politique de Vichy : « Travail, Famille, Patrie » à la place de « Liberté, Égalité, Fraternité ».',
      },
      {
        mot: 'Collaboration',
        sens: 'La coopération volontaire d’un État avec l’occupant ; Pétain l’annonce à la radio le 30 octobre 1940.',
      },
      {
        mot: 'Statut des juifs',
        sens: 'Lois de Vichy (octobre 1940, juin 1941) excluant les juifs de nombreux métiers et les recensant.',
      },
      {
        mot: 'Milice',
        sens: 'Force armée créée par Vichy en janvier 1943 pour traquer résistants et juifs aux côtés de la police allemande.',
      },
    ],
    lies: [
      'charles-de-gaulle',
      'ferdinand-foch',
      'regime-de-vichy',
      'bataille-de-verdun',
      'rafle-du-vel-d-hiv',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'La Seconde Guerre mondiale : la France défaite et occupée',
    tags: [
      'Pétain',
      'Verdun',
      'Vichy',
      'armistice',
      'Montoire',
      'Révolution nationale',
      'collaboration',
      'statut des juifs',
      'Milice',
      'Haute Cour',
      'île d’Yeu',
      '1940',
    ],
  },
  {
    id: 'marechal-leclerc',
    volet: 'personnages',
    nom: 'Philippe Leclerc de Hauteclocque',
    surnom: 'le libérateur de Strasbourg',
    dates: '1902 – 1947',
    tri: 1947,
    periode: 'guerres',
    emoji: '🪖',
    roles: ['Général', 'Chef de la 2ᵉ division blindée', 'Maréchal de France à titre posthume'],
    origine: 'Belloy-Saint-Léonard, Somme',
    accroche:
      'De l’oasis de Koufra à la cathédrale de Strasbourg, il a tenu le serment le plus célèbre de l’histoire de France — et libéré Paris en chemin.',
    citations: [
      {
        texte:
          'Jurez de ne déposer les armes que lorsque nos couleurs, nos belles couleurs, flotteront sur la cathédrale de Strasbourg.',
        contexte: 'Serment prêté à ses hommes après la prise de l’oasis de Koufra, en Libye, le 2 mars 1941.',
        sens:
          'Strasbourg est alors à quatre mille kilomètres, annexée par le Reich, et il commande quelques centaines d’hommes. Le serment sera tenu le 23 novembre 1944.',
      },
      {
        texte: 'Dronne, foncez sur Paris, entrez dans Paris par où vous voudrez.',
        contexte: 'Ordre lancé au capitaine Dronne à Antony, le 24 août 1944 au soir.',
        sens:
          'Sa colonne, formée de républicains espagnols, atteint l’Hôtel de Ville à 21 h 22 : les premiers blindés de la Libération portent les noms de Guadalajara, Teruel et Guernica.',
      },
      {
        texte: 'Le serment de Koufra est tenu.',
        contexte: 'Message adressé au général de Gaulle le 23 novembre 1944, jour de l’entrée dans Strasbourg.',
      },
    ],
    reperes: [
      'De son vrai nom Philippe de Hauteclocque ; « Leclerc » est le nom de guerre qui protège sa famille.',
      'Évadé deux fois en 1940, il rejoint de Gaulle à Londres dès le 25 juillet 1940.',
      'Mars 1941 : il prend l’oasis italienne de Koufra et fait prêter serment à ses hommes.',
      'La colonne Leclerc traverse 2 500 km de Sahara et rejoint les Britanniques en Tunisie.',
      '24 et 25 août 1944 : sa 2ᵉ division blindée libère Paris et reçoit la reddition allemande.',
      '23 novembre 1944 : Strasbourg est libérée ; le serment de Koufra est tenu.',
    ],
    recit: [
      {
        titre: 'Un capitaine qui s’évade',
        texte:
          '**Philippe de Hauteclocque** naît en 1902 dans une famille de la noblesse picarde. Saint-Cyr, le Maroc, l’École de guerre : il est capitaine en 1940, blessé et fait prisonnier deux fois pendant la campagne de France — et il s’évade deux fois. Quand l’armistice est signé, il décide de rejoindre Londres. Il passe par l’Espagne et le Portugal avec un faux passeport, et se présente à **de Gaulle** le **25 juillet 1940**. Pour protéger sa femme et ses six enfants restés en France, il prend un **nom de guerre** : **Leclerc**. Il ne le quittera plus. De Gaulle, qui manque de tout et surtout d’officiers, l’envoie aussitôt en **Afrique équatoriale** rallier les colonies à la France libre.',
      },
      {
        titre: 'Koufra, mars 1941',
        texte:
          'En quelques semaines, Leclerc rallie le **Cameroun** et le **Gabon** à la France libre. Puis il regarde vers le nord. Depuis le **Tchad**, avec quelques centaines d’hommes — tirailleurs africains, méharistes, une poignée d’officiers, des camions rafistolés et deux canons —, il attaque l’oasis italienne de **Koufra**, en plein Sahara libyen, à mille kilomètres de sa base. Le 1ᵉʳ **mars 1941**, la garnison capitule : c’est la première victoire remportée par une force française depuis la défaite. Le lendemain, devant ses hommes rassemblés, il prête le serment que toute la division reprendra — ne pas déposer les armes avant que le drapeau français ne flotte sur la **cathédrale de Strasbourg**. Strasbourg est à quatre mille kilomètres, en territoire annexé par le Reich. Personne n’imagine que la phrase sera tenue.',
      },
      {
        titre: 'De Paris à Strasbourg',
        texte:
          'En 1943, la **colonne Leclerc** traverse 2 500 kilomètres de désert, prend le **Fezzan** et rejoint la 8ᵉ armée britannique en Tunisie. Ses unités deviennent la **2ᵉ division blindée** — la **2ᵉ DB** —, équipée par les Américains, entraînée au Maroc puis en Angleterre, débarquée en **Normandie** le 1ᵉʳ août 1944. C’est la seule grande unité française du front de l’Ouest, et de Gaulle a obtenu d’Eisenhower qu’elle entre la première dans **Paris**. Le **24 août** au soir, Leclerc envoie en avant la « **Nueve** », une compagnie de républicains espagnols commandée par le capitaine **Dronne** : ses half-tracks atteignent l’Hôtel de Ville à 21 h 22. Le **25 août**, le gros de la division entre dans la ville et le général **von Choltitz** signe la reddition à la gare **Montparnasse**. Trois mois plus tard, la 2ᵉ DB perce à travers les Vosges et entre dans **Strasbourg** le **23 novembre 1944** : le drapeau monte sur la flèche de la cathédrale.',
      },
      {
        titre: 'Berchtesgaden, l’Indochine, la fin',
        texte:
          'La division ne s’arrête pas : elle réduit la poche de **Royan**, franchit le Rhin et pousse jusqu’en **Bavière**. Le **4 mai 1945**, ses éléments entrent à **Berchtesgaden**, dans le « nid d’aigle » de Hitler — l’image fait le tour du monde. Le **2 septembre 1945**, dans la baie de Tokyo, Leclerc signe pour la France la **capitulation japonaise**. Envoyé en **Indochine**, il reprend Saigon, puis écrit au gouvernement que la France ne réglera pas par les armes la question du nationalisme vietnamien et qu’il faut négocier : on ne l’écoute pas. Rappelé, nommé inspecteur des forces en Afrique du Nord, il meurt le **28 novembre 1947** dans l’accident de son avion près de **Colomb-Béchar**, en Algérie. Il avait quarante-cinq ans. La France le fait **maréchal à titre posthume** en 1952 ; il repose aux **Invalides**.',
      },
    ],
    chrono: [
      { date: '1902', fait: 'Naissance à Belloy-Saint-Léonard, dans la Somme.' },
      { date: '25 juillet 1940', fait: 'Il rejoint de Gaulle à Londres et prend le nom de Leclerc.' },
      { date: 'mars 1941', fait: 'Prise de Koufra, puis serment de Strasbourg.' },
      { date: '1943', fait: 'La colonne Leclerc traverse le Sahara et prend le Fezzan.' },
      { date: 'août 1944', fait: 'La 2ᵉ division blindée débarque en Normandie.' },
      { date: '25 août 1944', fait: 'Libération de Paris ; reddition de von Choltitz.' },
      { date: '23 novembre 1944', fait: 'Entrée dans Strasbourg : le serment est tenu.' },
      { date: '4 mai 1945', fait: 'La 2ᵉ DB atteint Berchtesgaden, en Bavière.' },
      { date: '2 septembre 1945', fait: 'Il signe pour la France la capitulation japonaise.' },
      { date: '28 novembre 1947', fait: 'Mort dans un accident d’avion près de Colomb-Béchar.' },
      { date: '1952', fait: 'Élevé maréchal de France, à titre posthume.' },
    ],
    leSaisTu:
      'Les premiers blindés entrés dans Paris, le 24 août 1944 au soir, portaient des noms espagnols : Guadalajara, Teruel, Guernica, Don Quichotte. La « Nueve » était composée en majorité de républicains espagnols réfugiés en France après 1939. Ils libéraient Paris en espérant libérer Madrid ensuite.',
    aRetenir: [
      'Philippe Leclerc rejoint la France libre en juillet 1940 et prend un nom de guerre pour protéger sa famille.',
      'Après la prise de Koufra, en mars 1941, il fait jurer à ses hommes de ne s’arrêter qu’à Strasbourg.',
      'Sa 2ᵉ division blindée libère Paris les 24 et 25 août 1944 et reçoit la reddition de von Choltitz.',
      'Le 23 novembre 1944, elle entre dans Strasbourg : le serment de Koufra est tenu.',
      'Mort dans un accident d’avion en 1947, il est fait maréchal de France à titre posthume en 1952.',
    ],
    mots: [
      {
        mot: 'Nom de guerre',
        sens: 'Pseudonyme pris par un combattant clandestin pour que l’ennemi ne puisse pas s’en prendre à sa famille.',
      },
      {
        mot: 'Division blindée',
        sens: 'Grande unité de plus de dix mille hommes articulée autour de ses chars, faite pour percer et avancer vite.',
      },
      {
        mot: 'Reddition',
        sens: 'Acte par lequel une armée vaincue se rend officiellement, en signant les conditions du vainqueur.',
      },
    ],
    lies: [
      'charles-de-gaulle',
      'jean-moulin',
      'liberation-de-paris',
      'debarquement-du-6-juin-1944',
    ],
    niveaux: ['3e'],
    programme: 'La Seconde Guerre mondiale : la France défaite et occupée',
    tags: [
      'Leclerc',
      'Koufra',
      '2e DB',
      'Strasbourg',
      'Libération de Paris',
      'Nueve',
      'Hauteclocque',
      'France libre',
      'Berchtesgaden',
      'serment',
    ],
  },
]
