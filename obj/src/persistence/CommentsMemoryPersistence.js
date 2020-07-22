"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_data_node_1 = require("pip-services3-data-node");
const CommentV1_1 = require("../data/version1/CommentV1");
class CommentsMemoryPersistence extends pip_services3_data_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
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
            if (parent_ids && (item.parent_ids == null || !parent_ids.some(r => item.parent_ids.includes(r) == true)))
                return false;
            if (creator_id && item.creator_id != creator_id)
                return false;
            if (time_from && (item.create_time == null || pip_services3_commons_node_1.DateTimeConverter.toNullableDateTime(item.create_time) < time_from))
                return false;
            if (time_to && (item.create_time == null || pip_services3_commons_node_1.DateTimeConverter.toNullableDateTime(item.create_time) > time_to))
                return false;
            return true;
        };
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    getOneById(correlationId, id, callback) {
        let item = _.find(this._items, (item) => item.id == id);
        if (item != null)
            this._logger.trace(correlationId, "Found comment by %s", id);
        else
            this._logger.trace(correlationId, "Cannot find comment by %s", id);
        callback(null, item);
    }
    create(correlationId, comment, callback) {
        let comment_model = new CommentV1_1.CommentV1;
        super.create(null, comment, (err, item) => {
            if (item != null)
                this._logger.trace(correlationId, "Create comment by %s", comment);
            else
                this._logger.trace(correlationId, "Cannot create key by %s", comment);
            callback(err, item);
        });
    }
}
exports.CommentsMemoryPersistence = CommentsMemoryPersistence;
//# sourceMappingURL=CommentsMemoryPersistence.js.map