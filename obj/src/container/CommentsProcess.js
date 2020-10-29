"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsProcess = void 0;
const pip_services3_container_node_1 = require("pip-services3-container-node");
const CommentsServiceFactory_1 = require("../build/CommentsServiceFactory");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class CommentsProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("comments", "Comments microservice");
        this._factories.add(new CommentsServiceFactory_1.CommentsServiceFactory);
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.CommentsProcess = CommentsProcess;
//# sourceMappingURL=CommentsProcess.js.map