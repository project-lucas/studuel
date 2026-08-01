import Link from 'next/link'
import { Flame, Sparkles, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  libelleSerie,
  verdictHabitudes,
  FENETRE_JOURS,
  type BilanHabitude,
} from '@/lib/moi/habitudes'

// « Mes habitudes » — la moitié de l'onglet Moi qui disait « Bientôt ici ».
//
// Les données existaient déjà toutes (habitudes suivies, catalogue, journal
// quotidien) et la page les chargeait déjà pour calculer la capacité : il ne
// manquait que de les regarder. Un « bientôt » qu'un élève lit deux fois
// devient un mensonge.
//
// Ce que ce panneau montre, dans cet ordre : la SÉRIE (ce qui donne envie de ne
// pas casser la chaîne), la RÉGULARITÉ sur 28 jours, puis le RYTHME de la
// semaine. Et jamais de note globale : un chiffre unique écraserait la seule
// information utile — quelle habitude tient, et laquelle lâche.

const JOURS_COURTS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

// Les 7 pastilles, du plus ancien au plus récent. L'initiale du jour est
// calculée à partir d'aujourd'hui pour que la dernière pastille tombe juste.
function RythmeSemaine({
  semaine,
  jourAujourdhui,
}: {
  semaine: boolean[]
  jourAujourdhui: number
}) {
  return (
    <div className="flex gap-1" aria-hidden="true">
      {semaine.map((fait, i) => {
        // i = 0 est le jour le plus ancien (6 jours avant aujourd'hui).
        const decalage = semaine.length - 1 - i
        const index = (jourAujourdhui - 1 - decalage + 700) % 7
        return (
          <span
            key={i}
            className={cn(
              'flex size-6 items-center justify-center rounded-lg text-[10px] font-extrabold',
              fait
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {JOURS_COURTS[index]}
          </span>
        )
      })}
    </div>
  )
}

export default function HabitsPanel({
  bilans,
  jourAujourdhui,
}: {
  bilans: BilanHabitude[]
  /** Jour de la semaine, 0 = dimanche (Date.getUTCDay). */
  jourAujourdhui: number
}) {
  const verdict = verdictHabitudes(bilans)

  if (bilans.length === 0) {
    return (
      <div className="moi-card rounded-3xl bg-white px-4 py-8 text-center">
        <Sparkles className="text-primary mx-auto size-6" aria-hidden="true" />
        <p className="font-heading text-foreground mt-2 text-lg font-bold">
          Aucune habitude suivie
        </p>
        <p className="text-muted-foreground mx-auto mt-1 max-w-xs text-sm">
          {verdict.phrase}
        </p>
        <Link
          href="/reviser"
          className="bg-primary text-primary-foreground font-heading mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-extrabold"
        >
          <Wand2 className="size-4" aria-hidden="true" />
          Commencer par réviser
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Le verdict : il nomme, il ne note pas. */}
      <div className="moi-card rounded-3xl bg-white px-4 py-4">
        <p className="text-muted-foreground text-[11px] font-extrabold tracking-wide uppercase">
          Aujourd’hui · {verdict.tenuesAujourdhui}/{verdict.total} tenue
          {verdict.total > 1 ? 's' : ''}
        </p>
        <p className="font-heading text-foreground mt-1 text-[15px] leading-snug font-extrabold text-balance">
          {verdict.phrase}
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {bilans.map((b) => (
          <li key={b.id} className="moi-card rounded-3xl bg-white px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="text-xl" aria-hidden="true">
                {b.icone}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-heading min-w-0 flex-1 truncate text-[15px] font-extrabold">
                    {b.titre}
                  </p>
                  <span
                    className={cn(
                      'flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-extrabold',
                      b.serie > 0
                        ? 'bg-[#ffeed2] text-[#b4550c]'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {b.serie > 0 ? (
                      <Flame className="size-3" aria-hidden="true" />
                    ) : null}
                    {libelleSerie(b.serie)}
                  </span>
                </div>

                <p className="text-muted-foreground mt-0.5 text-xs">{b.raison}</p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <RythmeSemaine
                    semaine={b.semaine}
                    jourAujourdhui={jourAujourdhui}
                  />
                  <span className="text-muted-foreground text-[11px] font-bold">
                    {b.regularite}% sur {FENETRE_JOURS} jours
                    {b.meilleureSerie > b.serie
                      ? ` · record ${b.meilleureSerie} j`
                      : ''}
                  </span>
                </div>

                {/* L'honnêteté sur l'automatique : une habitude validée par
                    l'app (révision, trajet) n'est pas une habitude cochée à la
                    main. Le dire évite de se croire plus régulier qu'on n'est. */}
                {b.autoPart >= 50 ? (
                  <p className="text-muted-foreground mt-1 text-[11px]">
                    Validée automatiquement {b.autoPart}% du temps par ton
                    travail dans l’app.
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-muted-foreground px-1 text-center text-[11px]">
        Coche tes leviers du jour dans « Ma progression ».
      </p>
    </div>
  )
}
