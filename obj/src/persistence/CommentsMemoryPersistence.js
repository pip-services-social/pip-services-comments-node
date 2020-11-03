"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsMemoryPersistence = void 0;
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_data_node_1 = require("pip-services3-data-node");
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
        let empty_parents = filter.getAsBooleanWithDefault('empty_parents', false);
        let deleted = filter.getAsNullableBoolean('deleted');
        let comment_state = filter.getAsNullableString('comment_state');
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
            if (empty_parents && item.parent_ids && item.parent_ids.length > 0)
                return false;
            if (creator_id && comment_state) {
                if (item.creator_id != creator_id && item.comment_state != comment_state)
                    return false;
            }
            else {
                if (creator_id && item.creator_id != creator_id)
                    return false;
                if (comment_state && item.comment_state != comment_state)
                    return false;
            }
            if (deleted != null && item.deleted != deleted)
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
        super.create(null, comment, (err, item) => {
            if (item != null)
                this._logger.trace(correlationId, "Create comment by %s", comment);
            else
                this._logger.trace(correlationId, "Cannot create key by %s", comment);
            callback(err, item);
        });
    }
    increment(correlationId, id, callback) {
        this.getOneById(correlationId, id, (err, item) => {
            var _a;
            if (err) {
                if (callback)
                    callback(err, item);
            }
            if (item) {
                item.children_counter = ((_a = item.children_counter) !== null && _a !== void 0 ? _a : 0) + 1;
                this.update(correlationId, item, callback);
            }
            else {
                callback(err, item);
            }
        });
    }
    decrement(correlationId, id, callback) {
        this.getOneById(correlationId, id, (err, item) => {
            var _a;
            if (err) {
                if (callback)
                    callback(err, item);
            }
            if (item) {
                item.children_counter = ((_a = item.children_counter) !== null && _a !== void 0 ? _a : 0) - 1;
                this.update(correlationId, item, callback);
            }
            else {
                callback(err, item);
            }
        });
    }
    addMeme(correlationId, id, creator_id, meme_type, callback) {
        let item = _.find(this._items, item => item.id == id);
        if (item == null) {
            this._logger.trace(correlationId, "Item %s was not found", id);
            callback(null, null);
            return;
        }
        if (!item.memes) {
            item.memes = new Array();
        }
        let memes = item.memes.filter((item) => { return item.type == meme_type; });
        if (memes.length > 0) {
            if (memes[0].creator_ids && !memes[0].creator_ids.includes(creator_id)) {
                memes[0].count += 1;
                memes[0].creator_ids.push(creator_id);
            }
            else {
                let err = new pip_services3_commons_node_1.InternalException(correlationId, 'ALREADY_EXIST', 'User is already add meme this type').withDetails("creator_id", creator_id)
                    .withDetails("meme_type", meme_type)
                    .withDetails("meme_id", item.id);
                callback(err, null);
                return;
            }
        }
        else {
            let meme = {
                type: meme_type,
                count: 1,
                creator_ids: [creator_id]
            };
            item.memes.push(meme);
        }
        this._logger.trace(correlationId, "Updated state item %s", item.id);
        this.save(correlationId, (err) => {
            callback(err, item);
        });
    }
    removeMeme(correlationId, id, creator_id, meme_type, callback) {
        let item = _.find(this._items, item => item.id == id);
        if (item == null) {
            this._logger.trace(correlationId, "Item %s was not found", id);
            callback(null, null);
            return;
        }
        if (!item.memes) {
            item.memes = new Array();
        }
        let memes = item.memes.filter((item) => { return item.type == meme_type; });
        if (memes.length > 0) {
            if (memes[0].creator_ids && memes[0].creator_ids.includes(creator_id)) {
                memes[0].count -= 1;
                let index = memes[0].creator_ids.indexOf(creator_id);
                memes[0].creator_ids.splice(index, 1);
            }
            else {
                let err = new pip_services3_commons_node_1.NotFoundException(correlationId, 'NOT_FOUND', 'Meme with this type not found for this user').withDetails("creator_id", creator_id)
                    .withDetails("meme_type", meme_type)
                    .withDetails("meme_id", item.id);
                callback(err, null);
                return;
            }
        }
        else {
            let err = new pip_services3_commons_node_1.NotFoundException(correlationId, 'NOT_FOUND', 'Meme with this type not found for this user').withDetails("creator_id", creator_id)
                .withDetails("meme_type", meme_type)
                .withDetails("meme_id", item.id);
            callback(err, null);
            return;
        }
        this._logger.trace(correlationId, "Updated state item %s", item.id);
        this.save(correlationId, (err) => {
            callback(err, item);
        });
    }
    updateState(correlationId, id, state, callback) {
        let item = _.find(this._items, item => item.id == id);
        if (item == null) {
            this._logger.trace(correlationId, "Item %s was not found", id);
            callback(null, null);
            return;
        }
        item.comment_state = state;
        this._logger.trace(correlationId, "Updated state item %s", item.id);
        this.save(correlationId, (err) => {
            callback(err, item);
        });
    }
}
exports.CommentsMemoryPersistence = CommentsMemoryPersistence;
//# sourceMappingURL=CommentsMemoryPersistence.js.map