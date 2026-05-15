/**
 * LUCA'S RUN — Motor de juego principal
 * Estilo: Extreme Pamplona / Endless Runner 2D lateral
 * Canvas HTML5 puro, sin frameworks
 *
 * Arquitectura:
 *  - GameState      : estado global
 *  - Renderer       : todo el dibujo en canvas
 *  - Physics        : movimiento y colisiones
 *  - ObstacleSystem : generación y gestión de obstáculos
 *  - PowerupSystem  : power-ups
 *  - AudioSystem    : web audio sintético
 *  - InputHandler   : teclado / táctil
 *  - UI             : HUD y pantallas
 *  - Game           : loop principal
 */

/* ================================================================
   CONSTANTES GLOBALES
   ================================================================ */
const C = {
  GRAVITY:        0.55,
  JUMP_FORCE:    -13,
  SLIDE_DUR:      40,   // frames de deslizamiento
  BASE_SPEED:      7.5,
  MAX_SPEED:      20,
  SPEED_INC:       0.0015,
  FLOOR_Y_RATIO:   0.75, // piso relativo a la altura del canvas
  DIEGO_CATCHUP:   0.008,
  COLLISION_GRACE: 30,   // frames de invulnerabilidad tras golpe
  POWERUP_INTERVAL:400,  // frames entre power-ups
};

/* ================================================================
   SISTEMA DE AUDIO (Web Audio API sintético)
   ================================================================ */
const AudioSystem = (() => {
  let ctx = null;
  let enabled = false;

  function init() {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      enabled = true;
    } catch(e) { /* sin audio */ }
  }

  function beep(freq, dur, type = 'square', vol = 0.12, detune = 0) {
    if (!enabled || !ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.detune.setValueAtTime(detune, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + dur);
    } catch(e) {}
  }

  function step() { beep(80 + Math.random()*20, 0.05, 'sawtooth', 0.07); }
  function jump() { beep(300, 0.15, 'sine', 0.15); beep(500, 0.1, 'sine', 0.1); }
  function land() { beep(60, 0.08, 'square', 0.1); }
  function hit()  { beep(150, 0.3, 'sawtooth', 0.2, -200); }
  function powerup() {
    [400,500,600,800].forEach((f,i) => {
      setTimeout(() => beep(f, 0.12, 'sine', 0.15), i * 60);
    });
  }
  function danger(level) {
    if (Math.random() < 0.02 * level) beep(200 + level*30, 0.1, 'square', 0.08);
  }
  function gameOver() {
    [300,200,150,80].forEach((f,i) => {
      setTimeout(() => beep(f, 0.25, 'sawtooth', 0.2), i * 120);
    });
  }

  return { init, step, jump, land, hit, powerup, danger, gameOver };
})();

/* ================================================================
   ESTADO DEL JUEGO
   ================================================================ */
const GameState = {
  running:       false,
  score:         0,
  distance:      0,
  speed:         C.BASE_SPEED,
  maxSpeed:      C.BASE_SPEED,
  lucaSpeed:     C.BASE_SPEED,  // velocidad específica de Luca
  diegoSpeed:    C.BASE_SPEED,  // velocidad específica de Diego
  level:         1,
  frame:         0,
  diegoGap:      550,   // distancia (px canvas) entre Diego y Luca - AUMENTADO
  diegoMaxGap:   550,
  dangerPct:     0,     // 0..1
  hitCooldown:   0,
  lastStepFrame: 0,
  powerupTimer:  C.POWERUP_INTERVAL,
  activePowerup: null,   // { type, timer }
};

/* ================================================================
   JUGADOR (Luca)
   ================================================================ */
const Player = {
  x: 0,   // se inicializa en resize
  y: 0,
  w: 46,
  h: 72,
  vy: 0,
  onGround: false,
  jumpsLeft: 2,
  sliding: false,
  slideTimer: 0,
  // animación
  runFrame: 0,
  runTick: 0,
};

/* ================================================================
   PERSEGUIDOR (Diego)
   ================================================================ */
const Diego = {
  x: 0,
  y: 0,
  w: 50,
  h: 76,
  runFrame: 0,
  runTick: 0,
};

/* ================================================================
   OBSTÁCULOS
   ================================================================ */
const Obstacles = {
  list: [],
  spawnTimer: 0,
  spawnInterval: 90,

  TYPES: [
    { id:'caja',    w:42, h:42, label:'CAJA',    color:'#8b6914', color2:'#a07820', tall:false },
    { id:'cable',   w:12, h:80, label:'CABLE',   color:'#333',    color2:'#555',    tall:true  },
    { id:'charco',  w:70, h:18, label:'CHARCO',  color:'#1a3a5c', color2:'#2255aa', tall:false },
    { id:'banco',   w:60, h:36, label:'BANCO',   color:'#4a3520', color2:'#6a4a28', tall:false },
    { id:'robot',   w:50, h:64, label:'ROBOT',   color:'#3a3a4a', color2:'#5a5a6a', tall:true  },
    { id:'barril',  w:34, h:52, label:'BARRIL',  color:'#553318', color2:'#774422', tall:false },
    { id:'herram',  w:38, h:28, label:'HERRAM',  color:'#778899', color2:'#99aabb', tall:false },
  ],

  spawn(canvasW, floorY) {
    const type = this.TYPES[Math.floor(Math.random() * this.TYPES.length)];
    this.list.push({
      ...type,
      x: canvasW + 40,
      y: floorY - type.h,
    });
  },

  update(canvasW, floorY, speed) {
    this.spawnTimer++;
    const interval = Math.max(45, this.spawnInterval - GameState.level * 4);
    if (this.spawnTimer >= interval) {
      this.spawnTimer = 0;
      // A veces doble obstáculo
      this.spawn(canvasW, floorY);
      if (Math.random() < 0.25 && GameState.level > 2) {
        setTimeout(() => this.spawn(canvasW, floorY), 300);
      }
    }
    for (let i = this.list.length - 1; i >= 0; i--) {
      this.list[i].x -= speed;
      if (this.list[i].x + this.list[i].w < -20) this.list.splice(i, 1);
    }
  },

  reset() { this.list = []; this.spawnTimer = 0; this.spawnInterval = 90; },
};

/* ================================================================
   POWER-UPS
   ================================================================ */
const PowerupSystem = {
  list: [],
  TYPES: [
    { id:'shield',  label:'⚡ ESCUDO',       color:'#00d4ff', dur:300 },
    { id:'magnet',  label:'⚙ TURBO BOOST',  color:'#a0ff00', dur:180 },
    { id:'slow',    label:'⏱ TIEMPO LENTO', color:'#ff9900', dur:200 },
  ],

  spawn(canvasW, floorY) {
    const t = this.TYPES[Math.floor(Math.random() * this.TYPES.length)];
    this.list.push({ ...t, x: canvasW + 20, y: floorY - 90, w: 30, h: 30 });
  },

  update(canvasW, floorY, speed) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      this.list[i].x -= speed * 0.8;
      if (this.list[i].x + this.list[i].w < -30) this.list.splice(i, 1);
    }
  },

  checkCollect(px, py, pw, ph) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      if (px < p.x+p.w && px+pw > p.x && py < p.y+p.h && py+ph > p.y) {
        this.list.splice(i, 1);
        return p;
      }
    }
    return null;
  },

  reset() { this.list = []; },
};

/* ================================================================
   PARTÍCULAS
   ================================================================ */
const Particles = {
  list: [],

  emit(x, y, color, count = 5, type = 'run') {
    for (let i = 0; i < count; i++) {
      this.list.push({
        x, y,
        vx: (Math.random()-0.5) * (type==='hit'?8:3),
        vy: -Math.random() * (type==='hit'?6:3) - 1,
        life: type==='hit' ? 40 : 20,
        maxLife: type==='hit' ? 40 : 20,
        r: Math.random() * (type==='hit'?6:3) + 1,
        color,
      });
    }
  },

  update() {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.life--;
      if (p.life <= 0) this.list.splice(i, 1);
    }
  },

  draw(ctx) {
    this.list.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    });
  },

  reset() { this.list = []; },
};

/* ================================================================
   FONDO (parallax multicapa)
   ================================================================ */
const Background = {
  layers: [], // se generan dinámicamente
  offsetX: 0,

  // Generar elementos del pasillo industrial
  init(canvasW, canvasH) {
    this.layers = [
      { items: this._genLayer(canvasW, canvasH, 0), speed: 0.1 },  // fondo lejano
      { items: this._genLayer(canvasW, canvasH, 1), speed: 0.35 }, // plano medio
      { items: this._genLayer(canvasW, canvasH, 2), speed: 0.7 },  // primer plano
    ];
    this.scrollX = 0;
  },

  _genLayer(cW, cH, depth) {
    const items = [];
    const count = [6, 8, 10][depth];
    for (let i = 0; i < count; i++) {
      items.push({
        x: (cW / count) * i + Math.random() * 60,
        type: depth === 0
          ? ['vent','pipe','window'][Math.floor(Math.random()*3)]
          : depth === 1
          ? ['locker','door','machine'][Math.floor(Math.random()*3)]
          : ['cable_fg','sign','lamp'][Math.floor(Math.random()*3)],
        phase: Math.random() * Math.PI * 2,
      });
    }
    return items;
  },

  update(speed) {
    this.scrollX += speed;
    // Hacer scroll infinito: mover items que salieron por la izquierda
    this.layers.forEach((layer, di) => {
      layer.items.forEach(item => {
        item.x -= speed * layer.speed;
      });
      // Reciclar
      const cW = canvas.width;
      layer.items.forEach(item => {
        if (item.x < -200) item.x += cW + 400;
      });
    });
  },

  draw(ctx, cW, cH, floorY) {
    // Techo y paredes
    this._drawCorridor(ctx, cW, cH, floorY);

    // Capas
    this.layers.forEach((layer, di) => {
      layer.items.forEach(item => {
        this._drawBgItem(ctx, item, cH, floorY, di);
      });
    });

    // Piso
    this._drawFloor(ctx, cW, cH, floorY);
  },

  _drawCorridor(ctx, cW, cH, floorY) {
    // Gradiente de pared de fondo
    const grad = ctx.createLinearGradient(0, 0, 0, floorY);
    grad.addColorStop(0,   '#0d111a');
    grad.addColorStop(0.4, '#111825');
    grad.addColorStop(1,   '#1a2235');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cW, floorY);

    // Líneas de perspectiva del pasillo
    ctx.save();
    ctx.strokeStyle = 'rgba(0,212,255,0.04)';
    ctx.lineWidth = 1;
    const vp = { x: cW/2, y: floorY * 0.3 }; // punto de fuga
    for (let i = 0; i <= 8; i++) {
      const bx = (cW / 8) * i;
      ctx.beginPath();
      ctx.moveTo(bx, floorY);
      ctx.lineTo(vp.x + (bx - cW/2) * 0.1, vp.y);
      ctx.stroke();
    }
    ctx.restore();

    // Techo con tuberías
    ctx.fillStyle = '#0a0e18';
    ctx.fillRect(0, 0, cW, floorY * 0.12);

    // Luces fluorescentes en el techo
    const lampCount = 6;
    for (let i = 0; i < lampCount; i++) {
      const lx = (cW / lampCount) * i + cW / (lampCount * 2);
      const offset = (this.scrollX * 0.1) % (cW / lampCount);
      const fx = ((lx - offset) % cW + cW) % cW;
      const flicker = 0.6 + 0.4 * Math.sin(GameState.frame * 0.3 + i);

      ctx.save();
      ctx.globalAlpha = 0.12 * flicker;
      const lampGrad = ctx.createRadialGradient(fx, floorY*0.12, 0, fx, floorY*0.12, 120);
      lampGrad.addColorStop(0, '#cceeff');
      lampGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = lampGrad;
      ctx.fillRect(fx - 120, 0, 240, floorY);
      ctx.restore();

      // Fluorescente físico
      ctx.fillStyle = `rgba(200,240,255,${0.7*flicker})`;
      ctx.fillRect(fx - 30, floorY*0.08, 60, 5);
    }
  },

  _drawFloor(ctx, cW, cH, floorY) {
    // Suelo industrial
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, cH);
    floorGrad.addColorStop(0, '#1e2535');
    floorGrad.addColorStop(0.3, '#171e2d');
    floorGrad.addColorStop(1, '#0d1018');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, cW, cH - floorY);

    // Línea del suelo con brillo
    ctx.strokeStyle = 'rgba(0,212,255,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(cW, floorY);
    ctx.stroke();

    // Marcas del suelo (tiles)
    const tileW = 80;
    const tileOff = this.scrollX % tileW;
    ctx.strokeStyle = 'rgba(0,212,255,0.05)';
    ctx.lineWidth = 1;
    for (let x = -tileOff; x < cW; x += tileW) {
      ctx.beginPath();
      ctx.moveTo(x, floorY);
      ctx.lineTo(x, cH);
      ctx.stroke();
    }

    // Reflejo en el suelo
    ctx.fillStyle = 'rgba(0,212,255,0.03)';
    ctx.fillRect(0, floorY, cW, 4);
  },

  _drawBgItem(ctx, item, cH, floorY, depth) {
    const alpha = [0.35, 0.55, 0.75][depth];
    ctx.save();
    ctx.globalAlpha = alpha;

    const x = item.x;
    const type = item.type;

    if (type === 'vent') {
      // Rejilla de ventilación
      const y = floorY * 0.2;
      ctx.fillStyle = '#1a2030';
      ctx.fillRect(x, y, 50, 35);
      ctx.strokeStyle = '#2a3550';
      ctx.lineWidth = 1.5;
      for (let r = 0; r < 5; r++) {
        ctx.beginPath();
        ctx.moveTo(x+4, y+5+r*6);
        ctx.lineTo(x+46, y+5+r*6);
        ctx.stroke();
      }
    } else if (type === 'pipe') {
      // Tubería horizontal
      const py = floorY * (0.15 + (depth*0.05));
      ctx.strokeStyle = '#2a3a4a';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(x-60, py);
      ctx.lineTo(x+120, py);
      ctx.stroke();
      ctx.strokeStyle = '#3a4a5a';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(x-60, py);
      ctx.lineTo(x+120, py);
      ctx.stroke();
    } else if (type === 'window') {
      // Ventana industrial
      const wy = floorY * 0.25;
      ctx.fillStyle = '#0a1a2a';
      ctx.strokeStyle = '#334455';
      ctx.lineWidth = 2;
      ctx.fillRect(x, wy, 55, 40);
      ctx.strokeRect(x, wy, 55, 40);
      // Cruz de la ventana
      ctx.beginPath();
      ctx.moveTo(x+27, wy); ctx.lineTo(x+27, wy+40);
      ctx.moveTo(x, wy+20); ctx.lineTo(x+55, wy+20);
      ctx.stroke();
    } else if (type === 'locker') {
      // Locker metálico
      const ly = floorY - 90;
      ctx.fillStyle = '#1e2a3a';
      ctx.strokeStyle = '#2a3a50';
      ctx.lineWidth = 1.5;
      ctx.fillRect(x, ly, 35, 90);
      ctx.strokeRect(x, ly, 35, 90);
      ctx.strokeRect(x+4, ly+4, 27, 40);
      ctx.strokeRect(x+4, ly+48, 27, 38);
      // Manija
      ctx.fillStyle = '#778899';
      ctx.fillRect(x+17, ly+22, 8, 4);
      ctx.fillRect(x+17, ly+66, 8, 4);
    } else if (type === 'door') {
      // Puerta metálica
      const dy = floorY - 110;
      ctx.fillStyle = '#1a2535';
      ctx.strokeStyle = '#334455';
      ctx.lineWidth = 2;
      ctx.fillRect(x, dy, 50, 110);
      ctx.strokeRect(x, dy, 50, 110);
      // Marco interior
      ctx.strokeStyle = '#253545';
      ctx.strokeRect(x+5, dy+5, 40, 100);
      // Manija
      ctx.fillStyle = '#667788';
      ctx.beginPath();
      ctx.arc(x+38, dy+58, 4, 0, Math.PI*2);
      ctx.fill();
    } else if (type === 'machine') {
      // Máquina industrial
      const my = floorY - 70;
      ctx.fillStyle = '#1e2838';
      ctx.strokeStyle = '#2e3848';
      ctx.lineWidth = 2;
      ctx.fillRect(x, my, 70, 70);
      ctx.strokeRect(x, my, 70, 70);
      // Panel con luces
      ctx.fillStyle = '#0d1520';
      ctx.fillRect(x+8, my+8, 54, 30);
      // Luces parpadeantes
      const colors = ['#ff2244','#00ff88','#ffcc00'];
      colors.forEach((c, i) => {
        const blink = Math.sin(GameState.frame * 0.1 + i * 2) > 0;
        ctx.fillStyle = blink ? c : '#111';
        ctx.beginPath();
        ctx.arc(x+16+i*14, my+23, 4, 0, Math.PI*2);
        ctx.fill();
      });
    } else if (type === 'cable_fg') {
      // Cables colgantes de primer plano
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 3;
      const cableY = floorY * 0.12;
      ctx.beginPath();
      ctx.moveTo(x, cableY);
      // Curva colgante
      ctx.quadraticCurveTo(x+15, cableY + 40 + Math.sin(item.phase)*10, x+10, cableY+80);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1a2535';
      ctx.beginPath();
      ctx.moveTo(x+5, cableY);
      ctx.quadraticCurveTo(x+25, cableY + 50, x+20, cableY+90);
      ctx.stroke();
    } else if (type === 'sign') {
      // Cartel tecnológico
      const sy = floorY * 0.4;
      ctx.fillStyle = '#0a1525';
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 1.5;
      ctx.fillRect(x, sy, 80, 28);
      ctx.strokeRect(x, sy, 80, 28);
      // Texto del cartel
      ctx.fillStyle = '#00d4ff';
      ctx.font = `bold ${depth===2?10:8}px monospace`;
      const signs = ['SECTOR-07','LAB-INDUSTRIAL','NO CORRER','ALTA TENSIÓN','ZONA RESTRINGIDA'];
      ctx.fillText(signs[Math.floor((x+sy)%signs.length)], x+5, sy+18);
    } else if (type === 'lamp') {
      // Lámpara industrial colgante
      const lampY = floorY * 0.13;
      ctx.strokeStyle = '#2a3548';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, lampY+8);
      ctx.stroke();
      // Carcasa
      ctx.fillStyle = '#1a2535';
      ctx.beginPath();
      ctx.moveTo(x-14, lampY+8);
      ctx.lineTo(x+14, lampY+8);
      ctx.lineTo(x+10, lampY+22);
      ctx.lineTo(x-10, lampY+22);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#2a3548';
      ctx.lineWidth = 1;
      ctx.stroke();
      // Luz
      const flicker = 0.7 + 0.3*Math.sin(GameState.frame*0.4+item.phase);
      ctx.fillStyle = `rgba(200,240,255,${0.8*flicker})`;
      ctx.fillRect(x-8, lampY+14, 16, 5);
    }

    ctx.restore();
  },
};

/* ================================================================
   RENDERER — dibuja personajes y obstáculos
   ================================================================ */
const Renderer = {
  /* ── Luca Bona ── */
  drawLuca(ctx, p, frame, sliding, hitCooldown) {
    const x = p.x, y = p.y, h = sliding ? p.h * 0.5 : p.h;
    const w = p.w;
    const flicker = hitCooldown > 0 && Math.floor(hitCooldown / 4) % 2 === 0;
    if (flicker) return; // parpadeo al recibir golpe

    ctx.save();
    ctx.translate(x + w/2, y + (p.h - h));

    if (sliding) {
      ctx.rotate(0.3);
    }

    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.ellipse(0, h/2+4, w*0.45, 6, 0, 0, Math.PI*2);
    ctx.fill();

    // Animación de piernas (correr)
    const legSwing = sliding ? 0 : Math.sin(frame * 0.45) * 18;
    const legSwing2 = sliding ? 0 : Math.sin(frame * 0.45 + Math.PI) * 18;

    if (!sliding) {
      // Pierna trasera
      this._drawLeg(ctx, -4, h*0.55, legSwing2, '#1a3060');
      // Pierna delantera
      this._drawLeg(ctx, 2, h*0.55, legSwing, '#1e3a7a');
    }

    // Torso
    ctx.fillStyle = '#2255aa';
    this._roundRect(ctx, -w*0.38, -h*0.25, w*0.76, h*0.5, 4);
    ctx.fill();
    // Detalle camisa/ropa
    ctx.fillStyle = '#1a4488';
    ctx.fillRect(-w*0.1, -h*0.25, w*0.2, h*0.5);

    // Brazos animados
    if (!sliding) {
      const armSwing = Math.sin(frame * 0.45) * 25;
      this._drawArm(ctx, -w*0.38, -h*0.22, armSwing, '#1e3a7a');
      this._drawArm(ctx, w*0.38, -h*0.22, -armSwing, '#1e3a7a');
    }

    // Cuello
    ctx.fillStyle = '#d4a47a';
    ctx.fillRect(-5, -h*0.3, 10, h*0.1);

    // CABEZA CUADRADA de Luca
    const hx = -w*0.42, hy = -h*0.3 - h*0.45, hw = w*0.84, hh = h*0.42;
    ctx.fillStyle = '#d4a47a';
    this._roundRect(ctx, hx, hy, hw, hh, 5);
    ctx.fill();

    // Cabello oscuro
    ctx.fillStyle = '#1a1005';
    this._roundRect(ctx, hx, hy, hw, hh*0.38, 5);
    ctx.fill();

    // Ojos — expresión concentrada/seria
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(hx+hw*0.18, hy+hh*0.4, hw*0.22, hh*0.14); // ojo izq
    ctx.fillRect(hx+hw*0.58, hy+hh*0.4, hw*0.22, hh*0.14); // ojo der
    // Cejas fruncidas
    ctx.strokeStyle = '#1a1005';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(hx+hw*0.16, hy+hh*0.34); ctx.lineTo(hx+hw*0.40, hy+hh*0.38);
    ctx.moveTo(hx+hw*0.56, hy+hh*0.38); ctx.lineTo(hx+hw*0.82, hy+hh*0.34);
    ctx.stroke();

    // Barba incipiente (puntitos)
    ctx.fillStyle = 'rgba(40,20,10,0.4)';
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(
        hx+hw*0.2 + i*hw*0.08,
        hy+hh*0.72,
        1.2, 0, Math.PI*2
      );
      ctx.fill();
    }

    // Boca — seria
    ctx.strokeStyle = '#a07050';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(hx+hw*0.32, hy+hh*0.72);
    ctx.lineTo(hx+hw*0.68, hy+hh*0.72);
    ctx.stroke();

    ctx.restore();
  },

  _drawLeg(ctx, ox, oy, angle, color) {
    ctx.save();
    ctx.translate(ox, oy);
    ctx.rotate(angle * Math.PI/180);
    ctx.fillStyle = color;
    ctx.fillRect(-5, 0, 10, 22);
    // pie
    ctx.fillStyle = '#111';
    ctx.fillRect(-4, 22, 14, 7);
    ctx.restore();
  },

  _drawArm(ctx, ox, oy, angle, color) {
    ctx.save();
    ctx.translate(ox, oy);
    ctx.rotate(angle * Math.PI/180);
    ctx.fillStyle = color;
    ctx.fillRect(-4, 0, 8, 18);
    // mano
    ctx.fillStyle = '#d4a47a';
    ctx.beginPath();
    ctx.arc(0, 20, 5, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  },

  /* ── Diego Vera ── */
  drawDiego(ctx, d, frame) {
    const x = d.x, y = d.y, h = d.h, w = d.w;
    ctx.save();
    ctx.translate(x + w/2, y);

    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.ellipse(0, h+4, w*0.45, 6, 0, 0, Math.PI*2);
    ctx.fill();

    // Piernas
    const legSwing = Math.sin(frame * 0.48) * 20;
    this._drawLeg(ctx, -4, h*0.58, Math.sin(frame*0.48+Math.PI)*20, '#3a2020');
    this._drawLeg(ctx, 2, h*0.58, legSwing, '#4a2828');

    // Torso más robusto
    ctx.fillStyle = '#882222';
    this._roundRect(ctx, -w*0.42, h*0.12, w*0.84, h*0.5, 4);
    ctx.fill();
    // Detalle
    ctx.fillStyle = '#661818';
    ctx.fillRect(-w*0.12, h*0.12, w*0.24, h*0.5);

    // Brazos
    const armSwing = Math.sin(frame*0.48)*28;
    this._drawArm(ctx, -w*0.42, h*0.15, armSwing, '#4a2828');
    this._drawArm(ctx, w*0.42, h*0.15, -armSwing, '#4a2828');

    // Cuello
    ctx.fillStyle = '#b8785a';
    ctx.fillRect(-5, h*0.08, 10, h*0.1);

    // Cabeza redondeada — pelado en el centro
    const hx = -w*0.44, hy = -h*0.22, hw = w*0.88, hh = h*0.38;
    ctx.fillStyle = '#b8785a';
    this._roundRect(ctx, hx, hy, hw, hh, 8);
    ctx.fill();

    // Pelo SOLO en los costados (pelado en centro)
    ctx.fillStyle = '#0f0804';
    ctx.fillRect(hx, hy, hw*0.22, hh*0.7);        // pelo izquierdo
    ctx.fillRect(hx+hw*0.78, hy, hw*0.22, hh*0.7); // pelo derecho
    // Calva brillante
    ctx.fillStyle = 'rgba(255,255,200,0.07)';
    ctx.ellipse(0, hy+hh*0.2, hw*0.22, hh*0.15, 0, 0, Math.PI*2);
    ctx.fill();

    // Ojos — expresión agresiva
    ctx.fillStyle = '#1a0808';
    ctx.beginPath();
    ctx.ellipse(hx+hw*0.26, hy+hh*0.5, hw*0.1, hh*0.09, -0.3, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(hx+hw*0.72, hy+hh*0.5, hw*0.1, hh*0.09, 0.3, 0, Math.PI*2);
    ctx.fill();
    // Cejas muy fruncidas — enojado
    ctx.strokeStyle = '#0f0804';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(hx+hw*0.14, hy+hh*0.3);
    ctx.lineTo(hx+hw*0.40, hy+hh*0.4);
    ctx.moveTo(hx+hw*0.58, hy+hh*0.4);
    ctx.lineTo(hx+hw*0.84, hy+hh*0.3);
    ctx.stroke();

    // Barba mal recortada
    ctx.fillStyle = 'rgba(30,15,8,0.55)';
    for (let i = 0; i < 12; i++) {
      const bx = hx + hw*0.14 + i*(hw*0.065);
      const by = hy + hh*(0.68+Math.random()*0.12);
      ctx.beginPath();
      ctx.arc(bx, by, 2.2, 0, Math.PI*2);
      ctx.fill();
    }
    // Parches sin barba
    ctx.fillStyle = '#b8785a';
    ctx.fillRect(hx+hw*0.35, hy+hh*0.62, hw*0.12, hh*0.2);
    ctx.fillRect(hx+hw*0.58, hy+hh*0.65, hw*0.10, hh*0.18);

    // Boca — abierta, gritando
    ctx.fillStyle = '#3a1010';
    ctx.beginPath();
    ctx.ellipse(0, hy+hh*0.82, hw*0.18, hh*0.1, 0, 0, Math.PI*2);
    ctx.fill();
    // Dientes
    ctx.fillStyle = '#ddeedd';
    ctx.fillRect(-hw*0.10, hy+hh*0.78, hw*0.08, hh*0.07);
    ctx.fillRect(hw*0.02, hy+hh*0.78, hw*0.08, hh*0.07);

    ctx.restore();
  },

  /* ── Obstáculos ── */
  drawObstacle(ctx, obs) {
    ctx.save();
    const x = obs.x, y = obs.y, w = obs.w, h = obs.h;

    if (obs.id === 'caja') {
      ctx.fillStyle = obs.color;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = obs.color2;
      ctx.lineWidth = 2;
      ctx.strokeRect(x+2, y+2, w-4, h-4);
      // Símbolo
      ctx.strokeStyle = obs.color2;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x+6, y+6); ctx.lineTo(x+w-6, y+h-6);
      ctx.moveTo(x+w-6, y+6); ctx.lineTo(x+6, y+h-6);
      ctx.stroke();
    } else if (obs.id === 'cable') {
      ctx.strokeStyle = obs.color;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(x+w/2, y);
      // Ondulado
      for (let i = 0; i < h; i += 10) {
        ctx.lineTo(x+w/2 + Math.sin(i*0.3)*4, y+i);
      }
      ctx.stroke();
      ctx.strokeStyle = obs.color2;
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (obs.id === 'charco') {
      const grd = ctx.createRadialGradient(x+w/2, y+h/2, 0, x+w/2, y+h/2, w/2);
      grd.addColorStop(0, '#4488ff');
      grd.addColorStop(1, '#1a3a5c');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.ellipse(x+w/2, y+h/2, w/2, h/2, 0, 0, Math.PI*2);
      ctx.fill();
      // Brillo
      ctx.fillStyle = 'rgba(100,180,255,0.3)';
      ctx.beginPath();
      ctx.ellipse(x+w*0.35, y+h*0.35, w*0.15, h*0.15, -0.5, 0, Math.PI*2);
      ctx.fill();
    } else if (obs.id === 'banco') {
      // Tablero
      ctx.fillStyle = obs.color;
      ctx.fillRect(x, y+8, w, h-20);
      // Patas
      ctx.fillStyle = obs.color2;
      ctx.fillRect(x+6, y+h-12, 10, 12);
      ctx.fillRect(x+w-16, y+h-12, 10, 12);
      // Borde superior
      ctx.fillStyle = obs.color2;
      ctx.fillRect(x, y+8, w, 5);
    } else if (obs.id === 'robot') {
      // Cuerpo
      ctx.fillStyle = obs.color;
      ctx.fillRect(x+8, y+20, w-16, h-20);
      // Cabeza
      ctx.fillStyle = obs.color2;
      ctx.fillRect(x+10, y, w-20, 22);
      // Ojos
      ctx.fillStyle = '#ff2244';
      ctx.beginPath();
      ctx.arc(x+16, y+10, 4, 0, Math.PI*2);
      ctx.arc(x+w-16, y+10, 4, 0, Math.PI*2);
      ctx.fill();
      // Brazo caído
      ctx.fillStyle = obs.color;
      ctx.fillRect(x, y+26, 9, 30);
    } else if (obs.id === 'barril') {
      ctx.fillStyle = obs.color;
      this._roundRect(ctx, x, y, w, h, 6);
      ctx.fill();
      ctx.strokeStyle = obs.color2;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x+4, y+h*0.3); ctx.lineTo(x+w-4, y+h*0.3);
      ctx.moveTo(x+4, y+h*0.7); ctx.lineTo(x+w-4, y+h*0.7);
      ctx.stroke();
      // Símbolo
      ctx.strokeStyle = '#ff4400';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x+w/2, y+h/2, 8, 0, Math.PI*2);
      ctx.stroke();
    } else if (obs.id === 'herram') {
      // Llave inglesa
      ctx.fillStyle = obs.color;
      ctx.fillRect(x+10, y+6, w-20, h-6);
      ctx.beginPath();
      ctx.arc(x+6, y+14, 10, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = obs.color2;
      ctx.beginPath();
      ctx.arc(x+6, y+14, 5, 0, Math.PI*2);
      ctx.fill();
    }

    ctx.restore();
  },

  /* ── Power-up ── */
  drawPowerup(ctx, p) {
    ctx.save();
    const pulse = 0.85 + 0.15 * Math.sin(GameState.frame * 0.12);
    ctx.translate(p.x + p.w/2, p.y + p.h/2);
    ctx.scale(pulse, pulse);

    // Brillo exterior
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = p.color + '33';
    ctx.beginPath();
    ctx.arc(0, 0, p.w, 0, Math.PI*2);
    ctx.fill();

    // Hexágono
    ctx.fillStyle = p.color;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i/6) * Math.PI*2 - Math.PI/6;
      if (i===0) ctx.moveTo(Math.cos(a)*p.w*0.55, Math.sin(a)*p.w*0.55);
      else ctx.lineTo(Math.cos(a)*p.w*0.55, Math.sin(a)*p.w*0.55);
    }
    ctx.closePath();
    ctx.fill();

    // Ícono central
    ctx.fillStyle = '#000';
    ctx.font = `bold ${p.w*0.55}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.id==='shield'?'⚡': p.id==='magnet'?'⚙':'⏱', 0, 2);

    ctx.restore();
  },

  /* ── Efectos de velocidad (líneas de motion blur) ── */
  drawSpeedLines(ctx, cW, cH, speed) {
    if (speed < 7) return;
    const alpha = Math.min(0.15, (speed - 7) / 40);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = 'rgba(0,212,255,0.4)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      const y = Math.random() * cH;
      const len = 40 + Math.random() * 80;
      ctx.beginPath();
      ctx.moveTo(Math.random() * cW, y);
      ctx.lineTo(Math.random() * cW - len, y);
      ctx.stroke();
    }
    ctx.restore();
  },

  /* ── Vignette de peligro ── */
  drawDangerVignette(ctx, cW, cH, danger) {
    if (danger < 0.3) return;
    const alpha = (danger - 0.3) / 0.7 * 0.45;
    const pulse = 0.5 + 0.5 * Math.sin(GameState.frame * 0.15);
    ctx.save();
    const grad = ctx.createRadialGradient(cW/2, cH/2, cH*0.3, cW/2, cH/2, cH);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, `rgba(255,20,50,${alpha * pulse})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cW, cH);
    ctx.restore();
  },

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
  },
};

/* ================================================================
   INPUT HANDLER
   ================================================================ */
const Input = {
  keys: {},
  jumpPressed: false,
  slidePressed: false,

  init() {
    document.addEventListener('keydown', e => {
      if (this.keys[e.code]) return;
      this.keys[e.code] = true;

      if (['Space','ArrowUp','KeyW'].includes(e.code)) {
        this.jumpPressed = true;
        e.preventDefault();
      }
      if (['ArrowDown','KeyS'].includes(e.code)) {
        this.slidePressed = true;
        e.preventDefault();
      }
    });
    document.addEventListener('keyup', e => {
      this.keys[e.code] = false;
    });

    // Táctil — mitad superior = saltar, mitad inferior = deslizar
    document.addEventListener('touchstart', e => {
      e.preventDefault();
      const y = e.touches[0].clientY;
      if (y < window.innerHeight * 0.6) this.jumpPressed = true;
      else this.slidePressed = true;
    }, { passive: false });
  },

  consume() {
    const j = this.jumpPressed;
    const s = this.slidePressed;
    this.jumpPressed = false;
    this.slidePressed = false;
    return { jump: j, slide: s };
  },
};

/* ================================================================
   UI HELPERS
   ================================================================ */
const UI = {
  scoreEl:    document.getElementById('scoreDisplay'),
  distEl:     document.getElementById('distanceDisplay'),
  speedEl:    document.getElementById('speedDisplay'),
  levelEl:    document.getElementById('levelDisplay'),
  dangerEl:   document.getElementById('dangerBar'),
  startScr:   document.getElementById('startScreen'),
  gameOverScr:document.getElementById('gameOverScreen'),
  goScore:    document.getElementById('goScore'),
  goDist:     document.getElementById('goDistance'),
  goSpeed:    document.getElementById('goSpeed'),
  powMsg:     document.getElementById('powerupMsg'),
  hudEl:      document.getElementById('hud'),

  updateHUD(state) {
    this.scoreEl.textContent = Math.floor(state.score).toLocaleString();
    this.distEl.textContent  = Math.floor(state.distance) + ' m';
    this.speedEl.textContent = Math.floor(state.speed * 8) + ' km/h';
    this.levelEl.textContent = state.level;
    this.dangerEl.style.width = (state.dangerPct * 100) + '%';
  },

  showStart() {
    this.startScr.classList.add('active');
    this.gameOverScr.classList.remove('active');
    this.hudEl.style.display = 'none';
  },

  showGameOver(state) {
    this.goScore.textContent = Math.floor(state.score).toLocaleString();
    this.goDist.textContent  = Math.floor(state.distance) + ' m';
    this.goSpeed.textContent = Math.floor(state.maxSpeed * 8) + ' km/h';
    this.gameOverScr.classList.add('active');
    this.hudEl.style.display = 'none';
  },

  startGame() {
    this.startScr.classList.remove('active');
    this.gameOverScr.classList.remove('active');
    this.hudEl.style.display = 'flex';
  },

  showPowerup(label) {
    this.powMsg.textContent = label;
    this.powMsg.classList.remove('show');
    void this.powMsg.offsetWidth; // reflow
    this.powMsg.classList.add('show');
    setTimeout(() => this.powMsg.classList.remove('show'), 2100);
  },
};

/* ================================================================
   CANVAS Y RESIZE
   ================================================================ */
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
let cW, cH, floorY;

function resize() {
  cW = canvas.width  = window.innerWidth;
  cH = canvas.height = window.innerHeight;
  floorY = Math.floor(cH * C.FLOOR_Y_RATIO);

  // Reposicionar Luca
  Player.x = Math.floor(cW * 0.22);
  Player.y = floorY - Player.h;
  Player.vy = 0;

  // Diego empieza a la izquierda fuera de pantalla
  Diego.x = Player.x - GameState.diegoGap;
  Diego.y = floorY - Diego.h;

  // Fondo
  Background.init(cW, cH);
}

window.addEventListener('resize', () => {
  resize();
});

/* ================================================================
   INICIALIZACIÓN DEL JUEGO
   ================================================================ */
function initGame() {
  // Estado
  GameState.running   = false;
  GameState.score     = 0;
  GameState.distance  = 0;
  GameState.speed     = C.BASE_SPEED;
  GameState.lucaSpeed = C.BASE_SPEED;
  GameState.diegoSpeed = C.BASE_SPEED - 0.5;  // Diego siempre un poco más lento
  GameState.maxSpeed  = C.BASE_SPEED;
  GameState.level     = 1;
  GameState.frame     = 0;
  GameState.diegoGap  = 550;
  GameState.dangerPct = 0;
  GameState.hitCooldown  = 0;
  GameState.powerupTimer = C.POWERUP_INTERVAL;
  GameState.activePowerup = null;

  // Jugador
  Player.vy       = 0;
  Player.onGround = true;
  Player.jumpsLeft = 2;
  Player.sliding  = false;
  Player.slideTimer = 0;
  Player.runFrame  = 0;
  Player.runTick   = 0;

  // Diego
  Diego.runFrame = 0;
  Diego.runTick  = 0;

  // Sistemas
  Obstacles.reset();
  PowerupSystem.reset();
  Particles.reset();

  resize();
}

/* ================================================================
   LÓGICA DE FÍSICA Y ACTUALIZACIÓN
   ================================================================ */
function updatePlayer(inp) {
  const gs = GameState;
  const p  = Player;

  // Salto
  if (inp.jump && p.jumpsLeft > 0 && !p.sliding) {
    p.vy = C.JUMP_FORCE;
    p.jumpsLeft--;
    p.onGround = false;
    AudioSystem.jump();
    Particles.emit(p.x+p.w/2, p.y+p.h, '#00d4ff', 8);
  }

  // Deslizamiento
  if (inp.slide && p.onGround && !p.sliding) {
    p.sliding   = true;
    p.slideTimer = C.SLIDE_DUR;
  }

  if (p.sliding) {
    p.slideTimer--;
    if (p.slideTimer <= 0) p.sliding = false;
  }

  // Gravedad
  if (!p.onGround) {
    p.vy += C.GRAVITY;
    p.y  += p.vy;
  }

  // Suelo
  if (p.y + p.h >= floorY) {
    p.y  = floorY - p.h;
    if (!p.onGround && p.vy > 2) {
      AudioSystem.land();
      Particles.emit(p.x+p.w/2, p.y+p.h, '#8899aa', 6);
    }
    p.vy       = 0;
    p.onGround = true;
    p.jumpsLeft = 2;
  }

  // Sonido de pasos
  if (p.onGround && !p.sliding && gs.frame - gs.lastStepFrame > 14) {
    AudioSystem.step();
    gs.lastStepFrame = gs.frame;
    Particles.emit(p.x + (p.runFrame>2?p.w:0), p.y+p.h, '#445566', 2);
  }

  // Animación de correr
  p.runTick++;
  if (p.runTick >= 4) { p.runTick = 0; p.runFrame = (p.runFrame+1) % 6; }
}

function updateDiego() {
  const gs = GameState;
  const d  = Diego;

  // Distancia deseada entre Diego y Luca
  const targetGap = gs.diegoGap;

  // Posición objetivo de Diego
  const targetX = Player.x - targetGap;

  // Diego solo intenta mantenerse detrás de Luca
  // NO gana terreno automáticamente
  d.x += (targetX - d.x) * 0.08;

  // Velocidad visual para animaciones/HUD
  gs.diegoSpeed = gs.lucaSpeed;

  // Distancia real
  const realGap = Player.x - d.x - d.w;

  // Barra de peligro
  gs.dangerPct = Math.max(0, Math.min(1, 1 - (realGap / 600)));

  // Sonido de peligro
  AudioSystem.danger(gs.dangerPct);

  // Animación
  d.runTick++;
  if (d.runTick >= 4) {
    d.runTick = 0;
    d.runFrame = (d.runFrame + 1) % 6;
  }

  // Mantenerlo en el suelo
  d.y = floorY - d.h;

  // GAME OVER solo si realmente lo alcanza
  if (realGap <= 5 && gs.hitCooldown <= 0) {
    return true;
  }

  return false;
}

function checkObstacleCollisions() {
  const gs = GameState;
  const p  = Player;
  if (gs.hitCooldown > 0) return;

  // Hitbox reducida para ser más justo
  const phx = p.x + p.w*0.15;
  const phy = p.sliding ? p.y + p.h*0.5 : p.y + p.h*0.12;
  const phw = p.w * 0.7;
  const phh = p.sliding ? p.h * 0.5 : p.h * 0.88;

  for (const obs of Obstacles.list) {
    if (phx < obs.x+obs.w-4 && phx+phw > obs.x+4 && phy < obs.y+obs.h-4 && phy+phh > obs.y+4) {
      // Golpe - DISMINUYE velocidad de Luca
      gs.hitCooldown  = C.COLLISION_GRACE;
      gs.lucaSpeed = Math.max(C.BASE_SPEED, gs.lucaSpeed - 2.5);  // pierde velocidad
      gs.diegoGap = Math.max(200, gs.diegoGap - 60);  // Diego se acerca
      AudioSystem.hit();
      Particles.emit(p.x+p.w/2, p.y+p.h/2, '#ff4422', 14, 'hit');
      break;
    }
  }
}

function checkPowerupCollection() {
  const p = Player;
  const pow = PowerupSystem.checkCollect(p.x, p.y, p.w, p.h);
  if (pow) {
    AudioSystem.powerup();
    GameState.activePowerup = { type: pow.id, timer: pow.dur };
    UI.showPowerup(pow.label);

    if (pow.id === 'shield') {
      GameState.hitCooldown = Math.max(GameState.hitCooldown, pow.dur);
    } else if (pow.id === 'magnet') {
      // Turbo: aumenta velocidad de Luca
      GameState.lucaSpeed = Math.min(GameState.lucaSpeed + 3, C.MAX_SPEED);
    } else if (pow.id === 'slow') {
      // Tiempo lento: Diego se aleja
      GameState.diegoGap = Math.min(GameState.diegoGap + 120, GameState.diegoMaxGap || 550);
    }
  }
}

/* ================================================================
   LOOP PRINCIPAL
   ================================================================ */
function gameLoop() {
  if (!GameState.running) return;

  const gs = GameState;
  gs.frame++;

  /* ── Input ── */
  const inp = Input.consume();

  /* ── Velocidad creciente de Luca ── */
  gs.lucaSpeed = Math.min(C.MAX_SPEED, C.BASE_SPEED + gs.frame * C.SPEED_INC);
  gs.speed = gs.lucaSpeed;  // actualizar variable global para HUD
  if (gs.lucaSpeed > gs.maxSpeed) gs.maxSpeed = gs.lucaSpeed;

  /* ── Nivel ── */
  gs.level = Math.floor(1 + (gs.lucaSpeed - C.BASE_SPEED) / 1.5);

  /* ── Cooldowns ── */
  if (gs.hitCooldown > 0) gs.hitCooldown--;

  // Power-up activo
  if (gs.activePowerup) {
    gs.activePowerup.timer--;
    if (gs.activePowerup.timer <= 0) gs.activePowerup = null;
  }

  /* ── Actualizar jugador ── */
  updatePlayer(inp);

  /* ── Obstáculos ── */
  Obstacles.update(cW, floorY, gs.lucaSpeed);
  checkObstacleCollisions();

  /* ── Power-ups ── */
  gs.powerupTimer--;
  if (gs.powerupTimer <= 0) {
    gs.powerupTimer = C.POWERUP_INTERVAL + Math.floor(Math.random() * 100);
    PowerupSystem.spawn(cW, floorY);
  }
  PowerupSystem.update(cW, floorY, gs.lucaSpeed);
  checkPowerupCollection();

  /* ── Diego ── */
  const caught = updateDiego();
  if (caught) {
    endGame();
    return;
  }

  /* ── Score / Distancia ── */
  gs.distance += gs.lucaSpeed * 0.05;
  gs.score    += gs.lucaSpeed * 0.1;

  /* ── Partículas ── */
  Particles.update();

  /* ── Fondo ── */
  Background.update(gs.lucaSpeed);

  /* ── RENDER ── */
  ctx.clearRect(0, 0, cW, cH);
  Background.draw(ctx, cW, cH, floorY);

  // Partículas detrás de personajes
  Particles.draw(ctx);

  // Obstáculos
  Obstacles.list.forEach(o => Renderer.drawObstacle(ctx, o));

  // Power-ups
  PowerupSystem.list.forEach(p => Renderer.drawPowerup(ctx, p));

  // Diego
  Renderer.drawDiego(ctx, Diego, Diego.runFrame);

  // Luca
  Renderer.drawLuca(ctx, Player, Player.runFrame, Player.sliding, gs.hitCooldown);

  // FX
  Renderer.drawSpeedLines(ctx, cW, cH, gs.lucaSpeed);
  Renderer.drawDangerVignette(ctx, cW, cH, gs.dangerPct);

  // HUD
  UI.updateHUD(gs);

  requestAnimationFrame(gameLoop);
}

/* ================================================================
   INICIO / FIN
   ================================================================ */
function startGame() {
  AudioSystem.init();
  initGame();
  GameState.running = true;
  UI.startGame();
  requestAnimationFrame(gameLoop);
}

function endGame() {
  GameState.running = false;
  AudioSystem.gameOver();

  // Dibujar una última vez con Diego encima
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(0, 0, cW, cH);
  ctx.restore();

  setTimeout(() => UI.showGameOver(GameState), 600);
}

/* ================================================================
   PREVIEW EN PANTALLA DE INICIO
   ================================================================ */
function drawPreview() {
  const pc = document.getElementById('previewCanvas');
  if (!pc) return;
  const pctx = pc.getContext('2d');
  const w = pc.width, h = pc.height;
  const fl = h * 0.8;

  // Fondo simple
  pctx.fillStyle = '#0d1420';
  pctx.fillRect(0, 0, w, h);
  // Suelo
  pctx.fillStyle = '#1e2535';
  pctx.fillRect(0, fl, w, h-fl);
  pctx.strokeStyle = 'rgba(0,212,255,0.4)';
  pctx.lineWidth = 2;
  pctx.beginPath(); pctx.moveTo(0,fl); pctx.lineTo(w,fl); pctx.stroke();

  // Texto
  pctx.fillStyle = 'rgba(0,212,255,0.15)';
  pctx.font = '10px monospace';
  pctx.fillText('LUCA', w*0.35, fl-20);
  pctx.fillStyle = 'rgba(255,80,40,0.15)';
  pctx.fillText('DIEGO', w*0.08, fl-20);

  // Dibujar personajes estáticos en la preview
  const lucaFake = { x: w*0.52, y: fl-72, w:46, h:72, vy:0, onGround:true, jumpsLeft:2, sliding:false, slideTimer:0, runFrame:0, runTick:0 };
  const diegoFake = { x: w*0.12, y: fl-76, w:50, h:76 };

  Renderer.drawDiego(pctx, diegoFake, 2);
  Renderer.drawLuca(pctx, lucaFake, 2, false, 0);

  // Arrow "chasing"
  pctx.fillStyle = '#ff4422';
  pctx.font = 'bold 18px monospace';
  pctx.fillText('→→→', w*0.33, fl-30);
}

/* ================================================================
   EVENTOS DE BOTONES
   ================================================================ */
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);
document.getElementById('menuBtn').addEventListener('click', () => {
  GameState.running = false;
  initGame();
  UI.showStart();
  drawPreview();
});

/* ================================================================
   ARRANQUE INICIAL
   ================================================================ */
resize();
Input.init();
UI.showStart();

// Pequeño loop de preview animado en la pantalla de inicio
let previewFrame = 0;
function previewLoop() {
  if (GameState.running) return;
  previewFrame++;
  if (previewFrame % 3 === 0) drawPreview();
  requestAnimationFrame(previewLoop);
}
previewLoop();
