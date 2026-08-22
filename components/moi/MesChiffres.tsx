import type { ReactNode } from 'react'
import { Clock, Swords, Target, Trophy } from 'lucide-react'
import { Chiffre, Filet } from '@/components/moi/ChiffreCell'

// -----------------------------------------------------------------------------
// MES CHIFFRES — le SOCLE de la carte de joueur, et non plus une carte à part.
//
// POURQUOI IL A DÉMÉNAGÉ DANS LA CARTE. Il vivait deux blocs plus bas, sous son
// propre titre, dans sa propre carte blanche bordée. Résultat : l'écran posait
// deux fois la même question — « qui suis-je » en haut (avatar, prénom, classe,
// blason) et « qu'est-ce que j'ai fait » au milieu (série, temps, trophées) —
// alors que c'est UNE seule réponse. Pendant ce temps la carte du haut, quand
// l'élève n'a pas choisi de bannière illustrée, n'était qu'un grand aplat
// violet avec un visage dans un coin : de la place perdue au-dessus d'un bloc
// qui en manquait.
//
// Les deux fusionnent. La carte prend la forme d'une carte de joueur à deux
// étages : l'identité en haut, sur le violet, et les chiffres en bas, sur une
// PLAQUE BLANCHE encastrée. C'est la même grammaire qu'une carte à collectionner
// — portrait en haut, statistiques en pied — et elle a l'avantage de rendre au
// bloc de chiffres le fond clair pour lequel il a été dessiné.
//
// LA SÉPARATION EN DEUX RANGÉES EST LE SENS DU BLOC, pas une mise en page :
//
//   • EN HAUT, CE QUI NE REDESCEND JAMAIS — la série, le temps cumulé, la
//     moyenne. Trois chiffres qu'un élève reconnaît comme siens, et dont deux
//     ne peuvent que monter. C'est le socle : on les lit en premier parce qu'ils
//     sont toujours vrais, même une semaine sans jouer.
//
//   • EN BAS, CE QUI SE GAGNE ET SE PERD — duels, victoires, trophées. La
//     performance du moment, qui monte et qui descend. Elle est SOUS le socle,
//     jamais au-dessus : une mauvaise semaine d'arène ne doit pas être la
//     première chose que l'élève lit sur l'onglet qui porte son nom.
//
// LES DEUX FAMILLES SONT MAINTENANT DITES PAR LA COULEUR et plus seulement par
// un filet horizontal : violet pour le travail, or pour l'arène, la flamme pour
// la série. Le détail du procédé est dans components/moi/ChiffreCell.tsx —
// l'essentiel est qu'il n'y a que trois teintes, et qu'elles portent chacune un
// sens déjà présent dans la charte.
//
// LES ICÔNES DE L'ARÈNE ONT ÉTÉ REMISES DANS L'ORDRE. La coupe désignait le
// TAUX DE VICTOIRES et l'éclair les TROPHÉES : le seul objet de l'app qui est
// littéralement une coupe ne pointait pas les trophées. La coupe est passée à
// droite, sur les trophées ; les victoires prennent la cible, qui dit la
// réussite au coup par coup sans promettre de récompense.
//
// IL N'A PLUS DE TITRE VISIBLE. « Mes chiffres » en gras au-dessus d'une rangée
// de six nombres énonçait ce que six nombres disent déjà ; et dans une carte, un
// titre de section aurait coupé en deux un objet qui doit se lire d'un bloc. Le
// nom reste pour les lecteurs d'écran (`aria-label`), qui eux ne voient pas
// qu'on est passé des mots aux chiffres.
//
// UNE VALEUR ABSENTE NE S'INVENTE PAS. Pas de « 0 % » de victoires pour qui n'a
// jamais joué, pas de « stable » sans point de comparaison : la note disparaît
// plutôt que de mentir.
// -----------------------------------------------------------------------------

export type ChiffresArene = {
  /** Défis, duels et matchs joués, toutes issues confondues. */
  duels: number
  /** Taux de victoire déjà formaté (« 62 % »), ou null sans partie jouée. */
  victoires: string | null
  trophees: number
  /** Record de trophées, dit seulement s'il dépasse le compteur courant. */
  recordTrophees: number
  /** Meilleure série de victoires. */
  meilleureSerie: number
}

export default function MesChiffres({
  serie,
  record,
  temps,
  tempsTendance,
  tuileMoyenne,
  arene,
}: {
  serie: number
  /** Meilleure série jamais tenue, dite seulement si elle dépasse. */
  record: number
  /** Temps de travail cumulé, déjà formaté (« 27 h »). */
  temps: string
  tempsTendance: string | null
  /**
   * LA TROISIÈME CELLULE DU SOCLE, passée entière et non en morceaux : c'est la
   * seule qui soit cliente (elle ouvre la saisie des moyennes), et la seule qui
   * change de nature selon qu'une moyenne est connue ou non. Lui passer six
   * props — chiffre, unité, légende, note, tendance, bouton de repli — revenait
   * à décrire ici une cellule dont la logique vit ailleurs.
   */
  tuileMoyenne: ReactNode
  arene: ChiffresArene
}) {
  // Un élève qui n'a jamais joué n'a pas de rangée d'arène : elle n'afficherait
  // que des zéros, c'est-à-dire un reproche.
  const aJoue = arene.duels > 0

  return (
    // `moi-carte-socle` : la plaque blanche ENCASTRÉE dans le violet. L'ombre
    // interne du haut est ce qui la creuse — posée à plat, elle se lisait comme
    // une seconde carte empilée sous la première, ce qu'on cherchait justement
    // à supprimer.
    <section aria-label="Mes chiffres" className="moi-carte-socle bg-white">
      {/* Le socle : ce qui ne redescend jamais. */}
      <div className="flex items-stretch px-1 py-3.5">
        <Chiffre
          ton="serie"
          // La VRAIE flamme du bandeau, pas une icône de trait : c'est le même
          // objet, il doit avoir le même visage d'un écran à l'autre.
          illustration="/images/serie/flamme.webp"
          illustrationEteinte={serie === 0}
          valeur={serie}
          legende={serie === 1 ? 'jour de série' : 'jours de série'}
          note={record > serie ? `record ${record} j` : null}
        />
        <Filet />
        <Chiffre
          ton="travail"
          Icon={Clock}
          valeur={temps}
          legende="de travail"
          note={tempsTendance}
        />
        <Filet />
        {tuileMoyenne}
      </div>

      {/* L'arène : ce qui se gagne et se perd. */}
      {aJoue ? (
        <div className="flex items-stretch border-t border-border px-1 py-3.5">
          <Chiffre
            ton="arene"
            Icon={Swords}
            valeur={arene.duels}
            legende={arene.duels === 1 ? 'partie jouée' : 'parties jouées'}
            note={
              arene.meilleureSerie > 1
                ? `${arene.meilleureSerie} victoires d’affilée`
                : null
            }
          />
          <Filet />
          <Chiffre
            ton="arene"
            Icon={Target}
            valeur={arene.victoires ?? '—'}
            legende="de victoires"
            // Un taux calculé sur une poignée de parties n'est pas une
            // statistique, c'est un hasard : « 100 % » sur 2 duels se lit comme
            // une promesse que la 3e partie viendra démentir. On dit sur quoi
            // il porte tant que l'échantillon est mince.
            note={arene.duels < 10 ? `sur ${arene.duels} parties` : null}
          />
          <Filet />
          <Chiffre
            ton="arene"
            Icon={Trophy}
            valeur={arene.trophees}
            legende="trophées"
            note={
              arene.recordTrophees > arene.trophees
                ? `record ${arene.recordTrophees}`
                : null
            }
          />
        </div>
      ) : null}
    </section>
  )
}
