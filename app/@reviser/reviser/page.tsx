import OngletReviser from '@/app/reviser/onglet'
import MusiqueDeFond from '@/components/son/MusiqueDeFond'

/**
 * L'onglet dans son EMPLACEMENT (route parallèle `@reviser`) : lors d'une
 * navigation dans l'app, Next garde un emplacement que l'URL ne vise plus, et
 * `components/OngletsVivants` le cache sans le détruire — l'onglet n'est
 * construit qu'une fois. Le titre de la page vit dans `app/reviser/page.tsx`.
 */
export default function EmplacementReviser() {
  return (
    <>
      {/* La musique de fond dans Réviser : COUPÉE par défaut (on y lit), l'élève
          peut l'allumer dans Paramètres (ReglagesSon, 05/11/2026). */}
      <MusiqueDeFond piste="arene" onglet="reviser" />
      <OngletReviser />
    </>
  )
}
