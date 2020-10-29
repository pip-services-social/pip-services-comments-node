"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsServiceFactory = void 0;
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const CommentsMongoDbPersistence_1 = require("../persistence/CommentsMongoDbPersistence");
const CommentsFilePersistence_1 = require("../persistence/CommentsFilePersistence");
const CommentsMemoryPersistence_1 = require("../persistence/CommentsMemoryPersistence");
const CommentsController_1 = require("../logic/CommentsController");
const CommentsHttpServiceV1_1 = require("../services/version1/CommentsHttpServiceV1");
class CommentsServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(CommentsServiceFactory.MemoryPersistenceDescriptor, CommentsMemoryPersistence_1.CommentsMemoryPersistence);
        this.registerAsType(CommentsServiceFactory.FilePersistenceDescriptor, CommentsFilePersistence_1.CommentsFilePersistence);
        this.registerAsType(CommentsServiceFactory.MongoDbPersistenceDescriptor, CommentsMongoDbPersistence_1.CommentsMongoDbPersistence);
        this.registerAsType(CommentsServiceFactory.ControllerDescriptor, CommentsController_1.CommentsController);
        this.registerAsType(CommentsServiceFactory.HttpServiceDescriptor, CommentsHttpServiceV1_1.CommentsHttpServiceV1);
    }
}
exports.CommentsServiceFactory = CommentsServiceFactory;
CommentsServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services-comments", "factory", "default", "default", "1.0");
CommentsServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-comments", "persistence", "memory", "*", "1.0");
CommentsServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-comments", "persistence", "file", "*", "1.0");
CommentsServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-comments", "persistence", "mongodb", "*", "1.0");
CommentsServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-comments", "controller", "default", "*", "1.0");
CommentsServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-comments", "service", "http", "*", "1.0");
//# sourceMappingURL=CommentsServiceFactory.js.map