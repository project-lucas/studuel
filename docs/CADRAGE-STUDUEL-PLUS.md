# Studuel+ — la colonne vertébrale (15/10/2026)

> Lucas : « les gens veulent être suivis, guidés, que l'on pense pour eux, avant eux, qu'on les aide à comprendre — et Marcel doit être là pour ça ». Ce document dit ce qui est **posé** (le squelette, branché et testé), ce qui reste **à remplir** (contenu, illustrations), et les **décisions** prises.

## 1. Les cinq piliers

Source unique : `lib/studuel-plus/formule.ts` (`PILIERS`). La carte Studuel+ de la Boutique (`lib/premium` → `avantagesStudueLPlus()`), la page `/plus` et les murs « réservé à Studuel+ » lisent tous d'ici. Règle héritée de `lib/premium` : un pilier n'est **vendu** que s'il est branché ; un pilier en construction porte `statut: 'bientot'`.

| Pilier | Ce que l'abonné a | Ce que le gratuit garde | État |
|---|---|---|---|
| **Marcel, ton guide** | 200 crédits/mois, un coach qui connaît son profil | le point du jour, la méthode | ouvert |
| **Le mode examen** (`/examen`) | compte à rebours, phase, **plan de la semaine**, épreuves écrit + oral | calendrier et liste des épreuves | ouvert |
| **Les annales corrigées** | toutes | **2 par matière** (les plus récentes) | ouvert |
| **La rente de gemmes** | 60 gemmes/semaine = 2 fiches | les gemmes des épreuves, gardiens, amis | ouvert |
| **La prépa du supérieur** (`/prepa-sup`) | droit, éco, santé, psycho… | le programme des filières | **bientôt** (squelette + vote) |

## 2. Décisions de Lucas (15/10/2026)

1. **Les fiches de révision se paient en gemmes, même pour Studuel+.** L'abonnement n'ouvre plus les fiches d'office (`lib/gems.chapterAccess`, migration 580 qui retire la porte « abonnement » de `unlock_chapter_with_gem`, `lesson_revision_sheet`, `chapter_mind_map`, `fiche_pdf_acces`). Un chapitre débloqué l'est à vie. C'est ce qui rend « 60 gemmes = 2 fiches » parlant.
2. **Les recharges de Marcel se paient en euros seulement.** Les gemmes (gagnées en jouant, et désormais en rente) n'achètent plus de temps d'IA : `coach_buy_tokens` est fermée (581).
3. **La rente pousse chaque jour et se récolte**, plutôt qu'un versement du lundi.

## 3. La rente de gemmes

- Une gemme toutes les **2 h 48** (10 080 s), **60 par semaine**, coffre plafonné à **une semaine** : plein, il ne pousse plus — il faut revenir le récolter (effet « rentier » + rétention).
- **Premier passage : coffre plein** (le point de départ est une semaine en arrière) — on comprend une rente en en touchant une.
- Après une récolte, les secondes entamées vers la gemme suivante sont gardées ; si le coffre était plein, ce qui a débordé est perdu.
- Pur : `lib/studuel-plus/rente.ts` (testé contre le SQL). Base : `rente_gemmes`, `rente_etat()`, `rente_recolter()` (580), source `rente` de `gem_events`. Écran : `components/plus/CoffreRente.tsx` sur `/plus#rente`.
- **Pistes ouvertes** (non faites) : des paliers d'ancienneté (60 → 75 → 90 après 3 et 6 mois d'abonnement) — il faudrait la date de début d'abonnement ; un rappel push « ton coffre est plein ».

## 4. Marcel, le guide

### 4.1 Il sait à qui il parle
Le **profil d'apprentissage** (`lib/coach/profil-eleve.ts`, lu par `lib/coach/profil-server.ts`) part dans la consigne à chaque question : classe, contrôles à moins de 21 jours et leurs chapitres, points faibles (les chapitres du contrôle d'abord), acquis, examen et ses jours, série. **Aucune donnée qui identifie** (ni nom, ni pseudo, ni établissement), **700 caractères au plus**, la consigne fixe AVANT le profil (cache du fournisseur). Le profil se lit en parallèle de la porte : il ne retarde rien.

### 4.2 Il pense avant l'élève — gratuitement
**« Marcel a remarqué »** (`lib/coach/remarques.ts`) : sur l'accueil de Marcel, tant que le fil est vide, trois remarques au plus — le contrôle qui approche avec un chapitre pas solide, la matière qui flanche, l'examen —, chacune avec son geste (un lien) et une question toute prête (« Lui demander » remplit le champ ; c'est l'élève qui l'envoie). Calculé avec les données que l'écran lit déjà : zéro requête, zéro appel IA.

Le **plan de la semaine** du mode examen (`objectifsDeLaSemaine`) fait la même chose côté examen.

### 4.3 Ce qui ne passe pas par le modèle ne se paie pas
- **Réponses toutes prêtes** (`lib/coach/reponses-pretes.ts`) : 13 questions de méthode générales (réviser un contrôle, apprendre une leçon, faire une fiche, s'organiser, se concentrer, le stress, retenir des dates, la dissertation, le commentaire, la motivation, le Grand oral, le brevet, la nuit blanche), écrites une fois dans la voix de Marcel, servies gratuitement. Verrous de précision : mode « question » seulement, ≤ 90 caractères, aucun mot de contenu (« fractions » fait partir la question au modèle).
- **La fiche existe déjà** (`lib/coach/fiche-catalogue.ts`) : « fais-moi une fiche sur la Révolution française » → Marcel montre la fiche du catalogue (2 947 fiches), sans modèle ; « Écris-moi la mienne · 1 crédit » renvoie la demande au modèle (`forcer`).
- **Pas de cache partagé des réponses générées** : le serveur n'a que la clé anonyme, donc tout ce qu'il peut écrire, l'élève peut l'écrire aussi — un élève empoisonnerait le cache des autres. Il faudrait une signature (comme l'avatar dessiné, HMAC) : à faire seulement si la mesure montre que ça vaut le coup.

### 4.4 La marge, mesurée
`lib/coach/cout.ts` (tarifs publics de fin 2025, à revérifier) et `/admin/marcel` (la mesure réelle : chaque appel note ses jetons dans `marcel_usage`, 581).

| Modèle | Un crédit (moyenne) | 200 crédits vidés | Part du revenu net (4,99 € TTC, magasin 15 %) |
|---|---|---|---|
| deepseek-chat (configuré) | 0,03 c | **0,06 €** | 1,6 % |
| gpt-4o-mini | 0,03 c | 0,06 € | 1,7 % |
| modèle « prudent » (≈ gpt-4.1-mini) | 0,08 c | 0,16 € | 4,4 % |

**Conclusion** : au modèle actuel, Marcel ne menace pas la marge — même vidé, il coûte moins de 2 % de l'abonnement. Le vrai risque serait de **changer de modèle** : un modèle haut de gamme (≈ 3 $ / 15 $ par million de jetons) coûterait ~1,3 € pour 200 crédits, soit ~37 % du revenu net. Si la qualité l'exige, le faire **par mode** (l'exercice, pas la question) et le mesurer dans `/admin/marcel`. L'avatar dessiné (~0,04 $ l'image, 25 crédits) reste l'usage le plus cher à l'unité.

### 4.5 Marcel dort, et se recharge
- `lib/coach/sommeil.ts` : `eveille` · `fatigue` (≤ 10 % des crédits du mois, sans recharge : « Marcel commence à bâiller », lien Recharger) · `endormi` (« Marcel dort. Il se réveille dans 17 jours, le 1er novembre — ou tout de suite avec une recharge ») · `repos` (plafond de facture de 50 appels/jour : rien ne le lève) · `abonnement` (gratuit : « Découvrir Studuel+ »).
- **Recharges** (`lib/coach/recharges.ts`, miroir du seed 581) : Coup de pouce 50 crédits 1,99 € · Semaine de révisions 150 crédits 3,99 € · **Pack examens** 400 crédits 7,99 €. En période d'examens (15 avril → 30 juin, et janvier), le Pack examens passe en tête. Les crédits rechargés **ne s'effacent pas** en fin de mois (c'est le solde `coach_tokens`, les anciens « jetons de Prof »). Même circuit que les packs de gemmes : demande + contact d'un parent, l'admin confirme par `accorder_recharge_marcel(<id de l'achat>)`. Rayon « Recharger Marcel » de la Boutique, **abonnés seulement** (au gratuit, une recharge ne servirait à rien).

## 5. Le mode examen

`lib/examen/parcours.ts` : pour chaque classe à examen (3e brevet, 1re bac de français + épreuve anticipée de maths, Tle bac : philosophie, spécialités, Grand oral session 2027), les épreuves **écrites et orales** (durée, coefficient, format, ressources), un repère de jour J et **quatre phases** : fondations (> 120 j), pratique (≤ 120 j : un sujet chronométré par semaine), sprint (≤ 45 j : épreuves blanches, oral à voix haute, points faibles), derniers jours (≤ 7 j). Le plan de la semaine (trois gestes, chacun avec son lien) est réservé à Studuel+. Porte : une ligne sur l'accueil Réviser (`LienModeExamen`, 3e/1re/Tle seulement), et le pilier de `/plus`.

⚠️ **À vérifier à chaque rentrée** : les dates (`dateIndicative` : l'écran dit « vers mi-juin » et jamais une date ferme), les durées et coefficients — en particulier l'épreuve anticipée de maths et l'oral du brevet, réformés récemment.

## 6. Les annales : 2 par matière en gratuit

`lib/annales-corrigees/acces.ts` : le gratuit lit les **deux plus récentes** de chaque matière et classe ; la couronne se pose sur les autres dans l'onglet Annales ; la page d'une annale réservée montre `AnnaleReservee` (le **sujet officiel reste ouvert** : c'est un document public). Le corpus compte aujourd'hui 42 annales : « beaucoup plus pour Studuel+ » est un chantier de **contenu** (`docs/annales-corrigees.md`). Petit trou connu : `epreuve_recompenser('annale', …)` ne vérifie pas que l'annale est lisible — un élève qui appelle la RPC à la main sans avoir le corrigé toucherait ses 10 gemmes. Faible enjeu, à fermer si un jour la liste des annales gratuites vit en base.

## 7. La prépa du supérieur

`lib/prepa-sup/catalogue.ts` : huit filières (droit, santé PASS/LAS, psychologie, économie-gestion, commerce-management, STAPS, informatique, sciences politiques), leurs 5-6 modules d'introduction, débouchés, spécialités conseillées. Page `/prepa-sup` (lisible par tous) avec **« Ça m'intéresse »** (582 : `prepa_sup_basculer`, décompte dans `/admin/marcel`). **Le remplissage** passera par la chaîne habituelle (une matière en base par filière, niveau Tle, cours → quiz → fiches) dans l'ordre que donneront les votes.

## 8. À exécuter et à faire

**Migrations (à coller à la main)** : **583 EN PREMIER** — une faille préexistante (048 + 560 + 561) laissait un élève écrire profile_type = coach sur sa ligne puis s'offrir Studuel+ par basculer_studuel_plus_test ; le déclencheur profiles_garde_coach la ferme (seuls un admin, le SQL Editor ou la clé service font un coach). Puis 580 (rente + fiches), 581 (recharges + mesure), 582 (prépa). Rejouées deux fois sur PGlite : 44 vérifications (rente, plafond, secondes gardées, fiches abonné, recharges et double clic, admin, coach, RLS). ⚠️ La 580 change ce que voient les abonnés (les fiches se débloquent en gemmes) : à passer **avec** le déploiement du code.

**Illustrations à commander** (Lucas : « on verra plus tard ») — style famille nav (cerne prune, volumes brillants, violet · or · crème) :
- *Marcel endormi* (bonnet de nuit, « Zzz », assis sur sa pile de livres) — pour le mur de sommeil de Marcel.
- *Marcel et sa batterie* en trois tailles (petite pile, batterie, batterie dorée « examens ») — pour les trois recharges de la Boutique (aujourd'hui : la tête de Marcel).
- *Le coffre de rente* : un coffre-tirelire violet d'où dépassent des gemmes, trois états (vide, à moitié, débordant d'or) — pour `CoffreRente` (aujourd'hui : la gemme dans un anneau).
- *Un médaillon par filière* de la prépa (balance, stéthoscope, cerveau, courbe, mallette, chaussure de course, écran, colonnes) — aujourd'hui des emojis.

**Aperçus sans compte** (développement) : `/dev/plus` (`?rente=60|0|absente`, `?abonne=0`, `?vue=recharges&date=2026-05-20`, `?vue=prepa`), `/dev/examen` (`?classe=1re|Tle|4e`, `?premium=0`, `?jours=30`), `/dev/marcel` (`?etat=fatigue|endormi|repos|gratuit`, `?remarques=0`).
