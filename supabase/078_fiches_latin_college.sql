-- =============================================================================
-- Studuel — Migration 078 : fiches de révision Latin collège (5e · 4e · 3e)
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
    ('latin', '5e', 'Premiers pas : les déclinaisons', $md$# Premiers pas : les déclinaisons — l'essentiel

**À retenir**
- En latin, la **fonction** d'un mot ne dépend pas de sa place mais de sa **terminaison** (le cas).
- Il y a **cinq déclinaisons**, classées d'après la terminaison du génitif singulier.
- Les cas de base : **nominatif** = sujet, **accusatif** = COD, **génitif** = complément du nom (« de »), **datif** = COI (« à »), **ablatif** = complément circonstanciel.

**Grammaire**
- 1re déclinaison (féminins en -a) : *rosa* (la rose au nominatif), *rosae* (de la rose au génitif). C'est le modèle qui donne les terminaisons -a, -ae, -am, -ae, -a.
- On apprend un nom sous deux formes : le nominatif et le génitif (*rosa, rosae*).

**Exemple**
> *Rosa* est sujet : « la rose ». *Rosam* est COD : « (je vois) la rose ».

**Erreur classique**
- Traduire selon l'ordre des mots comme en français. En latin, c'est la **terminaison** qui donne la fonction, pas la position.$md$),

    ('latin', '5e', 'La vie quotidienne à Rome', $md$# La vie quotidienne à Rome — l'essentiel

**À retenir**
- Le Romain habite la *domus* (maison privée) ou l'*insula* (immeuble populaire) ; le cœur de la maison est l'*atrium*.
- La journée est rythmée par le *forum* (place publique), les *thermae* (thermes) et les repas.
- La famille est dirigée par le *pater familias*, qui a autorité sur tous les siens.

**Vocabulaire**
- *domus* = la maison ; *familia* = la maisonnée (parents, enfants, esclaves) ; *servus* = l'esclave ; *cena* = le repas du soir.
- La *toga* est le vêtement du citoyen ; la *tunica* se porte en dessous.

**Exemple**
> *Pater familias in atrio est.* → « Le père de famille est dans l'atrium. »

**Erreur classique**
- Croire que *familia* ne désigne que les parents et les enfants : en latin, elle inclut aussi les esclaves de la maison.$md$),

    ('latin', '5e', 'La fondation de Rome', $md$# La fondation de Rome — l'essentiel

**À retenir**
- Selon la légende, Rome est fondée en **753 av. J.-C.** par **Romulus**.
- Romulus et Rémus, jumeaux abandonnés, sont sauvés et allaités par une **louve** (*lupa*).
- Après une dispute, Romulus tue Rémus et donne son nom à la ville : *Roma*.

**Repères**
- Les jumeaux sont fils de Rhéa Silvia et du dieu Mars.
- La légende se relie à Énée, héros troyen ancêtre des Romains (fil rouge avec l'*Énéide*).
- On distingue la **légende** (récit) de l'**histoire** (traces réelles du VIIIe siècle av. J.-C.).

**Exemple**
> *Romulus urbem condidit.* → « Romulus fonda la ville. » (*urbs* = la ville ; *condere* = fonder)

**Erreur classique**
- Confondre av. J.-C. et apr. J.-C. : 753 av. J.-C., plus le nombre est grand, plus c'est **ancien**.$md$),

    ('latin', '4e', 'Les verbes : temps du récit', $md$# Les verbes : temps du récit — l'essentiel

**À retenir**
- Pour raconter, le latin utilise surtout l'**imparfait** (action qui dure ou se répète) et le **parfait** (action achevée, ponctuelle).
- Le verbe se conjugue avec des **terminaisons personnelles** : -o/-m, -s, -t, -mus, -tis, -nt.
- On apprend un verbe par ses temps primitifs, ex. *amo, amare, amavi, amatum* (aimer).

**Grammaire**
- Imparfait de *amare* : *amabam* (« j'aimais »), marque -ba-.
- Parfait de *amare* : *amavi* (« j'ai aimé / j'aimai »), radical du parfait *amav-*.

**Exemple**
> *Romani pugnabant, deinde vicerunt.* → « Les Romains combattaient, puis ils vainquirent. » (imparfait qui dure, puis parfait qui conclut)

**Erreur classique**
- Traduire tout parfait par un passé composé : selon le récit, *amavi* peut se rendre par un passé simple (« j'aimai »).$md$),

    ('latin', '4e', 'La société romaine', $md$# La société romaine — l'essentiel

**À retenir**
- La société se divise entre **patriciens** (grandes familles, *patricii*) et **plébéiens** (le peuple, *plebs*).
- Les **citoyens** (*cives*) ont des droits ; les **esclaves** (*servi*) n'en ont pas, mais peuvent être affranchis.
- Le système du *clientélisme* lie un *patronus* (protecteur) à ses *clientes* (protégés).

**Repères**
- Sous la République, le pouvoir est partagé entre le **Sénat** (*senatus*), les magistrats (*consules*) et le peuple.
- La devise **S.P.Q.R.** = *Senatus Populusque Romanus*, « le Sénat et le peuple romain ».

**Exemple**
> *Senatus populusque Romanus* → « le Sénat et le peuple romain » (le *-que* accolé signifie « et »).

**Erreur classique**
- Croire que tous les habitants de Rome sont citoyens : esclaves, femmes et étrangers n'ont pas la pleine citoyenneté.$md$),

    ('latin', '4e', 'Mythes et héros', $md$# Mythes et héros — l'essentiel

**À retenir**
- Les Romains reprennent la mythologie grecque en renommant les dieux : Zeus → **Jupiter**, Héra → **Junon**, Arès → **Mars**.
- Les héros affrontent des épreuves qui illustrent une **valeur** (courage, ruse, piété).
- *Énée* (*Aeneas*), héros troyen, est présenté comme l'ancêtre légendaire des Romains.

**Repères**
- Principaux dieux : *Iuppiter* (roi des dieux), *Iuno* (mariage), *Minerva* (sagesse), *Venus* (amour), *Neptunus* (mer).
- Hercule (*Hercules*) et ses douze travaux incarnent la force au service des hommes.

**Exemple**
> *Aeneas patrem servavit.* → « Énée sauva son père. » (la *pietas*, respect de la famille et des dieux)

**Erreur classique**
- Croire que dieux grecs et romains sont totalement différents : ce sont souvent les **mêmes figures** sous d'autres noms.$md$),

    ('latin', '3e', 'Rhétorique et citoyenneté', $md$# Rhétorique et citoyenneté — l'essentiel

**À retenir**
- La **rhétorique** est l'art de bien parler pour convaincre, essentielle à la vie politique romaine.
- Un discours suit un plan : *exordium* (introduction), *narratio* (les faits), *argumentatio* (les preuves), *peroratio* (conclusion).
- **Cicéron** (*Cicero*) est le plus grand orateur romain ; ses discours sont des modèles.

**Repères**
- Le citoyen s'exprime au *forum* et vote ; parler en public est une compétence civique.
- Trois moyens de persuasion : convaincre par la raison, émouvoir, et inspirer confiance par sa morale.

**Exemple**
> *Quousque tandem abutere, Catilina, patientia nostra ?* → « Jusqu'à quand, Catilina, abuseras-tu de notre patience ? » (célèbre attaque de Cicéron)

**Erreur classique**
- Confondre convaincre (par des arguments logiques) et persuader (en jouant sur les émotions) : un bon orateur fait les deux.$md$),

    ('latin', '3e', 'L''Empire romain', $md$# L'Empire romain — l'essentiel

**À retenir**
- En **27 av. J.-C.**, **Auguste** (*Augustus*) devient le premier **empereur** : c'est la fin de la République.
- L'Empire apporte la *Pax Romana*, une longue période de paix et de prospérité.
- L'Empire s'étend autour de la *Mare Nostrum* (la Méditerranée) grâce aux routes, à l'armée (*legiones*) et au droit romain.

**Repères**
- L'*imperator* détient le pouvoir militaire et politique ; le Sénat perd son rôle réel.
- Rome romanise les provinces : langue latine, villes, thermes, aqueducs, amphithéâtres.

**Exemple**
> *Augustus imperium tenebat.* → « Auguste détenait le pouvoir. » (*imperium* = le pouvoir de commander)

**Erreur classique**
- Confondre **République** (dirigée par le Sénat et des magistrats élus) et **Empire** (dirigé par un empereur unique).$md$),

    ('latin', '3e', 'Traduire des textes authentiques', $md$# Traduire des textes authentiques — l'essentiel

**À retenir**
- On traduit en repérant d'abord le **verbe**, puis le **sujet** (nominatif), puis les compléments d'après leur cas.
- Un mot latin peut avoir plusieurs sens : on choisit celui qui convient au **contexte**.
- Une bonne traduction respecte le **sens** et produit un français **correct**, pas du mot-à-mot.

**Repères**
- Méthode : 1) je repère la ponctuation et les verbes ; 2) j'identifie sujet et COD par leurs cas ; 3) je traduis groupe par groupe ; 4) je relis en français.
- Les petits mots (*et*, *sed* = mais, *non* = ne… pas, *cum* = avec/lorsque) structurent la phrase.

**Exemple**
> *Puella rosam amat.* → verbe *amat* (aime), sujet *puella* (nominatif : la jeune fille), COD *rosam* (accusatif : la rose) → « La jeune fille aime la rose. »

**Erreur classique**
- Traduire dans l'ordre des mots latins : il faut d'abord identifier les **cas**, puis remettre dans l'ordre du français.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
