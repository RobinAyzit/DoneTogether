export interface GeocodingResult {
    lat: string;
    lon: string;
    display_name: string;
    name?: string;
    address?: {
        road?: string;
        house_number?: string;
        city?: string;
        town?: string;
        village?: string;
        postcode?: string;
        country?: string;
    };
}

let googleMapsLoaded = false;
let googleMapsLoadingPromise: Promise<void> | null = null;

async function loadGoogleMaps(): Promise<void> {
    if (googleMapsLoaded) return;
    if (googleMapsLoadingPromise) return googleMapsLoadingPromise;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        console.error("Google Maps API Key is missing!");
        return;
    }

    googleMapsLoadingPromise = new Promise((resolve, reject) => {
        if ((window as any).google && (window as any).google.maps) {
            googleMapsLoaded = true;
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            googleMapsLoaded = true;
            resolve();
        };
        script.onerror = (err) => {
            console.error("Failed to load Google Maps API", err);
            reject(err);
        };
        document.head.appendChild(script);
    });

    return googleMapsLoadingPromise;
}

export async function searchAddress(query: string): Promise<GeocodingResult[]> {
    if (!query || query.length < 3) return [];

    try {
        await loadGoogleMaps();

        if (!(window as any).google || !(window as any).google.maps || !(window as any).google.maps.places) return [];

        // Use PlacesService instead of Geocoder for better POI results (malls, buildings, etc)
        const dummyDiv = document.createElement('div');
        const service = new (window as any).google.maps.places.PlacesService(dummyDiv);

        return new Promise((resolve) => {
            service.textSearch({ query: query }, (results: any[], status: string) => {
                if (status === 'OK' && results) {
                    const mappedResults = results.map(result => {
                        return {
                            lat: result.geometry.location.lat().toString(),
                            lon: result.geometry.location.lng().toString(),
                            display_name: result.formatted_address,
                            name: result.name, // The actual name of the place (e.g. "Kista Galleria")
                            address: {
                                // For textSearch, we don't get granular address components easily
                                // unless we call getDetails, but formatted_address is usually enough.
                                road: '',
                                house_number: '',
                                city: '',
                                town: '',
                                postcode: '',
                                country: ''
                            }
                        };
                    });
                    resolve(mappedResults);
                } else {
                    console.log('Places search failed or no results:', status);
                    resolve([]);
                }
            });
        });
    } catch (error) {
        console.error('Error searching address with Google Places:', error);
        return [];
    }
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
        await loadGoogleMaps();
        if (!(window as any).google) return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;

        const geocoder = new (window as any).google.maps.Geocoder();

        return new Promise((resolve) => {
            geocoder.geocode({ location: { lat, lng: lon } }, (results: any[], status: string) => {
                if (status === 'OK' && results && results[0]) {
                    resolve(results[0].formatted_address);
                } else {
                    resolve(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
                }
            });
        });
    } catch (error) {
        console.error('Error reverse geocoding with Google Maps:', error);
        return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
}
