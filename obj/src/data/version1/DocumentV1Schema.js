"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentV1Schema = void 0;
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class DocumentV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('type', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('name', pip_services3_commons_node_2.TypeCode.String);
    }
}
exports.DocumentV1Schema = DocumentV1Schema;
//# sourceMappingURL=DocumentV1Schema.js.map