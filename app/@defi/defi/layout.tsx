import DecorArene from '@/components/defi/DecorArene'

// Le décor de l'Arène autour de l'onglet Défi : il vit et se cache avec
// l'onglet (components/OngletsVivants).
export default function EmplacementDefiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <DecorArene />
      {children}
    </>
  )
}
