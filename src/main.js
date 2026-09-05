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

kessi.root.position.set(145, 730);
obsid.root.position.set(245, 730);

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

// =====================================================
// ТЕКСТ "ТЫК"
// =====================================================

const walkHint = new Text({
  text: "тык, чтобы пойти ♡",
  style: {
    fill: 0xf8d9e4,
    fontFamily: "Arial",
    fontSize: 17,
    fontWeight: "500",
  },
});

walkHint.anchor.set(0.5);
walkHint.position.set(W / 2, 790);
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
    x: 245,
    duration: 1.5,
    ease: "power2.out",
  });

  // Кэсси появляется слева
  kessi.root.x = -60;

  tl.to(
    kessi.root,
    {
      alpha: 1,
      x: 145,
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
    walkHint,
    {
      alpha: 1,
      duration: 0.7,
    },
    2.3
  );

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

// киоск
const kiosk = new Container();
kiosk.position.set(195, 400);
iceCreamScene.addChild(kiosk);

const kioskBody = new Graphics()
  .roundRect(-145, -175, 290, 270, 18)
  .fill(0xead9d5);

kiosk.addChild(kioskBody);

const kioskInner = new Graphics()
  .roundRect(-124, -135, 248, 145, 12)
  .fill(0x2b2028);

kiosk.addChild(kioskInner);

// навес
const awning = new Container();
awning.y = -176;
kiosk.addChild(awning);

for (let i = 0; i < 8; i++) {
  const stripe = new Graphics()
    .rect(-144 + i * 36, 0, 36, 40)
    .fill(i % 2 === 0 ? 0x9d1738 : 0xf4e6e1);

  awning.addChild(stripe);
}

const awningEdge = new Graphics()
  .roundRect(-150, 32, 300, 18, 8)
  .fill(0x7f142f);

awning.addChild(awningEdge);

// вывеска
const kioskSign = new Text({
  text: "МОРОЖЕНОЕ",
  style: {
    fill: 0x4c2631,
    fontFamily: "Arial",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});

kioskSign.anchor.set(0.5);
kioskSign.position.set(0, 40);
kiosk.addChild(kioskSign);

// прилавок
const counter = new Graphics()
  .roundRect(-135, 0, 270, 28, 8)
  .fill(0xc8aaa7);

kiosk.addChild(counter);

// стаканчики/мороженое в витрине
const flavors = [
  0xff7c9c,
  0x75c9d8,
  0xf8d45f,
  0x9d7cdf,
  0x6fc58b,
  0xf08c5b,
  0xc75f8c,
];

const flavorItems = [];

flavors.forEach((color, i) => {
  const item = new Container();

  item.x = -102 + i * 34;
  item.y = -68;

  const cone = new Graphics()
    .moveTo(-8, 11)
    .lineTo(8, 11)
    .lineTo(0, 40)
    .closePath()
    .fill(0xd7a369);

  const scoop = new Graphics()
    .circle(0, 5, 14)
    .fill(color);

  const shine = new Graphics()
    .circle(-4, 1, 3)
    .fill({
      color: 0xffffff,
      alpha: 0.28,
    });

  item.addChild(cone, scoop, shine);
  kiosk.addChild(item);
  flavorItems.push(item);
});

// БЕЛЫЙ ПЛОМБИР — специально отдельно
const plombir = new Container();
plombir.position.set(101, -64);
kiosk.addChild(plombir);

const plombirCone = new Graphics()
  .moveTo(-9, 12)
  .lineTo(9, 12)
  .lineTo(0, 44)
  .closePath()
  .fill(0xd7a369);

const plombirScoop = new Graphics()
  .circle(0, 5, 15)
  .fill(0xfffbf2);

const plombirShine = new Graphics()
  .circle(-5, 0, 4)
  .fill({
    color: 0xffffff,
    alpha: 0.6,
  });

plombir.addChild(
  plombirCone,
  plombirScoop,
  plombirShine
);

// маленькая лампа киоска
const kioskLampGlow = new Graphics()
  .circle(0, -112, 90)
  .fill({
    color: 0xffc06e,
    alpha: 0.07,
  });

kiosk.addChildAt(kioskLampGlow, 1);

gsap.to(kioskLampGlow, {
  alpha: 0.13,
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});

// персонажи для сцены киоска
const iceKessi = createKessi();
const iceObsid = createObsid();
const iceDragon = createDragon();

iceKessi.root.position.set(125, 710);
iceObsid.root.position.set(245, 710);
iceDragon.root.position.set(320, 735);
iceDragon.root.scale.set(1);

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
const iceHint = new Text({
  text: "",
  style: {
    fill: 0xf6d9e4,
    fontFamily: "Arial",
    fontSize: 16,
    align: "center",
    wordWrap: true,
    wordWrapWidth: 330,
  },
});

iceHint.anchor.set(0.5);
iceHint.position.set(W / 2, 805);
iceCreamScene.addChild(iceHint);

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
      x: 125,
      duration: 1.1,
      ease: "power2.out",
    },
    1
  );

  tl.to(
    iceObsid.root,
    {
      alpha: 1,
      x: 245,
      duration: 1.1,
      ease: "power2.out",
    },
    1.15
  );

  // дракоша немного позже
  tl.to(
    iceDragon.root,
    {
      alpha: 1,
      x: 320,
      duration: 0.9,
      ease: "back.out(1.6)",
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
      2.35 + index * 0.06
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
    2.8
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
    3.5
  );

  tl.to(
    plombir,
    {
      alpha: 0.18,
      duration: 0.3,
    },
    3.9
  );

  tl.to(
    heldPlombir,
    {
      alpha: 1,
      duration: 0.35,
    },
    3.9
  );

  // Обсид чуть поворачивается к Кэсси
  tl.to(
    iceObsid.root,
    {
      x: 226,
      duration: 0.45,
      ease: "power2.out",
    },
    4.15
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
    4.3
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
    4.65
  );

  // дракоша: ассортимент -> пломбир -> Кэсси
  tl.to(
    iceDragon.root,
    {
      x: 307,
      rotation: 0.12,
      duration: 0.35,
    },
    5
  );

  tl.to(
    iceDragon.root,
    {
      rotation: -0.12,
      duration: 0.35,
    },
    5.4
  );

  tl.to(
    dragonBubble,
    {
      alpha: 1,
      y: 635,
      duration: 0.45,
      ease: "back.out(1.5)",
    },
    5.85
  );

  tl.to(
    dragonBubble,
    {
      alpha: 0,
      duration: 0.45,
    },
    7.4
  );

  // И, конечно, Дракоша тоже каким-то образом
  // уже оказался с мороженым :)
  tl.call(() => {
    iceDragon.showIcecream();
  }, null, 7.55);

  tl.to(
    iceDragon.root,
    {
      y: iceDragon.root.y - 7,
      duration: 0.18,
      repeat: 1,
      yoyo: true,
    },
    7.55
  );

  // финальная маленькая пауза сцены
  tl.call(() => {
    iceHint.text = "ну всё, идём дальше ♡";
  }, null, 7.8);

  tl.fromTo(
    iceHint,
    {
      alpha: 0,
      y: 814,
    },
    {
      alpha: 1,
      y: 805,
      duration: 0.6,
    },
    7.8
  );
}

// =====================================================
// НАЖАЛИ — ПОШЛИ
// =====================================================

let walking = false;

walkTap.on("pointertap", () => {
  if (walking) return;

  walking = true;
  walkTap.eventMode = "none";

  gsap.to(walkHint, {
    alpha: 0,
    duration: 0.35,
  });

  gsap.to(parkText, {
    alpha: 0,
    duration: 0.4,
  });

  startLegAnimation(kessi);
  startLegAnimation(obsid);

  // герои идут вперёд
  gsap.to(kessi.root, {
    y: 620,
    x: 172,
    scaleX: 0.82,
    scaleY: 0.82,
    duration: 4,
    ease: "power1.inOut",
  });

  gsap.to(obsid.root, {
    y: 620,
    x: 222,
    scaleX: 0.82,
    scaleY: 0.82,
    duration: 4,
    ease: "power1.inOut",
  });

  // дракоша сначала отстаёт
  gsap.to(dragon.root, {
    y: 705,
    duration: 1,
    delay: 0.8,
    ease: "power1.inOut",
  });

  // потом резко догоняет
  gsap.to(dragon.root, {
    x: 275,
    y: 630,
    scaleX: 0.72,
    scaleY: 0.72,
    duration: 1.5,
    delay: 1.8,
    ease: "back.out(1.4)",
  });

  // движение камеры
  gsap.to(path.scale, {
    x: 1.08,
    y: 1.05,
    duration: 4,
    ease: "power1.inOut",
  });

  gsap.to(foreground, {
    x: -18,
    duration: 4,
    ease: "power1.inOut",
  });

  gsap.to(city, {
    x: 10,
    duration: 4,
    ease: "power1.inOut",
  });

  // дошли — переходим к мороженому
  gsap.delayedCall(4.15, () => {
    stopLegAnimation(kessi);
    stopLegAnimation(obsid);
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
