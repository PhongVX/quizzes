import { Postgres } from "../../common/database/postgres/postgres";
import { IDatabase } from "../../common/database/types";

import { IApi } from "./types";

export class ApiImpl implements IApi {
    private routes: any[];
    constructor(db: IDatabase) {
        this.routes = [];
    }

    getAllRoutes = () => {
        return this.routes;
    }

}