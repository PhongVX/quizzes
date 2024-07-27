export interface IDatabase {
    getDB: () => {},
    query: (queryString: string, values?: any[]) => Promise<any>
}

export interface Identifiable {
    id?: number | string;
}

export interface QueryOptions {
    table: string,
    condition?: 'AND' | 'OR',
    selectFields?: string[]
}
