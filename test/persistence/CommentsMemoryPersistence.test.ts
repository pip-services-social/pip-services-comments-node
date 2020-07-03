import { ConfigParams } from 'pip-services3-commons-node';

import { CommentsMemoryPersistence } from '../../src/persistence/CommentsMemoryPersistence';
import { CommentsPersistenceFixture } from './CommentsPersistenceFixture';

suite('CommentsMemoryPersistence', ()=> {
    let persistence: CommentsMemoryPersistence;
    let fixture: CommentsPersistenceFixture;
    
    setup((done) => {
        persistence = new CommentsMemoryPersistence();
        persistence.configure(new ConfigParams());
        
        fixture = new CommentsPersistenceFixture(persistence);
        
        persistence.open(null, done);
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