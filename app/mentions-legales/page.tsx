import PageLegale, { Section, Valeur } from '@/components/legal/PageLegale'
import { EDITEUR, HEBERGEUR } from '@/lib/legal/editeur'

export const metadata = { title: 'Mentions légales — Studuel' }

// LES MENTIONS LÉGALES (25/10/2026) — obligatoires (loi pour la confiance dans
// l'économie numérique, art. 6). Les valeurs vivent dans lib/legal/editeur.
export default function MentionsLegalesPage() {
  return (
    <PageLegale titre="Mentions légales">
      <Section titre="Éditeur">
        <p>
          L’application {EDITEUR.marque} ({EDITEUR.site}) est éditée par <Valeur v={EDITEUR.raisonSociale} />,{' '}
          <Valeur v={EDITEUR.forme} />, immatriculée sous le numéro <Valeur v={EDITEUR.siret} />, dont le siège est
          situé <Valeur v={EDITEUR.adresse} />.
        </p>
        <p>Contact : {EDITEUR.email}</p>
        <p>
          Directeur de la publication : <Valeur v={EDITEUR.directeurPublication} />.
        </p>
      </Section>

      <Section titre="Hébergement">
        <p>
          {HEBERGEUR.nom}, {HEBERGEUR.adresse} ({HEBERGEUR.site}).
        </p>
      </Section>

      <Section titre="Propriété intellectuelle">
        <p>
          Les cours, fiches, quiz, exercices, corrigés, illustrations, personnages, sons et le code de{' '}
          {EDITEUR.marque} sont protégés par le droit d’auteur. Toute reproduction ou diffusion en dehors d’un usage
          personnel et scolaire demande notre accord écrit.
        </p>
        <p>
          Les sujets d’examen reproduits dans les annales appartiennent à leurs auteurs (ministère de l’Éducation
          nationale) ; les corrigés sont écrits par {EDITEUR.marque}. Les œuvres d’art montrées dans les jeux
          appartiennent au domaine public.
        </p>
      </Section>

      <Section titre="Crédits">
        <p>Flamme animée par Freepik (Flaticon).</p>
      </Section>

      <Section titre="Signaler un contenu">
        <p>
          Une erreur dans un cours, un contenu choquant, un message inapproprié : écris-nous à {EDITEUR.email}. Nous
          répondons et retirons ce qui doit l’être au plus vite.
        </p>
      </Section>
    </PageLegale>
  )
}
