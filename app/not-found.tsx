import EcranPepin from '@/components/EcranPepin'

// LA PAGE INTROUVABLE (12/10/2026) : un `notFound()` levé par une page (une
// matière qui n'existe pas, un chapitre supprimé) ou une adresse qui ne mène
// nulle part. Rendue dans la mise en page : bandeau et barre d'onglets restent.
export default function Introuvable() {
  return <EcranPepin pepin="introuvable" />
}
