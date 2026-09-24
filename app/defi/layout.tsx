import DecorArene from '@/components/defi/DecorArene'

// Le décor de l'Arène derrière les SOUS-PAGES de /defi. L'onglet lui-même a le
// sien, dans son emplacement (`app/@defi/defi/layout.tsx`) — voir DecorArene.
export default function DefiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <DecorArene horsOnglet />
      {children}
    </>
  )
}
