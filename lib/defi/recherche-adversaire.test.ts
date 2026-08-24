import { describe, it, expect } from 'vitest'
import {
  annonceRecherche,
  SEUIL_TROUVE,
} from '@/lib/defi/recherche-adversaire'

// Ce que ces tests gardent : l'annonce bascule AVANT la fin de la recherche.
// C'est une seule comparaison, et la perdre rendrait l'écran figé pendant deux
// secondes, ce que l'élève lit comme un blocage.
//
// La ligne « Délai estimé » a été retirée de l'écran (l'attente est dite par
// les trois points animés du titre), et sa fonction avec elle.

describe('annonceRecherche', () => {
  it('ne grave PAS les points de suspension dans le texte', () => {
    // Ils sont rendus un par un par la vue et animés en CSS : gravés ici, ils
    // seraient figés, et il faudrait les retirer de l'annonce de fin.
    expect(annonceRecherche(0)).not.toMatch(/[.…]$/)
  })

  it('cherche tant que le seuil n’est pas franchi', () => {
    expect(annonceRecherche(0)).toMatch(/Recherche/)
    expect(annonceRecherche(SEUIL_TROUVE - 0.01)).toMatch(/Recherche/)
  })

  it('annonce la trouvaille AVANT la fin', () => {
    // La bascule doit tomber strictement avant 1 : annoncée au dernier
    // instant, elle partirait avec la navigation et personne ne la lirait.
    expect(SEUIL_TROUVE).toBeLessThan(1)
    expect(annonceRecherche(SEUIL_TROUVE)).toMatch(/trouvé/)
    expect(annonceRecherche(1)).toMatch(/trouvé/)
  })
})
