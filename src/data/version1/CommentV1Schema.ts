import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { ReferenceV1Schema } from './ReferenceV1Schema';
import { ContentV1Schema } from './ContentV1Schema';
import { MemeV1Schema } from './MemeV1Schema';

export class CommentV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withOptionalProperty('id', TypeCode.String);
        this.withOptionalProperty('refs', new ArraySchema(new ReferenceV1Schema()));
        this.withOptionalProperty('parent_ids', new ArraySchema(TypeCode.String));
        this.withOptionalProperty('children_counter', TypeCode.Long);

        this.withRequiredProperty('comment_state', TypeCode.String);
        this.withRequiredProperty('deleted', TypeCode.Boolean);
        

        this.withOptionalProperty('creator_id', TypeCode.String);
        this.withOptionalProperty('creator_name', TypeCode.String);
        this.withOptionalProperty('create_time', TypeCode.DateTime);

        this.withOptionalProperty('content', new ArraySchema(new ContentV1Schema()));
        this.withOptionalProperty('memes', new ArraySchema(new MemeV1Schema()));
    }
}
