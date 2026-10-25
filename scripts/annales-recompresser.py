# -----------------------------------------------------------------------------
# RECOMPRESSER UN SUJET OFFICIEL (25/10/2026) — PyMuPDF, 150 dpi, JPEG qualité 72.
#
#   python -I scripts/annales-recompresser.py <entrée.pdf> <sortie.pdf> [--dpi 150] [--qualite 72]
#
# Les sujets du ministère embarquent souvent des scans ou des cartes en pleine
# résolution (plusieurs Mo pour quatre pages). Le script ne touche QU'AUX
# IMAGES : chaque image est ramenée à 150 dpi par rapport à la taille à
# laquelle la page l'affiche, puis ré-encodée en JPEG (qualité 72). Le texte,
# les polices, la mise en page sont reproduits tels quels — c'est la même
# recette que pour les 42 premiers sujets (docs/annales-corrigees.md § 5).
#
# `-I` : le script lit un fichier téléchargé (donnée non fiable) ; l'isolation
# évite qu'un module planté à côté soit importé à sa place.
# -----------------------------------------------------------------------------
import argparse
import os
import shutil
import sys

import pymupdf


def recompresser(source: str, sortie: str, dpi: int, qualite: int) -> tuple[int, int, int]:
    """Rend (images traitées, octets avant, octets après)."""
    doc = pymupdf.open(source)
    if not doc.is_pdf:
        raise SystemExit(f"{source} : pas un PDF")
    vus: set[int] = set()
    traitees = 0
    for page in doc:
        for info in page.get_image_info(xrefs=True):
            xref = info.get("xref") or 0
            if not xref or xref in vus:
                continue
            vus.add(xref)
            bbox = pymupdf.Rect(info["bbox"])
            largeur_cible = max(16, round(bbox.width / 72 * dpi))
            try:
                pix = pymupdf.Pixmap(doc, xref)
            except Exception:
                continue  # une image que MuPDF ne décode pas : on la laisse
            # Un JPEG n'a ni alpha ni CMYK : on aplatit en RGB (ou gris).
            if pix.n - pix.alpha >= 4:
                pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
            if pix.alpha:
                pix = pymupdf.Pixmap(pix, 0)
            if pix.width > largeur_cible:
                facteur = largeur_cible / pix.width
                pix = pymupdf.Pixmap(pix, int(pix.width * facteur), int(pix.height * facteur), None)
            jpeg = pix.tobytes("jpeg", jpg_quality=qualite)
            taille_avant = len(doc.xref_stream_raw(xref) or b"")
            # On ne remplace que si l'on gagne : une petite icône PNG reste PNG.
            if taille_avant and len(jpeg) >= taille_avant * 0.9:
                continue
            page.replace_image(xref, stream=jpeg)
            traitees += 1
    doc.save(sortie, garbage=4, deflate=True, clean=True)
    doc.close()
    # Un sujet déjà léger peut ressortir un peu plus gros du réencodage :
    # on garde alors l'original tel quel.
    if os.path.getsize(sortie) >= os.path.getsize(source):
        shutil.copyfile(source, sortie)
    return traitees, os.path.getsize(source), os.path.getsize(sortie)


def main() -> None:
    # La console Windows est en cp1252 : on parle UTF-8 quoi qu'il arrive.
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    p = argparse.ArgumentParser(description="Recompresse les images d'un sujet officiel sans toucher au texte.")
    p.add_argument("source")
    p.add_argument("sortie")
    p.add_argument("--dpi", type=int, default=150)
    p.add_argument("--qualite", type=int, default=72)
    a = p.parse_args()
    if os.path.abspath(a.source) == os.path.abspath(a.sortie):
        raise SystemExit("La sortie doit être un autre fichier que la source.")
    n, avant, apres = recompresser(a.source, a.sortie, a.dpi, a.qualite)
    print(f"{os.path.basename(a.sortie)} : {n} image(s) recompressée(s), {avant // 1024} Ko → {apres // 1024} Ko")


if __name__ == "__main__":
    sys.exit(main())
