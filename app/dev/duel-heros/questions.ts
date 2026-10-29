import type { ModeQuestion } from '@/lib/defi-modes'

// Les questions de la DÉMO du duel des héros — de la culture générale de
// collège, vérifiable d'un coup d'œil. La vraie course pioche dans la banque
// de la matière (`quiz_questions`) ; celle-ci ne sert qu'à jouer l'écran.

function q(id: string, prompt: string, options: string[], correctIndex: number): ModeQuestion {
  return { id: `demo-${id}`, prompt, options, correctIndex, explanation: null, subject: null }
}

export const QUESTIONS_DEMO: readonly ModeQuestion[] = [
  q('1', 'Combien font 7 × 8 ?', ['54', '56', '63', '48'], 1),
  q('2', 'En quelle année a eu lieu la prise de la Bastille ?', ['1789', '1815', '1492', '1914'], 0),
  q('3', 'Quelle est la capitale de l’Espagne ?', ['Barcelone', 'Séville', 'Madrid', 'Lisbonne'], 2),
  q('4', 'Quel organe pompe le sang dans le corps ?', ['Le foie', 'Les poumons', 'Le cœur', 'Les reins'], 2),
  q('5', 'Quel est le pluriel de « cheval » ?', ['Chevals', 'Chevaux', 'Chevaus', 'Chevails'], 1),
  q('6', 'Combien de côtés a un hexagone ?', ['5', '6', '7', '8'], 1),
  q('7', 'Quelle planète est la plus proche du Soleil ?', ['Vénus', 'Mars', 'Mercure', 'La Terre'], 2),
  q('8', 'Qui a été sacré empereur des Français en 1804 ?', ['Louis XIV', 'Napoléon Ier', 'Charlemagne', 'Louis XVI'], 1),
  q('9', 'Comment dit-on « bibliothèque » en anglais ?', ['Library', 'Bookshop', 'Librairy', 'Booktheque'], 0),
  q('10', 'Quelle est la moitié de 3/4 ?', ['3/8', '3/2', '1/4', '6/4'], 0),
  q('11', 'Quel est le plus long fleuve de France ?', ['La Seine', 'Le Rhône', 'La Garonne', 'La Loire'], 3),
  q('12', 'À quelle température l’eau pure bout-elle (au niveau de la mer) ?', ['90 °C', '100 °C', '110 °C', '0 °C'], 1),
  q('13', 'Qui a écrit « Les Misérables » ?', ['Victor Hugo', 'Émile Zola', 'Molière', 'Jules Verne'], 0),
  q('14', 'Combien font 15 % de 200 ?', ['15', '20', '30', '45'], 2),
  q('15', 'Quel gaz les plantes absorbent-elles pour la photosynthèse ?', ['Le dioxygène', 'Le dioxyde de carbone', 'L’azote', 'L’hélium'], 1),
  q('16', 'Sur quel continent se trouve l’Égypte ?', ['Asie', 'Europe', 'Afrique', 'Amérique'], 2),
  q('17', 'Quel est le participe passé du verbe « prendre » ?', ['Prendu', 'Pris', 'Prit', 'Prendé'], 1),
  q('18', 'Combien y a-t-il de minutes dans 2 heures et demie ?', ['120', '130', '150', '250'], 2),
  q('19', 'Qui a peint « La Joconde » ?', ['Michel-Ange', 'Léonard de Vinci', 'Raphaël', 'Picasso'], 1),
  q('20', 'Quel est le résultat de (−3) × (−4) ?', ['−12', '12', '−7', '7'], 1),
]
