import { describe, expect, it } from 'vitest'
import { fichePdfDe, hrefFichePdf, nomApercu, nomDeTelechargement, nomPdf } from './pdf'
import { FICHES_PDF } from './registre'

const [unChapitre, uneFiche] = Object.entries(FICHES_PDF)[0]

describe('lib/fiches/pdf', () => {
  it('retrouve une fiche par son chapitre, et rien pour un chapitre sans fiche', () => {
    expect(fichePdfDe(unChapitre)).toEqual(uneFiche)
    expect(fichePdfDe('00000000-0000-0000-0000-000000000000')).toBeNull()
  })

  it('nomme les objets comme la policy fiche_pdf_acces (563) les attend', () => {
    expect(nomPdf(unChapitre)).toBe(`${unChapitre}.pdf`)
    expect(nomApercu(unChapitre)).toBe(`${unChapitre}.webp`)
  })

  it('adresse la route de l’app, avec ?dl=1 pour enregistrer', () => {
    expect(hrefFichePdf('abc')).toBe('/api/fiches/abc')
    expect(hrefFichePdf('abc', { telecharger: true })).toBe('/api/fiches/abc?dl=1')
  })

  it('donne un nom de fichier sans accent ni apostrophe, toujours en .pdf', () => {
    expect(nomDeTelechargement({ titreAffiche: 'Calcul intégral', niveau: 'Tle' })).toBe('Calcul integral - Tle.pdf')
    expect(nomDeTelechargement({ titreAffiche: 'L’évolution des espèces : la sélection', niveau: '3e' })).toBe(
      'L evolution des especes la selection - 3e.pdf',
    )
    expect(nomDeTelechargement({ titreAffiche: '★★★', niveau: '' })).toBe('Fiche de revision.pdf')
  })
})
