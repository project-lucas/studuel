// LIRE UNE PHOTO — la configuration du modèle qui en est capable.
//
// Le fournisseur principal de Studuel (AI_BASE_URL / AI_MODEL) est un modèle de
// TEXTE : chez DeepSeek, `deepseek-chat` répond « 400 This model does not
// support image » dès qu'on lui joint une photo. Le « + » de Marcel, lui, sert
// d'abord à photographier un cahier — c'est même son usage principal, parce que
// le cours d'un élève est une photo dans son téléphone.
//
// D'où cette configuration SÉPARÉE, et facultative :
//
//   AI_VISION_MODEL     le modèle qui lit les images (ex. gpt-4o-mini)
//   AI_VISION_BASE_URL  son point d'entrée, si différent du principal
//   AI_VISION_API_KEY   sa clé, si différente
//
// Sans elle, on retombe sur OPENAI_API_KEY si elle existe (gpt-4o-mini lit les
// images), et sinon la lecture de photo est simplement ANNONCÉE COMME
// INDISPONIBLE : l'écran n'affiche pas un bouton qui échouera, et le quota du
// jour n'est pas dépensé pour un refus du fournisseur. C'est la différence entre
// « ça ne marche pas » et « ce n'est pas branché ».

export type ConfigVision = {
  apiKey: string
  baseURL?: string
  model: string
}

/** Le modèle par défaut quand seule une clé OpenAI est disponible. */
export const VISION_DEFAUT = 'gpt-4o-mini'

export function configVision(): ConfigVision | null {
  const modele = process.env.AI_VISION_MODEL?.trim()
  const cleVision = process.env.AI_VISION_API_KEY?.trim()
  const baseVision = process.env.AI_VISION_BASE_URL?.trim()

  if (modele) {
    // Un modèle vision est déclaré : il peut réutiliser la clé principale (même
    // fournisseur, autre modèle) ou avoir la sienne.
    const apiKey = cleVision || process.env.AI_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim()
    if (!apiKey) return null
    const baseURL = baseVision || (cleVision ? undefined : process.env.AI_BASE_URL?.trim())
    return { apiKey, model: modele, ...(baseURL ? { baseURL } : {}) }
  }

  // Aucun modèle déclaré : OpenAI en dernier recours, parce que sa clé suffit à
  // savoir que gpt-4o-mini est joignable.
  const openai = process.env.OPENAI_API_KEY?.trim()
  if (openai) return { apiKey: openai, model: VISION_DEFAUT }

  return null
}

/** L'écran s'en sert pour ne pas proposer une porte qui ne s'ouvre pas. */
export function visionDisponible(): boolean {
  return configVision() !== null
}
