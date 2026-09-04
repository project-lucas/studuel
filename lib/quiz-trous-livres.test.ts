import { describe, expect, it } from 'vitest'
import { decouperTrou, enonceParle } from '@/lib/quiz-trous'
import { migrationSql } from '@/lib/migrations-lecture'

// LA GARDE ENTRE LA FORME ET LE CONTENU.
//
// `lib/quiz-trous.test.ts` vérifie le découpeur ; celui-ci vérifie que les
// énoncés RÉELLEMENT LIVRÉS aux élèves passent dedans. Les deux ne se
// remplacent pas : la forme à trous a d'abord existé pendant vingt-quatre
// heures sans qu'une seule question du catalogue ne l'active — un module pur,
// testé, et invisible.
//
// Le mode de défaillance surveillé est silencieux : un énoncé à DEUX creux est
// refusé par `decouperTrou` (deux creux demanderaient deux réponses), et la
// question s'affiche alors avec ses soulignés bruts, sans que rien n'échoue.
// Le générateur le refuse déjà à la source ; ici on le revérifie sur le SQL
// effectivement produit, qui est ce que la base recevra.

describe('les énoncés livrés par la 350 se lisent bien comme des trous', () => {
  const enonces = [
    ...migrationSql('350_questions_a_trous.sql').matchAll(/::uuid, '((?:[^']|'')*)', '/g),
  ].map((m) => m[1].replaceAll("''", "'"))

  it('la migration porte bien les questions reformulées', () => {
    // Plancher, pas compte exact : en ajouter renforce la garde au lieu de la
    // casser. Zéro, en revanche, signifie que la regex a cessé de mordre — et
    // la garde ne garderait plus rien.
    expect(enonces.length).toBeGreaterThanOrEqual(100)
  })

  it('chaque énoncé se découpe autour d’un creux unique', () => {
    for (const e of enonces) {
      expect(decouperTrou(e), `énoncé non découpable : ${e}`).not.toBeNull()
    }
  })

  it('s’entend correctement une fois le trou rempli', () => {
    expect(enonceParle('*Quiero que ___ manana.*', 'vengas')).toBe(
      '*Quiero que vengas manana.*',
    )
  })
})
