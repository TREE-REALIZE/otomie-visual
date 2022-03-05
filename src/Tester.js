import OtomieVisual from './OtomieVisual';

const otomieVisual = new OtomieVisual();
otomieVisual.setup(document.getElementById('app'), 1024, 1024);
otomieVisual.play();
setInterval(() => {
  otomieVisual.updateSoundData(otomieVisual.randomSoundData());
}, 20);

// setTimeout(() => {
//   const image = otomieVisual.takeScreenShot(otomieVisual.randomSoundData())
//   const img = new Image();
//   img.src = image;
//   document.body.appendChild(img);
// }, 5000)
