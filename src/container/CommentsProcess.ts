import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';

import { CommentsServiceFactory } from '../build/CommentsServiceFactory';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';
import { DefaultGrpcFactory } from 'pip-services3-grpc-node';

export class CommentsProcess extends ProcessContainer {

    public constructor() {
        super("comments", "Comments microservice");
        this._factories.add(new CommentsServiceFactory);
        this._factories.add(new DefaultRpcFactory);
        this._factories.add(new DefaultGrpcFactory);
    }

}
