import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';
import { CommentV1 } from '../data/version1/CommentV1';
import { ICommentsPersistence } from './ICommentsPersistence';
export declare class CommentsMongoDbPersistence extends IdentifiableMongoDbPersistence<CommentV1, string> implements ICommentsPersistence {
    constructor();
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<CommentV1>) => void): void;
    increment(correlationId: string, id: string, callback?: (err: any, review: CommentV1) => void): void;
    decrement(correlationId: string, id: string, callback?: (err: any, review: CommentV1) => void): void;
}
