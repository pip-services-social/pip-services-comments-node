import { IStringIdentifiable } from 'pip-services3-commons-node';
import { MemeV1 } from './MemeV1';
import { ReferenceV1 } from './ReferenceV1';
import { ContentV1 } from './ContentV1';

export class CommentV1 implements IStringIdentifiable {
    public id: string;
    public refs?: ReferenceV1[]; // Reference to document or documents this comment bound to
    public parent_ids?: string[]; // Ids of parent comments

    public creator_id?: string;
    public creator_name?: string;
    public create_time?: Date;

    public content?: ContentV1[]; // Content of the comment
    public memes?: MemeV1[]; // Memes or emojies
}