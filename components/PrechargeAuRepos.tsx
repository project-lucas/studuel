'use client'

import { useEffect } from 'react'
import { getImageProps } from 'next/image'
import { useRouter } from 'next/navigation'
import { prechargerOnglet } from '@/components/PrechargeurOnglets'
import {
  DELAI_REPOS_MS,
  ESPACEMENT_REPOS_MS,
  peutPrechargerAuRepos,
  type Connexion,
} from '@/lib/precharge-repos'

/** Le séparateur de la clé de l'effet : ni une adresse ni des `sizes` n'en contiennent. */
const SEPARATEUR = '\n'

/** Une image à préparer : son adresse et les `sizes` de son <Image>. */
export type ImageAuRepos = { src: string; sizes: string }

/** `requestIdleCallback` n'existe pas partout (Safari) : repli sur un délai. */
function quandOisif(fn: () => void): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(fn, { timeout: 2000 })
    return () => window.cancelIdleCallback(id)
  }
  const id = window.setTimeout(fn, 200)
  return () => window.clearTimeout(id)
}

/**
 * LE PRÉCHARGEMENT AU REPOS — la suite d'un écran se prépare pendant que
 * l'élève le lit (lib/precharge-repos). Ne rend rien. Les pages partent une
 * par une, espacées, quand le navigateur est oisif et l'app visible ; les
 * images, en basse priorité, après les pages. Rien sur une connexion économe.
 */
export default function PrechargeAuRepos({
  pages,
  images = [],
}: {
  /** Les adresses internes à préparer, dans l'ordre (pagesAuRepos). */
  pages: readonly string[]
  /** Les images de l'écran suivant, avec les `sizes` de leur <Image> : on
   *  demande à l'optimiseur la variante que l'écran demandera vraiment. */
  images?: readonly ImageAuRepos[]
}) {
  const router = useRouter()
  const cle = [...pages, '|', ...images.map((i) => `${i.src}#${i.sizes}`)].join(SEPARATEUR)

  useEffect(() => {
    const connexion = (navigator as Navigator & { connection?: Connexion }).connection
    if (!peutPrechargerAuRepos(connexion)) return
    const file = cle.split(SEPARATEUR)
    const coupure = file.indexOf('|')
    const adresses = file.slice(0, coupure).filter(Boolean)
    const dessins = file.slice(coupure + 1).filter(Boolean)
    let annule = () => {}
    let arrete = false

    const suivant = (i: number) => {
      if (arrete) return
      if (document.visibilityState !== 'visible') {
        // L'app est en arrière-plan : on reprend au retour, pas avant.
        const reprise = () => {
          document.removeEventListener('visibilitychange', reprise)
          suivant(i)
        }
        document.addEventListener('visibilitychange', reprise)
        annule = () => document.removeEventListener('visibilitychange', reprise)
        return
      }
      if (i < adresses.length) {
        annule = quandOisif(() => {
          if (arrete) return
          prechargerOnglet(router, adresses[i])
          const t = window.setTimeout(() => suivant(i + 1), ESPACEMENT_REPOS_MS)
          annule = () => window.clearTimeout(t)
        })
        return
      }
      annule = quandOisif(() => {
        for (const d of dessins) {
          const [src, sizes] = d.split('#')
          const { props } = getImageProps({ src, alt: '', fill: true, sizes })
          const img = new window.Image()
          img.decoding = 'async'
          img.fetchPriority = 'low'
          if (props.sizes) img.sizes = props.sizes
          if (props.srcSet) img.srcset = props.srcSet
          img.src = props.src
        }
      })
    }

    const depart = window.setTimeout(() => suivant(0), DELAI_REPOS_MS)
    return () => {
      arrete = true
      window.clearTimeout(depart)
      annule()
    }
  }, [cle, router])

  return null
}
