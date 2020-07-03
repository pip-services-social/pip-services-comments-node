import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class ReferenceV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withOptionalProperty('id', TypeCode.String);
        this.withRequiredProperty('type', TypeCode.String);
        this.withOptionalProperty('subtype', TypeCode.String);
        this.withOptionalProperty('name', TypeCode.String);
        this.withOptionalProperty('parent', TypeCode.Boolean);
    }
}
