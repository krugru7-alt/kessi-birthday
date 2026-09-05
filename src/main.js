import {
  Application,
  Container,
  Graphics,
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
    text: "Если захотеть —\nможно и в космос полететь.",
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
