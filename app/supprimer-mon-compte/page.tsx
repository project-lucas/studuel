import Link from 'next/link'
import { CircleCheck } from 'lucide-react'
import PageLegale, { Section } from '@/components/legal/PageLegale'
import { EDITEUR } from '@/lib/legal/editeur'

export const metadata = { title: 'Supprimer mon compte — Studuel' }

// SUPPRIMER SON COMPTE (25/10/2026) — la page PUBLIQUE que Google Play exige
// (« Data deletion » : une adresse web qui explique comment demander la
// suppression, même sans l'app). C'est aussi là qu'atterrit l'élève juste
// après avoir supprimé son compte (`?fait=1`, components/compte/SupprimerCompte).
export default async function SupprimerMonComptePage({
  searchParams,
}: {
  searchParams: Promise<{ fait?: string }>
}) {
  const { fait } = await searchParams

  return (
    <PageLegale titre="Supprimer mon compte">
      {fait === '1' ? (
        <div role="status" className="flex items-start gap-3 rounded-2xl bg-secondary/60 p-4">
          <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
          <p className="font-bold">
            Ton compte {EDITEUR.marque} est supprimé, avec toutes ses données. Merci d’avoir révisé avec nous !
          </p>
        </div>
      ) : null}

      <Section titre="Depuis l’app">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Ouvre {EDITEUR.marque} et connecte-toi.</li>
          <li>
            Va dans <strong>Moi</strong>, puis <strong>Mon compte</strong>.
          </li>
          <li>
            En bas de la page, touche <strong>Supprimer mon compte</strong>, écris SUPPRIMER et confirme.
          </li>
        </ol>
        <p>La suppression est immédiate et définitive.</p>
      </Section>

      <Section titre="Sans l’app">
        <p>
          Écris à <strong>{EDITEUR.email}</strong> depuis l’adresse e-mail de ton compte, avec pour objet « Supprimer
          mon compte ». Un parent peut faire la demande pour son enfant. Nous supprimons le compte sous 30 jours et te
          le confirmons par e-mail.
        </p>
      </Section>

      <Section titre="Ce qui est effacé">
        <p>
          Ton profil, ton e-mail, ta progression, ton XP, tes gemmes, tes séries, tes amis, ta ligue, tes duels, tes
          dossiers de cours, tes échanges avec Marcel et ton avatar.
        </p>
      </Section>

      <Section titre="Ce qui est gardé">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Les messages échangés avec un coach restent dans le fil de discussion, sans ton nom, pour les autres
            participants.
          </li>
          <li>Les traces d’un paiement, 10 ans, parce que la loi l’exige.</li>
          <li>Le journal technique (erreurs, pages ouvertes), détaché de ton compte.</li>
        </ul>
        <p>
          Tout est détaillé dans la{' '}
          <Link href="/confidentialite" className="font-bold text-primary underline underline-offset-4">
            politique de confidentialité
          </Link>
          .
        </p>
      </Section>
    </PageLegale>
  )
}
