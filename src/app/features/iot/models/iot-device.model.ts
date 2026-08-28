export type IoTDeviceType = 'AirConditioning' | 'Lighting' | 'Thermostat' | 'SmartMeter' | 'HumiditySensor' | 'SmokeDetector';

export interface IoTDeviceModel {
  id: number;
  spaceId: number;
  type: string;
  name: string;
  serialNumber: string;
  isOn: boolean;
}
