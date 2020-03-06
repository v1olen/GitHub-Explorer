export const isOneOfTrue = (...booleans: boolean[]): boolean => booleans.includes(true); 
export const areAllTrue = (...booleans: boolean[]): boolean => {
    for (const condition of booleans) if (!condition) return false;
    return true;
}; 
