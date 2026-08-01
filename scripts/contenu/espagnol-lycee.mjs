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
            cours: `L'espagnol distingue trois passés, et le choix entre eux dépend de la **manière de voir** l'action, pas seulement du moment.

## Le pretérito indefinido
Action **achevée**, coupée du présent, souvent datée : *Ayer comí paella*. Formes régulières : *-é, -aste, -ó, -amos, -asteis, -aron* (verbes en -ar) ; *-í, -iste, -ió, -imos, -isteis, -ieron* (verbes en -er/-ir).

## L'imperfecto
**Description**, habitude, action en cours dans le passé : *Cuando era pequeño, jugaba al fútbol*. Terminaisons : *-aba, -abas, -aba…* (-ar) et *-ía, -ías, -ía…* (-er/-ir). Trois irréguliers seulement : *ser* (era), *ir* (iba), *ver* (veía).

## Le pretérito perfecto
Passé **relié au présent**, avec des marqueurs comme *hoy, esta semana, ya, todavía no* : *Hoy he estudiado mucho*. Formation : *haber* au présent + participe passé.

## Le contraste
Dans un récit, l'imparfait plante le décor et le passé simple fait avancer l'action : *Llovía cuando salí de casa*. C'est ce contraste, plus que les terminaisons, que l'épreuve évalue.`,
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
            cours: `L'erreur la plus visible d'un francophone en espagnol tient à un seul choix : *ser* ou *estar*.

## Ser
Identité, origine, profession, caractéristique **essentielle**, heure et date : *Es francés*, *Soy profesora*, *Son las tres*, *El hielo es frío*.

## Estar
État **passager**, localisation, résultat d'un changement, humeur : *Está cansado*, *Madrid está en España*, *La sopa está fría*.

## Le sens change avec le verbe
*Ser listo* (être malin) / *estar listo* (être prêt). *Ser aburrido* (être ennuyeux) / *estar aburrido* (s'ennuyer). *Ser rico* (être riche) / *estar rico* (être délicieux). Ce ne sont pas des nuances : ce sont des sens différents.

## Trois tournures à maîtriser
**Gustar** se construit à l'envers du français : *Me gusta el cine* (le cinéma me plaît), *Me gustan las películas*. **Hay** (il y a) est invariable : *Hay dos libros*. **Hace** sert au temps qui passe : *Hace dos años que estudio español*.`,
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
            cours: `L'épreuve du bac s'appuie sur des **axes thématiques** : identités, mémoire, citoyenneté, innovation. Quelques repères servent partout.

## Un espace immense
L'espagnol est parlé par plus de 500 millions de personnes dans une vingtaine de pays. C'est la deuxième langue maternelle du monde. Les variantes (voseo argentin, seseo andalou et américain, vocabulaire mexicain) ne sont pas des fautes : ce sont des normes régionales.

## Mémoire et démocratie
La **guerra civil** (1936-1939) puis le franquisme jusqu'en 1975 ; la **transición** vers la démocratie et la Constitution de 1978. En Amérique latine, les dictatures des années 1970 (Chili, Argentine) et le travail de mémoire des *Madres de Plaza de Mayo*.

## Créations
**Cervantes** et *Don Quijote* ; **Lorca** et le théâtre ; **Picasso** et *Guernica* ; **Frida Kahlo** ; le **réalisme magique** de García Márquez ; le cinéma d'Almodóvar et de Guillermo del Toro.

## Enjeux contemporains
Migrations et frontières, plurilinguisme (catalan, basque, galicien, langues amérindiennes), inégalités, écologie amazonienne, poids économique et culturel du monde hispanophone aux États-Unis.`,
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
