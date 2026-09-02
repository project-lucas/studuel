import Image from 'next/image'
import mascotte from '@/public/images/mascotte/reaction-bonne.webp'

// L'ENTRÉE EN SCÈNE DU COACH — le logo, deux bulles, le personnage.
//
// C'est le haut de l'écran de Marcel, et il ne contient aucune donnée à lire :
// il contient quelqu'un. L'accueil montrait d'abord un bloc violet dense (le
// point du jour, ses étiquettes, son bouton) puis une liste de trois temps —
// deux pavés à déchiffrer avant de savoir ce qu'on pouvait demander. Le coach
// commence maintenant par dire bonjour, comme un prof qui lève les yeux quand
// on entre : ce qui se calculait est intact, mais rangé derrière sa carte
// (« La mission du jour »), à un doigt de là.
//
// La SECONDE BULLE porte le vrai diagnostic (`point.titre`, écrit par
// lib/coach/point-du-jour). C'est ce qui distingue cet écran d'un salon de
// chatbot : Marcel ne demande pas « que puis-je faire pour toi ? » dans le vide,
// il ouvre sur ce qu'il a vu de ton travail. La question générique n'est là que
// le jour où il n'a rien à dire.
//
// Composant serveur : rien à embarquer côté client, l'arrivée est en CSS
// (`.coach-entree`, avec son garde-fou « mouvement réduit »).

export default function CoachEntete({
  salut,
  bulle,
}: {
  /** La salutation, courte — la première bulle. */
  salut: string
  /** Le diagnostic du jour, dans la voix de Marcel. */
  bulle: string
}) {
  return (
    <div className="coach-entree flex flex-col items-center gap-2">
      {/* `h1` : c'est le titre de la page, et il se trouve que c'est un logo.
          Le mot est écrit deux fois — une pour l'œil, une pour la couche de
          remplissage (`data-mot`) — mais une seule est lue à voix haute,
          l'autre étant du `content` CSS. */}
      <h1 className="coach-wordmark">
        <span>Coach</span>
        <b data-mot="Marcel">Marcel</b>
      </h1>

      <p className="coach-bulle">{salut}</p>
      <p className="coach-bulle">{bulle}</p>

      {/* Le personnage EN GRAND, et de face. C'est le même dessin que partout
          ailleurs dans l'app (la tête du bouton flottant en est le rognage) :
          l'élève retrouve le visage qu'il a touché pour venir ici. */}
      <Image
        src={mascotte}
        alt=""
        aria-hidden="true"
        priority
        sizes="160px"
        className="mt-1 h-[168px] w-auto object-contain drop-shadow-[0_16px_20px_-14px_rgba(36,48,79,.55)]"
      />
    </div>
  )
}
