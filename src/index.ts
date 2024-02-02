import { DataManager } from "cdda-event";
import { DATA_PATH, MEDIA_PATH, OUT_PATH } from "./CMDefine";
import { createAnimation } from "./Animation";
import * as fs from 'fs';
import * as path from 'path';




async function main(){
    const CMDm = new DataManager(DATA_PATH,OUT_PATH,"CMEDIA");
    const filelist = await fs.promises.readdir(MEDIA_PATH);
    filelist.filter((file)=>fs.statSync(file).isDirectory());
    const plist = [
        ...filelist.map((charName)=>createAnimation(CMDm,charName))
    ];
    await Promise.all(plist);
    await CMDm.saveAllData();
}
main();
