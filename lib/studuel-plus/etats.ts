// Ce que chaque pilier de Studuel+ dit à UN élève, aujourd'hui (page /plus).
// Pur : la page lit la base, l'aperçu /dev/plus invente, ce module écrit.

import { compteARebours, phaseDe } from '@/lib/examen/parcours'
import { prepaPourClasse } from '@/lib/prepa-sup/catalogue'
import type { PilierId } from './formule'
import { promesseRente } from './rente'

export function etatsDesPiliers({
  abonne,
  classe,
  creditsRestants,
  creditsRecharge,
  examen,
  annales,
}: {
  abonne: boolean
  classe: string | null
  creditsRestants: number
  creditsRecharge: number
  examen: { nom: string; jours: number } | null
  annales: number
}): Record<PilierId, string> {
  return {
    marcel: abonne
      ? `${creditsRestants} crédit${creditsRestants > 1 ? 's' : ''} ce mois-ci${creditsRecharge > 0 ? ` · ${creditsRecharge} en recharge` : ''}`
      : 'Le point du jour reste ouvert à tous',
    examen:
      examen && examen.jours >= 0
        ? `${examen.nom} · ${compteARebours(examen.jours)} · ${phaseDe(examen.jours).titre.toLowerCase()}`
        : 'Pour la 3e, la 1re et la Terminale',
    annales: abonne ? `${annales} sujets, tous ouverts pour toi` : `${annales} sujets tombés`,
    rente: promesseRente(),
    prepa: prepaPourClasse(classe) ? 'Bientôt : dis-nous quelle filière t’intéresse' : 'Pour la 1re et la Terminale, bientôt',
  }
}
