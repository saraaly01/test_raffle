
export interface RNGResult {
  id: string;
  value: number;
  timestamp: number;
  min: number;
  max: number;
}

export interface GeneratorConfig {
  min: number;
  max: number;
  allowDuplicates: boolean;
}
