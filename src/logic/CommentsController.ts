
let async = require('async');
import { ConfigParams, DateTimeConverter } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';

import { CommentV1 } from '../data/version1/CommentV1';
import { ICommentsPersistence } from '../persistence/ICommentsPersistence';
import { ICommentsController } from './ICommentsController';
import { CommentsCommandSet } from './CommentsCommandSet';

export class CommentsController implements IConfigurable, IReferenceable, ICommandable, ICommentsController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'pip-services-comments:persistence:*:*:1.0'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(CommentsController._defaultConfig);
    private _persistence: ICommentsPersistence;
    private _commandSet: CommentsCommandSet;

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<ICommentsPersistence>('persistence');
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new CommentsCommandSet(this);
        return this._commandSet;
    }

    public getComments(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CommentV1>) => void): void {
        if (filter['time_from']) {
            filter['time_from'] = DateTimeConverter.toNullableDateTime(filter['time_from']);
        }
        if (filter['time_to']) {
            filter['time_to'] = DateTimeConverter.toNullableDateTime(filter['time_to']);
        }
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public getCommentById(correlationId: string, id: string,
        callback: (err: any, comment: CommentV1) => void): void {
        this._persistence.getOneById(correlationId, id, callback);
    }

    public createComment(correlationId: string, comment: CommentV1,
        callback: (err: any, comment: CommentV1) => void): void {
        let result: CommentV1;

        comment.children_counter = 0;
        async.series([
            (callback) => {
                this._persistence.create(correlationId, comment, (err, item) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    result = item;
                    callback()
                });
            },
            (callback) => {
                if (result != null && result.parent_ids && result.parent_ids.length > 0) {
                    async.forEach(result.parent_ids, (item, cb) => {
                        this._persistence.increment(correlationId, item, cb);
                    }, callback);
                } else {
                    callback();
                }
            }
        ], (err) => {
            callback(err, result)
        })
    }

    public updateComment(correlationId: string, comment: CommentV1,
        callback: (err: any, comment: CommentV1) => void): void {
        this._persistence.update(correlationId, comment, callback);
    }

    public deleteCommentById(correlationId: string, id: string,
        callback: (err: any, comment: CommentV1) => void): void {
        let result: CommentV1;
        async.series([
            (callback) => {
                this._persistence.deleteById(correlationId, id, (err, item) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    result = item;
                    callback()
                });
            },
            (callback) => {
                if (result != null && result.parent_ids && result.parent_ids.length > 0) {
                    async.forEach(result.parent_ids, (item, cb) => {
                        this._persistence.decrement(correlationId, item, cb);
                    }, callback);
                } else {
                    callback();
                }
            }
        ], (err) => {
            callback(err, result)
        })
    }

    addMemeToComment(correlationId: string, id: string, creator_id: string, meme_type: string, callback: (err: any, review: CommentV1) => void): void {
        this._persistence.addMeme(correlationId, id, creator_id, meme_type, callback);
    }

    removeMemeFromComment(correlationId: string, id: string, creator_id: string, meme_type: string, callback: (err: any, review: CommentV1) => void): void {
        this._persistence.removeMeme(correlationId, id, creator_id, meme_type, callback);
    }

    updateCommentState(correlationId: string, id: string, state: String, callback: (err: any, review: CommentV1) => void): void {
        this._persistence.updateState(correlationId, id, state, callback);
    }

    markCommentAsDeleted(correlationId: string, id: string, callback: (err: any, review: CommentV1) => void): void {
        this._persistence.markAsDeleted(correlationId, id, callback);
    }
}
