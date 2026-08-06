'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trophy } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { recordLabel } from '@/lib/jeux/records'
import type { ModeTicket as Ticket, ModeTone } from '@/lib/defi/modes-catalog'

// Robe de chaque billet selon sa famille — même vocabulaire que l'arène :
// violet = jeu de matière, bleu = mode fun de l'Arène, or = mode du jour.
// Dégradé VERTICAL façon Clash Royale : plus clair en haut, plus foncé en bas.
const TICKET_CLASS: Record<ModeTone, string> = {
  matiere:
    'bg-gradient-to-b from-[oklch(0.62_0.19_300)] to-[oklch(0.41_0.2_302)]',
  fun: 'bg-gradient-to-b from-[oklch(0.66_0.14_255)] to-[oklch(0.44_0.16_262)]',
  featured:
    'bg-gradient-to-b from-[oklch(0.72_0.14_80)] to-[oklch(0.49_0.13_70)]',
}

/**
 * Un billet de mode, façon carte « Modes de jeu » de Clash Royale, pleine
 * largeur. Le billet porte le TITRE cartoon (blanc, contour sombre épais) et
 * soit la SCÈNE plein-fond (bannière 16:9, sujet dans le tiers droit), soit la
 * GRANDE illustration détourée ancrée en bas à droite sur robe unie. Le ruban
 * (« ×2 XP », « Bientôt ») se pose en coin haut-gauche, le RECORD personnel en
 * coin haut-droit.
 *
 * Ce composant vit hors de la feuille des modes parce que le MÊME billet est
 * désormais servi à deux endroits : l'écran « Modes de jeu » de l'arène et
 * l'onglet Défis de chaque matière. Une seule robe, un seul format, un seul
 * fichier à retoucher.
 */
export default function ModeTicket({
  ticket,
  record = null,
}: {
  ticket: Ticket
  /**
   * Record personnel à afficher (0 = « Aucun record »). `null` quand ce défi
   * n'en garde pas — on ne montre alors aucune pastille plutôt qu'un zéro qui
   * ne veut rien dire.
   */
  record?: number | null
}) {
  const disabled = !ticket.href

  const inner = (
    <span
      className={`defi-ticket relative flex h-[136px] overflow-hidden rounded-[18px] ${TICKET_CLASS[ticket.tone]}`}
      style={{ '--tk-notch': '0px' } as CSSProperties}
    >
      {/* Corps pleine largeur : titre à gauche, scène plein-fond OU grand art
          ancré en bas à droite. */}
      <span className="relative min-w-0 flex-1">
        {ticket.scene ? (
          /* La SCÈNE plein-fond : elle couvre tout le corps (au-dessus du
             motif losange z-0, sous le biseau z-1 posé après elle dans
             l'arbre), avec un voile dégradé à gauche pour asseoir le titre. */
          <span aria-hidden="true" className="absolute inset-0 z-[1]">
            <Image
              src={ticket.scene}
              alt=""
              fill
              sizes="(max-width: 448px) 92vw, 400px"
              className="object-cover"
            />
            <span className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/15 to-transparent" />
          </span>
        ) : (
          /* La GRANDE illustration : absolue dans la moitié droite du corps,
             ancrée en bas (le bas du perso est coupé net par la carte). */
          <span
            aria-hidden="true"
            className="absolute right-1 bottom-0 z-[5] flex h-[110%] items-end"
          >
            {ticket.image ? (
              <Image
                src={ticket.image}
                alt=""
                width={200}
                height={200}
                className="h-full w-auto object-contain object-bottom drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]"
              />
            ) : (
              <span className="text-[4.75rem] leading-none drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]">
                {ticket.emoji}
              </span>
            )}
          </span>
        )}

        {/* Le titre cartoon : très gros, blanc, contour sombre épais, aligné
            à gauche sur 1-2 lignes — et sur une scène, le jeton XP en pastille
            dorée juste dessous. */}
        <span className="relative z-10 flex h-full max-w-[62%] flex-col items-start justify-center gap-1.5 pl-4">
          <span className="defi-ticket-title font-heading line-clamp-2 text-[1.45rem] leading-[1.08] font-extrabold">
            {ticket.name}
          </span>
          {ticket.scene && ticket.chip ? (
            <span className="font-heading rounded-full bg-highlight px-2.5 py-0.5 text-[11px] font-extrabold text-foreground shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
              {ticket.chip}
            </span>
          ) : null}
        </span>
      </span>

      {ticket.badge ? (
        <span
          className={`absolute top-2 left-0 z-20 rounded-r-md px-2 py-0.5 text-[9px] font-extrabold tracking-wide uppercase shadow-[0_2px_4px_rgba(0,0,0,0.35)] ${
            ticket.badge === 'Bientôt'
              ? 'bg-black/45 text-white/85'
              : 'bg-destructive text-white'
          }`}
        >
          {ticket.badge}
        </span>
      ) : null}

      {/* Le RECORD personnel : ce qu'on vient battre. En or dès qu'il existe
          (c'est un gain), sobre tant que le jeu n'a jamais été joué. */}
      {record !== null ? (
        <span
          className={`font-heading absolute top-2 right-2 z-20 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold shadow-[0_2px_6px_rgba(0,0,0,0.45)] tabular-nums ${
            record > 0
              ? 'bg-highlight text-foreground'
              : 'bg-black/45 text-white/75'
          }`}
        >
          <Trophy className="size-3" aria-hidden="true" />
          {recordLabel(record)}
        </span>
      ) : null}
    </span>
  )

  // L'anneau de focus vit sur l'élément parent NON masqué (le mask du billet
  // rognerait le ring). Effet « press » : la carte se tasse au tap (scale).
  if (ticket.href) {
    return (
      <Link
        href={ticket.href}
        onClick={() => sfx.tap()}
        className="block rounded-[18px] transition-transform duration-100 ease-out focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none active:scale-[0.97]"
      >
        {inner}
      </Link>
    )
  }
  return <div className={disabled ? 'opacity-55' : undefined}>{inner}</div>
}
