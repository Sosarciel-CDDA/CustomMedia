"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdda_schema_1 = require("cdda-schema");
async function main() {
    const builder = new cdda_schema_1.SchemaBuilder();
    await builder.builSchema("tsconfig.json", "./schema");
}
main();
