// Partage « façon story » — utilitaire client commun aux célébrations
// (PalierCelebration) et à la rétro hebdo (ShareWeekButton) : une image
// 1080×1920 générée sur canvas (fond violet de marque, gros emoji, titre),
// partagée via navigator.share({ files }), avec replis successifs : partage
// texte, puis copie dans le presse-papiers. Pas de JSX ici — que du DOM.

export type StoryContent = {
  /** Bandeau du haut, en capitales (« NOUVELLE ARÈNE ! », « MA SEMAINE »). */
  title: string
  /** Gros emoji central (repli si `imageUrl` absente ou illisible). */
  emoji: string
  /** Visuel central optionnel (ex. le compagnon de l'élève) — même origine. */
  imageUrl?: string
  /** Ligne principale (nom du palier, chiffres de la semaine). */
  headline: string
  /** Ligne secondaire optionnelle, sous la principale. */
  sub?: string
}

export type ShareOutcome = 'shared' | 'copied' | 'failed' | 'aborted'

// Image story : violet de marque (token --primary résolu au runtime),
// confettis figés déterministes, signature Studuel.
async function buildStoryFile(content: StoryContent): Promise<File | null> {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1920
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const styles = getComputedStyle(document.documentElement)
    const primary = styles.getPropertyValue('--primary').trim() || 'rebeccapurple'
    const highlight = styles.getPropertyValue('--highlight').trim() || 'gold'

    const bg = ctx.createLinearGradient(0, 0, 0, 1920)
    bg.addColorStop(0, primary)
    bg.addColorStop(1, `color-mix(in oklch, ${primary}, black 55%)`)
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, 1080, 1920)

    // Confettis figés, dérivés de l'index (déterministe).
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = i % 3 === 0 ? highlight : 'rgba(255,255,255,0.35)'
      const x = (i * 173 + 91) % 1080
      const y = (i * 389 + 127) % 1920
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(((i * 47) % 360) * (Math.PI / 180))
      ctx.fillRect(-7, -12, 14, 24)
      ctx.restore()
    }

    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.font = 'bold 56px system-ui, sans-serif'
    ctx.fillText(content.title.toUpperCase(), 540, 560)

    // Visuel central : l'image (compagnon…) si elle charge, sinon l'emoji.
    let drewImage = false
    if (content.imageUrl) {
      const img = await new Promise<HTMLImageElement | null>((resolve) => {
        const el = new window.Image()
        el.onload = () => resolve(el)
        el.onerror = () => resolve(null)
        el.src = content.imageUrl as string
      })
      if (img) {
        ctx.drawImage(img, 540 - 240, 640, 480, 480)
        drewImage = true
      }
    }
    if (!drewImage) {
      ctx.font = '300px serif'
      ctx.fillText(content.emoji, 540, 1010)
    }

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 88px system-ui, sans-serif'
    ctx.fillText(content.headline, 540, 1230)

    if (content.sub) {
      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      ctx.font = 'bold 54px system-ui, sans-serif'
      ctx.fillText(content.sub, 540, 1330)
    }

    ctx.fillStyle = highlight
    ctx.font = 'bold 48px system-ui, sans-serif'
    ctx.fillText('⭐ Rejoins-moi sur Studuel ⭐', 540, 1650)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png'),
    )
    if (!blob) return null
    return new File([blob], 'studuel-story.png', { type: 'image/png' })
  } catch {
    // Canvas indisponible (vieux navigateur…) : le partage texte prend le relais.
    return null
  }
}

/**
 * Partage la story : image si l'appareil sait partager des fichiers, sinon
 * texte (+ URL de l'app), sinon copie du texte. `aborted` = l'utilisateur a
 * refermé la feuille de partage (pas une erreur).
 */
export async function shareStory(
  content: StoryContent,
  shareText: string,
): Promise<ShareOutcome> {
  const url = window.location.origin
  const text = `${shareText} ${url}`
  try {
    const file = await buildStoryFile(content)
    if (file && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text: shareText })
      return 'shared'
    }
    if (navigator.share) {
      await navigator.share({ text })
      return 'shared'
    }
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') return 'aborted'
    try {
      await navigator.clipboard.writeText(text)
      return 'copied'
    } catch {
      return 'failed'
    }
  }
}
