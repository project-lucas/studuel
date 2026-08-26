import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { policiesNonEnveloppees, revokesIncomplets } from './rls-guard'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

describe('policiesNonEnveloppees', () => {
  it('signale un appel d’auth nu dans un USING', () => {
    const nues = policiesNonEnveloppees(`
      CREATE POLICY parent_prefs_select_own ON public.parent_prefs
        FOR SELECT USING (parent_id = auth.uid());
    `)
    expect(nues).toHaveLength(1)
    expect(nues[0].nom).toBe('parent_prefs_select_own')
    expect(nues[0].table).toBe('parent_prefs')
    expect(nues[0].extrait).toBe('auth.uid()')
  })

  it('laisse passer la forme enveloppée', () => {
    expect(
      policiesNonEnveloppees(`
        CREATE POLICY p ON public.t
          FOR SELECT USING (user_id = (SELECT auth.uid()));
      `),
    ).toEqual([])
  })

  it('tolère l’alias et les espaces que rend pg_get_expr', () => {
    expect(
      policiesNonEnveloppees(`
        CREATE POLICY p ON public.t
          FOR SELECT USING (user_id = ( SELECT auth.uid() AS uid));
      `),
    ).toEqual([])
  })

  it('signale une policy qui MÉLANGE les deux formes', () => {
    // Le piège d'une simple recherche de « (SELECT auth. » : elle aurait cru
    // cette policy propre parce qu'une des deux occurrences l'est.
    const nues = policiesNonEnveloppees(`
      CREATE POLICY p ON public.t FOR UPDATE
        USING (owner = (SELECT auth.uid()))
        WITH CHECK (editor = auth.uid());
    `)
    expect(nues).toHaveLength(1)
  })

  it('NE signale PAS auth.uid() dans un corps de fonction', () => {
    // Là, l'appel est déjà évalué une seule fois dans une variable : c'est la
    // forme optimale. La signaler ferait de ce garde-fou une machine à faux
    // positifs, et un garde-fou qui crie pour rien finit désactivé.
    expect(
      policiesNonEnveloppees(`
        CREATE OR REPLACE FUNCTION public.f() RETURNS void AS $$
        DECLARE v_user UUID := auth.uid();
        BEGIN NULL; END $$ LANGUAGE plpgsql;
      `),
    ).toEqual([])
  })

  it('couvre les quatre fonctions d’auth, pas seulement uid()', () => {
    for (const fn of ['uid', 'jwt', 'role', 'email']) {
      const nues = policiesNonEnveloppees(
        `CREATE POLICY p ON public.t FOR SELECT USING (x = auth.${fn}());`,
      )
      expect(nues, fn).toHaveLength(1)
    }
  })

  it('lit un nom de policy entre guillemets', () => {
    const nues = policiesNonEnveloppees(`
      CREATE POLICY "exam_papers lisibles par les comptes connectés"
        ON public.exam_papers FOR SELECT USING (owner = auth.uid());
    `)
    expect(nues[0].nom).toBe('exam_papers lisibles par les comptes connectés')
  })

  it('signale chaque policy fautive d’un fichier, pas seulement la première', () => {
    const nues = policiesNonEnveloppees(`
      CREATE POLICY a ON public.t1 FOR SELECT USING (u = auth.uid());
      CREATE POLICY b ON public.t2 FOR SELECT USING (u = (SELECT auth.uid()));
      CREATE POLICY c ON public.t3 FOR SELECT USING (u = auth.uid());
    `)
    expect(nues.map((n) => n.nom)).toEqual(['a', 'c'])
  })

  it('ne renvoie rien sur un fichier sans policy', () => {
    expect(policiesNonEnveloppees('SELECT 1;')).toEqual([])
  })
})

// -----------------------------------------------------------------------------
// LE CLIQUET.
//
// Ces 44 fichiers portent 100 policies écrites en forme nue. Ils sont DÉJÀ
// EXÉCUTÉS en production, et le projet interdit de retoucher une migration
// passée : leur texte restera donc fautif pour toujours. Ce qui compte, c'est
// que la base, elle, soit corrigée — c'est le rôle de la 208 (pour tout ce qui
// précède) puis de la 320 (pour la suite, et en permanence).
//
// Cette liste est donc un CONSTAT figé, pas une dette à résorber dans le
// dépôt. Sa seule fonction est d'être un cliquet : tout fichier NEUF qui
// écrirait une policy nue fait échouer ce test. On ne peut plus recreuser le
// trou sans le voir.
//
// La liste doit rester exacte dans les deux sens — un fichier qui n'y est plus
// fautif est le signe qu'une migration exécutée a été éditée, ce qui est
// précisément ce qu'on ne veut pas.
// -----------------------------------------------------------------------------
const HERITAGE = new Set([
  '002_quizzes.sql', '003_test_sessions.sql', '005_revision_board.sql',
  '007_programme.sql', '009_lesson_completions.sql', '010_moi.sql',
  '011_defi.sql', '018_tresor.sql', '019_amis.sql', '021_srs.sql',
  '022_examen_blanc.sql', '023_duels_fantomes.sql', '024_connexion.sql',
  '025_structure_cours.sql', '027_debrief.sql', '044_parents.sql',
  '045_push.sql', '046_duels_live.sql', '079_classement_trophees.sql',
  '080_coop.sql', '081_debrief_recompense.sql', '084_temps_quotidien.sql',
  '158_library_items.sql', '159_ecoles_clans.sql', '167_notes_reelles.sql',
  '174_bilan_victoires.sql', '178_realtime_authorization.sql',
  '183_gemmes_parrainage_squad.sql', '186_carnet_cours.sql',
  '187_moi_capacite.sql', '189_avatar_vestiaire.sql',
  '192_economie_progression.sql', '203_plan_preparation.sql',
  '204_clan_hebdo.sql', '205_quetes_journalieres.sql', '207_saison_pass.sql',
  '215_marcel_jetons.sql', '313_temps_paliers_jeux.sql', '314_cote_ultime.sql',
  '315_carnet_moteur_v2.sql', '316_carnet_personnalisation.sql',
  '318_dictees.sql', '319_espace_parents_v2.sql', 'schema.sql',
])

function fichiersFautifs(): Map<string, ReturnType<typeof policiesNonEnveloppees>> {
  const trouves = new Map<string, ReturnType<typeof policiesNonEnveloppees>>()
  for (const f of readdirSync(path.join(ROOT, 'supabase'))) {
    if (!f.endsWith('.sql')) continue
    const nues = policiesNonEnveloppees(
      readFileSync(path.join(ROOT, 'supabase', f), 'utf8'),
    )
    if (nues.length > 0) trouves.set(f, nues)
  }
  return trouves
}

describe('cliquet RLS — aucune policy nue dans un fichier neuf', () => {
  it('aucun fichier hors héritage n’écrit une policy nue', () => {
    const neufs = [...fichiersFautifs().entries()].filter(
      ([f]) => !HERITAGE.has(f),
    )
    const details = neufs
      .map(([f, nues]) =>
        nues.map((n) => `${f} → ${n.table}.${n.nom} : ${n.extrait}`).join('\n'),
      )
      .join('\n')

    expect(
      neufs,
      `Policy RLS écrite en forme nue.\n${details}\n\n` +
        'Enveloppe l’appel : `auth.uid()` → `(SELECT auth.uid())`.\n' +
        'Postgres évalue alors la fonction UNE fois au lieu d’une fois par ' +
        'ligne, et retrouve l’usage de l’index (cf. lib/rls-guard.ts et la ' +
        'migration 320).',
    ).toEqual([])
  })

  it('la liste d’héritage ne contient aucun fichier devenu propre', () => {
    const fautifs = fichiersFautifs()
    const propres = [...HERITAGE].filter((f) => !fautifs.has(f))
    expect(
      propres,
      'Ces fichiers sont dans la liste d’héritage mais n’ont plus de policy ' +
        'nue : soit une migration DÉJÀ EXÉCUTÉE a été éditée (interdit), soit ' +
        'la liste est à mettre à jour.',
    ).toEqual([])
  })
})

describe('revokesIncomplets — le piège du REVOKE FROM PUBLIC', () => {
  it('signale le REVOKE exact que la 320 avait écrit', () => {
    // La faute réelle, mesurée en production : après exécution, un appel
    // ANONYME à la fonction répondait HTTP 200. Supabase accorde EXECUTE à
    // `anon` et `authenticated` par des GRANT NOMMÉS — `REVOKE … FROM PUBLIC`
    // ne retire que le privilège du pseudo-rôle PUBLIC et n'y touche pas.
    const r = revokesIncomplets(
      'REVOKE ALL ON FUNCTION public.optimiser_une_policy(OID) FROM PUBLIC;',
    )
    expect(r).toHaveLength(1)
    expect(r[0].fonction).toBe('optimiser_une_policy')
    expect(r[0].manquants).toEqual(['anon', 'authenticated'])
  })

  it('laisse passer un REVOKE qui ferme les trois', () => {
    expect(
      revokesIncomplets(
        'REVOKE ALL ON FUNCTION public.f() FROM PUBLIC, anon, authenticated;',
      ),
    ).toEqual([])
  })

  it('signale un REVOKE qui n’oublie qu’un seul rôle', () => {
    const r = revokesIncomplets(
      'REVOKE ALL ON FUNCTION public.f() FROM PUBLIC, anon;',
    )
    expect(r[0].manquants).toEqual(['authenticated'])
  })

  it('ne se laisse pas berner par le `public.` du nom de la fonction', () => {
    // Sans frontières de mot, le schéma qualifié ferait croire que le rôle
    // PUBLIC est visé — et ce REVOKE, qui vise un rôle nommé, serait signalé
    // à tort.
    expect(revokesIncomplets('REVOKE ALL ON FUNCTION public.f() FROM service_role;'))
      .toEqual([])
  })

  it('ignore un fichier sans REVOKE', () => {
    expect(revokesIncomplets('GRANT EXECUTE ON FUNCTION public.f() TO anon;')).toEqual([])
  })
})

describe('cliquet REVOKE — aucun fichier neuf ne ferme à moitié', () => {
  // 27 fichiers, 56 REVOKE incomplets — tous DÉJÀ EXÉCUTÉS, tous intouchables.
  //
  // CE QU'ILS RISQUENT, EXACTEMENT — et la nuance est le cœur du sujet. Ces
  // fonctions sont bien appelables par un visiteur anonyme (mesuré : HTTP 200
  // sur `coach_buy_tokens`, `coach_ask_allowed`, `my_grade_standings`). Mais
  // elles se défendent toutes SEULES, par leur première ligne :
  //
  //     IF v_user IS NULL THEN RETURN 'refuse'; END IF;
  //     IF NOT public.is_admin() THEN RAISE EXCEPTION …
  //
  // Un appel anonyme est donc refusé par la fonction, pas par le privilège. Le
  // REVOKE incomplet est une ceinture qui manque là où les bretelles tiennent :
  // à corriger, jamais dans l'urgence.
  //
  // LES TROIS FONCTIONS DE LA 320 ÉTAIENT L'EXCEPTION, et c'est ce qui rendait
  // la faille réelle : ce sont des outils de DDL, elles n'ont AUCUN utilisateur
  // à vérifier, donc aucune garde interne. Rien n'arrêtait un appelant
  // anonyme — la 324 les ferme.
  //
  // Ce cliquet n'a donc pas pour but de résorber les 27 : il empêche qu'un
  // fichier NEUF réintroduise le piège, là où la garde interne pourrait, elle
  // aussi, manquer.
  const HERITAGE_REVOKE = new Set([
    '045_push.sql', '155_series_amis.sql', '161_ligue_hebdo.sql',
    '164_durcissement_social.sql', '170_borne_serie.sql',
    '181_cartes_mentales_acces.sql', '183_gemmes_parrainage_squad.sql',
    '184_fiches_revision_acces.sql', '189_avatar_vestiaire.sql',
    '192_economie_progression.sql', '195_push_send_log.sql',
    '198_quota_ia_carnet.sql', '200_profil_defi.sql', '201_profile_stats.sql',
    '204_clan_hebdo.sql', '205_quetes_journalieres.sql', '206_retention.sql',
    '207_saison_pass.sql', '209_reprise_hardening_192_207.sql',
    '212_traque_boss.sql', '213_traque_defaite_fenetre.sql',
    '215_marcel_jetons.sql', '221_abonnements_v0.sql', '222_oral_echelle.sql',
    '223_percentile_niveau.sql', '317_carnet_dans_le_monde.sql',
    '320_rls_initplan_permanent.sql',
  ])

  it('aucun REVOKE incomplet hors héritage', () => {
    const neufs: string[] = []
    for (const f of readdirSync(path.join(ROOT, 'supabase'))) {
      if (!f.endsWith('.sql') || HERITAGE_REVOKE.has(f)) continue
      const r = revokesIncomplets(
        readFileSync(path.join(ROOT, 'supabase', f), 'utf8'),
      )
      for (const x of r) neufs.push(`${f} → ${x.fonction} (oublie ${x.manquants.join(', ')})`)
    }
    expect(
      neufs,
      [
        'REVOKE incomplet : sur ce projet, « FROM PUBLIC » seul ne ferme RIEN.',
        ...neufs,
        '',
        'Écris : REVOKE ALL ON FUNCTION … FROM PUBLIC, anon, authenticated;',
      ].join('\n'),
    ).toEqual([])
  })
})
