export const drawPixels = (pixels, canvas, rows, cols, serpentine) => {
  // if (!canvas.current) return;
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pixelWidth = canvas.width / cols;
  const pixelHeight = canvas.height / rows;

  for (let pixel of pixels) {
    let x;
    let y;

    if (!serpentine) {
      if (pixel.y % 2 === 1) {
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

export const calculateDimensions = (rows, cols) => {
  let width = cols * 20;
  let height = rows * 20;
  let ratio = width / height;

  if (width < 250 && height < 250) {
    height = 250;
    width = height * ratio;
  }

  if (height > 500) {
    height = 500;
    width = height * ratio;
  }

  if (width > window.innerWidth * 0.8) {
    width = Math.min(width, window.innerWidth * 0.8);
    height = width / ratio;
  }

  // height = parseInt(height / rows) * rows;
  // width = parseInt(width / cols) * cols;
  if (height < 20) height = 20;
  if (width < 20) width = 20;

  return { width, height };
};

// Hook
export const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
};
