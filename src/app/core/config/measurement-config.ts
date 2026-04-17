export interface CategoryConfig {
  name: string;
  icon: string;
  units: string[];
  operations: string[];
  baseUnit: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    name: 'Length',
    icon: 'L',
    units: ['Inch', 'Feet', 'Yard', 'Centimeter'],
    operations: ['Compare', 'Add', 'Subtract', 'Divide', 'Convert'],
    baseUnit: 'Inch',
  },
  {
    name: 'Weight',
    icon: 'W',
    units: ['Gram', 'Kilogram', 'Tonne'],
    operations: ['Compare', 'Add', 'Subtract', 'Divide', 'Convert'],
    baseUnit: 'Gram',
  },
  {
    name: 'Volume',
    icon: 'V',
    units: ['Milliliter', 'Liter', 'Gallon'],
    operations: ['Compare', 'Add', 'Subtract', 'Divide', 'Convert'],
    baseUnit: 'Milliliter',
  },
  {
    name: 'Temperature',
    icon: 'T',
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    operations: ['Compare', 'Convert'],
    baseUnit: 'Celsius',
  },
];
