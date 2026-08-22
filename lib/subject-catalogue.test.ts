import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { GRADE_LEVELS, HORS_NIVEAU, type SubjectCategory } from '@/lib/types'
import {
  hasSubjectIcon,
  hasSubjectTheme,
  hasSubjectVignette,
} from '@/lib/subject-style'
import { programmeGroups } from '@/lib/subject-groups'
import { cycleOf, isTechno } from '@/lib/grades'

// Garde du CATALOGUE DES MATIÈRES.
//
// Une matière n'apparaît dans une classe que si `subjects.levels` contient ce
// niveau. C'est exactement ce qui a fait disparaître Sport de la 6e : la
// migration existait, le niveau était bon, mais rien ne le vérifiait. Ce test
// rejoue les migrations `subjects` dans l'ordre et contrôle le catalogue final :
// chaque classe propose assez de matières, et chaque matière est affichable
// (icône, thème de couleur, catégorie connue).
//
// Il ne remplace pas l'exécution des migrations en base — il garantit que le
// SQL écrit dit bien ce qu'on croit qu'il dit.

const SUPABASE_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'supabase',
)

type Row = {
  slug: string
  name: string
  color: string
  category: SubjectCategory
  levels: string[]
}

// Une ligne de VALUES : (slug, name, icon, color, category, '{niveaux}'[, fixed_level])
const ROW = new RegExp(
  String.raw`\(\s*'([a-z0-9-]+)'\s*,\s*'((?:[^']|'')*)'\s*,\s*'[^']*'\s*,` +
    String.raw`\s*'([a-z_]+)'\s*,\s*'([a-z_]+)'\s*,\s*'\{([^}]*)\}'`,
  'g',
)

// Les niveaux dont le nom contient une espace (« 1re techno ») s'écrivent
// GUILLEMETÉS dans un littéral de tableau Postgres : '{1re,"1re techno"}'.
// Sans ce nettoyage, le test verrait un niveau nommé `"1re techno"`, guillemets
// compris, et le déclarerait inconnu — pour une raison purement typographique.
const parseLevels = (raw: string): string[] =>
  raw
    .split(',')
    .map((l) => l.trim().replace(/^"|"$/g, ''))
    .filter(Boolean)

function migrationFiles(): string[] {
  return readdirSync(SUPABASE_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()
}

/**
 * Rejoue les migrations et renvoie l'état final de la table `subjects`.
 * Gère les INSERT ... VALUES et les UPDATE ... SET levels/category.
 */
function buildCatalogue(): Map<string, Row> {
  const rows = new Map<string, Row>()

  for (const file of migrationFiles()) {
    const sql = readFileSync(path.join(SUPABASE_DIR, file), 'utf8')
    if (!sql.includes('public.subjects')) continue

    // --- INSERT : on ne lit que les blocs qui visent bien `subjects`.
    for (const block of sql.split(/INSERT\s+INTO\s+/i).slice(1)) {
      if (!/^public\.subjects\s*\(/i.test(block)) continue
      const values = block.split(/\bON\s+CONFLICT\b/i)[0]
      for (const m of values.matchAll(ROW)) {
        const [, slug, name, color, category, levels] = m
        rows.set(slug, {
          slug,
          name: name.replaceAll("''", "'"),
          color,
          category: category as SubjectCategory,
          levels: parseLevels(levels),
        })
      }
    }

    // --- UPDATE ... SET levels = '{…}' [, category = '…'] WHERE slug …
    const UPDATE =
      /UPDATE\s+public\.subjects\s+SET\s+([\s\S]*?)\s+WHERE\s+slug\s+(IN\s*\(([^)]*)\)|=\s*'([a-z0-9-]+)')/gi
    for (const m of sql.matchAll(UPDATE)) {
      const [, setClause, , inList, single] = m
      const targets = single
        ? [single]
        : [...(inList ?? '').matchAll(/'([a-z0-9-]+)'/g)].map((x) => x[1])
      const levels = setClause.match(/levels\s*=\s*'\{([^}]*)\}'/i)?.[1]
      const category = setClause.match(/category\s*=\s*'([a-z_]+)'/i)?.[1]
      for (const slug of targets) {
        const row = rows.get(slug)
        if (!row) continue
        rows.set(slug, {
          ...row,
          levels: levels !== undefined ? parseLevels(levels) : row.levels,
          category: (category ?? row.category) as SubjectCategory,
        })
      }
    }

    // --- DELETE FROM public.subjects ... WHERE ... slug = '…'
    // La 190 éclate le dossier « Culture générale » en matières séparées puis
    // supprime la coquille vide. Sans ce cas, le catalogue simulé garderait un
    // dossier mort que la base n'a plus — et les comptes seraient faux.
    const DELETE =
      /DELETE\s+FROM\s+public\.subjects[\s\S]*?WHERE[\s\S]*?slug\s*=\s*'([a-z0-9-]+)'/gi
    for (const m of sql.matchAll(DELETE)) rows.delete(m[1])
  }

  return rows
}

const catalogue = buildCatalogue()
const all = [...catalogue.values()]
const programme = all.filter((s) => s.category !== 'culture')

describe('le parseur de migrations lit bien quelque chose', () => {
  it('retrouve les matières historiques du seed', () => {
    for (const slug of ['maths', 'francais', 'histoire-geo', 'svt']) {
      expect(catalogue.get(slug), slug).toBeDefined()
    }
    expect(all.length).toBeGreaterThan(20)
  })

  it('applique les DELETE (le dossier « Culture générale » a été éclaté)', () => {
    // La 190 le remplace par Économie, Fiscalité, Entrepreneuriat… puis le
    // supprime. S'il survivait au parseur, le dossier Hors programme
    // afficherait une matière vide de plus.
    expect(catalogue.get('culture-generale')).toBeUndefined()
    expect(catalogue.get('economie')?.category).toBe('culture')
  })

  it('applique bien les UPDATE de niveaux (pas seulement les INSERT)', () => {
    // La 193 étend l'espagnol au lycée : si les UPDATE étaient ignorés, ce test
    // verrait encore les niveaux du seed 008 (5e→3e) et passerait à côté.
    expect(catalogue.get('espagnol')?.levels).toContain('Tle')
    expect(catalogue.get('technologie')?.levels).toContain('6e')
  })
})

describe('chaque classe a un programme complet', () => {
  // Le primaire n'a que les NEUF enseignements de son socle (français, maths,
  // langue vivante, EPS, arts plastiques, éducation musicale, EMC, histoire-géo,
  // sciences et technologie) — pas dix. Compter pareil qu'au collège
  // obligerait à inventer une matière qui n'existe pas à l'école.
  const minimumFor = (grade: string) => (cycleOf(grade) === 'primaire' ? 9 : 10)

  for (const grade of GRADE_LEVELS) {
    it(`${grade} propose au moins ${minimumFor(grade)} matières au programme`, () => {
      const ofLevel = programme.filter((s) => s.levels.includes(grade))
      expect(
        ofLevel.length,
        `${grade} : ${ofLevel.map((s) => s.slug).join(', ')}`,
      ).toBeGreaterThanOrEqual(minimumFor(grade))
    })
  }

  it('donne à chaque classe les fondamentaux qu’un élève attend', () => {
    // Le cas exact remonté : « je clique sur 6e, il n'y a pas sport ».
    //
    // Le socle se lit PAR CYCLE, parce qu'il n'est pas le même partout. Un CP
    // n'a pas de SVT : sa science s'appelle « Sciences et technologie », et elle
    // se sépare en SVT / physique-chimie / technologie seulement au collège.
    // Exiger « svt » au primaire aurait forcé une matière fantôme au catalogue.
    const COMMUN = ['maths', 'histoire-geo', 'anglais', 'sport', 'emc']
    const socleFor = (grade: string) =>
      cycleOf(grade) === 'primaire'
        ? [...COMMUN, 'francais', 'sciences-technologie']
        : [...COMMUN, 'francais', 'svt']

    for (const grade of GRADE_LEVELS) {
      for (const slug of socleFor(grade)) {
        // Le français s'arrête en 1re (la philosophie prend le relais en Tle),
        // dans les deux voies.
        if (slug === 'francais' && (grade === 'Tle' || grade === 'Tle techno')) continue
        // La voie techno n'a pas les spécialités scientifiques de la générale.
        if (slug === 'svt' && isTechno(grade)) continue
        // L'EPS N'EST PAS DANS LES DOSSIERS DE 1re GÉNÉRALE (migration 278).
        // Ce n'est PAS une erreur de catalogue et ce n'est pas non plus une
        // correction de programme : l'EPS reste obligatoire en première, 2 h par
        // semaine. C'est une décision de produit (Lucas, 21/08/2026) — on ne
        // révise pas l'EPS, et sa carte n'a jamais porté que 3 fiches
        // passe-partout identiques du CP à la Terminale. La 1re TECHNO la garde :
        // son programme dans l'app n'est fait que du tronc commun, et sans elle
        // la classe tomberait sous les dix matières exigées plus haut.
        // Remettre « 1re » dans `subjects.levels` suffit à revenir en arrière.
        if (slug === 'sport' && grade === '1re') continue
        expect(
          catalogue.get(slug)?.levels,
          `« ${slug} » absent de la classe ${grade}`,
        ).toContain(grade)
      }
    }
  })

  it('donne aux deux Terminales leur philosophie', () => {
    // Le français s'arrêtant en 1re, une Terminale sans philosophie n'aurait
    // plus AUCUNE matière de lettres — dans la voie techno comme dans l'autre.
    for (const grade of ['Tle', 'Tle techno']) {
      expect(catalogue.get('philosophie')?.levels, grade).toContain(grade)
    }
  })

  it('ne donne PAS à la voie techno les spécialités de la voie générale', () => {
    // Les spécialités de la voie technologique dépendent de la série (STMG,
    // STI2D, ST2S…), que le profil ne demande pas encore. Les afficher en
    // attendant reviendrait à proposer à un STMG la spé NSI de la générale.
    for (const slug of ['ses', 'nsi', 'hggsp', 'hlp', 'llcer-anglais', 'si', 'svt']) {
      const levels = catalogue.get(slug)?.levels ?? []
      expect(levels, slug).not.toContain('1re techno')
      expect(levels, slug).not.toContain('Tle techno')
    }
  })

  it('ouvre les arts et la musique à toutes les classes, sauf la 1re générale', () => {
    // L'exception vient de la migration 278 : en première générale, arts
    // plastiques et musique sont des enseignements OPTIONNELS dont l'app ne
    // tient aucun programme — leur dossier n'avait que 3 fiches passe-partout,
    // les mêmes qu'en 6e. Elles restent proposées partout ailleurs, 1re TECHNO
    // comprise (voir le commentaire sur l'EPS plus haut : ce sont les seules
    // matières d'expression de sa grille).
    const attendus = GRADE_LEVELS.filter((g) => g !== '1re')
    for (const slug of ['arts-plastiques', 'musique']) {
      expect(catalogue.get(slug)?.levels, slug).toEqual([...attendus])
    }
  })

  it('garde les matières de lycée hors du collège ET du primaire', () => {
    for (const slug of ['philosophie', 'ses', 'nsi', 'hggsp', 'snt', 'hlp', 'si']) {
      const levels = catalogue.get(slug)?.levels ?? []
      for (const grade of ['CP', 'CM2', '6e', '3e']) {
        expect(levels, `${slug} en ${grade}`).not.toContain(grade)
      }
    }
  })

  it('garde « Sciences et technologie » au primaire, et elle seule', () => {
    // Au collège, elle ferait doublon avec SVT, physique-chimie et technologie,
    // qui ont chacune leur programme et leurs chapitres.
    expect(catalogue.get('sciences-technologie')?.levels).toEqual([
      'CP',
      'CE1',
      'CE2',
      'CM1',
      'CM2',
    ])
  })
})

describe('chaque matière est affichable', () => {
  it('n’utilise que des niveaux connus', () => {
    for (const s of all) {
      for (const level of s.levels) {
        expect(
          [...GRADE_LEVELS, HORS_NIVEAU] as string[],
          `${s.slug} : niveau « ${level} » inconnu`,
        ).toContain(level)
      }
      expect(s.levels.length, `${s.slug} sans niveau`).toBeGreaterThan(0)
    }
  })

  it('n’utilise que des catégories connues', () => {
    const known: SubjectCategory[] = [
      'college',
      'tronc_commun',
      'specialite',
      'option',
      'culture',
    ]
    for (const s of all) expect(known, s.slug).toContain(s.category)
  })

  it('a une couleur qui correspond à un thème réel', () => {
    // Une couleur inconnue retombe EN SILENCE sur le bleu : la matière
    // s'affiche simplement dans la mauvaise teinte, sans rien signaler.
    for (const s of all) {
      expect(hasSubjectTheme(s.color), `${s.slug} : couleur « ${s.color} »`).toBe(
        true,
      )
    }
  })

  it('a son icône, jamais le repli générique', () => {
    for (const s of all) {
      expect(hasSubjectIcon(s.slug), `${s.slug} sans icône`).toBe(true)
    }
  })

  // Les matières dont AUCUN dessin n'existe (ni en propre, ni emprunté à une
  // matière sœur). Elles gardent le médaillon d'icône, qui reste une sortie
  // propre — mais la liste doit rester courte et explicite : c'est la liste de
  // travail du prochain lot d'illustrations.
  const SANS_DESSIN = new Set(['grand-oral'])

  it('a son illustration — ou figure dans la liste de celles qui manquent', () => {
    for (const s of all) {
      if (SANS_DESSIN.has(s.slug)) continue
      expect(hasSubjectVignette(s.slug), `${s.slug} sans illustration`).toBe(true)
    }
  })

  it('ne garde pas dans la liste des manquantes une matière déjà illustrée', () => {
    // Sans ce garde, la liste ci-dessus survivrait à la livraison du dessin et
    // la matière resterait au médaillon sans que personne ne le voie.
    for (const slug of SANS_DESSIN) {
      expect(hasSubjectVignette(slug), `${slug} a son illustration`).toBe(false)
    }
  })
})

describe('rangement de l’accueil', () => {
  // Ce que l'accueil Réviser affiche pour une classe : la grille du programme
  // (découpée en groupes au lycée), puis celle de la culture générale.
  function shownFor(grade: string) {
    const ofLevel = all.filter((s) => s.levels.includes(grade))
    const groups = programmeGroups({
      subjects: ofLevel.filter((s) => s.category !== 'culture').map(asSubject),
      grade,
    })
    const culture = ofLevel
      .filter((s) => s.category === 'culture')
      .map(asSubject)
    return { ofLevel, groups, culture }
  }

  it('range toutes les matières de chaque classe, sans doublon ni perte', () => {
    for (const grade of GRADE_LEVELS) {
      const { ofLevel, groups, culture } = shownFor(grade)
      const shown = [...groups.flatMap((g) => g.items), ...culture]
      expect(shown.length, `${grade} : matières perdues`).toBe(ofLevel.length)
      expect(new Set(shown.map((s) => s.slug)).size).toBe(ofLevel.length)
    }
  })

  it('donne à chaque classe un programme rempli et sa culture générale', () => {
    for (const grade of GRADE_LEVELS) {
      const { groups, culture } = shownFor(grade)
      expect(groups.flatMap((g) => g.items).length, grade).toBeGreaterThan(0)
      expect(culture.length, `${grade} : pas de culture générale`).toBeGreaterThan(0)
    }
  })
})

// Les lignes parsées n'ont pas d'`id` : on en fabrique un depuis le slug pour
// nourrir la logique de dossiers, qui l'utilise pour repérer les orphelines.
function asSubject(r: Row) {
  return {
    id: r.slug,
    slug: r.slug,
    name: r.name,
    icon: '📘',
    color: r.color,
    category: r.category,
    levels: r.levels,
  }
}
