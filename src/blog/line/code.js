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

// Function to return the minimum distance
// between a line segment AB and a point E
double minDistance(Point A, Point B, Point E) {
  // vector AB
  Point AB(B.x - A.x, B.y - A.y);
  // vector BE
  Point BE(E.x - B.x, E.y - B.y);
  // vector AE
  Point AE(E.x - A.x, E.y - A.y);

  // Calculating the dot product
  double AB_BE = (AB.x * BE.x + AB.y * BE.y);
  double AB_AE = (AB.x * AE.x + AB.y * AE.y);

  // There are three cases for the minimum distance from point E to the line segment

  // Case 1 - off the far end - positive dot product
  if (AB_BE > 0) {
    double y = E.y - B.y;
    double x = E.x - B.x;
    return sqrt(x * x + y * y);
  }

  // Case 2 - off the near end - negative dot product
  else if (AB_AE < 0) {
    double y = E.y - A.y;
    double x = E.x - A.x;
    return sqrt(x * x + y * y);
  }

  // Case 3 - somewhere in the middle
  else {
    double ABLength = sqrt(AB.x * AB.x + AB.y * AB.y);
    double productOfABAE = abs(AB.x * AE.y - AB.y * AE.x);
    return productOfABAE / ABLength;
  }
}

void drawLine(Point start, Point stop, double width, int hue) {
  // Calculate the bounds of the line
  // so we don't have to iterate over all pixels
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

int lines = 2;
double lineWidth = 3;

void draw() {
  fadeToBlackBy(leds, N_LEDS, 32);
  for (int i = 0; i < lines; i++) {
    int offset = i * 3000;
    int hue = i * 90 + beatsin16(10, 0, 30);
    Point start(
      beatsin16(10 + i, 0, COLS, offset), // x
      beatsin16(11 + i, 0, ROWS, offset) // y
    );
    Point stop(
      beatsin16(12 + i, 0, ROWS, offset), // x
      beatsin16(13 + i, ROWS / 2, COLS, offset) // y
    );

    drawLine(start, stop, lineWidth, hue);
  }
}`;
