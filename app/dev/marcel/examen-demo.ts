// L'onglet Examen de l'aperçu /dev/marcel (développement seulement) : une vue
// fabriquée avec les VRAIES règles (lib/examen/*), sur des données d'exemple.
//   ?onglet=examen&classe=3e|1re|Tle&jours=251|60|4&dossier=0

import { examenDe, joursAvantExamen, phaseDe } from '@/lib/examen/parcours'
import {
  epreuvesDeLEleve,
  estJourJProche,
  gestesDeLaSemaine,
  partOral,
  preparationGlobale,
  vueEpreuve,
} from '@/lib/examen/onglet'
import type { Piece } from '@/lib/examen/dossier-oral'
import type { OngletExamenVue } from '@/lib/examen/onglet-server'

const p = (id: string, genre: Piece['genre'], titre: string, detail: string | null, etapes: Record<string, boolean>, passages = 0): Piece => ({
  id: `00000000-0000-4000-8000-${id.padStart(12, '0')}`,
  genre,
  titre,
  detail,
  matiere: genre === 'texte' ? 'francais' : null,
  etapes,
  passages,
  ordre: Number(id),
})

const TEXTES: Piece[] = [
  p('1', 'texte', '« Mignonne, allons voir si la rose »', 'Ronsard, Odes', { explication: true, grammaire: true, oral: true }, 1),
  p('2', 'texte', '« Heureux qui, comme Ulysse »', 'Du Bellay, Les Regrets', { explication: true, grammaire: true, oral: false }),
  p('3', 'texte', '« Demain, dès l’aube »', 'Hugo, Les Contemplations', { explication: true, grammaire: false, oral: false }),
  p('4', 'texte', '« L’Albatros »', 'Baudelaire, Les Fleurs du mal', {}),
  p('5', 'texte', '« Le Dormeur du val »', 'Rimbaud, Poésies', {}),
  ...Array.from({ length: 13 }, (_, i) => p(String(6 + i), 'texte', `Texte ${6 + i} du descriptif`, null, {})),
]

const DOSSIERS: Record<string, Piece[]> = {
  '3e': [p('1', 'projet', 'Le voyage à Berlin, mémoire de la guerre froide', 'EPI histoire-allemand', { sujet: true, plan: false, oral: false })],
  '1re': TEXTES,
  Tle: [p('1', 'question', 'Les réseaux sociaux rendent-ils les jeunes moins libres ?', 'Ce que je veux montrer : la liberté d’expression contre la surveillance', { problematique: true, plan: true, introduction: false, oral: true }, 1)],
}

export function ongletExamenDemo(classe: string, joursRaw: string | undefined, sansDossier: boolean): OngletExamenVue | null {
  const examen = examenDe(classe)
  if (!examen) return null
  const jours = joursRaw ? Number(joursRaw) : joursAvantExamen(examen, new Date().toISOString().slice(0, 10))
  const phase = phaseDe(jours)
  const specialites = examen.id === 'bac' ? [{ slug: 'ses', nom: 'SES' }, { slug: 'hggsp', nom: 'HGGSP' }] : []
  const pieces = sansDossier ? [] : (DOSSIERS[classe] ?? [])
  const oral = partOral(examen.id, pieces)
  const chiffres = [
    { m: 12, t: 30, x: 0.42, a: 1, at: 6, b: 0 },
    { m: 6, t: 28, x: 0.28, a: 0, at: 6, b: 0 },
    { m: 9, t: 24, x: 0.35, a: 0, at: 4, b: 1 },
    { m: 4, t: 22, x: 0.2, a: 0, at: 3, b: 0 },
  ]
  const epreuves = epreuvesDeLEleve(examen, specialites).map((e, i) => {
    const c = chiffres[i % chiffres.length]
    return vueEpreuve(e, { chapitres: { maitrises: c.m, total: c.t, maitrise: c.x }, annales: { faites: c.a, total: c.at }, blancs: c.b }, oral)
  })
  return {
    examen: { id: examen.id, nom: examen.nom, periode: examen.periode },
    jours,
    phase,
    preparation: preparationGlobale(epreuves),
    epreuves,
    gestes: gestesDeLaSemaine(examen, phase, { pointsFaibles: 2, aCommencer: 8, matierePrincipale: 'maths' }, {
      lecons: 3,
      quiz: 1,
      annalesOuvertes: 0,
      annalesTraitees: 0,
      blancs: 0,
    }),
    dossierDisponible: true,
    pieces,
    sujets:
      examen.id === 'brevet'
        ? [
            { matiere: 'francais', nom: 'Français', total: 6, faits: 1 },
            { matiere: 'maths', nom: 'Maths', total: 6, faits: 0 },
            { matiere: 'histoire-geo', nom: 'Histoire-géo', total: 4, faits: 0 },
          ]
        : examen.id === 'bac-francais'
          ? [{ matiere: 'francais', nom: 'Français', total: 4, faits: 1 }]
          : [
              { matiere: 'philosophie', nom: 'Philosophie', total: 6, faits: 2 },
              { matiere: 'ses', nom: 'SES', total: 4, faits: 0 },
              { matiere: 'hggsp', nom: 'HGGSP', total: 3, faits: 0 },
            ],
    notes: examen.id === 'bac' ? { voie: 'generale', controleContinu: 13.4, francaisEcrit: 12, francaisOral: 15, mathsAnticipees: 14 } : null,
    specialites,
    jourJ: estJourJProche(jours),
  }
}
