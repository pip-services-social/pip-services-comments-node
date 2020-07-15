"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const pip_services3_commons_node_8 = require("pip-services3-commons-node");
const CommentV1Schema_1 = require("../data/version1/CommentV1Schema");
class CommentsCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeGetCommentsCommand());
        this.addCommand(this.makeGetCommentByIdCommand());
        this.addCommand(this.makeCreateCommentCommand());
        this.addCommand(this.makeUpdateCommentCommand());
        this.addCommand(this.makeDeleteCommentByIdCommand());
    }
    makeGetCommentsCommand() {
        return new pip_services3_commons_node_2.Command("get_comments", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_8.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.getComments(correlationId, filter, paging, callback);
        });
    }
    makeGetCommentByIdCommand() {
        return new pip_services3_commons_node_2.Command("get_comment_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('comment_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let comment_id = args.getAsString("comment_id");
            this._logic.getCommentById(correlationId, comment_id, callback);
        });
    }
    makeCreateCommentCommand() {
        return new pip_services3_commons_node_2.Command("create_comment", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('comment', new CommentV1Schema_1.CommentV1Schema()), (correlationId, args, callback) => {
            let comment = args.get("comment");
            this._logic.createComment(correlationId, comment, callback);
        });
    }
    makeUpdateCommentCommand() {
        return new pip_services3_commons_node_2.Command("update_comment", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('comment', new CommentV1Schema_1.CommentV1Schema()), (correlationId, args, callback) => {
            let comment = args.get("comment");
            this._logic.updateComment(correlationId, comment, callback);
        });
    }
    makeDeleteCommentByIdCommand() {
        return new pip_services3_commons_node_2.Command("delete_comment_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('comment_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let commentId = args.getAsNullableString("comment_id");
            this._logic.deleteCommentById(correlationId, commentId, callback);
        });
    }
}
exports.CommentsCommandSet = CommentsCommandSet;
//# sourceMappingURL=CommentsCommandSet.js.map