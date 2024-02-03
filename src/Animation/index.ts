import { DataManager } from "cdda-event";
import { BodyPartList, Flag, FlagID, Mutation, MutationID } from "cdda-schema";
import { getAnimHook, getAnimMainMutID } from "./UtilGener";
import { mergeAnime } from "./MergeAnime";
import { createAnimTool } from "./AnimTool";
import { createAnimStatus } from "./AnimStatus";
import { CMDef, GAME_PATH, TARGET_GFXPACK, getGfxPackName } from "@src/CMDefine";
import * as fs from 'fs';
import * as path from 'path';
import { JObject, UtilFT } from "@zwa73/utils";

/**基础素体变异ID */
export const BaseBodyMutId = "BaseBody" as MutationID;

export async function processAnimation(dm:DataManager,charName:string) {
    const validAnim = await mergeAnime(dm,charName);
    await createAnimTool(dm,charName,validAnim);
    await createAnimStatus(dm,charName,validAnim);
}

/**初始化贴图包设置 */
export async function initAnimation(dm:DataManager){
    //处理贴图包
    const gfxPath = path.join(GAME_PATH,'gfx',TARGET_GFXPACK);
    const gfx_name = await getGfxPackName();

    //读取贴图包设置备份 无则创建
    let tileConfig:Record<string,any>;
    if((await UtilFT.pathExists(path.join(gfxPath,'tile_config.json'))))
        tileConfig = await UtilFT.loadJSONFile(path.join(gfxPath,'tile_config.json'));
    else throw ("未找到贴图包 tile_config.json");
    //记录默认数据
    const defSet = tileConfig.tile_info[0];
    defSet.sprite_width  = defSet.width ;
    defSet.sprite_height = defSet.height;
    delete defSet.width ;
    delete defSet.height;
    delete tileConfig.tile_info;
    //寻找npc素体 并将ID改为变异素体
    let findMale = false;
    let findFemale = false;
    //let count = 0;
    const fileObjList = tileConfig["tiles-new"] as any[];
    for(const fileObj of fileObjList){
        const tilesList = (fileObj.tiles as any[]);
        //载入默认数据
        for(const key in defSet){
            if(fileObj[key] == null)
                fileObj[key] = defSet[key];
        }
        //删除ascii
        if(fileObj.ascii)
            fileObj.ascii = [];
        //替换目录名
        if(fileObj.file)
            fileObj.file = path.join('..','..','..','gfx',TARGET_GFXPACK,fileObj.file);
        fileObj.iso = undefined;
        fileObj.retract_dist_min = undefined;
        fileObj.retract_dist_max = undefined;
        //替换tiles
        fileObj.tiles = tilesList.filter(tilesObj => {
            if(tilesObj.id=="npc_female"){
                tilesObj.id = `overlay_female_mutation_${BaseBodyMutId}`
                findFemale=true;
                return true;
            }else if (tilesObj.id=="npc_male"){
                tilesObj.id = `overlay_male_mutation_${BaseBodyMutId}`
                findMale=true;
                return true;
            }
            return false;
        });
        //count++;
        //if(findMale&&findFemale) break;
    }
    //删除多余部分
    //tileConfig["tiles-new"] = (tileConfig["tiles-new"] as any[]).slice(0,count);

    if(!(findMale&&findFemale)) console.log("未找到贴图包素体");
    //设置基本属性
    tileConfig.compatibility = [gfx_name];
    tileConfig.type = "mod_tileset";
    //写入mod文件夹
    await dm.saveToFile("modgfx_tileset.json",[tileConfig]);


    //写入基础贴图配置
    await dm.saveToFile("mod_tileset.json", [{
        type: "mod_tileset",
        compatibility: [gfx_name],
        "tiles-new": [{
            file: "32xTransparent.png",
            sprite_width: 32,
            sprite_height: 32,
            sprite_offset_x: 0,
            sprite_offset_y: 0,
            pixelscale: 1,
            tiles: [
                { id: "npc_female"  , fg: 0, bg: 0 },
                { id: "npc_male"    , fg: 0, bg: 0 },
                { id: "TransparentItem", fg: 0, bg: 0 },
            ]
        }],
    }]);

    initAnimEvent(dm);
}


export const animeFlag:Flag={
    id:"has_anime" as FlagID,
    type:"json_flag",
}

function initAnimEvent(dm:DataManager){
    const out:JObject[]=[animeFlag];
    const e = CMDef.genActEoc("InitAnime",[{
        if:{and:[{not:{u_has_flag:animeFlag.id}},{not:{u_has_trait:BaseBodyMutId}}]},
        then:[{u_add_trait:BaseBodyMutId}]
    }])
    out.push(e);
    dm.addInvokeEoc("Init",0,e);
    dm.addStaticData(out,"anime_flag");
}