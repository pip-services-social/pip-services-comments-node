import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { DocumentV1Schema } from './DocumentV1Schema';

export class ContentV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withRequiredProperty('type', TypeCode.String);
        this.withOptionalProperty('text', TypeCode.String);
        this.withOptionalProperty('loc_name', TypeCode.String);
        this.withOptionalProperty('loc_pos', null);
        this.withOptionalProperty('start', TypeCode.DateTime);
        this.withOptionalProperty('end', TypeCode.DateTime);
        this.withOptionalProperty('all_day', TypeCode.Boolean);
        this.withOptionalProperty('pic_ids', new ArraySchema(TypeCode.String));
        this.withOptionalProperty('video_url', TypeCode.String);
        this.withOptionalProperty('docs', new ArraySchema(new DocumentV1Schema()));
        this.withOptionalProperty('custom', null);
    }
}
