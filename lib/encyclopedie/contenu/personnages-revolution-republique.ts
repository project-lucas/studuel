// -----------------------------------------------------------------------------
// RÉVOLUTION — LA RÉPUBLIQUE ET SES HOMMES. Le cœur du gros morceau : ceux qui
// ont fait la Convention, la Terreur, la guerre et l'abolition.
//
// Ni légende dorée, ni légende noire — les MÉCANISMES, datés et chiffrés
// (docs/encyclopedie.md, § 3). La Terreur est écrite avec ses lois (le Tribunal
// révolutionnaire, la loi des suspects, la loi de prairial), ses chiffres
// (environ 17 000 condamnations à mort prononcées) et ses violences de terrain
// (les colonnes infernales de Vendée, les noyades de Nantes) ; l'abolition de
// 1794 et la levée en masse sont écrites avec la même précision, parce qu'elles
// viennent des mêmes hommes et des mêmes mois.
//
// Deux fiches se répondent d'un bout à l'autre : Marat et Charlotte Corday —
// le journaliste qui réclame des têtes, et la jeune femme qui vient prendre la
// sienne. On les lit dans l'ordre ou dans l'autre, jamais séparément.
//
// L'abbé Grégoire est traité avec le respect prévu au guide pour les figures
// chrétiennes : sa foi est le moteur de ses actes, pas une survivance d'époque.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_REVOLUTION_REPUBLIQUE: Personnage[] = [
  {
    id: 'marat',
    volet: 'personnages',
    nom: 'Jean-Paul Marat',
    surnom: 'l’Ami du peuple',
    dates: '1743 – 1793',
    tri: 1793,
    periode: 'revolution',
    emoji: '🛁',
    roles: ['Médecin', 'Journaliste', 'Député à la Convention'],
    origine: 'Boudry, principauté de Neuchâtel',
    accroche:
      'Médecin devenu le journaliste le plus redouté de la Révolution, il réclame des têtes dans son journal — et meurt d’un coup de couteau dans sa baignoire.',
    citations: [
      {
        texte:
          'Cinq ou six cents têtes abattues vous auraient assuré le repos, la liberté et le bonheur ; une fausse humanité a retenu vos bras et suspendu vos coups : elle va coûter la vie à des millions de vos frères.',
        contexte: 'Dans *L’Ami du peuple*, en 1790, un an après la prise de la Bastille.',
        sens:
          'Marat réclame des exécutions préventives dès 1790 : la Terreur a eu ses théoriciens plusieurs années avant d’avoir ses lois.',
      },
      {
        texte: 'Vitam impendere vero.',
        contexte:
          'Devise empruntée au poète latin Juvénal, imprimée en tête de *L’Ami du peuple* à partir de 1789.',
        sens:
          '« Consacrer sa vie à la vérité. » Rousseau l’avait prise pour lui ; Marat en fait une arme de presse.',
      },
      {
        texte: 'C’est bien, avant peu je les ferai tous guillotiner à Paris.',
        contexte:
          'Rapporté comme sa réponse à Charlotte Corday, qui venait de lui dicter les noms des députés girondins réfugiés à Caen, le 13 juillet 1793.',
        incertaine: true,
      },
      {
        texte: 'À moi, ma chère amie !',
        contexte:
          'Ses derniers mots, appelant sa compagne Simonne Évrard depuis sa baignoire, le 13 juillet 1793.',
      },
    ],
    reperes: [
      'Suisse d’origine, médecin à Londres puis à Paris, auteur de travaux sur le feu, l’électricité et la lumière.',
      'Fonde *L’Ami du peuple* le 12 septembre 1789 : le journal d’un seul homme, qui dénonce et qui désigne.',
      'Poursuivi, il se cache des mois dans les caves de Paris ; sa peau en garde une maladie incurable.',
      'Acquitté par le Tribunal révolutionnaire le 24 avril 1793, il est ramené en triomphe à la Convention.',
      'Assassiné dans son bain le 13 juillet 1793 par Charlotte Corday ; David le peint en martyr dès l’automne.',
    ],
    recit: [
      {
        titre: 'Un savant qui ne perce pas',
        texte:
          'Né en **1743** à **Boudry**, dans la principauté de Neuchâtel, Jean-Paul Marat n’est pas français de naissance. Il se forme à la médecine en Angleterre, y exerce dix ans, publie un *Essai philosophique sur l’homme* et soigne assez bien pour être nommé en **1777 médecin des gardes du comte d’Artois**, frère du roi. Il mène en même temps des centaines d’expériences sur le feu, l’électricité et la lumière, qu’il soumet à l’**Académie des sciences**. L’Académie refuse. Marat, qui se juge l’égal de Newton, ne le pardonnera jamais : il gardera toute sa vie la certitude d’être un homme de génie écarté par des coteries. Cette rancune contre les corps établis, il la retournera en 1789 contre les ministres, les députés, les généraux — contre quiconque occupe une place.',
      },
      {
        titre: '*L’Ami du peuple*, un journal comme une arme',
        texte:
          'Le **12 septembre 1789** paraît le premier numéro de *L’Ami du peuple*. Ce n’est pas un journal d’information : c’est une **dénonciation quotidienne**, écrite à la première personne, où les coupables sont nommés et montrés au lecteur. Marat y attaque Necker, La Fayette, Bailly, puis les Girondins. Il réclame très tôt des exécutions : cinq cents têtes en 1790, beaucoup plus ensuite. Le ton fait sa force — le peuple des faubourgs reconnaît quelqu’un qui parle sa langue et ne ménage personne — et fait son danger : deux fois décrété d’arrestation, Marat **se cache dans les caves et les souterrains** de Paris, où il écrit et imprime en fuite. Il y contracte, ou y aggrave, la maladie de peau qui le ronge : des plaies et des démangeaisons qui ne cèdent qu’au bain. À partir de 1793, il travaille dans une **baignoire de cuivre en forme de sabot**, une planche posée en travers en guise de bureau.',
      },
      {
        titre: 'Le député et la chute des Girondins',
        texte:
          'Élu **député de Paris à la Convention** en septembre 1792, Marat siège tout en haut, à la **Montagne**. Les **Girondins** le tiennent pour l’inspirateur des massacres de Septembre et le font traduire devant le **Tribunal révolutionnaire** le **24 avril 1793**. Il est **acquitté**, et la foule le ramène à la Convention couronné de feuilles de chêne : ses adversaires viennent de lui offrir un triomphe. Six semaines plus tard, les **31 mai et 2 juin 1793**, la garde nationale entoure l’assemblée ; vingt-neuf députés girondins sont arrêtés. Marat comptait parmi ceux qui réclamaient leur mise hors la loi. Des rescapés se réfugient à **Caen**, en Normandie, et y appellent les départements à marcher sur Paris. C’est là qu’une jeune femme les écoute.',
      },
      {
        titre: 'Treize juillet, sept heures et demie du soir',
        texte:
          'Le **13 juillet 1793**, **Charlotte Corday** se présente deux fois rue des Cordeliers. Le soir, elle obtient d’entrer : elle a fait dire qu’elle apportait les **noms des Girondins de Caen**. Marat est dans son bain, un linge vinaigré sur la tête ; il note les noms sous la dictée. Elle tire un **couteau de cuisine** acheté le matin même au Palais-Royal, quarante sous, et frappe une fois, à la poitrine. Marat meurt en quelques minutes. Le peintre **Jacques-Louis David**, son ami, arrive le lendemain et compose *La Mort de Marat* : le drap, la baignoire, la lettre encore à la main, une lumière de Pietà. Le tableau fera plus pour sa gloire que quatre ans de journal. Son corps entre au **Panthéon** le 21 septembre 1794 ; il en ressort le 8 février 1795, quand la Convention thermidorienne a changé d’avis.',
      },
      {
        titre: 'Un homme qu’on ne peut pas ranger',
        texte:
          'Marat n’a gouverné ni ministère ni comité, et n’a voté aucune des grandes lois de la Terreur : il meurt un an avant la loi de prairial. Son rôle est ailleurs. Il a inventé une manière de faire de la politique par le **journal**, où l’on désigne des coupables à la foule avant qu’aucun tribunal ne les ait jugés. Ses partisans y voient la vigilance d’un homme incorruptible qui a souvent eu raison avant les autres ; ses adversaires, l’**appel au meurtre** imprimé à quelques milliers d’exemplaires. Les deux lectures s’appuient sur les mêmes pages, et ces pages existent : elles se lisent encore. C’est pourquoi Marat reste, deux siècles après, la figure la plus discutée de la Révolution — et la seule dont le portrait le plus célèbre soit celui de sa mort.',
      },
    ],
    chrono: [
      { date: '1743', fait: 'Naissance à Boudry, principauté de Neuchâtel.' },
      { date: '1777', fait: 'Médecin des gardes du comte d’Artois, à Paris.' },
      { date: '12 septembre 1789', fait: 'Premier numéro de *L’Ami du peuple*.' },
      { date: '1790 – 1792', fait: 'Décrété d’arrestation, il se cache dans Paris.' },
      { date: 'septembre 1792', fait: 'Élu député de Paris à la Convention.' },
      { date: '24 avril 1793', fait: 'Acquitté par le Tribunal révolutionnaire.' },
      { date: '2 juin 1793', fait: 'Chute des Girondins, qu’il avait réclamée.' },
      { date: '13 juillet 1793', fait: 'Assassiné dans sa baignoire par Charlotte Corday.' },
      { date: '21 septembre 1794', fait: 'Panthéonisé ; il en sortira le 8 février 1795.' },
    ],
    leSaisTu:
      'La baignoire a survécu à son propriétaire. Vendue après sa mort, exhibée de foire en foire pendant un siècle, elle se voit aujourd’hui au musée Grévin, à Paris : un sabot de cuivre d’un mètre soixante, avec le rebord de bois où se posait la planche qui lui servait de bureau.',
    aRetenir: [
      'Marat fonde *L’Ami du peuple* le 12 septembre 1789 et en fait l’organe de la dénonciation quotidienne.',
      'Élu député de Paris à la Convention en 1792, il siège à la Montagne et réclame la chute des Girondins.',
      'Acquitté par le Tribunal révolutionnaire le 24 avril 1793, il est ramené en triomphe à l’assemblée.',
      'Il est assassiné dans son bain le 13 juillet 1793 par Charlotte Corday, venue de Caen.',
      'David peint *La Mort de Marat* la même année : c’est l’image qui a fixé sa mémoire.',
    ],
    mots: [
      {
        mot: 'Montagne',
        sens: 'Les députés assis sur les gradins les plus hauts de la Convention, partisans des mesures les plus fermes.',
      },
      {
        mot: 'Girondins',
        sens: 'Députés modérés de la Convention, hostiles au pouvoir des sections parisiennes ; arrêtés le 2 juin 1793.',
      },
      {
        mot: 'Sans-culottes',
        sens: 'Artisans et boutiquiers parisiens, en pantalon et non en culotte de noble : la force populaire de la Révolution.',
      },
    ],
    lies: [
      'charlotte-corday',
      'danton',
      'robespierre',
      'camille-desmoulins',
      'crise-du-pain-et-des-grains',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Marat',
      'Ami du peuple',
      'journal',
      'baignoire',
      'Corday',
      'Montagne',
      'Girondins',
      'David',
      'Panthéon',
      'Cordeliers',
    ],
  },
  {
    id: 'charlotte-corday',
    volet: 'personnages',
    nom: 'Charlotte Corday',
    surnom: 'l’ange de l’assassinat',
    dates: '1768 – 1793',
    tri: 1793,
    periode: 'revolution',
    emoji: '🗡️',
    roles: ['Normande de petite noblesse', 'Meurtrière de Marat'],
    origine: 'Écorches, Normandie',
    accroche:
      'Une Normande de vingt-quatre ans monte à Paris avec un couteau de cuisine, tue Marat dans son bain, et va à l’échafaud sans rien renier.',
    citations: [
      {
        texte:
          'J’ai tué un homme pour en sauver cent mille ; un scélérat pour sauver des innocents ; une bête féroce pour donner le repos à la France.',
        contexte:
          'Dans sa lettre au député girondin Barbaroux, écrite en prison à la Conciergerie, le 16 juillet 1793.',
      },
      {
        texte: 'Je n’avais pas besoin de la haine des autres : j’avais assez de la mienne.',
        contexte:
          'À son procès, le 17 juillet 1793, à qui lui demandait qui avait pu lui inspirer tant de haine contre Marat.',
      },
      {
        texte: 'J’étais républicaine bien avant la Révolution.',
        contexte: 'Dans la même lettre à Barbaroux, deux jours après son geste.',
        sens:
          'Elle n’a pas frappé au nom du roi : elle a frappé au nom d’une République qu’elle croit confisquée par quelques hommes.',
      },
      {
        texte: 'Le crime fait la honte, et non pas l’échafaud.',
        contexte:
          'Vers de Thomas Corneille qu’on lui prête en allant au supplice ; elle descendait de la famille du dramaturge.',
        sens: 'Ce qui déshonore, c’est la faute, pas la peine. Elle refuse d’avoir honte.',
        incertaine: true,
      },
    ],
    reperes: [
      'Marie-Anne Charlotte de Corday d’Armont, née en 1768 dans l’Orne, élevée à l’Abbaye-aux-Dames de Caen.',
      'Descendante de la famille du dramaturge Pierre Corneille ; lectrice de Plutarque, de Rousseau et de Raynal.',
      'À Caen, elle écoute les députés girondins chassés de la Convention le 2 juin 1793.',
      'Part seule pour Paris le 9 juillet 1793 ; achète son couteau au Palais-Royal le 13 au matin.',
      'Jugée et guillotinée le 17 juillet 1793, quatre jours après son geste, à vingt-quatre ans.',
    ],
    recit: [
      {
        titre: 'Une lectrice de Plutarque',
        texte:
          'Marie-Anne Charlotte de Corday d’Armont naît en **1768** près d’Argentan, dans une famille de **petite noblesse normande** sans fortune : son père cultive lui-même ses terres. Élevée à l’**Abbaye-aux-Dames de Caen**, elle y lit **Plutarque**, **Corneille** — dont elle descend —, **Rousseau** et l’abbé **Raynal**. De Plutarque, elle retient les tyrannicides de l’Antiquité, Brutus et Harmodios, ces hommes que les Anciens honoraient pour avoir tué un maître. Quand la Révolution ferme les couvents en 1790, elle s’installe à Caen chez une parente. Elle a vingt-deux ans, elle est républicaine, elle suit les journaux. Ce qui la sépare de milliers d’autres jeunes femmes instruites de son temps, ce n’est pas ce qu’elle pense : c’est ce qu’elle va en faire.',
      },
      {
        titre: 'Caen, juin 1793',
        texte:
          'Le **2 juin 1793**, la Convention cède aux sections parisiennes et fait arrêter vingt-neuf députés **girondins**. Une vingtaine s’échappent et gagnent la Normandie : **Barbaroux**, **Pétion**, **Buzot**, **Louvet** s’installent à **Caen** et appellent les départements à marcher sur Paris — c’est la révolte dite **fédéraliste**. Charlotte Corday les écoute, lit leurs adresses, se fait présenter à Barbaroux. L’insurrection tourne court : les volontaires normands se débandent sans avoir combattu. C’est cet échec qui la décide. Si la province ne marche pas, une personne suffira ; et l’homme à abattre, pour elle, est celui qui, chaque matin dans son journal, réclame des têtes : **Marat**.',
      },
      {
        titre: 'Quatre jours à Paris',
        texte:
          'Elle quitte Caen le **9 juillet 1793** par la diligence et descend à Paris, rue des Vieux-Augustins. Elle a écrit une *Adresse aux Français amis des lois et de la paix* qu’elle garde sur elle : ce sera son explication. Elle pensait frapper Marat en public, le 14 juillet, devant la Convention ; elle apprend qu’il est malade et ne siège plus. Le **13 juillet** au matin, elle achète au **Palais-Royal** un couteau de cuisine à manche d’ébène, quarante sous. Elle se présente deux fois rue des Cordeliers ; le soir, elle fait passer un mot disant qu’elle apporte les **noms des Girondins de Caen**. On la fait entrer. Marat est dans sa baignoire. Elle lui dicte des noms, il les écrit, et elle frappe une seule fois, à la poitrine. Elle ne cherche pas à fuir.',
      },
      {
        titre: 'Le procès et l’échafaud',
        texte:
          'Jugée le **17 juillet 1793** par le **Tribunal révolutionnaire**, elle reconnaît tout, nie avoir eu le moindre complice et défend son acte avec un calme qui frappe la salle. Condamnée à mort le jour même, elle est guillotinée le soir, **place de la Révolution**, vêtue de la **chemise rouge des parricides**. Le peintre Hauer, qui faisait son portrait en prison, obtient de le terminer avant l’exécution. Un aide du bourreau, **Legros**, saisit la tête coupée et la soufflette devant la foule : il est aussitôt arrêté et emprisonné — le geste choque jusque dans un Paris habitué au supplice. Son acte n’a rien sauvé. Marat mort devient un martyr, la Terreur s’accélère, et les vingt et un Girondins qu’elle voulait défendre sont guillotinés le 31 octobre 1793.',
      },
      {
        titre: 'Deux siècles de portraits contraires',
        texte:
          'Aucune figure de la Révolution n’a été autant repeinte. Les révolutionnaires en font une **fanatique** manipulée par des prêtres et des aristocrates — l’autopsie ordonnée après sa mort cherche jusqu’à prouver qu’elle avait un amant, et conclut le contraire. Les royalistes en font une sainte, les romantiques une héroïne : c’est **Lamartine**, en 1847, qui lui donne son surnom d’« **ange de l’assassinat** ». Le fait, lui, ne bouge pas : une femme de vingt-quatre ans a tué seule un homme désarmé dans son bain, en le croyant nécessaire, et l’a payé de sa vie quatre jours plus tard. C’est un **assassinat politique**, l’un des premiers de l’époque contemporaine, et il n’a produit aucun des effets qu’elle en attendait — c’est même le contraire exact qui s’est produit.',
      },
    ],
    chrono: [
      { date: '27 juillet 1768', fait: 'Naissance à Écorches, près d’Argentan.' },
      { date: '1791', fait: 'Installation à Caen chez une parente.' },
      { date: '2 juin 1793', fait: 'Chute des Girondins ; certains se réfugient à Caen.' },
      { date: '9 juillet 1793', fait: 'Elle part seule pour Paris.' },
      { date: '13 juillet 1793, matin', fait: 'Achat du couteau au Palais-Royal.' },
      { date: '13 juillet 1793, soir', fait: 'Elle tue Marat dans sa baignoire.' },
      { date: '17 juillet 1793', fait: 'Procès, condamnation et exécution le même jour.' },
    ],
    leSaisTu:
      'Elle avait glissé sous son fichu son acte de baptême et son *Adresse aux Français*, pour qu’on sache exactement qui elle était et pourquoi elle avait frappé. On trouva aussi sur elle une montre, quelques assignats et le fourreau du couteau : elle n’avait rien prévu pour s’enfuir, parce qu’elle ne comptait pas le faire.',
    aRetenir: [
      'Charlotte Corday assassine Marat le 13 juillet 1793, dans sa baignoire, rue des Cordeliers à Paris.',
      'Elle agit seule, au nom des Girondins chassés de la Convention le 2 juin 1793.',
      'Elle est jugée et guillotinée le 17 juillet 1793, à vingt-quatre ans.',
      'Son geste renforce la Terreur au lieu de l’arrêter : Marat devient un martyr de la Révolution.',
    ],
    mots: [
      {
        mot: 'Tyrannicide',
        sens: 'Meurtre d’un homme jugé tyran ; les auteurs antiques en font un acte de vertu, ce que Corday revendique.',
      },
      {
        mot: 'Fédéralisme',
        sens: 'Révolte de départements contre le pouvoir de Paris, à l’été 1793 ; les Girondins en sont accusés.',
      },
      {
        mot: 'Tribunal révolutionnaire',
        sens: 'Cour créée à Paris le 10 mars 1793 pour juger sans appel les ennemis de la Révolution.',
      },
    ],
    lies: ['marat', 'robespierre', 'danton', 'camille-desmoulins'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Corday',
      'Marat',
      'Caen',
      'Girondins',
      'assassinat',
      'Normandie',
      'Corneille',
      'Conciergerie',
      'ange de l’assassinat',
      'fédéralisme',
    ],
  },
  {
    id: 'camille-desmoulins',
    volet: 'personnages',
    nom: 'Camille Desmoulins',
    surnom: 'le procureur général de la lanterne',
    dates: '1760 – 1794',
    tri: 1794,
    periode: 'revolution',
    emoji: '🪶',
    roles: ['Avocat', 'Journaliste', 'Député à la Convention'],
    origine: 'Guise, Picardie',
    accroche:
      'Le bègue qui met Paris aux armes le 12 juillet 1789, puis le seul journaliste qui ose réclamer la clémence en pleine Terreur — et la paie de sa tête.',
    citations: [
      {
        texte:
          'Aux armes ! Ce soir, les bataillons suisses et allemands sortiront du Champ-de-Mars pour nous égorger : il ne nous reste qu’une ressource, c’est de courir aux armes !',
        contexte:
          'Debout sur une table du café de Foy, au Palais-Royal, le 12 juillet 1789, au lendemain du renvoi de Necker.',
      },
      {
        texte:
          'Ouvrez les prisons à ces deux cent mille citoyens que vous appelez suspects, car dans la Déclaration des droits il n’y a point de maisons de suspicion, il n’y a que des maisons d’arrêt.',
        contexte: 'Dans *Le Vieux Cordelier*, numéro 4, le 20 décembre 1793, contre la loi des suspects.',
        sens:
          'Il réclame un « comité de clémence » au moment où le Comité de salut public fait juger des dizaines de personnes par semaine.',
      },
      {
        texte: 'J’ai l’âge du sans-culotte Jésus, trente-trois ans : âge fatal aux révolutionnaires.',
        contexte:
          'Au Tribunal révolutionnaire, le 2 avril 1794, quand le président lui demande son nom et son âge. Il en avait trente-quatre.',
      },
      {
        texte: 'Adieu, ma vie, mon âme, ma divinité sur la terre !',
        contexte:
          'Dernière lettre à sa femme Lucile, écrite de la prison du Luxembourg, dans les premiers jours d’avril 1794.',
      },
    ],
    reperes: [
      'Camarade de classe de Robespierre au collège Louis-le-Grand, à Paris.',
      'Avocat empêché par un fort bégaiement — qui le quitte, dit-on, dès qu’il harangue une foule.',
      'Le 12 juillet 1789, il appelle aux armes au Palais-Royal : la Bastille tombe deux jours plus tard.',
      'Journaliste des *Révolutions de France et de Brabant*, député de Paris à la Convention en 1792.',
      'Lance *Le Vieux Cordelier* en décembre 1793 pour réclamer la fin de la Terreur.',
      'Guillotiné avec Danton le 5 avril 1794 ; sa femme Lucile le suit huit jours après.',
    ],
    recit: [
      {
        titre: 'Le bègue du Palais-Royal',
        texte:
          'Né à **Guise**, en Picardie, en **1760**, Camille Desmoulins entre à quatorze ans au collège **Louis-le-Grand** à Paris grâce à une bourse. Il y côtoie un boursier d’Arras à peine plus âgé : **Maximilien de Robespierre**. Reçu avocat au Parlement de Paris en 1785, il ne plaide presque pas — il **bégaie**, et un avocat qui bégaie n’a pas de clients. Il vit de peu, lit, écrit. Le **12 juillet 1789**, la nouvelle du renvoi de **Necker** met le Palais-Royal en ébullition ; Desmoulins monte sur une table du café de Foy, un pistolet à la main, et harangue la foule. Les témoins racontent tous la même chose : il ne bégaie plus. Il arrache une feuille à un marronnier pour en faire une cocarde verte, couleur de l’espérance — on l’abandonnera en s’apercevant que le vert est la livrée du comte d’Artois. Deux jours après, la **Bastille** tombe.',
      },
      {
        titre: 'La plume la plus drôle et la plus dangereuse',
        texte:
          'Desmoulins devient en quelques mois l’un des journalistes les plus lus de France. Son *Discours de la lanterne aux Parisiens* (1789) lui vaut son surnom de « **procureur général de la lanterne** » — la lanterne à laquelle la foule pendait les ennemis du peuple : c’était une plaisanterie, elle lui restera comme une accusation. Son hebdomadaire, *Révolutions de France et de Brabant*, mêle le reportage, la satire et l’insulte avec un talent que personne n’égale. En **1790**, il épouse **Lucile Duplessis**, dont il est amoureux depuis des années ; **Robespierre** est témoin. Élu **député de Paris à la Convention** en 1792, il vote la mort du roi. En 1793, son pamphlet *Histoire des Brissotins* accable les **Girondins** quelques semaines avant leur chute — et quand ils montent à l’échafaud, on rapporte qu’il s’écrie : « C’est moi qui les tue. » Il ne s’en remettra pas.',
      },
      {
        titre: 'Demander grâce sous la Terreur',
        texte:
          'Le **5 décembre 1793** paraît le premier numéro du *Vieux Cordelier*. Robespierre en a relu les épreuves : il croit tenir une arme contre les **hébertistes**, les ultra-révolutionnaires. Le journal va ailleurs. Dans le numéro 3, Desmoulins traduit **Tacite** décrivant la Rome de Tibère — les délateurs, les procès pour un mot, un regard, un silence — et laisse le lecteur faire la comparaison tout seul. Dans le numéro 4, il n’use plus de détour : il réclame l’ouverture des prisons et un « **comité de clémence** ». Sept numéros, des tirages énormes, des queues chez le libraire. Aux Jacobins, Robespierre le défend d’abord, puis lâche la formule qui le condamne : les numéros de Desmoulins doivent être **brûlés**. Desmoulins répond du tac au tac que brûler n’est pas répondre. Il vient de mettre son nom sur la liste.',
      },
      {
        titre: 'Germinal',
        texte:
          'Dans la nuit du **30 au 31 mars 1794**, Desmoulins est arrêté avec **Danton**, Delacroix et Philippeaux : ce sont les « **Indulgents** », ceux qui veulent négocier la paix et ralentir la machine. Le procès s’ouvre le 2 avril devant le **Tribunal révolutionnaire**. Les accusés se défendent si bien que la Convention vote, sur rapport de **Saint-Just**, un décret permettant de les **exclure des débats** : on les juge sans les entendre. Condamnés le **5 avril 1794** (16 germinal an II), ils sont guillotinés le soir même. Desmoulins a **trente-quatre ans** ; il se débat sur la charrette, la chemise déchirée, criant son innocence. **Lucile**, sa femme, remue ciel et terre pour le sauver ; on l’accuse aussitôt d’avoir comploté pour faire évader les prisonniers. Elle est guillotinée le **13 avril 1794**, huit jours après lui. Elle avait vingt-quatre ans.',
      },
      {
        titre: 'Ce qu’il reste',
        texte:
          'Desmoulins n’a rien gouverné et n’a signé aucune loi. Ce qu’il laisse est d’un autre ordre : la preuve qu’un **journal** peut mettre une ville dans la rue en un après-midi (juillet 1789) et qu’il peut, quatre ans plus tard, demander tout haut ce que des milliers de gens pensent tout bas. *Le Vieux Cordelier* est le premier texte qui attaque la Terreur **de l’intérieur**, au nom de la **Déclaration des droits de l’homme** et non au nom du roi : c’est ce qui le rend impardonnable, et c’est ce qui lui donne sa portée. Trois mois après sa mort, ses adversaires tombaient à leur tour et le mot « indulgence » cessait d’être un crime. La Révolution a fait ce chemin sans lui, et contre lui.',
      },
    ],
    chrono: [
      { date: '2 mars 1760', fait: 'Naissance à Guise, en Picardie.' },
      { date: '12 juillet 1789', fait: 'Appel aux armes au Palais-Royal.' },
      { date: '1789', fait: '*Discours de la lanterne aux Parisiens*.' },
      { date: '29 décembre 1790', fait: 'Mariage avec Lucile Duplessis, Robespierre témoin.' },
      { date: 'septembre 1792', fait: 'Élu député de Paris à la Convention.' },
      { date: '5 décembre 1793', fait: 'Premier numéro du *Vieux Cordelier*.' },
      { date: '31 mars 1794', fait: 'Arrêté dans la nuit avec Danton.' },
      { date: '5 avril 1794', fait: 'Guillotiné, à trente-quatre ans.' },
      { date: '13 avril 1794', fait: 'Lucile Desmoulins guillotinée à son tour.' },
    ],
    leSaisTu:
      'Leur fils Horace avait deux ans quand ses parents furent guillotinés à huit jours d’intervalle. La Convention thermidorienne lui vota une pension. Devenu adulte, il partit vivre à Haïti — la république née de l’abolition de 1794 — et y mourut en 1825, sans descendance.',
    aRetenir: [
      'Le 12 juillet 1789, Camille Desmoulins appelle Paris aux armes au Palais-Royal.',
      'Journaliste des *Révolutions de France et de Brabant*, il est élu député de Paris à la Convention en 1792.',
      'Il lance *Le Vieux Cordelier* en décembre 1793 et y réclame un comité de clémence contre la Terreur.',
      'Arrêté avec Danton le 31 mars 1794, il est guillotiné le 5 avril 1794 à trente-quatre ans.',
      'Sa femme Lucile est guillotinée huit jours après lui, le 13 avril 1794.',
    ],
    mots: [
      {
        mot: 'Indulgents',
        sens: 'Les révolutionnaires qui réclament, fin 1793, la clémence et la paix : Danton, Desmoulins, Philippeaux.',
      },
      {
        mot: 'Loi des suspects',
        sens: 'Loi du 17 septembre 1793 permettant d’arrêter quiconque ne peut prouver son civisme.',
      },
      {
        mot: 'Club des Cordeliers',
        sens: 'Club parisien fondé en 1790, le plus ouvert au peuple ; Danton, Marat et Desmoulins y siègent.',
      },
    ],
    lies: [
      'danton',
      'robespierre',
      'marat',
      'charlotte-corday',
      'prise-de-la-bastille',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Desmoulins',
      'Lucile',
      'Vieux Cordelier',
      'Palais-Royal',
      'lanterne',
      'Indulgents',
      'clémence',
      'germinal',
      'Guise',
      'journaliste',
    ],
  },
  {
    id: 'danton',
    volet: 'personnages',
    nom: 'Georges Danton',
    surnom: 'la voix de la Révolution',
    dates: '1759 – 1794',
    tri: 1794,
    periode: 'revolution',
    emoji: '🦁',
    roles: ['Avocat', 'Ministre de la Justice', 'Député à la Convention'],
    origine: 'Arcis-sur-Aube, Champagne',
    accroche:
      'Une voix de tonnerre et un visage balafré : il sauve la République en septembre 1792, veut arrêter la Terreur en 1794, et y laisse sa tête.',
    citations: [
      {
        texte:
          'Il nous faut de l’audace, encore de l’audace, toujours de l’audace, et la France est sauvée !',
        contexte:
          'À l’Assemblée législative, le 2 septembre 1792, le jour où l’on apprend que Verdun est tombé et que les Prussiens marchent sur Paris.',
      },
      {
        texte: 'Tu montreras ma tête au peuple : elle en vaut la peine.',
        contexte: 'Au bourreau Sanson, sur l’échafaud de la place de la Révolution, le 5 avril 1794.',
      },
      {
        texte: 'On n’emporte pas la patrie à la semelle de ses souliers.',
        contexte: 'À ceux qui le pressaient de fuir à l’étranger, quelques jours avant son arrestation, en mars 1794.',
        sens: 'On ne peut pas emmener son pays avec soi : l’exil, pour lui, vaut moins que la mort.',
      },
      {
        texte: 'Après le pain, l’éducation est le premier besoin du peuple.',
        contexte: 'À la Convention, le 13 août 1793, en réclamant une instruction publique et gratuite.',
      },
    ],
    reperes: [
      'Avocat aux Conseils du roi : il achète sa charge 78 000 livres en 1787 — il devra s’en expliquer.',
      'Fonde le club des Cordeliers en 1790, le plus populaire des clubs parisiens.',
      'Ministre de la Justice après la chute de la monarchie, le 10 août 1792.',
      'Son appel du 2 septembre 1792 lance la mobilisation qui aboutit à Valmy, vingt jours plus tard.',
      'Membre du premier Comité de salut public (avril-juillet 1793), puis écarté.',
      'Chef des « Indulgents », il est guillotiné le 5 avril 1794 avec Camille Desmoulins.',
    ],
    recit: [
      {
        titre: 'Un avocat de province à Paris',
        texte:
          'Georges Jacques Danton naît en **1759** à **Arcis-sur-Aube**, en Champagne, dans une famille de petits officiers de justice. Enfant, un taureau puis la petite vérole lui laissent le visage marqué et le nez écrasé : il en tire une tête qu’on n’oublie pas. Monté à Paris, il devient **avocat aux Conseils du roi** en 1787 en achetant sa charge **78 000 livres** — une somme dont l’origine restera discutée toute sa vie et servira, sept ans plus tard, à son accusation. Ce qu’il a de rare, c’est la **voix** : un organe énorme, qui porte sur une place entière, et le don de trouver la phrase courte qui décide une assemblée. En 1790, il fonde avec Marat et Desmoulins le **club des Cordeliers**, dans son quartier, le plus ouvert et le plus populaire de Paris.',
      },
      {
        titre: 'Septembre 1792 : « de l’audace »',
        texte:
          'Le **10 août 1792**, l’insurrection parisienne prend les Tuileries et renverse la monarchie. Danton devient **ministre de la Justice** du gouvernement provisoire : à trente-deux ans, il est l’homme fort de la France. La situation est désespérée — les Prussiens ont pris Longwy, puis **Verdun** le 2 septembre ; la route de Paris est ouverte. Ce jour-là, Danton monte à la tribune et prononce les phrases qui feront sa légende. Trente mille volontaires partent ; le **20 septembre**, l’armée tient à **Valmy**. Mais ces mêmes journées voient les **massacres de Septembre** : du 2 au 6 septembre, des bandes égorgent dans les prisons de Paris entre **1 100 et 1 400 détenus** — prêtres, nobles, mais aussi condamnés de droit commun, femmes et enfants de la Salpêtrière. Ministre de la Justice, Danton n’a rien empêché. Il dira qu’il ne le pouvait pas. C’est la tache que ses ennemis lui jetteront toujours au visage, et elle est réelle.',
      },
      {
        titre: 'Le Comité, puis la mise à l’écart',
        texte:
          'Élu **député de Paris à la Convention**, Danton vote la mort du roi, mais passe l’année 1793 à chercher des **compromis** : il tente de sauver les Girondins, fait sonder secrètement l’Angleterre et la Prusse, veut une paix négociée. Il entre au premier **Comité de salut public** en avril 1793 et y travaille surtout à la diplomatie. Le Comité échoue à redresser la situation militaire ; le **10 juillet 1793**, Danton n’est pas réélu. **Robespierre** y entre dix-sept jours plus tard. Danton se retire quelques semaines à Arcis-sur-Aube : veuf depuis février 1793, il y épouse Louise Gély, seize ans, et goûte une vie de propriétaire champenois. À son retour, l’hiver 1793-1794, il prend la tête de ceux qu’on appelle les **Indulgents** : assez de sang, assez de procès, négocions la paix.',
      },
      {
        titre: 'Le procès de germinal',
        texte:
          'Le conflit est simple et sans issue : le Comité tient que la guerre étrangère et la révolte intérieure interdisent tout relâchement ; Danton tient que la Terreur a fait son temps. Le Comité frappe d’abord à gauche — les **hébertistes** sont guillotinés le **24 mars 1794** —, puis à droite. Danton, Desmoulins et leurs amis sont arrêtés dans la nuit du **30 au 31 mars**. L’acte d’accusation mêle de vraies affaires d’argent (la liquidation de la **Compagnie des Indes**, des fonds reçus de la cour en 1792) et des accusations de complot avec l’étranger. Au tribunal, Danton retrouve sa voix et domine les débats à tel point que la Convention vote, sur rapport de **Saint-Just**, un décret permettant d’**écarter des débats** les accusés qui manquent de respect à la justice. On les juge muets. Condamnés le **5 avril 1794**, quinze hommes montent à l’échafaud le soir même. Danton passe le dernier, après avoir embrassé Desmoulins.',
      },
      {
        titre: 'Ce que sa mort annonce',
        texte:
          'En trois semaines, la Révolution a supprimé ses deux ailes : les **hébertistes** en mars, les **Indulgents** en avril. Il ne reste plus, au centre, que le **Comité de salut public**, et plus personne pour lui dire non. C’est ce qui rend germinal décisif : la **loi du 22 prairial** (10 juin 1794), qui supprime les défenseurs et ne laisse au juré que l’acquittement ou la mort, n’aurait pas été votée dans une Convention où Danton parlait encore. Sur la charrette, il aurait lancé vers la maison de Robespierre : « Tu me suis, Maximilien. » Trois mois et vingt-trois jours plus tard, le **28 juillet 1794**, Robespierre montait sur le même échafaud, au même endroit, devant la même foule.',
      },
    ],
    chrono: [
      { date: '26 octobre 1759', fait: 'Naissance à Arcis-sur-Aube.' },
      { date: '1790', fait: 'Fondation du club des Cordeliers.' },
      { date: '10 août 1792', fait: 'Chute de la monarchie ; il devient ministre de la Justice.' },
      { date: '2 septembre 1792', fait: 'Discours de « l’audace » ; massacres dans les prisons.' },
      { date: 'avril 1793', fait: 'Entre au premier Comité de salut public.' },
      { date: '10 juillet 1793', fait: 'Il n’est pas réélu au Comité.' },
      { date: 'décembre 1793', fait: 'Il prend la tête des Indulgents.' },
      { date: '31 mars 1794', fait: 'Arrestation, avec Camille Desmoulins.' },
      { date: '5 avril 1794', fait: 'Guillotiné place de la Révolution.' },
    ],
    leSaisTu:
      'Le 2 septembre 1792, avant de monter à la tribune, Danton avait fait tirer le canon d’alarme et sonner le tocsin dans tout Paris : il voulait que la ville entière apprenne d’un coup que Verdun était tombé. Le même jour commençaient les massacres dans les prisons. Une seule journée porte ses deux visages.',
    aRetenir: [
      'Danton devient ministre de la Justice après la chute de la monarchie, le 10 août 1792.',
      'Son discours du 2 septembre 1792 lance la mobilisation qui mène à la victoire de Valmy.',
      'Les massacres de Septembre 1792 font entre 1 100 et 1 400 morts dans les prisons pendant son ministère.',
      'Chef des Indulgents, il réclame la fin de la Terreur à l’hiver 1793-1794.',
      'Il est guillotiné le 5 avril 1794, après un procès où on l’a empêché de parler.',
    ],
    mots: [
      {
        mot: 'Comité de salut public',
        sens: 'Gouvernement de guerre de douze membres, créé le 6 avril 1793, qui dirige la France jusqu’à thermidor.',
      },
      {
        mot: 'Hébertistes',
        sens: 'Révolutionnaires de la gauche des Cordeliers, groupés autour du journaliste Hébert ; guillotinés en mars 1794.',
      },
      {
        mot: 'Germinal',
        sens: 'Septième mois du calendrier républicain (21 mars – 19 avril) : le procès de Danton est celui de germinal an II.',
      },
    ],
    lies: ['robespierre', 'camille-desmoulins', 'marat', 'lazare-carnot'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Danton',
      'audace',
      'Cordeliers',
      'Indulgents',
      'ministre de la Justice',
      'Valmy',
      'germinal',
      'Arcis-sur-Aube',
      'Sanson',
      '10 août 1792',
    ],
  },
  {
    id: 'robespierre',
    volet: 'personnages',
    nom: 'Maximilien de Robespierre',
    surnom: 'l’Incorruptible',
    dates: '1758 – 1794',
    tri: 1794,
    periode: 'revolution',
    emoji: '⚖️',
    roles: ['Avocat', 'Député', 'Membre du Comité de salut public'],
    origine: 'Arras, Artois',
    accroche:
      'L’avocat qui demandait l’abolition de la peine de mort en 1791 gouverne la Terreur en 1794 — et monte à son tour sur l’échafaud.',
    citations: [
      {
        texte:
          'Je ne suis point le courtisan, ni le modérateur, ni le tribun, ni le défenseur du peuple : je suis peuple moi-même !',
        contexte:
          'Au club des Jacobins, à Paris, en 1792, répondant à ceux qui l’accusaient de flatter la foule pour s’en servir.',
      },
      {
        texte:
          'Je viens prier les législateurs d’effacer du code des Français les lois de sang qui commandent des meurtres juridiques.',
        contexte:
          'À l’Assemblée constituante, le 30 mai 1791, en demandant l’abolition de la peine de mort.',
        sens:
          'Il perd ce jour-là : la peine de mort est maintenue. Trois ans plus tard, il gouvernera le pays qui en use le plus.',
      },
      {
        texte:
          'La terreur n’est autre chose que la justice prompte, sévère, inflexible ; elle est donc une émanation de la vertu.',
        contexte:
          'Discours « Sur les principes de morale politique », à la Convention, le 5 février 1794 (17 pluviôse an II).',
        sens:
          'La terreur n’est pas présentée comme une violence, mais comme une justice pressée : c’est la définition qui permet de la voter.',
      },
      {
        texte: 'Je suis fait pour combattre le crime, non pour le gouverner.',
        contexte:
          'Dernier discours à la Convention, le 8 thermidor an II (26 juillet 1794), la veille de sa chute.',
      },
    ],
    reperes: [
      'Orphelin à six ans, boursier au collège Louis-le-Grand, avocat à Arras à vingt-trois ans.',
      'Député du Tiers état d’Artois en 1789 : il parle plus de cinq cents fois à la Constituante.',
      'Il défend le vote de tous les hommes, les juifs, les comédiens et les hommes de couleur libres.',
      'Surnommé « l’Incorruptible » : il loge chez un menuisier et refuse toute place lucrative.',
      'Entre au Comité de salut public le 27 juillet 1793 : la Terreur devient un système de gouvernement.',
      'Arrêté le 9 thermidor an II, guillotiné le lendemain, 28 juillet 1794, à trente-six ans.',
    ],
    recit: [
      {
        titre: 'Arras : l’avocat des petites causes',
        texte:
          'Maximilien de Robespierre naît à **Arras** en **1758**, dans une famille d’avocats. Sa mère meurt quand il a six ans ; son père quitte la ville et disparaît. Élevé par ses grands-parents, il obtient une bourse pour le collège **Louis-le-Grand** à Paris, où il lit **Rousseau** — *Le Contrat social*, *Émile* — et où un camarade picard s’appelle **Camille Desmoulins**. Reçu avocat, il revient plaider à Arras en **1781** : des causes modestes, un paysan contre son seigneur, un procès du paratonnerre où il défend la science nouvelle contre la peur. Nommé juge au tribunal épiscopal, il aurait démissionné plutôt que de prononcer une condamnation à mort. Il écrit des mémoires, des vers, entre à l’**Académie d’Arras**, concourt sur les peines infamantes qui frappent la famille d’un condamné. À trente ans, c’est un provincial instruit, pauvre, et intraitable sur les principes.',
      },
      {
        titre: 'Le député qu’on n’écoute pas, puis qu’on ne peut plus arrêter',
        texte:
          'Élu **député du Tiers état d’Artois** aux États généraux de 1789, Robespierre a une voix faible et un accent du Nord ; la Constituante se moque de lui. Il parle quand même : plus de **cinq cents fois** en deux ans. Ses combats sont toujours les mêmes — le **droit de vote de tous les hommes** contre le suffrage censitaire du « marc d’argent », les droits des **juifs**, des **comédiens**, des **hommes de couleur libres**, la liberté de la presse, l’**abolition de la peine de mort** (30 mai 1791). Il perd presque tout. En mai 1791, il fait cependant voter une chose énorme : aucun député de la Constituante ne pourra siéger dans l’Assemblée suivante. Il se prive lui-même de mandat, et gagne un surnom : l’**Incorruptible**. Il loge chez le menuisier **Duplay**, rue Saint-Honoré, dans une chambre au-dessus de l’atelier, et n’en bougera plus.',
      },
      {
        titre: 'La guerre, le roi, la République',
        texte:
          'En **1792**, quand les Girondins réclament la guerre contre l’Europe des rois, Robespierre s’y oppose presque seul : une guerre, dit-il, donnera le pouvoir aux généraux, et personne n’aime les missionnaires armés. La guerre est déclarée le 20 avril ; les défaites arrivent, puis la chute du roi (**10 août 1792**). Robespierre est élu **député de Paris à la Convention**, en tête de liste. Au procès de **Louis XVI**, il refuse qu’on juge le roi comme un accusé ordinaire : il n’y a pas de procès à faire, dit-il, mais une mesure de salut public à prendre. Il vote la mort sans sursis. En 1793, la France est envahie, la **Vendée** soulevée, les Girondins renversés (2 juin), Lyon, Marseille et Toulon en révolte. Le **27 juillet 1793**, Robespierre entre au **Comité de salut public**. Il n’en est ni le président ni le chef légal — le Comité décide en corps — mais il en devient la voix.',
      },
      {
        titre: 'La Vertu et la Terreur',
        texte:
          'Le système se met en place vite. Le **Tribunal révolutionnaire** existe depuis mars 1793 ; la **loi des suspects** du **17 septembre 1793** permet d’arrêter quiconque ne peut prouver son civisme ; le gouvernement est déclaré **révolutionnaire jusqu’à la paix** (10 octobre). Le **5 février 1794**, Robespierre expose la doctrine : le ressort du gouvernement populaire en temps de paix est la **vertu** ; en révolution, c’est la vertu **et la terreur**. Le pays entier est concerné. Les tribunaux révolutionnaires prononcent environ **17 000 condamnations à mort**, auxquelles s’ajoutent des dizaines de milliers de morts sans jugement : les **colonnes infernales** de Turreau brûlent la **Vendée** à partir de janvier 1794, et **Carrier** fait couler dans la Loire, entre novembre 1793 et février 1794, des barques chargées de prisonniers — les **noyades de Nantes**. Robespierre n’a ordonné ni les unes ni les autres et a fait rappeler Carrier ; il n’a pas rompu pour autant avec le principe qui les rendait possibles. La **loi du 22 prairial** (10 juin 1794), qu’il fait présenter par Couthon, supprime avocats et témoins et ne laisse aux jurés que deux issues : acquitter ou tuer. En quarante-sept jours, le seul tribunal de Paris prononce **1 376 condamnations à mort**.',
      },
      {
        titre: 'L’Être suprême',
        texte:
          'Robespierre est croyant, et il tient l’**athéisme** pour une doctrine d’aristocrates. Contre la **déchristianisation** menée par les hébertistes à l’automne 1793 — églises fermées, prêtres poussés à abdiquer, culte de la Raison —, il fait décréter le **7 mai 1794** que « le peuple français reconnaît l’existence de l’**Être suprême** et l’immortalité de l’âme ». Le **8 juin 1794**, au jardin des Tuileries puis au Champ-de-Mars, il préside la **fête de l’Être suprême** en habit bleu, un bouquet d’épis et de fleurs à la main, et met le feu à une statue de l’Athéisme. La foule est immense ; dans les rangs de la Convention, on murmure. Certains députés y voient un homme qui se met à la place du prêtre. La fête, voulue comme une réconciliation, a surtout isolé son auteur.',
      },
      {
        titre: 'Thermidor',
        texte:
          'L’été 1794, la guerre est gagnée — **Fleurus**, le 26 juin — et la Terreur continue : c’est son plus grand problème politique, puisque son seul motif avoué vient de disparaître. Robespierre, malade, s’absente du Comité six semaines. Le **8 thermidor** (26 juillet 1794), il revient à la tribune et dénonce une conspiration dans les comités **sans nommer personne**. Chaque député se croit visé. Une nuit suffit à nouer la coalition : ceux qui craignent pour leur tête (Fouché, Tallien, Barras), ceux qui en ont assez, ceux que la loi de prairial effraie. Le **9 thermidor**, on l’empêche de parler, la Convention décrète son arrestation. Libéré par la Commune, il se retrouve à l’Hôtel de Ville sans oser lancer l’insurrection : il aurait fallu violer la loi, et toute sa vie tient dans l’idée qu’on ne la viole pas. Les troupes de la Convention entrent vers deux heures du matin ; un coup de pistolet lui fracasse la mâchoire. Le **10 thermidor** (28 juillet 1794), il est guillotiné avec **Saint-Just**, **Couthon** et dix-neuf autres, sans jugement, comme hors-la-loi. Il avait trente-six ans.',
      },
    ],
    chrono: [
      { date: '6 mai 1758', fait: 'Naissance à Arras.' },
      { date: '1781', fait: 'Avocat au barreau d’Arras.' },
      { date: '1789', fait: 'Député du Tiers état d’Artois aux États généraux.' },
      { date: '30 mai 1791', fait: 'Il demande l’abolition de la peine de mort.' },
      { date: 'septembre 1792', fait: 'Élu député de Paris à la Convention.' },
      { date: '27 juillet 1793', fait: 'Entre au Comité de salut public.' },
      { date: '5 février 1794', fait: 'Discours sur la vertu et la terreur.' },
      { date: '7 mai 1794', fait: 'Décret sur l’Être suprême.' },
      { date: '8 juin 1794', fait: 'Fête de l’Être suprême au Champ-de-Mars.' },
      { date: '10 juin 1794', fait: 'Loi du 22 prairial : la Grande Terreur.' },
      { date: '28 juillet 1794', fait: 'Guillotiné avec Saint-Just et Couthon.' },
    ],
    leSaisTu:
      'Il avait horreur du désordre jusque dans sa mise : habit propre, cheveux poudrés, lunettes relevées sur le front. Chez les Duplay, il logeait dans une chambre donnant sur l’atelier de menuiserie, meublée d’un lit de bois, d’une table et de quelques rayons de livres. À sa mort, l’inventaire de ses biens tint en une page.',
    aRetenir: [
      'Robespierre demande l’abolition de la peine de mort le 30 mai 1791, et n’obtient rien.',
      'Surnommé « l’Incorruptible », il entre au Comité de salut public le 27 juillet 1793.',
      'Le 5 février 1794, il définit la terreur comme « la justice prompte, sévère, inflexible ».',
      'La Terreur fait environ 17 000 condamnations à mort prononcées, sans compter les morts sans jugement.',
      'Renversé le 9 thermidor an II, il est guillotiné le 28 juillet 1794 à trente-six ans.',
    ],
    mots: [
      {
        mot: 'Vertu',
        sens: 'Chez Robespierre, l’amour des lois et de l’égalité préféré à son intérêt propre : la condition d’une république.',
      },
      {
        mot: 'Loi de prairial',
        sens: 'Loi du 22 prairial an II (10 juin 1794) : plus d’avocat ni de témoins, acquittement ou mort.',
      },
      {
        mot: 'Thermidor',
        sens: 'Onzième mois du calendrier républicain (19 juillet – 17 août) : le 9 thermidor an II est le 27 juillet 1794.',
      },
      {
        mot: 'Être suprême',
        sens: 'Dieu tel que le reconnaît le décret du 7 mai 1794 : une religion civique, contre l’athéisme comme contre Rome.',
      },
    ],
    lies: ['danton', 'camille-desmoulins', 'marat', 'lazare-carnot', 'abbe-gregoire'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Robespierre',
      'Incorruptible',
      'Terreur',
      'Comité de salut public',
      'Arras',
      'vertu',
      'thermidor',
      'Être suprême',
      'Jacobins',
      'prairial',
      'Duplay',
    ],
  },
  {
    id: 'abbe-gregoire',
    volet: 'personnages',
    nom: 'L’abbé Grégoire',
    surnom: 'l’évêque qui ne renia jamais',
    dates: '1750 – 1831',
    tri: 1794,
    periode: 'revolution',
    emoji: '✝️',
    roles: ['Prêtre', 'Évêque constitutionnel', 'Député à la Convention'],
    origine: 'Vého, Lorraine',
    accroche:
      'Prêtre, député et évêque, il arrache aux assemblées la citoyenneté des juifs et l’abolition de l’esclavage — et refuse, seul, de renier sa foi.',
    citations: [
      {
        texte:
          'Catholique par conviction et par sentiment, prêtre par choix, j’ai été désigné par le peuple pour être évêque : je reste évêque.',
        contexte:
          'À la Convention, le 7 novembre 1793, quand l’évêque de Paris vient d’abdiquer et qu’on le somme d’en faire autant.',
      },
      {
        texte:
          'Les rois sont dans l’ordre moral ce que les monstres sont dans l’ordre physique ; les cours sont l’atelier du crime et le foyer de la corruption.',
        contexte:
          'À la Convention, le 21 septembre 1792, en proposant l’abolition de la royauté — votée le jour même.',
      },
      {
        texte:
          'Tous les hommes, sans distinction de couleur, domiciliés dans les colonies, sont citoyens français et jouiront de tous les droits assurés par la Constitution.',
        qui: 'Le décret du 16 pluviôse an II',
        contexte:
          'Décret d’abolition de l’esclavage voté par la Convention le 4 février 1794, préparé par six ans de combat des Amis des Noirs.',
      },
      {
        texte: 'Je créai le mot pour tuer la chose.',
        contexte:
          'Sur le mot « vandalisme », qu’il forge en 1794 pour dénoncer la destruction des églises, des livres et des statues.',
        sens: 'Nommer une pratique, c’est déjà la rendre honteuse. Le mot est passé dans toutes les langues d’Europe.',
      },
    ],
    reperes: [
      'Fils d’un tailleur d’habits, curé d’Emberménil en Lorraine : un prêtre de village, pas un abbé de cour.',
      'Son *Essai sur la régénération des juifs* (1788) prépare le décret du 27 septembre 1791.',
      'Un des premiers curés à rejoindre le Tiers état, le 13 juin 1789.',
      'Membre de la Société des amis des Noirs, il se bat pour l’abolition de l’esclavage de 1794.',
      'Seul évêque à refuser d’abdiquer pendant la déchristianisation de l’automne 1793.',
      'Fonde le Conservatoire des arts et métiers ; ses cendres entrent au Panthéon en 1989.',
    ],
    recit: [
      {
        titre: 'Un curé de village aux États généraux',
        texte:
          'Henri Grégoire naît en **1750** à **Vého**, en Lorraine, fils d’un tailleur d’habits. Ordonné prêtre, il devient curé d’**Emberménil**, un village de quelques centaines d’âmes où il fonde une bibliothèque et fait la classe aux enfants. Il lit, il écrit, il concourt aux académies. En **1788**, l’Académie de **Metz** couronne son *Essai sur la régénération physique, morale et politique des Juifs* : il y démontre que ce qu’on reproche aux juifs de France — la pauvreté, le prêt, l’entre-soi — est le produit des lois qui les enferment, et qu’il suffirait de les faire citoyens pour que tout change. Élu en 1789 **député du clergé de Nancy**, il est l’un des premiers curés à quitter son ordre pour rejoindre le **Tiers état**, le 13 juin : geste minuscule en apparence, qui rend l’Assemblée nationale possible.',
      },
      {
        titre: 'Faire des juifs des citoyens',
        texte:
          'La question revient sans cesse devant la Constituante et recule chaque fois : les députés d’Alsace, où vit la plus grande partie des quarante mille juifs de France, s’y opposent. Grégoire plaide, publie, revient à la charge. Les juifs de Bordeaux et d’Avignon obtiennent la citoyenneté le **28 janvier 1790** ; ceux de l’Est l’obtiennent le **27 septembre 1791**, à l’avant-dernier jour de la Constituante. La France devient le **premier pays d’Europe** à donner l’égalité civile aux juifs. Grégoire y a mis trois ans, et il l’a fait **en prêtre** : non pas malgré sa foi, mais au nom d’un christianisme qui ne reconnaît qu’un seul genre humain. Le même argument lui sert pour les comédiens, les bourreaux, les protestants et les hommes de couleur libres — tous ceux qu’une loi tient à l’écart de la cité.',
      },
      {
        titre: 'L’esclavage : le 4 février 1794',
        texte:
          'Grégoire entre en **1788** à la **Société des amis des Noirs**, avec Condorcet, Brissot et La Fayette. Il commence par ce qui est possible : l’égalité politique des **libres de couleur**, obtenue le **4 avril 1792**. Il se bat ensuite sur le fond, contre le lobby colonial des planteurs et des ports négriers. À **Saint-Domingue**, l’insurrection des esclaves de **1791** a déjà tout changé sur le terrain, et les commissaires **Sonthonax** et **Polverel** y proclament l’abolition dès août 1793. Trois députés de la colonie — dont **Jean-Baptiste Belley**, né en Afrique et ancien esclave — arrivent à Paris. Le **16 pluviôse an II**, c’est-à-dire le **4 février 1794**, la Convention décrète l’abolition de l’esclavage dans toutes les colonies, debout et par acclamation : c’est la **première abolition** prononcée par un empire européen. **Bonaparte la défera le 20 mai 1802** ; il faudra attendre **1848** et **Victor Schœlcher** pour la seconde, définitive.',
      },
      {
        titre: '« Je reste évêque »',
        texte:
          'Élu **évêque constitutionnel de Loir-et-Cher** en 1791, puis **député à la Convention**, Grégoire propose lui-même l’**abolition de la royauté** le 21 septembre 1792. Mais il refuse la mort du roi : en mission en Savoie au moment du vote, il fait savoir qu’il se prononce pour la condamnation et **contre la peine capitale**. À l’automne **1793**, la **déchristianisation** bat son plein : on ferme les églises, on brise les statues, on presse les prêtres d’abdiquer publiquement. Le **7 novembre**, l’évêque de Paris, **Gobel**, vient déposer sa croix et son anneau à la Convention sous les applaudissements. On se tourne vers Grégoire. Il monte à la tribune en habit violet et refuse : il est catholique, il est prêtre, il reste évêque. On crie, on menace ; personne n’ose le toucher. Il traversera toute la Terreur sans être inquiété et sans se renier, et c’est lui qui obtiendra, en 1795, le rétablissement de la **liberté des cultes**.',
      },
      {
        titre: 'Le savant, le mot, la fin',
        texte:
          'Grégoire n’est pas seulement un homme de combats. Il fait créer le **Conservatoire national des arts et métiers** (1794) et le **Bureau des longitudes**, sauve les bibliothèques et les collections des couvents supprimés, et forge en 1794 le mot **vandalisme** pour désigner la destruction du patrimoine. Il fait voter la même année un rapport visant à faire disparaître les **patois** au profit du français : la même volonté d’égalité qui l’a fait défendre les juifs et les Noirs lui fait combattre les langues régionales, et c’est aujourd’hui ce qu’on lui reproche le plus. Sous l’Empire, il vote contre le **Consulat à vie**. Sous la Restauration, écarté des assemblées comme ancien conventionnel, il vit pauvre à Paris. Il meurt le **28 mai 1831** ; l’Église lui refuse les derniers sacrements s’il ne renie pas son serment, il refuse encore, et un prêtre l’absout tout de même. Vingt mille personnes suivent son convoi. Ses cendres entrent au **Panthéon** le **12 décembre 1989**, pour le bicentenaire de la Révolution.',
      },
    ],
    chrono: [
      { date: '4 décembre 1750', fait: 'Naissance à Vého, en Lorraine.' },
      { date: '1788', fait: '*Essai sur la régénération des juifs*, couronné à Metz.' },
      { date: '13 juin 1789', fait: 'Un des premiers curés à rejoindre le Tiers état.' },
      { date: '27 septembre 1791', fait: 'Les juifs de France deviennent citoyens.' },
      { date: '21 septembre 1792', fait: 'Il propose l’abolition de la royauté.' },
      { date: '7 novembre 1793', fait: 'Il refuse d’abdiquer sa charge d’évêque.' },
      { date: '4 février 1794', fait: 'La Convention abolit l’esclavage dans les colonies.' },
      { date: '1794', fait: 'Fondation du Conservatoire des arts et métiers.' },
      { date: '28 mai 1831', fait: 'Mort à Paris ; vingt mille personnes à son convoi.' },
      { date: '12 décembre 1989', fait: 'Ses cendres entrent au Panthéon.' },
    ],
    leSaisTu:
      'Le mot « vandalisme » est de lui. Il le forge en 1794, dans un rapport à la Convention, à partir des Vandales qui pillèrent Rome en 455, pour donner un nom à ce qu’il voyait faire aux églises et aux bibliothèques. Le mot est passé en anglais, en allemand, en espagnol. Il avait vu juste : nommer, c’était déjà arrêter.',
    aRetenir: [
      'L’abbé Grégoire obtient la citoyenneté des juifs de France par le décret du 27 septembre 1791.',
      'Membre des Amis des Noirs, il prépare l’abolition de l’esclavage votée le 4 février 1794.',
      'Le 7 novembre 1793, il refuse d’abdiquer sa charge d’évêque en pleine déchristianisation.',
      'Il fonde le Conservatoire national des arts et métiers et invente le mot « vandalisme » en 1794.',
      'Mort en 1831, il entre au Panthéon en 1989 pour le bicentenaire de la Révolution.',
    ],
    mots: [
      {
        mot: 'Déchristianisation',
        sens: 'Campagne de l’automne 1793 contre le culte catholique : églises fermées, prêtres poussés à abdiquer.',
      },
      {
        mot: 'Évêque constitutionnel',
        sens: 'Évêque élu par les citoyens selon la Constitution civile du clergé de 1790, et non nommé par Rome.',
      },
      {
        mot: 'Amis des Noirs',
        sens: 'Société fondée à Paris en 1788 pour obtenir la fin de la traite, puis celle de l’esclavage.',
      },
      {
        mot: 'Vandalisme',
        sens: 'Destruction volontaire d’œuvres et de monuments ; le mot est forgé par Grégoire en 1794.',
      },
    ],
    lies: ['toussaint-louverture', 'robespierre', 'lazare-carnot', 'danton'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Grégoire',
      'juifs',
      'esclavage',
      'abolition',
      'Amis des Noirs',
      'évêque constitutionnel',
      'déchristianisation',
      'vandalisme',
      'Panthéon',
      'Emberménil',
      'Lorraine',
    ],
  },
  {
    id: 'lazare-carnot',
    volet: 'personnages',
    nom: 'Lazare Carnot',
    surnom: 'l’organisateur de la victoire',
    dates: '1753 – 1823',
    tri: 1794,
    periode: 'revolution',
    emoji: '🗺️',
    roles: ['Officier du génie', 'Mathématicien', 'Membre du Comité de salut public'],
    origine: 'Nolay, Bourgogne',
    accroche:
      'Un officier du génie au Comité de salut public : il lève un peuple entier, met quatorze armées en ligne, et sauve la République par l’organisation.',
    citations: [
      {
        texte:
          'Dès ce moment, jusqu’à celui où les ennemis auront été chassés du territoire de la République, tous les Français sont en réquisition permanente pour le service des armées.',
        qui: 'Le décret de la levée en masse',
        contexte:
          'Décret voté par la Convention le 23 août 1793 : la première mobilisation totale d’une nation en Europe.',
      },
      {
        texte: 'Oserez-vous porter la main sur celui qui a organisé la victoire ?',
        qui: 'Un député de la Convention',
        contexte:
          'En mai 1795, quand on réclame l’arrestation de Carnot comme ancien membre du Comité de salut public. Le surnom lui est resté.',
      },
      {
        texte:
          'Tant que le succès a couronné vos entreprises, je me suis abstenu de vous offrir des services que je ne croyais pas vous être agréables ; aujourd’hui que la mauvaise fortune met votre gloire à l’épreuve, je n’hésite plus.',
        contexte:
          'Lettre à Napoléon, en janvier 1814, quand l’Europe marche sur la France. Il a soixante ans ; on lui confie la défense d’Anvers.',
      },
    ],
    reperes: [
      'Officier du génie sorti de l’école de Mézières, mathématicien, auteur d’un *Essai sur les machines en général*.',
      'Député du Pas-de-Calais ; entre au Comité de salut public le 14 août 1793, chargé de la guerre.',
      'La levée en masse du 23 août 1793 porte l’armée française à près de huit cent mille hommes.',
      'Il coordonne quatorze armées et combat lui-même en tête à Wattignies, en octobre 1793.',
      'Il vote contre l’Empire en 1804 ; banni comme régicide en 1816, il meurt en exil à Magdebourg.',
    ],
    recit: [
      {
        titre: 'Un ingénieur dans la Révolution',
        texte:
          'Lazare Carnot naît en **1753** à **Nolay**, en Bourgogne, dans une nombreuse famille de notaire. Il entre à l’école du **génie de Mézières**, la meilleure école scientifique du royaume, et en sort officier — l’une des rares carrières militaires ouvertes à un roturier, parce qu’elle demande des mathématiques et non des quartiers de noblesse. Avant 1789, il publie un *Éloge de Vauban* et un *Essai sur les machines en général* qui compte encore dans l’histoire de la mécanique. Élu **député du Pas-de-Calais** à la Législative puis à la Convention, il vote la mort du roi. Envoyé en mission aux armées du Nord et du Rhin, il y voit ce que personne ne voit depuis Paris : des troupes sans souliers, des généraux qui s’ignorent, des convois qui n’arrivent jamais, et des volontaires courageux que personne n’a jamais encadrés.',
      },
      {
        titre: 'La levée en masse',
        texte:
          'À l’été **1793**, la République est envahie de tous côtés : Autrichiens et Prussiens au nord et à l’est, Espagnols au sud, Anglais à Toulon et devant Dunkerque, la **Vendée** en guerre, soixante départements en révolte. Le **23 août 1793**, la Convention décrète la **levée en masse** : tous les hommes de dix-huit à vingt-cinq ans réquisitionnés, les autres au travail pour les armées, les femmes aux tentes et aux hôpitaux, les vieillards sur les places publiques pour soutenir le courage. C’est la première **mobilisation totale** d’une nation moderne. L’armée française passe de deux cent mille à près de **huit cent mille hommes** en un an — un chiffre que l’Europe des rois, qui aligne des armées de métier de cinquante mille hommes, ne peut pas égaler. Carnot, entré au **Comité de salut public** le **14 août 1793**, hérite du problème que ce nombre crée : nourrir, habiller, armer, encadrer et déplacer cette foule.',
      },
      {
        titre: 'Quatorze armées',
        texte:
          'Carnot travaille au pavillon de Flore avec des cartes, des états et une poignée de commis. Il crée le **Bureau topographique**, l’ancêtre des états-majors : on y centralise les renseignements, on y dessine les mouvements, on y rédige les ordres de **quatorze armées**. Il impose la fusion des vieux régiments de ligne et des bataillons de volontaires — l’**amalgame** —, adopte une tactique faite pour des soldats nombreux et mal formés (la colonne, la masse, l’assaut), et fait nommer les officiers sur leurs résultats et non sur leur âge : **Hoche** a vingt-cinq ans, **Marceau** vingt-quatre, **Jourdan** trente et un. Il ne reste pas au bureau : à **Wattignies**, les 15 et 16 octobre 1793, il prend un fusil et marche en tête d’un bataillon pour débloquer Maubeuge. Le 26 juin 1794, la victoire de **Fleurus** achève la guerre défensive : les frontières sont dégagées.',
      },
      {
        titre: 'Le survivant',
        texte:
          'Membre du Comité de salut public pendant toute la Terreur, Carnot n’a rédigé ni les décrets de Vendée ni la loi de prairial, mais il a signé des arrêtés comme les autres — et il s’est violemment opposé à **Saint-Just** sur la conduite des armées. Après **thermidor**, on réclame son arrestation ; un député lance la phrase qui lui restera comme un titre, et il est épargné. Directeur en **1795**, chassé par le coup d’État de fructidor en 1797, ministre de la Guerre de Bonaparte en 1800, il vote ensuite **contre le Consulat à vie** (1802) puis **contre l’Empire** (1804) — et se retire. En **1814**, à soixante ans, il redemande du service et défend **Anvers** jusqu’à l’abdication. Ministre de l’Intérieur pendant les **Cent-Jours**, il est banni en **1816** comme régicide et meurt à **Magdebourg**, en Prusse, en **1823**. Son fils Sadi fondera la thermodynamique ; son petit-fils du même nom sera président de la République. Ses cendres entrent au Panthéon en **1889**.',
      },
    ],
    chrono: [
      { date: '13 mai 1753', fait: 'Naissance à Nolay, en Bourgogne.' },
      { date: '1773', fait: 'Il sort officier de l’école du génie de Mézières.' },
      { date: '1791', fait: 'Député du Pas-de-Calais à l’Assemblée législative.' },
      { date: '14 août 1793', fait: 'Entre au Comité de salut public, chargé de la guerre.' },
      { date: '23 août 1793', fait: 'Décret de la levée en masse.' },
      { date: '16 octobre 1793', fait: 'Victoire de Wattignies, où il combat en personne.' },
      { date: '26 juin 1794', fait: 'Fleurus : les frontières sont dégagées.' },
      { date: '1795 – 1797', fait: 'Membre du Directoire, jusqu’au coup d’État de fructidor.' },
      { date: '1804', fait: 'Il vote contre l’établissement de l’Empire.' },
      { date: '1815', fait: 'Ministre de l’Intérieur pendant les Cent-Jours.' },
      { date: '2 août 1823', fait: 'Mort en exil à Magdebourg.' },
    ],
    leSaisTu:
      'Trois Carnot, trois célébrités. Lazare, l’organisateur de la victoire ; son fils Sadi, qui publie en 1824 les *Réflexions sur la puissance motrice du feu* et fonde la thermodynamique ; son petit-fils Sadi, président de la République, assassiné à Lyon en 1894. La même famille a donné un sauveur à la République, une loi à la physique et un président à la France.',
    aRetenir: [
      'Carnot entre au Comité de salut public le 14 août 1793 et y prend la conduite de la guerre.',
      'La levée en masse du 23 août 1793 est la première mobilisation totale d’une nation en Europe.',
      'Il organise quatorze armées et fait nommer des généraux jeunes, choisis sur leurs résultats.',
      'On l’appelle « l’organisateur de la victoire » depuis une séance de la Convention de mai 1795.',
      'Il vote contre l’Empire en 1804 et meurt en exil à Magdebourg en 1823.',
    ],
    mots: [
      {
        mot: 'Levée en masse',
        sens: 'Réquisition de tous les Français pour le service des armées, décrétée le 23 août 1793.',
      },
      {
        mot: 'Amalgame',
        sens: 'Fusion des régiments de l’ancienne armée royale et des bataillons de volontaires, à partir de 1793.',
      },
      {
        mot: 'Génie',
        sens: 'Arme des ingénieurs militaires : fortifications, ponts, sièges. Carnot en sort officier en 1773.',
      },
    ],
    lies: ['robespierre', 'danton', 'abbe-gregoire'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Carnot',
      'levée en masse',
      'organisateur de la victoire',
      'Comité de salut public',
      'Wattignies',
      'Fleurus',
      'quatorze armées',
      'génie',
      'Nolay',
      'Directoire',
      'Magdebourg',
    ],
  },
  {
    id: 'toussaint-louverture',
    volet: 'personnages',
    nom: 'Toussaint Louverture',
    surnom: 'le premier des Noirs',
    dates: 'vers 1743 – 1803',
    tri: 1803,
    periode: 'revolution',
    emoji: '🌳',
    roles: ['Ancien esclave', 'Général en chef de Saint-Domingue', 'Gouverneur'],
    origine: 'Habitation Bréda, Saint-Domingue',
    accroche:
      'Né esclave à Saint-Domingue, il devient général, gouverneur et législateur — et meurt dans un fort du Jura pour avoir voulu une île libre.',
    citations: [
      {
        texte:
          'En me renversant, on n’a abattu à Saint-Domingue que le tronc de l’arbre de la liberté des Noirs ; il repoussera par les racines, parce qu’elles sont profondes et nombreuses.',
        contexte:
          'Au Cap-Français, le 7 juin 1802, en montant sur le navire qui l’emmène prisonnier en France.',
      },
      {
        texte:
          'Je suis Toussaint Louverture ; mon nom s’est peut-être fait connaître jusqu’à vous. J’ai entrepris la vengeance de ma race. Je veux que la liberté et l’égalité règnent à Saint-Domingue.',
        contexte:
          'Proclamation du camp Turel, le 29 août 1793, quand il prend la tête de l’insurrection au nom de la liberté générale.',
      },
      {
        texte:
          'Nous avons su affronter les dangers pour obtenir notre liberté, nous saurons affronter la mort pour la conserver.',
        contexte:
          'Lettre au Directoire, le 5 novembre 1797, après qu’un député eut réclamé à Paris le rétablissement de l’esclavage.',
      },
      {
        texte: 'Du premier des Noirs au premier des Blancs.',
        contexte:
          'En-tête qu’on lui prête sur sa lettre au Premier consul Bonaparte, en 1801, accompagnant la constitution de Saint-Domingue.',
        sens:
          'Il s’y place d’égal à égal avec le maître de la France : ce ton, autant que la constitution, décide de l’expédition.',
        incertaine: true,
      },
    ],
    reperes: [
      'Né esclave vers 1743 sur l’habitation Bréda, près du Cap-Français ; affranchi vers 1776.',
      'Rejoint l’insurrection des esclaves du Nord, déclenchée dans la nuit du 22 août 1791.',
      'Rallie la République française après l’abolition de l’esclavage du 4 février 1794.',
      'Général en chef en 1797, il chasse les Anglais et les Espagnols et gouverne toute l’île en 1801.',
      'Arrêté par traîtrise le 7 juin 1802, il meurt au fort de Joux, dans le Doubs, le 7 avril 1803.',
    ],
    recit: [
      {
        titre: 'La plus riche colonie du monde',
        texte:
          'À la fin du XVIIIᵉ siècle, **Saint-Domingue** — la partie française de l’île d’Haïti — produit une grande part du **sucre** et du **café** consommés en Europe et enrichit Bordeaux, Nantes et Le Havre. Elle compte environ **30 000 Blancs**, **28 000 libres de couleur** et **500 000 esclaves**, renouvelés par une traite qui débarque des dizaines de milliers de captifs chaque année, parce qu’on ne survit guère plus de sept à dix ans sur une sucrerie. Le **Code noir** de 1685 règle les châtiments. C’est là que naît, vers **1743**, sur l’habitation **Bréda**, un enfant dont le père était un homme libre d’Allada, en Afrique, vendu comme captif. Il s’appelle Toussaint. Cocher, soigneur de chevaux, connaisseur des plantes, il apprend à lire et à écrire — ce qui est rare — et il est **affranchi vers 1776**, quinze ans avant la Révolution.',
      },
      {
        titre: '1791 : l’insurrection',
        texte:
          'La Révolution française arrive dans l’île par morceaux et allume tout : les colons veulent l’autonomie, les **libres de couleur** réclament l’égalité promise par la Déclaration des droits, les esclaves écoutent. Dans la nuit du **22 août 1791**, les ateliers du Nord se soulèvent ; en quelques semaines, un millier d’habitations brûlent. Toussaint, qui approche de la cinquantaine, n’est pas parmi les premiers chefs : il rejoint le mouvement et s’y impose par autre chose que la force — la discipline, la connaissance du terrain et l’art de négocier. Il prend alors le nom de **Louverture** : cet homme-là fait ouverture partout. En 1793, il sert un temps l’**Espagne**, qui arme les insurgés contre la France. Puis Paris abolit l’esclavage, le **4 février 1794**. Toussaint change de camp : il se bat désormais pour la République qui vient de faire de lui, et de tous les siens, des citoyens français.',
      },
      {
        titre: 'Gouverner une île',
        texte:
          'En cinq ans, Toussaint devient le maître de Saint-Domingue. Il chasse les **Espagnols**, puis les **Anglais** débarqués en 1793, qui rembarquent en **1798** après avoir perdu des dizaines de milliers d’hommes, surtout de la fièvre jaune. Il écrase en 1800 son rival **Rigaud**, chef des libres de couleur du Sud. Général en chef, il gouverne : il rappelle les colons blancs pour relancer la production, impose aux anciens esclaves un travail contraint mais **salarié** sur les plantations — ce qu’on lui a le plus reproché, et qui rétablit les récoltes —, signe des accords commerciaux avec les États-Unis et l’Angleterre, et occupe en janvier **1801** la partie espagnole de l’île. Le **8 juillet 1801**, il promulgue une **constitution** : l’esclavage y est aboli à jamais, tous les hommes y naissent libres et français, et Toussaint est nommé **gouverneur à vie** avec le droit de désigner son successeur. Il l’envoie à Paris pour information, non pour approbation.',
      },
      {
        titre: 'Le fort de Joux',
        texte:
          '**Bonaparte**, Premier consul depuis 1799, y lit une sécession. Il arme la plus grande expédition jamais envoyée outre-mer : **20 000 hommes** sous les ordres de son beau-frère **Leclerc**, débarqués en février **1802**. La guerre est féroce des deux côtés. Toussaint résiste trois mois, puis traite et se retire sur ses terres. Le **7 juin 1802**, le général Brunet l’attire à un rendez-vous et le fait arrêter : c’est un guet-apens. Embarqué avec sa famille, il est enfermé seul au **fort de Joux**, dans le Doubs, à mille mètres d’altitude, dans une cellule froide et humide. On lui retire son domestique, puis son argent, puis son médecin. Il écrit un mémoire à Bonaparte, qui reste sans réponse. Il y meurt le **7 avril 1803**, d’une pneumonie, à soixante ans. Le **20 mai 1802**, pendant sa captivité, Bonaparte avait **rétabli l’esclavage** dans les colonies.',
      },
      {
        titre: 'L’arbre a repoussé',
        texte:
          'La phrase qu’il avait lancée en montant à bord s’est vérifiée en vingt mois. Le rétablissement de l’esclavage et la mort de Toussaint soulèvent l’île entière : **Dessalines** et **Christophe**, ses anciens lieutenants, reprennent la guerre et écrasent les Français à **Vertières** le 18 novembre 1803. Le **1er janvier 1804**, l’indépendance est proclamée sous le nom indien de l’île : **Haïti**. C’est la **première république noire** du monde, et la seule nation née d’une révolte d’esclaves victorieuse. Le prix en sera lourd : la France exigera en **1825** une « indemnité » de 150 millions de francs-or pour reconnaître le nouvel État — une dette qui pèsera sur Haïti pendant plus d’un siècle. Toussaint, lui, n’a jamais vu l’indépendance : il voulait une Saint-Domingue libre **dans** la République française. C’est la France qui a rendu ce projet impossible.',
      },
    ],
    chrono: [
      { date: 'vers 1743', fait: 'Naissance sur l’habitation Bréda, près du Cap-Français.' },
      { date: 'vers 1776', fait: 'Affranchissement : il devient un homme libre.' },
      { date: '22 août 1791', fait: 'Insurrection des esclaves du Nord de Saint-Domingue.' },
      { date: '4 février 1794', fait: 'La Convention abolit l’esclavage ; il rallie la France.' },
      { date: '1798', fait: 'Départ des Anglais ; il est maître du Nord et de l’Ouest.' },
      { date: '8 juillet 1801', fait: 'Constitution de Saint-Domingue : gouverneur à vie.' },
      { date: 'février 1802', fait: 'Débarquement de l’expédition Leclerc.' },
      { date: '7 juin 1802', fait: 'Arrêté par traîtrise et déporté en France.' },
      { date: '7 avril 1803', fait: 'Mort au fort de Joux, dans le Doubs.' },
      { date: '1er janvier 1804', fait: 'Indépendance d’Haïti proclamée par Dessalines.' },
    ],
    leSaisTu:
      'Au fort de Joux, sa cellule se visite encore : une chambre voûtée à mille mètres d’altitude, où il fait froid jusqu’en juin. Toussaint y écrivit un mémoire de plusieurs dizaines de pages pour réclamer un jugement. Personne ne lui répondit. Il fut enterré sur place, et l’on ne sait plus aujourd’hui où sont ses restes.',
    aRetenir: [
      'Toussaint Louverture, né esclave vers 1743 à Saint-Domingue, est affranchi vers 1776.',
      'Il rejoint l’insurrection de 1791 puis rallie la France après l’abolition du 4 février 1794.',
      'Sa constitution du 8 juillet 1801 abolit l’esclavage à jamais et le fait gouverneur à vie.',
      'Arrêté sur ordre de Bonaparte en 1802, il meurt au fort de Joux le 7 avril 1803.',
      'Bonaparte rétablit l’esclavage le 20 mai 1802 ; Haïti proclame son indépendance le 1er janvier 1804.',
    ],
    mots: [
      {
        mot: 'Habitation',
        sens: 'Nom donné aux plantations des Antilles — sucre, café, indigo — exploitées par des esclaves.',
      },
      {
        mot: 'Code noir',
        sens: 'Recueil d’ordonnances de 1685 réglant l’esclavage dans les colonies françaises.',
      },
      {
        mot: 'Libres de couleur',
        sens: 'Descendants d’esclaves affranchis, souvent propriétaires, privés d’égalité politique jusqu’en 1792.',
      },
      {
        mot: 'Affranchissement',
        sens: 'Acte par lequel un maître rend la liberté à un esclave.',
      },
    ],
    lies: ['abbe-gregoire', 'robespierre', 'lazare-carnot', 'simon-bolivar'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Toussaint',
      'Louverture',
      'Saint-Domingue',
      'Haïti',
      'esclavage',
      'abolition',
      'fort de Joux',
      'Bonaparte',
      'Dessalines',
      'Bréda',
      'Code noir',
    ],
  },
]
