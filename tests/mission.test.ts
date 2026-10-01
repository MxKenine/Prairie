import {test} from 'node:test';
import assert from 'node:assert/strict';
import {preparerMission} from '../src/Mission.ts';
import {chercherTresor} from '../src/Bfs.ts';
import {dijkstra} from '../src/Dijkstra.ts';
import {GRILLE,ENTREE,TRESOR} from '../src/labyrinthe.data.ts';
test('Trajets validés et Lac uniquement imposé à l’aller',()=>{
 const m=preparerMission();assert.equal(m.aller.cout,55);assert.equal(m.retour.cout,29);
 assert.deepEqual(m.aller.chemin,['kaamelott','auberge','pont','gue','lac','gue','labyrinthe']);
 assert.deepEqual(m.retour.chemin,['labyrinthe','pont','auberge','kaamelott']);
});
test('BFS : 67 pas, aucune diagonale ni mur, retour inversé',()=>{
 const m=preparerMission(), c=m.labyrinthe.chemin;
 assert.equal(c.length-1,67);assert.deepEqual(c[0],ENTREE);assert.deepEqual(c.at(-1),TRESOR);
 c.forEach((p,i)=>{assert.equal(GRILLE[p.y][p.x],0);if(i) assert.equal(Math.abs(p.x-c[i-1].x)+Math.abs(p.y-c[i-1].y),1);});
 assert.deepEqual(m.sortie,[...c].reverse());assert.equal(new Set(c.map(p=>`${p.x},${p.y}`)).size,c.length);
});
test('Cas impossibles et départ égal au but',()=>{
 assert.equal(chercherTresor([[0,1,0]],{x:0,y:0},{x:2,y:0}),null);
 assert.equal(chercherTresor([[1]],{x:0,y:0},{x:0,y:0}),null);
 assert.deepEqual(chercherTresor([[0]],{x:0,y:0},{x:0,y:0})?.chemin,[{x:0,y:0}]);
 assert.equal(dijkstra('a','c',[{de:'a',vers:'b',poids:1}]),null);
});
