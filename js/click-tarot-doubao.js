// ★★★ 诡秘角色点击散落特效（圆形角色图飞散）★★★
(function () {
  // 9 张圆形角色图（嘉德丽雅/克莱恩/伦纳德/奥黛丽/戴里克/克喵/佛尔思/休/阿尔杰）
  const imgList = [
    '/images/gm/click/round1-doubao.png',
    '/images/gm/click/round2-doubao.png',
    '/images/gm/click/round3-doubao.png',
    '/images/gm/click/round4-doubao.png',
    '/images/gm/click/round5-doubao.png',
    '/images/gm/click/round6-doubao.png',
    '/images/gm/click/round7-doubao.png',
    '/images/gm/click/round8-doubao.png',
    '/images/gm/click/round9-doubao.png'
  ];

  // 1. 透明全屏画布（鼠标穿透，不挡点击）
  let canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;top:0;left:0;pointer-events:none;z-index:999999;width:100%;height:100%";
  document.body.appendChild(canvas);
  let ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // 2. 预加载角色图
  const imgs = imgList.map(src => {
    const i = new Image();
    i.src = src;
    return i;
  });

  let particles = [];

  // 3. 生成一个角色粒子
  function createParticle(x, y) {
    const img = imgs[Math.floor(Math.random() * imgs.length)];
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1.5;
    return {
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2.5,   // 初始向上飘一点
      size: Math.random() * 16 + 44,       // 44~60px
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.15,  // 旋转速度
      life: 1.0,
      img: img
    };
  }

  // 4. 点击事件：每次点击散落 3~5 张角色图
  document.addEventListener("click", function (e) {
    const count = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < count; i++) {
      if (particles.length > 30) particles.shift();  // 防爆炸上限
      particles.push(createParticle(e.clientX, e.clientY));
    }
  });

  // 5. 动画循环：飞散 + 旋转 + 淡出
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.life > 0);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;              // 轻微重力，自然下落
      p.rot += p.vrot;           // 旋转
      p.life -= 0.012;           // 逐渐消失
      ctx.save();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }
    requestAnimationFrame(loop);
  }
  loop();
})();
