import { describe, it, expect } from 'vitest'
import {
  MAX_ENVOI_OCTETS,
  MAX_FICHIER_OCTETS,
  poidsDataUrl,
  refusFichier,
  refusPiece,
} from '@/lib/coach/piece-jointe'

const fichier = (name: string, type: string, size = 1_000) => ({ name, type, size })

describe('refusFichier', () => {
  it('accepte les photos et les fichiers texte', () => {
    expect(refusFichier(fichier('cahier.jpg', 'image/jpeg'))).toBeNull()
    expect(refusFichier(fichier('tableau.png', 'image/png'))).toBeNull()
    expect(refusFichier(fichier('cours.txt', 'text/plain'))).toBeNull()
    // Certains navigateurs n'annoncent aucun type MIME : l'extension tranche.
    expect(refusFichier(fichier('notes.md', ''))).toBeNull()
  })

  it('refuse le PDF en disant quoi faire à la place', () => {
    // Un refus sec (« format non supporté ») laisse l'élève sans issue, alors
    // que la photo de la même page marche parfaitement.
    const refus = refusFichier(fichier('cours.pdf', 'application/pdf'))
    expect(refus?.erreur).toContain('photo')
  })

  it('refuse le reste', () => {
    expect(refusFichier(fichier('musique.mp3', 'audio/mpeg'))).not.toBeNull()
    expect(refusFichier(fichier('archive.zip', 'application/zip'))).not.toBeNull()
  })

  it('refuse ce qui est trop lourd', () => {
    expect(
      refusFichier(fichier('enorme.jpg', 'image/jpeg', MAX_FICHIER_OCTETS + 1)),
    ).not.toBeNull()
  })
})

describe('poidsDataUrl', () => {
  it('mesure le poids réel derrière la base64', () => {
    // 4 caractères de base64 = 3 octets : sans ce calcul, on comparerait la
    // longueur de la chaîne, soit un tiers de trop.
    expect(poidsDataUrl('data:image/jpeg;base64,' + 'A'.repeat(4_000))).toBe(3_000)
  })
})

describe('refusPiece', () => {
  it('accepte une image et un texte bien formés', () => {
    expect(refusPiece({ type: 'image', nom: 'a.jpg', data: 'data:image/jpeg;base64,AAAA' })).toBeNull()
    expect(refusPiece({ type: 'texte', nom: 'a.txt', data: 'Mon cours' })).toBeNull()
  })

  it('refuse une data URL qui n’est pas une image', () => {
    // C'est la garde côté SERVEUR : un client bricolé pourrait annoncer
    // « image » et pousser autre chose dans le corps de la requête.
    expect(
      refusPiece({ type: 'image', nom: 'a.jpg', data: 'https://exemple.fr/a.jpg' }),
    ).not.toBeNull()
    expect(refusPiece({ type: 'image', nom: 'a.jpg', data: 'data:text/html,<b>' })).not.toBeNull()
  })

  it('refuse une image trop lourde même annoncée comme légère', () => {
    const grosse =
      'data:image/jpeg;base64,' + 'A'.repeat(Math.ceil((MAX_ENVOI_OCTETS + 1_000) / 0.75))
    expect(refusPiece({ type: 'image', nom: 'a.jpg', data: grosse })).not.toBeNull()
  })

  it('refuse un texte vide et les formes inconnues', () => {
    expect(refusPiece({ type: 'texte', nom: 'a.txt', data: '   ' })).not.toBeNull()
    expect(refusPiece({ type: 'audio', nom: 'a.mp3', data: 'x' })).not.toBeNull()
    expect(refusPiece(null)).not.toBeNull()
    expect(refusPiece('coucou')).not.toBeNull()
  })
})
