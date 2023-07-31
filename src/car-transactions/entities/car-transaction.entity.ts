export class CarTransaction {
  carRef: string;
  power?: {
    engine: number;
    hp: number;
  };
  consumption?: string;
  mileage?: string;
  maintenance?: any;
}
