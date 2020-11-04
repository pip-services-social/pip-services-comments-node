import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { CommentV1 } from '../data/version1/CommentV1';
import { ICommentsController } from './ICommentsController';
export declare class CommentsController implements IConfigurable, IReferenceable, ICommandable, ICommentsController {
    private static _defaultConfig;
    private _dependencyResolver;
    private _persistence;
    private _commandSet;
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    getCommandSet(): CommandSet;
    getComments(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<CommentV1>) => void): void;
    getCommentById(correlationId: string, id: string, callback: (err: any, comment: CommentV1) => void): void;
    createComment(correlationId: string, comment: CommentV1, callback: (err: any, comment: CommentV1) => void): void;
    updateComment(correlationId: string, comment: CommentV1, callback: (err: any, comment: CommentV1) => void): void;
    deleteCommentById(correlationId: string, id: string, callback: (err: any, comment: CommentV1) => void): void;
    addMemeToComment(correlationId: string, id: string, creator_id: string, meme_type: string, callback: (err: any, review: CommentV1) => void): void;
    removeMemeFromComment(correlationId: string, id: string, creator_id: string, meme_type: string, callback: (err: any, review: CommentV1) => void): void;
    updateCommentState(correlationId: string, id: string, state: String, callback: (err: any, review: CommentV1) => void): void;
    markCommentAsDeleted(correlationId: string, id: string, callback: (err: any, review: CommentV1) => void): void;
}
