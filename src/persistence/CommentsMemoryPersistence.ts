let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';
import { TagsProcessor } from 'pip-services3-commons-node';

import { CommentV1 } from '../data/version1/CommentV1';
import { ICommentsPersistence } from './ICommentsPersistence';

export class CommentsMemoryPersistence 
    extends IdentifiableMemoryPersistence<CommentV1, string> 
    implements ICommentsPersistence {

    constructor() {
        super();
    }

    private matchString(value: string, search: string): boolean {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }

    private matchSearch(item: CommentV1, search: string): boolean {
        search = search.toLowerCase();
        if (this.matchString(item.id, search))
            return true;
        if (this.matchString(item.product, search))
            return true;
        if (this.matchString(item.copyrights, search))
            return true;
        return false;
    }
    
    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        
        let search = filter.getAsNullableString('search');
        let id = filter.getAsNullableString('id');
        let product = filter.getAsNullableString('product');
        let group = filter.getAsNullableString('group');
                
        return (item) => {
            if (search && !this.matchSearch(item, search)) 
                return false;
            if (id && item.id != id) 
                return false;
            if (product && item.product != product) 
                return false;
            if (group && item.group != group) 
                return false;
            return true; 
        };
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CommentV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

}
