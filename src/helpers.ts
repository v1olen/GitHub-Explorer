export const isOneOfTrue = (...booleans: boolean[]): boolean => booleans.includes(true); 
export const areAllTrue = (...booleans: boolean[]): boolean => !booleans.includes(false);
