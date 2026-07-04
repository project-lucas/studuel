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
    <header className="mb-8 space-y-1.5">
      <h1 className="font-heading text-3xl font-bold text-balance md:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="max-w-prose text-base text-muted-foreground">
          {description}
        </p>
      ) : null}
    </header>
  )
}
