import * as PIXI from 'pixi.js';

export class Ripple {
  app;
  graphics;
  innerRadius;
  outerRadius;
  ripples;
  elapsed = 0.0;

  setup(app) {
    this.app = app;
    const graphics = new PIXI.Graphics();
    this.graphics = graphics;
    const innerRadius = 50;
    const outerRadius = 100;
    this.innerRadius = innerRadius;
    this.outerRadius = outerRadius;
    const renderTexture = PIXI.RenderTexture.create({
      width: outerRadius*2,
      height: outerRadius*2,
      resolution: devicePixelRatio,
    });
    this.renderTexture = renderTexture;
    graphics.lineStyle(0);
    graphics.beginFill(0x3500FA);
    graphics.drawEllipse(outerRadius,outerRadius,outerRadius,outerRadius);
    graphics.endFill();
    graphics.lineStyle(0);
    graphics.beginFill(0xedaca8);
    graphics.drawEllipse(outerRadius,outerRadius,innerRadius,innerRadius);
    graphics.endFill();
    app.renderer.render(graphics, { renderTexture, clear: true });
    const screen = this.app.screen;
    this.ripples = new PIXI.Container();
    for (let i = 0; i < 4; i++) {
      const ripple = new PIXI.Sprite(renderTexture);
      ripple.anchor.set(0.5, 0.5);
      ripple.x = screen.width * 0.5 + Math.cos(Math.PI / 4 + (Math.PI / 2)*i) * renderTexture.width * 0.8;
      ripple.y = screen.height * 0.5 + Math.sin(Math.PI / 4 + (Math.PI / 2)*i) * renderTexture.height * 0.8;
      this.ripples.addChild(ripple);
    }
    this.app.stage.addChild(this.ripples);
  }

  draw (delta) {
    this.elapsed += delta;
    const {graphics, innerRadius, outerRadius, app, renderTexture} = this;
    graphics.clear();
    graphics.lineStyle(0);
    graphics.beginFill(0x3500FA);
    graphics.drawEllipse(outerRadius,outerRadius,outerRadius*Math.sin(this.elapsed*0.1),outerRadius*Math.sin(this.elapsed*0.1));
    graphics.endFill();
    graphics.lineStyle(0);
    graphics.beginFill(0xedaca8);
    graphics.drawEllipse(outerRadius,outerRadius,innerRadius,innerRadius);
    graphics.endFill();
    app.renderer.render(graphics, { renderTexture, clear: true });
  }
}