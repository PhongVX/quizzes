import { Pool } from 'pg';
import { IDatabase} from '../types';

export class Postgres implements IDatabase {
    private db: Pool;

    constructor() {
        this.db = new Pool({
            connectionString: process.env.dbConnectionString || 'postgresql://postgres:123456@172.20.0.2:5432/quizzes',
        });
    }

    getDB = () => {
        return this.db;
    }

    query = async(queryString: string, values?: any[]) => {
        try {
            let result;
            if (values && values?.length > 0) {
                result = await this.db.query(queryString, values);
            } else {
                result = await this.db.query(queryString);
            }
            return result;
        } catch(err) {
            return null;
        }
    }
}

