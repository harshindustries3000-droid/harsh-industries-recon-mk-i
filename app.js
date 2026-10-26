import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
const $=id=>document.getElementById(id), logBox=$('log');
function log(s){let d=document.createElement('div');d.className='logline';d.textContent=new Date().toLocaleTimeString()+' · '+s;logBox.prepend(d)}
// Prefer a refined British English voice with a masculine-sounding timbre when the device offers one.
// Browser voice names and gender metadata vary by Android device; this cannot guarantee a particular actor's voice.
let jarvisVoice=null;
function chooseJarvisVoice(){
 if(!('speechSynthesis' in window))return;
 const voices=speechSynthesis.getVoices();
 const english=voices.filter(v=>/^en(-|_)/i.test(v.lang));
 const british=english.filter(v=>/^en(-|_)GB/i.test(v.lang));
 const pool=british.length?british:english;
 const preferred=pool.find(v=>/\b(male|daniel|arthur|george|oliver|ryan|brian|alfie|oliver|rishi|google uk english male)\b/i.test(v.name));
 jarvisVoice=preferred||pool.find(v=>/natural|enhanced|premium/i.test(v.name))||pool[0]||voices[0]||null;
}
if('speechSynthesis' in window){chooseJarvisVoice();speechSynthesis.addEventListener?.('voiceschanged',chooseJarvisVoice)}
function say(s){$('message').textContent=s;$('state').textContent='JARVIS RESPONDING';if('speechSynthesis'in window){speechSynthesis.cancel();chooseJarvisVoice();let u=new SpeechSynthesisUtterance(s);u.lang='en-GB';if(jarvisVoice)u.voice=jarvisVoice;u.rate=.89;u.pitch=.78;u.volume=1;u.onend=()=>$('state').textContent='AWAITING INPUT';speechSynthesis.speak(u)}log('JARVIS: '+s)}
let stream=null,model=null;
async function start(){try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false});$('video').srcObject=stream;await $('video').play();$('placeholder').hidden=true;$('camState').textContent='CAMERA ONLINE';$('camera').textContent='STOP CAMERA';$('detect').disabled=false;$('sys').textContent='OPTICAL FEED ACTIVE';log('Camera permission granted.');say('Optical feed is online.');if(!model&&window.cocoSsd){$('detections').textContent='Loading object detection model…';try{model=await cocoSsd.load();$('detections').textContent='Model ready. Tap Detect Objects.';log('Object model loaded.')}catch(e){$('detections').textContent='Model failed to load; check internet.';log('Model load failed.')}}}catch(e){log('Camera error: '+e.message);say('I could not access the camera. Check browser permissions and use the secure hosted page.')}}
function stop(){if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;$('video').srcObject=null;$('placeholder').hidden=false;$('camState').textContent='CAMERA OFFLINE';$('camera').textContent='ACTIVATE CAMERA';$('detect').disabled=true;$('overlay').getContext('2d').clearRect(0,0,$('overlay').width,$('overlay').height);$('sys').textContent='SYSTEM STANDBY';log('Camera stopped.')}
async function detect(){if(!model){say('Object detection model is not ready. Check the internet connection.');return}let v=$('video'),c=$('overlay'),ctx=c.getContext('2d');if(!v.videoWidth)return;c.width=v.videoWidth;c.height=v.videoHeight;try{let ps=await model.detect(v);ctx.clearRect(0,0,c.width,c.height);ctx.lineWidth=3;ctx.font='18px sans-serif';ctx.strokeStyle='#54dcff';for(let p of ps.filter(p=>p.score>.45)){let [x,y,w,h]=p.bbox;ctx.strokeRect(x,y,w,h);ctx.fillStyle='#54dcff';ctx.fillRect(x,y-23,ctx.measureText(p.class).width+70,23);ctx.fillStyle='#03111c';ctx.fillText(p.class+' '+Math.round(p.score*100)+'%',x+4,y-6)}$('detections').textContent=ps.length?ps.filter(p=>p.score>.45).map(p=>p.class+' — '+Math.round(p.score*100)+'%').join(' · '):'No known objects detected in this frame.';log('Detection completed. '+ps.length+' candidate(s).')}catch(e){log('Detection error: '+e.message)}}
$('camera').onclick=()=>stream?stop():start();$('detect').onclick=detect;
$('speak').onclick=()=>say('Good day, Harsh. HI RECON Mark One is operational. This is a prototype interface. Object detection needs camera permission and internet access.');
function listen(){let SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){say('Voice recognition is not supported here. Use the buttons instead.');return}let r=new SR();r.lang='en-IN';$('state').textContent='LISTENING';r.onresult=e=>{let s=e.results[0][0].transcript.toLowerCase();log('Command: '+s);if(s.includes('start camera')){if(!stream)start();else say('Camera is already online.')}else if(s.includes('stop camera')){stop();say('Optical feed stopped.')}else if(s.includes('scan')||s.includes('detect')){detect();say('Running object detection on the current frame.')}else if(s.includes('model')||s.includes('3d')){ $('three').scrollIntoView({behavior:'smooth',block:'center'});say('Spatial display selected. This is a demo mannequin, not a real body scan.')}else if(s.includes('status'))say('System report. Camera '+(stream?'online':'offline')+'. Object model '+(model?'ready':'not loaded')+'. Spatial display shows a demo mannequin.');else say('Command not recognised. Try start camera, stop camera, scan objects, show 3D model, or status report.')};r.onerror=e=>log('Voice recognition issue: '+e.error);r.onend=()=>$('state').textContent='AWAITING INPUT';r.start()}
$('listen').onclick=listen;$('voice').onclick=listen;$('clear').onclick=()=>logBox.replaceChildren();
// Interactive holographic human-shaped procedural mesh. It is a stylized visualization, not a scan.
const cv=$('three'),renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.setClearColor(0x000000,0);
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(34,1,.1,100);
cam.position.set(0,.72,6.8);cam.lookAt(0,.25,0);
scene.add(new THREE.AmbientLight(0x68eaff,2.0));
const light=new THREE.PointLight(0x45eaff,24);light.position.set(2,3,4);scene.add(light);
const rim=new THREE.PointLight(0x087fff,16);rim.position.set(-3,0,-2);scene.add(rim);
const g=new THREE.Group();scene.add(g);
const surface=new THREE.MeshBasicMaterial({color:0x18c9e8,transparent:true,opacity:.10,side:THREE.DoubleSide,depthWrite:false});
const wire=new THREE.MeshBasicMaterial({color:0x69f5ff,wireframe:true,transparent:true,opacity:.78});
const brightWire=new THREE.MeshBasicMaterial({color:0xc1ffff,wireframe:true,transparent:true,opacity:.92});
function ellipsoid(x,y,z,sx,sy,sz,detail=20,mat=surface){
 const geo=new THREE.SphereGeometry(1,detail,Math.max(12,Math.round(detail*.7)));
 const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);g.add(m);
 const w=new THREE.Mesh(geo,mat===brightWire?wire:wire);w.position.copy(m.position);w.scale.copy(m.scale);g.add(w);return m;
}
function segment(a,b,r1,r2,detail=12){
 const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),d=new THREE.Vector3().subVectors(B,A),len=d.length();
 const geo=new THREE.CylinderGeometry(r2,r1,len,detail,2,true);
 const m=new THREE.Mesh(geo,surface);m.position.copy(A).add(B).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());g.add(m);
 const w=new THREE.Mesh(geo,wire);w.position.copy(m.position);w.quaternion.copy(m.quaternion);g.add(w);
 // A few luminous transverse contour rings make the volume read as a projected mesh.
 const ringGeo=new THREE.TorusGeometry((r1+r2)*.5,.004,4,24);
 for(const t of [.18,.5,.82]){const ring=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:0x9bfbff,transparent:true,opacity:.55}));ring.position.copy(A).lerp(B,t);ring.quaternion.copy(m.quaternion);g.add(ring)}
}
function joint(p,r){ellipsoid(p[0],p[1],p[2],r,r,r,14,brightWire)}
// Head, neck, shoulder girdle and anatomically proportioned torso.
ellipsoid(0,1.63,0,.205,.285,.19,24);
ellipsoid(0,1.78,-.012,.18,.075,.17,20,brightWire); // brow / cranial contour
segment([0,1.38,0],[0,1.49,0],.09,.105);
ellipsoid(0,1.06,0,.30,.39,.18,24); // chest
ellipsoid(0,.78,.008,.245,.30,.15,24); // rib cage to waist
ellipsoid(0,.48,0,.265,.22,.16,20); // pelvis
// Collar bones and shoulder caps.
segment([-.31,1.30,0],[0,1.34,.01],.055,.045);
segment([0,1.34,.01],[.31,1.30,0],.045,.055);
ellipsoid(-.35,1.27,0,.13,.14,.13,18);ellipsoid(.35,1.27,0,.13,.14,.13,18);
// Arms are built as connected tapered segments with joints.
for(const side of [-1,1]){
 const sh=[side*.39,1.24,0],el=[side*.53,.86,.015],wr=[side*.59,.48,.035],hand=[side*.61,.31,.045];
 segment(sh,el,.105,.078);segment(el,wr,.078,.052);segment(wr,hand,.052,.04);
 joint(sh,.105);joint(el,.075);joint(wr,.05);
 ellipsoid(hand[0],hand[1],hand[2],.055,.095,.045,14);
 // Legs with thigh, knee, calf, ankle and foot volumes.
 const hip=[side*.145,.40,0],knee=[side*.17,-.20,.015],ankle=[side*.18,-.79,.035],foot=[side*.18,-.91,.13];
 segment(hip,knee,.135,.085,16);segment(knee,ankle,.085,.052,14);
 joint(hip,.11);joint(knee,.071);joint(ankle,.05);
 ellipsoid(foot[0],foot[1],foot[2],.085,.055,.16,16);
}
// A fine centerline and shoulder/hip tracking arcs emphasize the projected scan aesthetic.
function arc(radius,y,start,length,color=0x35eaff){
 const curve=new THREE.EllipseCurve(0,0,radius,radius,start,start+length,false,0);
 const pts=curve.getPoints(100).map(p=>new THREE.Vector3(p.x,y,p.y));
 const geo=new THREE.BufferGeometry().setFromPoints(pts);
 const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color,transparent:true,opacity:.68}));g.add(line);
}
arc(.48,1.26,Math.PI*.08,Math.PI*.84);arc(.33,.43,Math.PI*.12,Math.PI*.76,0x8ffaff);
const centerGeo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-.82,.02),new THREE.Vector3(0,1.88,.02)]);
g.add(new THREE.Line(centerGeo,new THREE.LineBasicMaterial({color:0x72f5ff,transparent:true,opacity:.38})));
let grid=new THREE.GridHelper(4,24,0x168db5,0x0b3b55);grid.position.y=-1.25;scene.add(grid);let rotating=true,drag=false,px=0,py=0;cv.onpointerdown=e=>{drag=true;px=e.clientX;py=e.clientY;cv.setPointerCapture(e.pointerId)};cv.onpointermove=e=>{if(drag){g.rotation.y+=(e.clientX-px)*.01;g.rotation.x+=(e.clientY-py)*.006;px=e.clientX;py=e.clientY}};cv.onpointerup=cv.onpointercancel=()=>drag=false;
function resize(){let w=cv.clientWidth||320,h=cv.clientHeight||230;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}new ResizeObserver(resize).observe(cv);resize();function frame(){requestAnimationFrame(frame);if(rotating&&!drag)g.rotation.y+=.003;renderer.render(scene,cam)}frame();
$('rotate').onclick=()=>{rotating=!rotating;$('rotate').textContent=rotating?'PAUSE ROTATION':'RESUME ROTATION'};$('reset').onclick=()=>{g.rotation.set(0,0,0);cam.position.set(0,.72,6.8);cam.lookAt(0,.25,0)};log('HI RECON Mk I HUD 3.0 initialized.');log('Camera frames are not uploaded by this app code. Third-party browser libraries have their own terms.');if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
