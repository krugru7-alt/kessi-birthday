import { Application, Container, Graphics, Text } from "pixi.js";
import gsap from "gsap";

const app = new Application();

async function start() {
  await app.init({
    resizeTo: window,
    backgroundColor: 0x09070d,
    antialias: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
  });

  document.body.style.margin = "0";
  document.body.style.overflow = "hidden";
  document.body.style.background = "#09070d";

  app.canvas.style.position = "fixed";
  app.canvas.style.inset = "0";
  app.canvas.style.width = "100%";
  app.canvas.style.height = "100%";
  app.canvas.style.touchAction = "none";

  document.body.appendChild(app.canvas);

  const scene = new Container();
  app.stage.addChild(scene);

  // мягкое свечение за подарком
  const glow = new Graphics()
    .circle(0, 0, 180)
    .fill({
      color: 0xff7da8,
      alpha: 0.14,
    });

  scene.addChild(glow);

  // вся коробка одним контейнером
  const gift = new Container();
  gift.eventMode = "static";
  gift.cursor = "pointer";

  scene.addChild(gift);

  // тень
  const shadow = new Graphics()
    .ellipse(0, 150, 115, 24)
    .fill({
      color: 0x000000,
      alpha: 0.35,
    });

  gift.addChild(shadow);

  // корпус коробки
  const box = new Graphics()
    .roundRect(-105, -20, 210, 165, 18)
    .fill(0xf3eee9);

  gift.addChild(box);

  // лёгкая внутренняя тень
  const boxShade = new Graphics()
    .roundRect(-105, 75, 210, 70, 18)
    .fill({
      color: 0xd8ced1,
      alpha: 0.25,
    });

  gift.addChild(boxShade);

  // вертикальная лента
  const ribbonVertical = new Graphics()
    .roundRect(-20, -20, 40, 165, 7)
    .fill(0xb31335);

  gift.addChild(ribbonVertical);

  // крышка
  const lid = new Container();
  gift.addChild(lid);

  const lidBody = new Graphics()
    .roundRect(-117, -55, 234, 55, 16)
    .fill(0xffffff);

  lid.addChild(lidBody);

  // горизонтальная лента
  const ribbonHorizontal = new Graphics()
    .roundRect(-117, -38, 234, 28, 6)
    .fill(0xb31335);

  lid.addChild(ribbonHorizontal);

  // бант
  const bow = new Container();
  bow.y = -63;
  lid.addChild(bow);

  const leftBow = new Graphics()
    .ellipse(-30, 0, 35, 18)
    .fill(0xb31335);

  leftBow.rotation = -0.35;

  const rightBow = new Graphics()
    .ellipse(30, 0, 35, 18)
    .fill(0xb31335);

  rightBow.rotation = 0.35;

  const bowCenter = new Graphics()
    .circle(0, 0, 14)
    .fill(0xd11b45);

  bow.addChild(leftBow, rightBow, bowCenter);

  // бирка
  const tag = new Container();
  tag.x = 78;
  tag.y = -85;
  tag.rotation = 0.12;

  const tagBg = new Graphics()
    .roundRect(-38, -17, 76, 34, 8)
    .fill(0xf7efe7);

  const tagText = new Text({
    text: "Кэсси",
    style: {
      fill: 0x2b1d24,
      fontSize: 18,
      fontFamily: "Arial",
      fontWeight: "600",
    },
  });

  tagText.anchor.set(0.5);

  tag.addChild(tagBg, tagText);
  lid.addChild(tag);

  function positionScene() {
    gift.position.set(
      app.screen.width / 2,
      app.screen.height / 2 + 25
    );

    glow.position.set(
      app.screen.width / 2,
      app.screen.height / 2 + 20
    );

    const scale = Math.min(
      app.screen.width / 430,
      app.screen.height / 760,
      1.1
    );

    gift.scale.set(scale);
    glow.scale.set(scale);
  }

  positionScene();

  window.addEventListener("resize", positionScene);

  // появление
  gift.alpha = 0;
  gift.scale.set(gift.scale.x * 0.88);

  gsap.to(gift, {
    alpha: 1,
    duration: 1.1,
    ease: "power2.out",
  });

  gsap.to(gift.scale, {
    x: gift.scale.x / 0.88,
    y: gift.scale.y / 0.88,
    duration: 1.3,
    ease: "back.out(1.4)",
  });

  // дыхание свечения
  gsap.to(glow.scale, {
    x: glow.scale.x * 1.18,
    y: glow.scale.y * 1.18,
    repeat: -1,
    yoyo: true,
    duration: 2.7,
    ease: "sine.inOut",
  });

  // лёгкое "дыхание" коробки
  gsap.to(gift, {
    y: gift.y - 6,
    repeat: -1,
    yoyo: true,
    duration: 2.4,
    ease: "sine.inOut",
  });

  let opened = false;

  gift.on("pointertap", () => {
    if (opened) return;
    opened = true;

    gsap.killTweensOf(gift);

    // небольшая реакция на нажатие
    gsap.to(gift.scale, {
      x: gift.scale.x * 0.96,
      y: gift.scale.y * 0.96,
      duration: 0.12,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });

    // бант начинает расходиться
    gsap.to(leftBow, {
      x: -35,
      rotation: -1.1,
      alpha: 0,
      duration: 0.65,
      ease: "power2.in",
    });

    gsap.to(rightBow, {
      x: 35,
      rotation: 1.1,
      alpha: 0,
      duration: 0.65,
      ease: "power2.in",
    });

    gsap.to(bowCenter, {
      scale: 0.4,
      alpha: 0,
      duration: 0.45,
    });

    // крышка поднимается
    gsap.to(lid, {
      y: -135,
      rotation: -0.08,
      duration: 1,
      delay: 0.45,
      ease: "power3.out",
    });

    // свет изнутри
    gsap.to(glow, {
      alpha: 0.8,
      duration: 0.9,
      delay: 0.65,
      ease: "power2.out",
    });

    gsap.to(glow.scale, {
      x: glow.scale.x * 2.3,
      y: glow.scale.y * 2.3,
      duration: 1.1,
      delay: 0.65,
      ease: "power2.in",
    });

    // затем "камера" летит внутрь подарка
    gsap.to(gift.scale, {
      x: gift.scale.x * 3.8,
      y: gift.scale.y * 3.8,
      duration: 1.2,
      delay: 1.25,
      ease: "power3.in",
    });

    gsap.to(gift, {
      alpha: 0,
      duration: 0.65,
      delay: 1.75,
    });

    // затемнение перед следующей сценой
    gsap.to(scene, {
      alpha: 0,
      duration: 0.7,
      delay: 2.05,
    });
  });
}

start().catch((error) => {
  document.body.style.background = "#111";
  document.body.innerHTML =
    `<pre style="color:white;padding:20px;white-space:pre-wrap">${error.stack || error}</pre>`;
});
