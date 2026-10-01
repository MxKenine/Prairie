import { dijkstra } from './Dijkstra.ts';
import { ROUTES } from './Route.ts';
import { chercherTresor } from './Bfs.ts';

export function preparerMission() {
  const lac = dijkstra('kaamelott', 'lac', ROUTES);
  const entree = dijkstra('lac', 'labyrinthe', ROUTES);
  const retour = dijkstra('labyrinthe', 'kaamelott', ROUTES);
  const labyrinthe = chercherTresor();
  if (!lac || !entree || !retour || !labyrinthe) throw new Error('Un trajet est impossible. Vérifiez les routes et la grille.');
  return {
    aller: {chemin: [...lac.chemin, ...entree.chemin.slice(1)], cout: lac.cout + entree.cout},
    retour, labyrinthe,
    // On inverse une copie du chemin final, sans relancer BFS.
    sortie: [...labyrinthe.chemin].reverse()
  };
}
