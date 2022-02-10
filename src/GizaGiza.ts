import * as PIXI from 'pixi.js';
import { DrawInfo } from './type';

export class GizaGiza {
  app: PIXI.Application;
  graphics: PIXI.Graphics;
  renderTexture: PIXI.RenderTexture;
  path: number[];
  path2: number[];
  single: PIXI.TilingSprite;
  double: PIXI.Container;
  triple: PIXI.Container;
  four: PIXI.Container;
  drawInfo: DrawInfo;
  speedMinPerSec: number;
  speedMaxPerSec: number;
  currentSpeedPerSec: number;
  tilePosition = 0;

  setup(app: PIXI.Application, drawInfo: DrawInfo) {
    this.app = app;
    const graphics = new PIXI.Graphics();
    this.graphics = graphics;
    const screen = this.app.screen;
    this.config();
    const unitWidth = 90;
    const scale = screen.width / (unitWidth * 2 * 3.5);
    const lenA = unitWidth * scale;
    const lenB = 57 * scale;
    const lenC = 35 * scale;
    const path = [0, 0, lenA, lenB, lenA * 2, 0, lenA * 2, lenC, lenA, lenB + lenC, 0, lenC];
    const path2 = [
      0,
      lenC,
      lenA,
      lenB + lenC,
      lenA * 2,
      0 + lenC,
      lenA * 2,
      lenC + lenC,
      lenA,
      lenB + lenC + lenC,
      0,
      lenC + lenC,
    ];
    this.path = path;
    this.path2 = path2;
    const renderTexture = PIXI.RenderTexture.create({
      width: lenA + lenA,
      height: lenB + lenC + lenC,
      resolution: devicePixelRatio,
    });
    this.renderTexture = renderTexture;
    this.update(drawInfo);

    this.single = new PIXI.TilingSprite(
      renderTexture,
      renderTexture.width * Math.ceil(screen.width / renderTexture.width),
      renderTexture.height,
    );
    this.single.y = (screen.height - renderTexture.height) * 0.5;
    this.single.visible = false;
    this.app.stage.addChild(this.single);

    this.double = new PIXI.Container();
    for (let i = 0; i < 2; i++) {
      const wave = new PIXI.TilingSprite(
        renderTexture,
        renderTexture.width * Math.ceil(screen.width / renderTexture.width),
        renderTexture.height,
      );
      wave.y = screen.height * 0.25 + screen.height * 0.5 * i - renderTexture.height * 0.5;
      this.double.addChild(wave);
    }
    this.double.visible = false;
    this.app.stage.addChild(this.double);

    this.triple = new PIXI.Container();
    for (let i = 0; i < 3; i++) {
      const wave = new PIXI.TilingSprite(
        renderTexture,
        renderTexture.width * Math.ceil(screen.width / renderTexture.width),
        renderTexture.height,
      );
      wave.y = screen.height * 0.1666 + screen.height * 0.333 * i - renderTexture.height * 0.5;
      this.triple.addChild(wave);
    }
    this.triple.visible = false;
    this.app.stage.addChild(this.triple);

    this.four = new PIXI.Container();
    for (let i = 0; i < 4; i++) {
      const wave = new PIXI.TilingSprite(
        renderTexture,
        renderTexture.width * Math.ceil(screen.width / renderTexture.width),
        renderTexture.height,
      );
      wave.y = screen.height * 0.125 + screen.height * 0.25 * i - renderTexture.height * 0.5;
      this.four.addChild(wave);
    }
    this.four.visible = false;
    this.app.stage.addChild(this.four);
  }

  config() {
    const { screen } = this.app;
    this.speedMinPerSec = screen.width / 50;
    this.speedMaxPerSec = screen.width / 4;
  }

  drawSingle() {
    this.single.visible = true;
    this.double.visible = false;
    this.triple.visible = false;
    this.four.visible = false;
    this.single.tilePosition.set(this.tilePosition, 0);
  }

  drawDouble() {
    this.single.visible = false;
    this.double.visible = true;
    this.triple.visible = false;
    this.four.visible = false;
    this.double.children.map((wave: PIXI.TilingSprite) => wave.tilePosition.set(this.tilePosition, 0));
  }

  drawTriple() {
    this.single.visible = false;
    this.double.visible = false;
    this.triple.visible = true;
    this.four.visible = false;
    this.triple.children.map((wave: PIXI.TilingSprite) => wave.tilePosition.set(this.tilePosition, 0));
  }

  drawFour() {
    this.single.visible = false;
    this.double.visible = false;
    this.triple.visible = false;
    this.four.visible = true;
    this.four.children.map((wave: PIXI.TilingSprite) => wave.tilePosition.set(this.tilePosition, 0));
  }

  update(drawInfo: DrawInfo) {
    const { graphics, path, path2, app, renderTexture, speedMaxPerSec, speedMinPerSec } = this;
    const { colorMain, colorSub, objectShape, speed } = drawInfo;
    this.drawInfo = drawInfo;
    if (objectShape !== 'GizaGiza') return;
    this.currentSpeedPerSec = speedMinPerSec + (speedMaxPerSec - speedMinPerSec) * speed;
    // this.currentSpeedPerSec = 200;//speedMinPerSec;
    graphics.lineStyle(0);
    graphics.beginFill(colorMain);
    graphics.drawPolygon(path);
    graphics.endFill();
    graphics.lineStyle(0);
    graphics.beginFill(colorSub);
    graphics.drawPolygon(path2);
    graphics.endFill();
    app.renderer.render(graphics, { renderTexture, clear: true });
  }

  draw() {
    this.tilePosition += this.app.ticker.deltaMS * 0.001 * this.currentSpeedPerSec;
    // this.drawFour();
    // return;

    const { objectCount, objectShape } = this.drawInfo;
    if (objectShape !== 'GizaGiza') {
      this.single.visible = false;
      this.double.visible = false;
      this.triple.visible = false;
      this.four.visible = false;
      return;
    }

    switch (objectCount) {
      case 1:
        this.drawSingle();
        break;
      case 2:
        this.drawDouble();
        break;
      case 3:
        this.drawTriple();
        break;
      case 4:
        this.drawFour();
        break;
      default:
        break;
    }
  }
}
