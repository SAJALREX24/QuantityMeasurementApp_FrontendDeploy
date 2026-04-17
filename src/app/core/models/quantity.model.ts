export interface QuantityDTO {
  value: number;
  unit: string;
  category: string;
}

export interface QuantityInputDTO {
  quantityOne: QuantityDTO;
  quantityTwo: QuantityDTO;
}

export interface ConvertDTO {
  quantityOne: QuantityDTO;
  targetUnit: string;
}

export interface HistoryRecord {
  id: number;
  userId: number;
  value1: number;
  value2: number;
  unit1: string;
  unit2: string;
  category: string;
  operation: string;
  result: number;
}

export interface Stats {
  totalOperations: number;
  byOperation: { operation: string; count: number }[];
  byCategory: { category: string; count: number }[];
}
