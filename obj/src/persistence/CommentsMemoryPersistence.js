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
    matchString(value, search) {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }
    matchSearch(item, search) {
        search = search.toLowerCase();
        if (this.matchString(item.id, search))
            return true;
        if (item.refs) {
            if (item.refs.find(i => i.id == search) != undefined)
                return true;
        }
        return false;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let ref_id = filter.getAsNullableString('ref_id');
        let ref_type = filter.getAsNullableString('ref_type');
        let parent_id = filter.getAsNullableString('parent_id');
        let creator_id = filter.getAsNullableString('creator_id');
        let create_time_from = filter.getAsNullableDateTime('create_time_from');
        let create_time_to = filter.getAsNullableDateTime('create_time_to');
        return (item) => {
            if (ref_id && (item.refs == null || item.refs.map(x => x.id).indexOf(ref_id) < 0))
                return false;
            if (ref_type && (item.refs == null || item.refs.map(x => x.type).indexOf(ref_type) < 0))
                return false;
            if (parent_id && (item.parent_ids == null || item.parent_ids.indexOf(parent_id) < 0))
                return false;
            if (creator_id && item.creator_id != creator_id)
                return false;
            if (create_time_from && (item.create_time == null || item.create_time < create_time_from))
                return false;
            if (create_time_to && (item.create_time == null || item.create_time > create_time_to))
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