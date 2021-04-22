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

  // Variables to store dot product
  double AB_BE, AB_AE;

  // Calculating the dot product
  AB_BE = (AB.x * BE.x + AB.y * BE.y);
  AB_AE = (AB.x * AE.x + AB.y * AE.y);

  // There are three cases for the minimum distance from point E to the line segment

  // Case 1 - off one end
  // Positive dot product (constructive)
  if (AB_BE > 0) {
    double y = E.y - B.y;
    double x = E.x - B.x;
    return sqrt(x * x + y * y);
  }

  // Case 2 - off the other end
  // Negative dot product (destructive)
  else if (AB_AE < 0) {
    double y = E.y - A.y;
    double x = E.x - A.x;
    return sqrt(x * x + y * y);
  }

  // Case 3 - somewhere in the middle
  else {
    // Finding the perpendicular distance
    double x1 = AB.x;
    double y1 = AB.y;
    double x2 = AE.x;
    double y2 = AE.y;
    double mod = sqrt(x1 * x1 + y1 * y1);
    return abs(x1 * y2 - y1 * x2) / mod;
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

      int brightness = 0;
      if (distance < width) {
        brightness = 255 - distance / width * 255;
        int index = XY(x, y);
        leds[index] += CHSV(hue, 128, brightness);
      }
    }
  }
}

double lineWidth = 2;
int hue = 0;
int maxWiggle = 8;
int minWiggle = 0;
void draw() {
  fadeToBlackBy(leds, N_LEDS, 64);
  Point pointA = Point(
    beatsin16(10, minWiggle, maxWiggle, 100),
    beatsin16(11, minWiggle, maxWiggle, 200)
  );
  Point pointB = Point(
    beatsin16(12, minWiggle, maxWiggle, 300),
    beatsin16(13, ROWS - 1 - maxWiggle, ROWS - 1 - minWiggle, 400)
  );
  Point pointC = Point(
    beatsin16(14, COLS - 1 - maxWiggle, COLS - 1 - minWiggle, 500),
    beatsin16(15, ROWS - 1 - maxWiggle, ROWS - 1 - minWiggle, 600)
  );
  Point pointD = Point(
    beatsin16(16, COLS - 1 - maxWiggle, COLS - 1 - minWiggle, 700),
    beatsin16(17, minWiggle, maxWiggle, 800)
  );
  drawLine(pointA, pointB, lineWidth, hue);
  drawLine(pointB, pointC, lineWidth, hue + 60);
  drawLine(pointC, pointD, lineWidth, hue + 120);
  drawLine(pointD, pointA, lineWidth, hue + 180);
}`;
