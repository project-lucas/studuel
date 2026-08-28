/**
 * Fabrique LES SIX ICÔNES DE SUPPORT — la rangée « Cours · Quiz · Flashcards ·
 * Fiches · Défi » (+ « Revoir mes erreurs ») :
 *   assets-sources/supports/*.png        (originaux, LOCAUX — hors dépôt)
 *     → public/images/supports/<kind>.webp   (256x256, fond transparent)
 *
 *   node scripts/supports-icones.mjs
 *
 * POURQUOI CE SCRIPT EXISTE
 *
 * Ces six icônes étaient des pictogrammes **Lucide** (`BookOpen`, `ListChecks`,
 * `Layers`, `FileText`, `Swords`, `Undo2`) : une bibliothèque gratuite,
 * installée en une commande. Or cette rangée EST l'offre du produit, et elle est
 * rendue à quatre endroits (écran de chapitre, pied de cours, onglet « Mode de
 * jeu », sous une fiche dépliée) — c'est, après la barre d'onglets, ce que
 * l'élève voit le plus. N'importe quel concurrent en sortait la copie exacte en
 * trois minutes. Le chrome système (croix, chevrons, engrenage) reste en trait,
 * lui : personne ne reconnaît une app à son bouton de fermeture.
 *
 * ET SURTOUT : LA TRAME. Le travail n'est pas de convertir cinq PNG en WebP —
 * `sharp` le ferait en trois lignes. Il est de leur donner la même TAILLE
 * PERÇUE. Les six icônes de la barre d'onglets venaient de lots différents et
 * occupaient leur canevas de 82 % à 96 %, avec une surface d'encre allant du
 * simple au tiers en plus : côte à côte, elles semblaient de tailles
 * différentes, ce qu'on lit comme un bug d'alignement et non comme un parti
 * pris. Égaliser les boîtes ne suffit pas, l'œil compare des TACHES. La méthode
 * et son raisonnement vivent dans scripts/lib/trame.mjs ; ici on ne garde que ce
 * qui est propre aux supports.
 *
 * LE DÉFI A SON PROPRE DESSIN — un bouclier violet frappé d'un éclair doré —
 * ET C'EST UN REVIREMENT ASSUMÉ. La première version reprenait les épées
 * croisées de l'onglet Défi, au nom du lien : même destination, même image. À
 * l'écran, la reprise ne s'est pas lue comme un lien mais comme un
 * copier-coller de l'onglet du centre, à quelques centimètres de lui — et les
 * épées, venues du lot de la barre d'onglets, étaient les seules de la rangée
 * en gamme froide (poignées bleu acier) au milieu de cinq objets violet et or.
 * Le bouclier dit l'affrontement dans la palette du lot, sans doublonner la
 * barre. Le trophée restait pris par l'onglet Amis, la couronne par les Figures
 * historiques : c'est ce qui a écarté les deux autres candidats évidents.
 */

import sharp from 'sharp'
import { access, mkdir } from 'node:fs/promises'
import { planDuLot } from './lib/trame.mjs'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC_DIR = 'assets-sources/supports'
const DEST_DIR = 'public/images/supports'

/** 256 px = plus de cinq fois la taille servie (44 px), marge pour les écrans denses. */
const SIZE = 256

/**
 * Clé de support (`SupportKind`, cf. lib/subject-template.ts) → nom du fichier
 * original. La correspondance est explicite parce que les originaux arrivent
 * nommés à la main, au singulier ou au pluriel, et parce que deux clés ne
 * portent pas le nom qu'on croit : `carte` est le support « Fiches » (héritage
 * de la carte mentale d'avant), et `erreurs` s'appelle « erreur » au singulier
 * chez le dessinateur. Dériver le nom de la clé marcherait pour trois d'entre
 * elles et échouerait en silence sur les deux autres.
 */
const ORIGINAUX = {
  cours: 'cours',
  quiz: 'quizz',
  flashcards: 'flashcard',
  carte: 'fiches',
  defi: 'defi',
  erreurs: 'erreur',
}

/** L'original d'un support : même nom, quelle que soit son extension. */
async function source(nom) {
  for (const ext of ['png', 'webp']) {
    const chemin = `${SRC_DIR}/${nom}.${ext}`
    try {
      await access(chemin)
      return chemin
    } catch {
      /* extension suivante */
    }
  }
  throw new Error(
    `Original introuvable : ${SRC_DIR}/${nom}.{png,webp}. ` +
      `Les originaux sont LOCAUX (assets-sources/ est dans .gitignore) — ` +
      `après un clone, il faut les redéposer avant de relancer ce script.`,
  )
}

await mkdir(DEST_DIR, { recursive: true })

// Les dessins détourés, avant toute mise à l'échelle.
const dessins = {}
for (const [kind, nom] of Object.entries(ORIGINAUX)) {
  dessins[kind] = await sharp(await detourerFondPeint(await source(nom)))
    .trim({ threshold: 2 })
    .png()
    .toBuffer()
}

const { cible, plan } = await planDuLot(dessins, SIZE)

for (const kind of Object.keys(plan).sort()) {
  const { width, height, encre } = plan[kind]

  if (height > SIZE || width > SIZE) {
    throw new Error(
      `${kind} : ${width}x${height} dépasse la toile de ${SIZE}. ` +
        `Baisser maxDim dans les réglages de la trame avant d'insister.`,
    )
  }

  await sharp(dessins[kind])
    .resize(width, height)
    .extend({
      // Centrage sur les deux axes ; le pixel impair part en bas à droite.
      top: Math.floor((SIZE - height) / 2),
      bottom: Math.ceil((SIZE - height) / 2),
      left: Math.floor((SIZE - width) / 2),
      right: Math.ceil((SIZE - width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 92 })
    .toFile(`${DEST_DIR}/${kind}.webp`)

  console.log(
    `${kind.padEnd(12)} ${String(width).padStart(3)}x${String(height).padEnd(3)}` +
      ` · encre ${String(Math.round(encre)).padStart(3)} (cible ${Math.round(cible)})`,
  )
}
