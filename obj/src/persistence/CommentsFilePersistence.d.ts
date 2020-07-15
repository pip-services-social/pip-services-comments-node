import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';
import { CommentsMemoryPersistence } from './CommentsMemoryPersistence';
import { CommentV1 } from '../data/version1/CommentV1';
export declare class CommentsFilePersistence extends CommentsMemoryPersistence {
    protected _persister: JsonFilePersister<CommentV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
