export interface Part {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
  children: Part[];
}
