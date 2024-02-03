import { DataManager } from "cdda-event";
import { DATA_PATH, MEDIA_PATH, OUT_PATH } from "./CMDefine";
import { initAnimation, processAnimation } from "./Animation";
import { processSoundpack } from "./Audio";
import { processImage } from "./Image";
import * as fs from 'fs';
import * as path from 'path';




async function main(){
    const CMDm = new DataManager(DATA_PATH,OUT_PATH,"CMEDIA");
    const charNameList = await fs.promises.readdir(MEDIA_PATH);
    charNameList.filter((file)=>fs.statSync(path.join(MEDIA_PATH,file)).isDirectory());
    const plist = [
        initAnimation(CMDm),
        charNameList.map((charName)=> processImage(CMDm,charName))    ,
        charNameList.map((charName)=> processAnimation(CMDm,charName)),
        charNameList.map((charName)=> processSoundpack(CMDm,charName)),
    ].flat();
    await Promise.all(plist);
    await CMDm.saveAllData();
}
main();
