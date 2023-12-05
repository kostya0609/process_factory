import {BaseRepository} from "./BaseRepository";

export class TypeRepository extends BaseRepository {
    constructor() {
        super('types', 'v1');
    }

    /**
     * @return Promise<any>
     */
    async list() {
        const result = await this._query({
            nestedEndpoint : 'list'
        });

        if (!result.success)
            throw new Error(result.message);

        return result;
    }
}