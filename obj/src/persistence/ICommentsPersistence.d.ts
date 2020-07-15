import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IGetter } from 'pip-services3-data-node';
import { IWriter } from 'pip-services3-data-node';
import { CommentV1 } from '../data/version1/CommentV1';
export interface ICommentsPersistence extends IGetter<CommentV1, string>, IWriter<CommentV1, string> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<CommentV1>) => void): void;
    getOneById(correlationId: string, id: string, callback: (err: any, item: CommentV1) => void): void;
    create(correlationId: string, item: CommentV1, callback: (err: any, item: CommentV1) => void): void;
    update(correlationId: string, item: CommentV1, callback: (err: any, item: CommentV1) => void): void;
    deleteById(correlationId: string, id: string, callback: (err: any, item: CommentV1) => void): void;
}
