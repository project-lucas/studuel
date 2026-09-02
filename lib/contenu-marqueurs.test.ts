import { readdirSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

import { alerte, chaine, formule, jalon } from './lesson-markdown'

// -----------------------------------------------------------------------------
// LE CONTENU CONTRE SON PROPRE MARKDOWN.
//
// `LessonRichContent` ne rend qu'un sous-ensemble fermé, et sa règle de repli
// est silencieuse : une ligne qu'il ne reconnaît pas devient un PARAGRAPHE, et
// son marqueur s'affiche tel quel à l'écran. « ~ BE + verbe en -ing », écrit
// sans flèche, ne produit donc pas une chaîne — il produit un tilde visible au
// milieu d'un cours d'anglais.
//
// Ce défaut ne casse rien : ni le build, ni les tests de rendu, ni la
// génération SQL. Il se voit seulement sur l'écran d'un élève. Cinq lignes de ce
// genre ont été écrites puis rattrapées le 01/09/2026 ; ce test est là pour que
// la sixième ne parte pas en production.
//
// Il lit les modules de `scripts/contenu`, c'est-à-dire LA SOURCE des 2 353
// cours — pas un échantillon.
// -----------------------------------------------------------------------------

type Lecon = { titre: string; cours: string }
type Chapitre = { lecon?: Lecon; lecons?: Lecon[] }
type Bloc = { chapitres?: Chapitre[] }
type Module = { blocs?: Bloc[] }

const DOSSIER = path.resolve(process.cwd(), 'scripts/contenu')

async function tousLesCours(): Promise<{ module: string; lecon: string; cours: string }[]> {
  const out: { module: string; lecon: string; cours: string }[] = []
  for (const f of readdirSync(DOSSIER).filter((f) => f.endsWith('.mjs'))) {
    const mod = (await import(pathToFileURL(path.join(DOSSIER, f)).href))
      .default as Module | undefined
    for (const bloc of mod?.blocs ?? []) {
      for (const ch of bloc.chapitres ?? []) {
        for (const l of ch.lecons ?? (ch.lecon ? [ch.lecon] : [])) {
          out.push({ module: f, lecon: l.titre, cours: l.cours })
        }
      }
    }
  }
  return out
}

describe('les marqueurs des cours', () => {
  it('n’en laisse AUCUN orphelin dans les 2 353 cours du dépôt', async () => {
    const cours = await tousLesCours()
    expect(cours.length).toBeGreaterThan(2000)

    const orphelins: string[] = []
    for (const { module, lecon, cours: texte } of cours) {
      for (const brut of texte.split('\n')) {
        const t = brut.trim()
        if (!t) continue
        const faute = (quoi: string) =>
          orphelins.push(`${module} · ${lecon} · ${quoi} · ${t.slice(0, 70)}`)

        // `!>` sans espace, ou `= ` sans texte : le repli affiche le marqueur.
        if (t.startsWith('!>') && alerte(t) === null) faute('alerte mal formée')
        if (t.startsWith('=') && formule(t) === null) faute('formule mal formée')
        // Un jalon sans tiret cadratin n'a pas d'événement : pas de frise.
        if (t.startsWith('@') && jalon(t) === null) faute('jalon sans tiret cadratin')
        // Une chaîne d'un seul maillon n'est pas un schéma : pas de chaîne.
        if (t.startsWith('~') && chaine(t) === null) faute('chaîne sans flèche')
      }
    }

    expect(orphelins, orphelins.join('\n')).toEqual([])
    // TIMEOUT EXPLICITE. Ce test ouvre et scanne les 65 modules de contenu,
    // soit plusieurs megaoctets. Seul il tient en 2 s ; lance en parallele du
    // reste de la suite il a depasse les 5 s par defaut et vire au rouge sans
    // qu'aucun cours ne soit fautif. Un test rouge par LENTEUR apprend a
    // ignorer le rouge.
  }, 30_000)
})
