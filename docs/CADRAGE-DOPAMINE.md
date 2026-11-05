# LE CÔTÉ DOPAMINE — analyse de la vidéo de référence (05/11/2026)

Lucas : « je vais t'envoyer une vidéo d'un jeu auquel je veux que tu t'inspires
librement sur le côté animation et le côté bruitage », puis « animation blanche
pour désigner que le défi va commencer (comme Pokémon, j'aime beaucoup) ».

Source : `Downloads/a analyser.mp4` (103 s, 384 × 850, 60 i/s), enregistrement
d'écran d'un jeu mobile idle de capture de créatures (« Lumia »). On s'en inspire
pour le RYTHME, les GESTES et le SON — jamais pour ses images, ses personnages ou
sa musique. Méthode : planches à 1 i/s, transition à 10 i/s, luminance moyenne
(YAVG) à 20 i/s, spectrogramme de la piste son.

## 1. Le moment-phare : l'entrée en combat (23,6 s → 27,5 s)

Mesuré image par image (luminance moyenne 0-255 entre parenthèses) :

| Temps | Durée | Ce qui se passe |
|---|---|---|
| 23,6 → 23,8 s | 0,2 s | Le bouton « Combattre » est touché : la feuille d'équipe s'éteint (104 → 148), on revoit la scène. |
| 23,8 → 24,3 s | 0,5 s | L'adversaire se tourne vers nous ; une **onde de choc** (anneau clair) part de son ombre et s'élargit. |
| 24,3 → 24,9 s | 0,6 s | **Lignes de vitesse** blanches, radiales, qui convergent vers lui ; très léger zoom avant. Luminance qui grimpe doucement (150 → 166). |
| 24,9 → 25,2 s | 0,3 s | **Le blanc monte** en accélérant (166 → 232) : tout l'écran devient blanc. |
| 25,2 → 27,0 s | 1,8 s | Blanc tenu (il cache le chargement du combat). Chez nous : 0,2 à 0,3 s suffisent. |
| 27,0 → 27,5 s | 0,5 s | Le blanc se dissout sur la scène de combat. |
| 27,5 → 30 s | 2,5 s | **Révélation** : gros plan sur l'adversaire qui fait sa pose, puis plan large, notre créature de dos, le mot « Combattre » qui s'écrit en rouge, et le HUD (PV, chrono, compétence) qui glisse en place depuis les bords. |

Le son, au spectrogramme : un **stinger montant** (balayage vers l'aigu) au
tap, un second sur les lignes de vitesse, la musique d'exploration **coupée
net** sous le blanc, et le **thème de combat** (plus dense, rythmé) qui part
pile à la révélation (≈ 26,3 s). Le silence du blanc fait la moitié de
l'effet.

## 2. Les autres gestes qui donnent envie (dans l'ordre de la vidéo)

1. **La roue de récompense** (0-3 s, 9-11 s, 18-19 s) : un médaillon en haut
   fait défiler les gains possibles comme une machine à sous, rayons de lumière
   derrière, puis s'arrête et lâche la pièce, qui grossit avec un halo et vole
   vers le compteur. Son : grelots aigus (scintillement jusqu'à 11 kHz) à
   chaque arrêt.
2. **Le compteur qui réagit** : chaque gain fait sauter le chiffre du HUD avec
   une petite pastille « +2 » à côté.
3. **L'objet qui explose en morceaux** (souche → bûches, 4 s) : éclatement en
   particules avec le chiffre gagné au centre.
4. **Le coffre** (11-15 s) : « Toucher » qui pulse, le coffre tremble, s'ouvre ;
   l'écran s'assombrit, ruban « Félicitations », confettis, l'objet gagné en
   grand avec son compte ; « Touchez pour fermer » avec une **barre qui se
   remplit** (ferme toute seule).
5. **En combat** : bouton de compétence au cerclage doré qui pulse quand il est
   prêt ; à l'attaque spéciale, **bandeau en biais** qui traverse l'écran avec
   son nom (« cut-in ») ; dégâts en gros chiffres avec une étoile d'impact
   blanche ; « Victoire » en lettres qui rebondissent avec une gerbe de
   lumière.
6. **La capture** (47-55 s) : taux affiché (40 % → 60 %), « Parfait ×1,5 » dans
   un flash rose, la carte lancée, « Attrapé ! » avec rayons dorés, la carte se
   retourne sur la créature avec des étincelles.
7. **Les transitions d'écran** : étoile filante sur un ciel bleu, puis un
   **volet d'étoiles** (grille d'étoiles qui se referme) ; écran de chargement
   à la mascotte. Jamais une coupe sèche.
8. **Le tutoriel** : main qui pointe + « Toucher » + tout le reste assombri.

## 3. Ce que Studuel a déjà, et ce qui manque

Déjà là : l'écran VS qui claque (`VsScreen`), le K.O. de fin (`DuelResult`), le
ruban « Récompenses » (`RecompensesProvider`), la fête de niveau, les coffres,
les éclairs d'XP qui volent vers le bandeau, les bulles du tour guidé.

Manque, par ordre d'impact :

1. **L'entrée en combat au flash blanc** (duel classé, gardien de la Traque,
   défi d'un ami) — la demande de Lucas.
2. **Le son de l'entrée** et la **musique qui change** (exploration → combat) :
   aujourd'hui les sons sont des bips isolés (`lib/sounds`), sans musique.
3. **Le cut-in de l'attaque spéciale** dans `ArenaCombat` (bandeau en biais avec
   le nom de l'attaque fétiche du héros).
4. **Le coffre qui se ferme tout seul** avec la barre de « Touchez pour fermer ».
5. **Les transitions d'écran** (volet d'étoiles aux couleurs de la marque)
   entre l'arène et un mode de jeu.

## 4. Proposition pour l'entrée en combat (à valider)

Un composant `EntreeCombat`, joué entre le tap sur DUEL (ou « Affronter ») et
l'écran VS, ≈ 1,6 s, passable d'un tap :

1. 0,15 s — l'écran courant s'éteint (voile prune).
2. 0,35 s — onde de choc depuis le centre + petit saut du héros de l'élève.
3. 0,45 s — lignes de vitesse blanches (SVG, `transform` + `opacity`
   seulement, valeurs littérales), léger zoom.
4. 0,25 s — le blanc monte (ease-in), 0,2 s tenu : c'est là qu'on navigue.
5. 0,4 s — le blanc se dissout sur `VsScreen`, qui fait son entrée habituelle.

Son : un stinger montant (ElevenLabs, bruitage court) + coupe de l'ambiance ;
`prefers-reduced-motion` : simple fondu au blanc. Aperçu sur `/dev/entree-combat`
avant de le brancher partout (règle « un modèle avant la série »).

## 5. Ce qui est livré le 05/11/2026 (« allez go »)

1. **L'entrée en combat** : `lib/entree-combat.ts` (calendrier, lignes de
   vitesse, magasin) + `components/combat/EntreeCombat.tsx` (scène unique dans
   `app/layout.tsx`). Voile prune 0,15 s, onde de choc, lignes de vitesse
   (0,4 → 0,85 s), le blanc monte (0,85 → 1,1 s), navigation en plein blanc,
   tenu 0,2 s après l'arrivée de la page, fondu 0,4 s ; filet à 4 s. Un tap
   pendant la montée va droit au blanc. Sons : `rencontre` au tap, `vitesse`
   sur les lignes, musique coupée net à 0,85 s, `flash` à 1 s. Branchée après
   la recherche d'adversaire (`MatchmakingOverlay`) et sur « Défier » un
   gardien (`BossSheet`, `BossFlash`, `BossApparition`). Le défi d'un ami ne
   la joue pas encore.
2. **Trois musiques** (`lib/musique.ts`) : `arene` dans l'onglet Défi, `combat`
   dans le duel (`DuelCourse`) et la Traque (`BossMode`), `victoire` une fois
   au résultat gagné, silence sur une défaite. Pile de demandes (la dernière
   joue), GainNode (iOS), fondu enchaîné 0,6 s, atténuée sous le coffre et le
   scintillement, muette en arrière-plan. Ce sont les pistes du LOT PILOTE
   (`docs/CADRAGE-SON.md`), jamais validées à l'écoute par Lucas.
3. **Les récompenses** : la vague d'éclairs joue le `tic` enregistré, transposé
   en pentatonique de do à partir de sol (`demiTonsPerle`) ; le coffre de
   palier et celui des quêtes `coffre-tremble` pendant la réponse du serveur,
   puis `coffre-ouvre` ; le ruban « Récompenses » s'ouvre sur `scintillement` ;
   les coups du combat des héros sonnent `impact` / `critique` à l'impact.
4. **Un univers** : tout est généré avec le même suffixe de prompt (bois et
   cristal, do majeur), coupé au premier son, -16 LUFS ; deux réglages,
   « Effets » (`scolaria-sound`, vibrations comprises) et « Musique »
   (`studuel-musique`) ; aucun son avant le premier geste.

Reste à vérifier : les droits commerciaux ElevenLabs du forfait (Starter), et
l'écoute par Lucas de chaque son (`/dev/entree-combat`, un bouton par geste).
