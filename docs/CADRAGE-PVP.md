# Cadrage — les voies d'amélioration du PVP (la course classée)

> Écrit le 22/09/2026, à partir d'un état des lieux complet du code
> (`lib/duel/*`, `components/duel/*`, `app/api/duel/fin`, migrations 238 · 351 ·
> 371 · 374, `docs/maquettes-pvp.html`, `docs/CADRAGE-PERCENTILE.md`). Ce document
> ne décide rien : il liste TOUTES les voies, avec pour chacune le coût, la
> présence ou non d'une migration, les dépendances et la façon de mesurer que
> ça a marché. La dernière section propose un ordre.

## 0. Ce qui existe, en une page

- **Une course** : deux barres, 1 000 points, 90 s max, 100 pts + bonus de
  vitesse (0–50) × combo (×1/×2/×3), une question dorée ×2 tirée de la graine,
  aucune perte sur une erreur. Phases VS (2,4 s) → 3·2·1 → course → gel (1,5 s)
  → écran de fin. Revanche et « nouvel adversaire » illimités.
- **Un rival** : la trace d'un vrai élève du même `grade_level` (`duel_replays`,
  une trace par élève et par matière, la précédente gardée), sinon un des
  24 robots à tempérament (`lib/duel/bots.ts`), calibré pour ≈ 60 % de
  victoires (`tuningForTrophies`). Appariement au plus proche en trophées
  (fourchettes 150 → 300 → 600 → tout).
- **Une économie** : trophées par matière × jeu (`game_trophies`), bandes de gain
  (10 → 2) et de perte (0 → 8), bouclier à 25 gemmes, 60 parties/heure maxi,
  points de clan, couronnes de saison, SRS alimenté, quêtes. **Pas d'XP** (348).
- **Un serveur seul juge** : `/api/duel/fin` refabrique le rival et recalcule le
  verdict ; `duel_course_enregistrer` (374) paie tout ou rien, jamais deux fois.
- **Ce qui n'existe pas** : lien avec les amis, historique (celui affiché lit
  une table morte), récap des erreurs, partage, rang de matière à l'écran de
  fin, difficulté, filtre par chapitre, trace de l'adversaire en base, funnel,
  forme de session, enjeu, saison visible, 2v2. Trois systèmes de duel vivent
  côte à côte (course, duel en direct BO3, duel fantôme) sans se parler.

## 1. Diagnostic — huit constats

1. **Le duel est seul.** Le vivier est filtré par classe, jamais par amitié ; on
   ne peut pas courir contre la trace d'un ami, et un ami ne sait pas qu'on l'a
   battu. L'onglet Amis et l'arène sont deux mondes.
2. **Rien ne s'ouvre à la fin.** L'écran de fin montre deux pastilles, le delta
   de trophées, trois boutons. Pas de « tes 3 erreurs », pas de rang de
   matière, pas de progression de division, pas d'historique, pas de partage.
   La courbe d'apprentissage du PVP s'arrête à « rejouer ».
3. **Rien n'est en jeu, la session n'a pas de forme.** Une course, puis une
   autre, à l'infini, sans mise, sans palier protégé, sans échéance. Les trois
   boucles maquettées (Route, Poussée, Ligue des rivaux) n'existent pas ; seul
   « 24 rivaux » a été livré.
4. **Le rival n'a pas de visage.** Une trace parle en métronome, avec la voix
   neutre ; on ne peut ni voir son profil ni le retrouver. Les tempéraments
   n'existent que pour les robots.
5. **Le contenu ne connaît pas la difficulté.** Aucune colonne, aucune
   heuristique : une course peut enchaîner trois questions imbuvables puis trois
   triviales. Le pool de 30 reboucle. Pas de course « sur le chapitre du
   contrôle de jeudi ».
6. **L'intégrité est incomplète.** Le serveur borne le score mais ne le recoupe
   jamais avec les réponses ni les pas ; `/api/duel/fin` n'a pas de limite de
   débit propre ; `courseId` vient du client. Un tricheur monte au classement de
   l'école.
7. **On ne mesure rien.** Ni l'adversaire affronté (bot ? trace ? lequel ?), ni
   la durée, ni l'abandon, ni le funnel « bouton → VS → première réponse →
   fin ». Impossible de savoir si le calibrage à 60 % tient.
8. **La première course n'est pas guidée**, et le verrou de matière (un chapitre
   à 70 %) ne verrouille rien — il change un libellé. La ligue de l'école est
   globale, jamais par matière, alors que les trophées le sont.

## 2. Les voies, par axe

Coût : **S** (une journée), **M** (deux à quatre jours), **L** (une semaine et
plus). « Migration » : oui si une table, une colonne ou une RPC change.

### A. La fin de course — ce qu'on ouvre

| # | Voie | Pourquoi | Coût | Migration |
|---|---|---|---|---|
| A1 | **« Tes erreurs »** : les questions ratées avec leur explication, et un bouton « Les revoir » qui ouvre la file À revoir | Le PVP devient un outil de révision visible ; la note « ta course deviendra l'adversaire d'un autre » ne suffit pas à justifier le temps passé | S | non — `answers` et `explanation` sont déjà là |
| A2 | **Rang de matière et progression de division** sur l'écran de fin (`lib/subject-rank` existe) | Le delta « +8 » ne dit pas où l'on est ; « Argent II · plus que 40 » donne une raison de rejouer | S | non |
| A3 | **Statistiques de la course** : précision, cadence moyenne, temps par question, comparées à celles du rival | La seule chose qu'un élève peut améliorer, c'est ce qu'on lui montre | S | non |
| A4 | **Carte de fin partageable** (story), avec le blason, le score, le rang — `components/story-share.ts` sait déjà faire | Le PVP est le seul contenu de l'app qui se raconte ; c'est de l'acquisition gratuite | S/M | non |
| A5 | **Historique vivant** : `DuelHistory` lit `game_matches` (238) et non plus `ranked_matches` (079, plus alimentée) | La feuille Historique est muette depuis que la course existe | S (lecture) / M (avec le rival, cf. B1) | non pour la lecture, oui pour « contre qui » |

### B. Un rival avec un visage

| # | Voie | Pourquoi | Coût | Migration |
|---|---|---|---|---|
| B1 | **Stocker l'adversaire** : `opponent_kind`, `opponent_id` (élève ou robot), `replay_version`, `goal_at_ms`, `score_rival`, `statut` sur `challenge_sessions` (ou `game_matches`) | Préalable à tout le reste de cet axe, et à la mesure (G) ; aujourd'hui une course ne sait pas contre qui elle a été jouée | S | **oui** (colonnes + `duel_course_enregistrer` les écrit) |
| B2 | **Courir contre un ami** : depuis Amis, « Défier Léa » lance la course contre SA trace (vivier par amitié, puis par classe en repli) ; Léa reçoit « Tom a battu ta trace en Maths — revanche ? » | C'est le trou n°1 : le PVP ne touche pas au graphe social alors que l'onglet Amis existe, avec ses QR et ses clans | M | **oui** (RPC `duel_replay_of_friend`, table `duel_defis` pour la notification/revanche) |
| B3 | **La voix des traces** : une devise choisie par l'élève (liste fermée, jamais de texte libre) + tempérament DÉDUIT de la trace (rythme des pas) → les mêmes bulles que les robots | Une trace en métronome est un robot qui ne dit pas son nom ; le rival humain doit être plus vivant que le robot, pas moins | S/M | oui (colonne `devise` sur `profiles` ou `duel_replays`) ; le tempérament déduit est pur, sans migration |
| B4 | **Nemesis** : le rival qui t'a le plus battu, proposé en revanche à l'arène (« Ta revanche contre Inès t'attend ») | Boucle C de la maquette, version minimale ; dépend de B1 | S après B1 | non (lecture) |
| B5 | **Profil du rival** au tap sur la fiche VS / de fin : blason, école, trophées de la matière, série | Donne un visage sans rien inventer ; utilise `friends_overview`-like | S | non si les colonnes sont lisibles (vérifier la RLS de `profiles`) |

### C. Une forme et un enjeu (les maquettes)

| # | Voie | Pourquoi | Coût | Migration |
|---|---|---|---|---|
| C1 | **La Poussée** : 5 courses enchaînées, mise ×1 → ×2 → ×3 sur les trophées, 5 s de décompte entre deux, palier protégé (on ne redescend pas sous le palier de départ) | Donne une FORME à la session (début, milieu, fin) et un enjeu sans rien retirer à un mineur ; la revanche illimitée devient un choix | M | **oui** (état de la poussée côté serveur, sinon la mise se triche) |
| C2 | **La Route** : des caisses à paliers de trophées de matière (250, 500, 750…), ouvertes en gemmes différées ou en cosmétiques | « Rien ne tombe à la fin » depuis que jouer ne verse plus d'XP ; la Route relie le PVP à l'économie SANS réintroduire l'XP | M | **oui** (table des caisses ouvertes) |
| C3 | **La Ligue des rivaux** : 20 élèves de la même bande, une semaine, clôture dimanche 20 h, promotion / relégation, le rival de la semaine en tête d'affiche | La boucle la plus forte de Duolingo ; dépend de B1 pour peupler les 20 avec de vrais adversaires | L | **oui** (groupes hebdomadaires, snapshot) — alternative à coût M : ligue de l'école PAR MATIÈRE (H3) |
| C4 | **Saison visible** : la bascule paresseuse (>500 → 500 + moitié) existe mais rien ne l'annonce ; écran de fin de saison, récompense de rang, badge | Une saison invisible est une punition invisible ; visible, c'est une échéance | M | oui (table des récompenses de saison) |
| C5 | **Le mode du jour en course** : un modificateur tiré de la graine du jour (dorée ×3, 60 s, deux dorées, chapitre imposé) annoncé sur le billet | Varie la course sans ajouter un mode (« trop de modes de jeu ») ; le billet du mode du jour existe déjà | S | non — tout est dans la graine et `lib/duel/course.ts` |

### D. Contenu et équité

| # | Voie | Pourquoi | Coût | Migration |
|---|---|---|---|---|
| D1 | **Une difficulté par question**, dérivée des réponses (taux de réussite global, `test_sessions` / `review_items`) dans une vue matérialisée rafraîchie la nuit ; la course monte en difficulté (Q1–3 faciles, dorée moyenne, fin difficile) | La course actuelle mélange 60 % de dû SRS et 30 % d'inédit sans savoir ce qui est dur ; les premières secondes décident de l'abandon | M | **oui** (vue + colonne) |
| D2 | **Course par chapitre** : choisir un chapitre (par défaut celui du prochain contrôle déclaré), `drawSubjectSession` filtré | Relie le PVP à Réviser et aux contrôles ; c'est aussi ce qu'un parent comprend (« il s'entraîne pour jeudi ») | S/M | non |
| D3 | **Pool plus large** (30 → 45) et `MIN_PROGRAMME_QUESTIONS` cohérent ; ne jamais reboucler avant 90 s | Un élève rapide revoit une question déjà posée dans la même course | S | non |
| D4 | **Calibrage mesuré des robots** : taux de victoire réel par bande et tempérament (dépend de B1/G1), puis ajustement de `tuningForTrophies` ; bande 0 avec des robots qui laissent gagner deux fois | La cible de 60 % est une intention, pas une mesure | S après G1 | non |
| D5 | **Écarter les traces aberrantes** du vivier (100 % en 6 réponses sous 12 s) par une règle pure au dépôt ET à la lecture | Une trace tricheuse fait perdre d'office tous ceux qui tombent dessus | S | non |

### E. Intégrité et serveur

| # | Voie | Pourquoi | Coût | Migration |
|---|---|---|---|---|
| E1 | **Recouper le score** : le client envoie `answers` (id, correct, ms) ; le serveur recalcule les points avec `lib/duel90` (pur) et le combo, et refuse un `stats.score` qui s'en écarte | Aujourd'hui `score = 22 950, goalAtMs = 300` passe ; le classement école repose sur ce chiffre | S/M | non (route + `fin-course-server`) |
| E2 | **Limite de débit sur `/api/duel/fin`** (par utilisateur ET par IP), en plus des 60 parties/heure de la RPC | Un script peut marteler la route ; la RPC ne voit que les parties « réussies » | S | non |
| E3 | **`courseId` émis par le serveur** (`duel_course_ouvrir`, qui pose aussi la graine et l'adversaire) — ou une signature HMAC de la graine | Ferme la porte « je choisis mon rival » ; permet aussi de mesurer l'abandon (course ouverte, jamais fermée) | M | **oui** |
| E4 | **Vérifier les pas envoyés** contre le temps de course (somme des `ms` ≤ `goalAtMs`) | Complète E1 pour la trace qui deviendra l'adversaire d'un autre | S | non |

### F. Social et multi

| # | Voie | Pourquoi | Coût | Migration |
|---|---|---|---|---|
| F1 | **Décider du duel en direct** : « peut-être mort en prod » (ASSOCIE). Soit le refaire SUR la course (deux élèves en Realtime, même barème, même écran, trophées de matière), soit le retirer avec le duel fantôme | Trois systèmes de duel, c'est trois fois les bugs et aucun d'eux n'a le vivier des autres | L (refaire) / S (retirer) | oui (refaire) |
| F2 | **Défi de clan visible** : la course de la semaine où chaque victoire compte pour l'école (`clan_week_contribute` existe déjà, mais rien ne le montre pendant la course) | L'objectif de clan est sur le bouton DUEL, pas dans la course | S | non |
| F3 | **Rejouer sa course** (les `steps` existent) et celle du rival, en accéléré | Le seul « replay » que l'élève voit est celui d'un autre ; voir la sienne, c'est comprendre où elle s'est perdue | S/M | non |
| F4 | **2v2 relais** (`TEAM_GAMES`, tout `implemented: false`) | Fort, mais L et dépend de F1 (temps réel) ; à ne pas ouvrir avant que la course 1v1 soit mesurée | L | oui |

### G. Mesure

| # | Voie | Pourquoi | Coût | Migration |
|---|---|---|---|---|
| G1 | **Événements de duel** : `duel_events` (ouverture, VS, première réponse, fin, abandon, revanche) ou les colonnes de B1 + un statut « ouverte » | Sans funnel, aucune des voies ci-dessus ne peut être jugée | S | **oui** |
| G2 | **Taux bot / trace, victoire par tempérament, part des revanches** : un écran `/admin/duel` sur G1 | C'est ce qui pilote D4 et l'appariement | S après G1 | non |
| G3 | **Constantes testables par graine** : `GOAL_POINTS`, index de la dorée, `SPEED_FAST_MS` tirés d'une variante par cohorte | Permet d'essayer 800 points ou une dorée plus tardive sans déployer | S | non |

### H. Découverte et première course

| # | Voie | Pourquoi | Coût | Migration |
|---|---|---|---|---|
| H1 | **Première course guidée** : bulles explicatives (la barre, la dorée, le combo), première question sans chrono, robot « L'entraîneur » (existe dans `matchmaking.ts`, plus appelé) qui perd de peu | Le PVP est l'onglet central et personne n'explique la règle des 1 000 points | S | non |
| H2 | **Verrou de matière cohérent** : soit verrouiller vraiment la course classée tant qu'aucun chapitre n'est à 70 % (avec un robot d'entraînement sans trophées), soit retirer le libellé | Un verrou qui ne verrouille pas est un mensonge d'interface | S | non |
| H3 | **Ligue de l'école par matière** (`game_trophies` existe) en plus du total | Un élève fort en Histoire et faible en Maths n'a aujourd'hui qu'un rang ; par matière, tout le monde a un podium possible | M | non (lecture) |
| H4 | **Notifications de PVP** : « ta trace a été battue », « ta revanche t'attend », « la ligue ferme dans 2 h » — l'infra push existe | Les seuls rappels sont SRS et série ; le PVP est la raison la plus légitime de revenir | S après B2/C3 | non |

## 3. Un ordre proposé

**Lot 1 — sans migration, une semaine.** Ce qui améliore la course dès
demain et prépare la mesure : **A1, A2, A3** (l'écran de fin devient
apprenant), **E1, E2, D5** (l'intégrité qui manque), **C5** (le mode du jour),
**H1, H2** (la première course), **D2** (course par chapitre), **A5**
(historique sur `game_matches`).

**Lot 2 — une seule migration « duel v2 ».** Une migration idempotente qui
ajoute les colonnes de rival et de verdict (**B1**), la table d'événements
(**G1**), la devise (**B3**) : puis, en lecture seule, **B4** (nemesis), **B5**
(profil), **G2** (l'écran admin), **D4** (calibrage mesuré), **F3** (rejouer),
**H4** (les premières notifications).

**Lot 3 — la forme et l'enjeu.** À choisir UNE boucle d'abord, mesurée par le
lot 2 : **C1 La Poussée** (la moins chère, la plus « session »), ou **C2 La
Route** (la plus « récompense »), ou **C3 / H3** (la plus sociale). Puis **B2**
(courir contre un ami) et la décision **F1** sur le duel en direct.

## 4. Ce qu'on ne fait pas

- **Pas d'XP en jouant** (décision 348) : la Route et la Poussée paient en
  trophées, gemmes différées ou cosmétiques, jamais en XP.
- **Pas de nouveau mode** dans la feuille des modes (« trop de modes de jeu »,
  19/09/2026) : les voies ci-dessus enrichissent LA course, elles n'en ajoutent
  pas une autre. Le mode du jour est un modificateur, pas un billet.
- **Pas de mise perdable en gemmes** : la mise de la Poussée porte sur les
  trophées, avec un palier protégé — on parle à des mineurs.
- **Pas de texte libre entre élèves** : les devises sont une liste fermée, les
  bulles restent celles du code.
- **Le serveur reste seul juge** : chaque voie qui touche aux points passe par
  `duel_course_enregistrer`, jamais par un chiffre du client.

## 5. Ce qu'on mesurera

| Métrique | Aujourd'hui | Cible |
|---|---|---|
| Part des élèves actifs jouant ≥ 1 course / jour | inconnue | 40 % |
| Taux de deuxième course (revanche ou nouvel adversaire) | inconnu | 60 % |
| Taux de victoire de l'élève | intention : 60 % | mesuré entre 55 et 65 % |
| Part des courses contre une VRAIE trace | inconnue | > 50 % au collège |
| Abandons en course | non mesurés | < 10 % |
| Courses « anormales » refusées par le serveur | 0 (non détectées) | visibles dans l'écran admin |

Le lot 2 est ce qui rend ces six lignes remplissables ; c'est aussi pour ça
qu'il passe avant le lot 3.
