import { NextResponse } from 'next/server'
import { assetLinks, empreintesDepuis } from '@/lib/twa'

// `/.well-known/assetlinks.json` (réécrit ici par next.config) : la preuve
// qu'attend Android pour ouvrir l'app du Play Store sans barre d'adresse.
// Voir lib/twa.ts.
export function GET() {
  const corps = assetLinks(process.env.ANDROID_PACKAGE, empreintesDepuis(process.env.ANDROID_SHA256))
  return NextResponse.json(corps, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  })
}
