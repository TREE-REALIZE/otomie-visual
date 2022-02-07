import * as PIXI from 'pixi.js';
import { Ripple } from './Ripple';
import { TriangleWave } from './TriangleWave';

PIXI.utils.skipHello();

export class OtomieVisual {
  app;
  triangleWave;
  ripple;
  elapsed = 0.0;
  soundData = {
    volume: 0.0,
    pitch: 0.0,
    sharpness: 0.0,
    roughness: 0.0,
  };
  drawInfo = {
    colorMain: '0xdcf567',
    colorSub: '0x566550',
    objectCount: 1,
    objectShape: 'TriangleWave'
  }

  setup(container, width, height) {
    const app = new PIXI.Application({
      width,
      height,
      resolution: devicePixelRatio,
      backgroundColor: 0xd7d7d7,
    });
    this.app = app;
    container.appendChild(app.view);
    this.triangleWave = new TriangleWave();
    this.triangleWave.setup(app, this.drawInfo);
    this.ripple = new Ripple();
    // this.ripple.setup(app);
    this.app.ticker.add(this.draw.bind(this));
    this.app.ticker.stop();
  }

  draw(delta) {
    this.elapsed += delta;
    this.triangleWave.draw(delta);
    // this.ripple.draw(delta);
  }

  play() {
    this.app.ticker.start();
  }

  pause() {
    this.app.ticker.stop();
  }

  stop() {
    this.app.ticker.stop();
  }

  updateSoundData(soundData) {
    this.soundData = soundData;
    this.calcHsv();
    this.calcObjectCount();
    this.calcObjectShape();
    this.triangleWave.update(this.drawInfo);
  }

  randomSoundData() {
    return {
      volume: Math.abs(Math.cos(this.elapsed * 0.002)),
      pitch: Math.abs(Math.sin(this.elapsed * 0.001 + 1)),
      sharpness: Math.abs(Math.sin(this.elapsed * 0.001)),
      roughness: Math.abs(Math.sin(this.elapsed * 0.01)),
    }
  }

  calcHsv() {
    const { sharpness, volume, pitch } = this.soundData;
    const hue = 360 * (Math.abs(sharpness - 0.5) * 2);
    let rgb = this.hsvToRgb(hue, volume, pitch);
    this.drawInfo.colorMain = PIXI.utils.rgb2hex(rgb);
    rgb = this.hsvToRgb(hue, volume, pitch * 0.7);
    this.drawInfo.colorSub = PIXI.utils.rgb2hex(rgb);
  }

  calcObjectCount() {
    const { pitch, volume } = this.soundData;
    const rate = (pitch + -1 * volume + 1) * 0.5;
    this.drawInfo.objectCount = Math.min(Math.floor(rate / 0.25) + 1, 4);
  }

  calcObjectShape() {
    const {sharpness} = this.soundData;
    if (sharpness < 0.1666667) {
      this.drawInfo.objectShape = 'TriangleWave';
    } else if (sharpness < 0.3333334) {
      this.drawInfo.objectShape = 'TriangleWave';
    } else if (sharpness < 0.5) {
      this.drawInfo.objectShape = 'TriangleWave';
    } else if (sharpness < 0.6666667) {
      this.drawInfo.objectShape = 'TriangleWave';
    } else if (sharpness < 0.8333334) {
      this.drawInfo.objectShape = 'TriangleWave';
    } else {
      this.drawInfo.objectShape = 'TriangleWave';
    }
  }

  hsvToRgb(h, s, v) {
    const hlimit = 360;
    const slimit = 1;
    const vlimit = 1;
    let i;
    let h_, s_, v_;
    let r, g, b;
    h_ = Math.abs(h % hlimit);
    s_ = Math.max(Math.min(s, slimit), 0) / slimit;
    v_ = Math.max(Math.min(v, vlimit), 0) / vlimit;

    if (s <= 0) {
      r = g = b = v_;
      return [r, g, b];
    }

    h_ /= 60.0;
    i = Math.floor(h_);
    const f = h_ - i;
    const p = v_ * (1 - s_);
    const q = v_ * (1 - s_ * f);
    const t = v_ * (1 - s_ * (1 - f));

    switch (i) {
      case 0:
        r = v_; g = t; b = p;
        break;
      case 1:
        r = q; g = v_; b = p;
        break;
      case 2:
        r = p; g = v_; b = t;
        break;
      case 3:
        r = p; g = q; b = v_;
        break;
      case 4:
        r = t; g = p; b = v_;
        break;
      default: // case 5:
        r = v_; g = p; b = q;
        break;
    }
    return [r, g, b];
  }
}
