# Le coffre de la semaine : revenir plusieurs fois, pas une seule

> Cadrage du 29/10/2026. Rien n'est codé : ce document attend les décisions de Lucas (§ 6).

## 1. La demande

Lucas, le 29/10/2026 :

> « J'ai pensé à Genshin Impact : ils font des quêtes journalières et hebdo, et pour obtenir le coffre hebdo il faut avoir complété ses journalières au moins 5 jours sur 7. Ça incite à se connecter plusieurs fois par semaine, excellente idée. Il faut creuser cela : inviter à venir plusieurs fois plutôt qu'une fois. La récompense est sympa si c'est journalier, mais l'hebdo, c'est des gemmes par exemple. »

## 2. Ce qui existe déjà

- **Les quêtes du jour** (577) : Revenir · Apprendre · Se tester · Jouer. Chacune paie son XP, et le **coffre du jour** (100 XP) s'ouvre quand les quatre sont encaissées.
- **Chaque journée bouclée laisse déjà une trace en base** : une ligne `quest_id = '__jour__'` dans `daily_quest_claims`, avec la clé du jour en UTC. Pour compter les jours bouclés d'une semaine, il n'y a donc rien de nouveau à enregistrer.
- **La semaine en flammes de Réviser** (`SemaineFlammes`, `lib/serie-semaine.ts`) montre déjà sept jours, du lundi au dimanche. Mais elle compte la **série** (une activité par jour), pas la journée de quêtes bouclée.
- **Les gemmes restent rares** (557, `lib/economie.ts`). Elles viennent des épreuves (40 au plus par semaine), des gardiens (40 au plus par semaine), du coffre de palier tous les 5 niveaux et du parrainage.

## 3. La proposition

### Le principe

**Une semaine (du lundi au dimanche, en jours UTC comme partout dans l'app), 7 médaillons.** Chaque journée dont le coffre du jour a été ouvert allume son médaillon. **À 5 jours sur 7, le coffre de la semaine s'ouvre** : des gemmes, une fois par semaine.

- On a droit à **deux jours de répit**. Rater le mercredi ne ruine pas la semaine, on peut encore y arriver. C'est ce qui rend la règle juste pour un élève qui a sport ou un contrôle.
- Le coffre **s'ouvre dès le 5ᵉ jour**, sans attendre dimanche : la récompense arrive au moment de l'effort.
- **Le 6ᵉ et le 7ᵉ jour**, deux options :
  - **(a)** ils ne rapportent rien de plus : c'est la règle de Genshin, la plus simple ;
  - **(b)** une **semaine parfaite (7/7)** ajoute un bonus, par exemple +10 gemmes, avec l'animation de la semaine parfaite des flammes. C'est ma recommandation : sans cela, plus rien ne pousse à revenir une fois les 5 jours faits.
- Un coffre non ouvert le dimanche soir **est perdu** : la semaine suivante repart à zéro. On ne cumule pas de dette de coffres.

### La récompense

| | Gemmes | Pourquoi |
|---|---|---|
| Coffre de la semaine (5/7) | **20** (à décider) | Une fiche de révision vaut 30 gemmes : deux semaines régulières ≈ une fiche. Ça se sent sans casser la rareté. |
| Bonus semaine parfaite (7/7) | **+10** (option b) | Le dernier pas, pour ceux qui sont déjà réguliers. |

Au plus 30 gemmes par semaine, sous les plafonds des épreuves et des gardiens (40 chacun). La régularité rapporte autant qu'un bon contrôle, ce qui est le message pédagogique voulu.

### À l'écran

- **Dans le pop-up des quêtes** (`FeuilleQuetes`), sous le coffre du jour : une rangée de **7 médaillons L M M J V S D**. Les jours bouclés sont allumés, aujourd'hui est cerclé, les jours passés ratés sont éteints. À droite, **le coffre de la semaine** avec « 3 / 5 jours ».
  - Quand le 5ᵉ jour se boucle, le coffre bat. Un tap l'ouvre, puis le **ruban « Récompenses »** prend le relais et la vague de gemmes vole vers le bandeau (`ouvrirRuban`, déjà branché sur les autres coffres).
- **Le bouton flottant des quêtes** porte une petite pastille « 3/5 » les jours où le coffre de la semaine n'est pas encore gagné. C'est un rappel discret qu'il reste quelque chose à faire cette semaine.
- **La lettre de Marcel** (courrier, 602), le jeudi si l'élève est à 2/5 : « Encore trois jours et le coffre de la semaine est à toi. » Une lettre au plus par semaine, jamais culpabilisante.

### Côté serveur (une migration, sans nouvelle table)

- **`quete_semaine_etat()`** compte les lignes `__jour__` de l'utilisateur entre le lundi et le dimanche UTC de la semaine en cours. Elle rend les 7 jours (allumé ou non) et indique si le coffre est déjà ouvert.
- **`quete_semaine_reclamer()`** recompte côté serveur, refuse sous 5 jours, puis :
  - inscrit une ligne `quest_id = '__semaine__'` sur la clé du **lundi**. La clé primaire `(user_id, day_key, quest_id)` interdit le double versement ;
  - verse les gemmes avec la fonction du portefeuille, source `quetes_semaine`.
- **Le client n'annonce aucun montant**, comme pour toutes les réclamations (`hebdo-actions.ts`). Le barème a son miroir dans `lib/economie.ts`, et la logique pure (`semaineDeQuetes(jours, aujourdhui)` → médaillons, compte, ouvrable) va dans `lib/quests.ts`, testée.

## 4. Revenir plusieurs fois : les autres leviers

Le coffre de la semaine pousse à revenir **plusieurs jours**. Pour revenir **plusieurs fois dans la journée**, voici des pistes classées de la moins chère à la plus chère :

1. **Les gardiens sont déjà rares** (576 : un jour par gardien, jauge remise à zéro chaque nuit). L'affiche « Il part dans 6 h 12 » est un rendez-vous. Il suffirait de la montrer dans le pop-up des quêtes les jours où un gardien rôde.
2. **Une quête du soir** : la 4ᵉ quête (« Jouer ») ne se débloque qu'après 17 h, heure de Paris. Le soir est le moment des devoirs, et ça crée un deuxième passage. À tester : le risque est de frustrer celui qui ne vient que le matin.
3. **Le coffre d'équipe et la ligue** comptent l'XP de la semaine. Les rappeler au moment où un ami nous double ferait revenir, mais cela suppose des notifications push, que l'app n'a pas encore (`docs/CADRAGE-COACHING.md`).

## 5. Garde-fous

- **Jamais de perte qui fait mal** : on ne retire rien, et un coffre raté n'est qu'une occasion manquée. C'est la règle des divisions de ligue (« une défaite ne retire jamais rien »).
- **Pas de faux compte à rebours** : le seul compte qui s'affiche est celui de la vraie fin de semaine, le dimanche à minuit UTC. C'est la même horloge que les gardiens.
- **Pas de gemmes achetables par ce chemin**, et rien d'affiché en euros, donc rien à cacher dans la version Play.
- **Mesurer avant d'élargir** : regarder la part d'élèves qui bouclent 5 jours sur 7 au bout de deux semaines (journal d'usage `lib/evenements`). Sous 10 %, le seuil est trop haut et passe à 4/7.

## 6. Les décisions de Lucas

1. **Le seuil** : 5 jours sur 7 (Genshin), ou 4/7 pour commencer ?
2. **Le montant** : 20 gemmes ? Avec le bonus de semaine parfaite (+10), ou sans ?
3. **Ce qui compte comme « jour fait »** : le coffre du jour ouvert (les quatre quêtes, ma recommandation), ou trois quêtes sur quatre ?
4. **La quête du soir** (§ 4.2) : à essayer, ou non ?
5. **La lettre de Marcel du jeudi** : oui ou non ?
