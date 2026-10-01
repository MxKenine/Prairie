import { ROUTES } from "./Route";

interface Voisin {
  noeud: string;
  poids: number;
}

export function voisinsDe(noeud: string, routes: Route[]): Voisin[] {
  const voisins: Voisin[] = [];

  for (const route of routes) {
    if (route.de === noeud) {
      voisins.push({
        noeud: route.vers,
        poids: route.poids
      });
    }

    if (route.vers === noeud) {
      voisins.push({
        noeud: route.de,
        poids: route.poids
      });
    }
  }

  return voisins;
}

console.log(voisinsDe("gue", ROUTES));