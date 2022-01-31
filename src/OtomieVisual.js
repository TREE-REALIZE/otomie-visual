import * as PIXI from 'pixi.js';
import {TriangleWave} from './TriangleWave';
// import sample from './sample.png';

PIXI.utils.skipHello();

export class OtomieVisual {
  app;
  triangleWave;

  init(container, width, height) {
    const app = new PIXI.Application({
      width,
      height, 
      resolution: devicePixelRatio,
    });
    this.app = app;
    container.appendChild(app.view);
    this.triangleWave = new TriangleWave(app);
  }

  render(delta, visual) {
    // let sprite = PIXI.Sprite.from(sample);
    // this.app.stage.addChild(sprite);
    // // Add a variable to count up the seconds our demo has been running
    // let elapsed = 0.0;
    // // Tell our application's ticker to run a new callback every frame, passing
    // // in the amount of time that has passed since the last tick
    // this.app.ticker.add((delta) => {
    //   // Add the time to our total elapsed time
    //   elapsed += delta;
    //   // Update the sprite's X position based on the cosine of our elapsed time.  We divide
    //   // by 50 to slow the animation down a bit...
    //   sprite.x = 100.0 + Math.cos(elapsed / 50.0) * 300.0;
    // });
    // this.app.ticker.add((delta) => {
    //   this.triangleWave.draw(delta);
    // });
    this.triangleWave.draw(delta);
  }
}
