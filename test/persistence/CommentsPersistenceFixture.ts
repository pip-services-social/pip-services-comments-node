let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams, MultiString, Reference } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { CommentV1 } from '../../src/data/version1/CommentV1';

import { ICommentsPersistence } from '../../src/persistence/ICommentsPersistence';
import { ReferenceV1 } from '../../src/data/version1/ReferenceV1';
import { ContentV1 } from '../../src/data/version1/ContentV1';
import { CommentStateV1, MemeV1 } from '../../src';


let refs = [];
const ref1: ReferenceV1 ={
    id: '4',
    type: 'page', 
    name: 'reference page',
}
refs.push(ref1);

const ref2: ReferenceV1 ={
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


const meme1: MemeV1 = {
    type: 'like',
    count: 1,
    creator_ids: ['2']
}

const  COMMENT1: CommentV1 = {
    id: '1',
    deleted: true,
    comment_state: CommentStateV1.Approved,
    creator_id: '1',
    creator_name: 'Evgeniy',
    parent_ids: ['5'],
    refs: refs,
    create_time:  new Date("2018-07-14"),
    content: contents,
    memes: [meme1]  
    
};
const COMMENT2: CommentV1 = {
    id: '2',
    deleted: false,
    comment_state: CommentStateV1.Approved,
    creator_id: '2',
    creator_name: 'Tom',
    refs: refs,
    create_time:  new Date("2020-07-14"),
    parent_ids: ['3','4'],
};
const COMMENT3: CommentV1 = {
    id: '3',
    deleted: false,
    comment_state: CommentStateV1.Submitted,
    creator_id: '2',
    creator_name: 'Tom',
    refs: refs,
    parent_ids: ['2','3'],
};

const COMMENT4: CommentV1 = {
    id: '4',
    deleted: false,
    comment_state: CommentStateV1.Submitted,
    creator_id: '3',
    creator_name: 'Eddy',
    parent_ids: [],
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
                        assert.equal(comment.id, COMMENT1.id);
                        assert.equal(comment.creator_id, COMMENT1.creator_id);
                        assert.equal(comment.creator_name, COMMENT1.creator_name);
                        assert.equal(comment.refs[0].type, COMMENT1.refs[0].type);
                        assert.equal(comment.create_time, COMMENT1.create_time);
                        assert.equal(comment.content[0].type, COMMENT1.content[0].type);
                        assert.equal(comment.memes[0].type, COMMENT1.memes[0].type);

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
                        assert.equal(comment.id, COMMENT2.id);
                        assert.equal(comment.creator_id, COMMENT2.creator_id);
                        assert.equal(comment.creator_name, COMMENT2.creator_name);

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
                        assert.equal(comment.id, COMMENT3.id);
                        assert.equal(comment.creator_id, COMMENT3.creator_id);
                        assert.equal(comment.creator_name, COMMENT3.creator_name);
                        assert.equal(comment.parent_ids[0], COMMENT3.parent_ids[0]);

                        callback();
                    }
                );
            },
            // Create yet another comment
            (callback) => {
                this._persistence.create(
                    null,
                    COMMENT4,
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.id, COMMENT4.id);
                        assert.equal(comment.creator_id, COMMENT4.creator_id);
                        assert.equal(comment.creator_name, COMMENT4.creator_name);
                        assert.equal(comment.parent_ids[0], COMMENT4.parent_ids[0]);

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
                        assert.lengthOf(page.data, 4);

                        comment1 = page.data[0];

                        callback();
                    }
                );
            },
        // Update the comment
            (callback) => {
                comment1.creator_name = 'Richard';

                this._persistence.update(
                    null,
                    comment1,
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.creator_name, 'Richard');
                        assert.equal(comment.id, comment1.id);

                        callback();
                    }
                );
            },

            // Update the state
            (callback) => {

                this._persistence.updateState(
                    null,
                    comment1.id, CommentStateV1.Rejected,
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.comment_state, CommentStateV1.Rejected);
                        assert.equal(comment.id, comment1.id);

                        callback();
                    }
                );
            },

            // // Add meme to first comment with exists memes
            // (callback) => {

            //     this._persistence.addMeme(
            //         null,
            //         COMMENT1.id, '3', MemeTypeV1.Dislike,
            //         (err, comment) => {
            //             assert.isNull(err);

            //             assert.isObject(comment);
            //             assert.equal(comment.id, comment1.id);
            //             assert.equal(comment.memes.length, 2);
            //             assert.equal(comment.memes[1].type, MemeTypeV1.Dislike)
            //             assert.equal(comment.memes[1].creator_ids.length, 1)
            //             assert.equal(comment.memes[1].count, 1)
                        
            //             callback();
            //         }
            //     );
            // },
            
            // // Add meme to first comment with exists memes
            // (callback) => {

            //     this._persistence.addMeme(
            //         null,
            //         COMMENT1.id, '1', MemeTypeV1.Like,
            //         (err, comment) => {
            //             assert.isNull(err);

            //             assert.isObject(comment);
            //             assert.equal(comment.id, comment1.id);
            //             assert.equal(comment.memes.length, 2);
            //             assert.equal(comment.memes[0].type, MemeTypeV1.Like)
            //             assert.equal(comment.memes[0].creator_ids.length, 2)
            //             assert.equal(comment.memes[0].count, 2)
                        
            //             callback();
            //         }
            //     );
            // },

            // Mark comment as deleted
            (callback) => {

                this._persistence.markAsDeleted(
                    null,
                    comment1.id,
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.deleted, true);
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
            
        // Get comments filtered by ref_type
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        ref_type: 'page'
                    }),
                    new PagingParams(),
                    (err, comments) => {
                        assert.isNull(err);

                        assert.isObject(comments);
                        assert.lengthOf(comments.data, 3);

                        callback();
                    }
                );
            },

        // Get comments filtered by ref_id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        ref_id: '5'
                    }),
                    new PagingParams(),
                    (err, comments) => {
                        assert.isNull(err);

                        assert.isObject(comments);
                        assert.lengthOf(comments.data, 3);

                        callback();
                    }
                );
            },

        // Get comments filtered by creator_id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        creator_id: '2'
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
        // Get comments filtered by parent_id №1
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        parent_id: '4'
                    }),
                    new PagingParams(),
                    (err, comments) => {
                        assert.isNull(err);

                        assert.isObject(comments);
                        assert.lengthOf(comments.data, 1);

                        callback();
                    }
                );
            },

        // Get comments filtered by parent_id №2
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        parent_id: '3'
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

        // Get comments filtered by parent_ids
        (callback) => {
            this._persistence.getPageByFilter(
                null,
                FilterParams.fromValue({
                    parent_ids: '2,5'
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
        // Get comments filtered by parent_ids
        (callback) => {
            this._persistence.getPageByFilter(
                null,
                FilterParams.fromValue({
                    deleted: true
                }),
                new PagingParams(),
                (err, comments) => {
                    assert.isNull(err);

                    assert.isObject(comments);
                    assert.lengthOf(comments.data, 1);

                    callback();
                }
            );
        },
        // Get comments filtered by parent_ids
        (callback) => {
            this._persistence.getPageByFilter(
                null,
                FilterParams.fromValue({
                    deleted: false
                }),
                new PagingParams(),
                (err, comments) => {
                    assert.isNull(err);

                    assert.isObject(comments);
                    assert.lengthOf(comments.data, 3);

                    callback();
                }
            );
        },
        // Get comments filtered by empty_parent
        (callback) => {
            this._persistence.getPageByFilter(
                null,
                FilterParams.fromValue({
                    empty_parents: true
                }),
                new PagingParams(),
                (err, comments) => {
                    assert.isNull(err);

                    assert.isObject(comments);
                    assert.lengthOf(comments.data, 1);

                    callback();
                }
            );
        },

        // Get comments filtered by create_time №1
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        time_to: new Date(),

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

        // Get comments filtered by create_time №12
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        time_from:  new Date("2019-07-14"),
                        time_to:  new Date("2020-07-15"),

                    }),
                    new PagingParams(),
                    (err, comments) => {
                        assert.isNull(err);

                        assert.isObject(comments);
                        assert.lengthOf(comments.data, 1);

                        callback();
                    }
                );
            },
            // Get comments filtered by creater_id and comment_state
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        creator_id:  '2',
                        comment_state:  CommentStateV1.Approved,

                    }),
                    new PagingParams(),
                    (err, comments) => {
                        assert.isNull(err);

                        assert.isObject(comments);
                        assert.lengthOf(comments.data, 3);

                        callback();
                    }
                );
            },
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        creator_id:  '1',
                        comment_state:  CommentStateV1.Approved,

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
        ], done);
    }
}
