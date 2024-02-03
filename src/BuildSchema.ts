import { SchemaBuilder } from "cdda-schema";


async function main(){
    const builder = new SchemaBuilder();
    await builder.builSchema("tsconfig.json","./schema");
}
main()
