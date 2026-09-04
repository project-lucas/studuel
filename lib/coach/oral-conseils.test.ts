import { describe, it, expect } from 'vitest'
import {
  CONSIGNE_ORAL,
  MAX_SUJET_LEN,
  ficheOral,
  lireConseils,
} from '@/lib/coach/oral-conseils'
import { CRITERES_VIDES } from '@/lib/coach/oral'

const bilan = {
  epreuveId: 'grand-oral' as const,
  sujet: 'Les ondes sonores et la santé auditive',
  secondes: 200,
  criteres: { ...CRITERES_VIDES, intro: true },
}

describe('ficheOral', () => {
  it('dit l’épreuve, le sujet, la durée et les cases', () => {
    const fiche = ficheOral(bilan)
    expect(fiche).toContain('Grand oral')
    expect(fiche).toContain('ondes sonores')
    expect(fiche).toContain('Durée tenue')
    expect(fiche).toContain('intro claire')
  })

  it('mesure l’écart à la durée attendue, dans les deux sens', () => {
    // C'est le premier conseil d'un professeur devant un oral blanc : « tu as
    // parlé trois minutes, on t'en demande cinq ».
    expect(ficheOral({ ...bilan, secondes: 60 })).toContain('de MOINS')
    expect(ficheOral({ ...bilan, secondes: 1_200 })).toContain('de PLUS')
    expect(ficheOral({ ...bilan, secondes: 600 })).toContain('dans la cible')
  })

  it('sépare ce qui est acquis de ce qui manque', () => {
    const fiche = ficheOral(bilan)
    expect(fiche).toContain('Ce qu’il estime avoir réussi : intro claire')
    expect(fiche).toContain('Ce qui manque encore')
    expect(fiche).toContain('plan annoncé')
  })

  it('borne le sujet et écrase les espaces', () => {
    const fiche = ficheOral({ ...bilan, sujet: 'a'.repeat(400) })
    expect(fiche).toContain('a'.repeat(MAX_SUJET_LEN))
    expect(fiche).not.toContain('a'.repeat(MAX_SUJET_LEN + 1))
  })

  it('ne contient RIEN de la voix ni du fichier audio', () => {
    // Le garde-fou du fichier : la promesse de l'atelier est que l'audio ne
    // quitte jamais l'appareil. Ce test échouerait le jour où quelqu'un
    // glisserait un blob, une URL ou une transcription dans la fiche.
    const fiche = ficheOral(bilan).toLowerCase()
    for (const interdit of ['blob', 'audio', 'base64', 'data:', 'http', 'transcri']) {
      expect(fiche, interdit).not.toContain(interdit)
    }
  })

  it('la consigne interdit de juger la voix et de noter', () => {
    expect(CONSIGNE_ORAL).toContain('PAS entendu')
    expect(CONSIGNE_ORAL).toContain('aucune note')
  })
})

describe('lireConseils', () => {
  it('découpe les lignes et retire les puces', () => {
    expect(
      lireConseils('- Annonce ton plan.\n- Ralentis l’intro.\n\n* Termine net.'),
    ).toEqual(['Annonce ton plan.', 'Ralentis l’intro.', 'Termine net.'])
  })

  it('retire aussi la numérotation', () => {
    expect(lireConseils('1. Pose ta problématique.')).toEqual([
      'Pose ta problématique.',
    ])
  })

  it('en garde quatre au maximum', () => {
    const six = Array.from({ length: 6 }, (_, i) => `- conseil ${i}`).join('\n')
    expect(lireConseils(six)).toHaveLength(4)
  })

  it('rend une liste vide sur une réponse vide', () => {
    expect(lireConseils('')).toEqual([])
    expect(lireConseils('\n\n-\n')).toEqual([])
  })
})
