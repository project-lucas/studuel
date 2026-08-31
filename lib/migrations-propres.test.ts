import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const SUPABASE = path.join(ROOT, 'supabase')

// -----------------------------------------------------------------------------
// AUCUNE MIGRATION NE DOIT CONTENIR LA SORTIE DE SON GÉNÉRATEUR (31/08/2026).
//
// CE QUI S'EST PASSÉ. `scripts/seed-contenu.mjs` écrit la migration sur STDOUT
// et son résumé (« ✓ 9 chapitres · 9 leçons · 9 quiz · 72 questions ») sur
// STDERR. La commande de génération de la 327 a été écrite avec `2>&1` : les
// deux flux ont fusionné, et la ligne de résumé s'est retrouvée EN DERNIÈRE
// LIGNE du fichier .sql.
//
// Le fichier paraissait parfait — 50 Ko, en-tête complet, 9 fiches, un bloc de
// vérification final. Il a passé la relecture, il a été annoncé comme livré, et
// il a explosé dans l'éditeur SQL de Supabase :
//
//     ERROR: 42601: syntax error at or near "✓"
//
// POURQUOI UN TEST, ET PAS SEULEMENT DE LA VIGILANCE. Ces fichiers ne sont
// jamais exécutés par l'outillage : la convention du projet veut qu'ils soient
// collés À LA MAIN dans le SQL Editor. Rien, dans toute la chaîne, ne lit un
// fichier de migration avant qu'un humain ne le colle en production. C'est le
// seul endroit du dépôt où une faute de frappe voyage jusqu'au bout sans
// rencontrer un seul contrôle — d'où celui-ci.
//
// CE QU'IL VÉRIFIE. Toute ligne d'un .sql doit pouvoir COMMENCER une ligne de
// SQL : un commentaire, une instruction, une valeur. Une ligne qui débute par
// un caractère décoratif (✓, ✗, ⚠, →, •) vient forcément d'une console.
// -----------------------------------------------------------------------------

/** Caractères qui ne peuvent jamais ouvrir une ligne de SQL exécutable. */
const DEBUTS_INTERDITS = /^\s*[✓✗⚠→←•▸●※]/u

/** Le résumé exact qu'écrit `seed-contenu.mjs` sur stderr. */
const RESUME_GENERATEUR = /^\s*✓\s*\d+\s+chapitres/u

type Faute = { fichier: string; ligne: number; texte: string }

describe('les migrations SQL sont exécutables telles quelles', () => {
  const fichiers = readdirSync(SUPABASE).filter((f) => f.endsWith('.sql'))

  it('trouve bien les migrations du dépôt', () => {
    // Garde-fou du garde-fou : si le dossier était vide ou renommé, les deux
    // tests ci-dessous passeraient au vert sans rien avoir vérifié.
    expect(fichiers.length).toBeGreaterThan(100)
  })

  it('ne contient aucune sortie de console', () => {
    const fautes: Faute[] = []
    for (const f of fichiers) {
      const lignes = readFileSync(path.join(SUPABASE, f), 'utf8').split('\n')
      lignes.forEach((texte, i) => {
        if (DEBUTS_INTERDITS.test(texte)) {
          fautes.push({ fichier: f, ligne: i + 1, texte: texte.trim().slice(0, 70) })
        }
      })
    }

    const rendu = fautes.map((x) => `${x.fichier}:${x.ligne}  ${x.texte}`)
    expect(
      rendu,
      rendu.length === 0
        ? ''
        : `Sortie de console dans un fichier de migration :\n  ${rendu.join('\n  ')}\n` +
            `\nCause la plus probable : la commande de génération redirige stderr` +
            ` vers le fichier (\`2>&1\`). Le générateur écrit le SQL sur stdout et` +
            ` son résumé sur stderr — il ne faut JAMAIS les fusionner.` +
            `\nRegénérer avec : node scripts/seed-contenu.mjs --num NNN --modules X > supabase/NNN_….sql`,
    ).toEqual([])
  })

  it('les migrations de contenu se terminent par leur bloc de vérification', () => {
    // Le générateur clôt chaque migration de contenu par un bloc DO $$ … END $$;
    // qui compte les chapitres posés. Un fichier tronqué (copie partielle,
    // redirection interrompue) perd cette fin — et poserait un contenu
    // incomplet sans que rien ne le signale.
    //
    // LE PÉRIMÈTRE SE LIT DANS LE FICHIER, PAS DANS SON NOM. Les seeds 086 → 100
    // sont antérieurs à `seed-contenu.mjs` : écrits à la main, ils n'ont jamais
    // eu de bloc de vérification, et l'exiger d'eux ferait un test rouge en
    // permanence — c'est-à-dire un test qu'on apprend à ignorer. On ne contrôle
    // donc que les fichiers qui se déclarent GÉNÉRÉS, seuls concernés par le
    // mode de défaillance visé (une redirection de flux mal écrite).
    const MARQUE = 'FICHIER GÉNÉRÉ'
    const contenus = fichiers.filter(
      (f) =>
        /^\d{3}_contenu_/.test(f) &&
        readFileSync(path.join(SUPABASE, f), 'utf8').includes(MARQUE),
    )
    expect(contenus.length).toBeGreaterThan(20)

    const tronques = contenus.filter((f) => {
      const txt = readFileSync(path.join(SUPABASE, f), 'utf8').trimEnd()
      return !txt.endsWith('END $$;')
    })

    expect(
      tronques,
      tronques.length === 0
        ? ''
        : `Migration(s) de contenu sans bloc de vérification final :\n  ${tronques.join('\n  ')}\n` +
            `\nUne migration de contenu doit se terminer par « END $$; ». Un fichier` +
            ` qui s'arrête avant est tronqué : le regénérer entièrement.`,
    ).toEqual([])

    // Vérifie aussi que ce résumé du générateur n'a pas fini DANS le fichier.
    const pollues = contenus.filter((f) =>
      readFileSync(path.join(SUPABASE, f), 'utf8')
        .split('\n')
        .some((l) => RESUME_GENERATEUR.test(l)),
    )
    expect(pollues, `Résumé du générateur trouvé dans : ${pollues.join(', ')}`).toEqual([])
  })
})
