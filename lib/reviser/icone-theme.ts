// -----------------------------------------------------------------------------
// LE PICTOGRAMME D'UN GRAND THÈME DU PROGRAMME — logique pure, testée.
//
// Chaque tuile de la grille du Programme porte un pictogramme : c'est lui que
// l'élève cherche du regard pour retrouver son chapitre (« le triangle, c'est
// la géométrie »), avant même de lire le titre. Lucas, 01/10/2026 : « les
// icônes choisies pour illustrer les grands thèmes doivent être propres,
// claires, compréhensibles ».
//
// La base compte 553 thèmes (3e → Tle surtout) : personne ne les dessine un par
// un. Le pictogramme se DÉDUIT donc du titre, par des règles de mots — celles
// de la famille de la matière d'abord (« Analyse » n'est pas la même chose en
// maths et en physique-chimie pour la santé), puis les règles communes, puis le
// pictogramme de la famille. Un thème qu'aucune règle ne reconnaît garde un
// pictogramme juste : celui de sa matière.
//
// Ce module ne rend que des NOMS : le composant (`components/reviser/
// IconeTheme`) fait la correspondance avec lucide. `lib/` reste sans JSX.
// -----------------------------------------------------------------------------

export const ICONES_THEME = [
  'Activity', 'Apple', 'Archive', 'ArrowUpDown', 'Atom', 'AudioWaveform', 'Baby', 'BadgeCheck', 'Beaker', 'Binary',
  'Bone', 'BookOpen', 'Bot', 'Brain', 'Briefcase', 'Bug', 'Building2', 'Calculator', 'Castle',
  'ChartColumn', 'ChartLine', 'Church', 'CircleHelp', 'CircuitBoard', 'ClipboardList',
  'Clock', 'CloudSun', 'Code', 'Cog', 'Coins', 'Compass', 'Cpu', 'Crown', 'Database',
  'Dices', 'Dna', 'DraftingCompass', 'Drama', 'Dumbbell', 'Earth', 'Egg', 'Euro', 'Eye', 'Factory',
  'Feather', 'FileSignature', 'Filter', 'Flag', 'Flame', 'FlaskConical', 'Footprints',
  'Gauge', 'Gavel', 'Globe', 'GraduationCap', 'Hammer', 'HandHeart', 'Handshake',
  'HardDrive', 'Hash', 'Heart', 'HeartHandshake', 'HeartPulse', 'History', 'House',
  'Landmark', 'Languages', 'Layers', 'Leaf', 'Library', 'Lightbulb', 'Link2', 'ListChecks',
  'ListTree', 'Map', 'MapPinned', 'Megaphone', 'MessageSquareText', 'Mic', 'Microscope',
  'Monitor', 'Mountain', 'Music', 'Network', 'Newspaper', 'NotebookPen', 'Orbit',
  'Paintbrush', 'Palette', 'PawPrint', 'PenTool', 'Percent', 'PersonStanding', 'Pi',
  'Pickaxe', 'Plane', 'Plug', 'Recycle', 'Rocket', 'Ruler', 'Scale', 'ScanFace', 'School',
  'Scroll', 'Search', 'Shield', 'ShieldAlert', 'ShieldCheck', 'ShieldPlus', 'Ship',
  'Sigma', 'Signpost', 'SlidersHorizontal', 'Sparkles', 'Sprout', 'Stethoscope', 'Store',
  'Sun', 'Sunrise', 'Swords', 'Tag', 'Target', 'TestTube', 'Thermometer', 'Timer', 'Trees',
  'TrendingDown', 'TrendingUp', 'Triangle', 'Trophy', 'UserRound', 'UserSearch', 'Users', 'VenetianMask',
  'Vote', 'Wallet', 'Waves', 'Wheat', 'Wind', 'Workflow', 'Zap',
] as const

export type IconeTheme = (typeof ICONES_THEME)[number]

type Regle = readonly [RegExp, IconeTheme]

/** Forme comparable d'un titre : sans accent, sans casse, sans ponctuation. */
export function cleDeTitre(texte: string): string {
  return texte
    .replace(/œ/gi, 'oe')
    .replace(/æ/gi, 'ae')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

// --- Les règles communes : ce qui se dit pareil dans toutes les matières ------

const COMMUNES: readonly Regle[] = [
  // « à l'épreuve de la cohésion sociale » n'est pas un examen : l'épreuve ne
  // compte que si elle n'est pas précédée de « à l' ».
  [/\b(brevet|baccalaureat|bac|evaluation)\b|(?<!\ba l )\bepreuves?\b/, 'GraduationCap'],
  [/\bmethod(e|es|ologie|ologies)\b/, 'ClipboardList'],
  [/\bancien(s)? programmes?\b/, 'Archive'],
  [/\bprogramme limitatif\b/, 'ListChecks'],
  [/\b(developpement durable|environnement|biodiversite|eco conception)/, 'Leaf'],
  [/\bprojet\b/, 'Target'],
]

// --- Les règles par famille de matières ---------------------------------------

const MATHS: readonly Regle[] = [
  [/\b(fonctions?|analyse)\b/, 'ChartLine'],
  [/\bprobabilit/, 'Dices'],
  [/\b(statistiques?|donnees)\b/, 'ChartColumn'],
  [/\b(geometrie|espace)\b/, 'Triangle'],
  [/\b(grandeurs|mesures?)\b/, 'Ruler'],
  [/\bproportionnalite\b/, 'Percent'],
  [/\b(algorithmique|programmation|pensee informatique)\b/, 'Code'],
  [/\b(graphes|matrices)\b/, 'Network'],
  [/\bnombres complexes\b/, 'Pi'],
  [/\barithmetique\b/, 'Hash'],
  [/\balgebre\b/, 'Sigma'],
  [/\bautomatismes\b/, 'Zap'],
  [/\b(nombres|calculs?)\b/, 'Calculator'],
]

const LANGUES: readonly Regle[] = [
  [/\bphrase\b/, 'MessageSquareText'],
  [/\bles temps\b/, 'Clock'],
  [/\bgroupe verbal\b/, 'Zap'],
  [/\bgroupe nominal\b/, 'Tag'],
  [/\bpreposition/, 'Link2'],
  [/\b(lexique|traduction|langue|langages|sprache)\b/, 'Languages'],
  [/\breperes culturels\b/, 'Landmark'],
  [/\b(royaume uni|commonwealth|aires anglophones|allemagne|germanophones|espagne|andin|hispanique)\b/, 'Flag'],
  [/\bidentites et echanges\b/, 'Handshake'],
  [/\bespace prive\b/, 'House'],
  [/\bart et pouvoir\b/, 'Palette'],
  [/\bmondes virtuels\b/, 'Monitor'],
  [/\bfictions et realites\b/, 'Drama'],
  [/\binnovations scientifiques\b/, 'FlaskConical'],
  [/\bdiversite et inclusion\b/, 'HeartHandshake'],
  [/\bterritoire et memoire\b/, 'MapPinned'],
  [/\bdefis et transitions\b/, 'Recycle'],
  [/\bnature\b/, 'Trees'],
  [/\bgenerations\b/, 'Users'],
  [/\bpasse dans le present\b/, 'History'],
  [/\b(representation|construction) de soi\b/, 'ScanFace'],
  [/\bcreer et recreer\b/, 'Paintbrush'],
  [/\bcommunication\b/, 'Megaphone'],
  [/\bvoyages\b.*\bfrontieres\b/, 'Compass'],
  [/\b(voyages|migrations)\b/, 'Plane'],
  [/\becole et societe\b/, 'School'],
  [/\bautres cultures\b/, 'Globe'],
  [/\barts et debats\b/, 'Palette'],
]

const ANTIQUITE: readonly Regle[] = [
  [/\betude de la langue\b/, 'Languages'],
  [/\bsagesse\b/, 'Scroll'],
  [/\bcroire savoir douter\b/, 'CircleHelp'],
  [/\bmediterranee\b/, 'Ship'],
  [/\bdestin\b/, 'Orbit'],
  [/\bcomprendre le monde\b/, 'Globe'],
  [/\binventer\b/, 'Hammer'],
]

const HISTOIRE_GEO: readonly Regle[] = [
  [/\b(ordre mondial|bipolair\w*)\b/, 'Globe'],
  [/\btotalitai\w*\b/, 'ShieldAlert'],
  [/\bcolon\w*\b/, 'Ship'],
  [/\bregions\b/, 'Map'],
  [/\bsociete francaise\b/, 'Users'],
  [/\brecits fondateurs\b/, 'Scroll'],
  [/\b(guerres?|conflits)\b/, 'Swords'],
  [/\brevolutions?\b/, 'Flame'],
  [/\b(union europeenne|construction europeenne)\b/, 'Euro'],
  [/\b(metropol\w*|villes?|urbanisation)\b/, 'Building2'],
  [/\b(mers|oceans|littora\w*)\b/, 'Waves'],
  [/\b(ruraux|rural|faible densite)\b/, 'Wheat'],
  [/\brisques\b/, 'ShieldAlert'],
  [/\b(ressources|equilibres fragiles)\b/, 'Leaf'],
  [/\b(demographique|population)\b/, 'Users'],
  [/\b(mobilites|migrations)\b/, 'Footprints'],
  [/\b(espaces de production|systemes productifs|production)\b/, 'Factory'],
  [/\b(chine|afrique)\b/, 'MapPinned'],
  [/\b(feodal|societe d ordres|royaume)\b/, 'Castle'],
  [/\bmodele britannique\b/, 'Crown'],
  [/\b(eglise|chretientes|islam|religio\w*|reformes)\b/, 'Church'],
  [/\b(empire romain|antique)\b/, 'Landmark'],
  [/\blumieres\b/, 'Lightbulb'],
  [/\b(renaissance|humanisme)\b/, 'Palette'],
  [/\b(nouveau monde|ouverture atlantique|ouverture sur le monde|mediterranee)\b/, 'Ship'],
  [/\bcrise de 1929\b/, 'TrendingDown'],
  [/\bequilibres economiques\b/, 'Scale'],
  [/\b(informer|sources)\b/, 'Newspaper'],
  [/\bconnaissance\b/, 'Brain'],
  [/\b(democratie|regime politique)\b/, 'Vote'],
  [/\bpatrimoine\b/, 'Landmark'],
  [/\bfrontieres\b/, 'Map'],
  [/\bespaces de conquete\b/, 'Rocket'],
  [/\b(bipolair\w*|multipolaire|tiers monde|geopolitique|puissances?|ordre mondial|monde depuis 1945)\b/, 'Globe'],
  [/\b(histoire et memoires|histoire et son organisation|humanite)\b/, 'History'],
  [/\b(amenager|territoires?|territoriales|regions)\b/, 'Map'],
  [/\b(mondialisation|monde habite|habiter)\b/, 'Earth'],
  [/\brepublique\b/, 'Landmark'],
  [/\b(francais|france)\b/, 'Flag'],
  [/\beurope\b/, 'Globe'],
]

const SVT: readonly Regle[] = [
  [/\b(genetique|adn|genes)\b/, 'Dna'],
  [/\b(microb\w*|micro ?organismes)\b/, 'Bug'],
  [/\bcellule\b/, 'Microscope'],
  [/\b(dynamique interne|geologique|geosciences|paysages)\b/, 'Mountain'],
  [/\b(climats?|meteorologie)\b/, 'CloudSun'],
  [/\becosystemes\b/, 'Trees'],
  [/\bsexuee et asexuee\b/, 'Egg'],
  [/\b(comportements sexuels|sexualite|procreation)\b/, 'HeartHandshake'],
  [/\breproduction\b/, 'Baby'],
  [/\bparente\b/, 'ListTree'],
  [/\b(biodiversite|etres vivants|animaux|animal)\b/, 'PawPrint'],
  [/\bevolution\b/, 'Dna'],
  [/\btechnologies\b/, 'Microscope'],
  [/\b(plantes?|agriculture|nourrir)\b/, 'Sprout'],
  [/\b(aliments?|alimentation|digestion|nutrition)\b/, 'Apple'],
  [/\bstress\b/, 'Activity'],
  [/\b(nerveux|comportements?)\b/, 'Brain'],
  [/\b(mouvement|musculaire)\b/, 'Dumbbell'],
  [/\bressources naturelles\b/, 'Pickaxe'],
  [/\b(corps humain|sante|organisme)\b/, 'HeartPulse'],
  [/\b(planete|terre)\b/, 'Earth'],
]

const PHYSIQUE_CHIMIE: readonly Regle[] = [
  [/\b(soleil)\b/, 'Sun'],
  [/\b(univers|astre)\b/, 'Orbit'],
  [/^mathematiques$/, 'Calculator'],
  [/\bevolution temporelle\b/, 'Timer'],
  [/\betat final\b/, 'Scale'],
  [/\bcomposantes\b/, 'TestTube'],
  [/\b(transformations? chimiques?|synthese|systeme chimique|chimie|physico chimiques)\b/, 'FlaskConical'],
  [/\b(climat)\b/, 'CloudSun'],
  [/\b(son et musique)\b/, 'Music'],
  [/\b(circuits? electriques?|electricite)\b/, 'CircuitBoard'],
  [/\b(lumiere|couleurs)\b/, 'Lightbulb'],
  [/\b(vision|image)\b/, 'Eye'],
  [/\b(signal|signaux|ondes)\b/, 'AudioWaveform'],
  [/\b(energies?)\b/, 'Zap'],
  [/\b(mouvements?|interactions)\b/, 'Rocket'],
  [/\binstrumentation\b/, 'SlidersHorizontal'],
  [/\bmesure\b/, 'Gauge'],
  [/\b(matiere|materiaux)\b/, 'Atom'],
  [/\bprevenir\b/, 'ShieldCheck'],
  [/\b(analyser|diagnostiquer)\b/, 'Stethoscope'],
  [/\bchoix autonomes\b/, 'Compass'],
  [/\b(systemes et procedes)\b/, 'Cog'],
  [/\b(recherche|industrie)\b/, 'Factory'],
  [/\bterre\b/, 'Earth'],
]

const ECONOMIE_DROIT: readonly Regle[] = [
  [/\betude de gestion\b/, 'ClipboardList'],
  [/\b(environnement|developpement durable)\b/, 'Leaf'],
  [/\bcadre europeen\b/, 'Euro'],
  [/\bpersonnes\b/, 'UserRound'],
  [/\bfaire valoir\b/, 'BadgeCheck'],
  [/\bchomage\b/, 'UserSearch'],
  [/\bliens sociaux\b/, 'Handshake'],
  [/\bstructuree\b/, 'Layers'],
  [/\bmobilite sociale\b/, 'ArrowUpDown'],
  [/\bactivite de production\b/, 'Factory'],
  [/\bles acteurs\b/, 'Users'],
  [/\borganisations et la societe\b/, 'Globe'],
  [/\bressources humaines\b/, 'Handshake'],
  [/\bchoix strategiques\b/, 'Signpost'],
  [/\blitige\b/, 'Gavel'],
  [/\bcontrat\b/, 'FileSignature'],
  [/\bresponsable\b/, 'ShieldCheck'],
  [/\b(emploi|travail)\b/, 'Briefcase'],
  [/\b(menages|revenu)\b/, 'Wallet'],
  [/\bcrises financieres\b/, 'TrendingDown'],
  [/\b(monnaie|financement|finance)\b/, 'Coins'],
  [/\b(commerce international|internationalisation)\b/, 'Ship'],
  [/\b(marches?|prix)\b/, 'Store'],
  [/\b(richesses?|croissance|creation de valeur)\b/, 'TrendingUp'],
  [/\b(etat|politiques economiques|action publique)\b/, 'Landmark'],
  [/\b(engagement politique|vie politique|vote)\b/, 'Vote'],
  [/\bdeviance\b/, 'ShieldAlert'],
  [/\b(inegalites|justice sociale)\b/, 'Scale'],
  [/\b(diplome|ecole)\b/, 'School'],
  [/\b(socialisation|liens sociaux|acteurs sociaux|societe|mobilite sociale)\b/, 'Users'],
  [/\b(mercatique|marketing)\b/, 'Megaphone'],
  [/\bsystemes d information\b/, 'Database'],
  [/\bintelligence collective\b/, 'Network'],
  [/\btemps et risque\b/, 'Timer'],
  [/\bindividu\b/, 'UserRound'],
  [/\b(strategi\w*|diagnostic)\b/, 'Target'],
  [/\b(entreprendre|organisations|management)\b/, 'Building2'],
  [/\b(economistes|questions economiques|regards croises)\b/, 'Lightbulb'],
  [/\bdroits?\b/, 'Scale'],
]

const NUMERIQUE_TECHNO: readonly Regle[] = [
  [/\beco conception\b/, 'Recycle'],
  [/\b(environnement|developpement durable)\b/, 'Leaf'],
  [/\butilisateurs\b/, 'Users'],
  [/\b(organisation interne|chaine d information|transfert de l information|fonctionnelle et structurelle des produits)\b/, 'Workflow'],
  [/\bordinateur de bureau\b/, 'Monitor'],
  [/\b(sin|numerique)\b/, 'Binary'],
  [/\bstatique\b/, 'Scale'],
  [/\bcinematique\b/, 'Gauge'],
  [/\bcomportementale\b/, 'Activity'],
  [/\bconception\b/, 'DraftingCompass'],
  [/\bbases? de donnees\b/, 'Database'],
  [/\bstructures de donnees\b/, 'ListTree'],
  [/\b(reseaux?|connecter)\b/, 'Network'],
  [/\bweb\b/, 'Globe'],
  [/\bnaviguer\b/, 'Compass'],
  [/\balgorithmique\b/, 'Workflow'],
  [/\b(programmes?|programmation|genie logiciel)\b/, 'Code'],
  [/\bordinateur\b/, 'Cpu'],
  [/\bnumeriser\b/, 'Binary'],
  [/\bcartographier\b/, 'Map'],
  [/\brassembler\b/, 'Users'],
  [/\b(memoriser|donnees)\b/, 'HardDrive'],
  [/\b(commander|programmables)\b/, 'Bot'],
  [/\bsystemes asservis\b/, 'SlidersHorizontal'],
  [/\bmateriaux\b/, 'Layers'],
  [/\b(fabrication|fabriquer|prototypage)\b/, 'Hammer'],
  [/\bbesoin\b/, 'Target'],
  [/\b(electrocinetique)\b/, 'Plug'],
  [/\b(information|informationnel)\b/, 'Cpu'],
  [/\bpuissance\b/, 'Activity'],
  [/\b(energetique|energies)\b/, 'Zap'],
  [/\b(mecanique|mecanismes)\b/, 'Cog'],
  [/\b(architecture|architecturale|design)\b/, 'DraftingCompass'],
  [/\b(creativite|innovation)\b/, 'Lightbulb'],
  [/\b(representation|ingenierie systeme)\b/, 'PenTool'],
  [/\bcompetitivite\b/, 'TrendingUp'],
  [/\b(tester|valider)\b/, 'BadgeCheck'],
  [/\bevolution\b/, 'History'],
  [/\b(fonctionnelle|objet technique|ost)\b/, 'Cog'],
]

const LETTRES: readonly Regle[] = [
  [/\bfiches de lecture\b/, 'Library'],
  [/\boutils d analyse\b/, 'Search'],
  [/\b(poesie|poetiques)\b/, 'Feather'],
  [/\btheatre\b/, 'Drama'],
  [/\b(litterature d idees|presse|informer)\b/, 'Newspaper'],
  [/\b(interrogation|negation)\b/, 'CircleHelp'],
  [/\bgrammaire a l oral\b/, 'Mic'],
  [/\bseductions\b/, 'Sparkles'],
  [/\bautorite\b/, 'Crown'],
  [/\b(phrase|grammaire)\b/, 'MessageSquareText'],
  [/\bheros\b/, 'Shield'],
  [/\bse raconter\b/, 'NotebookPen'],
  [/\bamour\b/, 'Heart'],
  [/\b(voyage|aventure|decouverte du monde)\b/, 'Compass'],
  [/\bunivers nouveaux\b/, 'Sparkles'],
  [/\bscientifiques\b/, 'FlaskConical'],
  [/\bville\b/, 'Building2'],
  [/\b(famille|autrui)\b/, 'Users'],
  [/\bdenoncer\b/, 'Megaphone'],
  [/\b(masquer|ruses)\b/, 'VenetianMask'],
  [/\bnature\b/, 'Trees'],
  [/\banimal\b/, 'PawPrint'],
  [/\b(cite|pouvoir)\b/, 'Landmark'],
  [/\bvaleurs\b/, 'Scale'],
  [/\borigines\b/, 'Sunrise'],
  [/\b(chanter|enchanter)\b/, 'Music'],
  [/\bparole\b/, 'Mic'],
  [/\b(moi|soi)\b/, 'UserRound'],
  [/\blimites\b/, 'Mountain'],
  [/\b(decrire|figurer|imaginer)\b/, 'Eye'],
  [/\b(creation|creer)\b/, 'Paintbrush'],
  [/\bsensibilite\b/, 'Heart'],
  [/\bviolence\b/, 'Swords'],
  [/\b(education|transmission)\b/, 'School'],
  [/\bnotions\b/, 'Brain'],
  [/\breperes\b/, 'Signpost'],
  [/\b(roman|recit|fiction)\b/, 'BookOpen'],
]

const CITOYENNETE: readonly Regle[] = [
  [/\b(environnement|biodiversite)\b/, 'Leaf'],
  [/\b(etat de droit|droit)\b/, 'Scale'],
  [/\brespecter autrui\b/, 'HeartHandshake'],
  [/\bdemocratie\b/, 'Vote'],
  [/\binformation\b/, 'Newspaper'],
  [/\bculture civique\b/, 'Users'],
  [/\b(republique|nation|valeurs)\b/, 'Flag'],
]

const BIOLOGIE_SANTE: readonly Regle[] = [
  [/\btechnologies de l adn\b/, 'Cog'],
  [/\bcultiver\b/, 'Sprout'],
  [/\bcaracteriser pour identifier\b/, 'Search'],
  [/\btravailler ensemble\b/, 'Users'],
  [/\bdomaines d application\b/, 'Factory'],
  [/\brecherche experimentale\b/, 'Lightbulb'],
  [/\b(analyser|diagnostiquer)\b/, 'Stethoscope'],
  [/\bchoix autonomes\b/, 'Compass'],
  [/\b(politiques sociales|action sociale)\b/, 'HandHeart'],
  [/\b(sante publique|politiques)\b/, 'Landmark'],
  [/\b(bien etre)\b/, 'HeartPulse'],
  [/\b(adn|genes|hereditaires)\b/, 'Dna'],
  [/\b(immunit\w*|immunitaire)\b/, 'ShieldPlus'],
  [/\b(nutrition|digestif)\b/, 'Apple'],
  [/\b(reproduction|reproducteur)\b/, 'Baby'],
  [/\b(homeostasie|milieu interieur)\b/, 'Thermometer'],
  [/\blocomoteur\b/, 'Bone'],
  [/\bcardio\b/, 'HeartPulse'],
  [/\brespiratoire\b/, 'Wind'],
  [/\b(risques|securiser|prevenir)\b/, 'ShieldAlert'],
  [/\b(denombrement)\b/, 'Hash'],
  [/\bsolutions\b/, 'Beaker'],
  [/\bconcentration\b/, 'TestTube'],
  [/\b(separer|extraire|purifier)\b/, 'Filter'],
  [/\b(mesure)\b/, 'Gauge'],
  [/\b(micro ?organismes|microscopique)\b/, 'Microscope'],
  [/\b(biomolecules|enzymes|chimie)\b/, 'FlaskConical'],
  [/\b(information et communication)\b/, 'Brain'],
  [/\b(etre humain)\b/, 'PersonStanding'],
  [/\b(laboratoire|recherche experimentale)\b/, 'Microscope'],
  [/\b(protection sociale)\b/, 'Shield'],
  [/\b(sociales?|intervention)\b/, 'HandHeart'],
  [/\bsante\b/, 'HeartPulse'],
]

const SPORT: readonly Regle[] = [
  [/\bsecurite\b/, 'ShieldCheck'],
  [/\b(effort|sante)\b/, 'HeartPulse'],
  [/\bresponsabilite\b/, 'Handshake'],
  [/\b(preparer|entrainer)\b/, 'Timer'],
  [/\bchamps d apprentissage\b/, 'Dumbbell'],
]

const MUSIQUE: readonly Regle[] = [
  [/\b(espace et le temps|le son)\b/, 'AudioWaveform'],
  [/\b(histoire|geographie)\b/, 'Globe'],
  [/\bsociete\b/, 'Users'],
]

// --- La famille d'une matière --------------------------------------------------

type Famille = { regles: readonly Regle[]; defaut: IconeTheme }

const FAMILLES: readonly (readonly [RegExp, Famille])[] = [
  [/^physique-chimie-maths$/, { regles: [...PHYSIQUE_CHIMIE, ...MATHS], defaut: 'Atom' }],
  [/^maths/, { regles: MATHS, defaut: 'Calculator' }],
  [/^(anglais|allemand|espagnol|italien|llcer)/, { regles: LANGUES, defaut: 'Languages' }],
  [/^(latin|grec)$/, { regles: [...ANTIQUITE, ...LETTRES], defaut: 'Landmark' }],
  [/^(histoire-geo|hggsp)/, { regles: HISTOIRE_GEO, defaut: 'Globe' }],
  [/^svt$/, { regles: SVT, defaut: 'Leaf' }],
  [/^(physique-chimie|spcl|enseignement-scientifique)/, { regles: [...PHYSIQUE_CHIMIE, ...SVT], defaut: 'Atom' }],
  [/^(ses|droit-economie|management|sciences-gestion|economie|fiscalite|entrepreneuriat|finances)/, { regles: ECONOMIE_DROIT, defaut: 'TrendingUp' }],
  [/^(nsi|snt|technologie|si|i2d|ingenierie-dd|innovation-technologique)$/, { regles: NUMERIQUE_TECHNO, defaut: 'Cog' }],
  [/^(francais|hlp|philosophie)/, { regles: LETTRES, defaut: 'BookOpen' }],
  [/^emc$/, { regles: CITOYENNETE, defaut: 'Flag' }],
  [/^(biochimie|biotechnologies|biologie|chimie-biologie|sciences-sanitaires)/, { regles: BIOLOGIE_SANTE, defaut: 'Microscope' }],
  [/^sport$/, { regles: SPORT, defaut: 'Dumbbell' }],
  [/^musique$/, { regles: MUSIQUE, defaut: 'Music' }],
  [/^arts-plastiques$/, { regles: [], defaut: 'Palette' }],
]

const FAMILLE_INCONNUE: Famille = { regles: [], defaut: 'BookOpen' }

function familleDe(slug: string): Famille {
  return FAMILLES.find(([motif]) => motif.test(slug))?.[1] ?? FAMILLE_INCONNUE
}

/**
 * Le titre sans son PRÉFIXE DE RANGEMENT : « Mathématiques — Analyse »,
 * « Droit — Thème 4 : … », « Enseignement spécifique — … », « T6 – … ». Ces
 * mots classent le chapitre, ils ne disent pas de quoi il parle — et ils
 * donneraient le même pictogramme à tous les chapitres d'une même colonne.
 */
export function sansPrefixe(titre: string): string {
  return titre
    .replace(/^(mathematiques|physique chimie|chimie|droit|economie|methode) (?=\S)/, '')
    .replace(/^enseignement (commun|specifique) /, '')
    .replace(/^theme \d+ /, '')
    .trim()
}

/** Le pictogramme de la matière, celui d'un thème qu'aucune règle ne reconnaît. */
export function iconeDeMatiere(subjectSlug: string): IconeTheme {
  return familleDe(subjectSlug).defaut
}

/**
 * Le pictogramme d'un grand thème : la première règle de sa famille qui
 * reconnaît le titre, puis les règles communes, puis le pictogramme de la
 * matière.
 *
 * Les épreuves et les méthodes passent AVANT la famille : « Épreuve anticipée
 * de mathématiques » et « Méthode de l'épreuve » sont des chapitres d'examen
 * dans toutes les matières, pas des chapitres de calcul.
 */
export function iconeDuTheme(subjectSlug: string, theme: string): IconeTheme {
  const titre = sansPrefixe(cleDeTitre(theme))
  const famille = familleDe(subjectSlug)
  const examen = COMMUNES.slice(0, 2).find(([motif]) => motif.test(titre))
  if (examen) return examen[1]
  const trouvee =
    famille.regles.find(([motif]) => motif.test(titre)) ??
    COMMUNES.find(([motif]) => motif.test(titre))
  return trouvee?.[1] ?? famille.defaut
}
