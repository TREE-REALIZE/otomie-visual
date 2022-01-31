import * as PIXI from 'pixi.js';

export class TriangleWave {
  app;
  graphics;
  tilingSprite;
  elapsed = 0.0;

  constructor(app) {
    this.app = app;
    const graphics = new PIXI.Graphics();
    this.graphics = graphics;
    const lenA = 100;
    const lenB = 60;
    const lenC = 60;
    const path =  [0, 0, lenA, lenB, lenA*2, 0, lenA*2, lenC, lenA, lenB + lenC, 0, lenC];
    const path2 = [0, lenC, lenA, lenB+lenC, lenA*2, 0+lenC, lenA*2, lenC+lenC, lenA, lenB + lenC+lenC, 0, lenC+lenC];
    const renderTexture = PIXI.RenderTexture.create({
      width: lenA+lenA,
      height: lenB + lenC + lenC,
      resolution: devicePixelRatio,
    });
    graphics.lineStyle(0);
    graphics.beginFill(0x3500FA);
    graphics.drawPolygon(path);
    graphics.endFill();
    graphics.lineStyle(0);
    graphics.beginFill(0xedaca8);
    graphics.drawPolygon(path2);
    graphics.endFill();
    app.renderer.render(graphics, { renderTexture, clear: true });
    const tilingSprite = new PIXI.TilingSprite(renderTexture, renderTexture.width*4, renderTexture.height);
    this.tilingSprite = tilingSprite;
    app.stage.addChild(tilingSprite);
  }

  draw (delta) {
    this.elapsed += delta;
    this.tilingSprite.tilePosition.set(this.elapsed, 0);
  }
}