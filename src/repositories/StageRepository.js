//@ts-check

/**
 *
 * подключение типов в js файле:
 *
 * @typedef {import('@/types').TCreateStage}
 * @typedef {import('@/types').TUpdateStage}
 * @typedef {import('@/types').TDeleteStage}
 */


import {BaseRepository} from "./BaseRepository";

export class StageRepository extends BaseRepository {
    constructor() {
        super('processes/stages');
    }

    /**
     * @param {TCreateStage} payload
     * @return Promise<any>
     */
    async create(payload) {
        const result = await this._query({
            payload,
            nestedEndpoint : 'create'
        });

        let message = result.messages ? result.messages.join(', ') : result.message;

        if (!result.success)
            throw new Error(message);

        return result;
    }

    /**
     * @param {TUpdateStage} payload
     * @return Promise<any>
     */
    async update(payload) {
        const result = await this._query({
            payload,
            nestedEndpoint : 'update'
        });

        let message = result.messages ? result.messages.join(', ') : result.message;

        if (!result.success)
            throw new Error(message);

        return result;
    }

    /**
     * @param {TDeleteStage} payload
     * @return Promise<any>
     */
    async delete(payload) {
        const result = await this._query({
            payload,
            nestedEndpoint : 'delete'
        });

        let message = result.messages ? result.messages.join(', ') : result.message;

        if (!result.success)
            throw new Error(message);

        return result;
    }

}



