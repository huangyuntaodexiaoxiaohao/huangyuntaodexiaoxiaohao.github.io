(function(){
  if(window.self!==window.top)return;
  if(window.innerWidth<=768)return;
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))return;
  if(document.getElementById('sharron-pet'))return;

  var IMGS=['/images/pet/pet_hollow.png','/images/pet/pet1.png','/images/pet/pet2.png','/images/pet/pet3.png','/images/pet/pet4.png'];
  var CLICK_LINES=['……有事？','请保持节制。','……你吓到我了。','如果大家都能够节制欲望，就不会有战争、杀戮与苦难。'];
  var DRAG_LINES=['请不要随意摆弄我。','……失礼了。'];
  var DRAG_UP_LINES=['请放我下来！'];
  var DRAG_SPIN_LINES=['我...有点晕...'];
  var IDLE_LINES=['克制欲望，节制精神，自律行事。','我就在镜中。'];

  var savedPos=null;
  try{
    var raw=localStorage.getItem('sharronPetPos');
    if(raw)savedPos=JSON.parse(raw);
  }catch(err){}

  var wrap=document.createElement('div');
  wrap.id='sharron-pet';
  if(savedPos&&typeof savedPos.left==='number'&&typeof savedPos.top==='number'){
    wrap.style.left=savedPos.left+'px';
    wrap.style.top=savedPos.top+'px';
    wrap.style.right='auto';
    wrap.style.bottom='auto';
    wrap.className='idle-bob';
  }else{
    wrap.className='entering';
  }

  var frames=[];
  for(var i=0;i<IMGS.length;i++){
    var f=document.createElement('img');
    f.className='sp-frame';
    f.src=IMGS[i];
    f.alt='莎伦';
    f.draggable=false;
    if(i===0)f.classList.add('on');
    wrap.appendChild(f);
    frames.push(f);
  }

  var SCALE=130/508;
  var PUPILS=[
    {src:'/images/pet/pet_pupil_L.png',left:129,top:297,width:39,height:52},
    {src:'/images/pet/pet_pupil_R.png',left:246,top:316,width:56,height:42}
  ];
  var pupils=[];
  for(var j=0;j<PUPILS.length;j++){
    var p=document.createElement('img');
    p.className='sp-pupil on';
    p.src=PUPILS[j].src;
    p.alt='';
    p.draggable=false;
    p.style.left=(PUPILS[j].left*SCALE)+'px';
    p.style.top=(PUPILS[j].top*SCALE)+'px';
    p.style.width=(PUPILS[j].width*SCALE)+'px';
    p.style.height=(PUPILS[j].height*SCALE)+'px';
    wrap.appendChild(p);
    pupils.push(p);
  }

  var BLINK_PATCHES=[
    {src:'/images/pet/pet_eyeL_closed.png',left:114,top:268,width:72,height:114},
    {src:'/images/pet/pet_eyeR_closed.png',left:229,top:286,width:89,height:105}
  ];
  var patches=[];
  for(var m=0;m<BLINK_PATCHES.length;m++){
    var bp=document.createElement('img');
    bp.className='sp-blink';
    bp.src=BLINK_PATCHES[m].src;
    bp.alt='';
    bp.draggable=false;
    bp.style.left=(BLINK_PATCHES[m].left*SCALE)+'px';
    bp.style.top=(BLINK_PATCHES[m].top*SCALE)+'px';
    bp.style.width=(BLINK_PATCHES[m].width*SCALE)+'px';
    bp.style.height=(BLINK_PATCHES[m].height*SCALE)+'px';
    wrap.appendChild(bp);
    patches.push(bp);
  }

  var rim=document.createElement('img');
  rim.className='sp-rim';
  rim.src='/images/pet/pet_rim2.png';
  rim.alt='';
  rim.draggable=false;
  rim.style.left='0';
  rim.style.top='0';
  rim.style.width='100%';
  rim.style.height='auto';
  wrap.appendChild(rim);

  var bubble=document.createElement('div');
  bubble.className='sp-bubble';
  wrap.appendChild(bubble);

  document.body.appendChild(wrap);

  var cooldown=0;
  var frameTimer=null;
  var blinkTimer=null;
  var curFrame=0;

  function say(text,dur){
    if(cooldown>Date.now())return;
    bubble.textContent=text;
    bubble.classList.add('show');
    setTimeout(function(){bubble.classList.remove('show');},dur||2800);
    cooldown=Date.now()+2200;
  }

  function resetTransitions(){
    for(var i=0;i<frames.length;i++)frames[i].style.transition='';
  }

  function setPupils(on){
    for(var k=0;k<pupils.length;k++){
      if(on)pupils[k].classList.add('on');
      else pupils[k].classList.remove('on');
    }
  }

  function setFrame(idx,hold){
    if(frameTimer)clearTimeout(frameTimer);
    if(blinkTimer){clearTimeout(blinkTimer);blinkTimer=null;}
    for(var k=0;k<patches.length;k++)patches[k].style.opacity='0';
    resetTransitions();
    for(var i=0;i<frames.length;i++){
      if(i===idx)frames[i].classList.add('on');
      else frames[i].classList.remove('on');
    }
    setPupils(idx===0);
    rim.style.display=(idx===0)?'block':'none';
    if(hold){
      frameTimer=setTimeout(function(){setFrame(curFrame);},hold);
    }
  }

  function blink(){
    if(curFrame!==0)return;
    if(frameTimer)clearTimeout(frameTimer);
    if(blinkTimer){clearTimeout(blinkTimer);blinkTimer=null;}
    setPupils(false);
    for(var k=0;k<patches.length;k++)patches[k].style.opacity='1';
    blinkTimer=setTimeout(function(){
      blinkTimer=null;
      for(var k=0;k<patches.length;k++)patches[k].style.opacity='0';
      setPupils(true);
    },250);
  }
  function scheduleBlink(){
    setTimeout(function(){
      blink();
      scheduleBlink();
    },3000+Math.random()*3500);
  }

  function scheduleLine(){
    setTimeout(function(){
      say(IDLE_LINES[Math.floor(Math.random()*IDLE_LINES.length)],3200);
      scheduleLine();
    },45000+Math.random()*30000);
  }

  scheduleBlink();
  scheduleLine();

  setTimeout(function(){
    if(wrap.classList.contains('entering')){
      wrap.classList.remove('entering');
      wrap.classList.add('idle-bob');
    }
  },1150);

  var MAXDX=4*SCALE;
  var MAXDY=4*SCALE;
  var px=0,py=0,tpx=0,tpy=0,rafId=null;
  function applyFollow(){
    var t='scale(1.1)';
    for(var i=0;i<frames.length;i++)frames[i].style.transform=t;
    rim.style.transform=t;
    var pt='translate('+px+'px,'+py+'px)';
    for(var j=0;j<pupils.length;j++)pupils[j].style.transform=pt;
    for(var k=0;k<patches.length;k++)patches[k].style.transform=pt;
  }
  function followLoop(){
    px+=(tpx-px)*0.18;
    py+=(tpy-py)*0.18;
    applyFollow();
    if(Math.abs(tpx-px)>0.05||Math.abs(tpy-py)>0.05){
      rafId=requestAnimationFrame(followLoop);
    }else{
      rafId=null;
      applyFollow();
    }
  }
  document.addEventListener('mousemove',function(e){
    if(wrap.classList.contains('dragging'))return;
    var rect=wrap.getBoundingClientRect();
    var pcx=rect.left+rect.width/2;
    var pcy=rect.top+rect.height/2;
    var dx=(e.clientX-pcx)/(window.innerWidth/2);
    var dy=(e.clientY-pcy)/(window.innerHeight/2);
    if(dx>1)dx=1;
    if(dx<-1)dx=-1;
    if(dy>1)dy=1;
    if(dy<-1)dy=-1;
    tpx=dx*MAXDX;
    tpy=dy*MAXDY;
    if(!rafId)rafId=requestAnimationFrame(followLoop);
  });

  var downX=0,downY=0,moved=false,dragX=0,dragY=0,offX=0,offY=0,lastX=0,lastY=0,dragDist=0,lastSpin=0;

  wrap.addEventListener('pointerdown',function(e){
    if(e.button!==0&&e.pointerType==='mouse')return;
    downX=e.clientX;
    downY=e.clientY;
    lastX=e.clientX;
    lastY=e.clientY;
    dragDist=0;
    moved=false;
    var r=wrap.getBoundingClientRect();
    offX=e.clientX-r.left;
    offY=e.clientY-r.top;
    try{wrap.setPointerCapture(e.pointerId);}catch(err){}
  });

  wrap.addEventListener('pointermove',function(e){
    if(!wrap.hasPointerCapture(e.pointerId))return;
    var dx=e.clientX-downX,dy=e.clientY-downY;
    if(!moved&&(Math.abs(dx)>6||Math.abs(dy)>6)){
      moved=true;
      say(DRAG_UP_LINES[Math.floor(Math.random()*DRAG_UP_LINES.length)]);
    }
    if(!moved)return;
    dragDist+=Math.abs(e.clientX-lastX)+Math.abs(e.clientY-lastY);
    lastX=e.clientX;
    lastY=e.clientY;
    if(dragDist>300&&Date.now()-lastSpin>8000){
      lastSpin=Date.now();
      dragDist=0;
      say(DRAG_SPIN_LINES[Math.floor(Math.random()*DRAG_SPIN_LINES.length)]);
    }
    var r=wrap.getBoundingClientRect();
    var nx=e.clientX-offX;
    var ny=e.clientY-offY;
    nx=Math.max(0,Math.min(nx,window.innerWidth-r.width));
    ny=Math.max(0,Math.min(ny,window.innerHeight-r.height));
    dragX=nx;
    dragY=ny;
    wrap.style.left=nx+'px';
    wrap.style.top=ny+'px';
    wrap.style.right='auto';
    wrap.style.bottom='auto';
    if(!wrap.classList.contains('dragging')){
      wrap.classList.add('dragging');
      wrap.classList.remove('idle-bob');
      setFrame(0);
    }
  });

  function endDrag(e){
    if(!wrap.hasPointerCapture(e.pointerId))return;
    try{wrap.releasePointerCapture(e.pointerId);}catch(err){}
    if(moved){
      wrap.classList.remove('dragging');
      wrap.classList.add('idle-bob');
      try{localStorage.setItem('sharronPetPos',JSON.stringify({left:dragX,top:dragY}));}catch(err){}
      say(DRAG_LINES[Math.floor(Math.random()*DRAG_LINES.length)]);
      setFrame(4,900);
    }else{
      setFrame(2,1000);
      say(CLICK_LINES[Math.floor(Math.random()*CLICK_LINES.length)]);
    }
  }

  wrap.addEventListener('pointerup',endDrag);
  wrap.addEventListener('pointercancel',function(e){
    if(!wrap.hasPointerCapture(e.pointerId))return;
    try{wrap.releasePointerCapture(e.pointerId);}catch(err){}
    if(moved){
      wrap.classList.remove('dragging');
      wrap.classList.add('idle-bob');
      try{localStorage.setItem('sharronPetPos',JSON.stringify({left:dragX,top:dragY}));}catch(err){}
      setFrame(curFrame);
    }
  });
})();
