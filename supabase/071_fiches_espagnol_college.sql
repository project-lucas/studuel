-- =============================================================================
-- Studuel — Migration 071 : fiches de révision Espagnol collège (5e · 4e · 3e)
-- Remplit/enrichit lessons.revision_sheet (support « Révision ») pour la leçon
-- « L'essentiel du cours » de chaque chapitre — remplace le placeholder générique
-- posé par 025 par du contenu réel.
--
-- Motif : UPDATE joint sur la clé naturelle (slug, niveau, chapitre, leçon),
-- garde `IS DISTINCT FROM` → réexécutable sans effet de bord. Contenu en
-- dollar-quoting ($md$…$md$) pour éviter l'échappement des apostrophes.
--
-- Pour lister ce qu'il reste à écrire :
--   SELECT s.slug, c.level, c.title, l.title
--     FROM public.lessons l
--     JOIN public.chapters c ON c.id = l.chapter_id
--     JOIN public.subjects s ON s.id = c.subject_id
--    WHERE l.revision_sheet IS NULL
--    ORDER BY s.slug, c.level, c.position, l.position;
--
-- PRÉREQUIS : 008 (subjects/chapters/lessons), 025 (colonne revision_sheet).
-- Idempotent.
-- =============================================================================

UPDATE public.lessons l
   SET revision_sheet = v.md
  FROM (VALUES
    ('espagnol', '5e', 'Saludos : se présenter', $md$# Saludos : se présenter — l'essentiel

**À retenir**
- Pour saluer : *hola* (bonjour/salut), *buenos días* (le matin), *buenas tardes* (l'après-midi), *buenas noches* (le soir).
- Se présenter avec le verbe *llamarse* (s'appeler) : *me llamo…* (je m'appelle…), *¿cómo te llamas?* (comment tu t'appelles ?).
- Dire son origine avec *ser* (être) : *soy de Francia* (je suis de France).
- En espagnol, on met un point d'interrogation **inversé** au début : ¿…? et ¡…! pour l'exclamation.

**Structure**
- ¿Cómo te llamas? → Me llamo Lucas.
- ¿De dónde eres? → Soy de París.

**Exemple**
> ¡Hola! Me llamo Ana, soy de España y tengo doce años.
> (Salut ! Je m'appelle Ana, je suis d'Espagne et j'ai douze ans.)

**Erreur classique**
- Oublier le ¿ et le ¡ au début des phrases. En espagnol, ils sont obligatoires.$md$),

    ('espagnol', '5e', 'Los artículos y el género', $md$# Los artículos y el género — l'essentiel

**À retenir**
- L'article défini (le/la/les) : **el** (masc. sing.), **la** (fém. sing.), **los** (masc. plur.), **las** (fém. plur.).
- L'article indéfini (un/une/des) : **un**, **una**, **unos**, **unas**.
- En général : les noms en **-o** sont masculins (*el libro*), ceux en **-a** sont féminins (*la mesa*).
- Le pluriel : on ajoute **-s** après une voyelle (*libros*), **-es** après une consonne (*los profesores*).

**Structure**
- el chico / la chica → los chicos / las chicas
- un coche / una casa → unos coches / unas casas

**Exemple**
> El profesor y la profesora hablan con los alumnos.
> (Le professeur et la professeure parlent avec les élèves.)

**Erreur classique**
- Attention aux exceptions : *el día* (le jour) est masculin malgré le -a, *la mano* (la main) est féminin malgré le -o.$md$),

    ('espagnol', '5e', 'La familia y la casa', $md$# La familia y la casa — l'essentiel

**À retenir**
- La famille : *el padre* (le père), *la madre* (la mère), *el hermano* / *la hermana* (le frère / la sœur), *los abuelos* (les grands-parents).
- La maison : *la cocina* (la cuisine), *el salón* (le salon), *el dormitorio* (la chambre), *el baño* (la salle de bain).
- Les adjectifs possessifs : **mi** (mon/ma), **tu** (ton/ta), **su** (son/sa), et au pluriel **mis**, **tus**, **sus**.
- Le verbe **tener** (avoir) sert à parler de la famille : *tengo dos hermanos* (j'ai deux frères).

**Vocabulaire**
- mi padre, mi madre, mis hermanos, mi casa, mi habitación

**Exemple**
> En mi casa hay tres dormitorios y una cocina grande.
> (Dans ma maison, il y a trois chambres et une grande cuisine.)

**Erreur classique**
- Le possessif s'accorde en nombre, pas en genre : on dit *mis hermanas* (et non *mias*). *Mi* devient *mis* au pluriel, sans changer selon masculin/féminin.$md$),

    ('espagnol', '5e', 'El presente de indicativo', $md$# El presente de indicativo — l'essentiel

**À retenir**
- Trois groupes de verbes selon la terminaison : **-ar** (*hablar*), **-er** (*comer*), **-ir** (*vivir*).
- Terminaisons de *hablar* : hablo, hablas, habla, hablamos, habláis, hablan.
- Terminaisons de *comer* : como, comes, come, comemos, coméis, comen.
- Terminaisons de *vivir* : vivo, vives, vive, vivimos, vivís, viven.
- On omet souvent le pronom sujet : la terminaison indique déjà la personne.

**Structure**
- yo hablo / tú hablas / él-ella habla
- nosotros comemos / vosotros coméis / ellos comen

**Exemple**
> Vivo en Madrid y estudio español en el colegio.
> (J'habite à Madrid et j'étudie l'espagnol au collège.)

**Erreur classique**
- Ne pas confondre *ser* et *estar* (deux verbes pour « être ») : *ser* pour l'identité permanente (*soy alto*), *estar* pour l'état ou le lieu (*estoy cansado*, *estoy en casa*).$md$),

    ('espagnol', '4e', 'El pretérito perfecto', $md$# El pretérito perfecto — l'essentiel

**À retenir**
- Le *pretérito perfecto* exprime une action passée **liée au présent** (aujourd'hui, ce mois-ci, déjà, jamais).
- Il se forme avec l'auxiliaire **haber** au présent + le **participe passé** : *he hablado* (j'ai parlé).
- Présent de *haber* : he, has, ha, hemos, habéis, han.
- Participes réguliers : **-ar** → **-ado** (*hablado*), **-er/-ir** → **-ido** (*comido*, *vivido*).

**Structure**
- he comido / has comido / ha comido
- hemos vivido / habéis vivido / han vivido

**Exemple**
> Hoy he estudiado mucho y he terminado los deberes.
> (Aujourd'hui j'ai beaucoup étudié et j'ai fini les devoirs.)

**Erreur classique**
- Certains participes sont irréguliers : *hacer* → *hecho*, *ver* → *visto*, *escribir* → *escrito*, *abrir* → *abierto*. Ne pas dire *he hacido*.$md$),

    ('espagnol', '4e', 'La ciudad y las direcciones', $md$# La ciudad y las direcciones — l'essentiel

**À retenir**
- Lieux de la ville : *la calle* (la rue), *la plaza* (la place), *el ayuntamiento* (la mairie), *la estación* (la gare).
- Demander son chemin : *¿dónde está…?* (où se trouve… ?), *¿cómo se va a…?* (comment va-t-on à… ?).
- Indications : *todo recto* (tout droit), *a la derecha* (à droite), *a la izquierda* (à gauche), *gira* (tourne).
- Pour situer, on utilise **estar** : *el banco está cerca* (la banque est proche).

**Structure**
- ¿Dónde está la estación? → Sigue todo recto y gira a la izquierda.

**Exemple**
> Perdone, ¿cómo se va a la plaza mayor? Está a la derecha, muy cerca.
> (Excusez-moi, comment va-t-on à la grand-place ? C'est à droite, tout près.)

**Erreur classique**
- Pour localiser un lieu, on emploie toujours *estar* et jamais *ser* : on dit *el museo está en el centro* (et non *es en el centro*).$md$),

    ('espagnol', '4e', 'Gustos y opiniones', $md$# Gustos y opiniones — l'essentiel

**À retenir**
- Le verbe **gustar** se construit à l'envers du français : ce n'est pas « j'aime » mais « ça me plaît ».
- On utilise un **pronom complément** : *me*, *te*, *le*, *nos*, *os*, *les* + *gusta* (singulier) / *gustan* (pluriel).
- *Me gusta el fútbol* (j'aime le football), *me gustan los deportes* (j'aime les sports).
- Pour donner un avis : *creo que…* (je crois que…), *pienso que…* (je pense que…), *en mi opinión* (à mon avis).

**Structure**
- Me gusta + nom singulier / infinitif → *me gusta leer*.
- Me gustan + nom pluriel → *me gustan las lenguas*.

**Exemple**
> Me gustan mucho las matemáticas, pero no me gusta la historia.
> (J'aime beaucoup les mathématiques, mais je n'aime pas l'histoire.)

**Erreur classique**
- Accorder *gustar* avec la personne : on ne dit pas *yo gusto el chocolate*. Le sujet grammatical est la chose aimée, donc *me gusta el chocolate*.$md$),

    ('espagnol', '4e', 'La vida cotidiana', $md$# La vida cotidiana — l'essentiel

**À retenir**
- Les verbes pronominaux de la routine : *levantarse* (se lever), *ducharse* (se doucher), *vestirse* (s'habiller), *acostarse* (se coucher).
- Ils se conjuguent avec le pronom réfléchi : *me levanto*, *te levantas*, *se levanta*…
- Dire l'heure : *son las tres* (il est trois heures), *es la una* (il est une heure), *a las ocho* (à huit heures).
- Certains verbes changent de voyelle : *acostarse* → *me acuesto* (o → ue), *vestirse* → *me visto* (e → i).

**Structure**
- Me levanto a las siete y me acuesto a las diez.

**Exemple**
> Por la mañana me ducho, desayuno y voy al colegio a las ocho.
> (Le matin, je me douche, je prends le petit-déjeuner et je vais au collège à huit heures.)

**Erreur classique**
- Oublier le pronom réfléchi : on dit *me levanto* et non *levanto* seul, qui voudrait dire « je lève (quelque chose) ».$md$),

    ('espagnol', '3e', 'El pretérito indefinido', $md$# El pretérito indefinido — l'essentiel

**À retenir**
- Le *pretérito indefinido* exprime une action passée **terminée et sans lien avec le présent** (hier, l'année dernière, en 2010).
- Terminaisons **-ar** (*hablar*) : hablé, hablaste, habló, hablamos, hablasteis, hablaron.
- Terminaisons **-er/-ir** (*comer*) : comí, comiste, comió, comimos, comisteis, comieron.
- Repères de temps : *ayer* (hier), *el año pasado* (l'an dernier), *anoche* (hier soir).

**Structure**
- Ayer + verbe à l'indefinido → *ayer visité el museo*.

**Exemple**
> El verano pasado viajé a Sevilla y visité la catedral.
> (L'été dernier, j'ai voyagé à Séville et j'ai visité la cathédrale.)

**Erreur classique**
- Ne pas confondre avec le *pretérito perfecto* : *ayer comí* (indefinido, action détachée du présent) mais *hoy he comido* (perfecto, lié à aujourd'hui).$md$),

    ('espagnol', '3e', 'Hablar del futuro', $md$# Hablar del futuro — l'essentiel

**À retenir**
- Le **futur proche** : *ir a* + infinitif → *voy a estudiar* (je vais étudier). Présent de *ir* : voy, vas, va, vamos, vais, van.
- Le **futur simple** : infinitif + terminaisons **-é, -ás, -á, -emos, -éis, -án**, identiques pour les trois groupes.
- *Hablar* au futur : hablaré, hablarás, hablará, hablaremos, hablaréis, hablarán.
- Repères : *mañana* (demain), *la próxima semana* (la semaine prochaine), *el año que viene* (l'année prochaine).

**Structure**
- Futur proche : voy a + infinitif → *voy a viajar*.
- Futur simple : *viajaré el próximo año*.

**Exemple**
> Mañana visitaré a mis abuelos y el domingo voy a descansar.
> (Demain je rendrai visite à mes grands-parents et dimanche je vais me reposer.)

**Erreur classique**
- Quelques futurs sont irréguliers : *tener* → *tendré*, *hacer* → *haré*, *poder* → *podré*, *decir* → *diré*. Ne pas dire *teneré*.$md$),

    ('espagnol', '3e', 'El mundo hispánico', $md$# El mundo hispánico — l'essentiel

**À retenir**
- L'espagnol (*el español* ou *el castellano*) est parlé par plus de 500 millions de personnes dans le monde.
- Une vingtaine de pays ont l'espagnol pour langue officielle, surtout en **Amérique latine** (Mexique, Argentine, Colombie…) et en Espagne.
- Différences d'accent et de mots : en Amérique latine, on emploie *ustedes* au lieu de *vosotros* ; le *voseo* (*vos*) existe en Argentine.
- Culture : fêtes comme *el Día de los Muertos* (Mexique), la *flamenco* (Espagne), le tango (Argentine).

**Vocabulaire**
- el país (le pays), la lengua (la langue), la frontera (la frontière), la costumbre (la coutume)

**Exemple**
> En México celebran el Día de los Muertos el dos de noviembre.
> (Au Mexique, on célèbre le Jour des Morts le deux novembre.)

**Erreur classique**
- Croire que l'espagnol est identique partout : le vocabulaire varie (*el coche* en Espagne, *el carro* en Amérique latine pour « la voiture »).$md$),

    ('espagnol', '3e', 'Preparar la expresión oral', $md$# Preparar la expresión oral — l'essentiel

**À retenir**
- Structure d'une présentation : introduire (*voy a hablar de…*), développer, conclure (*para terminar…*).
- Connecteurs utiles : *primero* (d'abord), *luego* (ensuite), *además* (de plus), *por eso* (c'est pourquoi), *sin embargo* (cependant).
- Donner son avis : *me parece que…* (il me semble que…), *estoy de acuerdo* (je suis d'accord), *no estoy de acuerdo* (je ne suis pas d'accord).
- Varier les temps : présent, *pretérito perfecto* et *indefinido* pour le passé, futur pour les projets.

**Structure**
- Introduction + arguments (primero… luego… además…) + conclusion (para terminar…).

**Exemple**
> Voy a hablar de mis vacaciones. Primero fui a la playa, luego visité un museo. En mi opinión, fue un viaje estupendo.
> (Je vais parler de mes vacances. D'abord je suis allé à la plage, puis j'ai visité un musée. À mon avis, ce fut un voyage formidable.)

**Erreur classique**
- Réciter sans intonation ni connecteurs. Un bon oral relie les idées avec des mots de liaison et varie les temps verbaux.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
