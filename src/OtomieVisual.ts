import * as PIXI from 'pixi.js';
import { Maru } from './Maru';
import { GizaGiza } from './GizaGiza';
import { DrawInfo } from './type';

PIXI.utils.skipHello();

export class OtomieVisual {
  app: PIXI.Application;
  gizaGiza: GizaGiza;
  maru: Maru;
  elapsedMS = 0.0;
  soundData = {
    volume: 0.0,
    pitch: 0.0,
    sharpness: 0.0,
    roughness: 0.0,
  };
  drawInfo: DrawInfo = {
    colorMain: 0xdcf567,
    colorSub: 0x566550,
    objectCount: 1,
    objectShape: 'GizaGiza',
    speed: 0.5,
  };

  setup(container: HTMLDivElement, width: number, height: number) {
    const app = new PIXI.Application({
      width,
      height,
      resolution: devicePixelRatio,
      backgroundColor: 0xd7d7d7,
    });
    this.app = app;
    container.appendChild(app.view);
    this.gizaGiza = new GizaGiza();
    this.gizaGiza.setup(app, this.drawInfo);
    this.maru = new Maru();
    this.maru.setup(app, this.drawInfo);
    this.app.ticker.add(this.draw.bind(this));
    this.app.ticker.stop();
  }

  draw() {
    this.elapsedMS += this.app.ticker.deltaMS;
    this.gizaGiza.draw();
    this.maru.draw();
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

  updateSoundData(soundData: OtomieVisual['soundData']) {
    this.soundData = soundData;
    this.calcHsv();
    this.calcObjectCount();
    this.calcObjectShape();
    this.calcSpeed();
    this.gizaGiza.update(this.drawInfo);
    this.maru.update(this.drawInfo);
  }

  randomSoundData() {
    return {
      volume: Math.abs(Math.cos((this.elapsedMS / 1000) * 0.2)),
      pitch: Math.abs(Math.sin((this.elapsedMS / 1000) * 1 + 1)),
      sharpness: Math.abs(Math.sin((this.elapsedMS / 1000) * 0.1)),
      roughness: Math.abs(Math.sin((this.elapsedMS / 1000) * 1)),
    };
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
    const { sharpness } = this.soundData;
    // this.drawInfo.objectShape = 'Maru';
    // return;
    if (sharpness < 0.1666667) {
      this.drawInfo.objectShape = 'GizaGiza';
    } else if (sharpness < 0.3333334) {
      this.drawInfo.objectShape = 'Maru';
    } else if (sharpness < 0.5) {
      this.drawInfo.objectShape = 'GizaGiza';
    } else if (sharpness < 0.6666667) {
      this.drawInfo.objectShape = 'Maru';
    } else if (sharpness < 0.8333334) {
      this.drawInfo.objectShape = 'GizaGiza';
    } else {
      this.drawInfo.objectShape = 'Maru';
    }
  }

  calcSpeed() {
    const { pitch } = this.soundData;
    this.drawInfo.speed = pitch;
  }

  hsvToRgb(h: number, s: number, v: number) {
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
        r = v_;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v_;
        b = p;
        break;
      case 2:
        r = p;
        g = v_;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v_;
        break;
      case 4:
        r = t;
        g = p;
        b = v_;
        break;
      default:
        // case 5:
        r = v_;
        g = p;
        b = q;
        break;
    }
    return [r, g, b];
  }
}
