'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Mic, Pause, Play, Shuffle } from 'lucide-react'
import Feuille from '@/components/boutique/Feuille'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { DEROULE_ORAL, consigneOralBlanc, tirerPiece, type Piece } from '@/lib/examen/dossier-oral'
import type { IdExamen } from '@/lib/examen/parcours'
import { useCoachFil } from '@/components/marcel/CoachFil'
import { compterPassage } from '@/app/examen/actions'

const SURTITRE: Record<IdExamen, string> = {
  brevet: 'Ton projet',
  'bac-francais': 'Tiré au sort',
  bac: 'Le jury a choisi',
}

function mmss(s: number): string {
  const v = Math.max(0, s)
  return `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`
}

/**
 * L’ORAL BLANC, COMME LE JOUR J (maquette 5). Marcel tire une pièce du dossier
 * — un texte de la liste, l’une des deux questions —, en favorisant celles
 * jamais passées. La préparation se chronomètre ici (30 min au bac de
 * français, 20 au Grand oral) ; ensuite, « On commence » prépare la demande à
 * Marcel, qui joue l’examinateur : l’élève parle au micro du champ.
 */
export default function OralBlanc({
  examen,
  pieces,
  tirage,
  onClose,
}: {
  examen: IdExamen
  pieces: Piece[]
  /** Le hasard du tirage, fixé au toucher qui ouvre ; `null` = fermé. */
  tirage: number | null
  onClose: () => void
}) {
  const ouvert = tirage !== null
  const { proposer } = useCoachFil()
  const deroule = DEROULE_ORAL[examen]
  const [tiree, setTiree] = useState<Piece | null>(null)
  const [reste, setReste] = useState(deroule.preparation * 60)
  const [enCours, setEnCours] = useState(false)

  // À chaque ouverture (un nouveau `tirage`) : la pièce tirée, le chrono
  // remis à zéro — le motif « prop précédente », sans effet.
  const [graine, setGraine] = useState<number | null>(null)
  if (tirage !== graine) {
    setGraine(tirage)
    if (tirage !== null) {
      setTiree(tirerPiece(pieces, tirage))
      setReste(deroule.preparation * 60)
      setEnCours(false)
    }
  }

  useEffect(() => {
    if (!enCours) return
    const id = window.setInterval(() => {
      setReste((r) => {
        if (r <= 1) {
          window.clearInterval(id)
          setEnCours(false)
          sfx.tap()
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [enCours])

  const commencer = () => {
    if (!tiree) return
    sfx.tap()
    void compterPassage(tiree.id)
    onClose()
    proposer('question', consigneOralBlanc(examen, tiree))
  }

  return (
    <Feuille open={ouvert} onClose={onClose} label="Ton oral blanc">
      {tiree ? (
        <div className="space-y-3 pt-1">
          <div className="carte-sombre relative overflow-hidden rounded-[22px] p-4 pr-24">
            <p className="text-highlight text-[10.5px] font-extrabold tracking-[0.08em] uppercase">
              {SURTITRE[examen]}
              {examen === 'bac-francais' ? ` · texte ${pieces.findIndex((p) => p.id === tiree.id) + 1} sur ${pieces.length}` : ''}
            </p>
            <h2 className="font-heading mt-1 text-[19px] leading-tight font-extrabold">{tiree.titre}</h2>
            {tiree.detail ? <p className="text-[12px] font-semibold opacity-80">{tiree.detail}</p> : null}
            {deroule.preparation > 0 ? (
              <div className="mt-3 flex items-center gap-2.5">
                <span className="font-heading text-[40px] leading-none font-extrabold tracking-tight tabular-nums" aria-live="off">
                  {mmss(reste)}
                </span>
                <span className="text-[12px] font-bold opacity-80">{reste === 0 ? 'temps écoulé' : 'de préparation'}</span>
              </div>
            ) : null}
            <Image
              src="/images/marcel/poses/lit.webp"
              alt=""
              width={96}
              height={128}
              unoptimized
              className="absolute -right-1 -bottom-2 h-[118px] w-auto"
            />
          </div>

          <ol className="carte p-3">
            {deroule.preparation > 0 ? (
              <Pas n={1} titre="Prépare au brouillon" detail="Ton introduction, ton plan, ta conclusion" minutes={deroule.preparation} actif />
            ) : null}
            {deroule.temps.map((t, i) => (
              <Pas key={t.id} n={i + (deroule.preparation > 0 ? 2 : 1)} titre={t.titre} detail={t.detail} minutes={t.minutes} />
            ))}
          </ol>

          <div className="flex gap-2">
            {deroule.preparation > 0 ? (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => {
                  sfx.tap()
                  setEnCours((e) => !e)
                }}
              >
                {enCours ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
                {enCours ? 'Pause' : reste < deroule.preparation * 60 ? 'Reprendre' : 'Lancer le chrono'}
              </Button>
            ) : null}
            {pieces.length > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="lg"
                aria-label="Tirer une autre pièce"
                onClick={() => {
                  sfx.tap()
                  const autres = pieces.filter((p) => p.id !== tiree.id)
                  setTiree(tirerPiece(autres, Math.random()))
                  setReste(deroule.preparation * 60)
                  setEnCours(false)
                }}
              >
                <Shuffle aria-hidden="true" />
              </Button>
            ) : null}
          </div>
          <Button type="button" size="xl" shine className="w-full" onClick={commencer}>
            <Mic aria-hidden="true" />
            {deroule.preparation > 0 ? 'J’ai fini de préparer' : 'On commence'}
          </Button>
          <p className="text-muted-foreground text-center text-[11.5px] font-semibold">
            Tu parles au micro du champ, je joue {examen === 'bac-francais' ? 'l’examinateur' : 'le jury'}. Un crédit par échange.
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground p-4 text-center text-[13px] font-semibold">
          Ajoute d’abord une pièce à ton dossier : je tirerai au sort parmi elles.
        </p>
      )}
    </Feuille>
  )
}

function Pas({ n, titre, detail, minutes, actif = false }: { n: number; titre: string; detail: string; minutes: number; actif?: boolean }) {
  return (
    <li className="border-secondary flex items-center gap-2.5 border-t-[1.5px] py-1.5 first:border-t-0">
      <span
        className={cn(
          'font-heading grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-extrabold',
          actif ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary',
        )}
      >
        {n}
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-heading block text-[13.5px] leading-tight font-extrabold">{titre}</span>
        <span className="text-muted-foreground block text-[11.5px] leading-snug font-semibold">{detail}</span>
      </span>
      <span className="text-muted-foreground shrink-0 text-[11px] font-extrabold">{minutes} min</span>
    </li>
  )
}
