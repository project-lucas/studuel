import { notFound } from 'next/navigation'
import LoupeGlobale from '@/components/reviser/LoupeGlobale'
import type { IndexFiches } from '@/lib/reviser/recherche-globale'

export const dynamic = 'force-dynamic'

// L'APERÇU DE LA LOUPE GLOBALE — en développement seulement, sans compte : le
// rond de la rangée des commandes de l'accueil Réviser, et l'écran de
// recherche sur un index de démonstration (aucune lecture réseau).
//
//   /dev/loupe   puis toucher la loupe et taper « thal », « révolution »…
const INDEX: IndexFiches = {
  matieres: [
    { slug: 'maths', nom: 'Maths' },
    { slug: 'histoire-geo', nom: 'Histoire-Géo' },
    { slug: 'anglais', nom: 'Anglais' },
    { slug: 'francais', nom: 'Français' },
  ],
  fiches: [
    { id: 'm1', t: 'Le théorème de Thalès', m: 'maths', th: 'Espace et géométrie' },
    { id: 'm2', t: 'Le théorème de Pythagore', m: 'maths', th: 'Espace et géométrie' },
    { id: 'm3', t: 'Les fractions', m: 'maths', th: 'Nombres et calculs' },
    { id: 'h1', t: 'La Révolution française', m: 'histoire-geo', th: 'Le XVIIIe siècle' },
    { id: 'h2', t: 'Les Lumières', m: 'histoire-geo', th: 'Le XVIIIe siècle' },
    { id: 'a1', t: 'Le present perfect', m: 'anglais', th: 'Les temps' },
    { id: 'f1', t: 'Les figures de style', m: 'francais', th: 'Grammaire' },
  ],
}

export default function ApercuLoupePage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="font-heading text-3xl font-extrabold">La loupe globale</h1>
      <p className="text-sm text-muted-foreground">
        Touche la loupe, tape « thal », « révolution », « anglais »…
      </p>
      <div className="flex items-center justify-end gap-2">
        <LoupeGlobale indexInitial={INDEX} />
      </div>
    </div>
  )
}
