import XpIcon from '@/components/ui/XpIcon'
import { nombreFr } from '@/lib/ligue'
import { cn } from '@/lib/utils'

/**
 * LE COMPTE D'XP, écrit d'une seule façon sur tout l'onglet Amis : l'éclair
 * devant, « 87 XP » derrière — la ligue, le classement des amis, le coffre
 * d'équipe. L'onglet ne compte plus en trophées (24/09/2026).
 */
export default function CompteXp({
  xp,
  className,
  accent = false,
}: {
  xp: number
  className?: string
  /** Ma ligne : le compte ressort un peu plus. */
  accent?: boolean
}) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center gap-1 rounded-full py-1 pr-2.5 pl-1.5 text-sm font-extrabold tabular-nums',
        accent ? 'bg-highlight/25 text-foreground' : 'bg-foreground/5 text-foreground/85',
        className,
      )}
    >
      <XpIcon />
      {nombreFr(Math.floor(xp))}
      <span className="text-[11px] font-bold text-muted-foreground">XP</span>
    </span>
  )
}
