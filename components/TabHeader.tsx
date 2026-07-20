// En-tête compact des 5 onglets principaux : titre + sous-titre qui disent en
// une seconde à quoi sert l'écran. Plus léger que PageHeader (réservé aux
// pages empilées) pour ne pas surcharger les accueils d'onglet.
export default function TabHeader({
  title,
  subtitle,
  tone = 'light',
}: {
  title: string
  subtitle: string
  // 'arena' : texte crème pour l'écran violet plein cadre du Défi (le crème
  // #faf6ef est la convention de l'arène, cf. .olympe-glass / ORB_ICON).
  tone?: 'light' | 'arena'
}) {
  const isArena = tone === 'arena'
  return (
    <header className={isArena ? 'text-center' : 'mb-4 space-y-0.5'}>
      <h1
        className={
          isArena
            ? 'font-heading text-lg font-extrabold text-[#faf6ef]'
            : 'font-heading text-2xl font-bold text-foreground'
        }
      >
        {title}
      </h1>
      <p
        className={
          isArena
            ? 'text-xs font-semibold text-[#faf6ef]/70'
            : 'text-sm text-muted-foreground'
        }
      >
        {subtitle}
      </p>
    </header>
  )
}
