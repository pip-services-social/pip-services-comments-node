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
import { ReferenceV1 } from '../../../src/data/version1/ReferenceV1';
import { CommentStateV1, ContentV1, MemeV1 } from '../../../src/data/version1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

let refs = [];
let ref1: ReferenceV1 ={
    id: '4',
    type: 'page', 
    name: 'reference page',
}
refs.push(ref1);

let ref2: ReferenceV1 ={
    id: '5',
    type: 'page', 
    name: 'reference page2',
}
refs.push(ref2);


let contents = [];
let content1: ContentV1 = {
    type: 'text',
    text: 'text'

}
contents.push(content1);

let memes = [];
let meme1: MemeV1 = {
    type: 'like',
    count: 1,
}
memes.push(meme1);

let COMMENT1: CommentV1 = {
    id: '1',
    deleted: false,
    comment_state: CommentStateV1.Submitted,
    creator_id: '1',
    creator_name: 'Evgeniy',
    parent_ids: [],
    refs: refs,
    create_time:  new Date("2018-07-14"),
    content: contents,
    memes: memes  
    
};
let COMMENT2: CommentV1 = {
    id: '2',
    deleted: false,
    comment_state: CommentStateV1.Submitted,
    creator_id: '2',
    creator_name: 'Tom',
    refs: refs,
    create_time:  new Date("2020-07-14"),
    parent_ids: ['1'],
};
let COMMENT3: CommentV1 = {
    id: '3',
    deleted: false,
    comment_state: CommentStateV1.Submitted,
    creator_id: '2',
    creator_name: 'Tom',
    create_time:  new Date("2022-07-14"),
    parent_ids: ['1','2'],
};
suite('CommentsHttpServiceV1', ()=> {    
    let service: CommentsHttpServiceV1;
    let rest: any;
    let persistence = new CommentsMemoryPersistence();
    suiteSetup((done) => {
        
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
    
    
    test('CommentsHttpSeviceV1', (done) => {
        let comment3;

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
                        assert.equal(comment.id, COMMENT1.id);
                        assert.equal(comment.creator_id, COMMENT1.creator_id);
                        assert.equal(comment.creator_name, COMMENT1.creator_name);
                        assert.equal(comment.refs[0].type, COMMENT1.refs[0].type);
                        //wrong format when check equal for COMMENT1.create_time 
                        assert.equal(comment.create_time, COMMENT1.create_time.toISOString());
                        assert.equal(comment.content[0].type, COMMENT1.content[0].type);
                        assert.equal(comment.memes[0].type, COMMENT1.memes[0].type);

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
                        assert.isObject(comment);
                        assert.equal(comment.creator_id, COMMENT2.creator_id);
                        assert.equal(comment.creator_name, COMMENT2.creator_name);
                        assert.equal(comment.refs[0].id, ref1.id);

                        callback();
                    }
                );
            },

        // Create another comment
            (callback) => {
                rest.post('/v1/comments/create_comment', 
                    {
                        comment: COMMENT3
                    },
                    (err, req, res, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.isObject(comment);
                        assert.equal(comment.creator_id, COMMENT3.creator_id);
                        assert.equal(comment.creator_name, COMMENT3.creator_name);
                        comment3 = comment;
                        callback();
                    }
                );
            },

       // Get comments filtered by ref_type
            (callback) => {
                rest.post('/v1/comments/get_comments', {
                    filter:{
                        ref_type: 'page'
                    }
                }, (err, req, res, result) => {
                    assert.isNull(err);
                    assert.isObject(result);
                    assert.lengthOf(result.data, 2);

                    callback();
                });
            },

        // Get comments filtered by ref_id
            (callback) => {
                rest.post('/v1/comments/get_comments', {
                    filter:{
                        ref_id: '5'
                    }
                }, (err, req, res, result) => {
                    assert.isNull(err);
                    assert.isObject(result);
                    assert.lengthOf(result.data, 2);

                    callback();
                });
            },

        // Get comments filtered by creator_id
            (callback) => {
                rest.post('/v1/comments/get_comments', {
                    filter:{
                        creator_id: '2'
                    }
                }, (err, req, res, result) => {
                    assert.isNull(err);
                    assert.isObject(result);
                    assert.lengthOf(result.data, 2);

                    callback();
                });
            },

        // Get comments filtered by parent_id №1
            (callback) => {
                rest.post('/v1/comments/get_comments', {
                    filter:{
                        parent_id: '1'
                    }
                }, (err, req, res, result) => {
                    assert.isNull(err);
                    assert.isObject(result);
                    assert.lengthOf(result.data, 2);

                    callback();
                });
            },

        // Get comments filtered by parent_id №2
            (callback) => {
                rest.post('/v1/comments/get_comments', {
                    filter:{
                        parent_id: '2'
                    }
                }, (err, req, res, result) => {
                    assert.isNull(err);

                    assert.isObject(result);
                    assert.lengthOf(result.data, 1);
                    
                    callback();
                });
            },


        // Get comments filtered by parent_ids
            (callback) => {
                rest.post('/v1/comments/get_comments', {
                    filter:{
                        parent_ids: '1,2'
                    }
                }, (err, req, res, result) => {
                        assert.isNull(err);

                        assert.isObject(result);
                        assert.lengthOf(result.data, 2);

                        callback();
                });
            },

        // Get comments filtered by create_time №1
            (callback) => {
                rest.post('/v1/comments/get_comments', {
                    filter:{
                        time_to: new Date(),
                    }
                    }, (err, req, res, result) => {
                        assert.isNull(err);

                        assert.isObject(result);
                        assert.lengthOf(result.data, 2);
                        

                        callback();
                    }
                );
            },

        // Get comments filtered by create_time №1
            (callback) => {
                rest.post('/v1/comments/get_comments', {
                    filter:{
                        time_from:  new Date("2019-07-14"),
                        time_to:  new Date("2020-07-15"),
                    }
                    }, (err, req, res, result) => {
                        assert.isNull(err);

                        assert.isObject(result);
                        assert.lengthOf(result.data, 1);

                        callback();
                    }
                );
            },

        // Get all comments and test children_counter
            (callback) => {
                rest.post('/v1/comments/get_comments',
                    {},
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);

                        assert.equal(page.data[0].children_counter, 2);
                        assert.equal(page.data[1].children_counter, 1);

                        callback();
                    }
                );
            },
            // Update the comment state
            (callback) => {

                rest.post('/v1/comments/update_comment_state',
                    { 
                        id: comment3.id,
                        state: CommentStateV1.Rejected
                    },
                    (err, req, res, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.id, COMMENT3.id);
                        assert.equal(comment.comment_state, CommentStateV1.Rejected);

                        comment3 = comment;

                        callback();
                    }
                );
            },
        // Update the comment
            (callback) => {
                comment3.creator_name = 'Valentin';

                rest.post('/v1/comments/update_comment',
                    { 
                        comment: comment3
                    },
                    (err, req, res, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.creator_name, 'Valentin');
                        assert.equal(comment.id, COMMENT3.id);

                        comment3 = comment;

                        callback();
                    }
                );
            },
        // Delete comment
            (callback) => {
                rest.post('/v1/comments/delete_comment_by_id',
                    {
                        comment_id: comment3.id
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
                        comment_id: comment3.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            },
            // get first comment
            (callback) => {
                rest.post('/v1/comments/get_comment_by_id',
                    {
                        comment_id: COMMENT1.id
                    },
                    (err, req, res, comment) => {
                        assert.isNull(err);
                        assert.isObject(comment);
                        assert.equal(comment.id, COMMENT1.id);
                        assert.equal(comment.creator_id, COMMENT1.creator_id);
                        assert.equal(comment.creator_name, COMMENT1.creator_name);
                        assert.equal(comment.refs[0].type, COMMENT1.refs[0].type);
                        assert.equal(comment.create_time, COMMENT1.create_time.toISOString());
                        assert.equal(comment.content[0].type, COMMENT1.content[0].type);
                        assert.equal(comment.memes[0].type, COMMENT1.memes[0].type);

                        assert.equal(comment.children_counter, 1);
                        callback();
                    }
                );
            },
  
        ], done);
    });
});