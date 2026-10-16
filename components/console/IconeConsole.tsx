import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  CreditCard,
  Eye,
  HeartPulse,
  LayoutDashboard,
  LayoutList,
  Megaphone,
  MessageCircle,
  MousePointerClick,
  PenTool,
  Repeat,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { IconeConsole as Nom } from '@/lib/console/nav'

const ICONES: Record<Nom, LucideIcon> = {
  tableau: LayoutDashboard,
  messages: MessageCircle,
  diffusion: Megaphone,
  assistant: Sparkles,
  groupes: LayoutList,
  insights: BarChart3,
  usage: MousePointerClick,
  contenu: AlertTriangle,
  coachs: UserCog,
  supervision: ShieldCheck,
  retention: Repeat,
  erreurs: Activity,
  sante: HeartPulse,
  marcel: Bot,
  abonnements: CreditCard,
  parents: Users,
  studio: PenTool,
}

export default function IconeConsole({ nom, className }: { nom: Nom; className?: string }) {
  const Icone = ICONES[nom] ?? Eye
  return <Icone className={className} aria-hidden="true" />
}
