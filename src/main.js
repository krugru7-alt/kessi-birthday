import { Application, Graphics, Text } from "pixi.js";

const app = new Application();

async function start() {
  await app.init({
    resizeTo: window,
    backgroundColor: 0x08070c,
    antialias: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
  });

  document.body.style.margin = "0";
  document.body.style.overflow = "hidden";
  document.body.style.background = "#08070c";

  app.canvas.style.position = "fixed";
  app.canvas.style.inset = "0";
  app.canvas.style.width = "100%";
  app.canvas.style.height = "100%";

  document.body.appendChild(app.canvas);

  const glow = new Graphics();

  glow
    .circle(0, 0, 120)
    .fill({
      color: 0xff8fb8,
      alpha: 0.2,
    });

  glow.position.set(
    app.screen.width / 2,
    app.screen.height / 2
  );

  app.stage.addChild(glow);

  const title = new Text({
    text: "Кэсси",
    style: {
      fill: 0xffffff,
      fontSize: 42,
      fontFamily: "Arial",
      fontWeight: "bold",
    },
  });

  title.anchor.set(0.5);

  title.position.set(
    app.screen.width / 2,
    app.screen.height / 2
  );

  app.stage.addChild(title);
}

start().catch((error) => {
  document.body.style.background = "#111";
  document.body.innerHTML = `
    <pre style="
      color:white;
      padding:20px;
      white-space:pre-wrap;
      font-size:14px;
    ">${error.stack || error}</pre>
  `;
});
