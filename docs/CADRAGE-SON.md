# Le son de Studuel : cadrage

> 30/10/2026. Lucas : « via ElevenLabs ou des outils open source, vois ce que tu peux faire pour la musique, le côté game, le son de l'application : l'ouverture, une musique de fond, la musique du duel. Il y a énormément de jeux aux sons repérables et reconnaissables. » Rien n'est branché dans l'app : un lot pilote est à écouter d'abord (« un modèle avant la série »).

## Où on en est
- **Les bruitages existent** : `lib/sounds.ts` synthétise en WebAudio les micro-retours (tap, bonne et mauvaise réponse, combo, duel) et joue cinq jingles Mixkit (`public/sounds/`). Le réglage « son » est unique, gardé dans le navigateur (`scolaria-sound`).
- **Il n'y a aucune musique.**

## L'idée : un motif signature
Ce qui rend un jeu reconnaissable, c'est **un motif de quelques notes qui revient partout**. Il est déformé selon le moment : fanfare à l'ouverture, tambours au duel, cuivres à la victoire, luth calme pour réviser.

Le motif de Studuel : **quatre notes, une quarte qui monte, un pas, un saut qui descend**. Il est original, il n'est pris à aucun jeu, et chaque prompt le décrit. L'instrumentation est celle de l'Académie : cor, cordes en pizzicato, harpe, flûte de bois, luth, petits tambours. Pas de synthé moderne, cohérent avec le lore (`assets-sources/heros/LORE-STUDUEL.md`).

## Le lot pilote (ElevenLabs, 30/10/2026)
Fichiers dans `assets-sources/son/pilote/` (hors git), copie dans OneDrive « Claude - à partager / Studuel son - pilote ».

| Fichier | Rôle | Où dans l'app |
|---|---|---|
| `01-theme-ouverture` (30 s) | thème principal | cinématique d'ouverture de `/bienvenue`, écran de lancement |
| `02-duel-boucle` (40 s) | boucle de combat | course classée et duel des héros |
| `03-victoire` (8 s) | fanfare | K.O. du duel, gardien vaincu, fête de niveau |
| `04-ambiance-reviser` (45 s) | fond calme en boucle | cours et cahier, **coupé par défaut** |
| `10-coffre` | coffre qui s'ouvre | coffre de palier, coffre d'équipe, ruban de récompenses |
| `11-niveau` | montée de niveau | fête de niveau |
| `12-bonne-reponse` | carillon | remplacerait le bip synthétisé, à comparer |
| `13-sceau` | sceau sur parchemin | confirmation (écrin de fiche, encaisser une quête) |

Générés par l'API du compte ElevenLabs de Lucas (forfait Starter, environ 1 000 crédits dépensés sur les 23 400 restants ; le compteur de l'API se met à jour en retard). Script : `el-son.mjs` du scratchpad (musique `/v1/music`, bruitages `/v1/sound-generation`).

## Les règles avant de brancher
1. **Deux réglages séparés** : « Effets sonores » (comme aujourd'hui) et « Musique ». La musique de fond de Réviser est coupée par défaut : un élève révise souvent en cours, dans le bus, avec sa propre musique.
2. **Jamais de son avant un geste** : les navigateurs l'interdisent, et un téléphone qui chante à l'ouverture en classe ferait fuir l'élève. Le thème part au premier tap de la cinématique.
3. **Poids** : convertir en Opus/WebM à 64 kb/s (une boucle de 40 s ≈ 320 Ko), chargée seulement quand l'écran la demande, jamais dans le précache. Boucles sans coupure (fondu dans le fichier, `loop`).
4. **Volume** : musique à −18 dB sous les effets, et baissée quand un effet joue.
5. **Hors Play** : rien n'empêche le son dans la version Play (pas d'offre en euros en jeu).
6. **Droits** : à VÉRIFIER avant la mise en production — les conditions d'ElevenLabs Music pour un usage commercial sur le forfait Starter. En repli libre de droits : Kenney.nl (CC0), OpenGameArt (filtre CC0), Freesound (filtre CC0), et `jsfxr` pour les bruitages.

## L'ordre
1. Lucas écoute le pilote et garde, rejette ou fait reprendre chaque piste.
2. Le motif gardé devient la référence de toutes les autres pistes.
3. On branche : `lib/musique.ts` (lecteur unique, fondus, réglage « Musique »), le thème dans la cinématique, la boucle de duel, la fanfare de victoire, les bruitages gardés dans `lib/sounds.ts`.
4. La série : une variation du motif par gardien (le cor de Delta, les tambours de Kaiser…), musique du courrier, de la boutique, du bureau de Marcel.
