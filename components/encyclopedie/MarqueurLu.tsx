'use client'

import { useEffect } from 'react'
import { marquerLue } from '@/lib/encyclopedie/lues'

// Le seul brin de JavaScript de la page d'une fiche : il note, dans le
// navigateur, que cette fiche a été ouverte — pour la coche verte de la liste.
//
// Il ne rend RIEN. Le reste de la fiche est du HTML serveur, et doit le
// rester : c'est trois mille mots de texte, il n'y a pas une interaction
// dedans, et la faire dépendre de l'hydratation serait payer du JavaScript
// pour afficher un livre.
export default function MarqueurLu({ id }: { id: string }) {
  useEffect(() => {
    marquerLue(id)
  }, [id])
  return null
}
