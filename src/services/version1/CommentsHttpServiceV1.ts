import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class CommentsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/comments');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-comments', 'controller', 'default', '*', '1.0'));
    }
}