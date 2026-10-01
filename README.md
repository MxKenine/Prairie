# La Prairie — version d’intégration proposée

HTML pour la structure, CSS pour le style, TypeScript pour les interactions.
Cette version reprend les données et Dijkstra de William, corrige les imports de types et intègre la bibliothèque BFS du guide de Faiza. Elle n’a pas été poussée sur GitHub.

## Démarrer

Installer Node.js 24 LTS, ouvrir ce dossier dans VS Code, puis dans le terminal :

```sh
npm install
npm run dev
```

Ouvrir http://localhost:5173. Le serveur reconstruit le JavaScript quand le TypeScript change ; actualiser la page après une modification.

```sh
npm run build
npm test
```

Le build vérifie les types puis produit `dist/bundle.js`. Les tests utilisent Node 24. Pour héberger la version compilée, conserver `index.html`, `styles.css`, `dist/` et `public/` ensemble.

## Structure

```text
Prairie/
├── index.html               # Page complète
├── styles.css               # Style et adaptation mobile
├── package.json
├── package-lock.json        # Versions exactes des dépendances
├── tsconfig.json
├── .gitignore
├── public/
│   ├── carte.png
│   └── labyrinthe.png
├── scripts/dev.mjs          # Serveur local esbuild
├── src/
│   ├── main.ts              # Démarrer, pause, reset, étapes et compteurs
│   ├── Vues.ts              # Carte SVG et labyrinthe Canvas
│   ├── Mission.ts           # Assemblage des trajets
│   ├── Lieux.ts             # Positions de William en pourcentages
│   ├── Route.ts             # Routes non orientées et poids d’énergie
│   ├── Voisins.ts           # Voisinage du graphe
│   ├── Dijkstra.ts          # Algorithme de William, imports corrigés
│   ├── Bfs.ts               # Adaptateur de la bibliothèque utilisée par Faiza
│   ├── labyrinthe.data.ts   # Grille officielle 21 × 15
│   └── pathfinding-algorithms.d.ts # Types du paquet JavaScript
└── tests/mission.test.ts
```

## Reprendre le dépôt existant

Sur votre branche de travail, reprendre cette structure en remplaçant les cinq fichiers racine de William par leurs versions dans `src/` (ne pas conserver deux versions actives). Conserver les éventuels autres travaux de l’équipe. Comparer les changements avant le commit. Ajouter les sources, images, configuration et package-lock ; `.gitignore` exclut `node_modules` et `dist`. Le ZIP est un dossier autonome de proposition, pas une synchronisation du dépôt : intégrer les changements récents des autres membres avant le push.

## Règles intégrées

- Aller : Kaamelott → Auberge → Pont → Gué → Lac → Gué → Labyrinthe, coût 55. Le passage répété au Gué est normal avec les routes actuelles.
- Retour carte : Labyrinthe → Pont → Auberge → Kaamelott, coût 29.
- Labyrinthe : grille[y][x], 0 couloir, 1 mur, origine en haut à gauche.
- Entrée (x=1,y=0), trésor unique (x=19,y=13). Identifiants BFS : `0_1` et `13_19`.
- BFS `pathfinding-algorithms` 1.0.11 : 4 directions, poids uniformes, 67 déplacements. L’ordre d’exploration est disponible dans `explores` ; l’affichage anime uniquement le chemin final.
- Sortie : copie inversée du chemin trouvé, 67 déplacements supplémentaires.
- Énergie de la carte (84 au total) et pas du labyrinthe (134) restent deux mesures distinctes.
- Le décor du labyrinthe mesure 1680 × 1200, chaque case correspond à 80 pixels. Le Canvas est limité à 60 % de la hauteur de la fenêtre : interprétation proposée du « 60 % », ajustable dans CSS.
- Le pion glisse en continu entre les lieux et les cases, à la même vitesse visuelle : 60, 120 ou 240 pixels CSS par seconde selon l’allure. Les distances tiennent compte de la taille réelle du dessin affiché. La pause conserve la position intermédiaire et la reprise continue sans saut. L’animation des cases explorées reste une amélioration possible.
- Les polices Google sont facultatives : des polices système prennent le relais hors connexion.

## Répartition suggérée

William + Jules : index.html, styles.css, Vues.ts et images.
Quentin + Faiza : Dijkstra.ts, Bfs.ts, Mission.ts et tests.
Tous : vérifier une mission complète avant le push.

## Vérification

`npm run build` et `npm test` : compilation stricte, trajets carte, labyrinthe sans murs ni diagonales, cas impossibles, départ égal à l’arrivée pour BFS et retour inversé.
