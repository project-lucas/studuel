'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Mic,
  MicOff,
  Play,
  Square,
  Check,
  Send,
  Sparkles,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  CRITERES,
  CRITERES_VIDES,
  EPREUVES,
  epreuveOf,
  formatDuree,
  verdictDuree,
  type CritereId,
  type Criteres,
  type EpreuveId,
} from '@/lib/coach/oral'
import {
  conseilsOral,
  demanderEcoute,
  enregistrerPassage,
} from '@/app/marcel/oral-actions'

// L'atelier d'oral — barreaux 2, 3 et 4 de l'échelle (doctrine COACH-PROF §4).
//
// ⚠️ LE POINT LE PLUS IMPORTANT DE CE FICHIER : au barreau 3, l'audio est
// enregistré par le NAVIGATEUR (MediaRecorder), lu depuis une URL locale
// (`URL.createObjectURL`), et **jamais envoyé nulle part**. Il n'existe aucun
// chemin, dans ce composant, entre le Blob et le réseau. C'est un choix de
// doctrine : pas de voix de mineur sur nos serveurs — donc pas de RGPD à
// porter, pas de stockage à payer, et rien qui puisse fuiter. Le serveur ne
// reçoit qu'une durée et trois booléens.
//
// Marcel ne NOTE pas l'oral. Il fait répéter, il compte le temps, et il rend la
// grille d'auto-évaluation. Toute tentative future de « scorer » un oral par une
// machine contredirait la promesse affichée à l'écran.
//
// L'AVIS DE MARCEL (bouton du bilan) ne change rien à ça, et c'est pour cette
// raison qu'il est défendable : il part de la DURÉE tenue, du sujet annoncé et
// des cases que l'élève vient de cocher — jamais du son. Marcel ne l'a pas
// entendu, l'écran le dit sous le bouton, et un test le vérifie
// (lib/coach/oral-conseils.test.ts). C'est le seul geste payant de l'atelier, et
// il faut le demander.

type Ami = { id: string; nom: string }
type Etape = 'reglage' | 'pret' | 'encours' | 'bilan'

export default function OralAtelier({
  epreuveDefaut,
  amis,
  disponible,
}: {
  epreuveDefaut: EpreuveId
  amis: Ami[]
  disponible: boolean
}) {
  const [epreuveId, setEpreuveId] = useState<EpreuveId>(epreuveDefaut)
  const [sujet, setSujet] = useState('')
  const [avecMicro, setAvecMicro] = useState(false)
  const [etape, setEtape] = useState<Etape>('reglage')
  const [secondes, setSecondes] = useState(0)
  const [criteres, setCriteres] = useState<Criteres>(CRITERES_VIDES)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [erreurMicro, setErreurMicro] = useState<string | null>(null)
  const [enregistre, setEnregistre] = useState(false)
  // L'avis de Marcel sur le passage : demandé à la main, jamais automatique.
  const [conseils, setConseils] = useState<string[] | null>(null)
  const [avisEnCours, setAvisEnCours] = useState(false)

  const epreuve = epreuveOf(epreuveId)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const urlRef = useRef<string | null>(null)

  // Ménage : un minuteur qui survit à la page, un micro qui reste ouvert et une
  // URL d'objet jamais révoquée sont trois fuites classiques. On ferme tout.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      recorderRef.current?.stream.getTracks().forEach((t) => t.stop())
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    }
  }, [])

  const demarrer = async () => {
    setErreurMicro(null)
    setMessage(null)
    setSecondes(0)
    setEnregistre(false)
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
      setAudioUrl(null)
    }

    if (avecMicro) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        const rec = new MediaRecorder(stream)
        chunksRef.current = []
        rec.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data)
        }
        rec.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: rec.mimeType })
          const url = URL.createObjectURL(blob)
          urlRef.current = url
          setAudioUrl(url)
          stream.getTracks().forEach((t) => t.stop())
        }
        rec.start()
        recorderRef.current = rec
      } catch {
        setErreurMicro(
          'Micro indisponible. Tu peux quand même répéter sans enregistrement : décoche la case.',
        )
        return
      }
    }

    sfx.tap()
    setEtape('encours')
    timerRef.current = setInterval(() => setSecondes((s) => s + 1), 1000)
  }

  const arreter = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
    recorderRef.current?.stop()
    recorderRef.current = null
    sfx.complete()
    setEtape('bilan')
  }

  const verdict = verdictDuree(secondes, epreuve.cible)
  const barreau = avecMicro ? 3 : 2

  const sauver = async () => {
    const r = await enregistrerPassage(
      barreau,
      sujet,
      epreuveId,
      secondes,
      avecMicro ? criteres : null,
    )
    if (r.statut === 'ok') {
      setEnregistre(true)
      setMessage('Passage enregistré. Marcel a mis à jour ton échelle.')
      return
    }
    setMessage(
      r.statut === 'invalide'
        ? r.raison
        : r.statut === 'indisponible'
          ? 'L’atelier n’est pas encore ouvert côté serveur (migration 222).'
          : 'Impossible d’enregistrer pour l’instant.',
    )
  }

  /**
   * L'avis de Marcel. Il ne reçoit AUCUN audio — seulement l'épreuve, le sujet
   * annoncé, la durée tenue et les cases que l'élève vient de cocher. C'est le
   * seul appel au modèle de l'atelier, et il se décompte du quota du jour.
   */
  const demanderAvis = async () => {
    if (avisEnCours) return
    setAvisEnCours(true)
    setMessage(null)
    const r = await conseilsOral({
      epreuveId,
      sujet,
      secondes,
      criteres: avecMicro ? criteres : CRITERES_VIDES,
    })
    setAvisEnCours(false)
    if (r.ok && r.conseils) {
      setConseils(r.conseils)
      return
    }
    setMessage(
      r.plafond
        ? 'Tu as beaucoup travaillé aujourd’hui. On reprend demain.'
        : r.quota
          ? 'Tes questions du jour sont passées. L’atelier, lui, reste ouvert.'
          : r.unavailable
            ? 'L’avis de Marcel n’est pas disponible pour l’instant.'
            : 'Marcel n’a pas réussi à répondre. Réessaie.',
    )
  }

  if (!disponible) {
    return (
      <div className="bg-card rounded-[20px] p-6 text-center">
        <MicOff
          className="text-muted-foreground mx-auto size-7"
          aria-hidden="true"
        />
        <p className="font-heading mt-2 font-extrabold">
          L’atelier d’oral n’est pas encore ouvert.
        </p>
        <p className="text-muted-foreground mx-auto mt-1 max-w-sm text-sm">
          La migration <code>222_oral_echelle.sql</code> n’a pas été exécutée :
          tes passages n’auraient nulle part où être comptés.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* --- Réglage : de quoi on parle, et pour quelle épreuve --- */}
      <section className="bg-card rounded-[20px] p-4 shadow-[0_2px_0_rgba(36,48,79,.06)]">
        <label htmlFor="oral-sujet" className="text-[13px] font-extrabold">
          Sur quoi tu passes&nbsp;?
        </label>
        <input
          id="oral-sujet"
          value={sujet}
          onChange={(e) => setSujet(e.target.value)}
          placeholder="Ex. : Le loup et l’agneau — la force et le droit"
          disabled={etape === 'encours'}
          className="mt-1.5 h-11 w-full rounded-xl border bg-white px-3 text-sm"
        />

        <p className="mt-3 text-[13px] font-extrabold">Quelle épreuve&nbsp;?</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {EPREUVES.map((e) => (
            <button
              key={e.id}
              type="button"
              disabled={etape === 'encours'}
              onClick={() => {
                sfx.tap()
                setEpreuveId(e.id)
              }}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors',
                e.id === epreuveId
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground/70 hover:bg-muted/70',
              )}
            >
              {e.nom}
            </button>
          ))}
        </div>
        <p className="text-muted-foreground mt-1.5 text-xs">{epreuve.detail}</p>

        <label className="mt-3 flex items-start gap-2 text-[13px]">
          <input
            type="checkbox"
            checked={avecMicro}
            disabled={etape === 'encours'}
            onChange={(e) => setAvecMicro(e.target.checked)}
            className="mt-0.5 size-4"
          />
          <span>
            <span className="font-extrabold">
              M’enregistrer pour me réécouter
            </span>
            <span className="text-muted-foreground block text-xs">
              L’enregistrement reste sur cet appareil et n’est jamais envoyé. Il
              disparaît quand tu fermes la page.
            </span>
          </span>
        </label>
      </section>

      {/* --- Le chrono --- */}
      <section className="bg-card rounded-[20px] p-5 text-center shadow-[0_2px_0_rgba(36,48,79,.06)]">
        <p
          className="font-heading text-5xl font-extrabold tabular-nums"
          role="timer"
          aria-live="off"
        >
          {formatDuree(secondes)}
        </p>
        <p className="text-muted-foreground mt-1 text-xs font-bold">
          objectif&nbsp;: {formatDuree(epreuve.cible)}
        </p>

        {/* Barre de progression vers la cible. */}
        <div className="bg-muted mt-3 h-2 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-[width] duration-1000 ease-linear"
            style={{
              width: `${Math.min(100, (secondes / epreuve.cible) * 100)}%`,
            }}
          />
        </div>

        {erreurMicro ? (
          <p
            role="alert"
            className="text-destructive mt-3 text-xs font-semibold"
          >
            {erreurMicro}
          </p>
        ) : null}

        <div className="mt-4">
          {etape === 'encours' ? (
            <Button className="w-full rounded-full font-bold" onClick={arreter}>
              <Square className="size-4" aria-hidden="true" /> J’ai fini
            </Button>
          ) : (
            <Button
              className="w-full rounded-full font-bold"
              disabled={sujet.trim().length < 3}
              onClick={() => void demarrer()}
            >
              {avecMicro ? (
                <Mic className="size-4" aria-hidden="true" />
              ) : (
                <Play className="size-4" aria-hidden="true" />
              )}
              {secondes > 0 ? 'Refaire un passage' : 'Commencer'}
            </Button>
          )}
        </div>
        {sujet.trim().length < 3 && etape !== 'encours' ? (
          <p className="text-muted-foreground mt-2 text-xs">
            Écris d’abord ton sujet, en deux mots.
          </p>
        ) : null}
      </section>

      {/* --- Bilan : le verdict, l'écoute, l'auto-évaluation --- */}
      {etape === 'bilan' ? (
        <section className="bg-card rounded-[20px] p-4 shadow-[0_2px_0_rgba(36,48,79,.06)]">
          <p className="font-heading text-[15px] font-extrabold">
            {verdict.tenu ? 'Tu as tenu.' : 'Passage terminé.'}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">{verdict.phrase}</p>

          {audioUrl ? (
            <div className="mt-3">
              <p className="text-[13px] font-extrabold">Réécoute-toi</p>
              <audio
                controls
                src={audioUrl}
                className="mt-1.5 w-full"
                aria-label="Ton enregistrement, stocké uniquement sur cet appareil"
              />
              <p className="text-muted-foreground mt-1 text-[11px]">
                Ce fichier n’a pas quitté ton téléphone.
              </p>
            </div>
          ) : null}

          {avecMicro ? (
            <fieldset className="mt-4">
              <legend className="text-[13px] font-extrabold">
                Coche ce qui est vrai — c’est toi qui juges
              </legend>
              <div className="mt-2 flex flex-col gap-2">
                {CRITERES.map((c) => (
                  <label key={c.id} className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={criteres[c.id]}
                      onChange={(e) =>
                        setCriteres((prev) => ({
                          ...prev,
                          [c.id as CritereId]: e.target.checked,
                        }))
                      }
                      className="mt-0.5 size-4"
                    />
                    <span>
                      <span className="font-bold">{c.label}</span>
                      <span className="text-muted-foreground block text-xs">
                        {c.aide}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          {/* L'AVIS DE MARCEL. Il n'a rien entendu, et l'ecran le dit : il lit
              la duree tenue et les cases cochees. C'est le seul geste payant de
              l'atelier, et il est declenche a la main. */}
          <div className="mt-4">
            {conseils ? (
              <div className="bg-accent/50 rounded-[18px] p-3">
                <p className="text-accent-foreground/80 mb-1.5 flex items-center gap-1.5 text-[11px] font-extrabold tracking-wide uppercase">
                  <Sparkles aria-hidden="true" className="size-3.5" />
                  Pour ton prochain passage
                </p>
                <ul className="space-y-1.5">
                  {conseils.map((conseil) => (
                    <li
                      key={conseil}
                      className="text-accent-foreground text-[13px] leading-snug font-semibold"
                    >
                      · {conseil}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full rounded-full font-bold"
                disabled={avisEnCours}
                onClick={() => void demanderAvis()}
              >
                <Sparkles className="size-4" aria-hidden="true" />
                {avisEnCours ? 'Marcel regarde…' : 'Demander l’avis de Marcel'}
              </Button>
            )}
            <p className="text-muted-foreground mt-1.5 text-center text-[11px] font-semibold">
              Il ne t’entend pas : ton enregistrement reste sur ton téléphone.
              Il lit ta durée et tes cases.
            </p>
          </div>

          <Button
            className="mt-4 w-full rounded-full font-bold"
            variant={enregistre ? 'outline' : 'default'}
            disabled={enregistre}
            onClick={() => void sauver()}
          >
            {enregistre ? (
              <>
                <Check className="size-4" aria-hidden="true" /> Enregistré
              </>
            ) : (
              'Garder ce passage'
            )}
          </Button>
          {message ? (
            <p role="status" className="mt-2 text-center text-xs font-semibold">
              {message}
            </p>
          ) : null}
        </section>
      ) : null}

      {/* --- Barreau 4 : demander à un ami --- */}
      <BarreauQuatre amis={amis} sujet={sujet} epreuveId={epreuveId} />
    </div>
  )
}

// Le barreau 4 vit à part : c'est le seul qui sort de l'appareil, et le seul
// qui parle à quelqu'un. Il mérite son propre bloc, et son propre vocabulaire.
function BarreauQuatre({
  amis,
  sujet,
  epreuveId,
}: {
  amis: Ami[]
  sujet: string
  epreuveId: EpreuveId
}) {
  const [message, setMessage] = useState<string | null>(null)
  const [envoye, setEnvoye] = useState<string[]>([])
  const [occupe, setOccupe] = useState<string | null>(null)

  const envoyer = async (ami: Ami) => {
    setOccupe(ami.id)
    setMessage(null)
    const r = await demanderEcoute(ami.id, sujet, epreuveId)
    setOccupe(null)
    if (r.statut === 'envoyee') {
      setEnvoye((prev) => [...prev, ami.id])
      setMessage(`${ami.nom} va recevoir ta demande dans son onglet Amis.`)
      return
    }
    setMessage(
      r.statut === 'invalide'
        ? r.raison
        : r.statut === 'deja'
          ? `Tu as déjà une demande en attente chez ${ami.nom}.`
          : r.statut === 'trop'
            ? 'Tu as beaucoup demandé aujourd’hui. Reprends demain.'
            : r.statut === 'indisponible'
              ? 'L’atelier n’est pas encore ouvert côté serveur (migration 222).'
              : 'Envoi impossible pour l’instant.',
    )
  }

  return (
    <section className="bg-card rounded-[20px] p-4 shadow-[0_2px_0_rgba(36,48,79,.06)]">
      <h2 className="font-heading flex items-center gap-1.5 text-[15px] font-extrabold">
        <Users className="text-primary size-4" aria-hidden="true" />
        Le dernier barreau : quelqu’un t’écoute
      </h2>
      <p className="text-muted-foreground mt-1 text-sm">
        C’est le vrai test — et c’est ce que font les élèves qui réussissent
        leur oral. Ton ami cochera les mêmes trois cases que toi.
      </p>

      {amis.length === 0 ? (
        <p className="text-muted-foreground mt-3 text-sm">
          Tu n’as pas encore d’ami sur Studuel.{' '}
          <Link
            href="/amis/ajouter"
            className="text-primary underline underline-offset-2"
          >
            En ajouter un
          </Link>{' '}
          — c’est la seule chose qui manque à ton échelle.
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-1.5">
          {amis.map((ami) => {
            const fait = envoye.includes(ami.id)
            return (
              <li key={ami.id} className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                  {ami.nom}
                </span>
                <Button
                  size="sm"
                  variant={fait ? 'outline' : 'secondary'}
                  disabled={
                    fait || occupe === ami.id || sujet.trim().length < 3
                  }
                  onClick={() => void envoyer(ami)}
                >
                  {fait ? (
                    <>
                      <Check className="size-3.5" aria-hidden="true" /> Envoyée
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" aria-hidden="true" /> Demander
                    </>
                  )}
                </Button>
              </li>
            )
          })}
        </ul>
      )}

      {message ? (
        <p role="status" className="mt-2 text-xs font-semibold">
          {message}
        </p>
      ) : null}
    </section>
  )
}
