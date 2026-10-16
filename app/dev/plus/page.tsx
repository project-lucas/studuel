import { notFound } from 'next/navigation'
import EcranPlus from '@/components/plus/EcranPlus'
import RayonRecharges from '@/components/boutique/RayonRecharges'
import CarteFiliere from '@/components/plus/CarteFiliere'
import { etatsDesPiliers } from '@/lib/studuel-plus/etats'
import { SECONDES_PAR_GEMME } from '@/lib/studuel-plus/rente'
import { examenDe, joursAvantExamen } from '@/lib/examen/parcours'
import { FILIERES } from '@/lib/prepa-sup/catalogue'
import { toDayKey } from '@/lib/streak'

export const dynamic = 'force-dynamic'

// L'APERÇU DE STUDUEL+ — en développement seulement, sans base ni compte.
//
//   /dev/plus                    un abonné de 3e, 34 gemmes de rente prêtes
//   /dev/plus?rente=60           le coffre plein (or)
//   /dev/plus?rente=0            le coffre qui vient d'être récolté
//   /dev/plus?rente=absente      la 580 n'est pas passée
//   /dev/plus?abonne=0           le visage du gratuit (les piliers à vendre)
//   /dev/plus?classe=Tle         un autre jour J
//   /dev/plus?vue=recharges      le rayon « Recharger Marcel » de la Boutique
//                                (&date=2026-05-20 : en période d'examens)
//   /dev/plus?vue=prepa          les huit filières de la prépa du supérieur
// « Récolter » et « Ça m'intéresse » appellent les vraies actions : sans
// session, elles refusent poliment.
export default async function ApercuPlus({
  searchParams,
}: {
  searchParams: Promise<{ abonne?: string; rente?: string; classe?: string; vue?: string; date?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { abonne = '1', rente = '34', classe = '3e', vue, date } = await searchParams

  if (vue === 'recharges') {
    return (
      <div className="py-6">
        <RayonRecharges connecte={false} aujourdhuiIso={date ? new Date(`${date}T12:00:00Z`).toISOString() : new Date().toISOString()} />
      </div>
    )
  }

  if (vue === 'prepa') {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-3 p-4">
        {FILIERES.map((f, i) => (
          <CarteFiliere key={f.id} filiere={f} coche={i === 1} />
        ))}
      </div>
    )
  }

  const maintenant = new Date().getTime()
  const gemmes = Math.max(0, Math.min(60, Number(rente) || 0))
  const examen = examenDe(classe)

  return (
    <EcranPlus
      abonne={abonne !== '0'}
      rente={
        rente === 'absente'
          ? null
          : { depuisMs: maintenant - (gemmes * SECONDES_PAR_GEMME + 1_800) * 1000, maintenantMs: maintenant, total: 180 }
      }
      etatDe={etatsDesPiliers({
        abonne: abonne !== '0',
        classe,
        creditsRestants: 143,
        creditsRecharge: 50,
        examen: examen ? { nom: examen.nom, jours: joursAvantExamen(examen, toDayKey(new Date())) } : null,
        annales: 42,
      })}
    />
  )
}
