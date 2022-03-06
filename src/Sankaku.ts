import * as PIXI from 'pixi.js';
import { DrawInfo } from './type';
import { vertexSrc, fragmentSrc } from './shader/ColorShader'

export class Sankaku {
  app: PIXI.Application;
  graphics: PIXI.Graphics;
  thick: PIXI.Mesh<PIXI.Shader>;
  thin: PIXI.Mesh<PIXI.Shader>;
  renderTexture: PIXI.RenderTexture;
  unitWidth = 220;
  lenA: number;  // 底辺
  lenB: number;  // 高さ;
  lenC: number;  // 小さい三角形の高さ;
  scales = [0.75, 0.5, 0.4, 0.4]
  single: PIXI.Sprite;
  double: PIXI.Container;
  triple: PIXI.Container;
  four: PIXI.Container;
  drawInfo: DrawInfo;
  speedMinPerSec: number;
  speedMaxPerSec: number;
  currentSpeedPerSec: number;
  moveRate: number = 1;
  moveDirection: number = 1;

  setup(app: PIXI.Application, drawInfo: DrawInfo) {
    const { unitWidth, scales } = this;
    this.app = app;
    this.drawInfo = drawInfo;
    this.config();
    const screen = this.app.screen;
    const scale = screen.width / unitWidth;
    const lenA = unitWidth * scale;
    const lenB = 180 * scale;
    const lenC = 110 * scale;
    this.lenA = lenA;
    this.lenB = lenB;
    this.lenC = lenC;
    const renderTexture = PIXI.RenderTexture.create({
      width: lenA,
      height: lenB,
      resolution: devicePixelRatio,
    });
    this.renderTexture = renderTexture;
    this.setupGraphics();
    this.update(drawInfo);
    this.setupSplites();
  }

  setupGraphics() {
    const { lenA, lenB, lenC } = this;
    const { colorMain, colorSub } = this.drawInfo;
    const graphics = new PIXI.Graphics();
    this.graphics = graphics;
    const rate = lenC / lenB;
    const thick = new PIXI.Mesh(new PIXI.Geometry()
      .addAttribute('aVertexPosition', [0, 0, lenA, 0, lenA * 0.5, lenB]), PIXI.Shader.from(vertexSrc, fragmentSrc, {
        uColor: new Float32Array([1, 1, 1, 1]),
      }
      ));
    this.thick = thick;
    const thin = new PIXI.Mesh(new PIXI.Geometry()
      .addAttribute('aVertexPosition', [lenA * (1 - rate) * 0.5, lenB - lenC, lenA - lenA * (1 - rate) * 0.5, lenB - lenC, lenA * 0.5, lenB]), PIXI.Shader.from(vertexSrc, fragmentSrc, {
        uColor: new Float32Array([1, 1, 1, 1]),
      }
      ));
    this.thin = thin;
    this.graphics.addChild(thick, thin)
  }

  setupSplites() {
    const { renderTexture, scales, app } = this;
    const { screen } = app;
    this.single = new PIXI.Sprite(renderTexture);
    this.single.anchor.set(0.5, 0);
    this.single.scale.set(scales[0]);
    this.single.x = screen.width * 0.5;
    this.single.y = 0;
    this.single.visible = false;
    this.app.stage.addChild(this.single);

    this.double = new PIXI.Container();
    for (let i = 0; i < 2; i++) {
      const sprite = new PIXI.Sprite(renderTexture);
      sprite.anchor.set(0.5, 0);
      sprite.scale.set(scales[1]);
      sprite.rotation = Math.PI * i;
      this.double.addChild(sprite);
    }
    this.double.x = screen.width * 0.5;
    this.double.y = screen.height * 0.5;
    this.double.visible = false;
    this.app.stage.addChild(this.double);

    this.triple = new PIXI.Container();
    for (let i = 0; i < 3; i++) {
      const sprite = new PIXI.Sprite(renderTexture);
      sprite.anchor.set(0.5, 0);
      sprite.scale.set(scales[2]);
      sprite.rotation = Math.PI + (Math.PI * 2 / 3) * i;
      this.triple.addChild(sprite);
    }
    this.triple.x = screen.width * 0.5;
    this.triple.y = screen.height * 0.5 + screen.height / 20;
    this.triple.visible = false;
    this.app.stage.addChild(this.triple);

    this.four = new PIXI.Container();
    for (let i = 0; i < 4; i++) {
      const sprite = new PIXI.Sprite(renderTexture);
      sprite.anchor.set(0.5, 0);
      sprite.scale.set(scales[3]);
      sprite.rotation = Math.PI + Math.PI / 2 * i;
      this.four.addChild(sprite);
    }
    this.four.x = screen.width * 0.5;
    this.four.y = screen.height * 0.5;
    this.four.visible = false;
    this.app.stage.addChild(this.four);
  }

  render() {
    const { app, graphics, thick, thin, renderTexture, drawInfo } = this;
    const { colorMainRgb, colorSubRgb } = drawInfo;
    thick.shader.uniforms.uColor[0] = colorSubRgb[0];
    thick.shader.uniforms.uColor[1] = colorSubRgb[1];
    thick.shader.uniforms.uColor[2] = colorSubRgb[2];
    thin.shader.uniforms.uColor[0] = colorMainRgb[0];
    thin.shader.uniforms.uColor[1] = colorMainRgb[1];
    thin.shader.uniforms.uColor[2] = colorMainRgb[2];
    app.renderer.render(graphics, { renderTexture, clear: true });
  }

  config() {
    this.speedMinPerSec = 1.0 / (50 / 30);
    this.speedMaxPerSec = 1.0 / (4 / 30);
  }

  update(drawInfo: DrawInfo) {
    const { speedMaxPerSec, speedMinPerSec } = this;
    const { speed } = drawInfo;
    this.drawInfo = drawInfo;
    this.currentSpeedPerSec = speedMinPerSec + (speedMaxPerSec - speedMinPerSec) * speed;
    this.render();
  }

  draw() {
    this.moveRate = Math.max(
      0,
      Math.min(1, this.moveRate + this.moveDirection * this.app.ticker.deltaMS * 0.001 * this.currentSpeedPerSec),
    );
    if (this.moveRate === 1) this.moveDirection = -1;
    if (this.moveRate === 0) this.moveDirection = 1;

    const { objectCount, objectShape } = this.drawInfo;
    if (objectShape !== 'Sankaku') {
      this.single.visible = false;
      this.double.visible = false;
      this.triple.visible = false;
      this.four.visible = false;
      return;
    }

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
    const { app, lenB, moveRate, scales } = this;
    this.single.visible = true;
    this.double.visible = false;
    this.triple.visible = false;
    this.four.visible = false;
    this.single.y = (app.screen.height - lenB * scales[0]) * moveRate;
  }

  drawDouble() {
    const { app, lenB, moveRate, scales } = this;
    this.single.visible = false;
    this.double.visible = true;
    this.triple.visible = false;
    this.four.visible = false;
    this.double.children.map((each, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      each.y = (app.screen.height * 0.5 * Math.sin(Math.PI * i - Math.PI * 0.5)) + (app.screen.height * 0.5 - lenB * scales[1]) * moveRate * dir;
    })
  }

  drawTriple() {
    const { app, lenA, lenB, moveRate, scales } = this;
    this.single.visible = false;
    this.double.visible = false;
    this.triple.visible = true;
    this.four.visible = false;
    const radius = lenA * scales[2] * 0.5 / Math.sqrt(3);
    this.triple.children.map((each, i) => {
      each.x = (radius + ((app.screen.height / 2 + app.screen.height / 20) - radius - lenB * scales[2]) * moveRate) * Math.cos(-0.5 * Math.PI + Math.PI * 2 / 3 * i);
      each.y = (radius + ((app.screen.height / 2 + app.screen.height / 20) - radius - lenB * scales[2]) * moveRate) * Math.sin(-0.5 * Math.PI + Math.PI * 2 / 3 * i);
    })
  }

  drawFour() {
    const { app, lenA, lenB, moveRate, scales } = this;
    this.single.visible = false;
    this.double.visible = false;
    this.triple.visible = false;
    this.four.visible = true;
    const radius = app.screen.height / 2;
    this.four.children.map((each, i) => {
      each.x = (radius + (-1 * radius + lenB * scales[3]) * moveRate) * Math.cos(0.5 * Math.PI + Math.PI / 2 * i);
      each.y = (radius + (-1 * radius + lenB * scales[3]) * moveRate) * Math.sin(0.5 * Math.PI + Math.PI / 2 * i);
    })
  }
}
