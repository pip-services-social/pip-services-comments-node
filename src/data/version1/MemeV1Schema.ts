import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class MemeV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withRequiredProperty('type', TypeCode.String);
        this.withOptionalProperty('count', TypeCode.Integer);
        this.withOptionalProperty('creator_ids', new ArraySchema(TypeCode.String));
    }
}
