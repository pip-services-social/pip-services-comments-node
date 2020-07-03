import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class DocumentV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withRequiredProperty('type', TypeCode.String);
        this.withRequiredProperty('id', TypeCode.String);
        this.withOptionalProperty('name', TypeCode.String);
    }
}
