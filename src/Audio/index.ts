import { OUT_SOUND_PATH, getAudioPath, getOutAnimPathAbs, getOutAudioPathAbs } from "@src/CMDefine";
import { UtilFT } from "@zwa73/utils";
import { DataManager } from "cdda-event";
import { SoundEffect, SoundEffectID, SoundEffectVariantID } from "@sosarciel-cdda/sclema";
import fs from 'fs';
import path from 'pathe';


const defineList = [
    "fire_gun"          ,//枪械射击
    "fire_gun_distant"  ,//枪械射击 远距
    "reload"            ,//枪械装弹
    "melee_hit_flesh"   ,//近战攻击肉质
    "melee_hit_metal"   ,//近战攻击金属质
    "melee_hit"         ,//近战攻击
] as const;

/**创建音效包 */
export async function processSoundpack(dm:DataManager,charName:string){
    //删除旧的音效资源
    await fs.promises.rm(getOutAudioPathAbs(charName), { recursive: true, force: true });

    //确认输出文件夹
    const outAudioPath = getOutAudioPathAbs(charName);
    await UtilFT.ensurePathExists(outAudioPath,{dir:true});

    //遍历并找出所有音效文件夹
    const inAudioPath = getAudioPath(charName);
    if(!(await UtilFT.pathExists(inAudioPath))) return;
    const inDirPathList = (await fs.promises.readdir(inAudioPath))
        .filter(fileName=> fs.statSync(path.join(inAudioPath,fileName)).isDirectory());

    //复制音效文件夹到输出
    for(const inDirPath of inDirPathList){
        const inPath = path.join(inAudioPath,inDirPath);
        const outPath = path.join(outAudioPath,inDirPath);
        await fs.promises.cp(inPath,outPath,{recursive:true});
        //找到所有子音效
        const subAudio = (await fs.promises.readdir(inPath))
            .filter(fileName=> [".ogg",".wav"].includes(path.parse(fileName).ext));

        //创建音效配置 音效id为角色名 变体id为文件夹名 内容为子文件
        const se:SoundEffect={
            type: "sound_effect",
            id: charName as SoundEffectID,
            variant: inDirPath as SoundEffectVariantID,
            volume: 100,
            files: [ ...subAudio.map( fileName =>
                    path.join('cnpc',charName,inDirPath,fileName)) ]
        }
        //根据预留武器音效字段更改ID
        //(武器id)_(类型)
        const defmatch = inDirPath.match(/^(.+?)_(.+)$/);
        if(defmatch!=null && defineList.includes(defmatch[2] as any)){
            se.id = defmatch[2] as SoundEffectID;
            se.variant = defmatch[1] as SoundEffectVariantID;
            //se.variant = (await dm.getCharData(charName)).charConfig.weapon?.id as SoundEffectVariantID;
        }
        await UtilFT.writeJSONFile(path.join(outPath,inDirPath),[se]);
    }
}