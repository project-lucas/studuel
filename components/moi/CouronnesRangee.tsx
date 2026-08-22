import type { ReactNode } from 'react'
import { EllipsisVertical } from 'lucide-react'
import CouronneArt from '@/components/moi/CouronneArt'
import {
  COURONNE_LABELS,
  avanceeVersProchain,
  phraseProchaineCouronne,
  type BilanCouronnes,
  type Couronne,
} from '@/lib/moi/couronnes'
import SubjectIcon from '@/components/SubjectIcon'

// -----------------------------------------------------------------------------
// L'ÉTAGÈRE DES COURONNES — un emplacement par matière, DANS la carte de joueur.
//
// CE QU'ELLE REMPLACE. `CouronnesResume` posait au même endroit une phrase et
// deux ou trois compteurs (« 2 or · 1 argent »). Un compteur dit ce qu'on a ; il
// ne dit pas ce qu'il RESTE. Un élève à zéro couronne y lisait « Ta première
// couronne t'attend » et rien d'autre : aucune trace du fait qu'il en existe
// onze à gagner, ni de la distance qui l'en sépare.
//
// L'étagère montre les emplacements VIDES en même temps que les pleins. C'est
// le principe de toute collection — un album de vignettes montre les cases
// manquantes, sinon il n'y a pas de collection, juste un tas. Le nombre
// d'emplacements est le nombre de matières que l'élève suit ; il ne bouge pas
// d'une visite à l'autre, et c'est ce qui rend le remplissage lisible.
//
// LA TAILLE EST CALCULÉE PAR LA GRILLE, PAS PAR NOUS. `repeat(n, minmax(0,
// 2.5rem))` : chaque emplacement vise 40 px et se laisse comprimer quand ils
// sont nombreux (≈26 px à onze matières sur un écran de 360 px). Aucun palier
// de taille écrit à la main, donc rien à re-régler le jour où une classe suit
// quatorze matières — et à six matières, la rangée ne s'étire pas en cases
// géantes.
//
// L'ANNEAU EST LA PART DU CHEMIN VERS LE MÉTAL SUIVANT, pas le pourcentage du
// programme. Sans lui, l'écran d'un élève entre deux paliers est strictement
// identique pendant des semaines : il travaille, rien ne bouge. L'anneau est
// jaune — `highlight`, la couleur de la progression dans la charte — et il est
// le seul élément coloré de la rangée : le métal des couronnes gagnées, lui,
// doit rester la seule chose qui brille.
//
// ELLE EST AUSSI LA POIGNÉE DU DÉTAIL, DEPUIS QUE LA BARRE BLANCHE A DISPARU.
// « Mes couronnes » ouvrait sa liste depuis une grande barre blanche posée sous
// la carte : un titre, un compteur et un chevron qui répétaient mot pour mot ce
// que la rangée montre déjà juste au-dessus, en occupant la place d'un bloc
// entier. La rangée est donc devenue son propre `<summary>`, avec un ⋮ au bout
// — le signe universel du « il y en a plus à voir » — et la liste se déroule
// SOUS elle, à l'intérieur de la carte. Le détail sort à l'endroit exact de la
// chose qu'il détaille, et l'écran a un bloc de moins.
//
// `<details>` natif, pas un état React : l'ouverture appartient au navigateur
// (clavier, lecteur d'écran, recherche dans la page), et ni cette rangée ni la
// liste qu'elle porte n'ont besoin d'une ligne de JavaScript côté client — ce
// qui compte, puisqu'elles vivent à l'intérieur d'un composant client
// (`CarteProfil`) où elles n'entrent que comme des nœuds déjà rendus.
//
// LE NOM DU BOUTON EST ÉCRIT À LA MAIN (`aria-label`). Sans lui, le nom
// accessible du `<summary>` serait la concaténation des onze descriptions des
// emplacements — « Anglais — aucune couronne, 0 % du programme acquis… » onze
// fois de suite — pour un bouton dont le rôle tient en cinq mots.
// -----------------------------------------------------------------------------

/** Vise 40 px par emplacement, se comprime quand ils sont nombreux. */
const TAILLE_VISEE = '2.5rem'

function Emplacement({ couronne }: { couronne: Couronne }) {
  const { tier, pct, subjectName, subjectSlug } = couronne
  const gagnee = tier !== 'aucune'
  const avancee = avanceeVersProchain(couronne)

  return (
    <li
      className="relative aspect-square"
      // Le survol nomme la matière sur grand écran ; le lecteur d'écran a la
      // même phrase, en plus complet, dans le texte caché ci-dessous.
      title={`${subjectName} — ${COURONNE_LABELS[tier]}`}
    >
      {/* L'anneau. `pathLength={1}` normalise la circonférence : le tiret vaut
          directement la part parcourue, sans jamais calculer 2πr. */}
      <svg
        viewBox="0 0 36 36"
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 size-full -rotate-90"
      >
        <circle
          cx="18"
          cy="18"
          r="16.4"
          fill="none"
          stroke="oklch(1 0 0 / 0.18)"
          strokeWidth="2.6"
        />
        {avancee > 0 ? (
          <circle
            cx="18"
            cy="18"
            r="16.4"
            fill="none"
            stroke="var(--highlight)"
            strokeWidth="2.6"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${avancee} 1`}
          />
        ) : null}
      </svg>

      {/* Le disque. Gagné : blanc, en relief, un objet POSÉ sur l'étagère.
          Vide : un LOGEMENT, creusé par une ombre interne — depuis que la
          rangée est montée dans une étagère de verre, un vide simplement plus
          sombre que son fond ne se lisait plus comme une place à prendre, juste
          comme une pastille éteinte de plus. */}
      <span
        aria-hidden="true"
        className={
          gagnee
            ? 'absolute inset-[14%] rounded-full bg-white/92 shadow-[0_1px_3px_rgba(0,0,0,0.35)]'
            : 'absolute inset-[14%] rounded-full bg-black/25 shadow-[inset_0_2px_3px_rgba(0,0,0,0.45)]'
        }
      />

      <span
        aria-hidden="true"
        className="absolute inset-[26%] flex items-center justify-center"
      >
        {gagnee ? (
          <CouronneArt tier={tier} className="w-full drop-shadow-sm" />
        ) : (
          <SubjectIcon
            slug={subjectSlug}
            className="size-full text-white/55"
            strokeWidth={2.4}
          />
        )}
      </span>

      <span className="sr-only">
        {subjectName} — {COURONNE_LABELS[tier]}, {pct} % du programme acquis.
      </span>
    </li>
  )
}

export default function CouronnesRangee({
  liste,
  bilan,
  children,
}: {
  liste: readonly Couronne[]
  bilan: BilanCouronnes
  /**
   * LE DÉTAIL, matière par matière (`components/moi/CouronnesMatieres`), caché
   * jusqu'au tap sur le ⋮. Passé en enfant plutôt qu'importé ici : les deux
   * blocs sont rendus par le serveur, et c'est la page qui décide de ce qui se
   * déroule — la rangée ne sait que le fait qu'il y a quelque chose dessous.
   */
  children?: ReactNode
}) {
  if (liste.length === 0) return null

  const phrase = phraseProchaineCouronne(bilan.prochaine)

  return (
    <details className="group">
      {/* `moi-etagere` : le verre légèrement plus clair que le violet, déjà
          utilisé par le panneau d'identité. La rangée y gagne un MEUBLE — sans
          lui, onze cercles gris posés à même l'aplat violet flottaient sans
          bord, et rien ne disait qu'ils formaient une collection plutôt qu'une
          barre d'icônes. C'est aussi ce qui rend la carte lisible comme un
          objet à deux matières (verre + plaque) au lieu d'un grand aplat. */}
      <summary
        aria-label="Voir le détail de mes couronnes, matière par matière"
        className="moi-etagere flex cursor-pointer list-none flex-col gap-2 rounded-2xl p-2.5 outline-none focus-visible:ring-2 focus-visible:ring-white/70 [&::-webkit-details-marker]:hidden"
      >
        <div className="flex items-center gap-2">
          <ul
            role="list"
            aria-label="Mes couronnes par matière"
            className="grid min-w-0 flex-1 gap-1.5"
            style={{
              gridTemplateColumns: `repeat(${liste.length}, minmax(0, ${TAILLE_VISEE}))`,
            }}
          >
            {liste.map((c) => (
              <Emplacement key={c.subjectId} couronne={c} />
            ))}
          </ul>

          {/* Le ⋮ : pas un `<button>`, un décor. Le `<summary>` EST déjà le
              bouton — un vrai bouton imbriqué dedans serait un contrôle dans un
              contrôle, et le tap tomberait tantôt sur l'un, tantôt sur l'autre. */}
          {children ? (
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white/85 ring-1 ring-white/25 transition group-open:bg-white/30 group-open:text-white"
            >
              <EllipsisVertical className="size-4" strokeWidth={2.6} />
            </span>
          ) : null}
        </div>

        {/* UNE SEULE LIGNE, JAMAIS DEUX. La rangée portait « Une couronne par
            matière — la première t'attend. » ET « Le plus proche : … » l'une
            sous l'autre : deux phrases pour dire qu'il reste des couronnes à
            gagner, sous une rangée d'emplacements vides qui le disait déjà en
            image. La consigne précise gagne toujours ; la phrase générique ne
            reste que quand il n'y a rien de précis à désigner.

            Elle est posée sur la LÈVRE de l'étagère (le filet clair du haut) :
            une légende appartient à l'objet qu'elle légende. */}
        {phrase ? (
          <p className="border-t border-white/15 pt-2 text-[11px] leading-snug font-semibold text-white/75">
            Le plus proche : <span className="font-extrabold text-white">{phrase}</span>.
          </p>
        ) : bilan.gagnees === 0 ? (
          <p className="border-t border-white/15 pt-2 text-[11px] font-bold text-white/70">
            Une couronne par matière — la première t’attend.
          </p>
        ) : null}
      </summary>

      {children ? (
        <div className="animate-in fade-in slide-in-from-top-1 mt-3 duration-200">
          {children}
        </div>
      ) : null}
    </details>
  )
}
