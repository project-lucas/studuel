// Allemand LV2 — 5e → Terminale.
// Cycle 4 (5e-4e-3e, niveaux A1→A2) puis lycée (2de-1re-Tle, A2→B1).

export default {
  slug: 'allemand',
  nom: 'Allemand',
  blocs: [
    {
      niveaux: ['5e', '4e', '3e'],
      chapitres: [
        {
          titre: 'Se présenter et saluer',
          lecon: {
            titre: 'Sich vorstellen — les premiers échanges',
            cours: `L’allemand distingue nettement le registre familier du registre poli. C’est la première chose à maîtriser : se tromper de registre s’entend immédiatement.

## Saluer
| Formule | Quand | Registre |
| *Hallo* | À toute heure | Familier |
| *Guten Morgen* | Le matin | Neutre |
| *Guten Tag* | Dans la journée | Neutre à poli |
| *Guten Abend* | Le soir | Neutre à poli |
| *Tschüss* | En partant | Familier |
| *Auf Wiedersehen* | En partant | Poli |

## Se présenter
| Ce que je dis | En allemand |
| Je m’appelle Anna | *Ich heiße Anna* — ou *Ich bin Anna* |
| Comment t’appelles-tu ? | *Wie heißt du ?* |
| Comment vous appelez-vous ? | *Wie heißen Sie ?* |
| Je viens de France | *Ich komme aus Frankreich* |
| J’habite à Lyon | *Ich wohne in Lyon* |
| J’ai 13 ans | *Ich bin 13 Jahre alt* |

> Attention au dernier : en allemand on **est** vieux de treize ans, on n’**a** pas treize ans. *Ich habe 13 Jahre* est une faute de débutant qui s’entend tout de suite.

## Le vouvoiement
*du* = tu ; *Sie* = vous de politesse, **toujours avec une majuscule**, y compris au milieu d’une phrase. On vouvoie tout adulte inconnu : commerçant, professeur, voisin. Le tutoiement se propose, il ne se prend pas.

## Les nombres
*eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn.*

À partir de 21, l’allemand énonce les nombres **à l’envers du français** : *einundzwanzig*, littéralement « un-et-vingt ». *Vierundsechzig* = quatre-et-soixante, soit 64.`,
          },
          questions: [
            ['Comment dit-on « je m’appelle Anna » ?', ['Ich heiße Anna', 'Ich bin alt', 'Ich komme Anna', 'Ich wohne Anna'], 0, '*heißen* = s’appeler. On peut aussi dire *Ich bin Anna*.'],
            ['Que signifie « Guten Abend » ?', ['Bonsoir', 'Bonjour', 'Bonne nuit', 'Au revoir'], 0, '*Abend* = le soir.'],
            ['En allemand, « Sie » de politesse s’écrit toujours avec une majuscule.', ['Vrai', 'Faux'], 0, 'C’est ce qui le distingue à l’écrit de *sie* (elle / ils).'],
            ['Comment dit-on « j’ai 13 ans » ?', ['Ich bin 13 Jahre alt', 'Ich habe 13 Jahre', 'Ich bin 13 Jahre', 'Ich habe 13 alt'], 0, 'Littéralement : « je suis vieux de 13 ans ».'],
            ['« Tschüss » s’emploie pour prendre congé de façon familière.', ['Vrai', 'Faux'], 0, 'La forme polie est *Auf Wiedersehen*.'],
            ['Comment dit-on « je viens de France » ?', ['Ich komme aus Frankreich', 'Ich wohne Frankreich', 'Ich bin Frankreich', 'Ich gehe aus Frankreich'], 0, '*kommen aus* + pays d’origine.'],
            ['Comment se dit « vingt et un » en allemand ?', ['einundzwanzig', 'zwanzigundeins', 'zwanzigeins', 'einzwanzig'], 0, 'L’unité se dit avant la dizaine, reliée par *und*.'],
            ['On peut tutoyer un adulte inconnu en Allemagne sans problème.', ['Vrai', 'Faux'], 1, 'Le vouvoiement (*Sie*) est la règle avec les adultes qu’on ne connaît pas.'],
          ],
        },
        {
          titre: 'Les articles et les trois genres',
          lecon: {
            titre: 'der, die, das — et le cas accusatif',
            cours: `La grammaire allemande repose sur le **genre** et sur les **cas**. C’est difficile au début, puis très régulier — bien plus que le français.

## Trois genres, trois articles
| Genre | Article défini | Article indéfini | Exemple |
| Masculin | **der** | *ein* | *der Tisch* (la table) |
| Féminin | **die** | *eine* | *die Lampe* (la lampe) |
| Neutre | **das** | *ein* | *das Buch* (le livre) |
| Pluriel | **die** | pas d’article | *Bücher* (des livres) |

> Le genre allemand ne suit pas le français : *die Lampe* est féminin, *der Tisch* masculin, *das Mädchen* (la jeune fille) est **neutre**. On n’apprend donc jamais un nom seul : on apprend *der Tisch*, jamais *Tisch*.

## Le nominatif et l’accusatif
Le **nominatif** est le cas du sujet, l’**accusatif** celui du complément d’objet direct. Bonne nouvelle : **seul le masculin change**.

| Genre | Nominatif (sujet) | Accusatif (COD) |
| Masculin | *der* / *ein* | **den** / **einen** |
| Féminin | *die* / *eine* | *die* / *eine* |
| Neutre | *das* / *ein* | *das* / *ein* |
| Pluriel | *die* | *die* |

*Der Hund sieht den Mann* : le chien voit l’homme. *Den Hund sieht der Mann* : c’est l’homme qui voit le chien — le sens a changé, l’ordre des mots non.

## La majuscule
Tous les **noms communs** prennent une majuscule en allemand, quelle que soit leur place : *das Haus*, *die Schule*, *der Freund*. C’est une règle sans exception, et une faute très visible à l’écrit.`,
          },
          questions: [
            ['Quel est l’article défini neutre en allemand ?', ['das', 'der', 'die', 'den'], 0, '*das Buch*, *das Haus*, *das Kind*.'],
            ['Au pluriel, l’article défini est « die » pour tous les genres.', ['Vrai', 'Faux'], 0, '*die Männer*, *die Frauen*, *die Kinder*.'],
            ['Que devient « der » à l’accusatif ?', ['den', 'dem', 'die', 'das'], 0, 'Seul le masculin change entre nominatif et accusatif.'],
            ['En allemand, les noms communs prennent une majuscule.', ['Vrai', 'Faux'], 0, 'C’est une règle sans exception.'],
            ['Comment traduit-on « une lampe » ?', ['eine Lampe', 'ein Lampe', 'einen Lampe', 'das Lampe'], 0, '*Lampe* est féminin : *die Lampe*, *eine Lampe*.'],
            ['À quoi sert le cas accusatif ?', ['À marquer le complément d’objet direct', 'À marquer le sujet', 'À marquer le lieu', 'À marquer le possesseur'], 0, 'Le nominatif marque le sujet, l’accusatif le COD.'],
            ['Il faut apprendre chaque nom allemand avec son article.', ['Vrai', 'Faux'], 0, 'Le genre est rarement déductible : il s’apprend avec le mot.'],
            ['Dans « Ich sehe einen Hund », « einen » est…', ['L’accusatif masculin', 'Le nominatif masculin', 'Le féminin', 'Le pluriel'], 0, '*Hund* est COD du verbe *sehen*.'],
          ],
        },
        {
          titre: 'Le présent et la place du verbe',
          lecon: {
            titre: 'Conjuguer et construire la phrase',
            cours: `Deux règles suffisent à construire des phrases correctes dès les premières semaines : une conjugaison, et une place.

## Le présent régulier
On retire *-en* à l’infinitif, on ajoute la terminaison.

| Personne | *spielen* (jouer) | Terminaison |
| ich | *spiele* | -e |
| du | *spielst* | -st |
| er / sie / es | *spielt* | -t |
| wir | *spielen* | -en |
| ihr | *spielt* | -t |
| sie / Sie | *spielen* | -en |

## Les deux verbes indispensables
| Personne | *sein* (être) | *haben* (avoir) |
| ich | *bin* | *habe* |
| du | *bist* | *hast* |
| er / sie / es | *ist* | *hat* |
| wir | *sind* | *haben* |
| ihr | *seid* | *habt* |
| sie / Sie | *sind* | *haben* |

## Le verbe en deuxième position
> Dans une phrase déclarative, le verbe conjugué occupe **toujours la deuxième place**. Toujours — quel que soit l’élément placé en tête.

*Ich gehe heute ins Kino.* · *Heute gehe ich ins Kino.* · *Ins Kino gehe ich heute.*

Si un complément passe en première position, le sujet passe **derrière** le verbe : c’est l’**inversion**. Le français ne le fait pas, d’où la faute la plus fréquente en début d’apprentissage.

## La question
| Type de question | Où va le verbe | Exemple |
| Fermée (oui / non) | En **première** position | *Spielst du Fußball ?* |
| Ouverte | Après le mot interrogatif | *Wann kommst du ?* |

Les mots interrogatifs de base : *wer* (qui), *was* (quoi), *wann* (quand), *wo* (où), *wie* (comment), *warum* (pourquoi).`,
          },
          questions: [
            ['Dans une phrase déclarative allemande, le verbe conjugué est…', ['En deuxième position', 'En première position', 'En dernière position', 'Libre'], 0, 'C’est la règle la plus structurante de la syntaxe allemande.'],
            ['Comment conjugue-t-on « sein » à la 1re personne du singulier ?', ['ich bin', 'ich bist', 'ich habe', 'ich ist'], 0, '*sein* est irrégulier : *bin, bist, ist, sind, seid, sind*.'],
            ['Si la phrase commence par « Heute », le sujet passe après le verbe.', ['Vrai', 'Faux'], 0, 'C’est l’inversion : *Heute gehe ich…*.'],
            ['Quelle est la terminaison du verbe à la 2e personne du singulier ?', ['-st', '-t', '-en', '-e'], 0, '*du spielst*, *du lernst*, *du wohnst*.'],
            ['« Wo » signifie…', ['Où', 'Quand', 'Pourquoi', 'Comment'], 0, '*wann* = quand, *warum* = pourquoi, *wie* = comment.'],
            ['Dans une question fermée, le verbe se place en première position.', ['Vrai', 'Faux'], 0, '*Spielst du Fußball ?*'],
            ['Comment dit-on « il a » ?', ['er hat', 'er habt', 'er haben', 'er ist'], 0, '*haben* est irrégulier à la 2e et 3e personne du singulier.'],
            ['« Wir spielen » signifie…', ['Nous jouons', 'Ils jouent', 'Vous jouez', 'Je joue'], 0, '*wir* = nous, avec la terminaison *-en*.'],
          ],
        },
      ],
    },
    {
      niveaux: ['2de', '1re', 'Tle'],
      chapitres: [
        {
          titre: 'Raconter au passé',
          lecon: {
            titre: 'Perfekt et Präteritum',
            cours: `L’allemand dispose de deux passés. Le français choisirait selon le sens ; l’allemand, lui, choisit surtout selon le **registre** — à l’oral ou à l’écrit.

## Les deux passés, en un coup d’œil
| | Perfekt | Präteritum |
| Où l’employer | Oral, échanges courants, courriels | Écrit, récit, presse, littérature |
| Comment il se forme | *haben* ou *sein* + participe passé | Une terminaison sur le radical |
| Exemple | *Ich habe einen Film gesehen* | *Ich sah einen Film* |

> Le Präteritum survit à l’oral pour **trois familles seulement** : *sein* (*ich war*), *haben* (*ich hatte*) et les modaux (*ich konnte, ich wollte, ich musste*). Partout ailleurs, on parle au Perfekt.

## Le Perfekt
L’auxiliaire est conjugué au présent en deuxième position, et le **participe passé part en fin de phrase** : *Ich habe gestern mit meinem Bruder einen Film gesehen*. C’est cet éloignement qui déroute — il faut tenir le sens jusqu’au dernier mot.

## haben ou sein ?
| On emploie | Avec quels verbes | Exemples |
| **sein** | Mouvement d’un lieu à un autre | *gehen, fahren, kommen, fliegen* |
| **sein** | Changement d’état | *aufstehen, einschlafen, sterben* |
| **sein** | Les deux exceptions à retenir | *sein* et *bleiben* |
| **haben** | Tous les autres | *machen, sehen, essen, lesen* |

*Ich bin nach Berlin gefahren* (déplacement) mais *Ich habe das Auto gefahren* (j’ai conduit la voiture) : c’est le sens, pas le verbe, qui tranche.

## Le participe passé
| Type de verbe | Formation | Exemples |
| Régulier (faible) | ge- + radical + -t | *gespielt*, *gelernt*, *gemacht* |
| Fort | ge- + radical modifié + -en | *gesehen*, *gefahren*, *geschrieben* |
| En -ieren | Pas de ge- | *studiert*, *telefoniert* |

## Le Präteritum
C’est le passé du récit. Verbes faibles : radical + *-te* (*ich spielte*). Verbes forts : le radical change et ne prend aucune terminaison à la 1re et à la 3e personne du singulier (*ich ging*, *er sah*).`,
          },
          questions: [
            ['Quel auxiliaire s’emploie avec les verbes de mouvement au Perfekt ?', ['sein', 'haben', 'werden', 'müssen'], 0, '*Ich bin gefahren*, *ich bin gegangen*.'],
            ['Où se place le participe passé dans une phrase au Perfekt ?', ['À la fin de la phrase', 'Juste après le sujet', 'En deuxième position', 'Au début'], 0, 'L’auxiliaire est en deuxième position, le participe ferme la phrase.'],
            ['Le Präteritum est le passé le plus utilisé à l’oral courant.', ['Vrai', 'Faux'], 1, 'C’est le Perfekt à l’oral ; le Präteritum domine à l’écrit.'],
            ['Quel est le participe passé de « spielen » ?', ['gespielt', 'gespielen', 'spielt', 'gespiel'], 0, 'Verbe régulier : *ge-* + radical + *-t*.'],
            ['Les verbes en -ieren prennent le préfixe ge- au participe.', ['Vrai', 'Faux'], 1, 'On dit *studiert*, *telefoniert*, sans *ge-*.'],
            ['Comment dit-on « j’étais » ?', ['ich war', 'ich habe gewesen', 'ich bin war', 'ich hatte'], 0, '*sein* garde son Präteritum même à l’oral.'],
            ['Quel est le participe passé de « sehen » ?', ['gesehen', 'gesehet', 'geseht', 'sehen'], 0, 'Verbe fort : *ge-* + radical + *-en*.'],
            ['« Ich bin nach Berlin gefahren » est correct.', ['Vrai', 'Faux'], 0, '*fahren* est un verbe de mouvement : auxiliaire *sein*.'],
          ],
        },
        {
          titre: 'Le datif et les prépositions',
          lecon: {
            titre: 'Maîtriser le troisième cas',
            cours: `Le datif est le cas du **complément d’attribution** — et surtout celui qu’imposent de nombreuses prépositions. C’est là que se joue la moitié des fautes.

## Les articles au datif
| Genre | Nominatif | Datif | Remarque |
| Masculin | *der* | **dem** | |
| Neutre | *das* | **dem** | Même forme qu’au masculin |
| Féminin | *die* | **der** | Le piège : *der* devient féminin |
| Pluriel | *die* | **den** | Et le nom prend un -n : *den Kindern* |

## Les prépositions toujours suivies du datif
Sept mots à savoir dans l’ordre, comme une formule : **aus – bei – mit – nach – seit – von – zu** (plus *gegenüber*).

*Ich fahre mit dem Bus.* · *Ich komme aus der Schweiz.* · *Seit einem Jahr lerne ich Deutsch.*

## Les prépositions toujours suivies de l’accusatif
Cinq mots : **durch – für – gegen – ohne – um**. *Ich mache das für dich.* · *Wir gehen durch den Park.*

## Les prépositions mixtes
Neuf prépositions changent de cas selon le sens : *an, auf, hinter, in, neben, über, unter, vor, zwischen*.

| La question posée | Le cas | Le sens | Exemple |
| **wohin ?** (vers où ?) | Accusatif | Déplacement, on change de lieu | *Ich gehe in die Schule* |
| **wo ?** (où ?) | Datif | Localisation, on y est déjà | *Ich bin in der Schule* |

> Le réflexe qui ne trompe pas : poser la question au verbe. Un verbe de mouvement vers un but appelle l’accusatif ; un verbe d’état appelle le datif. *Ich hänge das Bild an die Wand* (je l’accroche) / *Das Bild hängt an der Wand* (il y pend).`,
          },
          questions: [
            ['Quel cas suit obligatoirement la préposition « mit » ?', ['Le datif', 'L’accusatif', 'Le nominatif', 'Le génitif'], 0, 'Elle fait partie du groupe aus-bei-mit-nach-seit-von-zu.'],
            ['Que devient l’article « die » (féminin) au datif ?', ['der', 'dem', 'den', 'die'], 0, 'Un piège fréquent : *der* est aussi le masculin nominatif.'],
            ['« Ich gehe in die Schule » exprime un déplacement.', ['Vrai', 'Faux'], 0, 'Avec une préposition mixte, le déplacement (wohin ?) demande l’accusatif.'],
            ['Quelle préposition est toujours suivie de l’accusatif ?', ['für', 'mit', 'von', 'seit'], 0, 'Avec *durch, gegen, ohne, um*.'],
            ['Au datif pluriel, le nom prend un -n supplémentaire.', ['Vrai', 'Faux'], 0, '*den Kindern*, *den Freunden*.'],
            ['« Ich bin in der Schule » exprime…', ['Une localisation', 'Un déplacement', 'Une possession', 'Un futur'], 0, 'Question *wo ?* → datif.'],
            ['Que devient « das » au datif ?', ['dem', 'der', 'den', 'das'], 0, 'Masculin et neutre partagent *dem* au datif.'],
            ['« Ich komme aus der Schweiz » est correct.', ['Vrai', 'Faux'], 0, '*aus* impose le datif : *die Schweiz* → *der Schweiz*.'],
          ],
        },
        {
          titre: 'L’Allemagne d’aujourd’hui',
          lecon: {
            titre: 'Repères de civilisation',
            cours: `Parler une langue suppose de connaître le pays qui la parle. Quatre entrées suffisent pour le bac : le pays, les dates, les institutions, la vie quotidienne.

## Le pays
La **République fédérale d’Allemagne** (*Bundesrepublik Deutschland*) compte environ **84 millions** d’habitants et **16 Länder**. Capitale : **Berlin**. Monnaie : l’euro. C’est la **première économie européenne**.

## Les dates clés
| Date | L’événement | Ce qu’il change |
| 1949 | Création de la RFA et de la RDA | Le pays est coupé en deux |
| 1961 | Construction du mur de Berlin | La coupure devient un mur |
| 9 novembre 1989 | Chute du mur | La RDA s’ouvre |
| 3 octobre 1990 | Réunification | Fête nationale : *Tag der Deutschen Einheit* |

## Les institutions
| Institution | Qui la compose | Son rôle |
| *Bundestag* | Élu par les citoyens | Vote les lois |
| *Bundesrat* | Représentants des Länder | Le fédéralisme au Parlement |
| *Bundeskanzler* | Chef du gouvernement | Dirige la politique du pays |
| *Bundespräsident* | Élu indirectement | Rôle largement représentatif |

> Le **fédéralisme** n’est pas un détail : ce sont les Länder, et non l’État fédéral, qui décident de l’éducation et de la culture. D’où seize systèmes scolaires différents.

## Traditions et vie quotidienne
Le *Weihnachtsmarkt* (marché de Noël), l’*Oktoberfest* à Munich, le *Karneval* rhénan, l’*Abitur* (équivalent du baccalauréat) — et une journée scolaire qui s’achève souvent en début d’après-midi, les activités se tenant hors de l’école.`,
          },
          questions: [
            ['Combien de Länder compte l’Allemagne ?', ['16', '12', '20', '9'], 0, 'Le fédéralisme leur confie notamment l’éducation.'],
            ['Quelle est la date de la chute du mur de Berlin ?', ['Le 9 novembre 1989', 'Le 3 octobre 1990', 'Le 13 août 1961', 'Le 8 mai 1945'], 0, 'La réunification interviendra le 3 octobre 1990.'],
            ['La fête nationale allemande commémore la réunification.', ['Vrai', 'Faux'], 0, 'Le *Tag der Deutschen Einheit*, le 3 octobre.'],
            ['Qui dirige le gouvernement allemand ?', ['Le chancelier (Bundeskanzler)', 'Le président fédéral', 'Le président du Bundesrat', 'Le roi'], 0, 'Le *Bundespräsident* a un rôle surtout représentatif.'],
            ['Le Bundesrat représente les Länder.', ['Vrai', 'Faux'], 0, 'Le Bundestag, lui, est élu directement par les citoyens.'],
            ['Comment s’appelle l’examen équivalent au baccalauréat ?', ['Das Abitur', 'Das Diplom', 'Der Bachelor', 'Die Matura'], 0, 'Le *Matura* est autrichien ou suisse.'],
            ['En quelle année la RFA et la RDA ont-elles été créées ?', ['1949', '1945', '1961', '1990'], 0, 'Quatre ans après la fin de la guerre.'],
            ['L’Allemagne est la première économie de l’Union européenne.', ['Vrai', 'Faux'], 0, 'Devant la France, avec une industrie exportatrice puissante.'],
          ],
        },
      ],
    },
  ],
}
