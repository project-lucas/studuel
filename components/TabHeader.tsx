// En-tête compact des 5 onglets principaux : titre + sous-titre qui disent en
// une seconde à quoi sert l'écran. Plus léger que PageHeader (réservé aux
// pages empilées) pour ne pas surcharger les accueils d'onglet.
export default function TabHeader({
  title,
  subtitle,
  tone = 'light',
  action,
}: {
  title: string
  // Optionnel : certains accueils d'onglet (ex. Réviser) se passent de
  // sous-titre pour gagner de la hauteur — on ne rend alors que le titre.
  subtitle?: string
  // 'arena' : texte crème pour l'écran violet plein cadre du Défi (le crème
  // #faf6ef est la convention de l'arène, cf. .olympe-glass / ORB_ICON).
  tone?: 'light' | 'arena'
  /**
   * Une commande posée sur la ligne du titre, alignée à droite : la bande la
   * plus haute de l'écran, et la seule qui reste visible avant tout défilement.
   *
   * ⚠️ IGNORÉE EN TON `arena`, et il faut que ce soit dit plutôt que subi : cet
   * en-tête-là est CENTRÉ (l'écran violet du Défi), une commande à droite y
   * décentrerait le titre. Aucun appelant n'en passe aujourd'hui ; si l'arène
   * en réclame une un jour, elle demandera sa propre mise en page.
   */
  action?: React.ReactNode
}) {
  const isArena = tone === 'arena'
  const titre = (
    <h1
      className={
        isArena
          ? 'font-heading text-lg font-extrabold text-[#faf6ef]'
          : 'font-heading text-2xl font-bold text-foreground'
      }
    >
      {title}
    </h1>
  )
  return (
    <header
      className={
        isArena ? 'text-center' : subtitle ? 'mb-3 space-y-0.5' : 'mb-3'
      }
    >
      {action && !isArena ? (
        // `min-w-0` sur le titre : un titre long doit se serrer plutôt que
        // pousser la commande hors de l'écran.
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">{titre}</div>
          {action}
        </div>
      ) : (
        titre
      )}
      {subtitle ? (
        <p
          className={
            isArena
              ? 'text-xs font-semibold text-[#faf6ef]/70'
              : 'text-sm text-muted-foreground'
          }
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  )
}
