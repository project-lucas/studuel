import { CalendarDays, LineChart, Sparkles, Users } from 'lucide-react'
import LinkChildForm from '@/components/parents/LinkChildForm'

/**
 * La première visite d'un parent : aucun enfant lié.
 *
 * L'écran disait « Aucun enfant lié pour l'instant » au-dessus d'un champ de
 * code — exact, et décourageant : le parent venait de créer un compte, et la
 * première chose qu'on lui montrait était un manque. Ici, on lui dit dans
 * l'ordre CE QU'IL VA VOIR (trois promesses, les mêmes que l'onboarding),
 * puis COMMENT y arriver (le code, où l'enfant le trouve), puis le champ.
 *
 * « Dans l'onglet Amis, le bouton Ajouter un ami » : c'est là que l'élève lit
 * son code (components/FriendAddButton) — le chemin est écrit noir sur blanc,
 * parce qu'un parent n'a pas l'application de son enfant sous les yeux.
 */
export default function BienvenueParent() {
  return (
    <div className="flex flex-col gap-4">
      <section className="bg-card rounded-2xl border p-5 shadow-sm">
        <h3 className="font-heading mb-1 text-lg font-semibold">
          Bienvenue dans votre espace
        </h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Dès que le compte de votre enfant est lié, vous verrez ici :
        </p>
        <ul className="grid gap-2.5 sm:grid-cols-3">
          <Promesse
            icon={<LineChart className="size-4" aria-hidden="true" />}
            titre="Sa semaine"
            detail="Temps de révision, régularité, tendance sur quatre semaines."
          />
          <Promesse
            icon={<CalendarDays className="size-4" aria-hidden="true" />}
            titre="Ses contrôles"
            detail="Déclarés par votre enfant, avec leurs chapitres et un compte à rebours."
          />
          <Promesse
            icon={<Sparkles className="size-4" aria-hidden="true" />}
            titre="Vos gestes"
            detail="Deux ou trois choses concrètes à faire, adaptées à sa semaine."
          />
        </ul>
      </section>

      <section className="bg-card rounded-2xl border p-5 shadow-sm">
        <h3 className="font-heading mb-1 flex items-center gap-2 text-lg font-semibold">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-xl">
            <Users className="size-4" aria-hidden="true" />
          </span>
          Lier le compte de votre enfant
        </h3>
        <ol className="text-muted-foreground mt-3 mb-4 flex flex-col gap-2 text-sm">
          <Etape n={1}>
            {/* `{' '}` explicites : le compilateur JSX perd l'espace qui suit
                une balise en ligne quand le texte se poursuit à la ligne. */}
            Sur <strong className="text-foreground">son</strong>{' '}
            téléphone, votre enfant ouvre l&apos;onglet{' '}
            <strong className="text-foreground">Amis</strong>, puis le bouton{' '}
            <strong className="text-foreground">Ajouter un ami</strong>.
          </Etape>
          <Etape n={2}>
            Il y lit <strong className="text-foreground">son code</strong>{' '}
            : six lettres et chiffres.
          </Etape>
          <Etape n={3}>Saisissez ce code ci-dessous. Le partage du code vaut accord.</Etape>
        </ol>
        <LinkChildForm />
        <p className="text-muted-foreground mt-3 text-xs">
          Votre enfant n&apos;a pas encore de compte ? Il le crée lui-même sur
          Studuel en choisissant sa classe — deux minutes, avec un mini-quiz.
        </p>
      </section>
    </div>
  )
}

function Promesse({
  icon,
  titre,
  detail,
}: {
  icon: React.ReactNode
  titre: string
  detail: string
}) {
  return (
    <li className="border-primary/20 bg-primary/[0.04] rounded-xl border p-3">
      <span className="bg-primary/10 text-primary mb-1.5 flex size-8 items-center justify-center rounded-lg">
        {icon}
      </span>
      <span className="block text-sm font-semibold">{titre}</span>
      <span className="text-muted-foreground block text-xs leading-snug">{detail}</span>
    </li>
  )
}

function Etape({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="bg-primary text-primary-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold">
        {n}
      </span>
      <span>{children}</span>
    </li>
  )
}
