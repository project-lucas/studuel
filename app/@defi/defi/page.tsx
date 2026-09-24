import OngletDefi from '@/app/defi/onglet'

/**
 * L'onglet dans son EMPLACEMENT (route parallèle `@defi`) : lors d'une
 * navigation dans l'app, Next garde un emplacement que l'URL ne vise plus, et
 * `components/OngletsVivants` le cache sans le détruire — l'onglet n'est
 * construit qu'une fois. Le titre de la page vit dans `app/defi/page.tsx`.
 */
export default function EmplacementDefi() {
  return <OngletDefi />
}
