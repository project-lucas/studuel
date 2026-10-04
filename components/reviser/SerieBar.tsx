'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { CalendarDays, Plus } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { quandLaScenePrete } from '@/lib/scene-prete'
import { subjectTheme } from '@/lib/subject-style'
import YearHistory from '@/components/YearHistory'
import FlammeAnimee from '@/components/FlammeAnimee'
import AddExamSheet, {
  type SubjectLite,
  type ChapterLite,
} from '@/components/AddExamSheet'
import { addDays, type Controle, type ControleSubjectMeta } from '@/lib/prep-plan'
import SemaineFlammes from '@/components/reviser/SemaineFlammes'
import { avantPalierSuivant, nomPalier } from '@/lib/flamme-serie'

export type WeekDay = { done: boolean; isToday: boolean; isFuture: boolean; gele?: boolean }

// Le marqueur « la validation du jour a déjà été jouée », par jour : elle ne
// se joue qu'une fois, la première fois qu'on revoit la semaine avec le jour
// fait. Les autres visites du jour montrent la coche, posée. Le « 2 » de la
// clé : la première version posait le marqueur alors que l'animation tournait
// derrière le rideau de chargement — ces marqueurs-là ne comptent plus.
const cleValidation = (today: string) => `studuel:serie:validee:2:${today}`

// `?fete=1` rejoue la validation quel que soit le marqueur : pour la voir
// autant de fois qu'on veut (réglages, démonstration, relecture).
const rejouerDemande = () =>
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('fete') === '1'

// Les 7 clés UTC de la semaine courante (lundi → dimanche) — même définition
// que weekProgress (lundi = 0).
function weekDatesOf(today: string): string[] {
  const t = Date.parse(`${today}T00:00:00Z`)
  const dow = Number.isNaN(t) ? 0 : new Date(t).getUTCDay()
  const mondayOffset = (dow + 6) % 7
  const monday = addDays(today, -mondayOffset)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

/**
 * LA barre du haut de Réviser : la série, la semaine, l'historique, et le
 * bouton qui annonce un contrôle. Elle remplace la carte violette « Mission du
 * jour », qui empilait sur un même bloc la mission, l'objectif éditable, la
 * semaine, le lien vers Marcel et l'historique — cinq objets à comprendre avant
 * d'apercevoir la première matière.
 *
 * Ici, trois choses seulement : où j'en suis (la flamme + les 7 jours), tout mon
 * historique (le bouton agenda), et le seul geste d'organisation qui compte
 * depuis cet écran (« + Contrôle », qui ouvre la même feuille qu'avant).
 *
 * Les jours portant un contrôle DATÉ prennent une pastille à la couleur de la
 * matière : la semaine dit ce qui arrive, pas seulement ce qui est fait.
 */
export default function SerieBar({
  streak,
  week,
  today,
  activeDays = [],
  controles,
  subjectMeta,
  subjects,
  chaptersBySubject = {},
  existingExamChapters = [],
  goalMinutes,
  gelsEnReserve = 0,
  carnetSlot,
}: {
  streak: number
  week: WeekDay[]
  today: string
  activeDays?: string[]
  controles: Controle[]
  subjectMeta: Record<string, ControleSubjectMeta>
  subjects: SubjectLite[]
  chaptersBySubject?: Record<string, ChapterLite[]>
  existingExamChapters?: string[]
  goalMinutes: number
  /** Gels de série en réserve (0 à 2) : un glaçon posé sur la flamme. */
  gelsEnReserve?: number
  /**
   * La porte de « Mon carnet », SOUS la semaine (Lucas, 17/09/2026 : « Mon
   * carnet va dans le bloc semaine, dans le bloc blanc en dessous de samedi
   * dimanche »). Elle vivait sur la ligne du titre, à côté de la classe.
   */
  carnetSlot?: ReactNode
}) {
  const [historyOpen, setHistoryOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  const weekDates = weekDatesOf(today)

  // Jour portant un contrôle daté → pastille de la couleur de la matière (le
  // premier contrôle trouvé ce jour-là donne la teinte et le nom).
  const examByDate = new Map<string, { color: string; name: string }>()
  for (const c of controles) {
    if (!c.date || examByDate.has(c.date)) continue
    const meta = subjectMeta[c.subject]
    examByDate.set(c.date, {
      color: meta?.color ?? 'blue',
      name: meta?.name ?? c.subject,
    })
  }

  // La même chose, avec la classe de couleur prête pour le repère sous le jour.
  const examFlammes = new Map(
    [...examByDate].map(([date, e]) => [date, { barClass: subjectTheme(e.color).bar, name: e.name }]),
  )

  const todayDone = week.some((d) => d.isToday && d.done)
  // Le prochain palier de la flamme (lib/flamme-serie) : c'est lui qu'on dit
  // une fois le jour fait — la raison de revenir demain.
  const suivant = avantPalierSuivant(streak)
  const subline =
    streak > 0
      ? todayDone
        ? suivant
          ? `Encore ${suivant.jours} jour${suivant.jours > 1 ? 's' : ''} pour la ${nomPalier(suivant.palier)}.`
          : 'Flamme bleue : reviens demain pour la garder.'
        : 'Travaille un peu aujourd’hui pour la garder.'
      : 'Une session aujourd’hui, et la flamme repart.'

  // LA VALIDATION DU JOUR (Lucas, 22/09/2026 ; en flammes depuis le
  // 04/10/2026). La première fois qu'on revoit la semaine avec le jour fait —
  // au retour du quiz, de la leçon, de la dictée —, la flamme du jour JAILLIT
  // (plus haut, plus fort que les autres, avec une onde) et le carillon de la
  // journée sonne (SemaineFlammes). Les visites suivantes la montrent posée :
  // un marqueur local par jour s'en souvient. Décidé APRÈS montage, jamais au
  // rendu : le serveur ne connaît pas le marqueur, et un écart d'hydratation
  // sur la barre la plus regardée de l'écran se verrait.
  //
  // ET SEULEMENT QUAND LA SCÈNE EST PRÊTE (lib/scene-prete) : rideau de
  // chargement parti, onglet visible. Jouée dès l'hydratation, l'animation se
  // déroulait derrière le rideau et l'élève ne voyait que la coche posée. Le
  // marqueur n'est posé qu'au moment où l'animation part vraiment : une
  // validation jamais vue n'est pas une validation fêtée.
  const [validation, setValidation] = useState(false)
  useEffect(() => {
    if (!todayDone) return
    const cle = cleValidation(today)
    const rejouer = rejouerDemande()
    try {
      if (!rejouer && window.localStorage.getItem(cle)) return
    } catch {
      // Stockage illisible : on fête, une fois par affichage.
    }
    return quandLaScenePrete(() => {
      try {
        window.localStorage.setItem(cle, '1')
      } catch {
        // Stockage indisponible : la fête aura lieu, elle ne sera pas mémorisée.
      }
      setValidation(true)
      sfx.dayComplete()
    })
  }, [todayDone, today])

  return (
    <section
      aria-label="Ta série"
      className="carte p-3.5"
    >
      {/* Ligne du haut : la flamme et son compte à gauche, les deux commandes
          à droite (mon historique · annoncer un contrôle). */}
      <div className="flex items-center gap-3">
        {/* La flamme animée, sans tuile derrière : elle porte son propre
            cerne sombre, un fond coloré ne ferait que la répéter. Série à
            zéro = flamme éteinte (désaturée, en retrait) plutôt qu'absente :
            c'est la même place, à rallumer. */}
        {/* LA RÉSERVE DE GELS (04/10/2026) : un glaçon posé au pied de la
            flamme, « ×2 » s'il y en a deux — comme Duolingo. Il mène au
            Marché, où le gel se rachète. Sans gel, rien : pas de pastille
            vide qui ferait la morale. */}
        <div className="relative shrink-0">
          <FlammeAnimee
            className="size-12"
            eteinte={streak === 0}
            vive
            serie={streak}
          />
          {gelsEnReserve > 0 ? (
            <Link
              href="/tresor#marche"
              onClick={() => sfx.tap()}
              aria-label={`${gelsEnReserve} gel${gelsEnReserve > 1 ? 's' : ''} de série en réserve : ta série est protégée`}
              className="absolute -right-1.5 -bottom-1 flex items-center rounded-full bg-card pr-1 shadow-sm ring-1 ring-border"
            >
              <img
                src="/images/serie/jour-gele.webp"
                alt=""
                aria-hidden="true"
                width={128}
                height={128}
                draggable={false}
                className="size-5"
              />
              {gelsEnReserve > 1 ? (
                <span className="font-heading text-[10px] leading-none font-extrabold text-foreground">
                  ×{gelsEnReserve}
                </span>
              ) : null}
            </Link>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-heading text-base leading-tight font-extrabold text-foreground">
            {streak > 0
              ? `${streak} jour${streak > 1 ? 's' : ''} de série`
              : 'Pas encore de série'}
          </p>
          <p className="truncate text-[11px] font-semibold text-muted-foreground">
            {subline}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setHistoryOpen(true)
          }}
          aria-haspopup="dialog"
          aria-label="Voir tout mon historique de travail"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted/70 text-primary transition active:translate-y-px"
        >
          <CalendarDays className="size-5" strokeWidth={2.3} aria-hidden="true" />
        </button>

        {/* « NOUVEAU CONTRÔLE ? » — LA fonction clé de l'écran, et elle doit
            se voir comme telle (Lucas, 16/09). Le bouton a été « + Contrôle »,
            discret exprès pour laisser la carte violette mener l'œil ; mais
            un élève qui n'annonce pas son contrôle n'a ni plan de révision, ni
            carte, ni compte à rebours : c'est le geste qui déclenche tout le
            reste. D'où le libellé en QUESTION, qui s'adresse à lui, et UN
            mouvement continu : la respiration (`controle-appel`, globals.css),
            une pulsation d'échelle et un halo violet qui s'écarte — le seul
            bouton de l'accueil qui bouge. Il a porté aussi la bande de lumière
            `attract-sheen` (celle qui traversait le DUEL de l'arène) ; retirée
            le 16/09 (Lucas : « elle s'arrête au milieu, c'est bof — garde les
            ombres, pas la bande »). Le halo reste : il désigne le bouton par
            son POURTOUR sans rien poser sur le mot. */}
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setAddOpen(true)
          }}
          aria-haspopup="dialog"
          aria-label="Annoncer un nouveau contrôle"
          className="controle-appel font-heading flex min-h-11 shrink-0 items-center gap-1 rounded-full border-b-[3px] border-b-black/25 bg-primary pr-3.5 pl-2.5 text-xs font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px active:border-b-0"
        >
          <Plus className="size-4" strokeWidth={2.8} aria-hidden="true" />
          Nouveau contrôle&nbsp;?
        </button>
      </div>

      {/* LA SEMAINE EN FLAMMES (04/10/2026, Lucas : « il faut trouver autre
          chose — le côté animation, une animation particulière s'il est en
          série et s'il a fait une semaine parfaite »). Les pastilles violettes
          cochées sont parties : flammes, braises, mèche qui relie la série,
          semaine parfaite en or — components/reviser/SemaineFlammes. */}
      <div className="mt-3">
        <SemaineFlammes
          week={week}
          weekDates={weekDates}
          streak={streak}
          validation={validation}
          examByDate={examFlammes}
        />
      </div>

      {carnetSlot ? <div className="mt-3">{carnetSlot}</div> : null}

      {historyOpen ? (
        <YearHistory
          activeDays={activeDays}
          today={today}
          onClose={() => setHistoryOpen(false)}
        />
      ) : null}

      {addOpen ? (
        <AddExamSheet
          subjects={subjects}
          chaptersBySubject={chaptersBySubject}
          existing={new Set(existingExamChapters)}
          today={today}
          goalMinutes={goalMinutes}
          onClose={() => setAddOpen(false)}
        />
      ) : null}
    </section>
  )
}
