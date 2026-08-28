export type SpaceStatus = 'Published' | 'Accepted' | 'Completed' | 'Cancelled' | 'Available' | 'Rented' | 'Maintenance' | 'Archived';
export type SpaceType = 'Apartment' | 'Office' | 'Warehouse' | 'Room' | 'House' | 'Commercial';

export interface LocationModel {
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface SpaceModel {
  id: string;
  title: string;
  description: string;
  type: SpaceType;
  status: SpaceStatus;
  pricePerMonth: number;
  totalPricing: number;
  location: LocationModel;
  images: string[];
  ownerId: string;
  remodelerId?: string;
}
