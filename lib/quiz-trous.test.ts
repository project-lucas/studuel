import { describe, expect, it } from 'vitest'
import {
  MARQUE_TROU,
  MAX_CREUX,
  MIN_CREUX,
  decouperTrou,
  enonceParle,
  estTexteATrou,
  largeurDuCreux,
} from './quiz-trous'

describe('reconnaître un texte à trous', () => {
  it('découpe la phrase autour du trou', () => {
    expect(decouperTrou('La dérivée de x² est ___ sur ℝ.')).toEqual({
      avant: 'La dérivée de x² est ',
      apres: ' sur ℝ.',
    })
  })

  it('accepte un trou en TÊTE ou en FIN de phrase', () => {
    expect(decouperTrou('___ est la capitale du Royaume-Uni.')).toEqual({
      avant: '',
      apres: ' est la capitale du Royaume-Uni.',
    })
    expect(decouperTrou('Le passé simple de « to go » est ___')).toEqual({
      avant: 'Le passé simple de « to go » est ',
      apres: '',
    })
  })

  it('laisse un QCM ordinaire tranquille', () => {
    // Les 3 300 questions du catalogue n'ont pas de trou : elles doivent
    // continuer de s'afficher exactement comme avant.
    expect(decouperTrou('Que vaut 0! par convention ?')).toBeNull()
    expect(estTexteATrou('Que vaut 0! par convention ?')).toBe(false)
  })

  it('REFUSE une phrase à deux trous', () => {
    // Deux creux demanderaient deux réponses, donc un autre modèle de
    // correction. Refusé ici plutôt que deviné : l'énoncé s'affiche alors avec
    // ses soulignés visibles, ce qui saute aux yeux en relecture.
    expect(decouperTrou(`Le ___ précède le ___ .`)).toBeNull()
  })

  it('ne se laisse pas prendre par un souligné isolé', () => {
    expect(decouperTrou('Le fichier s’appelle mon_fichier.')).toBeNull()
    expect(decouperTrou('Deux __ soulignés ne font pas un trou.')).toBeNull()
  })

  it('encaisse une entrée absurde', () => {
    expect(decouperTrou('')).toBeNull()
    expect(decouperTrou(undefined as unknown as string)).toBeNull()
  })

  it('utilise EXACTEMENT trois soulignés', () => {
    expect(MARQUE_TROU).toBe('___')
    expect(estTexteATrou(`a ${MARQUE_TROU} b`)).toBe(true)
  })
})

describe('la phrase dite à voix haute', () => {
  it('remplace le creux par le mot choisi', () => {
    // Un lecteur d'écran annonce « souligné souligné souligné » sur « ___ », ou
    // rien du tout. La phrase entière est la seule façon d'entendre l'exercice.
    expect(enonceParle('La capitale est ___ .', 'Londres')).toBe(
      'La capitale est Londres .',
    )
  })

  it('dit « blanc » tant que rien n’est choisi', () => {
    expect(enonceParle('La capitale est ___ .')).toBe('La capitale est blanc .')
    expect(enonceParle('La capitale est ___ .', '   ')).toBe(
      'La capitale est blanc .',
    )
  })

  it('rend l’énoncé tel quel quand il n’a pas de trou', () => {
    expect(enonceParle('Que vaut 0! ?', 'x')).toBe('Que vaut 0! ?')
  })
})

describe('la largeur du creux', () => {
  it('suit la PLUS LONGUE option, pas la bonne réponse', () => {
    // Un creux taillé sur la réponse juste la désignerait à l'œil avant même
    // qu'on ait lu les propositions.
    expect(largeurDuCreux(['oui', 'absolument pas'])).toBe('absolument pas'.length)
  })

  it('reste dans ses bornes', () => {
    expect(largeurDuCreux(['a'])).toBe(MIN_CREUX)
    expect(largeurDuCreux(['une option beaucoup trop bavarde pour un creux'])).toBe(
      MAX_CREUX,
    )
  })

  it('encaisse une liste vide ou abîmée', () => {
    expect(largeurDuCreux([])).toBe(MIN_CREUX)
    expect(largeurDuCreux(undefined as unknown as string[])).toBe(MIN_CREUX)
  })
})
