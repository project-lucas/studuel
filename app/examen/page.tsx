import { redirect } from 'next/navigation'
import EcranExamen from '@/components/examen/EcranExamen'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { getUserTierFor } from '@/lib/subscription'
import { isPremiumTier } from '@/lib/gems'
import { readRowTolerant } from '@/lib/profile-read'
import { toDayKey } from '@/lib/streak'
import { chapterState } from '@/lib/mastery'
import { getChapterMastery } from '@/lib/mastery-server'
import { getGradeChaptersCached, getSubjectsCached } from '@/lib/catalog'
import { examsForProfile } from '@/lib/exams'
import { examenDe, joursAvantExamen, objectifsDeLaSemaine, phaseDe } from '@/lib/examen/parcours'
import { annalesDeLExamen } from '@/lib/examen/annales-examen'
import { ANNALES_CORRIGEES } from '@/lib/annales-corrigees/registre'

export const metadata = { title: 'Mode examen — Studuel' }
export const dynamic = 'force-dynamic'

// LE MODE EXAMEN (écran : components/examen/EcranExamen). UNE vague : profil,
// abonnement, catalogue (cache), maîtrise. Aperçu sans compte : /dev/examen.
export default async function PageExamen() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const supabase = await createClient()

  const profilP = readRowTolerant<{ grade_level: string | null; selected_subjects: unknown }>(
    supabase,
    'profiles',
    'id',
    user.id,
    ['grade_level', 'selected_subjects'],
  )
  const [profil, tier, matieres, chapitres, maitrise] = await Promise.all([
    profilP,
    getUserTierFor(supabase, user.id),
    getSubjectsCached(),
    profilP.then((p) => (p?.grade_level ? getGradeChaptersCached(p.grade_level) : [])),
    getChapterMastery(supabase, user.id),
  ])

  const classe = profil?.grade_level ?? null
  const examen = examenDe(classe)
  const premium = isPremiumTier(tier)
  if (!examen) return <EcranExamen examen={null} jours={0} premium={premium} objectifs={[]} annales={[]} />

  const jours = joursAvantExamen(examen, toDayKey(new Date()))

  // Ses matières d'examen : celles des épreuves, plus les spécialités choisies.
  const choisies = Array.isArray(profil?.selected_subjects) ? (profil.selected_subjects as string[]) : null
  const slugsExamen = new Set<string>([
    ...examen.epreuves.flatMap((e) => (e.matiere ? [e.matiere] : [])),
    ...examsForProfile(classe ?? '', choisies, matieres).map((e) => e.subject.slug),
  ])
  const idsExamen = new Set(matieres.filter((m) => slugsExamen.has(m.slug)).map((m) => m.id))
  let pointsFaibles = 0
  let aCommencer = 0
  for (const c of chapitres) {
    if (!idsExamen.has(c.subject_id)) continue
    const etat = chapterState(maitrise.get(c.id))
    if (etat === 'fragile') pointsFaibles++
    if (etat === 'a_commencer') aCommencer++
  }

  return (
    <EcranExamen
      examen={examen}
      jours={jours}
      premium={premium}
      objectifs={objectifsDeLaSemaine(examen, phaseDe(jours), { pointsFaibles, aCommencer, matierePrincipale: null })}
      annales={annalesDeLExamen(ANNALES_CORRIGEES, examen.id, slugsExamen)}
    />
  )
}
