import * as PIXI from 'pixi.js';
import { DrawInfo } from './type';

export class Maru {
  app: PIXI.Application;
  graphics: PIXI.Graphics;
  renderTexture: PIXI.RenderTexture;
  innerRadius: number = 50;
  outerRadius: number = 100;
  single: PIXI.Sprite;
  double: PIXI.Container;
  triple: PIXI.Container;
  four: PIXI.Container;
  drawInfo: DrawInfo;
  speedMinPerSec: number;
  speedMaxPerSec: number;
  currentSpeedPerSec: number;
  scale: number = 1;
  scaleDirection: number = 1;

  setup(app: PIXI.Application, drawInfo: DrawInfo) {
    const { outerRadius } = this;
    this.app = app;
    const graphics = new PIXI.Graphics();
    this.graphics = graphics;
    this.config();
    const renderTexture = PIXI.RenderTexture.create({
      width: outerRadius * 2,
      height: outerRadius * 2,
      resolution: devicePixelRatio,
    });
    this.renderTexture = renderTexture;
    this.update(drawInfo);
    const screen = this.app.screen;
    this.single = new PIXI.Sprite(renderTexture);
    this.single.anchor.set(0.5, 0.5);
    this.single.x = screen.width * 0.5;
    this.single.y = screen.height * 0.5;
    this.single.visible = false;
    this.app.stage.addChild(this.single);

    this.double = new PIXI.Container();
    for (let i = 0; i < 2; i++) {
      const sprite = new PIXI.Sprite(renderTexture);
      sprite.anchor.set(0.5, 0.5);
      sprite.x = screen.width * 0.5;
      sprite.y = screen.height * 0.5 + Math.sin(Math.PI / 2 + Math.PI * i) * renderTexture.height * 0.8;
      this.double.addChild(sprite);
    }
    this.double.visible = false;
    this.app.stage.addChild(this.double);

    this.triple = new PIXI.Container();
    for (let i = 0; i < 3; i++) {
      const sprite = new PIXI.Sprite(renderTexture);
      sprite.anchor.set(0.5, 0.5);
      sprite.x =
        screen.width * 0.5 + Math.cos((-1 * Math.PI) / 2 + ((Math.PI * 2) / 3) * i) * renderTexture.width * 0.8;
      sprite.y =
        screen.height * 0.5 + Math.sin((-1 * Math.PI) / 2 + ((Math.PI * 2) / 3) * i) * renderTexture.height * 0.8;
      this.triple.addChild(sprite);
    }
    this.triple.visible = false;
    this.app.stage.addChild(this.triple);

    this.four = new PIXI.Container();
    for (let i = 0; i < 4; i++) {
      const sprite = new PIXI.Sprite(renderTexture);
      sprite.anchor.set(0.5, 0.5);
      sprite.x = screen.width * 0.5 + Math.cos(Math.PI / 4 + (Math.PI / 2) * i) * renderTexture.width * 0.8;
      sprite.y = screen.height * 0.5 + Math.sin(Math.PI / 4 + (Math.PI / 2) * i) * renderTexture.height * 0.8;
      this.four.addChild(sprite);
    }
    this.four.visible = false;
    this.app.stage.addChild(this.four);
  }

  render() {
    const { graphics, innerRadius, outerRadius, app, renderTexture, scale } = this;
    const { colorMain, colorSub } = this.drawInfo;
    graphics.clear();
    graphics.lineStyle(0);
    graphics.beginFill(colorSub);
    graphics.drawEllipse(outerRadius, outerRadius, outerRadius * scale, outerRadius * scale);
    graphics.endFill();
    graphics.lineStyle(0);
    graphics.beginFill(colorMain);
    graphics.drawEllipse(outerRadius, outerRadius, innerRadius * scale, innerRadius * scale);
    graphics.endFill();
    app.renderer.render(graphics, { renderTexture, clear: true });
  }

  config() {
    this.speedMinPerSec = 0.5 / 50;
    this.speedMaxPerSec = 0.5 / 4;
  }

  update(drawInfo: DrawInfo) {
    const { speedMaxPerSec, speedMinPerSec } = this;
    const { speed } = drawInfo;
    this.drawInfo = drawInfo;
    this.currentSpeedPerSec = speedMinPerSec + (speedMaxPerSec - speedMinPerSec) * speed;
  }

  draw() {
    this.scale = Math.max(
      0.5,
      Math.min(1, this.scale + this.scaleDirection * this.app.ticker.deltaMS * 0.001 * this.currentSpeedPerSec),
    );
    if (this.scale === 1) this.scaleDirection = -1;
    if (this.scale === 0.5) this.scaleDirection = 1;

    const { objectCount, objectShape } = this.drawInfo;
    if (objectShape !== 'Maru') {
      this.single.visible = false;
      this.double.visible = false;
      this.triple.visible = false;
      this.four.visible = false;
      return;
    }

    this.render();
    // this.drawSingle();
    // return;

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
  }

  drawDouble() {
    this.single.visible = false;
    this.double.visible = true;
    this.triple.visible = false;
    this.four.visible = false;
  }

  drawTriple() {
    this.single.visible = false;
    this.double.visible = false;
    this.triple.visible = true;
    this.four.visible = false;
  }

  drawFour() {
    this.single.visible = false;
    this.double.visible = false;
    this.triple.visible = false;
    this.four.visible = true;
  }
}
