'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import BlocCapsule from '@/components/capsules/BlocCapsule'
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
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'

/**
 * LES CAPSULES, AU CENTRE DE LA BOUTIQUE (Lucas, 18/09/2026) : des
 * mini-formations rangées par thème. Depuis le 24/09/2026, chacune est un BLOC
 * pleine largeur façon offre du magasin de Clash Royale (BlocCapsule : cadre à
 * sa teinte, scènes qui défilent, panneau du prix à droite), les blocs les uns
 * sous les autres — plus de rayon qui défile sur le côté. Un bloc ouvre la
 * fiche produit (FicheCapsule), où l'on débloque en gemmes — ou, pour les plus
 * chères, par carte bancaire.
 */
/** La fiche fermée — une CONSTANTE : `useFermeAuMasquage` la veut stable. */
const FICHE_FERMEE: { id: string | null; open: boolean } = { id: null, open: false }

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
  const [fiche, setFiche] = useState(FICHE_FERMEE)
  // « Ouvrir dans mon carnet » quitte la Boutique sans refermer la fiche : au
  // retour sur l'onglet (gardé vivant, components/OngletsVivants), elle repart
  // fermée.
  useFermeAuMasquage(setFiche, FICHE_FERMEE)
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
          fiche, un quiz et un outil. Elles t’attendent ensuite dans ta bibliothèque.
        </p>
      </header>

      {rayons.length === 0 ? (
        <p className="rounded-3xl bg-card px-4 py-5 text-center text-sm font-semibold text-muted-foreground ring-1 ring-border">
          Les premières capsules arrivent très bientôt.
        </p>
      ) : (
        rayons.map(({ theme, capsules: liste }, indexRayon) => (
          <div key={theme.id} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3 px-1">
              <h3 className="font-heading text-lg font-extrabold">{theme.label}</h3>
              <p className="truncate text-xs font-semibold text-muted-foreground">{theme.accroche}</p>
            </div>
            <ul className="mx-auto flex w-full max-w-xl flex-col gap-4 pb-1">
              {liste.map((capsule, index) => (
                <li key={capsule.id}>
                  <OffreCapsule
                    capsule={capsule}
                    achat={parCapsule.get(capsule.id) ?? null}
                    gemmes={gemmes}
                    prioritaire={indexRayon === 0 && index === 0}
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

/** Une capsule en vente : le bloc, et au pied de son panneau le prix ou l'état. */
function OffreCapsule({
  capsule,
  achat,
  gemmes,
  prioritaire,
  onOpen,
}: {
  capsule: Capsule
  achat: AchatCapsule | null
  gemmes: number
  prioritaire: boolean
  onOpen: () => void
}) {
  const etat = etatCapsule(capsule, achat, gemmes)
  const possedee = etat.kind === 'possedee'

  return (
    <BlocCapsule
      capsule={capsule}
      onClick={onOpen}
      ouvreUneFeuille
      premiereImagePrioritaire={prioritaire}
      ariaLabel={`${capsule.titre} — ${possedee ? 'dans ta bibliothèque' : `${capsule.prixGemmes} gemmes`}`}
      pied={
        possedee ? (
          <span className="flex items-center justify-center gap-1 rounded-lg bg-white py-1.5 text-xs font-extrabold text-primary">
            <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> À toi
          </span>
        ) : etat.kind === 'en-attente' ? (
          <span className="block rounded-lg bg-white/90 py-1.5 text-center text-[11px] font-extrabold text-foreground">
            Demande envoyée
          </span>
        ) : (
          // Le prix, sur la bande sombre du bas du panneau, comme au magasin.
          <span className="flex flex-col items-center gap-0.5 rounded-lg bg-black/35 py-1.5">
            <PrixGemmes montant={capsule.prixGemmes} className="text-base text-white" iconeClassName="size-4.5" />
            {capsule.prixEuros !== null ? (
              <span className="text-[10px] font-bold text-white/75">ou {libelleEuros(capsule.prixEuros)}</span>
            ) : null}
          </span>
        )
      }
    />
  )
}
