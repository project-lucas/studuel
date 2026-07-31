import { subjectInitials } from '@/lib/subject-style'
import {
  couvertureGlobale,
  type CouvertureMatiere,
  type EtatMatiere,
} from '@/lib/coach/couverture'

// « Progrès » — ce que Marcel voit, et RIEN de plus.
//
// Pas de typologie d'erreur ici : elle n'existe sur aucune question du
// catalogue, et un écran qui prétendrait dire pourquoi l'élève se trompe
// mentirait. Ce qui est affiché est ce qui est réellement lu — la couverture du
// programme, chapitre par chapitre.
//
// La barre à trois segments (solide / en route / jamais ouvert) ne se lit pas
// qu'à la couleur : chaque matière porte aussi son constat en toutes lettres.

const TON: Record<EtatMatiere, string> = {
  vide: 'text-destructive',
  retard: 'text-destructive',
  en_route: 'text-muted-foreground',
  solide: 'text-primary',
}

export default function ProgresPanel({
  couverture,
}: {
  couverture: CouvertureMatiere[]
}) {
  if (couverture.length === 0) {
    return (
      <p className="bg-card text-muted-foreground rounded-[20px] p-5 text-center text-[13px] leading-relaxed font-semibold">
        Je n’ai encore rien à regarder. Choisis tes matières dans Réviser, et je
        te dirai où tu en es.
      </p>
    )
  }

  const globale = couvertureGlobale(couverture)

  return (
    <div>
      <header className="mx-0.5 mb-1.5 flex items-center justify-between">
        <h2 className="font-heading text-[15px] font-extrabold">
          Où tu en es du programme
        </h2>
        <span className="text-muted-foreground text-xs font-extrabold">
          {globale} %
        </span>
      </header>

      <ul className="bg-card divide-foreground/8 divide-y rounded-[20px] px-3 shadow-[0_2px_0_rgba(36,48,79,.06),0_14px_26px_-22px_rgba(36,48,79,.9)]">
        {couverture.map((matiere) => (
          <li key={matiere.slug} className="py-3">
            <div className="mb-1.5 flex items-center gap-2.5">
              <span className="bg-foreground/8 text-muted-foreground font-heading grid size-6 shrink-0 place-items-center rounded-lg text-[10px] font-extrabold">
                {subjectInitials(matiere.slug, matiere.name)}
              </span>
              <b className="flex-1 text-[13px] font-extrabold">{matiere.name}</b>
              <span
                className={`text-xs font-extrabold ${TON[matiere.etat]}`}
              >
                {matiere.pct} %
              </span>
            </div>

            <div
              className="flex h-2 gap-0.5"
              role="img"
              aria-label={`${matiere.solide} chapitres solides, ${matiere.enRoute} entamés, ${matiere.jamais} jamais ouverts`}
            >
              {matiere.solide > 0 && (
                <span
                  className="bg-primary rounded-sm"
                  style={{ flex: matiere.solide }}
                />
              )}
              {matiere.enRoute > 0 && (
                <span
                  className="bg-primary/35 rounded-sm"
                  style={{ flex: matiere.enRoute }}
                />
              )}
              {matiere.jamais > 0 && (
                <span
                  className="bg-foreground/12 rounded-sm"
                  style={{ flex: matiere.jamais }}
                />
              )}
            </div>

            <p className="text-muted-foreground mt-1.5 text-xs leading-snug font-semibold">
              {matiere.constat}
              {matiere.consigne && (
                <>
                  {' '}
                  <span className="text-foreground/80 font-bold">
                    {matiere.consigne}
                  </span>
                </>
              )}
            </p>
          </li>
        ))}
      </ul>

      <div className="text-muted-foreground mt-3 flex flex-wrap justify-center gap-3 px-1 text-[11px] font-bold">
        <span className="inline-flex items-center gap-1.5">
          <span className="bg-primary size-2 rounded-sm" />
          Solide
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="bg-primary/35 size-2 rounded-sm" />
          Entamé
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="bg-foreground/12 size-2 rounded-sm" />
          Jamais ouvert
        </span>
      </div>

      {/* Dire ce qu'on ne sait pas encore vaut mieux que de le laisser deviner. */}
      <p className="text-muted-foreground mt-3 px-1 text-center text-xs leading-relaxed font-semibold">
        Je sais te dire <b className="font-extrabold">où</b> tu en es. Pour te
        dire <b className="font-extrabold">pourquoi</b> tu te trompes, il me faut
        encore analyser tes erreurs — j’y travaille.
      </p>
    </div>
  )
}
