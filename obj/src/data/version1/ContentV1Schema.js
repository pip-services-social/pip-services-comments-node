"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const DocumentV1Schema_1 = require("./DocumentV1Schema");
class ContentV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('type', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('text', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('loc_name', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('loc_pos', null);
        this.withOptionalProperty('start', pip_services3_commons_node_3.TypeCode.DateTime);
        this.withOptionalProperty('end', pip_services3_commons_node_3.TypeCode.DateTime);
        this.withOptionalProperty('all_day', pip_services3_commons_node_3.TypeCode.Boolean);
        this.withOptionalProperty('pic_ids', new pip_services3_commons_node_2.ArraySchema(pip_services3_commons_node_3.TypeCode.String));
        this.withOptionalProperty('video_url', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('docs', new pip_services3_commons_node_2.ArraySchema(new DocumentV1Schema_1.DocumentV1Schema()));
        this.withOptionalProperty('custom', null);
    }
}
exports.ContentV1Schema = ContentV1Schema;
//# sourceMappingURL=ContentV1Schema.js.map