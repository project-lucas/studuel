import Link from 'next/link'
import PageLegale, { Section, Valeur } from '@/components/legal/PageLegale'
import { EDITEUR } from '@/lib/legal/editeur'

export const metadata = { title: 'Conditions d’utilisation — Studuel' }

// LES CONDITIONS GÉNÉRALES D'UTILISATION ET DE VENTE (25/10/2026) — celles
// que l'inscription fait accepter (components/welcome/SignUpStep). Le « tu »
// de l'app ; la partie vente s'adresse au parent qui paie.
export default function CguPage() {
  return (
    <PageLegale
      titre="Conditions d’utilisation"
      intro={
        <p>
          Les règles du jeu de {EDITEUR.marque}. En créant un compte, tu les acceptes. Si tu as moins de 15 ans, lis-les
          avec un de tes parents.
        </p>
      }
    >
      <Section titre="1. Ce qu’est Studuel">
        <p>
          {EDITEUR.marque} est une application de révision de la 6e à la Terminale : cours, fiches, quiz, exercices,
          annales, jeux, duels et un assistant de révision, Marcel. Elle est éditée par{' '}
          <Valeur v={EDITEUR.raisonSociale} /> (voir les{' '}
          <Link href="/mentions-legales" className="font-bold text-primary underline underline-offset-4">
            mentions légales
          </Link>
          ). Une grande partie est gratuite ; l’abonnement Studuel+ ouvre le reste.
        </p>
        <p>
          {EDITEUR.marque} aide à réviser : il ne remplace ni un professeur, ni les cours de ton établissement.
        </p>
      </Section>

      <Section titre="2. Ton compte">
        <ul className="list-disc space-y-1 pl-5">
          <li>Avant 15 ans, il te faut l’accord d’un de tes parents pour créer un compte.</li>
          <li>Un compte est personnel : ne partage pas ton mot de passe.</li>
          <li>
            Ton pseudo et ton avatar sont visibles des autres joueurs : pas de vrai nom complet, pas d’insulte, rien de
            choquant.
          </li>
          <li>
            Tu peux supprimer ton compte quand tu veux, dans Mon compte. Voir la{' '}
            <Link href="/confidentialite" className="font-bold text-primary underline underline-offset-4">
              politique de confidentialité
            </Link>
            .
          </li>
        </ul>
      </Section>

      <Section titre="3. Les règles entre joueurs">
        <ul className="list-disc space-y-1 pl-5">
          <li>Respecte les autres : pas de harcèlement, de moquerie, de propos haineux ni de contenu choquant.</li>
          <li>Pas de triche : pas de programme, de compte multiple ni de faille exploitée pour gagner.</li>
          <li>
            Un problème avec un joueur ou un message ? Signale-le dans l’app ou écris à {EDITEUR.email}.
          </li>
        </ul>
        <p>
          Si ces règles ne sont pas respectées, nous pouvons retirer un contenu, remettre à zéro un classement,
          suspendre ou supprimer un compte.
        </p>
      </Section>

      <Section titre="4. Marcel, l’assistant de révision">
        <p>
          Marcel est une intelligence artificielle. Il peut se tromper : vérifie ce qu’il dit avec ton cours. Ne lui
          confie rien de personnel (nom complet, adresse, téléphone). Il ne fait pas tes devoirs à ta place : il
          t’aide à comprendre.
        </p>
      </Section>

      <Section titre="5. XP, gemmes et objets">
        <p>
          L’XP, les gemmes, les trophées et les objets de l’app sont des éléments de jeu. Ils n’ont aucune valeur en
          argent, ne s’échangent pas contre de l’argent et ne se transfèrent pas à un autre compte. Ils disparaissent
          avec le compte.
        </p>
      </Section>

      <Section titre="6. Studuel+ et les achats">
        <ul className="list-disc space-y-1 pl-5">
          <li>Studuel+ et les recharges sont achetés par un adulte, le plus souvent un parent.</li>
          <li>
            Le prix, la durée et ce que comprend l’offre sont affichés avant l’achat, toutes taxes comprises.
          </li>
          <li>
            Un abonnement se renouvelle seulement si c’est indiqué au moment de l’achat ; il s’arrête quand tu veux
            pour la période suivante.
          </li>
          <li>
            Droit de rétractation : tu disposes de 14 jours après l’achat. Si tu commences à utiliser Studuel+ pendant
            ces 14 jours, tu acceptes que le service démarre tout de suite, et tu renonces au droit de rétractation
            pour la partie déjà fournie.
          </li>
          <li>
            Un achat fait dans une boutique d’applications (Google Play, App Store) suit en plus les règles de
            paiement et de remboursement de cette boutique.
          </li>
        </ul>
      </Section>

      <Section titre="7. Nos contenus">
        <p>
          Les cours, fiches, quiz, exercices, corrigés et illustrations appartiennent à {EDITEUR.marque}. Tu peux les
          utiliser pour réviser, les imprimer pour toi ; pas les revendre ni les republier ailleurs.
        </p>
        <p>
          Ce que tu écris toi-même (dossiers de cours, notes) reste à toi. Tu nous autorises seulement à le stocker et
          à l’afficher pour faire marcher l’app.
        </p>
      </Section>

      <Section titre="8. Disponibilité et responsabilité">
        <p>
          Nous faisons de notre mieux pour que l’app marche et que les contenus soient exacts, et nous corrigeons les
          erreurs signalées. L’app peut être interrompue pour une mise à jour ou une panne. Nous ne sommes pas
          responsables d’un résultat scolaire.
        </p>
      </Section>

      <Section titre="9. Changements">
        <p>
          Ces conditions peuvent évoluer. En cas de changement important, nous te prévenons dans l’app avant qu’il
          s’applique.
        </p>
      </Section>

      <Section titre="10. Droit applicable et litiges">
        <p>
          Ces conditions sont soumises au droit français. En cas de désaccord, écris-nous d’abord à {EDITEUR.email} :
          on cherche une solution ensemble. Un consommateur peut aussi recourir gratuitement au médiateur de la
          consommation : <Valeur v={EDITEUR.mediateur} />.
        </p>
      </Section>
    </PageLegale>
  )
}
