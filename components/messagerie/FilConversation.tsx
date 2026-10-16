'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Paperclip, Send, ShieldCheck, Sparkles, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  avertissementFil,
  fusionnerMessages,
  jourParis,
  LIBELLE_CONSENTEMENT,
  messageDepuis,
  messageErreurBase,
  rangerMessages,
  sousTitreFil,
  titreFil,
  verifierCorps,
  verifierPiece,
  type Fil,
  type Message,
} from '@/lib/messagerie/fil'
import { cn } from '@/lib/utils'
import BulleMessage from './BulleMessage'

export type ModeMessagerie = 'coach' | 'utilisateur' | 'supervision'

/**
 * UN FIL DE CONVERSATION, en direct : les messages arrivent par Supabase
 * Realtime (la diffusion respecte la policy de lecture de la 587), partent par
 * la RPC `message_envoyer` depuis le navigateur (pas de Server Action : elles
 * passent une par une), et la notification push suit par la route
 * `/api/messagerie`. Envoi optimiste : la bulle apparaît tout de suite.
 */
export default function FilConversation({
  fil,
  moi,
  mode,
  onRetour,
  onActivite,
  resumer,
}: {
  fil: Fil
  moi: string
  mode: ModeMessagerie
  onRetour?: () => void
  /** Prévient la liste qu'un message est parti ou arrivé (relire les fils). */
  onActivite?: () => void
  /** Coach seulement : le résumé du fil par l'assistant IA. */
  resumer?: (conversationId: string) => Promise<{ ok: true; texte: string } | { ok: false; erreur: string }>
}) {
  const supabase = useMemo(() => createClient(), [])
  const [messages, setMessages] = useState<Message[]>([])
  const [chargement, setChargement] = useState(true)
  const [plusAncien, setPlusAncien] = useState(true)
  const [texte, setTexte] = useState('')
  const [piece, setPiece] = useState<File | null>(null)
  const [erreur, setErreur] = useState<string | null>(null)
  const [signale, setSignale] = useState<Message | null>(null)
  const [raison, setRaison] = useState('')
  const [resume, setResume] = useState<{ etat: 'attente' } | { etat: 'ok'; texte: string } | { etat: 'erreur'; texte: string } | null>(null)
  const zone = useRef<HTMLDivElement>(null)
  const fichier = useRef<HTMLInputElement>(null)
  const aujourdhui = jourParis(new Date().toISOString())
  const peutEcrire = mode !== 'supervision' && fil.peutEcrire

  const auteur = useCallback(
    (id: string | null): { prenom: string; role: Message['auteurRole'] } => {
      if (id === fil.coachId) return { prenom: fil.coachPrenom, role: 'coach' }
      if (id === fil.eleveId) return { prenom: fil.elevePrenom, role: 'eleve' }
      return { prenom: fil.parentPrenom ?? 'Parent', role: 'parent' }
    },
    [fil],
  )

  const enBas = useCallback(() => {
    requestAnimationFrame(() => {
      if (zone.current) zone.current.scrollTop = zone.current.scrollHeight
    })
  }, [])

  const marquerLu = useCallback(() => {
    if (mode === 'supervision' || document.visibilityState !== 'visible') return
    void supabase.rpc('messagerie_lu', { p_conv: fil.id })
  }, [supabase, fil.id, mode])

  // Le chargement du fil, puis le direct.
  useEffect(() => {
    // Le composant est remonté à chaque fil (clé) : l'état part de zéro.
    let vivant = true
    supabase
      .rpc('messagerie_messages', { p_conv: fil.id, p_avant: null, p_limite: 60 })
      .then(({ data }) => {
        if (!vivant) return
        const lus = (Array.isArray(data) ? data : []).map((r) => messageDepuis(r as Record<string, unknown>))
        setMessages(lus)
        setPlusAncien(lus.length >= 60)
        setChargement(false)
        enBas()
        marquerLu()
      })

    const canal = supabase
      .channel(`fil-${fil.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages_fil', filter: `conversation_id=eq.${fil.id}` },
        (payload) => {
          const r = payload.new as Record<string, unknown>
          const a = auteur(typeof r.auteur_id === 'string' ? r.auteur_id : null)
          const m = messageDepuis({ ...r, auteur_prenom: a.prenom, auteur_role: a.role })
          setMessages((actuels) => fusionnerMessages(actuels.filter((x) => !(x.enEnvoi && x.auteurId === m.auteurId && x.corps === m.corps)), [m]))
          enBas()
          if (m.auteurId !== moi) {
            marquerLu()
            onActivite?.()
          }
        },
      )
      .subscribe()
    return () => {
      vivant = false
      void supabase.removeChannel(canal)
    }
  }, [supabase, fil.id, auteur, enBas, marquerLu, moi, onActivite])

  const chargerPlus = async () => {
    const plusVieux = messages[messages.length - 1]
    if (!plusVieux) return
    const { data } = await supabase.rpc('messagerie_messages', { p_conv: fil.id, p_avant: plusVieux.creeLe, p_limite: 60 })
    const lus = (Array.isArray(data) ? data : []).map((r) => messageDepuis(r as Record<string, unknown>))
    setMessages((a) => fusionnerMessages(a, lus))
    setPlusAncien(lus.length >= 60)
  }

  const envoyer = async () => {
    setErreur(null)
    const v = verifierCorps(texte, piece !== null)
    if (!v.ok) return setErreur(v.erreur)
    let pieceInfo: { chemin: string; nom: string; type: 'image' | 'pdf' } | null = null
    if (piece) {
      const p = verifierPiece(piece)
      if (!p.ok) return setErreur(p.erreur)
      pieceInfo = { chemin: `${fil.id}/${crypto.randomUUID()}.${p.extension}`, nom: piece.name.slice(0, 120), type: p.type }
    }
    const provisoire: Message = {
      id: `envoi-${crypto.randomUUID()}`,
      auteurId: moi,
      auteurPrenom: auteur(moi).prenom,
      auteurRole: auteur(moi).role,
      corps: v.corps,
      pieceChemin: pieceInfo?.chemin ?? null,
      pieceNom: pieceInfo?.nom ?? null,
      pieceType: pieceInfo?.type ?? null,
      creeLe: new Date().toISOString(),
      enEnvoi: true,
    }
    setMessages((a) => fusionnerMessages(a, [provisoire]))
    setTexte('')
    const fichierEnvoye = piece
    setPiece(null)
    enBas()

    if (pieceInfo && fichierEnvoye) {
      const { error } = await supabase.storage.from('messagerie').upload(pieceInfo.chemin, fichierEnvoye, { contentType: fichierEnvoye.type, upsert: false })
      if (error) {
        setMessages((a) => a.map((x) => (x.id === provisoire.id ? { ...x, enEnvoi: false, echec: true } : x)))
        return setErreur('La pièce jointe n’a pas pu être envoyée.')
      }
    }
    const { data, error } = await supabase.rpc('message_envoyer', {
      p_conv: fil.id,
      p_corps: v.corps,
      p_piece_chemin: pieceInfo?.chemin ?? null,
      p_piece_nom: pieceInfo?.nom ?? null,
      p_piece_type: pieceInfo?.type ?? null,
    })
    if (error || !data) {
      setMessages((a) => a.map((x) => (x.id === provisoire.id ? { ...x, enEnvoi: false, echec: true } : x)))
      return setErreur(messageErreurBase(error?.message))
    }
    const { id, cree_le } = data as { id: string; cree_le: string }
    // Le direct a pu livrer le message avant la réponse : on remplace le provisoire.
    setMessages((a) => fusionnerMessages(a.filter((x) => x.id !== provisoire.id), [{ ...provisoire, id, creeLe: cree_le, enEnvoi: false }]))
    void fetch('/api/messagerie', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messageId: id }) }).catch(() => {})
    onActivite?.()
  }

  const confirmerSignalement = async () => {
    if (!signale) return
    const { error } = await supabase.rpc('message_signaler', { p_message: signale.id, p_raison: raison })
    setSignale(null)
    setRaison('')
    setErreur(error ? 'Le signalement n’est pas parti.' : null)
  }

  const lancerResume = async () => {
    if (!resumer) return
    setResume({ etat: 'attente' })
    const r = await resumer(fil.id)
    setResume(r.ok ? { etat: 'ok', texte: r.texte } : { etat: 'erreur', texte: r.erreur })
  }

  const blocs = rangerMessages(messages, aujourdhui)
  const avecNoms = fil.type === 'trio' || mode === 'supervision'

  return (
    <section className="flex h-full min-h-0 flex-col" aria-label={`Conversation : ${titreFil(fil)}`}>
      {/* L'en-tête du fil. */}
      <header className="flex items-center gap-3 border-b border-primary/10 bg-card px-4 py-3">
        {onRetour ? (
          <button type="button" onClick={onRetour} className="grid size-10 place-items-center rounded-full hover:bg-secondary md:hidden" aria-label="Retour aux conversations">
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
        ) : null}
        <Avatar nom={titreFil(fil)} />
        <div className="min-w-0 flex-1">
          <h2 className="font-heading truncate text-base font-extrabold">{titreFil(fil)}</h2>
          <p className="truncate text-xs font-semibold text-muted-foreground">
            {sousTitreFil(fil)}
            {fil.consentement && mode !== 'utilisateur' ? ` · ${LIBELLE_CONSENTEMENT[fil.consentement]}` : ''}
          </p>
        </div>
        {mode !== 'utilisateur' ? (
          <Link href={`/coach/eleves/${fil.eleveId}`} className="hidden h-9 items-center rounded-full px-3 text-sm font-bold text-primary hover:bg-secondary sm:inline-flex">
            Fiche élève
          </Link>
        ) : null}
        {resumer ? (
          <button
            type="button"
            onClick={lancerResume}
            disabled={resume?.etat === 'attente' || messages.length < 3}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-secondary px-3 text-sm font-bold text-primary disabled:opacity-50"
            title="Résumer le fil avec l’assistant (Claude)"
          >
            {resume?.etat === 'attente' ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
            <span className="hidden sm:inline">Résumer</span>
          </button>
        ) : null}
      </header>

      {resume && resume.etat !== 'attente' ? (
        <div className={cn('mx-4 mt-3 rounded-2xl p-3 text-sm', resume.etat === 'ok' ? 'bg-secondary' : 'bg-(--destructive)/10 text-(--destructive)')}>
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <p className="flex-1 whitespace-pre-wrap">{resume.texte}</p>
            <button type="button" onClick={() => setResume(null)} aria-label="Fermer le résumé" className="text-muted-foreground">
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Les messages. */}
      <div ref={zone} className="min-h-0 flex-1 overflow-y-auto bg-secondary/30 px-3 py-4 md:px-6">
        <p className="mx-auto mb-4 flex max-w-md items-start gap-2 rounded-2xl bg-card/80 px-3 py-2 text-center text-xs font-semibold text-muted-foreground ring-1 ring-black/5">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="flex-1">{avertissementFil(fil)}</span>
        </p>
        {plusAncien && !chargement ? (
          <div className="mb-3 text-center">
            <button type="button" onClick={chargerPlus} className="rounded-full bg-card px-3 py-1 text-xs font-bold text-primary ring-1 ring-primary/15">
              Messages plus anciens
            </button>
          </div>
        ) : null}
        {chargement ? (
          <div className="grid place-items-center py-10">
            <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
          </div>
        ) : messages.length === 0 ? (
          <p className="py-10 text-center text-sm font-semibold text-muted-foreground">
            {peutEcrire ? 'Aucun message pour l’instant. Écris le premier.' : 'Aucun message.'}
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {blocs.map((b) =>
              b.type === 'jour' ? (
                <p key={b.cle} className="my-2 self-center rounded-full bg-card px-3 py-1 text-xs font-bold text-muted-foreground ring-1 ring-black/5 first-letter:uppercase">
                  {b.libelle}
                </p>
              ) : (
                <div key={b.cle} className="flex flex-col gap-1">
                  {avecNoms && b.auteurId !== moi ? (
                    <p className="ml-1 text-xs font-extrabold text-primary">{b.auteurPrenom}</p>
                  ) : null}
                  {b.messages?.map((m, i) => (
                    <BulleMessage
                      key={m.id}
                      m={m}
                      mien={m.auteurId === moi}
                      premier={i === (b.messages?.length ?? 0) - 1}
                      peutSignaler={mode !== 'supervision'}
                      onSignaler={setSignale}
                    />
                  ))}
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Le signalement. */}
      {signale ? (
        <div className="border-t bg-card px-4 py-3">
          <p className="text-sm font-extrabold">Signaler ce message</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">« {signale.corps || 'Pièce jointe'} »</p>
          <textarea
            value={raison}
            onChange={(e) => setRaison(e.target.value)}
            maxLength={500}
            rows={2}
            placeholder="Pourquoi ? (facultatif)"
            className="mt-2 w-full rounded-xl border bg-background px-3 py-2 text-sm"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setSignale(null)} className="h-9 rounded-full px-4 text-sm font-bold">
              Annuler
            </button>
            <button type="button" onClick={confirmerSignalement} className="h-9 rounded-full bg-(--destructive) px-4 text-sm font-bold text-white">
              Signaler
            </button>
          </div>
        </div>
      ) : null}

      {/* La saisie. */}
      {peutEcrire ? (
        <form
          className="border-t border-primary/10 bg-card px-3 py-3 md:px-4"
          onSubmit={(e) => {
            e.preventDefault()
            void envoyer()
          }}
        >
          {erreur ? <p className="mb-2 text-xs font-bold text-(--destructive)" role="alert">{erreur}</p> : null}
          {piece ? (
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-bold">
              <Paperclip className="size-3.5" aria-hidden="true" />
              <span className="max-w-56 truncate">{piece.name}</span>
              <button type="button" onClick={() => setPiece(null)} aria-label="Retirer la pièce jointe">
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : null}
          <div className="flex items-end gap-2">
            <input
              ref={fichier}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null
                e.target.value = ''
                if (!f) return
                const p = verifierPiece(f)
                if (!p.ok) return setErreur(p.erreur)
                setErreur(null)
                setPiece(f)
              }}
            />
            <button type="button" onClick={() => fichier.current?.click()} className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary" aria-label="Joindre une photo ou un PDF">
              <Paperclip className="size-5" aria-hidden="true" />
            </button>
            <textarea
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              onKeyDown={(e) => {
                // Entrée envoie (comme WhatsApp sur ordinateur), Maj + Entrée va à la ligne.
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  void envoyer()
                }
              }}
              rows={1}
              maxLength={4000}
              placeholder="Écris un message…"
              aria-label="Message"
              className="max-h-40 min-h-11 flex-1 resize-none rounded-2xl border bg-background px-4 py-2.5 text-[15px] outline-none field-sizing-content focus:border-primary"
            />
            <button
              type="submit"
              disabled={texte.trim().length === 0 && !piece}
              className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
              aria-label="Envoyer"
            >
              <Send className="size-5" aria-hidden="true" />
            </button>
          </div>
        </form>
      ) : (
        <p className="border-t bg-card px-4 py-3 text-center text-sm font-semibold text-muted-foreground">
          {mode === 'supervision' ? 'Lecture en supervision : tu ne fais pas partie de ce fil.' : 'Conversation en lecture seule.'}
        </p>
      )}
    </section>
  )
}

export function Avatar({ nom, petit = false }: { nom: string; petit?: boolean }) {
  const initiale = nom.trim().charAt(0).toUpperCase() || '?'
  return (
    <span
      aria-hidden="true"
      className={cn(
        'font-heading grid shrink-0 place-items-center rounded-full bg-secondary font-extrabold text-primary',
        petit ? 'size-9 text-sm' : 'size-11 text-base',
      )}
    >
      {initiale}
    </span>
  )
}
