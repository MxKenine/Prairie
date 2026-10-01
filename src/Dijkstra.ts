import type { Route } from "./Route.ts";
import { voisinsDe } from "./Voisins.ts";

export interface ResultatDijkstra {
  chemin: string[];
  cout: number;
}

export function dijkstra(
  depart: string,
  arrivee: string,
  routes: Route[]
): ResultatDijkstra | null {

  // Récupère tous les noeuds présents dans le graphe
  const noeuds = new Set<string>();

  for (const route of routes) {
    noeuds.add(route.de);
    noeuds.add(route.vers);
  }

  // Stocke la meilleure distance connue depuis le départ
  const distances = new Map<string, number>();

  // Permet de reconstruire le chemin final
  const precedent = new Map<string, string>();

  // Stocke les noeuds déjà traités
  const visites = new Set<string>();

  // Au départ, toutes les distances sont infinies
  for (const noeud of noeuds) {
    distances.set(noeud, Infinity);
  }

  // La distance du départ vers lui-même vaut 0
  distances.set(depart, 0);

  while (true) {
    let courant: string | null = null;
    let distanceMin = Infinity;

    // Cherche le noeud non visité ayant la plus petite distance connue
    for (const noeud of noeuds) {
      const distance = distances.get(noeud) ?? Infinity;

      if (!visites.has(noeud) && distance < distanceMin) {
        courant = noeud;
        distanceMin = distance;
      }
    }

    // Aucun chemin possible jusqu'à l'arrivée
    if (courant === null) {
      return null;
    }

    // On a atteint la destination
    if (courant === arrivee) {
      break;
    }

    visites.add(courant);

    // Teste tous les voisins du noeud courant
    for (const voisin of voisinsDe(courant, routes)) {

      // Calcule le coût pour atteindre ce voisin
      const nouvelleDistance =
        distanceMin + voisin.poids;

      const ancienneDistance =
        distances.get(voisin.noeud) ?? Infinity;

      // Si ce nouveau chemin est meilleur, on le garde
      if (nouvelleDistance < ancienneDistance) {
        distances.set(voisin.noeud, nouvelleDistance);

        // Mémorise d'où l'on vient pour reconstruire le chemin
        precedent.set(voisin.noeud, courant);
      }
    }
  }

  // Reconstruction du chemin en partant de l'arrivée
  const chemin: string[] = [];
  let courant = arrivee;

  while (courant !== depart) {
    chemin.unshift(courant);

    const precedentCourant = precedent.get(courant);

    if (precedentCourant === undefined) {
      return null;
    }

    courant = precedentCourant;
  }

  chemin.unshift(depart);

  return {
    chemin,
    cout: distances.get(arrivee)!
  };
}
