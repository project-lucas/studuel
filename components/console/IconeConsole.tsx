import {
  BookOpen,
  Bot,
  Bug,
  CreditCard,
  Eye,
  Flag,
  Gift,
  GraduationCap,
  HeartPulse,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Megaphone,
  MessageCircle,
  MousePointerClick,
  QrCode,
  Repeat,
  ShieldCheck,
  Sparkles,
  UserCog,
  Video,
  type LucideIcon,
} from 'lucide-react'
import type { IconeConsole as Nom } from '@/lib/console/nav'

const ICONES: Record<Nom, LucideIcon> = {
  eleves: GraduationCap,
  messages: MessageCircle,
  diffusion: Megaphone,
  assistant: Sparkles,
  groupes: QrCode,
  insights: LayoutDashboard,
  usage: MousePointerClick,
  contenu: ListChecks,
  coachs: UserCog,
  supervision: ShieldCheck,
  retention: Repeat,
  erreurs: Bug,
  sante: HeartPulse,
  marcel: Bot,
  abonnements: CreditCard,
  parents: Video,
  studio: BookOpen,
  demandes: Inbox,
  leads: Gift,
  signalementsIa: Flag,
}

export default function IconeConsole({ nom, className }: { nom: Nom; className?: string }) {
  const Icone = ICONES[nom] ?? Eye
  return <Icone className={className} aria-hidden="true" />
}
