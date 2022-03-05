import * as PIXI from 'pixi.js';
import { Maru } from './Maru';
import { GizaGiza } from './GizaGiza';
import { Nami } from './Nami';
import { Sankaku } from './Sankaku';
import { Shikaku } from './Shikaku';
import { Hoshi } from './Hoshi';
import { DrawInfo } from './type';

PIXI.utils.skipHello();

export default class OtomieVisual {
  app: PIXI.Application;
  gizaGiza: GizaGiza;
  maru: Maru;
  nami: Nami;
  sankaku: Sankaku;
  shikaku: Shikaku;
  hoshi: Hoshi;
  elapsedMS = 0.0;
  soundData = {
    hue: 0,
    saturation: 0,
    brightness: 0,
    objectCount: 0.,
    objectShape: 0,
    speed: 0
  };
  drawInfo: DrawInfo = {
    colorMain: 0xdcf567,
    colorMainRgb: [220.0 / 255, 245.0 / 255, 103.0 / 255],
    colorSub: 0x566550,
    colorSubRgb: [86.0 / 255, 101.0 / 255, 80.0 / 255],
    objectCount: 1,
    objectShape: 'None',
    speed: 0.5,
  };
  updateFn: () => void = null;

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
    this.nami = new Nami();
    this.nami.setup(app, this.drawInfo);
    this.sankaku = new Sankaku();
    this.sankaku.setup(app, this.drawInfo);
    this.shikaku = new Shikaku();
    this.shikaku.setup(app, this.drawInfo);
    this.hoshi = new Hoshi();
    this.hoshi.setup(app, this.drawInfo);
    this.app.ticker.add(this.draw.bind(this));
    this.app.ticker.stop();
  }

  draw() {
    this.elapsedMS += this.app.ticker.deltaMS;
    if (this.updateFn) {
      this.updateFn();
      this.updateFn = null;
    }
    this.gizaGiza.draw();
    this.maru.draw();
    this.nami.draw();
    this.sankaku.draw();
    this.shikaku.draw();
    this.hoshi.draw();
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

  updateDrawInfo() {
    switch (this.drawInfo.objectShape) {
      case 'GizaGiza':
        this.gizaGiza.update(this.drawInfo);
        break;
      case 'Maru':
        this.maru.update(this.drawInfo);
        break;
      case 'Nami':
        this.nami.update(this.drawInfo);
        break;
      case 'Sankaku':
        this.sankaku.update(this.drawInfo);
        break;
      case 'Shikaku':
        this.shikaku.update(this.drawInfo);
        break;
      case 'Hoshi':
        this.hoshi.update(this.drawInfo);
        break;
      default:
        break;
    }
  }

  updateSoundData(soundData: OtomieVisual['soundData']) {
    this.soundData = soundData;
    this.calcHsv();
    this.calcObjectCount();
    this.calcObjectShape();
    this.calcSpeed();
    this.updateFn = this.updateDrawInfo;
  }

  randomSoundData(): OtomieVisual['soundData'] {
    return {
      hue: Math.abs(Math.cos((this.elapsedMS / 1000) * 0.2)),
      saturation: Math.abs(Math.sin((this.elapsedMS / 1000) * 1 + 1)),
      brightness: Math.abs(Math.sin((this.elapsedMS / 1000) * 0.1)),
      objectCount: Math.abs(Math.sin((this.elapsedMS / 1000) * 0.3)),
      objectShape: Math.abs(Math.sin((this.elapsedMS / 1000) * 0.4)),
      speed: Math.abs(Math.sin((this.elapsedMS / 1000) * 0.5)),
    };
  }

  calcHsv() {
    const { hue, saturation, brightness } = this.soundData;
    this.drawInfo.colorMainRgb = this.hsvToRgb(hue * 360, saturation, brightness);
    this.drawInfo.colorMain = PIXI.utils.rgb2hex(this.drawInfo.colorMainRgb);
    this.drawInfo.colorSubRgb = this.hsvToRgb(hue * 360, saturation, brightness * 0.7);
    this.drawInfo.colorSub = PIXI.utils.rgb2hex(this.drawInfo.colorSubRgb);
  }

  calcObjectCount() {
    const { objectCount } = this.soundData;
    this.drawInfo.objectCount = Math.min(Math.floor(objectCount / 0.25) + 1, 4);
  }

  calcObjectShape() {
    const { objectShape } = this.soundData;
    // const objectShape = Math.abs(Math.sin((this.elapsedMS / 1000) * 0.4));
    // this.drawInfo.objectShape = 'Nami';
    // return;
    if (objectShape < 0.1666667) {
      this.drawInfo.objectShape = 'Nami';
    } else if (objectShape < 0.3333334) {
      this.drawInfo.objectShape = 'Maru';
    } else if (objectShape < 0.5) {
      this.drawInfo.objectShape = 'Sankaku';
    } else if (objectShape < 0.6666667) {
      this.drawInfo.objectShape = 'Shikaku';
    } else if (objectShape < 0.8333334) {
      this.drawInfo.objectShape = 'Hoshi';
    } else {
      this.drawInfo.objectShape = 'GizaGiza';
    }
  }

  calcSpeed() {
    const { speed } = this.soundData;
    this.drawInfo.speed = speed;
  }

  takeScreenShot(soundData: OtomieVisual['soundData']) {
    const started = this.app.ticker.started;
    this.app.ticker.stop();
    this.updateSoundData(soundData);
    this.draw();
    this.app.render();
    const image = this.app.view.toDataURL();
    if (started) {
      this.app.ticker.start();
    }
    return image;
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
