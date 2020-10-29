"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.CommentsLambdaFunction = void 0;
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_aws_node_1 = require("pip-services3-aws-node");
const CommentsServiceFactory_1 = require("../build/CommentsServiceFactory");
class CommentsLambdaFunction extends pip_services3_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("comments", "Comments function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('pip-services-comments', 'controller', 'default', '*', '*'));
        this._factories.add(new CommentsServiceFactory_1.CommentsServiceFactory());
    }
}
exports.CommentsLambdaFunction = CommentsLambdaFunction;
exports.handler = new CommentsLambdaFunction().getHandler();
//# sourceMappingURL=CommentsLambdaFunction.js.map