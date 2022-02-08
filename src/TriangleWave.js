import * as PIXI from 'pixi.js';

export class TriangleWave {
  app;
  graphics;
  renderTexture;
  path;
  path2;
  single;
  double;
  triple;
  four;
  drawInfo;
  speedMinPerSec;
  speedMaxPerSec;
  currentSpeedPerSec;
  tilePosition = 0;
  elapsedMS = 0;

  setup(app, drawInfo) {
    this.app = app;
    const graphics = new PIXI.Graphics();
    this.graphics = graphics;
    const screen = this.app.screen;
    this.speedMinPerSec = screen.width / 50;
    this.speedMaxPerSec = screen.width / 4;
    const unitWidth = 90;
    const scale = screen.width / (unitWidth * 2 * 3.5);
    const lenA = unitWidth * scale;
    const lenB = 57 * scale;
    const lenC = 35 * scale;
    const path = [0, 0, lenA, lenB, lenA * 2, 0, lenA * 2, lenC, lenA, lenB + lenC, 0, lenC];
    const path2 = [0, lenC, lenA, lenB + lenC, lenA * 2, 0 + lenC, lenA * 2, lenC + lenC, lenA, lenB + lenC + lenC, 0, lenC + lenC];
    this.path = path;
    this.path2 = path2;
    const renderTexture = PIXI.RenderTexture.create({
      width: lenA + lenA,
      height: lenB + lenC + lenC,
      resolution: devicePixelRatio,
    });
    this.renderTexture = renderTexture;
    this.update(drawInfo);

    this.single = new PIXI.TilingSprite(renderTexture, renderTexture.width * Math.ceil(screen.width / renderTexture.width), renderTexture.height);
    this.single.y = (screen.height - renderTexture.height) * 0.5;
    this.single.visible = false;
    this.app.stage.addChild(this.single);

    this.double = new PIXI.Container();
    for (let i = 0; i < 2; i++) {
      const wave = new PIXI.TilingSprite(renderTexture, renderTexture.width * Math.ceil(screen.width / renderTexture.width), renderTexture.height);
      wave.y = screen.height * 0.25 + screen.height * 0.5 * i - renderTexture.height * 0.5;
      this.double.addChild(wave);
    }
    this.double.visible = false;
    this.app.stage.addChild(this.double);

    this.triple = new PIXI.Container();
    for (let i = 0; i < 3; i++) {
      const wave = new PIXI.TilingSprite(renderTexture, renderTexture.width * Math.ceil(screen.width / renderTexture.width), renderTexture.height);
      wave.y = screen.height * 0.1666 + screen.height * 0.333 * i - renderTexture.height * 0.5;
      this.triple.addChild(wave);
    }
    this.triple.visible = false;
    this.app.stage.addChild(this.triple);

    this.four = new PIXI.Container();
    for (let i = 0; i < 4; i++) {
      const wave = new PIXI.TilingSprite(renderTexture, renderTexture.width * Math.ceil(screen.width / renderTexture.width), renderTexture.height);
      wave.y = screen.height * 0.125 + screen.height * 0.25 * i - renderTexture.height * 0.5;
      this.four.addChild(wave);
    }
    this.four.visible = false;
    this.app.stage.addChild(this.four);
  }

  drawsingle() {
    this.single.visible = true;
    this.double.visible = false;
    this.triple.visible = false;
    this.four.visible = false;
    this.single.tilePosition.set(this.tilePosition, 0);
  }

  drawdouble() {
    this.single.visible = false;
    this.double.visible = true;
    this.triple.visible = false;
    this.four.visible = false;
    this.double.children.map(wave => wave.tilePosition.set(this.tilePosition, 0));
  }

  drawtriple() {
    this.single.visible = false;
    this.double.visible = false;
    this.triple.visible = true;
    this.four.visible = false;
    this.triple.children.map(wave => wave.tilePosition.set(this.tilePosition, 0));
  }

  drawfour() {
    this.single.visible = false;
    this.double.visible = false;
    this.triple.visible = false;
    this.four.visible = true;
    this.four.children.map(wave => wave.tilePosition.set(this.tilePosition, 0));
  }

  update(drawInfo) {
    const { graphics, path, path2, app, renderTexture, speedMaxPerSec, speedMinPerSec } = this;
    const { colorMain, colorSub, objectShape, speed } = drawInfo;
    if (objectShape !== 'TriangleWave') return;
    this.drawInfo = drawInfo;
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

  draw(elapsedMS) {
    const deltaMS = elapsedMS - this.elapsedMS;
    this.elapsedMS = elapsedMS;
    this.tilePosition += deltaMS * 0.001 * this.currentSpeedPerSec;
    // this.drawfour();
    // return;
    
    const { objectCount, objectShape } = this.drawInfo;
    if (objectShape !== 'TriangleWave') {
      this.single.visible = false;
      this.double.visible = false;
      this.triple.visible = false;
      this.four.visible = false;
      return;
    };

    switch (objectCount) {
      case 1:
        this.drawsingle();
        break;
      case 2:
        this.drawdouble();
        break;
      case 3:
        this.drawtriple();
        break;
      case 4:
        this.drawfour();
        break;
      default:
        break;
    }
  }
}