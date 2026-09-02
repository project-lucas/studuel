import Link from 'next/link'
import { ArrowLeft, Flame } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import CoachEntete from '@/components/marcel/CoachEntete'
import CoachSuggestions from '@/components/marcel/CoachSuggestions'
import VueHeader from '@/components/marcel/VueHeader'
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
import { countPretes, entrainementsFor } from '@/lib/coach/entrainement'
import { couvertureGlobale } from '@/lib/coach/couverture'
import { parseVue, titreVue } from '@/lib/coach/marcel-vues'

export const metadata = { title: 'Marcel — Studuel' }
export const dynamic = 'force-dynamic'

// L'onglet Marcel — le prof. Il dit POURQUOI et COMMENT ; Réviser reste
// l'endroit OÙ on travaille (le bouton de la mission y renvoie).
//
// L'ACCUEIL EST L'ÉCRAN DU COACH : son nom en logo, une salutation, le
// diagnostic du jour en bulle, le personnage en grand, le rail de ce qu'il sait
// faire, et le champ pour lui parler. Rien n'a été retiré — le point du jour
// détaillé et la séance en trois temps ont leur page (`?vue=mission`), ouverte
// par la première carte du rail. Ce qui change est l'ORDRE : on rencontre
// quelqu'un avant de lire un tableau de bord.
//
// Aucune logique ici : la décision est pure et testée (lib/coach/*), le serveur
// ne fait qu'assembler et afficher. Aucun appel IA au rendu — tout ce qu'on lit
// sur cet écran est déterministe ; seul le champ, à la demande, coûte.

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
    chapitresCouverts,
    slugsExamen,
    oral: oralDescriptif,
    demande,
  } = await getMarcelSnapshot(supabase, user.id)

  // L'échelle de l'oral n'est chargée QUE sur sa vue : c'est deux requêtes de
  // plus, et l'écran d'accueil n'en a aucun besoin.
  const oral = vue === 'oral' ? await getOralSnapshot(supabase, user.id) : null

  // La matière du panneau Méthode : celle de l'URL, sinon celle de la mission du
  // jour, sinon la première que Marcel sait coacher.
  const demandee = matieres.find((m) => m.slug === matiereRaw)
  const courante = demandee ?? matieres[0] ?? null

  // Les entraînements sont dérivés pour la vue « S'entraîner », et leur compte
  // sert de repère sur la carte du rail — même calcul, une seule fois.
  const entrainements = entrainementsFor({ matieres, disponiblesBySlug })
  const titre = titreVue(vue)

  return (
    <div className="pb-6">
      <div className="px-4 pt-2">
        {vue === 'aujourdhui' ? (
          <>
            {/* LA SORTIE. Marcel n'a plus d'onglet : on entre ici par sa tête
                flottante, en bas à droite de Réviser. Sans cette flèche,
                l'accueil du coach est un cul-de-sac — la barre du bas n'y
                montre aucun onglet actif, et il ne reste que le bouton du
                téléphone. Elle renvoie d'où l'on vient, Réviser.

                Vrai lien plutôt que `history.back()`, comme la flèche des
                sous-pages (VueHeader) : arrivé par une notification ou un lien
                partagé, un retour d'historique sortirait de l'app.

                La ligne ne porte plus la date : elle est passée sur la page de
                la mission, où elle veut dire quelque chose (« voilà ton travail
                de ce mardi »). Ici, elle volait la place du logo. */}
            <div className="mx-0.5 mb-1 flex items-start justify-between">
              <Link
                href="/reviser"
                aria-label="Revenir à Réviser"
                className="bg-card text-primary flex size-10 shrink-0 items-center justify-center rounded-full shadow-sm ring-1 ring-black/5 transition active:translate-y-px active:scale-95"
              >
                <ArrowLeft
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={2.6}
                />
              </Link>
              {streak >= 2 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffeed2] px-2.5 py-1 text-xs font-extrabold text-[#b4550c]">
                  <Flame aria-hidden="true" className="size-3.5" />
                  {streak} jours
                </span>
              )}
            </div>

            {/* La salutation est fixe, le diagnostic ne l'est pas : c'est
                `point.titre`, écrit par lib/coach/point-du-jour à partir du
                travail réel. Marcel n'ouvre jamais sur une question vide. */}
            <CoachEntete salut="Salut !" bulle={point.titre} />

            {catalogueVide && (
              <p className="bg-card text-muted-foreground mt-3 rounded-[20px] p-4 text-center text-[13px] leading-relaxed font-semibold">
                Je n’ai pas encore de chapitres pour ta classe. Choisis tes
                matières dans Réviser et je m’occupe du reste.
              </p>
            )}

            <CoachSuggestions
              matiere={point.matiere?.slug ?? courante?.slug}
              stats={{
                mission: `${point.minutes} min`,
                entrainement:
                  entrainements.length > 0
                    ? `${countPretes(entrainements)}/${entrainements.length} prêtes`
                    : undefined,
                progres:
                  couverture.length > 0
                    ? `${couvertureGlobale(couverture)} %`
                    : undefined,
              }}
            />

            <DemanderMarcel
              tier={demande.tier}
              utilisesAujourdhui={demande.utilisesAujourdhui}
              jetons={demande.jetons}
              gemmes={demande.gemmes}
              matieres={matieres.map((m) => ({ slug: m.slug, name: m.name }))}
              matiereParDefaut={point.matiere?.slug ?? null}
            />
          </>
        ) : (
          <>
            {titre ? <VueHeader titre={titre} /> : null}

            {vue === 'mission' ? (
              <>
                <time className="text-muted-foreground mx-0.5 mb-2 block text-[13px] font-extrabold">
                  {dateDuJour()}
                </time>
                <PointDuJourHero point={point} />
                <SeanceCard etapes={point.seance} minutes={point.minutes} />
              </>
            ) : vue === 'methode' ? (
              <MethodePanel matieres={matieres} courante={courante} />
            ) : vue === 'oral' && oral ? (
              <OralPanel snapshot={oral} />
            ) : vue === 'entrainement' ? (
              <EntrainementPanel matieres={entrainements} />
            ) : (
              <ProgresPanel
                chapitres={chapitresCouverts}
                slugsExamen={slugsExamen}
                oral={oralDescriptif}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
