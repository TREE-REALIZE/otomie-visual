import OtomieVisual from './OtomieVisual';

const otomieVisual = new OtomieVisual();
otomieVisual.setup(document.getElementById('app'), 1024, 1024);
otomieVisual.play();
setInterval(() => {
  otomieVisual.updateSoundData(otomieVisual.randomSoundData());
}, 2000);
