import * as path from 'path';
import { Mutation, MutFlag, Generic, Monster } from "@sosarciel-cdda/schema";
import { DataManager } from '@sosarciel-cdda/event';
import { getAnimTypeItemID, getAnimTypeMonID, getAnimTypeMutID } from './UtilGener';
import { JObject } from '@zwa73/utils';
import { getOutAnimPath } from '@src/CMDefine';
import { animeFlag } from '.';
import { getAnimeMutID } from '@src/Export';






/**可用的动画类型列表 */
export const AnimTypeList = ["Idle","Move","Attack"] as const;
/**动画类型 */
export type AnimType = typeof AnimTypeList[number];

/**生成某角色的动作id */
export function formatAnimName(charName:string,animType:AnimType){
    return `${charName}${animType}`
}

/**创建动画辅助工具  
 * @param charName 角色名  
 */
export async function createAnimTool(dm:DataManager,charName:string,vaildAnim:AnimType[]){
    if(vaildAnim.length<=0) return;
    const out:JObject[] = [];
    //动画变异标志
    const charAnimMut:Mutation={
        type:"mutation",
        id:getAnimeMutID(charName),
        name:`${charName}的动画变异`,
        description:`${charName}动画变异标志`,
        points:0,
        purifiable:false,
        valid:false,
        player_display:false,
        flags:[animeFlag.id as MutFlag]
    }
    out.push(charAnimMut);

    for(const animType of vaildAnim){
        //动画变异
        const animMut:Mutation={
            type:"mutation",
            id:getAnimTypeMutID(charName,animType),
            name:`${charName}的${animType}动画变异`,
            description:`${charName}的${animType}动画变异`,
            points:0,
            purifiable:false,
            valid:false,
            player_display:false,
            override_look:{
                tile_category:'monster',
                id:getAnimTypeMonID(charName,animType),
            }
        }
        //动画物品
        const animMon:Monster={
            id:getAnimTypeMonID(charName,animType),
            type:'MONSTER',
            name:`${charName}的${animType}动画图片怪物`,
            description:`${charName}的${animType}动画图片怪物`,
            symbol:'o',
            hp:1,
            volume:1,
            weight:1,
            default_faction:'human',
            speed:1,
        }
        out.push(animMut,animMon);
    }
    dm.addData(out,path.join(getOutAnimPath(charName),"anime_tool"));
}