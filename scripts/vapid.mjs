// Génère la paire de clés VAPID des notifications push, et imprime EXACTEMENT
// ce qu'il faut coller — dans Vercel, puis dans .env.local.
//
//   node scripts/vapid.mjs
//
// POURQUOI CE SCRIPT EXISTE : au 01/08/2026, tout le push est écrit et testé
// (`app/api/push/subscribe`, `app/api/push/send`, `lib/notifications`, le cron
// GitHub Actions), et RIEN ne peut partir : il manque trois variables
// d'environnement. C'est le meilleur rapport valeur/effort du dépôt — deux
// minutes de configuration réveillent un levier de rétention complet. Autant
// que ces deux minutes ne demandent pas d'aller chercher comment on fait.
//
// ⚠️ Les clés générées sont un SECRET (la privée surtout) : ne jamais les
// commiter. Elles ne sont imprimées qu'ici, dans ton terminal.
//
// ⚠️ Régénérer une paire INVALIDE tous les abonnements existants : les
// navigateurs ont mémorisé la clé publique. Si le push tourne déjà, ne relance
// ce script que pour une rotation volontaire — et sache que chaque élève devra
// réactiver ses notifications.

import webpush from 'web-push'

const { publicKey, privateKey } = webpush.generateVAPIDKeys()

const sujet = process.argv[2] ?? 'mailto:contact@studuel.app'

console.log(`
╭──────────────────────────────────────────────────────────────────────╮
│  Clés VAPID générées — à poser à DEUX endroits                       │
╰──────────────────────────────────────────────────────────────────────╯

1) VERCEL → Settings → Environment Variables (Production + Preview)
   ─────────────────────────────────────────────────────────────────
   NEXT_PUBLIC_VAPID_PUBLIC_KEY = ${publicKey}
   VAPID_PUBLIC_KEY             = ${publicKey}
   VAPID_PRIVATE_KEY            = ${privateKey}
   VAPID_SUBJECT                = ${sujet}

   La clé publique est présente DEUX fois, et c'est normal :
     · NEXT_PUBLIC_… part dans le navigateur (components/NotificationsOptIn
       en a besoin pour s'abonner) ;
     · la version sans préfixe reste côté serveur (app/api/push/send).

2) .env.local (pour tester en local)
   ─────────────────────────────────
   Colle les mêmes quatre lignes.

3) Redéployer Vercel (les variables ne sont lues qu'au build).

4) Vérifier — dans cet ordre :
   · migrations 195 (journal d'envoi) et 196 (appareil familial) exécutées ;
   · activer les notifications depuis l'app (écran Moi) sur un vrai téléphone ;
   · déclencher un envoi de test :
       curl -H "Authorization: Bearer $CRON_SECRET" \\
            "https://studuel.vercel.app/api/push/send?type=srs&force=1"
     Une réponse 503 « push not configured » = les variables ne sont pas là.

Sans ces variables, /api/push/send répond 503 et le cron tourne à vide.
`)
