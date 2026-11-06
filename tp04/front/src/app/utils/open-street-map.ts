// Construit le lien OpenStreetMap centré sur les coordonnées, avec un marqueur
export const openStreetMapUrl = (latitude: number | string, longitude: number | string): string => {
  const lat = Number(latitude);
  const lon = Number(longitude);
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
};
