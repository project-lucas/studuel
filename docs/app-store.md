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

## Reste à faire

1. **Contrat « Apps payantes »** (App Store Connect → Business). Il n'est pas obligatoire pour une app gratuite
   sans achat intégré, mais il faut renseigner le statut de commerçant (règlement européen DSA).
2. **Construire l'app** : il n'y a pas de Mac. Codemagic construit `natif/ios/ios/App` et l'envoie sur
   TestFlight (clé API App Store Connect à créer par Lucas).
3. **Fiche** : captures iPhone 6,9″ (1320 × 2868) ou 6,5″, description (reprendre `docs/google-play.md`),
   URL de confidentialité `https://studuel.app/confidentialite`, catégorie Éducation, classification d'âge.
   Ne pas cocher la catégorie « Enfants » : elle interdit tout outil d'analyse tiers.
4. **Compte de démonstration pour Apple** : la revue se connecte. Créer un compte élève de test et le
   donner dans « Informations sur la revue de l'app ».
5. **Risque de refus 4.2** (app qui ne fait qu'afficher un site) : Studuel a beaucoup de contenu interactif,
   ce qui joue pour nous. Si Apple refuse quand même, ajouter du natif : rappels locaux
   (`@capacitor/local-notifications`), vibrations sur les duels, partage natif.
6. Les notifications web (`lib/push-client.ts`) n'existent pas dans le WebView iPhone : `pushDisponible()`
   répond non et l'app le dit. Des notifications iPhone demanderaient APNs (plus tard).
