'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Swords } from 'lucide-react'
import Feuille from '@/components/boutique/Feuille'
import BadgeIcone from '@/components/BadgeIcone'
import PhotoCadree from '@/components/moi/PhotoCadree'
import TropheeIcone from '@/components/ui/TropheeIcone'
import { Button } from '@/components/ui/button'
import { lireFicheJoueurAction } from '@/app/amis/defi-actions'
import { tauxVictoire, type FicheJoueur as Fiche } from '@/lib/amis/fiche-joueur'
import { idAvatarIa, srcAvatarIa } from '@/lib/avatar-ia'
import { libelleTop } from '@/lib/defi/classement-arene'
import { blasonDeLigue } from '@/lib/ligue-place'
import { cadreDuNiveau, libelleCadre } from '@/lib/moi/cadre-profil'
import { formatDuree } from '@/lib/moi/temps'
import { epreuve, formatScore } from '@/lib/palmares/epreuves'
import { imagePersonnage, personnageDuPortrait } from '@/lib/personnages-historiques'
import { portraitDe, portraitSrc } from '@/lib/portraits'

/**
 * LA FICHE D'UN JOUEUR (05/10/2026, Lucas : « comme sur Clash Royale, on peut
 * voir beaucoup d'informations sur les autres : victoires, défaites, records,
 * badges… il faut pouvoir regarder les autres — via l'onglet Amis »).
 *
 * Une feuille, ouverte en touchant un ami ou un joueur de la ligue : sa photo
 * dans son cadre gagné, son niveau, ses trophées, ses duels, ses records et
 * leur place, ses badges. Un ami se défie d'ici.
 */
export default function FicheJoueur({
  id,
  onClose,
  onDefier,
}: {
  /** Le joueur ouvert ; null : feuille fermée. */
  id: string | null
  onClose: () => void
  /** Défier cet ami (seulement pour un ami). */
  onDefier?: (id: string, nom: string) => void
}) {
  const [etat, setEtat] = useState<{ id: string; fiche: Fiche | 'absent' | null } | null>(null)
  const fiche = etat && etat.id === id ? etat.fiche : undefined

  useEffect(() => {
    if (!id) return
    let annule = false
    lireFicheJoueurAction(id).then(
      (f) => {
        if (!annule) setEtat({ id, fiche: f })
      },
      () => {
        if (!annule) setEtat({ id, fiche: null })
      },
    )
    return () => {
      annule = true
    }
  }, [id])

  return (
    <Feuille open={id !== null} onClose={onClose} label="Fiche du joueur">
      <div className="px-1 pt-8 pb-4">
        {fiche === undefined ? (
          <p className="py-16 text-center text-sm font-bold text-muted-foreground">Ouverture de la fiche…</p>
        ) : fiche === 'absent' ? (
          <p className="py-16 text-center text-sm font-bold text-muted-foreground">Les fiches des joueurs arrivent très bientôt.</p>
        ) : fiche === null ? (
          <p className="py-16 text-center text-sm font-bold text-muted-foreground">Cette fiche n’est pas visible.</p>
        ) : (
          <ContenuFiche fiche={fiche} onDefier={onDefier} />
        )}
      </div>
    </Feuille>
  )
}

function srcPortrait(f: Fiche): string {
  const ia = idAvatarIa(f.portrait)
  if (ia) return srcAvatarIa(ia)
  const perso = personnageDuPortrait(f.portrait)
  if (perso) return imagePersonnage(perso.id)
  return portraitSrc(portraitDe(f.portrait, f.id))
}

function ContenuFiche({ fiche: f, onDefier }: { fiche: Fiche; onDefier?: (id: string, nom: string) => void }) {
  const taux = tauxVictoire(f)
  const photo = (
    // eslint-disable-next-line @next/next/no-img-element -- portrait servi tel quel
    <img src={srcPortrait(f)} alt="" />
  )
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <PhotoCadree
          niveau={f.niveau}
          photo={photo}
          className="w-32 shrink-0"
          sansCadre={
            <span className="block w-24 shrink-0 overflow-hidden rounded-2xl bg-white p-1 shadow-md [&_img]:aspect-square [&_img]:rounded-xl [&_img]:object-cover">
              {photo}
            </span>
          }
        />
        <div className="min-w-0">
          <p className="font-heading truncate text-2xl leading-tight font-extrabold">{f.nom}</p>
          {f.pseudo ? <p className="truncate text-sm font-bold text-primary">{f.pseudo}</p> : null}
          <p className="mt-1 text-xs font-bold text-muted-foreground">
            Niveau {f.niveau} · {libelleCadre(cadreDuNiveau(f.niveau))}
            {f.classe ? ` · ${f.classe}` : ''}
          </p>
          {/* Sa division de ligue — le rang, depuis le 13/10/2026. */}
          <p className="mt-0.5 text-xs font-extrabold text-primary">Ligue {blasonDeLigue(f.echelon).label}</p>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-2.5">
        <Stat titre="Trophées" valeur={f.trophees.toLocaleString('fr-FR')} detail={`Record : ${f.meilleursTrophees.toLocaleString('fr-FR')}`} icone={<TropheeIcone className="size-7" />} />
        <Stat
          titre="Duels"
          valeur={`${f.victoires} – ${f.defaites}`}
          detail={taux === null ? 'Aucun duel encore' : `${taux} % de victoires`}
          icone={<Swords className="size-6 text-primary" strokeWidth={2.4} aria-hidden="true" />}
        />
        <Stat titre="Série" valeur={`${f.serie} j`} detail="jours d’affilée" />
        <Stat titre="Travail" valeur={formatDuree(f.secondes)} detail="depuis le début" />
      </ul>

      {f.records.length > 0 ? (
        <section>
          <h3 className="titre-section">Records</h3>
          <ul className="mt-1.5 flex flex-col gap-1.5">
            {f.records.slice(0, 6).map((r) => (
              <li key={r.mode} className="carte flex items-center gap-2 px-3 py-2">
                <span className="min-w-0 flex-1 truncate text-sm font-bold">{epreuve(r.mode).nom}</span>
                <span className="font-heading text-sm font-extrabold text-primary">{formatScore(r.mode, r.best)}</span>
                {r.top !== null ? (
                  <span className={r.top <= 10 ? 'rounded-full bg-highlight px-2 py-0.5 text-xs font-extrabold' : 'rounded-full bg-secondary px-2 py-0.5 text-xs font-extrabold text-primary'}>
                    {libelleTop(r.top)}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h3 className="titre-section">Badges · {f.badges.length}</h3>
        {f.badges.length > 0 ? (
          <ul className="mt-1.5 flex flex-wrap gap-2">
            {f.badges.map((slug) => (
              <li key={slug} className="flex size-14 items-center justify-center text-4xl leading-none drop-shadow-[0_2px_2px_rgba(40,20,80,0.3)]">
                <BadgeIcone slug={slug} icon="🏅" tailleImage="size-14" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm font-semibold text-muted-foreground">Pas encore de badge.</p>
        )}
      </section>

      {f.ami && !f.moi && onDefier ? (
        <Button type="button" size="xl" className="w-full" onClick={() => onDefier(f.id, f.nom)}>
          <Swords strokeWidth={2.6} aria-hidden="true" />
          Défier {f.nom}
        </Button>
      ) : null}
    </div>
  )
}

function Stat({ titre, valeur, detail, icone }: { titre: string; valeur: string; detail: string; icone?: ReactNode }) {
  return (
    <li className="carte flex items-center gap-2.5 p-3">
      {icone ? <span className="shrink-0">{icone}</span> : null}
      <span className="min-w-0">
        <span className="block text-xs font-bold text-muted-foreground">{titre}</span>
        <span className="font-heading block text-xl leading-tight font-extrabold">{valeur}</span>
        <span className="block truncate text-[11px] font-semibold text-muted-foreground">{detail}</span>
      </span>
    </li>
  )
}
