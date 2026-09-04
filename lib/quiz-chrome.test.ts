import { describe, expect, it } from 'vitest'
import { estChromeMasque, estOnboarding, estPleinEcran } from '@/lib/quiz-chrome'

describe('estPleinEcran', () => {
  it('masque le chrome sur une session de quiz ouverte', () => {
    expect(estPleinEcran('/test/abc-123')).toBe(true)
    // La course du duel classé : une matière, en plein écran ; le préfixe seul
    // (qui n'est pas une page) garde son chrome comme toute liste.
    expect(estPleinEcran('/defi/programme/maths')).toBe(true)
    expect(estPleinEcran('/defi/programme/histoire-geo?n=2')).toBe(true)
    expect(estPleinEcran('/defi/programme')).toBe(false)
    expect(estPleinEcran('/defi/programme/')).toBe(false)
  })

  it('le GARDE sur la liste des quiz', () => {
    // « /test » tout court est une page de navigation ordinaire : y masquer la
    // barre d'onglets enfermerait l'élève.
    expect(estPleinEcran('/test')).toBe(false)
    expect(estPleinEcran('/test/')).toBe(false)
  })

  it('ne se laisse pas prendre par une route qui COMMENCE pareil', () => {
    expect(estPleinEcran('/tests-blancs')).toBe(false)
    expect(estPleinEcran('/testament')).toBe(false)
  })

  it('masque le chrome sur une dictée — présentation ET session', () => {
    // Elles ont leur propre héros et leur propre bouton en bas : dans le
    // gabarit de l'app, ce bouton passait sous la barre d'onglets.
    expect(estPleinEcran('/reviser/francais/dictee/demo')).toBe(true)
    expect(estPleinEcran('/reviser/francais/dictee/demo/jouer')).toBe(true)
  })

  it('le GARDE sur la liste des dictées', () => {
    // Une page de navigation sans barre d'onglets enferme l'élève.
    expect(estPleinEcran('/reviser/francais/dictee')).toBe(false)
    expect(estPleinEcran('/reviser/francais/dictee/')).toBe(false)
  })

  it('le garde sur le reste de l’app', () => {
    for (const route of ['/', '/defi', '/reviser', '/moi', '/amis', '/tresor']) {
      expect(estPleinEcran(route), route).toBe(false)
    }
  })

  it('ignore la chaîne de requête', () => {
    expect(estPleinEcran('/test/abc-123?rejeu=1')).toBe(true)
    expect(estPleinEcran('/reviser?espace=carnet')).toBe(false)
  })

  it('garde le chrome quand le chemin est absent ou illisible', () => {
    // `x-pathname` peut manquer (rendu hors requête, test) : mieux vaut une
    // barre en trop qu'un élève sans navigation.
    expect(estPleinEcran('')).toBe(false)
    expect(estPleinEcran(undefined as unknown as string)).toBe(false)
    expect(estPleinEcran(null as unknown as string)).toBe(false)
  })
})

describe('estChromeMasque', () => {
  it('masque le chrome sur une session de quiz — le cas du 2026-08-28', () => {
    // Le défaut n'était pas dans ce verdict mais dans l'endroit où il était
    // rendu (layout racine, serveur, non re-rendu en navigation client). Ce
    // test fige le contrat que lisent désormais Navigation, TopHud et AppMain.
    expect(estChromeMasque('/test/abc-123')).toBe(true)
    expect(estChromeMasque('/reviser/francais/dictee/demo')).toBe(true)
  })

  it('masque le chrome sur le parcours d’accueil', () => {
    expect(estOnboarding('/bienvenue')).toBe(true)
    expect(estOnboarding('/bienvenue/3')).toBe(true)
    expect(estChromeMasque('/bienvenue')).toBe(true)
    expect(estChromeMasque('/bienvenue/3')).toBe(true)
  })

  it('ne se laisse pas prendre par une route qui COMMENCE pareil', () => {
    expect(estOnboarding('/bienvenue-parents')).toBe(false)
    expect(estChromeMasque('/bienvenue-parents')).toBe(false)
  })

  it('le garde partout ailleurs', () => {
    for (const route of ['/', '/defi', '/reviser', '/reviser/emc', '/moi', '/test']) {
      expect(estChromeMasque(route), route).toBe(false)
    }
  })

  it('ignore la chaîne de requête', () => {
    expect(estChromeMasque('/bienvenue?etape=2')).toBe(true)
    expect(estChromeMasque('/test/abc-123?rejeu=1')).toBe(true)
  })

  it('garde le chrome quand le chemin est absent ou illisible', () => {
    expect(estChromeMasque('')).toBe(false)
    expect(estChromeMasque(undefined as unknown as string)).toBe(false)
    expect(estChromeMasque(null as unknown as string)).toBe(false)
  })
})
