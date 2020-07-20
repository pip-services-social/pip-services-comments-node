import { ProcessContainer } from 'pip-services3-container-node';

import { CommentsServiceFactory } from '../build/CommentsServiceFactory';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

export class CommentsProcess extends ProcessContainer {

    public constructor() {
        super("comments", "Comments microservice");
        this._factories.add(new CommentsServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }
}
