import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { CommentsMongoDbPersistence } from '../persistence/CommentsMongoDbPersistence';
import { CommentsFilePersistence } from '../persistence/CommentsFilePersistence';
import { CommentsMemoryPersistence } from '../persistence/CommentsMemoryPersistence';
import { CommentsController } from '../logic/CommentsController';
import { CommentsHttpServiceV1 } from '../services/version1/CommentsHttpServiceV1';

export class CommentsServiceFactory extends Factory {
	public static Descriptor = new Descriptor("pip-services-comments", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("pip-services-comments", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("pip-services-comments", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("pip-services-comments", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("pip-services-comments", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("pip-services-comments", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(CommentsServiceFactory.MemoryPersistenceDescriptor, CommentsMemoryPersistence);
		this.registerAsType(CommentsServiceFactory.FilePersistenceDescriptor, CommentsFilePersistence);
		this.registerAsType(CommentsServiceFactory.MongoDbPersistenceDescriptor, CommentsMongoDbPersistence);
		this.registerAsType(CommentsServiceFactory.ControllerDescriptor, CommentsController);
		this.registerAsType(CommentsServiceFactory.HttpServiceDescriptor, CommentsHttpServiceV1);
	}
	
}
