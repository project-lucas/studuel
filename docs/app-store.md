# Studuel sur l'App Store (iPhone)

État au 03/11/2026.

## Ce qui existe

- **Identifiant** : `app.studuel` (Apple Developer, équipe X24JV6VHHM, compte « personne physique »).
- **Fiche App Store Connect** : « Studuel : réviser en jouant », langue française, UGS `studuel-ios`.
- **Coque iPhone** : `natif/ios/` (Capacitor 8, projet à part, ignoré par ESLint, TypeScript et Vercel).
  - Ouvre `https://studuel.app/lancement.html?canal=ios`.
  - iPhone seulement (pas d'iPad : pas de captures iPad à fournir), portrait seulement.
  - Version 1.0.0. `ITSAppUsesNonExemptEncryption = false` (pas de question d'export à chaque envoi).
  - Sans réseau, la page locale `www/hors-ligne.html` s'affiche et propose de réessayer.
  - Icône : l'icône Play (`assets-sources/play-store/icone-512.png`) agrandie à 1024 px. Pour la refaire : `natif/ios/assets/`, puis `npm run icones` dans `natif/ios`.

## Le canal « ios » : aucun achat en euros

Apple exige son propre paiement pour tout contenu numérique, comme Google. L'app iPhone suit donc la voie A
du Play Store (`lib/canal.ts`) : `?canal=ios` pose le même cookie `studuel_canal=play`, et le serveur cache
Studuel+, les packs de gemmes, les recharges de Marcel et le paiement des capsules par carte. Le WebView de
l'app a ses propres cookies : Safari n'est pas touché.

## Captures iPhone

Les neuf captures 6,9″ (1320 × 2868, PNG sans alpha) sont dans `assets-sources/app-store/iphone-6.9/`
(`01-reviser` → `09-parents`). Ce sont les scènes et les textes du kit Play Store v2 validé par Lucas le
25/10/2026 (`docs/google-play.md`, « Fiche du Store »), refaites au format iPhone : même fond à rayons,
même téléphone incliné, mêmes poses de Marcel. Le titre prend la place gagnée en haut. Aucune n'affiche
de prix en euros. On en envoie huit au plus ; « 09-parents » reste en réserve, comme sur Google Play.

Pour les refaire : `node assets-sources/app-store/rendre-iphone.mjs [scène…]` depuis la racine du dépôt
(Playwright et sharp du projet). Les captures d'écran brutes du kit Play n'existent plus : le script
récupère le téléphone dans les PNG de `assets-sources/play-store/v2/`. Il rejoue la scène v2 pour isoler
Marcel et les objets, les retire du PNG, puis redessine en pleine résolution le fond, le titre, Marcel
et les objets. Pour changer l'écran d'une capture, il faut d'abord refaire la capture Play v2.
`assets-sources/` est ignoré par git : ces fichiers ne vivent que sur le PC de Lucas.

## Reste à faire

1. **Contrat « Apps payantes »** (App Store Connect → Business). Il n'est pas obligatoire pour une app gratuite
   sans achat intégré, mais il faut renseigner le statut de commerçant (règlement européen DSA).
2. **Construire l'app** : il n'y a pas de Mac. Codemagic construit `natif/ios/ios/App` et l'envoie sur
   TestFlight (clé API App Store Connect à créer par Lucas).
3. **Fiche** : captures iPhone prêtes (ci-dessus), description (reprendre `docs/google-play.md`),
   URL de confidentialité `https://studuel.app/confidentialite`, catégorie Éducation, classification d'âge.
   Ne pas cocher la catégorie « Enfants » : elle interdit tout outil d'analyse tiers.
4. **Compte de démonstration pour Apple** : la revue se connecte. Créer un compte élève de test et le
   donner dans « Informations sur la revue de l'app ».
5. **Risque de refus 4.2** (app qui ne fait qu'afficher un site) : Studuel a beaucoup de contenu interactif,
   ce qui joue pour nous. Si Apple refuse quand même, ajouter du natif : rappels locaux
   (`@capacitor/local-notifications`), vibrations sur les duels, partage natif.
6. Les notifications web (`lib/push-client.ts`) n'existent pas dans le WebView iPhone : `pushDisponible()`
   répond non et l'app le dit. Des notifications iPhone demanderaient APNs (plus tard).
