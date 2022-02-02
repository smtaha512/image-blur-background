// Import stylesheets
import './style.css';
import {
  CanvasLayer,
  MultiLayeredCanvas,
  Renderer,
} from './multi-layered-canvas';

const multiLayeredCanvasElement = document.getElementById(
  'layered-canvas'
) as HTMLCanvasElement;
let multiLayeredCanvas = new MultiLayeredCanvas(multiLayeredCanvasElement);
multiLayeredCanvasElement.height = 800;
multiLayeredCanvasElement.width = 800;

console.log({ multiLayeredCanvasElement });

const input = document.getElementById('image') as HTMLImageElement;
const blurSpread = document.getElementById('blur-spread') as HTMLInputElement;

const image = new Image();
const reader = new FileReader();

image.addEventListener('load', onImageLoad);
reader.addEventListener('load', onReaderLoad);
input.addEventListener('change', onInputChange);
blurSpread.addEventListener('change', onBlurChange);

function onBlurChange(this: HTMLInputElement) {
  const { value } = this;
  const canvasLayer = new CanvasLayer('background', blurBgRenderer(+value));
  console.time();

  multiLayeredCanvas.updateLayer('background', canvasLayer).render();
  console.timeEnd();
  console.log(multiLayeredCanvas);
}

function onImageLoad(this: HTMLImageElement): void {
  const backgroundLayer = new CanvasLayer(
    'background',
    blurBgRenderer(+blurSpread.value)
  );
  const foregroundLayer = new CanvasLayer('foreground', foregroundRenderer);
  // const foregrounds = [...new Array(50000)].map(
  //   (_, i) => new CanvasLayer('foreground-' + i, foregroundRenderer)
  // );
  multiLayeredCanvas = new MultiLayeredCanvas('#layered-canvas');
  console.time();
  multiLayeredCanvas.push(backgroundLayer, foregroundLayer).render();

  console.timeEnd();
  return undefined;

  // crop(preview);
}

function blurBgRenderer(blurSpread: number): Renderer {
  return function (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ): void {
    ctx.filter = `blur(${blurSpread}px)`;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  };
}

function foregroundRenderer(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): void {
  const imageProperties = getImageProperties(image, canvas);
  const { left, scaledHeight, scaledWidth, top } = imageProperties;

  ctx.filter = `blur(0)`;
  ctx.drawImage(image, left, top, scaledWidth, scaledHeight);
}
// function processImage(image: HTMLImageElement, blurSpread = 8) {
//   var randomStringifiedNumberForImageName = Math.floor(
//     Math.random() * 100
//   ).toString();

//   allowCanvasToBeSavedAsImage(preview, randomStringifiedNumberForImageName);
// }

interface ImageProperties {
  scaledWidth: number;
  scaledHeight: number;
  left: number;
  top: number;
}

function getImageProperties(
  currentImage: HTMLImageElement,
  canvas: Pick<HTMLCanvasElement, 'width' | 'height'>
): ImageProperties {
  var imageWidth = currentImage.width;
  var imageHeight = currentImage.height;

  var scale = Math.min(canvas.width / imageWidth, canvas.height / imageHeight);
  var scaledWidth = imageWidth * scale;
  var scaledHeight = imageHeight * scale;
  var left = canvas.width / 2 - scaledWidth / 2;
  var top = canvas.height / 2 - scaledHeight / 2;

  return { scaledWidth, scaledHeight, left, top };
}

function onReaderLoad(
  this: FileReader,
  readerEvent: ProgressEvent<FileReader>
): void {
  image.src = readerEvent.target.result.toString();
  return undefined;
}

function onInputChange(event: InputEvent) {
  const [file] = (event.target as HTMLInputElement)?.files ?? [];
  if (!file) return;
  reader.readAsDataURL(file);
  return undefined;
}

function allowCanvasToBeSavedAsImage(
  canvasToDownload: HTMLCanvasElement,
  fileName: string
): void {
  const button = document.querySelector<HTMLButtonElement>('#download');
  button.disabled = false;
  button.addEventListener(
    'click',
    handleButtonClick(canvasToDownload, fileName)
  );
  return undefined;
}

function handleButtonClick(
  canvasElementToDownload: HTMLCanvasElement,
  fileName: string
) {
  return function downloadImage(this: HTMLButtonElement) {
    const dataURL = canvasElementToDownload.toDataURL();
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.addEventListener('load', onXHRLoad(fileName));
    xhr.open('GET', dataURL); // This is to download the canvas Image
    xhr.send();
    return undefined;
  };
}

function onXHRLoad(fileName: string) {
  return function listener(this: XMLHttpRequest) {
    let a = document.createElement('a');
    a.href = window.URL.createObjectURL(this.response);
    a.download = 'bg-box-blurred ' + fileName;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    return undefined;
  };
}

// function crop(canvasElement: HTMLCanvasElement) {
//   console.log(canvasElement.height, canvasElement.width);
//   // for (let y = 0; y < canvasElement.height; ++y) {
//   // for (let x = 0; x < canvasElement.width / 2; x++) {
//   const pixel = ctx.getImageData(1, 1, 1, 1);
//   const data = pixel.data;
//   //   const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
//   console.log(/* rgba, */ '1st half');
//   console.count('rgba,');
//   // }
//   // for (let x = canvasElement.width; x > canvasElement.width / 2; x++) {
//   //   const pixel = ctx.getImageData(x, y, 1, 1);
//   //   const data = pixel.data;
//   //   const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
//   //   console.log(rgba, '2nd half');
//   // }
//   // }
// }
