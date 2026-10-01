/**
 * Fabrique LES SIX ICÔNES DE SUPPORT — la rangée « Cours · Quiz · Flashcards ·
 * Fiches · Défi » (+ « Revoir mes erreurs ») — et les deux onglets de « Ma
 * bibliothèque » qui n'en sont pas (Dossiers, Capsules) :
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
 *
 * Un nom avec un « / » se lit depuis `assets-sources/` : c'est un original
 * emprunté à un autre lot.
 */
const ORIGINAUX = {
  // LE LOT DU 25/09/2026 (Lucas) : Cours, Quiz, Exercice, Moi vs IA, cartes
  // mémoire et « À revoir » redessinés dans le style de la Fiche du Marché,
  // la seule gardée. Les fichiers portent un « 2 » : les anciens originaux
  // (cours.png, quizz.png, flashcard.png, erreur.png, defi.png) restent à côté.
  cours: 'cours (2)',
  quiz: 'quizz 2',
  // Plus de `flashcards` (01/10/2026) : la tuile est partie du chapitre, elle
  // rejouait le quiz. L'original « carte mémoire 2 » reste dans les sources.
  exercice: 'exercice 2',
  // LA FICHE EST CELLE DU MARCHÉ (Lucas, 24/09/2026 : « cette illustration
  // par défaut, partout ») : la feuille surlignée et son surligneur rose, qui
  // vendait déjà la « Fiche de révision » dans la Boutique. Même objet, même
  // dessin, de la Boutique à la tuile du chapitre et à la bibliothèque. La
  // feuille à trombone d'avant (`supports/fiches.png`) n'est plus servie.
  carte: 'boutique-marche/fiche',
  // `ia` (« Moi vs IA ») : le bouclier mi-crayon, mi-circuit.
  ia: 'moi vs ia 2',
  erreurs: 'à revoir 2',
  // LES ONGLETS DE « MA BIBLIOTHÈQUE » (24/09/2026). Ce ne sont pas des supports
  // de chapitre, mais ils s'affichent à côté de la Fiche (Dossiers · Capsules ·
  // Fiches) : ils passent par la MÊME trame, sinon l'un des trois onglets
  // semblerait plus gros que les autres. Un dossier à onglet entrouvert, une
  // capsule de distributeur (mi-violette, mi-or, étoile) — pas une gélule, qui
  // se lisait « médicament ».
  dossiers: 'dossier',
  capsules: 'capsule',
  // L'étagère du bouton « Ma bibliothèque » (assets-sources/supports/
  // bibliotheque.png) a été produite puis écartée le 24/09/2026 : trop petite
  // sur ce bouton, qui garde son pictogramme en trait (components/carnet/
  // CarnetButton). L'original reste là si un écran la montre un jour en grand.
}
// `exercice` a eu longtemps le parchemin à coches de l'arène (quetes-v2) ;
// depuis le 25/09/2026 il a son dessin, le porte-bloc « Exercice ».

/** L'original d'un support : même nom, quelle que soit son extension. */
async function source(nom) {
  const base = nom.includes('/') ? `assets-sources/${nom}` : `${SRC_DIR}/${nom}`
  for (const ext of ['png', 'webp']) {
    const chemin = `${base}.${ext}`
    try {
      await access(chemin)
      return chemin
    } catch {
      /* extension suivante */
    }
  }
  throw new Error(
    `Original introuvable : ${base}.{png,webp}. ` +
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
