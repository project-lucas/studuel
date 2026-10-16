// -----------------------------------------------------------------------------
// LES INSIGHTS — la logique pure (16/10/2026, migrations 589 et 590).
//
// Lucas : « les matières les plus appréciées, ce qui est très utilisé, peu
// utilisé, ce qui doit être traité ». La base agrège (`admin_insights`,
// `admin_contenu_a_traiter`, `admin_usage`) ; ici on normalise, on nomme en
// français et on tire les CONSTATS : ce qui monte, ce qui baisse, ce que
// personne n'utilise, et quoi faire. Sans réseau, testé.
// -----------------------------------------------------------------------------

const n = (v: unknown): number => {
  const x = Number(v ?? 0)
  return Number.isFinite(x) ? x : 0
}
const s = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : String(v))
const liste = (v: unknown): Record<string, unknown>[] =>
  Array.isArray(v) ? v.filter((x): x is Record<string, unknown> => !!x && typeof x === 'object') : []

/** Le nom, en français, de chaque source d'XP (= un geste de l'app, lib/economie). */
export const LIBELLE_SOURCE: Record<string, string> = {
  quiz: 'Quiz de chapitre',
  quiz_top: 'Quiz parfaits',
  revision: 'Révisions « À revoir »',
  examen_blanc: 'Examens blancs',
  controle: 'Contrôles blancs',
  dictee: 'Dictées',
  annale: 'Annales du bac',
  capsule: 'Capsules',
  encyclo: 'Encyclopédie',
  flashcards: 'Flashcards',
  jeu: 'Jeux de salon',
  arene: 'Modes de l’arène',
  defi: 'Défis (ancien)',
  defi_arena: 'Arène (ancien)',
  defi_jour: 'Défi du jour',
  duel: 'Duels classés',
  bienvenue: 'Première partie',
  serie: 'Séries de 7 jours',
  palier: 'Étoiles de palier',
  traque: 'Gardiens (Traque)',
  lecon: 'Leçons lues',
  exercice: 'Cahier d’exercices',
  quests: 'Quêtes du jour',
  clan_week: 'Clan de la semaine',
  coffre_equipe: 'Coffre d’équipe',
}

export function libelleSource(source: string): string {
  return LIBELLE_SOURCE[source] ?? source
}

export const LIBELLE_MARCEL: Record<string, string> = {
  question: 'Questions',
  fiche: 'Fiches',
  exercice: 'Exercices',
  flashcards: 'Flashcards',
  oral: 'Oral',
  autre: 'Autres outils',
}

export type Insights = {
  periode: { jours: number; depuis: string; jusqua: string }
  audience: { comptes: number; eleves: number; parents: number; coachs: number; plus: number; nouveaux: number; nouveauxAvant: number }
  classes: { classe: string; n: number }[]
  jours: { jour: string; inscrits: number; actifs: number; minutes: number; quiz: number }[]
  actifs: { jour: number; semaine: number; mois: number; periode: number }
  temps: { minutes: number; eleves: number; joursEleve: number }
  fonctionnalites: { source: string; libelle: string; n: number; eleves: number; xp: number; avant: number }[]
  matieres: { matiere: string; sessions: number; eleves: number; score: number | null }[]
  lecons: { matiere: string; lectures: number; eleves: number }[]
  jeux: { jeu: string; parties: number; eleves: number; victoires: number }[]
  modes: { mode: string; parties: number; eleves: number }[]
  marcel: { mode: string; appels: number; eleves: number }[]
  heures: number[]
  semaine: number[]
  achats: { fiches: number; capsules: number; demandesPlus: number; annalesCommencees: number; annalesTerminees: number }
  gemmes: { source: string; gemmes: number; eleves: number }[]
}

export function insightsDepuis(d: unknown): Insights | null {
  if (!d || typeof d !== 'object') return null
  const r = d as Record<string, unknown>
  const per = (r.periode ?? {}) as Record<string, unknown>
  const aud = (r.audience ?? {}) as Record<string, unknown>
  const act = (r.actifs ?? {}) as Record<string, unknown>
  const tps = (r.temps ?? {}) as Record<string, unknown>
  const ach = (r.achats ?? {}) as Record<string, unknown>
  const avant = (r.fonctionnalites_avant ?? {}) as Record<string, unknown>
  const heures = Array.from({ length: 24 }, () => 0)
  for (const h of liste(r.heures)) {
    const i = n(h.h)
    if (i >= 0 && i < 24) heures[i] = n(h.n)
  }
  const semaine = Array.from({ length: 7 }, () => 0)
  for (const j of liste(r.semaine)) {
    const i = n(j.j) - 1
    if (i >= 0 && i < 7) semaine[i] = n(j.n)
  }
  return {
    periode: { jours: n(per.jours), depuis: s(per.depuis), jusqua: s(per.jusqua) },
    audience: {
      comptes: n(aud.comptes), eleves: n(aud.eleves), parents: n(aud.parents), coachs: n(aud.coachs),
      plus: n(aud.plus), nouveaux: n(aud.nouveaux), nouveauxAvant: n(aud.nouveaux_avant),
    },
    classes: liste(r.classes).map((c) => ({ classe: s(c.classe), n: n(c.n) })),
    jours: liste(r.jours).map((j) => ({ jour: s(j.jour), inscrits: n(j.inscrits), actifs: n(j.actifs), minutes: n(j.minutes), quiz: n(j.quiz) })),
    actifs: { jour: n(act.jour), semaine: n(act.semaine), mois: n(act.mois), periode: n(act.periode) },
    temps: { minutes: n(tps.minutes), eleves: n(tps.eleves), joursEleve: n(tps.jours_eleve) },
    fonctionnalites: liste(r.fonctionnalites).map((f) => ({
      source: s(f.source), libelle: libelleSource(s(f.source)), n: n(f.n), eleves: n(f.eleves), xp: n(f.xp), avant: n(avant[s(f.source)]),
    })),
    matieres: liste(r.matieres).map((m) => ({ matiere: s(m.matiere), sessions: n(m.sessions), eleves: n(m.eleves), score: m.score == null ? null : n(m.score) })),
    lecons: liste(r.lecons).map((m) => ({ matiere: s(m.matiere), lectures: n(m.lectures), eleves: n(m.eleves) })),
    jeux: liste(r.jeux).map((j) => ({ jeu: s(j.jeu), parties: n(j.parties), eleves: n(j.eleves), victoires: n(j.victoires) })),
    modes: liste(r.modes).map((m) => ({ mode: s(m.mode), parties: n(m.parties), eleves: n(m.eleves) })),
    marcel: liste(r.marcel).map((m) => ({ mode: s(m.mode), appels: n(m.appels), eleves: n(m.eleves) })),
    heures,
    semaine,
    achats: {
      fiches: n(ach.fiches), capsules: n(ach.capsules), demandesPlus: n(ach.demandes_plus),
      annalesCommencees: n(ach.annales_commencees), annalesTerminees: n(ach.annales_terminees),
    },
    gemmes: liste(r.gemmes).map((g) => ({ source: s(g.source), gemmes: n(g.gemmes), eleves: n(g.eleves) })),
  }
}

/** La variation en %, arrondie ; null quand il n'y avait rien avant (pas de « +∞ %»). */
export function variation(maintenant: number, avant: number): number | null {
  if (avant <= 0) return null
  return Math.round(((maintenant - avant) / avant) * 100)
}

/** « +12 % », « −8 % », « nouveau », « = ». */
export function libelleVariation(v: number | null, maintenant: number): string {
  if (v === null) return maintenant > 0 ? 'nouveau' : '—'
  if (v === 0) return '='
  return `${v > 0 ? '+' : '−'}${Math.abs(v)} %`
}

/** Toutes les sources connues, pour montrer AUSSI ce que personne n'a utilisé sur la période. */
export const SOURCES_SUIVIES = [
  'quiz', 'revision', 'examen_blanc', 'controle', 'dictee', 'annale', 'capsule', 'encyclo',
  'jeu', 'arene', 'defi_jour', 'duel', 'palier', 'traque', 'lecon', 'exercice', 'quests',
] as const

/** Les fonctionnalités jamais touchées sur la période (parmi les suivies). */
export function fonctionnalitesMuettes(i: Insights): string[] {
  const vues = new Set(i.fonctionnalites.filter((f) => f.n > 0).map((f) => f.source))
  return SOURCES_SUIVIES.filter((src) => !vues.has(src)).map(libelleSource)
}

/** Le taux d'adoption : la part des élèves actifs de la période qui ont touché la fonctionnalité. */
export function adoption(eleves: number, actifs: number): number {
  return actifs > 0 ? Math.min(100, Math.round((eleves / actifs) * 100)) : 0
}

export type Constat = { ton: 'bon' | 'alerte' | 'info'; titre: string; detail: string }

/**
 * Les CONSTATS de la période, en phrases : ce qui monte, ce qui baisse, ce que
 * personne n'utilise, la matière préférée et la plus difficile, l'heure de
 * pointe. C'est la première chose que Lucas lit.
 */
export function constats(i: Insights): Constat[] {
  const out: Constat[] = []
  const vInscrits = variation(i.audience.nouveaux, i.audience.nouveauxAvant)
  if (vInscrits !== null && Math.abs(vInscrits) >= 15) {
    out.push({
      ton: vInscrits > 0 ? 'bon' : 'alerte',
      titre: `Inscriptions ${libelleVariation(vInscrits, i.audience.nouveaux)}`,
      detail: `${i.audience.nouveaux} nouveaux comptes sur ${i.periode.jours} jours, contre ${i.audience.nouveauxAvant} la période d’avant.`,
    })
  }
  if (i.actifs.mois > 0) {
    const collant = Math.round((i.actifs.jour / i.actifs.mois) * 100)
    out.push({
      ton: collant >= 20 ? 'bon' : 'info',
      titre: `${collant} % des actifs du mois sont venus aujourd’hui`,
      detail: `${i.actifs.jour} aujourd’hui · ${i.actifs.semaine} sur 7 jours · ${i.actifs.mois} sur 30 jours. Au-dessus de 20 %, l’app est une habitude.`,
    })
  }
  const enHausse = i.fonctionnalites
    .map((f) => ({ f, v: variation(f.n, f.avant) }))
    .filter((x) => x.v !== null && x.f.n >= 10)
    .sort((a, b) => (b.v ?? 0) - (a.v ?? 0))
  const monte = enHausse[0]
  if (monte && (monte.v ?? 0) >= 25) {
    out.push({ ton: 'bon', titre: `${monte.f.libelle} décolle (${libelleVariation(monte.v, monte.f.n)})`, detail: `${monte.f.n} utilisations par ${monte.f.eleves} élèves.` })
  }
  const baisse = enHausse[enHausse.length - 1]
  if (baisse && (baisse.v ?? 0) <= -25) {
    out.push({ ton: 'alerte', titre: `${baisse.f.libelle} recule (${libelleVariation(baisse.v, baisse.f.n)})`, detail: `${baisse.f.n} utilisations contre ${baisse.f.avant} la période d’avant.` })
  }
  const muettes = fonctionnalitesMuettes(i)
  if (muettes.length > 0) {
    out.push({ ton: 'alerte', titre: `${muettes.length} fonctionnalité${muettes.length > 1 ? 's' : ''} jamais utilisée${muettes.length > 1 ? 's' : ''}`, detail: muettes.slice(0, 6).join(', ') + (muettes.length > 6 ? '…' : '.') })
  }
  const preferee = [...i.matieres].sort((a, b) => b.eleves - a.eleves || b.sessions - a.sessions)[0]
  if (preferee) {
    out.push({ ton: 'info', titre: `Matière la plus travaillée : ${preferee.matiere}`, detail: `${preferee.sessions} quiz par ${preferee.eleves} élèves.` })
  }
  const dure = i.matieres.filter((m) => m.sessions >= 10 && m.score !== null).sort((a, b) => (a.score ?? 1) - (b.score ?? 1))[0]
  if (dure && dure.score !== null && dure.score < 0.6) {
    out.push({ ton: 'alerte', titre: `Matière la plus difficile : ${dure.matiere} (${Math.round(dure.score * 100)} %)`, detail: 'Score moyen aux quiz. Vérifier les questions dans « À traiter ».' })
  }
  const pointe = i.heures.indexOf(Math.max(...i.heures))
  if (i.heures[pointe] > 0) {
    out.push({ ton: 'info', titre: `Heure de pointe : ${pointe} h – ${pointe + 1} h`, detail: 'Le meilleur moment pour un rappel ou une annonce.' })
  }
  if (i.achats.demandesPlus > 0) {
    out.push({ ton: 'bon', titre: `${i.achats.demandesPlus} demande${i.achats.demandesPlus > 1 ? 's' : ''} de Studuel+`, detail: 'À traiter dans Abonnements.' })
  }
  return out
}

/** Somme d'une colonne des jours. */
export function somme(jours: Insights['jours'], cle: 'inscrits' | 'actifs' | 'minutes' | 'quiz'): number {
  return jours.reduce((t, j) => t + j[cle], 0)
}

// ----------------------------------------------------- à traiter (589) ---
export type ATraiter = {
  questions: { id: string; question: string; quiz: string; matiere: string; classe: string | null; eleves: number; joueurs: number; taux: number }[]
  quizBas: { quizId: string; quiz: string; matiere: string; classe: string | null; sessions: number; eleves: number; score: number }[]
  chapitresMuets: { matiere: string; classe: string; muets: number; total: number; exemples: string[] }[]
  erreurs: { message: string; n: number; eleves: number; dernier: string }[]
}

export function aTraiterDepuis(d: unknown): ATraiter | null {
  if (!d || typeof d !== 'object') return null
  const r = d as Record<string, unknown>
  return {
    questions: liste(r.questions).map((q) => ({
      id: s(q.id), question: s(q.question), quiz: s(q.quiz), matiere: s(q.matiere), classe: q.classe ? s(q.classe) : null,
      eleves: n(q.eleves), joueurs: n(q.joueurs), taux: n(q.taux),
    })),
    quizBas: liste(r.quiz_bas).map((q) => ({
      quizId: s(q.quiz_id), quiz: s(q.quiz), matiere: s(q.matiere), classe: q.classe ? s(q.classe) : null,
      sessions: n(q.sessions), eleves: n(q.eleves), score: n(q.score),
    })),
    chapitresMuets: liste(r.chapitres_muets).map((c) => ({
      matiere: s(c.matiere), classe: s(c.classe), muets: n(c.muets), total: n(c.total),
      exemples: Array.isArray(c.exemples) ? c.exemples.map(String) : [],
    })),
    erreurs: liste(r.erreurs).map((e) => ({ message: s(e.message), n: n(e.n), eleves: n(e.eleves), dernier: s(e.dernier) })),
  }
}

/** La gravité d'une question ratée : au-delà de 70 %, elle est probablement fausse ou ambiguë. */
export function graviteQuestion(taux: number): 'critique' | 'haute' | 'moyenne' {
  if (taux >= 0.7) return 'critique'
  if (taux >= 0.5) return 'haute'
  return 'moyenne'
}

// ----------------------------------------------------- l'usage (590) ---
export type Usage = {
  jours: number
  total: number
  depuis: string | null
  pages: { page: string; vues: number; visiteurs: number; tempsMoyenS: number; tempsMedianS: number }[]
  sessions: { n: number; pagesMoy: number; dureeMedianeS: number; connectees: number }
  recherchesVides: { texte: string; n: number; ou: string }[]
  gestes: { nom: string; cible: string | null; n: number; visiteurs: number }[]
  appareils: { appareil: string; n: number }[]
}

export function usageDepuis(d: unknown): Usage | null {
  if (!d || typeof d !== 'object') return null
  const r = d as Record<string, unknown>
  const ses = (r.sessions ?? {}) as Record<string, unknown>
  return {
    jours: n(r.jours),
    total: n(r.total),
    depuis: typeof r.depuis === 'string' ? r.depuis : null,
    pages: liste(r.pages).map((p) => ({ page: s(p.page), vues: n(p.vues), visiteurs: n(p.visiteurs), tempsMoyenS: n(p.temps_moyen_s), tempsMedianS: n(p.temps_median_s) })),
    sessions: { n: n(ses.n), pagesMoy: n(ses.pages_moy), dureeMedianeS: n(ses.duree_mediane_s), connectees: n(ses.connectees) },
    recherchesVides: liste(r.recherches_vides).map((x) => ({ texte: s(x.texte), n: n(x.n), ou: s(x.ou) })),
    gestes: liste(r.gestes).map((g) => ({ nom: s(g.nom), cible: g.cible ? s(g.cible) : null, n: n(g.n), visiteurs: n(g.visiteurs) })),
    appareils: liste(r.appareils).map((a) => ({ appareil: s(a.appareil), n: n(a.n) })),
  }
}

/** Le nom lisible d'une page normalisée (`/reviser/[matiere]` → « Réviser › une matière »). */
export function libellePage(page: string): string {
  const morceaux: Record<string, string> = {
    '': 'Accueil', defi: 'Défi', reviser: 'Réviser', amis: 'Amis', moi: 'Moi', tresor: 'Boutique', marcel: 'Marcel',
    carnet: 'Bibliothèque', test: 'Quiz', bienvenue: 'Bienvenue', login: 'Connexion', compte: 'Mon compte',
    parents: 'Parents', coach: 'Coach', admin: 'Admin', messages: 'Messages', plus: 'Studuel+', examen: 'Examen',
    '[matiere]': 'une matière', '[chapitre]': 'un chapitre', '[id]': 'une fiche', '[n]': 'n°',
    encyclopedie: 'Encyclopédie', annales: 'Annales', exercice: 'Exercice', jeux: 'Jeux', jouer: 'Jouer', duel: 'Duel',
    programme: 'Programme', cours: 'Cours', quiz: 'Quiz', carte: 'Fiche', avatar: 'Vestiaire', capsules: 'Capsules',
  }
  const parts = page.split('/').slice(1)
  if (parts.length === 0 || (parts.length === 1 && parts[0] === '')) return 'Accueil'
  return parts.map((p) => morceaux[p] ?? p).join(' › ')
}

/** « 1 min 05 », « 42 s ». */
export function dureeCourte(secondes: number): string {
  const sec = Math.max(0, Math.round(secondes))
  if (sec < 60) return `${sec} s`
  const m = Math.floor(sec / 60)
  const r = sec % 60
  if (m < 60) return r ? `${m} min ${String(r).padStart(2, '0')}` : `${m} min`
  const h = Math.floor(m / 60)
  return `${h} h ${String(m % 60).padStart(2, '0')}`
}
