// -----------------------------------------------------------------------------
// « MARCEL A REMARQUÉ » — penser AVANT l'élève, sans un centime d'IA
// (15/10/2026, Lucas : « que l'on pense pour eux, avant eux »).
//
// Avant même qu'il pose une question, Marcel lit le profil (lib/coach/profil-
// eleve) et dit ce qu'il a vu : un contrôle qui approche avec des chapitres pas
// prêts, une matière qui flanche, un examen qui entre dans une nouvelle phase.
// Chaque remarque porte UN geste (un lien) et, quand c'est utile, une question
// toute prête à lui poser — celle-là seule coûte un crédit, et c'est l'élève
// qui choisit de l'envoyer.
//
// Trois remarques au plus, la plus urgente d'abord. Logique PURE.
// -----------------------------------------------------------------------------

import type { ProfilEleve } from './profil-eleve'

export type Remarque = {
  id: string
  /** Ce que Marcel a vu, en une phrase à l'élève. */
  texte: string
  /** Le geste : où aller. */
  action: { label: string; href: string }
  /** Une question prête à lui poser (préremplit le champ), si utile. */
  question?: string
  /** Plus petit = plus urgent. */
  urgence: number
}

export const MAX_REMARQUES = 3

function quand(n: number): string {
  if (n === 0) return 'aujourd’hui'
  if (n === 1) return 'demain'
  return `dans ${n} jours`
}

export function remarquesDe(p: ProfilEleve, slugDe: (matiere: string) => string | null): Remarque[] {
  const sortie: Remarque[] = []
  const lien = (matiere: string) => {
    const slug = slugDe(matiere)
    return slug ? `/reviser/${slug}` : '/reviser'
  }

  for (const c of p.controles) {
    const faiblesDuControle = p.pointsFaibles.filter((f) => c.chapitres.includes(f.titre))
    const sujet = faiblesDuControle[0]?.titre ?? c.chapitres[0]
    sortie.push({
      id: `controle-${c.matiere}-${c.dans}`,
      texte:
        faiblesDuControle.length > 0
          ? `Ton contrôle de ${c.matiere} est ${quand(c.dans)}, et « ${sujet} » n’est pas encore solide.`
          : `Ton contrôle de ${c.matiere} est ${quand(c.dans)}.`,
      action: { label: c.dans <= 2 ? 'Réviser maintenant' : 'Préparer ce contrôle', href: lien(c.matiere) },
      question: sujet ? `Interroge-moi sur « ${sujet} » pour mon contrôle de ${c.matiere}.` : undefined,
      urgence: c.dans,
    })
  }

  if (p.matiereFragile) {
    const exemple = p.pointsFaibles.find((f) => f.matiere === p.matiereFragile)
    sortie.push({
      id: `fragile-${p.matiereFragile}`,
      texte: `En ${p.matiereFragile}, plusieurs chapitres résistent. On les reprend un par un ?`,
      action: { label: `Ouvrir ${p.matiereFragile}`, href: lien(p.matiereFragile) },
      question: exemple ? `Je ne comprends pas bien « ${exemple.titre} ». Explique-moi l’idée principale.` : undefined,
      urgence: 30,
    })
  } else if (p.pointsFaibles.length > 0) {
    const f = p.pointsFaibles[0]
    sortie.push({
      id: `faible-${f.titre}`,
      texte: `« ${f.titre} » n’est pas encore acquis. Cinq minutes suffisent pour le reprendre.`,
      action: { label: 'Reprendre ce chapitre', href: lien(f.matiere) },
      question: `Explique-moi « ${f.titre} » autrement que le cours.`,
      urgence: 40,
    })
  }

  if (p.examen) {
    sortie.push({
      id: 'examen',
      texte: `${p.examen.nom} est dans ${p.examen.jours} jours. Regarde où tu en es sur le chemin.`,
      action: { label: 'Mode examen', href: '/marcel?onglet=examen' },
      urgence: p.examen.jours <= 45 ? 10 : 50,
    })
  }

  if (sortie.length === 0 && p.debutant) {
    sortie.push({
      id: 'debut',
      texte: 'Je ne te connais pas encore. Fais un premier quiz : je saurai par où commencer.',
      action: { label: 'Faire un premier quiz', href: '/reviser' },
      urgence: 60,
    })
  }

  return sortie.sort((a, b) => a.urgence - b.urgence).slice(0, MAX_REMARQUES)
}
