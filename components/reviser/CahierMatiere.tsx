'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Crown } from 'lucide-react'
import Attente from '@/components/reviser/Attente'
import IconeTheme from '@/components/reviser/IconeTheme'
import { prechargerCahier, useCahierMatiere } from '@/components/reviser/useCahierMatiere'
import { Button } from '@/components/ui/button'
import { sfx } from '@/lib/sounds'
import { LIEN_STUDUEL_PLUS } from '@/lib/jeux/acces'
import { iconeDuTheme } from '@/lib/reviser/icone-theme'
import type { CahierMatiere as Cahier, ManuelCahier } from '@/lib/exercices/cahier-matiere'
import s from './Sommaire.module.css'

/** « ★ », « ★★ », « ★★★ ». */
const etoiles = (n: number) => '★'.repeat(n)

const pluriel = (n: number, mot: string) => `${n} ${mot}${n > 1 ? 's' : ''}`

/**
 * LA PORTE « EXERCICES » — le cahier de TOUTE la matière (05/10/2026).
 *
 * Lucas : « le cahier d'exercices de la matière n'est pas accessible tout de
 * suite, il faut fouiller ». Il ne s'ouvrait que depuis un chapitre. Ici :
 *
 *   · le MARQUE-PAGE — la première page qu'il reste à faire, et son bouton ;
 *   · les MANUELS — un par thème, comme le livre numérique du cahier
 *     (lib/exercices/livre) ; chacun mène à sa première page à faire, et la
 *     liseuse prend le relais (pages qui se tournent, sommaire du thème).
 *
 * Le cahier se lit quand on ouvre la porte (`useCahierMatiere`), pas avec la
 * page : un squelette tient la place des lignes le temps qu'il arrive.
 *
 * L'exercice est de l'offre Studuel+ : la porte porte la couronne, et un élève
 * sans abonnement voit ici tout ce que le cahier contient — c'est la page de
 * l'exercice qui ouvre ou non.
 */
export default function CahierMatiere({
  matiere,
  nom,
  total,
  premium,
}: {
  /** Le slug de la matière. */
  matiere: string
  nom: string
  /** Le nombre d'exercices, déjà connu de la page (il a fait apparaître la porte). */
  total: number
  premium: boolean
}) {
  const router = useRouter()
  const vue = useCahierMatiere(matiere)
  const viser = useCallback((href: string) => router.prefetch(href), [router])

  return (
    <section aria-labelledby="cahier-titre">
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="min-w-0">
          <h2 id="cahier-titre" className="titre-section">
            Cahier d’exercices
          </h2>
          <p className="text-xs font-bold text-muted-foreground">
            {pluriel(total, 'exercice')}, de ★ à ★★★
          </p>
        </div>
        {premium ? null : (
          <Link
            href={LIEN_STUDUEL_PLUS}
            prefetch={false}
            onClick={() => sfx.tap()}
            className="font-heading inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-highlight px-3 text-xs font-extrabold text-foreground"
          >
            <Crown className="size-3.5 fill-current" strokeWidth={2.5} aria-hidden="true" />
            Studuel+
          </Link>
        )}
      </div>

      {vue.etat === 'pret' ? (
        <Contenu cahier={vue.cahier} matiere={matiere} nom={nom} onIntention={viser} />
      ) : vue.etat === 'erreur' ? (
        <div className="carte mt-3 flex items-center gap-3 p-4">
          <p className="min-w-0 flex-1 text-sm font-semibold text-muted-foreground">
            Le cahier n’a pas pu s’ouvrir.
          </p>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              sfx.tap()
              prechargerCahier(matiere)
            }}
          >
            Réessayer
          </Button>
        </div>
      ) : (
        <Squelette />
      )}
    </section>
  )
}

function Contenu({
  cahier,
  matiere,
  nom,
  onIntention,
}: {
  cahier: Cahier
  matiere: string
  nom: string
  onIntention: (href: string) => void
}) {
  if (cahier.total === 0) {
    return (
      <p className="mt-4 px-1 text-sm text-muted-foreground">
        Le cahier d’exercices de {nom} arrive bientôt.
      </p>
    )
  }
  const { marque } = cahier
  return (
    <>
      {marque ? (
        <div className={s.marque}>
          <span className="min-w-0 flex-1">
            <span className={s.marqueSur}>
              Ton marque-page · page {marque.numero} sur {cahier.total}
            </span>
            <span className={s.marqueTitre}>
              {etoiles(marque.etoiles)} {marque.titre}
            </span>
            <span className={s.manuelMeta}>{marque.manuel}</span>
          </span>
          <Button asChild className="shrink-0">
            <Link
              href={marque.href}
              prefetch={false}
              onPointerDown={() => onIntention(marque.href)}
              onClick={() => sfx.tap()}
            >
              <Attente>Ouvrir</Attente>
            </Link>
          </Button>
        </div>
      ) : (
        <p className={s.marque}>
          <Crown className="size-5 shrink-0 fill-highlight text-highlight" aria-hidden="true" />
          <span className={s.marqueTitre}>Cahier terminé : tous les exercices sont réussis.</span>
        </p>
      )}

      <ul className={s.liste} aria-label={`Les manuels de ${nom}`}>
        {cahier.manuels.map((manuel) => (
          <li key={manuel.cle}>
            <Manuel manuel={manuel} matiere={matiere} onIntention={onIntention} />
          </li>
        ))}
      </ul>
    </>
  )
}

function Manuel({
  manuel,
  matiere,
  onIntention,
}: {
  manuel: ManuelCahier
  matiere: string
  onIntention: (href: string) => void
}) {
  const fini = manuel.reussies >= manuel.pages
  return (
    <Link
      href={manuel.href}
      prefetch={false}
      onPointerDown={() => onIntention(manuel.href)}
      onClick={() => sfx.tap()}
      className={s.manuel}
    >
      <span className={s.couverture} data-fini={fini ? '' : undefined} aria-hidden="true">
        {fini ? (
          <Crown className="size-4 fill-current" strokeWidth={2.25} />
        ) : (
          <IconeTheme nom={iconeDuTheme(matiere, manuel.titre)} className="size-[1.125rem]" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className={s.manuelTitre}>{manuel.titre}</span>
        <span className={s.manuelMeta}>
          {pluriel(manuel.pages, 'page')}
          {manuel.chapitres > 1 ? ` · ${manuel.chapitres} fiches` : null}
        </span>
        <span
          className={s.pages}
          role="progressbar"
          aria-label={`${manuel.reussies} pages réussies sur ${manuel.pages}`}
          aria-valuemin={0}
          aria-valuemax={manuel.pages}
          aria-valuenow={manuel.reussies}
        >
          <span
            className={s.pagesFaites}
            style={{ width: `${(manuel.reussies / manuel.pages) * 100}%` }}
          />
        </span>
      </span>
      <Attente className={s.manuelCompte}>
        {manuel.reussies}/{manuel.pages}
      </Attente>
    </Link>
  )
}

/** Le marque-page et quatre manuels, en gris : la place exacte de ce qui arrive. */
function Squelette() {
  return (
    <div role="status" aria-label="Ouverture du cahier" className="mt-3 flex flex-col gap-2.5">
      <span className="h-[4.75rem] animate-pulse rounded-[1.25rem] bg-card/70 motion-reduce:animate-none" />
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="h-16 animate-pulse rounded-[1.125rem] bg-card/70 motion-reduce:animate-none"
        />
      ))}
    </div>
  )
}
