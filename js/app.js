let currentCoords = [61.032637, 4.707087]; // Somewhere in Amsterdam, this is updated.
// let targetCoords = [52.081587, 4.319679]; // Somewhere in the Hague, KABK.
// let targetCoords = [51.0499992, 3.71667]; // Somewhere in Gent, Belgium.
// let targetCoords = [37.566536, 126.977966]; // Somewhere in Seoul, South Korea
let targetCoords = [-26.204103, 28.047304]; // Somewhere in Johannesburg, South Africa
let bearingDeg = 0;

// -=-=-=-= Calculating the heading of the compass needle -=-=-=-=-=-=-=-=-=-=

// Converts from degrees to radians.
function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

// Converts from radians to degrees.
function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}

function bearing(startLat, startLng, destLat, destLng) {
  startLat = toRadians(startLat);
  startLng = toRadians(startLng);
  destLat = toRadians(destLat);
  destLng = toRadians(destLng);

  y = Math.sin(destLng - startLng) * Math.cos(destLat);
  x =
    Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  brng = Math.atan2(y, x);
  brng = toDegrees(brng);
  return (brng + 360) % 360;
}

navigator.geolocation.watchPosition(data => {
  currentCoords[0] = data.coords.latitude;
  currentCoords[1] = data.coords.longitude;
  bearingDeg = bearing(
    currentCoords[0],
    currentCoords[1],
    targetCoords[0],
    targetCoords[1]
  );

  target.style.webkitTransform = 'rotateZ(' + bearingDeg + 'deg)';
  document.querySelector(
    '#currentPosition'
  ).innerHTML = ` (Lat: ${data.coords.latitude}, Long: ${data.coords.longitude})`;
});

if (window.DeviceOrientationEvent) {
  // Listen for the deviceorientation event and handle the raw data
  window.addEventListener('deviceorientation', function(eventData) {
    let compassdir;

    if (eventData.webkitCompassHeading) {
      // Apple works only with this, alpha doesn't work
      compassdir = eventData.webkitCompassHeading;
      document.querySelector('#rose').style.webkitTransform =
        'rotateZ(' + (360 - compassdir) + 'deg)';
      document.querySelector('#headingDegrees').innerHTML = compassdir;
    } else compassdir = eventData.alpha; //TODO: Check if this works on Android
    document.querySelector('#rose').style.webkitTransform =
      'rotateZ(' + (360 - compassdir) + 'deg)';
    document.querySelector('#headingDegrees').innerHTML = compassdir;
  });
}
