"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsFilePersistence = void 0;
const pip_services3_data_node_1 = require("pip-services3-data-node");
const CommentsMemoryPersistence_1 = require("./CommentsMemoryPersistence");
class CommentsFilePersistence extends CommentsMemoryPersistence_1.CommentsMemoryPersistence {
    constructor(path) {
        super();
        this._persister = new pip_services3_data_node_1.JsonFilePersister(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }
    configure(config) {
        super.configure(config);
        this._persister.configure(config);
    }
}
exports.CommentsFilePersistence = CommentsFilePersistence;
//# sourceMappingURL=CommentsFilePersistence.js.map