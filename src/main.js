import {
  Application,
  Assets,
  AnimatedSprite,
  Container,
  Graphics,
  Sprite,
  Text,
} from "pixi.js";

import { gsap } from "gsap";

// Спокойный кинематографичный темп всего подарка
// 0.70 = примерно на 43% медленнее исходной версии.
gsap.globalTimeline.timeScale(0.70);

const app = new Application();

const W = 390;
const H = 844;

async function start() {
  await app.init({
    resizeTo: window,
    backgroundColor: 0x07060b,
    antialias: true,
    autoDensity: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
  });

  document.documentElement.style.margin = "0";
  document.documentElement.style.width = "100%";
  document.documentElement.style.height = "100%";
  document.documentElement.style.background = "#07060b";

  document.body.style.margin = "0";
  document.body.style.width = "100%";
  document.body.style.height = "100%";
  document.body.style.overflow = "hidden";
  document.body.style.background = "#07060b";
  document.body.style.touchAction = "none";

  app.canvas.style.position = "fixed";
  app.canvas.style.inset = "0";
  app.canvas.style.width = "100vw";
  app.canvas.style.height = "100vh";
  app.canvas.style.touchAction = "none";

  document.body.appendChild(app.canvas);

  // =====================================================
  // СПРАЙТЫ ПЕРСОНАЖЕЙ
  // Файлы лежат в public/sprites/
  // =====================================================

  const spritePaths = {
    obsidIdle: "/sprites/obsid_idle.png",
    obsidWalk1: "/sprites/obsid_walk1.png",
    obsidWalk2: "/sprites/obsid_walk2.png",

    kessiIdle: "/sprites/kessi_idle.png",
    kessiWalk1: "/sprites/kessi_walk1.png",
    kessiWalk2: "/sprites/kessi_walk2.png",

    dragonIdle: "/sprites/dragon_idle.png",
    dragonWalk1: "/sprites/dragon_walk1.png",
    dragonWalk2: "/sprites/dragon_walk2.png",
    dragonIcecream: "/sprites/dragon_icecream.png",
  };

  const spriteTextures = {};

  for (const [name, url] of Object.entries(spritePaths)) {
    spriteTextures[name] = await Assets.load(url);
  }


  // Кадр для экрана кинотеатра.
  // Положи свой JPG в public/bg/rapunzel-frame.jpg.
  // Если файла нет — код не ломается, просто остаётся абстрактный экран.
  let rapunzelTexture = null;
  try {
    rapunzelTexture = await Assets.load("/bg/rapunzel-frame.jpg");
  } catch (e) {
    console.warn("rapunzel-frame.jpg не найден — используем заглушку");
  }

  // =====================================================
  // ОСНОВНАЯ СЦЕНА 390x844
  // =====================================================

  const world = new Container();
  app.stage.addChild(world);

  function fitWorld() {
    const scale = Math.min(
      app.screen.width / W,
      app.screen.height / H
    );

    world.scale.set(scale);

    world.position.set(
      (app.screen.width - W * scale) / 2,
      (app.screen.height - H * scale) / 2
    );
  }

  fitWorld();
  window.addEventListener("resize", fitWorld);

  // =====================================================
  // СЦЕНА 1 — ПОДАРОК
  // =====================================================

  const intro = new Container();
  world.addChild(intro);

  // фон
  const introBg = new Graphics()
    .rect(0, 0, W, H)
    .fill(0x090711);

  intro.addChild(introBg);

  // розово-фиолетовое свечение
  const glow1 = new Graphics()
    .circle(195, 430, 230)
    .fill({
      color: 0xb51655,
      alpha: 0.11,
    });

  intro.addChild(glow1);

  const glow2 = new Graphics()
    .circle(195, 470, 160)
    .fill({
      color: 0xff6c9f,
      alpha: 0.13,
    });

  intro.addChild(glow2);

  gsap.to(glow2.scale, {
    x: 1.18,
    y: 1.18,
    duration: 2.8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // =====================================================
  // ЗВЁЗДОЧКИ
  // =====================================================

  for (let i = 0; i < 28; i++) {
    const star = new Graphics()
      .circle(0, 0, Math.random() * 1.5 + 0.6)
      .fill({
        color: 0xffd5e5,
        alpha: Math.random() * 0.65 + 0.25,
      });

    star.x = Math.random() * W;
    star.y = Math.random() * 600;

    intro.addChild(star);

    gsap.to(star, {
      alpha: 0.15,
      duration: 0.8 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: Math.random() * 2,
    });
  }

  // =====================================================
  // ЛЕПЕСТКИ
  // =====================================================

  const petals = [];

  for (let i = 0; i < 14; i++) {
    const petal = new Graphics()
      .ellipse(0, 0, 10, 5)
      .fill({
        color: 0xcc285c,
        alpha: 0.45 + Math.random() * 0.4,
      });

    petal.x = Math.random() * W;
    petal.y = Math.random() * H;

    petal.rotation = Math.random() * Math.PI;

    intro.addChild(petal);
    petals.push(petal);

    animatePetal(petal);
  }

  function animatePetal(petal) {
    const duration = 6 + Math.random() * 7;

    gsap.fromTo(
      petal,
      {
        y: -30 - Math.random() * 300,
        x: Math.random() * W,
        rotation: Math.random() * Math.PI,
      },
      {
        y: H + 40,
        x: "+=" + (Math.random() * 130 - 65),
        rotation: "+=" + (Math.random() * 6 - 3),
        duration,
        repeat: -1,
        ease: "none",
        delay: Math.random() * 6,
      }
    );
  }

  // =====================================================
  // ПОЛ / ОТРАЖЕНИЕ
  // =====================================================

  const floor = new Graphics()
    .rect(0, 610, W, 234)
    .fill(0x100811);

  intro.addChild(floor);

  const floorGlow = new Graphics()
    .ellipse(195, 664, 155, 35)
    .fill({
      color: 0xff477e,
      alpha: 0.11,
    });

  intro.addChild(floorGlow);

  // =====================================================
  // КОРОБКА
  // =====================================================

  const gift = new Container();
  gift.x = W / 2;
  gift.y = 500;

  intro.addChild(gift);

  gift.eventMode = "static";
  gift.cursor = "pointer";

  // тень
  const shadow = new Graphics()
    .ellipse(0, 141, 117, 23)
    .fill({
      color: 0x000000,
      alpha: 0.48,
    });

  gift.addChild(shadow);

  // корпус
  const box = new Graphics()
    .roundRect(-104, -5, 208, 145, 18)
    .fill(0xf4e7e7);

  gift.addChild(box);

  // затемнение снизу
  const boxShade = new Graphics()
    .roundRect(-104, 75, 208, 65, 18)
    .fill({
      color: 0xb68d98,
      alpha: 0.14,
    });

  gift.addChild(boxShade);

  // вертикальная красная лента
  const verticalRibbon = new Graphics()
    .rect(-19, -5, 38, 145)
    .fill(0x9e1537);

  gift.addChild(verticalRibbon);

  // отблеск ленты
  const ribbonShine = new Graphics()
    .rect(-13, -5, 7, 145)
    .fill({
      color: 0xff7b99,
      alpha: 0.18,
    });

  gift.addChild(ribbonShine);

  // =====================================================
  // КРЫШКА
  // =====================================================

  const lid = new Container();
  gift.addChild(lid);

  const lidBody = new Graphics()
    .roundRect(-116, -48, 232, 54, 16)
    .fill(0xffeeee);

  lid.addChild(lidBody);

  const horizontalRibbon = new Graphics()
    .rect(-116, -31, 232, 26)
    .fill(0x9e1537);

  lid.addChild(horizontalRibbon);

  // =====================================================
  // БАНТ
  // =====================================================

  const bow = new Container();
  bow.y = -53;
  lid.addChild(bow);

  const bowLeft = new Graphics()
    .ellipse(-32, 0, 39, 19)
    .fill(0xaa153d);

  bowLeft.rotation = -0.3;

  const bowRight = new Graphics()
    .ellipse(32, 0, 39, 19)
    .fill(0xaa153d);

  bowRight.rotation = 0.3;

  const bowCenter = new Graphics()
    .roundRect(-15, -12, 30, 24, 8)
    .fill(0xc11b47);

  bow.addChild(
    bowLeft,
    bowRight,
    bowCenter
  );

  // =====================================================
  // БИРКА
  // =====================================================

  const tag = new Container();

  tag.x = 78;
  tag.y = -27;
  tag.rotation = 0.12;

  lid.addChild(tag);

  const tagBg = new Graphics()
    .roundRect(-43, -20, 86, 40, 8)
    .fill(0xf7e8db);

  tag.addChild(tagBg);

  const tagText = new Text({
    text: "тык...?",
    style: {
      fill: 0x382027,
      fontSize: 18,
      fontFamily: "Arial",
      fontWeight: "600",
    },
  });

  tagText.anchor.set(0.5);
  tagText.x = -3;

  tag.addChild(tagText);

  const heart = new Text({
    text: "♡",
    style: {
      fill: 0xa8193e,
      fontSize: 21,
    },
  });

  heart.anchor.set(0.5);
  heart.x = 28;
  heart.y = 12;

  tag.addChild(heart);

  // =====================================================
  // ПЛАВНОЕ ПАРЕНИЕ
  // =====================================================

  gsap.to(gift, {
    y: gift.y - 7,
    duration: 2.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // лёгкое движение бирки
  gsap.to(tag, {
    rotation: 0.06,
    duration: 1.8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // =====================================================
  // СЦЕНА ТЕКСТА
  // =====================================================

  const quoteScene = new Container();
  quoteScene.alpha = 0;

  world.addChild(quoteScene);

  const quoteBg = new Graphics()
    .rect(0, 0, W, H)
    .fill(0x07060b);

  quoteScene.addChild(quoteBg);

  const quote1 = new Text({
    text: "Если захотеть...\nможно и в космос полететь)",
    style: {
      fill: 0xffffff,
      fontFamily: "Arial",
      fontSize: 26,
      fontWeight: "500",
      align: "center",
      lineHeight: 37,
      wordWrap: true,
      wordWrapWidth: 330,
    },
  });

  quote1.anchor.set(0.5);
  quote1.position.set(W / 2, H / 2 - 45);
  quote1.alpha = 0;

  quoteScene.addChild(quote1);

  const quote2 = new Text({
    text: "Так что несколько километров —\nвообще не аргумент.",
    style: {
      fill: 0xf4c7d7,
      fontFamily: "Arial",
      fontSize: 20,
      align: "center",
      lineHeight: 31,
    },
  });

  quote2.anchor.set(0.5);
  quote2.position.set(W / 2, H / 2 + 70);
  quote2.alpha = 0;

  quoteScene.addChild(quote2);

  // =====================================================
  // СЦЕНА 2 — ЗАКАТНЫЙ ПАРК
  // =====================================================

  const park = new Container();
  park.alpha = 0;

  world.addChild(park);

  // небо — несколько цветовых полос
  const sky = new Graphics();

  sky
    .rect(0, 0, W, 220)
    .fill(0x3a234d);

  sky
    .rect(0, 220, W, 170)
    .fill(0x75405d);

  sky
    .rect(0, 390, W, 170)
    .fill(0xd36b77);

  sky
    .rect(0, 560, W, 100)
    .fill(0xf1a070);

  park.addChild(sky);

  // солнце
  const sunGlow = new Graphics()
    .circle(305, 340, 80)
    .fill({
      color: 0xffc187,
      alpha: 0.1,
    });

  park.addChild(sunGlow);

  const sun = new Graphics()
    .circle(305, 340, 27)
    .fill(0xffc995);

  park.addChild(sun);

  // дальний город
  const city = new Container();
  park.addChild(city);

  const buildings = [
    [0, 450, 48, 150],
    [44, 475, 42, 125],
    [82, 430, 55, 170],
    [132, 490, 40, 110],
    [168, 455, 65, 145],
    [225, 480, 50, 120],
    [270, 420, 54, 180],
    [320, 460, 70, 140],
  ];

  buildings.forEach(([x, y, w, h], index) => {
    const b = new Graphics()
      .rect(x, y, w, h)
      .fill(
        index % 2 === 0
          ? 0x34283d
          : 0x403047
      );

    city.addChild(b);

    // несколько светящихся окон
    for (let j = 0; j < 3; j++) {
      const win = new Graphics()
        .rect(
          x + 8 + j * 11,
          y + 15 + (j % 2) * 20,
          4,
          7
        )
        .fill({
          color: 0xffd497,
          alpha: 0.55,
        });

      city.addChild(win);
    }
  });

  // дальние деревья
  const farTrees = new Container();
  park.addChild(farTrees);

  for (let x = -20; x < 430; x += 38) {
    const tree = new Graphics()
      .circle(x, 585, 43)
      .fill(0x202530);

    farTrees.addChild(tree);
  }

  // земля
  const ground = new Graphics()
    .rect(0, 585, W, 259)
    .fill(0x151c22);

  park.addChild(ground);

  // дорожка
  const path = new Graphics();

  path
    .moveTo(135, 844)
    .lineTo(173, 585)
    .lineTo(215, 585)
    .lineTo(300, 844)
    .closePath()
    .fill(0x423740);

  park.addChild(path);

  // мягкий свет дорожки
  const pathLight = new Graphics()
    .ellipse(206, 700, 100, 210)
    .fill({
      color: 0xd36c78,
      alpha: 0.04,
    });

  park.addChild(pathLight);

  // =====================================================
  // ЖИВОЙ ПАРК: облака, клумбы, лавочка, светлячки, листья
  // =====================================================

  // мягкие облака на закате
  const clouds = new Container();
  park.addChild(clouds);

  function addCloud(x, y, scale, alpha = 0.12) {
    const c = new Graphics()
      .ellipse(0, 0, 44, 13).fill({ color: 0xffd2d2, alpha })
      .ellipse(-26, 2, 26, 9).fill({ color: 0xffd2d2, alpha: alpha * 0.9 })
      .ellipse(28, 1, 31, 10).fill({ color: 0xffd2d2, alpha: alpha * 0.85 });
    c.position.set(x, y);
    c.scale.set(scale);
    clouds.addChild(c);

    gsap.to(c, {
      x: x + 18,
      duration: 18 + Math.random() * 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  addCloud(78, 225, 0.85, 0.09);
  addCloud(260, 285, 1.05, 0.08);
  addCloud(170, 160, 0.62, 0.06);

  // камни/блики на дорожке
  const pathDetails = new Container();
  park.addChild(pathDetails);

  [
    [173, 785, 16, 4],
    [235, 748, 12, 3],
    [188, 700, 10, 3],
    [221, 658, 8, 2],
    [194, 625, 6, 2],
  ].forEach(([x, y, rx, ry]) => {
    pathDetails.addChild(
      new Graphics()
        .ellipse(x, y, rx, ry)
        .fill({ color: 0xe0a6a6, alpha: 0.08 })
    );
  });

  // лавочка слева
  const bench = new Container();
  bench.position.set(28, 645);
  park.addChild(bench);

  bench.addChild(
    new Graphics()
      .roundRect(0, 0, 82, 8, 3).fill(0x442d31)
      .roundRect(3, -18, 76, 7, 3).fill(0x4e3335)
      .rect(10, 8, 5, 31).fill(0x17171b)
      .rect(67, 8, 5, 31).fill(0x17171b)
  );

  // клумбы / трава
  const greenery = new Container();
  park.addChild(greenery);

  function grassTuft(x, y, flip = 1) {
    const g = new Graphics()
      .moveTo(0, 0).lineTo(-6 * flip, -15).stroke({ width: 2, color: 0x31402f, alpha: 0.8 })
      .moveTo(0, 0).lineTo(1 * flip, -19).stroke({ width: 2, color: 0x3d5038, alpha: 0.85 })
      .moveTo(0, 0).lineTo(8 * flip, -13).stroke({ width: 2, color: 0x2f432f, alpha: 0.8 });
    g.position.set(x, y);
    greenery.addChild(g);
  }

  for (let i = 0; i < 18; i++) {
    grassTuft(
      i < 9 ? 20 + i * 12 : 292 + (i - 9) * 11,
      620 + (i % 4) * 24,
      i % 2 ? 1 : -1
    );
  }

  // маленькие цветы, заметные только вблизи
  [
    [48, 650, 0xf2a2bd],
    [85, 676, 0xf5d9a8],
    [318, 640, 0xe9a3c3],
    [350, 694, 0xffd59b],
    [302, 720, 0xf4aec8],
  ].forEach(([x, y, color]) => {
    const flower = new Container();
    flower.position.set(x, y);
    flower.addChild(
      new Graphics()
        .circle(-3, 0, 3).fill({ color, alpha: 0.75 })
        .circle(3, 0, 3).fill({ color, alpha: 0.75 })
        .circle(0, -3, 3).fill({ color, alpha: 0.75 })
        .circle(0, 2, 2).fill(0xffd67d)
    );
    greenery.addChild(flower);
  });

  // светлячки
  const fireflies = new Container();
  park.addChild(fireflies);

  for (let i = 0; i < 14; i++) {
    const f = new Graphics()
      .circle(0, 0, 1.7)
      .fill({ color: 0xffe39c, alpha: 0.75 });

    const sx = 20 + Math.random() * 350;
    const sy = 500 + Math.random() * 240;
    f.position.set(sx, sy);
    fireflies.addChild(f);

    gsap.to(f, {
      x: sx + (Math.random() * 24 - 12),
      y: sy + (Math.random() * 20 - 10),
      alpha: 0.15,
      duration: 1.6 + Math.random() * 2.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: Math.random() * 1.5,
    });
  }

  // несколько падающих листьев на переднем плане
  const parkLeaves = new Container();
  park.addChild(parkLeaves);

  for (let i = 0; i < 7; i++) {
    const leaf = new Graphics()
      .ellipse(0, 0, 6, 3)
      .fill({
        color: i % 2 ? 0xc77766 : 0x9d5f5d,
        alpha: 0.38,
      });

    leaf.position.set(Math.random() * W, 350 + Math.random() * 330);
    leaf.rotation = Math.random() * Math.PI;
    parkLeaves.addChild(leaf);

    gsap.to(leaf, {
      x: "+=" + (30 + Math.random() * 45),
      y: "+=" + (90 + Math.random() * 120),
      rotation: "+=" + (1.5 + Math.random() * 2),
      duration: 7 + Math.random() * 5,
      repeat: -1,
      ease: "none",
    });
  }

  // =====================================================
  // ФОНАРИ
  // =====================================================

  function createLamp(x, y, scale = 1) {
    const lamp = new Container();
    lamp.position.set(x, y);
    lamp.scale.set(scale);

    const glow = new Graphics()
      .circle(0, -112, 35)
      .fill({
        color: 0xffcc8a,
        alpha: 0.08,
      });

    const post = new Graphics()
      .roundRect(-3, -110, 6, 110, 3)
      .fill(0x18171e);

    const top = new Graphics()
      .roundRect(-10, -124, 20, 22, 5)
      .fill(0x232027);

    const light = new Graphics()
      .circle(0, -113, 5)
      .fill(0xffd18b);

    lamp.addChild(glow, post, top, light);

    gsap.to(glow, {
      alpha: 0.15,
      duration: 1.8 + Math.random(),
      repeat: -1,
      yoyo: true,
    });

    return lamp;
  }

  park.addChild(
    createLamp(74, 670, 0.8),
    createLamp(316, 690, 0.9),
    createLamp(118, 590, 0.5),
    createLamp(270, 600, 0.55)
  );

  // =====================================================
  // ПЕРЕДНИЕ ДЕРЕВЬЯ
  // =====================================================

  const foreground = new Container();
  park.addChild(foreground);

  const leftTree = new Graphics()
    .rect(0, 420, 26, 424)
    .fill(0x10151a);

  foreground.addChild(leftTree);

  foreground.addChild(
    new Graphics()
      .circle(20, 390, 100)
      .fill(0x151b21)
  );

  const rightTree = new Graphics()
    .rect(365, 410, 25, 434)
    .fill(0x10151a);

  foreground.addChild(rightTree);

  foreground.addChild(
    new Graphics()
      .circle(372, 375, 105)
      .fill(0x151b21)
  );

  // =====================================================
  // ПАРАЛЛАКС
  // =====================================================

  gsap.to(city, {
    x: -8,
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  gsap.to(farTrees, {
    x: 7,
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  gsap.to(foreground, {
    x: -4,
    duration: 4.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // =====================================================
  // НАДПИСЬ В ПАРКЕ
  // =====================================================

  const parkText = new Text({
    text: "Ну что… прогуляемся?",
    style: {
      fill: 0xffffff,
      fontFamily: "Arial",
      fontSize: 23,
      fontWeight: "500",
    },
  });

  parkText.anchor.set(0.5);
  parkText.position.set(W / 2, 120);
  parkText.alpha = 0;

  park.addChild(parkText);
  // =====================================================
// ПЕРСОНАЖИ — PNG-СПРАЙТЫ
// =====================================================

function fitSpriteHeight(sprite, height) {
  const textureHeight = sprite.texture?.height || 1;
  const scale = height / textureHeight;
  sprite.scale.set(scale);
}

function createSpriteCharacter({
  idleTexture,
  walkTextures,
  height,
  walkSpeed = 0.12,
}) {
  const root = new Container();

  // Обычная стойка
  const idle = new Sprite(idleTexture);
  idle.anchor.set(0.5, 1);
  fitSpriteHeight(idle, height);
  root.addChild(idle);

  // Ходьба из двух PNG-кадров
  const walk = new AnimatedSprite(walkTextures);
  walk.anchor.set(0.5, 1);
  fitSpriteHeight(walk, height);
  walk.animationSpeed = walkSpeed;
  walk.loop = true;
  walk.visible = false;
  root.addChild(walk);

  return {
    root,
    idle,
    walk,

    startWalk() {
      idle.visible = false;
      walk.visible = true;
      walk.gotoAndPlay(0);
    },

    stopWalk() {
      walk.stop();
      walk.visible = false;
      idle.visible = true;
    },
  };
}

function createKessi() {
  return createSpriteCharacter({
    idleTexture: spriteTextures.kessiIdle,
    walkTextures: [
      spriteTextures.kessiWalk1,
      spriteTextures.kessiWalk2,
    ],
    height: 150,
    walkSpeed: 0.11,
  });
}

function createObsid() {
  return createSpriteCharacter({
    idleTexture: spriteTextures.obsidIdle,
    walkTextures: [
      spriteTextures.obsidWalk1,
      spriteTextures.obsidWalk2,
    ],
    height: 165,
    walkSpeed: 0.11,
  });
}

function createDragon() {
  const character = createSpriteCharacter({
    idleTexture: spriteTextures.dragonIdle,
    walkTextures: [
      spriteTextures.dragonWalk1,
      spriteTextures.dragonWalk2,
    ],
    height: 92,
    walkSpeed: 0.14,
  });

  // Отдельный кадр Дракоши с мороженым —
  // пригодится в сцене у киоска.
  const icecream = new Sprite(spriteTextures.dragonIcecream);
  icecream.anchor.set(0.5, 1);
  fitSpriteHeight(icecream, 96);
  icecream.visible = false;
  character.root.addChild(icecream);
  character.icecream = icecream;

  character.showIcecream = () => {
    character.walk.stop();
    character.walk.visible = false;
    character.idle.visible = false;
    character.icecream.visible = true;
  };

  character.showIdle = () => {
    character.icecream.visible = false;
    character.walk.stop();
    character.walk.visible = false;
    character.idle.visible = true;
  };

  const originalStartWalk = character.startWalk;
  character.startWalk = () => {
    character.icecream.visible = false;
    originalStartWalk();
  };

  return character;
}

// =====================================================
// СТАВИМ ПЕРСОНАЖЕЙ В ПАРК
// =====================================================

const kessi = createKessi();
const obsid = createObsid();
const dragon = createDragon();

kessi.root.position.set(155, 742);
obsid.root.position.set(225, 742);

kessi.root.scale.set(0.92);
obsid.root.scale.set(0.92);

dragon.root.position.set(320, 755);
dragon.root.scale.set(1);

kessi.root.alpha = 0;
obsid.root.alpha = 0;
dragon.root.alpha = 0;

park.addChild(
  kessi.root,
  obsid.root,
  dragon.root
);

// маленький знак между ними — визуально они идут рядом, как за ручку
const togetherHeart = new Text({
  text: "♡",
  style: {
    fill: 0xf4bfd2,
    fontFamily: "Arial",
    fontSize: 15,
    fontWeight: "700",
  },
});
togetherHeart.anchor.set(0.5);
togetherHeart.position.set(195, 650);
togetherHeart.alpha = 0;
park.addChild(togetherHeart);

// =====================================================
// ТЕКСТ "ТЫК"
// =====================================================

const walkHintBg = new Graphics()
  .roundRect(-112, -27, 224, 54, 27)
  .fill({ color: 0x17131d, alpha: 0.92 })
  .stroke({ width: 1.4, color: 0xf3bfd2, alpha: 0.65 });

walkHintBg.position.set(W / 2, 770);
walkHintBg.alpha = 0;
park.addChild(walkHintBg);

const walkHint = new Text({
  text: "ТЫК — ИДЁМ ГУЛЯТЬ ♡",
  style: {
    fill: 0xffffff,
    fontFamily: "Arial",
    fontSize: 17,
    fontWeight: "700",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

walkHint.anchor.set(0.5);
walkHint.position.set(W / 2, 770);
walkHint.alpha = 0;
park.addChild(walkHint);

// =====================================================
// ЗОНА НАЖАТИЯ
// =====================================================

const walkTap = new Graphics()
  .rect(0, 0, W, H)
  .fill({
    color: 0xffffff,
    alpha: 0.001,
  });

walkTap.eventMode = "none";
walkTap.cursor = "pointer";

park.addChild(walkTap);

// =====================================================
// ВХОД ПЕРСОНАЖЕЙ
// =====================================================

function showCharacters() {
  const tl = gsap.timeline();

  // Обсид приходит справа
  obsid.root.x = 445;

  tl.to(obsid.root, {
    alpha: 1,
    x: 225,
    duration: 1.5,
    ease: "power2.out",
  });

  // Кэсси появляется слева
  kessi.root.x = -60;

  tl.to(
    kessi.root,
    {
      alpha: 1,
      x: 165,
      duration: 1.4,
      ease: "power2.out",
    },
    0.35
  );

  // дракоша опаздывает :)
  dragon.root.x = 445;

  tl.to(
    dragon.root,
    {
      alpha: 1,
      x: 320,
      duration: 1,
      ease: "back.out(1.7)",
    },
    1.3
  );

  // небольшая подпрыгивающая остановка дракоши
  tl.to(
    dragon.root,
    {
      y: dragon.root.y - 13,
      duration: 0.18,
      repeat: 1,
      yoyo: true,
    },
    2.15
  );

  tl.to(
    [walkHintBg, walkHint],
    {
      alpha: 1,
      duration: 0.7,
    },
    2.3
  );

  tl.to(togetherHeart, {
    alpha: 0.75,
    duration: 0.5,
  }, 2.1);

  tl.call(() => {
    walkTap.eventMode = "static";
  });
}

// =====================================================
// АНИМАЦИЯ ХОДЬБЫ СПРАЙТОВ
// =====================================================

function startLegAnimation(character) {
  character.startWalk();
}

function stopLegAnimation(character) {
  character.stopWalk();
}

// =====================================================
// СЦЕНА 3 — КИОСК С МОРОЖЕНЫМ
// =====================================================

const iceCreamScene = new Container();
iceCreamScene.alpha = 0;
iceCreamScene.visible = false;
world.addChild(iceCreamScene);

// вечерний фон
const iceBg = new Graphics()
  .rect(0, 0, W, H)
  .fill(0x17111f);

iceCreamScene.addChild(iceBg);

const iceSkyGlow = new Graphics()
  .circle(195, 170, 240)
  .fill({
    color: 0xb04b73,
    alpha: 0.13,
  });

iceCreamScene.addChild(iceSkyGlow);

// дальние огни
for (let i = 0; i < 26; i++) {
  const light = new Graphics()
    .circle(0, 0, Math.random() * 2.3 + 0.8)
    .fill({
      color: i % 3 === 0 ? 0xffc985 : 0xf4a6c2,
      alpha: 0.35 + Math.random() * 0.45,
    });

  light.position.set(
    Math.random() * W,
    80 + Math.random() * 390
  );

  iceCreamScene.addChild(light);

  gsap.to(light, {
    alpha: 0.12,
    duration: 1 + Math.random() * 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

// земля
const iceGround = new Graphics()
  .rect(0, 585, W, 259)
  .fill(0x101319);

iceCreamScene.addChild(iceGround);

// свет под киоском
const kioskGroundGlow = new Graphics()
  .ellipse(195, 610, 160, 44)
  .fill({
    color: 0xffc47b,
    alpha: 0.08,
  });

iceCreamScene.addChild(kioskGroundGlow);

// киоск — цельная детальная сцена
const kiosk = new Container();
kiosk.position.set(W / 2, 405);
iceCreamScene.addChild(kiosk);

// мягкая тень под киоском
const kioskShadow = new Graphics()
  .ellipse(0, 175, 155, 32)
  .fill({ color: 0x000000, alpha: 0.23 });
kiosk.addChild(kioskShadow);

// корпус
const kioskBody = new Graphics()
  .roundRect(-148, -154, 296, 286, 18)
  .fill(0xeadbd5)
  .stroke({ width: 2, color: 0x6e3f48, alpha: 0.34 });
kiosk.addChild(kioskBody);

// нижняя деревянная панель
const kioskLower = new Graphics()
  .roundRect(-140, 55, 280, 68, 12)
  .fill(0x75505a);
kiosk.addChild(kioskLower);

// вертикальные декоративные планки
for (let i = 0; i < 7; i++) {
  kiosk.addChild(
    new Graphics()
      .roundRect(-126 + i * 42, 62, 4, 53, 2)
      .fill({ color: 0xa77a82, alpha: 0.42 })
  );
}

// крыша
const roof = new Graphics()
  .moveTo(-164, -154)
  .lineTo(-128, -206)
  .lineTo(128, -206)
  .lineTo(164, -154)
  .closePath()
  .fill(0x351f2b)
  .stroke({ width: 2, color: 0x7d4054, alpha: 0.65 });
kiosk.addChild(roof);

// вывеска на крыше
const signPlate = new Graphics()
  .roundRect(-91, -196, 182, 42, 15)
  .fill(0xf3e7df)
  .stroke({ width: 1.4, color: 0xb46d82, alpha: 0.65 });
kiosk.addChild(signPlate);

const kioskSign = new Text({
  text: "МОРОЖЕНОЕ",
  style: {
    fill: 0x5a2b3c,
    fontFamily: "Arial",
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});
kioskSign.anchor.set(0.5);
kioskSign.position.set(0, -175);
kiosk.addChild(kioskSign);

// полосатый навес
const awning = new Container();
awning.position.set(0, -142);
kiosk.addChild(awning);

for (let i = 0; i < 8; i++) {
  const awningStripe = new Graphics()
    .rect(-144 + i * 36, 0, 36, 38)
    .fill(i % 2 === 0 ? 0x9d3854 : 0xf5e9e3);
  awning.addChild(awningStripe);
}

awning.addChild(
  new Graphics()
    .roundRect(-148, 32, 296, 16, 7)
    .fill(0x7f2944)
);

// гирлянда под навесом
const kioskLights = new Container();
kioskLights.position.set(0, -98);
kiosk.addChild(kioskLights);

for (let i = 0; i < 10; i++) {
  const lx = -123 + i * 27;
  const glow = new Graphics()
    .circle(lx, 0, 13)
    .fill({ color: 0xffc77d, alpha: 0.06 });
  const bulb = new Graphics()
    .circle(lx, 0, 3.2)
    .fill({ color: 0xffd79c, alpha: 0.96 });
  kioskLights.addChild(glow, bulb);

  gsap.to(glow, {
    alpha: 0.14,
    duration: 1.8 + (i % 4) * 0.25,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

// окно выдачи
const serviceWindow = new Graphics()
  .roundRect(-124, -82, 248, 105, 12)
  .fill(0x241b24)
  .stroke({ width: 2, color: 0xb78591, alpha: 0.38 });
kiosk.addChild(serviceWindow);

// тёплый свет из окна
const windowGlow = new Graphics()
  .roundRect(-116, -74, 232, 89, 10)
  .fill({ color: 0xffc986, alpha: 0.09 });
kiosk.addChild(windowGlow);

gsap.to(windowGlow, {
  alpha: 0.16,
  duration: 2.4,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});

// стеклянная витрина
const displayCase = new Container();
displayCase.position.set(0, -7);
kiosk.addChild(displayCase);

displayCase.addChild(
  new Graphics()
    .roundRect(-116, -42, 232, 62, 10)
    .fill({ color: 0x92afbf, alpha: 0.13 })
    .stroke({ width: 1.4, color: 0xdbe8ed, alpha: 0.38 })
);

// ванночки мороженого — выглядят как настоящая витрина, а не ряд рожков
const flavors = [
  { color: 0xf4a8b8, name: "клубника" },
  { color: 0x805548, name: "шоколад" },
  { color: 0xa5c798, name: "фисташка" },
  { color: 0xecc36d, name: "карамель" },
  { color: 0xc09cda, name: "ягоды" },
];

const flavorItems = [];

flavors.forEach((flavor, i) => {
  const tray = new Container();
  tray.position.set(-88 + i * 44, -13);

  const trayBody = new Graphics()
    .roundRect(-18, -12, 36, 26, 5)
    .fill(0xb8b4b1)
    .stroke({ width: 1, color: 0xe8e4e1, alpha: 0.45 });

  const gelato = new Graphics()
    .ellipse(0, -7, 15, 7)
    .fill(flavor.color)
    .ellipse(-7, -8, 7, 4)
    .fill({ color: flavor.color, alpha: 0.96 })
    .ellipse(7, -8, 7, 4)
    .fill({ color: flavor.color, alpha: 0.96 });

  tray.addChild(trayBody, gelato);
  displayCase.addChild(tray);
  flavorItems.push(tray);
});

// отдельная белая ванночка — пломбир
const plombir = new Container();
plombir.position.set(88, -13);
displayCase.addChild(plombir);

const plombirTray = new Graphics()
  .roundRect(-18, -12, 36, 26, 5)
  .fill(0xb8b4b1)
  .stroke({ width: 1, color: 0xffffff, alpha: 0.55 });

const plombirScoop = new Graphics()
  .ellipse(0, -7, 15, 7)
  .fill(0xfffbf0)
  .ellipse(-7, -8, 7, 4)
  .fill(0xfffdf7)
  .ellipse(7, -8, 7, 4)
  .fill(0xfffdf7);

const plombirTinyGlow = new Graphics()
  .circle(0, -5, 28)
  .fill({ color: 0xfff2c7, alpha: 0.035 });

plombir.addChild(plombirTinyGlow, plombirTray, plombirScoop);

// полка перед витриной
kiosk.addChild(
  new Graphics()
    .roundRect(-133, 15, 266, 24, 8)
    .fill(0xb9948e)
    .stroke({ width: 1, color: 0x704954, alpha: 0.35 })
);

// стаканчики и салфетки
const cups = new Container();
cups.position.set(-94, 0);
kiosk.addChild(cups);
for (let i = 0; i < 3; i++) {
  cups.addChild(
    new Graphics()
      .moveTo(i * 9 - 8, 0)
      .lineTo(i * 9 + 8, 0)
      .lineTo(i * 9 + 5, 19)
      .lineTo(i * 9 - 5, 19)
      .closePath()
      .fill(i % 2 ? 0xf7e8e3 : 0xd88ca3)
  );
}

kiosk.addChild(
  new Graphics()
    .roundRect(82, -4, 25, 22, 4)
    .fill(0xf7f0eb)
    .rect(87, -11, 15, 10)
    .fill(0xffffff)
);

// маленькое меню слева
const menuBoard = new Container();
menuBoard.position.set(-178, -56);
kiosk.addChild(menuBoard);

menuBoard.addChild(
  new Graphics()
    .roundRect(-3, -4, 74, 132, 8)
    .fill(0x282027)
    .stroke({ width: 1.2, color: 0xa96f7e, alpha: 0.58 })
);

const menuText = new Text({
  text: "СЕГОДНЯ\n\nПломбир ♡\nШоколад\nКлубника\nФисташка\nКарамель",
  style: {
    fill: 0xf6e7df,
    fontFamily: "Arial",
    fontSize: 10,
    lineHeight: 18,
  },
});
menuText.position.set(7, 7);
menuBoard.addChild(menuText);

// маленький горшок справа — добавляет жизни сцене
const plant = new Container();
plant.position.set(154, 82);
kiosk.addChild(plant);

plant.addChild(
  new Graphics()
    .roundRect(-16, 18, 32, 32, 7)
    .fill(0x7c4e47)
    .ellipse(-7, 11, 7, 18)
    .fill(0x5e8463)
    .ellipse(7, 8, 7, 20)
    .fill(0x6d9570)
    .ellipse(0, 0, 6, 18)
    .fill(0x789d75)
);

// мелкая надпись на корпусе
const smallKioskText = new Text({
  text: "вечер + мороженое = хороший план ♡",
  style: {
    fill: 0xf0d9dc,
    fontFamily: "Arial",
    fontSize: 9,
  },
});
smallKioskText.anchor.set(0.5);
smallKioskText.position.set(0, 90);
kiosk.addChild(smallKioskText);

// очень мягкий общий свет киоска
const kioskLampGlow = new Graphics()
  .circle(0, -20, 150)
  .fill({ color: 0xffbf75, alpha: 0.035 });
kiosk.addChildAt(kioskLampGlow, 1);

gsap.to(kioskLampGlow, {
  alpha: 0.075,
  duration: 3,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});

// персонажи для сцены киоска
const iceKessi = createKessi();
const iceObsid = createObsid();
const iceDragon = createDragon();

iceKessi.root.position.set(132, 714);
iceObsid.root.position.set(232, 714);
iceDragon.root.position.set(310, 734);

iceKessi.root.scale.set(0.91);
iceObsid.root.scale.set(0.91);
iceDragon.root.scale.set(0.84);

iceCreamScene.addChild(
  iceKessi.root,
  iceObsid.root,
  iceDragon.root
);

// пломбир в руке Обсида
const heldPlombir = new Container();
heldPlombir.alpha = 0;
heldPlombir.scale.set(0.9);
heldPlombir.position.set(-46, -92);

const heldCone = new Graphics()
  .moveTo(-7, 7)
  .lineTo(7, 7)
  .lineTo(0, 31)
  .closePath()
  .fill(0xd7a369);

const heldScoop = new Graphics()
  .circle(0, 1, 12)
  .fill(0xfffbf2);

heldPlombir.addChild(heldCone, heldScoop);
iceObsid.root.addChild(heldPlombir);

// реплика дракоши
const dragonBubble = new Container();
dragonBubble.alpha = 0;
dragonBubble.position.set(300, 645);

const bubbleBg = new Graphics()
  .roundRect(-58, -25, 116, 50, 18)
  .fill({
    color: 0xffffff,
    alpha: 0.94,
  });

const bubbleTail = new Graphics()
  .moveTo(27, 22)
  .lineTo(43, 39)
  .lineTo(13, 26)
  .closePath()
  .fill({
    color: 0xffffff,
    alpha: 0.94,
  });

const bubbleText = new Text({
  text: "Понятно.",
  style: {
    fill: 0x2a2026,
    fontFamily: "Arial",
    fontSize: 18,
    fontWeight: "600",
  },
});

bubbleText.anchor.set(0.5);

dragonBubble.addChild(
  bubbleBg,
  bubbleTail,
  bubbleText
);

iceCreamScene.addChild(dragonBubble);

// подсказка внизу
const iceHintBg = new Graphics()
  .roundRect(-115, -27, 230, 54, 27)
  .fill({ color: 0x17131d, alpha: 0.94 })
  .stroke({ width: 1.4, color: 0xf3bfd2, alpha: 0.7 });
iceHintBg.position.set(W / 2, 772);
iceHintBg.alpha = 0;
iceCreamScene.addChild(iceHintBg);

const iceHint = new Text({
  text: "",
  style: {
    fill: 0xffffff,
    fontFamily: "Arial",
    fontSize: 17,
    fontWeight: "700",
    align: "center",
    wordWrap: true,
    wordWrapWidth: 210,
  },
});

iceHint.anchor.set(0.5);
iceHint.position.set(W / 2, 772);
iceCreamScene.addChild(iceHint);

// Надёжная полноэкранная зона перехода.
// На телефоне не нужно попадать точно по маленькой надписи.
const iceNextTap = new Graphics()
  .rect(0, 0, W, H)
  .fill({
    color: 0xffffff,
    alpha: 0.001,
  });

iceNextTap.eventMode = "none";
iceNextTap.cursor = "pointer";
iceCreamScene.addChild(iceNextTap);

let leavingIceCream = false;

function continueAfterIceCream() {
  if (leavingIceCream) return;
  leavingIceCream = true;

  iceHint.eventMode = "none";
  iceNextTap.eventMode = "none";

  showSunsetScene();
}

// =====================================================
// АНИМАЦИЯ СЦЕНЫ МОРОЖЕНОГО
// =====================================================

function showIceCreamScene() {
  iceCreamScene.visible = true;
  iceCreamScene.alpha = 0;

  iceKessi.root.alpha = 0;
  iceObsid.root.alpha = 0;
  iceDragon.root.alpha = 0;

  iceKessi.root.x = 40;
  iceObsid.root.x = 350;
  iceDragon.root.x = 430;

  const tl = gsap.timeline();

  tl.to(park, {
    alpha: 0,
    duration: 0.9,
    ease: "power2.inOut",
  });

  tl.to(
    iceCreamScene,
    {
      alpha: 1,
      duration: 1.1,
      ease: "power2.inOut",
    },
    0.4
  );

  // герои подходят к киоску
  tl.to(
    iceKessi.root,
    {
      alpha: 1,
      x: 132,
      duration: 1.7,
      ease: "power2.out",
    },
    1
  );

  tl.to(
    iceObsid.root,
    {
      alpha: 1,
      x: 232,
      duration: 1.7,
      ease: "power2.out",
    },
    1.15
  );

  // дракоша немного позже
  tl.to(
    iceDragon.root,
    {
      alpha: 1,
      x: 310,
      duration: 1.45,
      ease: "back.out(1.35)",
    },
    1.8
  );

  // разноцветное мороженое немного "манит"
  flavorItems.forEach((item, index) => {
    tl.to(
      item.scale,
      {
        x: 1.12,
        y: 1.12,
        duration: 0.18,
        yoyo: true,
        repeat: 1,
      },
      3.6 + index * 0.14
    );
  });

  // дракоша смотрит на ассортимент
  tl.to(
    iceDragon.root,
    {
      rotation: -0.08,
      duration: 0.25,
      yoyo: true,
      repeat: 1,
    },
    4.6
  );

  // а Обсид выбирает именно белый пломбир
  tl.to(
    plombir.scale,
    {
      x: 1.35,
      y: 1.35,
      duration: 0.3,
      ease: "back.out(2)",
    },
    5.6
  );

  tl.to(
    plombir,
    {
      alpha: 0.18,
      duration: 0.3,
    },
    6.25
  );

  tl.to(
    heldPlombir,
    {
      alpha: 1,
      duration: 0.35,
    },
    6.25
  );

  // Обсид чуть поворачивается к Кэсси
  tl.to(
    iceObsid.root,
    {
      x: 226,
      duration: 0.45,
      ease: "power2.out",
    },
    6.8
  );

  // пломбир как будто протягивается ей
  tl.to(
    heldPlombir,
    {
      x: -66,
      y: -94,
      rotation: -0.14,
      duration: 0.55,
      ease: "power2.out",
    },
    7.2
  );

  // Кэсси слегка "радуется"
  tl.to(
    iceKessi.root,
    {
      y: 702,
      duration: 0.18,
      repeat: 1,
      yoyo: true,
      ease: "sine.inOut",
    },
    7.9
  );

  // дракоша: ассортимент -> пломбир -> Кэсси
  tl.to(
    iceDragon.root,
    {
      x: 307,
      rotation: 0.12,
      duration: 0.35,
    },
    8.7
  );

  tl.to(
    iceDragon.root,
    {
      rotation: -0.12,
      duration: 0.35,
    },
    9.35
  );

  tl.to(
    dragonBubble,
    {
      alpha: 1,
      y: 635,
      duration: 0.45,
      ease: "back.out(1.5)",
    },
    10.1
  );

  tl.to(
    dragonBubble,
    {
      alpha: 0,
      duration: 0.45,
    },
    12.4
  );

  // И, конечно, Дракоша тоже каким-то образом
  // уже оказался с мороженым :)
  tl.call(() => {
    iceDragon.showIcecream();
  }, null, 12.8);

  tl.to(
    iceDragon.root,
    {
      y: iceDragon.root.y - 7,
      duration: 0.18,
      repeat: 1,
      yoyo: true,
    },
    12.8
  );

  // финальная маленькая пауза сцены
  tl.call(() => {
    iceHint.text = "ИДЁМ ДАЛЬШЕ ♡";
  }, null, 13.5);

  tl.fromTo(
    [iceHintBg, iceHint],
    {
      alpha: 0,
      y: 782,
    },
    {
      alpha: 1,
      y: 772,
      duration: 0.6,
    },
    13.5
  );

  tl.call(() => {
    iceHint.eventMode = "static";
    iceHint.cursor = "pointer";
    iceNextTap.eventMode = "static";
  }, null, 14.4);

  // Если Даша ничего не нажмёт, сцена всё равно продолжится сама.
  // Так подарок не может "застрять" на мороженом.
  tl.call(() => {
    continueAfterIceCream();
  }, null, 24.0);
}

iceHint.on("pointertap", continueAfterIceCream);
iceNextTap.on("pointertap", continueAfterIceCream);


// =====================================================
// СЦЕНА 4 — ЗАКАТНАЯ ТОЧКА + ФОТО
// =====================================================

const sunsetScene = new Container();
sunsetScene.visible = false;
sunsetScene.alpha = 0;
world.addChild(sunsetScene);

const sunsetSky = new Graphics()
  .rect(0, 0, W, 300).fill(0x33224b)
  .rect(0, 300, W, 210).fill(0xa94f6d)
  .rect(0, 510, W, 150).fill(0xf09a72)
  .rect(0, 660, W, 184).fill(0x171923);
sunsetScene.addChild(sunsetSky);

const sunsetSun = new Graphics()
  .circle(305, 395, 42).fill(0xffc88f);
sunsetScene.addChild(sunsetSun);

// вода и отражение заката
const sunsetWater = new Graphics()
  .rect(0, 515, W, 175)
  .fill(0x463347);
sunsetScene.addChild(sunsetWater);

// отражение солнца
for (let i = 0; i < 8; i++) {
  sunsetScene.addChild(
    new Graphics()
      .ellipse(305, 525 + i * 14, 34 - i * 2.8, 4)
      .fill({ color: 0xffcf9c, alpha: 0.12 - i * 0.008 })
  );
}

// дальний берег
const sunsetShore = new Graphics()
  .rect(0, 490, W, 28)
  .fill(0x27222f);
sunsetScene.addChild(sunsetShore);

// городские огни
for (let i = 0; i < 24; i++) {
  const x = 8 + i * 16;
  const y = 478 - (i % 4) * 5;
  sunsetScene.addChild(
    new Graphics()
      .circle(x, y, 1.5 + (i % 3) * 0.4)
      .fill({ color: 0xffd49b, alpha: 0.7 })
  );
}

// облака
const sunsetClouds = new Container();
sunsetScene.addChild(sunsetClouds);

[
  [80, 235, 0.9],
  [235, 185, 0.65],
  [310, 255, 0.55],
].forEach(([x, y, s]) => {
  const c = new Graphics()
    .ellipse(0, 0, 45, 12).fill({ color: 0xffd4c5, alpha: 0.11 })
    .ellipse(-24, 1, 24, 8).fill({ color: 0xffd4c5, alpha: 0.09 })
    .ellipse(25, 2, 27, 8).fill({ color: 0xffd4c5, alpha: 0.08 });
  c.position.set(x, y);
  c.scale.set(s);
  sunsetClouds.addChild(c);

  gsap.to(c, {
    x: x + 14,
    duration: 14 + Math.random() * 8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
});

// ветки на переднем плане
const sunsetBranches = new Graphics()
  .moveTo(0, 0).quadraticCurveTo(55, 70, 92, 145)
  .stroke({ width: 5, color: 0x17161d, alpha: 0.95 })
  .moveTo(W, 0).quadraticCurveTo(338, 70, 300, 150)
  .stroke({ width: 5, color: 0x17161d, alpha: 0.95 });
sunsetScene.addChild(sunsetBranches);

// лавочка
const sunsetBench = new Container();
sunsetBench.position.set(65, 665);
sunsetScene.addChild(sunsetBench);
sunsetBench.addChild(
  new Graphics()
    .roundRect(0, 0, 260, 12, 4).fill(0x4c322f)
    .roundRect(5, -28, 250, 10, 4).fill(0x543734)
    .rect(30, 12, 7, 42).fill(0x18171c)
    .rect(220, 12, 7, 42).fill(0x18171c)
);


const skyline = new Graphics();
for (let x = 0; x < W; x += 34) {
  const h = 55 + ((x * 17) % 80);
  skyline.rect(x, 600 - h, 31, h).fill(0x252331);
}
sunsetScene.addChild(skyline);

const sunsetObsid = createObsid();
const sunsetKessi = createKessi();
const sunsetDragon = createDragon();

sunsetKessi.root.position.set(158, 690);
sunsetObsid.root.position.set(228, 690);
sunsetDragon.root.position.set(292, 697);

sunsetKessi.root.scale.set(0.84);
sunsetObsid.root.scale.set(0.84);
sunsetDragon.root.scale.set(0.72);

// визуально "садим" их на лавочку: немного опускаем и уменьшаем
sunsetKessi.root.rotation = -0.015;
sunsetObsid.root.rotation = 0.012;

sunsetScene.addChild(
  sunsetKessi.root,
  sunsetObsid.root,
  sunsetDragon.root
);

const sunsetTitle = new Text({
  text: "стой… тут красиво",
  style: {
    fill: 0xffffff,
    fontFamily: "Arial",
    fontSize: 22,
    fontWeight: "500",
  },
});
sunsetTitle.anchor.set(0.5);
sunsetTitle.position.set(W / 2, 105);
sunsetScene.addChild(sunsetTitle);

const cameraButton = new Container();
cameraButton.position.set(W / 2, 756);
cameraButton.eventMode = "static";
cameraButton.cursor = "pointer";

const cameraBg = new Graphics()
  .roundRect(-108, -28, 216, 56, 28)
  .fill({ color: 0x17131d, alpha: 0.82 })
  .stroke({ width: 1, color: 0xf3c3d4, alpha: 0.55 });

const cameraText = new Text({
  text: "📷  сделать фото",
  style: {
    fill: 0xffffff,
    fontFamily: "Arial",
    fontSize: 16,
  },
});
cameraText.anchor.set(0.5);
cameraButton.addChild(cameraBg, cameraText);
sunsetScene.addChild(cameraButton);

const flash = new Graphics()
  .rect(0, 0, W, H)
  .fill(0xffffff);
flash.alpha = 0;
sunsetScene.addChild(flash);

let photoTaken = false;

function showSunsetScene() {
  iceHint.eventMode = "none";
  iceNextTap.eventMode = "none";
  sunsetScene.visible = true;

  gsap.timeline()
    .to(iceCreamScene, {
      alpha: 0,
      duration: 0.8,
      ease: "power2.inOut",
    })
    .to(sunsetScene, {
      alpha: 1,
      duration: 1.1,
      ease: "power2.inOut",
    }, 0.35)
    .from([sunsetKessi.root, sunsetObsid.root, sunsetDragon.root], {
      y: "+=35",
      alpha: 0,
      duration: 1,
      stagger: 0.12,
      ease: "power2.out",
    }, 0.8);
}

cameraButton.on("pointertap", () => {
  if (photoTaken) return;
  photoTaken = true;
  cameraButton.eventMode = "none";

  const tl = gsap.timeline();

  tl.to(flash, { alpha: 0.95, duration: 0.08 });
  tl.to(flash, { alpha: 0, duration: 0.35 });

  tl.call(() => {
    cameraText.text = "сохранил ♡";
  }, null, 0.3);

  tl.to(cameraButton.scale, {
    x: 1.06,
    y: 1.06,
    duration: 0.18,
    repeat: 1,
    yoyo: true,
  }, 0.32);

  tl.call(() => {
    showCinemaScene();
  }, null, 1.5);
});

// =====================================================
// СЦЕНА 5 — КИНОТЕАТР
// =====================================================

const cinemaScene = new Container();
cinemaScene.visible = false;
cinemaScene.alpha = 0;
world.addChild(cinemaScene);

const cinemaBg = new Graphics()
  .rect(0, 0, W, H).fill(0x090811)
  .rect(25, 95, 340, 540).fill(0x17131d);
cinemaScene.addChild(cinemaBg);

const marquee = new Graphics()
  .roundRect(42, 120, 306, 105, 18)
  .fill(0x311b31)
  .stroke({ width: 2, color: 0xf0a6c1, alpha: 0.7 });
cinemaScene.addChild(marquee);

const cinemaTitle = new Text({
  text: "КИНОТЕАТР",
  style: {
    fill: 0xffffff,
    fontFamily: "Arial",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 3,
  },
});
cinemaTitle.anchor.set(0.5);
cinemaTitle.position.set(W / 2, 150);
cinemaScene.addChild(cinemaTitle);

const movieTitle = new Text({
  text: "Сегодня: «Рапунцель» ✦",
  style: {
    fill: 0xf7bfd4,
    fontFamily: "Arial",
    fontSize: 21,
    fontWeight: "600",
  },
});
movieTitle.anchor.set(0.5);
movieTitle.position.set(W / 2, 190);
cinemaScene.addChild(movieTitle);

// настоящий кино-билет
const realTicket = new Container();
realTicket.position.set(46, 250);
cinemaScene.addChild(realTicket);

// основная часть билета
const ticketBody = new Graphics()
  .roundRect(0, 0, 298, 118, 12)
  .fill(0xf3e6dc)
  .stroke({ width: 1.3, color: 0xc9aeb2, alpha: 0.85 });

// отрывная часть справа
const ticketStub = new Graphics()
  .roundRect(238, 0, 60, 118, 12)
  .fill(0xe9d2ca);

realTicket.addChild(ticketBody, ticketStub);

// пунктир перфорации
for (let y = 10; y < 110; y += 10) {
  realTicket.addChild(
    new Graphics()
      .rect(236, y, 2, 5)
      .fill({ color: 0x9e7f84, alpha: 0.55 })
  );
}

const ticketBrand = new Text({
  text: "CINEMA NIGHT",
  style: {
    fill: 0x9c244d,
    fontFamily: "Arial",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
});
ticketBrand.position.set(16, 12);
realTicket.addChild(ticketBrand);

const ticketMovie = new Text({
  text: "РАПУНЦЕЛЬ",
  style: {
    fill: 0x2c2026,
    fontFamily: "Arial",
    fontSize: 22,
    fontWeight: "800",
  },
});
ticketMovie.position.set(16, 34);
realTicket.addChild(ticketMovie);

const ticketInfo = new Text({
  text: "05.09.2026   •   20:30\nЗАЛ 2   •   РЯД 5   •   МЕСТА 7–8",
  style: {
    fill: 0x5d474e,
    fontFamily: "Arial",
    fontSize: 11,
    lineHeight: 19,
    fontWeight: "600",
  },
});
ticketInfo.position.set(16, 67);
realTicket.addChild(ticketInfo);

// псевдо-штрихкод
for (let i = 0; i < 16; i++) {
  const bw = i % 3 === 0 ? 3 : 1.5;
  realTicket.addChild(
    new Graphics()
      .rect(251 + i * 2.1, 23, bw, 48)
      .fill(0x2b2226)
  );
}

const ticketStubText = new Text({
  text: "2\nБИЛЕТА",
  style: {
    fill: 0x7d2546,
    fontFamily: "Arial",
    fontSize: 12,
    fontWeight: "800",
    align: "center",
    lineHeight: 18,
  },
});
ticketStubText.anchor.set(0.5);
ticketStubText.position.set(268, 91);
realTicket.addChild(ticketStubText);

// дракоша внезапно приносит третий
const cinemaDragon = createDragon();
cinemaDragon.root.position.set(310, 430);
cinemaDragon.root.scale.set(0.9);
cinemaScene.addChild(cinemaDragon.root);

const thirdTicket = new Container();
thirdTicket.position.set(0, -112);

const thirdTicketBody = new Graphics()
  .roundRect(-31, -17, 62, 34, 6)
  .fill(0xf3e6dc)
  .stroke({ width: 1, color: 0xc99dad, alpha: 0.8 });
thirdTicket.addChild(thirdTicketBody);

const thirdTicketText = new Text({
  text: "БИЛЕТ\n№3",
  style: {
    fill: 0x792542,
    fontFamily: "Arial",
    fontSize: 9,
    fontWeight: "800",
    align: "center",
  },
});
thirdTicketText.anchor.set(0.5);
thirdTicket.addChild(thirdTicketText);

cinemaDragon.root.addChild(thirdTicket);

const dragonCinemaBubble = new Container();
dragonCinemaBubble.position.set(270, 350);
dragonCinemaBubble.alpha = 0;
const dcbg = new Graphics()
  .roundRect(-62, -24, 124, 48, 18)
  .fill(0xffffff);
const dct = new Text({
  text: "а я что,\nне иду?",
  style: {
    fill: 0x2b2530,
    fontSize: 14,
    fontFamily: "Arial",
    align: "center",
  },
});
dct.anchor.set(0.5);
dragonCinemaBubble.addChild(dcbg, dct);
cinemaScene.addChild(dragonCinemaBubble);

// пасхалки со снеками
const snacks = new Container();
snacks.position.set(40, 505);
cinemaScene.addChild(snacks);

const snackPanel = new Graphics()
  .roundRect(0, 0, 310, 105, 16)
  .fill({ color: 0x211a26, alpha: 0.96 });
snacks.addChild(snackPanel);

const snackTitle = new Text({
  text: "перед залом:",
  style: { fill: 0xcfa9b9, fontSize: 13, fontFamily: "Arial" },
});
snackTitle.position.set(15, 12);
snacks.addChild(snackTitle);

const snackText = new Text({
  text: "🥒 солёные огурчики   🍏 яблочный сок\n🍬 кислые мармеладки",
  style: {
    fill: 0xffffff,
    fontSize: 15,
    fontFamily: "Arial",
    lineHeight: 29,
  },
});
snackText.position.set(15, 38);
snacks.addChild(snackText);

const cinemaHintBg = new Graphics()
  .roundRect(-112, -27, 224, 54, 27)
  .fill({ color: 0x211723, alpha: 0.96 })
  .stroke({ width: 1.4, color: 0xf2bfd2, alpha: 0.72 });
cinemaHintBg.position.set(W / 2, 746);
cinemaScene.addChild(cinemaHintBg);

const cinemaHint = new Text({
  text: "ЗАХОДИМ В ЗАЛ  ›",
  style: {
    fill: 0xffffff,
    fontSize: 17,
    fontFamily: "Arial",
    fontWeight: "800",
  },
});
cinemaHint.anchor.set(0.5);
cinemaHint.position.set(W / 2, 746);
cinemaHint.eventMode = "static";
cinemaHint.cursor = "pointer";
cinemaScene.addChild(cinemaHint);

function showCinemaScene() {
  cinemaScene.visible = true;
  cinemaScene.alpha = 0;

  gsap.timeline()
    .to(sunsetScene, { alpha: 0, duration: 0.8 })
    .to(cinemaScene, { alpha: 1, duration: 1, ease: "power2.inOut" }, 0.35)
    .from(marquee.scale, {
      x: 0.92,
      y: 0.92,
      duration: 0.7,
      ease: "back.out(1.5)",
    }, 0.8)
    .to(dragonCinemaBubble, {
      alpha: 1,
      y: 340,
      duration: 0.5,
      ease: "back.out(1.5)",
    }, 1.7);
}

cinemaHint.on("pointertap", () => {
  cinemaHint.eventMode = "none";
  showCinemaHall();
});

// =====================================================
// СЦЕНА 6 — В ЗАЛЕ
// =====================================================

const hallScene = new Container();
hallScene.visible = false;
hallScene.alpha = 0;
world.addChild(hallScene);

const hallBg = new Graphics()
  .rect(0, 0, W, H).fill(0x06060b);
hallScene.addChild(hallBg);

const screenGlow = new Graphics()
  .roundRect(35, 105, 320, 250, 14)
  .fill(0xe5cbd6);
hallScene.addChild(screenGlow);

let screenVisual;

if (rapunzelTexture) {
  screenVisual = new Sprite(rapunzelTexture);
  screenVisual.anchor.set(0.5);
  screenVisual.position.set(W / 2, 230);

  const maxW = 300;
  const maxH = 220;
  const scale = Math.min(
    maxW / screenVisual.texture.width,
    maxH / screenVisual.texture.height
  );
  screenVisual.scale.set(scale);

  // лёгкое тёплое свечение, будто реально идёт фильм
  screenVisual.alpha = 0.93;
  hallScene.addChild(screenVisual);
} else {
  screenVisual = new Text({
    text: "🏮✨",
    style: { fontSize: 60 },
  });
  screenVisual.anchor.set(0.5);
  screenVisual.position.set(W / 2, 230);
  hallScene.addChild(screenVisual);
}

// кресла
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 5; col++) {
    const seat = new Graphics()
      .roundRect(25 + col * 72, 500 + row * 70, 55, 48, 12)
      .fill(row === 1 && (col === 1 || col === 2 || col === 3) ? 0x5a2941 : 0x281824);
    hallScene.addChild(seat);
  }
}

const hallKessi = createKessi();
const hallObsid = createObsid();
const hallDragon = createDragon();

hallKessi.root.position.set(150, 610);
hallObsid.root.position.set(220, 610);
hallDragon.root.position.set(292, 615);

hallKessi.root.scale.set(0.63);
hallObsid.root.scale.set(0.63);
hallDragon.root.scale.set(0.52);

// эффект посадки: герои частично "утоплены" за спинками кресел
hallKessi.root.y += 18;
hallObsid.root.y += 18;
hallDragon.root.y += 22;

hallScene.addChild(hallKessi.root, hallObsid.root, hallDragon.root);

// передние части кресел закрывают нижнюю часть персонажей — они реально сидят
const seatOverlay = new Container();
hallScene.addChild(seatOverlay);

[
  [116, 590, 58, 58],
  [186, 590, 58, 58],
  [256, 590, 58, 58],
].forEach(([x, y, w, h]) => {
  seatOverlay.addChild(
    new Graphics()
      .roundRect(x, y, w, h, 15)
      .fill(0x3a1d2d)
      .stroke({ width: 1, color: 0x5e3248, alpha: 0.5 })
  );
});


const zzz = new Text({
  text: "z z z",
  style: {
    fill: 0x9ec9ff,
    fontSize: 17,
    fontFamily: "Arial",
    fontStyle: "italic",
  },
});
zzz.position.set(302, 520);
zzz.alpha = 0;
hallScene.addChild(zzz);

const hallCaption = new Text({
  text: "Дракоша держался достойно.\nПочти.",
  style: {
    fill: 0xe9d6df,
    fontSize: 16,
    fontFamily: "Arial",
    align: "center",
    lineHeight: 24,
  },
});
hallCaption.anchor.set(0.5);
hallCaption.position.set(W / 2, 745);
hallCaption.alpha = 0;
hallScene.addChild(hallCaption);

function showCinemaHall() {
  hallScene.visible = true;

  gsap.timeline()
    .to(cinemaScene, { alpha: 0, duration: 0.7 })
    .to(hallScene, { alpha: 1, duration: 1 }, 0.3)
    .to(zzz, { alpha: 1, y: 505, duration: 0.8 }, 1.5)
    .to(hallDragon.root, {
      rotation: 0.18,
      y: 635,
      duration: 0.8,
      ease: "sine.inOut",
    }, 1.3)
    .to(hallCaption, { alpha: 1, duration: 0.7 }, 2.1)
    .call(() => showNightScene(), null, 4.2);
}

// =====================================================
// СЦЕНА 7 — НОЧНОЙ ГОРОД
// =====================================================

const nightScene = new Container();
nightScene.visible = false;
nightScene.alpha = 0;
world.addChild(nightScene);

const nightBg = new Graphics()
  .rect(0, 0, W, H).fill(0x090b18);
nightScene.addChild(nightBg);

// луна
nightScene.addChild(
  new Graphics().circle(305, 120, 38).fill(0xe8e5dd)
);

// здания и окна
for (let x = 0; x < W; x += 48) {
  const h = 110 + ((x * 13) % 170);
  nightScene.addChild(
    new Graphics()
      .rect(x, 540 - h, 44, h)
      .fill(x % 96 === 0 ? 0x15182a : 0x111526)
  );

  for (let wy = 430; wy < 525; wy += 26) {
    nightScene.addChild(
      new Graphics()
        .rect(x + 10, wy, 5, 8)
        .fill({ color: 0xffcf84, alpha: 0.55 })
    );
  }
}

nightScene.addChild(
  new Graphics().rect(0, 540, W, 304).fill(0x11151c)
);

const nightKessi = createKessi();
const nightObsid = createObsid();
const nightDragon = createDragon();

nightKessi.root.position.set(160, 690);
nightObsid.root.position.set(235, 690);
nightDragon.root.position.set(330, 715);
nightDragon.root.scale.set(0.72);

nightScene.addChild(nightKessi.root, nightObsid.root, nightDragon.root);

const nightText1 = new Text({
  text: "Вот бы сейчас действительно так.",
  style: {
    fill: 0xffffff,
    fontSize: 21,
    fontFamily: "Arial",
    align: "center",
    wordWrap: true,
    wordWrapWidth: 330,
  },
});
nightText1.anchor.set(0.5);
nightText1.position.set(W / 2, 155);
nightText1.alpha = 0;
nightScene.addChild(nightText1);

const nightText2 = new Text({
  text: "Но пока — это жизнь.",
  style: {
    fill: 0xe7c4d1,
    fontSize: 20,
    fontFamily: "Arial",
  },
});
nightText2.anchor.set(0.5);
nightText2.position.set(W / 2, 220);
nightText2.alpha = 0;
nightScene.addChild(nightText2);

const nightText3 = new Text({
  text: "А ничего невозможного\nвсё равно нет.",
  style: {
    fill: 0xffffff,
    fontSize: 23,
    fontFamily: "Arial",
    align: "center",
    lineHeight: 32,
  },
});
nightText3.anchor.set(0.5);
nightText3.position.set(W / 2, 300);
nightText3.alpha = 0;
nightScene.addChild(nightText3);

function showNightScene() {
  nightScene.visible = true;

  gsap.timeline()
    .to(hallScene, { alpha: 0, duration: 0.9 })
    .to(nightScene, { alpha: 1, duration: 1.2 }, 0.35)
    .to(nightText1, { alpha: 1, y: 148, duration: 0.8 }, 1.2)
    .to(nightText2, { alpha: 1, duration: 0.8 }, 2.7)
    .to(nightText3, { alpha: 1, duration: 0.9 }, 4.2)
    // Дракоша убегает вперёд и оставляет сцену тихой
    .to(nightDragon.root, {
      x: 440,
      duration: 1.2,
      ease: "power2.in",
    }, 5.5)
    .call(() => showFinalGift(), null, 7.2);
}

// =====================================================
// СЦЕНА 8 — ФИНАЛЬНЫЙ ПОДАРОК
// =====================================================

const finalScene = new Container();
finalScene.visible = false;
finalScene.alpha = 0;
world.addChild(finalScene);

const finalBg = new Graphics()
  .rect(0, 0, W, H).fill(0x09070d);
finalScene.addChild(finalBg);

const finalGlow = new Graphics()
  .circle(W / 2, 410, 210)
  .fill({ color: 0xb31c55, alpha: 0.12 });
finalScene.addChild(finalGlow);

const finalTitle = new Text({
  text: "И ещё кое-что.",
  style: {
    fill: 0xffffff,
    fontFamily: "Arial",
    fontSize: 24,
  },
});
finalTitle.anchor.set(0.5);
finalTitle.position.set(W / 2, 150);
finalScene.addChild(finalTitle);

const miniGift = new Container();
miniGift.position.set(W / 2, 430);
miniGift.eventMode = "static";
miniGift.cursor = "pointer";
finalScene.addChild(miniGift);

const miniBox = new Graphics()
  .roundRect(-75, -20, 150, 105, 15)
  .fill(0xf2e3e3);
const miniRibbon = new Graphics()
  .rect(-13, -20, 26, 105)
  .fill(0xa5163e);
const miniLid = new Graphics()
  .roundRect(-84, -45, 168, 38, 12)
  .fill(0xffeeee);
miniGift.addChild(miniBox, miniRibbon, miniLid);

const miniTagBg = new Graphics()
  .roundRect(-78, -24, 156, 48, 24)
  .fill({ color: 0x211723, alpha: 0.94 })
  .stroke({ width: 1.2, color: 0xf2bfd2, alpha: 0.7 });
miniTagBg.position.set(W / 2, 570);
finalScene.addChild(miniTagBg);

const miniTag = new Text({
  text: "ОТКРЫТЬ ♡",
  style: {
    fill: 0xffffff,
    fontSize: 17,
    fontFamily: "Arial",
    fontWeight: "800",
  },
});
miniTag.anchor.set(0.5);
miniTag.position.set(W / 2, 570);
finalScene.addChild(miniTag);

const photoCard = new Container();
photoCard.position.set(W / 2, 390);
photoCard.alpha = 0;
photoCard.scale.set(0.6);
finalScene.addChild(photoCard);

const photoPaper = new Graphics()
  .roundRect(-135, -175, 270, 350, 16)
  .fill(0xf7eee9);
photoCard.addChild(photoPaper);

// маленькая "фотография" из закатной сцены
const photoSky = new Graphics()
  .roundRect(-118, -155, 236, 220, 8)
  .fill(0x9a506b);
photoCard.addChild(photoSky);

const photoGround = new Graphics()
  .rect(-118, 5, 236, 60)
  .fill(0x25232d);
photoCard.addChild(photoGround);

const photoKessi = createKessi();
const photoObsid = createObsid();
const photoDragon = createDragon();

photoKessi.root.position.set(-42, 54);
photoObsid.root.position.set(32, 54);
photoDragon.root.position.set(83, 60);

photoKessi.root.scale.set(0.50);
photoObsid.root.scale.set(0.50);
photoDragon.root.scale.set(0.40);

// сдвигаем ближе друг к другу — кадр выглядит как совместное фото втроём
photoKessi.root.rotation = -0.03;
photoObsid.root.rotation = 0.025;

photoCard.addChild(photoKessi.root, photoObsid.root, photoDragon.root);

const photoLabel = new Text({
  text: "Мы ♡",
  style: {
    fill: 0x47313a,
    fontFamily: "Arial",
    fontSize: 18,
    fontWeight: "700",
  },
});
photoLabel.anchor.set(0.5);
photoLabel.position.set(0, 82);
photoCard.addChild(photoLabel);


const photoDate = new Text({
  text: "05.09.2026",
  style: {
    fill: 0x392831,
    fontFamily: "Arial",
    fontSize: 16,
    fontWeight: "600",
  },
});
photoDate.anchor.set(0.5);
photoDate.position.set(0, 100);
photoCard.addChild(photoDate);

const photoPhrase = new Text({
  text: "Первую пока пришлось нарисовать.\nОстальные предлагаю делать уже самим.",
  style: {
    fill: 0x5c3a49,
    fontFamily: "Arial",
    fontSize: 13,
    align: "center",
    lineHeight: 20,
  },
});
photoPhrase.anchor.set(0.5);
photoPhrase.position.set(0, 140);
photoCard.addChild(photoPhrase);

let finalOpened = false;

function showFinalGift() {
  finalScene.visible = true;

  gsap.timeline()
    .to(nightScene, { alpha: 0, duration: 1 })
    .to(finalScene, { alpha: 1, duration: 1.1 }, 0.35)
    .from(miniGift, {
      y: 470,
      alpha: 0,
      duration: 0.8,
      ease: "back.out(1.5)",
    }, 1);
}

miniGift.on("pointertap", () => {
  if (finalOpened) return;
  finalOpened = true;
  miniGift.eventMode = "none";

  gsap.timeline()
    .to(miniLid, {
      y: -80,
      rotation: -0.12,
      duration: 0.7,
      ease: "power3.out",
    })
    .to(miniGift, {
      alpha: 0,
      scaleX: 1.8,
      scaleY: 1.8,
      duration: 0.7,
    }, 0.55)
    .to([miniTagBg, miniTag], { alpha: 0, duration: 0.3 }, 0.5)
    .to(photoCard, {
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 1,
      ease: "back.out(1.3)",
    }, 0.75)
    .call(() => showBirthdayFinale(), null, 4.2);
});

// =====================================================
// СЦЕНА 9 — 23 / ДЕНЬ РОЖДЕНИЯ
// =====================================================

const birthdayScene = new Container();
birthdayScene.visible = false;
birthdayScene.alpha = 0;
world.addChild(birthdayScene);

const birthdayBg = new Graphics()
  .rect(0, 0, W, H).fill(0x08070c);
birthdayScene.addChild(birthdayBg);

const birthdayGlow = new Graphics()
  .circle(W / 2, 370, 240)
  .fill({ color: 0xc51d58, alpha: 0.15 });
birthdayScene.addChild(birthdayGlow);

const big23 = new Text({
  text: "23",
  style: {
    fill: 0xffffff,
    fontFamily: "Arial",
    fontSize: 150,
    fontWeight: "700",
  },
});
big23.anchor.set(0.5);
big23.position.set(W / 2, 340);
birthdayScene.addChild(big23);

const birthdayText = new Text({
  text: "С днём рождения, Даш. ♡",
  style: {
    fill: 0xf6cedd,
    fontFamily: "Arial",
    fontSize: 25,
    fontWeight: "600",
  },
});
birthdayText.anchor.set(0.5);
birthdayText.position.set(W / 2, 505);
birthdayScene.addChild(birthdayText);

const finalPhrase = new Text({
  text: "Если захотеть — можно и в космос полететь.\nНет ничего невозможного.\nРасстояние тогда тем более переживём.",
  style: {
    fill: 0xffffff,
    fontFamily: "Arial",
    fontSize: 17,
    align: "center",
    lineHeight: 27,
    wordWrap: true,
    wordWrapWidth: 335,
  },
});
finalPhrase.anchor.set(0.5);
finalPhrase.position.set(W / 2, 625);
birthdayScene.addChild(finalPhrase);

const finalDragon = createDragon();
finalDragon.root.position.set(325, 435);
finalDragon.root.scale.set(0.8);
birthdayScene.addChild(finalDragon.root);

function showBirthdayFinale() {
  birthdayScene.visible = true;

  gsap.timeline()
    .to(finalScene, { alpha: 0, duration: 0.9 })
    .to(birthdayScene, { alpha: 1, duration: 1.2 }, 0.35)
    .from(big23.scale, {
      x: 0.4,
      y: 0.4,
      duration: 0.9,
      ease: "back.out(1.6)",
    }, 0.8)
    .from(finalDragon.root, {
      x: 430,
      rotation: 0.4,
      duration: 0.9,
      ease: "back.out(1.8)",
    }, 1.5)
    // финальный гэг: дракоша "толкает" цифры
    .to(big23, {
      rotation: -0.035,
      x: W / 2 - 5,
      duration: 0.18,
      repeat: 1,
      yoyo: true,
    }, 2.15)
    .from(birthdayText, {
      alpha: 0,
      y: 525,
      duration: 0.8,
    }, 2.5)
    .from(finalPhrase, {
      alpha: 0,
      y: 645,
      duration: 1,
    }, 3.2);
}


// =====================================================
// НАЖАЛИ — ПОШЛИ
// =====================================================

let walking = false;

walkTap.on("pointertap", () => {
  if (walking) return;

  walking = true;
  walkTap.eventMode = "none";

  gsap.to([walkHintBg, walkHint], {
    alpha: 0,
    duration: 0.35,
  });

  gsap.to(parkText, {
    alpha: 0,
    duration: 0.4,
  });

  startLegAnimation(kessi);
  startLegAnimation(obsid);

  // Они идут медленно и синхронно — не бегут к следующей сцене.
  // Расстояние между ними минимальное, будто гуляют за руку.
  const WALK_TIME = 7.8;

  gsap.to(kessi.root, {
    y: 615,
    x: 180,
    scaleX: 0.82,
    scaleY: 0.82,
    duration: WALK_TIME,
    ease: "sine.inOut",
  });

  gsap.to(obsid.root, {
    y: 615,
    x: 213,
    scaleX: 0.82,
    scaleY: 0.82,
    duration: WALK_TIME,
    ease: "sine.inOut",
  });

  gsap.to(togetherHeart, {
    x: 197,
    y: 552,
    scaleX: 0.82,
    scaleY: 0.82,
    duration: WALK_TIME,
    ease: "sine.inOut",
  });

  // лёгкое общее покачивание шага
  gsap.to([kessi.root, obsid.root], {
    rotation: 0.012,
    duration: 0.55,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // Дракоша сначала засматривается по сторонам...
  gsap.to(dragon.root, {
    y: 710,
    x: 315,
    duration: 2.1,
    delay: 1,
    ease: "sine.inOut",
  });

  // ...а потом догоняет, но уже не как ракета
  gsap.to(dragon.root, {
    x: 262,
    y: 625,
    scaleX: 0.72,
    scaleY: 0.72,
    duration: 3.2,
    delay: 3.4,
    ease: "power1.inOut",
  });

  // Камера двигается очень мягко вместе с ними
  gsap.to(path.scale, {
    x: 1.045,
    y: 1.03,
    duration: WALK_TIME,
    ease: "sine.inOut",
  });

  gsap.to(foreground, {
    x: -11,
    duration: WALK_TIME,
    ease: "sine.inOut",
  });

  gsap.to(city, {
    x: 5,
    duration: WALK_TIME,
    ease: "sine.inOut",
  });

  gsap.to(fireflies, {
    x: -6,
    duration: WALK_TIME,
    ease: "sine.inOut",
  });

  // дошли — только после полноценной прогулки переходим к мороженому
  gsap.delayedCall(WALK_TIME + 0.25, () => {
    stopLegAnimation(kessi);
    stopLegAnimation(obsid);
    gsap.killTweensOf(kessi.root);
    gsap.killTweensOf(obsid.root);
    gsap.to(togetherHeart, { alpha: 0, duration: 0.35 });
    showIceCreamScene();
  });
});

  // =====================================================
  // ОТКРЫТИЕ КОРОБКИ
  // =====================================================

  let opened = false;

  gift.on("pointertap", () => {
    if (opened) return;

    opened = true;

    gsap.killTweensOf(gift);
    gsap.killTweensOf(tag);

    const tl = gsap.timeline();

    // реакция
    tl.to(gift.scale, {
      x: 0.96,
      y: 0.96,
      duration: 0.1,
    });

    tl.to(gift.scale, {
      x: 1,
      y: 1,
      duration: 0.14,
    });

    // бант расходится
    tl.to(
      bowLeft,
      {
        x: -32,
        rotation: -1.25,
        alpha: 0,
        duration: 0.6,
        ease: "power2.in",
      },
      0.2
    );

    tl.to(
      bowRight,
      {
        x: 32,
        rotation: 1.25,
        alpha: 0,
        duration: 0.6,
        ease: "power2.in",
      },
      0.2
    );

    tl.to(
      bowCenter,
      {
        scale: 0.2,
        alpha: 0,
        duration: 0.4,
      },
      0.25
    );

    // бирка улетает
    tl.to(
      tag,
      {
        x: 130,
        y: -80,
        rotation: 0.5,
        alpha: 0,
        duration: 0.6,
      },
      0.3
    );

    // крышка
    tl.to(
      lid,
      {
        y: -125,
        rotation: -0.08,
        duration: 0.9,
        ease: "power3.out",
      },
      0.7
    );

    // вспышка
    tl.to(
      glow2,
      {
        alpha: 0.85,
        duration: 0.45,
      },
      0.9
    );

    tl.to(
      glow2.scale,
      {
        x: 3.5,
        y: 3.5,
        duration: 1,
        ease: "power3.in",
      },
      1
    );

    // камера летит внутрь
    tl.to(
      gift.scale,
      {
        x: 4.5,
        y: 4.5,
        duration: 1.1,
        ease: "power3.in",
      },
      1.4
    );

    tl.to(
      intro,
      {
        alpha: 0,
        duration: 0.55,
      },
      1.8
    );

    // текст
    tl.to(
      quoteScene,
      {
        alpha: 1,
        duration: 0.5,
      },
      2
    );

    tl.to(
      quote1,
      {
        alpha: 1,
        y: quote1.y - 8,
        duration: 0.9,
        ease: "power2.out",
      },
      2.35
    );

    tl.to(
      quote2,
      {
        alpha: 1,
        y: quote2.y - 8,
        duration: 0.9,
        ease: "power2.out",
      },
      3.9
    );

    // текст исчезает
    tl.to(
      quote1,
      {
        alpha: 0,
        duration: 0.6,
      },
      6
    );

    tl.to(
      quote2,
      {
        alpha: 0,
        duration: 0.6,
      },
      6
    );

    // появляется парк
    tl.to(
      park,
      {
        alpha: 1,
        duration: 1.8,
        ease: "power2.inOut",
      },
      6.1
    );

    tl.to(
      quoteScene,
      {
        alpha: 0,
        duration: 1.2,
      },
      6.2
    );

    tl.from(
      park.scale,
      {
        x: 1.08,
        y: 1.08,
        duration: 2.2,
        ease: "power2.out",
      },
      6.1
    );

    tl.to(
      parkText,
      {
        alpha: 1,
        y: 110,
        duration: 1,
      },
      7.5
    );

    tl.call(() => {
      showCharacters();
    }, null, 8.3);
  });
}

start().catch((error) => {
  document.body.style.background = "#111";

  document.body.innerHTML = `
    <pre style="
      color:white;
      padding:20px;
      white-space:pre-wrap;
      font-size:13px;
    ">${error.stack || error}</pre>
  `;
});
