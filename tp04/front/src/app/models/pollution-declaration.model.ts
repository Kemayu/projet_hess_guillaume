export interface PollutionDeclaration {
  id?: number | string;
  title: string;
  type: string;
  description: string;
  observationDate: string;
  location: string;
  latitude: number;
  longitude: number;
  dangerIndex: number;
  photoUrl?: string | null;
}

export type PollutionPayload = Omit<PollutionDeclaration, 'id'>;