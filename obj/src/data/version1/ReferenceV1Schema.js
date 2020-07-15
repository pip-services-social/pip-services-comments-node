"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class ReferenceV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('type', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('subtype', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('name', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('parent', pip_services3_commons_node_2.TypeCode.Boolean);
    }
}
exports.ReferenceV1Schema = ReferenceV1Schema;
//# sourceMappingURL=ReferenceV1Schema.js.map