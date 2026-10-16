import { notFound } from 'next/navigation'
import ConsoleShell from '@/components/console/ConsoleShell'
import TableauInsights from '@/components/console/insights/TableauInsights'
import Compositeur from '@/components/console/diffusion/Compositeur'
import Historique from '@/components/console/diffusion/Historique'
import Resultats from '@/components/console/diffusion/Resultats'
import TriDuMatin from '@/components/coach/TriDuMatin'
import ActiviteCarte from '@/components/coach/fiche/ActiviteCarte'
import AssistantCarte from '@/components/coach/fiche/AssistantCarte'
import FicheEntreeCarte from '@/components/coach/fiche/FicheEntreeCarte'
import NotesCarte from '@/components/coach/fiche/NotesCarte'
import ObjectifCarte from '@/components/coach/fiche/ObjectifCarte'
import GestionCoachs from '@/components/console/coachs/GestionCoachs'
import { annonceAuteurDepuis } from '@/lib/annonces/annonces'
import { FICHE_VIDE } from '@/lib/coach/suivi'
import { insightsDepuis } from '@/lib/insights/insights'

export const dynamic = 'force-dynamic'

/**
 * L'APERÇU DE LA CONSOLE — développement seulement, sans compte ni base :
 *   /dev/console?vue=insights   (défaut) le tableau des insights
 *   /dev/console?vue=diffusion  le compositeur et l'historique
 *   /dev/console?vue=resultats  les résultats d'un sondage
 *   /dev/console?vue=tri        le tri du matin
 *   /dev/console?vue=fiche      les cartes de la fiche d'un élève
 *   /dev/console?vue=coachs     la gestion des coachs
 */
function graine(n: number) {
  let s = n * 2654435761
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 10_000) / 10_000
  }
}

function insightsFictifs() {
  const r = graine(7)
  const auj = new Date('2026-10-16T12:00:00Z')
  const jours = Array.from({ length: 30 }, (_, k) => {
    const d = new Date(auj.getTime() - (29 - k) * 86_400_000).toISOString().slice(0, 10)
    const we = [0, 6].includes(new Date(`${d}T12:00:00Z`).getUTCDay())
    return { jour: d, inscrits: Math.round(r() * 12), actifs: Math.round((we ? 60 : 110) + r() * 40 + k * 2), minutes: Math.round(1800 + r() * 900), quiz: Math.round(200 + r() * 120) }
  })
  return insightsDepuis({
    periode: { jours: 30, depuis: jours[0].jour, jusqua: jours[29].jour },
    audience: { comptes: 1284, eleves: 1102, parents: 168, coachs: 14, plus: 97, nouveaux: 214, nouveaux_avant: 151 },
    classes: [{ classe: '3e', n: 312 }, { classe: 'Tle', n: 241 }, { classe: '1re', n: 198 }, { classe: '4e', n: 121 }, { classe: '2de', n: 99 }, { classe: '5e', n: 70 }, { classe: '6e', n: 52 }, { classe: '?', n: 9 }],
    jours,
    actifs: { jour: 141, semaine: 402, mois: 688, periode: 688 },
    temps: { minutes: 64210, eleves: 640, jours_eleve: 4120 },
    fonctionnalites: [
      { source: 'quiz', n: 6120, eleves: 520, xp: 91000 },
      { source: 'jeu', n: 3410, eleves: 410, xp: 12000 },
      { source: 'lecon', n: 2980, eleves: 455, xp: 29800 },
      { source: 'duel', n: 1860, eleves: 230, xp: 26000 },
      { source: 'revision', n: 1210, eleves: 190, xp: 4800 },
      { source: 'traque', n: 340, eleves: 120, xp: 15300 },
      { source: 'defi_jour', n: 290, eleves: 160, xp: 8700 },
      { source: 'quests', n: 2200, eleves: 380, xp: 66000 },
      { source: 'encyclo', n: 140, eleves: 48, xp: 700 },
      { source: 'annale', n: 22, eleves: 18, xp: 3300 },
    ],
    fonctionnalites_avant: { quiz: 4800, jeu: 3900, lecon: 2100, duel: 1700, revision: 1300, traque: 120, quests: 2000, encyclo: 160, annale: 10 },
    matieres: [
      { matiere: 'Maths', sessions: 1890, eleves: 402, score: 0.58 },
      { matiere: 'Histoire-Géo', sessions: 1210, eleves: 310, score: 0.71 },
      { matiere: 'Français', sessions: 1102, eleves: 298, score: 0.66 },
      { matiere: 'SVT', sessions: 640, eleves: 190, score: 0.74 },
      { matiere: 'Anglais', sessions: 590, eleves: 171, score: 0.69 },
      { matiere: 'Physique-Chimie', sessions: 488, eleves: 140, score: 0.52 },
    ],
    lecons: [{ matiere: 'Maths', lectures: 980, eleves: 300 }, { matiere: 'Français', lectures: 720, eleves: 260 }, { matiere: 'Histoire-Géo', lectures: 690, eleves: 240 }],
    jeux: [{ jeu: 'capitales', parties: 1200, eleves: 260, victoires: 700 }, { jeu: 'calcul-mental', parties: 940, eleves: 210, victoires: 400 }, { jeu: 'anatomie-express', parties: 310, eleves: 90, victoires: 150 }],
    modes: [{ mode: 'blitz', parties: 420, eleves: 120 }, { mode: 'survie', parties: 260, eleves: 80 }],
    marcel: [{ mode: 'question', appels: 1480, eleves: 70 }, { mode: 'fiche', appels: 220, eleves: 40 }, { mode: 'exercice', appels: 160, eleves: 31 }],
    heures: Array.from({ length: 24 }, (_, h) => ({ h, n: Math.round(h < 7 ? 5 : h < 12 ? 120 + r() * 60 : h < 17 ? 200 + r() * 80 : h < 22 ? 380 + r() * 160 : 60) })),
    semaine: [1, 2, 3, 4, 5, 6, 7].map((j) => ({ j, n: j >= 6 ? 900 : 1500 + Math.round(r() * 300) })),
    achats: { fiches: 184, capsules: 21, demandes_plus: 6, annales_commencees: 44, annales_terminees: 18 },
    gemmes: [{ source: 'epreuve', gemmes: 1240, eleves: 140 }, { source: 'traque_win', gemmes: 980, eleves: 120 }],
  })!
}

export default async function DevConsole({ searchParams }: { searchParams: Promise<{ vue?: string }> }) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { vue = 'insights' } = await searchParams

  let contenu: React.ReactNode
  if (vue === 'diffusion' || vue === 'resultats') {
    const annonces = [
      annonceAuteurDepuis({ id: 'a1', type: 'sondage', titre: 'Ton avis sur Studuel', segment: 'eleves', classes: ['3e', 'Tle'], vues: 412, reponses: 168, push: true, push_envoye_le: '2026-10-15T08:00:00Z', moi: true, cree_le: '2026-10-15T08:00:00Z', expire_le: '2026-10-29T08:00:00Z' }),
      annonceAuteurDepuis({ id: 'a2', type: 'message', titre: 'Les annales 2026 sont arrivées', segment: 'tous', vues: 930, clics: 210, moi: true, cree_le: '2026-10-10T08:00:00Z', expire_le: '2026-10-12T08:00:00Z' }),
      annonceAuteurDepuis({ id: 'a3', type: 'message', titre: 'Objectif 2 h cette semaine', segment: 'groupe', groupe: 'U15', vues: 21, clics: 0, moi: false, auteur: 'Coach Ana', cree_le: '2026-10-14T08:00:00Z', expire_le: '2026-10-28T08:00:00Z' }),
    ]
    contenu =
      vue === 'resultats' ? (
        <Resultats
          annonce={annonces[0]}
          anonyme={false}
          questions={[
            { id: 'q1', type: 'choix', libelle: 'Ta matière préférée sur Studuel ?', options: ['Maths', 'Français', 'Histoire-Géo', 'SVT'] },
            { id: 'q2', type: 'note', libelle: 'Tu recommanderais Studuel à un ami ?' },
            { id: 'q3', type: 'texte', libelle: 'Une fonctionnalité qui te manque ?' },
          ]}
          reponses={Array.from({ length: 24 }, (_, k) => ({
            reponses: { q1: ['Maths', 'Français', 'Histoire-Géo', 'SVT'][k % 4 === 3 ? 0 : k % 3], q2: (k % 5) + 1, ...(k % 4 === 0 ? { q3: ['Des duels entre classes', 'Un mode révision du brevet', 'Plus de jeux en anglais'][k % 3] } : {}) },
            creeLe: '2026-10-15T09:00:00Z',
            prenom: ['Léa', 'Noa', 'Inès', 'Malo'][k % 4],
            classe: '3e',
          }))}
        />
      ) : (
        <div className="flex flex-col gap-8">
          <Compositeur admin groupes={[{ id: 'g1', nom: 'U15' }]} typeInitial="sondage" />
          <Historique annonces={annonces} admin />
        </div>
      )
  } else if (vue === 'tri') {
    contenu = (
      <TriDuMatin
        cleConfiguree
        initial={{
          synthese: 'Le groupe tient bien (61 % actifs cette semaine), mais 6 élèves de 3e décrochent avant les contrôles de novembre. Deux élèves progressent nettement en maths.',
          total: 72,
          creeLe: '2026-10-16T07:05:00Z',
          eleves: [
            { code: 'E1', eleveId: 'x1', prenom: 'Sofiane', urgence: 'haute', raison: 'Aucune activité depuis 11 jours, alors qu’il travaillait 2 h par semaine en septembre.', action: 'L’appeler ou écrire aujourd’hui.', message: 'Salut Sofiane ! On ne t’a pas vu depuis un moment. 10 minutes ce soir sur les fractions ? Je suis là si besoin.' },
            { code: 'E2', eleveId: 'x2', prenom: 'Inès', urgence: 'moyenne', raison: 'Temps en baisse de 64 % sur ses 4 semaines, 2 messages non lus.', action: 'Répondre à ses messages, puis fixer un objectif doux.', message: 'Coucou Inès, j’ai vu tes messages, je te réponds. On vise 3 petites séances cette semaine ?' },
            { code: 'E3', eleveId: 'x3', prenom: 'Noa', urgence: 'basse', raison: 'Score en maths passé de 48 % à 71 % en trois semaines.', action: 'Le féliciter.', message: 'Bravo Noa ! +23 points en maths en trois semaines, continue comme ça 💪' },
          ],
        }}
      />
    )
  } else if (vue === 'fiche') {
    const semaines = Array.from({ length: 8 }, (_, k) => ({ lundi: `2026-${k < 3 ? '08' : '09'}-${String(1 + k * 3).padStart(2, '0')}`, minutes: [140, 120, 160, 90, 110, 60, 40, 25][k], jours: 3, quiz: 4, score: 0.6 }))
    contenu = (
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="flex flex-col gap-4">
          <FicheEntreeCarte
            eleveId="dev"
            fiche={{ ...FICHE_VIDE, etablissement: 'Collège Jean Moulin', objectif: 'Brevet avec mention bien', filiere: '2de générale puis STAPS', moyennes: { Maths: 9.5, Français: 12, 'Histoire-Géo': 13.5 }, moyenneGenerale: 11.8, contraintes: 'Entraînements lundi, mercredi, vendredi 18 h – 20 h', pointsFaibles: 'Fractions, rédaction', majLe: '2026-10-01T10:00:00Z' }}
          />
          <NotesCarte eleveId="dev" notes={[{ id: 1, corps: 'Appel avec la maman : très fatiguée après les matchs du samedi.', creeLe: '2026-10-12T18:00:00Z', auteur: 'Lucas', moi: true }]} />
        </div>
        <ActiviteCarte
          semaines={semaines}
          jours={Array.from({ length: 28 }, (_, k) => ({ jour: `2026-09-${String(19 + (k % 12)).padStart(2, '0')}-${k}`, minutes: k % 3 === 0 ? 0 : (k * 7) % 45 }))}
          recent={[{ source: 'quiz', xp: 18, quand: '2026-10-15T17:20:00Z' }, { source: 'lecon', xp: 10, quand: '2026-10-15T17:05:00Z' }, { source: 'jeu', xp: 6, quand: '2026-10-14T19:40:00Z' }]}
        />
        <div className="flex flex-col gap-4">
          <ObjectifCarte eleveId="dev" objectif={{ minutes: 120, jours: 4, quiz: 6, message: 'On reprend tranquillement !' }} avancee={{ minutes: 50, jours: 2, quiz: 5 }} />
          <AssistantCarte eleveId="dev" prenom="Léa" parentLie />
        </div>
      </div>
    )
  } else if (vue === 'coachs') {
    contenu = (
      <GestionCoachs
        moi="m"
        coachs={[
          { id: 'm', prenom: 'Lucas', email: 'lucas@studuel.fr', admin: true, groupes: 3, eleves: 72, inactifs7: 9, messages7: 41, filsEnAttente: 2, derniereConnexion: '2026-10-16T07:00:00Z' },
          { id: 'c2', prenom: 'Ana', email: 'ana@club.fr', admin: false, groupes: 1, eleves: 24, inactifs7: 11, messages7: 3, filsEnAttente: 5, derniereConnexion: '2026-10-09T19:00:00Z' },
        ]}
      />
    )
  } else {
    contenu = <TableauInsights i={insightsFictifs()} jours={30} />
  }

  return (
    <ConsoleShell roles={{ coach: true, admin: true }} prenom="Lucas">
      {contenu}
    </ConsoleShell>
  )
}
