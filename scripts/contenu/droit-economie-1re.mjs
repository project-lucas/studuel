// DROIT ET ÉCONOMIE — PREMIÈRE TECHNOLOGIQUE (STMG). Matière propre à la voie
// technologique (slug `droit-economie`), déclarée pour la seule série STMG : un
// élève de la voie générale ne la voit jamais. Le contenu de « 1re techno » est
// rangé au niveau '1re' (alias contentLevelFor, lib/grades.ts).
//
// LE DÉCOUPAGE EST CELUI DU PROGRAMME OFFICIEL (BO spécial n° 1 du 22 janvier
// 2019) : quatre thèmes de droit, cinq thèmes d'économie. Chaque fiche porte en
// `axe` le thème du programme qui la coiffe, préfixé « Droit — » ou
// « Économie — » : les deux disciplines vivent dans le même dossier, sans rayon
// (un rayon « droit » / « economie » demanderait deux libellés de plus dans
// DISCIPLINE_LABELS, lib/subject-template.ts).
//
// Le droit est à jour de 2026 : RGPD, animal « être vivant doué de sensibilité »
// (art. 515-14 du Code civil), tribunal judiciaire (depuis le 1er janvier 2020),
// écrit électronique, comité social et économique.

export default {
  slug: 'droit-economie',
  nom: 'Droit et économie',

  titreMigration: 'DROIT ET ÉCONOMIE 1re STMG — LE PROGRAMME OFFICIEL (16 fiches)',

  motif: `Matière NEUVE de la voie technologique : le droit et l'économie de la
série STMG, enseignement de spécialité de première (programme publié au BO
spécial n° 1 du 22 janvier 2019). La matière n'avait aucun contenu.

Cette migration installe 16 fiches rangées sous les thèmes du programme : les
quatre thèmes de droit (qu'est-ce que le droit, le règlement d'un litige, les
personnes juridiques, les droits reconnus aux personnes) et les cinq thèmes
d'économie (grandes questions économiques, création et répartition de la
richesse, affectation du revenu des ménages, financement de l'activité,
concurrence sur les marchés). 12 questions par fiche.

Les notions de première peuvent être mobilisées à l'épreuve écrite de droit et
économie de terminale (4 heures, partie juridique et partie économique).`,

  blocs: [
    {
      niveaux: ['1re'],
      positionDepart: 1,
      chapitres: [
        // ---------------- DROIT — Thème 1 : Qu'est-ce que le droit ? ----------
        {
          titre: 'Le droit et ses fonctions',
          axe: 'Droit — Thème 1 : Qu’est-ce que le droit ?',
          lecon: {
            titre: 'À quoi sert le droit dans une société',
            cours: `Le **droit** est l’ensemble des règles qui organisent la vie en société et dont le respect est assuré par l’autorité publique. Il n’est pas neutre : il traduit les **valeurs** qu’une société choisit de protéger.

## Les valeurs qui fondent le droit français
Depuis la philosophie des Lumières et la Déclaration des droits de l’homme et du citoyen de 1789, quelques grands principes structurent notre société démocratique.

| Principe | Ce qu’il signifie | Un exemple concret |
| **Liberté** | Chacun peut agir tant qu’il ne nuit pas à autrui | Liberté d’expression, liberté d’entreprendre |
| **Égalité** | Même règle pour tous ceux qui sont dans la même situation | Interdiction des discriminations à l’embauche |
| **Solidarité** | La collectivité protège les plus fragiles | Sécurité sociale, minima sociaux |
| **Laïcité** | L’État est neutre et garantit la liberté de conscience | Neutralité des agents publics (loi de 1905) |

## L’État de droit
Dans un **État de droit**, les gouvernants sont eux-mêmes soumis au droit : une loi doit respecter la Constitution, une décision administrative doit respecter la loi, et un juge indépendant peut sanctionner ceux qui ne respectent pas la règle — y compris l’État.

> L’État de droit, c’est l’inverse de l’arbitraire : personne n’est au-dessus des règles, pas même celui qui les écrit.

## Les fonctions du droit
1. **Organiser la société** : il fixe le fonctionnement des institutions, des entreprises, de la famille.
2. **Protéger les personnes** : il garantit des droits (vie privée, sécurité, dignité) et protège les plus faibles (mineurs, salariés, consommateurs).
3. **Pacifier les relations** : il offre un cadre pour régler les conflits sans violence, devant un juge.
4. **Faire évoluer la société** : il accompagne les changements (mariage pour tous en 2013, protection des données avec le RGPD en 2018).

## Droit et morale
| | Règle de **droit** | Règle **morale** |
| Source | Autorité publique légitime | La conscience, la religion, la société |
| But | L’ordre social | Le perfectionnement de l’individu |
| Sanction | Sanction **étatique** (amende, prison, dommages et intérêts) | Remords, réprobation des autres |

Les deux se recoupent souvent (« ne pas tuer ») mais pas toujours : mentir à un ami n’est pas illégal ; rouler à 55 km/h en ville n’est pas immoral, mais c’est sanctionné.

## L’ordre public
Certaines règles sont **d’ordre public** : on ne peut pas y déroger par contrat, même si les deux parties sont d’accord. Un contrat de travail qui prévoirait un salaire inférieur au SMIC serait nul sur ce point.

## Exemple travaillé
Deux voisins signent un accord : l’un renonce à porter plainte si l’autre lui verse 500 euros pour l’avoir frappé. Cet accord peut-il empêcher le procureur de poursuivre ?
Non : la répression des violences relève de l’**ordre public**. Les particuliers ne peuvent pas « acheter » l’impunité ; seul le ministère public décide de l’action publique.`,
          },
          questions: [
            ['Qu’est-ce qu’un État de droit ?', ['Un État qui possède beaucoup de lois', 'Un État où le chef de l’État fait la loi seul', 'Un État où les gouvernants sont eux aussi soumis aux règles de droit', 'Un État sans juges'], 2, 'Dans un État de droit, même l’État peut être sanctionné par un juge indépendant.'],
            ['Quelle sanction distingue la règle de droit de la règle morale ?', ['Une sanction prononcée par l’autorité publique', 'La réprobation de l’entourage', 'Le remords', 'L’exclusion d’un groupe d’amis'], 0, 'La règle de droit est assortie d’une sanction étatique : amende, dommages et intérêts, prison.'],
            ['Laquelle de ces fonctions n’est PAS une fonction du droit ?', ['Organiser la société', 'Protéger les personnes', 'Pacifier les relations sociales', 'Garantir le bonheur de chacun'], 3, 'Le droit organise, protège, pacifie et fait évoluer la société ; le bonheur relève de la sphère personnelle.'],
            ['Une règle d’ordre public peut être écartée si les deux parties au contrat sont d’accord.', ['Vrai', 'Faux'], 1, 'Précisément : on ne peut pas y déroger par contrat. Un salaire sous le SMIC reste interdit même si le salarié l’accepte.'],
            ['La neutralité religieuse des agents publics découle du principe de…', ['Solidarité', 'Laïcité', 'Liberté contractuelle', 'Propriété'], 1, 'La laïcité impose la neutralité de l’État et garantit la liberté de conscience de chacun.'],
            ['Mentir à un ami est…', ['Un délit puni d’amende', 'Une contravention', 'Interdit par la Constitution', 'Contraire à la morale mais pas sanctionné par le droit'], 3, 'Droit et morale se recoupent souvent, mais pas toujours.'],
            ['Quel texte de 1789 fonde les principes de liberté et d’égalité ?', ['La Déclaration des droits de l’homme et du citoyen', 'Le Code civil', 'La Constitution de 1958', 'Le traité de Rome'], 0, 'La DDHC fait partie du « bloc de constitutionnalité » : elle a toujours valeur constitutionnelle.'],
            ['La protection des mineurs, des salariés et des consommateurs illustre la fonction…', ['D’organisation', 'De pacification', 'De protection', 'D’évolution'], 2, 'Le droit rééquilibre les relations où l’une des parties est plus faible.'],
            ['L’adoption du RGPD en 2018 illustre surtout la fonction du droit qui consiste à…', ['Sanctionner les crimes', 'Organiser la famille', 'Fixer les impôts', 'Faire évoluer la société en suivant les changements techniques'], 3, 'Le règlement européen sur les données personnelles répond à l’essor du numérique.'],
            ['Le principe d’égalité interdit notamment…', ['De fixer des salaires différents selon le poste', 'La progressivité de l’impôt', 'Les discriminations fondées sur le sexe ou l’origine', 'La création d’entreprises'], 2, 'L’égalité impose la même règle pour tous ceux qui sont dans la même situation.'],
            ['Qui décide de poursuivre l’auteur d’une infraction pénale ?', ['La victime seule', 'Le ministère public (procureur)', 'L’avocat de l’auteur', 'Le maire'], 1, 'L’action publique appartient au ministère public ; la victime peut toutefois se constituer partie civile.'],
            ['La solidarité, comme valeur du droit, se traduit par exemple par…', ['La Sécurité sociale', 'La liberté du commerce', 'Le droit de propriété', 'Le secret des affaires'], 0, 'La collectivité prend en charge les risques de chacun : maladie, vieillesse, chômage.'],
          ],
        },
        {
          titre: 'La règle de droit et la qualification juridique',
          axe: 'Droit — Thème 1 : Qu’est-ce que le droit ?',
          lecon: {
            titre: 'Reconnaître une règle de droit et qualifier une situation',
            cours: `Toutes les règles ne sont pas des règles de droit : le règlement d’un club de foot ou les usages de politesse n’en sont pas. Une **règle de droit** se reconnaît à trois caractères.

## Les trois caractères de la règle de droit
| Caractère | Ce qu’il signifie | Ce qu’il garantit |
| **Générale** (et abstraite) | Elle vise une catégorie de personnes, pas un individu nommé | L’**égalité** devant la loi |
| **Obligatoire** | Elle s’impose à tous, sa violation est sanctionnée par l’État | Son **effectivité** |
| **Légitime** | Elle émane d’une **autorité compétente** (Parlement, gouvernement, juge…) | Son **acceptation** |

Une règle « générale » ne veut pas dire qu’elle concerne tout le monde : l’article du Code du travail sur le licenciement ne vise que les salariés, mais **tous** les salariés placés dans la même situation.

## Des règles dans des codes
Les règles sont rassemblées par matière dans des **codes** : Code civil (personnes, contrats, propriété), Code du travail, Code pénal, Code de la consommation, Code de commerce… Chaque règle y porte un numéro d’**article** (par exemple l’article 1240 du Code civil sur la responsabilité pour faute).

## La qualification juridique
La règle, parce qu’elle est générale, ne décrit pas chaque situation de la vie. Elle vise des **catégories juridiques** : la personne physique, le salarié, le consommateur, la victime, le contrat, le bien…

> **Qualifier**, c’est faire entrer des faits concrets dans une catégorie juridique pour savoir quelle règle leur appliquer.

La qualification est l’opération clé du juriste : se tromper de catégorie, c’est appliquer la mauvaise règle.

## La méthode du cas pratique
1. **Les faits** : résume objectivement ce qui s’est passé, sans jugement.
2. **La qualification** : nomme juridiquement les personnes et les faits (vendeur professionnel, consommateur, contrat de vente…).
3. **Le problème de droit** : pose la question juridique, en termes généraux.
4. **La règle** : cite la règle applicable (article, principe).
5. **L’application** : confronte la règle aux faits.
6. **La solution** : conclus clairement.

## Exemple travaillé
**Faits** : Léa, 17 ans, achète en ligne une console à 450 euros sur le site d’une enseigne. Elle la reçoit, change d’avis et veut la renvoyer au bout de dix jours.
**Qualification** : Léa est un **consommateur** (personne physique agissant hors activité professionnelle) ; l’enseigne est un **professionnel** ; il s’agit d’un **contrat de vente à distance**.
**Problème de droit** : un consommateur peut-il revenir sur un achat conclu à distance avec un professionnel ?
**Règle** : le Code de la consommation lui accorde un **délai de rétractation de 14 jours** à compter de la réception du bien, sans avoir à se justifier.
**Solution** : Léa est dans les délais ; elle peut renvoyer la console et être remboursée (sa minorité est une autre question, vue avec la capacité juridique).`,
          },
          questions: [
            ['Quels sont les trois caractères de la règle de droit ?', ['Écrite, publique, gratuite', 'Morale, religieuse, coutumière', 'Générale, obligatoire, légitime', 'Nationale, européenne, internationale'], 2, 'Générale (égalité), obligatoire (sanction), légitime (autorité compétente).'],
            ['Une règle générale s’applique…', ['À toutes les personnes placées dans la même situation juridique', 'À une personne désignée par son nom', 'Uniquement aux citoyens majeurs', 'Seulement en cas de litige'], 0, 'Elle vise une catégorie, ce qui garantit l’égalité devant la loi.'],
            ['Qu’est-ce que la qualification juridique ?', ['Le diplôme d’un avocat', 'La sanction prononcée par un juge', 'Le vote d’une loi', 'Le fait de classer des faits dans une catégorie juridique pour savoir quelle règle appliquer'], 3, 'C’est l’opération clé du raisonnement juridique.'],
            ['Le règlement intérieur d’une association sportive est une règle de droit étatique.', ['Vrai', 'Faux'], 1, 'Il n’émane pas d’une autorité publique et n’est pas sanctionné par l’État ; il n’oblige que les membres.'],
            ['Dans quel code trouve-t-on les règles sur les contrats et la propriété ?', ['Le Code pénal', 'Le Code civil', 'Le Code du travail', 'Le Code de la route'], 1, 'Le Code civil (1804) régit les personnes, les biens, les contrats et la responsabilité.'],
            ['Dans la méthode du cas pratique, que vient-il juste après la qualification des faits ?', ['La solution', 'La sanction', 'La plaidoirie', 'Le problème de droit'], 3, 'On pose la question juridique générale avant de chercher la règle.'],
            ['Une personne qui achète un vélo pour ses loisirs à un magasin se qualifie juridiquement comme…', ['Un consommateur', 'Un professionnel', 'Un commerçant', 'Un salarié'], 0, 'Le consommateur est une personne physique qui agit hors de son activité professionnelle.'],
            ['Le caractère obligatoire de la règle de droit signifie que…', ['Elle est écrite dans un code', 'Elle a été votée à l’unanimité', 'Sa violation est sanctionnée par l’autorité publique', 'Elle est acceptée par la morale'], 2, 'Sans sanction étatique possible, ce n’est pas une règle de droit.'],
            ['Quel est le délai de rétractation d’un consommateur pour un achat à distance ?', ['7 jours', '10 jours', '30 jours', '14 jours'], 3, '14 jours, sans justification, à compter de la réception du bien.'],
            ['Pourquoi le droit utilise-t-il des catégories juridiques ?', ['Pour compliquer le travail des juges', 'Pour éviter d’écrire des codes', 'Parce qu’il ne peut pas décrire chaque situation de la vie', 'Parce que la morale l’exige'], 2, 'La règle générale et abstraite vise des catégories, dans lesquelles on range les faits.'],
            ['La légitimité d’une règle de droit tient au fait qu’elle…', ['Plaît à la majorité', 'Émane d’une autorité compétente', 'Est ancienne', 'Est courte'], 1, 'Parlement, gouvernement, juge : chacun dans sa compétence.'],
            ['« Un vendeur a livré un produit défectueux » : quelle étape du cas pratique ce résumé constitue-t-il ?', ['L’exposé des faits', 'La solution', 'La règle', 'Le problème de droit'], 0, 'Les faits se résument objectivement, avant toute qualification.'],
          ],
        },
        {
          titre: 'Les sources du droit et la hiérarchie des normes',
          axe: 'Droit — Thème 1 : Qu’est-ce que le droit ?',
          lecon: {
            titre: 'D’où viennent les règles, et laquelle l’emporte',
            cours: `Les règles de droit ont des **sources** différentes : chacune émane d’une autorité légitime. Elles forment un ensemble **cohérent** grâce à leur hiérarchie.

## La séparation des pouvoirs
Montesquieu l’a théorisée : pour éviter l’abus de pouvoir, trois pouvoirs sont confiés à des organes distincts.
| Pouvoir | Qui l’exerce | Ce qu’il produit |
| **Législatif** | Le Parlement (Assemblée nationale et Sénat) | La **loi** |
| **Exécutif** | Le Président de la République et le Gouvernement | Les **règlements** (décrets, arrêtés) |
| **Judiciaire** | Les juges | La **jurisprudence** |

## Les sources nationales
1. **La Constitution** (1958) et son bloc de constitutionnalité (DDHC de 1789, préambule de 1946, Charte de l’environnement de 2004).
2. **La loi**, votée par le Parlement dans les domaines de l’article 34 (droits civiques, droit pénal, droit du travail…).
3. **Le règlement**, pris par le Gouvernement (décret) ou un ministre, un préfet, un maire (arrêté).
4. **Les conventions et accords collectifs**, négociés par les **partenaires sociaux** (syndicats de salariés et organisations d’employeurs) : ils adaptent le droit du travail à une branche ou à une entreprise.
5. **La jurisprudence** : l’ensemble des décisions des juges. Quand la loi est obscure ou muette, le juge l’interprète. La **Cour de cassation** unifie cette interprétation pour que la même règle ne soit pas appliquée différemment à Lille et à Marseille.

## Les sources européennes
| Acte | Portée | Exemple |
| **Traités** | Droit « originaire », signé par les États | Traité de Lisbonne |
| **Règlement** | S’applique **directement** et **tel quel** dans tous les États | RGPD (2016, applicable en 2018) |
| **Directive** | Fixe un **objectif** ; chaque État doit la **transposer** dans sa loi | Directive sur les droits des consommateurs |

Ces textes sont élaborés par la **Commission européenne** (qui propose), le **Parlement européen** et le **Conseil de l’Union européenne** (qui adoptent).

## La hiérarchie des normes
> Une norme inférieure doit toujours respecter la norme supérieure : Constitution, puis traités et droit de l’UE, puis loi, puis règlement.

Pour faire respecter cette pyramide, des contrôles existent. Le **Conseil constitutionnel** vérifie la conformité des lois à la Constitution avant leur promulgation et, depuis 2010, après, grâce à la **question prioritaire de constitutionnalité (QPC)** : lors d’un procès, un justiciable peut soutenir qu’une loi qu’on lui applique porte atteinte aux droits et libertés garantis par la Constitution. Si le Conseil lui donne raison, la loi est abrogée.

## Exemple travaillé
Un arrêté municipal interdit toute manifestation dans la ville pendant un an. Un syndicat le conteste.
**Problème** : un maire peut-il, par arrêté, restreindre de façon générale une liberté garantie par la Constitution ?
**Règle** : l’arrêté, norme inférieure, doit respecter la loi et la Constitution (liberté de manifester).
**Solution** : une interdiction générale et d’un an est disproportionnée ; le juge administratif peut l’annuler.`,
          },
          questions: [
            ['Quelle norme est au sommet de la hiérarchie des normes en droit interne ?', ['La loi', 'Le décret', 'La Constitution', 'La jurisprudence'], 2, 'La Constitution de 1958 et son bloc de constitutionnalité dominent l’ordre juridique interne.'],
            ['Qui vote la loi en France ?', ['Le Parlement', 'Le Président de la République', 'Le Gouvernement', 'Le Conseil constitutionnel'], 0, 'Le Parlement, composé de l’Assemblée nationale et du Sénat.'],
            ['Un règlement européen…', ['Doit être transposé par une loi nationale', 'N’a aucune force obligatoire', 'Ne concerne que les institutions européennes', 'S’applique directement dans tous les États membres'], 3, 'C’est la différence avec la directive, qui fixe un objectif à transposer.'],
            ['Une directive européenne doit être transposée dans le droit national.', ['Vrai', 'Faux'], 0, 'Chaque État choisit les moyens (sa loi) pour atteindre l’objectif fixé.'],
            ['Quel est le rôle de la Cour de cassation ?', ['Voter les lois', 'Unifier l’interprétation du droit par les juges', 'Contrôler les comptes publics', 'Juger les ministres'], 1, 'Elle veille à ce que la même règle soit interprétée de la même manière partout en France.'],
            ['La QPC permet à un justiciable…', ['De proposer une loi', 'De faire appel d’un jugement', 'De saisir la Cour européenne des droits de l’homme', 'De contester une loi déjà en vigueur qui porterait atteinte aux droits et libertés constitutionnels'], 3, 'Depuis 2010, le Conseil constitutionnel peut ainsi abroger une loi déjà appliquée.'],
            ['Qui négocie les conventions collectives ?', ['Les partenaires sociaux', 'Le Parlement', 'Le Conseil d’État', 'Les juges prud’homaux'], 0, 'Syndicats de salariés et organisations d’employeurs.'],
            ['Un décret est pris par…', ['Le Parlement', 'Un juge', 'Le Gouvernement (Premier ministre ou Président)', 'Les syndicats'], 2, 'C’est un acte réglementaire, inférieur à la loi.'],
            ['Qu’appelle-t-on jurisprudence ?', ['Un texte voté par le Sénat', 'Un traité international', 'Le règlement d’une entreprise', 'L’ensemble des décisions rendues par les juges'], 3, 'Elle interprète la loi et comble ses silences.'],
            ['Quelle institution européenne propose les textes ?', ['Le Parlement européen', 'La Cour de justice', 'La Commission européenne', 'La Banque centrale européenne'], 2, 'La Commission a l’initiative ; le Parlement et le Conseil adoptent.'],
            ['Un arrêté municipal contraire à une loi doit…', ['S’appliquer quand même, car il est plus récent', 'Être annulé, car il ne respecte pas une norme supérieure', 'Être soumis à référendum', 'Être validé par le préfet'], 1, 'La norme inférieure doit respecter la norme supérieure.'],
            ['Qui a théorisé la séparation des pouvoirs ?', ['Montesquieu', 'Rousseau', 'Voltaire', 'Napoléon'], 0, 'Dans « De l’esprit des lois » (1748).'],
          ],
        },
        // --------- DROIT — Thème 2 : Comment le droit permet-il de régler un litige ?
        {
          titre: 'Le litige et la preuve',
          axe: 'Droit — Thème 2 : Comment le droit permet-il de régler un litige ?',
          lecon: {
            titre: 'Du conflit au litige, et comment prouver',
            cours: `Un **conflit** devient un **litige** quand il est formulé en termes juridiques : une personne réclame quelque chose à une autre en invoquant une règle de droit.

## Les éléments du litige
| Élément | Définition |
| **Les parties** | Le **demandeur** (celui qui agit) et le **défendeur** (celui contre qui on agit) |
| **Les faits** | Ce qui s’est passé, qualifié juridiquement |
| **Les prétentions** | Ce que chaque partie demande (payer, livrer, réparer…) |
| **La question de droit** | Le point juridique que le juge doit trancher |

Avant le juge, les parties peuvent chercher un **accord amiable** : négociation, **conciliation**, **médiation**. Pour les petits litiges civils (jusqu’à 5 000 euros), une tentative de règlement amiable est d’ailleurs en principe obligatoire avant de saisir le juge.

## Acte juridique ou fait juridique ?
La nature de l’événement détermine la manière de le prouver.
| | **Acte juridique** | **Fait juridique** |
| Définition | Manifestation de volonté **destinée** à produire des effets de droit | Événement dont les effets de droit n’ont pas été **voulus** |
| Exemples | Contrat, testament, mariage | Accident, naissance, décès, dégradation |
| Preuve | Par **écrit** au-delà de 1 500 euros | Par **tout moyen** (témoins, photos, SMS…) |

## La charge de la preuve
> « Celui qui réclame l’exécution d’une obligation doit la prouver » (article 1353 du Code civil) : c’est en principe au **demandeur** de prouver ce qu’il avance.

Des **présomptions** peuvent renverser cette charge : on présume par exemple la bonne foi. Une présomption **simple** peut être combattue par la preuve contraire ; une présomption **irréfragable** ne le peut pas.

## Les modes de preuve
- **L’écrit** : l’**acte authentique**, rédigé par un officier public (notaire, huissier devenu commissaire de justice), fait foi jusqu’à inscription de faux ; l’**acte sous signature privée**, rédigé et signé par les parties elles-mêmes.
- **L’écrit électronique** a la même force que l’écrit papier, à condition d’identifier son auteur et de garantir son intégrité (**signature électronique**).
- **Le témoignage**, l’**aveu** (déclaration par laquelle une partie reconnaît un fait qui lui est défavorable), les présomptions de fait.

En matière **pénale**, la preuve est libre : le juge forme son **intime conviction** à partir de tous les éléments, à condition qu’ils aient été obtenus loyalement.

## Exemple travaillé
Hugo a prêté 2 000 euros à son cousin, sans écrit. Le cousin refuse de rembourser.
**Qualification** : le prêt est un **acte juridique** (contrat) ; Hugo est le demandeur.
**Règle** : au-delà de 1 500 euros, l’acte juridique se prouve par écrit ; la charge de la preuve pèse sur Hugo.
**Solution** : sans écrit, Hugo est en difficulté. Il peut toutefois invoquer un **commencement de preuve par écrit** (un SMS du cousin : « je te rends les 2 000 dès que possible ») complété par d’autres éléments, ou obtenir un aveu.`,
          },
          questions: [
            ['Dans un procès civil, comment s’appelle celui qui engage l’action ?', ['Le défendeur', 'Le prévenu', 'Le demandeur', 'Le témoin'], 2, 'Le défendeur est celui contre qui l’action est dirigée.'],
            ['Un contrat de vente est…', ['Un acte juridique', 'Un fait juridique', 'Une présomption', 'Une prétention'], 0, 'Il résulte d’une volonté de produire des effets de droit.'],
            ['Un accident de la circulation est un fait juridique.', ['Vrai', 'Faux'], 0, 'Ses effets de droit (obligation de réparer) n’ont pas été voulus.'],
            ['Comment se prouve un fait juridique ?', ['Uniquement par acte notarié', 'Par tout moyen', 'Uniquement par l’aveu', 'Il ne se prouve pas'], 1, 'Témoignages, photos, messages, constats… La preuve est libre.'],
            ['À partir de quel montant un acte juridique doit-il en principe être prouvé par écrit ?', ['500 euros', '1 500 euros', '1 000 euros', '5 000 euros'], 1, 'Au-delà de 1 500 euros, un écrit est exigé.'],
            ['Sur qui pèse en principe la charge de la preuve ?', ['Sur le juge', 'Sur le défendeur', 'Sur l’avocat', 'Sur celui qui réclame l’exécution d’une obligation'], 3, 'Article 1353 du Code civil.'],
            ['Un acte authentique est rédigé…', ['Par un officier public, comme un notaire', 'Par les parties seules', 'Par un témoin', 'Par le juge après le procès'], 0, 'Il a une force probante renforcée.'],
            ['L’écrit électronique a la même valeur que l’écrit papier si…', ['Il est imprimé', 'Il est envoyé par courriel', 'Son auteur est identifié et son intégrité garantie', 'Il est rédigé en majuscules'], 2, 'D’où la signature électronique.'],
            ['Une présomption irréfragable…', ['Peut être renversée par la preuve contraire', 'N’existe qu’en droit pénal', 'Est un témoignage', 'Ne peut pas être renversée'], 3, 'À l’inverse, une présomption simple admet la preuve contraire.'],
            ['Qu’est-ce que l’aveu ?', ['Le jugement rendu par le tribunal', 'La plainte de la victime', 'La déclaration par laquelle une partie reconnaît un fait qui lui est défavorable', 'Le témoignage d’un tiers'], 2, 'L’aveu judiciaire fait pleine foi contre son auteur.'],
            ['En matière pénale, le juge se décide selon…', ['L’écrit exclusivement', 'Son intime conviction', 'Le montant du préjudice', 'L’avis des témoins uniquement'], 1, 'La preuve y est libre, mais doit avoir été obtenue loyalement.'],
            ['Un conflit devient un litige lorsque…', ['Il est formulé en termes juridiques par des prétentions', 'Il dure plus d’un an', 'Les parties s’insultent', 'La police intervient'], 0, 'Une partie invoque une règle de droit à l’appui de sa demande.'],
          ],
        },
        {
          titre: 'Le recours au juge',
          axe: 'Droit — Thème 2 : Comment le droit permet-il de régler un litige ?',
          lecon: {
            titre: 'Juridictions, procès et voies de recours',
            cours: `Quand l’accord amiable échoue, on s’adresse au **juge**. La justice est un **service public** qui obéit à des principes protecteurs des libertés.

## Les principes fondamentaux
1. **Le droit à un procès équitable** : juge indépendant et impartial, débat contradictoire, délai raisonnable (article 6 de la Convention européenne des droits de l’homme).
2. **Les droits de la défense** : chacun peut connaître ce qu’on lui reproche, se défendre, être assisté d’un avocat.
3. **La présomption d’innocence** : toute personne poursuivie est présumée innocente tant que sa culpabilité n’a pas été établie.
4. **Le double degré de juridiction** : l’affaire peut être rejugée en fait et en droit par une cour d’appel.

## L’organisation judiciaire
Il existe deux ordres de juridictions : l’ordre **administratif** (litiges avec l’administration : tribunal administratif, cour administrative d’appel, Conseil d’État) et l’ordre **judiciaire**, qui juge les litiges entre particuliers et les infractions.
| Ordre judiciaire | Juridiction civile | Juridiction pénale |
| Premier degré | **Tribunal judiciaire** (depuis 2020), **tribunal de commerce**, **conseil de prud’hommes** | **Tribunal de police** (contraventions), **tribunal correctionnel** (délits), **cour d’assises** ou cour criminelle (crimes) |
| Second degré | **Cour d’appel** | Cour d’appel (chambre des appels correctionnels), cour d’assises d’appel |
| Sommet | **Cour de cassation** | Cour de cassation |

La **compétence d’attribution** désigne la juridiction qui doit juger selon la nature de l’affaire : un litige entre un salarié et son employeur va devant le **conseil de prud’hommes**, un litige entre commerçants devant le **tribunal de commerce**.

## Le procès civil
1. **Introduction de l’instance** : le demandeur saisit le tribunal, souvent par **assignation** délivrée au défendeur par un commissaire de justice.
2. **Mise en état** : les parties échangent leurs arguments et leurs pièces.
3. **Audience** : débats, plaidoiries ; puis **clôture des débats** et **délibéré**.
4. **Jugement** (première instance) ou **arrêt** (cour d’appel, Cour de cassation).

## Le procès pénal
Les **infractions** se classent selon leur gravité : **contravention**, **délit**, **crime**. Tout commence par une **plainte** ou une constatation par la police. Pour les affaires graves, un juge d’instruction enquête et peut prononcer une **mise en examen**. La victime peut se **constituer partie civile** pour obtenir réparation de son préjudice. La **peine** punit, protège la société et vise la réinsertion.

## Les voies de recours
- **L’appel** : l’affaire est rejugée en fait et en droit par la cour d’appel.
- **Le pourvoi en cassation** : la Cour de cassation ne rejuge pas les faits ; elle vérifie que le droit a été correctement appliqué. Elle **casse** la décision ou **rejette** le pourvoi.
- **Les juridictions européennes** : une fois les recours internes épuisés, on peut saisir la **Cour européenne des droits de l’homme** (Strasbourg) ; la **Cour de justice de l’Union européenne** (Luxembourg) interprète le droit de l’UE.

> La Cour de cassation est juge du **droit**, pas des **faits** : elle ne dira jamais qui a raison, seulement si la loi a été bien appliquée.

## Exemple travaillé
Nadia, vendeuse, conteste son licenciement. Elle perd devant les prud’hommes.
**Question** : quel recours ? Elle peut faire **appel** devant la cour d’appel, qui rejugera toute l’affaire. Si l’arrêt lui est défavorable et qu’elle estime la loi mal appliquée, elle pourra former un **pourvoi en cassation**.`,
          },
          questions: [
            ['Quelle juridiction juge un litige entre un salarié et son employeur ?', ['Le tribunal de commerce', 'Le tribunal correctionnel', 'Le conseil de prud’hommes', 'Le tribunal administratif'], 2, 'C’est une question de compétence d’attribution.'],
            ['Quelle juridiction juge les délits ?', ['Le tribunal correctionnel', 'Le tribunal de police', 'La cour d’assises', 'Le conseil de prud’hommes'], 0, 'Le tribunal de police juge les contraventions, la cour d’assises les crimes.'],
            ['La Cour de cassation rejuge les faits de l’affaire.', ['Vrai', 'Faux'], 1, 'Elle est juge du droit : elle vérifie seulement la bonne application des règles.'],
            ['Qu’est-ce que le double degré de juridiction ?', ['Le fait d’avoir deux juges par audience', 'Le droit de faire rejuger son affaire en fait et en droit par une cour d’appel', 'Le droit d’avoir deux avocats', 'La possibilité de saisir deux tribunaux en même temps'], 1, 'L’appel en est la mise en œuvre.'],
            ['Comment appelle-t-on la décision d’une cour d’appel ?', ['Un jugement', 'Un arrêt', 'Une ordonnance pénale', 'Un décret'], 1, 'On parle de jugement pour les tribunaux de premier degré.'],
            ['Quelle juridiction civile de droit commun a été créée en 2020 ?', ['Le tribunal d’instance', 'Le tribunal de grande instance', 'La cour d’assises', 'Le tribunal judiciaire'], 3, 'Elle a fusionné le tribunal d’instance et le tribunal de grande instance.'],
            ['Que permet la constitution de partie civile ?', ['À la victime d’obtenir réparation dans le cadre du procès pénal', 'À l’accusé de choisir son juge', 'Au procureur de classer l’affaire', 'À un témoin d’être payé'], 0, 'La victime demande des dommages et intérêts devant le juge pénal.'],
            ['Classe les infractions de la moins grave à la plus grave.', ['Délit, contravention, crime', 'Crime, délit, contravention', 'Contravention, délit, crime', 'Contravention, crime, délit'], 2, 'Chacune relève d’une juridiction différente.'],
            ['L’assignation est…', ['La décision finale du juge', 'La peine prononcée', 'Le recours devant la Cour de cassation', 'L’acte par lequel le demandeur informe le défendeur qu’il l’attaque en justice'], 3, 'Elle est délivrée par un commissaire de justice et introduit l’instance.'],
            ['La présomption d’innocence signifie que…', ['Les mineurs ne peuvent jamais être condamnés', 'Le juge doit croire l’accusé', 'Toute personne poursuivie est considérée comme innocente tant que sa culpabilité n’est pas établie', 'Le procès est public'], 2, 'C’est à l’accusation de prouver la culpabilité.'],
            ['Où siège la Cour européenne des droits de l’homme ?', ['Bruxelles', 'Strasbourg', 'Luxembourg', 'La Haye'], 1, 'On la saisit après avoir épuisé les recours internes.'],
            ['Un litige entre un particulier et sa commune relève en principe…', ['Du tribunal administratif', 'Du tribunal judiciaire', 'Du conseil de prud’hommes', 'Du tribunal de commerce'], 0, 'Les litiges avec l’administration relèvent de l’ordre administratif.'],
          ],
        },
        // ------------- DROIT — Thème 3 : Qui peut faire valoir ses droits ? -----
        {
          titre: 'La personne juridique',
          axe: 'Droit — Thème 3 : Qui peut faire valoir ses droits ?',
          lecon: {
            titre: 'Personnes physiques, personnes morales',
            cours: `Seules les **personnes juridiques** peuvent faire valoir leurs droits : elles sont des **sujets de droit**, titulaires de droits et tenues d’obligations. On parle de **personnalité juridique**.

## Deux sortes de personnes
| | **Personne physique** | **Personne morale** |
| Qui ? | Tout être humain | Un groupement (société, association, commune, État…) |
| Début | La **naissance**, si l’enfant naît vivant et viable | L’immatriculation (société) ou la déclaration (association) |
| Fin | Le **décès** | La dissolution, la liquidation |
| Identification | Nom, prénom, domicile, état civil | **Dénomination** sociale, **siège** social, numéro SIREN |

L’enfant simplement conçu peut acquérir des droits dès lors que c’est dans son intérêt et qu’il naît vivant et viable (il peut hériter de son père décédé avant sa naissance).

## L’identification de la personne physique
- **Le nom** : il se transmet par la filiation ; depuis 2022, toute personne majeure peut, une fois dans sa vie, choisir de porter le nom de l’autre parent ou les deux par simple déclaration en mairie.
- **Le domicile** : le lieu du principal établissement ; il détermine le tribunal compétent et le lieu où l’on reçoit les actes.
- **L’état civil** : date et lieu de naissance, **sexe** (on parle aussi de **genre**), filiation, situation matrimoniale. La mention du sexe peut être modifiée par décision du juge.

## L’identification de la personne morale
Une personne morale a un **nom** (sa dénomination), un **domicile** (son siège social), une **nationalité**, un **patrimoine** propre, distinct de celui de ses membres. Elle agit par ses **représentants** (gérant, président).

## Droits patrimoniaux et extrapatrimoniaux
| Droits **patrimoniaux** | Droits **extrapatrimoniaux** |
| Évaluables en argent | Non évaluables en argent |
| Cessibles, saisissables, transmissibles | Hors commerce, insaisissables, intransmissibles |
| Propriété, créance | Droit à la vie privée, à l’image, au nom |

## Le statut de l’animal
Depuis 2015, l’**article 515-14 du Code civil** reconnaît l’animal comme un **être vivant doué de sensibilité**. Mais il reste soumis au régime des **biens** : il n’est **pas une personne** juridique. On peut le vendre ; on ne peut pas le maltraiter.

> L’animal est protégé, mais il ne peut pas agir en justice : il n’a pas la personnalité juridique.

## Exemple travaillé
L’association « Les Amis du parc » veut attaquer en justice un promoteur qui abîme un espace vert.
**Question** : peut-elle agir ? Oui, si elle a été **déclarée en préfecture** : elle acquiert alors la personnalité morale et peut **ester en justice**, par l’intermédiaire de son président. Une association non déclarée, elle, n’a pas de personnalité juridique.`,
          },
          questions: [
            ['Quand commence la personnalité juridique d’une personne physique ?', ['À la conception, dans tous les cas', 'À la majorité', 'À la naissance, si l’enfant naît vivant et viable', 'À la déclaration en mairie'], 2, 'L’enfant conçu peut toutefois recueillir des droits s’il naît vivant et viable.'],
            ['Laquelle de ces entités est une personne morale ?', ['Une société anonyme immatriculée', 'Un chien', 'Un groupe d’amis', 'Une famille'], 0, 'La société immatriculée au registre a la personnalité morale.'],
            ['Depuis 2015, l’animal est une personne juridique.', ['Vrai', 'Faux'], 1, 'C’est un être vivant doué de sensibilité, soumis au régime des biens (art. 515-14 C. civ.).'],
            ['Quel est l’équivalent du domicile pour une personne morale ?', ['La dénomination', 'Le siège social', 'Le capital', 'L’objet social'], 1, 'Le siège social détermine notamment le tribunal compétent.'],
            ['Quand une association acquiert-elle la personnalité morale ?', ['Dès que deux personnes se réunissent', 'Après sa déclaration en préfecture', 'Après dix ans d’existence', 'Jamais'], 1, 'Elle peut alors agir en justice, recevoir des cotisations, signer des contrats.'],
            ['Le droit à l’image est un droit…', ['Patrimonial', 'Réel', 'De créance', 'Extrapatrimonial'], 3, 'Attaché à la personne, il n’est pas évaluable en argent en lui-même.'],
            ['Un droit patrimonial est…', ['Évaluable en argent et transmissible', 'Attaché à la personne et intransmissible', 'Réservé aux personnes morales', 'Toujours gratuit'], 0, 'La propriété ou une créance sont des droits patrimoniaux.'],
            ['Comment s’appelle le « nom » d’une société ?', ['Sa raison d’être', 'Son sigle obligatoire', 'Sa dénomination sociale', 'Son capital'], 2, 'La dénomination identifie la personne morale.'],
            ['Quand prend fin la personnalité juridique d’une personne physique ?', ['À la retraite', 'À la mise sous tutelle', 'À la faillite', 'Au décès'], 3, 'La tutelle limite l’exercice des droits mais ne supprime pas la personnalité.'],
            ['Qui agit au nom d’une personne morale ?', ['Tous ses membres ensemble', 'Le préfet', 'Ses représentants légaux (gérant, président)', 'Le juge'], 2, 'La personne morale agit par l’intermédiaire de ses organes.'],
            ['Que permet la personnalité juridique ?', ['De voter aux élections uniquement', 'D’être titulaire de droits et d’obligations et d’agir en justice', 'De payer moins d’impôts', 'De ne pas avoir de dettes'], 1, 'C’est l’aptitude à être sujet de droit.'],
            ['Depuis 2022, une personne majeure peut, une fois dans sa vie…', ['Choisir de porter le nom de l’autre parent par déclaration en mairie', 'Changer de date de naissance', 'Renoncer à sa nationalité sans formalité', 'Supprimer son état civil'], 0, 'La loi de 2022 a simplifié ce changement de nom d’usage et de nom de famille.'],
          ],
        },
        {
          titre: 'Capacité, représentation et patrimoine',
          axe: 'Droit — Thème 3 : Qui peut faire valoir ses droits ?',
          lecon: {
            titre: 'Qui peut agir seul, et sur quels biens',
            cours: `Avoir des droits est une chose ; pouvoir les **exercer soi-même** en est une autre. C’est la question de la **capacité juridique**.

## Jouissance et exercice
| | **Capacité de jouissance** | **Capacité d’exercice** |
| Définition | L’aptitude à **être titulaire** de droits | L’aptitude à **exercer seul** ses droits |
| Qui l’a ? | Toute personne, dès la naissance | En principe tout **majeur** non protégé |

Le principe est la **capacité** ; l’incapacité est l’exception et vise à **protéger** la personne, jamais à la punir.

## Les incapacités d’exercice
- **Le mineur non émancipé** : ses actes sont passés par ses **représentants légaux** (en principe ses parents, titulaires de l’autorité parentale). Il peut toutefois accomplir seul les **actes de la vie courante** (acheter un livre, un repas). Il peut être **émancipé** dès 16 ans par le juge.
- **Le majeur protégé**, dont les facultés sont altérées (maladie, âge) :
| Mesure | Degré de protection | Qui agit ? |
| **Sauvegarde de justice** | Légère, temporaire | La personne, mais ses actes peuvent être annulés ou réduits s’ils lui nuisent |
| **Curatelle** | Moyenne | La personne, **assistée** par un curateur pour les actes importants |
| **Tutelle** | Forte | Le **tuteur** représente la personne |

## Les mécanismes de représentation
**Représenter**, c’est agir au nom et pour le compte d’autrui : les effets de l’acte se produisent directement sur la personne représentée. La représentation peut être **légale** (parents, tuteur), **judiciaire** (désignée par un juge) ou **conventionnelle** (un **mandat**, une procuration).

## Acte d’administration, acte de disposition
| **Acte d’administration** | **Acte de disposition** |
| Gestion courante, qui ne met pas en danger le patrimoine | Engage **durablement** le patrimoine, en modifie la composition |
| Louer un appartement, encaisser des loyers, faire des réparations | Vendre une maison, faire une donation, emprunter une grosse somme |

Plus l’acte est grave, plus la protection est forte : un tuteur ne peut pas vendre le logement de la personne protégée sans l’autorisation du juge.

## Le patrimoine
> Le **patrimoine** est l’ensemble des **droits** et des **obligations** d’une personne **évaluables en argent** : un **actif** (biens, créances) et un **passif** (dettes).

Chaque personne a un patrimoine, et un seul en principe (même s’il est vide ou négatif) ; il est lié à la personne. L’actif répond du passif : les créanciers peuvent saisir les biens de leur débiteur. Les droits extrapatrimoniaux n’en font pas partie.

## Exemple travaillé
Tom, 15 ans, vend seul sur internet le scooter que lui ont offert ses parents, pour 1 200 euros.
**Qualification** : Tom est un **mineur non émancipé** ; la vente d’un bien de valeur est un **acte de disposition**, pas un acte de la vie courante.
**Règle** : le mineur est frappé d’une incapacité d’exercice ; ses représentants légaux doivent agir.
**Solution** : ses parents peuvent demander la **nullité** de la vente, qui protège Tom.`,
          },
          questions: [
            ['La capacité de jouissance est…', ['L’aptitude à exercer seul ses droits', 'Le droit de vote', 'L’aptitude à être titulaire de droits', 'Le droit de propriété'], 2, 'Toute personne l’a ; c’est l’exercice qui peut être limité.'],
            ['Un mineur non émancipé peut accomplir seul…', ['Les actes de la vie courante', 'La vente d’un appartement', 'Un emprunt immobilier', 'Une donation importante'], 0, 'Acheter un repas ou un livre est un acte de la vie courante.'],
            ['Dans la tutelle, la personne protégée est…', ['Assistée par un curateur', 'Libre d’agir seule', 'Privée de sa personnalité juridique', 'Représentée par un tuteur'], 3, 'La tutelle est la mesure la plus protectrice.'],
            ['La curatelle est plus protectrice que la tutelle.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : en curatelle, la personne agit mais doit être assistée pour les actes importants.'],
            ['Vendre une maison est un acte…', ['D’administration', 'De disposition', 'De la vie courante', 'Extrapatrimonial'], 1, 'Il modifie durablement la composition du patrimoine.'],
            ['Encaisser des loyers est un acte…', ['De disposition', 'Interdit au propriétaire', 'Pénal', 'D’administration'], 3, 'C’est une gestion courante qui ne met pas le patrimoine en danger.'],
            ['Qu’est-ce que le patrimoine ?', ['L’ensemble des droits et obligations d’une personne évaluables en argent', 'L’ensemble des biens immobiliers d’une personne', 'Le salaire annuel', 'L’ensemble des droits de la personnalité'], 0, 'Il comprend un actif et un passif.'],
            ['À partir de quel âge un mineur peut-il être émancipé ?', ['14 ans', '15 ans', '16 ans', '17 ans'], 2, 'Il acquiert alors la capacité d’un majeur pour la plupart des actes.'],
            ['Un mandat est une représentation…', ['Légale', 'Judiciaire', 'Pénale', 'Conventionnelle'], 3, 'Elle naît d’un contrat entre le mandant et le mandataire.'],
            ['Pourquoi le droit prévoit-il des incapacités ?', ['Pour punir les personnes', 'Pour réduire les impôts', 'Pour protéger les personnes vulnérables', 'Pour éviter les procès'], 2, 'L’incapacité est une mesure de protection, jamais une sanction.'],
            ['Le droit à la vie privée fait partie du patrimoine.', ['Vrai', 'Faux'], 1, 'C’est un droit extrapatrimonial, non évaluable en argent.'],
            ['Les créanciers d’une personne peuvent en principe…', ['Saisir ses biens pour se faire payer', 'Saisir ses droits extrapatrimoniaux', 'Changer son nom', 'Prendre sa place en justice sans jugement'], 0, 'L’actif du patrimoine répond du passif.'],
          ],
        },
        // ------ DROIT — Thème 4 : Quels sont les droits reconnus aux personnes ?
        {
          titre: 'Les droits extrapatrimoniaux',
          axe: 'Droit — Thème 4 : Quels sont les droits reconnus aux personnes ?',
          lecon: {
            titre: 'Vie privée, image et données personnelles',
            cours: `Par le seul fait d’exister, toute personne dispose de **droits de la personnalité** qui protègent son intégrité morale : ce sont des droits **extrapatrimoniaux**.

## Leurs caractères
| Caractère | Ce qu’il signifie |
| **Inaliénables** | On ne peut pas les vendre ni y renoncer définitivement |
| **Insaisissables** | Aucun créancier ne peut les saisir |
| **Imprescriptibles** | On ne les perd pas en ne les utilisant pas |
| **Intransmissibles** | Ils s’éteignent en principe au décès |

Leur **atteinte**, elle, se répare en argent : on obtient des **dommages et intérêts**.

## Le droit au respect de la vie privée
> « Chacun a droit au respect de sa vie privée » (article 9 du Code civil).

La vie privée couvre la santé, la vie sentimentale, la famille, le domicile, les correspondances, la religion… Même une personnalité publique y a droit pour ce qui ne relève pas de son activité publique. Le juge peut ordonner toute mesure pour faire cesser l’atteinte (saisie d’un magazine, retrait d’une publication).

## Le droit à l’image
Toute personne peut s’opposer à la **captation** et à la **diffusion** de son image sans son **consentement**. Des limites existent : l’image d’une personne publique dans l’exercice de ses fonctions, l’illustration d’un événement d’actualité, une foule où personne n’est isolé. Pour un mineur, l’autorisation des parents est nécessaire.

## L’identité numérique et les données personnelles
Chacun laisse sur internet des traces **formelles** (profil, publications) et **informelles** (historique, géolocalisation) : elles forment son **identité numérique**.
Les **données à caractère personnel** sont toutes les informations qui permettent d’identifier une personne, directement ou non : nom, photo, adresse IP, numéro de téléphone.
Le **RGPD** (règlement européen, applicable depuis 2018) impose à ceux qui les traitent :
1. une **base légale** (souvent le **consentement** libre, éclairé et explicite) ;
2. la **minimisation** : ne collecter que le nécessaire, pour une finalité précise ;
3. la **sécurité** des données et la durée de conservation limitée.
Il donne à chacun des droits : **accès**, **rectification**, **effacement** (droit à l’oubli), **opposition**, **portabilité**. En France, un mineur peut consentir seul au traitement de ses données par un réseau social à partir de **15 ans**. La **CNIL** contrôle et sanctionne (jusqu’à 4 % du chiffre d’affaires mondial).

## Exemple travaillé
**Faits** : Inès, 16 ans, découvre qu’un camarade a publié sur un réseau social une photo d’elle prise à une fête, avec un commentaire moqueur.
**Qualification** : atteinte au **droit à l’image** et à la **vie privée** (une soirée privée) d’une **mineure**.
**Problème** : peut-on diffuser l’image d’une personne sans son consentement ?
**Règle** : article 9 du Code civil ; consentement nécessaire, celui des parents pour une mineure.
**Solution** : Inès (par ses parents) peut exiger le retrait de la photo, demander le déréférencement à la plateforme et obtenir des dommages et intérêts.`,
          },
          questions: [
            ['Quel article du Code civil protège la vie privée ?', ['Article 1240', 'Article 544', 'Article 9', 'Article 1103'], 2, '« Chacun a droit au respect de sa vie privée. »'],
            ['Les droits de la personnalité sont…', ['Inaliénables, insaisissables et imprescriptibles', 'Cessibles et saisissables', 'Réservés aux personnes publiques', 'Transmissibles par héritage'], 0, 'Ils sont attachés à la personne elle-même.'],
            ['Une adresse IP peut être une donnée à caractère personnel.', ['Vrai', 'Faux'], 0, 'Elle permet d’identifier indirectement une personne.'],
            ['Quel texte encadre le traitement des données personnelles dans l’Union européenne ?', ['La loi Macron', 'Le RGPD', 'Le Code pénal', 'Le traité de Maastricht'], 1, 'Le règlement général sur la protection des données, applicable depuis 2018.'],
            ['Quelle autorité française contrôle le respect du RGPD ?', ['L’Arcom', 'La CNIL', 'L’Autorité de la concurrence', 'La DGCCRF'], 1, 'La Commission nationale de l’informatique et des libertés peut sanctionner.'],
            ['À partir de quel âge un mineur peut-il consentir seul au traitement de ses données par un réseau social en France ?', ['13 ans', '16 ans', '18 ans', '15 ans'], 3, 'En dessous, l’accord des parents est nécessaire.'],
            ['Le droit à l’image permet de s’opposer…', ['À la captation et à la diffusion de son image sans consentement', 'À toute photographie de foule', 'À la publication d’une œuvre d’art', 'À la vidéosurveillance publique dans tous les cas'], 0, 'Des exceptions existent : actualité, foule, fonctions publiques.'],
            ['Le principe de minimisation du RGPD impose de…', ['Collecter le plus de données possible', 'Supprimer toutes les données au bout d’un mois', 'Ne collecter que les données nécessaires à une finalité précise', 'Vendre les données à bas prix'], 2, 'La finalité doit être déterminée à l’avance.'],
            ['Comment se répare une atteinte à un droit extrapatrimonial ?', ['Elle ne peut pas être réparée', 'Par une peine de prison obligatoire', 'Par un changement de nom', 'Par des dommages et intérêts et des mesures pour faire cesser l’atteinte'], 3, 'Le droit n’est pas évaluable en argent, mais son atteinte l’est.'],
            ['Le droit à l’effacement est aussi appelé…', ['Droit de rétractation', 'Droit de réponse', 'Droit à l’oubli', 'Droit de retrait'], 2, 'Il permet de demander la suppression de ses données.'],
            ['L’historique de navigation et la géolocalisation font partie de l’identité numérique…', ['Formelle', 'Informelle', 'Juridique', 'Patrimoniale'], 1, 'Ce sont des traces laissées sans les publier volontairement.'],
            ['Une personnalité publique a droit au respect de sa vie privée pour ce qui ne relève pas de son activité publique.', ['Vrai', 'Faux'], 0, 'Sa notoriété ne supprime pas sa vie privée.'],
          ],
        },
        {
          titre: 'Le droit de propriété',
          axe: 'Droit — Thème 4 : Quels sont les droits reconnus aux personnes ?',
          lecon: {
            titre: 'Posséder une chose, posséder une idée',
            cours: `Parmi les droits patrimoniaux, le **droit de propriété** est le plus complet : il donne un pouvoir direct sur une chose. L’article 544 du Code civil le définit comme « le droit de jouir et disposer des choses de la manière la plus absolue, pourvu qu’on n’en fasse pas un usage prohibé par les lois ».

## Biens corporels et biens incorporels
| **Biens corporels** | **Biens incorporels** |
| Ont une existence matérielle, se touchent | N’ont pas d’existence matérielle |
| Meubles (voiture, téléphone) ou immeubles (terrain, maison) | Marque, brevet, droit d’auteur, fonds de commerce, créance |

## Les attributs du droit de propriété
| Attribut | Le droit de… | Exemple |
| **Usus** | **Utiliser** la chose | Habiter sa maison |
| **Fructus** | **Percevoir les fruits** | Encaisser les loyers |
| **Abusus** | **Disposer** de la chose | La vendre, la donner, la détruire |

## Ses caractères
1. **Absolu** : le propriétaire a tous les pouvoirs sur la chose, dans le respect des lois.
2. **Exclusif** : lui seul exerce ces pouvoirs ; il peut interdire l’accès à son terrain.
3. **Perpétuel** : il dure aussi longtemps que la chose et ne se perd pas par le non-usage.

## Les limites : le trouble anormal du voisinage
Le propriétaire ne peut pas causer à ses voisins un trouble qui **excède les inconvénients normaux du voisinage** (bruit répété, odeurs, perte d’ensoleillement importante). Le voisin obtient réparation **sans avoir à prouver une faute** : il suffit que le trouble soit anormal. Ce principe jurisprudentiel est inscrit dans le Code civil depuis 2024. D’autres limites existent : l’**expropriation** pour cause d’utilité publique (contre une juste et préalable indemnité), les règles d’urbanisme.

## La propriété intellectuelle
> La propriété intellectuelle protège les créations de l’esprit en donnant à leur auteur un **monopole d’exploitation** temporaire.

- **Le droit d’auteur** protège une œuvre **originale** (texte, musique, photo, logiciel) **dès sa création**, sans formalité. Il comprend un **droit moral** (paternité, respect de l’œuvre), perpétuel et inaliénable, et des **droits patrimoniaux** (reproduction, représentation), qui durent toute la vie de l’auteur et **70 ans** après sa mort.
- **La propriété industrielle** : la **marque** (signe qui distingue les produits d’une entreprise) doit être **déposée** à l’INPI ; elle est protégée **10 ans**, renouvelables indéfiniment. Le **brevet** protège une invention pendant 20 ans.
- Toute atteinte à ces droits est une **contrefaçon**, sanctionnée civilement (dommages et intérêts) et pénalement, par l’**action en contrefaçon**.

## Exemple travaillé
Une boulangerie ouverte en 2023 lance à 4 heures du matin, chaque nuit, un extracteur très bruyant sous les fenêtres d’un voisin.
**Qualification** : le boulanger exerce son droit de propriété et son activité ; le voisin subit une nuisance.
**Règle** : nul ne doit causer à autrui un **trouble anormal de voisinage**.
**Solution** : si le bruit dépasse ce qu’on peut normalement supporter, le voisin peut obtenir réparation et l’installation d’un dispositif antibruit, même sans faute du boulanger.`,
          },
          questions: [
            ['Quel attribut du droit de propriété permet de vendre son bien ?', ['L’usus', 'Le fructus', 'L’abusus', 'Le monopole'], 2, 'L’abusus est le droit de disposer : vendre, donner, détruire.'],
            ['Percevoir les loyers d’un appartement correspond à…', ['Le fructus', 'L’usus', 'L’abusus', 'L’exclusivité'], 0, 'Les loyers sont les fruits civils du bien.'],
            ['Une marque est un bien…', ['Corporel meuble', 'Corporel immeuble', 'Extrapatrimonial', 'Incorporel'], 3, 'Elle n’a pas d’existence matérielle.'],
            ['Le droit de propriété se perd si l’on n’utilise pas son bien pendant dix ans.', ['Vrai', 'Faux'], 1, 'Il est perpétuel : il ne s’éteint pas par le non-usage.'],
            ['Pour obtenir réparation d’un trouble anormal de voisinage, la victime doit…', ['Prouver une faute du voisin', 'Prouver que le trouble excède les inconvénients normaux du voisinage', 'Avoir porté plainte au pénal', 'Être propriétaire depuis vingt ans'], 1, 'C’est une responsabilité sans faute.'],
            ['Quand une œuvre est-elle protégée par le droit d’auteur ?', ['Après dépôt à l’INPI', 'Après publication officielle', 'Après dix ans', 'Dès sa création, sans formalité'], 3, 'Il suffit qu’elle soit originale.'],
            ['Combien de temps durent les droits patrimoniaux d’auteur après la mort de l’auteur ?', ['70 ans', '20 ans', '50 ans', 'Ils sont perpétuels'], 0, 'Le droit moral, lui, est perpétuel.'],
            ['Une marque déposée est protégée…', ['5 ans non renouvelables', '20 ans', '10 ans renouvelables indéfiniment', 'À vie'], 2, 'Le dépôt se fait auprès de l’INPI.'],
            ['Comment s’appelle l’atteinte à un droit de propriété intellectuelle ?', ['La concurrence déloyale', 'Le plagiat légal', 'L’expropriation', 'La contrefaçon'], 3, 'Elle se sanctionne par l’action en contrefaçon.'],
            ['Le caractère exclusif du droit de propriété signifie que…', ['Le bien est unique au monde', 'Le bien ne peut pas être vendu', 'Le propriétaire peut interdire aux autres d’utiliser sa chose', 'Seul l’État peut être propriétaire'], 2, 'Lui seul exerce les pouvoirs sur la chose.'],
            ['Quel droit du créateur est perpétuel et inaliénable ?', ['Le droit de reproduction', 'Le droit moral', 'Le droit de représentation', 'Le droit de suite'], 1, 'Paternité et respect de l’œuvre ne se vendent pas.'],
            ['L’expropriation pour cause d’utilité publique suppose…', ['Une juste et préalable indemnité', 'L’accord écrit du propriétaire', 'Une condamnation pénale', 'Une décision du maire seul'], 0, 'C’est une limite au droit de propriété, strictement encadrée.'],
          ],
        },
        // ---- ÉCONOMIE — Thème 1 : grandes questions économiques ----------------
        {
          titre: 'Les agents économiques et leurs choix',
          axe: 'Économie — Thème 1 : Quelles sont les grandes questions économiques et leurs enjeux actuels ?',
          lecon: {
            titre: 'Choisir quand les ressources sont rares',
            cours: `L’**économie** étudie comment les individus et les sociétés utilisent des **ressources rares** pour satisfaire des **besoins** qui, eux, semblent illimités. Toute décision est donc un **choix**.

## Les agents économiques
| Agent | Fonction principale | Ressources principales |
| **Ménages** | **Consommer** | Revenus du travail, du capital, prestations sociales |
| **Sociétés non financières** (entreprises) | **Produire** des biens et services marchands | Ventes |
| **Sociétés financières** (banques, assurances) | **Financer** l’économie, assurer | Intérêts, primes |
| **Administrations publiques** | Produire des services **non marchands**, **redistribuer** | Prélèvements obligatoires |
| **Institutions sans but lucratif** (associations) | Services non marchands aux ménages | Cotisations, dons, subventions |
| **Reste du monde** | Échanger avec l’économie nationale | Importations, exportations |

## Les biens et services
- **Biens** (matériels, stockables) et **services** (immatériels, produits et consommés en même temps).
- Biens de **consommation** (détruits par l’usage) et biens de **production** (servent à produire).
- Production **marchande** (vendue à un prix couvrant au moins les coûts) et **non marchande** (gratuite ou quasi gratuite : école publique).

## Les contraintes
Chaque agent est limité par son **revenu** (contrainte budgétaire), son **temps**, l’**espace** (distance, localisation) et l’**information** dont il dispose.

## Le raisonnement économique
1. **La rationalité** : on suppose que l’agent cherche à atteindre au mieux ses objectifs compte tenu de ses contraintes (le consommateur maximise sa **satisfaction**, le producteur son **profit**).
2. **Le coût d’opportunité** : c’est la valeur de la **meilleure option à laquelle on renonce**. Aller en cours de conduite le samedi, c’est renoncer à un job payé 60 euros : le coût d’opportunité du cours est 60 euros de plus que son prix.
3. **L’utilité marginale** : la satisfaction apportée par **une unité supplémentaire** d’un bien. Elle est **décroissante** : la première part de pizza apporte plus que la quatrième.
4. **La valeur** d’un bien dépend de sa **rareté** et de son **utilité** : l’eau est très utile mais abondante, donc peu chère ; le diamant est rare.

## Le raisonnement « à la marge »
> Un producteur augmente sa production tant que la **recette marginale** (ce que rapporte une unité de plus) dépasse le **coût marginal** (ce que coûte une unité de plus). Il s’arrête quand **Cm = Rm**.

## Exemple travaillé
Une pâtisserie vend ses tartes 12 euros pièce (recette marginale = 12 euros). Produire la 50e tarte coûte 9 euros, la 60e 12 euros, la 70e 15 euros.
- À 50 tartes : Rm (12) > Cm (9) : produire une de plus rapporte 3 euros. On augmente.
- À 70 tartes : Cm (15) > Rm (12) : la dernière tarte fait perdre 3 euros. On réduit.
- L’optimum est à **60 tartes**, là où Cm = Rm = 12 euros.`,
          },
          questions: [
            ['Quelle est la fonction principale des ménages ?', ['Produire', 'Financer', 'Consommer', 'Redistribuer'], 2, 'Ils consomment grâce à leurs revenus.'],
            ['Quel agent produit des services non marchands et redistribue les revenus ?', ['Les administrations publiques', 'Les sociétés non financières', 'Les banques', 'Le reste du monde'], 0, 'Elles sont financées par les prélèvements obligatoires.'],
            ['Qu’est-ce que le coût d’opportunité ?', ['Le prix affiché d’un bien', 'Le coût de production unitaire', 'Le montant des impôts', 'La valeur de la meilleure option à laquelle on renonce'], 3, 'Tout choix implique un renoncement.'],
            ['L’utilité marginale est généralement…', ['Croissante', 'Décroissante', 'Constante', 'Négative dès la première unité'], 1, 'Chaque unité supplémentaire satisfait un peu moins que la précédente.'],
            ['Un producteur rationnel augmente sa production tant que…', ['Le coût marginal est supérieur à la recette marginale', 'La recette marginale est supérieure au coût marginal', 'Ses stocks augmentent', 'Ses concurrents produisent'], 1, 'Il s’arrête quand Cm = Rm.'],
            ['Un service se caractérise par le fait qu’il…', ['Est stockable', 'Est toujours gratuit', 'Est produit par l’État', 'Est immatériel'], 3, 'Il est en général produit et consommé en même temps.'],
            ['Une école publique gratuite fournit une production…', ['Non marchande', 'Marchande', 'Financière', 'Illégale'], 0, 'Elle est fournie gratuitement ou à un prix très inférieur au coût.'],
            ['Pourquoi l’eau est-elle bien moins chère que le diamant, alors qu’elle est plus utile ?', ['Parce qu’elle est taxée', 'Parce qu’elle est un service', 'Parce qu’elle est abondante', 'Parce que l’État la fabrique'], 2, 'La valeur dépend de l’utilité ET de la rareté.'],
            ['La contrainte budgétaire d’un ménage correspond à…', ['Son temps de loisir', 'Son lieu d’habitation', 'Ses préférences', 'Son revenu disponible'], 3, 'On ne peut pas dépenser plus que ce dont on dispose (sauf à emprunter).'],
            ['Une machine-outil achetée par une usine est un bien…', ['De consommation', 'Non marchand', 'De production', 'Incorporel'], 2, 'Elle sert à produire d’autres biens.'],
            ['Un agent rationnel est un agent qui…', ['Ne se trompe jamais', 'Cherche à atteindre au mieux ses objectifs compte tenu de ses contraintes', 'Dépense tout son revenu', 'Suit les conseils de l’État'], 1, 'La rationalité porte sur la démarche, pas sur l’infaillibilité.'],
            ['Une tarte se vend 12 euros ; la suivante coûterait 15 euros à produire. Le producteur doit…', ['Ne pas la produire', 'Produire cette tarte supplémentaire', 'Baisser son prix à 0', 'Doubler sa production'], 0, 'Cm (15) > Rm (12) : elle lui ferait perdre 3 euros.'],
          ],
        },
        {
          titre: 'Spécialisation, échanges et monnaie',
          axe: 'Économie — Thème 1 : Quelles sont les grandes questions économiques et leurs enjeux actuels ?',
          lecon: {
            titre: 'Pourquoi on échange, et avec quoi',
            cours: `Personne ne produit tout ce dont il a besoin. Les producteurs — individus, entreprises, pays — se **spécialisent**, puis **échangent**.

## Pourquoi se spécialiser ?
Chaque producteur compare ses **coûts d’opportunité** : produire une chose, c’est renoncer à en produire une autre. On a intérêt à se concentrer sur ce qu’on fait **relativement** le mieux.

| Heure de travail | Pains | Chaises |
| **Anna** | 10 | 2 |
| **Baptiste** | 4 | 2 |

Pour Anna, une chaise coûte 5 pains (10 ÷ 2) ; pour Baptiste, une chaise ne coûte que 2 pains (4 ÷ 2). Baptiste a donc un avantage **relatif** dans les chaises, Anna dans le pain. En se spécialisant et en échangeant, ils obtiennent **ensemble** plus de pain et plus de chaises qu’en produisant chacun tout.

> C’est l’idée des **avantages comparatifs** de David Ricardo (1817) : même quelqu’un de moins efficace en tout a intérêt à se spécialiser là où son désavantage est le plus faible.

La spécialisation vaut aussi entre **pays** : elle fonde le commerce international.

## Le marché
L’échange se réalise sur un **marché**, lieu **physique** (un marché de producteurs) ou **virtuel** (une plateforme en ligne), où se rencontrent une **offre** et une **demande**, et où se forme un **prix**.

## Le circuit économique
Les échanges créent des **flux** entre agents :
| Type de flux | Exemples |
| **Flux réels** | Biens et services vendus par les entreprises ; travail fourni par les ménages |
| **Flux monétaires** | Salaires versés aux ménages ; dépenses de consommation versées aux entreprises |

Dans un **circuit élémentaire**, les ménages fournissent leur travail aux entreprises (flux réel) contre un salaire (flux monétaire) ; ils achètent les biens produits (flux réel) en payant (flux monétaire). À chaque flux réel correspond un flux monétaire en sens inverse. On y ajoute ensuite les administrations, les banques et le reste du monde.

## La monnaie et ses fonctions
Sans monnaie, il faut le **troc** : trouver quelqu’un qui a ce que je veux ET veut ce que j’ai. La monnaie règle ce problème.
1. **Intermédiaire des échanges** : elle est acceptée par tous en paiement.
2. **Unité de compte** : elle mesure la valeur de tous les biens dans une même unité (un prix en euros).
3. **Réserve de valeur** : elle permet de reporter une dépense dans le temps (épargne) — à condition que l’inflation ne la ronge pas.

## Les formes de la monnaie
Monnaie **fiduciaire** (billets et pièces, moins de 10 % de la masse monétaire dans la zone euro) et monnaie **scripturale** (les dépôts sur les comptes bancaires, qui circulent par carte, virement, paiement mobile). Les **crypto-actifs** comme le bitcoin ne remplissent qu’imparfaitement ces fonctions : leur valeur est trop instable pour une réserve de valeur fiable, et peu de commerçants les acceptent.

## Exemple travaillé
Une heure de travail : Anna fait 10 pains ou 2 chaises, Baptiste 4 pains ou 2 chaises. Sans spécialisation, s’ils consacrent chacun 1 h au pain et 1 h aux chaises : 14 pains et 4 chaises. Si Anna fait 2 h de pain et Baptiste 2 h de chaises : **20 pains et 4 chaises**. Même nombre de chaises, 6 pains de plus à partager.`,
          },
          questions: [
            ['Sur quoi repose l’intérêt de la spécialisation ?', ['Sur le hasard', 'Sur la taille des entreprises', 'Sur la comparaison des coûts d’opportunité', 'Sur le niveau des impôts'], 2, 'On se spécialise là où l’on renonce au moins pour produire.'],
            ['Qui a développé la théorie des avantages comparatifs ?', ['David Ricardo', 'Adam Smith', 'Karl Marx', 'John Maynard Keynes'], 0, 'Dans ses « Principes » de 1817.'],
            ['Dans le circuit économique, le salaire versé par une entreprise à un ménage est un flux…', ['Réel', 'Financier international', 'Non marchand', 'Monétaire'], 3, 'Il est la contrepartie du travail fourni, flux réel.'],
            ['Laquelle n’est PAS une fonction de la monnaie ?', ['Intermédiaire des échanges', 'Facteur de production', 'Unité de compte', 'Réserve de valeur'], 1, 'Les trois fonctions sont : intermédiaire, unité de compte, réserve de valeur.'],
            ['Quel est le principal inconvénient du troc ?', ['Il est interdit par la loi', 'Il exige une double coïncidence des besoins', 'Il crée de l’inflation', 'Il suppose une banque'], 1, 'Il faut trouver quelqu’un qui veut ce que j’ai et a ce que je veux.'],
            ['Les dépôts sur les comptes bancaires constituent la monnaie…', ['Fiduciaire', 'Métallique', 'Marchandise', 'Scripturale'], 3, 'Elle circule par carte, virement ou chèque et représente l’essentiel de la masse monétaire.'],
            ['Afficher le prix d’un vélo en euros illustre la fonction…', ['D’unité de compte', 'De réserve de valeur', 'D’intermédiaire des échanges', 'De crédit'], 0, 'La monnaie mesure la valeur de tous les biens dans une même unité.'],
            ['Une plateforme de vente en ligne est un marché.', ['Vrai', 'Faux'], 0, 'Un marché peut être physique ou virtuel, dès lors qu’offre et demande s’y rencontrent.'],
            ['Anna fait 10 pains ou 2 chaises par heure. Quel est le coût d’opportunité d’une chaise pour elle ?', ['2 pains', '10 pains', '0,2 pain', '5 pains'], 3, '10 ÷ 2 = 5 pains sacrifiés par chaise.'],
            ['L’inflation affaiblit surtout la fonction de…', ['Unité de compte', 'Intermédiaire des échanges', 'Réserve de valeur', 'Création monétaire'], 2, 'Si les prix montent, l’argent épargné permet d’acheter moins demain.'],
            ['Pourquoi le bitcoin remplit-il mal la fonction de réserve de valeur ?', ['Parce qu’il est imprimé par la BCE', 'Parce que sa valeur est très instable', 'Parce qu’il est illégal en France', 'Parce qu’il n’existe pas en ligne'], 1, 'Sa valeur peut varier fortement en quelques jours.'],
            ['Une personne moins efficace dans toutes les productions n’a aucun intérêt à échanger.', ['Vrai', 'Faux'], 1, 'Elle a intérêt à se spécialiser là où son désavantage est le plus faible : c’est tout l’apport de Ricardo.'],
          ],
        },
        // ---- ÉCONOMIE — Thème 2 : création et répartition de la richesse -------
        {
          titre: 'Produire : facteurs de production et productivité',
          axe: 'Économie — Thème 2 : Comment la richesse se crée-t-elle et se répartit-elle ?',
          lecon: {
            titre: 'Combiner travail, capital et savoir',
            cours: `Produire, c’est **combiner** des **facteurs de production** pour obtenir des biens et services. Ce qui entre dans la production est un **input** ; ce qui en sort est un **output**.

## Les facteurs de production
| Facteur | Ce qu’il recouvre |
| **Le travail** | L’activité humaine rémunérée, mesurée en nombre d’actifs ou en heures |
| **Le capital** | Le **capital fixe** (machines, bâtiments, logiciels, utilisé plusieurs années) et le **capital circulant** (matières premières, énergie, détruits dans la production) |
| **Les ressources naturelles** | Terre, eau, minerais, énergie |
| **L’information** | Données, connaissances, savoir-faire |

On distingue les facteurs **primaires** (travail, capital, ressources naturelles) et **secondaires** (l’information, les consommations intermédiaires).

## Le capital humain
Le **capital humain** est l’ensemble des **connaissances, compétences et expériences** d’un individu qui le rendent plus productif. Il s’accumule par l’**éducation**, la **formation** et l’expérience, et il est entretenu par la **santé**.

## Substituer ou combiner ?
| Les facteurs sont **substituables** | Les facteurs sont **complémentaires** |
| On peut remplacer l’un par l’autre | Il faut les utiliser ensemble |
| Des caisses automatiques remplacent des caissiers | Un camion a besoin d’un chauffeur |

L’entreprise choisit sa **combinaison productive** selon le **coût relatif** des facteurs : si le travail devient cher, elle tend à le remplacer par du capital.

## L’investissement
L’**investissement** est l’achat de **capital fixe** ; il **accumule** les facteurs de production. On distingue l’investissement de **capacité** (produire plus), de **productivité** (produire mieux, moins cher) et de **remplacement**. L’investissement **immatériel** (recherche, formation, logiciels) prend une place croissante.

## La productivité
> La **productivité** mesure l’efficacité des facteurs : c’est le rapport entre la production obtenue et la quantité de facteur utilisée.

- **Productivité du travail** = production ÷ nombre de travailleurs (par tête) ou ÷ nombre d’heures (horaire).
- **Productivité globale des facteurs (PGF)** : la part de la croissance de la production qui n’est expliquée ni par plus de travail ni par plus de capital ; elle reflète le **progrès technique**, l’organisation du travail, la qualité du capital humain.

Les **gains de productivité** permettent de produire plus avec autant de facteurs, donc de baisser les prix, d’augmenter les salaires et les profits, de réduire le temps de travail.

## Exemple travaillé
En 2024, un atelier de 8 salariés produit 12 000 sacs. En 2025, après l’achat d’une machine de découpe, 8 salariés en produisent 15 000.
- Productivité par tête 2024 : 12 000 ÷ 8 = **1 500 sacs**.
- Productivité par tête 2025 : 15 000 ÷ 8 = **1 875 sacs**.
- Gain de productivité : (1 875 − 1 500) ÷ 1 500 × 100 = **+ 25 %**.
L’investissement (l’input) a permis un gain d’output sans travail supplémentaire.`,
          },
          questions: [
            ['Qu’appelle-t-on capital humain ?', ['Le nombre de salariés d’une entreprise', 'La masse salariale', 'Les connaissances et compétences qui rendent un individu plus productif', 'Les machines utilisées par les salariés'], 2, 'Il s’accumule par l’éducation, la formation et l’expérience.'],
            ['Des matières premières transformées pendant la production constituent…', ['Du capital circulant', 'Du capital fixe', 'Du capital humain', 'Un investissement immatériel'], 0, 'Elles sont détruites ou transformées dans la production.'],
            ['Des caisses automatiques qui remplacent des caissiers illustrent…', ['La complémentarité des facteurs', 'Le capital humain', 'La production non marchande', 'La substitution du capital au travail'], 3, 'Le capital remplace le travail quand il devient relativement moins cher.'],
            ['Comment calcule-t-on la productivité horaire du travail ?', ['Nombre d’heures ÷ production', 'Production ÷ nombre d’heures travaillées', 'Production × nombre de salariés', 'Chiffre d’affaires − salaires'], 1, 'La productivité par tête divise par le nombre de travailleurs.'],
            ['Un atelier passe de 1 500 à 1 875 sacs par salarié. Le gain de productivité est de…', ['+ 20 %', '+ 25 %', '+ 37,5 %', '+ 375 %'], 1, '(1 875 − 1 500) ÷ 1 500 × 100 = 25 %.'],
            ['La productivité globale des facteurs reflète surtout…', ['Le nombre d’heures travaillées', 'Le montant des impôts', 'La quantité de monnaie', 'Le progrès technique et l’organisation'], 3, 'C’est la part de la croissance non expliquée par la quantité de facteurs.'],
            ['Un investissement de capacité vise à…', ['Augmenter les capacités de production', 'Remplacer une machine usée', 'Réduire les impôts', 'Rembourser une dette'], 0, 'L’investissement de productivité, lui, vise à produire à moindre coût.'],
            ['Un camion et son chauffeur sont des facteurs complémentaires.', ['Vrai', 'Faux'], 0, 'L’un ne peut pas produire le service de transport sans l’autre.'],
            ['Laquelle de ces dépenses est un investissement immatériel ?', ['L’achat d’un bâtiment', 'L’achat de matières premières', 'Le paiement des salaires', 'Un programme de recherche'], 3, 'Recherche, formation et logiciels sont des investissements immatériels.'],
            ['Les gains de productivité peuvent permettre…', ['Uniquement d’augmenter les impôts', 'De supprimer toute production', 'D’augmenter les salaires ou de baisser les prix', 'D’augmenter la durée du travail obligatoirement'], 2, 'Ils se partagent entre salariés, entreprises, consommateurs et État.'],
            ['Une entreprise remplace du travail par du capital surtout quand…', ['Les machines deviennent plus chères', 'Le coût relatif du travail augmente', 'La demande baisse', 'Les salaires baissent'], 1, 'Le choix de la combinaison dépend du coût relatif des facteurs.'],
            ['Dans la production, le brevet obtenu après un programme de recherche est…', ['Un output', 'Un input', 'Un facteur primaire', 'Une consommation intermédiaire'], 0, 'L’investissement en recherche est l’input, le brevet l’output.'],
          ],
        },
        {
          titre: 'Mesurer et répartir la richesse',
          axe: 'Économie — Thème 2 : Comment la richesse se crée-t-elle et se répartit-elle ?',
          lecon: {
            titre: 'Valeur ajoutée, PIB et revenus',
            cours: `Pour savoir quelle richesse un pays crée, on ne peut pas additionner les chiffres d’affaires : on compterait plusieurs fois la même chose. On mesure la **valeur ajoutée**.

## La valeur ajoutée
> **Valeur ajoutée = production (chiffre d’affaires) − consommations intermédiaires**

Les **consommations intermédiaires** sont les biens et services **détruits ou transformés** dans la production (farine, électricité, emballages).

**Exemple.** Un agriculteur vend 1 000 euros de blé à un meunier, qui vend 1 600 euros de farine à un boulanger, qui vend 3 000 euros de pain.
| Producteur | Production | Consommations intermédiaires | Valeur ajoutée |
| Agriculteur | 1 000 | 0 | 1 000 |
| Meunier | 1 600 | 1 000 | 600 |
| Boulanger | 3 000 | 1 600 | 1 400 |
| **Total** | 5 600 | | **3 000** |
La somme des VA (3 000) est égale à la valeur du produit final : on ne compte le blé qu’une fois.

## Le PIB
Le **produit intérieur brut** mesure la richesse produite **sur le territoire** en un an :
> **PIB = somme des valeurs ajoutées + impôts sur les produits (TVA…) − subventions sur les produits**

Il est calculé par l’**INSEE** dans le cadre de la **comptabilité nationale**. La **production non marchande** (école, hôpital public) n’a pas de prix : on l’évalue à son **coût de production**. Le **PIB par habitant** compare le niveau de vie des pays ; le **taux de croissance du PIB en volume** (hors inflation) mesure leur dynamisme.

## Les limites du PIB et l’IDH
Le PIB ignore le travail domestique et bénévole, les inégalités, les dégâts sur l’environnement. L’**indice de développement humain** (IDH, entre 0 et 1) combine **revenu** par habitant, **espérance de vie** et **niveau d’éducation**.

## La répartition primaire
La production distribue des **revenus primaires** :
| Revenus du **travail** | Revenus du **capital** | Revenus **mixtes** |
| Salaires, traitements | Intérêts, dividendes, loyers (revenus de la propriété) | Revenus des indépendants (artisan, agriculteur), à la fois travail et capital |

Le **partage de la valeur ajoutée** d’une entreprise se fait entre les **salariés** (salaires et cotisations), l’**État** (impôts sur la production), les **prêteurs** (intérêts), les **actionnaires** (dividendes) et l’entreprise elle-même (autofinancement). Le progrès technique peut, sur longue période, modifier ce partage.

## La redistribution
L’État **corrige** la répartition primaire par la **redistribution** : il prélève des **prélèvements obligatoires** (impôts et cotisations sociales, environ 43 % du PIB en France) et verse des **prestations sociales** (allocations, pensions, minima sociaux) et des services publics gratuits.
L’**impôt sur le revenu** est **progressif** : le taux marginal augmente par tranche (0 %, 11 %, 30 %, 41 %, 45 %). Les plus aisés paient une part plus grande de leur revenu : cela réduit les inégalités.

## Exemple travaillé
Une entreprise réalise un chiffre d’affaires de 800 000 euros et achète pour 350 000 euros de matières, énergie et services. VA = 800 000 − 350 000 = **450 000 euros**. Si elle verse 300 000 euros de salaires et cotisations, la part des salaires dans sa VA est 300 000 ÷ 450 000 × 100 ≈ **66,7 %**.`,
          },
          questions: [
            ['Comment calcule-t-on la valeur ajoutée ?', ['Chiffre d’affaires − salaires', 'Bénéfice + impôts', 'Chiffre d’affaires − consommations intermédiaires', 'Production + importations'], 2, 'On retire ce qui a été produit par d’autres.'],
            ['Pourquoi additionne-t-on les valeurs ajoutées et non les chiffres d’affaires ?', ['Pour éviter de compter plusieurs fois les consommations intermédiaires', 'Parce que les chiffres d’affaires sont secrets', 'Pour inclure les impôts', 'Pour exclure les services'], 0, 'Le blé serait sinon compté chez l’agriculteur, le meunier et le boulanger.'],
            ['Une entreprise réalise 800 000 euros de chiffre d’affaires et 350 000 euros de consommations intermédiaires. Sa VA est de…', ['1 150 000 euros', '350 000 euros', '800 000 euros', '450 000 euros'], 3, '800 000 − 350 000 = 450 000 euros.'],
            ['Quel organisme calcule le PIB en France ?', ['La Banque de France', 'L’INSEE', 'Le FMI', 'Le Sénat'], 1, 'L’Institut national de la statistique et des études économiques.'],
            ['Comment évalue-t-on la production non marchande dans le PIB ?', ['À zéro', 'À son coût de production', 'À son prix de vente', 'Elle n’est pas comptée'], 1, 'Faute de prix, on retient ce qu’elle coûte.'],
            ['Lequel de ces éléments n’entre PAS dans l’IDH ?', ['Le revenu par habitant', 'L’espérance de vie', 'Le niveau d’éducation', 'Les émissions de CO2'], 3, 'L’IDH ne mesure pas l’état de l’environnement.'],
            ['Les dividendes sont des revenus…', ['Du capital', 'Du travail', 'Mixtes', 'De transfert'], 0, 'Ils rémunèrent les actionnaires.'],
            ['Le revenu d’un artisan indépendant est un revenu mixte.', ['Vrai', 'Faux'], 0, 'Il rémunère à la fois son travail et le capital qu’il engage.'],
            ['Un impôt progressif est un impôt dont…', ['Le montant est le même pour tous', 'Le taux baisse avec le revenu', 'Le produit va aux collectivités locales', 'Le taux augmente avec le revenu'], 3, 'C’est le cas de l’impôt sur le revenu en France.'],
            ['Que regroupent les prélèvements obligatoires ?', ['Les salaires et les dividendes', 'Les prestations sociales', 'Les impôts et les cotisations sociales', 'Les emprunts de l’État'], 2, 'Ils représentent environ 43 % du PIB en France.'],
            ['La redistribution vise principalement à…', ['Augmenter les dividendes', 'Réduire les inégalités issues de la répartition primaire', 'Supprimer les salaires', 'Financer les entreprises privées'], 1, 'Elle prélève sur certains pour verser à d’autres.'],
            ['Le PIB tient compte du travail domestique non rémunéré.', ['Vrai', 'Faux'], 1, 'C’est l’une de ses limites : il ne mesure que la production marchande et non marchande comptabilisée.'],
          ],
        },
        // ---- ÉCONOMIE — Thème 3 : affectation du revenu des ménages -----------
        {
          titre: 'Consommation, épargne et pouvoir d’achat',
          axe: 'Économie — Thème 3 : Comment les ménages décident-ils d’affecter leur revenu ?',
          lecon: {
            titre: 'Dépenser aujourd’hui ou épargner pour demain',
            cours: `Une fois les prélèvements payés et les prestations reçues, le ménage dispose de son **revenu disponible**. Il l’affecte à deux usages : **consommer** ou **épargner**.

> **Revenu disponible = consommation + épargne**

## Les indicateurs
| Indicateur | Formule | Lecture |
| **Propension moyenne à consommer** | Consommation ÷ revenu disponible | Part du revenu consommée |
| **Taux d’épargne** | Épargne ÷ revenu disponible × 100 | Part du revenu épargnée |
| **Propension marginale à consommer** | Variation de la consommation ÷ variation du revenu | Ce qu’on consomme d’un euro de revenu en plus |

Propension moyenne à consommer + taux d’épargne (en fraction) = 1. En France, le taux d’épargne des ménages tourne autour de **17 à 18 %** ces dernières années, un niveau élevé.

## Les déterminants de l’arbitrage
- **Économiques** : le **revenu** (plus il est élevé, plus on épargne en proportion), les **taux d’intérêt** (un taux élevé encourage l’épargne), l’**inflation**, le crédit.
- **Sociaux** : la catégorie sociale, les effets d’**imitation** et de **distinction**, la publicité.
- **Démographiques** : l’**âge** (on épargne pour sa retraite), la taille du ménage.
- **L’incertitude** : face au risque de chômage, on épargne par **précaution**.

## L’épargne et le patrimoine
L’épargne sert à **consommer plus tard**, à se protéger, à **investir** (logement) ou à placer (livret, actions). Accumulée, elle forme le **patrimoine** du ménage : patrimoine **immobilier** (logement) et **financier** (dépôts, livrets, assurance vie, actions). Le patrimoine produit à son tour des revenus (loyers, intérêts).

## Le pouvoir d’achat
Le **pouvoir d’achat** est la quantité de biens et services qu’un revenu permet d’acheter. Il dépend du **revenu** et des **prix**.
> Si le revenu augmente plus vite que les prix, le pouvoir d’achat augmente.

Les prix se mesurent par l’**indice des prix à la consommation** (IPC), calculé par l’INSEE sur un **panier** de biens et services représentatif de la consommation des ménages. Sur longue période, le pouvoir d’achat a fortement augmenté en France grâce aux gains de productivité, même s’il peut reculer lors d’une poussée d’inflation (2022-2023).

## La structure de la consommation
Le **coefficient budgétaire** d’un poste = dépense pour ce poste ÷ dépense totale × 100.
Depuis cinquante ans, la part de l’**alimentation** a fortement baissé (loi d’**Engel** : quand le revenu augmente, la part consacrée aux besoins de base diminue), au profit du **logement**, des **transports**, de la **santé**, des **loisirs** et de la **communication**. Ces évolutions dépendent aussi des **prix relatifs** : les produits électroniques sont devenus relativement bien moins chers.

## Exemple travaillé
Un ménage a un revenu disponible de 3 000 euros par mois ; il consomme 2 550 euros.
- Épargne = 3 000 − 2 550 = **450 euros**.
- Taux d’épargne = 450 ÷ 3 000 × 100 = **15 %** ; propension moyenne à consommer = 0,85.
- Son revenu augmente de 2 % sur un an, les prix de 5 % : son pouvoir d’achat **baisse** d’environ 3 % (plus précisément 1,02 ÷ 1,05 − 1 ≈ − 2,9 %).`,
          },
          questions: [
            ['Le revenu disponible se répartit entre…', ['Salaires et impôts', 'Investissement et exportations', 'Consommation et épargne', 'Actif et passif'], 2, 'Revenu disponible = consommation + épargne.'],
            ['Un ménage gagne 3 000 euros et épargne 450 euros. Son taux d’épargne est de…', ['15 %', '10 %', '45 %', '85 %'], 0, '450 ÷ 3 000 × 100 = 15 %.'],
            ['Si la propension moyenne à consommer est de 0,8, le taux d’épargne est de…', ['8 %', '80 %', '0,8 %', '20 %'], 3, 'Les deux parts additionnées font 100 %.'],
            ['Une hausse des taux d’intérêt tend à…', ['Décourager l’épargne', 'Encourager l’épargne', 'Supprimer la consommation', 'Faire baisser les revenus'], 1, 'L’épargne rapporte davantage, et le crédit coûte plus cher.'],
            ['Que mesure l’indice des prix à la consommation ?', ['Le niveau des salaires', 'L’évolution des prix d’un panier représentatif de biens et services', 'La production nationale', 'Le cours de la Bourse'], 1, 'Il est calculé chaque mois par l’INSEE.'],
            ['Le revenu augmente de 2 % et les prix de 5 %. Le pouvoir d’achat…', ['Augmente de 7 %', 'Augmente de 3 %', 'Reste stable', 'Baisse d’environ 3 %'], 3, '1,02 ÷ 1,05 − 1 ≈ − 2,9 %.'],
            ['Selon la loi d’Engel, quand le revenu augmente, la part consacrée à l’alimentation…', ['Diminue', 'Augmente', 'Reste constante', 'Devient nulle'], 0, 'Les besoins de base prennent une place relative plus faible.'],
            ['Comment calcule-t-on un coefficient budgétaire ?', ['Revenu ÷ dépense totale', 'Épargne ÷ consommation', 'Dépense pour un poste ÷ dépense totale × 100', 'Prix ÷ quantité'], 2, 'Il donne la part d’un poste dans le budget.'],
            ['L’épargne de précaution est motivée par…', ['La publicité', 'La baisse des prix', 'Le désir de distinction', 'L’incertitude sur l’avenir'], 3, 'Face au risque de chômage, on met de l’argent de côté.'],
            ['Le patrimoine d’un ménage est un flux mesuré chaque mois.', ['Vrai', 'Faux'], 1, 'C’est un stock accumulé à une date ; l’épargne est le flux qui l’alimente.'],
            ['Quel poste a vu sa part augmenter dans le budget des ménages depuis cinquante ans ?', ['L’alimentation', 'Le logement', 'L’habillement', 'Le tabac'], 1, 'Logement, transports, santé et loisirs ont progressé.'],
            ['Un ménage dont le revenu passe de 2 000 à 2 200 euros consomme 150 euros de plus. Sa propension marginale à consommer est de…', ['0,75', '0,15', '1,5', '0,68'], 0, '150 ÷ 200 = 0,75 : il consomme 75 centimes de chaque euro supplémentaire.'],
          ],
        },
        // ---- ÉCONOMIE — Thème 4 : financement ---------------------------------
        {
          titre: 'Le financement de l’activité économique',
          axe: 'Économie — Thème 4 : Quels modes de financement de l’activité économique ?',
          lecon: {
            titre: 'Qui prête à qui, et par quel chemin',
            cours: `Pour produire, investir ou consommer, les agents ont parfois besoin de plus de ressources qu’ils n’en ont. D’autres, au contraire, dégagent un surplus. Le **financement de l’économie** met les uns en relation avec les autres.

## Besoin ou capacité de financement
| Situation | Définition | Qui, en général ? |
| **Capacité de financement** | Épargne > investissement : l’agent peut prêter | Les **ménages** |
| **Besoin de financement** | Investissement > épargne : l’agent doit emprunter | Les **entreprises** et les **administrations publiques** |

## Le financement interne : l’autofinancement
L’entreprise finance ses investissements avec ses **propres ressources**, issues de ses bénéfices non distribués.
| Avantages | Limites |
| **Indépendance** : pas de dette, pas d’intérêts, pas de nouveaux actionnaires | Ressources souvent **insuffisantes** pour de gros projets |
| Pas de formalités | Moins de dividendes pour les actionnaires |

## Le financement externe
Deux circuits existent.

**1. Le financement direct (ou désintermédié)**, sur le **marché financier** : l’agent émet des **titres financiers** achetés directement par les épargnants.
- Les **actions** : titres de **propriété** d’une part du capital d’une société. Elles donnent un droit de vote et un **dividende** variable, sans obligation de remboursement.
- Les **obligations** : titres de **créance** (un prêt) qui rapportent un **intérêt** et sont **remboursées** à l’échéance. L’État emprunte ainsi (OAT).
Le **marché primaire** est celui de l’émission des titres neufs ; le **marché secondaire** (la Bourse) celui de leur revente.

**2. Le financement indirect (ou intermédié)** : une **banque** collecte l’épargne et accorde des **crédits** (emprunts). Elle joue un rôle d’**intermédiaire** et prend en charge le **risque** : si l’emprunteur ne rembourse pas, c’est la banque qui supporte la perte, pas l’épargnant.

## Le crédit crée de la monnaie
> Quand une banque accorde un crédit, elle crée de la monnaie : elle inscrit une somme sur le compte de l’emprunteur, qui peut la dépenser. Le remboursement la détruit.

La création monétaire est encadrée par la **Banque centrale européenne**, qui fixe notamment les taux directeurs.

## Les actifs financiers
Les **actifs financiers** sont les titres et placements détenus par les agents : dépôts, livrets, actions, obligations, assurance vie. Ils diffèrent par leur **rendement**, leur **risque** et leur **liquidité** (facilité à les transformer en monnaie). Plus un placement est risqué, plus il doit rapporter.

## Exemple travaillé
Une PME veut acheter une machine à 500 000 euros. Elle dispose de 150 000 euros d’autofinancement.
- Il lui manque **350 000 euros** : elle a un **besoin de financement**.
- Options : un **emprunt bancaire** (financement indirect, intérêts à payer, contrôle conservé) ou une **augmentation de capital** (financement direct si elle est cotée, pas de remboursement mais partage du pouvoir et des bénéfices).
- Une PME non cotée passe le plus souvent par la **banque** : le marché financier est surtout accessible aux grandes entreprises.`,
          },
          questions: [
            ['Un agent dont l’épargne dépasse l’investissement a…', ['Un besoin de financement', 'Un déficit', 'Une capacité de financement', 'Une dette'], 2, 'Il peut prêter aux autres ; c’est en général le cas des ménages.'],
            ['Qu’est-ce que l’autofinancement ?', ['Le financement par ses propres ressources', 'Un emprunt bancaire', 'L’émission d’actions', 'Une subvention publique'], 0, 'Il préserve l’indépendance de l’entreprise.'],
            ['Une action est un titre…', ['De créance, remboursable', 'Émis uniquement par l’État', 'Sans aucun risque', 'De propriété d’une part du capital'], 3, 'Elle donne droit à un dividende et à un droit de vote.'],
            ['Une obligation rapporte…', ['Un dividende variable', 'Un intérêt, et elle est remboursée à l’échéance', 'Un droit de vote', 'Rien'], 1, 'C’est un titre de créance, un prêt.'],
            ['Le financement par emprunt bancaire est un financement…', ['Direct', 'Indirect (intermédié)', 'Interne', 'Monétaire public'], 1, 'La banque s’intercale entre épargnants et emprunteurs.'],
            ['Quand une banque accorde un crédit, elle crée de la monnaie.', ['Vrai', 'Faux'], 0, 'Elle inscrit la somme sur le compte de l’emprunteur ; le remboursement détruit cette monnaie.'],
            ['Sur quel marché s’échangent des titres déjà émis ?', ['Le marché secondaire', 'Le marché primaire', 'Le marché du travail', 'Le marché monétaire interbancaire uniquement'], 0, 'C’est la Bourse ; le marché primaire est celui des émissions.'],
            ['Quel est le principal avantage de l’autofinancement ?', ['Il permet de financer tous les projets', 'Il augmente les dividendes', 'Il préserve l’indépendance de l’entreprise', 'Il est garanti par l’État'], 2, 'Pas de dette ni de nouveaux actionnaires.'],
            ['Quelle institution encadre la création monétaire dans la zone euro ?', ['La Commission européenne', 'Le FMI', 'L’INSEE', 'La Banque centrale européenne'], 3, 'Elle fixe notamment les taux directeurs.'],
            ['Une PME a besoin de 500 000 euros et dispose de 150 000 euros d’autofinancement. Son besoin de financement externe est de…', ['150 000 euros', '500 000 euros', '350 000 euros', '650 000 euros'], 2, '500 000 − 150 000 = 350 000 euros.'],
            ['Qu’appelle-t-on la liquidité d’un actif ?', ['Sa rentabilité', 'La facilité à le transformer en monnaie sans perte', 'Son niveau de risque', 'Sa durée de vie'], 1, 'Un dépôt bancaire est plus liquide qu’un appartement.'],
            ['Quels agents ont en général un besoin de financement ?', ['Les entreprises et les administrations publiques', 'Les ménages', 'Les épargnants', 'Les retraités'], 0, 'Ils investissent plus qu’ils n’épargnent.'],
          ],
        },
        // ---- ÉCONOMIE — Thème 5 : concurrence -----------------------------------
        {
          titre: 'Marchés et concurrence',
          axe: 'Économie — Thème 5 : Les marchés des biens et services sont-ils concurrentiels ?',
          lecon: {
            titre: 'Du prix d’équilibre au monopole',
            cours: `Sur un marché, l’**offre** (les vendeurs) rencontre la **demande** (les acheteurs). Le degré de **concurrence** y est très variable.

## Offre, demande et prix d’équilibre
- La **demande** diminue quand le prix augmente.
- L’**offre** augmente quand le prix augmente.
- Le **prix d’équilibre** est le prix pour lequel quantité offerte = quantité demandée.
Si le prix est au-dessus, il y a **excédent** d’offre (des invendus) et le prix baisse ; au-dessous, il y a **pénurie** et le prix monte.

## L’élasticité
> L’**élasticité-prix de la demande** mesure la sensibilité de la demande à une variation du prix :
> e = variation en % de la quantité demandée ÷ variation en % du prix

**Exemple.** Le prix d’un abonnement passe de 10 à 11 euros (+ 10 %) ; les abonnés passent de 20 000 à 17 000 (− 15 %). e = − 15 ÷ 10 = **− 1,5**. La demande est **élastique** (plus de 1 en valeur absolue) : la hausse fait perdre du chiffre d’affaires (17 000 × 11 = 187 000 euros, contre 20 000 × 10 = 200 000 euros avant).
Un bien de première nécessité (carburant, pain) a une demande **peu élastique**.

L’**élasticité croisée** mesure l’effet du prix d’un bien sur la demande d’un **autre** : positive pour des **produits substituables** (beurre et margarine), négative pour des **produits complémentaires** (imprimante et cartouches).

## Les structures de marché
| Structure | Nombre de vendeurs | Pouvoir sur le prix |
| **Concurrence** | Très nombreux | Aucun : le prix tend vers le **coût marginal** |
| **Oligopole** | Quelques-uns | Fort, avec des stratégies interdépendantes |
| **Monopole** | Un seul | Maximal : le monopoleur fixe un prix élevé |

Quand des oligopoleurs s’entendent sur les prix, ils forment un **cartel** : c’est interdit et sanctionné par l’**Autorité de la concurrence** et la Commission européenne. La plupart des marchés réels sont en **concurrence imparfaite**.

Le **marché pertinent** est l’espace (produit et zone géographique) où des biens sont substituables aux yeux des acheteurs : c’est sur lui qu’on mesure la concurrence. L’**indice de concentration** (part de marché cumulée des premières entreprises) indique si le marché est concentré.

## Les barrières à l’entrée
Obstacles qui empêchent de nouveaux concurrents d’arriver : coût d’investissement initial, brevets, réglementation, notoriété des marques installées, effets de réseau.

## Dépasser l’intensité concurrentielle
La concurrence fait disparaître les **surprofits**. Pour y échapper, les entreprises :
1. **innovent** : un nouveau produit leur donne un monopole temporaire ;
2. **différencient** leurs produits (qualité, design, marque) pour se placer sur un créneau **haut de gamme** et pratiquer des prix élevés.
À long terme, les **imitateurs** suivent, et les prix relatifs des innovations baissent (téléviseurs, ordinateurs, téléphones) : le consommateur en profite.

## Exemple travaillé
Quatre opérateurs mobiles détiennent 25 %, 22 %, 20 % et 18 % du marché français. Indice de concentration des 4 premiers : 25 + 22 + 20 + 18 = **85 %** : c’est un **oligopole**. L’arrivée d’un nouvel opérateur en 2012 a fait fortement baisser les prix : la concurrence profite au consommateur.`,
          },
          questions: [
            ['Qu’est-ce que le prix d’équilibre ?', ['Le prix fixé par l’État', 'Le prix le plus bas possible', 'Le prix pour lequel quantité offerte = quantité demandée', 'Le coût de production'], 2, 'À ce prix, il n’y a ni pénurie ni invendus.'],
            ['Si le prix est supérieur au prix d’équilibre, on observe…', ['Un excédent d’offre', 'Une pénurie', 'Une hausse de la demande', 'Un monopole'], 0, 'Des invendus poussent le prix à la baisse.'],
            ['Le prix passe de 10 à 11 euros et la quantité demandée baisse de 15 %. L’élasticité-prix est de…', ['− 0,67', '− 15', '+ 1,5', '− 1,5'], 3, '− 15 % ÷ + 10 % = − 1,5 : la demande est élastique.'],
            ['La demande de carburant est plutôt…', ['Très élastique', 'Peu élastique', 'Nulle', 'Toujours croissante avec le prix'], 1, 'C’est un bien dont on se passe difficilement à court terme.'],
            ['Une imprimante et ses cartouches sont des produits…', ['Substituables', 'Complémentaires', 'Non marchands', 'Identiques'], 1, 'Leur élasticité croisée est négative.'],
            ['Un marché avec quelques vendeurs seulement est un…', ['Monopole', 'Marché concurrentiel', 'Monopsone', 'Oligopole'], 3, 'Chaque vendeur tient compte des réactions des autres.'],
            ['Un cartel est autorisé s’il fait baisser les coûts.', ['Vrai', 'Faux'], 1, 'L’entente sur les prix est interdite et sanctionnée par l’Autorité de la concurrence.'],
            ['En concurrence, le prix tend vers…', ['Le prix de monopole', 'Zéro', 'Le coût marginal', 'Le prix fixé par l’État'], 2, 'C’est ce qui rend la concurrence avantageuse pour le consommateur.'],
            ['Lequel de ces éléments est une barrière à l’entrée ?', ['Une baisse des prix des matières premières', 'L’arrivée de nouveaux clients', 'La hausse de la demande', 'Un brevet détenu par l’entreprise installée'], 3, 'Le brevet empêche les autres de produire la même innovation.'],
            ['Comment une entreprise peut-elle échapper à l’intensité concurrentielle ?', ['En baissant sa qualité', 'En cessant la publicité', 'En innovant et en différenciant ses produits', 'En refusant de vendre'], 2, 'Innovation et différenciation créent un créneau protégé, au moins temporairement.'],
            ['Quatre opérateurs détiennent 25 %, 22 %, 20 % et 18 % du marché. L’indice de concentration des quatre premiers est de…', ['22 %', '85 %', '60 %', '100 %'], 1, '25 + 22 + 20 + 18 = 85 % : le marché est très concentré.'],
            ['Qu’appelle-t-on le marché pertinent ?', ['L’espace où des produits sont substituables aux yeux des acheteurs', 'Le marché le plus rentable', 'Le marché boursier', 'Le marché fixé par la loi'], 0, 'C’est sur lui qu’on mesure le degré de concurrence.'],
          ],
        },
      ],
    },
  ],
}
