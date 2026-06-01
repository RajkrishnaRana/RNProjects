export function isWithinRadius(
    target: {latitude: number; longitude: number},
    user: {latitude: number; longitude: number},
    radiusKm: number = 1.3,
): boolean {
    const R = 6371; // Earth radius in km
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(user.latitude - target.latitude);
    const dLng = toRad(user.longitude - target.longitude);

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(target.latitude)) * Math.cos(toRad(user.latitude)) * Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance <= radiusKm;
}
