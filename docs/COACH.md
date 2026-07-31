# L'onglet Coach — cadrage

> ⚠️ **Lire `COACH-PROF.md` d'abord.** Le brief du 31/07 au soir a renversé la
> hiérarchie de ce document : le Prof est un **repère de méthode**, l'aide aux
> devoirs par IA est secondaire. Les couches de coût et les garde-fous ci-dessous
> restent valables tels quels ; c'est l'ordre des priorités qui change.

> Statut : proposition, avant tout code. 3 décisions attendent Lucas (fin du doc).
> Écrit le 31/07/2026.

---

## 1. La promesse, en une phrase

**« Chaque jour, quelqu'un regarde ton travail et te dit quoi faire pendant 10 minutes. »**

C'est la seule chose que Duolingo ne sait pas faire (il te dit « fais ta leçon »),
que ChatGPT ne sait pas faire (il ne sait pas ce que tu as raté hier), et que le
prof particulier à 30 €/h fait très bien — une fois par semaine.

Studuel a déjà, en base, ce qu'il faut pour tenir cette promesse : les erreurs
réelles (SRS, `À revoir`), la maîtrise par chapitre (`mastery`), la capacité
(`capacity`), la régularité (`streak`, `habits`), le calendrier des contrôles
(`plan-preparation`), les créneaux de trajet. **Le coach ne devine pas : il lit.**

C'est aussi ce qui fait que 90 % de sa valeur ne coûte pas un seul token.

---

## 2. Ce qu'il y a dans l'onglet — 4 blocs

### ① Le Point du jour (héros)

La mascotte flamme, une bulle, **un seul** bouton.

> « Les fractions te résistent : 3 erreurs hier, aucune reprise depuis.
> 6 minutes pour les retourner ? » → **[ Séance guidée · 6 min ]**

Une phrase de diagnostic + une action. Jamais deux. C'est le contrat de l'écran :
on ne propose pas un menu à un élève de 14 ans à 18 h, on lui donne un ordre
gentil.

Règles de priorité du diagnostic (déterministes, dans `lib/coach.ts`) :
contrôle dans < 4 jours > file « À revoir » qui déborde > chapitre en chute de
maîtrise > série en danger > rien à signaler (→ mode « on avance »).

### ② La séance guidée

Le coach compose la séance : **Revoir** (SRS dû) → **Consolider** (le chapitre
faible) → **Défier** (un boss / un duel pour finir sur du plaisir). 6, 10 ou 15
minutes selon le temps annoncé. Tout existe déjà côté données ; le coach ne fait
que choisir et ordonner.

C'est le pont avec le reste de l'app : le Coach n'est pas une île, c'est
**l'aiguilleur** qui envoie vers Réviser et Défi.

### ③ Demander au coach

L'entrée IA. **À intentions, pas un champ de chat vide** — 4 boutons :

- « Je n'ai pas compris **cette** question » (piochée dans les erreurs récentes)
- « Explique-moi ce chapitre autrement » (reformulation courte, 4 lignes)
- « Interroge-moi » (5 questions ciblées — le générateur existe déjà)
- « **Photo de mon exercice** » (le Snap — voir §4)

Un champ libre existe sous les boutons, mais borné (longueur, hors-sujet refusé,
réponse courte). Les boutons portent 80 % des usages, coûtent 3× moins de tokens
et ne demandent aucune modération de l'entrée.

### ④ Ton bilan

La semaine en 3 chiffres + le mot du coach + **[ Envoyer à mes parents ]**.
Le bilan chiffré est déterministe. Le « mot du coach » est au choix
déterministe (banque de phrases conditionnelles) ou 1 appel IA / semaine /
abonné — jamais plus.

### Et hors de l'onglet

Le coach parle **déjà** : la feuille de la mascotte après chaque question (livrée
hier). Il glissera un mot sur `/reviser`, il portera la notification du soir.
L'onglet est son domicile, pas son unique point de contact — c'est ce qui rend
l'ajout d'un 6ᵉ onglet légitime plutôt que gadget.

---

## 3. Les 4 couches d'IA — et pourquoi la marge tient

| Couche | Ce que ça fait | Modèle de coût | Plafond |
|---|---|---|---|
| **L0 — Réflexe** | point du jour, séance, relances, bilan chiffré, félicitations | **0 token** | illimité |
| **L1 — Explication mutualisée** | « pourquoi c'est faux » sur une question **du catalogue** | générée **1 fois**, servie ∞ | coût **fixe**, hors ligne |
| **L2 — Personnel** | reformuler, interroge-moi, ma question | ~0,3–0,8 c€ / appel | quota/jour **par palier** |
| **L3 — Snap (photo)** | exercice photographié → correction pas à pas | ~2–5 c€ / appel (vision) | 3 offerts à vie, puis jetons/abonnement |

### Le levier n°1 : L1, le coût variable transformé en coût fixe

Une explication d'erreur sur une question **du catalogue** est *identique pour
tous les élèves de France*. On la génère une fois par un script admin, on la
range dans `quiz_questions.explication_ia`, et on la sert à 100 000 élèves pour
le prix d'un.

Conséquence stratégique : on peut offrir **« le coach t'explique chacune de tes
erreurs » à tous les gratuits** — l'argument de téléchargement le plus fort du
lot — pour un coût qui ne bouge pas avec le nombre d'utilisateurs. Un catalogue
de 20 000 questions coûte quelques dizaines d'euros à expliquer, **une fois**.

### Les garde-fous (non négociables)

1. **Quota serveur** sur le modèle exact de la migration 198 : table de
   compteurs, RLS active + zéro policy, RPC `SECURITY DEFINER`, **plafond décidé
   en SQL, jamais fourni par le client**, et on compte *avant* l'appel — un refus
   compte aussi, sinon marteler l'endpoint est gratuit.
2. **`max_tokens` serré** (200–350). Le coach parle court : c'est meilleur
   pédagogiquement *et* c'est la moitié de la facture.
3. **Aucun historique brut.** On recompose à chaque tour un contexte structuré
   compact (classe, chapitre, 3 dernières erreurs). Un fil de 30 messages se
   repaie 30 fois par tour — c'est comme ça que les factures explosent.
4. **Petit modèle par défaut** (`gpt-4o-mini` / `deepseek-chat`, déjà
   configurable via `AI_BASE_URL`/`AI_MODEL`). Escalade réservée au Snap.
5. **Kill-switch + plafond global journalier.** `COACH_AI_ENABLED=0` et un
   compteur global : si la facture s'emballe, le coach retombe en L0 et l'app ne
   casse pas — l'élève voit « le coach réfléchit moins vite aujourd'hui »,
   pas une erreur.
6. **Modération.** App pour mineurs : hors-sujet refusé par une phrase type
   (« je suis là pour les cours »), texte élève isolé entre balises (déjà fait
   dans `ai-actions.ts`), sortie validée avant affichage.
7. **Jamais le devoir à la place de l'élève.** Le coach donne un indice, puis
   une étape, puis seulement la méthode. C'est défendable pédagogiquement,
   vendable aux parents — et trois fois moins cher qu'un corrigé rédigé.

### L'ordre de grandeur à garder en tête

Le calcul qui doit rester vrai : **coût IA mensuel d'un gratuit ≈ 0**, parce que
son revenu est 0.

- **Gratuit** : L0 + L1 illimités (≈ 0 €), **3 questions L2/jour**, 0 Snap après
  les 3 offerts à vie → plafond ~0,05 €/mois/actif, et seuls ~25 % des actifs
  toucheront réellement au plafond.
- **Studuel+** : 30 L2/jour + 1 Snap/jour → plafond ~0,6–1,5 €/mois sur un
  abonnement à 5–10 € → **marge ≥ 80 %** même au plafond, qui n'est jamais
  atteint par un élève réel.
- **Jetons en gemmes** : la seule monnaie qui achète de l'IA est celle qui se
  gagne **en amenant des amis**. Chaque euro de coût variable est adossé à une
  acquisition. (Cohérent avec `lib/gems.ts` : la gemme achète du **volume**
  consommable, jamais l'accès au contenu premium — ça reste la contrepartie de
  l'abonnement.)

> Chiffres à recaler sur la facture réelle du fournisseur avant le Lot 2. La
> règle, elle, ne bouge pas : **aucun appel IA ne part sans un compteur qui
> l'autorise, et aucun plafond ne vient du client.**

---

## 4. Croissance — ce qui fait télécharger

1. **Snap & Explain est le hameçon.** C'est le moteur d'acquisition de Gauth,
   Question.AI, Photomath : « je prends mon exo en photo, il m'explique ». Aucun
   argument de gamification ne convertit aussi vite. **3 gratuits à vie**, puis
   un mur.
2. **Un mur qui recrute au lieu de bloquer.** Deux sorties, jamais une :
   *« Invite un ami → vous gagnez 30 gemmes chacun »* ou *« Passe Studuel+ »*.
   La boucle de parrainage existe déjà et est anti-triche (le filleul doit
   réviser pour payer).
3. **La carte de bilan partageable** en story — on sait déjà faire (bulle géo).
   Le coach produit l'image, l'élève la poste, ça ramène.
4. **Le rapport parents.** Le coach envoie le résumé hebdo dans l'espace parents
   (qui existe). Le parent est le payeur : c'est le meilleur **convertisseur**
   du lot, pas le meilleur acquéreur. Ne pas confondre les deux.
5. **L'ASO.** « coach scolaire », « aide aux devoirs », « photo exercice
   solution » : l'onglet Coach donne enfin des mots-clés de recherche qu'un
   « jeu de révision » n'a pas. C'est peut-être le gain de téléchargements le
   plus sous-estimé du chantier.
6. **La rétention.** « Ton point du jour est prêt » est une notification
   légitime, là où « ta série va s'éteindre » est une notification culpabilisante
   qu'on finit par couper.

---

## 5. Ce qu'on ne fait PAS (à assumer par écrit)

- Pas de chat libre illimité façon ChatGPT : coût non borné, modération
  ingérable, et ça viderait la boucle de jeu de son sens.
- Pas de rédaction de devoir rendu (dissertation, commentaire).
- Pas de voix ni de vidéo générée : cher, et rien ne prouve que ça retient.
- Pas de mémoire conversationnelle longue.
- Pas d'IA sur le chemin critique : si le fournisseur tombe, **rien** ne casse.

---

## 6. Découpage — 3 lots, livrables séparément

| Lot | Contenu | IA | Migration |
|---|---|---|---|
| **1** | L'onglet, le Point du jour, la séance guidée, le bilan chiffré, la présence de la mascotte | **aucune** | aucune (lecture seule) |
| **2** | L1 mutualisé (colonne + script admin), « Interroge-moi », reformulation, quotas + kill-switch | L1 + L2 | 214 (quotas coach) + 215 (`explication_ia`) |
| **3** | Snap & Explain, jetons en gemmes, rapport parents, carte partageable | L3 | 216 (jetons + snaps) |

**Le Lot 1 est vendeur tout seul** et ne coûte rien : c'est la bonne façon de
tester si l'onglet mérite sa place dans la barre avant d'engager un centime d'IA.

Côté code, tout suit la règle maison : la décision (« que doit faire l'élève
aujourd'hui ? ») est **pure et testée dans `lib/coach.ts`** ; la page et les
Server Actions ne font qu'orchestrer.

---

## 7. Trois décisions pour Lucas

1. **La place dans la barre.** Reco : **6ᵉ onglet, entre Réviser et Défi**
   (Amis · Réviser · **Coach** · Défi · Moi · Trésor). Le Défi garde l'orbe
   central. Alternative si 6 icônes serrent trop sur petit écran : le Coach
   devient un bouton flottant présent sur toutes les pages + une page `/coach`.
2. **Le prénom de la mascotte.** Un coach anonyme ne crée pas d'attachement.
   Pistes courtes, prononçables, sans accent : **Braise**, **Flam**, **Nino**.
3. **Le curseur du gratuit** : 3 questions/jour (reco) ou 5 ? Et 3 Snaps offerts
   à vie (reco) ou 1/semaine ?

---

## 7 bis. Le mode Examen (brevet / bac) — second régime, pas second onglet

Le coach du §2 répond à « je fais quoi maintenant ». En période d'examen la
question change : « est-ce que je serai prêt dans 6 semaines, et sur quoi ». Le
même onglet bascule dans un second régime, **allumé tout seul** d'après
`grade_level` (3e → brevet, 1re → bac de français, Terminale → bac).

Ce qui change à l'écran : le compte à rebours et la barre de semaines
remplacent le diagnostic du jour ; **la couverture du programme** (solide / vu
une fois / jamais ouvert, par matière) remplace la file d'erreurs ; les
épreuves blanches sont **planifiées** et replanifient le reste. La séance du
jour, elle, ne change pas de forme — l'élève ne réapprend rien.

**Ce qui manque vraiment dans le code** (vérifié) :

- `lib/prep-plan.ts` est calibré pour un contrôle : `planSessionCount()` renvoie
  `3` dès J-5 quel que soit l'horizon, et un `Controle` = 1 matière + N
  chapitres + 1 date. Il faut un **objet Examen** multi-matières, longue durée,
  pondéré par coefficient/épreuve.
- Aucune **carte de couverture** du programme officiel par classe : le SRS ne
  connaît que ce qui a déjà été vu, jamais ce qui n'a jamais été ouvert.
- `lib/exam-blanc.ts` sort un bilan par chapitre mais n'est **pas planifié** :
  il faut poser les blancs (J-21, J-10, J-3) et **recaler le plan** après chacun.
- Pas de **budget de temps** hebdomadaire (vacances, jours morts).

**Calendrier réel.** L'échéance n'est pas juin mais **le bac blanc de janvier**,
et avant lui la rentrée. Le Lot 1 sort seul ; le mode Examen se décide à
l'automne. C'est aussi le **pic de conversion de l'année** (c'est là que les
parents paient) — donc un lot à part entière, pas une option.

## 8. Maquette

`docs/maquette-coach-finale.html` — **5 états** du même écran, dans la DA crème
& violet :

1. **Quotidien** — point du jour, séance, demander au coach ;
2. **Feuille de réponse** — indice → étape → méthode ;
3. **Mode examen** — compte à rebours, couverture, blanc programmé ;
4. **Jour 1** — aucun historique : le coach annonce et demande, il ne diagnostique pas ;
5. **Rien à rattraper** — le troisième ton, plus la file vide dite explicitement.

(`docs/maquettes-coach.html` est la planche d'origine, annotée par couche de
coût L0/L1/L2/L3 — gardée pour le raisonnement économique.)

### Décisions de conception actées à la passe UI/UX

- **Le bouton d'action porte l'encre violette, jamais l'or.** La règle maison
  (violet = action, or = récompense) n'a qu'une dérogation assumée, le Duel de
  `/defi`, justifiée par un décor entièrement violet. Le Coach est sur fond
  crème : pas de seconde dérogation. Bouton crème à encre violette sur le hero,
  socle dur violet ; l'or reste au « Offert », au Snap et au compte à rebours.
- **Trois tons, pas un.** Un coach qui n'a que des reproches finit désinstallé —
  d'où l'état « en avance » et l'état « jour 1 ».
- **Le quota se dit à l'endroit** : « 3 questions restantes », pas
  « 3 questions / jour ».
- **Le Snap remonte au-dessus de la grille** : c'est l'argument de
  téléchargement, il n'a rien à faire en cinquième position.
- **Le titre « Coach » disparaît** de la page (l'onglet actif le dit) au profit
  de la date + la série.
- Cibles tactiles ≥ 44 px, plancher de texte à 12 px, encre secondaire
  assombrie, socle dur sur tout ce qui se tape, `prefers-reduced-motion`
  respecté.

### Restant à traiter à l'implémentation

Squelette de chargement du hero (la page lit SRS + maîtrise + contrôles :
c'est la plus lourde de l'app), états de focus clavier, et pondération réelle
des coefficients en mode examen (affichée dans la maquette, pas encore
calculée).
