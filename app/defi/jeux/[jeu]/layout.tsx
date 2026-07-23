import WorkTimer from '@/components/WorkTimer'

// Les salons de jeu comptent comme du temps de travail : un élève qui enchaîne
// « Capitales » ou « Chasse à la faute » révise, même si ça ne ressemble pas à
// un cours. Sans ce compteur, son temps n'existait nulle part — ni sur /moi, ni
// sur le tableau de bord de ses parents, qui pouvait afficher « 0 min » en face
// d'une semaine bien remplie.
//
// Un LAYOUT et non chaque table de jeu : les quatre tables (QCM, ordre, compte,
// zones) sont montées à des endroits différents de la page, et un compteur par
// table risquerait de compter double le jour où deux coexistent.
export default function JeuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <WorkTimer />
      {children}
    </>
  )
}
