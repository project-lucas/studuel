'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import RubanOr from '@/components/recompenses/RubanOr'
import { Eclats } from '@/components/moi/carnet/Croquis'
import ConfirmationFiche, { type ReponseDeblocage } from '@/components/fiche/ConfirmationFiche'
import { DUREE_OUVERTURE, PRIX_FICHE, imagesEcrin, soldeEcrin, type RouleauFiche } from '@/lib/fiche-ecrin'
import { RENTE_GEMMES_SEMAINE } from '@/lib/studuel-plus/rente'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import s from './EcrinFiche.module.css'

/**
 * L'ÉCRIN DE DÉBLOCAGE D'UNE FICHE (25/10/2026, cadrage « le jeu vivant » § H).
 *
 * Lucas : « c'est un aboutissement de temps de travail de débloquer une fiche…
 * un rendu bien plus gamifié ou plaisant ». Plus de cadenas gris ni de
 * paragraphe gris : au centre, la FICHE ROULÉE posée sur un plateau violet à
 * bague d'or (façon carte du magasin), une lumière qui tourne derrière, le
 * titre du chapitre en Baloo 2, UNE phrase, un GROS bouton d'or « Débloquer ·
 * 30 💎 », et dessous le solde. La confirmation est un pop-up de la famille
 * des tanières (`SheetShell`). Au succès, le rouleau se DÉROULE : l'image
 * ouverte apparaît par transform et opacité, les éclats fusent, puis la page
 * se recharge et montre la vraie fiche.
 *
 * L'illustration du rouleau est livrée à part (`public/images/fiche/`) : tant
 * qu'elle manque, l'écrin montre la fiche de révision du Marché, avec un
 * sceau dessiné en CSS (lib/fiche-ecrin → imagesEcrin).
 */
export default function EcrinFiche({
  titre,
  gems,
  rouleau,
  debloquer,
  onOuverte,
}: {
  /** Le titre du chapitre (sans lui : « Fiche de révision »). */
  titre?: string | null
  gems: number
  rouleau?: RouleauFiche | null
  /** La dépense, au serveur : ce qu'il répond fait foi. */
  debloquer: () => Promise<ReponseDeblocage>
  /** Après l'ouverture jouée : le moment de montrer la vraie fiche. */
  onOuverte: () => void
}) {
  const [etat, setEtat] = useState<'ferme' | 'confirme' | 'ouverture'>('ferme')
  const images = imagesEcrin(rouleau)
  const solde = soldeEcrin(gems)
  const bouton = useRef<HTMLButtonElement>(null)
  const nom = titre?.trim() || 'Fiche de révision'

  const surSucces = useCallback(() => {
    setEtat('ouverture')
    sfx.unlock()
  }, [])

  useEffect(() => {
    if (etat !== 'ouverture') return
    const t = setTimeout(onOuverte, DUREE_OUVERTURE)
    return () => clearTimeout(t)
  }, [etat, onOuverte])

  const ouverte = etat === 'ouverture'

  return (
    <div className={s.ecrin} data-etat={etat}>
      <div className={s.lumiere} aria-hidden="true" />

      {ouverte ? (
        <div className={s.rubanOuverte}>
          <RubanOr taille="moyen">C’est à toi !</RubanOr>
        </div>
      ) : (
        <p className={s.surtitre}>Fiche de révision</p>
      )}

      {/* L'OBJET : la fiche roulée, posée sur son ombre, qui flotte. À
          l'ouverture, elle se replie et la fiche déroulée prend sa place. */}
      <div className={s.scene} aria-hidden="true">
        <span className={s.ombre} />
        <span className={cn(s.objet, ouverte && s.objetPart)}>
          <Image src={images.ferme} alt="" width={256} height={256} unoptimized loading="eager" className={s.image} />
          {images.repli ? (
            <span className={s.sceau}>
              <Star className="size-4" strokeWidth={2.6} fill="currentColor" />
            </span>
          ) : null}
        </span>
        {ouverte ? (
          <>
            <span className={cn(s.objet, s.objetArrive)}>
              <Image src={images.ouvert} alt="" width={256} height={256} unoptimized loading="eager" className={s.image} />
            </span>
            <span className={s.onde} />
            <span className={`${s.onde} ${s.onde2}`} />
            <Eclats className={cn(s.eclats, s.eclatsGauche)} />
            <Eclats className={cn(s.eclats, s.eclatsDroite)} sens="droite" />
          </>
        ) : null}
      </div>

      <h2 className={s.titre}>{nom}</h2>
      <p className={s.phrase}>{ouverte ? 'Ta fiche est dans ta bibliothèque, pour toujours.' : 'Ta fiche, à toi pour toujours.'}</p>

      {ouverte ? null : solde.peut ? (
        <button
          ref={bouton}
          type="button"
          onClick={() => {
            sfx.tap()
            setEtat('confirme')
          }}
          aria-haspopup="dialog"
          className={cn('olympe-gold olympe-press', s.boutonOr)}
        >
          Débloquer
          <span className={s.prix}>
            {PRIX_FICHE}
            <CristalIcon className="size-5" />
          </span>
        </button>
      ) : (
        <Link href="/amis" className={cn('olympe-gold olympe-press', s.boutonOr)}>
          Gagner des gemmes
        </Link>
      )}

      {ouverte ? null : (
        <>
          <p className={s.solde}>
            <CristalIcon className="size-4" />
            {solde.phrase}
          </p>
          <Link href="/plus" className={s.lienPlus}>
            Studuel+ : {RENTE_GEMMES_SEMAINE} gemmes chaque semaine
          </Link>
        </>
      )}

      {etat === 'confirme' ? (
        <ConfirmationFiche
          titre={nom}
          image={images.ferme}
          gems={gems}
          debloquer={debloquer}
          onSucces={surSucces}
          onFermer={() => {
            setEtat('ferme')
            bouton.current?.focus({ preventScroll: true })
          }}
        />
      ) : null}
    </div>
  )
}
