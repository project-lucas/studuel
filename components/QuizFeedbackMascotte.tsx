'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/**
 * Feuille de retour après une question : un panneau clair (menthe si c'est
 * juste, rosé sinon) qui monte du bas, la mascotte DEBOUT DERRIÈRE lui, et un
 * bouton plein pour enchaîner.
 *
 * Elle couvre volontairement la barre d'onglets : tant qu'elle est là, le seul
 * geste possible est « Continuer ».
 *
 * La mascotte est le sujet de la feuille, pas sa décoration : elle est dessinée
 * grand et posée SOUS le panneau (`zIndex` 0 contre 1), si bien que seule sa
 * moitié haute dépasse. Deux bénéfices d'un coup — l'illustration prend de la
 * place et monte haut dans l'écran, et le buste tranché du dessin disparaît
 * derrière le panneau au lieu de s'afficher à plat sur le fond coloré.
 *
 * ⚠️ Les couleurs, rayons et tailles sont portés EN LIGNE, pas par une classe
 * maison de globals.css : la feuille doit s'afficher juste même quand la
 * feuille de style compilée est en retard (serveur de dev qui ne recompile pas
 * globals.css) — le rendu s'était déjà retrouvé avec une mascotte pleine page.
 * Les valeurs restent dérivées des tokens du design system, jamais des hex.
 *
 * Servie à TOUTES les matières : elle porte tout le retour après réponse, le
 * player n'a plus de feedback en ligne de repli.
 */
export default function QuizFeedbackMascotte({
  open,
  good,
  imageSrc,
  title,
  correctAnswer,
  explanation,
  ctaLabel,
  onContinue,
}: {
  open: boolean
  good: boolean
  /** Illustration à afficher — choisie par `reactionSrc` selon la série. */
  imageSrc: string
  title: string
  /** Bonne réponse à rappeler — seulement quand l'élève s'est trompé. */
  correctAnswer?: string | null
  explanation?: string | null
  ctaLabel: string
  onContinue: () => void
}) {
  const reduce = useReducedMotion()
  const teinte = good ? 'var(--success)' : 'var(--destructive)'

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-x-0 bottom-0"
          style={{ zIndex: 60 }}
          initial={reduce ? { opacity: 0 } : { y: '100%' }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: '100%' }}
          transition={{ type: 'tween', duration: 0.26, ease: 'easeOut' }}
        >
          {/* La mascotte. Elle est DANS LE FLUX, avec une marge basse négative :
              c'est elle qui décide de combien le panneau la recouvre, sans
              qu'aucun des deux n'ait à connaître la hauteur de l'autre.

              `width`/`height` en attributs : même sans CSS, l'image reste à sa
              taille au lieu de s'afficher en 500 px de large.

              `key` sur la source : sans lui React réutilise le même <img> d'une
              question à l'autre et se contente d'en changer l'attribut `src` —
              le navigateur garde alors l'ancienne image à l'écran le temps de
              décoder la nouvelle, et la mascotte a l'air de réagir avec un
              temps de retard. Remonter l'élément force le changement net (et
              rejoue son petit bond). */}
          <div className="mx-auto w-full max-w-xl px-5 md:px-8">
            <motion.img
              key={imageSrc}
              src={imageSrc}
              alt=""
              aria-hidden="true"
              draggable={false}
              width={200}
              height={144}
              initial={reduce ? false : { scale: 0.9, y: 10 }}
              animate={reduce ? undefined : { scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              style={{
                // Le canevas est en 500×360 : large et haut pour contenir les
                // poses bras écartés SANS rien couper. La mascotte n'en occupe
                // donc qu'une partie — cette largeur est calée pour que la TÊTE
                // s'affiche à la bonne taille, pas le cadre. Toucher l'une sans
                // l'autre fait grossir ou rapetisser la mascotte.
                width: '12.5rem',
                height: 'auto',
                display: 'block',
                position: 'relative',
                zIndex: 0,
                // Un quart de l'image passe sous le panneau : la coupe du buste
                // s'y cache, et la ligne d'épaules affleure le bord haut.
                marginBottom: '-2.25rem',
                filter:
                  'drop-shadow(0 6px 10px color-mix(in oklch, var(--foreground), transparent 70%))',
              }}
            />
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              background: `color-mix(in oklch, ${teinte}, white 90%)`,
              color: `color-mix(in oklch, ${teinte}, var(--foreground) 30%)`,
              borderTopLeftRadius: '1.5rem',
              borderTopRightRadius: '1.5rem',
              boxShadow:
                '0 -12px 30px -14px color-mix(in oklch, var(--foreground), transparent 45%)',
              // La barre système de l'iPhone est absorbée ICI, seule, et le
              // confort de lecture par le padding du bloc intérieur. Les deux
              // étaient additionnés dans un `calc(env(…) + 1rem)` : jsdom ne sait
              // pas réduire `env()` dans un `calc()` et casse alors DANS
              // getComputedStyle — ce qui faisait tomber tout test parcourant
              // l'arbre d'accessibilité (toute requête par rôle).
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            <div
              className="mx-auto w-full max-w-xl px-5 md:px-8"
              style={{ paddingTop: '0.9rem', paddingBottom: '1rem' }}
            >
              <div role="status">
                <p
                  className="font-heading font-extrabold text-balance"
                  style={{ fontSize: '1.125rem', color: teinte }}
                >
                  {title}
                </p>

                {!good && correctAnswer ? (
                  <p
                    style={{
                      marginTop: '0.25rem',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                    }}
                  >
                    La bonne réponse : {correctAnswer}
                  </p>
                ) : null}

                {explanation ? (
                  <p
                    style={{
                      marginTop: '0.4rem',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      opacity: 0.85,
                    }}
                  >
                    {explanation}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={onContinue}
                className="font-heading w-full cursor-pointer"
                style={{
                  marginTop: '1rem',
                  padding: '0.9rem 1rem',
                  borderRadius: '1rem',
                  border: 0,
                  background: teinte,
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 800,
                  boxShadow: `0 4px 0 0 color-mix(in oklch, ${teinte}, black 30%)`,
                }}
              >
                {ctaLabel}
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
