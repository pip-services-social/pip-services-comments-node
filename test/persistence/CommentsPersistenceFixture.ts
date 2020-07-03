let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams, MultiString } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { CommentV1 } from '../../src/data/version1/CommentV1';

import { ICommentsPersistence } from '../../src/persistence/ICommentsPersistence';

let COMMENT1: CommentV1 = {
    id: '1',
    name: new MultiString({en: 'App1'}),
    product: 'Product 1',
    copyrights: 'PipDevs 2018',
    min_ver: 0,
    max_ver: 9999
};
let COMMENT2: CommentV1 = {
    id: '2',
    name: new MultiString({en: 'App2'}),
    product: 'Product 1',
    copyrights: 'PipDevs 2018',
    min_ver: 0,
    max_ver: 9999
};
let COMMENT3: CommentV1 = {
    id: '3',
    name: new MultiString({en: 'App3'}),
    product: 'Product 2',
    copyrights: 'PipDevs 2008',
    min_ver: 0,
    max_ver: 9999
};

export class CommentsPersistenceFixture {
    private _persistence: ICommentsPersistence;
    
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private testCreateComments(done) {
        async.series([
        // Create one comment
            (callback) => {
                this._persistence.create(
                    null,
                    COMMENT1,
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.name.get('en'), COMMENT1.name.get('en'));
                        assert.equal(comment.product, COMMENT1.product);
                        assert.equal(comment.copyrights, COMMENT1.copyrights);

                        callback();
                    }
                );
            },
        // Create another comment
            (callback) => {
                this._persistence.create(
                    null,
                    COMMENT2,
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.name.get('en'), COMMENT2.name.get('en'));
                        assert.equal(comment.product, COMMENT2.product);
                        assert.equal(comment.copyrights, COMMENT2.copyrights);

                        callback();
                    }
                );
            },
        // Create yet another comment
            (callback) => {
                this._persistence.create(
                    null,
                    COMMENT3,
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.name.get('en'), COMMENT3.name.get('en'));
                        assert.equal(comment.product, COMMENT3.product);
                        assert.equal(comment.copyrights, COMMENT3.copyrights);

                        callback();
                    }
                );
            }
        ], done);
    }
                
    testCrudOperations(done) {
        let comment1: CommentV1;

        async.series([
        // Create items
            (callback) => {
                this.testCreateComments(callback);
            },
        // Get all comments
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);

                        comment1 = page.data[0];

                        callback();
                    }
                );
            },
        // Update the comment
            (callback) => {
                //comment1.name.put('en', 'Updated Name 1');
                comment1.name = new MultiString({en: 'Updated Name 1'});

                this._persistence.update(
                    null,
                    comment1,
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        //assert.equal(comment.name.get('en'), 'Updated Name 1');
                        assert.equal(comment.id, comment1.id);

                        callback();
                    }
                );
            },
        // Delete comment
            (callback) => {
                this._persistence.deleteById(
                    null,
                    comment1.id,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete comment
            (callback) => {
                this._persistence.getOneById(
                    null,
                    comment1.id,
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isNull(comment || null);

                        callback();
                    }
                );
            }
        ], done);
    }

    testGetWithFilter(done) {
        async.series([
        // Create comments
            (callback) => {
                this.testCreateComments(callback);
            },
        // Get comments filtered by product
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        product: 'Product 1'
                    }),
                    new PagingParams(),
                    (err, comments) => {
                        assert.isNull(err);

                        assert.isObject(comments);
                        assert.lengthOf(comments.data, 2);

                        callback();
                    }
                );
            },
        // Get comments filtered by search
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        search: '1'
                    }),
                    new PagingParams(),
                    (err, comments) => {
                        assert.isNull(err);

                        assert.isObject(comments);
                        assert.lengthOf(comments.data, 2);

                        callback();
                    }
                );
            }
        ], done);
    }

}
