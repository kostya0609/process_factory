//@ts-check

/**
 *
 * подключение типов в js файле:
 *
 * @typedef {import('@/types').TCreateApprovalRoute}
 * @typedef {import('@/types').TListApprovalRoute}
 * @typedef {import('@/types').TUpdateApprovalRoute}
 * @typedef {import('@/types').TDeleteApprovalRoute}
 * @typedef {import('@/types').TGetApprovalRoute}
 */


import {BaseRepository} from "./BaseRepository";

export class ApprovalRoutesRepository extends BaseRepository {
    constructor() {
        super('approval-routes');
    }

    /**
     * @param {TListApprovalRoute} payload
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
     * @param {TCreateApprovalRoute} payload
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
     * @param {TUpdateApprovalRoute} payload
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
     * @param {TDeleteApprovalRoute} payload
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

    /**
     * @param {TGetApprovalRoute} payload
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

}



