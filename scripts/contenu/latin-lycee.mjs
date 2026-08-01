// Latin — LYCÉE (2de, 1re, Tle).
//
// Même trou que l'espagnol : 9 chapitres en 5e-4e-3e, ZÉRO au lycée, alors que
// `subjects.levels` ouvre le latin jusqu'en terminale (sonde du 01/08/2026).

export default {
  slug: 'latin',
  nom: 'Latin',
  blocs: [
    {
      niveaux: ['2de', '1re', 'Tle'],
      chapitres: [
        {
          titre: 'Les cinq déclinaisons',
          lecon: {
            titre: 'Reconnaître un cas, comprendre une phrase',
            cours: `En latin, la **terminaison** dit la fonction. Tant qu'on traduit dans l'ordre des mots français, on ne traduit pas : on devine.

## Les six cas
**Nominatif** (sujet, attribut), **vocatif** (interpellation), **accusatif** (COD, but du mouvement), **génitif** (complément du nom), **datif** (COI, attribution), **ablatif** (compléments circonstanciels : moyen, manière, lieu d'où l'on vient).

## Les cinq déclinaisons
1re en *-a* (*rosa, rosae*, féminins) ; 2e en *-us / -um* (*dominus, domini* ; *templum, templi*) ; 3e, la plus vaste, en *-is* au génitif (*consul, consulis*) ; 4e en *-us, -us* (*manus*) ; 5e en *-es, -ei* (*res, dies*).

## La règle du neutre
Au neutre, **nominatif et accusatif sont toujours identiques**, et le nominatif-accusatif pluriel se termine par **-a**. C'est le repère le plus rentable de toute la grammaire latine.

## La méthode de traduction
1. Repérer le **verbe** conjugué (souvent en fin de proposition). 2. Chercher le **nominatif** : c'est le sujet. 3. Chercher l'**accusatif** : c'est le COD. 4. Placer les compléments. Traduire, c'est analyser d'abord, mettre en français ensuite.`,
          },
          questions: [
            ['Combien de cas compte la déclinaison latine ?', ['6', '5', '4', '7'], 0, 'Nominatif, vocatif, accusatif, génitif, datif, ablatif.'],
            ['Quel cas exprime le complément du nom ?', ['Le génitif', 'Le datif', 'L’ablatif', 'L’accusatif'], 0, '*Liber pueri* : le livre de l’enfant.'],
            ['Au neutre, nominatif et accusatif sont identiques.', ['Vrai', 'Faux'], 0, 'Et le pluriel se termine par *-a* : *templa*.'],
            ['La 3e déclinaison se reconnaît à son génitif singulier en…', ['-is', '-ae', '-i', '-ei'], 0, '*Consul, consulis* ; *corpus, corporis*.'],
            ['L’ablatif exprime notamment le moyen et la manière.', ['Vrai', 'Faux'], 0, 'C’est le cas des compléments circonstanciels.'],
            ['Par quoi commence une bonne traduction ?', ['Par le repérage du verbe', 'Par le premier mot', 'Par le dernier mot', 'Par le dictionnaire'], 0, 'Le verbe donne la structure de la proposition.'],
            ['« Rosa, rosae » appartient à la 1re déclinaison.', ['Vrai', 'Faux'], 0, 'Majoritairement féminine, en *-a* au nominatif.'],
            ['L’accusatif marque aussi…', ['Le but du mouvement', 'La possession', 'L’origine', 'L’attribution'], 0, '*Eo Romam* : je vais à Rome.'],
          ],
        },
        {
          titre: 'Propositions subordonnées et syntaxe',
          lecon: {
            titre: 'Construire une phrase complexe',
            cours: `La phrase latine littéraire est architecturée : la comprendre, c'est démonter cette architecture.

## La proposition infinitive
Après les verbes de parole, de pensée et de perception, le latin n'emploie pas « que » : le sujet passe à l'**accusatif** et le verbe à l'**infinitif**. *Dico Marcum venire* = je dis que Marcus vient. C'est la structure la plus déroutante — et la plus fréquente.

## Le subjonctif dans les subordonnées
*Ut* + subjonctif : but (« pour que ») ou conséquence (« si bien que »), la distinction se lit dans la principale (*tam, ita, sic* annoncent la conséquence). *Cum* + subjonctif : circonstance, cause ou opposition.

## L'ablatif absolu
Un nom et un participe à l'**ablatif**, sans lien grammatical avec la principale : *Urbe capta*, « la ville ayant été prise », soit « après la prise de la ville ». Le français le rend le plus souvent par un complément circonstanciel, jamais mot à mot.

## Le participe
Présent actif (*-ns, -ntis*), parfait passif (*-tus, -a, -um*), futur actif (*-turus*). L'adjectif verbal en *-ndus* exprime l'obligation : *Carthago delenda est*, « Carthage doit être détruite ».`,
          },
          questions: [
            ['Dans une proposition infinitive, le sujet est…', ['À l’accusatif', 'Au nominatif', 'Au datif', 'À l’ablatif'], 0, '*Dico Marcum venire* : je dis que Marcus vient.'],
            ['« Ut » + subjonctif peut exprimer le but ou la conséquence.', ['Vrai', 'Faux'], 0, '*Tam*, *ita*, *sic* dans la principale annoncent la conséquence.'],
            ['Que traduit-on par « après la prise de la ville » ?', ['Urbe capta (ablatif absolu)', 'Urbs capta est', 'Urbem capere', 'Urbi captae'], 0, 'L’ablatif absolu ne se traduit jamais mot à mot.'],
            ['L’adjectif verbal en -ndus exprime…', ['L’obligation', 'Le passé', 'Le souhait', 'La condition'], 0, '*Carthago delenda est*.'],
            ['L’ablatif absolu est grammaticalement lié à la proposition principale.', ['Vrai', 'Faux'], 1, 'Il en est justement détaché : c’est ce qui le rend « absolu ».'],
            ['Quel type de verbe introduit une proposition infinitive ?', ['Les verbes de parole, pensée, perception', 'Les verbes de mouvement', 'Les verbes impersonnels', 'Les verbes d’état'], 0, '*Dico*, *puto*, *video*, *audio*.'],
            ['« Cum » + subjonctif peut exprimer la cause.', ['Vrai', 'Faux'], 0, 'Circonstance, cause ou opposition selon le contexte.'],
            ['Le participe parfait passif se reconnaît à sa terminaison…', ['-tus, -a, -um', '-ns, -ntis', '-turus', '-ndus'], 0, '*Captus*, *victus*, *scriptus*.'],
          ],
        },
        {
          titre: 'Rome : société, pouvoir, héritage',
          lecon: {
            titre: 'Ce que Rome nous a laissé',
            cours: `Le programme de lycée lit les textes latins comme des documents sur une société — et sur la nôtre.

## Les institutions de la République
Le **cursus honorum** : questure, édilité, préture, consulat. Le **Sénat** (assemblée des anciens magistrats) donne l'orientation politique ; les **comices** votent ; les **tribuns de la plèbe** disposent du droit de veto. La formule *SPQR* — *Senatus PopulusQue Romanus* — dit l'équilibre revendiqué.

## De la République à l'Empire
Les guerres civiles, César assassiné aux ides de mars 44 av. J.-C., puis **Auguste** qui fonde le principat en 27 av. J.-C. : l'Empire garde les formes républicaines et en vide le contenu. *Res publica restituta*, disait-il — la formule est un chef-d'œuvre de communication politique.

## La société
Patriciens et plébéiens, clientélisme (*patronus* / *cliens*), place centrale de l'esclavage, statut de la *materfamilias*, importance du *mos maiorum*, la coutume des ancêtres.

## L'héritage
Le droit romain irrigue nos codes civils ; le latin a donné les langues romanes ; l'urbanisme (forum, thermes, aqueducs), la rhétorique de Cicéron et l'historiographie de Tacite structurent encore notre manière d'argumenter et d'écrire l'histoire.`,
          },
          questions: [
            ['Que désigne le cursus honorum ?', ['La carrière des magistratures romaines', 'Une course de chars', 'Le parcours des légions', 'Une cérémonie religieuse'], 0, 'Questure, édilité, préture, consulat.'],
            ['Que signifie SPQR ?', ['Senatus PopulusQue Romanus', 'Sanctus Populus Romanus', 'Senatus Pax Roma', 'Societas Publica Romana'], 0, '« Le Sénat et le peuple romain ».'],
            ['César a été assassiné aux ides de mars 44 av. J.-C.', ['Vrai', 'Faux'], 0, 'Sa mort ouvre la crise dont sortira le principat.'],
            ['Qui fonde le principat en 27 av. J.-C. ?', ['Auguste', 'César', 'Néron', 'Trajan'], 0, 'Il conserve les formes républicaines en concentrant le pouvoir.'],
            ['Les tribuns de la plèbe disposaient d’un droit de veto.', ['Vrai', 'Faux'], 0, 'C’était leur arme institutionnelle principale.'],
            ['Que désigne le mos maiorum ?', ['La coutume des ancêtres', 'La loi écrite', 'Le droit des étrangers', 'Le culte impérial'], 0, 'Norme non écrite, très contraignante socialement.'],
            ['Le droit romain a influencé les codes civils modernes.', ['Vrai', 'Faux'], 0, 'Le Code civil français lui doit beaucoup.'],
            ['La relation patronus / cliens désigne…', ['Un lien de protection et de services réciproques', 'Un contrat commercial', 'Une relation d’esclavage', 'Un lien militaire'], 0, 'Le clientélisme structure la vie politique romaine.'],
          ],
        },
      ],
    },
  ],
}
