let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { CommentV1 } from '../data/version1/CommentV1';
import { ICommentsPersistence } from './ICommentsPersistence';

export class CommentsMongoDbPersistence
    extends IdentifiableMongoDbPersistence<CommentV1, string>
    implements ICommentsPersistence {

    constructor() {
        super('comments');
        this.ensureIndex({ 'ref.id': 1, 'ref.type': 1 });
        this.ensureIndex({ parent_ids: 1 });
        this.ensureIndex({ create_time: -1 });
    }
    
    private composeFilter(filter: any) {
        filter = filter || new FilterParams();

        let criteria = [];

        let ref_id = filter.getAsNullableString('ref_id');
        if (ref_id != null) {
            criteria.push({ 'refs.id': ref_id });
        }

        let ref_type = filter.getAsNullableString('ref_type');
        if (ref_type != null) {
            criteria.push({ 'refs.type': ref_type });
        }
        
        let parent_id = filter.getAsNullableString('parent_id');
        if (parent_id != null) {
            criteria.push({ parent_ids: { $in: [parent_id] } });
        }

        let parent_ids = filter.getAsObject('parent_ids');
        if (_.isString(parent_ids))
            parent_ids = parent_ids.split(',');
        if (_.isArray(parent_ids))
            criteria.push({ parent_ids: { $in: parent_ids } });

        let creator_id = filter.getAsNullableString('creator_id');
        if (creator_id != null) {
            criteria.push({ 'creator_id': creator_id });
        }

        let time_from = filter.getAsNullableDateTime('time_from');
        if (time_from != null){
            criteria.push({ create_time: { $gte: time_from } });
        }

        let time_to = filter.getAsNullableDateTime('time_to');
        if (time_to != null){
            criteria.push({ create_time: { $lt: time_to } });
        }

        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ $sort: {create_time: -1 } });
        if (criteria.length > 0){

        }
        return criteria.length > 0 ? { $and: criteria } : null;
    }
    
    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CommentV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
}
