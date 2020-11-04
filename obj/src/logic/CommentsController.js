"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsController = void 0;
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const CommentsCommandSet_1 = require("./CommentsCommandSet");
class CommentsController {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(CommentsController._defaultConfig);
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new CommentsCommandSet_1.CommentsCommandSet(this);
        return this._commandSet;
    }
    getComments(correlationId, filter, paging, callback) {
        if (filter['time_from']) {
            filter['time_from'] = pip_services3_commons_node_1.DateTimeConverter.toNullableDateTime(filter['time_from']);
        }
        if (filter['time_to']) {
            filter['time_to'] = pip_services3_commons_node_1.DateTimeConverter.toNullableDateTime(filter['time_to']);
        }
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    getCommentById(correlationId, id, callback) {
        this._persistence.getOneById(correlationId, id, callback);
    }
    createComment(correlationId, comment, callback) {
        let result;
        comment.children_counter = 0;
        async.series([
            (callback) => {
                this._persistence.create(correlationId, comment, (err, item) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    result = item;
                    callback();
                });
            },
            (callback) => {
                if (result != null && result.parent_ids && result.parent_ids.length > 0) {
                    async.forEach(result.parent_ids, (item, cb) => {
                        this._persistence.increment(correlationId, item, cb);
                    }, callback);
                }
                else {
                    callback();
                }
            }
        ], (err) => {
            callback(err, result);
        });
    }
    updateComment(correlationId, comment, callback) {
        this._persistence.update(correlationId, comment, callback);
    }
    deleteCommentById(correlationId, id, callback) {
        let result;
        async.series([
            (callback) => {
                this._persistence.deleteById(correlationId, id, (err, item) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    result = item;
                    callback();
                });
            },
            (callback) => {
                if (result != null && result.parent_ids && result.parent_ids.length > 0) {
                    async.forEach(result.parent_ids, (item, cb) => {
                        this._persistence.decrement(correlationId, item, cb);
                    }, callback);
                }
                else {
                    callback();
                }
            }
        ], (err) => {
            callback(err, result);
        });
    }
    addMemeToComment(correlationId, id, creator_id, meme_type, callback) {
        this._persistence.addMeme(correlationId, id, creator_id, meme_type, callback);
    }
    removeMemeFromComment(correlationId, id, creator_id, meme_type, callback) {
        this._persistence.removeMeme(correlationId, id, creator_id, meme_type, callback);
    }
    updateCommentState(correlationId, id, state, callback) {
        this._persistence.updateState(correlationId, id, state, callback);
    }
    markCommentAsDeleted(correlationId, id, callback) {
        this._persistence.markAsDeleted(correlationId, id, callback);
    }
}
exports.CommentsController = CommentsController;
CommentsController._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'pip-services-comments:persistence:*:*:1.0');
//# sourceMappingURL=CommentsController.js.map