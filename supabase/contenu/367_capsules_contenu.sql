-- =============================================================================
-- 367 — LE CONTENU DES SIX CAPSULES DE LANCEMENT (Lucas, 18/09/2026)
--
-- Remplit le catalogue de la Boutique (table `capsules`) et, pour chaque
-- capsule, ses quatre éléments (table `capsule_elements`) : un COURS court,
-- une FICHE récap, un QUIZ de 8 questions et un OUTIL pratique (liste à
-- cocher, planning ou calculateur). Les formes JSON suivent lib/capsules.ts
-- (`lireCapsule`, `lireContenu`).
--
--   sommeil      Bien-être     calculateur (modèle « sommeil »)
--   nutrition    Bien-être     liste à cocher
--   stress       Bien-être     liste à cocher
--   methode      Méthode       planning de la semaine
--   argent       Vie pratique  calculateur (modèle « budget »)
--   orientation  Avenir        liste à cocher
--
-- Les prix (gemmes, euros) sont provisoires : ils se règlent en base, sans
-- toucher au code. Rejouer ce fichier remet titres, textes et prix à ces
-- valeurs (ON CONFLICT … DO UPDATE) ; la colonne `publiee` n’est pas touchée.
--
-- PRÉREQUIS : 366 (tables capsules et capsule_elements). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ----------------------------------------------------------------- catalogue

INSERT INTO public.capsules
  (id, theme, titre, accroche, emoji, teinte, prix_gemmes, prix_euros, duree_min, au_programme, badge, ordre)
VALUES
  ('sommeil', 'bien-etre', 'Le sommeil, ton super-pouvoir',
   'Dors mieux, retiens plus : ton cerveau bosse pendant la nuit.',
   '😴', 'ocean', 60, NULL, 10,
   ARRAY['Pourquoi le sommeil range tes leçons', 'Les cycles de 90 minutes et l’heure du coucher', 'Écrans, week-ends : les pièges à éviter'],
   'Pro du sommeil', 10),
  ('nutrition', 'bien-etre', 'Bien manger pour bien penser',
   'Le bon carburant pour rester concentré du matin au soir.',
   '🥗', 'menthe', 120, NULL, 10,
   ARRAY['Un petit-déjeuner qui tient jusqu’à midi', 'Boire assez pour garder les idées claires', 'Goûter et coup de barre : les bons réflexes'],
   'As du carburant', 20),
  ('stress', 'bien-etre', 'Stress : reprends les commandes',
   'Apprivoise ton stress, avant les contrôles comme au quotidien.',
   '🧘', 'prune', 150, 1.99, 12,
   ARRAY['Comprendre ce que le stress fait à ton corps', 'Respirer 5 secondes, souffler 5 secondes', 'Une routine pour la veille et le jour J'],
   'Maître zen', 30),
  ('methode', 'methode', 'Réviser malin, pas plus longtemps',
   'La méthode pour retenir plus, sans travailler plus.',
   '🎯', 'violet', 250, 2.99, 12,
   ARRAY['Planifier ta semaine sans y passer des heures', 'Te tester et espacer tes révisions', 'Rester concentré, même avec un téléphone'],
   'Stratège des révisions', 40),
  ('argent', 'vie-pratique', 'Ton argent, tes règles',
   'Gère ton argent de poche et atteins tes objectifs.',
   '💶', 'soleil', 300, 2.99, 12,
   ARRAY['Faire la différence entre besoin et envie', 'Épargner pour un objectif, pas à pas', 'Achats dans les jeux, arnaques et première carte'],
   'Boss du budget', 50),
  ('orientation', 'avenir', 'Trouve ta voie, pas à pas',
   'Explore les métiers et comprends ton parcours, de la 6e au bac.',
   '🧭', 'corail', 500, 4.99, 15,
   ARRAY['Explorer tes goûts et découvrir des métiers', 'Les grandes étapes : stages, voies, spécialités', 'Le calendrier de Parcoursup en terminale'],
   'Cap sur l’avenir', 60)
ON CONFLICT (id) DO UPDATE SET
  theme = EXCLUDED.theme,
  titre = EXCLUDED.titre,
  accroche = EXCLUDED.accroche,
  emoji = EXCLUDED.emoji,
  teinte = EXCLUDED.teinte,
  prix_gemmes = EXCLUDED.prix_gemmes,
  prix_euros = EXCLUDED.prix_euros,
  duree_min = EXCLUDED.duree_min,
  au_programme = EXCLUDED.au_programme,
  badge = EXCLUDED.badge,
  ordre = EXCLUDED.ordre;

-- ------------------------------------------- sommeil — Le sommeil, ton super-pouvoir

INSERT INTO public.capsule_elements (capsule_id, type, titre, contenu) VALUES
  ('sommeil', 'cours', 'Le cours', $j${
  "intro": "Tu passes environ un tiers de ta vie à dormir. Du temps perdu ? Pas du tout : c’est la nuit que ton cerveau range ce que tu as appris et que ton corps récupère. Voici comment faire de ton sommeil un allié pour l’école.",
  "sections": [
    {
      "titre": "Ce qui se passe quand tu dors",
      "texte": [
        "Dormir, ce n’est pas éteindre la machine. Pendant la nuit, ton cerveau reste très actif : il trie les informations de la journée, garde les plus utiles et les range dans ta mémoire à long terme. La leçon apprise le soir se consolide pendant que tu dors.",
        "Ton corps en profite aussi : il répare tes muscles, fabrique l’hormone de croissance et renforce tes défenses contre les microbes. Après une mauvaise nuit, tu es plus vite fatigué, plus irritable et tu retiens moins bien."
      ],
      "astuce": "Juste avant de dormir, relis tes points clés sur papier ou à voix haute, pas sur un écran : ton cerveau travaillera dessus pendant la nuit."
    },
    {
      "titre": "Combien d’heures te faut-il ?",
      "texte": [
        "À ton âge, il faut en général entre 8 et 10 heures de sommeil par nuit, souvent un peu plus au début du collège. C’est plus que les adultes : ton corps et ton cerveau sont encore en pleine construction.",
        "Petit problème : à l’adolescence, l’horloge interne se décale. La mélatonine, l’hormone qui donne envie de dormir, arrive plus tard le soir. Tu n’as pas sommeil à 21 h, mais le réveil sonne toujours à 7 h. Beaucoup d’ados accumulent ainsi une vraie dette de sommeil.",
        "Les signes qui ne trompent pas : du mal à te lever, envie de dormir en cours, grasses matinées interminables le week-end. Si tu te reconnais, ton corps te réclame des heures en plus."
      ],
      "astuce": "Calcule à rebours : si tu te lèves à 7 h et qu’il te faut 9 heures, ta lumière doit être éteinte vers 21 h 45, en comptant un quart d’heure pour t’endormir."
    },
    {
      "titre": "Les cycles de 90 minutes",
      "texte": [
        "Une nuit est faite de cycles d’environ 90 minutes qui s’enchaînent. Chaque cycle passe par un sommeil léger, puis un sommeil profond qui répare le corps, puis le sommeil paradoxal, celui des rêves, qui aide à ranger les souvenirs et les émotions.",
        "Si ton réveil sonne en plein sommeil profond, tu te réveilles groggy, comme dans le brouillard. S’il sonne à la fin d’un cycle, le lever est bien plus facile. Six cycles, c’est 9 heures : un bon objectif pour la plupart des ados."
      ],
      "astuce": "90 minutes, c’est une moyenne. Si tu te réveilles souvent fatigué, décale ton coucher de 15 minutes et observe ce qui change."
    },
    {
      "titre": "Les ennemis du sommeil",
      "texte": [
        "Premier ennemi : les écrans le soir. Leur lumière fait croire à ton cerveau qu’il fait encore jour et retarde l’endormissement. Surtout, les vidéos qui s’enchaînent, les jeux et les messages te gardent éveillé bien plus longtemps que prévu.",
        "Deuxième ennemi : les notifications. Un téléphone qui vibre sur la table de nuit peut te tirer d’un sommeil profond sans même que tu t’en souviennes. Troisième ennemi : la caféine du café, du thé, de certains sodas et des boissons énergisantes, qui agit encore plusieurs heures après.",
        "Dernier piège : réviser tard dans la nuit avant un contrôle. Tu gagnes une heure de révision, mais tu perds le sommeil qui aurait fixé ce que tu viens d’apprendre. Une nuit blanche fait souvent perdre plus de points qu’elle n’en fait gagner."
      ],
      "astuce": "Le soir, laisse ton téléphone charger hors de ta chambre et utilise un vrai réveil. C’est le geste le plus simple, et celui qui change le plus de choses."
    },
    {
      "titre": "Une routine qui marche",
      "texte": [
        "Ton horloge interne adore la régularité. Couche-toi et lève-toi à peu près aux mêmes heures tous les jours, y compris le week-end, à une ou deux heures près. Les grasses matinées géantes dérèglent ton horloge et rendent le lundi encore plus dur.",
        "Crée un rituel du soir : ranger ton sac, prendre une douche, lire quelques pages d’un livre papier. Ta chambre doit être fraîche, sombre et calme. Le matin, ouvre les volets : la lumière du jour est le meilleur signal de réveil pour ton cerveau.",
        "Un coup de fatigue en journée ? Une sieste de 20 minutes maximum, en début d’après-midi, peut te remettre d’aplomb sans gâcher ta nuit."
      ]
    }
  ]
}$j$::jsonb),
  ('sommeil', 'fiche', 'La fiche récap', $j${
  "points": [
    {
      "titre": "Le sommeil fait apprendre",
      "texte": "Pendant la nuit, ton cerveau trie et range ce que tu as appris dans la journée. Dormir fait partie du travail."
    },
    {
      "titre": "8 à 10 heures par nuit",
      "texte": "C’est le besoin moyen à ton âge. Réveil difficile, envie de dormir en cours et grasses matinées géantes sont des signes de manque."
    },
    {
      "titre": "Des cycles de 90 minutes",
      "texte": "La nuit enchaîne des cycles d’environ 90 minutes. Se réveiller en fin de cycle rend le lever plus facile."
    },
    {
      "titre": "Écrans et notifications, dehors",
      "texte": "Les écrans du soir retardent l’endormissement. Le téléphone passe la nuit hors de la chambre."
    },
    {
      "titre": "Des horaires réguliers",
      "texte": "Mêmes heures de coucher et de lever, même le week-end, à une ou deux heures près."
    },
    {
      "titre": "Pas de nuit blanche avant un contrôle",
      "texte": "Dormir après avoir révisé fixe les connaissances. Veiller tard fait perdre plus que ça ne rapporte."
    }
  ],
  "aRetenir": "Une bonne nuit, c’est une révision que tu fais en dormant."
}$j$::jsonb),
  ('sommeil', 'quiz', 'Le quiz', $j${
  "questions": [
    {
      "question": "Que fait ton cerveau pendant que tu dors ?",
      "choix": [
        "Il s’éteint complètement jusqu’au matin",
        "Il trie et range ce que tu as appris dans la journée",
        "Il efface les leçons pour faire de la place",
        "Il ne fait rien d’utile pour l’école"
      ],
      "bonne": 1,
      "explication": "Le cerveau reste actif la nuit : il consolide les apprentissages de la journée dans la mémoire à long terme."
    },
    {
      "question": "Combien d’heures de sommeil faut-il en général à un ado ?",
      "choix": [
        "5 à 6 heures",
        "6 à 7 heures",
        "8 à 10 heures",
        "12 à 14 heures"
      ],
      "bonne": 2,
      "explication": "Entre 8 et 10 heures par nuit, souvent un peu plus au début du collège : c’est plus que pour un adulte."
    },
    {
      "question": "Combien de temps dure environ un cycle de sommeil ?",
      "choix": [
        "90 minutes",
        "15 minutes",
        "30 minutes",
        "3 heures"
      ],
      "bonne": 0,
      "explication": "Un cycle dure environ 90 minutes, et plusieurs cycles s’enchaînent au cours de la nuit."
    },
    {
      "question": "Pourquoi as-tu souvent moins sommeil le soir à l’adolescence ?",
      "choix": [
        "Parce que tu fais moins de sport",
        "Parce que tu as besoin de moins de sommeil qu’un enfant",
        "Parce que les journées de cours sont plus longues",
        "Parce que ton horloge interne se décale et que la mélatonine arrive plus tard"
      ],
      "bonne": 3,
      "explication": "À l’adolescence, l’horloge interne se décale : la mélatonine, qui donne envie de dormir, arrive plus tard le soir."
    },
    {
      "question": "Ton réveil sonne en plein sommeil profond. Que se passe-t-il ?",
      "choix": [
        "Tu te réveilles en pleine forme",
        "Tu te réveilles groggy, comme dans le brouillard",
        "Tu te rendors forcément",
        "Rien de particulier"
      ],
      "bonne": 1,
      "explication": "Se réveiller en plein sommeil profond donne cette sensation de brouillard ; en fin de cycle, le lever est plus facile."
    },
    {
      "question": "Quel geste aide le plus à éviter les écrans du soir ?",
      "choix": [
        "Baisser la luminosité au maximum",
        "Regarder seulement des vidéos courtes",
        "Laisser le téléphone charger hors de la chambre",
        "Glisser le téléphone sous l’oreiller"
      ],
      "bonne": 2,
      "explication": "Hors de la chambre, le téléphone ne te tente plus et ses notifications ne te réveillent plus."
    },
    {
      "question": "La veille d’un contrôle, que vaut-il mieux faire ?",
      "choix": [
        "Réviser toute la nuit pour tout revoir",
        "Boire une boisson énergisante pour tenir",
        "Ne pas dormir pour ne rien oublier",
        "Réviser un peu, puis dormir normalement"
      ],
      "bonne": 3,
      "explication": "Le sommeil fixe ce que tu as révisé : une nuit blanche fait souvent perdre plus de points qu’elle n’en fait gagner."
    },
    {
      "question": "Le week-end, quel conseil garder pour ton sommeil ?",
      "choix": [
        "Garder à peu près les mêmes horaires, à une ou deux heures près",
        "Dormir jusqu’à midi pour rattraper la semaine",
        "Se coucher le plus tard possible",
        "Faire une sieste de trois heures l’après-midi"
      ],
      "bonne": 0,
      "explication": "Ton horloge interne aime la régularité : de trop gros décalages le week-end rendent le lundi matin plus difficile."
    }
  ]
}$j$::jsonb),
  ('sommeil', 'outil', 'Ton calculateur de coucher', $j${
  "kind": "calculateur",
  "modele": "sommeil",
  "intro": "Indique l’heure à laquelle tu dois te lever : le calculateur te propose les heures de coucher qui tombent pile sur des fins de cycles de 90 minutes, en comptant environ 15 minutes pour t’endormir."
}$j$::jsonb)
ON CONFLICT (capsule_id, type) DO UPDATE SET
  titre = EXCLUDED.titre,
  contenu = EXCLUDED.contenu;

-- ------------------------------------------- nutrition — Bien manger pour bien penser

INSERT INTO public.capsule_elements (capsule_id, type, titre, contenu) VALUES
  ('nutrition', 'cours', 'Le cours', $j${
  "intro": "Ton cerveau est un gros consommateur d’énergie : au repos, il utilise à lui seul environ un cinquième de ce dont ton corps a besoin. Pour rester concentré en cours, il lui faut un carburant régulier et varié, et de l’eau. Pas de régime ni d’aliment interdit ici : juste des repères simples pour avoir de l’énergie toute la journée, en continuant à te faire plaisir.",
  "sections": [
    {
      "titre": "Ton cerveau a besoin de carburant",
      "texte": [
        "Le matin, ton corps n’a rien reçu depuis dix ou douze heures. Sans carburant, l’attention baisse vite : tu décroches plus facilement, tu retiens moins bien et tu deviens plus irritable.",
        "Ce qui compte, ce n’est pas un aliment magique, c’est la régularité et la variété. Des repas à peu près aux mêmes heures, avec un peu de tout, donnent une énergie stable. Des fruits et des légumes de couleurs différentes apportent des vitamines différentes.",
        "Le jour d’un contrôle, mange comme d’habitude : ce n’est pas le moment de sauter un repas ni de tester un plat inconnu."
      ],
      "astuce": "Cette semaine, goûte un fruit ou un légume que tu ne manges presque jamais : la variété se construit par petits essais."
    },
    {
      "titre": "Le petit-déjeuner qui tient jusqu’à midi",
      "texte": [
        "Un bon petit-déjeuner combine plusieurs familles : un féculent (pain, céréales, flocons d’avoine) pour une énergie qui dure, une source de protéines (lait, yaourt, fromage, œuf) pour tenir sans fringale, un fruit et une boisson.",
        "Tu n’as jamais faim le matin ? Ça arrive souvent. Commence petit : un verre de lait, un yaourt ou un fruit. Et glisse dans ton sac de quoi manger à la récréation, comme un fruit ou un morceau de pain. Petit à petit, l’appétit du matin revient souvent."
      ],
      "astuce": "Prépare ton bol, ton pain ou tes flocons la veille au soir : le matin, il ne reste plus qu’à t’asseoir cinq minutes."
    },
    {
      "titre": "L’eau, le carburant qu’on oublie",
      "texte": [
        "Ton cerveau est très sensible au manque d’eau. Une petite déshydratation suffit à provoquer maux de tête, fatigue et baisse de concentration, souvent avant même que tu aies soif.",
        "À ton âge, on conseille de boire environ 1,5 litre par jour, un peu plus quand il fait chaud ou que tu fais du sport. L’eau est la seule boisson indispensable. Bois régulièrement, par petites gorgées, sans attendre la soif.",
        "Les boissons énergisantes, elles, contiennent beaucoup de caféine et sont déconseillées aux ados : elles donnent un coup de fouet, mais perturbent le sommeil et peuvent faire battre le cœur trop vite."
      ],
      "astuce": "Garde une gourde dans ton sac et remplis-la à chaque récréation : boire devient un réflexe."
    },
    {
      "titre": "Le coup de barre de l’après-midi",
      "texte": [
        "Vers 14 h, beaucoup d’élèves piquent du nez. C’est normal : ton horloge interne a un petit creux en début d’après-midi, et la digestion demande de l’énergie. Ce n’est pas un défaut, c’est ton corps qui fonctionne.",
        "Pour passer ce cap, prends un repas varié à midi : des légumes, un féculent, une source de protéines, un laitage ou un fruit. Et même si le menu de la cantine ne te plaît pas, ne saute pas le repas : prends au moins le pain, le fromage ou le fruit."
      ],
      "astuce": "Après la cantine, marche cinq minutes dans la cour et bois un verre d’eau : c’est plus efficace que de rester assis."
    },
    {
      "titre": "Le goûter, un vrai repas",
      "texte": [
        "À ton âge, le goûter n’est pas un caprice : c’est un repas utile, surtout si tu dînes tard ou si tu as des devoirs en rentrant. Il recharge les batteries entre la fin des cours et le soir.",
        "Un bon goûter associe par exemple un fruit, un produit laitier et un peu de pain. Il a aussi le droit d’être gourmand : un carré de chocolat ou ton gâteau préféré font partie du plaisir. Aucun aliment n’est interdit, c’est l’ensemble de la journée qui compte.",
        "Prends-le assis, sans écran : devant une vidéo, on goûte à peine ce qu’on mange. Puis attaque tes devoirs, ton cerveau aura de quoi tenir."
      ]
    }
  ]
}$j$::jsonb),
  ('nutrition', 'fiche', 'La fiche récap', $j${
  "points": [
    {
      "titre": "Des repas réguliers",
      "texte": "Trois repas et un goûter, à peu près aux mêmes heures, donnent une énergie stable. Sauter un repas fait décrocher."
    },
    {
      "titre": "Un petit-déjeuner complet",
      "texte": "Un féculent, une source de protéines, un fruit et une boisson. Pas faim le matin ? Commence petit et emporte de quoi manger à la récré."
    },
    {
      "titre": "De l’eau, souvent",
      "texte": "Environ 1,5 litre par jour, par petites gorgées, sans attendre la soif. La gourde est ta meilleure amie."
    },
    {
      "titre": "Le creux de 14 h est normal",
      "texte": "Un déjeuner varié, quelques minutes de marche et un verre d’eau aident à passer le cap."
    },
    {
      "titre": "Le goûter compte",
      "texte": "Un fruit, un produit laitier, du pain et une touche de plaisir. Assis, et sans écran."
    },
    {
      "titre": "Variété et plaisir",
      "texte": "Aucun aliment n’est interdit : c’est la variété sur toute la journée qui te donne de l’énergie."
    }
  ],
  "aRetenir": "Un cerveau bien nourri et bien hydraté, c’est un cerveau qui suit en cours."
}$j$::jsonb),
  ('nutrition', 'quiz', 'Le quiz', $j${
  "questions": [
    {
      "question": "Pourquoi le petit-déjeuner est-il important ?",
      "choix": [
        "Parce que ton corps n’a rien reçu depuis dix à douze heures",
        "Parce qu’il remplace le déjeuner",
        "Parce qu’il faut manger le plus possible le matin",
        "Parce qu’il empêche d’avoir soif de la journée"
      ],
      "bonne": 0,
      "explication": "Après la nuit, ton cerveau a besoin de refaire le plein pour rester attentif pendant la matinée."
    },
    {
      "question": "Quel petit-déjeuner est le plus complet ?",
      "choix": [
        "Un jus de fruit seul, bu en courant",
        "Rien du tout, pour avoir plus faim à midi",
        "Du pain, un yaourt, une pomme et un verre d’eau",
        "Un café avalé debout"
      ],
      "bonne": 2,
      "explication": "Il réunit un féculent, une source de protéines, un fruit et une boisson : de quoi tenir jusqu’à midi."
    },
    {
      "question": "Tu n’as jamais faim le matin. Que peux-tu faire ?",
      "choix": [
        "Ne rien manger jusqu’au soir",
        "Commencer petit et emporter de quoi manger à la récré",
        "Attendre le déjeuner sans rien boire",
        "Boire une boisson énergisante"
      ],
      "bonne": 1,
      "explication": "Un verre de lait, un yaourt ou un fruit suffisent pour commencer, avec un en-cas pour la récréation."
    },
    {
      "question": "Combien de liquide conseille-t-on de boire environ par jour à ton âge ?",
      "choix": [
        "Un demi-verre",
        "Seulement quand on a très soif",
        "Au moins 5 litres",
        "Environ 1,5 litre"
      ],
      "bonne": 3,
      "explication": "Environ 1,5 litre par jour, un peu plus quand il fait chaud ou que tu fais du sport."
    },
    {
      "question": "Un manque d’eau, même léger, peut provoquer…",
      "choix": [
        "Une meilleure mémoire",
        "Des maux de tête et une baisse de concentration",
        "Un sommeil plus profond",
        "Rien du tout"
      ],
      "bonne": 1,
      "explication": "Le cerveau est très sensible au manque d’eau, souvent avant même qu’on ressente la soif."
    },
    {
      "question": "Pourquoi a-t-on souvent un coup de barre vers 14 h ?",
      "choix": [
        "Parce que l’horloge interne a un creux et que la digestion demande de l’énergie",
        "Parce qu’on est paresseux",
        "Parce qu’on a bu trop d’eau le matin",
        "Parce que les cours de l’après-midi sont plus faciles"
      ],
      "bonne": 0,
      "explication": "Ce creux est normal : c’est le fonctionnement de ton corps, pas un défaut."
    },
    {
      "question": "Que faire juste après la cantine pour rester attentif ?",
      "choix": [
        "Faire une sieste de deux heures",
        "Boire une canette de boisson énergisante",
        "Marcher quelques minutes et boire un verre d’eau",
        "Ne plus rien boire de l’après-midi"
      ],
      "bonne": 2,
      "explication": "Bouger un peu et s’hydrater relancent l’attention bien mieux que de rester assis."
    },
    {
      "question": "Quelle phrase est vraie à propos du goûter ?",
      "choix": [
        "Le goûter est réservé aux petits",
        "Le goûter se mange le plus vite possible, devant un écran",
        "Certains aliments sont strictement interdits au goûter",
        "C’est un vrai repas, qui peut être à la fois utile et gourmand"
      ],
      "bonne": 3,
      "explication": "Le goûter recharge les batteries avant les devoirs, et il a le droit d’être gourmand."
    }
  ]
}$j$::jsonb),
  ('nutrition', 'outil', 'Ta checklist énergie', $j${
  "kind": "checklist",
  "intro": "Coche ce que tu as fait aujourd’hui. Pas besoin d’être parfait : essaie simplement d’ajouter une case de plus demain.",
  "items": [
    "Mon petit-déjeuner a un féculent (pain, céréales, flocons)",
    "Mon petit-déjeuner a une source de protéines (lait, yaourt, œuf)",
    "J’ai mangé au moins un fruit dans la journée",
    "J’ai une gourde dans mon sac",
    "J’ai bu un verre d’eau à chaque récréation",
    "J’ai pris un vrai repas à midi, sans le sauter",
    "J’ai marché quelques minutes après la cantine",
    "J’ai pris mon goûter assis, sans écran",
    "J’ai goûté un aliment que je mange rarement"
  ]
}$j$::jsonb)
ON CONFLICT (capsule_id, type) DO UPDATE SET
  titre = EXCLUDED.titre,
  contenu = EXCLUDED.contenu;

-- ------------------------------------------- stress — Stress : reprends les commandes

INSERT INTO public.capsule_elements (capsule_id, type, titre, contenu) VALUES
  ('stress', 'cours', 'Le cours', $j${
  "intro": "Le cœur qui s’emballe avant un contrôle, le ventre noué avant de passer au tableau, les pensées qui tournent le soir dans ton lit : tout le monde connaît le stress. Bonne nouvelle, il n’a rien d’anormal, et il se dompte. Voici comment le comprendre, le calmer et même t’en servir.",
  "sections": [
    {
      "titre": "Le stress, une alarme utile",
      "texte": [
        "Le stress est une réaction naturelle de ton corps face à un défi. Ton cerveau croit détecter un danger et déclenche une alarme : ton cœur accélère, ta respiration devient plus rapide, tes muscles se tendent.",
        "Un peu de stress, c’est utile : il te rend plus attentif, plus rapide, plus motivé, comme juste avant un match ou un exposé. Le problème arrive quand l’alarme sonne trop fort ou trop longtemps : elle bloque au lieu d’aider, et peut provoquer le fameux trou de mémoire.",
        "Apprends à repérer tes signaux : mains moites, ventre noué, gorge serrée, mal de tête, sommeil agité, envie de tout éviter. Les repérer tôt, c’est déjà reprendre un peu la main."
      ],
      "astuce": "Quand tu sens le stress monter, dis-toi : « Tiens, c’est mon alarme qui sonne. » Mettre un mot dessus aide déjà à la calmer."
    },
    {
      "titre": "Respirer pour calmer l’alarme",
      "texte": [
        "Ta respiration est la télécommande de ton stress. Tu ne peux pas ralentir ton cœur par la volonté, mais tu peux ralentir ta respiration, et ton cœur suit. C’est le principe de la cohérence cardiaque.",
        "Inspire lentement par le nez pendant 5 secondes en gonflant le ventre, puis expire doucement par la bouche pendant 5 secondes. Continue ainsi 3 à 5 minutes. Ça marche en classe, dans le bus ou dans ton lit, et personne ne le remarque."
      ],
      "astuce": "Entraîne-toi trois fois par jour pendant une semaine, quand tout va bien : au réveil, avant le déjeuner, avant de dormir. Le jour du contrôle, ton corps saura faire."
    },
    {
      "titre": "Se préparer, c’est se rassurer",
      "texte": [
        "Le meilleur antistress, c’est de savoir que tu es prêt. Réviser en plusieurs fois, quelques jours avant, rassure bien plus que tout relire la veille. Entraîne-toi comme le jour J : fais des exercices, teste-toi sans regarder le cours.",
        "La veille, fais une dernière révision légère, puis arrête. Dormir est plus utile qu’une heure de révision de plus : c’est la nuit que ton cerveau fixe ce que tu as appris.",
        "Le matin, prends un petit-déjeuner, même léger, et pars un peu en avance. Évite les discussions de dernière minute du genre « Moi, j’ai tout appris ! » : elles font monter la pression pour rien."
      ],
      "astuce": "Prépare ton sac la veille avec tout le matériel et pose-le près de la porte : une source de stress en moins le matin."
    },
    {
      "titre": "Pendant le contrôle",
      "texte": [
        "Respire calmement une minute, puis lis tout le sujet avant d’écrire. Commence par les questions que tu sais faire : chaque réussite rassure ton cerveau et relance la machine.",
        "Un trou de mémoire ? C’est fréquent sous stress. Pose ton stylo, fais trois respirations lentes, passe à la question suivante et reviens plus tard. Souvent, la réponse revient quand la pression retombe.",
        "Surveille aussi ta petite voix intérieure. Remplace « Je vais rater » par « J’ai révisé, je fais de mon mieux, question par question ». Parle-toi comme tu parlerais à un ami."
      ]
    },
    {
      "titre": "Au quotidien, et quand c’est trop lourd",
      "texte": [
        "Contre le stress de tous les jours, trois alliés : le sommeil, qui recharge tes batteries ; le mouvement, car le sport et même une simple marche évacuent la tension ; et les moments qui te font du bien, comme la musique ou rire avec tes amis. Une note mesure un travail à un moment donné, pas ta valeur.",
        "Parfois, le stress ne part pas. Il dure des semaines, t’empêche de dormir, te donne envie d’éviter l’école ou se mêle à une grosse tristesse. Ce n’est pas un signe de faiblesse, et personne ne devrait affronter ça sans aide.",
        "Parles-en à un adulte de confiance : un parent, un professeur, le CPE, l’infirmière ou le psychologue de l’Éducation nationale de ton établissement. Tu peux aussi appeler Fil Santé Jeunes au 0 800 235 236 : c’est anonyme et gratuit. Et si tu as des idées noires, n’attends pas : le 3114 répond jour et nuit."
      ],
      "astuce": "Enregistre dès maintenant le numéro de Fil Santé Jeunes dans ton téléphone : 0 800 235 236. Le jour où toi ou un ami en aurez besoin, il sera là."
    }
  ]
}$j$::jsonb),
  ('stress', 'fiche', 'La fiche récap', $j${
  "points": [
    {
      "titre": "Le stress est normal",
      "texte": "C’est une alarme naturelle du corps. Un peu de stress aide à se concentrer, trop de stress bloque."
    },
    {
      "titre": "Repère tes signaux",
      "texte": "Cœur qui s’emballe, ventre noué, mains moites, sommeil agité : les reconnaître, c’est déjà reprendre la main."
    },
    {
      "titre": "Respiration 5-5",
      "texte": "Inspire 5 secondes par le nez, expire 5 secondes par la bouche, pendant 3 à 5 minutes. Entraîne-toi quand tout va bien."
    },
    {
      "titre": "La préparation rassure",
      "texte": "Réviser en plusieurs fois et se tester vaut mieux que tout relire la veille. Le soir d’avant : sac prêt, puis au lit."
    },
    {
      "titre": "Le jour J",
      "texte": "Lis tout le sujet, commence par ce que tu sais faire et, en cas de trou, respire et passe à la suite."
    },
    {
      "titre": "Demander de l’aide, c’est fort",
      "texte": "Si le stress ou la tristesse durent ou pèsent trop, parles-en à un adulte de confiance, à l’infirmière ou au psychologue de l’Éducation nationale, ou appelle Fil Santé Jeunes au 0 800 235 236 (anonyme et gratuit)."
    }
  ],
  "aRetenir": "Ton stress est une alarme : respire, prépare-toi, et si elle sonne trop fort, parles-en."
}$j$::jsonb),
  ('stress', 'quiz', 'Le quiz', $j${
  "questions": [
    {
      "question": "Qu’est-ce que le stress ?",
      "choix": [
        "Une maladie grave",
        "Une réaction naturelle du corps face à un défi",
        "La preuve qu’on n’est pas doué",
        "Quelque chose qui n’arrive qu’aux adultes"
      ],
      "bonne": 1,
      "explication": "Le stress est une alarme naturelle que le corps déclenche face à un défi : tout le monde la connaît."
    },
    {
      "question": "Un peu de stress avant un contrôle peut…",
      "choix": [
        "Te rendre plus attentif et plus motivé",
        "Effacer tout ce que tu as appris",
        "Te faire perdre des points à coup sûr",
        "N’avoir aucun effet sur toi"
      ],
      "bonne": 0,
      "explication": "À petite dose, le stress aide : il rend plus attentif et plus rapide. C’est quand il est trop fort qu’il bloque."
    },
    {
      "question": "Comment se pratique la respiration de cohérence cardiaque ?",
      "choix": [
        "Inspirer 1 seconde, expirer 10 secondes",
        "Retenir sa respiration le plus longtemps possible",
        "Inspirer 5 secondes, expirer 5 secondes, pendant 3 à 5 minutes",
        "Respirer très vite pour se réveiller"
      ],
      "bonne": 2,
      "explication": "5 secondes pour inspirer, 5 secondes pour expirer : ta respiration ralentit, et ton cœur suit."
    },
    {
      "question": "Quand faut-il s’entraîner à cette respiration ?",
      "choix": [
        "Seulement le jour du contrôle",
        "Jamais, ça vient tout seul",
        "Uniquement quand on panique",
        "Aussi quand tout va bien, pour qu’elle marche le jour J"
      ],
      "bonne": 3,
      "explication": "Comme un sport, la respiration se travaille : entraînée au calme, elle devient efficace quand tu en as besoin."
    },
    {
      "question": "La veille d’un contrôle, quelle est la meilleure stratégie ?",
      "choix": [
        "Réviser jusqu’à 2 h du matin",
        "Une révision légère, le sac prêt, puis dormir",
        "Tout relire depuis le début de l’année",
        "Jouer toute la soirée pour ne pas y penser"
      ],
      "bonne": 1,
      "explication": "La veille, on révise léger et on dort : c’est la nuit que le cerveau fixe ce qu’on a appris."
    },
    {
      "question": "Pendant le contrôle, tu as un trou de mémoire. Que fais-tu ?",
      "choix": [
        "Tu respires, tu passes à la suite et tu reviens plus tard",
        "Tu rends une copie blanche",
        "Tu restes bloqué sur la question jusqu’à la fin",
        "Tu regardes la copie de ton voisin"
      ],
      "bonne": 0,
      "explication": "Le trou de mémoire est fréquent sous stress : la réponse revient souvent quand la pression retombe."
    },
    {
      "question": "Quelle petite voix intérieure t’aide le plus ?",
      "choix": [
        "« Je vais rater, c’est sûr »",
        "« Les autres sont meilleurs que moi »",
        "« J’ai révisé, je fais de mon mieux, question par question »",
        "« Si je rate, c’est la catastrophe »"
      ],
      "bonne": 2,
      "explication": "Parle-toi comme tu parlerais à un ami : une pensée encourageante calme l’alarme au lieu de l’amplifier."
    },
    {
      "question": "Ton stress dure depuis des semaines et t’empêche de dormir. Que fais-tu ?",
      "choix": [
        "Tu gardes tout pour toi",
        "Tu attends que ça passe tout seul",
        "Tu arrêtes d’aller en cours",
        "Tu en parles à un adulte de confiance ou tu appelles Fil Santé Jeunes"
      ],
      "bonne": 3,
      "explication": "Quand le stress dure ou pèse trop, on en parle : adulte de confiance, infirmière, psychologue de l’Éducation nationale ou Fil Santé Jeunes (0 800 235 236)."
    }
  ]
}$j$::jsonb),
  ('stress', 'outil', 'Ta routine anti-stress', $j${
  "kind": "checklist",
  "intro": "La veille et le jour d’un contrôle, coche chaque étape au fur et à mesure. Une routine qui se répète, c’est une source de stress en moins.",
  "items": [
    "La veille : je fais une dernière révision courte et légère",
    "La veille : je prépare mon sac et tout mon matériel",
    "La veille : je laisse mon téléphone hors de ma chambre",
    "La veille : je fais 3 minutes de respiration 5-5 au lit",
    "La veille : je me couche à mon heure habituelle",
    "Le matin : je prends un petit-déjeuner, même léger",
    "Le matin : je pars un peu en avance",
    "Avant l’épreuve : j’évite les discussions de dernière minute",
    "Au début : je respire une minute et je lis tout le sujet",
    "Pendant l’épreuve : je commence par ce que je sais faire"
  ]
}$j$::jsonb)
ON CONFLICT (capsule_id, type) DO UPDATE SET
  titre = EXCLUDED.titre,
  contenu = EXCLUDED.contenu;

-- ------------------------------------------- methode — Réviser malin, pas plus longtemps

INSERT INTO public.capsule_elements (capsule_id, type, titre, contenu) VALUES
  ('methode', 'cours', 'Le cours', $j${
  "intro": "Relire son cours trois fois en surlignant, tout le monde l’a fait. Pourtant, c’est l’une des façons les moins efficaces d’apprendre. Les chercheurs ont trouvé des méthodes qui marchent bien mieux, et qui ne demandent pas plus de temps. Voici les cinq piliers d’un travail malin.",
  "sections": [
    {
      "titre": "Planifier ta semaine",
      "texte": [
        "Un planning, ce n’est pas une prison, c’est une carte. En début de semaine, prends cinq minutes pour noter tes contrôles, tes devoirs à rendre et tes activités. Tu vois tout de suite les jours chargés et ceux où tu as du temps.",
        "Découpe les gros travaux en petites étapes. « Réviser l’histoire » fait peur ; « Faire les flashcards du chapitre 2 » se fait en quinze minutes. Un contrôle se prépare sur plusieurs jours, jamais seulement la veille.",
        "Garde aussi des cases pour souffler : sport, amis, repos. Mieux vaut un planning modeste que tu tiens qu’un planning parfait que tu abandonnes au bout de deux jours."
      ],
      "astuce": "Chaque dimanche soir, remplis le planning de cette capsule : cinq minutes qui t’évitent des soirées de panique."
    },
    {
      "titre": "Te tester plutôt que relire",
      "texte": [
        "Quand tu relis, tout a l’air familier, et tu as l’impression de savoir. C’est un piège : reconnaître une information, ce n’est pas savoir la retrouver sans aide le jour du contrôle.",
        "La méthode la plus efficace s’appelle la récupération active : ferme ton cahier et essaie de retrouver ce que tu as appris. Réponds à des questions, fais des flashcards, ou écris sur une feuille blanche tout ce dont tu te souviens, puis vérifie. Chaque effort pour retrouver une information la grave plus solidement.",
        "Se tromper fait partie du jeu : une erreur corrigée tout de suite se retient mieux qu’une réponse jamais tentée. Et expliquer une notion à voix haute, comme si tu faisais cours, révèle vite ce que tu n’as pas compris."
      ],
      "astuce": "Après chaque cours, écris trois questions sur ce que tu viens d’apprendre. Le lendemain, réponds-y sans regarder : c’est ta mini-interro maison."
    },
    {
      "titre": "Espacer tes révisions",
      "texte": [
        "Ton cerveau oublie vite : sans révision, une grande partie d’une leçon s’efface en quelques jours. C’est la courbe de l’oubli, et c’est normal. La bonne nouvelle, c’est que chaque révision ralentit l’oubli.",
        "Plutôt que trois heures d’un coup la veille, révise trois fois vingt minutes : le lendemain du cours, quelques jours plus tard, puis la semaine suivante. C’est la répétition espacée : à temps égal, tu retiens plus, et plus longtemps.",
        "Tout apprendre la veille peut sauver un contrôle, mais tout s’envole la semaine suivante. Or les notions s’empilent : ce que tu as oublié te manquera au chapitre d’après."
      ],
      "astuce": "Retiens le rythme J+1, J+3, J+7 : un jour, trois jours et sept jours après le cours."
    },
    {
      "titre": "Protéger ta concentration",
      "texte": [
        "Ton cerveau ne sait pas vraiment faire deux choses à la fois. Quand tu passes de tes devoirs à un message puis reviens, il lui faut du temps pour se reconcentrer. Dix interruptions, et ta soirée de travail est en miettes.",
        "Travaille par blocs courts : 25 minutes sur une seule tâche, puis 5 minutes de vraie pause, loin de l’écran. Après trois ou quatre blocs, fais une pause plus longue. Et prépare ton bureau avant de commencer : tout ton matériel à portée de main, un verre d’eau."
      ],
      "astuce": "Garde un papier à côté de toi : si une idée te traverse la tête pendant un bloc, note-la et occupe-t’en à la pause."
    },
    {
      "titre": "Le téléphone, ton meilleur ennemi",
      "texte": [
        "Le téléphone est conçu pour attirer ton attention : notifications, vidéos qui s’enchaînent, messages. Même retourné sur la table, il occupe une partie de ton esprit, parce qu’une part de toi attend qu’il vibre.",
        "La solution la plus efficace est aussi la plus simple : pendant le travail, il va dans une autre pièce. Si tu en as besoin pour réviser, active le mode avion ou un mode concentration. Fais-en plutôt une récompense : un bloc terminé, cinq minutes de téléphone.",
        "Enfin, le sommeil fait partie de la méthode : c’est la nuit que ton cerveau fixe ce que tu as révisé dans la journée."
      ],
      "astuce": "Aujourd’hui, pose ton téléphone dans une autre pièce pendant un seul bloc de 25 minutes. La différence saute aux yeux."
    }
  ]
}$j$::jsonb),
  ('methode', 'fiche', 'La fiche récap', $j${
  "points": [
    {
      "titre": "Planifie ta semaine",
      "texte": "Cinq minutes le dimanche pour noter contrôles et devoirs, et découper les gros travaux en petites étapes."
    },
    {
      "titre": "Teste-toi",
      "texte": "Fermer le cahier et chercher la réponse fait mieux retenir que relire. Questions, flashcards, feuille blanche."
    },
    {
      "titre": "Espace tes révisions",
      "texte": "Trois fois vingt minutes valent mieux que trois heures la veille. Rythme J+1, J+3, J+7."
    },
    {
      "titre": "Un bloc, une tâche",
      "texte": "25 minutes concentré sur une seule chose, puis 5 minutes de vraie pause."
    },
    {
      "titre": "Téléphone dans une autre pièce",
      "texte": "Même retourné, il capte ton attention. Autre pièce ou mode avion pendant le travail."
    },
    {
      "titre": "Dors sur tes révisions",
      "texte": "C’est la nuit que ton cerveau fixe ce que tu as appris : le sommeil fait partie de la méthode."
    }
  ],
  "aRetenir": "Se tester, espacer, se concentrer : travailler malin bat toujours travailler longtemps."
}$j$::jsonb),
  ('methode', 'quiz', 'Le quiz', $j${
  "questions": [
    {
      "question": "Pourquoi relire son cours n’est-il pas très efficace ?",
      "choix": [
        "Parce que ça fatigue les yeux",
        "Parce que ça donne l’impression de savoir sans vérifier qu’on sait retrouver l’information",
        "Parce que les cours contiennent toujours des erreurs",
        "Parce qu’il vaut mieux tout recopier"
      ],
      "bonne": 1,
      "explication": "Reconnaître une information n’est pas la même chose que savoir la retrouver sans aide le jour du contrôle."
    },
    {
      "question": "Qu’est-ce que la récupération active ?",
      "choix": [
        "Chercher à retrouver l’information de mémoire, cahier fermé",
        "Recopier son cours au propre",
        "Surligner les mots importants",
        "Écouter de la musique en révisant"
      ],
      "bonne": 0,
      "explication": "Chaque effort pour retrouver une information de mémoire la grave plus solidement."
    },
    {
      "question": "Pour un contrôle dans une semaine, quelle organisation est la meilleure ?",
      "choix": [
        "Trois heures la veille au soir",
        "Rien, on verra le jour J",
        "Trois séances de vingt minutes réparties sur la semaine",
        "Une heure le matin même"
      ],
      "bonne": 2,
      "explication": "C’est la répétition espacée : à temps égal, on retient plus, et plus longtemps."
    },
    {
      "question": "Que signifie le rythme J+1, J+3, J+7 ?",
      "choix": [
        "Faire trois contrôles par semaine",
        "Dormir 1, 3 puis 7 heures",
        "Faire 1, 3 puis 7 exercices",
        "Réviser un jour, trois jours et sept jours après le cours"
      ],
      "bonne": 3,
      "explication": "Chaque révision, placée au bon moment, ralentit la courbe de l’oubli."
    },
    {
      "question": "« Réviser l’histoire » te paraît énorme. Que fais-tu ?",
      "choix": [
        "Tu attends d’être motivé",
        "Tu découpes en petites étapes, comme « flashcards du chapitre 2 »",
        "Tu révises tout d’un coup la veille",
        "Tu laisses tomber l’histoire"
      ],
      "bonne": 1,
      "explication": "Une petite étape de quinze minutes se lance facilement, alors qu’une tâche énorme fait peur."
    },
    {
      "question": "Quelle méthode de travail par blocs propose le cours ?",
      "choix": [
        "25 minutes sur une seule tâche, puis 5 minutes de pause",
        "2 heures sans aucune pause",
        "5 minutes de travail, puis 25 minutes de pause",
        "Changer de matière toutes les 3 minutes"
      ],
      "bonne": 0,
      "explication": "Des blocs courts sur une seule tâche protègent ta concentration, et les pauses la rechargent."
    },
    {
      "question": "Où mettre ton téléphone pendant que tu travailles ?",
      "choix": [
        "Sur le bureau, écran vers le haut",
        "Dans ta main, au cas où",
        "Retourné à côté de ton cahier",
        "Dans une autre pièce, ou en mode avion"
      ],
      "bonne": 3,
      "explication": "Même retourné, il attire ton attention : le plus efficace est de l’éloigner."
    },
    {
      "question": "Pourquoi le sommeil fait-il partie de la méthode ?",
      "choix": [
        "Parce qu’on apprend en dormant avec des écouteurs",
        "Parce que ça évite de faire ses devoirs",
        "Parce que c’est la nuit que le cerveau fixe ce qu’on a appris",
        "Parce que les contrôles ont lieu le matin"
      ],
      "bonne": 2,
      "explication": "Pendant le sommeil, le cerveau consolide ce que tu as révisé dans la journée."
    }
  ]
}$j$::jsonb),
  ('methode', 'outil', 'Ton planning de la semaine', $j${
  "kind": "planning",
  "intro": "Pour chaque jour, choisis une activité après les cours et une le soir. Place tes révisions plusieurs jours avant chaque contrôle, et garde de vraies pauses.",
  "jours": [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche"
  ],
  "moments": [
    "Après les cours",
    "Soirée"
  ],
  "activites": [
    "Quiz sur le cours du jour",
    "Flashcards 10 min",
    "Exercices",
    "Réviser un contrôle",
    "Préparer un exposé",
    "Lecture",
    "Sport / pause",
    "Repos"
  ]
}$j$::jsonb)
ON CONFLICT (capsule_id, type) DO UPDATE SET
  titre = EXCLUDED.titre,
  contenu = EXCLUDED.contenu;

-- ------------------------------------------- argent — Ton argent, tes règles

INSERT INTO public.capsule_elements (capsule_id, type, titre, contenu) VALUES
  ('argent', 'cours', 'Le cours', $j${
  "intro": "Argent de poche, cadeaux d’anniversaire, petits services rendus : à ton âge, tu commences à gérer ton propre argent. Et ça s’apprend, comme les maths. Pas de conseil pour devenir riche ici : juste les bases pour savoir où va ton argent, épargner pour ce qui compte et éviter les pièges.",
  "sections": [
    {
      "titre": "Savoir où va ton argent",
      "texte": [
        "Avant de gérer, il faut observer. Pendant un mois, note tout ce qui rentre (argent de poche, cadeaux) et tout ce qui sort (en-cas, sorties, jeux, recharges). Un carnet ou une note dans ton téléphone suffit.",
        "Beaucoup de gens sont surpris à la fin du mois : les petites dépenses répétées finissent par faire une grosse somme. Trois euros par semaine, c’est plus de 150 euros sur une année.",
        "C’est ça, un budget : ce qui rentre d’un côté, ce qui sort de l’autre. Si ce qui sort dépasse ce qui rentre, il faut ajuster. Si ce qui rentre dépasse ce qui sort, tu peux épargner."
      ],
      "astuce": "Chaque dimanche, relis tes dépenses de la semaine en deux minutes. Tu verras vite où ton argent file sans que tu t’en rendes compte."
    },
    {
      "titre": "Besoin ou envie ?",
      "texte": [
        "Un besoin, c’est ce qui est vraiment nécessaire : un cahier pour l’école, un ticket de bus, des chaussures quand les tiennes sont trouées. Une envie, c’est ce qui te ferait plaisir : un nouveau skin, un troisième sweat, une boisson en sortant des cours.",
        "Les envies ne sont pas interdites : se faire plaisir fait partie de la vie. Mais si tu dis oui à toutes, il ne restera rien pour tes besoins ni pour tes projets. Le secret, c’est de choisir.",
        "La publicité et les réseaux sociaux transforment des envies en « besoins urgents » : offres limitées, influenceurs, « plus que 2 en stock ». Quand tu sens cette urgence, c’est le signal qu’il faut ralentir."
      ],
      "astuce": "Applique la règle des 48 heures : pour un achat qui n’est pas un besoin, attends deux jours. Si l’envie est toujours là, réfléchis-y ; souvent, elle sera passée."
    },
    {
      "titre": "Épargner pour un objectif",
      "texte": [
        "Épargner, c’est mettre de l’argent de côté pour plus tard. C’est bien plus facile avec un objectif précis, un montant et une date : un casque, un vélo, un voyage scolaire.",
        "Pour savoir combien de temps il te faudra, calcule ce que tu peux mettre de côté chaque mois : ce qui rentre moins ce qui sort. Puis divise le prix de ton objectif par cette somme. Exemple : tu reçois 30 euros par mois et tu en dépenses 15, tu épargnes donc 15 euros. Pour un casque à 90 euros, il te faut 6 mois.",
        "Bon réflexe : mets ton épargne de côté dès que tu reçois ton argent, pas à la fin du mois avec ce qui reste, car souvent il ne reste rien. Une tirelire, une enveloppe ou un livret d’épargne ouvert avec tes parents rangent cet argent à part."
      ],
      "astuce": "Le calculateur de cette capsule fait le calcul pour toi : il te dit en combien de mois tu atteins ton objectif."
    },
    {
      "titre": "Achats dans les jeux et arnaques",
      "texte": [
        "Dans beaucoup de jeux et d’applis, on paie avec des monnaies virtuelles : gemmes, pièces, crédits. Leur piège, c’est qu’elles font oublier le vrai prix en euros. Et les coffres au contenu tiré au hasard, les « loot boxes », marchent comme un jeu de hasard : on paie sans savoir ce qu’on gagne, et on a envie de recommencer.",
        "Fixe-toi une limite en euros, et ne fais jamais d’achat avec de l’argent réel sans l’accord de tes parents. Avant d’acheter, convertis toujours : ce pack à « seulement 1 000 gemmes », combien d’euros est-ce vraiment ?",
        "Méfie-toi des arnaques : faux concours, « argent facile » promis sur les réseaux, messages qui demandent un code reçu par SMS, inconnus qui proposent de l’argent pour utiliser ton compte bancaire. Prêter ton compte peut te rendre complice d’une fraude. Si c’est trop beau pour être vrai, c’est une arnaque."
      ],
      "astuce": "Un doute sur un message ou une offre ? Ne clique sur rien et montre-le à un adulte avant de répondre."
    },
    {
      "titre": "Ta première carte bancaire",
      "texte": [
        "Beaucoup de banques proposent aux ados un compte et une carte, avec l’accord des parents. Souvent, c’est une carte à autorisation systématique : avant chaque paiement, la banque vérifie qu’il y a assez d’argent sur le compte. Impossible de dépenser plus que ce que tu as.",
        "Ton code secret ne se donne à personne, même à un ami : ne l’écris nulle part et cache le clavier quand tu le tapes. Ne partage jamais une photo de ta carte. Aucune banque ne te demandera ton code par message ou par téléphone.",
        "Carte perdue ou volée ? Préviens tout de suite tes parents et fais-la bloquer : c’est faire opposition, par téléphone ou dans l’appli de la banque. Plus tu réagis vite, moins tu risques de perdre de l’argent."
      ]
    }
  ]
}$j$::jsonb),
  ('argent', 'fiche', 'La fiche récap', $j${
  "points": [
    {
      "titre": "Un budget, c’est simple",
      "texte": "Ce qui rentre d’un côté, ce qui sort de l’autre. Note tout pendant un mois pour savoir où va ton argent."
    },
    {
      "titre": "Besoin ou envie",
      "texte": "Un besoin est nécessaire, une envie fait plaisir. Les deux comptent, mais il faut choisir."
    },
    {
      "titre": "La règle des 48 heures",
      "texte": "Pour un achat qui n’est pas un besoin, attends deux jours avant de décider."
    },
    {
      "titre": "Épargne d’abord",
      "texte": "Mets ton épargne de côté dès que tu reçois ton argent. Prix de l’objectif divisé par l’épargne du mois : c’est le nombre de mois à attendre."
    },
    {
      "titre": "Gemmes = vrais euros",
      "texte": "Convertis toujours les monnaies virtuelles en euros, et aucun achat réel sans l’accord de tes parents. Trop beau pour être vrai ? Arnaque."
    },
    {
      "titre": "Carte et code secret",
      "texte": "Ton code ne se donne jamais. Carte perdue ou volée : préviens tes parents et fais opposition tout de suite."
    }
  ],
  "aRetenir": "Décide où va ton argent, avant que d’autres ne le décident pour toi."
}$j$::jsonb),
  ('argent', 'quiz', 'Le quiz', $j${
  "questions": [
    {
      "question": "Qu’est-ce qu’un budget ?",
      "choix": [
        "Le bilan de ce qui rentre et de ce qui sort",
        "Un compte en banque secret",
        "Une carte de fidélité",
        "Un prêt de la banque"
      ],
      "bonne": 0,
      "explication": "Un budget compare ce qui rentre et ce qui sort, pour savoir si tu peux dépenser ou épargner."
    },
    {
      "question": "Lequel de ces achats est un besoin ?",
      "choix": [
        "Un nouveau skin pour ton jeu",
        "Un troisième sweat",
        "Un cahier pour l’école",
        "Une boisson en sortant des cours"
      ],
      "bonne": 2,
      "explication": "Le cahier est nécessaire pour l’école ; les autres achats sont des envies, qui ont leur place mais se choisissent."
    },
    {
      "question": "Tu dépenses 3 euros chaque semaine. Combien cela fait-il sur une année ?",
      "choix": [
        "Environ 30 euros",
        "Plus de 150 euros",
        "Environ 12 euros",
        "Exactement 300 euros"
      ],
      "bonne": 1,
      "explication": "Il y a 52 semaines dans une année : 3 euros fois 52, cela fait 156 euros."
    },
    {
      "question": "Que dit la règle des 48 heures ?",
      "choix": [
        "Dépenser son argent dans les 48 heures",
        "Épargner pendant 48 heures seulement",
        "Vérifier son solde toutes les 48 heures",
        "Attendre deux jours avant un achat qui n’est pas un besoin"
      ],
      "bonne": 3,
      "explication": "Deux jours de recul suffisent souvent à faire passer une envie du moment."
    },
    {
      "question": "Tu épargnes 15 euros par mois pour un casque à 90 euros. Combien de mois te faut-il ?",
      "choix": [
        "3 mois",
        "6 mois",
        "9 mois",
        "15 mois"
      ],
      "bonne": 1,
      "explication": "90 divisé par 15, cela fait 6 : il te faut 6 mois."
    },
    {
      "question": "Pourquoi les monnaies virtuelles (gemmes, pièces) sont-elles un piège ?",
      "choix": [
        "Parce qu’elles font oublier le vrai prix en euros",
        "Parce qu’elles sont toujours gratuites",
        "Parce qu’elles rapportent des intérêts",
        "Parce qu’elles sont interdites en France"
      ],
      "bonne": 0,
      "explication": "Payer en gemmes fait oublier combien d’euros on dépense vraiment : il faut toujours convertir."
    },
    {
      "question": "Un inconnu te propose de l’argent pour utiliser ton compte bancaire. Que fais-tu ?",
      "choix": [
        "Tu acceptes, c’est de l’argent facile",
        "Tu lui donnes ton code pour aller plus vite",
        "Tu refuses et tu en parles à un adulte",
        "Tu acceptes, mais une seule fois"
      ],
      "bonne": 2,
      "explication": "Prêter son compte peut rendre complice d’une fraude : c’est une arnaque, il faut refuser et en parler."
    },
    {
      "question": "Tu as perdu ta carte bancaire. Quel est le bon réflexe ?",
      "choix": [
        "Attendre de voir si quelqu’un la rapporte",
        "Changer seulement ton code",
        "Ne rien dire pour ne pas te faire gronder",
        "Prévenir tes parents et faire opposition tout de suite"
      ],
      "bonne": 3,
      "explication": "Faire opposition bloque la carte : plus tu réagis vite, moins tu risques de perdre de l’argent."
    }
  ]
}$j$::jsonb),
  ('argent', 'outil', 'Ton calculateur d’objectif', $j${
  "kind": "calculateur",
  "modele": "budget",
  "intro": "Indique ton argent de poche du mois, ce que tu dépenses chaque mois et le prix de ton objectif : le calculateur te dit en combien de mois tu peux l’atteindre."
}$j$::jsonb)
ON CONFLICT (capsule_id, type) DO UPDATE SET
  titre = EXCLUDED.titre,
  contenu = EXCLUDED.contenu;

-- ------------------------------------------- orientation — Trouve ta voie, pas à pas

INSERT INTO public.capsule_elements (capsule_id, type, titre, contenu) VALUES
  ('orientation', 'cours', 'Le cours', $j${
  "intro": "« Qu’est-ce que tu veux faire plus tard ? » Si cette question te donne des sueurs froides, rassure-toi : à ton âge, personne n’est obligé de savoir. L’orientation n’est pas un choix unique à faire d’un coup, c’est un chemin qui se construit en explorant. Voici comment t’y prendre, et les grandes étapes à connaître.",
  "sections": [
    {
      "titre": "Partir de toi",
      "texte": [
        "Avant de chercher un métier, commence par te connaître. Qu’est-ce que tu aimes faire, à l’école et en dehors ? Préfères-tu travailler avec tes mains, avec des gens, avec des chiffres, dehors, sur un écran ?",
        "Pense aussi à tes qualités : patience, créativité, sens du contact, goût de la précision. Tes proches ont souvent un regard utile, demande-leur. Et un loisir peut révéler un vrai talent, autant qu’une matière préférée.",
        "Il n’y a pas de mauvaise réponse, et tes goûts vont évoluer. L’idée, c’est d’avoir des pistes, pas de tout décider maintenant."
      ],
      "astuce": "Tiens une page « Ce qui me plaît » dans un carnet et ajoute une ligne chaque fois qu’une activité, un sujet ou un métier t’intéresse."
    },
    {
      "titre": "Découvrir des métiers",
      "texte": [
        "Il existe des centaines de métiers, et on n’en connaît souvent qu’une poignée. Pour élargir ton horizon, le site de l’Onisep (onisep.fr), l’organisme public d’information sur l’orientation, propose des fiches métiers, des vidéos et des guides sur les formations.",
        "Rien ne vaut une vraie rencontre : interroge des adultes de ton entourage sur leur métier, leur journée type, ce qu’ils aiment et ce qu’ils aiment moins. Les forums des métiers, les salons et les journées portes ouvertes sont aussi de belles occasions.",
        "Des personnes sont là pour t’accompagner : ton professeur principal, le professeur documentaliste au CDI et le psychologue de l’Éducation nationale de ton établissement. Tu peux aussi aller dans un centre d’information et d’orientation (CIO)."
      ],
      "astuce": "Avant de rencontrer un professionnel, prépare trois questions : « Comment se passe une journée type ? », « Quelles études avez-vous faites ? », « Qu’est-ce qui vous plaît le plus ? »"
    },
    {
      "titre": "Au collège : le stage de 3e et le choix de voie",
      "texte": [
        "En 3e, tu fais un stage d’observation d’une semaine dans une entreprise, une association, une administration ou chez un artisan. C’est souvent ta première immersion dans le monde du travail. Cherche tôt : les places partent vite.",
        "À la fin de la 3e, deux grandes voies s’ouvrent. La voie générale et technologique commence par une seconde commune. La voie professionnelle prépare à un métier, en CAP (2 ans) ou en bac professionnel (3 ans), au lycée professionnel ou en apprentissage.",
        "Aucune voie n’est « pour les bons » ou « pour les autres » : ce sont des façons différentes d’apprendre, et des passerelles existent pour changer de chemin. Ta famille formule des vœux, le conseil de classe donne son avis, et on en discute ensemble."
      ]
    },
    {
      "titre": "Au lycée : seconde et spécialités",
      "texte": [
        "En seconde générale et technologique, tu suis un tronc commun et tu découvres de nouvelles matières. Pendant l’année, tu prépares la suite : la voie générale ou une série de la voie technologique, comme STMG pour la gestion ou ST2S pour la santé et le social.",
        "Dans la voie générale, tu choisis trois enseignements de spécialité pour la première, puis tu en gardes deux en terminale. Choisis-les parce qu’ils te plaisent et que tu y réussis, et regarde ce qu’attendent les formations qui t’intéressent.",
        "En fin de seconde générale et technologique, un stage d’observation de deux semaines, en juin, te permet de tester un secteur qui t’attire."
      ],
      "astuce": "Ne choisis pas une spécialité juste pour rester avec tes amis : c’est toi qui la suivras pendant deux ans."
    },
    {
      "titre": "En terminale : Parcoursup",
      "texte": [
        "Parcoursup est la plateforme nationale pour candidater aux formations après le bac : université, BTS, BUT, classes préparatoires, écoles, apprentissage. Le calendrier change peu d’une année à l’autre, mais vérifie toujours les dates exactes sur le site officiel.",
        "En décembre, tu découvres les formations. De mi-janvier à mi-mars, tu formules tes vœux, jusqu’à 10. Début avril, tu complètes ton dossier et tu confirmes tes vœux. À partir de début juin, les réponses arrivent ; une phase complémentaire permet ensuite de viser les places restantes.",
        "Prépare-toi dès la première : journées portes ouvertes, échanges avec des étudiants, lecture des attendus des formations. Plus tu explores tôt, plus la terminale est sereine."
      ],
      "astuce": "En première, note cinq formations qui t’intéressent et visite au moins une journée portes ouvertes."
    }
  ]
}$j$::jsonb),
  ('orientation', 'fiche', 'La fiche récap', $j${
  "points": [
    {
      "titre": "Pars de toi",
      "texte": "Tes goûts, tes qualités et tes loisirs sont les meilleures pistes. Personne n’est obligé de tout savoir tôt."
    },
    {
      "titre": "Explore les métiers",
      "texte": "Fiches et vidéos sur onisep.fr, rencontres avec des professionnels, forums, salons et journées portes ouvertes."
    },
    {
      "titre": "Fais-toi accompagner",
      "texte": "Professeur principal, professeur documentaliste, psychologue de l’Éducation nationale et CIO sont là pour t’aider."
    },
    {
      "titre": "Stage de 3e et choix de voie",
      "texte": "Une semaine d’observation en 3e. Puis voie générale et technologique, ou voie professionnelle (CAP en 2 ans, bac pro en 3 ans)."
    },
    {
      "titre": "Seconde et spécialités",
      "texte": "Stage de deux semaines en fin de seconde générale et technologique. En voie générale : trois spécialités en première, deux en terminale."
    },
    {
      "titre": "Parcoursup en terminale",
      "texte": "Découverte en décembre, vœux de mi-janvier à mi-mars, dossier début avril, réponses à partir de juin. Vérifie les dates chaque année."
    }
  ],
  "aRetenir": "L’orientation n’est pas un choix d’un jour, c’est un chemin : explore, teste et avance pas à pas."
}$j$::jsonb),
  ('orientation', 'quiz', 'Le quiz', $j${
  "questions": [
    {
      "question": "Par quoi commencer pour réfléchir à ton orientation ?",
      "choix": [
        "Choisir le métier dont on parle le plus",
        "Faire la même chose que tes amis",
        "Partir de tes goûts, de tes qualités et de tes loisirs",
        "Attendre la terminale pour y penser"
      ],
      "bonne": 2,
      "explication": "Se connaître d’abord permet de trouver des pistes qui te ressemblent vraiment."
    },
    {
      "question": "Qu’est-ce que l’Onisep ?",
      "choix": [
        "Un organisme public d’information sur les métiers et les formations",
        "Un examen de fin de collège",
        "Une spécialité du lycée",
        "Une entreprise qui vend des stages"
      ],
      "bonne": 0,
      "explication": "Sur onisep.fr, tu trouves des fiches métiers, des vidéos et des guides sur les formations."
    },
    {
      "question": "Combien de temps dure le stage d’observation de 3e ?",
      "choix": [
        "Une journée",
        "Une semaine",
        "Un mois",
        "Un an"
      ],
      "bonne": 1,
      "explication": "C’est une semaine d’observation, souvent la première immersion dans le monde du travail."
    },
    {
      "question": "Après la 3e, que prépare la voie professionnelle ?",
      "choix": [
        "Uniquement des études longues à l’université",
        "Seulement des classes préparatoires",
        "Rien, c’est une année de pause",
        "Un métier, en CAP ou en bac professionnel"
      ],
      "bonne": 3,
      "explication": "La voie professionnelle prépare à un métier : CAP en 2 ans ou bac pro en 3 ans, au lycée ou en apprentissage."
    },
    {
      "question": "Dans la voie générale, combien de spécialités choisis-tu pour la première ?",
      "choix": [
        "Une",
        "Deux",
        "Trois",
        "Cinq"
      ],
      "bonne": 2,
      "explication": "Trois spécialités en première, puis tu en gardes deux en terminale."
    },
    {
      "question": "Que se passe-t-il en fin de seconde générale et technologique ?",
      "choix": [
        "Le brevet des collèges",
        "Un stage d’observation de deux semaines",
        "Le choix du collège",
        "Les résultats de Parcoursup"
      ],
      "bonne": 1,
      "explication": "Un stage d’observation de deux semaines, en juin, permet de tester un secteur qui t’attire."
    },
    {
      "question": "Pendant quelle période formules-tu tes vœux sur Parcoursup ?",
      "choix": [
        "De mi-janvier à mi-mars",
        "En septembre, à la rentrée",
        "Pendant les vacances d’été",
        "Le jour des résultats du bac"
      ],
      "bonne": 0,
      "explication": "Les vœux se formulent de mi-janvier à mi-mars, jusqu’à 10 ; les dates exactes sont à vérifier chaque année."
    },
    {
      "question": "Qui peut t’aider à construire ton orientation ?",
      "choix": [
        "Personne, il faut se débrouiller",
        "Seulement un site internet payant",
        "Uniquement tes amis",
        "Ton professeur principal et le psychologue de l’Éducation nationale"
      ],
      "bonne": 3,
      "explication": "Professeur principal, professeur documentaliste, psychologue de l’Éducation nationale et CIO sont là pour t’accompagner."
    }
  ]
}$j$::jsonb),
  ('orientation', 'outil', 'Ta mission exploration', $j${
  "kind": "checklist",
  "intro": "Choisis un métier qui t’intrigue et coche chaque action au fur et à mesure. À la fin, note ce qui te plaît et ce qui te plaît moins : c’est comme ça qu’une piste se précise.",
  "items": [
    "Je lis la fiche du métier sur onisep.fr",
    "Je regarde une vidéo de quelqu’un qui exerce ce métier",
    "Je note les études qui y mènent",
    "Je liste trois qualités utiles pour ce métier",
    "Je prépare trois questions pour un professionnel",
    "J’interroge une personne qui fait ce métier ou un métier proche",
    "Je repère un forum, un salon ou des portes ouvertes à visiter",
    "J’en parle à mon professeur principal ou au psychologue de l’Éducation nationale"
  ]
}$j$::jsonb)
ON CONFLICT (capsule_id, type) DO UPDATE SET
  titre = EXCLUDED.titre,
  contenu = EXCLUDED.contenu;
