// src/utils/passPredictionUtils.js
import * as satellite from 'satellite.js';

// Calculate pass predictions for a satellite
export const calculatePassPredictions = (satrec, observerLocation, daysAhead = 3) => {
    if (!satrec) return [];

    const passes = [];
    const now = new Date();
    const endDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    let currentTime = new Date(now.getTime());

    while (currentTime < endDate) {
        // Find next visible pass (simplified implementation)
        const pass = findNextPass(satrec, observerLocation, currentTime);

        if (pass && pass.endTime < endDate) {
            passes.push(pass);
            currentTime = new Date(pass.endTime.getTime() + 60000); // Start searching after this pass
        } else {
            break; // No more passes found
        }
    }

    return passes;
};

// Simplified pass finding function
const findNextPass = (satrec, observerLocation, startTime) => {
    // This is a simplified implementation
    // A real implementation would use more complex algorithms

    const step = 60 * 1000; // 1 minute steps
    let currentTime = new Date(startTime.getTime());
    let passStart = null;
    let maxElevation = 0;
    let direction = '';

    // Look for the next visible pass
    while (currentTime.getTime() < startTime.getTime() + 24 * 60 * 60 * 1000) {
        const position = calculatePositionAtTime(satrec, currentTime);
        if (!position) {
            currentTime = new Date(currentTime.getTime() + step);
            continue;
        }

        const elevation = calculateElevation(position, observerLocation);

        if (elevation > 5) { // Visible when above 5 degrees
            if (!passStart) {
                passStart = new Date(currentTime.getTime());
                direction = calculateDirection(position, observerLocation);
            }

            maxElevation = Math.max(maxElevation, elevation);
        } else if (passStart) {
            // Pass ended
            const duration = (currentTime.getTime() - passStart.getTime()) / 60000; // minutes

            return {
                startTime: passStart,
                endTime: new Date(currentTime.getTime()),
                maxElevation: Math.round(maxElevation),
                duration: Math.round(duration),
                direction: direction
            };
        }

        currentTime = new Date(currentTime.getTime() + step);
    }

    return null;
};

// Calculate position at a specific time
const calculatePositionAtTime = (satrec, date) => {
    try {
        const positionAndVelocity = satellite.propagate(satrec, date);
        if (!positionAndVelocity.position) return null;

        const gmst = satellite.gstime(date);
        const positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

        return {
            latitude: satellite.degreesLat(positionGd.latitude),
            longitude: satellite.degreesLong(positionGd.longitude),
            altitude: positionGd.height
        };
    } catch (error) {
        console.error('Error calculating position:', error);
        return null;
    }
};

// Calculate elevation of satellite from observer
const calculateElevation = (satPosition, observerLocation) => {
    // Simplified elevation calculation
    // A real implementation would use more precise formulas

    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const toDegrees = (radians) => radians * (180 / Math.PI);

    const φ1 = toRadians(observerLocation.lat);
    const λ1 = toRadians(observerLocation.lng);
    const φ2 = toRadians(satPosition.latitude);
    const λ2 = toRadians(satPosition.longitude);

    const Δφ = φ2 - φ1;
    const Δλ = λ2 - λ1;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Earth's radius in km
    const R = 6371;
    const straightDistance = Math.sqrt(R * R + (R + satPosition.altitude) * (R + satPosition.altitude) -
        2 * R * (R + satPosition.altitude) * Math.cos(c));

    const elevationRad = Math.asin(((R + satPosition.altitude) * Math.cos(c) - R) / straightDistance);
    return toDegrees(elevationRad);
};

// Calculate direction of pass
const calculateDirection = (satPosition, observerLocation) => {
    // Simplified direction calculation
    const latDiff = satPosition.latitude - observerLocation.lat;
    const lngDiff = satPosition.longitude - observerLocation.lng;

    if (Math.abs(latDiff) > Math.abs(lngDiff)) {
        return latDiff > 0 ? 'Northbound' : 'Southbound';
    } else {
        return lngDiff > 0 ? 'Eastbound' : 'Westbound';
    }
};

// Format pass time for display
export const formatPassTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Get time until pass
export const getTimeUntil = (futureDate) => {
    const now = new Date();
    const diffMs = futureDate.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
        return `in ${diffHours}h ${diffMinutes}m`;
    } else {
        return `in ${diffMinutes} minutes`;
    }
};