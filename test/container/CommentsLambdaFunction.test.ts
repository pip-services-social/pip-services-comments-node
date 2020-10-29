let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor, MultiString } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { CommentV1 } from '../../src/data/version1/CommentV1';
import { CommentsMemoryPersistence } from '../../src/persistence/CommentsMemoryPersistence';
import { CommentsController } from '../../src/logic/CommentsController';
import { CommentsLambdaFunction } from '../../src/container/CommentsLambdaFunction';
import { ReferenceV1 } from '../../src/data/version1/ReferenceV1';
import { CommentStateV1 } from '../../src';

let refs = [];
let ref1: ReferenceV1 ={
    id: '4',
    type: 'page', 
    name: 'reference page',
}
refs.push(ref1);
let COMMENT1: CommentV1 = {
    id: '1',
    deleted: false,
    comment_state: CommentStateV1.Submited,
    creator_id: '1',
    creator_name: 'Evgeniy',
    refs: refs,
};
let COMMENT2: CommentV1 = {
    id: '2',
    deleted: false,
    comment_state: CommentStateV1.Submited,
    creator_id: '2',
    creator_name: 'Tom',
    refs: refs,
};

suite('CommentsLambdaFunction', ()=> {
    let lambda: CommentsLambdaFunction;

    suiteSetup((done) => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'pip-services-comments:persistence:memory:default:1.0',
            'controller.descriptor', 'pip-services-comments:controller:default:default:1.0'
        );

        lambda = new CommentsLambdaFunction();
        lambda.configure(config);
        lambda.open(null, done);
    });
    
    suiteTeardown((done) => {
        lambda.close(null, done);
    });
    
    test('CRUD Operations', (done) => {
        var comment1, comment2: CommentV1;

        async.series([
        // Create one comment
            (callback) => {
                lambda.act(
                    {
                        role: 'comments',
                        cmd: 'create_comment',
                        comment: COMMENT1
                    },
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.creator_id, COMMENT1.creator_id);
                        assert.equal(comment.creator_name, COMMENT1.creator_name);
                        assert.equal(comment.refs[0].id, ref1.id);

                        comment1 = comment;

                        callback();
                    }
                );
            },
        // Create another comment
            (callback) => {
                lambda.act(
                    {
                        role: 'comments',
                        cmd: 'create_comment',
                        comment: COMMENT2
                    },
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.creator_id, COMMENT2.creator_id);
                        assert.equal(comment.creator_name, COMMENT2.creator_name);
                        assert.equal(comment.refs[0].id, ref1.id);

                        comment2 = comment;

                        callback();
                    }
                );
            },
        // Get all comments
            (callback) => {
                lambda.act(
                    {
                        role: 'comments',
                        cmd: 'get_comments' 
                    },
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
        // Update the comment
            (callback) => {
                comment1.creator_name = 'Robert';

                lambda.act(
                    {
                        role: 'comments',
                        cmd: 'update_comment',
                        comment: comment1
                    },
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.creator_name, 'Robert');
                        assert.equal(comment.id, COMMENT1.id);

                        comment1 = comment;

                        callback();
                    }
                );
            },
        // Delete comment
            (callback) => {
                lambda.act(
                    {
                        role: 'comments',
                        cmd: 'delete_comment_by_id',
                        comment_id: comment1.id
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete comment
            (callback) => {
                lambda.act(
                    {
                        role: 'comments',
                        cmd: 'get_comment_by_id',
                        comment_id: comment1.id
                    },
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isNull(comment || null);

                        callback();
                    }
                );
            }
        ], done);
    });
});