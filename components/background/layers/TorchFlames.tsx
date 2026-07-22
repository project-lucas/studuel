/**
 * Flammes de l'Arène : halos radiaux doux qui vacillent (CSS pur, voir
 * globals.css `.abg-flame*`). Quatre foyers, calés sur le décor peint —
 * deux braseros violets au sol, deux torches dorées de part et d'autre de
 * l'escalier. Chaque flamme a sa propre durée/délai d'animation : jamais
 * synchrones, jamais robotiques.
 */
export default function TorchFlames() {
  return (
    <div className="abg-layer abg-layer--torches">
      <span className="abg-flame abg-flame--violet abg-flame--vl" />
      <span className="abg-flame abg-flame--violet abg-flame--vr" />
      <span className="abg-flame abg-flame--gold abg-flame--gl" />
      <span className="abg-flame abg-flame--gold abg-flame--gr" />
    </div>
  )
}
