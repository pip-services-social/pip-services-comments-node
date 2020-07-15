"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_mongodb_node_1 = require("pip-services3-mongodb-node");
class CommentsMongoDbPersistence extends pip_services3_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('comments');
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let criteria = [];
        let ref_id = filter.getAsNullableString('ref_id');
        if (ref_id != null) {
            criteria.push({ 'refs.id': ref_id });
        }
        let ref_type = filter.getAsNullableString('ref_type');
        if (ref_type != null) {
            criteria.push({ 'refs.type': ref_type });
        }
        let parent_id = filter.getAsNullableString('parent_id');
        if (parent_id != null) {
            criteria.push({ parent_ids: { $in: [parent_id] } });
        }
        let creator_id = filter.getAsNullableString('creator_id');
        if (creator_id != null) {
            criteria.push({ 'creator_id': creator_id });
        }
        let create_time_from = filter.getAsNullableDateTime('create_time_from');
        if (create_time_from != null) {
            criteria.push({ create_time: { $gte: create_time_from } });
        }
        let create_time_to = filter.getAsNullableDateTime('create_time_to');
        if (create_time_to != null) {
            criteria.push({ create_time: { $lt: create_time_to } });
        }
        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });
        return criteria.length > 0 ? { $and: criteria } : null;
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
}
exports.CommentsMongoDbPersistence = CommentsMongoDbPersistence;
//# sourceMappingURL=CommentsMongoDbPersistence.js.map