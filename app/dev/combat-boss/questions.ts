import type { ModeQuestion } from '@/lib/defi-modes'

// Les questions de la DÉMO du combat contre Grammatork — l'Ogre des Accords
// ne pose que des questions de français (accords, conjugaison, orthographe).
// La vraie Traque pioche dans la banque de la matière.

function q(id: string, prompt: string, options: string[], correctIndex: number): ModeQuestion {
  return { id: `boss-demo-${id}`, prompt, options, correctIndex, explanation: null, subject: 'Français' }
}

export const QUESTIONS_GRAMMATORK: readonly ModeQuestion[] = [
  q('1', 'Les pommes que j’ai … étaient rouges.', ['mangé', 'mangées', 'mangés', 'manger'], 1),
  q('2', 'Quel est le pluriel de « bijou » ?', ['Bijous', 'Bijoux', 'Bijoues', 'Bijou'], 1),
  q('3', 'Elles se sont … de bonne heure.', ['levé', 'levés', 'levées', 'lever'], 2),
  q('4', 'Futur de « venir », 1re personne du pluriel :', ['Nous viendrons', 'Nous venirons', 'Nous viendront', 'Nous venons'], 0),
  q('5', 'Quel mot est un adverbe ?', ['Rapide', 'Rapidement', 'Rapidité', 'Rapides'], 1),
  q('6', 'Il faut qu’il … à l’heure.', ['vient', 'viendra', 'vienne', 'venait'], 2),
  q('7', 'Quelle orthographe est juste ?', ['Quelque fois', 'Quelques fois', 'Quelquefois', 'Quelle que fois'], 2),
  q('8', 'Dans « Le chat dort », quel est le sujet ?', ['dort', 'Le chat', 'Le', 'chat dort'], 1),
  q('9', 'Passé simple de « faire », 3e personne du singulier :', ['Il faisa', 'Il fit', 'Il fut', 'Il faisait'], 1),
  q('10', 'Ces fleurs sont … belles.', ['tout', 'toute', 'toutes', 'touts'], 2),
  q('11', 'Quel est le féminin de « acteur » ?', ['Acteuse', 'Actrice', 'Acteure', 'Actresse'], 1),
  q('12', 'J’ai … mes clés sur la table.', ['laissé', 'laissées', 'laisser', 'laissés'], 0),
]
