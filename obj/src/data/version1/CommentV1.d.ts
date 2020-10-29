import { IStringIdentifiable } from 'pip-services3-commons-node';
import { MemeV1 } from './MemeV1';
import { ReferenceV1 } from './ReferenceV1';
import { ContentV1 } from './ContentV1';
export declare class CommentV1 implements IStringIdentifiable {
    id: string;
    refs?: ReferenceV1[];
    parent_ids?: string[];
    children_counter?: number;
    comment_state: string;
    deleted: boolean;
    creator_id?: string;
    creator_name?: string;
    create_time?: Date;
    content?: ContentV1[];
    memes?: MemeV1[];
}
