import type { CSSProperties } from 'react'
import Image from 'next/image'
import styles from './IllustrationQuiz.module.css'

export type ReactionQuiz = 'attente' | 'joie' | 'rate'

const ANGLES = [0, 60, 120, 180, 240, 300]

/**
 * L'ILLUSTRATION DE LA MATIÈRE, au-dessus de l'énoncé — entière, plus rognée
 * dans l'angle. Elle vit avec la partie : elle flotte pendant qu'on cherche,
 * bondit et lance des étincelles d'or sur une bonne réponse, tressaille sur
 * une erreur. L'appelant la remonte à chaque question (`key`) : elle y
 * refait son entrée, et une réaction ne déborde jamais sur la suivante.
 */
export default function IllustrationQuiz({
  src,
  reaction,
}: {
  src: string
  reaction: ReactionQuiz
}) {
  return (
    <div
      className={styles.scene}
      data-illustration=""
      data-reaction={reaction}
      aria-hidden="true"
    >
      <span className={styles.halo} />
      <span className={styles.onde} />
      <span className={styles.porteur}>
        <Image
          src={src}
          alt=""
          width={320}
          height={320}
          sizes="116px"
          priority
          className={styles.dessin}
        />
      </span>
      {ANGLES.map((angle) => (
        <svg
          key={angle}
          viewBox="0 0 12 12"
          className={styles.eclat}
          style={{ '--angle': `${angle}deg` } as CSSProperties}
        >
          <path
            d="M6 0 L7.4 4.6 L12 6 L7.4 7.4 L6 12 L4.6 7.4 L0 6 L4.6 4.6 Z"
            fill="currentColor"
          />
        </svg>
      ))}
    </div>
  )
}
