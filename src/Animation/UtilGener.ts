import { CMDef } from "@src/CMDefine";
import { AnimType } from "./AnimTool";


/**获取对应类型的动画变异ID */
export const getAnimTypeMutID = (charName:string,animType:AnimType)=> CMDef.genMutationID(`${charName}${animType}`);




