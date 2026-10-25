import Link from 'next/link'
import PageLegale, { Section, Valeur } from '@/components/legal/PageLegale'
import { A_COMPLETER, EDITEUR, PRESTATAIRES } from '@/lib/legal/editeur'

export const metadata = { title: 'Politique de confidentialité — Studuel' }

// LA POLITIQUE DE CONFIDENTIALITÉ (25/10/2026) — RGPD (art. 12 à 14),
// demandée par Google Play et l'App Store. Écrite pour être lue par un élève
// de 11 ans ET par ses parents : des phrases courtes, le « tu » de l'app.
// La liste des prestataires vient de lib/legal/editeur (une seule source).
export default function ConfidentialitePage() {
  return (
    <PageLegale
      titre="Confidentialité"
      intro={
        <p>
          Ce que {EDITEUR.marque} sait de toi, pourquoi, qui le voit, combien de temps on le garde et comment tout
          effacer. Si tu as moins de 15 ans, lis cette page avec un de tes parents.
        </p>
      }
    >
      <Section titre="Qui est responsable de tes données">
        <p>
          <Valeur v={EDITEUR.raisonSociale} />, éditeur de {EDITEUR.marque} (voir les{' '}
          <Link href="/mentions-legales" className="font-bold text-primary underline underline-offset-4">
            mentions légales
          </Link>
          ). Pour toute question sur tes données : {EDITEUR.email}.
        </p>
      </Section>

      <Section titre="Ce que nous collectons">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Ton compte</strong> : ton adresse e-mail, ton mot de passe (chiffré, nous ne le voyons jamais), le
            prénom ou pseudo que tu choisis, ta classe et, si tu l’indiques, ton établissement.
          </li>
          <li>
            <strong>Ta progression</strong> : tes réponses aux quiz et exercices, tes scores, ton XP, tes séries, tes
            gemmes, tes objectifs, tes contrôles à venir.
          </li>
          <li>
            <strong>Ce que tu écris</strong> : tes dossiers de cours, tes notes, tes questions à Marcel et les fichiers
            ou photos que tu lui joins.
          </li>
          <li>
            <strong>Ta vie dans l’app</strong> : tes amis, ta ligue, tes duels, ton avatar, et, si tu es dans le
            groupe d’un coach, les messages échangés avec lui.
          </li>
          <li>
            <strong>Des informations techniques</strong> : le type d’appareil, les pages ouvertes et les erreurs
            rencontrées, pour réparer l’app et comprendre ce qui sert. Aucune publicité, aucun traceur publicitaire.
          </li>
        </ul>
      </Section>

      <Section titre="Pourquoi">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Faire marcher l’app (ton compte, ta progression, Marcel, les duels) : c’est le service que tu demandes en
            t’inscrivant (exécution des CGU).
          </li>
          <li>
            T’envoyer des rappels : seulement si tu as activé les notifications, et tu peux les couper à tout moment
            dans Mon compte (consentement).
          </li>
          <li>
            Protéger l’app et la réparer (journal d’erreurs, lutte contre la triche) et mesurer ce qui est utilisé
            (intérêt légitime).
          </li>
          <li>Garder les traces d’un paiement : la loi nous y oblige (obligation légale).</li>
        </ul>
        <p>Nous ne vendons jamais tes données et nous ne nous en servons pas pour de la publicité.</p>
      </Section>

      <Section titre="Qui voit quoi">
        <ul className="list-disc space-y-1 pl-5">
          <li>Les autres joueurs voient ton pseudo, ton avatar, ton niveau et ta ligue — jamais ton e-mail.</li>
          <li>
            Un parent relié à ton compte voit ton activité et tes progrès, pour t’accompagner.
          </li>
          <li>
            Un coach dont tu as rejoint le groupe voit tes jours d’activité, ton temps de révision, tes scores par
            matière et tes contrôles à venir — pas tes amis, ni tes achats, ni ton avatar. Tu peux quitter le groupe à
            tout moment dans Mon compte.
          </li>
          <li>L’équipe {EDITEUR.marque} y accède seulement pour t’aider, réparer l’app ou assurer la sécurité.</li>
        </ul>
      </Section>

      <Section titre="Nos prestataires">
        <p>
          Ces entreprises travaillent pour nous et ne peuvent utiliser tes données que pour ce service. Quand elles
          sont hors de l’Union européenne, le transfert est encadré par les clauses contractuelles types de la
          Commission européenne.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          {PRESTATAIRES.map((p) => (
            <li key={p.nom}>
              <strong>{p.nom}</strong> — {p.role} ; <Valeur v={p.lieu} /> ; {p.donnees}.
            </li>
          ))}
        </ul>
        <p>
          Marcel est une intelligence artificielle : ne lui confie ni ton nom complet, ni ton adresse, ni rien de
          personnel. Nous ne lui transmettons jamais ton nom ni ton e-mail.
        </p>
      </Section>

      <Section titre="Combien de temps">
        <ul className="list-disc space-y-1 pl-5">
          <li>Ton compte et ta progression : tant que ton compte existe.</li>
          <li>
            Un compte inactif : supprimé après <Valeur v={`${A_COMPLETER} : durée (la CNIL recommande 3 ans au plus)`} />{' '}
            sans connexion.
          </li>
          <li>
            Le journal technique : <Valeur v={`${A_COMPLETER} : durée (12 mois conseillés)`} />.
          </li>
          <li>Les traces de paiement : 10 ans, comme l’exige la loi.</li>
        </ul>
      </Section>

      <Section titre="Supprimer ton compte">
        <p>
          Dans l’app : <strong>Moi › Mon compte › Supprimer mon compte</strong>. Tout est effacé tout de suite : ton
          profil, ta progression, tes amis, tes achats. Les messages échangés avec un coach restent dans le fil de
          discussion, mais sans ton nom. Tu peux aussi nous écrire :{' '}
          <Link href="/supprimer-mon-compte" className="font-bold text-primary underline underline-offset-4">
            voir comment
          </Link>
          .
        </p>
      </Section>

      <Section titre="Tes droits">
        <p>
          Tu peux à tout moment demander à voir tes données, les corriger, les effacer, en recevoir une copie,
          t’opposer à un traitement ou le limiter. Écris à {EDITEUR.email} depuis l’adresse de ton compte : nous
          répondons sous un mois. Si tu as moins de 15 ans, un de tes parents peut faire la demande pour toi.
        </p>
        <p>
          Si tu penses que tes droits ne sont pas respectés, tu peux te plaindre auprès de la CNIL (cnil.fr), l’autorité
          française de protection des données.
        </p>
      </Section>

      <Section titre="Les moins de 15 ans">
        <p>
          {EDITEUR.marque} est fait pour les collégiens et les lycéens. Avant 15 ans, l’accord d’un parent est
          nécessaire pour utiliser l’app ; l’abonnement Studuel+ est toujours souscrit par un adulte.
        </p>
      </Section>
    </PageLegale>
  )
}
