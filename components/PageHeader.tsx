// En-tête de page réutilisable — garantit une structure cohérente
// (titre + description) sur toutes les pages de l'application.
export default function PageHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <header className="mb-8 space-y-1">
      <h1 className="font-heading text-3xl font-bold tracking-tight">{title}</h1>
      {description ? (
        <p className="text-base text-muted-foreground">{description}</p>
      ) : null}
    </header>
  )
}
