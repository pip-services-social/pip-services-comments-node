import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';
import { CommentV1 } from '../data/version1/CommentV1';
import { ICommentsPersistence } from './ICommentsPersistence';
export declare class CommentsMemoryPersistence extends IdentifiableMemoryPersistence<CommentV1, string> implements ICommentsPersistence {
    constructor();
    private matchString;
    private matchSearch;
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<CommentV1>) => void): void;
    getOneById(correlationId: string, id: string, callback: (err: any, item: CommentV1) => void): void;
    create(correlationId: string, comment: CommentV1, callback: (err: any, item: CommentV1) => void): void;
}
