import { Identifiable, QueryOptions } from "./types";

export const buildUpdateQuery = <T extends Identifiable>(o: T, options: QueryOptions) => {
    const keys = Object.keys(o).filter(key => key !== "id" && o[key as keyof T] !== undefined);
    const setClause = keys.map((key, index) => `${key}=$${index + 1}`).join(", ");
    const values = keys.map(key => o[key as keyof T]);
    
    const queryString = `UPDATE ${options.table} SET ${setClause} WHERE id=$${keys.length + 1}`;
    values.push(o.id as T[keyof T]);

    return { queryString, values };
};

export const buildInsertQuery = <T extends object>(o: T, options: QueryOptions) => {
    const keys = Object.keys(o).filter(key => o[key as keyof T] !== undefined);
    const insertFieldsClause = keys.map((key) => `${key}`).join(", ");
    const insertValuesClause = keys.map((_, index) => `$${index + 1}`).join(", ");
    const values = keys.map(key => o[key as keyof T]);

    const queryString = `INSERT INTO ${options.table} (${insertFieldsClause}) VALUES (${insertValuesClause}) RETURNING *`;
    return { queryString, values };
};

export const buildDeleteQuery = <T extends Identifiable>(o: T, options: QueryOptions) => {
    const keys = Object.keys(o).filter(key => o[key as keyof T] !== undefined);
    const whereClause = keys.map((key, index) => `${key}=$${index + 1}`).join(` ${options.condition || 'AND'} `);
    const values = keys.map(key => o[key as keyof T]);

    const queryString = `DELETE FROM ${options.table} WHERE ${whereClause}`;
    return { queryString, values };
};

export const buildSelectQuery = <T extends Identifiable>(o: T, options: QueryOptions) => {
    const keys = Object.keys(o).filter(key => o[key as keyof T] !== undefined);
    const queryFields = !!options.selectFields && options.selectFields.length > 0 ? options.selectFields?.join(','): '*';
    const whereClause = keys.map((key, index) => `${key}=$${index + 1}`).join(` ${options.condition || 'AND'} `);
    const values = keys.map(key => o[key as keyof T]);
    const queryString = `SELECT ${queryFields} FROM ${options.table} WHERE ${whereClause}`;
    return { queryString, values };
};
