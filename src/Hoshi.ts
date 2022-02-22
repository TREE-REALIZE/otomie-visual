import * as PIXI from 'pixi.js';
import { DrawInfo } from './type';

export class Hoshi {
  app: PIXI.Application;
  graphics: PIXI.Graphics;
  renderTexture: PIXI.RenderTexture;
  lenA: number = 100; //星の外接円の半径
  lenB: number = 50; //星の内接円の半径
  lenC: number = 0.6; //小さい星の縮小比率
  scales = [0.9, 0.55, 0.5, 0.5];
  path: number[] = [];
  path2: number[] = [];
  single: PIXI.Sprite;
  double: PIXI.Container;
  triple: PIXI.Container;
  four: PIXI.Container;
  drawInfo: DrawInfo;
  speedMinPerSec: number;
  speedMaxPerSec: number;
  currentSpeedPerSec: number;
  rotation = 0;

  setup(app: PIXI.Application, drawInfo: DrawInfo) {
    const { lenA, lenB, lenC, scales } = this;
    this.app = app;
    const graphics = new PIXI.Graphics();
    this.graphics = graphics;
    const screen = this.app.screen;
    this.config();
    const scale = screen.width / (lenA * 2);
    for (let i = 0; i < 5; i++) {
      const outerPos = [
        Math.cos(-Math.PI / 2 + (Math.PI * 2 / 5) * i) * lenA * scale,
        Math.sin(-Math.PI / 2 + (Math.PI * 2 / 5) * i) * lenA * scale
      ];
      const innerPos = [
        Math.cos(-Math.PI / 2 + Math.PI / 5 + (Math.PI * 2 / 5) * i) * lenB * scale,
        Math.sin(-Math.PI / 2 + Math.PI / 5 + (Math.PI * 2 / 5) * i) * lenB * scale
      ];
      this.path.push(outerPos[0]);
      this.path.push(outerPos[1]);
      this.path.push(innerPos[0]);
      this.path.push(innerPos[1]);
      this.path2.push(outerPos[0] * lenC);
      this.path2.push(outerPos[1] * lenC);
      this.path2.push(innerPos[0] * lenC);
      this.path2.push(innerPos[1] * lenC);
    }
    const renderTexture = PIXI.RenderTexture.create({
      width: lenA * 2 * scale,
      height: lenA * 2 * scale,
      resolution: devicePixelRatio,
    });
    this.renderTexture = renderTexture;
    this.update(drawInfo);

    this.single = new PIXI.Sprite(renderTexture);
    this.single.anchor.set(0.5, 0.5);
    this.single.scale.set(scales[0]);
    this.single.x = screen.width / 2;
    this.single.y = screen.height / 2;
    this.single.visible = false;
    this.app.stage.addChild(this.single);

    this.double = new PIXI.Container();
    let radius = Math.sqrt(screen.width * screen.width + screen.height + screen.height) / 4 + screen.width / 30;
    for (let i = 0; i < 2; i++) {
      const sprite = new PIXI.Sprite(renderTexture);
      sprite.anchor.set(0.5, 0.5);
      sprite.scale.set(scales[1]);
      sprite.x = Math.cos(-Math.PI / 4 + Math.PI * i) * radius;
      sprite.y = Math.sin(-Math.PI / 4 + Math.PI * i) * radius;
      this.double.addChild(sprite);
    }
    this.double.x = screen.width / 2;
    this.double.y = screen.height / 2;
    this.double.visible = false;
    this.app.stage.addChild(this.double);

    this.triple = new PIXI.Container();
    for (let i = 0; i < 3; i++) {
      const sprite = new PIXI.Sprite(renderTexture);
      sprite.anchor.set(0.5, 0.5);
      sprite.scale.set(scales[2]);
      sprite.x = Math.cos(-Math.PI / 2 + Math.PI * 2 / 3 * i) * radius;
      sprite.y = Math.sin(-Math.PI / 2 + Math.PI * 2 / 3 * i) * radius + screen.height / 20;
      this.triple.addChild(sprite);
    }
    this.triple.x = screen.width / 2;
    this.triple.y = screen.height / 2;
    this.triple.visible = false;
    this.app.stage.addChild(this.triple);

    this.four = new PIXI.Container();
    for (let i = 0; i < 4; i++) {
      const sprite = new PIXI.Sprite(renderTexture);
      sprite.anchor.set(0.5, 0.5);
      sprite.scale.set(scales[3]);
      sprite.x = Math.cos(-Math.PI / 4 + Math.PI * 2 / 4 * i) * radius * 1.2;
      sprite.y = Math.sin(-Math.PI / 4 + Math.PI * 2 / 4 * i) * radius * 1.2;
      this.four.addChild(sprite);
    }
    this.four.x = screen.width / 2;
    this.four.y = screen.height / 2;
    this.four.visible = false;
    this.app.stage.addChild(this.four);
  }

  config() {
    this.speedMinPerSec = Math.PI * 2 / (100 / 30);
    this.speedMaxPerSec = Math.PI * 2 / (16 / 30);
  }

  update(drawInfo: DrawInfo) {
    const { graphics, path, path2, app, renderTexture, speedMaxPerSec, speedMinPerSec, lenA } = this;
    const { colorMain, colorSub, speed } = drawInfo;
    this.drawInfo = drawInfo;
    this.currentSpeedPerSec = speedMinPerSec + (speedMaxPerSec - speedMinPerSec) * speed;

    graphics.setTransform(renderTexture.width / 2, renderTexture.height / 2);
    graphics.lineStyle(0);
    graphics.beginFill(colorSub);
    graphics.drawPolygon(path);
    graphics.endFill();
    graphics.lineStyle(0);
    graphics.beginFill(colorMain);
    graphics.drawPolygon(path2);
    graphics.endFill();
    app.renderer.render(graphics, { renderTexture, clear: true });
  }

  draw() {
    this.rotation += this.app.ticker.deltaMS * 0.001 * this.currentSpeedPerSec;
    // this.drawFour();
    // return;

    const { objectCount, objectShape } = this.drawInfo;
    if (objectShape !== 'Hoshi') {
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
    this.single.rotation = this.rotation;
  }

  drawDouble() {
    this.single.visible = false;
    this.double.visible = true;
    this.triple.visible = false;
    this.four.visible = false;
    this.double.children.map((sprite: PIXI.DisplayObject, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      (sprite as PIXI.Sprite).rotation = this.rotation * dir;
    });
  }

  drawTriple() {
    this.single.visible = false;
    this.double.visible = false;
    this.triple.visible = true;
    this.four.visible = false;
    this.triple.children.map((sprite: PIXI.DisplayObject, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      (sprite as PIXI.Sprite).rotation = this.rotation * dir;
    });
  }

  drawFour() {
    this.single.visible = false;
    this.double.visible = false;
    this.triple.visible = false;
    this.four.visible = true;
    this.four.children.map((sprite: PIXI.DisplayObject, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      (sprite as PIXI.Sprite).rotation = this.rotation * dir;
    });
  }
}
