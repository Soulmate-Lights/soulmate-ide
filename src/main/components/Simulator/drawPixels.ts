import Pixel from './pixel';

export const drawPixels = (
  pixels: Array<Pixel>,
  canvas: HTMLCanvasElement,
  rows: number,
  cols: number,
  serpentine: boolean
) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  ctx?.clearRect(0, 0, canvas.width, canvas.height);

  const pixelWidth = canvas.width / cols;
  const pixelHeight = canvas.height / rows;

  for (const pixel of pixels) {
    let x;
    let y;

    if (!serpentine) {
      if (pixel.y % 2 == 0) {
        x = pixel.x * pixelWidth;
      } else {
        x = (cols - 1) * pixelWidth - pixel.x * pixelWidth;
      }
      y = (rows - 1) * pixelHeight - pixel.y * pixelHeight;
    } else {
      x = (cols - 1) * pixelWidth - pixel.x * pixelWidth;
      y = (rows - 1) * pixelHeight - pixel.y * pixelHeight;
    }

    ctx.beginPath();
    ctx.rect(x, y, pixelWidth, pixelHeight);
    ctx.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
    ctx.shadowColor = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
    ctx.fill();
  }
};
