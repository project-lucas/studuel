import { describe, expect, it } from 'vitest'
import { migrationSql } from '@/lib/migrations-lecture'
import { lireContenu, quizReussi, SEUIL_QUIZ_REUSSI } from '@/lib/capsules'

// -----------------------------------------------------------------------------
// LE CONTENU DES CAPSULES DE LANCEMENT (migration 367) PASSE PAR LE VRAI
// LECTEUR DE L'APP. Une capsule dont un élément ne se lit pas s'affiche « en
// préparation » (lireContenu rend null) — un élève l'aurait payée pour rien.
// Ce fichier n'est jamais exécuté par l'outillage avant d'être collé à la main
// dans Supabase : ce test est le seul contrôle entre la rédaction et l'élève.
// -----------------------------------------------------------------------------

const SQL = migrationSql('367_capsules_contenu.sql')
const LIGNE = /\('([a-z0-9-]+)',\s*'(cours|fiche|quiz|outil)',\s*'([^']*)',\s*\$j\$([\s\S]*?)\$j\$::jsonb\)/g

function elementsParCapsule(): Map<string, { type: string; titre: string; contenu: unknown }[]> {
  const parCapsule = new Map<string, { type: string; titre: string; contenu: unknown }[]>()
  for (const m of SQL.matchAll(LIGNE)) {
    const [, id, type, titre, json] = m
    const liste = parCapsule.get(id) ?? []
    liste.push({ type, titre, contenu: JSON.parse(json) })
    parCapsule.set(id, liste)
  }
  return parCapsule
}

describe('les six capsules de lancement', () => {
  const capsules = elementsParCapsule()

  it('sont toutes là, avec leurs quatre éléments', () => {
    expect([...capsules.keys()].sort()).toEqual(
      ['argent', 'methode', 'nutrition', 'orientation', 'sommeil', 'stress'],
    )
    for (const elements of capsules.values()) {
      expect(elements.map((e) => e.type).sort()).toEqual(['cours', 'fiche', 'outil', 'quiz'])
    }
  })

  it('se lisent entières par l’app, sans rien perdre', () => {
    for (const [id, elements] of capsules) {
      const contenu = lireContenu(elements)
      expect(contenu, id).not.toBeNull()
      const brut = elements.find((e) => e.type === 'quiz')?.contenu as { questions: unknown[] }
      expect(contenu?.quiz.contenu.questions.length, id).toBe(brut.questions.length)
    }
  })

  it('ont un quiz réussissable : huit questions, bonnes réponses variées', () => {
    for (const [id, elements] of capsules) {
      const contenu = lireContenu(elements)
      const questions = contenu?.quiz.contenu.questions ?? []
      expect(questions, id).toHaveLength(8)
      expect(new Set(questions.map((q) => q.bonne)).size, id).toBeGreaterThan(1)
      expect(quizReussi(Math.ceil(questions.length * SEUIL_QUIZ_REUSSI), questions.length)).toBe(true)
    }
  })

  it('n’utilisent jamais l’apostrophe droite dans leurs textes', () => {
    // Une apostrophe droite dans un texte fermerait la chaîne SQL au milieu
    // d'une phrase : la migration casserait dans l'éditeur de Supabase.
    for (const elements of capsules.values()) {
      for (const e of elements) expect(JSON.stringify(e.contenu)).not.toContain("'")
    }
  })
})
