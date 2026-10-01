// Le paquet JavaScript ne fournit pas de déclarations TypeScript.
declare module 'pathfinding-algorithms' {
  export class bfs {
    constructor(start: string, end: string, grid: {weight: number; isWall: boolean}[][]);
    startAlgorithm(): {found: boolean; path: string[]; exploredNodes: string[]};
  }
}
