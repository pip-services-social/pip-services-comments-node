let _ = require('lodash');

import { FilterParams, DateTimeConverter } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';

import { CommentV1 } from '../data/version1/CommentV1';
import { ICommentsPersistence } from './ICommentsPersistence';

export class CommentsMemoryPersistence 
    extends IdentifiableMemoryPersistence<CommentV1, string> 
    implements ICommentsPersistence {

    constructor() {
        super();
    }
    
    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        
        let ref_id = filter.getAsNullableString('ref_id');
        let ref_type = filter.getAsNullableString('ref_type');
        let parent_id = filter.getAsNullableString('parent_id');
        let parent_ids = filter.getAsObject('parent_ids');
        let creator_id = filter.getAsNullableString('creator_id');
        let time_from = filter.getAsNullableDateTime('time_from');
        let time_to = filter.getAsNullableDateTime('time_to');

        if (_.isString(parent_ids))
            parent_ids = parent_ids.split(',');
        if (!_.isArray(parent_ids))
            parent_ids = null;  

        return (item) => {
            if (ref_id && (item.refs == null || item.refs.map(x => x.id).indexOf(ref_id) < 0))
                return false;
            if (ref_type && (item.refs == null || item.refs.map(x => x.type).indexOf(ref_type) < 0))
                return false;
            if (parent_id && (item.parent_ids == null || item.parent_ids.indexOf(parent_id) < 0))
                return false;
            if (parent_ids && (item.parent_ids == null || !parent_ids.some(r=> item.parent_ids.includes(r) == true)  ))
                return false;                
            if (creator_id && item.creator_id != creator_id)
                return false;
            if (time_from  && (item.create_time == null || DateTimeConverter.toNullableDateTime(item.create_time) < time_from ))
                return false;
            if (time_to && (item.create_time == null || DateTimeConverter.toNullableDateTime(item.create_time) > time_to ))
                return false;
            return true;
        };
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CommentV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public getOneById(correlationId: string, id: string, 
        callback: (err: any, item: CommentV1) => void): void{
            let item = _.find(this._items, (item) => item.id == id);
            if (item != null) this._logger.trace(correlationId, "Found comment by %s", id);
            else this._logger.trace(correlationId, "Cannot find comment by %s", id);
            callback(null, item);
    }

    public create(correlationId: string, comment: CommentV1,
        callback: (err:any, item: CommentV1) => void): void {
            let comment_model = new CommentV1;
            super.create(null, comment,
                (err, item) =>{
                    if (item != null) this._logger.trace(correlationId, "Create comment by %s", comment);
                    else this._logger.trace(correlationId, "Cannot create key by %s", comment);
                    callback(err, item);
                });
    }
}
