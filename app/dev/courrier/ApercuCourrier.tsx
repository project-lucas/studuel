'use client'

import { useEffect, useState } from 'react'
import BoiteAuxLettres from '@/components/courrier/BoiteAuxLettres'
import BoutonCourrierFlottant from '@/components/courrier/BoutonCourrierFlottant'
import type { PorteCourrier } from '@/components/courrier/porte'
import { poserNonLusCourrier } from '@/components/courrier/store'
import XpIcon from '@/components/ui/XpIcon'
import { gainsEnListe, nonLus, totalARecuperer, trierLettres, type Lettre } from '@/lib/courrier'
import { ecouterGains } from '@/lib/hud-gains'

const ID = (n: number) => `${String(n).padStart(8, '0')}-0000-4000-8000-000000000000`
const ID_LEA = '11111111-1111-4111-8111-111111111111'
const ID_NOAH = '22222222-2222-4222-8222-222222222222'

// L'horloge de la démo, arrondie aux dix minutes : le serveur et le navigateur
// rendent les mêmes dates (sinon `dateTime` diffère d'un rendu à l'autre et
// l'hydratation s'en plaint — une page réelle reçoit ses dates du serveur).
const BASE = Math.floor(Date.now() / 600_000) * 600_000

function ilYA(heures: number): string {
  return new Date(BASE - heures * 3_600_000).toISOString()
}

function lettre(sur: Partial<Lettre> & { id: string; titre: string }): Lettre {
  return {
    source: 'courrier',
    type: 'marcel',
    corps: '',
    lien: null,
    lienLibelle: null,
    gains: null,
    expediteur: 'Marcel',
    visage: { genre: 'marcel', pose: 'salut' },
    lue: false,
    recuperee: true,
    recueLe: ilYA(2),
    expireLe: null,
    defi: null,
    ...sur,
  }
}

/** La boîte garnie : ce qu'un élève trouve un mardi soir. */
function garnie(): Lettre[] {
  return trierLettres([
    lettre({
      id: ID(1),
      titre: 'Bienvenue dans ta boîte aux lettres !',
      corps:
        'Salut, moi c’est Marcel, ton coach. Ici tu recevras mes mots, les défis de tes amis et les nouvelles de ton coach. Pour commencer, un petit cadeau : 50 XP. Appuie sur « Récupérer » pour les faire voler jusqu’à ta barre.',
      lien: '/reviser',
      gains: { xp: 50, gemmes: 0 },
      visage: { genre: 'marcel', pose: 'invite' },
      recuperee: false,
      recueLe: ilYA(1),
    }),
    lettre({
      id: ID(2),
      source: 'defi',
      type: 'ami',
      titre: 'Léa te défie !',
      corps: 'Calcul mental · son score : 1 250 pts. À toi de faire mieux !',
      lien: '/defi/jeux/calcul-mental',
      lienLibelle: 'Relever',
      expediteur: 'Léa',
      visage: { genre: 'joueur', id: ID_LEA, portrait: '6' },
      recueLe: ilYA(5),
      expireLe: new Date(BASE + 6 * 24 * 3_600_000).toISOString(),
      defi: { mode: 'calcul-mental', sonScore: 1250 },
    }),
    lettre({
      id: ID(3),
      type: 'cadeau',
      titre: 'Le coffre de ta ligue',
      corps: 'Ton équipe a tenu toute la semaine : la ligue Argent vous offre son coffre. Bien joué à tous les cinq !',
      gains: { xp: 20, gemmes: 5 },
      expediteur: 'La ligue',
      visage: { genre: 'marcel', pose: 'recharge' },
      lue: true,
      recuperee: false,
      recueLe: ilYA(26),
    }),
    lettre({
      id: ID(4),
      source: 'annonce',
      type: 'coach',
      titre: 'Entraînement de jeudi',
      corps: 'On se retrouve à 18 h au gymnase. Révise ton chapitre de maths avant, je ramasse les cahiers !',
      expediteur: 'Coach Karim',
      visage: { genre: 'coach' },
      recueLe: ilYA(8),
    }),
    lettre({
      id: ID(5),
      source: 'annonce',
      type: 'nouveaute',
      titre: 'Le Musée est ouvert',
      corps: 'Un nouveau jeu d’arts plastiques : reconnais les chefs-d’œuvre du domaine public et grimpe dans la ligue.',
      lien: '/defi',
      lienLibelle: 'Y aller',
      expediteur: 'L’équipe Studuel',
      visage: { genre: 'studuel' },
      recueLe: ilYA(30),
    }),
    lettre({
      id: ID(6),
      type: 'ami',
      titre: 'Noah a battu ton score',
      corps: 'Sur Blitz : 940 pts contre tes 860. Tu lui rends la pareille ?',
      lien: '/defi/jouer?mode=blitz',
      expediteur: 'Noah',
      visage: { genre: 'joueur', id: ID_NOAH, portrait: '3' },
      lue: true,
      recueLe: ilYA(50),
    }),
    lettre({
      id: ID(7),
      titre: 'Ta série tient depuis 5 jours',
      corps: 'La flamme est passée au bleu. Si tu veux souffler demain, le gel de série t’attend à la Boutique.',
      lien: '/tresor',
      visage: { genre: 'marcel', pose: 'soir' },
      lue: true,
      recueLe: ilYA(72),
    }),
    lettre({
      id: ID(8),
      type: 'cadeau',
      titre: 'Un cadeau de rentrée',
      corps: 'Celui-là, tu l’as laissé passer : il a expiré.',
      gains: { xp: 30, gemmes: 0 },
      lue: true,
      recuperee: false,
      recueLe: ilYA(24 * 20),
      expireLe: ilYA(24 * 6),
    }),
  ])
}

function exemple(e: string): { lettres: Lettre[]; disponible: boolean } {
  if (e === 'vide') return { lettres: [], disponible: true }
  if (e === 'absente') return { lettres: [], disponible: false }
  if (e === 'lues') return { lettres: garnie().map((l) => ({ ...l, lue: true, recuperee: true })), disponible: true }
  return { lettres: garnie(), disponible: true }
}

const attendre = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** La porte de démonstration : les réponses du serveur, après un temps de réponse simulé. */
function porteDemo(lettres: Lettre[]): PorteCourrier {
  return {
    lire: async () => {
      await attendre(120)
      return true
    },
    toutLire: async () => {
      await attendre(300)
      return true
    },
    encaisser: async (id) => {
      await attendre(380)
      const l = lettres.find((x) => x.id === id)
      return l?.gains ? { ok: true, gains: gainsEnListe(l.gains), raison: 'ok' } : { ok: false, gains: [], raison: 'inconnue' }
    },
    toutRecuperer: async () => {
      await attendre(420)
      const total = totalARecuperer(lettres)
      return { ok: true, gains: gainsEnListe(total), raison: 'ok', lettres: total ? 1 : 0 }
    },
    relever: async () => {
      await attendre(200)
      return { ok: true }
    },
  }
}

export default function ApercuCourrier({ e }: { e: string }) {
  const [boite] = useState(() => exemple(e))
  const [porte] = useState(() => porteDemo(boite.lettres))

  useEffect(() => {
    poserNonLusCourrier(nonLus(boite.lettres))
    return () => poserNonLusCourrier(null)
  }, [boite])

  return (
    <div className="pt-4">
      <BarreDemo />
      <BoiteAuxLettres key={e} lettres={boite.lettres} disponible={boite.disponible} porte={porte} />
      <BoutonCourrierFlottant demo />
    </div>
  )
}

/**
 * Une barre de niveau de démonstration, à la place du vrai bandeau (absent
 * sans compte) : c'est la CIBLE des éclairs (`data-hud-cible="xp"`), et elle
 * avance jeton après jeton comme la vraie.
 */
function BarreDemo() {
  const [xp, setXp] = useState(120)
  useEffect(
    () =>
      ecouterGains((g) => {
        if (g.unite === 'xp') setXp((v) => v + g.montant)
      }),
    [],
  )
  const part = (xp % 400) / 400
  return (
    <div className="hud-gelule fixed inset-x-3 top-2 z-50 flex items-center gap-2 rounded-full bg-secondary px-3 py-2 [html.hud-volee_&]:z-[80]">
      <span className="font-heading text-sm font-extrabold">Niveau {Math.floor(xp / 400) + 7}</span>
      <XpIcon className="size-4" />
      <span data-hud-cible="xp" className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-card">
        <span
          className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary transition-transform duration-200"
          style={{ transform: `scaleX(${part})` }}
        />
      </span>
      <span className="font-heading text-xs font-extrabold tabular-nums">{xp} XP</span>
    </div>
  )
}
