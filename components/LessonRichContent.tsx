import { cn } from '@/lib/utils'

// Mise en forme « cahier » des contenus de leçon (template structure des
// cours) : les titres `#` deviennent des parties numérotées au chiffre cerclé,
// les puces `-` prennent l'astérisque ✱ du template, les citations `>` sont
// les idées clés fléchées en gras. Composant serveur, aucun état.

// Rendu du gras inline : découpe sur **…** et met en évidence les segments.
function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  )
}

export default function LessonRichContent({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  const lines = content.split('\n')
  const blocks: React.ReactNode[] = []
  let list: string[] = []
  let sectionCount = 0

  const flushList = () => {
    if (list.length === 0) return
    const items = list
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 leading-relaxed text-foreground/85">
            <span aria-hidden="true" className="mt-0.5 shrink-0 font-bold">
              ✱
            </span>
            <span className="min-w-0">{renderInline(item)}</span>
          </li>
        ))}
      </ul>,
    )
    list = []
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      flushList()
      continue
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      list.push(trimmed.slice(2))
      continue
    }
    flushList()
    if (trimmed.startsWith('## ')) {
      blocks.push(
        <h3
          key={`h3-${blocks.length}`}
          className="font-heading pt-2 text-xl font-semibold"
        >
          {renderInline(trimmed.slice(3))}
        </h3>,
      )
    } else if (trimmed.startsWith('# ')) {
      sectionCount += 1
      blocks.push(
        <h2
          key={`h2-${blocks.length}`}
          className="font-heading flex items-center gap-3 pt-4 text-2xl font-bold first:pt-0"
        >
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-primary font-mono text-base font-bold text-primary"
          >
            {sectionCount}
          </span>
          <span className="min-w-0 text-balance">
            {renderInline(trimmed.slice(2))}
          </span>
        </h2>,
      )
    } else if (trimmed.startsWith('> ')) {
      // Idée clé : la flèche du template, en gras pour ancrer la mémoire.
      blocks.push(
        <p
          key={`key-${blocks.length}`}
          className="flex gap-3 font-semibold leading-relaxed"
        >
          <span aria-hidden="true" className="shrink-0">
            →
          </span>
          <span className="min-w-0">{renderInline(trimmed.slice(2))}</span>
        </p>,
      )
    } else {
      blocks.push(
        <p
          key={`p-${blocks.length}`}
          className="leading-relaxed text-foreground/85"
        >
          {renderInline(trimmed)}
        </p>,
      )
    }
  }
  flushList()

  return <div className={cn('space-y-4', className)}>{blocks}</div>
}
