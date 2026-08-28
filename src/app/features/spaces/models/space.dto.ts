export interface LocationDto {
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface SpaceDto {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  pricePerMonth: number;
  totalPricing: number;
  location: LocationDto;
  images: string[];
  ownerId: string;
  remodelerId?: string;
}

export interface CreateSpaceDto {
  title: string;
  description: string;
  type: string;
  pricePerMonth: number;
  location: LocationDto;
  images: string[];
}

export interface UpdateSpaceDto {
  title: string;
  description: string;
  type: string;
  pricePerMonth: number;
  location: LocationDto;
  images: string[];
}
