import Link from 'next/link'
import { Flame, GraduationCap } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import MarcelSegments, { parseVue } from '@/components/marcel/MarcelSegments'
import PointDuJourHero from '@/components/marcel/PointDuJourHero'
import SeanceCard from '@/components/marcel/SeanceCard'
import MethodePanel from '@/components/marcel/MethodePanel'
import EntrainementPanel from '@/components/marcel/EntrainementPanel'
import OralPanel from '@/components/marcel/OralPanel'
import ProgresPanel from '@/components/marcel/ProgresPanel'
import DemanderMarcel from '@/components/marcel/DemanderMarcel'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { getMarcelSnapshot } from '@/lib/coach/marcel-server'
import { getOralSnapshot } from '@/lib/coach/oral-server'
import { entrainementsFor } from '@/lib/coach/entrainement'

export const metadata = { title: 'Marcel — Studuel' }
export const dynamic = 'force-dynamic'

// L'onglet Marcel — le prof. Il dit POURQUOI et COMMENT ; Réviser reste
// l'endroit OÙ on travaille (le bouton du point du jour y renvoie).
//
// Aucune logique ici : la décision est pure et testée (lib/coach/*), le serveur
// ne fait qu'assembler et afficher. Aucun appel IA sur cet écran — tout ce qu'on
// y lit est déterministe.

const JOURS = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
]
const MOIS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]

function dateDuJour(): string {
  const now = new Date()
  return `${JOURS[now.getDay()]} ${now.getDate()} ${MOIS[now.getMonth()]}`
}

export default async function MarcelPage({
  searchParams,
}: {
  searchParams: Promise<{ vue?: string; matiere?: string }>
}) {
  const { vue: vueRaw, matiere: matiereRaw } = await searchParams
  const vue = parseVue(vueRaw)

  const user = await getCurrentUser()
  if (!user) {
    return (
      <div>
        <PageHeader title="Marcel" description="Ton prof" />
        <div className="p-4">
          <p className="bg-card text-muted-foreground rounded-[20px] p-5 text-center text-[13px] leading-relaxed font-semibold">
            Connecte-toi pour que je puisse regarder ton travail.
          </p>
          <Link
            href="/login"
            className="font-heading bg-primary text-primary-foreground mt-3 flex min-h-12 items-center justify-center rounded-2xl px-4 font-extrabold shadow-[0_4px_0_color-mix(in_oklch,var(--primary),black_28%)]"
          >
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const {
    point,
    matieres,
    streak,
    catalogueVide,
    disponiblesBySlug,
    couverture,
    demande,
  } = await getMarcelSnapshot(supabase, user.id)

  // L'échelle de l'oral n'est chargée QUE sur sa vue : c'est deux requêtes de
  // plus, et l'écran « Aujourd'hui » n'en a aucun besoin.
  const oral = vue === 'oral' ? await getOralSnapshot(supabase, user.id) : null

  // La matière du panneau Méthode : celle de l'URL, sinon celle de la mission du
  // jour, sinon la première que Marcel sait coacher.
  const demandee = matieres.find((m) => m.slug === matiereRaw)
  const courante = demandee ?? matieres[0] ?? null

  return (
    <div className="pb-6">
      <div className="px-4 pt-2">
        {/* Pas de titre « Marcel » : l'onglet actif le dit déjà, et ces 40 px
            servent mieux au contenu. */}
        <div className="mx-0.5 mt-1 mb-2 flex items-center justify-between">
          <time className="text-[13px] font-extrabold">{dateDuJour()}</time>
          {streak >= 2 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffeed2] px-2.5 py-1 text-xs font-extrabold text-[#b4550c]">
              <Flame aria-hidden="true" className="size-3.5" />
              {streak} jours
            </span>
          )}
        </div>

        <MarcelSegments vue={vue} matiere={courante?.slug} />

        {vue === 'aujourdhui' ? (
          <>
            <PointDuJourHero point={point} />
            <SeanceCard etapes={point.seance} minutes={point.minutes} />

            {catalogueVide && (
              <p className="bg-card text-muted-foreground mt-3 rounded-[20px] p-4 text-center text-[13px] leading-relaxed font-semibold">
                Je n’ai pas encore de chapitres pour ta classe. Choisis tes
                matières dans Réviser et je m’occupe du reste.
              </p>
            )}

            {/* Le pont vers la méthode : le « comment » de la matière du jour,
                à un tap. Un lien utile plutôt qu'une promesse en pointillés —
                l'entrée IA viendra ici, en dernier et volontairement. */}
            {point.regime && point.matiere && (
              <Link
                href={`/marcel?vue=methode&matiere=${point.matiere.slug}`}
                className="text-primary mt-4 flex min-h-12 items-center justify-center gap-2 rounded-[17px] border-[1.5px] border-dashed border-[color-mix(in_oklch,var(--primary),transparent_62%)] bg-white/60 px-3 text-center text-[13px] font-bold"
              >
                <GraduationCap aria-hidden="true" className="size-4" />
                Comment on travaille {point.matiere.name} ?
              </Link>
            )}

            {/* L'IA en dernier : Marcel est d'abord un repère de méthode. */}
            <DemanderMarcel
              tier={demande.tier}
              utilisesAujourdhui={demande.utilisesAujourdhui}
              jetons={demande.jetons}
              gemmes={demande.gemmes}
              matiereSlug={point.matiere?.slug ?? null}
              matiereName={point.matiere?.name ?? null}
            />
          </>
        ) : vue === 'methode' ? (
          <MethodePanel matieres={matieres} courante={courante} />
        ) : vue === 'oral' && oral ? (
          <OralPanel snapshot={oral} />
        ) : vue === 'entrainement' ? (
          <EntrainementPanel
            matieres={entrainementsFor({ matieres, disponiblesBySlug })}
          />
        ) : (
          <ProgresPanel couverture={couverture} />
        )}
      </div>
    </div>
  )
}
