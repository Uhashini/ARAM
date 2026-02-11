const axios = require('axios');

/**
 * Haversine formula to calculate distance between two GPS coordinates
 * Returns distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
};

/**
 * Find nearest police station using OpenStreetMap Overpass API
 * @param {number} latitude - Incident latitude
 * @param {number} longitude - Incident longitude
 * @param {number} radiusKm - Search radius in kilometers (default 25km)
 * @returns {Promise<Object>} Nearest police station data
 */
const findNearestPoliceStation = async (latitude, longitude, radiusKm = 25) => {
    try {
        // Overpass API query for police stations within radius
        // amenity=police tag includes police stations, police posts, etc.
        const overpassQuery = `
            [out:json][timeout:25];
            (
                node["amenity"="police"](around:${radiusKm * 1000},${latitude},${longitude});
                way["amenity"="police"](around:${radiusKm * 1000},${latitude},${longitude});
                relation["amenity"="police"](around:${radiusKm * 1000},${latitude},${longitude});
            );
            out center;
        `;

        const response = await axios.post(
            'https://overpass-api.de/api/interpreter',
            overpassQuery,
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 15000
            }
        );

        const elements = response.data.elements;

        if (!elements || elements.length === 0) {
            // Fallback to generic station if none found nearby
            return {
                name: 'Women Safety Cell / Cyber Crime Division',
                address: 'District Police Headquarters',
                distance: null,
                coordinates: { lat: latitude, lng: longitude },
                source: 'fallback'
            };
        }

        // Calculate distance to each station and find nearest
        let nearestStation = null;
        let minDistance = Infinity;

        elements.forEach(element => {
            const stationLat = element.lat || element.center?.lat;
            const stationLon = element.lon || element.center?.lon;

            if (stationLat && stationLon) {
                const distance = calculateDistance(latitude, longitude, stationLat, stationLon);

                if (distance < minDistance) {
                    minDistance = distance;
                    nearestStation = {
                        name: element.tags?.name || element.tags?.['official_name'] || 'Local Police Station',
                        address: element.tags?.['addr:full'] ||
                            element.tags?.['addr:street'] ||
                            element.tags?.['addr:city'] ||
                            'Address not available',
                        distance: distance.toFixed(2), // km with 2 decimal places
                        coordinates: {
                            lat: stationLat,
                            lng: stationLon
                        },
                        phone: element.tags?.phone || element.tags?.['contact:phone'] || null,
                        osmId: element.id,
                        source: 'osm'
                    };
                }
            }
        });

        return nearestStation || {
            name: 'Women Safety Cell / Cyber Crime Division',
            address: 'District Police Headquarters',
            distance: null,
            coordinates: { lat: latitude, lng: longitude },
            source: 'fallback'
        };

    } catch (error) {
        console.error('Error fetching police station from Overpass API:', error.message);

        // Return fallback station on error
        return {
            name: 'Women Safety Cell / Cyber Crime Division',
            address: 'District Police Headquarters',
            distance: null,
            coordinates: { lat: latitude, lng: longitude },
            source: 'error_fallback',
            error: error.message
        };
    }
};

module.exports = { findNearestPoliceStation, calculateDistance };
