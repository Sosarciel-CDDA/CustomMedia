import * as path from 'path';
import { Armor, BodyPartList, Mutation, ItemGroup, MutFlag } from "cdda-schema";
import { DataManager } from 'cdda-event';
import { getAnimMainMutID, getAnimTypeMutID } from './UtilGener';
import { JObject } from '@zwa73/utils';
import { getOutAnimPath, getOutAnimPathAbs } from '@src/CMDefine';
import { animeFlag } from '.';






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
        id:getAnimMainMutID(charName),
        name:`${charName}的动画变异`,
        description:`${charName}动画变异标志`,
        restricts_gear  : [...BodyPartList],
        remove_rigid    : [...BodyPartList],
        points:0,
        purifiable:false,
        valid:false,
        player_display:false,
        flags:[animeFlag.id as MutFlag]
    }
    out.push(charAnimMut);

    //动画变异
    for(const animType of vaildAnim){
        const animMut:Mutation={
            type:"mutation",
            id:getAnimTypeMutID(charName,animType),
            name:`${charName}的${animType}动画变异`,
            description:`${charName}的${animType}动画变异`,
            //integrated_armor:[animData.armorID],
            restricts_gear  : [...BodyPartList],
            remove_rigid    : [...BodyPartList],
            points:0,
            purifiable:false,
            valid:false,
            player_display:false,
        }
        out.push(animMut);
    }
    dm.addStaticData(out,path.join(getOutAnimPath(charName),"anime_tool"));
}