-- =============================================================================
-- Studuel — Migration 065 : fiches de révision Français lycée (2de · 1re)
-- Remplit/enrichit lessons.revision_sheet (support « Révision ») pour la leçon
-- « L'essentiel du cours » de chaque chapitre — remplace le placeholder générique
-- posé par 025 par du contenu réel.
--
-- Motif : UPDATE joint sur la clé naturelle (slug, niveau, chapitre, leçon),
-- garde `IS DISTINCT FROM` → réexécutable sans effet de bord. Contenu en
-- dollar-quoting ($md$…$md$) pour éviter l'échappement des apostrophes.
--
-- Pour lister ce qu'il reste à écrire :
--   SELECT s.slug, c.level, c.title, l.title
--     FROM public.lessons l
--     JOIN public.chapters c ON c.id = l.chapter_id
--     JOIN public.subjects s ON s.id = c.subject_id
--    WHERE l.revision_sheet IS NULL
--    ORDER BY s.slug, c.level, c.position, l.position;
--
-- PRÉREQUIS : 008 (subjects/chapters/lessons), 025 (colonne revision_sheet).
-- Idempotent.
-- =============================================================================

UPDATE public.lessons l
   SET revision_sheet = v.md
  FROM (VALUES
    ('francais', '2de', 'Le roman et le récit', $md$# Le roman et le récit — l'essentiel

**À retenir**
- Le **roman** est un récit de fiction en prose : il met en scène des **personnages** dans une **intrigue** et un cadre spatio-temporel.
- Le **narrateur** n'est pas l'auteur : il peut être **interne** (« je », personnage), **externe** ou **omniscient** (il sait tout).
- Grands mouvements : **réalisme** (Balzac, Flaubert) et **naturalisme** (Zola) au XIXe, qui peignent la société avec exactitude.

**Repères : les points de vue (focalisations)**
- **Focalisation zéro** : le narrateur sait tout, voit dans les consciences.
- **Focalisation interne** : on ne sait que ce que sait un personnage.
- **Focalisation externe** : le narrateur voit comme une caméra, sans accès aux pensées.

**Exemple**
> Dans *L'Assommoir* (1877), Zola suit Gervaise pour montrer le déterminisme social : le milieu écrase l'individu, principe clé du naturalisme.

**Erreur classique**
- Confondre **auteur** et **narrateur**. Même quand le récit dit « je », le narrateur reste une construction de l'auteur.$md$),

    ('francais', '2de', 'La poésie du Moyen Âge au XVIIIe', $md$# La poésie du Moyen Âge au XVIIIe — l'essentiel

**À retenir**
- La poésie travaille le **rythme**, les **sonorités** et les **images** ; longtemps liée à la **versification** (mètre, rime, strophe).
- Le **sonnet** (14 vers : 2 quatrains + 2 tercets) domine la Renaissance avec la **Pléiade** (Ronsard, Du Bellay).
- Le **lyrisme** exprime les sentiments personnels (amour, fuite du temps) ; le motif du *carpe diem* invite à cueillir l'instant.

**Repères : compter un vers**
1. Je compte les **syllabes** prononcées (le **e** muet compte sauf en fin de vers ou devant voyelle).
2. Un vers de 12 syllabes = **alexandrin**, de 10 = **décasyllabe**, de 8 = **octosyllabe**.

**Exemple**
> « Mignonne, allons voir si la rose… » : Ronsard file la métaphore de la rose pour dire la fragilité de la beauté (*carpe diem*).

**Erreur classique**
- Oublier de prononcer le **e** en milieu de vers, ce qui fausse le décompte des syllabes et le repérage de l'alexandrin.$md$),

    ('francais', '2de', 'Le théâtre du XVIIe au XXIe', $md$# Le théâtre du XVIIe au XXIe — l'essentiel

**À retenir**
- Le texte de théâtre est fait pour être **joué** : **répliques**, **didascalies** (indications de jeu), **actes** et **scènes**.
- Au XVIIe, le **classicisme** impose la **règle des trois unités** (action, lieu, temps) et la **bienséance**.
- Deux genres majeurs : la **tragédie** (Racine, Corneille) et la **comédie** (Molière), qui « corrige les mœurs par le rire ».

**Repères : la double énonciation**
- Un personnage parle à un autre **et** au public en même temps.
- Cas particuliers : l'**aparté** (entendu du seul spectateur) et le **monologue** (personnage seul qui dévoile ses pensées).

**Exemple**
> Dans *Dom Juan* (1665), Molière fait du valet Sganarelle le double comique et critique de son maître libertin.

**Erreur classique**
- Traiter les **didascalies** comme du décor négligeable : elles portent le sens (ton, geste, espace) et se commentent.$md$),

    ('francais', '2de', 'La littérature d''idées et la presse', $md$# La littérature d'idées et la presse — l'essentiel

**À retenir**
- La **littérature d'idées** défend une thèse et cherche à **convaincre** (raison, arguments logiques) ou à **persuader** (émotions, images).
- Genres : **essai**, **apologue** (fable, conte philosophique), **article**, **pamphlet**, **discours**.
- Aux XVIe–XVIIIe siècles, l'**humanisme** puis les **Lumières** (Voltaire, Diderot, Montesquieu) combattent l'ignorance et le fanatisme.

**Repères : convaincre / persuader / délibérer**
- **Convaincre** : preuves et raisonnement (thèse, arguments, exemples).
- **Persuader** : registre pathétique ou ironique, adresse au lecteur.
- Repérer aussi la **thèse réfutée** (adverse) et la **thèse défendue**.

**Exemple**
> Dans *Candide* (1759), Voltaire use de l'**ironie** : en feignant l'optimisme (« tout est pour le mieux »), il dénonce le mal et la guerre.

**Erreur classique**
- Confondre **ironie** (dire le contraire de ce qu'on pense pour critiquer) et simple humour : l'ironie vise toujours une cible.$md$),

    ('francais', '2de', 'Méthode du commentaire', $md$# Méthode du commentaire — l'essentiel

**À retenir**
- Le **commentaire** est une explication **organisée et rédigée** d'un texte : on montre **comment** il produit du sens, sans le paraphraser.
- Chaque idée s'appuie sur une **citation** précise et l'analyse d'un **procédé** (figure de style, énonciation, rythme).
- Le devoir suit un plan en **2 ou 3 axes**, chacun avec des **sous-parties**, encadré par une introduction et une conclusion.

**Méthode : construire le commentaire**
1. **Lire** et repérer : genre, registre, mouvement, procédés marquants.
2. **Dégager des axes** de lecture (des interprétations, pas des thèmes plats).
3. **Rédiger** chaque paragraphe : idée → citation → analyse du procédé → interprétation.
4. **Introduction** (situer, présenter le texte, problématique, annonce du plan) et **conclusion** (bilan + ouverture).

**Exemple**
> Axe : « une nature menaçante ». Citation : « la mer hurlait ». Procédé : personnification. Interprétation : la nature devient un personnage hostile.

**Erreur classique**
- **Paraphraser** : redire le texte en plus long. Le commentaire analyse les **procédés** et leur **effet**, il ne raconte pas.$md$),

    ('francais', '1re', 'La poésie du XIXe au XXIe siècle', $md$# La poésie du XIXe au XXIe siècle — l'essentiel

**À retenir**
- Le **romantisme** (Hugo, Lamartine) exalte le moi et la nature ; le **symbolisme** (Baudelaire, Rimbaud, Verlaine) suggère par les images et la musicalité.
- La modernité libère la forme : **vers libre**, **poème en prose**, puis le **surréalisme** (Apollinaire, Éluard) et son **écriture automatique**.
- La poésie transforme le réel : « faire de la boue de l'or », dit Baudelaire à propos des *Fleurs du mal*.

**Repères : figures d'analogie**
- **Comparaison** : deux termes reliés par un outil (« comme », « tel »).
- **Métaphore** : analogie sans outil de comparaison.
- **Personnification** et **allégorie** : donner vie ou incarner une idée abstraite.

**Exemple**
> Dans « Correspondances » (Baudelaire), les **synesthésies** (« parfums frais comme des chairs d'enfants ») mêlent les sensations et unissent le monde.

**Erreur classique**
- Réduire une image à sa surface. Une métaphore se **commente** : que rapproche-t-elle, quel effet crée-t-elle sur la vision du réel ?$md$),

    ('francais', '1re', 'Le roman : parcours bac', $md$# Le roman : parcours bac — l'essentiel

**À retenir**
- Au bac, le roman est étudié en lien avec un **parcours** (ex. « le personnage de roman, esthétique et valeurs »).
- Le **personnage** peut être un **héros** valorisé ou un **anti-héros** ordinaire, voire médiocre ; il porte une vision du monde.
- Maîtriser l'**œuvre intégrale** : intrigue, personnages, structure, contexte et enjeux du parcours associé.

**Repères : rythme du récit**
- **Sommaire** (on résume vite), **scène** (temps réel, dialogue), **ellipse** (on saute du temps), **pause** (description).
- Ces variations créent le **rythme** de la narration et orientent la lecture.

**Exemple**
> Dans *Le Rouge et le Noir* (Stendhal), Julien Sorel, ambitieux d'origine modeste, illustre l'énergie et les contradictions d'un héros face à la société.

**Erreur classique**
- Raconter l'histoire au lieu d'**analyser** : au bac on interroge le personnage comme construction (procédés, valeurs, place dans le parcours).$md$),

    ('francais', '1re', 'Le théâtre : parcours bac', $md$# Le théâtre : parcours bac — l'essentiel

**À retenir**
- L'œuvre théâtrale est reliée à un **parcours** (ex. « théâtre et stratagème », « spectacle et comédie »).
- Distinguer **texte** et **représentation** : la **mise en scène** (décor, jeu, lumière) interprète et actualise l'œuvre.
- Registres à repérer : **tragique**, **comique**, **pathétique**, **ironique**, souvent mêlés (drame romantique, farce).

**Repères : ressorts de l'action**
- **Nœud** (crise), **péripéties**, **coup de théâtre**, **dénouement**.
- Le **quiproquo** et le **stratagème** (ruse d'un personnage) relancent souvent l'intrigue comique.

**Exemple**
> Dans *Le Mariage de Figaro* (Beaumarchais), les stratagèmes de Figaro contre le Comte portent une critique sociale sous le rire.

**Erreur classique**
- Oublier la dimension **scénique** : au bac, on peut proposer des **choix de mise en scène** justifiés, pas seulement lire le texte.$md$),

    ('francais', '1re', 'La littérature d''idées', $md$# La littérature d'idées — l'essentiel

**À retenir**
- Au bac, la littérature d'idées se rattache à un **parcours** portant sur une question de société ou de morale (ex. « notre monde vient d'en trouver un autre »).
- Elle argumente de façon **directe** (essai, discours) ou **indirecte** (apologue, fable, utopie) pour faire réfléchir.
- Les **Lumières** engagent la raison contre les préjugés ; l'humanisme et les moralistes interrogent l'homme et ses mœurs.

**Repères : l'argumentation indirecte**
- L'**apologue** délivre une **morale** à travers une fiction plaisante.
- L'**utopie** et la **satire** critiquent le présent en le déplaçant (ailleurs, animaux, étrangers).

**Exemple**
> Dans *De l'esclavage des nègres* (Montesquieu, *L'Esprit des lois*), l'**ironie** feint de justifier l'esclavage pour mieux en montrer l'absurdité.

**Erreur classique**
- Prendre l'ironie au premier degré et croire que l'auteur défend la thèse qu'il **feint** de soutenir : il la dénonce.$md$),

    ('francais', '1re', 'Dissertation et oral du bac', $md$# Dissertation et oral du bac — l'essentiel

**À retenir**
- La **dissertation** (sur œuvre) répond à une question par un **raisonnement organisé** appuyé sur l'œuvre et le parcours.
- L'**oral** comporte l'**explication linéaire** d'un texte, une **question de grammaire**, puis la **présentation d'une œuvre** choisie et l'entretien.
- Un plan solide : **thèse / antithèse / synthèse** (dialectique) ou plan **par aspects**, toujours au service de la problématique.

**Méthode : bâtir la dissertation**
1. **Analyser le sujet** : mots-clés, présupposés, reformuler la **problématique**.
2. **Chercher des exemples** précis dans l'œuvre et le parcours.
3. **Construire le plan** (2-3 parties, sous-parties argumentées).
4. **Rédiger** : introduction (accroche, sujet, problématique, annonce), développement lié par des **transitions**, conclusion (bilan + ouverture).

**Exemple**
> Sujet : « Le personnage de roman doit-il être un héros admirable ? » → I. Le héros exemplaire ; II. L'intérêt de l'anti-héros ; III. Ce que le lecteur y gagne.

**Erreur classique**
- Réciter le cours ou juxtaposer des exemples sans **répondre à la question** : chaque partie doit faire avancer la démonstration.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
