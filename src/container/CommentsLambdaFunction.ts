import { Descriptor } from 'pip-services3-commons-node';
import { CommandableLambdaFunction } from 'pip-services3-aws-node';
import { CommentsServiceFactory } from '../build/CommentsServiceFactory';

export class CommentsLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("comments", "Comments function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-comments', 'controller', 'default', '*', '*'));
        this._factories.add(new CommentsServiceFactory());
    }
}

export const handler = new CommentsLambdaFunction().getHandler();