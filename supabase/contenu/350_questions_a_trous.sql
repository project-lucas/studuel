-- =============================================================================
-- Studuel — Migration 350 : LES QUESTIONS REFORMULÉES
--
-- 100 questions réécrites, dont 100 passées au TEXTE À TROUS,
-- dans : Anglais, Espagnol.
--
-- POURQUOI CETTE MIGRATION EXISTE. Le quiz du programme ne servait que deux
-- formes — le QCM et le vrai/faux — sur les ~3 300 questions du catalogue :
-- huit écrans identiques d’affilée, où seul le texte change. La troisième
-- forme, le texte à trous, est lisible par l’app depuis lib/quiz-trous.ts,
-- mais AUCUNE question ne l’activait : il faut un `___` dans l’énoncé, et
-- pas un seul seed n’en écrivait. La forme existait sans être visible.
--
-- POURQUOI UN UPDATE ET NON UN SEED. Les questions sont corrigées à la
-- source, dans le module qui les porte — un clone neuf produit donc la bonne
-- base sans rien exécuter. Mais la base EN SERVICE ne rejouera jamais ce
-- seed : ses INSERT sont gardés par `ON CONFLICT DO NOTHING`. D’où ces
-- UPDATE, comme les migrations 341→347 pour les cours.
--
-- ⚠️ AUCUN IDENTIFIANT N’EST TOUCHÉ, et c’est tout l’enjeu. L’UUID d’une
-- question se dérivait de SON ÉNONCÉ : reformuler en déplaçait l’identifiant,
-- le seed rejoué aurait inséré un doublon, et les `review_items` des élèves
-- — qui portent cet id SANS clé étrangère — auraient pointé dans le vide (le
-- compteur « X à revoir » comptant alors des questions mortes). Le générateur
-- dérive désormais l’UUID d’une CLÉ D’ORIGINE : l’énoncé sous lequel la
-- question a été semée la première fois, conservé en 5e élément du tuple.
-- Vérifié : les 374 identifiants du seed de l’espagnol sont inchangés.
--
-- Idempotente : un UPDATE qui réécrit les mêmes valeurs. Rejouable sans effet.
-- =============================================================================

UPDATE public.quiz_questions AS x
   SET question      = v.question,
       options       = v.options,
       correct_index = v.correct_index,
       explanation   = v.explanation
  FROM (VALUES
    ('18882e11-ec01-5414-95cf-c812e719a507'::uuid, '*She is ___ best student in the class.*', '["the","a","an","some"]'::jsonb, 0, 'Le superlatif est unique par définition : il appelle l’article défini.'),
    ('e71c2917-4240-572e-ab93-536092cab207'::uuid, '*He hasn’t got ___ money left.*', '["much","many","a few","several"]'::jsonb, 0, '*Money* est indénombrable : *much*. *Many* compte des unités.'),
    ('27b2d644-ccf9-5b1c-a57e-7274a5ebddd7'::uuid, '*Have you got ___ money?*', '["any","some","much of","a lot"]'::jsonb, 0, '*Any* dans les questions et les négations, *some* dans les affirmations.'),
    ('08e25984-c177-55d3-bfdb-5acc8b615844'::uuid, '*He isn’t ___ to vote.*', '["old enough","enough old","enough","old"]'::jsonb, 0, '*Enough* se place APRÈS l’adjectif — l’inverse du français.'),
    ('59f2814e-519f-5762-bd03-0e2561e49370'::uuid, '*She drives ___ car.*', '["a big red Italian","a red big Italian","an Italian red big","a big Italian red"]'::jsonb, 0, 'Ordre : taille, puis couleur, puis origine.'),
    ('09880e29-7eff-5c0d-a33e-cca4b1c0596f'::uuid, '*___ cold — could you close the window?*', '["I am","I have","I have got","It makes me"]'::jsonb, 0, 'L’anglais ÊTRE là où le français A : *I am cold*, *I am hungry*, *I am 17*.'),
    ('0c069b0f-33ee-5ee6-a883-fc0dc493e9d1'::uuid, '*You must ___ now.*', '["leave","to leave","leaving","left"]'::jsonb, 0, 'Un modal est suivi de la BASE VERBALE, sans *to* et sans -s.'),
    ('b4167dff-2857-59c2-9f1d-beecf173edee'::uuid, '*Don’t ___ — you’re almost there.*', '["give up","give away","get up","give back"]'::jsonb, 0, 'La particule change tout le sens : *give up* = abandonner.'),
    ('740ccb63-62de-5a5d-a153-6187189fdaee'::uuid, '*Could you ___ my cat while I’m away?*', '["look after","look for","look at","look like"]'::jsonb, 0, '*Look after* = s’occuper de ; *look for* = chercher.'),
    ('2df2d297-3c3e-5274-8ab8-635bc4ae222f'::uuid, '*The meeting was ___ until Monday.*', '["put off","put on","put out","put up"]'::jsonb, 0, '*Put off* = reporter ; *put out* = éteindre.'),
    ('4882188f-ed45-5db3-8c11-e1e1e80ccbc1'::uuid, '*___ the word in a dictionary.*', '["Look up","Look for","Look at","Look after"]'::jsonb, 0, '*Look up* = chercher dans un ouvrage de référence.'),
    ('a462be13-1d49-5036-ae26-ac17b117dcb1'::uuid, '*She left without ___ goodbye.*', '["saying","to say","say","said"]'::jsonb, 0, 'Après une PRÉPOSITION, toujours la forme en -ING.'),
    ('b0c2e4ec-289d-56e8-b772-6c2e1b105f35'::uuid, '*I ___ reading before bed.*', '["enjoy","decide","want","promise"]'::jsonb, 0, '*Enjoy* appelle -ING ; *decide*, *want* et *promise* appellent *to*.'),
    ('0eec642e-a4f0-501f-a775-4fca8be6194e'::uuid, '*He avoids ___ about it.*', '["talking","to talk","talk","talked"]'::jsonb, 0, '*Avoid*, *mind*, *suggest*, *practise* : tous suivis de -ING.'),
    ('34054ccd-919f-58d8-b3e0-c43d7dc0a691'::uuid, '*She could ___ hear him.*', '["hardly","hard","hardily","strongly"]'::jsonb, 0, 'Faux ami classique : *hardly* = à peine, PAS « durement » (*hard*).'),
    ('575cfb6f-9d9e-5853-9f57-0612c4df5043'::uuid, '*She smiled ___.*', '["happily","happyly","happly","happier"]'::jsonb, 0, 'Le -y final devient -i devant -ly.'),
    ('8699c80b-0fc7-5037-aef1-abb151ccc696'::uuid, '*This one is ___ better.*', '["much","very","more","so"]'::jsonb, 0, '*Very* ne renforce jamais un comparatif : c’est *much* (ou *far*).'),
    ('8a8ed029-3138-5396-a21d-5520579ca506'::uuid, '*I haven’t seen him ___.*', '["lately","late","later","lastly"]'::jsonb, 0, '*Lately* = récemment. Pour « en retard », c’est *late*.'),
    ('3fe7bb1c-28c2-5c1a-ba7c-5d92c9b2b92a'::uuid, '*When he ___, I’ll call you.*', '["arrives","will arrive","would arrive","arrived"]'::jsonb, 0, 'Après *when*, *as soon as*, *until* : présent, jamais *will*.'),
    ('145a4983-7a9c-5b74-8643-49fa6414f7da'::uuid, '*He ___ in London.*', '["works","work","working","worked"]'::jsonb, 0, 'Le -s de la 3e personne du singulier au présent simple.'),
    ('3b723948-eaca-50e3-9fa2-0093e7674bd8'::uuid, '*He ___ the bus yesterday.*', '["took","taked","taken","takes"]'::jsonb, 0, 'Verbe irrégulier : *take – took – taken*.'),
    ('4f1d034e-eacd-57de-a205-343ce62fc76f'::uuid, '*I have lived here ___ 2019.*', '["since","for","from","during"]'::jsonb, 0, '*Since* + point de départ, *for* + durée. Et le français « depuis » se dit au present perfect.'),
    ('2d75ef80-de3f-5bb4-9359-8e369614bca9'::uuid, '*I have ___ finished my homework.*', '["already","yesterday","last week","in 2010"]'::jsonb, 0, 'Un repère de temps ACHEVÉ interdit le present perfect : il appelle le prétérit.'),
    ('20239dae-5450-5c06-ad8a-4799888c990d'::uuid, '*When I arrived, the train ___ already left.*', '["had","have","has","was"]'::jsonb, 0, 'Le past perfect : *had* + participe passé, pour le fait le plus ancien.'),
    ('a41396b2-d711-5b93-ba22-2a949be5dfae'::uuid, '*He ___ gone before we arrived.*', '["had","would","did","should"]'::jsonb, 0, 'Le participe passé qui suit tranche : après *would*, on aurait la base verbale.'),
    ('51e12807-a4fd-5a11-9cc1-1727463e2adb'::uuid, '*I’ll call you when I ___ home.*', '["get","will get","would get","got"]'::jsonb, 0, 'Deux futurs français, un seul futur anglais : la subordonnée reste au présent.'),
    ('3cdb406c-04f3-5b0b-8b19-043516bc1c01'::uuid, '*She is ___ best student in the class.*', '["the","a","an","some"]'::jsonb, 0, 'Le superlatif est unique par définition : il appelle l’article défini.'),
    ('462afad3-f5ee-5c67-b9b8-359ccc1bceed'::uuid, '*He hasn’t got ___ money left.*', '["much","many","a few","several"]'::jsonb, 0, '*Money* est indénombrable : *much*. *Many* compte des unités.'),
    ('4e9ac752-e0e6-550f-8d5a-df14df923a84'::uuid, '*Have you got ___ money?*', '["any","some","much of","a lot"]'::jsonb, 0, '*Any* dans les questions et les négations, *some* dans les affirmations.'),
    ('fc672ece-93d3-5765-a958-9a6b96845e95'::uuid, '*He isn’t ___ to vote.*', '["old enough","enough old","enough","old"]'::jsonb, 0, '*Enough* se place APRÈS l’adjectif — l’inverse du français.'),
    ('ee017870-8d45-5dc1-8dcf-26a395c0412b'::uuid, '*She drives ___ car.*', '["a big red Italian","a red big Italian","an Italian red big","a big Italian red"]'::jsonb, 0, 'Ordre : taille, puis couleur, puis origine.'),
    ('1de0e53e-5635-5907-b03e-b25ace1e9d40'::uuid, '*___ cold — could you close the window?*', '["I am","I have","I have got","It makes me"]'::jsonb, 0, 'L’anglais ÊTRE là où le français A : *I am cold*, *I am hungry*, *I am 17*.'),
    ('f2816105-3ac3-5d67-8a7c-f603c595372e'::uuid, '*You must ___ now.*', '["leave","to leave","leaving","left"]'::jsonb, 0, 'Un modal est suivi de la BASE VERBALE, sans *to* et sans -s.'),
    ('8fd3dd5a-75cf-56a1-9cda-8712d8f35e16'::uuid, '*Don’t ___ — you’re almost there.*', '["give up","give away","get up","give back"]'::jsonb, 0, 'La particule change tout le sens : *give up* = abandonner.'),
    ('167c1818-3549-5b6f-93e7-95014d238a33'::uuid, '*Could you ___ my cat while I’m away?*', '["look after","look for","look at","look like"]'::jsonb, 0, '*Look after* = s’occuper de ; *look for* = chercher.'),
    ('bbcb19b6-49ff-53d6-b0bf-fce798039d8f'::uuid, '*The meeting was ___ until Monday.*', '["put off","put on","put out","put up"]'::jsonb, 0, '*Put off* = reporter ; *put out* = éteindre.'),
    ('3325b49e-ab6d-55de-bf4d-45770ba8c8bf'::uuid, '*___ the word in a dictionary.*', '["Look up","Look for","Look at","Look after"]'::jsonb, 0, '*Look up* = chercher dans un ouvrage de référence.'),
    ('58162a33-51f8-5730-b387-1ba501aa25d2'::uuid, '*She left without ___ goodbye.*', '["saying","to say","say","said"]'::jsonb, 0, 'Après une PRÉPOSITION, toujours la forme en -ING.'),
    ('858ca07d-bc7d-572b-8100-a4dd5234760f'::uuid, '*I ___ reading before bed.*', '["enjoy","decide","want","promise"]'::jsonb, 0, '*Enjoy* appelle -ING ; *decide*, *want* et *promise* appellent *to*.'),
    ('25f5cd75-0eee-58a6-9dc0-09a953a488a0'::uuid, '*He avoids ___ about it.*', '["talking","to talk","talk","talked"]'::jsonb, 0, '*Avoid*, *mind*, *suggest*, *practise* : tous suivis de -ING.'),
    ('25411731-d288-5fd6-aedc-cb052fad39a0'::uuid, '*She could ___ hear him.*', '["hardly","hard","hardily","strongly"]'::jsonb, 0, 'Faux ami classique : *hardly* = à peine, PAS « durement » (*hard*).'),
    ('a89e72fa-f380-5d36-8cee-93cfc9cc14d5'::uuid, '*She smiled ___.*', '["happily","happyly","happly","happier"]'::jsonb, 0, 'Le -y final devient -i devant -ly.'),
    ('5ad87e15-88f2-507c-84f5-b6853169682a'::uuid, '*This one is ___ better.*', '["much","very","more","so"]'::jsonb, 0, '*Very* ne renforce jamais un comparatif : c’est *much* (ou *far*).'),
    ('d41fd6c2-a322-5bd3-90f7-dcb12e990fe8'::uuid, '*I haven’t seen him ___.*', '["lately","late","later","lastly"]'::jsonb, 0, '*Lately* = récemment. Pour « en retard », c’est *late*.'),
    ('6e0be94c-970a-53a9-93c1-003d53e83e77'::uuid, '*When he ___, I’ll call you.*', '["arrives","will arrive","would arrive","arrived"]'::jsonb, 0, 'Après *when*, *as soon as*, *until* : présent, jamais *will*.'),
    ('93a7fe0c-5d04-55a7-90e6-8892f538ca6c'::uuid, '*He ___ in London.*', '["works","work","working","worked"]'::jsonb, 0, 'Le -s de la 3e personne du singulier au présent simple.'),
    ('320c9684-00b3-5b0a-83aa-29bb7eddb8c9'::uuid, '*He ___ the bus yesterday.*', '["took","taked","taken","takes"]'::jsonb, 0, 'Verbe irrégulier : *take – took – taken*.'),
    ('1c28292f-9abb-5835-b085-b6bba6f05abd'::uuid, '*I have lived here ___ 2019.*', '["since","for","from","during"]'::jsonb, 0, '*Since* + point de départ, *for* + durée. Et le français « depuis » se dit au present perfect.'),
    ('ce86ee52-1ade-5bc1-b129-2d59056b7a44'::uuid, '*I have ___ finished my homework.*', '["already","yesterday","last week","in 2010"]'::jsonb, 0, 'Un repère de temps ACHEVÉ interdit le present perfect : il appelle le prétérit.'),
    ('2420b7e9-8ada-5510-aab0-7c51528946ce'::uuid, '*When I arrived, the train ___ already left.*', '["had","have","has","was"]'::jsonb, 0, 'Le past perfect : *had* + participe passé, pour le fait le plus ancien.'),
    ('b8ef9ede-1d8e-5e59-b783-66eb1c6a0c43'::uuid, '*He ___ gone before we arrived.*', '["had","would","did","should"]'::jsonb, 0, 'Le participe passé qui suit tranche : après *would*, on aurait la base verbale.'),
    ('f88acb4e-7c91-5008-bbc3-877821d5bad8'::uuid, '*I’ll call you when I ___ home.*', '["get","will get","would get","got"]'::jsonb, 0, 'Deux futurs français, un seul futur anglais : la subordonnée reste au présent.'),
    ('a42894b3-2405-58ef-8042-ef933f05a747'::uuid, '*She is ___ best student in the class.*', '["the","a","an","some"]'::jsonb, 0, 'Le superlatif est unique par définition : il appelle l’article défini.'),
    ('40bbf8fc-497b-5075-a2c4-0b7ec51ee9fd'::uuid, '*He hasn’t got ___ money left.*', '["much","many","a few","several"]'::jsonb, 0, '*Money* est indénombrable : *much*. *Many* compte des unités.'),
    ('02c6c389-7179-54df-b54d-d770182702a9'::uuid, '*Have you got ___ money?*', '["any","some","much of","a lot"]'::jsonb, 0, '*Any* dans les questions et les négations, *some* dans les affirmations.'),
    ('8859914d-d615-5600-acd7-1c21e236cf27'::uuid, '*He isn’t ___ to vote.*', '["old enough","enough old","enough","old"]'::jsonb, 0, '*Enough* se place APRÈS l’adjectif — l’inverse du français.'),
    ('64dda4cc-dbfc-55b2-aaf6-ecac5b524f4d'::uuid, '*She drives ___ car.*', '["a big red Italian","a red big Italian","an Italian red big","a big Italian red"]'::jsonb, 0, 'Ordre : taille, puis couleur, puis origine.'),
    ('b5eb6139-c650-55b6-9c58-d275c1837f0e'::uuid, '*___ cold — could you close the window?*', '["I am","I have","I have got","It makes me"]'::jsonb, 0, 'L’anglais ÊTRE là où le français A : *I am cold*, *I am hungry*, *I am 17*.'),
    ('adbfb026-5f2d-552a-8c71-cb4658847434'::uuid, '*You must ___ now.*', '["leave","to leave","leaving","left"]'::jsonb, 0, 'Un modal est suivi de la BASE VERBALE, sans *to* et sans -s.'),
    ('d5fc3d8f-690d-5538-a4ad-47e51728f943'::uuid, '*Don’t ___ — you’re almost there.*', '["give up","give away","get up","give back"]'::jsonb, 0, 'La particule change tout le sens : *give up* = abandonner.'),
    ('a3c2203e-925b-5fc9-9c74-924cf913d680'::uuid, '*Could you ___ my cat while I’m away?*', '["look after","look for","look at","look like"]'::jsonb, 0, '*Look after* = s’occuper de ; *look for* = chercher.'),
    ('beea9c0a-b0c3-50c0-93ef-ef1a484c7684'::uuid, '*The meeting was ___ until Monday.*', '["put off","put on","put out","put up"]'::jsonb, 0, '*Put off* = reporter ; *put out* = éteindre.'),
    ('8a30d66d-9ea3-514b-a9df-820c9785705f'::uuid, '*___ the word in a dictionary.*', '["Look up","Look for","Look at","Look after"]'::jsonb, 0, '*Look up* = chercher dans un ouvrage de référence.'),
    ('81a093d2-fde9-5183-8cc1-6d9dee45aac8'::uuid, '*She left without ___ goodbye.*', '["saying","to say","say","said"]'::jsonb, 0, 'Après une PRÉPOSITION, toujours la forme en -ING.'),
    ('a8d72d66-f633-506c-af7d-e325b8c12260'::uuid, '*I ___ reading before bed.*', '["enjoy","decide","want","promise"]'::jsonb, 0, '*Enjoy* appelle -ING ; *decide*, *want* et *promise* appellent *to*.'),
    ('cfc4c8b0-1ca2-5eec-afc3-3ed8c9f62714'::uuid, '*He avoids ___ about it.*', '["talking","to talk","talk","talked"]'::jsonb, 0, '*Avoid*, *mind*, *suggest*, *practise* : tous suivis de -ING.'),
    ('e271eea4-2225-5865-b48e-5c3bf0f03c8a'::uuid, '*She could ___ hear him.*', '["hardly","hard","hardily","strongly"]'::jsonb, 0, 'Faux ami classique : *hardly* = à peine, PAS « durement » (*hard*).'),
    ('580390f5-4a46-5b07-882f-7c0051304608'::uuid, '*She smiled ___.*', '["happily","happyly","happly","happier"]'::jsonb, 0, 'Le -y final devient -i devant -ly.'),
    ('8b426747-3fa1-50b0-bed9-911b43454f2c'::uuid, '*This one is ___ better.*', '["much","very","more","so"]'::jsonb, 0, '*Very* ne renforce jamais un comparatif : c’est *much* (ou *far*).'),
    ('e63e5594-2eeb-5ad2-973d-b2fcabce1ff5'::uuid, '*I haven’t seen him ___.*', '["lately","late","later","lastly"]'::jsonb, 0, '*Lately* = récemment. Pour « en retard », c’est *late*.'),
    ('a248238f-8774-5582-9f3c-0399e0472d44'::uuid, '*When he ___, I’ll call you.*', '["arrives","will arrive","would arrive","arrived"]'::jsonb, 0, 'Après *when*, *as soon as*, *until* : présent, jamais *will*.'),
    ('47952f8d-f482-58b3-b784-f13965e0313d'::uuid, '*He ___ in London.*', '["works","work","working","worked"]'::jsonb, 0, 'Le -s de la 3e personne du singulier au présent simple.'),
    ('e32a23fc-419e-552a-8cbb-7eac24f9d5d8'::uuid, '*He ___ the bus yesterday.*', '["took","taked","taken","takes"]'::jsonb, 0, 'Verbe irrégulier : *take – took – taken*.'),
    ('65df07e3-fc09-587d-8246-68debbd88370'::uuid, '*I have lived here ___ 2019.*', '["since","for","from","during"]'::jsonb, 0, '*Since* + point de départ, *for* + durée. Et le français « depuis » se dit au present perfect.'),
    ('bb89576d-3ff4-5bd1-8522-a6870a34ee78'::uuid, '*I have ___ finished my homework.*', '["already","yesterday","last week","in 2010"]'::jsonb, 0, 'Un repère de temps ACHEVÉ interdit le present perfect : il appelle le prétérit.'),
    ('5ee14714-b352-5441-8304-ae6e051b73cf'::uuid, '*When I arrived, the train ___ already left.*', '["had","have","has","was"]'::jsonb, 0, 'Le past perfect : *had* + participe passé, pour le fait le plus ancien.'),
    ('a9899eed-2d0a-5d6d-8f2e-d12c46c63d99'::uuid, '*He ___ gone before we arrived.*', '["had","would","did","should"]'::jsonb, 0, 'Le participe passé qui suit tranche : après *would*, on aurait la base verbale.'),
    ('b5ee4133-9b59-57c4-ba61-150fd32a904c'::uuid, '*I’ll call you when I ___ home.*', '["get","will get","would get","got"]'::jsonb, 0, 'Deux futurs français, un seul futur anglais : la subordonnée reste au présent.'),
    ('fbebb52f-5572-5ccd-9614-bfd66dbd9e73'::uuid, '*___ fumo* : je ne fume plus.', '["Ya no","Todavía no","Nunca","Ni"]'::jsonb, 0, '*Ya no* marque l’arrêt ; *todavía no* signifie « pas encore ».'),
    ('b434ab63-9ff8-5c5b-a8d8-5c43ff54eafc'::uuid, '*No es francés ___ español.*', '["sino","pero","porque","aunque"]'::jsonb, 0, 'Après une négation, on rectifie avec *sino*. *Pero* oppose sans rectifier.'),
    ('fa09ed18-fc73-5835-a55c-0efaf018e764'::uuid, '*No canta ___ grita.*', '["sino que","sino","sino de","pero que"]'::jsonb, 0, 'Devant un VERBE CONJUGUÉ, *sino* devient *sino que*.'),
    ('2d0d3f96-65c0-50c8-87f2-4679e516b9c3'::uuid, '*No conozco a nadie que ___ ruso.*', '["hable","habla","hablar","hablará"]'::jsonb, 0, 'La négation rend l’antécédent inexistant, donc indéfini : subjonctif.'),
    ('a192ee46-dc6c-5dfb-bfa8-06ed45b78290'::uuid, '*Llegó tarde, ___ me molestó.*', '["lo que","el que","quien","cuyo"]'::jsonb, 0, 'Le neutre *lo que* reprend une idée entière, pas un nom.'),
    ('591e663e-30ab-54d4-840c-8b1a96a2222d'::uuid, '*Quiero que ___ mañana.*', '["vengas","vienes","venir","vendrás"]'::jsonb, 0, 'La volonté commande le subjonctif dès que le sujet change.'),
    ('f9450b34-0710-55f9-b19f-d8ff15e78062'::uuid, '*Es necesario que ___ más.*', '["estudies","estudias","estudiar","estudiarás"]'::jsonb, 0, 'Le jugement impersonnel commande le subjonctif.'),
    ('33fd181f-84cb-5922-a85d-1e67d7159bd9'::uuid, '*¿Qué es ___?* — « qu’est-ce que c’est ? »', '["esto","este","ésta","ese"]'::jsonb, 0, 'On désigne une chose non identifiée : c’est le NEUTRE *esto*.'),
    ('798902f7-63fe-55de-81ec-ebe0f751ec66'::uuid, '*Este regalo es para ___.*', '["mí","yo","me","mi"]'::jsonb, 0, 'Après préposition, le pronom tonique *mí* — avec accent, sinon c’est le possessif.'),
    ('f261e622-d0d7-518a-9b46-8f976d6bc0a7'::uuid, '*Según ___, la película es buena.*', '["yo","mí","me","conmigo"]'::jsonb, 0, '*Entre* et *según* sont les deux exceptions : elles gardent le pronom SUJET.'),
    ('b53ca030-c304-5819-b013-a5b0152f048e'::uuid, '*___ lo doy a mi hermano.*', '["Se","Le","Lo","Les"]'::jsonb, 0, '*Le lo* n’existe pas : devant *lo/la/los/las*, *le* devient *se*.'),
    ('0c2a1086-2bf9-5ccc-bec1-8bed5635ec88'::uuid, '*Me lavo ___ manos.*', '["las","mis","sus","unas"]'::jsonb, 0, 'Le pronom réfléchi dit déjà à qui sont les mains : l’espagnol met l’ARTICLE.'),
    ('426a46da-a1db-5a49-b6f2-c24a135eedad'::uuid, '*Le duele ___ cabeza.*', '["la","su","una","esa"]'::jsonb, 0, 'Même logique qu’avec *lavarse* : article, pas possessif.'),
    ('2001340c-f15f-5064-8524-5d83360a309b'::uuid, '*La chica con ___ hablo es mi prima.*', '["quien","que","cuyo","donde"]'::jsonb, 0, 'Après préposition et pour une personne : *quien*.'),
    ('9985a45f-cb91-5fdb-b431-c62ae6be293e'::uuid, '*¿___ es este libro?* — « à qui est-ce ? »', '["De quién","Cuyo","Qué de","Quién de"]'::jsonb, 0, '*Cuyo* ne s’emploie JAMAIS en question : c’est un relatif.'),
    ('ec077371-4b0b-5976-9418-52dd8d3f86a3'::uuid, '*Es ___ alto como tú.*', '["tan","tanto","más","muy"]'::jsonb, 0, '*Tan* devant un adjectif, *tanto* devant un nom.'),
    ('54629143-1359-5ef2-bd5b-c1467ed9a2cd'::uuid, '*Tengo ___ libros como tú.*', '["tantos","tan","tanto","más"]'::jsonb, 0, 'Devant un nom, *tanto* s’accorde : *tantos libros*.'),
    ('444763ee-3528-5e59-87b7-8f50dd8dbad6'::uuid, '*Este resultado es ___ que el anterior.*', '["peor","más malo","menor","mal"]'::jsonb, 0, 'Comparatif irrégulier, comme *bueno → mejor*.'),
    ('6d9254f2-763e-5184-964c-573b427040a7'::uuid, '*Es el edificio más alto ___ mundo.*', '["del","en el","de el","al"]'::jsonb, 0, 'Le complément du superlatif se met avec *de*, jamais *en* — et *de + el* se contracte.'),
    ('30dcbf05-6646-5ebe-a135-04facb4e999e'::uuid, '*Es un país ___* — « très riche ».', '["riquísimo","ricísimo","rikísimo","ricoísimo"]'::jsonb, 0, 'Le *c* devient *qu* devant le suffixe pour garder le son [k].'),
    ('b981fb2c-93da-55b2-a3eb-53a917aec4da'::uuid, '*Es un ___ amigo.*', '["buen","bueno","buena","bue"]'::jsonb, 0, '*Bueno* s’apocope en *buen* devant un nom masculin singulier.'),
    ('0d00f7c4-25b0-5dca-911e-ff90254695a4'::uuid, '*Cuesta ___ euros.*', '["cien","ciento","cientos","cienes"]'::jsonb, 0, '*Ciento* s’apocope en *cien* devant un nom : *cien euros*, mais *ciento veinte*.')
  ) AS v(id, question, options, correct_index, explanation)
 WHERE x.id = v.id;

-- Contrôle : combien de ces questions se lisent désormais comme un trou ?
--   SELECT count(*) FROM public.quiz_questions WHERE question LIKE '%___%';
