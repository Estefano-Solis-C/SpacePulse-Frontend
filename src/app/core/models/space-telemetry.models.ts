export interface ApiResponseState<T> {
  data: T | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}

// 1. ISS Telemetry
export interface IssTelemetryDto {
  name: string;
  id: number;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: string;
  footprint: number;
  timestamp: number;
  daynum: number;
  solar_lat: number;
  solar_lon: number;
  units: string;
}

export interface IssTelemetry {
  readonly latitude: number;
  readonly longitude: number;
  readonly altitudeKm: number;
  readonly velocityKmh: number;
  readonly visibility: string;
  readonly timestamp: Date;
}

export function mapToIssTelemetry(dto: IssTelemetryDto): IssTelemetry {
  return {
    latitude: dto.latitude,
    longitude: dto.longitude,
    altitudeKm: Number(dto.altitude.toFixed(2)),
    velocityKmh: Number(dto.velocity.toFixed(2)),
    visibility: dto.visibility,
    timestamp: new Date(dto.timestamp * 1000)
  };
}

// 2. NASA APOD
export interface ApodDto {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
  copyright?: string;
}

export interface ApodItem {
  readonly date: string;
  readonly title: string;
  readonly explanation: string;
  readonly url: string;
  readonly hdUrl: string;
  readonly mediaType: string;
  readonly copyright?: string;
}

export function mapToApodItem(dto: ApodDto): ApodItem {
  return {
    date: dto.date,
    title: dto.title,
    explanation: dto.explanation,
    url: dto.url,
    hdUrl: dto.hdurl || dto.url,
    mediaType: dto.media_type,
    copyright: dto.copyright
  };
}

// 3. Mars Rover Photos
export interface MarsPhotoCameraDto {
  id: number;
  name: string;
  rover_id: number;
  full_name: string;
}

export interface MarsRoverInfoDto {
  id: number;
  name: string;
  landing_date: string;
  launch_date: string;
  status: string;
}

export interface MarsPhotoDto {
  id: number;
  sol: number;
  camera: MarsPhotoCameraDto;
  img_src: string;
  earth_date: string;
  rover: MarsRoverInfoDto;
}

export interface MarsRoverResponseDto {
  photos: MarsPhotoDto[];
}

export interface MarsPhoto {
  readonly id: number;
  readonly sol: number;
  readonly cameraName: string;
  readonly cameraFullName: string;
  readonly imgSrc: string;
  readonly earthDate: string;
  readonly roverName: string;
  readonly roverStatus: string;
}

export function mapToMarsPhoto(dto: MarsPhotoDto): MarsPhoto {
  return {
    id: dto.id,
    sol: dto.sol,
    cameraName: dto.camera.name,
    cameraFullName: dto.camera.full_name,
    imgSrc: dto.img_src,
    earthDate: dto.earth_date,
    roverName: dto.rover.name,
    roverStatus: dto.rover.status
  };
}

// 4. Rocket Launches
export interface LaunchStatusDto {
  id: number;
  name: string;
  abbrev: string;
  description: string;
}

export interface RocketConfigDto {
  name: string;
  family?: string;
  variant?: string;
}

export interface RocketDto {
  configuration: RocketConfigDto;
}

export interface MissionDto {
  name: string;
  description: string;
  type: string;
}

export interface PadLocationDto {
  name: string;
}

export interface PadDto {
  name: string;
  location: PadLocationDto;
}

export interface LaunchDto {
  id: string;
  name: string;
  status: LaunchStatusDto;
  net: string;
  window_end: string;
  window_start: string;
  rocket: RocketDto;
  mission?: MissionDto;
  pad: PadDto;
  image?: string;
}

export interface LaunchResponseDto {
  count: number;
  results: LaunchDto[];
}

export interface RocketLaunch {
  readonly id: string;
  readonly name: string;
  readonly statusName: string;
  readonly statusAbbrev: string;
  readonly netTime: Date;
  readonly rocketName: string;
  readonly missionName: string;
  readonly missionDescription: string;
  readonly padName: string;
  readonly padLocation: string;
  readonly imageUrl?: string;
}

export function mapToRocketLaunch(dto: LaunchDto): RocketLaunch {
  return {
    id: dto.id,
    name: dto.name,
    statusName: dto.status.name,
    statusAbbrev: dto.status.abbrev,
    netTime: new Date(dto.net),
    rocketName: dto.rocket?.configuration?.name || 'Unknown Rocket',
    missionName: dto.mission?.name || 'General Mission',
    missionDescription: dto.mission?.description || 'Payload deployment and orbital operations.',
    padName: dto.pad?.name || 'Launch Complex',
    padLocation: dto.pad?.location?.name || 'Global Spaceport',
    imageUrl: dto.image
  };
}

// 5. Asteroids Near-Earth Objects (NEO)
export interface EstimatedDiameterUnitDto {
  estimated_diameter_min: number;
  estimated_diameter_max: number;
}

export interface EstimatedDiameterDto {
  kilometers: EstimatedDiameterUnitDto;
  meters: EstimatedDiameterUnitDto;
}

export interface MissDistanceDto {
  astronomical: string;
  lunar: string;
  kilometers: string;
  miles: string;
}

export interface RelativeVelocityDto {
  kilometers_per_second: string;
  kilometers_per_hour: string;
  miles_per_hour: string;
}

export interface CloseApproachDataDto {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: RelativeVelocityDto;
  miss_distance: MissDistanceDto;
  orbiting_body: string;
}

export interface NearEarthObjectDto {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: EstimatedDiameterDto;
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachDataDto[];
}

export interface NeoFeedResponseDto {
  element_count: number;
  near_earth_objects: { [date: string]: NearEarthObjectDto[] };
}

export interface AsteroidNeo {
  readonly id: string;
  readonly name: string;
  readonly jplUrl: string;
  readonly absoluteMagnitude: number;
  readonly estimatedDiameterMetersMin: number;
  readonly estimatedDiameterMetersMax: number;
  readonly isHazardous: boolean;
  readonly closeApproachDate: string;
  readonly velocityKmh: number;
  readonly missDistanceKm: number;
  readonly missDistanceLunar: number;
}

export function mapToAsteroidNeo(dto: NearEarthObjectDto): AsteroidNeo {
  const closeApproach = dto.close_approach_data?.[0];
  return {
    id: dto.id,
    name: dto.name,
    jplUrl: dto.nasa_jpl_url,
    absoluteMagnitude: dto.absolute_magnitude_h,
    estimatedDiameterMetersMin: Math.round(dto.estimated_diameter?.meters?.estimated_diameter_min || 0),
    estimatedDiameterMetersMax: Math.round(dto.estimated_diameter?.meters?.estimated_diameter_max || 0),
    isHazardous: dto.is_potentially_hazardous_asteroid,
    closeApproachDate: closeApproach?.close_approach_date || 'N/A',
    velocityKmh: Number(closeApproach?.relative_velocity?.kilometers_per_hour || 0),
    missDistanceKm: Number(closeApproach?.miss_distance?.kilometers || 0),
    missDistanceLunar: Number(closeApproach?.miss_distance?.lunar || 0)
  };
}
