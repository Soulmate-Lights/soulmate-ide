import { useEffect } from "react";

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }
  if (/android/i.test(userAgent)) {
    return "Android";
  }
  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }
  return "unknown";
}

const AppRedirect = () => {
  useEffect(() => {
    var os = getMobileOperatingSystem();
    switch (os) {
      case "Android":
        window.location = "google.com";
        break;
      case "iOS":
        window.location =
          "https://apps.apple.com/us/app/soulmate-lights/id1330064071";
        break;
      default:
        window.location = "/";
        break;
    }
  }, []);

  return <></>;
};

export default AppRedirect;
