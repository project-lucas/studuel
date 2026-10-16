'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { FAMILLES, OUTILS, outilsDe, type Outil } from '@/lib/coach/catalogue-outils'
import { useCoachFil } from '../CoachFil'

/**
 * L’onglet « Outils » : les vingt-quatre outils de Marcel en BLOCS CARRÉS, trois
 * par rangée, chacun avec son dessin, son nom et quelques mots (Lucas, 16/10 :
 * « je préfère quand on mettait beaucoup d’outils à disposition, une
 * succession de blocs carrés avec quelques mots en description »). Rangés par
 * verbe (lib/coach/catalogue-outils). Le 16/10 au soir (« réduis la taille des
 * blocs, je veux surtout voir le texte et les illustrations ») : plus de bloc
 * carré à vide — le bloc épouse son contenu, le dessin passe à 48 px, le nom
 * à 13 px, ses mots à 11 px.
 *
 * Le MÊME catalogue pour tous : ouvert pour Studuel+, couronné pour le gratuit
 * (chaque bloc mène alors à Studuel+) — l’élève voit tout ce qu’il pourrait
 * faire. Un outil « mode » arme le champ (sa consigne, son placeholder) et lui
 * donne le focus ; un outil « page » ouvre son écran.
 */
export default function PanneauOutils({ ouvert, credits }: { ouvert: boolean; credits: number | null }) {
  return (
    <div>
      <p className="text-muted-foreground px-1 text-[12px] font-bold">
        {ouvert
          ? `${OUTILS.length} outils. Touche-en un : je prépare ta demande. Une demande = un crédit${credits !== null ? ` · il t’en reste ${credits}` : ''}.`
          : `${OUTILS.length} outils t’attendent avec Studuel+. Ta journée et ton radar restent offerts.`}
      </p>

      {FAMILLES.map((f) => (
        <section key={f.id} className="mt-3" aria-labelledby={`outils-${f.id}`}>
          <h2 id={`outils-${f.id}`} className="titre-section px-1 text-[15px]">
            {f.label}
          </h2>
          <ul className="mt-1.5 grid grid-cols-3 gap-1.5">
            {outilsDe(f.id).map((o) => (
              <li key={o.id}>
                <Bloc outil={o} ouvert={ouvert} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function Bloc({ outil, ouvert }: { outil: Outil; ouvert: boolean }) {
  const { proposer } = useCoachFil()
  const classe =
    'carte relative flex size-full flex-col items-center rounded-2xl px-1 pt-1 pb-1.5 text-center transition active:scale-[.96]'

  const contenu = (
    <>
      {!ouvert ? (
        <span className="bg-highlight absolute top-1.5 right-1.5 grid size-5 place-items-center rounded-full" aria-hidden="true">
          <Crown className="size-3" strokeWidth={2.6} />
        </span>
      ) : null}
      <Image
        src={outil.image}
        alt=""
        aria-hidden="true"
        width={64}
        height={64}
        unoptimized
        className={cn('size-12 shrink-0 object-contain', !ouvert && 'opacity-60 grayscale-[30%]')}
      />
      <span className={cn('font-heading line-clamp-2 text-[13px] leading-[1.1] font-extrabold', !ouvert && 'text-muted-foreground')}>{outil.label}</span>
      <span className="text-muted-foreground mt-0.5 line-clamp-2 text-[11px] leading-[1.15] font-semibold">{outil.mots}</span>
    </>
  )

  if (!ouvert) {
    return (
      <Link href="/plus" className={classe} aria-label={`${outil.label} : ${outil.mots} — avec Studuel+`}>
        {contenu}
      </Link>
    )
  }
  if (outil.cible.type === 'page') {
    return (
      <Link href={outil.cible.href} className={classe} aria-label={`${outil.label} : ${outil.mots}`}>
        {contenu}
      </Link>
    )
  }
  const { mode } = outil.cible
  return (
    <button
      type="button"
      className={classe}
      aria-label={`${outil.label} : ${outil.mots}`}
      onClick={() => {
        sfx.tap()
        proposer(mode)
      }}
    >
      {contenu}
    </button>
  )
}
