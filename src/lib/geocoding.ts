export interface GeocodingResult {
    lat: string;
    lon: string;
    display_name: string;
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
        
        if (!(window as any).google) return [];

        const geocoder = new (window as any).google.maps.Geocoder();
        
        return new Promise((resolve) => {
            geocoder.geocode({ address: query }, (results: any[], status: string) => {
                if (status === 'OK' && results) {
                    const mappedResults = results.map(result => {
                        const addressComponents = result.address_components;
                        
                        const getComponent = (type: string) => {
                            const comp = addressComponents.find((c: any) => c.types.includes(type));
                            return comp ? comp.long_name : undefined;
                        };

                        const street = getComponent('route');
                        const number = getComponent('street_number');
                        const city = getComponent('locality') || getComponent('postal_town');
                        const town = getComponent('administrative_area_level_2');
                        const country = getComponent('country');
                        const postcode = getComponent('postal_code');

                        return {
                            lat: result.geometry.location.lat().toString(),
                            lon: result.geometry.location.lng().toString(),
                            display_name: result.formatted_address,
                            address: {
                                road: street,
                                house_number: number,
                                city: city,
                                town: town,
                                postcode: postcode,
                                country: country
                            }
                        };
                    });
                    resolve(mappedResults);
                } else {
                    console.log('Geocoding failed or no results:', status);
                    resolve([]);
                }
            });
        });
    } catch (error) {
        console.error('Error searching address with Google Maps:', error);
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
