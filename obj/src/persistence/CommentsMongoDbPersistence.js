"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsMongoDbPersistence = void 0;
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_mongodb_node_1 = require("pip-services3-mongodb-node");
class CommentsMongoDbPersistence extends pip_services3_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('comments');
        this.ensureIndex({ 'ref.id': 1, 'ref.type': 1 });
        this.ensureIndex({ parent_ids: 1 });
        this.ensureIndex({ create_time: -1 });
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
        let empty_parents = filter.getAsBooleanWithDefault('empty_parents', false);
        if (empty_parents) {
            criteria.push({
                $or: [
                    { parent_ids: { $eq: null } },
                    { parent_ids: { $exists: false } },
                    { parent_ids: { $size: 0 } },
                ]
            });
        }
        let comment_state = filter.getAsNullableString('comment_state');
        let creator_id = filter.getAsNullableString('creator_id');
        if (comment_state != null && creator_id != null) {
            criteria.push({
                $or: [
                    { comment_state: comment_state },
                    { creator_id: creator_id }
                ]
            });
        }
        else {
            if (comment_state != null) {
                criteria.push({ comment_state: comment_state });
            }
            if (creator_id != null) {
                criteria.push({ creator_id: creator_id });
            }
        }
        let parent_id = filter.getAsNullableString('parent_id');
        if (parent_id != null) {
            criteria.push({ parent_ids: { $elemMatch: { $eq: parent_id } } });
        }
        let parent_ids = filter.getAsObject('parent_ids');
        if (_.isString(parent_ids))
            parent_ids = parent_ids.split(',');
        if (_.isArray(parent_ids))
            criteria.push({ parent_ids: { $elemMatch: { $in: parent_ids } } });
        let time_from = filter.getAsNullableDateTime('time_from');
        if (time_from != null) {
            criteria.push({ create_time: { $gte: time_from } });
        }
        let time_to = filter.getAsNullableDateTime('time_to');
        if (time_to != null) {
            criteria.push({ create_time: { $lt: time_to } });
        }
        let deleted = filter.getAsBooleanWithDefault('deleted', false);
        if (deleted) {
            criteria.push({ deleted: deleted });
        }
        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ $sort: { create_time: -1 } });
        if (criteria.length > 0) {
        }
        return criteria.length > 0 ? { $and: criteria } : null;
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    increment(correlationId, id, callback) {
        let criteria = {
            _id: id
        };
        let update = { $inc: { children_counter: 1 } };
        let options = {
            upsert: true,
            returnOriginal: false
        };
        this._collection.findOneAndUpdate(criteria, update, options, (err, result) => {
            let item = result ? this.convertToPublic(result.value) : null;
            if (err == null) {
                if (item)
                    this._logger.trace(correlationId, "Updated in %s with id = %s", this._collection, item.id);
                else
                    this._logger.trace(correlationId, "Item %s was not found", id);
            }
            if (callback)
                callback(err, item);
        });
    }
    decrement(correlationId, id, callback) {
        let criteria = {
            _id: id
        };
        let update = { $inc: { children_counter: -1 } };
        let options = {
            returnOriginal: false
        };
        this._collection.findOneAndUpdate(criteria, update, options, (err, result) => {
            let item = result ? this.convertToPublic(result.value) : null;
            if (err == null) {
                if (item)
                    this._logger.trace(correlationId, "Updated in %s with id = %s", this._collection, item.id);
                else
                    this._logger.trace(correlationId, "Item %s was not found", id);
            }
            if (callback)
                callback(err, item);
        });
    }
}
exports.CommentsMongoDbPersistence = CommentsMongoDbPersistence;
//# sourceMappingURL=CommentsMongoDbPersistence.js.map