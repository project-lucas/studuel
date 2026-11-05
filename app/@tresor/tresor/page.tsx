import OngletBoutique from '@/app/tresor/onglet'
import MusiqueDeFond from '@/components/son/MusiqueDeFond'

/**
 * L'onglet dans son EMPLACEMENT (route parallèle `@tresor`) : lors d'une
 * navigation dans l'app, Next garde un emplacement que l'URL ne vise plus, et
 * `components/OngletsVivants` le cache sans le détruire — l'onglet n'est
 * construit qu'une fois. Le titre de la page vit dans `app/tresor/page.tsx`.
 */
export default function EmplacementBoutique() {
  return (
    <>
      {/* La musique de fond, comme dans le Défi (05/11/2026, lib/musique) :
          elle se tait quand l'onglet est masqué, et l'élève la coupe onglet
          par onglet dans Paramètres (ReglagesSon). */}
      <MusiqueDeFond piste="arene" onglet="tresor" />
      <OngletBoutique />
    </>
  )
}
