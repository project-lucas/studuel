'use client'

import { useState } from 'react'
import { Check, Clock } from 'lucide-react'
import CouvertureCapsule from '@/components/capsules/CouvertureCapsule'
import BandeauSection from '@/components/boutique/BandeauSection'
import PrixGemmes from '@/components/boutique/PrixGemmes'
import FicheCapsule from '@/components/boutique/FicheCapsule'
import {
  etatCapsule,
  libelleEuros,
  rayonsParTheme,
  type AchatCapsule,
  type Capsule,
} from '@/lib/capsules'
import { sfx } from '@/lib/sounds'

/**
 * LES CAPSULES, AU CENTRE DE LA BOUTIQUE (Lucas, 18/09/2026) : des
 * mini-formations rangées par thème, un rayon qui défile sur le côté par
 * thème. Une carte ouvre la fiche produit (FicheCapsule), où l'on débloque en
 * gemmes — ou, pour les plus chères, par carte bancaire.
 */
export default function RayonsCapsules({
  capsules,
  achats,
  gemmes,
  connecte,
}: {
  capsules: Capsule[]
  achats: AchatCapsule[]
  gemmes: number
  connecte: boolean
}) {
  // La fiche garde sa capsule pendant l'animation de fermeture : on retient
  // la dernière ouverte, et `open` dit seulement si elle est à l'écran.
  const [fiche, setFiche] = useState<{ id: string | null; open: boolean }>({
    id: null,
    open: false,
  })
  const parCapsule = new Map(achats.map((a) => [a.capsuleId, a]))
  const rayons = rayonsParTheme(capsules)
  const ouverte = capsules.find((c) => c.id === fiche.id) ?? null

  return (
    <section id="capsules" aria-labelledby="capsules-titre" className="flex scroll-mt-20 flex-col gap-5">
      <header className="flex flex-col gap-3">
        <BandeauSection id="capsules-titre" variante="parchemin">
          Capsules
        </BandeauSection>
        <p className="px-1 text-sm text-muted-foreground">
          Apprends autre chose avec des mini-formations à débloquer en gemmes : un cours, une
          fiche, un quiz et un outil. Elles t’attendent ensuite dans ton carnet.
        </p>
      </header>

      {rayons.length === 0 ? (
        <p className="rounded-3xl bg-card px-4 py-5 text-center text-sm font-semibold text-muted-foreground ring-1 ring-border">
          Les premières capsules arrivent très bientôt.
        </p>
      ) : (
        rayons.map(({ theme, capsules: liste }) => (
          <div key={theme.id} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3 px-1">
              <h3 className="font-heading text-lg font-extrabold">{theme.label}</h3>
              <p className="truncate text-xs font-semibold text-muted-foreground">{theme.accroche}</p>
            </div>
            <ul className="capsule-rayon -mx-4 flex gap-3 overflow-x-auto px-4 pt-1 pb-3">
              {liste.map((capsule) => (
                <li key={capsule.id} className="flex w-60 shrink-0 snap-start">
                  <CarteCapsule
                    capsule={capsule}
                    achat={parCapsule.get(capsule.id) ?? null}
                    gemmes={gemmes}
                    onOpen={() => {
                      sfx.tap()
                      setFiche({ id: capsule.id, open: true })
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      {ouverte ? (
        <FicheCapsule
          key={ouverte.id}
          open={fiche.open}
          capsule={ouverte}
          achat={parCapsule.get(ouverte.id) ?? null}
          gemmes={gemmes}
          connecte={connecte}
          onClose={() => setFiche((f) => ({ ...f, open: false }))}
        />
      ) : null}
    </section>
  )
}

function CarteCapsule({
  capsule,
  achat,
  gemmes,
  onOpen,
}: {
  capsule: Capsule
  achat: AchatCapsule | null
  gemmes: number
  onOpen: () => void
}) {
  const etat = etatCapsule(capsule, achat, gemmes)
  const possedee = etat.kind === 'possedee'

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`${capsule.titre} — ${possedee ? 'dans ton carnet' : `${capsule.prixGemmes} gemmes`}`}
      className="press-3d flex w-full cursor-pointer flex-col overflow-hidden rounded-3xl bg-card text-left ring-1 ring-border"
    >
      <CouvertureCapsule capsule={capsule} taille="carte">
        <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-black/25 px-2 py-0.5 text-[11px] font-bold backdrop-blur-sm">
          <Clock className="size-3" aria-hidden="true" /> {capsule.dureeMin} min
        </span>
        {possedee ? (
          <span className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-[11px] font-extrabold text-primary shadow-sm">
            <Check className="size-3" strokeWidth={3} aria-hidden="true" /> À toi
          </span>
        ) : etat.kind === 'en-attente' ? (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-card px-2 py-0.5 text-[11px] font-extrabold text-foreground shadow-sm">
            Demande envoyée
          </span>
        ) : null}
      </CouvertureCapsule>

      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <h4 className="font-heading text-base leading-tight font-extrabold text-balance">
          {capsule.titre}
        </h4>
        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{capsule.accroche}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          {possedee ? (
            <span className="font-heading text-sm font-extrabold text-primary">Ouvrir</span>
          ) : (
            <PrixGemmes montant={capsule.prixGemmes} className="text-base text-primary" />
          )}
          {!possedee && capsule.prixEuros !== null ? (
            <span className="text-[11px] font-bold text-muted-foreground">
              ou {libelleEuros(capsule.prixEuros)}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  )
}
