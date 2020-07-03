let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams, MultiString } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { CommentV1 } from '../../../src/data/version1/CommentV1';
import { CommentsMemoryPersistence } from '../../../src/persistence/CommentsMemoryPersistence';
import { CommentsController } from '../../../src/logic/CommentsController';
import { CommentsHttpServiceV1 } from '../../../src/services/version1/CommentsHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

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
    name: new MultiString({en: 'App1'}),
    product: 'Product 1',
    copyrights: 'PipDevs 2018',
    min_ver: 0,
    max_ver: 9999
};

suite('CommentsHttpServiceV1', ()=> {    
    let service: CommentsHttpServiceV1;
    let rest: any;

    suiteSetup((done) => {
        let persistence = new CommentsMemoryPersistence();
        let controller = new CommentsController();

        service = new CommentsHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-comments', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-comments', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-comments', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });
    
    
    test('CRUD Operations', (done) => {
        let comment1, comment2;

        async.series([
        // Create one comment
            (callback) => {
                rest.post('/v1/comments/create_comment',
                    {
                        comment: COMMENT1
                    },
                    (err, req, res, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.name.en, COMMENT1.name.get('en'));
                        assert.equal(comment.product, COMMENT1.product);
                        assert.equal(comment.copyrights, COMMENT1.copyrights);

                        comment1 = comment;

                        callback();
                    }
                );
            },
        // Create another comment
            (callback) => {
                rest.post('/v1/comments/create_comment', 
                    {
                        comment: COMMENT2
                    },
                    (err, req, res, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.name.en, COMMENT2.name.get('en'));
                        assert.equal(comment.product, COMMENT2.product);
                        assert.equal(comment.copyrights, COMMENT2.copyrights);

                        comment2 = comment;

                        callback();
                    }
                );
            },
        // Get all comments
            (callback) => {
                rest.post('/v1/comments/get_comments',
                    {},
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
        // Update the comment
            (callback) => {
                comment1.name.en = 'Updated Name 1';

                rest.post('/v1/comments/update_comment',
                    { 
                        comment: comment1
                    },
                    (err, req, res, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.name.en, 'Updated Name 1');
                        assert.equal(comment.id, COMMENT1.id);

                        comment1 = comment;

                        callback();
                    }
                );
            },
        // Delete comment
            (callback) => {
                rest.post('/v1/comments/delete_comment_by_id',
                    {
                        comment_id: comment1.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            },
        // Try to get delete comment
            (callback) => {
                rest.post('/v1/comments/get_comment_by_id',
                    {
                        comment_id: comment1.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            }
        ], done);
    });
});