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
  // Here, we'll need the "cross product" of two vectors (the determinant)
  // This gives us the area of the vector we need. And we know one of the lengths (AB)
  // so we can find the other length by dividing by that length.
  else {
    // Magnitude (modulus) of AB (the line's length)
    double modulus = sqrt(AB.x * AB.x + AB.y * AB.y);
    // Let's calculate the determinant of ABAE 2d matrix
    // We have two distance involved - AB, and the distance between the line and E
    // We know the length of AB, but we don't know the line-to-E length
    // However, we can multiple A-B by A-E and then divide by the length of A-B

    // This is the length of both lines multiplied together, or in other words
    // the product of the two vectors ABAE
    // Important: the determinant the area of the parallelogram described by our
    // new, combined ABAE matrix.
    double determinant = abs(AB.x * AE.y - AB.y * AE.x);
    // The area of a parallelogram is the length of its sides! And we know the
    // length of AB (the modulus)
    // All we need is the second line, so we divide the total by the first line
    // Perpendicular distance: the determinant, divided by the length of AB
    return determinant / modulus;
  }
}

void drawLine(Point start, Point stop, double width, int hue) {
  // Calculate the bounds of the line
  // so we don't have to iterate over all pixels
  int startX = min(start.x, stop.x) - width;
  int stopX = max(start.x, stop.x) + width;
  int startY = min(start.y, stop.y) - width;
  int stopY = max(start.y, stop.y) + width;

  double modulus = sqrt(startX * startX + startY * startY);

  for (int x = startX; x < stopX; x++) {
    for (int y = startY; y < stopY; y++) {
      double distance = minDistance(start, stop, Point(x, y));

      int brightness = 0;
      if (distance < width) {
        brightness = 255 - distance / width * 255;
        int index = XY(x, y);
        leds[index] = CHSV(hue, 128, brightness);
      }
    }
  }
}

void draw() {
  drawLine(Point(0, 0), Point(LED_COLS, LED_ROWS), 1, 0);
}`;
