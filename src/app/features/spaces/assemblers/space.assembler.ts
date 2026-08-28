import { SpaceDto, CreateSpaceDto } from '../models/space.dto';
import { SpaceModel, SpaceStatus, SpaceType } from '../models/space.model';

export class SpaceAssembler {
  static toModel(dto: SpaceDto): SpaceModel {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      type: (dto.type as SpaceType) || 'Apartment',
      status: (dto.status as SpaceStatus) || 'Published',
      pricePerMonth: dto.pricePerMonth,
      totalPricing: dto.totalPricing || dto.pricePerMonth,
      location: {
        address: dto.location?.address || 'Av. Larco 400',
        city: dto.location?.city || 'Lima',
        country: dto.location?.country || 'Peru',
        latitude: dto.location?.latitude || -12.122,
        longitude: dto.location?.longitude || -77.028
      },
      images: (dto.images && dto.images.length > 0) ? dto.images : [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
      ],
      ownerId: dto.ownerId,
      remodelerId: dto.remodelerId
    };
  }

  static toModelList(dtos: SpaceDto[]): SpaceModel[] {
    return (dtos || []).map(dto => this.toModel(dto));
  }
}
