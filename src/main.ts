import { preparerMission } from './Mission.ts';
import { afficherCarte, afficherLabyrinthe, lieu } from './Vues.ts';
import { ROUTES } from './Route.ts';

function element<T extends HTMLElement>(id: string): T {
  const e = document.getElementById(id);
  if (!e) throw new Error(`Élément manquant : ${id}`);
  return e as T;
}
const scene = element('scene'), logs = element('logs');
const demarrer = element<HTMLButtonElement>('demarrer'), pause = element<HTMLButtonElement>('pause');
const vitesse = element<HTMLSelectElement>('vitesse');
const titres = ['Vers l’entrée du labyrinthe','À la recherche du trésor','Le trésor sous le bras','Retour à Kaamelott'];
let mission: ReturnType<typeof preparerMission> | null = null;
let phase = 0, index = 0, energie = 0, pas = 0, actif = false, termine = false;
let frame = 0, precedent: number | null = null, progression = 0;

// L'allure est exprimée en pixels CSS par seconde pour les deux vues.
function positionCourante() {
  if (!mission) return {x:250,y:156.6675};
  const points = phase === 0 ? mission.aller.chemin : mission.retour.chemin;
  const cellules = phase === 1 ? mission.labyrinthe.chemin : mission.sortie;
  const position = (i: number) => {
    if (phase === 1 || phase === 2) return cellules[Math.min(i,cellules.length-1)];
    const l = lieu(points[Math.min(i,points.length-1)]);
    return {x:l.x*10,y:l.y*6.6667};
  };
  const a = position(index), b = position(index+1);
  return {x:a.x+(b.x-a.x)*progression,y:a.y+(b.y-a.y)*progression};
}
function longueurSegment() {
  const sauvegarde = progression;
  progression=0; const a=positionCourante(); progression=1; const b=positionCourante(); progression=sauvegarde;
  const vue = scene.querySelector('svg,canvas');
  if (!vue) return 0;
  const rect = vue.getBoundingClientRect();
  // object-fit: contain peut ajouter des marges au Canvas : mesurer le dessin réel.
  const echelle = phase === 1 || phase === 2
    ? 80*Math.min(rect.width/1680,rect.height/1200)
    : Math.min(rect.width/1000,rect.height/666.67);
  return Math.hypot(b.x-a.x,b.y-a.y)*echelle;
}
function animer(temps: number) {
  if (!actif) return;
  const secondes = precedent === null ? 0 : Math.min((temps-precedent)/1000,0.05);
  precedent=temps;
  let distance = ({'700':60,'250':120,'40':240}[vitesse.value] ?? 120)*secondes;
  // Conserver le temps restant lors du passage d'une case à la suivante.
  while (actif && distance > 0) {
    const longueur=longueurSegment(), restant=longueur*(1-progression);
    if (longueur > 0 && distance < restant) {progression+=distance/longueur;break;}
    distance-=restant;progression=0;avancer();
  }
  dessiner();
  if (actif) frame=requestAnimationFrame(animer);
}
function programmer() {precedent=null;frame=requestAnimationFrame(animer);}

function journal(message: string) {
  const li = document.createElement('li');li.textContent = message;logs.append(li);logs.scrollTop = logs.scrollHeight;
}
function dessiner() {
  element('energie').textContent = String(energie);element('pas').textContent = String(pas);
  element('titre-vue').textContent = termine ? 'Le roi est de retour !' : titres[phase];
  element('sous-titre').textContent = phase === 1 || phase === 2 ? 'DANS LE LABYRINTHE' : 'LA CARTE DU ROYAUME';
  element('indication').textContent = phase === 1 || phase === 2 ? 'Quatre directions · un pas par case.' : 'Les poids indiquent l’énergie dépensée.';
  document.querySelectorAll('[data-phase]').forEach((e,i) => {e.removeAttribute('aria-current');if (i === phase) e.setAttribute('aria-current','step');});
  if (!mission) return afficherCarte(scene,['kaamelott']);
  if (phase === 0 || phase === 3) afficherCarte(scene,(phase === 0 ? mission.aller.chemin : mission.retour.chemin).slice(0,index+1),positionCourante());
  else afficherLabyrinthe(scene,(phase === 1 ? mission.labyrinthe.chemin : mission.sortie).slice(0,index+1),phase === 2,positionCourante());
}
function avancer() {
  if (!actif || !mission) return;
  const chemin = phase === 0 ? mission.aller.chemin : phase === 1 ? mission.labyrinthe.chemin : phase === 2 ? mission.sortie : mission.retour.chemin;
  if (index < chemin.length-1) {
    index++;
    if (phase === 0 || phase === 3) {
      const ids = phase === 0 ? mission.aller.chemin : mission.retour.chemin;
      const de = ids[index-1], vers = ids[index];
      const route = ROUTES.find(r => (r.de === de && r.vers === vers) || (r.vers === de && r.de === vers));
      energie += route?.poids ?? 0;
      journal(vers === 'lac' ? 'La Dame du Lac nous attendait. Étape obligatoire validée !' : `Nous voilà à ${lieu(vers).nom}.`);
    } else pas++;
  } else if (phase < 3) {
    phase++;index=0;
    journal(phase === 1 ? 'On entre dans le labyrinthe. Arthur suit le chemin trouvé par BFS.' : phase === 2 ? 'Le trésor est à nous ! On reprend exactement le chemin à l’envers.' : 'Enfin dehors. Direction Kaamelott, sans détour imposé par le Lac.');
  } else {
    actif=false;termine=true;pause.disabled=true;element('statut').textContent='Quête accomplie';
    journal(`Mission accomplie ! ${energie} d’énergie sur la carte et ${pas} pas dans le labyrinthe.`);
  }
  dessiner();
}
demarrer.addEventListener('click',() => {
  try {
    mission=preparerMission();actif=true;demarrer.disabled=true;pause.disabled=false;
    element('statut').textContent='En route';
    journal(`C’est parti ! Aller prévu : ${mission.aller.cout} d’énergie, avec passage par le Lac.`);
    dessiner();programmer();
  } catch (erreur) {element('statut').textContent='Trajet impossible';journal(erreur instanceof Error ? erreur.message : 'Une erreur est survenue.');}
});
pause.addEventListener('click',() => {
  actif=!actif;cancelAnimationFrame(frame);pause.textContent=actif?'Pause':'Reprendre';
  element('statut').textContent=actif?'En route':'Petite pause';if(actif) programmer();
});
element('reset').addEventListener('click',reinitialiser);
function reinitialiser() {
  cancelAnimationFrame(frame);precedent=null;progression=0;mission=null;phase=0;index=0;energie=0;pas=0;actif=false;termine=false;
  demarrer.disabled=false;pause.disabled=true;pause.textContent='Pause';element('statut').textContent='Prêt au départ';
  logs.replaceChildren();journal('Arthur est à Kaamelott. Il ne manque plus que le signal du départ.');dessiner();
}
reinitialiser();
