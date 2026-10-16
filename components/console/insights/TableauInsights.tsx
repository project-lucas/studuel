import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import ActiviteJours from '@/components/console/insights/ActiviteJours'
import Colonnes from '@/components/console/kit/Colonnes'
import { Barres, Bloc, Periode, Tuile } from '@/components/console/kit/Kit'
import {
  adoption,
  constats,
  fonctionnalitesMuettes,
  LIBELLE_MARCEL,
  libelleVariation,
  somme,
  variation,
  type Insights,
} from '@/lib/insights/insights'
import { SALONS } from '@/lib/jeux/catalog'
import { cn } from '@/lib/utils'

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const nf = (n: number) => n.toLocaleString('fr-FR')
const NOMS_JEUX = new Map(SALONS.flatMap((s) => s.games.map((g) => [g.id, `${g.name} · ${s.subject}`] as const)))

/** Le tableau des insights, à partir des agrégats de `admin_insights` (589). */
export default function TableauInsights({ i, jours }: { i: Insights; jours: number }) {
  const vNouveaux = variation(i.audience.nouveaux, i.audience.nouveauxAvant)
  const liste = constats(i)
  const muettes = fonctionnalitesMuettes(i)
  const tauxPlus = i.audience.eleves ? Math.round((i.audience.plus / i.audience.eleves) * 100) : 0
  const minutesParActif = i.actifs.periode ? Math.round(i.temps.minutes / i.actifs.periode) : 0

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted-foreground">
          Du {new Date(`${i.periode.depuis}T12:00:00Z`).toLocaleDateString('fr-FR')} au {new Date(`${i.periode.jusqua}T12:00:00Z`).toLocaleDateString('fr-FR')}
        </p>
        <Periode chemin="/admin/insights" jours={jours} />
      </div>

      {/* Les chiffres clés. */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Tuile libelle="Comptes" valeur={nf(i.audience.comptes)} sous={`${nf(i.audience.eleves)} élèves · ${nf(i.audience.parents)} parents`} />
        <Tuile libelle="Nouveaux" valeur={nf(i.audience.nouveaux)} variation={libelleVariation(vNouveaux, i.audience.nouveaux)} ton={vNouveaux === null ? null : vNouveaux >= 0 ? 'bon' : 'alerte'} sous="vs période d’avant" />
        <Tuile libelle="Actifs aujourd’hui" valeur={nf(i.actifs.jour)} sous={`${nf(i.actifs.semaine)} sur 7 j · ${nf(i.actifs.mois)} sur 30 j`} />
        <Tuile libelle="Actifs sur la période" valeur={nf(i.actifs.periode)} sous={`${i.audience.eleves ? Math.round((i.actifs.periode / i.audience.eleves) * 100) : 0} % des élèves`} />
        <Tuile libelle="Travail" valeur={`${nf(Math.round(i.temps.minutes / 60))} h`} sous={`${nf(minutesParActif)} min par élève actif`} />
        <Tuile libelle="Studuel+" valeur={nf(i.audience.plus)} sous={`${tauxPlus} % des élèves · ${i.achats.demandesPlus} demande(s)`} />
      </div>

      {/* Les constats. */}
      {liste.length ? (
        <Bloc titre="Ce qu’il faut retenir" aide="Calculé sur la période, comparé à la période d’avant.">
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {liste.map((c) => (
              <li key={c.titre} className={cn('flex gap-3 rounded-2xl p-3', c.ton === 'alerte' ? 'bg-(--destructive)/8' : c.ton === 'bon' ? 'bg-(--success)/10' : 'bg-secondary/60')}>
                {c.ton === 'alerte' ? (
                  <AlertTriangle className="mt-0.5 size-5 shrink-0 text-(--destructive)" aria-label="À surveiller" />
                ) : c.ton === 'bon' ? (
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-(--success)" aria-label="Bonne nouvelle" />
                ) : (
                  <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-label="Information" />
                )}
                <span>
                  <span className="block text-sm font-extrabold">{c.titre}</span>
                  <span className="block text-xs font-semibold text-muted-foreground">{c.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </Bloc>
      ) : null}

      <Bloc titre="Activité jour par jour" aide={`${nf(somme(i.jours, 'quiz'))} quiz · ${nf(somme(i.jours, 'inscrits'))} inscriptions sur la période.`}>
        <ActiviteJours jours={i.jours} />
      </Bloc>

      <div className="grid gap-5 xl:grid-cols-2">
        <Bloc titre="Ce qui est utilisé" aide="Chaque geste qui rapporte de l’XP, sur la période. Adoption = part des élèves actifs qui l’ont fait.">
          <Barres
            lignes={i.fonctionnalites.map((f) => {
              const v = variation(f.n, f.avant)
              return {
                cle: f.source,
                libelle: f.libelle,
                valeur: f.n,
                sous: `${nf(f.eleves)} élèves · adoption ${adoption(f.eleves, i.actifs.periode)} %`,
                note: (
                  <span className={cn(v === null ? 'text-muted-foreground' : v >= 0 ? 'text-(--success)' : 'text-(--destructive)')}>{libelleVariation(v, f.n)}</span>
                ),
              }
            })}
          />
          {muettes.length ? (
            <div className="mt-4 rounded-2xl bg-(--warning)/10 p-3">
              <p className="text-sm font-extrabold">Jamais utilisé sur la période</p>
              <p className="mt-1 text-sm">{muettes.join(' · ')}</p>
            </div>
          ) : null}
        </Bloc>

        <div className="flex flex-col gap-5">
          <Bloc titre="Matières les plus travaillées" aide="Quiz joués sur la période et score moyen de toutes les sessions.">
            <Barres
              lignes={i.matieres.slice(0, 15).map((m) => ({
                cle: m.matiere,
                libelle: m.matiere,
                valeur: m.sessions,
                sous: `${nf(m.eleves)} élèves`,
                note: m.score !== null ? <span className={cn(m.score < 0.5 ? 'text-(--destructive)' : m.score < 0.7 ? 'text-(--warning)' : 'text-(--success)')}>{Math.round(m.score * 100)} %</span> : null,
              }))}
            />
          </Bloc>
          <Bloc titre="Cours lus par matière">
            <Barres lignes={i.lecons.slice(0, 12).map((m) => ({ cle: m.matiere, libelle: m.matiere, valeur: m.lectures, sous: `${nf(m.eleves)} élèves` }))} />
          </Bloc>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Bloc titre="Jeux de salon">
          <Barres lignes={i.jeux.slice(0, 15).map((g) => ({ cle: g.jeu, libelle: NOMS_JEUX.get(g.jeu) ?? g.jeu, valeur: g.parties, sous: `${nf(g.eleves)} joueurs · ${g.parties ? Math.round((g.victoires / g.parties) * 100) : 0} % de victoires` }))} />
        </Bloc>
        <Bloc titre="Modes de l’arène">
          <Barres lignes={i.modes.slice(0, 15).map((m) => ({ cle: m.mode, libelle: m.mode, valeur: m.parties, sous: `${nf(m.eleves)} joueurs` }))} />
        </Bloc>
        <Bloc titre="Marcel" aide="Appels à l’IA par usage." action={{ href: '/admin/marcel', libelle: 'Coût' }}>
          <Barres lignes={i.marcel.map((m) => ({ cle: m.mode, libelle: LIBELLE_MARCEL[m.mode] ?? m.mode, valeur: m.appels, sous: `${nf(m.eleves)} élèves` }))} />
        </Bloc>
      </div>

      <div className="grid gap-5 xl:grid-cols-[2fr_1fr_1fr]">
        <Bloc titre="Heures de travail" aide="Heure de Paris : quiz et gestes qui rapportent de l’XP.">
          <Colonnes titre="Activité par heure" donnees={i.heures.map((n, h) => ({ cle: String(h), valeur: n, etiquette: `${h} h` }))} etiquettesTous={3} hauteur={140} />
        </Bloc>
        <Bloc titre="Jours de la semaine">
          <Colonnes titre="Activité par jour de la semaine" donnees={i.semaine.map((n, k) => ({ cle: String(k), valeur: n, etiquette: JOURS[k] }))} hauteur={140} />
        </Bloc>
        <Bloc titre="Élèves par classe">
          <Barres lignes={i.classes.map((c) => ({ cle: c.classe, libelle: c.classe === '?' ? 'Non renseignée' : c.classe, valeur: c.n }))} />
        </Bloc>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Bloc titre="Achats et engagement">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <Tuile libelle="Fiches débloquées" valeur={nf(i.achats.fiches)} />
            <Tuile libelle="Capsules" valeur={nf(i.achats.capsules)} />
            <Tuile libelle="Demandes Studuel+" valeur={nf(i.achats.demandesPlus)} />
            <Tuile libelle="Annales ouvertes" valeur={nf(i.achats.annalesCommencees)} />
            <Tuile libelle="Annales traitées" valeur={nf(i.achats.annalesTerminees)} />
          </div>
        </Bloc>
        <Bloc titre="Gemmes gagnées par source">
          <Barres lignes={i.gemmes.map((g) => ({ cle: g.source, libelle: g.source, valeur: g.gemmes, sous: `${nf(g.eleves)} élèves` }))} />
        </Bloc>
      </div>
    </div>
  )
}
