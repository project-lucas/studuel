// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { markAppReady, resetAppReady } from '@/lib/app-ready'
import { POSE_MS } from '@/lib/scene-prete'

// Le son passe par l'AudioContext, absent de jsdom : on ne teste pas la note,
// seulement qu'elle est demandée au bon moment.
const correct = vi.fn()
vi.mock('@/lib/sounds', () => ({ sfx: { tap: vi.fn(), correct: () => correct() } }))
// Les deux feuilles ne s'ouvrent qu'au tap : inutiles ici, et lourdes.
vi.mock('@/components/YearHistory', () => ({ default: () => null }))
vi.mock('@/components/AddExamSheet', () => ({ default: () => null }))

import SerieBar from './SerieBar'

const TODAY = '2026-09-22' // un mardi
const CLE = `studuel:serie:validee:2:${TODAY}`
const semaine = (mardiFait: boolean) =>
  Array.from({ length: 7 }, (_, i) => ({
    done: i === 1 ? mardiFait : false,
    isToday: i === 1,
    isFuture: i > 1,
  }))

function rendre(mardiFait: boolean) {
  return render(
    <SerieBar
      streak={mardiFait ? 1 : 0}
      week={semaine(mardiFait)}
      today={TODAY}
      controles={[]}
      subjectMeta={{}}
      subjects={[]}
      goalMinutes={15}
    />,
  )
}

/** La scène est prête : premier écran peint, pas de rideau, onglet visible, temps de pose écoulé. */
async function scenePrete() {
  await act(async () => {
    markAppReady()
    vi.advanceTimersByTime(POSE_MS + 50)
  })
}

describe('SerieBar — la validation du jour', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    resetAppReady()
    window.localStorage.clear()
    correct.mockClear()
    document.body.className = ''
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true })
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('se joue UNE fois quand le jour est fait, une fois la scène prête', async () => {
    await act(async () => {
      rendre(true)
    })
    const mardi = screen.getByRole('img', { name: /mardi 22 — fait/ })
    // Rien tant que le premier écran n'est pas peint : la coche est posée, la
    // vague fait son travail, le marqueur n'est pas écrit.
    expect(mardi.className).toContain('wave-in')
    expect(window.localStorage.getItem(CLE)).toBeNull()

    await scenePrete()
    expect(mardi.className).toContain('jour-valide')
    expect(mardi.className).not.toContain('wave-in')
    expect(mardi.querySelector('.jour-valide-onde')).not.toBeNull()
    expect(correct).toHaveBeenCalledTimes(1)
    expect(window.localStorage.getItem(CLE)).toBe('1')
  })

  it('ne rejoue pas aux visites suivantes du même jour : la coche est posée', async () => {
    window.localStorage.setItem(CLE, '1')
    await act(async () => {
      rendre(true)
    })
    await scenePrete()
    const mardi = screen.getByRole('img', { name: /mardi 22 — fait/ })
    expect(mardi.className).toContain('wave-in')
    expect(mardi.className).not.toContain('jour-valide')
    expect(mardi.querySelector('.jour-valide-onde')).toBeNull()
    expect(correct).not.toHaveBeenCalled()
  })

  it('ne fait rien tant que le jour n’est pas fait', async () => {
    await act(async () => {
      rendre(false)
    })
    await scenePrete()
    expect(window.localStorage.getItem(CLE)).toBeNull()
    expect(correct).not.toHaveBeenCalled()
    expect(document.querySelector('.jour-valide')).toBeNull()
  })

  it('attend que le rideau de chargement soit parti', async () => {
    document.body.innerHTML = '<div class="splash"></div>'
    const { container } = rendre(true)
    document.body.appendChild(container)
    await scenePrete()
    expect(window.localStorage.getItem(CLE)).toBeNull()
    expect(correct).not.toHaveBeenCalled()
    // Le rideau se démonte : la validation part au pas suivant, après la pose.
    document.querySelector('.splash')?.remove()
    await act(async () => {
      vi.advanceTimersByTime(100 + POSE_MS + 50)
    })
    expect(correct).toHaveBeenCalledTimes(1)
    expect(window.localStorage.getItem(CLE)).toBe('1')
  })
})
