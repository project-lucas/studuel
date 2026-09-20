-- =============================================================================
-- Studuel — Migration 072 : fiches de révision Philosophie Terminale
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
    ('philosophie', 'Tle', 'La conscience et l''inconscient', $md$# La conscience et l'inconscient — l'essentiel

**À retenir**
- La **conscience** est la présence à soi et au monde ; distinguer conscience **immédiate** (spontanée, perception) et **réfléchie** (retour de la pensée sur elle-même).
- L'**inconscient psychique** (Freud) désigne des désirs refoulés qui agissent à notre insu — à ne pas confondre avec le simple non-conscient (fonctions corporelles).
- Enjeu : suis-je transparent à moi-même ? La conscience me rend-elle maître de mes pensées, ou une part m'échappe-t-elle ?
- Distinction clé : **sujet** (celui qui dit « je ») vs **moi** traversé de forces qu'il ne contrôle pas.

**Repères / Auteurs**
- **Descartes** : le cogito, « je pense, donc je suis » — la conscience de penser est la première certitude, indubitable.
- **Freud** : l'hypothèse de l'inconscient explique lapsus, rêves et actes manqués ; « le moi n'est pas maître dans sa propre maison ».
- **Sartre** critique l'inconscient freudien : la « mauvaise foi » est une fuite consciente, non un mécanisme caché.

**Exemple**
> Un lapsus (« Je déclare la séance ouverte » pour la clôturer) trahit, selon Freud, un désir refoulé qui force le passage.

**Erreur classique**
- Croire que l'inconscient « pense » comme une seconde conscience cachée : c'est un système de forces (pulsions, refoulement), pas un petit sujet intérieur.$md$),

    ('philosophie', 'Tle', 'La liberté', $md$# La liberté — l'essentiel

**À retenir**
- Distinguer **liberté d'indifférence** (pouvoir de choisir sans motif), **libre arbitre** (choix éclairé par la raison) et **liberté civile** (droits garantis par la loi).
- Le **déterminisme** affirme que tout événement a une cause ; il semble menacer la liberté, mais on peut être libre *avec* des causes (Spinoza, Kant).
- Être libre n'est pas faire n'importe quoi : la liberté suppose la **responsabilité** et souvent l'obéissance à une loi qu'on se donne (autonomie).
- Enjeu : la liberté est-elle une illusion, une donnée, ou une conquête ?

**Repères / Auteurs**
- **Sartre** : « l'existence précède l'essence », l'homme est « condamné à être libre » — il n'y a pas de nature humaine qui le déterminerait, il se choisit.
- **Spinoza** : le libre arbitre est une illusion née de l'ignorance des causes ; la vraie liberté est la connaissance de la nécessité.
- **Kant** : la liberté est **autonomie**, se donner à soi-même sa loi morale par la raison, s'opposant à l'**hétéronomie** des désirs.

**Exemple**
> La pierre qui tombe, dit Spinoza, se croirait libre si elle avait conscience de son mouvement mais ignorait ce qui le cause.

**Erreur classique**
- Confondre liberté et absence de contrainte totale : sans loi ni raison, on obéit à ses pulsions — c'est de la servitude, pas de la liberté.$md$),

    ('philosophie', 'Tle', 'Le bonheur', $md$# Le bonheur — l'essentiel

**À retenir**
- Le **bonheur** est un état de satisfaction durable et complet — à distinguer du **plaisir** (ponctuel, sensible) et de la **joie** (intense mais passagère).
- Débat central : le bonheur est-il dans la **recherche du plaisir** ou dans la **vertu** et l'usage de la raison ?
- L'**hédonisme** raisonné (Épicure) ne prône pas la débauche mais l'absence de troubles (**ataraxie**) et le tri des désirs.
- Enjeu : le bonheur est-il une fin accessible, un idéal de l'imagination, ou faut-il y renoncer au profit du devoir ?

**Repères / Auteurs**
- **Épicure** : distinguer désirs **naturels et nécessaires** (à satisfaire), naturels non nécessaires, et vains ; viser l'ataraxie, absence de trouble du corps et de l'âme.
- **Aristote** : le bonheur (*eudaimonia*) est le souverain bien, activité de l'âme conforme à la **vertu** et à la raison, sur une vie entière.
- **Kant** : le bonheur est un « idéal de l'imagination », trop indéterminé pour fonder la morale ; le devoir prime sur la recherche du bonheur.

**Exemple**
> Épicure boit de l'eau et se contente de pain : maîtriser ses désirs supprime la crainte de manquer, source du vrai contentement.

**Erreur classique**
- Réduire l'épicurisme à la jouissance sans limite : Épicure prône au contraire la sobriété et le calcul des plaisirs.$md$),

    ('philosophie', 'Tle', 'La justice et le droit', $md$# La justice et le droit — l'essentiel

**À retenir**
- Distinguer le **droit positif** (lois écrites, en vigueur dans un État) et le **droit naturel** (principes universels supposés antérieurs aux lois).
- La **justice** comme vertu (donner à chacun son dû) diffère de la justice comme conformité à la loi (le légal n'est pas toujours le légitime).
- Aristote distingue la justice **distributive** (répartir biens et honneurs selon le mérite, égalité *proportionnelle*) et la justice **commutative** (égalité *arithmétique* dans les échanges et réparations).
- Enjeu : une loi injuste reste-t-elle un droit ? Faut-il obéir à toute loi ?

**Repères / Auteurs**
- **Aristote** : la justice distributive répartit selon le mérite ; la justice commutative rétablit l'égalité dans les contrats et les dommages.
- **Hobbes** : sans État (« l'homme est un loup pour l'homme »), pas de justice ; le droit naît du contrat qui institue le souverain garant de la paix.
- **Rousseau** : le droit légitime repose sur le **contrat social** et la volonté générale, non sur la force — « la force ne fait pas droit ».

**Exemple**
> À travail égal, salaire égal relève de la justice commutative ; répartir des bourses selon les résultats relève de la justice distributive.

**Erreur classique**
- Confondre légal et légitime : une loi peut être en vigueur (légale) tout en étant injuste (illégitime), comme les lois esclavagistes.$md$),

    ('philosophie', 'Tle', 'La vérité et la raison', $md$# La vérité et la raison — l'essentiel

**À retenir**
- La **vérité** qualifie un jugement (une proposition), pas une chose : le vrai est ce qui s'accorde avec son objet — c'est la vérité-**correspondance** (adéquation de l'esprit et de la chose).
- Distinguer **vérité** (rapport au réel) et **certitude** (état subjectif de conviction) : on peut être certain et se tromper.
- La **raison** est la faculté de bien juger et de démontrer ; distinguer vérités de **raison** (nécessaires, logiques, mathématiques) et vérités de **fait** (contingentes, expérimentales).
- Enjeu : peut-on atteindre une vérité absolue, ou toute vérité est-elle relative et révisable ?

**Repères / Auteurs**
- **Descartes** : le **doute méthodique** rejette tout ce qui n'est pas évident pour reconstruire le savoir sur des bases certaines (le cogito).
- **Leibniz** : distinction entre vérités de raison (nécessaires, opposé impossible) et vérités de fait (contingentes, qui auraient pu être autres).
- **Kant** : la raison a des limites ; elle tombe dans l'illusion quand elle prétend connaître ce qui dépasse toute expérience possible.

**Exemple**
> « 2 + 2 = 4 » est une vérité de raison (nécessaire) ; « il pleut aujourd'hui » est une vérité de fait (elle aurait pu être autre).

**Erreur classique**
- Confondre « c'est vrai » et « j'en suis sûr » : la certitude est un sentiment subjectif, la vérité suppose l'accord du jugement avec le réel.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
