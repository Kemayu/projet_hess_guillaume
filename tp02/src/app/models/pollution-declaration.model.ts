export interface PollutionDeclaration {
  id?: number | string;
  title: string;
  type: string;
  description: string;
  observationDate: string;
  location: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
}

export type PollutionPayload = Omit<PollutionDeclaration, 'id'>;