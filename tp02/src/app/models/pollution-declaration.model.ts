export interface PollutionDeclaration {
  title: string;
  type: string;
  description: string;
  observationDate: string;
  location: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
}