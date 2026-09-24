import OngletMoi from '@/app/moi/onglet'

/**
 * L'onglet dans son EMPLACEMENT (route parallèle `@moi`) : lors d'une
 * navigation dans l'app, Next garde un emplacement que l'URL ne vise plus, et
 * `components/OngletsVivants` le cache sans le détruire — l'onglet n'est
 * construit qu'une fois. Le titre de la page vit dans `app/moi/page.tsx`.
 */
export default function EmplacementMoi() {
  return <OngletMoi />
}
