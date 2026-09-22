import { describe, expect, it } from 'vitest'
import {
  estChromeMasque,
  estEspaceParents,
  estOnboarding,
  estOnboardingCompte,
  estPleinEcran,
} from '@/lib/quiz-chrome'

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
    expect(estPleinEcran('/carnet')).toBe(false)
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
    expect(estEspaceParents('/parentsx')).toBe(false)
    expect(estOnboardingCompte('/onboarding-bis')).toBe(false)
  })

  it('masque le chrome sur l’onboarding d’un compte connecté', () => {
    // Trois questions dans le monde de /bienvenue : le bandeau et la barre
    // d'onglets passeraient sous (ou sur) l'écran fixé.
    expect(estOnboardingCompte('/onboarding')).toBe(true)
    expect(estChromeMasque('/onboarding')).toBe(true)
    expect(estChromeMasque('/onboarding?retour=compte')).toBe(true)
  })

  it('masque le chrome élève sur l’espace parents', () => {
    // Un parent ne joue pas : niveau, série et gemmes de SON compte sont
    // vides, et les cinq onglets ne lui sont pas destinés. L'espace porte son
    // propre en-tête.
    expect(estEspaceParents('/parents')).toBe(true)
    expect(estEspaceParents('/parents?volet=conseils')).toBe(true)
    expect(estChromeMasque('/parents')).toBe(true)
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
