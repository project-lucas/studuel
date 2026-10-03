import Image from 'next/image'
import { notFound } from 'next/navigation'
import XpIcon from '@/components/ui/XpIcon'
import { portraitSrc } from '@/lib/portraits'
import { cn } from '@/lib/utils'
import s from './maquettes.module.css'

export const dynamic = 'force-dynamic'

// LES MAQUETTES DU BANDEAU DU HAUT (03/10/2026) — en développement seulement.
//
// Lucas : « le fond blanc, la police, cela ne me convient pas ; propose-moi
// plusieurs maquettes pour la barre du haut, qui a maintenant l'icône des
// quêtes ». Quatre directions, mêmes données (niveau 8, ×1,0, série 12,
// 1 000 015 gemmes — le cas réel le plus long —, quêtes 1/3 avec quelque chose
// à encaisser), posées sur le haut de l'accueil Réviser. Statique.
//
//   /dev/bandeau-maquettes

const AVATAR = portraitSrc('7')
const FLAMME = '/images/serie/flamme-fixe.webp'
const GEMME = '/images/monnaie/cristal.webp'
const QUETES = '/images/defi/icones/quetes-v3.webp'

/** 1 000 015 → « 1 M » : au-delà de 100 000, le compte s'abrège. */
const GEMMES_COURT = '1 M'

function Icone({ src, className }: { src: string; className?: string }) {
  return <Image src={src} alt="" width={80} height={80} className={cn('shrink-0 object-contain', className)} />
}

function Avatar({ className }: { className?: string }) {
  return (
    <span className={cn('relative block shrink-0 overflow-hidden rounded-full', className)}>
      <Image src={AVATAR} alt="" width={96} height={96} className="absolute top-[-20%] left-[-40%] h-[180%] w-[180%] max-w-none" />
    </span>
  )
}

/** Le haut de l'accueil Réviser, sous le bandeau, pour juger le contraste. */
function Dessous() {
  return (
    <div className="tab-bg absolute inset-0 -z-10 flex flex-col gap-3 px-4 pt-20">
      <div className="carte h-28" />
      <div className="carte h-16" />
      <p className="titre-section">Mes matières</p>
    </div>
  )
}

function Telephone({ titre, note, children }: { titre: string; note: string; children: React.ReactNode }) {
  return (
    <figure className="flex w-[390px] flex-col gap-2">
      <figcaption>
        <p className="font-heading text-lg font-extrabold">{titre}</p>
        <p className="text-sm text-muted-foreground">{note}</p>
      </figcaption>
      <div className={cn(s.telephone, 'isolate')}>
        <Dessous />
        {children}
      </div>
    </figure>
  )
}

// --- A · Plaques de jeu ---------------------------------------------------------

function MaquetteA() {
  return (
    <Telephone
      titre="A · Plaques de jeu"
      note="Une plaque violette cernée par objet, chiffres blancs cernés, « + » doré sur les gemmes. La famille du magasin et de l’arène."
    >
      <div className="flex items-center gap-2 px-3 pt-4">
        <div className="relative flex min-w-0 flex-1 items-center">
          <span className="relative z-10 shrink-0">
            <Avatar className="size-11 ring-[3px] ring-[#2b1650]" />
            <span className={cn(s.chiffre, 'absolute -bottom-1 -left-1 grid size-5 place-items-center rounded-md border-2 border-[#2b1650] bg-primary text-[12px]')}>
              8
            </span>
          </span>
          <div className={cn(s.plaque, '-ml-3 min-w-0 flex-1 pl-4')}>
            <div className={cn(s.barreXp, 'min-w-0 flex-1')}>
              <div className={s.barreXpPlein} style={{ width: '45%' }} />
            </div>
            <span className={cn(s.chiffre, 'text-[12px]')}>×1,0</span>
          </div>
        </div>
        <div className={s.plaque}>
          <Icone src={FLAMME} className="-my-2 size-7" />
          <span className={cn(s.chiffre, 'text-[17px]')}>12</span>
        </div>
        <div className={s.plaque}>
          <Icone src={GEMME} className="size-6" />
          <span className={cn(s.chiffre, 'text-[17px]')}>{GEMMES_COURT}</span>
          <span className={s.plaquePlus}>+</span>
        </div>
        <div className={cn(s.plaque, 'px-1.5')}>
          <Icone src={QUETES} className="-my-3 size-9" />
          <span className="absolute -top-1.5 -right-1.5 size-3.5 rounded-full border-2 border-[#2b1650] bg-destructive" />
        </div>
      </div>
    </Telephone>
  )
}

// --- B · Bande violette ---------------------------------------------------------

function MaquetteB() {
  return (
    <Telephone
      titre="B · Bande violette"
      note="Une bande pleine en violet de marque, liseré d’or en pied, jetons creusés. Le bandeau devient un objet du jeu, sur tous les onglets."
    >
      <div className={cn(s.bande, 'flex items-center gap-2 px-3 pt-4 pb-2.5')}>
        <Avatar className="size-10 ring-2 ring-highlight" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex items-center gap-1.5">
            <span className={cn(s.chiffre, 'text-[13px]')}>Niveau 8</span>
            <span className="rounded-full bg-highlight px-1.5 text-[10px] font-extrabold text-[#2b1650]">×1,0</span>
          </span>
          <div className="h-2 overflow-hidden rounded-full bg-black/30">
            <div className="h-full w-[45%] rounded-full bg-highlight" />
          </div>
        </div>
        <span className={s.bandeJeton}>
          <Icone src={FLAMME} className="-my-1 size-6" />
          <span className={cn(s.chiffre, 'text-[16px]')}>12</span>
        </span>
        <span className={s.bandeJeton}>
          <Icone src={GEMME} className="size-5" />
          <span className={cn(s.chiffre, 'text-[16px]')}>{GEMMES_COURT}</span>
        </span>
        <span className={cn(s.bandeJeton, 'relative px-1')}>
          <Icone src={QUETES} className="-my-2 size-8" />
          <span className={cn(s.chiffre, 'pr-1 text-[13px] text-highlight')}>1/3</span>
          <span className="absolute -top-1 -right-1 size-3 rounded-full bg-destructive ring-2 ring-[#2b1650]" />
        </span>
      </div>
    </Telephone>
  )
}

// --- C · Objets posés -----------------------------------------------------------

/** L'anneau d'XP autour de l'avatar (SVG : un cercle de fond, un arc plein). */
function AnneauXp({ ratio }: { ratio: number }) {
  const r = 21
  const c = 2 * Math.PI * r
  return (
    <span className="relative grid size-12 place-items-center">
      <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={r} fill="none" strokeWidth="4" className="stroke-secondary" />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${c * ratio} ${c}`}
          style={{ stroke: 'var(--highlight)' }}
        />
      </svg>
      <Avatar className="size-9" />
      <span className="font-heading absolute -bottom-1 -left-1 grid size-5 place-items-center rounded-full bg-primary text-[11px] font-extrabold text-primary-foreground ring-2 ring-background">
        8
      </span>
    </span>
  )
}

function MaquetteC() {
  return (
    <Telephone
      titre="C · Objets posés, sans fond"
      note="Plus de pastille blanche : les objets et leurs chiffres posés sur le mur, comme Duolingo. Le niveau devient un anneau d’or autour de l’avatar."
    >
      <div className={cn(s.pose, 'flex items-center justify-between px-4 pt-3.5 pb-2.5')}>
        <span className="flex items-center gap-1.5">
          <AnneauXp ratio={0.45} />
          <span className="font-heading rounded-full bg-secondary px-2 py-0.5 text-xs font-extrabold text-primary">×1,0</span>
        </span>
        <span className="flex items-center gap-0.5">
          <Icone src={FLAMME} className="size-8" />
          <span className="font-heading text-xl font-extrabold text-[color:oklch(0.68_0.18_50)]">12</span>
        </span>
        <span className="flex items-center gap-1">
          <Icone src={GEMME} className="size-7" />
          <span className="font-heading text-xl font-extrabold text-primary">{GEMMES_COURT}</span>
        </span>
        <span className="relative flex items-center">
          <Icone src={QUETES} className="size-10" />
          <span className="font-heading text-xl font-extrabold text-[color:oklch(0.62_0.13_75)]">1/3</span>
          <span className="absolute top-0 left-7 size-3 rounded-full bg-destructive ring-2 ring-background" />
        </span>
      </div>
    </Telephone>
  )
}

// --- D · Lavande douce ----------------------------------------------------------

/** Le parchemin dans un anneau en trois tronçons, un par quête. */
function AnneauQuetes({ faites }: { faites: number }) {
  return (
    <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-card shadow-sm">
      <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx="22"
            cy="22"
            r="19"
            fill="none"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={`${(2 * Math.PI * 19) / 3 - 6} ${2 * Math.PI * 19}`}
            strokeDashoffset={-i * ((2 * Math.PI * 19) / 3)}
            style={{ stroke: i < faites ? 'var(--highlight)' : 'var(--secondary)' }}
          />
        ))}
      </svg>
      <Icone src={QUETES} className="size-7" />
      <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-destructive ring-2 ring-background" />
    </span>
  )
}

function MaquetteD() {
  return (
    <Telephone
      titre="D · Lavande douce"
      note="Une seule gélule lavande, encre prune en Baloo 2, et les quêtes à part dans un anneau en trois tronçons. Le plus calme des quatre."
    >
      <div className="flex items-center gap-2 px-3 pt-4">
        <div className={cn(s.lavande, 'min-w-0 flex-1 gap-2 pr-3 pl-1')}>
          <Avatar className="size-9 ring-2 ring-highlight" />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="font-heading flex items-center gap-1 text-[13px] leading-none font-extrabold text-[#3b2470]">
              Niveau 8 <XpIcon className="size-3" />
              <span className="text-primary">×1,0</span>
            </span>
            <span className="h-1.5 overflow-hidden rounded-full bg-card">
              <span className="block h-full w-[45%] rounded-full bg-primary" />
            </span>
          </span>
          <span className="h-6 w-px bg-primary/15" />
          <span className="font-heading flex items-center gap-0.5 text-base font-extrabold text-[#3b2470]">
            <Icone src={FLAMME} className="size-6" />
            12
          </span>
          <span className="h-6 w-px bg-primary/15" />
          <span className="font-heading flex items-center gap-1 text-base font-extrabold text-[#3b2470]">
            <Icone src={GEMME} className="size-5" />
            {GEMMES_COURT}
          </span>
        </div>
        <AnneauQuetes faites={1} />
      </div>
    </Telephone>
  )
}

export default function MaquettesBandeauPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <main className="min-h-dvh bg-muted/40 px-4 pt-20 pb-24">
      <div className="flex flex-wrap justify-center gap-8">
        <MaquetteA />
        <MaquetteB />
        <MaquetteC />
        <MaquetteD />
      </div>
    </main>
  )
}
