"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const ReferenceV1Schema_1 = require("./ReferenceV1Schema");
const ContentV1Schema_1 = require("./ContentV1Schema");
const MemeV1Schema_1 = require("./MemeV1Schema");
class CommentV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('refs', new pip_services3_commons_node_2.ArraySchema(new ReferenceV1Schema_1.ReferenceV1Schema()));
        this.withOptionalProperty('parent_ids', new pip_services3_commons_node_2.ArraySchema(pip_services3_commons_node_3.TypeCode.String));
        this.withOptionalProperty('creator_id', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('creator_name', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('create_time', pip_services3_commons_node_3.TypeCode.DateTime);
        this.withOptionalProperty('content', new pip_services3_commons_node_2.ArraySchema(new ContentV1Schema_1.ContentV1Schema()));
        this.withOptionalProperty('memes', new pip_services3_commons_node_2.ArraySchema(new MemeV1Schema_1.MemeV1Schema()));
    }
}
exports.CommentV1Schema = CommentV1Schema;
//# sourceMappingURL=CommentV1Schema.js.map