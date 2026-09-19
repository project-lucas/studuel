'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import BandeauSection from '@/components/boutique/BandeauSection'
import CarteMagasin, { EcrinMagasin, type IllustrationMagasin } from '@/components/boutique/CarteMagasin'
import Feuille from '@/components/boutique/Feuille'
import FormulaireDemandeCarte from '@/components/boutique/FormulaireDemandeCarte'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { demanderPackGemmes } from '@/app/tresor/gemmes-actions'
import { libelleEuros } from '@/lib/capsules'
import { libelleQuantite, tasDeCristaux, type IdPack, type PackGemmes } from '@/lib/boutique/packs-gemmes'
import { sfx } from '@/lib/sounds'
import poigneeIllustration from '@/public/images/boutique/gemmes/poignee.webp'
import sacIllustration from '@/public/images/boutique/gemmes/sac.webp'
import barilIllustration from '@/public/images/boutique/gemmes/baril.webp'

/**
 * L'illustration de chaque pack, en IMPORT STATIQUE (URL à empreinte de
 * contenu : une image refaite n'est jamais servie depuis un vieux cache).
 * Des objets détourés sur fond transparent, fabriqués par
 * scripts/packs-gemmes.mjs. Un pack absent d'ici dessine un tas de cristaux à
 * la place.
 *
 * `largeur` : la boîte de l'image, en % de l'écrin. Les images ne remplissent
 * pas leur carré pareil (la poignée déborde, le sac est étroit) ; ces largeurs
 * ramènent chaque objet aux deux tiers de l'écrin, comme au magasin de Clash
 * Royale — la poignée un peu plus petite que le sac et le baril.
 */
const ILLUSTRATIONS: Partial<Record<IdPack, IllustrationMagasin>> = {
  poignee: { image: poigneeIllustration, largeur: 68 },
  sac: { image: sacIllustration, largeur: 86 },
  baril: { image: barilIllustration, largeur: 86 },
}

/**
 * LA SECTION « GEMMES » (Lucas, 18/09/2026) — le modèle du magasin de Clash
 * Royale : un bandeau, trois packs sur une rangée, chacun avec son nom, son
 * écrin (quantité + illustration) et son prix en euros. Nos gemmes sont les
 * cristaux violets du bandeau.
 *
 * Un pack se demande dans une feuille : un parent paie par carte, les gemmes
 * arrivent quand le paiement est confirmé (migration 369).
 */
export default function RayonGemmes({
  packs,
  connecte,
}: {
  packs: readonly PackGemmes[]
  connecte: boolean
}) {
  const [choix, setChoix] = useState<{ id: string | null; open: boolean }>({ id: null, open: false })
  const pack = packs.find((p) => p.id === choix.id) ?? null

  return (
    <section id="gemmes" aria-labelledby="gemmes-titre" className="flex scroll-mt-20 flex-col gap-4">
      <BandeauSection id="gemmes-titre" variante="ruban">
        Gemmes
      </BandeauSection>

      {/* Le gabarit du magasin de Clash Royale, relevé au pixel sur une carte
          de 111 px (Lucas, 18/09/2026) et reporté en % de la carte (cqw) :
          carte 111 × 216, nom centré à 21 px, écrin de 79 × 97 posé à 54 px,
          prix (chiffres de 17 px) centré à 185 px, épaisseur de 9 px en bas,
          6 px entre les cartes. Plafonnée à 26rem : sur une colonne large
          (bureau), les cartes resteraient à l'échelle et monteraient à près
          de 600 px de haut ; elles s'arrêtent à ~134 × 261, centrées. */}
      <ul className="mx-auto grid w-full max-w-[26rem] grid-cols-3 gap-1.5">
        {packs.map((p) => (
          <li key={p.id} className="flex">
            <CarteMagasin
              titre={p.titre}
              etiquette={libelleQuantite(p.gemmes)}
              teinte="violet"
              illustration={ILLUSTRATIONS[p.id]}
              repli={<TasDeCristaux pack={p} />}
              bas={libelleEuros(p.prixEuros)}
              ariaLabel={`${p.titre} : ${libelleQuantite(p.gemmes)} gemmes pour ${libelleEuros(p.prixEuros)}`}
              onClick={() => {
                sfx.tap()
                setChoix({ id: p.id, open: true })
              }}
            />
          </li>
        ))}
      </ul>

      {pack ? (
        <FeuillePack
          key={pack.id}
          open={choix.open}
          pack={pack}
          connecte={connecte}
          onClose={() => setChoix((c) => ({ ...c, open: false }))}
        />
      ) : null}
    </section>
  )
}

/** L'écrin d'un pack, pour la feuille d'achat comme pour la carte. Sans
 *  illustration, un tas de cristaux qui grossit avec le pack. */
function EcrinPack({ pack, className }: { pack: PackGemmes; className?: string }) {
  return (
    <EcrinMagasin
      etiquette={libelleQuantite(pack.gemmes)}
      teinte="violet"
      illustration={ILLUSTRATIONS[pack.id]}
      repli={<TasDeCristaux pack={pack} />}
      className={className}
    />
  )
}

function TasDeCristaux({ pack }: { pack: PackGemmes }) {
  return tasDeCristaux(pack).map((c, i) => (
    <span
      key={i}
      className="absolute block"
      style={{
        left: `${c.x - c.taille / 2}%`,
        bottom: `${c.bas}%`,
        width: `${c.taille}%`,
        height: `${c.taille}%`,
        transform: `rotate(${c.rotation}deg)`,
      }}
    >
      <CristalIcon className="size-full" />
    </span>
  ))
}

function FeuillePack({
  open,
  pack,
  connecte,
  onClose,
}: {
  open: boolean
  pack: PackGemmes
  connecte: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [contact, setContact] = useState('')
  const [enCours, demarrer] = useTransition()
  const [erreur, setErreur] = useState<string | null>(null)
  const [envoyee, setEnvoyee] = useState(false)

  const envoyer = () => {
    setErreur(null)
    demarrer(async () => {
      const r = await demanderPackGemmes(pack.id, contact)
      if (!r.ok) {
        setErreur(r.message)
        return
      }
      sfx.correct()
      setEnvoyee(true)
    })
  }

  return (
    <Feuille open={open} onClose={onClose} label={pack.titre}>
      <div className="mx-auto mt-6 w-40">
        <EcrinPack pack={pack} className="w-full" />
      </div>
      <h2 className="font-heading mt-3 text-center text-2xl font-extrabold">{pack.titre}</h2>
      <p className="mt-1 flex items-center justify-center gap-1.5 text-sm font-bold text-muted-foreground">
        {libelleQuantite(pack.gemmes)} <CristalIcon className="size-4" /> pour{' '}
        <span className="text-foreground">{libelleEuros(pack.prixEuros)}</span>
      </p>

      <div className="mt-5 flex flex-col gap-2">
        {envoyee ? (
          <p
            role="status"
            aria-live="polite"
            className="rounded-2xl bg-secondary px-3 py-2.5 text-center text-sm font-semibold text-secondary-foreground"
          >
            C’est noté ! On recontacte ton parent pour le paiement, et tes gemmes arrivent dès
            qu’il est confirmé.
          </p>
        ) : !connecte ? (
          <Button size="lg" className="w-full rounded-full font-bold" onClick={() => router.push('/login')}>
            Connecte-toi pour acheter des gemmes
          </Button>
        ) : (
          <FormulaireDemandeCarte
            id={`pack-${pack.id}`}
            intro={`Un parent paie ${libelleEuros(pack.prixEuros)} par carte, et les ${libelleQuantite(pack.gemmes)} gemmes arrivent sur ton compte dès que le paiement est confirmé.`}
            contact={contact}
            onContact={setContact}
            enCours={enCours}
            onEnvoyer={envoyer}
          />
        )}
        {erreur ? (
          <p role="alert" className="text-center text-sm font-semibold text-destructive">
            {erreur}
          </p>
        ) : null}
      </div>
    </Feuille>
  )
}
