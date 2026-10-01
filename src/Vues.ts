import { LIEUX } from './Lieux.ts';
import { ROUTES } from './Route.ts';
import { GRILLE, ENTREE, TRESOR, type Position } from './labyrinthe.data.ts';

const fondLabyrinthe = new Image();
fondLabyrinthe.src = 'public/labyrinthe.png';
export const lieu = (id: string) => {
  const trouve = LIEUX.find(l => l.id === id);
  if (!trouve) throw new Error(`Lieu inconnu : ${id}`);
  return trouve;
};
const point = (id: string) => { const l = lieu(id); return `${l.x * 10},${l.y * 6.6667}`; };

export function afficherCarte(scene: HTMLElement, chemin: string[], position?: Position) {
  const courant = lieu(chemin.at(-1) ?? 'kaamelott');
  const p = position ?? {x: courant.x*10, y: courant.y*6.6667};
  if (!scene.querySelector('svg')) scene.innerHTML = `<svg viewBox="0 0 1000 666.67" role="img" aria-label="Carte du royaume">
    <image href="public/carte.png" width="1000" height="666.67"/>
    ${ROUTES.map(r => {const a = lieu(r.de), b = lieu(r.vers);return `<line class="route" x1="${a.x*10}" y1="${a.y*6.6667}" x2="${b.x*10}" y2="${b.y*6.6667}"/><text class="poids" x="${(a.x+b.x)*5}" y="${(a.y+b.y)*3.33335}" text-anchor="middle">${r.poids}</text>`;}).join('')}
    <polyline class="trace" points="${chemin.map(point).join(' ')}"/>
    ${LIEUX.map(l => `<circle class="lieu" cx="${l.x*10}" cy="${l.y*6.6667}" r="6"><title>${l.nom}</title></circle><text class="etiquette" x="${l.x*10}" y="${l.y*6.6667+25}" text-anchor="middle">${l.nom}</text>`).join('')}
    <g id="pion"><circle r="12" fill="#ffd566" stroke="#172b23" stroke-width="4"/>
    <text y="-18" text-anchor="middle" font-size="25">♛</text></g>
  </svg>`;
  scene.querySelector('#pion')!.setAttribute('transform',`translate(${p.x} ${p.y})`);
  scene.querySelector('.trace')!.setAttribute('points',[...chemin.map(point),`${p.x},${p.y}`].join(' '));
}

export function afficherLabyrinthe(scene: HTMLElement, chemin: Position[], tresorPris: boolean, positionAnimee?: Position) {
  let canvas = scene.querySelector('canvas');
  if (!canvas) {
    scene.replaceChildren();
    canvas = document.createElement('canvas');
    canvas.width = 1680; canvas.height = 1200;
    canvas.setAttribute('role','img');
    scene.append(canvas);
  }
  const caseActuelle = chemin.at(-1) ?? ENTREE;
  const position = positionAnimee ?? caseActuelle;
  canvas.setAttribute('aria-label',`Labyrinthe : Arthur en colonne ${caseActuelle.x}, ligne ${caseActuelle.y}. ${tresorPris ? 'Trésor récupéré.' : 'Trésor en colonne 19, ligne 13.'}`);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas indisponible dans ce navigateur.');
  // Même repère pour le décor et les données : 21 × 15 cellules de 80 pixels.
  GRILLE.forEach((ligne,y) => ligne.forEach((mur,x) => {
    ctx.fillStyle = mur ? '#293d35' : '#baa27a';
    ctx.fillRect(x*80,y*80,80,80);
  }));
  if (fondLabyrinthe.complete && fondLabyrinthe.naturalWidth) ctx.drawImage(fondLabyrinthe,0,0,1680,1200);
  ctx.beginPath(); ctx.lineWidth = 12; ctx.lineJoin = 'round'; ctx.strokeStyle = '#ffe69b';
  chemin.forEach((p,i) => i === 0 ? ctx.moveTo(p.x*80+40,p.y*80+40) : ctx.lineTo(p.x*80+40,p.y*80+40));
  ctx.lineTo(position.x*80+40,position.y*80+40); ctx.stroke();
  ctx.font = 'bold 40px sans-serif'; ctx.textAlign = 'center';ctx.textBaseline = 'middle';
  ctx.fillStyle='#163c2b';ctx.fillText('E',ENTREE.x*80+40,ENTREE.y*80+40);
  if (!tresorPris) {ctx.fillStyle='#ffe26f';ctx.fillRect(TRESOR.x*80+15,TRESOR.y*80+22,50,36);ctx.fillStyle='#5c3715';ctx.fillText('C',TRESOR.x*80+40,TRESOR.y*80+40);}
  ctx.beginPath();ctx.arc(position.x*80+40,position.y*80+40,25,0,Math.PI*2);ctx.fillStyle='#ffe26f';ctx.fill();ctx.strokeStyle='#152c21';ctx.lineWidth=5;ctx.stroke();ctx.fillStyle='#172b23';ctx.fillText('♛',position.x*80+40,position.y*80+40);
}
