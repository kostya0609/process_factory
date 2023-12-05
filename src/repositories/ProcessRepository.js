//@ts-check

/**
 *
 * подключение типов в js файле:
 *
 * @typedef {import('@/types').TCreateProcess}
 * @typedef {import('@/types').TAllProcess}
 * @typedef {import('@/types').TGetProcess}
 * @typedef {import('@/types').TUpdateProcess}
 *
 */

import {BaseRepository} from "./BaseRepository";

export class ProcessRepository extends BaseRepository {
    constructor() {
        super('processes');
    }

    /**
     * @param {TAllProcess} payload
     * @return Promise<any>
     */
    async allList(payload) {
        const result = await this._query({
            payload,
            nestedEndpoint : 'list'
        });

        if (!result.success)
            throw new Error(result.message);

        return result;
    }

    /**
     * @param {TCreateProcess} payload
     * @return Promise<any>
     */
    async create(payload) {
        const result = await this._query({
            payload,
            nestedEndpoint : 'create'
        });

        if (!result.success)
            throw new Error(result.message);

        return result;
    }

    /**
     * @param {TGetProcess} payload
     * @return Promise<any>
     */
    async get(payload) {
        const result = await this._query({
            payload,
            nestedEndpoint : 'get'
        });

        if (!result.success)
            throw new Error(result.message);

        return result;
    }

    /**
     * @param {TUpdateProcess} payload
     * @return Promise<any>
     */
    async update(payload) {
        const result = await this._query({
            payload,
            nestedEndpoint : 'update'
        });

        if (!result.success)
            throw new Error(result.message);

        return result;
    }

}



