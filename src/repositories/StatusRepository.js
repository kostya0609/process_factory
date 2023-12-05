//@ts-check

/**
 *
 * подключение типов в js файле:
 *
 * @typedef {import('@/types').TCreateStatus}
 * @typedef {import('@/types').TListStatus}
 * @typedef {import('@/types').TUpdateStatus}
 * @typedef {import('@/types').TDeleteStatus}
 */


import {BaseRepository} from "./BaseRepository";

export class StatusRepository extends BaseRepository {
    constructor() {
        super('statuses');
    }

    /**
     * @param {TListStatus} payload
     * @return Promise<any>
     */
    async list(payload) {
        const result = await this._query({
            payload,
            nestedEndpoint : 'list'
        });

        if (!result.success)
            throw new Error(result.message);

        return result;
    }

    /**
     * @param {TCreateStatus} payload
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
     * @param {TUpdateStatus} payload
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

    /**
     * @param {TDeleteStatus} payload
     * @return Promise<any>
     */
    async delete(payload) {
        const result = await this._query({
            payload,
            nestedEndpoint : 'delete'
        });

        if (!result.success)
            throw new Error(result.message);

        return result;
    }

}



