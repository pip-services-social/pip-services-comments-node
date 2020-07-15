"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
class MemeV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('type', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('count', pip_services3_commons_node_3.TypeCode.Integer);
        this.withOptionalProperty('creator_ids', new pip_services3_commons_node_2.ArraySchema(pip_services3_commons_node_3.TypeCode.String));
    }
}
exports.MemeV1Schema = MemeV1Schema;
//# sourceMappingURL=MemeV1Schema.js.map