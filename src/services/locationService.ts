/**
 * Calculates the distance between two points on Earth using the Haversine formula
 * @param lat1 Latitude of the first point
 * @param lon1 Longitude of the first point
 * @param lat2 Latitude of the second point
 * @param lon2 Longitude of the second point
 * @returns Distance in kilometers
 */
export function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return parseFloat(distance.toFixed(1)); // Round to 1 decimal place
}

/**
 * Converts degrees to radians
 * @param deg Degrees
 * @returns Radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Gets the user's current location
 * @returns Promise that resolves to the user's coordinates
 */
export function getCurrentPosition(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position.coords);
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

/**
 * Opens Google Maps directions from the user's location to a destination
 * @param destLat Destination latitude
 * @param destLon Destination longitude
 * @param userLat Optional user latitude (if already known)
 * @param userLon Optional user longitude (if already known)
 */
export function openDirections(destLat: number, destLon: number, userLat?: number, userLon?: number): void {
  if (userLat !== undefined && userLon !== undefined) {
    // If we already have the user's location, open directions immediately
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLon}&destination=${destLat},${destLon}`, '_blank');
  } else {
    // Otherwise, try to get the user's location first
    getCurrentPosition()
      .then((coords) => {
        window.open(`https://www.google.com/maps/dir/?api=1&origin=${coords.latitude},${coords.longitude}&destination=${destLat},${destLon}`, '_blank');
      })
      .catch(() => {
        // If we can't get the user's location, just open the destination
        window.open(`https://www.google.com/maps/search/?api=1&query=${destLat},${destLon}`, '_blank');
      });
  }
}