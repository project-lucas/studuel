// Espagnol LV2 — LYCÉE (2de, 1re, Tle).
//
// La matière existe depuis longtemps mais s'arrêtait en 3e : la sonde du
// 01/08/2026 montrait 12 chapitres en 5e-4e-3e et ZÉRO au lycée, alors que
// `subjects.levels` ouvre l'espagnol jusqu'en terminale. Un élève de 2de qui
// choisissait espagnol tombait sur un programme vide.

export default {
  slug: 'espagnol',
  nom: 'Espagnol',
  blocs: [
    {
      niveaux: ['2de', '1re', 'Tle'],
      chapitres: [
        {
          titre: 'Les temps du passé',
          lecon: {
            titre: 'Pretérito, imperfecto, perfecto',
            cours: `L’espagnol distingue trois passés. Le choix ne dépend pas du moment de l’action, mais de la **manière de la voir** : achevée, en cours, ou encore reliée à aujourd’hui.

## Les trois passés en un coup d’œil
| Temps | Ce qu’il exprime | Marqueurs | Exemple |
| **Indefinido** | Action achevée, coupée du présent | *ayer, en 1998, el año pasado* | *Ayer comí paella* |
| **Imperfecto** | Description, habitude, action en cours | *siempre, todos los días, mientras* | *Cuando era pequeño, jugaba al fútbol* |
| **Perfecto** | Passé relié au présent | *hoy, esta semana, ya, todavía no* | *Hoy he estudiado mucho* |

## Les terminaisons
| Temps | Verbes en -ar | Verbes en -er / -ir |
| Indefinido | -é, -aste, -ó, -amos, -asteis, -aron | -í, -iste, -ió, -imos, -isteis, -ieron |
| Imperfecto | -aba, -abas, -aba, -ábamos, -abais, -aban | -ía, -ías, -ía, -íamos, -íais, -ían |
| Perfecto | *haber* au présent + participe passé | *haber* au présent + participe passé |

> L’imparfait espagnol n’a que **trois irréguliers**, en tout et pour tout : *ser* (*era*), *ir* (*iba*), *ver* (*veía*). C’est le temps le plus sûr de la langue.

## Le contraste, c’est là que se joue la note
Dans un récit, les deux temps ne se concurrencent pas : ils se répartissent le travail.

1. L’**imperfecto** plante le décor : ce qui durait, ce qui était en cours.
2. L’**indefinido** fait avancer l’action : ce qui survient et rompt le décor.

*Llovía cuando salí de casa* — il pleuvait (décor) quand je suis sorti (événement). Inverser les deux temps produit une phrase grammaticalement correcte mais qui raconte autre chose.

## Le piège du perfecto
Le français emploie le passé composé partout ; l’espagnol le réserve à ce qui touche encore au présent. *Ayer he comido* est une faute : *ayer* coupe du présent, donc *ayer comí*.`,
          },
          questions: [
            ['Quel temps s’emploie pour une description dans le passé ?', ['El imperfecto', 'El pretérito indefinido', 'El pretérito perfecto', 'El futuro'], 0, 'Il plante le décor, exprime l’habitude et la durée.'],
            ['« Ayer comí paella » est au pretérito indefinido.', ['Vrai', 'Faux'], 0, 'Action achevée et datée, coupée du présent.'],
            ['Comment se forme le pretérito perfecto ?', ['haber au présent + participe passé', 'tener + infinitif', 'ser + gérondif', 'ir a + infinitif'], 0, '*He comido*, *has estudiado*.'],
            ['Quel marqueur appelle le pretérito perfecto ?', ['Hoy', 'Ayer', 'El año pasado', 'Entonces'], 0, 'Comme *esta semana*, *ya*, *todavía no*.'],
            ['« Ser », « ir » et « ver » sont les seuls irréguliers à l’imparfait.', ['Vrai', 'Faux'], 0, '*era*, *iba*, *veía* : trois exceptions, pas une de plus.'],
            ['Dans « Llovía cuando salí », quel temps fait avancer l’action ?', ['Salí (indefinido)', 'Llovía (imperfecto)', 'Les deux', 'Aucun'], 0, 'L’imparfait décrit le cadre, le passé simple marque l’événement.'],
            ['La terminaison « -aron » appartient au pretérito indefinido des verbes en -ar.', ['Vrai', 'Faux'], 0, '*Hablaron*, *cantaron*, *estudiaron*.'],
            ['« Cuando era pequeño » exprime…', ['Une habitude passée', 'Une action ponctuelle', 'Un futur proche', 'Une hypothèse'], 0, 'L’imparfait est le temps de l’habitude.'],
          ],
        },
        {
          titre: 'Ser, estar et les tournures essentielles',
          lecon: {
            titre: 'Deux verbes « être », et tout change',
            cours: `L’erreur la plus visible d’un francophone en espagnol tient à un seul choix : *ser* ou *estar*. Le français n’a qu’un verbe « être » ; l’espagnol en a deux, et ils ne disent pas la même chose.

## Ser ou estar ?
| | **Ser** | **Estar** |
| Ce qu’il exprime | Ce que la chose **est** | Ce dans quoi elle **se trouve** |
| Emplois | Identité, origine, profession, matière | État passager, localisation, humeur |
| Le temps | L’heure et la date | Le résultat d’un changement |
| Exemples | *Es francés*, *Soy profesora*, *Son las tres* | *Está cansado*, *Madrid está en España* |

*El hielo es frío* (la glace est froide : c’est sa nature) mais *La sopa está fría* (la soupe est froide : elle a refroidi).

## Le sens change avec le verbe
Ce ne sont pas des nuances de style : ce sont des sens différents.

| Avec *ser* | Avec *estar* |
| *ser listo* : être malin | *estar listo* : être prêt |
| *ser aburrido* : être ennuyeux | *estar aburrido* : s’ennuyer |
| *ser rico* : être riche | *estar rico* : être délicieux |
| *ser malo* : être méchant | *estar malo* : être malade |

> Le réflexe qui tranche : se demander si l’on décrit **ce qu’est** le sujet, ou **comment il va**. Le premier appelle *ser*, le second *estar*.

## Trois tournures à maîtriser
| Tournure | Sa construction | Exemple |
| **Gustar** | À l’envers du français : la chose plaît à quelqu’un | *Me gusta el cine*, *Me gustan las películas* |
| **Hay** | Invariable, jamais au pluriel | *Hay dos libros* |
| **Hace** | Le temps écoulé | *Hace dos años que estudio español* |

Le piège de *gustar* : le verbe s’accorde avec **ce qui plaît**, pas avec la personne. *Me gustan* si la chose est au pluriel.`,
          },
          questions: [
            ['Quel verbe employer pour la localisation ?', ['Estar', 'Ser', 'Haber', 'Tener'], 0, '*Madrid está en España*.'],
            ['« Ser listo » et « estar listo » ont le même sens.', ['Vrai', 'Faux'], 1, '« Être malin » contre « être prêt ».'],
            ['Comment dit-on « j’aime les films » ?', ['Me gustan las películas', 'Yo gusto las películas', 'Me gusta las películas', 'Amo las películas'], 0, 'Le verbe s’accorde avec ce qui plaît, ici au pluriel.'],
            ['« Hay » est invariable.', ['Vrai', 'Faux'], 0, '*Hay un libro*, *hay dos libros*.'],
            ['« Está cansado » exprime…', ['Un état passager', 'Une caractéristique essentielle', 'Une profession', 'Une origine'], 0, 'La fatigue passe : c’est *estar*.'],
            ['Pour dire l’heure, on utilise…', ['Ser', 'Estar', 'Haber', 'Hacer'], 0, '*Son las tres*.'],
            ['« Estar rico » signifie « être riche ».', ['Vrai', 'Faux'], 1, 'Cela signifie « être délicieux » : *ser rico* pour la richesse.'],
            ['« Hace dos años que estudio español » signifie…', ['J’étudie l’espagnol depuis deux ans', 'J’ai étudié il y a deux ans', 'Je vais étudier deux ans', 'J’étudiais il y a deux ans'], 0, '*Hace… que* + présent exprime la durée en cours.'],
          ],
        },
        {
          titre: 'Le monde hispanique aujourd’hui',
          lecon: {
            titre: 'Repères pour les axes du programme',
            cours: `L’épreuve s’appuie sur des **axes thématiques** — identités, mémoire, citoyenneté, innovation. Quelques repères servent dans presque tous les sujets.

## Un espace immense
L’espagnol est parlé par plus de **500 millions** de personnes, dans une vingtaine de pays : c’est la **deuxième langue maternelle du monde**.

| Variante | Où | Ce qu’elle change |
| *Voseo* | Argentine, Uruguay, Amérique centrale | *vos* remplace *tú* : *vos tenés* |
| *Seseo* | Andalousie, toute l’Amérique | *z* et *c* se prononcent *s* |
| Lexique mexicain | Mexique | *carro* pour *coche*, *platicar* pour *hablar* |

> Ces variantes ne sont pas des fautes : ce sont des **normes régionales**. Les traiter comme des écarts est un contresens sur ce qu’est une langue mondiale.

## Mémoire et démocratie
| Date | En Espagne | En Amérique latine |
| 1936-1939 | La *guerra civil* | |
| 1939-1975 | Le franquisme | |
| 1973-1990 | | Dictature de Pinochet au Chili |
| 1976-1983 | | Dictature argentine, *Madres de Plaza de Mayo* |
| 1975-1978 | La *transición*, Constitution de 1978 | |

## Créations
| Domaine | Références |
| Littérature | **Cervantes** et *Don Quijote* ; **Lorca** au théâtre |
| Peinture | **Picasso** et *Guernica* ; **Frida Kahlo** |
| Roman contemporain | Le **réalisme magique** de García Márquez |
| Cinéma | **Almodóvar**, **Guillermo del Toro** |

## Enjeux contemporains
Migrations et frontières ; plurilinguisme (catalan, basque, galicien, langues amérindiennes) ; inégalités ; écologie amazonienne ; et le poids économique et culturel du monde hispanophone **aux États-Unis**, où l’espagnol est la deuxième langue parlée.`,
          },
          questions: [
            ['Combien de personnes parlent espagnol dans le monde environ ?', ['Plus de 500 millions', '100 millions', '2 milliards', '50 millions'], 0, 'Deuxième langue maternelle du monde.'],
            ['Le franquisme prend fin en 1975.', ['Vrai', 'Faux'], 0, 'À la mort de Franco ; la Constitution démocratique date de 1978.'],
            ['Qui a peint *Guernica* ?', ['Picasso', 'Dalí', 'Miró', 'Goya'], 0, 'En 1937, après le bombardement de la ville basque.'],
            ['Les *Madres de Plaza de Mayo* sont associées…', ['À la dictature argentine', 'À la guerre civile espagnole', 'À la révolution mexicaine', 'À la conquête'], 0, 'Elles réclament les disparus depuis 1977.'],
            ['Le voseo est une faute de grammaire.', ['Vrai', 'Faux'], 1, 'C’est une norme régionale, notamment en Argentine.'],
            ['Quel auteur est associé au réalisme magique ?', ['García Márquez', 'Cervantes', 'Lorca', 'Machado'], 0, '*Cien años de soledad*, 1967.'],
            ['La guerre civile espagnole s’est déroulée de 1936 à 1939.', ['Vrai', 'Faux'], 0, 'Elle ouvre près de quarante ans de dictature.'],
            ['Le catalan, le basque et le galicien sont…', ['Des langues co-officielles en Espagne', 'Des dialectes de l’espagnol', 'Des langues éteintes', 'Des créoles'], 0, 'Elles ont un statut officiel dans leur communauté autonome.'],
          ],
        },
      ],
    },
  ],
}
