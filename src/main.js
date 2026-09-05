import { Application, Container, Graphics, Text } from "pixi.js";
import gsap from "gsap";

const app = new Application();

await app.init({
  resizeTo: window,
  background: "#08070c",
  antialias: true,
  resolution: Math.min(window.devicePixelRatio || 1, 2),
  autoDensity: true,
});

document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.style.background = "#08070c";

app.canvas.style.position = "fixed";
app.canvas.style.inset = "0";
app.canvas.style.width = "100vw";
app.canvas.style.height = "100vh";
app.canvas.style.touchAction = "none";

document.body.appendChild(app.canvas);

const world = new Container();
app.stage.addChild(world);

const bg = new Graphics()
  .rect(0, 0, app.screen.width, app.screen.height)
  .fill("#08070c");

world.addChild(bg);

const glow = new Graphics()
  .circle(0, 0, Math.min(app.screen.width, app.screen.height) * 0.28)
  .fill({
    color: "#ff8fb8",
    alpha: 0.18,
  });

glow.x = app.screen.width / 2;
glow.y = app.screen.height / 2;

world.addChild(glow);

const title = new Text({
  text: "Кэсси",
  style: {
    fill: "#ffffff",
    fontSize: Math.max(28, Math.min(app.screen.width * 0.09, 54)),
    fontFamily: "Arial",
    fontWeight: "600",
    letterSpacing: 3,
  },
});

title.anchor.set(0.5);
title.x = app.screen.width / 2;
title.y = app.screen.height / 2;

world.addChild(title);

gsap.from(title, {
  alpha: 0,
  y: title.y + 20,
  duration: 1.4,
  ease: "power2.out",
});

gsap.to(glow.scale, {
  x: 1.15,
  y: 1.15,
  duration: 2.4,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});

gsap.to(glow, {
  alpha: 0.28,
  duration: 2.4,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});

function resizeScene() {
  bg.clear()
    .rect(0, 0, app.screen.width, app.screen.height)
    .fill("#08070c");

  glow.x = app.screen.width / 2;
  glow.y = app.screen.height / 2;

  title.x = app.screen.width / 2;
  title.y = app.screen.height / 2;
}

window.addEventListener("resize", resizeScene);
