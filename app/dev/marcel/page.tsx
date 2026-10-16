import { notFound } from 'next/navigation'
import DemanderMarcel from '@/components/marcel/DemanderMarcel'
import { CoachFilProvider } from '@/components/marcel/CoachFil'
import Bureau from '@/components/marcel/bureau/Bureau'
import EnTeteBureau from '@/components/marcel/bureau/EnTeteBureau'
import PanneauAujourdhui from '@/components/marcel/bureau/PanneauAujourdhui'
import PanneauRadar from '@/components/marcel/bureau/PanneauRadar'
import PanneauToi from '@/components/marcel/bureau/PanneauToi'
import PanneauOutils from '@/components/marcel/bureau/PanneauOutils'
import { construireProfil } from '@/lib/coach/profil-eleve'
import { remarquesDe } from '@/lib/coach/remarques'
import { CREDITS_MENSUELS } from '@/lib/coach/credits'
import { couvertureFor, type ChapitreCouvert } from '@/lib/coach/couverture'
import { bulleDuJour, decorDuMoment, parseOnglet, poseDuMoment, seanceDuJour, type ControleBureau } from '@/lib/coach/bureau'
import { normaliserIdentite } from '@/lib/coach/carnet-marcel'
import type { Mission } from '@/lib/mission'
import type { Tier } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

// L'APERÇU DE MARCEL — en développement seulement, sans base ni compte.
//
//   /dev/marcel                  un abonné éveillé, le bureau sur « Aujourd'hui »
//   /dev/marcel?onglet=radar     un onglet (aujourdhui, radar, toi, outils)
//   /dev/marcel?heure=21         la séance express (15 h, 18 h, 21 h…)
//   /dev/marcel?etat=gratuit     le gratuit : bureau offert, outils couronnés
//   /dev/marcel?etat=fatigue     il bâille (12 crédits, aucune recharge)
//   /dev/marcel?etat=endormi     il dort jusqu'au 1er, « Recharger Marcel »
//   /dev/marcel?etat=repos       le plafond du jour (50 appels)
//   /dev/marcel?toi=vide         la première rencontre pas encore faite
// Envoyer une question appelle la vraie action : sans session, elle refuse.
const ETATS: Record<string, { tier: Tier; depenses: number; jetons: number; utilises: number }> = {
  eveille: { tier: 'tier1', depenses: 25, jetons: 0, utilises: 3 },
  fatigue: { tier: 'tier1', depenses: CREDITS_MENSUELS - 12, jetons: 0, utilises: 3 },
  endormi: { tier: 'tier1', depenses: CREDITS_MENSUELS, jetons: 0, utilises: 3 },
  repos: { tier: 'tier1', depenses: 20, jetons: 0, utilises: 50 },
  gratuit: { tier: 'free', depenses: 0, jetons: 0, utilises: 0 },
}

const AUJOURDHUI = '2026-10-16'

const m = (chapterId: string, chapterTitle: string, extra: Partial<Mission> = {}): Mission => ({
  kind: 'reprise',
  subjectSlug: 'maths',
  subjectName: 'Mathématiques',
  chapterId,
  chapterTitle,
  minutes: 5,
  progress: 0.42,
  countdown: null,
  controleId: null,
  isNew: false,
  ...extra,
})

const PLAN = {
  mission: m('frac', 'Diviser des fractions', { kind: 'controle', countdown: 'J-3', progress: null }),
  ensuite: [
    m('plur', 'Le pluriel des noms', { subjectSlug: 'francais', subjectName: 'Français', progress: 0.38 }),
    m('pui', 'Puissances de 10', { kind: 'decouverte', isNew: true, progress: 0, minutes: 6 }),
    m('volc', 'Les volcans', { subjectSlug: 'svt', subjectName: 'SVT', progress: 0.55 }),
  ],
  autresControles: [],
}

const CONTROLES: ControleBureau[] = [
  { matiere: 'Mathématiques', slug: 'maths', chapitreId: 'frac', dans: 3, chapitres: ['Diviser des fractions', 'Puissances de 10'], pret: 62 },
  { matiere: 'Histoire-Géographie', slug: 'histoire-geo', chapitreId: 'rev', dans: 8, chapitres: ['La Révolution française'], pret: 31 },
  { matiere: 'Anglais', slug: 'anglais', chapitreId: null, dans: 12, chapitres: ['Le prétérit'], pret: 84 },
]

const c = (id: string, titre: string, slug: string, nom: string, state: ChapitreCouvert['state'], value: number): ChapitreCouvert => ({
  chapterId: id, chapterTitle: titre, subjectSlug: slug, subjectName: nom, state, value, vuEnCours: true,
})
const COUVERTS: ChapitreCouvert[] = [
  c('a', 'Pythagore', 'maths', 'Mathématiques', 'maitrise', 0.9),
  c('frac', 'Diviser des fractions', 'maths', 'Mathématiques', 'fragile', 0.3),
  c('pui', 'Puissances de 10', 'maths', 'Mathématiques', 'en_cours', 0.5),
  c('plur', 'Le pluriel des noms', 'francais', 'Français', 'fragile', 0.38),
  c('acc', 'L’accord du participe', 'francais', 'Français', 'en_cours', 0.45),
  c('volc', 'Les volcans', 'svt', 'SVT', 'maitrise', 0.85),
  c('cell', 'La cellule', 'svt', 'SVT', 'en_cours', 0.66),
  c('rev', 'La Révolution française', 'histoire-geo', 'Histoire-Géographie', 'fragile', 0.33),
]

const MATIERES = [
  { slug: 'maths', name: 'Mathématiques' },
  { slug: 'francais', name: 'Français' },
  { slug: 'svt', name: 'SVT' },
  { slug: 'histoire-geo', name: 'Histoire-Géographie' },
  { slug: 'anglais', name: 'Anglais' },
]

export default async function ApercuMarcel({
  searchParams,
}: {
  searchParams: Promise<{ etat?: string; onglet?: string; heure?: string; toi?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { etat = 'eveille', onglet, heure: heureRaw = '16', toi } = await searchParams
  const e = ETATS[etat] ?? ETATS.eveille
  const ouvert = e.tier !== 'free'
  const heure = Math.max(0, Math.min(23, Number(heureRaw) || 16))

  const profil = construireProfil({
    classe: '4e',
    aujourdhui: AUJOURDHUI,
    objectifMinutes: 20,
    serie: 4,
    controles: [{ matiere: 'Mathématiques', date: '2026-10-19', chapitres: ['Diviser des fractions'] }],
    chapitres: COUVERTS.map((x) => ({ titre: x.chapterTitle, matiere: x.subjectName, etat: x.state, valeur: x.value })),
    examen: null,
  })
  const remarques = remarquesDe(profil, (nom) => MATIERES.find((x) => x.name === nom)?.slug ?? null)
  const identite = toi === 'vide' ? {} : normaliserIdentite({ passion: 'hand', preferee: 'svt', beteNoire: 'maths', objectif: 'moyenne', moment: 'soir' })
  const notes = [
    { id: 'n1', texte: 'Tu as peur de l’oral, surtout en anglais', creeLe: '2026-10-13T18:00:00Z' },
    { id: 'n2', texte: 'Ta prof de maths note sévèrement la rédaction', creeLe: '2026-10-09T18:00:00Z' },
    { id: 'n3', texte: 'Exposé sur les volcans le 28 octobre', creeLe: '2026-10-15T18:00:00Z' },
  ]
  const credits = ouvert ? CREDITS_MENSUELS - e.depenses + e.jetons : null

  return (
    <div className="px-4 pt-2">
      <CoachFilProvider>
        <div className="flex h-[calc(100dvh-10.5rem)] min-h-[26rem] flex-col">
          <EnTeteBureau bulle={bulleDuJour(heure, CONTROLES[0], AUJOURDHUI)} decor={decorDuMoment(heure)} pose={poseDuMoment(heure)} avecHistorique={false} />
          <DemanderMarcel
            tier={e.tier}
            utilisesAujourdhui={e.utilises}
            depensesMois={e.depenses}
            jetons={e.jetons}
            matieres={MATIERES}
            matiereParDefaut="maths"
            vision={false}
            bureau={
              <Bureau
                initial={parseOnglet(onglet)}
                panneaux={{
                  aujourdhui: (
                    <PanneauAujourdhui seance={seanceDuJour(PLAN, heure)} controle={CONTROLES[0]} aujourdhui={AUJOURDHUI} ouvert={ouvert} />
                  ),
                  radar: (
                    <PanneauRadar
                      controles={CONTROLES}
                      couverture={couvertureFor(COUVERTS)}
                      forts={profil.pointsForts}
                      faibles={profil.pointsFaibles}
                      remarques={remarques}
                      aujourdhui={AUJOURDHUI}
                    />
                  ),
                  toi: (
                    <PanneauToi
                      identite={identite}
                      notes={ouvert ? notes : []}
                      matieres={MATIERES}
                      ouvert={ouvert}
                      carnetPret={false}
                      maintenant="2026-10-16T18:00:00Z"
                    />
                  ),
                  outils: <PanneauOutils ouvert={ouvert} credits={credits} />,
                }}
              />
            }
          />
        </div>
      </CoachFilProvider>
    </div>
  )
}
