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
            cours: `L'allemand distingue nettement le registre familier du registre poli : c'est la première chose à maîtriser.

## Saluer
*Hallo* (familier), *Guten Morgen* (le matin), *Guten Tag* (la journée), *Guten Abend* (le soir), *Tschüss* (salut, en partant), *Auf Wiedersehen* (au revoir, poli).

## Se présenter
*Ich heiße Anna* (je m'appelle Anna) — ou *Ich bin Anna*. *Wie heißt du ?* (comment t'appelles-tu ?) / *Wie heißen Sie ?* (forme polie). *Ich komme aus Frankreich* (je viens de France). *Ich wohne in Lyon* (j'habite à Lyon). *Ich bin 13 Jahre alt* (j'ai 13 ans — attention : en allemand on **est** vieux, on n'**a** pas des années).

## Le vouvoiement
*du* = tu ; *Sie* (toujours avec une majuscule) = vous de politesse. Se tromper de registre est une faute lourde en allemand : on vouvoie tout adulte inconnu.

## Les nombres et l'alphabet
*eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn*. L'allemand écrit les nombres à l'envers du français à partir de 21 : *einundzwanzig* = « un-et-vingt ».`,
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
            cours: `La grammaire allemande repose sur le **genre** et sur les **cas**. C'est difficile au début, puis très régulier.

## Trois genres, trois articles
**der** (masculin), **die** (féminin), **das** (neutre). Au pluriel, l'article défini est **die** pour les trois genres. Le genre ne se devine pas toujours : on apprend le nom **avec** son article (*der Tisch*, *die Lampe*, *das Buch*).

## L'article indéfini
*ein* (masculin et neutre), *eine* (féminin). Il n'existe pas de pluriel de *ein* : on dit simplement *Bücher* (des livres).

## Le nominatif et l'accusatif
Le **nominatif** est le cas du sujet ; l'**accusatif**, celui du complément d'objet direct. Bonne nouvelle : seul le masculin change. *der* → *den*, *ein* → *einen*. *Der Hund sieht den Mann* : le chien voit l'homme.

## La majuscule
Tous les noms communs prennent une **majuscule** en allemand, quelle que soit leur place dans la phrase : *das Haus*, *die Schule*, *der Freund*.`,
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
            cours: `Deux règles suffisent à faire des phrases correctes dès le début.

## Le présent régulier
On retire *-en* à l'infinitif et on ajoute les terminaisons : *ich spiele, du spielst, er/sie/es spielt, wir spielen, ihr spielt, sie/Sie spielen*.

## Les deux verbes indispensables
**sein** (être) : *ich bin, du bist, er ist, wir sind, ihr seid, sie sind*. **haben** (avoir) : *ich habe, du hast, er hat, wir haben, ihr habt, sie haben*. Tous deux sont irréguliers et servent partout.

## Le verbe en deuxième position
Dans une phrase déclarative, le verbe conjugué occupe **toujours la deuxième place**, quel que soit l'élément placé en premier : *Ich gehe heute ins Kino* / *Heute gehe ich ins Kino*. Le sujet passe alors derrière le verbe : c'est l'**inversion**.

## La question
Question fermée : le verbe passe en première position (*Spielst du Fußball ?*). Question ouverte : mot interrogatif + verbe (*Wann kommst du ?*, *Wo wohnst du ?*, *Warum lernst du Deutsch ?*).`,
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
            cours: `L'allemand dispose de deux passés, dont l'emploi dépend surtout du **registre**.

## Le Perfekt
C'est le passé de l'oral et des échanges courants. Il se forme avec **haben** ou **sein** conjugué au présent + **participe passé** rejeté en fin de phrase : *Ich habe einen Film gesehen*. *Ich bin nach Berlin gefahren*.

## haben ou sein ?
On emploie **sein** avec les verbes de **mouvement** (*gehen, fahren, kommen, fliegen*) et de **changement d'état** (*aufstehen, einschlafen, sterben*), ainsi qu'avec *sein* et *bleiben*. Tous les autres prennent **haben**.

## Le participe passé
Verbes réguliers : **ge- + radical + -t** (*gespielt*, *gelernt*). Verbes forts : **ge- + radical modifié + -en** (*gesehen*, *gefahren*, *geschrieben*). Les verbes en *-ieren* ne prennent pas *ge-* (*studiert*).

## Le Präteritum
C'est le passé de l'écrit, du récit et de la presse. À l'oral, il ne survit que pour *sein* (*ich war*), *haben* (*ich hatte*) et les modaux (*ich konnte, ich wollte, ich musste*).`,
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
            cours: `Le datif est le cas du **complément d'attribution** — et celui qu'imposent de nombreuses prépositions.

## Les articles au datif
*der* → **dem**, *das* → **dem**, *die* → **der**, pluriel *die* → **den** (+ *-n* au nom : *den Kindern*).

## Les prépositions toujours suivies du datif
*aus, bei, mit, nach, seit, von, zu* (et *gegenüber*). Une phrase mnémotechnique les regroupe : « aus-bei-mit-nach-seit-von-zu ». *Ich fahre mit dem Bus*, *Ich komme aus der Schweiz*.

## Les prépositions toujours suivies de l'accusatif
*durch, für, gegen, ohne, um*. *Ich mache das für dich*.

## Les prépositions mixtes
*an, auf, hinter, in, neben, über, unter, vor, zwischen* prennent **l'accusatif s'il y a déplacement** (question *wohin ?*) et **le datif s'il y a localisation** (question *wo ?*). *Ich gehe in die Schule* (j'y vais) / *Ich bin in der Schule* (j'y suis).`,
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
            cours: `Parler une langue suppose de connaître le pays qui la parle.

## Le pays
La **République fédérale d'Allemagne** (*Bundesrepublik Deutschland*) compte environ 84 millions d'habitants et **16 Länder**. Sa capitale est **Berlin** ; sa monnaie, l'euro. C'est la première économie européenne.

## Les dates clés
**1949** : création de la RFA et de la RDA. **1961** : construction du mur de Berlin. **9 novembre 1989** : chute du mur. **3 octobre 1990** : réunification, aujourd'hui fête nationale (*Tag der Deutschen Einheit*).

## Les institutions
Le **Bundestag** est élu par les citoyens ; le **Bundesrat** représente les Länder. Le **Bundeskanzler** (chancelier) dirige le gouvernement ; le **Bundespräsident** a un rôle largement représentatif. Le fédéralisme donne aux Länder la compétence de l'éducation et de la culture.

## Traditions et vie quotidienne
Le *Weihnachtsmarkt* (marché de Noël), l'*Oktoberfest* à Munich, le *Karneval* rhénan, le *Abitur* (équivalent du baccalauréat), et une journée scolaire qui se termine souvent en début d'après-midi.`,
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
