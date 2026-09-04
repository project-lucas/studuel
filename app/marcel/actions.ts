'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { REGIMES, regimeOf } from '@/lib/coach/regimes'
import { MODES, consigneFor, parseMode } from '@/lib/coach/outils'
import { lireCartes, phraseCartes, type CarteIa } from '@/lib/coach/cartes-ia'
import { refusPiece, type PieceJointe } from '@/lib/coach/piece-jointe'
import { configVision } from '@/lib/coach/ia-vision'
import { contexteFor, dernierEchange } from '@/lib/coach/conversations'
import {
  chargerMessages,
  enregistrerEchange,
} from '@/lib/coach/conversations-server'
import { rangerEchange } from '@/lib/coach/carnet-pont'
import { veutCarnet } from '@/lib/coach/vers-carnet'
import { isMissingSchemaObject } from '@/lib/schema-fallback'

// Demander quelque chose à Marcel.
//
// C'est le SEUL endroit de l'onglet qui coûte de l'argent, et il arrive en
// dernier — Marcel est d'abord un repère de méthode. Trois garde-fous, dans cet
// ordre :
//
//   1. la PORTE est en SQL (`coach_ask_allowed`, migration 215) : quota du jour,
//      puis jeton, jamais au-delà du plafond absolu. Le compteur monte avant la
//      réponse du modèle, y compris sur un refus ;
//   2. la RÉPONSE est courte (`max_tokens` serré) et le fil ne repart PAS en
//      entier : on rappelle deux tours tronqués (lib/coach/conversations), pas
//      trente — un fil de 30 messages se repaierait 30 fois ;
//   3. le TEXTE de l'élève est isolé entre balises, et ne part jamais dans les
//      logs (l'objet d'erreur du SDK porte le corps de la requête).
//
// Fournisseur configurable et compatible OpenAI, comme le carnet
// (AI_BASE_URL / AI_MODEL / AI_API_KEY, repli OPENAI_API_KEY).

const AI_DEFAULT_MODEL = 'gpt-4o-mini'
const MAX_QUESTION_LEN = 400

export type DemandeResult = {
  ok: boolean
  reponse?: string
  /** Le fil où l'échange a été gardé — `null` si la 349 n'est pas passée. */
  conversationId?: string | null
  /** Son titre, pour l'afficher sans recharger l'historique. */
  titre?: string
  /** L'échange est parti dans le carnet : de quoi proposer d'y aller. */
  carnet?: { courseId: string; cours: string } | null
  /** Rendu SANS appeler le modèle : rien n'a été décompté du quota. */
  gratuit?: boolean
  /** Mode « flashcards » : les cartes proposées, à relire avant de les ranger. */
  cartes?: CarteIa[]
  /** Un refus qui se dit à l'élève tel quel (pièce jointe illisible, trop lourde). */
  erreur?: string
  /** Quota et jetons épuisés — ce n'est pas une panne. */
  quota?: boolean
  /** Plafond quotidien de coût atteint : rien ne le lève. */
  plafond?: boolean
  /** Aucune clé configurée, ou migration 215 pas encore exécutée. */
  unavailable?: boolean
}

function aiKey(): string | null {
  return process.env.AI_API_KEY ?? process.env.OPENAI_API_KEY ?? null
}

/**
 * Le client du fournisseur. `vision` bascule sur le modèle capable de LIRE une
 * image (cf. lib/coach/ia-vision) : le modèle de texte principal, lui, refuse
 * la photo avec une 400 — et ce refus arriverait après avoir dépensé le quota.
 */
async function aiClient(config?: { apiKey: string; baseURL?: string }) {
  const apiKey = config?.apiKey ?? aiKey()
  if (!apiKey) return null
  const base = config ? config.baseURL : process.env.AI_BASE_URL
  const { default: OpenAI } = await import('openai')
  return new OpenAI({
    apiKey,
    ...(base ? { baseURL: base } : {}),
    // Les défauts du SDK (10 min, 2 réessais) laisseraient l'élève sur un
    // « Marcel réfléchit… » pendant une demi-heure.
    timeout: 20_000,
    maxRetries: 1,
  })
}

/**
 * La phrase de MÉTHODE de la matière, écrite d'avance dans lib/coach/regimes.
 *
 * C'est ce qui fait que Marcel ne répond pas en histoire comme en maths, et ça
 * ne coûte rien : la phrase existe déjà, on ne la demande pas au modèle. Le
 * reste de la consigne (la voix de Marcel, la règle « jamais la réponse toute
 * faite », la forme attendue) est décidé par le MODE — cf. lib/coach/outils.
 */
function methodeDe(matiereSlug: string | null): string | null {
  const regime = matiereSlug ? regimeOf(matiereSlug) : null
  return regime ? REGIMES[regime].consigne : null
}

/**
 * Ce qui est GARDÉ dans le fil à la place de la question.
 *
 * La pièce jointe, elle, n'est pas gardée : une photo de cahier dans chaque
 * message ferait grossir la base sans que personne ne la relise. Mais un fil
 * qui montrerait une réponse sur une photo disparue serait incompréhensible —
 * d'où la mention, et le nom du mode quand ce n'était pas une simple question.
 */
function etiquette(
  question: string,
  piece: PieceJointe | null,
  modeLabel: string,
): string {
  const marques: string[] = []
  if (piece?.type === 'image') marques.push('photo jointe')
  if (piece?.type === 'texte') marques.push(`fichier joint : ${piece.nom}`)
  if (modeLabel) marques.push(modeLabel.toLowerCase())

  const suffixe = marques.length > 0 ? ` [${marques.join(' · ')}]` : ''
  const base = question.length > 0 ? question : 'Regarde ça'
  return `${base}${suffixe}`
}

/**
 * Pose une question à Marcel. `matiereSlug` sert uniquement à choisir la
 * méthode : aucune donnée de l'élève n'est envoyée au modèle.
 *
 * `conversationId` rattache la question à un fil existant. Deux choses en
 * découlent, et une seule coûte :
 *   • le fil est GARDÉ (migration 349), donc retrouvable le lendemain ;
 *   • ses deux derniers tours sont rappelés au modèle, tronqués — juste de quoi
 *     que « explique autrement » ait un « quoi ».
 *
 * Un ordre « envoie ça dans mon carnet » est traité ICI, avant la porte : il ne
 * passe par aucun modèle, donc il ne se paie pas.
 */
export async function demanderAMarcel(
  question: string,
  matiereSlug: string | null,
  conversationId: string | null = null,
  options: { mode?: string; piece?: PieceJointe | null } = {},
): Promise<DemandeResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false }

  // Le MODE décide de la consigne, du budget de sortie et de la forme du
  // résultat. Il vient du client : il est donc normalisé, jamais cru.
  const mode = MODES[parseMode(options.mode)]

  const propre =
    typeof question === 'string' ? question.trim().slice(0, MAX_QUESTION_LEN) : ''
  const piece = options.piece ?? null
  // Une pièce jointe seule est une demande valable : la photo d'un exercice se
  // passe très bien de légende.
  if (propre.length === 0 && !piece) return { ok: false }

  const vision = piece?.type === 'image' ? configVision() : null

  if (piece) {
    const refus = refusPiece(piece)
    // Refus AVANT la porte : une photo illisible ne doit pas coûter une des
    // trois questions du jour.
    if (refus) return { ok: false, erreur: refus.erreur }
    if (piece.type === 'image' && !vision) {
      // Aucun modèle capable de lire une image n'est branché. On le dit, et on
      // ne dépense rien : le fournisseur refuserait de toute façon.
      return {
        ok: false,
        erreur:
          'Je ne sais pas encore lire les photos. Recopie l’essentiel, ou joins un fichier texte.',
      }
    }
  }

  const supabase = await createClient()
  const fil = typeof conversationId === 'string' ? conversationId : null
  const messages = fil ? await chargerMessages(supabase, fil) : []

  // ---------------------------------------------------- « dans mon carnet »
  // L'élève ne demande pas une explication : il demande de RANGER celle d'avant.
  // Aucun appel au modèle, donc rien à décompter — la porte ne s'ouvre que pour
  // ce qui se paie. C'est aussi ce qui rend l'ordre gratuit et illimité : une
  // bonne explication doit pouvoir partir en révision sans y réfléchir.
  if (veutCarnet(propre)) {
    const echange = dernierEchange(messages)
    const range = echange ? await rangerEchange(supabase, user.id, echange) : null

    // Marcel répond TOUJOURS quelque chose, y compris quand il n'a rien pu
    // faire : un ordre qui ne reçoit pas de réponse se lit comme une panne.
    const reponse = range
      ? `C’est rangé dans ton carnet, dans « ${range.cours} ». Tu le reverras en révision.`
      : echange
        ? 'Je n’ai pas réussi à écrire dans ton carnet. Réessaie dans un instant.'
        : 'Je n’ai encore rien à ranger : pose-moi d’abord une question.'

    const garde = await enregistrerEchange(supabase, user.id, {
      conversationId: fil,
      question: propre,
      reponse,
      matiereSlug,
    })

    return {
      ok: true,
      reponse,
      conversationId: garde?.conversationId ?? fil,
      titre: garde?.titre,
      carnet: range,
      gratuit: true,
    }
  }

  // La porte, côté serveur. Absente (migration 215 pas exécutée) → on REFUSE :
  // c'est une fonctionnalité neuve, personne ne perd rien, et le trou ne peut
  // jamais s'ouvrir. C'est la différence assumée avec la 198.
  const { data: verdict, error } = await supabase.rpc('coach_ask_allowed', {
    p_kind: 'question',
  })
  if (error) {
    if (error.code !== 'PGRST202') {
      console.error('[marcel] porte illisible:', error.message)
    }
    return { ok: false, unavailable: true }
  }
  if (verdict === 'plafond') return { ok: false, plafond: true }
  if (verdict !== 'quota' && verdict !== 'jeton') return { ok: false, quota: true }

  const client = await aiClient(vision ?? undefined)
  if (!client) return { ok: false, unavailable: true }

  // Ce que l'élève envoie : son texte, et sa pièce jointe s'il en a une. Une
  // photo devient une part d'image (le modèle la LIT) ; un fichier texte est
  // recollé sous la question, entre balises, comme le reste.
  const contenu: (
    | { type: 'text'; text: string }
    | { type: 'image_url'; image_url: { url: string } }
  )[] = [
    {
      type: 'text',
      text:
        piece?.type === 'texte'
          ? `<question>\n${propre || 'Regarde ce document.'}\n</question>\n<document>\n${piece.data}\n</document>`
          : `<question>\n${propre || 'Regarde cette photo.'}\n</question>`,
    },
  ]
  if (piece?.type === 'image') {
    contenu.push({ type: 'image_url', image_url: { url: piece.data } })
  }

  try {
    const completion = await client.chat.completions.create({
      model: vision?.model ?? process.env.AI_MODEL ?? AI_DEFAULT_MODEL,
      max_tokens: mode.maxTokens,
      messages: [
        { role: 'system', content: consigneFor(mode.cle, methodeDe(matiereSlug)) },
        // Le rappel du fil : deux tours, tronqués. Les tours de l’élève y sont
        // balisés comme la question courante — un « ignore les instructions
        // précédentes » écrit trois messages plus tôt ne doit pas revenir nu.
        ...contexteFor(messages).map((m) =>
          m.role === 'eleve'
            ? {
                role: 'user' as const,
                content: `<question>\n${m.texte}\n</question>`,
              }
            : { role: 'assistant' as const, content: m.texte },
        ),
        // Le texte de l'élève est ISOLÉ : concaténé nu, un « ignore les
        // instructions précédentes » passerait sans effort.
        { role: 'user', content: contenu },
      ],
    })
    const brut = completion.choices[0]?.message?.content?.trim()
    if (!brut) return { ok: false }

    // Le mode « flashcards » ne rend pas du texte mais un tableau JSON. On le
    // lit ici (lib/coach/cartes-ia, testé) : le fil garde une PHRASE, et les
    // cartes partent à part vers l'écran de relecture. Un tableau JSON collé
    // dans l'historique n'aurait aucun sens à relire trois jours plus tard.
    const cartes = mode.cartes ? lireCartes(brut) : null
    const reponse = cartes ? phraseCartes(cartes.length) : brut

    // Le fil est gardé APRÈS la réponse : si l’écriture échoue (migration 349
    // pas encore exécutée), l’élève garde quand même son explication à l’écran.
    const garde = await enregistrerEchange(supabase, user.id, {
      conversationId: fil,
      // Ce qui est gardé dit ce qui s'est passé : sans cette mention, un fil
      // relu demain montrerait une réponse sur une photo qu'on ne voit plus.
      question: etiquette(propre, piece, mode.cle === 'question' ? '' : mode.label),
      reponse,
      matiereSlug,
    })

    return {
      ok: true,
      reponse,
      conversationId: garde?.conversationId ?? fil,
      titre: garde?.titre,
      ...(cartes ? { cartes } : {}),
    }
  } catch (err) {
    // Le message SEUL : l'objet d'erreur du SDK porte le corps de la requête,
    // donc la question de l'élève, qui n'a rien à faire dans les logs.
    console.error(
      '[marcel] appel du modèle impossible:',
      err instanceof Error ? err.message : 'inconnu',
    )
    return { ok: false }
  }
}

export type AchatResult = { ok: boolean; noGems?: boolean; unavailable?: boolean }

/** Convertit des gemmes en jetons de Prof (montants décidés en SQL). */
export async function acheterJetons(packs: number): Promise<AchatResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_buy_tokens', {
    p_packs: Number.isFinite(packs) ? Math.floor(packs) : 1,
  })

  if (error) {
    if (error.code !== 'PGRST202') {
      console.error('[marcel] achat de jetons impossible:', error.message)
    }
    return { ok: false, unavailable: true }
  }
  if (data === 'no_gems') return { ok: false, noGems: true }
  return { ok: data === 'ok' }
}

// -----------------------------------------------------------------------------
// « Vu en cours » — la seule chose que l'élève DÉCLARE, et que l'app ne peut pas
// deviner.
//
// Elle déclare le PÉRIMÈTRE (ce que le prof a traité), jamais son NIVEAU : la
// maîtrise reste mesurée par les quiz et les leçons. C'est ce qui empêche
// l'écran Progrès de devenir un formulaire d'auto-flatterie.
//
// Aucune validation d'existence du chapitre ici : la clé étrangère de la
// migration 224 refuse en base un identifiant inventé, et la RLS interdit
// d'écrire pour quelqu'un d'autre. Revalider en TypeScript ce que Postgres
// garantit coûterait une requête par clic pour la même réponse.
// -----------------------------------------------------------------------------

export type ChapitreVuResult = {
  ok: boolean
  /** Migration 224 pas encore exécutée — ce n'est pas une faute de l'élève. */
  unavailable?: boolean
}

export async function marquerChapitreVu(
  chapterId: string,
  vu: boolean,
): Promise<ChapitreVuResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false }

  const supabase = await createClient()

  const { error } = vu
    ? await supabase
        .from('chapitres_vus')
        // Recocher un chapitre déjà coché ne doit pas échouer sur la clé
        // primaire : deux onglets ouverts suffisent à produire ce doublon.
        .upsert(
          { user_id: user.id, chapter_id: chapterId },
          { onConflict: 'user_id,chapter_id', ignoreDuplicates: true },
        )
    : await supabase
        .from('chapitres_vus')
        .delete()
        .eq('user_id', user.id)
        .eq('chapter_id', chapterId)

  if (error) {
    if (isMissingSchemaObject(error)) return { ok: false, unavailable: true }
    console.error('[marcel] chapitre vu en cours:', error.message)
    return { ok: false }
  }

  // L'onglet Réviser lit la MÊME donnée pour ses couronnes : sans cette
  // invalidation, cocher un chapitre changerait le tableau de Marcel et
  // laisserait les cartes matières sur l'ancien compte.
  revalidatePath('/marcel')
  revalidatePath('/reviser')
  return { ok: true }
}
