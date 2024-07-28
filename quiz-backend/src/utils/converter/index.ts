const toCamelCase = (str: string): string => {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

const toSnakeCase = (str: string): string => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export const convertKeysToCamelCase = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map((item) => convertKeysToCamelCase(item));
    } else if (obj !== null && obj.constructor === Object) {
      return Object.keys(obj).reduce((acc, key) => {
        const camelCaseKey = toCamelCase(key);
        acc[camelCaseKey] = convertKeysToCamelCase(obj[key]);
        return acc;
      }, {} as any);
    }
    return obj;
};

export const convertKeysToSnakeCase = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map((item) => convertKeysToSnakeCase(item));
    } else if (obj !== null && obj.constructor === Object) {
      return Object.keys(obj).reduce((acc, key) => {
        const snakeCaseKey = toSnakeCase(key);
        acc[snakeCaseKey] = convertKeysToSnakeCase(obj[key]);
        return acc;
      }, {} as any);
    }
    return obj;
};