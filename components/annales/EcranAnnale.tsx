import Link from 'next/link'
import { BookOpenCheck, Clock, Download, FileText, Scale } from 'lucide-react'
import 'katex/dist/katex.min.css'
import './corrige.css'
import { libelleNature, lieuDe, pdfSujet } from '@/lib/annales-corrigees/apercu'
import { MATIERES_ANNALES, type MatiereAnnale } from '@/lib/annales-corrigees/matieres'
import { titreEpreuve } from '@/lib/annales-corrigees/epreuve'
import { nomTelechargementSujet } from '@/lib/annales-corrigees/sujet'
import type { AnnaleCorrigee, PartieCorrigee } from '@/lib/annales-corrigees/types'
import { formatDuration } from '@/lib/exam-papers'
import EnTetePage from '@/components/reviser/EnTetePage'
import MedaillonMatiere from '@/components/reviser/MedaillonMatiere'
import { Button } from '@/components/ui/button'
import BlocsCorrige from '@/components/annales/BlocsCorrige'
import PartiesCorrige from '@/components/annales/PartiesCorrige'
import TexteCorrige from '@/components/annales/TexteCorrige'
import ValiderAnnale from '@/components/annales/ValiderAnnale'

/**
 * L'écran d'une annale corrigée : le sujet officiel (le PDF habillé, à lire ou
 * à télécharger), puis le corrigé Studuel, partie par partie — chaque partie
 * composée comme une FICHE DE RÉVISION (corrige.css, 25/10/2026) : la tête de
 * fiche (matière, session, le thème tombé surligné), l'énoncé, « En 30
 * secondes », puis les blocs en cartes, rubans et post-its.
 *
 * Composant SERVEUR (KaTeX tourne ici). Rendu par la page de Réviser et par
 * l'aperçu de développement /dev/annales.
 */
export default function EcranAnnale({
  annale,
  subject,
  partie,
}: {
  annale: AnnaleCorrigee
  subject: MatiereAnnale
  partie: string | null
}) {
  const matiere = MATIERES_ANNALES[subject]

  const titre = titreEpreuve(annale)
  const coefficient = annale.coefficient ? String(annale.coefficient).replace('.', ',') : null

  return (
    <div className="corrige mx-auto flex w-full max-w-2xl flex-col gap-5 pb-10">
      <EnTetePage
        retour={{ fallback: `/reviser/${subject}?onglet=annales`, label: 'Revenir aux annales' }}
        titre={titre}
        sousTitre={`${matiere.long} · ${lieuDe(annale)}`}
        medaillon={<MedaillonMatiere slug={subject} />}
      />

      {/* LE SUJET OFFICIEL — d'abord : on compose, PUIS on se corrige. */}
      <section aria-labelledby="sujet-officiel" className="carte p-4">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
            <FileText className="size-5.5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="sujet-officiel" className="titre-section">
              Le sujet officiel
            </h2>
            <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-muted-foreground">
              <li className="flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden="true" />
                {formatDuration(annale.dureeMin)}
              </li>
              {coefficient ? (
                <li className="flex items-center gap-1">
                  <Scale className="size-3.5" aria-hidden="true" />
                  Coefficient {coefficient}
                </li>
              ) : null}
              {annale.code ? <li>{annale.code}</li> : null}
            </ul>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/85">{annale.consigne}</p>
        <div className="mt-4 flex gap-2">
          <Button asChild size="lg" className="flex-1">
            <Link href={`/reviser/${subject}/annales/${annale.id}/sujet`}>
              <BookOpenCheck aria-hidden="true" />
              Lire le sujet
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" aria-label="Télécharger le sujet en PDF">
            <a href={pdfSujet(annale.id, { telecharger: true })} download={nomTelechargementSujet(annale.id)}>
              <Download aria-hidden="true" />
              PDF
            </a>
          </Button>
        </div>
      </section>

      <section aria-labelledby="corrige">
        <h2 id="corrige" className="titre-section mb-1">
          Le corrigé Studuel
        </h2>
        <p className="mb-3 text-sm text-muted-foreground">
          {annale.parties.length > 1
            ? 'Choisis la partie que tu as traitée. Compose d’abord, corrige-toi ensuite.'
            : 'Compose d’abord, corrige-toi ensuite.'}
        </p>
        <PartiesCorrige
          initiale={partie}
          parties={annale.parties.map((p) => ({
            id: p.id,
            titre: p.titre,
            contenu: <Partie partie={p} annale={annale} matiere={matiere.court} />,
          }))}
        />
      </section>

      {/* L'annale est une ÉPREUVE (557) : la valider paie XP et gemmes. */}
      <ValiderAnnale annaleId={annale.id} />

      <p className="px-1 text-[11px] leading-relaxed text-muted-foreground">
        Sujet officiel {annale.examen === 'brevet' ? 'du diplôme national du brevet' : 'du baccalauréat'}, ministère de
        l’Éducation nationale. Corrigé rédigé par Studuel.
      </p>
    </div>
  )
}

/**
 * Une partie, composée comme une fiche : les étiquettes (matière · classe,
 * « Tombé au bac 2024 »), le THÈME en titre surligné, l'accroche (nature,
 * points, durée), puis l'énoncé tel que le sujet le pose, « En 30 secondes »
 * en carte jaune, et le corrigé bloc par bloc.
 */
function Partie({ partie, annale, matiere }: { partie: PartieCorrigee; annale: AnnaleCorrigee; matiere: string }) {
  const accroche = [
    libelleNature(partie.nature),
    partie.points ? `${partie.points} points` : null,
    partie.minutes ? `≈ ${formatDuration(partie.minutes)}` : null,
  ]
    .filter(Boolean)
    .join(' · ')
  const session = `${titreEpreuve(annale)}${annale.jour ? ` · jour ${annale.jour}` : ''}`

  return (
    <article className="flex flex-col gap-4">
      <header className="px-0.5">
        <div className="corrige-etiquettes">
          <span className="corrige-pilule corrige-pilule--violet">
            {matiere} · {annale.niveau}
          </span>
          <span className="corrige-pilule corrige-pilule--jaune">★ {session}</span>
          <span className="corrige-mention">Corrigé Studuel</span>
        </div>
        <h3 className="corrige-titre mt-4">
          <span className="corrige-surligne">{partie.theme}</span>
        </h3>
        <p className="corrige-accroche mt-2">{accroche}</p>
      </header>

      {/* L'énoncé, tel que le sujet le pose : c'est lui qu'on relit dix fois. */}
      <div className="corrige-carte corrige-carte--rubanee px-3.5 pb-3.5">
        <span className="corrige-ruban corrige-ruban--coin">
          <b>?</b>
          {partie.titre}
        </span>
        <p className="font-heading text-[17px] leading-snug font-extrabold text-foreground">
          <TexteCorrige texte={partie.enonce} />
        </p>
      </div>

      {/* « En 30 secondes » : la carte jaune d'une fiche (« Sur ta copie »), les
          idées numérotées, les mots qui comptent au surligneur. */}
      <div className="corrige-carte corrige-carte--rubanee px-3.5 pb-3.5" data-teinte="jaune">
        <span className="corrige-ruban corrige-ruban--coin" data-teinte="jaune">
          ★ En 30 secondes
        </span>
        <ol className="flex flex-col gap-2.5">
          {partie.enBref.map((phrase, i) => (
            <li key={i} className="flex gap-3 text-[14.5px] leading-relaxed text-foreground">
              <span className="corrige-num mt-0.5" aria-hidden="true">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 pt-0.5">
                <TexteCorrige texte={phrase} surligne />
              </span>
            </li>
          ))}
        </ol>
      </div>

      <BlocsCorrige blocs={partie.blocs} feuille />
    </article>
  )
}
