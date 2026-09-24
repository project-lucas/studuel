import CoffreDessin from '@/components/amis/CoffreDessin'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import XpIcon from '@/components/ui/XpIcon'
import { COFFRE_NIVEAUX, nombreFr, progressionCoffre } from '@/lib/ligue'
import styles from '@/components/amis/PlaquesAmis.module.css'

/**
 * CE QUE CONTIENT LE COFFRE D'ÉQUIPE — la feuille qui s'ouvre au toucher du
 * coffre (Lucas, 24/09/2026 : « le joueur pourra cliquer sur le coffre pour
 * s'informer : niv 1 = gain d'XP… + gain de gemmes… »). La règle en deux
 * phrases, puis les cinq niveaux, chacun avec son seuil et son contenu ; le
 * niveau atteint est surligné, les niveaux passés portent leur jalon d'or.
 */
export default function CoffreContenu({ points, xpMoi }: { points: number; xpMoi: number }) {
  const { niveau, suivant, reste } = progressionCoffre(points)
  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex flex-col items-center gap-2 text-center">
        <CoffreDessin className="size-24" />
        <h2 className="font-heading text-2xl leading-tight font-extrabold">Coffre d’équipe</h2>
        <p className="max-w-xs text-sm font-semibold text-balance text-muted-foreground">
          Toute l’XP que tes amis et toi gagnez cette semaine le remplit&nbsp;: leçons, quiz, jeux, duels. Lundi, il
          s’ouvre et tu reçois le contenu du niveau atteint.
        </p>
        <p className="font-heading rounded-full bg-primary/10 px-3 py-1 text-sm font-extrabold text-primary">
          {nombreFr(points)}&nbsp;XP d’équipe · niveau {niveau}
          {suivant ? ` · encore ${nombreFr(reste)} pour le ${suivant.niveau}` : ''}
        </p>
      </div>

      <ol aria-label="Les niveaux du coffre" className="flex flex-col gap-2">
        {COFFRE_NIVEAUX.map((n) => (
          <li
            key={n.niveau}
            className={styles.niveauLigne}
            data-atteint={niveau >= n.niveau || undefined}
            data-courant={niveau === n.niveau || undefined}
          >
            <span aria-hidden="true" className={styles.niveauJalon}>
              {n.niveau}
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-heading block leading-tight font-extrabold">Niveau {n.niveau}</span>
              <span className="block text-xs font-bold text-muted-foreground">
                dès {nombreFr(n.seuil)}&nbsp;XP d’équipe{niveau >= n.niveau ? ' · atteint' : ''}
              </span>
            </span>
            <span className="font-heading flex shrink-0 items-center gap-2 text-sm font-extrabold tabular-nums">
              <span className="flex items-center gap-0.5">
                <XpIcon className="size-4" />+{nombreFr(n.xp)}
              </span>
              <span className="flex items-center gap-0.5">
                <CristalIcon className="-my-1 size-5" />+{n.gemmes}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <p className="text-center text-xs font-semibold text-balance text-muted-foreground">
        Ton XP compte deux fois&nbsp;: dans ta barre de niveau, et dans le coffre.
        {xpMoi > 0 ? '' : ' Pour l’ouvrir lundi, il faut avoir joué toi-même dans la semaine.'}
      </p>
    </div>
  )
}
