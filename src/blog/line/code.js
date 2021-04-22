export default `// I use this for both Points and vectors
class Point {
  public:
    double x;
  double y;
  Point(double newx, double newy) {
    x = newx;
    y = newy;
  }
};

double minDistance(Point A, Point B, Point E) {
  Point AB(B.x - A.x, B.y - A.y);
  Point BE(E.x - B.x, E.y - B.y);
  Point AE(E.x - A.x, E.y - A.y);
  double AB_BE = (AB.x * BE.x + AB.y * BE.y);
  double AB_AE = (AB.x * AE.x + AB.y * AE.y);
  if (AB_BE > 0) {
    double y = E.y - B.y;
    double x = E.x - B.x;
    return sqrt(x * x + y * y);
  } else if (AB_AE < 0) {
    double y = E.y - A.y;
    double x = E.x - A.x;
    return sqrt(x * x + y * y);
  } else {
    double ABLength = sqrt(AB.x * AB.x + AB.y * AB.y);
    double productOfABAE = abs(AB.x * AE.y - AB.y * AE.x);
    return productOfABAE / ABLength;
  }
}

void drawLine(Point start, Point stop, double width, int hue) {
  int startX = min(start.x, stop.x) - width;
  int stopX = max(start.x, stop.x) + width;
  int startY = min(start.y, stop.y) - width;
  int stopY = max(start.y, stop.y) + width;

  for (int x = startX; x < stopX; x++) {
    for (int y = startY; y < stopY; y++) {
      double distance = minDistance(start, stop, Point(x, y));

      if (distance < width) {
        int brightness = 255 - distance / width * 255;
        uint16_t index = XY(x, y);
        leds[index] += CHSV(hue, 200, brightness);
      }
    }
  }
}

double lineWidth = 3;

void draw() {
  fadeToBlackBy(leds, N_LEDS, 32);
  int hue = beatsin16(10, 0, 30);
  Point start(
    beatsin16(10, 0, 8),
    beatsin16(11, 0, 8)
  );
  Point stop(
    beatsin16(12, ROWS - 8, ROWS),
    beatsin16(13, COLS - 8, COLS)
  );

  drawLine(start, stop, lineWidth, hue);
}`;
