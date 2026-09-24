import OngletAmis from '@/app/amis/onglet'

/**
 * L'onglet dans son EMPLACEMENT (route parallèle `@amis`) : lors d'une
 * navigation dans l'app, Next garde un emplacement que l'URL ne vise plus, et
 * `components/OngletsVivants` le cache sans le détruire — l'onglet n'est
 * construit qu'une fois. Le titre de la page vit dans `app/amis/page.tsx`.
 */
export default function EmplacementAmis() {
  return <OngletAmis />
}
