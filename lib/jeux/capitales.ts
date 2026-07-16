// Capitales du monde — la banque de questions du salon Histoire-Géo.
// Dataset statique (indépendant de quiz_questions) + générateur DÉTERMINISTE :
// la même graine redonne le même tirage, donc un duel est rejouable et
// testable. Les leurres viennent du même continent quand c'est possible —
// c'est là que le jeu devient piégeux et drôle.
import { seededRng } from '@/lib/defi-modes'
import type { ModeQuestion } from '@/lib/defi-modes'

export type Continent =
  | 'Europe'
  | 'Afrique'
  | 'Asie'
  | 'Amériques'
  | 'Océanie'

export type Country = {
  name: string // avec article, prêt pour la phrase (« de la France »… non : nom nu)
  capital: string
  continent: Continent
  flag: string
}

export const COUNTRIES: Country[] = [
  // Europe
  { name: 'la France', capital: 'Paris', continent: 'Europe', flag: '🇫🇷' },
  { name: "l'Allemagne", capital: 'Berlin', continent: 'Europe', flag: '🇩🇪' },
  { name: "l'Italie", capital: 'Rome', continent: 'Europe', flag: '🇮🇹' },
  { name: "l'Espagne", capital: 'Madrid', continent: 'Europe', flag: '🇪🇸' },
  { name: 'le Portugal', capital: 'Lisbonne', continent: 'Europe', flag: '🇵🇹' },
  { name: 'le Royaume-Uni', capital: 'Londres', continent: 'Europe', flag: '🇬🇧' },
  { name: "l'Irlande", capital: 'Dublin', continent: 'Europe', flag: '🇮🇪' },
  { name: 'la Belgique', capital: 'Bruxelles', continent: 'Europe', flag: '🇧🇪' },
  { name: 'les Pays-Bas', capital: 'Amsterdam', continent: 'Europe', flag: '🇳🇱' },
  { name: 'la Suisse', capital: 'Berne', continent: 'Europe', flag: '🇨🇭' },
  { name: "l'Autriche", capital: 'Vienne', continent: 'Europe', flag: '🇦🇹' },
  { name: 'la Grèce', capital: 'Athènes', continent: 'Europe', flag: '🇬🇷' },
  { name: 'la Suède', capital: 'Stockholm', continent: 'Europe', flag: '🇸🇪' },
  { name: 'la Norvège', capital: 'Oslo', continent: 'Europe', flag: '🇳🇴' },
  { name: 'le Danemark', capital: 'Copenhague', continent: 'Europe', flag: '🇩🇰' },
  { name: 'la Finlande', capital: 'Helsinki', continent: 'Europe', flag: '🇫🇮' },
  { name: "l'Islande", capital: 'Reykjavik', continent: 'Europe', flag: '🇮🇸' },
  { name: 'la Pologne', capital: 'Varsovie', continent: 'Europe', flag: '🇵🇱' },
  { name: 'la Tchéquie', capital: 'Prague', continent: 'Europe', flag: '🇨🇿' },
  { name: 'la Hongrie', capital: 'Budapest', continent: 'Europe', flag: '🇭🇺' },
  { name: 'la Roumanie', capital: 'Bucarest', continent: 'Europe', flag: '🇷🇴' },
  { name: 'la Bulgarie', capital: 'Sofia', continent: 'Europe', flag: '🇧🇬' },
  { name: 'la Croatie', capital: 'Zagreb', continent: 'Europe', flag: '🇭🇷' },
  { name: 'la Serbie', capital: 'Belgrade', continent: 'Europe', flag: '🇷🇸' },
  { name: "l'Ukraine", capital: 'Kyiv', continent: 'Europe', flag: '🇺🇦' },
  { name: 'la Russie', capital: 'Moscou', continent: 'Europe', flag: '🇷🇺' },
  // Afrique
  { name: 'le Maroc', capital: 'Rabat', continent: 'Afrique', flag: '🇲🇦' },
  { name: "l'Algérie", capital: 'Alger', continent: 'Afrique', flag: '🇩🇿' },
  { name: 'la Tunisie', capital: 'Tunis', continent: 'Afrique', flag: '🇹🇳' },
  { name: "l'Égypte", capital: 'Le Caire', continent: 'Afrique', flag: '🇪🇬' },
  { name: 'le Sénégal', capital: 'Dakar', continent: 'Afrique', flag: '🇸🇳' },
  {
    name: "la Côte d'Ivoire",
    capital: 'Yamoussoukro',
    continent: 'Afrique',
    flag: '🇨🇮',
  },
  { name: 'le Mali', capital: 'Bamako', continent: 'Afrique', flag: '🇲🇱' },
  { name: 'le Nigeria', capital: 'Abuja', continent: 'Afrique', flag: '🇳🇬' },
  { name: 'le Ghana', capital: 'Accra', continent: 'Afrique', flag: '🇬🇭' },
  { name: 'le Cameroun', capital: 'Yaoundé', continent: 'Afrique', flag: '🇨🇲' },
  {
    name: 'la RD Congo',
    capital: 'Kinshasa',
    continent: 'Afrique',
    flag: '🇨🇩',
  },
  { name: 'le Kenya', capital: 'Nairobi', continent: 'Afrique', flag: '🇰🇪' },
  {
    name: "l'Éthiopie",
    capital: 'Addis-Abeba',
    continent: 'Afrique',
    flag: '🇪🇹',
  },
  {
    name: "l'Afrique du Sud",
    capital: 'Pretoria',
    continent: 'Afrique',
    flag: '🇿🇦',
  },
  {
    name: 'Madagascar',
    capital: 'Antananarivo',
    continent: 'Afrique',
    flag: '🇲🇬',
  },
  { name: "l'Angola", capital: 'Luanda', continent: 'Afrique', flag: '🇦🇴' },
  // Asie
  { name: 'la Chine', capital: 'Pékin', continent: 'Asie', flag: '🇨🇳' },
  { name: 'le Japon', capital: 'Tokyo', continent: 'Asie', flag: '🇯🇵' },
  { name: 'la Corée du Sud', capital: 'Séoul', continent: 'Asie', flag: '🇰🇷' },
  { name: "l'Inde", capital: 'New Delhi', continent: 'Asie', flag: '🇮🇳' },
  { name: 'le Pakistan', capital: 'Islamabad', continent: 'Asie', flag: '🇵🇰' },
  { name: 'la Thaïlande', capital: 'Bangkok', continent: 'Asie', flag: '🇹🇭' },
  { name: 'le Vietnam', capital: 'Hanoï', continent: 'Asie', flag: '🇻🇳' },
  {
    name: 'les Philippines',
    capital: 'Manille',
    continent: 'Asie',
    flag: '🇵🇭',
  },
  { name: "l'Indonésie", capital: 'Jakarta', continent: 'Asie', flag: '🇮🇩' },
  {
    name: 'la Malaisie',
    capital: 'Kuala Lumpur',
    continent: 'Asie',
    flag: '🇲🇾',
  },
  {
    name: "l'Arabie saoudite",
    capital: 'Riyad',
    continent: 'Asie',
    flag: '🇸🇦',
  },
  { name: "l'Iran", capital: 'Téhéran', continent: 'Asie', flag: '🇮🇷' },
  { name: "l'Irak", capital: 'Bagdad', continent: 'Asie', flag: '🇮🇶' },
  { name: 'le Liban', capital: 'Beyrouth', continent: 'Asie', flag: '🇱🇧' },
  { name: 'la Jordanie', capital: 'Amman', continent: 'Asie', flag: '🇯🇴' },
  { name: 'le Qatar', capital: 'Doha', continent: 'Asie', flag: '🇶🇦' },
  {
    name: 'les Émirats arabes unis',
    capital: 'Abou Dabi',
    continent: 'Asie',
    flag: '🇦🇪',
  },
  { name: 'la Turquie', capital: 'Ankara', continent: 'Asie', flag: '🇹🇷' },
  {
    name: 'le Kazakhstan',
    capital: 'Astana',
    continent: 'Asie',
    flag: '🇰🇿',
  },
  { name: 'le Népal', capital: 'Katmandou', continent: 'Asie', flag: '🇳🇵' },
  {
    name: 'la Mongolie',
    capital: 'Oulan-Bator',
    continent: 'Asie',
    flag: '🇲🇳',
  },
  // Amériques
  {
    name: 'les États-Unis',
    capital: 'Washington',
    continent: 'Amériques',
    flag: '🇺🇸',
  },
  { name: 'le Canada', capital: 'Ottawa', continent: 'Amériques', flag: '🇨🇦' },
  { name: 'le Mexique', capital: 'Mexico', continent: 'Amériques', flag: '🇲🇽' },
  { name: 'Cuba', capital: 'La Havane', continent: 'Amériques', flag: '🇨🇺' },
  {
    name: 'Haïti',
    capital: 'Port-au-Prince',
    continent: 'Amériques',
    flag: '🇭🇹',
  },
  {
    name: 'la Colombie',
    capital: 'Bogota',
    continent: 'Amériques',
    flag: '🇨🇴',
  },
  {
    name: 'le Venezuela',
    capital: 'Caracas',
    continent: 'Amériques',
    flag: '🇻🇪',
  },
  { name: 'le Pérou', capital: 'Lima', continent: 'Amériques', flag: '🇵🇪' },
  {
    name: 'le Brésil',
    capital: 'Brasilia',
    continent: 'Amériques',
    flag: '🇧🇷',
  },
  {
    name: "l'Argentine",
    capital: 'Buenos Aires',
    continent: 'Amériques',
    flag: '🇦🇷',
  },
  { name: 'le Chili', capital: 'Santiago', continent: 'Amériques', flag: '🇨🇱' },
  {
    name: "l'Uruguay",
    capital: 'Montevideo',
    continent: 'Amériques',
    flag: '🇺🇾',
  },
  {
    name: "l'Équateur",
    capital: 'Quito',
    continent: 'Amériques',
    flag: '🇪🇨',
  },
  {
    name: 'le Paraguay',
    capital: 'Asunción',
    continent: 'Amériques',
    flag: '🇵🇾',
  },
  // Océanie
  {
    name: "l'Australie",
    capital: 'Canberra',
    continent: 'Océanie',
    flag: '🇦🇺',
  },
  {
    name: 'la Nouvelle-Zélande',
    capital: 'Wellington',
    continent: 'Océanie',
    flag: '🇳🇿',
  },
  { name: 'les Fidji', capital: 'Suva', continent: 'Océanie', flag: '🇫🇯' },
  {
    name: 'la Papouasie-Nouvelle-Guinée',
    capital: 'Port Moresby',
    continent: 'Océanie',
    flag: '🇵🇬',
  },
]

// Mélange de Fisher-Yates piloté par le PRNG fourni (jamais Math.random :
// le tirage doit être rejouable).
function shuffleWith<T>(rng: () => number, arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const CAPITALES_OPTIONS = 4

// Le pool d'un duel : `count` questions, chacune avec 3 leurres piochés en
// priorité sur le MÊME continent (les capitales voisines se confondent — le
// piège est pédagogique), complétés au besoin par le reste du monde.
export function buildCapitalesPool(seed: string, count = 30): ModeQuestion[] {
  const rng = seededRng(`capitales:${seed}`)
  const picked = shuffleWith(rng, COUNTRIES).slice(
    0,
    Math.min(count, COUNTRIES.length),
  )

  return picked.map((country) => {
    const sameContinent = COUNTRIES.filter(
      (c) => c.continent === country.continent && c.capital !== country.capital,
    )
    const elsewhere = COUNTRIES.filter(
      (c) => c.continent !== country.continent && c.capital !== country.capital,
    )
    const decoys = [
      ...shuffleWith(rng, sameContinent),
      ...shuffleWith(rng, elsewhere),
    ]
      .map((c) => c.capital)
      // Deux pays peuvent partager une capitale homonyme : dédup par le nom.
      .filter((cap, i, all) => all.indexOf(cap) === i)
      .slice(0, CAPITALES_OPTIONS - 1)

    const options = shuffleWith(rng, [country.capital, ...decoys])
    return {
      id: `jx-cap-${country.flag}`,
      prompt: `${country.flag} Quelle est la capitale de ${country.name} ?`,
      options,
      correctIndex: options.indexOf(country.capital),
      explanation: `${country.capital} est la capitale de ${country.name}.`,
      subject: 'Histoire-Géo',
    }
  })
}
