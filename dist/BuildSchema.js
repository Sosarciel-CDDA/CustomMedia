"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSchema = buildSchema;
const cdda_schema_1 = require("cdda-schema");
async function buildSchema() {
    const builder = new cdda_schema_1.SchemaBuilder();
    await builder.builSchema("tsconfig.json", "./schema");
}
