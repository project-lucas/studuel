import { describe, expect, it } from 'vitest'
import { creerVerrouDefilement, type CibleDefilement } from '@/lib/scroll-lock'

/** Un `document.body` de papier : le verrou n'a besoin que de ça. */
function cible(overflow = ''): CibleDefilement {
  return { style: { overflow } }
}

describe('verrou de défilement', () => {
  it('bloque le défilement à la prise et le rend à la libération', () => {
    const corps = cible()
    const verrouiller = creerVerrouDefilement(() => corps)

    const liberer = verrouiller()
    expect(corps.style.overflow).toBe('hidden')

    liberer()
    expect(corps.style.overflow).toBe('')
  })

  it('rend la valeur inline d’origine, et pas une chaîne vide', () => {
    // Un composant qui verrouille alors que la page portait déjà un réglage ne
    // doit pas le lui voler en partant.
    const corps = cible('auto')
    const verrouiller = creerVerrouDefilement(() => corps)

    verrouiller()()

    expect(corps.style.overflow).toBe('auto')
  })

  it('reste bloqué tant que TOUS les verrous ne sont pas rendus', () => {
    // Le défaut corrigé : deux verrous qui se chevauchent. Avec l’ancien motif
    // « sauvegarde / restaure », le second enregistrait 'hidden' comme valeur
    // précédente et la restaurait — la page ne se déverrouillait plus jamais.
    const corps = cible()
    const verrouiller = creerVerrouDefilement(() => corps)

    const libererSplash = verrouiller()
    const libererDialogue = verrouiller()
    expect(verrouiller.profondeur()).toBe(2)

    // Le dialogue se ferme le premier : l’écran de chargement est encore là.
    libererDialogue()
    expect(corps.style.overflow).toBe('hidden')

    libererSplash()
    expect(corps.style.overflow).toBe('')
    expect(verrouiller.profondeur()).toBe(0)
  })

  it('ignore une libération rejouée', () => {
    // React rejoue les nettoyages d’effet (deux fois au montage en mode strict).
    // Un décompte en double rouvrirait le défilement sous une feuille ouverte.
    const corps = cible()
    const verrouiller = creerVerrouDefilement(() => corps)

    const libererFeuille = verrouiller()
    const libererDialogue = verrouiller()

    libererDialogue()
    libererDialogue()
    libererDialogue()

    expect(verrouiller.profondeur()).toBe(1)
    expect(corps.style.overflow).toBe('hidden')

    libererFeuille()
    expect(corps.style.overflow).toBe('')
  })

  it('ne descend jamais sous zéro, même en libérant dans le désordre', () => {
    const corps = cible()
    const verrouiller = creerVerrouDefilement(() => corps)

    const a = verrouiller()
    const b = verrouiller()
    const c = verrouiller()

    b()
    a()
    c()

    expect(verrouiller.profondeur()).toBe(0)
    expect(corps.style.overflow).toBe('')
  })

  it('reprend correctement après un cycle complet', () => {
    // Le deuxième cycle doit repartir de la valeur rendue, pas de 'hidden'.
    const corps = cible('auto')
    const verrouiller = creerVerrouDefilement(() => corps)

    verrouiller()()
    expect(corps.style.overflow).toBe('auto')

    const liberer = verrouiller()
    expect(corps.style.overflow).toBe('hidden')
    liberer()
    expect(corps.style.overflow).toBe('auto')
  })

  it('ne fait rien et ne casse rien sans cible (rendu serveur)', () => {
    const verrouiller = creerVerrouDefilement(() => null)

    const liberer = verrouiller()

    expect(verrouiller.profondeur()).toBe(0)
    expect(() => liberer()).not.toThrow()
  })
})
