'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import { Check, Shirt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BandeauSection from '@/components/boutique/BandeauSection'
import Feuille from '@/components/boutique/Feuille'
import PrixGemmes from '@/components/boutique/PrixGemmes'
import { acheterObjetProfil } from '@/app/tresor/boutique-actions'
import { EquipmentArt } from '@/components/avatar/vestiaire-assets'
import type { ObjetProfil } from '@/lib/boutique/objets-profil'
import { bannerFor } from '@/lib/profile-banners'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'

const CATEGORIES: Record<ObjetProfil['categorie'], string> = {
  banniere: 'Bannière',
  tenue: 'Tenue',
  accessoire: 'Accessoire',
}

/**
 * POUR TON PROFIL (Lucas, 18/09/2026) : une seule rangée de six objets —
 * bannières, tenues, accessoires — en gemmes. Volontairement petite : la
 * Boutique vend d'abord de quoi apprendre (les capsules), la décoration vient
 * en dernier.
 */
/** Aucun objet choisi — une CONSTANTE : `useFermeAuMasquage` la veut stable. */
const CHOIX_FERME: { id: string | null; open: boolean } = { id: null, open: false }

export default function PourTonProfil({
  objets,
  gemmes,
  connecte,
}: {
  objets: ObjetProfil[]
  gemmes: number
  connecte: boolean
}) {
  const [choix, setChoix] = useState(CHOIX_FERME)
  // « Aller à mon profil » quitte la Boutique sans refermer la fiche : au
  // retour sur l'onglet (gardé vivant, components/OngletsVivants), elle repart
  // fermée.
  useFermeAuMasquage(setChoix, CHOIX_FERME)
  const objet = objets.find((o) => o.id === choix.id) ?? null
  if (objets.length === 0) return null

  return (
    <section aria-labelledby="profil-titre" className="flex flex-col gap-3">
      <BandeauSection id="profil-titre" variante="ruban-clair">
        Pour ton profil
      </BandeauSection>
      <Link href="/moi" className="self-end px-1 text-xs font-extrabold text-primary">
        Mon profil
      </Link>
      <ul className="capsule-rayon -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2">
        {objets.slice(0, 6).map((o) => (
          <li key={o.id} className="w-28 shrink-0 snap-start">
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => {
                sfx.tap()
                setChoix({ id: o.id, open: true })
              }}
              className="press-3d flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-card text-left ring-1 ring-border"
            >
              <Vignette objet={o} className="h-24" />
              <span className="flex flex-col gap-1 p-2">
                <span className="truncate text-xs font-extrabold">{o.nom}</span>
                {o.possede ? (
                  <span className="flex items-center gap-1 text-[11px] font-extrabold text-primary">
                    <Check className="size-3" strokeWidth={3} aria-hidden="true" /> À toi
                  </span>
                ) : (
                  <PrixGemmes
                    montant={o.prixGemmes}
                    className={cn('text-xs', gemmes >= o.prixGemmes ? 'text-primary' : 'text-muted-foreground')}
                    iconeClassName="size-3.5"
                  />
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {objet ? (
        <FeuilleObjet
          key={objet.id}
          open={choix.open}
          objet={objet}
          gemmes={gemmes}
          connecte={connecte}
          onClose={() => setChoix((c) => ({ ...c, open: false }))}
        />
      ) : null}
    </section>
  )
}

/**
 * Le visuel d'un objet. Tant qu'il n'a pas d'image, on le DESSINE comme le
 * profil le dessine déjà : le dégradé de la bannière (lib/profile-banners),
 * l'accessoire du vestiaire (EquipmentArt), la couleur de la tenue. Les
 * couleurs viennent des catalogues d'objets : c'est la couche illustrative,
 * même précédent que le vestiaire.
 */
function Vignette({ objet, className }: { objet: ObjetProfil; className?: string }) {
  const base = cn('relative grid place-items-center overflow-hidden bg-secondary', className)
  if (objet.image) {
    return (
      <span className={base}>
        <Image
          src={objet.image}
          alt=""
          fill
          sizes="224px"
          className={objet.categorie === 'banniere' ? 'object-cover' : 'object-contain p-2'}
        />
      </span>
    )
  }
  if (objet.categorie === 'banniere') {
    const banniere = bannerFor(objet.cle ?? objet.id.replace(/^banner-/, ''))
    return (
      <span
        aria-hidden="true"
        className={base}
        style={{ background: `linear-gradient(160deg, ${banniere.from}, ${banniere.to})` }}
      />
    )
  }
  if (objet.categorie === 'accessoire' && objet.cle) {
    return (
      <span aria-hidden="true" className={cn(base, 'p-5')}>
        <EquipmentArt slug={objet.cle} />
      </span>
    )
  }
  const couleur = objet.cle?.split('|')[1]
  return (
    <span aria-hidden="true" className={base}>
      <Shirt
        className="size-12 text-primary"
        strokeWidth={1.8}
        style={couleur && /^[0-9a-f]{6}$/i.test(couleur) ? { color: `#${couleur}`, fill: `#${couleur}` } : undefined}
      />
    </span>
  )
}

function FeuilleObjet({
  open,
  objet,
  gemmes,
  connecte,
  onClose,
}: {
  open: boolean
  objet: ObjetProfil
  gemmes: number
  connecte: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [enCours, demarrer] = useTransition()
  const [message, setMessage] = useState<{ ok: boolean; texte: string } | null>(null)
  const manque = Math.max(0, objet.prixGemmes - Math.max(0, Math.floor(gemmes)))

  const acheter = () => {
    setMessage(null)
    demarrer(async () => {
      const r = await acheterObjetProfil(objet.id)
      if (!r.ok) {
        setMessage({ ok: false, texte: r.message })
        return
      }
      sfx.unlock()
      setMessage({ ok: true, texte: 'C’est à toi ! Équipe-le depuis ton profil.' })
      router.refresh()
    })
  }

  return (
    <Feuille open={open} onClose={onClose} label={objet.nom}>
      <Vignette objet={objet} className="mt-10 h-40 rounded-3xl" />
      <p className="surtitre mt-4 text-primary">
        {CATEGORIES[objet.categorie]}
      </p>
      <h2 className="font-heading text-2xl font-extrabold">{objet.nom}</h2>

      <div className="mt-5 flex flex-col gap-2">
        {message ? (
          <p
            role={message.ok ? 'status' : 'alert'}
            className={cn(
              'rounded-2xl px-3 py-2.5 text-center text-sm font-bold',
              message.ok ? 'bg-success/12' : 'bg-destructive/10 text-destructive',
            )}
          >
            {message.texte}
          </p>
        ) : null}
        {objet.possede || message?.ok ? (
          <Button size="lg" className="w-full rounded-full font-bold" onClick={() => router.push('/moi')}>
            Aller à mon profil
          </Button>
        ) : !connecte ? (
          <Button size="lg" className="w-full rounded-full font-bold" onClick={() => router.push('/login')}>
            Connecte-toi pour l’acheter
          </Button>
        ) : (
          <>
            <Button size="lg" className="w-full rounded-full font-bold" disabled={enCours || manque > 0} onClick={acheter}>
              {enCours ? (
                'Un instant…'
              ) : (
                <>
                  Acheter pour <PrixGemmes montant={objet.prixGemmes} className="text-base" />
                </>
              )}
            </Button>
            {manque > 0 ? (
              <p className="text-center text-xs font-bold text-muted-foreground">
                Il te manque <PrixGemmes montant={manque} className="text-xs" iconeClassName="size-3.5" />.
              </p>
            ) : null}
          </>
        )}
      </div>
    </Feuille>
  )
}
