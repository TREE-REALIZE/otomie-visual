import OtomieVisual from './OtomieVisual';

const otomieVisual = new OtomieVisual();
otomieVisual.setup(document.body, 640, 640);
otomieVisual.play();
setInterval(() => {
  otomieVisual.updateSoundData(otomieVisual.randomSoundData());
}, 20);
