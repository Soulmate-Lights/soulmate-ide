export default `double minDistance(Point A, Point B, Point E) {
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
}`;
