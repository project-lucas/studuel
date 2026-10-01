'use client'

import type { CSSProperties } from 'react'
import { Check } from 'lucide-react'
import SubjectIcon from '@/components/SubjectIcon'
import { subjectVignette } from '@/lib/subject-style'
import type { Subject } from '@/lib/types'
import styles from './ChoixMatieres.module.css'

/**
 * La vitrine des matières de l'onboarding : une tuile par matière, avec son
 * dessin (le même que son dossier dans Réviser) — l'élève reconnaît « SVT » à
 * l'ADN avant de lire le mot. Le Grand oral, sans dessin, garde son icône.
 *
 * Deux sections, tirées du programme officiel (lib/programme-classes) : ce
 * que la classe impose, coché d'office — l'élève valide —, puis ce qui dépend
 * de lui (LV2, spécialités, options), décoché — il ajoute ce qu'il suit. La
 * culture générale se débloque plus tard dans l'app : jamais proposée ici.
 */
export default function ChoixMatieres({
  obligatoires,
  aChoisir,
  titreAChoisir,
  selected,
  onToggle,
}: {
  obligatoires: Subject[]
  aChoisir: Subject[]
  titreAChoisir: string
  selected: string[]
  onToggle: (slug: string) => void
}) {
  const toutes = [...obligatoires, ...aChoisir]
  const nbChoisies = toutes.filter((s) => selected.includes(s.slug)).length

  return (
    <>
      <div className={styles.barre}>
        <span className={styles.compte} aria-live="polite">
          <b>{nbChoisies}</b>
          {nbChoisies > 1 ? 'matières validées' : 'matière validée'}
        </span>
      </div>
      <Section
        titre="Au programme de ta classe"
        subjects={obligatoires}
        depart={0}
        selected={selected}
        onToggle={onToggle}
      />
      {aChoisir.length > 0 ? (
        <Section
          titre={titreAChoisir}
          sousTitre="Coche seulement celles que tu suis."
          subjects={aChoisir}
          depart={obligatoires.length}
          selected={selected}
          onToggle={onToggle}
        />
      ) : null}
    </>
  )
}

function Section({
  titre,
  sousTitre,
  subjects,
  depart,
  selected,
  onToggle,
}: {
  titre: string
  sousTitre?: string
  subjects: Subject[]
  depart: number
  selected: string[]
  onToggle: (slug: string) => void
}) {
  if (subjects.length === 0) return null
  return (
    <section className={styles.section}>
      <h2 className={styles.titreSection}>{titre}</h2>
      {sousTitre ? <p className={styles.sousTitre}>{sousTitre}</p> : null}
      <div className={styles.grille} role="group" aria-label={titre}>
        {subjects.map((s, i) => (
          <TuileMatiere
            key={s.slug}
            subject={s}
            rang={depart + i}
            choisie={selected.includes(s.slug)}
            onToggle={() => onToggle(s.slug)}
          />
        ))}
      </div>
    </section>
  )
}

function TuileMatiere({
  subject,
  rang,
  choisie,
  onToggle,
}: {
  subject: Subject
  rang: number
  choisie: boolean
  onToggle: () => void
}) {
  const vignette = subjectVignette(subject.slug)
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={choisie}
      onClick={onToggle}
      className={styles.tuile}
      style={{ '--rang': rang } as CSSProperties}
    >
      <span className={styles.disque}>
        {vignette ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vignette}
            alt=""
            aria-hidden="true"
            width={320}
            height={320}
            loading="eager"
            className={styles.dessin}
          />
        ) : (
          <SubjectIcon
            slug={subject.slug}
            className={styles.icone}
            strokeWidth={2.25}
            aria-hidden="true"
          />
        )}
      </span>
      <span className={styles.nom}>{subject.name}</span>
      <span className={styles.coche} aria-hidden="true">
        <Check size={14} strokeWidth={3.5} />
      </span>
    </button>
  )
}
