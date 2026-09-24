'use client'

import { useLayoutEffect, useRef, type Dispatch, type SetStateAction } from 'react'

/**
 * Referme un écran TRANSITOIRE (feuille, rideau, menu) quand son onglet a été
 * caché, avant qu'il ne réapparaisse.
 *
 * Les onglets restent montés (components/OngletsVivants) : leur état survit
 * d'une visite à l'autre, et c'est voulu — le défilement, un volet qu'on a
 * laissé déplié. Mais un écran transitoire ouvert au moment où l'on quitte
 * l'onglet par un lien (un billet de la feuille des modes, la course lancée par
 * le rideau du DUEL) réapparaîtrait au retour — et le rideau, figé, bloquait
 * l'arène. Chez Clash Royale, on revient sur un écran propre.
 *
 * LE MOMENT COMPTE. `<Activity>` démonte les effets quand il cache un arbre et
 * les remonte quand il le révèle. Refermer au démontage ne marche pas : c'est
 * une mise à jour dans un arbre caché, que React diffère à la plus basse
 * priorité — le retour révélait l'onglet AVANT de l'appliquer, feuille ouverte
 * (vu le 23/09/2026). On referme donc au REMONTAGE, dans un effet de mise en
 * page : il s'exécute avant que l'écran ne soit peint, le rendu repart fermé,
 * sans une image de la feuille. Le premier montage, lui, ne touche à rien.
 *
 * On ne passe que le SETTER d'un état (stable, sans effet de bord : ni son, ni
 * navigation) et la valeur « fermé » (`false`, ou `null` pour « aucune
 * feuille »). ⚠️ Cette valeur doit être STABLE : une primitive, ou une
 * constante de module pour un objet (`FICHE_FERMEE`, RayonsCapsules). Un objet
 * écrit en ligne serait neuf à chaque rendu, relancerait l'effet et refermerait
 * la feuille à peine ouverte.
 */
export function useFermeAuMasquage<T>(setEtat: Dispatch<SetStateAction<T>>, ferme: NoInfer<T>): void {
  const dejaMonte = useRef(false)
  useLayoutEffect(() => {
    if (!dejaMonte.current) {
      dejaMonte.current = true
      return
    }
    // Remontage = l'onglet revient après avoir été caché : l'écran repart
    // fermé, avant la première image.
    setEtat(ferme)
  }, [setEtat, ferme])
}
