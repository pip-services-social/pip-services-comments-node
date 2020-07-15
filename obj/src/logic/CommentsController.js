"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    getCommentById(correlationId, id, callback) {
        this._persistence.getOneById(correlationId, id, callback);
    }
    createComment(correlationId, comment, callback) {
        this._persistence.create(correlationId, comment, callback);
    }
    updateComment(correlationId, comment, callback) {
        this._persistence.update(correlationId, comment, callback);
    }
    deleteCommentById(correlationId, id, callback) {
        this._persistence.deleteById(correlationId, id, callback);
    }
}
exports.CommentsController = CommentsController;
CommentsController._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'pip-services-comments:persistence:*:*:1.0');
//# sourceMappingURL=CommentsController.js.map