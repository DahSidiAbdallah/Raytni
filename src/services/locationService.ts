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

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationWithDistance extends Coordinates {
  distance: number; // in kilometers
  [key: string]: any; // Allow additional properties
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

const DEFAULT_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};

/**
 * Checks if geolocation is available in the current browser
 * @returns boolean indicating if geolocation is available
 */
export function isGeolocationAvailable(): boolean {
  return 'geolocation' in navigator;
}

/**
 * Gets the user's current position
 * @param options Geolocation options
 * @returns Promise with the user's coordinates
 */
export function getCurrentPosition(options: GeolocationOptions = {}): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!isGeolocationAvailable()) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => {
        let errorMessage = 'Error getting location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'User denied the request for geolocation.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out.';
            break;
        }
        reject(new Error(errorMessage));
      },
      { ...DEFAULT_OPTIONS, ...options }
    );
  });
}

/**
 * Watches the user's position and calls the callback when it changes
 * @param onSuccess Callback for successful position updates
 * @param onError Callback for errors
 * @param options Geolocation options
 * @returns A watch ID that can be used to stop watching
 */
export function watchPosition(
  onSuccess: (coords: GeolocationCoordinates) => void,
  onError?: (error: Error) => void,
  options: GeolocationOptions = {}
): number {
  if (!isGeolocationAvailable()) {
    const error = new Error('Geolocation is not supported by this browser.');
    onError?.(error);
    throw error;
  }

  return navigator.geolocation.watchPosition(
    (position) => onSuccess(position.coords),
    (error) => {
      let errorMessage = 'Error watching location';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'User denied the request for geolocation.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'The request to get user location timed out.';
          break;
      }
      onError?.(new Error(errorMessage));
    },
    { ...DEFAULT_OPTIONS, ...options }
  );
}

/**
 * Stops watching the user's position
 * @param watchId The ID returned by watchPosition
 */
export function clearWatch(watchId: number): void {
  if (isGeolocationAvailable()) {
    navigator.geolocation.clearWatch(watchId);
  }
}

/**
 * Calculates the distance between two points on Earth using the Haversine formula
 * @param lat1 Latitude of the first point
 * @param lon1 Longitude of the first point
 * @param lat2 Latitude of the second point
 * @param lon2 Longitude of the second point
 * @returns Distance in kilometers, rounded to 1 decimal place
 */
export function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return parseFloat(distance.toFixed(1));
}

/**
 * Finds the nearest locations to the user's current position
 * @param locations Array of locations with latitude and longitude
 * @param userCoords User's current coordinates
 * @param limit Maximum number of results to return (default: 5)
 * @returns Array of locations with distance in kilometers, sorted by distance
 */
export function findNearestLocations<T extends Coordinates>(
  locations: T[], 
  userCoords: Coordinates, 
  limit: number = 5
): (T & { distance: number })[] {
  if (!locations?.length) return [];

  return locations
    .map(location => ({
      ...location,
      distance: getDistanceFromLatLonInKm(
        userCoords.latitude,
        userCoords.longitude,
        location.latitude,
        location.longitude
      )
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

/**
 * Opens Google Maps directions from the user's location to a destination
 * @param destLat Destination latitude
 * @param destLon Destination longitude
 * @param userLat Optional user latitude (if already known)
 * @param userLon Optional user longitude (if already known)
 */
export async function openDirections(
  destLat: number, 
  destLon: number, 
  userLat?: number, 
  userLon?: number
): Promise<void> {
  try {
    let origin = '';
    
    if (userLat !== undefined && userLon !== undefined) {
      origin = `${userLat},${userLon}`;
    } else {
      const coords = await getCurrentPosition();
      origin = `${coords.latitude},${coords.longitude}`;
    }
    
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destLat},${destLon}`,
      '_blank',
      'noopener,noreferrer'
    );
  } catch (error) {
    // Fallback to just showing the destination if we can't get directions
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${destLat},${destLon}`,
      '_blank',
      'noopener,noreferrer'
    );
  }
}

/**
 * Requests permission to access the user's location
 * @returns Promise that resolves to a boolean indicating if permission was granted
 */
export async function requestLocationPermission(): Promise<boolean> {
  if (!isGeolocationAvailable()) {
    return false;
  }

  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
    return permission.state === 'granted';
  } catch (error) {
    // If the browser doesn't support the Permissions API, try to get the position
    try {
      await getCurrentPosition();
      return true;
    } catch (e) {
      return false;
    }
  }
}