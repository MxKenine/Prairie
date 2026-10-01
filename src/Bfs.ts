import { bfs } from 'pathfinding-algorithms';
import { GRILLE, ENTREE, TRESOR, type Position } from './labyrinthe.data.ts';

// Adaptation du guide de Faiza : identifiant « ligne_colonne », donc y_x.
export function chercherTresor(grille = GRILLE, debut = ENTREE, fin = TRESOR) {
  const libre = (p: Position) => grille[p.y]?.[p.x] === 0;
  if (!libre(debut) || !libre(fin)) return null;
  const cellules = grille.map(ligne => ligne.map(v => ({weight: 1, isWall: v !== 0})));
  const resultat = new bfs(`${debut.y}_${debut.x}`, `${fin.y}_${fin.x}`, cellules).startAlgorithm();
  if (!resultat.found) return null;
  const convertir = (id: string): Position => {
    const [y, x] = id.split('_').map(Number);
    return {x, y};
  };
  return {chemin: resultat.path.map(convertir), explores: resultat.exploredNodes.map(convertir)};
}
