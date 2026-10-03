import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import ApercuRecord, { resumeRecord } from '@/components/moi/ApercuRecord'
import { recordSemaine } from '@/lib/moi/record'
import type { JourTravail } from '@/lib/moi/temps'

const JEUDI = '2026-10-01'
const jour = (day: string, minutes: number): JourTravail => ({ day, seconds: minutes * 60 })

// Un record de 3 h 05 mi-septembre, 2 h 40 depuis lundi.
const HISTOIRE: JourTravail[] = [
  jour('2026-09-14', 60),
  jour('2026-09-16', 65),
  jour('2026-09-19', 60),
  jour('2026-09-28', 35),
  jour('2026-09-29', 50),
  jour('2026-09-30', 20),
  jour('2026-10-01', 55),
]

afterEach(cleanup)

describe('ApercuRecord — la tuile du record de la semaine', () => {
  it('en course : la semaine au cœur, le record à battre, ce qui manque', () => {
    render(<ApercuRecord record={recordSemaine(HISTOIRE, JEUDI)} />)
    expect(screen.getByText('2 h 40')).toBeTruthy()
    expect(screen.getByText('Record à battre')).toBeTruthy()
    expect(screen.getByText('3 h 05')).toBeTruthy()
    expect(screen.getByText('Encore 25 min').getAttribute('data-ton')).toBe('vue')
  })

  it('battu : l’ancien record, l’avance en or', () => {
    render(<ApercuRecord record={recordSemaine([...HISTOIRE, jour('2026-10-01', 40)], JEUDI)} />)
    expect(screen.getByText('3 h 20')).toBeTruthy()
    expect(screen.getByText('Ancien record')).toBeTruthy()
    expect(screen.getByText('Battu de 15 min').getAttribute('data-ton')).toBe('battu')
  })

  it('marque aujourd’hui et laisse les jours à venir en pointillé', () => {
    const { container } = render(<ApercuRecord record={recordSemaine(HISTOIRE, JEUDI)} />)
    const jours = [...container.querySelectorAll('[title], [data-a-venir]')]
    expect(jours).toHaveLength(7)
    expect(container.querySelector('[data-aujourdhui]')?.getAttribute('title')).toBe('jeudi : 55 min')
    expect(container.querySelectorAll('[data-a-venir]')).toHaveLength(3)
  })

  it('compte neuf : une invitation, pas de fanion de record', () => {
    const { container } = render(<ApercuRecord record={recordSemaine([], JEUDI)} />)
    expect(screen.getByText('À toi de le poser')).toBeTruthy()
    // Ni arc, ni fanion : seule la piste de l'anneau est dessinée.
    expect(container.querySelectorAll('svg circle')).toHaveLength(1)
  })
})

describe('resumeRecord — ce que le bouton dit au lecteur d’écran', () => {
  it('dit la semaine, le record et ce qui manque', () => {
    expect(resumeRecord(recordSemaine(HISTOIRE, JEUDI))).toBe(
      '2 h 40 de travail cette semaine. Record à battre : 3 h 05. Encore 25 min.',
    )
  })

  it('sans record, ne nomme pas de cible', () => {
    expect(resumeRecord(recordSemaine([], JEUDI))).toBe('0 min de travail cette semaine. À toi de le poser.')
  })
})
