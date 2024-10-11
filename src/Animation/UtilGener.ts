import { CMDef } from "@src/CMDefine";
import { AnimType } from "./AnimTool";


/**获取对应类型的动画变异ID */
export const getAnimTypeMutID = (charName:string,animType:AnimType)=> CMDef.genMutationID(`${charName}${animType}`);
/**获取对应类型的动画图片物品ID */
export const getAnimTypeItemID = (charName:string,animType:AnimType)=> CMDef.genGenericID(`${charName}${animType}`);
/**获取对应类型的动画图片怪物ID */
export const getAnimTypeMonID = (charName:string,animType:AnimType)=> CMDef.genMonsterID(`${charName}${animType}`);




