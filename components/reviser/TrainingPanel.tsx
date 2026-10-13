'use client'

import { useState } from 'react'
import { ArrowLeft, Gamepad2 } from 'lucide-react'
import ModeTicket from '@/components/defi/ModeTicket'
import SubjectBossPanel from '@/components/reviser/SubjectBossPanel'
import SubjectGames from '@/components/reviser/SubjectGames'
import NiveauOrthographe from '@/components/francais/NiveauOrthographe'
import NiveauOrthographeCarte from '@/components/francais/NiveauOrthographeCarte'
import { sfx } from '@/lib/sounds'
import { bossForSubject } from '@/lib/bosses'
import { billetDictee, billetGardien } from '@/lib/reviser/billets-matiere'
import type { GardienVue } from '@/lib/reviser/gardien'
import type { ModeQuestion } from '@/lib/defi-modes'

/**
 * Le slug de la matière qui porte le test de niveau en orthographe.
 *
 * Une constante et non un `subject.slug === 'francais'` semé dans le JSX : le
 * jour où l'anglais aura le sien, c'est ici qu'on regardera.
 */
const MATIERE_TEST_NIVEAU = 'francais'

/**
 * L'onglet « Mode de jeu » : tout ce qui se JOUE dans la matière, à un seul
 * endroit — le gardien de la matière, puis les jeux de l'arène.
 *
 * Ce qui s'y trouvait dessous — la liste de tous les chapitres avec leurs
 * pastilles Cours / Quiz / Flashcards / Carte mentale / Défi — a été retiré :
 * c'était le PROGRAMME redit une deuxième fois, plus long que les modes de jeu
 * eux-mêmes, et un dossier à deux disciplines (histoire-géo) l'affichait même
 * sans filtre. Ces formats se trouvent là où on choisit quoi travailler : dans
 * le chapitre, sur l'onglet Programme.
 *
 * Le combat de boss prend TOUT le panneau (l'arène remplace la zone crème) :
 * il vit donc dans une sous-vue, ouverte depuis son billet. C'est ce que
 * l'ancien onglet « Boss » lui offrait — un écran à lui — sans lui coûter un
 * septième onglet dans une barre qui débordait déjà.
 *
 * LE BILLET EST LE MIROIR DE L'ANNEAU. Il était jusqu'ici ouvert en permanence,
 * pendant que « La Traque » soutenait exactement l'inverse : le gardien se
 * débusque en révisant et n'est défiable qu'une heure. Deux portes
 * contradictoires vers le même personnage, dont une qui rendait l'autre
 * décorative. Désormais le billet dit la vérité sur l'état du monde : silhouette
 * et anneau tant qu'il rôde, « Affronter » quand il est sorti. Rien n'est
 * retiré — il n'y a plus qu'une porte.
 */
export default function TrainingPanel({
  subject,
  bossPool,
  gardien,
  premium = false,
}: {
  subject: { slug: string; name: string }
  bossPool: ModeQuestion[]
  /** Abonné Studuel+ : tous les jeux de la matière s'ouvrent. */
  premium?: boolean
  /**
   * L'état du gardien (lib/reviser/gardien) — le MÊME que celui de l'écusson du
   * header. Deux lectures indépendantes de la jauge finiraient par se
   * contredire à l'écran.
   */
  gardien: GardienVue
}) {
  const [fighting, setFighting] = useState(false)
  // Le test de niveau prend le panneau entier, comme le combat de boss : neuf
  // questions sans correction ne se lisent pas dans une carte de trois lignes.
  const [testNiveau, setTestNiveau] = useState(false)
  // La carte porte son propre gardien ; on ne retombe sur le catalogue que
  // lorsque la traque est illisible (migration 212 absente), cas où le billet
  // garde sa forme d'avant.
  const boss = gardien.boss ?? bossForSubject(subject.slug)
  // LE GARDIEN EST UN BILLET (12/10/2026), comme la dictée et les jeux : plus
  // de bouton violet ni de carte blanche à part. Il dit toujours la vérité sur
  // l'état du monde — « rôde » et sa jauge, ou « Affronter ».
  const { billet: billetBoss, ouvert } = billetGardien(subject, boss, gardien)

  if (testNiveau) {
    return <NiveauOrthographe onClose={() => setTestNiveau(false)} />
  }

  if (fighting) {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            sfx.back()
            setFighting(false)
          }}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-semibold shadow-sm transition-transform active:scale-95"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Retour aux modes de jeu
        </button>
        <SubjectBossPanel subjectSlug={subject.slug} pool={bossPool} />
      </div>
    )
  }

  const estFrancais = subject.slug === MATIERE_TEST_NIVEAU

  return (
    <>
      {/* LE TEST DE NIVEAU, AU-DESSUS DES MODES DE JEU (Lucas, 12/10/2026 :
          « évaluer son niveau devra être placé au-dessus des modes de jeu —
          l'idée est valable pour les autres matières ») : ce n'est pas un jeu,
          c'est la mesure qui dit lesquels valent la peine. Seul le français a
          le sien pour l'instant ; les autres matières prendront la même place. */}
      {estFrancais ? <NiveauOrthographeCarte onOpen={() => setTestNiveau(true)} /> : null}

      <section aria-labelledby="jeux-matiere" className="mt-4">
        <p className="text-sm font-semibold text-muted-foreground">Jeux de l’Arène</p>
        <h2 id="jeux-matiere" className="titre-section mt-0.5 flex items-center gap-2">
          <Gamepad2 className="size-5 shrink-0 text-primary" aria-hidden="true" />
          Modes de jeu · {subject.name}
        </h2>

        <div className="mt-3 flex flex-col gap-3">
          {/* LA DICTÉE EN BILLET, français seulement (Lucas, 12/10/2026 :
              « c'est un mode important ») — une carte grisée « bientôt » dans
              les autres dossiers serait une porte qui ne s'ouvre pas. */}
          {estFrancais ? <ModeTicket ticket={billetDictee()} /> : null}

          {/* LE GARDIEN EN BILLET : il ouvre le combat sur place quand il est
              sorti ; tant qu'il rôde, le billet montre sa jauge et le geste
              suivant, et ne mène nulle part (toucher ne fait rien de faux). */}
          <ModeTicket
            ticket={billetBoss}
            onClick={
              ouvert
                ? () => setFighting(true)
                : () => {
                    // Il rôde : rien à ouvrir. Le billet dit déjà quoi faire.
                  }
            }
          />

          <SubjectGames subject={subject} premium={premium} enTete={false} />
        </div>
      </section>
    </>
  )
}
