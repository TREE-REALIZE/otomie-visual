import * as PIXI from 'pixi.js';
import { DrawInfo } from './type';

export class Nami {
  app: PIXI.Application;
  graphics: PIXI.Graphics;
  renderTexture: PIXI.RenderTexture;
  lenA: number;
  lenB: number;
  lenC: number;
  lenD: number;
  path: number[][];
  single: PIXI.TilingSprite;
  double: PIXI.Container;
  triple: PIXI.Container;
  four: PIXI.Container;
  drawInfo: DrawInfo;
  speedMinPerSec: number;
  speedMaxPerSec: number;
  currentSpeedPerSec: number;
  tilePosition = 0;
  namiOffsets = [50, 100, 45, 10];

  setup(app: PIXI.Application, drawInfo: DrawInfo) {
    this.app = app;
    const graphics = new PIXI.Graphics();
    this.graphics = graphics;
    const screen = this.app.screen;
    this.config();
    const unitWidth = 100;
    const scale = screen.width / (unitWidth * 2 * 1.5);
    const lenA = unitWidth * scale;  // 波の横幅
    const lenB = 90 * scale;  // 波の高さ
    const lenC = 50 * scale;  // 波の太さ
    const lenD = lenC * 0.45;  // 2つ目の波の太さ
    this.lenA = lenA;
    this.lenB = lenB;
    this.lenC = lenC;
    this.lenD = lenD;
    const path = [
      [0, lenC * 0.5],
      [lenA * 0.5, lenC * 0.5],
      [lenA * 0.5, lenB - lenC * 0.5],
      [lenA, lenB - lenC * 0.5],
      [lenA, lenB - lenC * 0.5],
      [lenA + lenA * 0.5, lenB - lenC * 0.5],
      [lenA + lenA * 0.5, lenC * 0.5],
      [lenA + lenA, lenC * 0.5]
    ];
    this.path = path;
    const renderTexture = PIXI.RenderTexture.create({
      width: lenA + lenA,
      height: lenB,
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

  update(drawInfo: DrawInfo) {
    const { graphics, path, app, renderTexture, speedMaxPerSec, speedMinPerSec, lenA, lenC, lenD } = this;
    const { colorMain, colorSub, speed } = drawInfo;
    this.drawInfo = drawInfo;
    this.currentSpeedPerSec = speedMinPerSec + (speedMaxPerSec - speedMinPerSec) * speed;
    graphics.x = lenA * -0.5;
    graphics.lineStyle(lenC, colorSub);
    graphics.moveTo(path[0][0], path[0][1]);
    graphics.bezierCurveTo(
      path[1][0], path[1][1],
      path[2][0], path[2][1],
      path[3][0], path[3][1],
    );
    graphics.lineTo(path[4][0], path[4][1]);
    graphics.bezierCurveTo(
      path[5][0], path[5][1],
      path[6][0], path[6][1],
      path[7][0], path[7][1],
    );
    graphics.lineTo(path[7][0], path[7][1]);
    graphics.bezierCurveTo(
      path[1][0] + path[7][0], path[1][1],
      path[2][0] + path[7][0], path[2][1],
      path[3][0] + path[7][0], path[3][1],
    );
    graphics.lineStyle(lenD, colorMain);
    graphics.moveTo(path[0][0], path[0][1]);
    graphics.bezierCurveTo(
      path[1][0], path[1][1],
      path[2][0], path[2][1],
      path[3][0], path[3][1],
    );
    graphics.lineTo(path[4][0], path[4][1]);
    graphics.bezierCurveTo(
      path[5][0], path[5][1],
      path[6][0], path[6][1],
      path[7][0], path[7][1],
    );
    graphics.lineTo(path[7][0], path[7][1]);
    graphics.bezierCurveTo(
      path[1][0] + path[7][0], path[1][1],
      path[2][0] + path[7][0], path[2][1],
      path[3][0] + path[7][0], path[3][1],
    );

    app.renderer.render(graphics, { renderTexture, clear: true });
  }

  draw() {
    this.tilePosition += this.app.ticker.deltaMS * 0.001 * this.currentSpeedPerSec;
    // this.drawSingle();
    // return;

    const { objectCount, objectShape } = this.drawInfo;
    if (objectShape !== 'Nami') {
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
    this.double.children.map((wave: PIXI.DisplayObject, i: number) => (wave as PIXI.TilingSprite).tilePosition.set(this.tilePosition + this.namiOffsets[i], 0));
  }

  drawTriple() {
    this.single.visible = false;
    this.double.visible = false;
    this.triple.visible = true;
    this.four.visible = false;
    this.triple.children.map((wave: PIXI.DisplayObject, i: number) => (wave as PIXI.TilingSprite).tilePosition.set(this.tilePosition + this.namiOffsets[i], 0));
  }

  drawFour() {
    this.single.visible = false;
    this.double.visible = false;
    this.triple.visible = false;
    this.four.visible = true;
    this.four.children.map((wave: PIXI.DisplayObject, i: number) => (wave as PIXI.TilingSprite).tilePosition.set(this.tilePosition + this.namiOffsets[i], 0));
  }
}
