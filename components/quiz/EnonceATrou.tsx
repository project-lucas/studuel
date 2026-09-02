import { cn } from '@/lib/utils'
import { decouperTrou, largeurDuCreux } from '@/lib/quiz-trous'

/**
 * L'ÉNONCÉ À TROU — la phrase, avec un creux dedans qui se remplit.
 *
 * C'est le geste de Duolingo : on ne lit pas « quel mot complète cette
 * phrase ? » suivi de la phrase, on lit LA PHRASE, avec un manque au milieu.
 * L'option qu'on touche vient s'y poser ; la phrase se termine sous les yeux.
 * L'exercice et sa réponse occupent le même objet, au lieu de se répondre à
 * distance.
 *
 * ⚠️ AUCUNE DONNÉE NOUVELLE. Une question à trou est un QCM dont l'énoncé
 * contient `___` : mêmes options, même index de bonne réponse, même table. Ce
 * composant ne fait que la LIRE autrement — c'est ce qui permet d'ajouter la
 * forme sans toucher aux 3 300 questions du catalogue ni à la base.
 *
 * Rend `null` quand l'énoncé n'a pas de trou : l'appelant retombe alors sur son
 * affichage ordinaire.
 */
export default function EnonceATrou({
  enonce,
  options,
  choisi,
  correctIndex,
  revele,
  className,
}: {
  enonce: string
  options: readonly string[]
  /** L'option sélectionnée, ou `null` tant que rien n'est coché. */
  choisi: number | null
  correctIndex: number
  /** La réponse est-elle corrigée ? */
  revele: boolean
  className?: string
}) {
  const parts = decouperTrou(enonce)
  if (!parts) return null

  const mot = choisi !== null ? options[choisi] : null
  const juste = choisi === correctIndex

  return (
    <p className={className}>
      {parts.avant}
      <span
        className={cn(
          'mx-0.5 inline-flex min-h-[1.6em] items-center justify-center rounded-lg px-2 align-baseline transition-colors',
          mot === null
            ? // LE CREUX VIDE. Un trait pointillé, pas un aplat : il dit « il
              // manque quelque chose ici » sans ressembler à un bouton — le
              // creux ne se touche pas, ce sont les options qu'on touche.
              'border-b-2 border-dashed border-primary/50 bg-primary/5'
            : revele
              ? juste
                ? 'bg-success/15 text-success'
                : 'bg-destructive/15 text-destructive'
              : 'bg-primary/15 text-primary',
        )}
        // La largeur suit la PLUS LONGUE option et non la bonne réponse : un
        // creux taillé sur elle la désignerait avant qu'on ait lu les
        // propositions. Une fois rempli, il reprend la taille de son mot.
        style={
          mot === null
            ? { minWidth: `${largeurDuCreux(options)}ch` }
            : undefined
        }
      >
        {mot === null ? (
          <span className="sr-only">blanc à compléter</span>
        ) : (
          mot
        )}
      </span>
      {parts.apres}
    </p>
  )
}
