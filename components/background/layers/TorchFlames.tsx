/**
 * Flammes de l'Arène : deux halos radiaux doux qui vacillent (CSS pur, voir
 * globals.css `.abg-flame*`), calés sur les DEUX VASQUES peintes au sol, de
 * part et d'autre du podium.
 *
 * Ils étaient quatre. Les deux dorés éclairaient la tête de la mascotte, sans
 * qu'aucune flamme du décor ne le justifie ; les deux violets, aux angles bas,
 * n'éclairaient rien non plus. Un halo qui ne prolonge pas une flamme DESSINÉE
 * ne se lit pas comme une lumière mais comme une tache.
 *
 * Les deux qui restent ont chacun leur durée : jamais synchrones, jamais
 * robotiques — deux feux ne battent pas la même mesure.
 */
export default function TorchFlames() {
  return (
    <div className="abg-layer abg-layer--torches">
      <span className="abg-flame abg-flame--braise abg-flame--braise-g" />
      <span className="abg-flame abg-flame--braise abg-flame--braise-d" />
    </div>
  )
}
