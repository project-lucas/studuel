import { describe, expect, it } from 'vitest'
import { PAGE_POSTGREST, toutLire } from './postgrest-pages'

/** Une « table » de n lignes servie par pages inclusives, comme PostgREST. */
function tableDe(n: number) {
  const rows = Array.from({ length: n }, (_, i) => ({ id: i }))
  const appels: [number, number][] = []
  const page = async (from: number, to: number) => {
    appels.push([from, to])
    return { data: rows.slice(from, to + 1), error: null }
  }
  return { page, appels }
}

describe('toutLire', () => {
  it('une seule page quand la table tient dedans', async () => {
    const t = tableDe(42)
    const { data, error } = await toutLire(t.page, 1000)
    expect(error).toBeNull()
    expect(data).toHaveLength(42)
    expect(t.appels).toEqual([[0, 999]])
  })

  it('enchaîne les pages jusqu’à la page incomplète (2 323 chapitres)', async () => {
    const t = tableDe(2323)
    const { data } = await toutLire(t.page, 1000)
    expect(data).toHaveLength(2323)
    expect(data.at(-1)).toEqual({ id: 2322 })
    expect(t.appels).toEqual([
      [0, 999],
      [1000, 1999],
      [2000, 2999],
    ])
  })

  it('une table exactement multiple de la page demande une page vide de plus', async () => {
    const t = tableDe(2000)
    const { data } = await toutLire(t.page, 1000)
    expect(data).toHaveLength(2000)
    expect(t.appels).toHaveLength(3)
  })

  it('une table vide rend [] sans erreur', async () => {
    const t = tableDe(0)
    const { data, error } = await toutLire(t.page)
    expect(data).toEqual([])
    expect(error).toBeNull()
  })

  it('rend ce qui a été lu et l’erreur à la première page en échec', async () => {
    let n = 0
    const page = async (from: number, to: number) => {
      n += 1
      if (n === 2) return { data: null, error: { message: 'boom' } }
      return { data: Array.from({ length: to - from + 1 }, (_, i) => from + i), error: null }
    }
    const { data, error } = await toutLire(page, 10)
    expect(data).toHaveLength(10)
    expect(error).toEqual({ message: 'boom' })
  })

  it('la page par défaut est celle de PostgREST (1 000)', () => {
    expect(PAGE_POSTGREST).toBe(1000)
  })
})
