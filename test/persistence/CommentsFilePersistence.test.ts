import { ConfigParams } from 'pip-services3-commons-node';

import { CommentsFilePersistence } from '../../src/persistence/CommentsFilePersistence';
import { CommentsPersistenceFixture } from './CommentsPersistenceFixture';

suite('CommentsFilePersistence', ()=> {
    let persistence: CommentsFilePersistence;
    let fixture: CommentsPersistenceFixture;
    
    setup((done) => {
        persistence = new CommentsFilePersistence('./data/comments.test.json');

        fixture = new CommentsPersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Get with Filters', (done) => {
        fixture.testGetWithFilter(done);
    });

});