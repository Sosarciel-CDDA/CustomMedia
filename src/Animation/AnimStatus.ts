import { AnimType } from "./AnimTool";
import { DataManager, CharHook } from "@sosarciel-cdda/event";
import path from 'pathe';
import { Eoc, EocEffect } from "@sosarciel-cdda/schema";
import { CMDef, getOutAnimPath, getOutAnimPathAbs } from "@src/CMDefine";
import { getAnimTypeMutID } from "./UtilGener";
import { getAnimeMutID } from "@src/Export";


const animEventMap:Record<AnimType,CharHook|undefined>={
    Move    :"MoveStatus",
    Attack  :"TryAttack",
    Idle    :"IdleStatus",
    //Death:"Death",
} as const;

/**移除其他动作变异 */
function removeOtherAnimEoc(charName:string,animType:AnimType,vaildAnim:AnimType[]){
    const otherAnim = vaildAnim.filter(item=> item!=animType);
    if(otherAnim.length<=0) return null;
    const eoc:Eoc={
        type:"effect_on_condition",
        eoc_type: "ACTIVATION",
        id:CMDef.genEocID(charName+"_RemoveOtherAnimEoc_"+animType),
        effect:[
            ...otherAnim.map(otherAnimType=>({
                    u_lose_trait:getAnimTypeMutID(charName,otherAnimType)
                }))
        ]
    }
    return eoc;
}
/**切换动作EOC  
 * (...)=> [切换动作,删除其余动作]
 */
function changeAnimEoc(charName:string,animType:AnimType,vaildAnim:AnimType[]){
    const removeEoc = removeOtherAnimEoc(charName,animType,vaildAnim);
    if(removeEoc==null) return [];
    const eoc:Eoc={
        type:"effect_on_condition",
        eoc_type: "ACTIVATION",
        id:CMDef.genEocID(charName+"_ChangeAnimEoc_"+animType),
        effect:[
            {run_eocs:removeEoc.id},
            {u_add_trait: getAnimTypeMutID(charName,animType) },
        ],
        condition:{not:{u_has_trait: getAnimTypeMutID(charName,animType)}}
    }
    return [eoc,removeEoc];
}

/**创建动画状态机事件 */
export async function createAnimStatus(dm:DataManager,charName:string,vaildAnim:AnimType[]){
    if(vaildAnim.length<=0) return;
    const eocList:Eoc[] = [];
    //添加切换动画
    for(const mtnName in animEventMap){
        const animType = mtnName as AnimType;
        if(vaildAnim.includes(mtnName as keyof typeof animEventMap)){
            let eocs = changeAnimEoc(charName,animType,vaildAnim);
            eocList.push(...eocs);
            const eventName = animEventMap[animType];
            if(eventName!=null && eocs!=null && eocs.length>0){
                const changeEffect:EocEffect={
                    if:{u_has_trait: getAnimeMutID(charName)},
                    then:[{run_eocs:[eocs[0].id]}]
                }
                dm.addEvent(eventName,0,[changeEffect]);
            }
        }
    }
    dm.addData(eocList, path.join(getOutAnimPath(charName),'anime_status'));
}