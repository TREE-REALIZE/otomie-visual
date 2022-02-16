import * as PIXI from 'pixi.js';
import { DrawInfo } from './type';

export class Shikaku {
  app: PIXI.Application;
  graphics: PIXI.Graphics;
  renderTexture: PIXI.RenderTexture;
  lenA: number = 100;  // 正方形の一辺の長さ
  scales: number[];
  single: PIXI.Sprite;
  double: PIXI.Container;
  triple: PIXI.Container;
  four: PIXI.Container;
  drawInfo: DrawInfo;
  speedMinPerSec: number;
  speedMaxPerSec: number;
  currentSpeedPerSec: number;
  moveRate: number = 1;

  setup(app: PIXI.Application, drawInfo: DrawInfo) {
    const { lenA } = this;
    this.app = app;
    const screen = this.app.screen;
    const scales = [0.85, 0.45, 0.3, 0.3].map(each => screen.width / lenA * each);
    this.scales = scales;
    const graphics = new PIXI.Graphics();
    this.graphics = graphics;
    this.config();
    const renderTexture = PIXI.RenderTexture.create({
      width: lenA,
      height: lenA,
      resolution: devicePixelRatio,
    });
    this.renderTexture = renderTexture;
    this.update(drawInfo);
    this.single = new PIXI.Sprite(renderTexture);
    this.single.anchor.set(0.5, 0.5);
    this.single.scale.set(scales[0]);
    this.single.visible = false;
    this.app.stage.addChild(this.single);

    this.double = new PIXI.Container();
    for (let i = 0; i < 2; i++) {
      const sprite = new PIXI.Sprite(renderTexture);
      sprite.anchor.set(0.5, 0.5);
      sprite.scale.set(scales[1]);
      this.double.addChild(sprite);
    }
    this.double.x = screen.width * 0.5;
    this.double.y = screen.height * 0.5;
    this.double.visible = false;
    this.app.stage.addChild(this.double);

    this.triple = new PIXI.Container();
    for (let i = 0; i < 3; i++) {
      const sprite = new PIXI.Sprite(renderTexture);
      sprite.anchor.set(0.5, 0.5);
      sprite.scale.set(scales[2]);
      this.triple.addChild(sprite);
    }
    this.triple.x = screen.width * 0.5;
    this.triple.y = screen.height * 0.5;
    this.triple.visible = false;
    this.app.stage.addChild(this.triple);

    this.four = new PIXI.Container();
    for (let i = 0; i < 4; i++) {
      const sprite = new PIXI.Sprite(renderTexture);
      sprite.anchor.set(0.5, 0.5);
      sprite.scale.set(scales[3]);
      this.four.addChild(sprite);
    }
    this.four.x = screen.width * 0.5;
    this.four.y = screen.height * 0.5;
    this.four.visible = false;
    this.app.stage.addChild(this.four);
  }

  render() {
    const { graphics, lenA, app, renderTexture } = this;
    const { colorMain, colorSub } = this.drawInfo;
    const rate = 0.7;
    graphics.lineStyle(0);
    graphics.beginFill(colorSub);
    graphics.drawRect(0, 0, lenA, lenA);
    graphics.endFill();
    graphics.lineStyle(0);
    graphics.beginFill(colorMain);
    graphics.drawRect(lenA * (1 - rate) / 2, lenA * (1 - rate) / 2, lenA * rate, lenA * rate);
    graphics.endFill();
    app.renderer.render(graphics, { renderTexture, clear: true });
  }

  config() {
    this.speedMinPerSec = 1.0 / 50;
    this.speedMaxPerSec = 1.0 / 4;
  }

  update(drawInfo: DrawInfo) {
    const { speedMaxPerSec, speedMinPerSec } = this;
    const { speed } = drawInfo;
    this.drawInfo = drawInfo;
    this.currentSpeedPerSec = speedMinPerSec + (speedMaxPerSec - speedMinPerSec) * speed;
    this.render();
  }

  draw() {
    this.moveRate = (this.moveRate + this.app.ticker.deltaMS * 0.001 * this.currentSpeedPerSec) % 1;

    const { objectCount, objectShape } = this.drawInfo;
    if (objectShape !== 'Shikaku') {
      this.single.visible = false;
      this.double.visible = false;
      this.triple.visible = false;
      this.four.visible = false;
      return;
    }
    // this.drawFour();
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
    const { app, moveRate, scales, lenA } = this;
    this.single.visible = true;
    this.double.visible = false;
    this.triple.visible = false;
    this.four.visible = false;
    this.single.x = app.screen.width / 2;
    this.single.y = (app.screen.height + lenA * scales[0] / 2) - (app.screen.height + lenA * scales[0]) * moveRate;
  }

  drawDouble() {
    const { app, lenA, moveRate, scales } = this;
    this.single.visible = false;
    this.double.visible = true;
    this.triple.visible = false;
    this.four.visible = false;
    this.double.children.map((each, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      each.x = (-1 * dir * lenA * scales[1]) / 2;
      each.y = (dir * lenA * scales[1]) / 2 - 1 * dir * (app.screen.height / 2 + lenA * scales[1]) * moveRate;
    })
  }

  drawTriple() {
    const { app, lenA, moveRate, scales } = this;
    this.single.visible = false;
    this.double.visible = false;
    this.triple.visible = true;
    this.four.visible = false;
    this.triple.children.map((each, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      each.x = -1 * lenA * scales[2] + i * lenA * scales[2];
      each.y = (-1 * dir * lenA * scales[2] / 2) + dir * (app.screen.height / 2 + lenA * scales[2]) * moveRate;
    })
  }

  drawFour() {
    const { app, lenA, moveRate, scales } = this;
    this.single.visible = false;
    this.double.visible = false;
    this.triple.visible = false;
    this.four.visible = true;
    const radius = lenA * scales[3];
    this.four.children.map((each, i) => {
      const dir = i < 2 ? 1 : -1;
      const axisX = i % 2 === 0 ? 1 : 0;
      const axisY = i % 2 === 0 ? 0 : 1;
      const radian = Math.PI / 2 * (i - 1);
      each.x = Math.cos(radian) * radius + axisX * dir * ((app.screen.width / 2 + lenA * scales[3] / 2) * moveRate);
      each.y = Math.sin(radian) * radius + axisY * dir * ((app.screen.width / 2 + lenA * scales[3] / 2) * moveRate);;
    })
  }
}
