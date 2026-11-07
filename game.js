import * as THREE from 'three';

const canvas = document.querySelector('#world');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#a9c49a');
scene.fog = new THREE.FogExp2('#a9c49a', 0.0075);
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, .1, 180);
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

scene.add(new THREE.HemisphereLight('#e9f4d5','#647454',2.05));
const sun = new THREE.DirectionalLight('#ffe3a2',2.35); sun.position.set(-28,40,22); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.left=-46;sun.shadow.camera.right=46;sun.shadow.camera.top=46;sun.shadow.camera.bottom=-46;sun.shadow.bias=-.0003;scene.add(sun);
const mat=(color,roughness=.9)=>new THREE.MeshStandardMaterial({color,roughness});
const groundMat=mat('#789766');
const groundGeo=new THREE.PlaneGeometry(190,190,58,58);groundGeo.rotateX(-Math.PI/2);
const pos=groundGeo.attributes.position;
for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);let y=Math.sin(x*.15+z*.08)*.22+Math.cos(z*.2)*.14; y+=Math.max(0,Math.abs(x)-43)*.09;pos.setY(i,y)}groundGeo.computeVertexNormals();
const ground=new THREE.Mesh(groundGeo,groundMat);ground.receiveShadow=true;scene.add(ground);
const grassMats=['#91a970','#859d67','#a4b77a','#718e61','#b2b77e'].map(c=>mat(c));
const pathMat=mat('#baaa7a');pathMat.side=THREE.DoubleSide;
function path(points,width){const verts=[];for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),nx=dz/len*width/2,nz=-dx/len*width/2;verts.push(a[0]+nx,.18,a[1]+nz,a[0]-nx,.18,a[1]-nz,b[0]+nx,.18,b[1]+nz,b[0]-nx,.18,b[1]-nz)}const indices=[];for(let i=0;i<points.length-1;i++){const n=i*4;indices.push(n,n+1,n+2,n+1,n+3,n+2)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setIndex(indices);g.computeVertexNormals();const m=new THREE.Mesh(g,pathMat);m.receiveShadow=true;scene.add(m)}
path([[-2,17],[-1,10],[0,2],[4,-5],[4,-13],[1,-19],[-5,-25]],3.8);
path([[-1,1],[-8,-2],[-14,-5],[-20,-9]],3.1);path([[2,-6],[8,-13],[13,-20],[15,-29]],3);
const rand=(a,b)=>a+Math.random()*(b-a);
function addMesh(geo,material,parent,x,y,z,sx=1,sy=1,sz=1){const o=new THREE.Mesh(geo,material);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
// Soft rolling flower patches
for(let i=0;i<58;i++){const x=rand(-36,36),z=rand(-37,31);if(Math.abs(x)<4&&z<4&&z>-20)continue;const patch=addMesh(new THREE.CircleGeometry(rand(1.1,2.7),18),grassMats[Math.floor(Math.random()*grassMats.length)],scene,x,.035,z,1,.65,1);patch.rotation.x=-Math.PI/2;patch.castShadow=false}
// Village and academy landmarks
function cottage(x,z,scale=1,roof='#7d5946',wall='#e2d1a2'){
 const g=new THREE.Group();scene.add(g);g.position.set(x,0,z);g.scale.setScalar(scale);
 addMesh(new THREE.BoxGeometry(5.2,3.8,4.6),mat(wall),g,0,1.9,0);
 const roofGeo=new THREE.ConeGeometry(4.3,2.8,4);const r=addMesh(roofGeo,mat(roof),g,0,5,0,1,1,1);r.rotation.y=Math.PI/4;
 addMesh(new THREE.BoxGeometry(1.1,2.3,.16),mat('#694c36'),g,-.5,1.15,2.35);
 for(const wx of [-1.65,1.55]){addMesh(new THREE.BoxGeometry(.78,.9,.13),mat('#739b9a'),g,wx,2.45,2.36);addMesh(new THREE.BoxGeometry(.12,1,.18),mat('#f2ddb0'),g,wx,2.45,2.45);addMesh(new THREE.BoxGeometry(.86,.12,.18),mat('#f2ddb0'),g,wx,2.45,2.45)}
 addMesh(new THREE.CylinderGeometry(.14,.14,.35,8),mat('#a8895a'),g,.8,4.1,-.8);return g;
}
cottage(-18,-10,1.05,'#785349','#e5d8b2');cottage(-23,-14,.72,'#665b53','#d5d4ac');cottage(17,-9,.82,'#735447','#d4c597');
// Academy: welcoming tower and wings
const hall=new THREE.Group();scene.add(hall);hall.position.set(13,0,-31);
addMesh(new THREE.BoxGeometry(13,8,7),mat('#b9ae91'),hall,0,4,0);
addMesh(new THREE.BoxGeometry(6.7,11,6.7),mat('#c5b99b'),hall,-1.7,5.5,-4.5);
const towerRoof=addMesh(new THREE.ConeGeometry(4.8,4.8,5),mat('#554d66'),hall,-1.7,13.4,-4.5);towerRoof.rotation.y=.35;
addMesh(new THREE.ConeGeometry(3.8,3.5,5),mat('#65556f'),hall,0,9.5,0);
addMesh(new THREE.BoxGeometry(1.5,3.4,.15),mat('#564d43'),hall,0,1.7,3.57);
for(let y of [3.7,6.2,8.7]){addMesh(new THREE.BoxGeometry(.65,1.1,.12),mat('#94b7b2'),hall,-1.7,y,-1.03);}
// Stone lanterns at the path
const stone=mat('#aea88a'), lanternGlow=new THREE.MeshStandardMaterial({color:'#ffe79a',emissive:'#ffce68',emissiveIntensity:1.6});
for(const [x,z] of [[-2,7],[1,-10],[3,-19],[-10,-4],[9,-16]]){const l=new THREE.Group();scene.add(l);l.position.set(x,0,z);addMesh(new THREE.CylinderGeometry(.34,.48,1.4,6),stone,l,0,.7,0);addMesh(new THREE.BoxGeometry(.92,.17,.92),stone,l,0,1.4,0);addMesh(new THREE.BoxGeometry(.52,.56,.52),lanternGlow,l,0,1.78,0);addMesh(new THREE.ConeGeometry(.68,.35,4),stone,l,0,2.24,0)}
// Enchanted, varied trees
const trunkMat=mat('#70553c');const leafMats=['#627e59','#739061','#829a65','#526f59'].map(c=>mat(c));
function tree(x,z,size=1,kind=0){const t=new THREE.Group();scene.add(t);t.position.set(x,0,z);t.scale.setScalar(size);addMesh(new THREE.CylinderGeometry(.22,.38,3.4,7),trunkMat,t,0,1.7,0);const lm=leafMats[Math.floor(Math.random()*leafMats.length)];if(kind===0){for(let i=0;i<3;i++)addMesh(new THREE.IcosahedronGeometry(1.8-i*.15,1),lm,t,rand(-.4,.4),3.3+i*1.1,rand(-.3,.3),1.1,1,.95)}else{for(let i=0;i<3;i++){const b=addMesh(new THREE.ConeGeometry(1.5-i*.22,2.6,7),lm,t,0,3.2+i*1.5,0);b.rotation.y=.3}}}
for(const [x,z,s,k] of [[-29,-3,1.25,0],[-31,-14,1.4,0],[-27,5,.9,1],[-13,-22,.95,0],[-7,-31,1.25,0],[4,-34,.9,1],[25,-22,1.4,0],[27,-5,1,1],[25,8,1.35,0],[8,11,.85,0],[-14,12,1.2,1],[-34,-26,1.5,1],[33,-31,1.4,0],[31,12,1.6,1],[-36,16,1.25,0]])tree(x,z,s,k);
// tiny flowers dot the meadows
const flowerColors=['#f5d992','#eab8b7','#d8c6ec','#f2e9cf'];
for(let i=0;i<170;i++){const x=rand(-35,35),z=rand(-33,24);if(Math.abs(x)<5&&z<7&&z>-20)continue;const flower=addMesh(new THREE.SphereGeometry(.09,6,5),mat(flowerColors[i%flowerColors.length]),scene,x,rand(.16,.3),z,1,1.6,1);flower.castShadow=false}
// Player model
const player=new THREE.Group();scene.add(player);player.position.set(0,0,8);
const playerBody=new THREE.Group();player.add(playerBody);
const robe=mat('#554f7c'), robeLight=mat('#766e9d'), skin=mat('#e6bb91'), gold=mat('#ddc071'), dark=mat('#383445');
addMesh(new THREE.ConeGeometry(.72,1.9,8),robe,playerBody,0,1.05,0);addMesh(new THREE.SphereGeometry(.4,12,10),skin,playerBody,0,2.2,0);
addMesh(new THREE.ConeGeometry(.72,.95,8),robeLight,playerBody,0,2.95,0);addMesh(new THREE.ConeGeometry(.68,.35,8),gold,playerBody,0,2.48,0);addMesh(new THREE.ConeGeometry(.31,1,8),robe,playerBody,0,3.55,0);
addMesh(new THREE.BoxGeometry(.15,.55,.09),gold,playerBody,.32,1.4,.25); // wand glint
// A hovering, friendly moth follows the player
const moth=new THREE.Group();player.add(moth);moth.position.set(.9,2.5,.4);const mothMat=new THREE.MeshStandardMaterial({color:'#fff1ad',emissive:'#f8d575',emissiveIntensity:1.1});addMesh(new THREE.SphereGeometry(.14,8,8),mothMat,moth,0,0,0);addMesh(new THREE.SphereGeometry(.17,8,6),mat('#faf0cb'),moth,-.16,.06,0,.65,1,.25);addMesh(new THREE.SphereGeometry(.17,8,6),mat('#faf0cb'),moth,.16,.06,0,.65,1,.25);

const stars=[];const starGeo=new THREE.OctahedronGeometry(.28,0),starMat=new THREE.MeshStandardMaterial({color:'#fff1a4',emissive:'#ffdc68',emissiveIntensity:2});
for(const [x,z] of [[-5,1],[3,-1],[-8,-10],[6,-17],[-2,-21],[10,-5],[19,-22]]){const s=new THREE.Mesh(starGeo,starMat);s.position.set(x,.85,z);s.castShadow=true;scene.add(s);stars.push({mesh:s,base:s.position.y,taken:false})}

const npcDefs=[
 {id:'pip',name:'Pip',role:'BRIDGE KEEPER',emoji:'🐇',x:4,z:-13,color:'#d4b28b',coat:'#a97457',kind:'rabbit',bond:0,place:'THE OLD FOOTBRIDGE'},
 {id:'rowan',name:'Rowan',role:'WILLOWMEAD GARDENER',emoji:'🦊',x:-14,z:-5,color:'#cb8b5b',coat:'#f2ead2',kind:'fox',bond:0,place:'WILLOWMEAD COTTAGES'},
 {id:'bramble',name:'Professor Bramble',role:'KEEPER OF THISTLEWICK HALL',emoji:'🦉',x:10,z:-25,color:'#b69468',coat:'#e0d3b5',kind:'owl',bond:0,place:'THISTLEWICK HALL'}
];
const npcMeshes=[];
for(const d of npcDefs){const root=new THREE.Group();scene.add(root);root.position.set(d.x,0,d.z);d.root=root;
 const body=addMesh(new THREE.SphereGeometry(.58,12,10),mat(d.color),root,0,.82,0,1,.95,.8);body.castShadow=true;
 addMesh(new THREE.SphereGeometry(.38,12,10),mat(d.color),root,0,1.55,0,.95,1, .9);
 // ears and friendly feature silhouettes
 if(d.kind==='rabbit'){for(const x of [-.22,.22])addMesh(new THREE.CapsuleGeometry(.11,.58,4,7),mat(d.color),root,x,2.2,0,.8,1,1)}
 if(d.kind==='fox'){const tail=addMesh(new THREE.ConeGeometry(.29,.92,9),mat(d.color),root,-.62,.75,-.08);tail.rotation.z=Math.PI/2;addMesh(new THREE.SphereGeometry(.22,8,8),mat(d.coat),root,-1.02,.74,-.08)}
 if(d.kind==='owl'){for(const x of [-.3,.3])addMesh(new THREE.ConeGeometry(.18,.38,5),mat(d.color),root,x,2,0);addMesh(new THREE.SphereGeometry(.13,10,8),mat('#e8d486'),root,-.16,1.6,.33);addMesh(new THREE.SphereGeometry(.13,10,8),mat('#e8d486'),root,.16,1.6,.33)}
 addMesh(new THREE.SphereGeometry(.055,8,8),mat('#3d382e'),root,-.12,1.57,.35);addMesh(new THREE.SphereGeometry(.055,8,8),mat('#3d382e'),root,.12,1.57,.35);
 // scarves give the villagers a warm, readable silhouette
 const scarf=addMesh(new THREE.TorusGeometry(.36,.09,7,14),mat(d.id==='pip'?'#d8a17b':d.id==='rowan'?'#789372':'#8278a2'),root,0,1.24,0);scarf.rotation.x=Math.PI/2;
 const marker=new THREE.Group();root.add(marker);marker.position.y=2.7;const gem=addMesh(new THREE.OctahedronGeometry(.16),mat('#f4d780'),marker,0,0,0);gem.material.emissive=new THREE.Color('#e6bd4b');gem.material.emissiveIntensity=.7;d.marker=marker;
 npcMeshes.push(root);
}

const state={petals:0,gathered:[],delivered:false,rep:{hearth:18,academy:12,wilds:24},visited:{},choiceCount:0};
try{const saved=JSON.parse(localStorage.getItem('thistlewick-save'));if(saved){Object.assign(state,saved);state.rep=Object.assign({hearth:18,academy:12,wilds:24},saved.rep);state.gathered=saved.gathered||[];}}catch{}
const ui={hint:document.querySelector('#hint'),hintText:document.querySelector('#hintText'),dialogue:document.querySelector('#dialogueWrap'),map:document.querySelector('#mapPanel'),toast:document.querySelector('#toast')};
function persist(){localStorage.setItem('thistlewick-save',JSON.stringify(state))}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function updateHUD(){document.querySelector('#questBar').style.width=`${state.delivered?100:Math.min(100,state.petals/3*100)}%`;document.querySelector('#questCount').textContent=state.delivered?'DONE':`${state.petals} / 3`;document.querySelector('#questTitle').textContent=state.delivered?'A lantern for every friend':'A little light goes a long way';document.querySelector('#questCopy').textContent=state.delivered?'You brought a little starlight to Willowmead. The whole village feels warmer.':'Gather 3 moonpetals for Pip near the old footbridge.';document.querySelector('#questReward').textContent=state.delivered?'Pip’s bond + a brighter village':'A friend’s first impression';for(const key of ['hearth','academy','wilds']){document.querySelector('#rep'+key[0].toUpperCase()+key.slice(1)).style.width=state.rep[key]+'%';document.querySelector('#rep'+key[0].toUpperCase()+key.slice(1)+'Num').textContent=state.rep[key]}for(const d of npcDefs){d.bond=state.visited[d.id]||0;d.marker.visible=!state.visited[d.id]||d.bond<3}}
function toast(msg){ui.toast.textContent=msg;ui.toast.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>ui.toast.classList.remove('show'),2300)}
function addRep(key,amount){const old=state.rep[key];state.rep[key]=clamp(old+amount,0,100);if(Math.floor(old/25)<Math.floor(state.rep[key]/25))toast(`${key==='hearth'?'Hearthfolk':key==='academy'?'Academy':'Wilds'} reputation grew!`)}
function nearest(){let result=null,dist=Infinity;for(const d of npcDefs){const nd=Math.hypot(player.position.x-d.x,player.position.z-d.z);if(nd<dist){dist=nd;result={type:'npc',data:d,dist:nd}}}for(const s of stars){if(s.taken)continue;const nd=Math.hypot(player.position.x-s.mesh.position.x,player.position.z-s.mesh.position.z);if(nd<dist){dist=nd;result={type:'star',data:s,dist:nd}}}return result}
function collect(s){if(s.taken)return;s.taken=true;s.mesh.visible=false;state.petals++;state.gathered.push(stars.indexOf(s));addRep('wilds',1);persist();updateHUD();toast(`Moonpetal gathered · ${state.petals} / 3`);if(state.petals===3)toast('You found all the moonpetals. Pip is waiting!')}

function openDialogue(d){ui.dialogue.classList.add('open');document.querySelector('#portrait').textContent=d.emoji;document.querySelector('#dialogueName').textContent=d.name;document.querySelector('#dialogueRole').textContent=`${d.role} · BOND ${d.bond}`;const text=document.querySelector('#dialogueText'),choices=document.querySelector('#choices');choices.innerHTML='';
 let intro=d.id==='pip'?(state.delivered?'The bridge is glowing again. Honestly, I think it knows you now.':'Those moonpetals hold the last light of sunset. Could you bring me three? I want the footbridge to feel like a welcome, not a warning.') : d.id==='rowan'?'Well, look who wandered off the path. The wilds are gentler when you take the time to notice them.': 'A new face at the edge of an old story. Thistlewick has a way of remembering the choices people make.';
 if(d.id==='pip'&&state.petals>=3&&!state.delivered)intro='You found them! The whole path is holding its breath. Shall we give the bridge its light?';if(d.id==='pip'&&state.petals<3&&!state.delivered)intro=`Those moonpetals hold the last light of sunset. Could you bring me three? I want the footbridge to feel like a welcome, not a warning. (${state.petals}/3 gathered)`;
 text.textContent=intro;
 const options=d.id==='pip'?(state.petals>=3&&!state.delivered?[{label:'Light the bridge together',note:'Pip bond +2 · Hearthfolk +12',effects:{bond:2,hearth:12},finish:true},{label:'Keep one petal for your journal',note:'Wilds +4 · Pip bond +1',effects:{bond:1,wilds:4},finish:true}]:[{label:'“Tell me about the lanterns.”',note:'Pip bond +1 · Hearthfolk +3',effects:{bond:1,hearth:3}},{label:'“I’ll help the whole village.”',note:'Hearthfolk +5 · Wilds +2',effects:{bond:1,hearth:5,wilds:2}}]):d.id==='rowan'?[{label:'“Show me what is blooming.”',note:'Wilds +5 · Rowan bond +1',effects:{bond:1,wilds:5}},{label:'“I brought a little quiet with me.”',note:'Hearthfolk +3 · Rowan bond +1',effects:{bond:1,hearth:3}}]:[{label:'“I want to learn with care.”',note:'Academy +6 · Bramble bond +1',effects:{bond:1,academy:6}},{label:'“Knowledge should travel freely.”',note:'Wilds +4 · Academy +2',effects:{bond:1,wilds:4,academy:2}}];
 for(const op of options){const btn=document.createElement('button');btn.className='choice';btn.innerHTML=`${op.label}<em>${op.note}</em>`;btn.onclick=()=>{const before=d.bond;d.bond+=op.effects.bond||0;state.visited[d.id]=d.bond;for(const key of ['hearth','academy','wilds'])if(op.effects[key])addRep(key,op.effects[key]);if(op.finish){state.delivered=true;toast(op.label.includes('Keep')?'The village understands your choice.':'The bridge blooms with starlight!')}else{const response=d.id==='pip'?'Pip smiles, and the little lanterns answer with a soft gold shimmer.':d.id==='rowan'?'Rowan gives you a knowing nod. A few new flowers seem to open nearby.':'Professor Bramble’s eyes brighten. “Good. Magic is a promise, not a shortcut.”';text.textContent=response;}
 if(state.choiceCount===0&&d.id==='rowan'){// A visible, lasting world response to your first choice
 scene.fog.color.set(state.rep.wilds>=28?'#b8c99a':'#a9c49a');}
 state.choiceCount++;persist();updateHUD();document.querySelector('#dialogueRole').textContent=`${d.role} · BOND ${d.bond}`;choices.innerHTML='';const done=document.createElement('button');done.className='choice';done.textContent=op.finish?'“That felt right.”':'“I’ll remember that.”';done.onclick=closeDialogue;choices.appendChild(done);};choices.appendChild(btn)}
}
function closeDialogue(){ui.dialogue.classList.remove('open')}
function interact(){if(ui.dialogue.classList.contains('open'))return closeDialogue();const n=nearest();if(!n||n.dist>3.1)return;if(n.type==='star'){collect(n.data);return}openDialogue(n.data)}

// Keyboard and touch: the same small, forgiving movement model works on phones and desktop.
const keys={};window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='e'||e.key===' ')interact();if(e.key==='Escape'){closeDialogue();ui.map.classList.remove('open')}});window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
let joy={x:0,y:0,active:false};const joyEl=document.querySelector('#joystick'),knob=document.querySelector('#joyKnob');
function joyMove(e){if(!joy.active)return;const r=joyEl.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,len=Math.hypot(dx,dy),max=34,k=Math.min(1,max/(len||1));joy.x=dx*k/max;joy.y=dy*k/max;knob.style.transform=`translate(calc(-50% + ${dx*k}px),calc(-50% + ${dy*k}px))`}
joyEl.addEventListener('pointerdown',e=>{joy.active=true;joyEl.setPointerCapture(e.pointerId);joyMove(e)});joyEl.addEventListener('pointermove',joyMove);function joyEnd(){joy.active=false;joy.x=joy.y=0;knob.style.transform='translate(-50%,-50%)'}joyEl.addEventListener('pointerup',joyEnd);joyEl.addEventListener('pointercancel',joyEnd);document.querySelector('#actionButton').addEventListener('pointerdown',e=>{e.preventDefault();interact()});

// UI controls
const rep=document.querySelector('.reputation');document.querySelector('#repToggle').onclick=()=>rep.classList.toggle('collapsed');
document.querySelector('#mapToggle').onclick=()=>ui.map.classList.toggle('open');document.querySelector('#closeMap').onclick=()=>ui.map.classList.remove('open');document.querySelector('#dialogueClose').onclick=closeDialogue;
ui.map.addEventListener('pointerdown',e=>{if(e.target===ui.map)ui.map.classList.remove('open')});

const clock=new THREE.Clock();let nearestTarget=null;
const camTarget=new THREE.Vector3(),camPos=new THREE.Vector3();
function frame(){requestAnimationFrame(frame);const dt=Math.min(.04,clock.getDelta()),time=clock.elapsedTime;
 let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+joy.x;
 let dz=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)+joy.y;
 const len=Math.hypot(dx,dz);if(len>.05&&!ui.dialogue.classList.contains('open')){dx/=Math.max(1,len);dz/=Math.max(1,len);const speed=(keys.shift?8:5.1);player.position.x=clamp(player.position.x+dx*speed*dt,-39,39);player.position.z=clamp(player.position.z+dz*speed*dt,-39,26);player.rotation.y=Math.atan2(dx,dz);playerBody.position.y=Math.abs(Math.sin(time*10))*.07;}
 else playerBody.position.y+=(0-playerBody.position.y)*Math.min(1,dt*8);
 moth.position.y=2.5+Math.sin(time*3)*.14;moth.rotation.z=Math.sin(time*6)*.18;
 for(let i=0;i<stars.length;i++){const s=stars[i];if(!s.taken){s.mesh.rotation.y+=dt*1.1;s.mesh.position.y=s.base+Math.sin(time*2.2+i)*.16}}
 for(const d of npcDefs){d.root.position.y=Math.sin(time*2+d.x)*.04;d.marker.rotation.y=time*.8;d.marker.position.y=2.7+Math.sin(time*2.5+d.z)*.13;if(Math.hypot(player.position.x-d.x,player.position.z-d.z)<5)d.root.rotation.y=Math.atan2(player.position.x-d.x,player.position.z-d.z)}
 const near=nearest();if(near&&near.dist<3.1){ui.hint.classList.add('visible');ui.hintText.textContent=near.type==='star'?'Gather moonpetal':`Speak with ${near.data.name}`}else ui.hint.classList.remove('visible');
 const targetYaw=player.rotation.y;camTarget.set(player.position.x,1.3,player.position.z);camPos.set(player.position.x+Math.sin(targetYaw)*.35,player.position.y+11.5,player.position.z+19);camera.position.lerp(camPos,1-Math.exp(-dt*3));camera.lookAt(camTarget);
 // Warm sunlight shifts toward the violet edge of evening without obscuring play.
 const evening=Math.max(0,Math.sin(time*.035-.6));sun.color.setHSL(.105-evening*.035,.55,.72);renderer.render(scene,camera);
}
updateHUD();
// Resume the quest from a save without restoring already gathered objects incorrectly.
if(state.gathered.length){for(const i of state.gathered){if(stars[i]){stars[i].taken=true;stars[i].mesh.visible=false}}}
frame();setTimeout(()=>document.querySelector('#loading').classList.add('done'),650);
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.8))});
