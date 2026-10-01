import { ROUTES } from "./Route";
import { dijkstra } from "./Dijkstra";

const versLac = dijkstra(
  "kaamelott",
  "lac",
  ROUTES
);

console.log("Kaamelott -> Lac :", versLac);

const versLabyrinthe = dijkstra(
  "lac",
  "labyrinthe",
  ROUTES
);

console.log("Lac -> Labyrinthe :", versLabyrinthe);


const retour = dijkstra(
  "labyrinthe",
  "kaamelott",
  ROUTES
);

console.log("Retour :", retour);