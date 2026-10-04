'use client'

import { useState, type ReactNode } from 'react'
import AvatarRender from '@/components/avatar/AvatarRender'
import AtelierAvatarIa from '@/components/moi/AtelierAvatarIa'
import BadgeIcone from '@/components/BadgeIcone'
import FlammeAnimee from '@/components/FlammeAnimee'
import Feuille from '@/components/boutique/Feuille'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import { avatarPortraitSrc, type AvatarConfig } from '@/lib/avatar'
import type { BadgeState } from '@/lib/badges'
import type { BilanCouronnes } from '@/lib/moi/couronnes'
import { libelleBanniere, type EtatVitrine } from '@/lib/moi/vitrine'
import { GEOMETRIE_BANNIERES } from '@/lib/moi/bannieres-geometrie'
import { sfx } from '@/lib/sounds'
import styles from '@/components/moi/VitrineMoi.module.css'
import tableau from '@/components/moi/TableauDeBord.module.css'

// -----------------------------------------------------------------------------
// LA BANNIÈRE DU JOUEUR — la tête de l'onglet Moi (04/10/2026).
//
// Maquette « C » choisie par Lucas parmi quatre (inspirées de Clash Royale et
// Brawl Stars), puis compactée à sa demande : « avatar à gauche, inscrit dans
// une bannière rectangulaire ; série, trophées et niveau à droite », et
// « remplace les couronnes par le croisement de stylos (le logo de l'app),
// sinon l'app est trop proche de Clash Royale ».
//
// La bannière change de MÉTAL avec la collection (bronze → légende,
// lib/moi/vitrine) ; son médaillon porte les crayons croisés du logo. Dessous,
// une ligne : le métal et ce qui manque pour le suivant, les badges mis en
// avant, le compte de couronnes — elle ouvre la collection. Toucher l'avatar
// ouvre l'atelier. Dessins : scripts/profil-ecusson.mjs.
// -----------------------------------------------------------------------------

const DOSSIER = '/images/moi/banniere'

/** Un nombre lisible en Baloo 2 (qui n'a pas l'espace fine insécable). */
const nombre = (n: number) => n.toLocaleString('fr-FR').replace(/ /g, ' ')

export default function VitrineMoi({
  avatar,
  nom,
  niveau,
  serie,
  trophees,
  couronnes,
  badges,
  enAvant,
  vitrine,
  abonne,
  collection,
}: {
  avatar: AvatarConfig
  nom: string
  niveau: number
  serie: number
  trophees: number
  couronnes: BilanCouronnes
  badges: { gagnes: number; total: number }
  /** Les badges mis en avant par l'élève (trois au plus). */
  enAvant: readonly BadgeState[]
  vitrine: EtatVitrine
  abonne: boolean
  /** Le détail de la collection (couronnes et badges). */
  collection: ReactNode
}) {
  const [atelier, setAtelier] = useState(false)
  const [ouverte, setOuverte] = useState(false)
  useFermeAuMasquage(setAtelier, false)
  useFermeAuMasquage(setOuverte, false)

  const rang = vitrine.palier.rang
  const g = GEOMETRIE_BANNIERES[rang]
  const portrait = avatarPortraitSrc(avatar)

  return (
    <section aria-label="Ma bannière" className={styles.tete}>
      <div className={styles.banniere} style={{ aspectRatio: String(g.ratio) }}>
        {/* L'intérieur : un velours violet, l'avatar à gauche, le reste à droite. */}
        <div
          className={styles.interieur}
          style={{ left: `${g.gauche}%`, top: `${g.haut}%`, width: `${g.largeur}%`, height: `${g.hauteur}%` }}
        >
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              setAtelier(true)
            }}
            aria-haspopup="dialog"
            aria-label="Changer mon avatar"
            className={styles.portrait}
          >
            {portrait ? (
              // eslint-disable-next-line @next/next/no-img-element -- portrait servi tel quel
              <img src={portrait} alt="" draggable={false} className={styles.portraitImg} />
            ) : (
              <AvatarRender config={avatar} className="size-full" />
            )}
          </button>

          <div className={styles.droite}>
            <h1 className={styles.nom}>{nom}</h1>
            <div className={styles.compteurs}>
              <span className={styles.compteur} role="group" aria-label={`Série : ${serie} jour${serie > 1 ? 's' : ''}`}>
                <FlammeAnimee className="size-[22px] shrink-0" eteinte={serie <= 0} serie={serie} />
                <span className={styles.chiffre}>{serie}&nbsp;j</span>
              </span>
              <span className={styles.compteur} role="group" aria-label={`${trophees} trophées`}>
                <picture className={styles.coupe}>
                  <source srcSet="/images/moi/trophee-anime-fixe.webp" media="(prefers-reduced-motion: reduce)" />
                  <img src="/images/moi/trophee-anime.webp" alt="" aria-hidden="true" width={96} height={96} draggable={false} />
                </picture>
                <span className={styles.chiffre}>{nombre(trophees)}</span>
              </span>
              <span className={styles.niveau} role="group" aria-label={`Niveau ${niveau}`}>
                <span className={styles.niveauChiffre}>{niveau}</span>
              </span>
            </div>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element -- cadre fixe, déjà au bon poids */}
        <img src={`${DOSSIER}/banniere-${rang}.webp`} alt="" aria-hidden="true" draggable={false} className={styles.cadre} />
      </div>

      {/* La ligne de la collection : le métal, les badges, les couronnes. */}
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOuverte(true)
        }}
        aria-haspopup="dialog"
        className={styles.collection}
      >
        <span className={styles.metal}>
          Bannière {libelleBanniere(vitrine.palier.nom)}
          {vitrine.suivant ? (
            <span className={styles.metalReste}>
              {' · '}
              {vitrine.manque}&nbsp;pt{vitrine.manque > 1 ? 's' : ''} pour l’{vitrine.suivant.nom.toLowerCase()}
            </span>
          ) : null}
        </span>
        <span className={styles.pastilles}>
          {enAvant.slice(0, 3).map((b) => (
            <span key={b.id} className={styles.pastille} title={b.title}>
              <BadgeIcone slug={b.slug} icon={b.icon} tailleImage="size-[18px]" />
            </span>
          ))}
          <span className={styles.compte}>
            {badges.gagnes}/{badges.total} badges · {couronnes.gagnees} couronne{couronnes.gagnees > 1 ? 's' : ''}
          </span>
        </span>
      </button>

      <AtelierAvatarIa open={atelier} onClose={() => setAtelier(false)} abonne={abonne} />
      <Feuille open={ouverte} onClose={() => setOuverte(false)} label="Ma collection">
        <div className={tableau.detail}>{collection}</div>
      </Feuille>
    </section>
  )
}
