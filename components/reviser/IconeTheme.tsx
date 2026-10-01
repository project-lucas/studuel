import {
  Activity, Apple, Archive, ArrowUpDown, Atom, AudioWaveform, Baby, BadgeCheck, Beaker,
  Binary, Bone, BookOpen, Bot, Brain, Briefcase, Bug, Building2, Calculator, Castle,
  ChartColumn, ChartLine, Church, CircleHelp, CircuitBoard, ClipboardList, Clock, CloudSun,
  Code, Cog, Coins, Compass, Cpu, Crown, Database, Dices, Dna, DraftingCompass, Drama,
  Dumbbell, Earth, Egg, Euro, Eye, Factory, Feather, FileSignature, Filter, Flag, Flame,
  FlaskConical, Footprints, Gauge, Gavel, Globe, GraduationCap, Hammer, HandHeart,
  Handshake, HardDrive, Hash, Heart, HeartHandshake, HeartPulse, History, House, Landmark,
  Languages, Layers, Leaf, Library, Lightbulb, Link2, ListChecks, ListTree, Map, MapPinned,
  Megaphone, MessageSquareText, Mic, Microscope, Monitor, Mountain, Music, Network,
  Newspaper, NotebookPen, Orbit, Paintbrush, Palette, PawPrint, PenTool, Percent,
  PersonStanding, Pi, Pickaxe, Plane, Plug, Recycle, Rocket, Ruler, Scale, ScanFace, School,
  Scroll, Search, Shield, ShieldAlert, ShieldCheck, ShieldPlus, Ship, Sigma, Signpost,
  SlidersHorizontal, Sparkles, Sprout, Stethoscope, Store, Sun, Sunrise, Swords, Tag,
  Target, TestTube, Thermometer, Timer, Trees, TrendingDown, TrendingUp, Triangle, Trophy,
  UserRound, UserSearch, Users, VenetianMask, Vote, Wallet, Waves, Wheat, Wind, Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { IconeTheme as NomIcone } from '@/lib/reviser/icone-theme'

// La correspondance nom → dessin. `Record<NomIcone, …>` : un nom ajouté à
// `ICONES_THEME` sans son dessin ici ne compile pas.
const DESSINS: Record<NomIcone, LucideIcon> = {
  Activity, Apple, Archive, ArrowUpDown, Atom, AudioWaveform, Baby, BadgeCheck, Beaker,
  Binary, Bone, BookOpen, Bot, Brain, Briefcase, Bug, Building2, Calculator, Castle,
  ChartColumn, ChartLine, Church, CircleHelp, CircuitBoard, ClipboardList, Clock, CloudSun,
  Code, Cog, Coins, Compass, Cpu, Crown, Database, Dices, Dna, DraftingCompass, Drama,
  Dumbbell, Earth, Egg, Euro, Eye, Factory, Feather, FileSignature, Filter, Flag, Flame,
  FlaskConical, Footprints, Gauge, Gavel, Globe, GraduationCap, Hammer, HandHeart,
  Handshake, HardDrive, Hash, Heart, HeartHandshake, HeartPulse, History, House, Landmark,
  Languages, Layers, Leaf, Library, Lightbulb, Link2, ListChecks, ListTree, Map, MapPinned,
  Megaphone, MessageSquareText, Mic, Microscope, Monitor, Mountain, Music, Network,
  Newspaper, NotebookPen, Orbit, Paintbrush, Palette, PawPrint, PenTool, Percent,
  PersonStanding, Pi, Pickaxe, Plane, Plug, Recycle, Rocket, Ruler, Scale, ScanFace, School,
  Scroll, Search, Shield, ShieldAlert, ShieldCheck, ShieldPlus, Ship, Sigma, Signpost,
  SlidersHorizontal, Sparkles, Sprout, Stethoscope, Store, Sun, Sunrise, Swords, Tag,
  Target, TestTube, Thermometer, Timer, Trees, TrendingDown, TrendingUp, Triangle, Trophy,
  UserRound, UserSearch, Users, VenetianMask, Vote, Wallet, Waves, Wheat, Wind, Workflow,
  Zap,
}

/**
 * Le pictogramme d'un grand thème du programme (`lib/reviser/icone-theme`).
 *
 * Des pictogrammes au TRAIT, et c'est assumé : la base compte 553 thèmes, que
 * personne ne peindra un par un dans la famille des illustrations de l'app. Le
 * trait épais, violet sur disque lavande, reste net à 28 px et se reconnaît
 * d'un regard — c'est ce qu'on lui demande : aider à retrouver son chapitre.
 */
export default function IconeTheme({
  nom,
  className,
}: {
  nom: NomIcone
  className?: string
}) {
  const Dessin = DESSINS[nom]
  return <Dessin className={className} strokeWidth={2.4} aria-hidden="true" />
}
