interface Route {
  de: string;
  vers: string;
  poids: number;
}



export const ROUTES: Route[] = [
  {
    de: "kaamelott",
    vers: "auberge",
    poids: 8
  },
  {
    de: "kaamelott",
    vers: "broceliande",
    poids: 14
  },
  {
    de: "auberge",
    vers: "broceliande",
    poids: 4
  },
  {
    de: "auberge",
    vers: "carmelide",
    poids: 10
  },
  {
    de: "auberge",
    vers: "pont",
    poids: 12
  },

  {
    de: "carmelide",
    vers: "col",
    poids: 7
  },
  {
    de: "broceliande",
    vers: "pont",
    poids: 11
  },
  {
    de: "lac",
    vers: "marais",
    poids: 18
  },
  {
    de: "lac",
    vers: "gue",
    poids: 9
  },
  {
    de: "pont",
    vers: "gue",
    poids: 6
  },
  {
    de: "gue",
    vers: "labyrinthe",
    poids: 11
  },
  {
    de: "pont",
    vers: "labyrinthe",
    poids: 9
  },
  {
    de:"marais",
    vers:"labyrinthe",
    poids: 15
  }
];

